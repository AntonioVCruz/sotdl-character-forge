import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HUMAN_L0_CONSUMABLE_CONTRACT_VERSION, HUMAN_L0_CONSUMABLE_PENDING_REASONS, MANUAL_RESOLUTION_SLOTS } from '../packages/curation/human-l0-consumable';
import { HUMAN_L0_CONTRACT_VERSION } from '../packages/curation/human-l0-mechanics';
import {
  EXPOSURE_BLOCK_COPY_KEY, HUMAN_L0_PROCEDURE_CONTRACT, HUMAN_L0_PROCEDURE_CONTRACT_VERSION, HUMAN_L0_PROCEDURE_DEFERRED,
  HUMAN_L0_PROCEDURE_POLICY, HUMAN_L0_PROCEDURE_STEPS, HumanL0ProcedureError, ISSUE_CODE_ADAPTER, INVALIDATION_RULES,
  OUT_OF_SCOPE, PENDING_REASON_ADAPTER, PROCEDURE_ISSUE_CODES, PROCEDURE_STUB_LIMITS, STEP5_GROUPS, UNMAPPED_GATE_CODES,
  exposeHumanL0Procedure,
} from '../packages/character-generator/human-l0-procedure';

const matrix = JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json', 'utf8')) as { records: { id: string }[] };
const matrixIds = new Set(matrix.records.map(row => row.id));
const base = {
  ancestryVariant: 'core' as const,
  interestingThingsSource: 'oddities' as const,
  attributeMode: 'fixed' as const,
};

function step(view: ReturnType<typeof exposeHumanL0Procedure>, id: string) {
  const found = view.steps.find(row => row.stepId === id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
}

describe('Human L0 procedure planning stub', () => {
  it('stays a non-resolving contract and does not roll', () => {
    const source = readFileSync('packages/character-generator/human-l0-procedure.ts', 'utf8');
    expect(source).not.toMatch(/random-tables|createSubstream|Math\.random/);
    expect(HUMAN_L0_PROCEDURE_CONTRACT).toBe('sotdl.human-l0.procedure');
    expect(HUMAN_L0_PROCEDURE_CONTRACT_VERSION).toBe('0.1.0');
    expect(PROCEDURE_STUB_LIMITS.proceduresComplete).toBe(false);
    expect(PROCEDURE_STUB_LIMITS.rollsDice).toBe(false);
    expect(PROCEDURE_STUB_LIMITS.rulesetEnabled).toBe(false);
    expect(HUMAN_L0_CONTRACT_VERSION).toBe('1.0.0');
    expect(HUMAN_L0_CONSUMABLE_CONTRACT_VERSION).toBe('1.0.0');
    const view = exposeHumanL0Procedure({ ...base, branch: 'core' });
    expect(view.proceduresComplete).toBe(false);
    expect(view.fullyResolved).toBe(false);
    expect(view.officialGenerationEnabled).toBe(false);
    expect(view.rulesetEnabled).toBe(false);
    expect(view.rollsDice).toBe(false);
    expect(view.steps.every(row => row.roll === null && row.commandId === null && row.optionsSelectable === false)).toBe(true);
    expect(view.outOfScope.map(row => row.id)).toEqual(['resolver-integration', 'full-ui', 'ruleset-enable', 'level-1']);
    expect(OUT_OF_SCOPE[0].needs).toEqual(['#34-act6', '#34-act7']);
    expect(OUT_OF_SCOPE.slice(1).map(row => 'issue' in row ? row.issue : null)).toEqual([36, 37, 21]);
  });

  it('points every lot ref at an activity-1 id and keeps base mechanics outside that matrix', () => {
    const refs = HUMAN_L0_PROCEDURE_STEPS.flatMap(row => row.dataRefs);
    const missing = refs.filter(row => row.availability !== 'base-contract' && !matrixIds.has(row.matrixId)).map(row => row.matrixId);
    expect(missing).toEqual([]);
    expect(refs.some(row => row.matrixId === 'mechanics:procedure.ancestryBenefit' && row.availability === 'base-contract')).toBe(true);
    expect(HUMAN_L0_PROCEDURE_DEFERRED.every(row => matrixIds.has(row.matrixId) && row.included === false)).toBe(true);
    expect(matrixIds.has('procedure:human-attributes')).toBe(true);
  });

  it('keeps the five step-5 groups unordered and takes sequence from the matrix', () => {
    expect(STEP5_GROUPS.map(group => group.impliedOrder)).toEqual([false, false, false, false, false]);
    const core = exposeHumanL0Procedure({ ...base, branch: 'core' });
    const visibleGroups = core.steps.filter(row => row.visibility === 'visible' && row.step5Group).map(row => row.step5Group);
    expect(visibleGroups.join(',')).not.toBe(STEP5_GROUPS.map(group => group.id).join(','));
    expect(core.steps.map(row => row.order)).toEqual([...core.steps.map(row => row.order)].sort((a, b) => a - b));
    expect(core.steps.find(row => row.stepId === 'core.ancestry-benefit')?.groupsTouched).toEqual(['languages-beyond-speech', 'profession']);
    expect(core.steps.find(row => row.stepId === 'core.ancestry-benefit')?.step5Group).toBeNull();
    const dev = exposeHumanL0Procedure({ ...base, branch: 'human-development', ancestryVariant: 'only-human' });
    expect(dev.steps.some(row => row.step5Group === 'languages-beyond-speech' && row.visibility === 'hidden-until-condition')).toBe(true);
    expect(dev.steps.some(row => row.stepId === 'dev.personality' && row.step5Group === null && row.requirement === 'required')).toBe(true);
  });

  it('does not stack exclusive branches or tie attribute mode to the table procedure', () => {
    const core = exposeHumanL0Procedure({ ...base, branch: 'core' });
    const dev = exposeHumanL0Procedure({ ...base, branch: 'human-development', ancestryVariant: 'only-human' });
    expect(core.steps.every(row => row.branch === 'core' || row.branch === 'shared')).toBe(true);
    expect(dev.steps.every(row => row.branch === 'human-development' || row.branch === 'shared')).toBe(true);
    expect(core.steps.some(row => row.stepId.startsWith('dev.'))).toBe(false);
    expect(dev.steps.some(row => row.stepId.startsWith('core.'))).toBe(false);
    expect(dev.steps.flatMap(row => row.dataRefs).some(row => row.matrixId === 'core:wealth' || row.matrixId.startsWith('core:kit:'))).toBe(false);
    expect(core.steps.flatMap(row => row.dataRefs).some(row => row.matrixId === 'only-human:lifestyle')).toBe(false);
    expect(HUMAN_L0_PROCEDURE_POLICY.implicitCoreBenefit).toBe(false);
    expect(HUMAN_L0_PROCEDURE_POLICY.developmentReplaces).toEqual(['random-starting-professions', 'starting-wealth']);
    const random = exposeHumanL0Procedure({ ...base, branch: 'core', attributeMode: 'random' });
    expect(random.steps.map(row => row.stepId)).toEqual(core.steps.map(row => row.stepId));
    expect(random.attributeMode).toMatchObject({ mode: 'random', matrixId: 'procedure:human-attributes', independentOfTableProcedure: true, invalidatesProcedureSteps: false });
    expect(core.steps.some(row => row.stepId === 'procedure:human-attributes')).toBe(false);
  });

  it('omits the core ancestry benefit unless both ancestry and procedure are core', () => {
    const mixed = exposeHumanL0Procedure({ ...base, branch: 'core', ancestryVariant: 'only-human' });
    expect(mixed.steps.some(row => row.stepId === 'core.ancestry-benefit' || row.stepId === 'core.ancestry-random-profession')).toBe(false);
    const recorded = exposeHumanL0Procedure({
      ...base, branch: 'core', ancestryVariant: 'only-human',
      recorded: [{ stepId: 'core.ancestry-benefit', branch: 'core', choiceId: 'speak-language' }],
    });
    expect(recorded.invalidated).toEqual([expect.objectContaining({
      stepId: 'core.ancestry-benefit', reviewReason: 'core-benefit-not-applicable', migrates: false, retainsLastChoice: true, lastChoiceId: 'speak-language',
    })]);
    const benefit = step(exposeHumanL0Procedure({ ...base, branch: 'core' }), 'core.ancestry-benefit');
    expect(benefit.playerSurface).toBe('choice-slot');
    expect(benefit.choice).toMatchObject({ candidates: ['speak-language', 'random-profession'], resolvedItemId: null, uniformDie: false });
  });

  it('marks other-branch slots needs-review and keeps the shared Interesting Things source', () => {
    const view = exposeHumanL0Procedure({
      branch: 'human-development', ancestryVariant: 'only-human', interestingThingsSource: 'oddities', attributeMode: 'fixed',
      recorded: [
        { stepId: 'core.wealth', branch: 'core', choiceId: null },
        { stepId: 'shared.interesting-source', branch: 'shared', choiceId: 'oddities' },
      ],
    });
    expect(view.invalidated).toEqual([expect.objectContaining({ stepId: 'core.wealth', reviewReason: 'exclusive-branch', migrates: false, retainsLastChoice: true })]);
    const source = step(view, 'shared.interesting-source');
    expect(source.slotState).toBe('pending');
    expect(source.blocks).toEqual(['handler-absent']);
    expect(source.reviews).toEqual([]);
    expect(source.lastChoiceId).toBe('oddities');
    expect(source.choice?.resolvedItemId).toBeNull();
    expect(INVALIDATION_RULES.find(rule => rule.id === 'exclusive-branch')).toMatchObject({ migrates: false, doesNotApplyTo: ['shared', 'attribute-mode'] });
  });

  it('suspends dependents when a prior step is altered and does not migrate the last choice', () => {
    const view = exposeHumanL0Procedure({
      ...base, branch: 'core', alteredStepIds: ['core.wealth'],
    });
    expect(step(view, 'core.starting-kit').reviews).toEqual([expect.objectContaining({ reason: 'prior-altered', migrates: false, retainsLastChoice: true })]);
    expect(step(view, 'core.starting-kit').slotState).toBe('needs-review');
    expect(step(view, 'core.interesting-grant').reviews).toEqual([]);
  });

  it('exposes awaits-lot and handler-absent without inventing options or a fallback source', () => {
    const core = exposeHumanL0Procedure({ ...base, branch: 'core' });
    const professions = step(core, 'core.starting-professions');
    expect(professions.playerSurface).toBe('pending-only');
    expect(professions.choice).toBeNull();
    expect(professions.publishedSelection).toBe('manual-or-random');
    expect(professions.cardinality).toMatchObject({ kind: 'exactly', count: 2 });
    expect(professions.blocks).toEqual(['awaits-lot', 'handler-absent']);
    expect(professions.pending).toEqual([expect.objectContaining({ reason: 'range-starts-not-reextracted', retainsConsequence: true, resolvedItemId: null, candidates: [] })]);
    expect(professions.dataRefs.some(row => row.matrixId === 'pilot-profession:core:wilderness:*' && row.role === 'unextracted-range')).toBe(true);
    const wealth = step(core, 'core.wealth');
    expect(wealth.publishedModes).toBeNull();
    expect(wealth.issue).toBeNull();
    expect(step(core, 'core.starting-kit').issue).toMatchObject({ code: 'lookup-missing-prior', retainsConsequence: false });
    const unavailable = exposeHumanL0Procedure({ ...base, branch: 'core', interestingThingsSource: 'unavailable' });
    const grant = step(unavailable, 'core.interesting-grant');
    expect(grant.pending.some(row => row.reason === 'disabled-source' && row.retainsConsequence === true && row.pendencyKind === 'missing-or-altered-source')).toBe(true);
    expect(grant.dataRefs.filter(row => row.role === 'router' && row.selected)).toEqual([]);
    expect(grant.dataRefs.map(row => row.matrixId)).toContain('core-initial-thing');
    expect(grant.dataRefs.map(row => row.matrixId)).not.toContain('oddities:art');
    const oddities = step(core, 'core.interesting-grant');
    expect(oddities.dataRefs.some(row => row.matrixId === 'oddities:thing-router' && row.selected)).toBe(true);
    expect(oddities.dataRefs.some(row => row.matrixId === 'core:thing-router')).toBe(false);
    expect(oddities.dataRefs.filter(row => row.role === 'selector-child').every(row => row.selected === false)).toBe(true);
  });

  it('uses published candidates only for choice slots and leaves resolvedItemId null', () => {
    const shieldId = 'item-ref:grant:core:kit:wealthy/grant/special/shield/shield';
    const slot = MANUAL_RESOLUTION_SLOTS.find(row => row.matrixId === shieldId);
    const view = exposeHumanL0Procedure({ ...base, branch: 'core', activatedConditions: ['item-choice:wealthy-shield'] });
    const shield = step(view, 'core.wealthy-shield');
    expect(shield.playerSurface).toBe('choice-slot');
    expect(shield.visibility).toBe('visible');
    expect(shield.choice?.candidates).toEqual(slot && slot.linkedDefinition.kind === 'choice' ? [...slot.linkedDefinition.candidates] : []);
    expect(shield.choice?.resolvedItemId).toBeNull();
    expect(shield.pending[0]).toMatchObject({ reason: 'choice-required', retainsConsequence: true, resolvedItemId: null });
    expect(shield.blocks).toContain('handler-absent');
    expect(step(exposeHumanL0Procedure({ ...base, branch: 'core' }), 'core.wealthy-shield').visibility).toBe('hidden-until-condition');
  });

  it('restricts family profession to the published subset and does not invent a uniform die', () => {
    const directed = exposeHumanL0Procedure({
      branch: 'human-development', ancestryVariant: 'core', interestingThingsSource: 'core', attributeMode: 'random',
      activatedConditions: ['family-profession-directed', 'family-result:6-8'],
    });
    const family = step(directed, 'dev.family-profession');
    expect(family.playerSurface).toBe('choice-slot');
    expect(family.choice).toMatchObject({ candidates: ['common', 'criminal', 'military', 'wilderness'], uniformDie: false, resolvedItemId: null });
    expect(family.forbidsTable).toBe('only-human:profession-router');
    const missing = exposeHumanL0Procedure({
      branch: 'human-development', ancestryVariant: 'only-human', interestingThingsSource: 'oddities', attributeMode: 'fixed',
      activatedConditions: ['family-profession-directed', 'family-result:other'],
    });
    expect(step(missing, 'dev.family-profession').playerSurface).toBe('pending-only');
    expect(step(missing, 'dev.family-profession').choice).toMatchObject({ candidates: [], manualField: true });
    expect(step(missing, 'dev.family-profession').pending[0].reason).toBe('manual-category-choice');
    const hidden = exposeHumanL0Procedure({ branch: 'human-development', ancestryVariant: 'only-human', interestingThingsSource: 'oddities', attributeMode: 'fixed' });
    expect(step(hidden, 'dev.sibling-details').visibility).toBe('hidden-until-condition');
    expect(step(hidden, 'dev.life-event').choice).toBeNull();
    expect(step(hidden, 'dev.life-event').dataRefs.every(row => row.selected === false)).toBe(true);
  });

  it('keeps development lookups, extra Interesting Thing and adjudication as structured pendencies', () => {
    const view = exposeHumanL0Procedure({
      branch: 'human-development', ancestryVariant: 'only-human', interestingThingsSource: 'oddities', attributeMode: 'fixed',
      activatedConditions: ['minor-windfall-10', 'recursion-at-limit', 'sibling-optional-detail'],
    });
    expect(step(view, 'dev.lifestyle').dataRefs.some(row => row.matrixId === 'core:wealth')).toBe(false);
    expect(step(view, 'dev.lookup-money').notes).toContain('extra-dice:false');
    expect(step(view, 'dev.lookup-clothing').issue?.code).toBe('lookup-missing-prior');
    expect(step(view, 'dev.interesting-initial').dataRefs.some(row => row.matrixId === 'only-human-initial-thing')).toBe(true);
    expect(step(view, 'dev.interesting-initial').dataRefs.some(row => row.matrixId === 'core-initial-thing')).toBe(false);
    expect(step(view, 'dev.interesting-extra').cardinality).toMatchObject({ kind: 'exactly', count: 1 });
    expect(step(view, 'dev.dimensions').pending.map(row => row.reason)).toEqual(['manual-composition', 'no-extra-life-rolls']);
    expect(step(view, 'dev.dimensions').pending.every(row => row.retainsConsequence === true)).toBe(true);
    expect(step(view, 'dev.piety').pending.map(row => row.reason)).toEqual(['bounded-recursion']);
    expect(step(view, 'dev.player-appearance').forbidsTable).toBe('only-human:sibling-gender');
    expect(view.retainedGaps.every(row => row.retainsConsequence === true && row.activatesRoll === false)).toBe(true);
    expect(view.policy.ageBands.map(row => row.count)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(view.policy.familyModifiers).toEqual([-6, -3, -1, 0, 1, 3, 6]);
    expect(view.deferred.find(row => row.matrixId === 'procedure:roleplaying-questions')).toMatchObject({ included: false, deletesTableResults: false });
  });

  it('confirms the consumable pending reasons and leaves unnamed gate codes for the visible fallback', () => {
    expect(Object.keys(PENDING_REASON_ADAPTER).sort()).toEqual([...HUMAN_L0_CONSUMABLE_PENDING_REASONS].sort());
    expect(Object.keys(ISSUE_CODE_ADAPTER)).toEqual([...PROCEDURE_ISSUE_CODES]);
    const source = readFileSync('packages/curation/human-l0-consumable.ts', 'utf8');
    const fails = [
      ...source.matchAll(/\bfail\(\s*'([a-z0-9-]+)'/g),
      ...source.matchAll(/\bfail\([^;\n]*\? '([a-z0-9-]+)' : '([a-z0-9-]+)'/g),
      ...source.matchAll(/\bassertUnique\([^;\n]*,\s*'([a-z0-9-]+)'/g),
    ].flatMap(match => match.slice(1));
    const known = new Set<string>([...PROCEDURE_ISSUE_CODES, ...HUMAN_L0_CONSUMABLE_PENDING_REASONS]);
    expect([...new Set(fails.filter(code => !known.has(code)))].sort()).toEqual([...UNMAPPED_GATE_CODES]);
    for (const code of PROCEDURE_ISSUE_CODES) expect(fails).toContain(code);
    expect(EXPOSURE_BLOCK_COPY_KEY['awaits-lot']).toBe('procedure.awaits-lot');
    expect(EXPOSURE_BLOCK_COPY_KEY['handler-absent']).toBe('procedure.handler-absent');
  });

  it('documents every step id for the UI matrix', () => {
    const doc = readFileSync('docs/matriz-procedimento-human-l0.md', 'utf8');
    for (const row of HUMAN_L0_PROCEDURE_STEPS) expect(doc).toContain(row.id);
    for (const group of STEP5_GROUPS) expect(doc).toContain(`\`${group.id}\``);
    expect(doc).toContain('proceduresComplete');
    expect(doc).toContain('exclusive-branch');
    expect(doc).toContain('impliedOrder');
  });

  it('rejects unknown input and stays deterministic', () => {
    const input = { ...base, branch: 'human-development' as const, ancestryVariant: 'only-human' as const };
    expect(JSON.stringify(exposeHumanL0Procedure(input))).toBe(JSON.stringify(exposeHumanL0Procedure(input)));
    expect(() => exposeHumanL0Procedure({ ...input, recorded: [{ stepId: 'missing', branch: 'core', choiceId: null }] })).toThrow(HumanL0ProcedureError);
    expect(() => exposeHumanL0Procedure({ ...input, activatedConditions: ['benefit:random-profession', 'benefit:speak-language'] })).toThrow(HumanL0ProcedureError);
    expect(() => exposeHumanL0Procedure({ ...input, roll: 4 } as typeof input)).toThrow(HumanL0ProcedureError);
  });
});
