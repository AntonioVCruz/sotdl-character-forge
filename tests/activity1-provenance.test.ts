import { readFileSync } from 'node:fs';
import { mkdir,mkdtemp,rm,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname,join,relative,resolve,sep } from 'node:path';
import { afterEach,describe,expect,it } from 'vitest';
import { canonicalJson } from '../tools/curation/canonical-json';
import { ProvenanceReconciliationSchema,sha256,verifyProvenanceTransition,type ProvenanceTransition } from '../tools/curation/provenance-reconciliation';
import { Activity1VerificationSchema,main,safeInputPath,verifyByteGraph } from '../tools/curation/verify-activity1-provenance';

const serialized=(v:unknown)=>Buffer.from(JSON.stringify(v,null,2)+'\n');
function proof() {
  const old={schemaVersion:1,inputRefs:[{path:'rules/synthetic.md',sha256:sha256('before')}],spec:{value:7,status:'needs-review'}};
  const current={...old,inputRefs:[{path:'rules/synthetic.md',sha256:sha256('after')}]};
  const transition:ProvenanceTransition={path:'curation/pilot/professions-languages.json',previousSha256:sha256(serialized(old)),
    currentSha256:sha256(serialized(current)),metadataBefore:{inputRefs:old.inputRefs}};
  return {old,current,transition};
}
const temporary:string[]=[];
afterEach(async()=>{for(const p of temporary.splice(0)) {
  const relativePath=relative(resolve(tmpdir()),resolve(p));
  if(!relativePath.startsWith('act1-provenance-')||relativePath.includes(sep))throw new Error('Unexpected cleanup path.');
  await rm(p,{recursive:true,force:true});
}});
async function graph() {
  const root=await mkdtemp(join(tmpdir(),'act1-provenance-'));temporary.push(root);
  const files=new Map<string,Buffer>();
  files.set('rules/synthetic.md',Buffer.from('PRIVATE_SENTINEL\n'));
  files.set('curation/pilot/example.json',serialized({inputRefs:[{path:'rules/synthetic.md',sha256:sha256(files.get('rules/synthetic.md')!)}],value:4}));
  const ref={path:'curation/pilot/example.json',sha256:sha256(files.get('curation/pilot/example.json')!)};
  files.set('curation/reports/example.json',serialized({inputRefs:[ref],outputs:[ref]}));
  for(const [path,bytes]of files){await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),bytes);}
  return {root,files,roots:['curation/reports/example.json'],expected:[...files].map(([path,b])=>({path,bytes:b.length,sha256:sha256(b)}))};
}

describe('metadata-only reconciliation preserves historical review',()=>{
  it('reconstructs the exact previous artifact using only former top-level input references',()=>{
    const p=proof();expect(verifyProvenanceTransition(serialized(p.current),p.transition,p.transition.previousSha256)).toEqual(p.transition);
  });
  it('rejects changed facts, evidence, states or text even after current hashes are recalculated',()=>{
    for(const field of ['spec','evidence','status','text']) {
      const p=proof(),current={...p.current,[field]:field==='spec'?{value:99,status:'curated'}:'PRIVATE_SENTINEL'};
      p.transition.currentSha256=sha256(serialized(current));
      expect(()=>verifyProvenanceTransition(serialized(current),p.transition,p.transition.previousSha256)).toThrow('changes reviewed payload');
    }
  });
  it('does not allow arbitrary field restoration, raw source substitution or forged historical hash',()=>{
    const p=proof();
    expect(()=>verifyProvenanceTransition(serialized(p.current),{...p.transition,metadataBefore:{...p.transition.metadataBefore,spec:p.old.spec}},p.transition.previousSha256)).toThrow('schema');
    expect(()=>verifyProvenanceTransition(serialized(p.current),{...p.transition,path:'rules/synthetic.md'},p.transition.previousSha256)).toThrow('schema');
    expect(()=>verifyProvenanceTransition(serialized(p.current),p.transition,sha256('forged history'))).toThrow('hash mismatch');
    expect(()=>verifyProvenanceTransition(serialized({...p.current,extra:1}),p.transition,p.transition.previousSha256)).toThrow('hash mismatch');
  });
  it('permits former output hashes only for reports and still proves the whole report content',()=>{
    const p=proof(),old={...p.old,outputs:[{path:'curation/pilot/example.json',sha256:sha256('old')}]};
    const current={...p.current,outputs:[{path:'curation/pilot/example.json',sha256:sha256('new')}]};
    const t={path:'curation/reports/professions-languages.json',previousSha256:sha256(serialized(old)),currentSha256:sha256(serialized(current)),metadataBefore:{inputRefs:old.inputRefs,outputs:old.outputs}};
    expect(()=>verifyProvenanceTransition(serialized(current),t,t.previousSha256)).not.toThrow();
    expect(()=>verifyProvenanceTransition(serialized(current),{...t,path:'curation/pilot/professions-languages.json'},t.previousSha256)).toThrow('schema');
  });
});

describe('activity 1 local byte gate',()=>{
  it('checks all input/output edges and their bytes without requiring the licensed corpus in public tests',async()=>{
    const g=await graph();expect(await verifyByteGraph(g.root,g.roots,g.expected)).toEqual({files:3,referenceEdges:3,outputEdges:1});
  });
  it('does not normalize LF/CRLF when checking source hashes',async()=>{
    const g=await graph();await writeFile(join(g.root,'rules/synthetic.md'),'PRIVATE_SENTINEL\r\n');
    await expect(verifyByteGraph(g.root,g.roots,g.expected)).rejects.toThrow('raw byte hash mismatch');
  });
  it('rejects stale references even if the changed file hash was updated in the inventory',async()=>{
    const g=await graph(),bytes=Buffer.from('changed');await writeFile(join(g.root,'rules/synthetic.md'),bytes);
    Object.assign(g.expected[0],{bytes:bytes.length,sha256:sha256(bytes)});
    await expect(verifyByteGraph(g.root,g.roots,g.expected)).rejects.toThrow('reference hash mismatch');
  });
  it('rejects missing, duplicate and unreachable inventory entries',async()=>{
    const g=await graph();await expect(verifyByteGraph(g.root,g.roots,g.expected.slice(1))).rejects.toThrow('reference hash mismatch');
    await expect(verifyByteGraph(g.root,g.roots,[...g.expected,g.expected[0]])).rejects.toThrow('inventory invalid');
    await expect(verifyByteGraph(g.root,g.roots,[...g.expected,{path:'rules/unreachable.md',bytes:0,sha256:sha256('')}])).rejects.toThrow('unreachable');
  });
  it('rejects path escapes and write-mode invocation before opening local inputs',async()=>{
    for(const p of ['../outside','rules/../outside','C:/outside','.git/config','rules//missing'])expect(()=>safeInputPath(p)).toThrow('path invalid');
    await expect(main(['--write'])).rejects.toThrow('never rewrites');
  });
  it('keeps public closure evidence typed and bound to the immutable structural snapshot',()=>{
    const v=Activity1VerificationSchema.parse(JSON.parse(readFileSync('curation/reviews/issue34-activity1-local-verification.json','utf8')));
    const r=ProvenanceReconciliationSchema.parse(JSON.parse(readFileSync('curation/reviews/issue34-activity1-provenance-2026-11-02.json','utf8')));
    const matrix=JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json','utf8'));
    expect(v.counts).toMatchObject({files:301,referenceEdges:1060,outputEdges:233,reconciledArtifacts:12,declaredRecordsVerified:258});
    expect(sha256(canonicalJson(r))).toBe(v.reconciliationCanonicalSha256);
    expect(sha256(canonicalJson(matrix))).toBe(v.matrixCanonicalSha256);
    expect(sha256(canonicalJson(JSON.parse(readFileSync('curation/reviews/human-l0-base-2026-11-02.json','utf8'))))).toBe(v.historicalReviewCanonicalSha256);
    expect(v.retainedBlockerIds).not.toContain('act1-local-hash-check');
    expect(v.preserved.officialGenerationEnabled).toBe(false);expect(v.preserved.sourceAuthorized).toBe(false);
  });
});
