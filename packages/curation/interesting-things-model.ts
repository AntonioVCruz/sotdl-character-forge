import {z} from 'zod';

const Id=z.string().min(1);
const Die=z.number().int().min(1);
const Choice=z.object({id:Id,options:z.array(z.object({id:Id,text:Id}).strict()).min(2)}).strict();
const SideRoll=z.object({id:Id,count:z.number().int().min(1).max(10),sides:z.number().int().min(2).max(100),modifier:z.number().int().nonnegative(),
  phase:z.enum(['creation','use']),purpose:Id,optionId:Id.nullable()}).strict();
export const ThingDetailsSchema=z.object({
  kind:z.enum(['object','companion','relationship','narrative','mixed','dependency','text-reference']),choices:z.array(Choice),sideRolls:z.array(SideRoll),
  quantities:z.array(z.object({amount:z.number().int().positive(),unit:Id,meaning:Id}).strict()),
  declaredWorth:z.object({amount:Id,denomination:z.literal('ss'),bits:Id,spendable:z.literal(false)}).strict().nullable(),
  dependencySourceId:Id.nullable(),mechanismTags:z.array(Id),contextRules:z.array(Id),gmChoice:z.boolean(),
  futureGenerator:z.object({id:Id,enabled:z.literal(false),strategy:z.literal('random'),outputKinds:z.tuple([z.literal('passage'),z.literal('book')]),
    activation:z.literal('after-implementation-and-explicit-enablement')}).strict().nullable(),
  application:z.literal('manual-adjudication'),mechanicalEffectsApplied:z.literal(false),
}).strict();
export type ThingDetails=z.infer<typeof ThingDetailsSchema>;
export const ThingOutcomeSchema=z.object({id:Id,tableId:Id,face:z.number().int().min(1).max(20),sourceId:Id,evidenceIds:z.array(Id).min(1),
  text:Id.nullable(),mappingStatus:z.enum(['verified-md','verified-user-text','reconstructed-md','needs-review']),reviewNotes:z.array(Id),details:ThingDetailsSchema}).strict();
const Table=z.object({id:Id,title:Id,sourceId:Id,evidenceIds:z.array(Id).min(1),dice:z.object({count:z.literal(1),sides:z.literal(20)}).strict(),outcomes:z.array(ThingOutcomeSchema).length(20)}).strict();
const Route=z.object({min:Die,max:Die,tableId:Id}).strict();
const Variant=z.object({id:Id,sourceId:Id,selectorId:Id,selectorEvidenceIds:z.array(Id).min(1),selectorSides:z.union([z.literal(6),z.literal(20)]),routes:z.array(Route).min(1)}).strict();
export const InterestingThingsCatalogSchema=z.object({defaultVariant:Id,variants:z.array(Variant).length(2),tables:z.array(Table).length(18)}).strict().superRefine((c,ctx)=>{
  const issue=(message:string)=>ctx.addIssue({code:'custom',message});
  const tables=new Map(c.tables.map(t=>[t.id,t]));
  if(tables.size!==c.tables.length)issue('Duplicate table identity');
  const outcomes=new Set<string>();
  for(const t of c.tables){
    if(new Set(t.outcomes.map(o=>o.face)).size!==20)issue('Incomplete or overlapping d20 coverage');
    for(const o of t.outcomes){
      if(outcomes.has(o.id))issue('Duplicate outcome identity');outcomes.add(o.id);
      if(o.tableId!==t.id||o.sourceId!==t.sourceId)issue('Outcome source/table mismatch');
      if(o.text===null&&o.mappingStatus!=='needs-review')issue('Missing prose requires review');
      const ids=new Set<string>();for(const ch of o.details.choices){if(ids.has(ch.id)||new Set(ch.options.map(p=>p.id)).size!==ch.options.length)issue('Duplicate choice identity');ids.add(ch.id);}
      if(new Set(o.details.sideRolls.map(r=>r.id)).size!==o.details.sideRolls.length)issue('Duplicate side-roll identity');
      for(const r of o.details.sideRolls)if(r.optionId&&!o.details.choices.some(ch=>ch.options.some(p=>p.id===r.optionId)))issue('Unknown conditional side-roll branch');
    }
  }
  if(new Set(c.variants.map(v=>v.id)).size!==2||!c.variants.some(v=>v.id===c.defaultVariant))issue('Invalid variant identity/default');
  for(const v of c.variants){
    const covered=Array(v.selectorSides).fill(0);
    for(const r of v.routes){
      if(r.min>r.max||r.max>v.selectorSides)issue('Invalid selector range');
      for(let n=r.min;n<=r.max&&n<=v.selectorSides;n++)covered[n-1]++;
      if(tables.get(r.tableId)?.sourceId!==v.sourceId)issue('Cross-source or missing selector target');
    }
    if(covered.some(n=>n!==1))issue('Incomplete or overlapping selector coverage');
  }
});

const Request=z.object({eventId:Id,variant:Id.optional(),activeSourceIds:z.array(Id),
  selection:z.discriminatedUnion('mode',[
    z.object({mode:z.literal('table-faces'),selectorFace:Die,outcomeFace:z.number().int().min(1).max(20)}).strict(),
    z.object({mode:z.literal('manual'),outcomeId:Id}).strict(),
  ]),choices:z.record(z.string(),z.string()),sideFaces:z.record(z.string(),z.array(z.number().int()))}).strict();

/** Curatorial reference only: explicit faces, no PRNG, no Character mutation or effect execution. */
export function createInterestingThingsPreview(catalogInput:unknown){
  const catalog=InterestingThingsCatalogSchema.parse(catalogInput);
  return (input:unknown)=>{
  const q=Request.parse(input);
  const variant=catalog.variants.find(v=>v.id===(q.variant??catalog.defaultVariant));
  if(!variant)throw new Error('Unknown Interesting Things variant');
  const pending:{kind:string;id:string;reason:string;sourceId:string}[]=[],trace:{id:string;parentRollId:string|null;tableId:string;faces:number[];resultId:string}[]=[];
  const base={eventId:q.eventId,variant:variant.id,sourceId:variant.sourceId,mechanicalEffectsApplied:false,fullyApplied:false,completeCharacter:false};
  if(!q.activeSourceIds.includes(variant.sourceId))return {...base,outcome:null,trace,pending:[{kind:'disabled-source',id:variant.sourceId,reason:'Selected source is disabled; no automatic Core fallback.',sourceId:variant.sourceId}],selectionComplete:false,quantities:[],selectedAlternatives:[],deferredUseRolls:[]};
  let outcome:z.infer<typeof ThingOutcomeSchema>|undefined;
  if(q.selection.mode==='manual'){
    const selectedId=q.selection.outcomeId;
    outcome=catalog.tables.filter(t=>t.sourceId===variant.sourceId).flatMap(t=>t.outcomes).find(o=>o.id===selectedId);
    if(!outcome)throw new Error('Manual result does not belong to selected source');
  }else{
    const selection=q.selection;if(selection.selectorFace>variant.selectorSides)throw new Error('Selector face outside published die');
    const route=variant.routes.find(r=>selection.selectorFace>=r.min&&selection.selectorFace<=r.max)!;
    outcome=catalog.tables.find(t=>t.id===route.tableId)!.outcomes.find(o=>o.face===selection.outcomeFace)!;
    const parent=`${q.eventId}:selector`;
    trace.push({id:parent,parentRollId:null,tableId:variant.selectorId,faces:[selection.selectorFace],resultId:route.tableId},
      {id:`${q.eventId}:outcome`,parentRollId:parent,tableId:route.tableId,faces:[selection.outcomeFace],resultId:outcome.id});
  }
  // Do not expose the cached catalog to caller edits of a preview.
  outcome=structuredClone(outcome);
  const add=(kind:string,id:string,reason:string,sourceId=outcome.sourceId)=>pending.push({kind,id,reason,sourceId});
  if(outcome.mappingStatus==='needs-review')add('mapping-review',outcome.id,outcome.reviewNotes.join(' '));
  const selectedAlternatives:{choiceId:string;id:string;text:string}[]=[];
  for(const choice of outcome.details.choices){
    const selected=q.choices[choice.id];
    if(!selected){add('choice',choice.id,'Choose one published alternative; do not grant all branches.');continue;}
    const option=choice.options.find(o=>o.id===selected);if(!option)throw new Error('Unknown published alternative');
    selectedAlternatives.push({choiceId:choice.id,...option});
  }
  for(const key of Object.keys(q.choices))if(!outcome.details.choices.some(c=>c.id===key))throw new Error('Choice does not belong to outcome');
  const quantities=[];
  for(const r of outcome.details.sideRolls.filter(r=>r.phase==='creation')){
    if(r.optionId&&!selectedAlternatives.some(a=>a.id===r.optionId))continue;
    const faces=q.sideFaces[r.id];if(!faces){add('side-roll',r.id,r.purpose);continue;}
    if(faces.length!==r.count||faces.some(n=>n<1||n>r.sides))throw new Error('Side-roll faces outside published dice');
    quantities.push({id:r.id,amount:faces.reduce((a,b)=>a+b,r.modifier),purpose:r.purpose});
    trace.push({id:`${q.eventId}:side:${r.id}`,parentRollId:q.selection.mode==='manual'?null:`${q.eventId}:outcome`,tableId:outcome.id,faces:[...faces],resultId:r.id});
  }
  for(const key of Object.keys(q.sideFaces))if(!outcome.details.sideRolls.some(r=>r.id===key&&r.phase==='creation'&&(!r.optionId||selectedAlternatives.some(a=>a.id===r.optionId))))throw new Error('Unexpected or use-time side roll');
  if(outcome.details.dependencySourceId&&outcome.details.kind!=='text-reference')add('external-generator',outcome.details.dependencySourceId,'Resolve the referenced generator explicitly; do not replace it with an invented book.',outcome.details.dependencySourceId);
  if(outcome.details.gmChoice)add('gm-choice',outcome.id,'GM chooses the specified object; generic item details may be edited later.');
  const selectionComplete=pending.length===0;
  add('manual-application',outcome.id,'Preserve full outcome text and context; inventory/effect integration requires its validated handler or manual adjudication.');
  return {...base,outcome,trace,pending,selectionComplete,quantities,selectedAlternatives,deferredUseRolls:outcome.details.sideRolls.filter(r=>r.phase==='use')};
  };
}
export function previewInterestingThing(catalogInput:unknown,input:unknown){
  return createInterestingThingsPreview(catalogInput)(input);
}
