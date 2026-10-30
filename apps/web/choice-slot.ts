/** Contrato de props do ChoiceSlot. Issues #9 e #10, frames 1b/1e. */

import { z } from 'zod';
import { ChoiceOptionSchema, ChoiceSlotSchema, RollTraceSchema, SlotUiStateSchema, StrategySchema } from './choice-slot-contract';

export type Strategy = z.infer<typeof StrategySchema>;
export type SlotUiState = z.infer<typeof SlotUiStateSchema>;
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;
export type RollTrace = z.infer<typeof RollTraceSchema>;

export type ChoiceSlotProps = z.input<typeof ChoiceSlotSchema> & {
  onManualOpen: () => void;
  onSelect: (ids: string[]) => void;
  onRoll: () => void;
  onReroll: () => void;
  onConfirmPreview: () => void;
  onDiscardPreview: () => void;
  onToggleLock: () => void;
  onShowSource: () => void;
  onShowHistory: () => void;
};

export const STRATEGY_BADGE: Record<Strategy, string> = {
  manual: 'manual',
  'published-table': 'tabela publicada',
  'uniform-eligible-unofficial': 'aleatório entre opções válidas (não oficial)',
  pending: 'pendente',
};

export const STATE_BADGE: Record<SlotUiState, string> = {
  empty: 'vazio',
  preview: 'prévia — não confirmada',
  confirmed: 'confirmado',
  partial: 'parcial',
  locked: 'travado',
  'needs-review': 'requer revisão',
  pending: 'pendente',
  suspended: 'suspenso',
};

/** Há resultado anterior: a ação "Rolar novamente" pode aparecer (habilitada ou com motivo). */
export function hasRollResult(props: Pick<ChoiceSlotProps, 'preview' | 'uiState' | 'rollTrace' | 'selectedIds'>): boolean {
  if (props.preview || props.rollTrace) return true;
  if (props.uiState === 'empty' || props.uiState === 'pending') return false;
  return props.selectedIds.length > 0;
}
