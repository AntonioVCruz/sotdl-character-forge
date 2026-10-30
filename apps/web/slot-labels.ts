import type { SlotId } from '../../packages/character-generator';

export const slotLabels: Record<SlotId, string> = {
  ancestry: 'Ancestralidade', background: 'Background', equipment: 'Equipamento', interestingThing: 'Interesting Thing',
  novicePath: 'Caminho iniciante', pathTraining: 'Treinamento', tradition: 'Tradição', spell: 'Magia aprendida',
};

export const slotLabel = (id: string): string => slotLabels[id as SlotId] ?? 'Escolha';
