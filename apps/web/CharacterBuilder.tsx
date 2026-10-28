import { useEffect, useRef, useState } from 'react';
import type { Snapshot } from '../../packages/catalog';
import { calculateCharacter, commitDraft, currentEvents, exportCharacter, importCharacter, newCharacter, performEquipmentCommand, performSessionCommand, planSlots, preview, strategyLabels, type Character, type Draft, type Policy, type Slot, type SlotId } from '../../packages/character-generator';
import { loadCharacter, saveCharacter } from '../../packages/character-generator/storage';
import { errorMessage } from './errors';
import { SessionPanel } from './SessionPanel';
import { PrintSheet } from './PrintSheet';
import { CharacterSheet } from './CharacterSheet';
import { EquipmentPanel } from './EquipmentPanel';
import { WizardL0 } from './WizardL0';

function SlotEditor({ slot, character, disabled, policy, onPolicy, onChoose, onLock }: {
  slot: Slot; character: Character; disabled: boolean; policy: Policy; onPolicy: (policy: Policy) => void;
  onChoose: (id: SlotId, manual?: { key: string; quantities: Record<string, number> }) => void;
  onLock: (id: SlotId, locked: boolean) => void;
}) {
  const [key, setKey] = useState(''), [quantities, setQuantities] = useState<Record<string, number>>({});
  const event = currentEvents(character)[slot.id], locked = character.locks.includes(slot.id);
  const previous = character.events.filter(e => e.slotId === slot.id).at(-2);
  const option = slot.options.find(o => o.key === key);
  return <fieldset disabled={disabled} className="choice-slot"><legend>{slot.label}</legend>
    <p>{event ? event.resolution.label : 'Escolha ainda não preenchida'}</p>
    {event && <p className="badge">{strategyLabels[event.strategy]}</p>}
    {slot.reason && <p className="notice">{slot.reason}</p>}
    <label className="toggle"><input type="checkbox" checked={locked} onChange={e => onLock(slot.id, e.target.checked)} />Travar {slot.label}</label>
    <label>Escolha manual — {slot.label}<select value={option ? key : ''} disabled={locked || !slot.options.length} onChange={e => { setKey(e.target.value); setQuantities({}); }}>
      <option value="">Selecione uma opção</option>{slot.options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
    </select></label>
    {option?.quantities.map(q => <label key={q.key}>Quantidade de {q.label} ({q.min}–{q.max})<input type="number" min={q.min} max={q.max} disabled={locked} value={quantities[q.key] ?? ''} onChange={e => setQuantities({ ...quantities, [q.key]: e.target.value === '' ? NaN : Number(e.target.value) })} /></label>)}
    <div className="actions"><button disabled={locked || !option} onClick={() => onChoose(slot.id, { key, quantities })}>Prévia da escolha manual</button>
      <button disabled={locked || !slot.options.length} onClick={() => onChoose(slot.id)}>{event ? 'Rolar novamente' : 'Sortear'}</button>
      {previous && <button disabled={locked || !slot.options.some(o => o.key === previous.resolution.key)} onClick={() => onChoose(slot.id, { key: previous.resolution.key, quantities: previous.resolution.quantities })}>Restaurar escolha anterior</button>}</div>
    <p className="muted">{slot.tableId ? 'Sorteio pela tabela da fonte; veja dados e origem na prévia.' : 'Sorteio uniforme entre opções válidas, somente com autorização abaixo.'} Escolhas manuais ficam travadas ao confirmar.</p>
    {policy.mode === 'hybrid' && <label className="toggle"><input type="checkbox" checked={policy.perSlotModes[slot.id] !== 'manual'} onChange={e => onPolicy({ ...policy, perSlotModes: { ...policy.perSlotModes, [slot.id]: e.target.checked ? 'random' : 'manual' } })} />Sortear {slot.label} na geração conjunta</label>}
  </fieldset>;
}

export function CharacterBuilder({ catalog, catalogReady, catalogBusy, prepareDemo }: { catalog: Snapshot; catalogReady: boolean; catalogBusy: boolean; prepareDemo: () => void }) {
  const [character, setCharacter] = useState<Character>(newCharacter), [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false), saving = useRef(false);
  const [draft, setDraft] = useState<Draft | null>(null), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [name, setName] = useState(''), [notes, setNotes] = useState('');
  const [printPreview, setPrintPreview] = useState(false);
  const printButton = useRef<HTMLButtonElement>(null);
  const [policy, setPolicy] = useState<Policy>({ seed: 'minha-aventura', allowUniform: false, mode: 'manual', perSlotModes: {}, targetLevel: 0 });
  const draftHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    loadCharacter().then(c => { setCharacter(c); setName(c.name); setNotes(c.notes); setPolicy(p => ({ ...p, seed: c.seed, targetLevel: c.level })); setReady(true); }).catch(e => setError(`Falha ao abrir personagem: ${String(e)}. Os dados salvos foram preservados.`));
  }, []);
  useEffect(() => { if (draft) draftHeading.current?.focus(); }, [draft]);
  const disabled = !ready || !catalogReady || busy || catalogBusy;
  function propose(command?: { slotId: SlotId; manual?: { key: string; quantities: Record<string, number> } }) {
    try { setError(''); setMessage(''); setDraft(preview(character, catalog, command ? { ...policy, targetLevel: character.level } : policy, command)); }
    catch (e) { setError(errorMessage(e)); }
  }
  async function persist(next: Character, success: string) {
    if (saving.current || disabled) return;
    saving.current = true; setBusy(true); setError(''); setMessage('');
    try {
      await saveCharacter(next, character);
      setCharacter(next); setName(next.name); setNotes(next.notes); setPolicy(p => ({ ...p, seed: next.seed, targetLevel: next.level })); setDraft(null); setMessage(success);
    } catch (e) { setError(errorMessage(e)); }
    finally { saving.current = false; setBusy(false); }
  }
  const slots = planSlots(character, catalog);
  const confirmedView = calculateCharacter(character, catalog);
  useEffect(() => {
    if (!printPreview) return;
    const root = document.getElementById('root');
    if (root) root.inert = true;
    document.querySelector<HTMLButtonElement>('.print-toolbar button')?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setPrintPreview(false); };
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const buttons = [...document.querySelectorAll<HTMLButtonElement>('.print-toolbar button')];
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', closeOnEscape); document.addEventListener('keydown', trapFocus);
    return () => { if (root) root.inert = false; document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('keydown', trapFocus); printButton.current?.focus(); };
  }, [printPreview]);
  return <section aria-label="Criador demonstrativo" className="builder">
    <h2>Personagem demonstrativo · níveis 0 e 1</h2><p>Crie com escolhas manuais, misture escolhas e sorteios, ou gere todos os campos livres. Valores, caminhos, treinamentos, tradições e magias desta demonstração são fictícios. O Aprendiz da Centelha aprende uma tradição e depois uma magia de rank 0; o Guardião mantém o treinamento marcial.</p>
    <WizardL0 />
    <h3>Motor demonstrativo anterior</h3>
    <p>A grade abaixo continua o motor fictício já existente, inclusive o nível 1. Ela não é o wizard de nível 0.</p>
    <button disabled={disabled || !!draft} onClick={prepareDemo}>Preparar fontes da demonstração</button>
    <p className="muted">Adiciona e habilita os packs fictícios necessários no catálogo abaixo.</p>
    {error && <div role="alert" className="error">{error}</div>}
    <p aria-live="polite">{busy ? 'Salvando personagem…' : message}</p>
    <fieldset disabled={disabled || !!draft}><legend>Configuração</legend><div className="filters">
      <label>Modo de criação<select value={policy.mode} onChange={e => setPolicy({ ...policy, mode: e.target.value as Policy['mode'] })}><option value="manual">Manual</option><option value="hybrid">Híbrido</option><option value="all-random">Tudo aleatório</option></select></label>
      <label>Nível-alvo<select value={policy.targetLevel} onChange={e => setPolicy({ ...policy, targetLevel: Number(e.target.value) })}><option value="0">0 — demonstrativo</option><option value="1">1 — caminho e treinamento fictícios</option></select></label>
      <label>Seed<input value={policy.seed} maxLength={200} onChange={e => setPolicy({ ...policy, seed: e.target.value })} /></label>
    </div><label className="toggle"><input type="checkbox" checked={policy.allowUniform} onChange={e => setPolicy({ ...policy, allowUniform: e.target.checked })} />Permitir sorteio uniforme entre opções válidas (não oficial)</label>
    <div className="actions"><button disabled={policy.mode === 'manual'} onClick={() => propose()}>Gerar personagem inteiro — prévia</button>
    <button disabled={policy.targetLevel === character.level} onClick={() => {
      try { setError(''); setMessage(''); setDraft(preview(character, catalog, { ...policy, mode: 'manual' })); }
      catch (e) { setError(errorMessage(e)); }
    }}>Alterar nível — prévia</button></div><p>Ao mudar de nível, escolhas existentes são preservadas. Voltar ao nível 0 suspende os benefícios do nível 1 e mantém seu histórico. Travas são respeitadas em todos os modos.</p></fieldset>
    <div className="entries">{slots.map(slot => <SlotEditor key={slot.id} slot={slot} character={character} disabled={disabled || !!draft} policy={policy} onPolicy={setPolicy}
      onChoose={(slotId, manual) => propose({ slotId, manual })}
      onLock={(id, locked) => void persist({ ...character, revision: character.revision + 1, locks: locked ? [...character.locks, id] : character.locks.filter(s => s !== id) }, locked ? 'Escolha travada.' : 'Escolha destravada.')} />)}</div>
    {draft && <section aria-label="Prévia da geração" className="preview"><h3 ref={draftHeading} tabIndex={-1}>Revise antes de aplicar</h3>
      {draft.character.level !== character.level && <p className="notice">Mudança de nível: {character.level} → {draft.character.level}. {draft.character.level === 0 ? 'Caminho e treinamento serão suspensos; decisões e travas serão preservadas.' : 'Escolhas existentes serão revalidadas. Preencha caminho e treinamento se estiverem pendentes.'}</p>}
      <p>{draft.fullyResolved ? 'Todas as escolhas obrigatórias foram resolvidas.' : 'Esta prévia tem pendências. Pode ser salva como rascunho.'}</p>
      <CharacterSheet character={draft.character} catalog={catalog} title="Ficha proposta" />
      {!!draft.unresolved.length && <ul>{draft.unresolved.map((i,n) => <li key={n}>{i.slotId}: {i.reason}</li>)}</ul>}
      <details open><summary>Novas decisões e dados</summary>{draft.character.events.slice(character.events.length).map(event => <article key={event.id}><h4>{event.slotId}: {event.resolution.label}</h4><p>{strategyLabels[event.strategy]} · seed {event.seed} · contador {event.rerollIndex}</p>
        {event.resolution.rolls.map(roll => <p key={roll.id}>{roll.diceExpr.count}d{roll.diceExpr.sides}: [{roll.faces.join(', ')}]{roll.diceExpr.modifier ? ` + (${roll.diceExpr.modifier})` : ''} = {roll.total} · {roll.outcomeId ?? roll.ruleId} · {roll.parentRollId ? `filha de ${roll.parentRollId}` : 'rolagem principal'}</p>)}
        {event.resolution.sources.map((source,i) => <p key={i}>Fonte: {source.sourceRef} · {source.packId}@{source.version} · página {source.sourcePage ?? 'não informada (demo)'} · {source.entityId}</p>)}
      </article>)}</details>
      <div className="actions"><button disabled={disabled} onClick={() => {
        try { void persist(commitDraft(draft, character, catalog), 'Prévia confirmada e personagem salvo.'); }
        catch (e) { setError(errorMessage(e)); }
      }}>{draft.fullyResolved ? 'Confirmar prévia' : 'Salvar rascunho com pendências'}</button>
      <button disabled={busy} onClick={() => { setDraft(null); setError(''); setMessage('Prévia cancelada. A ficha confirmada foi preservada.'); }}>Cancelar prévia</button></div>
    </section>}
    <CharacterSheet character={character} catalog={catalog} title="Ficha confirmada" calculated={confirmedView} />
    <EquipmentPanel character={character} catalog={catalog} disabled={disabled || !!draft} command={action => {
      try { void persist(performEquipmentCommand(character, catalog, action), action.equipped ? 'Item equipado e ficha recalculada.' : 'Item guardado e ficha recalculada.'); }
      catch (e) { setError(errorMessage(e)); }
    }} />
    <div className="actions"><button ref={printButton} disabled={disabled || !!draft} onClick={() => setPrintPreview(true)}>Visualizar ficha A4</button>
      <button disabled={disabled || !!draft} onClick={() => window.print()}>Imprimir / Salvar como PDF</button></div>
    <p className="muted">Imprime somente a ficha confirmada, incluindo nome e notas salvos. Escolha Salvar como PDF no diálogo do navegador. Para o layout A4, use escala 100% e desative os cabeçalhos e rodapés do navegador.</p>
    {ready && catalogReady && <PrintSheet character={character} view={confirmedView} previewOpen={printPreview} close={() => setPrintPreview(false)} />}
    <SessionPanel character={character} catalog={catalog} disabled={disabled || !!draft} command={action => {
      try {
        const next = performSessionCommand(character, catalog, action);
        void persist(next, action.type === 'cast' ? 'Conjuração registrada. Ative o efeito quando desejar.' : action.type === 'rest' ? 'Descanso registrado: usos restaurados e efeitos encerrados.' : action.type === 'activate' ? 'Efeito ativado e ficha recalculada.' : 'Efeito encerrado e ficha recalculada.');
      } catch (e) { setError(errorMessage(e)); }
    }} />
    <fieldset disabled={disabled || !!draft}><legend>Nome, notas e arquivo</legend>
      <label>Nome (opcional)<input value={name} maxLength={200} onChange={e => setName(e.target.value)} /></label>
      <label>Notas (opcionais)<textarea aria-label="Notas (opcionais)" value={notes} maxLength={10000} onChange={e => setNotes(e.target.value)} /></label>
      <div className="actions"><button onClick={() => void persist({ ...character, revision: character.revision + 1, name, notes }, 'Nome e notas salvos.')}>Salvar nome e notas</button>
      <button onClick={() => {
        const url = URL.createObjectURL(new Blob([exportCharacter(character)], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = 'personagem-demo.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>Exportar personagem JSON</button>
      <button onClick={async () => {
        if (saving.current || disabled) return;
        saving.current = true; setBusy(true); setError(''); setMessage('');
        try {
          const { exportStandalone } = await import('./standalone-export');
          const size = await exportStandalone(character, catalog);
          setMessage(`HTML offline gerado (${Math.ceil(size / 1024)} KB). Abra o arquivo baixado sem servidor ou internet.`);
        } catch (e) { setError(errorMessage(e)); }
        finally { saving.current = false; setBusy(false); }
      }}>Exportar HTML offline</button>
      <label className="file">Importar personagem JSON<input type="file" aria-label="Importar personagem JSON" accept=".json,application/json" onChange={async e => {
        const file = e.target.files?.[0]; e.target.value = '';
        if (!file) return;
        setMessage(''); setError('');
        try {
          if (file.size > 5_000_000) throw new Error('JSON excede 5 MB.');
          const imported = importCharacter(await file.text());
          await persist(imported, 'Personagem importado sem refazer sorteios.');
        } catch (e) { setError(errorMessage(e)); }
      }} /></label></div><p>Importar substitui o personagem local pelo arquivo escolhido. Exporte o atual para guardar uma cópia.</p>
    </fieldset>
    <details><summary>Histórico completo ({character.events.length} decisões)</summary><pre>{JSON.stringify(character.events, null, 2)}</pre></details>
    <details><summary>Histórico de níveis ({character.levelChanges.length} mudanças)</summary><ul>{character.levelChanges.map(c => <li key={c.seq}>#{c.seq}: nível {c.from} → {c.to}, após decisão {c.afterEventSeq}</li>)}</ul></details>
  </section>;
}
