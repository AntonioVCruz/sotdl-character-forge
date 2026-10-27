import { z } from 'zod';

export const ATTRIBUTE_KEYS = ['strength', 'agility', 'intellect', 'will'] as const;
const AttributeSchema = z.enum(ATTRIBUTE_KEYS);
const RefSchema = z.enum([...ATTRIBUTE_KEYS, 'health', 'perception', 'selectedSize']);
const EvidenceRefs = z.array(z.string().min(1)).min(1);
export const BaseFormulaSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('constant'), value: z.number().finite() }).strict(),
  z.object({ op: z.literal('copy'), ref: RefSchema }).strict(),
  z.object({ op: z.literal('subtract'), ref: RefSchema, amount: z.number().finite() }).strict(),
  z.object({ op: z.literal('divide-floor'), ref: RefSchema, divisor: z.number().positive() }).strict(),
]);
export const BaseRuleSchema = z.object({ id: z.string().min(1), target: z.string().min(1), formula: BaseFormulaSchema,
  minimum: z.number().finite().nullable(), maximum: z.number().finite().nullable(), evidenceIds: EvidenceRefs,
  composition: z.enum(['direct', 'inherited-core', 'general-rule']), reason: z.string().min(1),
}).strict();
export const HumanBaseSpecSchema = z.object({ schemaVersion: z.literal(1), task: z.literal('CUR-015'), targetLevel: z.literal(0),
  variants: z.array(z.object({ id: z.enum(['core', 'only-human']), sourceId: z.string(), entityId: z.string(), evidenceIds: EvidenceRefs,
    attributeModes: z.array(z.enum(['fixed', 'random'])).min(1),
    languages: z.object({ grantedSpeech: z.tuple([z.literal('Common Tongue')]), grantedLiteracy: z.array(z.string()).length(0),
      additionalChoice: z.enum(['one-language-or-random-profession', 'development-tables']), evidenceIds: EvidenceRefs }).strict(),
    startingNamedTraits: z.array(z.string()).length(0), excludedFutureEvidenceIds: EvidenceRefs,
  }).strict()).length(2),
  attributes: z.object({ fixed: z.object({ base: z.literal(10), increaseOneBy: z.literal(1), evidenceIds: EvidenceRefs }).strict(),
    random: z.object({ base: z.literal(8), count: z.literal(1), sides: z.literal(3), independentRolls: z.literal(4), evidenceIds: EvidenceRefs }).strict(),
    adjustment: z.object({ optional: z.literal(true), maximumTransfers: z.literal(1), amount: z.literal(1), distinctAttributes: z.literal(true),
      applyAfterMode: z.literal(true), minimumScore: z.literal(1), maximumScore: z.literal(20), evidenceIds: EvidenceRefs }).strict(),
  }).strict(),
  size: z.object({ choices: z.tuple([z.literal(0.5), z.literal(1)]), independentOfBuild: z.literal(true), evidenceIds: EvidenceRefs }).strict(),
  rules: z.array(BaseRuleSchema).min(1),
  deferred: z.array(z.object({ id: z.string(), taskRefs: z.array(z.string()).min(1), reason: z.string() }).strict()).min(1),
}).strict().superRefine((spec, ctx) => {
  if (new Set(spec.variants.map(v => v.id)).size !== 2 || new Set(spec.variants.map(v => v.entityId)).size !== 2)
    ctx.addIssue({ code: 'custom', message: 'Distinct publication variants required' });
  const known = new Set<string>([...ATTRIBUTE_KEYS, 'selectedSize']);
  for (const rule of spec.rules) {
    if (known.has(rule.target) || rule.formula.op !== 'constant' && !known.has(rule.formula.ref))
      ctx.addIssue({ code: 'custom', message: `Duplicate or out-of-order formula: ${rule.target}` });
    if (rule.minimum !== null && rule.maximum !== null && rule.minimum > rule.maximum)
      ctx.addIssue({ code: 'custom', message: 'Invalid formula bounds' });
    known.add(rule.target);
  }
});
export type HumanBaseSpec = z.infer<typeof HumanBaseSpecSchema>;
const FaceSet = z.object({ strength: z.number().int().min(1).max(3), agility: z.number().int().min(1).max(3),
  intellect: z.number().int().min(1).max(3), will: z.number().int().min(1).max(3) }).strict();
const adjustment = z.object({ increase: AttributeSchema, decrease: AttributeSchema }).strict()
  .refine(v => v.increase !== v.decrease, 'Transfer needs distinct attributes');
const common = { variant: z.enum(['core', 'only-human']), size: z.union([z.literal(0.5), z.literal(1)]), adjustment: adjustment.nullable() };
export const HumanBaseRequestSchema = z.discriminatedUnion('mode', [
  z.object({ ...common, mode: z.literal('fixed'), increase: AttributeSchema }).strict(),
  z.object({ ...common, mode: z.literal('random'), faces: FaceSet }).strict(),
]);

export function evaluateBaseRule(ruleInput: unknown, values: Record<string, number>) {
  const rule = BaseRuleSchema.parse(ruleInput), f = rule.formula;
  const value = f.op === 'constant' ? f.value : values[f.ref];
  if (!Number.isFinite(value)) throw new Error(`Missing numeric reference for ${rule.target}`);
  let result = f.op === 'subtract' ? value - f.amount : f.op === 'divide-floor' ? Math.floor(value / f.divisor) : value;
  if (rule.minimum !== null) result = Math.max(rule.minimum, result);
  if (rule.maximum !== null) result = Math.min(rule.maximum, result);
  return result;
}

/** Curation-only reference preview. No RNG, source switching, table outcomes, equipment or level gains. */
export function previewHumanBase(specInput: unknown, requestInput: unknown) {
  const spec = HumanBaseSpecSchema.parse(specInput), request = HumanBaseRequestSchema.parse(requestInput);
  const variant = spec.variants.find(v => v.id === request.variant);
  if (!variant || !variant.attributeModes.includes(request.mode)) throw new Error('Attribute mode not published for this variant');
  const attributes = Object.fromEntries(ATTRIBUTE_KEYS.map(key => [key, request.mode === 'fixed' ? spec.attributes.fixed.base : spec.attributes.random.base + request.faces[key]])) as Record<typeof ATTRIBUTE_KEYS[number], number>;
  if (request.mode === 'fixed') attributes[request.increase] += spec.attributes.fixed.increaseOneBy;
  if (request.adjustment) {
    attributes[request.adjustment.increase] += spec.attributes.adjustment.amount;
    attributes[request.adjustment.decrease] -= spec.attributes.adjustment.amount;
  }
  if (Object.values(attributes).some(n => n < spec.attributes.adjustment.minimumScore || n > spec.attributes.adjustment.maximumScore)) throw new Error('Attribute outside published score bounds');
  const values: Record<string, number> = { ...attributes, selectedSize: request.size };
  const traces: { target: string; value: number; ruleId: string; evidenceIds: string[]; composition: string }[] = ATTRIBUTE_KEYS.map(key => ({
    target: key, value: attributes[key], ruleId: `human-base:attribute:${key}`, composition: 'direct',
    evidenceIds: [...spec.attributes[request.mode].evidenceIds,
      ...(request.adjustment && [request.adjustment.increase, request.adjustment.decrease].includes(key) ? spec.attributes.adjustment.evidenceIds : [])],
  }));
  for (const rule of spec.rules) {
    values[rule.target] = evaluateBaseRule(rule, values);
    traces.push({ target: rule.target, value: values[rule.target], ruleId: rule.id, evidenceIds: rule.evidenceIds,
      composition: rule.composition === 'inherited-core' && request.variant === 'core' ? 'direct' : rule.composition });
  }
  const { selectedSize: _selection, ...base } = values;
  return { kind: 'curation-human-base-preview' as const, variant: request.variant, ancestryEntityId: variant.entityId, mode: request.mode,
    base, traces, languageRules: variant.languages, startingNamedTraits: variant.startingNamedTraits,
    deferred: spec.deferred, completeCharacter: false as const };
}
