import type {ThingDetails} from '../../packages/curation/interesting-things-model';

// Semantic annotations are curated separately from physical extraction. Strings are labels,
// not catalog IDs; no automatic item effects or spells are inferred from these labels.
const alternatives:Record<string,string[]>={
  'core:1:4':['Curious odor','Pungent stench','Skin condition'],
  'core:1:7':['Small magnet','Silver mirror'],'core:1:8':['Party invitation','Masquerade mask'],
  'core:1:14':['Glass eye','Bezoar'],'core:1:15':['Unknown-language book','Book of unwanted knowledge'],
  'core:2:1':['Flute','Panpipes','Other musical instrument'],'core:2:5':['Mouse','Squirrel','Rabbit'],
  'core:2:6':['Monocle','Heavy goggles'],'core:2:14':['Sweet perfume','Rotgut'],
  'core:2:16':['Scratched iron coin','Steel coin with dragon heads'],'core:2:20':['Brush','Comb','Umbrella'],
  'core:3:1':['Soap','Towel'],'core:3:3':['Tiny portrait','Lock of hair','Other favor'],
  'core:3:5':['Brace of conies','Pack with pots and pans'],'core:3:6':['Silver-headed arrow','Silver-headed bolt'],
  'core:3:7':['Half treasure map','Foreign land map','Blue map with circles and writing'],
  'core:3:9':['Light shield','Heavy shield'],'core:3:12':['Silver holy symbol','Fine religious icon'],
  'core:3:13':['Rocks','Acorns','Severed heads','Mushrooms'],
  'core:3:16':['Saliva jar','Sack of rotting chicken parts','Unseemly scar'],
  'core:3:17':['Teeth bag','Ears necklace','Severed heads tied by hair'],
  'core:4:2':['Boots: sneak boon','Gray cloak: hide boon'],'core:4:9':['Cigars box','Pipe and tobacco pouch'],
  'core:5:1':['Grease jar','Glue bottle'],'core:6:9':['Wagon with donkey','Cart with donkey'],
  'core:6:11':['Tremor','Facial tic','Irritating laugh'],
  'oddities:art:13':['Sword','Other weapon'],
  'oddities:people:6':['Little brother','Little sister'],'oddities:people:7':['Parent','Grandparent'],
  'oddities:qualities:8':['Key-shaped mark','Baby-shaped mark','Crown-shaped mark'],
  'oddities:qualities:11':['Extra finger','Extra toe'],'oddities:qualities:14':['Stained fingers','Stained lips'],
  'oddities:weird:14':['Stone','Gem'],
};
type Roll=ThingDetails['sideRolls'][number];
const dice=(id:string,count:number,sides:number,phase:'creation'|'use',purpose:string,modifier=0,optionId:string|null=null):Roll=>({id,count,sides,modifier,phase,purpose,optionId});
const rolls:Record<string,Roll[]>={
  'core:2:13':[dice('nails',1,20,'creation','Iron nails in box')],
  'core:2:17':[dice('brushes',1,6,'creation','Brushes in box',1)],
  'core:3:13':[dice('contents',2,6,'creation','Number of selected contents')],
  'core:3:17':[dice('teeth',3,6,'creation','Teeth in bag',0,'option-1'),dice('ears',1,6,'creation','Ears on necklace',0,'option-2'),dice('heads',1,6,'creation','Severed heads',0,'option-3')],
  'core:4:5':[dice('ink',1,6,'creation','Bottles of ink')],
  'core:5:3':[dice('pockets',2,20,'creation','Hidden pockets; not additional cloaks')],
  'core:5:11':[dice('dust',1,6,'creation','Pinches of stone-softening dust',1)],
  'core:5:14':[dice('dust',1,6,'creation','Pinches of diamond dust',1)],
  'oddities:consumables:4':[dice('duration',1,20,'use','Shadowsight duration in minutes per eye drop')],
  'oddities:consumables:7':[dice('rutabagas',1,20,'creation','Vegetables in bag')],
  'oddities:consumables:8':[dice('pills',1,20,'creation','Pills in box'),dice('duration',1,20,'use','Duration in hours per pill')],
  'oddities:consumables:9':[dice('duration',1,6,'use','Invisible epidermis and horrifying trait, minutes')],
  'oddities:consumables:11':[dice('people-fed',5,20,'use','People fed for a day when divided')],
  'oddities:consumables:13':[dice('oysters',2,20,'creation','Oysters in jar')],
  'oddities:consumables:18':[dice('height',1,6,'use','Levitation height in yards')],
  'oddities:minor-magic:9':[dice('duration',1,6,'use','Transformation duration in rounds')],
  'oddities:minor-magic:11':[dice('years',1,20,'use','Years taken from the drinker; not starting age')],
  'oddities:minor-magic:17':[dice('keys',1,6,'creation','Single-use keys on keychain',1)],
  'oddities:personal:7':[dice('years',1,20,'creation','Years captive in faerie; mortal time did not pass')],
  'oddities:tools:18':[dice('extra-damage',1,6,'use','Extra damage to objects; not creation damage')],
};
const quantities:Record<string,[number,string,string][]>={
  'core:1:18':[[6,'cake','Contents; nourishment until next dawn']],
  'core:3:2':[[100,'foot','Length of twine']], 'core:3:15':[[100,'marble','Contents']],
  'core:3:19':[[6,'candle','Contents']], 'core:4:7':[[20,'yard','Rope length']],
  'core:4:12':[[10,'pound','Weight of flour']], 'core:4:15':[[6,'chalk-stick','Contents']],
  'core:6:10':[[3,'mouse','Companions']], 'core:6:13':[[3,'yard','Extended pole length']],
  'oddities:books:11':[[3,'book','Distinct subjects: beekeeping, horticulture, etiquette']],
  'oddities:consumables:3':[[6,'pie','Contents'],[5,'pie','Wholesome subset'],[1,'pie','Rancid subset; poisoned until rest']],
  'oddities:consumables:4':[[6,'drop','Available doses']],
  'oddities:minor-magic:5':[[10,'gallon','Maximum water capacity']],
  'oddities:minor-magic:9':[[2,'use','Uses before completing a rest']],
  'oddities:minor-magic:10':[[3,'use','Clay uses; tiny constructs are not controlled']],
  'oddities:minor-magic:11':[[1,'use-per-creature-ever','Chalice restriction']],
  'oddities:minor-magic:12':[[3,'use','Fog charges']],
  'oddities:minor-magic:13':[[1,'use','Use before completing a rest']],
  'oddities:pets:2':[[2,'ferret','Companions']],
  'oddities:ingredients:4':[[5,'grain','Sand in jar']], 'oddities:ingredients:8':[[100,'nail-clipping','Contents']],
  'oddities:ingredients:15':[[11,'herb-or-spice','Contents']], 'oddities:ingredients:17':[[9,'spider','Dried spiders']],
  'oddities:tools:16':[[100,'nail','Contents']], 'oddities:weird:2':[[2,'stone','Vibrating stones']],
};
const narrative=new Set(['core:1:4','core:1:20','core:2:11','core:5:8','core:5:20',
  ...[1,6,7,11,14,15,16,18,20].map(n=>`core:6:${n}`)]);
const companion=new Set(['core:2:5','core:3:11','core:3:18','core:3:20','core:6:5','core:6:10','core:6:19']);
const mixed=new Set(['core:3:16','core:4:18','core:5:9','core:6:9']);
// Mechanic tags aid review and dispatch; source text remains the authoritative complete condition.
const mechanisms:Record<string,string[]>={
  'core:1:18':['consumable-nourishment'], 'core:4:1':['light'], 'core:4:2':['conditional-boon'],
  'core:4:7':['indestructibility'], 'core:4:14':['conditional-light'], 'core:5:3':['container-capacity'],
  'core:5:4':['conditional-vision'], 'core:5:5':['container-capacity'], 'core:5:10':['continuous-light','gm-choice'],
  'core:5:11':['consumable-terrain-change'], 'core:5:12':['daily-recovery'], 'core:6:3':['appearance-change'],
  'core:6:17':['armor-classification','non-stacking'],
  'oddities:art:10':['asset-worth','shrinking'], 'oddities:art:18':['partial-obscurement'],
  'oddities:books:20':['future-generator-reference'], 'oddities:clothing:11':['fire-proof'],
  'oddities:consumables:3':['poisoned-until-rest','nourishment'], 'oddities:consumables:4':['shadowsight','limited-doses'],
  'oddities:consumables:5':['acid-neutralization','consumption-fraction'],
  'oddities:consumables:8':['timed-effect'], 'oddities:consumables:9':['horrifying-trait','timed-effect'],
  'oddities:consumables:10':['water-to-stone'], 'oddities:consumables:11':['nourishment'],
  'oddities:consumables:12':['action','strength-challenge','short-range','poisoned'],
  'oddities:consumables:14':['allergen-immunity-24-hours'], 'oddities:consumables:15':['self-refilling'],
  'oddities:consumables:16':['concentration-challenge-boon-1-hour'], 'oddities:consumables:17':['permanent-appearance-change'],
  'oddities:consumables:18':['levitation','minor-activity','fall'],
  'oddities:minor-magic:3':['conditional-damage'], 'oddities:minor-magic:5':['capacity','release-lever'],
  'oddities:minor-magic:8':['trackless'], 'oddities:minor-magic:9':['transformation','rest-recovery'],
  'oddities:minor-magic:10':['action','uncontrolled-construct','limited-uses'],
  'oddities:minor-magic:11':['heal-all-damage','age-cost','once-ever'],
  'oddities:minor-magic:12':['minor-activity','heavy-obscurement','wind-dispersal','limited-uses'],
  'oddities:minor-magic:13':['rest-recovery'], 'oddities:minor-magic:16':['action','ladder','pickup-reversion'],
  'oddities:minor-magic:17':['single-use-key','conditional-access'], 'oddities:minor-magic:18':['conditional-fire'],
  'oddities:minor-magic:19':['unknown-fuel','gm-resolution'],
  'oddities:minor-magic:20':['underwater-breathing','perception-3-banes'],
  'oddities:people:9':['does-not-accompany'], 'oddities:people:13':['unspecified-debt'],
  'oddities:personal:7':['faerie-time-distinction'], 'oddities:tools:1':['one-in-twenty-on-use'],
  'oddities:tools:18':['extra-damage-objects-only'], 'oddities:weird:2':['distance-thresholds'],
  'oddities:weird:7':['replication-hazard'], 'oddities:weird:14':['one-voice-at-a-time'],
};
export function details(key:string):ThingDetails{
  const category=key.split(':')[1];
  const kind=key==='oddities:books:20'?'text-reference':key.startsWith('oddities:personal:')||key.startsWith('oddities:qualities:')||narrative.has(key)?'narrative':
    key.startsWith('oddities:pets:')?'companion':key.startsWith('oddities:people:')?'relationship':companion.has(key)?'companion':mixed.has(key)?'mixed':'object';
  return {kind,choices:alternatives[key]?[{id:'form',options:alternatives[key].map((text,i)=>({id:`option-${i+1}`,text}))}]:[],
    sideRolls:rolls[key]??[],quantities:(quantities[key]??[]).map(([amount,unit,meaning])=>({amount,unit,meaning})),
    declaredWorth:key==='core:2:19'||key==='oddities:art:10'?{amount:'1',denomination:'ss',bits:'100',spendable:false}:null,
    dependencySourceId:key==='oddities:books:20'?'sotdl:dark-passages':null,
    futureGenerator:key==='oddities:books:20'?{id:'dark-passages-books-and-passages',enabled:false,strategy:'random',outputKinds:['passage','book'],activation:'after-implementation-and-explicit-enablement'}:null,
    mechanismTags:mechanisms[key]??[],
    contextRules:category==='pets'?['Pets cannot fight or do much useful; companionship and resilience are narrative permissions, not a combat stat block.']:
      category==='people'?['Commoners unless otherwise mentioned; relationships and debts are not owned inventory.']:
      category==='ingredients'?['GM may determine a use; do not invent recipes or spell benefits.']:[],
    gmChoice:['core:3:8','core:5:10'].includes(key),
    application:'manual-adjudication',mechanicalEffectsApplied:false};
}
