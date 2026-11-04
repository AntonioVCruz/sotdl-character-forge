import {z} from 'zod';
import type {CoreLocalDocument} from '../../packages/curation/human-l0-core-local';
import {PilotItemSchema} from '../../packages/curation/pilot-item-model';
import {ThingApplicationPlanSchema,type ThingApplicationPlan} from '../../packages/character-generator/core-interesting-things';

const policySchema=z.object({schemaVersion:z.literal(1),authority:z.literal('explicit-user-request'),date:z.string(),scope:z.literal('human-core-l0-interesting-things'),
  specialArmor:z.object({outcomeId:z.literal('core:6:17'),baseItemId:z.literal('pilot-item:core:mail'),classification:z.literal('light'),weight:z.literal(0),requiredStrength:z.null(),stacksWithArmor:z.literal(false)}).strict()}).strict();
const useReasons:Record<string,string>={
  'consumable-nourishment':'Alimentação e duração devem ser aplicadas ao consumir; nenhum efeito foi ativado na criação.',
  light:'Iluminação depende do uso e do contexto; o alcance segue a descrição do resultado.',
  'conditional-boon':'Boon condicionado a vestir o objeto e ao teste específico; não é um bônus global de atributo.',
  indestructibility:'A resistência especial pertence a este objeto; sua aplicação em cena é contextual.',
  'conditional-light':'A luz depende da condição de abertura descrita; não foi ativada na criação.',
  'conditional-vision':'A visão especial depende de uma condição não quantificada na fonte e exige adjudicação do mestre no uso.',
  'continuous-light':'A arma conserva a iluminação contínua declarada; a iluminação da cena não é automatizada.',
  'consumable-terrain-change':'O consumo de doses e a alteração do terreno exigem resolução de uso; as doses iniciais estão registradas.',
  'daily-recovery':'A recuperação diária depende da passagem do tempo; não cria objetos adicionais ao reabrir.',
  'appearance-change':'A mudança de aparência respeita o momento e o limite descritos; não é aplicada na criação.',
};
/** Source-bound projection of reviewed classifications; source text is never a browser-side rule parser. */
export function projectInterestingThingApplications(core:CoreLocalDocument,items:z.infer<typeof PilotItemSchema>[],policyInput:unknown) {
  const policy=policySchema.parse(policyInput),mail=items.find(i=>i.id===policy.specialArmor.baseItemId);
  const special=core.things.find(t=>t.id===policy.specialArmor.outcomeId);
  if(!mail?.armor||mail.definitionStatus!=='published-core'||!special?.details.mechanismTags.includes('non-stacking'))throw new Error('Interesting Things: armor-source-missing');
  const specialId=`local-ruling:${special.id}:armor`;
  const specialItem=PilotItemSchema.parse({...mail,id:specialId,name:special.text,definitionStatus:'source-outcome-only',
    evidenceIds:[...special.evidenceIds,...mail.evidenceIds],sourceText:special.text,
    price:{kind:'unknown',amount:null,denomination:null,bits:null,per:{quantity:1,unit:'suit'}},
    armor:{...mail.armor,classification:policy.specialArmor.classification,requiredStrength:null},
    restrictions:[...mail.restrictions,'Explicit local ruling: weight 0, light armor, no Strength requirement, no armor stacking.']});
  const plans=core.things.map(thing=>{
    const reference=core.materialReferences.find(r=>r.originKind==='interesting-thing'&&r.originId===thing.id);
    if(!reference||thing.text===null||thing.mappingStatus==='needs-review')throw new Error('Interesting Things: source-reference-incomplete');
    const record=(key:string,kind:'item'|'companion'|'vehicle'|'relationship'|'narrative',count=1,unit='conjunto')=>({key,kind,count,unit});
    const branch=(optionId:string|null)=>{
      let records=[record('result',thing.details.kind==='narrative'?'narrative':thing.details.kind==='companion'?'companion':'item')];
      if(['core:6:5','core:6:19'].includes(thing.id))records=[record('relationship','relationship')];
      if(thing.id==='core:3:16'&&optionId==='option-3')records=[record('narrative','narrative')];
      if(thing.id==='core:4:18')records=[record('container','item'),record('dependent','companion')];
      if(thing.id==='core:5:9')records=[record('dependent','companion')];
      if(thing.id==='core:6:9')records=[record('transport','vehicle'),record('draft-animal','companion')];
      if(thing.id==='core:6:10')records=[record('dependents','companion',thing.details.quantities[0]?.amount,'mouse')];
      if(thing.id==='core:3:5'&&optionId==='option-1')records=[record('result','item',2,'unidade')];
      return {optionId,records};
    };
    if(thing.details.choices.length>1)throw new Error('Interesting Things: unreviewed-multiple-choices');
    const branches=thing.details.choices.length?thing.details.choices[0].options.map(o=>branch(o.id)):[branch(null)];
    const quantities:ThingApplicationPlan['quantities']=thing.details.quantities.map((q,i)=>({id:`fixed/${i}`,fixed:q.amount,rollId:null,optionId:null,unit:q.unit,
      role:['core:3:2','core:4:7','core:6:13'].includes(thing.id)?'length':thing.id==='core:4:12'?'weight':thing.id==='core:6:10'?'count':thing.id==='core:1:18'?'resource':'contents'}));
    for(const r of thing.details.sideRolls)if(r.phase==='creation')quantities.push({id:r.id,fixed:null,rollId:r.id,optionId:r.optionId,unit:r.purpose,
      role:thing.id==='core:5:3'?'capacity':thing.id==='core:5:11'?'resource':'contents'});
    if(thing.id==='core:5:5')quantities.push({id:'capacity-multiplier',fixed:2,rollId:null,optionId:null,unit:'multiplicador',role:'capacity'});
    const useEffects=[];
    for(const tag of thing.details.mechanismTags){
      if(['container-capacity','gm-choice','armor-classification','non-stacking'].includes(tag))continue;
      if(!useReasons[tag])throw new Error('Interesting Things: unreviewed-mechanism');
      useEffects.push({tag,reason:useReasons[tag]});
    }
    return ThingApplicationPlanSchema.parse({outcomeId:thing.id,sourceId:thing.sourceId,evidenceIds:thing.evidenceIds,referenceId:reference.id,
      branches,quantities,useEffects,specialProfilePending:false,specialArmor:thing.id===special.id?{itemId:specialId,baseItemId:mail.id,weight:0,authority:policy.authority}:null});
  });
  if(plans.length!==120||new Set(plans.map(p=>p.outcomeId)).size!==120)throw new Error('Interesting Things: coverage-incomplete');
  return {plans,specialItem,policy};
}
