import { assertSafeArtifact } from './privacy.mjs';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {ProfessionOptionSchema} from '../../packages/curation/profession-language-model';
import {buildArtifacts as buildInventory} from './creation-table-inventory';
import {transcribeNumericRanges} from './core-pilot-matrix';
import {sourceLines} from './ancestry-extractor';

const DATA='curation/pilot/professions-languages.json',REPORT='curation/reports/professions-languages.json';
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const CORE='sotdl:shadow-of-the-demon-lord-core',EXPANDED='sotdl:only-human';
const PATH='rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
export async function buildArtifacts(root:string){
  const parent=await buildInventory(root);
  for(const [path,data]of parent.artifacts)if(await readFile(resolve(root,path),'utf8')!==data)throw new Error(`Stale CUR-016 dependency: ${path}`);
  const inv=parent.inventory,pilotPath='curation/pilot/core-level-zero.json',pilot=JSON.parse(await readFile(resolve(root,pilotPath),'utf8'));
  const tables=inv.tables,options:ReturnType<typeof ProfessionOptionSchema.parse>[]=[],evidence=new Map<string,unknown>();
  const table=(id:string)=>{const t=tables.find(t=>t.id===id);if(!t)throw new Error(`Profession table missing: ${id}`);evidence.set(t.evidence.id,t.evidence);return t;};
  const optionId=(family:string,category:string,min:number)=>`pilot-profession:${family}:${category}:r${String(min).padStart(2,'0')}`;
  for(const family of ['core','only-human']as const){
    const categories=family==='core'?['academic','common','criminal','martial','religious','wilderness']:['scholarship','common','criminal','military','religious','wilderness'];
    for(const category of categories){
      const t=table(family==='core'?`core:profession-${category}`:`only-human:${category}`),e=t.evidence;
      // Keep the scholarship footnote as a grant for every row, not part of the last outcome.
      const payload=category==='scholarship'?e.excerpt.split('\n').slice(0,13).join('\n'):e.excerpt;
      const ranges=transcribeNumericRanges(payload,t.dice!.sides);
      for(const r of ranges){
        const subchoices:{id:string;label:string;requiresLiteracy:boolean}[]=[],ref=e.id;
        let specialization='none',literacy:null|{abilities:['read','write'];target:'one-already-spoken-language';condition:'always'|'poet-or-writer';evidenceIds:string[]}=null;
        const common=category==='common';
        const special:Record<number,string>=common?(family==='core'?{3:'choose-trade',4:'choose-medium',9:'choose-style',13:'choose-labor',14:'choose-good',16:'choose-instrument'}:{2:'choose-trade',3:'choose-medium',11:'choose-style',15:'choose-labor',16:'choose-good',18:'choose-instrument'}):{};
        specialization=special[r.min]??'none';
        if(specialization==='choose-medium')for(const medium of ['painter','sculptor','poet','writer'])subchoices.push({id:medium,label:medium,requiresLiteracy:family==='only-human'&&['poet','writer'].includes(medium)});
        if(family==='core'&&(category==='academic'||category==='religious'&&[1,3,9,11].includes(r.min)||common&&r.min===4))
          literacy={abilities:['read','write'],target:'one-already-spoken-language',condition:common?'poet-or-writer':'always',evidenceIds:[ref]};
        const equipment:{sourceText:string;evidenceIds:string[];task:'CUR-018';quantity:number|null;genericEditableNamesAllowed:true}[]=[];
        if(family==='only-human'){
          if(category==='scholarship')equipment.push({sourceText:'Add 1 book covering topics related to your area of scholarship.',evidenceIds:[ref],task:'CUR-018',quantity:1,genericEditableNamesAllowed:true});
          else if(category==='religious')equipment.push({sourceText:'You start with a symbol of your faith.',evidenceIds:[ref],task:'CUR-018',quantity:null,genericEditableNamesAllowed:true});
          const start=r.text.search(/You\s+start\s+(?:with|the\s+game\s+with)/);
          if(start>=0)equipment.push({sourceText:r.text.slice(start),evidenceIds:[ref],task:'CUR-018',quantity:null,genericEditableNamesAllowed:true});
        }
        options.push(ProfessionOptionSchema.parse({id:optionId(family,category,r.min),kind:['academic','scholarship'].includes(category)?'scholarship-option':'profession-option',
          sourceFamily:family,sourceId:family==='core'?CORE:EXPANDED,category,tableId:t.id,range:{min:r.min,max:r.max},sourceText:r.text,evidenceIds:[ref],subchoices,specialization,literacy,equipment}));
      }
    }
  }
  const bytes=await readFile(resolve(root,PATH)),lines=sourceLines(bytes.toString('utf8'));
  const proof=(id:string,startLine:number,endLine:number)=>{
    const excerpt=lines.slice(startLine-1,endLine).map(l=>l.text).join('\n');
    const e={id,sourceId:EXPANDED,path:PATH,inputSha256:sha(bytes),startLine,endLine,excerpt,excerptSha256:sha(excerpt),physicalPdfPage:null,printedPageVerified:null};
    evidence.set(id,e);return id;
  };
  const occultProof=proof('profession-language:strange-occult',14229,14231);
  options.push(ProfessionOptionSchema.parse({id:'pilot-profession:only-human:direct:occult',kind:'scholarship-option',sourceFamily:'only-human',sourceId:EXPANDED,
    category:'direct-scholarship',tableId:null,range:null,sourceText:'Add the Occult as an area of scholarship.',evidenceIds:[occultProof],subchoices:[],specialization:'none',literacy:null,equipment:[]}));
  const templates:unknown[]=[];
  const add=(id:string,sourceId:string,start:number,end:number,effect:Record<string,unknown>)=>{
    const ref=proof(`profession-language:${id}`,start,end);templates.push({id,sourceId,kind:'directed-development-grant',evidenceIds:[ref],...effect});
  };
  const grants=(languageId:string,abilities:string[])=>({languageId,abilities});
  const commonSpeech=grants('common-tongue',['speak']),commonLiterate=grants('common-tongue',['speak','read','write']);
  add('childhood-faerie',EXPANDED,13918,13921,{tableId:'only-human:childhood',result:'3-or-less',languages:[commonSpeech,grants('elvish',['speak'])]});
  add('childhood-runaway',EXPANDED,13922,13925,{tableId:'only-human:childhood',result:'4-5',languages:[commonSpeech],professionChoice:{categories:['common','criminal'],count:1}});
  add('childhood-family',EXPANDED,13926,13929,{tableId:'only-human:childhood',result:'6-8',professionGrant:{kind:'inherit-family-profession',orphanFallbackCategories:['common','criminal'],count:1}});
  add('childhood-artisan',EXPANDED,13930,13932,{tableId:'only-human:childhood',result:'9-12',professionChoice:{optionId:optionId('only-human','common',2),specialization:'choose-trade',count:1}});
  add('childhood-education',EXPANDED,13933,13936,{tableId:'only-human:childhood',result:'13-15',languages:[commonLiterate],professionGrant:{kind:'inherit-family-profession',missingFamilyProfession:'manual-resolution-no-invented-fallback'}});
  add('childhood-good-education',EXPANDED,13937,13940,{tableId:'only-human:childhood',result:'16-17',languages:[commonLiterate,grants('high-archaic',['speak','read','write'])],professionRoll:{tableId:'only-human:scholarship',count:1}});
  add('childhood-finest-education',EXPANDED,13941,13947,{tableId:'only-human:childhood',result:'18-or-more',languages:[commonLiterate,grants('high-archaic',['speak','read','write'])],professionRoll:{tableId:'only-human:scholarship',count:1},
    additionalChoice:{count:1,options:[{optionId:optionId('only-human','common',3),allowedSubchoices:['painter','poet','writer']},{optionId:optionId('only-human','common',18),specialization:'instrument'}]},sequence:'Language grants precede the artist literacy prerequisite.'});
  add('major-setback-pressed-service',EXPANDED,14009,14013,{tableId:'only-human:major-setback',result:12,professionChoice:{count:1,options:[
    {optionId:optionId('only-human','military',17),specialization:'soldier'},{optionId:optionId('only-human','common',19),specialization:'sailor'},{optionId:optionId('only-human','criminal',3),specialization:'pirate'}]}});
  add('windfall-language',EXPANDED,14100,14101,{tableId:'only-human:minor-windfall',result:4,languageChoice:{count:1,abilities:['speak'],target:'additional-language'}});
  add('windfall-education',EXPANDED,14107,14110,{tableId:'only-human:minor-windfall',result:6,exclusiveChoice:[{languageChoice:{count:1,abilities:['speak']}},{professionRoll:{tableId:'only-human:scholarship',count:1}}]});
  add('windfall-common-profession',EXPANDED,14114,14115,{tableId:'only-human:minor-windfall',result:9,professionRoll:{tableId:'only-human:common',count:1}});
  add('windfall-orator',EXPANDED,14133,14137,{tableId:'only-human:minor-windfall',result:18,professionGrant:{optionId:optionId('only-human','common',11),specialization:'orator',ifNotAlreadyPresent:true}});
  add('windfall-soldier',EXPANDED,14138,14141,{tableId:'only-human:minor-windfall',result:19,professionGrant:{optionId:optionId('only-human','military',17),specialization:'soldier'}});
  add('strange-faerie-language',EXPANDED,14213,14220,{tableId:'only-human:strange',result:1,languages:[grants('elvish',['speak'])]});
  add('strange-occult',EXPANDED,14229,14231,{tableId:'only-human:strange',result:4,professionGrant:{optionId:'pilot-profession:only-human:direct:occult'}});
  add('strange-previous-lives',EXPANDED,14283,14286,{tableId:'only-human:strange',result:17,countRoll:{count:1,sides:3},professionRoll:{tableId:'only-human:profession-router',repeat:'one-per-remembered-life'}});
  add('strange-dwarfish',EXPANDED,14287,14288,{tableId:'only-human:strange',result:18,languages:[grants('dwarfish',['speak','read','write'])]});
  // Core background references are copied from their actual Core evidence, never from an expanded result with a similar story.
  const coreBackground=pilot.evidence.find((e:{id:string})=>e.id==='human-background');evidence.set(coreBackground.id,coreBackground);
  templates.push({id:'core-background-travel',sourceId:CORE,tableId:'core:human-background',result:13,evidenceIds:[coreBackground.id],languageChoice:{count:1,abilities:['speak']}});
  templates.push({id:'core-background-education',sourceId:CORE,tableId:'core:human-background',result:14,evidenceIds:[coreBackground.id],languages:[{languageId:'common-tongue',abilities:['read'],requirePreviouslySpoken:true}]});
  for(const id of ['human-language','human-expansion-attributes','supplied-profession-procedure','northern-language-names','northern-language-open']){
    const e=pilot.evidence.find((e:{id:string})=>e.id===id);if(!e)throw new Error(`Language evidence missing: ${id}`);evidence.set(id,e);
  }
  const ids=new Set(options.map(o=>o.id));if(ids.size!==options.length)throw new Error('Duplicate profession option identity');
  const checkRefs=(v:unknown):void=>{if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(checkRefs);return;}
    for(const [key,value]of Object.entries(v)){if(key==='optionId'&&!ids.has(value as string))throw new Error(`Unknown profession option: ${value}`);else checkRefs(value);}};
  checkRefs(templates);
  const inputRefs=[];
  for(const path of ['curation/pilot/creation-table-inventory.json','curation/reports/creation-table-inventory.json',pilotPath,'tools/curation/professions-languages-formalizer.ts','tools/curation/professions-languages.mjs','packages/curation/profession-language-model.ts'])
    inputRefs.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const formalization={schemaVersion:1,task:'CUR-017',reviewDate:'2026-10-27',status:'structured-not-runtime-enabled',
    gates:{importablePack:false,officialGenerationEnabled:false,stagingPromoted:false,equipmentEffectsImplemented:false},
    options,developmentGrantTemplates:templates,evidence:[...evidence.values()],inputRefs,
    languagePolicy:pilot.languageScope,
    languageOptions:pilot.languageScope.namedLanguages.map((label:string)=>({id:label.toLowerCase().replace(/\s+/g,'-'),label,kind:'language-option',defaultAbilities:['speak'],evidenceIds:['northern-language-names']})),
    startingRights:{core:{professionChoices:2,manualOrRandom:true,ancestryAdditional:'one-language-OR-random-profession-not-both'},
      expanded:{fixedCoreRandomRollsAdded:false,professionGrants:'as-directed-by-development',familyProfessionIsAutomaticallyPCProfession:false},
      exchanges:{professionExchangeCap:null,tableRestrictions:'outside-application-scope',trackOrigins:true,repeatProfessionBanInvented:false,sourceProcedureEvidenceId:'supplied-profession-procedure'}},
    slotSemantics:{professionsArePaths:false,scholarshipIsMagicAccess:false,directOccultIsNotARandomTableRow:true,
      familyCategories:{'6-8':['common','criminal','military','wilderness'],'9-17':['common','military','religious','wilderness'],otherResults:'manual-resolution-no-invented-selector'},
      sourceSpecificDice:{coreReligious:20,expandedReligious:6},
      languageBlocksDoNotStack:true,newLanguageDefault:['speak'],alphabetDoesNotGrantLiteracy:true},
    unresolved:[
      {id:'partial-literacy-prerequisite',taskRefs:['CUR-021','CUR-033'],reason:'Only Human Artist requires literacy for poet/writer. Explicit read+write qualifies; partial read-only/write-only remains manual review rather than an invented automatic rule.'},
      {id:'family-profession-missing-context',taskRefs:['CUR-021'],reason:'Do not invent family category for results without one or silently generalize the orphan fallback to every Childhood result.'},
      {id:'equipment-resolution',taskRefs:['CUR-018','CUR-020'],reason:'Profession equipment text and related-book/symbol grants retained; expand quantities/alternatives as editable generic records without merging sources or inferring prices/effects.'},
      {id:'runtime-integration',taskRefs:['CUR-031','CUR-032','CUR-033','CUR-035','CUR-036'],reason:'Reference selectors, source-specific face resolution and language composition do not activate the current demo or persist actual character events.'},
    ],nextTask:'CUR-018'};
  const data=JSON.stringify(formalization,null,2)+'\n';
  const report={schemaVersion:1,task:'CUR-017',reviewDate:'2026-10-27',counts:{tableOptions:options.filter(o=>o.tableId).length,directOptions:options.filter(o=>!o.tableId).length,
    coreOptions:options.filter(o=>o.sourceFamily==='core').length,expandedOptions:options.filter(o=>o.sourceFamily==='only-human').length,
    literacyGrantingOptions:options.filter(o=>o.literacy).length,developmentTemplates:templates.length,evidenceRanges:evidence.size},inputRefs,outputs:[{path:DATA,sha256:sha(data)}],nextTask:'CUR-018'};
  return {formalization,report,artifacts:new Map([[DATA,data],[REPORT,JSON.stringify(report,null,2)+'\n']])};
}
export async function main(args:string[],root=process.cwd()){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const r=await buildArtifacts(root);
  for(const [path,data]of r.artifacts){ assertSafeArtifact(path, data);if(args[0]==='--check'){if(await readFile(resolve(root,path),'utf8')!==data)throw new Error(`Profession/language artifact changed: ${path}`);}
    else{await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),data);}}
  console.log(`Professions/languages: ${r.report.counts.tableOptions} table options + ${r.report.counts.directOptions} direct grant; runtime disabled. ${args[0]}`);
}
