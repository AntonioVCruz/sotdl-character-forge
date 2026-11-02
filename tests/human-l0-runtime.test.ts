import { readFileSync } from 'node:fs';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import * as random from '../packages/random-tables';
import { emptySnapshot,importPack } from '../packages/catalog';
import { newCharacter,parseCharacter,calculateCharacter,exportCharacter } from '../packages/character-generator';
import { calculateGeneratedCharacter,exportGeneratedCharacter,importGeneratedCharacter,newHumanL0Character,parseHumanL0Character,
  performHumanL0Command,calculateHumanL0Character } from '../packages/character-generator/runtime';
import { loadCharacter,saveCharacter,loadHumanL0Character,saveHumanL0Character } from '../packages/character-generator/storage';

const fixture=JSON.parse(readFileSync('curation/examples/human-l0-mechanics.synthetic.json','utf8'));
const packs=()=>structuredClone(fixture.packs);
const selection=()=>structuredClone(fixture.selection);
const ref=(p:typeof fixture.packs[number])=>({packId:p.packId,version:p.version,entityId:p.entities[0].id});
const effect=(modifiers:unknown[]=[],equipment:unknown=null)=>({type:'manual-effect',effect:{authority:'user',reason:'Invented adjustment for testing.',modifiers,equipment}});
async function character(){return newHumanL0Character(selection(),packs());}
beforeEach(()=>vi.stubGlobal('indexedDB',new IDBFactory()));
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

describe('Human L0 engine uses the versioned mechanical pack contract',()=>{
  it('derives the complete synthetic base and state without treating it as a complete official character',async()=>{
    const p=packs(),s=selection(),c=await newHumanL0Character(s,p),before=JSON.stringify({p,s,c});
    const view=await calculateHumanL0Character(c,p);
    expect(view.stats).toEqual({strength:8,agility:6,intellect:6,will:6,health:8,defense:6,perception:6,speed:7,power:0,size:1,healingRate:2,
      strengthModifier:2,agilityModifier:0,intellectModifier:0,willModifier:0,perceptionModifier:0});
    expect(view.states).toEqual({damage:0,insanity:0,corruption:0});
    expect(view).toMatchObject({baseResolved:true,fullyResolved:false,officialGenerationEnabled:false});
    expect(view.issues).toContain('procedure-outcomes-pending');
    expect(JSON.stringify({p,s,c})).toBe(before);
  });
  it('supports all six ancestry/mode/procedure combinations and only the appropriate speech benefit',async()=>{
    const p=packs();let count=0;
    for(let ancestry=0;ancestry<2;ancestry++)for(let procedure=0;procedure<2;procedure++)for(const mode of ancestry?['fixed','random']:['fixed']) {
      const s=selection();s.ancestry=ref(p[ancestry]);s.procedure={ref:ref(p[procedure]),kind:procedure?'human-development':'core'};
      s.coreBenefit=ancestry===0&&procedure===0?{kind:'speak-language',languageId:'fixture-other'}:null;
      if(mode==='random')s.attributes={mode,seed:'recorded',prngVersion:random.PRNG_VERSION,
        rolls:['strength','agility','intellect','will'].map((attribute,i)=>({attribute,eventId:`recorded-${i}`,face:i+1}))};
      const c=await newHumanL0Character(s,p),v=await calculateHumanL0Character(c,p);
      expect(v.baseResolved).toBe(true);expect(v.languages).toHaveLength(ancestry===0&&procedure===0?2:1);
      expect(v.languages.every(l=>l.abilities.join(',')==='speak')).toBe(true);
      expect(v.grants.some(g=>g.kind==='starting-profession-choices')).toBe(procedure===0);
      if(mode==='random')expect(v.stats?.strength).toBe(4);count++;
    }
    expect(count).toBe(6);
  });
  it('recomputes attributes before derived characteristics and Healing Rate from final Health',async()=>{
    let c=await character();
    c=await performHumanL0Command(c,packs(),effect([{phase:'attribute',target:'strength',delta:4},{phase:'characteristic',target:'health',delta:3}]));
    let v=await calculateHumanL0Character(c,packs());expect(v.stats).toMatchObject({strength:12,health:15,healingRate:5,strengthModifier:6});
    const s=selection();s.attributes.increase='agility';
    c=await performHumanL0Command(c,packs(),{type:'select',selection:s});
    v=await calculateHumanL0Character(c,packs());expect(v.stats).toMatchObject({strength:10,agility:8,health:13,defense:8,healingRate:4});
    expect(c.events).toHaveLength(3);
  });
  it('changes Size and an optional transfer through explicit selections, without resetting states',async()=>{
    const p=packs();for(const pack of p)pack.entities[0].mechanics.size.choices=[0.75,1];
    let c=await newHumanL0Character(selection(),p);
    c=await performHumanL0Command(c,p,{type:'state',target:'damage',value:3,reason:'Keep current damage.'});
    const s=selection();s.size=0.75;s.adjustment={increase:'will',decrease:'strength'};
    c=await performHumanL0Command(c,p,{type:'select',selection:s});
    const v=await calculateHumanL0Character(c,p);expect(v.stats).toMatchObject({size:0.75,strength:7,will:7,health:7});expect(v.states?.damage).toBe(3);
    s.adjustment.decrease='will';await expect(performHumanL0Command(c,p,{type:'select',selection:s})).rejects.toThrow();
  });
  it('applies attribute caps before deriving, final caps after direct effects and manual equipment replacement',async()=>{
    let c=await character();
    c=await performHumanL0Command(c,packs(),effect([{phase:'attribute',target:'intellect',delta:100},{phase:'attribute',target:'agility',delta:-100},
      {phase:'characteristic',target:'perception',delta:100},{phase:'characteristic',target:'defense',delta:20}],{defense:17,speedDelta:-2}));
    let v=await calculateHumanL0Character(c,packs());
    expect(v.stats).toMatchObject({intellect:30,agility:1,perception:18,perceptionModifier:12,defense:18,speed:5});
    expect(v.breakdown.some(b=>b.phase==='equipment-defense-replacement')).toBe(true);
    c=await performHumanL0Command(c,packs(),{type:'effect-active',effectEventId:'human-2',active:false});
    v=await calculateHumanL0Character(c,packs());expect(v.stats).toMatchObject({intellect:6,agility:6,perception:6,defense:6,speed:7});
  });
  it('preserves changed initial states through selection, effects, import, recalculation and IndexedDB reopen',async()=>{
    const original=await character();let c=original;
    for(const [target,value] of [['damage',4],['insanity',2],['corruption',1]] as const)c=await performHumanL0Command(c,packs(),{type:'state',target,value,reason:'Recorded state change.'});
    const s=selection();s.ancestry=ref(packs()[0]);s.coreBenefit={kind:'speak-language',languageId:'fixture-other'};
    c=await performHumanL0Command(c,packs(),{type:'select',selection:s});
    c=await performHumanL0Command(c,packs(),effect([{phase:'attribute',target:'strength',delta:1}]));
    const exported=exportGeneratedCharacter(c),restored=importGeneratedCharacter(exported);
    await saveHumanL0Character(restored,null);const loaded=await loadHumanL0Character();
    expect(loaded).toEqual(c);expect((await calculateHumanL0Character(loaded,packs())).states).toEqual({damage:4,insanity:2,corruption:1});
    expect((await calculateHumanL0Character(loaded,packs())).states).toEqual({damage:4,insanity:2,corruption:1});
    expect(exported).not.toMatch(/"mechanics"|"evidence"|"baseStats"|"stats"|"excerpt"/);
    expect(original.events).toHaveLength(1);
  });
  it('records four versioned independent rolls only on the roll command; replay/import/storage do not draw',async()=>{
    const c=await character(),draw=vi.spyOn(random,'createSubstream');
    const rolled=await performHumanL0Command(c,packs(),{type:'roll-attributes',seed:'seed-human'});
    expect(draw).toHaveBeenCalledTimes(4);
    expect(await performHumanL0Command(c,packs(),{type:'roll-attributes',seed:'seed-human'})).toEqual(rolled);
    draw.mockClear();
    const a=rolled.events.at(-1);expect(a&&'selection' in a&&a.selection.attributes.mode).toBe('random');
    const restored=importGeneratedCharacter(exportGeneratedCharacter(rolled));
    await saveHumanL0Character(restored,null);await loadHumanL0Character();
    expect(await calculateHumanL0Character(restored,packs())).toEqual(await calculateHumanL0Character(rolled,packs()));
    expect(draw).not.toHaveBeenCalled();
    const rerolled=await performHumanL0Command(rolled,packs(),{type:'roll-attributes',seed:'seed-human'});
    expect(rerolled.events).toHaveLength(3);expect(draw).toHaveBeenCalledTimes(4);
  });
  it('rejects rolling an unoffered mode and keeps procedure independent on a roll',async()=>{
    const s=selection(),p=packs();s.ancestry=ref(p[0]);s.coreBenefit={kind:'speak-language',languageId:'fixture-other'};
    await expect(performHumanL0Command(await newHumanL0Character(s,p),p,{type:'roll-attributes',seed:'no'})).rejects.toThrow('random-mode-unavailable');
    const c=await character(),r=await performHumanL0Command(c,p,{type:'roll-attributes',seed:'yes'});
    const last=r.events.at(-1)!;
    expect('selection' in last&&last.selection.procedure).toEqual(selection().procedure);
  });
  it('opens saves without source packs and suspends computation instead of substituting other versions',async()=>{
    const c=await character(),restored=importGeneratedCharacter(exportGeneratedCharacter(c));
    expect(restored).toEqual(c);
    expect(await calculateHumanL0Character(restored,[])).toMatchObject({stats:null,states:null,baseResolved:false});
    const p=packs();p[0].version='9.0.0';
    expect((await calculateHumanL0Character(c,p)).stats).toBeNull();
    expect(c.events).toHaveLength(1);
  });
  it('pins whole source content with SHA256 and suspends same-version mechanics changes',async()=>{
    const c=await character(),p=packs();p[1].entities[0].mechanics.characteristics.speed.value++;
    expect((await calculateHumanL0Character(c,p)).baseResolved).toBe(false);
    // Object key order is irrelevant; source values are not.
    const reversed=(v:any):any=>Array.isArray(v)?v.map(reversed):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reversed(x)])):v;
    expect((await calculateHumanL0Character(c,reversed(packs()))).baseResolved).toBe(true);
  });
  it('rejects malformed history, unknown fields/PRNG/level and cached totals',async()=>{
    const original=await character();
    for(const mutate of [(c:any)=>c.level=1,(c:any)=>c.stats={health:999},(c:any)=>c.events[0].seq=7,
      (c:any)=>c.revision=2,(c:any)=>c.events.push({...c.events[0],seq:2,id:'human-2'})]) {
      const c=structuredClone(original);mutate(c);expect(()=>parseHumanL0Character(c)).toThrow();
    }
    const s=selection();s.attributes={mode:'random',seed:'unknown',prngVersion:'unsupported',rolls:['strength','agility','intellect','will'].map((attribute,i)=>({attribute,eventId:`r${i}`,face:1}))};
    await expect(newHumanL0Character(s,packs())).rejects.toThrow('unsupported-prng');
    const rolled=await performHumanL0Command(original,packs(),{type:'roll-attributes',seed:'duplicate'});
    const a=(rolled.events.at(-1) as any).selection.attributes;a.rolls[1].attribute=a.rolls[0].attribute;
    expect(()=>parseHumanL0Character(rolled)).toThrow('duplicate-attribute-roll');
  });
  it('suspends forged initialization or stored faces and rejects reused roll IDs with conflicting values',async()=>{
    const c=await character();(c.events[0] as any).initialStates.damage=99;
    expect((await calculateHumanL0Character(c,packs())).stats).toBeNull();
    const r=await performHumanL0Command(await character(),packs(),{type:'roll-attributes',seed:'r'});
    const first=r.events.at(-1) as any;first.selection.attributes.rolls[0].face=99;
    expect((await calculateHumanL0Character(r,packs())).stats).toBeNull();
    const fresh=await performHumanL0Command(await character(),packs(),{type:'roll-attributes',seed:'r'});
    const s=structuredClone((fresh.events.at(-1) as any).selection);s.attributes.rolls[0].face=s.attributes.rolls[0].face===1?2:1;
    await expect(performHumanL0Command(fresh,packs(),{type:'select',selection:s})).rejects.toThrow('roll-history-conflict');
  });
  it('suspends conflicting manual equipment and allows deactivation to recover',async()=>{
    let c=await character();c=await performHumanL0Command(c,packs(),effect([],{defense:10,speedDelta:0}));
    c=await performHumanL0Command(c,packs(),effect([],{defense:12,speedDelta:0}));
    expect((await calculateHumanL0Character(c,packs())).issues).toContain('conflicting-manual-equipment');
    c=await performHumanL0Command(c,packs(),{type:'effect-active',effectEventId:'human-3',active:false});
    expect((await calculateHumanL0Character(c,packs())).stats?.defense).toBe(10);
  });
  it('rejects unsupported effects instead of applying the demo policy or inventing a handler',async()=>{
    const c=await character();
    await expect(performHumanL0Command(c,packs(),{type:'manual-effect',effect:{authority:'published-table',reason:'not projected',modifiers:[],equipment:null}})).rejects.toThrow('command-invalid');
    await expect(performHumanL0Command(c,packs(),effect([{phase:'attribute',target:'size',delta:1}]))).rejects.toThrow('command-invalid');
    await expect(performHumanL0Command(c,packs(),{type:'effect-active',effectEventId:'future',active:false})).rejects.toThrow('unknown-effect-event');
  });
  it('routes both character kinds through the package runtime without reinterpreting demo saves',async()=>{
    const demo=newCharacter(),human=await character();let catalog=emptySnapshot();
    for(const p of packs())catalog=importPack(catalog,p).snapshot;
    expect(importGeneratedCharacter(exportGeneratedCharacter(demo))).toEqual(parseCharacter(demo));
    expect(exportGeneratedCharacter(demo)).toEqual(exportCharacter(demo));
    expect((await calculateGeneratedCharacter(demo,catalog)).view).toEqual(calculateCharacter(demo,catalog));
    const routed=await calculateGeneratedCharacter(human,catalog);
    expect(routed.kind).toBe('sotdl-human-l0-character');expect(routed.view.stats).toMatchObject({health:8});
    expect(catalog.ruleset.packs).toEqual([]);
  });
  it('persists by ID, protects concurrent edits and never overwrites the existing demo',async()=>{
    const demo=newCharacter(),c=await character();await saveCharacter(demo,demo);await saveHumanL0Character(c,null);
    const next=await performHumanL0Command(c,packs(),{type:'state',target:'damage',value:3,reason:'Explicit state.'});
    await saveHumanL0Character(next,c);
    await expect(saveHumanL0Character(c,c)).rejects.toThrow('another tab');
    await expect(saveHumanL0Character(c,null)).rejects.toThrow('another tab');
    expect(await loadHumanL0Character()).toEqual(next);expect(await loadCharacter()).toEqual(demo);
    expect(await loadHumanL0Character('absent')).toBeNull();
    const other=await newHumanL0Character(selection(),packs(),{id:'other',name:'Other'});await saveHumanL0Character(other,null);
    expect(await loadHumanL0Character('other')).toEqual(other);
  });
});
