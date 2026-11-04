import {createSubstream,PRNG_VERSION} from '../random-tables';
import {previewStartingGrants} from '../curation/starting-equipment-model';
import {parseHumanL0MechanicalPacks} from '../curation/human-l0-mechanics';
import {newHumanL0Character,calculateHumanL0Character} from './human-l0';
import {composeCoreEquipment,type EquipmentPlacement} from './core-equipment';
import {consumableDigest} from '../curation/human-l0-consumable-bundle';
import {buildProcedureGraph} from './procedure-graph';
import {ProcedureContextSchema,ProcedureConfigSchema,ProcedureSessionSchema,ProcedureEventSchema,replayProcedureSession,defaultProcedureConfig,type ProcedureContext,type ProcedureSession,type ProcedureConfig,type ProcedureEvent,type ProcedureNode,type ProcedureAdjudication} from './procedure-model';

/** The context is local source data. A saved session contains decisions and identifiers only. */
export async function createProcedureSession(contextInput:unknown,seed:string,config:ProcedureConfig=defaultProcedureConfig()):Promise<ProcedureSession>{
  const context=ProcedureContextSchema.parse(contextInput);
  if(!context.policy.enabled)throw new Error('Procedimento local desativado.');
  return ProcedureSessionSchema.parse({schemaVersion:1,kind:'sotdl-human-creation-session',id:`creation-${seed}`,seed,prngVersion:PRNG_VERSION,contextSha256:await consumableDigest(context),initialConfig:ProcedureConfigSchema.parse(config),events:[]});
}
export function deriveProcedure(context:ProcedureContext,input:unknown){
  const {session,state}=replayProcedureSession(input);
  return buildProcedureGraph(context,session,state);
}
export async function reopenProcedure(contextInput:unknown,input:unknown){
  const context=ProcedureContextSchema.parse(contextInput),session=ProcedureSessionSchema.parse(input);
  if(!context.policy.enabled||await consumableDigest(context)!==session.contextSha256)throw new Error('Fontes ou implementação mudaram; preserve a sessão para revisão.');
  return {context,session,graph:deriveProcedure(context,session)};
}
export type ProcedureCommand=
  |{type:'roll';key:string}
  |{type:'record-faces';key:string;faces:readonly number[]}
  |{type:'manual';key:string;value:string|number}
  |{type:'uniform';key:string}
  |{type:'adjudication';key:string;decision:ProcedureAdjudication}
  |{type:'lock';key:string;locked:boolean}
  |{type:'config';config:ProcedureConfig}
  |{type:'equipment';loadout:EquipmentPlacement[]}
  |{type:'restart'};
function append(session:ProcedureSession,event:Record<string,unknown>){
  const seq=session.events.length+1;
  return ProcedureSessionSchema.parse({...session,events:[...session.events,ProcedureEventSchema.parse({...event,id:`creation-${seq}`,seq})]});
}
function rollFaces(context:ProcedureContext,node:ProcedureNode,rng:ReturnType<typeof createSubstream>):number[]{
  if(node.kind==='profession'){
    let table=context.tables.find(t=>t.id===node.tableId);
    if(!table?.dice)throw new Error('Tabela profissional sem dados.');
    const prefix:number[]=[];
    if(table.id.endsWith('profession-router')){
      const face=rng.int(table.dice.sides)+1;prefix.push(face);
      const route=table.streams[0].rows.find(r=>(r.min===null||face>=r.min)&&(r.max===null||face<=r.max));
      table=context.tables.find(t=>t.id===route?.text);
    }
    if(!table?.dice)throw new Error('Rota profissional indisponível.');
    return prefix.concat(Array.from({length:table.dice.count},()=>rng.int(table!.dice!.sides)+1));
  }
  const dice=node.kind==='table'?context.tables.find(t=>t.id===node.tableId)?.dice:node.dice;
  if(!dice)throw new Error('Esta etapa exige uma escolha concreta.');
  return Array.from({length:dice.count},()=>rng.int(dice.sides)+1);
}
export function performProcedureCommand(context:ProcedureContext,input:unknown,command:ProcedureCommand):ProcedureSession{
  const {session,state}=replayProcedureSession(input),graph=buildProcedureGraph(context,session,state);
  if(!context.policy.enabled)throw new Error('Procedimento local desativado.');
  if(command.type==='config')return append(session,{type:'config',config:ProcedureConfigSchema.parse(command.config)});
  if(command.type==='equipment')return append(session,{type:'equipment',loadout:command.loadout,useContext:state.equipmentUseContext});
  if(command.type==='restart'){
    const allowed=graph.nodes.some(n=>n.kind==='choice'&&n.key.endsWith('/death-choice')&&n.status==='resolved'&&n.value==='restart');
    if(!allowed)throw new Error('Reinício exige a decisão explícita após morte na criação.');
    return append(session,{type:'restart'});
  }
  const node=graph.byKey.get(command.key);
  if(!node)throw new Error('Etapa ausente do percurso atual.');
  if(command.type==='lock')return append(session,{type:'lock',key:node.key,locked:command.locked});
  if(node.locked)throw new Error('Desbloqueie a etapa antes de alterar seu resultado.');
  if(node.kind==='config'||node.kind==='lookup'||node.status==='blocked')throw new Error('Etapa automática ou dependências pendentes.');
  const index=session.events.filter(e=>e.type==='result'&&e.key===node.key).length,rng=createSubstream(session.seed,node.key,index);
  let result:Extract<ProcedureEvent,{type:'result'}>['result'];
  if(command.type==='roll')result={method:'roll',faces:rollFaces(context,node,rng),rollIndex:index};
  else if(command.type==='record-faces')result={method:'record-faces',faces:[...command.faces]};
  else if(command.type==='manual')result={method:'manual',value:command.value};
  else if(command.type==='adjudication')result={method:'adjudication',decision:command.decision};
  else {
    if(!state.config.allowUniformChoices)throw new Error('Sorteio uniforme exige consentimento explícito.');
    let value:string|number;
    if(node.kind==='choice'){
      const options=node.options?.filter(o=>o.eligible!==false)??[];
      if(!options.length)throw new Error('Nenhuma opção concreta elegível.');value=options[rng.int(options.length)].id;
    }else if(node.kind==='number'&&Number.isInteger(node.minimum)&&Number.isInteger(node.maximum)&&node.maximum!==null&&node.maximum!==undefined){
      value=node.minimum!+rng.int(node.maximum-node.minimum!+1);
    }else throw new Error('Esta etapa não permite sorteio uniforme de opções.');
    result={method:'application-uniform',value,consented:true,rollIndex:index};
  }
  const next=append(session,{type:'result',key:node.key,signature:node.signature,result});
  if(deriveProcedure(context,next).byKey.get(node.key)?.status!=='resolved')throw new Error('Resultado incompatível com a etapa; sessão preservada.');
  return next;
}
/** Advance only source dice, with optional explicitly consented application choices. */
export function advanceProcedure(context:ProcedureContext,input:unknown){
  let session=ProcedureSessionSchema.parse(input),steps=0;
  const config=replayProcedureSession(session).state.config;
  if(config.mode==='manual')return session;
  while(steps++<context.policy.maxNodes){
    const graph=deriveProcedure(context,session);
    const node=graph.nodes.find(n=>!n.locked&&(n.status==='pending'||n.status==='needs-review')&&(
      n.kind==='dice'||n.kind==='table'||n.kind==='profession'||config.mode==='random'&&config.allowUniformChoices&&
      (n.kind==='choice'&&n.options?.some(o=>o.eligible!==false)||n.kind==='number'&&Number.isInteger(n.minimum)&&Number.isInteger(n.maximum))));
    if(!node)break;
    session=performProcedureCommand(context,session,{type:['dice','table','profession'].includes(node.kind)?'roll':'uniform',key:node.key});
  }
  return session;
}

export async function calculateProcedure(context:ProcedureContext,input:unknown){
  const {session,state}=replayProcedureSession(input),graph=deriveProcedure(context,session),config=state.config;
  const choices:Record<string,string>={},rolls:Record<string,number[]>={};
  for(const n of graph.nodes)if(n.status==='resolved'){if(n.kind==='choice')choices[n.key]=String(n.value);if(n.faces.length)rolls[n.key]=n.faces;}
  const material=previewStartingGrants(context.programs,{instances:graph.programs,choices,rolls});
  const inventory=(material.records as {key:string;recordKind:string;quantity:number|null;sourceLabel:string;sourceId:string}[]).map(r=>{
    const binding=graph.materialBindings.find(b=>b.key===r.key),ref=context.itemReferences.find(i=>i.id===binding?.referenceId);
    const definition=binding?.definitionKey?graph.byKey.get(binding.definitionKey):undefined;
    const adjudication=binding?.adjudicationKey?graph.byKey.get(binding.adjudicationKey):undefined;
    const decision=adjudication?.record?.result.method==='adjudication'?adjudication.record.result.decision:null;
    const itemId=decision?.definitionId??(definition?.status==='resolved'?String(definition.value):ref?.resolution==='exact-definition'?ref.itemId:null);
    return {...r,itemId,label:decision?.name??context.itemDefinitions.find(i=>i.id===itemId)?.name??r.sourceLabel};
  });
  for(const thing of graph.things)for(const grant of thing.application.grants){
    const ref=context.itemReferences.find(r=>r.id===grant.referenceId);
    inventory.push({key:`${thing.key}/${grant.key}`,recordKind:grant.kind,quantity:grant.count,sourceLabel:grant.label,sourceId:grant.sourceId,itemId:grant.definitionId??(ref?.resolution==='exact-definition'?ref.itemId:null),label:grant.label});
  }
  const pending=[...graph.pending];
  for(const item of inventory)if(item.itemId&&!context.itemDefinitions.some(d=>d.id===item.itemId))pending.push({key:item.key,code:'invalid-item-definition',label:'Definição de equipamento indisponível; revisar a decisão.',scope:'creation',subject:graph.root});
  const packs=parseHumanL0MechanicalPacks(context.mechanicalPacks),ancestry=packs.find(p=>p.entities[0].mechanics.variant===config.variant)!,procedure=packs.find(p=>p.entities[0].mechanics.procedure.kind===config.procedure)!;
  const ref=(p:typeof ancestry)=>({packId:p.packId,version:p.version,entityId:p.entities[0].id});
  const attributes=['strength','agility','intellect','will'] as const;
  const randomReady=attributes.every(a=>graph.byKey.get(`${graph.root}/attribute/${a}`)?.status==='resolved');
  let base:Awaited<ReturnType<typeof calculateHumanL0Character>>|null=null;
  let equipment:ReturnType<typeof composeCoreEquipment>|null=null;
  const benefitLanguage=graph.nodes.find(n=>n.key===`${graph.root}/core-benefit/language`&&n.status==='resolved');
  if((config.attributeMode==='fixed'||randomReady)&&(config.coreBenefit!=='speak-language'||benefitLanguage)){
    const character=await newHumanL0Character({schemaVersion:1,contract:'sotdl.human-l0.mechanics',contractVersion:'1.0.0',ancestry:ref(ancestry),
      attributes:config.attributeMode==='fixed'?{mode:'fixed',increase:config.increase}:{mode:'random',seed:session.seed,prngVersion:PRNG_VERSION,rolls:attributes.map(attribute=>{const n=graph.byKey.get(`${graph.root}/attribute/${attribute}`)!;return {attribute,eventId:n.record!.id,face:n.faces[0]};})},
      adjustment:config.adjustment,size:graph.finalSize??config.size,procedure:{ref:ref(procedure),kind:config.procedure},
      coreBenefit:config.coreBenefit==='random-profession'?{kind:'random-profession',rollEventId:`${graph.root}/core/profession/2`}:config.coreBenefit==='speak-language'?{kind:'speak-language',languageId:String(benefitLanguage!.value).replace(/^custom:/,'')}:null},packs,{id:session.id,name:config.name});
    base=await calculateHumanL0Character(character,packs);
    if(base.stats){
      equipment=composeCoreEquipment({owned:inventory.filter(i=>i.quantity!==null),definitions:context.itemDefinitions,loadout:state.equipmentLoadout,context:state.equipmentUseContext,rules:context.equipmentRules,actor:base.stats});
      if(equipment.resolved)base=await calculateHumanL0Character(character,packs,equipment.armor?[equipment.armor]:[],equipment.defenseBonus?[{origin:'creation-equipment',defenseDelta:equipment.defenseBonus,speedDelta:0}]:[]);
      else {
        base={...base,stats:null,baseResolved:false,issues:[...base.issues,...equipment.diagnostics.map(d=>d.code)]};
        for(const d of equipment.diagnostics)pending.push({key:`equipment/${d.code}`,code:d.code,label:d.label,scope:'creation',subject:graph.root});
      }
    }
    if(base.states)for(const grant of graph.states.filter(s=>s.subject===graph.root))base.states[grant.target]+=grant.amount;
  }
  return {session,graph,base,equipment,inventory,material,pending,creationResolved:pending.every(p=>p.scope!=='creation'),fullyResolved:false as const,exportEnabled:false as const};
}
