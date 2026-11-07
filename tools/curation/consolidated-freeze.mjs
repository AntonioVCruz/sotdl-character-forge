import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {sha,json,fingerprint,safePath,compareInventory,restoreInventory,immutableWrite} from './consolidated-freeze-lib.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const priorPath='curation/human-l0-review-freeze.json';
const parse=bytes=>JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));
const readJson=async path=>parse(await readFile(path));
function publicPaths(){
  return [...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean))]
    .filter(p=>!p.startsWith('curation/freezes/')&&!/^(rules|tmp|output|node_modules|dist|test-results|playwright-report|curation\/(pilot|entries|segments|normalized|normalization|corrections|history|reports))\//.test(p))
    .sort();
}
const inventory=async()=>Promise.all(publicPaths().map(async path=>fingerprint(path,await readFile(await safePath(root,path)))));
async function contracts(){
  const frozen=await readJson(resolve(root,'curation/contracts.json'));
  if(frozen.files.length!==16)throw new Error('Expected sixteen original contracts');
  for(const entry of frozen.files)if(sha(await readFile(await safePath(root,entry.path)))!==entry.sha256)throw new Error(`Original contract differs: ${entry.path}`);
}
async function runtime(){
  const output=resolve(root,'tmp/curation/consolidated-runtime.mjs');
  const result=await build({entryPoints:[resolve(root,'tools/curation/consolidated-runtime.ts')],bundle:true,packages:'external',platform:'node',format:'esm',target:'node22',outfile:output,write:false});
  await mkdir(dirname(output),{recursive:true});await writeFile(output,result.outputFiles[0].contents);
  return (await import(pathToFileURL(output).href)).rebuild(resolve(process.env.SOTDL_LOCAL_SOURCE_ROOT??root),root);
}
async function privateInventory(prior){
  const sourceRoot=resolve(process.env.SOTDL_LOCAL_SOURCE_ROOT??root),reviewRoot=resolve(process.env.SOTDL_REVIEW_ROOT??root),entries=[];
  for(const e of prior.inputs.filter(e=>e.scope!=='implementation')){
    const path=e.scope==='pdf'?`tmp/private/pdfs/${e.path}.pdf`:e.path;
    const bytes=await readFile(await safePath(e.scope==='pdf'?reviewRoot:sourceRoot,path));
    if(sha(bytes)!==e.sha256)throw new Error(`Historical private input differs: ${e.scope}/${e.path}`);
    entries.push({scope:e.scope,path,sha256:sha(bytes)});
  }
  const matrix=await readFile(await safePath(reviewRoot,prior.localArtifacts.path));
  if(sha(matrix)!==prior.localArtifacts.sha256)throw new Error('Historical private review differs');
  entries.push({scope:'review',path:prior.localArtifacts.path,sha256:sha(matrix)});
  const concordance='tmp/private/pdf-concordance.json';
  entries.push({scope:'review',path:concordance,sha256:sha(await readFile(await safePath(reviewRoot,concordance)))});
  return entries;
}
async function archive(version,additional=[]){
  const acceptance=await readJson(resolve(root,'curation/reviews/human-l0-vertical-acceptance-2026-11-06.json'));
  const decision=await readJson(resolve(root,'curation/reviews/human-l0-enablement-decision-2026-11-06.json'));
  const entries=[...acceptance.execution.reports,...decision.validation.reports,...additional];
  for(const path of ['tmp/freeze-public-vitest.json','tmp/freeze-private-vitest.json']){
    const bytes=await readFile(resolve(root,path)),report=parse(bytes);
    if(!report.success||report.numFailedTests)throw new Error('Freeze validation suite failed');
    entries.push({path,sha256:sha(bytes)});
  }
  // Validate all historic evidence before copying any. Mutable QA PDFs are deliberately not substituted for historic hashes.
  const copies=await Promise.all(entries.map(async(e,i)=>{
    const bytes=await readFile(await safePath(root,e.path));
    if(sha(bytes)!==e.sha256)throw new Error(`Historical evidence differs: ${e.path}`);
    return {originalPath:e.path,path:`tmp/private/consolidated-freeze/${version}/evidence-${i}.json`,sha256:e.sha256,bytes};
  }));
  for(const e of copies)await immutableWrite(await safePath(root,e.path),e.bytes);
  return copies.map(({bytes,...entry})=>entry);
}
async function fullCheck(manifest){
  const prior=await readJson(resolve(root,priorPath));
  if(json(await privateInventory(prior))!==json(manifest.privateInputs))throw new Error('Private inventory differs');
  for(const e of manifest.evidence)if(sha(await readFile(await safePath(root,e.path)))!==e.sha256)throw new Error(`Archived evidence differs: ${e.path}`);
  const actual=await runtime(),{artifacts,...pins}=actual;
  if(json(pins)!==json(manifest.runtime))throw new Error('Rebuilt runtime differs');
  for(const a of artifacts){
    const bytes=await readFile(resolve(root,`tmp/curation/compiled-real-runtime/1.0.1/${a.path}`));
    if(!bytes.equals(Buffer.from(a.text)))throw new Error('Published local runtime bytes differ');
  }
}
async function main(){
  const [action,flag,version,...extra]=process.argv.slice(2);
  if(!['--write','--check','--check-public','--restore-line-endings'].includes(action)||flag!=='--version'||!/^\d+\.\d+\.\d+$/.test(version??'')||extra.length)throw new Error('Use --write|--check|--check-public|--restore-line-endings --version x.y.z');
  const target=resolve(root,`curation/freezes/human-l0/${version}.json`);
  if(action==='--write'){
    try{await readFile(target);throw new Error('Version already exists; choose a new version');}catch(e){if(e.code!=='ENOENT')throw e;}
    await contracts();
    const publicInputs=await inventory(),priorBytes=await readFile(resolve(root,priorPath)),prior=parse(priorBytes);
    const privateInputs=await privateInventory(prior),{artifacts,...pins}=await runtime();
    for(const a of artifacts)if(!(await readFile(resolve(root,`tmp/curation/compiled-real-runtime/1.0.1/${a.path}`))).equals(Buffer.from(a.text)))throw new Error('Local runtime artifact differs');
    const closurePath='curation/reviews/human-l0-closure-activity7-2026-11-06.json';
    let closure;
    try{closure=await readJson(resolve(root,closurePath));}catch(error){if(error.code!=='ENOENT')throw error;}
    let lineage={};
    if(closure?.freeze?.version===version){
      const predecessor=closure.freeze.predecessor;
      if(sha(await readFile(await safePath(root,predecessor.path)))!==predecessor.sha256)throw new Error('Predecessor freeze differs');
      lineage={predecessor,closureReview:{path:closurePath,sha256:sha(await readFile(resolve(root,closurePath)))}};
    }
    const evidence=await archive(version,lineage.closureReview?closure.validation.reports:[]);
    const old=prior.inputs.filter(e=>e.scope==='implementation'),newByPath=new Map(publicInputs.map(e=>[e.path,e]));
    const manifest={contract:'sotdl.human-l0.consolidated-freeze',contractVersion:'1.0.0',version,date:'2026-11-06',author:'Codex',delivery:'local-unpublished',
      baseCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
      policy:{sourceStatus:'needs-review',distributionApproved:false,exportEnabled:false,lineEndings:'preserve-current-bytes; explicit-content-matching-restoration'},
      prior:{path:priorPath,sha256:sha(priorBytes),reviewId:prior.reviewId,preserved:true},...lineage,
      delta:{reason:'Issue56 exports; activities1-5 implementation, acceptance and destination policy; activity6 reproducibility; successor may include activity7 closure documentation and review',
        changed:old.filter(e=>newByPath.has(e.path)&&newByPath.get(e.path).sha256!==e.sha256).map(e=>e.path),
        removed:old.filter(e=>!newByPath.has(e.path)).map(e=>e.path),added:publicInputs.filter(e=>!old.some(p=>p.path===e.path)).map(e=>e.path)},
      inventoryRule:'Git tracked and nonignored untracked public files; excludes private/build/output roots and all curation/freezes/ (independent immutable versions)',
      publicInputs,privateInputs,runtime:pins,evidence,
      toolchain:{node:process.versions.node,platform:process.platform,lockfile:'package-lock.json',install:'npm ci'},
      limits:['Public check does not validate licensed corpus or runtime contexts','Manifest is a local trust baseline, not a signature; preserve its external SHA256 receipt',
        'Historic PDF review remains recorded in activity4; mutable QA PDF binaries are not substituted or certified by this freeze',
        'Runtime rebuild is byte deterministic; tests and browser/PDF reports include variable times and are archived by hash',
        'Later delivery changes require a new freeze version; no publication or issue closure']};
    await immutableWrite(target,json(manifest));
  }else{
    const bytes=await readFile(target),manifest=parse(bytes);
    if(manifest.contract!=='sotdl.human-l0.consolidated-freeze'||manifest.version!==version||manifest.contractVersion!=='1.0.0')throw new Error('Manifest identity differs');
    let predecessorRepair;
    if(manifest.predecessor){
      const path=await safePath(root,manifest.predecessor.path),before=await readFile(path);
      if(sha(before)!==manifest.predecessor.sha256){
        const canonical=Buffer.from(json(parse(before)));
        if(action!=='--restore-line-endings'||before.toString('utf8').replace(/\r\n|\r/g,'\n')!==canonical.toString('utf8')||sha(canonical)!==manifest.predecessor.sha256)throw new Error('Predecessor freeze differs');
        predecessorRepair={path,before,canonical};
      }
    }
    if(action==='--restore-line-endings'){
      // Manifest is outside its own inventory: allow only canonical formatting with newline changes.
      if(bytes.toString('utf8').replace(/\r\n|\r/g,'\n')!==json(manifest))throw new Error('Manifest content/format differs');
      const count=await restoreInventory(root,manifest.publicInputs,publicPaths());
      if(predecessorRepair){
        if(!(await readFile(predecessorRepair.path)).equals(predecessorRepair.before))throw new Error('Predecessor changed during restoration');
        await writeFile(predecessorRepair.path,predecessorRepair.canonical);
      }
      if(!bytes.equals(Buffer.from(json(manifest))))await writeFile(target,json(manifest));
      console.log(`Explicit newline restoration: ${count} public files.`);
    }else if(!bytes.equals(Buffer.from(json(manifest))))throw new Error('Manifest bytes differ; explicit restoration required');
    const changed=compareInventory(manifest.publicInputs,await inventory());
    if(changed.length)throw new Error(`Public inputs differ: ${changed.join(', ')}`);
    await contracts();
    if(action==='--check')await fullCheck(manifest);
  }
  console.log(`Human L0 freeze ${version}: ${action}; SHA256 ${sha(await readFile(target))}; ${action==='--check'?'public + private + rebuilt runtime verified':'private validation not performed by this command (creation validates inputs)'}.`);
}
try{await main();}catch(error){console.error(`Consolidated freeze refused: ${error.message}`);process.exitCode=1;}
