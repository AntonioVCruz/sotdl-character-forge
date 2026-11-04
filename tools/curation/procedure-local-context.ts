import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {buildOfficialLocalContext} from './official-local-context';
import {buildMechanicalArtifacts} from './human-l0-mechanical-compiler';
import {ProcedureContextSchema,ProcedureTemplateSchema} from '../../packages/character-generator/procedure-model';
import {InterestingThingsCatalogSchema} from '../../packages/curation/interesting-things-model';
import {PilotItemCatalogSchema} from '../../packages/curation/pilot-item-model';
import {ThingApplicationPlanSchema} from '../../packages/character-generator/core-interesting-things';

const sha=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
/** Server only. The existing verified Core closure pins all five original pilot files. */
export async function buildProcedureLocalContext(root=process.cwd()){
  const core=await buildOfficialLocalContext(root),mechanics=await buildMechanicalArtifacts(root);
  const read=async(name:string)=>{
    const path=`curation/pilot/${name}.json`,bytes=await readFile(resolve(root,path));
    if(sha(bytes)!==core.core.inputs.find(i=>i.path===path)?.sha256)throw new Error(`Procedure source changed: ${path}`);
    return JSON.parse(bytes.toString('utf8'));
  };
  const closure=await read('table-closure'),professions=await read('professions-languages'),wealth=await read('wealth-equipment'),things=await read('interesting-things'),items=PilotItemCatalogSchema.parse((await read('items')).catalog);
  const policy=z.object({schemaVersion:z.literal(1),date:z.string(),authority:z.literal('explicit-user-request'),scope:z.literal('human-l0-procedures'),enabled:z.literal(true),sources:z.array(z.string()),realDataRequired:z.literal(true),distribution:z.literal('local'),exportEnabled:z.literal(false),deadParents:z.literal('independent-cause-per-parent'),dimensions:z.literal('build-then-age-scale'),lifeCount:z.literal('initial-age-roll'),maxNodes:z.number(),maxCycleSteps:z.number(),maxRelativeDepth:z.number()}).strict().parse(JSON.parse(await readFile(resolve(root,'curation/procedure-local-policy.json'),'utf8')));
  const catalog=InterestingThingsCatalogSchema.parse(things.catalog);
  const templates=professions.developmentGrantTemplates.map((raw:Record<string,unknown>)=>{
    const {kind:_kind,result,...template}=raw;
    const table=closure.tables.find((t:{id:string})=>t.id===raw.tableId);
    const bounds=typeof result==='number'?[result,result]:String(result).endsWith('-or-less')?[-Infinity,Number(String(result).split('-')[0])]:String(result).endsWith('-or-more')?[Number(String(result).split('-')[0]),Infinity]:String(result).split('-').map(Number);
    const rowIds=table?.streams.flatMap((s:{rows:{id:string;min:number|null;max:number|null}[]})=>s.rows.filter(r=>(r.min??-Infinity)<=bounds[1]&&(r.max??Infinity)>=bounds[0]).map(r=>r.id))??[];
    if(!rowIds.length)throw new Error('Procedure template has no source rows');
    return ProcedureTemplateSchema.parse({...template,rowIds});
  });
  const oddities=catalog.tables.filter(t=>t.sourceId!==core.core.sourceId).flatMap(t=>t.outcomes.map(thing=>{
    const reference=items.references.find(r=>r.originKind==='interesting-thing'&&r.originId===thing.id);
    if(!reference)throw new Error('Oddities material reference missing');
    const kind=thing.details.kind==='companion'?'companion':thing.details.kind==='relationship'?'relationship':thing.details.kind==='object'?'item':'narrative';
    return ThingApplicationPlanSchema.parse({outcomeId:thing.id,sourceId:thing.sourceId,evidenceIds:thing.evidenceIds,referenceId:reference.id,
      branches:thing.details.choices.length?thing.details.choices[0].options.map(o=>({optionId:o.id,records:[{key:'result',kind,count:1,unit:'conjunto'}]})):[{optionId:null,records:[{key:'result',kind,count:1,unit:'conjunto'}]}],
      quantities:[...thing.details.quantities.map((q,i)=>({id:`fixed/${i}`,fixed:q.amount,rollId:null,optionId:null,unit:q.unit,role:'contents'})),...thing.details.sideRolls.filter(r=>r.phase==='creation').map(r=>({id:r.id,fixed:null,rollId:r.id,optionId:r.optionId,unit:r.purpose,role:'contents'}))],
      useEffects:[...thing.details.mechanismTags.map(tag=>({tag,reason:'Conservar a regra contextual da fonte; resolver no uso com o mestre.'})),...(thing.details.kind==='mixed'?[{tag:'bundle-composition-review',reason:'Conjunto misto preservado com suas quantidades; conferir os componentes e perfis individuais antes de usar.'}]:[])],
      specialProfilePending:false,specialArmor:null});
  }));
  const implementation=[];
  for(const path of ['packages/character-generator/procedure-model.ts','packages/character-generator/procedure-graph.ts','packages/character-generator/procedure-runtime.ts','tools/curation/procedure-local-context.ts','curation/procedure-local-policy.json'])implementation.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const evidence=new Map<string,unknown>();
  for(const doc of [closure,professions,wealth,things])for(const e of doc.evidence)evidence.set(e.id,{id:e.id,sourceId:e.sourceId,path:e.path,inputSha256:e.inputSha256,startLine:e.startLine,endLine:e.endLine,excerptSha256:e.excerptSha256});
  return ProcedureContextSchema.parse({contract:'sotdl.human-creation',contractVersion:'1.0.0',fictionalData:false,
    policy:{enabled:policy.enabled,authority:policy.authority,deadParents:policy.deadParents,dimensions:policy.dimensions,lifeCount:policy.lifeCount,maxNodes:policy.maxNodes,maxCycleSteps:policy.maxCycleSteps,maxRelativeDepth:policy.maxRelativeDepth},
    sources:{core:core.core.sourceId,onlyHuman:'sotdl:only-human',oddities:'sotdl:oddities-artifacts-and-esoterica'},implementationSha256:sha(JSON.stringify([core.implementationSha256,...implementation])),mechanicalPacks:mechanics.packs,
    tables:closure.tables,lookups:closure.lookups,professions:professions.options,templates,programs:wealth.programs,lifestylePrograms:wealth.lifestylePrograms,professionPrograms:wealth.professionPrograms,extraPrograms:wealth.extraPrograms,
    languageOptions:professions.languageOptions.map(({id,label,defaultAbilities,evidenceIds}:{id:string;label:string;defaultAbilities:string[];evidenceIds:string[]})=>({id,label,defaultAbilities,evidenceIds})),
    thingTables:catalog.tables.map(({id,sourceId,outcomes})=>({id,sourceId,outcomes})),thingVariants:catalog.variants.map(({id,sourceId,selectorId,selectorSides,routes})=>({id,sourceId,selectorId,selectorSides,routes})),thingPlans:[...core.interestingPlans,...oddities],backgroundPlans:core.backgroundPlans,
    itemDefinitions:[...items.items,...core.itemDefinitions.filter(i=>i.id.startsWith('local-ruling:'))],itemReferences:items.references,equipmentRules:core.equipmentRules,evidence:[...evidence.values()],inputs:core.core.inputs});
}
