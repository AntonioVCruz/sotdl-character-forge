import { describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import tables from '../examples/demo-random-tables.json';
import zero from '../examples/demo-level-zero.json';
import one from '../examples/demo-level-one.json';
import magic from '../examples/demo-magic.json';
import sessionPack from '../examples/demo-spell-session.json';
import { emptySnapshot, importPack, setEnabled } from '../packages/catalog';
import { calculateCharacter, chooseSlot, commitDraft, exportCharacter, importCharacter, newCharacter, parseCharacter, performSessionCommand, preview, type Character, type Policy } from '../packages/character-generator';
import { loadCharacter, saveCharacter } from '../packages/character-generator/storage';

function catalog() {
  let c = emptySnapshot();
  for (const p of [tables, zero, one, magic, sessionPack]) c = importPack(c, p).snapshot;
  for (const p of c.packs) c = setEnabled(c, p, true);
  return c;
}
const c = catalog();
const p: Policy = { seed: 'session-regression', allowUniform: true, mode: 'all-random', perSlotModes: {}, targetLevel: 1 };
function learned() {
  let character = preview(newCharacter(), c, { ...p, targetLevel: 0 }).character;
  character = preview(character, c, { ...p, mode: 'manual' }).character;
  for (const [slot, key] of [['novicePath', 'demo:path:spark'], ['pathTraining', 'demo:training:focus'], ['tradition', 'demo:tradition:ember'], ['spell', 'demo:spell:lantern']] as const) {
    character = chooseSlot(character, c, slot, p, { key, quantities: {} });
  }
  return character;
}
const cast = (character: Character) => performSessionCommand(character, c, { type: 'cast' });
const active = (character: Character, castId = 'session-1') => performSessionCommand(character, c, { type: 'activate', castId });
const end = (character: Character, castId = 'session-1') => performSessionCommand(character, c, { type: 'end', castId });

describe('conjuração e efeitos de sessão fictícios', () => {
  it('as quatro definições fictícias afetam somente o atributo declarado', () => {
    for (const [tradition, spell, target] of [
      ['demo:tradition:ember', 'demo:spell:lantern', 'defense'],
      ['demo:tradition:ember', 'demo:spell:warmth', 'speed'],
      ['demo:tradition:echo', 'demo:spell:chime', 'will'],
      ['demo:tradition:echo', 'demo:spell:reflection', 'defense'],
    ] as const) {
      let character = learned();
      character = chooseSlot({ ...character, locks: character.locks.filter(s => s !== 'tradition') }, c, 'tradition', p, { key: tradition, quantities: {} });
      character = chooseSlot({ ...character, locks: character.locks.filter(s => s !== 'spell') }, c, 'spell', p, { key: spell, quantities: {} });
      const base = calculateCharacter(character, c).stats;
      const view = calculateCharacter(active(cast(character)), c);
      expect(view.stats).toEqual({ ...base, [target]: base[target]! + 1 });
    }
  });
  it('aprender não ativa; conjurar consome uso; ativar e encerrar recompõem valor e explicação', () => {
    const base = learned(), original = exportCharacter(base), stats = calculateCharacter(base, c).stats;
    expect(calculateCharacter(base, c).session.current?.remaining).toBe(2);
    let next = cast(base);
    expect(next.events).toEqual(base.events); expect(exportCharacter(base)).toBe(original);
    expect(calculateCharacter(next, c).stats).toEqual(stats);
    expect(calculateCharacter(next, c).session.current?.remaining).toBe(1);
    next = active(next);
    const view = calculateCharacter(next, c);
    expect(view.stats.defense).toBe(stats.defense! + 1);
    expect(view.breakdown.at(-1)).toMatchObject({ target: 'defense', value: 1 });
    expect(view.breakdown.at(-1)?.source).toContain('demo-session-source');
    expect(view.session.current?.remaining).toBe(1);
    expect(exportCharacter(active(next))).toBe(exportCharacter(next)); // Sem outra instância ou consumo.
    next = end(next);
    expect(calculateCharacter(next, c).stats).toEqual(stats);
    expect(calculateCharacter(next, c).session.current?.remaining).toBe(1);
  });
  it('100 ativações e encerramentos não acumulam bônus nem alteram atributos-base ou rolls', () => {
    const base = learned(), stats = calculateCharacter(base, c).stats;
    let character = cast(base);
    for (let i = 0; i < 100; i++) {
      character = active(character);
      expect(calculateCharacter(character, c).stats.defense).toBe(stats.defense! + 1);
      character = end(character);
      expect(calculateCharacter(character, c).stats).toEqual(stats);
    }
    expect(character.events).toEqual(base.events);
    expect(character.session.actions).toHaveLength(201);
    expect(calculateCharacter(character, c).session.current?.used).toBe(1);
  });
  it('limita conjurações, impede recast ativo e restaura usos no descanso sem apagar história', () => {
    let character = active(cast(learned()));
    expect(() => cast(character)).toThrow('Encerre');
    character = cast(end(character)); // session-4 é a segunda conjuração.
    expect(calculateCharacter(character, c).session.current?.remaining).toBe(0);
    expect(() => cast(character)).toThrow('Não há conjurações');
    character = active(character, 'session-4');
    expect(() => active(character)).toThrow('apenas um');
    character = performSessionCommand(character, c, { type: 'rest' });
    expect(calculateCharacter(character, c).session.current?.remaining).toBe(2);
    expect(calculateCharacter(character, c).session.effects.every(e => e.expired && !e.active)).toBe(true);
    expect(() => active(character)).toThrow('Descanso');
    const history = structuredClone(character.session.actions);
    character = cast(character);
    expect(character.session.actions.slice(0, history.length)).toEqual(history);
    expect(calculateCharacter(character, c).session.current?.used).toBe(1);
  });
  it('fonte desabilitada suspende efeito e não impede encerramento ou descanso', () => {
    const original = active(cast(learned())), baseline = calculateCharacter(learned(), c).stats;
    const missing = setEnabled(c, c.packs.find(p => p.packId === sessionPack.packId)!, false);
    const view = calculateCharacter(original, missing);
    expect(view.stats).toEqual(baseline); expect(view.session.effects[0].requestedActive).toBe(true);
    expect(view.session.effects[0].active).toBe(false); expect(view.session.warnings.length).toBe(1);
    expect(() => performSessionCommand(original, missing, { type: 'cast' })).toThrow('ausente');
    const ended = performSessionCommand(original, missing, { type: 'end', castId: 'session-1' });
    expect(ended.session.actions.at(-1)?.type).toBe('end');
    const rested = performSessionCommand(ended, emptySnapshot(), { type: 'rest' });
    expect(rested.session.actions.at(-1)?.type).toBe('rest');
    expect(rested.events).toEqual(original.events);
  });
  it('substituir o evento de aprendizado suspende instância sem restaurar usos', () => {
    let character = active(cast(learned()));
    character = chooseSlot({ ...character, locks: character.locks.filter(s => s !== 'spell') }, c, 'spell', p, { key: 'demo:spell:lantern', quantities: {} });
    const view = calculateCharacter(character, c);
    expect(view.session.effects[0].reason).toContain('alterado');
    expect(view.session.effects[0].active).toBe(false);
    expect(view.session.current?.remaining).toBe(1);
    character = end(character);
    expect(() => active(character)).toThrow('alterado');
    character = cast(character);
    expect(calculateCharacter(character, c).session.current?.remaining).toBe(0);
    expect(character.session.actions.at(-1)?.type).toBe('cast');
  });
  it('retorno ao nível 0 suspende efeito e preserva uso; retorno a 1 revalida a instância', () => {
    const original = active(cast(learned()));
    const down = commitDraft(preview(original, c, { ...p, targetLevel: 0 }), original, c);
    expect(calculateCharacter(down, c).session.effects[0].active).toBe(false);
    expect(down.session).toEqual(original.session);
    const up = commitDraft(preview(down, c, p), down, c);
    expect(calculateCharacter(up, c).stats).toEqual(calculateCharacter(original, c).stats);
    expect(calculateCharacter(up, c).session.current?.used).toBe(1);
  });
  it('recálculo, JSON e IndexedDB preservam consumo/efeito sem reexecutar comandos', async () => {
    const character = active(cast(learned())), text = exportCharacter(character);
    for (let i = 0; i < 10; i++) calculateCharacter(character, c);
    expect(exportCharacter(character)).toBe(text);
    const imported = importCharacter(text);
    expect(exportCharacter(imported)).toBe(text);
    expect(calculateCharacter(imported, c)).toEqual(calculateCharacter(character, c));
    const previous = await loadCharacter(); await saveCharacter(character, previous);
    expect(exportCharacter(await loadCharacter())).toBe(text);
  });
  it('arquivos v2 anteriores recebem sessão vazia sem mudar aprendizado', () => {
    const base = learned(), { session: _, ...old } = JSON.parse(exportCharacter(base));
    const imported = importCharacter(JSON.stringify(old));
    expect(imported.session).toEqual({ actions: [] }); expect(imported.events).toEqual(base.events);
  });
  it('rejeita referência futura, ordem inválida e tentativa de ativar conjuração inexistente', () => {
    const character = active(cast(learned()));
    const future = structuredClone(character); future.session.actions.forEach(a => { a.afterEventSeq = 999; });
    expect(() => parseCharacter(future)).toThrow('futura');
    const badId = structuredClone(character); badId.session.actions[1].id = 'session-90';
    expect(() => parseCharacter(badId)).toThrow('Sequência');
    const badLearned = structuredClone(character);
    if (badLearned.session.actions[0].type === 'cast') badLearned.session.actions[0].learnedEventId = 'event-1';
    expect(() => parseCharacter(badLearned)).toThrow('aprendizado');
    expect(() => performSessionCommand(character, c, { type: 'activate', castId: 'missing' })).toThrow('encontrada');
  });
  it('modificador e versão não vêm do JSON; fonte adulterada ou handler desconhecido suspende efeito', () => {
    const character = active(cast(learned())), changed = structuredClone(character);
    if (changed.session.actions[0].type === 'cast') changed.session.actions[0].definition.version = '9.9.9';
    expect(calculateCharacter(changed, c).session.effects[0].active).toBe(false);
    expect(calculateCharacter(changed, c).session.effects[0].reason).toContain('versão');
    const invalidCatalog = structuredClone(c);
    invalidCatalog.packs.find(p => p.packId === sessionPack.packId)!.entities[0].sessionDefinition = { spellId: 'demo:spell:lantern', usesPerRest: 2, effect: { execute: 'arbitrary script' } };
    expect(calculateCharacter(character, invalidCatalog).session.effects[0].active).toBe(false);
    expect(() => performSessionCommand(learned(), invalidCatalog, { type: 'cast' })).toThrow('manual');
  });
});
