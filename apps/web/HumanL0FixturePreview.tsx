import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChoiceSlot } from './ChoiceSlot';
import {
  commitHumanL0Import,
  commitHumanL0Name,
  confirmHumanL0Preview,
  exportConfirmedHumanL0,
  humanL0EffectToggles,
  humanL0FixturePacks,
  HUMAN_L0_FIXTURE_CHARACTER_ID,
  loadHumanL0FixtureCharacter,
  proposeHumanL0EffectActive,
  proposeHumanL0ManualEffect,
  proposeHumanL0Roll,
  proposeHumanL0State,
  readHumanL0Fixture,
  stageHumanL0Import,
  type HumanAttribute,
  type HumanL0Block,
  type HumanL0Character,
  type HumanL0Field,
  type HumanL0Preview,
  type HumanL0SheetModel,
} from './human-l0-preview';
import {
  HUMAN_L0_STEPS,
  humanL0StepLabel,
  projectHumanL0Slots,
  proposeHumanL0Slot,
  type HumanL0StepId,
} from './human-l0-slots';

const ATTRIBUTES: HumanAttribute[] = ['strength', 'agility', 'intellect', 'will'];
const CHARACTERISTICS = ['health', 'defense', 'perception', 'speed', 'power'] as const;
const STATES = ['damage', 'insanity', 'corruption'] as const;

function fieldText(field: HumanL0Field): string {
  if (field.status === 'value') return String(field.value);
  return field.status === 'pending' ? 'pendente' : 'indisponível';
}

export function HumanL0FixturePreview({ onLeave }: { onLeave: () => void }) {
  const packs = useMemo(() => humanL0FixturePacks(), []);
  const [step, setStep] = useState<HumanL0StepId>('source');
  const [baseline, setBaseline] = useState<HumanL0Character | null>(null);
  const [sheet, setSheet] = useState<HumanL0SheetModel | null>(null);
  const [preview, setPreview] = useState<HumanL0Preview | null>(null);
  const [previewSlotId, setPreviewSlotId] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<{ slotId: string; blocks: HumanL0Block[] } | null>(null);
  const [locks, setLocks] = useState<string[]>([]);
  const [seed, setSeed] = useState('');
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState('Abrindo a prévia local da fixture.');
  const [actionBlocks, setActionBlocks] = useState<HumanL0Block[]>([]);
  const [reviewNoted, setReviewNoted] = useState(false);
  const [stateTarget, setStateTarget] = useState<(typeof STATES)[number]>('damage');
  const [stateValue, setStateValue] = useState('0');
  const [stateReason, setStateReason] = useState('');
  const [effectReason, setEffectReason] = useState('');
  const [effectPhase, setEffectPhase] = useState<'none' | 'attribute' | 'characteristic'>('none');
  const [effectTarget, setEffectTarget] = useState<string>('strength');
  const [effectDelta, setEffectDelta] = useState('0');
  const statusRef = useRef<HTMLParagraphElement>(null);
  const operation = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadHumanL0FixtureCharacter()
      .then(character => readHumanL0Fixture(packs, character))
      .then(read => {
        if (cancelled) return;
        setBaseline(read.model ? read.character : null);
        setSheet(read.model);
        setName(read.character?.name ?? '');
        setActionBlocks(read.blocks);
        setAnnounce(read.model ? 'Ficha Human L0 reaberta. Geração oficial continua desligada.' : 'Nenhuma ficha Human L0 confirmada nesta entrada.');
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setAnnounce('Não foi possível abrir a ficha Human L0. Os dados salvos foram preservados.');
        setReady(true);
      });
    return () => { cancelled = true; };
  }, [packs]);

  useEffect(() => { if (preview) statusRef.current?.focus(); }, [preview]);

  const slots = projectHumanL0Slots(packs, { baseline, preview, previewSlotId, refusal, locks, seed });
  const visible = slots.filter(slot => slot.step === step);
  const effects = baseline ? humanL0EffectToggles(baseline) : [];

  function onKeyDown(event: KeyboardEvent) {
    if (!event.altKey || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
    event.preventDefault();
    const index = HUMAN_L0_STEPS.findIndex(item => item.id === step);
    const next = HUMAN_L0_STEPS[index + (event.key === 'ArrowRight' ? 1 : -1)];
    if (next) setStep(next.id);
  }

  async function run(slotId: string | null, task: () => Promise<{ ok: true; preview?: HumanL0Preview } | { ok: false; blocks: HumanL0Block[] } | HumanL0Preview>) {
    if (!ready || operation.current) return;
    operation.current = true;
    setBusy(true);
    setActionBlocks([]);
    const result = await task();
    operation.current = false;
    setBusy(false);
    if (!result.ok) {
      setPreview(null);
      setPreviewSlotId(null);
      if (slotId) setRefusal({ slotId, blocks: result.blocks });
      else setRefusal(null);
      setActionBlocks(result.blocks);
      setAnnounce('A prévia foi recusada. A ficha confirmada foi preservada.');
      return;
    }
    if ('phase' in result && result.phase === 'preview') {
      setRefusal(null);
      setPreview(result);
      setPreviewSlotId(slotId);
      setAnnounce('Prévia pronta. A ficha confirmada não mudou.');
    }
  }

  async function confirmPreview() {
    if (!preview || operation.current) return;
    operation.current = true;
    setBusy(true);
    const result = await confirmHumanL0Preview(baseline, packs, preview);
    operation.current = false;
    setBusy(false);
    if (!result.ok) {
      setActionBlocks(result.blocks);
      setAnnounce('A confirmação foi recusada. A ficha gravada foi preservada.');
      return;
    }
    setBaseline(result.character);
    setSheet(result.model);
    setName(result.character.name);
    setPreview(null);
    setPreviewSlotId(null);
    setRefusal(null);
    setAnnounce('Prévia confirmada. A ficha demo não foi alterada. Geração oficial continua desligada.');
  }

  function discardPreview() {
    setPreview(null);
    setPreviewSlotId(null);
    setRefusal(null);
    setActionBlocks([]);
    setAnnounce('Prévia descartada. A ficha confirmada foi preservada.');
  }

  async function saveName() {
    if (!baseline) {
      setAnnounce('O nome entra na criação da ficha. Ainda não há ficha confirmada.');
      return;
    }
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    const result = await commitHumanL0Name(baseline, packs, name);
    operation.current = false;
    setBusy(false);
    if (!result.ok) {
      setActionBlocks(result.blocks);
      setAnnounce('O nome não foi gravado.');
      return;
    }
    setBaseline(result.character);
    setSheet(result.model);
    setAnnounce('Nome gravado na ficha Human L0. Notas continuam indisponíveis.');
  }

  return <section className="wizard-l0 human-l0-preview" aria-label="Prévia local Human L0, fixture" data-entry="human-l0" data-kind="sotdl-human-l0-character" data-mode="local-preview" data-official="false" onKeyDown={onKeyDown}>
    <header className="wizard-top">
      <div>
        <p className="eyebrow">HUMAN L0</p>
        <h2>Prévia local Human L0</h2>
      </div>
      <div className="choice-badges" aria-label="Distinção de canal">
        <span className="badge">fixture</span>
        <span className="badge">prévia local</span>
      </div>
      <button type="button" onClick={onLeave}>Voltar à forja demonstrativa</button>
    </header>
    <p>Entrada separada do wizard fictício. Tipo <code>sotdl-human-l0-character</code>, modo <code>local-preview</code>. Não reinterpreta a ficha demo.</p>
    <p ref={statusRef} id="human-l0-status" tabIndex={-1} aria-live="polite">{busy ? 'Consultando o motor…' : announce}</p>
    {!!actionBlocks.length && <div role="alert"><ul aria-label="Motivos de bloqueio">{actionBlocks.map(block => <li key={block.code}>{block.message}</li>)}</ul></div>}
    <div className="wizard-shell">
      <nav className="wizard-steps" aria-label="Passos da prévia local">
        <p>Passos</p>
        {HUMAN_L0_STEPS.map(item => <button type="button" key={item.id} aria-current={item.id === step ? 'step' : undefined} onClick={() => setStep(item.id)}>
          <span>{item.title}</span><span> {humanL0StepLabel(slots, item.id)}</span>
        </button>)}
      </nav>
      <div className="wizard-step">
        <h3>{HUMAN_L0_STEPS.find(item => item.id === step)?.title}</h3>
        {step === 'attributes' && <label>Seed da rolagem de atributos da fixture
          <input aria-label="Seed da rolagem de atributos da fixture" value={seed} maxLength={200} onChange={event => setSeed(event.target.value)} />
        </label>}
        {visible.map(slot => <div key={slot.slotId} data-slot={slot.slotId}><ChoiceSlot
          {...slot}
          onManualOpen={() => undefined}
          onSelect={ids => void run(slot.slotId, () => proposeHumanL0Slot(baseline, packs, slot.slotId, ids, name.trim()))}
          onRoll={() => void run(slot.slotId, () => proposeHumanL0Roll(baseline, packs, seed))}
          onReroll={() => void run(slot.slotId, () => proposeHumanL0Roll(baseline, packs, seed))}
          onConfirmPreview={() => void confirmPreview()}
          onDiscardPreview={discardPreview}
          onToggleLock={() => setLocks(current => current.includes(slot.slotId) ? current.filter(id => id !== slot.slotId) : [...current, slot.slotId])}
          onShowSource={() => undefined}
          onShowHistory={() => undefined}
        /></div>)}
        {step === 'identity' && <div>
          <label>Nome<input aria-label="Nome da ficha Human L0" value={name} maxLength={200} onChange={event => setName(event.target.value)} /></label>
          <p>Notas: indisponível. O tipo não guarda notas nesta fatia.</p>
          <button type="button" onClick={() => void saveName()}>Salvar nome</button>
        </div>}
        {step === 'advanced' && <Advanced
          effects={effects}
          stateTarget={stateTarget} setStateTarget={setStateTarget}
          stateValue={stateValue} setStateValue={setStateValue}
          stateReason={stateReason} setStateReason={setStateReason}
          effectReason={effectReason} setEffectReason={setEffectReason}
          effectPhase={effectPhase} setEffectPhase={setEffectPhase}
          effectTarget={effectTarget} setEffectTarget={setEffectTarget}
          effectDelta={effectDelta} setEffectDelta={setEffectDelta}
          onState={() => void run('state', () => proposeHumanL0State(baseline, packs, { target: stateTarget, value: Number(stateValue), reason: stateReason }))}
          onEffect={() => void run('manual-effect', () => proposeHumanL0ManualEffect(baseline, packs, {
            reason: effectReason,
            modifier: effectPhase === 'none' ? null : { phase: effectPhase, target: effectTarget, delta: Number(effectDelta) },
            equipment: null,
          }))}
          onToggle={(id, active) => void run('effect-active', () => proposeHumanL0EffectActive(baseline, packs, id, active))}
        />}
        {step === 'review' && <Review sheet={sheet} slots={slots} noted={reviewNoted} onNote={() => { setReviewNoted(true); setAnnounce('Revisão anotada nesta sessão. Isso não habilita geração oficial.'); }} onImport={file => void importFile(file)} onExport={() => baseline && download(exportConfirmedHumanL0(baseline))} exportDisabled={!baseline || busy || !!preview} />}
        {preview && (previewSlotId === 'state' || previewSlotId === 'manual-effect' || previewSlotId === 'effect-active') && <div className="choice-preview">
          <p>Prévia do comando avançado, ainda não aplicada.</p>
          <div className="actions">
            <button type="button" onClick={() => void confirmPreview()}>Confirmar prévia local</button>
            <button type="button" onClick={discardPreview}>Descartar prévia local</button>
          </div>
        </div>}
      </div>
      <aside className="mini-ficha" aria-label="Ficha da prévia local" aria-live="polite">
        <h3>Ficha confirmada</h3>
        <p>{baseline ? `${baseline.name || 'Sem nome'} · ${baseline.kind}` : 'Nenhuma ficha Human L0 confirmada.'}</p>
        <ul aria-label="Avisos da fatia">{(sheet?.banner ?? ['Cálculo em prévia local. Geração oficial permanece desligada.']).map(line => <li key={line}>{line}</li>)}</ul>
        {sheet ? <dl>{sheet.fields.map(field => <div key={field.key} data-field={field.key} data-status={field.status}><dt>{field.label}</dt><dd>{fieldText(field)}</dd></div>)}</dl> : <p>Características: indisponível.</p>}
        <ul aria-label="Pendências do motor">{sheet?.issues.map(issue => <li key={issue.code} data-issue={issue.code}>{issue.message}</li>)}</ul>
        <ul aria-label="Direitos e resultados pendentes">{sheet?.grants.map(grant => <li key={grant.kind}>{grant.message}</li>)}</ul>
        <p>Persistência: human-l0/{HUMAN_L0_FIXTURE_CHARACTER_ID}. Impressão, PDF e HTML: indisponível.</p>
      </aside>
    </div>
  </section>;

  async function importFile(file: File | undefined) {
    if (!file || operation.current) return;
    operation.current = true;
    setBusy(true);
    if (file.size > 5_000_000) {
      operation.current = false;
      setBusy(false);
      setAnnounce('Importação recusada. Arquivo grande demais.');
      return;
    }
    const staged = await stageHumanL0Import(await file.text(), packs);
    if (!staged.ok) {
      operation.current = false;
      setBusy(false);
      setActionBlocks(staged.blocks);
      setAnnounce('Importação recusada. A ficha demo não foi substituída.');
      return;
    }
    const saved = await commitHumanL0Import(baseline, packs, staged.character);
    operation.current = false;
    setBusy(false);
    if (!saved.ok) {
      setActionBlocks(saved.blocks);
      setAnnounce('Importação não gravada. A ficha confirmada foi preservada.');
      return;
    }
    setBaseline(saved.character);
    setSheet(saved.model);
    setName(saved.character.name);
    setAnnounce(saved.model.baseResolved ? 'JSON Human L0 importado.' : 'JSON Human L0 importado com cálculo suspenso. Os eventos foram preservados.');
  }
}

function download(json: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'human-l0-fixture-preview.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Review({ sheet, slots, noted, onNote, onImport, onExport, exportDisabled }: {
  sheet: HumanL0SheetModel | null;
  slots: ReturnType<typeof projectHumanL0Slots>;
  noted: boolean;
  onNote: () => void;
  onImport: (file: File | undefined) => void;
  onExport: () => void;
  exportDisabled: boolean;
}) {
  const pending = slots.filter(slot => slot.uiState === 'pending' || slot.uiState === 'empty' || slot.uiState === 'needs-review' || slot.uiState === 'suspended');
  return <div>
    <p>A revisão lista pendências. Confirmar esta anotação não habilita geração oficial.</p>
    <ul aria-label="Pendências da revisão">{pending.map(slot => <li key={slot.slotId}>{slot.title}: {slot.contextLine}</li>)}</ul>
    <p>{noted ? 'Anotação local registrada nesta sessão.' : 'Nenhuma anotação de revisão nesta sessão.'}</p>
    <button type="button" onClick={onNote}>Anotar revisão local</button>
    <div className="actions">
      <button type="button" disabled={exportDisabled} onClick={onExport}>Exportar JSON Human L0</button>
      <label className="file">Importar JSON Human L0<input aria-label="Importar JSON Human L0" type="file" accept=".json,application/json" onChange={event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        onImport(file);
      }} /></label>
    </div>
  </div>;
}

function Advanced(props: {
  effects: { id: string; reason: string; active: boolean }[];
  stateTarget: (typeof STATES)[number];
  setStateTarget: (value: (typeof STATES)[number]) => void;
  stateValue: string;
  setStateValue: (value: string) => void;
  stateReason: string;
  setStateReason: (value: string) => void;
  effectReason: string;
  setEffectReason: (value: string) => void;
  effectPhase: 'none' | 'attribute' | 'characteristic';
  setEffectPhase: (value: 'none' | 'attribute' | 'characteristic') => void;
  effectTarget: string;
  setEffectTarget: (value: string) => void;
  effectDelta: string;
  setEffectDelta: (value: string) => void;
  onState: () => void;
  onEffect: () => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const targets = props.effectPhase === 'characteristic' ? CHARACTERISTICS : ATTRIBUTES;
  return <div>
    <p>Comandos do motor com autoridade do usuário. Não são tabelas da #34.</p>
    <fieldset>
      <legend>Estado</legend>
      <label>Alvo<select aria-label="Alvo do estado" value={props.stateTarget} onChange={event => props.setStateTarget(event.target.value as (typeof STATES)[number])}>{STATES.map(target => <option key={target} value={target}>{target}</option>)}</select></label>
      <label>Valor<input aria-label="Valor do estado" value={props.stateValue} onChange={event => props.setStateValue(event.target.value)} /></label>
      <label>Motivo<input aria-label="Motivo do estado" value={props.stateReason} maxLength={500} onChange={event => props.setStateReason(event.target.value)} /></label>
      <button type="button" onClick={props.onState}>Prévia do estado</button>
    </fieldset>
    <fieldset>
      <legend>Efeito manual</legend>
      <label>Motivo<input aria-label="Motivo do efeito manual" value={props.effectReason} maxLength={500} onChange={event => props.setEffectReason(event.target.value)} /></label>
      <label>Fase<select aria-label="Fase do efeito manual" value={props.effectPhase} onChange={event => props.setEffectPhase(event.target.value as 'none' | 'attribute' | 'characteristic')}>
        <option value="none">Sem modificador</option>
        <option value="attribute">Atributo</option>
        <option value="characteristic">Característica</option>
      </select></label>
      {props.effectPhase !== 'none' && <>
        <label>Alvo<select aria-label="Alvo do efeito manual" value={props.effectTarget} onChange={event => props.setEffectTarget(event.target.value)}>{targets.map(target => <option key={target} value={target}>{target}</option>)}</select></label>
        <label>Delta<input aria-label="Delta do efeito manual" value={props.effectDelta} onChange={event => props.setEffectDelta(event.target.value)} /></label>
      </>}
      <button type="button" onClick={props.onEffect}>Prévia do efeito manual</button>
    </fieldset>
    <ul aria-label="Efeitos manuais gravados">{props.effects.length ? props.effects.map(effect => <li key={effect.id}>{effect.reason} · {effect.active ? 'ativo' : 'inativo'} <button type="button" onClick={() => props.onToggle(effect.id, !effect.active)}>{effect.active ? 'Desativar efeito' : 'Ativar efeito'}</button></li>) : <li>Nenhum efeito manual gravado.</li>}</ul>
  </div>;
}
