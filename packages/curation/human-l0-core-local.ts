import { z } from 'zod';
import { AuditDiceSchema, auditTableRanges } from './pilot-table-model';
import { ProfessionOptionSchema } from './profession-language-model';
import { ThingOutcomeSchema } from './interesting-things-model';
import { GrantProgramSchema } from './starting-equipment-model';
import { ItemReferenceSchema } from './pilot-item-model';

const id=z.string().min(1),hash=z.string().regex(/^[a-f0-9]{64}$/),refs=z.array(id).min(1);
const binding=z.object({
  kind:z.enum(['profession','subtable','lifestyle-kit','background-template','background-program','interesting-thing','narrative','manual-dimension','background-review']),
  refId:id.nullable(),pending:z.enum(['language-choice','profession-specialization','material-handler','source-adjudication','dimension-input','background-consequence-review']).nullable(),
}).strict();
const row=z.object({id,min:z.number().int().nullable(),max:z.number().int().nullable(),text:id,evidenceIds:refs,
  weight:z.object({ways:z.string().regex(/^[1-9]\d*$/),denominator:z.string().regex(/^[1-9]\d*$/)}).strict(),
  bindings:z.array(binding).min(1),
}).strict();
const table=z.object({id,sourceId:id,dice:AuditDiceSchema,activation:id,manualMode:id,
  columns:z.array(z.object({id,rollId:id,rows:z.array(row).min(1)}).strict()).min(1),
}).strict();
const ability=z.enum(['speak','read','write']);
const template=z.object({id,sourceId:id,tableId:id,result:z.number().int(),evidenceIds:refs,
  languageChoice:z.object({count:z.number().int().positive(),abilities:z.array(ability)}).strict().optional(),
  languages:z.array(z.object({languageId:id,abilities:z.array(ability),requirePreviouslySpoken:z.boolean()}).strict()).optional(),
}).strict();
export const CoreLocalDocumentSchema=z.object({
  contract:z.literal('sotdl.human-l0.consumable'),contractVersion:z.literal('1.1.0'),lot:z.literal('core'),
  distribution:z.literal('local'),fictionalData:z.literal(false),reviewStatus:z.literal('needs-review'),
  rulesetEnabled:z.literal(false),importablePack:z.literal(false),exportEnabled:z.literal(false),
  sourceId:id,publicationVersion:z.null(),
  tables:z.array(table).min(1),professions:z.array(ProfessionOptionSchema),things:z.array(ThingOutcomeSchema),
  queries:z.array(z.object({id,kind:z.enum(['selector-result','prior-result']),tableId:id,columnId:id,extraDice:z.literal(false)}).strict()),
  links:z.array(z.object({id,from:id,to:id,kind:id,instruction:id,applicability:id,evidenceIds:refs,automaticExecution:z.literal(false)}).strict()),
  programs:z.array(GrantProgramSchema),templates:z.array(template),materialReferences:z.array(ItemReferenceSchema),
  languageOptions:z.array(z.object({id,label:id,defaultAbilities:z.array(ability),evidenceIds:refs}).strict()),
  openLanguages:z.array(id),
  startingRights:z.object({professionChoices:z.number().int().positive(),manualOrRandom:z.literal(true),ancestryAdditional:z.literal('one-language-OR-random-profession-not-both')}).strict(),
  coreInitialThing:z.object({id,count:z.literal(1),additional:z.literal(false),evidenceId:id}).strict(),
  interestingThingsPolicy:z.object({defaultVariant:z.literal('oddities'),coreIsExplicitAlternative:z.literal(true),disabledSource:z.literal('pending-no-silent-fallback')}).strict(),
  backgroundSideRolls:z.array(z.object({tableId:id,result:z.number().int(),expression:id,minimum:z.number().int(),purpose:id,phase:z.literal('creation'),evidenceIds:refs}).strict()),
  backgroundStateMentions:z.array(z.object({rowId:id,amount:id,target:z.enum(['insanity','corruption']),applied:z.literal(false),pending:z.literal('background-consequence-review')}).strict()),
  evidence:z.array(z.object({id,sourceId:id,path:id,inputSha256:hash,startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerptSha256:hash}).strict()),
  inputs:z.array(z.object({path:id,sha256:hash}).strict()).min(1),
  coverage:z.array(z.object({matrixId:id,bindings:z.array(id).min(1),status:z.enum(['projected','expanded-local-group','manual'])}).strict()),
}).strict();
export type CoreLocalDocument=z.infer<typeof CoreLocalDocumentSchema>;
const fail=(code:string):never=>{throw new Error(`Core local: ${code}; contents omitted.`);};
/** Structural/semantic-reference gate for real local facts. Never accepts a synthetic document as real. */
export function parseCoreLocalDocument(input:unknown):CoreLocalDocument {
  const p=CoreLocalDocumentSchema.safeParse(input);if(!p.success)return fail('schema-invalid');
  const d=p.data,unique=(values:string[])=>{if(new Set(values).size!==values.length)fail('duplicate-identity');};
  for(const list of [d.tables,d.professions,d.things,d.programs,d.templates,d.evidence,d.queries,d.links])unique(list.map(r=>r.id));
  unique(d.coverage.map(r=>r.matrixId));unique(d.inputs.map(r=>r.path));
  const evidence=new Map(d.evidence.map(e=>[e.id,e]));
  const checkRefs=(ids:string[])=>{for(const id of ids)if(!evidence.has(id))fail('evidence-missing');};
  const targets=new Map<string,Set<string>>([
    ['profession',new Set(d.professions.map(p=>p.id))],['subtable',new Set(d.tables.map(t=>t.id))],
    ['lifestyle-kit',new Set(d.programs.map(p=>p.id))],['background-template',new Set(d.templates.map(t=>t.id))],
    ['background-program',new Set(d.programs.map(p=>p.id))],['interesting-thing',new Set(d.things.map(t=>t.id))],
  ]);
  const allRows=new Map<string,{tableId:string;min:number|null;max:number|null}>();
  unique(d.tables.flatMap(t=>t.columns.map(c=>c.rollId)));
  for(const t of d.tables) {
    if(t.sourceId!==d.sourceId)fail('cross-source-table');unique(t.columns.map(c=>c.id));
    for(const c of t.columns) {
      const audit=auditTableRanges(t.dice,c.rows.map(({id,min,max,text,evidenceIds})=>({id,min,max,text,evidenceIds})));if(!audit.complete)fail('range-coverage');
      for(const r of c.rows) {
        if(allRows.has(r.id))fail('duplicate-row');allRows.set(r.id,{tableId:t.id,min:r.min,max:r.max});checkRefs(r.evidenceIds);
        const weight=audit.weights.find(w=>w.rowId===r.id)!;
        if(r.weight.ways!==weight.ways||r.weight.denominator!==weight.denominator)fail('weight-mismatch');
        for(const b of r.bindings) {
          if(targets.has(b.kind)&&(!b.refId||!targets.get(b.kind)!.has(b.refId)))fail('binding-missing');
          if(b.kind==='profession'&&b.refId!==r.id)fail('profession-target-mismatch');
        }
      }
    }
  }
  for(const p of d.professions) {
    checkRefs(p.evidenceIds);const row=allRows.get(p.id);
    if(p.sourceId!==d.sourceId||p.sourceFamily!=='core'||!row||row.tableId!==p.tableId||row.min!==p.range?.min||row.max!==p.range?.max)fail('profession-source-range');
  }
  for(const thing of d.things){checkRefs(thing.evidenceIds);if(thing.sourceId!==d.sourceId||!allRows.has(thing.id))fail('thing-source-row');}
  for(const x of [...d.programs,...d.templates,...d.materialReferences,...d.languageOptions]) {
    checkRefs(x.evidenceIds);
    if('sourceId' in x&&x.sourceId!==d.sourceId)fail('cross-source-component');
  }
  checkRefs([d.coreInitialThing.evidenceId]);
  for(const x of d.backgroundSideRolls)checkRefs(x.evidenceIds);
  for(const q of d.queries)if(!d.tables.some(t=>t.id===q.tableId&&t.columns.some(c=>c.id===q.columnId)))fail('query-producer-missing');
  for(const link of d.links){checkRefs(link.evidenceIds);if(!d.tables.some(t=>t.id===link.from)||!d.tables.some(t=>t.id===link.to))fail('link-target-missing');}
  for(const e of d.evidence)if(e.sourceId!==d.sourceId||e.endLine<e.startLine)fail('evidence-source-range');
  for(const r of d.coverage)for(const ref of r.bindings) {
    const known=allRows.has(ref)||targets.get('subtable')!.has(ref)||targets.get('profession')!.has(ref)||targets.get('background-template')!.has(ref)
      ||d.languageOptions.some(l=>l.id===ref)||d.openLanguages.includes(ref)||ref===d.coreInitialThing.id
      ||d.tables.some(t=>t.columns.some(c=>c.rollId===ref))||d.queries.some(q=>q.id===ref)||d.links.some(l=>l.id===ref)
      ||d.backgroundSideRolls.some(s=>ref===`side-roll:${s.tableId}:${s.result}`);
    if(!known)fail('coverage-binding-missing');
  }
  return d;
}
