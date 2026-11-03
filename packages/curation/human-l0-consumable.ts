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
  phase: z.enum(['creation', 'equip', 'use']), dice, rollId: id,
  subject: z.enum(['character', 'relative', 'item']), frequency: z.enum(['once-per-origin', 'each-use']),
  appliesOnPossession: z.boolean(), when: z.object({ optionId: id.nullable() }).strict(), consequence: HumanL0ConsequenceSchema,
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
  producedQueries: z.array(z.object({ id, producedBy: z.object({ tableId: id, columnId: id }).strict() }).strict()).max(20),
  tables: z.array(table).min(1).max(40),
  lookups: z.array(lookup).max(20),
  sideRolls: z.array(sideRoll).max(40),
  items: z.array(item).max(40),
  grants: z.array(grant).max(40),
  events: z.array(event).max(40),
  groupedPendings: z.array(groupedPending).max(20),
  manualResolutions: z.array(z.object({ matrixId: id, consequence: HumanL0ConsequenceSchema }).strict()).max(40),
}).strict();
export type HumanL0ConsumableDocument = z.infer<typeof HumanL0ConsumableDocumentSchema>;

export const HumanL0ConsumableResolutionSchema = z.object({
  contract: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT),
  contractVersion: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION),
  rolled: z.boolean(), rulesetEnabled: z.boolean(),
  input: z.object({ contextId: id, resultId: id }).strict(),
  consequences: z.array(HumanL0ConsequenceSchema).max(100),
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
    if (value.possessionApplies) fail('defense-on-possession', pointer);
    if (value.mode !== 'substitute') fail('defense-not-substitution', pointer);
    const equipped = value.when === 'equipped' && value.timing === 'on-equip' && (place === 'equip' || place === 'side-equip');
    const wielded = value.when === 'wielded' && value.timing === 'on-use' && (place === 'use' || place === 'side-use');
    if (!equipped && !wielded) fail('defense-requires-equip-or-use', pointer);
  }
  if (value.op === 'record-price' && place !== 'price') fail('price-consequence', pointer);
  if (value.op === 'follow-subtable' && place !== 'row') fail('subtable-placement', pointer);
}

function checkColumn(columnValue: HumanL0ConsumableDocument['tables'][number]['columns'][number], pointer: string, groupedIds: Set<string>) {
  const open = columnValue.rows.some(rowValue => rowValue.tail !== 'none');
  if (open && columnValue.modifierDomain.kind === 'none') fail('open-tail-domain', `${pointer}/modifierDomain`);
  if (!open && columnValue.modifierDomain.kind !== 'none') fail('modifier-domain', `${pointer}/modifierDomain`);
  if (columnValue.modifierDomain.kind === 'authorized' && new Set(columnValue.modifierDomain.values).size !== columnValue.modifierDomain.values.length)
    fail('modifier-domain', `${pointer}/modifierDomain`);
  let openLow = 0, openHigh = 0;
  for (const [index, rowValue] of columnValue.rows.entries()) {
    const rowPointer = `${pointer}/rows/${index}`;
    if (groupedIds.has(rowValue.id)) fail('grouped-as-individual-evidence', rowPointer);
    if (rowValue.tail === 'open-low') { openLow++; if (rowValue.min !== null || rowValue.max === null) fail('open-tail-shape', rowPointer); }
    else if (rowValue.tail === 'open-high') { openHigh++; if (rowValue.max !== null || rowValue.min === null) fail('open-tail-shape', rowPointer); }
    else if (rowValue.min === null || rowValue.max === null || rowValue.min > rowValue.max) fail('open-tail-shape', rowPointer);
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

  if (!same(doc.unprojectedPublishedCycles.map(cycle => cycle.id), [...PUBLISHED_CYCLE_IDS])) fail('cycle-list-mismatch', '/unprojectedPublishedCycles');
  for (const [index, cycle] of doc.unprojectedPublishedCycles.entries()) if (cycle.projected) fail('cycle-projected-without-lot', `/unprojectedPublishedCycles/${index}`);

  const tableIds = doc.tables.map(tableValue => tableValue.id);
  assertUnique(tableIds, 'duplicate-id', '/tables');
  const tables = new Map(doc.tables.map(tableValue => [tableValue.id, tableValue]));
  const rollIds: string[] = [];
  for (const [tableIndex, tableValue] of doc.tables.entries()) {
    const publishedCycleIds: readonly string[] = PUBLISHED_CYCLE_IDS;
    if (groupedIds.has(tableValue.id) || publishedCycleIds.includes(tableValue.id))
      fail(publishedCycleIds.includes(tableValue.id) ? 'cycle-projected-without-lot' : 'grouped-as-individual-evidence', `/tables/${tableIndex}`);
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
    if (!produced.has(query.reads.queryId)) fail('lookup-missing-prior', `${pointer}/reads`);
    assertUnique(query.keys.map(key => key.key), 'duplicate-lookup-key', `${pointer}/keys`);
    for (const [keyIndex, key] of query.keys.entries()) assertConsequence(key.consequence, 'lookup', `${pointer}/keys/${keyIndex}/consequence`, 'character');
  }

  assertUnique(doc.sideRolls.map(roll => roll.id), 'duplicate-id', '/sideRolls');
  for (const [index, roll] of doc.sideRolls.entries()) {
    const pointer = `/sideRolls/${index}`;
    const owner = tables.get(roll.parent.tableId);
    const parentColumn = owner?.columns.find(columnValue => columnValue.id === roll.parent.columnId);
    if (!parentColumn?.rows.some(rowValue => rowValue.id === roll.parent.rowId)) fail('unknown-side-roll-parent', `${pointer}/parent`);
    if (rollIds.includes(roll.rollId) || doc.sideRolls.filter(other => other.rollId === roll.rollId).length !== 1) fail('duplicate-roll', `${pointer}/rollId`);
    if (roll.appliesOnPossession) fail('side-roll-on-possession', pointer);
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
    } else if (itemValue.profile === 'armor') {
      if (itemValue.onUse || itemValue.onPossess.kind !== 'pending' || itemValue.onPossess.pending.reason !== 'possession-is-not-use') fail('possession-applies-use', pointer);
      assertConsequence(itemValue.onEquip ?? fail('defense-not-substitution', `${pointer}/onEquip`), 'equip', `${pointer}/onEquip`, 'character');
      if (itemValue.onEquip?.kind !== 'effect' || itemValue.onEquip.effect.op !== 'substitute-defense' || itemValue.onEquip.effect.when !== 'equipped')
        fail('defense-not-substitution', `${pointer}/onEquip`);
    } else {
      if (itemValue.onEquip || itemValue.onPossess.kind !== 'pending' || itemValue.onPossess.pending.reason !== 'possession-is-not-use') fail('possession-applies-use', pointer);
      assertConsequence(itemValue.onUse ?? fail('defense-not-substitution', `${pointer}/onUse`), 'use', `${pointer}/onUse`, 'character');
      if (itemValue.onUse?.kind !== 'effect' || itemValue.onUse.effect.op !== 'substitute-defense' || itemValue.onUse.effect.when !== 'wielded')
        fail('defense-not-substitution', `${pointer}/onUse`);
    }
    assertConsequence(itemValue.onPossess, 'possess', `${pointer}/onPossess`, 'character');
  }

  assertUnique(doc.grants.map(grantValue => originKeyOf(grantValue.origin)), 'duplicate-origin', '/grants');
  for (const [index, grantValue] of doc.grants.entries()) {
    const pointer = `/grants/${index}`;
    if (grantValue.consequence.kind === 'effect' && grantValue.consequence.effect.op === 'grant-item' && !items.has(grantValue.consequence.effect.itemId))
      fail('dangling-item', pointer);
    if (grantValue.precondition.kind === 'prior-result' && !produced.has(grantValue.precondition.queryId)) fail('lookup-missing-prior', pointer);
    assertConsequence(grantValue.consequence, 'grant', `${pointer}/consequence`, grantValue.subject);
  }

  const eventKeys = doc.events.map(eventValue => `${eventValue.originKey}|${eventValue.subject}|${eventValue.phase}`);
  assertUnique(eventKeys, 'duplicate-origin', '/events');
  for (const [index, eventValue] of doc.events.entries()) {
    const pointer = `/events/${index}`;
    if (eventValue.originKey !== originKeyOf(eventValue.origin)) fail('origin-key-mismatch', pointer);
    const eventPlace = eventValue.phase === 'on-equip' ? 'equip' : eventValue.phase === 'on-use' ? 'use' : eventValue.phase === 'creation' ? 'row' : 'lookup';
    assertConsequence(eventValue.consequence, eventPlace, `${pointer}/consequence`, eventValue.subject === 'item' ? 'item' : eventValue.subject);
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
  for (const [index, consequence] of resolution.consequences.entries()) assertConsequence(consequence, 'event', `/consequences/${index}`, null);
  return resolution;
}
