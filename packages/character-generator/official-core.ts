import {z} from 'zod';
import {parseCoreLocalDocument,type CoreLocalDocument} from '../curation/human-l0-core-local';
import {parseHumanL0MechanicalPacks,type HumanL0MechanicalPack} from '../curation/human-l0-mechanics';
import {PilotItemSchema,previewArmorDefinition,previewWeaponDefinition} from '../curation/pilot-item-model';
import {previewStartingGrants,type GrantNode} from '../curation/starting-equipment-model';
import {createSubstream,PRNG_VERSION} from '../random-tables';
import {consumableDigest} from '../curation/human-l0-consumable-bundle';
import {newHumanL0Character,parseHumanL0Character,calculateHumanL0Character,type HumanL0Character} from './human-l0';
import {BackgroundPlanSchema,backgroundRolls,backgroundValues,type BackgroundPlan} from './core-background';

const CORE='sotdl:shadow-of-the-demon-lord-core';
const fail=(code:string):never=>{throw new Error(`Official Core: ${code}.`);};
export type OfficialCoreContext={schemaVersion:1;fictionalData:false;scope:'human-core-l0';officialGenerationEnabled:true;exportEnabled:false;
  implementationSha256:string;core:CoreLocalDocument;backgroundPlans:BackgroundPlan[];mechanicalPacks:HumanL0MechanicalPack[];itemDefinitions:z.infer<typeof PilotItemSchema>[]};
/** This activation is local and scoped; it does not reclassify needs-review sources as curated. */
export function parseOfficialCoreContext(input:unknown):OfficialCoreContext {
  const envelope=z.object({schemaVersion:z.literal(1),fictionalData:z.literal(false),scope:z.literal('human-core-l0'),officialGenerationEnabled:z.literal(true),exportEnabled:z.literal(false),implementationSha256:z.string().regex(/^[a-f0-9]{64}$/),core:z.unknown(),backgroundPlans:z.array(BackgroundPlanSchema),mechanicalPacks:z.array(z.unknown()),itemDefinitions:z.array(PilotItemSchema)}).strict().safeParse(input);
  if(!envelope.success)return fail('real-local-context-required');
  const core=parseCoreLocalDocument(envelope.data.core),packs=parseHumanL0MechanicalPacks(envelope.data.mechanicalPacks);
  if(core.sourceId!==CORE||packs.length!==1||packs[0].fictionalData||packs[0].source.id!==CORE||packs[0].entities[0].mechanics.variant!=='core')return fail('core-real-sources-required');
  if(envelope.data.itemDefinitions.some(i=>i.sourceId!==CORE))return fail('item-source-mismatch');
  const rows=core.tables.find(t=>t.id==='core:human-background')?.columns[0].rows??[];
  if(envelope.data.backgroundPlans.length!==rows.length||new Set(envelope.data.backgroundPlans.map(p=>p.rowId)).size!==rows.length||envelope.data.backgroundPlans.some(p=>p.sourceId!==CORE||!rows.some(r=>r.id===p.rowId&&JSON.stringify(r.evidenceIds)===JSON.stringify(p.evidenceIds))||p.templateId&&!core.templates.some(t=>t.id===p.templateId)||p.programId&&!core.programs.some(t=>t.id===p.programId)))return fail('background-plan-invalid');
  return {...envelope.data,core,mechanicalPacks:packs};
}
const configSchema=z.object({name:z.string().max(200),seed:z.string().trim().min(1).max(200),increase:z.enum(['strength','agility','intellect','will']),
  benefit:z.enum(['random-profession','speak-language']),languageId:z.string(),interestingVariant:z.literal('core'),optionalTables:z.boolean()}).strict();
export type OfficialCoreConfig=z.infer<typeof configSchema>;
export const OfficialCoreDraftSchema=z.object({schemaVersion:z.literal(1),kind:z.literal('sotdl-official-core-draft'),contextSha256:z.string().regex(/^[a-f0-9]{64}$/),prngVersion:z.literal(PRNG_VERSION),config:configSchema,
  character:z.unknown(),rolls:z.record(z.string(),z.array(z.number().int().positive()).min(1).max(10)),choices:z.record(z.string(),z.string()),equipped:z.array(z.string())}).strict();
export type OfficialCoreDraft=Omit<z.infer<typeof OfficialCoreDraftSchema>,'character'>&{character:HumanL0Character};
export function parseOfficialCoreDraft(input:unknown):OfficialCoreDraft {
  const p=OfficialCoreDraftSchema.safeParse(input);if(!p.success)return fail('draft-invalid');
  const character=parseHumanL0Character(p.data.character);
  if(character.id!=='official-core-current')return fail('draft-identity-mismatch');
  const created=character.events[0];
  if(character.events.length!==1||created.type!=='create'||created.selection.attributes.mode!=='fixed'||created.selection.attributes.increase!==p.data.config.increase
    ||character.name!==p.data.config.name||created.selection.coreBenefit?.kind!==p.data.config.benefit)return fail('draft-selection-mismatch');
  if(created.selection.coreBenefit.kind==='speak-language'&&created.selection.coreBenefit.languageId!==p.data.config.languageId)return fail('draft-language-mismatch');
  return {...p.data,character};
}
type Row=CoreLocalDocument['tables'][number]['columns'][number]['rows'][number];
export type OfficialPending={key:string;label:string;options?:{id:string;label:string}[]};
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
  const row=selectedRow(d,c,target,'interesting/detail'),thing=c.core.things.find(t=>t.id===row.id);
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
  const selectedThingOptions=new Set(thing.details.choices.map(choice=>d.choices[`interesting/${choice.id}`]).filter(Boolean));
  for(const roll of thing.details.sideRolls)if(roll.phase==='creation'&&(roll.optionId===null||selectedThingOptions.has(roll.optionId)))draw(`interesting/${thing.id}/${roll.id}`,roll.count,roll.sides);
  if(d.config.optionalTables)for(const id of ['core:human-age','core:human-build','core:human-personality','core:human-appearance','core:human-religion'])table(id,`optional/${id}`);
}
export async function generateOfficialCore(context:unknown,configInput:unknown):Promise<OfficialCoreDraft> {
  const c=parseOfficialCoreContext(context),config=configSchema.parse(configInput),p=c.mechanicalPacks[0],ref={packId:p.packId,version:p.version,entityId:p.entities[0].id};
  if(config.benefit==='speak-language'&&!c.core.languageOptions.some(l=>l.id===`language:${config.languageId}`))return fail('language-choice-required');
  const character=await newHumanL0Character({schemaVersion:1,contract:'sotdl.human-l0.mechanics',contractVersion:'1.0.0',ancestry:ref,attributes:{mode:'fixed',increase:config.increase},adjustment:null,size:p.entities[0].mechanics.size.choices[0],procedure:{ref,kind:'core'},
    coreBenefit:config.benefit==='random-profession'?{kind:'random-profession',rollEventId:`profession/${c.core.startingRights.professionChoices+1}`}:{kind:'speak-language',languageId:config.languageId}},c.mechanicalPacks,{id:'official-core-current',name:config.name});
  const d:OfficialCoreDraft={schemaVersion:1,kind:'sotdl-official-core-draft',contextSha256:await consumableDigest(c),prngVersion:PRNG_VERSION,config,character,rolls:{},choices:{},equipped:[]};
  fillRolls(d,c);return parseOfficialCoreDraft(d);
}
export async function chooseOfficialCore(input:unknown,context:unknown,key:string,value:string):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
  d.choices[key]=value;fillRolls(d,c);await calculateOfficialCore(d,c);return d;
}
/** Change the optional result atomically. Existing faces remain available for audit/replay. */
export async function selectOfficialBackground(input:unknown,context:unknown,mode:'none'|'manual'|'random',rowId?:string):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),c=parseOfficialCoreContext(context);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
  const previous=backgroundSelection(d,c);
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
export async function equipOfficialCore(input:unknown,context:unknown,key:string,equipped:boolean):Promise<OfficialCoreDraft> {
  const d=structuredClone(parseOfficialCoreDraft(input)),view=await calculateOfficialCore(d,context);
  if(!view.inventory.some(r=>r.key===key&&r.itemId&&r.recordKind==='item'&&r.quantity!==null&&r.quantity>0))return fail('owned-item-required');
  d.equipped=d.equipped.filter(k=>k!==key);if(equipped)d.equipped.push(key);await calculateOfficialCore(d,context);return d;
}
export async function calculateOfficialCore(input:unknown,context:unknown) {
  const d=parseOfficialCoreDraft(input),c=parseOfficialCoreContext(context);
  if(await consumableDigest(c)!==d.contextSha256)return fail('source-context-changed');
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
    const specialization=d.choices[`${key}/specialization`]??'';
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
  const material=previewStartingGrants(c.core.programs,{instances:[{eventId:kit,programId:kit,subject:'pc'},...(background?.plan.programId?[{eventId:`background/${background.row.id}/${background.plan.programId}`,programId:background.plan.programId,subject:'pc'}]:[])],choices:d.choices,rolls:d.rolls});
  type RecordGrant={key:string;programId:string;sourceLabel:string;recordKind:string;quantity:number|null;unit:string};
  type Unresolved={kind:string;key:string;options?:{id:string;label:string}[]};
  for(const u of material.unresolved as Unresolved[])pending.push({key:u.key,label:u.kind==='choice'?'Escolher alternativa do kit':'Resolver quantidade do kit',options:u.options});
  const inventory=(material.records as RecordGrant[]).map(r=>{
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
  if(background?.plan.keepsake)inventory.push({key:`background/${background.row.id}/keepsake`,programId:background.row.id,sourceLabel:background.row.text,recordKind:'item',quantity:1,unit:'unidade',itemId:null,profile:'none',equipped:false});
  if(background?.plan.appearanceChoice){const key=`background/${background.row.id}/appearance`,options=[{id:'finger',label:'Dedo perdido'},{id:'teeth',label:'Dentes perdidos'},{id:'ear',label:'Orelha perdida'},{id:'scar',label:'Cicatriz'}];
    if(!d.choices[key])pending.push({key,label:'Escolher marca física de Background',options});
    else if(!options.some(o=>o.id===d.choices[key]))return fail('background-appearance-invalid');}
  const armors:{base:'agility'|'fixed';value:number;origin:string;speedDelta:number}[]=[],modifiers:{origin:string;defenseDelta:number;speedDelta:number}[]=[];
  const equipmentNotes:string[]=[];
  for(const key of d.equipped) {
    const owned=inventory.find(r=>r.key===key);if(!owned?.itemId)return fail('equipped-item-unavailable');
    const item=c.itemDefinitions.find(i=>i.id===owned.itemId)!;
    if(item.armor){const r=previewArmorDefinition(item,{agility:base.stats.agility,strength:base.stats.strength,worn:true});
      armors.push({...item.armor.defense,origin:key,speedDelta:r.speedPenalty});
      if(r.strengthAgilityBanes||r.swimArmorBanes)equipmentNotes.push(`${item.name}: ${r.strengthAgilityBanes} bane(s) de Strength/Agility; ${r.swimArmorBanes} ao nadar.`);
    } else if(item.weapon){const r=previewWeaponDefinition(item,{strength:base.stats.strength,agility:base.stats.agility,wielded:true});modifiers.push({origin:key,defenseDelta:r.defenseBonus,speedDelta:0});if(r.attackBanes)equipmentNotes.push(`${item.name}: ${r.attackBanes} bane(s) de ataque.`);}
    else pending.push({key:`equip/${key}`,label:'Efeito de uso sem handler; nenhum bônus inventado'});
  }
  if(armors.length||modifiers.length)base=await calculateHumanL0Character(d.character,c.mechanicalPacks,armors,modifiers);
  if(background?.plan.state&&backgroundResult?.state!==null&&backgroundResult?.state!==undefined&&base.states)base={...base,states:{...base.states,[background.plan.state.target]:base.states[background.plan.state.target]+backgroundResult.state}};
  if(!base.baseResolved)pending.push({key:'equipment/conflict',label:'Resolver conflito de equipamento'});
  for(const choice of thing.details.choices)if(!d.choices[`interesting/${choice.id}`])pending.push({key:`interesting/${choice.id}`,label:'Escolher alternativa de Interesting Thing',options:choice.options.map(o=>({id:o.id,label:o.text}))});
  for(const choice of thing.details.choices){const selected=d.choices[`interesting/${choice.id}`];if(selected&&!choice.options.some(o=>o.id===selected))return fail('interesting-choice-invalid');}
  pending.push({key:`interesting/application/${thing.id}`,label:'Conferir e aplicar integralmente este resultado de Interesting Thing; não contabilizado automaticamente no inventário'});
  const narrative=d.config.optionalTables?['core:human-age','core:human-build','core:human-personality','core:human-appearance','core:human-religion'].map(id=>({tableId:id,text:selectedRow(d,c,id,`optional/${id}`).text})):[];
  if(d.config.optionalTables)pending.push({key:'optional/build',label:'Registrar dimensões de Build e conferir a descrição escolhida'});
  return {officialGenerationEnabled:true as const,dataMode:'official-local' as const,scope:'human-core-l0' as const,fullyResolved:false as const,exportEnabled:false as const,
    base,professions,languages:[...languages.values()],wealth:wealth.text,inventory,moneyBits:material.knownCashBits,interestingThing:thing,narrative,pending,equipmentNotes,
    background:background?{rowId:background.row.id,text:background.row.text,sourceId:background.plan.sourceId,evidenceIds:background.plan.evidenceIds,contextSha256:d.contextSha256,
      values:backgroundResult,keepsake:background.plan.keepsake,appearanceChoice:background.plan.appearanceChoice,appearance:d.choices[`background/${background.row.id}/appearance`]??null,
      events:[...(background.plan.state?[{type:'background-state' as const,target:background.plan.state.target,amount:backgroundResult!.state}]:[]),
        ...(background.plan.detail?[{type:'background-narrative-quantity' as const,target:background.plan.detail.key,amount:backgroundResult!.detail}]:[]),
        ...(background.plan.programId?[{type:'background-material-program' as const,programId:background.plan.programId}]:[]),
        ...(background.plan.templateId?[{type:'background-language-template' as const,templateId:background.plan.templateId}]:[])]}:null};
}
