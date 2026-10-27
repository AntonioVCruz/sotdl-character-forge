import { z } from 'zod';
import { CurationId } from './evidence';

export const EntityKind = z.enum(['ancestry', 'path', 'spell', 'item', 'trait', 'condition', 'creature', 'rule', 'randomTable']);
export const IdentitySchema = z.object({
  sourceId: CurationId,
  kind: EntityKind,
  entryKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(70),
  variantKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(40),
}).strict();
export type CurationIdentity = z.infer<typeof IdentitySchema>;

/** Keys are assigned once in the ledger, never regenerated from current names or lines. */
export function entityId(input: CurationIdentity): string {
  const key = IdentitySchema.parse(input);
  return CurationId.parse(`${key.sourceId}:${key.kind}:${key.entryKey}:${key.variantKey}`);
}

export const LineageSchema = z.object({
  relation: z.enum(['reprint-of', 'variant-of', 'derived-from', 'equivalent-text']),
  targetId: CurationId,
  status: z.enum(['proposed', 'verified']),
  evidenceIds: z.array(CurationId).min(1),
  responsible: z.string().min(1), reason: z.string().min(1),
}).strict();
