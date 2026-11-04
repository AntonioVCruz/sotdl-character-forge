import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve,relative,isAbsolute,sep} from 'node:path';
import {z} from 'zod';
import {AuditTableSchema} from '../../packages/curation/pilot-table-model';
import {ProfessionOptionSchema} from '../../packages/curation/profession-language-model';
import {ThingOutcomeSchema} from '../../packages/curation/interesting-things-model';
import {GrantProgramSchema} from '../../packages/curation/starting-equipment-model';
import {ItemReferenceSchema,PilotItemCatalogSchema} from '../../packages/curation/pilot-item-model';
import {parseCoreLocalDocument,CoreLocalDocumentSchema,type CoreLocalDocument} from '../../packages/curation/human-l0-core-local';
import {auditTableRanges,composeSelectorWeights} from '../../packages/curation/pilot-table-model';
import {canonicalJson} from './canonical-json';
import {assertSafeArtifact,redactBuyerLines} from './privacy.mjs';
import {verifyActivity1} from './verify-activity1-provenance';
import {publishConsumableArtifacts} from './human-l0-consumable-compiler';

export const CORE='sotdl:shadow-of-the-demon-lord-core';
function fail(code:string):never {throw new Error(`Core local projection: ${code}; contents omitted.`);}
const sha=(v:string|Uint8Array)=>createHash('sha256').update(v).digest('hex');
const evidenceSchema=z.object({id:z.string(),sourceId:z.string(),path:z.string(),inputSha256:z.string(),startLine:z.number().int(),endLine:z.number().int(),excerpt:z.string(),excerptSha256:z.string()}).passthrough();
const eList=z.array(evidenceSchema);
const closureSchema=z.object({tables:z.array(AuditTableSchema),evidence:eList,links:z.array(z.object({id:z.string(),from:z.string(),to:z.string(),kind:z.string(),instruction:z.string(),applicability:z.string(),automaticExecution:z.literal(false)}).passthrough()),reviewedSideRollRules:z.array(z.unknown())}).passthrough();
type Inputs={closure:unknown;professions:unknown;wealth:unknown;things:unknown;items:unknown;matrix:unknown;pilot:unknown};
export type CoreProjectionInputs=Inputs;

/** Project exact local structured facts; text is retained only in the ignored local output. */
export function projectCoreLocal(input:Inputs,pins:CoreLocalDocument['inputs']) {
  const c=closureSchema.parse(input.closure);
  const p=z.object({options:z.array(ProfessionOptionSchema),developmentGrantTemplates:z.array(z.unknown()),evidence:eList,
    languageOptions:z.array(z.object({id:z.string(),label:z.string(),defaultAbilities:z.array(z.literal('speak')),evidenceIds:z.array(z.string())}).passthrough()),
    startingRights:z.object({core:CoreLocalDocumentSchema.shape.startingRights}).passthrough(),
  }).passthrough().parse(input.professions);
  const w=z.object({programs:z.array(GrantProgramSchema),evidence:eList,lifestylePrograms:z.array(z.object({procedure:z.string(),lifestyle:z.string(),programId:z.string()}).strict()),extraPrograms:z.array(z.object({trigger:z.string(),programId:z.string(),condition:z.unknown().optional()}).strict())}).passthrough().parse(input.wealth);
  const th=z.object({catalog:z.object({tables:z.array(z.object({id:z.string(),outcomes:z.array(ThingOutcomeSchema)}).passthrough())}).passthrough(),evidence:eList,
    grants:z.array(z.object({id:z.string(),count:z.number(),additional:z.boolean(),evidenceId:z.string()}).passthrough())}).passthrough().parse(input.things);
  const items=z.object({catalog:PilotItemCatalogSchema,evidence:eList}).passthrough().parse(input.items);
  const pilot=z.object({evidence:eList}).passthrough().parse(input.pilot);
  const matrix=z.object({records:z.array(z.object({id:z.string(),kind:z.string(),disposition:z.string(),represents:z.number()}).passthrough())}).passthrough().parse(input.matrix);
  const tables=c.tables.filter(t=>t.sourceId===CORE&&t.id.startsWith('core:'));
  const professions=p.options.filter(o=>o.sourceFamily==='core'),things=th.catalog.tables.filter(t=>t.id.startsWith('core:')).flatMap(t=>t.outcomes);
  const programIds=new Set(w.lifestylePrograms.filter(p=>p.procedure==='core').map(p=>p.programId));
  for(const extra of w.extraPrograms.filter(e=>e.trigger.startsWith('core:'))) {if(extra.condition!==undefined)fail('unprojected-core-condition');programIds.add(extra.programId);}
  const programs=w.programs.filter(p=>programIds.has(p.id));
  const templates=p.developmentGrantTemplates.filter(t=>!!t&&typeof t==='object'&&'sourceId'in t&&t.sourceId===CORE);
  const references=items.catalog.references.filter(r=>r.sourceId===CORE&&(programIds.has(r.originId)||things.some(t=>t.id===r.originId)));
  const initial=th.grants.find(g=>g.id==='core-initial-thing');if(!initial)fail('initial-thing-missing');
  const evidence=new Map<string,z.infer<typeof evidenceSchema>>();
  for(const e of [...c.evidence,...p.evidence,...w.evidence,...th.evidence,...items.evidence,...pilot.evidence]) {
    const old=evidence.get(e.id);
    if(old&&(old.path!==e.path||old.excerptSha256!==e.excerptSha256))fail('evidence-identity-conflict');
    evidence.set(e.id,e);
  }
  const used=new Set<string>();const use=(ids:string[])=>{ids.forEach(id=>used.add(id));return ids;};
  const projected=tables.map(t=>({id:t.id,sourceId:t.sourceId,dice:t.dice!,activation:t.activation,manualMode:t.manualMode,
    columns:t.streams.map(s=>{
      const audit=auditTableRanges(t.dice,s.rows);if(!audit.complete)fail('incomplete-core-stream');
      return {id:s.id,rollId:`${t.id}#${s.id}`,rows:s.rows.map(r=>{
        const bindings:CoreLocalDocument['tables'][number]['columns'][number]['rows'][number]['bindings']=[];
        const profession=professions.find(p=>p.id===r.id),thing=things.find(o=>o.id===r.id);
        if(profession)bindings.push({kind:'profession',refId:profession.id,pending:profession.specialization!=='none'?'profession-specialization':profession.literacy?'language-choice':null});
        else if(thing)bindings.push({kind:'interesting-thing',refId:thing.id,pending:'source-adjudication'});
        else if(t.id==='core:profession-router'||t.id==='core:thing-router') {
          if(!tables.some(child=>child.id===r.text))fail('router-target-missing');
          bindings.push({kind:'subtable',refId:r.text,pending:null});
        } else if(t.id==='core:wealth') {
          const kit=w.lifestylePrograms.find(p=>p.procedure==='core'&&r.id===`core:wealth:${p.lifestyle}`);if(!kit)fail('wealth-kit-missing');
          bindings.push({kind:'lifestyle-kit',refId:kit.programId,pending:'material-handler'});
        } else if(t.id==='core:human-background') {
          // Preserve the whole result until all state/story/conditional semantics have a handler.
          bindings.push({kind:'background-review',refId:null,pending:'background-consequence-review'});
          for(const raw of templates){const template=CoreLocalDocumentSchema.shape.templates.element.parse(raw);if(template.result===r.min)bindings.push({kind:'background-template',refId:template.id,pending:'language-choice'});}
          const extra=w.extraPrograms.find(e=>e.trigger===`core:human-background:${r.min}`);
          if(extra)bindings.push({kind:'background-program',refId:extra.programId,pending:'material-handler'});
        } else bindings.push({kind:t.id==='core:human-build'?'manual-dimension':'narrative',refId:null,pending:t.id==='core:human-build'?'dimension-input':null});
        const weight=audit.weights.find(w=>w.rowId===r.id)!;
        return {id:r.id,min:r.min,max:r.max,text:r.text,evidenceIds:use(r.evidenceIds),weight:{ways:weight.ways,denominator:weight.denominator},bindings};
      })};
    })}));
  for(const t of tables)use(t.evidenceIds);
  const languageOptions=p.languageOptions.map(l=>({id:`language:${l.id}`,label:l.label,defaultAbilities:l.defaultAbilities,evidenceIds:use(l.evidenceIds)}));
  const openLanguages=['language:dead-languages','language:secret-language'];
  for(const x of [...professions,...things,...programs,...references])use(x.evidenceIds);
  for(const t of templates)use(CoreLocalDocumentSchema.shape.templates.element.parse(t).evidenceIds);
  use([initial.evidenceId]);
  const sideRules=c.reviewedSideRollRules.filter(r=>!!r&&typeof r==='object'&&'tableId'in r&&r.tableId==='core:human-background');
  for(const r of sideRules)use(CoreLocalDocumentSchema.shape.backgroundSideRolls.element.parse(r).evidenceIds);
  const coreRows=matrix.records.filter(r=>r.disposition==='lote-core');
  const links=coreRows.filter(r=>r.kind==='link').map(r=>{
    const l=c.links.find(l=>l.id===r.id);if(!l)fail('matrix-link-missing');
    const from=tables.find(t=>t.id===l.from);if(!from||!tables.some(t=>t.id===l.to))fail('core-link-target-missing');
    return {id:l.id,from:l.from,to:l.to,kind:l.kind,instruction:l.instruction,applicability:l.applicability,evidenceIds:use(from.evidenceIds),automaticExecution:false};
  });
  const queries=[{id:'query:profession-faces:core',kind:'selector-result',tableId:'core:profession-router',columnId:'main',extraDice:false},
    {id:'query:starting-lifestyle:core',kind:'prior-result',tableId:'core:wealth',columnId:'main',extraDice:false}];
  const coverage=coreRows.map(r=>{
    let bindings:string[]=[r.id];let status:'projected'|'expanded-local-group'|'manual'='projected';
    if(r.id.endsWith(':*')){bindings=professions.filter(p=>p.id.startsWith(r.id.slice(0,-1))&&!coreRows.some(known=>known.id===p.id)).map(p=>p.id);status='expanded-local-group';if(bindings.length!==r.represents)fail('group-count-mismatch');}
    else if(openLanguages.includes(r.id))status='manual';
    return {matrixId:r.id,bindings,status};
  });
  const stateMentions=projected.find(t=>t.id==='core:human-background')!.columns[0].rows.flatMap(r=>
    [...r.text.matchAll(/\b(\d+d\d+|\d+)\s+(Insanity|Corruption)\b/gi)].map(m=>({rowId:r.id,amount:m[1],target:m[2].toLowerCase(),applied:false,pending:'background-consequence-review'})));
  const selectedEvidence=[...used].sort().map(id=>{
    const e=evidence.get(id);if(!e||e.sourceId!==CORE)fail('core-evidence-missing');
    return {id:e.id,sourceId:e.sourceId,path:e.path,inputSha256:e.inputSha256,startLine:e.startLine,endLine:e.endLine,excerptSha256:e.excerptSha256};
  });
  const document=parseCoreLocalDocument({contract:'sotdl.human-l0.consumable',contractVersion:'1.1.0',lot:'core',distribution:'local',fictionalData:false,
    reviewStatus:'needs-review',rulesetEnabled:false,importablePack:false,exportEnabled:false,sourceId:CORE,publicationVersion:null,
    tables:projected,queries,links,professions,things,programs,templates,materialReferences:references,languageOptions,openLanguages,startingRights:p.startingRights.core,
    coreInitialThing:{id:initial.id,count:initial.count,additional:initial.additional,evidenceId:initial.evidenceId},
    interestingThingsPolicy:{defaultVariant:'oddities',coreIsExplicitAlternative:true,disabledSource:'pending-no-silent-fallback'},
    backgroundSideRolls:sideRules,backgroundStateMentions:stateMentions,evidence:selectedEvidence,inputs:pins,coverage});
  if(document.tables.length!==22||document.tables.reduce((s,t)=>s+t.columns.length,0)!==23||document.professions.length!==102||document.things.length!==120||coverage.length!==260)fail('core-inventory-mismatch');
  const selectorWeights=['core:profession-router','core:thing-router'].map(id=>({tableId:id,weights:composeSelectorWeights(id,tables)}));
  return {document,selectorWeights,evidencePayloads:[...used].map(id=>evidence.get(id)!)};
}

/** Source-bound acceptance: valid hashes/schema alone cannot certify a changed result or omitted obligation. */
export function validateCoreLocalProjection(document:unknown,input:Inputs,pins:CoreLocalDocument['inputs']) {
  const parsed=parseCoreLocalDocument(document),expected=projectCoreLocal(input,pins).document;
  if(canonicalJson(parsed)!==canonicalJson(expected))fail('source-projection-mismatch');
  return parsed;
}

const PATHS={closure:'curation/pilot/table-closure.json',professions:'curation/pilot/professions-languages.json',wealth:'curation/pilot/wealth-equipment.json',things:'curation/pilot/interesting-things.json',items:'curation/pilot/items.json',matrix:'docs/matriz-lacunas-issue34-atividade1.json',pilot:'curation/pilot/core-level-zero.json'} as const;
export async function buildCoreLocal(root=process.cwd()) {
  const verification=await verifyActivity1(root);
  const inputs={} as Inputs,pins:CoreLocalDocument['inputs']=[];
  for(const [key,path] of Object.entries(PATHS)) {const bytes=await readFile(resolve(root,path));pins.push({path,sha256:sha(bytes)});inputs[key as keyof Inputs]=JSON.parse(bytes.toString('utf8'));}
  for(const path of ['tools/curation/core-local-projector.ts','tools/curation/core-local.mjs','packages/curation/human-l0-core-local.ts','tools/curation/human-l0-consumable-compiler.ts'])
    pins.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const result=projectCoreLocal(inputs,pins),cache=new Map<string,Buffer>();
  validateCoreLocalProjection(result.document,inputs,pins);
  for(const e of result.evidencePayloads) {
    const rel=relative(resolve(root),resolve(root,e.path));
    if(isAbsolute(rel)||rel==='..'||rel.startsWith(`..${sep}`))fail('evidence-outside-workspace');
    if(!cache.has(e.path))cache.set(e.path,await readFile(resolve(root,e.path)));
    const bytes=cache.get(e.path)!;if(sha(bytes)!==e.inputSha256)fail('evidence-source-bytes');
    const excerpt=redactBuyerLines(bytes.toString('utf8').split(/\r\n|\n|\r/).slice(e.startLine-1,e.endLine).join('\n'));
    if(sha(excerpt)!==e.excerptSha256||excerpt!==e.excerpt)fail('evidence-excerpt-mismatch');
  }
  const d=result.document,bindings=d.tables.flatMap(t=>t.columns.flatMap(c=>c.rows.flatMap(r=>r.bindings)));
  const report={schemaVersion:1,reviewDate:'2026-11-03',reviewer:'Codex',scope:'core-local-projection-and-reference-verification',status:'passed-with-explicit-application-pendings',
    sourceId:CORE,contractVersion:'1.1.0',verification,inputs:pins,documentSha256:sha(canonicalJson(d)),
    counts:{tables:d.tables.length,streams:d.tables.reduce((s,t)=>s+t.columns.length,0),rows:d.tables.reduce((s,t)=>s+t.columns.reduce((s,c)=>s+c.rows.length,0),0),professions:d.professions.length,things:d.things.length,
      programs:d.programs.length,queries:d.queries.length,links:d.links.length,materialReferences:d.materialReferences.length,evidence:d.evidence.length,expandedProfessionOptions:d.coverage.filter(r=>r.status==='expanded-local-group').reduce((s,r)=>s+r.bindings.length,0),matrixRecords:d.coverage.length},
    pendingBindings:bindings.filter(b=>b.pending!==null).length,selectorWeights:result.selectorWeights,
    gates:{fictionalData:false,distribution:'local',reviewStatus:'needs-review',rulesetEnabled:false,exportEnabled:false,pdfInspected:false,fullSemanticAcceptance:false},
    pending:['background-complete-consequence-handlers','language-and-specialization-choices','material-and-interesting-thing-application','build-dimensions','full-procedure-and-source-distribution-review']};
  const artifacts=new Map([['bundle.json',canonicalJson(d)],['index.json',canonicalJson({tables:d.tables.map(t=>t.id),professions:d.professions.map(p=>p.id),coverage:d.coverage})],['report.json',canonicalJson(report)]]);
  for(const [path,text] of artifacts)assertSafeArtifact(path,text);
  return {document:d,report,artifacts};
}
export async function main(args:string[],root=process.cwd()) {
  if(args.length!==1||!['--write','--check'].includes(args[0]))fail('use-write-or-check');
  const a=await buildCoreLocal(root),b=await buildCoreLocal(root);
  if(canonicalJson([...a.artifacts])!==canonicalJson([...b.artifacts]))fail('non-deterministic');
  // Same immutable-directory writer, with its fixed three artifact names and local-only destination gate.
  await publishConsumableArtifacts(root,'tmp/curation/core-real/1.1.0',a,args[0]==='--check');
  console.log(`Core local 1.1.0: ${a.report.counts.tables} tables, ${a.report.counts.streams} streams, ${a.report.counts.rows} rows, ${a.report.counts.professions} professions, ${a.report.counts.evidence} evidence ranges checked; application pending; ${args[0]}.`);
}
