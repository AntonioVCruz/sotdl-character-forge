import { z } from 'zod';
import type { Pack } from '../../packages/catalog';
import { ThematicIndexSchema } from '../../packages/curation/contracts';
import { compareStrings } from './canonical-json';

type ThematicIndex = z.infer<typeof ThematicIndexSchema>;
const packKey = (ref: { packId: string; version: string }) => JSON.stringify([ref.packId, ref.version]);

function exactPacks(packs: Pack[]) {
  const result = new Map<string, Pack>();
  for (const pack of packs) {
    const key = packKey(pack);
    if (result.has(key)) throw new Error('Thematic index: ambiguous pack/version.');
    if (new Set(pack.entities.map(e => e.id)).size !== pack.entities.length)
      throw new Error('Thematic index: ambiguous entity ID within pack.');
    result.set(key, pack);
  }
  return result;
}

/** Resolve the full tuple; never choose a newer version or a same-name entity. */
export function validateIndexReferences(input: unknown, packs: Pack[]): ThematicIndex {
  const parsed = ThematicIndexSchema.safeParse(input);
  if (!parsed.success) throw new Error('Thematic index: invalid schema.');
  const catalog = exactPacks(packs);
  for (const entry of parsed.data.entries) {
    if (parsed.data.category === 'tradition' && entry.kind !== 'spell' && entry.kind !== 'path')
      throw new Error('Thematic index: tradition category requires a spell or path.');
    const pack = catalog.get(packKey(entry.ref));
    const entity = pack?.entities.find(e => e.id === entry.ref.entityId);
    if (!pack || !entity) throw new Error('Thematic index: exact pack/version/entity reference missing.');
    if (entry.sourceId !== pack.source.id || entity.sourceRef !== pack.source.id ||
        entry.kind !== entity.kind || entry.variantKey !== entity.variantKey || entry.name !== entity.name)
      throw new Error('Thematic index: target metadata mismatch.');
  }
  return parsed.data;
}

/** Index only emitted entities; aliases and equivalence need separate reviewed mappings. */
export function buildThematicIndexes(packs: Pack[]) {
  exactPacks(packs);
  const groups = new Map<Pack['entities'][number]['kind'], ThematicIndex['entries']>();
  for (const pack of packs) for (const entity of pack.entities) {
    const entries = groups.get(entity.kind) ?? [];
    entries.push({
      name: entity.name, searchAliases: [],
      ref: { packId: pack.packId, version: pack.version, entityId: entity.id },
      kind: entity.kind, sourceId: pack.source.id, variantKey: entity.variantKey, equivalenceGroupId: null,
    });
    groups.set(entity.kind, entries);
  }
  return new Map([...groups].sort(([a], [b]) => compareStrings(a, b)).map(([category, entries]) => {
    entries.sort((a, b) => compareStrings(a.ref.packId, b.ref.packId) ||
      compareStrings(a.ref.version, b.ref.version) || compareStrings(a.ref.entityId, b.ref.entityId));
    const index = validateIndexReferences({ schemaVersion: 1, category, entries }, packs);
    return [`compendios/${category}.index.json`, index] as const;
  }));
}
