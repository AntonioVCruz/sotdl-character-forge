import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildOfficialLocalContext} from './official-local-context';
import {buildProcedureLocalContext} from './procedure-local-context';
import {canonicalJson} from './canonical-json';
import {digest,artifactDigest,freezeInventory,reviewProbabilities,traceEntity,type Fingerprint} from './review-freeze';

const lots=[
  ['table-closure','packages/character-generator/procedure-graph.ts','tests/procedure-source.test.ts'],
  ['professions-languages','packages/character-generator/human-l0.ts','tests/official-core-source.test.ts'],
  ['wealth-equipment','packages/character-generator/core-equipment.ts','tests/official-equipment-source.test.ts'],
  ['interesting-things','packages/character-generator/core-interesting-things.ts','tests/official-interesting-things-source.test.ts'],
  ['items','packages/character-generator/core-equipment.ts','tests/official-equipment-source.test.ts'],
  ['core-level-zero','packages/character-generator/official-core.ts','tests/finalization-source.test.ts'],
  ['human-ancestry','packages/character-generator/human-l0.ts','tests/finalization-source.test.ts']
] as const;
const target='curation/human-l0-review-freeze.json';

export async function main(args:string[],implementationRoot:string){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const sourceRoot=resolve(process.env.SOTDL_LOCAL_SOURCE_ROOT??implementationRoot);
  const json=async(root:string,path:string)=>JSON.parse(await readFile(resolve(root,path),'utf8'));
  const policy=await json(implementationRoot,'curation/human-l0-review-policy.json');
  if(policy.exportEnabled!==false||policy.distributionApproved!==false||policy.sourceStatus!=='needs-review')throw new Error('Distribution/source gate changed');
  // Re-extraction, byte provenance and exact pack dependencies are verified by these builders.
  const core=await buildOfficialLocalContext(sourceRoot,implementationRoot);
  const procedure=await buildProcedureLocalContext(sourceRoot,implementationRoot);
  const concordance=await json(implementationRoot,'tmp/private/pdf-concordance.json');
  const fingerprints:Fingerprint[]=[];
  const add=async(scope:Fingerprint['scope'],root:string,path:string)=>{
    fingerprints.push({scope,path,sha256:digest(await readFile(resolve(root,path)))});
  };
  for(const source of policy.sources){
    const key=source.pdfKey as string;
    const bytes=await readFile(resolve(implementationRoot,`tmp/private/pdfs/${key}.pdf`));
    const actual=digest(bytes);
    if(actual!==source.sha256||actual!==concordance.pdfs[source.id]?.sha256||source.physicalPages!==concordance.pdfs[source.id]?.pages)throw new Error(`PDF identity changed: ${key}`);
    fingerprints.push({scope:'pdf',path:key,sha256:actual});
  }
  const sourcePaths=new Set<string>(core.core.inputs.map(i=>i.path));
  for(const path of ['curation/sources.json','curation/input-manifest.json',...lots.map(([lot])=>`curation/pilot/${lot}.json`)])sourcePaths.add(path);
  for(const path of [...sourcePaths].sort())await add('source',sourceRoot,path);
  // Include new nonignored files as well as tracked files; exclude private artifacts and this baseline.
  const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:implementationRoot,encoding:'utf8'}).split('\0').filter(Boolean);
  const implementationPaths=files.filter(p=>p!==target&&(/^(apps|packages|tools|tests|docs)\//.test(p)||/^curation\/[^/]+\.json$/.test(p)||['.gitattributes','.gitignore','package.json','package-lock.json','tsconfig.json','vite.config.ts','playwright.config.ts'].includes(p)));
  for(const path of [...new Set(implementationPaths)].sort())await add('implementation',implementationRoot,path);
  const frozen=await json(implementationRoot,'curation/contracts.json');
  if(frozen.files.length!==16)throw new Error('Unexpected contract freeze');
  for(const entry of frozen.files)if(digest(await readFile(resolve(implementationRoot,entry.path)))!==entry.sha256)throw new Error(`Frozen contract changed: ${entry.path}`);
  const matrix:ReturnType<typeof traceEntity>[]=[];
  const coverage=[];
  let probability:ReturnType<typeof reviewProbabilities>|undefined;
  for(const [lot,handler,test] of lots){
    await readFile(resolve(implementationRoot,handler));await readFile(resolve(implementationRoot,test));
    const doc=await json(sourceRoot,`curation/pilot/${lot}.json`);
    const evidence=new Map<string,any>(doc.evidence.map((e:any)=>[e.id,e]));
    const seen=new Set<string>();
    function visit(value:any){
      if(!value||typeof value!=='object')return;
      if(Array.isArray(value)){for(const child of value)visit(child);return;}
      if(typeof value.id==='string'&&Array.isArray(value.evidenceIds)&&value.evidenceIds.length){
        if(!seen.has(value.id)){matrix.push(traceEntity(lot,value,evidence,handler,test));seen.add(value.id);}
      }
      for(const [key,child]of Object.entries(value))if(key!=='evidence')visit(child);
    }
    visit(doc);
    coverage.push({lot,entities:seen.size,evidence:evidence.size,handler,test,reviewId:policy.reviewId});
    if(lot==='table-closure'){
      probability=reviewProbabilities(doc.tables,doc.selectorAudits.map((s:any)=>s.tableId));
      for(const saved of doc.audits){
        const current=probability.streams.find(s=>s.tableId===saved.tableId&&s.streamId===saved.streamId);
        if(!current||canonicalJson(current.weights)!==canonicalJson(saved.weights))throw new Error('Stored probabilities differ');
      }
      for(const saved of doc.selectorAudits){
        const current=probability.selectors.find(s=>s.tableId===saved.tableId);
        if(!current||canonicalJson(current.weights)!==canonicalJson(saved.weights))throw new Error('Stored selector probabilities differ');
      }
      const expected=doc.tables.flatMap((t:any)=>t.streams.flatMap((s:any)=>s.rows.map((r:any)=>r.id))).sort();
      const actual=concordance.rows.map((r:any)=>r.id).sort();
      if(canonicalJson(expected)!==canonicalJson(actual)||concordance.rows.some((r:any)=>!['text-concordant','selector-reference'].includes(r.status)))throw new Error('PDF row concordance incomplete');
      if(doc.parseIssues.length)throw new Error('Unresolved table parse errors');
    }
  }
  const rowPages=new Map(concordance.rows.map((r:any)=>[r.sourceId+'|'+r.id,r]));
  const evidencePages=new Map(concordance.evidence.map((e:any)=>[e.sourceId+'|'+e.id+'|'+e.excerptSha256,e]));
  const traced=matrix.map(entity=>({...entity,
    sources:entity.sourceIds.map(id=>{
      const source=policy.sources.find((s:any)=>s.id===id);
      if(!source)throw new Error(`Source outside reviewed slice: ${id}`);
      return {id,edition:source.edition,printing:source.printing,pdfSha256:source.sha256};
    }),
    testCoverage:'lot-regression-not-individual-outcome-proof',
    evidence:entity.evidence.map(e=>{
      const match=(rowPages.get(e.sourceId+'|'+entity.id)??evidencePages.get(e.sourceId+'|'+e.id+'|'+e.excerptSha256)) as any;
      const source=policy.sources.find((s:any)=>s.id===e.sourceId);
      return {...e,pdfCandidatePages:match?.candidatePages??[],
        printedCandidatePages:(match?.candidatePages??[]).map((p:number)=>p-source.physicalPageOffset),
        concordanceStatus:match?.status??'manual-review',printedAssociationVerified:false};
    })}));
  const local={reviewId:policy.reviewId,sourceMetadata:policy.sources,matrix:traced,probability,concordance};
  const manifest={schemaVersion:1,reviewId:policy.reviewId,reviewDate:policy.reviewDate,author:policy.author,
    semanticReview:policy.semanticReview,sourceStatus:policy.sourceStatus,activation:policy.activation,
    distributionApproved:false,exportEnabled:false,versions:{core:core.core.contractVersion,procedure:procedure.contractVersion,
      packs:procedure.mechanicalPacks.map(p=>({packId:p.packId,version:p.version,dependencies:p.dependencies})),frozenContracts:frozen.contractVersion},
    context:{core:core.implementationSha256,procedure:procedure.implementationSha256},
    coverage,probability:{tables:probability!.tables,streams:probability!.streams.length,selectors:probability!.selectors.length,lookups:probability!.lookups},
    pdfConcordance:{evidence:concordance.evidence.length,rows:concordance.rows.length,
      toolchain:concordance.toolchain,
      rangePrefixes:concordance.rows.filter((r:any)=>r.rangePrefixConcordant).length,
      textRows:concordance.rows.filter((r:any)=>r.status==='text-concordant').length,
      selectorRows:concordance.rows.filter((r:any)=>r.status==='selector-reference').length,
      manualEvidence:concordance.evidence.filter((e:any)=>e.status==='manual-review').map((e:any)=>e.id).sort()},
    localArtifacts:{path:'tmp/private/human-l0-review.json',sha256:artifactDigest(local),matrixEntities:matrix.length},
    exclusions:policy.exclusions,inputs:freezeInventory(fingerprints)};
  const output=canonicalJson(manifest);
  if(args[0]==='--write'){
    await mkdir(resolve(implementationRoot,'tmp/private'),{recursive:true});
    await writeFile(resolve(implementationRoot,'tmp/private/human-l0-review.json'),canonicalJson(local));
    await writeFile(resolve(implementationRoot,target),output);
  }else{
    if(await readFile(resolve(implementationRoot,target),'utf8')!==output)throw new Error('Review freeze changed; inspect inputs and review before replacing baseline');
    if(await readFile(resolve(implementationRoot,'tmp/private/human-l0-review.json'),'utf8')!==canonicalJson(local))throw new Error('Local review artifact changed');
  }
  console.log(`Human L0 review freeze: ${matrix.length} entity traces; ${probability!.streams.length} probability streams; ${fingerprints.length} inputs; local only.`);
}
