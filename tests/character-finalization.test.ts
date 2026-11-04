import {describe,it,expect} from 'vitest';
import {evaluateCharacterCompletion,receiptForCompletion,invalidateFinalization,type FinalizationReceipt} from '../packages/character-generator/character-finalization';

const evaluate=(patch:Partial<Parameters<typeof evaluateCharacterCompletion>[0]>={})=>evaluateCharacterCompletion({contextSha256:'a'.repeat(64),savedContextSha256:'a'.repeat(64),sourceReady:true,
  mechanicalReady:true,materialReady:true,state:{selection:'invented',faces:[2,3]},pending:[],receipt:null,optionalOmissions:[{key:'optional',label:'Invented optional step not selected'}],...patch});

describe('character finalization revalidation with invented facts',()=>{
  it('requires an explicit action even when all creation obligations are resolved',async()=>{
    const ready=await evaluate();expect(ready).toMatchObject({status:'draft',canFinalize:true,fullyResolved:false,exportEnabled:false});
    const receipt=receiptForCompletion(ready),complete=await evaluate({receipt});
    expect(complete).toMatchObject({status:'finalized',fullyResolved:true,exportEnabled:false});
    expect(complete.optionalOmissions).toHaveLength(1);
    expect(Object.keys(receipt).sort()).toEqual(['contextSha256','contract','contractVersion','invalidatedReason','stateSha256']);
  });
  it('retains effects of use without blocking, but selected unresolved creation still blocks',async()=>{
    const use={key:'use',code:'invented-scene-effect',label:'Apply only during an invented scene',scope:'use' as const};
    const ready=await evaluate({pending:[use]});expect(ready.canFinalize).toBe(true);expect(ready.deferredUse).toEqual([use]);
    const incomplete=await evaluate({pending:[use,{key:'optional-chosen',label:'Complete this selected optional step'}]});
    expect(incomplete.canFinalize).toBe(false);expect(incomplete.blockers.map(p=>p.key)).toEqual(['optional-chosen']);
    expect(()=>receiptForCompletion(incomplete)).toThrow('Finalização bloqueada');
  });
  it.each(['sourceReady','mechanicalReady','materialReady'] as const)('blocks a false %s even with a matching receipt',async field=>{
    const receipt=receiptForCompletion(await evaluate()),incomplete=await evaluate({receipt,[field]:false});
    expect(incomplete.status).toBe('draft');expect(incomplete.canFinalize).toBe(false);expect(incomplete.invalidationReason).toBeTruthy();
  });
  it('does not trust a matching saved receipt or an altered context as proof of resolved obligations',async()=>{
    const receipt=receiptForCompletion(await evaluate());
    const pending=await evaluate({receipt,pending:[{key:'required',label:'An unresolved required choice',scope:'creation'}]});
    expect(pending.status).toBe('draft');expect(pending.blockers[0].action).toBeTruthy();
    const changed=await evaluate({receipt,contextSha256:'b'.repeat(64)});
    expect(changed.status).toBe('draft');expect(changed.blockers.some(p=>p.code==='source-context-changed')).toBe(true);
  });
  it('invalidates changes and cannot revive an explicitly invalidated receipt by restoring old content',async()=>{
    const receipt=receiptForCompletion(await evaluate());
    expect((await evaluate({receipt,state:{selection:'other'}})).status).toBe('draft');
    const invalidated=invalidateFinalization(receipt) as FinalizationReceipt;
    expect((await evaluate({receipt:invalidated})).status).toBe('draft');
    const renewed=receiptForCompletion(await evaluate({receipt:invalidated}));
    expect((await evaluate({receipt:renewed})).status).toBe('finalized');
  });
});
