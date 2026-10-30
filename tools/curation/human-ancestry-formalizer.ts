import { assertSafeArtifact } from './privacy.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { BaseRuleSchema, HumanBaseSpecSchema, previewHumanBase } from '../../packages/curation/ancestry-base-model';
import { buildArtifacts as buildPilot } from './core-pilot-matrix';

const sha = (v: string | Buffer) => createHash('sha256').update(v).digest('hex');
const DATA = 'curation/pilot/human-ancestry.json', REPORT = 'curation/reports/human-ancestry.json';
export async function buildArtifacts(root: string) {
  const pilot = await buildPilot(root), pilotPath = 'curation/pilot/core-level-zero.json';
  const pilotBytes = await readFile(resolve(root, pilotPath));
  if (pilotBytes.toString('utf8') !== pilot.artifacts.get(pilotPath)) throw new Error('CUR-014 matrix stale; regenerate first');
  const m = pilot.matrix, core = m.ancestryExpansionScope.base, expanded = m.ancestryExpansionScope.expansion;
  const rule = (target: string, formula: unknown, evidenceIds: string[], reason: string, composition = 'direct', minimum: number | null = null, maximum: number | null = null) =>
    BaseRuleSchema.parse({ id: `human-base:${target}`, target, formula, minimum, maximum, evidenceIds, composition, reason });
  const rules = [
    rule('health', { op: 'copy', ref: 'strength' }, ['human-stats', 'human-expansion-attributes'], 'Health is the final Strength score in both published blocks.'),
    rule('perception', { op: 'copy', ref: 'intellect' }, ['human-stats', 'human-expansion-attributes', 'derived'], 'Base Perception equals final Intellect; general cap 25.', 'direct', null, 25),
    rule('defense', { op: 'copy', ref: 'agility' }, ['human-stats', 'human-expansion-attributes', 'derived'], 'Unarmored base Defense equals final Agility; general cap 25. Armor/shields are later layers.', 'direct', null, 25),
    rule('healingRate', { op: 'divide-floor', ref: 'health', divisor: 4 }, ['human-stats', 'human-expansion-attributes', 'derived'], 'Core Human explicitly rounds down; Only Human repeats the quarter formula without a different rounding instruction, inheriting floor. General rule supplies minimum 1.', 'inherited-core', 1),
    rule('size', { op: 'copy', ref: 'selectedSize' }, ['human-stats', 'human-expansion-attributes'], 'Choose Size 1/2 or 1 independently of Build under the explicit user decision.'),
    rule('speed', { op: 'constant', value: 10 }, ['human-stats', 'human-expansion-attributes'], 'Speed 10 is declared in both blocks.'),
    rule('power', { op: 'constant', value: 0 }, ['human-stats', 'human-expansion-attributes'], 'Power 0 is declared in both blocks.'),
    ...['damage', 'insanity', 'corruption'].map(target => rule(target, { op: 'constant', value: 0 }, ['human-stats', 'human-expansion-attributes'],
      'Core explicitly initializes this state to zero. Only Human omits it; inherit the Core baseline, never claim a direct supplement value or reset later table effects.', 'inherited-core', 0)),
    ...(['strength', 'agility', 'intellect', 'will', 'perception'] as const).map(ref => rule(`${ref}Modifier`, { op: 'subtract', ref, amount: 10 },
      ref === 'perception' ? ['general-scores', 'attributes', 'derived'] : ['general-scores', 'attributes'],
      'Attribute modifier = final score minus 10; Perception works as an attribute with a score and modifier.', 'general-rule')),
  ];
  const spec = HumanBaseSpecSchema.parse({ schemaVersion: 1, task: 'CUR-015', targetLevel: 0,
    variants: [
      { id: 'core', sourceId: core.sourceId, entityId: core.entityId, evidenceIds: ['human-source', 'human-stats', 'human-language'], attributeModes: ['fixed'],
        languages: { grantedSpeech: ['Common Tongue'], grantedLiteracy: [], additionalChoice: 'one-language-or-random-profession', evidenceIds: ['human-language'] },
        startingNamedTraits: [], excludedFutureEvidenceIds: ['human-future'] },
      { id: 'only-human', sourceId: expanded.sourceId, entityId: expanded.entityId, evidenceIds: ['human-expansion-source', 'human-expansion-attributes'], attributeModes: ['fixed', 'random'],
        languages: { grantedSpeech: ['Common Tongue'], grantedLiteracy: [], additionalChoice: 'development-tables', evidenceIds: ['human-expansion-attributes', 'human-expansion-procedure'] },
        startingNamedTraits: [], excludedFutureEvidenceIds: ['human-expansion-level-four'] },
    ],
    attributes: { fixed: { base: 10, increaseOneBy: 1, evidenceIds: ['human-stats', 'human-expansion-attributes'] },
      random: { base: 8, count: 1, sides: 3, independentRolls: 4, evidenceIds: ['human-expansion-attributes'] },
      adjustment: { optional: true, maximumTransfers: 1, amount: 1, distinctAttributes: true, applyAfterMode: true, minimumScore: 1, maximumScore: 20, evidenceIds: ['general-scores'] } },
    size: { choices: [0.5, 1], independentOfBuild: true, evidenceIds: ['human-stats', 'human-expansion-attributes'] }, rules,
    deferred: [
      { id: 'development-and-background', taskRefs: ['CUR-016', 'CUR-017', 'CUR-021'], reason: 'Keep table procedure independent of attribute mode; outcomes can change attributes, states, languages or professions. No table outcomes applied to base preview.' },
      { id: 'equipment-and-effects', taskRefs: ['CUR-018', 'CUR-019', 'CUR-020', 'CUR-027', 'CUR-034'], reason: 'Armor replaces/protects Defense and may alter Speed; scope/conditional effects cannot be invented from the base or generic item name.' },
      { id: 'future-levels', taskRefs: ['CUR-023'], reason: 'Both level-4 blocks excluded at level 0. Do not stack Health +5 or merge different Determined text.' },
      { id: 'runtime-selection-and-formulas', taskRefs: ['CUR-033', 'CUR-034'], reason: 'Current demo stores seven numeric baseStats. Add variant/mode selection, declarative formulas, modifiers, Size, Perception, Healing Rate and separate initial states. Recompute dependencies after attribute changes, composing later direct characteristic modifiers in their proper layer instead of freezing final numbers.' },
      { id: 'runtime-rolls-and-history', taskRefs: ['CUR-035', 'CUR-036'], reason: 'Persist one d3 roll per attribute with source, seed, faces and version; calculation/import must not draw RNG. Keep source, mode and transfer events distinct.' },
      { id: 'runtime-language-grants', taskRefs: ['CUR-017', 'CUR-033', 'CUR-036'], reason: 'Separate speech/read/write grants and target languages; do not impose exchange caps or stack publication blocks.' },
    ] });
  const used = new Set<string>();
  const gather = (v: unknown): void => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(gather); return; }
    for (const [key, value] of Object.entries(v)) {
      if (key.endsWith('EvidenceIds') || key === 'evidenceIds') for (const id of value as string[]) used.add(id);
      else gather(value);
    }
  };
  gather(spec);
  const evidence = [...used].sort().map(id => { const e = m.evidence.find(e => e.id === id); if (!e) throw new Error(`Missing ancestry evidence: ${id}`); return e; });
  const inputRefs = [{ path: pilotPath, sha256: sha(pilotBytes) }];
  for (const path of ['tools/curation/human-ancestry-formalizer.ts', 'tools/curation/human-ancestry.mjs', 'packages/curation/ancestry-base-model.ts', 'packages/character-generator/index.ts', 'packages/random-tables/index.ts'])
    inputRefs.push({ path, sha256: sha(await readFile(resolve(root, path))) });
  const fixed = previewHumanBase(spec, { variant: 'core', mode: 'fixed', increase: 'strength', size: 1, adjustment: { increase: 'strength', decrease: 'agility' } });
  const random = previewHumanBase(spec, { variant: 'only-human', mode: 'random', faces: { strength: 1, agility: 2, intellect: 3, will: 1 }, size: 0.5, adjustment: null });
  const formalization = { schemaVersion: 1, kind: 'curation-ancestry-formalization', reviewDate: '2026-10-27', status: 'structured-for-pilot-review',
    gates: { importablePack: false, runtimeIntegrated: false, officialGenerationEnabled: false, pdfCertified: false, stagingPromoted: false },
    spec, evidence, inputRefs, decisions: m.creationDecisions,
    examples: { fixedWithTransfer: fixed, randomWithoutTransfer: random },
    consumerSupport: { currentStoredBaseFields: ['strength', 'agility', 'intellect', 'will', 'health', 'defense', 'speed'],
      requiredMissingBaseFields: ['perception', 'healingRate', 'size', 'power', 'damage', 'insanity', 'corruption', 'strengthModifier', 'agilityModifier', 'intellectModifier', 'willModifier', 'perceptionModifier'],
      referenceEvaluator: 'packages/curation/ancestry-base-model.ts#previewHumanBase', referenceEvaluatorIsRuntimeHandler: false,
      engineTasks: spec.deferred.filter(d => d.id.startsWith('runtime-')) },
    compositionScope: 'Base only. Core and Only Human IDs remain distinct; published replacements govern language benefits. Floor and initial zero-state inheritance are explicit. Development/table/equipment/level effects are deferred, never fabricated.' };
  const data = JSON.stringify(formalization, null, 2) + '\n';
  const report = { schemaVersion: 1, task: 'CUR-015', reviewDate: '2026-10-27', inputRefs, variants: spec.variants.map(v => ({ id: v.id, entityId: v.entityId })),
    counts: { variants: 2, formulas: rules.length, evidenceRanges: evidence.length, deferredRequirements: spec.deferred.length },
    outputs: [{ path: DATA, sha256: sha(data) }], unchanged: { originalInputs: true, ledgers: true, staging: true, frozenContracts: true, demoConsumer: true },
    nextTask: 'CUR-016', scope: 'Formalization and reference verification, not runtime adoption or a complete character.' };
  return { formalization, report, artifacts: new Map([[DATA, data], [REPORT, JSON.stringify(report, null, 2) + '\n']]) };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--write', '--check'].includes(args[0])) throw new Error('Use --write or --check');
  const result = await buildArtifacts(root);
  for (const [path, data] of result.artifacts) { assertSafeArtifact(path, data);
    if (args[0] === '--check') { if (await readFile(resolve(root, path), 'utf8') !== data) throw new Error(`Human ancestry artifact changed: ${path}`); }
    else { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), data); }
  }
  console.log(`Human ancestry: ${result.report.counts.variants} variants, ${result.report.counts.formulas} formulas; base only, runtime disabled. ${args[0]}`);
}
