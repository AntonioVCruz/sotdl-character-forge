import {createHash} from 'node:crypto';
import {buildOfficialLocalContext} from './official-local-context';
import {buildProcedureLocalContext} from './procedure-local-context';
import {publishConsumableArtifacts} from './human-l0-consumable-compiler';
import {canonicalJson} from './canonical-json';
import {parseOfficialCoreContext,type OfficialCoreContext} from '../../packages/character-generator/official-core';
import {ProcedureContextSchema,type ProcedureContext} from '../../packages/character-generator/procedure-model';
import {parseHumanL0MechanicalPacks} from '../../packages/curation/human-l0-mechanics';
const sha=(v:unknown)=>createHash('sha256').update(canonicalJson(v)).digest('hex');
export function compileRuntimeArtifacts(coreInput:unknown,procedureInput:unknown,version:string){
  if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error('Explicit semantic artifact version required.');
  const core=parseOfficialCoreContext(coreInput),procedures=ProcedureContextSchema.parse(procedureInput);
  if(procedures.fictionalData||!procedures.policy.enabled||procedures.policy.authority!=='explicit-user-request')throw new Error('Verified local runtime context required.');
  const packs=parseHumanL0MechanicalPacks(procedures.mechanicalPacks);
  if(procedures.sources.core!==core.core.sourceId||packs.some(p=>p.fictionalData))throw new Error('Runtime source/dependency mismatch.');
  for(const table of core.core.tables){
    const counterpart=procedures.tables.find(t=>t.id===table.id&&t.sourceId===table.sourceId);
    if(!counterpart||sha(table.dice)!==sha(counterpart.dice))throw new Error('Runtime Core table bridge mismatch.');
    for(const stream of table.columns){
      const target=counterpart.streams.find(s=>s.id===stream.id);
      const rows=(items:{id:string;min:number|null;max:number|null;text:string;evidenceIds:string[]}[])=>items.map(r=>({id:r.id,min:r.min,max:r.max,text:r.text,evidenceIds:r.evidenceIds}));
      if(!target||sha(rows(stream.rows))!==sha(rows(target.rows)))throw new Error('Runtime Core result bridge mismatch.');
    }
  }
  const entries:{key:string;sourceId:string;handler:string;capability:string}[]=[];
  const add=(scope:string,kind:string,id:string,sourceId:string,handler:string,capability='source-bound-with-explicit-pendings')=>entries.push({key:`${scope}/${kind}/${id}`,sourceId,handler,capability});
  for(const [scope,c] of [['core',core],['procedures',procedures]] as const){
    const tables=scope==='core'?(c as OfficialCoreContext).core.tables:(c as ProcedureContext).tables;
    for(const t of tables){
      add(scope,'table',t.id,t.sourceId,scope==='core'?'official-core':'procedure-graph');
      const streams='columns' in t?t.columns:t.streams;
      for(const stream of streams)for(const row of stream.rows)add(scope,'result',`${t.id}/${stream.id}/${row.id}`,t.sourceId,scope==='core'?'official-core':'procedure-graph');
    }
    for(const item of c.itemDefinitions)add(scope,'item',item.id,item.sourceId,'core-equipment',item.armor||item.weapon?'selected-profile-context-required':'possession-or-explicit-adjudication');
    const programs=scope==='core'?(c as OfficialCoreContext).core.programs:(c as ProcedureContext).programs;
    for(const program of programs)add(scope,'program',program.id,program.sourceId,'previewStartingGrants');
    const plans=scope==='core'?(c as OfficialCoreContext).interestingPlans:(c as ProcedureContext).thingPlans;
    for(const plan of plans)add(scope,'thing-plan',plan.outcomeId,plan.sourceId,'applyInterestingThing',plan.specialProfilePending?'explicit-profile-pending':'creation-with-deferred-use');
    for(const plan of c.backgroundPlans)add(scope,'background-plan',plan.rowId,plan.sourceId,'backgroundValues');
  }
  for(const template of procedures.templates)add('procedures','template',template.id,template.sourceId,'procedure-graph');
  for(const lookup of procedures.lookups)add('procedures','lookup',lookup.tableId,procedures.sources.onlyHuman,'procedure-graph','prior-lifestyle-no-rng');
  entries.sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
  if(new Set(entries.map(e=>e.key)).size!==entries.length)throw new Error('Runtime index has duplicate identities.');
  const bundle={contract:'sotdl.human-l0.runtime-artifacts',contractVersion:'1.0.0',version,distribution:'local-only',fictionalData:false,core,procedures};
  const index={contract:'sotdl.human-l0.runtime-index',contractVersion:'1.0.0',version,contextHashes:{core:sha(core),procedures:sha(procedures)},entries};
  const report={contract:'sotdl.human-l0.runtime-report',contractVersion:'1.0.0',version,bundleSha256:sha(bundle),indexSha256:sha(index),
    contexts:index.contextHashes,inputs:{core:core.core.inputs,procedures:procedures.inputs},
    mechanicalPins:packs.map(p=>({packId:p.packId,version:p.version,dependencies:p.dependencies,sha256:sha(p)})),
    coverage:{coreTables:core.core.tables.length,procedureTables:procedures.tables.length,thingPlans:procedures.thingPlans.length,itemDefinitions:procedures.itemDefinitions.length,indexedEntries:entries.length},
    permission:{sourceStatus:'needs-review',distributionApproved:false,exportEnabled:false},
    exclusions:['Not a catalog import pack','Not a character export','Source-bound handlers retain unsupported contexts and creation blockers','No claim of all complete source-result combinations']};
  return {bundle,index,report,artifacts:new Map([['bundle.json',canonicalJson(bundle)],['index.json',canonicalJson(index)],['report.json',canonicalJson(report)]])};
}
export function verifyRuntimeArtifacts(actual:ReadonlyMap<string,string>,expected:ReturnType<typeof compileRuntimeArtifacts>){
  if(actual.size!==expected.artifacts.size||[...expected.artifacts].some(([name,text])=>actual.get(name)!==text))throw new Error('Runtime artifact differs from independently rebuilt source contexts.');
}
export async function main(args:string[],implementationRoot:string){
  if(!['--write','--check'].includes(args[0])||args.length!==3||args[1]!=='--version')throw new Error('Use --write|--check --version x.y.z');
  const sourceRoot=process.env.SOTDL_LOCAL_SOURCE_ROOT??implementationRoot;
  const core=await buildOfficialLocalContext(sourceRoot,implementationRoot),procedures=await buildProcedureLocalContext(sourceRoot,implementationRoot);
  const result=compileRuntimeArtifacts(core,procedures,args[2]);
  await publishConsumableArtifacts(implementationRoot,`tmp/curation/compiled-real-runtime/${args[2]}`,result,args[0]==='--check');
  console.log(`Real local runtime artifacts ${args[2]}: ${result.index.entries.length} identities; three lots; ${args[0]}; distribution/export disabled.`);
}
