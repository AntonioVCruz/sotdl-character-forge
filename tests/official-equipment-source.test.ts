import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {buildOfficialLocalContext} from '../tools/curation/official-local-context';
import {generateOfficialCore,calculateOfficialCore,configureOfficialEquipment,equipOfficialCore,useOfficialEquipment,selectOfficialThing,adjudicateOfficialThing,chooseOfficialCore,parseOfficialCoreDraft,type OfficialCoreContext,type OfficialCoreDraft} from '../packages/character-generator/official-core';
import {composeCoreEquipment,emptyEquipmentContext} from '../packages/character-generator/core-equipment';
import {consumableDigest} from '../packages/curation/human-l0-consumable-bundle';
import * as random from '../packages/random-tables';

const sourceRoot=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
const available=['curation/pilot/items.json','curation/pilot/table-closure.json','rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md'].every(p=>existsSync(resolve(sourceRoot,p)));
describe.skipIf(!available)('official equipment source acceptance',()=>{
  let context:OfficialCoreContext,original:OfficialCoreDraft;
  beforeAll(async()=>{
    context=await buildOfficialLocalContext(sourceRoot,process.cwd());
    original=await generateOfficialCore(context,{name:'Teste local',seed:'equipment-source-test',increase:'strength',benefit:'random-profession',languageId:'',interestingVariant:'core',optionalTables:false});
  },30000);
  it('checks every selected exact armor/weapon profile with its source requirements and legal hand',()=>{
    const profiles=context.itemDefinitions.filter(i=>i.armor||i.weapon);
    expect(profiles.length).toBeGreaterThan(15);
    for(const item of profiles){
      const owned=[{key:'test:owned',itemId:item.id,recordKind:'item',quantity:1}];
      const slot=item.armor?'worn':item.weapon!.hands==='two'?'both':'main';
      const v=composeCoreEquipment({owned,definitions:profiles,loadout:[{key:'test:owned',instance:1,slot}],context:emptyEquipmentContext(),rules:context.equipmentRules,actor:{strength:20,agility:12,size:1}});
      expect(v.resolved).toBe(true);
      if(item.armor){
        expect(v.armor?.value).toBe(item.armor.defense.value);expect(v.speedDelta).toBe(item.armor.classification==='heavy'?-2:0);
        const low=composeCoreEquipment({owned,definitions:profiles,loadout:[{key:'test:owned',instance:1,slot}],context:emptyEquipmentContext(),rules:context.equipmentRules,actor:{strength:1,agility:12,size:1}});
        const requirement=item.armor.requiredStrength!==null&&item.armor.requiredStrength>1;
        expect(low.speedDelta).toBe((item.armor.classification==='heavy'?-2:0)+(requirement?-2:0));
        expect(low.tests.strengthBanes).toBe(requirement?1:0);
      }
      else expect(v.defenseBonus).toBe(item.weapon!.defensive);
    }
    expect(context.equipmentRules.evidence.some(e=>e.id==='core-equipment:dual-attack')).toBe(true);
  });
  it('persists hands, changes damage with two-hand grip and suspends overlapping hands until explicit replacement',async()=>{
    const gm=context.core.things.find(t=>t.details.gmChoice)!;
    const weapon=context.itemDefinitions.find(i=>i.weapon?.hands==='one'&&i.weapon.requirement.minimum===null)!;
    let d=await adjudicateOfficialThing(await selectOfficialThing(original,context,gm.id),context,{outcomeId:gm.id,author:'Teste local',reason:'Aceite de mãos',definition:{kind:'published',itemId:weapon.id}});
    const owned=(await calculateOfficialCore(d,context)).inventory.find(i=>i.itemId===weapon.id&&i.key.startsWith('interesting/'))!;
    d=await configureOfficialEquipment(d,context,{key:owned.key,slot:'both'});
    let v=await calculateOfficialCore(d,context);
    expect(v.equipment.weapons[0].damage.modifier).toBe(weapon.weapon!.damage.modifier+1);
    const invalid=await configureOfficialEquipment(d,context,{key:owned.key,slot:'off'});
    expect((await calculateOfficialCore(invalid,context)).equipment.diagnostics.map(d=>d.code)).toContain('weapon-hand-mismatch');
    await expect(configureOfficialEquipment(d,context,{key:owned.key,slot:'off',replaceConflicts:true})).rejects.toThrow('equipment-replacement-invalid');
    d=await configureOfficialEquipment(invalid,context,{key:owned.key,slot:'main',replaceConflicts:true});
    v=await calculateOfficialCore(d,context);expect(v.equipment.resolved).toBe(true);
    const spy=vi.spyOn(random,'createSubstream');try{
      const restored=parseOfficialCoreDraft(JSON.parse(JSON.stringify(d)));
      expect(await consumableDigest(await calculateOfficialCore(restored,context))).toBe(await consumableDigest(v));
      expect(spy).not.toHaveBeenCalled();
    }finally{spy.mockRestore();}
    expect(d.equipmentHistory.length).toBeGreaterThan(1);
    await expect(configureOfficialEquipment(d,context,{key:owned.key,instance:2,slot:'off'})).rejects.toThrow('owned-item-required');
    const removed=await configureOfficialEquipment(d,context,{key:owned.key,slot:'carried'});
    expect((await calculateOfficialCore(removed,context)).equipment.loadout).toHaveLength(0);
  });
  it('retains the explicit special-armor policy with zero weight and no Strength requirement',async()=>{
    const special=context.interestingPlans.find(p=>p.specialArmor)!;
    let d=await selectOfficialThing(original,context,special.outcomeId);
    const before=await calculateOfficialCore(d,context),item=before.inventory.find(i=>i.itemId===special.specialArmor!.itemId)!;
    d=await configureOfficialEquipment(d,context,{key:item.key,slot:'worn'});
    const worn=await calculateOfficialCore(d,context);
    expect(worn.equipment.resolved).toBe(true);expect(worn.equipment.speedDelta).toBe(0);expect(worn.equipment.tests.strengthBanes).toBe(0);expect(item.weight).toBe(0);
    const away=await selectOfficialThing(d,context,context.core.things.find(t=>t.id!==special.outcomeId&&!t.details.choices.length)!.id);
    expect(away.equipped).not.toContain(item.key);expect(away.equipmentLoadout).toHaveLength(0);
    expect((await calculateOfficialCore(away,context)).base.stats).toEqual(before.base.stats);
  });
  it('uses only the highest published shield bonus under the user policy and falls back when it is suppressed',()=>{
    const shields=context.itemDefinitions.filter(i=>context.equipmentRules.shieldItemIds.includes(i.id));
    expect(shields).toHaveLength(2);expect(context.equipmentRules.defensiveStacking).toBe('highest');expect(context.equipmentRules.stackingAuthority).toBe('explicit-user-request');
    const owned=shields.map((s,i)=>({key:`test:shield:${i}`,itemId:s.id,recordKind:'item',quantity:1}));
    const loadout=[{key:owned[0].key,instance:1,slot:'main'},{key:owned[1].key,instance:1,slot:'off'}];
    const input={owned,definitions:context.itemDefinitions,loadout,context:emptyEquipmentContext(),rules:context.equipmentRules,actor:{strength:20,agility:12,size:1}};
    expect(composeCoreEquipment(input).defenseBonus).toBe(Math.max(...shields.map(s=>s.weapon!.defensive)));
    const index=shields[0].weapon!.defensive>shields[1].weapon!.defensive?0:1;
    const suppressed={...emptyEquipmentContext(),suppressedDefensive:[{key:owned[index].key,instance:1,itemId:shields[index].id}]};
    expect(composeCoreEquipment({...input,context:suppressed}).defenseBonus).toBe(shields[1-index].weapon!.defensive);
  });
  it('records shield use and end of round without rolling and keeps two-weapon ownership distinct',async()=>{
    let d=original,kitWeapon:Awaited<ReturnType<typeof calculateOfficialCore>>['inventory'][number]|undefined;
    // A bounded search chooses a real starting kit for this local acceptance scenario; it is not a product generation algorithm.
    for(let n=0;n<12&&!kitWeapon;n++){
      d=await generateOfficialCore(context,{...original.config,seed:`equipment-kit-${n}`});
      for(let j=0;j<10;j++){const pending=(await calculateOfficialCore(d,context)).pending.find(p=>p.options?.length&&!p.key.startsWith('interesting/'));if(!pending)break;d=await chooseOfficialCore(d,context,pending.key,pending.options![0].id);}
      kitWeapon=(await calculateOfficialCore(d,context)).inventory.find(i=>{const p=context.itemDefinitions.find(d=>d.id===i.itemId)?.weapon;return !i.key.startsWith('interesting/')&&i.recordKind==='item'&&!!p&&p.hands!=='two'&&!p.properties.includes('cumbersome');});
    }
    expect(!!kitWeapon).toBe(true);
    const gm=context.core.things.find(t=>t.details.gmChoice)!,shield=context.itemDefinitions.find(i=>context.equipmentRules.shieldItemIds.includes(i.id)&&!i.weapon!.properties.includes('size 1'))!;
    d=await adjudicateOfficialThing(await selectOfficialThing(d,context,gm.id),context,{outcomeId:gm.id,author:'Teste local',reason:'Aceite de escudo',definition:{kind:'published',itemId:shield.id}});
    const shieldRecord=(await calculateOfficialCore(d,context)).inventory.find(i=>i.key.startsWith('interesting/')&&i.itemId===shield.id)!;
    d=await configureOfficialEquipment(d,context,{key:shieldRecord.key,slot:'main'});
    expect((await equipOfficialCore(d,context,shieldRecord.key,true)).equipmentLoadout).toEqual(d.equipmentLoadout);
    d=await configureOfficialEquipment(d,context,{key:kitWeapon!.key,slot:'main'});
    d=await configureOfficialEquipment(d,context,{key:shieldRecord.key,slot:'off'});
    const before=await calculateOfficialCore(d,context);expect(before.equipment.dualAttack.eligible).toBe(true);
    const legacy=parseOfficialCoreDraft({...structuredClone(d),equipmentLoadout:null});
    expect((await calculateOfficialCore(legacy,context)).equipment.diagnostics.some(d=>d.code==='hand-required')).toBe(true);
    let resolvedLegacy=await configureOfficialEquipment(legacy,context,{key:kitWeapon!.key,slot:'main'});
    resolvedLegacy=await configureOfficialEquipment(resolvedLegacy,context,{key:shieldRecord.key,slot:'off'});
    expect((await calculateOfficialCore(resolvedLegacy,context)).equipment.resolved).toBe(true);
    expect(resolvedLegacy.rolls).toEqual(d.rolls);
    const rolls=structuredClone(d.rolls),spy=vi.spyOn(random,'createSubstream');
    try{
      const used=await useOfficialEquipment(d,context,{type:'dual-attack',targets:'one-target'}),using=await calculateOfficialCore(used,context);
      expect(using.base.stats!.defense).toBe(before.base.stats!.defense-shield.weapon!.defensive);
      expect(using.equipment.context.suppressedDefensive).toHaveLength(1);
      const reopened=parseOfficialCoreDraft(JSON.parse(JSON.stringify(used)));
      expect((await calculateOfficialCore(reopened,context)).base.stats!.defense).toBe(using.base.stats!.defense);
      const ended=await useOfficialEquipment(reopened,context,{type:'end-round'});
      expect((await calculateOfficialCore(ended,context)).base.stats!.defense).toBe(before.base.stats!.defense);
      expect(ended.rolls).toEqual(rolls);expect(spy).not.toHaveBeenCalled();
    }finally{spy.mockRestore();}
    const conflicting=await configureOfficialEquipment(d,context,{key:shieldRecord.key,slot:'main'});
    expect((await calculateOfficialCore(conflicting,context)).base.stats).toBeNull();
    const replaced=await configureOfficialEquipment(conflicting,context,{key:shieldRecord.key,slot:'main',replaceConflicts:true});
    expect(replaced.equipped).not.toContain(kitWeapon!.key);expect((await calculateOfficialCore(replaced,context)).equipment.resolved).toBe(true);
  },15000);
});
