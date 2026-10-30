import type { Snapshot } from '../../packages/catalog';
import { calculateCharacter, strategyLabels, type Character } from '../../packages/character-generator';
import { Stats } from './Stats';

export function CharacterSheet({ character, catalog, title, calculated }: { character: Character; catalog: Snapshot; title: string; calculated?: ReturnType<typeof calculateCharacter> }) {
  const view = calculated ?? calculateCharacter(character, catalog);
  return <section aria-label={title} className="sheet"><h3>{title}</h3><p><strong>{character.name || 'Personagem sem nome'}</strong> · nível {character.level} · fictício</p>
    <p className="badge">{view.fullyResolved ? 'Personagem demonstrativo completo' : 'Rascunho com pendências'}</p>
    <Stats stats={view.stats} />
    <ul>{Object.entries(view.choices).map(([slot, e]) => <li key={slot}>{slot}: {e!.resolution.label} — {strategyLabels[e!.strategy]}</li>)}</ul>
    {view.equipment && <p>Equipamento da ficha: <strong>{view.equipment.status}</strong> · {view.equipment.name} · quantidade {view.equipment.quantity}.{view.equipment.reason && ` ${view.equipment.reason}`}</p>}
    {view.spell && <section aria-label="Grimório demonstrativo"><h4>Magia aprendida</h4><p><strong>{view.spell.name}</strong> · rank {view.spell.rank ?? '?'} · {view.spell.tradition}</p>
      <p>{view.spell.description}</p><p>{view.spell.needsReview ? 'Aprendizado requer revisão; magia incompatível ou fonte indisponível.' : 'Aprendizado válido. Aprender não ativa efeitos. O painel de sessão registra usos e efeitos fictícios; demais interações exigem resolução manual.'}</p>
      {view.spell.sources.map((s,i) => <p key={i}>Fonte: {s.sourceRef} · {s.packId}@{s.version} · página {s.sourcePage ?? 'não informada (fictícia)'}</p>)}
    </section>}
    {!!Object.keys(view.resources).length && <p>Recursos: {Object.entries(view.resources).map(([k,v]) => `${k}: ${v}`).join(' · ')}</p>}
    {!!view.unresolved.length && <ul className="pending">{view.unresolved.map((i,n) => <li key={n}>{i.slotId}: {i.reason}</li>)}</ul>}
    {!!view.session.warnings.length && <ul className="pending">{view.session.warnings.map((warning,i) => <li key={i}>{warning}</li>)}</ul>}
    <details><summary>Como os valores foram calculados</summary><ul>{view.breakdown.map((b,i) => <li key={i}>{b.target}: {b.value >= 0 ? '+' : ''}{b.value} — {b.source}</li>)}</ul><p>Escolhas com pendências não aplicam benefícios até serem resolvidas.</p></details>
  </section>;
}
