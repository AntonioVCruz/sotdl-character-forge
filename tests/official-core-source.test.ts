import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {buildOfficialLocalContext} from '../tools/curation/official-local-context';
import {generateOfficialCore,calculateOfficialCore,chooseOfficialCore,equipOfficialCore,selectOfficialBackground,parseOfficialCoreDraft,type OfficialCoreContext} from '../packages/character-generator/official-core';
import * as random from '../packages/random-tables';
import {previewArmorDefinition} from '../packages/curation/pilot-item-model';
import {consumableDigest} from '../packages/curation/human-l0-consumable-bundle';
const sourceRoot=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
const available=existsSync(resolve(sourceRoot,'curation/pilot/table-closure.json'))&&existsSync(resolve(sourceRoot,'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md'));
const config={name:'Personagem de teste',seed:'official-core-test',increase:'strength',benefit:'random-profession',languageId:'',interestingVariant:'core',optionalTables:false} as const;
describe.skipIf(!available)('official Core generation from verified local sources',()=>{
  let context:OfficialCoreContext;
  beforeAll(async()=>{context=await buildOfficialLocalContext(sourceRoot,process.cwd());},30000);
  it('covers every verified Background result, replaces consequences and reopens without drawing',async()=>{
    const original=await generateOfficialCore(context,config),plain=await calculateOfficialCore(original,context);
    expect(plain.background).toBeNull();expect(context.backgroundPlans).toHaveLength(20);
    let current=original;
    for(const plan of context.backgroundPlans){
      current=await selectOfficialBackground(current,context,'manual',plan.rowId);
      const v=await calculateOfficialCore(current,context);
      expect(v.background?.rowId).toBe(plan.rowId);
      expect(v.background?.evidenceIds.length).toBeGreaterThan(0);
      for(const target of ['insanity','corruption'] as const)expect(v.base.states![target]).toBe(plain.base.states![target]+(plan.state?.target===target?v.background!.values!.state!:0));
      const draw=vi.spyOn(random,'createSubstream');try{
        expect(await calculateOfficialCore(parseOfficialCoreDraft(JSON.parse(JSON.stringify(current))),context)).toEqual(v);
        expect(draw).not.toHaveBeenCalled();
      }finally{draw.mockRestore();}
      if(plan.programId){const delta=BigInt(v.moneyBits)-BigInt(plain.moneyBits);expect(delta).toBeGreaterThan(0n);expect(BigInt((await calculateOfficialCore(current,context)).moneyBits)).toBe(BigInt(v.moneyBits));}
      if(plan.keepsake)expect(v.inventory.filter(i=>i.key.startsWith('background/'))).toHaveLength(1);
      const removed=await selectOfficialBackground(current,context,'none');
      const after=await calculateOfficialCore(removed,context);
      expect(after.base.states).toEqual(plain.base.states);expect(after.moneyBits).toBe(plain.moneyBits);expect(after.inventory).toEqual(plain.inventory);
    }
    await expect(selectOfficialBackground(original,context,'manual','unknown')).rejects.toThrow('background-selection-required');
  });
  it('applies only published language abilities and validates conditional choices',async()=>{
    const original=await generateOfficialCore(context,config);
    const education=context.backgroundPlans.find(p=>context.core.templates.find(t=>t.id===p.templateId)?.languages?.length)!;
    const educated=await selectOfficialBackground(original,context,'manual',education.rowId),view=await calculateOfficialCore(educated,context);
    const grant=context.core.templates.find(t=>t.id===education.templateId)!.languages![0];
    const language=view.languages.find(l=>l.id===grant.languageId)!;
    expect(language.read).toBe(true);expect(language.write).toBe(false);
    const travel=context.backgroundPlans.find(p=>context.core.templates.find(t=>t.id===p.templateId)?.languageChoice)!;
    let traveler=await selectOfficialBackground(educated,context,'manual',travel.rowId);
    const pending=(await calculateOfficialCore(traveler,context)).pending.find(p=>p.key===`background/${travel.rowId}/language`)!;
    traveler=await chooseOfficialCore(traveler,context,pending.key,pending.options![0].id);
    const traveled=await calculateOfficialCore(traveler,context);
    expect(traveled.languages.find(l=>l.id===pending.options![0].id)).toMatchObject({speak:true,read:false,write:false});
    const back=await selectOfficialBackground(traveler,context,'none');
    expect((await calculateOfficialCore(back,context)).languages.some(l=>l.id===pending.options![0].id)).toBe(false);
    await expect(chooseOfficialCore(traveler,context,pending.key,'unknown-language')).rejects.toThrow('background-language-invalid');
  });
  it('preserves an optional random Background and all consumed faces across removal/restoration',async()=>{
    const initial=await generateOfficialCore(context,config),randomized=await selectOfficialBackground(initial,context,'random');
    const removed=await selectOfficialBackground(randomized,context,'none');
    const restored=await selectOfficialBackground(removed,context,'random');
    expect(restored.rolls).toEqual(randomized.rolls);
    expect((await calculateOfficialCore(restored,context)).background).toEqual((await calculateOfficialCore(randomized,context)).background);
  });
  it('generates published base, exact professions, wealth and records without a demo fallback',async()=>{
    const d=await generateOfficialCore(context,config),v=await calculateOfficialCore(d,context),m=context.mechanicalPacks[0].entities[0].mechanics;
    expect(context.fictionalData).toBe(false);expect(context.mechanicalPacks.every(p=>!p.fictionalData)).toBe(true);
    expect(v.base.stats!.strength).toBe(m.attributes.fixed.base+m.attributes.fixed.increaseBy);
    expect(v.professions).toHaveLength(context.core.startingRights.professionChoices+1);
    expect(v.professions.every(p=>context.core.professions.some(known=>known.id===p.id))).toBe(true);
    expect(v.moneyBits).toMatch(/^\d+$/);expect(v.inventory.every(i=>!i.equipped)).toBe(true);
    expect(v).toMatchObject({officialGenerationEnabled:true,dataMode:'official-local',fullyResolved:false,exportEnabled:false});
    expect(v.pending.some(p=>p.key.startsWith('interesting/application/'))).toBe(false);
    expect(v.interestingApplication.origin.outcomeId).toBe(v.interestingThing.id);
  });
  it('is deterministic and reopens decisions without drawing or embedding sources',async()=>{
    const a=await generateOfficialCore(context,config),b=await generateOfficialCore(context,config);
    expect(a.rolls).toEqual(b.rolls);
    const draw=vi.spyOn(random,'createSubstream');try{
      const restored=parseOfficialCoreDraft(JSON.parse(JSON.stringify(a)));
      const one=await calculateOfficialCore(a,context),two=await calculateOfficialCore(restored,context);
      expect(one.moneyBits).toBe(two.moneyBits);expect(one.professions.map(p=>p.id)).toEqual(two.professions.map(p=>p.id));
      expect(JSON.stringify(restored)).not.toMatch(/"sourceText"|"excerpt"|"mechanics"/);expect(draw).not.toHaveBeenCalled();
    }finally{draw.mockRestore();}
  });
  it('completes only authorized alternatives and never applies equipment just for possession',async()=>{
    let d=await generateOfficialCore(context,config);
    for(let i=0;i<12;i++){const v=await calculateOfficialCore(d,context),p=v.pending.find(p=>p.options?.length);if(!p)break;d=await chooseOfficialCore(d,context,p.key,p.options![0].id);}
    const v=await calculateOfficialCore(d,context);expect(v.inventory.every(i=>!i.equipped)).toBe(true);
    const owned=v.inventory.find(i=>i.itemId&&i.profile!=='none'&&i.recordKind==='item'&&i.quantity!==null&&i.quantity>0);
    expect(!!owned).toBe(true);
    const equipped=await equipOfficialCore(d,context,owned!.key,true),wearing=await calculateOfficialCore(equipped,context);
    const definition=context.itemDefinitions.find(i=>i.id===owned!.itemId)!;
    const baseDefense=definition.armor?(definition.armor.defense.base==='agility'?v.base.stats!.agility:0)+definition.armor.defense.value:v.base.stats!.defense+definition.weapon!.defensive;
    expect(wearing.base.stats!.defense).toBe(Math.min(baseDefense,context.mechanicalPacks[0].entities[0].mechanics.finalLimits.defense.value));
    const speedDelta=definition.armor?previewArmorDefinition(definition,{agility:v.base.stats!.agility,strength:v.base.stats!.strength,worn:true}).speedPenalty:0;
    expect(wearing.base.stats!.speed).toBe(v.base.stats!.speed+speedDelta);
    expect(wearing.moneyBits).toBe(v.moneyBits);expect(equipped.rolls).toEqual(d.rolls);
    const stored=await equipOfficialCore(equipped,context,owned!.key,false);
    expect((await calculateOfficialCore(stored,context)).base.stats).toEqual(v.base.stats);
    await expect(equipOfficialCore(d,context,'not-owned',true)).rejects.toThrow('owned-item-required');
    expect(v.pending.some(p=>p.key.startsWith('interesting/application/'))).toBe(false);
  });
  it('keeps a negative armor penalty negative through equip, replay and removal',async()=>{
    let d=await generateOfficialCore(context,config);
    for(let i=0;i<12;i++){const p=(await calculateOfficialCore(d,context)).pending.find(p=>p.options?.length);if(!p)break;d=await chooseOfficialCore(d,context,p.key,p.options![0].id);}
    const owned=(await calculateOfficialCore(d,context)).inventory.find(i=>i.itemId&&i.quantity&&i.recordKind==='item')!;
    // Invented heavy profile isolates the sign regression from whichever kit the seed selected.
    const c=structuredClone(context),item=c.itemDefinitions.find(i=>i.id===owned.itemId)!;
    item.armor={classification:'heavy',defense:{base:'fixed',value:14},requiredStrength:100};item.weapon=null;item.category='armor';
    d.contextSha256=await consumableDigest(c);
    const before=await calculateOfficialCore(d,c),equipped=await equipOfficialCore(d,c,owned.key,true),after=await calculateOfficialCore(equipped,c);
    expect(after.base.stats!.speed).toBe(before.base.stats!.speed-4);
    expect((await calculateOfficialCore(parseOfficialCoreDraft(JSON.parse(JSON.stringify(equipped))),c)).base.stats).toEqual(after.base.stats);
    expect((await calculateOfficialCore(await equipOfficialCore(equipped,c,owned.key,false),c)).base.stats).toEqual(before.base.stats);
    expect(equipped.rolls).toEqual(d.rolls);
  });
  it('refuses stale sources, fictional packs and an implicit Interesting Things fallback',async()=>{
    const d=await generateOfficialCore(context,config),changed=structuredClone(context);changed.core.tables[0].columns[0].rows[0].text='Changed local source';
    await expect(calculateOfficialCore(d,changed)).rejects.toThrow('source-context-changed');
    const fake=structuredClone(context);fake.mechanicalPacks[0].fictionalData=true;await expect(generateOfficialCore(fake,config)).rejects.toThrow();
    await expect(generateOfficialCore(context,{...config,interestingVariant:'oddities'})).rejects.toThrow();
    const tampered=structuredClone(d);tampered.rolls.wealth=[99,99,99];await expect(calculateOfficialCore(tampered,context)).rejects.toThrow('recorded-roll-invalid');
    const missing=structuredClone(d);delete missing.rolls.wealth;await expect(calculateOfficialCore(missing,context)).rejects.toThrow('recorded-roll-missing');
  });
});
