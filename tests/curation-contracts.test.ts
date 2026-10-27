import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack, validatePack } from '../packages/catalog';
import { RulesetCurationSchema, StagingEntrySchema, ThematicIndexSchema, validateRulesetRelations } from '../packages/curation/contracts';
import { SourcePolicySchema } from '../packages/curation/source-policy';
import { InputManifestSchema, SourceAliasesSchema, SourceRegistrySchema } from '../packages/curation/registries';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const example = (name: string) => read(`curation/examples/${name}`);

describe('curation contracts v1', () => {
  it('validates current registries and rejects broken source accounting', () => {
    InputManifestSchema.parse(read('curation/input-manifest.json'));
    SourceAliasesSchema.parse(read('curation/source-aliases.json'));
    SourceRegistrySchema.parse(read('curation/sources.json'));
    const broken = read('curation/sources.json'); broken.references[0].sourceId = 'unknown';
    expect(SourceRegistrySchema.safeParse(broken).success).toBe(false);
    broken.references[0].sourceId = null;
    expect(SourceRegistrySchema.safeParse(broken).success).toBe(false);
  });
  it('parses minimal real/fictional packs with no catalog errors and rejects sidecars in the pack root', () => {
    for (const name of ['real-empty.pack.json', 'fictional.pack.json']) {
      const pack = parsePack(example(name));
      expect(validatePack(pack).filter(d => d.severity === 'error')).toEqual([]);
      expect(() => parsePack({ ...pack, curation: {} })).toThrow();
    }
    expect(validatePack(parsePack(example('fictional.pack.json'))).some(d => d.severity === 'warning')).toBe(true);
  });
  it('preserves staging evidence, blocks reference-only/pending sources and rejects fabricated identity/text', () => {
    const full = StagingEntrySchema.parse(example('staging.json'));
    expect(full.review.automation.status).toBe('unsupported');
    const reference = { ...full, representation: 'reference-only', originalText: null, stage: 'blocked' };
    StagingEntrySchema.parse(reference);
    expect(StagingEntrySchema.safeParse({ ...reference, originalText: 'Copied from another publication' }).success).toBe(false);
    expect(StagingEntrySchema.safeParse({ ...reference, stage: 'reviewed' }).success).toBe(false);
    expect(StagingEntrySchema.safeParse({ ...full, id: 'wrong' }).success).toBe(false);
    const pending = { ...full, id: null, identity: null, stage: 'blocked', source: { ...full.source, status: 'pending', sourceId: null } };
    StagingEntrySchema.parse(pending);
    expect(StagingEntrySchema.safeParse({ ...pending, stage: 'captured' }).success).toBe(false);
    expect(StagingEntrySchema.safeParse({ ...full, curationSecret: true }).success).toBe(false);
  });
  it('keeps index references pinned to the exact pack/entity and rejects category/duplicate errors', () => {
    const index = ThematicIndexSchema.parse(example('rule.index.json'));
    const pack = parsePack(example('fictional.pack.json'));
    for (const entry of index.entries) {
      expect(entry.ref.packId).toBe(pack.packId); expect(entry.ref.version).toBe(pack.version);
      expect(pack.entities.find(e => e.id === entry.ref.entityId)?.sourceRef).toBe(entry.sourceId);
    }
    expect(ThematicIndexSchema.safeParse({ ...index, category: 'spell' }).success).toBe(false);
    expect(ThematicIndexSchema.safeParse({ ...index, entries: [...index.entries, ...index.entries] }).success).toBe(false);
  });
  it('requires explicit scopes/versions and refuses overrides based on unverified errata', () => {
    const ruleset = RulesetCurationSchema.parse(example('ruleset.curation.json'));
    const policy = SourcePolicySchema.parse(read('curation/source-policy.json'));
    validateRulesetRelations(ruleset, policy);
    const selection = ruleset.selections[0];
    expect(RulesetCurationSchema.safeParse({ ...ruleset, selections: [{ ...selection, scope: 'regional' }] }).success).toBe(false);
    expect(RulesetCurationSchema.safeParse({ ...ruleset, selections: [{ ...selection, scope: 'optional' }] }).success).toBe(false);
    expect(RulesetCurationSchema.safeParse({ ...ruleset, selections: [{ ...selection, ref: { ...selection.ref, version: '9.0.0' } }] }).success).toBe(false);
    expect(RulesetCurationSchema.safeParse({ ...ruleset, selections: [selection, selection] }).success).toBe(false);
    const override = { relationId: policy.relations[0].id, base: selection.ref, replacement: { ...selection.ref, entityId: 'another' }, scopeKey: 'base', responsible: 'test', reason: 'test' };
    expect(() => validateRulesetRelations({ ...ruleset, overrides: [override] }, policy)).toThrow(/não verificada/);
  });
});
