import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {buildArtifacts as buildEquipment} from './wealth-equipment-formalizer';
import {sourceLines} from './ancestry-extractor';
import {odditiesTables,uncertainPairings,unassignedPersonal} from './interesting-things-map';
import {details} from './interesting-things-details';
import {InterestingThingsCatalogSchema,ThingOutcomeSchema} from '../../packages/curation/interesting-things-model';

const DATA='curation/pilot/interesting-things.json',REPORT='curation/reports/interesting-things.json';
const CORE='sotdl:shadow-of-the-demon-lord-core',ODD='sotdl:oddities-artifacts-and-esoterica';
const GENERAL='rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md';
const ANCESTRY='rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
const CORRECTION='curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt';
const ODD_CORRECTION='curation/corrections/oddities-tables-2026-10-27/tables.txt';
const ODD_MANIFEST='curation/corrections/oddities-tables-2026-10-27/manifest.json';
const ODD_HASH='d3431ac28254cc4ee5910197b64dbae14744838eaf8bb983b73d4bb3a765620a';
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
export async function buildArtifacts(root:string){
  const upstream=await buildEquipment(root);
  for(const[path,content]of upstream.artifacts)if(await readFile(resolve(root,path),'utf8')!==content)throw new Error(`Stale CUR-018 dependency: ${path}`);
  const cache=new Map<string,Promise<Buffer>>();
  const read=(path:string)=>{if(!cache.has(path))cache.set(path,readFile(resolve(root,path)));return cache.get(path)!;};
  const inventory=JSON.parse((await read('curation/pilot/creation-table-inventory.json')).toString('utf8'));
  const sources=JSON.parse((await read('curation/sources.json')).toString('utf8'));
  const manifest=JSON.parse((await read('curation/input-manifest.json')).toString('utf8'));
  for(const path of [GENERAL,ANCESTRY])if(sha(await read(path))!==manifest.files.find((f:{path:string})=>f.path===path)?.sha256)throw new Error(`Input revision changed: ${path}`);
  const evidence:{id:string;path:string;sourceId:string;startLine:number;endLine:number;inputSha256:string;excerpt:string;excerptSha256:string;physicalPdfPage:null;printedPageVerified:null}[]=[];
  // Cache parsing per build, never across builds: stale-input checks still reread every input.
  const evidenceSources=new Map<string,{lines:ReturnType<typeof sourceLines>;hash:string}>();
  const proof=async(id:string,path:string,startLine:number,endLine:number,sourceId:string)=>{
    if(!evidenceSources.has(path)){const bytes=await read(path);evidenceSources.set(path,{lines:sourceLines(bytes.toString('utf8')),hash:sha(bytes)});}
    const {lines,hash}=evidenceSources.get(path)!;
    if(startLine<1||endLine>lines.length||endLine<startLine)throw new Error('Invalid Interesting Things evidence span');
    const excerpt=lines.slice(startLine-1,endLine).map(l=>l.text).join('\n');
    evidence.push({id,path,sourceId,startLine,endLine,inputSha256:hash,excerpt,excerptSha256:sha(excerpt),physicalPdfPage:null,printedPageVerified:null});
    return id;
  };
  const tables=[];
  for(let n=1;n<=6;n++){
    const tableId=`core:thing-${n}`,inherited=inventory.tables.find((t:{id:string})=>t.id===tableId);
    if(!inherited||inherited.evidence.path!==CORRECTION)throw new Error('Missing preserved Core Interesting Things table');
    const ev=inherited.evidence,lines=sourceLines((await read(CORRECTION)).toString('utf8'));
    if(sha(await read(CORRECTION))!==ev.inputSha256)throw new Error('Core Interesting Things correction changed');
    const starts:number[]=[];for(let i=ev.startLine-1;i<ev.endLine;i++)if(/^\d+(?:\s|$)/.test(lines[i].text))starts.push(i);
    if(starts.length!==20)throw new Error('Core d20 table boundaries changed');
    const outcomes=[];
    for(let i=0;i<starts.length;i++){
      const start=starts[i],end=(starts[i+1]??ev.endLine),face=Number(lines[start].text.match(/^\d+/)![0]);
      if(face!==i+1)throw new Error('Core result numbering changed');
      const text=lines.slice(start,end).map(l=>l.text).join('\n').replace(/^\d+\s*/,'').trim();
      const id=`core:${n}:${face}`,evidenceId=await proof(`thing:${id}`,CORRECTION,start+1,end,CORE);
      outcomes.push(ThingOutcomeSchema.parse({id,tableId,face,sourceId:CORE,evidenceIds:[evidenceId],text,mappingStatus:'verified-md',reviewNotes:[],details:details(id)}));
    }
    const tableEvidence=await proof(`table:${tableId}`,CORRECTION,ev.startLine,ev.endLine,CORE);
    tables.push({id:tableId,title:`Interesting Things Table ${n}`,sourceId:CORE,evidenceIds:[tableEvidence],dice:{count:1,sides:20},outcomes});
  }
  const supplementEvidence=await proof('oddities:whole-section',GENERAL,56431,57846,ODD);
  const raw=sourceLines((await read(GENERAL)).toString('utf8'));
  for(const t of odditiesTables){
    if(t.spans.length!==20)throw new Error('Supplement table must preserve 20 positions');
    const id=`oddities:${t.id}`,outcomes=[];
    for(let i=0;i<20;i++){
      const face=i+1,span=t.spans[i],key=`${t.id}:${face}`,outcomeId=`${id}:${face}`;
      const text=span?raw.slice(span[0]-1,span[1]).map(l=>l.text).join('\n'):null;
      const evidenceId=span?await proof(`thing:${outcomeId}`,GENERAL,...span,ODD):supplementEvidence;
      const note=!span?'Personal Stuff 1–4 have detached numbers and four unassigned descriptions. Do not infer a bijection from extraction order.':uncertainPairings[key];
      outcomes.push(ThingOutcomeSchema.parse({id:outcomeId,tableId:id,face,sourceId:ODD,evidenceIds:[evidenceId],text,
        mappingStatus:note?'needs-review':'reconstructed-md',reviewNotes:note?[note]:[],details:details(outcomeId)}));
    }
    tables.push({id,title:t.title,sourceId:ODD,evidenceIds:[supplementEvidence],dice:{count:1,sides:20},outcomes});
  }
  const unassigned=[];
  for(let i=0;i<unassignedPersonal.length;i++)unassigned.push({id:`personal-unassigned-${i+1}`,candidateFaces:[1,2,3,4],
    evidenceId:await proof(`unassigned:personal:${i+1}`,GENERAL,...unassignedPersonal[i],ODD),reason:'Detached columns; requires layout review or corrected transcription.'});
  // Apply the user's numbered transcription as an overlay; preserve raw MD evidence and IDs.
  const correctionManifest=JSON.parse((await read(ODD_MANIFEST)).toString('utf8'));
  if(correctionManifest.sha256!==ODD_HASH||correctionManifest.path!==ODD_CORRECTION||sha(await read(ODD_CORRECTION))!==ODD_HASH)throw new Error('Oddities correction changed');
  const correctedLines=sourceLines((await read(ODD_CORRECTION)).toString('utf8'));
  const headings=odditiesTables.filter(t=>correctionManifest.tables.includes(t.id)).map(t=>({id:t.id,title:t.title}));
  if(headings.length!==6)throw new Error('Missing corrected table identity');
  let correctedOutcomes=0;
  const resolvedAssociations:{outcomeId:string;evidenceIds:string[];previousReason:string}[]=[];
  for(const heading of headings){
    const positions=correctedLines.flatMap((l,i)=>l.text.trim()===heading.title?[i]:[]);
    if(positions.length!==1)throw new Error('Duplicate or missing corrected heading');
    const start=positions[0],next=correctedLines.findIndex((l,i)=>i>start&&headings.some(h=>h.title===l.text.trim()));
    const end=next<0?correctedLines.length:next,starts:number[]=[];
    for(let i=start+1;i<end;i++)if(/^\d+\s/.test(correctedLines[i].text))starts.push(i);
    if(starts.length!==20)throw new Error('Corrected table lacks 20 numbered rows');
    const table=tables.find(t=>t.id===`oddities:${heading.id}`)!;
    const tableProof=await proof(`correction:table:${heading.id}`,ODD_CORRECTION,start+1,end,ODD);
    table.evidenceIds.unshift(tableProof);
    for(let i=0;i<20;i++){
      const rowStart=starts[i],rowEnd=starts[i+1]??end,face=Number(correctedLines[rowStart].text.match(/^\d+/)![0]);
      if(face!==i+1)throw new Error('Corrected outcome numbering changed');
      const original=table.outcomes[i],ref=await proof(`correction:${original.id}`,ODD_CORRECTION,rowStart+1,rowEnd,ODD);
      const text=correctedLines.slice(rowStart,rowEnd).map(l=>l.text).join('\n').replace(/^\d+\s*/,'').trim();
      const replacement=ThingOutcomeSchema.parse({...original,text,evidenceIds:[ref,...original.evidenceIds],mappingStatus:'verified-user-text',reviewNotes:[]});
      if(original.mappingStatus==='needs-review')resolvedAssociations.push({outcomeId:original.id,evidenceIds:replacement.evidenceIds,previousReason:original.reviewNotes.join(' ')});
      table.outcomes[i]=replacement;correctedOutcomes++;
    }
  }
  if(correctedOutcomes!==120||resolvedAssociations.length!==13)throw new Error('Correction did not resolve all intended associations');
  const coreInstructions=await proof('instructions:core',CORRECTION,1,7,CORE);
  const expandedInstructions=await proof('instructions:oddities',GENERAL,56548,56575,ODD);
  const expandedSelector=await proof('selector:oddities',GENERAL,56485,56575,ODD);
  const petContext=await proof('context:pets',GENERAL,56986,56989,ODD);
  const peopleContext=await proof('context:people',GENERAL,57171,57179,ODD);
  const ingredientsContext=await proof('context:ingredients',GENERAL,57650,57655,ODD);
  const catalog=InterestingThingsCatalogSchema.parse({defaultVariant:'oddities',variants:[
    {id:'core',sourceId:CORE,selectorId:'core:thing-router',selectorEvidenceIds:[coreInstructions],selectorSides:6,
      routes:Array.from({length:6},(_,i)=>({min:i+1,max:i+1,tableId:`core:thing-${i+1}`}))},
    {id:'oddities',sourceId:ODD,selectorId:'oddities:thing-router',selectorEvidenceIds:[expandedSelector,expandedInstructions],selectorSides:20,
      routes:odditiesTables.map(t=>({min:t.ranges[0],max:t.ranges[1],tableId:`oddities:${t.id}`}))},
  ],tables});
  const knownEvidence=new Set(evidence.map(e=>e.id));
  if(knownEvidence.size!==evidence.length)throw new Error('Duplicate evidence identity');
  const sourceIds=new Set(sources.sources.map((s:{id:string})=>s.id));
  for(const t of catalog.tables)for(const o of t.outcomes){
    if(!sourceIds.has(o.sourceId)||o.evidenceIds.some(id=>!knownEvidence.has(id)))throw new Error('Unresolved outcome provenance');
    if(o.details.dependencySourceId&&!sourceIds.has(o.details.dependencySourceId))throw new Error('Unresolved external source identity');
  }
  const grants=[
    {id:'core-initial-thing',variantContext:'core-character-creation',count:1,additional:false,evidenceId:coreInstructions},
    {id:'only-human-initial-thing',variantContext:'only-human-character-creation',count:1,additional:false,evidenceId:await proof('grant:only-human-initial',ANCESTRY,14440,14449,'sotdl:only-human')},
    {id:'only-human-minor-windfall-10',variantContext:'only-human:minor-windfall:10',count:1,additional:true,evidenceId:await proof('grant:only-human-extra',ANCESTRY,14116,14116,'sotdl:only-human')},
  ];
  const inputRefs=[];
  for(const path of ['curation/pilot/wealth-equipment.json','curation/reports/wealth-equipment.json','curation/pilot/creation-table-inventory.json',
    'curation/sources.json','curation/input-manifest.json',GENERAL,ANCESTRY,CORRECTION,ODD_CORRECTION,ODD_MANIFEST,
    'tools/curation/interesting-things-map.ts','tools/curation/interesting-things-details.ts','tools/curation/interesting-things-formalizer.ts','tools/curation/interesting-things.mjs','packages/curation/interesting-things-model.ts'])inputRefs.push({path,sha256:sha(await read(path))});
  const outcomes=catalog.tables.flatMap(t=>t.outcomes);
  const formalization={schemaVersion:1,task:'CUR-019',reviewDate:'2026-10-27',status:'structured-reference-mapping-resolved',
    gates:{importablePack:false,runtimeIntegrated:false,officialGenerationEnabled:false,mechanicalHandlersImplemented:false},
    policy:{authority:'explicit-user-instruction',date:'2026-10-27',defaultVariant:'oddities',alternativeVariant:'core',
      independentOfAncestryProcedure:true,replaceOneGrantRatherThanAddTwo:true,preserveCore:true,disabledDefault:'pending-no-silent-fallback',
      reason:'User requested the Interesting Things supplement as default and Core tables as a selectable alternative.'},
    catalog,grants,contextEvidenceIds:[petContext,peopleContext,ingredientsContext],unassigned:[],
    correction:{manifestPath:ODD_MANIFEST,correctedOutcomes,resolvedAssociations,
      resolvedUnassigned:unassigned.map((u,i)=>({...u,resolvedToOutcomeId:`oddities:personal:${i+1}`})),
      previousArtifacts:'curation/history/oddities-before-user-correction-2026-10-27/'},evidence,inputRefs,
    applicationPolicy:{itemLabels:['Item fixo','Incantation de rank 0'],narrativeAndRelationshipsAreNotInventory:true,
      quantitiesAreNotPrices:true,assetWorthIsNotCash:true,creationAndUseRollsSeparate:true,autoEquip:false,autoLearnSpell:false,keepFullConditionalText:true},
    findings:outcomes.filter(o=>o.mappingStatus==='needs-review').map(o=>({outcomeId:o.id,evidenceIds:o.evidenceIds,reason:o.reviewNotes.join(' '),task:'CUR-021',automaticResolution:false})),
    deferred:[
      {id:'dark-passages',task:'future-books-and-passages-generator',reason:'User authorized Books and Scrolls 20 as published text only for now, without a selection blocker. Preserve its disabled hook for random passage/book generation after implementation and explicit enablement; do not generate content now.'},
      {id:'item-catalog-and-conditions',task:'CUR-020/021/027',reason:'Specific objects, abilities, quantities, recharge, triggers, costs and restrictions remain source-backed declarations for catalog/effect handlers or manual adjudication; no effects are activated at creation.'},
      {id:'integration',task:'CUR-033/034/035/036/037',reason:'Wire source policy, per-grant variants, seed/version traces, rerolls, confirmations, inventory, narrative fields and dependencies in the actual creator.'},
    ],nextTask:'CUR-020'};
  const data=JSON.stringify(formalization,null,2)+'\n';
  const report={schemaVersion:1,task:'CUR-019',reviewDate:'2026-10-27',counts:{variants:2,selectors:2,tables:catalog.tables.length,coreOutcomes:120,
    supplementOutcomes:240,totalOutcomes:outcomes.length,mappingReviewOutcomes:formalization.findings.length,unassignedDescriptions:0,correctedOutcomes,resolvedAssociations:resolvedAssociations.length,
    choiceOutcomes:outcomes.filter(o=>o.details.choices.length).length,creationSideRolls:outcomes.flatMap(o=>o.details.sideRolls).filter(r=>r.phase==='creation').length,
    useSideRolls:outcomes.flatMap(o=>o.details.sideRolls).filter(r=>r.phase==='use').length,evidenceRanges:evidence.length},
    inputRefs,outputs:[{path:DATA,sha256:sha(data)}],nextTask:'CUR-020',unchanged:{rawInputs:true,frozenContracts:true,previousDerivatives:true,demoConsumer:true}};
  return {formalization,report,artifacts:new Map([[DATA,data],[REPORT,JSON.stringify(report,null,2)+'\n']])};
}
export async function main(args:string[],root=process.cwd()){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const built=await buildArtifacts(root);
  for(const[path,content]of built.artifacts){if(args[0]==='--check'){if(await readFile(resolve(root,path),'utf8')!==content)throw new Error(`Interesting Things artifact changed: ${path}`);}
    else{await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),content);}}
  console.log(`Interesting Things: ${built.report.counts.totalOutcomes} positions, supplement default, ${built.report.counts.mappingReviewOutcomes} mapping reviews; runtime disabled. ${args[0]}`);
}
