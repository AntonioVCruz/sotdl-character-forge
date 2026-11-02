import { z } from 'zod';
import { PackSchema, validatePack } from '../catalog';
import { RevisionRefSchema } from './source-policy';

export const HUMAN_L0_CONTRACT = 'sotdl.human-l0.mechanics' as const;
export const HUMAN_L0_CONTRACT_VERSION = '1.0.0' as const;
const Attribute = z.enum(['strength', 'agility', 'intellect', 'will']);
const id = z.string().min(1).max(200), hash = z.string().regex(/^[a-f0-9]{64}$/);
export const HumanL0InheritedComponentSchema = z.enum(['attributes.adjustment', 'attributes.limits', 'healingRate.rounding', 'healingRate.minimum',
  'initialStates.damage', 'initialStates.insanity', 'initialStates.corruption', 'modifiers.subtract', 'finalLimits.defense', 'finalLimits.perception']);
const evidenceIds = z.array(id).min(1).max(100).refine(ids => new Set(ids).size === ids.length, 'Duplicate evidence reference.');
export const MechanicalOriginSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('declared'), scope: z.enum(['ancestry', 'general-rule']), evidenceIds }).strict(),
  z.object({ kind: z.literal('inherited'), from: RevisionRefSchema.extend({ componentId: HumanL0InheritedComponentSchema }).strict(), evidenceIds }).strict(),
  z.object({ kind: z.literal('product-decision'), evidenceIds }).strict(),
]);
const origin = MechanicalOriginSchema;
const number = z.number().finite(), positive = z.number().finite().positive();
const value = z.object({ value: number, origin }).strict();
const positiveValue = value.extend({ value: positive.int() }).strict();
const evidence = z.discriminatedUnion('kind', [
  z.object({ id, kind: z.literal('source'), sourceId: id, medium: z.enum(['md', 'user-transcription']), inputSha256: hash,
    startLine: z.number().int().positive(), endLine: z.number().int().positive(),
    printedPageDeclared: z.number().int().positive().nullable(), pdfPageDeclared: z.number().int().positive().nullable() }).strict(),
  z.object({ id, kind: z.literal('product-decision'), inputSha256: hash, decisionId: id, pointer: z.string().regex(/^\/[a-zA-Z0-9_~/-]+$/) }).strict(),
]);
const fixed = z.object({ base: positive.int(), chooseExactly: z.literal(1), increaseBy: positive.int(), origin }).strict();
const random = z.object({ base: number.int().nonnegative(), dice: z.object({ count: z.literal(1), sides: z.number().int().min(2).max(100) }).strict(),
  rolls: z.literal('one-independent-roll-per-attribute'), origin }).strict();
const coreProcedure = z.object({ kind: z.literal('core'), attributeModeIndependent: z.literal(true), storySelection: z.literal('manual-or-random'),
  startingProfessions: z.object({ count: z.number().int().positive(), selection: z.literal('manual-or-random'), origin }).strict(),
  ancestryBenefit: z.object({ chooseExactly: z.literal(1), alternatives: z.tuple([z.literal('speak-language'), z.literal('random-profession')]), origin }).strict(),
  wealthResolution: z.literal('external-core-procedure'), origin }).strict();
const developmentProcedure = z.object({ kind: z.literal('human-development'), attributeModeIndependent: z.literal(true), storySelection: z.literal('published-rolls'),
  replaces: z.tuple([z.literal('random-starting-professions'), z.literal('starting-wealth')]),
  grants: z.literal('from-complete-development-procedure'), implicitCoreBenefit: z.literal(false), origin }).strict();

export const HumanL0MechanicsSchema = z.object({
  contract: z.literal(HUMAN_L0_CONTRACT), contractVersion: z.literal(HUMAN_L0_CONTRACT_VERSION), level: z.literal(0),
  variant: z.enum(['core', 'only-human']), evidence: z.array(evidence).min(1).max(1000),
  attributes: z.object({ fixed, random: random.nullable(),
    adjustment: z.object({ optional: z.literal(true), maximumTransfers: z.literal(1), amount: positive.int(),
      distinctAttributes: z.literal(true), phase: z.literal('after-mode'), origin }).strict(),
    limits: z.object({ minimum: positive.int(), maximum: positive.int(), phase: z.literal('after-attribute-effects'), origin }).strict(),
  }).strict(),
  characteristics: z.object({
    health: z.object({ op: z.literal('copy'), attribute: z.literal('strength'), input: z.literal('final-attributes'), origin }).strict(),
    defense: z.object({ op: z.literal('copy'), attribute: z.literal('agility'), input: z.literal('final-attributes'), origin }).strict(),
    perception: z.object({ op: z.literal('copy'), attribute: z.literal('intellect'), input: z.literal('final-attributes'), origin }).strict(),
    speed: positiveValue, power: value.extend({ value: number.int().nonnegative() }).strict(),
  }).strict(),
  healingRate: z.object({ input: z.literal('final-health'), divisor: positiveValue,
    rounding: z.object({ mode: z.literal('floor'), origin }).strict(), minimum: positiveValue }).strict(),
  size: z.object({ choices: z.array(positive).min(1).max(20), origin,
    independence: z.object({ fromBuild: z.literal(false), origin }).strict() }).strict(),
  initialStates: z.object({ phase: z.literal('creation-only'), reapplyOnRecalculation: z.literal(false),
    damage: value.extend({ value: number.int().nonnegative() }).strict(),
    insanity: value.extend({ value: number.int().nonnegative() }).strict(), corruption: value.extend({ value: number.int().nonnegative() }).strict() }).strict(),
  modifiers: z.object({ input: z.literal('final-scores'), subtract: positiveValue,
    targets: z.tuple([z.literal('strength'), z.literal('agility'), z.literal('intellect'), z.literal('will'), z.literal('perception')]) }).strict(),
  finalLimits: z.object({ phase: z.literal('after-direct-effects-and-equipment'), defense: positiveValue, perception: positiveValue }).strict(),
  baseLanguage: z.object({ languageId: id, abilities: z.tuple([z.literal('speak')]), origin }).strict(),
  procedure: z.discriminatedUnion('kind', [coreProcedure, developmentProcedure]),
  evaluationOrder: z.tuple([z.literal('attribute-mode'), z.literal('optional-transfer'), z.literal('attribute-effects'),
    z.literal('attribute-limits'), z.literal('base-characteristics'), z.literal('direct-characteristic-effects'),
    z.literal('final-limits'), z.literal('healing-rate'), z.literal('modifiers')]),
}).strict().superRefine((m, ctx) => {
  const error = (message: string, path: (string | number)[] = []) => ctx.addIssue({ code: 'custom', message, path });
  if (new Set(m.evidence.map(e => e.id)).size !== m.evidence.length) error('Duplicate evidence ID.', ['evidence']);
  for (const [i, e] of m.evidence.entries()) if (e.kind === 'source' && e.startLine > e.endLine) error('Inverted evidence range.', ['evidence', i]);
  if (m.attributes.limits.minimum > m.attributes.limits.maximum) error('Inverted attribute limits.', ['attributes', 'limits']);
  const { minimum, maximum } = m.attributes.limits;
  if (m.attributes.fixed.base < minimum || m.attributes.fixed.base + m.attributes.fixed.increaseBy > maximum ||
      m.attributes.random && (m.attributes.random.base + 1 < minimum || m.attributes.random.base + m.attributes.random.dice.sides > maximum))
    error('Attribute mode outside declared limits.', ['attributes']);
  if (new Set(m.size.choices).size !== m.size.choices.length) error('Duplicate Size option.', ['size', 'choices']);
  if ((m.variant === 'core') !== (m.attributes.random === null) ||
      (m.variant === 'core' ? m.procedure.kind !== 'core' : m.procedure.kind !== 'human-development'))
    error('Variant/modes/procedure mismatch.');
});
export type HumanL0Mechanics = z.infer<typeof HumanL0MechanicsSchema>;

export const HumanL0MechanicalEntitySchema = z.object({
  id, kind: z.literal('ancestry'), name: z.string().min(1), sourceRef: id, sourcePage: z.number().int().positive().nullable(),
  variantKey: id, revision: id, status: z.enum(['curated', 'needs-review', 'incomplete']), mechanics: HumanL0MechanicsSchema,
}).strict();
export const HumanL0MechanicalPackSchema = PackSchema.extend({ source: PackSchema.shape.source.strict(),
  entities: z.array(HumanL0MechanicalEntitySchema).length(1) }).strict();
export type HumanL0MechanicalPack = z.infer<typeof HumanL0MechanicalPackSchema>;

type Component = { origin: z.infer<typeof origin>; [key: string]: unknown };
function components(m: HumanL0Mechanics) {
  const found = new Map<string, Component>();
  function walk(value: unknown, path: string) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    const object = value as Record<string, unknown>;
    if ('origin' in object) found.set(path, object as Component);
    for (const [key, child] of Object.entries(object)) if (key !== 'origin') walk(child, path ? `${path}.${key}` : key);
  }
  walk(m, ''); return found;
}
const stable = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  return JSON.stringify(value);
};
const withoutOrigin = ({ origin: _origin, ...value }: Component) => value;
const footprint = ({ id: _id, ...e }: HumanL0Mechanics['evidence'][number]) => stable(e);
const CORE = 'sotdl:shadow-of-the-demon-lord-core', EXPANDED = 'sotdl:only-human';
const inheritedPaths = new Set<string>(HumanL0InheritedComponentSchema.options);
const generalPaths = new Set(['attributes.adjustment', 'attributes.limits', 'healingRate.minimum', 'modifiers.subtract',
  'finalLimits.defense', 'finalLimits.perception', 'procedure', 'procedure.startingProfessions']);

export class HumanL0ContractError extends Error {
  constructor(public readonly code: string, public readonly pointer: string) {
    super(`${HUMAN_L0_CONTRACT}#${pointer}: ${code}`); this.name = 'HumanL0ContractError';
  }
}
const fail = (code: string, pointer = '/'): never => { throw new HumanL0ContractError(code, pointer); };

/** Explicit contract gate; generic parsePack/importPack alone does not validate mechanical payloads. */
export function parseHumanL0MechanicalPacks(input: unknown): HumanL0MechanicalPack[] {
  const parsed = z.array(HumanL0MechanicalPackSchema).min(1).max(2).safeParse(input);
  if (!parsed.success) return fail('schema-invalid');
  const packs = parsed.data;
  const core = packs.find(p => p.entities[0].mechanics.variant === 'core');
  const expanded = packs.find(p => p.entities[0].mechanics.variant === 'only-human');
  if (!core || (packs.length === 2 && !expanded) || expanded &&
      (core.packId === expanded.packId || core.source.id === expanded.source.id || core.fictionalData !== expanded.fictionalData))
    return fail('ambiguous-or-mixed-source-pair');
  if (core.dependencies.length || expanded && (expanded.dependencies.length !== 1 ||
      expanded.dependencies[0].packId !== core.packId || expanded.dependencies[0].version !== core.version))
    return fail('exact-core-dependency-required', '/dependencies');
  for (const [i, pack] of packs.entries()) {
    const entity = pack.entities[0], m = entity.mechanics, base = `/${i}/entities/0/mechanics`;
    const realSource = m.variant === 'core' ? CORE : EXPANDED;
    if (pack.fictionalData ? [CORE, EXPANDED].includes(pack.source.id) : pack.source.id !== realSource)
      return fail('source-fictional-mismatch', `/${i}/source`);
    if (entity.sourceRef !== pack.source.id || entity.revision !== pack.version ||
        entity.variantKey !== (m.variant === 'core' ? 'default' : 'variant') ||
        entity.id !== `${pack.source.id}:ancestry:human:${entity.variantKey}`)
      return fail('entity-identity-mismatch', `/${i}/entities/0`);
    if (validatePack(pack, packs).some(d => d.severity === 'error')) return fail('catalog-invalid', `/${i}`);
    const citations = new Map(m.evidence.map(e => [e.id, e]));
    const used = new Set<string>();
    const providerEntity = core.entities[0], provider = components(providerEntity.mechanics);
    for (const [path, component] of components(m)) {
      const o = component.origin, pointer = `${base}/${path.replaceAll('.', '/')}/origin`;
      const refs = o.evidenceIds.map(id => { used.add(id); const e = citations.get(id); if (!e) return fail('evidence-missing', pointer); return e; });
      if (path === 'size.independence') {
        if (o.kind !== 'product-decision' || refs.some(e => e.kind !== 'product-decision')) return fail('product-decision-required', pointer);
      } else if (m.variant === 'only-human' && inheritedPaths.has(path)) {
        if (o.kind !== 'inherited' || o.from.packId !== core.packId || o.from.version !== core.version ||
            o.from.entityId !== providerEntity.id || o.from.componentId !== path)
          return fail('exact-component-inheritance-required', pointer);
        const original = provider.get(path);
        if (!original || original.origin.kind !== 'declared' ||
            stable(withoutOrigin(original)) !== stable(withoutOrigin(component))) return fail('inherited-value-mismatch', pointer);
        const sourceEvidence = providerEntity.mechanics.evidence;
        const expected = original.origin.evidenceIds.map(id => sourceEvidence.find(e => e.id === id));
        if (expected.some(e => !e) || refs.some(e => e.kind !== 'source' || e.sourceId !== core.source.id) ||
            stable(refs.map(footprint).sort()) !== stable(expected.map(e => footprint(e!)).sort()))
          return fail('inherited-evidence-mismatch', pointer);
      } else {
        if (o.kind !== 'declared' || refs.some(e => e.kind !== 'source' || e.sourceId !== pack.source.id) ||
            o.scope !== (generalPaths.has(path) && !(m.variant === 'only-human' && path === 'procedure') ? 'general-rule' : 'ancestry'))
          return fail('variant-declaration-required', pointer);
      }
    }
    if (used.size !== m.evidence.length) return fail('unused-evidence', `${base}/evidence`);
  }
  return expanded ? [core, expanded] : [core];
}

const transfer = z.object({ increase: Attribute, decrease: Attribute }).strict().refine(v => v.increase !== v.decrease, 'Distinct attributes required.');
export const HumanL0SelectionSchema = z.object({
  schemaVersion: z.literal(1), contract: z.literal(HUMAN_L0_CONTRACT), contractVersion: z.literal(HUMAN_L0_CONTRACT_VERSION),
  ancestry: RevisionRefSchema,
  attributes: z.discriminatedUnion('mode', [
    z.object({ mode: z.literal('fixed'), increase: Attribute }).strict(),
    z.object({ mode: z.literal('random'), seed: id, prngVersion: id,
      rolls: z.array(z.object({ attribute: Attribute, eventId: id, face: z.number().int().positive() }).strict()).length(4) }).strict(),
  ]), adjustment: transfer.nullable(), size: positive,
  procedure: z.object({ ref: RevisionRefSchema, kind: z.enum(['core', 'human-development']) }).strict(),
  coreBenefit: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('speak-language'), languageId: id }).strict(),
    z.object({ kind: z.literal('random-profession'), rollEventId: id }).strict(),
  ]).nullable(),
}).strict();
export type HumanL0Selection = z.infer<typeof HumanL0SelectionSchema>;

/** Validate a selection envelope only; does not roll dice, execute tables or compute a character. */
export function parseHumanL0Selection(input: unknown, packInput: unknown): HumanL0Selection {
  const packs = parseHumanL0MechanicalPacks(packInput), selected = HumanL0SelectionSchema.safeParse(input);
  if (!selected.success) return fail('selection-schema-invalid');
  const selection = selected.data;
  const find = (ref: z.infer<typeof RevisionRefSchema>) => packs.find(p => p.packId === ref.packId && p.version === ref.version && p.entities[0].id === ref.entityId)?.entities[0].mechanics;
  const ancestry = find(selection.ancestry), procedure = find(selection.procedure.ref)?.procedure;
  if (!ancestry || !procedure || procedure.kind !== selection.procedure.kind) return fail('selection-reference-missing');
  if (!ancestry.size.choices.includes(selection.size)) return fail('unsupported-size', '/size');
  const scores = new Map<string, number>();
  if (selection.attributes.mode === 'fixed') for (const attribute of Attribute.options)
    scores.set(attribute, ancestry.attributes.fixed.base + (attribute === selection.attributes.increase ? ancestry.attributes.fixed.increaseBy : 0));
  else {
    const mode = ancestry.attributes.random, rolls = selection.attributes.rolls;
    if (!mode || new Set(rolls.map(r => r.attribute)).size !== 4 || new Set(rolls.map(r => r.eventId)).size !== 4 || rolls.some(r => r.face > mode.dice.sides))
      return fail('unsupported-or-inconsistent-random-mode', '/attributes');
    for (const roll of rolls) scores.set(roll.attribute, mode.base + roll.face);
  }
  if (selection.adjustment) {
    scores.set(selection.adjustment.increase, scores.get(selection.adjustment.increase)! + ancestry.attributes.adjustment.amount);
    scores.set(selection.adjustment.decrease, scores.get(selection.adjustment.decrease)! - ancestry.attributes.adjustment.amount);
  }
  if ([...scores.values()].some(score => score < ancestry.attributes.limits.minimum || score > ancestry.attributes.limits.maximum))
    return fail('selection-score-out-of-bounds', '/attributes');
  if ((ancestry.variant === 'core' && procedure.kind === 'core') !== (selection.coreBenefit !== null))
    return fail('procedure-benefit-conflict', '/coreBenefit');
  if (selection.coreBenefit?.kind === 'speak-language' && selection.coreBenefit.languageId === ancestry.baseLanguage.languageId)
    return fail('additional-language-already-granted', '/coreBenefit');
  return selection;
}
