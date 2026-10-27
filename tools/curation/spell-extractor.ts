import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { entityId } from '../../packages/curation/identity';
import { InputManifestSchema, SourceRegistrySchema } from '../../packages/curation/registries';
import { sourceLines } from './ancestry-extractor';

export const INPUT = 'rules/SotDL_Spells_All_Sources_Expanded_All_Project_Sources_v2.md';
const LEDGER = 'curation/spell-ledger.json', ORIGINS = 'curation/spell-origins.json', REPORT = 'curation/reports/spells.json';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const slug = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pathOriginNames = ['Blighter', 'Diabolist', 'Exorcist', 'Magician', 'Necromancer', 'Priest', 'Shaman', 'Spellbinder', 'Technomancer', 'Templar', 'Tenebrist', 'Warden', 'Witch'];
const keyString = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const OriginsSchema = z.object({ schemaVersion: z.literal(1), responsible: z.string().min(1),
  origins: z.array(z.object({ label: z.string().min(1), kind: z.enum(['tradition', 'path', 'ancestry', 'other', 'unresolved']),
    reason: z.string().min(1) }).strict()).max(1000),
}).strict();
type Origins = z.infer<typeof OriginsSchema>;
type Span = { startLine: number; endLine: number };
type MetadataKey = 'Type' | 'Source' | 'Source Page' | 'PDF Page';
export type SpellOccurrence = Span & { name: string; heading: string; headingLine: number;
  origin: string; originLine: number; rank: number; rankLine: number;
  metadata: Record<MetadataKey, string | null>; metadataLines: Partial<Record<MetadataKey, number>>;
  bodies: (Span & { language: string })[]; notes: Span[]; originalText: string };

/** Structural headings are recognized only outside fences; body field headers are optional. */
export function parseSpells(text: string, originLabels: string[]): SpellOccurrence[] {
  const labels = new Set(originLabels), lines = sourceLines(text), entries: SpellOccurrence[] = [];
  if (labels.size !== originLabels.length) throw new Error('Duplicate origin labels');
  let origin: string | null = null, originLine = 0, rank: number | null = null, rankLine = 0;
  const seen = new Set<string>();
  let current: { startLine: number; heading: string; headingLine: number; origin: string; originLine: number; rank: number; rankLine: number;
    metadata: Partial<Record<MetadataKey, string>>; metadataLines: Partial<Record<MetadataKey, number>>;
    bodies: (Span & { language: string })[]; noteLines: number[] } | null = null;
  let fence: { char: string; length: number; startLine: number; language: string } | null = null;
  function finish(endLine: number) {
    if (!current) return;
    const c = current;
    if (!c.metadata.Source) throw new Error(`Missing Source at ${c.startLine}`);
    if (!c.bodies.length || c.bodies.some(b => b.endLine < b.startLine)) throw new Error(`Missing/empty Full Entry at ${c.startLine}`);
    const notes: Span[] = [];
    for (const n of c.noteLines) {
      const last = notes.at(-1); if (last && last.endLine + 1 === n) last.endLine = n; else notes.push({ startLine: n, endLine: n });
    }
    entries.push({ startLine: c.startLine, endLine, heading: c.heading, headingLine: c.headingLine, name: c.heading.slice(5),
      origin: c.origin, originLine: c.originLine, rank: c.rank, rankLine: c.rankLine,
      metadata: { Type: c.metadata.Type ?? null, Source: c.metadata.Source, 'Source Page': c.metadata['Source Page'] ?? null, 'PDF Page': c.metadata['PDF Page'] ?? null },
      metadataLines: c.metadataLines, bodies: c.bodies, notes,
      originalText: lines.slice(c.startLine - 1, endLine).map(l => l.raw).join('') }); current = null;
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].text, n = i + 1;
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)\s*$/);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) {
        if (current) current.bodies.push({ startLine: fence.startLine + 1, endLine: n - 1, language: fence.language }); fence = null;
      }
      continue;
    }
    const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (open) {
      if (origin && !current) throw new Error(`Orphan Full Entry at ${n}`);
      fence = { char: open[1][0], length: open[1].length, startLine: n, language: open[2].trim() }; continue;
    }
    if (line.startsWith('## ') && labels.has(line.slice(3))) {
      finish(n - 1); origin = line.slice(3);
      if (seen.has(origin)) throw new Error(`Repeated origin section at ${n}`);
      seen.add(origin); originLine = n; rank = null; rankLine = 0; continue;
    }
    if (!origin) continue;
    if (/^#{1,2} /.test(line)) throw new Error(`Unregistered spell origin/section at ${n}`);
    const rankHeader = line.match(/^### Rank (\d+)$/);
    if (rankHeader) {
      finish(n - 1); rank = Number(rankHeader[1]); rankLine = n;
      if (!Number.isSafeInteger(rank)) throw new Error(`Invalid rank at ${n}`); continue;
    }
    if (line.startsWith('#### ')) {
      finish(n - 1); if (rank === null) throw new Error(`Spell without explicit rank at ${n}`);
      if (!line.slice(5).trim()) throw new Error(`Empty spell name at ${n}`);
      current = { startLine: n, heading: line, headingLine: n, origin, originLine, rank, rankLine, metadata: {}, metadataLines: {}, bodies: [], noteLines: [] }; continue;
    }
    if (line.startsWith('### ')) throw new Error(`Invalid rank heading at ${n}`);
    const meta = line.match(/^- \*\*(Type|Source|Source Page|PDF Page):\*\*\s*(.+?)\s*$/);
    if (meta) {
      if (!current) throw new Error(`Orphan spell metadata at ${n}`);
      const key = meta[1] as MetadataKey;
      if (current.bodies.length && (key === 'Type' || key === 'Source')) {
        const heading: string = current.heading, headingLine: number = current.headingLine;
        finish(n - 1); if (rank === null) throw new Error('Missing rank');
        current = { startLine: n, heading, headingLine, origin, originLine, rank, rankLine, metadata: {}, metadataLines: {}, bodies: [], noteLines: [] };
      }
      if (current.metadata[key] !== undefined || current.bodies.length) throw new Error(`Duplicate/misplaced ${key} at ${n}`);
      current.metadata[key] = meta[2]; current.metadataLines[key] = n;
    } else if (current && line.trim()) current.noteLines.push(n);
    else if (line.trim() && line !== '---') throw new Error(`Unassigned spell content at ${n}`);
  }
  if (fence) throw new Error(`Unclosed fence at ${fence.startLine}`);
  finish(lines.length); if (!entries.length) throw new Error('No spells found'); return entries;
}

export const SpellLedgerSchema = z.object({ schemaVersion: z.literal(1), responsible: z.string().min(1), reason: z.string().min(1),
  entries: z.array(z.object({ occurrenceKey: keyString.max(160), origin: z.string().min(1), rank: z.number().int().nonnegative(),
    heading: z.string().min(1), rawSource: z.string().min(1), entryKey: keyString.max(70), variantKey: keyString.max(40) }).strict()).max(10000),
}).strict();
export function initialLedger(entries: SpellOccurrence[]) {
  const ledger = SpellLedgerSchema.parse({ schemaVersion: 1, responsible: 'Codex / local curation', reason: 'Initial stable publication/origin/rank keys; editorial changes require explicit selector updates.',
    entries: entries.map(e => ({ occurrenceKey: slug(`${e.name}-${e.origin}-rank-${e.rank}-${e.metadata.Source}`), origin: e.origin, rank: e.rank,
      heading: e.heading, rawSource: e.metadata.Source, entryKey: slug(e.name), variantKey: `${slug(e.origin)}-rank-${e.rank}` })) });
  if (new Set(ledger.entries.map(e => e.occurrenceKey)).size !== ledger.entries.length) throw new Error('Initial ledger collision requires explicit discrimination');
  return ledger;
}

// Structural shape read from the CUR-009 sidecar; JSON is data, never executable.
export type PathEvidence = { input: { sha256: string }; sourceRegistrySha256: string; occurrences: { name: string; occurrenceKey: string; entityId: string | null; sourceId: string | null;
  startLine: number; sections: { kind: string; rawText: string; startLine: number }[] }[] };
function signatures(paths: PathEvidence) {
  return paths.occurrences.flatMap(p => p.sections.filter(s => s.kind === 'introduction').flatMap(s => {
    const lines = s.rawText.split(/\r\n|\n|\r/).filter(line => line.trim());
    return lines.length >= 3 && lines[0] === p.name ? [{ path: p, signature: lines.slice(0, 3) }] : [];
  }));
}

export function extractSpells(text: string, registryInput: unknown, ledgerInput: unknown, originsInput: unknown, paths: PathEvidence) {
  const registry = SourceRegistrySchema.parse(registryInput), ledger = SpellLedgerSchema.parse(ledgerInput), origins = OriginsSchema.parse(originsInput);
  const labels = new Map(origins.origins.map(o => [o.label, o]));
  if (labels.size !== origins.origins.length) throw new Error('Duplicate origins');
  const parsed = parseSpells(text, [...labels.keys()]), lines = sourceLines(text), hash = sha(text), fingerprints = signatures(paths);
  const selector = (origin: string, rank: number, heading: string, source: string) => JSON.stringify([origin, rank, heading, source]);
  const keys = new Map(ledger.entries.map(e => [selector(e.origin, e.rank, e.heading, e.rawSource), e]));
  if (keys.size !== ledger.entries.length || new Set(ledger.entries.map(e => e.occurrenceKey)).size !== ledger.entries.length) throw new Error('Duplicate ledger selector/key');
  const sourceRefs = new Map(registry.references.filter(r => r.path === INPUT && r.role === 'metadata').map(r => [r.line, r]));
  const used = new Set<string>(), ids = new Set<string>();
  const results = parsed.map(e => {
    const key = keys.get(selector(e.origin, e.rank, e.heading, e.metadata.Source!));
    if (!key || used.has(key.occurrenceKey)) throw new Error(`Ledger missing/ambiguous: ${e.heading}`); used.add(key.occurrenceKey);
    const ref = sourceRefs.get(e.metadataLines.Source!);
    if (!ref || ref.inputSha256 !== hash || ref.label !== e.metadata.Source) throw new Error(`Registry evidence mismatch: ${e.heading}`);
    const sourceId = ref.sourceId, classification = labels.get(e.origin)!;
    const namedPaths = classification.kind === 'path' ? paths.occurrences.filter(p => p.name === e.origin) : [];
    const samePublicationPaths = namedPaths.filter(p => sourceId !== null && p.sourceId === sourceId);
    const originPaths = samePublicationPaths.length ? samePublicationPaths : namedPaths;
    const foreignText = e.bodies.flatMap(b => fingerprints.flatMap(fp => {
      const hits: { pathName: string; pathOccurrenceKey: string; pathEntityId: string | null; startLine: number; endLine: number }[] = [];
      for (let n = b.startLine; n + 2 <= b.endLine; n++) if (fp.signature.every((line, i) => lines[n - 1 + i].text === line))
        hits.push({ pathName: fp.path.name, pathOccurrenceKey: fp.path.occurrenceKey, pathEntityId: fp.path.entityId, startLine: n, endLine: n + 2 });
      return hits;
    }));
    const structuralWarnings = [...(classification.kind === 'unresolved' ? ['unresolved-origin-kind'] : []),
      ...(classification.kind === 'path' && !originPaths.length ? ['path-origin-without-named-path-evidence'] : []),
      ...(foreignText.length ? ['path-introduction-inside-spell-review-required'] : [])];
    const identity = sourceId ? { sourceId, kind: 'spell' as const, entryKey: key.entryKey, variantKey: key.variantKey } : null;
    const id = identity ? entityId(identity) : null;
    if (id && ids.has(id)) throw new Error(`Duplicate identity: ${id}`); if (id) ids.add(id);
    const pending = sourceId ? null : registry.pending.find(p => p.path === INPUT && p.line === ref.line);
    const printedPage = e.metadata['Source Page'] && /^\d+$/.test(e.metadata['Source Page']) && Number.isSafeInteger(Number(e.metadata['Source Page'])) && Number(e.metadata['Source Page']) > 0 ? Number(e.metadata['Source Page']) : null;
    const evidenceId = `spell:${key.occurrenceKey}:md`, originId = `spell:${key.occurrenceKey}:origin`, rankId = `spell:${key.occurrenceKey}:rank`, headingId = `spell:${key.occurrenceKey}:name`;
    const excerpt = lines.slice(e.startLine - 1, e.endLine).map(l => l.text).join('\n');
    const axis = (status: string, reason: string, evidenceIds: string[] = []) => ({ status, responsible: 'Codex / local extraction', reason, evidenceIds });
    const evidence = (id: string, startLine: number, endLine: number, excerpt: string, heading: string) => ({ id, medium: 'md', path: INPUT, inputSha256: hash,
      startLine, endLine, physicalPdfPage: null, printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: e.metadata['PDF Page'], heading, excerpt, excerptSha256: sha(excerpt), claim: 'MD transcription/context only; no PDF, mechanical or eligibility certification.' });
    const staging = StagingEntrySchema.parse({ schemaVersion: 1, id, identity, name: e.name, kind: 'spell',
      source: { status: sourceId ? 'resolved' : 'pending', sourceId, rawLabel: e.metadata.Source,
        reason: sourceId ? 'Resolved CUR-003 reference; edition/permission unconfirmed.' : pending?.reason ?? 'Unresolved source.' },
      representation: 'full-text', originalText: e.originalText, normalizedText: null, normalizationDiffRef: null,
      printedPage, pdfPageDeclared: e.metadata['PDF Page'], stage: sourceId && !structuralWarnings.length ? 'captured' : 'blocked',
      scopeTags: sourceId === 'sotdl:shadow-of-the-demon-lord-core' ? ['BASE'] : [], region: null, searchAliases: [], equivalenceGroupIds: [], lineage: [],
      review: { schemaVersion: 1, subjectId: id ?? `pending:${key.occurrenceKey}`, sourcePermission: axis('needs-review', 'No edition/permission certification inherited from MD.'),
        transcription: axis('md-checked', 'Exact MD capture and explicit inherited context.', [evidenceId, originId, rankId, headingId]),
        structure: axis(structuralWarnings.length ? 'blocked' : 'unreviewed', structuralWarnings.length ? structuralWarnings.join('; ') : 'Automatic MD boundaries; publication completeness not checked.', structuralWarnings.length ? [evidenceId] : []),
        mechanics: axis('unreviewed', 'No inference of Type, rank changes, optional fields, effects or eligibility.'),
        automation: { ...axis('unsupported', 'Staging only; no spell execution.'), handlerRef: null, testRefs: [] },
        evidence: [evidence(evidenceId, e.startLine, e.endLine, excerpt, e.heading),
          evidence(originId, e.originLine, e.originLine, lines[e.originLine - 1].text, lines[e.originLine - 1].text),
          evidence(rankId, e.rankLine, e.rankLine, lines[e.rankLine - 1].text, lines[e.rankLine - 1].text),
          evidence(headingId, e.headingLine, e.headingLine, lines[e.headingLine - 1].text, e.heading)] } });
    const detail = { occurrenceKey: key.occurrenceKey, entityId: id, name: e.name, heading: e.heading, headingLine: e.headingLine,
      origin: e.origin, originKind: classification.kind, originReason: classification.reason, originLine: e.originLine,
      originPathRefs: originPaths.map(p => ({ occurrenceKey: p.occurrenceKey, entityId: p.entityId, sourceId: p.sourceId, samePublication: p.sourceId === sourceId })), rank: e.rank, rankLine: e.rankLine,
      typeDeclared: e.metadata.Type, sourceId, sourceLabel: e.metadata.Source, candidateSourceId: pending?.candidateSourceId ?? null,
      printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: e.metadata['PDF Page'], startLine: e.startLine, endLine: e.endLine, metadataLines: e.metadataLines,
      fullEntryBlocks: e.bodies.map(b => ({ ...b, sha256: sha(lines.slice(b.startLine - 1, b.endLine).map(l => l.text).join('\n')) })),
      fieldMarkers: e.bodies.flatMap(b => lines.slice(b.startLine - 1, b.endLine).flatMap((line, i) => {
        const match = line.text.match(/^(Requirements?|Targets?|Area|Range|Duration|Effect|Attack Roll 20\+|Triggered|Sacrifice|Permanence|Aftereffects?)(?=\s|:|$)/);
        return match ? [{ line: b.startLine + i, label: match[1], rawLine: line.text }] : [];
      })), foreignPathText: foreignText,
      notes: e.notes.map(n => ({ ...n, text: lines.slice(n.startLine - 1, n.endLine).map(l => l.text).join('\n'), applied: false })),
      warnings: [...structuralWarnings, ...(classification.kind === 'path' && namedPaths.length && !samePublicationPaths.length ? ['cross-publication-path-link-unreviewed'] : []),
        ...(sourceId ? [] : ['unresolved-source']), ...(e.metadata.Type === null ? ['type-not-declared'] : []), ...(printedPage === null ? ['printed-page-not-a-single-positive-integer'] : [])] };
    return { staging, detail, outputPath: `curation/entries/${sourceId ? encodeURIComponent(sourceId) : '_pending'}/spell.jsonl` };
  });
  if (used.size !== ledger.entries.length) throw new Error('Unused ledger entries require reconciliation');
  if (new Set(parsed.map(e => e.origin)).size !== labels.size) throw new Error('Unused origin classifications require reconciliation');
  return results;
}

export async function buildArtifacts(root: string) {
  const read = (path: string) => readFile(resolve(root, path));
  const manifestBytes = await read('curation/input-manifest.json'), manifest = InputManifestSchema.parse(JSON.parse(manifestBytes.toString('utf8')));
  const file = manifest.files.find(f => f.path === INPUT); if (!file) throw new Error('Spell input missing from manifest');
  const bytes = await read(INPUT); if (bytes.length > 16 * 1024 * 1024) throw new Error('Spell input exceeds 16 MiB');
  if (sha(bytes) !== file.sha256) throw new Error('Spell input changed; revise manifest first.');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); if (Buffer.from(text).compare(bytes) !== 0) throw new Error('Byte-preserving decode required');
  const registryBytes = await read('curation/sources.json'), registry = SourceRegistrySchema.parse(JSON.parse(registryBytes.toString('utf8')));
  if (registry.inputManifestSha256 !== sha(manifestBytes) || registry.aliasDecisionsSha256 !== sha(await read('curation/source-aliases.json'))) throw new Error('Registry revision mismatch');
  const ledgerBytes = await read(LEDGER), originsBytes = await read(ORIGINS), pathsBytes = await read('curation/reports/paths.json');
  const paths: PathEvidence = JSON.parse(pathsBytes.toString('utf8'));
  const pathInput = manifest.files.find(f => f.path.includes('_All_Paths_'));
  if (!pathInput || paths.input.sha256 !== pathInput.sha256 || paths.sourceRegistrySha256 !== sha(registryBytes) || sha(await read(pathInput.path)) !== pathInput.sha256) throw new Error('Path evidence revision mismatch');
  const results = extractSpells(text, registry, JSON.parse(ledgerBytes.toString('utf8')), JSON.parse(originsBytes.toString('utf8')), paths);
  const artifacts = new Map<string, string>();
  for (const r of [...results].sort((a, b) => { const left = a.staging.id ?? a.detail.occurrenceKey, right = b.staging.id ?? b.detail.occurrenceKey; return left < right ? -1 : left > right ? 1 : 0; })) {
    const output = JSON.stringify(r.staging) + '\n'; if (Buffer.byteLength(output) > 4 * 1024 * 1024) throw new Error('Staging record exceeds 4 MiB');
    artifacts.set(r.outputPath, (artifacts.get(r.outputPath) ?? '') + output);
  }
  const lines = sourceLines(text), excludedRanges: (Span & { reason: string })[] = []; let cursor = 1;
  for (const r of results) { if (cursor < r.detail.startLine) excludedRanges.push({ startLine: cursor, endLine: r.detail.startLine - 1, reason: cursor === 1 ? 'prelude-origin-and-rank-headers' : 'origin-rank-headers-and-separators' }); cursor = r.detail.endLine + 1; }
  if (cursor <= lines.length) excludedRanges.push({ startLine: cursor, endLine: lines.length, reason: 'trailing-non-entry-content' });
  const counts = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map(v => [v, values.filter(x => x === v).length]));
  const sourceLabels = new Set(results.map(r => r.detail.sourceLabel)).size;
  const report = { schemaVersion: 1, task: 'CUR-010', reviewDate: manifest.reviewDate,
    extractor: { version: '1.0.0', sha256: sha(await read('tools/curation/spell-extractor.ts')), runnerSha256: sha(await read('tools/curation/spells.mjs')), lineUtilitySha256: sha(await read('tools/curation/ancestry-extractor.ts')) },
    input: file, inputManifestSha256: sha(manifestBytes), sourceRegistrySha256: sha(registryBytes), ledgerSha256: sha(ledgerBytes), originsSha256: sha(originsBytes), pathReportSha256: sha(pathsBytes),
    counts: { occurrences: results.length, origins: new Set(results.map(r => r.detail.origin)).size, sourceLabels,
      originKinds: counts([...new Map(results.map(r => [r.detail.origin, r.detail.originKind])).values()]),
      sourceResolved: results.filter(r => r.staging.id).length, sourcePending: results.filter(r => !r.staging.id).length,
      captured: results.filter(r => r.staging.stage === 'captured').length, blocked: results.filter(r => r.staging.stage === 'blocked').length,
      structuralWarnings: results.filter(r => r.staging.review.structure.status === 'blocked').length,
      types: counts(results.map(r => r.detail.typeDeclared ?? '(not declared)')), ranks: counts(results.map(r => String(r.detail.rank))) },
    declaredCounts: { occurrences: 1520, origins: 57, sourceLabels: 27 },
    discrepancies: sourceLabels === 27 ? [] : [{ field: 'sourceLabels', declared: 27, observed: sourceLabels, reason: 'Metadata source labels differ from audit summary; preserve every occurrence. Full reconciliation remains CUR-013.' }],
    coverage: { inputLines: lines.length, occurrenceLines: results.reduce((sum, r) => sum + r.detail.endLine - r.detail.startLine + 1, 0), excludedRanges },
    outputs: [...artifacts].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, data]) => ({ path, sha256: sha(data), records: data.trimEnd().split('\n').length })),
    occurrences: results.map(r => r.detail) };
  artifacts.set(REPORT, JSON.stringify(report, null, 2) + '\n'); return { artifacts, report };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--init-ledger', '--write', '--check'].includes(args[0])) throw new Error('Use --init-ledger (once), --write or --check');
  if (args[0] === '--init-ledger') {
    for (const path of [LEDGER, ORIGINS]) {
      try { await access(resolve(root, path)); throw new Error(`Refusing to overwrite ${path}`); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    }
    const text = await readFile(resolve(root, INPUT), 'utf8'), lines = sourceLines(text);
    // Initial taxonomy for this inspected corpus only; future groupings require explicit review.
    const originLabels = lines.flatMap((l, i) => l.text.startsWith('## ') && /^### Rank \d+$/.test(lines.slice(i + 1).find(next => next.text.trim())?.text ?? '') ? [l.text.slice(3)] : []);
    const origins: Origins = OriginsSchema.parse({ schemaVersion: 1, responsible: 'Codex / local grouping classification', origins: originLabels.map(label => ({ label,
      kind: pathOriginNames.includes(label) ? 'path' : 'tradition', reason: pathOriginNames.includes(label) ? 'Explicit Path grouping; verify matching CUR-009 publication for each spell.' : 'Tradition grouping in this inspected MD; no access or mechanical rules inferred.' })) });
    const ledger = initialLedger(parseSpells(text, originLabels));
    await writeFile(resolve(root, ORIGINS), JSON.stringify(origins, null, 2) + '\n', { flag: 'wx' });
    await writeFile(resolve(root, LEDGER), JSON.stringify(ledger, null, 2) + '\n', { flag: 'wx' });
    console.log(`Spell ledger: ${ledger.entries.length} keys; ${origins.origins.length} origin classifications. Review before extraction.`); return;
  }
  const { artifacts, report } = await buildArtifacts(root);
  const dirs = await readdir(resolve(root, 'curation/entries'), { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => { if (error.code === 'ENOENT') return []; throw error; });
  for (const dir of dirs) {
    if (dir.isSymbolicLink()) throw new Error('Symlink in staging directory'); if (!dir.isDirectory()) continue;
    const path = `curation/entries/${dir.name}/spell.jsonl`;
    try { await readFile(resolve(root, path)); if (!artifacts.has(path)) throw new Error(`Orphan spell output requires reconciliation: ${path}`); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  }
  for (const [path, output] of artifacts) {
    if (args[0] === '--write') { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), output); }
    else if (await readFile(resolve(root, path), 'utf8') !== output) throw new Error(`Generated spell artifact changed: ${path}`);
  }
  console.log(`Spells: ${report.counts.occurrences} occurrences, ${report.counts.origins} origins; ${report.counts.captured} captured, ${report.counts.blocked} blocked (${report.counts.sourcePending} source pending). ${args[0]}`);
}
