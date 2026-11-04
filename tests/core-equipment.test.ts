import {describe,it,expect} from 'vitest';
import {composeCoreEquipment,emptyEquipmentContext,legacyEquipmentLoadout,EquipmentRulesSchema,type EquipmentPlacement,type EquipmentRules} from '../packages/character-generator/core-equipment';
import {PilotItemSchema} from '../packages/curation/pilot-item-model';

// Invented profiles test mechanics without publishing a licensed equipment catalog.
const armor=PilotItemSchema.parse({id:'fictional:armor',name:'Invented wrap',sourceId:'fictional:source',evidenceIds:['fictional:evidence'],category:'armor',definitionStatus:'source-grant-only',price:{kind:'unknown',amount:null,denomination:null,bits:null,per:{quantity:1,unit:'suit'}},availability:null,
  armor:{classification:'heavy',defense:{base:'fixed',value:14},requiredStrength:12},weapon:null,resources:[],ruleEvidenceIds:[],sourceText:null,restrictions:[],automaticPurchase:false,automaticEffects:false,editable:true});
const weapon=(id:string,hands:'one'|'two'|'off',defensive=0)=>PilotItemSchema.parse({...armor,id,name:id,category:'weapon',armor:null,
  weapon:{damage:{count:1,sides:4,modifier:2},hands,requirement:{attribute:'strength',minimum:12},properties:[],range:null,ammunition:null,defensive,reach:0}});
const blade=weapon('fictional:blade','one'),off=weapon('fictional:off','off'),two=weapon('fictional:two','two'),shield=weapon('fictional:shield','off',2),other=weapon('fictional:other','off',3);
const definitions=[armor,blade,off,two,shield,other];
const rules:EquipmentRules={contract:'sotdl.equipment-context',contractVersion:'1.0.0',sourceId:'fictional:source',defensiveStacking:'pending',stackingAuthority:'unresolved',shieldItemIds:[shield.id,other.id],dualAttack:{oneTargetBanes:4,twoTargetBanes:5},evidence:[{id:'fictional:evidence',sourceId:'fictional:source',path:'fictional/input',inputSha256:'a'.repeat(64),startLine:1,endLine:2,excerptSha256:'b'.repeat(64)}]};
const owned=definitions.map(i=>({key:i.id,itemId:i.id,recordKind:'item',quantity:2}));
const p=(key:string,slot:EquipmentPlacement['slot'],instance=1):EquipmentPlacement=>({key,slot,instance});
const compose=(loadout:EquipmentPlacement[],extra:Partial<Parameters<typeof composeCoreEquipment>[0]>={})=>composeCoreEquipment({owned,definitions,loadout,context:emptyEquipmentContext(),rules,actor:{strength:10,agility:11,size:1},...extra});
describe('equipment context composition with fictional facts',()=>{
  it('does not apply anything for possession and composes armor before a defensive weapon',()=>{
    expect(compose([])).toMatchObject({resolved:true,armor:null,defenseBonus:0,speedDelta:0});
    const v=compose([p(armor.id,'worn'),p(blade.id,'main'),p(shield.id,'off')]);
    expect(v).toMatchObject({resolved:true,armor:{base:'fixed',value:14},defenseBonus:2,speedDelta:-4});
    expect(v.tests).toEqual({strengthBanes:1,agilityBanes:1,swimmingStrengthBanes:3});
    expect(v.weapons.find(w=>w.itemId===blade.id)?.attackBanes).toBe(2);
    expect(v.dualAttack.eligible).toBe(true);
  });
  it('rejects conflicting armor, overlapping hands and impossible hand entries',()=>{
    expect(compose([p(armor.id,'worn'),p(armor.id,'worn',2)]).diagnostics.map(d=>d.code)).toContain('armor-conflict');
    const conflict=compose([p(two.id,'both'),p(shield.id,'off')]);
    expect(conflict.resolved).toBe(false);expect(conflict.defenseBonus).toBeNull();expect(conflict.diagnostics.map(d=>d.code)).toContain('hand-conflict');
    expect(compose([p(blade.id,'off')]).diagnostics.map(d=>d.code)).toContain('weapon-hand-mismatch');
    expect(compose([p(two.id,'main')]).resolved).toBe(false);
  });
  it('keeps ordinary clothing under armor without adding or replacing its protection',()=>{
    const clothes=PilotItemSchema.parse({...armor,id:'fictional:clothes',armor:{classification:'clothing',defense:{base:'agility',value:0},requiredStrength:null}});
    const v=compose([p(clothes.id,'worn'),p(armor.id,'worn')],{definitions:[...definitions,clothes],owned:[...owned,{key:clothes.id,itemId:clothes.id,recordKind:'item',quantity:1}]});
    expect(v.resolved).toBe(true);expect(v.armor?.value).toBe(14);expect(v.speedDelta).toBe(-4);
  });
  it('distinguishes physical copies, rejects duplication and does not exceed owned quantity',()=>{
    expect(compose([p(off.id,'main'),p(off.id,'off',2)]).resolved).toBe(true);
    expect(compose([p(off.id,'main'),p(off.id,'off')]).diagnostics.map(d=>d.code)).toContain('duplicate-instance');
    expect(compose([p(off.id,'main',3)]).diagnostics.map(d=>d.code)).toContain('owned-item-required');
    expect(compose([p('missing','main')]).resolved).toBe(false);
  });
  it('keeps two defensive bonuses pending unless an explicit interpretation is provided',()=>{
    const loadout=[p(shield.id,'main'),p(other.id,'off')];
    expect(compose(loadout).diagnostics.map(d=>d.code)).toContain('defensive-stacking-review');
    expect(compose(loadout,{rules:{...rules,defensiveStacking:'sum',stackingAuthority:'explicit-user-request'}}).defenseBonus).toBe(5);
    expect(compose(loadout,{rules:{...rules,defensiveStacking:'highest',stackingAuthority:'explicit-user-request'}}).defenseBonus).toBe(3);
    const highest={...rules,defensiveStacking:'highest',stackingAuthority:'explicit-user-request'};
    expect(compose(loadout,{rules:highest}).weapons.reduce((sum,w)=>sum+w.defensiveBonus,0)).toBe(3);
    expect(compose(loadout,{rules:highest,context:{...emptyEquipmentContext(),suppressedDefensive:[{key:other.id,instance:1,itemId:other.id}]}}).defenseBonus).toBe(2);
    expect(()=>EquipmentRulesSchema.parse({...rules,defensiveStacking:'sum'})).toThrow();
  });
  it('applies a two-hand damage modifier only to a one-hand entry',()=>{
    expect(compose([p(blade.id,'both')]).weapons[0].damage.modifier).toBe(3);
    expect(compose([p(two.id,'both')]).weapons[0].damage.modifier).toBe(2);
    const cumbersome={...two,weapon:{...two.weapon!,hands:'off',properties:['cumbersome']}};
    const v=compose([p(blade.id,'main'),p(two.id,'off')],{definitions:[...definitions.filter(d=>d.id!==two.id),cumbersome]});
    expect(v.weapons.find(w=>w.itemId===two.id)?.attackBanes).toBe(2);expect(v.dualAttack.eligible).toBe(false);
  });
  it('retains a shield suppression until round end, never duplicates it on replay',()=>{
    const loadout=[p(blade.id,'main'),p(shield.id,'off')],context={...emptyEquipmentContext(),dualAttack:'one-target' as const,suppressedDefensive:[{key:shield.id,instance:1,itemId:shield.id}]};
    const v=compose(loadout,{context});expect(v.defenseBonus).toBe(0);expect(v.dualAttack.additionalBanes).toBe(4);
    expect(compose(loadout,{context}).breakdown).toEqual(v.breakdown);
    expect(compose(loadout).defenseBonus).toBe(2);
  });
  it('supports the two Human sizes and keeps other size contexts and use resources explicit',()=>{
    expect(compose([p(blade.id,'main')],{actor:{strength:10,agility:11,size:0.5}}).resolved).toBe(true);
    expect(compose([p(blade.id,'main')],{actor:{strength:10,agility:11,size:0.25}}).diagnostics.map(d=>d.code)).toContain('unsupported-size-context');
    const large={...shield,weapon:{...shield.weapon!,properties:['size 1']}};
    expect(compose([p(shield.id,'off')],{definitions:[...definitions.filter(d=>d.id!==shield.id),large],actor:{strength:10,agility:11,size:0.5}}).resolved).toBe(false);
    const ranged={...off,weapon:{...off.weapon!,properties:['reload','misfire'],range:'short',ammunition:'fictional:ammo'}};
    expect(compose([p(off.id,'main')],{definitions:[...definitions.filter(d=>d.id!==off.id),ranged]}).weapons[0].usePending).toHaveLength(2);
  });
  it('does not infer hands for a legacy multi-weapon save',()=>{
    expect(legacyEquipmentLoadout([blade.id,shield.id],owned,definitions).map(p=>p.slot)).toEqual(['unassigned','unassigned']);
    const legacy=legacyEquipmentLoadout([blade.id],owned,definitions);expect(legacy[0].slot).toBe('main');
    expect(compose(legacyEquipmentLoadout([blade.id,shield.id],owned,definitions)).resolved).toBe(false);
  });
  it('uses a mounted hand exception only when the profile declares it',()=>{
    const lance={...two,weapon:{...two.weapon!,properties:['one hand while mounted']}};
    const defs=[...definitions.filter(d=>d.id!==two.id),lance];
    expect(compose([p(two.id,'main')],{definitions:defs}).resolved).toBe(false);
    expect(compose([p(two.id,'main')],{definitions:defs,context:{...emptyEquipmentContext(),mounted:true}}).resolved).toBe(true);
    expect(compose([p(two.id,'main')],{context:{...emptyEquipmentContext(),mounted:true}}).resolved).toBe(false);
  });
});
