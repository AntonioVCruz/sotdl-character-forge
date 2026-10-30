import { beforeEach, describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import tables from '../examples/demo-random-tables.json';
import levelZero from '../examples/demo-level-zero.json';
import { emptySnapshot, importPack, setEnabled, type Snapshot } from '../packages/catalog';
import { createSubstream, rollDice, resolveTable, tableOptions, uniformInt } from '../packages/random-tables';
import { calculateCharacter, chooseSlot, commitDraft, currentEvents, exportCharacter, importCharacter, newCharacter, parseCharacter, planSlots, preview, slotIssues, type Policy } from '../packages/character-generator';
import { clearCharacter, loadCharacter, saveCharacter } from '../packages/character-generator/storage';

function catalog() {
  let c = importPack(emptySnapshot(), tables).snapshot;
  c = importPack(c, levelZero).snapshot;
  for (const p of c.packs) c = setEnabled(c, p, true);
  return c;
}
const policy: Policy = { seed: 'regression-seed', allowUniform: true, mode: 'all-random', perSlotModes: {}, targetLevel: 0 };
const backgroundId = tables.entities[0].id, thingId = tables.entities[1].id;
const backgroundContext = { slotKind: 'background', ancestryId: 'demo:ancestry:test' };
const thingContext = { slotKind: 'interestingThing' };

describe('motor de rolagens', () => {
  it('enumera as 216 combinações de 3d6 e preserva os pesos dos ranges', () => {
    const totals: Record<number, number> = {}, outcomes: Record<string, number> = {};
    const c = catalog();
    for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) for (let d = 0; d < 6; d++) {
      const faces = [a,b,d]; let i = 0;
      const result = resolveTable(c, backgroundId, { rng: { int: () => faces[i++], uint32: () => 0 } }, backgroundContext);
      const roll = result.rolls[0];
      expect(roll.faces).toEqual([a+1,b+1,d+1]);
      totals[roll.total] = (totals[roll.total] ?? 0) + 1;
      outcomes[roll.outcomeId!] = (outcomes[roll.outcomeId!] ?? 0) + 1;
    }
    expect(totals[3]).toBe(1); expect(totals[18]).toBe(1); expect(totals[10]).toBe(27); expect(totals[11]).toBe(27);
    expect(outcomes).toEqual({ 'bg-a': 56, 'bg-b': 104, 'bg-c': 56 });
  });
  it('rejeita inteiros excedentes para impedir viés modular', () => {
    const values = [0xffffffff, 0xfffffffe, 11];
    expect(uniformInt(() => values.shift()!, 6)).toBe(5);
    expect(values).toHaveLength(0);
    expect(() => uniformInt(() => 0, 0)).toThrow();
    expect(() => uniformInt(() => -1, 6)).toThrow();
  });
  it('reproduz substreams e não acopla slots independentes', () => {
    const a = createSubstream('seed', 'a', 0), b = createSubstream('seed', 'a', 0);
    expect(Array.from({ length: 100 }, () => a.uint32())).toEqual(Array.from({ length: 100 }, () => b.uint32()));
    expect(createSubstream('seed', 'a', 1).uint32()).not.toBe(createSubstream('seed', 'a', 0).uint32());
    const before = createSubstream('seed', 'b', 0).uint32();
    createSubstream('seed', 'a', 15).uint32();
    expect(createSubstream('seed', 'b', 0).uint32()).toBe(before);
    const result = rollDice({ count: 2, sides: 6, modifier: -2 }, createSubstream('seed', 'dice', 0));
    expect(result.total).toBe(result.faces.reduce((x,y) => x+y, -2));
  });
  it('resolve d6→d20 e quantidade adicional com vínculos e fontes', () => {
    const result = resolveTable(catalog(), thingId, { rng: { uint32: () => 0, int: n => n-1 } }, thingContext);
    expect(result.rolls.map(r => r.faces)).toEqual([[6], [20], [6]]);
    expect(result.rolls[1].parentRollId).toBe(result.rolls[0].id);
    expect(result.rolls[2].parentRollId).toBe(result.rolls[1].id);
    expect(result.effects).toEqual([{ type: 'resource-add', target: 'demo-token', value: 6 }]);
    expect(result.rolls.every(r => r.source.version === '0.0.1')).toBe(true);
  });
  it('manual resolve a mesma cadeia sem fabricar dados e exige quantidades explícitas', () => {
    const c = catalog(), option = tableOptions(c, thingId, thingContext).find(o => o.quantities.length)!;
    const missing = resolveTable(c, thingId, { path: option.path, quantities: {} }, thingContext);
    expect(missing.unresolved[0]).toContain('quantidade');
    const result = resolveTable(c, thingId, { path: option.path, quantities: { [option.quantities[0].key]: 4 } }, thingContext);
    expect(result.rolls).toEqual([]); expect(result.effects[0].value).toBe(4);
    expect(result.unresolved).toEqual([]);
  });
  it('bloqueia fontes desabilitadas, contexto incorreto, tabelas incompletas e ciclos', () => {
    const c = catalog();
    const command = { rng: createSubstream('a', 'b', 0) };
    expect(() => resolveTable(setEnabled(c, c.packs[0], false), thingId, command, thingContext)).toThrow('indisponível');
    expect(() => resolveTable(c, backgroundId, command, { ...backgroundContext, ancestryId: 'other' })).toThrow('contexto');
    const incomplete = structuredClone(c); incomplete.packs[0].entities[0].status = 'incomplete';
    expect(() => resolveTable(incomplete, backgroundId, command, backgroundContext)).toThrow('revisão');
    const cycle = structuredClone(c);
    const table = cycle.packs[0].entities[1];
    if (table.kind !== 'randomTable') throw new Error('fixture');
    table.outcomes[0].nextTableRef = table.id;
    expect(() => resolveTable(cycle, thingId, command, thingContext)).toThrow('Ciclo');
  });
  it('mantém resultado com pendência quando efeito ou condição não é suportado', () => {
    const c = catalog(), table = c.packs[0].entities[0];
    if (table.kind !== 'randomTable') throw new Error('fixture');
    table.outcomes[0].mechanicalEvents = [{ type: 'unknown-effect', value: 99 }];
    const result = resolveTable(c, table.id, { path: ['bg-a'], quantities: {} }, backgroundContext);
    expect(result.key).toBe('["bg-a"]'); expect(result.effects).toEqual([]); expect(result.unresolved[0]).toContain('handler');
    table.conditions = [];
    expect(() => tableOptions(c, table.id, backgroundContext)).toThrow('Condições');
  });
});

describe('personagem nível 0', () => {
  let c: Snapshot;
  beforeEach(() => { c = catalog(); });
  it('gera integralmente de modo reproduzível e confirma sem alterar o original', () => {
    const current = newCharacter(), original = structuredClone(current);
    const a = preview(current, c, policy), b = preview(current, c, policy);
    expect(a).toEqual(b); expect(a.fullyResolved).toBe(true); expect(current).toEqual(original);
    expect(a.character.events).toHaveLength(4);
    const committed = commitDraft(a, current, c);
    expect(committed.revision).toBe(1);
    expect(calculateCharacter(committed, c).fullyResolved).toBe(true);
    expect(committed.events.filter(e => e.tableId).every(e => e.strategy === 'demo-table')).toBe(true);
  });
  it('cancela descartando draft; recálculo e exportação não consomem sorteios', () => {
    const current = newCharacter(); preview(current, c, policy);
    expect(current.events).toHaveLength(0);
    const character = commitDraft(preview(current, c, policy), current, c);
    const original = exportCharacter(character);
    for (let n = 0; n < 30; n++) calculateCharacter(character, c);
    expect(exportCharacter(character)).toBe(original);
  });
  it('preserva escolha manual travada no híbrido e rerrola somente slot escolhido', () => {
    const manual = chooseSlot(newCharacter(), c, 'ancestry', policy, { key: 'demo:ancestry:test', quantities: {} });
    expect(manual.locks).toContain('ancestry');
    const draft = preview(manual, c, { ...policy, mode: 'hybrid' });
    const before = currentEvents(draft.character);
    expect(before.ancestry).toEqual(currentEvents(manual).ancestry);
    const after = preview(draft.character, c, policy, { slotId: 'background' }).character;
    expect(currentEvents(after).equipment).toEqual(before.equipment);
    expect(currentEvents(after).interestingThing).toEqual(before.interestingThing);
    expect(currentEvents(after).background!.rerollIndex).toBe(before.background!.rerollIndex + 1);
    expect(after.events).toHaveLength(draft.character.events.length + 1);
    expect(() => chooseSlot(after, c, 'ancestry', policy)).toThrow('Destrave');
  });
  it('sinaliza background dependente ao mudar ancestralidade sem apagar decisões', () => {
    let character = chooseSlot(newCharacter(), c, 'ancestry', policy, { key: 'demo:ancestry:test', quantities: {} });
    character = preview(character, c, policy).character;
    const oldBackground = currentEvents(character).background;
    character = { ...character, locks: [] };
    character = chooseSlot(character, c, 'ancestry', policy, { key: 'demo:ancestry:coast', quantities: {} });
    expect(currentEvents(character).background).toEqual(oldBackground);
    expect(slotIssues(character, c).some(i => i.slotId === 'background')).toBe(true);
    expect(calculateCharacter(character, c).fullyResolved).toBe(false);
    character = chooseSlot(character, c, 'background', policy);
    expect(calculateCharacter(character, c).fullyResolved).toBe(true);
  });
  it('sem fallback autorizado ou candidatos mantém pendências; níveis posteriores são rejeitados', () => {
    expect(preview(newCharacter(), c, { ...policy, allowUniform: false }).fullyResolved).toBe(false);
    expect(preview(newCharacter(), emptySnapshot(), policy).unresolved.length).toBeGreaterThan(0);
    expect(() => preview(newCharacter(), c, { ...policy, targetLevel: 2 })).toThrow('nível 0');
    const draft = preview(newCharacter(), c, { ...policy, mode: 'hybrid', perSlotModes: { ancestry: 'manual' } });
    expect(draft.character.events.some(e => e.slotId === 'ancestry')).toBe(false);
    expect(draft.fullyResolved).toBe(false);
  });
  it('recusa confirmar preview obsoleto por alteração de ficha ou catálogo', () => {
    const current = newCharacter(), draft = preview(current, c, policy);
    expect(() => commitDraft(draft, { ...current, name: 'edited' }, c)).toThrow('mudou');
    expect(() => commitDraft(draft, current, setEnabled(c, c.packs[0], false))).toThrow('mudou');
  });
  it('deriva ficha de fontes e efeitos fictícios sem acumular incrementos', () => {
    let character = chooseSlot(newCharacter(), c, 'ancestry', policy, { key: 'demo:ancestry:test', quantities: {} });
    character = chooseSlot(character, c, 'equipment', policy, { key: 'demo:equipment:coat', quantities: {} });
    expect(calculateCharacter(character, c).stats.defense).toBe(11);
    expect(calculateCharacter(character, c).stats.defense).toBe(11);
    expect(calculateCharacter(character, c).breakdown.filter(b => b.target === 'defense')).toHaveLength(2);
    const withoutSource = setEnabled(c, c.packs[1], false);
    expect(calculateCharacter(character, withoutSource).stats).toEqual({});
    expect(character.events).toHaveLength(2);
  });
  it('JSON preserva escolhas, fontes, dados e locks; importação não precisa das fontes', () => {
    const current = newCharacter(), character = commitDraft(preview(current, c, policy), current, c);
    const json = exportCharacter(character), imported = importCharacter(json);
    expect(exportCharacter(imported)).toBe(json);
    expect(calculateCharacter(imported, c)).toEqual(calculateCharacter(character, c));
    expect(calculateCharacter(imported, emptySnapshot()).fullyResolved).toBe(false);
    expect(exportCharacter(imported)).toBe(json);
    const bad = JSON.parse(json); bad.events.find((e: { resolution: { rolls: unknown[] } }) => e.resolution.rolls.length).resolution.rolls[0].total = 999;
    expect(() => parseCharacter(bad)).toThrow('total');
    expect(() => importCharacter('{"schemaVersion":99}')).toThrow();
  });
  it('não aplica bônus ou atributos alterados no JSON como se viessem da fonte', () => {
    const character = preview(newCharacter(), c, policy).character;
    const changed = importCharacter(exportCharacter(character));
    const ancestry = currentEvents(changed).ancestry!;
    ancestry.baseStats!.health = 999;
    expect(calculateCharacter(changed, c).stats.health).toBeUndefined();
    expect(slotIssues(changed, c).some(i => i.reason.includes('Atributos gravados'))).toBe(true);
    const alteredEffect = importCharacter(exportCharacter(character));
    currentEvents(alteredEffect).equipment!.resolution.effects[0].value = 999;
    expect(slotIssues(alteredEffect, c).some(i => i.reason.includes('Consequências'))).toBe(true);
    const tamperedRoll = importCharacter(exportCharacter(character));
    currentEvents(tamperedRoll).background!.resolution.rolls[0].outcomeId = 'invented';
    expect(slotIssues(tamperedRoll, c).some(i => i.reason.includes('Caminho'))).toBe(true);
  });
  it('IndexedDB preserva rolagens e impede sobrescrita por aba obsoleta', async () => {
    const previous = await loadCharacter();
    const next = commitDraft(preview(previous, c, policy), previous, c);
    await saveCharacter(next, previous);
    expect(exportCharacter(await loadCharacter())).toBe(exportCharacter(next));
    await expect(saveCharacter({ ...next, name: 'other' }, previous)).rejects.toThrow('outra aba');
    expect(exportCharacter(await loadCharacter())).toBe(exportCharacter(next));
    await clearCharacter();
    expect(exportCharacter(await loadCharacter())).toBe(exportCharacter(newCharacter()));
  });
});
