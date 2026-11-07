import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {buildProcedureLocalContext} from '../tools/curation/procedure-local-context';
import {completeProcedure} from './helpers/finalization-paths';
import {calculateProcedure,finalizeProcedure,advanceProcedure,createProcedureSession,performProcedureCommand} from '../packages/character-generator/procedure-runtime';
import {defaultProcedureConfig,type ProcedureContext,type ProcedureConfig} from '../packages/character-generator/procedure-model';
import {exportCharacter,importCharacter,serializeCharacter} from '../packages/character-generator/character-export';
import * as random from '../packages/random-tables';
import 'fake-indexeddb/auto';
import {saveCharacter,listCharacters} from '../packages/character-generator/character-library';
const root=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
const combinations:Partial<ProcedureConfig>[]=[];
for(const procedure of ['core','human-development'] as const)for(const variant of ['core','only-human'] as const)for(const attributeMode of (variant==='core'?['fixed']:['fixed','random']) as ('fixed'|'random')[])for(const interestingVariant of ['core','oddities'] as const)
  combinations.push({procedure,variant,attributeMode,interestingVariant,coreBenefit:variant==='core'&&procedure==='core'?'speak-language':null});
describe.skipIf(!existsSync(resolve(root,'curation/pilot/table-closure.json')))('closure source coverage',()=>{
  let c:ProcedureContext;beforeAll(async()=>{c=await buildProcedureLocalContext(root,process.cwd());},60000);
  async function acceptRoundtrip(s:Awaited<ReturnType<typeof completeProcedure>>){
    const before=await calculateProcedure(c,s),spy=vi.spyOn(random,'createSubstream');
    try{
      const final=await finalizeProcedure(c,s),e=await exportCharacter(final,c,true);
      expect(final.events).toEqual(s.events);
      const id=crypto.randomUUID();await saveCharacter({id,mode:'procedures',name:e.sheet.name,state:final,expectedRevision:null});
      const saved=(await listCharacters('procedures')).find(r=>r.id===id)!;
      const reopened=await calculateProcedure(c,saved.state);
      expect(reopened.base?.stats).toEqual(before.base?.stats);expect(reopened.base?.states).toEqual(before.base?.states);
      expect(reopened.material.knownCashBits).toBe(before.material.knownCashBits);
      const exportedAgain=await exportCharacter(saved.state,c,true);expect(exportedAgain).toEqual(e);
      expect(new Set(e.sheet.inventory.map(i=>i.key)).size).toBe(e.sheet.inventory.length);
      expect(await importCharacter(serializeCharacter(e),c)).toEqual(final);expect(spy).not.toHaveBeenCalled();
    }finally{spy.mockRestore();}
  }
  it.each(combinations)('completes supported mechanical/source configuration %j',async config=>{
    const s=await completeProcedure(c,config),v=await calculateProcedure(c,s);
    expect(v.completion.blockers.map(p=>p.key+':'+p.code)).toEqual([]);
    await acceptRoundtrip(s);
  },60000);
  it.each(combinations.flatMap(config=>(['hybrid','random'] as const).map(mode=>({...config,mode}))))('advances and completes a source-driven configuration %j',async options=>{
    const mode=options.mode,config={...defaultProcedureConfig(),...options,allowUniformChoices:mode==='random'};
    let initial=await createProcedureSession(c,'closure-auto-'+mode,config);
    // Recorded physical faces select a bounded child path; subsequent automatic source dice and choices remain active.
    if(config.procedure==='human-development')for(const [key,faces] of Object.entries({'pc/0/age':[1,1,1],'pc/0/build':[3,3,3],'pc/0/family':[1,1,1],'pc/0/parents':[3,3,3],'pc/0/siblings':[1],'pc/0/childhood':[1,1,1]}))initial=performProcedureCommand(c,initial,{type:'record-faces',key,faces});
    const advanced=advanceProcedure(c,initial),added=advanced.events.slice(initial.events.length);
    expect(added.length).toBeGreaterThan(0);
    if(mode==='hybrid')expect(added.every(e=>e.type==='result'&&e.result.method==='roll')).toBe(true);
    const s=await completeProcedure(c,config,advanced),v=await calculateProcedure(c,s);
    expect(v.completion.blockers.map(p=>p.key+':'+p.code)).toEqual([]);
    await acceptRoundtrip(s);
  },60000);
});
