import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { z } from 'zod';
import { parsePack, validatePack } from '../../packages/catalog';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { SourceRegistrySchema } from '../../packages/curation/registries';
import { assertSafeArtifact } from './privacy.mjs';
import { canonicalJson, compareStrings as compare } from './canonical-json';
import { buildThematicIndexes } from './thematic-indexes';
import { buildCompilationReport, STAGING_PATHS, type InputDigest, type LocatedRecord } from './compilation-report';
import { parseHumanL0Recipe } from './human-l0-recipe';
import { validateHumanL0Bundle } from './human-l0-validation';

function checked<T>(schema: z.ZodType<T>, value: unknown, location: string): T {
  const result = schema.safeParse(value);
  // Zod/JSON error payloads may contain excerpts from local inputs. Never log them.
  if (!result.success) throw new Error(`${location}: invalid input.`);
  return result.data;
}
const sha256 = (text: string | Buffer) => createHash('sha256').update(text).digest('hex');

/** CUR-031 activities 1/2: metadata packs and exact indexes; no review promotion or mechanics. */
export function compileHumanL0(recipeInput: unknown, registryInput: unknown, entries: unknown[]) {
  const recipe = parseHumanL0Recipe(recipeInput);
  const registry = checked(SourceRegistrySchema, registryInput, 'Source registry');

  const packs = recipe.packs.map(spec => {
    const source = registry.sources.find(s => s.id === spec.sourceId);
    if (!source) throw new Error('Source registry: required publication missing.');
    const entities = spec.entityIds.map(id => {
      const matches = entries.filter(e => e !== null && typeof e === 'object' && 'id' in e && e.id === id);
      if (matches.length !== 1) throw new Error('Staging: selected entity missing or duplicated.');
      const entry = checked(StagingEntrySchema, matches[0], 'Selected staging entity');
      if (!entry.identity || entry.identity.entryKey !== 'human' || entry.kind !== 'ancestry' || entry.source.sourceId !== source.id)
        throw new Error('Staging: selection is not a Human ancestry of this publication.');
      if (entry.stage === 'blocked' || entry.representation === 'reference-only' || entry.review.sourcePermission.status === 'restricted' ||
          [entry.review.transcription, entry.review.structure, entry.review.mechanics, entry.review.automation].some(axis => axis.status === 'blocked'))
        throw new Error('Staging: selected entity is blocked.');
      return {
        id: entry.id!, kind: 'ancestry' as const, name: entry.name, sourceRef: source.id,
        sourcePage: entry.printedPage, variantKey: entry.identity.variantKey, revision: spec.version,
        status: 'needs-review' as const,
      };
    }).sort((a, b) => compare(a.id, b.id));
    return parsePack({
      packId: spec.packId, version: spec.version, system: 'sotdl', fictionalData: false,
      source: { id: source.id, title: source.title, sourcePage: null, status: 'needs-review' },
      dependencies: [...spec.dependencies].sort((a, b) => compare(a.packId, b.packId) || compare(a.version, b.version)), entities,
    });
  });
  const artifacts = new Map<string, string>();
  for (const pack of packs) {
    if (validatePack(pack, packs).some(d => d.severity === 'error')) throw new Error('Compiled pack failed catalog validation.');
    const path = `content-packs/${encodeURIComponent(pack.source.id)}/${pack.version}/pack.json`;
    const text = canonicalJson(pack);
    assertSafeArtifact(path, text);
    artifacts.set(path, text);
  }
  for (const [path, index] of buildThematicIndexes(packs)) {
    const text = canonicalJson(index);
    assertSafeArtifact(path, text);
    artifacts.set(path, text);
  }
  const ordered = new Map([...artifacts].sort(([a], [b]) => compare(a, b)));
  const hashes = [...ordered].map(([path, text]) => ({ path, sha256: sha256(text) }));
  return { packs, artifacts: ordered, hashes, sha256: sha256(canonicalJson(hashes)) };
}

export async function buildArtifacts(root: string) {
  const inputs: InputDigest[] = [];
  async function load(path: InputDigest['path']) {
    const bytes = await readFile(resolve(root, path));
    inputs.push({ path, bytes: bytes.length, sha256: sha256(bytes) });
    try { return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
    catch { throw new Error(`Invalid UTF-8 input at ${path}; contents omitted.`); }
  }
  async function jsonFile(path: InputDigest['path']) {
    const text = await load(path);
    try { return JSON.parse(text) as unknown; }
    catch { throw new Error(`Invalid JSON input at ${path}; contents omitted.`); }
  }
  const recipeInput = await jsonFile('curation/human-l0-compilation.json');
  const recipe = parseHumanL0Recipe(recipeInput);
  const records: LocatedRecord[] = [];
  for (const sourceId of [...new Set(recipe.packs.map(p => p.sourceId))].sort(compare)) {
    const path = STAGING_PATHS[sourceId];
    const lines = (await load(path)).split(/\r\n|\n|\r/);
    for (const [index, line] of lines.entries()) {
      if (!line.trim()) continue;
      try { records.push({ path, sourceId, line: index + 1, sha256: sha256(line), value: JSON.parse(line) }); }
      catch { throw new Error(`Invalid staging JSON at ${path}:${index + 1}; contents omitted.`); }
    }
  }
  const registryInput = await jsonFile('curation/sources.json');
  const result = compileHumanL0(recipeInput, registryInput, records.map(r => r.value));
  const report = buildCompilationReport(inputs, records, result.packs, result);
  const path = 'reports/human-l0-compilation.json', text = canonicalJson(report);
  assertSafeArtifact(path, text);
  const artifacts = new Map([...result.artifacts, [path, text] as [string, string]].sort(([a], [b]) => compare(a, b)));
  const validation = validateHumanL0Bundle(artifacts, recipeInput, { inputs, records, registry: registryInput });
  const hashes = [...artifacts].map(([path, text]) => ({ path, sha256: sha256(text) }));
  return { ...result, report, artifacts, hashes, validation, sha256: sha256(canonicalJson(hashes)) };
}

async function rejectOutputLinks(root: string, target: string) {
  let path = resolve(root);
  for (const segment of relative(path, target).split(sep)) {
    path = resolve(path, segment);
    try {
      if ((await lstat(path)).isSymbolicLink()) throw new Error('Compilation output cannot traverse symbolic links.');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }
  }
}

export async function main(args: string[], root = process.cwd()) {
  return runCompilation(args, root, () => buildArtifacts(root), false);
}

export async function mainMechanical(args: string[], root = process.cwd()) {
  return runCompilation(args, root, async () => (await import('./human-l0-mechanical-compiler')).buildMechanicalArtifacts(root), true);
}

async function runCompilation<T extends { artifacts: Map<string,string>; hashes: {path:string;sha256:string}[];
  sha256: string; validation: {status:string;packs:number;entities:number} }>(args: string[], root: string, build: () => Promise<T>, mechanical: boolean) {
  if (!['--write', '--check'].includes(args[0]) || ![1, 3].includes(args.length) || args.length === 3 && args[1] !== '--output')
    throw new Error('Use --write|--check [--output tmp/<directory>].');
  const output = resolve(root, args[2] ?? (mechanical ? 'tmp/curation/compiled-human-l0-mechanics' : 'tmp/curation/compiled-human-l0'));
  const location = relative(resolve(root, 'tmp'), output);
  if (!location || location === '..' || location.startsWith(`..${sep}`) || isAbsolute(location))
    throw new Error('Compilation output must be a directory inside tmp/.');
  const result = await build();
  // Preflight all destinations; packs are immutable, indexes/reports follow the current inputs.
  const writes: [string, string, boolean][] = [];
  for (const [path, text] of result.artifacts) {
    const target = resolve(output, path);
    await rejectOutputLinks(root, target);
    let current: string;
    try { current = await readFile(target, 'utf8'); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || args[0] === '--check') throw error;
      writes.push([target, text, false]); continue;
    }
    if (current !== text) {
      const derived = path.startsWith('compendios/') || path.startsWith('reports/');
      if (args[0] === '--write' && derived) writes.push([target, text, true]);
      else if (derived) throw new Error(`Compiled ${path.startsWith('reports/') ? 'report' : 'index'} differs: ${path}. Rebuild with --write.`);
      else throw new Error(`Compiled artifact differs: ${path}. Choose a new version or a separate output directory.`);
    }
  }
  // Write packs, then indexes, then the report describing the completed artifact set.
  const priority = (path: string) => path.endsWith('pack.json') ? 0 : path.endsWith('.index.json') ? 1 : 2;
  writes.sort(([a], [b]) => priority(a) - priority(b));
  for (const [target, text, replace] of writes) {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, text, { encoding: 'utf8', flag: replace ? 'w' : 'wx' });
  }
  for (const hash of result.hashes) console.log(`${hash.sha256}  ${hash.path}`);
  console.log(`Human L0 ${mechanical ? 'mechanical' : 'metadata'} compilation SHA256: ${result.sha256}; ${args[0]}`);
  console.log(`Integrated validation: ${result.validation.status}; ${result.validation.packs} packs, ${result.validation.entities} entities; ruleset disabled.`);
  return result;
}
