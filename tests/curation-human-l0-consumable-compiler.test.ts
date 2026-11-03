import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, writeFile, readdir, symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe,expect,it } from 'vitest';
import { compileHumanL0Consumable, publishConsumableArtifacts, validateConsumableArtifacts } from '../tools/curation/human-l0-consumable-compiler';
import { consumableJson, parseConsumableBundle } from '../packages/curation/human-l0-consumable-bundle';

const bytes=readFileSync('curation/examples/human-l0-consumable.synthetic.json');
const recipe=JSON.parse(readFileSync('curation/human-l0-consumable-compilation.json','utf8'));
const compile=()=>compileHumanL0Consumable(bytes,recipe);
describe('consumable compiler and immutable local publication',()=>{
  it('pins real bytes and produces identical artifacts with only emitted entities indexed',async()=>{
    const a=compile(),b=compile();expect([...a.artifacts]).toEqual([...b.artifacts]);
    expect(a.bundle.indexes.items).toEqual(a.bundle.document.items.map(i=>i.id));
    expect(a.bundle.indexes.groupedPendings.reduce((s,g)=>s+g.represents,0)).toBe(350);
    expect(a.bundle.indexes.items.some(i=>i.startsWith('class:'))).toBe(false);
    expect((await validateConsumableArtifacts(a.artifacts,bytes,recipe)).bundle).toEqual(a.bundle);
    expect(a.report.gates).toMatchObject({rulesetEnabled:false,exportEnabled:false,realLotsAccepted:false});
  });
  it('rejects even a byte-only input change; never silently normalizes the hash',()=>{
    expect(()=>compileHumanL0Consumable(Buffer.concat([bytes,Buffer.from(' ')]),recipe)).toThrow('input-byte-hash-mismatch');
    expect(()=>compileHumanL0Consumable(Buffer.from(bytes.toString().replaceAll('\n','\r\n')),recipe)).toThrow('input-byte-hash-mismatch');
  });
  it('does not let the recipe route unreviewed lots or real content into this contract',()=>{
    expect(()=>compileHumanL0Consumable(bytes,{...recipe,input:{...recipe.input,path:'curation/pilot/real.json'}})).toThrow('recipe-invalid');
    const d=JSON.parse(bytes.toString());d.fictionalData=false;
    const forged=Buffer.from(JSON.stringify(d));
    expect(()=>compileHumanL0Consumable(forged,{...recipe,input:{...recipe.input,sha256:createHash('sha256').update(forged).digest('hex')}})).toThrow('document-invalid');
  });
  it('reprojects rather than trusting a rehashed forged bundle or its index',async()=>{
    const a=compile(),forged=structuredClone(a.bundle);forged.document.tables[0].columns[0].rows[0].consequence={kind:'effect',pending:null,effect:{op:'narrative-marker',code:'forged',timing:'narrative',mutatesMechanics:false}};
    forged.documentSha256=createHash('sha256').update(consumableJson(forged.document)).digest('hex');
    const map=new Map(a.artifacts);map.set('bundle.json',consumableJson(forged));
    await expect(validateConsumableArtifacts(map,bytes,recipe)).rejects.toThrow('artifact-content-mismatch');
    const broken=structuredClone(a.bundle);broken.indexes.items=[];
    await expect(parseConsumableBundle(broken)).rejects.toThrow('content-or-index-mismatch');
    map.delete('report.json');await expect(validateConsumableArtifacts(map,bytes,recipe)).rejects.toThrow('artifact-inventory-mismatch');
  });
  it('writes a whole version once, checks every file, and preserves a valid version on failure',async()=>{
    await mkdir('tmp',{recursive:true});const root=await mkdtemp(resolve('tmp','consumable-compiler-test-'));
    const target='tmp/bundles/1.0.0',a=compile();
    await publishConsumableArtifacts(root,target,a,false);await publishConsumableArtifacts(root,target,a,true);
    const original=await readFile(resolve(root,target,'bundle.json'),'utf8');
    const changed=compile();changed.artifacts.set('bundle.json',original+' ');
    await expect(publishConsumableArtifacts(root,target,changed,false)).rejects.toThrow('immutable-output-mismatch');
    expect(await readFile(resolve(root,target,'bundle.json'),'utf8')).toBe(original);
    await writeFile(resolve(root,target,'extra.json'),'{}');
    await expect(publishConsumableArtifacts(root,target,a,true)).rejects.toThrow('artifact-inventory-mismatch');
    await expect(publishConsumableArtifacts(root,'../outside',a,false)).rejects.toThrow('output-outside-tmp');
    await expect(publishConsumableArtifacts(root,'tmp/missing',a,true)).rejects.toThrow('output-missing');
    expect((await readdir(resolve(root,target))).sort()).toEqual(['bundle.json','extra.json','index.json','report.json']);
  });
  it('rejects an output path traversing a link before writing any artifact',async()=>{
    await mkdir('tmp',{recursive:true});const root=await mkdtemp(resolve('tmp','consumable-link-test-'));
    const external=resolve(root,'external');await mkdir(external);await mkdir(resolve(root,'tmp'));
    await symlink(external,resolve(root,'tmp','linked'),process.platform==='win32'?'junction':'dir');
    await expect(publishConsumableArtifacts(root,'tmp/linked/1.0.0',compile(),false)).rejects.toThrow('output-link');
    expect(await readdir(external)).toEqual([]);
  });
});
