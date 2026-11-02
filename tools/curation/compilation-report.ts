import { z } from 'zod';
import type { Pack } from '../../packages/catalog';
import { StagingEntrySchema } from '../../packages/curation/contracts';
import { RevisionRefSchema } from '../../packages/curation/source-policy';
import { compareStrings } from './canonical-json';

export const STAGING_PATHS = {
  'sotdl:shadow-of-the-demon-lord-core': 'curation/entries/sotdl%3Ashadow-of-the-demon-lord-core/ancestry.jsonl',
  'sotdl:only-human': 'curation/entries/sotdl%3Aonly-human/ancestry.jsonl',
} as const;
const stagingPath = z.enum([STAGING_PATHS['sotdl:shadow-of-the-demon-lord-core'], STAGING_PATHS['sotdl:only-human']]);
const inputPath = z.enum(['curation/human-l0-compilation.json', 'curation/sources.json', ...stagingPath.options]);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const outputPath = z.string().regex(/^(?:content-packs\/sotdl%3A(?:only-human|shadow-of-the-demon-lord-core)\/\d+\.\d+\.\d+(?:-[\w.-]+)?\/pack\.json|compendios\/ancestry\.index\.json)$/);
const origin = z.object({ path: stagingPath, line: z.number().int().positive(), sha256: hash }).strict();
const input = z.object({ path: inputPath, bytes: z.number().int().nonnegative(), sha256: hash }).strict();
const exclusionReason = z.enum(['invalid-staging', 'unresolved-source', 'source-file-mismatch', 'reference-only', 'blocked', 'restricted-source', 'outside-selection']);
const pendingCode = z.enum(['source-permission-review', 'transcription-review', 'structure-review', 'mechanics-review',
  'automation-support', 'printed-page', 'content-review', 'mechanical-projection', 'integrated-validation', 'ruleset-integration']);
const pendingState = z.enum(['needs-review', 'unreviewed', 'blocked', 'restricted', 'manual', 'unsupported', 'missing', 'not-implemented', 'not-enabled']);

export const CompilationReportSchema = z.object({
  schemaVersion: z.literal(1), projection: z.literal('human-l0-ancestry-stubs'),
  scope: z.literal('recipe-registry-and-two-ancestry-staging-files'),
  inputs: z.array(input).length(4),
  counts: z.object({ recordsRead: z.number().int().nonnegative(), included: z.number().int().nonnegative(),
    excluded: z.number().int().nonnegative(), pending: z.number().int().nonnegative() }).strict(),
  included: z.array(z.object({ ref: RevisionRefSchema, origin, status: z.literal('needs-review') }).strict()),
  excluded: z.array(z.object({ origin, reasons: z.array(exclusionReason).min(1) }).strict()),
  pending: z.array(z.object({ code: pendingCode, ref: RevisionRefSchema.nullable(), state: pendingState }).strict()),
  outputs: z.object({ sha256: hash, files: z.array(z.object({ path: outputPath, sha256: hash }).strict()).length(3) }).strict(),
}).strict();
export type CompilationReport = z.infer<typeof CompilationReportSchema>;
export type InputDigest = z.infer<typeof input>;
export type LocatedRecord = z.infer<typeof origin> & { sourceId: keyof typeof STAGING_PATHS; value: unknown };

const refKey = (ref: z.infer<typeof RevisionRefSchema>) => JSON.stringify([ref.packId, ref.version, ref.entityId]);
const originOrder = (a: z.infer<typeof origin>, b: z.infer<typeof origin>) => compareStrings(a.path, b.path) || a.line - b.line;

/** Account for every parsed nonblank record without persisting free-form input fields. */
export function buildCompilationReport(inputs: InputDigest[], records: LocatedRecord[], packs: Pack[],
  outputs: { sha256: string; hashes: { path: string; sha256: string }[] }): CompilationReport {
  if (new Set(inputs.map(i => i.path)).size !== 4 ||
      new Set(records.map(r => JSON.stringify([r.path, r.line]))).size !== records.length)
    throw new Error('Compilation report: duplicate or missing input locations.');
  const parsed = records.map(record => ({ record, parsed: StagingEntrySchema.safeParse(record.value) }));
  const included: CompilationReport['included'] = [], excluded: CompilationReport['excluded'] = [];
  const pending: CompilationReport['pending'] = [];
  const selected = new Set<LocatedRecord>();
  for (const pack of packs) for (const entity of pack.entities) {
    const matches = parsed.filter(({ record, parsed }) => record.path === STAGING_PATHS[record.sourceId] &&
      record.sourceId === pack.source.id && parsed.success && parsed.data.id === entity.id);
    if (matches.length !== 1) throw new Error('Compilation report: selected origin missing or ambiguous.');
    const { record, parsed: result } = matches[0];
    if (!result.success) throw new Error('Compilation report: invalid selected record.');
    selected.add(record);
    const entry = result.data, ref = { packId: pack.packId, version: pack.version, entityId: entity.id };
    included.push({ ref, origin: { path: record.path, line: record.line, sha256: record.sha256 }, status: 'needs-review' });
    const axes = [
      ['source-permission-review', entry.review.sourcePermission, ['authorized']],
      ['transcription-review', entry.review.transcription, ['md-checked', 'pdf-checked']],
      ['structure-review', entry.review.structure, ['checked']],
      ['mechanics-review', entry.review.mechanics, ['checked']],
      ['automation-support', entry.review.automation, ['implemented']],
    ] as const;
    for (const [code, axis, accepted] of axes) if (!(accepted as readonly string[]).includes(axis.status))
      pending.push({ code, ref, state: pendingState.parse(axis.status) });
    if (entry.printedPage === null) pending.push({ code: 'printed-page', ref, state: 'missing' });
  }
  for (const { record, parsed: result } of parsed) {
    if (selected.has(record)) continue;
    const reasons: z.infer<typeof exclusionReason>[] = [];
    if (!result.success) reasons.push('invalid-staging');
    else {
      const entry = result.data;
      if (entry.source.status === 'pending') reasons.push('unresolved-source');
      else if (entry.source.sourceId !== record.sourceId) reasons.push('source-file-mismatch');
      if (entry.representation === 'reference-only') reasons.push('reference-only');
      if (entry.stage === 'blocked' || [entry.review.transcription, entry.review.structure, entry.review.mechanics, entry.review.automation]
        .some(axis => axis.status === 'blocked')) reasons.push('blocked');
      if (entry.review.sourcePermission.status === 'restricted') reasons.push('restricted-source');
      reasons.push('outside-selection');
    }
    // Excluded IDs/names/reasons can be untrusted; locator+digest are sufficient to find the record.
    excluded.push({ origin: { path: record.path, line: record.line, sha256: record.sha256 }, reasons: reasons.sort(compareStrings) });
  }
  pending.push({ code: 'content-review', ref: null, state: 'needs-review' },
    { code: 'mechanical-projection', ref: null, state: 'not-implemented' },
    { code: 'integrated-validation', ref: null, state: 'not-implemented' },
    { code: 'ruleset-integration', ref: null, state: 'not-enabled' });
  included.sort((a, b) => compareStrings(refKey(a.ref), refKey(b.ref)));
  excluded.sort((a, b) => originOrder(a.origin, b.origin));
  pending.sort((a, b) => compareStrings(a.ref ? refKey(a.ref) : '', b.ref ? refKey(b.ref) : '') || compareStrings(a.code, b.code));
  const candidate = { schemaVersion: 1, projection: 'human-l0-ancestry-stubs', scope: 'recipe-registry-and-two-ancestry-staging-files',
    inputs: [...inputs].sort((a, b) => compareStrings(a.path, b.path)),
    counts: { recordsRead: records.length, included: included.length, excluded: excluded.length, pending: pending.length },
    included, excluded, pending,
    outputs: { sha256: outputs.sha256, files: [...outputs.hashes].sort((a, b) => compareStrings(a.path, b.path)) } };
  const report = CompilationReportSchema.safeParse(candidate);
  if (!report.success || included.length + excluded.length !== records.length || selected.size !== included.length ||
      new Set(outputs.hashes.map(file => file.path)).size !== outputs.hashes.length)
    throw new Error('Compilation report: invalid accounting or metadata.');
  return report.data;
}
