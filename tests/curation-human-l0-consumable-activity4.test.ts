import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack } from '../packages/catalog';
import { HUMAN_L0_CONTRACT, HUMAN_L0_CONTRACT_VERSION, parseHumanL0MechanicalPacks } from '../packages/curation/human-l0-mechanics';
import { buildHumanL0Activity4Lot, composeFaceWeight } from '../packages/curation/human-l0-activity4-lot';
import {
  ACTIVITY4_ACT5_LOOKUPS, ACTIVITY4_DEFERRED_TABLES, ACTIVITY4_LIFESTYLE_QUERY, ACTIVITY4_LOT_COUNTS,
  ACTIVITY4_MANUAL_IDS, ACTIVITY4_ODDITY_SIDE_TOPOLOGY, HUMAN_L0_CONSUMABLE_CONTRACT, HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
  HumanL0ConsumableError, PUBLISHED_CYCLE_IDS, parseHumanL0Consumable, reviewHumanL0ConsumableCycle,
  reviewHumanL0InterestingThingsSource,
} from '../packages/curation/human-l0-consumable';
import { explicitRanges } from '../tools/curation/pilot-table-ranges';
import { odditiesTables } from '../tools/curation/interesting-things-map';
import { details } from '../tools/curation/interesting-things-details';
import { resolveStartingLifestyle } from '../packages/curation/starting-equipment-model';
import { hasBuyerData } from '../tools/curation/privacy.mjs';

const matrix = JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json', 'utf8'));
const fixturePath = 'curation/examples/human-l0-consumable.activity4.synthetic.json';
const document = JSON.parse(readFileSync(fixturePath, 'utf8'));
const rejections = JSON.parse(readFileSync('curation/examples/human-l0-consumable.activity4.rejections.json', 'utf8'));
const mechanics = JSON.parse(readFileSync('curation/examples/human-l0-mechanics.synthetic.json', 'utf8'));
const coreStub = JSON.parse(readFileSync('content-packs/sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json', 'utf8'));
const built = buildHumanL0Activity4Lot(matrix);
const fresh = () => structuredClone(document);

function rejects(input: unknown, code: string) {
  let error: unknown;
  try { parseHumanL0Consumable(input); } catch (caught) { error = caught; }
  expect(error).toBeInstanceOf(HumanL0ConsumableError);
  expect((error as HumanL0ConsumableError).code).toBe(code);
}

function apply(base: Record<string, unknown>, testCase: { collection?: string; itemId?: string; sets: { path: string; value: unknown }[] }) {
  const root = structuredClone(base);
  const target = testCase.collection
    ? (root[testCase.collection] as { id?: string }[]).find(item => item.id === testCase.itemId)
    : root;
  if (!target) throw new Error(`Missing ${testCase.collection}/${testCase.itemId}`);
  for (const set of testCase.sets) {
    const parts = set.path.split('/').filter(Boolean);
    let cursor = target as Record<string, unknown>;
    for (const part of parts.slice(0, -1)) cursor = cursor[part] as Record<string, unknown>;
    cursor[parts.at(-1) ?? ''] = set.value;
  }
  return root;
}

type MatrixRow = { id: string; kind: string; disposition: string; selection: string; evidence: string; capabilities: string[] };
const lotRows = (matrix.records as MatrixRow[]).filter(row => row.disposition === 'lote-only-human' || row.disposition === 'lote-oddities');

describe('Human L0 activity 4 lot on consumable 1.0.0', () => {
  it('matches the builder and stays on the public synthetic contract', () => {
    expect(built).toEqual(document);
    const parsed = parseHumanL0Consumable(fresh());
    expect(parsed.contract).toBe(HUMAN_L0_CONSUMABLE_CONTRACT);
    expect(parsed.contractVersion).toBe(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION);
    expect(parsed.activityLot).toBe(4);
    expect(parsed.fictionalData).toBe(true);
    expect(parsed.reviewStatus).toBe('needs-review');
    expect(parsed.rulesetEnabled).toBe(false);
    expect(parsed.importablePack).toBe(false);
    expect(parsed.promotesReview).toBe(false);
    expect(parsed.unprojectedPublishedCycles.map(cycle => [cycle.id, cycle.projected])).toEqual(PUBLISHED_CYCLE_IDS.map(id => [id, true]));
    expect(parsed.tables.filter(table => (PUBLISHED_CYCLE_IDS as readonly string[]).includes(table.id)).every(table => table.publishedCycle)).toBe(true);
    expect(parsed.lookups).toEqual([]);
    expect(parsed.activity4?.counts).toMatchObject(ACTIVITY4_LOT_COUNTS);
  });

  it('cross-checks 506 ids, 34/13 tables, 8 manuals and 7+13 side rolls against the matrix', () => {
    expect(lotRows).toHaveLength(ACTIVITY4_LOT_COUNTS.ids);
    expect(lotRows.filter(row => row.disposition === 'lote-only-human')).toHaveLength(227);
    expect(lotRows.filter(row => row.disposition === 'lote-oddities')).toHaveLength(279);
    const tables = (kind: string, disposition: string) => lotRows.filter(row => row.kind === kind && row.disposition === disposition);
    expect(tables('table', 'lote-only-human')).toHaveLength(34);
    expect(tables('table', 'lote-oddities')).toHaveLength(13);
    expect(tables('flow', 'lote-only-human')).toHaveLength(34);
    expect(tables('flow', 'lote-oddities')).toHaveLength(13);
    const manuals = lotRows.filter(row => row.selection === 'selecionado-manual');
    expect(manuals.map(row => row.id)).toEqual([...ACTIVITY4_MANUAL_IDS]);
    expect(tables('side-roll', 'lote-only-human')).toHaveLength(7);
    const oddSides = lotRows.filter(row => row.kind === 'interesting-outcome').flatMap(row => row.capabilities.filter(item => item.startsWith('side:')));
    expect(oddSides).toHaveLength(13);
    expect(tables('link', 'lote-only-human').length + tables('link', 'lote-oddities').length).toBe(61);
    expect(tables('profession-option', 'lote-only-human')).toHaveLength(67);
    const hash = lotRows.filter(row => row.evidence === 'hash-declarado-nao-refeito');
    expect(hash).toHaveLength(130);
    const text = JSON.stringify(document);
    for (const row of hash) {
      if (row.id === 'oddities:books:20') continue;
      if (row.kind === 'interesting-outcome' || row.kind === 'flow') expect(text.includes(`"${row.id}"`)).toBe(false);
    }
    expect(text.includes('"oddities:books:20"')).toBe(true);
    expect(document.activity4.hashLines).toEqual({ count: 130, materialized: 0, weights: null, reason: 'declared-hash-not-recomputed' });
    expect(document.activity4.deferredTables.map((row: { id: string }) => row.id)).toEqual([...ACTIVITY4_DEFERRED_TABLES]);
    expect(document.activity4.links.every((link: { automaticExecution: boolean }) => link.automaticExecution === false)).toBe(true);
    expect(document.manualResolutions.filter((row: { matrixId: string }) => (ACTIVITY4_MANUAL_IDS as readonly string[]).includes(row.matrixId))
      .every((row: { consequence: { kind: string } }) => row.consequence.kind === 'pending')).toBe(true);
  });

  it('keeps natural 3d6 weights, open tails, and lifestyle modifiers outside the weight', () => {
    const parsed = parseHumanL0Consumable(fresh());
    const lifestyle = parsed.tables.find(table => table.id === 'only-human:lifestyle');
    expect(lifestyle?.columns[0].rows.map(row => [row.tail, row.min, row.max, row.publishedWeight.ways, row.publishedWeight.denominator])).toEqual([
      ['open-low', null, 3, '1', '216'],
      ['none', 4, 5, '9', '216'],
      ['none', 6, 12, '150', '216'],
      ['none', 13, 15, '46', '216'],
      ['none', 16, 17, '9', '216'],
      ['open-high', 18, null, '1', '216'],
    ]);
    expect(lifestyle?.columns[0].modifierDomain).toMatchObject({ kind: 'authorized-rules' });
    const age = parsed.tables.find(table => table.id === 'only-human:age');
    expect(age?.columns[0].rows.map(row => [row.min, row.max])).toEqual(explicitRanges('only-human:age'));
    expect(explicitRanges('only-human:childhood')).toEqual(parsed.tables.find(table => table.id === 'only-human:childhood')?.columns[0].rows.map(row => [row.min, row.max]));
    const resolved = resolveStartingLifestyle({
      procedure: 'only-human', faces: [6, 6, 6],
      events: [{ id: 'fixture-event', tableId: 'only-human:major-windfall', result: 4 }],
    });
    expect(resolved).toMatchObject({ rawTotal: 18, total: 21, lifestyle: 'rich' });
    expect(lifestyle?.columns[0].rows.at(-1)?.publishedWeight.ways).toBe('1');
  });

  it('composes the d6 to d20 selector and the unequal d20 router without a uniform row weight', () => {
    const parsed = parseHumanL0Consumable(fresh());
    const router = parsed.tables.find(table => table.id === 'only-human:profession-router');
    const religious = parsed.tables.find(table => table.id === 'only-human:religious');
    const common = parsed.tables.find(table => table.id === 'only-human:common');
    expect(composeFaceWeight('1', '6', religious!.columns[0].rows[0].publishedWeight.ways, religious!.columns[0].rows[0].publishedWeight.denominator)).toEqual({ ways: '1', denominator: '36' });
    expect(composeFaceWeight('1', '6', common!.columns[0].rows[0].publishedWeight.ways, common!.columns[0].rows[0].publishedWeight.denominator)).toEqual({ ways: '1', denominator: '120' });
    expect(router?.columns[0].rows.map(row => row.consequence.kind === 'effect' && row.consequence.effect.op === 'follow-subtable' && row.consequence.effect.tableId)).toEqual([
      'only-human:scholarship', 'only-human:common', 'only-human:criminal', 'only-human:military', 'only-human:religious', 'only-human:wilderness',
    ]);
    const things = parsed.tables.find(table => table.id === 'oddities:thing-router');
    expect(things?.columns[0].rows.map(row => [row.min, row.max, row.publishedWeight.ways])).toEqual(odditiesTables.map(table => [table.ranges[0], table.ranges[1], String(table.ranges[1] - table.ranges[0] + 1)]));
    const art = things!.columns[0].rows[0];
    const single = things!.columns[0].rows.find(row => row.publishedWeight.ways === '1');
    expect(composeFaceWeight(art.publishedWeight.ways, art.publishedWeight.denominator, '1', '20').denominator).toBe('400');
    expect(single && art.publishedWeight.ways !== single.publishedWeight.ways).toBe(true);
    expect(parsed.activity4?.queries.professionFaces.uniform).toBe(false);
    expect(parsed.activity4?.queries.familyCategory.dice).toBeNull();
  });

  it('stops a two-table cycle at the bound and does not reroll or discard', () => {
    const parsed = parseHumanL0Consumable(fresh());
    expect(reviewHumanL0ConsumableCycle(parsed, { tableId: 'only-human:siblings', rowId: 'only-human:siblings:1-4' })).toMatchObject({
      resolved: false, pending: { reason: 'bounded-recursion', retainsConsequence: true }, steps: 4, rerolled: false, discarded: false,
    });
    expect(reviewHumanL0ConsumableCycle(parsed, { tableId: 'only-human:piety', rowId: 'only-human:piety:3-3' }, 2).pending?.reason).toBe('bounded-recursion');
    const stopped = reviewHumanL0ConsumableCycle(parsed, { tableId: 'only-human:age', rowId: 'only-human:age:3-3' });
    expect(stopped).toMatchObject({ resolved: true, pending: null, rerolled: false, discarded: false });
  });

  it('keeps a disabled Interesting Things source pending and does not fall back to the other procedure', () => {
    const parsed = parseHumanL0Consumable(fresh());
    expect(reviewHumanL0InterestingThingsSource(parsed, { variant: 'oddities', activeSourceIds: [] })).toMatchObject({ outcome: null, fallback: null, pending: { reason: 'disabled-source' } });
    expect(reviewHumanL0InterestingThingsSource(parsed, { variant: 'core', activeSourceIds: [] })).toMatchObject({ outcome: null, fallback: null, pending: { reason: 'disabled-source' } });
    expect(reviewHumanL0InterestingThingsSource(parsed, { variant: 'core', activeSourceIds: ['sotdl:shadow-of-the-demon-lord-core'] })).toMatchObject({ outcome: null, fallback: null, pending: { reason: 'unprojected-alternative' } });
    expect(reviewHumanL0InterestingThingsSource(parsed, { variant: 'oddities', activeSourceIds: ['sotdl:oddities-artifacts-and-esoterica'] })).toEqual({
      variant: 'oddities', outcome: { routerId: 'oddities:thing-router' }, fallback: null, pending: null,
    });
    expect(parsed.activity4?.ancestryProcedures.map(procedure => [procedure.id, procedure.projected, procedure.activity])).toEqual([
      ['human-development', true, 4], ['core-alternative', false, 3],
    ]);
  });

  it('points equipment lookups and profession programs at activity 5 without a body', () => {
    const parsed = parseHumanL0Consumable(fresh());
    const slots = parsed.activity4!.act5Slots;
    expect(slots.filter(slot => slot.kind === 'lifestyle-lookup').map(slot => slot.id)).toEqual([...ACTIVITY4_ACT5_LOOKUPS]);
    expect(slots.filter(slot => slot.kind === 'kit-program').map(slot => [slot.id, slot.readsQueryId, slot.body])).toEqual([
      'destitute', 'poor', 'getting-by', 'comfortable', 'wealthy', 'rich',
    ].map(name => [`only-human:kit:${name}`, ACTIVITY4_LIFESTYLE_QUERY, null]));
    const programs = slots.filter(slot => slot.kind === 'profession-program');
    expect(programs).toHaveLength(66);
    expect(programs.every(slot => slot.body === null && slot.familyGrantsGear === false && slot.readsQueryId === null)).toBe(true);
    expect(parsed.activity4?.professionOptions.every(option => option.familyGrantsGear === false)).toBe(true);
    expect(parsed.activity4?.professionOptions.find(option => option.id === 'pilot-profession:only-human:direct:occult')).toMatchObject({ programId: null, inRandomPool: false });
    expect(parsed.activity4?.textReference).toMatchObject({
      id: 'oddities:books:20', kind: 'text-reference', hook: { id: 'dark-passages-books-and-passages', enabled: false },
      consequence: { kind: 'pending', pending: { reason: 'text-reference', retainsConsequence: true } },
    });
    const relative = parsed.sideRolls.find(roll => roll.id === 'side-roll:only-human:siblings:9-12');
    expect(relative).toMatchObject({ subject: 'relative', appliesOnPossession: false, modifier: 1, dice: { count: 1, sides: 3 } });
    expect(parsed.sideRolls.filter(roll => roll.id.startsWith('fixture:oddity-side:')).every(roll => roll.when.optionId === null && !roll.id.startsWith('oddities:'))).toBe(true);
  });

  it('uses the published Oddities side-roll topology without copying face ids or prose', () => {
    const rolls = ['art', 'books', 'clothing', 'consumables', 'ingredients', 'minor-magic', 'people', 'personal', 'pets', 'qualities', 'tools', 'weird']
      .flatMap(table => Array.from({ length: 20 }, (_, index) => details(`oddities:${table}:${index + 1}`).sideRolls))
      .flat()
      .map(roll => ({ phase: roll.phase, count: roll.count, sides: roll.sides, modifier: roll.modifier }))
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    const synthetic = [...ACTIVITY4_ODDITY_SIDE_TOPOLOGY].map(roll => ({ ...roll })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    expect(rolls).toEqual(synthetic);
    const text = JSON.stringify(document);
    expect(text.includes('Curious odor')).toBe(false);
    expect(text.includes('You start')).toBe(false);
    expect(hasBuyerData(text)).toBe(false);
  });

  it('leaves the mechanical contract, the real ancestry stub, and act 1 closure unchanged', () => {
    const mechanical = parseHumanL0MechanicalPacks(structuredClone(mechanics.packs));
    expect(mechanical.map(pack => pack.entities[0].mechanics.contractVersion)).toEqual([HUMAN_L0_CONTRACT_VERSION, HUMAN_L0_CONTRACT_VERSION]);
    expect(HUMAN_L0_CONTRACT).toBe('sotdl.human-l0.mechanics');
    const stub = parsePack(coreStub);
    expect(stub.fictionalData).toBe(false);
    expect(stub.entities[0].status).toBe('needs-review');
    expect(document.blockers[0]).toMatchObject({ id: 'act1-local-hash-check', blocksSyntheticFixtures: false, count: 258 });
    expect(document.matrix.closure).toBe('pending-act1-local-hash-check');
  });

  for (const testCase of rejections.cases as { id: string; code: string; collection?: string; itemId?: string; sets: { path: string; value: unknown }[] }[]) {
    it(`rejects ${testCase.id}`, () => { rejects(apply(document, testCase), testCase.code); });
  }

  it('rejects projecting the published cycles without the activity 4 lot', () => {
    const next = fresh();
    delete next.activityLot;
    delete next.activity4;
    rejects(next, 'cycle-projected-without-lot');
  });
});
