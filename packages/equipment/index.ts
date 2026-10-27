import type { Character, ChoiceEvent } from '../character-generator';
import { replaySession, type SessionAction } from '../session/model';

export const EQUIPMENT_POLICY = 'demo-additive-v1';
export const EQUIPMENT_POLICY_TEXT = 'Regra fictícia: bônus válidos de um equipamento equipado e dos efeitos ativos são somados uma única vez. Guardar o item não encerra magias.';
export type EquipmentContext = { selected?: ChoiceEvent; valid: boolean };
export type EquipmentCommand = { type: 'equipment'; equipmentEventId: string; equipped: boolean };

export function equipmentView(character: Character, context: EquipmentContext) {
  const event = context.selected;
  if (!event) return undefined;
  const requestedEquipped = replaySession(character.session).equipment.get(event.id) ?? true;
  let reason = context.valid ? '' : 'Escolha ou fonte do equipamento requer revisão; bônus suspenso.';
  if (event.resolution.effects.some(effect => effect.type !== 'stat-add')) reason = 'Modificador de equipamento não suportado; requer resolução manual.';
  return {
    eventId: event.id, itemId: event.resolution.key, name: event.resolution.label, quantity: 1,
    sources: event.resolution.sources, requestedEquipped, equipped: requestedEquipped && !reason,
    canEquip: !reason, reason, policy: EQUIPMENT_POLICY, policyText: EQUIPMENT_POLICY_TEXT,
    status: requestedEquipped ? (reason ? 'Suspenso' : 'Equipado') : 'Guardado',
    modifiers: event.resolution.effects.filter(effect => effect.type === 'stat-add'),
  };
}
export function applyEquipmentCommand(character: Character, context: EquipmentContext, command: EquipmentCommand): Character {
  const equipment = equipmentView(character, context);
  if (!equipment || equipment.eventId !== command.equipmentEventId) throw new Error('Equipamento não corresponde à escolha atual.');
  if (command.equipped && !equipment.canEquip) throw new Error(equipment.reason);
  if (equipment.requestedEquipped === command.equipped) return character;
  const seq = character.session.actions.length + 1;
  const action: SessionAction = {
    id: `session-${seq}`, seq, type: 'equipment', afterEventSeq: character.events.length,
    afterLevelChangeSeq: character.levelChanges.length, equipmentEventId: equipment.eventId,
    itemId: equipment.itemId, equipped: command.equipped,
  };
  return { ...character, revision: character.revision + 1, session: { actions: [...character.session.actions, action] } };
}
