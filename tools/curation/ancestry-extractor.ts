import { assertSafeArtifact } from './privacy.mjs';
import { sanitizeArtifact } from './privacy.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { entityId } from '../../packages/curation/identity';
import { InputManifestSchema, SourceRegistrySchema } from '../../packages/curation/registries';

export const INPUT = 'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
const LEDGER = 'curation/ancestry-ledger.json';
const REPORT = 'curation/reports/ancestries.json';
const VERSION = '1.0.0';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const slug = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const metadataKeys = ['Entry Type', 'Source', 'Source Page', 'PDF Page'] as const;
type MetadataKey = typeof metadataKeys[number];
type Span = { startLine: number; endLine: number };
type Body = Span & { language: string };
export type Occurrence = Span & {
  heading: string; name: string; metadata: Record<MetadataKey, string>;
  metadataLines: Record<MetadataKey, number>; bodies: Body[]; notes: Span[]; originalText: string;
};
export function sourceLines(text: string) {
  return [...text.matchAll(/[^\r\n]*(?:\r\n|\n|\r|$)/g)].filter(m => m[0] !== '').map(m => ({ raw: m[0], text: m[0].replace(/[\r\n]+$/, '') }));
}

/** Boundaries are Markdown headings outside fences, never uppercase PDF text. */
export function parseAncestries(text: string): Occurrence[] {
  const lines = sourceLines(text); const entries: Occurrence[] = [];
  let active = false, found = false;
  let current: { startLine: number; heading: string; metadata: Partial<Record<MetadataKey, string>>;
    metadataLines: Partial<Record<MetadataKey, number>>; bodies: Body[]; noteLines: number[] } | null = null;
  let fence: { char: string; length: number; startLine: number; language: string } | null = null;
  function finish(endLine: number) {
    if (!current) return;
    const c = current;
    for (const key of metadataKeys) if (!c.metadata[key]) throw new Error(`${c.heading}:${c.startLine}: missing ${key}`);
    if (!c.bodies.length || c.bodies.some(b => b.endLine < b.startLine)) throw new Error(`${c.heading}: missing/empty Full Entry`);
    const metadata = c.metadata as Record<MetadataKey, string>;
    const suffix = ` — ${metadata.Source}`;
    const title = c.heading.slice(4);
    const notes: Span[] = [];
    for (const line of c.noteLines) {
      const previous = notes.at(-1);
      if (previous && previous.endLine + 1 === line) previous.endLine = line;
      else notes.push({ startLine: line, endLine: line });
    }
    entries.push({ startLine: c.startLine, endLine, heading: c.heading,
      name: title.endsWith(suffix) ? title.slice(0, -suffix.length) : title,
      metadata, metadataLines: c.metadataLines as Record<MetadataKey, number>, bodies: c.bodies, notes,
      originalText: lines.slice(c.startLine - 1, endLine).map(l => l.raw).join('') });
    current = null;
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].text, n = i + 1;
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)\s*$/);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) {
        if (active && current) current.bodies.push({ startLine: fence.startLine + 1, endLine: n - 1, language: fence.language });
        fence = null;
      }
      continue;
    }
    const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (open) { fence = { char: open[1][0], length: open[1].length, startLine: n, language: open[2].trim() }; continue; }
    if (line === '## Ancestries') {
      if (found) throw new Error('Duplicate Ancestries section');
      active = found = true; continue;
    }
    if (!active) continue;
    if (/^#{1,2} /.test(line)) { finish(n - 1); active = false; continue; }
    if (line.startsWith('### ')) {
      finish(n - 1); current = { startLine: n, heading: line, metadata: {}, metadataLines: {}, bodies: [], noteLines: [] }; continue;
    }
    const meta = line.match(/^- \*\*(Entry Type|Source|Source Page|PDF Page):\*\*\s*(.+?)\s*$/);
    if (meta) {
      if (!current) throw new Error(`Orphan ancestry metadata at ${n}`);
      const key = meta[1] as MetadataKey;
      if (current.metadata[key] !== undefined || current.bodies.length) throw new Error(`Duplicate/misplaced ${key} at ${n}`);
      current.metadata[key] = meta[2]; current.metadataLines[key] = n;
    } else if (current && line.trim()) current.noteLines.push(n);
    else if (!current && line.trim() && line !== '---') throw new Error(`Unassigned content in Ancestries at ${n}`);
  }
  if (fence) throw new Error(`Unclosed fence at ${fence.startLine}`);
  finish(lines.length);
  if (!found || !entries.length) throw new Error('No ancestry entries found');
  return entries;
}

export const LedgerSchema = z.object({
  schemaVersion: z.literal(1), responsible: z.string().min(1), reason: z.string().min(1),
  entries: z.array(z.object({
    occurrenceKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(150),
    heading: z.string().min(1), rawSource: z.string().min(1),
    entryKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(70),
    variantKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(40),
  }).strict()).max(10000),
}).strict();
export function initialLedger(entries: Occurrence[]) {
  return LedgerSchema.parse({ schemaVersion: 1, responsible: 'Codex / local curation',
    reason: 'Initial immutable keys; future label changes require explicit selector updates, never key regeneration.',
    entries: entries.map(e => ({ occurrenceKey: slug(`${e.name}-${e.metadata.Source}`), heading: e.heading,
      rawSource: e.metadata.Source, entryKey: slug(e.name),
      variantKey: ({ 'Expanded Ancestry': 'expanded', 'Ancestry Variant': 'variant', 'Derived Ancestry': 'derived', 'Ancestry Template': 'template', 'Powerful Ancestry': 'powerful', 'Beastman Ancestry': 'beastman' } as Record<string, string>)[e.metadata['Entry Type']] ?? 'default' })) });
}

export function extractAncestries(text: string, registryInput: unknown, ledgerInput: unknown) {
  const registry = SourceRegistrySchema.parse(registryInput), ledger = LedgerSchema.parse(ledgerInput);
  const entries = parseAncestries(text), lines = sourceLines(text), inputHash = sha(Buffer.from(text, 'utf8'));
  const selector = (heading: string, source: string) => JSON.stringify([heading, source]);
  const keys = new Map(ledger.entries.map(e => [selector(e.heading, e.rawSource), e]));
  if (keys.size !== ledger.entries.length || new Set(ledger.entries.map(e => e.occurrenceKey)).size !== ledger.entries.length)
    throw new Error('Duplicate ledger selector/occurrenceKey');
  const used = new Set<string>(), ids = new Set<string>();
  const results = entries.map(e => {
    const key = keys.get(selector(e.heading, e.metadata.Source));
    if (!key || used.has(key.occurrenceKey)) throw new Error(`Ledger missing/ambiguous: ${e.heading}`);
    used.add(key.occurrenceKey);
    const refs = registry.references.filter(r => r.path === INPUT && r.line === e.metadataLines.Source && r.role === 'metadata');
    if (refs.length !== 1 || refs[0].inputSha256 !== inputHash || refs[0].label !== e.metadata.Source)
      throw new Error(`Registry evidence mismatch: ${e.heading}`);
    const ref = refs[0], sourceId = ref.sourceId;
    const identity = sourceId ? { sourceId, kind: 'ancestry' as const, entryKey: key.entryKey, variantKey: key.variantKey } : null;
    const id = identity ? entityId(identity) : null;
    if (id && ids.has(id)) throw new Error(`Duplicate identity: ${id}`);
    if (id) ids.add(id);
    const evidenceId = `ancestry:${key.occurrenceKey}:md`;
    const excerpt = lines.slice(e.startLine - 1, e.endLine).map(l => l.text).join('\n');
    const axis = (status: string, reason: string, evidenceIds: string[] = []) => ({ status, responsible: 'Codex / local extraction', reason, evidenceIds });
    const pending = sourceId ? null : registry.pending.find(p => p.path === INPUT && p.line === ref.line && p.label === ref.label);
    const printedPage = /^\d+$/.test(e.metadata['Source Page']) && Number.isSafeInteger(Number(e.metadata['Source Page'])) && Number(e.metadata['Source Page']) > 0 ? Number(e.metadata['Source Page']) : null;
    const staging = StagingEntrySchema.parse({ schemaVersion: 1, id, identity, name: e.name, kind: 'ancestry',
      source: { status: sourceId ? 'resolved' : 'pending', sourceId, rawLabel: e.metadata.Source,
        reason: sourceId ? 'Resolved metadata reference in CUR-003; edition and permission remain unconfirmed.' : pending?.reason ?? 'Unresolved publication.' },
      representation: 'full-text', originalText: e.originalText, normalizedText: null, normalizationDiffRef: null,
      printedPage, pdfPageDeclared: e.metadata['PDF Page'], stage: sourceId ? 'captured' : 'blocked',
      scopeTags: sourceId === 'sotdl:shadow-of-the-demon-lord-core' ? ['BASE'] : [], region: null,
      searchAliases: e.heading.slice(4) === e.name ? [] : [e.heading.slice(4)], equivalenceGroupIds: [], lineage: [],
      review: { schemaVersion: 1, subjectId: id ?? `pending:${key.occurrenceKey}`,
        sourcePermission: axis('needs-review', 'No authorization/edition certification inherited from MD.'),
        transcription: axis('md-checked', 'Exact MD bytes/range captured; no PDF inspection or editorial correction.', [evidenceId]),
        structure: axis('unreviewed', 'Markdown boundaries checked automatically; completeness of original publication requires review.'),
        mechanics: axis('unreviewed', 'No numerical interpretation or mechanical approval.'),
        automation: { ...axis('unsupported', 'Staging only; no runtime mechanics compiled.'), handlerRef: null, testRefs: [] },
        evidence: [{ id: evidenceId, medium: 'md', path: INPUT, inputSha256: inputHash, startLine: e.startLine, endLine: e.endLine,
          physicalPdfPage: null, printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: e.metadata['PDF Page'], heading: e.heading,
          excerpt, excerptSha256: sha(excerpt), claim: 'Complete MD occurrence, including metadata, Full Entry and associated editorial notes; not PDF certification.' }] } });
    // Preserve Entry Type/body boundaries/notes in a sidecar, without changing the frozen staging schema.
    const detail = { occurrenceKey: key.occurrenceKey, entityId: id, heading: e.heading, name: e.name,
      entryType: e.metadata['Entry Type'], sourceLabel: e.metadata.Source, sourceId,
      candidateSourceId: pending?.candidateSourceId ?? null, variantKey: key.variantKey,
      printedPageDeclared: e.metadata['Source Page'], pdfPageDeclared: e.metadata['PDF Page'],
      startLine: e.startLine, endLine: e.endLine, metadataLines: e.metadataLines,
      fullEntryBlocks: e.bodies.map(b => ({ ...b, sha256: sha(lines.slice(b.startLine - 1, b.endLine).map(l => l.text).join('\n')) })),
      notes: e.notes.map(n => ({ ...n, text: lines.slice(n.startLine - 1, n.endLine).map(l => l.text).join('\n'), applied: false })),
      warnings: [...(sourceId ? [] : ['unresolved-source']), ...(printedPage === null ? ['printed-page-not-a-single-positive-integer'] : [])] };
    return { staging, detail, outputPath: `curation/entries/${sourceId ? encodeURIComponent(sourceId) : '_pending'}/ancestry.jsonl` };
  });
  if (used.size !== ledger.entries.length) throw new Error('Unused ledger entries: explicit reconciliation required.');
  return results;
}

export async function buildArtifacts(root: string) {
  const read = (path: string) => readFile(resolve(root, path));
  const manifestBytes = await read('curation/input-manifest.json');
  const manifest = InputManifestSchema.parse(JSON.parse(manifestBytes.toString('utf8')));
  const file = manifest.files.find(f => f.path === INPUT); if (!file) throw new Error('Ancestry input missing from manifest');
  const bytes = await read(INPUT); if (bytes.length > 16 * 1024 * 1024) throw new Error('Ancestry input exceeds 16 MiB.');
  if (sha(bytes) !== file.sha256) throw new Error('Ancestry input changed; revise manifest first.');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (Buffer.from(text).compare(bytes) !== 0) throw new Error('Byte-preserving decode required; BOM needs explicit handling.');
  const registryBytes = await read('curation/sources.json'), ledgerBytes = await read(LEDGER);
  const registry = SourceRegistrySchema.parse(JSON.parse(registryBytes.toString('utf8')));
  if (registry.inputManifestSha256 !== sha(manifestBytes)) throw new Error('Registry/manifest revision mismatch');
  if (registry.aliasDecisionsSha256 !== sha(await read('curation/source-aliases.json'))) throw new Error('Alias decisions changed; revise registry first.');
  const results = extractAncestries(text, registry, JSON.parse(ledgerBytes.toString('utf8')));
  const artifacts = new Map<string, string>();
  for (const r of [...results].sort((a, b) => {
    const left = a.staging.id ?? a.detail.occurrenceKey, right = b.staging.id ?? b.detail.occurrenceKey;
    return left < right ? -1 : left > right ? 1 : 0;
  })) {
    const jsonl = JSON.stringify(sanitizeArtifact(r.staging)) + '\n';
    if (Buffer.byteLength(jsonl) > 4 * 1024 * 1024) throw new Error(`Staging record exceeds 4 MiB: ${r.detail.occurrenceKey}`);
    artifacts.set(r.outputPath, (artifacts.get(r.outputPath) ?? '') + jsonl);
  }
  const parsed = parseAncestries(text), lines = sourceLines(text);
  const counts = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map(v => [v, values.filter(x => x === v).length]));
  const report = { schemaVersion: 1, task: 'CUR-008', reviewDate: manifest.reviewDate,
    extractor: { privacyPolicySha256: sha(await read('tools/curation/privacy.mjs')), version: VERSION, sha256: sha(await read('tools/curation/ancestry-extractor.ts')), runnerSha256: sha(await read('tools/curation/ancestries.mjs')) },
    input: file, inputManifestSha256: sha(manifestBytes), sourceRegistrySha256: sha(registryBytes), ledgerSha256: sha(ledgerBytes),
    counts: { occurrences: results.length, names: new Set(results.map(r => r.staging.name)).size,
      sourceLabels: new Set(results.map(r => r.detail.sourceLabel)).size, resolved: results.filter(r => r.staging.id).length,
      blocked: results.filter(r => !r.staging.id).length, entryTypes: counts(results.map(r => r.detail.entryType)) },
    coverage: { inputLines: lines.length, prelude: { startLine: 1, endLine: parsed[0].startLine - 1 },
      occurrenceLines: parsed.reduce((sum, e) => sum + e.endLine - e.startLine + 1, 0),
      trailingNonEntryLines: lines.length - parsed.at(-1)!.endLine,
      note: 'Counts describe this ancestry MD only; cross-corpus reconciliation remains CUR-013. No publication completeness or mechanical certification.' },
    outputs: [...artifacts].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, data]) => ({ path, sha256: sha(data), records: data.trimEnd().split('\n').length })),
    occurrences: results.map(r => r.detail) };
  artifacts.set(REPORT, JSON.stringify(sanitizeArtifact(report), null, 2) + '\n');
  return { artifacts, report };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--write', '--check', '--init-ledger'].includes(args[0])) throw new Error('Use --init-ledger (once), --write or --check');
  if (args[0] === '--init-ledger') {
    const text = await readFile(resolve(root, INPUT), 'utf8');
    const ledger = initialLedger(parseAncestries(text));
    await writeFile(resolve(root, LEDGER), JSON.stringify(ledger, null, 2) + '\n', { flag: 'wx' });
    console.log(`Initial ledger: ${ledger.entries.length} entries; review before extraction.`); return;
  }
  const { artifacts, report } = await buildArtifacts(root);
  // Detect orphaned generated ancestry files without deleting or moving anything.
  const entriesRoot = resolve(root, 'curation/entries');
  const dirs = await readdir(entriesRoot, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => { if (error.code === 'ENOENT') return []; throw error; });
  for (const dir of dirs) {
    if (dir.isSymbolicLink()) throw new Error('Symlink in staging directory');
    if (!dir.isDirectory()) continue;
    const path = `curation/entries/${dir.name}/ancestry.jsonl`;
    try { await readFile(resolve(root, path)); if (!artifacts.has(path)) throw new Error(`Orphan staging output requires explicit reconciliation: ${path}`); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  }
  for (const [path, output] of artifacts) { assertSafeArtifact(path, output);
    if (args[0] === '--write') { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), output); }
    else if (await readFile(resolve(root, path), 'utf8') !== output) throw new Error(`Generated ancestry artifact changed: ${path}`);
  }
  console.log(`Ancestries: ${report.counts.occurrences} occurrences, ${report.counts.names} names; ${report.counts.resolved} resolved, ${report.counts.blocked} blocked. ${args[0]}`);
}
