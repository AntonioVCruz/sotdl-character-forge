import { createSubstream, type Stats } from '../../packages/random-tables';
import type { ChoiceOption, RollTrace, SlotUiState, Strategy } from './choice-slot';

/** Adapter do wizard L0. `fictionalData` é sempre true. Não passa pelo atalho do motor demonstrativo de nível 1. */
export const ADAPTER_FICTIONAL = true as const;

export const L0_STEPS = [
  { id: 'ruleset', title: 'Ruleset e fontes' },
  { id: 'ancestry', title: 'Ancestry' },
  { id: 'attributes', title: 'Atributos' },
  { id: 'size', title: 'Size' },
  { id: 'benefit', title: 'Benefício Human' },
  { id: 'narrative', title: 'Tabelas narrativas' },
  { id: 'professions', title: 'Profissões e idiomas' },
  { id: 'wealth', title: 'Wealth e kit' },
  { id: 'interesting', title: 'Interesting Thing' },
  { id: 'roleplaying', title: 'Roleplaying' },
  { id: 'name', title: 'Nome e notas' },
  { id: 'review', title: 'Revisão L0' },
] as const;

export type L0StepId = (typeof L0_STEPS)[number]['id'];

const ATTRS = ['strength', 'agility', 'intellect', 'will'] as const;
type Attr = (typeof ATTRS)[number];
const ATTR_LABEL: Record<Attr, string> = { strength: 'Strength', agility: 'Agility', intellect: 'Intellect', will: 'Will' };

export type SlotKey =
  | 'ancestry'
  | 'attribute-mode'
  | 'attribute-fixed'
  | 'attribute-random'
  | 'attribute-transfer'
  | 'size'
  | 'benefit'
  | 'narrative'
  | 'profession'
  | 'language'
  | 'wealth'
  | 'kit'
  | 'interesting-thing';

const SLOT_KEYS: SlotKey[] = [
  'ancestry', 'attribute-mode', 'attribute-fixed', 'attribute-random', 'attribute-transfer',
  'size', 'benefit', 'narrative', 'profession', 'language', 'wealth', 'kit', 'interesting-thing',
];

const META: Record<SlotKey, { title: string; step: L0StepId; context: string }> = {
  ancestry: { title: 'Ancestry', step: 'ancestry', context: 'Adapter demonstrativo · fictionalData true · sem página de livro. Não é tabela publicada.' },
  'attribute-mode': { title: 'Modo de atributos', step: 'attributes', context: 'Fixo ou aleatório, conforme o recorte. A rolagem demonstrativa não é tabela publicada.' },
  'attribute-fixed': { title: 'Aumento fixo', step: 'attributes', context: 'Quatro bases 10. Um atributo recebe +1. Sem o +1 do ramo aleatório.' },
  'attribute-random': { title: 'Atributos aleatórios', step: 'attributes', context: 'Quatro rolagens independentes de 1d3, cada atributo 8 + face. Não é tabela publicada.' },
  'attribute-transfer': { title: 'Transferir 1 ponto', step: 'attributes', context: 'Opcional, uma vez, entre atributos distintos, depois do modo. Faixa 1–20.' },
  size: { title: 'Size', step: 'size', context: 'Escolha 1/2 ou 1. Independente de porte. Não é tabela publicada.' },
  benefit: { title: 'Benefício Human', step: 'benefit', context: 'Um benefício do recorte confirmado. Listas fictícias não substituem tabela publicada.' },
  narrative: { title: 'Tabelas narrativas', step: 'narrative', context: 'Idade, porte, aparência, background e personalidade.' },
  profession: { title: 'Profissão', step: 'professions', context: 'Lista fictícia do adapter. Não é a tabela publicada de profissões.' },
  language: { title: 'Idioma extra', step: 'professions', context: 'Common Tongue já vem da Ancestry. O extra, quando existe, é rótulo fictício.' },
  wealth: { title: 'Wealth', step: 'wealth', context: 'Rótulos fictícios de bolso. Não é a tabela publicada de Wealth.' },
  kit: { title: 'Kit inicial', step: 'wealth', context: 'Kits fictícios. Não é a lista publicada de equipamento inicial.' },
  'interesting-thing': { title: 'Interesting Thing', step: 'interesting', context: 'Um item, cardinalidade 1. Lista fictícia. Não é tabela publicada.' },
};

export type StubAncestry = { publication: string; title: string; status: string; fictionalData: boolean };
export type StubSummary = { rulesetEnabled: false; fictionalData: true; note: string; ancestries: StubAncestry[] };

type SlotData = {
  confirmedIds: string[];
  confirmedStrategy?: Strategy;
  confirmedTrace?: RollTrace;
  confirmedLabel?: string;
  previewIds?: string[];
  previewStrategy?: Strategy;
  previewTrace?: RollTrace;
  previewLabel?: string;
  locked: boolean;
  includeInGenerate: boolean;
  needsReviewReason?: string;
  suspendedReason?: string;
};

export type RoleField = 'bonds' | 'values' | 'secrets' | 'play';
export const ROLE_FIELDS: { id: RoleField; label: string }[] = [
  { id: 'bonds', label: 'Vínculos' },
  { id: 'values', label: 'Valores e motivações' },
  { id: 'secrets', label: 'Segredos' },
  { id: 'play', label: 'Notas de interpretação' },
];

export type WizardMode = 'manual' | 'hybrid' | 'all-random';

export type L0State = {
  mode: WizardMode;
  seed: string;
  allowUniform: boolean;
  allowTransfer: boolean;
  step: L0StepId;
  slots: Record<SlotKey, SlotData>;
  stubs: StubSummary;
  name: string;
  nameDraft: string;
  notes: string;
  notesDraft: string;
  nameSaved: boolean;
  role: Record<RoleField, { saved: string; draft: string }>;
  reviewConfirmed: boolean;
  sheetAnnounce: string;
};

export type L0Action =
  | { type: 'mode'; mode: WizardMode }
  | { type: 'seed'; seed: string }
  | { type: 'uniform'; value: boolean }
  | { type: 'transfer'; value: boolean }
  | { type: 'step'; step: L0StepId }
  | { type: 'select'; key: SlotKey; ids: string[] }
  | { type: 'roll'; key: SlotKey }
  | { type: 'reroll'; key: SlotKey }
  | { type: 'confirm'; key: SlotKey }
  | { type: 'discard'; key: SlotKey }
  | { type: 'lock'; key: SlotKey }
  | { type: 'generate-flag'; key: SlotKey }
  | { type: 'name-draft'; value: string }
  | { type: 'notes-draft'; value: string }
  | { type: 'save-name' }
  | { type: 'discard-name' }
  | { type: 'role-draft'; field: RoleField; value: string }
  | { type: 'save-role' }
  | { type: 'discard-role' }
  | { type: 'confirm-review' };

export type SlotView = {
  slotId: SlotKey;
  title: string;
  contextLine: string;
  strategy: Strategy;
  uiState: SlotUiState;
  options: ChoiceOption[];
  cardinality: { min: number; max: number };
  selectedIds: string[];
  preview?: { label: string; confirmed: false };
  confirmReason?: string;
  consequences?: { status: 'applied' | 'needs-review'; items: string[] };
  rollTrace?: RollTrace;
  locked: boolean;
  canReroll: boolean;
  sortReason?: string;
  includeInGenerate: boolean;
  step: L0StepId;
};

const REVIEW_COPY = 'A Ancestry mudou e esta escolha deixou de ser elegível.';

export function summarizeStubs(raw: unknown[]): StubSummary {
  const ancestries: StubAncestry[] = [];
  for (const item of Array.isArray(raw) ? raw : []) {
    if (!item || typeof item !== 'object') continue;
    const pack = item as Record<string, unknown>;
    const source = pack.source && typeof pack.source === 'object' ? pack.source as Record<string, unknown> : undefined;
    const title = typeof source?.title === 'string' ? source.title : '';
    if (!title || pack.fictionalData !== false) continue;
    const packId = typeof pack.packId === 'string' ? pack.packId : '';
    const publication = /only-human/i.test(packId) || /only human/i.test(title) ? 'Only Human' : 'Core';
    const entities = Array.isArray(pack.entities) ? pack.entities : [];
    const ancestry = entities.find(entry => entry && typeof entry === 'object' && (entry as { kind?: string }).kind === 'ancestry') as { status?: string } | undefined;
    const status = typeof ancestry?.status === 'string' ? ancestry.status : typeof source?.status === 'string' ? source.status : 'needs-review';
    ancestries.push({ publication, title, status, fictionalData: false });
  }
  return {
    rulesetEnabled: false,
    fictionalData: true,
    note: ancestries.length
      ? 'Stubs de ancestry lidos do checkout. Ruleset oficial desligado: needs-review e fictionalData false não habilitam geração.'
      : 'Nenhum stub oficial de content-packs neste checkout. Ruleset oficial desligado.',
    ancestries,
  };
}

function emptySlot(): SlotData {
  return { confirmedIds: [], locked: false, includeInGenerate: false };
}

export function createL0State(rawStubs: unknown[] = []): L0State {
  return {
    mode: 'manual',
    seed: '',
    allowUniform: false,
    allowTransfer: false,
    step: 'ruleset',
    slots: Object.fromEntries(SLOT_KEYS.map(key => [key, emptySlot()])) as Record<SlotKey, SlotData>,
    stubs: summarizeStubs(rawStubs),
    name: '',
    nameDraft: '',
    notes: '',
    notesDraft: '',
    nameSaved: false,
    role: {
      bonds: { saved: '', draft: '' },
      values: { saved: '', draft: '' },
      secrets: { saved: '', draft: '' },
      play: { saved: '', draft: '' },
    },
    reviewConfirmed: false,
    sheetAnnounce: 'Ficha ao vivo no nível 0. Nada confirmado ainda.',
  };
}

function rawId(state: L0State, key: SlotKey): string | undefined {
  return state.slots[key].confirmedIds[0];
}

/** Id confirmado que ainda vale. Revisão suspende o uso nas regras dependentes. */
function confirmedId(state: L0State, key: SlotKey): string | undefined {
  if (state.slots[key].needsReviewReason) return undefined;
  return rawId(state, key);
}

function ancestryOf(state: L0State): 'core' | 'only-human' | undefined {
  const id = rawId(state, 'ancestry');
  if (id === 'anc-core') return 'core';
  if (id === 'anc-oh') return 'only-human';
  return undefined;
}

function modeOf(state: L0State): 'mode-fixed' | 'mode-random' | undefined {
  const id = rawId(state, 'attribute-mode');
  return id === 'mode-fixed' || id === 'mode-random' ? id : undefined;
}

export function isShown(state: L0State, key: SlotKey): boolean {
  if (key === 'attribute-fixed') return modeOf(state) === 'mode-fixed';
  if (key === 'attribute-random') return modeOf(state) === 'mode-random';
  if (key === 'attribute-transfer') return modeOf(state) === 'mode-fixed' || modeOf(state) === 'mode-random';
  return true;
}

function dataGap(state: L0State, key: SlotKey): string | undefined {
  const ancestry = ancestryOf(state);
  if (key === 'narrative') return 'O adapter fictício não inclui tabelas de idade, porte, aparência, background ou personalidade. Nada foi inventado no lugar.';
  if (ancestry !== 'only-human') return undefined;
  if (key === 'benefit') return 'O mock não traz as Human Development Tables. O benefício deste recorte fica pendente, sem linhas inventadas.';
  if (key === 'profession') return 'Profissões deste recorte dependeriam das tabelas de desenvolvimento, ausentes no mock.';
  if (key === 'language') return 'Idiomas extras deste recorte dependeriam das tabelas de desenvolvimento, ausentes no mock.';
  if (key === 'wealth') return 'Este recorte não mistura o procedimento de Wealth. As tabelas de desenvolvimento não estão no mock.';
  if (key === 'kit') return 'O kit deste recorte seguiria as tabelas de desenvolvimento, ausentes no mock.';
  return undefined;
}

function blockedReason(state: L0State, key: SlotKey): string | undefined {
  const ancestry = ancestryOf(state);
  const benefit = confirmedId(state, 'benefit');
  if ((key === 'attribute-mode' || key === 'size' || key === 'benefit') && !ancestry) return 'Confirme Ancestry antes deste passo.';
  if ((key === 'profession' || key === 'language' || key === 'wealth' || key === 'kit') && !ancestry) return 'Confirme Ancestry antes deste passo.';
  if (key === 'attribute-random' && ancestry !== 'only-human') return 'O modo aleatório desta demonstração só existe no recorte Only Human.';
  if (key === 'attribute-transfer' && !state.allowTransfer) return 'Regra Transferir 1 ponto desligada no ruleset desta sessão.';
  if (key === 'profession' && ancestry === 'core' && !benefit) return 'Confirme o benefício Human antes da profissão.';
  if (key === 'language' && ancestry === 'core' && !benefit) return 'Confirme o benefício Human antes do idioma extra.';
  if (key === 'profession' && ancestry === 'core' && benefit === 'ben-lang') return 'O benefício confirmado foi um idioma extra, não um ofício.';
  if (key === 'language' && ancestry === 'core' && benefit === 'ben-job') return 'O benefício confirmado foi um ofício, não um idioma extra.';
  if ((key === 'attribute-fixed' || key === 'attribute-random' || key === 'attribute-transfer') && !modeOf(state)) return 'Confirme o modo de atributos antes desta escolha.';
  return undefined;
}

function baseAttributes(state: L0State): Record<Attr, number> | undefined {
  if (state.slots['attribute-mode'].needsReviewReason) return undefined;
  const mode = modeOf(state);
  if (!mode) return undefined;
  const attrs: Record<Attr, number> = { strength: 10, agility: 10, intellect: 10, will: 10 };
  if (mode === 'mode-fixed') {
    if (state.slots['attribute-fixed'].needsReviewReason) return undefined;
    const which = rawId(state, 'attribute-fixed')?.replace('attr-', '') as Attr | undefined;
    if (!which || !ATTRS.includes(which)) return undefined;
    attrs[which] = 11;
    return attrs;
  }
  if (state.slots['attribute-random'].needsReviewReason) return undefined;
  const trace = state.slots['attribute-random'].confirmedTrace;
  if (!trace || trace.faces.length !== 4) return undefined;
  ATTRS.forEach((key, index) => { attrs[key] = 8 + trace.faces[index]; });
  return attrs;
}

function transferOptions(state: L0State): ChoiceOption[] {
  const blocked = blockedReason(state, 'attribute-transfer');
  const base = baseAttributes(state);
  const none: ChoiceOption = { id: 'xfer-none', label: 'Sem transferência', eligible: !blocked, disabledReason: blocked };
  const pairs = ATTRS.flatMap(inc => ATTRS.filter(dec => dec !== inc).map(dec => {
    const scores = base ? { ...base, [inc]: base[inc] + 1, [dec]: base[dec] - 1 } : undefined;
    const inRange = scores ? ATTRS.every(key => scores[key] >= 1 && scores[key] <= 20) : false;
    const eligible = !blocked && inRange;
    const reason = blocked ?? (base ? 'O resultado sairia da faixa 1–20.' : 'Confirme os atributos antes da transferência.');
    return { id: `xfer-${inc}-${dec}`, label: `Aumentar ${ATTR_LABEL[inc]} e diminuir ${ATTR_LABEL[dec]}`, eligible, disabledReason: eligible ? undefined : reason };
  }));
  return [none, ...pairs];
}

export function optionsFor(state: L0State, key: SlotKey): ChoiceOption[] {
  const gap = dataGap(state, key);
  if (gap) return [{ id: `${key}-gap`, label: META[key].title, eligible: false, disabledReason: gap }];
  if (key === 'ancestry') {
    const playable: ChoiceOption[] = [
      { id: 'anc-core', label: 'Human — recorte Core (fictício)', eligible: true },
      { id: 'anc-oh', label: 'Human — recorte Only Human (fictício)', eligible: true },
    ];
    const blocked = state.stubs.ancestries.length
      ? state.stubs.ancestries.map(stub => ({
        id: `blocked-${stub.publication.replace(/\s+/g, '-').toLowerCase()}`,
        label: `Human — ${stub.title}`,
        eligible: false,
        disabledReason: `Status ${stub.status}. fictionalData false. Ruleset oficial desligado.`,
      }))
      : [
        { id: 'missing-core', label: 'Human (Core) — stub ausente', eligible: false, disabledReason: 'O checkout não tem o stub de content-packs. O ruleset oficial continua desligado.' },
        { id: 'missing-oh', label: 'Human (Only Human) — stub ausente', eligible: false, disabledReason: 'O checkout não tem o stub de content-packs. O ruleset oficial continua desligado.' },
      ];
    return [...playable, ...blocked];
  }
  if (key === 'attribute-mode') {
    const randomBlocked = ancestryOf(state) !== 'only-human';
    return applyBlock([
      { id: 'mode-fixed', label: 'Usar atributos fixos', eligible: true },
      { id: 'mode-random', label: 'Rolar atributos aleatórios', eligible: !randomBlocked, disabledReason: randomBlocked ? 'O modo aleatório desta demonstração só existe no recorte Only Human.' : undefined },
    ], blockedReason(state, key));
  }
  if (key === 'attribute-fixed') {
    return applyBlock(ATTRS.map(attr => ({ id: `attr-${attr}`, label: ATTR_LABEL[attr], eligible: true })), blockedReason(state, key));
  }
  if (key === 'attribute-random') {
    const slot = state.slots[key];
    const label = slot.previewLabel ?? slot.confirmedLabel;
    const blocked = blockedReason(state, key);
    if (label && !blocked) return [{ id: 'attr-rolled', label, eligible: true }];
    return [{ id: 'attr-rolled', label: 'Quatro faces demonstrativas', eligible: false, disabledReason: blocked ?? 'Não há lista manual. Use Sortear para rolar 1d3 em cada atributo.' }];
  }
  if (key === 'attribute-transfer') return transferOptions(state);
  if (key === 'size') {
    return applyBlock([
      { id: 'size-half', label: 'Size 1/2', eligible: true },
      { id: 'size-one', label: 'Size 1', eligible: true },
    ], blockedReason(state, key));
  }
  if (key === 'benefit') {
    return applyBlock([
      { id: 'ben-lang', label: 'Idioma adicional (rótulo fictício)', eligible: true },
      { id: 'ben-job', label: 'Ofício extra (rótulo fictício, sem tabela)', eligible: true },
    ], blockedReason(state, key));
  }
  if (key === 'profession') {
    return applyBlock([
      { id: 'prof-archive', label: 'Arquivista da ponte (fictício)', eligible: true },
      { id: 'prof-ledger', label: 'Guarda-livros do cais (fictício)', eligible: true },
      { id: 'prof-path', label: 'Ofício de path (fictício)', eligible: false, disabledReason: 'Paths começam fora deste stepper de nível 0.' },
    ], blockedReason(state, key));
  }
  if (key === 'language') {
    return applyBlock([
      { id: 'lang-mist', label: 'Língua da bruma (fictícia)', eligible: true },
      { id: 'lang-salt', label: 'Língua do sal (fictícia)', eligible: true },
      { id: 'lang-off', label: 'Língua de fonte desativada (fictícia)', eligible: false, disabledReason: 'Nenhuma fonte oficial está habilitada no ruleset.' },
    ], blockedReason(state, key));
  }
  if (key === 'wealth') {
    return applyBlock([
      { id: 'wealth-light', label: 'Bolso leve (fictício)', eligible: true },
      { id: 'wealth-steady', label: 'Bolso estável (fictício)', eligible: true },
      { id: 'wealth-wide', label: 'Bolso de tabela publicada', eligible: false, disabledReason: 'Este adapter não tem a faixa publicada de Wealth.' },
    ], blockedReason(state, key));
  }
  if (key === 'kit') {
    return applyBlock([
      { id: 'kit-walk', label: 'Kit do viajante (fictício)', eligible: true },
      { id: 'kit-archive', label: 'Kit do arquivo (fictício)', eligible: true },
      { id: 'kit-guard', label: 'Kit da guarda (fictício)', eligible: false, disabledReason: 'Requer path marcial, fora do nível 0.' },
    ], blockedReason(state, key));
  }
  return applyBlock([
    { id: 'thing-button', label: 'Um botão de vidro sem casa (fictício)', eligible: true },
    { id: 'thing-key', label: 'Uma chave que não abre a porta da forja (fictício)', eligible: true },
    { id: 'thing-receipt', label: 'Um recibo de uma estalagem que não existe (fictício)', eligible: true },
    { id: 'thing-official', label: 'Item de tabela publicada', eligible: false, disabledReason: 'Este adapter não tem tabela publicada de Interesting Things.' },
  ], blockedReason(state, key));
}

function applyBlock(options: ChoiceOption[], reason: string | undefined): ChoiceOption[] {
  if (!reason) return options;
  return options.map(option => option.eligible ? { ...option, eligible: false, disabledReason: reason } : option);
}

function cardinality(state: L0State, key: SlotKey): { min: number; max: number } {
  if (key === 'attribute-transfer' && !state.allowTransfer) return { min: 0, max: 0 };
  return { min: 1, max: 1 };
}

export function isRequired(state: L0State, key: SlotKey): boolean {
  const ancestry = ancestryOf(state);
  const benefit = confirmedId(state, 'benefit');
  if (key === 'ancestry' || key === 'attribute-mode' || key === 'size' || key === 'benefit' || key === 'interesting-thing') return true;
  if (key === 'attribute-fixed') return modeOf(state) === 'mode-fixed';
  if (key === 'attribute-random') return modeOf(state) === 'mode-random';
  if (key === 'profession') return ancestry === 'core' && benefit === 'ben-job';
  if (key === 'language') return ancestry === 'core' && benefit === 'ben-lang';
  if (key === 'wealth' || key === 'kit') return ancestry === 'core';
  return false;
}

function satisfied(state: L0State, key: SlotKey): boolean {
  const slot = state.slots[key];
  if (slot.needsReviewReason || slot.suspendedReason) return false;
  const card = cardinality(state, key);
  if (slot.confirmedIds.length < card.min || slot.confirmedIds.length > card.max) return false;
  const options = optionsFor(state, key);
  return slot.confirmedIds.every(id => options.some(option => option.id === id && option.eligible));
}

function pendingReason(state: L0State, key: SlotKey): string {
  const slot = state.slots[key];
  if (slot.needsReviewReason) return slot.needsReviewReason;
  if (slot.suspendedReason) return slot.suspendedReason;
  const gap = dataGap(state, key);
  if (gap) return gap;
  const blocked = blockedReason(state, key);
  if (blocked) return blocked;
  if (slot.locked && slot.confirmedIds.length < cardinality(state, key).min) return 'Travado sem escolha confirmada. Travar não sorteia.';
  return 'Escolha obrigatória ainda não confirmada.';
}

export function requiredPendencias(state: L0State): { step: L0StepId; title: string; reason: string }[] {
  const pending = SLOT_KEYS.filter(key => isRequired(state, key) && !satisfied(state, key)).map(key => ({
    step: META[key].step,
    title: META[key].title,
    reason: pendingReason(state, key),
  }));
  for (const key of SLOT_KEYS) {
    const reason = (isShown(state, key) ? confirmationBlockReason(state, key) : undefined) ?? state.slots[key].needsReviewReason;
    if (!reason || pending.some(item => item.title === META[key].title)) continue;
    pending.push({ step: META[key].step, title: META[key].title, reason });
  }
  return pending;
}

export function sortBlockReason(state: L0State, key: SlotKey): string | undefined {
  const slot = state.slots[key];
  if (slot.locked) return 'Slot travado. Destrave para sortear. Travar não executa rolagem.';
  if (slot.suspendedReason) return slot.suspendedReason;
  const gap = dataGap(state, key);
  if (gap) return gap;
  const blocked = blockedReason(state, key);
  if (blocked) return blocked;
  if (!state.seed.trim()) return 'Informe uma seed. Esta sessão não traz seed pronta.';
  if (key === 'attribute-random') return undefined;
  if (!optionsFor(state, key).some(option => option.eligible)) return 'Nenhuma opção elegível para sortear.';
  if (!state.allowUniform) return 'Sorteio uniforme entre opções válidas (não oficial) não está autorizado.';
  return undefined;
}

function hasResult(slot: SlotData): boolean {
  return Boolean(slot.previewIds?.length || slot.confirmedIds.length || slot.previewTrace || slot.confirmedTrace);
}

function viewStrategy(slot: SlotData): Strategy {
  return slot.previewStrategy ?? slot.confirmedStrategy ?? 'pending';
}

/** Recomputed from the current context; an old UI callback cannot approve an obsolete proposal. */
function confirmationBlockReason(state: L0State, key: SlotKey): string | undefined {
  const slot = state.slots[key];
  if (!slot.previewIds) return undefined;
  if (slot.suspendedReason) return slot.suspendedReason;
  if (!isShown(state, key)) return 'Esta prévia pertence a um modo de atributos que não está ativo.';
  const blocked = dataGap(state, key) ?? blockedReason(state, key);
  if (blocked) return blocked;
  const card = cardinality(state, key);
  if (slot.previewIds.length < card.min || slot.previewIds.length > card.max || new Set(slot.previewIds).size !== slot.previewIds.length)
    return 'A quantidade de escolhas desta prévia não é válida no contexto atual.';
  const options = optionsFor(state, key);
  if (slot.previewIds.some(id => !options.some(option => option.id === id && option.eligible)))
    return 'A prévia deixou de ser elegível. Descarte e prepare uma nova escolha.';
  return undefined;
}

function viewState(state: L0State, key: SlotKey): SlotUiState {
  const slot = state.slots[key];
  const card = cardinality(state, key);
  if (slot.suspendedReason) return 'suspended';
  if (confirmationBlockReason(state, key)) return 'needs-review';
  if (slot.needsReviewReason && !slot.previewIds?.length) return 'needs-review';
  if (slot.previewIds?.length) return 'preview';
  if (slot.confirmedIds.length > 0 && slot.confirmedIds.length < card.min) return 'partial';
  if (slot.locked) return 'locked';
  if (dataGap(state, key) || blockedReason(state, key)) return 'pending';
  if (slot.confirmedIds.length === 0) return 'empty';
  if (slot.confirmedIds.length < card.min) return 'partial';
  return 'confirmed';
}

export function viewSlot(state: L0State, key: SlotKey): SlotView {
  const slot = state.slots[key];
  const uiState = viewState(state, key);
  const selectedIds = slot.previewIds ?? slot.confirmedIds;
  const rollTrace = slot.previewTrace ?? slot.confirmedTrace;
  const items: string[] = [];
  const confirmReason = confirmationBlockReason(state, key);
  if (confirmReason) items.push(confirmReason);
  if (slot.needsReviewReason) items.push(slot.needsReviewReason);
  if (key === 'ancestry' && slot.confirmedIds.length && !slot.needsReviewReason) items.push('Variante fictícia registrada. Packs oficiais não foram habilitados.');
  if ((key === 'attribute-fixed' || key === 'attribute-random' || key === 'attribute-transfer') && slot.confirmedIds.length) items.push('Health, Defense e Speed continuam indisponíveis nesta ficha.');
  const consequences = items.length ? { status: slot.needsReviewReason || confirmReason ? 'needs-review' as const : 'applied' as const, items } : undefined;
  return {
    slotId: key,
    title: META[key].title,
    contextLine: META[key].context,
    strategy: viewStrategy(slot),
    uiState,
    options: optionsFor(state, key),
    cardinality: cardinality(state, key),
    selectedIds,
    preview: slot.previewLabel ? { label: slot.previewLabel, confirmed: false } : undefined,
    confirmReason,
    consequences,
    rollTrace,
    locked: slot.locked,
    canReroll: hasResult(slot) && !sortBlockReason(state, key),
    sortReason: sortBlockReason(state, key),
    includeInGenerate: slot.includeInGenerate,
    step: META[key].step,
  };
}

export function slotsOnStep(state: L0State, step: L0StepId): SlotView[] {
  return SLOT_KEYS.filter(key => META[key].step === step && isShown(state, key)).map(key => viewSlot(state, key));
}

export function stepStateLabel(state: L0State, step: L0StepId): string {
  if (step === 'ruleset') return 'resumo';
  if (step === 'roleplaying') return ROLE_FIELDS.some(field => state.role[field.id].saved.trim()) ? 'confirmado' : 'opcional';
  if (step === 'name') return state.nameSaved ? 'confirmado' : 'opcional';
  if (step === 'review') return requiredPendencias(state).length ? 'pendente' : state.reviewConfirmed ? 'confirmado' : 'pronto';
  const keys = SLOT_KEYS.filter(key => META[key].step === step && isShown(state, key));
  const views = keys.map(key => viewSlot(state, key));
  if (views.some(view => view.uiState === 'suspended')) return 'suspenso';
  if (views.some(view => view.uiState === 'needs-review')) return 'requer revisão';
  if (views.some(view => view.uiState === 'preview')) return 'prévia';
  if (views.some(view => view.uiState === 'partial')) return 'parcial';
  const required = keys.filter(key => isRequired(state, key));
  if (required.length && required.every(key => satisfied(state, key))) return views.some(view => view.locked) ? 'travado' : 'confirmado';
  if (views.some(view => view.uiState === 'pending')) return 'pendente';
  if (views.some(view => view.locked)) return 'travado';
  return 'vazio';
}

export function confirmedStats(state: L0State): Partial<Stats> {
  const attrs = baseAttributes(state);
  if (!attrs) return {};
  const transfer = state.slots['attribute-transfer'];
  if (state.allowTransfer && !transfer.needsReviewReason && transfer.confirmedIds[0] && transfer.confirmedIds[0] !== 'xfer-none') {
    const match = /^xfer-(strength|agility|intellect|will)-(strength|agility|intellect|will)$/.exec(transfer.confirmedIds[0]);
    if (match) {
      const inc = match[1] as Attr;
      const dec = match[2] as Attr;
      if (inc !== dec) {
        attrs[inc] += 1;
        attrs[dec] -= 1;
      }
    }
  }
  if (ATTRS.some(key => attrs[key] < 1 || attrs[key] > 20)) return {};
  return { strength: attrs.strength, agility: attrs.agility, intellect: attrs.intellect, will: attrs.will };
}

export function confirmedChoiceLines(state: L0State): string[] {
  const lines: string[] = [];
  for (const key of SLOT_KEYS) {
    const slot = state.slots[key];
    if (slot.needsReviewReason) {
      lines.push(`${META[key].title}: requer revisão`);
      continue;
    }
    if (!slot.confirmedLabel) continue;
    lines.push(`${META[key].title}: ${slot.confirmedLabel}`);
  }
  if (state.name) lines.push(`Nome: ${state.name}`);
  for (const field of ROLE_FIELDS) {
    if (state.role[field.id].saved.trim()) lines.push(`${field.label}: ${state.role[field.id].saved.trim()}`);
  }
  return lines;
}

function clone(state: L0State): L0State {
  const slots = Object.fromEntries(SLOT_KEYS.map(key => [key, { ...state.slots[key] }])) as Record<SlotKey, SlotData>;
  const role = Object.fromEntries(ROLE_FIELDS.map(field => [field.id, { ...state.role[field.id] }])) as L0State['role'];
  return { ...state, slots, role };
}

function labelsFor(state: L0State, key: SlotKey, ids: string[]): string {
  const options = optionsFor(state, key);
  return ids.map(id => options.find(option => option.id === id)?.label ?? 'opção sem rótulo').join(', ');
}

function nextReroll(slot: SlotData): number {
  const current = slot.previewTrace?.rerollIndex ?? slot.confirmedTrace?.rerollIndex;
  return current === undefined ? 0 : current + 1;
}

function setPreview(state: L0State, key: SlotKey, ids: string[], label: string, strategy: Strategy, trace?: RollTrace) {
  const slot = state.slots[key];
  slot.previewIds = ids;
  slot.previewLabel = label;
  slot.previewStrategy = strategy;
  slot.previewTrace = trace;
  state.reviewConfirmed = false;
}

function reconcile(state: L0State, keys: SlotKey[]) {
  for (const key of keys) {
    const slot = state.slots[key];
    if (!slot.confirmedIds.length) continue;
    const options = optionsFor(state, key);
    const ok = slot.confirmedIds.every(id => options.some(option => option.id === id && option.eligible));
    if (!ok) slot.needsReviewReason = REVIEW_COPY;
    else if (slot.needsReviewReason === REVIEW_COPY) slot.needsReviewReason = undefined;
  }
}

function announceStats(state: L0State): string {
  const stats = confirmedStats(state);
  if (stats.strength === undefined) return 'Ficha atualizada. Strength, Agility, Intellect e Will seguem indisponíveis até os atributos ficarem confirmados.';
  return `Ficha atualizada. Strength ${stats.strength}, Agility ${stats.agility}, Intellect ${stats.intellect}, Will ${stats.will}.`;
}

export function reduceL0(state: L0State, action: L0Action): L0State {
  if (action.type === 'mode') return { ...state, mode: action.mode };
  if (action.type === 'seed') return { ...state, seed: action.seed.slice(0, 200) };
  if (action.type === 'uniform') return { ...state, allowUniform: action.value };
  if (action.type === 'step') return L0_STEPS.some(step => step.id === action.step) ? { ...state, step: action.step } : state;
  if (action.type === 'transfer') {
    const next = clone(state);
    next.allowTransfer = action.value;
    if (!action.value && next.slots['attribute-transfer'].confirmedIds[0] && next.slots['attribute-transfer'].confirmedIds[0] !== 'xfer-none') {
      next.slots['attribute-transfer'].needsReviewReason = 'A regra Transferir 1 ponto foi desligada. A transferência deixou de valer na ficha.';
    }
    if (action.value && next.slots['attribute-transfer'].needsReviewReason?.includes('desligada')) {
      next.slots['attribute-transfer'].needsReviewReason = undefined;
    }
    next.sheetAnnounce = announceStats(next);
    return next;
  }
  if (action.type === 'name-draft') return { ...state, nameDraft: action.value.slice(0, 200) };
  if (action.type === 'notes-draft') return { ...state, notesDraft: action.value.slice(0, 10000) };
  if (action.type === 'save-name') return { ...state, name: state.nameDraft, notes: state.notesDraft, nameSaved: true, sheetAnnounce: 'Ficha atualizada: nome e notas salvos.' };
  if (action.type === 'discard-name') return { ...state, nameDraft: state.name, notesDraft: state.notes };
  if (action.type === 'role-draft') {
    const next = clone(state);
    next.role[action.field].draft = action.value.slice(0, 2000);
    return next;
  }
  if (action.type === 'save-role') {
    const next = clone(state);
    for (const field of ROLE_FIELDS) next.role[field.id].saved = next.role[field.id].draft;
    next.sheetAnnounce = 'Ficha atualizada: Roleplaying salvo.';
    return next;
  }
  if (action.type === 'discard-role') {
    const next = clone(state);
    for (const field of ROLE_FIELDS) next.role[field.id].draft = next.role[field.id].saved;
    return next;
  }
  if (action.type === 'confirm-review') {
    if (requiredPendencias(state).length) return state;
    return { ...state, reviewConfirmed: true, sheetAnnounce: 'Revisão L0 confirmada. Nível-alvo permanece 0.' };
  }
  if (action.type === 'lock') {
    const next = clone(state);
    next.slots[action.key].locked = !next.slots[action.key].locked;
    return next;
  }
  if (action.type === 'generate-flag') {
    const next = clone(state);
    next.slots[action.key].includeInGenerate = !next.slots[action.key].includeInGenerate;
    return next;
  }
  if (action.type === 'discard') {
    const next = clone(state);
    const slot = next.slots[action.key];
    slot.previewIds = undefined;
    slot.previewLabel = undefined;
    slot.previewStrategy = undefined;
    slot.previewTrace = undefined;
    return next;
  }
  if (action.type === 'confirm') {
    const current = state.slots[action.key];
    if (!current.previewIds?.length || confirmationBlockReason(state, action.key)) return state;
    const next = clone(state);
    const slot = next.slots[action.key];
    slot.confirmedIds = [...(current.previewIds ?? [])];
    slot.confirmedStrategy = current.previewStrategy ?? 'manual';
    slot.confirmedTrace = current.previewTrace;
    slot.confirmedLabel = current.previewLabel;
    slot.previewIds = undefined;
    slot.previewLabel = undefined;
    slot.previewStrategy = undefined;
    slot.previewTrace = undefined;
    slot.needsReviewReason = undefined;
    next.reviewConfirmed = false;
    if (action.key === 'ancestry') reconcile(next, ['attribute-mode', 'attribute-fixed', 'attribute-random', 'attribute-transfer', 'benefit', 'profession', 'language', 'wealth', 'kit']);
    if (action.key === 'benefit') reconcile(next, ['profession', 'language']);
    if (action.key === 'attribute-mode') reconcile(next, ['attribute-fixed', 'attribute-random', 'attribute-transfer']);
    const statsKeys: SlotKey[] = ['attribute-mode', 'attribute-fixed', 'attribute-random', 'attribute-transfer'];
    next.sheetAnnounce = statsKeys.includes(action.key) ? announceStats(next) : `Ficha atualizada: ${META[action.key].title} confirmado.`;
    return next;
  }
  if (action.type === 'select') {
    if (state.slots[action.key].locked || dataGap(state, action.key)) return state;
    const options = optionsFor(state, action.key).filter(option => option.eligible);
    const card = cardinality(state, action.key);
    if (action.ids.length < card.min || action.ids.length > card.max) return state;
    if (!action.ids.every(id => options.some(option => option.id === id))) return state;
    const next = clone(state);
    setPreview(next, action.key, action.ids, labelsFor(state, action.key, action.ids), 'manual');
    return next;
  }
  if (action.type === 'roll' || action.type === 'reroll') {
    if (sortBlockReason(state, action.key)) return state;
    if (action.type === 'reroll' && !hasResult(state.slots[action.key])) return state;
    const rerollIndex = nextReroll(state.slots[action.key]);
    const rng = createSubstream(state.seed.trim(), action.key, rerollIndex);
    const next = clone(state);
    if (action.key === 'attribute-random') {
      const faces = [rng.int(3) + 1, rng.int(3) + 1, rng.int(3) + 1, rng.int(3) + 1];
      const label = `Strength ${8 + faces[0]}, Agility ${8 + faces[1]}, Intellect ${8 + faces[2]}, Will ${8 + faces[3]}`;
      setPreview(next, action.key, ['attr-rolled'], label, 'uniform-eligible-unofficial', {
        expression: '4×1d3',
        faces,
        total: faces.reduce((sum, face) => sum + face, 0),
        table: 'rolagem demonstrativa de atributos (não é tabela publicada)',
        source: 'adapter demonstrativo · fictionalData true',
        seed: state.seed.trim(),
        rerollIndex,
      });
      return next;
    }
    const eligible = optionsFor(state, action.key).filter(option => option.eligible);
    const index = rng.int(eligible.length);
    const pick = eligible[index];
    setPreview(next, action.key, [pick.id], pick.label, 'uniform-eligible-unofficial', {
      expression: `1d${eligible.length}`,
      faces: [index + 1],
      total: index + 1,
      table: 'lista fictícia do adapter (não oficial)',
      source: 'adapter demonstrativo · fictionalData true',
      seed: state.seed.trim(),
      rerollIndex,
    });
    return next;
  }
  return state;
}
