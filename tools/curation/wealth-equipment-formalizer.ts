import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {GrantProgramSchema,type GrantNode,type Quantity} from '../../packages/curation/starting-equipment-model';
import {buildArtifacts as buildProfessions} from './professions-languages-formalizer';
import {sourceLines} from './ancestry-extractor';

const DATA='curation/pilot/wealth-equipment.json',REPORT='curation/reports/wealth-equipment.json';
const CORE='sotdl:shadow-of-the-demon-lord-core',EXPANDED='sotdl:only-human';
const GENERAL='rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md',ANCESTRY='rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const D=(count=1,sides=6,modifier=0):Quantity=>({kind:'dice',count,sides,modifier});
const V=(value:number):Quantity=>({kind:'constant',value});
const R=(key:string,sourceLabel:string,amount:number|Quantity=1,unit='item',recordKind:'item'|'companion'|'vehicle'|'property'|'entitlement'|'incantation'='item',worth:{amount:Quantity;denomination:'bits'|'cp'|'ss'|'gc'}|null=null):GrantNode=>
  ({kind:'record',key,sourceLabel,quantity:typeof amount==='number'?V(amount):amount,unit,recordKind,worth});
const M=(key:string,amount:Quantity,denomination:'bits'|'cp'|'ss'|'gc'):GrantNode=>({kind:'money',key,amount,denomination});
const C=(key:string,alternatives:[string,GrantNode[]][]):GrantNode=>({kind:'choice',key,options:alternatives.map(([id,grants])=>({id,label:id.replaceAll('-',' '),grants}))});
const weapon=(destitute=false)=>C('weapon',[
  ...(!destitute?[['staff',[R('staff','staff')]]as[string,GrantNode[]]]:[]),
  ['club',[R('club','club')]],['sling',[R('sling','sling'),R('stones','sling stones',20,'stone')]],
]);
const special=(small:boolean)=>C('special',[['shield',[R('shield',small?'small shield':'shield')]],['incantation',[R('incantation','rank 0 incantation',1,'incantation','incantation')]],
  ['healers-kit',[R('healers-kit','healer’s kit')]],['tool-kit',[R('tool-kit','tool kit')]],['writing-kit',[R('writing-kit','writing kit')]]]);
const rations=()=>R('rations','rations',1,'week');
const moneySpec:{[key:string]:[Quantity,'bits'|'cp'|'ss']}={destitute:[D(),'bits'],poor:[D(2),'bits'],'getting-by':[D(),'cp'],comfortable:[D(2),'cp'],wealthy:[D(),'ss'],rich:[D(2),'ss']};

export async function buildArtifacts(root:string){
  const parent=await buildProfessions(root);
  for(const[path,text]of parent.artifacts)if(await readFile(resolve(root,path),'utf8')!==text)throw new Error(`Stale CUR-017 dependency: ${path}`);
  const professions=parent.formalization,inventory=JSON.parse(await readFile(resolve(root,'curation/pilot/creation-table-inventory.json'),'utf8'));
  const pilot=JSON.parse(await readFile(resolve(root,'curation/pilot/core-level-zero.json'),'utf8'));
  const evidence=new Map<string,unknown>(professions.evidence.map((e:any)=>[e.id,e]));
  for(const table of inventory.tables)evidence.set(table.evidence.id,table.evidence);
  const proof=async(id:string,path:string,startLine:number,endLine:number,sourceId:string)=>{
    const bytes=await readFile(resolve(root,path)),excerpt=sourceLines(bytes.toString('utf8')).slice(startLine-1,endLine).map(l=>l.text).join('\n');
    evidence.set(id,{id,path,startLine,endLine,sourceId,inputSha256:sha(bytes),excerpt,excerptSha256:sha(excerpt),physicalPdfPage:null,printedPageVerified:null});return id;
  };
  await proof('currency:core-rates',GENERAL,2862,2872,CORE);
  const programs:ReturnType<typeof GrantProgramSchema.parse>[]=[],lifestylePrograms:{procedure:string;lifestyle:string;programId:string}[]=[];
  const add=(id:string,sourceId:string,evidenceIds:string[],context:string,grants:GrantNode[])=>{
    for(const ref of evidenceIds)if(!evidence.has(ref))throw new Error(`Missing equipment evidence: ${ref}`);
    programs.push(GrantProgramSchema.parse({id,sourceId,evidenceIds,context,grants}));return id;
  };
  const coreKits:{[key:string]:GrantNode[]}={
    destitute:[weapon(true),R('rags','rags'),R('pouch','pouch')],
    poor:[weapon(),R('clothing','patched basic clothing'),R('sack','sack'),R('bread','bread'),R('waterskin','waterskin'),R('tinderbox','tinderbox'),R('candle','candle'),R('pouch','pouch')],
    'getting-by':[R('dagger','dagger'),weapon(),R('clothing','basic clothing'),R('backpack','backpack'),rations(),R('waterskin','waterskin'),R('tinderbox','tinderbox'),R('torches','torch',2),R('pouch','pouch')],
    comfortable:[R('dagger','dagger'),weapon(),R('clothing','fine clothing'),R('backpack','backpack'),R('cloak','cloak'),rations(),R('waterskin','waterskin'),R('rope','coil of rope'),R('tinderbox','tinderbox'),R('torches','torch',2),R('potion','healing potion'),special(true),R('pouch','pouch')],
    wealthy:[R('dagger','dagger'),R('clothing','courtier’s clothing'),R('cloak','cloak'),R('backpack','backpack'),rations(),R('waterskin','waterskin'),R('rope','coil of rope'),R('tinderbox','tinderbox'),R('lantern','lantern'),R('oil','oil',2,'flask'),R('potion','healing potion'),special(false),R('pouch','pouch')],
    rich:[R('dagger','dagger'),R('clothing','noble’s clothing'),R('cloak','cloak'),rations(),R('waterskin','waterskin'),R('potion','healing potion'),R('servant','personal servant',1,'person','companion'),R('guard','guard',1,'person','companion'),R('horses','horse',3,'creature','companion'),R('saddles','saddle',3),R('pouch','pouch')],
  };
  const coreSpans:{[key:string]:[number,number]}={destitute:[319,321],poor:[322,325],'getting-by':[326,329],comfortable:[382,388],wealthy:[389,400],rich:[401,405]};
  for(const[lifestyle,grants]of Object.entries(coreKits)){
    const ref=await proof(`equipment:core:${lifestyle}`,GENERAL,...coreSpans[lifestyle],CORE),[amount,denom]=moneySpec[lifestyle];
    const programId=add(`core:kit:${lifestyle}`,CORE,[ref],'core-starting-kit',[...grants,M('starting-money',amount,denom)]);
    lifestylePrograms.push({procedure:'core',lifestyle,programId});
  }
  const expandedKits:{[key:string]:GrantNode[]}={
    destitute:[R('rags','soiled rags'),R('blanket','blanket'),weapon(true)],
    poor:[R('clothing','patched threadbare basic clothing'),R('cloak','ratty cloak'),weapon(),R('sack','sack'),R('bread','bread',1,'loaf'),R('waterskin','waterskin filled with water'),R('tinderbox','tinderbox'),R('candle','candle')],
    'getting-by':[R('clothing','basic clothing'),R('cloak','cloak'),R('dagger','dagger'),weapon(),R('backpack','backpack'),rations(),R('waterskin','waterskin filled with water'),R('rope','coil of rope'),R('tinderbox','tinderbox'),R('torches','torch',2)],
    comfortable:[R('clothing','well-made basic clothing',D(1,3),'set'),R('cloak','fine cloak'),R('dagger','dagger'),weapon(),R('backpack','backpack'),rations(),R('waterskin','waterskin filled with water'),R('rope','coil of rope'),R('tinderbox','tinderbox'),R('torches','torch',2),R('potion','healing potion'),special(true)],
    wealthy:[R('clothing','well-made basic clothing',D(1,3),'set'),R('noble-clothing','noble’s clothing',1,'set'),R('cloak','fine cloak'),R('dagger','dagger'),R('backpack','backpack'),rations(),R('waterskin','waterskin filled with water'),R('rope','coil of rope'),R('tinderbox','tinderbox'),R('lantern','lantern'),R('oil','oil',2,'flask'),R('potion','healing potion'),special(true)],
    rich:[R('clothing','noble’s clothing',D(1,3),'set'),R('cloak','fine cloak'),R('dagger','dagger'),R('potion','healing potion'),R('servant','personal servant, as commoner',1,'person','companion'),R('guard','guard, as mercenary',1,'person','companion'),R('horses','horse',3,'creature','companion'),R('horse-bits','horse bit (tack, not currency)',3),R('bridles','bridle',3),R('saddles','saddle',3)],
  };
  const expandedRefs=['clothing','weapons','personal-gear','special-gear','money'].map(k=>`table:only-human:${k}`);
  for(const[lifestyle,grants]of Object.entries(expandedKits)){
    const[amount,denom]=moneySpec[lifestyle];
    const programId=add(`only-human:kit:${lifestyle}`,EXPANDED,expandedRefs,'expanded-lifestyle-five-lookups',[...grants,M('starting-money',amount,denom)]);
    lifestylePrograms.push({procedure:'only-human',lifestyle,programId});
  }
  const common:{[n:number]:GrantNode[]}={
    1:[R('healers-kit','healer’s kit')],2:[R('tool-kit','tool kit')],3:[C('artist-kit',[['tool-kit',[R('tool-kit','tool kit')]],['writing-kit',[R('writing-kit','writing kit')]]])],
    4:[M('coins',D(),'cp')],5:[C('begging-container',[['bowl',[R('bowl','begging bowl')]],['cap',[R('cap','cap')]]])],6:[R('rowboat','rowboat',1,'vehicle','vehicle')],7:[R('uniform','uniform')],
    8:[R('extra-clothing','extra clothing',1,'set')],9:[R('cosmetics-kit','cosmetics kit')],10:[R('staff','staff')],
    11:[C('entertainer-clothing',[['costume',[R('costume','costume')]],['dress',[R('dress','dress')]],['fine-clothing',[R('fine-clothing','fine clothing')]]])],
    12:[C('farm-tool',[['hoe',[R('hoe','hoe')]],['shovel',[R('shovel','shovel')]],['rake',[R('rake','rake')]]])],
    13:[C('fishing-gear',[['pole-and-tackle',[R('pole','fishing pole'),R('tackle-box','tackle box')]],['harpoon',[R('harpoon','harpoon')]]])],
    14:[C('gaming-gear',[['dice',[R('dice','dice',1,'pair')]],['cards',[R('cards','cards',1,'deck')]]])],
    15:[C('labor-gear',[['backpack',[R('backpack','backpack')]],['shovel',[R('shovel','shovel')]],['rope',[R('rope','coil of rope')]],['gm-item',[R('gm-item','other profession-appropriate item chosen by GM')]]])],
    16:[R('raw-goods','raw goods',1,'lot','item',{amount:D(),denomination:'ss'})],17:[R('pick','pick')],18:[R('instrument','musical instrument')],19:[M('coins',D(),'cp')],20:[M('coins',D(2),'bits')],
  };
  const criminal:{[n:number]:GrantNode[]}={1:[R('pamphlets','pamphlets',D(),'pamphlet')],3:[R('rotgut','rotgut',1,'bottle'),R('wanted-poster','wanted poster')],5:[R('lock-picks','lock picks',1,'set')],7:[R('disguise-kit','disguise kit')],9:[M('coins',D(),'cp')],11:[R('tool-kit','tool kit')],13:[M('coins',D(),'bits')],15:[R('garrote','garrote')],17:[R('purse','stolen purse'),M('coins',D(),'cp')],19:[R('rope','coil of rope')]};
  const military:{[n:number]:GrantNode[]}={1:[R('lantern','lantern'),R('oil','oil',1,'flask')],3:[R('spear','spear'),R('uniform','uniform')],5:[R('club','club'),R('uniform','uniform')],7:[C('jail-gear',[['manacles',[R('manacles','manacles',1,'pair')]],['tools',[R('tools','torturer’s tools')]]])],9:[R('sword','sword')],11:[R('sword','sword'),R('contract','contract for last job')],13:[R('uniform','fancy uniform'),R('sword','sword')],15:[R('lantern','lantern'),R('oil','oil',1,'flask')],17:[R('uniform','uniform'),R('shield','small shield'),R('sword','sword')],19:[R('sword','short sword'),R('armor','soft leather armor')]};
  const wilderness:{[n:number]:GrantNode[]}={1:[R('animal','small friendly animal',1,'creature','companion')],3:[R('healers-kit','healer’s kit')],5:[R('staff','staff')],7:[R('map','map of region')],9:[rations(),R('waterskin','waterskin')],11:[R('bow','bow'),R('arrows','arrow',12)],13:[R('horse','horse',1,'creature','companion')],15:[R('lantern','lantern'),R('pick','pick'),R('oil','oil',2,'flask')],17:[R('spear','spear')],19:[R('axe','axe')]};
  const professionPrograms=[];
  for(const o of professions.options){
    if(o.sourceFamily==='core'||!o.range){professionPrograms.push({optionId:o.id,programId:null,reason:'No additional material gain declared by this option; do not copy another source’s profession gear or infer a book for a direct grant.'});continue;}
    const n=o.range.min;
    const grants=o.category==='scholarship'?[R('book','book related to area of scholarship')]:o.category==='religious'?[R('faith-symbol','symbol of faith'),...(n===4?[R('mace','mace')]:[])]:
      ({common,criminal,military,wilderness}as{[k:string]:{[n:number]:GrantNode[]}})[o.category]?.[n];
    if(!grants)throw new Error(`Missing equipment program for profession: ${o.id}`);
    const programId=add(`profession:${o.id}`,EXPANDED,o.evidenceIds,'pc-profession-grant-only',grants);professionPrograms.push({optionId:o.id,programId,reason:'Apply only when actually granted to the player character; family profession alone does not grant PC gear.'});
  }
  const addExtra=async(id:string,path:string,start:number,end:number,sourceId:string,grants:GrantNode[])=>{
    const ref=await proof(`equipment:${id}`,path,start,end,sourceId);return add(id,sourceId,[ref],'additional-published-material-reward',grants);
  };
  const extraPrograms=[];
  extraPrograms.push({trigger:'core:human-background:20',programId:await addExtra('extra:core-background-20',ANCESTRY,14820,14822,CORE,[M('bonus-coins',D(2),'cp')])});
  const extra:[string,number,number,GrantNode[]][]=[
    ['minor-windfall-8',14113,14113,[R('horse','horse',1,'creature','companion')]],
    ['minor-windfall-13',14123,14123,[R('potion','healing potion')]],
    ['minor-windfall-15',14126,14127,[R('gm-item','weapon or implement chosen by GM')]],
    ['minor-windfall-16',14128,14129,[R('armor','soft leather armor')]],
    ['minor-windfall-17',14130,14132,[R('friend','lifelong friend, as commoner',1,'person','companion')]],
    ['minor-windfall-19',14138,14141,[R('medal','medal',1,'item','item',{amount:V(1),denomination:'ss'})]],
    ['major-windfall-5',14162,14163,[R('enchanted-item','enchanted object chosen by GM')]],
    ['major-windfall-6',14164,14167,[C('property',[['house',[R('house','small house in town',1,'property','property')]],['farm',[R('farm','farm in wilderness',1,'property','property')]]])]],
    ['major-windfall-7',14168,14169,[R('deed','deed to sailing ship',1,'property','property')]],
    ['major-windfall-8',14170,14171,[R('lands','deed to lands chosen by GM',1,'property','property')]],
    ['major-windfall-9',14172,14173,[R('book','book of spells'),R('incantations','rank 0 incantations',D(1,3,1),'incantation','incantation')]],
    ['major-windfall-10',14174,14175,[R('case','case'),R('potions','potions chosen by GM',D(1,3,1))]],
    ['major-windfall-14',14187,14190,[R('soldier','soldier companion, as mercenary',1,'person','companion')]],
    ['major-windfall-15',14191,14194,[R('stipend','stipend for wealthy lifestyle; rich lifestyle expense reduced by 1 gc',1,'entitlement','entitlement')]],
    ['major-windfall-16',14195,14196,[C('gift',[['armor',[R('armor','suit of armor of your choice')]],['weapon',[R('weapon','weapon of your choice')]]])]],
    ['major-windfall-17',14197,14198,[R('construct','small loyal construct',1,'creature','companion')]],
    ['major-windfall-19',14203,14207,[R('token','token of appreciation',1,'item','item',{amount:V(1),denomination:'gc'})]],
  ];
  for(const[id,start,end,grants]of extra)extraPrograms.push({trigger:`only-human:${id}`,programId:await addExtra(`extra:${id}`,ANCESTRY,start,end,EXPANDED,grants)});
  extraPrograms.push({trigger:'only-human:major-windfall-1',condition:'Terrible Beauty not in use; otherwise resolve the published random favor instead',
    programId:await addExtra('extra:major-windfall-1-fallback',ANCESTRY,14149,14152,EXPANDED,[R('enchanted-item','enchanted object chosen by GM')])});
  if(new Set(programs.map(p=>p.id)).size!==programs.length)throw new Error('Duplicate starting-grant identity');
  const modifierEvidence=[];for(const[key,start,end]of [['life',13960,13963],['major-setback',13984,14006],['minor-setback',14047,14085],['minor-windfall',14093,14112],['major-windfall',14160,14194]]as[string,number,number][])
    modifierEvidence.push(await proof(`lifestyle-modifier:${key}`,ANCESTRY,start,end,EXPANDED));
  const inputRefs=[];for(const path of ['curation/pilot/professions-languages.json','curation/reports/professions-languages.json','curation/pilot/creation-table-inventory.json','curation/pilot/core-level-zero.json','tools/curation/wealth-equipment-formalizer.ts','tools/curation/wealth-equipment.mjs','packages/curation/starting-equipment-model.ts'])inputRefs.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const dataObject={schemaVersion:1,task:'CUR-018',reviewDate:'2026-10-27',status:'structured-reference-only',
    gates:{importablePack:false,runtimeIntegrated:false,officialGenerationEnabled:false,autoPurchase:false,autoEquip:false},
    currency:{publishedBase:'ss',storageBase:'bits',serializedType:'unsigned-integer-string',bitsPerUnit:{bits:'1',cp:'10',ss:'100',gc:'1000'},evidenceIds:['currency:core-rates'],
      itemWorthIsSpendableMoney:false,quantityIsPrice:false},
    lifestyleRules:{core:pilot.wealthScope.ranges,expanded:inventory.tables.find((t:any)=>t.id==='only-human:lifestyle').evidence,
      expandedRanges:[{min:null,max:3,lifestyle:'destitute'},{min:4,max:5,lifestyle:'poor'},{min:6,max:12,lifestyle:'getting-by'},{min:13,max:15,lifestyle:'comfortable'},{min:16,max:17,lifestyle:'wealthy'},{min:18,max:null,lifestyle:'rich'}],
      modifiers:[{tableId:'only-human:life',results:[9,10,11,12],delta:1,evidenceId:'lifestyle-modifier:life'},
        {tableId:'only-human:major-setback',results:[5,8],delta:-3,evidenceId:'lifestyle-modifier:major-setback'},
        {tableId:'only-human:major-setback',results:[10],delta:-1,evidenceId:'lifestyle-modifier:major-setback'},
        {tableId:'only-human:minor-setback',results:[4,10,19],delta:-1,evidenceId:'lifestyle-modifier:minor-setback'},
        {tableId:'only-human:minor-windfall',results:[2,7],delta:1,evidenceId:'lifestyle-modifier:minor-windfall'},
        {tableId:'only-human:major-windfall',results:[4,13],delta:3,evidenceId:'lifestyle-modifier:major-windfall'}],
      modifierEvidenceIds:modifierEvidence,otherLifeEffectsApplied:false,procedure:'Roll three d6, then add only the applicable ordered lifestyle modifiers; expanded uses open tails. Core has no expanded modifiers.'},
    programs,lifestylePrograms,professionPrograms,extraPrograms,itemPolicy:pilot.creationDecisions.decisions.inventory,evidence:[...evidence.values()],inputRefs,
    deferred:[
      {id:'conditional-faerie-reward',task:'CUR-021',reason:'Major Windfall 1 grants a random favor if Terrible Beauty is used, otherwise an enchanted object chosen by GM. Preserve source availability branch; do not grant both or invent favor data.'},
      {id:'non-material-life-effects',task:'CUR-021/027',reason:'State, Fortune, tradition, social benefits, appearance, death escape and connections remain their original contextual effects; this material ledger does not execute them.'},
      {id:'profession-appropriateness',task:'CUR-020/021',reason:'Style/GM-dependent items and physical catalog requirements remain editable records without invented price, armor bonus or actions.'},
      {id:'runtime-and-persistence',task:'CUR-033/034/035/036/037',reason:'Integrate exact currency, choices, source events, side-roll traces, typed records and later edits; reference preview is not a production wallet or inventory handler.'},
      {id:'interesting-things',task:'CUR-019',reason:'One initial Interesting Thing and explicit extra results are separate grants; do not apply all tables or remove their effects using generic item labels.'},
    ],nextTask:'CUR-019'};
  const data=JSON.stringify(dataObject,null,2)+'\n',report={schemaVersion:1,task:'CUR-018',reviewDate:'2026-10-27',counts:{lifestylePrograms:12,professionPrograms:66,additionalPrograms:extraPrograms.length,totalPrograms:programs.length,evidenceRanges:evidence.size},
    inputRefs,outputs:[{path:DATA,sha256:sha(data)}],nextTask:'CUR-019'};
  return{formalization:dataObject,report,artifacts:new Map([[DATA,data],[REPORT,JSON.stringify(report,null,2)+'\n']])};
}
export async function main(args:string[],root=process.cwd()){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const r=await buildArtifacts(root);for(const[path,text]of r.artifacts){if(args[0]==='--check'){if(await readFile(resolve(root,path),'utf8')!==text)throw new Error(`Wealth/equipment artifact changed: ${path}`);}else{await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),text);}}
  console.log(`Wealth/equipment: ${r.report.counts.lifestylePrograms} kits, ${r.report.counts.professionPrograms} profession grants; exact currency, runtime disabled. ${args[0]}`);
}
