import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {buildOfficialLocalContext} from '../tools/curation/official-local-context';
import {buildProcedureLocalContext} from '../tools/curation/procedure-local-context';
import {calculateOfficialCore,finalizeOfficialCore,selectOfficialBackground,parseOfficialCoreDraft,type OfficialCoreContext,type OfficialCoreDraft} from '../packages/character-generator/official-core';
import {deriveProcedure,performProcedureCommand,calculateProcedure,finalizeProcedure,reopenProcedure} from '../packages/character-generator/procedure-runtime';
import {ProcedureSessionSchema,type ProcedureContext,type ProcedureSession} from '../packages/character-generator/procedure-model';
import * as random from '../packages/random-tables';
import {completeCore,completeProcedure} from './helpers/finalization-paths';

const sourceRoot=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
const available=existsSync(resolve(sourceRoot,'curation/pilot/table-closure.json'));

describe.skipIf(!available)('finalization with locally verified source data',()=>{
  let core:OfficialCoreContext,context:ProcedureContext;
  beforeAll(async()=>{core=await buildOfficialLocalContext(sourceRoot,process.cwd());context=await buildProcedureLocalContext(sourceRoot,process.cwd());},60000);
  it('finalizes Core with deferred use effects, preserves source gates and reopens without drawing',async()=>{
    const d=await completeCore(core),ready=await calculateOfficialCore(d,core);
    expect(ready.completion.blockers.map(p=>p.key)).toEqual([]);expect(ready.completion.deferredUse.length).toBeGreaterThan(0);
    const spy=vi.spyOn(random,'createSubstream');try{
      const finalized=await finalizeOfficialCore(d,core),view=await calculateOfficialCore(parseOfficialCoreDraft(JSON.parse(JSON.stringify(finalized))),core);
      expect(view).toMatchObject({fullyResolved:true,exportEnabled:false,completion:{status:'finalized'}});
      expect(core.core.reviewStatus).toBe('needs-review');expect(spy).not.toHaveBeenCalled();expect(finalized.rolls).toEqual(d.rolls);
      expect(JSON.stringify(finalized)).not.toMatch(/"sourceText"|"excerpt"|"mechanics"/);
    }finally{spy.mockRestore();}
  });
  it('keeps old saves as drafts and invalidates changed optional consequences without erasing earlier faces',async()=>{
    const d=await completeCore(core),legacy={...d} as Partial<OfficialCoreDraft>;delete legacy.finalization;
    expect((await calculateOfficialCore(parseOfficialCoreDraft(legacy),core)).completion.status).toBe('draft');
    const finalized=await finalizeOfficialCore(d,core);
    const changed=await selectOfficialBackground(finalized,core,'manual',core.backgroundPlans.find(p=>p.state?.amount===1)!.rowId);
    const view=await calculateOfficialCore(changed,core);expect(view.fullyResolved).toBe(false);expect(view.completion.invalidationReason).toBeTruthy();
    const reverted=await selectOfficialBackground(changed,core,'none');expect((await calculateOfficialCore(reverted,core)).fullyResolved).toBe(false);
    for(const [key,faces] of Object.entries(d.rolls))expect(reverted.rolls[key]).toEqual(faces);
  });
  it('blocks chosen incomplete steps, equipment conflicts and stale source contexts',async()=>{
    const d=await completeCore(core),finalized=await finalizeOfficialCore(d,core);
    const wrong=structuredClone(core);wrong.implementationSha256='f'.repeat(64);
    await expect(finalizeOfficialCore(finalized,wrong)).rejects.toThrow('source-context-changed');
    const chosen=await selectOfficialBackground(d,core,'manual',core.backgroundPlans.find(p=>p.appearanceChoice)!.rowId);
    expect((await calculateOfficialCore(chosen,core)).completion.blockers.some(p=>p.key.endsWith('/appearance'))).toBe(true);
    await expect(finalizeOfficialCore(chosen,core)).rejects.toThrow('Finalização bloqueada');
    const conflict=structuredClone(finalized);conflict.equipped=['missing'];conflict.equipmentLoadout=[{key:'missing',instance:1,slot:'main'}];
    expect((await calculateOfficialCore(conflict,core)).fullyResolved).toBe(false);
  });
  it('finalizes procedures, reopens exact decisions and returns to draft after changing configuration',async()=>{
    const s=await completeProcedure(context),ready=await calculateProcedure(context,s);
    expect(ready.completion.blockers.map(p=>`${p.key}:${p.code}`)).toEqual([]);
    const spy=vi.spyOn(random,'createSubstream');let final:ProcedureSession;try{
      final=await finalizeProcedure(context,s);
      const reopened=await reopenProcedure(context,JSON.parse(JSON.stringify(final))),view=await calculateProcedure(context,reopened.session);
      expect(view).toMatchObject({fullyResolved:true,exportEnabled:false,completion:{status:'finalized'}});
      expect(spy).not.toHaveBeenCalled();expect(final.events).toEqual(s.events);
    }finally{spy.mockRestore();}
    const changed=performProcedureCommand(context,final!,{type:'config',config:{...deriveProcedure(context,final!).state.config,name:'Changed name'}});
    expect((await calculateProcedure(context,changed)).completion).toMatchObject({status:'draft',canFinalize:true});
    const legacy={...s} as Partial<ProcedureSession>;delete legacy.finalization;
    expect((await calculateProcedure(context,ProcedureSessionSchema.parse(legacy))).fullyResolved).toBe(false);
    const stale={...context,implementationSha256:'f'.repeat(64)};await expect(finalizeProcedure(stale,final!)).rejects.toThrow('mudaram');
  });
  it('finalizes a supported Human Development path with fixed and random Only Human attributes',async()=>{
    for(const attributeMode of ['fixed','random'] as const){
      const s=await completeProcedure(context,{variant:'only-human',procedure:'human-development',attributeMode,coreBenefit:null});
      const ready=await calculateProcedure(context,s);expect(ready.completion.blockers.map(p=>`${p.key}:${p.code}`)).toEqual([]);
      const spy=vi.spyOn(random,'createSubstream');try{
        const finalized=await finalizeProcedure(context,s),view=await calculateProcedure(context,finalized);
        expect(view.fullyResolved).toBe(true);expect(view.exportEnabled).toBe(false);expect(view.graph.initialLifeCount).toBe(0);
        expect((await calculateProcedure(context,(await reopenProcedure(context,JSON.parse(JSON.stringify(finalized)))).session)).fullyResolved).toBe(true);
        expect(finalized.events).toEqual(s.events);expect(spy).not.toHaveBeenCalled();
      }finally{spy.mockRestore();}
    }
  });
});
