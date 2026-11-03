import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {parseCoreLocalDocument,type CoreLocalDocument} from '../packages/curation/human-l0-core-local';

/** Invented minimal facts exercise the local contract; never written as a real artifact. */
function example():CoreLocalDocument {
  const sourceId='test:core',evidenceIds=['test:evidence'];
  return {contract:'sotdl.human-l0.consumable',contractVersion:'1.1.0',lot:'core',distribution:'local',fictionalData:false,reviewStatus:'needs-review',rulesetEnabled:false,importablePack:false,exportEnabled:false,sourceId,publicationVersion:null,
    tables:[{id:'core:test',sourceId,dice:{count:1,sides:2},activation:'test-only',manualMode:'test-only',columns:[{id:'main',rollId:'core:test#main',rows:[1,2].map(n=>({id:`test:row:${n}`,min:n,max:n,text:`Invented result ${n}`,evidenceIds,weight:{ways:'1',denominator:'2'},bindings:[{kind:'narrative',refId:null,pending:null}]}))}]}],
    queries:[],links:[],professions:[],things:[],programs:[],templates:[],materialReferences:[],languageOptions:[],openLanguages:[],startingRights:{professionChoices:2,manualOrRandom:true,ancestryAdditional:'one-language-OR-random-profession-not-both'},
    coreInitialThing:{id:'test:initial',count:1,additional:false,evidenceId:'test:evidence'},interestingThingsPolicy:{defaultVariant:'oddities',coreIsExplicitAlternative:true,disabledSource:'pending-no-silent-fallback'},
    backgroundSideRolls:[],backgroundStateMentions:[],evidence:[{id:'test:evidence',sourceId,path:'test-only/input',inputSha256:'a'.repeat(64),startLine:1,endLine:2,excerptSha256:'b'.repeat(64)}],
    inputs:[{path:'test-only/pilot',sha256:'c'.repeat(64)}],coverage:[{matrixId:'test:matrix',bindings:['test:row:1','test:row:2'],status:'projected'}]};
}
describe('Core local contract 1.1.0',()=>{
  it('keeps local real-data gates separate from synthetic 1.0.0',()=>{
    expect(parseCoreLocalDocument(example()).rulesetEnabled).toBe(false);
    const synthetic=JSON.parse(readFileSync('curation/examples/human-l0-core-lot.synthetic.json','utf8'));
    expect(()=>parseCoreLocalDocument(synthetic.document??synthetic)).toThrow('schema-invalid');
    for(const field of ['fictionalData','rulesetEnabled','importablePack','exportEnabled'] as const) {
      const d=example();d[field]=true as never;expect(()=>parseCoreLocalDocument(d)).toThrow('schema-invalid');
    }
  });
  it('recomputes exact natural weights and rejects gaps and duplicated rolls',()=>{
    const weight=example();weight.tables[0].columns[0].rows[0].weight.ways='2';expect(()=>parseCoreLocalDocument(weight)).toThrow('weight-mismatch');
    const gap=example();gap.tables[0].columns[0].rows.pop();expect(()=>parseCoreLocalDocument(gap)).toThrow('range-coverage');
    const duplicate=example();duplicate.tables[0].columns.push(structuredClone(duplicate.tables[0].columns[0]));expect(()=>parseCoreLocalDocument(duplicate)).toThrow('duplicate-identity');
  });
  it('refuses missing evidence, cross-source evidence and missing targets',()=>{
    const missing=example();missing.evidence=[];expect(()=>parseCoreLocalDocument(missing)).toThrow('evidence-missing');
    const cross=example();cross.evidence[0].sourceId='test:other';expect(()=>parseCoreLocalDocument(cross)).toThrow('evidence-source-range');
    const target=example();target.tables[0].columns[0].rows[0].bindings=[{kind:'subtable',refId:'core:missing',pending:null}];expect(()=>parseCoreLocalDocument(target)).toThrow('binding-missing');
    const query=example();query.queries=[{id:'test:query',kind:'prior-result',tableId:'core:missing',columnId:'main',extraDice:false}];expect(()=>parseCoreLocalDocument(query)).toThrow('query-producer-missing');
  });
  it('binds a profession to its exact row even if both targets exist',()=>{
    const d=example();
    d.professions=[1,2].map(n=>({id:`test:row:${n}`,kind:'profession-option',sourceFamily:'core',sourceId:d.sourceId,category:'test',tableId:'core:test',range:{min:n,max:n},sourceText:'Invented profession',evidenceIds:['test:evidence'],subchoices:[],specialization:'none',literacy:null,equipment:[]}));
    d.tables[0].columns[0].rows[0].bindings=[{kind:'profession',refId:'test:row:2',pending:null}];
    expect(()=>parseCoreLocalDocument(d)).toThrow('profession-target-mismatch');
  });
});
