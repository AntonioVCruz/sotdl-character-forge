import {existsSync,readFileSync} from 'node:fs';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {buildOfficialLocalContext} from '../tools/curation/official-local-context';
import {generateOfficialCore,calculateOfficialCore,chooseOfficialCore,selectOfficialThing,adjudicateOfficialThing,equipOfficialCore,parseOfficialCoreDraft,parseOfficialCoreContext,type OfficialCoreContext,type OfficialCoreDraft} from '../packages/character-generator/official-core';
import {thingChoiceKey,thingRollKey} from '../packages/character-generator/core-interesting-things';
import {consumableDigest} from '../packages/curation/human-l0-consumable-bundle';
import {calculateHumanL0Character} from '../packages/character-generator/human-l0';
import * as random from '../packages/random-tables';

const available=existsSync('curation/pilot/interesting-things.json')&&existsSync('curation/pilot/items.json')&&existsSync('curation/pilot/table-closure.json')&&existsSync('rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md');
// Parameter names contain identities only. Licensed source text stays local and is not emitted in assertions.
const ids:string[]=available?JSON.parse(readFileSync('curation/pilot/interesting-things.json','utf8')).catalog.tables.filter((t:{id:string})=>t.id.startsWith('core:')).flatMap((t:{outcomes:{id:string}[]})=>t.outcomes.map(o=>o.id)):[];
describe.skipIf(!available)('Interesting Things Core local source acceptance',()=>{
  let context:OfficialCoreContext,original:OfficialCoreDraft;
  beforeAll(async()=>{
    context=await buildOfficialLocalContext();
    original=await generateOfficialCore(context,{name:'Teste local',seed:'interesting-application-test',increase:'strength',benefit:'random-profession',languageId:'',interestingVariant:'core',optionalTables:false});
  },30000);
  it.each(ids)('applies and replays source result %s with only active branches',async id=>{
    let draft=await selectOfficialThing(original,context,id);
    const thing=context.core.things.find(t=>t.id===id)!;
    let view=await calculateOfficialCore(draft,context);
    const originalMoney=view.moneyBits;
    expect(view.interestingApplication.origin.outcomeId).toBe(id);
    expect(view.pending.some(p=>p.key.startsWith('interesting/application/'))).toBe(false);
    if(thing.details.gmChoice){
      expect(view.interestingApplication.grants).toHaveLength(0);
      const weapon=context.itemDefinitions.find(i=>i.definitionStatus==='published-core'&&i.category==='weapon')!;
      draft=await adjudicateOfficialThing(draft,context,{outcomeId:id,author:'Teste local',reason:'Cenário de aceite local',definition:{kind:'published',itemId:weapon.id}});
    }
    for(const choice of thing.details.choices)for(const option of choice.options){
      draft=await chooseOfficialCore(draft,context,thingChoiceKey(id,choice.id),option.id);
      view=await calculateOfficialCore(draft,context);
      expect(view.interestingApplication.selectedAlternatives.map(o=>o.id)).toContain(option.id);
      expect(view.interestingApplication.grants.every(g=>g.key.includes(`/${option.id}/`))).toBe(true);
      expect(view.interestingApplication.quantities.every(q=>q.optionId===null||q.optionId===option.id)).toBe(true);
    }
    view=await calculateOfficialCore(draft,context);
    expect(view.interestingApplication.creationResolved).toBe(true);
    expect(view.moneyBits).toBe(originalMoney);
    expect(new Set(view.inventory.map(i=>i.key)).size).toBe(view.inventory.length);
    if(view.interestingApplication.grants.every(g=>['narrative','relationship','companion'].includes(g.kind)))expect(view.inventory.some(i=>i.key.startsWith(`interesting/${id}/`))).toBe(false);
    for(const roll of thing.details.sideRolls.filter(r=>r.phase==='use'))expect(draft.rolls[thingRollKey(id,roll.id)]).toBeUndefined();
    const spy=vi.spyOn(random,'createSubstream');try{
      const restored=parseOfficialCoreDraft(JSON.parse(JSON.stringify(draft)));
      expect(await consumableDigest(await calculateOfficialCore(restored,context))).toBe(await consumableDigest(view));
      expect(spy).not.toHaveBeenCalled();
    }finally{spy.mockRestore();}
  });
  it('keeps capacity, content, dimensions and asset value distinct from item count and cash',async()=>{
    const quantityPlans=context.interestingPlans.filter(p=>p.quantities.length);
    expect(quantityPlans.length).toBeGreaterThan(0);
    const capacity=quantityPlans.find(p=>p.quantities.some(q=>q.role==='capacity'&&q.rollId))!;
    const draft=await selectOfficialThing(original,context,capacity.outcomeId),view=await calculateOfficialCore(draft,context);
    expect(view.interestingApplication.grants[0].count).toBe(1);
    expect(view.interestingApplication.quantities[0].amount).toBeGreaterThan(1);
    const valued=context.core.things.find(t=>t.details.declaredWorth)!;
    const withAsset=await calculateOfficialCore(await selectOfficialThing(draft,context,valued.id),context);
    expect(withAsset.moneyBits).toBe(view.moneyBits);expect(withAsset.interestingApplication.declaredWorth?.spendable).toBe(false);
  });
  it('preserves conditional faces across branch swaps without applying the inactive branch',async()=>{
    const thing=context.core.things.find(t=>t.details.sideRolls.some(r=>r.optionId))!,choice=thing.details.choices[0];
    let draft=await selectOfficialThing(original,context,thing.id);
    const first=choice.options[0],second=choice.options[1];
    draft=await chooseOfficialCore(draft,context,thingChoiceKey(thing.id,choice.id),first.id);
    const recorded=structuredClone(draft.rolls);
    draft=await chooseOfficialCore(draft,context,thingChoiceKey(thing.id,choice.id),second.id);
    const secondView=await calculateOfficialCore(draft,context);
    expect(secondView.interestingApplication.quantities.every(q=>q.optionId===second.id)).toBe(true);
    draft=await chooseOfficialCore(draft,context,thingChoiceKey(thing.id,choice.id),first.id);
    for(const [key,value] of Object.entries(recorded))expect(draft.rolls[key]).toEqual(value);
    expect(draft.interestingHistory.filter(e=>e.type==='choose')).toHaveLength(3);
  });
  it('applies the explicit special-armor ruling only when worn, and suspends conflicting armor',async()=>{
    const plan=context.interestingPlans.find(p=>p.specialArmor)!,special=context.itemDefinitions.find(i=>i.id===plan.specialArmor!.itemId)!;
    const mail=context.itemDefinitions.find(i=>i.id===plan.specialArmor!.baseItemId)!;
    expect(special.armor).toMatchObject({classification:'light',requiredStrength:null,defense:mail.armor!.defense});
    expect(plan.specialArmor).toMatchObject({weight:0,authority:'explicit-user-request'});
    const draft=await selectOfficialThing(original,context,plan.outcomeId),plain=await calculateOfficialCore(draft,context);
    const grant=plain.inventory.find(i=>i.itemId===special.id)!;expect(grant.weight).toBe(0);expect(grant.equipped).toBe(false);
    const worn=await equipOfficialCore(draft,context,grant.key,true),wearing=await calculateOfficialCore(worn,context);
    expect(wearing.base.stats!.defense).toBe(special.armor!.defense.value);
    expect(wearing.base.stats!.speed).toBe(plain.base.stats!.speed);
    const conflict=await calculateHumanL0Character(draft.character,context.mechanicalPacks,[
      {...special.armor!.defense,origin:grant.key,speedDelta:0},{...mail.armor!.defense,origin:'test:other-armor',speedDelta:0}]);
    expect(conflict.baseResolved).toBe(false);expect(conflict.stats).toBeNull();
    const another=context.core.things.find(t=>t.id!==plan.outcomeId&&!t.details.choices.length)!;
    const switched=await selectOfficialThing(worn,context,another.id);
    expect(switched.equipped).not.toContain(grant.key);
    expect((await calculateOfficialCore(switched,context)).base.stats).toEqual(plain.base.stats);
  });
  it('requires a real GM choice, preserves its history and rejects forged profiles or source changes',async()=>{
    const thing=context.core.things.find(t=>t.details.gmChoice)!;
    let draft=await selectOfficialThing(original,context,thing.id);
    await expect(adjudicateOfficialThing(draft,context,true)).rejects.toThrow();
    const decision={outcomeId:thing.id,author:'Teste local',reason:'Cenário de aceite local',definition:{kind:'generic',name:'Nome de teste'}};
    draft=await adjudicateOfficialThing(draft,context,decision);
    draft=await adjudicateOfficialThing(draft,context,{...decision,definition:{kind:'generic',name:'Nome de teste revisado'}});
    expect(draft.interestingHistory.filter(e=>e.type==='adjudicate')).toHaveLength(2);
    const generic=await calculateOfficialCore(draft,context);
    expect(generic.interestingApplication.creationResolved).toBe(true);
    expect(generic.interestingApplication.pending.some(p=>p.code==='generic-weapon-profile')).toBe(true);
    await expect(adjudicateOfficialThing(draft,context,{...decision,definition:{kind:'published',itemId:'unknown'}})).rejects.toThrow('interesting-weapon-definition-invalid');
    const changed=structuredClone(context);changed.interestingPlans[0].branches[0].records[0].count++;
    await expect(calculateOfficialCore(draft,changed)).rejects.toThrow('source-context-changed');
    const missing=structuredClone(context);missing.interestingPlans.pop();expect(()=>parseOfficialCoreContext(missing)).toThrow('interesting-plan-invalid');
    await expect(selectOfficialThing(draft,context,'unknown')).rejects.toThrow('interesting-result-invalid');
  });
});
