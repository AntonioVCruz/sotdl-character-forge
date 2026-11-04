import {z} from 'zod';
import {PilotItemSchema,previewArmorDefinition,previewWeaponDefinition} from '../curation/pilot-item-model';

const id=z.string().min(1);
export const EquipmentPlacementSchema=z.object({key:id,instance:z.number().int().positive(),slot:z.enum(['worn','main','off','both','unassigned'])}).strict();
export type EquipmentPlacement=z.infer<typeof EquipmentPlacementSchema>;
export const EquipmentUseContextSchema=z.object({mounted:z.boolean(),dualAttack:z.enum(['none','one-target','two-targets']),
  suppressedDefensive:z.array(z.object({key:id,instance:z.number().int().positive(),itemId:id}).strict())}).strict();
export type EquipmentUseContext=z.infer<typeof EquipmentUseContextSchema>;
export const emptyEquipmentContext=():EquipmentUseContext=>({mounted:false,dualAttack:'none',suppressedDefensive:[]});
export const EquipmentRulesSchema=z.object({contract:z.literal('sotdl.equipment-context'),contractVersion:z.literal('1.0.0'),sourceId:id,
  defensiveStacking:z.enum(['pending','sum','highest']),stackingAuthority:z.enum(['unresolved','explicit-user-request']),shieldItemIds:z.array(id),
  dualAttack:z.object({oneTargetBanes:z.number().int().nonnegative(),twoTargetBanes:z.number().int().nonnegative()}).strict(),
  evidence:z.array(z.object({id,sourceId:id,path:id,inputSha256:z.string().regex(/^[a-f0-9]{64}$/),startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerptSha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict()).min(1),
}).strict().superRefine((r,ctx)=>{
  if(r.defensiveStacking!=='pending'&&r.stackingAuthority!=='explicit-user-request')ctx.addIssue({code:'custom',message:'Defensive stacking requires explicit authority'});
});
export type EquipmentRules=z.infer<typeof EquipmentRulesSchema>;
export type EquipmentOwned={key:string;itemId:string|null;recordKind:string;quantity:number|null};
export const equipmentInstanceId=(p:Pick<EquipmentPlacement,'key'|'instance'>)=>`${p.key}#${p.instance}`;
export const placementHands=(p:EquipmentPlacement)=>p.slot==='both'?['main','off']:p.slot==='main'||p.slot==='off'?[p.slot]:[];
export const isNeutralClothing=(item:z.infer<typeof PilotItemSchema>|undefined)=>!!item?.armor&&item.armor.classification==='clothing'&&item.armor.defense.base==='agility'&&item.armor.defense.value===0&&item.armor.requiredStrength===null;
export const placementsConflict=(a:EquipmentPlacement,b:EquipmentPlacement,neutralKeys:ReadonlySet<string>=new Set())=>a.slot==='worn'&&b.slot==='worn'&&!neutralKeys.has(a.key)&&!neutralKeys.has(b.key)||placementHands(a).some(h=>placementHands(b).includes(h));

/** Older saves with several weapons do not supply enough information to infer their hands. */
export function legacyEquipmentLoadout(keys:string[],owned:EquipmentOwned[],definitions:z.infer<typeof PilotItemSchema>[]):EquipmentPlacement[] {
  const weapons=keys.filter(key=>definitions.find(d=>d.id===owned.find(o=>o.key===key)?.itemId)?.weapon);
  return keys.map(key=>{
    const definition=definitions.find(d=>d.id===owned.find(o=>o.key===key)?.itemId);
    return {key,instance:1,slot:definition?.armor?'worn':weapons.length!==1?'unassigned':definition?.weapon?.hands==='two'?'both':'main'};
  });
}

/** Pure loadout composition: validates physical context, never generates dice or mutates ownership. */
export function composeCoreEquipment(input:{owned:EquipmentOwned[];definitions:unknown;loadout:unknown;context:unknown;rules:unknown;actor:{strength:number;agility:number;size:number}}) {
  const definitions=z.array(PilotItemSchema).parse(input.definitions),loadout=z.array(EquipmentPlacementSchema).parse(input.loadout),context=EquipmentUseContextSchema.parse(input.context),rules=EquipmentRulesSchema.parse(input.rules);
  type Diagnostic={code:string;label:string;refs:string[];blocksStats:boolean};
  const diagnostics:Diagnostic[]=[],seen=new Set<string>();
  const add=(code:string,label:string,refs:string[],blocksStats=true)=>diagnostics.push({code,label,refs,blocksStats});
  if(![0.5,1].includes(input.actor.size)&&loadout.length)add('unsupported-size-context','Este recorte suporta equipamento para Size ½ e 1; outros tamanhos exigem contexto próprio.',loadout.map(equipmentInstanceId));
  const active: {placement:EquipmentPlacement;item:z.infer<typeof PilotItemSchema>}[]=[];
  for(const placement of loadout){
    const ref=equipmentInstanceId(placement),owned=input.owned.find(o=>o.key===placement.key),item=definitions.find(d=>d.id===owned?.itemId);
    if(seen.has(ref)){add('duplicate-instance','A mesma unidade foi posicionada mais de uma vez.',[ref]);continue;}seen.add(ref);
    if(!owned||owned.recordKind!=='item'||owned.quantity===null||!Number.isInteger(owned.quantity)||owned.quantity<placement.instance||!item){add('owned-item-required','A unidade equipada precisa de posse e definição exatas disponíveis.',[ref]);continue;}
    if(placement.slot==='unassigned'){add('hand-required','Defina a mão deste equipamento; o save anterior não registrava essa posição.',[ref]);continue;}
    if(placement.slot==='worn'&&!item.armor||placement.slot!=='worn'&&!item.weapon){add('unsupported-item-profile','A posição escolhida não tem um perfil mecânico compatível.',[ref]);continue;}
    if(item.weapon){
      const hands=item.weapon.hands,mountedOne=context.mounted&&item.weapon.properties.includes('one hand while mounted');
      const allowed=hands==='off'?['main','off']:hands==='one'||mountedOne?['main','both']:['both'];
      if(!allowed.includes(placement.slot))add('weapon-hand-mismatch','Esta arma não permite a mão ou empunhadura escolhida.',[ref]);
      if(item.weapon.properties.includes('size 1')&&input.actor.size<1)add('weapon-size-requirement','A arma exige Size 1 ou maior.',[ref]);
    }
    active.push({placement,item});
  }
  const neutralKeys=new Set(active.filter(a=>isNeutralClothing(a.item)).map(a=>a.placement.key));
  for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++)if(placementsConflict(active[i].placement,active[j].placement,neutralKeys)){
    const armor=active[i].placement.slot==='worn'&&active[j].placement.slot==='worn';
    add(armor?'armor-conflict':'hand-conflict',armor?'Escolha uma única armadura para substituir Defense.':'Duas unidades ocupam a mesma mão.',[equipmentInstanceId(active[i].placement),equipmentInstanceId(active[j].placement)]);
  }
  const armor=active.find(a=>a.placement.slot==='worn'&&!isNeutralClothing(a.item))??active.find(a=>a.placement.slot==='worn'),weapons=active.filter(a=>a.item.weapon&&a.placement.slot!=='worn');
  const armorPreview=armor?previewArmorDefinition(armor.item,{worn:true,agility:input.actor.agility,strength:input.actor.strength}):null;
  const restrictions:{kind:string;origin:string;banes:number;context:string}[]=[];
  if(armor&&armorPreview){
    if(armorPreview.strengthAgilityBanes)restrictions.push({kind:'armor-requirement',origin:equipmentInstanceId(armor.placement),banes:armorPreview.strengthAgilityBanes,context:'strength-and-agility-rolls'});
    if(armorPreview.swimArmorBanes)restrictions.push({kind:'armor-swimming',origin:equipmentInstanceId(armor.placement),banes:armorPreview.swimArmorBanes,context:'strength-swimming'});
  }
  const weaponViews=weapons.map(({placement,item})=>{
    const w=item.weapon!,ref=equipmentInstanceId(placement),preview=previewWeaponDefinition(item,{strength:input.actor.strength,agility:input.actor.agility,wielded:true});
    const suppressed=context.suppressedDefensive.some(s=>s.key===placement.key&&s.instance===placement.instance&&s.itemId===item.id);
    if(preview.attackBanes)restrictions.push({kind:'weapon-attack',origin:ref,banes:preview.attackBanes,context:'attacks-with-this-weapon'});
    const usePending=[];
    if(w.ammunition)usePending.push('Munição e eventual recarga precisam ser resolvidas no uso; a prévia não consome munição.');
    if(w.properties.includes('misfire'))usePending.push('Misfire exige o resultado do ataque e resolução posterior; não é rolado ao equipar.');
    return {ref,key:placement.key,instance:placement.instance,itemId:item.id,name:item.name,slot:placement.slot,shield:rules.shieldItemIds.includes(item.id),
      defensiveBonus:suppressed?0:preview.defenseBonus,defensiveAvailable:suppressed?0:preview.defenseBonus,defensiveSuppressed:suppressed,defensiveStackingSuppressed:false,
      attackBanes:preview.attackBanes+(armorPreview?.strengthAgilityBanes??0),
      damage:{...w.damage,modifier:w.damage.modifier+(w.hands==='one'&&placement.slot==='both'?1:0)},
      reachBonus:w.reach,properties:w.properties,range:w.range,usePending};
  });
  const defensive=weaponViews.filter(w=>w.defensiveBonus>0);
  if(defensive.length>1&&rules.defensiveStacking==='pending')add('defensive-stacking-review','A combinação de bônus defensivos exige adjudicação; os números ficam suspensos.',defensive.map(w=>w.ref));
  const defenseBonus=rules.defensiveStacking==='highest'?Math.max(0,...defensive.map(w=>w.defensiveBonus)):defensive.reduce((sum,w)=>sum+w.defensiveBonus,0);
  if(rules.defensiveStacking==='highest'){
    const winner=defensive.find(w=>w.defensiveBonus===defenseBonus);
    for(const weapon of weaponViews)if(weapon!==winner&&weapon.defensiveBonus>0){weapon.defensiveStackingSuppressed=true;weapon.defensiveBonus=0;}
  }
  const dualEligible=weaponViews.length===2&&weaponViews.some(w=>w.slot==='main')&&weaponViews.some(w=>w.slot==='off')&&!weaponViews.some(w=>w.properties.includes('cumbersome'))&&!diagnostics.some(d=>d.blocksStats);
  const resolved=!diagnostics.some(d=>d.blocksStats);
  return {resolved,loadout,active:active.map(({placement,item})=>({...placement,itemId:item.id,name:item.name,sourceId:item.sourceId,evidenceIds:item.evidenceIds})),diagnostics,
    armor:resolved&&armor?{...armor.item.armor!.defense,origin:equipmentInstanceId(armor.placement),speedDelta:armorPreview?.speedPenalty??0}:null,
    defenseBonus:resolved?defenseBonus:null,speedDelta:resolved?(armorPreview?.speedPenalty??0):null,
    weapons:weaponViews,restrictions,
    tests:{strengthBanes:armorPreview?.strengthAgilityBanes??0,agilityBanes:armorPreview?.strengthAgilityBanes??0,swimmingStrengthBanes:(armorPreview?.strengthAgilityBanes??0)+(armorPreview?.swimArmorBanes??0)},
    dualAttack:{eligible:dualEligible,unavailableReason:dualEligible?null:'Requer duas armas, uma em cada mão, sem cumbersome e sem conflito de equipamento.',mode:context.dualAttack,additionalBanes:context.dualAttack==='one-target'?rules.dualAttack.oneTargetBanes:context.dualAttack==='two-targets'?rules.dualAttack.twoTargetBanes:0},
    breakdown:[...(armor&&armorPreview?[{phase:'defense-replacement',origin:equipmentInstanceId(armor.placement),value:armorPreview.defense!},{phase:'speed-penalty',origin:equipmentInstanceId(armor.placement),value:armorPreview.speedPenalty}]:[]),
      ...weaponViews.map(w=>({phase:'defensive-property',origin:w.ref,value:w.defensiveBonus}))],
    sourceId:rules.sourceId,evidence:rules.evidence,context};
}
