import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, basename, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { auditCoverage, scanStructure, sourceDeclarations, buildArtifacts, main } from '../tools/curation/reconciler';

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const json = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const rows = (path: string) => readFileSync(path, 'utf8').trimEnd().split('\n').filter(Boolean).map(l => JSON.parse(l));

describe('CUR-013 corpus reconciliation', () => {
  it('rejects coverage gaps, overlaps, invalid ranges and unexplained destinations independently of totals', () => {
    const first = { startLine: 1, endLine: 2, destination: 'staging', reason: 'Captured' };
    const last = { startLine: 3, endLine: 5, destination: 'context', reason: 'Source header' };
    expect(auditCoverage(5, [last, first])).toMatchObject({ coveredLines: 5, gaps: 0, overlaps: 0 });
    expect(() => auditCoverage(5, [first, { ...last, startLine: 4 }])).toThrow(/gap/);
    expect(() => auditCoverage(5, [first, { ...last, startLine: 2 }])).toThrow(/overlap/);
    expect(() => auditCoverage(5, [{ ...first, endLine: 6 }])).toThrow(/Invalid/);
    expect(() => auditCoverage(5, [{ ...first, reason: '' }, last])).toThrow(/Invalid/);
    expect(() => auditCoverage(6, [first, last])).toThrow(/gap/);
  });
  it('distinguishes actual headings/metadata/fences from examples and parses source lists only in their declared scope', () => {
    const text = '# Intro\r\n```text\r\n### False\r\n- **Source:** False\r\n```\r\n### Fontes com entradas de ancestry\r\n- **Actual** — 2 entrada(s)\r\n````text\r\n- **False** — 99 entradas\r\n```\r\n````\r\n### Fontes fornecidas sem nova entrada formal de ancestry\r\n- Other.pdf\r\n## Ancestries\r\n### Actual\r\n- **Source:** Actual\r\n';
    const structure = scanStructure(text);
    expect(structure.sources.map(s => s.label)).toEqual(['Actual']);
    expect(structure.headings.some(h => h.text === 'False')).toBe(false);
    expect(structure.fences).toHaveLength(2);
    expect(sourceDeclarations(text, 15)).toEqual([
      { line: 7, label: 'Actual', expected: 2, scope: 'formal-count' },
      { line: 13, label: 'Other', expected: 0, scope: 'no-formal-entry' },
    ]);
    expect(() => scanStructure('```text\nnever closed')).toThrow(/Unclosed/);
  });
  it('matches real declared counts while retaining the source-summary discrepancy and Adept inherited heading', () => {
    const report = json('curation/reports/reconciliation.json'), checks = report.countChecks;
    expect(report.reviewDate).toBe('2026-10-27'); expect(report.inputReviewDate).toBe('2026-10-26');
    expect(checks).toHaveLength(22);
    expect(checks.filter((c: { status: string }) => c.status === 'open-discrepancy')).toEqual([
      expect.objectContaining({ corpus: 'spells', metric: 'publication-labels', declared: 27, observed: 28 }),
    ]);
    const findings = rows('curation/reconciliation/findings.jsonl');
    expect(findings.find(f => f.id === 'headings:paths').reason).toContain('391 explicit name headings + 1 inherited headings = 392');
    const inherited = findings.find(f => f.id === 'headings:paths').references;
    expect(inherited).toEqual([expect.objectContaining({ name: 'Adept', headingLine: 168, startLine: 251 })]);
    expect(findings.filter(f => f.category === 'publication-not-listed-in-scope-summary')).toEqual([
      expect.objectContaining({ id: 'unlisted-publication:ancestries:sotdl:path-of-the-adept', status: 'open' }),
    ]);
  });
  it('maps every input line and staging record exactly once without promoting quarantine, shared errata or reviews', () => {
    const report = json('curation/reports/reconciliation.json'), inventory = rows('curation/reconciliation/inventory.jsonl'), coverage = rows('curation/reconciliation/coverage.jsonl');
    expect(report.counts).toMatchObject({ lines: 151625, inventoryRecords: 5560, staged: 4162, uniqueNonNullEntityIds: 4162, publications: 95 });
    expect(report.counts.states).toEqual({ blocked: 230, captured: 3932, layout: 78, quarantined: 1320 });
    const manifest = json('curation/input-manifest.json');
    for (const file of manifest.files) {
      expect(auditCoverage(file.lines, coverage.filter(c => c.path === file.path))).toMatchObject({ gaps: 0, overlaps: 0, coveredLines: file.lines });
      expect(coverage.filter(c => c.path === file.path).every(c => c.inputSha256 === file.sha256)).toBe(true);
    }
    expect(inventory.filter(o => o.stageReference)).toHaveLength(4162);
    expect(new Set(inventory.map(o => o.id)).size).toBe(inventory.length);
    const shared = inventory.filter(o => o.attribution === 'shared');
    expect(shared).toHaveLength(0);
    const resolved = inventory.filter(o => o.attributionResolution);
    expect(resolved).toHaveLength(14);
    expect(resolved.every(o => o.entityId !== null && o.state === 'captured' && o.sourceIds.length === 1 && o.originalSourceIds.length === 2)).toBe(true);
    expect(report.gates.statusesPromoted).toBe(false); expect(report.gates.rawInputsModified).toBe(false);
    expect(inventory.filter(o => o.state === 'quarantined').every(o => o.stageReference === null)).toBe(true);
  });
  it('accounts for confirmed aliases and scope exclusions while preserving independent blockers', () => {
    const matrix = json('curation/reconciliation/sources.json');
    expect(matrix.publications).toHaveLength(95); expect(matrix.sourceListDeclarations).toHaveLength(189);
    expect(matrix.sourceListDeclarations.filter((d: { status: string }) => d.status === 'open-discrepancy')).toEqual([]);
    const oddities = matrix.publications.find((p: { sourceId: string }) => p.sourceId === 'sotdl:oddities-artifacts-and-esoterica');
    expect(oddities.observedByCorpus).toEqual({ mechanics: 31 }); expect(oddities.pendingRecordCandidates).toEqual([]);
    const inventory = rows('curation/reconciliation/inventory.jsonl');
    const giant = inventory.find(r => r.name === 'GIANT RAVEN');
    expect(giant.sourceIds).toEqual(['sotdl:heaven-s-sent']); expect(giant.entityId).toBe('sotdl:heaven-s-sent:creature:u002901:stat-block');
    expect(giant.state).toBe('captured'); expect(giant.warnings).toEqual([]);
    const errata = matrix.publications.find((p: { sourceId: string }) => p.sourceId === 'sotdl:demon-lord-errata-19nov17');
    expect(errata.sharedAttributionRecords).toBe(0); expect(errata.observedByCorpus).toEqual({ mechanics: 14 });
    for (const p of matrix.publications) {
      expect(p.declaration.incorporated.length).toBeGreaterThan(0); expect(p.declaration.excluded.length).toBeGreaterThan(0);
      expect(p.declaration.status).toBe('declared-in-md-not-pdf-audit'); expect(p.editionStatus).toBe('unconfirmed');
    }
    expect(rows('curation/reconciliation/findings.jsonl').filter(f => f.category === 'pending-source-alias')).toHaveLength(0);
  });
  it('preserves same-name publications, exact-text candidates and every ambiguous duplicate instead of merging identities', () => {
    const groups = rows('curation/reconciliation/duplicates.jsonl'), inventory = rows('curation/reconciliation/inventory.jsonl');
    const byId = new Map(inventory.map(o => [o.id, o]));
    expect(groups).toHaveLength(509);
    expect(groups.filter(g => g.category === 'indistinguishable-segment')).toHaveLength(11);
    expect(groups.filter(g => g.category === 'indistinguishable-segment').reduce((sum, g) => sum + g.count, 0)).toBe(33);
    const heat = inventory.filter(o => o.kind === 'spell' && o.name === 'HEAT WAVE');
    expect(heat).toHaveLength(2); expect(new Set(heat.map(o => o.entityId)).size).toBe(2);
    for (const group of groups) {
      expect(group.action).toBe('preserve-all-occurrences-no-content-merge-or-equivalence-certification');
      expect(group.references).toHaveLength(group.count);
      for (const ref of group.references) expect(byId.has(ref.inventoryId)).toBe(true);
    }
  });
  it('accounts for all normalization changes/overlays and summarizes editorial signals without creating entity failures', () => {
    const report = json('curation/reports/reconciliation.json');
    expect(report.counts).toMatchObject({ normalizationChangesAccounted: 2216, overlaysAccounted: 656, editorialReviewSignals: 28971 });
    expect(report.gates.normalizationReversible).toBe(true); expect(report.gates.noChangeWithoutOverlay).toBe(true);
    const findings = rows('curation/reconciliation/findings.jsonl').filter(f => f.category === 'editorial-review');
    expect(findings).toHaveLength(11); expect(findings.reduce((sum, f) => sum + f.count, 0)).toBe(28971);
    expect(findings.every(f => f.status === 'open')).toBe(true);
  });
  it('reproduces artifacts and verifies dependency hashes before declaring the reconciliation complete', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    for (const [path, expected] of first.artifacts) expect(await readFile(path, 'utf8')).toBe(expected);
    for (const ref of first.report.inputRefs) expect(sha(readFileSync(ref.path))).toBe(ref.sha256);
  }, 25000);
  it('refuses tampered input/output and never overwrites them during check', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-reconciliation-'));
    try {
      const snapshot = json('curation/reports/reconciliation.json');
      for (const ref of snapshot.inputRefs) { await mkdir(dirname(resolve(root, ref.path)), { recursive: true }); await copyFile(ref.path, resolve(root, ref.path)); }
      await main(['--write'], root); await main(['--check'], root);
      const target = resolve(root, 'curation/reconciliation/coverage.jsonl'); await writeFile(target, 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
      const manifest = json('curation/input-manifest.json'); await writeFile(resolve(root, manifest.files[0].path), 'changed input');
      await expect(main(['--write'], root)).rejects.toThrow(/Input changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-reconciliation-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  }, 30000);
});
