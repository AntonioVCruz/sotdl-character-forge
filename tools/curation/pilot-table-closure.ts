import { assertSafeArtifact } from './privacy.mjs';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {buildArtifacts as buildItems} from './pilot-items-formalizer';
import {AuditTableSchema,auditTableRanges,composeSelectorWeights,type AuditRow} from '../../packages/curation/pilot-table-model';
import {explicitRanges,numericOnlyIds,findingDispositions} from './pilot-table-ranges';

const DATA='curation/pilot/table-closure.json',REPORT='curation/reports/table-closure.json';
const CORRECTION='curation/corrections/only-human-fears-desires-2026-10-27/tables.txt',CORRECTION_MANIFEST='curation/corrections/only-human-fears-desires-2026-10-27/manifest.json';
const CORRECTION_HASH='1623f63a467016cb940701c088bf4647fa43a9eb730b6817d905e9586113184f';
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const lifestyles=['destitute','poor','getting-by','comfortable','wealthy','rich'];
const slug=(s:string)=>s.toLowerCase().replaceAll(' ','-');
export async function buildArtifacts(root:string){
  const upstream=await buildItems(root);
  for(const[path,text]of upstream.artifacts)if(await readFile(resolve(root,path),'utf8')!==text)throw new Error(`Stale CUR-020 dependency: ${path}`);
  const read=async(path:string)=>JSON.parse(await readFile(resolve(root,path),'utf8'));
  const inventory=await read('curation/pilot/creation-table-inventory.json'),professions=await read('curation/pilot/professions-languages.json'),wealth=await read('curation/pilot/wealth-equipment.json'),things=await read('curation/pilot/interesting-things.json'),pilot=await read('curation/pilot/core-level-zero.json');
  const evidence=new Map<string,any>([...upstream.formalization.evidence,...inventory.instructionEvidence,...pilot.evidence].map(e=>[e.id,e]));
  for(const table of inventory.tables)evidence.set(table.evidence.id,table.evidence);
  const correctionBytes=await readFile(resolve(root,CORRECTION)),correctionManifest=await read(CORRECTION_MANIFEST);
  if(sha(correctionBytes)!==CORRECTION_HASH||correctionManifest.sha256!==CORRECTION_HASH||correctionManifest.path!==CORRECTION)throw new Error('Fears/Desires confirmation changed');
  const correctionLines=correctionBytes.toString('utf8').trimEnd().split(/\r?\n/);
  const tables:ReturnType<typeof AuditTableSchema.parse>[]=[],lookups:any[]=[],parseIssues:any[]=[];
  const rowsFromText=(table:any):AuditRow[]=>{
    const specs=explicitRanges(table.id),lines=table.evidence.excerpt.split('\n');
    const matches=[...lines.entries()].flatMap(([i,text])=>{
      // Pinned continuation of result 4, not a second result 1.
      if(table.id==='only-human:major-setback'&&table.evidence.startLine+i===13980){if(!text.startsWith('1 Corruption.'))throw new Error('Major Setback continuation changed');return [];}
      const m=text.match(/^(\d+)(?:[–−-](\d+))?(?: (or less|or more))?(?=\s|$)\s*(.*)$/);if(!m)return [];
      const min=m[3]==='or less'?null:Number(m[1]),max=m[3]==='or more'?null:Number(m[2]??m[1]);
      return specs.some(([lo,hi])=>lo===min&&hi===max)?[{i,min,max,body:m[4]}]:[];
    });
    const rows:AuditRow[]=[];
    for(let n=0;n<matches.length;n++){
      const m=matches[n],end=matches[n+1]?.i??lines.length;
      rows.push({id:`${table.id}:r${m.min??'lower'}`,min:m.min,max:m.max,text:[m.body,...lines.slice(m.i+1,end)].join('\n').trim(),evidenceIds:[table.evidence.id]});
    }
    for(const [lo,hi]of specs)if(rows.filter(r=>r.min===lo&&r.max===hi).length!==1)parseIssues.push({tableId:table.id,range:[lo,hi],reason:'Expected published range missing or duplicated; automatic interpretation disabled.'});
    return rows;
  };
  const numeric=(id:string,min:number|null,max:number|null,text:string,refs:string[]):AuditRow=>({id,min,max,text,evidenceIds:refs});
  for(const table of inventory.tables){
    const base={id:table.id,sourceId:table.sourceId,evidenceIds:[table.evidence.id,...(table.contextEvidenceIds??[])],kind:'random',dice:table.dice,streams:[],lookupKeys:[],
      activation:table.activation,manualMode:table.manualMode,
      modifierPolicy:table.id==='only-human:childhood'?'family-childhood':table.id==='only-human:lifestyle'?'life-lifestyle':'none',application:'reference-only-manual-effects',automaticGeneration:false,reviewNotes:[]};
    let streams:any[]=[];
    if(!table.dice){
      const lines=table.evidence.excerpt.split('\n'),starts=lines.flatMap((text:string,i:number)=>/^(Destitute|Poor|Getting By|Comfortable|Wealthy|Rich)(?:\s|$)/.test(text)?[i]:[]);
      const rows=starts.map((start:number,i:number)=>{const text=lines.slice(start,starts[i+1]??lines.length).join('\n'),match=text.match(/^(Destitute|Poor|Getting By|Comfortable|Wealthy|Rich)\s*(.*)$/s)!;return {key:slug(match[1]),text:match[2],evidenceIds:[table.evidence.id]};});
      if(JSON.stringify(rows.map((r:any)=>r.key))!==JSON.stringify(lifestyles))throw new Error(`Incomplete lifestyle lookup: ${table.id}`);
      lookups.push({tableId:table.id,rows,selector:'same-starting-lifestyle',extraDice:false});tables.push(AuditTableSchema.parse({...base,kind:'lookup',dice:null,lookupKeys:lifestyles}));continue;
    }
    const options=professions.options.filter((o:any)=>o.tableId===table.id);
    if(options.length)streams=[{id:'main',association:'verified-transcription',rows:options.map((o:any)=>numeric(o.id,o.range.min,o.range.max,o.sourceText,o.evidenceIds))}];
    else if(table.id==='core:wealth')streams=[{id:'main',association:'verified-transcription',rows:pilot.wealthScope.ranges.map((r:any)=>numeric(`core:wealth:${slug(r.lifestyle)}`,r.min,r.max,r.lifestyle,[r.evidenceId]))}];
    else if(table.id==='only-human:lifestyle')streams=[{id:'main',association:'verified-transcription',rows:wealth.lifestyleRules.expandedRanges.map((r:any)=>numeric(`only-human:lifestyle:${r.lifestyle}`,r.min,r.max,r.lifestyle,[table.evidence.id]))}];
    else if(table.id==='core:role-traits'){
      const rows=table.evidence.excerpt.split('\n').flatMap((text:string)=>{const m=text.match(/^(\d+)\s+(\S+)\s+(\S+)$/);return m?[{face:Number(m[1]),positive:m[2],negative:m[3]}]:[];});
      streams=['positive','negative'].map(column=>({id:column,association:'verified-transcription',rows:rows.map((r:any)=>numeric(`${table.id}:${column}:${r.face}`,r.face,r.face,r[column],[table.evidence.id]))}));
    }else if(['only-human:fears','only-human:desires'].includes(table.id)){
      const title=table.id.endsWith('fears')?'Fears':'Desires',start=correctionLines.indexOf(title);
      if(start<0||correctionLines[start+1]!==`1d6 ${title==='Fears'?'Fear':'Value'}`)throw new Error('Invalid confirmed table header');
      const excerpt=correctionLines.slice(start,start+8).join('\n'),ref=`confirmation:${table.id}`;
      evidence.set(ref,{id:ref,path:CORRECTION,sourceId:table.sourceId,startLine:start+1,endLine:start+8,inputSha256:CORRECTION_HASH,excerpt,excerptSha256:sha(excerpt),
        medium:'text',origin:'Explicit user transcription confirming numbered columns',physicalPdfPage:null,printedPageVerified:null});
      base.evidenceIds.unshift(ref);
      const rows=correctionLines.slice(start+2,start+8).map((text,i)=>{const match=text.match(/^(\d) (.+)$/);if(!match||Number(match[1])!==i+1)throw new Error('Confirmed d6 numbering changed');
        return numeric(`${table.id}:${i+1}`,i+1,i+1,match[2],[ref,table.evidence.id]);});
      streams=[{id:'main',association:'verified-transcription',rows}];
    }else if(numericOnlyIds.has(table.id))streams=[{id:'main',association:'reconstructed-text',rows:rowsFromText(table)}];
    else if(['core:profession-router','only-human:profession-router'].includes(table.id))streams=[];
    else if(table.id==='core:thing-router'){
      const v=things.catalog.variants.find((v:any)=>v.id==='core');streams=[{id:'main',association:'verified-transcription',rows:v.routes.map((r:any)=>numeric(`${table.id}:${r.min}`,r.min,r.max,r.tableId,v.selectorEvidenceIds))}];
    }else{
      const t=things.catalog.tables.find((t:any)=>t.id===table.id);if(!t)throw new Error(`Unaccounted pilot table: ${table.id}`);
      streams=[{id:'main',association:'verified-transcription',rows:t.outcomes.map((o:any)=>numeric(o.id,o.face,o.face,o.text,o.evidenceIds))}];
    }
    // Both profession routers use their own six published categories and child dice.
    if(['core:profession-router','only-human:profession-router'].includes(table.id)){
      const children=table.id.startsWith('core:')?['academic','common','criminal','martial','religious','wilderness'].map(k=>`core:profession-${k}`):['scholarship','common','criminal','military','religious','wilderness'].map(k=>`only-human:${k}`);
      streams=[{id:'main',association:'verified-transcription',rows:children.map((child,i)=>numeric(`${table.id}:${i+1}`,i+1,i+1,child,[table.evidence.id]))}];
    }
    tables.push(AuditTableSchema.parse({...base,kind:table.id==='core:role-traits'?'multi-column':'random',streams}));
  }
  const odd=things.catalog.variants.find((v:any)=>v.id==='oddities');
  tables.push(AuditTableSchema.parse({id:odd.selectorId,sourceId:odd.sourceId,evidenceIds:odd.selectorEvidenceIds,activation:'once-per-Interesting-Thing-grant',manualMode:'manual-reference-selection-source-procedure-preserved',kind:'random',dice:{count:1,sides:20},streams:[{id:'main',association:'verified-transcription',
    rows:odd.routes.map((r:any)=>numeric(`${odd.selectorId}:${r.min}`,r.min,r.max,r.tableId,odd.selectorEvidenceIds))}],lookupKeys:[],modifierPolicy:'none',application:'reference-only-manual-effects',automaticGeneration:false,reviewNotes:[]}));
  for(const t of things.catalog.tables.filter((t:any)=>t.sourceId===odd.sourceId))tables.push(AuditTableSchema.parse({id:t.id,sourceId:t.sourceId,evidenceIds:t.evidenceIds,activation:'only-if-selected-by-Interesting-Things-router',manualMode:'manual-reference-selection-source-procedure-preserved',kind:'random',dice:t.dice,
    streams:[{id:'main',association:'verified-transcription',rows:t.outcomes.map((o:any)=>numeric(o.id,o.face,o.face,o.text,o.evidenceIds))}],lookupKeys:[],modifierPolicy:'none',application:'reference-only-manual-effects',automaticGeneration:false,reviewNotes:[]}));
  const ids=new Set(tables.map(t=>t.id));if(ids.size!==74||tables.length!==74)throw new Error('Pilot table closure requires 74 unique table identities');
  const audits=tables.flatMap(t=>t.streams.map(s=>({tableId:t.id,streamId:s.id,association:s.association,...auditTableRanges(t.dice,s.rows)})));
  const selectorAudits=['core:profession-router','only-human:profession-router','core:thing-router','oddities:thing-router'].map(id=>({tableId:id,weights:composeSelectorWeights(id,tables)}));
  const links=inventory.links.map((l:any,i:number)=>({...l,id:`pilot-link:${i+1}`,to:l.to==='core:thing-router'&&['initial-result','additional-result'].includes(l.kind)?'selected:interesting-things-router':l.to,
    sourceInstruction:l.instruction,instruction:l.from==='only-human:piety'&&l.to==='only-human:religion'?'Each Piety result 3 directs a Religious Beliefs roll, followed by another Piety roll; retain apparent and actual belief history.':l.instruction,
    applicability:'source instruction, conditional activation and subject tracking required',automaticExecution:false}));
  for(const variant of things.catalog.variants)for(const route of variant.routes)if(!links.some((l:any)=>l.from===variant.selectorId&&l.to===route.tableId))links.push({id:`pilot-link:${links.length+1}`,from:variant.selectorId,to:route.tableId,kind:'selector',instruction:`${route.min}–${route.max}: ${route.tableId}`,
    startLine:null,endLine:null,applicability:'selected Interesting Things variant only',automaticExecution:false});
  const sideRollMentions=tables.flatMap(t=>t.streams.flatMap(s=>s.rows.flatMap(r=>[...r.text.matchAll(/\b(\d*)d(\d+)(?:\s*([+−–-])\s*(\d+))?/g)].map((m,i)=>({id:`${r.id}:dice-mention:${i+1}`,tableId:t.id,streamId:s.id,rowId:r.id,
    expression:m[0],count:Number(m[1]||1),sides:Number(m[2]),modifier:(['-','−','–'].includes(m[3])?-1:1)*Number(m[4]??0),evidenceIds:r.evidenceIds,
    role:'contextual-mention-not-an-executable-command',automaticExecution:false})))));
  const dispositions=inventory.findings.map((f:any)=>({...f,...findingDispositions[f.id]}));
  if(dispositions.some((f:any)=>!f.status))throw new Error('Inventory finding without a disposition');
  for(const table of tables)for(const id of [...table.evidenceIds,...table.streams.flatMap(s=>s.rows.flatMap(r=>r.evidenceIds))])if(!evidence.has(id))throw new Error(`Unresolved table evidence ${id}`);
  for(const link of links)if(!ids.has(link.from)||!ids.has(link.to)&&link.to!=='selected:interesting-things-router')throw new Error('Unresolved audited link');
  const inputRefs=[];for(const path of ['curation/pilot/items.json','curation/reports/pilot-items.json','curation/pilot/creation-table-inventory.json','curation/pilot/professions-languages.json','curation/pilot/wealth-equipment.json','curation/pilot/interesting-things.json',
    CORRECTION,CORRECTION_MANIFEST,'tools/curation/pilot-table-closure.ts','tools/curation/pilot-table-ranges.ts','tools/curation/pilot-tables.mjs','packages/curation/pilot-table-model.ts'])inputRefs.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const formalization={schemaVersion:1,task:'CUR-021',reviewDate:'2026-10-27',status:'audit-complete-with-explicit-application-gates',
    gates:{importablePack:false,runtimeIntegrated:false,officialGenerationEnabled:false,mechanicalHandlersImplemented:false},tables,audits,selectorAudits,lookups,links,parseIssues,sideRollMentions,dispositions,cyclicTables:inventory.cyclicTables,
    selectorBindings:[{id:'selected:interesting-things-router',defaultVariant:'oddities',variants:things.catalog.variants.map((v:any)=>({variant:v.id,tableId:v.selectorId,sourceId:v.sourceId})),
      disabledSource:'pending-no-silent-fallback',policyRef:'curation/pilot/interesting-things.json#policy'}],
    procedurePolicy:{defaultAncestryTables:'only-human',alternativeAncestryTables:'core',attributeModeIndependent:true,defaultInterestingThings:'oddities',alternativeInterestingThings:'core',
      onlyHumanReplacesCoreRandomProfessionsAndWealth:true,coreRoleTraitsIndependentColumns:true,lookupDoesNotRollLifestyleAgain:true,manualModeMustRespectPublishedProcedure:true},
    sourceProcedureConstraints:inventory.procedureConstraints,sourceInstructionEvidenceIds:inventory.instructionEvidence.map((e:any)=>e.id),
    executionConstraints:{subjectAndEventIdsRequired:true,boundsMustReturnPending:true,hiddenRerollsAllowed:false,modifiedTotalsClamped:false,
      piety:'Each 3 rolls Religious Beliefs and Piety again; 1 Insanity per 3 after the first, plus 1 for final 18.',
      strange:'Without Tooth and Claw, result 19 alone permits the published reroll ignoring 19; enabled source requires skinchanger handling.',
      familyProfession:'Explicit choice of allowed category; do not invent a uniform subset selector.',
      dimensionComposition:'Keep explicit Size overrides and age-transition instructions; manual review until handler, no extra Life Experience count inferred.'},
    reviewedSideRollRules:[
      {tableId:'core:human-background',result:12,expression:'1d6 - 2',minimum:0,purpose:'children-count',phase:'creation',evidenceIds:['human-background']},
      {tableId:'only-human:siblings',resultRange:[9,12],expression:'1d3 + 1',purpose:'sibling-count',phase:'creation',then:'one Character Fate roll per sibling'},
      {tableId:'only-human:siblings',resultRange:[13,16],expression:'1d6 + 2',purpose:'sibling-count',phase:'creation',then:'one Character Fate roll per sibling'},
      {tableId:'only-human:siblings',resultRange:[17,20],expression:'2d6',purpose:'sibling-count',phase:'creation',then:'one Character Fate roll per sibling'},
      {tableId:'only-human:minor-setback',result:13,expression:'1d6',purpose:'odd/even responsibility',phase:'creation',odd:'PC fault',even:'friend fault'},
      {tableId:'only-human:major-windfall',result:11,expression:'1d6',purpose:'favor expiry after invocation',phase:'use',odd:'favor lost forever',even:'favor retained'},
      {tableId:'only-human:strange',result:6,expression:'1d6',purpose:'devil encounter branch',phase:'creation',branches:'1: Shadowsight and 1d3 Corruption; 2–5: resisted; 6: haunting persists'},
      {tableId:'only-human:strange',result:16,expression:'1d6',purpose:'Hell encounter branch',phase:'creation',branches:'1: religion Devil; 2–5: Insanity equals rolled face; 6: no stated change'},
    ],
    mechanicalReview:{professionTemplates:professions.developmentGrantTemplates,wealthModifiers:wealth.lifestyleRules.modifiers,
      materialPrograms:wealth.programs,interestingThingConsequences:upstream.formalization.interestingThingSemantics,
      itemAmbiguities:upstream.formalization.ambiguities,unresolvedItemDefinitions:upstream.formalization.unresolvedDefinitions,
      policy:'Preserve all conditions and origins. Child-table rolls, creation quantities, use-time rolls and narrative years are distinct; prose dice mentions never execute unconditionally.'},
    readiness:{numericCoverageComplete:audits.every(a=>a.complete)&&parseIssues.length===0,associationReviewTables:tables.filter(t=>t.streams.some(s=>s.association==='needs-review')).map(t=>t.id),
      fullAutomaticCharacterReady:false,reason:'All numbered associations are confirmed or audited; conditional mechanics, GM decisions, dimensional composition and runtime orchestration remain gated.'},
    confirmation:{manifestPath:CORRECTION_MANIFEST,sourceId:'sotdl:only-human',resolvedTables:['only-human:desires','only-human:fears'],resolvedRows:12,
      previousArtifacts:'curation/history/before-fears-desires-confirmation-2026-10-27/'},
    evidence:[...evidence.values()],inputRefs,nextTasks:['CUR-031','CUR-032','CUR-022'],
    remaining:[{task:'CUR-031/032',reason:'Compile audited data into source-specific packs and validate links/imports without bypassing per-table gates.'},
      {task:'CUR-027/034/035',reason:'Implement conditional effects, contexts, age/dimensions, resource handling and bounded orchestrator; numeric coverage is not mechanical execution.'}],};
  const text=JSON.stringify(formalization,null,2)+'\n',report={schemaVersion:1,task:'CUR-021',reviewDate:'2026-10-27',counts:{tables:74,randomTables:tables.filter(t=>t.dice).length,lookupTables:lookups.length,
    streams:audits.length,rangeRows:tables.reduce((n,t)=>n+t.streams.reduce((a,s)=>a+s.rows.length,0),0),completeNumericStreams:audits.filter(a=>a.complete).length,
    associationReviewTables:formalization.readiness.associationReviewTables.length,parseIssues:parseIssues.length,links:links.length,sideRollMentions:sideRollMentions.length,
    inventoryFindingsReviewed:dispositions.length,evidenceRanges:evidence.size},inputRefs,outputs:[{path:DATA,sha256:sha(text)}],nextTasks:formalization.nextTasks};
  return {formalization,report,artifacts:new Map([[DATA,text],[REPORT,JSON.stringify(report,null,2)+'\n']])};
}
export async function main(args:string[],root=process.cwd()){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const built=await buildArtifacts(root);
  for(const[path,text]of built.artifacts){ assertSafeArtifact(path, text);if(args[0]==='--check'){if(await readFile(resolve(root,path),'utf8')!==text)throw new Error(`Pilot table closure artifact changed: ${path}`);}
    else{await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),text);}}
  console.log(`Pilot tables: ${built.report.counts.tables} tables, ${built.report.counts.completeNumericStreams}/${built.report.counts.streams} numeric streams covered, ${built.report.counts.associationReviewTables} association reviews; official generation disabled. ${args[0]}`);
}
