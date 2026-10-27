import {readFileSync} from 'node:fs';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,dirname,basename} from 'node:path';
import {describe,it,expect} from 'vitest';
import {PilotItemCatalogSchema,ItemPriceSchema,previewArmorDefinition,previewWeaponDefinition,quotePublishedLots} from '../packages/curation/pilot-item-model';
import {buildArtifacts,main} from '../tools/curation/pilot-items-formalizer';

const DATA='curation/pilot/items.json',REPORT='curation/reports/pilot-items.json';
const data=JSON.parse(readFileSync(DATA,'utf8'));
const catalog=PilotItemCatalogSchema.parse(data.catalog);
const item=(key:string)=>catalog.items.find(i=>i.id===`pilot-item:core:${key}`)!;
const ref=(label:string)=>catalog.references.find(r=>r.label===label&&r.originKind==='starting-grant')!;

describe('CUR-020 minimum pilot item catalog',()=>{
  it('covers every grant leaf and every Interesting Thing without flattening alternatives or losing source identity',()=>{
    const equipment=JSON.parse(readFileSync('curation/pilot/wealth-equipment.json','utf8'));
    const expected:string[]=[];
    const walk=(p:string,nodes:any[],prefix:string)=>{for(const n of nodes){const path=`${prefix}/${n.key}`;
      if(n.kind==='choice'){for(const o of n.options)walk(p,o.grants,`${path}/${o.id}`);}else expected.push(`item-ref:grant:${p}/${path}`);}};
    for(const p of equipment.programs)walk(p.id,p.grants,'grant');
    expect(catalog.references.filter(r=>r.originKind==='starting-grant').map(r=>r.id)).toEqual(expected);
    const things=JSON.parse(readFileSync('curation/pilot/interesting-things.json','utf8'));
    expect(catalog.references.filter(r=>r.originKind==='interesting-thing').map(r=>r.originId)).toEqual(things.catalog.tables.flatMap((t:any)=>t.outcomes.map((o:any)=>o.id)));
    expect(catalog.references).toHaveLength(641);expect(catalog.items).toHaveLength(409);
    expect(ref('healer’s kit').sourceId).toBe('sotdl:shadow-of-the-demon-lord-core');
    const expanded=catalog.references.find(r=>r.label==='healer’s kit'&&r.sourceId==='sotdl:only-human')!;
    expect(expanded.itemId).toBe(item('healer-kit').id);expect(expanded.sourceId).not.toBe(item('healer-kit').sourceId);
  });
  it('quotes printed lots exactly and never treats 20 stones or a week of food as single-unit prices',()=>{
    expect(quotePublishedLots(item('stones'),4)).toMatchObject({bits:'200',quantity:'20',unit:'stone',purchased:false});
    expect(quotePublishedLots(item('arrows'),2)).toMatchObject({bits:'100',quantity:'10',unit:'arrow'});
    expect(item('arrows').sourceText).toContain('Arrows (5)');expect(item('stones').sourceText).toContain('Stones (5)');
    expect(quotePublishedLots(item('rope'),1)).toMatchObject({bits:'10',quantity:'20',unit:'yard'});
    expect(quotePublishedLots(item('rations'),1)).toMatchObject({bits:'10',quantity:'1',unit:'week'});
    expect(item('candle').price.bits).toBe('1');expect(item('healing-potion').price.bits).toBe('200');
    expect(()=>quotePublishedLots(item('arrows'),0.2)).toThrow();
  });
  it('keeps minimum, variable and missing prices distinct from exact prices and zero',()=>{
    expect(item('instrument').price.kind).toBe('minimum');expect(item('clothing').price.kind).toBe('variable');
    const generic=catalog.items.find(i=>i.id===ref('fine clothing').itemId)!;
    expect(generic.price).toMatchObject({kind:'unknown',amount:null,bits:null});expect(generic.availability).toBeNull();
    expect(()=>quotePublishedLots(item('instrument'),1)).toThrow(/exact/);expect(()=>quotePublishedLots(generic,1)).toThrow(/exact/);
    expect(()=>ItemPriceSchema.parse({...item('candle').price,bits:'10'})).toThrow(/exact currency/);
    expect(()=>ItemPriceSchema.parse({...generic.price,bits:'0'})).toThrow(/not zero/);
  });
  it('uses replacement armor formulas and cumulative heavy-armor penalties instead of fictitious additive bonuses',()=>{
    expect(previewArmorDefinition(item('soft-leather'),{strength:8,agility:12,worn:true})).toMatchObject({defense:13,speedPenalty:0,strengthAgilityBanes:0});
    expect(item('soft-leather').armor?.classification).toBe('clothing');
    expect(previewArmorDefinition(item('brigandine'),{strength:11,agility:16,worn:true}).defense).toBe(13);
    expect(previewArmorDefinition(item('mail'),{strength:12,agility:16,worn:true})).toMatchObject({defense:15,speedPenalty:-2,strengthAgilityBanes:1,swimArmorBanes:1});
    expect(previewArmorDefinition(item('full-plate'),{strength:14,agility:16,worn:true})).toMatchObject({defense:18,speedPenalty:-4,strengthAgilityBanes:1,swimArmorBanes:2});
    expect(previewArmorDefinition(item('full-plate'),{strength:15,agility:16,worn:true}).speedPenalty).toBe(-2);
    expect(previewArmorDefinition(item('full-plate'),{strength:8,agility:16,worn:false})).toMatchObject({defense:null,speedPenalty:0,applied:false});
    expect(previewArmorDefinition(item('basic-clothing'),{strength:8,agility:12,worn:true}).defense).toBe(12);
  });
  it('preserves weapon damage, requirements, range, ammunition and shield wielding conditions',()=>{
    expect(item('axe').weapon?.damage).toEqual({count:1,sides:6,modifier:1});expect(item('staff').weapon?.hands).toBe('two');
    expect(item('dagger').weapon).toMatchObject({range:'short',hands:'off',properties:['finesse','thrown','range (short)']});
    expect(item('sling').weapon).toMatchObject({range:'medium',ammunition:'stones'});expect(item('bow').weapon).toMatchObject({range:'long',ammunition:'arrows'});
    expect(item('military-sword-pick').weapon?.damage).toEqual({count:1,sides:6,modifier:2});
    expect(previewWeaponDefinition(item('small-shield'),{strength:8,agility:12,wielded:true})).toMatchObject({defenseBonus:1,attackBanes:1});
    expect(previewWeaponDefinition(item('small-shield'),{strength:8,agility:12,wielded:false})).toMatchObject({defenseBonus:0,attackBanes:0});
    expect(previewWeaponDefinition(item('swift-small-sword'),{strength:8,agility:11,wielded:true}).attackBanes).toBe(0);
  });
  it('does not resolve generic shields, spear profiles or split bit-and-bridle costs by guessing',()=>{
    expect(ref('spear')).toMatchObject({resolution:'choice-required',itemId:null,candidateItemIds:[item('basic-spear').id,item('military-spear').id]});
    expect(item('basic-spear').weapon?.requirement.attribute).toBe('none');expect(item('military-spear').weapon?.requirement.minimum).toBe(11);
    expect(ref('shield').resolution).toBe('choice-required');
    for(const label of ['horse bit (tack, not currency)','bridle','pick','short sword']){
      const r=ref(label),i=catalog.items.find(i=>i.id===r.itemId)!;expect(r.resolution).toBe('generic-editable');expect(i.price.kind).toBe('unknown');expect(i.weapon).toBeNull();
    }
    expect(item('bit-and-bridle').price).toMatchObject({bits:'10',per:{quantity:1,unit:'bundle'}});
  });
  it('preserves resources, asset worth, companion kinds and special outcomes without assigning ordinary profiles',()=>{
    expect(item('healer-kit').resources).toEqual([{quantity:6,unit:'use',recovery:'not-specified'}]);
    expect(ref('raw goods').declaredWorth).toMatchObject({denomination:'ss'});
    expect(catalog.items.find(i=>i.id===ref('raw goods').itemId)?.price.kind).toBe('unknown');
    expect(ref('personal servant').recordKind).toBe('companion');expect(ref('small house in town').recordKind).toBe('property');
    const armor=catalog.items.find(i=>i.id==='pilot-item:thing:core:6:17')!;
    expect(armor.armor).toBeNull();expect(armor.sourceText).toContain('not cumulative');expect(armor.automaticEffects).toBe(false);
    const special=data.interestingThingSemantics.find((o:any)=>o.outcomeId==='oddities:minor-magic:20');
    expect(special.details.mechanismTags).toContain('perception-3-banes');
    expect(catalog.references.find(r=>r.originId==='oddities:books:20')).toMatchObject({resolution:'non-inventory',itemId:null,recordKind:'text-reference'});
    expect(data.interestingThingSemantics.find((o:any)=>o.outcomeId==='oddities:books:20').details.futureGenerator.enabled).toBe(false);
  });
  it('rejects dangling, duplicated and falsely resolved references',()=>{
    const clone=()=>structuredClone(catalog);
    const missing=clone();missing.references[0].itemId='missing';expect(()=>PilotItemCatalogSchema.parse(missing)).toThrow(/Dangling/);
    const duplicate=clone();duplicate.items.push(duplicate.items[0]);expect(()=>PilotItemCatalogSchema.parse(duplicate)).toThrow(/Duplicate/);
    const ambiguous=clone(),r=ambiguous.references.find(r=>r.resolution==='choice-required')!;r.itemId=r.candidateItemIds[0];expect(()=>PilotItemCatalogSchema.parse(ambiguous)).toThrow(/Ambiguous/);
    const cash=clone(),m=cash.references.find(r=>r.resolution==='currency-preserved')!;m.itemId=cash.items[0].id;expect(()=>PilotItemCatalogSchema.parse(cash)).toThrow(/Non-item/);
  });
  it('reproduces all artifacts and resolves every evidence link with all generation gates disabled',async()=>{
    const built=await buildArtifacts(process.cwd());for(const[path,content]of built.artifacts)expect(readFileSync(path,'utf8')).toBe(content);
    const evidence=new Set(data.evidence.map((e:any)=>e.id));
    for(const i of catalog.items)for(const id of [...i.evidenceIds,...i.ruleEvidenceIds])expect(evidence.has(id)).toBe(true);
    expect(Object.values(data.gates)).toEqual([false,false,false,false,false]);
  },30000);
  it('rejects changed inputs and outputs without overwriting reviewed artifacts',async()=>{
    const root=await mkdtemp(join(tmpdir(),'sotdl-pilot-items-'));
    try{
      const paths=new Set([DATA,REPORT]);
      for(const path of [DATA,'curation/pilot/interesting-things.json','curation/pilot/wealth-equipment.json','curation/pilot/professions-languages.json','curation/pilot/creation-table-inventory.json','curation/pilot/human-ancestry.json','curation/pilot/core-level-zero.json']){
        for(const ref of JSON.parse(readFileSync(path,'utf8')).inputRefs)paths.add(ref.path);
      }
      for(const path of paths){await mkdir(dirname(resolve(root,path)),{recursive:true});await copyFile(path,resolve(root,path));}
      await main(['--check'],root);await writeFile(resolve(root,DATA),'tampered\n');
      await expect(main(['--check'],root)).rejects.toThrow(/artifact changed/);
      await writeFile(resolve(root,'curation/pilot/interesting-things.json'),'stale dependency\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Stale CUR-019/);
      expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');
    }finally{
      if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('sotdl-pilot-items-'))throw new Error('Unexpected scratch path');
      await rm(root,{recursive:true,force:true});
    }
  },30000);
});
