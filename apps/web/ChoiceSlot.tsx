import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { STRATEGY_BADGE, STATE_BADGE, hasRollResult, type ChoiceSlotProps } from './choice-slot';
import { parseChoiceSlotProps } from './choice-slot-contract';

type Panel = 'manual' | 'source' | 'history' | null;

const LOCK_REASON = 'Slot travado. Destrave para alterar. Travar não sorteia e não entra no lugar de Gerar tudo.';

export function ChoiceSlot(input: ChoiceSlotProps) {
  const props = { ...input, ...parseChoiceSlotProps(input) };
  const titleId = useId();
  const reasonBase = useId();
  const [panel, setPanel] = useState<Panel>(null);
  const [draftIds, setDraftIds] = useState<string[]>(props.selectedIds);
  const opener = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const showReroll = hasRollResult(props);
  const rollReason = props.sortReason ?? (props.locked ? LOCK_REASON : undefined);
  const rollBlocked = props.locked || Boolean(props.sortReason);
  const manualBlocked = props.locked;
  const rerollBlocked = !props.canReroll || props.locked;
  const rerollReason = props.locked ? LOCK_REASON : props.sortReason ?? (props.canReroll ? undefined : 'Rolar novamente indisponível.');
  const chosenLabels = props.selectedIds.map(id => props.options.find(option => option.id === id)?.label ?? 'opção sem rótulo');

  useEffect(() => {
    if (!panel) return;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setPanel(null);
      opener.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panel]);

  function open(next: Exclude<Panel, null>, button: HTMLButtonElement) {
    opener.current = button;
    if (next === 'manual') {
      setDraftIds(props.selectedIds);
      props.onManualOpen();
    }
    if (next === 'source') props.onShowSource();
    if (next === 'history') props.onShowHistory();
    setPanel(next);
  }

  function closePanel() {
    setPanel(null);
    opener.current?.focus();
  }

  function toggleDraft(id: string, eligible: boolean) {
    if (!eligible) return;
    setDraftIds(current => {
      if (props.cardinality.max <= 1) return [id];
      if (current.includes(id)) return current.filter(item => item !== id);
      if (current.length >= props.cardinality.max) return current;
      return [...current, id];
    });
  }

  const draftReady = draftIds.length >= props.cardinality.min && draftIds.length <= props.cardinality.max;
  const draftReason = draftReady ? undefined : `Escolha entre ${props.cardinality.min} e ${props.cardinality.max}.`;

  return <article className="choice-slot-card" aria-labelledby={titleId} data-choice-slot={props.uiState}>
    <header className="choice-slot-head">
      <div>
        <h3 id={titleId}>{props.title}</h3>
        {props.contextLine && <p className="muted">{props.contextLine}</p>}
      </div>
      <div className="choice-badges">
        <span className="badge" data-strategy={props.strategy}>{STRATEGY_BADGE[props.strategy]}</span>
        <span className="badge" data-slot-state={props.uiState}>{STATE_BADGE[props.uiState]}</span>
        {props.locked && props.uiState !== 'locked' && <span className="badge">travado</span>}
      </div>
    </header>
    <p className="muted">Escolhas: {props.cardinality.min}–{props.cardinality.max}. Selecionadas: {props.selectedIds.length}.</p>
    <div className="choice-actions">
      <ActionButton
        label="Escolher manualmente"
        blocked={manualBlocked}
        reason={manualBlocked ? LOCK_REASON : undefined}
        reasonId={`${reasonBase}-manual`}
        expanded={panel === 'manual'}
        onClick={event => open('manual', event.currentTarget)}
      />
      <ActionButton
        label="Sortear"
        blocked={rollBlocked}
        reason={rollBlocked ? rollReason : undefined}
        reasonId={`${reasonBase}-roll`}
        onClick={() => { if (!rollBlocked) props.onRoll(); }}
      />
      {showReroll && <ActionButton
        label="Rolar novamente"
        blocked={rerollBlocked}
        reason={rerollBlocked ? rerollReason : undefined}
        reasonId={`${reasonBase}-reroll`}
        onClick={() => { if (!rerollBlocked) props.onReroll(); }}
      />}
      <button type="button" onClick={props.onToggleLock}>{props.locked ? 'Destravar' : 'Travar'}</button>
      <ActionButton label="Ver dados e fonte" expanded={panel === 'source'} onClick={event => open('source', event.currentTarget)} />
      <ActionButton label="Histórico" expanded={panel === 'history'} onClick={event => open('history', event.currentTarget)} />
    </div>
    {props.preview && <div className="choice-preview">
      <div className="choice-preview-bar">
        <p>Resultado proposto</p>
        <div className="actions">
          <ActionButton label="Confirmar" blocked={Boolean(props.confirmReason)} reason={props.confirmReason} reasonId={`${reasonBase}-confirm`} onClick={props.onConfirmPreview} />
          <button type="button" onClick={props.onDiscardPreview}>Descartar prévia</button>
        </div>
      </div>
      <p><strong>{props.preview.label}</strong></p>
      <p className="muted">Ainda não aplicado à ficha.</p>
    </div>}
    {!props.preview && chosenLabels.length > 0 && <p>Resultado na ficha: <strong>{chosenLabels.join(', ')}</strong></p>}
    {!props.preview && chosenLabels.length === 0 && <p className="muted">Nenhum resultado na ficha.</p>}
    {props.consequences && <div>
      <p>Consequências <span className="badge">{props.consequences.status === 'applied' ? 'Aplicadas' : 'Requerem revisão'}</span></p>
      <ul>{props.consequences.items.map(item => <li key={item}>{item}</li>)}</ul>
    </div>}
    {props.rollTrace && <details>
      <summary>Rastro da rolagem {props.rollTrace.expression} = {props.rollTrace.total}</summary>
      <div className="choice-trace">
        <p>expressão {props.rollTrace.expression} · faces {props.rollTrace.faces.join(', ')} · total {props.rollTrace.total}</p>
        {props.rollTrace.table && <p>tabela {props.rollTrace.table}</p>}
        {props.rollTrace.source && <p>fonte {props.rollTrace.source}</p>}
        {props.rollTrace.seed && <p>seed {props.rollTrace.seed}</p>}
        {props.rollTrace.rerollIndex !== undefined && <p>rerolagem #{props.rollTrace.rerollIndex}</p>}
      </div>
    </details>}
    {panel && <div role="region" aria-label={panel === 'manual' ? `Escolher manualmente ${props.title}` : panel === 'source' ? 'Dados e fonte' : 'Histórico'} tabIndex={-1} ref={panelRef} className="choice-panel">
      <div className="choice-preview-bar">
        <p>{panel === 'manual' ? 'Escolher manualmente' : panel === 'source' ? 'Dados e fonte' : 'Histórico'}</p>
        <button type="button" onClick={closePanel}>Fechar (Esc)</button>
      </div>
      {panel === 'manual' && <>
        <div role={props.cardinality.max > 1 ? 'group' : 'radiogroup'} aria-labelledby={titleId}>
          {props.options.map(option => {
            const reasonId = `${reasonBase}-opt-${option.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
            const checked = draftIds.includes(option.id);
            return <div
              key={option.id}
              role={props.cardinality.max > 1 ? 'checkbox' : 'radio'}
              aria-checked={checked}
              aria-disabled={!option.eligible}
              aria-describedby={option.eligible ? undefined : reasonId}
              tabIndex={0}
              className={option.eligible ? 'choice-option' : 'choice-option is-ineligible'}
              onClick={() => toggleDraft(option.id, option.eligible)}
              onKeyDown={event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                toggleDraft(option.id, option.eligible);
              }}
            >
              <span>{option.label}</span>
              {!option.eligible && <span className="badge" id={reasonId}>{option.disabledReason ?? 'Indisponível, sem motivo informado.'}</span>}
            </div>;
          })}
        </div>
        <p className="muted">{props.options.length} opções · {props.options.filter(option => !option.eligible).length} indisponíveis (mostradas com motivo)</p>
        <ActionButton label="Usar esta opção" blocked={!draftReady || manualBlocked} reason={manualBlocked ? LOCK_REASON : draftReason} reasonId={`${reasonBase}-use`} onClick={() => {
          if (!draftReady || manualBlocked) return;
          props.onSelect(draftIds);
          closePanel();
        }} />
      </>}
      {panel === 'source' && <div>
        <p>{props.contextLine ?? 'Fonte não informada.'}</p>
        <p>Estratégia: {STRATEGY_BADGE[props.strategy]}. Estado: {STATE_BADGE[props.uiState]}.</p>
        <p className="muted">O identificador interno do slot não é exibido.</p>
      </div>}
      {panel === 'history' && <div>
        {props.rollTrace ? <p>Última rolagem: {props.rollTrace.expression}, faces {props.rollTrace.faces.join(', ')}, total {props.rollTrace.total}, rerolagem #{props.rollTrace.rerollIndex ?? 0}.</p> : <p>Nenhuma rolagem nesta sessão.</p>}
        {props.preview && <p>Prévia atual: {props.preview.label}</p>}
        {chosenLabels.length > 0 && <p>Confirmado na ficha: {chosenLabels.join(', ')}</p>}
      </div>}
    </div>}
  </article>;
}

function ActionButton({ label, blocked, reason, reasonId, expanded, onClick }: {
  label: string;
  blocked?: boolean;
  reason?: string;
  reasonId?: string;
  expanded?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return <span className="choice-action">
    <button
      type="button"
      aria-disabled={blocked || undefined}
      aria-describedby={blocked && reason ? reasonId : undefined}
      aria-expanded={expanded}
      onClick={event => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        onClick(event);
      }}
    >{label}</button>
    {blocked && reason && <span className="choice-reason" id={reasonId}>{reason}</span>}
  </span>;
}
