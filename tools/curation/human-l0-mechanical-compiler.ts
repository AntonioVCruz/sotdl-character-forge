import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { emptySnapshot, importPack, validateSnapshot } from '../../packages/catalog';
import { BaseRuleSchema, HumanBaseSpecSchema } from '../../packages/curation/ancestry-base-model';
import { HUMAN_L0_CONTRACT, HUMAN_L0_CONTRACT_VERSION, HumanL0MechanicsSchema,
  parseHumanL0MechanicalPacks, type HumanL0Mechanics } from '../../packages/curation/human-l0-mechanics';
import { canonicalJson, compareStrings } from './canonical-json';
import { STAGING_PATHS } from './compilation-report';
import { CORE_SOURCE_ID, ONLY_HUMAN_SOURCE_ID, parseHumanL0Recipe } from './human-l0-recipe';
import { compileHumanL0 } from './pack-compiler';
import { assertSafeArtifact } from './privacy.mjs';
import { buildThematicIndexes, validateIndexReferences } from './thematic-indexes';
import { ProvenanceReconciliationSchema, verifyProvenanceTransition } from './provenance-reconciliation';

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const same = (a: unknown, b: unknown) => canonicalJson(a) === canonicalJson(b);
const fail = (code: string): never => { throw new Error(`Human L0 mechanical compilation: ${code}; contents omitted.`); };
const REPORT = 'reports/human-l0-mechanics.json';
export function parseMechanicalRecipe(input: unknown) {
  if (!input || typeof input !== 'object' || !('projection' in input) || input.projection !== 'human-l0-mechanics') return fail('recipe-invalid');
  let recipe: ReturnType<typeof parseHumanL0Recipe>;
  try { recipe = parseHumanL0Recipe({ ...input, projection: 'human-l0-ancestry-stubs' }); }
  catch { return fail('recipe-invalid'); }
  if (recipe.packs.some(p => p.entityIds.length !== 1 || p.version === '0.1.0' || p.version === '0.1.1')) return fail('new-mechanical-version-required');
  return recipe;
}

// Normalized, numeric facts only. The local adapter below validates the reviewed pilot first.
// Public tests can exercise the projection with invented numbers, never licensed excerpts.
const positive = z.number().int().positive();
export const MechanicalFactsSchema = z.object({
  attributes: z.object({ fixed: z.object({ base: positive, increaseOneBy: positive }).strict(),
    random: z.object({ base: z.number().int().nonnegative(), count: z.literal(1), sides: positive }).strict(),
    adjustment: z.object({ amount: positive, minimumScore: positive, maximumScore: positive }).strict() }).strict(),
  size: z.array(z.number().positive()).min(1), rules: z.array(BaseRuleSchema),
  professionChoices: positive, languageId: z.string().min(1), decisionSha256: z.string().regex(/^[a-f0-9]{64}$/),
  evidence: HumanL0MechanicsSchema.shape.evidence,
}).strict();
export type MechanicalFacts = z.infer<typeof MechanicalFactsSchema>;

/** Project reviewed facts into typed components; no excerpt, reason or table body is copied. */
export function compileHumanL0Mechanics(recipeInput: unknown, registry: unknown, entries: unknown[], factsInput: unknown) {
  const recipe = parseMechanicalRecipe(recipeInput), checked = MechanicalFactsSchema.safeParse(factsInput);
  if (!checked.success) return fail('facts-invalid');
  const f = checked.data, metadata = compileHumanL0(recipe, registry, entries);
  const rule = (target: string) => {
    const matches = f.rules.filter(r => r.target === target);
    if (matches.length !== 1) return fail('rule-missing-or-ambiguous');
    return matches[0];
  };
  const targets = ['health','defense','perception','healingRate','speed','power','damage','insanity','corruption',
    'strengthModifier','agilityModifier','intellectModifier','willModifier','perceptionModifier','size'];
  if (f.rules.some(r => !targets.includes(r.target))) return fail('unmapped-rule');
  const constant = (target: string) => { const r = rule(target); if (r.formula.op !== 'constant') return fail('unexpected-formula'); return r.formula.value; };
  const core = metadata.packs.find(p => p.source.id === CORE_SOURCE_ID)!;
  const packs = metadata.packs.map(pack => {
    const expanded = pack.source.id === ONLY_HUMAN_SOURCE_ID, own = expanded ? 'human-expansion-attributes' : 'human-stats';
    const declared = (evidenceIds: string[], scope: 'ancestry' | 'general-rule' = 'ancestry') => ({ kind: 'declared' as const, scope, evidenceIds });
    const inherit = (path: string, evidenceIds: string[]) => ({ kind: 'inherited' as const,
      from: { packId: core.packId, version: core.version, entityId: core.entities[0].id, componentId: path }, evidenceIds });
    const general = (path: string, evidenceIds: string[]) => expanded ? inherit(path, evidenceIds) : declared(evidenceIds, 'general-rule');
    const state = (key: string) => ({ value: constant(key), origin: expanded ? inherit(`initialStates.${key}`, ['human-stats']) : declared(['human-stats']) });
    const copied = (key: string, attribute: string) => {
      const r = rule(key); if (r.formula.op !== 'copy' || r.formula.ref !== attribute) return fail('unexpected-formula');
      return { op: 'copy', attribute, input: 'final-attributes', origin: declared([own]) };
    };
    const healing = rule('healingRate');
    if (healing.formula.op !== 'divide-floor' || healing.formula.ref !== 'health' || healing.minimum === null) return fail('unexpected-healing-formula');
    const subtracts = ['strength','agility','intellect','will','perception'].map(key => {
      const r = rule(`${key}Modifier`); if (r.formula.op !== 'subtract' || r.formula.ref !== key) return fail('unexpected-modifier-formula'); return r.formula.amount;
    });
    if (new Set(subtracts).size !== 1) return fail('inconsistent-modifiers');
    const m = {
      contract: HUMAN_L0_CONTRACT, contractVersion: HUMAN_L0_CONTRACT_VERSION, level: 0, variant: expanded ? 'only-human' : 'core', evidence: [],
      attributes: {
        fixed: { base: f.attributes.fixed.base, chooseExactly: 1, increaseBy: f.attributes.fixed.increaseOneBy, origin: declared([own]) },
        random: expanded ? { base: f.attributes.random.base, dice: { count: f.attributes.random.count, sides: f.attributes.random.sides }, rolls: 'one-independent-roll-per-attribute', origin: declared([own]) } : null,
        adjustment: { optional: true, maximumTransfers: 1, amount: f.attributes.adjustment.amount, distinctAttributes: true, phase: 'after-mode', origin: general('attributes.adjustment', ['general-scores']) },
        limits: { minimum: f.attributes.adjustment.minimumScore, maximum: f.attributes.adjustment.maximumScore, phase: 'after-attribute-effects', origin: general('attributes.limits', ['general-scores']) },
      },
      characteristics: { health: copied('health','strength'), defense: copied('defense','agility'), perception: copied('perception','intellect'),
        speed: { value: constant('speed'), origin: declared([own]) }, power: { value: constant('power'), origin: declared([own]) } },
      healingRate: { input: 'final-health', divisor: { value: healing.formula.divisor, origin: declared([own]) },
        rounding: { mode: 'floor', origin: expanded ? inherit('healingRate.rounding', ['human-stats']) : declared(['human-stats']) },
        minimum: { value: healing.minimum, origin: general('healingRate.minimum', ['derived']) } },
      size: { choices: f.size, origin: declared([own]), independence: { fromBuild: false,
        origin: { kind: 'product-decision', evidenceIds: ['decision-size'] } } },
      initialStates: { phase: 'creation-only', reapplyOnRecalculation: false, damage: state('damage'), insanity: state('insanity'), corruption: state('corruption') },
      modifiers: { input: 'final-scores', subtract: { value: subtracts[0], origin: general('modifiers.subtract', ['general-scores','attributes']) },
        targets: ['strength','agility','intellect','will','perception'] },
      finalLimits: { phase: 'after-direct-effects-and-equipment',
        defense: { value: rule('defense').maximum, origin: general('finalLimits.defense', ['derived']) },
        perception: { value: rule('perception').maximum, origin: general('finalLimits.perception', ['derived']) } },
      baseLanguage: { languageId: f.languageId, abilities: ['speak'], origin: declared([expanded ? own : 'human-language']) },
      procedure: expanded ? { kind: 'human-development', attributeModeIndependent: true, storySelection: 'published-rolls',
        replaces: ['random-starting-professions','starting-wealth'], grants: 'from-complete-development-procedure', implicitCoreBenefit: false,
        origin: declared(['human-expansion-procedure']) } : { kind: 'core', attributeModeIndependent: true, storySelection: 'manual-or-random',
        startingProfessions: { count: f.professionChoices, selection: 'manual-or-random', origin: declared(['supplied-profession-procedure'], 'general-rule') },
        ancestryBenefit: { chooseExactly: 1, alternatives: ['speak-language','random-profession'], origin: declared(['human-language']) },
        wealthResolution: 'external-core-procedure', origin: declared(['ancestry-table-options'], 'general-rule') },
      evaluationOrder: ['attribute-mode','optional-transfer','attribute-effects','attribute-limits','base-characteristics','direct-characteristic-effects','final-limits','healing-rate','modifiers'],
    };
    const used = new Set<string>();
    function gather(v: unknown): void {
      if (!v || typeof v !== 'object') return;
      if (Array.isArray(v)) return v.forEach(gather);
      for (const [k, child] of Object.entries(v)) if (k === 'evidenceIds') for (const id of child as string[]) used.add(id); else gather(child);
    }
    gather(m);
    const available = [...f.evidence, { id: 'decision-size', kind: 'product-decision' as const, inputSha256: f.decisionSha256, decisionId: 'creation-decisions', pointer: '/size' }];
    const evidence = [...used].sort(compareStrings).map(id => {
      const matches = available.filter(e => e.id === id); if (matches.length !== 1) return fail('evidence-missing-or-ambiguous'); return matches[0];
    });
    return { ...pack, entities: [{ ...pack.entities[0], mechanics: { ...m, evidence } }] };
  });
  let valid: ReturnType<typeof parseHumanL0MechanicalPacks>;
  try { valid = parseHumanL0MechanicalPacks(packs); } catch { return fail('mechanical-contract-invalid'); }
  const artifacts = new Map<string,string>();
  for (const p of valid) artifacts.set(`content-packs/${encodeURIComponent(p.source.id)}/${p.version}/pack.json`, canonicalJson(p));
  for (const [path, index] of buildThematicIndexes(valid)) artifacts.set(path, canonicalJson(index));
  for (const [path, text] of artifacts) assertSafeArtifact(path,text);
  return { packs: valid, artifacts: new Map([...artifacts].sort(([a],[b]) => compareStrings(a,b))) };
}

export type MechanicalProvenance = { inputs: { path: string; bytes: number; sha256: string }[]; reviewId: string };
const outputHashes = (artifacts: ReadonlyMap<string,string>) => [...artifacts].filter(([p]) => p !== REPORT).sort(([a],[b]) => compareStrings(a,b)).map(([path,text]) => ({ path, sha256: sha(text) }));
function reportFor(compiled: ReturnType<typeof compileHumanL0Mechanics>, provenance: MechanicalProvenance) {
  const files = outputHashes(compiled.artifacts);
  return { schemaVersion: 1, projection: 'human-l0-mechanics', contract: HUMAN_L0_CONTRACT, contractVersion: HUMAN_L0_CONTRACT_VERSION,
    reviewId: provenance.reviewId, inputs: [...provenance.inputs].sort((a,b) => compareStrings(a.path,b.path)),
    outputs: { files, sha256: sha(canonicalJson(files)) }, counts: { packs: 2, entities: 2 },
    gates: { localOnly: true, sourcePermission: 'needs-review', distributionCertified: false, pdfInspected: false, runtimeIntegrated: false, officialGenerationEnabled: false },
    deferred: ['table-outcomes','equipment-effects','runtime-handlers','source-and-distribution-approval','freeze-and-enablement'] };
}

/** Reproject trusted inputs and compare every artifact, including provenance, not hashes alone. */
export function validateHumanL0MechanicalBundle(artifacts: ReadonlyMap<string,string>, recipe: unknown, registry: unknown,
  entries: unknown[], facts: unknown, provenance: MechanicalProvenance) {
  const expected = compileHumanL0Mechanics(recipe,registry,entries,facts);
  expected.artifacts.set(REPORT, canonicalJson(reportFor(expected,provenance)));
  if (artifacts.size !== expected.artifacts.size) return fail('artifact-inventory-mismatch');
  for (const [path,text] of expected.artifacts) if (artifacts.get(path) !== text) return fail('artifact-content-or-provenance-mismatch');
  const packs = parseHumanL0MechanicalPacks(expected.packs);
  validateIndexReferences(JSON.parse(artifacts.get('compendios/ancestry.index.json')!),packs);
  let snapshot = emptySnapshot();
  for (const pack of packs) snapshot = importPack(snapshot,pack).snapshot;
  snapshot = validateSnapshot(JSON.parse(JSON.stringify(snapshot)));
  parseHumanL0MechanicalPacks(snapshot.packs);
  if (snapshot.ruleset.packs.length) return fail('unexpected-activation');
  return { status: 'passed' as const, packs: packs.length, entities: packs.length, snapshot };
}

/** Local adapter: fail closed on stale pilot, review, whole inputs or individual evidence ranges. */
export async function buildMechanicalArtifacts(root: string) {
  const inputs: MechanicalProvenance['inputs'] = [], bytes = new Map<string,Buffer>();
  async function load(path: string) {
    if (!/^(curation|rules|packages|tests|tools)\/[a-zA-Z0-9_./%-]+$/.test(path) || path.split('/').some(s => s === '..' || !s)) return fail('input-path-invalid');
    if (!bytes.has(path)) {
      let value: Buffer; try { value = await readFile(resolve(root,path)); } catch { return fail('input-unavailable'); }
      bytes.set(path,value); inputs.push({ path, bytes: value.length, sha256: sha(value) });
    }
    return bytes.get(path)!;
  }
  async function json(path: string) {
    try { return JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await load(path))); }
    catch { return fail('json-input-invalid'); }
  }
  const recipe = await json('curation/human-l0-mechanical-compilation.json'); parseMechanicalRecipe(recipe);
  const review = await json('curation/reviews/human-l0-base-2026-11-02.json');
  if (review.reviewId !== 'human-l0-base-md-2026-11-02' || review.assessment !== 'base-confirmed-against-local-text-with-explicit-inheritance-and-decisions' ||
      !Array.isArray(review.inputs) || !Array.isArray(review.reviewedArtifacts) || !Array.isArray(review.evidence)) return fail('review-invalid');
  for (const ref of [...review.inputs,...review.reviewedArtifacts]) {
    const current=await load(ref.path);
    if(sha(current)===ref.sha256)continue;
    // Historical review is immutable. Only a receipt that reconstructs its exact bytes
    // from current content and former top-level metadata can bridge a changed digest.
    if(!review.reviewedArtifacts.some((r:{path:string})=>r.path===ref.path))return fail('review-input-stale');
    let receiptInput:unknown;
    try {receiptInput=await json('curation/reviews/issue34-activity1-provenance-2026-11-02.json');}catch{return fail('review-input-stale');}
    const receipt=ProvenanceReconciliationSchema.safeParse(receiptInput);
    if(!receipt.success||sha(await load(receipt.data.producerChange.path))!==receipt.data.producerChange.currentSha256)return fail('review-input-stale');
    const transition=receipt.data.transitions.find(t=>t.path===ref.path);
    try {verifyProvenanceTransition(current,transition,ref.sha256);}catch{return fail('review-input-stale');}
  }
  const formalization = await json('curation/pilot/human-ancestry.json'), professions = await json('curation/pilot/professions-languages.json');
  const result = HumanBaseSpecSchema.safeParse(formalization.spec);
  if (!result.success || formalization.gates?.runtimeIntegrated !== false || formalization.gates?.importablePack !== false) return fail('pilot-invalid');
  const spec = result.data;
  for (const v of spec.variants) if (v.sourceId !== (v.id === 'core' ? CORE_SOURCE_ID : ONLY_HUMAN_SOURCE_ID) ||
      !same(v.attributeModes,v.id === 'core' ? ['fixed'] : ['fixed','random']) ||
      v.languages.additionalChoice !== (v.id === 'core' ? 'one-language-or-random-profession' : 'development-tables')) return fail('variant-semantics-invalid');
  const decisions = await json('curation/pilot/creation-decisions.json');
  if (decisions.authority !== 'explicit-user-instruction' || decisions.size?.default !== 'ancestry-independent-of-build' ||
      !spec.size.independentOfBuild || professions.startingRights?.core?.manualOrRandom !== true ||
      professions.startingRights?.expanded?.fixedCoreRandomRollsAdded !== false) return fail('decision-or-procedure-invalid');
  const languages = professions.languageOptions?.filter((v: {label:string}) => v.label === spec.variants[0].languages.grantedSpeech[0]);
  if (!languages || languages.length !== 1 || !same(languages[0].defaultAbilities,['speak'])) return fail('base-language-invalid');
  const evidence: HumanL0Mechanics['evidence'] = [];
  for (const e of review.evidence) {
    const input = await load(e.path);
    if (sha(input) !== e.inputSha256 || !Number.isInteger(e.startLine) || !Number.isInteger(e.endLine) || e.startLine < 1 || e.endLine < e.startLine) return fail('evidence-input-invalid');
    const lines = new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(input).split(/\r\n|\n|\r/);
    if (e.endLine > lines.length || sha(lines.slice(e.startLine-1,e.endLine).join('\n')) !== e.excerptSha256) return fail('evidence-range-stale');
    evidence.push({ id: e.id, kind: 'source', sourceId: e.sourceId, medium: e.medium === 'text' ? 'user-transcription' : e.medium,
      inputSha256: e.inputSha256, startLine: e.startLine, endLine: e.endLine,
      printedPageDeclared: null, pdfPageDeclared: null });
  }
  const facts: MechanicalFacts = { attributes: { fixed: { base: spec.attributes.fixed.base, increaseOneBy: spec.attributes.fixed.increaseOneBy },
    random: { base: spec.attributes.random.base, count: spec.attributes.random.count, sides: spec.attributes.random.sides },
    adjustment: { amount: spec.attributes.adjustment.amount, minimumScore: spec.attributes.adjustment.minimumScore, maximumScore: spec.attributes.adjustment.maximumScore } },
    size: spec.size.choices, rules: spec.rules, professionChoices: professions.startingRights.core.professionChoices,
    languageId: languages[0].id, decisionSha256: sha(await load('curation/pilot/creation-decisions.json')), evidence };
  const entries: unknown[] = [];
  for (const path of Object.values(STAGING_PATHS)) {
    const text = new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await load(path));
    try { for (const line of text.split(/\r\n|\n|\r/)) if (line.trim()) entries.push(JSON.parse(line)); }
    catch { return fail('staging-json-invalid'); }
  }
  const registry = await json('curation/sources.json'), compiled = compileHumanL0Mechanics(recipe,registry,entries,facts);
  for (const path of ['tools/curation/human-l0-mechanical-compiler.ts','packages/curation/human-l0-mechanics.ts']) await load(path);
  const provenance = { inputs, reviewId: review.reviewId }, report = reportFor(compiled,provenance);
  compiled.artifacts.set(REPORT,canonicalJson(report));
  assertSafeArtifact(REPORT,canonicalJson(report));
  const validation = validateHumanL0MechanicalBundle(compiled.artifacts,recipe,registry,entries,facts,provenance);
  const hashes = [...compiled.artifacts].sort(([a],[b]) => compareStrings(a,b)).map(([path,text]) => ({path,sha256:sha(text)}));
  return { ...compiled, report, validation, hashes, sha256: sha(canonicalJson(hashes)) };
}
