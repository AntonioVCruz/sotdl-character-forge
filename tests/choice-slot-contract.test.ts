import { describe, expect, it } from 'vitest';
import { ChoiceSlotCommandSchema, ChoiceSlotSchema } from '../apps/web/choice-slot-contract';
import { createL0State, L0ActionSchema, reduceL0, viewSlot, type L0Action } from '../apps/web/l0-demo';
import { levelSchema } from '../packages/character-generator/level';
import { slotLabel } from '../apps/web/slot-labels';
import { SLOT_IDS } from '../packages/character-generator';

const data = () => {
  const { includeInGenerate, step, ...result } = viewSlot(createL0State(), 'ancestry');
  return result;
};

describe('ChoiceSlot runtime contract', () => {
  it('compartilha níveis 0|1 com o motor e mantém L0 separado da capacidade futura L1', () => {
    for (const level of [0, 1]) {
      expect(levelSchema.parse(level)).toBe(level);
      expect(ChoiceSlotSchema.parse({ ...data(), level }).level).toBe(level);
      expect(ChoiceSlotCommandSchema.parse({ type: 'roll', key: 'future-slot', level }).level).toBe(level);
    }
    expect(ChoiceSlotSchema.safeParse({ ...data(), level: 2 }).success).toBe(false);
    expect(L0ActionSchema.safeParse({ type: 'roll', key: 'ancestry', level: 1 }).success).toBe(false);
    expect(ChoiceSlotCommandSchema.safeParse({ type: 'roll', key: 'ancestry', level: 2 }).success).toBe(false);
  });

  it('exige cardinalidade coerente, IDs únicos e motivo para opções inválidas', () => {
    const source = data();
    expect(ChoiceSlotSchema.parse(source).level).toBe(0);
    expect(ChoiceSlotSchema.safeParse({ ...source, cardinality: { min: 2, max: 1 } }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, options: [source.options[0], source.options[0]] }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, selectedIds: ['anc-core', 'anc-core'] }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, options: [{ id: 'blocked', label: 'Bloqueada', eligible: false }] }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, uiState: 'confirmed', selectedIds: [] }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, uiState: 'confirmed', selectedIds: ['missing-core'] }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, surprise: true }).success).toBe(false);
  });

  it('suporta N escolhas, parcial e completo; preserva prévias obsoletas apenas para revisão', () => {
    const source = { ...data(), options: [{ id: 'one', label: 'Um', eligible: true }, { id: 'two', label: 'Dois', eligible: true }], cardinality: { min: 2, max: 2 } };
    expect(ChoiceSlotSchema.safeParse({ ...source, uiState: 'partial', selectedIds: ['one'] }).success).toBe(true);
    expect(ChoiceSlotSchema.safeParse({ ...source, uiState: 'confirmed', selectedIds: ['one'] }).success).toBe(false);
    expect(ChoiceSlotSchema.safeParse({ ...source, uiState: 'confirmed', selectedIds: ['one', 'two'] }).success).toBe(true);
    expect(ChoiceSlotSchema.safeParse({ ...source, uiState: 'needs-review', selectedIds: ['obsolete'], preview: { label: 'Proposta antiga', confirmed: false } }).success).toBe(true);
  });

  it('rejeita comandos malformados antes de executar ou mutar o reducer', () => {
    const state = createL0State();
    for (const command of [null, { type: 'unknown' }, { type: 'select', key: 'ancestry', ids: ['anc-core', 'anc-core'] },
      { type: 'confirm', key: 'nonexistent' }, { type: 'roll', key: 'ancestry', level: 1 },
      { type: 'transfer', value: 'yes' }, { type: 'seed', seed: 42 }, { type: 'lock', key: '__proto__' }]) {
      expect(L0ActionSchema.safeParse(command).success).toBe(false);
      expect(reduceL0(state, command as L0Action)).toBe(state);
    }
    expect(reduceL0(state, { type: 'select', key: 'ancestry', ids: ['anc-core'] }).slots.ancestry.previewIds).toEqual(['anc-core']);
  });

  it('exibe rótulos sem expor chaves de slots, inclusive em pendências desconhecidas', () => {
    for (const id of SLOT_IDS) expect(slotLabel(id)).not.toBe(id);
    expect(slotLabel('private:slot:identifier')).toBe('Escolha');
  });
});
