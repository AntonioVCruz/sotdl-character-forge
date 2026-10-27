import type { Snapshot } from '../../packages/catalog';
import { calculateCharacter, type Character } from '../../packages/character-generator';
import type { EquipmentCommand } from '../../packages/equipment';

export function EquipmentPanel({ character, catalog, disabled, command }: { character: Character; catalog: Snapshot; disabled: boolean; command: (action: EquipmentCommand) => void }) {
  const equipment = calculateCharacter(character, catalog).equipment;
  if (!equipment) return null;
  return <section aria-label="Inventário e equipamento" className="sheet">
    <h3>Inventário e equipamento</h3>
    <p><strong>{equipment.name}</strong> · quantidade: {equipment.quantity}</p>
    <p className="badge">{equipment.status}</p>
    <p>Modificadores {equipment.equipped ? 'aplicados' : 'não aplicados'}: {equipment.modifiers.map(m => `${m.target} ${m.value >= 0 ? '+' : ''}${m.value}`).join(', ') || 'nenhum modificador aditivo'}</p>
    {equipment.sources.map((source,i) => <p key={i}>Fonte: {source.sourceRef} · {source.packId}@{source.version} · {source.entityId}</p>)}
    {equipment.reason && <p className="notice">{equipment.reason}</p>}
    <div className="actions"><button disabled={disabled || equipment.requestedEquipped || !equipment.canEquip} onClick={() => command({ type: 'equipment', equipmentEventId: equipment.eventId, equipped: true })}>Equipar item</button>
      <button disabled={disabled || !equipment.requestedEquipped} onClick={() => command({ type: 'equipment', equipmentEventId: equipment.eventId, equipped: false })}>Desequipar item</button></div>
    <p className="muted">{equipment.policyText}</p>
    <p className="muted">O controle não altera a escolha de criação. Descansar mantém o equipamento. Para escolher outro item, revise a etapa Equipamento no aplicativo.</p>
  </section>;
}
