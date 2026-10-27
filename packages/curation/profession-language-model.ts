import { z } from 'zod';

export const SourceFamily = z.enum(['core','only-human']);
const EvidenceIds = z.array(z.string().min(1)).min(1);
const Ability = z.enum(['speak','read','write']);
export const ProfessionOptionSchema = z.object({
  id:z.string().min(1),kind:z.enum(['profession-option','scholarship-option']),sourceFamily:SourceFamily,sourceId:z.string(),
  category:z.string(),tableId:z.string().nullable(),range:z.object({min:z.number().int().positive(),max:z.number().int().positive()}).strict().nullable(),
  sourceText:z.string().min(1),evidenceIds:EvidenceIds,
  subchoices:z.array(z.object({id:z.string(),label:z.string(),requiresLiteracy:z.boolean()}).strict()),
  specialization:z.enum(['none','choose-trade','choose-medium','choose-style','choose-labor','choose-good','choose-instrument']),
  literacy:z.object({abilities:z.tuple([z.literal('read'),z.literal('write')]),target:z.literal('one-already-spoken-language'),
    condition:z.enum(['always','poet-or-writer']),evidenceIds:EvidenceIds}).strict().nullable(),
  equipment:z.array(z.object({sourceText:z.string().min(1),evidenceIds:EvidenceIds,task:z.literal('CUR-018'),
    quantity:z.number().int().positive().nullable(),genericEditableNamesAllowed:z.literal(true)}).strict()),
}).strict().superRefine((o,ctx)=>{
  if((o.tableId===null)!==(o.range===null)||o.range&&o.range.min>o.range.max)ctx.addIssue({code:'custom',message:'Invalid profession table/range pairing'});
  if(new Set(o.subchoices.map(s=>s.id)).size!==o.subchoices.length)ctx.addIssue({code:'custom',message:'Duplicate profession subchoice'});
});
export type ProfessionOption=z.infer<typeof ProfessionOptionSchema>;
export const LanguageGrantSchema=z.object({id:z.string().min(1),languageId:z.string().min(1),abilities:z.array(Ability).min(1),
  requirePreviouslySpoken:z.boolean(),sourceId:z.string().min(1),evidenceIds:EvidenceIds,reason:z.string().min(1)}).strict()
  .superRefine((g,ctx)=>{
    if(new Set(g.abilities).size!==g.abilities.length)ctx.addIssue({code:'custom',message:'Repeated ability in grant'});
    if(['secret-language','dead-languages'].includes(g.languageId.toLowerCase().replace(/\s+/g,'-')))ctx.addIssue({code:'custom',message:'Open category needs a concrete language'});
  });
export type LanguageGrant=z.infer<typeof LanguageGrantSchema>;

/** Reference composition only. Abilities never imply each other or transfer through an alphabet. */
export function composeLanguageGrants(input:unknown){
  const grants=z.array(LanguageGrantSchema).parse(input),known=new Map<string,Set<string>>(),ids=new Set<string>();
  for(const g of grants){
    if(ids.has(g.id))throw new Error('Duplicate language grant event');ids.add(g.id);
    const abilities=known.get(g.languageId)??new Set<string>();
    if(g.requirePreviouslySpoken&&!abilities.has('speak'))throw new Error('Literacy target must already be spoken');
    g.abilities.forEach(a=>abilities.add(a));known.set(g.languageId,abilities);
  }
  return {languages:[...known].map(([languageId,a])=>({languageId,speak:a.has('speak'),read:a.has('read'),write:a.has('write')})),grants};
}
export function literacyEligibility(input:unknown){
  const {languages}=composeLanguageGrants(input);
  if(languages.some(l=>l.read&&l.write))return 'eligible' as const;
  if(languages.some(l=>l.read||l.write))return 'manual-review-partial-literacy' as const;
  return 'ineligible' as const;
}

const querySchema=z.object({sourceFamily:SourceFamily,context:z.enum(['core-starting','core-human-bonus','expanded-directed','family']),
  mode:z.enum(['manual','table-roll']),categories:z.array(z.string()).optional(),familyResult:z.number().int().min(3).max(18).optional(),
  languageGrants:z.array(LanguageGrantSchema).default([])}).strict();
export function professionCandidates(optionsInput:unknown,queryInput:unknown){
  const options=z.array(ProfessionOptionSchema).parse(optionsInput),q=querySchema.parse(queryInput),diagnostics:string[]=[];
  if((q.context.startsWith('core-')&&q.sourceFamily!=='core')||((q.context==='expanded-directed'||q.context==='family')&&q.sourceFamily!=='only-human'))throw new Error('Profession slot/source mismatch');
  if(q.context==='core-human-bonus'&&q.mode==='manual')diagnostics.push('Ancestry bonus says random profession; manual substitution is not published here.');
  let categories=q.categories;
  if(q.context==='family'){
    const n=q.familyResult;
    const family=n!==undefined&&n>=6&&n<=8?['common','criminal','military','wilderness']:n!==undefined&&n>=9&&n<=17?['common','military','religious','wilderness']:null;
    if(!family){diagnostics.push('Family profession category not specified by this result; manual source/context resolution required.');categories=[];}
    else categories=categories?family.filter(k=>categories!.includes(k)):family;
  }
  const literacy=literacyEligibility(q.languageGrants);
  return {modeAuthorized:diagnostics.length===0,options:options.filter(o=>o.tableId!==null&&o.sourceFamily===q.sourceFamily&&(!categories||categories.includes(o.category))).map(o=>({
    option:o,subchoices:o.subchoices.map(s=>({...s,eligibility:s.requiresLiteracy?literacy:'eligible' as const})),
  })),diagnostics};
}
export function resolveProfessionFaces(optionsInput:unknown,input:unknown){
  const q=z.object({sourceFamily:SourceFamily,typeFace:z.number().int().min(1).max(6),detailFace:z.number().int().positive()}).strict().parse(input);
  const categories=q.sourceFamily==='core'?['academic','common','criminal','martial','religious','wilderness']:['scholarship','common','criminal','military','religious','wilderness'];
  const category=categories[q.typeFace-1],sides=q.sourceFamily==='only-human'&&category==='religious'?6:20;
  if(q.detailFace>sides)throw new Error('Detail face outside published child die');
  const options=z.array(ProfessionOptionSchema).parse(optionsInput);
  const found=options.filter(o=>o.sourceFamily===q.sourceFamily&&o.category===category&&o.range&&o.range.min<=q.detailFace&&q.detailFace<=o.range.max);
  if(found.length!==1)throw new Error('Profession outcome gap/overlap');
  return {option:found[0],trace:[{sides:6,face:q.typeFace},{sides,face:q.detailFace}],unresolvedSpecialization:found[0].specialization!=='none'};
}

/** A profession's explicit literacy benefit, not a general language or alphabet inference. */
export function professionLiteracyGrant(optionInput:unknown,selection:unknown,previous:unknown){
  const option=ProfessionOptionSchema.parse(optionInput);
  const s=z.object({eventId:z.string().min(1),languageId:z.string().min(1),subchoiceId:z.string().optional()}).strict().parse(selection);
  if(!option.literacy)throw new Error('Profession does not grant literacy');
  if(option.literacy.condition==='poet-or-writer'&&!['poet','writer'].includes(s.subchoiceId??''))throw new Error('Artist literacy requires poet or writer');
  const grant=LanguageGrantSchema.parse({id:s.eventId,languageId:s.languageId,abilities:option.literacy.abilities,requirePreviouslySpoken:true,
    sourceId:option.sourceId,evidenceIds:option.literacy.evidenceIds,reason:`Published literacy from ${option.id}`});
  const old=z.array(LanguageGrantSchema).parse(previous);composeLanguageGrants([...old,grant]);return grant;
}
