import {
  GROUPED_LOCAL_ONLY_MEMBERS, HASH_CHECK_BLOCKER, HUMAN_L0_CONSUMABLE_COMPATIBILITY, HUMAN_L0_CONSUMABLE_CONTRACT,
  HUMAN_L0_CONSUMABLE_CONTRACT_VERSION, MANUAL_RESOLUTION_SLOTS, PUBLISHED_CYCLE_IDS, parseHumanL0Consumable,
  type HumanL0ConsumableDocument,
} from './human-l0-consumable';
import { moneyToBits } from './starting-equipment-model';

/**
 * Activity 5 lot on `sotdl.human-l0.consumable@1.0.0`.
 * Act 4 emits `query:starting-lifestyle:only-human`. This lot only reads it.
 * Shared ids are the activity 1 matrix ids. Rebase onto act 4 if those ids move.
 */

export const ONLY_HUMAN_LIFESTYLE_QUERY_ID = 'query:starting-lifestyle:only-human';
export const ONLY_HUMAN_LIFESTYLE_TABLE_ID = 'only-human:lifestyle';
export const ONLY_HUMAN_LIFESTYLE_COLUMN_ID = 'main';
export const ONLY_HUMAN_LIFESTYLE_ROLL_ID = 'only-human:lifestyle#main';
export const LIFESTYLES = ['destitute', 'poor', 'getting-by', 'comfortable', 'wealthy', 'rich'] as const;
export type LifestyleName = typeof LIFESTYLES[number];

export const LOOKUP_IDS = [
  'only-human:clothing', 'only-human:weapons', 'only-human:personal-gear', 'only-human:special-gear', 'only-human:money',
] as const;
export type LookupId = typeof LOOKUP_IDS[number];
export const lookupQueryId = (lookupId: LookupId) => `query:${lookupId}`;

export const KIT_SOURCES = ['core', 'only-human'] as const;
export const kitProgramId = (source: typeof KIT_SOURCES[number], lifestyle: LifestyleName) => `${source}:kit:${lifestyle}`;

/** Natural 3d6 bounds already implemented by `resolveStartingLifestyle` for procedure `only-human`. */
export const ONLY_HUMAN_LIFESTYLE_RANGES: { lifestyle: LifestyleName; tail: 'open-low' | 'none' | 'open-high'; min: number | null; max: number | null }[] = [
  { lifestyle: 'destitute', tail: 'open-low', min: null, max: 3 },
  { lifestyle: 'poor', tail: 'none', min: 4, max: 5 },
  { lifestyle: 'getting-by', tail: 'none', min: 6, max: 12 },
  { lifestyle: 'comfortable', tail: 'none', min: 13, max: 15 },
  { lifestyle: 'wealthy', tail: 'none', min: 16, max: 17 },
  { lifestyle: 'rich', tail: 'open-high', min: 18, max: null },
];

/** Exact result ids emitted by the activity-4 producer; names remain kit/program labels only. */
export function lifestyleRowId(lifestyle: LifestyleName) {
  const range = ONLY_HUMAN_LIFESTYLE_RANGES.find(row => row.lifestyle === lifestyle);
  if (!range) throw new Error('Unknown lifestyle result.');
  return `${ONLY_HUMAN_LIFESTYLE_TABLE_ID}:${range.min ?? 'open'}-${range.max ?? 'open'}`;
}

export const KITS_LOT_COUNTS = {
  matrixRows: 752,
  identities: 1063,
  selectedRows: 746,
  manualRows: 6,
  definitions: 409,
  references: 547,
  programs: 97,
  lookups: 5,
  queries: 5,
  coreDefinitions: 67,
  thingDefinitions: 285,
  sourceGrantOnly: 57,
  exactDefinitionRefs: 182,
  genericEditableRefs: 75,
  onlyHumanProfessionPrograms: 66,
  coreKits: 6,
  onlyHumanKits: 6,
  extraPrograms: 19,
  nonInventoryReferences: 75,
  currencyReferences: 19,
  referenciaNonInventoryOrCurrency: 94,
  ruleBlocks: 28,
} as const;

const CATALOG_GROUP_IDS = ['class:source-grant-only', 'class:exact-definition-refs', 'class:generic-editable-refs'] as const;
const NOT_CARRIED_THING_KINDS = new Set(['companion', 'mixed']);

export type KitsMatrixRow = {
  id: string;
  kind: string;
  selection: string;
  disposition: string;
  represents: number;
  capabilities: string[];
  linkedDefinition: string;
  evidence: string;
};

type Link = { kind: 'not-an-item' } | { kind: 'none' } | { kind: 'local-only'; individualEvidence: false } | { kind: 'choice'; candidates: readonly string[]; resolvedItemId: null };

const localOnly = { kind: 'local-only' as const, individualEvidence: false as const };
const notItem = { kind: 'not-an-item' as const };
const noneLink = { kind: 'none' as const };

function pending(reason: string, linked: Link, matrixSelection: 'selecionado-manual' | 'agrupado' | null = null) {
  return { kind: 'pending' as const, effect: null, pending: { reason, retainsConsequence: true as const, matrixSelection, linkedDefinition: linked } };
}

function narrative(code: string) {
  return { kind: 'effect' as const, pending: null, effect: { op: 'narrative-marker' as const, code, timing: 'narrative' as const, mutatesMechanics: false as const } };
}

function unknownPrice() {
  return {
    price: { kind: 'unknown' as const, amount: null, denomination: null, bits: null },
    priceConsequence: pending('unknown-price', noneLink),
  };
}

function variablePrice() {
  return { price: { kind: 'variable' as const, amount: null, denomination: null, bits: null }, priceConsequence: pending('unknown-price', noneLink) };
}

function quotedPrice(kind: 'exact' | 'minimum', amount: string, denomination: 'bits' | 'cp' | 'ss' | 'gc') {
  const bits = moneyToBits(amount, denomination);
  return {
    price: { kind, amount, denomination, bits },
    priceConsequence: { kind: 'effect' as const, pending: null, effect: { op: 'record-price' as const, priceKind: kind, bits, timing: 'narrative' as const, mutatesMechanics: false as const } },
  };
}

const possessPending = pending('possession-is-not-use', noneLink);
const substituteDefense = {
  kind: 'effect' as const, pending: null,
  effect: { op: 'substitute-defense' as const, when: 'equipped' as const, mode: 'substitute' as const, base: 'agility' as const, value: 1, timing: 'on-equip' as const, possessionApplies: false as const },
};

function diceWays(count: number, sides: number) {
  let totals = new Map<number, number>([[0, 1]]);
  for (let roll = 0; roll < count; roll += 1) {
    const next = new Map<number, number>();
    for (const [total, ways] of totals) for (let face = 1; face <= sides; face += 1) next.set(total + face, (next.get(total + face) ?? 0) + ways);
    totals = next;
  }
  totals.delete(0);
  return totals;
}

function rangeWays(totals: Map<number, number>, min: number | null, max: number | null) {
  let ways = 0;
  for (const [face, count] of totals) if ((min === null || face >= min) && (max === null || face <= max)) ways += count;
  return String(ways);
}

function origin(publicationId: string, entityId: string, resultId: string | null, componentId: string | null) {
  return { publicationId, version: null as null, entityId, resultId, componentId };
}

function lifestyleColumn() {
  const totals = diceWays(3, 6);
  const denominator = String(6 ** 3);
  return {
    id: ONLY_HUMAN_LIFESTYLE_COLUMN_ID,
    rollId: ONLY_HUMAN_LIFESTYLE_ROLL_ID,
    dice: { count: 3, sides: 6 },
    modifierDomain: { kind: 'pending' as const, reason: 'open-tail-domain' as const },
    rows: ONLY_HUMAN_LIFESTYLE_RANGES.map(range => ({
      id: lifestyleRowId(range.lifestyle),
      min: range.min,
      max: range.max,
      tail: range.tail,
      publishedWeight: { ways: rangeWays(totals, range.min, range.max), denominator, basis: 'natural-dice-faces' as const },
      consequence: narrative('lifestyle-prior'),
    })),
  };
}

function lookupKeys(lookupId: LookupId) {
  const linked: Link = lookupId === 'only-human:money' ? notItem : localOnly;
  return LIFESTYLES.map(lifestyle => ({ key: lifestyleRowId(lifestyle), consequence: pending('grant-program-local-only', linked) }));
}

function carriedItem(id: string, profile: 'none' | 'armor' | 'weapon' | 'generic', price: ReturnType<typeof unknownPrice> | ReturnType<typeof variablePrice> | ReturnType<typeof quotedPrice>, slots: {
  onPossess: ReturnType<typeof narrative> | ReturnType<typeof pending>;
  onEquip: typeof substituteDefense | ReturnType<typeof pending> | null;
  onUse: ReturnType<typeof pending> | null;
}) {
  return {
    id, label: id, ...price, profile, possessionAppliesEffects: false as const,
    onPossess: slots.onPossess, onEquip: slots.onEquip, onUse: slots.onUse,
  };
}

const shieldCandidates = ['pilot-item:core:large-shield', 'pilot-item:core:small-shield'];

function grant(id: string, entityId: string, resultId: string | null, componentId: string, source: 'kit' | 'lookup', consequence: unknown, publicationId = 'fixture-publication') {
  return {
    id, origin: origin(publicationId, entityId, resultId, componentId), subject: 'character' as const,
    precondition: { kind: 'prior-result' as const, queryId: ONLY_HUMAN_LIFESTYLE_QUERY_ID },
    frequency: 'once' as const, source, consequence,
  };
}

/** Public synthetic document. It does not list the 314 grouped leaves or the 67 Core prices. */
export function humanL0KitsDocumentInput() {
  const armorOrigin = origin('fixture-publication', 'kit-fixture:armor', 'shape', 'grant');
  const carry = {
    kind: 'effect' as const, pending: null,
    effect: { op: 'grant-item' as const, itemId: 'kit-fixture-armor', quantity: 1, unit: 'count', possession: 'carried' as const, usageApplied: false as const, timing: 'creation' as const },
  };
  return {
    contract: HUMAN_L0_CONSUMABLE_CONTRACT,
    contractVersion: HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
    distribution: 'public-synthetic' as const,
    fictionalData: true,
    reviewStatus: 'needs-review' as const,
    rulesetEnabled: false,
    importablePack: false,
    promotesReview: false,
    compatibility: { ...HUMAN_L0_CONSUMABLE_COMPATIBILITY },
    matrix: { activity: 1 as const, closure: 'pending-act1-local-hash-check' as const, sourceVersion: null, path: 'docs/matriz-lacunas-issue34-atividade1.json' as const },
    blockers: [
      { ...HASH_CHECK_BLOCKER, activities: [...HASH_CHECK_BLOCKER.activities] },
      groupedBlocker(),
    ],
    recursion: { maxDepth: 4, onLimit: 'pending' as const, pendingReason: 'bounded-recursion' as const, silentReroll: false, discardOutcome: false },
    unprojectedPublishedCycles: PUBLISHED_CYCLE_IDS.map(id => ({ id, projected: false })),
    choices: [{ id: 'choice:core-kit-wealthy-shield', options: [...shieldCandidates] }],
    producedQueries: [{ id: ONLY_HUMAN_LIFESTYLE_QUERY_ID, producedBy: { tableId: ONLY_HUMAN_LIFESTYLE_TABLE_ID, columnId: ONLY_HUMAN_LIFESTYLE_COLUMN_ID } }],
    tables: [{ id: ONLY_HUMAN_LIFESTYLE_TABLE_ID, kind: 'weighted-table' as const, publishedCycle: false, columns: [lifestyleColumn()] }],
    lookups: LOOKUP_IDS.map(id => ({ id, kind: 'lookup' as const, dice: null, reads: { queryId: ONLY_HUMAN_LIFESTYLE_QUERY_ID, component: 'result' as const }, keys: lookupKeys(id) })),
    sideRolls: [],
    items: [
      carriedItem('kit-fixture-armor', 'armor', unknownPrice(), { onPossess: possessPending, onEquip: substituteDefense, onUse: null }),
      carriedItem('kit-fixture-blade', 'weapon', unknownPrice(), { onPossess: possessPending, onEquip: null, onUse: pending('weapon-no-defense', noneLink) }),
      carriedItem('kit-fixture-shield', 'armor', unknownPrice(), { onPossess: possessPending, onEquip: pending('defense-bonus-not-substitution', noneLink), onUse: null }),
      carriedItem('kit-fixture-priced', 'none', quotedPrice('exact', '1', 'gc'), { onPossess: narrative('fixture-price-not-catalog'), onEquip: null, onUse: null }),
      carriedItem('kit-fixture-minimum', 'none', quotedPrice('minimum', '1', 'cp'), { onPossess: narrative('fixture-minimum-not-catalog'), onEquip: null, onUse: null }),
      carriedItem('kit-fixture-generic', 'generic', variablePrice(), { onPossess: pending('generic-profile', noneLink), onEquip: null, onUse: null }),
      carriedItem('kit-fixture-incantation', 'none', unknownPrice(), { onPossess: narrative('incantation-not-a-spell'), onEquip: null, onUse: null }),
    ],
    grants: [
      grant('kit-fixture:grant:armor', 'kit-fixture:armor', 'shape', 'grant', 'kit', carry),
      grant('kit-fixture:grant:currency', 'query:only-human:money', 'kit-fixture:shape', 'grant-currency', 'lookup', {
        kind: 'effect', pending: null, effect: { op: 'grant-currency', amount: '3', denomination: 'cp', bits: moneyToBits('3', 'cp'), timing: 'creation' },
      }),
      grant('kit-fixture:grant:shield-choice', 'core:kit:wealthy', 'shield', 'choice', 'kit', pending('choice-required', { kind: 'choice', candidates: [...shieldCandidates], resolvedItemId: null }), 'sotdl:shadow-of-the-demon-lord-core'),
      grant('kit-fixture:grant:companion', 'kit-fixture:companion', 'shape', 'not-carried', 'kit', pending('not-carried', notItem)),
      grant('kit-fixture:grant:property', 'kit-fixture:property', 'shape', 'not-carried', 'kit', pending('not-carried', notItem)),
      grant('kit-fixture:grant:service', 'kit-fixture:service', 'shape', 'not-carried', 'kit', pending('not-carried', notItem)),
      grant('kit-fixture:grant:incantation', 'kit-fixture:incantation', 'shape', 'grant', 'kit', {
        kind: 'effect', pending: null,
        effect: { op: 'grant-item', itemId: 'kit-fixture-incantation', quantity: 1, unit: 'count', possession: 'carried', usageApplied: false, timing: 'creation' },
      }),
    ],
    events: [
      { id: 'kit-fixture:event:armor:carry', originKey: originKey(armorOrigin), origin: armorOrigin, subject: 'character' as const, phase: 'creation' as const, consequence: carry },
      { id: 'kit-fixture:event:armor:equip', originKey: originKey(armorOrigin), origin: armorOrigin, subject: 'character' as const, phase: 'on-equip' as const, consequence: substituteDefense },
    ],
    groupedPendings: GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({
      id: member.id, blockerId: 'act3-act5-grouped-local-only' as const, activity: member.activity, represents: member.count,
      linkedDefinition: localOnly,
      evidence: { kind: 'local-only-group' as const, individualEvidence: false, recomputedHash: null },
      weights: null, consequence: pending(member.reason, localOnly, 'agrupado'),
    })),
    manualResolutions: MANUAL_RESOLUTION_SLOTS.map(slot => ({
      matrixId: slot.matrixId,
      consequence: pending(slot.reason, slot.linkedDefinition, 'selecionado-manual'),
    })),
  };
}

function originKey(value: { publicationId: string; entityId: string; resultId: string | null; componentId: string | null }) {
  return `${value.publicationId}@null/${value.entityId}/${value.resultId ?? 'null'}/${value.componentId ?? 'null'}`;
}

function groupedBlocker() {
  const coreCount = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 3).reduce((sum, member) => sum + member.count, 0);
  const catalogCount = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 5).reduce((sum, member) => sum + member.count, 0);
  return {
    id: 'act3-act5-grouped-local-only' as const, count: coreCount + catalogCount, linkedDefinition: 'local-only', individualEvidence: false,
    coreProfessionOptions: coreCount, catalogRecords: catalogCount, activities: [3, 5],
    members: GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({ id: member.id, count: member.count, activity: member.activity, reason: member.reason })),
  };
}

export function parseHumanL0KitsDocument(input: unknown = humanL0KitsDocumentInput()): HumanL0ConsumableDocument {
  return parseHumanL0Consumable(input);
}

const cap = (row: KitsMatrixRow, prefix: string) => row.capabilities.find(item => item.startsWith(prefix))?.slice(prefix.length) ?? null;
const sumRepresents = (rows: KitsMatrixRow[]) => rows.reduce((total, row) => total + row.represents, 0);

export type KitsLotProjection = ReturnType<typeof projectHumanL0KitsLot>;

/** Ledger over the activity 1 matrix. Grouped catalog leaves stay counts; no price or combat profile is invented for them. */
export function projectHumanL0KitsLot(matrix: { records: KitsMatrixRow[] }) {
  const records = matrix.records;
  const lot = records.filter(row => row.disposition === 'lote-kits-itens');
  const byKind = Object.fromEntries([...lot.reduce((map, row) => map.set(row.kind, (map.get(row.kind) ?? 0) + row.represents), new Map<string, number>())].sort(([a], [b]) => a.localeCompare(b)));
  const byId = new Map(records.map(row => [row.id, row]));
  const coreDefinitions = lot.filter(row => row.kind === 'item-definition' && row.id.startsWith('pilot-item:core:')).map(row => ({
    id: row.id, priceKind: 'unknown' as const, amount: null, denomination: null, bits: null, pricePending: 'unknown-price' as const,
    combatProfile: null, projected: false, usageApplied: false, teachesSpell: false,
  }));
  const thingDefinitions = lot.filter(row => row.kind === 'item-definition' && row.id.startsWith('pilot-item:thing:')).map(row => {
    const outcomeId = row.id.slice('pilot-item:thing:'.length);
    const ref = byId.get(`item-ref:thing:${outcomeId}`);
    const kind = ref ? cap(ref, 'kind:') : null;
    return { id: row.id, outcomeId, outcomeKind: kind, inheritsCombatFromName: false, carriedAllowed: kind === 'object', projected: false, price: null, teachesSpell: false };
  });
  const programs = lot.filter(row => row.kind === 'grant-program').map(row => ({
    id: row.id, localOnly: row.linkedDefinition === 'local-only', subject: row.id.startsWith('profession:') ? 'pc' as const : null,
    familyDoesNotGrant: row.capabilities.includes('family-profession-does-not-grant'),
    lifestyle: cap(row, 'lifestyle:'), context: cap(row, 'context:'), shape: cap(row, 'shape:'),
    carriedItem: false, teachesSpell: false, moneyBits: null, moneyIsPrice: false,
  }));
  const groups = CATALOG_GROUP_IDS.map(id => {
    const row = lot.find(item => item.id === id);
    return {
      id, represents: row?.represents ?? 0, reason: 'catalog-group-not-individual' as const, weights: null,
      linkedDefinition: 'local-only' as const, individualEvidence: false, evidence: row?.evidence ?? null, leafIds: [] as string[],
    };
  });
  const choiceSlots = MANUAL_RESOLUTION_SLOTS.filter(slot => slot.reason === 'choice-required');
  const choices = choiceSlots.map(slot => {
    const row = byId.get(slot.matrixId);
    const candidates = slot.linkedDefinition.kind === 'choice' ? [...slot.linkedDefinition.candidates] : [];
    return { id: slot.matrixId, resolvedItemId: null as null, candidates, matrixLinkedDefinition: row?.linkedDefinition ?? null, selection: row?.selection ?? null };
  });
  const referencia = records.filter(row => row.disposition === 'referencia');
  const currencyReferences = referencia.filter(row => row.capabilities.includes('resolution:currency-preserved')).map(row => ({ id: row.id, bits: null, itemId: null }));
  const nonInventoryReferences = referencia.filter(row => row.capabilities.includes('resolution:non-inventory')).map(row => ({ id: row.id, kind: cap(row, 'kind:'), carriedItem: false }));
  const ruleBlocks = referencia.filter(row => row.id.startsWith('item-definition:rule:')).map(row => ({ id: row.id, handler: false }));
  return {
    activity: 5 as const,
    contract: HUMAN_L0_CONSUMABLE_CONTRACT,
    contractVersion: HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
    matrixRows: lot.length,
    identities: sumRepresents(lot),
    selectedRows: lot.filter(row => row.selection === 'selecionado').length,
    manualRows: lot.filter(row => row.selection === 'selecionado-manual').length,
    byKind,
    definitions: sumRepresents(lot.filter(row => row.kind === 'item-definition')),
    references: sumRepresents(lot.filter(row => row.kind === 'item-reference')),
    programs: programs.length,
    lookups: lot.filter(row => row.kind === 'table').map(row => row.id),
    queries: lot.filter(row => row.kind === 'query').map(row => row.id),
    coreDefinitions,
    thingDefinitions,
    programRecords: programs,
    onlyHumanProfessionPrograms: programs.filter(row => row.id.startsWith('profession:pilot-profession:only-human:')),
    coreKits: programs.filter(row => row.id.startsWith('core:kit:')),
    onlyHumanKits: programs.filter(row => row.id.startsWith('only-human:kit:')),
    extraPrograms: programs.filter(row => row.id.startsWith('extra:')),
    groups,
    choices,
    majorWindfallFallback: programs.find(row => row.id === 'extra:major-windfall-1-fallback') ?? null,
    currencyReferences,
    nonInventoryReferences,
    ruleBlocks,
  };
}
