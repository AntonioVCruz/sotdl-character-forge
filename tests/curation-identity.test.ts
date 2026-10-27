import { describe, expect, it } from 'vitest';
import { entityId, type CurationIdentity } from '../packages/curation/identity';

describe('publication identity', () => {
  it('separates editions, kinds and variants while remaining independent of read order', () => {
    const base: CurationIdentity = { sourceId: 'sotdl:core', kind: 'ancestry', entryKey: 'human', variantKey: 'default' };
    const identities: CurationIdentity[] = [base, { ...base, sourceId: 'sotdl:only-human' }, { ...base, variantKey: 'expanded' }, { ...base, kind: 'trait' }];
    expect(new Set(identities.map(entityId)).size).toBe(4);
    expect(identities.map(entityId).sort()).toEqual([...identities].reverse().map(entityId).sort());
    expect(entityId({ ...base, sourceId: 'sotdl:errata-10oct17' })).not.toBe(entityId({ ...base, sourceId: 'sotdl:errata-19nov17' }));
  });
  it('rejects unstable/invalid keys and IDs exceeding the catalog limit', () => {
    const base: CurationIdentity = { sourceId: 'sotdl:core', kind: 'ancestry', entryKey: 'human', variantKey: 'default' };
    expect(() => entityId({ ...base, entryKey: 'Human: line 15' })).toThrow();
    expect(() => entityId({ ...base, sourceId: 's'.repeat(195) })).toThrow();
  });
});
