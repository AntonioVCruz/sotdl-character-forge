import { z } from 'zod';
import { moneyToBits } from './starting-equipment-model';

/** Consumable tables/items contract. It does not revise `sotdl.human-l0.mechanics@1.0.0` or the frozen curation files. */
export const HUMAN_L0_CONSUMABLE_CONTRACT = 'sotdl.human-l0.consumable' as const;
export const HUMAN_L0_CONSUMABLE_CONTRACT_VERSION = '1.0.0' as const;
export const HUMAN_L0_CONSUMABLE_COMPATIBILITY = {
  frozenCurationContract: '1.0.0',
  frozenFileCount: 16,
  mechanicsContract: 'sotdl.human-l0.mechanics',
  mechanicsContractVersion: '1.0.0',
  mechanicsProjection: '0.2.0',
  semanticsUnchanged: true,
} as const;

export const HASH_CHECK_BLOCKER = {
  id: 'act1-local-hash-check',
  count: 258,
  blocksSyntheticFixtures: false,
  evidenceStatus: 'declared-hash-not-recomputed',
  activities: [1],
} as const;

export const GROUPED_LOCAL_ONLY_MEMBERS = [
  { id: 'pilot-profession:core:martial:*', count: 12, activity: 3, reason: 'range-starts-not-reextracted' },
  { id: 'pilot-profession:core:religious:*', count: 7, activity: 3, reason: 'range-starts-not-reextracted' },
  { id: 'pilot-profession:core:wilderness:*', count: 17, activity: 3, reason: 'range-starts-not-reextracted' },
  { id: 'class:source-grant-only', count: 57, activity: 5, reason: 'catalog-group-not-individual' },
  { id: 'class:exact-definition-refs', count: 182, activity: 5, reason: 'catalog-group-not-individual' },
  { id: 'class:generic-editable-refs', count: 75, activity: 5, reason: 'catalog-group-not-individual' },
] as const;

export const PUBLISHED_CYCLE_IDS = [
  'only-human:character-fate', 'only-human:piety', 'only-human:siblings', 'only-human:strange',
] as const;

/** Activity 4 stays on consumable@1.0.0. Counts are the activity-1 matrix lots, not a new contract. */
export const ACTIVITY4_LOT_COUNTS = {
  ids: 506, onlyHuman: 227, oddities: 279, onlyHumanTables: 34, odditiesTables: 13,
  onlyHumanManuals: 8, onlyHumanSideRolls: 7, odditiesSideRolls: 13, links: 61,
  hashLines: 130, professionOptions: 67, professionProgramsDeferred: 66, developmentTemplates: 17,
} as const;

export const ACTIVITY4_MANUAL_IDS = [
  'finding:death-multiplicity', 'finding:dimension-order', 'finding:external-dependencies',
  'finding:outer-category-choice', 'finding:recursion', 'procedure:dimension-composition',
  'procedure:expanded-free-appearance', 'procedure:partial-literacy',
] as const;

export const ACTIVITY4_DEFERRED_TABLES = [
  'only-human:fears', 'only-human:desires', 'oddities:art', 'oddities:books',
  'oddities:ingredients', 'oddities:minor-magic', 'oddities:personal', 'oddities:pets',
] as const;

/** Complete authorized rules, shared by projection and gate; an id alone is not an authorization. */
export const ACTIVITY4_LIFESTYLE_MODIFIERS = [
  { id: 'lifestyle-modifier:life', delta: 1, results: [9, 10, 11, 12], tableId: 'only-human:life', afterDice: true },
  { id: 'lifestyle-modifier:major-setback:5-8', delta: -3, results: [5, 8], tableId: 'only-human:major-setback', afterDice: true },
  { id: 'lifestyle-modifier:major-setback:10', delta: -1, results: [10], tableId: 'only-human:major-setback', afterDice: true },
  { id: 'lifestyle-modifier:minor-setback', delta: -1, results: [4, 10, 19], tableId: 'only-human:minor-setback', afterDice: true },
  { id: 'lifestyle-modifier:minor-windfall', delta: 1, results: [2, 7], tableId: 'only-human:minor-windfall', afterDice: true },
  { id: 'lifestyle-modifier:major-windfall', delta: 3, results: [4, 13], tableId: 'only-human:major-windfall', afterDice: true },
] as const;
export const ACTIVITY4_LIFESTYLE_MODIFIER_IDS = ACTIVITY4_LIFESTYLE_MODIFIERS.map(rule => rule.id);

export const ACTIVITY4_ACT5_LOOKUPS = [
  'query:only-human:clothing', 'query:only-human:weapons', 'query:only-human:personal-gear',
  'query:only-human:special-gear', 'query:only-human:money',
] as const;

export const ACTIVITY4_LIFESTYLE_QUERY = 'query:starting-lifestyle:only-human' as const;
export const ACTIVITY4_ODDITY_SIDE_HOST = 'fixture:oddity-side-host' as const;

export const ACTIVITY4_OH_SIDE_ROLLS = [
  { id: 'side-roll:only-human:siblings:9-12', phase: 'creation', count: 1, sides: 3, modifier: 1, subject: 'relative', reading: 'total', parentRow: 'only-human:siblings:9-12' },
  { id: 'side-roll:only-human:siblings:13-16', phase: 'creation', count: 1, sides: 6, modifier: 2, subject: 'relative', reading: 'total', parentRow: 'only-human:siblings:13-16' },
  { id: 'side-roll:only-human:siblings:17-20', phase: 'creation', count: 2, sides: 6, modifier: 0, subject: 'relative', reading: 'total', parentRow: 'only-human:siblings:17-20' },
  { id: 'side-roll:only-human:minor-setback:13', phase: 'creation', count: 1, sides: 6, modifier: 0, subject: 'character', reading: 'parity', parentRow: 'only-human:minor-setback:13-13' },
  { id: 'side-roll:only-human:major-windfall:11', phase: 'use', count: 1, sides: 6, modifier: 0, subject: 'character', reading: 'total', parentRow: 'only-human:major-windfall:11-11' },
  { id: 'side-roll:only-human:strange:6', phase: 'creation', count: 1, sides: 6, modifier: 0, subject: 'character', reading: 'branch', parentRow: 'only-human:strange:6-6' },
  { id: 'side-roll:only-human:strange:16', phase: 'creation', count: 1, sides: 6, modifier: 0, subject: 'character', reading: 'branch', parentRow: 'only-human:strange:16-16' },
] as const;

/** Numeric topology of the 13 Oddities side rolls. Synthetic ids only; no published face ids. */
export const ACTIVITY4_ODDITY_SIDE_TOPOLOGY = [
  { phase: 'use', count: 1, sides: 20, modifier: 0 },
  { phase: 'creation', count: 1, sides: 20, modifier: 0 },
  { phase: 'creation', count: 1, sides: 20, modifier: 0 },
  { phase: 'use', count: 1, sides: 20, modifier: 0 },
  { phase: 'use', count: 1, sides: 6, modifier: 0 },
  { phase: 'use', count: 5, sides: 20, modifier: 0 },
  { phase: 'creation', count: 2, sides: 20, modifier: 0 },
  { phase: 'use', count: 1, sides: 6, modifier: 0 },
  { phase: 'use', count: 1, sides: 6, modifier: 0 },
  { phase: 'use', count: 1, sides: 20, modifier: 0 },
  { phase: 'creation', count: 1, sides: 6, modifier: 1 },
  { phase: 'creation', count: 1, sides: 20, modifier: 0 },
  { phase: 'use', count: 1, sides: 6, modifier: 0 },
] as const;

const choice = (candidates: readonly string[]) => ({ kind: 'choice' as const, candidates, resolvedItemId: null as null });
const notItem = { kind: 'not-an-item' as const };
const localOnly = { kind: 'local-only' as const, individualEvidence: false as const };

/** The 16 `selecionado-manual` matrix ids. Each one stays a typed pending; none is dropped or given an invented effect. */
export const MANUAL_RESOLUTION_SLOTS = [
  { matrixId: 'finding:death-multiplicity', reason: 'manual-procedure', linkedDefinition: notItem },
  { matrixId: 'finding:dimension-order', reason: 'manual-composition', linkedDefinition: notItem },
  { matrixId: 'finding:external-dependencies', reason: 'conditional-manual', linkedDefinition: notItem },
  { matrixId: 'finding:outer-category-choice', reason: 'manual-category-choice', linkedDefinition: notItem },
  { matrixId: 'finding:recursion', reason: 'bounded-recursion', linkedDefinition: notItem },
  { matrixId: 'extra:major-windfall-1-fallback', reason: 'conditional-branch', linkedDefinition: localOnly },
  { matrixId: 'item-ref:grant:core:kit:wealthy/grant/special/shield/shield', reason: 'choice-required', linkedDefinition: choice(['pilot-item:core:large-shield', 'pilot-item:core:small-shield']) },
  { matrixId: 'item-ref:grant:profession:pilot-profession:only-human:common:r11/grant/entertainer-clothing/costume/costume', reason: 'choice-required', linkedDefinition: choice(['pilot-item:core:elaborate-costume', 'pilot-item:core:simple-costume']) },
  { matrixId: 'item-ref:grant:profession:pilot-profession:only-human:common:r11/grant/entertainer-clothing/dress/dress', reason: 'choice-required', linkedDefinition: choice(['pilot-item:core:basic-dress', 'pilot-item:core:fancy-dress']) },
  { matrixId: 'item-ref:grant:profession:pilot-profession:only-human:military:r03/grant/spear', reason: 'choice-required', linkedDefinition: choice(['pilot-item:core:basic-spear', 'pilot-item:core:military-spear']) },
  { matrixId: 'item-ref:grant:profession:pilot-profession:only-human:wilderness:r17/grant/spear', reason: 'choice-required', linkedDefinition: choice(['pilot-item:core:basic-spear', 'pilot-item:core:military-spear']) },
  { matrixId: 'language:dead-languages', reason: 'open-category-language', linkedDefinition: notItem },
  { matrixId: 'language:secret-language', reason: 'open-category-language', linkedDefinition: notItem },
  { matrixId: 'procedure:dimension-composition', reason: 'no-extra-life-rolls', linkedDefinition: notItem },
  { matrixId: 'procedure:expanded-free-appearance', reason: 'player-fields', linkedDefinition: notItem },
  { matrixId: 'procedure:partial-literacy', reason: 'partial-literacy', linkedDefinition: notItem },
] as const;

export class HumanL0ConsumableError extends Error {
  constructor(public readonly code: string, public readonly pointer: string) {
    super(`${HUMAN_L0_CONSUMABLE_CONTRACT}@${HUMAN_L0_CONSUMABLE_CONTRACT_VERSION}#${pointer}: ${code}`);
    this.name = 'HumanL0ConsumableError';
  }
}
function fail(code: string, pointer = '/'): never {
  throw new HumanL0ConsumableError(code, pointer);
}

const id = z.string().regex(/^[a-z0-9][a-z0-9:_./#*+@-]{0,199}$/);
const label = z.string().regex(/^[a-z0-9-]{1,80}$/);
const currency = z.enum(['bits', 'cp', 'ss', 'gc']);
const pendingReason = z.enum([
  'manual-procedure', 'manual-composition', 'conditional-manual', 'manual-category-choice', 'bounded-recursion',
  'conditional-branch', 'choice-required', 'open-category-language', 'no-extra-life-rolls', 'player-fields',
  'partial-literacy', 'range-starts-not-reextracted', 'catalog-group-not-individual', 'possession-is-not-use',
  'unknown-price', 'generic-profile', 'disabled-source', 'external-branch', 'open-tail-domain',
  'weapon-no-defense', 'defense-bonus-not-substitution', 'manual-adjudication', 'activity-5-body',
  'declared-hash-not-recomputed', 'text-reference', 'unprojected-alternative',
]);
const link = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('not-an-item') }).strict(),
  z.object({ kind: z.literal('none') }).strict(),
  z.object({ kind: z.literal('local-only'), individualEvidence: z.boolean() }).strict(),
  z.object({ kind: z.literal('choice'), candidates: z.array(id).min(2).max(8), resolvedItemId: id.nullable() }).strict(),
]);
const effect = z.discriminatedUnion('op', [
  z.object({ op: z.literal('grant-language'), languageId: id, abilities: z.enum(['speak', 'read-write']), subject: z.literal('character'), timing: z.literal('creation') }).strict(),
  z.object({ op: z.literal('grant-profession'), professionId: id, subject: z.literal('character'), timing: z.literal('creation') }).strict(),
  z.object({ op: z.literal('grant-item'), itemId: id, quantity: z.number().int().positive().max(1000), unit: id, possession: z.literal('carried'), usageApplied: z.boolean(), timing: z.literal('creation') }).strict(),
  z.object({ op: z.literal('grant-currency'), amount: z.string().regex(/^\d+(?:\.\d+)?$/), denomination: currency, bits: z.string().regex(/^\d+$/), timing: z.literal('creation') }).strict(),
  z.object({ op: z.literal('substitute-defense'), when: z.enum(['equipped', 'wielded']), mode: z.enum(['substitute', 'add', 'stack']), base: z.enum(['agility', 'fixed']), value: z.number().int().nonnegative().max(100), timing: z.enum(['creation', 'on-equip', 'on-use', 'narrative']), possessionApplies: z.boolean() }).strict(),
  z.object({ op: z.literal('follow-subtable'), tableId: id, timing: z.literal('creation') }).strict(),
  z.object({ op: z.literal('narrative-marker'), code: label, timing: z.literal('narrative'), mutatesMechanics: z.literal(false) }).strict(),
  z.object({ op: z.literal('record-price'), priceKind: z.enum(['exact', 'minimum']), bits: z.string().regex(/^\d+$/), timing: z.literal('narrative'), mutatesMechanics: z.literal(false) }).strict(),
]);
export const HumanL0ConsequenceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('effect'), effect, pending: z.null() }).strict(),
  z.object({ kind: z.literal('pending'), effect: z.null(), pending: z.object({
    reason: pendingReason, retainsConsequence: z.literal(true),
    matrixSelection: z.enum(['selecionado-manual', 'bloqueado', 'adiado', 'agrupado']).nullable(),
    linkedDefinition: link,
  }).strict() }).strict(),
]);
const reference = z.object({
  publicationId: id, version: z.null(), entityId: id, resultId: id.nullable(), componentId: id.nullable(),
}).strict();
const dice = z.object({ count: z.number().int().min(1).max(4), sides: z.number().int().min(2).max(20) }).strict();
const sideDice = z.object({ count: z.number().int().min(1).max(10), sides: z.number().int().min(2).max(20) }).strict();
const weight = z.object({
  ways: z.string().regex(/^[1-9]\d*$/), denominator: z.string().regex(/^[1-9]\d*$/),
  basis: z.enum(['natural-dice-faces', 'uniform-per-row', 'invented']),
}).strict();
const row = z.object({
  id, min: z.number().int().nullable(), max: z.number().int().nullable(),
  tail: z.enum(['none', 'open-low', 'open-high']), publishedWeight: weight, consequence: HumanL0ConsequenceSchema,
}).strict();
const modifierDomain = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('none') }).strict(),
  z.object({ kind: z.literal('authorized'), values: z.array(z.number().int().min(-100).max(100)).min(1).max(20) }).strict(),
  z.object({ kind: z.literal('authorized-rules'), rules: z.array(id).min(1).max(8) }).strict(),
  z.object({ kind: z.literal('pending'), reason: z.literal('open-tail-domain') }).strict(),
]);
const column = z.object({ id, rollId: id, dice, modifierDomain, rows: z.array(row).min(1).max(100) }).strict();
const table = z.object({ id, kind: z.literal('weighted-table'), publishedCycle: z.boolean(), columns: z.array(column).min(1).max(8) }).strict();
const lookup = z.object({
  id, kind: z.literal('lookup'), dice: dice.nullable(),
  reads: z.object({ queryId: id, component: z.literal('result') }).strict(),
  keys: z.array(z.object({ key: id, consequence: HumanL0ConsequenceSchema }).strict()).min(1).max(20),
}).strict();
const sideRoll = z.object({
  id, parent: z.object({ tableId: id, columnId: id, rowId: id }).strict(),
  phase: z.enum(['creation', 'equip', 'use']), dice: sideDice, rollId: id,
  subject: z.enum(['character', 'relative', 'item']), frequency: z.enum(['once-per-origin', 'each-use']),
  appliesOnPossession: z.boolean(), when: z.object({ optionId: id.nullable() }).strict(), consequence: HumanL0ConsequenceSchema,
  modifier: z.number().int().min(-20).max(20).optional(),
  reading: z.enum(['total', 'parity', 'branch']).optional(),
}).strict();
const price = z.object({
  kind: z.enum(['exact', 'minimum', 'variable', 'unknown']),
  amount: z.string().nullable(), denomination: currency.nullable(), bits: z.string().nullable(),
}).strict();
const item = z.object({
  id, label, price, priceConsequence: HumanL0ConsequenceSchema,
  profile: z.enum(['none', 'armor', 'weapon', 'generic']), possessionAppliesEffects: z.boolean(),
  onPossess: HumanL0ConsequenceSchema, onEquip: HumanL0ConsequenceSchema.nullable(), onUse: HumanL0ConsequenceSchema.nullable(),
}).strict();
const grant = z.object({
  id, origin: reference, subject: z.enum(['character', 'relative']),
  precondition: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('always') }).strict(),
    z.object({ kind: z.literal('choice-selected'), optionId: id }).strict(),
    z.object({ kind: z.literal('prior-result'), queryId: id }).strict(),
  ]),
  frequency: z.literal('once'), source: z.enum(['table', 'lookup', 'profession', 'kit']), consequence: HumanL0ConsequenceSchema,
}).strict();
const event = z.object({
  id, originKey: id, origin: reference, subject: z.enum(['character', 'relative', 'item']),
  phase: z.enum(['creation', 'on-equip', 'on-use', 'narrative']), consequence: HumanL0ConsequenceSchema,
}).strict();
const localGroupLink = z.object({ kind: z.literal('local-only'), individualEvidence: z.boolean() }).strict();
const groupedPending = z.object({
  id, blockerId: z.literal('act3-act5-grouped-local-only'), activity: z.union([z.literal(3), z.literal(5)]),
  represents: z.number().int().positive(), linkedDefinition: localGroupLink,
  evidence: z.object({ kind: z.literal('local-only-group'), individualEvidence: z.boolean(), recomputedHash: z.string().nullable() }).strict(),
  weights: z.union([z.null(), z.record(z.string(), z.unknown())]),
  consequence: HumanL0ConsequenceSchema,
}).strict();

const hashBlocker = z.object({
  id: z.literal('act1-local-hash-check'), count: z.number().int().nonnegative(), blocksSyntheticFixtures: z.boolean(),
  evidenceStatus: z.string().min(1).max(80), activities: z.array(z.number().int()).min(1).max(4),
}).strict();
const groupedBlocker = z.object({
  id: z.literal('act3-act5-grouped-local-only'), count: z.number().int().nonnegative(),
  linkedDefinition: z.string().min(1).max(40), individualEvidence: z.boolean(),
  coreProfessionOptions: z.number().int().nonnegative(), catalogRecords: z.number().int().nonnegative(),
  activities: z.array(z.number().int()).min(1).max(4),
  members: z.array(z.object({
    id, count: z.number().int().positive(), activity: z.union([z.literal(3), z.literal(5)]), reason: pendingReason,
  }).strict()).max(20),
}).strict();

const activity4Schema = z.object({
  lots: z.tuple([z.literal('lote-only-human'), z.literal('lote-oddities')]),
  counts: z.object({
    ids: z.literal(ACTIVITY4_LOT_COUNTS.ids),
    onlyHuman: z.literal(ACTIVITY4_LOT_COUNTS.onlyHuman),
    oddities: z.literal(ACTIVITY4_LOT_COUNTS.oddities),
    onlyHumanTables: z.literal(ACTIVITY4_LOT_COUNTS.onlyHumanTables),
    odditiesTables: z.literal(ACTIVITY4_LOT_COUNTS.odditiesTables),
    onlyHumanManuals: z.literal(ACTIVITY4_LOT_COUNTS.onlyHumanManuals),
    onlyHumanSideRolls: z.literal(ACTIVITY4_LOT_COUNTS.onlyHumanSideRolls),
    odditiesSideRolls: z.literal(ACTIVITY4_LOT_COUNTS.odditiesSideRolls),
    links: z.literal(ACTIVITY4_LOT_COUNTS.links),
    hashLines: z.literal(ACTIVITY4_LOT_COUNTS.hashLines),
    hashLinesMaterialized: z.literal(0),
    professionOptions: z.literal(ACTIVITY4_LOT_COUNTS.professionOptions),
    professionProgramsDeferred: z.literal(ACTIVITY4_LOT_COUNTS.professionProgramsDeferred),
    developmentTemplates: z.literal(ACTIVITY4_LOT_COUNTS.developmentTemplates),
  }).strict(),
  hashLines: z.object({
    count: z.literal(ACTIVITY4_LOT_COUNTS.hashLines),
    materialized: z.number().int().nonnegative(),
    weights: z.union([z.null(), z.record(z.string(), z.unknown())]),
    reason: z.literal('declared-hash-not-recomputed'),
  }).strict(),
  ancestryProcedures: z.tuple([
    z.object({ id: z.literal('human-development'), role: z.literal('default'), sourceId: z.literal('sotdl:only-human'), projected: z.literal(true), activity: z.literal(4) }).strict(),
    z.object({ id: z.literal('core-alternative'), role: z.literal('alternative'), sourceId: z.literal('sotdl:shadow-of-the-demon-lord-core'), projected: z.literal(false), activity: z.literal(3) }).strict(),
  ]),
  interestingThings: z.object({
    id: z.literal('selected:interesting-things-router'),
    defaultVariant: z.literal('oddities'),
    alternativeVariant: z.literal('core'),
    alternativeProjected: z.literal(false),
    alternativeActivity: z.literal(3),
    silentFallback: z.boolean(),
    disabledSource: z.literal('pending'),
  }).strict(),
  queries: z.object({
    startingLifestyle: z.object({
      id: z.literal(ACTIVITY4_LIFESTYLE_QUERY),
      producedBy: z.object({ tableId: z.literal('only-human:lifestyle'), columnId: z.literal('main') }).strict(),
      openTail: z.literal(true),
      modifiersAfterDice: z.literal(true),
    }).strict(),
    professionFaces: z.object({
      id: z.literal('query:profession-faces:only-human'),
      selector: z.literal('only-human:profession-router'),
      religiousChild: z.literal('1d6'),
      otherChildren: z.literal('1d20'),
      uniform: z.literal(false),
    }).strict(),
    familyCategory: z.object({
      id: z.literal('query:family-category'),
      dice: z.union([z.null(), dice]),
      uniformDie: z.literal(false),
      missingContext: z.literal('pending'),
    }).strict(),
  }).strict(),
  lifestyleModifiers: z.array(z.object({
    id, delta: z.number().int().min(-20).max(20), results: z.array(z.number().int().min(1).max(20)).min(1).max(8),
    tableId: id, afterDice: z.literal(true),
  }).strict()).length(6),
  act5Slots: z.array(z.object({
    id, kind: z.enum(['lifestyle-lookup', 'kit-program', 'profession-program']),
    readsQueryId: z.literal(ACTIVITY4_LIFESTYLE_QUERY).nullable(),
    body: z.union([z.null(), z.object({ present: z.literal(true) }).strict()]),
    activity: z.literal(5),
    familyGrantsGear: z.boolean(),
  }).strict()).max(120),
  links: z.array(z.object({
    id, from: id, to: id, kind: id, automaticExecution: z.boolean(),
  }).strict()).max(80),
  professionOptions: z.array(z.object({
    id, programId: id.nullable(), familyGrantsGear: z.boolean(), inRandomPool: z.boolean(),
  }).strict()).max(80),
  developmentTemplates: z.array(z.object({ id, tableId: id, pending: z.literal(true) }).strict()).max(30),
  interestingGrants: z.array(z.object({
    id, additional: z.boolean(), bindsSelector: z.literal(true), projected: z.boolean(),
    activity: z.union([z.literal(3), z.literal(4)]),
  }).strict()).max(8),
  textReference: z.object({
    id: z.literal('oddities:books:20'),
    kind: z.literal('text-reference'),
    hook: z.object({ id: z.literal('dark-passages-books-and-passages'), enabled: z.boolean() }).strict(),
    consequence: HumanL0ConsequenceSchema,
  }).strict(),
  deferredTables: z.array(z.object({ id, weights: z.null(), materializedLines: z.literal(0) }).strict()).max(12),
  cycleWalk: z.array(z.object({
    from: z.object({ tableId: id, rowId: id }).strict(), to: id,
  }).strict()).length(4),
  odditySideRolls: z.object({
    topology: z.literal('synthetic'), realFaceIds: z.literal(false), count: z.literal(13), host: z.literal(ACTIVITY4_ODDITY_SIDE_HOST),
  }).strict(),
}).strict();

export const HumanL0ConsumableDocumentSchema = z.object({
  contract: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT),
  contractVersion: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION),
  distribution: z.literal('public-synthetic'),
  fictionalData: z.boolean(),
  reviewStatus: z.enum(['curated', 'needs-review', 'incomplete']),
  rulesetEnabled: z.boolean(),
  importablePack: z.boolean(),
  promotesReview: z.boolean(),
  compatibility: z.object({
    frozenCurationContract: z.string(), frozenFileCount: z.number().int(),
    mechanicsContract: z.string(), mechanicsContractVersion: z.string(), mechanicsProjection: z.string(),
    semanticsUnchanged: z.boolean(),
  }).strict(),
  matrix: z.object({
    activity: z.literal(1), closure: z.literal('pending-act1-local-hash-check'), sourceVersion: z.null(),
    path: z.literal('docs/matriz-lacunas-issue34-atividade1.json'),
  }).strict(),
  blockers: z.tuple([hashBlocker, groupedBlocker]),
  recursion: z.object({
    maxDepth: z.number().int().min(1).max(32), onLimit: z.enum(['pending', 'reroll', 'discard']),
    pendingReason: z.literal('bounded-recursion'), silentReroll: z.boolean(), discardOutcome: z.boolean(),
  }).strict(),
  unprojectedPublishedCycles: z.array(z.object({ id, projected: z.boolean() }).strict()).max(8),
  choices: z.array(z.object({ id, options: z.array(id).min(2).max(8) }).strict()).max(20),
  producedQueries: z.array(z.object({ id, producedBy: z.object({ tableId: id, columnId: id }).strict() }).strict()).max(20),
  tables: z.array(table).min(1).max(48),
  lookups: z.array(lookup).max(20),
  sideRolls: z.array(sideRoll).max(48),
  items: z.array(item).max(40),
  grants: z.array(grant).max(40),
  events: z.array(event).max(40),
  groupedPendings: z.array(groupedPending).max(20),
  manualResolutions: z.array(z.object({ matrixId: id, consequence: HumanL0ConsequenceSchema }).strict()).max(40),
  activityLot: z.literal(4).optional(),
  activity4: activity4Schema.optional(),
}).strict();
export type HumanL0ConsumableDocument = z.infer<typeof HumanL0ConsumableDocumentSchema>;

const resolutionEntry = z.object({
  originKey: id, origin: reference, subject: z.enum(['character', 'relative', 'item']),
  phase: z.enum(['creation', 'on-equip', 'on-use', 'narrative']), consequence: HumanL0ConsequenceSchema,
}).strict();
export const HumanL0ConsumableResolutionSchema = z.object({
  contract: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT),
  contractVersion: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION),
  rolled: z.boolean(), rulesetEnabled: z.boolean(),
  input: z.object({ contextId: id, resultId: id }).strict(),
  consequences: z.array(resolutionEntry).max(100),
}).strict();
export type HumanL0ConsumableResolution = z.infer<typeof HumanL0ConsumableResolutionSchema>;

type Effect = z.infer<typeof effect>;
type Consequence = z.infer<typeof HumanL0ConsequenceSchema>;

const stable = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, child]) => `${JSON.stringify(key)}:${stable(child)}`).join(',')}}`;
  return JSON.stringify(value);
};
const same = (a: unknown, b: unknown) => stable(a) === stable(b);
const originKeyOf = (origin: { publicationId: string; entityId: string; resultId: string | null; componentId: string | null }) =>
  `${origin.publicationId}@null/${origin.entityId}/${origin.resultId ?? 'null'}/${origin.componentId ?? 'null'}`;
const defenseSlotReasons = new Set(['weapon-no-defense', 'defense-bonus-not-substitution']);

function placeForPhase(phase: 'creation' | 'on-equip' | 'on-use' | 'narrative') {
  if (phase === 'on-equip') return 'equip';
  if (phase === 'on-use') return 'use';
  if (phase === 'creation') return 'possess';
  return 'lookup';
}

function enumerateDice(diceValue: { count: number; sides: number }) {
  let counts = new Map<number, bigint>([[0, 1n]]);
  for (let roll = 0; roll < diceValue.count; roll++) {
    const next = new Map<number, bigint>();
    for (const [total, ways] of counts) for (let face = 1; face <= diceValue.sides; face++) next.set(total + face, (next.get(total + face) ?? 0n) + ways);
    counts = next;
  }
  counts.delete(0);
  return counts;
}

function characterEffect(effectValue: Effect) {
  return effectValue.op !== 'narrative-marker' && effectValue.op !== 'record-price';
}

function assertUnique(values: string[], code: string, pointer: string) {
  if (new Set(values).size !== values.length) fail(code, pointer);
}

function assertConsequence(consequence: Consequence, place: string, pointer: string, subject: 'character' | 'relative' | 'item' | null) {
  if (consequence.kind === 'pending') {
    if (consequence.pending.linkedDefinition.kind === 'local-only' && consequence.pending.linkedDefinition.individualEvidence !== false)
      fail('grouped-as-individual-evidence', pointer);
    if (consequence.pending.linkedDefinition.kind === 'choice' && consequence.pending.linkedDefinition.resolvedItemId !== null)
      fail('choice-resolved-early', pointer);
    return;
  }
  const value = consequence.effect;
  if (subject === 'relative' && characterEffect(value)) fail('relative-is-not-character', pointer);
  if (value.op === 'grant-item' && value.usageApplied) fail('possession-applies-use', pointer);
  if (value.op === 'grant-currency') {
    let bits = '';
    try { bits = moneyToBits(value.amount, value.denomination); } catch { fail('currency-not-exact', pointer); }
    if (bits !== value.bits) fail('currency-not-exact', pointer);
  }
  if (place === 'side-creation' && value.op !== 'narrative-marker' && value.timing !== 'creation') fail('side-roll-phase-mismatch', pointer);
  if (place === 'side-equip' && value.op !== 'narrative-marker' && !(value.op === 'substitute-defense' && value.timing === 'on-equip')) fail('side-roll-phase-mismatch', pointer);
  if (place === 'side-use' && value.op !== 'narrative-marker' && !(value.op === 'substitute-defense' && value.timing === 'on-use')) fail('side-roll-phase-mismatch', pointer);
  if (value.op === 'substitute-defense') {
    if (value.possessionApplies || place === 'possess' || place === 'row' || place === 'grant' || place === 'lookup' || place === 'price' || place === 'side-creation')
      fail('defense-on-possession', pointer);
    if (value.mode !== 'substitute') fail('defense-not-substitution', pointer);
    const equipped = value.when === 'equipped' && value.timing === 'on-equip' && (place === 'equip' || place === 'side-equip');
    const wielded = value.when === 'wielded' && value.timing === 'on-use' && (place === 'use' || place === 'side-use');
    if (!equipped && !wielded) fail('defense-requires-equip-or-use', pointer);
  }
  if (value.op === 'record-price' && place !== 'price') fail('price-consequence', pointer);
  if (value.op === 'follow-subtable' && place !== 'row') fail('subtable-placement', pointer);
}

function assertDefenseSlot(slot: Consequence | null, when: 'equipped' | 'wielded', pointer: string) {
  if (!slot) return;
  const place = when === 'equipped' ? 'equip' : 'use';
  if (slot.kind === 'pending') {
    if (!defenseSlotReasons.has(slot.pending.reason)) fail('profile-mismatch', pointer);
    assertConsequence(slot, place, pointer, 'character');
    return;
  }
  assertConsequence(slot, place, pointer, 'character');
  if (slot.effect.op !== 'substitute-defense' || slot.effect.when !== when) fail('defense-not-substitution', pointer);
}

function checkColumn(columnValue: HumanL0ConsumableDocument['tables'][number]['columns'][number], pointer: string, groupedIds: Set<string>) {
  const open = columnValue.rows.some(rowValue => rowValue.tail !== 'none');
  if (open && columnValue.modifierDomain.kind === 'none') fail('open-tail-domain', `${pointer}/modifierDomain`);
  if (!open && columnValue.modifierDomain.kind !== 'none') fail('modifier-domain', `${pointer}/modifierDomain`);
  if (columnValue.modifierDomain.kind === 'authorized' && new Set(columnValue.modifierDomain.values).size !== columnValue.modifierDomain.values.length)
    fail('modifier-domain', `${pointer}/modifierDomain`);
  if (columnValue.modifierDomain.kind === 'authorized-rules' && new Set(columnValue.modifierDomain.rules).size !== columnValue.modifierDomain.rules.length)
    fail('modifier-domain', `${pointer}/modifierDomain`);
  let openLow = 0, openHigh = 0;
  for (const [index, rowValue] of columnValue.rows.entries()) {
    const rowPointer = `${pointer}/rows/${index}`;
    if (groupedIds.has(rowValue.id)) fail('grouped-as-individual-evidence', rowPointer);
    if (rowValue.tail === 'open-low') { openLow++; if (rowValue.min !== null || rowValue.max === null) fail('open-tail-shape', rowPointer); }
    else if (rowValue.tail === 'open-high') { openHigh++; if (rowValue.max !== null || rowValue.min === null) fail('open-tail-shape', rowPointer); }
    else if (rowValue.min === null || rowValue.max === null || rowValue.min > rowValue.max) fail('open-tail-shape', rowPointer);
    const naturalMin = columnValue.dice.count, naturalMax = columnValue.dice.count * columnValue.dice.sides;
    const finite = rowValue.tail === 'open-low' ? rowValue.max : rowValue.tail === 'open-high' ? rowValue.min : rowValue.min;
    const finiteMax = rowValue.tail === 'none' ? rowValue.max : finite;
    if (finite === null || finite < naturalMin || finite > naturalMax || (rowValue.tail === 'none' && (finiteMax === null || finiteMax > naturalMax)))
      fail('range-outside-die', rowPointer);
    if (rowValue.publishedWeight.basis !== 'natural-dice-faces') fail('uniform-row-weight', `${rowPointer}/publishedWeight`);
  }
  if (openLow > 1 || openHigh > 1) fail('open-tail-shape', pointer);
  const ordered = [...columnValue.rows].sort((a, b) => (a.min ?? Number.NEGATIVE_INFINITY) - (b.min ?? Number.NEGATIVE_INFINITY));
  if (ordered.some((rowValue, index) => rowValue.id !== columnValue.rows[index].id)) fail('range-coverage', pointer);
  if (openLow && columnValue.rows[0].tail !== 'open-low') fail('open-tail-shape', pointer);
  if (openHigh && columnValue.rows.at(-1)?.tail !== 'open-high') fail('open-tail-shape', pointer);
  for (let index = 1; index < columnValue.rows.length; index++) {
    const previous = columnValue.rows[index - 1], current = columnValue.rows[index];
    if (previous.max === null || current.min === null || current.min !== previous.max + 1) fail('range-coverage', `${pointer}/rows/${index}`);
  }
  const totals = enumerateDice(columnValue.dice);
  const ways = new Map(columnValue.rows.map(rowValue => [rowValue.id, 0n]));
  for (const [total, count] of totals) {
    const matching = columnValue.rows.filter(rowValue => (rowValue.min === null || total >= rowValue.min) && (rowValue.max === null || total <= rowValue.max));
    if (matching.length !== 1) fail('range-coverage', pointer);
    ways.set(matching[0].id, (ways.get(matching[0].id) ?? 0n) + count);
  }
  const denominator = (BigInt(columnValue.dice.sides) ** BigInt(columnValue.dice.count)).toString();
  for (const [index, rowValue] of columnValue.rows.entries()) {
    const natural = ways.get(rowValue.id) ?? 0n;
    if (natural === 0n) fail('range-coverage', `${pointer}/rows/${index}`);
    const rowPointer = `${pointer}/rows/${index}/publishedWeight`;
    if (rowValue.publishedWeight.denominator !== denominator) fail(rowValue.tail === 'none' ? 'weight-mismatch' : 'open-tail-weight-invented', rowPointer);
    if (rowValue.publishedWeight.ways !== natural.toString()) fail(rowValue.tail === 'none' ? 'weight-mismatch' : 'open-tail-weight-invented', rowPointer);
    assertConsequence(rowValue.consequence, 'row', `${pointer}/rows/${index}/consequence`, 'character');
  }
}

function assertActivity4(doc: HumanL0ConsumableDocument) {
  const lot = doc.activity4;
  if (!lot) return fail('activity4-incomplete', '/activity4');
  const pointer = '/activity4';
  if (lot.hashLines.materialized !== 0 || lot.hashLines.weights !== null) fail('hash-line-materialized', `${pointer}/hashLines`);
  if (!same(lot.deferredTables.map(row => row.id), [...ACTIVITY4_DEFERRED_TABLES])) fail('hash-line-materialized', `${pointer}/deferredTables`);
  const tableIds = new Set(doc.tables.map(tableValue => tableValue.id));
  for (const deferredId of ACTIVITY4_DEFERRED_TABLES) if (tableIds.has(deferredId)) fail('hash-line-materialized', '/tables');
  for (const tableValue of doc.tables) for (const columnValue of tableValue.columns) for (const rowValue of columnValue.rows) {
    if (rowValue.id === 'oddities:books:20' || ACTIVITY4_DEFERRED_TABLES.some(deferredId => rowValue.id.startsWith(`${deferredId}:`) || rowValue.id.startsWith(`${deferredId}#`)))
      fail('hash-line-materialized', '/tables');
  }
  if (lot.interestingThings.silentFallback) fail('silent-core-fallback', `${pointer}/interestingThings`);
  if (lot.queries.familyCategory.dice !== null) fail('family-uniform-die', `${pointer}/queries/familyCategory`);
  if (lot.textReference.hook.enabled) fail('hook-enabled', `${pointer}/textReference/hook`);
  if (lot.textReference.consequence.kind !== 'pending' || lot.textReference.consequence.pending.reason !== 'text-reference')
    fail('text-reference-is-generator', `${pointer}/textReference/consequence`);
  if (lot.links.length !== ACTIVITY4_LOT_COUNTS.links) fail('link-count', `${pointer}/links`);
  for (const [index, link] of lot.links.entries()) if (link.automaticExecution) fail('link-executes', `${pointer}/links/${index}`);
  if (!same(lot.lifestyleModifiers, ACTIVITY4_LIFESTYLE_MODIFIERS)) fail('modifier-domain', `${pointer}/lifestyleModifiers`);
  const lifestyle = doc.tables.find(tableValue => tableValue.id === 'only-human:lifestyle');
  const childhood = doc.tables.find(tableValue => tableValue.id === 'only-human:childhood');
  if (!lifestyle || lifestyle.columns[0].modifierDomain.kind !== 'authorized-rules' || !same(lifestyle.columns[0].modifierDomain.rules, [...ACTIVITY4_LIFESTYLE_MODIFIER_IDS]))
    fail('modifier-domain', '/tables');
  if (!childhood || childhood.columns[0].modifierDomain.kind !== 'authorized' || !same(childhood.columns[0].modifierDomain.values, [-6, -3, -1, 0, 1, 3, 6]))
    fail('modifier-domain', '/tables');
  if (!doc.producedQueries.some(query => query.id === ACTIVITY4_LIFESTYLE_QUERY && query.producedBy.tableId === 'only-human:lifestyle' && query.producedBy.columnId === 'main'))
    fail('lookup-missing-prior', '/producedQueries');
  if (doc.lookups.some(lookup => (ACTIVITY4_ACT5_LOOKUPS as readonly string[]).includes(lookup.id))) fail('act5-body-present', '/lookups');
  const lookupSlots = lot.act5Slots.filter(slot => slot.kind === 'lifestyle-lookup').map(slot => slot.id);
  const kitSlots = lot.act5Slots.filter(slot => slot.kind === 'kit-program').map(slot => slot.id);
  const kits = ['destitute', 'poor', 'getting-by', 'comfortable', 'wealthy', 'rich'].map(name => `only-human:kit:${name}`);
  if (!same(lookupSlots, [...ACTIVITY4_ACT5_LOOKUPS]) || !same(kitSlots, kits)) fail('act5-body-present', `${pointer}/act5Slots`);
  for (const slot of lot.act5Slots) {
    if (slot.body !== null) fail('act5-body-present', `${pointer}/act5Slots`);
    if (slot.familyGrantsGear) fail('family-grants-gear', `${pointer}/act5Slots`);
    if (slot.kind === 'profession-program' ? slot.readsQueryId !== null : slot.readsQueryId !== ACTIVITY4_LIFESTYLE_QUERY)
      fail('lookup-missing-prior', `${pointer}/act5Slots`);
  }
  if (lot.professionOptions.length !== ACTIVITY4_LOT_COUNTS.professionOptions) fail('activity4-incomplete', `${pointer}/professionOptions`);
  const programs = lot.professionOptions.filter(option => option.programId !== null);
  if (programs.length !== ACTIVITY4_LOT_COUNTS.professionProgramsDeferred) fail('activity4-incomplete', `${pointer}/professionOptions`);
  for (const option of lot.professionOptions) {
    if (option.familyGrantsGear) fail('family-grants-gear', `${pointer}/professionOptions`);
    if (option.programId === null) {
      if (option.id !== 'pilot-profession:only-human:direct:occult' || option.inRandomPool) fail('activity4-incomplete', `${pointer}/professionOptions`);
    } else if (option.programId !== `profession:${option.id}` || !option.inRandomPool) fail('activity4-incomplete', `${pointer}/professionOptions`);
  }
  const programSlots = new Set(lot.act5Slots.filter(slot => slot.kind === 'profession-program').map(slot => slot.id));
  if (programSlots.size !== programs.length || programs.some(option => option.programId === null || !programSlots.has(option.programId)))
    fail('act5-body-present', `${pointer}/act5Slots`);
  if (lot.developmentTemplates.length !== ACTIVITY4_LOT_COUNTS.developmentTemplates || lot.developmentTemplates.some(row => !row.pending))
    fail('activity4-incomplete', `${pointer}/developmentTemplates`);
  for (const manualId of ACTIVITY4_MANUAL_IDS) {
    const row = doc.manualResolutions.find(item => item.matrixId === manualId);
    if (!row || row.consequence.kind !== 'pending') fail('manual-resolution-mismatch', '/manualResolutions');
  }
  const router = doc.tables.find(tableValue => tableValue.id === 'oddities:thing-router');
  const routeWays = router?.columns[0].rows.map(row => row.publishedWeight.ways) ?? [];
  if (!router || router.columns[0].dice.count !== 1 || router.columns[0].dice.sides !== 20 || new Set(routeWays).size < 2)
    fail('selector-weight-uniform', '/tables');
  const religious = doc.tables.find(tableValue => tableValue.id === 'only-human:religious');
  const common = doc.tables.find(tableValue => tableValue.id === 'only-human:common');
  const selector = doc.tables.find(tableValue => tableValue.id === 'only-human:profession-router');
  if (!religious || religious.columns[0].dice.count !== 1 || religious.columns[0].dice.sides !== 6) fail('activity4-incomplete', '/tables');
  if (!common || common.columns[0].dice.count !== 1 || common.columns[0].dice.sides !== 20) fail('activity4-incomplete', '/tables');
  if (!selector || selector.columns[0].dice.count !== 1 || selector.columns[0].dice.sides !== 6) fail('activity4-incomplete', '/tables');
  const humanRolls = doc.sideRolls.filter(roll => roll.id.startsWith('side-roll:only-human:'));
  if (humanRolls.length !== ACTIVITY4_OH_SIDE_ROLLS.length) fail('side-roll-shape', '/sideRolls');
  for (const [index, expected] of ACTIVITY4_OH_SIDE_ROLLS.entries()) {
    const roll = humanRolls[index];
    if (!roll || roll.id !== expected.id || roll.phase !== expected.phase || roll.subject !== expected.subject ||
        roll.dice.count !== expected.count || roll.dice.sides !== expected.sides || roll.modifier !== expected.modifier ||
        roll.reading !== expected.reading || roll.parent.rowId !== expected.parentRow || roll.parent.tableId !== expected.parentRow.slice(0, expected.parentRow.lastIndexOf(':')) ||
        roll.appliesOnPossession || roll.when.optionId !== null)
      fail('side-roll-shape', `/sideRolls/${index}`);
  }
  const oddRolls = doc.sideRolls.filter(roll => roll.id.startsWith('fixture:oddity-side:'));
  if (oddRolls.length !== ACTIVITY4_ODDITY_SIDE_TOPOLOGY.length) fail('side-roll-shape', '/sideRolls');
  for (const [index, expected] of ACTIVITY4_ODDITY_SIDE_TOPOLOGY.entries()) {
    const roll = oddRolls[index];
    if (!roll || roll.phase !== expected.phase || roll.dice.count !== expected.count || roll.dice.sides !== expected.sides ||
        roll.modifier !== expected.modifier || roll.subject !== 'item' || roll.when.optionId !== null || roll.appliesOnPossession ||
        roll.parent.tableId !== ACTIVITY4_ODDITY_SIDE_HOST)
      fail('side-roll-shape', `/sideRolls/${index}`);
  }
  if (doc.sideRolls.some(roll => roll.id.startsWith('oddities:'))) fail('side-roll-shape', '/sideRolls');
  for (const [index, edge] of lot.cycleWalk.entries()) {
    const tableValue = doc.tables.find(item => item.id === edge.from.tableId);
    const row = tableValue?.columns.flatMap(columnValue => columnValue.rows).find(item => item.id === edge.from.rowId);
    if (!tableValue?.publishedCycle || row?.consequence.kind !== 'effect' || row.consequence.effect.op !== 'follow-subtable' || row.consequence.effect.tableId !== edge.to)
      fail('cycle-not-projected', `${pointer}/cycleWalk/${index}`);
  }
  const projectedHuman = doc.tables.filter(tableValue => tableValue.id.startsWith('only-human:')).length;
  const projectedOddities = doc.tables.filter(tableValue => tableValue.id.startsWith('oddities:')).length;
  const deferredOddities = ACTIVITY4_DEFERRED_TABLES.filter(deferredId => deferredId.startsWith('oddities:')).length;
  if (projectedHuman !== ACTIVITY4_LOT_COUNTS.onlyHumanTables - 2) fail('activity4-incomplete', '/tables');
  if (projectedOddities !== ACTIVITY4_LOT_COUNTS.odditiesTables - deferredOddities) fail('activity4-incomplete', '/tables');
  if (!tableIds.has(ACTIVITY4_ODDITY_SIDE_HOST)) fail('activity4-incomplete', '/tables');
  const grants = lot.interestingGrants;
  if (!grants.some(grant => grant.id === 'only-human-initial-thing' && grant.projected && grant.additional === false && grant.activity === 4))
    fail('activity4-incomplete', `${pointer}/interestingGrants`);
  if (!grants.some(grant => grant.id === 'only-human-minor-windfall-10' && grant.projected && grant.additional && grant.activity === 4))
    fail('activity4-incomplete', `${pointer}/interestingGrants`);
  if (!grants.some(grant => grant.id === 'core-initial-thing' && grant.projected === false && grant.activity === 3))
    fail('activity4-incomplete', `${pointer}/interestingGrants`);
}

/** Validates one public synthetic consumable document. It does not roll dice or enable a ruleset. */
export function parseHumanL0Consumable(input: unknown): HumanL0ConsumableDocument {
  const parsed = HumanL0ConsumableDocumentSchema.safeParse(input);
  if (!parsed.success) return fail('schema-invalid');
  const doc = parsed.data;
  if (!doc.fictionalData) fail('fictional-data-required', '/fictionalData');
  if (doc.reviewStatus === 'curated' || doc.promotesReview) fail('review-promotion-forbidden', '/reviewStatus');
  if (doc.reviewStatus !== 'needs-review') fail('review-status-invalid', '/reviewStatus');
  if (doc.rulesetEnabled) fail('ruleset-enablement-forbidden', '/rulesetEnabled');
  if (doc.importablePack) fail('import-forbidden', '/importablePack');
  const expectedCompatibility = HUMAN_L0_CONSUMABLE_COMPATIBILITY;
  if (!doc.compatibility.semanticsUnchanged) fail('mechanics-semantics-changed', '/compatibility');
  if (!same(doc.compatibility, expectedCompatibility)) fail('mechanics-contract-mismatch', '/compatibility');
  if (doc.recursion.silentReroll || doc.recursion.onLimit === 'reroll') fail('recursion-reroll-forbidden', '/recursion');
  if (doc.recursion.discardOutcome || doc.recursion.onLimit === 'discard') fail('recursion-discard-forbidden', '/recursion');
  if (doc.recursion.onLimit !== 'pending') fail('recursion-policy-invalid', '/recursion');

  const [hashBlockerValue, groupedBlockerValue] = doc.blockers;
  if (hashBlockerValue.blocksSyntheticFixtures) fail('hash-check-blocks-synthetic', '/blockers/0');
  if (groupedBlockerValue.individualEvidence || groupedBlockerValue.linkedDefinition !== 'local-only') fail('grouped-as-individual-evidence', '/blockers/1');
  const coreCount = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 3).reduce((sum, member) => sum + member.count, 0);
  const catalogCount = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 5).reduce((sum, member) => sum + member.count, 0);
  const expectedGrouped = {
    id: 'act3-act5-grouped-local-only' as const, count: coreCount + catalogCount, linkedDefinition: 'local-only', individualEvidence: false,
    coreProfessionOptions: coreCount, catalogRecords: catalogCount, activities: [3, 5],
    members: GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({ id: member.id, count: member.count, activity: member.activity, reason: member.reason })),
  };
  if (!same(hashBlockerValue, HASH_CHECK_BLOCKER) || !same(groupedBlockerValue, expectedGrouped)) fail('blocker-mismatch', '/blockers');

  const groupedIds = new Set<string>(GROUPED_LOCAL_ONLY_MEMBERS.map(member => member.id));
  if (doc.groupedPendings.length !== GROUPED_LOCAL_ONLY_MEMBERS.length) fail('grouped-pending-mismatch', '/groupedPendings');
  for (const [index, member] of GROUPED_LOCAL_ONLY_MEMBERS.entries()) {
    const rowValue = doc.groupedPendings[index], pointer = `/groupedPendings/${index}`;
    if (rowValue.weights !== null) fail('unextracted-range-has-weights', `${pointer}/weights`);
    if (rowValue.evidence.individualEvidence || rowValue.evidence.kind !== 'local-only-group' || rowValue.evidence.recomputedHash !== null)
      fail('grouped-as-individual-evidence', `${pointer}/evidence`);
    if (rowValue.linkedDefinition.individualEvidence || rowValue.linkedDefinition.kind !== 'local-only') fail('grouped-as-individual-evidence', `${pointer}/linkedDefinition`);
    if (rowValue.consequence.kind !== 'pending') fail('local-only-has-effect', `${pointer}/consequence`);
    const pending = rowValue.consequence.pending;
    if (pending.linkedDefinition.kind !== 'local-only' || pending.linkedDefinition.individualEvidence) fail('grouped-as-individual-evidence', pointer);
    if (rowValue.id !== member.id || rowValue.activity !== member.activity || rowValue.represents !== member.count || pending.reason !== member.reason || pending.matrixSelection !== 'agrupado')
      fail('grouped-pending-mismatch', pointer);
    assertConsequence(rowValue.consequence, 'grouped', `${pointer}/consequence`, null);
  }

  if (doc.manualResolutions.length !== MANUAL_RESOLUTION_SLOTS.length) fail('manual-resolution-mismatch', '/manualResolutions');
  for (const [index, slot] of MANUAL_RESOLUTION_SLOTS.entries()) {
    const rowValue = doc.manualResolutions[index], pointer = `/manualResolutions/${index}`;
    if (rowValue.matrixId !== slot.matrixId) fail('manual-resolution-mismatch', pointer);
    if (rowValue.consequence.kind !== 'pending') fail(slot.linkedDefinition.kind === 'local-only' ? 'local-only-has-effect' : 'manual-resolution-mismatch', `${pointer}/consequence`);
    if (rowValue.consequence.pending.linkedDefinition.kind === 'choice' && rowValue.consequence.pending.linkedDefinition.resolvedItemId !== null)
      fail('choice-resolved-early', pointer);
    const pending = rowValue.consequence.pending;
    if (pending.reason !== slot.reason || pending.matrixSelection !== 'selecionado-manual' || !same(pending.linkedDefinition, slot.linkedDefinition))
      fail('manual-resolution-mismatch', pointer);
    assertConsequence(rowValue.consequence, 'manual', `${pointer}/consequence`, null);
  }

  const lot = doc.activityLot === 4;
  if ((doc.activityLot === 4) !== (doc.activity4 !== undefined)) fail('activity4-incomplete', '/activity4');
  if (!same(doc.unprojectedPublishedCycles.map(cycle => cycle.id), [...PUBLISHED_CYCLE_IDS])) fail('cycle-list-mismatch', '/unprojectedPublishedCycles');
  for (const [index, cycle] of doc.unprojectedPublishedCycles.entries()) {
    if (lot) { if (!cycle.projected) fail('cycle-not-projected', `/unprojectedPublishedCycles/${index}`); }
    else if (cycle.projected) fail('cycle-projected-without-lot', `/unprojectedPublishedCycles/${index}`);
  }

  const tableIds = doc.tables.map(tableValue => tableValue.id);
  assertUnique(tableIds, 'duplicate-id', '/tables');
  const tables = new Map(doc.tables.map(tableValue => [tableValue.id, tableValue]));
  const rollIds: string[] = [];
  for (const [tableIndex, tableValue] of doc.tables.entries()) {
    const publishedCycleIds: readonly string[] = PUBLISHED_CYCLE_IDS;
    if (groupedIds.has(tableValue.id)) fail('grouped-as-individual-evidence', `/tables/${tableIndex}`);
    if (publishedCycleIds.includes(tableValue.id)) {
      if (!lot) fail('cycle-projected-without-lot', `/tables/${tableIndex}`);
      if (!tableValue.publishedCycle) fail('cycle-not-projected', `/tables/${tableIndex}`);
    } else if (lot && tableValue.publishedCycle) fail('cycle-flag-mismatch', `/tables/${tableIndex}`);
    assertUnique(tableValue.columns.map(columnValue => columnValue.id), 'duplicate-id', `/tables/${tableIndex}/columns`);
    for (const [columnIndex, columnValue] of tableValue.columns.entries()) {
      rollIds.push(columnValue.rollId);
      assertUnique(columnValue.rows.map(rowValue => rowValue.id), 'duplicate-id', `/tables/${tableIndex}/columns/${columnIndex}/rows`);
      checkColumn(columnValue, `/tables/${tableIndex}/columns/${columnIndex}`, groupedIds);
    }
  }
  assertUnique(rollIds, 'shared-column-roll', '/tables');

  const produced = new Map(doc.producedQueries.map(query => [query.id, query]));
  assertUnique([...produced.keys()], 'duplicate-id', '/producedQueries');
  for (const [index, query] of doc.producedQueries.entries()) {
    const owner = tables.get(query.producedBy.tableId);
    if (!owner || !owner.columns.some(columnValue => columnValue.id === query.producedBy.columnId)) fail('unknown-query', `/producedQueries/${index}`);
  }
  assertUnique(doc.lookups.map(query => query.id), 'duplicate-id', '/lookups');
  for (const [index, query] of doc.lookups.entries()) {
    const pointer = `/lookups/${index}`;
    if (query.dice !== null) fail('lookup-has-dice', `${pointer}/dice`);
    const source = produced.get(query.reads.queryId);
    if (!source) fail('lookup-missing-prior', `${pointer}/reads`);
    const sourceColumn = tables.get(source.producedBy.tableId)?.columns.find(columnValue => columnValue.id === source.producedBy.columnId);
    if (!sourceColumn) fail('unknown-query', `${pointer}/reads`);
    const rowIds = sourceColumn.rows.map(rowValue => rowValue.id);
    assertUnique(query.keys.map(key => key.key), 'duplicate-lookup-key', `${pointer}/keys`);
    for (const [keyIndex, key] of query.keys.entries()) {
      if (!rowIds.includes(key.key)) fail('lookup-unknown-key', `${pointer}/keys/${keyIndex}`);
      assertConsequence(key.consequence, 'lookup', `${pointer}/keys/${keyIndex}/consequence`, 'character');
    }
    if (rowIds.some(rowId => !query.keys.some(key => key.key === rowId))) fail('lookup-coverage', pointer);
  }

  const optionIds = doc.choices.flatMap(choice => choice.options);
  assertUnique(doc.choices.map(choice => choice.id), 'duplicate-id', '/choices');
  assertUnique(optionIds, 'duplicate-id', '/choices');
  const knownOptions = new Set(optionIds);
  const assertOption = (optionId: string | null, pointer: string) => {
    if (optionId !== null && !knownOptions.has(optionId)) fail('unknown-option', pointer);
  };

  assertUnique(doc.sideRolls.map(roll => roll.id), 'duplicate-id', '/sideRolls');
  for (const [index, roll] of doc.sideRolls.entries()) {
    const pointer = `/sideRolls/${index}`;
    const owner = tables.get(roll.parent.tableId);
    const parentColumn = owner?.columns.find(columnValue => columnValue.id === roll.parent.columnId);
    if (!parentColumn?.rows.some(rowValue => rowValue.id === roll.parent.rowId)) fail('unknown-side-roll-parent', `${pointer}/parent`);
    if (rollIds.includes(roll.rollId) || doc.sideRolls.filter(other => other.rollId === roll.rollId).length !== 1) fail('duplicate-roll', `${pointer}/rollId`);
    if (roll.appliesOnPossession) fail('side-roll-on-possession', pointer);
    assertOption(roll.when.optionId, `${pointer}/when`);
    if (roll.phase === 'creation' && roll.frequency !== 'once-per-origin') fail('side-roll-phase-mismatch', pointer);
    if (roll.phase === 'equip' && roll.frequency !== 'once-per-origin') fail('side-roll-phase-mismatch', pointer);
    if (roll.phase === 'use' && roll.frequency !== 'once-per-origin' && roll.frequency !== 'each-use') fail('side-roll-phase-mismatch', pointer);
    const place = roll.phase === 'creation' ? 'side-creation' : roll.phase === 'equip' ? 'side-equip' : 'side-use';
    assertConsequence(roll.consequence, place, `${pointer}/consequence`, roll.subject);
  }

  const items = new Map(doc.items.map(itemValue => [itemValue.id, itemValue]));
  assertUnique([...items.keys()], 'duplicate-id', '/items');
  for (const [index, itemValue] of doc.items.entries()) {
    const pointer = `/items/${index}`;
    if (groupedIds.has(itemValue.id)) fail('grouped-as-individual-evidence', pointer);
    if (itemValue.possessionAppliesEffects) fail('possession-applies-use', pointer);
    const quoted = itemValue.price;
    if (quoted.kind === 'exact' || quoted.kind === 'minimum') {
      if (quoted.amount === null || quoted.denomination === null || quoted.bits === null) fail('price-incomplete', `${pointer}/price`);
      let bits = '';
      try { bits = moneyToBits(quoted.amount, quoted.denomination); } catch { fail('price-incomplete', `${pointer}/price`); }
      if (bits !== quoted.bits) fail('price-bits-mismatch', `${pointer}/price`);
      if (itemValue.priceConsequence.kind !== 'effect' || itemValue.priceConsequence.effect.op !== 'record-price' ||
          itemValue.priceConsequence.effect.priceKind !== quoted.kind || itemValue.priceConsequence.effect.bits !== quoted.bits)
        fail('price-consequence', `${pointer}/priceConsequence`);
    } else {
      if (quoted.amount !== null || quoted.denomination !== null || quoted.bits !== null) fail('unknown-price-not-zero', `${pointer}/price`);
      if (itemValue.priceConsequence.kind !== 'pending' || itemValue.priceConsequence.pending.reason !== 'unknown-price')
        fail('unknown-price-not-zero', `${pointer}/priceConsequence`);
    }
    assertConsequence(itemValue.priceConsequence, 'price', `${pointer}/priceConsequence`, null);
    if (itemValue.onPossess.kind === 'effect' && itemValue.onPossess.effect.op === 'substitute-defense') fail('defense-on-possession', `${pointer}/onPossess`);
    if (itemValue.profile === 'none') {
      if (itemValue.onEquip || itemValue.onUse || itemValue.onPossess.kind !== 'effect' || itemValue.onPossess.effect.op !== 'narrative-marker') fail('profile-mismatch', pointer);
    } else if (itemValue.profile === 'generic') {
      if (itemValue.onEquip || itemValue.onUse || itemValue.onPossess.kind !== 'pending' || itemValue.onPossess.pending.reason !== 'generic-profile')
        fail('generic-profile-has-stats', pointer);
    } else {
      if (itemValue.onPossess.kind !== 'pending' || itemValue.onPossess.pending.reason !== 'possession-is-not-use') fail('possession-applies-use', pointer);
      assertDefenseSlot(itemValue.onEquip, 'equipped', `${pointer}/onEquip`);
      assertDefenseSlot(itemValue.onUse, 'wielded', `${pointer}/onUse`);
    }
    assertConsequence(itemValue.onPossess, 'possess', `${pointer}/onPossess`, 'character');
  }

  assertUnique(doc.grants.map(grantValue => originKeyOf(grantValue.origin)), 'duplicate-origin', '/grants');
  for (const [index, grantValue] of doc.grants.entries()) {
    const pointer = `/grants/${index}`;
    if (grantValue.consequence.kind === 'effect' && grantValue.consequence.effect.op === 'grant-item' && !items.has(grantValue.consequence.effect.itemId))
      fail('dangling-item', pointer);
    if (grantValue.precondition.kind === 'prior-result' && !produced.has(grantValue.precondition.queryId)) fail('lookup-missing-prior', pointer);
    if (grantValue.precondition.kind === 'choice-selected') assertOption(grantValue.precondition.optionId, `${pointer}/precondition`);
    assertConsequence(grantValue.consequence, 'grant', `${pointer}/consequence`, grantValue.subject);
  }

  const eventKeys = doc.events.map(eventValue => `${eventValue.originKey}|${eventValue.subject}|${eventValue.phase}`);
  assertUnique(eventKeys, 'duplicate-origin', '/events');
  for (const [index, eventValue] of doc.events.entries()) {
    const pointer = `/events/${index}`;
    if (eventValue.originKey !== originKeyOf(eventValue.origin)) fail('origin-key-mismatch', pointer);
    assertConsequence(eventValue.consequence, placeForPhase(eventValue.phase), `${pointer}/consequence`, eventValue.subject === 'item' ? 'item' : eventValue.subject);
  }

  const adjacency = new Map<string, string[]>();
  for (const tableValue of doc.tables) {
    const next: string[] = [];
    for (const columnValue of tableValue.columns) for (const rowValue of columnValue.rows) {
      if (rowValue.consequence.kind === 'effect' && rowValue.consequence.effect.op === 'follow-subtable') {
        if (!tables.has(rowValue.consequence.effect.tableId)) fail('subtable-missing', `/tables/${tableValue.id}`);
        next.push(rowValue.consequence.effect.tableId);
      }
    }
    adjacency.set(tableValue.id, next);
  }
  const visiting = new Set<string>(), visited = new Set<string>();
  const visit = (tableId: string, stack: string[]) => {
    if (visiting.has(tableId)) {
      const cycle = [...stack.slice(stack.indexOf(tableId)), tableId];
      if (cycle.some(idValue => !tables.get(idValue)?.publishedCycle)) fail('unpublished-cycle', '/tables');
      return;
    }
    if (visited.has(tableId)) return;
    visiting.add(tableId);
    for (const next of adjacency.get(tableId) ?? []) visit(next, [...stack, tableId]);
    visiting.delete(tableId);
    visited.add(tableId);
  };
  for (const tableId of tables.keys()) visit(tableId, []);
  if (lot && doc.activity4) assertActivity4(doc);
  return doc;
}

/** Shape gate for a handler result. It records effects or pendings and does not roll, apply, or enable generation. */
export function parseHumanL0ConsumableResolution(input: unknown): HumanL0ConsumableResolution {
  const parsed = HumanL0ConsumableResolutionSchema.safeParse(input);
  if (!parsed.success) return fail('schema-invalid');
  const resolution = parsed.data;
  if (resolution.rolled) fail('resolution-does-not-roll', '/rolled');
  if (resolution.rulesetEnabled) fail('ruleset-enablement-forbidden', '/rulesetEnabled');
  if (!resolution.consequences.length) fail('missing-consequence', '/consequences');
  assertUnique(resolution.consequences.map(entry => `${entry.originKey}|${entry.subject}|${entry.phase}`), 'duplicate-origin', '/consequences');
  for (const [index, entry] of resolution.consequences.entries()) {
    const pointer = `/consequences/${index}`;
    if (entry.originKey !== originKeyOf(entry.origin)) fail('origin-key-mismatch', pointer);
    assertConsequence(entry.consequence, placeForPhase(entry.phase), `${pointer}/consequence`, entry.subject === 'item' ? 'item' : entry.subject);
  }
  return resolution;
}

/** Walks a published follow-subtable cycle and stops at the document bound. It does not reroll or discard. */
export function reviewHumanL0ConsumableCycle(doc: HumanL0ConsumableDocument, start: { tableId: string; rowId: string }, maxDepth = doc.recursion.maxDepth) {
  if (doc.recursion.onLimit !== 'pending' || doc.recursion.silentReroll || doc.recursion.discardOutcome) fail('recursion-policy-invalid', '/recursion');
  let tableId = start.tableId;
  let rowId = start.rowId;
  for (let step = 0; step < maxDepth; step += 1) {
    const tableValue = doc.tables.find(item => item.id === tableId);
    const row = tableValue?.columns.flatMap(columnValue => columnValue.rows).find(item => item.id === rowId);
    if (!tableValue || !row) fail('subtable-missing', '/tables');
    if (row.consequence.kind !== 'effect' || row.consequence.effect.op !== 'follow-subtable')
      return { resolved: true, pending: null, steps: step, rerolled: false as const, discarded: false as const };
    const nextTable = row.consequence.effect.tableId;
    const entry = doc.activity4?.cycleWalk.find(item => item.from.tableId === nextTable);
    if (!entry) return { resolved: true, pending: null, steps: step + 1, rerolled: false as const, discarded: false as const };
    tableId = entry.from.tableId;
    rowId = entry.from.rowId;
  }
  return { resolved: false, pending: { reason: 'bounded-recursion' as const, retainsConsequence: true as const }, steps: maxDepth, rerolled: false as const, discarded: false as const };
}

/** Selected Interesting Things source. A disabled source stays pending and does not switch procedure. */
export function reviewHumanL0InterestingThingsSource(doc: HumanL0ConsumableDocument, input: { variant: 'oddities' | 'core'; activeSourceIds: readonly string[] }) {
  const binding = doc.activity4?.interestingThings;
  if (!binding || binding.silentFallback) fail('silent-core-fallback', '/activity4/interestingThings');
  const sourceId = input.variant === 'oddities' ? 'sotdl:oddities-artifacts-and-esoterica' : 'sotdl:shadow-of-the-demon-lord-core';
  if (!input.activeSourceIds.includes(sourceId))
    return { variant: input.variant, outcome: null, fallback: null, pending: { reason: 'disabled-source' as const, retainsConsequence: true as const } };
  if (input.variant === 'core')
    return { variant: 'core' as const, outcome: null, fallback: null, pending: { reason: 'unprojected-alternative' as const, retainsConsequence: true as const } };
  return { variant: 'oddities' as const, outcome: { routerId: 'oddities:thing-router' }, fallback: null, pending: null };
}
