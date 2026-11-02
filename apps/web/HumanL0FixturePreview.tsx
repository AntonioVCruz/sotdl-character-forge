import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildFixtureSelection,
  classifyHumanL0Surface,
  commitHumanL0Import,
  confirmHumanL0Preview,
  coreBenefitRequired,
  defaultFixtureSelectionInput,
  describeFixtureCatalog,
  exportConfirmedHumanL0,
  FIXTURE_EXTRA_LANGUAGE_ID,
  FIXTURE_PROFESSION_EVENT_ID,
  humanL0FixturePacks,
  HUMAN_L0_FIXTURE_CHARACTER_ID,
  loadHumanL0FixtureCharacter,
  previewHumanL0,
  readHumanL0Fixture,
  rollBlocks,
  selectionSummary,
  stageHumanL0Import,
  type FixtureSelectionInput,
  type HumanAttribute,
  type HumanL0Block,
  type HumanL0Character,
  type HumanL0Field,
  type HumanL0ImportStage,
  type HumanL0Preview,
  type HumanL0SheetModel,
} from './human-l0-preview';

const ATTRIBUTES: HumanAttribute[] = ['strength', 'agility', 'intellect', 'will'];
const ATTRIBUTE_LABEL: Record<HumanAttribute, string> = {
  strength: 'Strength', agility: 'Agility', intellect: 'Intellect', will: 'Will',
};

type FormState = {
  ancestryPackId: string;
  procedurePackId: string;
  increase: HumanAttribute;
  size: number;
  transfer: boolean;
  transferIncrease: HumanAttribute;
  transferDecrease: HumanAttribute;
  benefitKind: 'speak-language' | 'random-profession';
  name: string;
  seed: string;
};

type Panel =
  | { kind: 'selection'; preview: HumanL0Preview }
  | { kind: 'import'; staged: HumanL0ImportStage };

function fieldText(field: HumanL0Field): string {
  if (field.status === 'value') return String(field.value);
  return field.status === 'pending' ? 'pendente' : 'indisponível';
}

function SheetFields({ model, label }: { model: HumanL0SheetModel; label: string }) {
  return <div className="sheet human-l0-sheet" aria-label={label}>
    <p>Dados: fixture. Modo: local-preview. Geração oficial: desligada. Completude: não resolvida.</p>
    <p>Persistência: {model.persistenceKey}</p>
    <dl>{model.fields.map(field => <div key={field.key} data-field={field.key} data-status={field.status}>
      <dt>{field.label}</dt>
      <dd>{fieldText(field)}</dd>
    </div>)}</dl>
    <ul aria-label="Motivos das lacunas">{model.fields.filter(field => field.status !== 'value' && field.reason).map(field =>
      <li key={field.key} data-reason={field.key}>{field.label}: {field.reason}</li>)}</ul>
    <ul aria-label="Pendências do motor">{model.issues.map(issue => <li key={issue.code} data-issue={issue.code}>{issue.message}</li>)}</ul>
    <ul aria-label="Idiomas">{model.languages.length
      ? model.languages.map(language => <li key={language.languageId}>{language.languageId}: {language.note}</li>)
      : <li>Nenhum idioma calculado.</li>}</ul>
    <ul aria-label="Direitos e resultados pendentes">{model.grants.length
      ? model.grants.map(grant => <li key={grant.kind}>{grant.message}</li>)
      : <li>Nenhum direito calculado.</li>}</ul>
    <details>
      <summary>Composição do motor, sem Health, Defense e Speed</summary>
      {model.breakdown.length
        ? <ul>{model.breakdown.map((row, index) => <li key={`${row.phase}-${row.target}-${index}`}>{row.phase}: {row.target} {row.value}</li>)}</ul>
        : <p>Nenhuma composição disponível.</p>}
    </details>
  </div>;
}

function initialForm(): FormState {
  const defaults = defaultFixtureSelectionInput();
  return {
    ancestryPackId: defaults.ancestryPackId,
    procedurePackId: defaults.procedurePackId,
    increase: defaults.increase,
    size: defaults.size,
    transfer: false,
    transferIncrease: 'agility',
    transferDecrease: 'will',
    benefitKind: 'speak-language',
    name: '',
    seed: '',
  };
}

function toInput(form: FormState, ancestries: { packId: string; variant: 'core' | 'only-human' }[], procedures: { packId: string; kind: 'core' | 'human-development' }[]): FixtureSelectionInput {
  const ancestry = ancestries.find(item => item.packId === form.ancestryPackId);
  const procedure = procedures.find(item => item.packId === form.procedurePackId);
  const benefit = ancestry && procedure && coreBenefitRequired(ancestry.variant, procedure.kind)
    ? form.benefitKind === 'speak-language'
      ? { kind: 'speak-language' as const, languageId: FIXTURE_EXTRA_LANGUAGE_ID }
      : { kind: 'random-profession' as const, rollEventId: FIXTURE_PROFESSION_EVENT_ID }
    : null;
  return {
    ancestryPackId: form.ancestryPackId,
    procedurePackId: form.procedurePackId,
    increase: form.increase,
    size: form.size,
    adjustment: form.transfer ? { increase: form.transferIncrease, decrease: form.transferDecrease } : null,
    benefit,
  };
}

export function HumanL0FixturePreview() {
  const packs = useMemo(() => humanL0FixturePacks(), []);
  const catalog = useMemo(() => describeFixtureCatalog(packs), [packs]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [baseline, setBaseline] = useState<HumanL0Character | null>(null);
  const [confirmed, setConfirmed] = useState<HumanL0SheetModel | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState('Abrindo a prévia local da fixture.');
  const [actionBlocks, setActionBlocks] = useState<HumanL0Block[]>([]);
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const operation = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadHumanL0FixtureCharacter()
      .then(character => readHumanL0Fixture(packs, character))
      .then(read => {
        if (cancelled) return;
        setBaseline(read.character && read.model ? read.character : null);
        setConfirmed(read.model);
        setActionBlocks(read.blocks);
        setAnnounce(read.model
          ? 'Ficha Human L0 da fixture reaberta. Geração oficial continua desligada.'
          : 'Nenhuma ficha Human L0 confirmada nesta entrada.');
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setAnnounce('Não foi possível abrir a ficha Human L0. Os dados salvos foram preservados.');
        setReady(true);
      });
    return () => { cancelled = true; };
  }, [packs]);

  useEffect(() => {
    if (panel) panelHeading.current?.focus();
    else if (returnFocus.current) {
      returnFocus.current = false;
      previewButton.current?.focus();
    }
  }, [panel]);

  const input = toInput(form, catalog.ancestries, catalog.procedures);
  const built = catalog.surface.blocks.length ? null : buildFixtureSelection(packs, input);
  let eligibility: HumanL0Block[] = catalog.surface.blocks;
  if (!eligibility.length && built && !built.ok) eligibility = built.blocks;
  const ancestry = catalog.ancestries.find(item => item.packId === form.ancestryPackId);
  const procedure = catalog.procedures.find(item => item.packId === form.procedurePackId);
  const benefitRequired = !!ancestry && !!procedure && coreBenefitRequired(ancestry.variant, procedure.kind);
  const rollReason = panel
    ? 'Descarte ou confirme a prévia antes de rolar.'
    : rollBlocks(baseline, packs, form.seed)[0]?.message;
  const summary = baseline ? selectionSummary(baseline) : null;

  function edit(patch: Partial<FormState>) {
    setForm(current => ({ ...current, ...patch }));
    setActionBlocks([]);
    if (panel) {
      setPanel(null);
      setAnnounce('Prévia descartada porque a escolha mudou. A ficha confirmada foi preservada.');
    }
  }

  function chooseAncestry(packId: string) {
    const next = catalog.ancestries.find(item => item.packId === packId);
    edit({
      ancestryPackId: packId,
      size: next && next.sizes.includes(form.size) ? form.size : next?.sizes[0] ?? form.size,
    });
  }

  async function onPreview() {
    if (!ready || busy || operation.current || eligibility.length || !built || !built.ok) return;
    operation.current = true;
    setBusy(true);
    setActionBlocks([]);
    const result = await previewHumanL0(baseline, packs, baseline
      ? { type: 'select', selection: built.selection }
      : { type: 'create', selection: built.selection, name: form.name.trim() });
    operation.current = false;
    setBusy(false);
    if (!result.ok) {
      setActionBlocks(result.blocks);
      setAnnounce('A prévia foi recusada. A ficha confirmada foi preservada.');
      return;
    }
    setPanel({ kind: 'selection', preview: result });
    setAnnounce('Prévia pronta. A ficha confirmada não mudou.');
  }

  async function onRoll() {
    if (!ready || busy || operation.current || panel || rollReason) return;
    operation.current = true;
    setBusy(true);
    setActionBlocks([]);
    const result = await previewHumanL0(baseline, packs, { type: 'roll-attributes', seed: form.seed });
    operation.current = false;
    setBusy(false);
    if (!result.ok) {
      setActionBlocks(result.blocks);
      setAnnounce('A rolagem foi recusada. A ficha confirmada foi preservada.');
      return;
    }
    setPanel({ kind: 'selection', preview: result });
    setAnnounce('Rolagem em prévia. A ficha confirmada não mudou e a seed não foi inventada.');
  }

  async function onConfirm() {
    if (!panel || busy || operation.current) return;
    operation.current = true;
    setBusy(true);
    const result = panel.kind === 'selection'
      ? await confirmHumanL0Preview(baseline, packs, panel.preview)
      : await commitHumanL0Import(baseline, packs, panel.staged.character);
    operation.current = false;
    setBusy(false);
    if (!result.ok) {
      setActionBlocks(result.blocks);
      setAnnounce('A confirmação foi recusada. A ficha gravada foi preservada.');
      return;
    }
    returnFocus.current = true;
    setBaseline(result.character);
    setConfirmed(result.model);
    setPanel(null);
    setActionBlocks([]);
    setAnnounce('Prévia confirmada no id fixture-preview. A ficha demo não foi alterada.');
  }

  function onDiscard() {
    returnFocus.current = true;
    setPanel(null);
    setActionBlocks([]);
    setAnnounce('Prévia descartada. A ficha confirmada foi preservada.');
  }

  async function onImport(file: File | undefined) {
    if (!file || busy || operation.current || !ready) return;
    operation.current = true;
    setBusy(true);
    setActionBlocks([]);
    try {
      if (file.size > 5_000_000) {
        setActionBlocks([{ code: 'file-too-large', message: 'Arquivo grande demais. Nenhum dado foi substituído.' }]);
        setAnnounce('Importação recusada.');
        return;
      }
      const staged = await stageHumanL0Import(await file.text(), packs);
      if (!staged.ok) {
        setActionBlocks(staged.blocks);
        setAnnounce('Importação recusada. Nenhum dado foi substituído.');
        return;
      }
      setPanel({ kind: 'import', staged });
      setAnnounce(staged.model.baseResolved
        ? 'Importação em prévia. A ficha confirmada não mudou.'
        : 'Importação legível, com cálculo suspenso. A ficha confirmada não mudou.');
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }

  function onExport() {
    if (!baseline) return;
    const url = URL.createObjectURL(new Blob([exportConfirmedHumanL0(baseline)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'human-l0-fixture-preview.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const panelModel = panel?.kind === 'selection' ? panel.preview.model : panel?.staged.model;
  const visibleBlocks = actionBlocks.length ? actionBlocks : eligibility;
  const surfaceNote = classifyHumanL0Surface('official', packs);

  return <section className="human-l0-preview" aria-label="Prévia local Human L0, fixture" data-channel="fixture" data-official="false" data-character-id={HUMAN_L0_FIXTURE_CHARACTER_ID}>
    <p className="eyebrow">PRÉVIA LOCAL · FIXTURE</p>
    <h2>Prévia local Human L0</h2>
    <p>Esta seção chama a API Human L0 com a fixture sintética pública. Não é o wizard fictício e não é geração oficial.</p>
    <ul aria-label="Distinção de canal">
      <li>Fixture: packs públicos com fictionalData true.</li>
      <li>Prévia local: modo da ficha e do cálculo. Esta entrada não carrega packs reais.</li>
      <li>Oficial: {surfaceNote.officialGenerationEnabled ? 'ligada' : 'desligada'}. {surfaceNote.blocks[0]?.message}</li>
    </ul>
    <p id="human-l0-status" aria-live="polite">{busy ? 'Consultando o motor…' : announce}</p>
    {!!visibleBlocks.length && <div role="alert"><ul id="human-l0-blocks" aria-label="Motivos de bloqueio">{visibleBlocks.map(item => <li key={item.code} data-block={item.code}>{item.message}</li>)}</ul></div>}
    {!visibleBlocks.length && <ul id="human-l0-blocks" aria-label="Motivos de bloqueio" hidden />}
    {catalog.surface.blocks.length === 0 && <fieldset disabled={!ready || busy}>
      <legend>Escolha da fixture</legend>
      <div className="filters">
        <label>Ancestry da fixture<select aria-label="Ancestry da fixture" value={form.ancestryPackId} onChange={event => chooseAncestry(event.target.value)}>
          {catalog.ancestries.map(item => <option key={item.packId} value={item.packId}>{item.title} · {item.variant} · fixture · fictionalData true</option>)}
        </select></label>
        <label>Procedimento da fixture<select aria-label="Procedimento da fixture" value={form.procedurePackId} onChange={event => edit({ procedurePackId: event.target.value })}>
          {catalog.procedures.map(item => <option key={item.packId} value={item.packId}>{item.title} · {item.kind} · fixture</option>)}
        </select></label>
        <label>Aumento do modo fixo<select aria-label="Aumento do modo fixo" value={form.increase} onChange={event => edit({ increase: event.target.value as HumanAttribute })}>
          {ATTRIBUTES.map(attribute => <option key={attribute} value={attribute}>{ATTRIBUTE_LABEL[attribute]}</option>)}
        </select></label>
        <label>Size da fixture<select aria-label="Size da fixture" value={String(form.size)} onChange={event => edit({ size: Number(event.target.value) })}>
          {(ancestry?.sizes ?? []).map(size => <option key={size} value={String(size)}>{size}</option>)}
        </select></label>
      </div>
      <p>{ancestry?.randomAvailable ? 'Modo aleatório desta fonte: oferecido na rolagem, depois de confirmar.' : 'Modo aleatório desta fonte: indisponível.'}</p>
      <label className="toggle"><input type="checkbox" checked={form.transfer} onChange={event => edit({ transfer: event.target.checked })} />Transferência opcional na prévia</label>
      {form.transfer && <div className="filters">
        <label>Atributo que aumenta<select aria-label="Atributo que aumenta" value={form.transferIncrease} onChange={event => edit({ transferIncrease: event.target.value as HumanAttribute })}>
          {ATTRIBUTES.map(attribute => <option key={attribute} value={attribute}>{ATTRIBUTE_LABEL[attribute]}</option>)}
        </select></label>
        <label>Atributo que diminui<select aria-label="Atributo que diminui" value={form.transferDecrease} onChange={event => edit({ transferDecrease: event.target.value as HumanAttribute })}>
          {ATTRIBUTES.map(attribute => <option key={attribute} value={attribute}>{ATTRIBUTE_LABEL[attribute]}</option>)}
        </select></label>
      </div>}
      {benefitRequired ? <label>Benefício do par Core<select aria-label="Benefício do par Core" value={form.benefitKind} onChange={event => edit({ benefitKind: event.target.value as FormState['benefitKind'] })}>
        <option value="speak-language">Fala adicional da fixture (fixture-other)</option>
        <option value="random-profession">Direito de profissão aleatória — resultado pendente</option>
      </select></label> : <p>Benefício Core inelegível neste par. A prévia envia benefício vazio.</p>}
      {!baseline && <label>Nome opcional<input aria-label="Nome opcional da fixture" value={form.name} maxLength={200} onChange={event => edit({ name: event.target.value })} /></label>}
    </fieldset>}
    <div className="actions">
      <button ref={previewButton} type="button" aria-disabled={eligibility.length ? true : undefined} aria-describedby="human-l0-blocks" onClick={() => { if (!eligibility.length) void onPreview(); }}>Ver prévia local</button>
      <label>Seed da rolagem de atributos da fixture<input aria-label="Seed da rolagem de atributos da fixture" value={form.seed} maxLength={200} onChange={event => setForm(current => ({ ...current, seed: event.target.value }))} /></label>
      <button type="button" aria-disabled={rollReason ? true : undefined} aria-describedby="human-l0-roll-reason" onClick={() => { if (!rollReason) void onRoll(); }}>Rolar atributos na prévia</button>
    </div>
    <p id="human-l0-roll-reason">{rollReason ?? 'A rolagem usa o ancestry já confirmado e a seed informada.'}</p>
    {panel && panelModel && <section aria-label="Prévia local não confirmada" className="preview">
      <h3 ref={panelHeading} tabIndex={-1}>{panel.kind === 'import' ? 'Importação ainda não confirmada' : 'Prévia ainda não confirmada'}</h3>
      <p>Confirmar grava só human-l0/{HUMAN_L0_FIXTURE_CHARACTER_ID}. Descartar não grava.</p>
      <SheetFields model={panelModel} label="Ficha proposta da prévia local" />
      <div className="actions">
        <button type="button" onClick={() => void onConfirm()}>Confirmar prévia local</button>
        <button type="button" onClick={onDiscard}>Descartar prévia local</button>
      </div>
    </section>}
    <section aria-label="Ficha confirmada da prévia local">
      <h3>Ficha confirmada da fixture</h3>
      {summary && <p>Fonte confirmada: {summary.ancestry}. Procedimento: {summary.procedure}. Modo de atributos: {summary.attributeMode}.</p>}
      {confirmed ? <SheetFields model={confirmed} label="Números confirmados da prévia local" /> : <p>Nenhuma ficha Human L0 confirmada nesta entrada.</p>}
      <div className="actions">
        <button type="button" disabled={!baseline || busy || !!panel} onClick={onExport}>Exportar JSON Human L0</button>
        <label className="file">Importar JSON Human L0<input aria-label="Importar JSON Human L0" type="file" accept=".json,application/json" disabled={!ready || busy} onChange={event => {
          const file = event.target.files?.[0];
          event.target.value = '';
          void onImport(file);
        }} /></label>
      </div>
      <p className="muted">Impressão, PDF e HTML autônomo desta ficha: indisponível.</p>
    </section>
  </section>;
}
