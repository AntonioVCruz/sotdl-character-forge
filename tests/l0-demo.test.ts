import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  ADAPTER_FICTIONAL,
  L0_STEPS,
  confirmedStats,
  createL0State,
  reduceL0,
  requiredPendencias,
  summarizeStubs,
  sortBlockReason,
  viewSlot,
  type L0State,
} from '../apps/web/l0-demo';

const coreStub = {
  packId: 'sotdl-core-human-l0',
  version: '0.1.0',
  fictionalData: false,
  source: { id: 'sotdl:shadow-of-the-demon-lord-core', title: 'Shadow of the Demon Lord Core', status: 'needs-review' },
  entities: [{ id: 'sotdl:shadow-of-the-demon-lord-core:ancestry:human:default', kind: 'ancestry', name: 'Human', status: 'needs-review' }],
};
const onlyHumanStub = {
  packId: 'sotdl-only-human-l0',
  version: '0.1.0',
  fictionalData: false,
  source: { id: 'sotdl:only-human', title: 'Only Human', status: 'needs-review' },
  dependencies: [{ packId: 'sotdl-core-human-l0', version: '0.1.0' }],
  entities: [{ id: 'sotdl:only-human:ancestry:human:variant', kind: 'ancestry', name: 'Human', status: 'needs-review' }],
};

function choose(state: L0State, key: Parameters<typeof viewSlot>[1], id: string) {
  return reduceL0(reduceL0(state, { type: 'select', key, ids: [id] }), { type: 'confirm', key });
}

describe('adapter L0', () => {
  it('permite sorteio e rerrolagem explícitos em modo Manual sem alterar o resultado aprovado na prévia', () => {
    let state = choose(createL0State(), 'ancestry', 'anc-core');
    state = reduceL0(state, { type: 'seed', seed: 'manual-explicito' });
    state = reduceL0(state, { type: 'uniform', value: true });
    expect(state.mode).toBe('manual');
    expect(sortBlockReason(state, 'ancestry')).toBeUndefined();
    const rolled = reduceL0(state, { type: 'roll', key: 'ancestry' });
    expect(rolled.slots.ancestry.previewTrace?.rerollIndex).toBe(0);
    expect(rolled.slots.ancestry.previewStrategy).toBe('uniform-eligible-unofficial');
    expect(rolled.slots.ancestry.confirmedIds).toEqual(['anc-core']);
    const rerolled = reduceL0(rolled, { type: 'reroll', key: 'ancestry' });
    expect(rerolled.slots.ancestry.previewTrace?.rerollIndex).toBe(1);
    expect(rerolled.slots.ancestry.confirmedIds).toEqual(['anc-core']);
    expect(reduceL0(rerolled, { type: 'discard', key: 'ancestry' }).slots.ancestry).toEqual(state.slots.ancestry);
  });

  it('mantém no modo Manual os bloqueios de seed, autorização, trava, dados e dependências', () => {
    const empty = createL0State();
    expect(reduceL0(empty, { type: 'roll', key: 'ancestry' })).toBe(empty);
    const seeded = reduceL0(empty, { type: 'seed', seed: 'bloqueios' });
    expect(reduceL0(seeded, { type: 'roll', key: 'ancestry' })).toBe(seeded);
    const allowed = reduceL0(seeded, { type: 'uniform', value: true });
    for (const key of ['benefit', 'narrative'] as const) expect(reduceL0(allowed, { type: 'roll', key })).toBe(allowed);
    const locked = reduceL0(allowed, { type: 'lock', key: 'ancestry' });
    expect(reduceL0(locked, { type: 'roll', key: 'ancestry' })).toBe(locked);
    const suspended = { ...allowed, slots: { ...allowed.slots, ancestry: { ...allowed.slots.ancestry, suspendedReason: 'Fonte suspensa.' } } };
    expect(reduceL0(suspended, { type: 'roll', key: 'ancestry' })).toBe(suspended);
  });

  it('marca a prévia inelegível após trocar Ancestry e rejeita até uma confirmação disparada pela UI antiga', () => {
    let state = choose(createL0State(), 'ancestry', 'anc-core');
    state = reduceL0(state, { type: 'select', key: 'benefit', ids: ['ben-job'] });
    state = choose(state, 'ancestry', 'anc-oh');
    expect(viewSlot(state, 'benefit').uiState).toBe('needs-review');
    expect(viewSlot(state, 'benefit').confirmReason).toContain('Human Development');
    expect(state.slots.benefit.previewIds).toEqual(['ben-job']);
    expect(reduceL0(state, { type: 'confirm', key: 'benefit' })).toBe(state);
    expect(state.slots.benefit.confirmedIds).toEqual([]);
    const discarded = reduceL0(state, { type: 'discard', key: 'benefit' });
    expect(viewSlot(discarded, 'benefit').preview).toBeUndefined();
  });

  it('preserva a última escolha aprovada quando rejeita a proposta dependente e aceita uma nova escolha válida', () => {
    let state = choose(createL0State(), 'ancestry', 'anc-core');
    state = choose(state, 'benefit', 'ben-lang');
    const approved = state.slots.benefit.confirmedLabel;
    state = reduceL0(state, { type: 'select', key: 'benefit', ids: ['ben-job'] });
    state = choose(state, 'ancestry', 'anc-oh');
    expect(reduceL0(state, { type: 'confirm', key: 'benefit' })).toBe(state);
    expect(state.slots.benefit.confirmedIds).toEqual(['ben-lang']);
    expect(state.slots.benefit.confirmedLabel).toBe(approved);
    state = choose(state, 'ancestry', 'anc-core');
    state = choose(state, 'benefit', 'ben-job');
    expect(state.slots.benefit.confirmedIds).toEqual(['ben-job']);
    expect(viewSlot(state, 'benefit').confirmReason).toBeUndefined();
  });

  it('revalida cardinalidade, slot ativo e regra opcional na confirmação', () => {
    let state = choose(createL0State(), 'ancestry', 'anc-core');
    state = reduceL0(state, { type: 'select', key: 'benefit', ids: ['ben-job'] });
    const malformed = { ...state, slots: { ...state.slots, benefit: { ...state.slots.benefit, previewIds: ['ben-job', 'ben-job'] } } };
    expect(reduceL0(malformed, { type: 'confirm', key: 'benefit' })).toBe(malformed);
    state = choose(state, 'attribute-mode', 'mode-fixed');
    state = reduceL0(state, { type: 'select', key: 'attribute-fixed', ids: ['attr-strength'] });
    state = choose(state, 'ancestry', 'anc-oh');
    state = choose(state, 'attribute-mode', 'mode-random');
    expect(reduceL0(state, { type: 'confirm', key: 'attribute-fixed' })).toBe(state);
    expect(requiredPendencias(state).some(item => item.title === 'Aumento fixo')).toBe(false);
    state = choose(state, 'attribute-mode', 'mode-fixed');
    state = choose(state, 'attribute-fixed', 'attr-strength');
    state = reduceL0(state, { type: 'transfer', value: true });
    state = reduceL0(state, { type: 'select', key: 'attribute-transfer', ids: ['xfer-strength-agility'] });
    state = reduceL0(state, { type: 'transfer', value: false });
    expect(reduceL0(state, { type: 'confirm', key: 'attribute-transfer' })).toBe(state);
    expect(requiredPendencias(state).some(item => item.title === 'Transferir 1 ponto')).toBe(true);
  });

  it('marca o adapter como fictício e não habilita ruleset oficial', () => {
    expect(ADAPTER_FICTIONAL).toBe(true);
    const empty = summarizeStubs([]);
    expect(empty.rulesetEnabled).toBe(false);
    expect(empty.fictionalData).toBe(true);
    expect(empty.ancestries).toEqual([]);
    const stubs = summarizeStubs([coreStub, onlyHumanStub, { fictionalData: true, source: { title: 'Demo' } }]);
    expect(stubs.rulesetEnabled).toBe(false);
    expect(stubs.ancestries.map(item => item.publication)).toEqual(['Core', 'Only Human']);
    expect(stubs.ancestries.every(item => item.fictionalData === false)).toBe(true);
  });

  it('caminha o nível 0 fictício sem tabela publicada e só atualiza stats no confirm', () => {
    let state = createL0State([coreStub]);
    expect(state.seed).toBe('');
    expect(confirmedStats(state)).toEqual({});
    expect(requiredPendencias(state).length).toBeGreaterThan(0);
    const ancestry = viewSlot(state, 'ancestry');
    expect(ancestry.options.some(option => !option.eligible && option.disabledReason?.includes('Ruleset oficial desligado'))).toBe(true);
    expect(ancestry.options.find(option => option.id === 'anc-core')?.eligible).toBe(true);
    state = reduceL0(state, { type: 'select', key: 'ancestry', ids: ['anc-core'] });
    expect(confirmedStats(state)).toEqual({});
    expect(viewSlot(state, 'ancestry').uiState).toBe('preview');
    state = reduceL0(state, { type: 'discard', key: 'ancestry' });
    expect(viewSlot(state, 'ancestry').uiState).toBe('empty');
    state = choose(state, 'ancestry', 'anc-core');
    state = choose(state, 'attribute-mode', 'mode-fixed');
    state = reduceL0(state, { type: 'select', key: 'attribute-fixed', ids: ['attr-strength'] });
    expect(confirmedStats(state).strength).toBeUndefined();
    state = reduceL0(state, { type: 'confirm', key: 'attribute-fixed' });
    expect(confirmedStats(state)).toEqual({ strength: 11, agility: 10, intellect: 10, will: 10 });
    expect(confirmedStats(state).health).toBeUndefined();
    state = choose(state, 'size', 'size-one');
    state = choose(state, 'benefit', 'ben-job');
    state = choose(state, 'profession', 'prof-archive');
    state = choose(state, 'wealth', 'wealth-light');
    state = choose(state, 'kit', 'kit-walk');
    const before = state.slots['interesting-thing'].confirmedLabel;
    state = reduceL0(state, { type: 'select', key: 'interesting-thing', ids: ['thing-button'] });
    state = reduceL0(state, { type: 'lock', key: 'interesting-thing' });
    expect(state.slots['interesting-thing'].previewLabel).toBe('Um botão de vidro sem casa (fictício)');
    expect(state.slots['interesting-thing'].locked).toBe(true);
    expect(reduceL0(state, { type: 'roll', key: 'interesting-thing' })).toBe(state);
    state = reduceL0(state, { type: 'generate-flag', key: 'interesting-thing' });
    expect(state.slots['interesting-thing'].includeInGenerate).toBe(true);
    expect(state.slots['interesting-thing'].previewLabel).toBe('Um botão de vidro sem casa (fictício)');
    expect(state.slots['interesting-thing'].confirmedLabel).toBe(before);
    state = reduceL0(state, { type: 'confirm', key: 'interesting-thing' });
    expect(requiredPendencias(state)).toEqual([]);
    expect(viewSlot(state, 'narrative').uiState).toBe('pending');
    expect(viewSlot(state, 'narrative').strategy).toBe('pending');
    for (const key of ['ancestry', 'attribute-mode', 'attribute-fixed', 'size', 'benefit', 'profession', 'wealth', 'kit', 'interesting-thing'] as const) {
      expect(state.slots[key].confirmedStrategy).not.toBe('published-table');
    }
    state = reduceL0(state, { type: 'confirm-review' });
    expect(state.reviewConfirmed).toBe(true);
  });

  it('sorteia com a mesma seed e não chama o resultado de tabela publicada', () => {
    let state = choose(createL0State(), 'ancestry', 'anc-oh');
    state = reduceL0(state, { type: 'mode', mode: 'hybrid' });
    state = reduceL0(state, { type: 'seed', seed: 'sessao-l0' });
    state = choose(state, 'attribute-mode', 'mode-random');
    const rolled = reduceL0(state, { type: 'roll', key: 'attribute-random' });
    const again = reduceL0(state, { type: 'roll', key: 'attribute-random' });
    expect(rolled.slots['attribute-random'].previewTrace).toEqual(again.slots['attribute-random'].previewTrace);
    expect(rolled.slots['attribute-random'].previewStrategy).toBe('uniform-eligible-unofficial');
    expect(rolled.slots['attribute-random'].previewTrace?.table).toContain('não é tabela publicada');
    expect(rolled.slots['attribute-random'].previewTrace?.faces).toHaveLength(4);
    const confirmed = reduceL0(rolled, { type: 'confirm', key: 'attribute-random' });
    const stats = confirmedStats(confirmed);
    expect(stats.strength).toBe(8 + (rolled.slots['attribute-random'].previewTrace?.faces[0] ?? 0));
    const rerolled = reduceL0(confirmed, { type: 'reroll', key: 'attribute-random' });
    expect(rerolled.slots['attribute-random'].previewTrace?.rerollIndex).toBe(1);
    expect(confirmedStats(rerolled)).toEqual(stats);
    const discarded = reduceL0(rerolled, { type: 'discard', key: 'attribute-random' });
    expect(discarded.slots['attribute-random'].previewLabel).toBeUndefined();
    expect(confirmedStats(discarded)).toEqual(stats);
  });

  it('mantém a ordem do stepper só com nível 0', () => {
    expect(L0_STEPS.map(step => step.title)).toEqual([
      'Ruleset e fontes', 'Ancestry', 'Atributos', 'Size', 'Benefício Human', 'Tabelas narrativas',
      'Profissões e idiomas', 'Wealth e kit', 'Interesting Thing', 'Roleplaying', 'Nome e notas', 'Revisão L0',
    ]);
    const source = ['l0-demo.ts', 'WizardL0.tsx', 'ChoiceSlot.tsx', 'choice-slot.ts'].map(file => readFileSync(`apps/web/${file}`, 'utf8')).join('\n');
    expect(source).not.toContain('MAGIC_PATH');
    expect(source).not.toContain('demoSlot');
    expect(source).not.toContain('demoLevel');
  });
});
