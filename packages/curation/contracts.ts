import { z } from 'zod';
import { CurationId, ReviewSchema } from './evidence';
import { entityId, EntityKind, IdentitySchema, LineageSchema } from './identity';
import { RevisionRefSchema, type SourcePolicySchema } from './source-policy';

const packRef = RevisionRefSchema.pick({ packId: true, version: true });
export const StagingEntrySchema = z.object({
  schemaVersion: z.literal(1),
  id: CurationId.nullable(), identity: IdentitySchema.nullable(),
  name: z.string().min(1), kind: EntityKind,
  source: z.object({
    status: z.enum(['resolved', 'pending']), sourceId: CurationId.nullable(),
    rawLabel: z.string().min(1), reason: z.string().min(1),
  }).strict(),
  representation: z.enum(['full-text', 'reference-only']),
  originalText: z.string().min(1).nullable(), normalizedText: z.string().min(1).nullable(),
  normalizationDiffRef: z.string().min(1).nullable(),
  printedPage: z.number().int().positive().nullable(), pdfPageDeclared: z.string().min(1).nullable(),
  stage: z.enum(['captured', 'structured', 'reviewed', 'blocked']),
  scopeTags: z.array(z.enum(['BASE', 'OPCIONAL', 'REGIONAL', 'EQUIPAMENTO', 'CRIATURA', 'DEPENDÊNCIA OMITIDA'])).max(6),
  region: z.string().min(1).nullable(),
  searchAliases: z.array(z.string().min(1)).max(100),
  equivalenceGroupIds: z.array(CurationId).max(100), lineage: z.array(LineageSchema).max(100),
  review: ReviewSchema,
}).strict().superRefine((e, ctx) => {
  if (!e.review.evidence.length) ctx.addIssue({ code: 'custom', message: 'Staging requires evidence.' });
  if (e.source.status === 'resolved') {
    if (!e.identity || !e.id || !e.source.sourceId) ctx.addIssue({ code: 'custom', message: 'Resolved staging requires identity, ID and source.' });
    else {
      try { if (entityId(e.identity) !== e.id) ctx.addIssue({ code: 'custom', message: 'Identity/ID mismatch.' }); }
      catch { ctx.addIssue({ code: 'custom', message: 'Identity exceeds catalog limits.' }); }
      if (e.identity.sourceId !== e.source.sourceId || e.identity.kind !== e.kind || e.review.subjectId !== e.id)
        ctx.addIssue({ code: 'custom', message: 'Source/kind/review subject mismatch.' });
    }
  } else if (e.identity !== null || e.id !== null || e.source.sourceId !== null || e.stage !== 'blocked')
    ctx.addIssue({ code: 'custom', message: 'Unresolved source: preserve evidence, null identity and blocked stage.' });
  if (e.representation === 'full-text' && e.originalText === null) ctx.addIssue({ code: 'custom', message: 'Full text cannot be absent.' });
  if (e.representation === 'reference-only' && (e.originalText !== null || e.normalizedText !== null || e.stage !== 'blocked'))
    ctx.addIssue({ code: 'custom', message: 'Reference-only cannot fabricate text or pass the compilation gate.' });
  if ((e.normalizedText === null) !== (e.normalizationDiffRef === null)) ctx.addIssue({ code: 'custom', message: 'Normalized text requires an explicit diff reference.' });
  if (e.scopeTags.includes('REGIONAL') && e.region === null && e.stage !== 'blocked')
    ctx.addIssue({ code: 'custom', message: 'Regional scope must be identified or blocked.' });
  if (e.stage === 'reviewed' && (e.review.structure.status !== 'checked' || e.review.mechanics.status !== 'checked' || !['md-checked', 'pdf-checked'].includes(e.review.transcription.status)))
    ctx.addIssue({ code: 'custom', message: 'Reviewed stage requires independent transcription/structure/mechanics reviews.' });
});

export const ThematicIndexSchema = z.object({
  schemaVersion: z.literal(1), category: z.enum([...EntityKind.options, 'tradition']),
  entries: z.array(z.object({
    name: z.string().min(1), searchAliases: z.array(z.string().min(1)).max(100),
    ref: RevisionRefSchema, kind: EntityKind, sourceId: CurationId, variantKey: z.string().min(1),
    equivalenceGroupId: CurationId.nullable(),
  }).strict()).max(100000),
}).strict().superRefine((index, ctx) => {
  const refs = new Set<string>();
  for (const e of index.entries) {
    if (index.category !== 'tradition' && index.category !== e.kind) ctx.addIssue({ code: 'custom', message: 'Index category/kind mismatch.' });
    const key = JSON.stringify(e.ref);
    if (refs.has(key)) ctx.addIssue({ code: 'custom', message: 'Duplicate index reference.' });
    refs.add(key);
  }
});

export const RulesetCurationSchema = z.object({
  schemaVersion: z.literal(1), rulesetId: CurationId,
  packs: z.array(packRef).max(500),
  selections: z.array(z.object({
    subjectKey: CurationId, ref: RevisionRefSchema, variantKey: z.string().min(1),
    scope: z.enum(['base', 'optional', 'regional']),
    region: z.string().min(1).nullable(), optionKey: CurationId.nullable(),
  }).strict()).max(10000),
  overrides: z.array(z.object({
    relationId: CurationId, base: RevisionRefSchema, replacement: RevisionRefSchema,
    scopeKey: CurationId, responsible: z.string().min(1), reason: z.string().min(1),
  }).strict()).max(10000),
}).strict().superRefine((r, ctx) => {
  const keys = r.packs.map(p => p.packId);
  if (new Set(keys).size !== keys.length) ctx.addIssue({ code: 'custom', message: 'Only one selected version per pack.' });
  const checkRef = (ref: z.infer<typeof RevisionRefSchema>) => {
    if (!r.packs.some(p => p.packId === ref.packId && p.version === ref.version)) ctx.addIssue({ code: 'custom', message: 'Reference outside selected pack versions.' });
  };
  const subjects = new Set<string>();
  for (const s of r.selections) {
    checkRef(s.ref);
    if (s.scope === 'regional' && !s.region || s.scope === 'optional' && !s.optionKey)
      ctx.addIssue({ code: 'custom', message: 'Optional/regional selection requires explicit scope.' });
    const key = JSON.stringify([s.subjectKey, s.scope, s.region, s.optionKey]);
    if (subjects.has(key)) ctx.addIssue({ code: 'custom', message: 'Conflicting selections for the same subject/scope.' });
    subjects.add(key);
  }
  const targets = new Set<string>();
  for (const o of r.overrides) {
    checkRef(o.base); checkRef(o.replacement);
    const key = JSON.stringify([o.base, o.scopeKey]);
    if (targets.has(key)) ctx.addIssue({ code: 'custom', message: 'Conflicting overrides require explicit resolution.' });
    targets.add(key);
    if (JSON.stringify(o.base) === JSON.stringify(o.replacement)) ctx.addIssue({ code: 'custom', message: 'An override must select a different revision.' });
  }
});

export function validateRulesetRelations(input: unknown, policy: z.infer<typeof SourcePolicySchema>) {
  const ruleset = RulesetCurationSchema.parse(input);
  for (const override of ruleset.overrides) {
    if (!policy.relations.some(r => r.id === override.relationId && r.status === 'verified'))
      throw new Error(`Relação de substituição não verificada: ${override.relationId}`);
  }
  return ruleset;
}
