import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { StagingEntrySchema } from '../packages/curation/contracts';
import { buildArtifacts, extractPaths, INPUT, main, parsePaths, pathSections } from '../tools/curation/path-extractor';
import { sourceLines } from '../tools/curation/ancestry-extractor';

const text = readFileSync(INPUT, 'utf8');
const registry = JSON.parse(readFileSync('curation/sources.json', 'utf8'));
const ledger = JSON.parse(readFileSync('curation/path-ledger.json', 'utf8'));
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const meta = (type = 'Novice', source = 'Example') => `- **Path Type:** ${type}\n- **Source:** ${source}\n- **Source Page:** 12\n- **PDF Page:** 14\n`;
const entry = (name: string, body: string, type = 'Novice', source = 'Example') => `### ${name}\n${meta(type, source)}\n\`\`\`\`text\n${body}\n\`\`\`\`\n`;

describe('CUR-009 path extraction', () => {
  it('inherits category/name for republications without absorbing adjacent paths or headings inside fences', () => {
    const sample = ('# Prelude\nJotun ancestry progression\n## Novice Paths\n' + entry('One', 'Level 1 One\n### Not a path\n## Not a category\n```\nLevel 2 One') + '\n' + meta('Novice', 'Second source') + '\n````text\nLevel 1 Second One\n````\n## Expert Paths\n' + entry('Two', 'Level 3 Two', 'Expert')).replaceAll('\n', '\r\n');
    const parsed = parsePaths(sample);
    expect(parsed.map(p => [p.name, p.category, p.metadata.Source])).toEqual([['One', 'Novice', 'Example'], ['One', 'Novice', 'Second source'], ['Two', 'Expert', 'Example']]);
    expect(parsed[0].headingLine).toBe(parsed[1].headingLine);
    expect(parsed[1].startLine).not.toBe(parsed[1].headingLine);
    expect(parsed[0].originalText).toContain('### Not a path\r\n');
    expect(parsed[0].originalText).not.toContain('Second source');
    expect(parsed[1].originalText).not.toContain('## Expert Paths');
    expect(parsed.map(e => e.name)).not.toContain('Jotun');
  });
  it('rejects incompatible categories, malformed metadata/fences and unassigned content', () => {
    const sample = `## Novice Paths\n${entry('One', 'Level 1 One')}`;
    expect(() => parsePaths(sample.replace('**Path Type:** Novice', '**Path Type:** Expert'))).toThrow(/mismatch/);
    expect(() => parsePaths(sample.replace('- **PDF Page:** 14\n', ''))).toThrow(/missing PDF Page/);
    expect(() => parsePaths(sample.replace('- **Source:** Example', '- **Source:** Example\n- **Source:** Example'))).toThrow(/Duplicate/);
    expect(() => parsePaths(sample.replace(/````\n$/, ''))).toThrow(/Unclosed/);
    expect(() => parsePaths(`## Novice Paths\nOrphan\n${entry('One', 'text')}`)).toThrow(/Unassigned/);
    expect(() => parsePaths('# No paths\n## Ancestries\n### Jotun')).toThrow(/No path/);
  });
  it('partitions events, talents and explicit level gains without normalizing decorated/joined headings or inventing levels', () => {
    const body = 'Introduction\nOne Events\nd6 Event\n1 Something\nLevel 1 One\nRecovery Talent text\nlevel 8, the damage increases.\nLevel 2\nOne\n<LEVEL 5 ONE\nCharacteristics +1\nLevel8MasterOne\nMore text\nRoguery Talents\nTalent text';
    const sample = `## Novice Paths\n${entry('One', body)}`, parsed = parsePaths(sample)[0];
    const sections = pathSections(parsed, sample);
    expect(sections.map(s => s.kind)).toEqual(['introduction', 'events', 'level-gains', 'level-gains', 'level-gains', 'level-gains', 'talent-list']);
    expect(sections.filter(s => s.kind === 'level-gains').map(s => s.level)).toEqual([1, 2, 5, 8]);
    expect(sections.find(s => s.level === 5)).toMatchObject({ heading: '<LEVEL 5 ONE', recognition: 'decorated', status: 'unreviewed' });
    expect(sections.find(s => s.level === 8)).toMatchObject({ heading: 'Level8MasterOne', recognition: 'joined' });
    const lines = sourceLines(sample), block = parsed.bodies[0];
    expect(sections.map(s => s.rawText).join('')).toBe(lines.slice(block.startLine - 1, block.endLine).map(l => l.raw).join(''));
    const incomplete = `## Novice Paths\n${entry('One', 'Level 1 One\nOnly this level exists')}`;
    expect(pathSections(parsePaths(incomplete)[0], incomplete).filter(s => s.level !== null).map(s => s.level)).toEqual([1]);
    const legendary = `## Legendary Paths\n${entry('Paragon', 'Level 11 and Higher Paragon\nLegendary Talents\nTalent text', 'Legendary')}`;
    expect(pathSections(parsePaths(legendary)[0], legendary).find(s => s.level === 11)?.levelQualifier).toBe('and-higher');
  });
  it('accounts for all 392 occurrences, all bytes and every evidence/section without mixing ancestry progressions', () => {
    const results = extractPaths(text, registry, ledger), parsed = parsePaths(text), lines = sourceLines(text);
    expect(results).toHaveLength(392);
    expect(new Set(results.map(r => JSON.stringify([r.staging.name, r.detail.category]))).size).toBe(380);
    expect(new Set(results.map(r => r.detail.sourceLabel)).size).toBe(59);
    expect(results.filter(r => r.staging.stage === 'captured')).toHaveLength(392);
    expect(results.filter(r => r.staging.stage === 'blocked')).toHaveLength(0);
    const coverage = new Array(lines.length).fill(0);
    for (const [i, r] of results.entries()) {
      StagingEntrySchema.parse(r.staging);
      expect(r.staging.kind).toBe('path'); expect(r.staging.originalText).toBe(parsed[i].originalText);
      expect(r.staging.review.mechanics.status).toBe('unreviewed'); expect(r.staging.review.automation.status).toBe('unsupported');
      for (let n = r.detail.startLine; n <= r.detail.endLine; n++) coverage[n - 1]++;
      for (const evidence of r.staging.review.evidence) {
        expect(evidence.inputSha256).toBe(sha(text));
        expect(evidence.excerpt).toBe(lines.slice(evidence.startLine! - 1, evidence.endLine!).map(l => l.text).join('\n'));
        expect(evidence.excerptSha256).toBe(sha(evidence.excerpt));
      }
      for (const [bodyIndex, block] of r.detail.fullEntryBlocks.entries()) {
        const sections = r.detail.sections.filter(s => s.bodyIndex === bodyIndex);
        expect(sections.map(s => s.rawText).join('')).toBe(lines.slice(block.startLine - 1, block.endLine).map(l => l.raw).join(''));
        for (const s of sections) expect(s.sha256).toBe(sha(s.rawText));
      }
    }
    expect(coverage.every(n => n <= 1)).toBe(true);
    const allRanges = parsed.map(e => ({ ...e, raw: e.originalText }));
    let cursor = 0, reconstructed = '';
    for (const e of allRanges) { reconstructed += lines.slice(cursor, e.startLine - 1).map(l => l.raw).join('') + e.raw; cursor = e.endLine; }
    reconstructed += lines.slice(cursor).map(l => l.raw).join('');
    expect(reconstructed).toBe(text);
    expect(results.some(r => ['Jotun', 'Incarnation', 'Ghoul', 'Centaur'].includes(r.staging.name))).toBe(false);
  });
  it('preserves publication/category identity, source pages, ordinary level schedules and confirmed aliases', () => {
    const results = extractPaths(text, registry, ledger);
    const adepts = results.filter(r => r.staging.name === 'Adept');
    expect(adepts).toHaveLength(2); expect(new Set(adepts.map(r => r.staging.id)).size).toBe(2);
    expect(adepts[0].detail.headingLine).toBe(adepts[1].detail.headingLine);
    expect(adepts[0].staging.printedPage).toBe(21); expect(adepts[0].staging.pdfPageDeclared).toBe('22');
    expect(results.filter(r => r.detail.sourceId === 'sotdl:shadow-of-the-demon-lord-core')).toHaveLength(84);
    const magician = results.find(r => r.staging.name === 'Magician')!;
    expect(magician.detail.levelDiagnostics.detectedLevels).toEqual([1, 2, 5, 8]);
    expect(magician.staging.originalText).not.toContain('### Priest');
    expect(results.find(r => r.staging.name === 'Armiger')?.detail.sections.some(s => s.kind === 'events')).toBe(true);
    const corrected = results.find(r => r.staging.name === 'Priest of the Demon Lord')!;
    expect(corrected.staging.source.sourceId).toBe('sotdl:the-hunger-in-the-void');
    expect(corrected.staging.stage).toBe('captured');
    expect(corrected.detail.sections.find(s => s.level === 8)?.recognition).toBe('joined');
    const seer = results.find(r => r.staging.name === 'Seer')!;
    expect(seer.detail.levelDiagnostics.unexpectedLevels).toEqual([]);
    expect(seer.staging.stage).toBe('captured');
    expect(seer.staging.originalText).not.toContain('Level 6 Juggernaut');
    const before = readFileSync('curation/history/paths-seer-troll-hunter-2026-10-26/paths.before.md', 'utf8');
    const oldSeer = parsePaths(before).find(p => p.name === 'Seer')!;
    expect(seer.staging.originalText).toBe(oldSeer.originalText.replace('Level 6 Juggernaut\n', ''));
    const troll = results.find(r => r.staging.name === 'Troll Hunter')!;
    expect(troll.detail.levelDiagnostics.duplicateLevels).toEqual([]);
    expect(troll.staging.stage).toBe('captured');
    expect(troll.staging.originalText).not.toContain('Level 10 Spellweaver');
    const supplied = readFileSync('curation/corrections/paths-seer-troll-hunter-2026-10-26/troll-hunter.txt', 'utf8');
    const body = troll.detail.fullEntryBlocks[0];
    expect(sourceLines(text).slice(body.startLine - 1, body.endLine).map(l => l.raw).join('')).toBe(supplied);
    const oldReport = JSON.parse(readFileSync('curation/history/paths-seer-troll-hunter-2026-10-26/paths.before.json', 'utf8'));
    for (const result of [seer, troll]) {
      expect(result.staging.id).toBe(oldReport.occurrences.find((p: { name: string }) => p.name === result.staging.name).entityId);
      expect(result.staging.review.mechanics.status).toBe('unreviewed');
    }
    expect(results.filter(r => r.detail.category === 'Expert')).toHaveLength(151);
    expect(results.filter(r => r.detail.category === 'Master')).toHaveLength(197);
    expect(results.filter(r => r.detail.category === 'Legendary')).toHaveLength(2);
  });
  it('uses stable ledger keys and rejects missing/duplicate selectors or colliding IDs', () => {
    const results = extractPaths(text, registry, ledger);
    expect(extractPaths(text, registry, { ...ledger, entries: [...ledger.entries].reverse() })).toEqual(results);
    expect(() => extractPaths(text, registry, { ...ledger, entries: ledger.entries.slice(1) })).toThrow(/Ledger missing/);
    expect(() => extractPaths(text, registry, { ...ledger, entries: [...ledger.entries, ledger.entries[0]] })).toThrow(/Duplicate ledger/);
    const renamed = text.replace('### Magician\n', '### Magician Corrected\n'), updated = structuredClone(ledger), revisedRegistry = structuredClone(registry);
    updated.entries.find((e: { heading: string }) => e.heading === '### Magician').heading = '### Magician Corrected';
    for (const ref of revisedRegistry.references) if (ref.path === INPUT) ref.inputSha256 = sha(renamed);
    expect(extractPaths(renamed, revisedRegistry, updated).find(r => r.staging.name === 'Magician Corrected')?.staging.id).toBe(results.find(r => r.staging.name === 'Magician')?.staging.id);
    const collision = structuredClone(ledger);
    const magician = collision.entries.find((e: { heading: string }) => e.heading === '### Magician');
    const warrior = collision.entries.find((e: { heading: string; rawSource: string }) => e.heading === '### Warrior' && e.rawSource.endsWith('Core'));
    warrior.entryKey = magician.entryKey; warrior.variantKey = magician.variantKey;
    expect(() => extractPaths(text, registry, collision)).toThrow(/Duplicate identity/);
  });
  it('reproduces every persisted file and accounts for category separators', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    expect(first.report.counts).toMatchObject({ occurrences: 392, uniqueNameCategory: 380, sourceLabels: 59, sourceResolved: 392, sourcePending: 0, captured: 392, blocked: 0, missingTypicalLevels: 0 });
    const excluded = first.report.coverage.excludedRanges.reduce((sum, r) => sum + r.endLine - r.startLine + 1, 0);
    expect(excluded + first.report.coverage.occurrenceLines).toBe(29614);
    for (const [path, expected] of first.artifacts) expect(await readFile(path, 'utf8')).toBe(expected);
  });
  it('detects tampered outputs and inputs without overwriting them during check', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-paths-'));
    try {
      for (const path of [INPUT, 'curation/input-manifest.json', 'curation/sources.json', 'curation/source-aliases.json', 'curation/path-ledger.json', 'tools/curation/path-extractor.ts', 'tools/curation/paths.mjs', 'tools/curation/ancestry-extractor.ts']) {
        await mkdir(dirname(resolve(root, path)), { recursive: true }); await copyFile(path, resolve(root, path));
      }
      await main(['--write'], root); await main(['--check'], root);
      const target = resolve(root, 'curation/entries/sotdl%3Athe-hunger-in-the-void/path.jsonl'); await writeFile(target, 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/);
      expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, INPUT), text + '\nchanged');
      await expect(main(['--write'], root)).rejects.toThrow(/input changed/);
      expect(await readFile(target, 'utf8')).toBe('tampered\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-paths-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  });
});
