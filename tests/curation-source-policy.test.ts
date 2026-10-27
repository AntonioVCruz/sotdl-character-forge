import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chooseRevision, SourcePolicySchema } from '../packages/curation/source-policy';

describe('source and errata policy', () => {
  it('records MD assertions with exact evidence without enabling them', () => {
    const policy = SourcePolicySchema.parse(JSON.parse(readFileSync('curation/source-policy.json', 'utf8')));
    expect(policy.relations).toHaveLength(3);
    expect(policy.relations.every(r => r.status === 'declared-in-md' && !r.enabledByDefault)).toBe(true);
    for (const e of policy.evidence) {
      const bytes = readFileSync(e.path);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(e.inputSha256);
      const excerpt = bytes.toString('utf8').split(/\r\n|\n|\r/).slice(e.startLine! - 1, e.endLine!).join('\n');
      expect(excerpt).toBe(e.excerpt);
      expect(createHash('sha256').update(excerpt).digest('hex')).toBe(e.excerptSha256);
    }
  });
  it('requires the exact selected revision instead of silently choosing the latest', () => {
    const old = { packId: 'errata-10oct17', version: '1.0.0', entityId: 'crawl-old' };
    const next = { packId: 'errata-19nov17', version: '1.0.0', entityId: 'crawl-new' };
    expect(chooseRevision([next, old], old)).toEqual(old);
    expect(() => chooseRevision([old, next], null)).toThrow();
    expect(() => chooseRevision([old, next], { ...old, version: '2.0.0' })).toThrow();
    expect(() => chooseRevision([old, old], old)).toThrow();
  });
});
