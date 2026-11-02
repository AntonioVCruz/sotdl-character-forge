import { z } from 'zod';
import { createSubstream, PRNG_VERSION } from '../random-tables';
import { RevisionRefSchema } from '../curation/source-policy';
import { HumanL0SelectionSchema, parseHumanL0MechanicalPacks, parseHumanL0Selection,
  type HumanL0Selection, type HumanL0MechanicalPack } from '../curation/human-l0-mechanics';

const attributes = ['strength', 'agility', 'intellect', 'will'] as const;
const attribute = z.enum(attributes), state = z.enum(['damage','insanity','corruption']);
const characteristic = z.enum(['health','defense','perception','speed','power']);
const bounded = z.number().int().min(-10000).max(10000);
const states = z.object({damage:z.number().int().nonnegative(),insanity:z.number().int().nonnegative(),corruption:z.number().int().nonnegative()}).strict();
const pin = z.object({ref:RevisionRefSchema,sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
const pins = z.array(pin).min(1).max(2);
const base = { id:z.string(), seq:z.number().int().positive() };
const selectionFields = { selection:HumanL0SelectionSchema, pins, rolled:z.boolean() };
// These are explicit user adjustments, not grants inferred from unimplemented published tables.
export const HumanL0ManualEffectSchema = z.object({
  authority:z.literal('user'), reason:z.string().trim().min(1).max(500),
  modifiers:z.array(z.discriminatedUnion('phase',[
    z.object({phase:z.literal('attribute'),target:attribute,delta:bounded}).strict(),
    z.object({phase:z.literal('characteristic'),target:characteristic,delta:bounded}).strict(),
  ])).max(30),
  equipment:z.object({defense:z.number().int().nullable(),speedDelta:bounded}).strict().nullable(),
}).strict();
const event = z.discriminatedUnion('type',[
  z.object({...base,type:z.literal('create'),...selectionFields,initialStates:states}).strict(),
  z.object({...base,type:z.literal('select'),...selectionFields,replacesEventId:z.string()}).strict(),
  z.object({...base,type:z.literal('state'),target:state,value:z.number().int().nonnegative(),reason:z.string().trim().min(1).max(500)}).strict(),
  z.object({...base,type:z.literal('manual-effect'),effect:HumanL0ManualEffectSchema}).strict(),
  z.object({...base,type:z.literal('effect-active'),effectEventId:z.string(),active:z.boolean()}).strict(),
]);
export const HumanL0CharacterSchema = z.object({
  schemaVersion:z.literal(1),kind:z.literal('sotdl-human-l0-character'),mode:z.literal('local-preview'),level:z.literal(0),
  id:z.string().min(1).max(200),name:z.string().max(200),revision:z.number().int().nonnegative(),events:z.array(event).min(1).max(10000),
}).strict();
export type HumanL0Character = z.infer<typeof HumanL0CharacterSchema>;
type Event = HumanL0Character['events'][number];
type SelectionEvent = Extract<Event,{type:'create'|'select'}>;
const fail = (code:string):never=>{throw new Error(`Human L0: ${code}.`);};

/** Portable structural/history gate. Missing packs do not destroy the saved character. */
export function parseHumanL0Character(input:unknown):HumanL0Character {
  const parsed=HumanL0CharacterSchema.safeParse(input);
  if(!parsed.success)return fail('character-invalid');
  const c=parsed.data, effects=new Set<string>(), rolls=new Map<string,string>();
  let previous:SelectionEvent|undefined;
  if(c.revision!==c.events.length-1)return fail('revision-invalid');
  for(const [i,e] of c.events.entries()) {
    if(e.seq!==i+1||e.id!==`human-${i+1}`||(i===0)!==(e.type==='create'))return fail('event-history-invalid');
    if(e.type==='create'||e.type==='select') {
      if(e.type==='select'&&e.replacesEventId!==previous?.id)return fail('selection-history-invalid');
      if(new Set(e.pins.map(p=>stable(p.ref))).size!==e.pins.length)return fail('duplicate-source-pin');
      if(e.selection.attributes.mode==='random') {
        const a=e.selection.attributes;
        if(a.prngVersion!==PRNG_VERSION)return fail('unsupported-prng');
        if(new Set(a.rolls.map(r=>r.attribute)).size!==4||new Set(a.rolls.map(r=>r.eventId)).size!==4)return fail('duplicate-attribute-roll');
        for(const r of a.rolls) {
          const signature=stable({attribute:r.attribute,face:r.face,seed:a.seed,prngVersion:a.prngVersion,ancestry:e.selection.ancestry});
          if(rolls.has(r.eventId)&&rolls.get(r.eventId)!==signature)return fail('roll-history-conflict');
          rolls.set(r.eventId,signature);
          if(e.rolled&&r.eventId!==`${e.id}/${r.attribute}`)return fail('roll-event-link-invalid');
        }
      } else if(e.rolled)return fail('rolled-fixed-selection');
      previous=e;
    }
    if(e.type==='manual-effect')effects.add(e.id);
    if(e.type==='effect-active'&&!effects.has(e.effectEventId))return fail('unknown-effect-event');
  }
  return c;
}
function stable(value:unknown):string {
  if(Array.isArray(value))return `[${value.map(stable).join(',')}]`;
  if(value&&typeof value==='object')return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
async function digest(value:unknown) {
  const bytes=new TextEncoder().encode(stable(value));
  const hash=await globalThis.crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(hash)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function mechanics(selection:HumanL0Selection,packs:HumanL0MechanicalPack[]) {
  return packs.find(p=>p.packId===selection.ancestry.packId&&p.version===selection.ancestry.version)!.entities[0].mechanics;
}
async function sourcePins(selection:HumanL0Selection,packs:HumanL0MechanicalPack[]) {
  const needed=new Set([selection.ancestry.packId,selection.procedure.ref.packId]);
  for(const p of packs)if(needed.has(p.packId))for(const dependency of p.dependencies)needed.add(dependency.packId);
  return Promise.all(packs.filter(p=>needed.has(p.packId)).map(async p=>({
    ref:{packId:p.packId,version:p.version,entityId:p.entities[0].id},sha256:await digest(p),
  })));
}
async function checkedSelection(input:unknown,packInput:unknown) {
  const packs=parseHumanL0MechanicalPacks(packInput),selection=parseHumanL0Selection(input,packs);
  if(selection.attributes.mode==='random'&&selection.attributes.prngVersion!==PRNG_VERSION)return fail('unsupported-prng');
  return {packs,selection,pins:await sourcePins(selection,packs)};
}
export async function newHumanL0Character(selectionInput:unknown,packInput:unknown,identity={id:'local-human-l0',name:''}):Promise<HumanL0Character> {
  const {packs,selection,pins}=await checkedSelection(selectionInput,packInput),m=mechanics(selection,packs);
  return parseHumanL0Character({schemaVersion:1,kind:'sotdl-human-l0-character',mode:'local-preview',level:0,...identity,revision:0,
    events:[{id:'human-1',seq:1,type:'create',selection,pins,rolled:false,
      initialStates:{damage:m.initialStates.damage.value,insanity:m.initialStates.insanity.value,corruption:m.initialStates.corruption.value}}]});
}
export const HumanL0CommandSchema=z.discriminatedUnion('type',[
  z.object({type:z.literal('select'),selection:HumanL0SelectionSchema}).strict(),
  z.object({type:z.literal('roll-attributes'),seed:z.string().trim().min(1).max(200)}).strict(),
  z.object({type:z.literal('state'),target:state,value:z.number().int().nonnegative(),reason:z.string().trim().min(1).max(500)}).strict(),
  z.object({type:z.literal('manual-effect'),effect:HumanL0ManualEffectSchema}).strict(),
  z.object({type:z.literal('effect-active'),effectEventId:z.string(),active:z.boolean()}).strict(),
]);
export type HumanL0Command=z.infer<typeof HumanL0CommandSchema>;
const currentSelection=(c:HumanL0Character)=>c.events.filter((e):e is SelectionEvent=>e.type==='create'||e.type==='select').at(-1)!;

export async function performHumanL0Command(input:unknown,packInput:unknown,commandInput:unknown):Promise<HumanL0Character> {
  const c=parseHumanL0Character(input),command=HumanL0CommandSchema.safeParse(commandInput);
  if(!command.success)return fail('command-invalid');
  const seq=c.events.length+1,header={id:`human-${seq}`,seq},cmd=command.data;
  let next:Event;
  if(cmd.type==='select'||cmd.type==='roll-attributes') {
    let selected=cmd.type==='select'?cmd.selection:structuredClone(currentSelection(c).selection);
    if(cmd.type==='roll-attributes') {
      const {packs,selection}=await checkedSelection(selected,packInput),m=mechanics(selection,packs);
      if(!m.attributes.random)return fail('random-mode-unavailable');
      // The sole draw boundary. Each attribute has an independent versioned substream.
      const reroll=c.events.filter(e=>(e.type==='create'||e.type==='select')&&e.rolled).length;
      selected={...selection,attributes:{mode:'random',seed:cmd.seed,prngVersion:PRNG_VERSION,
        rolls:attributes.map(attribute=>({attribute,eventId:`${header.id}/${attribute}`,
          face:createSubstream(cmd.seed,`human-l0/${selection.ancestry.packId}/${selection.ancestry.version}/${attribute}`,reroll).int(m.attributes.random!.dice.sides)+1}))}};
    }
    const checked=await checkedSelection(selected,packInput);
    next={...header,type:'select',selection:checked.selection,pins:checked.pins,rolled:cmd.type==='roll-attributes',replacesEventId:currentSelection(c).id};
  } else {
    // Changes affecting the sheet require a valid source context. Saved files can still be opened without it.
    if(!(cmd.type==='effect-active'&&!cmd.active)) {
      const view=await calculateHumanL0Character(c,packInput);
      if(!view.baseResolved)return fail('source-context-unresolved');
    }
    next={...header,...cmd};
  }
  return parseHumanL0Character({...c,revision:c.revision+1,events:[...c.events,next]});
}

export type HumanL0Stats={strength:number;agility:number;intellect:number;will:number;health:number;defense:number;perception:number;speed:number;power:number;size:number;healingRate:number;
  strengthModifier:number;agilityModifier:number;intellectModifier:number;willModifier:number;perceptionModifier:number};
export type HumanL0View={stats:HumanL0Stats|null;states:z.infer<typeof states>|null;languages:{languageId:string;abilities:['speak'];origin:string}[];
  grants:{kind:string;count?:number;origin:string}[];issues:string[];baseResolved:boolean;fullyResolved:false;officialGenerationEnabled:false;
  breakdown:{phase:string;target:string;value:number;origin:string}[]};

/** Pure replay of recorded decisions: no RNG, cached totals or demo equipment policy. */
export async function calculateHumanL0Character(input:unknown,packInput:unknown):Promise<HumanL0View> {
  const c=parseHumanL0Character(input),first=c.events[0] as Extract<Event,{type:'create'}>,selected=currentSelection(c);
  const suspended:HumanL0View={stats:null,states:null,languages:[],grants:[],issues:['source-or-selection-unavailable'],baseResolved:false,fullyResolved:false,officialGenerationEnabled:false,breakdown:[]};
  let packs:HumanL0MechanicalPack[],selection:HumanL0Selection;
  try {
    packs=parseHumanL0MechanicalPacks(packInput);
    for(const e of [first,selected]) {
      const checked=await checkedSelection(e.selection,packs);
      if(!samePins(e.pins,checked.pins))return suspended;
    }
    selection=parseHumanL0Selection(selected.selection,packs);
    const initial=mechanics(first.selection,packs).initialStates;
    if(!samePins(first.initialStates,{damage:initial.damage.value,insanity:initial.insanity.value,corruption:initial.corruption.value}))return suspended;
  } catch {return suspended;}
  const m=mechanics(selection,packs),a={} as Record<typeof attributes[number],number>,breakdown:HumanL0View['breakdown']=[];
  for(const key of attributes) a[key]=selection.attributes.mode==='fixed'?m.attributes.fixed.base+(selection.attributes.increase===key?m.attributes.fixed.increaseBy:0):
    m.attributes.random!.base+selection.attributes.rolls.find(r=>r.attribute===key)!.face;
  if(selection.adjustment) {a[selection.adjustment.increase]+=m.attributes.adjustment.amount;a[selection.adjustment.decrease]-=m.attributes.adjustment.amount;}
  const active=new Map<string,{effect:z.infer<typeof HumanL0ManualEffectSchema>;active:boolean}>(),currentStates={...first.initialStates};
  for(const e of c.events) {
    if(e.type==='manual-effect')active.set(e.id,{effect:e.effect,active:true});
    if(e.type==='effect-active')active.get(e.effectEventId)!.active=e.active;
    if(e.type==='state')currentStates[e.target]=e.value;
  }
  const effects=[...active].filter(([,v])=>v.active);
  for(const key of attributes)breakdown.push({phase:'attribute-mode-and-transfer',target:key,value:a[key],origin:selected.id});
  for(const [id,{effect}] of effects)for(const v of effect.modifiers)if(v.phase==='attribute') {
    a[v.target]+=v.delta;breakdown.push({phase:'attribute-effects',target:v.target,value:v.delta,origin:id});
  }
  for(const key of attributes) {
    const before=a[key];a[key]=Math.max(m.attributes.limits.minimum,Math.min(m.attributes.limits.maximum,a[key]));
    if(a[key]!==before)breakdown.push({phase:'attribute-limits',target:key,value:a[key]-before,origin:selected.id});
  }
  const values={health:a.strength,defense:a.agility,perception:a.intellect,speed:m.characteristics.speed.value,power:m.characteristics.power.value};
  const armor=effects.filter(([,v])=>v.effect.equipment?.defense!==null&&v.effect.equipment?.defense!==undefined);
  if(armor.length>1)return {...suspended,issues:['conflicting-manual-equipment']};
  if(armor.length) {
    values.defense=armor[0][1].effect.equipment!.defense!;
    breakdown.push({phase:'equipment-defense-replacement',target:'defense',value:values.defense,origin:armor[0][0]});
  }
  for(const [id,{effect}] of effects) {
    if(effect.equipment) {values.speed+=effect.equipment.speedDelta;breakdown.push({phase:'equipment',target:'speed',value:effect.equipment.speedDelta,origin:id});}
    for(const v of effect.modifiers)if(v.phase==='characteristic') {values[v.target]+=v.delta;breakdown.push({phase:'direct-characteristic-effects',target:v.target,value:v.delta,origin:id});}
  }
  values.defense=Math.min(values.defense,m.finalLimits.defense.value);values.perception=Math.min(values.perception,m.finalLimits.perception.value);
  const subtract=m.modifiers.subtract.value,stats:HumanL0Stats={...a,...values,size:selection.size,
    healingRate:Math.max(m.healingRate.minimum.value,Math.floor(values.health/m.healingRate.divisor.value)),
    strengthModifier:a.strength-subtract,agilityModifier:a.agility-subtract,intellectModifier:a.intellect-subtract,willModifier:a.will-subtract,perceptionModifier:values.perception-subtract};
  const procedure=packs.find(p=>p.packId===selection.procedure.ref.packId)!.entities[0].mechanics.procedure;
  const languages:HumanL0View['languages']=[{languageId:m.baseLanguage.languageId,abilities:['speak'],origin:selected.id}];
  if(selection.coreBenefit?.kind==='speak-language')languages.push({languageId:selection.coreBenefit.languageId,abilities:['speak'],origin:selected.id});
  const grants:HumanL0View['grants']=procedure.kind==='core'?[{kind:'starting-profession-choices',count:procedure.startingProfessions.count,origin:selected.id}]:[];
  if(selection.coreBenefit?.kind==='random-profession')grants.push({kind:'pending-random-profession',count:1,origin:selected.id});
  const issues=['local-preview-only','procedure-outcomes-pending','equipment-and-table-catalog-pending','source-and-distribution-review-pending'];
  for(const [target,value] of Object.entries(stats))breakdown.push({phase:'final',target,value,origin:selected.id});
  return {stats,states:currentStates,languages,grants,issues,baseResolved:true,fullyResolved:false,officialGenerationEnabled:false,breakdown};
}
const samePins=(a:unknown,b:unknown)=>stable(a)===stable(b);
export const exportHumanL0Character=(input:unknown)=>JSON.stringify(parseHumanL0Character(input),null,2);
export function importHumanL0Character(text:string) {
  if(text.length>5_000_000)return fail('file-too-large');
  try {return parseHumanL0Character(JSON.parse(text));} catch {return fail('file-invalid');}
}
