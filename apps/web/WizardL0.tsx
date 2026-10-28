import { useMemo, useReducer, useState, type KeyboardEvent } from 'react';
import { ChoiceSlot } from './ChoiceSlot';
import { STRATEGY_BADGE, STATE_BADGE } from './choice-slot';
import {
  L0_STEPS,
  ROLE_FIELDS,
  confirmedChoiceLines,
  confirmedStats,
  createL0State,
  reduceL0,
  requiredPendencias,
  slotsOnStep,
  stepStateLabel,
  type L0Action,
  type L0State,
  type L0StepId,
  type SlotView,
} from './l0-demo';
import { loadStubModules } from './pack-stubs';
import { Stats } from './Stats';

const noop = () => {};

export function WizardL0({ stubs }: { stubs?: unknown[] }) {
  const source = useMemo(() => stubs ?? loadStubModules(), [stubs]);
  const [state, dispatch] = useReducer(reduceL0, source, createL0State);
  const [copied, setCopied] = useState('');
  const pending = requiredPendencias(state);
  const index = L0_STEPS.findIndex(step => step.id === state.step);
  const current = L0_STEPS[index] ?? L0_STEPS[0];

  function go(step: L0StepId | undefined) {
    if (step) dispatch({ type: 'step', step });
  }

  async function copySeed() {
    const value = state.seed.trim();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied('Seed copiada.');
    } catch {
      setCopied('Não foi possível copiar. Selecione a seed e copie manualmente.');
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!event.altKey || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
    event.preventDefault();
    go(L0_STEPS[index + (event.key === 'ArrowRight' ? 1 : -1)]?.id);
  }

  return <section className="wizard-l0" aria-label="Criador nível 0" data-fictional="true" onKeyDown={onKeyDown}>
    <header className="wizard-top">
      <div>
        <p className="eyebrow">NÍVEL 0</p>
        <h3>Criador</h3>
      </div>
      <div className="wizard-modes" role="group" aria-label="Modo do wizard">
        {([['manual', 'Manual'], ['hybrid', 'Híbrido'], ['all-random', 'Tudo aleatório']] as const).map(([mode, label]) =>
          <button type="button" key={mode} aria-pressed={state.mode === mode} onClick={() => dispatch({ type: 'mode', mode })}>{label}</button>)}
      </div>
      <label>Seed da sessão
        <input aria-label="Seed da sessão" value={state.seed} autoComplete="off" placeholder="vazia de propósito" onChange={event => { setCopied(''); dispatch({ type: 'seed', seed: event.target.value }); }} />
      </label>
      <button type="button" aria-disabled={state.seed.trim() ? undefined : true} aria-describedby="seed-copy-reason" onClick={() => void copySeed()}>Copiar seed</button>
      <p id="seed-copy-reason">{state.seed.trim() ? (copied || 'Copia a seed desta sessão.') : 'Nada para copiar: a seed está vazia de propósito.'}</p>
      <p>Pendências obrigatórias: <strong>{pending.length}</strong></p>
      <p className="wizard-level">Nível-alvo <strong>0</strong>
        <button type="button" aria-disabled="true" aria-describedby="level-reason" onClick={event => event.preventDefault()}>+</button>
      </p>
      <p id="level-reason">Níveis acima de 0 ficam fora deste stepper.</p>
      <button type="button" aria-disabled="true" aria-describedby="generate-all-reason" onClick={event => event.preventDefault()}>Gerar tudo aleatoriamente</button>
      <p id="generate-all-reason">Indisponível nesta fatia: o fluxo em duas etapas fica para depois. Este botão não sorteia. Travar um slot também não sorteia.</p>
    </header>
    <div className="wizard-shell">
      <nav className="wizard-steps" aria-label="Passos do nível 0">
        <p>Passos</p>
        {L0_STEPS.map(step => <button type="button" key={step.id} aria-current={step.id === state.step ? 'step' : undefined} onClick={() => go(step.id)}>
          <span>{step.title}</span>
          <span aria-hidden="true"> · </span>
          <span>{stepStateLabel(state, step.id)}</span>
        </button>)}
      </nav>
      <div className="wizard-step">
        <p className="muted">Passo de nível 0</p>
        <h3>{current.title}</h3>
        {state.step === 'ruleset' && <RulesetSummary state={state} dispatch={dispatch} />}
        {state.step === 'professions' && <p>Fala inicial nesta demonstração: Common Tongue. Alfabetização automática: nenhuma.</p>}
        {state.step === 'roleplaying' && <Roleplaying state={state} dispatch={dispatch} />}
        {state.step === 'name' && <NameNotes state={state} dispatch={dispatch} />}
        {state.step === 'review' && <Review state={state} dispatch={dispatch} pending={pending} />}
        {slotsOnStep(state, state.step).map(view => <SlotCard key={view.slotId} view={view} mode={state.mode} dispatch={dispatch} />)}
        <div className="actions">
          <button type="button" disabled={!L0_STEPS[index - 1]} onClick={() => go(L0_STEPS[index - 1]?.id)}>Anterior</button>
          <button type="button" disabled={!L0_STEPS[index + 1]} onClick={() => go(L0_STEPS[index + 1]?.id)}>Próximo</button>
        </div>
      </div>
      <aside className="mini-ficha" aria-label="Ficha ao vivo">
        <h3>Ficha ao vivo</h3>
        <p>nv 0 · alvo 0</p>
        <p>{state.name || 'Sem nome'}</p>
        <p aria-live="polite">{state.sheetAnnounce}</p>
        <Stats stats={confirmedStats(state)} />
        <ul>{confirmedChoiceLines(state).map(line => <li key={line}>{line}</li>)}</ul>
        <p>Pendências na ficha: {pending.length}</p>
      </aside>
    </div>
  </section>;
}

function SlotCard({ view, mode, dispatch }: { view: SlotView; mode: L0State['mode']; dispatch: (action: L0Action) => void }) {
  return <div className="wizard-slot">
    <ChoiceSlot
      slotId={view.slotId}
      title={view.title}
      contextLine={view.contextLine}
      strategy={view.strategy}
      uiState={view.uiState}
      options={view.options}
      cardinality={view.cardinality}
      selectedIds={view.selectedIds}
      preview={view.preview}
      consequences={view.consequences}
      rollTrace={view.rollTrace}
      locked={view.locked}
      canReroll={view.canReroll}
      sortReason={view.sortReason}
      onManualOpen={noop}
      onSelect={ids => dispatch({ type: 'select', key: view.slotId, ids })}
      onRoll={() => dispatch({ type: 'roll', key: view.slotId })}
      onReroll={() => dispatch({ type: 'reroll', key: view.slotId })}
      onConfirmPreview={() => dispatch({ type: 'confirm', key: view.slotId })}
      onDiscardPreview={() => dispatch({ type: 'discard', key: view.slotId })}
      onToggleLock={() => dispatch({ type: 'lock', key: view.slotId })}
      onShowSource={noop}
      onShowHistory={noop}
    />
    {mode === 'hybrid' && <label className="toggle">
      <input type="checkbox" checked={view.includeInGenerate} onChange={() => dispatch({ type: 'generate-flag', key: view.slotId })} />
      Incluir {view.title} no Gerar tudo
    </label>}
    {mode === 'hybrid' && <p className="muted">Marcar inclusão não sorteia. Travar também não sorteia: são controles separados.</p>}
  </div>;
}

function RulesetSummary({ state, dispatch }: { state: L0State; dispatch: (action: L0Action) => void }) {
  return <div>
    <p>Adapter demonstrativo com fictionalData true. Não é pack curado e não é tabela oficial publicada.</p>
    <p>Ruleset oficial: desligado.</p>
    <p>{state.stubs.note}</p>
    {state.stubs.ancestries.length > 0
      ? <ul>{state.stubs.ancestries.map(stub => <li key={stub.publication}>{stub.title} · {stub.publication} · {stub.status} · fictionalData false · não habilitado</li>)}</ul>
      : <p>Os stubs Core e Only Human, quando existirem no checkout, aparecem aqui como ancestry não habilitada.</p>}
    <label className="toggle"><input type="checkbox" checked={state.allowUniform} onChange={event => dispatch({ type: 'uniform', value: event.target.checked })} />Autorizar sorteio uniforme no nível 0 (não oficial)</label>
    <label className="toggle"><input type="checkbox" checked={state.allowTransfer} onChange={event => dispatch({ type: 'transfer', value: event.target.checked })} />Transferir 1 ponto entre atributos</label>
  </div>;
}

function Roleplaying({ state, dispatch }: { state: L0State; dispatch: (action: L0Action) => void }) {
  return <div>
    <p>Quatro campos opcionais. Deixar tudo vazio não é pendência obrigatória.</p>
    {ROLE_FIELDS.map(field => <label key={field.id}>{field.label}
      <textarea aria-label={field.label} value={state.role[field.id].draft} onChange={event => dispatch({ type: 'role-draft', field: field.id, value: event.target.value })} />
    </label>)}
    <div className="actions">
      <button type="button" onClick={() => dispatch({ type: 'save-role' })}>Salvar Roleplaying</button>
      <button type="button" onClick={() => dispatch({ type: 'discard-role' })}>Descartar Roleplaying</button>
    </div>
  </div>;
}

function NameNotes({ state, dispatch }: { state: L0State; dispatch: (action: L0Action) => void }) {
  return <div>
    <label>Nome do personagem no nível 0
      <input aria-label="Nome do personagem no nível 0" value={state.nameDraft} maxLength={200} onChange={event => dispatch({ type: 'name-draft', value: event.target.value })} />
    </label>
    <label>Notas do nível 0
      <textarea aria-label="Notas do nível 0" value={state.notesDraft} maxLength={10000} onChange={event => dispatch({ type: 'notes-draft', value: event.target.value })} />
    </label>
    <div className="actions">
      <button type="button" onClick={() => dispatch({ type: 'save-name' })}>Salvar nome e notas do nível 0</button>
      <button type="button" onClick={() => dispatch({ type: 'discard-name' })}>Descartar nome e notas</button>
    </div>
  </div>;
}

function Review({ state, dispatch, pending }: { state: L0State; dispatch: (action: L0Action) => void; pending: ReturnType<typeof requiredPendencias> }) {
  const stepsWithSlots = L0_STEPS.filter(step => slotsOnStep(state, step.id).length > 0);
  return <div>
    <p>{pending.length ? `Rascunho com pendências (${pending.length})` : 'Completo'}</p>
    {!!pending.length && <div>
      <p>Pendências obrigatórias</p>
      <ul>{pending.map(item => <li key={item.title}>{item.title}: {item.reason} <button type="button" onClick={() => dispatch({ type: 'step', step: item.step })}>Ir para o passo</button></li>)}</ul>
    </div>}
    <p>Decisões</p>
    <ul>{stepsWithSlots.flatMap(step => slotsOnStep(state, step.id).map(view => <li key={view.title}>{view.title}: {STRATEGY_BADGE[view.strategy]} · {STATE_BADGE[view.uiState]}{view.preview ? ` · prévia ${view.preview.label}` : ''}</li>))}</ul>
    <button type="button" aria-disabled={pending.length ? true : undefined} aria-describedby={pending.length ? 'review-block' : undefined} onClick={() => { if (!pending.length) dispatch({ type: 'confirm-review' }); }}>Confirmar revisão L0</button>
    {!!pending.length && <p id="review-block">A revisão não fecha enquanto houver pendência obrigatória.</p>}
    {state.reviewConfirmed && !pending.length && <p>Revisão L0 confirmada.</p>}
  </div>;
}
