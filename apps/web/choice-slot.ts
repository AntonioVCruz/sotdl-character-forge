/** Contrato de props do ChoiceSlot. Issues #9 e #10, frames 1b/1e. */

export type Strategy =
  | 'manual'
  | 'published-table'
  | 'uniform-eligible-unofficial'
  | 'pending';

export type SlotUiState =
  | 'empty'
  | 'preview'
  | 'confirmed'
  | 'partial'
  | 'locked'
  | 'needs-review'
  | 'pending'
  | 'suspended';

export type ChoiceOption = {
  id: string;
  label: string;
  eligible: boolean;
  /** Obrigatório quando `eligible` é false. A UI sempre mostra o texto. */
  disabledReason?: string;
};

export type RollTrace = {
  expression: string;
  faces: number[];
  total: number;
  table?: string;
  source?: string;
  seed?: string;
  rerollIndex?: number;
};

export type ChoiceSlotProps = {
  slotId: string;
  title: string;
  contextLine?: string;
  strategy: Strategy;
  uiState: SlotUiState;
  options: ChoiceOption[];
  cardinality: { min: number; max: number };
  selectedIds: string[];
  preview?: { label: string; confirmed: false };
  consequences?: { status: 'applied' | 'needs-review'; items: string[] };
  rollTrace?: RollTrace;
  locked: boolean;
  canReroll: boolean;
  sortReason?: string;
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
