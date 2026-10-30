import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack } from '../packages/catalog';
import { ThematicIndexSchema } from '../packages/curation/contracts';
import { canonicalJson } from '../tools/curation/canonical-json';
import { buildThematicIndexes, validateIndexReferences } from '../tools/curation/thematic-indexes';

const read = (path: string) => parsePack(JSON.parse(readFileSync(path, 'utf8')));
function packs() {
  return [read('content-packs/sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json'),
    read('content-packs/sotdl%3Aonly-human/0.1.0/pack.json')];
}
const ancestry = () => buildThematicIndexes(packs()).get('compendios/ancestry.index.json')!;

describe('CUR-031 activity 2: exact thematic index references', () => {
  it('keeps both same-name Human variants as separate, exact references with metadata only', () => {
    const catalog = packs();
    catalog[0].entities[0].text = 'Synthetic private text that must not be indexed';
    const index = buildThematicIndexes(catalog).get('compendios/ancestry.index.json')!;
    expect(ThematicIndexSchema.safeParse(index).success).toBe(true);
    expect(index.entries).toHaveLength(2);
    expect(index.entries.map(e => e.name)).toEqual(['Human', 'Human']);
    expect(index.entries.map(e => e.ref)).toEqual(catalog.map(p => ({ packId: p.packId, version: p.version, entityId: p.entities[0].id })));
    expect(index.entries.map(e => e.variantKey)).toEqual(['default', 'variant']);
    expect(index.entries.every(e => e.equivalenceGroupId === null && e.searchAliases.length === 0)).toBe(true);
    expect(canonicalJson(index)).not.toMatch(/Synthetic|"text"|"status"|"evidence"|"formula"/);
    expect(() => validateIndexReferences(index, catalog)).not.toThrow();
  });

  it('is deterministic across pack/entity order and groups only categories actually emitted', () => {
    const catalog = [...packs(), read('curation/examples/fictional.pack.json')];
    const first = buildThematicIndexes(catalog);
    for (const pack of catalog) pack.entities.reverse();
    const second = buildThematicIndexes(catalog.reverse());
    expect([...first].map(([path, index]) => [path, canonicalJson(index)]))
      .toEqual([...second].map(([path, index]) => [path, canonicalJson(index)]));
    expect([...first.keys()]).toEqual(['compendios/ancestry.index.json', 'compendios/rule.index.json']);
  });

  it.each(['packId', 'version', 'entityId'] as const)('rejects a missing exact %s without falling back to same-name candidates', field => {
    const index = ancestry();
    index.entries[0].ref[field] = field === 'version' ? '9.0.0' : 'missing';
    expect(() => validateIndexReferences(index, packs())).toThrow(/reference missing/);
  });

  it.each(['sourceId', 'variantKey', 'name'] as const)('rejects mismatched %s metadata', field => {
    const index = ancestry(); index.entries[0][field] = 'different';
    expect(() => validateIndexReferences(index, packs())).toThrow(/metadata mismatch/);
  });

  it('rejects the wrong category/kind and duplicated index refs', () => {
    const index = ancestry();
    expect(() => validateIndexReferences({ ...index, category: 'rule' }, packs())).toThrow(/invalid schema/);
    expect(() => validateIndexReferences({ ...index, category: 'tradition' }, packs())).toThrow(/spell or path/);
    const changed = structuredClone(index); changed.entries[0].kind = 'rule';
    expect(() => validateIndexReferences(changed, packs())).toThrow(/invalid schema/);
    expect(() => validateIndexReferences({ ...index, entries: [...index.entries, index.entries[0]] }, packs())).toThrow(/invalid schema/);
  });

  it('rejects ambiguous packs/entities and mismatches between entity and pack source', () => {
    const catalog = packs();
    expect(() => buildThematicIndexes([...catalog, catalog[0]])).toThrow(/ambiguous pack/);
    const duplicate = structuredClone(catalog); duplicate[0].entities.push(duplicate[0].entities[0]);
    expect(() => buildThematicIndexes(duplicate)).toThrow(/ambiguous entity/);
    catalog[0].entities[0].sourceRef = catalog[1].source.id;
    expect(() => buildThematicIndexes(catalog)).toThrow(/metadata mismatch/);
  });

  it('preserves separate exact refs when the same pack/entity occurs in two versions', () => {
    const [first] = packs(), second = structuredClone(first); second.version = '0.2.0';
    const index = buildThematicIndexes([second, first]).get('compendios/ancestry.index.json')!;
    expect(index.entries.map(e => e.ref.version)).toEqual(['0.1.0', '0.2.0']);
    expect(() => validateIndexReferences(index, [first])).toThrow(/reference missing/);
  });
});
