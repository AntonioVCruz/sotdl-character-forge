import { assertSafeArtifact } from './privacy.mjs';
import { redactBuyerLines } from './privacy.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, isAbsolute, sep } from 'node:path';
import { z } from 'zod';
import { InputManifestSchema, SourceRegistrySchema } from '../../packages/curation/registries';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { sourceLines } from './ancestry-extractor';
import { replayChanges, LineChangeSchema, NormalizationOverlaySchema } from './editorial-normalizer';

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const AUDIT_DATE = '2026-10-27';
const REPORT = 'curation/reports/reconciliation.json';
const BASE = 'curation/reconciliation';
const positive = z.number().int().positive();
const SpanSchema = z.object({ startLine: positive, endLine: positive }).passthrough();
type Span = { startLine: number; endLine: number };
const OccurrenceSchema = SpanSchema.extend({
  occurrenceKey: z.string(), entityId: z.string().nullable(), name: z.string(), sourceId: z.string().nullable(), sourceLabel: z.string(),
  metadataLines: z.record(z.string(), positive), fullEntryBlocks: z.array(SpanSchema),
  headingLine: positive.optional(), category: z.string().optional(), entryType: z.string().optional(), origin: z.string().optional(), rank: z.number().int().optional(),
});
const ReportSchema = z.object({
  task: z.string(), input: z.object({ path: z.string(), sha256: z.string(), lines: positive }).passthrough(),
  inputManifestSha256: z.string(), sourceRegistrySha256: z.string(), counts: z.record(z.string(), z.unknown()),
  outputs: z.array(z.object({ path: z.string(), sha256: z.string(), records: z.number().int().optional() }).passthrough()),
  coverage: z.object({ excludedRanges: z.array(SpanSchema.extend({ reason: z.string() })).optional(), prelude: SpanSchema.optional(), trailingNonEntryLines: z.number().int().optional() }).passthrough(),
  occurrences: z.array(OccurrenceSchema).optional(),
}).passthrough();
const SegmentSchema = SpanSchema.extend({
  unitKey: z.string().nullable(), entityId: z.string().nullable(), name: z.string(), category: z.string(), subtype: z.string(), status: z.string(),
  originalText: z.string(), warnings: z.array(z.string()),
  attributionResolution: z.object({ sourceId: z.string(), resolution: z.literal('latest-source'), reason: z.string() }).passthrough().nullable().optional(),
  container: SpanSchema.extend({ sourceLine: positive, section: z.string() }),
  sources: z.array(z.object({ label: z.string(), sourceId: z.string().nullable(), line: positive })),
  evidence: z.object({ path: z.string(), inputSha256: z.string(), startLine: positive, endLine: positive, excerpt: z.string(), excerptSha256: z.string() }).passthrough(),
});

export type CoverageRange = Span & { destination: string; reason: string };
/** Exact, independent ownership check; summary totals alone cannot hide an omitted interval. */
export function auditCoverage(totalLines: number, ranges: CoverageRange[]) {
  if (!Number.isSafeInteger(totalLines) || totalLines < 1) throw new Error('Invalid line count');
  const sorted = [...ranges].sort((a, b) => a.startLine - b.startLine || a.endLine - b.endLine);
  let cursor = 1;
  for (const r of sorted) {
    if (!Number.isSafeInteger(r.startLine) || !Number.isSafeInteger(r.endLine) || r.startLine < 1 || r.endLine < r.startLine || r.endLine > totalLines || !r.destination || !r.reason) throw new Error('Invalid coverage range/destination');
    if (r.startLine > cursor) throw new Error(`Coverage gap: ${cursor}–${r.startLine - 1}`);
    if (r.startLine < cursor) throw new Error(`Coverage overlap at ${r.startLine}`);
    cursor = r.endLine + 1;
  }
  if (cursor !== totalLines + 1) throw new Error(`Coverage gap: ${cursor}–${totalLines}`);
  return { totalLines, coveredLines: cursor - 1, ranges: sorted.length, gaps: 0, overlaps: 0 };
}

export function scanStructure(text: string) {
  const lines = sourceLines(text), headings: { line: number; depth: number; text: string }[] = [], sources: { line: number; label: string; plural: boolean }[] = [], fences: Span[] = [];
  let fence: { char: string; length: number; line: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].text, n = i + 1;
    if (fence) {
      const close = text.match(/^ {0,3}(`+|~+)\s*$/);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) { fences.push({ startLine: fence.line + 1, endLine: n - 1 }); fence = null; }
      continue;
    }
    const open = text.match(/^ {0,3}(`{3,}|~{3,})/);
    if (open) { fence = { char: open[1][0], length: open[1].length, line: n }; continue; }
    const h = text.match(/^(#{1,6}) (.+)$/); if (h) headings.push({ line: n, depth: h[1].length, text: h[2] });
    const s = text.match(/^(?:- )?\*\*(Source|Fonte|Fontes):\*\*\s*(.+)$/);
    if (s) sources.push({ line: n, label: s[2], plural: s[1] === 'Fontes' });
  }
  if (fence) throw new Error(`Unclosed fence at ${fence.line}`);
  return { headings, sources, fences };
}

export function sourceDeclarations(text: string, beforeLine: number) {
  const structure = scanStructure(text), headings = new Map(structure.headings.map(h => [h.line, h]));
  const result: { line: number; label: string; expected: number; scope: 'formal-count' | 'no-formal-entry' }[] = [];
  let scope: 'formal-count' | 'no-formal-entry' | null = null;
  const lines = sourceLines(text);
  for (let i = 0; i < Math.min(beforeLine - 1, lines.length); i++) {
    if (structure.fences.some(f => i + 1 >= f.startLine && i + 1 <= f.endLine)) continue;
    const heading = headings.get(i + 1);
    if (heading) scope = /^Fontes com (?:entradas de ancestry|Paths)$/.test(heading.text) ? 'formal-count'
      : /^Fontes fornecidas sem (?:nova entrada formal de ancestry|Path formal detectado)$/.test(heading.text) ? 'no-formal-entry' : null;
    if (scope === 'formal-count') {
      const m = lines[i].text.match(/^- \*\*(.+?)\*\* — (\d+) entrada/); if (m) result.push({ line: i + 1, label: m[1], expected: Number(m[2]), scope });
    } else if (scope === 'no-formal-entry') {
      const m = lines[i].text.match(/^- (.+?)\.pdf$/); if (m) result.push({ line: i + 1, label: m[1], expected: 0, scope });
    }
  }
  return result;
}

type Inventory = Span & {
  id: string; corpus: string; path: string; inputSha256: string; name: string; kind: string; context: string;
  sourceIds: string[]; sourceLabels: string[]; attribution: 'single' | 'pending' | 'shared';
  sourceReferenceLines: number[]; attributionResolution?: unknown; originalSourceIds?: string[];
  entityId: string | null; state: string; warnings: string[]; rawTextSha256: string; bodyTextSha256: string;
  reference: { path: string; record: number; collection?: string }; stageReference: { path: string; record: number } | null;
};
type Finding = { id: string; category: string; severity: 'warning' | 'info'; status: 'open' | 'accounted'; reason: string; references: unknown[]; count?: number };
type Document = { path: string; hash: string; lines: ReturnType<typeof sourceLines>; text: string };
const countBy = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map(v => [v, values.filter(x => x === v).length]));

export async function buildArtifacts(root: string) {
  const inputRefs = new Map<string, { path: string; sha256: string; bytes: number }>();
  const safe = (path: string) => { const full = resolve(root, path); if (isAbsolute(path) || !full.startsWith(resolve(root) + sep)) throw new Error(`Unsafe artifact path: ${path}`); return full; };
  const bytes = async (path: string) => { const b = await readFile(safe(path)); inputRefs.set(path, { path, sha256: sha(b), bytes: b.length }); return b; };
  const json = async (path: string) => JSON.parse((await bytes(path)).toString('utf8'));
  const manifestPath = 'curation/input-manifest.json', sourcePath = 'curation/sources.json';
  const manifestBytes = await bytes(manifestPath), manifest = InputManifestSchema.parse(JSON.parse(manifestBytes.toString('utf8')));
  const sourceBytes = await bytes(sourcePath), registry = SourceRegistrySchema.parse(JSON.parse(sourceBytes.toString('utf8')));
  if (registry.inputManifestSha256 !== sha(manifestBytes) || registry.aliasDecisionsSha256 !== sha(await bytes('curation/source-aliases.json'))) throw new Error('Source registry revision mismatch');
  const documents = new Map<string, Document>();
  for (const f of manifest.files) {
    const b = await bytes(f.path); if (sha(b) !== f.sha256 || b.length !== f.bytes) throw new Error(`Input changed: ${f.path}`);
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(b), lines = sourceLines(text);
    if (lines.length !== f.lines) throw new Error(`Input line count changed: ${f.path}`);
    documents.set(f.path, { path: f.path, hash: f.sha256, text, lines });
  }
  const reports = new Map<string, z.infer<typeof ReportSchema>>(), verified = new Map<string, Buffer>();
  for (const name of ['ancestries', 'paths', 'spells', 'mechanics']) {
    const r = ReportSchema.parse(await json(`curation/reports/${name}.json`)), doc = documents.get(r.input.path);
    if (!doc || r.input.sha256 !== doc.hash || r.input.lines !== doc.lines.length || r.inputManifestSha256 !== sha(manifestBytes) || r.sourceRegistrySha256 !== sha(sourceBytes)) throw new Error(`Stale extraction report: ${name}`);
    if (name === 'mechanics') {
      const decisionRef = z.object({ path: z.literal('curation/mechanics-decisions.json'), sha256: z.string() }).parse(r.decisionRef);
      if (sha(await bytes(decisionRef.path)) !== decisionRef.sha256) throw new Error('Mechanics decision revision mismatch');
    }
    reports.set(name, r);
    for (const o of r.outputs) {
      if (!o.path.startsWith('curation/entries/') && o.path !== 'curation/segments/mechanics.jsonl') throw new Error(`Unexpected extraction output: ${o.path}`);
      const b = verified.get(o.path) ?? await bytes(o.path);
      if (sha(b) !== o.sha256 || o.records !== undefined && b.toString('utf8').split('\n').filter(Boolean).length !== o.records) throw new Error(`Extraction output hash/count mismatch: ${o.path}`);
      verified.set(o.path, b);
    }
  }
  const stage = new Map<string, { entry: z.infer<typeof StagingEntrySchema>; reference: { path: string; record: number }; spanKey: string }>();
  const stagesBySpan = new Map<string, string>(), entityIds = new Set<string>();
  for (const [path, b] of verified) if (path.startsWith('curation/entries/')) {
    const rows = b.toString('utf8').split('\n').filter(Boolean);
    for (let i = 0; i < rows.length; i++) {
      const entry = StagingEntrySchema.parse(JSON.parse(rows[i])), e = entry.review.evidence[0], doc = documents.get(e.path);
      if (entry.originalText === null || !doc || e.medium !== 'md' || e.inputSha256 !== doc.hash || e.startLine === null || e.endLine === null) throw new Error(`Invalid staging provenance: ${path}:${i + 1}`);
      if (redactBuyerLines(doc.lines.slice(e.startLine - 1, e.endLine).map(l => l.raw).join('')) !== entry.originalText) throw new Error(`Staging text/range mismatch: ${path}:${i + 1}`);
      for (const ev of entry.review.evidence) {
        const d = documents.get(ev.path);
        if (ev.medium !== 'md' || !d || ev.inputSha256 !== d.hash || ev.startLine === null || ev.endLine === null || ev.excerpt !== redactBuyerLines(d.lines.slice(ev.startLine - 1, ev.endLine).map(l => l.text).join('\n')) || ev.excerptSha256 !== sha(ev.excerpt)) throw new Error(`Stale staging evidence: ${path}:${i + 1}`);
      }
      if (entry.id && entityIds.has(entry.id)) throw new Error(`Duplicate entity identity: ${entry.id}`); if (entry.id) entityIds.add(entry.id);
      const key = `${path}:${i + 1}`, spanKey = JSON.stringify([e.path, e.startLine, e.endLine, entry.kind]);
      if (stagesBySpan.has(spanKey)) throw new Error(`Duplicate staging range: ${key}`);
      stagesBySpan.set(spanKey, key); stage.set(key, { entry, reference: { path, record: i + 1 }, spanKey });
    }
  }
  const inventory: Inventory[] = [], coverage: (CoverageRange & { path: string; inputSha256: string; reference: unknown; textSha256: string })[] = [], findings: Finding[] = [];
  const usedStage = new Set<string>(), metadataOwners = new Map<string, Set<number>>();
  function addInventory(record: Inventory) {
    inventory.push(record);
    const reason = record.state === 'quarantined' ? 'Preserved in sidecar; no safe kind, discriminator or typed table.' : record.state === 'layout' ? 'Whitespace preserved; not an entity.'
      : record.state === 'blocked' ? 'Preserved in staging with explicit pending source/scope/structure.' : 'Preserved in staging; mechanical review remains pending.';
    coverage.push({ path: record.path, inputSha256: record.inputSha256, startLine: record.startLine, endLine: record.endLine,
      destination: record.state, reason, reference: record.stageReference ?? record.reference, textSha256: record.rawTextSha256 });
    if (record.state === 'blocked' || record.state === 'quarantined') findings.push({ id: `pending:${record.id}`, category: record.state, severity: 'warning', status: 'open', reason: record.warnings.join('; ') || reason, references: [record.reference, record.stageReference].filter(Boolean) });
  }
  function matchStage(path: string, start: number, end: number, kind: string, id: string | null, name: string) {
    const key = stagesBySpan.get(JSON.stringify([path, start, end, kind]));
    if (!key) throw new Error(`Occurrence without staging destination: ${path}:${start}`);
    const s = stage.get(key)!;
    if (s.entry.id !== id || s.entry.name !== name) throw new Error(`Occurrence identity mismatch: ${path}:${start}`);
    if (usedStage.has(key)) throw new Error(`Staging record attributed twice: ${key}`);
    usedStage.add(key); return s;
  }
  const countChecks: { corpus: string; metric: string; declared: number; observed: number; evidence: { path: string; line: number } | null; status: string }[] = [];
  function compare(corpus: string, metric: string, declared: number, observed: number, evidence: { path: string; line: number } | null) {
    const status = declared === observed ? 'matched' : 'open-discrepancy';
    countChecks.push({ corpus, metric, declared, observed, evidence, status });
    if (status !== 'matched') findings.push({ id: `counts:${corpus}:${metric}`, category: 'declared-count-discrepancy', severity: 'warning', status: 'open', reason: `Declared ${declared}; observed ${observed}. No occurrence excluded to force agreement.`, references: evidence ? [evidence] : [] });
  }
  const formalByCorpus = new Map<string, Inventory[]>();
  for (const [name, kind] of [['ancestries', 'ancestry'], ['paths', 'path'], ['spells', 'spell']] as const) {
    const report = reports.get(name)!, doc = documents.get(report.input.path)!, occurrences = report.occurrences;
    if (!occurrences?.length) throw new Error(`Missing formal inventory: ${name}`);
    const before = inventory.length, owners = new Set<number>(); metadataOwners.set(doc.path, owners);
    for (let i = 0; i < occurrences.length; i++) {
      const o = occurrences[i], s = matchStage(doc.path, o.startLine, o.endLine, kind, o.entityId, o.name);
      if (s.entry.source.sourceId !== o.sourceId || s.entry.source.rawLabel !== o.sourceLabel) throw new Error(`Formal source mismatch: ${name}:${o.startLine}`);
      const sourceLine = o.metadataLines.Source;
      if (owners.has(sourceLine)) throw new Error('Formal Source metadata assigned twice'); owners.add(sourceLine);
      const ref = registry.references.filter(r => r.path === doc.path && r.line === sourceLine && r.role === 'metadata');
      if (ref.length !== 1 || ref[0].sourceId !== o.sourceId || ref[0].label !== o.sourceLabel) throw new Error(`Formal source reference mismatch: ${name}:${sourceLine}`);
      const bodyText = o.fullEntryBlocks.map(b => doc.lines.slice(b.startLine - 1, b.endLine).map(l => l.text).join('\n')).join('\n\n');
      addInventory({ id: `${name}:${o.occurrenceKey}`, corpus: name, path: doc.path, inputSha256: doc.hash, startLine: o.startLine, endLine: o.endLine,
        name: o.name, kind, context: name === 'paths' ? o.category! : name === 'spells' ? `${o.origin}:rank-${o.rank}` : 'ancestry',
        sourceIds: o.sourceId ? [o.sourceId] : [], sourceLabels: [o.sourceLabel], sourceReferenceLines: [sourceLine], attribution: o.sourceId ? 'single' : 'pending', entityId: o.entityId,
        state: s.entry.stage, warnings: [], rawTextSha256: sha(s.entry.originalText!), bodyTextSha256: sha(bodyText),
        reference: { path: `curation/reports/${name}.json`, collection: 'occurrences', record: i + 1 }, stageReference: s.reference });
    }
    formalByCorpus.set(name, inventory.slice(before));
    const structure = scanStructure(doc.text);
    if (structure.sources.length !== occurrences.length || structure.sources.some(s => !owners.has(s.line))) throw new Error(`Source metadata without an occurrence destination: ${name}`);
    const headingDepth = name === 'spells' ? 4 : 3;
    const visibleHeadings = structure.headings.filter(h => h.depth === headingDepth && h.line >= occurrences[0].startLine);
    const reused = occurrences.filter(o => o.headingLine && o.headingLine < o.startLine);
    if (visibleHeadings.length + reused.length !== occurrences.length) throw new Error(`Heading/occurrence accounting mismatch: ${name}`);
    findings.push({ id: `headings:${name}`, category: 'headings-versus-occurrences', severity: 'info', status: 'accounted', reason: `${visibleHeadings.length} explicit name headings + ${reused.length} inherited headings = ${occurrences.length} publication occurrences.`, references: reused.map(o => ({ path: doc.path, headingLine: o.headingLine, startLine: o.startLine, name: o.name })) });
    const bodySet = new Set(occurrences.flatMap(o => o.fullEntryBlocks.map(b => `${b.startLine}:${b.endLine}`)));
    for (const f of structure.fences) if (!bodySet.has(`${f.startLine}:${f.endLine}`) && f.startLine >= occurrences[0].startLine) throw new Error(`Formal payload without destination: ${name}:${f.startLine}`);
    for (const body of bodySet) if (!structure.fences.some(f => `${f.startLine}:${f.endLine}` === body)) throw new Error(`Reported body not a real fence: ${name}:${body}`);
    const excluded = report.coverage.excludedRanges ?? [
      ...(report.coverage.prelude ? [{ ...report.coverage.prelude, reason: 'prelude-protocol-source-lists-and-examples' }] : []),
      ...(report.coverage.trailingNonEntryLines ? [{ startLine: occurrences.at(-1)!.endLine + 1, endLine: doc.lines.length, reason: 'trailing-editorial' }] : []),
    ];
    for (const r of excluded) coverage.push({ path: doc.path, inputSha256: doc.hash, startLine: r.startLine, endLine: r.endLine, destination: 'context-not-an-entity', reason: r.reason,
      reference: { path: `curation/reports/${name}.json`, section: 'coverage' }, textSha256: sha(doc.lines.slice(r.startLine - 1, r.endLine).map(l => l.raw).join('')) });
    const declared = (pattern: RegExp) => {
      for (let i = 0; i < occurrences[0].startLine - 1; i++) { const m = doc.lines[i].text.match(pattern); if (m) return { value: Number(m[1].replaceAll('.', '')), line: i + 1 }; }
      throw new Error(`Missing declared count in ${name}: ${pattern}`);
    };
    const occurrenceClaim = declared(name === 'spells' ? /\*\*Spell entries após a atualização:\*\* ([\d.]+)/ : /\*\*Entradas de publicação:\*\* ([\d.]+)/);
    compare(name, 'publication-occurrences', occurrenceClaim.value, occurrences.length, { path: doc.path, line: occurrenceClaim.line });
    const sourceClaim = declared(name === 'ancestries' ? /\*\*Fontes com pelo menos uma entrada de ancestry:\*\* (\d+)/ : name === 'paths' ? /\*\*Fontes com pelo menos um Path:\*\* (\d+)/ : /\*\*Fontes com pelo menos uma spell entry formal após a atualização:\*\* (\d+)/);
    compare(name, 'publication-labels', sourceClaim.value, new Set(occurrences.map(o => o.sourceLabel)).size, { path: doc.path, line: sourceClaim.line });
    if (name !== 'spells') {
      const uniqueClaim = declared(name === 'ancestries' ? /\*\*Nomes distintos de ancestry:\*\* (\d+)/ : /\*\*Paths únicos por nome \+ categoria:\*\* (\d+)/);
      compare(name, 'unique-names-or-name-category', uniqueClaim.value, new Set(occurrences.map(o => name === 'paths' ? JSON.stringify([o.name, o.category]) : o.name)).size, { path: doc.path, line: uniqueClaim.line });
      const declaredCategories = name === 'ancestries' ? ['Ancestry Template', 'Ancestry Variant', 'Beastman Ancestry', 'Derived Ancestry', 'Expanded Ancestry', 'Powerful Ancestry', 'Standard Ancestry']
        : ['Novice Paths', 'Novice Path Variants', 'Expert Paths', 'Master Paths', 'Legendary Paths'];
      for (const label of declaredCategories) {
        const claim = declared(new RegExp(`\\*\\*${label}:\\*\\* (\\d+)`));
        const category = name === 'ancestries' ? label : ({ 'Novice Paths': 'Novice', 'Novice Path Variants': 'Novice Variant', 'Expert Paths': 'Expert', 'Master Paths': 'Master', 'Legendary Paths': 'Legendary' } as Record<string, string>)[label];
        compare(name, `category:${category}`, claim.value, occurrences.filter(o => (name === 'ancestries' ? o.entryType : o.category) === category).length, { path: doc.path, line: claim.line });
      }
    } else {
      const originClaim = declared(/\*\*Traditions \/ Paths com spells após a atualização:\*\* (\d+)/);
      compare(name, 'origin-groups', originClaim.value, new Set(occurrences.map(o => o.origin)).size, { path: doc.path, line: originClaim.line });
    }
    if (report.counts.occurrences !== occurrences.length) throw new Error(`Extraction count stale: ${name}`);
  }

  const mechanics = reports.get('mechanics')!, mechDoc = documents.get(mechanics.input.path)!;
  const segmentPath = 'curation/segments/mechanics.jsonl', segmentBytes = verified.get(segmentPath);
  if (!segmentBytes) throw new Error('Mechanics sidecar missing');
  const segments = segmentBytes.toString('utf8').split('\n').filter(Boolean).map(l => SegmentSchema.parse(JSON.parse(l)));
  const containerSpans = new Map<string, Span>(); const mechOwners = new Set<number>(); metadataOwners.set(mechDoc.path, mechOwners);
  const reportedUnits = z.array(SpanSchema.extend({ unitKey: z.string().nullable(), entityId: z.string().nullable(), name: z.string(), status: z.string() })).parse(mechanics.units);
  if (reportedUnits.length !== segments.length) throw new Error('Mechanics report/sidecar count mismatch');
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i], reported = reportedUnits[i];
    if (reported.startLine !== s.startLine || reported.endLine !== s.endLine || reported.unitKey !== s.unitKey || reported.entityId !== s.entityId || reported.status !== s.status || reported.name !== s.name) throw new Error(`Mechanics sidecar/report mismatch at ${i + 1}`);
    if (s.evidence.path !== mechDoc.path || s.evidence.inputSha256 !== mechDoc.hash || s.startLine !== s.evidence.startLine || s.endLine !== s.evidence.endLine || s.originalText !== redactBuyerLines(mechDoc.lines.slice(s.startLine - 1, s.endLine).map(l => l.raw).join('')) || s.evidence.excerptSha256 !== sha(s.evidence.excerpt)) throw new Error(`Mechanics raw range mismatch at ${i + 1}`);
    mechOwners.add(s.container.sourceLine); containerSpans.set(`${s.container.startLine}:${s.container.endLine}`, s.container);
    const refs = registry.references.filter(r => r.path === mechDoc.path && r.line === s.container.sourceLine && r.role === 'metadata');
    if (JSON.stringify(refs.map(r => [r.sourceId, r.label])) !== JSON.stringify(s.sources.map(r => [r.sourceId, r.label]))) throw new Error(`Mechanics source mismatch at ${i + 1}`);
    const kind = s.category === 'procedure' ? 'rule' : s.category === 'creature' ? 'creature' : s.category === 'item' ? 'item' : s.category;
    const staged = s.status === 'captured' || s.status === 'blocked' ? matchStage(mechDoc.path, s.startLine, s.endLine, kind, s.entityId, s.name) : null;
    if (!staged && s.entityId !== null) throw new Error('Quarantine/layout unexpectedly has entity identity');
    const originalSourceIds = [...new Set(s.sources.flatMap(r => r.sourceId ? [r.sourceId] : []))];
    const sourceIds = s.attributionResolution ? [s.attributionResolution.sourceId] : originalSourceIds;
    if (s.attributionResolution && (!originalSourceIds.includes(s.attributionResolution.sourceId) || staged?.entry.source.sourceId !== s.attributionResolution.sourceId)) throw new Error('Resolved attribution/staging mismatch');
    addInventory({ id: s.unitKey ? `mechanics:${s.unitKey}` : `mechanics:position:${s.startLine}:${s.endLine}`, corpus: 'mechanics', path: mechDoc.path, inputSha256: mechDoc.hash,
      startLine: s.startLine, endLine: s.endLine, name: s.name, kind, context: s.container.section, sourceIds, sourceLabels: s.sources.map(r => r.label),
      sourceReferenceLines: [s.container.sourceLine], attribution: s.attributionResolution ? 'single' : s.sources.length > 1 ? 'shared' : sourceIds.length === 1 ? 'single' : 'pending',
      ...(s.attributionResolution ? { attributionResolution: s.attributionResolution, originalSourceIds } : {}), entityId: s.entityId, state: s.status, warnings: s.warnings,
      rawTextSha256: sha(s.originalText), bodyTextSha256: sha(s.evidence.excerpt), reference: { path: segmentPath, record: i + 1 }, stageReference: staged?.reference ?? null });
  }
  const mechStructure = scanStructure(mechDoc.text);
  if (mechStructure.fences.length !== containerSpans.size || mechStructure.fences.some(f => !containerSpans.has(`${f.startLine}:${f.endLine}`)) || mechStructure.sources.some(s => !mechOwners.has(s.line))) throw new Error('Mechanics fence/source block without a destination');
  for (const r of mechanics.coverage.excludedRanges ?? []) coverage.push({ path: mechDoc.path, inputSha256: mechDoc.hash, startLine: r.startLine, endLine: r.endLine,
    destination: 'context-not-an-entity', reason: r.reason, reference: { path: 'curation/reports/mechanics.json', section: 'coverage' }, textSha256: sha(mechDoc.lines.slice(r.startLine - 1, r.endLine).map(l => l.raw).join('')) });
  if (usedStage.size !== stage.size) throw new Error(`Staging records without inventory correspondence: ${stage.size - usedStage.size}`);
  for (const [metric, observed] of Object.entries({ segments: segments.length, staged: segments.filter(s => ['captured', 'blocked'].includes(s.status)).length,
    captured: segments.filter(s => s.status === 'captured').length, blocked: segments.filter(s => s.status === 'blocked').length,
    quarantined: segments.filter(s => s.status === 'quarantined').length, layout: segments.filter(s => s.status === 'layout').length })) {
    if (mechanics.counts[metric] !== observed) throw new Error(`Mechanics count stale: ${metric}`);
  }
  const coverageChecks = [...documents.values()].map(d => ({ path: d.path, inputSha256: d.hash, ...auditCoverage(d.lines.length, coverage.filter(r => r.path === d.path)) }));

  // Publication matrix separates confirmed attribution from pending alias candidates and shared errata.
  const matrix = registry.sources.map(s => {
    const doc = documents.get(s.declaration.path); if (!doc || s.declaration.inputSha256 !== doc.hash) throw new Error('Stale publication declaration');
    const cells = doc.lines[s.declaration.line - 1].text.split('|').slice(1, -1).map(v => v.trim());
    if (cells.length !== 3 || cells[0] !== s.title) throw new Error(`Manifest row mismatch: ${s.title}`);
    const observed = inventory.filter(o => o.sourceIds.includes(s.id)), pending = registry.pending.filter(p => p.candidateSourceId === s.id);
    return { sourceId: s.id, title: s.title, edition: s.edition, revision: s.revision, editionStatus: s.editionStatus, pdfAvailability: s.availability.pdf,
      declaration: { path: s.declaration.path, line: s.declaration.line, inputSha256: s.declaration.inputSha256, incorporated: cells[1], excluded: cells[2], status: 'declared-in-md-not-pdf-audit' },
      observedByCorpus: countBy(observed.filter(o => o.attribution === 'single').map(o => o.corpus)), observedStates: countBy(observed.filter(o => o.attribution === 'single').map(o => o.state)),
      sharedAttributionRecords: observed.filter(o => o.attribution === 'shared').length,
      pendingRecordCandidates: inventory.filter(o => o.attribution === 'pending' && pending.some(p => p.path === o.path && o.sourceReferenceLines.includes(p.line))).map(o => ({ inventoryId: o.id, reference: o.reference, notCountedAsConfirmedAttribution: true })),
      pendingAliasReferences: pending.map(p => ({ ...p, notCountedAsConfirmedAttribution: true })), declarations: [] as unknown[],
      sourceListCoverage: {} as Record<string, string>,
      status: observed.length ? 'observed-in-local-corpus-not-certified' : pending.length ? 'pending-alias-or-scope' : 'no-direct-record-observed' };
  });
  compare('manifest', 'publications', registry.reconciliation.declared, matrix.length, { path: mechDoc.path, line: 47 });
  const declarations: unknown[] = [];
  for (const name of ['ancestries', 'paths']) {
    const report = reports.get(name)!, doc = documents.get(report.input.path)!, rows = formalByCorpus.get(name)!;
    for (const d of sourceDeclarations(doc.text, report.occurrences![0].startLine)) {
      const refs = registry.references.filter(r => r.path === doc.path && r.line === d.line && r.role === 'declaration');
      if (refs.length !== 1) throw new Error(`Source-list declaration unregistered: ${name}:${d.line}`);
      const ref = refs[0], observed = ref.sourceId ? rows.filter(o => o.sourceIds.includes(ref.sourceId!)).length : null;
      const declaration = { corpus: name, path: doc.path, inputSha256: doc.hash, ...d, sourceId: ref.sourceId, observed,
        status: observed === null ? 'pending-alias-not-merged' : observed === d.expected ? 'matched' : 'open-discrepancy' };
      declarations.push(declaration); if (ref.sourceId) matrix.find(s => s.sourceId === ref.sourceId)!.declarations.push(declaration);
      if (observed !== null && observed !== d.expected) findings.push({ id: `source-count:${name}:${d.line}`, category: 'per-publication-discrepancy', severity: 'warning', status: 'open', reason: `${d.label}: declared ${d.expected}; observed ${observed}.`, references: [{ path: doc.path, line: d.line }] });
    }
  }
  for (const p of registry.pending) findings.push({ id: `source-alias:${p.path}:${p.line}`, category: 'pending-source-alias', severity: 'warning', status: 'open', reason: p.reason, references: [p] });
  for (const name of ['ancestries', 'paths']) {
    const report = reports.get(name)!;
    const listed = sourceDeclarations(documents.get(report.input.path)!.text, report.occurrences![0].startLine);
    for (const publication of matrix) {
      const resolved = listed.some(d => registry.references.some(r => r.path === report.input.path && r.line === d.line && r.role === 'declaration' && r.sourceId === publication.sourceId));
      const pending = listed.some(d => registry.pending.some(p => p.path === report.input.path && p.line === d.line && p.candidateSourceId === publication.sourceId));
      publication.sourceListCoverage[name] = resolved ? 'listed-resolved' : pending ? 'listed-with-pending-alias' : 'not-listed';
      if (!resolved && !pending) findings.push({ id: `unlisted-publication:${name}:${publication.sourceId}`, category: 'publication-not-listed-in-scope-summary', severity: 'warning', status: 'open',
        reason: 'Publication exists in the project manifest but is absent from this MD\'s formal-count/no-entry source lists. No missing content or intentional exclusion inferred.',
        references: [{ path: report.input.path, section: 'source lists' }, publication.declaration] });
    }
  }
  // Text equality is only a grouping aid, never an identity/precedence decision.
  const duplicates: { id: string; category: string; key: string; count: number; action: string; references: unknown[] }[] = [];
  for (const mode of ['same-name-context', 'exact-body-text', 'indistinguishable-segment'] as const) {
    const groups = new Map<string, Inventory[]>();
    for (const o of inventory) {
      if (o.state === 'layout' || mode === 'indistinguishable-segment' && !o.warnings.includes('indistinguishable-duplicate-needs-discriminator')) continue;
      const key = mode === 'same-name-context' ? JSON.stringify([o.kind, o.name.normalize('NFKC').toLowerCase(), o.corpus === 'mechanics' ? 'draft-mechanics' : o.context])
        : mode === 'exact-body-text' ? `${o.kind}:${o.bodyTextSha256}` : `${o.path}:${o.context}:${o.kind}:${o.name}:${o.rawTextSha256}`;
      const rows = groups.get(key) ?? []; rows.push(o); groups.set(key, rows);
    }
    for (const [key, rows] of groups) if (rows.length > 1) duplicates.push({ id: `group:${mode}:${sha(key).slice(0, 24)}`, category: mode, key, count: rows.length,
      action: 'preserve-all-occurrences-no-content-merge-or-equivalence-certification', references: rows.map(o => ({ inventoryId: o.id, entityId: o.entityId, sourceIds: o.sourceIds, reference: o.reference })) });
  }

  // Normalized artifacts must replay to the raw revision; overlays and diagnostics must point to accounted text.
  const normReportPath = 'curation/reports/editorial-normalization.json', norm = await json(normReportPath);
  if (norm.inputManifestSha256 !== sha(manifestBytes)) throw new Error('Stale normalization manifest');
  for (const ref of [...norm.inputRefs, ...norm.outputs]) if (sha(await bytes(ref.path)) !== ref.sha256) throw new Error(`Normalization dependency changed: ${ref.path}`);
  const changes = (await bytes('curation/normalization/changes.jsonl')).toString('utf8').split('\n').filter(Boolean).map(l => LineChangeSchema.parse(JSON.parse(l)));
  const overlays = (await bytes('curation/normalization/overlays.jsonl')).toString('utf8').split('\n').filter(Boolean).map(l => NormalizationOverlaySchema.parse(JSON.parse(l)));
  const diagnosticRows = (await bytes('curation/normalization/diagnostics.jsonl')).toString('utf8').split('\n').filter(Boolean).map(l => z.object({ path: z.string(), inputSha256: z.string(), kind: z.string(), startLine: positive, endLine: positive, action: z.enum(['normalized', 'review-required']) }).passthrough().parse(JSON.parse(l)));
  const changeIds = new Set(changes.map(c => c.id)), usedChanges = new Set<string>();
  const inventorySpans = new Set(inventory.map(o => JSON.stringify([o.path, o.startLine, o.endLine])));
  for (const o of overlays) {
    if (!inventorySpans.has(JSON.stringify([o.source.path, o.source.startLine, o.source.endLine]))) throw new Error(`Overlay without inventory destination: ${o.id}`);
    for (const id of o.changeRefs.changeIds) { if (!changeIds.has(id)) throw new Error(`Overlay references missing change: ${id}`); usedChanges.add(id); }
  }
  if (usedChanges.size !== changeIds.size) throw new Error('Normalization change without overlay destination');
  for (const doc of documents.values()) {
    const ds = changes.filter(c => c.path === doc.path), normalizedPath = `curation/normalized/${doc.path.slice('rules/'.length)}`, normalized = (await bytes(normalizedPath)).toString('utf8');
    if (replayChanges(doc.text, ds) !== normalized || replayChanges(normalized, ds, true, doc.text) !== doc.text) throw new Error(`Normalization replay mismatch: ${doc.path}`);
  }
  const reviewDiags = diagnosticRows.filter(d => d.action === 'review-required');
  for (const d of diagnosticRows) { const doc = documents.get(d.path); if (!doc || d.inputSha256 !== doc.hash || d.startLine > d.endLine || d.endLine > doc.lines.length) throw new Error('Diagnostic without valid source destination'); }
  for (const [kind, count] of Object.entries(countBy(reviewDiags.map(d => d.kind)))) findings.push({ id: `editorial:${kind}`, category: 'editorial-review', severity: 'warning', status: 'open', reason: 'Candidate editorial signals preserved; not confirmed mechanical errors or automatic entity blocks.', count,
    references: [{ path: 'curation/normalization/diagnostics.jsonl', filter: { kind, action: 'review-required' } }] });
  const artifacts = new Map<string, string>(), jsonl = (rows: unknown[]) => rows.length ? rows.map(row => JSON.stringify(row)).join('\n') + '\n' : '';
  artifacts.set(`${BASE}/inventory.jsonl`, jsonl(inventory));
  artifacts.set(`${BASE}/coverage.jsonl`, jsonl(coverage.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : a.startLine - b.startLine)));
  artifacts.set(`${BASE}/sources.json`, JSON.stringify({ schemaVersion: 1, publications: matrix, sourceListDeclarations: declarations }, null, 2) + '\n');
  artifacts.set(`${BASE}/duplicates.jsonl`, jsonl(duplicates)); artifacts.set(`${BASE}/findings.jsonl`, jsonl(findings));
  const report = { schemaVersion: 1, task: 'CUR-013', reviewDate: AUDIT_DATE, inputReviewDate: manifest.reviewDate,
    scope: 'Local-corpus accounting only; no PDF completeness, permission, mechanical or automation certification.',
    tool: { privacyPolicySha256: sha(await bytes('tools/curation/privacy.mjs')), version: '1.0.0', sha256: sha(await bytes('tools/curation/reconciler.ts')), runnerSha256: sha(await bytes('tools/curation/reconcile.mjs')) },
    counts: { inputs: documents.size, lines: coverageChecks.reduce((sum, c) => sum + c.totalLines, 0), inventoryRecords: inventory.length,
      inventoryByCorpus: countBy(inventory.map(o => o.corpus)), states: countBy(inventory.map(o => o.state)), staged: stage.size, uniqueNonNullEntityIds: entityIds.size,
      publications: matrix.length, pendingAliasReferences: registry.pending.length, sourceListDeclarations: declarations.length,
      duplicateCandidateGroups: duplicates.length, findingsByCategory: countBy(findings.map(f => f.category)), editorialReviewSignals: reviewDiags.length,
      normalizationChangesAccounted: usedChanges.size, overlaysAccounted: overlays.length },
    gates: { exactCoverage: coverageChecks, allStagingMapped: true, sourceMetadataMapped: true, allPayloadFencesMapped: true,
      normalizationReversible: true, noChangeWithoutOverlay: true, rawInputsModified: false, statusesPromoted: false },
    countChecks, inputRefs: [...inputRefs.values()],
    outputs: [...artifacts].map(([path, text]) => ({ path, sha256: sha(text), bytes: Buffer.byteLength(text) })) };
  artifacts.set(REPORT, JSON.stringify(report, null, 2) + '\n'); return { artifacts, report };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--write', '--check'].includes(args[0])) throw new Error('Use --write or --check');
  const { artifacts, report } = await buildArtifacts(root);
  for (const [path, output] of artifacts) { assertSafeArtifact(path, output);
    if (args[0] === '--write') { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), output); }
    else if (await readFile(resolve(root, path), 'utf8') !== output) throw new Error(`Reconciliation artifact changed: ${path}`);
  }
  console.log(`Reconciliation: ${report.counts.lines} lines, ${report.counts.inventoryRecords} records, ${report.counts.publications} publications; zero coverage gaps/overlaps. Open findings retained. ${args[0]}`);
}
