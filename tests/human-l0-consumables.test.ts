import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe,expect,it,vi } from 'vitest';
import { compileHumanL0Consumable } from '../tools/curation/human-l0-consumable-compiler';
import { calculateConsumableSession, newConsumableSession, performConsumableCommand, parseConsumableSession,
  newHumanL0Character, performHumanL0Command, calculateHumanL0Character, exportGeneratedCharacter } from '../packages/character-generator/runtime';
import * as random from '../packages/random-tables';
import { consumableDigest } from '../packages/curation/human-l0-consumable-bundle';

const original=JSON.parse(readFileSync('curation/examples/human-l0-consumable.synthetic.json','utf8'));
const mechanics=JSON.parse(readFileSync('curation/examples/human-l0-mechanics.synthetic.json','utf8'));
const recipe=JSON.parse(readFileSync('curation/human-l0-consumable-compilation.json','utf8'));
function bundle() {
  const doc=structuredClone(original);
  const grant=(name:string,effect:unknown)=>({id:`test:${name}`,origin:{publicationId:'test',version:null,entityId:'test:program',resultId:null,componentId:name},subject:'character',precondition:{kind:'always'},frequency:'once',source:'kit',consequence:{kind:'effect',pending:null,effect}});
  doc.grants.push(
    grant('armor',{op:'grant-item',itemId:'fixture-wrap',quantity:1,unit:'count',possession:'carried',usageApplied:false,timing:'creation'}),
    grant('money',{op:'grant-currency',amount:'9007199254740993',denomination:'bits',bits:'9007199254740993',timing:'creation'}),
    grant('language',{op:'grant-language',languageId:'test:language',abilities:'read-write',subject:'character',timing:'creation'}),
    grant('profession',{op:'grant-profession',professionId:'test:profession',subject:'character',timing:'creation'}),
    grant('point',{op:'grant-item',itemId:'fixture-point',quantity:1,unit:'count',possession:'carried',usageApplied:false,timing:'creation'}),
  );
  const bytes=Buffer.from(JSON.stringify(doc));
  return compileHumanL0Consumable(bytes,{...recipe,input:{...recipe.input,sha256:createHash('sha256').update(bytes).digest('hex')}}).bundle;
}
const make=async(b=bundle())=>({b,s:await newConsumableSession(await newHumanL0Character(mechanics.selection,mechanics.packs),b)});
const table=(tableId='fixture:bands',face=1)=>({type:'table',tableId,columnId:'main',faces:[face],modifier:0});
describe('consumable handlers replay pinned decisions through the Human engine',()=>{
  it('keeps authorized rule modifiers pending until their event context is supported',async()=>{
    const b=bundle();
    b.document.tables.find(t=>t.id==='fixture:open')!.columns[0].modifierDomain={kind:'authorized-rules',rules:['test:modifier']};
    b.documentSha256=await consumableDigest(b.document);
    const {s:empty}=await make(b);
    const s=await performConsumableCommand(empty,mechanics.packs,b,'rule-domain',table('fixture:open'));
    const v=await calculateConsumableSession(s,mechanics.packs,b);
    expect(v.diagnostics).toContainEqual({actionId:'rule-domain',reason:'modifier-rule-context-required',retainsConsequence:true});
    expect(v.outcomes[0].rowId).toBeUndefined();expect(v.inventory).toEqual([]);
  });
  it('replays exact grants once per origin, retaining distinct language abilities and integer money',async()=>{
    const {b,s:empty}=await make();let s=empty;
    for(const name of ['money','language','profession'])s=await performConsumableCommand(s,mechanics.packs,b,name,{type:'grant',grantId:`test:${name}`});
    s=await performConsumableCommand(s,mechanics.packs,b,'money-again',{type:'grant',grantId:'test:money'});
    const v=await calculateConsumableSession(s,mechanics.packs,b);
    expect(v.moneyBits).toBe('9007199254740993');expect(v.languages).toMatchObject([{abilities:'read-write'}]);expect(v.professions).toHaveLength(1);
    expect(await calculateConsumableSession(parseConsumableSession(JSON.parse(JSON.stringify(s))),mechanics.packs,b)).toEqual(v);
    expect(await performConsumableCommand(s,mechanics.packs,b,'money',{type:'grant',grantId:'test:money'})).toEqual(s);
    await expect(performConsumableCommand(s,mechanics.packs,b,'money',{type:'grant',grantId:'test:armor'})).rejects.toThrow('action-id-conflict');
    expect(JSON.stringify(s)).not.toMatch(/"consequence"|"price"|"document"|"mechanics"/);
    expect(v).toMatchObject({fullyResolved:false,officialGenerationEnabled:false,exportEnabled:false});
  });
  it('resolves explicit faces, binds lookups to the prior producer and never draws',async()=>{
    const {b,s:empty}=await make(),draw=vi.spyOn(random,'createSubstream');
    try {
      let s=await performConsumableCommand(empty,mechanics.packs,b,'rolled',table());
      s=await performConsumableCommand(s,mechanics.packs,b,'read',{type:'lookup',lookupId:'fixture:gear-by-band',priorActionId:'rolled'});
      s=await performConsumableCommand(s,mechanics.packs,b,'grant',{type:'grant',grantId:'fixture:grant:token'});
      const v=await calculateConsumableSession(s,mechanics.packs,b);expect(v.inventory).toHaveLength(1);expect(v.outcomes[1].entries).toHaveLength(1);
      await expect(performConsumableCommand(empty,mechanics.packs,b,'bad',{...table(),faces:[7]})).rejects.toThrow('faces-invalid');
      await expect(performConsumableCommand(empty,mechanics.packs,b,'bad',{...table(),modifier:1})).rejects.toThrow('modifier-unauthorized');
      const wrong=await performConsumableCommand(s,mechanics.packs,b,'wrong',{type:'lookup',lookupId:'fixture:gear-by-band',priorActionId:'read'});
      expect((await calculateConsumableSession(wrong,mechanics.packs,b)).diagnostics).toContainEqual(expect.objectContaining({reason:'lookup-prior-unavailable'}));
      expect(draw).not.toHaveBeenCalled();
      let linked=await performConsumableCommand(empty,mechanics.packs,b,'parent',table('fixture:bands',6));
      linked=await performConsumableCommand(linked,mechanics.packs,b,'child',{...table('fixture:child'),parentActionId:'parent'});
      const resolved=await calculateConsumableSession(linked,mechanics.packs,b);
      expect(resolved.outcomes[1].rowId).toBe('fixture:child:1');
      expect(resolved.diagnostics.some(d=>d.reason==='subtable-input-required')).toBe(false);
    }finally{draw.mockRestore();}
  });
  it('preserves pending choices, disabled sources and bounded cycles without fabricating results',async()=>{
    const {b,s:empty}=await make();let s=await performConsumableCommand(empty,mechanics.packs,b,'choice',{type:'grant',grantId:'fixture:grant:choice'});
    s=await performConsumableCommand(s,mechanics.packs,b,'mid',table('fixture:bands',3));
    s=await performConsumableCommand(s,mechanics.packs,b,'disabled',{type:'lookup',lookupId:'fixture:gear-by-band',priorActionId:'mid'});
    for(let i=0;i<=b.document.recursion.maxDepth;i++)s=await performConsumableCommand(s,mechanics.packs,b,`cycle-${i}`,{...table(i%2?'fixture:cycle-b':'fixture:cycle-a'),...(i?{parentActionId:`cycle-${i-1}`}:{})});
    const v=await calculateConsumableSession(s,mechanics.packs,b);
    expect(v.diagnostics.map(d=>d.reason)).toEqual(expect.arrayContaining(['choice-required','disabled-source','bounded-recursion']));
    expect(v.inventory).toHaveLength(0);expect(v.diagnostics.every(d=>d.retainsConsequence)).toBe(true);
  });
  it('applies Defense substitution only while equipped, in the existing calculation order',async()=>{
    const {b,s:empty}=await make();let s=await performConsumableCommand(empty,mechanics.packs,b,'armor',{type:'grant',grantId:'test:armor'});
    s.character=await performHumanL0Command(s.character,mechanics.packs,{type:'manual-effect',effect:{authority:'user',reason:'Synthetic test',modifiers:[{phase:'characteristic',target:'defense',delta:2}],equipment:null}});
    const before=await calculateConsumableSession(s,mechanics.packs,b),origin=before.inventory[0].origin;
    expect(before.base.stats?.defense).toBe(before.base.stats!.agility+2);
    s=await performConsumableCommand(s,mechanics.packs,b,'equip',{type:'equip',itemOrigin:origin,equipped:true});
    expect((await calculateConsumableSession(s,mechanics.packs,b)).base.stats?.defense).toBe(before.base.stats!.agility+3);
    s=await performConsumableCommand(s,mechanics.packs,b,'store',{type:'equip',itemOrigin:origin,equipped:false});
    const after=await calculateConsumableSession(s,mechanics.packs,b);expect(after.base.stats).toEqual(before.base.stats);expect(after.inventory).toHaveLength(1);
    expect(await calculateHumanL0Character(s.character,mechanics.packs)).toEqual(after.base);
  });
  it('suspends changed sources/selections, preserves state, and keeps the session out of existing exports',async()=>{
    const {b,s:empty}=await make();let s=await performConsumableCommand(empty,mechanics.packs,b,'money',{type:'grant',grantId:'test:money'});
    s.character=await performHumanL0Command(s.character,mechanics.packs,{type:'state',target:'damage',value:4,reason:'Preserve state'});
    expect((await calculateConsumableSession(s,mechanics.packs,b)).base.states?.damage).toBe(4);
    const changed=structuredClone(b);changed.documentSha256='0'.repeat(64);
    const suspended=await calculateConsumableSession(s,mechanics.packs,changed);expect(suspended.moneyBits).toBe('0');expect(suspended.diagnostics[0].reason).toBe('bundle-unavailable-or-changed');
    const selection=structuredClone(mechanics.selection);selection.attributes.increase='agility';
    s.character=await performHumanL0Command(s.character,mechanics.packs,{type:'select',selection});
    const v=await calculateConsumableSession(s,mechanics.packs,b);expect(v.moneyBits).toBe('0');expect(v.diagnostics[0].reason).toBe('selection-changed');expect(v.base.states?.damage).toBe(4);
    expect(()=>exportGeneratedCharacter(s as never)).toThrow();
  });
  it('handles explicit wielding separately from possession and diagnoses equipment conflicts',async()=>{
    const {b,s:empty}=await make();let s=await performConsumableCommand(empty,mechanics.packs,b,'point',{type:'grant',grantId:'test:point'});
    let v=await calculateConsumableSession(s,mechanics.packs,b);const point=v.inventory[0].origin;
    expect(v.base.stats!.defense).not.toBe(1);
    s=await performConsumableCommand(s,mechanics.packs,b,'wield',{type:'equip',itemOrigin:point,equipped:true,usage:'wielded'});
    expect((await calculateConsumableSession(s,mechanics.packs,b)).base.stats!.defense).toBe(1);
    s=await performConsumableCommand(s,mechanics.packs,b,'armor',{type:'grant',grantId:'test:armor'});
    v=await calculateConsumableSession(s,mechanics.packs,b);
    s=await performConsumableCommand(s,mechanics.packs,b,'wear',{type:'equip',itemOrigin:v.inventory[1].origin,equipped:true});
    v=await calculateConsumableSession(s,mechanics.packs,b);expect(v.base.stats).toBeNull();expect(v.base.issues).toContain('conflicting-equipment');expect(v.inventory).toHaveLength(2);
    s=await performConsumableCommand(s,mechanics.packs,b,'unwield',{type:'equip',itemOrigin:point,equipped:false,usage:'wielded'});
    expect((await calculateConsumableSession(s,mechanics.packs,b)).base.stats).not.toBeNull();
  });
});
