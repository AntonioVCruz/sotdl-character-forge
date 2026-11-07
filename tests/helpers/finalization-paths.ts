import {generateOfficialCore,calculateOfficialCore,chooseOfficialCore,selectOfficialThing,type OfficialCoreContext} from '../../packages/character-generator/official-core';
import {createProcedureSession,deriveProcedure,performProcedureCommand} from '../../packages/character-generator/procedure-runtime';
import {defaultProcedureConfig,type ProcedureContext,type ProcedureConfig,type ProcedureSession} from '../../packages/character-generator/procedure-model';

export async function completeCore(c:OfficialCoreContext){
  let d=await generateOfficialCore(c,{name:'Aceite de finalização',seed:'finalization-core',increase:'strength',benefit:'random-profession',languageId:'',interestingVariant:'core',optionalTables:false});
  const plan=c.interestingPlans.find(p=>p.useEffects.length&&!c.core.things.find(t=>t.id===p.outcomeId)!.details.choices.length&&!c.core.things.find(t=>t.id===p.outcomeId)!.details.gmChoice)!;
  d=await selectOfficialThing(d,c,plan.outcomeId);
  for(let i=0;i<40;i++){
    const p=(await calculateOfficialCore(d,c)).pending.find(p=>p.scope!=='use');if(!p)break;
    if(p.options?.length)d=await chooseOfficialCore(d,c,p.key,p.options[0].id);
    else if(p.key.endsWith('/specialization'))d=await chooseOfficialCore(d,c,p.key,'Invented specialization');
    else throw new Error(`Unsupported acceptance obligation: ${p.key}`);
  }
  return d;
}
export async function completeProcedure(c:ProcedureContext,overrides:Partial<ProcedureConfig>={},initial?:ProcedureSession){
  const config={...defaultProcedureConfig(),interestingVariant:'core' as const,coreBenefit:'speak-language' as const,...overrides};
  let s=initial??await createProcedureSession(c,`finalization-procedure-${config.procedure}-${config.attributeMode}`,config);
  const baseLanguage=c.mechanicalPacks.map(p=>p as {entities:{mechanics:{variant:string;baseLanguage:{languageId:string}}}[]}).find(p=>p.entities[0].mechanics.variant==='core')!.entities[0].mechanics.baseLanguage.languageId;
  for(let i=0;i<100;i++){
    const graph=deriveProcedure(c,s),n=graph.nodes.find(n=>n.kind!=='config'&&n.kind!=='lookup'&&n.status==='pending');if(!n)break;
    if(n.kind==='choice'){
      const option=n.options?.find(o=>o.eligible!==false&&(n.key.endsWith('/core-benefit/language')?o.id!==baseLanguage:true));
      s=performProcedureCommand(c,s,{type:'manual',key:n.key,value:option?.id??'custom:Invented choice'});
    }else if(n.kind==='profession'&&n.manualAllowed){
      const option=n.options?.find(o=>{const p=c.professions.find(p=>p.id===o.id);return p?.specialization==='none'&&!p.literacy;});
      s=option?performProcedureCommand(c,s,{type:'manual',key:n.key,value:option.id}):performProcedureCommand(c,s,{type:'roll',key:n.key});
    }else if(n.kind==='adjudication'){
      const item=c.itemDefinitions.find(i=>i.weapon)!;
      s=performProcedureCommand(c,s,{type:'adjudication',key:n.key,decision:{name:'Invented decision',author:'Acceptance test',reason:'Local acceptance scenario',definitionId:item.id}});
    }else if(n.kind==='number')s=performProcedureCommand(c,s,{type:'manual',key:n.key,value:n.key.endsWith('/exact-age')?10:n.minimum??1});
    else {
      // A source-bound child path avoids extra Life Experience branches in the HD completion scenario.
      const faces=config.procedure==='human-development'?({'pc/0/age':[1,1,1],'pc/0/build':[3,3,3],'pc/0/family':[1,1,1],'pc/0/parents':[3,3,3],'pc/0/siblings':[1],'pc/0/childhood':[1,1,1]} as Record<string,number[]>)[n.key]:undefined;
      const piety=config.procedure==='human-development'&&n.tableId==='only-human:piety'?[2,2,2]:undefined;
      s=performProcedureCommand(c,s,faces||piety?{type:'record-faces',key:n.key,faces:(faces??piety)!}:{type:'roll',key:n.key});
    }
  }
  return s;
}
