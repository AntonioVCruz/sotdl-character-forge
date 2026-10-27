import { z } from 'zod';
import { CurationId, Sha256 } from './evidence';

const count = z.number().int().nonnegative();
const line = z.number().int().positive();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const location = { path: z.string().min(1), inputSha256: Sha256, line };
export const InputManifestSchema = z.object({
  schemaVersion: z.literal(1), reviewDate: date,
  extractor: z.object({ id: z.literal('curation-inputs'), version: z.string().min(1), sha256: Sha256 }).strict(),
  files: z.array(z.object({
    path: z.string().min(1), bytes: count, lines: count, sha256: Sha256, revisionId: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    encoding: z.literal('utf-8'), bom: z.boolean(), lineEndings: z.object({ crlf: count, lf: count, cr: count }).strict(),
    finalNewline: z.boolean(), title: z.string(),
  }).strict()).max(10000),
}).strict().superRefine((m, ctx) => {
  if (new Set(m.files.map(f => f.path)).size !== m.files.length) ctx.addIssue({ code: 'custom', message: 'Duplicate input path.' });
  for (const f of m.files) if (f.revisionId !== `sha256:${f.sha256}`) ctx.addIssue({ code: 'custom', message: 'Revision/hash mismatch.' });
});

export const SourceAliasesSchema = z.object({
  schemaVersion: z.literal(1), aliases: z.array(z.object({
    label: z.string().min(1), canonicalTitle: z.string().min(1),
    status: z.enum(['proposed', 'confirmed-in-md']), reason: z.string().min(1),
  }).strict()).max(10000),
}).strict();

export const SourceRegistrySchema = z.object({
  schemaVersion: z.literal(1), reviewDate: date, inputManifestSha256: Sha256,
  scannerVersion: z.string().min(1), aliasDecisionsSha256: Sha256,
  reconciliation: z.object({ declared: count, manifestRows: count, uniqueSources: count, metadataReferences: count,
    totalReferences: count, resolved: count, pending: count, scope: z.string().min(1) }).strict(),
  sources: z.array(z.object({
    id: CurationId, title: z.string().min(1), category: z.enum(['core', 'supplement', 'errata']),
    edition: z.string().nullable(), revision: z.string().nullable(), editionStatus: z.literal('unconfirmed'),
    availability: z.object({ md: z.literal(true), pdf: z.literal('not-provided-in-rules') }).strict(),
    provenanceStatus: z.literal('needs-review'), paginationStatus: z.literal('declared-only'),
    declaration: z.object(location).strict(), aliases: z.array(z.string().min(1)),
  }).strict()).max(10000),
  references: z.array(z.object({
    ...location, rawLabel: z.string().min(1), label: z.string().min(1), role: z.enum(['manifest', 'metadata', 'declaration']),
    heading: z.string(), printedPageDeclared: z.string().nullable(), pdfPageDeclared: z.string().nullable(), pdfCoverageDeclared: z.string().nullable(),
    sourceId: CurationId.nullable(), resolution: z.enum(['normalized-label', 'explicit-alias', 'pending']),
  }).strict()).max(1000000),
  pending: z.array(z.object({ path: z.string().min(1), line, label: z.string().min(1), candidateSourceId: CurationId.nullable(), reason: z.string().min(1) }).strict()).max(1000000),
}).strict().superRefine((r, ctx) => {
  const ids = new Set(r.sources.map(s => s.id));
  const c = r.reconciliation;
  if (ids.size !== r.sources.length || c.uniqueSources !== ids.size || c.manifestRows !== r.references.filter(ref => ref.role === 'manifest').length)
    ctx.addIssue({ code: 'custom', message: 'Source/manifest accounting mismatch.' });
  if (c.totalReferences !== r.references.length || c.pending !== r.pending.length || c.resolved + c.pending !== c.totalReferences || c.metadataReferences !== r.references.filter(ref => ref.role === 'metadata').length)
    ctx.addIssue({ code: 'custom', message: 'Reference accounting mismatch.' });
  for (const ref of r.references) {
    if (ref.sourceId !== null && (!ids.has(ref.sourceId) || ref.resolution === 'pending')) ctx.addIssue({ code: 'custom', message: 'Unknown/inconsistent source reference.' });
    if (ref.sourceId === null && (ref.resolution !== 'pending' || !r.pending.some(p => p.path === ref.path && p.line === ref.line && p.label === ref.label)))
      ctx.addIssue({ code: 'custom', message: 'Unresolved reference without explicit pending record.' });
  }
  for (const p of r.pending) if (p.candidateSourceId !== null && !ids.has(p.candidateSourceId)) ctx.addIssue({ code: 'custom', message: 'Unknown candidate source.' });
});
