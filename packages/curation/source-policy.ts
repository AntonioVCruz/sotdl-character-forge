import { z } from 'zod';
import { CurationId, EvidenceSchema } from './evidence';

export const SourcePolicySchema = z.object({
  schemaVersion: z.literal(1),
  baselineSourceId: CurationId,
  optionalDefault: z.literal(false), regionalDefault: z.literal(false),
  relations: z.array(z.object({
    id: CurationId, type: z.enum(['errata-for', 'supersedes']),
    fromSourceId: CurationId, toSourceId: CurationId,
    scope: z.enum(['corrections-only', 'repeated-corrections-only']),
    status: z.enum(['declared-in-md', 'verified']), enabledByDefault: z.literal(false),
    evidenceIds: z.array(CurationId).min(1),
    responsible: z.string().min(1), reason: z.string().min(1),
  }).strict()),
  evidence: z.array(EvidenceSchema),
}).strict().superRefine((p, ctx) => {
  const ids = new Set(p.evidence.map(e => e.id));
  if (ids.size !== p.evidence.length) ctx.addIssue({ code: 'custom', message: 'Duplicate evidence ID.' });
  if (new Set(p.relations.map(r => r.id)).size !== p.relations.length) ctx.addIssue({ code: 'custom', message: 'Duplicate relation ID.' });
  for (const r of p.relations) {
    if (r.fromSourceId === r.toSourceId) ctx.addIssue({ code: 'custom', message: 'A relation cannot replace itself.' });
    for (const id of r.evidenceIds) if (!ids.has(id)) ctx.addIssue({ code: 'custom', message: `Missing evidence: ${id}` });
  }
});

export const RevisionRefSchema = z.object({
  packId: CurationId, version: z.string().regex(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/), entityId: CurationId,
}).strict();
export type RevisionRef = z.infer<typeof RevisionRefSchema>;

/** Validation aid for a future ruleset adapter. Never selects the newest candidate implicitly. */
export function chooseRevision(candidates: RevisionRef[], selected: RevisionRef | null): RevisionRef {
  const refs = z.array(RevisionRefSchema).parse(candidates);
  if (!selected) throw new Error('Escolha explícita da revisão obrigatória.');
  const wanted = RevisionRefSchema.parse(selected);
  const matches = refs.filter(r => r.packId === wanted.packId && r.version === wanted.version && r.entityId === wanted.entityId);
  if (matches.length !== 1) throw new Error('Revisão ausente ou ambígua; preservar referência e resolver pendência.');
  return { ...matches[0] };
}
