import { assertSafeArtifact } from './privacy.mjs';
import { sanitizeArtifact } from './privacy.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { entityId } from '../../packages/curation/identity';
import { InputManifestSchema, SourceRegistrySchema } from '../../packages/curation/registries';
import { sourceLines } from './ancestry-extractor';

export const INPUT = 'rules/SotDL_All_Paths_Compendium_Expanded_All_Project_Sources.md';
const LEDGER = 'curation/path-ledger.json', REPORT = 'curation/reports/paths.json';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const slug = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const categories = { '## Novice Paths': 'Novice', '## Novice Path Variants': 'Novice Variant',
  '## Expert Paths': 'Expert', '## Master Paths': 'Master', '## Legendary Paths': 'Legendary' } as const;
type Category = typeof categories[keyof typeof categories];
type Span = { startLine: number; endLine: number };
const metadataKeys = ['Path Type', 'Source', 'Source Page', 'PDF Page'] as const;
type MetadataKey = typeof metadataKeys[number];
export type PathOccurrence = Span & {
  category: Category; categoryLine: number; heading: string; headingLine: number; name: string;
  metadata: Record<MetadataKey, string>; metadataLines: Record<MetadataKey, number>;
  bodies: (Span & { language: string })[]; notes: Span[]; originalText: string;
};

export function parsePaths(text: string): PathOccurrence[] {
  const lines = sourceLines(text), entries: PathOccurrence[] = [];
  let category: Category | null = null, categoryLine = 0;
  const seenCategories = new Set<string>();
  let current: { startLine: number; category: Category; categoryLine: number; heading: string; headingLine: number;
    metadata: Partial<Record<MetadataKey, string>>; metadataLines: Partial<Record<MetadataKey, number>>;
    bodies: (Span & { language: string })[]; noteLines: number[] } | null = null;
  let fence: { char: string; length: number; startLine: number; language: string } | null = null;
  function finish(endLine: number) {
    if (!current) return;
    const c = current;
    for (const key of metadataKeys) if (!c.metadata[key]) throw new Error(`${c.heading}:${c.startLine}: missing ${key}`);
    if (c.metadata['Path Type'] !== c.category) throw new Error(`Category/Path Type mismatch at ${c.startLine}`);
    if (!c.bodies.length || c.bodies.some(b => b.endLine < b.startLine)) throw new Error(`${c.heading}: missing/empty Full Entry`);
    const metadata = c.metadata as Record<MetadataKey, string>;
    const title = c.heading.slice(4), suffix = ` — ${metadata.Source}`;
    const notes: Span[] = [];
    for (const n of c.noteLines) {
      const last = notes.at(-1);
      if (last && last.endLine + 1 === n) last.endLine = n;
      else notes.push({ startLine: n, endLine: n });
    }
    entries.push({ startLine: c.startLine, endLine, category: c.category, categoryLine: c.categoryLine,
      heading: c.heading, headingLine: c.headingLine, name: title.endsWith(suffix) ? title.slice(0, -suffix.length) : title,
      metadata, metadataLines: c.metadataLines as Record<MetadataKey, number>, bodies: c.bodies, notes,
      originalText: lines.slice(c.startLine - 1, endLine).map(l => l.raw).join('') });
    current = null;
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].text, n = i + 1;
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)\s*$/);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) {
        if (current) current.bodies.push({ startLine: fence.startLine + 1, endLine: n - 1, language: fence.language });
        fence = null;
      }
      continue;
    }
    const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (open) {
      if (category && !current) throw new Error(`Orphan Full Entry at ${n}`);
      fence = { char: open[1][0], length: open[1].length, startLine: n, language: open[2].trim() }; continue;
    }
    if (Object.hasOwn(categories, line)) {
      finish(n - 1);
      if (seenCategories.has(line)) throw new Error(`Duplicate path category at ${n}`);
      seenCategories.add(line); category = categories[line as keyof typeof categories]; categoryLine = n; continue;
    }
    if (!category) continue;
    if (/^#{1,2} /.test(line)) throw new Error(`Unexpected section inside path categories at ${n}`);
    if (line.startsWith('### ')) {
      finish(n - 1); current = { startLine: n, category, categoryLine, heading: line, headingLine: n,
        metadata: {}, metadataLines: {}, bodies: [], noteLines: [] }; continue;
    }
    const meta = line.match(/^- \*\*(Path Type|Source|Source Page|PDF Page):\*\*\s*(.+?)\s*$/);
    if (meta) {
      if (!current) throw new Error(`Orphan path metadata at ${n}`);
      const key = meta[1] as MetadataKey;
      if (key === 'Path Type' && current.bodies.length) {
        const heading: string = current.heading;
        const headingLine: number = current.headingLine;
        finish(n - 1);
        current = { startLine: n, category, categoryLine, heading, headingLine, metadata: {}, metadataLines: {}, bodies: [], noteLines: [] };
      }
      if (current.metadata[key] !== undefined || current.bodies.length) throw new Error(`Duplicate/misplaced ${key} at ${n}`);
      current.metadata[key] = meta[2]; current.metadataLines[key] = n;
    } else if (current && line.trim()) current.noteLines.push(n);
    else if (line.trim() && line !== '---') throw new Error(`Unassigned path category content at ${n}`);
  }
  if (fence) throw new Error(`Unclosed fence at ${fence.startLine}`);
  finish(lines.length);
  if (!entries.length) throw new Error('No path entries found');
  return entries;
}

/** Textual segmentation only: levels require an explicit heading; no benefits are inferred. */
export function pathSections(entry: PathOccurrence, input: string | ReturnType<typeof sourceLines>) {
  const lines = typeof input === 'string' ? sourceLines(input) : input;
  return entry.bodies.flatMap((body, bodyIndex) => {
    const anchors: { line: number; kind: 'introduction' | 'level-gains' | 'talent-list' | 'events' | 'training'; heading: string | null; level: number | null;
      recognition: 'literal' | 'decorated' | 'joined' | null; levelQualifier: 'and-higher' | null }[] = [];
    for (let n = body.startLine; n <= body.endLine; n++) {
      const line = lines[n - 1].text;
      const level = line.match(/^(<)?(?:Level|LEVEL)(\s*)(\d{1,3})(?=[^\d]|$)(.*)$/);
      if (level) anchors.push({ line: n, kind: 'level-gains', heading: line, level: Number(level[3]),
        recognition: level[1] ? 'decorated' : !level[2] ? 'joined' : 'literal', levelQualifier: /^\s+and Higher\b/i.test(level[4]) ? 'and-higher' : null });
      else if (/^(?:[A-Z][\p{L}\p{N}'’ -]{0,65} )?(?:Talents|TALENTS|Events|EVENTS|Training|TRAINING)$/u.test(line)) {
        anchors.push({ line: n, kind: /talents$/i.test(line) ? 'talent-list' : /events$/i.test(line) ? 'events' : 'training', heading: line, level: null, recognition: null, levelQualifier: null });
      }
    }
    if (!anchors.length || anchors[0].line > body.startLine) anchors.unshift({ line: body.startLine, kind: 'introduction', heading: null, level: null, recognition: null, levelQualifier: null });
    return anchors.map((anchor, i) => {
      const endLine = anchors[i + 1] ? anchors[i + 1].line - 1 : body.endLine;
      const rawText = lines.slice(anchor.line - 1, endLine).map(l => l.raw).join('');
      return { bodyIndex, kind: anchor.kind, level: anchor.level, heading: anchor.heading, recognition: anchor.recognition, levelQualifier: anchor.levelQualifier,
        startLine: anchor.line, endLine, rawText, sha256: sha(rawText), status: 'unreviewed' as const };
    });
  });
}

export const PathLedgerSchema = z.object({
  schemaVersion: z.literal(1), responsible: z.string().min(1), reason: z.string().min(1),
  entries: z.array(z.object({
    occurrenceKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(150), category: z.enum(['Novice', 'Novice Variant', 'Expert', 'Master', 'Legendary']),
    heading: z.string().min(1), rawSource: z.string().min(1),
    entryKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(70), variantKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(40),
  }).strict()).max(10000),
}).strict();
export function initialLedger(entries: PathOccurrence[]) {
  return PathLedgerSchema.parse({ schemaVersion: 1, responsible: 'Codex / local curation',
    reason: 'Initial immutable publication/category keys. Future label changes require explicit selector updates, never regeneration.',
    entries: entries.map(e => ({ occurrenceKey: slug(`${e.name}-${e.category}-${e.metadata.Source}`), category: e.category,
      heading: e.heading, rawSource: e.metadata.Source, entryKey: slug(e.name), variantKey: slug(e.category) })) });
}

export function extractPaths(text: string, registryInput: unknown, ledgerInput: unknown) {
  const registry = SourceRegistrySchema.parse(registryInput), ledger = PathLedgerSchema.parse(ledgerInput);
  const entries = parsePaths(text), lines = sourceLines(text), hash = sha(text);
  const selector = (category: string, heading: string, source: string) => JSON.stringify([category, heading, source]);
  const keys = new Map(ledger.entries.map(e => [selector(e.category, e.heading, e.rawSource), e]));
  if (keys.size !== ledger.entries.length || new Set(ledger.entries.map(e => e.occurrenceKey)).size !== ledger.entries.length) throw new Error('Duplicate ledger selector/occurrenceKey');
  const used = new Set<string>(), ids = new Set<string>();
  const results = entries.map(e => {
    const key = keys.get(selector(e.category, e.heading, e.metadata.Source));
    if (!key || used.has(key.occurrenceKey)) throw new Error(`Ledger missing/ambiguous: ${e.heading}`);
    used.add(key.occurrenceKey);
    const refs = registry.references.filter(r => r.path === INPUT && r.role === 'metadata' && r.line === e.metadataLines.Source);
    if (refs.length !== 1 || refs[0].inputSha256 !== hash || refs[0].label !== e.metadata.Source) throw new Error(`Registry evidence mismatch: ${e.heading}`);
    const ref = refs[0], sourceId = ref.sourceId;
    const identity = sourceId ? { sourceId, kind: 'path' as const, entryKey: key.entryKey, variantKey: key.variantKey } : null;
    const id = identity ? entityId(identity) : null;
    if (id && ids.has(id)) throw new Error(`Duplicate identity: ${id}`);
    if (id) ids.add(id);
    const pending = sourceId ? null : registry.pending.find(p => p.path === INPUT && p.line === ref.line && p.label === ref.label);
    const evidenceId = `path:${key.occurrenceKey}:md`, categoryEvidenceId = `path:${key.occurrenceKey}:category`, headingEvidenceId = `path:${key.occurrenceKey}:heading`;
    const excerpt = lines.slice(e.startLine - 1, e.endLine).map(l => l.text).join('\n');
    const printedPage = /^\d+$/.test(e.metadata['Source Page']) && Number.isSafeInteger(Number(e.metadata['Source Page'])) && Number(e.metadata['Source Page']) > 0 ? Number(e.metadata['Source Page']) : null;
    const sections = pathSections(e, lines);
    const levelHeadings = sections.filter(s => s.kind === 'level-gains').map(s => s.level!);
    const detectedLevels = [...new Set(levelHeadings)].sort((a, b) => a - b);
    const expected = ({ Novice: [1, 2, 5, 8], 'Novice Variant': [1, 2, 5, 8], Expert: [3, 6, 9], Master: [7, 10], Legendary: [] } as Record<Category, number[]>)[e.category];
    const unexpectedLevels = e.category === 'Legendary' ? [] : detectedLevels.filter(n => !expected.includes(n));
    const duplicateLevels = detectedLevels.filter(n => levelHeadings.filter(level => level === n).length > 1);
    const structuralWarnings = [...(unexpectedLevels.length ? ['unexpected-level-in-category-review-required'] : []),
      ...(duplicateLevels.length ? ['duplicate-level-heading-review-required'] : [])];
    const axis = (status: string, reason: string, evidenceIds: string[] = []) => ({ status, responsible: 'Codex / local extraction', reason, evidenceIds });
    const evidence = (evidenceId: string, startLine: number, endLine: number, excerpt: string, heading: string, claim: string) => ({
      id: evidenceId, medium: 'md', path: INPUT, inputSha256: hash, startLine, endLine, physicalPdfPage: null,
      printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: e.metadata['PDF Page'], heading, excerpt, excerptSha256: sha(excerpt), claim });
    const staging = StagingEntrySchema.parse({ schemaVersion: 1, id, identity, name: e.name, kind: 'path',
      source: { status: sourceId ? 'resolved' : 'pending', sourceId, rawLabel: e.metadata.Source,
        reason: sourceId ? 'Resolved CUR-003 metadata; edition/permission unconfirmed.' : pending?.reason ?? 'Unresolved source.' },
      representation: 'full-text', originalText: e.originalText, normalizedText: null, normalizationDiffRef: null,
      printedPage, pdfPageDeclared: e.metadata['PDF Page'], stage: sourceId && !structuralWarnings.length ? 'captured' : 'blocked',
      scopeTags: sourceId === 'sotdl:shadow-of-the-demon-lord-core' ? ['BASE'] : [], region: null,
      searchAliases: e.heading.slice(4) === e.name ? [] : [e.heading.slice(4)], equivalenceGroupIds: [], lineage: [],
      review: { schemaVersion: 1, subjectId: id ?? `pending:${key.occurrenceKey}`,
        sourcePermission: axis('needs-review', 'No edition/permission certification inherited from MD.'),
        transcription: axis('md-checked', 'Exact MD capture, including inherited category/name evidence; no PDF inspection.', [evidenceId, categoryEvidenceId, headingEvidenceId]),
        structure: axis(structuralWarnings.length ? 'blocked' : 'unreviewed', structuralWarnings.length
          ? `Conflicting level headings already present in MD: ${structuralWarnings.join(', ')}. No text removed or reassigned.`
          : 'Automatic boundaries/section candidates; original publication completeness not reviewed.', structuralWarnings.length ? [evidenceId] : []),
        mechanics: axis('unreviewed', 'Textual level segmentation only; no inferred benefits or eligibility.'),
        automation: { ...axis('unsupported', 'Staging only; no progression compiled.'), handlerRef: null, testRefs: [] },
        evidence: [evidence(evidenceId, e.startLine, e.endLine, excerpt, e.heading, 'Complete MD publication occurrence, not PDF certification.'),
          evidence(categoryEvidenceId, e.categoryLine, e.categoryLine, lines[e.categoryLine - 1].text, lines[e.categoryLine - 1].text, 'Inherited category heading; pages are declared by the occurrence, not this header.'),
          evidence(headingEvidenceId, e.headingLine, e.headingLine, lines[e.headingLine - 1].text, e.heading, 'Explicit or inherited name heading; separate publication metadata starts a new occurrence.')] } });
    const detail = { occurrenceKey: key.occurrenceKey, entityId: id, name: e.name, heading: e.heading, headingLine: e.headingLine,
      category: e.category, categoryLine: e.categoryLine, pathType: e.metadata['Path Type'], sourceId, sourceLabel: e.metadata.Source,
      candidateSourceId: pending?.candidateSourceId ?? null, variantKey: key.variantKey,
      printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: e.metadata['PDF Page'], startLine: e.startLine, endLine: e.endLine,
      metadataLines: e.metadataLines, fullEntryBlocks: e.bodies, sections,
      levelDiagnostics: { expectedTypicalLevels: expected, detectedLevels, missingTypicalLevels: expected.filter(n => !detectedLevels.includes(n)),
        unexpectedLevels, duplicateLevels, applied: false },
      notes: e.notes.map(n => ({ ...n, text: lines.slice(n.startLine - 1, n.endLine).map(l => l.text).join('\n'), applied: false })),
      warnings: [...(sourceId ? [] : ['unresolved-source']), ...(printedPage === null ? ['printed-page-not-a-single-positive-integer'] : []),
        ...structuralWarnings, ...(expected.some(n => !detectedLevels.includes(n)) ? ['missing-typical-level-heading-review-required'] : [])] };
    return { staging, detail, outputPath: `curation/entries/${sourceId ? encodeURIComponent(sourceId) : '_pending'}/path.jsonl` };
  });
  if (used.size !== ledger.entries.length) throw new Error('Unused ledger entries require explicit reconciliation');
  return results;
}

export async function buildArtifacts(root: string) {
  const read = (path: string) => readFile(resolve(root, path));
  const manifestBytes = await read('curation/input-manifest.json');
  const manifest = InputManifestSchema.parse(JSON.parse(manifestBytes.toString('utf8'))), file = manifest.files.find(f => f.path === INPUT);
  if (!file) throw new Error('Path input missing from manifest');
  const bytes = await read(INPUT); if (bytes.length > 16 * 1024 * 1024) throw new Error('Path input exceeds 16 MiB');
  if (sha(bytes) !== file.sha256) throw new Error('Path input changed; revise manifest first.');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (Buffer.from(text).compare(bytes) !== 0) throw new Error('Byte-preserving decode required');
  const registryBytes = await read('curation/sources.json'), ledgerBytes = await read(LEDGER);
  const registry = SourceRegistrySchema.parse(JSON.parse(registryBytes.toString('utf8')));
  if (registry.inputManifestSha256 !== sha(manifestBytes) || registry.aliasDecisionsSha256 !== sha(await read('curation/source-aliases.json'))) throw new Error('Registry revision mismatch');
  const results = extractPaths(text, registry, JSON.parse(ledgerBytes.toString('utf8'))), artifacts = new Map<string, string>();
  for (const r of [...results].sort((a, b) => {
    const left = a.staging.id ?? a.detail.occurrenceKey, right = b.staging.id ?? b.detail.occurrenceKey;
    return left < right ? -1 : left > right ? 1 : 0;
  })) {
    const jsonl = JSON.stringify(sanitizeArtifact(r.staging)) + '\n';
    if (Buffer.byteLength(jsonl) > 4 * 1024 * 1024) throw new Error('Staging record exceeds 4 MiB');
    artifacts.set(r.outputPath, (artifacts.get(r.outputPath) ?? '') + jsonl);
  }
  const parsed = parsePaths(text), lines = sourceLines(text);
  const excludedRanges: (Span & { reason: string })[] = []; let cursor = 1;
  for (const e of parsed) { if (cursor < e.startLine) excludedRanges.push({ startLine: cursor, endLine: e.startLine - 1, reason: cursor === 1 ? 'prelude-and-first-category-header' : 'category-header-and-separator' }); cursor = e.endLine + 1; }
  if (cursor <= lines.length) excludedRanges.push({ startLine: cursor, endLine: lines.length, reason: 'trailing-non-entry-content' });
  const counts = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map(v => [v, values.filter(x => x === v).length]));
  const report = { schemaVersion: 1, task: 'CUR-009', reviewDate: manifest.reviewDate,
    extractor: { privacyPolicySha256: sha(await read('tools/curation/privacy.mjs')), version: '1.0.0', sha256: sha(await read('tools/curation/path-extractor.ts')), runnerSha256: sha(await read('tools/curation/paths.mjs')),
      lineUtilitySha256: sha(await read('tools/curation/ancestry-extractor.ts')) },
    input: file, inputManifestSha256: sha(manifestBytes), sourceRegistrySha256: sha(registryBytes), ledgerSha256: sha(ledgerBytes),
    counts: { occurrences: results.length, uniqueNameCategory: new Set(results.map(r => JSON.stringify([r.staging.name, r.detail.category]))).size,
      sourceLabels: new Set(results.map(r => r.detail.sourceLabel)).size, sourceResolved: results.filter(r => r.staging.id).length,
      sourcePending: results.filter(r => !r.staging.id).length, captured: results.filter(r => r.staging.stage === 'captured').length,
      blocked: results.filter(r => r.staging.stage === 'blocked').length, categories: counts(results.map(r => r.detail.category)),
      sectionKinds: counts(results.flatMap(r => r.detail.sections.map(s => s.kind))), missingTypicalLevels: results.filter(r => r.detail.levelDiagnostics.missingTypicalLevels.length).length },
    coverage: { inputLines: lines.length, excludedRanges, occurrenceLines: parsed.reduce((sum, e) => sum + e.endLine - e.startLine + 1, 0),
      note: 'This MD only, not cross-corpus reconciliation or mechanical approval. All sections and diagnostics remain unreviewed.' },
    outputs: [...artifacts].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, data]) => ({ path, sha256: sha(data), records: data.trimEnd().split('\n').length })),
    occurrences: results.map(r => r.detail) };
  artifacts.set(REPORT, JSON.stringify(sanitizeArtifact(report), null, 2) + '\n'); return { artifacts, report };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--init-ledger', '--write', '--check'].includes(args[0])) throw new Error('Use --init-ledger (once), --write or --check');
  if (args[0] === '--init-ledger') {
    const ledger = initialLedger(parsePaths(await readFile(resolve(root, INPUT), 'utf8')));
    await writeFile(resolve(root, LEDGER), JSON.stringify(ledger, null, 2) + '\n', { flag: 'wx' }); console.log(`Path ledger: ${ledger.entries.length} entries; review before extraction.`); return;
  }
  const { artifacts, report } = await buildArtifacts(root);
  const dirs = await readdir(resolve(root, 'curation/entries'), { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => { if (error.code === 'ENOENT') return []; throw error; });
  for (const dir of dirs) {
    if (dir.isSymbolicLink()) throw new Error('Symlink in staging directory');
    if (!dir.isDirectory()) continue;
    const path = `curation/entries/${dir.name}/path.jsonl`;
    try { await readFile(resolve(root, path)); if (!artifacts.has(path)) throw new Error(`Orphan staging output requires reconciliation: ${path}`); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  }
  for (const [path, output] of artifacts) { assertSafeArtifact(path, output);
    if (args[0] === '--write') { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), output); }
    else if (await readFile(resolve(root, path), 'utf8') !== output) throw new Error(`Generated path artifact changed: ${path}`);
  }
  console.log(`Paths: ${report.counts.occurrences} occurrences, ${report.counts.uniqueNameCategory} name/category pairs; ${report.counts.captured} captured, ${report.counts.blocked} blocked (${report.counts.sourcePending} source pending). ${args[0]}`);
}
