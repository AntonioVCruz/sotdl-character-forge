import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack } from '../packages/catalog';
import { HUMAN_L0_CONTRACT_VERSION, parseHumanL0MechanicalPacks } from '../packages/curation/human-l0-mechanics';
import {
  GROUPED_LOCAL_ONLY_MEMBERS, HUMAN_L0_CONSUMABLE_COMPATIBILITY, HUMAN_L0_CONSUMABLE_CONTRACT, HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
  HumanL0ConsumableError, parseHumanL0Consumable, parseHumanL0ConsumableResolution,
} from '../packages/curation/human-l0-consumable';
import {
  KITS_LOT_COUNTS, LIFESTYLES, LOOKUP_IDS, ONLY_HUMAN_LIFESTYLE_QUERY_ID, ONLY_HUMAN_LIFESTYLE_RANGES,
  humanL0KitsDocumentInput, kitProgramId, lookupQueryId, lifestyleRowId, parseHumanL0KitsDocument, projectHumanL0KitsLot,
} from '../packages/curation/human-l0-kits-lot';
import { moneyToBits, resolveStartingLifestyle } from '../packages/curation/starting-equipment-model';
import { hasBuyerData } from '../tools/curation/privacy.mjs';

const documentText = readFileSync('curation/examples/human-l0-kits.synthetic.json', 'utf8');
const document = JSON.parse(documentText);
const rejections = JSON.parse(readFileSync('curation/examples/human-l0-kits.rejections.json', 'utf8'));
const matrix = JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json', 'utf8'));
const mechanics = JSON.parse(readFileSync('curation/examples/human-l0-mechanics.synthetic.json', 'utf8'));
const compilation = JSON.parse(readFileSync('curation/human-l0-mechanical-compilation.json', 'utf8'));
const coreStub = JSON.parse(readFileSync('content-packs/sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json', 'utf8'));
const contractFixture = JSON.parse(readFileSync('curation/examples/human-l0-consumable.synthetic.json', 'utf8'));
const lot = projectHumanL0KitsLot(matrix);

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

describe('Human L0 kits lot on consumable 1.0.0', () => {
  it('matches the checked-in synthetic fixture and stays on contract 1.0.0', () => {
    expect(documentText.endsWith('\n')).toBe(true);
    expect(document).toEqual(humanL0KitsDocumentInput());
    const parsed = parseHumanL0KitsDocument(document);
    expect(parsed.contract).toBe(HUMAN_L0_CONSUMABLE_CONTRACT);
    expect(parsed.contractVersion).toBe('1.0.0');
    expect(parsed.contractVersion).toBe(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION);
    expect(parsed.fictionalData).toBe(true);
    expect(parsed.reviewStatus).toBe('needs-review');
    expect(parsed.rulesetEnabled).toBe(false);
    expect(parsed.importablePack).toBe(false);
    expect(parsed.promotesReview).toBe(false);
    expect(parsed.compatibility).toEqual(HUMAN_L0_CONSUMABLE_COMPATIBILITY);
    expect(parsed.blockers[0]).toMatchObject({ id: 'act1-local-hash-check', count: 258, blocksSyntheticFixtures: false });
    expect(parseHumanL0Consumable(contractFixture).contractVersion).toBe('1.0.0');
  });

  it('accounts 752 rows and 1063 identities without splitting the 314', () => {
    expect(lot.matrixRows).toBe(KITS_LOT_COUNTS.matrixRows);
    expect(lot.identities).toBe(KITS_LOT_COUNTS.identities);
    expect(lot.selectedRows).toBe(KITS_LOT_COUNTS.selectedRows);
    expect(lot.manualRows).toBe(KITS_LOT_COUNTS.manualRows);
    expect(lot.selectedRows + lot.manualRows).toBe(lot.matrixRows);
    expect(lot.definitions).toBe(409);
    expect(lot.references).toBe(547);
    expect(lot.programs).toBe(97);
    expect(lot.lookups).toHaveLength(5);
    expect(lot.queries).toHaveLength(5);
    expect(lot.byKind).toEqual({
      'grant-program': 97, 'item-definition': 409, 'item-reference': 547, query: 5, table: 5,
    });
    expect(lot.definitions + lot.references + lot.programs + lot.lookups.length + lot.queries.length).toBe(1063);
    expect(lot.coreDefinitions).toHaveLength(67);
    expect(lot.thingDefinitions).toHaveLength(285);
    expect(lot.groups.map(group => [group.id, group.represents])).toEqual([
      ['class:source-grant-only', 57], ['class:exact-definition-refs', 182], ['class:generic-editable-refs', 75],
    ]);
    expect(lot.groups.reduce((sum, group) => sum + group.represents, 0)).toBe(314);
    for (const group of lot.groups) {
      expect(group.leafIds).toEqual([]);
      expect(group.weights).toBeNull();
      expect(group.linkedDefinition).toBe('local-only');
      expect(group.individualEvidence).toBe(false);
      expect(group.evidence).toBe('local-only');
      expect(group.reason).toBe('catalog-group-not-individual');
    }
    const catalogMembers = GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 5);
    expect(catalogMembers.map(member => member.count)).toEqual([57, 182, 75]);
    const parsed = parseHumanL0KitsDocument(document);
    expect(parsed.groupedPendings.filter(row => row.activity === 5).map(row => [row.id, row.represents, row.weights, row.consequence.kind])).toEqual([
      ['class:source-grant-only', 57, null, 'pending'],
      ['class:exact-definition-refs', 182, null, 'pending'],
      ['class:generic-editable-refs', 75, null, 'pending'],
    ]);
    const banned = new Set([...lot.coreDefinitions.map(row => row.id), ...lot.thingDefinitions.map(row => row.id), ...lot.groups.map(row => row.id)]);
    expect(parsed.items.some(item => banned.has(item.id) || item.id.startsWith('pilot-item:') || item.id.startsWith('class:'))).toBe(false);
  });

  it('keeps 97 programs local-only and links the five lookups to the act 4 lifestyle query', () => {
    expect(lot.onlyHumanProfessionPrograms).toHaveLength(66);
    expect(lot.coreKits).toHaveLength(6);
    expect(lot.onlyHumanKits).toHaveLength(6);
    expect(lot.extraPrograms).toHaveLength(19);
    expect(lot.programRecords.every(row => row.localOnly && row.carriedItem === false && row.teachesSpell === false && row.moneyBits === null && row.moneyIsPrice === false)).toBe(true);
    expect(lot.onlyHumanProfessionPrograms.every(row => row.subject === 'pc' && row.familyDoesNotGrant)).toBe(true);
    expect(lot.coreKits.map(row => row.id).sort()).toEqual(LIFESTYLES.map(lifestyle => kitProgramId('core', lifestyle)).sort());
    expect(lot.onlyHumanKits.map(row => row.id).sort()).toEqual(LIFESTYLES.map(lifestyle => kitProgramId('only-human', lifestyle)).sort());
    expect(lot.coreKits.every(row => row.context === 'core-starting-kit')).toBe(true);
    expect(lot.onlyHumanKits.every(row => row.context === 'expanded-lifestyle-five-lookups')).toBe(true);
    expect(lot.majorWindfallFallback).toMatchObject({ id: 'extra:major-windfall-1-fallback', localOnly: true, carriedItem: false });
    expect(lot.lookups).toEqual([...LOOKUP_IDS].sort());
    expect(lot.queries).toEqual(LOOKUP_IDS.map(lookupQueryId).sort());
    const parsed = parseHumanL0KitsDocument(document);
    expect(parsed.producedQueries.map(query => query.id)).toEqual([ONLY_HUMAN_LIFESTYLE_QUERY_ID]);
    expect(parsed.tables.map(table => table.id)).toEqual(['only-human:lifestyle']);
    expect(parsed.lookups.map(lookup => lookup.id)).toEqual([...LOOKUP_IDS]);
    for (const lookup of parsed.lookups) {
      expect(lookup.dice).toBeNull();
      expect(lookup.reads.queryId).toBe(ONLY_HUMAN_LIFESTYLE_QUERY_ID);
      expect(lookup.keys.map(key => key.key)).toEqual(LIFESTYLES.map(lifestyleRowId));
      expect(lookup.keys.every(key => key.consequence.kind === 'pending' && key.consequence.pending.reason === 'grant-program-local-only')).toBe(true);
    }
    const money = parsed.lookups.find(lookup => lookup.id === 'only-human:money');
    expect(money?.keys.every(key => key.consequence.kind === 'pending' && key.consequence.pending.linkedDefinition.kind === 'not-an-item')).toBe(true);
    const clothing = parsed.lookups.find(lookup => lookup.id === 'only-human:clothing');
    expect(clothing?.keys.every(key => key.consequence.kind === 'pending' && key.consequence.pending.linkedDefinition.kind === 'local-only' && key.consequence.pending.linkedDefinition.individualEvidence === false)).toBe(true);
  });

  it('separates price, currency, choice, defense and non-carried grants', () => {
    const parsed = parseHumanL0KitsDocument(document);
    expect(lot.coreDefinitions.every(row => row.priceKind === 'unknown' && row.bits === null && row.combatProfile === null && row.projected === false)).toBe(true);
    expect(lot.coreDefinitions.some(row => row.bits === '0')).toBe(false);
    expect(lot.thingDefinitions.every(row => row.inheritsCombatFromName === false && row.price === null && row.projected === false && row.teachesSpell === false)).toBe(true);
    const companions = lot.thingDefinitions.filter(row => row.outcomeKind === 'companion');
    expect(companions.length).toBeGreaterThan(0);
    expect(companions.every(row => row.carriedAllowed === false)).toBe(true);
    expect(lot.thingDefinitions.filter(row => row.outcomeKind === 'mixed').every(row => row.carriedAllowed === false)).toBe(true);
    expect(lot.thingDefinitions.every(row => row.outcomeKind === 'object' || row.outcomeKind === 'companion' || row.outcomeKind === 'mixed')).toBe(true);
    const priceOf = (id: string) => parsed.items.find(item => item.id === id)?.price;
    expect(priceOf('kit-fixture-armor')).toEqual({ kind: 'unknown', amount: null, denomination: null, bits: null });
    expect(priceOf('kit-fixture-priced')).toEqual({ kind: 'exact', amount: '1', denomination: 'gc', bits: '1000' });
    expect(priceOf('kit-fixture-minimum')).toEqual({ kind: 'minimum', amount: '1', denomination: 'cp', bits: '10' });
    expect(priceOf('kit-fixture-generic')).toEqual({ kind: 'variable', amount: null, denomination: null, bits: null });
    const currency = parsed.grants.find(row => row.id === 'kit-fixture:grant:currency');
    const currencyEffect = currency?.consequence.kind === 'effect' ? currency.consequence.effect : null;
    if (currencyEffect?.op !== 'grant-currency') throw new Error('Missing synthetic currency grant');
    expect(currencyEffect.bits).toBe(moneyToBits('3', 'cp'));
    expect(parsed.items.some(item => item.price.bits === currencyEffect.bits)).toBe(false);
    expect(lot.currencyReferences).toHaveLength(19);
    expect(lot.currencyReferences.every(row => row.bits === null && row.itemId === null)).toBe(true);
    expect(lot.nonInventoryReferences).toHaveLength(75);
    expect(lot.nonInventoryReferences.every(row => row.carriedItem === false)).toBe(true);
    expect(lot.currencyReferences.length + lot.nonInventoryReferences.length).toBe(94);
    expect(lot.ruleBlocks).toHaveLength(28);
    expect(lot.ruleBlocks.every(row => row.handler === false)).toBe(true);
    const shield = parsed.manualResolutions.find(row => row.matrixId.endsWith('/shield'));
    expect(shield?.consequence.kind === 'pending' && shield.consequence.pending.linkedDefinition.kind === 'choice' && shield.consequence.pending.linkedDefinition.resolvedItemId).toBeNull();
    expect(lot.choices).toHaveLength(5);
    for (const choice of lot.choices) {
      expect(choice.resolvedItemId).toBeNull();
      expect(choice.selection).toBe('selecionado-manual');
      expect(choice.matrixLinkedDefinition).toBe(`choice:${choice.candidates.join('|')}`);
    }
    const choiceGrant = parsed.grants.find(row => row.id === 'kit-fixture:grant:shield-choice');
    expect(choiceGrant?.origin.entityId).toBe('core:kit:wealthy');
    expect(choiceGrant?.consequence.kind === 'pending' && choiceGrant.consequence.pending.linkedDefinition.kind === 'choice' && choiceGrant.consequence.pending.linkedDefinition.resolvedItemId).toBeNull();
    const armor = parsed.items.find(item => item.id === 'kit-fixture-armor');
    const blade = parsed.items.find(item => item.id === 'kit-fixture-blade');
    const shieldItem = parsed.items.find(item => item.id === 'kit-fixture-shield');
    expect(armor?.onPossess.kind === 'pending' && armor.onPossess.pending.reason).toBe('possession-is-not-use');
    expect(armor?.onEquip?.kind === 'effect' && armor.onEquip.effect.op === 'substitute-defense' && armor.onEquip.effect.mode === 'substitute' && armor.onEquip.effect.possessionApplies).toBe(false);
    expect(blade?.onUse?.kind === 'pending' && blade.onUse.pending.reason).toBe('weapon-no-defense');
    expect(shieldItem?.onEquip?.kind === 'pending' && shieldItem.onEquip.pending.reason).toBe('defense-bonus-not-substitution');
    expect(parsed.grants.filter(row => row.consequence.kind === 'pending' && row.consequence.pending.reason === 'not-carried').map(row => row.id)).toEqual([
      'kit-fixture:grant:companion', 'kit-fixture:grant:property', 'kit-fixture:grant:service',
    ]);
    const incantation = parsed.items.find(item => item.id === 'kit-fixture-incantation');
    expect(incantation?.onPossess.kind === 'effect' && incantation.onPossess.effect.op === 'narrative-marker' && incantation.onPossess.effect.code).toBe('incantation-not-a-spell');
    const effects = JSON.stringify(parsed);
    expect(effects.includes('grant-spell')).toBe(false);
    expect(effects.includes('"teachesSpell":true')).toBe(false);
    const carried = parsed.grants.flatMap(row => row.consequence.kind === 'effect' && row.consequence.effect.op === 'grant-item' ? [row.consequence.effect] : []);
    expect(carried.every(effect => effect.usageApplied === false && effect.possession === 'carried')).toBe(true);
    expect(carried.map(effect => effect.itemId).sort()).toEqual(['kit-fixture-armor', 'kit-fixture-incantation']);
  });

  it('uses the only-human lifestyle bounds as the lookup prior and does not project the other table lots', () => {
    const faces = (total: number): [number, number, number] => total <= 8 ? [1, 1, total - 2] : [6, 6, total - 12];
    for (const range of ONLY_HUMAN_LIFESTYLE_RANGES) {
      const total = range.tail === 'open-low' ? 3 : range.tail === 'open-high' ? 18 : range.min;
      expect(total).not.toBeNull();
      expect(resolveStartingLifestyle({ procedure: 'only-human', faces: faces(total ?? 0), events: [] }).lifestyle).toBe(range.lifestyle);
    }
    expect(resolveStartingLifestyle({ procedure: 'core', faces: [1, 1, 1], events: [] }).lifestyle).toBe('destitute');
    expect(resolveStartingLifestyle({ procedure: 'only-human', faces: [6, 6, 6], events: [] }).lifestyle).toBe('rich');
    const parsed = parseHumanL0KitsDocument(document);
    expect(parsed.tables.some(table => table.id === 'core:wealth' || table.id.startsWith('oddities:') || table.id === 'only-human:life')).toBe(false);
    expect(parsed.unprojectedPublishedCycles.every(cycle => cycle.projected === false)).toBe(true);
  });

  it('accepts a kit resolution without rolling or enabling a ruleset', () => {
    const parsed = parseHumanL0KitsDocument(document);
    const currency = parsed.grants.find(row => row.id === 'kit-fixture:grant:currency')?.consequence;
    const pendingChoice = parsed.grants.find(row => row.id === 'kit-fixture:grant:shield-choice')?.consequence;
    const entry = (componentId: string, phase: 'creation' | 'narrative', consequence: unknown) => ({
      originKey: `fixture-publication@null/query:only-human:money/kit-fixture:shape/${componentId}`,
      origin: { publicationId: 'fixture-publication', version: null, entityId: 'query:only-human:money', resultId: 'kit-fixture:shape', componentId },
      subject: 'character' as const, phase, consequence,
    });
    const resolution = {
      contract: HUMAN_L0_CONSUMABLE_CONTRACT, contractVersion: '1.0.0' as const, rolled: false, rulesetEnabled: false,
      input: { contextId: 'kit-fixture-context', resultId: 'kit-fixture:shape' },
      consequences: [entry('grant-currency', 'creation', currency), entry('choice', 'narrative', pendingChoice)],
    };
    expect(parseHumanL0ConsumableResolution(resolution).consequences.map(row => row.consequence.kind)).toEqual(['effect', 'pending']);
    expect(() => parseHumanL0ConsumableResolution({ ...resolution, rolled: true })).toThrow(/resolution-does-not-roll/);
    expect(() => parseHumanL0ConsumableResolution({ ...resolution, rulesetEnabled: true })).toThrow(/ruleset-enablement-forbidden/);
  });

  it('leaves the freeze, the mechanical projection, and the real stub untouched', () => {
    expect(HUMAN_L0_CONSUMABLE_COMPATIBILITY).toMatchObject({ frozenFileCount: 16, mechanicsProjection: '0.2.0', semanticsUnchanged: true });
    expect(HUMAN_L0_CONTRACT_VERSION).toBe('1.0.0');
    expect(compilation.packs.map((pack: { version: string }) => pack.version)).toEqual(['0.2.0', '0.2.0']);
    expect(parseHumanL0MechanicalPacks(structuredClone(mechanics.packs)).map(pack => pack.version)).toEqual(['1.0.0', '1.0.0']);
    const stub = parsePack(coreStub);
    expect(stub.fictionalData).toBe(false);
    expect(stub.entities[0].status).toBe('needs-review');
    rejects(stub, 'schema-invalid');
    expect(hasBuyerData(documentText)).toBe(false);
    expect(documentText.includes('sourceText') || documentText.includes('"excerpt"')).toBe(false);
  });

  for (const testCase of rejections.cases as { id: string; code: string; collection?: string; itemId?: string; sets: { path: string; value: unknown }[] }[]) {
    it(`rejects ${testCase.id}`, () => { rejects(apply(document, testCase), testCase.code); });
  }
});
