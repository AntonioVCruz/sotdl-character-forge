import {z} from 'zod';
import {parseCoreLocalDocument,type CoreLocalDocument} from '../curation/human-l0-core-local';
import {parseHumanL0MechanicalPacks,type HumanL0MechanicalPack} from '../curation/human-l0-mechanics';
import {PilotItemSchema} from '../curation/pilot-item-model';
import {previewStartingGrants,type GrantNode} from '../curation/starting-equipment-model';
import {createSubstream,PRNG_VERSION} from '../random-tables';
import {consumableDigest} from '../curation/human-l0-consumable-bundle';
import {newHumanL0Character,parseHumanL0Character,calculateHumanL0Character,type HumanL0Character} from './human-l0';
import {BackgroundPlanSchema,backgroundRolls,backgroundValues,type BackgroundPlan} from './core-background';
import {ThingApplicationPlanSchema,ThingAdjudicationSchema,applyInterestingThing,thingChoiceKey,thingRollKey,type ThingApplicationPlan} from './core-interesting-things';
import {EquipmentRulesSchema,EquipmentPlacementSchema,EquipmentUseContextSchema,emptyEquipmentContext,legacyEquipmentLoadout,composeCoreEquipment,placementsConflict,isNeutralClothing,type EquipmentRules,type EquipmentPlacement} from './core-equipment';
import {FinalizationReceiptSchema,evaluateCharacterCompletion,receiptForCompletion,invalidateFinalization} from './character-finalization';

const CORE='sotdl:shadow-of-the-demon-lord-core';
const fail=(code:string):never=>{throw new Error(`Official Core: ${code}.`);};
export type OfficialCoreContext={schemaVersion:1;fictionalData:false;scope:'human-core-l0';officialGenerationEnabled:true;exportEnabled:false;
  implementationSha256:string;core:CoreLocalDocument;equipmentRules:EquipmentRules;backgroundPlans:BackgroundPlan[];interestingPlans:ThingApplicationPlan[];mechanicalPacks:HumanL0MechanicalPack[];itemDefinitions:z.infer<typeof PilotItemSchema>[]};
/** This activation is local and scoped; it does not reclassify needs-review sources as curated. */
export function parseOfficialCoreContext(input:unknown):OfficialCoreContext {
  const envelope=z.object({schemaVersion:z.literal(1),fictionalData:z.literal(false),scope:z.literal('human-core-l0'),officialGenerationEnabled:z.literal(true),exportEnabled:z.literal(false),implementationSha256:z.string().regex(/^[a-f0-9]{64}$/),core:z.unknown(),equipmentRules:EquipmentRulesSchema,backgroundPlans:z.array(BackgroundPlanSchema),interestingPlans:z.array(ThingApplicationPlanSchema),mechanicalPacks:z.array(z.unknown()),itemDefinitions:z.array(PilotItemSchema)}).strict().safeParse(input);
  if(!envelope.success)return fail('real-local-context-required');
  const core=parseCoreLocalDocument(envelope.data.core),packs=parseHumanL0MechanicalPacks(envelope.data.mechanicalPacks);
  if(core.sourceId!==CORE||packs.length!==1||packs[0].fictionalData||packs[0].source.id!==CORE||packs[0].entities[0].mechanics.variant!=='core')return fail('core-real-sources-required');
  if(envelope.data.itemDefinitions.some(i=>i.sourceId!==CORE))return fail('item-source-mismatch');
  if(new Set(envelope.data.itemDefinitions.map(i=>i.id)).size!==envelope.data.itemDefinitions.length||envelope.data.equipmentRules.sourceId!==CORE||envelope.data.equipmentRules.evidence.some(e=>e.sourceId!==CORE)||envelope.data.equipmentRules.shieldItemIds.some(id=>!envelope.data.itemDefinitions.some(i=>i.id===id&&i.weapon)))return fail('equipment-rule-context-invalid');
  const rows=core.tables.find(t=>t.id==='core:human-background')?.columns[0].rows??[];
  if(envelope.data.backgroundPlans.length!==rows.length||new Set(envelope.data.backgroundPlans.map(p=>p.rowId)).size!==rows.length||envelope.data.backgroundPlans.some(p=>p.sourceId!==CORE||!rows.some(r=>r.id===p.rowId&&JSON.stringify(r.evidenceIds)===JSON.stringify(p.evidenceIds))||p.templateId&&!core.templates.some(t=>t.id===p.templateId)||p.programId&&!core.programs.some(t=>t.id===p.programId)))return fail('background-plan-invalid');
  const plans=envelope.data.interestingPlans;
  if(plans.length!==core.things.length||new Set(plans.map(p=>p.outcomeId)).size!==core.things.length||plans.some(p=>!core.things.some(t=>t.id===p.outcomeId&&t.sourceId===p.sourceId&&JSON.stringify(t.evidenceIds)===JSON.stringify(p.evidenceIds))||!core.materialReferences.some(r=>r.id===p.referenceId&&r.originId===p.outcomeId)||p.specialArmor&&!envelope.data.itemDefinitions.some(i=>i.id===p.specialArmor!.itemId&&i.armor?.classification==='light'&&i.armor.requiredStrength===null)))return fail('interesting-plan-invalid');
  return {...envelope.data,core,mechanicalPacks:packs};
}
const configSchema=z.object({name:z.string().max(200),seed:z.string().trim().min(1).max(200),increase:z.enum(['strength','agility','intellect','will']),
  benefit:z.enum(['random-profession','speak-language']),languageId:z.string(),interestingVariant:z.literal('core'),optionalTables:z.boolean()}).strict();
export type OfficialCoreConfig=z.infer<typeof configSchema>;
export const OfficialCoreDraftSchema=z.object({schemaVersion:z.literal(1),kind:z.literal('sotdl-official-core-draft'),contextSha256:z.string().regex(/^[a-f0-9]{64}$/),prngVersion:z.literal(PRNG_VERSION),config:configSchema,
  character:z.unknown(),rolls:z.record(z.string(),z.array(z.number().int().positive()).min(1).max(10)),choices:z.record(z.string(),z.string()),equipped:z.array(z.string()),
  adjudications:z.record(z.string(),ThingAdjudicationSchema).default({}),
  interestingHistory:z.array(z.discriminatedUnion('type',[
    z.object({type:z.literal('select'),outcomeId:z.string(),mode:z.enum(['manual','random'])}).strict(),
    z.object({type:z.literal('choose'),outcomeId:z.string(),key:z.string(),value:z.string()}).strict(),
    z.object({type:z.literal('adjudicate'),decision:ThingAdjudicationSchema}).strict(),
  ])).default([]),equipmentLoadout:z.array(EquipmentPlacementSchema).nullable().default(null),equipmentUseContext:EquipmentUseContextSchema.default(emptyEquipmentContext),
  equipmentHistory:z.array(z.discriminatedUnion('type',[
    z.object({type:z.literal('loadout'),reason:z.string().min(1),before:z.array(EquipmentPlacementSchema),after:z.array(EquipmentPlacementSchema)}).strict(),
    z.object({type:z.literal('use-context'),context:EquipmentUseContextSchema}).strict(),
  ])).default([]),finalization:FinalizationReceiptSchema.nullable().default(null)}).strict();
export type OfficialCoreDraft=Omit<z.infer<typeof OfficialCoreDraftSchema>,'character'>&{character:HumanL0Character};
export function parseOfficialCoreDraft(input:unknown):OfficialCoreDraft {
  const p=OfficialCoreDraftSchema.safeParse(input);if(!p.success)return fail('draft-invalid');
  if(new Set(p.data.equipped).size!==p.data.equipped.length)return fail('duplicate-equipped-origin');
  if(p.data.equipmentLoadout!==null){const keys=[...new Set(p.data.equipmentLoadout.map(p=>p.key))].sort();if(JSON.stringify(keys)!==JSON.stringify([...p.data.equipped].sort()))return fail('equipment-projection-mismatch');}
  const character=parseHumanL0Character(p.data.character);
  if(character.id!=='official-core-current')return fail('draft-identity-mismatch');
  const created=character.events[0];
  if(character.events.length!==1||created.type!=='create'||created.selection.attributes.mode!=='fixed'||created.selection.attributes.increase!==p.data.config.increase
    ||character.name!==p.data.config.name||created.selection.coreBenefit?.kind!==p.data.config.benefit)return fail('draft-selection-mismatch');
  if(created.selection.coreBenefit.kind==='speak-language'&&created.selection.coreBenefit.languageId!==p.data.config.languageId)return fail('draft-language-mismatch');
  return {...p.data,character};
}
type Row=CoreLocalDocument['tables'][number]['columns'][number]['rows'][number];
export type OfficialPending={key:string;label:string;scope?:'creation'|'use';options?:{id:string;label:string}[]};
export type OfficialInventoryRecord={key:string;programId:string;sourceLabel:string;recordKind:string;quantity:number|null;unit:string;itemId:string|null;profile:'armor'|'weapon'|'none';equipped:boolean;weight?:number|null};
function saveLoadout(d:OfficialCoreDraft,before:EquipmentPlacement[],after:EquipmentPlacement[],reason:string) {
  d.equipmentLoadout=after;d.equipped=[...new Set(after.map(p=>p.key))];d.equipmentHistory.push({type:'loadout',before,after:structuredClone(after),reason});
}
function suspendEquipment(d:OfficialCoreDraft,predicate:(key:string)=>boolean,reason:string) {
  if(d.equipmentLoadout!==null){const before=d.equipmentLoadout,after=before.filter(p=>!predicate(p.key));if(after.length!==before.length)saveLoadout(d,before,after,reason);}
  else d.equipped=d.equipped.filter(k=>!predicate(k));
}
function backgroundSelection(d:OfficialCoreDraft,c:OfficialCoreContext) {
  const mode=d.choices['background/mode']??'none';
  if(!['none','manual','random'].includes(mode))return fail('background-mode-invalid');
  if(mode==='none')return null;
  const row=mode==='random'?selectedRow(d,c,'core:human-background','background/result'):
    c.core.tables.find(t=>t.id==='core:human-background')?.columns[0].rows.find(r=>r.id===d.choices['background/row']);
  if(!row)return fail('background-selection-required');
  const plan=c.backgroundPlans.find(p=>p.rowId===row.id);if(!plan)return fail('background-handler-missing');
  return {row,plan};
}
function selectedRow(d:OfficialCoreDraft,c:OfficialCoreContext,tableId:string,key:string,columnId='main'):Row {
  const table=c.core.tables.find(t=>t.id===tableId),col=table?.columns.find(col=>col.id===columnId),faces=d.rolls[key];
  if(!table||!col||!faces||faces.length!==table.dice.count||faces.some(f=>f>table.dice.sides))return fail('recorded-table-roll-invalid');
  const total=faces.reduce((a,b)=>a+b,0),row=col.rows.find(r=>(r.min===null||total>=r.min)&&(r.max===null||total<=r.max));
  if(!row)return fail('recorded-result-missing');return row;
}
function professionRows(d:OfficialCoreDraft,c:OfficialCoreContext) {
  const count=c.core.startingRights.professionChoices+(d.config.benefit==='random-profession'?1:0);
  return Array.from({length:count},(_,i)=>{
    const key=`profession/${i+1}`,parent=selectedRow(d,c,'core:profession-router',`${key}/category`),target=parent.bindings.find(b=>b.kind==='subtable')?.refId;
    if(!target)return fail('profession-category-missing');
    const row=selectedRow(d,c,target,`${key}/detail`),option=c.core.professions.find(p=>p.id===row.id);
    if(!option)return fail('profession-option-missing');return {key,option};
  });
}
function wealthAndThing(d:OfficialCoreDraft,c:OfficialCoreContext) {
  const wealth=selectedRow(d,c,'core:wealth','wealth'),kit=wealth.bindings.find(b=>b.kind==='lifestyle-kit')?.refId;
  if(!kit)return fail('starting-kit-missing');
  const parent=selectedRow(d,c,'core:thing-router','interesting/category'),target=parent.bindings.find(b=>b.kind==='subtable')?.refId;
  if(!target)return fail('interesting-category-missing');
  const row=selectedRow(d,c,target,'interesting/detail'),thing=c.core.things.find(t=>t.id===(d.choices['interesting/result']??row.id));
  if(!thing)return fail('interesting-result-missing');
  return {wealth,kit,thing};
}
/** The only draw boundary. Replays use recorded faces and never call a random stream. */
function fillRolls(d:OfficialCoreDraft,c:OfficialCoreContext,create=true) {
  const draw=(key:string,count:number,sides:number)=>{
    if(!d.rolls[key]){if(!create)return fail('recorded-roll-missing');const random=createSubstream(d.config.seed,`official-core/${d.contextSha256}/${key}`,0);d.rolls[key]=Array.from({length:count},()=>random.int(sides)+1);}
    if(d.rolls[key].length!==count||d.rolls[key].some(f=>f<1||f>sides))return fail('recorded-roll-invalid');
  };
  const table=(id:string,key:string)=>{const t=c.core.tables.find(t=>t.id===id);if(!t)return fail('table-missing');draw(key,t.dice.count,t.dice.sides);};
  if(d.choices['background/mode']==='random')table('core:human-background','background/result');
  const background=backgroundSelection(d,c);
  if(background)for(const roll of backgroundRolls(background.plan))draw(roll.key,roll.count,roll.sides);
  const count=c.core.startingRights.professionChoices+(d.config.benefit==='random-profession'?1:0);
  for(let i=1;i<=count;i++) {
    const key=`profession/${i}`;table('core:profession-router',`${key}/category`);
    const parent=selectedRow(d,c,'core:profession-router',`${key}/category`),target=parent.bindings.find(b=>b.kind==='subtable')!.refId!;
    table(target,`${key}/detail`);
  }
  table('core:wealth','wealth');table('core:thing-router','interesting/category');
  const route=selectedRow(d,c,'core:thing-router','interesting/category').bindings.find(b=>b.kind==='subtable')!.refId!;
  table(route,'interesting/detail');
  const {kit,thing}=wealthAndThing(d,c),program=c.core.programs.find(p=>p.id===kit)!;
  const visit=(nodes:GrantNode[],prefix:string)=>{for(const n of nodes){const key=`${prefix}/${n.key}`;
    if(n.kind==='choice'){const choice=d.choices[key];if(choice){const option=n.options.find(o=>o.id===choice);if(!option)return fail('kit-choice-invalid');visit(option.grants,`${key}/${option.id}`);}}
    else if(n.kind==='money'){if(n.amount.kind==='dice')draw(`${key}/amount`,n.amount.count,n.amount.sides);}
    else {if(n.quantity.kind==='dice')draw(`${key}/quantity`,n.quantity.count,n.quantity.sides);if(n.worth?.amount.kind==='dice')draw(`${key}/worth`,n.worth.amount.count,n.worth.amount.sides);}
  }};visit(program.grants,program.id);
  if(background?.plan.programId){const extra=c.core.programs.find(p=>p.id===background.plan.programId);if(!extra)return fail('background-program-missing');visit(extra.grants,`background/${background.row.id}/${extra.id}`);}
  const selectedThingOptions=new Set(thing.details.choices.map(choice=>d.choices[thingChoiceKey(thing.id,choice.id)]).filter(Boolean));
  for(const roll of thing.details.sideRolls)if(roll.phase==='creation'&&(roll.optionId===null||selectedThingOptions.has(roll.optionId)))draw(thingRollKey(thing.id,roll.id),roll.count,roll.sides);
  if(d.config.optionalTables)for(const id of ['core:human-age','core:human-build','core:human-personality','core:human-appearance','core:human-religion'])table(id,`optional/${id}`);
}
export async function generateOfficialCore(context:unknown,configInput:unknown):Promise<OfficialCoreDraft> {
  const c=parseOfficialCoreContext(context),config=configSchema.parse(configInput),p=c.mechanicalPacks[0],ref={packId:p.packId,version:p.version,entityId:p.entities[0].id};
  if(config.benefit==='speak-language'&&!c.core.languageOptions.some(l=>l.id===`language:${config.languageId}`))return fail('language-choice-required');
  const character=await newHumanL0Character({schemaVersion:1,contract:'sotdl.human-l0.mechanics',contractVersion:'1.0.0',ancestry:ref,attributes:{mode:'fixed',increase:config.increase},adjustment:null,size:p.entities[0].mechanics.size.choices[0],procedure:{ref,kind:'core'},
    coreBenefit:config.benefit==='random-profession'?{kind:'random-profession',rollEventId:`profession/${c.core.startingRights.professionChoices+1}`}:{kind:'speak-language',languageId:config.languageId}},c.mechanicalPacks,{id:'official-core-current',name:config.name});
  const d:OfficialCoreDraft={schemaVersion:1,kind:'sotdl-official-core-draft',contextSha256:await consumableDigest(c),prngVersion:PRNG_VERSION,config,character,rolls:{},choices:{},equipped:[],adjudications:{},interestingHistory:[],equipmentLoadout:[],equipmentUseContext:emptyEquipmentContext(),equipmentHistory:[],finalization:null};
  fillRolls(d,c);return parseOfficialCoreDraft(d);
}
export async function chooseOfficialCore(input:unknown,context:unknown,key:string,value:string):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
  const equippedBefore=d.equipped.length?(await calculateOfficialCore(d,c)).inventory:[];
  if(key==='interesting/result')return fail('use-interesting-result-command');
  if(d.choices[key]!==value)d.finalization=invalidateFinalization(d.finalization);
  if(key.startsWith('interesting/')){
    const {thing}=wealthAndThing(d,c);
    if(!thing.details.choices.some(ch=>thingChoiceKey(thing.id,ch.id)===key&&ch.options.some(o=>o.id===value)))return fail('interesting-choice-invalid');
    if(d.choices[key]!==value)suspendEquipment(d,k=>k.startsWith(`interesting/${thing.id}/`),'Troca de alternativa de Interesting Thing');
    d.interestingHistory.push({type:'choose',outcomeId:thing.id,key,value});
  }
  d.choices[key]=value;fillRolls(d,c);
  const after=await calculateOfficialCore(d,c);
  if(equippedBefore.length)suspendEquipment(d,key=>equippedBefore.find(i=>i.key===key)?.itemId!==after.inventory.find(i=>i.key===key)?.itemId,'Origem ou definição de equipamento alterada');
  await calculateOfficialCore(d,c);return d;
}
export async function selectOfficialThing(input:unknown,context:unknown,outcomeId?:string):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
  if(outcomeId&&!c.core.things.some(t=>t.id===outcomeId))return fail('interesting-result-invalid');
  const previous=wealthAndThing(d,c).thing.id;
  d.finalization=invalidateFinalization(d.finalization);
  if(outcomeId)d.choices['interesting/result']=outcomeId;else delete d.choices['interesting/result'];
  if(previous!==wealthAndThing(d,c).thing.id)suspendEquipment(d,k=>k.startsWith('interesting/'),'Troca de resultado de Interesting Thing');
  d.interestingHistory.push({type:'select',outcomeId:wealthAndThing(d,c).thing.id,mode:outcomeId?'manual':'random'});
  fillRolls(d,c);await calculateOfficialCore(d,c);return d;
}
export async function adjudicateOfficialThing(input:unknown,context:unknown,decisionInput:unknown):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context),decision=ThingAdjudicationSchema.parse(decisionInput);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
  const {thing}=wealthAndThing(d,c);
  if(!thing.details.gmChoice||thing.id!==decision.outcomeId)return fail('interesting-adjudication-invalid');
  d.finalization=invalidateFinalization(d.finalization);
  if(decision.definition.kind==='published'&&!c.itemDefinitions.some(i=>i.id===(decision.definition as {itemId:string}).itemId&&i.definitionStatus==='published-core'&&i.category==='weapon'))return fail('interesting-weapon-definition-invalid');
  suspendEquipment(d,k=>k.startsWith(`interesting/${thing.id}/`),'Nova definição da arma escolhida pelo mestre');
  d.adjudications[thing.id]=decision;d.interestingHistory.push({type:'adjudicate',decision});await calculateOfficialCore(d,c);return d;
}
/** Change the optional result atomically. Existing faces remain available for audit/replay. */
export async function selectOfficialBackground(input:unknown,context:unknown,mode:'none'|'manual'|'random',rowId?:string):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
  const previous=backgroundSelection(d,c);
  d.finalization=invalidateFinalization(d.finalization);
  d.choices['background/mode']=mode;
  if(mode==='manual')d.choices['background/row']=rowId??'';
  fillRolls(d,c);
  const next=backgroundSelection(d,c);
  if(previous?.row.id!==next?.row.id&&previous){
    const language=d.choices[`background/${previous.row.id}/language`];
    if(language)for(const key of Object.keys(d.choices).filter(k=>k.startsWith('profession/')&&k.endsWith('/literacy')&&d.choices[k]===language)){
      d.choices[`background/history/${previous.row.id}/${key}`]=d.choices[key];delete d.choices[key];
    }
  }
  await calculateOfficialCore(d,c);return d;
}
const equipmentCommandSchema=z.object({key:z.string().min(1),instance:z.number().int().positive().default(1),slot:z.enum(['carried','worn','main','off','both']),replaceConflicts:z.boolean().default(false)}).strict();
export async function configureOfficialEquipment(input:unknown,context:unknown,commandInput:unknown):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context),cmd=equipmentCommandSchema.parse(commandInput),view=await calculateOfficialCore(d,c);
  if(cmd.slot!=='carried'&&!view.inventory.some(r=>r.key===cmd.key&&r.itemId&&r.recordKind==='item'&&r.quantity!==null&&r.quantity>=cmd.instance))return fail('owned-item-required');
  const before=view.equipment.loadout;
  d.finalization=invalidateFinalization(d.finalization);
  let after=before.filter(p=>p.key!==cmd.key||p.instance!==cmd.instance);
  if(cmd.slot!=='carried'){
    const placement:EquipmentPlacement={key:cmd.key,instance:cmd.instance,slot:cmd.slot};
    if(cmd.replaceConflicts){
      const actor=(await calculateHumanL0Character(d.character,c.mechanicalPacks)).stats!;
      if(!composeCoreEquipment({owned:view.inventory,definitions:c.itemDefinitions,loadout:[placement],context:d.equipmentUseContext,rules:c.equipmentRules,actor}).resolved)return fail('equipment-replacement-invalid');
      const neutralKeys=new Set(view.inventory.filter(i=>isNeutralClothing(c.itemDefinitions.find(d=>d.id===i.itemId))).map(i=>i.key));
      after=after.filter(p=>!placementsConflict(p,placement,neutralKeys));
    }
    after.push(placement);
  }
  saveLoadout(d,before,after,cmd.replaceConflicts?'Substituição explícita dos equipamentos em conflito':'Posição de equipamento escolhida');
  await calculateOfficialCore(d,c);return d;
}
export async function equipOfficialCore(input:unknown,context:unknown,key:string,equipped:boolean):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context),view=await calculateOfficialCore(d,c),owned=view.inventory.find(r=>r.key===key),item=c.itemDefinitions.find(i=>i.id===owned?.itemId);
  if(equipped&&view.equipment.loadout.some(p=>p.key===key))return d;
  if(!equipped){d.finalization=invalidateFinalization(d.finalization);saveLoadout(d,view.equipment.loadout,view.equipment.loadout.filter(p=>p.key!==key),'Guardar todas as unidades desta origem');await calculateOfficialCore(d,c);return d;}
  const occupied=view.equipment.loadout.some(p=>p.slot==='main'||p.slot==='both');
  return configureOfficialEquipment(d,c,{key,slot:item?.armor?'worn':item?.weapon?.hands==='two'?'both':item?.weapon?.hands==='off'&&occupied?'off':'main'});
}
export async function useOfficialEquipment(input:unknown,context:unknown,commandInput:unknown):Promise<OfficialCoreDraft> {
  const cmd=z.discriminatedUnion('type',[
    z.object({type:z.literal('mounted'),value:z.boolean()}).strict(),
    z.object({type:z.literal('dual-attack'),targets:z.enum(['one-target','two-targets'])}).strict(),
    z.object({type:z.literal('end-round')}).strict(),
  ]).parse(commandInput);
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context),view=await calculateOfficialCore(d,c);
  d.finalization=invalidateFinalization(d.finalization);
  if(cmd.type==='mounted')d.equipmentUseContext.mounted=cmd.value;
  else if(cmd.type==='end-round')d.equipmentUseContext={...d.equipmentUseContext,dualAttack:'none',suppressedDefensive:[]};
  else {
    if(!view.equipment.dualAttack.eligible)return fail('dual-attack-context-invalid');
    d.equipmentUseContext.dualAttack=cmd.targets;
    for(const weapon of view.equipment.weapons.filter(w=>w.shield))if(!d.equipmentUseContext.suppressedDefensive.some(s=>s.key===weapon.key&&s.instance===weapon.instance&&s.itemId===weapon.itemId))d.equipmentUseContext.suppressedDefensive.push({key:weapon.key,instance:weapon.instance,itemId:weapon.itemId});
  }
  d.equipmentHistory.push({type:'use-context',context:structuredClone(d.equipmentUseContext)});
  await calculateOfficialCore(d,c);return d;
}
export async function calculateOfficialCore(input:unknown,context:unknown) {
  const d=parseOfficialCoreDraft(input),c=parseOfficialCoreContext(context);
  const contextSha256=await consumableDigest(c);
  if(contextSha256!==d.contextSha256)return fail('source-context-changed');
  fillRolls(d,c,false);
  let base=await calculateHumanL0Character(d.character,c.mechanicalPacks);
  if(!base.baseResolved||!base.stats)return fail('mechanical-context-unresolved');
  const pending:OfficialPending[]=[],languages=new Map(base.languages.map(l=>[l.languageId,{id:l.languageId,speak:true,read:false,write:false}]));
  const background=backgroundSelection(d,c),backgroundResult=background?backgroundValues(background.plan,d.rolls):null;
  if(background?.plan.templateId){
    const template=c.core.templates.find(t=>t.id===background.plan.templateId)!;
    if(template.languageChoice){
      const key=`background/${background.row.id}/language`,selected=d.choices[key];
      const options=c.core.languageOptions.filter(l=>!languages.has(l.id.replace(/^language:/,''))).map(l=>({id:l.id.replace(/^language:/,''),label:l.label}));
      if(!selected)pending.push({key,label:'Escolher idioma adicional de Background',options});
      else if(!options.some(o=>o.id===selected))return fail('background-language-invalid');
      else languages.set(selected,{id:selected,speak:true,read:false,write:false});
    }
    for(const grant of template.languages??[]){const language=languages.get(grant.languageId);if(!language||grant.requirePreviouslySpoken&&!language.speak)return fail('background-language-prerequisite');
      for(const ability of grant.abilities)language[ability]=true;}
  }
  const professions=professionRows(d,c).map(({key,option})=>{
    const specialization=(d.choices[`${key}/specialization`]??'').trim();
    if(option.specialization!=='none') {
      if(!specialization)pending.push({key:`${key}/specialization`,label:'Escolher especialização',...(option.subchoices.length?{options:option.subchoices.map(s=>({id:s.id,label:s.label}))}:{})});
      else if(option.subchoices.length&&!option.subchoices.some(s=>s.id===specialization))return fail('profession-specialization-invalid');
    }
    const literate=option.literacy&&(option.literacy.condition==='always'||['poet','writer'].includes(specialization));
    if(literate){const keyLanguage=`${key}/literacy`,target=d.choices[keyLanguage];
      if(!target)pending.push({key:keyLanguage,label:'Escolher idioma já falado para leitura e escrita',options:[...languages.values()].filter(l=>l.speak).map(l=>({id:l.id,label:l.id}))});
      else {const l=languages.get(target);if(!l?.speak)return fail('literacy-spoken-language-required');l.read=true;l.write=true;}}
    return {key,id:option.id,label:option.sourceText,specialization};
  });
  const {wealth,kit,thing}=wealthAndThing(d,c);
  const thingPlan=c.interestingPlans.find(p=>p.outcomeId===thing.id);if(!thingPlan)return fail('interesting-handler-missing');
  const adjudication=d.adjudications[thing.id];
  if(adjudication?.definition.kind==='published'){
    const definitionId=adjudication.definition.itemId;
    if(!c.itemDefinitions.some(i=>i.id===definitionId&&i.definitionStatus==='published-core'&&i.category==='weapon'))return fail('interesting-weapon-definition-invalid');
  }
  const interestingApplication=applyInterestingThing(thingPlan,thing,d.choices,d.rolls,adjudication);
  pending.push(...interestingApplication.pending);
  const material=previewStartingGrants(c.core.programs,{instances:[{eventId:kit,programId:kit,subject:'pc'},...(background?.plan.programId?[{eventId:`background/${background.row.id}/${background.plan.programId}`,programId:background.plan.programId,subject:'pc'}]:[])],choices:d.choices,rolls:d.rolls});
  type RecordGrant={key:string;programId:string;sourceLabel:string;recordKind:string;quantity:number|null;unit:string};
  type Unresolved={kind:string;key:string;options?:{id:string;label:string}[]};
  for(const u of material.unresolved as Unresolved[])pending.push({key:u.key,label:u.kind==='choice'?'Escolher alternativa do kit':'Resolver quantidade do kit',options:u.options});
  const inventory:OfficialInventoryRecord[]=(material.records as RecordGrant[]).map(r=>{
    const path=`grant/${r.key.slice(r.programId.length+1)}`,ref=c.core.materialReferences.find(ref=>ref.originId===r.programId&&ref.path===path);
    let itemId=ref?.itemId??null;
    if(ref?.resolution==='choice-required') {
      const choice=d.choices[`definition/${ref.id}`];
      if(!choice)pending.push({key:`definition/${ref.id}`,label:'Escolher definição de equipamento',options:ref.candidateItemIds.map(id=>({id,label:c.itemDefinitions.find(i=>i.id===id)?.name??id}))});
      else if(!ref.candidateItemIds.includes(choice))return fail('item-definition-choice-invalid');else itemId=choice;
    }
    if(!ref)pending.push({key:`binding/${r.key}`,label:'Vínculo material requer conferência'});
    const item=itemId?c.itemDefinitions.find(i=>i.id===itemId):undefined;
    if(itemId&&!item)pending.push({key:`definition/${r.key}`,label:'Definição de item indisponível'});
    return {...r,itemId,profile:item?.armor?'armor':item?.weapon?'weapon':'none',equipped:d.equipped.includes(r.key)};
  });
  for(const grant of interestingApplication.grants.filter(g=>g.kind==='item'||g.kind==='vehicle')){
    const definition=grant.definitionId?c.itemDefinitions.find(i=>i.id===grant.definitionId):undefined;
    if(grant.definitionId&&!definition)return fail('interesting-definition-unavailable');
    inventory.push({key:grant.key,programId:thing.id,sourceLabel:definition?.name??grant.label,recordKind:grant.kind,quantity:grant.count,unit:grant.unit,
      itemId:grant.definitionId,profile:definition?.armor?'armor':definition?.weapon?'weapon':'none',equipped:d.equipped.includes(grant.key),weight:grant.weight});
  }
  if(background?.plan.keepsake)inventory.push({key:`background/${background.row.id}/keepsake`,programId:background.row.id,sourceLabel:background.row.text,recordKind:'item',quantity:1,unit:'unidade',itemId:null,profile:'none',equipped:false});
  if(background?.plan.appearanceChoice){const key=`background/${background.row.id}/appearance`,options=[{id:'finger',label:'Dedo perdido'},{id:'teeth',label:'Dentes perdidos'},{id:'ear',label:'Orelha perdida'},{id:'scar',label:'Cicatriz'}];
    if(!d.choices[key])pending.push({key,label:'Escolher marca física de Background',options});
    else if(!options.some(o=>o.id===d.choices[key]))return fail('background-appearance-invalid');}
  const loadout=d.equipmentLoadout??legacyEquipmentLoadout(d.equipped,inventory,c.itemDefinitions);
  const equipment=composeCoreEquipment({owned:inventory,definitions:c.itemDefinitions,loadout,context:d.equipmentUseContext,rules:c.equipmentRules,actor:base.stats});
  const equipmentNotes=equipment.restrictions.map(r=>`${r.context}: ${r.banes} bane(s) · ${r.origin}`);
  if(equipment.resolved)base=await calculateHumanL0Character(d.character,c.mechanicalPacks,equipment.armor?[equipment.armor]:[],equipment.defenseBonus?[{origin:'validated-equipment-loadout',defenseDelta:equipment.defenseBonus,speedDelta:0}]:[]);
  else base={...base,stats:null,baseResolved:false,issues:[...base.issues,...equipment.diagnostics.map(d=>d.code)]};
  for(const [i,diagnostic] of equipment.diagnostics.entries())pending.push({key:`equipment/${i}/${diagnostic.code}`,label:diagnostic.label});
  if(background?.plan.state&&backgroundResult?.state!==null&&backgroundResult?.state!==undefined&&base.states)base={...base,states:{...base.states,[background.plan.state.target]:base.states[background.plan.state.target]+backgroundResult.state}};
  if(!base.baseResolved)pending.push({key:'equipment/conflict',label:'Resolver conflito de equipamento'});
  const narrative=d.config.optionalTables?['core:human-age','core:human-build','core:human-personality','core:human-appearance','core:human-religion'].map(id=>({tableId:id,text:selectedRow(d,c,id,`optional/${id}`).text})):[];
  if(d.config.optionalTables)pending.push({key:'optional/build',label:'Registrar dimensões de Build e conferir a descrição escolhida'});
  const {finalization:_receipt,...savedState}=d;
  if(d.config.benefit==='speak-language'&&d.config.languageId===c.mechanicalPacks[0].entities[0].mechanics.baseLanguage.languageId)pending.push({key:'core-benefit/language',label:'O benefício humano exige um idioma diferente do idioma-base.'});
  const optionalOmissions=[...(!d.config.optionalTables?[{key:'core-optional',label:'Tabelas narrativas Core opcionais não escolhidas.'}]:[]),...(!background?[{key:'background',label:'Background opcional não escolhido.'}]:[])];
  const completion=await evaluateCharacterCompletion({contextSha256,savedContextSha256:d.contextSha256,sourceReady:true,mechanicalReady:base.baseResolved&&!!base.stats,materialReady:material.materialComplete&&material.cashComplete,state:savedState,pending,receipt:d.finalization,optionalOmissions});
  return {officialGenerationEnabled:true as const,dataMode:'official-local' as const,scope:'human-core-l0' as const,completion,fullyResolved:completion.fullyResolved,exportEnabled:false as const,
    base,professions,languages:[...languages.values()],wealth:wealth.text,inventory,moneyBits:material.knownCashBits,interestingThing:thing,
    interestingApplication:{...interestingApplication,contextSha256:d.contextSha256},narrative,pending,equipmentNotes,equipment,
    background:background?{rowId:background.row.id,text:background.row.text,sourceId:background.plan.sourceId,evidenceIds:background.plan.evidenceIds,contextSha256:d.contextSha256,
      values:backgroundResult,keepsake:background.plan.keepsake,appearanceChoice:background.plan.appearanceChoice,appearance:d.choices[`background/${background.row.id}/appearance`]??null,
      events:[...(background.plan.state?[{type:'background-state' as const,target:background.plan.state.target,amount:backgroundResult!.state}]:[]),
        ...(background.plan.detail?[{type:'background-narrative-quantity' as const,target:background.plan.detail.key,amount:backgroundResult!.detail}]:[]),
        ...(background.plan.programId?[{type:'background-material-program' as const,programId:background.plan.programId}]:[]),
        ...(background.plan.templateId?[{type:'background-language-template' as const,templateId:background.plan.templateId}]:[])]}:null};
}

/** Finalization is an explicit, source-bound action and never draws missing dice. */
export async function finalizeOfficialCore(input:unknown,context:unknown):Promise<OfficialCoreDraft>{
  const d=structuredClone(parseOfficialCoreDraft(input)),view=await calculateOfficialCore(d,context);
  d.finalization=receiptForCompletion(view.completion);return parseOfficialCoreDraft(d);
}
