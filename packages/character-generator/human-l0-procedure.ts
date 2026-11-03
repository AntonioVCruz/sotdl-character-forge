import { z } from 'zod';
import {
  HUMAN_L0_CONSUMABLE_PENDING_REASONS, MANUAL_RESOLUTION_SLOTS,
} from '../curation/human-l0-consumable';

/**
 * Planning stub for Human L0 procedure orchestration (#35).
 * It publishes step order, cardinality and UI pendencies. It does not roll,
 * resolve tables, apply grants or enable a ruleset.
 */
export const HUMAN_L0_PROCEDURE_CONTRACT = 'sotdl.human-l0.procedure' as const;
export const HUMAN_L0_PROCEDURE_CONTRACT_VERSION = '0.1.0' as const;

export const PROCEDURE_STUB_LIMITS = {
  proceduresComplete: false,
  fullyResolved: false,
  resolvesTables: false,
  rollsDice: false,
  appliesEffects: false,
  rulesetEnabled: false,
  officialGenerationEnabled: false,
  promotesReview: false,
  reviewStatus: 'needs-review',
  integratesAct6Compiler: false,
  integratesAct7Handlers: false,
  fullUi: false,
  attributeModeIndependent: true,
  stacksExclusiveBlocks: false,
} as const;

export const STEP5_GROUPS = [
  { id: 'profession', impliedOrder: false },
  { id: 'languages-beyond-speech', impliedOrder: false },
  { id: 'wealth-kit', impliedOrder: false },
  { id: 'interesting-thing', impliedOrder: false },
  { id: 'equipment', impliedOrder: false },
] as const;
export type Step5GroupId = (typeof STEP5_GROUPS)[number]['id'];

export const EXPOSURE_BLOCK_COPY_KEY = {
  'awaits-lot': 'procedure.awaits-lot',
  'handler-absent': 'procedure.handler-absent',
} as const;

const PendingReasonSchema = z.enum(HUMAN_L0_CONSUMABLE_PENDING_REASONS);
export type ProcedurePendingReason = z.infer<typeof PendingReasonSchema>;
export type PendencyKind = 'missing-choice' | 'missing-or-altered-source' | 'unsupported-result' | 'adjudication';
export type AdapterSurface = 'choice-slot' | 'pending-only' | 'chip' | 'banner' | 'banner-and-chip' | 'slot-and-chip' | 'slot-and-banner';

/** Adapter hint for every retained `pending.reason` of consumable@1.0.0. Names are not renamed. */
export const PENDING_REASON_ADAPTER: Record<ProcedurePendingReason, { adapterSurface: AdapterSurface; pendencyKind: PendencyKind }> = {
  'manual-procedure': { adapterSurface: 'banner-and-chip', pendencyKind: 'adjudication' },
  'manual-composition': { adapterSurface: 'banner-and-chip', pendencyKind: 'adjudication' },
  'conditional-manual': { adapterSurface: 'banner-and-chip', pendencyKind: 'adjudication' },
  'manual-category-choice': { adapterSurface: 'choice-slot', pendencyKind: 'missing-choice' },
  'bounded-recursion': { adapterSurface: 'slot-and-chip', pendencyKind: 'adjudication' },
  'conditional-branch': { adapterSurface: 'banner-and-chip', pendencyKind: 'unsupported-result' },
  'choice-required': { adapterSurface: 'choice-slot', pendencyKind: 'missing-choice' },
  'open-category-language': { adapterSurface: 'choice-slot', pendencyKind: 'missing-choice' },
  'no-extra-life-rolls': { adapterSurface: 'banner', pendencyKind: 'adjudication' },
  'player-fields': { adapterSurface: 'pending-only', pendencyKind: 'missing-choice' },
  'partial-literacy': { adapterSurface: 'slot-and-chip', pendencyKind: 'adjudication' },
  'range-starts-not-reextracted': { adapterSurface: 'slot-and-banner', pendencyKind: 'missing-or-altered-source' },
  'catalog-group-not-individual': { adapterSurface: 'chip', pendencyKind: 'unsupported-result' },
  'possession-is-not-use': { adapterSurface: 'chip', pendencyKind: 'unsupported-result' },
  'unknown-price': { adapterSurface: 'chip', pendencyKind: 'adjudication' },
  'generic-profile': { adapterSurface: 'chip', pendencyKind: 'unsupported-result' },
  'disabled-source': { adapterSurface: 'pending-only', pendencyKind: 'missing-or-altered-source' },
  'external-branch': { adapterSurface: 'banner-and-chip', pendencyKind: 'unsupported-result' },
  'open-tail-domain': { adapterSurface: 'chip', pendencyKind: 'adjudication' },
  'weapon-no-defense': { adapterSurface: 'chip', pendencyKind: 'adjudication' },
  'defense-bonus-not-substitution': { adapterSurface: 'chip', pendencyKind: 'adjudication' },
};

/** Designer §3 gate/refusal codes. They are not `pending.reason` values. */
export const PROCEDURE_ISSUE_CODES = [
  'choice-resolved-early', 'defense-not-substitution', 'defense-on-possession', 'duplicate-origin',
  'generic-profile-has-stats', 'grouped-as-individual-evidence', 'hash-check-blocks-synthetic',
  'local-only-has-effect', 'lookup-coverage', 'lookup-has-dice', 'lookup-missing-prior', 'lookup-unknown-key',
  'mechanics-contract-mismatch', 'mechanics-semantics-changed', 'open-tail-weight-invented',
  'possession-applies-use', 'profile-mismatch', 'range-outside-die', 'recursion-discard-forbidden',
  'recursion-reroll-forbidden', 'relative-is-not-character', 'shared-column-roll', 'side-roll-on-possession',
  'side-roll-phase-mismatch', 'subtable-missing', 'unextracted-range-has-weights', 'uniform-row-weight',
  'unknown-option', 'unknown-price-not-zero', 'weight-mismatch',
] as const;
export type ProcedureIssueCode = (typeof PROCEDURE_ISSUE_CODES)[number];

export const ISSUE_CODE_ADAPTER: Record<ProcedureIssueCode, AdapterSurface> = {
  'choice-resolved-early': 'banner',
  'defense-not-substitution': 'banner',
  'defense-on-possession': 'banner-and-chip',
  'duplicate-origin': 'chip',
  'generic-profile-has-stats': 'banner',
  'grouped-as-individual-evidence': 'banner',
  'hash-check-blocks-synthetic': 'banner',
  'local-only-has-effect': 'banner',
  'lookup-coverage': 'banner',
  'lookup-has-dice': 'banner',
  'lookup-missing-prior': 'slot-and-chip',
  'lookup-unknown-key': 'banner',
  'mechanics-contract-mismatch': 'banner',
  'mechanics-semantics-changed': 'banner',
  'open-tail-weight-invented': 'banner',
  'possession-applies-use': 'banner',
  'profile-mismatch': 'chip',
  'range-outside-die': 'banner',
  'recursion-discard-forbidden': 'banner',
  'recursion-reroll-forbidden': 'banner',
  'relative-is-not-character': 'banner',
  'shared-column-roll': 'banner',
  'side-roll-on-possession': 'banner',
  'side-roll-phase-mismatch': 'banner',
  'subtable-missing': 'banner',
  'unextracted-range-has-weights': 'banner',
  'uniform-row-weight': 'banner',
  'unknown-option': 'banner',
  'unknown-price-not-zero': 'banner',
  'weight-mismatch': 'banner',
};

/** fail() codes of consumable@1.0.0 that §3 does not name. The UI fallback must show them. */
export const UNMAPPED_GATE_CODES = [
  'blocker-mismatch', 'currency-not-exact', 'cycle-list-mismatch', 'cycle-projected-without-lot',
  'dangling-item', 'defense-requires-equip-or-use', 'duplicate-id', 'duplicate-lookup-key', 'duplicate-roll', 'fictional-data-required',
  'grouped-pending-mismatch', 'import-forbidden', 'manual-resolution-mismatch', 'missing-consequence',
  'modifier-domain', 'open-tail-shape', 'origin-key-mismatch', 'price-bits-mismatch', 'price-consequence',
  'price-incomplete', 'range-coverage', 'recursion-policy-invalid', 'resolution-does-not-roll',
  'review-promotion-forbidden', 'review-status-invalid', 'ruleset-enablement-forbidden', 'schema-invalid',
  'subtable-placement', 'unknown-query', 'unknown-side-roll-parent', 'unpublished-cycle',
] as const;

export const KNOWN_CONDITIONS = [
  'benefit:random-profession', 'benefit:speak-language', 'family-profession-directed', 'family-result:6-8',
  'family-result:9-17', 'family-result:other', 'parent-death', 'sibling-count-positive', 'sibling-optional-detail',
  'recursion-at-limit', 'life-event-directed', 'minor-windfall-10', 'wealthy-kit', 'profession-granted-to-pc',
  'language-grant-directed', 'development-template-directed', 'partial-literacy', 'open-category-language', 'item-choice:wealthy-shield',
  'item-choice:military-spear', 'item-choice:wilderness-spear', 'item-choice:costume', 'item-choice:dress',
] as const;

export const INVALIDATION_RULES = [
  { id: 'exclusive-branch', trigger: 'branch-switch', effect: 'needs-review', migrates: false, retainsLastChoice: true, appliesTo: 'other-branch-slots', doesNotApplyTo: ['shared', 'attribute-mode'] },
  { id: 'source-changed', trigger: 'interesting-things-source', effect: 'needs-review', migrates: false, silentFallback: false, retainsLastChoice: true },
  { id: 'prior-altered', trigger: 'dependency-altered', effect: 'needs-review', migrates: false, retainsLastChoice: true },
  { id: 'core-benefit-not-applicable', trigger: 'ancestry-without-core-benefit', effect: 'needs-review', migrates: false, retainsLastChoice: true },
  { id: 'attribute-mode', trigger: 'attribute-mode-change', effect: 'none', invalidatesProcedureSteps: false },
] as const;

export const OUT_OF_SCOPE = [
  { id: 'resolver-integration', needs: ['#34-act6', '#34-act7'] },
  { id: 'full-ui', issue: 36 },
  { id: 'ruleset-enable', issue: 37 },
  { id: 'level-1', issue: 21 },
] as const;

const LIFESTYLES = ['destitute', 'poor', 'getting-by', 'comfortable', 'wealthy', 'rich'] as const;
const ODDITY_TABLES = ['art', 'books', 'clothing', 'consumables', 'ingredients', 'minor-magic', 'people', 'personal', 'pets', 'qualities', 'tools', 'weird'] as const;
const AGE_BANDS = [
  { min: 3, max: 3, count: 0 }, { min: 4, max: 5, count: 1 }, { min: 6, max: 8, count: 2 },
  { min: 9, max: 12, count: 3 }, { min: 13, max: 15, count: 4 }, { min: 16, max: 17, count: 5 },
  { min: 18, max: 18, count: 6 },
] as const;
const FAMILY_MODIFIERS = [-6, -3, -1, 0, 1, 3, 6] as const;
const SOURCE_STEPS = ['shared.interesting-source', 'core.interesting-grant', 'dev.interesting-initial', 'dev.interesting-extra'] as const;

export class HumanL0ProcedureError extends Error {
  constructor(public readonly code: string) {
    super(`${HUMAN_L0_PROCEDURE_CONTRACT}@${HUMAN_L0_PROCEDURE_CONTRACT_VERSION}: ${code}`);
    this.name = 'HumanL0ProcedureError';
  }
}

type BranchName = 'core' | 'human-development';
type StepBranch = BranchName | 'shared';
type Lot = 'lote-core' | 'lote-only-human' | 'lote-oddities' | 'lote-kits-itens' | 'base-mechanics';
type RefKind = 'table' | 'query' | 'kit' | 'grant' | 'template' | 'modifier' | 'finding' | 'procedure' | 'language' | 'side-roll' | 'item-choice' | 'grouped' | 'mechanics-field';

export type ProcedureDataRef = {
  lot: Lot;
  refKind: RefKind;
  matrixId: string;
  activity: 3 | 4 | 5 | null;
  availability: 'pending-lot' | 'contract-listed' | 'base-contract' | 'published-policy' | 'deferred';
  role: string;
  selected: boolean;
};

export type ProcedureCardinality =
  | { kind: 'once' }
  | { kind: 'exactly'; count: number }
  | { kind: 'optional-set'; members: number; each: 'zero-or-one'; memberOrderImplied: false }
  | { kind: 'per-subject'; subject: 'sibling' | 'related-character' }
  | { kind: 'repeat-from-prior'; priorStepId: string; range: 'age-band-0-to-6' }
  | { kind: 'per-direction' }
  | { kind: 'unspecified' };

type ChoiceSpec = {
  candidates: readonly string[];
  manualField: boolean;
  uniformDie: false;
  candidateKind: 'source' | 'ancestry-benefit' | 'profession-category' | 'item' | 'language' | 'player-fields';
};

type StepDef = {
  id: string;
  branch: StepBranch;
  order: Partial<Record<BranchName, number>>;
  orderBasis: 'published-section' | 'dependency';
  requirement: 'required' | 'optional' | 'conditional';
  condition: (typeof KNOWN_CONDITIONS)[number] | null;
  cardinality: ProcedureCardinality;
  playerSurface: 'choice-slot' | 'pending-only';
  step5Group: Step5GroupId | null;
  groupsTouched: Step5GroupId[];
  activation: string | null;
  choice: ChoiceSpec | null;
  dataRefs: ProcedureDataRef[];
  dependsOn: string[];
  pendingReasons: ProcedurePendingReason[];
  pendingMatrixId: string | null;
  readsPrior: boolean;
  publishedModes: readonly string[] | null;
  publishedSelection: string | null;
  forbidsTable: string | null;
  notes: readonly string[];
};

const activityFor = (lot: Lot): 3 | 4 | 5 | null => lot === 'lote-core' ? 3 : lot === 'lote-only-human' || lot === 'lote-oddities' ? 4 : lot === 'lote-kits-itens' ? 5 : null;

function ref(lot: Lot, refKind: RefKind, matrixId: string, role: string, availability: ProcedureDataRef['availability'] = 'pending-lot', selected = false): ProcedureDataRef {
  return { lot, refKind, matrixId, activity: activityFor(lot), availability, role, selected };
}

function itemCandidates(matrixId: string): readonly string[] {
  const slot = MANUAL_RESOLUTION_SLOTS.find(row => row.matrixId === matrixId);
  if (!slot || slot.linkedDefinition.kind !== 'choice') throw new HumanL0ProcedureError('missing-published-candidates');
  return slot.linkedDefinition.candidates;
}

const itemChoice = (matrixId: string): ChoiceSpec => ({
  candidates: itemCandidates(matrixId), manualField: false, uniformDie: false, candidateKind: 'item',
});

function tableStep(spec: Pick<StepDef, 'id' | 'branch' | 'order' | 'requirement'> & Partial<StepDef> & { tableId: string; lot: Lot }): StepDef {
  const { tableId, lot, ...rest } = spec;
  return {
    orderBasis: 'published-section', condition: null, cardinality: { kind: 'once' }, playerSurface: 'pending-only',
    step5Group: null, groupsTouched: [], activation: null, choice: null, dependsOn: [], pendingReasons: [],
    pendingMatrixId: null, readsPrior: false, publishedModes: null, publishedSelection: null, forbidsTable: null, notes: [],
    dataRefs: [ref(lot, 'table', tableId, 'table')],
    ...rest,
  };
}

const CORE_INSPIRATION = ['background', 'personality', 'religion', 'age', 'build', 'appearance'] as const;
const PROFESSION_CATEGORIES = ['academic', 'common', 'criminal', 'martial', 'religious', 'wilderness'] as const;
const DEV_PROFESSION_TABLES = ['scholarship', 'common', 'criminal', 'military', 'religious', 'wilderness'] as const;
const LIFE_EVENTS = ['major-setback', 'minor-setback', 'minor-windfall', 'major-windfall', 'strange'] as const;
const DEV_TEMPLATES = [
  'childhood-faerie', 'childhood-runaway', 'childhood-family', 'childhood-artisan', 'childhood-education',
  'childhood-good-education', 'childhood-finest-education', 'major-setback-pressed-service', 'windfall-language',
  'windfall-education', 'windfall-common-profession', 'windfall-orator', 'windfall-soldier', 'strange-faerie-language',
  'strange-occult', 'strange-previous-lives', 'strange-dwarfish',
] as const;
const LOOKUPS = [
  ['dev.lookup-clothing', 31, 'only-human:clothing', 'query:only-human:clothing', 'equipment'],
  ['dev.lookup-weapons', 32, 'only-human:weapons', 'query:only-human:weapons', 'equipment'],
  ['dev.lookup-personal-gear', 33, 'only-human:personal-gear', 'query:only-human:personal-gear', 'equipment'],
  ['dev.lookup-special-gear', 34, 'only-human:special-gear', 'query:only-human:special-gear', 'equipment'],
  ['dev.lookup-money', 35, 'only-human:money', 'query:only-human:money', 'wealth-kit'],
] as const;

const GROUPED_PROFESSIONS = [
  'pilot-profession:core:martial:*', 'pilot-profession:core:religious:*', 'pilot-profession:core:wilderness:*',
] as const;

function interestingRefs(source: 'oddities' | 'core' | 'unavailable', grantId: string, grantLot: Lot): ProcedureDataRef[] {
  const grant = ref(grantLot, 'grant', grantId, 'grant-identity');
  if (source === 'unavailable') {
    return [
      grant,
      ref('lote-oddities', 'query', 'selected:interesting-things-router', 'router-unselected'),
      ref('lote-oddities', 'table', 'oddities:thing-router', 'router-unselected'),
      ref('lote-core', 'table', 'core:thing-router', 'router-unselected'),
    ];
  }
  if (source === 'oddities') {
    return [
      grant,
      ref('lote-oddities', 'query', 'selected:interesting-things-router', 'router', 'pending-lot', true),
      ref('lote-oddities', 'table', 'oddities:thing-router', 'router', 'pending-lot', true),
      ...ODDITY_TABLES.map(id => ref('lote-oddities', 'table', `oddities:${id}`, 'selector-child')),
    ];
  }
  return [
    grant,
    ref('lote-oddities', 'query', 'selected:interesting-things-router', 'router', 'pending-lot', true),
    ref('lote-core', 'table', 'core:thing-router', 'router', 'pending-lot', true),
    ...[1, 2, 3, 4, 5, 6].map(n => ref('lote-core', 'table', `core:thing-${n}`, 'selector-child')),
  ];
}

export const HUMAN_L0_PROCEDURE_STEPS: readonly StepDef[] = [
  {
    id: 'core.ancestry-benefit', branch: 'core', order: { core: 1 }, orderBasis: 'published-section',
    requirement: 'required', condition: null, cardinality: { kind: 'exactly', count: 1 }, playerSurface: 'choice-slot',
    step5Group: null, groupsTouched: ['languages-beyond-speech', 'profession'], activation: 'core-ancestry-benefit',
    choice: { candidates: ['speak-language', 'random-profession'], manualField: false, uniformDie: false, candidateKind: 'ancestry-benefit' },
    dataRefs: [ref('base-mechanics', 'mechanics-field', 'mechanics:procedure.ancestryBenefit', 'exclusive-pair', 'base-contract')],
    dependsOn: [], pendingReasons: [], pendingMatrixId: null, readsPrior: false, publishedModes: null,
    publishedSelection: 'one-language-or-random-profession', forbidsTable: null,
    notes: ['only-when-ancestry-variant-is-core', 'groups-have-no-internal-order'],
  },
  {
    id: 'core.starting-professions', branch: 'core', order: { core: 2 }, orderBasis: 'published-section',
    requirement: 'required', condition: null, cardinality: { kind: 'exactly', count: 2 }, playerSurface: 'pending-only',
    step5Group: 'profession', groupsTouched: ['profession'], activation: 'per-random-profession', choice: null,
    dataRefs: [
      ref('lote-core', 'query', 'query:profession-faces:core', 'faces'),
      ref('lote-core', 'table', 'core:profession-router', 'selector'),
      ...PROFESSION_CATEGORIES.map(category => ref('lote-core', 'table', `core:profession-${category}`, 'conditional-child')),
      ...GROUPED_PROFESSIONS.map(id => ref('lote-core', 'grouped', id, 'unextracted-range')),
    ],
    dependsOn: [], pendingReasons: ['range-starts-not-reextracted'], pendingMatrixId: 'pilot-profession:core:martial:*',
    readsPrior: false, publishedModes: null, publishedSelection: 'manual-or-random', forbidsTable: null,
    notes: ['count-from-cur-017-starting-rights', 'no-profession-option-list', 'uniform-across-categories:false', 'blocker:act3-act5-grouped-local-only'],
  },
  {
    id: 'core.ancestry-random-profession', branch: 'core', order: { core: 3 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'benefit:random-profession', cardinality: { kind: 'exactly', count: 1 },
    playerSurface: 'pending-only', step5Group: 'profession', groupsTouched: ['profession'], activation: 'ancestry-additional-profession',
    choice: null,
    dataRefs: [ref('lote-core', 'query', 'query:profession-faces:core', 'faces'), ref('lote-core', 'table', 'core:profession-router', 'selector')],
    dependsOn: ['core.ancestry-benefit'], pendingReasons: ['range-starts-not-reextracted'], pendingMatrixId: 'pilot-profession:core:martial:*',
    readsPrior: false, publishedModes: null, publishedSelection: 'manual-or-random', forbidsTable: null,
    notes: ['distinct-from-the-two-starting-professions'],
  },
  tableStep({
    id: 'core.wealth', branch: 'core', order: { core: 4 }, requirement: 'required', tableId: 'core:wealth', lot: 'lote-core',
    step5Group: 'wealth-kit', groupsTouched: ['wealth-kit'], activation: 'core-wealth-once',
    dataRefs: [ref('lote-core', 'table', 'core:wealth', 'table'), ref('lote-core', 'query', 'query:starting-lifestyle:core', 'lifestyle-query')],
    notes: ['no-expanded-modifiers', 'open-tail:false', 'manual-override-not-published'],
  }),
  {
    id: 'core.starting-kit', branch: 'core', order: { core: 5 }, orderBasis: 'dependency', requirement: 'required',
    condition: null, cardinality: { kind: 'once' }, playerSurface: 'pending-only', step5Group: 'equipment',
    groupsTouched: ['equipment'], activation: 'core-starting-kit', choice: null,
    dataRefs: LIFESTYLES.map(lifestyle => ref('lote-kits-itens', 'kit', `core:kit:${lifestyle}`, 'kit-by-lifestyle')),
    dependsOn: ['core.wealth'], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null, notes: ['one-kit-from-wealth', 'no-five-lookups'],
  },
  {
    id: 'core.wealthy-shield', branch: 'core', order: { core: 6 }, orderBasis: 'dependency', requirement: 'conditional',
    condition: 'item-choice:wealthy-shield', cardinality: { kind: 'exactly', count: 1 }, playerSurface: 'choice-slot',
    step5Group: 'equipment', groupsTouched: ['equipment'], activation: 'choice-required',
    choice: itemChoice('item-ref:grant:core:kit:wealthy/grant/special/shield/shield'),
    dataRefs: [ref('lote-kits-itens', 'item-choice', 'item-ref:grant:core:kit:wealthy/grant/special/shield/shield', 'published-candidates', 'contract-listed')],
    dependsOn: ['core.starting-kit'], pendingReasons: ['choice-required'],
    pendingMatrixId: 'item-ref:grant:core:kit:wealthy/grant/special/shield/shield', readsPrior: true,
    publishedModes: null, publishedSelection: null, forbidsTable: null, notes: ['resolved-item-stays-null'],
  },
  {
    id: 'shared.interesting-source', branch: 'shared', order: { core: 7, 'human-development': 27 }, orderBasis: 'dependency',
    requirement: 'required', condition: null, cardinality: { kind: 'exactly', count: 1 }, playerSurface: 'choice-slot',
    step5Group: 'interesting-thing', groupsTouched: ['interesting-thing'], activation: 'source-procedure',
    choice: { candidates: ['oddities', 'core'], manualField: false, uniformDie: false, candidateKind: 'source' },
    dataRefs: [ref('lote-oddities', 'query', 'selected:interesting-things-router', 'source-policy', 'published-policy')],
    dependsOn: [], pendingReasons: [], pendingMatrixId: null, readsPrior: false, publishedModes: null,
    publishedSelection: 'default-oddities-alternative-core', forbidsTable: null,
    notes: ['product-policy-default', 'silent-fallback:false', 'independent-of-ancestry-branch', 'survives-branch-switch'],
  },
  {
    id: 'core.interesting-grant', branch: 'core', order: { core: 8 }, orderBasis: 'dependency', requirement: 'required',
    condition: null, cardinality: { kind: 'exactly', count: 1 }, playerSurface: 'pending-only',
    step5Group: 'interesting-thing', groupsTouched: ['interesting-thing'], activation: 'one-initial-plus-explicit-extra-results',
    choice: null, dataRefs: [], dependsOn: ['shared.interesting-source'], pendingReasons: [], pendingMatrixId: 'core-initial-thing',
    readsPrior: false, publishedModes: ['published-roll', 'manual-result-without-fabricated-selector'], publishedSelection: null,
    forbidsTable: null, notes: ['grant:core-initial-thing', 'additional:false', 'manual-result-does-not-fabricate-selector-rolls'],
  },
  {
    id: 'core.ancestry-inspiration', branch: 'core', order: { core: 9 }, orderBasis: 'published-section',
    requirement: 'optional', condition: null, cardinality: { kind: 'optional-set', members: 6, each: 'zero-or-one', memberOrderImplied: false },
    playerSurface: 'pending-only', step5Group: null, groupsTouched: [], activation: 'optional-ancestry-inspiration', choice: null,
    dataRefs: [
      ...CORE_INSPIRATION.map(name => ref('lote-core', 'table', `core:human-${name}`, 'optional-member')),
      ref('lote-core', 'template', 'core-background-travel', 'conditional-template'),
      ref('lote-core', 'template', 'core-background-education', 'conditional-template'),
    ],
    dependsOn: [], pendingReasons: [], pendingMatrixId: null, readsPrior: false,
    publishedModes: ['roll', 'choose', 'create-other'], publishedSelection: null, forbidsTable: null,
    notes: ['modes-are-not-table-rows', 'not-required'],
  },
  tableStep({
    id: 'core.role-traits', branch: 'core', order: { core: 10 }, requirement: 'optional', tableId: 'core:role-traits', lot: 'lote-core',
    activation: 'optional-inspiration-two-positive-at-least-one-negative',
    dataRefs: [ref('lote-core', 'table', 'core:role-traits', 'table'), ref('lote-core', 'table', 'core:role-traits#positive', 'column'), ref('lote-core', 'table', 'core:role-traits#negative', 'column')],
    notes: ['columns-independent', 'not-one-joint-row'],
  }),
  tableStep({ id: 'dev.ancestors', branch: 'human-development', order: { 'human-development': 1 }, requirement: 'required', tableId: 'only-human:ancestors', lot: 'lote-only-human', activation: 'root-once' }),
  tableStep({ id: 'dev.family-circumstances', branch: 'human-development', order: { 'human-development': 2 }, requirement: 'required', tableId: 'only-human:family-circumstances', lot: 'lote-only-human', activation: 'root-once' }),
  {
    id: 'dev.family-profession', branch: 'human-development', order: { 'human-development': 3 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'family-profession-directed', cardinality: { kind: 'exactly', count: 1 },
    playerSurface: 'pending-only', step5Group: 'profession', groupsTouched: ['profession'], activation: 'restricted-category-choice',
    choice: null, dataRefs: [ref('lote-only-human', 'query', 'query:family-category', 'restricted-categories')],
    dependsOn: ['dev.family-circumstances'], pendingReasons: ['manual-category-choice'], pendingMatrixId: 'finding:outer-category-choice',
    readsPrior: true, publishedModes: null, publishedSelection: null, forbidsTable: 'only-human:profession-router',
    notes: ['no-invented-uniform-selector', 'family-profession-is-not-automatically-the-pc-profession'],
  },
  tableStep({ id: 'dev.parents', branch: 'human-development', order: { 'human-development': 4 }, requirement: 'required', tableId: 'only-human:parents', lot: 'lote-only-human', activation: 'root-once' }),
  {
    id: 'dev.parent-death', branch: 'human-development', order: { 'human-development': 5 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'parent-death', cardinality: { kind: 'unspecified' }, playerSurface: 'pending-only',
    step5Group: null, groupsTouched: [], activation: 'conditional-death', choice: null,
    dataRefs: [ref('lote-only-human', 'table', 'only-human:death', 'conditional-table'), ref('lote-only-human', 'finding', 'finding:death-multiplicity', 'adjudication')],
    dependsOn: ['dev.parents'], pendingReasons: ['manual-procedure'], pendingMatrixId: 'finding:death-multiplicity',
    readsPrior: true, publishedModes: null, publishedSelection: null, forbidsTable: null,
    notes: ['cardinality-not-invented'],
  },
  tableStep({
    id: 'dev.siblings', branch: 'human-development', order: { 'human-development': 6 }, requirement: 'required',
    tableId: 'only-human:siblings', lot: 'lote-only-human', activation: 'root-once',
    dataRefs: [
      ref('lote-only-human', 'table', 'only-human:siblings', 'table'),
      ref('lote-only-human', 'side-roll', 'side-roll:only-human:siblings:9-12', 'count-expression'),
      ref('lote-only-human', 'side-roll', 'side-roll:only-human:siblings:13-16', 'count-expression'),
      ref('lote-only-human', 'side-roll', 'side-roll:only-human:siblings:17-20', 'count-expression'),
    ],
    notes: ['count-may-be-zero', 'no-single-uniform-count-die'],
  }),
  {
    id: 'dev.sibling-details', branch: 'human-development', order: { 'human-development': 7 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'sibling-count-positive', cardinality: { kind: 'per-subject', subject: 'sibling' },
    playerSurface: 'pending-only', step5Group: null, groupsTouched: [], activation: 'per-sibling', choice: null,
    dataRefs: [
      ref('lote-only-human', 'table', 'only-human:sibling-gender', 'per-sibling'),
      ref('lote-only-human', 'table', 'only-human:sibling-age', 'per-sibling'),
      ref('lote-only-human', 'table', 'only-human:character-fate', 'per-sibling'),
    ],
    dependsOn: ['dev.siblings'], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null, notes: ['zero-siblings-skip-details', 'not-pc-gender'],
  },
  {
    id: 'dev.sibling-recursion', branch: 'human-development', order: { 'human-development': 8 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'sibling-optional-detail', cardinality: { kind: 'per-subject', subject: 'related-character' },
    playerSurface: 'pending-only', step5Group: null, groupsTouched: [], activation: 'optional-detail-recursion', choice: null,
    dataRefs: [ref('lote-only-human', 'finding', 'finding:recursion', 'published-cycle'), ref('lote-only-human', 'table', 'only-human:character-fate', 'cycle-member')],
    dependsOn: ['dev.sibling-details'], pendingReasons: [], pendingMatrixId: 'finding:recursion', readsPrior: true,
    publishedModes: null, publishedSelection: null, forbidsTable: null,
    notes: ['on-limit-pending', 'reroll-at-limit:false', 'discard-at-limit:false'],
  },
  tableStep({
    id: 'dev.age', branch: 'human-development', order: { 'human-development': 9 }, requirement: 'required',
    tableId: 'only-human:age', lot: 'lote-only-human', activation: 'root-once',
    notes: ['childhood-exactly-once', 'life-experiences-from-age-band', 'age-change-does-not-add-life-rolls'],
  }),
  tableStep({ id: 'dev.build', branch: 'human-development', order: { 'human-development': 10 }, requirement: 'required', tableId: 'only-human:build', lot: 'lote-only-human', activation: 'root-once', notes: ['size-exception-result-3-retained'] }),
  {
    id: 'dev.dimensions', branch: 'human-development', order: { 'human-development': 11 }, orderBasis: 'dependency',
    requirement: 'required', condition: null, cardinality: { kind: 'unspecified' }, playerSurface: 'pending-only',
    step5Group: null, groupsTouched: [], activation: 'manual-composition', choice: null,
    dataRefs: [
      ref('lote-only-human', 'finding', 'finding:dimension-order', 'adjudication'),
      ref('lote-only-human', 'procedure', 'procedure:dimension-composition', 'adjudication'),
    ],
    dependsOn: ['dev.age', 'dev.build'], pendingReasons: ['manual-composition', 'no-extra-life-rolls'],
    pendingMatrixId: 'finding:dimension-order', readsPrior: true, publishedModes: null, publishedSelection: null,
    forbidsTable: null, notes: ['no-extra-life-rolls'],
  },
  tableStep({ id: 'dev.appearance', branch: 'human-development', order: { 'human-development': 12 }, requirement: 'required', tableId: 'only-human:appearance', lot: 'lote-only-human', activation: 'root-once' }),
  {
    id: 'dev.player-appearance', branch: 'human-development', order: { 'human-development': 13 }, orderBasis: 'published-section',
    requirement: 'required', condition: null, cardinality: { kind: 'once' }, playerSurface: 'pending-only',
    step5Group: null, groupsTouched: [], activation: 'player-fields', choice: { candidates: [], manualField: true, uniformDie: false, candidateKind: 'player-fields' },
    dataRefs: [ref('lote-only-human', 'procedure', 'procedure:expanded-free-appearance', 'player-fields')],
    dependsOn: [], pendingReasons: ['player-fields'], pendingMatrixId: 'procedure:expanded-free-appearance',
    readsPrior: false, publishedModes: null, publishedSelection: null, forbidsTable: 'only-human:sibling-gender',
    notes: ['manual-panel', 'no-candidate-list'],
  },
  tableStep({
    id: 'dev.childhood', branch: 'human-development', order: { 'human-development': 14 }, requirement: 'required',
    tableId: 'only-human:childhood', lot: 'lote-only-human', activation: 'once-from-age', dependsOn: ['dev.age', 'dev.family-circumstances'],
    notes: ['open-tail', 'modifier-after-dice', 'do-not-clamp-before-modifier'],
  }),
  {
    id: 'dev.childhood-grants', branch: 'human-development', order: { 'human-development': 15 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'development-template-directed', cardinality: { kind: 'per-direction' },
    playerSurface: 'pending-only', step5Group: 'languages-beyond-speech', groupsTouched: ['languages-beyond-speech', 'profession'],
    activation: 'development-template', choice: null,
    dataRefs: DEV_TEMPLATES.map(id => ref('lote-only-human', 'template', id, 'conditional-template')),
    dependsOn: ['dev.childhood'], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null, notes: ['literacy-not-inferred-from-labels', 'profession-not-inferred-from-labels'],
  },
  {
    id: 'dev.profession-directed', branch: 'human-development', order: { 'human-development': 16 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'profession-granted-to-pc', cardinality: { kind: 'per-direction' },
    playerSurface: 'pending-only', step5Group: 'profession', groupsTouched: ['profession'], activation: 'when-profession-directed',
    choice: null,
    dataRefs: [
      ref('lote-only-human', 'query', 'query:profession-faces:only-human', 'faces'),
      ref('lote-only-human', 'table', 'only-human:profession-router', 'selector-when-directed'),
      ...DEV_PROFESSION_TABLES.map(id => ref('lote-only-human', 'table', `only-human:${id}`, 'directed-child')),
      ref('lote-only-human', 'query', 'query:family-category', 'restricted-when-family'),
    ],
    dependsOn: [], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: 'published-roll', forbidsTable: null,
    notes: ['religious-child-d6', 'other-children-d20', 'weights-not-uniform', 'not-core-tables', 'not-a-root-roll'],
  },
  {
    id: 'dev.profession-equipment', branch: 'human-development', order: { 'human-development': 17 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'profession-granted-to-pc', cardinality: { kind: 'per-direction' },
    playerSurface: 'pending-only', step5Group: 'equipment', groupsTouched: ['equipment'], activation: 'profession-grant-program',
    choice: null,
    dataRefs: [
      ref('lote-kits-itens', 'grouped', 'class:exact-definition-refs', 'catalog-group'),
      ref('lote-kits-itens', 'grouped', 'class:generic-editable-refs', 'catalog-group'),
      ref('lote-kits-itens', 'grouped', 'class:source-grant-only', 'catalog-group'),
    ],
    dependsOn: ['dev.profession-directed'], pendingReasons: ['catalog-group-not-individual'],
    pendingMatrixId: 'class:exact-definition-refs', readsPrior: true, publishedModes: null, publishedSelection: null,
    forbidsTable: null, notes: ['no-fake-item-list', 'family-profession-does-not-grant-to-pc'],
  },
  {
    id: 'dev.languages-beyond-speech', branch: 'human-development', order: { 'human-development': 18 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'language-grant-directed', cardinality: { kind: 'per-direction' },
    playerSurface: 'pending-only', step5Group: 'languages-beyond-speech', groupsTouched: ['languages-beyond-speech'],
    activation: 'explicit-language-grant', choice: null,
    dataRefs: ['dark-speech', 'dwarfish', 'elvish', 'high-archaic', 'trollish'].map(id => ref('lote-core', 'language', `language:${id}`, 'named-language-not-a-menu')),
    dependsOn: ['dev.childhood-grants'], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null, notes: ['speech-default-stays-on-the-base', 'read-write-only-when-explicit'],
  },
  {
    id: 'dev.partial-literacy', branch: 'human-development', order: { 'human-development': 19 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'partial-literacy', cardinality: { kind: 'unspecified' }, playerSurface: 'pending-only',
    step5Group: 'languages-beyond-speech', groupsTouched: ['languages-beyond-speech'], activation: 'partial-literacy', choice: null,
    dataRefs: [ref('lote-only-human', 'procedure', 'procedure:partial-literacy', 'adjudication')],
    dependsOn: ['dev.languages-beyond-speech'], pendingReasons: ['partial-literacy'], pendingMatrixId: 'procedure:partial-literacy',
    readsPrior: true, publishedModes: null, publishedSelection: null, forbidsTable: null, notes: ['not-inferred-from-a-profession-label'],
  },
  {
    id: 'dev.open-language', branch: 'human-development', order: { 'human-development': 20 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'open-category-language', cardinality: { kind: 'exactly', count: 1 },
    playerSurface: 'choice-slot', step5Group: 'languages-beyond-speech', groupsTouched: ['languages-beyond-speech'],
    activation: 'open-category-language', choice: { candidates: [], manualField: true, uniformDie: false, candidateKind: 'language' },
    dataRefs: [
      ref('lote-core', 'language', 'language:dead-languages', 'open-category'),
      ref('lote-core', 'language', 'language:secret-language', 'open-category'),
    ],
    dependsOn: [], pendingReasons: ['open-category-language'], pendingMatrixId: 'language:dead-languages',
    readsPrior: false, publishedModes: null, publishedSelection: null, forbidsTable: null, notes: ['no-invented-language-list'],
  },
  ...([
    ['dev.choice-military-spear', 21, 'item-choice:military-spear', 'item-ref:grant:profession:pilot-profession:only-human:military:r03/grant/spear'],
    ['dev.choice-wilderness-spear', 22, 'item-choice:wilderness-spear', 'item-ref:grant:profession:pilot-profession:only-human:wilderness:r17/grant/spear'],
    ['dev.choice-costume', 23, 'item-choice:costume', 'item-ref:grant:profession:pilot-profession:only-human:common:r11/grant/entertainer-clothing/costume/costume'],
    ['dev.choice-dress', 24, 'item-choice:dress', 'item-ref:grant:profession:pilot-profession:only-human:common:r11/grant/entertainer-clothing/dress/dress'],
  ] as const).map(([id, order, condition, matrixId]): StepDef => ({
    id, branch: 'human-development', order: { 'human-development': order }, orderBasis: 'dependency',
    requirement: 'conditional', condition, cardinality: { kind: 'exactly', count: 1 }, playerSurface: 'choice-slot',
    step5Group: 'equipment', groupsTouched: ['equipment'], activation: 'choice-required', choice: itemChoice(matrixId),
    dataRefs: [ref('lote-kits-itens', 'item-choice', matrixId, 'published-candidates', 'contract-listed')],
    dependsOn: ['dev.profession-equipment'], pendingReasons: ['choice-required'], pendingMatrixId: matrixId,
    readsPrior: true, publishedModes: null, publishedSelection: null, forbidsTable: null, notes: ['resolved-item-stays-null'],
  })),
  tableStep({
    id: 'dev.life', branch: 'human-development', order: { 'human-development': 25 }, requirement: 'required',
    tableId: 'only-human:life', lot: 'lote-only-human', activation: 'repeat-from-age',
    cardinality: { kind: 'repeat-from-prior', priorStepId: 'dev.age', range: 'age-band-0-to-6' },
    dependsOn: ['dev.age'], notes: ['sequential', 'zero-is-valid', 'not-every-event-table'],
  }),
  {
    id: 'dev.life-event', branch: 'human-development', order: { 'human-development': 26 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'life-event-directed', cardinality: { kind: 'per-direction' },
    playerSurface: 'pending-only', step5Group: null, groupsTouched: [], activation: 'conditional-life', choice: null,
    dataRefs: LIFE_EVENTS.map(id => ref('lote-only-human', 'table', `only-human:${id}`, 'directed-one-of')),
    dependsOn: ['dev.life'], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null,
    notes: ['exactly-the-directed-table', 'not-a-player-menu-of-five', 'tooth-and-claw-reroll-not-implemented'],
  },
  {
    id: 'dev.interesting-extra', branch: 'human-development', order: { 'human-development': 28 }, orderBasis: 'dependency',
    requirement: 'conditional', condition: 'minor-windfall-10', cardinality: { kind: 'exactly', count: 1 },
    playerSurface: 'pending-only', step5Group: 'interesting-thing', groupsTouched: ['interesting-thing'],
    activation: 'additional-result', choice: null, dataRefs: [], dependsOn: ['dev.life-event', 'shared.interesting-source'],
    pendingReasons: [], pendingMatrixId: 'only-human-minor-windfall-10', readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null, notes: ['grant:only-human-minor-windfall-10', 'additional:true', 'not-one-per-lookup'],
  },
  tableStep({
    id: 'dev.lifestyle', branch: 'human-development', order: { 'human-development': 29 }, requirement: 'required',
    tableId: 'only-human:lifestyle', lot: 'lote-only-human', step5Group: 'wealth-kit', groupsTouched: ['wealth-kit'],
    activation: 'after-all-life-events', dependsOn: ['dev.life'],
    dataRefs: [
      ref('lote-only-human', 'table', 'only-human:lifestyle', 'table'),
      ref('lote-only-human', 'query', 'query:starting-lifestyle:only-human', 'lifestyle-query'),
      ref('lote-only-human', 'modifier', 'lifestyle-modifier:life', 'ordered-modifier'),
      ref('lote-only-human', 'modifier', 'lifestyle-modifier:major-setback:5-8', 'ordered-modifier'),
      ref('lote-only-human', 'modifier', 'lifestyle-modifier:major-setback:10', 'ordered-modifier'),
      ref('lote-only-human', 'modifier', 'lifestyle-modifier:minor-setback', 'ordered-modifier'),
      ref('lote-only-human', 'modifier', 'lifestyle-modifier:minor-windfall', 'ordered-modifier'),
      ref('lote-only-human', 'modifier', 'lifestyle-modifier:major-windfall', 'ordered-modifier'),
    ],
    notes: ['open-tail', 'modifiers-after-dice', 'not-core-wealth'],
  }),
  {
    id: 'dev.interesting-initial', branch: 'human-development', order: { 'human-development': 30 }, orderBasis: 'dependency',
    requirement: 'required', condition: null, cardinality: { kind: 'exactly', count: 1 }, playerSurface: 'pending-only',
    step5Group: 'interesting-thing', groupsTouched: ['interesting-thing'], activation: 'initial-result', choice: null,
    dataRefs: [], dependsOn: ['shared.interesting-source'], pendingReasons: [], pendingMatrixId: 'only-human-initial-thing',
    readsPrior: false, publishedModes: ['published-roll', 'manual-result-without-fabricated-selector'], publishedSelection: null,
    forbidsTable: null, notes: ['grant:only-human-initial-thing', 'additional:false', 'not-core-initial-thing'],
  },
  ...LOOKUPS.map(([id, order, tableId, queryId, group]): StepDef => ({
    id, branch: 'human-development', order: { 'human-development': order }, orderBasis: 'published-section',
    requirement: 'required', condition: null, cardinality: { kind: 'once' }, playerSurface: 'pending-only',
    step5Group: group, groupsTouched: [group], activation: 'lookup-by-lifestyle', choice: null,
    dataRefs: [
      ref('lote-kits-itens', 'table', tableId, 'lookup-table'),
      ref('lote-kits-itens', 'query', queryId, 'lookup-query'),
      ...LIFESTYLES.map(lifestyle => ref('lote-kits-itens', 'kit', `only-human:kit:${lifestyle}`, 'kit-by-lifestyle')),
    ],
    dependsOn: ['dev.lifestyle'], pendingReasons: [], pendingMatrixId: null, readsPrior: true, publishedModes: null,
    publishedSelection: null, forbidsTable: null, notes: ['extra-dice:false'],
  })),
  ...([
    ['dev.personality', 36, 'only-human:personality', 'root-once'],
    ['dev.relationships', 37, 'only-human:relationships', 'root-once'],
    ['dev.fears', 38, 'only-human:fears', 'root-once'],
    ['dev.desires', 39, 'only-human:desires', 'root-once'],
    ['dev.obligations', 40, 'only-human:obligations', 'root-once'],
    ['dev.morality', 41, 'only-human:morality', 'root-once'],
    ['dev.religion', 42, 'only-human:religion', 'root-once-and-piety-reroll'],
    ['dev.piety', 43, 'only-human:piety', 'root-once-with-published-recursion'],
  ] as const).map(([id, order, tableId, activation]) => tableStep({
    id, branch: 'human-development', order: { 'human-development': order }, requirement: 'required',
    tableId, lot: 'lote-only-human', activation,
    notes: tableId === 'only-human:fears' || tableId === 'only-human:desires' ? ['columns-not-guessed-from-line-order']
      : tableId === 'only-human:piety' ? ['published-recursion', 'reroll-at-limit:false', 'discard-at-limit:false']
        : tableId === 'only-human:religion' ? ['not-the-core-religion-table'] : [],
  })),
];

export const HUMAN_L0_PROCEDURE_DEFERRED = [
  { matrixId: 'procedure:roleplaying-questions', included: false, deletesTableResults: false, destination: '#36' },
  { matrixId: 'gap:level-1', included: false, issue: 21 },
  { matrixId: 'gap:purchase-system', included: false, issue: null },
  { matrixId: 'gap:full-combat', included: false, issue: null },
  { matrixId: 'gap:dark-passages-generator', included: false, futureHookEnabled: false },
  { matrixId: 'gap:ruleset-enablement', included: false, issue: 37 },
] as const;

export const HUMAN_L0_PROCEDURE_POLICY = {
  defaultBranch: 'human-development',
  alternativeBranch: 'core',
  developmentReplaces: ['random-starting-professions', 'starting-wealth'],
  implicitCoreBenefit: false,
  attributeModeIndependent: true,
  attributeModeMatrixId: 'procedure:human-attributes',
  baseSpeechOutsideProcedure: true,
  literacyNotInferredFromLabels: true,
  professionNotInferredFromLabels: true,
  familyProfessionGrantsToPc: false,
  interestingThingsDefault: 'oddities',
  interestingThingsSilentFallback: false,
  ageBands: AGE_BANDS,
  familyModifiers: FAMILY_MODIFIERS,
  openTail: { lowAtOrBelow: 3, highAtOrAbove: 18, applyModifierAfterDice: true, clampRawRollBeforeModifier: false },
  stacksExclusiveBlocks: false,
} as const;

const RETAINED_GAPS: { matrixId: string; reason: ProcedurePendingReason }[] = [
  { matrixId: 'finding:external-dependencies', reason: 'conditional-manual' },
  { matrixId: 'gap:terrible-beauty-favor', reason: 'conditional-branch' },
  { matrixId: 'extra:major-windfall-1-fallback', reason: 'conditional-branch' },
  { matrixId: 'gap:tooth-claw-skinchanger', reason: 'external-branch' },
  { matrixId: 'gap:tombs-of-the-desolation', reason: 'external-branch' },
  { matrixId: 'gap:demon-lords-companion', reason: 'external-branch' },
  { matrixId: 'gap:uncertain-faith', reason: 'external-branch' },
];

function assertSteps(steps: readonly StepDef[]) {
  const ids = steps.map(step => step.id);
  if (new Set(ids).size !== ids.length) throw new HumanL0ProcedureError('duplicate-step');
  for (const branch of ['core', 'human-development'] as const) {
    const orders = steps.filter(step => step.order[branch] !== undefined).map(step => step.order[branch]);
    if (new Set(orders).size !== orders.length) throw new HumanL0ProcedureError('duplicate-order');
  }
  for (const step of steps) {
    if (step.requirement === 'conditional' && !step.condition) throw new HumanL0ProcedureError('conditional-without-token');
    if (step.playerSurface === 'choice-slot' && !step.choice) throw new HumanL0ProcedureError('choice-slot-without-spec');
    if (!STEP5_GROUPS.every(group => group.impliedOrder === false)) throw new HumanL0ProcedureError('group-order-implied');
  }
}
assertSteps(HUMAN_L0_PROCEDURE_STEPS);

export const ProcedureExposureInputSchema = z.object({
  branch: z.enum(['core', 'human-development']),
  ancestryVariant: z.enum(['core', 'only-human']),
  interestingThingsSource: z.enum(['oddities', 'core', 'unavailable']),
  attributeMode: z.enum(['fixed', 'random']),
  recorded: z.array(z.object({
    stepId: z.string().min(1),
    branch: z.enum(['core', 'human-development', 'shared']),
    choiceId: z.string().min(1).nullable(),
  }).strict()).max(80).default([]),
  alteredStepIds: z.array(z.string().min(1)).max(80).default([]),
  activatedConditions: z.array(z.enum(KNOWN_CONDITIONS)).max(40).default([]),
  selectedOptionalStepIds: z.array(z.string().min(1)).max(40).default([]),
}).strict();
export type ProcedureExposureInput = z.input<typeof ProcedureExposureInputSchema>;

export type ProcedureExposure = {
  contract: typeof HUMAN_L0_PROCEDURE_CONTRACT;
  contractVersion: typeof HUMAN_L0_PROCEDURE_CONTRACT_VERSION;
  proceduresComplete: false;
  fullyResolved: false;
  officialGenerationEnabled: false;
  rulesetEnabled: false;
  rollsDice: false;
  branch: BranchName;
  step5Groups: typeof STEP5_GROUPS;
  attributeMode: {
    mode: 'fixed' | 'random';
    matrixId: 'procedure:human-attributes';
    independentOfTableProcedure: true;
    invalidatesProcedureSteps: false;
  };
  policy: typeof HUMAN_L0_PROCEDURE_POLICY;
  steps: ProcedureExposureStep[];
  invalidated: ProcedureInvalidation[];
  retainedGaps: ProcedureRetainedGap[];
  deferred: typeof HUMAN_L0_PROCEDURE_DEFERRED;
  outOfScope: typeof OUT_OF_SCOPE;
};

export type ProcedureExposureStep = {
  stepId: string;
  branch: StepBranch;
  order: number;
  orderBasis: 'published-section' | 'dependency';
  requirement: StepDef['requirement'];
  condition: StepDef['condition'];
  cardinality: ProcedureCardinality;
  playerSurface: 'choice-slot' | 'pending-only';
  step5Group: Step5GroupId | null;
  groupsTouched: Step5GroupId[];
  groupOrderImplied: false;
  slotState: 'pending' | 'not-started' | 'skipped-condition' | 'needs-review';
  visibility: 'visible' | 'hidden-until-condition';
  dataRefs: ProcedureDataRef[];
  choice: null | {
    candidates: string[];
    resolvedItemId: null;
    manualField: boolean;
    uniformDie: false;
    candidateKind: ChoiceSpec['candidateKind'];
  };
  pending: {
    reason: ProcedurePendingReason;
    pendencyKind: PendencyKind;
    retainsConsequence: true;
    matrixId: string | null;
    candidates: string[];
    resolvedItemId: null;
  }[];
  issue: null | { code: 'lookup-missing-prior'; adapterSurface: 'slot-and-chip'; retainsConsequence: false };
  reviews: {
    reason: 'exclusive-branch' | 'source-changed' | 'prior-altered' | 'core-benefit-not-applicable';
    migrates: false;
    retainsLastChoice: true;
    lastChoiceId: string | null;
  }[];
  blocks: ('awaits-lot' | 'handler-absent')[];
  commandId: null;
  roll: null;
  optionsSelectable: false;
  lastChoiceId: string | null;
  activation: string | null;
  forbidsTable: string | null;
  publishedModes: readonly string[] | null;
  publishedSelection: string | null;
  notes: readonly string[];
};

export type ProcedureInvalidation = {
  stepId: string;
  previousBranch: StepBranch;
  slotState: 'needs-review';
  reviewReason: 'exclusive-branch' | 'core-benefit-not-applicable';
  migrates: false;
  retainsLastChoice: true;
  lastChoiceId: string | null;
};

export type ProcedureRetainedGap = {
  matrixId: string;
  reason: ProcedurePendingReason;
  pendencyKind: PendencyKind;
  retainsConsequence: true;
  activatesRoll: false;
  active: boolean;
};

const BENEFIT_TOKENS = ['benefit:random-profession', 'benefit:speak-language'] as const;
const FAMILY_BANDS = ['family-result:6-8', 'family-result:9-17', 'family-result:other'] as const;

function familySurface(conditions: Set<string>, active: boolean): { surface: 'choice-slot' | 'pending-only'; candidates: string[]; manualField: boolean } {
  const bands = FAMILY_BANDS.filter(token => conditions.has(token));
  if (bands.length > 1 || (bands.length === 1 && !conditions.has('family-profession-directed'))) throw new HumanL0ProcedureError('conflicting-conditions');
  if (!active) return { surface: 'pending-only', candidates: [], manualField: false };
  if (bands[0] === 'family-result:6-8') return { surface: 'choice-slot', candidates: ['common', 'criminal', 'military', 'wilderness'], manualField: false };
  if (bands[0] === 'family-result:9-17') return { surface: 'choice-slot', candidates: ['common', 'military', 'religious', 'wilderness'], manualField: false };
  return { surface: 'pending-only', candidates: [], manualField: true };
}

function pendingFor(step: StepDef, reasons: ProcedurePendingReason[], candidates: string[]) {
  return reasons.map(reason => ({
    reason,
    pendencyKind: PENDING_REASON_ADAPTER[reason].pendencyKind,
    retainsConsequence: true as const,
    matrixId: step.pendingMatrixId,
    candidates: reason === 'choice-required' || reason === 'manual-category-choice' ? candidates : [],
    resolvedItemId: null as null,
  }));
}

/** Pure planning view. Same input, same output. No RNG and no character mutation. */
export function exposeHumanL0Procedure(input: ProcedureExposureInput): ProcedureExposure {
  const parsed = ProcedureExposureInputSchema.safeParse(input);
  if (!parsed.success) throw new HumanL0ProcedureError('exposure-invalid');
  const request = parsed.data;
  const knownIds = new Set(HUMAN_L0_PROCEDURE_STEPS.map(step => step.id));
  for (const row of request.recorded) if (!knownIds.has(row.stepId)) throw new HumanL0ProcedureError('unknown-recorded-step');
  for (const stepId of request.alteredStepIds) if (!knownIds.has(stepId)) throw new HumanL0ProcedureError('unknown-altered-step');
  for (const stepId of request.selectedOptionalStepIds) if (!knownIds.has(stepId)) throw new HumanL0ProcedureError('unknown-optional-step');
  const conditions = new Set(request.activatedConditions);
  const benefitTokens = BENEFIT_TOKENS.filter(token => conditions.has(token));
  if (benefitTokens.length > 1) throw new HumanL0ProcedureError('conflicting-conditions');
  const recordedBenefit = request.recorded.find(row => row.stepId === 'core.ancestry-benefit');
  if (recordedBenefit?.choiceId && benefitTokens.length && recordedBenefit.choiceId !== benefitTokens[0].slice('benefit:'.length)) {
    throw new HumanL0ProcedureError('conflicting-conditions');
  }
  if (recordedBenefit?.choiceId === 'random-profession') conditions.add('benefit:random-profession');
  if (recordedBenefit?.choiceId === 'speak-language') conditions.add('benefit:speak-language');

  const altered = new Set(request.alteredStepIds);
  const selectedOptional = new Set(request.selectedOptionalStepIds);
  const applicable = HUMAN_L0_PROCEDURE_STEPS.filter(step => step.branch === request.branch || step.branch === 'shared')
    .filter(step => request.ancestryVariant === 'core' || (step.id !== 'core.ancestry-benefit' && step.id !== 'core.ancestry-random-profession'))
    .sort((a, b) => a.order[request.branch]! - b.order[request.branch]!);

  const steps: ProcedureExposureStep[] = applicable.map(step => {
    const recorded = request.recorded.find(row => row.stepId === step.id && (row.branch === step.branch || step.branch === 'shared'));
    const conditionMet = step.requirement !== 'conditional' || (step.condition !== null && conditions.has(step.condition)) || !!recorded;
    const optionalSelected = step.requirement !== 'optional' || selectedOptional.has(step.id) || !!recorded;
    const skipped = step.requirement === 'conditional' && !conditionMet;
    const family = step.id === 'dev.family-profession' ? familySurface(conditions, !skipped) : null;
    const surface = family?.surface ?? step.playerSurface;
    const candidates = family ? family.candidates : step.choice ? [...step.choice.candidates] : [];
    const manualField = family ? family.manualField : step.choice?.manualField ?? false;
    const sourceUnavailable = request.interestingThingsSource === 'unavailable' && (SOURCE_STEPS as readonly string[]).includes(step.id);
    const reasons = [...step.pendingReasons];
    if (sourceUnavailable && !reasons.includes('disabled-source')) reasons.push('disabled-source');
    if (conditions.has('recursion-at-limit') && !skipped && (step.id === 'dev.piety' || step.id === 'dev.sibling-recursion') && !reasons.includes('bounded-recursion')) {
      reasons.push('bounded-recursion');
    }
    const recordedSource = request.recorded.find(row => row.stepId === 'shared.interesting-source');
    const sourceChanged = (SOURCE_STEPS as readonly string[]).includes(step.id) && !!recordedSource?.choiceId
      && recordedSource.choiceId !== request.interestingThingsSource;
    const priorAltered = !skipped && step.dependsOn.some(dependency => altered.has(dependency));
    const selfAltered = !skipped && altered.has(step.id);
    const reviews: ProcedureExposureStep['reviews'] = [];
    if (sourceChanged) reviews.push({ reason: 'source-changed', migrates: false, retainsLastChoice: true, lastChoiceId: recordedSource?.choiceId ?? null });
    if (priorAltered || selfAltered) reviews.push({ reason: 'prior-altered', migrates: false, retainsLastChoice: true, lastChoiceId: recorded?.choiceId ?? null });
    const dataRefs = step.id === 'core.interesting-grant' || step.id === 'dev.interesting-initial' || step.id === 'dev.interesting-extra'
      ? interestingRefs(request.interestingThingsSource, step.pendingMatrixId ?? 'core-initial-thing', step.id === 'core.interesting-grant' ? 'lote-core' : 'lote-only-human')
      : step.dataRefs.map(row => ({ ...row }));
    const awaitsLot = dataRefs.some(row => row.availability === 'pending-lot');
    const blocks: ProcedureExposureStep['blocks'] = skipped ? [] : [
      ...(awaitsLot ? ['awaits-lot' as const] : []),
      'handler-absent' as const,
    ];
    const slotState: ProcedureExposureStep['slotState'] = skipped ? 'skipped-condition'
      : reviews.length ? 'needs-review'
        : step.requirement === 'optional' && !optionalSelected ? 'not-started'
          : 'pending';
    return {
      stepId: step.id, branch: step.branch, order: step.order[request.branch]!, orderBasis: step.orderBasis,
      requirement: step.requirement, condition: step.condition, cardinality: step.cardinality, playerSurface: surface,
      step5Group: step.step5Group, groupsTouched: step.groupsTouched, groupOrderImplied: false, slotState,
      visibility: skipped ? 'hidden-until-condition' : 'visible', dataRefs,
      choice: surface === 'choice-slot' || manualField ? {
        candidates, resolvedItemId: null, manualField, uniformDie: false, candidateKind: step.choice?.candidateKind ?? 'profession-category',
      } : null,
      pending: skipped ? [] : pendingFor(step, reasons, candidates),
      issue: !skipped && step.readsPrior ? { code: 'lookup-missing-prior', adapterSurface: 'slot-and-chip', retainsConsequence: false } : null,
      reviews, blocks, commandId: null, roll: null, optionsSelectable: false, lastChoiceId: recorded?.choiceId ?? null,
      activation: step.activation, forbidsTable: step.forbidsTable, publishedModes: step.publishedModes,
      publishedSelection: step.publishedSelection, notes: step.notes,
    };
  });

  const invalidated: ProcedureInvalidation[] = [];
  for (const row of request.recorded) {
    const inPlan = steps.some(step => step.stepId === row.stepId);
    if (inPlan) continue;
    const defined = HUMAN_L0_PROCEDURE_STEPS.find(step => step.id === row.stepId);
    if (!defined) continue;
    const otherBranch = defined.branch !== 'shared' && defined.branch !== request.branch;
    invalidated.push({
      stepId: row.stepId, previousBranch: row.branch, slotState: 'needs-review',
      reviewReason: otherBranch ? 'exclusive-branch' : 'core-benefit-not-applicable',
      migrates: false, retainsLastChoice: true, lastChoiceId: row.choiceId,
    });
  }

  const retainedGaps: ProcedureRetainedGap[] = request.branch === 'human-development' ? [
    ...RETAINED_GAPS.map(gap => ({
      matrixId: gap.matrixId, reason: gap.reason, pendencyKind: PENDING_REASON_ADAPTER[gap.reason].pendencyKind,
      retainsConsequence: true as const, activatesRoll: false as const, active: true,
    })),
    {
      matrixId: 'finding:recursion', reason: 'bounded-recursion', pendencyKind: 'adjudication' as const,
      retainsConsequence: true as const, activatesRoll: false as const, active: conditions.has('recursion-at-limit'),
    },
  ] : [];

  return {
    contract: HUMAN_L0_PROCEDURE_CONTRACT, contractVersion: HUMAN_L0_PROCEDURE_CONTRACT_VERSION,
    proceduresComplete: false, fullyResolved: false, officialGenerationEnabled: false, rulesetEnabled: false, rollsDice: false,
    branch: request.branch, step5Groups: STEP5_GROUPS,
    attributeMode: { mode: request.attributeMode, matrixId: 'procedure:human-attributes', independentOfTableProcedure: true, invalidatesProcedureSteps: false },
    policy: HUMAN_L0_PROCEDURE_POLICY, steps, invalidated, retainedGaps, deferred: HUMAN_L0_PROCEDURE_DEFERRED, outOfScope: OUT_OF_SCOPE,
  };
}
