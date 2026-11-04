import {z} from 'zod';
import {ThingOutcomeSchema} from '../curation/interesting-things-model';

const id=z.string().min(1);
const role=z.enum(['contents','length','weight','capacity','resource','count']);
export const ThingApplicationPlanSchema=z.object({outcomeId:id,sourceId:id,evidenceIds:z.array(id).min(1),referenceId:id,
  branches:z.array(z.object({optionId:id.nullable(),records:z.array(z.object({key:id,kind:z.enum(['item','companion','vehicle','relationship','narrative']),count:z.number().int().positive(),unit:id}).strict())}).strict()).min(1),
  quantities:z.array(z.object({id,role,unit:id,optionId:id.nullable(),fixed:z.number().int().positive().nullable(),rollId:id.nullable()}).strict()),
  useEffects:z.array(z.object({tag:id,reason:id}).strict()),specialProfilePending:z.boolean(),
  specialArmor:z.object({itemId:id,baseItemId:id,weight:z.literal(0),authority:z.literal('explicit-user-request')}).strict().nullable(),
}).strict().superRefine((p,ctx)=>{
  if(new Set(p.branches.map(b=>b.optionId)).size!==p.branches.length)ctx.addIssue({code:'custom',message:'Duplicate branch'});
  if(new Set(p.quantities.map(q=>q.id)).size!==p.quantities.length)ctx.addIssue({code:'custom',message:'Duplicate quantity'});
  for(const q of p.quantities)if((q.fixed===null)===(q.rollId===null))ctx.addIssue({code:'custom',message:'Quantity requires exactly one fixed amount or creation roll'});
  for(const b of p.branches)if(new Set(b.records.map(r=>r.key)).size!==b.records.length)ctx.addIssue({code:'custom',message:'Duplicate grant'});
});
export type ThingApplicationPlan=z.infer<typeof ThingApplicationPlanSchema>;
export const ThingAdjudicationSchema=z.object({outcomeId:id,author:z.string().trim().min(1).max(120),reason:z.string().trim().min(1).max(500),
  definition:z.discriminatedUnion('kind',[
    z.object({kind:z.literal('published'),itemId:id}).strict(),
    z.object({kind:z.literal('generic'),name:z.string().trim().min(1).max(200)}).strict(),
  ])}).strict();
export type ThingAdjudication=z.infer<typeof ThingAdjudicationSchema>;
export const thingChoiceKey=(outcomeId:string,choiceId:string)=>`interesting/${outcomeId}/${choiceId}`;
export const thingRollKey=(outcomeId:string,rollId:string)=>`interesting/${outcomeId}/${rollId}`;

/** Pure creation replay. No dice generation, approval checkbox, money credit or inferred item profile. */
export function applyInterestingThing(planInput:unknown,outcomeInput:unknown,choices:Record<string,string>,rolls:Record<string,number[]>,adjudicationInput?:unknown) {
  const plan=ThingApplicationPlanSchema.parse(planInput),outcome=ThingOutcomeSchema.parse(outcomeInput);
  if(plan.outcomeId!==outcome.id||plan.sourceId!==outcome.sourceId||JSON.stringify(plan.evidenceIds)!==JSON.stringify(outcome.evidenceIds))throw new Error('Interesting Thing: origin-mismatch');
  const origin={outcomeId:outcome.id,sourceId:outcome.sourceId,evidenceIds:outcome.evidenceIds,referenceId:plan.referenceId};
  const pending:{key:string;scope:'creation'|'use';code:string;label:string;options?:{id:string;label:string}[]}[]=[];
  const selected:{choiceId:string;id:string;text:string}[]=[];
  for(const choice of outcome.details.choices){
    const key=thingChoiceKey(outcome.id,choice.id),value=choices[key],option=choice.options.find(o=>o.id===value);
    if(!value)pending.push({key,scope:'creation',code:'published-alternative',label:'Escolher alternativa de Interesting Thing',options:choice.options.map(o=>({id:o.id,label:o.text}))});
    else if(!option)throw new Error('Interesting Thing: choice-invalid');
    else selected.push({choiceId:choice.id,...option});
  }
  const activeOptions=new Set(selected.map(o=>o.id));
  const quantities=plan.quantities.filter(q=>q.optionId===null||activeOptions.has(q.optionId)).map(q=>{
    let amount=q.fixed;
    if(q.rollId){const spec=outcome.details.sideRolls.find(r=>r.id===q.rollId&&r.phase==='creation'&&(r.optionId===null||activeOptions.has(r.optionId)));
      const faces=rolls[thingRollKey(outcome.id,q.rollId)];
      if(!spec||!faces||faces.length!==spec.count||faces.some(f=>!Number.isInteger(f)||f<1||f>spec.sides))throw new Error('Interesting Thing: creation-roll-invalid');
      amount=faces.reduce((a,b)=>a+b,spec.modifier);
    }
    return {...q,amount:amount!,...origin};
  });
  let adjudication:ThingAdjudication|undefined;
  if(adjudicationInput!==undefined){adjudication=ThingAdjudicationSchema.parse(adjudicationInput);if(!outcome.details.gmChoice||adjudication.outcomeId!==outcome.id)throw new Error('Interesting Thing: adjudication-origin-invalid');}
  if(outcome.details.gmChoice&&!adjudication)pending.push({key:`interesting/${outcome.id}/gm-weapon`,scope:'creation',code:'gm-weapon-choice',label:'O mestre precisa identificar a arma concedida e registrar a decisão.'});
  const choiceComplete=selected.length===outcome.details.choices.length;
  const grants=choiceComplete&&(!outcome.details.gmChoice||adjudication)?plan.branches.filter(b=>b.optionId===null||activeOptions.has(b.optionId)).flatMap(b=>b.records.map(r=>({
    ...r,key:`interesting/${outcome.id}/${b.optionId??'base'}/${r.key}`,label:adjudication?.definition.kind==='generic'?adjudication.definition.name:selected.map(o=>o.text).join(' · ')||outcome.text||outcome.id,
    definitionId:plan.specialArmor?.itemId??(adjudication?.definition.kind==='published'?adjudication.definition.itemId:null),weight:plan.specialArmor?.weight??null,...origin,
  }))):[];
  for(const effect of plan.useEffects)pending.push({key:`interesting/${outcome.id}/use/${effect.tag}`,scope:'use',code:effect.tag,label:effect.reason});
  if(plan.specialProfilePending)pending.push({key:`interesting/${outcome.id}/use/special-armor-profile`,scope:'use',code:'special-armor-profile',label:'Perfil da armadura especial e composição não acumulável dependem de adjudicação; nenhum perfil comum foi substituído automaticamente.'});
  if(adjudication?.definition.kind==='generic')pending.push({key:`interesting/${outcome.id}/use/generic-weapon-profile`,scope:'use',code:'generic-weapon-profile',label:'Arma identificada pelo mestre sem definição mecânica exata; estatísticas de uso continuam pendentes.'});
  if(outcome.mappingStatus==='needs-review')pending.push({key:`interesting/${outcome.id}/mapping`,scope:'creation',code:'mapping-review',label:'Associação do resultado à fonte ainda precisa de revisão.'});
  const creationResolved=!pending.some(p=>p.scope==='creation');
  return {origin,grants,quantities,selectedAlternatives:selected,pending,adjudication:adjudication??null,specialArmor:plan.specialArmor,
    declaredWorth:outcome.details.declaredWorth,creationResolved,fullyApplied:pending.length===0,
    deferredUseRolls:outcome.details.sideRolls.filter(r=>r.phase==='use'),
    effects:plan.useEffects.map(e=>({...e,phase:'use' as const,applied:false as const,...origin})),
    events:grants.map(g=>({type:'interesting-thing-grant' as const,...g})),cashDeltaBits:'0' as const};
}
