import { z } from 'zod';

export const CurationId = z.string().min(1).max(200);
export const Sha256 = z.string().regex(/^[a-f0-9]{64}$/);
export const EvidenceSchema = z.object({
  id: CurationId,
  medium: z.enum(['md', 'pdf']),
  path: z.string().min(1),
  inputSha256: Sha256,
  startLine: z.number().int().positive().nullable(),
  endLine: z.number().int().positive().nullable(),
  physicalPdfPage: z.number().int().positive().nullable(),
  printedPageDeclared: z.string().min(1).nullable(),
  pdfPageDeclared: z.string().min(1).nullable(),
  heading: z.string(),
  excerpt: z.string().min(1),
  excerptSha256: Sha256,
  claim: z.string().min(1),
}).strict().superRefine((e, ctx) => {
  if (e.medium === 'md' && (e.startLine === null || e.endLine === null || e.endLine < e.startLine || e.physicalPdfPage !== null))
    ctx.addIssue({ code: 'custom', message: 'MD evidence requires an ordered line range and no inspected PDF page.' });
  if (e.medium === 'pdf' && (e.physicalPdfPage === null || e.startLine !== null || e.endLine !== null))
    ctx.addIssue({ code: 'custom', message: 'PDF evidence requires the inspected physical page; MD lines are separate evidence.' });
});
const review = <T extends [string, ...string[]]>(states: T) => z.object({
  status: z.enum(states), responsible: z.string().min(1), reason: z.string().min(1),
  evidenceIds: z.array(CurationId),
}).strict();
export const ReviewSchema = z.object({
  schemaVersion: z.literal(1), subjectId: CurationId,
  sourcePermission: review(['needs-review', 'authorized', 'restricted']),
  transcription: review(['unreviewed', 'md-checked', 'pdf-checked', 'blocked']),
  structure: review(['unreviewed', 'checked', 'blocked']),
  mechanics: review(['unreviewed', 'checked', 'manual', 'blocked']),
  automation: review(['unsupported', 'manual', 'implemented', 'blocked']).extend({
    handlerRef: z.string().min(1).nullable(), testRefs: z.array(z.string().min(1)),
  }),
  evidence: z.array(EvidenceSchema),
}).strict().superRefine((r, ctx) => {
  const ids = new Map(r.evidence.map(e => [e.id, e]));
  if (ids.size !== r.evidence.length) ctx.addIssue({ code: 'custom', message: 'Duplicate evidence ID.' });
  for (const axis of [r.sourcePermission, r.transcription, r.structure, r.mechanics, r.automation]) {
    for (const ref of axis.evidenceIds) if (!ids.has(ref)) ctx.addIssue({ code: 'custom', message: `Missing evidence: ${ref}` });
    if (['authorized', 'md-checked', 'pdf-checked', 'checked', 'implemented'].includes(axis.status) && !axis.evidenceIds.length)
      ctx.addIssue({ code: 'custom', message: 'A positive review requires explicit evidence.' });
  }
  if (r.transcription.status === 'pdf-checked' && !r.transcription.evidenceIds.some(id => ids.get(id)?.medium === 'pdf'))
    ctx.addIssue({ code: 'custom', message: 'MD audit claims cannot certify a PDF inspection.' });
  if (r.transcription.status === 'md-checked' && !r.transcription.evidenceIds.some(id => ids.get(id)?.medium === 'md'))
    ctx.addIssue({ code: 'custom', message: 'MD review requires MD evidence.' });
  if (r.automation.status === 'implemented' && (r.mechanics.status !== 'checked' || !r.automation.handlerRef || !r.automation.testRefs.length))
    ctx.addIssue({ code: 'custom', message: 'Automation requires reviewed mechanics, a handler and tests.' });
});
export type Evidence = z.infer<typeof EvidenceSchema>;
export type CurationReview = z.infer<typeof ReviewSchema>;
