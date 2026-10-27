// Explicit Core equipment rows relevant to the pilot and its directed armor/weapon choices.
// Price/availability extraction is performed against these pinned physical line ranges.
export const gearRows:[string,string,string,number,number,number,string][]=[
  ['cap','Cap','apparel',3316,3316,1,'item'],['cloak','Cloak','apparel',3318,3318,1,'item'],
  ['basic-clothing','Basic clothing','apparel',3319,3319,1,'set'],['courtier-clothing','Courtier’s clothing','apparel',3321,3321,1,'set'],
  ['noble-clothing','Noble’s clothing','apparel',3323,3323,1,'set'],['simple-costume','Simple costume','apparel',3327,3327,1,'item'],
  ['elaborate-costume','Elaborate costume','apparel',3326,3326,1,'item'],['basic-dress','Basic dress','apparel',3328,3328,1,'item'],
  ['fancy-dress','Fancy dress','apparel',3329,3329,1,'item'],['spectacles','Spectacles','apparel',3341,3341,1,'item'],
  ['uniform','Uniform','apparel',3348,3348,1,'set'],
  ['backpack','Backpack','gear',3355,3355,1,'item'],['blanket','Blanket','gear',3358,3358,1,'item'],
  ['candle','Candle','gear',3360,3360,1,'item'],['cards','Cards','gear',3361,3361,1,'deck'],
  ['dice','Dice','gear',3366,3366,1,'printed-entry'],['lantern','Lantern','gear',3370,3370,1,'item'],
  ['manacles','Manacles','gear',3372,3372,1,'printed-entry'],['map','Map','gear',3373,3373,1,'item'],
  ['oil','Oil','gear',3376,3376,1,'flask'],['pouch','Pouch','gear',3380,3380,1,'item'],
  ['rations','Rations','gear',3383,3383,1,'week'],['rope','Coil of rope','gear',3384,3384,20,'yard'],
  ['sack','Sack','gear',3385,3385,1,'item'],['tinderbox','Tinderbox','gear',3388,3388,1,'item'],
  ['torch','Torch','gear',3389,3389,1,'item'],['waterskin','Waterskin','gear',3390,3390,1,'item'],
  ['printed-book','Printed book or tome','tool',3445,3445,1,'book'],['disguise-kit','Disguise kit','tool',3448,3448,1,'kit'],
  ['garrote','Garrote','tool',3449,3449,1,'item'],['healer-kit','Healer’s kit','tool',3450,3450,1,'kit'],
  ['holy-symbol','Holy symbol','tool',3452,3452,1,'item'],['implement','Implement of magic','tool',3455,3455,1,'item'],
  ['lock-picks','Lock picks','tool',3457,3457,1,'printed-entry'],['instrument','Musical instrument','tool',3459,3459,1,'item'],
  ['tool-kit','Tool kit','tool',3464,3464,1,'kit'],['torturer-tools','Torturer’s tools','tool',3465,3465,1,'printed-entry'],
  ['writing-kit','Writing kit','tool',3466,3466,1,'kit'],['rotgut','Rotgut','consumable',3572,3572,1,'printed-entry'],
  ['bit-and-bridle','Bit and bridle','animal-gear',3581,3581,1,'bundle'],['horse','Horse, mule, or pony','animal',3585,3585,1,'creature'],
  ['saddle','Saddle','animal-gear',3586,3586,1,'item'],['healing-potion','Healing potion','consumable',3722,3722,1,'potion'],
  ['incantation-rank-0','Incantation de rank 0','incantation',3704,3704,1,'incantation'],
  ['arrows','Arrows','ammunition',3142,3142,5,'arrow'],['stones','Stones','ammunition',3146,3146,5,'stone'],
];
export const armorRows:[string,string,number,string,number,number|null][]=[
  ['clothing','Clothing',3062,'clothing',0,null],['soft-leather','Soft leather',3063,'clothing',1,null],
  ['hard-leather','Hard leather',3065,'light',2,11],['brigandine','Brigandine',3066,'light',13,11],
  ['mail','Mail',3068,'medium',15,13],['scale','Scale',3069,'medium',16,13],
  ['plate-and-mail','Plate and mail',3071,'heavy',17,15],['full-plate','Full plate',3072,'heavy',18,15],
];
// key, name, first/last line, required attribute, minimum. Distinct Spear profiles remain separate.
export const weaponRows:[string,string,number,number,string,number|null][]=[
  ['axe','Axe',3175,3175,'none',null],['club','Club',3176,3176,'none',null],
  ['dagger','Dagger or knife',3177,3177,'none',null],['basic-spear','Sickle or spear',3181,3181,'none',null],
  ['staff','Staff',3182,3182,'none',null],['bow','Bow',3187,3187,'none',null],
  ['sling','Sling',3193,3193,'none',null],['small-shield','Small shield',3196,3196,'strength',9],
  ['large-shield','Large shield',3197,3197,'strength',11],['military-sword-pick','Battleaxe, flail, morning star, pick, or sword',3200,3202,'strength',11],
  ['mace','Mace',3205,3205,'strength',11],['military-spear','Spear',3208,3208,'strength',11],
  ['swift-small-sword','Chain, cutlass, long knife, scourge, or small sword',3212,3214,'strength-or-agility',11],
];
export const ruleSpans:[string,number,number][]=[
  ['currency',2861,2878],['availability',2881,2895],['carrying',2896,2920],
  ['armor',2982,3004],['armor-time',3009,3014],['armor-table',3059,3072],['weapon-table',3172,3220],['weapon-requirements',3079,3106],
  ['weapon-properties',3107,3128],['weapon-size-and-ammunition',3129,3168],
  ['candle',3259,3262],['lantern',3263,3267],['oil',3278,3289],['torch',3294,3297],
  ['clothing',3298,3312],['garrote',3404,3410],['healer-kit',3411,3416],
  ['implement',3428,3433],['lock-picks',3438,3440],['lock-picks-continuation',3493,3496],
  ['disguise-start',3481,3488],['disguise-continuation',3395,3403],['instrument',3500,3504],
  ['tool-kit',3541,3542],['torturer-tools',3543,3554],['potion-use',3593,3606],
  ['healing-potion',3660,3663],['incantations',3680,3701],
];
export const specificRuleIds:Record<string,string[]>={
  candle:['candle'],lantern:['lantern'],oil:['oil'],torch:['torch'],'garrote':['garrote'],
  'healer-kit':['healer-kit'],'implement':['implement'],'lock-picks':['lock-picks','lock-picks-continuation'],
  'disguise-kit':['disguise-start','disguise-continuation'],instrument:['instrument'],'tool-kit':['tool-kit'],
  'torturer-tools':['torturer-tools'],'healing-potion':['potion-use','healing-potion'],'incantation-rank-0':['incantations'],
};
// Curated exact links, not fuzzy name matching. All other labels receive explicit review records.
export const exactLinks:Record<string,string>={
  club:'club',sling:'sling','sling stones':'stones',pouch:'pouch',staff:'staff',sack:'sack',waterskin:'waterskin',tinderbox:'tinderbox',candle:'candle',
  dagger:'dagger','basic clothing':'basic-clothing',backpack:'backpack',rations:'rations',torch:'torch',cloak:'cloak','coil of rope':'rope',
  'healing potion':'healing-potion','small shield':'small-shield','rank 0 incantation':'incantation-rank-0','rank 0 incantations':'incantation-rank-0',
  'healer’s kit':'healer-kit','tool kit':'tool-kit','writing kit':'writing-kit','courtier’s clothing':'courtier-clothing',lantern:'lantern',oil:'oil',
  'noble’s clothing':'noble-clothing',horse:'horse',saddle:'saddle',blanket:'blanket',cap:'cap',uniform:'uniform',dice:'dice',cards:'cards',
  'musical instrument':'instrument',rotgut:'rotgut','lock picks':'lock-picks','disguise kit':'disguise-kit',garrote:'garrote',manacles:'manacles',
  'torturer’s tools':'torturer-tools',sword:'military-sword-pick','soft leather armor':'soft-leather','symbol of faith':'holy-symbol',mace:'mace',
  bow:'bow',arrow:'arrows',axe:'axe',
};
export const ambiguousLinks:Record<string,string[]>={
  spear:['basic-spear','military-spear'],shield:['small-shield','large-shield'],
  costume:['simple-costume','elaborate-costume'],dress:['basic-dress','fancy-dress'],
};
