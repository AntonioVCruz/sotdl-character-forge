import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildCompilationReport, CompilationReportSchema, STAGING_PATHS, type InputDigest, type LocatedRecord } from '../tools/curation/compilation-report';
import { compileHumanL0 } from '../tools/curation/pack-compiler';
import { canonicalJson } from '../tools/curation/canonical-json';
import { assertSafeArtifact } from '../tools/curation/privacy.mjs';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const recipe = read('curation/human-l0-compilation.json'), registry = read('curation/sources.json');
const fixture = read('curation/examples/staging.json');
const sources = Object.keys(STAGING_PATHS) as (keyof typeof STAGING_PATHS)[];
const digest = (text: string) => createHash('sha256').update(text).digest('hex');
function selected() {
  return recipe.packs.map((pack: typeof recipe.packs[number], index: number) => {
    const entry = structuredClone(fixture);
    entry.id = pack.entityIds[0]; entry.name = 'Human'; entry.kind = 'ancestry';
    entry.identity = { sourceId: pack.sourceId, kind: 'ancestry', entryKey: 'human', variantKey: index ? 'variant' : 'default' };
    entry.source.sourceId = pack.sourceId; entry.review.subjectId = entry.id;
    return entry;
  });
}
function outside(index = 0) {
  const entry = selected()[index];
  entry.identity.entryKey = 'other-ancestry';
  entry.id = `${entry.identity.sourceId}:ancestry:other-ancestry:${entry.identity.variantKey}`;
  entry.review.subjectId = entry.id;
  entry.name = 'PRIVATE NAME SENTINEL'; entry.originalText = 'PRIVATE BODY SENTINEL';
  entry.review.mechanics.reason = 'PRIVATE REVIEW SENTINEL';
  return entry;
}
function located(value: unknown, sourceId: keyof typeof STAGING_PATHS, line: number): LocatedRecord {
  return { value, sourceId, path: STAGING_PATHS[sourceId], line, sha256: digest(JSON.stringify(value)) };
}
function setup(extras: LocatedRecord[] = []) {
  const entries = selected();
  const records: LocatedRecord[] = entries.map((e: typeof entries[number]) => located(e, e.identity.sourceId, 1)).concat(extras);
  const inputs: InputDigest[] = ['curation/human-l0-compilation.json', 'curation/sources.json', ...Object.values(STAGING_PATHS)]
    .map(path => ({ path: path as InputDigest['path'], bytes: 1, sha256: digest(path) }));
  const result = compileHumanL0(recipe, registry, records.map((r: LocatedRecord) => r.value));
  return { inputs, records, result, report: buildCompilationReport(inputs, records, result.packs, result) };
}

describe('CUR-031 activity 3: compilation accounting and provenance', () => {
  it('accounts for every record with explicit origins and exact included refs', () => {
    const { report, result } = setup([located(outside(), sources[0], 2), located(null, sources[0], 3)]);
    expect(CompilationReportSchema.safeParse(report).success).toBe(true);
    expect(report.counts).toMatchObject({ recordsRead: 4, included: 2, excluded: 2 });
    expect(report.counts.included + report.counts.excluded).toBe(report.counts.recordsRead);
    expect(report.counts.pending).toBe(report.pending.length);
    expect(report.excluded.map(e => e.origin.line)).toEqual([2, 3]);
    expect(report.excluded.map(e => e.reasons)).toEqual([['outside-selection'], ['invalid-staging']]);
    expect(report.included.every(e => e.status === 'needs-review' && e.ref.version === '0.1.1')).toBe(true);
    expect(report.outputs).toEqual({ sha256: result.sha256, files: result.hashes });
    expect(report.outputs.files).toHaveLength(3);
    expect(report.outputs.files.every(f => !f.path.startsWith('reports/'))).toBe(true);
  });

  it('never copies free-form names, text, review reasons or malformed sensitive identifiers', () => {
    const watermark = '(' + 'order #' + '123456' + ')';
    const extra = outside(); extra.name = watermark; extra.originalText = watermark;
    const { report } = setup([located(extra, sources[0], 2), located({ id: watermark, reason: 'PRIVATE INVALID SENTINEL' }, sources[0], 3)]);
    const text = canonicalJson(report);
    expect(text).not.toMatch(/PRIVATE|originalText|excerpt|responsible|rawLabel/);
    expect(text).not.toContain(watermark);
    expect(() => assertSafeArtifact('report.json', text)).not.toThrow();
    expect(Object.keys(report.excluded[1])).toEqual(['origin', 'reasons']);
  });

  it('records all applicable exclusion reasons using stable codes', () => {
    const reference = outside(); reference.stage = 'blocked'; reference.representation = 'reference-only'; reference.originalText = null;
    const restricted = outside(); restricted.review.sourcePermission.status = 'restricted';
    const unresolved = outside(); unresolved.id = null; unresolved.identity = null; unresolved.stage = 'blocked';
    unresolved.source.status = 'pending'; unresolved.source.sourceId = null;
    const foreign = outside(1);
    const { report } = setup([reference, restricted, unresolved, foreign].map((value, i) => located(value, sources[0], i + 2)));
    expect(report.excluded.map(e => e.reasons)).toEqual([
      ['blocked', 'outside-selection', 'reference-only'], ['outside-selection', 'restricted-source'],
      ['blocked', 'outside-selection', 'unresolved-source'], ['outside-selection', 'source-file-mismatch'],
    ]);
  });

  it('reports independent review axes, missing pages and remaining delivery gates', () => {
    const { report } = setup();
    const first = report.included[0].ref;
    const pending = report.pending.filter(p => JSON.stringify(p.ref) === JSON.stringify(first));
    expect(pending.map(p => p.code)).toEqual(['automation-support', 'mechanics-review', 'printed-page', 'source-permission-review', 'structure-review']);
    expect(pending.find(p => p.code === 'automation-support')?.state).toBe('unsupported');
    expect(report.pending.filter(p => p.ref === null).map(p => p.code))
      .toEqual(['content-review', 'mechanical-projection', 'ruleset-integration']);
  });

  it('preserves manual mechanics as pending rather than treating them as implemented', () => {
    const { inputs, records } = setup();
    const entry = records[0].value as ReturnType<typeof selected>[number]; entry.review.mechanics.status = 'manual';
    const result = compileHumanL0(recipe, registry, records.map(r => r.value));
    const report = buildCompilationReport(inputs, records, result.packs, result);
    expect(report.pending.some(p => p.code === 'mechanics-review' && p.state === 'manual')).toBe(true);
  });

  it('is deterministic across caller iteration order without sorting away origin positions', () => {
    const { inputs, records, result, report } = setup([located(outside(), sources[0], 7)]);
    const second = buildCompilationReport([...inputs].reverse(), [...records].reverse(), [...result.packs].reverse(),
      { sha256: result.sha256, hashes: [...result.hashes].reverse() });
    expect(canonicalJson(second)).toBe(canonicalJson(report));
    expect(second.excluded[0].origin.line).toBe(7);
  });

  it('rejects duplicate locations, incomplete input inventory and missing/ambiguous selected origins', () => {
    const { inputs, records, result } = setup();
    expect(() => buildCompilationReport(inputs, [...records, records[0]], result.packs, result)).toThrow(/input locations/);
    expect(() => buildCompilationReport(inputs.slice(1), records, result.packs, result)).toThrow(/input locations/);
    expect(() => buildCompilationReport(inputs, records.slice(1), result.packs, result)).toThrow(/origin missing/);
    expect(() => buildCompilationReport(inputs, [...records, { ...records[0], line: 2 }], result.packs, result)).toThrow(/origin missing or ambiguous/);
  });

  it('rejects a selected record filed under the wrong source instead of certifying its origin', () => {
    const { inputs, records, result } = setup();
    records[0] = { ...records[0], sourceId: sources[1], path: STAGING_PATHS[sources[1]], line: 2 };
    expect(() => buildCompilationReport(inputs, records, result.packs, result)).toThrow(/origin missing/);
  });
});
