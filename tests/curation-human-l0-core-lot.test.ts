import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack } from '../packages/catalog';
import {
  HUMAN_L0_CORE_LOT_COUNTS, HumanL0CoreLotError, buildHumanL0CoreLot, classifyProfessionFaces, coreLotCoverage,
  coreLotIdentityState, enumerateDice, parseHumanL0CoreLot, syntheticEvenBands,
} from '../packages/curation/human-l0-core-lot';
import { HASH_CHECK_BLOCKER, HumanL0ConsumableError, parseHumanL0Consumable } from '../packages/curation/human-l0-consumable';
import { resolveStartingLifestyle } from '../packages/curation/starting-equipment-model';
import { explicitRanges } from '../tools/curation/pilot-table-ranges';
import { hasBuyerData } from '../tools/curation/privacy.mjs';

const matrix = JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json', 'utf8'));
const fixture = JSON.parse(readFileSync('curation/examples/human-l0-core-lot.synthetic.json', 'utf8'));
const coverage = JSON.parse(readFileSync('curation/examples/human-l0-core-lot.coverage.json', 'utf8'));
const coreStub = JSON.parse(readFileSync('content-packs/sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json', 'utf8'));
const lot = buildHumanL0CoreLot(matrix);
const coreRecords = matrix.records.filter((record: { disposition: string }) => record.disposition === 'lote-core');

function facesFor(total: number): [number, number, number] {
  const first = Math.max(1, Math.min(6, total - 2));
  const second = Math.max(1, Math.min(6, total - first - 1));
  return [first, second, total - first - second];
}

function publishedWealthBands() {
  const bands: { min: number; max: number; lifestyle: string }[] = [];
  for (let total = 3; total <= 18; total++) {
    const lifestyle = resolveStartingLifestyle({ procedure: 'core', faces: facesFor(total), events: [] }).lifestyle;
    const last = bands.at(-1);
    if (last?.lifestyle === lifestyle) last.max = total;
    else bands.push({ min: total, max: total, lifestyle });
  }
  return bands.map(band => [band.min, band.max]);
}

function waysOf(dice: { count: number; sides: number }, min: number, max: number) {
  let ways = 0n;
  for (const [total, count] of enumerateDice(dice)) if (total >= min && total <= max) ways += count;
  return ways.toString();
}

describe('Human L0 Core lot synthetic projection', () => {
  it('matches the committed fixture and stays on consumable 1.0.0', () => {
    expect(lot.contractVersion).toBe('1.0.0');
    expect(lot.realPack).toBe(false);
    expect(lot.distribution).toBe('public-synthetic');
    expect(lot.fictionalData).toBe(true);
    expect(lot.rulesetEnabled).toBe(false);
    expect(lot.orchestratesProcedure).toBe(false);
    expect(lot.closesAct1HashCheck).toBe(false);
    expect(lot.publishedWeightsIncluded).toBe(false);
    expect(fixture).toEqual(lot.document);
    expect(coverage).toEqual(coreLotCoverage(lot));
    expect(parseHumanL0Consumable(fixture).contractVersion).toBe('1.0.0');
    expect(hasBuyerData(JSON.stringify(fixture))).toBe(false);
    expect(hasBuyerData(JSON.stringify(coverage))).toBe(false);
    expect(JSON.stringify(fixture)).not.toMatch(/\s/);
    const stub = parsePack(coreStub);
    expect(stub.fictionalData).toBe(false);
    expect(stub.entities[0].status).toBe('needs-review');
  });

  it('accounts for every Core matrix identity as projected or pending', () => {
    expect(coreRecords).toHaveLength(HUMAN_L0_CORE_LOT_COUNTS.matrixRows);
    expect(coreRecords.reduce((sum: number, record: { represents: number }) => sum + record.represents, 0)).toBe(293);
    const states = coreRecords.map((record: { id: string }) => coreLotIdentityState(lot, record));
    expect(states.filter((state: string) => state === 'projected')).toHaveLength(111);
    expect(states.filter((state: string) => state === 'pending')).toHaveLength(149);
    expect(lot.document.tables).toHaveLength(19);
    expect(lot.unprojectedTables.map(table => table.id)).toEqual([
      'core:profession-martial', 'core:profession-religious', 'core:profession-wilderness',
    ]);
    expect(lot.links).toHaveLength(12);
    expect(lot.links.every(link => link.automaticExecution === false)).toBe(true);
    expect(lot.languages.filter(language => language.selection === 'selecionado-manual').map(language => language.id)).toEqual([
      'language:dead-languages', 'language:secret-language',
    ]);
  });

  it('reproduces natural face weights and keeps published bands out of the fixture', () => {
    for (const table of lot.document.tables) {
      for (const column of table.columns) {
        const denominator = (BigInt(column.dice.sides) ** BigInt(column.dice.count)).toString();
        let sum = 0n;
        for (const row of column.rows) {
          expect(row.publishedWeight.basis).toBe('natural-dice-faces');
          expect(row.publishedWeight.denominator).toBe(denominator);
          expect(row.publishedWeight.ways).toBe(waysOf(column.dice, row.min ?? 0, row.max ?? 0));
          expect(row.tail).toBe('none');
          sum += BigInt(row.publishedWeight.ways);
        }
        expect(sum.toString()).toBe(denominator);
        expect(new Set(table.columns.map(item => item.rollId)).size).toBe(table.columns.length);
      }
    }
    const age = lot.bands.find(band => band.id === 'core:human-age#main');
    expect(age?.weightSource).toBe('synthetic-even-split');
    expect(age?.ranges.map(range => [range.min, range.max])).not.toEqual(explicitRanges('core:human-age'));
    expect(lot.bands.find(band => band.id === 'core:human-appearance#main')?.ranges.map(range => [range.min, range.max]))
      .not.toEqual(explicitRanges('core:human-appearance'));
    expect(lot.bands.find(band => band.id === 'core:wealth#main')?.ranges.map(range => [range.min, range.max])).not.toEqual(publishedWealthBands());
    expect(lot.queries.find(query => query.id === 'query:starting-lifestyle:core')).toMatchObject({
      dice: '3d6', expandedModifiers: false, extraDice: false, publishedThresholds: null,
    });
    const wealth = lot.document.tables.find(table => table.id === 'core:wealth');
    expect(wealth?.columns[0].rows.every(row => row.consequence.kind === 'effect' && row.consequence.effect.op === 'narrative-marker' && row.consequence.effect.mutatesMechanics === false)).toBe(true);
  });

  it('keeps grouped profession faces pending and does not invent rNN weights', () => {
    expect(lot.groupedProfessions).toEqual([
      { id: 'pilot-profession:core:martial:*', count: 12, weights: null, reason: 'range-starts-not-reextracted' },
      { id: 'pilot-profession:core:religious:*', count: 7, weights: null, reason: 'range-starts-not-reextracted' },
      { id: 'pilot-profession:core:wilderness:*', count: 17, weights: null, reason: 'range-starts-not-reextracted' },
    ]);
    expect(lot.projected.professions).toHaveLength(60);
    expect(lot.unweightedProfessions.map(option => option.id)).toEqual([
      'pilot-profession:core:martial:r03', 'pilot-profession:core:martial:r13',
      'pilot-profession:core:religious:r01', 'pilot-profession:core:religious:r03',
      'pilot-profession:core:religious:r09', 'pilot-profession:core:religious:r11',
    ]);
    expect(lot.unweightedProfessions.every(option => option.weights === null && option.rangeMax === null)).toBe(true);
    expect(JSON.stringify(lot.document)).not.toMatch(/pilot-profession:core:(?:martial|religious|wilderness):r\d+/);
    expect(lot.document.tables.some(table => table.id === 'core:profession-wilderness')).toBe(false);
    expect(classifyProfessionFaces(1, 1)).toEqual({ status: 'grant', category: 'academic', optionId: 'pilot-profession:core:academic:r01' });
    expect(classifyProfessionFaces(4, 3)).toEqual({ status: 'pending', reason: 'range-starts-not-reextracted', category: 'martial' });
    expect(classifyProfessionFaces(6, 1).status).toBe('pending');
    expect(classifyProfessionFaces(1, 21)).toEqual({ status: 'rejected', reason: 'incompatible-face' });
    expect(classifyProfessionFaces(7, 1)).toEqual({ status: 'rejected', reason: 'incompatible-face' });
    const academic = lot.document.tables.find(table => table.id === 'core:profession-academic');
    expect(academic?.columns[0].rows.every(row => row.publishedWeight.ways === '1' && row.consequence.kind === 'effect' && row.consequence.effect.op === 'grant-profession')).toBe(true);
  });

  it('separates numeric, conditional, and narrative results, speech from literacy, and choice from grant', () => {
    const build = lot.document.tables.find(table => table.id === 'core:human-build');
    const age = lot.document.tables.find(table => table.id === 'core:human-age');
    const traits = lot.document.tables.find(table => table.id === 'core:role-traits');
    expect(build?.columns[0].rows.every(row => row.consequence.kind === 'pending' && row.consequence.pending.reason === 'manual-composition')).toBe(true);
    expect(age?.columns[0].rows.every(row => row.consequence.kind === 'effect' && row.consequence.effect.op === 'narrative-marker')).toBe(true);
    expect(traits?.columns.map(column => column.rollId)).toEqual(['core:role-traits#negative', 'core:role-traits#positive']);
    expect(new Set(traits?.columns.map(column => column.rollId)).size).toBe(2);
    const side = lot.document.sideRolls[0];
    expect(side).toMatchObject({
      id: 'side-roll:core:human-background:12', phase: 'creation', appliesOnPossession: false,
      dice: { count: 1, sides: 6 }, subject: 'character',
    });
    expect(lot.sideRoll).toMatchObject({ minus: 2, minimum: 0, applied: false, appliesOnPossession: false });
    expect(side.consequence.kind === 'effect' && side.consequence.effect.op === 'narrative-marker' && side.consequence.effect.mutatesMechanics).toBe(false);
    const education = lot.document.grants.find(grant => grant.id === 'core-background-education');
    const travel = lot.templates.find(template => template.id === 'core-background-travel');
    expect(education?.consequence.kind === 'pending' && education.consequence.pending.reason).toBe('partial-literacy');
    expect(travel).toMatchObject({ speak: true, read: false, write: false, grantsProfession: false, languageId: null });
    expect(lot.choiceRights).toMatchObject({ count: 2, grantsProfession: false, contractOp: 'narrative-marker' });
    expect(lot.document.grants.find(grant => grant.id === 'syn-ancestry-random-profession')?.consequence.kind).toBe('pending');
    expect(JSON.stringify(lot.document)).not.toContain('grant-language');
    expect(lot.document.items).toEqual([]);
    expect(lot.thingSummary).toMatchObject({ outcomes: 120, evidence: 'hash-declarado-nao-refeito', text: null, sideRolls: 10, sideRollDice: null, choices: 26 });
    expect(lot.document.sideRolls).toHaveLength(1);
    expect(lot.applicability.orchestratesProcedure).toBe(false);
    expect(lot.document.blockers[0]).toMatchObject(HASH_CHECK_BLOCKER);
  });

  it('rejects invalid Core shapes', () => {
    const uniform = structuredClone(lot.document);
    uniform.tables[0].columns[0].rows[0].publishedWeight.basis = 'uniform-per-row';
    expect(() => parseHumanL0Consumable(uniform)).toThrow(HumanL0ConsumableError);
    try { parseHumanL0Consumable(uniform); } catch (error) { expect((error as HumanL0ConsumableError).code).toBe('uniform-row-weight'); }

    const weightedGroup = structuredClone(lot.document);
    weightedGroup.groupedPendings[0].weights = { ways: '1' };
    expect(() => parseHumanL0Consumable(weightedGroup)).toThrow(/unextracted-range-has-weights/);

    const possession = structuredClone(lot.document);
    possession.sideRolls[0].appliesOnPossession = true;
    expect(() => parseHumanL0Consumable(possession)).toThrow(/side-roll-on-possession/);

    const shared = structuredClone(lot.document);
    const traits = shared.tables.find(table => table.id === 'core:role-traits');
    if (!traits) throw new Error('missing role traits');
    traits.columns[1].rollId = traits.columns[0].rollId;
    expect(() => parseHumanL0Consumable(shared)).toThrow(/shared-column-roll/);

    const collapsed = structuredClone(lot);
    const education = collapsed.document.grants.find(grant => grant.id === 'core-background-education');
    if (!education) throw new Error('missing education grant');
    education.consequence = { kind: 'effect', pending: null, effect: { op: 'grant-language', languageId: 'language:common-tongue', abilities: 'read-write', subject: 'character', timing: 'creation' } };
    expect(() => parseHumanL0CoreLot(collapsed)).toThrow(/speech-literacy-collapsed/);

    const grantedRight = structuredClone(lot);
    const rights = grantedRight.document.grants.find(grant => grant.id === 'syn-profession-choice-rights');
    if (!rights) throw new Error('missing choice rights');
    rights.consequence = { kind: 'effect', pending: null, effect: { op: 'grant-profession', professionId: 'pilot-profession:core:academic:r01', subject: 'character', timing: 'creation' } };
    expect(() => parseHumanL0CoreLot(grantedRight)).toThrow(/choice-right-grants-profession/);

    const invented = structuredClone(lot);
    const academicRow = invented.document.tables.find(table => table.id === 'core:profession-academic')?.columns[0].rows[0];
    if (!academicRow) throw new Error('missing academic row');
    academicRow.id = 'pilot-profession:core:wilderness:r01';
    expect(() => parseHumanL0CoreLot(invented)).toThrow(/invented-grouped-face/);

    const curated = structuredClone(lot.document);
    curated.reviewStatus = 'curated';
    expect(() => parseHumanL0Consumable(curated)).toThrow(/review-promotion-forbidden/);

    const blocked = structuredClone(lot.document);
    blocked.blockers[0].blocksSyntheticFixtures = true;
    expect(() => parseHumanL0Consumable(blocked)).toThrow(/hash-check-blocks-synthetic/);

    const copied = structuredClone(lot);
    const ageBand = copied.bands.find(band => band.id === 'core:human-age#main');
    if (!ageBand) throw new Error('missing age band');
    ageBand.ranges = explicitRanges('core:human-age').map(range => {
      if (range[0] === null || range[1] === null) throw new Error('open age range');
      return { min: range[0], max: range[1] };
    });
    expect(() => parseHumanL0CoreLot(copied)).toThrow(/synthetic-band-mismatch/);
    expect(syntheticEvenBands({ count: 3, sides: 6 }, 6).map(band => [band.min, band.max])).not.toEqual(explicitRanges('core:human-age'));
  });
});
