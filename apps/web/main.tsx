import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { emptySnapshot, importPack, packKey, registry, setEnabled, validatePack, type Snapshot } from '../../packages/catalog';
import { loadSnapshot, saveSnapshot } from '../../packages/catalog/storage';
import demo from '../../examples/demo-pack.json';
import tables from '../../examples/demo-random-tables.json';
import levelZero from '../../examples/demo-level-zero.json';
import levelOne from '../../examples/demo-level-one.json';
import magic from '../../examples/demo-magic.json';
import spellSession from '../../examples/demo-spell-session.json';
import { clearCharacter } from '../../packages/character-generator/storage';
import { CharacterBuilder } from './CharacterBuilder';
import { ErrorBoundary, onCaughtError } from './ErrorBoundary';
import { errorMessage } from './errors';
import './style.css';

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const operation = useRef(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  useEffect(() => {
    loadSnapshot().then(value => { setSnapshot(value); setReady(true); }).catch(e => setError(`Não foi possível abrir o catálogo salvo: ${String(e)}. Os dados existentes foram preservados.`));
  }, []);
  async function change(action: () => Snapshot | Promise<Snapshot>, success: string) {
    if (operation.current || !ready) return;
    operation.current = true; setBusy(true); setError(''); setMessage('');
    try {
      const next = await action();
      await saveSnapshot(next);
      setSnapshot(next); setMessage(success);
    } catch (e) { setError(errorMessage(e)); }
    finally { operation.current = false; setBusy(false); }
  }
  const entries = [...registry(snapshot).values()].filter(({ entity, pack }) =>
    (kind === 'all' || entity.kind === kind) && `${entity.name} ${entity.id} ${pack.source.title}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <main>
    <header><p className="eyebrow">SHADOW OF THE DEMON LORD · CHARACTER FORGE</p><h1>Forja de personagens</h1><p>Crie um personagem demonstrativo e consulte a origem de cada escolha.</p></header>
    <aside className="notice">Demonstração dos níveis 0 e 1, com dois caminhos fictícios e catálogo local. Os exemplos não representam regras oficiais. Níveis 2–10 e conteúdo oficial ainda não estão disponíveis.</aside>
    {error && <div role="alert" className="error"><strong>Operação não concluída</strong><pre>{error}</pre></div>}
    <p role="status" aria-live="polite">{busy ? 'Salvando…' : message || (!ready && !error ? 'Abrindo catálogo…' : '')}</p>
    <ErrorBoundary scope="criador" onReset={clearCharacter}><CharacterBuilder catalog={snapshot} catalogReady={ready} catalogBusy={busy} prepareDemo={() => void change(() => {
      let next = importPack(snapshot, tables).snapshot;
      next = importPack(next, levelZero).snapshot;
      next = importPack(next, levelOne).snapshot;
      next = importPack(next, magic).snapshot;
      next = importPack(next, spellSession).snapshot;
      for (const pack of next.packs.filter(p => [tables.packId, levelZero.packId, levelOne.packId, magic.packId, spellSession.packId].includes(p.packId))) next = setEnabled(next, pack, true);
      return next;
    }, 'Fontes da demonstração prontas.')} /></ErrorBoundary>
    <section aria-labelledby="sources-title"><h2 id="sources-title">Biblioteca de fontes</h2><p>Importar adiciona à biblioteca. Habilite uma fonte para usá-la no catálogo da campanha.</p>
      <div className="actions"><button disabled={!ready || busy} onClick={() => change(() => {
        let next = importPack(snapshot, demo).snapshot;
        next = importPack(next, tables).snapshot;
        return next;
      }, 'Exemplos importados. Habilite as fontes abaixo para consultar o conteúdo.')}>Carregar exemplos fictícios</button>
      <label className="file">Importar pack JSON<input aria-label="Importar pack JSON" type="file" accept=".json,application/json" disabled={!ready || busy} onChange={e => {
        const file = e.target.files?.[0]; e.target.value = '';
        if (file) void change(async () => {
          if (file.size > 5_000_000) throw new Error('O pack deve ter até 5 MB.');
          return importPack(snapshot, JSON.parse(await file.text())).snapshot;
        }, 'Pack validado e importado. Habilite a fonte para consultar.');
      }} /></label></div>
      {!snapshot.packs.length && <p className="empty">Sua biblioteca está vazia. Comece pelos exemplos ou importe um pack.</p>}
      <div className="packs">{snapshot.packs.map(pack => {
        const enabled = snapshot.ruleset.packs.some(ref => packKey(ref) === packKey(pack));
        const warnings = validatePack(pack, snapshot.packs).filter(d => d.severity === 'warning');
        return <article key={packKey(pack)}><h3>{pack.source.title}</h3><p>{packKey(pack)} · {pack.entities.length} registros</p>
          <span className="badge">{pack.fictionalData ? 'Fictício · demonstração' : `Fonte: ${pack.source.status}`}</span>
          <p>{pack.legalNotice}</p><label className="toggle"><input type="checkbox" checked={enabled} disabled={!ready || busy} onChange={e => {
            const checked = e.target.checked;
            void change(() => setEnabled(snapshot, pack, checked), checked ? 'Fonte habilitada.' : 'Fonte desabilitada. Referências históricas são preservadas; novas escolhas não usarão este conteúdo.');
          }} />Habilitar {pack.packId} {pack.version}</label>
          {!!warnings.length && <details><summary>{warnings.length} aviso(s) de curadoria</summary><ul>{warnings.map((w, i) => <li key={i}>{w.message}</li>)}</ul></details>}
        </article>;
      })}</div>
    </section>
    <section aria-labelledby="catalog-title"><h2 id="catalog-title">Conteúdo habilitado <span className="count">{entries.length}</span></h2>
      <div className="filters"><label>Buscar por nome, ID ou fonte<input value={query} onChange={e => setQuery(e.target.value)} type="search" /></label>
      <label>Tipo<select value={kind} onChange={e => setKind(e.target.value)}><option value="all">Todos</option>{['ancestry','path','spell','item','trait','condition','creature','rule','randomTable'].map(k => <option key={k} value={k}>{k}</option>)}</select></label></div>
      {!entries.length && <p className="empty">Nenhum registro encontrado nas fontes habilitadas.</p>}
      <div className="entries">{entries.map(({ entity, pack }) => <article key={`${packKey(pack)}:${entity.id}`}>
        <p className="eyebrow">{entity.kind} · {pack.fictionalData ? 'FICTÍCIO' : 'CONTEÚDO IMPORTADO'}</p><h3>{entity.name}</h3>
        <dl><dt>Fonte</dt><dd>{pack.source.title}</dd><dt>Página</dt><dd>{entity.sourcePage ?? 'Não informada'}</dd><dt>Variante / revisão</dt><dd>{entity.variantKey} / {entity.revision}</dd><dt>Curadoria declarada</dt><dd>{entity.status}</dd><dt>ID</dt><dd>{entity.id}</dd></dl>
        <p className="muted">{entity.status === 'curated' ? 'Curadoria declarada pelo pack. A importação verifica a estrutura, não a fidelidade ao livro.' : 'Requer revisão manual. Não disponível para automação.'}</p>
        {entity.kind === 'randomTable' && <><p><strong>{entity.diceExpr.count}d{entity.diceExpr.sides}{entity.diceExpr.modifier ? `${entity.diceExpr.modifier > 0 ? '+' : ''}${entity.diceExpr.modifier}` : ''}</strong> · {entity.ranges.length} faixas</p><details><summary>Consultar tabela e consequências declaradas</summary><pre>{JSON.stringify({ ranges: entity.ranges, outcomes: entity.outcomes }, null, 2)}</pre></details></>}
        <details><summary>Consultar registro completo</summary><pre>{JSON.stringify(entity, null, 2)}</pre></details>
      </article>)}</div>
    </section><footer>Dados salvos neste navegador · sem conta ou envio ao servidor. Mantenha os arquivos JSON originais como backup.</footer>
  </main>;
}
createRoot(document.getElementById('root')!, { onCaughtError }).render(<React.StrictMode><ErrorBoundary scope="forja"><App /></ErrorBoundary></React.StrictMode>);
