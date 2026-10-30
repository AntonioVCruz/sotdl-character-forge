import { assertSafeArtifact } from './privacy.mjs';
import { sanitizeArtifact } from './privacy.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { z } from 'zod';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { entityId, type CurationIdentity } from '../../packages/curation/identity';
import { InputManifestSchema, SourceRegistrySchema } from '../../packages/curation/registries';
import { sourceLines } from './ancestry-extractor';

export const INPUT = 'rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md';
const LEDGER = 'curation/mechanics-ledger.json', REPORT = 'curation/reports/mechanics.json';
const SEGMENTS = 'curation/segments/mechanics.jsonl';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const scopeTags = ['BASE', 'OPCIONAL', 'REGIONAL', 'EQUIPAMENTO', 'CRIATURA', 'DEPENDÊNCIA OMITIDA'] as const;
type Category = 'procedure' | 'item' | 'creature' | 'table' | 'unclassified' | 'layout';
type Span = { startLine: number; endLine: number };
export type Container = Span & { section: string; sectionLine: number; subsection: string | null; subsectionLine: number | null;
  sourceLine: number; coverageLine: number | null; coverage: string | null; editorialLines: number[]; language: string };

export function parseContainers(text: string): Container[] {
  const lines = sourceLines(text), result: Container[] = [];
  let section = '', sectionLine = 0, subsection: string | null = null, subsectionLine: number | null = null;
  let sourceLine = 0, coverage: string | null = null, coverageLine: number | null = null, editorialLines: number[] = [];
  let fence: { char: string; length: number; line: number; language: string } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].text, n = i + 1;
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)\s*$/);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) {
        if (!sourceLine || !section) throw new Error(`Payload without explicit source/section at ${fence.line}`);
        if (fence.line + 1 > n - 1) throw new Error(`Empty payload at ${fence.line}`);
        result.push({ startLine: fence.line + 1, endLine: n - 1, section, sectionLine, subsection, subsectionLine,
          sourceLine, coverage, coverageLine, editorialLines: [...editorialLines], language: fence.language }); fence = null;
      }
      continue;
    }
    if (/^## /.test(line)) { section = line; sectionLine = n; subsection = null; subsectionLine = null; sourceLine = 0; coverage = null; coverageLine = null; editorialLines = []; }
    else if (/^### /.test(line)) { subsection = line; subsectionLine = n; sourceLine = 0; coverage = null; coverageLine = null; editorialLines = []; }
    else if (/^\*\*Fontes?:\*\*/.test(line)) { sourceLine = n; coverage = null; coverageLine = null; editorialLines = []; }
    else if (/^\*\*Cobertura:\*\*/.test(line)) { coverage = line.replace(/^\*\*Cobertura:\*\*\s*/, '').trim(); coverageLine = n; }
    else if (sourceLine && line.trim() && !/^ {0,3}(`{3,}|~{3,})/.test(line)) editorialLines.push(n);
    const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (open) fence = { char: open[1][0], length: open[1].length, line: n, language: open[2].trim() };
  }
  if (fence) throw new Error(`Unclosed fence at ${fence.line}`);
  if (!result.length) throw new Error('No mechanics containers found'); return result;
}

const nonEntityTitles = /^(?:attack options|special attacks?|special actions?|end of (?:the )?round|magic|traits|attributes|characteristics|perception|defense|strength|agility|intellect|will|speed|size|item|name|price|availability|difficulty|weapons|equipment|chapter \d+|actions|attack rolls?|challenge rolls?)$/i;
const procedureCue = /\b(?:using|creating|customizing|building|rolling|starting|altering|learning|wearing|buying|selling|putting|taking|replacing|carrying|limits|prices|availability|requirements|properties|professions|languages|combat|movement|travel|resting|recovery|healing|insanity|corruption|injuries|damage|disease|weather|terrain|encounters|treasure|loyalty|recruitment|summoning|binding|joining|escape|rules|procedure|optional|variant|benefits|drawbacks|background|group|level|attacking|casting)\b/i;
const ruleContext = /creation|playing the game|running the game|mechanics|regras gerais|insanity|madness|injuries|quirks|corruption|story complications|group themes|true names|hell tithe|sacred order|eudaemonic|downtime|hazards/i;
function titleLike(value: string) {
  const words = value.trim().split(/\s+/), stop = new Set(['a', 'an', 'the', 'of', 'and', 'or', 'to', 'for', 'in', 'with', 'on', 'at', 'as', 'by', 'from', 'your', 'off']);
  return value.length >= 3 && value.length <= 85 && words.length <= 13 && /^[\p{Lu}]/u.test(value) && !/[.!?=;:]/.test(value)
    && words.every(w => /^[\p{Lu}\d]/u.test(w) || stop.has(w.toLowerCase()) || w === '&') && !/^\d/.test(value) && !nonEntityTitles.test(value);
}
const statLine = /^(?:Size|Perception|Defense|Strength|Agility|Intellect|Will|Speed|Health)\b/;
function statHeader(lines: ReturnType<typeof sourceLines>, n: number, body: Container) {
  const text = lines[n - 1].text.trim();
  const inline = text.match(/^(.{2,100}?)\s+(?:DIFFICULTY|Difficulty)\s+(\d+(?:\/\d+)?|—|–)(?:\s|$)/);
  const standalone = /^(?:DIFFICULTY|Difficulty)\s+\d+(?:\s|$)/.test(text);
  if (!inline && !standalone) return null;
  const following = lines.slice(n, Math.min(n + 14, body.endLine)).filter(l => statLine.test(l.text.trim()));
  if (following.length < 2) return null;
  if (inline) {
    const name = inline[1].trim();
    return titleLike(name) ? { name, startLine: n, statLine: n } : null;
  }
  for (let p = n - 1; p >= Math.max(body.startLine, n - 4); p--) {
    const name = lines[p - 1].text.trim();
    if (!name) continue;
    if (titleLike(name) && !statLine.test(name)) return { name, startLine: p, statLine: n }; break;
  }
  return null;
}
type Anchor = { line: number; name: string; category: Category; subtype: string; basis: string; confidence: 'signal' | 'residual'; parentTable: string | null };
export type Unit = Span & { name: string; category: Category; subtype: string; basis: string; confidence: 'signal' | 'residual';
  parentTable: string | null; originalText: string; selector: string; container: Container };

export function segmentContainer(body: Container, lines: ReturnType<typeof sourceLines>): Unit[] {
  const anchors = new Map<number, Anchor>(), stats: { name: string; startLine: number; statLine: number }[] = [];
  const add = (anchor: Anchor) => { if (!anchors.has(anchor.line) || anchor.category === 'creature' || anchors.get(anchor.line)?.confidence === 'residual' && anchor.confidence === 'signal') anchors.set(anchor.line, anchor); };
  for (let n = body.startLine; n <= body.endLine; n++) { const stat = statHeader(lines, n, body); if (stat) stats.push(stat); }
  for (const s of stats) {
    // A clearly matching descriptive heading can precede its statistics. Never include a preceding creature's stat block.
    const previous = stats.filter(p => p.startLine < s.startLine).at(-1)?.statLine ?? body.startLine - 1;
    for (let n = s.startLine - 1; n >= Math.max(body.startLine, s.startLine - 80, previous + 1); n--)
      if (normalize(lines[n - 1].text) === normalize(s.name) && titleLike(lines[n - 1].text.trim())) { s.startLine = n; break; }
    add({ line: s.startLine, name: s.name, category: 'creature', subtype: 'stat-block', basis: `Difficulty and at least two stat lines; stat header at ${s.statLine}.`, confidence: 'signal', parentTable: null });
  }
  const itemRows = new Map<number, { name: string; basis: string; endLine: number }>(), itemNames = new Set<string>();
  const currency = /^(?:\d+(?:[.,]\d+)?(?:\s*\+)?\s*(?:bits?|cp|ss|gc)\+?|Varies|—)$/i;
  const availability = /^(?:[CURE]|Common|Uncommon|Rare|Exotic)(?:\s+to\s+exotic)?$/i;
  for (let n = body.startLine; n <= body.endLine; n++) {
    const line = lines[n - 1].text.trim();
    const row = line.match(/^(.{2,80}?)\s+(\d+(?:[.,]\d+)?\s*(?:bits?|cp|ss|gc)\+?)\s+((?:[CURE]|Common|Uncommon|Rare|Exotic)(?:\s+to\s+exotic)?)$/i);
    if (row && /^[\p{L}]/u.test(row[1])) {
      const name = row[1].replace(/\s+(?:Agility|Defense|Strength|\d).*$/, '').trim();
      itemRows.set(n, { name, basis: 'Single catalog row with currency and availability; numeric columns remain raw.', endLine: n }); itemNames.add(normalize(name));
    } else if (titleLike(line)) {
      const next = lines.slice(n, Math.min(body.endLine, n + 7)).map(l => l.text.trim()).filter(Boolean);
      if (next.length >= 2 && currency.test(next[0]) && availability.test(next[1])) {
        let endLine = n + 1;
        while (endLine <= Math.min(body.endLine, n + 7) && lines[endLine - 1].text.trim() !== next[1]) endLine++;
        itemRows.set(n, { name: line, basis: 'Vertical catalog row: name, currency, availability.', endLine }); itemNames.add(normalize(line));
      }
    }
  }
  let creatureActive = false, parentTable: string | null = null;
  for (let n = body.startLine; n <= body.endLine; n++) {
    const line = lines[n - 1].text.trim();
    if (anchors.get(n)?.category === 'creature') { creatureActive = true; continue; }
    if (stats.some(s => n >= s.startLine && n <= s.statLine)) continue;
    const nextLines = lines.slice(n, Math.min(body.endLine, n + 4)).map(l => l.text.trim()).filter(Boolean);
    const next = nextLines[0] ?? '';
    const knownProcedure = procedureCue.test(line) && titleLike(line);
    if (creatureActive && !/^(?:Customizing|Creating|Building|Variant|Encounter|Creature Creation|Creature Customization)\b/i.test(line)) continue;
    if (creatureActive) creatureActive = false;
    const row = itemRows.get(n);
    if (row) {
      add({ line: n, name: row.name, category: 'item', subtype: 'catalog-row', basis: row.basis, confidence: 'signal', parentTable });
      if (row.endLine < body.endLine && !itemRows.has(row.endLine + 1)) add({ line: row.endLine + 1, name: 'After catalog row', category: 'unclassified', subtype: 'residual-fragment', basis: 'Preserve context following the exact catalog row separately from the item.', confidence: 'residual', parentTable });
      continue;
    }
    if (/^(?:Item|Name|Weapon).*(?:Price|Cost).*(?:Avail|Availability)/i.test(line)) {
      parentTable = lines[n - 2]?.text.trim() || line;
      add({ line: n, name: parentTable, category: 'table', subtype: 'catalog-table-context', basis: 'Explicit catalog column header; rows remain separate candidates.', confidence: 'signal', parentTable: null }); continue;
    }
    if (/^.+ — .+\((?:core )?pp?\. /i.test(line)) {
      add({ line: n, name: line, category: 'procedure', subtype: 'errata-correction', basis: 'Explicit errata target heading; revision attribution remains separate.', confidence: 'signal', parentTable: null }); continue;
    }
    const explicitTable = /^Table\s+\d+\s*:/i.test(line) || titleLike(line) && /^(?:\d*d\d+|d%|Dice|Roll)\b/i.test(next);
    if (explicitTable) { parentTable = line; add({ line: n, name: line, category: 'table', subtype: 'table-transcript', basis: 'Explicit table/die header; no probability or ranges reconstructed.', confidence: 'signal', parentTable: null }); continue; }
    const inline = line.match(/^([^:]{3,65}):\s+.+/);
    const title = titleLike(line) ? line : inline && titleLike(inline[1]) ? inline[1] : null;
    if (!title || /^(?:Strength|Agility|Intellect|Will|Speed|Health|Defense|Size|Perception)\b/.test(title)) continue;
    const proseNext = /^[\p{Lu}]/u.test(next) && /\s[\p{Ll}]{2,}/u.test(next) || statLine.test(next);
    if (!inline && !proseNext && !knownProcedure && !itemNames.has(normalize(title))) continue;
    if (itemNames.has(normalize(title))) add({ line: n, name: title, category: 'item', subtype: 'description', basis: 'Description heading matches an independently observed catalog row in this block.', confidence: 'signal', parentTable });
    else if (knownProcedure || ruleContext.test(body.section + ' ' + (body.subsection ?? '')) || /\[REGRA\]/.test(body.coverage ?? '') && !/\[(?:EQUIPAMENTO|CRIATURA)\]/.test(body.coverage ?? ''))
      add({ line: n, name: title, category: 'procedure', subtype: /hazards?|terrain|weather|disease|poison|radiation/i.test(title) ? 'hazard-or-environment' : 'procedure', basis: 'Textual heading/label and explicit procedural context; mechanics unreviewed.', confidence: 'signal', parentTable: null });
    else add({ line: n, name: title, category: 'unclassified', subtype: 'heading-candidate', basis: 'Heading visible but category lacks sufficient evidence.', confidence: 'residual', parentTable });
  }
  if (!anchors.has(body.startLine)) add({ line: body.startLine, name: 'Unassigned introduction', category: 'unclassified', subtype: 'residual-fragment', basis: 'Text before the first supported unit.', confidence: 'residual', parentTable: null });
  const sorted = [...anchors.values()].sort((a, b) => a.line - b.line), units: Unit[] = [];
  const push = (a: Anchor, startLine: number, endLine: number) => {
    const originalText = lines.slice(startLine - 1, endLine).map(l => l.raw).join('');
    if (!originalText.trim()) a = { ...a, category: 'layout', subtype: 'layout-separator', basis: 'Whitespace separator only; no mechanical unit asserted.' };
    const selector = JSON.stringify([body.section, body.subsection, body.coverage, a.name, a.category, a.subtype, sha(originalText)]);
    units.push({ startLine, endLine, ...a, originalText, selector, container: body });
  };
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i], end = sorted[i + 1] ? sorted[i + 1].line - 1 : body.endLine;
    if (a.category !== 'creature' && end - a.line + 1 > 180) {
      // Residual text is not disguised as a chapter-sized mechanical entity.
      let start = a.line;
      while (start <= end) {
        let stop = Math.min(start + 119, end);
        if (stop < end) { for (let n = stop; n >= start + 60; n--) if (!lines[n - 1].text.trim() || /^---/.test(lines[n - 1].text)) { stop = n; break; } }
        push({ ...a, category: 'unclassified', subtype: 'oversized-context-fragment', confidence: 'residual', basis: 'Long candidate requires further semantic segmentation; raw paragraph/page fragment only.' }, start, stop); start = stop + 1;
      }
    } else push(a, a.line, end);
  }
  return units;
}

export const MechanicsLedgerSchema = z.object({ schemaVersion: z.literal(1), responsible: z.string().min(1), reason: z.string().min(1),
  entries: z.array(z.object({ unitKey: z.string().regex(/^u\d{6}$/), selector: z.string().min(1), name: z.string().min(1), category: z.enum(['procedure', 'item', 'creature', 'table', 'unclassified']) }).strict()).max(20000),
}).strict();
export function initialLedger(units: Unit[]) {
  const counts = new Map<string, number>(); for (const u of units) counts.set(u.selector, (counts.get(u.selector) ?? 0) + 1);
  return MechanicsLedgerSchema.parse({ schemaVersion: 1, responsible: 'Codex / initial textual segmentation',
    reason: 'Keys assigned once, persisted independently of order/content. Selector hashes guard revisions; duplicate indistinguishable units are quarantined without catalog IDs.',
    entries: units.filter(u => u.category !== 'layout' && counts.get(u.selector) === 1).map((u, i) => ({ unitKey: `u${String(i + 1).padStart(6, '0')}`, selector: u.selector, name: u.name, category: u.category })) });
}

const DECISIONS = 'curation/mechanics-decisions.json';
const DecisionsSchema = z.object({ schemaVersion: z.literal(1), decisions: z.array(z.object({
  unitKey: z.string(), name: z.string(), sourceId: z.string(), originalTextSha256: z.string().regex(/^[a-f0-9]{64}$/),
  resolution: z.enum(['standalone-creature', 'latest-source']), date: z.string(), authority: z.literal('explicit-user-instruction'), reason: z.string().min(1),
}).strict()) }).strict();

export function extractMechanics(text: string, registryInput: unknown, ledgerInput: unknown, decisionsInput: unknown = { schemaVersion: 1, decisions: [] }) {
  const decisions = DecisionsSchema.parse(decisionsInput).decisions, appliedDecisions = new Set<string>();
  if (new Set(decisions.map(d => d.unitKey)).size !== decisions.length) throw new Error('Duplicate mechanics decision');
  const registry = SourceRegistrySchema.parse(registryInput), ledger = MechanicsLedgerSchema.parse(ledgerInput), lines = sourceLines(text), inputHash = sha(text);
  const containers = parseContainers(text), units = containers.flatMap(c => segmentContainer(c, lines));
  const keys = new Map(ledger.entries.map(e => [e.selector, e]));
  if (keys.size !== ledger.entries.length || new Set(ledger.entries.map(e => e.unitKey)).size !== ledger.entries.length) throw new Error('Duplicate ledger key/selector');
  const frequencies = new Map<string, number>(); for (const u of units) frequencies.set(u.selector, (frequencies.get(u.selector) ?? 0) + 1);
  const used = new Set<string>(), ids = new Set<string>();
  const results = units.map(u => {
    const duplicate = u.category !== 'layout' && frequencies.get(u.selector)! > 1, key = keys.get(u.selector);
    if (u.category !== 'layout' && !duplicate && !key) throw new Error(`Ledger selector changed/missing at ${u.startLine}: ${u.name}`);
    if (key) { used.add(key.unitKey); if (key.category !== u.category) throw new Error('Ledger category mismatch'); }
    const c = u.container, refs = registry.references.filter(r => r.path === INPUT && r.role === 'metadata' && r.line === c.sourceLine);
    if (!refs.length || refs.some(r => r.inputSha256 !== inputHash)) throw new Error(`Source evidence mismatch at ${c.sourceLine}`);
    let sourceId = refs.length === 1 ? refs[0].sourceId : null;
    const rawTags = [...new Set((c.coverage ?? '').match(/\[[^\]]+\]/g) ?? [])];
    const localText = u.originalText;
    for (const tag of localText.match(/\[(?:BASE|OPCIONAL|REGIONAL|EQUIPAMENTO|CRIATURA|DEPENDÊNCIA OMITIDA)\]/g) ?? []) if (!rawTags.includes(tag)) rawTags.push(tag);
    for (const n of c.editorialLines) for (const tag of lines[n - 1].text.match(/\[DEPENDÊNCIA OMITIDA\]/g) ?? []) if (!rawTags.includes(tag)) rawTags.push(tag);
    const tags = scopeTags.filter(tag => rawTags.includes(`[${tag}]`));
    const allPageMarkers = lines.slice(c.startLine - 1, u.endLine).flatMap((l, i) => {
      const match = l.text.match(/^---\s*PDF\s+p(?:p)?\.\s*(.+?)\s*---$/i);
      return match ? [{ line: c.startLine + i, declaration: match[1] }] : [];
    });
    const previousPage = allPageMarkers.filter(m => m.line < u.startLine).at(-1);
    const pageMarkers = [...(previousPage ? [previousPage] : []), ...allPageMarkers.filter(m => m.line >= u.startLine)];
    const decision = decisions.find(d => d.unitKey === key?.unitKey);
    if (decision) {
      if (u.name !== decision.name || sha(u.originalText) !== decision.originalTextSha256)
        throw new Error(`Mechanics decision evidence mismatch: ${decision.unitKey}`);
      if (decision.resolution === 'standalone-creature') {
        if (u.category !== 'creature' || sourceId !== decision.sourceId || !tags.includes('DEPENDÊNCIA OMITIDA')) throw new Error(`Mechanics decision evidence mismatch: ${decision.unitKey}`);
      } else {
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const dated = refs.map(ref => {
          const revision = registry.sources.find(s => s.id === ref.sourceId)?.revision;
          const match = revision?.match(/^(\d{2})([a-z]{3})(\d{2})$/);
          const month = match ? months.indexOf(match[2]) : -1;
          if (!match || month < 0 || !ref.sourceId) throw new Error('Latest-source decision requires explicit comparable revision dates');
          const year = 2000 + Number(match[3]), day = Number(match[1]), date = Date.UTC(year, month, day);
          if (new Date(date).getUTCDate() !== day || day < 1) throw new Error('Invalid source revision date');
          return { sourceId: ref.sourceId, date };
        }).sort((a, b) => b.date - a.date);
        if (dated.length < 2 || dated[0].date === dated[1].date || dated[0].sourceId !== decision.sourceId) throw new Error('Latest-source decision does not select a uniquely newest revision');
        sourceId = decision.sourceId;
      }
      appliedDecisions.add(decision.unitKey);
    }
    const warnings = [...(sourceId ? [] : [refs.length > 1 ? 'multiple-source-attribution-unresolved' : 'unresolved-source']),
      ...(tags.includes('REGIONAL') ? ['region-scope-unresolved'] : []), ...(tags.includes('DEPENDÊNCIA OMITIDA') && decision?.resolution !== 'standalone-creature' ? ['omitted-dependency'] : []),
      ...(duplicate ? ['indistinguishable-duplicate-needs-discriminator'] : []), ...(u.category === 'table' ? ['table-transcript-not-typed-random-table'] : []),
      ...(u.category === 'unclassified' ? ['semantic-segmentation-or-category-pending'] : []),
      ...(u.category === 'creature' && u.endLine - u.startLine + 1 > 180 ? ['long-stat-block-boundaries-review-required'] : [])];
    const unitKey = key?.unitKey ?? null, excerpt = lines.slice(u.startLine - 1, u.endLine).map(l => l.text).join('\n');
    const evidence = { id: unitKey ? `mechanics:${unitKey}:md` : `mechanics:duplicate:${u.startLine}:md`, medium: 'md' as const, path: INPUT, inputSha256: inputHash,
      startLine: u.startLine, endLine: u.endLine, physicalPdfPage: null, printedPageDeclared: null,
      pdfPageDeclared: pageMarkers.length ? [...new Set(pageMarkers.map(m => m.declaration))].join('; ') : c.coverage, heading: `${c.section}${c.subsection ? ' / ' + c.subsection : ''} / ${u.name}`,
      excerpt, excerptSha256: sha(excerpt), claim: 'Raw textual unit/fragment; no publication completeness, printed pagination or mechanical certification.' };
    const kind: 'rule' | 'item' | 'creature' | null = u.category === 'procedure' ? 'rule' : u.category === 'item' ? 'item' : u.category === 'creature' ? 'creature' : null;
    let staging: z.infer<typeof StagingEntrySchema> | null = null;
    if (kind && unitKey && !duplicate) {
      const identity: CurationIdentity | null = sourceId ? { sourceId, kind, entryKey: unitKey, variantKey: u.subtype } : null;
      const id = identity ? entityId(identity) : null;
      if (id && ids.has(id)) throw new Error(`Duplicate entity ID: ${id}`); if (id) ids.add(id);
      const axis = (status: string, reason: string, evidenceIds: string[] = []) => ({ status, responsible: 'Codex / textual segmentation', reason, evidenceIds });
      const contextEvidence = [...new Set([c.sectionLine, c.subsectionLine, c.sourceLine, c.coverageLine, ...c.editorialLines].filter((n): n is number => n !== null))].map(n => ({ ...evidence,
        id: `mechanics:${unitKey}:context:${n}`, startLine: n, endLine: n, excerpt: lines[n - 1].text, excerptSha256: sha(lines[n - 1].text), claim: 'Parent source/section/coverage/editorial context; inherited only for this fenced block.' }));
      staging = StagingEntrySchema.parse({ schemaVersion: 1, id, identity, name: u.name, kind,
        source: { status: sourceId ? 'resolved' : 'pending', sourceId, rawLabel: refs.map(r => r.label).join(' + '),
          reason: decision?.resolution === 'latest-source' ? decision.reason : sourceId ? 'Explicit CUR-003 source reference; edition/permission not certified.' : 'Publication identity or attribution among multiple editions requires review; no source selected implicitly.' },
        representation: 'full-text', originalText: u.originalText, normalizedText: null, normalizationDiffRef: null,
        printedPage: null, pdfPageDeclared: evidence.pdfPageDeclared, stage: warnings.length ? 'blocked' : 'captured', scopeTags: tags, region: null,
        searchAliases: [], equivalenceGroupIds: [], lineage: [], review: { schemaVersion: 1, subjectId: id ?? `pending:mechanics:${unitKey}`,
          sourcePermission: axis('needs-review', 'No edition/permission certification inherited.'),
          transcription: axis('md-checked', 'Exact MD lines and inherited context captured.', [evidence.id]),
          structure: axis('unreviewed', 'Signal-based draft boundaries/categories; original publication needs review.'),
          mechanics: axis('unreviewed', decision ? `${decision.reason} Decision: ${DECISIONS}#${decision.unitKey}; no mechanical certification.` : 'No formulas, dice, traits, prices or effects interpreted.'),
          automation: { ...axis('unsupported', 'Draft curation only.'), handlerRef: null, testRefs: [] }, evidence: [evidence, ...contextEvidence] } });
    }
    const domainCandidates = [
      { domain: 'vehicle', matches: /\b(?:vehicle|wagon|cart|carriage|chariot|boat|ship|galley|airship|truck|atv|tank|war machine)s?\b/i.test(u.name), basis: 'Literal vehicle term in the unit name; subtype/consumer contract remains unreviewed.' },
      { domain: 'relic', matches: /\brelics?\b/i.test(u.name) || u.category !== 'creature' && /\brelics?\b/i.test(c.subsection ?? ''), basis: 'Literal relic term in the name or explicit subsection; no relic powers interpreted.' },
      { domain: 'hazard-or-environment', matches: u.category !== 'creature' && /\b(?:hazards?|weather|terrain|diseases?|plagues?|radiation|poison)\b/i.test(u.name), basis: 'Literal hazard/environment term in a non-creature unit; effects remain unreviewed.' },
    ].filter(h => h.matches).map(({ domain, basis }) => ({ domain, basis, status: 'unreviewed' as const }));
    return { segment: { schemaVersion: 1, unitKey, category: u.category, subtype: u.subtype, name: u.name, basis: u.basis, confidence: u.confidence, domainCandidates,
      startLine: u.startLine, endLine: u.endLine, container: c, sources: refs.map(r => ({ label: r.label, sourceId: r.sourceId, line: r.line })),
      scopeTags: tags, rawTags, parentTable: u.parentTable, pageMarkers, warnings,
      dependencyResolution: decision?.resolution === 'standalone-creature' ? decision : null,
      attributionResolution: decision?.resolution === 'latest-source' ? decision : null, originalText: u.originalText, evidence,
      entityId: staging?.id ?? null, status: staging?.stage ?? (u.category === 'layout' ? 'layout' : 'quarantined') }, staging,
      outputPath: staging ? `curation/entries/${sourceId ? encodeURIComponent(sourceId) : '_pending'}/${kind}.jsonl` : null };
  });
  if (used.size !== ledger.entries.length) throw new Error('Unused ledger entries require explicit reconciliation');
  if (appliedDecisions.size !== decisions.length) throw new Error('Unused mechanics decision requires reconciliation');
  return { results, containers };
}

export async function buildArtifacts(root: string) {
  const read = (path: string) => readFile(resolve(root, path));
  const manifestBytes = await read('curation/input-manifest.json'), manifest = InputManifestSchema.parse(JSON.parse(manifestBytes.toString('utf8')));
  const file = manifest.files.find(f => f.path === INPUT); if (!file) throw new Error('Mechanics input missing from manifest');
  const bytes = await read(INPUT); if (bytes.length > 16 * 1024 * 1024) throw new Error('Mechanics input exceeds 16 MiB');
  if (sha(bytes) !== file.sha256) throw new Error('Mechanics input changed; revise manifest first.');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); if (Buffer.from(text).compare(bytes) !== 0) throw new Error('Byte-preserving decode required');
  const registryBytes = await read('curation/sources.json'), registry = SourceRegistrySchema.parse(JSON.parse(registryBytes.toString('utf8'))), ledgerBytes = await read(LEDGER);
  if (registry.inputManifestSha256 !== sha(manifestBytes) || registry.aliasDecisionsSha256 !== sha(await read('curation/source-aliases.json'))) throw new Error('Registry revision mismatch');
  const decisionBytes = await read(DECISIONS);
  const { results, containers } = extractMechanics(text, registry, JSON.parse(ledgerBytes.toString('utf8')), JSON.parse(decisionBytes.toString('utf8'))), artifacts = new Map<string, string>();
  for (const r of [...results].sort((a, b) => (a.segment.unitKey ?? '') < (b.segment.unitKey ?? '') ? -1 : (a.segment.unitKey ?? '') > (b.segment.unitKey ?? '') ? 1 : a.segment.startLine - b.segment.startLine)) {
    if (r.staging && r.outputPath) { const output = JSON.stringify(sanitizeArtifact(r.staging)) + '\n'; if (Buffer.byteLength(output) > 4 * 1024 * 1024) throw new Error('Staging record exceeds 4 MiB'); artifacts.set(r.outputPath, (artifacts.get(r.outputPath) ?? '') + output); }
  }
  artifacts.set(SEGMENTS, results.map(r => JSON.stringify(sanitizeArtifact(r.segment))).join('\n') + '\n');
  const lines = sourceLines(text), excludedRanges: (Span & { reason: string })[] = []; let cursor = 1;
  for (const c of containers) { if (cursor < c.startLine) excludedRanges.push({ startLine: cursor, endLine: c.startLine - 1, reason: 'editorial-manifest-metadata-or-fence' }); cursor = c.endLine + 1; }
  if (cursor <= lines.length) excludedRanges.push({ startLine: cursor, endLine: lines.length, reason: 'editorial-audit-and-maintenance' });
  const counts = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map(v => [v, values.filter(x => x === v).length]));
  const report = { schemaVersion: 1, task: 'CUR-011', reviewDate: manifest.reviewDate,
    extractor: { privacyPolicySha256: sha(await read('tools/curation/privacy.mjs')), version: '1.0.0', sha256: sha(await read('tools/curation/mechanics-extractor.ts')), runnerSha256: sha(await read('tools/curation/mechanics.mjs')), lineUtilitySha256: sha(await read('tools/curation/ancestry-extractor.ts')) },
    input: file, inputManifestSha256: sha(manifestBytes), sourceRegistrySha256: sha(registryBytes), ledgerSha256: sha(ledgerBytes),
    decisionRef: { path: DECISIONS, sha256: sha(decisionBytes) },
    counts: { containers: containers.length, segments: results.length, categories: counts(results.map(r => r.segment.category)),
      staged: results.filter(r => r.staging).length, captured: results.filter(r => r.staging?.stage === 'captured').length,
      blocked: results.filter(r => r.staging?.stage === 'blocked').length, quarantined: results.filter(r => !r.staging && r.segment.category !== 'layout').length,
      layout: results.filter(r => r.segment.category === 'layout').length,
      warningKinds: counts(results.flatMap(r => r.segment.warnings)) },
    coverage: { inputLines: lines.length, payloadLines: containers.reduce((sum, c) => sum + c.endLine - c.startLine + 1, 0),
      segmentLines: results.reduce((sum, r) => sum + r.segment.endLine - r.segment.startLine + 1, 0), excludedRanges },
    outputs: [...artifacts].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, data]) => ({ path, sha256: sha(data), records: data.trimEnd().split('\n').length })),
    units: results.map(r => ({ unitKey: r.segment.unitKey, entityId: r.segment.entityId, name: r.segment.name, category: r.segment.category, subtype: r.segment.subtype,
      startLine: r.segment.startLine, endLine: r.segment.endLine, section: r.segment.container.section, subsection: r.segment.container.subsection,
      sourceLine: r.segment.container.sourceLine, sourceIds: r.segment.sources.map(s => s.sourceId), outputPath: r.outputPath, scopeTags: r.segment.scopeTags,
      status: r.segment.status, warnings: r.segment.warnings, dependencyResolution: r.segment.dependencyResolution, attributionResolution: r.segment.attributionResolution, domainCandidates: r.segment.domainCandidates, originalTextSha256: sha(r.segment.originalText) })) };
  artifacts.set(REPORT, JSON.stringify(sanitizeArtifact(report), null, 2) + '\n'); return { artifacts, report };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--init-ledger', '--write', '--check'].includes(args[0])) throw new Error('Use --init-ledger (once), --write or --check');
  if (args[0] === '--init-ledger') {
    try { await access(resolve(root, LEDGER)); throw new Error('Refusing to overwrite mechanics ledger'); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    const text = await readFile(resolve(root, INPUT), 'utf8'), lines = sourceLines(text), units = parseContainers(text).flatMap(c => segmentContainer(c, lines));
    const ledger = initialLedger(units); await writeFile(resolve(root, LEDGER), JSON.stringify(ledger, null, 2) + '\n', { flag: 'wx' });
    console.log(`Mechanics ledger: ${ledger.entries.length} stable keys for ${units.length} draft segments.`); return;
  }
  const { artifacts, report } = await buildArtifacts(root);
  const dirs = await readdir(resolve(root, 'curation/entries'), { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => { if (error.code === 'ENOENT') return []; throw error; });
  for (const dir of dirs) {
    if (dir.isSymbolicLink()) throw new Error('Symlink in staging directory'); if (!dir.isDirectory()) continue;
    for (const kind of ['rule', 'item', 'creature']) { const path = `curation/entries/${dir.name}/${kind}.jsonl`;
      try { await readFile(resolve(root, path)); if (!artifacts.has(path)) throw new Error(`Orphan mechanics output requires reconciliation: ${path}`); }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    }
  }
  for (const [path, output] of artifacts) { assertSafeArtifact(path, output);
    if (args[0] === '--write') { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), output); }
    else if (await readFile(resolve(root, path), 'utf8') !== output) throw new Error(`Generated mechanics artifact changed: ${path}`);
  }
  console.log(`Mechanics: ${report.counts.containers} containers, ${report.counts.segments} segments; ${report.counts.captured} captured, ${report.counts.blocked} blocked, ${report.counts.quarantined} quarantined. ${args[0]}`);
}
