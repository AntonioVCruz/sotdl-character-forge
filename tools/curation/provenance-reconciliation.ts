import { createHash } from 'node:crypto';
import { z } from 'zod';

export const sha256 = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const ref = z.object({ path: z.string().min(1), sha256: hash }).strict();
export const RECONCILED_PATHS = [
  ...['creation-table-inventory','professions-languages','wealth-equipment','interesting-things','items','table-closure'].map(n=>`curation/pilot/${n}.json`),
  ...['creation-table-inventory','professions-languages','wealth-equipment','interesting-things','pilot-items','table-closure'].map(n=>`curation/reports/${n}.json`),
];
export const ProvenanceTransitionSchema = z.object({
  path: z.string().refine(p=>RECONCILED_PATHS.includes(p)), previousSha256: hash, currentSha256: hash,
  metadataBefore: z.object({ inputRefs: z.array(ref), outputs: z.array(ref).optional() }).strict(),
}).strict().refine(t=>t.path.startsWith('curation/reports/') === (t.metadataBefore.outputs!==undefined));
export const ProvenanceReconciliationSchema = z.object({
  schemaVersion:z.literal(1),reviewId:z.literal('issue34-activity1-provenance-2026-11-02'),reviewDate:z.literal('2026-11-02'),
  reviewer:z.literal('Codex'),scope:z.literal('metadata-only-reconciliation'),
  producerChange:z.object({path:z.literal('tools/curation/creation-table-inventory.ts'),previousSha256:hash,currentSha256:hash,change:z.literal('exports-only')}).strict(),
  transitions:z.array(ProvenanceTransitionSchema).length(12),
}).strict().refine(r=>new Set(r.transitions.map(t=>t.path)).size===12);
export type ProvenanceTransition = z.infer<typeof ProvenanceTransitionSchema>;

/** Restore only the former top-level provenance and prove the entire historical artifact hash.
 * This cannot authorize a changed formula, evidence, status, text or other payload field.
 */
export function verifyProvenanceTransition(bytes:Buffer, transitionInput:unknown, expectedPreviousSha256:string) {
  const result=ProvenanceTransitionSchema.safeParse(transitionInput);
  if(!result.success)throw new Error('Provenance transition schema invalid.');
  const t=result.data;
  if(t.previousSha256!==expectedPreviousSha256||sha256(bytes)!==t.currentSha256)throw new Error('Provenance transition hash mismatch.');
  let current:Record<string,unknown>;
  try {current=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
  catch {throw new Error('Provenance transition JSON invalid.');}
  if(!current||Array.isArray(current)||typeof current!=='object'||!Array.isArray(current.inputRefs))throw new Error('Provenance transition payload invalid.');
  const restored={...current,inputRefs:t.metadataBefore.inputRefs};
  if(t.metadataBefore.outputs!==undefined)Object.assign(restored,{outputs:t.metadataBefore.outputs});
  if(sha256(JSON.stringify(restored,null,2)+'\n')!==expectedPreviousSha256)throw new Error('Provenance transition changes reviewed payload.');
  return t;
}
