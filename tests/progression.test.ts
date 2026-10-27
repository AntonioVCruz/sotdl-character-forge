import { describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import tables from '../examples/demo-random-tables.json';
import zero from '../examples/demo-level-zero.json';
import one from '../examples/demo-level-one.json';
import { emptySnapshot, importPack, setEnabled } from '../packages/catalog';
import { calculateCharacter, chooseSlot, commitDraft, currentEvents, exportCharacter, importCharacter, newCharacter, parseCharacter, planSlots, preview, slotIssues, type Character, type Policy } from '../packages/character-generator';
import { loadCharacter, saveCharacter } from '../packages/character-generator/storage';

function catalog() {
  let s = emptySnapshot();
  for (const pack of [tables, zero, one]) s = importPack(s, pack).snapshot;
  for (const pack of s.packs) s = setEnabled(s, pack, true);
  return s;
}
const c = catalog();
const p0: Policy = { seed: 'progression-v1', allowUniform: true, mode: 'all-random', perSlotModes: {}, targetLevel: 0 };
const p1: Policy = { ...p0, targetLevel: 1 };
const completeZero = () => commitDraft(preview(newCharacter(), c, p0), newCharacter(), c);
const advanceManual = (character: Character) => commitDraft(preview(character, c, { ...p1, mode: 'manual' }), character, c);
const manual = (character: Character, slot: 'novicePath' | 'pathTraining', key: string) => chooseSlot(character, c, slot, p1, { key, quantities: {} });

describe('progressão demonstrativa 0 → 1', () => {
  it('gera caminho e treinamento sequencialmente preservando as quatro decisões anteriores', () => {
    const original = completeZero();
    const a = preview(original, c, p1), b = preview(original, c, p1);
    expect(a).toEqual(b); expect(a.fullyResolved).toBe(true);
    expect(a.character.events.slice(0, 4)).toEqual(original.events);
    expect(a.character.events.slice(4).map(e => [e.slotId, e.level])).toEqual([['novicePath', 1], ['pathTraining', 1]]);
    expect(a.character.levelChanges).toEqual([{ seq: 1, from: 0, to: 1, afterEventSeq: 4 }]);
    const committed = commitDraft(a, original, c);
    expect(calculateCharacter(committed, c).fullyResolved).toBe(true);
    expect(original.level).toBe(0); expect(original.events).toHaveLength(4);
  });
  it('aplica exatamente os ganhos marciais, sem acumular a cada recálculo', () => {
    const original = completeZero(), base = calculateCharacter(original, c);
    let character = advanceManual(original);
    character = manual(character, 'novicePath', 'demo:path:guardian');
    character = manual(character, 'pathTraining', 'demo:training:guard');
    expect(parseCharacter(character)).toEqual(character);
    const view = calculateCharacter(character, c);
    expect(view.stats.health).toBe(base.stats.health! + 4);
    expect(view.stats.defense).toBe(base.stats.defense! + 1);
    expect(view.fullyResolved).toBe(true);
    for (let i=0; i<10; i++) expect(calculateCharacter(character, c)).toEqual(view);
  });
  it('oferece somente treinamentos do caminho e aplica ganhos mágicos fictícios', () => {
    const original = completeZero(), base = calculateCharacter(original, c);
    let character = manual(advanceManual(original), 'novicePath', 'demo:path:spark');
    const options = planSlots(character, c).find(s => s.id === 'pathTraining')!.options.map(o => o.key);
    expect(options).toEqual(['demo:training:focus', 'demo:training:insight']);
    expect(() => manual(character, 'pathTraining', 'demo:training:guard')).toThrow('elegível');
    character = manual(character, 'pathTraining', 'demo:training:insight');
    const view = calculateCharacter(character, c);
    expect(view.stats.health).toBe(base.stats.health! + 2);
    expect(view.stats.intellect).toBe(base.stats.intellect! + 1);
    expect(view.resources['demo-arcane-reserve']).toBe(2);
  });
  it('rejeita caminho no nível 0 e exige base resolvida e consentimento para sortear', () => {
    expect(() => chooseSlot(newCharacter(), c, 'novicePath', p0)).toThrow('indisponível');
    const emptyOne = preview(newCharacter(), c, { ...p1, mode: 'manual' }).character;
    expect(() => manual(emptyOne, 'novicePath', 'demo:path:guardian')).toThrow('nível 0');
    expect(() => manual(advanceManual(completeZero()), 'pathTraining', 'demo:training:guard')).toThrow('caminho');
    expect(preview(completeZero(), c, { ...p1, allowUniform: false }).fullyResolved).toBe(false);
    expect(() => preview(completeZero(), c, { ...p1, targetLevel: 2 })).toThrow('nível 1');
  });
  it('alterar caminho preserva treinamento travado com pendência até revisão', () => {
    const original = completeZero(), base = calculateCharacter(original, c);
    let character = manual(advanceManual(original), 'novicePath', 'demo:path:guardian');
    character = manual(character, 'pathTraining', 'demo:training:guard');
    const oldTraining = currentEvents(character).pathTraining;
    character = { ...character, locks: character.locks.filter(s => s !== 'novicePath') };
    character = manual(character, 'novicePath', 'demo:path:spark');
    expect(currentEvents(character).pathTraining).toEqual(oldTraining);
    expect(character.locks).toContain('pathTraining');
    expect(slotIssues(character, c).some(i => i.slotId === 'pathTraining')).toBe(true);
    expect(calculateCharacter(character, c).stats.defense).toBe(base.stats.defense);
    expect(() => chooseSlot(character, c, 'pathTraining', p1)).toThrow('Destrave');
    character = { ...character, locks: character.locks.filter(s => s !== 'pathTraining') };
    character = manual(character, 'pathTraining', 'demo:training:focus');
    expect(slotIssues(character, c).every(i => i.slotId === 'tradition' || i.slotId === 'spell')).toBe(true);
    expect(calculateCharacter(character, c).fullyResolved).toBe(false); // Magical learning is now required.
    expect(parseCharacter(character).events).toHaveLength(8);
  });
  it('mudança de ancestralidade invalida caminho e treinamento transitivamente', () => {
    let character = preview(completeZero(), c, p1).character;
    const other = currentEvents(character).ancestry!.resolution.key === 'demo:ancestry:test' ? 'demo:ancestry:coast' : 'demo:ancestry:test';
    character = chooseSlot(character, c, 'ancestry', p1, { key: other, quantities: {} });
    const affected = slotIssues(character, c).map(i => i.slotId);
    expect(affected).toContain('background'); expect(affected).toContain('novicePath'); expect(affected).toContain('pathTraining');
    expect(character.events).toHaveLength(7);
    expect(parseCharacter(character).level).toBe(1);
  });
  it('reverte a 0 e retorna a 1 sem apagar história, reexecutar RNG ou duplicar benefícios', () => {
    const base = completeZero(), original = commitDraft(preview(base, c, p1), base, c);
    const downDraft = preview(original, c, p0);
    expect(original.level).toBe(1); // cancelar é descartar esta prévia
    const down = commitDraft(downDraft, original, c);
    expect(down.events).toEqual(original.events);
    expect(currentEvents(down).novicePath).toBeUndefined();
    expect(calculateCharacter(down, c).stats).toEqual(calculateCharacter(base, c).stats);
    const up = commitDraft(preview(down, c, p1), down, c);
    expect(up.events).toEqual(original.events);
    expect(calculateCharacter(up, c)).toEqual(calculateCharacter(original, c));
    expect(up.levelChanges).toHaveLength(3);
    expect(importCharacter(exportCharacter(up))).toEqual(up);
  });
  it('restaura escolha anterior como nova decisão, preservando substituições', () => {
    let character = manual(advanceManual(completeZero()), 'novicePath', 'demo:path:guardian');
    const original = currentEvents(character).novicePath!;
    character = manual({ ...character, locks: [] }, 'novicePath', 'demo:path:spark');
    character = manual({ ...character, locks: [] }, 'novicePath', original.resolution.key);
    expect(character.events.slice(-3).map(e => e.resolution.key)).toEqual(['demo:path:guardian', 'demo:path:spark', 'demo:path:guardian']);
    expect(parseCharacter(character).events.at(-1)?.replacesEventId).toBe('event-6');
  });
  it('fonte desabilitada preserva nível/histórico e suspende os benefícios de progressão', () => {
    const base = completeZero(), character = preview(base, c, p1).character;
    const disabled = setEnabled(c, c.packs.find(p => p.packId === one.packId)!, false);
    expect(calculateCharacter(character, disabled).stats).toEqual(calculateCharacter(base, c).stats);
    expect(calculateCharacter(character, disabled).fullyResolved).toBe(false);
    expect(exportCharacter(importCharacter(exportCharacter(character)))).toBe(exportCharacter(character));
  });
  it('migra v1 sem mudar escolhas/rolls e rejeita história de nível inconsistente', () => {
    const original = completeZero();
    const { levelChanges: _, ...old } = JSON.parse(exportCharacter(original));
    const migrated = importCharacter(JSON.stringify({ ...old, schemaVersion: 1 }));
    expect(migrated.schemaVersion).toBe(2); expect(migrated.events).toEqual(original.events);
    expect(migrated.levelChanges).toEqual([]);
    const advanced = preview(original, c, p1).character;
    expect(() => parseCharacter({ ...advanced, levelChanges: [] })).toThrow('histórico');
    expect(() => parseCharacter({ ...advanced, schemaVersion: 1 })).toThrow('v1');
    const wrongOrder = structuredClone(advanced); wrongOrder.levelChanges[0].afterEventSeq = 6;
    expect(() => parseCharacter(wrongOrder)).toThrow('nível ativo');
  });
  it('reabre no IndexedDB preservando histórico e escolhas de nível 1', async () => {
    const previous = await loadCharacter(), base = completeZero();
    const character = commitDraft(preview(base, c, p1), base, c);
    await saveCharacter(character, previous);
    expect(exportCharacter(await loadCharacter())).toBe(exportCharacter(character));
  });
});
