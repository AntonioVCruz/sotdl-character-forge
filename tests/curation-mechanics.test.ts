import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, basename, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { StagingEntrySchema } from '../packages/curation/contracts';
import { sourceLines } from '../tools/curation/ancestry-extractor';
import { buildArtifacts, extractMechanics, initialLedger, INPUT, main, parseContainers, segmentContainer } from '../tools/curation/mechanics-extractor';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const text = readFileSync(INPUT, 'utf8'), registry = read('curation/sources.json'), ledger = read('curation/mechanics-ledger.json');
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const core = 'Shadow of the Demon Lord Core';
const block = (body: string, section = '## 3. Core — Equipment', coverage = 'PDF pp. 2–4. [BASE][EQUIPAMENTO]', source = core) =>
  `${section}\n\n**Fonte:** *${source}.pdf*\n**Cobertura:** ${coverage}\n\n\`\`\`\`text\n${body}\n\`\`\`\`\n`;
function fixture(sample: string) {
  const lines = sourceLines(sample), containers = parseContainers(sample), current = structuredClone(registry);
  current.references = current.references.filter((r: { role: string }) => r.role === 'manifest'); current.pending = [];
  for (const line of new Set(containers.map(c => c.sourceLine))) {
    for (const match of lines[line - 1].text.matchAll(/\*([^*]+)\.pdf\*/g)) {
      const label = match[1], source = current.sources.find((s: { title: string }) => s.title === label);
      current.references.push({ path: INPUT, inputSha256: sha(sample), line, rawLabel: label, label, role: 'metadata', heading: 'fixture',
        printedPageDeclared: null, pdfPageDeclared: null, pdfCoverageDeclared: null, sourceId: source?.id ?? null, resolution: source ? 'normalized-label' : 'pending' });
      if (!source) current.pending.push({ path: INPUT, line, label, candidateSourceId: null, reason: 'Fixture unresolved publication.' });
    }
  }
  current.reconciliation.metadataReferences = current.references.filter((r: { role: string }) => r.role === 'metadata').length;
  current.reconciliation.totalReferences = current.references.length; current.reconciliation.pending = current.pending.length;
  current.reconciliation.resolved = current.references.length - current.pending.length;
  const units = containers.flatMap(c => segmentContainer(c, lines));
  return { current, units, ledger: initialLedger(units) };
}
const extract = (sample: string) => { const f = fixture(sample); return extractMechanics(sample, f.current, f.ledger); };

describe('CUR-011 mechanics segmentation', () => {
  it('keeps source/subsection context and CRLF outside fences without confusing body headings with metadata', () => {
    const sample = block('Prices\nAll items have prices.\n### Not a subsection\n```\nStill body text').replaceAll('\n', '\r\n');
    const containers = parseContainers(sample);
    expect(containers).toHaveLength(1); expect(containers[0].subsection).toBeNull();
    const lines = sourceLines(sample), units = segmentContainer(containers[0], lines);
    expect(units.map(u => u.originalText).join('')).toBe(lines.slice(containers[0].startLine - 1, containers[0].endLine).map(l => l.raw).join(''));
    expect(units.map(u => u.originalText).join('')).toContain('### Not a subsection\r\n');
    expect(() => parseContainers(sample.replace(/````\r\n$/, ''))).toThrow(/Unclosed/);
    expect(() => parseContainers('## 3. No source\n```text\npayload\n```')).toThrow(/without explicit source/);
    expect(() => parseContainers('# No containers')).toThrow(/No mechanics/);
  });
  it('separates procedures, item descriptions/catalog rows and intact creature stat blocks', () => {
    const sample = block('Prices\nAll items have a price.\nRope\nYou can use this rope to climb.\nRope 1 ss Common\nTorch 1 cp Common\nCart 2 gc Common') +
      block('DEMON DIFFICULTY 10\nSize 1 monster\nPerception 10 (+0)\nDefense 14; Health 10\nAttack Options\nClaws +1 (1d6)\nEnd of the Round\nThe demon heals damage.\nBAT DIFFICULTY 1\nSize 1/4 animal\nPerception 10 (+0)\nDefense 12; Health 2', '## 4. Core — Bestiary', 'PDF pp. 8–9. [BASE][CRIATURA]');
    const { results } = extract(sample), staged = results.flatMap(r => r.staging ? [r.staging] : []);
    expect(staged.find(e => e.name === 'Prices')?.kind).toBe('rule');
    expect(staged.filter(e => e.name === 'Rope' && e.kind === 'item')).toHaveLength(2);
    expect(staged.filter(e => e.kind === 'creature')).toHaveLength(2);
    const demon = staged.find(e => e.name === 'DEMON')!;
    expect(demon.originalText).toContain('Attack Options'); expect(demon.originalText).toContain('Claws +1 (1d6)');
    expect(demon.originalText).toContain('End of the Round'); expect(demon.originalText).not.toContain('BAT DIFFICULTY');
    expect(staged.find(e => e.name === 'Rope' && e.identity?.variantKey === 'catalog-row')?.originalText).toBe('Rope 1 ss Common\n');
    expect(results.find(r => r.segment.name === 'Cart')?.segment.domainCandidates).toContainEqual(expect.objectContaining({ domain: 'vehicle', status: 'unreviewed' }));
  });
  it('captures vertical catalog rows, preserves tables without inventing a DiceExpr and quarantines ambiguous/long context', () => {
    const sample = block('Scroll Case\n\n1 ss\n\nCommon\n\nProfession Types\nd6 Profession\n1 Scholar\n2 Artisan\nMystery Object\nThe owner believes this is useful.');
    const { results } = extract(sample);
    expect(results.find(r => r.staging?.name === 'Scroll Case')?.staging?.kind).toBe('item');
    const table = results.find(r => r.segment.category === 'table')!;
    expect(table.staging).toBeNull(); expect(table.segment.originalText).toContain('d6 Profession');
    expect(results.some(r => r.segment.category === 'unclassified' && !r.staging)).toBe(true);
    const long = block(Array.from({ length: 400 }, (_, i) => `unclassified prose line ${i}`).join('\n'));
    const longResult = extract(long);
    expect(longResult.results.filter(r => r.staging)).toHaveLength(0);
    expect(longResult.results.length).toBeGreaterThan(1);
    expect(longResult.results.map(r => r.segment.originalText).join('')).toContain('unclassified prose line 399');
  });
  it('does not leak optional/regional/dependency flags to other blocks or turn PDF coverage into printed pages', () => {
    const sample = block('Starting Professions\nYou begin with two professions.', '## 3. Local Creation', 'PDF pp. 2–3. [BASE][OPCIONAL][REGIONAL][DEPENDÊNCIA OMITIDA]') +
      block('Starting Professions\nYou begin with a profession.', '## 4. Core Creation', 'PDF p. 4. [BASE]');
    const staged = extract(sample).results.flatMap(r => r.staging ? [r.staging] : []);
    expect(staged[0]).toMatchObject({ stage: 'blocked', printedPage: null, region: null });
    expect(staged[0].scopeTags).toEqual(['BASE', 'OPCIONAL', 'REGIONAL', 'DEPENDÊNCIA OMITIDA']);
    expect(staged[1].scopeTags).toEqual(['BASE']); expect(staged[1].stage).toBe('captured');
    const pageSample = block('--- PDF p. 2 ---\nStarting Professions\nYou begin with two professions.\n--- PDF p. 3 ---\ncontinuation', '## 3. Core Creation', 'PDF pp. 2–3. [BASE]');
    const pages = extract(pageSample).results.find(r => r.staging)?.staging!;
    expect(pages.printedPage).toBeNull(); expect(pages.pdfPageDeclared).toBe('2; 3');
    expect(pages.review.evidence.every(e => e.physicalPdfPage === null)).toBe(true);
  });
  it('blocks joint errata attribution and unknown publications without selecting a source implicitly', () => {
    const sample = block('Shadow of the Demon Lord — Crawl (core p. 47)\nYou crawl at half your Speed.', '## 87. Errata', 'PDFs pp. 1–3. [BASE]')
      .replace(`**Fonte:** *${core}.pdf*`, '**Fontes:** *Demon Lord Errata (19nov17).pdf* e *Demon Lord Errata (10oct17).pdf*');
    const result = extract(sample).results.find(r => r.staging)!;
    expect(result.segment.sources).toHaveLength(2);
    expect(result.segment.warnings).toContain('multiple-source-attribution-unresolved');
    expect(result.staging).toMatchObject({ id: null, identity: null, stage: 'blocked', source: { status: 'pending', sourceId: null } });
    const unresolved = extract(block('Starting Professions\nYou begin with a profession.', '## 3. Creation', '[BASE]', 'Unknown publication')).results.find(r => r.staging)!;
    expect(unresolved.staging?.id).toBeNull(); expect(unresolved.segment.warnings).toContain('unresolved-source');
  });
  it('quarantines indistinguishable duplicates and blocks suspiciously long stat blocks without truncating traits', () => {
    const duplicates = block('Starting Professions\nYou begin with a profession.') + block('Starting Professions\nYou begin with a profession.');
    const repeated = extract(duplicates).results;
    expect(repeated.every(r => !r.staging && r.segment.warnings.includes('indistinguishable-duplicate-needs-discriminator'))).toBe(true);
    const body = 'DEMON DIFFICULTY 10\nSize 1 monster\nDefense 12; Health 10\n' + Array.from({ length: 200 }, (_, i) => `trait description ${i}`).join('\n');
    const long = extract(block(body, '## 3. Bestiary', '[CRIATURA]')).results.find(r => r.staging)!;
    expect(long.staging?.stage).toBe('blocked'); expect(long.segment.warnings).toContain('long-stat-block-boundaries-review-required');
    expect(long.staging?.originalText).toContain('trait description 199');
  });
  it('validates every real staged object and accounts for all payload bytes, evidence, sources and quarantined fragments', () => {
    const { results, containers } = extractMechanics(text, registry, ledger), lines = sourceLines(text), inputHash = sha(text);
    expect(containers).toHaveLength(117); expect(results).toHaveLength(3589);
    expect(results.filter(r => r.staging)).toHaveLength(2191);
    const ownership = new Uint8Array(lines.length);
    for (const r of results) {
      const s = r.segment;
      expect(s.originalText).toBe(lines.slice(s.startLine - 1, s.endLine).map(l => l.raw).join(''));
      for (let n = s.startLine; n <= s.endLine; n++) ownership[n - 1]++;
      expect(s.evidence.inputSha256).toBe(inputHash);
      expect(s.evidence.excerptSha256).toBe(sha(s.evidence.excerpt));
      expect(s.sources.length).toBeGreaterThan(0);
      if (r.staging) {
        const staged = StagingEntrySchema.parse(r.staging);
        expect(['rule', 'item', 'creature']).toContain(staged.kind);
        expect(staged.printedPage).toBeNull(); expect(staged.review.mechanics.status).toBe('unreviewed'); expect(staged.review.automation.status).toBe('unsupported');
        if (staged.kind === 'rule') expect(s.endLine - s.startLine + 1).toBeLessThanOrEqual(180);
        for (const e of staged.review.evidence) {
          expect(e.inputSha256).toBe(inputHash);
          expect(e.excerpt).toBe(lines.slice(e.startLine! - 1, e.endLine!).map(l => l.text).join('\n'));
          expect(e.excerptSha256).toBe(sha(e.excerpt));
        }
      }
    }
    expect([...ownership].every(n => n <= 1)).toBe(true);
    for (const c of containers) expect(results.filter(r => r.segment.container.startLine === c.startLine).map(r => r.segment.originalText).join(''))
      .toBe(lines.slice(c.startLine - 1, c.endLine).map(l => l.raw).join(''));
    expect(results.filter(r => r.staging && r.segment.subtype === 'errata-correction')).toHaveLength(14);
    expect(results.filter(r => r.segment.subtype === 'errata-correction').every(r => r.staging?.stage === 'blocked')).toBe(true);
    expect(results.some(r => r.staging?.name === 'Starting Professions')).toBe(true);
  });
  it('preserves ledger identity independent of read order and rejects unreviewed selector changes/collisions', () => {
    const sample = block('Starting Professions\nYou begin with a profession.\nLanguages\nYou can learn a language.', '## 3. Creation', '[BASE]');
    const f = fixture(sample), first = extractMechanics(sample, f.current, f.ledger);
    expect(extractMechanics(sample, f.current, { ...f.ledger, entries: [...f.ledger.entries].reverse() })).toEqual(first);
    expect(() => extractMechanics(sample, f.current, { ...f.ledger, entries: [] })).toThrow(/selector changed/);
    expect(() => extractMechanics(sample, f.current, { ...f.ledger, entries: [...f.ledger.entries, f.ledger.entries[0]] })).toThrow(/Duplicate ledger/);
    const editedLedger = structuredClone(f.ledger); editedLedger.entries[0].selector += 'changed';
    expect(() => extractMechanics(sample, f.current, editedLedger)).toThrow(/selector changed/);
  });
  it('resolves only the explicitly reviewed standalone creature and rejects stale or unused decisions', () => {
    const decisions = read('curation/mechanics-decisions.json');
    decisions.decisions = decisions.decisions.filter((d: { resolution: string }) => d.resolution === 'standalone-creature');
    const baseline = extractMechanics(text, registry, ledger);
    const reviewed = extractMechanics(text, registry, ledger, decisions);
    const before = baseline.results.find(r => r.segment.unitKey === 'u002901')!;
    const after = reviewed.results.find(r => r.segment.unitKey === 'u002901')!;
    expect(before.staging?.stage).toBe('blocked'); expect(after.staging?.stage).toBe('captured');
    expect(after.staging?.id).toBe(before.staging?.id); expect(after.staging?.originalText).toBe(before.staging?.originalText);
    expect(after.segment.scopeTags).toContain('DEPENDÊNCIA OMITIDA');
    expect(after.segment.dependencyResolution?.resolution).toBe('standalone-creature');
    expect(after.staging?.review.mechanics.status).toBe('unreviewed');
    expect(after.staging?.review.mechanics.reason).toContain('Raven Rider');
    expect(reviewed.results.filter((r, i) => r.segment.status !== baseline.results[i].segment.status)).toHaveLength(1);
    const stale = structuredClone(decisions); stale.decisions[0].originalTextSha256 = '0'.repeat(64);
    expect(() => extractMechanics(text, registry, ledger, stale)).toThrow(/decision evidence mismatch/);
    const unused = structuredClone(decisions); unused.decisions[0].unitKey = 'u999999';
    expect(() => extractMechanics(text, registry, ledger, unused)).toThrow(/Unused mechanics decision/);
  });
  it('selects the newest jointly attributed errata and preserves raw references without changing existing identities', () => {
    const decisions = read('curation/mechanics-decisions.json');
    const baseline = extractMechanics(text, registry, ledger);
    const reviewed = extractMechanics(text, registry, ledger, decisions);
    const selected = reviewed.results.filter(r => r.segment.attributionResolution);
    expect(selected).toHaveLength(14);
    for (const result of selected) {
      const before = baseline.results.find(r => r.segment.unitKey === result.segment.unitKey)!;
      expect(result.staging?.source.sourceId).toBe('sotdl:demon-lord-errata-19nov17');
      expect(result.staging?.id).toMatch(/^sotdl:demon-lord-errata-19nov17:rule:/);
      expect(result.staging?.stage).toBe('captured');
      expect(result.segment.sources).toEqual(before.segment.sources); expect(result.segment.sources).toHaveLength(2);
      expect(result.staging?.originalText).toBe(before.staging?.originalText);
      expect(result.staging?.review.mechanics.status).toBe('unreviewed');
    }
    for (const before of baseline.results.filter(r => r.segment.entityId)) {
      expect(reviewed.results.find(r => r.segment.unitKey === before.segment.unitKey)?.segment.entityId).toBe(before.segment.entityId);
    }
    const older = structuredClone(decisions); older.decisions.find((d: { resolution: string }) => d.resolution === 'latest-source').sourceId = 'sotdl:demon-lord-errata-10oct17';
    expect(() => extractMechanics(text, registry, ledger, older)).toThrow(/uniquely newest/);
    const undated = structuredClone(registry); undated.sources.find((s: { id: string }) => s.id === 'sotdl:demon-lord-errata-19nov17').revision = null;
    expect(() => extractMechanics(text, undated, ledger, decisions)).toThrow(/comparable revision dates/);
  });
  it('reproduces all persisted outputs and gives every input line one explicit destination', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    expect(first.report.counts).toMatchObject({ containers: 117, segments: 3589, staged: 2191, captured: 1961, blocked: 230, quarantined: 1320, layout: 78 });
    expect(first.report.coverage.payloadLines).toBe(63791); expect(first.report.coverage.segmentLines).toBe(63791);
    const excluded = first.report.coverage.excludedRanges.reduce((sum, r) => sum + r.endLine - r.startLine + 1, 0);
    expect(excluded + first.report.coverage.segmentLines).toBe(65057);
    for (const [path, expected] of first.artifacts) expect(await readFile(path, 'utf8')).toBe(expected);
  });
  it('detects tampered outputs and stale input without overwriting data during check', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-mechanics-'));
    try {
      for (const path of ['tools/curation/privacy.mjs', INPUT, 'curation/input-manifest.json', 'curation/sources.json', 'curation/source-aliases.json', 'curation/mechanics-ledger.json', 'curation/mechanics-decisions.json',
        'tools/curation/mechanics-extractor.ts', 'tools/curation/mechanics.mjs', 'tools/curation/ancestry-extractor.ts']) {
        await mkdir(dirname(resolve(root, path)), { recursive: true }); await copyFile(path, resolve(root, path));
      }
      await main(['--write'], root); await main(['--check'], root);
      const target = resolve(root, 'curation/segments/mechanics.jsonl'); await writeFile(target, 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, INPUT), text + '\nchanged');
      await expect(main(['--write'], root)).rejects.toThrow(/input changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-mechanics-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  });
});
