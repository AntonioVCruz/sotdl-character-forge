import {describe,it,expect,vi} from 'vitest';
import {defaultProcedureConfig,replayProcedureSession} from '../packages/character-generator/procedure-model';
import {createProcedureSession,performProcedureCommand,deriveProcedure,reopenProcedure,advanceProcedure,calculateProcedure} from '../packages/character-generator/procedure-runtime';
import * as random from '../packages/random-tables';
import {inventedProcedureContext as context} from './helpers/procedure-context';


describe('creation commands with invented source data',()=>{
  it('suspends conflicting equipment stats through replay and allows removing an unavailable origin',async()=>{
    const c=context(),initial=await createProcedureSession(c,'equipment');
    const before=await calculateProcedure(c,initial);
    expect(before.base?.stats).not.toBeNull();
    const equipped=performProcedureCommand(c,initial,{type:'equipment',loadout:[{key:'fictional:unavailable',instance:1,slot:'main'}]});
    const conflict=await calculateProcedure(c,equipped);
    expect(conflict.equipment?.resolved).toBe(false);
    expect(conflict.base).toMatchObject({stats:null,baseResolved:false});
    expect(conflict.pending.some(p=>p.code==='owned-item-required')).toBe(true);
    const reopened=await reopenProcedure(c,JSON.parse(JSON.stringify(equipped)));
    expect((await calculateProcedure(c,reopened.session)).base?.stats).toBeNull();
    const stored=performProcedureCommand(c,reopened.session,{type:'equipment',loadout:[]});
    expect((await calculateProcedure(c,stored)).base?.stats).toEqual(before.base?.stats);
    expect(stored.events.slice(0,-1)).toEqual(equipped.events);
  });
  it('starts a new attempt without active equipment from the previous attempt and preserves history',async()=>{
    const c=context(),initial=await createProcedureSession(c,'restart-equipment');
    const equipped=performProcedureCommand(c,initial,{type:'equipment',loadout:[{key:'pc/0/invented-item',instance:1,slot:'main'}]});
    const prior=equipped.events[0];
    if(prior.type!=='equipment')throw new Error('Expected an equipment event');
    prior.useContext={mounted:true,dualAttack:'one-target',suppressedDefensive:[{key:'pc/0/invented-item',instance:1,itemId:'fictional:item'}]};
    const restarted={...equipped,events:[...equipped.events,{type:'restart',id:'creation-2',seq:2}]};
    const {session,state}=replayProcedureSession(restarted);
    expect(state.attempt).toBe(1);expect(state.equipmentLoadout).toEqual([]);
    expect(state.equipmentUseContext).toEqual({mounted:false,dualAttack:'none',suppressedDefensive:[]});
    expect(session.events[0]).toEqual(prior);
    const restored=await reopenProcedure(c,JSON.parse(JSON.stringify(session)));
    expect(restored.graph.root).toBe('pc/1');expect(restored.graph.state.equipmentLoadout).toEqual([]);
  });
  it('records exact source faces, rejects invalid faces and respects locks',async()=>{
    const c=context();let s=await createProcedureSession(c,'test');
    expect(()=>performProcedureCommand(c,s,{type:'record-faces',key:'pc/0/core/wealth',faces:[5,1]})).toThrow();
    s=performProcedureCommand(c,s,{type:'record-faces',key:'pc/0/core/wealth',faces:[4,4]});
    expect(deriveProcedure(c,s).byKey.get('pc/0/core/wealth')?.value).toBe('invented:high');
    s=performProcedureCommand(c,s,{type:'lock',key:'pc/0/core/wealth',locked:true});
    expect(()=>performProcedureCommand(c,s,{type:'roll',key:'pc/0/core/wealth'})).toThrow('Desbloqueie');
  });
  it('reopens without invoking PRNG and refuses a changed context',async()=>{
    const c=context(),s=performProcedureCommand(c,await createProcedureSession(c,'saved'),{type:'roll',key:'pc/0/core/wealth'});
    const spy=vi.spyOn(random,'createSubstream');
    try{expect((await reopenProcedure(c,JSON.parse(JSON.stringify(s)))).session).toEqual(s);expect(spy).not.toHaveBeenCalled();}finally{spy.mockRestore();}
    await expect(reopenProcedure({...c,implementationSha256:'d'.repeat(64)},s)).rejects.toThrow('mudaram');
  });
  it('uses deterministic substreams and never uniformizes a published table',async()=>{
    const c=context(),config={...defaultProcedureConfig(),mode:'hybrid' as const};
    const a=advanceProcedure(c,await createProcedureSession(c,'repeatable',config)),b=advanceProcedure(c,await createProcedureSession(c,'repeatable',config));
    expect(a).toEqual(b);expect(a.events.filter(e=>e.type==='result')).toHaveLength(1);
    expect(()=>performProcedureCommand(c,a,{type:'uniform',key:'pc/0/core/wealth'})).toThrow('consentimento');
    const consenting=await createProcedureSession(c,'consenting',{...config,allowUniformChoices:true});
    expect(()=>performProcedureCommand(c,consenting,{type:'uniform',key:'pc/0/core/wealth'})).toThrow('não permite');
    expect(()=>performProcedureCommand(c,a,{type:'restart'})).toThrow('morte');
  });
});
