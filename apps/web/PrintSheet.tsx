import { createPortal } from 'react-dom';
import type { Character, calculateCharacter } from '../../packages/character-generator';
import { strategyLabels } from '../../packages/character-generator';
import type { SourceRef } from '../../packages/random-tables';
import './print.css';

type View = ReturnType<typeof calculateCharacter>;
const slotNames: Record<string, string> = { ancestry: 'Ancestralidade', background: 'Background', equipment: 'Equipamento', interestingThing: 'Objeto curioso', novicePath: 'Caminho iniciante', pathTraining: 'Treinamento', tradition: 'Tradição', spell: 'Magia aprendida' };
function Source({ source }: { source: SourceRef }) {
  return <span>{source.sourceRef} - {source.packId}@{source.version} - p. {source.sourcePage ?? 'não informada'} - {source.entityId}</span>;
}
export function PrintSheet({ character, view, previewOpen, close }: { character: Character; view: View; previewOpen: boolean; close: () => void }) {
  const effects = view.session.effects.filter(e => e.requestedActive && !e.expired);
  const choices = Object.entries(view.choices);
  return createPortal(<div className={`print-root${previewOpen ? ' print-preview' : ''}`} role={previewOpen ? 'dialog' : undefined} aria-modal={previewOpen ? true : undefined} aria-label={previewOpen ? 'Prévia da ficha A4' : undefined}>
    <div className="print-toolbar"><span>Prévia A4 - ficha confirmada</span><button onClick={() => window.print()}>Imprimir esta ficha</button><button onClick={close}>Fechar prévia A4</button></div>
    <article className="print-document" aria-label="Ficha para impressão">
      <header className="print-heading"><p className="print-brand">SHADOW OF THE DEMON LORD / CHARACTER FORGE</p><h1>{character.name || 'Personagem sem nome'}</h1><p>Nível {character.level} - revisão {character.revision} - ficha confirmada</p></header>
      <p className="print-disclaimer"><strong>DEMONSTRAÇÃO FICTÍCIA.</strong> Conteúdos e valores inventados para testes; não representam regras oficiais.</p>
      <p className="print-status">{view.fullyResolved ? 'Personagem demonstrativo completo' : 'Rascunho com pendências'}</p>
      <section className="print-section print-keep"><h2>Características calculadas</h2>
        {Object.keys(view.stats).length ? <dl className="print-stats">{Object.entries(view.stats).map(([key,value]) => <div key={key}><dt>{key}</dt><dd data-print-stat={key}>{value}</dd></div>)}</dl> : <p>Valores indisponíveis até revisar escolhas e fontes.</p>}
      </section>
      {!!view.unresolved.length && <section className="print-section print-warning"><h2>Pendências da ficha</h2><ul>{view.unresolved.map((item,i) => <li key={i}>{slotNames[item.slotId]}: {item.reason}</li>)}</ul></section>}
      {!!view.session.warnings.length && <section className="print-section print-warning"><h2>Avisos da sessão</h2><ul>{view.session.warnings.map((warning,i) => <li key={i}>{warning}</li>)}</ul></section>}
      <section className="print-section"><h2>Escolhas e proveniência</h2>
        {choices.length ? choices.map(([id,event]) => event && <div className="print-choice" key={id}><p><strong>{slotNames[id]}:</strong> {event.resolution.label}</p><p className="print-meta">{strategyLabels[event.strategy]} - decisão {event.seq} - nível {event.level}</p>
          {event.resolution.sources.map((source,i) => <p className="print-source" key={i}><Source source={source} /></p>)}
        </div>) : <p>Nenhuma escolha confirmada.</p>}
      </section>
      {view.equipment && <section className="print-section print-keep"><h2>Inventário e equipamento</h2>
        <p><strong>{view.equipment.name}</strong> - quantidade {view.equipment.quantity} - <strong>{view.equipment.status}</strong></p>
        <p>Modificadores {view.equipment.equipped ? 'aplicados' : 'não aplicados'}: {view.equipment.modifiers.map(m => `${m.target} ${m.value >= 0 ? '+' : ''}${m.value}`).join(', ') || 'nenhum'}.</p>
        {view.equipment.reason && <p>{view.equipment.reason}</p>}
        <p className="print-meta">{view.equipment.policyText}</p>
        {view.equipment.sources.map((source,i) => <p className="print-source" key={i}><Source source={source} /></p>)}
      </section>}
      {!!Object.keys(view.resources).length && <section className="print-section print-keep"><h2>Recursos da ficha</h2><dl className="print-resources">{Object.entries(view.resources).map(([key,value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>}
      {view.spell && <section className="print-section"><h2>Grimório demonstrativo</h2><div className="print-card"><h3>{view.spell.name}</h3><p>Rank {view.spell.rank ?? '?'} - {view.spell.tradition}</p><p>{view.spell.description}</p><p>{view.spell.needsReview ? 'Aprendizado requer revisão.' : 'Aprender não ativa efeitos. Demais interações de conjuração exigem resolução manual.'}</p>
        {view.spell.sources.map((source,i) => <p className="print-source" key={i}><Source source={source} /></p>)}
      </div></section>}
      {(view.spell || view.session.castCount > 0) && <section className="print-section"><h2>Sessão e efeitos temporários</h2>
        {view.session.current ? <p>Conjurações disponíveis: {view.session.current.remaining} de {view.session.current.limit} - usadas: {view.session.current.used}. Limite fictício por descanso.</p> : <p>Usos atuais indisponíveis até revisar o aprendizado e as fontes de sessão.</p>}
        {view.session.castingReason && <p>{view.session.castingReason}</p>}
        {effects.length ? effects.map(effect => <div className="print-card" key={effect.castId}><h3>{effect.name} - {effect.active ? 'Ativo' : 'Suspenso'}</h3><p>{effect.spell} - {effect.castId}</p><p>Duração: {effect.duration}. Escopo: {effect.scope}.</p>
          <p>Condição: aprendizado original válido e fontes habilitadas.</p><p>Modificadores {effect.active ? 'aplicados' : 'declarados (não aplicados)'}: {effect.declaredModifiers.map(m => `${m.target} ${m.value >= 0 ? '+' : ''}${m.value}`).join(', ') || 'fonte indisponível'}.</p>
          {effect.reason && <p>{effect.reason}</p>}<p className="print-source"><Source source={effect.source} /></p>
        </div>) : <p>Nenhum efeito solicitado como ativo.</p>}
      </section>}
      {!!view.breakdown.length && <section className="print-section"><h2>Origem dos valores</h2><table className="print-breakdown"><thead><tr><th>Característica</th><th>Parcela</th><th>Origem</th></tr></thead><tbody>{view.breakdown.map((item,i) => <tr key={i}><td>{item.target}</td><td>{item.value >= 0 ? '+' : ''}{item.value}</td><td>{item.source}</td></tr>)}</tbody></table></section>}
      {!!choices.length && <section className="print-section"><h2>Rastreio das escolhas atuais</h2><p className="print-meta">Algoritmo: {character.prngVersion}. O histórico integral de escolhas, substituições e ações de sessão fica no arquivo JSON.</p>
        {choices.map(([id,event]) => event && <div className="print-roll" key={id}><p><strong>{slotNames[id]}</strong> - seed: {event.seed} - contador: {event.rerollIndex} - {strategyLabels[event.strategy]}</p>
          {event.resolution.rolls.map(roll => <div key={roll.id}><p>{roll.id}{roll.parentRollId ? ` (filha de ${roll.parentRollId})` : ''}: {roll.diceExpr.count}d{roll.diceExpr.sides}, faces [{roll.faces.join(', ')}], ajuste {roll.diceExpr.modifier}, total {roll.total}; resultado {roll.outcomeId ?? roll.ruleId}.</p><p className="print-source"><Source source={roll.source} /></p></div>)}
        </div>)}
      </section>}
      {character.notes && <section className="print-section print-notes"><h2>Notas confirmadas</h2>{character.notes.split(/\r?\n\r?\n/).map((paragraph,i) => <p className="print-note" key={i}>{paragraph}</p>)}</section>}
      <footer className="print-end">Character Forge - conteúdo fictício - revisão {character.revision}. Valores correspondem à ficha confirmada; nenhum sorteio foi executado na impressão.</footer>
    </article>
  </div>, document.body);
}
