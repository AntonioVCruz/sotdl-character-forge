import {describe,it,expect} from 'vitest';
import {digest,freezeInventory,changedInputs,reviewProbabilities,traceEntity} from '../tools/curation/review-freeze';

const input={scope:'source' as const,path:'invented.json',sha256:digest('original')};
describe('scoped review freeze with fictional data',()=>{
  it('detects changed, removed and added source/PDF/implementation inputs independent of ordering',()=>{
    const pdf={...input,scope:'pdf' as const,path:'fiction.pdf'},code={...input,scope:'implementation' as const,path:'handler.ts'};
    expect(changedInputs([input,pdf,code],[code,pdf,input])).toEqual([]);
    for(const changed of [input,pdf,code])expect(changedInputs([input,pdf,code],[input,pdf,code].map(e=>e===changed?{...e,sha256:digest('changed')}:e))).toEqual([`${changed.scope}:${changed.path}`]);
    expect(changedInputs([input],[])).toEqual(['source:invented.json']);
    expect(changedInputs([],[input])).toEqual(['source:invented.json']);
    expect(()=>freezeInventory([input,input])).toThrow('Duplicate');
    expect(()=>freezeInventory([{...input,sha256:'invalid'}])).toThrow('Invalid');
  });
  it('does not trust an asserted complete flag on a table with missing outcomes',()=>{
    const table={id:'fiction:table',sourceId:'fiction:source',evidenceIds:['e1'],kind:'random',activation:'test',manualMode:'test',dice:{count:1,sides:6},streams:[{id:'main',association:'verified-transcription',rows:[{id:'r1',min:1,max:3,text:'Invented red',evidenceIds:['e1']},{id:'r2',min:4,max:6,text:'Invented blue',evidenceIds:['e1']}]}],lookupKeys:[],modifierPolicy:'none',application:'reference-only-manual-effects',automaticGeneration:false,reviewNotes:[]};
    expect(reviewProbabilities([table],[]).streams[0].weights.map(w=>w.ways)).toEqual(['3','3']);
    expect(()=>reviewProbabilities([{...table,streams:[{...table.streams[0],rows:[table.streams[0].rows[0]]}]}],[])).toThrow('Incomplete');
  });
  it('allows only trace metadata and rejects dangling evidence',()=>{
    const e={id:'e1',sourceId:'fiction:source',path:'private.md',inputSha256:digest('x'),startLine:1,endLine:2,excerptSha256:digest('secret'),excerpt:'SHOULD NEVER APPEAR'};
    const entity={id:'fiction:row',evidenceIds:['e1'],text:'SHOULD NEVER APPEAR'};
    const trace=traceEntity('fiction',entity,new Map([['e1',e]]),'handler.ts','test.ts');
    expect(JSON.stringify(trace)).not.toContain('SHOULD NEVER APPEAR');expect(trace.distributionApproved).toBe(false);
    expect(()=>traceEntity('fiction',entity,new Map(),'handler.ts','test.ts')).toThrow('Unbound');
  });
});
