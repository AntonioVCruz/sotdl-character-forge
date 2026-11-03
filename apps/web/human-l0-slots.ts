import type { HumanL0Selection } from '../../packages/curation/human-l0-mechanics';
import type { ChoiceOption, RollTrace, SlotUiState, Strategy } from './choice-slot';
import {
  buildFixtureSelection,
  confirmedHumanL0Selection,
  coreBenefitRequired,
  defaultFixtureSelectionInput,
  describeFixtureCatalog,
  FIXTURE_EXTRA_LANGUAGE_ID,
  FIXTURE_PROFESSION_EVENT_ID,
  humanL0Block,
  previewHumanL0,
  rollBlocks,
  type FixtureAncestryOption,
  type FixtureProcedureOption,
  type HumanAttribute,
  type HumanL0Block,
  type HumanL0Character,
  type HumanL0Preview,
  type HumanL0Refusal,
} from './human-l0-preview';

const ATTRIBUTES: HumanAttribute[] = ['strength', 'agility', 'intellect', 'will'];
const ATTRIBUTE_LABEL: Record<HumanAttribute, string> = {
  strength: 'Strength', agility: 'Agility', intellect: 'Intellect', will: 'Will',
};
const PENDING_COPY = 'Aguarda #34/#35. Esta fatia não inventa opções.';
const LOCK_REASON = 'Slot travado. Destrave para alterar. Travar não sorteia.';

export const HUMAN_L0_STEPS = [
  { id: 'source', title: 'Ruleset e fonte' },
  { id: 'ancestry', title: 'Ancestry e Size' },
  { id: 'attributes', title: 'Atributos' },
  { id: 'procedure', title: 'Procedimento' },
  { id: 'reserved', title: 'Passos reservados' },
  { id: 'identity', title: 'Nome' },
  { id: 'advanced', title: 'Avançado' },
  { id: 'review', title: 'Revisão' },
] as const;
export type HumanL0StepId = (typeof HUMAN_L0_STEPS)[number]['id'];

export type HumanL0SlotView = {
  slotId: string;
  step: HumanL0StepId;
  level: 0;
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
};

export type HumanL0ProjectionInput = {
  baseline: HumanL0Character | null;
  preview: HumanL0Preview | null;
  previewSlotId: string | null;
  refusal: { slotId: string; blocks: HumanL0Block[] } | null;
  locks: readonly string[];
  seed: string;
};

type Catalog = ReturnType<typeof describeFixtureCatalog>;

function option(id: string, label: string, eligible: boolean, disabledReason?: string): ChoiceOption {
  return eligible ? { id, label, eligible } : { id, label, eligible, disabledReason: disabledReason ?? 'Indisponível, sem motivo informado.' };
}

function pendingSlot(slotId: string, title: string): HumanL0SlotView {
  return {
    slotId, step: 'reserved', level: 0, title, contextLine: PENDING_COPY, strategy: 'pending', uiState: 'pending',
    options: [], cardinality: { min: 0, max: 0 }, selectedIds: [], locked: false, canReroll: false,
    sortReason: PENDING_COPY,
  };
}

function baseSelection(packs: unknown, baseline: HumanL0Character | null): HumanL0Selection | null {
  if (baseline) return confirmedHumanL0Selection(baseline);
  const built = buildFixtureSelection(packs, defaultFixtureSelectionInput());
  return built.ok ? built.selection : null;
}

function ancestryOf(catalog: Catalog, selection: HumanL0Selection | null): FixtureAncestryOption | undefined {
  return catalog.ancestries.find(item => item.packId === selection?.ancestry.packId);
}

function procedureOf(catalog: Catalog, selection: HumanL0Selection | null): FixtureProcedureOption | undefined {
  return catalog.procedures.find(item => item.packId === selection?.procedure.ref.packId);
}

function benefitNeeded(catalog: Catalog, selection: HumanL0Selection | null): boolean {
  const ancestry = ancestryOf(catalog, selection);
  const procedure = procedureOf(catalog, selection);
  return !!ancestry && !!procedure && coreBenefitRequired(ancestry.variant, procedure.kind);
}

function normalizeBenefit(selection: HumanL0Selection, catalog: Catalog): boolean {
  const needed = benefitNeeded(catalog, selection);
  if (!needed) {
    const changed = selection.coreBenefit !== null;
    selection.coreBenefit = null;
    return changed;
  }
  if (selection.coreBenefit) return false;
  selection.coreBenefit = { kind: 'speak-language', languageId: FIXTURE_EXTRA_LANGUAGE_ID };
  return true;
}

function rollTraceFor(selection: HumanL0Selection, ancestry: FixtureAncestryOption | undefined, rerollIndex: number): RollTrace | undefined {
  if (selection.attributes.mode !== 'random' || !ancestry?.diceSides) return undefined;
  const faces = ATTRIBUTES.map(attribute => selection.attributes.mode === 'random' ? selection.attributes.rolls.find(roll => roll.attribute === attribute)?.face ?? 0 : 0);
  if (faces.some(face => face < 1)) return undefined;
  return {
    expression: `4×1d${ancestry.diceSides}`,
    faces,
    total: faces.reduce((sum, face) => sum + face, 0),
    source: `${ancestry.packId}@${ancestry.version}`,
    seed: selection.attributes.mode === 'random' ? selection.attributes.seed : undefined,
    rerollIndex,
  };
}

function selectionSlots(selection: HumanL0Selection | null, catalog: Catalog, rerollIndex: number): HumanL0SlotView[] {
  const ancestry = ancestryOf(catalog, selection);
  const procedure = procedureOf(catalog, selection);
  const random = selection?.attributes.mode === 'random';
  const trace = selection ? rollTraceFor(selection, ancestry, rerollIndex) : undefined;
  const sourceSelected = selection ? ['fixture'] : [];
  const slots: HumanL0SlotView[] = [
    {
      slotId: 'source', step: 'source', level: 0, title: 'Fonte da entrada', strategy: 'manual',
      contextLine: 'Fixture pública, fictionalData true. O modo da ficha é local-preview. Ruleset oficial fora desta entrada.',
      uiState: sourceSelected.length ? 'confirmed' : 'empty',
      options: [
        option('fixture', 'Fixture sintética pública', true),
        option('official', 'Ruleset habilitado', false, 'Geração oficial permanece desligada. A #37 é quem pode tratar habilitação.'),
      ],
      cardinality: { min: 1, max: 1 }, selectedIds: sourceSelected, locked: false, canReroll: false,
      sortReason: 'Esta entrada não sorteia a fonte.',
    },
    {
      slotId: 'ancestry', step: 'ancestry', level: 0, title: 'Ancestry', strategy: 'manual',
      contextLine: 'Rótulos da fixture. Não é texto de livro.',
      uiState: selection ? 'confirmed' : 'empty',
      options: catalog.ancestries.map(item => option(item.packId, `${item.title} · ${item.variant} · fixture`, true)),
      cardinality: { min: 1, max: 1 }, selectedIds: selection ? [selection.ancestry.packId] : [], locked: false, canReroll: false,
      sortReason: 'Ancestry desta entrada é escolha, não sorteio.',
    },
    {
      slotId: 'size', step: 'ancestry', level: 0, title: 'Size', strategy: 'manual',
      contextLine: 'Opções numéricas do pack da fixture. O componente não converte Size.',
      uiState: selection ? 'confirmed' : 'empty',
      options: (ancestry?.sizes ?? []).map(size => option(`size:${size}`, String(size), true)),
      cardinality: { min: 1, max: 1 }, selectedIds: selection ? [`size:${selection.size}`] : [], locked: false, canReroll: false,
      sortReason: ancestry ? 'Size desta entrada é escolha, não sorteio.' : 'Escolha a ancestry antes do Size.',
    },
    {
      slotId: 'attribute-mode', step: 'attributes', level: 0, title: 'Modo de atributos', strategy: 'manual',
      contextLine: 'Fixo é seleção. Aleatório só entra por roll-attributes e uma seed.',
      uiState: selection ? 'confirmed' : 'empty',
      options: [
        option('fixed', 'Modo fixo', true),
        option('random', 'Modo aleatório (comando roll-attributes)', !!ancestry?.randomAvailable, ancestry?.randomAvailable ? undefined : 'Este ancestry da fixture não oferece modo aleatório.'),
      ],
      cardinality: { min: 1, max: 1 }, selectedIds: selection ? [selection.attributes.mode] : [], locked: false, canReroll: false,
      sortReason: 'O modo não se sorteia neste slot. Use Sortear no slot de atributos aleatórios.',
    },
    {
      slotId: 'attribute-increase', step: 'attributes', level: 0, title: 'Aumento do modo fixo', strategy: 'manual',
      contextLine: random ? 'O modo aleatório não usa aumento fixo.' : 'Um atributo recebe o aumento declarado no pack da fixture.',
      uiState: !selection ? 'empty' : random ? 'suspended' : 'confirmed',
      options: ATTRIBUTES.map(attribute => option(attribute, ATTRIBUTE_LABEL[attribute], !random, random ? 'O aumento fixo não se aplica enquanto o modo é aleatório.' : undefined)),
      cardinality: { min: 1, max: 1 },
      selectedIds: selection?.attributes.mode === 'fixed' ? [selection.attributes.increase] : [],
      locked: false, canReroll: false,
      sortReason: 'O aumento fixo não se sorteia.',
    },
    {
      slotId: 'attribute-roll', step: 'attributes', level: 0, title: 'Atributos aleatórios', strategy: 'manual',
      contextLine: 'Sortear chama roll-attributes. Não é tabela publicada nem o sorteio do wizard demo.',
      uiState: trace ? 'confirmed' : 'empty',
      options: trace ? [option('recorded-roll', `Faces registradas: ${trace.faces.join(', ')}`, true)] : [],
      cardinality: { min: 1, max: 1 }, selectedIds: trace ? ['recorded-roll'] : [], rollTrace: trace,
      locked: false, canReroll: !!trace, sortReason: undefined,
    },
    {
      slotId: 'adjustment', step: 'attributes', level: 0, title: 'Transferência opcional', strategy: 'manual',
      contextLine: 'Opcional. O valor do ajuste vem do pack da fixture; a tela só escolhe os atributos.',
      uiState: selection ? 'confirmed' : 'empty',
      options: [
        option('none', 'Sem transferência', true),
        ...ATTRIBUTES.flatMap(increase => ATTRIBUTES.filter(decrease => decrease !== increase).map(decrease => option(
          `${increase}>${decrease}`,
          `Aumentar ${ATTRIBUTE_LABEL[increase]} e diminuir ${ATTRIBUTE_LABEL[decrease]}`,
          true,
        ))),
      ],
      cardinality: { min: 1, max: 1 },
      selectedIds: !selection ? [] : selection.adjustment ? [`${selection.adjustment.increase}>${selection.adjustment.decrease}`] : ['none'],
      locked: false, canReroll: false, sortReason: 'A transferência não se sorteia.',
    },
    {
      slotId: 'procedure', step: 'procedure', level: 0, title: 'Procedimento', strategy: 'manual',
      contextLine: 'Core ou human-development, conforme a fixture. Sem orquestração da #35.',
      uiState: selection ? 'confirmed' : 'empty',
      options: catalog.procedures.map(item => option(item.packId, `${item.title} · ${item.kind} · fixture`, true)),
      cardinality: { min: 1, max: 1 }, selectedIds: selection ? [selection.procedure.ref.packId] : [], locked: false, canReroll: false,
      sortReason: 'O procedimento desta entrada é escolha, não sorteio.',
    },
    {
      slotId: 'core-benefit', step: 'procedure', level: 0, title: 'Benefício do par Core', strategy: 'manual',
      contextLine: benefitNeeded(catalog, selection) ? 'O par exige um benefício. random-profession fica como direito pendente, sem profissão gerada.' : 'Inelegível neste par. A prévia envia benefício vazio.',
      uiState: !selection || !benefitNeeded(catalog, selection) ? 'empty' : selection.coreBenefit ? 'confirmed' : 'empty',
      options: [
        option('speak-language', `Fala adicional da fixture (${FIXTURE_EXTRA_LANGUAGE_ID})`, benefitNeeded(catalog, selection), 'O benefício só é elegível no par Core com procedimento Core da fixture.'),
        option('random-profession', 'Direito de profissão aleatória — resultado pendente', benefitNeeded(catalog, selection), 'O benefício só é elegível no par Core com procedimento Core da fixture.'),
      ],
      cardinality: { min: 1, max: 1 },
      selectedIds: selection?.coreBenefit ? [selection.coreBenefit.kind] : [],
      locked: false, canReroll: false, sortReason: 'O benefício não se sorteia. A profissão aleatória permanece pendente.',
    },
  ];
  return slots;
}

function proposedSelection(packs: unknown, baseline: HumanL0Character | null, slotId: string, ids: string[]): HumanL0Selection | HumanL0Refusal {
  if (ids.length !== 1) return { ok: false, blocks: [humanL0Block('selection-schema-invalid')] };
  const catalog = describeFixtureCatalog(packs);
  if (catalog.surface.blocks.length) return { ok: false, blocks: catalog.surface.blocks };
  const current = baseSelection(packs, baseline);
  if (!current) return { ok: false, blocks: [humanL0Block('selection-reference-missing')] };
  const id = ids[0];
  if (slotId === 'source' && id === 'official') return { ok: false, blocks: [humanL0Block('official-generation-disabled')] };
  if (slotId === 'attribute-mode' && id === 'random') return { ok: false, blocks: [humanL0Block('use-roll-attributes')] };
  if (slotId === 'attribute-roll') return { ok: false, blocks: [humanL0Block('use-roll-attributes')] };
  if (slotId === 'attribute-increase' && current.attributes.mode === 'random') return { ok: false, blocks: [humanL0Block('fixed-increase-unavailable')] };
  const next = structuredClone(current);
  if (slotId === 'ancestry') {
    const ancestry = catalog.ancestries.find(item => item.packId === id);
    if (!ancestry) return { ok: false, blocks: [humanL0Block('selection-reference-missing')] };
    next.ancestry = { packId: ancestry.packId, version: ancestry.version, entityId: ancestry.entityId };
    if (!ancestry.sizes.includes(next.size)) next.size = ancestry.sizes[0];
    if (next.attributes.mode === 'random' && !ancestry.randomAvailable) next.attributes = { mode: 'fixed', increase: 'strength' };
  } else if (slotId === 'size') {
    next.size = Number(id.slice('size:'.length));
  } else if (slotId === 'attribute-mode' && id === 'fixed') {
    next.attributes = { mode: 'fixed', increase: current.attributes.mode === 'fixed' ? current.attributes.increase : 'strength' };
  } else if (slotId === 'attribute-increase' && (ATTRIBUTES as readonly string[]).includes(id)) {
    next.attributes = { mode: 'fixed', increase: id as HumanAttribute };
  } else if (slotId === 'adjustment' && id === 'none') {
    next.adjustment = null;
  } else if (slotId === 'adjustment' && id?.includes('>')) {
    const [increase, decrease] = id.split('>') as [HumanAttribute, HumanAttribute];
    next.adjustment = { increase, decrease };
  } else if (slotId === 'procedure') {
    const procedure = catalog.procedures.find(item => item.packId === id);
    if (!procedure) return { ok: false, blocks: [humanL0Block('selection-reference-missing')] };
    next.procedure = { ref: { packId: procedure.packId, version: procedure.version, entityId: procedure.entityId }, kind: procedure.kind };
  } else if (slotId === 'core-benefit' && id === 'speak-language') {
    next.coreBenefit = { kind: 'speak-language', languageId: FIXTURE_EXTRA_LANGUAGE_ID };
  } else if (slotId === 'core-benefit' && id === 'random-profession') {
    next.coreBenefit = { kind: 'random-profession', rollEventId: FIXTURE_PROFESSION_EVENT_ID };
  } else if (slotId !== 'source') {
    return { ok: false, blocks: [humanL0Block('awaiting-later-issue')] };
  }
  normalizeBenefit(next, catalog);
  if (baseline && JSON.stringify(next) === JSON.stringify(current)) return { ok: false, blocks: [humanL0Block('selection-unchanged')] };
  if (next.attributes.mode === 'random') return next;
  const parsed = buildFixtureSelection(packs, {
    ancestryPackId: next.ancestry.packId,
    procedurePackId: next.procedure.ref.packId,
    increase: next.attributes.increase,
    size: next.size,
    adjustment: next.adjustment,
    benefit: next.coreBenefit,
  });
  if (!parsed.ok) return parsed;
  return parsed.selection;
}

export async function proposeHumanL0Slot(baseline: HumanL0Character | null, packs: unknown, slotId: string, ids: string[], name: string): Promise<HumanL0Preview | HumanL0Refusal> {
  const proposed = proposedSelection(packs, baseline, slotId, ids);
  if ('ok' in proposed) return proposed;
  const intent = baseline
    ? { type: 'select' as const, selection: proposed }
    : { type: 'create' as const, selection: proposed, name };
  const preview = await previewHumanL0(baseline, packs, intent);
  if (!preview.ok) return preview;
  return preview;
}

export function benefitWasAdded(baseline: HumanL0Character | null, preview: HumanL0Preview): boolean {
  if (preview.intent.type !== 'select' && preview.intent.type !== 'create') return false;
  const before = baseline ? confirmedHumanL0Selection(baseline) : null;
  return !before?.coreBenefit && !!preview.intent.selection.coreBenefit;
}

export function projectHumanL0Slots(packs: unknown, input: HumanL0ProjectionInput): HumanL0SlotView[] {
  const catalog = describeFixtureCatalog(packs);
  const selection = input.baseline ? confirmedHumanL0Selection(input.baseline) : null;
  const rerolls = input.baseline?.events.filter(event => (event.type === 'create' || event.type === 'select') && event.rolled).length ?? 0;
  const slots = [
    ...selectionSlots(selection, catalog, Math.max(0, rerolls - 1)),
    pendingSlot('professions', 'Profissões'),
    pendingSlot('languages', 'Idiomas além da fala'),
    pendingSlot('wealth', 'Wealth'),
    pendingSlot('kit', 'Kit inicial'),
    pendingSlot('interesting-thing', 'Interesting Thing'),
    pendingSlot('equipment', 'Equipamento'),
  ];
  return slots.map(slot => decorate(slot, input, catalog, packs));
}

function decorate(slot: HumanL0SlotView, input: HumanL0ProjectionInput, catalog: Catalog, packs: unknown): HumanL0SlotView {
  let next = { ...slot };
  const locked = input.locks.includes(slot.slotId);
  if (input.refusal?.slotId === slot.slotId) {
    const reason = input.refusal.blocks[0]?.message ?? 'A prévia foi recusada.';
    next = { ...next, uiState: 'needs-review', confirmReason: reason, preview: { label: reason, confirmed: false } };
  }
  if (input.preview && input.previewSlotId === slot.slotId && (input.preview.intent.type === 'select' || input.preview.intent.type === 'create' || input.preview.intent.type === 'roll-attributes')) {
    const previewSelection = confirmedHumanL0Selection(input.preview.character);
    const previewRerolls = input.preview.character.events.filter(event => (event.type === 'create' || event.type === 'select') && event.rolled).length;
    const replacement = previewSelection ? selectionSlots(previewSelection, catalog, Math.max(0, previewRerolls - 1)).find(item => item.slotId === slot.slotId) : undefined;
    const label = replacement?.options.find(option => replacement.selectedIds.includes(option.id))?.label ?? replacement?.title ?? slot.title;
    const benefitNote = benefitWasAdded(input.baseline, input.preview);
    next = {
      ...(replacement ?? next),
      uiState: 'preview',
      preview: { label, confirmed: false },
      confirmReason: locked ? LOCK_REASON : undefined,
      consequences: benefitNote ? { status: 'needs-review', items: ['O par exige benefício. A prévia inclui a fala adicional da fixture até você trocar.'] } : replacement?.consequences,
    };
  }
  if (slot.slotId === 'attribute-roll') {
    const blocks = rollSortReason(input, packs);
    next = { ...next, sortReason: blocks, canReroll: !blocks && next.selectedIds.length > 0 && !locked };
  }
  if (locked && next.uiState === 'confirmed') next = { ...next, uiState: 'locked', locked: true };
  else next = { ...next, locked };
  if (next.uiState === 'empty') next = { ...next, selectedIds: [], preview: undefined };
  return next;
}

function rollSortReason(input: HumanL0ProjectionInput, packs: unknown): string | undefined {
  const [block] = rollBlocks(input.baseline, packs, input.seed);
  return block?.message;
}

export function humanL0StepLabel(slots: readonly HumanL0SlotView[], step: HumanL0StepId): string {
  const mine = slots.filter(slot => slot.step === step);
  if (!mine.length) return step === 'reserved' ? 'reservado' : 'opcional';
  if (mine.some(slot => slot.uiState === 'preview' || slot.uiState === 'needs-review')) return 'prévia';
  if (mine.every(slot => slot.uiState === 'pending')) return 'reservado';
  if (mine.some(slot => slot.uiState === 'empty' || slot.uiState === 'suspended')) return 'pendente';
  return 'confirmado';
}
