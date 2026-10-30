import './security';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculateCharacter, exportCharacter, parseCharacter, performEquipmentCommand, performSessionCommand } from '../../packages/character-generator';
import { parseStandalonePayload, renderStandaloneHTML, downloadFile, type StandalonePayload } from '../../packages/standalone';
import { CharacterSheet } from '../web/CharacterSheet';
import { PrintSheet } from '../web/PrintSheet';
import { SessionPanel } from '../web/SessionPanel';
import { EquipmentPanel } from '../web/EquipmentPanel';
import { ErrorBoundary, onCaughtError } from '../web/ErrorBoundary';
import { errorMessage } from '../web/errors';
import '../web/style.css';

function OfflineSheet({ initial }: { initial: StandalonePayload }) {
  const [character, setCharacter] = useState(initial.character);
  const [name, setName] = useState(character.name), [notes, setNotes] = useState(character.notes);
  const [message, setMessage] = useState(''), [error, setError] = useState(''), [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(JSON.stringify(character));
  const editsPending = name !== character.name || notes !== character.notes;
  const dirty = editsPending || saved !== JSON.stringify(character);
  const view = calculateCharacter(character, initial.catalog);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  async function saveHTML() {
    setSaving(true); setError('');
    try {
      const runtime = { script: document.getElementById('standalone-runtime')?.textContent ?? '', css: document.getElementById('standalone-style')?.textContent ?? '' };
      const html = await renderStandaloneHTML({ ...initial, character }, runtime);
      downloadFile(html, 'personagem-offline-atualizado.html', 'text/html;charset=utf-8');
      setSaved(JSON.stringify(character)); setMessage('Nova cópia HTML gerada. Guarde o arquivo baixado para preservar este estado.');
    } catch (e) { setError(errorMessage(e)); }
    finally { setSaving(false); }
  }
  return <main>
    <header><p className="eyebrow">CHARACTER FORGE · FICHA OFFLINE</p><h1>Ficha autônoma</h1><p>Conteúdo fictício. Dados e cálculos locais, sem servidor ou conexão.</p></header>
    <aside className="notice">Aplique nome/notas antes de salvar. Baixe JSON para reimportar no aplicativo ou uma nova cópia HTML para continuar offline. O arquivo aberto não é alterado automaticamente.</aside>
    {error && <p role="alert" className="error">{error}</p>}
    <p role="status">{message}</p><p aria-live="polite">{dirty ? 'Há alterações ainda não baixadas.' : 'Estado corresponde à última cópia aberta ou gerada.'}</p>
    <fieldset disabled={saving}><legend>Editar nome e notas</legend>
      <label>Nome (opcional)<input value={name} maxLength={200} onChange={e => setName(e.target.value)} /></label>
      <label>Notas (opcionais)<textarea aria-label="Notas (opcionais)" value={notes} maxLength={10000} onChange={e => setNotes(e.target.value)} /></label>
      <button onClick={() => {
        try { setCharacter(parseCharacter({ ...character, name, notes, revision: character.revision + 1 })); setError(''); setMessage('Nome e notas aplicados. Baixe uma cópia para guardar.'); }
        catch (e) { setError(errorMessage(e)); }
      }}>Aplicar nome e notas</button>
    </fieldset>
    <div className="actions"><button disabled={saving || editsPending} onClick={() => void saveHTML()}>Salvar nova cópia HTML</button>
      <button disabled={saving || editsPending} onClick={() => { downloadFile(exportCharacter(character), 'personagem-offline.json', 'application/json'); setSaved(JSON.stringify(character)); setMessage('JSON gerado para reimportar no aplicativo.'); }}>Salvar personagem JSON</button>
      <button disabled={saving || editsPending} onClick={() => window.print()}>Imprimir / Salvar como PDF</button></div>
    {editsPending && <p className="notice">Aplique ou desfaça a edição de nome/notas para salvar ou imprimir.</p>}
    <CharacterSheet character={character} catalog={initial.catalog} title="Ficha offline" calculated={view} />
    <EquipmentPanel character={character} catalog={initial.catalog} disabled={saving || editsPending} command={command => {
      try { setCharacter(performEquipmentCommand(character, initial.catalog, command)); setError(''); setMessage('Equipamento atualizado. Baixe uma cópia para guardar.'); }
      catch (e) { setError(errorMessage(e)); }
    }} />
    <SessionPanel character={character} catalog={initial.catalog} disabled={saving || editsPending} command={command => {
      try { setCharacter(performSessionCommand(character, initial.catalog, command)); setError(''); setMessage('Sessão atualizada. Baixe uma cópia para guardar.'); }
      catch (e) { setError(errorMessage(e)); }
    }} />
    <details><summary>Histórico de aprendizado e rolagens ({character.events.length} decisões)</summary><pre>{JSON.stringify(character.events, null, 2)}</pre></details>
    <details><summary>Fontes e versões incorporadas</summary><ul>{initial.catalog.packs.map(p => <li key={`${p.packId}@${p.version}`}>{p.source.title} · {p.packId}@{p.version} · {initial.catalog.ruleset.packs.some(ref => ref.packId === p.packId && ref.version === p.version) ? 'habilitado' : 'desabilitado'}</li>)}</ul></details>
    <PrintSheet character={character} view={view} previewOpen={false} close={() => {}} />
  </main>;
}
try {
  const initial = parseStandalonePayload(JSON.parse(document.getElementById('standalone-state')?.textContent ?? 'null'));
  createRoot(document.getElementById('root')!, { onCaughtError }).render(<ErrorBoundary scope="ficha"><OfflineSheet initial={initial} /></ErrorBoundary>);
} catch (e) {
  const root = document.getElementById('root');
  if (root) root.textContent = `Não foi possível abrir esta ficha: ${errorMessage(e)}`;
}
