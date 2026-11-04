import {describe,it,expect} from 'vitest';
import {backgroundValues,backgroundRolls,BackgroundPlanSchema,type BackgroundPlan} from '../packages/character-generator/core-background';

/** Invented test plan; no published table text or real-data artifact. */
const plan:BackgroundPlan={rowId:'fictional:row',sourceId:'fictional:source',evidenceIds:['fictional:evidence'],
  state:{target:'insanity',amount:null,dice:{count:2,sides:4,modifier:1,minimum:0}},
  detail:{key:'invented-count',dice:{count:1,sides:8,modifier:-5,minimum:0}},templateId:null,programId:null,keepsake:false,appearanceChoice:false};
describe('background consequence replay with fictional facts',()=>{
  it('sums individual faces, applies modifiers and floors narrative quantities',()=>{
    expect(backgroundValues(plan,{'background/fictional:row/state':[2,4],'background/fictional:row/invented-count':[3]})).toEqual({state:7,detail:0});
    expect(backgroundRolls(plan)).toHaveLength(2);
  });
  it('rejects missing, out-of-bounds, fractional and wrong-cardinality recorded dice',()=>{
    for(const faces of [undefined,[0,2],[5,2],[1.5,2],[2]])expect(()=>backgroundValues({...plan,detail:null},faces?{'background/fictional:row/state':faces}:{})).toThrow('recorded-roll-invalid');
  });
  it('replays constants without dice and preserves typed source evidence',()=>{
    const constant=BackgroundPlanSchema.parse({...plan,detail:null,state:{target:'corruption',amount:3,dice:null}});
    expect(backgroundValues(constant,{})).toEqual({state:3,detail:null});
    expect(constant.evidenceIds).toEqual(['fictional:evidence']);
    expect(()=>BackgroundPlanSchema.parse({...plan,state:{target:'insanity',amount:null,dice:null}})).toThrow();
  });
});
