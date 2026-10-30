import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { StagingEntrySchema } from '../packages/curation/contracts';
import { buildArtifacts, extractAncestries, INPUT, main, parseAncestries, sourceLines } from '../tools/curation/ancestry-extractor';

const text = readFileSync(INPUT, 'utf8');
const registry = JSON.parse(readFileSync('curation/sources.json', 'utf8'));
const ledger = JSON.parse(readFileSync('curation/ancestry-ledger.json', 'utf8'));
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const fixture = (name: string, body: string) => `### ${name}\n\n- **Entry Type:** Standard Ancestry\n- **Source:** Example\n- **Source Page:** 1\n- **PDF Page:** 2\n\n\`\`\`\`text\n${body}\n\`\`\`\`\n`;

describe('CUR-008 ancestry extraction', () => {
  it('uses headings outside fences and keeps CRLF, internal tables/levels and notes within the correct occurrence', () => {
    const sample = ('# Intro\n```text\n### Not an entry\n```\n## Ancestries\n' + fixture('One', 'Traits\n### Not a boundary\n```\n1–20 Table outcome\nLevel 4 Expert') + '\n**Errata:** separate note\n\n' + fixture('Two', 'Creating Two')).replaceAll('\n', '\r\n');
    const entries = parseAncestries(sample);
    expect(entries.map(e => e.name)).toEqual(['One', 'Two']);
    expect(entries[0].originalText).toContain('### Not a boundary\r\n');
    expect(entries[0].originalText).toContain('Level 4 Expert');
    expect(entries[0].notes).toHaveLength(1);
    expect(entries[1].originalText).not.toContain('Errata');
    expect(entries[0].endLine + 1).toBe(entries[1].startLine);
    expect(entries[0].bodies).toHaveLength(1);
  });
  it('fails closed on unclosed fences, missing/duplicate metadata, orphan content and absent sections', () => {
    const valid = `## Ancestries\n${fixture('One', 'text')}`;
    expect(() => parseAncestries(valid.replace(/````\n$/, ''))).toThrow(/Unclosed/);
    expect(() => parseAncestries(valid.replace('- **Source Page:** 1\n', ''))).toThrow(/missing Source Page/);
    expect(() => parseAncestries(valid.replace('- **Source:** Example', '- **Source:** Example\n- **Source:** Example'))).toThrow(/Duplicate/);
    expect(() => parseAncestries(valid.replace('## Ancestries\n', '## Ancestries\nOrphan text\n'))).toThrow(/Unassigned/);
    expect(() => parseAncestries('# No ancestry section')).toThrow(/No ancestry/);
  });
  it('captures every original byte after the prelude and validates all 59 staging records/evidence hashes', () => {
    const parsed = parseAncestries(text), lines = sourceLines(text);
    expect(parsed).toHaveLength(59);
    expect(new Set(parsed.map(e => e.name)).size).toBe(45);
    expect(lines.slice(0, parsed[0].startLine - 1).map(l => l.raw).join('') + parsed.map(e => e.originalText).join('')).toBe(text);
    const output = extractAncestries(text, registry, ledger);
    expect(output.filter(r => r.staging.stage === 'captured')).toHaveLength(59);
    expect(output.filter(r => r.staging.stage === 'blocked')).toHaveLength(0);
    const corrected = output.filter(r => ['Bugbear', 'Fomor', 'Incarnation', 'Warg'].includes(r.staging.name));
    expect(corrected).toHaveLength(4);
    const previous = readFileSync('curation/history/source-alias-hunger-in-the-void-2026-10-26/ancestry.before.jsonl', 'utf8').trimEnd().split('\n').map(line => JSON.parse(line));
    for (const r of corrected) {
      expect(r.staging.id).toMatch(/^sotdl:the-hunger-in-the-void:ancestry:/);
      expect(r.staging.source.sourceId).toBe('sotdl:the-hunger-in-the-void');
      expect(r.staging.originalText).toBe(previous.find(p => p.name === r.staging.name).originalText);
    }
    for (const [index, result] of output.entries()) {
      const entry = StagingEntrySchema.parse(result.staging);
      expect(entry.originalText).toBe(parsed[index].originalText);
      const evidence = entry.review.evidence[0];
      expect(evidence.inputSha256).toBe(sha(text));
      expect(evidence.excerpt).toBe(lines.slice(evidence.startLine! - 1, evidence.endLine!).map(l => l.text).join('\n'));
      expect(evidence.excerptSha256).toBe(sha(evidence.excerpt));
      expect(entry.review.mechanics.status).toBe('unreviewed');
      expect(entry.review.automation.status).toBe('unsupported');
      if (!entry.id) {
        expect(entry.identity).toBeNull(); expect(entry.source.sourceId).toBeNull();
        expect(result.detail.candidateSourceId).toBe('sotdl:the-hunger-in-the-void');
        expect(result.outputPath).toContain('/_pending/');
      }
    }
  });
  it('separates Core/expanded/derived/template/powerful ancestries and keeps the Undine errata out of Full Entry', () => {
    const output = extractAncestries(text, registry, ledger);
    for (const name of ['Human', 'Changeling', 'Clockwork', 'Dwarf', 'Goblin', 'Orc']) {
      const variants = output.filter(r => r.staging.name === name);
      expect(variants).toHaveLength(2);
      expect(new Set(variants.map(r => r.staging.id)).size).toBe(2);
    }
    expect(output.filter(r => r.detail.entryType === 'Derived Ancestry')).toHaveLength(6);
    expect(output.filter(r => r.detail.entryType === 'Powerful Ancestry')).toHaveLength(3);
    expect(output.find(r => r.staging.name === 'Skinchanger')?.detail.entryType).toBe('Ancestry Template');
    const human = output.find(r => r.staging.name === 'Human' && r.detail.sourceId?.endsWith('-core'))!;
    expect(human.staging.originalText).toMatch(/Level 4/);
    expect(human.staging.originalText).toMatch(/Human Background/);
    expect(human.staging.originalText).not.toContain('### Incarnation');
    const undine = output.find(r => r.staging.name === 'Undine')!;
    expect(undine.detail.notes).toHaveLength(1);
    expect(undine.detail.notes[0]).toMatchObject({ startLine: 22187, applied: false });
    expect(undine.detail.notes[0].text).toContain('Immune damage');
    const body = undine.detail.fullEntryBlocks[0];
    expect(body.endLine).toBeLessThan(undine.detail.notes[0].startLine);
    expect(sourceLines(text).slice(body.startLine - 1, body.endLine).map(l => l.text).join('\n')).not.toContain('Errata associada');
    expect(output.find(r => r.staging.name === 'Lutin')?.staging.originalText).not.toContain('Lutin Paths');
  });
  it('uses the explicit ledger, rejects collisions and keeps IDs stable after an editorial name correction', () => {
    const original = extractAncestries(text, registry, ledger);
    expect(extractAncestries(text, registry, { ...ledger, entries: [...ledger.entries].reverse() })).toEqual(original);
    expect(() => extractAncestries(text, registry, { ...ledger, entries: [...ledger.entries, ledger.entries[0]] })).toThrow(/Duplicate ledger/);
    expect(() => extractAncestries(text, registry, { ...ledger, entries: ledger.entries.slice(1) })).toThrow(/Ledger missing/);
    const changed = text.replace('### Human — Only Human', '### Human Corrected — Only Human');
    const updatedLedger = structuredClone(ledger);
    updatedLedger.entries.find((e: { heading: string }) => e.heading === '### Human — Only Human').heading = '### Human Corrected — Only Human';
    const updatedRegistry = structuredClone(registry);
    for (const ref of updatedRegistry.references) if (ref.path === INPUT) ref.inputSha256 = sha(changed);
    const result = extractAncestries(changed, updatedRegistry, updatedLedger);
    expect(result.find(r => r.staging.name === 'Human Corrected')?.staging.id).toBe(original.find(r => r.staging.name === 'Human' && r.detail.sourceLabel === 'Only Human')?.staging.id);
  });
  it('reproduces persisted artifacts byte for byte', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    expect(first.report.counts).toMatchObject({ occurrences: 59, names: 45, sourceLabels: 40, resolved: 59, blocked: 0 });
    expect(first.report.coverage).toMatchObject({ inputLines: 23372, occurrenceLines: 23195, trailingNonEntryLines: 0 });
    for (const [path, expected] of first.artifacts) expect(await readFile(path, 'utf8')).toBe(expected);
  });
  it('detects modified outputs and changed input in a scratch workspace without overwriting them during --check', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-ancestries-'));
    try {
      for (const path of ['tools/curation/privacy.mjs', INPUT, 'curation/input-manifest.json', 'curation/sources.json', 'curation/source-aliases.json', 'curation/ancestry-ledger.json', 'tools/curation/ancestry-extractor.ts', 'tools/curation/ancestries.mjs']) {
        await mkdir(dirname(resolve(root, path)), { recursive: true }); await copyFile(path, resolve(root, path));
      }
      await main(['--write'], root); await main(['--check'], root);
      const target = resolve(root, 'curation/entries/sotdl%3Athe-hunger-in-the-void/ancestry.jsonl');
      await writeFile(target, 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/);
      expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, INPUT), text + '\nchanged');
      await expect(main(['--write'], root)).rejects.toThrow(/input changed/);
      expect(await readFile(target, 'utf8')).toBe('tampered\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-ancestries-')) throw new Error('Unexpected scratch directory.');
      await rm(root, { recursive: true, force: true });
    }
  });
});
