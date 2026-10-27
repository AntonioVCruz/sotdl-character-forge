import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {buildArtifacts as buildThings} from './interesting-things-formalizer';
import {sourceLines} from './ancestry-extractor';
import {gearRows,armorRows,weaponRows,ruleSpans,specificRuleIds,exactLinks,ambiguousLinks} from './pilot-item-definitions';
import {PilotItemSchema,ItemReferenceSchema,PilotItemCatalogSchema,ItemPriceSchema} from '../../packages/curation/pilot-item-model';
import {moneyToBits,type GrantNode} from '../../packages/curation/starting-equipment-model';

const DATA='curation/pilot/items.json',REPORT='curation/reports/pilot-items.json';
const PATH='rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md',CORE='sotdl:shadow-of-the-demon-lord-core';
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const itemId=(key:string)=>`pilot-item:core:${key}`;
const unknownPrice=(unit='item')=>({kind:'unknown',amount:null,denomination:null,bits:null,per:{quantity:1,unit}});
export async function buildArtifacts(root:string){
  const upstream=await buildThings(root);
  for(const[path,content]of upstream.artifacts)if(await readFile(resolve(root,path),'utf8')!==content)throw new Error(`Stale CUR-019 dependency: ${path}`);
  const equipment=JSON.parse(await readFile(resolve(root,'curation/pilot/wealth-equipment.json'),'utf8'));
  const things=upstream.formalization;
  const bytes=await readFile(resolve(root,PATH)),lines=sourceLines(bytes.toString('utf8')),inputHash=sha(bytes);
  const evidence=new Map<string,unknown>([...equipment.evidence,...things.evidence].map((e:any)=>[e.id,e]));
  const excerpt=(start:number,end:number)=>lines.slice(start-1,end).map(l=>l.text).join('\n');
  const proof=(key:string,startLine:number,endLine:number)=>{
    const id=`item-definition:${key}`,text=excerpt(startLine,endLine);
    if(!text.trim())throw new Error(`Empty equipment evidence ${key}`);
    evidence.set(id,{id,path:PATH,sourceId:CORE,startLine,endLine,inputSha256:inputHash,excerpt:text,excerptSha256:sha(text),physicalPdfPage:null,printedPageVerified:null});return id;
  };
  const rules=ruleSpans.map(([id,start,end])=>({id,evidenceId:proof(`rule:${id}`,start,end),sourceId:CORE,text:excerpt(start,end),application:'reference-only-not-runtime-handler'}));
  const price=(text:string,quantity:number,unit:string)=>{
    const match=text.match(/(\d+(?:\.\d+)?)\s+(bits?|cp|ss|gc)(\+)?(?:\s|$)/);
    if(!match){if(/Varies/.test(text))return ItemPriceSchema.parse({...unknownPrice(unit),kind:'variable'});throw new Error(`Unparsed published item price: ${text}`);}
    const denom=match[2]==='bit'?'bits':match[2];
    return ItemPriceSchema.parse({kind:match[3]?'minimum':'exact',amount:match[1],denomination:denom,bits:moneyToBits(match[1],denom),per:{quantity,unit}});
  };
  const availability=(text:string)=>{
    const token=text.trim().split(/\s+/).at(-1)!;
    return ({C:'common',U:'uncommon',R:'rare',E:'exotic',Common:'common',Uncommon:'uncommon',Rare:'rare',Exotic:'exotic'}as Record<string,string>)[token]??null;
  };
  const items:ReturnType<typeof PilotItemSchema.parse>[]=[],references:ReturnType<typeof ItemReferenceSchema.parse>[]=[];
  const add=(obj:unknown)=>{const p=PilotItemSchema.parse(obj);items.push(p);return p;};
  const base=(key:string,name:string,category:string,start:number,end:number,quantity=1,unit='item')=>{
    const text=excerpt(start,end);return {id:itemId(key),name,sourceId:CORE,evidenceIds:[proof(key,start,end)],category,definitionStatus:'published-core',
      price:price(text,quantity,unit),availability:availability(text),armor:null,weapon:null,resources:[],ruleEvidenceIds:(specificRuleIds[key]??[]).map(r=>`item-definition:rule:${r}`),sourceText:text,
      restrictions:['Source definition only; no automatic purchase, equipment or effects.'],automaticPurchase:false,automaticEffects:false,editable:true};
  };
  for(const[key,name,category,start,end,qty,unit]of gearRows){
    const object=base(key,name,category,start,end,qty,unit);
    const resources=key==='healer-kit'||key==='disguise-kit'?[{quantity:6,unit:'use',recovery:'not-specified'}]:[];
    const clothing=['basic-clothing','courtier-clothing','noble-clothing','uniform'].includes(key);
    add({...object,resources,...(clothing?{armor:{classification:'clothing',defense:{base:'agility',value:0},requiredStrength:null},ruleEvidenceIds:['item-definition:rule:clothing','item-definition:rule:armor']}:{} )});
  }
  for(const[key,name,line,classification,value,strength]of armorRows){
    add({...base(key,name,'armor',line,line,1,'suit'),armor:{classification,defense:{base:['clothing','soft-leather','hard-leather'].includes(key)?'agility':'fixed',value},requiredStrength:strength},
      ruleEvidenceIds:['item-definition:rule:armor','item-definition:rule:armor-time','item-definition:rule:armor-table'],
      restrictions:['Defense replaces the previous Defense; never add the demo armor bonus.','Multiple armor definitions are not summed; special mail clothing from Interesting Things retains its own rule.','Size-based price and equipment-time rules remain the published context.']});
  }
  for(const[key,name,start,end,attribute,minimum]of weaponRows){
    const text=excerpt(start,end).replace(/\n/g,' '),match=text.match(/(\d+d\d+(?:\s*\+\s*\d+)?|\b1)\s+(Off|One|Two)\s+(.+?)\s+\d+\s+(?:cp|ss|gc)\s+[CURE]$/);
    if(!match)throw new Error(`Unparsed weapon row: ${name}`);
    const expr=match[1].match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/),rawProperties=match[3].toLowerCase();
    add({...base(key,name,'weapon',start,end),weapon:{damage:expr?{count:Number(expr[1]),sides:Number(expr[2]),modifier:Number(expr[3]??0)}:{count:0,sides:0,modifier:Number(match[1])},
      hands:match[2].toLowerCase(),requirement:{attribute,minimum},properties:rawProperties==='—'?[]:rawProperties.split(/,\s*/).map(p=>p.trim()),
      range:rawProperties.match(/range \((short|medium|long)\)/)?.[1]??null,ammunition:rawProperties.match(/uses (\w+)/)?.[1]??null,
      defensive:Number(rawProperties.match(/defensive\s*\+(\d+)/)?.[1]??0),reach:Number(rawProperties.match(/reach\s*\+\s*(\d+)/)?.[1]??0)},
      ruleEvidenceIds:['item-definition:rule:weapon-table','item-definition:rule:weapon-requirements','item-definition:rule:weapon-properties','item-definition:rule:weapon-size-and-ammunition']});
  }
  const ordinaryKnown=new Set(items.map(i=>i.id));
  // Never infer a catalog identity from a substring, source label edit or a magical object's name.
  const generics=new Map<string,string>();
  const walk=(program:any,nodes:GrantNode[],prefix:string)=>{for(const node of nodes){
    const path=`${prefix}/${node.key}`;
    if(node.kind==='choice'){for(const option of node.options)walk(program,option.grants,`${path}/${option.id}`);continue;}
    const id=`item-ref:grant:${program.id}/${path}`;
    if(node.kind==='money'){
      references.push(ItemReferenceSchema.parse({id,originKind:'starting-grant',originId:program.id,path,sourceId:program.sourceId,evidenceIds:program.evidenceIds,label:node.denomination,recordKind:'currency',
        resolution:'currency-preserved',itemId:null,candidateItemIds:[],grantQuantity:node.amount,grantUnit:node.denomination,declaredWorth:null,
        reason:'Cash is already formalized in CUR-018; never create an inventory item or a purchase price from it.',creationRecordAllowed:false,automaticMechanicsAllowed:false}));continue;
    }
    const exact=exactLinks[node.sourceLabel],candidates=ambiguousLinks[node.sourceLabel]?.map(itemId)??[];
    let target=exact?itemId(exact):null;
    if(target&&!ordinaryKnown.has(target)||candidates.some(id=>!ordinaryKnown.has(id)))throw new Error('Unknown explicit Core item link');
    // Non-material entities and unspecific source grants get a typed placeholder with no inferred price.
    if(!target&&!candidates.length){
      const key=`${program.sourceId}\0${node.recordKind}\0${node.sourceLabel}`;
      target=generics.get(key)??`pilot-item:grant:${sha(key).slice(0,20)}`;
      if(!generics.has(key)){
        generics.set(key,target);add({id:target,name:node.sourceLabel,sourceId:program.sourceId,evidenceIds:program.evidenceIds,category:'generic-grant',definitionStatus:'source-grant-only',
          price:unknownPrice(node.unit),availability:null,armor:null,weapon:null,resources:[],ruleEvidenceIds:[],sourceText:node.sourceLabel,
          restrictions:[`Grant kind: ${node.recordKind}; preserve quantity, unit, subject and source event.`,
            'No exact definition linked in the selected Core catalog; prices, requirements and mechanical profiles remain unresolved.',
            'Generic editable record allowed; automatic purchase, combat effects and equip validation are blocked until reviewed.'],automaticPurchase:false,automaticEffects:false,editable:true});
      }
    }
    const resolution=exact?'exact-definition':candidates.length?'choice-required':'generic-editable';
    references.push(ItemReferenceSchema.parse({id,originKind:'starting-grant',originId:program.id,path,sourceId:program.sourceId,evidenceIds:program.evidenceIds,label:node.sourceLabel,recordKind:node.recordKind,
      resolution,itemId:target,candidateItemIds:candidates,grantQuantity:node.quantity,grantUnit:node.unit,declaredWorth:node.worth,
      reason:exact?'Explicit curated link to the Core definition; preserve the grant source independently.':candidates.length?'Printed profiles differ; retain candidates without selecting one automatically.':
        'Preserved as a source-backed editable grant; no price or mechanical definition is inferred.',creationRecordAllowed:true,automaticMechanicsAllowed:false}));
  }};
  for(const program of equipment.programs)walk(program,program.grants,'grant');
  for(const table of things.catalog.tables)for(const outcome of table.outcomes){
    const nonItem=['narrative','relationship','text-reference','dependency'].includes(outcome.details.kind),id=`item-ref:thing:${outcome.id}`;
    let target:string|null=null;
    if(!nonItem){target=`pilot-item:thing:${outcome.id}`;add({id:target,name:`${table.title} — ${outcome.face}`,sourceId:outcome.sourceId,evidenceIds:outcome.evidenceIds,
      category:'special-outcome',definitionStatus:'source-outcome-only',price:unknownPrice('outcome-bundle'),availability:null,armor:null,weapon:null,resources:[],ruleEvidenceIds:outcome.evidenceIds,sourceText:outcome.text,
      restrictions:['Preserve the full outcome, alternatives, contents, quantities, resources and conditional effects from CUR-019.',
        'This is an outcome bundle, not an ordinary item profile. No price or base weapon/armor profile is inherited by its name.',
        outcome.details.kind==='mixed'?'Material and non-material alternatives require a branch choice before inventory materialization.':'Specific mechanics require validated handlers or explicit manual adjudication.'],
      automaticPurchase:false,automaticEffects:false,editable:true});}
    references.push(ItemReferenceSchema.parse({id,originKind:'interesting-thing',originId:outcome.id,path:outcome.id,sourceId:outcome.sourceId,evidenceIds:outcome.evidenceIds,label:table.title+' '+outcome.face,recordKind:outcome.details.kind,
      resolution:nonItem?'non-inventory':'special-preserved',itemId:target,candidateItemIds:[],grantQuantity:outcome.details.quantities,grantUnit:nonItem?null:'outcome-bundle',declaredWorth:outcome.details.declaredWorth,
      reason:nonItem?'Narrative, relationship or text reference retained in CUR-019; not a purchasable inventory object.':'Whole source outcome retained, including choices and conditional mechanics; no ordinary item auto-substitution.',
      creationRecordAllowed:!nonItem,automaticMechanicsAllowed:false}));
  }
  const catalog=PilotItemCatalogSchema.parse({items,references});
  const knownEvidence=new Set(evidence.keys());
  for(const item of catalog.items)for(const id of [...item.evidenceIds,...item.ruleEvidenceIds])if(!knownEvidence.has(id))throw new Error(`Missing item evidence: ${id}`);
  for(const ref of catalog.references)for(const id of ref.evidenceIds)if(!knownEvidence.has(id))throw new Error(`Missing reference evidence: ${id}`);
  const inputRefs=[];
  for(const path of ['curation/pilot/interesting-things.json','curation/reports/interesting-things.json','curation/pilot/wealth-equipment.json',PATH,
    'tools/curation/pilot-items-formalizer.ts','tools/curation/pilot-item-definitions.ts','tools/curation/pilot-items.mjs','packages/curation/pilot-item-model.ts'])
    inputRefs.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const formalization={schemaVersion:1,task:'CUR-020',reviewDate:'2026-10-27',status:'reference-catalog-with-explicit-restrictions',
    gates:{importablePack:false,runtimeIntegrated:false,officialGenerationEnabled:false,purchasesEnabled:false,effectsImplemented:false},catalog,rules,
    interestingThingSemantics:things.catalog.tables.flatMap(t=>t.outcomes.map(o=>({outcomeId:o.id,itemRefId:`item-ref:thing:${o.id}`,details:o.details,text:o.text}))),
    bindingPolicy:{sourceSelection:'explicit-curated-links-only',fuzzyMatching:false,grantSourcePreserved:true,missingPriceIsZero:false,assetWorthIsPrice:false,
      incompleteProfile:'generic-editable-record-with-mechanics-and-purchase-restricted',nonInventoryKinds:['narrative','relationship','text-reference','dependency'],
      sizePriceRules:'Published Core armor and weapon rules preserved; quotes are for printed lots before size/material changes, not a checkout.'},
    ambiguities:catalog.references.filter(r=>r.resolution==='choice-required').map(r=>({referenceId:r.id,candidateItemIds:r.candidateItemIds,reason:r.reason})),
    unresolvedDefinitions:catalog.items.filter(i=>i.definitionStatus==='source-grant-only').map(i=>({itemId:i.id,sourceLabel:i.name,restrictions:i.restrictions})),
    evidence:[...evidence.values()],inputRefs,
    deferred:[
      {task:'CUR-021',reason:'Review choices, special outcome bundles and applicability; generic labels do not erase effects or permit invented profiles.'},
      {task:'CUR-027/034',reason:'Implement real equipment, potion, incantation, illumination, resource and combat handlers with published triggers. Reference previews do not activate items.'},
      {task:'CUR-031/032',reason:'Compile by source and validate imports without changing the frozen contracts in this task.'},
      {task:'CUR-033/035/036/037',reason:'Integrate editable typed inventory, source events, persistence, purchases and explicit equip actions; preserve sources and deferred Books 20 hook.'},
    ],nextTask:'CUR-021'};
  const text=JSON.stringify(formalization,null,2)+'\n';
  const count=(mode:string)=>catalog.references.filter(r=>r.resolution===mode).length;
  const report={schemaVersion:1,task:'CUR-020',reviewDate:'2026-10-27',counts:{items:catalog.items.length,publishedCoreDefinitions:items.filter(i=>i.definitionStatus==='published-core').length,
    grantOnlyDefinitions:formalization.unresolvedDefinitions.length,specialOutcomeDefinitions:items.filter(i=>i.definitionStatus==='source-outcome-only').length,
    references:catalog.references.length,startingGrantReferences:catalog.references.filter(r=>r.originKind==='starting-grant').length,interestingThingReferences:360,
    exactReferences:count('exact-definition'),choiceReferences:count('choice-required'),genericReferences:count('generic-editable'),specialReferences:count('special-preserved'),
    nonInventoryReferences:count('non-inventory'),currencyReferences:count('currency-preserved'),rules:rules.length,evidenceRanges:evidence.size},
    inputRefs,outputs:[{path:DATA,sha256:sha(text)}],unchanged:{rawInputs:true,frozenContracts:true,previousDerivatives:true,demoConsumer:true},nextTask:'CUR-021'};
  return {formalization,report,artifacts:new Map([[DATA,text],[REPORT,JSON.stringify(report,null,2)+'\n']])};
}
export async function main(args:string[],root=process.cwd()){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const built=await buildArtifacts(root);
  for(const[path,text]of built.artifacts){if(args[0]==='--check'){if(await readFile(resolve(root,path),'utf8')!==text)throw new Error(`Pilot item artifact changed: ${path}`);}
    else{await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),text);}}
  console.log(`Pilot items: ${built.report.counts.items} definitions, ${built.report.counts.references} references; restrictions explicit, runtime disabled. ${args[0]}`);
}
