import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { canonicalJson } from '../tools/curation/canonical-json';
import { buildMechanicalArtifacts, compileHumanL0Mechanics, parseMechanicalRecipe,
  validateHumanL0MechanicalBundle } from '../tools/curation/human-l0-mechanical-compiler';
import { mainMechanical } from '../tools/curation/pack-compiler';
import { parseHumanL0MechanicalPacks } from '../packages/curation/human-l0-mechanics';

const read = (path: string) => JSON.parse(readFileSync(path,'utf8'));
const recipe = read('curation/human-l0-mechanical-compilation.json'), registry = read('curation/sources.json');
const synthetic = read('curation/examples/human-l0-mechanics.synthetic.json'), staged = read('curation/examples/staging.json');
const sha = (v: string) => createHash('sha256').update(v).digest('hex');
const temporary: string[] = [];
const REPORT = 'reports/human-l0-mechanics.json';
function inputs() {
  const core = synthetic.packs[0].entities[0].mechanics, expanded = synthetic.packs[1].entities[0].mechanics;
  const source = recipe.packs[0].sourceId, expansion = recipe.packs[1].sourceId;
  const entries = recipe.packs.map((p: typeof recipe.packs[number], i: number) => {
    const entry = structuredClone(staged); entry.id=p.entityIds[0];entry.name='Human';entry.kind='ancestry';
    entry.identity={sourceId:p.sourceId,kind:'ancestry',entryKey:'human',variantKey:i?'variant':'default'};
    entry.source.sourceId=p.sourceId;entry.review.subjectId=entry.id;entry.originalText='PRIVATE_SENTINEL';return entry;
  });
  const rule = (target: string, formula: unknown, maximum: number|null=null, minimum: number|null=null) => ({
    id:`synthetic:${target}`,target,formula,maximum,minimum,evidenceIds:['invented'],composition:'direct',reason:'Synthetic model only.' });
  const facts = {
    attributes: { fixed:{base:core.attributes.fixed.base,increaseOneBy:core.attributes.fixed.increaseBy},
      random:{base:expanded.attributes.random.base,...expanded.attributes.random.dice},
      adjustment:{amount:core.attributes.adjustment.amount,minimumScore:core.attributes.limits.minimum,maximumScore:core.attributes.limits.maximum} },
    size:core.size.choices,professionChoices:core.procedure.startingProfessions.count,languageId:'fixture-language',decisionSha256:sha('synthetic-decision'),
    rules:[rule('health',{op:'copy',ref:'strength'}),rule('defense',{op:'copy',ref:'agility'},core.finalLimits.defense.value),
      rule('perception',{op:'copy',ref:'intellect'},core.finalLimits.perception.value),
      rule('healingRate',{op:'divide-floor',ref:'health',divisor:core.healingRate.divisor.value},null,core.healingRate.minimum.value),
      ...['speed','power'].map(k=>rule(k,{op:'constant',value:core.characteristics[k].value})),
      ...['damage','insanity','corruption'].map(k=>rule(k,{op:'constant',value:core.initialStates[k].value})),
      ...['strength','agility','intellect','will','perception'].map(k=>rule(`${k}Modifier`,{op:'subtract',ref:k,amount:core.modifiers.subtract.value}))],
    evidence:['human-stats','human-language','general-scores','attributes','derived','ancestry-table-options','supplied-profession-procedure',
      'human-expansion-attributes','human-expansion-procedure'].map((id,i)=>({id,kind:'source',sourceId:id.startsWith('human-expansion')?expansion:source,
        medium:'md',inputSha256:sha('invented-input'),startLine:i+1,endLine:i+1,printedPageDeclared:null,pdfPageDeclared:null})),
  };
  return {entries,facts};
}
function bundle() {
  const input=inputs(), result=compileHumanL0Mechanics(recipe,registry,input.entries,input.facts);
  const files=[...result.artifacts].map(([path,text])=>({path,sha256:sha(text)}));
  const provenance={inputs:[{path:'curation/pilot/synthetic.json',bytes:1,sha256:sha('synthetic')}],reviewId:'synthetic-review'};
  const report={schemaVersion:1,projection:'human-l0-mechanics',contract:'sotdl.human-l0.mechanics',contractVersion:'1.0.0',
    reviewId:provenance.reviewId,inputs:provenance.inputs,outputs:{files,sha256:sha(canonicalJson(files))},counts:{packs:2,entities:2},
    gates:{localOnly:true,sourcePermission:'needs-review',distributionCertified:false,pdfInspected:false,runtimeIntegrated:false,officialGenerationEnabled:false},
    deferred:['table-outcomes','equipment-effects','runtime-handlers','source-and-distribution-approval','freeze-and-enablement']};
  result.artifacts.set(REPORT,canonicalJson(report));
  return {...input,...result,provenance};
}
function validate(b: ReturnType<typeof bundle>) {
  return validateHumanL0MechanicalBundle(b.artifacts,recipe,registry,b.entries,b.facts,b.provenance);
}
async function workspace() { const root=await mkdtemp(join(tmpdir(),'human-mechanical-'));temporary.push(root);return root; }
async function put(root:string,path:string,value:unknown) {
  await mkdir(dirname(join(root,path)),{recursive:true}); await writeFile(join(root,path),JSON.stringify(value));
}
afterEach(async()=>{
  vi.restoreAllMocks();
  for(const path of temporary.splice(0)) {
    const part=relative(resolve(tmpdir()),resolve(path));
    if(!part.startsWith('human-mechanical-')||part.includes(sep))throw new Error('Unexpected cleanup path');
    await rm(path,{recursive:true,force:true});
  }
});

describe('Human L0 mechanical projection from reviewed facts',()=>{
  it('projects invented values and variant-specific origins without copying staging or rules text',()=>{
    const {entries,facts}=inputs(), before=JSON.stringify({entries,facts});
    const rng=vi.spyOn(Math,'random').mockImplementation(()=>{throw new Error('No RNG');});
    const result=compileHumanL0Mechanics(recipe,registry,entries,facts), [core,expanded]=parseHumanL0MechanicalPacks(result.packs);
    expect(core.version).toBe('0.2.0');expect(core.entities[0].mechanics.attributes.random).toBeNull();
    expect(expanded.entities[0].mechanics.attributes.random?.dice.sides).toBe(4);
    expect(core.entities[0].mechanics.attributes.fixed.base).toBe(6);
    expect(core.entities[0].mechanics.characteristics.speed.value).toBe(7);
    expect(expanded.entities[0].mechanics.healingRate.divisor.origin).toMatchObject({kind:'declared',evidenceIds:['human-expansion-attributes']});
    expect(expanded.entities[0].mechanics.healingRate.rounding.origin).toMatchObject({kind:'inherited',from:{version:'0.2.0',componentId:'healingRate.rounding'}});
    expect(core.fictionalData).toBe(false);expect(core.entities[0].status).toBe('needs-review');
    expect([...result.artifacts.values()].join('')).not.toMatch(/PRIVATE_SENTINEL|Synthetic model only|excerpt|originalText/);
    expect(JSON.stringify({entries,facts})).toBe(before);expect(rng).not.toHaveBeenCalled();
  });
  it('is byte deterministic with reversed source, staging, evidence and rule iteration order',()=>{
    const a=inputs(),b=inputs(),r=structuredClone(recipe);r.packs.reverse();b.entries.reverse();b.facts.evidence.reverse();b.facts.rules.reverse();
    expect([...compileHumanL0Mechanics(recipe,registry,a.entries,a.facts).artifacts]).toEqual([...compileHumanL0Mechanics(r,registry,b.entries,b.facts).artifacts]);
  });
  it.each(['old-version','projection','dependency'] as const)('rejects invalid mechanical recipe: %s',change=>{
    const r=structuredClone(recipe);if(change==='old-version')r.packs[0].version='0.1.1';
    if(change==='projection')r.projection='human-l0-ancestry-stubs';if(change==='dependency')r.packs[1].dependencies[0].version='9.0.0';
    expect(()=>parseMechanicalRecipe(r)).toThrow();
  });
  it('rejects blocked source data, missing/duplicate evidence, unexpected formulas and divergent modifiers',()=>{
    for(const mutate of [(i:ReturnType<typeof inputs>)=>i.entries[0].stage='blocked',
      (i:ReturnType<typeof inputs>)=>i.facts.evidence.pop(),
      (i:ReturnType<typeof inputs>)=>i.facts.evidence.push(i.facts.evidence[0]),
      (i:ReturnType<typeof inputs>)=>i.facts.rules[0].formula={op:'constant',value:99},
      (i:ReturnType<typeof inputs>)=>i.facts.rules.at(-1)!.formula={op:'subtract',ref:'perception',amount:99}]) {
      const i=inputs();mutate(i);expect(()=>compileHumanL0Mechanics(recipe,registry,i.entries,i.facts)).toThrow();
    }
  });
  it('validates exact indexes, complete output inventory and catalog roundtrip with ruleset disabled',()=>{
    const b=bundle(),result=validate(b);expect(result).toMatchObject({status:'passed',packs:2,entities:2});
    expect(result.snapshot.ruleset.packs).toEqual([]);expect(result.snapshot.packs.map(p=>p.version)).toEqual(['0.2.0','0.2.0']);
    b.artifacts.set('unexpected.json','{}');expect(()=>validate(b)).toThrow(/inventory/);
  });
  it.each(['pack-number','pack-evidence','index','report','input-provenance','missing-file'] as const)('rejects altered persisted bundle: %s',change=>{
    const b=bundle(),path=[...b.artifacts.keys()].find(p=>p.includes('shadow-of-the-demon-lord-core'))!;
    if(change==='missing-file') b.artifacts.delete(path);
    else if(change==='input-provenance') b.provenance.inputs[0].sha256=sha('changed');
    else {
      const target=change.startsWith('pack')?path:change==='index'?'compendios/ancestry.index.json':REPORT;
      const v=JSON.parse(b.artifacts.get(target)!);
      if(change==='pack-number')v.entities[0].mechanics.characteristics.speed.value++;
      if(change==='pack-evidence')v.entities[0].mechanics.evidence[0].inputSha256=sha('changed');
      if(change==='index')v.entries[0].ref.version='9.0.0';if(change==='report')v.gates.officialGenerationEnabled=true;
      b.artifacts.set(target,canonicalJson(v));
    }
    expect(()=>validate(b)).toThrow();
  });
  it('fails closed without licensed inputs and omits malformed private JSON from diagnostics',async()=>{
    const root=await workspace();await put(root,'curation/human-l0-mechanical-compilation.json',recipe);
    await mkdir(join(root,'curation/reviews'),{recursive:true});
    await writeFile(join(root,'curation/reviews/human-l0-base-2026-11-02.json'),'{PRIVATE_SENTINEL');
    await expect(buildMechanicalArtifacts(root)).rejects.toThrow('json-input-invalid');
  });
  it.each(['stale','traversal'] as const)('rejects %s review inputs before projection',async change=>{
    const root=await workspace();await put(root,'curation/human-l0-mechanical-compilation.json',recipe);
    await put(root,'curation/reviews/human-l0-base-2026-11-02.json',{
      reviewId:'human-l0-base-md-2026-11-02',assessment:'base-confirmed-against-local-text-with-explicit-inheritance-and-decisions',
      inputs:[{path:change==='traversal'?'rules/../outside.txt':'rules/synthetic.txt',sha256:sha('different')}],reviewedArtifacts:[],evidence:[] });
    await put(root,'rules/synthetic.txt','PRIVATE_SENTINEL');
    await expect(buildMechanicalArtifacts(root)).rejects.toThrow(change==='stale'?'review-input-stale':'input-path-invalid');
  });
  it('keeps mechanical CLI output inside tmp before reading inputs',async()=>{
    const root=await workspace();await expect(mainMechanical(['--write','--output','content-packs/public'],root)).rejects.toThrow('inside tmp');
    await expect(mainMechanical(['--invalid'],root)).rejects.toThrow('Use --write');
    await expect(readFile(join(root,'content-packs/public'),'utf8')).rejects.toThrow();
  });
});
