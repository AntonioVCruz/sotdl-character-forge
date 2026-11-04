import { z } from 'zod';
import { HumanL0ConsumableDocumentSchema, parseHumanL0Consumable, type HumanL0ConsumableDocument } from './human-l0-consumable';

/** Shared by the node compiler and browser replay. Array order is meaningful. */
export function consumableJson(value: unknown): string {
  const sort = (v: unknown): unknown => Array.isArray(v) ? v.map(sort) : v && typeof v === 'object'
    ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, child]) => [k, sort(child)])) : v;
  return JSON.stringify(sort(value), null, 2) + '\n';
}
export async function consumableDigest(value: unknown): Promise<string> {
  const hash = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(consumableJson(value)));
  return [...new Uint8Array(hash)].map(n => n.toString(16).padStart(2, '0')).join('');
}
export function consumableIndexes(doc: HumanL0ConsumableDocument) {
  return {
    tables: doc.tables.map(t => ({ id: t.id, columns: t.columns.map(c => ({ id: c.id, rollId: c.rollId, rows: c.rows.map(r => r.id) })) })),
    lookups: doc.lookups.map(q => ({ id: q.id, queryId: q.reads.queryId, keys: q.keys.map(k => k.key) })),
    items: doc.items.map(i => i.id), grants: doc.grants.map(g => g.id), sideRolls: doc.sideRolls.map(s => s.id),
    manualResolutions: doc.manualResolutions.map(m => m.matrixId),
    groupedPendings: doc.groupedPendings.map(g => ({ id: g.id, represents: g.represents })),
  };
}
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const indexSchema = z.object({
  tables: z.array(z.object({id:z.string(),columns:z.array(z.object({id:z.string(),rollId:z.string(),rows:z.array(z.string())}).strict())}).strict()),
  lookups:z.array(z.object({id:z.string(),queryId:z.string(),keys:z.array(z.string())}).strict()),
  items:z.array(z.string()),grants:z.array(z.string()),sideRolls:z.array(z.string()),manualResolutions:z.array(z.string()),
  groupedPendings:z.array(z.object({id:z.string(),represents:z.number().int().positive()}).strict()),
}).strict();
export const ConsumableBundleSchema = z.object({
  contract:z.literal('sotdl.human-l0.consumable-bundle'),contractVersion:z.literal('1.0.0'),
  bundleId:z.string().regex(/^[a-z0-9-]{1,80}$/),version:z.string().regex(/^\d+\.\d+\.\d+$/),
  scope:z.literal('synthetic-contract'),rulesetEnabled:z.literal(false),exportEnabled:z.literal(false),
  input:z.object({path:z.literal('curation/examples/human-l0-consumable.synthetic.json'),sha256:digest}).strict(),
  documentSha256:digest,document:HumanL0ConsumableDocumentSchema,indexes:indexSchema,
}).strict();
export type ConsumableBundle = z.infer<typeof ConsumableBundleSchema>;
/** A hash detects changes, never certifies a semantic review or a distribution permission. */
export async function parseConsumableBundle(input: unknown): Promise<ConsumableBundle> {
  const checked = ConsumableBundleSchema.safeParse(input);
  if (!checked.success) throw new Error('Consumable bundle: invalid-envelope.');
  const bundle = checked.data, doc = parseHumanL0Consumable(bundle.document);
  if (await consumableDigest(doc) !== bundle.documentSha256 || consumableJson(consumableIndexes(doc)) !== consumableJson(bundle.indexes))
    throw new Error('Consumable bundle: content-or-index-mismatch.');
  return bundle;
}
