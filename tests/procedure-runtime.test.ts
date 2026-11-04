import {describe,it,expect,vi} from 'vitest';
import fixture from '../curation/examples/human-l0-mechanics.synthetic.json';
import {ProcedureContextSchema,defaultProcedureConfig} from '../packages/character-generator/procedure-model';
import {createProcedureSession,performProcedureCommand,deriveProcedure,reopenProcedure,advanceProcedure} from '../packages/character-generator/procedure-runtime';
import * as random from '../packages/random-tables';

// Invented dice and content. No licensed catalog is necessary for these history invariants.
function context(){return ProcedureContextSchema.parse({contract:'sotdl.human-creation',contractVersion:'1.0.0',fictionalData:true,
  policy:{enabled:true,authority:'fictional-test',deadParents:'independent-cause-per-parent',dimensions:'build-then-age-scale',lifeCount:'initial-age-roll',maxNodes:40,maxCycleSteps:2,maxRelativeDepth:0},
  sources:{core:'fictional:core',onlyHuman:'fictional:expanded',oddities:'fictional:objects'},implementationSha256:'a'.repeat(64),mechanicalPacks:fixture.packs,
  tables:[{id:'core:wealth',sourceId:'fictional:core',evidenceIds:['fictional:evidence'],kind:'random',activation:'invented',manualMode:'invented',dice:{count:2,sides:4},streams:[{id:'main',association:'verified-transcription',rows:[{id:'invented:low',min:2,max:5,text:'Invented low result',evidenceIds:['fictional:evidence']},{id:'invented:high',min:6,max:8,text:'Invented high result',evidenceIds:['fictional:evidence']}]}],lookupKeys:[],modifierPolicy:'none',application:'reference-only-manual-effects',automaticGeneration:false,reviewNotes:[]}],
  lookups:[],professions:[],templates:[],programs:[],lifestylePrograms:[],professionPrograms:[],extraPrograms:[],languageOptions:[],thingTables:[],thingVariants:[],thingPlans:[],backgroundPlans:[],itemDefinitions:[],itemReferences:[],
  equipmentRules:{contract:'sotdl.equipment-context',contractVersion:'1.0.0',sourceId:'fictional:core',defensiveStacking:'pending',stackingAuthority:'unresolved',shieldItemIds:[],dualAttack:{oneTargetBanes:0,twoTargetBanes:0},evidence:[{id:'fictional:evidence',sourceId:'fictional:core',path:'fictional/input',inputSha256:'b'.repeat(64),startLine:1,endLine:1,excerptSha256:'c'.repeat(64)}]},evidence:[],inputs:[]});}
describe('creation commands with invented source data',()=>{
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
