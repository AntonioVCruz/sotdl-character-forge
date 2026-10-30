import { assertSafeArtifact } from './privacy.mjs';
import { redactBuyerLines, hasBuyerData, sanitizeArtifact } from './privacy.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { z } from 'zod';
import { InputManifestSchema } from '../../packages/curation/registries';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { EvidenceSchema, Sha256 } from '../../packages/curation/evidence';
import { sourceLines } from './ancestry-extractor';

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const LIGATURES: Record<string, string> = { 'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st' };
const numberTokens = (text: string) => text.match(/[+\-−–]?\d+(?:[.,/]\d+)?/g) ?? [];
const REPORT = 'curation/reports/editorial-normalization.json';
const CHANGES = 'curation/normalization/changes.jsonl', DIAGNOSTICS = 'curation/normalization/diagnostics.jsonl', OVERLAYS = 'curation/normalization/overlays.jsonl';

export const LineChangeSchema = z.object({
  schemaVersion: z.literal(1), id: z.string().min(1), path: z.string().min(1), inputSha256: z.string().regex(/^[a-f0-9]{64}$/),
  line: z.number().int().positive(), sourceByteOffset: z.number().int().nonnegative(),
  before: z.string(), beforeSha256: Sha256.optional(), after: z.string(), eol: z.enum(['', '\n', '\r\n', '\r']),
  rules: z.array(z.enum(['expand-latin-ligatures', 'remove-buyer-watermark-line'])).min(1),
  occurrences: z.number().int().positive(), originalCodeUnitColumns: z.array(z.number().int().positive()),
  responsible: z.literal('Codex / deterministic editorial policy 1.0.0'), reason: z.string().min(1),
}).strict();
export type LineChange = z.infer<typeof LineChangeSchema>;
type Diagnostic = { schemaVersion: 1; path: string; inputSha256: string; kind: string; startLine: number; endLine: number;
  action: 'review-required' | 'normalized'; snippet: string; reason: string };
type Line = { text: string; eol: string; raw: string };
export const NormalizationOverlaySchema = z.object({
  schemaVersion: z.literal(1), id: z.string().min(1), origin: z.enum(['staging', 'segment']),
  reference: z.object({ path: z.string().min(1), record: z.number().int().positive() }).strict(),
  subjectId: z.string().min(1), entityId: z.string().nullable(), source: EvidenceSchema,
  originalTextSha256: Sha256, normalizedTextSha256: Sha256, normalizedText: z.string(),
  normalizationDiffRef: z.string().min(1), changeRefs: z.object({ path: z.string().min(1), changeIds: z.array(z.string().min(1)).min(1) }).strict(),
  status: z.literal('editorial-only'), appliedToStaging: z.literal(false),
}).strict();
function records(text: string): Line[] { return sourceLines(text).map(l => ({ ...l, eol: l.raw.slice(l.text.length) })); }

/** Replays only exact recorded line substitutions; neither forward nor reverse accepts changed context. */
export function replayChanges(text: string, changesInput: unknown[], reverse = false, originalText?: string) {
  const changes = changesInput.map(c => LineChangeSchema.parse(c)), lines = records(text), seen = new Set<number>();
  for (const c of changes) {
    if (seen.has(c.line)) throw new Error('Duplicate line change'); seen.add(c.line);
    let rawBefore = c.before;
    if (c.beforeSha256) {
      if (!c.rules.includes('remove-buyer-watermark-line') || c.before !== '[buyer watermark redacted]' || c.after !== '') throw new Error('Invalid redacted diff');
      if (reverse && originalText === undefined) throw new Error('Local original required to reverse redacted diff');
      if (originalText !== undefined && sha(originalText) !== c.inputSha256) throw new Error('Original revision mismatch');
      rawBefore = reverse ? records(originalText!)[c.line - 1]?.text : lines[c.line - 1]?.text;
      if (rawBefore === undefined || sha(rawBefore) !== c.beforeSha256) throw new Error('Diff context mismatch for redacted line');
    }
    const before = reverse ? c.after : rawBefore, after = reverse ? rawBefore : c.after;
    // A removed final watermark without an EOL leaves a virtual empty EOF line.
    if (reverse && c.line === lines.length + 1 && before === '' && c.eol === '') lines.push({ text: '', eol: '', raw: '' });
    const line = lines[c.line - 1];
    if (!line || line.text !== before || line.eol !== c.eol) throw new Error(`Diff context mismatch at line ${c.line}`);
    lines[c.line - 1] = { text: after, eol: c.eol, raw: after + c.eol };
  }
  return lines.map(l => l.raw).join('');
}

export function normalizeDocument(text: string, path: string) {
  const lines = records(text), hash = sha(text), changes: LineChange[] = [], diagnostics: Diagnostic[] = [], normalizedLines: string[] = [];
  const frequencies = new Map<string, number>();
  for (const l of lines) if (/^[\p{L}][\p{L}\s’'&-]{2,69}$/u.test(l.text.trim())) frequencies.set(l.text.trim(), (frequencies.get(l.text.trim()) ?? 0) + 1);
  const diagnostic = (kind: string, startLine: number, endLine: number, action: Diagnostic['action'], reason: string) => {
    diagnostics.push({ schemaVersion: 1, path, inputSha256: hash, kind, startLine, endLine, action,
      snippet: redactBuyerLines(lines.slice(startLine - 1, endLine).map(l => l.text).join('\n')), reason });
  };
  let fence: { char: string; length: number; line: number } | null = null, offset = 0;
  const inside: boolean[] = [];
  const inventory = { ligaturesObserved: 0, ligaturesExpanded: 0, watermarksRemoved: 0,
    standardBulletsPreserved: 0, nonBreakingSpacesPreserved: 0, isolatedNumbersPreserved: 0 };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], n = i + 1, before = line.text;
    const close = before.match(/^ {0,3}(`+|~+)\s*$/), open = before.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    let payload = fence !== null;
    if (fence && close && close[1][0] === fence.char && close[1].length >= fence.length) { fence = null; payload = false; }
    else if (!fence && open) { fence = { char: open[1][0], length: open[1].length, line: n }; payload = false; }
    inside[i] = payload;
    let after = before;
    const ligatures = [...before.matchAll(/[ﬀﬁﬂﬃﬄﬅﬆ]/g)]; inventory.ligaturesObserved += ligatures.length;
    inventory.standardBulletsPreserved += (before.match(/[•◦▪]/g) ?? []).length;
    inventory.nonBreakingSpacesPreserved += (before.match(/\u00a0/g) ?? []).length;
    if (hasBuyerData(before)) {
      after = ''; inventory.watermarksRemoved++;
      changes.push(LineChangeSchema.parse({ schemaVersion: 1, id: `norm:${sha(path).slice(0, 12)}:${hash}:${n}`, path, inputSha256: hash, line: n, sourceByteOffset: offset,
        before: '[buyer watermark redacted]', beforeSha256: sha(before), after, eol: line.eol, rules: ['remove-buyer-watermark-line'], occurrences: 1, originalCodeUnitColumns: [1],
        responsible: 'Codex / deterministic editorial policy 1.0.0', reason: 'Whole buyer watermark line inside a fenced payload; line ending retained. Order ID is not game data.' }));
      diagnostic('buyer-watermark', n, n, 'normalized', 'Buyer/order pattern redacted; reverse replay requires the licensed local original.');
    } else if (payload && ligatures.length) {
      after = before.replace(/[ﬀﬁﬂﬃﬄﬅﬆ]/g, c => LIGATURES[c]);
      if (JSON.stringify(numberTokens(before)) !== JSON.stringify(numberTokens(after))) throw new Error('Numeric token changed during typography normalization');
      inventory.ligaturesExpanded += ligatures.length;
      changes.push(LineChangeSchema.parse({ schemaVersion: 1, id: `norm:${sha(path).slice(0, 12)}:${hash}:${n}`, path, inputSha256: hash, line: n, sourceByteOffset: offset,
        before, after, eol: line.eol, rules: ['expand-latin-ligatures'], occurrences: ligatures.length, originalCodeUnitColumns: ligatures.map(m => m.index! + 1),
        responsible: 'Codex / deterministic editorial policy 1.0.0', reason: 'Expand only Latin presentation ligatures U+FB00–U+FB06; no general Unicode folding or reflow.' }));
      diagnostic('latin-ligature', n, n, 'normalized', 'Explicit Latin ligature expansion; numeric tokens unchanged.');
    } else if (ligatures.length) diagnostic('ligature-outside-payload', n, n, 'review-required', 'Metadata/editorial text preserved; automatic cleanup is limited to fenced payloads.');
    if (/\uFFFD|(?:Ã[\u0080-\u00ff])|â€|Â[\u0080-\u00ff]/u.test(before)) diagnostic('encoding-or-replacement-character', n, n, 'review-required', 'Possible character loss/mojibake; original bytes do not identify the intended character.');
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ue000-\uf8ff]/u.test(before)) diagnostic('control-or-private-glyph', n, n, 'review-required', 'Unknown/control/font glyph, possibly a bullet or extraction artifact; no guessed replacement.');
    if (/[\u00ad\u200b\u200c\u200d\u2060\ufeff]/u.test(before)) diagnostic('invisible-or-soft-hyphen', n, n, 'review-required', 'Invisible character preserved; removal could change a word boundary or identifier.');
    if (/\b(?:fi|fl|ff|ffi|ffl)\s+(?=[a-z])/u.test(before)) diagnostic('split-letter-sequence', n, n, 'review-required', 'Possible OCR split (for example fi rst); dictionary-based reconstruction is not automatic.');
    if (payload) {
      if (/^\s*\d+\s*$/.test(before)) { inventory.isolatedNumbersPreserved++; diagnostic('isolated-number', n, n, 'review-required', 'Could be a page number, table outcome, value or exception; never removed automatically.'); }
      if (/[\p{L}][-\u00ad]\s*$/u.test(before) && /^\s*[\p{Ll}]/u.test(lines[i + 1]?.text ?? '')) diagnostic('line-end-hyphenation', n, n + 1, 'review-required', 'Possible word wrap or genuine compound; retain hyphen and line break.');
      if (/^\s*d\d+\b.*\bd\d+\b/i.test(before) || /^\s*\d+(?:[–-]\d+)?\s+[^\d]+\s+\d+(?:[–-]\d+)?\s+\p{L}/u.test(before))
        diagnostic('possible-multiple-columns', n, n, 'review-required', 'Possible collapsed table columns; order/ranges need contextual review.');
      if (/^(?:Item|Name|Price|Availability)$/.test(before) && lines.slice(i + 1, i + 8).filter(l => /^(?:Item|Name|Price|Availability)$/.test(l.text)).length >= 2)
        diagnostic('vertical-columns', n, Math.min(n + 7, lines.length), 'review-required', 'Stacked catalog column labels; preserve cells and their order.');
      if ((frequencies.get(before.trim()) ?? 0) >= 3 && lines.slice(Math.max(0, i - 3), i).some(l => /^---(?:\s+PDF.*)?$|^Chapter \d+:/.test(l.text)))
        diagnostic('repeated-heading-near-page-break', n, n, 'review-required', 'Repeated text near a page separator may be a running header or a meaningful table/section title.');
      if (before.trim() && before === lines[i - 1]?.text && !/^---|^\s*(`|~)/.test(before)) diagnostic('adjacent-duplicate-line', n - 1, n, 'review-required', 'Identical adjacent lines may be extraction duplicates or repeated values; no automatic deletion.');
    }
    normalizedLines.push(after + line.eol); offset += Buffer.byteLength(line.raw);
  }
  if (fence) throw new Error(`Unclosed fence in ${path} at ${fence.line}`);
  // Diagnose runs of apparent prose wrapping without joining them or changing columns.
  for (let i = 0; i + 1 < lines.length; i++) {
    const wraps = (p: number) => inside[p] && inside[p + 1] && /[\p{L}]\s*$/u.test(lines[p].text) && /^\s*[\p{Ll}]/u.test(lines[p + 1].text);
    if (!wraps(i)) continue;
    const start = i; while (i + 1 < lines.length && wraps(i)) i++;
    diagnostic('wrapped-prose-candidate', start + 1, i + 1, 'review-required', 'Possible prose wrapping; no reflow because column order and unit boundaries remain unreviewed.');
  }
  const normalizedText = normalizedLines.join('');
  if (replayChanges(text, changes) !== normalizedText || replayChanges(normalizedText, changes, true, text) !== text) throw new Error('Normalization diff is not reversible');
  return { path, inputSha256: hash, normalizedText, originalLines: lines.map(l => l.raw), normalizedLines, changes, diagnostics, inventory };
}

async function stagingFiles(root: string) {
  const result: string[] = [];
  async function walk(path: string) {
    for (const entry of (await readdir(resolve(root, path), { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (entry.isSymbolicLink()) throw new Error('Symlink in curation entries');
      const child = `${path}/${entry.name}`;
      if (entry.isDirectory()) await walk(child); else if (entry.isFile() && child.endsWith('.jsonl')) result.push(child);
    }
  }
  await walk('curation/entries'); return result;
}

export async function buildArtifacts(root: string) {
  const read = (path: string) => readFile(resolve(root, path)), manifestBytes = await read('curation/input-manifest.json');
  const manifest = InputManifestSchema.parse(JSON.parse(manifestBytes.toString('utf8')));
  const artifacts = new Map<string, string>(), documents = new Map<string, ReturnType<typeof normalizeDocument>>();
  for (const file of manifest.files) {
    const absolute = resolve(root, file.path), rulesRoot = resolve(root, 'rules');
    if (!absolute.startsWith(rulesRoot + '/') && !absolute.startsWith(rulesRoot + '\\')) throw new Error('Input outside rules');
    const bytes = await read(file.path); if (bytes.length > 16 * 1024 * 1024) throw new Error('Input exceeds 16 MiB');
    if (sha(bytes) !== file.sha256) throw new Error(`Input changed: ${file.path}`);
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    if (Buffer.from(text).compare(bytes) !== 0) throw new Error('Byte-preserving UTF-8 decode required');
    const result = normalizeDocument(text, file.path); documents.set(file.path, result);
    artifacts.set(`curation/normalized/${relative(rulesRoot, absolute).replaceAll('\\', '/')}`, result.normalizedText);
  }
  const inputRefs: { path: string; sha256: string; records: number }[] = [], overlays: unknown[] = [];
  const seenSpans = new Set<string>(); let stagedRecords = 0, segmentRecords = 0;
  function overlay(reference: { path: string; record: number }, subjectId: string, entityId: string | null,
    source: { path: string; inputSha256: string; startLine: number | null; endLine: number | null }, originalText: string, origin: 'staging' | 'segment') {
    const doc = documents.get(source.path);
    if (!doc || source.inputSha256 !== doc.inputSha256 || source.startLine === null || source.endLine === null) throw new Error(`Stale/missing source evidence: ${reference.path}:${reference.record}`);
    const before = doc.originalLines.slice(source.startLine - 1, source.endLine).join('');
    if (redactBuyerLines(before) !== originalText) throw new Error(`Original range mismatch: ${reference.path}:${reference.record}`);
    const changes = doc.changes.filter(c => c.line >= source.startLine! && c.line <= source.endLine!);
    const spanKey = `${source.path}:${source.startLine}:${source.endLine}`; seenSpans.add(spanKey);
    if (!changes.length) return;
    const normalizedText = doc.normalizedLines.slice(source.startLine - 1, source.endLine).join('');
    const id = `overlay:${sha(JSON.stringify([reference, source.inputSha256, source.startLine, source.endLine]))}`;
    overlays.push(NormalizationOverlaySchema.parse({ schemaVersion: 1, id, origin, reference, subjectId, entityId, source: sanitizeArtifact(source),
      originalTextSha256: sha(originalText), normalizedTextSha256: sha(normalizedText), normalizedText,
      normalizationDiffRef: `${OVERLAYS}#${id}`, changeRefs: { path: CHANGES, changeIds: changes.map(c => c.id) }, status: 'editorial-only', appliedToStaging: false }));
  }
  for (const path of await stagingFiles(root)) {
    const bytes = await read(path), rows = bytes.toString('utf8').split('\n').filter(Boolean); inputRefs.push({ path, sha256: sha(bytes), records: rows.length });
    for (let i = 0; i < rows.length; i++) {
      const record = StagingEntrySchema.parse(JSON.parse(rows[i])), evidence = record.review.evidence[0];
      if (evidence.medium !== 'md' || record.originalText === null) throw new Error(`Unsupported staging evidence: ${path}:${i + 1}`);
      stagedRecords++; overlay({ path, record: i + 1 }, record.review.subjectId, record.id, evidence, record.originalText, 'staging');
    }
  }
  const segmentPath = 'curation/segments/mechanics.jsonl', segmentBytes = await read(segmentPath), segments = segmentBytes.toString('utf8').split('\n').filter(Boolean);
  inputRefs.push({ path: segmentPath, sha256: sha(segmentBytes), records: segments.length });
  for (let i = 0; i < segments.length; i++) {
    const s = JSON.parse(segments[i]); segmentRecords++;
    if (seenSpans.has(`${s.evidence.path}:${s.evidence.startLine}:${s.evidence.endLine}`)) continue;
    overlay({ path: segmentPath, record: i + 1 }, s.unitKey ? `mechanics:${s.unitKey}` : `segment:${s.evidence.inputSha256}:${s.startLine}:${s.endLine}`, null, s.evidence, s.originalText, 'segment');
  }
  const allChanges = [...documents.values()].flatMap(d => d.changes), allDiagnostics = [...documents.values()].flatMap(d => d.diagnostics);
  const jsonl = (rows: unknown[]) => rows.length ? rows.map(r => JSON.stringify(r)).join('\n') + '\n' : '';
  artifacts.set(CHANGES, jsonl(allChanges)); artifacts.set(DIAGNOSTICS, jsonl(allDiagnostics)); artifacts.set(OVERLAYS, jsonl(overlays));
  const counts = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map(value => [value, values.filter(v => v === value).length]));
  const report = { schemaVersion: 1, task: 'CUR-012', reviewDate: manifest.reviewDate,
    policy: { version: '1.1.0', automaticRules: ['expand-latin-ligatures', 'remove-buyer-watermark-line'], fencedPayloadOnly: false, buyerDataPolicy: 'redacted-diff-local-original-required-v1',
      lineEndingsPreserved: true, rawInputsModified: false, stagingModified: false, mechanicalReviewPromoted: false,
      columns: 'UTF-16 code units, base 1; sourceByteOffset counts original UTF-8 bytes from zero.' },
    tool: { privacyPolicySha256: sha(await read('tools/curation/privacy.mjs')), sha256: sha(await read('tools/curation/editorial-normalizer.ts')), runnerSha256: sha(await read('tools/curation/normalize.mjs')), lineUtilitySha256: sha(await read('tools/curation/ancestry-extractor.ts')) },
    inputManifestSha256: sha(manifestBytes), inputRefs,
    counts: { documents: documents.size, changedLines: allChanges.length, changesByRule: counts(allChanges.flatMap(c => c.rules)),
      ligaturesExpanded: [...documents.values()].reduce((sum, d) => sum + d.inventory.ligaturesExpanded, 0), watermarksRemoved: [...documents.values()].reduce((sum, d) => sum + d.inventory.watermarksRemoved, 0),
      diagnostics: allDiagnostics.length, diagnosticsByKind: counts(allDiagnostics.map(d => d.kind)), reviewRequired: allDiagnostics.filter(d => d.action === 'review-required').length,
      stagedRecords, segmentRecords, overlays: overlays.length },
    documents: [...documents.values()].map(d => ({ path: d.path, inputSha256: d.inputSha256, normalizedSha256: sha(d.normalizedText),
      changes: d.changes.length, inventory: d.inventory, forwardReplayVerified: true, reverseReplayVerified: true })),
    outputs: [...artifacts].map(([path, data]) => ({ path, sha256: sha(data), bytes: Buffer.byteLength(data) })) };
  artifacts.set(REPORT, JSON.stringify(report, null, 2) + '\n'); return { artifacts, report };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--write', '--check'].includes(args[0])) throw new Error('Use --write or --check');
  const { artifacts, report } = await buildArtifacts(root);
  for (const [path, output] of artifacts) { assertSafeArtifact(path, output);
    if (args[0] === '--write') { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), output); }
    else if (await readFile(resolve(root, path), 'utf8') !== output) throw new Error(`Normalization artifact changed: ${path}`);
  }
  console.log(`Editorial: ${report.counts.documents} MDs; ${report.counts.ligaturesExpanded} ligatures expanded, ${report.counts.watermarksRemoved} watermark lines removed; ${report.counts.overlays} overlays, ${report.counts.reviewRequired} review diagnostics. ${args[0]}`);
}
