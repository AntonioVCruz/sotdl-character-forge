import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { StagingEntrySchema } from '../packages/curation/contracts';
import { sourceLines } from '../tools/curation/ancestry-extractor';
import { buildArtifacts, extractSpells, initialLedger, INPUT, main, parseSpells } from '../tools/curation/spell-extractor';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const text = readFileSync(INPUT, 'utf8'), registry = read('curation/sources.json'), ledger = read('curation/spell-ledger.json');
const origins = read('curation/spell-origins.json'), paths = read('curation/reports/paths.json');
const labels = origins.origins.map((o: { label: string }) => o.label);
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const spell = (name: string, body: string, source = 'Shadow of the Demon Lord Core', extra = '- **Type:** Utility\n- **Source Page:** 115\n') =>
  `#### ${name}\n\n${extra}- **Source:** ${source}\n\n\`\`\`\`text\n${body}\n\`\`\`\`\n`;
function fixtureRegistry(sample: string, originLabels: string[]) {
  const parsed = parseSpells(sample, originLabels), current = structuredClone(registry);
  current.references = current.references.filter((r: { role: string }) => r.role === 'manifest');
  current.pending = [];
  for (const e of parsed) {
    const source = current.sources.find((s: { title: string }) => s.title === e.metadata.Source);
    current.references.push({ path: INPUT, inputSha256: sha(sample), line: e.metadataLines.Source, rawLabel: e.metadata.Source,
      label: e.metadata.Source, role: 'metadata', heading: e.heading, printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: null,
      pdfCoverageDeclared: null, sourceId: source?.id ?? null, resolution: source ? 'normalized-label' : 'pending' });
    if (!source) current.pending.push({ path: INPUT, line: e.metadataLines.Source, label: e.metadata.Source, candidateSourceId: null, reason: 'Fixture unresolved source.' });
  }
  current.reconciliation.metadataReferences = parsed.length; current.reconciliation.totalReferences = current.references.length;
  current.reconciliation.pending = current.pending.length; current.reconciliation.resolved = current.references.length - current.pending.length;
  return current;
}
const fixtureOrigins = (label = 'Air', kind = 'tradition') => ({ schemaVersion: 1, responsible: 'test', origins: [{ label, kind, reason: 'Fixture classification only.' }] });

describe('CUR-010 spell extraction', () => {
  it('inherits origin/rank/name outside fences, resets rank between origins and separates publications', () => {
    const sample = ('# Prelude\n```text\n#### Not a spell\n```\n## Air\n### Rank 0\n' + spell('ONE', '### Rank 9\n## Not an origin\n#### Not a boundary\n```\nBody text') +
      '- **Type:** Attack\n- **Source:** Occult Philosophy\n- **Source Page:** 13\n````text\nSecond publication\n````\n## Magician\n### Rank 1\n' + spell('TWO', 'Text')).replaceAll('\n', '\r\n');
    const parsed = parseSpells(sample, ['Air', 'Magician']);
    expect(parsed.map(p => [p.name, p.origin, p.rank, p.metadata.Source])).toEqual([
      ['ONE', 'Air', 0, 'Shadow of the Demon Lord Core'], ['ONE', 'Air', 0, 'Occult Philosophy'], ['TWO', 'Magician', 1, 'Shadow of the Demon Lord Core']]);
    expect(parsed[0].headingLine).toBe(parsed[1].headingLine);
    expect(parsed[0].originalText).toContain('#### Not a boundary\r\n');
    expect(parsed[0].originalText).not.toContain('Second publication');
    expect(parsed[1].originalText).not.toContain('## Magician');
    expect(() => parseSpells(sample.replace('## Magician\r\n### Rank 1\r\n', '## Magician\r\n'), ['Air', 'Magician'])).toThrow(/without explicit rank/);
  });
  it('fails closed on unclosed/empty blocks, duplicate metadata, missing Source, invalid ranks and unknown groupings', () => {
    const sample = `## Air\n### Rank 0\n${spell('ONE', 'Text')}`;
    expect(() => parseSpells(sample.replace(/````\n$/, ''), ['Air'])).toThrow(/Unclosed/);
    expect(() => parseSpells(sample.replace('- **Source:** Shadow of the Demon Lord Core\n', ''), ['Air'])).toThrow(/Missing Source/);
    expect(() => parseSpells(sample.replace('- **Type:** Utility', '- **Type:** Utility\n- **Type:** Attack'), ['Air'])).toThrow(/Duplicate/);
    expect(() => parseSpells(sample.replace('Rank 0', 'Rank -1'), ['Air'])).toThrow(/Invalid rank/);
    expect(() => parseSpells(sample + '## Unknown\n', ['Air'])).toThrow(/Unregistered/);
    expect(() => parseSpells('# No spells', ['Air'])).toThrow(/No spells/);
    expect(() => parseSpells(sample, ['Air', 'Air'])).toThrow(/Duplicate origin/);
  });
  it('does not infer Type, PDF page, duration or targets when optional metadata/body headers are absent', () => {
    const sample = `## Air\n### Rank 0\n${spell('ONE', 'You deal 1d6 damage.', 'Shadow of the Demon Lord Core', '')}`;
    const entries = parseSpells(sample, ['Air']);
    const result = extractSpells(sample, fixtureRegistry(sample, ['Air']), initialLedger(entries), fixtureOrigins(), paths)[0];
    expect(result.detail.typeDeclared).toBeNull(); expect(result.detail.fieldMarkers).toEqual([]);
    expect(result.staging.printedPage).toBeNull(); expect(result.staging.pdfPageDeclared).toBeNull();
    expect(result.staging.stage).toBe('captured'); expect(result.detail.warnings).toContain('type-not-declared');
    const other = `## Air\n### Rank 0\n${spell('ONE', 'Text', 'Shadow of the Demon Lord Core', '- **Type:** Other explicit category\n')}`;
    expect(parseSpells(other, ['Air'])[0].metadata.Type).toBe('Other explicit category');
  });
  it('keeps unknown publications blocked and preserves original labels/text instead of inventing canonical IDs', () => {
    const sample = `## Air\n### Rank 0\n${spell('ONE', 'Text', 'Unconfirmed book')}`;
    const result = extractSpells(sample, fixtureRegistry(sample, ['Air']), initialLedger(parseSpells(sample, ['Air'])), fixtureOrigins(), paths)[0];
    expect(result.staging).toMatchObject({ id: null, identity: null, stage: 'blocked', source: { status: 'pending', sourceId: null, rawLabel: 'Unconfirmed book' } });
    expect(result.outputPath).toContain('/_pending/spell.jsonl');
    expect(result.staging.originalText).toContain('Unconfirmed book');
  });
  it('accounts for every byte/occurrence and validates all 1520 staging objects and inherited evidence', () => {
    const results = extractSpells(text, registry, ledger, origins, paths), parsed = parseSpells(text, labels), lines = sourceLines(text), inputHash = sha(text);
    expect(results).toHaveLength(1520);
    expect(results.filter(r => r.staging.stage === 'captured')).toHaveLength(1520);
    expect(results.filter(r => r.staging.stage === 'blocked')).toHaveLength(0);
    expect(new Set(results.map(r => r.detail.origin)).size).toBe(57);
    let cursor = 0, reconstructed = '';
    for (const [i, result] of results.entries()) {
      const record = StagingEntrySchema.parse(result.staging);
      expect(record.originalText).toBe(parsed[i].originalText); expect(record.kind).toBe('spell');
      expect(record.review.mechanics.status).toBe('unreviewed'); expect(record.review.automation.status).toBe('unsupported');
      expect(result.detail.startLine).toBeGreaterThanOrEqual(cursor + 1);
      reconstructed += lines.slice(cursor, result.detail.startLine - 1).map(l => l.raw).join('') + record.originalText; cursor = result.detail.endLine;
      for (const evidence of record.review.evidence) {
        expect(evidence.inputSha256).toBe(inputHash);
        expect(evidence.excerpt).toBe(lines.slice(evidence.startLine! - 1, evidence.endLine!).map(l => l.text).join('\n'));
        expect(evidence.excerptSha256).toBe(sha(evidence.excerpt));
      }
      for (const block of result.detail.fullEntryBlocks) expect(block.sha256).toBe(sha(lines.slice(block.startLine - 1, block.endLine).map(l => l.text).join('\n')));
    }
    reconstructed += lines.slice(cursor).map(l => l.raw).join(''); expect(reconstructed).toBe(text);
  });
  it('distinguishes origins/publications, captures user corrections and retains detection of the earlier foreign path introductions', () => {
    const results = extractSpells(text, registry, ledger, origins, paths);
    expect(origins.origins.filter((o: { kind: string }) => o.kind === 'tradition')).toHaveLength(44);
    expect(origins.origins.filter((o: { kind: string }) => o.kind === 'path')).toHaveLength(13);
    const magic = results.find(r => r.staging.name === 'SENSE MAGIC')!;
    expect(magic.detail).toMatchObject({ origin: 'Magician', originKind: 'path', rank: 0 });
    expect(magic.detail.originPathRefs.some(p => p.samePublication)).toBe(true);
    const consecrate = results.find(r => r.staging.name === 'CONSECRATE')!;
    expect(consecrate.staging.stage).toBe('captured');
    expect(consecrate.detail.warnings).toContain('cross-publication-path-link-unreviewed');
    for (const name of ['HEAT WAVE', 'SPELLBOUND WEAPON']) {
      const variants = results.filter(r => r.staging.name === name);
      expect(variants).toHaveLength(2); expect(new Set(variants.map(r => r.staging.id)).size).toBe(2);
    }
    const beforeRoot = 'curation/history/spells-do-we-not-die-2026-10-26/';
    const beforeText = readFileSync(beforeRoot + 'spells.before.md', 'utf8');
    const oldResults = extractSpells(beforeText, read(beforeRoot + 'sources.before.json'), ledger, origins, paths);
    const oldReport = read(beforeRoot + 'spells.before.json');
    for (const [name, foreign, replacement] of [['ANIMATE OBJECT', 'Templar', 'animate-object.txt'], ['SHADOW FORM', 'Thaumaturge', 'shadow-form.txt']]) {
      const result = results.find(r => r.staging.name === name)!;
      expect(result.staging.stage).toBe('captured'); expect(result.detail.foreignPathText).toEqual([]);
      expect(result.staging.originalText).not.toContain(foreign);
      expect(result.staging.id).toBe(oldReport.occurrences.find((e: { name: string }) => e.name === name).entityId);
      const body = result.detail.fullEntryBlocks[0];
      expect(sourceLines(text).slice(body.startLine - 1, body.endLine).map(l => l.raw).join('')).toBe(readFileSync('curation/corrections/spells-do-we-not-die-2026-10-26/' + replacement, 'utf8'));
      const old = oldResults.find(r => r.staging.name === name)!;
      expect(old.staging.stage).toBe('blocked'); expect(old.detail.foreignPathText.some(p => p.pathName === foreign)).toBe(true);
    }
    expect(results.filter(r => !r.staging.id)).toHaveLength(0);
    const resolved = results.filter(r => r.detail.sourceId === 'sotdl:do-we-not-die');
    expect(resolved).toHaveLength(13);
    for (const result of resolved) {
      expect(result.staging.stage).toBe('captured');
      expect(result.staging.id).toMatch(/^sotdl:do-we-not-die:spell:/);
      expect(result.staging.originalText).toBe(oldResults.find(r => r.staging.name === result.staging.name && r.detail.sourceLabel === 'Do We Not Die')!.staging.originalText);
    }
  });
  it('keeps ledger IDs stable after editorial renaming/order changes and rejects missing, duplicate and colliding keys', () => {
    const results = extractSpells(text, registry, ledger, origins, paths);
    expect(extractSpells(text, registry, { ...ledger, entries: [...ledger.entries].reverse() }, origins, paths)).toEqual(results);
    expect(() => extractSpells(text, registry, { ...ledger, entries: ledger.entries.slice(1) }, origins, paths)).toThrow(/Ledger missing/);
    expect(() => extractSpells(text, registry, { ...ledger, entries: [...ledger.entries, ledger.entries[0]] }, origins, paths)).toThrow(/Duplicate ledger/);
    const changed = text.replace('#### SHIMMERING WALL\n', '#### SHIMMERING WALL CORRECTED\n'), updatedLedger = structuredClone(ledger), updatedRegistry = structuredClone(registry);
    updatedLedger.entries[0].heading = '#### SHIMMERING WALL CORRECTED';
    for (const ref of updatedRegistry.references) if (ref.path === INPUT) ref.inputSha256 = sha(changed);
    expect(extractSpells(changed, updatedRegistry, updatedLedger, origins, paths)[0].staging.id).toBe(results[0].staging.id);
    const sample = `## Air\n### Rank 0\n${spell('ONE', 'Text')}${spell('ONE', 'Text')}`;
    expect(() => initialLedger(parseSpells(sample, ['Air']))).toThrow(/collision/);
  });
  it('reproduces all persisted outputs and reports the 27/28 source-count discrepancy without losing records', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    expect(first.report.counts).toMatchObject({ occurrences: 1520, origins: 57, sourceLabels: 28, captured: 1520, blocked: 0, sourcePending: 0, structuralWarnings: 0 });
    expect(first.report.discrepancies).toEqual([expect.objectContaining({ field: 'sourceLabels', declared: 27, observed: 28 })]);
    expect(first.report.coverage.excludedRanges.reduce((sum, r) => sum + r.endLine - r.startLine + 1, 0) + first.report.coverage.occurrenceLines).toBe(33582);
    for (const [path, expected] of first.artifacts) expect(await readFile(path, 'utf8')).toBe(expected);
  });
  it('checks artifacts without overwriting changed data and refuses stale inputs or path evidence', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-spells-'));
    try {
      for (const path of [INPUT, 'rules/SotDL_All_Paths_Compendium_Expanded_All_Project_Sources.md', 'curation/input-manifest.json', 'curation/sources.json', 'curation/source-aliases.json',
        'curation/spell-ledger.json', 'curation/spell-origins.json', 'curation/reports/paths.json', 'tools/curation/spell-extractor.ts', 'tools/curation/spells.mjs', 'tools/curation/ancestry-extractor.ts']) {
        await mkdir(dirname(resolve(root, path)), { recursive: true }); await copyFile(path, resolve(root, path));
      }
      await main(['--write'], root); await main(['--check'], root);
      const target = resolve(root, 'curation/entries/sotdl%3Ado-we-not-die/spell.jsonl'); await writeFile(target, 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, INPUT), text + '\nchanged');
      await expect(main(['--write'], root)).rejects.toThrow(/input changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, INPUT), text);
      await writeFile(resolve(root, 'curation/reports/paths.json'), JSON.stringify({ ...paths, input: { ...paths.input, sha256: '0'.repeat(64) } }));
      await expect(main(['--write'], root)).rejects.toThrow(/Path evidence revision/);
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-spells-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  });
});
