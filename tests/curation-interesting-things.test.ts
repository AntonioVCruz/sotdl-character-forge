import {readFileSync} from 'node:fs';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {describe,it,expect} from 'vitest';
import {InterestingThingsCatalogSchema,previewInterestingThing,createInterestingThingsPreview} from '../packages/curation/interesting-things-model';
import {buildArtifacts,main} from '../tools/curation/interesting-things-formalizer';

const DATA='curation/pilot/interesting-things.json',REPORT='curation/reports/interesting-things.json';
const data=JSON.parse(readFileSync(DATA,'utf8')),catalog=InterestingThingsCatalogSchema.parse(data.catalog);
const resolveThing=createInterestingThingsPreview(catalog);
const ODD='sotdl:oddities-artifacts-and-esoterica',CORE='sotdl:shadow-of-the-demon-lord-core';
const outcome=(id:string)=>catalog.tables.flatMap(t=>t.outcomes).find(o=>o.id===id)!;
const manual=(id:string,choices:Record<string,string>={},sideFaces:Record<string,number[]>={})=>resolveThing({
  eventId:'thing-1',variant:id.startsWith('core:')?'core':'oddities',activeSourceIds:[ODD,CORE],selection:{mode:'manual',outcomeId:id},choices,sideFaces});
const faces=(selectorFace:number,outcomeFace:number,variant='oddities')=>resolveThing({
  eventId:'thing-1',variant,activeSourceIds:[ODD,CORE],selection:{mode:'table-faces',selectorFace,outcomeFace},choices:{},sideFaces:{}});

describe('CUR-019 Interesting Things',()=>{
  it('makes the supplement default independently of Human procedure and never silently falls back to Core',()=>{
    const q={eventId:'initial',activeSourceIds:[ODD,CORE],selection:{mode:'table-faces',selectorFace:20,outcomeFace:1},choices:{},sideFaces:{}};
    expect(previewInterestingThing(catalog,q).outcome?.id).toBe('oddities:weird:1');
    const disabled=previewInterestingThing(catalog,{...q,activeSourceIds:[CORE]});
    expect(disabled.outcome).toBeNull();expect(disabled.trace).toEqual([]);expect(disabled.pending[0].kind).toBe('disabled-source');
    expect(data.policy).toMatchObject({independentOfAncestryProcedure:true,replaceOneGrantRatherThanAddTwo:true,preserveCore:true});
    expect(data.grants).toEqual(expect.arrayContaining([expect.objectContaining({id:'only-human-minor-windfall-10',additional:true,count:1})]));
  });
  it('preserves weighted category probabilities across all 400 d20 pairs and parent-child roll identities',()=>{
    const counts:Record<string,number>={};
    for(let selector=1;selector<=20;selector++)for(let row=1;row<=20;row++){
      const r=faces(selector,row);expect(r.outcome?.face).toBe(row);const table=r.outcome!.tableId;counts[table]=(counts[table]??0)+1;
      expect(r.trace[1].parentRollId).toBe(r.trace[0].id);expect(r.trace[0].faces).toEqual([selector]);expect(r.trace[1].faces).toEqual([row]);
    }
    expect(Object.values(counts)).toEqual([40,40,40,40,20,20,20,40,40,40,40,20]);
    const core=new Set<string>();for(let a=1;a<=6;a++)for(let b=1;b<=20;b++)core.add(faces(a,b,'core').outcome!.id);
    expect(core.size).toBe(120);expect(()=>faces(7,1,'core')).toThrow(/published die/);
    expect(()=>faces(21,1)).toThrow();expect(()=>faces(1,0)).toThrow();
  });
  it('keeps manual choices in the selected publication without generating selector rolls',()=>{
    const r=manual('core:1:1');expect(r.trace).toEqual([]);expect(r.outcome?.text).toContain('ticking');
    expect(r.selectionComplete).toBe(true);expect(r.fullyApplied).toBe(false);expect(r.completeCharacter).toBe(false);
    expect(()=>previewInterestingThing(catalog,{eventId:'x',variant:'core',activeSourceIds:[CORE,ODD],selection:{mode:'manual',outcomeId:'oddities:weird:1'},choices:{},sideFaces:{}})).toThrow(/selected source/);
  });
  it('resolves all 13 associations from the supplied numbered transcription and preserves their provenance',()=>{
    expect(data.findings).toEqual([]);expect(data.unassigned).toEqual([]);
    expect(data.correction.correctedOutcomes).toBe(120);expect(data.correction.resolvedAssociations).toHaveLength(13);
    for(const finding of data.correction.resolvedAssociations){
      const r=manual(finding.outcomeId,{},finding.outcomeId==='oddities:minor-magic:17'?{keys:[1]}:{});
      expect(r.selectionComplete).toBe(true);expect(r.pending.some(p=>p.kind==='mapping-review')).toBe(false);
      expect(r.outcome?.mappingStatus).toBe('verified-user-text');expect(r.outcome?.evidenceIds[0]).toMatch(/^correction:/);
    }
    expect([1,2,3,4].map(n=>outcome(`oddities:personal:${n}`).text)).toEqual([
      expect.stringContaining('a song'),expect.stringContaining('one really bad day'),expect.stringContaining('a shadow in the corner'),expect.stringContaining('a criminal record'),
    ]);
    const r=faces(12,1);expect(r.outcome?.id).toBe('oddities:personal:1');expect(r.outcome?.text).toContain('a song');expect(r.trace).toHaveLength(2);
    expect(outcome('oddities:books:11').text).toContain('three books');
    expect(outcome('oddities:art:6').text).toContain('gold coin');
    expect(outcome('oddities:minor-magic:3').text).toContain('glove');expect(outcome('oddities:minor-magic:4').text).toContain('staff');
    expect(outcome('oddities:minor-magic:10').text).toContain('clay');expect(outcome('oddities:minor-magic:11').text).toContain('chalice');
    expect(outcome('oddities:pets:8').text).toContain('duck');expect(outcome('oddities:ingredients:12').text).toContain('petrified wood');
  });
  it('requires one alternative and rolls only its published quantitative branch',()=>{
    expect(manual('core:3:17').pending.some(p=>p.kind==='choice')).toBe(true);
    const ears=manual('core:3:17',{form:'option-2'},{ears:[4]});expect(ears.quantities).toEqual([{id:'ears',amount:4,purpose:'Ears on necklace'}]);
    expect(ears.selectedAlternatives).toHaveLength(1);expect(ears.selectionComplete).toBe(true);
    expect(ears.trace[0].parentRollId).toBeNull();
    expect(()=>manual('core:3:17',{form:'option-2'},{teeth:[1,2,3]})).toThrow(/Unexpected/);
    expect(()=>manual('core:3:17',{form:'all'})).toThrow(/alternative/);
    expect(()=>manual('core:1:1',{imaginary:'option-1'})).toThrow(/does not belong/);
    const brushes=manual('core:2:17',{}, {brushes:[6]});expect(brushes.quantities[0].amount).toBe(7);
    expect(()=>manual('core:2:17',{}, {brushes:[7]})).toThrow(/published dice/);
  });
  it('separates creation quantities from durations, damage and consumable activation rolls',()=>{
    const pills=manual('oddities:consumables:8',{}, {pills:[12]});
    expect(pills.quantities[0].amount).toBe(12);expect(pills.deferredUseRolls[0]).toMatchObject({id:'duration',sides:20,phase:'use'});
    expect(pills.selectionComplete).toBe(true);expect(pills.mechanicalEffectsApplied).toBe(false);
    expect(()=>manual('oddities:consumables:8',{}, {pills:[12],duration:[10]})).toThrow(/use-time/);
    const mask=manual('oddities:minor-magic:9');expect(mask.deferredUseRolls[0].purpose).toContain('rounds');
    expect(mask.quantities).toEqual([]);expect(mask.outcome?.details.quantities[0]).toMatchObject({amount:2,unit:'use'});
    expect(outcome('oddities:tools:18').details.mechanismTags).toContain('extra-damage-objects-only');
  });
  it('keeps conditional effects, resources, asset worth and non-stacking armor as declarations',()=>{
    const pies=outcome('oddities:consumables:3');expect(pies.details.quantities.map(q=>q.amount)).toEqual([6,5,1]);
    expect(pies.text).toContain('poisoned');expect(pies.text).toContain('rest');
    const helmet=outcome('oddities:minor-magic:20');expect(helmet.text).toContain('3 banes');expect(helmet.details.mechanismTags).toContain('underwater-breathing');
    const shirt=outcome('core:6:17');expect(shirt.text).toContain('not cumulative');expect(shirt.details.mechanismTags).toContain('non-stacking');
    expect(outcome('core:2:19').details.declaredWorth).toEqual({amount:'1',denomination:'ss',bits:'100',spendable:false});
    expect(outcome('oddities:minor-magic:10').text).toContain('not under your control');
    expect(outcome('oddities:minor-magic:12').details.quantities).toContainEqual(expect.objectContaining({amount:3,unit:'use'}));
  });
  it('preserves narrative, relationships and pet restrictions rather than turning every result into inventory',()=>{
    expect(outcome('core:6:20').details.kind).toBe('narrative');expect(outcome('core:1:20').details.kind).toBe('narrative');
    expect(outcome('oddities:qualities:11').details.kind).toBe('narrative');
    expect(outcome('oddities:pets:2').details.contextRules[0]).toContain('cannot fight');
    expect(outcome('oddities:people:9').text).toContain('not be accompanying');
    expect(outcome('oddities:people:9').details.kind).toBe('relationship');
    expect(outcome('oddities:ingredients:1').details.contextRules[0]).toContain('GM');
    expect(outcome('core:3:16').details.kind).toBe('mixed');
  });
  it('keeps Books 20 as a nonblocking text reference with a disabled future random generator hook',()=>{
    const r=manual('oddities:books:20');expect(r.selectionComplete).toBe(true);
    expect(r.pending.some(p=>p.kind==='external-generator')).toBe(false);
    expect(r.outcome?.text).toBe('Generate a book or writing using the Dark Passages supplement.');
    expect(r.outcome?.details.kind).toBe('text-reference');expect(r.fullyApplied).toBe(false);
    expect(r.outcome?.details.dependencySourceId).toBe('sotdl:dark-passages');
    expect(r.outcome?.details.futureGenerator).toEqual({id:'dark-passages-books-and-passages',enabled:false,strategy:'random',outputKinds:['passage','book'],activation:'after-implementation-and-explicit-enablement'});
    expect(r.trace).toEqual([]);expect(faces(3,20).trace).toHaveLength(2);
    expect(manual('core:3:8').pending.some(p=>p.kind==='gm-choice')).toBe(true);
  });
  it('rejects holes, overlaps, cross-source routes and duplicate outcome identities',()=>{
    const clone=()=>structuredClone(catalog);
    const overlap=clone();overlap.variants[1].routes[0].max=3;expect(()=>InterestingThingsCatalogSchema.parse(overlap)).toThrow(/coverage/);
    const hole=clone();hole.variants[1].routes.shift();expect(()=>InterestingThingsCatalogSchema.parse(hole)).toThrow(/coverage/);
    const cross=clone();cross.variants[1].routes[0].tableId='core:thing-1';expect(()=>InterestingThingsCatalogSchema.parse(cross)).toThrow(/Cross-source/);
    const rows=clone();rows.tables[0].outcomes[1].face=1;expect(()=>InterestingThingsCatalogSchema.parse(rows)).toThrow(/coverage/);
    const ids=clone();ids.tables[0].outcomes[1].id=ids.tables[0].outcomes[0].id;expect(()=>InterestingThingsCatalogSchema.parse(ids)).toThrow(/Duplicate/);
  });
  it('preserves inputs and isolates edited previews, repeated grants and their traces',()=>{
    const snapshot=JSON.stringify(catalog),first=faces(20,1);
    first.outcome!.text='Edited by player';first.outcome!.details.quantities.push({amount:9,unit:'item',meaning:'Edited'});
    expect(faces(20,1).outcome?.text).toBe('A stone baby.');expect(JSON.stringify(catalog)).toBe(snapshot);
    const q={activeSourceIds:[ODD],selection:{mode:'table-faces',selectorFace:20,outcomeFace:1},choices:{},sideFaces:{}};
    const a=resolveThing({...q,eventId:'initial'}),b=resolveThing({...q,eventId:'windfall-10'});
    expect(a.outcome?.id).toBe(b.outcome?.id);expect(a.trace[0].id).not.toBe(b.trace[0].id);
    expect(a.trace[1].parentRollId).toBe(a.trace[0].id);expect(b.trace[1].parentRollId).toBe(b.trace[0].id);
  });
  it('reproduces artifacts and verifies evidence hashes and source references',async()=>{
    const built=await buildArtifacts(process.cwd());for(const[path,content]of built.artifacts)expect(readFileSync(path,'utf8')).toBe(content);
    const ids=new Set(data.evidence.map((e:{id:string})=>e.id));
    const sourceCache=new Map<string,{hash:string;lines:string[]}>();
    for(const e of data.evidence){
      if(!sourceCache.has(e.path)){const bytes=readFileSync(e.path);sourceCache.set(e.path,{hash:createHash('sha256').update(bytes).digest('hex'),lines:bytes.toString('utf8').split(/\r\n|\n|\r/)});}
      const source=sourceCache.get(e.path)!;expect(source.hash).toBe(e.inputSha256);
      const lines=source.lines.slice(e.startLine-1,e.endLine).join('\n');
      expect(lines).toBe(e.excerpt);expect(createHash('sha256').update(lines).digest('hex')).toBe(e.excerptSha256);
    }
    for(const t of catalog.tables)for(const o of t.outcomes)for(const id of o.evidenceIds)expect(ids.has(id)).toBe(true);
  },30000);
  it('rejects tampering and changed input before overwriting artifacts',async()=>{
    const root=await mkdtemp(join(tmpdir(),'sotdl-interesting-things-'));
    try{
      const paths=new Set([DATA,REPORT]);
      for(const path of [DATA,'curation/pilot/wealth-equipment.json','curation/pilot/professions-languages.json','curation/pilot/creation-table-inventory.json','curation/pilot/human-ancestry.json','curation/pilot/core-level-zero.json']){
        for(const ref of JSON.parse(readFileSync(path,'utf8')).inputRefs)paths.add(ref.path);
      }
      for(const path of paths){await mkdir(dirname(resolve(root,path)),{recursive:true});await copyFile(path,resolve(root,path));}
      await main(['--check'],root);await writeFile(resolve(root,DATA),'tampered\n');
      await expect(main(['--check'],root)).rejects.toThrow(/artifact changed/);
      const correction='curation/corrections/oddities-tables-2026-10-27/tables.txt';
      await writeFile(resolve(root,correction),'changed numbered transcription\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Oddities correction changed/);
      expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');await copyFile(correction,resolve(root,correction));
      await writeFile(resolve(root,data.evidence[0].path),'changed source\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Stale reconciliation|revision changed|correction changed/);
      expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');
    }finally{
      if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('sotdl-interesting-things-'))throw new Error('Unexpected scratch path');
      await rm(root,{recursive:true,force:true});
    }
  },30000);
});
