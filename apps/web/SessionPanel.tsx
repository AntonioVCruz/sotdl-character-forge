import { calculateCharacter, type Character } from '../../packages/character-generator';
import type { Snapshot } from '../../packages/catalog';
import type { SessionCommand } from '../../packages/session';

export function SessionPanel({ character, catalog, disabled, command }: { character: Character; catalog: Snapshot; disabled: boolean; command: (action: SessionCommand) => void }) {
  const view = calculateCharacter(character, catalog).session;
  if (!view.current && !view.castCount && !character.events.some(e => e.slotId === 'spell')) return null;
  return <section aria-label="Conjuração e efeitos de sessão" className="sheet">
    <h3>Conjuração e efeitos · demonstração</h3>
    <p>Registrar conjuração consome um uso e cria um efeito inativo. Ativar ou encerrar é separado do consumo. As regras deste laboratório são fictícias.</p>
    {view.current && <p>Usos disponíveis: <strong>{view.current.remaining} de {view.current.limit}</strong> · usados: {view.current.used}</p>}
    {view.castingReason && <p className="notice">{view.castingReason}</p>}
    <div className="actions"><button disabled={disabled || !!view.castingReason} onClick={() => command({ type: 'cast' })}>Registrar conjuração</button>
      <button disabled={disabled || !character.session.actions.length} onClick={() => command({ type: 'rest' })}>Descansar e restaurar usos</button></div>
    <p className="muted">Descansar encerra as instâncias anteriores e restaura os usos; o histórico é preservado.</p>
    {view.effects.filter(e => !e.expired).map(effect => <article key={effect.castId} aria-label={`Efeito ${effect.castId}`}>
      <h4>{effect.name} · {effect.spell}</h4>
      <p>{effect.active ? 'Ativo' : effect.requestedActive ? 'Suspenso' : 'Inativo'} · {effect.castId}</p>
      <p>Duração: {effect.duration} · Escopo: {effect.scope}</p>
      <p>Condição: aprendizado original válido e fontes habilitadas.</p>
      <p>Modificadores declarados: {effect.declaredModifiers.map(m => `${m.target} ${m.value >= 0 ? '+' : ''}${m.value}`).join(', ') || 'Fonte indisponível'}</p>
      <p>Fonte: {effect.source.sourceRef} · {effect.source.packId}@{effect.source.version} · página {effect.source.sourcePage ?? 'não informada (fictícia)'}</p>
      {effect.reason && <p className="notice">{effect.reason}</p>}
      <div className="actions"><button disabled={disabled || effect.requestedActive || !!effect.reason} onClick={() => command({ type: 'activate', castId: effect.castId })}>Ativar efeito</button>
        <button disabled={disabled || !effect.requestedActive} onClick={() => command({ type: 'end', castId: effect.castId })}>Encerrar efeito</button></div>
    </article>)}
    <details><summary>Histórico de sessão ({character.session.actions.length} ações)</summary><pre>{JSON.stringify(character.session.actions, null, 2)}</pre></details>
  </section>;
}
