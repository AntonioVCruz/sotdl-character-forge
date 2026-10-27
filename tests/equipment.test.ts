import { describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import tables from '../examples/demo-random-tables.json';
import zero from '../examples/demo-level-zero.json';
import one from '../examples/demo-level-one.json';
import magic from '../examples/demo-magic.json';
import sessionPack from '../examples/demo-spell-session.json';
import { emptySnapshot, importPack, setEnabled } from '../packages/catalog';
import { calculateCharacter, chooseSlot, currentEvents, exportCharacter, importCharacter, newCharacter, parseCharacter, performEquipmentCommand, performSessionCommand, preview, type Character, type Policy } from '../packages/character-generator';
import { loadCharacter, saveCharacter } from '../packages/character-generator/storage';
import { createStandalonePayload, parseStandalonePayload } from '../packages/standalone';

function catalog() {
  let c = emptySnapshot();
  for (const pack of [tables, zero, one, magic, sessionPack]) c = importPack(c, pack).snapshot;
  for (const pack of c.packs) c = setEnabled(c, pack, true);
  return c;
}
const c = catalog();
const p: Policy = { seed: 'equipment-regression', allowUniform: true, mode: 'all-random', perSlotModes: {}, targetLevel: 1 };
function character(magical = false) {
  let next = preview(newCharacter(), c, { ...p, targetLevel: 0 }).character;
  next = chooseSlot(next, c, 'equipment', { ...p, targetLevel: 0 }, { key: 'demo:equipment:coat', quantities: {} });
  if (magical) {
    next = preview(next, c, { ...p, mode: 'manual' }).character;
    for (const [slot, key] of [['novicePath', 'demo:path:spark'], ['pathTraining', 'demo:training:focus'], ['tradition', 'demo:tradition:ember'], ['spell', 'demo:spell:lantern']] as const) next = chooseSlot(next, c, slot, p, { key, quantities: {} });
  }
  return next;
}
const equip = (input: Character, equipped: boolean) => performEquipmentCommand(input, c, { type: 'equipment', equipmentEventId: currentEvents(input).equipment!.id, equipped });

describe('equipamento fictício e combinação de bônus', () => {
  it('deriva uma unidade da escolha atual e mantém compatibilidade equipado por padrão', () => {
    const current = character(), before = exportCharacter(current);
    expect(calculateCharacter(current, c).equipment).toMatchObject({ name: 'Casaco reforçado (fictício)', quantity: 1, equipped: true, status: 'Equipado', policy: 'demo-additive-v1' });
    expect(calculateCharacter(current, c).equipment!.sources).toEqual(currentEvents(current).equipment!.resolution.sources);
    expect(current.session.actions).toEqual([]); expect(exportCharacter(current)).toBe(before);
  });
  it('guardar e equipar preservam eventos, base e rolls e recompõem o bônus uma vez', () => {
    const current = character(), before = calculateCharacter(current, c), stored = equip(current, false);
    expect(calculateCharacter(stored, c).stats.defense).toBe(before.stats.defense! - 1);
    expect(calculateCharacter(stored, c).equipment!.status).toBe('Guardado');
    expect(stored.events).toEqual(current.events); expect(stored.seed).toBe(current.seed);
    expect(stored.session.actions.at(-1)).toMatchObject({ type: 'equipment', itemId: 'demo:equipment:coat', equipped: false });
    expect(exportCharacter(equip(stored, false))).toBe(exportCharacter(stored));
    const worn = equip(stored, true);
    expect(calculateCharacter(worn, c).stats).toEqual(before.stats);
    expect(exportCharacter(equip(worn, true))).toBe(exportCharacter(worn));
  });
  it('100 ciclos não acumulam modificadores nem alteram escolhas', () => {
    const current = character(), before = calculateCharacter(current, c).stats;
    let next = current;
    for (let i=0; i<100; i++) {
      next = equip(next, false); expect(calculateCharacter(next, c).stats.defense).toBe(before.defense! - 1);
      next = equip(next, true); expect(calculateCharacter(next, c).stats).toEqual(before);
    }
    expect(next.events).toEqual(current.events); expect(next.session.actions).toHaveLength(200);
  });
  it('combina equipamento e magia independentemente sem duplicação e descanso não equipa item', () => {
    const base = character(true), baseStats = calculateCharacter(equip(base, false), c).stats;
    let next = performSessionCommand(base, c, { type: 'cast' });
    next = performSessionCommand(next, c, { type: 'activate', castId: 'session-1' });
    let view = calculateCharacter(next, c);
    expect(view.stats.defense).toBe(baseStats.defense! + 2);
    expect(view.breakdown.filter(b => b.target === 'defense').map(b => b.value)).toEqual([baseStats.defense, 1, 1]);
    next = equip(next, false); view = calculateCharacter(next, c);
    expect(view.stats.defense).toBe(baseStats.defense! + 1);
    expect(view.session.effects[0].active).toBe(true); expect(view.session.current?.used).toBe(1);
    next = performSessionCommand(next, c, { type: 'rest' });
    expect(calculateCharacter(next, c).stats).toEqual(baseStats);
    expect(calculateCharacter(next, c).equipment?.status).toBe('Guardado');
    const inverse = equip(base, false);
    let reordered = performSessionCommand(inverse, c, { type: 'cast' });
    reordered = performSessionCommand(reordered, c, { type: 'activate', castId: 'session-2' });
    reordered = equip(reordered, true);
    expect(calculateCharacter(reordered, c).stats.defense).toBe(baseStats.defense! + 2);
  });
  it('nova escolha usa estado próprio sem herdar o controle de outro item', () => {
    const stored = equip(character(), false), old = currentEvents(stored).equipment!;
    const next = chooseSlot({ ...stored, locks: stored.locks.filter(s => s !== 'equipment') }, c, 'equipment', { ...p, targetLevel: 0 }, { key: 'demo:equipment:boots', quantities: {} });
    const view = calculateCharacter(next, c);
    expect(view.equipment).toMatchObject({ itemId: 'demo:equipment:boots', equipped: true });
    expect(view.stats.defense).toBe(calculateCharacter(stored, c).stats.defense);
    expect(view.stats.speed).toBe(calculateCharacter(stored, c).stats.speed! + 1);
    expect(next.session).toEqual(stored.session); expect(next.events).toContainEqual(old);
    expect(() => performEquipmentCommand(next, c, { type: 'equipment', equipmentEventId: old.id, equipped: true })).toThrow('escolha atual');
  });
  it('fonte ausente suspende bônus e impede equipar, mas permite guardar', () => {
    const current = character();
    const missing = setEnabled(c, c.packs.find(p => p.packId === zero.packId)!, false);
    expect(calculateCharacter(current, missing).equipment?.status).toBe('Suspenso');
    const stored = performEquipmentCommand(current, missing, { type: 'equipment', equipmentEventId: currentEvents(current).equipment!.id, equipped: false });
    expect(calculateCharacter(stored, missing).equipment?.status).toBe('Guardado');
    expect(() => performEquipmentCommand(stored, missing, { type: 'equipment', equipmentEventId: currentEvents(stored).equipment!.id, equipped: true })).toThrow('revisão');
    expect(stored.events).toEqual(current.events);
  });
  it('rejeita comando sem item e JSON com item/referência/tipo incompatível', () => {
    expect(() => performEquipmentCommand(newCharacter(), c, { type: 'equipment', equipmentEventId: 'event-1', equipped: true })).toThrow('escolha atual');
    const stored = equip(character(), false);
    const wrongItem = structuredClone(stored);
    if (wrongItem.session.actions[0].type === 'equipment') wrongItem.session.actions[0].itemId = 'demo:equipment:boots';
    expect(() => parseCharacter(wrongItem)).toThrow('escolha original');
    const future = structuredClone(stored); future.session.actions[0].afterEventSeq = 999;
    expect(() => parseCharacter(future)).toThrow('futura');
    const malformed = JSON.parse(exportCharacter(stored)); malformed.session.actions[0].equipped = 'yes';
    expect(() => parseCharacter(malformed)).toThrow();
  });
  it('arquivos antigos, JSON e snapshot offline preservam estados e defaults sem rolls novos', () => {
    const current = character(), { session: _, ...old } = JSON.parse(exportCharacter(current));
    expect(calculateCharacter(importCharacter(JSON.stringify(old)), c).equipment?.equipped).toBe(true);
    const stored = equip(current, false), exported = exportCharacter(stored);
    expect(exportCharacter(importCharacter(exported))).toBe(exported);
    const payload = parseStandalonePayload(JSON.parse(JSON.stringify(createStandalonePayload(stored, c))));
    expect(payload.runtimeVersion).toBe('demo-offline-v2');
    expect(calculateCharacter(payload.character, payload.catalog).equipment?.equipped).toBe(false);
    expect(payload.character.events).toEqual(current.events);
  });
  it('IndexedDB conserva equipamento guardado ao reabrir', async () => {
    const previous = await loadCharacter(), stored = equip(character(), false);
    await saveCharacter(stored, previous);
    expect(exportCharacter(await loadCharacter())).toBe(exportCharacter(stored));
    expect(calculateCharacter(await loadCharacter(), c).equipment?.status).toBe('Guardado');
  });
});
