import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,it,expect,beforeAll} from 'vitest';
import {buildOfficialLocalContext} from '../tools/curation/official-local-context';
import {buildProcedureLocalContext} from '../tools/curation/procedure-local-context';
import {compileRuntimeArtifacts,verifyRuntimeArtifacts} from '../tools/curation/runtime-artifact-compiler';
import {completeCore} from './helpers/finalization-paths';
import {generateOfficialCore,calculateOfficialCore,chooseOfficialCore,recordOfficialDimensions,finalizeOfficialCore} from '../packages/character-generator/official-core';
import {exportCharacter,importCharacter,serializeCharacter} from '../packages/character-generator/character-export';
const root=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
describe.skipIf(!existsSync(resolve(root,'curation/pilot/table-closure.json')))('real runtime compilation and optional Core dimensions',()=>{
  let core:Awaited<ReturnType<typeof buildOfficialLocalContext>>,procedure:Awaited<ReturnType<typeof buildProcedureLocalContext>>;
  beforeAll(async()=>{core=await buildOfficialLocalContext(root,process.cwd());procedure=await buildProcedureLocalContext(root,process.cwd());},60000);
  it('compiles all three lots deterministically, with exact index identities and contextual handlers',()=>{
    const a=compileRuntimeArtifacts(core,procedure,'1.0.0'),b=compileRuntimeArtifacts(core,procedure,'1.0.0');
    expect([...a.artifacts]).toEqual([...b.artifacts]);verifyRuntimeArtifacts(a.artifacts,b);
    expect(new Set(a.index.entries.map(e=>e.key)).size).toBe(a.index.entries.length);
    expect(a.report.coverage).toMatchObject({coreTables:22,procedureTables:74,thingPlans:360});
    expect(a.index.entries.some(e=>e.sourceId===procedure.sources.oddities&&e.handler==='applyInterestingThing')).toBe(true);
    expect(a.report.permission).toEqual({sourceStatus:'needs-review',distributionApproved:false,exportEnabled:false});
    const forged=new Map(a.artifacts),index=JSON.parse(forged.get('index.json')!);index.entries.pop();forged.set('index.json',JSON.stringify(index));
    expect(()=>verifyRuntimeArtifacts(forged,b)).toThrow('independently rebuilt');
    forged.delete('report.json');expect(()=>verifyRuntimeArtifacts(forged,b)).toThrow();
    const wrong=structuredClone(procedure);wrong.fictionalData=true;expect(()=>compileRuntimeArtifacts(core,wrong,'1.0.0')).toThrow('Verified');
    const changed=structuredClone(procedure);changed.tables.find(t=>t.id===core.core.tables[0].id)!.streams[0].rows[0].text='Invented changed row';
    expect(()=>compileRuntimeArtifacts(core,changed,'1.0.0')).toThrow('bridge mismatch');
  });
  it('resolves selected narrative dimensions through concrete user input, preserves rolls and reopens the complete sheet',async()=>{
    const base=await completeCore(core);
    let d=await generateOfficialCore(core,{...base.config,optionalTables:true});
    // Reuse only recorded eligible creation choices; all derived obligations are recalculated below.
    d.choices={...base.choices};
    for(let i=0;i<50;i++){
      const v=await calculateOfficialCore(d,core),p=v.pending.find(p=>p.scope!=='use'&&p.key!=='optional/build');if(!p)break;
      if(p.options?.length)d=await chooseOfficialCore(d,core,p.key,p.options[0].id);
      else if(p.key.endsWith('/specialization'))d=await chooseOfficialCore(d,core,p.key,'Invented craft');else throw new Error(p.key);
    }
    expect((await calculateOfficialCore(d,core)).completion.blockers.some(p=>p.key==='optional/build')).toBe(true);
    await expect(recordOfficialDimensions(d,core,{height:0,weight:100,age:20,reviewed:true})).rejects.toThrow();
    const recorded=await recordOfficialDimensions(d,core,{height:68,weight:140,age:24,reviewed:true});expect(recorded.rolls).toEqual(d.rolls);
    const v=await calculateOfficialCore(recorded,core);expect(v.completion.blockers).toEqual([]);expect(v.dimensions).toEqual({height:68,weight:140,age:24});
    const final=await finalizeOfficialCore(recorded,core),e=await exportCharacter(final,core,true);expect(e.sheet.dimensions).toEqual(v.dimensions);
    expect(await importCharacter(serializeCharacter(e),core)).toEqual(final);
  },60000);
});
