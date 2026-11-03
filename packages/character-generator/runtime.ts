import { calculateCharacter, exportCharacter, importCharacter, parseCharacter, type Character } from './index';
import { calculateHumanL0Character, exportHumanL0Character, importHumanL0Character, parseHumanL0Character, type HumanL0Character } from './human-l0';
import type { Snapshot } from '../catalog';

export * from './human-l0';
export * from './human-l0-procedure';
export type GeneratedCharacter = Character | HumanL0Character;
const isHuman = (value:unknown) => !!value&&typeof value==='object'&&'kind' in value&&value.kind==='sotdl-human-l0-character';
/** Explicit dispatch keeps the Human contract separate from the demo's v1/v2 migrations. */
export function parseGeneratedCharacter(value:unknown):GeneratedCharacter {
  return isHuman(value)?parseHumanL0Character(value):parseCharacter(value);
}
export function importGeneratedCharacter(text:string):GeneratedCharacter {
  if(text.length>5_000_000)throw new Error('Character file too large.');
  let value:unknown;try{value=JSON.parse(text);}catch{throw new Error('Character file invalid.');}
  return isHuman(value)?importHumanL0Character(text):importCharacter(text);
}
export function exportGeneratedCharacter(value:GeneratedCharacter) {
  return value.kind==='sotdl-human-l0-character'?exportHumanL0Character(value):exportCharacter(value);
}
export async function calculateGeneratedCharacter(value:GeneratedCharacter,catalog:Snapshot) {
  if(value.kind==='sotdl-human-l0-character') {
    // Use exact stored references, never the enabled demo registry or a newest-version fallback.
    const refs=value.events.flatMap(e=>e.type==='create'||e.type==='select'?e.pins.map(p=>p.ref):[]);
    const packs=catalog.packs.filter(p=>refs.some(r=>r.packId===p.packId&&r.version===p.version));
    return {kind:value.kind,view:await calculateHumanL0Character(value,packs)};
  }
  return {kind:value.kind,view:calculateCharacter(value,catalog)};
}
