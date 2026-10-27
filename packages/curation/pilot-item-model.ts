import {z} from 'zod';
import {Currency,moneyToBits} from './starting-equipment-model';

const Id=z.string().min(1);
export const ItemPriceSchema=z.object({kind:z.enum(['exact','minimum','variable','unknown']),amount:z.string().nullable(),denomination:Currency.nullable(),bits:z.string().nullable(),
  per:z.object({quantity:z.number().int().positive(),unit:Id}).strict()}).strict().superRefine((p,ctx)=>{
  if(['exact','minimum'].includes(p.kind)){
    try{if(p.amount===null||p.denomination===null||moneyToBits(p.amount,p.denomination)!==p.bits)throw new Error();}
    catch{ctx.addIssue({code:'custom',message:'Price must have exact currency and bits'});}
  }else if(p.amount!==null||p.denomination!==null||p.bits!==null)ctx.addIssue({code:'custom',message:'Unknown/variable price is not zero'});
});
const Armor=z.object({classification:z.enum(['clothing','light','medium','heavy']),defense:z.object({base:z.enum(['agility','fixed']),value:z.number().int().nonnegative()}).strict(),
  requiredStrength:z.number().int().positive().nullable()}).strict();
const Weapon=z.object({damage:z.object({count:z.number().int().nonnegative(),sides:z.number().int().nonnegative(),modifier:z.number().int()}).strict(),
  hands:z.enum(['off','one','two']),requirement:z.object({attribute:z.enum(['none','strength','strength-or-agility']),minimum:z.number().int().positive().nullable()}).strict(),
  properties:z.array(Id),range:z.enum(['short','medium','long']).nullable(),ammunition:Id.nullable(),defensive:z.number().int().nonnegative(),reach:z.number().int().nonnegative()}).strict();
export const PilotItemSchema=z.object({id:Id,name:Id,sourceId:Id,evidenceIds:z.array(Id).min(1),
  category:z.enum(['apparel','armor','weapon','gear','tool','consumable','ammunition','animal-gear','animal','incantation','generic-grant','special-outcome']),
  definitionStatus:z.enum(['published-core','source-grant-only','source-outcome-only']),price:ItemPriceSchema,
  availability:z.enum(['common','uncommon','rare','exotic']).nullable(),armor:Armor.nullable(),weapon:Weapon.nullable(),
  resources:z.array(z.object({quantity:z.number().int().positive(),unit:Id,recovery:z.enum(['not-specified','as-published-text'])}).strict()),
  ruleEvidenceIds:z.array(Id),sourceText:Id.nullable(),restrictions:z.array(Id),
  automaticPurchase:z.literal(false),automaticEffects:z.literal(false),editable:z.literal(true),
}).strict();
export const ItemReferenceSchema=z.object({id:Id,originKind:z.enum(['starting-grant','interesting-thing']),originId:Id,path:Id,sourceId:Id,evidenceIds:z.array(Id).min(1),label:Id,
  recordKind:z.enum(['item','companion','vehicle','property','entitlement','incantation','object','relationship','narrative','mixed','dependency','text-reference','currency']),
  resolution:z.enum(['exact-definition','choice-required','generic-editable','special-preserved','non-inventory','currency-preserved']),
  itemId:Id.nullable(),candidateItemIds:z.array(Id),grantQuantity:z.unknown(),grantUnit:Id.nullable(),declaredWorth:z.unknown(),
  reason:Id,creationRecordAllowed:z.boolean(),automaticMechanicsAllowed:z.literal(false),
}).strict();
export const PilotItemCatalogSchema=z.object({items:z.array(PilotItemSchema),references:z.array(ItemReferenceSchema)}).strict().superRefine((c,ctx)=>{
  const issue=(message:string)=>ctx.addIssue({code:'custom',message});
  const items=new Map(c.items.map(i=>[i.id,i]));if(items.size!==c.items.length)issue('Duplicate item identity');
  if(new Set(c.references.map(r=>r.id)).size!==c.references.length)issue('Duplicate reference identity');
  for(const r of c.references){
    if(r.itemId&&!items.has(r.itemId)||r.candidateItemIds.some(id=>!items.has(id)))issue('Dangling item reference');
    if(['exact-definition','generic-editable','special-preserved'].includes(r.resolution)&&!r.itemId)issue('Resolved reference needs an item');
    if(r.resolution==='choice-required'&&(r.candidateItemIds.length<2||r.itemId!==null))issue('Ambiguous profile cannot resolve automatically');
    if(['non-inventory','currency-preserved'].includes(r.resolution)&&(r.itemId||r.candidateItemIds.length))issue('Non-item cannot become inventory');
  }
});

/** Reference only. Wearing replaces Defense; this never adds armor to a previous Defense. */
export function previewArmorDefinition(itemInput:unknown,input:unknown){
  const item=PilotItemSchema.parse(itemInput),q=z.object({agility:z.number().int(),strength:z.number().int(),worn:z.boolean()}).strict().parse(input);
  if(!item.armor)throw new Error('No validated armor definition');
  if(!q.worn)return {defense:null,speedPenalty:0,strengthAgilityBanes:0,swimArmorBanes:0,applied:false};
  const armor=item.armor,unmet=armor.requiredStrength!==null&&q.strength<armor.requiredStrength;
  return {defense:armor.defense.base==='agility'?q.agility+armor.defense.value:armor.defense.value,
    speedPenalty:(armor.classification==='heavy'?-2:0)+(unmet?-2:0),strengthAgilityBanes:unmet?1:0,
    swimArmorBanes:armor.classification==='medium'?1:armor.classification==='heavy'?2:0,applied:true};
}
export function previewWeaponDefinition(itemInput:unknown,input:unknown){
  const item=PilotItemSchema.parse(itemInput),q=z.object({strength:z.number().int(),agility:z.number().int(),wielded:z.boolean()}).strict().parse(input);
  if(!item.weapon)throw new Error('No validated weapon definition');
  const w=item.weapon,r=w.requirement,score=r.attribute==='strength-or-agility'?Math.max(q.strength,q.agility):q.strength;
  return {defenseBonus:q.wielded?w.defensive:0,attackBanes:q.wielded?((r.minimum!==null&&score<r.minimum?1:0)+(w.properties.includes('cumbersome')?1:0)):0,
    damage:structuredClone(w.damage),range:w.range,ammunition:w.ammunition,applied:q.wielded,otherCombatRulesApplied:false};
}
/** Exact table lot total; no splitting lots, discounts, stock inference or purchase execution. */
export function quotePublishedLots(itemInput:unknown,lotsInput:unknown){
  const item=PilotItemSchema.parse(itemInput),lots=z.number().int().positive().safe().parse(lotsInput);
  if(item.price.kind!=='exact')throw new Error('A fixed quote requires an exact published price');
  return {bits:(BigInt(item.price.bits!)*BigInt(lots)).toString(),lots,quantity:BigInt(item.price.per.quantity)*BigInt(lots)+'',unit:item.price.per.unit,purchased:false,availabilityChecked:false};
}
