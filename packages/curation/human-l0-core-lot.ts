import { z } from 'zod';
import {
  GROUPED_LOCAL_ONLY_MEMBERS, HASH_CHECK_BLOCKER, HUMAN_L0_CONSUMABLE_COMPATIBILITY, HUMAN_L0_CONSUMABLE_CONTRACT,
  HUMAN_L0_CONSUMABLE_CONTRACT_VERSION, MANUAL_RESOLUTION_SLOTS, PUBLISHED_CYCLE_IDS,
  HumanL0ConsumableDocumentSchema, parseHumanL0Consumable,
} from './human-l0-consumable';

/**
 * Public Core-lot shapes for issue 34 activity 3.
 * The document stays on `sotdl.human-l0.consumable@1.0.0` and is entirely synthetic.
 * Published 3d6 bands and the 36 unextracted profession faces are not copied here.
 */
export const HUMAN_L0_CORE_LOT_COUNTS = {
  matrixRows: 260,
  accountingIds: 293,
  tables: 22,
  flows: 23,
  links: 12,
  professionAccounting: 102,
  professionIndividual: 66,
  professionGrouped: 36,
  selectedLanguages: 6,
  manualLanguages: 2,
  interestingOutcomes: 120,
  projectedIdentities: 111,
  pendingIdentities: 149,
} as const;

const UNPROJECTED_TABLES = ['core:profession-martial', 'core:profession-religious', 'core:profession-wilderness'] as const;
const PROJECTED_PROFESSION_CATEGORIES = ['academic', 'common', 'criminal'] as const;
const PROFESSION_ROUTER = ['academic', 'common', 'criminal', 'martial', 'religious', 'wilderness'] as const;
const PUBLICATION = 'syn-core-lot';
const INVENTED_GROUPED_FACE = /pilot-profession:core:(?:martial|religious|wilderness):r\d+/;

export class HumanL0CoreLotError extends Error {
  constructor(public readonly code: string, public readonly pointer: string) {
    super(`${HUMAN_L0_CONSUMABLE_CONTRACT}@${HUMAN_L0_CONSUMABLE_CONTRACT_VERSION} core-lot#${pointer}: ${code}`);
    this.name = 'HumanL0CoreLotError';
  }
}
function fail(code: string, pointer: string): never {
  throw new HumanL0CoreLotError(code, pointer);
}

export type CoreLotMatrixRecord = {
  id: string;
  kind: string;
  disposition: string;
  represents: number;
  selection: string;
  evidence: string;
  capabilities: string[];
};

type Dice = { count: number; sides: number };
type Band = { min: number; max: number };
type Consequence = z.infer<typeof HumanL0ConsumableDocumentSchema>['tables'][number]['columns'][number]['rows'][number]['consequence'];

const notItem = { kind: 'not-an-item' as const };
const localOnly = { kind: 'local-only' as const, individualEvidence: false as const };

function effect(effectValue: Extract<Consequence, { kind: 'effect' }>['effect']): Consequence {
  return { kind: 'effect', effect: effectValue, pending: null };
}
function pending(reason: Extract<Consequence, { kind: 'pending' }>['pending']['reason'], linked: Extract<Consequence, { kind: 'pending' }>['pending']['linkedDefinition'], matrixSelection: Extract<Consequence, { kind: 'pending' }>['pending']['matrixSelection'] = null): Consequence {
  return { kind: 'pending', effect: null, pending: { reason, retainsConsequence: true, matrixSelection, linkedDefinition: linked } };
}
function marker(code: string): Consequence {
  return effect({ op: 'narrative-marker', code, timing: 'narrative', mutatesMechanics: false });
}
function grantProfession(professionId: string): Consequence {
  return effect({ op: 'grant-profession', professionId, subject: 'character', timing: 'creation' });
}
function followSubtable(tableId: string): Consequence {
  return effect({ op: 'follow-subtable', tableId, timing: 'creation' });
}

export function enumerateDice(dice: Dice) {
  let counts = new Map<number, bigint>([[0, 1n]]);
  for (let roll = 0; roll < dice.count; roll++) {
    const next = new Map<number, bigint>();
    for (const [total, ways] of counts) for (let face = 1; face <= dice.sides; face++) next.set(total + face, (next.get(total + face) ?? 0n) + ways);
    counts = next;
  }
  counts.delete(0);
  return counts;
}

/** Contiguous bands of equal face-span. This is a public placeholder, not a published table. */
export function syntheticEvenBands(dice: Dice, rows: number): Band[] {
  const totals: number[] = [];
  for (let total = dice.count; total <= dice.count * dice.sides; total++) totals.push(total);
  if (rows < 1 || rows > totals.length) fail('band-count', `${dice.count}d${dice.sides}/${rows}`);
  const base = Math.floor(totals.length / rows);
  let extra = totals.length % rows;
  const bands: Band[] = [];
  let index = 0;
  for (let row = 0; row < rows; row++) {
    const width = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    const slice = totals.slice(index, index + width);
    bands.push({ min: slice[0], max: slice[slice.length - 1] });
    index += width;
  }
  return bands;
}

function singletonBands(sides: number): Band[] {
  return Array.from({ length: sides }, (_, index) => ({ min: index + 1, max: index + 1 }));
}

function weightsFor(dice: Dice, bands: Band[]) {
  const totals = enumerateDice(dice);
  const denominator = (BigInt(dice.sides) ** BigInt(dice.count)).toString();
  return bands.map(band => {
    let ways = 0n;
    for (const [total, count] of totals) if (total >= band.min && total <= band.max) ways += count;
    if (ways === 0n) fail('band-count', `${band.min}-${band.max}`);
    return { ways: ways.toString(), denominator, basis: 'natural-dice-faces' as const };
  });
}

function cap(record: CoreLotMatrixRecord, prefix: string) {
  return record.capabilities.find(item => item.startsWith(prefix))?.slice(prefix.length) ?? null;
}
function requireCap(record: CoreLotMatrixRecord, prefix: string) {
  const value = cap(record, prefix);
  if (value === null) fail('matrix-shape', `${record.id}/${prefix}`);
  return value;
}
function parseDice(spec: string, pointer: string): Dice {
  const match = /^(\d+)d(\d+)$/.exec(spec);
  if (!match) fail('matrix-shape', pointer);
  return { count: Number(match[1]), sides: Number(match[2]) };
}
function pad(value: number) {
  return String(value).padStart(2, '0');
}
function categoryOf(id: string) {
  const match = /^pilot-profession:core:([a-z]+):/.exec(id);
  if (!match) fail('matrix-shape', id);
  return match[1];
}
function linkEnds(record: CoreLotMatrixRecord) {
  return { from: requireCap(record, 'from:'), to: requireCap(record, 'to:') };
}

const bandSchema = z.object({ min: z.number().int(), max: z.number().int() }).strict();
const idList = z.array(z.string());
export const HumanL0CoreLotSchema = z.object({
  contract: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT),
  contractVersion: z.literal(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION),
  distribution: z.literal('public-synthetic'),
  fictionalData: z.literal(true),
  realPack: z.literal(false),
  reviewStatus: z.literal('needs-review'),
  rulesetEnabled: z.literal(false),
  importablePack: z.literal(false),
  promotesReview: z.literal(false),
  orchestratesProcedure: z.literal(false),
  closesAct1HashCheck: z.literal(false),
  publishedWeightsIncluded: z.literal(false),
  act5CatalogProjected: z.literal(false),
  odditiesProjected: z.literal(false),
  counts: z.object({
    matrixRows: z.literal(HUMAN_L0_CORE_LOT_COUNTS.matrixRows),
    accountingIds: z.literal(HUMAN_L0_CORE_LOT_COUNTS.accountingIds),
    tables: z.literal(HUMAN_L0_CORE_LOT_COUNTS.tables),
    flows: z.literal(HUMAN_L0_CORE_LOT_COUNTS.flows),
    links: z.literal(HUMAN_L0_CORE_LOT_COUNTS.links),
    professionAccounting: z.literal(HUMAN_L0_CORE_LOT_COUNTS.professionAccounting),
    professionIndividual: z.literal(HUMAN_L0_CORE_LOT_COUNTS.professionIndividual),
    professionGrouped: z.literal(HUMAN_L0_CORE_LOT_COUNTS.professionGrouped),
    selectedLanguages: z.literal(HUMAN_L0_CORE_LOT_COUNTS.selectedLanguages),
    manualLanguages: z.literal(HUMAN_L0_CORE_LOT_COUNTS.manualLanguages),
    interestingOutcomes: z.literal(HUMAN_L0_CORE_LOT_COUNTS.interestingOutcomes),
    projectedIdentities: z.literal(HUMAN_L0_CORE_LOT_COUNTS.projectedIdentities),
    pendingIdentities: z.literal(HUMAN_L0_CORE_LOT_COUNTS.pendingIdentities),
  }).strict(),
  document: HumanL0ConsumableDocumentSchema,
  unprojectedTables: z.array(z.object({
    id: z.enum(UNPROJECTED_TABLES), dice: z.object({ count: z.literal(1), sides: z.literal(20) }).strict(),
    declaredRows: z.number().int().positive(), reason: z.literal('range-starts-not-reextracted'),
    weights: z.null(), flowEvidence: z.enum(['entailed-coverage', 'code-anchor', 'local-only']),
  }).strict()).length(UNPROJECTED_TABLES.length),
  unweightedProfessions: z.array(z.object({
    id: z.string(), category: z.enum(['martial', 'religious']), rangeMin: z.number().int().positive(),
    rangeMax: z.null(), weights: z.null(), reason: z.literal('range-starts-not-reextracted'),
  }).strict()),
  groupedProfessions: z.array(z.object({
    id: z.string(), count: z.number().int().positive(), weights: z.null(), reason: z.literal('range-starts-not-reextracted'),
  }).strict()).length(3),
  links: z.array(z.object({
    id: z.string(), from: z.string(), to: z.string(), automaticExecution: z.literal(false),
    projection: z.enum(['follow-subtable', 'pending-range-starts']),
  }).strict()).length(HUMAN_L0_CORE_LOT_COUNTS.links),
  queries: z.array(z.object({
    id: z.string(), kind: z.enum(['lookup', 'produced-roll']), dice: z.string().nullable(),
    expandedModifiers: z.boolean(), extraDice: z.literal(false), rejectsIncompatibleFace: z.boolean(),
    publishedThresholds: z.null(),
  }).strict()).length(2),
  sideRoll: z.object({
    id: z.literal('side-roll:core:human-background:12'), phase: z.literal('creation'),
    dice: z.object({ count: z.literal(1), sides: z.literal(6) }).strict(), minus: z.literal(2), minimum: z.literal(0),
    appliesOnPossession: z.literal(false), applied: z.literal(false), unconditionalTable: z.literal(false),
  }).strict(),
  languages: z.array(z.object({
    id: z.string(), selection: z.enum(['selecionado', 'selecionado-manual']),
    speak: z.enum(['default', 'pending']), readWrite: z.enum(['explicit-only', 'open-category']), grantedInDocument: z.literal(false),
  }).strict()).length(8),
  templates: z.array(z.object({
    id: z.enum(['core-background-education', 'core-background-travel']),
    speak: z.boolean(), read: z.boolean(), write: z.literal(false), grantsProfession: z.literal(false),
    languageId: z.null(), contract: z.enum(['pending:partial-literacy', 'pending:conditional-manual']),
  }).strict()).length(2),
  choiceRights: z.object({
    id: z.literal('syn-profession-choice-rights'), count: z.literal(2), grantsProfession: z.literal(false),
    contractOp: z.literal('narrative-marker'),
  }).strict(),
  ancestryBenefit: z.object({
    id: z.literal('syn-ancestry-benefit'), exclusive: z.literal(true), grantsProfession: z.literal(false), grantsLanguage: z.literal(false),
    options: z.tuple([z.literal('syn-extra-language'), z.literal('syn-random-profession')]),
  }).strict(),
  initialThing: z.object({
    id: z.literal('core-initial-thing'), count: z.literal(1), additional: z.literal(false),
    bindsSelectedProcedure: z.literal(true), odditiesProjected: z.literal(false),
  }).strict(),
  bands: z.array(z.object({
    id: z.string(), dice: z.object({ count: z.number().int(), sides: z.number().int() }).strict(),
    weightSource: z.enum(['entailed-singleton', 'synthetic-even-split']), ranges: z.array(bandSchema).min(1),
  }).strict()),
  thingSummary: z.object({
    outcomes: z.literal(120), evidence: z.literal('hash-declarado-nao-refeito'), text: z.null(),
    byShape: z.object({ object: z.number().int(), narrative: z.number().int(), companion: z.number().int(), mixed: z.number().int() }).strict(),
    choices: z.literal(26), sideRolls: z.literal(10), sideRollDice: z.null(), itemProfiles: z.literal(0),
  }).strict(),
  applicability: z.object({
    orchestratesProcedure: z.literal(false), forIssue: z.literal(35),
    activations: z.array(z.object({ id: z.string(), activation: z.string() }).strict()),
  }).strict(),
  projected: z.object({
    tables: idList, flows: idList, links: idList, professions: idList, queries: idList, sideRoll: z.string(),
  }).strict(),
  pending: z.object({
    tables: idList, flows: idList, links: idList, professions: idList, things: idList,
    languages: idList, templates: idList, initialThing: z.string(),
  }).strict(),
}).strict();
export type HumanL0CoreLot = z.infer<typeof HumanL0CoreLotSchema>;

function column(tableId: string, columnId: string, dice: Dice, bands: Band[], rows: { id: string; consequence: Consequence }[]) {
  const published = weightsFor(dice, bands);
  return {
    id: columnId,
    rollId: `${tableId}#${columnId}`,
    dice,
    modifierDomain: { kind: 'none' as const },
    rows: rows.map((row, index) => ({
      id: row.id, min: bands[index].min, max: bands[index].max, tail: 'none' as const,
      publishedWeight: published[index], consequence: row.consequence,
    })),
  };
}

function origin(entityId: string, componentId: string) {
  return { publicationId: PUBLICATION, version: null as null, entityId, resultId: null, componentId };
}

/** Rejects a face the published two-step query cannot accept. Grouped categories stay pending. */
export function classifyProfessionFaces(typeFace: number, detailFace: number) {
  if (!Number.isInteger(typeFace) || !Number.isInteger(detailFace) || typeFace < 1 || typeFace > 6 || detailFace < 1 || detailFace > 20) {
    return { status: 'rejected' as const, reason: 'incompatible-face' as const };
  }
  const category = PROFESSION_ROUTER[typeFace - 1];
  if (!PROJECTED_PROFESSION_CATEGORIES.includes(category as typeof PROJECTED_PROFESSION_CATEGORIES[number])) {
    return { status: 'pending' as const, reason: 'range-starts-not-reextracted' as const, category };
  }
  return { status: 'grant' as const, category, optionId: `pilot-profession:core:${category}:r${pad(detailFace)}` };
}

function blockers() {
  const hash = {
    id: HASH_CHECK_BLOCKER.id, count: HASH_CHECK_BLOCKER.count, blocksSyntheticFixtures: HASH_CHECK_BLOCKER.blocksSyntheticFixtures,
    evidenceStatus: HASH_CHECK_BLOCKER.evidenceStatus, activities: [...HASH_CHECK_BLOCKER.activities],
  };
  const grouped = {
    id: 'act3-act5-grouped-local-only' as const,
    count: GROUPED_LOCAL_ONLY_MEMBERS.reduce((sum, member) => sum + member.count, 0),
    linkedDefinition: 'local-only', individualEvidence: false,
    coreProfessionOptions: GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 3).reduce((sum, member) => sum + member.count, 0),
    catalogRecords: GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 5).reduce((sum, member) => sum + member.count, 0),
    activities: [3, 5],
    members: GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({ id: member.id, count: member.count, activity: member.activity, reason: member.reason })),
  };
  return [hash, grouped] as const;
}

function manualResolutions() {
  return MANUAL_RESOLUTION_SLOTS.map(slot => ({
    matrixId: slot.matrixId,
    consequence: pending(slot.reason, slot.linkedDefinition.kind === 'choice'
      ? { kind: 'choice', candidates: [...slot.linkedDefinition.candidates], resolvedItemId: null }
      : slot.linkedDefinition.kind === 'local-only'
        ? localOnly
        : notItem, 'selecionado-manual'),
  }));
}

function groupedPendings() {
  return GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({
    id: member.id, blockerId: 'act3-act5-grouped-local-only' as const, activity: member.activity, represents: member.count,
    linkedDefinition: localOnly,
    evidence: { kind: 'local-only-group' as const, individualEvidence: false, recomputedHash: null },
    weights: null,
    consequence: pending(member.reason, localOnly, 'agrupado'),
  }));
}

/** Builds the public synthetic Core lot from the activity 1 matrix. It does not roll or read local bytes. */
export function buildHumanL0CoreLot(matrix: { records: CoreLotMatrixRecord[] }): HumanL0CoreLot {
  const core = matrix.records.filter(record => record.disposition === 'lote-core');
  const accounting = core.reduce((sum, record) => sum + record.represents, 0);
  if (core.length !== HUMAN_L0_CORE_LOT_COUNTS.matrixRows || accounting !== HUMAN_L0_CORE_LOT_COUNTS.accountingIds) {
    fail('matrix-count-mismatch', '/records');
  }
  const ofKind = (kind: string) => core.filter(record => record.kind === kind);
  const tables = ofKind('table');
  const flows = ofKind('flow');
  const links = ofKind('link').slice().sort((a, b) => Number(a.id.slice(a.id.lastIndexOf(':') + 1)) - Number(b.id.slice(b.id.lastIndexOf(':') + 1)));
  const options = ofKind('profession-option');
  const languages = ofKind('language-option');
  const templates = ofKind('development-template');
  const outcomes = ofKind('interesting-outcome');
  const queries = ofKind('query');
  const sideRecords = ofKind('side-roll');
  const grants = ofKind('interesting-grant');
  if (tables.length !== 22 || flows.length !== 23 || links.length !== 12 || queries.length !== 2 || sideRecords.length !== 1 || grants.length !== 1 || templates.length !== 2) {
    fail('matrix-count-mismatch', '/kinds');
  }

  const byCategory = new Map<string, CoreLotMatrixRecord[]>();
  for (const option of options) {
    const category = categoryOf(option.id);
    byCategory.set(category, [...(byCategory.get(category) ?? []), option]);
  }
  const unweightedProfessions: HumanL0CoreLot['unweightedProfessions'] = [];
  const projectedProfessions: string[] = [];
  for (const category of PROFESSION_ROUTER) {
    const group = byCategory.get(category) ?? [];
    const grouped = group.find(option => option.id.endsWith(':*'));
    const individuals = group.filter(option => !option.id.endsWith(':*'));
    const flow = flows.find(record => record.id === `core:profession-${category}#main`);
    if (!flow) fail('matrix-shape', category);
    const declaredRows = Number(requireCap(flow, 'rows:'));
    const accounted = individuals.length + (grouped?.represents ?? 0);
    if (accounted !== declaredRows) fail('matrix-count-mismatch', `core:profession-${category}`);
    if (PROJECTED_PROFESSION_CATEGORIES.includes(category as typeof PROJECTED_PROFESSION_CATEGORIES[number])) {
      if (grouped) fail('matrix-shape', category);
      const mins = individuals.map(option => Number(requireCap(option, 'range-min:'))).sort((a, b) => a - b);
      if (mins.length !== 20 || mins.some((min, index) => min !== index + 1)) fail('matrix-shape', category);
      projectedProfessions.push(...individuals.slice().sort((a, b) => Number(requireCap(a, 'range-min:')) - Number(requireCap(b, 'range-min:'))).map(option => option.id));
    } else if (!grouped || grouped.evidence !== 'local-only') {
      fail('range-starts-not-reextracted', category);
    } else {
      for (const option of individuals) {
        unweightedProfessions.push({
          id: option.id, category: category as 'martial' | 'religious', rangeMin: Number(requireCap(option, 'range-min:')),
          rangeMax: null, weights: null, reason: 'range-starts-not-reextracted',
        });
      }
    }
  }
  if (projectedProfessions.length !== 60 || unweightedProfessions.length !== 6) fail('matrix-count-mismatch', '/professions');
  const individualRecords = options.filter(option => !option.id.endsWith(':*'));
  const groupedRecords = options.filter(option => option.id.endsWith(':*'));
  if (individualRecords.length !== 66 || groupedRecords.reduce((sum, option) => sum + option.represents, 0) !== 36) fail('matrix-count-mismatch', '/profession-split');

  const professionLinks = links.filter(link => linkEnds(link).from === 'core:profession-router');
  const thingLinks = links.filter(link => linkEnds(link).from === 'core:thing-router');
  if (professionLinks.length !== 6 || thingLinks.length !== 6) fail('matrix-count-mismatch', '/links');
  professionLinks.forEach((link, index) => {
    if (linkEnds(link).to !== `core:profession-${PROFESSION_ROUTER[index]}`) fail('matrix-shape', link.id);
    if (!link.capabilities.includes('automatic-execution:false')) fail('matrix-shape', link.id);
  });
  thingLinks.forEach((link, index) => {
    if (linkEnds(link).to !== `core:thing-${index + 1}`) fail('matrix-shape', link.id);
    if (!link.capabilities.includes('automatic-execution:false')) fail('matrix-shape', link.id);
  });

  const thingRows = new Map<string, CoreLotMatrixRecord[]>();
  const byShape = { object: 0, narrative: 0, companion: 0, mixed: 0 };
  let thingChoices = 0;
  let thingSideRolls = 0;
  for (const outcome of outcomes) {
    if (outcome.evidence !== 'hash-declarado-nao-refeito') fail('interesting-text-invented', outcome.id);
    const tableId = requireCap(outcome, 'table:');
    const face = Number(requireCap(outcome, 'face:'));
    const shape = requireCap(outcome, 'kind:');
    if (!(shape in byShape) || face < 1 || face > 20) fail('matrix-shape', outcome.id);
    byShape[shape as keyof typeof byShape] += 1;
    thingChoices += Number(requireCap(outcome, 'choices:'));
    thingSideRolls += Number(requireCap(outcome, 'side-rolls:'));
    thingRows.set(tableId, [...(thingRows.get(tableId) ?? []), outcome]);
  }
  if (outcomes.length !== 120 || thingChoices !== 26 || thingSideRolls !== 10) fail('matrix-count-mismatch', '/things');

  const side = sideRecords[0];
  const sideFormula = /^(\d+)d(\d+)-(\d+):min(\d+)$/.exec(requireCap(side, 'creation:'));
  if (side.id !== 'side-roll:core:human-background:12' || !sideFormula || sideFormula[1] !== '1' || sideFormula[2] !== '6' || sideFormula[3] !== '2' || sideFormula[4] !== '0') {
    fail('matrix-shape', side.id);
  }

  const bands: HumanL0CoreLot['bands'] = [];
  const builtTables = [];
  const projectedTables: string[] = [];
  const projectedFlows: string[] = [];
  const pendingTables: string[] = [];
  const pendingFlows: string[] = [];
  const unprojectedTables: HumanL0CoreLot['unprojectedTables'] = [];
  const activations: { id: string; activation: string }[] = [];

  for (const table of tables) {
    const tableId = table.id;
    const dice = parseDice(requireCap(table, 'dice:'), tableId);
    const activation = requireCap(table, 'activation:');
    activations.push({ id: tableId, activation });
    const tableFlows = flows.filter(flow => flow.id.startsWith(`${tableId}#`));
    if (UNPROJECTED_TABLES.includes(tableId as typeof UNPROJECTED_TABLES[number])) {
      if (tableFlows.length !== 1) fail('matrix-shape', tableId);
      pendingTables.push(tableId);
      pendingFlows.push(tableFlows[0].id);
      unprojectedTables.push({
        id: tableId as typeof UNPROJECTED_TABLES[number], dice: { count: 1, sides: 20 },
        declaredRows: Number(requireCap(tableFlows[0], 'rows:')), reason: 'range-starts-not-reextracted',
        weights: null, flowEvidence: tableFlows[0].evidence as HumanL0CoreLot['unprojectedTables'][number]['flowEvidence'],
      });
      continue;
    }
    projectedTables.push(tableId);
    const columns = tableFlows.map(flow => {
      const columnId = flow.id.slice(tableId.length + 1);
      const rows = Number(requireCap(flow, 'rows:'));
      const weightSource = dice.count === 1 && rows === dice.sides ? 'entailed-singleton' as const : 'synthetic-even-split' as const;
      const ranges = weightSource === 'entailed-singleton' ? singletonBands(dice.sides) : syntheticEvenBands(dice, rows);
      projectedFlows.push(flow.id);
      bands.push({ id: flow.id, dice, weightSource, ranges });
      const role = requireCap(table, 'role:');
      let rowSpecs: { id: string; consequence: Consequence }[];
      if (role === 'profession-child') {
        const category = tableId.slice('core:profession-'.length);
        rowSpecs = projectedProfessions.filter(id => id.startsWith(`pilot-profession:core:${category}:`)).map(id => ({ id, consequence: grantProfession(id) }));
      } else if (tableId === 'core:profession-router') {
        rowSpecs = professionLinks.map(link => {
          const target = linkEnds(link).to;
          const consequence = UNPROJECTED_TABLES.includes(target as typeof UNPROJECTED_TABLES[number])
            ? pending('range-starts-not-reextracted', localOnly, 'agrupado')
            : followSubtable(target);
          return { id: link.id, consequence };
        });
      } else if (tableId === 'core:thing-router') {
        rowSpecs = thingLinks.map(link => ({ id: link.id, consequence: followSubtable(linkEnds(link).to) }));
      } else if (role === 'interesting-thing') {
        const records = (thingRows.get(tableId) ?? []).slice().sort((a, b) => Number(requireCap(a, 'face:')) - Number(requireCap(b, 'face:')));
        if (records.length !== 20 || records.some((record, index) => Number(requireCap(record, 'face:')) !== index + 1)) fail('matrix-shape', tableId);
        rowSpecs = records.map(record => ({ id: record.id, consequence: pending('manual-procedure', notItem) }));
      } else if (role === 'dimension-manual') {
        rowSpecs = ranges.map((_, index) => ({ id: `syn:build:b${index + 1}`, consequence: pending('manual-composition', notItem) }));
      } else if (role === 'lifestyle-class') {
        rowSpecs = ranges.map((_, index) => ({ id: `syn:wealth:b${index + 1}`, consequence: marker(`syn-wealth-b${index + 1}`) }));
      } else if (role === 'two-independent-columns') {
        rowSpecs = ranges.map((range, index) => ({ id: `syn:role-${columnId}:f${pad(index + 1)}`, consequence: marker(`syn-role-${columnId}-f${pad(range.min)}`) }));
      } else if (role === 'ancestry-narrative') {
        const short = tableId.slice('core:'.length);
        rowSpecs = ranges.map((range, index) => ({
          id: weightSource === 'entailed-singleton' ? `syn:${short}:f${pad(range.min)}` : `syn:${short}:b${index + 1}`,
          consequence: marker(weightSource === 'entailed-singleton' ? `syn-${short}-f${pad(range.min)}` : `syn-${short}-b${index + 1}`),
        }));
      } else fail('matrix-shape', tableId);
      if (rowSpecs.length !== ranges.length) fail('band-count', flow.id);
      return column(tableId, columnId, dice, ranges, rowSpecs);
    });
    builtTables.push({ id: tableId, kind: 'weighted-table' as const, publishedCycle: false, columns });
  }

  const background = builtTables.find(table => table.id === 'core:human-background');
  const backgroundRow = background?.columns[0].rows.find(row => row.min === 12 && row.max === 12);
  if (!backgroundRow) fail('matrix-shape', 'core:human-background');

  const selectedLanguages = languages.filter(language => language.selection === 'selecionado');
  const manualLanguages = languages.filter(language => language.selection === 'selecionado-manual');
  if (selectedLanguages.length !== 6 || manualLanguages.length !== 2) fail('matrix-count-mismatch', '/languages');
  if (manualLanguages.map(language => language.id).sort().join() !== 'language:dead-languages,language:secret-language') fail('matrix-shape', '/languages');

  const education = templates.find(template => template.id === 'core-background-education');
  const travel = templates.find(template => template.id === 'core-background-travel');
  if (!education?.capabilities.includes('shape:read-common-tongue-only') || !travel?.capabilities.includes('shape:language-speak')) fail('matrix-shape', '/templates');
  if (!education.capabilities.includes('speak-read-write-distinct') || !travel.capabilities.includes('speak-read-write-distinct')) fail('matrix-shape', '/templates');

  const initial = grants[0];
  if (initial.id !== 'core-initial-thing' || !initial.capabilities.includes('count:1') || !initial.capabilities.includes('additional:false')) fail('matrix-shape', initial.id);

  const document = {
    contract: HUMAN_L0_CONSUMABLE_CONTRACT,
    contractVersion: HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
    distribution: 'public-synthetic' as const,
    fictionalData: true,
    reviewStatus: 'needs-review' as const,
    rulesetEnabled: false,
    importablePack: false,
    promotesReview: false,
    compatibility: HUMAN_L0_CONSUMABLE_COMPATIBILITY,
    matrix: { activity: 1 as const, closure: 'pending-act1-local-hash-check' as const, sourceVersion: null, path: 'docs/matriz-lacunas-issue34-atividade1.json' as const },
    blockers: blockers(),
    recursion: { maxDepth: 4, onLimit: 'pending' as const, pendingReason: 'bounded-recursion' as const, silentReroll: false, discardOutcome: false },
    unprojectedPublishedCycles: PUBLISHED_CYCLE_IDS.map(id => ({ id, projected: false })),
    choices: [
      { id: 'syn-thing-procedure', options: ['syn-procedure-core', 'syn-procedure-oddities'] },
      { id: 'syn-ancestry-benefit', options: ['syn-extra-language', 'syn-random-profession'] },
    ],
    producedQueries: [
      { id: 'query:profession-router-result', producedBy: { tableId: 'core:profession-router', columnId: 'main' } },
      { id: 'query:starting-lifestyle:core', producedBy: { tableId: 'core:wealth', columnId: 'main' } },
    ],
    tables: builtTables,
    lookups: [{
      id: 'query:profession-faces:core', kind: 'lookup' as const, dice: null,
      reads: { queryId: 'query:profession-router-result', component: 'result' as const },
      keys: professionLinks.map(link => {
        const target = linkEnds(link).to;
        // follow-subtable is only legal on a table row. The lookup reuses the d6 face and does not open the child die.
        const consequence = UNPROJECTED_TABLES.includes(target as typeof UNPROJECTED_TABLES[number])
          ? pending('range-starts-not-reextracted', localOnly, 'agrupado')
          : marker(`syn-route-${target.slice('core:profession-'.length)}`);
        return { key: link.id, consequence };
      }),
    }],
    sideRolls: [{
      id: side.id,
      parent: { tableId: 'core:human-background', columnId: 'main', rowId: backgroundRow.id },
      phase: 'creation' as const, dice: { count: 1, sides: 6 }, rollId: `${side.id}#die`,
      subject: 'character' as const, frequency: 'once-per-origin' as const, appliesOnPossession: false,
      when: { optionId: null }, consequence: marker('syn-background-count'),
    }],
    items: [],
    grants: [
      {
        id: 'core-initial-thing', origin: origin('core:thing-router', 'core-initial-thing'), subject: 'character' as const,
        precondition: { kind: 'choice-selected' as const, optionId: 'syn-procedure-core' }, frequency: 'once' as const, source: 'table' as const,
        consequence: pending('conditional-manual', notItem),
      },
      {
        id: 'core-background-education', origin: origin('core:human-background', 'core-background-education'), subject: 'character' as const,
        precondition: { kind: 'always' as const }, frequency: 'once' as const, source: 'table' as const,
        consequence: pending('partial-literacy', notItem),
      },
      {
        id: 'core-background-travel', origin: origin('core:human-background', 'core-background-travel'), subject: 'character' as const,
        precondition: { kind: 'always' as const }, frequency: 'once' as const, source: 'table' as const,
        consequence: pending('conditional-manual', notItem),
      },
      {
        id: 'syn-profession-choice-rights', origin: origin('core:profession-router', 'choice-rights'), subject: 'character' as const,
        precondition: { kind: 'always' as const }, frequency: 'once' as const, source: 'profession' as const,
        consequence: marker('syn-choice-right'),
      },
      {
        id: 'syn-ancestry-extra-language', origin: origin('core:human-background', 'extra-language'), subject: 'character' as const,
        precondition: { kind: 'choice-selected' as const, optionId: 'syn-extra-language' }, frequency: 'once' as const, source: 'profession' as const,
        consequence: pending('conditional-manual', notItem),
      },
      {
        id: 'syn-ancestry-random-profession', origin: origin('core:profession-router', 'random-profession'), subject: 'character' as const,
        precondition: { kind: 'choice-selected' as const, optionId: 'syn-random-profession' }, frequency: 'once' as const, source: 'profession' as const,
        consequence: pending('conditional-manual', notItem),
      },
    ],
    events: [],
    groupedPendings: groupedPendings(),
    manualResolutions: manualResolutions(),
  };

  const lot: HumanL0CoreLot = {
    contract: HUMAN_L0_CONSUMABLE_CONTRACT,
    contractVersion: HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
    distribution: 'public-synthetic',
    fictionalData: true,
    realPack: false,
    reviewStatus: 'needs-review',
    rulesetEnabled: false,
    importablePack: false,
    promotesReview: false,
    orchestratesProcedure: false,
    closesAct1HashCheck: false,
    publishedWeightsIncluded: false,
    act5CatalogProjected: false,
    odditiesProjected: false,
    counts: HUMAN_L0_CORE_LOT_COUNTS,
    document: parseHumanL0Consumable(document),
    unprojectedTables,
    unweightedProfessions,
    groupedProfessions: GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 3).map(member => ({
      id: member.id, count: member.count, weights: null, reason: 'range-starts-not-reextracted' as const,
    })),
    links: links.map(link => ({
      id: link.id, ...linkEnds(link), automaticExecution: false as const,
      projection: UNPROJECTED_TABLES.includes(linkEnds(link).to as typeof UNPROJECTED_TABLES[number]) ? 'pending-range-starts' as const : 'follow-subtable' as const,
    })),
    queries: [
      { id: 'query:profession-faces:core', kind: 'lookup', dice: null, expandedModifiers: false, extraDice: false, rejectsIncompatibleFace: true, publishedThresholds: null },
      { id: 'query:starting-lifestyle:core', kind: 'produced-roll', dice: '3d6', expandedModifiers: false, extraDice: false, rejectsIncompatibleFace: false, publishedThresholds: null },
    ],
    sideRoll: {
      id: 'side-roll:core:human-background:12', phase: 'creation', dice: { count: 1, sides: 6 }, minus: 2, minimum: 0,
      appliesOnPossession: false, applied: false, unconditionalTable: false,
    },
    languages: languages.map(language => ({
      id: language.id,
      selection: language.selection as 'selecionado' | 'selecionado-manual',
      speak: language.selection === 'selecionado' ? 'default' as const : 'pending' as const,
      readWrite: language.selection === 'selecionado' ? 'explicit-only' as const : 'open-category' as const,
      grantedInDocument: false as const,
    })),
    templates: [
      { id: 'core-background-education' as const, speak: false, read: true, write: false as const, grantsProfession: false as const, languageId: null, contract: 'pending:partial-literacy' as const },
      { id: 'core-background-travel' as const, speak: true, read: false, write: false as const, grantsProfession: false as const, languageId: null, contract: 'pending:conditional-manual' as const },
    ],
    choiceRights: { id: 'syn-profession-choice-rights' as const, count: 2 as const, grantsProfession: false as const, contractOp: 'narrative-marker' as const },
    ancestryBenefit: {
      id: 'syn-ancestry-benefit' as const, exclusive: true as const, grantsProfession: false as const, grantsLanguage: false as const,
      options: ['syn-extra-language', 'syn-random-profession'] as const,
    },
    initialThing: { id: 'core-initial-thing' as const, count: 1 as const, additional: false as const, bindsSelectedProcedure: true as const, odditiesProjected: false as const },
    bands,
    thingSummary: {
      outcomes: 120 as const, evidence: 'hash-declarado-nao-refeito' as const, text: null,
      byShape, choices: 26 as const, sideRolls: 10 as const, sideRollDice: null, itemProfiles: 0 as const,
    },
    applicability: { orchestratesProcedure: false as const, forIssue: 35 as const, activations },
    projected: {
      tables: projectedTables, flows: projectedFlows,
      links: links.filter(link => !UNPROJECTED_TABLES.includes(linkEnds(link).to as typeof UNPROJECTED_TABLES[number])).map(link => link.id),
      professions: projectedProfessions,
      queries: ['query:profession-faces:core', 'query:starting-lifestyle:core'],
      sideRoll: side.id,
    },
    pending: {
      tables: pendingTables, flows: pendingFlows,
      links: links.filter(link => UNPROJECTED_TABLES.includes(linkEnds(link).to as typeof UNPROJECTED_TABLES[number])).map(link => link.id),
      professions: [...unweightedProfessions.map(option => option.id), ...groupedRecords.map(option => option.id)],
      things: outcomes.map(outcome => outcome.id),
      languages: languages.map(language => language.id),
      templates: templates.map(template => template.id),
      initialThing: initial.id,
    },
  };
  return parseHumanL0CoreLot(lot);
}

export function coreLotIdentityState(lot: HumanL0CoreLot, record: { id: string }): 'projected' | 'pending' {
  const pending = new Set([
    ...lot.pending.tables, ...lot.pending.flows, ...lot.pending.links, ...lot.pending.professions,
    ...lot.pending.things, ...lot.pending.languages, ...lot.pending.templates, lot.pending.initialThing,
  ]);
  const projected = new Set([
    ...lot.projected.tables, ...lot.projected.flows, ...lot.projected.links, ...lot.projected.professions,
    ...lot.projected.queries, lot.projected.sideRoll,
  ]);
  if (pending.has(record.id) && projected.has(record.id)) fail('identity-overlap', record.id);
  if (pending.has(record.id)) return 'pending';
  if (projected.has(record.id)) return 'projected';
  fail('identity-missing', record.id);
}

function sameBands(left: Band[], right: Band[]) {
  return left.length === right.length && left.every((band, index) => band.min === right[index].min && band.max === right[index].max);
}

function walkEffects(document: HumanL0CoreLot['document'], visit: (effectValue: Extract<Consequence, { kind: 'effect' }>['effect'], pointer: string) => void) {
  const one = (consequence: Consequence, pointer: string) => {
    if (consequence.kind === 'effect') visit(consequence.effect, pointer);
  };
  document.tables.forEach((table, tableIndex) => table.columns.forEach((columnValue, columnIndex) => columnValue.rows.forEach((row, rowIndex) => one(row.consequence, `/tables/${tableIndex}/columns/${columnIndex}/rows/${rowIndex}`))));
  document.lookups.forEach((lookup, index) => lookup.keys.forEach((key, keyIndex) => one(key.consequence, `/lookups/${index}/keys/${keyIndex}`)));
  document.sideRolls.forEach((roll, index) => one(roll.consequence, `/sideRolls/${index}`));
  document.grants.forEach((grant, index) => one(grant.consequence, `/grants/${index}`));
}

/** Validates the Core lot envelope and the rules the consumable gate does not know about. */
export function parseHumanL0CoreLot(input: unknown): HumanL0CoreLot {
  const parsed = HumanL0CoreLotSchema.safeParse(input);
  if (!parsed.success) fail('schema-invalid', parsed.error.issues[0]?.path.join('/') || '/');
  const lot = parsed.data;
  const document = parseHumanL0Consumable(lot.document);
  if (document.items.length !== 0) fail('items-invented', '/document/items');
  if (document.sideRolls.length !== 1 || document.sideRolls[0].appliesOnPossession || document.sideRolls[0].phase !== 'creation') fail('side-roll-shape', '/sideRoll');
  if (document.sideRolls[0].dice.count !== lot.sideRoll.dice.count || document.sideRolls[0].dice.sides !== lot.sideRoll.dice.sides) fail('side-roll-shape', '/sideRoll');
  if (lot.sideRoll.applied || lot.sideRoll.minus !== 2 || lot.sideRoll.minimum !== 0) fail('side-roll-shape', '/sideRoll');
  const serialized = JSON.stringify(document);
  if (INVENTED_GROUPED_FACE.test(serialized)) fail('invented-grouped-face', '/document');
  for (const table of lot.unprojectedTables) {
    if (table.weights !== null || document.tables.some(item => item.id === table.id)) fail('range-starts-not-reextracted', table.id);
  }
  for (const option of lot.unweightedProfessions) {
    if (option.weights !== null || option.rangeMax !== null) fail('range-starts-not-reextracted', option.id);
  }
  if (lot.groupedProfessions.some(group => group.weights !== null) || document.groupedPendings.some(group => group.weights !== null)) {
    fail('unextracted-range-has-weights', '/groupedProfessions');
  }
  walkEffects(document, (effectValue, pointer) => {
    if (effectValue.op === 'grant-language' || effectValue.op === 'grant-item' || effectValue.op === 'grant-currency' || effectValue.op === 'substitute-defense' || effectValue.op === 'record-price') {
      fail(effectValue.op === 'grant-language' ? 'speech-literacy-collapsed' : 'items-invented', pointer);
    }
  });
  const education = document.grants.find(grant => grant.id === 'core-background-education');
  const travel = document.grants.find(grant => grant.id === 'core-background-travel');
  const rights = document.grants.find(grant => grant.id === 'syn-profession-choice-rights');
  const ancestryLanguage = document.grants.find(grant => grant.id === 'syn-ancestry-extra-language');
  const ancestryProfession = document.grants.find(grant => grant.id === 'syn-ancestry-random-profession');
  if (education?.consequence.kind !== 'pending' || education.consequence.pending.reason !== 'partial-literacy') fail('speech-literacy-collapsed', '/templates/education');
  if (travel?.consequence.kind !== 'pending' || lot.templates.find(template => template.id === 'core-background-travel')?.write !== false) fail('speech-literacy-collapsed', '/templates/travel');
  if (lot.templates.some(template => template.grantsProfession || template.write)) fail('speech-literacy-collapsed', '/templates');
  if (rights?.consequence.kind !== 'effect' || rights.consequence.effect.op !== 'narrative-marker' || lot.choiceRights.grantsProfession) fail('choice-right-grants-profession', '/choiceRights');
  if (ancestryProfession?.consequence.kind === 'effect' || ancestryLanguage?.consequence.kind === 'effect') fail('choice-right-grants-profession', '/ancestryBenefit');
  if (lot.languages.some(language => language.grantedInDocument)) fail('speech-literacy-collapsed', '/languages');
  for (const band of lot.bands) {
    const expected = band.weightSource === 'entailed-singleton' ? singletonBands(band.dice.sides) : syntheticEvenBands(band.dice, band.ranges.length);
    if (band.weightSource === 'synthetic-even-split' && band.dice.count === 1) fail('synthetic-band-mismatch', band.id);
    if (!sameBands(band.ranges, expected)) fail('synthetic-band-mismatch', band.id);
    const [tableId, columnId] = [band.id.slice(0, band.id.lastIndexOf('#')), band.id.slice(band.id.lastIndexOf('#') + 1)];
    const columnValue = document.tables.find(table => table.id === tableId)?.columns.find(item => item.id === columnId);
    if (!columnValue || !sameBands(columnValue.rows.map(row => ({ min: row.min ?? -1, max: row.max ?? -1 })), band.ranges)) fail('synthetic-band-mismatch', band.id);
    const expectedWeights = weightsFor(band.dice, band.ranges);
    columnValue.rows.forEach((row, index) => {
      if (row.publishedWeight.ways !== expectedWeights[index].ways || row.publishedWeight.denominator !== expectedWeights[index].denominator || row.publishedWeight.basis !== 'natural-dice-faces') {
        fail('weight-mismatch', `${band.id}/${row.id}`);
      }
    });
  }
  const thingIds = new Set(lot.pending.things);
  for (const table of document.tables.filter(item => /^core:thing-[1-6]$/.test(item.id))) {
    for (const row of table.columns[0].rows) {
      if (!thingIds.has(row.id) || row.consequence.kind !== 'pending' || row.consequence.pending.reason !== 'manual-procedure') fail('interesting-text-invented', row.id);
    }
  }
  if (lot.thingSummary.text !== null || lot.thingSummary.sideRollDice !== null || lot.thingSummary.itemProfiles !== 0) fail('interesting-text-invented', '/thingSummary');
  if (lot.links.some(link => link.automaticExecution)) fail('procedure-orchestrated', '/links');
  const professionRows = document.tables.flatMap(table => table.columns.flatMap(columnValue => columnValue.rows))
    .filter(row => row.consequence.kind === 'effect' && row.consequence.effect.op === 'grant-profession');
  const granted = professionRows.map(row => row.id);
  if (granted.join() !== lot.projected.professions.join()) fail('invented-grouped-face', '/professions');
  for (const row of professionRows) {
    const consequence = row.consequence;
    if (consequence.kind === 'effect' && consequence.effect.op === 'grant-profession' && consequence.effect.professionId !== row.id)
      fail('profession-target-mismatch', `/professions/${row.id}`);
  }
  const states = new Set([...lot.projected.tables, ...lot.projected.flows, ...lot.projected.links, ...lot.projected.professions, ...lot.projected.queries, lot.projected.sideRoll,
    ...lot.pending.tables, ...lot.pending.flows, ...lot.pending.links, ...lot.pending.professions, ...lot.pending.things, ...lot.pending.languages, ...lot.pending.templates, lot.pending.initialThing]);
  if (states.size !== HUMAN_L0_CORE_LOT_COUNTS.matrixRows) fail('identity-missing', '/identities');
  if (lot.projected.tables.length + lot.projected.flows.length + lot.projected.links.length + lot.projected.professions.length + lot.projected.queries.length + 1 !== HUMAN_L0_CORE_LOT_COUNTS.projectedIdentities) {
    fail('matrix-count-mismatch', '/projected');
  }
  if (lot.applicability.orchestratesProcedure || lot.orchestratesProcedure) fail('procedure-orchestrated', '/applicability');
  if (lot.closesAct1HashCheck || document.blockers[0].blocksSyntheticFixtures || document.blockers[0].id !== 'act1-local-hash-check') fail('hash-check-closed', '/blockers/0');
  if (document.rulesetEnabled || document.reviewStatus === 'curated' || document.promotesReview || !document.fictionalData) fail('review-promotion-forbidden', '/reviewStatus');
  return { ...lot, document };
}

export function coreLotCoverage(lot: HumanL0CoreLot) {
  const coverage = { ...lot, document: undefined };
  delete coverage.document;
  return coverage;
}
