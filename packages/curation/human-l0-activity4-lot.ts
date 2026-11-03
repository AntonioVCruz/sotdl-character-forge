import {
  ACTIVITY4_ACT5_LOOKUPS, ACTIVITY4_DEFERRED_TABLES, ACTIVITY4_LIFESTYLE_MODIFIER_IDS, ACTIVITY4_LIFESTYLE_QUERY,
  ACTIVITY4_LOT_COUNTS, ACTIVITY4_MANUAL_IDS, ACTIVITY4_ODDITY_SIDE_HOST, ACTIVITY4_ODDITY_SIDE_TOPOLOGY,
  ACTIVITY4_OH_SIDE_ROLLS, GROUPED_LOCAL_ONLY_MEMBERS, HASH_CHECK_BLOCKER, HUMAN_L0_CONSUMABLE_COMPATIBILITY,
  HUMAN_L0_CONSUMABLE_CONTRACT, HUMAN_L0_CONSUMABLE_CONTRACT_VERSION, MANUAL_RESOLUTION_SLOTS, PUBLISHED_CYCLE_IDS,
} from './human-l0-consumable';

/** Matrix rows the activity-4 lot is allowed to read. Ids and capabilities only. */
export type Activity4MatrixRow = {
  id: string;
  kind: string;
  disposition: string;
  selection: string;
  evidence: string;
  represents: number;
  capabilities: string[];
};

type Range = { min: number | null; max: number | null };
type Die = { count: number; sides: number };
const die = (count: number, sides: number): Die => ({ count, sides });
const pairs = (values: [number | null, number | null][]): Range[] => values.map(([min, max]) => ({ min, max }));
const standard = pairs([[3, 3], [4, 5], [6, 8], [9, 12], [13, 15], [16, 17], [18, 18]]);
const faces = (sides: number): Range[] => Array.from({ length: sides }, (_, index) => ({ min: index + 1, max: index + 1 }));
const fromMins = (mins: number[], sides: number): Range[] => mins.map((min, index) => ({ min, max: index === mins.length - 1 ? sides : mins[index + 1] - 1 }));
const paired = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const none = { kind: 'none' as const };
const localOnly = { kind: 'local-only' as const, individualEvidence: false as const };
const notItem = { kind: 'not-an-item' as const };
const noLink = { kind: 'none' as const };

const professions: { category: string; dice: Die; ranges: Range[] }[] = [
  { category: 'scholarship', dice: die(1, 20), ranges: fromMins(Array.from({ length: 10 }, (_, index) => index * 2 + 1), 20) },
  { category: 'common', dice: die(1, 20), ranges: fromMins(Array.from({ length: 20 }, (_, index) => index + 1), 20) },
  { category: 'criminal', dice: die(1, 20), ranges: fromMins(paired, 20) },
  { category: 'military', dice: die(1, 20), ranges: fromMins(paired, 20) },
  { category: 'religious', dice: die(1, 6), ranges: fromMins([1, 2, 3, 4, 5, 6], 6) },
  { category: 'wilderness', dice: die(1, 20), ranges: fromMins(paired, 20) },
];

const humanTables: { id: string; dice: Die; ranges: Range[]; domain: 'none' | 'childhood' | 'lifestyle' }[] = [
  ['ancestors', die(3, 6), standard, 'none'],
  ['family-circumstances', die(3, 6), standard, 'none'],
  ['parents', die(3, 6), pairs([[3, 4], [5, 8], [9, 12], [13, 16], [17, 18]]), 'none'],
  ['siblings', die(1, 20), pairs([[1, 4], [5, 8], [9, 12], [13, 16], [17, 20]]), 'none'],
  ['sibling-gender', die(1, 6), pairs([[1, 3], [4, 6]]), 'none'],
  ['sibling-age', die(4, 6), pairs([[4, 4], [5, 14], [15, 24]]), 'none'],
  ['character-fate', die(3, 6), standard, 'none'],
  ['death', die(3, 6), standard, 'none'],
  ['age', die(3, 6), standard, 'none'],
  ['build', die(3, 6), standard, 'none'],
  ['appearance', die(3, 6), standard, 'none'],
  ['childhood', die(3, 6), pairs([[null, 3], [4, 5], [6, 8], [9, 12], [13, 15], [16, 17], [18, null]]), 'childhood'],
  ['life', die(3, 6), standard, 'none'],
  ['major-setback', die(1, 20), faces(20), 'none'],
  ['minor-setback', die(1, 20), faces(20), 'none'],
  ['minor-windfall', die(1, 20), faces(20), 'none'],
  ['major-windfall', die(1, 20), faces(20), 'none'],
  ['strange', die(1, 20), faces(20), 'none'],
  ['lifestyle', die(3, 6), pairs([[null, 3], [4, 5], [6, 12], [13, 15], [16, 17], [18, null]]), 'lifestyle'],
  ['personality', die(3, 6), standard, 'none'],
  ['relationships', die(3, 6), standard, 'none'],
  ['obligations', die(3, 6), standard, 'none'],
  ['morality', die(3, 6), standard, 'none'],
  ['religion', die(3, 6), standard, 'none'],
  ['piety', die(3, 6), standard, 'none'],
].map(([key, diceValue, ranges, domain]) => ({ id: `only-human:${key as string}`, dice: diceValue as Die, ranges: ranges as Range[], domain: domain as 'none' | 'childhood' | 'lifestyle' }));

const oddityRoutes: { id: string; min: number; max: number; deferred: boolean }[] = [
  ['art', 1, 2, true], ['books', 3, 4, true], ['clothing', 5, 6, false], ['consumables', 7, 8, false],
  ['minor-magic', 9, 9, true], ['pets', 10, 10, true], ['people', 11, 11, false], ['personal', 12, 13, true],
  ['qualities', 14, 15, false], ['ingredients', 16, 17, true], ['tools', 18, 19, false], ['weird', 20, 20, false],
].map(([id, min, max, deferred]) => ({ id: id as string, min: min as number, max: max as number, deferred: deferred as boolean }));

const follows = new Map<string, string>([
  ['only-human:siblings:1-4', 'only-human:character-fate'],
  ['only-human:character-fate:3-3', 'only-human:siblings'],
  ['only-human:piety:3-3', 'only-human:piety'],
  ['only-human:strange:19-19', 'only-human:strange'],
]);

const pend = (reason: string, matrixSelection: 'selecionado-manual' | 'bloqueado' | 'adiado' | 'agrupado' | null = null, linkedDefinition: unknown = noLink) => ({
  kind: 'pending' as const, effect: null, pending: { reason, retainsConsequence: true as const, matrixSelection, linkedDefinition },
});
const follow = (tableId: string) => ({ kind: 'effect' as const, effect: { op: 'follow-subtable' as const, tableId, timing: 'creation' as const }, pending: null });

function rowId(tableId: string, range: Range) {
  return `${tableId}:${range.min ?? 'open'}-${range.max ?? 'open'}`;
}
function optionRowId(category: string, min: number) {
  return `pilot-profession:only-human:${category}:r${String(min).padStart(2, '0')}`;
}
function tail(range: Range) {
  if (range.min === null) return 'open-low' as const;
  if (range.max === null) return 'open-high' as const;
  return 'none' as const;
}
function naturalWeights(diceValue: Die, ranges: Range[]) {
  let counts = new Map<number, bigint>([[0, 1n]]);
  for (let roll = 0; roll < diceValue.count; roll += 1) {
    const next = new Map<number, bigint>();
    for (const [total, ways] of counts) for (let face = 1; face <= diceValue.sides; face += 1) next.set(total + face, (next.get(total + face) ?? 0n) + ways);
    counts = next;
  }
  counts.delete(0);
  const denominator = (BigInt(diceValue.sides) ** BigInt(diceValue.count)).toString();
  return ranges.map(range => {
    let ways = 0n;
    for (const [total, count] of counts) if ((range.min === null || total >= range.min) && (range.max === null || total <= range.max)) ways += count;
    return { ways: ways.toString(), denominator, basis: 'natural-dice-faces' as const };
  });
}
function domain(kind: 'none' | 'childhood' | 'lifestyle') {
  if (kind === 'childhood') return { kind: 'authorized' as const, values: [-6, -3, -1, 0, 1, 3, 6] };
  if (kind === 'lifestyle') return { kind: 'authorized-rules' as const, rules: [...ACTIVITY4_LIFESTYLE_MODIFIER_IDS] };
  return none;
}
function column(tableId: string, diceValue: Die, ranges: Range[], domainKind: 'none' | 'childhood' | 'lifestyle', rowIdFor: (range: Range, index: number) => string, consequenceFor: (id: string, range: Range) => ReturnType<typeof pend> | ReturnType<typeof follow>) {
  const weights = naturalWeights(diceValue, ranges);
  return {
    id: 'main', rollId: `${tableId}#main`, dice: diceValue, modifierDomain: domain(domainKind),
    rows: ranges.map((range, index) => {
      const id = rowIdFor(range, index);
      return { id, min: range.min, max: range.max, tail: tail(range), publishedWeight: weights[index], consequence: consequenceFor(id, range) };
    }),
  };
}
function weighted(id: string, diceValue: Die, ranges: Range[], domainKind: 'none' | 'childhood' | 'lifestyle', rowIdFor: (range: Range, index: number) => string, consequenceFor: (id: string, range: Range) => ReturnType<typeof pend> | ReturnType<typeof follow>) {
  return {
    id, kind: 'weighted-table' as const, publishedCycle: (PUBLISHED_CYCLE_IDS as readonly string[]).includes(id),
    columns: [column(id, diceValue, ranges, domainKind, rowIdFor, consequenceFor)],
  };
}
const capability = (row: Activity4MatrixRow, prefix: string) => {
  const hit = row.capabilities.find(item => item.startsWith(prefix));
  if (!hit) throw new Error(`Activity 4 matrix row ${row.id} is missing ${prefix}`);
  return hit.slice(prefix.length);
};
const sameIds = (left: string[], right: readonly string[]) => left.length === right.length && [...left].sort().join() === [...right].sort().join();

/** Builds the public synthetic activity-4 lot. Hash lines stay counts; act 5 bodies stay null. */
export function buildHumanL0Activity4Lot(matrix: { records: Activity4MatrixRow[] }) {
  const records = matrix.records;
  const inLot = (row: Activity4MatrixRow) => row.disposition === 'lote-only-human' || row.disposition === 'lote-oddities';
  const onlyHuman = records.filter(row => row.disposition === 'lote-only-human');
  const oddities = records.filter(row => row.disposition === 'lote-oddities');
  if (onlyHuman.length !== ACTIVITY4_LOT_COUNTS.onlyHuman || oddities.length !== ACTIVITY4_LOT_COUNTS.oddities) throw new Error('Activity 4 lot counts drifted');
  const hash = records.filter(row => inLot(row) && row.evidence === 'hash-declarado-nao-refeito');
  if (hash.length !== ACTIVITY4_LOT_COUNTS.hashLines) throw new Error(`Activity 4 hash lines drifted: ${hash.length}`);
  if (!sameIds(hash.filter(row => row.kind === 'table').map(row => row.id), ACTIVITY4_DEFERRED_TABLES)) throw new Error('Deferred hash tables drifted');
  if (!sameIds(onlyHuman.filter(row => row.selection === 'selecionado-manual').map(row => row.id), ACTIVITY4_MANUAL_IDS)) throw new Error('Activity 4 manuals drifted');
  if (onlyHuman.filter(row => row.kind === 'table').length !== 34 || oddities.filter(row => row.kind === 'table').length !== 13) throw new Error('Activity 4 table counts drifted');

  const humanConsequence = (id: string) => follows.has(id) ? follow(follows.get(id)!) : pend('manual-adjudication');
  const tables = [
    ...humanTables.map(spec => weighted(spec.id, spec.dice, spec.ranges, spec.domain, range => rowId(spec.id, range), humanConsequence)),
    weighted('only-human:profession-router', die(1, 6), faces(6), 'none', range => rowId('only-human:profession-router', range), (_id, range) => follow(`only-human:${professions[range.min! - 1].category}`)),
    ...professions.map(spec => weighted(`only-human:${spec.category}`, spec.dice, spec.ranges, 'none', range => optionRowId(spec.category, range.min!), () => pend('activity-5-body'))),
    weighted('oddities:thing-router', die(1, 20), oddityRoutes.map(route => ({ min: route.min, max: route.max })), 'none', range => rowId('oddities:thing-router', range), (_id, range) => {
      const route = oddityRoutes.find(item => item.min === range.min);
      if (!route) throw new Error('Missing Oddities route');
      return route.deferred ? pend('declared-hash-not-recomputed') : follow(`oddities:${route.id}`);
    }),
    ...oddityRoutes.filter(route => !route.deferred).map(route => weighted(`oddities:${route.id}`, die(1, 20), faces(20), 'none', range => `oddities:${route.id}:${range.min}`, () => pend('manual-adjudication'))),
    weighted(ACTIVITY4_ODDITY_SIDE_HOST, die(1, 13), faces(13), 'none', range => `${ACTIVITY4_ODDITY_SIDE_HOST}:${String(range.min).padStart(2, '0')}`, () => pend('manual-adjudication')),
  ];
  const rowIds = new Set(tables.flatMap(table => table.columns[0].rows.map(row => row.id)));
  const professionRows = records.filter(row => row.kind === 'profession-option' && row.disposition === 'lote-only-human');
  if (professionRows.length !== ACTIVITY4_LOT_COUNTS.professionOptions) throw new Error('Profession options drifted');
  const professionOptions = professionRows.map(row => {
    const program = capability(row, 'program:');
    const programId = program === 'null' ? null : program;
    if (programId === null) {
      if (row.id !== 'pilot-profession:only-human:direct:occult') throw new Error(`Unexpected programless profession ${row.id}`);
      return { id: row.id, programId, familyGrantsGear: false, inRandomPool: false };
    }
    if (!rowIds.has(row.id) || programId !== `profession:${row.id}`) throw new Error(`Profession program drifted: ${row.id}`);
    return { id: row.id, programId, familyGrantsGear: false, inRandomPool: true };
  });
  const templates = records.filter(row => row.kind === 'development-template' && row.disposition === 'lote-only-human');
  if (templates.length !== ACTIVITY4_LOT_COUNTS.developmentTemplates) throw new Error('Development templates drifted');
  const links = records.filter(row => row.kind === 'link' && inLot(row));
  if (links.length !== ACTIVITY4_LOT_COUNTS.links || links.some(row => !row.capabilities.includes('automatic-execution:false'))) throw new Error('Activity 4 links drifted');
  const sideIds = records.filter(row => row.kind === 'side-roll' && row.disposition === 'lote-only-human').map(row => row.id);
  if (!sameIds(sideIds, ACTIVITY4_OH_SIDE_ROLLS.map(row => row.id))) throw new Error('Only Human side rolls drifted');
  const queryIds = records.filter(row => row.kind === 'query' && inLot(row)).map(row => row.id);
  if (!sameIds(queryIds, [ACTIVITY4_LIFESTYLE_QUERY, 'query:profession-faces:only-human', 'query:family-category', 'selected:interesting-things-router'])) throw new Error('Activity 4 queries drifted');

  const lifestyles = ['destitute', 'poor', 'getting-by', 'comfortable', 'wealthy', 'rich'];
  const act5Slots = [
    ...ACTIVITY4_ACT5_LOOKUPS.map(id => ({ id, kind: 'lifestyle-lookup' as const, readsQueryId: ACTIVITY4_LIFESTYLE_QUERY, body: null, activity: 5 as const, familyGrantsGear: false })),
    ...lifestyles.map(name => ({ id: `only-human:kit:${name}`, kind: 'kit-program' as const, readsQueryId: ACTIVITY4_LIFESTYLE_QUERY, body: null, activity: 5 as const, familyGrantsGear: false })),
    ...professionOptions.filter(option => option.programId).map(option => ({ id: option.programId!, kind: 'profession-program' as const, readsQueryId: null, body: null, activity: 5 as const, familyGrantsGear: false })),
  ];
  const grants = records.filter(row => row.kind === 'interesting-grant' && row.disposition === 'lote-only-human').map(row => ({
    id: row.id, additional: row.capabilities.includes('additional:true'), bindsSelector: true as const, projected: true, activity: 4 as const,
  }));
  const coreCount = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 3).reduce((sum, member) => sum + member.count, 0);
  const catalogCount = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 5).reduce((sum, member) => sum + member.count, 0);
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
      {
        id: 'act3-act5-grouped-local-only' as const, count: coreCount + catalogCount, linkedDefinition: 'local-only', individualEvidence: false,
        coreProfessionOptions: coreCount, catalogRecords: catalogCount, activities: [3, 5],
        members: GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({ id: member.id, count: member.count, activity: member.activity, reason: member.reason })),
      },
    ],
    recursion: { maxDepth: 4, onLimit: 'pending' as const, pendingReason: 'bounded-recursion' as const, silentReroll: false, discardOutcome: false },
    unprojectedPublishedCycles: PUBLISHED_CYCLE_IDS.map(id => ({ id, projected: true })),
    choices: [],
    producedQueries: [{ id: ACTIVITY4_LIFESTYLE_QUERY, producedBy: { tableId: 'only-human:lifestyle', columnId: 'main' } }],
    tables,
    lookups: [],
    sideRolls: [
      ...ACTIVITY4_OH_SIDE_ROLLS.map(roll => ({
        id: roll.id,
        parent: { tableId: roll.parentRow.slice(0, roll.parentRow.lastIndexOf(':')), columnId: 'main', rowId: roll.parentRow },
        phase: roll.phase, dice: { count: roll.count, sides: roll.sides }, rollId: roll.id, subject: roll.subject,
        frequency: 'once-per-origin' as const, appliesOnPossession: false, when: { optionId: null }, modifier: roll.modifier, reading: roll.reading,
        consequence: pend('manual-adjudication'),
      })),
      ...ACTIVITY4_ODDITY_SIDE_TOPOLOGY.map((roll, index) => {
        const face = String(index + 1).padStart(2, '0');
        return {
          id: `fixture:oddity-side:${face}`,
          parent: { tableId: ACTIVITY4_ODDITY_SIDE_HOST, columnId: 'main', rowId: `${ACTIVITY4_ODDITY_SIDE_HOST}:${face}` },
          phase: roll.phase, dice: { count: roll.count, sides: roll.sides }, rollId: `fixture:oddity-side:${face}`, subject: 'item' as const,
          frequency: 'once-per-origin' as const, appliesOnPossession: false, when: { optionId: null }, modifier: roll.modifier, reading: 'total' as const,
          consequence: pend('manual-adjudication'),
        };
      }),
    ],
    items: [],
    grants: [],
    events: [],
    groupedPendings: GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({
      id: member.id, blockerId: 'act3-act5-grouped-local-only' as const, activity: member.activity, represents: member.count,
      linkedDefinition: localOnly,
      evidence: { kind: 'local-only-group' as const, individualEvidence: false, recomputedHash: null },
      weights: null,
      consequence: pend(member.reason, 'agrupado', localOnly),
    })),
    manualResolutions: MANUAL_RESOLUTION_SLOTS.map(slot => ({
      matrixId: slot.matrixId,
      consequence: pend(slot.reason, 'selecionado-manual', slot.linkedDefinition.kind === 'choice'
        ? { kind: 'choice' as const, candidates: [...slot.linkedDefinition.candidates], resolvedItemId: null }
        : slot.linkedDefinition.kind === 'local-only' ? localOnly : notItem),
    })),
    activityLot: 4 as const,
    activity4: {
      lots: ['lote-only-human', 'lote-oddities'] as const,
      counts: { ...ACTIVITY4_LOT_COUNTS, hashLinesMaterialized: 0 as const },
      hashLines: { count: ACTIVITY4_LOT_COUNTS.hashLines, materialized: 0, weights: null, reason: 'declared-hash-not-recomputed' as const },
      ancestryProcedures: [
        { id: 'human-development' as const, role: 'default' as const, sourceId: 'sotdl:only-human' as const, projected: true as const, activity: 4 as const },
        { id: 'core-alternative' as const, role: 'alternative' as const, sourceId: 'sotdl:shadow-of-the-demon-lord-core' as const, projected: false as const, activity: 3 as const },
      ],
      interestingThings: {
        id: 'selected:interesting-things-router' as const, defaultVariant: 'oddities' as const, alternativeVariant: 'core' as const,
        alternativeProjected: false as const, alternativeActivity: 3 as const, silentFallback: false, disabledSource: 'pending' as const,
      },
      queries: {
        startingLifestyle: { id: ACTIVITY4_LIFESTYLE_QUERY, producedBy: { tableId: 'only-human:lifestyle' as const, columnId: 'main' as const }, openTail: true as const, modifiersAfterDice: true as const },
        professionFaces: { id: 'query:profession-faces:only-human' as const, selector: 'only-human:profession-router' as const, religiousChild: '1d6' as const, otherChildren: '1d20' as const, uniform: false as const },
        familyCategory: { id: 'query:family-category' as const, dice: null, uniformDie: false as const, missingContext: 'pending' as const },
      },
      lifestyleModifiers: [
        { id: 'lifestyle-modifier:life', delta: 1, results: [9, 10, 11, 12], tableId: 'only-human:life', afterDice: true as const },
        { id: 'lifestyle-modifier:major-setback:5-8', delta: -3, results: [5, 8], tableId: 'only-human:major-setback', afterDice: true as const },
        { id: 'lifestyle-modifier:major-setback:10', delta: -1, results: [10], tableId: 'only-human:major-setback', afterDice: true as const },
        { id: 'lifestyle-modifier:minor-setback', delta: -1, results: [4, 10, 19], tableId: 'only-human:minor-setback', afterDice: true as const },
        { id: 'lifestyle-modifier:minor-windfall', delta: 1, results: [2, 7], tableId: 'only-human:minor-windfall', afterDice: true as const },
        { id: 'lifestyle-modifier:major-windfall', delta: 3, results: [4, 13], tableId: 'only-human:major-windfall', afterDice: true as const },
      ],
      act5Slots,
      links: links.map(row => ({ id: row.id, from: capability(row, 'from:'), to: capability(row, 'to:'), kind: capability(row, 'link:'), automaticExecution: false })),
      professionOptions,
      developmentTemplates: templates.map(row => ({ id: row.id, tableId: capability(row, 'table:'), pending: true as const })),
      interestingGrants: [
        ...grants,
        { id: 'core-initial-thing', additional: false, bindsSelector: true as const, projected: false, activity: 3 as const },
      ],
      textReference: {
        id: 'oddities:books:20' as const, kind: 'text-reference' as const,
        hook: { id: 'dark-passages-books-and-passages' as const, enabled: false },
        consequence: pend('text-reference'),
      },
      deferredTables: ACTIVITY4_DEFERRED_TABLES.map(id => ({ id, weights: null, materializedLines: 0 as const })),
      cycleWalk: [
        { from: { tableId: 'only-human:siblings', rowId: 'only-human:siblings:1-4' }, to: 'only-human:character-fate' },
        { from: { tableId: 'only-human:character-fate', rowId: 'only-human:character-fate:3-3' }, to: 'only-human:siblings' },
        { from: { tableId: 'only-human:piety', rowId: 'only-human:piety:3-3' }, to: 'only-human:piety' },
        { from: { tableId: 'only-human:strange', rowId: 'only-human:strange:19-19' }, to: 'only-human:strange' },
      ],
      odditySideRolls: { topology: 'synthetic' as const, realFaceIds: false as const, count: 13 as const, host: ACTIVITY4_ODDITY_SIDE_HOST },
    },
  };
}

export function composeFaceWeight(parentWays: string, parentDenominator: string, childWays: string, childDenominator: string) {
  return { ways: (BigInt(parentWays) * BigInt(childWays)).toString(), denominator: (BigInt(parentDenominator) * BigInt(childDenominator)).toString() };
}
