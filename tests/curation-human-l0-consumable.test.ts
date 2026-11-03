import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack } from '../packages/catalog';
import { HUMAN_L0_CONTRACT, HUMAN_L0_CONTRACT_VERSION, parseHumanL0MechanicalPacks } from '../packages/curation/human-l0-mechanics';
import {
  GROUPED_LOCAL_ONLY_MEMBERS, HASH_CHECK_BLOCKER, HUMAN_L0_CONSUMABLE_COMPATIBILITY, HUMAN_L0_CONSUMABLE_CONTRACT,
  HUMAN_L0_CONSUMABLE_CONTRACT_VERSION, HumanL0ConsumableError, MANUAL_RESOLUTION_SLOTS, PUBLISHED_CYCLE_IDS,
  parseHumanL0Consumable, parseHumanL0ConsumableResolution,
} from '../packages/curation/human-l0-consumable';
import { hasBuyerData } from '../tools/curation/privacy.mjs';

const document = JSON.parse(readFileSync('curation/examples/human-l0-consumable.synthetic.json', 'utf8'));
const rejections = JSON.parse(readFileSync('curation/examples/human-l0-consumable.rejections.json', 'utf8'));
const matrix = JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json', 'utf8'));
const mechanics = JSON.parse(readFileSync('curation/examples/human-l0-mechanics.synthetic.json', 'utf8'));
const coreStub = JSON.parse(readFileSync('content-packs/sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json', 'utf8'));
const fresh = () => structuredClone(document);

function rejects(input: unknown, code: string) {
  let error: unknown;
  try { parseHumanL0Consumable(input); } catch (caught) { error = caught; }
  expect(error).toBeInstanceOf(HumanL0ConsumableError);
  expect((error as HumanL0ConsumableError).code).toBe(code);
  expect((error as Error).message).not.toContain('PRIVATE_SENTINEL');
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

describe('Human L0 consumable contract v1', () => {
  it('accepts the synthetic fixture without rolling, promoting review, or enabling a ruleset', () => {
    const input = fresh(), before = JSON.stringify(input);
    const parsed = parseHumanL0Consumable(input);
    expect(parsed.contract).toBe(HUMAN_L0_CONSUMABLE_CONTRACT);
    expect(parsed.contractVersion).toBe(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION);
    expect(parsed.fictionalData).toBe(true);
    expect(parsed.reviewStatus).toBe('needs-review');
    expect(parsed.rulesetEnabled).toBe(false);
    expect(parsed.importablePack).toBe(false);
    expect(parsed.matrix.sourceVersion).toBeNull();
    expect(JSON.stringify(input)).toBe(before);
    expect(parsed.lookups[0].dice).toBeNull();
    expect(parsed.lookups[0].keys.map(key => key.key)).toEqual(['fixture:bands:low', 'fixture:bands:mid', 'fixture:bands:high']);
    const blade = parsed.items.find(item => item.id === 'fixture-blade');
    const shield = parsed.items.find(item => item.id === 'fixture-shield');
    expect(blade?.onUse?.kind === 'pending' && blade.onUse.pending.reason).toBe('weapon-no-defense');
    expect(shield?.onEquip?.kind === 'pending' && shield.onEquip.pending.reason).toBe('defense-bonus-not-substitution');
    expect(blade?.onUse?.kind === 'effect').toBe(false);
    const withoutDefense = fresh();
    withoutDefense.items.find((item: { id: string }) => item.id === 'fixture-blade').onUse = null;
    expect(parseHumanL0Consumable(withoutDefense).items.find(item => item.id === 'fixture-blade')?.onUse).toBeNull();
    expect(parsed.tables.find(table => table.id === 'fixture:columns')?.columns.map(column => column.rollId))
      .toEqual(['fixture:columns#positive', 'fixture:columns#negative']);
    const open = parsed.tables.find(table => table.id === 'fixture:open');
    expect(open?.columns[0].rows.map(row => [row.tail, row.publishedWeight.ways, row.publishedWeight.basis])).toEqual([
      ['open-low', '2', 'natural-dice-faces'], ['none', '2', 'natural-dice-faces'], ['open-high', '2', 'natural-dice-faces'],
    ]);
    const armor = parsed.items.find(item => item.id === 'fixture-wrap');
    expect(armor?.price).toMatchObject({ kind: 'unknown', bits: null });
    expect(armor?.onPossess.kind).toBe('pending');
    expect(armor?.onEquip?.kind === 'effect' && armor.onEquip.effect.op === 'substitute-defense' && armor.onEquip.effect.mode === 'substitute').toBe(true);
    expect(parsed.manualResolutions.every(row => row.consequence.kind === 'pending')).toBe(true);
    expect(parsed.groupedPendings.every(row => row.weights === null && row.linkedDefinition.individualEvidence === false)).toBe(true);
  });

  it('keeps the activity 1 blockers as typed gaps and does not treat grouped rows as individual evidence', () => {
    expect(HASH_CHECK_BLOCKER).toMatchObject({ count: 258, blocksSyntheticFixtures: false });
    expect(matrix.blockers.find((row: { id: string }) => row.id === 'act1-local-hash-check').count).toBe(258);
    expect(matrix.counts['selection:selecionado-manual']).toBe(16);
    expect(matrix.counts.groupedLocalOnlyIdentities).toBe(350);
    const members = matrix.blockers.find((row: { id: string }) => row.id === 'act3-act5-grouped-local-only').members;
    expect(members).toEqual(GROUPED_LOCAL_ONLY_MEMBERS.map(member => ({ id: member.id, count: member.count })));
    expect(GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 3).reduce((sum, member) => sum + member.count, 0)).toBe(36);
    expect(GROUPED_LOCAL_ONLY_MEMBERS.filter(member => member.activity === 5).reduce((sum, member) => sum + member.count, 0)).toBe(314);
    for (const member of GROUPED_LOCAL_ONLY_MEMBERS) {
      const record = matrix.records.find((row: { id: string }) => row.id === member.id);
      expect(record.linkedDefinition).toBe('local-only');
      expect(record.evidence).toBe('local-only');
      expect(record.represents).toBe(member.count);
      expect(record.sourceVersion).toBeNull();
    }
    const manual = matrix.records.filter((row: { selection: string }) => row.selection === 'selecionado-manual');
    expect(manual.map((row: { id: string }) => row.id)).toEqual(MANUAL_RESOLUTION_SLOTS.map(slot => slot.matrixId));
    for (const slot of MANUAL_RESOLUTION_SLOTS) {
      const record = manual.find((row: { id: string }) => row.id === slot.matrixId);
      if (slot.linkedDefinition.kind === 'choice') expect(record.linkedDefinition).toBe(`choice:${slot.linkedDefinition.candidates.join('|')}`);
      else if (slot.linkedDefinition.kind === 'local-only') expect(record.linkedDefinition).toBe('local-only');
      else expect(record.linkedDefinition).toBe('n/a:not-an-item-definition');
    }
    expect(matrix.records.find((row: { id: string }) => row.id === 'finding:recursion').capabilities).toEqual(expect.arrayContaining(
      PUBLISHED_CYCLE_IDS.map(id => `cycle:${id}`),
    ));
  });

  it('leaves the mechanical contract and the real ancestry stub unchanged', () => {
    expect(HUMAN_L0_CONSUMABLE_COMPATIBILITY.mechanicsContract).toBe(HUMAN_L0_CONTRACT);
    expect(HUMAN_L0_CONSUMABLE_COMPATIBILITY.mechanicsContractVersion).toBe(HUMAN_L0_CONTRACT_VERSION);
    expect(HUMAN_L0_CONSUMABLE_COMPATIBILITY.mechanicsProjection).toBe('0.2.0');
    const mechanical = parseHumanL0MechanicalPacks(structuredClone(mechanics.packs));
    expect(mechanical.map(pack => pack.version)).toEqual(['1.0.0', '1.0.0']);
    expect(mechanical.map(pack => pack.entities[0].mechanics.contractVersion)).toEqual(['1.0.0', '1.0.0']);
    const stub = parsePack(coreStub);
    expect(stub.fictionalData).toBe(false);
    expect(stub.entities[0].status).toBe('needs-review');
    rejects(stub, 'schema-invalid');
  });

  it('accepts a handler result made of separate effects and pendings, and refuses to roll', () => {
    const parsed = parseHumanL0Consumable(fresh());
    const effect = parsed.tables[0].columns[0].rows[0].consequence;
    const pending = parsed.manualResolutions[0].consequence;
    const entry = (componentId: string, phase: 'creation' | 'on-equip' | 'on-use' | 'narrative', consequence: unknown) => ({
      originKey: `fixture-publication@null/fixture:bands/fixture:bands:low/${componentId}`,
      origin: { publicationId: 'fixture-publication', version: null, entityId: 'fixture:bands', resultId: 'fixture:bands:low', componentId },
      subject: 'character', phase, consequence,
    });
    const resolution = {
      contract: HUMAN_L0_CONSUMABLE_CONTRACT, contractVersion: HUMAN_L0_CONSUMABLE_CONTRACT_VERSION,
      rolled: false, rulesetEnabled: false, input: { contextId: 'fixture-context', resultId: 'fixture:bands:low' },
      consequences: [entry('grant', 'creation', effect), entry('note', 'narrative', pending)],
    };
    const accepted = parseHumanL0ConsumableResolution(resolution);
    expect(accepted.consequences.map(row => row.consequence.kind)).toEqual(['effect', 'pending']);
    expect(accepted.consequences[0].originKey).toBe('fixture-publication@null/fixture:bands/fixture:bands:low/grant');
    expect(parseHumanL0ConsumableResolution({ ...resolution, consequences: [entry('grant', 'creation', effect)] }).consequences).toHaveLength(1);
    expect(() => parseHumanL0ConsumableResolution({ ...resolution, rolled: true })).toThrow(HumanL0ConsumableError);
    expect(() => parseHumanL0ConsumableResolution({ ...resolution, consequences: [] })).toThrow(/missing-consequence/);
    expect(() => parseHumanL0ConsumableResolution({ ...resolution, rulesetEnabled: true })).toThrow(/ruleset-enablement-forbidden/);
    const defense = parsed.items.find(item => item.id === 'fixture-wrap')?.onEquip;
    const equipped = entry('defense', 'on-equip', defense);
    expect(parseHumanL0ConsumableResolution({ ...resolution, consequences: [equipped] }).consequences[0].phase).toBe('on-equip');
    expect(() => parseHumanL0ConsumableResolution({ ...resolution, consequences: [{ ...equipped, phase: 'creation' }] })).toThrow(/defense-on-possession/);
  });

  it('still accepts an open tail whose modifier domain is pending rather than weighted', () => {
    const next = fresh();
    const column = next.tables.find((table: { id: string }) => table.id === 'fixture:open').columns[0];
    column.modifierDomain = { kind: 'pending', reason: 'open-tail-domain' };
    expect(parseHumanL0Consumable(next).tables.find(table => table.id === 'fixture:open')?.columns[0].modifierDomain).toEqual({ kind: 'pending', reason: 'open-tail-domain' });
    const lookup = next.lookups[0].keys[1].consequence.pending;
    lookup.reason = 'external-branch';
    expect(() => parseHumanL0Consumable(next)).not.toThrow();
  });

  for (const testCase of rejections.cases as { id: string; code: string; collection?: string; itemId?: string; sets: { path: string; value: unknown }[] }[]) {
    it(`rejects ${testCase.id}`, () => { rejects(apply(document, testCase), testCase.code); });
  }

  it('keeps public fixture text free of buyer data and book excerpts', () => {
    const visited = JSON.stringify(document);
    expect(hasBuyerData(visited)).toBe(false);
    expect(visited.includes('"excerpt"')).toBe(false);
    expect(visited.includes('sourceText')).toBe(false);
  });
});
