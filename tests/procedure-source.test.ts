import {existsSync} from 'node:fs';
import {beforeAll,describe,it,expect} from 'vitest';
import {buildProcedureLocalContext} from '../tools/curation/procedure-local-context';
import {createProcedureSession,deriveProcedure,advanceProcedure,reopenProcedure,performProcedureCommand,calculateProcedure} from '../packages/character-generator/procedure-runtime';
import {defaultProcedureConfig,type ProcedureContext} from '../packages/character-generator/procedure-model';

describe.skipIf(!existsSync('curation/pilot/table-closure.json'))('reviewed local creation procedures',()=>{
  let context:ProcedureContext;
  beforeAll(async()=>{context=await buildProcedureLocalContext();},60000);
  it('projects all source tables, directed templates and distinct Interesting Things sources',()=>{
    expect(context.tables).toHaveLength(74);expect(context.templates).toHaveLength(19);
    expect(context.thingPlans).toHaveLength(360);expect(context.lookups).toHaveLength(5);
    expect(context.evidence.every(e=>!('excerpt' in e))).toBe(true);
  });
  it('keeps independent parent death causes and replays without rolling on reopen',async()=>{
    let session=await createProcedureSession(context,'parents',{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development'});
    session=performProcedureCommand(context,session,{type:'record-faces',key:'pc/0/parents',faces:[1,1,1]});
    const graph=deriveProcedure(context,session),causes=graph.nodes.filter(n=>n.key.includes('/parent/')&&n.key.endsWith('/death'));
    expect(causes.map(n=>n.key)).toEqual(['pc/0/parent/father/death','pc/0/parent/mother/death']);
    session=performProcedureCommand(context,session,{type:'roll',key:causes[0].key});
    expect(deriveProcedure(context,session).byKey.get(causes[1].key)?.status).toBe('pending');
    const restored=await reopenProcedure(context,JSON.parse(JSON.stringify(session)));
    expect(restored.graph.nodes).toEqual(deriveProcedure(context,session).nodes);
    expect(JSON.stringify(session)).not.toContain(context.tables[0].streams[0].rows[0].text);
  });
  it('invalidates dependent decisions while keeping independent results and history',async()=>{
    let session=await createProcedureSession(context,'invalidation',{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development'});
    session=performProcedureCommand(context,session,{type:'record-faces',key:'pc/0/parents',faces:[1,1,1]});
    session=performProcedureCommand(context,session,{type:'roll',key:'pc/0/parent/father/death'});
    session=performProcedureCommand(context,session,{type:'roll',key:'pc/0/ancestors'});
    session=performProcedureCommand(context,session,{type:'lock',key:'pc/0/parent/father/death',locked:true});
    const independent=deriveProcedure(context,session).byKey.get('pc/0/ancestors')?.record;
    expect(()=>performProcedureCommand(context,session,{type:'roll',key:'pc/0/parent/father/death'})).toThrow('Desbloqueie');
    session=performProcedureCommand(context,session,{type:'record-faces',key:'pc/0/parents',faces:[1,1,1]});
    expect(deriveProcedure(context,session).byKey.get('pc/0/parent/father/death')?.status).toBe('needs-review');
    expect(deriveProcedure(context,session).byKey.get('pc/0/ancestors')?.record).toEqual(independent);
    expect(session.events.filter(e=>e.type==='result'&&e.key==='pc/0/parents')).toHaveLength(2);
  });
  it('uses bounded source dice in hybrid mode and stops at concrete choices',async()=>{
    const initial=await createProcedureSession(context,'hybrid',{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development',mode:'hybrid'});
    const session=advanceProcedure(context,initial),graph=deriveProcedure(context,session);
    expect(session.events.length).toBeGreaterThan(5);expect(session.events.length).toBeLessThanOrEqual(context.policy.maxNodes);
    expect(session.events.every(e=>e.type==='result'&&e.result.method==='roll')).toBe(true);
    expect(graph.nodes.some(n=>n.kind==='choice'&&n.status==='pending')).toBe(true);
    const view=await calculateProcedure(context,session);expect(view.base?.stats).toBeTruthy();expect(view.fullyResolved).toBe(false);
  });
  it('applies Build before child/adolescent scale and keeps initial life count',async()=>{
    for(const [faces,age,scale,count] of [[[1,1,1],10,0.5,0],[[1,1,2],16,0.75,1]] as const){
      let session=await createProcedureSession(context,`dimensions-${age}`,{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development'});
      for(const command of [{type:'record-faces',key:'pc/0/age',faces:[...faces]},{type:'record-faces',key:'pc/0/build',faces:[6,6,6]},{type:'manual',key:'pc/0/exact-age',value:age},{type:'manual',key:'pc/0/dimension-base',value:'male'},{type:'record-faces',key:'pc/0/build/dimension-change',faces:[1,2,3,4]}] as const)session=performProcedureCommand(context,session,command);
      const graph=deriveProcedure(context,session);
      expect(graph.dimensions).toEqual({height:80*scale,weight:180*scale,age});expect(graph.initialLifeCount).toBe(count);
    }
  });
  it('keeps all six ancestry/attribute/procedure combinations independent',async()=>{
    for(const procedure of ['core','human-development'] as const)for(const variant of ['core','only-human'] as const)for(const attributeMode of (variant==='core'?['fixed']:['fixed','random']) as ('fixed'|'random')[]){
      let session=await createProcedureSession(context,`${procedure}-${variant}-${attributeMode}`,{...defaultProcedureConfig(),procedure,variant,attributeMode,coreBenefit:procedure==='core'&&variant==='core'?'random-profession':null});
      if(attributeMode==='random')for(const a of ['strength','agility','intellect','will'])session=performProcedureCommand(context,session,{type:'record-faces',key:`pc/0/attribute/${a}`,faces:[2]});
      const view=await calculateProcedure(context,session);expect(view.base?.baseResolved).toBe(true);
      if(attributeMode==='random')expect(view.base?.stats?.strength).toBe(10);
      expect(view.graph.nodes.filter(n=>n.kind==='profession'&&n.key.startsWith('pc/0/core/'))).toHaveLength(procedure==='core'?(variant==='core'?3:2):0);
    }
  });
  it('adds prison years without creating new life experiences or double-counting states',async()=>{
    let s=await createProcedureSession(context,'prison',{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development'});
    const faces=(key:string,f:number[])=>{s=performProcedureCommand(context,s,{type:'record-faces',key,faces:f});};
    const choose=(key:string,value:string|number)=>{s=performProcedureCommand(context,s,{type:'manual',key,value});};
    faces('pc/0/age',[1,1,2]);faces('pc/0/family',[1,1,1]);faces('pc/0/childhood',[1,1,1]);
    faces('pc/0/build',[3,3,3]);choose('pc/0/exact-age',16);choose('pc/0/dimension-base','male');
    faces('pc/0/life/0',[1,1,2]);faces('pc/0/life/0/detail',[7]);faces('pc/0/life/0/detail/years',[2,3]);choose('pc/0/life/0/detail/guilt','guilty');
    const first=await calculateProcedure(context,s),again=await calculateProcedure(context,JSON.parse(JSON.stringify(s)));
    expect(first.graph.dimensions).toEqual({height:70,weight:160,age:21});expect(first.graph.initialLifeCount).toBe(1);
    expect(first.graph.nodes.filter(n=>n.tableId==='only-human:life')).toHaveLength(1);
    expect(first.base?.states?.corruption).toBe(1);expect(again.base?.states).toEqual(first.base?.states);
  });
  it('bounds Piety while preserving every religion and the source insanity increments',async()=>{
    const c={...context,policy:{...context.policy,maxCycleSteps:2}};
    let s=await createProcedureSession(c,'piety',{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development'});
    for(let i=0;i<2;i++){
      s=performProcedureCommand(c,s,{type:'record-faces',key:`pc/0/religion/${i}`,faces:[2,2,2]});
      s=performProcedureCommand(c,s,{type:'record-faces',key:`pc/0/piety/${i}`,faces:[1,1,1]});
    }
    const graph=deriveProcedure(c,s);expect(graph.pending.some(p=>p.code==='piety-cycle-bound')).toBe(true);
    expect(graph.nodes.filter(n=>n.tableId==='only-human:religion')).toHaveLength(3);expect(graph.states.reduce((sum,s)=>sum+s.amount,0)).toBe(1);
  });
  it('keeps positive and negative Core traits in independent source columns',async()=>{
    let s=await createProcedureSession(context,'traits',{...defaultProcedureConfig(),optionalCoreTables:['core:role-traits']});
    const nodes=deriveProcedure(context,s).nodes.filter(n=>n.tableId==='core:role-traits');
    expect(nodes.map(n=>n.streamId)).toEqual(['positive','positive','negative']);
    for(const n of nodes)s=performProcedureCommand(context,s,{type:'roll',key:n.key});
    expect(deriveProcedure(context,s).nodes.filter(n=>n.tableId==='core:role-traits').every(n=>n.status==='resolved')).toBe(true);
  });
  it('preserves published selector weights and distinct religious profession dice',()=>{
    const core=context.thingVariants.find(v=>v.id==='core')!,oddities=context.thingVariants.find(v=>v.id==='oddities')!;
    expect(core.selectorSides).toBe(6);expect(core.routes.every(r=>r.max-r.min===0)).toBe(true);
    expect(oddities.selectorSides).toBe(20);expect(oddities.routes.reduce((sum,r)=>sum+r.max-r.min+1,0)).toBe(20);
    expect(new Set(oddities.routes.map(r=>r.max-r.min+1)).size).toBeGreaterThan(1);
    expect(context.tables.find(t=>t.id==='core:profession-religious')?.dice).toEqual({count:1,sides:20});
    expect(context.tables.find(t=>t.id==='only-human:religious')?.dice).toEqual({count:1,sides:6});
    const reference=context.thingTables.flatMap(t=>t.outcomes).find(o=>o.id==='oddities:books:20')!;
    expect(reference.details.kind).toBe('text-reference');expect(reference.details.futureGenerator).toMatchObject({enabled:false});
  });
  it('inherits the concrete family specialization without rerolling it or granting family gear',async()=>{
    let s=await createProcedureSession(context,'family-trade',{...defaultProcedureConfig(),variant:'only-human',coreBenefit:null,procedure:'human-development'});
    for(const command of [
      {type:'record-faces',key:'pc/0/age',faces:[1,1,1]},
      {type:'record-faces',key:'pc/0/family',faces:[1,2,3]},
      {type:'manual',key:'pc/0/family-profession/category',value:'common'},
      {type:'record-faces',key:'pc/0/family-profession/result',faces:[2]},
      {type:'manual',key:'pc/0/family-profession/result/specialization',value:'custom:Invented test craft'},
      {type:'record-faces',key:'pc/0/childhood',faces:[2,2,3]},
    ] as const)s=performProcedureCommand(context,s,command);
    const graph=deriveProcedure(context,s),family=graph.professions.find(p=>p.subject==='pc/0/family-origin')!,inherited=graph.professions.find(p=>p.subject==='pc/0')!;
    expect(inherited.optionId).toBe(family.optionId);expect(inherited.specialization).toBe('Invented test craft');
    expect(graph.nodes.some(n=>n.key.includes('/inherited/specialization'))).toBe(false);
    expect(graph.programs.some(p=>p.eventId.startsWith('pc/0/family-profession/'))).toBe(false);
  });
});
