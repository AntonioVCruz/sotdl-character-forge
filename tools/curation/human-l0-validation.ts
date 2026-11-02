import { createHash } from 'node:crypto';
import { emptySnapshot, importPack, parsePack, validatePack, validateSnapshot, type Pack } from '../../packages/catalog';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { SourceRegistrySchema } from '../../packages/curation/registries';
import { canonicalJson, compareStrings } from './canonical-json';
import { buildCompilationReport, CompilationReportSchema, STAGING_PATHS, type InputDigest, type LocatedRecord } from './compilation-report';
import { CORE_SOURCE_ID, ONLY_HUMAN_SOURCE_ID, parseHumanL0Recipe } from './human-l0-recipe';
import { assertSafeArtifact } from './privacy.mjs';
import { buildThematicIndexes, validateIndexReferences } from './thematic-indexes';

export type SliceDiagnostic = { path: string; pointer: string; code: string };
export class HumanL0ValidationError extends Error {
  constructor(public readonly diagnostic: SliceDiagnostic) {
    super(`${diagnostic.path}#${diagnostic.pointer}: ${diagnostic.code}`);
    this.name = 'HumanL0ValidationError';
  }
}
const fail = (path: string, pointer: string, code: string): never => { throw new HumanL0ValidationError({ path, pointer, code }); };
const sha256 = (text: string) => createHash('sha256').update(text, 'utf8').digest('hex');
const same = (a: unknown, b: unknown) => canonicalJson(a) === canonicalJson(b);
const keys = (value: object, allowed: string[]) => same(Object.keys(value).sort(compareStrings), [...allowed].sort(compareStrings));
const REPORT = 'reports/human-l0-compilation.json', INDEX = 'compendios/ancestry.index.json';

/** Bounded CUR-032 gate for the Human L0 metadata slice, not approval of official mechanics. */
export function validateHumanL0Bundle(artifacts: ReadonlyMap<string, string>, recipeInput: unknown,
  provenance: { inputs: InputDigest[]; records: LocatedRecord[]; registry: unknown }) {
  let recipe: ReturnType<typeof parseHumanL0Recipe>;
  try { recipe = parseHumanL0Recipe(recipeInput); }
  catch { return fail('curation/human-l0-compilation.json', '/', 'recipe-invalid'); }
  const registry = SourceRegistrySchema.safeParse(provenance.registry);
  if (!registry.success) return fail('curation/sources.json', '/', 'source-registry-invalid');
  const paths = recipe.packs.map(spec => `content-packs/${encodeURIComponent(spec.sourceId)}/${spec.version}/pack.json`);
  const expectedPaths = new Set([...paths, INDEX, REPORT]);
  for (const path of expectedPaths) if (!artifacts.has(path)) return fail(path, '/', 'artifact-missing');
  if (artifacts.size !== expectedPaths.size || [...artifacts.keys()].some(path => !expectedPaths.has(path)))
    return fail('bundle', '/artifacts', 'artifact-inventory-mismatch');
  function json(path: string): unknown {
    const text = artifacts.get(path);
    if (text === undefined) return fail(path, '/', 'artifact-missing');
    try { assertSafeArtifact(path, text); return JSON.parse(text); }
    catch { return fail(path, '/', 'json-or-privacy-invalid'); }
  }
  const packs: Pack[] = [];
  for (const [i, spec] of recipe.packs.entries()) {
    const path = paths[i], raw = json(path);
    let pack: Pack;
    try { pack = parsePack(raw); }
    catch { return fail(path, '/', 'pack-schema-invalid'); }
    if (artifacts.get(path) !== canonicalJson(pack)) return fail(path, '/', 'noncanonical-pack');
    if (!keys(pack, ['packId', 'version', 'system', 'fictionalData', 'source', 'dependencies', 'entities']) ||
        !keys(pack.source, ['id', 'title', 'sourcePage', 'status'])) return fail(path, '/', 'nonmetadata-fields');
    if (pack.packId !== spec.packId || pack.version !== spec.version || pack.source.id !== spec.sourceId)
      return fail(path, '/', 'recipe-pack-mismatch');
    if (pack.fictionalData || pack.source.status !== 'needs-review' || pack.source.sourcePage !== null)
      return fail(path, '/source', 'review-or-fictional-status-mismatch');
    if (pack.source.title !== registry.data.sources.find(source => source.id === spec.sourceId)?.title)
      return fail(path, '/source/title', 'source-metadata-mismatch');
    if (!same(pack.dependencies, spec.dependencies)) return fail(path, '/dependencies', 'exact-dependency-mismatch');
    if (!same(pack.entities.map(e => e.id), [...spec.entityIds].sort(compareStrings)))
      return fail(path, '/entities', 'entity-selection-mismatch');
    for (const [n, entity] of pack.entities.entries()) {
      const pointer = `/entities/${n}`;
      if (!keys(entity, ['id', 'kind', 'name', 'sourceRef', 'sourcePage', 'variantKey', 'revision', 'status']))
        return fail(path, pointer, 'nonmetadata-fields');
      const origins = provenance.records.filter(record => record.sourceId === spec.sourceId && record.path === STAGING_PATHS[spec.sourceId] &&
        record.value !== null && typeof record.value === 'object' && 'id' in record.value && record.value.id === entity.id);
      if (origins.length !== 1) return fail(path, pointer, 'staging-origin-missing-or-ambiguous');
      const staged = StagingEntrySchema.safeParse(origins[0].value);
      if (!staged.success) return fail(path, pointer, 'staging-record-invalid');
      const entry = staged.data;
      if (!entry.identity || entry.identity.entryKey !== 'human' || entry.kind !== 'ancestry' || entry.source.sourceId !== spec.sourceId ||
          entry.stage === 'blocked' || entry.representation === 'reference-only' || entry.review.sourcePermission.status === 'restricted' ||
          [entry.review.transcription, entry.review.structure, entry.review.mechanics, entry.review.automation].some(axis => axis.status === 'blocked'))
        return fail(path, pointer, 'staging-record-ineligible');
      if (entity.kind !== 'ancestry' || entity.sourceRef !== spec.sourceId || entity.name !== entry.name ||
          entity.sourcePage !== entry.printedPage || entity.variantKey !== entry.identity.variantKey ||
          entity.revision !== spec.version || entity.status !== 'needs-review')
        return fail(path, pointer, 'projected-metadata-mismatch');
    }
    packs.push(pack);
  }
  for (const [i, pack] of packs.entries()) if (validatePack(pack, packs).some(d => d.severity === 'error'))
    return fail(paths[i], '/', 'catalog-validation-failed');

  const ordered = [CORE_SOURCE_ID, ONLY_HUMAN_SOURCE_ID].map(sourceId => packs.find(pack => pack.source.id === sourceId)!);
  let snapshot = emptySnapshot();
  for (const pack of ordered) {
    try { snapshot = importPack(snapshot, pack).snapshot; }
    catch { return fail(paths[packs.indexOf(pack)], '/dependencies', 'catalog-import-failed'); }
  }
  try { snapshot = validateSnapshot(JSON.parse(JSON.stringify(snapshot))); }
  catch { return fail('catalog', '/', 'snapshot-roundtrip-failed'); }
  if (snapshot.ruleset.packs.length || snapshot.packs.length !== 2) return fail('catalog', '/ruleset', 'unexpected-activation');

  const rawIndex = json(INDEX);
  let index: ReturnType<typeof validateIndexReferences>;
  try { index = validateIndexReferences(rawIndex, packs); }
  catch { return fail(INDEX, '/entries', 'index-reference-invalid'); }
  const expectedIndex = buildThematicIndexes(packs).get(INDEX);
  if (!same(index, expectedIndex)) return fail(INDEX, '/entries', 'index-coverage-or-metadata-mismatch');
  if (artifacts.get(INDEX) !== canonicalJson(index)) return fail(INDEX, '/', 'noncanonical-index');

  const report = CompilationReportSchema.safeParse(json(REPORT));
  if (!report.success) return fail(REPORT, '/', 'report-schema-invalid');
  if (artifacts.get(REPORT) !== canonicalJson(report.data)) return fail(REPORT, '/', 'noncanonical-report');
  const hashes = [...artifacts].filter(([path]) => path !== REPORT).sort(([a], [b]) => compareStrings(a, b))
    .map(([path, text]) => ({ path, sha256: sha256(text) }));
  const output = { hashes, sha256: sha256(canonicalJson(hashes)) };
  if (!same(report.data.outputs, { files: hashes, sha256: output.sha256 })) return fail(REPORT, '/outputs', 'output-hash-mismatch');
  if (report.data.counts.included !== report.data.included.length || report.data.counts.excluded !== report.data.excluded.length ||
      report.data.counts.pending !== report.data.pending.length ||
      report.data.counts.recordsRead !== report.data.counts.included + report.data.counts.excluded)
    return fail(REPORT, '/counts', 'report-accounting-mismatch');
  let expectedReport: ReturnType<typeof buildCompilationReport>;
  try { expectedReport = buildCompilationReport(provenance.inputs, provenance.records, packs, output); }
  catch { return fail(REPORT, '/included', 'report-origins-invalid'); }
  for (const section of ['inputs', 'included', 'excluded', 'pending', 'counts'] as const)
    if (!same(report.data[section], expectedReport[section])) return fail(REPORT, `/${section}`, 'report-provenance-or-coverage-mismatch');
  return { scope: 'human-l0-metadata-slice' as const, status: 'passed' as const,
    packs: packs.length, entities: packs.reduce((n, pack) => n + pack.entities.length, 0),
    importOrder: ordered.map(pack => ({ packId: pack.packId, version: pack.version })), snapshot };
}
