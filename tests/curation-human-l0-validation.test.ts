import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emptySnapshot, importPack, parsePack } from '../packages/catalog';
import { loadSnapshot, saveSnapshot } from '../packages/catalog/storage';
import { canonicalJson } from '../tools/curation/canonical-json';
import { buildCompilationReport, STAGING_PATHS, type InputDigest, type LocatedRecord } from '../tools/curation/compilation-report';
import { HumanL0ValidationError, validateHumanL0Bundle } from '../tools/curation/human-l0-validation';
import { compileHumanL0, main } from '../tools/curation/pack-compiler';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const recipe = read('curation/human-l0-compilation.json'), registry = read('curation/sources.json');
const fixture = read('curation/examples/staging.json');
const REPORT = 'reports/human-l0-compilation.json', INDEX = 'compendios/ancestry.index.json';
const sha = (text: string) => createHash('sha256').update(text).digest('hex');
const temporary: string[] = [];
function entries() {
  return recipe.packs.map((pack: typeof recipe.packs[number], i: number) => {
    const entry = structuredClone(fixture);
    entry.id = pack.entityIds[0]; entry.kind = 'ancestry'; entry.name = 'Human';
    entry.identity = { sourceId: pack.sourceId, kind: 'ancestry', entryKey: 'human', variantKey: i ? 'variant' : 'default' };
    entry.source.sourceId = pack.sourceId; entry.review.subjectId = entry.id;
    return entry;
  });
}
function bundle() {
  const records: LocatedRecord[] = entries().map((entry: ReturnType<typeof entries>[number]) => {
    const sourceId = entry.identity.sourceId as keyof typeof STAGING_PATHS;
    return { sourceId, path: STAGING_PATHS[sourceId], line: 1, sha256: sha(JSON.stringify(entry)), value: entry };
  });
  const inputs: InputDigest[] = ['curation/human-l0-compilation.json', 'curation/sources.json', ...Object.values(STAGING_PATHS)]
    .map(path => ({ path: path as InputDigest['path'], bytes: 1, sha256: sha(path) }));
  const compiled = compileHumanL0(recipe, registry, records.map(r => r.value));
  const report = buildCompilationReport(inputs, records, compiled.packs, compiled);
  const artifacts = new Map(compiled.artifacts); artifacts.set(REPORT, canonicalJson(report));
  return { artifacts, provenance: { inputs, records, registry }, packs: compiled.packs };
}
function change(artifacts: Map<string, string>, path: string, mutate: (value: any) => void) {
  const value = JSON.parse(artifacts.get(path)!); mutate(value); artifacts.set(path, canonicalJson(value));
}
function corePath(artifacts: Map<string, string>) { return [...artifacts.keys()].find(path => path.includes('shadow-of-the-demon-lord-core'))!; }
function supplementPath(artifacts: Map<string, string>) { return [...artifacts.keys()].find(path => path.includes('only-human'))!; }
function reject(artifacts: Map<string, string>, provenance: ReturnType<typeof bundle>['provenance'], code: string, path?: string) {
  let error: unknown;
  try { validateHumanL0Bundle(artifacts, recipe, provenance); } catch (caught) { error = caught; }
  expect(error).toBeInstanceOf(HumanL0ValidationError);
  expect((error as HumanL0ValidationError).diagnostic.code).toBe(code);
  if (path) expect((error as HumanL0ValidationError).diagnostic.path).toBe(path);
  expect((error as Error).message).not.toContain('PRIVATE_PAYLOAD');
}
async function workspace() {
  const root = await mkdtemp(join(tmpdir(), 'human-l0-validation-')); temporary.push(root);
  const files: [string, string][] = [['curation/human-l0-compilation.json', JSON.stringify(recipe)], ['curation/sources.json', JSON.stringify(registry)]];
  for (const entry of entries()) files.push([STAGING_PATHS[entry.identity.sourceId as keyof typeof STAGING_PATHS], JSON.stringify(entry) + '\n']);
  for (const [path, text] of files) { await mkdir(dirname(join(root, path)), { recursive: true }); await writeFile(join(root, path), text); }
  vi.spyOn(console, 'log').mockImplementation(() => {});
  return root;
}
beforeEach(() => { vi.stubGlobal('indexedDB', new IDBFactory()); });
afterEach(async () => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  for (const path of temporary.splice(0)) {
    const part = relative(resolve(tmpdir()), resolve(path));
    if (!part.startsWith('human-l0-validation-') || part.includes(sep)) throw new Error('Unexpected test cleanup path');
    await rm(path, { recursive: true, force: true });
  }
});

describe('Human L0 metadata slice integrated validation', () => {
  it('validates the complete bundle independently of iteration order, then persists/reloads both packs disabled', async () => {
    const { artifacts, provenance } = bundle();
    const reversed = structuredClone(recipe); reversed.packs.reverse();
    const accepted = validateHumanL0Bundle(new Map([...artifacts].reverse()), reversed, provenance);
    expect(accepted).toMatchObject({ status: 'passed', scope: 'human-l0-metadata-slice', packs: 2, entities: 2 });
    expect(accepted.importOrder.map(p => p.packId)).toEqual(['sotdl-core-human-l0', 'sotdl-only-human-l0']);
    expect(accepted.snapshot.ruleset.packs).toEqual([]);
    await saveSnapshot(accepted.snapshot);
    expect(await loadSnapshot()).toEqual(accepted.snapshot);
    let again = accepted.snapshot;
    for (const pack of accepted.snapshot.packs) again = importPack(again, pack).snapshot;
    expect(again).toBe(accepted.snapshot);
  });

  it('rejects Only Human before Core or with the wrong Core version without altering persisted state', async () => {
    const { packs } = bundle(), core = packs.find(p => p.packId === 'sotdl-core-human-l0')!, supplement = packs.find(p => p.packId === 'sotdl-only-human-l0')!;
    await saveSnapshot(emptySnapshot());
    expect(() => importPack(emptySnapshot(), supplement)).toThrow(/Dependência ausente/);
    expect(await loadSnapshot()).toEqual(emptySnapshot());
    const wrongCore = structuredClone(core); wrongCore.version = '9.0.0';
    const state = importPack(emptySnapshot(), wrongCore).snapshot; await saveSnapshot(state);
    expect(() => importPack(state, supplement)).toThrow(/Dependência ausente/);
    expect(await loadSnapshot()).toEqual(state);
    const invalid = { ...state, packs: [...state.packs, supplement] };
    await expect(saveSnapshot(invalid)).rejects.toThrow(/Dependência ausente/);
    expect(await loadSnapshot()).toEqual(state);
  });

  it('rejects pack/version replacement on import and leaves a valid saved snapshot intact', async () => {
    const { artifacts, provenance } = bundle(), accepted = validateHumanL0Bundle(artifacts, recipe, provenance);
    await saveSnapshot(accepted.snapshot);
    const changed = structuredClone(accepted.snapshot.packs[0]); changed.entities[0].name = 'Changed';
    expect(() => importPack(accepted.snapshot, changed)).toThrow(/nova versão/);
    expect(await loadSnapshot()).toEqual(accepted.snapshot);
  });

  it('requires exactly the four declared artifacts and emits sanitized missing-file diagnostics', () => {
    const { artifacts, provenance } = bundle(); artifacts.delete(INDEX);
    reject(artifacts, provenance, 'artifact-missing', INDEX);
    const next = bundle(); next.artifacts.set('PRIVATE_PAYLOAD', '{}');
    reject(next.artifacts, next.provenance, 'artifact-inventory-mismatch', 'bundle');
  });

  it.each(['wrong-version', 'missing-dependency', 'cycle'] as const)('rejects %s in the dependency pair', mutation => {
    const { artifacts, provenance } = bundle(), path = mutation === 'cycle' ? corePath(artifacts) : supplementPath(artifacts);
    change(artifacts, path, pack => {
      if (mutation === 'wrong-version') pack.dependencies[0].version = '9.0.0';
      else if (mutation === 'missing-dependency') pack.dependencies = [];
      else pack.dependencies = [{ packId: 'sotdl-only-human-l0', version: '0.1.1' }];
    });
    reject(artifacts, provenance, 'exact-dependency-mismatch', path);
  });

  it('rejects changed metadata even if the attacker updates the report output hashes', () => {
    const { artifacts, provenance } = bundle(), path = corePath(artifacts);
    change(artifacts, path, pack => { pack.entities[0].sourcePage = 99; });
    const hashes = [...artifacts].filter(([p]) => p !== REPORT).sort(([a], [b]) => a < b ? -1 : 1).map(([path, text]) => ({ path, sha256: sha(text) }));
    change(artifacts, REPORT, report => { report.outputs = { files: hashes, sha256: sha(canonicalJson(hashes)) }; });
    reject(artifacts, provenance, 'projected-metadata-mismatch', path);
  });

  it('rejects raw text fields and fabricated curated/fictional statuses without exposing their values', () => {
    const extra = bundle(), path = corePath(extra.artifacts);
    change(extra.artifacts, path, pack => { pack.entities[0].text = 'PRIVATE_PAYLOAD'; });
    reject(extra.artifacts, extra.provenance, 'nonmetadata-fields', path);
    const status = bundle(); change(status.artifacts, path, pack => { pack.entities[0].status = 'curated'; });
    reject(status.artifacts, status.provenance, 'projected-metadata-mismatch', path);
    const fictional = bundle(); change(fictional.artifacts, path, pack => { pack.fictionalData = true; pack.source.status = 'fictional'; });
    reject(fictional.artifacts, fictional.provenance, 'review-or-fictional-status-mismatch', path);
  });

  it('requires complete index coverage and rejects mismatched or duplicate refs', () => {
    const missing = bundle(); change(missing.artifacts, INDEX, index => { index.entries.pop(); });
    reject(missing.artifacts, missing.provenance, 'index-coverage-or-metadata-mismatch', INDEX);
    for (const mutate of [(index: any) => { index.entries[0].ref.version = '9.0.0'; }, (index: any) => { index.entries.push(index.entries[0]); }]) {
      const changed = bundle(); change(changed.artifacts, INDEX, mutate);
      reject(changed.artifacts, changed.provenance, 'index-reference-invalid', INDEX);
    }
  });

  it.each(['outputs', 'counts', 'inputs', 'included', 'excluded', 'pending'] as const)('rejects forged report %s', section => {
    const { artifacts, provenance } = bundle();
    change(artifacts, REPORT, report => {
      if (section === 'outputs') report.outputs.files[0].sha256 = '0'.repeat(64);
      if (section === 'counts') report.counts.recordsRead += 1;
      if (section === 'inputs') report.inputs[0].sha256 = '0'.repeat(64);
      if (section === 'included') report.included[0].origin.line += 1;
      if (section === 'excluded') { report.excluded.push({ origin: report.included[0].origin, reasons: ['outside-selection'] }); report.counts.excluded += 1; report.counts.recordsRead += 1; }
      if (section === 'pending') { report.pending.pop(); report.counts.pending -= 1; }
    });
    reject(artifacts, provenance, section === 'outputs' ? 'output-hash-mismatch' : section === 'counts' ? 'report-accounting-mismatch' : 'report-provenance-or-coverage-mismatch', REPORT);
  });

  it('rejects malformed or noncanonical JSON without echoing its contents', () => {
    const malformed = bundle(); malformed.artifacts.set(REPORT, 'PRIVATE_PAYLOAD');
    reject(malformed.artifacts, malformed.provenance, 'json-or-privacy-invalid', REPORT);
    const formatted = bundle(), path = corePath(formatted.artifacts);
    formatted.artifacts.set(path, JSON.stringify(JSON.parse(formatted.artifacts.get(path)!)));
    reject(formatted.artifacts, formatted.provenance, 'noncanonical-pack', path);
  });

  it('runs compilation through persisted bytes, reference validation, catalog import and IndexedDB roundtrip', async () => {
    const root = await workspace(), first = await main(['--write'], root);
    const output = join(root, 'tmp/curation/compiled-human-l0');
    const persisted = new Map<string, string>();
    for (const path of first.artifacts.keys()) persisted.set(path, await readFile(join(output, path), 'utf8'));
    expect([...persisted]).toEqual([...first.artifacts]);
    const checked = await main(['--check'], root);
    expect(checked.sha256).toBe(first.sha256);
    expect(checked.report.pending.some(p => p.code === 'integrated-validation')).toBe(false);
    expect(checked.report.pending.some(p => p.code === 'content-review')).toBe(true);
    // Import the bytes read back from disk, rather than reusing the compiler's objects.
    const loaded = [corePath(persisted), supplementPath(persisted)].map(path => parsePack(JSON.parse(persisted.get(path)!)));
    let imported = emptySnapshot();
    for (const pack of loaded) imported = importPack(imported, pack).snapshot;
    expect(imported).toEqual(checked.validation.snapshot);
    await saveSnapshot(imported);
    const saved = await loadSnapshot();
    expect(saved.ruleset.packs).toEqual([]); expect(saved.packs).toHaveLength(2);
    const index = JSON.parse(persisted.get(INDEX)!);
    for (const entry of index.entries) {
      const target = saved.packs.find(pack => pack.packId === entry.ref.packId && pack.version === entry.ref.version)!;
      expect(target.entities.find(entity => entity.id === entry.ref.entityId)?.variantKey).toBe(entry.variantKey);
    }
  });

  it('rejects tampered on-disk bytes and preserves a previous valid set after a recipe dependency failure', async () => {
    const root = await workspace(), first = await main(['--write'], root), output = join(root, 'tmp/curation/compiled-human-l0');
    const path = supplementPath(first.artifacts), original = await readFile(join(output, path));
    await writeFile(join(output, path), '{}\n');
    await expect(main(['--check'], root)).rejects.toThrow(/differs/);
    await writeFile(join(output, path), original);
    const bad = structuredClone(recipe); bad.packs[1].dependencies[0].version = '9.0.0';
    await writeFile(join(root, 'curation/human-l0-compilation.json'), JSON.stringify(bad));
    await expect(main(['--write'], root)).rejects.toThrow(/exact Core version/);
    for (const [path, text] of first.artifacts) expect(await readFile(join(output, path), 'utf8')).toBe(text);
  });
});
