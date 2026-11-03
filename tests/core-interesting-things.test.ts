import {describe,it,expect} from 'vitest';
import {ThingOutcomeSchema} from '../packages/curation/interesting-things-model';
import {ThingApplicationPlanSchema,applyInterestingThing,thingChoiceKey,thingRollKey,type ThingApplicationPlan} from '../packages/character-generator/core-interesting-things';

/** Invented source and effects; no published result text or real-data artifact. */
const outcome=ThingOutcomeSchema.parse({id:'fictional:result',tableId:'fictional:table',face:1,sourceId:'fictional:source',evidenceIds:['fictional:evidence'],text:'An invented bundle or an invented memory.',mappingStatus:'verified-user-text',reviewNotes:[],
  details:{kind:'mixed',choices:[{id:'form',options:[{id:'bundle',text:'Invented bundle'},{id:'memory',text:'Invented memory'}]}],
    sideRolls:[{id:'units',count:2,sides:4,modifier:1,phase:'creation',purpose:'Invented contents',optionId:'bundle'},{id:'duration',count:1,sides:8,modifier:0,phase:'use',purpose:'Invented duration',optionId:null}],
    quantities:[],declaredWorth:{amount:'2',denomination:'ss',bits:'200',spendable:false},dependencySourceId:null,mechanismTags:[],contextRules:[],gmChoice:false,futureGenerator:null,application:'manual-adjudication',mechanicalEffectsApplied:false}});
const plan:ThingApplicationPlan={outcomeId:outcome.id,sourceId:outcome.sourceId,evidenceIds:outcome.evidenceIds,referenceId:'fictional:reference',
  branches:[{optionId:'bundle',records:[{key:'bundle',kind:'item',count:1,unit:'bundle'}]},{optionId:'memory',records:[{key:'memory',kind:'narrative',count:1,unit:'record'}]}],
  quantities:[{id:'contents',role:'contents',unit:'units',optionId:'bundle',fixed:null,rollId:'units'}],useEffects:[{tag:'invented-use',reason:'Apply only when used in the invented scene.'}],specialProfilePending:false,specialArmor:null};
describe('Interesting Thing creation application with fictional facts',()=>{
  it('keeps the grant pending until a published alternative is selected',()=>{
    const v=applyInterestingThing(plan,outcome,{},{});
    expect(v.grants).toHaveLength(0);expect(v.creationResolved).toBe(false);
    expect(v.pending.find(p=>p.scope==='creation')?.options).toHaveLength(2);
  });
  it('records one bundle with rolled contents, never rolls use dice and never credits asset value',()=>{
    const choices={[thingChoiceKey(outcome.id,'form')]:'bundle'},rolls={[thingRollKey(outcome.id,'units')]:[2,4]};
    const v=applyInterestingThing(plan,outcome,choices,rolls);
    expect(v.grants.map(g=>({kind:g.kind,count:g.count}))).toEqual([{kind:'item',count:1}]);
    expect(v.quantities[0].amount).toBe(7);expect(v.cashDeltaBits).toBe('0');expect(v.declaredWorth?.spendable).toBe(false);
    expect(v.creationResolved).toBe(true);expect(v.fullyApplied).toBe(false);expect(v.deferredUseRolls.map(r=>r.id)).toEqual(['duration']);
    expect(applyInterestingThing(plan,outcome,choices,rolls).events).toEqual(v.events);
  });
  it('suspends inactive branch contents while retaining recorded faces and changes narrative into no physical object',()=>{
    const rolls={[thingRollKey(outcome.id,'units')]:[2,4]};
    const v=applyInterestingThing(plan,outcome,{[thingChoiceKey(outcome.id,'form')]:'memory'},rolls);
    expect(v.grants.map(g=>g.kind)).toEqual(['narrative']);expect(v.quantities).toHaveLength(0);
    expect(rolls[thingRollKey(outcome.id,'units')]).toEqual([2,4]);
  });
  it('rejects invalid alternatives, missing/out-of-bounds creation faces and cross-source application',()=>{
    expect(()=>applyInterestingThing(plan,outcome,{[thingChoiceKey(outcome.id,'form')]:'unknown'},{})).toThrow('choice-invalid');
    for(const faces of [undefined,[0,1],[5,1],[1.5,2],[1]])expect(()=>applyInterestingThing(plan,outcome,{[thingChoiceKey(outcome.id,'form')]:'bundle'},faces?{[thingRollKey(outcome.id,'units')]:faces}:{})).toThrow('creation-roll-invalid');
    expect(()=>applyInterestingThing({...plan,sourceId:'fictional:other'},outcome,{},{})).toThrow('origin-mismatch');
    expect(()=>ThingApplicationPlanSchema.parse({...plan,quantities:[{...plan.quantities[0],fixed:2}]})).toThrow();
  });
  it('requires a concrete GM decision with authorship, never a generic approval',()=>{
    const gm={...outcome,details:{...outcome.details,gmChoice:true}};
    const choices={[thingChoiceKey(outcome.id,'form')]:'memory'};
    expect(applyInterestingThing(plan,gm,choices,{}).creationResolved).toBe(false);
    expect(()=>applyInterestingThing(plan,gm,choices,{},true)).toThrow();
    expect(()=>applyInterestingThing(plan,gm,choices,{},{outcomeId:outcome.id,author:'',reason:'',definition:{kind:'generic',name:'Test'}})).toThrow();
    const v=applyInterestingThing(plan,gm,choices,{},{outcomeId:outcome.id,author:'Fictional GM',reason:'Invented campaign ruling',definition:{kind:'generic',name:'Invented weapon'}});
    expect(v.creationResolved).toBe(true);expect(v.pending.some(p=>p.code==='generic-weapon-profile'&&p.scope==='use')).toBe(true);
  });
});
