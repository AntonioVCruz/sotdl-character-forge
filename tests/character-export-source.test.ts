import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {buildOfficialLocalContext} from '../tools/curation/official-local-context';
import {buildProcedureLocalContext} from '../tools/curation/procedure-local-context';
import {finalizeOfficialCore,selectOfficialBackground,type OfficialCoreContext} from '../packages/character-generator/official-core';
import {finalizeProcedure,performProcedureCommand} from '../packages/character-generator/procedure-runtime';
import type {ProcedureContext} from '../packages/character-generator/procedure-model';
import {exportCharacter,importCharacter,serializeCharacter} from '../packages/character-generator/character-export';
import {characterExportHtml} from '../apps/web/character-export-html';
import {completeCore,completeProcedure} from './helpers/finalization-paths';
import * as random from '../packages/random-tables';
const root=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
describe.skipIf(!existsSync(resolve(root,'curation/pilot/table-closure.json')))('minimal export with verified local sources',()=>{
  let core:OfficialCoreContext,procedure:ProcedureContext;
  beforeAll(async()=>{core=await buildOfficialLocalContext(root,process.cwd());procedure=await buildProcedureLocalContext(root,process.cwd());},60000);
  it('exports and imports finalized Core without RNG and retains deferred use without licensed text',async()=>{
    const d=await finalizeOfficialCore(await completeCore(core),core),spy=vi.spyOn(random,'createSubstream');
    try{
      const e=await exportCharacter(d,core,true),json=serializeCharacter(e);
      expect(await importCharacter(json,core)).toEqual(d);expect(spy).not.toHaveBeenCalled();
      expect(e.sheet.deferredUse.length).toBeGreaterThan(0);expect(core.exportEnabled).toBe(false);
      expect(json).not.toMatch(/"sourceText"|"evidence"|"evidenceIds"|"description"|"excerpt"|"tables"|"mechanics"/);
      expect(characterExportHtml(e)).toContain(e.sheet.moneyBits+' bits');
      for(const changed of [{...e,sheet:{...e.sheet,moneyBits:'999999'}},{...e,sources:[{...e.sources[0],version:'9.9.9'}]},{...e,contextSha256:'f'.repeat(64)}])await expect(importCharacter(JSON.stringify(changed),core)).rejects.toThrow();
      const stale={...core,implementationSha256:'f'.repeat(64)};await expect(importCharacter(json,stale)).rejects.toThrow();
    }finally{spy.mockRestore();}
    const incomplete=await selectOfficialBackground(d,core,'manual',core.backgroundPlans.find(p=>p.appearanceChoice)!.rowId);
    await expect(exportCharacter(incomplete,core,true)).rejects.toThrow('Exportação bloqueada');
  },60000);
  it('checks the selected format and never emits buyer data or mutates the private draft',async()=>{
    const marker='('+'#'+'1234567'+')',draft=await completeCore(core);
    draft.config.seed='Invented private seed '+marker;
    const final=await finalizeOfficialCore(draft,core),before=JSON.stringify(final);
    await expect(exportCharacter(final,core,true)).rejects.toThrow('compra');
    const sheet=await exportCharacter(final,core,true,'sheet');expect(characterExportHtml(sheet)).not.toContain(marker);
    expect(()=>serializeCharacter(sheet)).toThrow('compra');expect(JSON.stringify(final)).toBe(before);
    const named=structuredClone(draft);named.config.name=marker;named.character.name=marker;
    const namedFinal=await finalizeOfficialCore(named,core);
    await expect(exportCharacter(namedFinal,core,true,'sheet')).rejects.toThrow('compra');
  },60000);
  it('pins procedure versions/dependencies and preserves every event and face on import',async()=>{
    const s=await finalizeProcedure(procedure,await completeProcedure(procedure)),spy=vi.spyOn(random,'createSubstream');
    try{
      const e=await exportCharacter(s,procedure,true);expect(e.sources.length).toBe(2);expect(e.sources[1].dependencies.length).toBe(1);
      expect(await importCharacter(serializeCharacter(e),procedure)).toEqual(s);expect(spy).not.toHaveBeenCalled();
      const wrongDependency=structuredClone(e);wrongDependency.sources[1].dependencies[0].version='9.9.9';
      await expect(importCharacter(JSON.stringify(wrongDependency),procedure)).rejects.toThrow('divergentes');
      const edited=performProcedureCommand(procedure,s,{type:'config',config:{...s.initialConfig,name:'Edited'}});
      await expect(exportCharacter(edited,procedure,true)).rejects.toThrow('Exportação bloqueada');
      await expect(importCharacter(serializeCharacter(e),core)).rejects.toThrow('fluxo');
    }finally{spy.mockRestore();}
  },60000);
  it.each(['fixed','random'] as const)('exports supported Only Human Development with %s attributes and dimensions',async attributeMode=>{
    const s=await finalizeProcedure(procedure,await completeProcedure(procedure,{variant:'only-human',procedure:'human-development',attributeMode,coreBenefit:null}));
    const e=await exportCharacter(s,procedure,true),spy=vi.spyOn(random,'createSubstream');
    try{expect(await importCharacter(serializeCharacter(e),procedure)).toEqual(s);expect(spy).not.toHaveBeenCalled();expect(e.sheet.dimensions.initialLifeCount).toBe(0);expect(e.sheet.dimensions.age).toBeGreaterThan(0);}
    finally{spy.mockRestore();}
  },60000);
});
