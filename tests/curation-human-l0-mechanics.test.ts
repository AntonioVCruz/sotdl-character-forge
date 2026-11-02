import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { parsePack } from '../packages/catalog';
import { HumanL0ContractError, HumanL0MechanicsSchema, HumanL0SelectionSchema, parseHumanL0MechanicalPacks, parseHumanL0Selection } from '../packages/curation/human-l0-mechanics';

const fixture = JSON.parse(readFileSync('curation/examples/human-l0-mechanics.synthetic.json', 'utf8'));
const fresh = () => structuredClone(fixture.packs);
const selection = () => structuredClone(fixture.selection);
const ref = (pack: typeof fixture.packs[number]) => ({ packId: pack.packId, version: pack.version, entityId: pack.entities[0].id });
const randomChoice = () => ({ mode: 'random', seed: 'synthetic-seed', prngVersion: 'synthetic-v1',
  rolls: ['strength','agility','intellect','will'].map((attribute, i) => ({ attribute, eventId: `fixture-roll-${i}`, face: i + 1 })) });
function rejects(packs: unknown, code: string) {
  let error: unknown;
  try { parseHumanL0MechanicalPacks(packs); } catch (e) { error = e; }
  expect(error).toBeInstanceOf(HumanL0ContractError);
  expect((error as HumanL0ContractError).code).toBe(code);
  expect((error as Error).message).not.toContain('PRIVATE_SENTINEL');
}

describe('Human L0 mechanical pack contract v1', () => {
  it('validates synthetic manifests through the existing pack format and the explicit mechanical gate', () => {
    const packs = fresh(), before = JSON.stringify(packs);
    for (const p of packs) expect(parsePack(p).fictionalData).toBe(true);
    const result = parseHumanL0MechanicalPacks([...packs].reverse());
    expect(result.map(p => p.packId)).toEqual(['fixture-human-core','fixture-human-expansion']);
    expect(JSON.stringify(packs)).toBe(before);
    expect(result.every(p => p.entities[0].status === 'needs-review')).toBe(true);
  });

  it('rejects pooled evidence attributed to the wrong variant', () => {
    const packs = fresh(); packs[1].entities[0].mechanics.attributes.fixed.origin.evidenceIds = ['core-stats'];
    rejects(packs, 'variant-declaration-required');
  });

  it('accepts Core independently and requires it when the expansion is present', () => {
    const packs=fresh(); expect(parseHumanL0MechanicalPacks([packs[0]])).toHaveLength(1);
    const s=selection(); s.ancestry=ref(packs[0]); s.coreBenefit={kind:'speak-language',languageId:'fixture-other'};
    expect(parseHumanL0Selection(s,[packs[0]])).toEqual(s);
    rejects([packs[1]],'ambiguous-or-mixed-source-pair');
  });

  it.each(['version', 'component', 'entity'] as const)('requires exact inherited %s references', field => {
    const packs = fresh(), from = packs[1].entities[0].mechanics.healingRate.rounding.origin.from;
    if (field === 'version') from.version = '9.0.0';
    if (field === 'component') from.componentId = 'initialStates.damage';
    if (field === 'entity') from.entityId = 'different';
    rejects(packs, 'exact-component-inheritance-required');
  });

  it('refuses changing an inherited value while retaining its Core citation', () => {
    const packs = fresh(); packs[1].entities[0].mechanics.initialStates.damage.value = 3;
    rejects(packs, 'inherited-value-mismatch');
  });

  it('matches inherited evidence by full metadata rather than a convenient ID', () => {
    const packs = fresh(); packs[1].entities[0].mechanics.evidence.find((e: { id: string }) => e.id === 'core-stats').inputSha256 = '9'.repeat(64);
    rejects(packs, 'inherited-evidence-mismatch');
    const renamed = fresh(), m = renamed[1].entities[0].mechanics;
    m.evidence.find((e: { id: string }) => e.id === 'core-stats').id = 'local-alias';
    for (const component of [m.healingRate.rounding,m.initialStates.damage,m.initialStates.insanity,m.initialStates.corruption]) component.origin.evidenceIds = ['local-alias'];
    expect(() => parseHumanL0MechanicalPacks(renamed)).not.toThrow();
  });

  it('requires cited evidence, rejects duplicates/unused entries and does not claim text inspection', () => {
    const missing = fresh(); missing[0].entities[0].mechanics.attributes.fixed.origin.evidenceIds = ['missing'];
    rejects(missing, 'evidence-missing');
    const duplicate = fresh(), m = duplicate[0].entities[0].mechanics; m.evidence.push(m.evidence[0]);
    rejects(duplicate, 'schema-invalid');
    const unused = fresh(), u = unused[0].entities[0].mechanics; u.evidence.push({ ...u.evidence[0], id:'unused' });
    rejects(unused, 'unused-evidence');
    // Placeholder evidence is a format example; the contract gate does not open licensed inputs.
    expect(() => parseHumanL0MechanicalPacks(fresh())).not.toThrow();
  });

  it('keeps the Size policy as a product decision instead of attributing it to the publication', () => {
    const packs = fresh(); packs[0].entities[0].mechanics.size.independence.origin = {kind:'declared',scope:'ancestry',evidenceIds:['own-stats']};
    rejects(packs, 'product-decision-required');
  });

  it.each(['base-health','early-cap','initial-attributes','reapply-state','evaluation-order','state-phase'] as const)('rejects C03 phase violation: %s', change => {
    const packs = fresh(), m = packs[0].entities[0].mechanics;
    if(change==='base-health') m.healingRate.input='base-health';
    if(change==='early-cap') m.finalLimits.phase='before-equipment';
    if(change==='initial-attributes') m.characteristics.health.input='initial-attributes';
    if(change==='reapply-state') m.initialStates.reapplyOnRecalculation=true;
    if(change==='evaluation-order') m.evaluationOrder.reverse();
    if(change==='state-phase') m.initialStates.phase='every-recalculation';
    rejects(packs,'schema-invalid');
  });

  it('rejects unknown executable/text payloads and makes the limits of generic parsePack explicit', () => {
    const packs = fresh(); packs[0].entities[0].mechanics.script='PRIVATE_SENTINEL';
    expect(() => parsePack(packs[0])).not.toThrow();
    rejects(packs,'schema-invalid');
    const text = fresh(); text[0].entities[0].text='PRIVATE_SENTINEL'; rejects(text,'schema-invalid');
    const version = fresh(); version[0].entities[0].mechanics.contractVersion='2.0.0'; rejects(version,'schema-invalid');
  });

  it('requires a unique pair, an exact dependency and canonical entity identity', () => {
    const dependency = fresh(); dependency[1].dependencies[0].version='9.0.0'; rejects(dependency,'exact-core-dependency-required');
    const cycle = fresh(); cycle[0].dependencies=[{packId:cycle[1].packId,version:cycle[1].version}]; rejects(cycle,'exact-core-dependency-required');
    const pair = fresh(); pair[1].entities[0].mechanics.variant='core'; pair[1].entities[0].mechanics.attributes.random=null;
    pair[1].entities[0].mechanics.procedure=structuredClone(pair[0].entities[0].mechanics.procedure); rejects(pair,'ambiguous-or-mixed-source-pair');
    const identity = fresh(); identity[0].entities[0].id='wrong'; rejects(identity,'entity-identity-mismatch');
  });

  it('does not allow an official publication to be relabeled as fictional', () => {
    const packs = fresh(); packs[0].source.id='sotdl:shadow-of-the-demon-lord-core';
    rejects(packs,'source-fictional-mismatch');
    const mislabeled = fresh(); mislabeled[0].fictionalData=false; mislabeled[1].fictionalData=false;
    mislabeled[0].source.status='needs-review'; mislabeled[1].source.status='needs-review';
    rejects(mislabeled,'source-fictional-mismatch');
  });

  it('requires coherent integer attributes, nonnegative initial states and distinct Size options', () => {
    const fractional = fresh(); fractional[0].entities[0].mechanics.attributes.fixed.base=6.5; rejects(fractional,'schema-invalid');
    const bounds = fresh(); bounds[0].entities[0].mechanics.attributes.limits.maximum=7; rejects(bounds,'schema-invalid');
    const negative = fresh(); negative[0].entities[0].mechanics.initialStates.damage.value=-1; rejects(negative,'schema-invalid');
    const size = fresh(); size[0].entities[0].mechanics.size.choices=[1,1]; rejects(size,'schema-invalid');
    expect(HumanL0MechanicsSchema.safeParse(fresh()[0].entities[0].mechanics).success).toBe(true);
  });
});

describe('Human L0 independent selection envelope', () => {
  it('allows Core/expansion modes and table procedures independently, without RNG or input mutation', () => {
    const packs = fresh(), before=JSON.stringify(packs);
    const rng=vi.spyOn(Math,'random').mockImplementation(()=>{throw new Error('RNG forbidden');});
    try {
      let combinations=0;
      for(let a=0;a<2;a++) for(let p=0;p<2;p++) for(const mode of (a?['fixed','random']:['fixed'])) {
        const s=selection(); s.ancestry=ref(packs[a]); s.procedure={ref:ref(packs[p]),kind:p?'human-development':'core'};
        s.attributes=mode==='fixed'?{mode:'fixed',increase:'strength'}:randomChoice();
        s.coreBenefit=a===0&&p===0?{kind:'speak-language',languageId:'fixture-other-language'}:null;
        expect(parseHumanL0Selection(s,packs)).toEqual(s); combinations++;
      }
      expect(combinations).toBe(6); expect(rng).not.toHaveBeenCalled(); expect(JSON.stringify(packs)).toBe(before);
    } finally { rng.mockRestore(); }
  });

  it('does not add the Core ancestry benefit to development or accept both benefit alternatives', () => {
    const packs=fresh(), s=selection(); s.ancestry=ref(packs[0]); s.coreBenefit={kind:'speak-language',languageId:'fixture-other'};
    s.procedure={ref:ref(packs[1]),kind:'human-development'};
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/procedure-benefit-conflict/);
    s.procedure={ref:ref(packs[0]),kind:'core'}; s.coreBenefit=null;
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/procedure-benefit-conflict/);
    s.coreBenefit={kind:'speak-language',languageId:'fixture-language'};
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/additional-language-already-granted/);
    s.coreBenefit={kind:'speak-language',languageId:'fixture-other',rollEventId:'also-profession'};
    expect(HumanL0SelectionSchema.safeParse(s).success).toBe(false);
    s.ancestry=ref(packs[1]); s.coreBenefit={kind:'speak-language',languageId:'fixture-other'};
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/procedure-benefit-conflict/);
  });

  it.each(['ancestry-version','procedure-version','procedure-kind'] as const)('requires exact selection references: %s', field => {
    const s=selection();
    if(field==='ancestry-version')s.ancestry.version='9.0.0';
    if(field==='procedure-version')s.procedure.ref.version='9.0.0';
    if(field==='procedure-kind')s.procedure.kind='human-development';
    expect(()=>parseHumanL0Selection(s,fresh())).toThrow(/selection-reference-missing/);
  });

  it('requires four independent stored rolls and refuses unoffered/mixed modes', () => {
    const packs=fresh();
    for(const mutate of [(s:any)=>s.attributes.rolls[1].eventId=s.attributes.rolls[0].eventId,
      (s:any)=>s.attributes.rolls[1].attribute=s.attributes.rolls[0].attribute,
      (s:any)=>s.attributes.rolls[0].face=5]) {
      const s=selection(); s.attributes=randomChoice(); mutate(s);
      expect(()=>parseHumanL0Selection(s,packs)).toThrow(/unsupported-or-inconsistent-random-mode/);
    }
    const core=selection(); core.ancestry=ref(packs[0]); core.attributes=randomChoice();
    expect(()=>parseHumanL0Selection(core,packs)).toThrow(/unsupported-or-inconsistent-random-mode/);
    const repeatedFaces=selection(); repeatedFaces.attributes=randomChoice();
    for(const roll of repeatedFaces.attributes.rolls) roll.face=1;
    expect(()=>parseHumanL0Selection(repeatedFaces,packs)).not.toThrow();
    const mixed=selection(); mixed.attributes={mode:'fixed',increase:'strength',rolls:randomChoice().rolls};
    expect(()=>parseHumanL0Selection(mixed,packs)).toThrow(/selection-schema-invalid/);
  });

  it('validates the optional single transfer and baseline score bounds without computing a character', () => {
    const packs=fresh(), s=selection(); s.adjustment={increase:'strength',decrease:'agility'};
    expect(parseHumanL0Selection(s,packs)).toEqual(s);
    s.adjustment={increase:'strength',decrease:'strength'};
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/selection-schema-invalid/);
    s.adjustment=[{increase:'strength',decrease:'agility'}];
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/selection-schema-invalid/);
    s.adjustment={increase:'strength',decrease:'agility'};
    for(const p of packs)p.entities[0].mechanics.attributes.limits.maximum=8;
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/selection-score-out-of-bounds/);
    s.adjustment=null;s.size=2;
    expect(()=>parseHumanL0Selection(s,packs)).toThrow(/unsupported-size/);
  });
});
