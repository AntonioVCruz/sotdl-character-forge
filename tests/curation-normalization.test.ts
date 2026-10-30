import { sanitizeArtifact } from '../tools/curation/privacy.mjs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, basename, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { normalizeDocument, replayChanges, buildArtifacts, main, NormalizationOverlaySchema } from '../tools/curation/editorial-normalizer';
import { StagingEntrySchema } from '../packages/curation/contracts';
import { sourceLines } from '../tools/curation/ancestry-extractor';

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const json = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const orderId = ['1234', '5678'].join('');
const buyer = ['Synthetic Buyer', `(order #${orderId})`].join(' ');
const payload = (text: string) => '```text\n' + text + '\n```\n';

describe('CUR-012 reversible editorial normalization', () => {
  it('expands only presentation ligatures and preserves numeric data, fractions, dashes, bullets and NBSP', () => {
    const raw = 'ﬀ ﬁ ﬂ ﬃ ﬄ ﬅ ﬆ 3d6 1–20 –6 +2 1/2 ½ −3 cp • \u00a0';
    const result = normalizeDocument(payload(raw), 'rules/test.md');
    expect(result.normalizedText).toContain('ff fi fl ffi ffl st st 3d6 1–20 –6 +2 1/2 ½ −3 cp • \u00a0');
    expect(result.inventory.ligaturesExpanded).toBe(7);
    expect(result.inventory.standardBulletsPreserved).toBe(1); expect(result.inventory.nonBreakingSpacesPreserved).toBe(1);
    expect(replayChanges(result.normalizedText, result.changes, true)).toBe(payload(raw));
    expect(normalizeDocument(result.normalizedText, 'rules/test.md').changes).toEqual([]);
  });
  it('redacts buyer lines inside and outside fences while retaining line endings and game text', () => {
    const text = `${buyer}\r\n# Metadata ﬁ\r\n\`\`\`\`text\r\n${buyer}\r\nRoll order #${orderId} for a result.\r\n\`\`\`\r\nBody\r\n\`\`\`\`\r\n`;
    const result = normalizeDocument(text, 'rules/test.md');
    expect(result.inventory.watermarksRemoved).toBe(2);
    expect(result.normalizedText).toContain(`# Metadata ﬁ\r\n\`\`\`\`text\r\n\r\nRoll order #${orderId} for a result.`);
    expect(result.normalizedText.startsWith('\r\n')).toBe(true);
    expect(sourceLines(result.normalizedText)).toHaveLength(sourceLines(text).length);
    expect(replayChanges(result.normalizedText, result.changes, true, text)).toBe(text);
    expect(result.changes.every(c => c.beforeSha256)).toBe(true);
  });
  it('reverses EOF removal and guards Unicode column/byte offsets, mixed line endings and diff context', () => {
    const text = '```text\r\n😀 ﬃ 3d6\rﬁ\n```';
    const result = normalizeDocument(text, 'rules/test.md');
    expect(result.changes[0].sourceByteOffset).toBe(Buffer.byteLength('```text\r\n'));
    expect(result.changes[0].originalCodeUnitColumns).toEqual([4]);
    expect(replayChanges(result.normalizedText, result.changes, true, text)).toBe(text);
    const change = { ...result.changes[0], line: 1, before: '[buyer watermark redacted]', beforeSha256: sha(buyer), inputSha256: sha(buyer), after: '', eol: '', rules: ['remove-buyer-watermark-line'] };
    expect(replayChanges('', [change], true, buyer)).toBe(buyer);
    expect(() => replayChanges('tampered', result.changes)).toThrow(/context mismatch/);
    expect(() => replayChanges(text, [result.changes[0], result.changes[0]])).toThrow(/Duplicate/);
    expect(() => normalizeDocument('```text\nnever closed', 'rules/test.md')).toThrow(/Unclosed/);
  });
  it('diagnoses ambiguous numbers, hyphenation, columns, headers, encoding and duplicate lines without repairing them', () => {
    const raw = '1\n3d6\n10–20\nall-\nconsuming\nﬁ rst\n1 Architecture 11 Magic\nItem\nPrice\nAvailability\nEquipment\n---\nEquipment\n---\nEquipment\n� \ue000 \u00ad\nSame line\nSame line';
    const result = normalizeDocument(payload(raw), 'rules/test.md');
    const kinds = result.diagnostics.map(d => d.kind);
    for (const kind of ['isolated-number', 'line-end-hyphenation', 'possible-multiple-columns', 'vertical-columns', 'repeated-heading-near-page-break', 'encoding-or-replacement-character', 'control-or-private-glyph', 'invisible-or-soft-hyphen', 'adjacent-duplicate-line']) expect(kinds).toContain(kind);
    expect(result.normalizedText).toContain('1\n3d6\n10–20\nall-\nconsuming');
    expect(result.normalizedText).toContain('fi rst'); expect(result.normalizedText).toContain('� \ue000 \u00ad');
    expect(result.changes.every(c => c.rules[0] === 'expand-latin-ligatures')).toBe(true);
    expect(normalizeDocument(payload('a fi rst fragment'), 'rules/test.md').diagnostics.some(d => d.kind === 'split-letter-sequence')).toBe(true);
  });
  it('preserves each real MD byte via forward/reverse diffs and leaves all mechanical numeric tokens intact', () => {
    const manifest = json('curation/input-manifest.json'); let expanded = 0, watermarks = 0;
    for (const file of manifest.files) {
      const bytes = readFileSync(file.path); expect(sha(bytes)).toBe(file.sha256);
      const original = bytes.toString('utf8'), result = normalizeDocument(original, file.path);
      expect(replayChanges(original, result.changes)).toBe(result.normalizedText);
      expect(Buffer.from(replayChanges(result.normalizedText, result.changes, true, original)).equals(bytes)).toBe(true);
      expect(normalizeDocument(result.normalizedText, file.path).changes).toEqual([]);
      const watermarkLines = new Set(result.changes.filter(c => c.rules.includes('remove-buyer-watermark-line')).map(c => c.line));
      const withoutWatermarks = sourceLines(original).map((l, i) => watermarkLines.has(i + 1) ? l.raw.slice(l.text.length) : l.raw).join('');
      const numbers = (s: string) => s.match(/[+\-−–]?\d+(?:[.,/]\d+)?/g) ?? [];
      expect(numbers(result.normalizedText)).toEqual(numbers(withoutWatermarks));
      expanded += result.inventory.ligaturesExpanded; watermarks += result.inventory.watermarksRemoved;
    }
    expect(expanded).toBe(2275); expect(watermarks).toBe(53);
  }, 20000);
  it('reproduces all artifacts and ties each overlay to immutable raw evidence and exact line changes', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    expect(first.report.counts).toMatchObject({ documents: 4, changedLines: 2216, ligaturesExpanded: 2275, watermarksRemoved: 53, stagedRecords: 4162, segmentRecords: 3589, overlays: 656 });
    expect(first.report.policy).toMatchObject({ rawInputsModified: false, stagingModified: false, mechanicalReviewPromoted: false });
    for (const [path, expected] of first.artifacts) expect(await readFile(path, 'utf8')).toBe(expected);
    const allChanges = first.artifacts.get('curation/normalization/changes.jsonl')!.trimEnd().split('\n').map(l => JSON.parse(l));
    const ids = new Set(allChanges.map(c => c.id));
    const overlays = first.artifacts.get('curation/normalization/overlays.jsonl')!.trimEnd().split('\n').map(l => JSON.parse(l));
    const cache = new Map<string, string[]>();
    for (const overlay of overlays) {
      NormalizationOverlaySchema.parse(overlay);
      if (!cache.has(overlay.reference.path)) cache.set(overlay.reference.path, readFileSync(overlay.reference.path, 'utf8').trimEnd().split('\n'));
      const raw = JSON.parse(cache.get(overlay.reference.path)![overlay.reference.record - 1]);
      expect(sha(raw.originalText)).toBe(overlay.originalTextSha256);
      expect(sha(overlay.normalizedText)).toBe(overlay.normalizedTextSha256);
      expect(overlay.appliedToStaging).toBe(false); expect(overlay.status).toBe('editorial-only');
      expect(overlay.changeRefs.changeIds.every((id: string) => ids.has(id))).toBe(true);
      expect(overlay.normalizationDiffRef).toContain(overlay.id);
      if (overlay.origin === 'staging') {
        const view = StagingEntrySchema.parse({ ...raw, normalizedText: overlay.normalizedText, normalizationDiffRef: overlay.normalizationDiffRef });
        expect(view.review).toEqual(raw.review); expect(view.id).toBe(raw.id);
      }
    }
    for (const ref of first.report.inputRefs) expect(sha(readFileSync(ref.path))).toBe(ref.sha256);
  }, 20000);
  it('keeps malformed/stale input and tampered output from overwriting the derived corpus', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-normalization-'));
    try {
      const path = 'rules/a.md', sample = payload(`ﬁ 3d6\n${buyer}`), lines = sourceLines(sample);
      const manifest = json('curation/input-manifest.json'), entry = json('curation/examples/staging.json');
      const file = { ...manifest.files[0], path, bytes: Buffer.byteLength(sample), lines: lines.length, sha256: sha(sample), revisionId: `sha256:${sha(sample)}`, title: '```text' };
      manifest.files = [file];
      entry.originalText = lines.slice(1, 3).map(l => l.raw).join('');
      Object.assign(entry.review.evidence[0], { path, inputSha256: sha(sample), startLine: 2, endLine: 3, excerpt: lines.slice(1, 3).map(l => l.text).join('\n') });
      entry.review.evidence[0].excerptSha256 = sha(entry.review.evidence[0].excerpt);
      Object.assign(entry, sanitizeArtifact(entry));
      for (const dir of ['rules', 'curation/entries/fixture', 'curation/segments', 'tools/curation']) await mkdir(resolve(root, dir), { recursive: true });
      await writeFile(resolve(root, path), sample); await writeFile(resolve(root, 'curation/input-manifest.json'), JSON.stringify(manifest));
      const stage = resolve(root, 'curation/entries/fixture/rule.jsonl'); await writeFile(stage, JSON.stringify(entry) + '\n');
      await writeFile(resolve(root, 'curation/segments/mechanics.jsonl'), '');
      for (const file of ['tools/curation/privacy.mjs', 'tools/curation/editorial-normalizer.ts', 'tools/curation/normalize.mjs', 'tools/curation/ancestry-extractor.ts']) await copyFile(file, resolve(root, file));
      await main(['--write'], root); await main(['--check'], root);
      const target = resolve(root, 'curation/normalized/a.md'); await writeFile(target, 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, path), sample + 'changed');
      await expect(main(['--write'], root)).rejects.toThrow(/Input changed/); expect(await readFile(target, 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, path), sample); await writeFile(stage, JSON.stringify({ ...entry, originalText: 'changed staging' }) + '\n');
      await expect(main(['--write'], root)).rejects.toThrow(/Original range mismatch/);
      await writeFile(resolve(root, path), Buffer.from([255])); manifest.files[0].sha256 = sha(Buffer.from([255]));
      await writeFile(resolve(root, 'curation/input-manifest.json'), JSON.stringify(manifest));
      await expect(main(['--write'], root)).rejects.toThrow(); expect(await readFile(target, 'utf8')).toBe('tampered\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-normalization-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  });
});
