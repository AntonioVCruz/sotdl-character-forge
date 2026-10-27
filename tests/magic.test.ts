import { describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import tables from '../examples/demo-random-tables.json';
import zero from '../examples/demo-level-zero.json';
import one from '../examples/demo-level-one.json';
import magic from '../examples/demo-magic.json';
import { emptySnapshot, importPack, setEnabled } from '../packages/catalog';
import { activeSlotIds, calculateCharacter, chooseSlot, commitDraft, currentEvents, exportCharacter, importCharacter, newCharacter, parseCharacter, planSlots, preview, slotIssues, type Character, type Policy, type SlotId } from '../packages/character-generator';
import { loadCharacter, saveCharacter } from '../packages/character-generator/storage';

function catalog() {
  let c = emptySnapshot();
  for (const pack of [tables, zero, one, magic]) c = importPack(c, pack).snapshot;
  for (const pack of c.packs) c = setEnabled(c, pack, true);
  return c;
}
const c = catalog();
const p: Policy = { seed: 'magic-fixture', allowUniform: true, mode: 'all-random', perSlotModes: {}, targetLevel: 1 };
const manual = (character: Character, slot: SlotId, key: string) => chooseSlot(character, c, slot, p, { key, quantities: {} });
function apprentice() {
  const base = preview(newCharacter(), c, { ...p, targetLevel: 0 }).character;
  let next = preview(base, c, { ...p, mode: 'manual' }).character;
  next = manual(next, 'novicePath', 'demo:path:spark');
  return manual(next, 'pathTraining', 'demo:training:focus');
}
function learned() {
  let character = manual(apprentice(), 'tradition', 'demo:tradition:ember');
  return manual(character, 'spell', 'demo:spell:lantern');
}
const unlock = (character: Character, slot: SlotId) => ({ ...character, locks: character.locks.filter(s => s !== slot) });

describe('tradições e aprendizado fictício', () => {
  it('geração integral detecta os slots mágicos depois de sortear o caminho', () => {
    const paths = new Set<string>();
    for (let i = 0; i < 24; i++) {
      const base = newCharacter(), draft = preview(base, c, { ...p, seed: `full-magic-${i}` });
      expect(draft.fullyResolved).toBe(true);
      const character = commitDraft(draft, base, c);
      const path = currentEvents(character).novicePath!.resolution.key;
      paths.add(path);
      expect(character.events).toHaveLength(path === 'demo:path:spark' ? 8 : 6);
      expect(!!calculateCharacter(character, c).spell).toBe(path === 'demo:path:spark');
    }
    expect(paths.size).toBe(2);
  });
  it('oferece duas tradições e somente as duas magias de rank 0 da tradição atual', () => {
    let character = apprentice();
    expect(planSlots(character, c).find(s => s.id === 'tradition')!.options.map(o => o.key)).toEqual(['demo:tradition:echo','demo:tradition:ember']);
    expect(() => manual(character, 'spell', 'demo:spell:lantern')).toThrow('tradição');
    character = manual(character, 'tradition', 'demo:tradition:ember');
    expect(planSlots(character, c).find(s => s.id === 'spell')!.options.map(o => o.key)).toEqual(['demo:spell:lantern','demo:spell:warmth']);
    expect(() => manual(character, 'spell', 'demo:spell:chime')).toThrow('elegível');
    character = manual(character, 'spell', 'demo:spell:lantern');
    expect(calculateCharacter(character, c).fullyResolved).toBe(true);
    expect(calculateCharacter(character, c).spell).toMatchObject({ rank: 0, needsReview: false, name: 'Lanterna de Brasa (fictícia)' });
  });
  it('aprendizado não conjura nem adiciona efeitos aos atributos', () => {
    const before = apprentice(), after = learned();
    expect(calculateCharacter(after, c).stats).toEqual(calculateCharacter(before, c).stats);
    expect(calculateCharacter(after, c).resources).toEqual(calculateCharacter(before, c).resources);
    expect(currentEvents(after).spell!.resolution.rolls).toEqual([]);
    expect(currentEvents(after).spell!.dependencies).toEqual({ novicePath: 'demo:path:spark', tradition: 'demo:tradition:ember' });
    expect(currentEvents(after).spell!.seq).toBeGreaterThan(currentEvents(after).tradition!.seq);
  });
  it('gera tradição e magia na ordem, reproduz seed e respeita o fallback autorizado', () => {
    const base = apprentice();
    const a = preview(base, c, { ...p, mode: 'hybrid', perSlotModes: { ancestry: 'manual', background: 'manual', equipment: 'manual', interestingThing: 'manual' } });
    const b = preview(base, c, { ...p, mode: 'hybrid', perSlotModes: { ancestry: 'manual', background: 'manual', equipment: 'manual', interestingThing: 'manual' } });
    expect(a).toEqual(b); expect(a.fullyResolved).toBe(true);
    expect(a.character.events.slice(-2).map(e => e.slotId)).toEqual(['tradition', 'spell']);
    expect(a.character.events.slice(-2).every(e => e.strategy === 'uniform-eligible')).toBe(true);
    expect(() => chooseSlot(base, c, 'tradition', { ...p, allowUniform: false })).toThrow('Autorize');
    expect(base.events).toHaveLength(6);
  });
  it('troca tradição mantendo magia travada no histórico e suspende aprendizado incompatível', () => {
    let character = learned(), old = currentEvents(character).spell;
    character = manual(unlock(character, 'tradition'), 'tradition', 'demo:tradition:echo');
    expect(currentEvents(character).spell).toEqual(old);
    expect(character.locks).toContain('spell');
    expect(calculateCharacter(character, c).spell?.needsReview).toBe(true);
    expect(slotIssues(character, c).some(i => i.slotId === 'spell')).toBe(true);
    expect(() => manual(character, 'spell', 'demo:spell:chime')).toThrow('Destrave');
    character = manual(unlock(character, 'spell'), 'spell', 'demo:spell:chime');
    expect(calculateCharacter(character, c).fullyResolved).toBe(true);
    expect(currentEvents(character).spell!.replacesEventId).toBe(old!.id);
    expect(parseCharacter(character).events).toHaveLength(10);
  });
  it('rerrola só magia sem alterar tradição, origem, caminho ou resultados anteriores', () => {
    const character = unlock(learned(), 'spell');
    const draft = preview(character, c, p, { slotId: 'spell' });
    expect(draft.character.events.slice(0, character.events.length)).toEqual(character.events);
    expect(currentEvents(draft.character).tradition).toEqual(currentEvents(character).tradition);
    expect(currentEvents(draft.character).spell!.rerollIndex).toBe(1);
    expect(character.events).toHaveLength(8); // Cancelar não modifica esta ficha.
  });
  it('caminho marcial oculta magia sem perder decisões, voltar ao mágico exige treino válido', () => {
    const original = learned();
    let character = manual(unlock(original, 'novicePath'), 'novicePath', 'demo:path:guardian');
    expect(activeSlotIds(character)).not.toContain('tradition');
    expect(activeSlotIds(character)).not.toContain('spell');
    expect(calculateCharacter(character, c).spell).toBeUndefined();
    expect(character.events.slice(0,8)).toEqual(original.events);
    character = manual(unlock(character, 'pathTraining'), 'pathTraining', 'demo:training:guard');
    expect(calculateCharacter(character, c).fullyResolved).toBe(true);
    character = manual(unlock(character, 'novicePath'), 'novicePath', 'demo:path:spark');
    expect(calculateCharacter(character, c).spell?.needsReview).toBe(true);
    character = manual(unlock(character, 'pathTraining'), 'pathTraining', 'demo:training:focus');
    expect(calculateCharacter(character, c).fullyResolved).toBe(true);
    expect(currentEvents(character).spell).toEqual(currentEvents(original).spell);
  });
  it('fonte mágica desabilitada ou ausente não elimina slots nem mascara conclusão', () => {
    const character = learned();
    const disabled = setEnabled(c, c.packs.find(p => p.packId === magic.packId)!, false);
    expect(planSlots(character, disabled).find(s => s.id === 'tradition')!.options).toEqual([]);
    expect(calculateCharacter(character, disabled).fullyResolved).toBe(false);
    expect(calculateCharacter(character, disabled).spell?.needsReview).toBe(true);
    expect(character.events).toHaveLength(8);
  });
  it('rank incorreto e path incompatível nunca são candidatos', () => {
    const modified = structuredClone(c);
    const pack = modified.packs.find(p => p.packId === magic.packId)!;
    pack.entities.find(e => e.id === 'demo:spell:lantern')!.rank = 1;
    pack.entities.find(e => e.id === 'demo:spell:warmth')!.requiresPath = 'demo:path:guardian';
    const character = manual(apprentice(), 'tradition', 'demo:tradition:ember');
    expect(planSlots(character, modified).find(s => s.id === 'spell')!.options).toEqual([]);
    expect(() => chooseSlot(character, modified, 'spell', p)).toThrow('elegível');
  });
  it('v2 antigo permanece legível e exibe as novas pendências; JSON novo preserva aprendizado', () => {
    const old = apprentice();
    expect(importCharacter(exportCharacter(old)).events).toEqual(old.events);
    expect(calculateCharacter(old, c).fullyResolved).toBe(false);
    const character = learned(), text = exportCharacter(character);
    expect(exportCharacter(importCharacter(text))).toBe(text);
    expect(calculateCharacter(importCharacter(text), c)).toEqual(calculateCharacter(character, c));
    const bad = JSON.parse(text); bad.events[7].dependencies.tradition = 'unknown';
    expect(() => parseCharacter(bad)).toThrow('Dependências');
  });
  it('nível 0 suspende aprendizado e retorno/IndexedDB não refazem sorteios', async () => {
    const original = learned();
    const down = commitDraft(preview(original, c, { ...p, targetLevel: 0 }), original, c);
    expect(calculateCharacter(down, c).spell).toBeUndefined();
    const up = commitDraft(preview(down, c, p), down, c);
    expect(up.events).toEqual(original.events);
    expect(calculateCharacter(up, c)).toEqual(calculateCharacter(original, c));
    const previous = await loadCharacter();
    await saveCharacter(up, previous);
    expect(exportCharacter(await loadCharacter())).toBe(exportCharacter(up));
  });
});
