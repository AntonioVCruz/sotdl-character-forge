import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { compileHumanL0, main } from '../tools/curation/pack-compiler';
import { parsePack, validatePack } from '../packages/catalog';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const recipe = read('curation/human-l0-compilation.json');
const registry = read('curation/sources.json');
const fixture = read('curation/examples/staging.json');

// Synthetic evidence: the public tests do not read the licensed corpus or local staging.
function staging() {
  return recipe.packs.map((pack: typeof recipe.packs[number], index: number) => {
    const entry = structuredClone(fixture);
    entry.id = pack.entityIds[0]; entry.name = 'Human'; entry.kind = 'ancestry';
    entry.identity = { sourceId: pack.sourceId, kind: 'ancestry', entryKey: 'human', variantKey: index ? 'variant' : 'default' };
    entry.source.sourceId = pack.sourceId; entry.review.subjectId = entry.id;
    entry.printedPage = index + 1;
    entry.originalText = 'Synthetic private staging payload, excluded from pack.';
    return entry;
  });
}
function reverseKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(reverseKeys);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).reverse().map(([k, v]) => [k, reverseKeys(v)]));
  return value;
}
const temporary: string[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true })));
});

async function workspace() {
  const root = await mkdtemp(join(tmpdir(), 'human-l0-compiler-')); temporary.push(root);
  for (const [path, value] of [['curation/human-l0-compilation.json', recipe], ['curation/sources.json', registry]] as const) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), JSON.stringify(value));
  }
  for (const entry of staging()) {
    const path = join(root, 'curation/entries', encodeURIComponent(entry.source.sourceId), 'ancestry.jsonl');
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(entry) + '\r\n');
  }
  vi.spyOn(console, 'log').mockImplementation(() => {});
  return root;
}

describe('CUR-031 activity 1: deterministic Human L0 compilation', () => {
  it('emits identical UTF-8/LF bytes and SHA256 across runs, key order and reading order', () => {
    const entries = staging();
    const first = compileHumanL0(recipe, registry, entries);
    const reordered = structuredClone(recipe); reordered.packs.reverse();
    const second = compileHumanL0(reverseKeys(reordered), reverseKeys(registry), reverseKeys(entries.reverse()) as unknown[]);
    expect([...second.artifacts]).toEqual([...first.artifacts]);
    expect(second.hashes).toEqual(first.hashes);
    expect(second.sha256).toBe(first.sha256);
    for (const text of first.artifacts.values()) { expect(text.endsWith('\n')).toBe(true); expect(text).not.toContain('\r'); }
  });

  it('changes the content hash when a projected value changes, but never copies evidence or mechanics', () => {
    const entries = staging(), first = compileHumanL0(recipe, registry, entries);
    entries[0].originalText = 'Different synthetic private material';
    entries[0].review.evidence[0].excerpt = 'Synthetic evidence changed';
    expect(compileHumanL0(recipe, registry, entries).sha256).toBe(first.sha256);
    entries[0].printedPage += 1;
    expect(compileHumanL0(recipe, registry, entries).sha256).not.toBe(first.sha256);
    const packs = [...first.artifacts.values()].map(text => parsePack(JSON.parse(text)));
    for (const pack of packs) {
      expect(validatePack(pack, packs).filter(d => d.severity === 'error')).toEqual([]);
      expect(pack.fictionalData).toBe(false);
      expect(pack.source.status).toBe('needs-review');
      expect(pack.entities.every(e => e.status === 'needs-review')).toBe(true);
      expect(JSON.stringify(pack)).not.toMatch(/Synthetic|originalText|normalizedText|"evidence"|"review"|formula|demoSlot|demoLevel|MAGIC_PATH/);
    }
  });

  it('requires each selected stable ID exactly once, with a matching source and identity', () => {
    const entries = staging();
    expect(() => compileHumanL0(recipe, registry, entries.slice(1))).toThrow(/missing or duplicated/);
    expect(() => compileHumanL0(recipe, registry, [...entries, entries[0]])).toThrow(/missing or duplicated/);
    entries[0].identity.variantKey = 'another';
    expect(() => compileHumanL0(recipe, registry, entries)).toThrow(/invalid input/);
  });

  it('rejects blocked, restricted and reference-only input without logging payloads', () => {
    for (const mutate of [
      (e: ReturnType<typeof staging>[number]) => { e.stage = 'blocked'; },
      (e: ReturnType<typeof staging>[number]) => { e.review.mechanics.status = 'blocked'; },
      (e: ReturnType<typeof staging>[number]) => { e.review.sourcePermission.status = 'restricted'; },
      (e: ReturnType<typeof staging>[number]) => { e.stage = 'blocked'; e.representation = 'reference-only'; e.originalText = null; },
    ]) {
      const entries = staging(); mutate(entries[0]);
      expect(() => compileHumanL0(recipe, registry, entries)).toThrow(/blocked/);
    }
    const invalid = staging(); invalid[0].name = { private: 'Synthetic secret value' };
    expect(() => compileHumanL0(recipe, registry, invalid)).toThrow('Selected staging entity: invalid input.');
  });

  it('pins Only Human to Core and rejects ambiguous recipes', () => {
    const changed = structuredClone(recipe); changed.packs[1].dependencies[0].version = '9.0.0';
    expect(() => compileHumanL0(changed, registry, staging())).toThrow(/exact Core version/);
    changed.packs = [changed.packs[0], changed.packs[0]];
    expect(() => compileHumanL0(changed, registry, staging())).toThrow(/duplicate source or pack/);
  });

  it('rejects purchase patterns at the output boundary instead of silently changing content', () => {
    const entries = staging(); entries[0].name = '(' + 'order #' + '123456' + ')';
    expect(() => compileHumanL0(recipe, registry, entries)).toThrow(/Buyer data/);
  });

  it('writes and checks the same artifacts twice without requiring books or changing versions', async () => {
    const root = await workspace();
    const first = await main(['--write'], root);
    const bytes = await Promise.all([...first.artifacts.keys()].map(path => readFile(join(root, 'tmp/curation/compiled-human-l0', path))));
    const second = await main(['--write'], root);
    expect(second.hashes).toEqual(first.hashes);
    expect(await Promise.all([...second.artifacts.keys()].map(path => readFile(join(root, 'tmp/curation/compiled-human-l0', path))))).toEqual(bytes);
    await expect(main(['--check'], root)).resolves.toMatchObject({ sha256: first.sha256 });
  });

  it('refuses same-version replacement and confines output to the ignored tmp directory', async () => {
    const root = await workspace(), first = await main(['--write'], root);
    const [path] = first.artifacts.keys(); const target = join(root, 'tmp/curation/compiled-human-l0', path);
    await writeFile(target, 'Existing version content\n');
    await expect(main(['--write'], root)).rejects.toThrow(/Choose a new version/);
    expect(await readFile(target, 'utf8')).toBe('Existing version content\n');
    await expect(main(['--check'], root)).rejects.toThrow(/differs/);
    await expect(main(['--write', '--output', 'content-packs'], root)).rejects.toThrow(/inside tmp/);
    await expect(main(['--write', '--output', '../escape'], root)).rejects.toThrow(/inside tmp/);
  });

  it('rejects output links that would escape the ignored directory', async () => {
    const root = await workspace();
    await mkdir(join(root, 'destination'));
    await mkdir(join(root, 'tmp'));
    await symlink(join(root, 'destination'), join(root, 'tmp/link'), 'junction');
    await expect(main(['--write', '--output', 'tmp/link'], root)).rejects.toThrow(/symbolic links/);
  });
});
