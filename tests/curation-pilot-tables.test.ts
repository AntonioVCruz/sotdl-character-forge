import {readFileSync} from 'node:fs';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,dirname,basename} from 'node:path';
import {describe,it,expect} from 'vitest';
import {exactDiceDistribution,auditTableRanges,resolveAuditedTable,reviewPietySequence,reviewStrangeSequence,reviewCoreBackgroundChildren,composeSelectorWeights} from '../packages/curation/pilot-table-model';
import {buildArtifacts,main} from '../tools/curation/pilot-table-closure';

const DATA='curation/pilot/table-closure.json',REPORT='curation/reports/table-closure.json';
const data=JSON.parse(readFileSync(DATA,'utf8'));
const table=(id:string)=>data.tables.find((t:any)=>t.id===id);
const resolveRow=(id:string,faces:number[],modifier=0,streamId='main')=>resolveAuditedTable(table(id),{faces,modifier,streamId,activeSourceIds:[table(id).sourceId]});
describe('CUR-021 pilot table closure',()=>{
  it('accounts for all 74 identities, 70 numeric streams and five deterministic lookups',()=>{
    const inventory=JSON.parse(readFileSync('curation/pilot/creation-table-inventory.json','utf8'));
    expect(data.tables).toHaveLength(74);for(const t of inventory.tables)expect(table(t.id)).toBeDefined();
    expect(new Set(data.tables.map((t:any)=>t.id)).size).toBe(74);
    expect(data.audits).toHaveLength(70);expect(data.audits.every((a:any)=>a.complete)).toBe(true);expect(data.parseIssues).toEqual([]);
    expect(data.lookups).toHaveLength(5);for(const lookup of data.lookups){expect(lookup.rows.map((r:any)=>r.key)).toEqual(['destitute','poor','getting-by','comfortable','wealthy','rich']);expect(lookup.extraDice).toBe(false);}
    expect(()=>resolveRow('only-human:money',[1])).toThrow(/lookup/);
  });
  it('produces exact known 3d6 frequencies and 4d6 endpoint weights',()=>{
    const d=exactDiceDistribution({count:3,sides:6});expect(d.denominator).toBe('216');
    expect(d.totals.map(r=>Number(r.ways))).toEqual([1,3,6,10,15,21,25,27,27,25,21,15,10,6,3,1]);
    const four=exactDiceDistribution({count:4,sides:6});expect(four.denominator).toBe('1296');expect(four.totals[0]).toEqual({total:4,ways:'1'});expect(four.totals.at(-1)).toEqual({total:24,ways:'1'});
    expect(()=>exactDiceDistribution({count:0,sides:6})).toThrow();
  });
  it('matches every stream weight against independent enumeration of all die faces',()=>{
    for(const t of data.tables.filter((t:any)=>t.dice))for(const stream of t.streams){
      const counts=new Map<string,bigint>(stream.rows.map((r:any)=>[r.id,0n]));
      const enumerate=(left:number,total:number)=>{if(!left){const matching=stream.rows.filter((r:any)=>(r.min===null||total>=r.min)&&(r.max===null||total<=r.max));expect(matching).toHaveLength(1);counts.set(matching[0].id,counts.get(matching[0].id)!+1n);return;}
        for(let face=1;face<=t.dice.sides;face++)enumerate(left-1,total+face);};enumerate(t.dice.count,0);
      const audit=data.audits.find((a:any)=>a.tableId===t.id&&a.streamId===stream.id);
      expect(audit.weights.map((r:any)=>r.ways)).toEqual(stream.rows.map((r:any)=>counts.get(r.id)!.toString()));
    }
  });
  it('keeps different source ranges, 4d6 sibling ages and modified open tails',()=>{
    expect(resolveRow('core:human-age',[2,2,2]).row?.text).toContain('adolescent');
    expect(resolveRow('only-human:age',[2,2,2]).row?.text).toContain('young adult');
    expect(resolveRow('only-human:sibling-age',[1,1,1,1]).row?.text).toContain('twin');
    expect(resolveRow('only-human:sibling-age',[6,6,6,6]).row?.text).toBe('Younger');
    expect(()=>resolveRow('only-human:sibling-age',[1,1,1])).toThrow(/published dice/);
    expect(resolveRow('only-human:childhood',[1,1,1],-6)).toMatchObject({total:-3,resolved:true});
    expect(resolveRow('only-human:childhood',[6,6,6],6)).toMatchObject({total:24,resolved:true});
    expect(resolveRow('only-human:lifestyle',[6,6,6],12).row?.text).toBe('rich');
    expect(()=>resolveRow('core:human-age',[1,1,1],1)).toThrow(/not authorized/);
    expect(()=>resolveRow('only-human:childhood',[1,1,1],2)).toThrow(/Unknown family/);
  });
  it('composes selector probabilities without flattening weighted categories or the Religious d6 child',()=>{
    const only=composeSelectorWeights('only-human:profession-router',data.tables);
    expect(only.find(w=>w.tableId==='only-human:religious')).toMatchObject({ways:'1',denominator:'36'});
    expect(only.find(w=>w.tableId==='only-human:common')).toMatchObject({ways:'1',denominator:'120'});
    expect(only.reduce((n,w)=>n+BigInt(w.ways)*(360n/BigInt(w.denominator)),0n)).toBe(360n);
    const odd=composeSelectorWeights('oddities:thing-router',data.tables);
    expect(odd.find(w=>w.tableId==='oddities:art')).toMatchObject({ways:'2',denominator:'400'});
    expect(odd.find(w=>w.tableId==='oddities:minor-magic')).toMatchObject({ways:'1',denominator:'400'});
    expect(odd.reduce((n,w)=>n+BigInt(w.ways),0n)).toBe(400n);
    const core=composeSelectorWeights('core:thing-router',data.tables);expect(core).toHaveLength(120);expect(core.every(w=>w.ways==='1'&&w.denominator==='120')).toBe(true);
  });
  it('keeps independent columns, resolves the confirmed Fears/Desires and still blocks unverified associations',()=>{
    expect(resolveRow('core:role-traits',[1],0,'positive').row?.text).toBe('Benevolent');
    expect(resolveRow('core:role-traits',[20],0,'negative').row?.text).toBe('Vulgar');
    expect(()=>resolveRow('core:role-traits',[1])).toThrow(/column/);
    expect([1,2,3,4,5,6].map(face=>resolveRow('only-human:fears',[face]).row?.text)).toEqual(['Disgrace','Failure','Death','Isolation','Judgment','Anonymity']);
    expect([1,2,3,4,5,6].map(face=>resolveRow('only-human:desires',[face]).row?.text)).toEqual(['Status','Fame','Wealth','Glory','Love','Redemption']);
    expect(data.readiness.associationReviewTables).toEqual([]);expect(data.confirmation.resolvedRows).toBe(12);
    const provisional=structuredClone(table('only-human:fears'));provisional.streams[0].association='needs-review';
    expect(resolveAuditedTable(provisional,{faces:[1],activeSourceIds:[provisional.sourceId]})).toMatchObject({resolved:false,row:null,reason:'unverified-column-association'});
  });
  it('rejects numeric gaps, overlaps, duplicate keys and unreachable extra outcomes',()=>{
    const rows=structuredClone(table('only-human:death').streams[0].rows);
    expect(auditTableRanges({count:3,sides:6},rows).complete).toBe(true);
    const hole=structuredClone(rows);hole.splice(2,1);expect(auditTableRanges({count:3,sides:6},hole).complete).toBe(false);
    expect(auditTableRanges({count:3,sides:6},[...rows,rows[0]]).errors.some(e=>e.startsWith('duplicate'))).toBe(true);
    const outside=[...rows,{...rows[0],id:'outside',min:19,max:19}];expect(auditTableRanges({count:3,sides:6},outside).errors).toContain('unreachable:outside');
    const partial={...table('only-human:death'),streams:[{...table('only-human:death').streams[0],rows:hole}]};
    expect(resolveAuditedTable(partial,{faces:[2,2,2],activeSourceIds:[partial.sourceId]})).toMatchObject({resolved:false,reason:'incomplete-ranges',row:null});
  });
  it('distinguishes a numeric continuation from a new result and preserves conditional dice text',()=>{
    const setback=table('only-human:major-setback').streams[0].rows;
    expect(setback).toHaveLength(20);expect(setback.find((r:any)=>r.min===4).text).toContain('1 Corruption.');
    const children=[1,2,3,4,5,6].map(f=>reviewCoreBackgroundChildren(f).children);expect(children).toEqual([0,0,1,2,3,4]);
    expect(data.reviewedSideRollRules.find((r:any)=>r.purpose==='favor expiry after invocation').phase).toBe('use');
    expect(data.sideRollMentions.every((r:any)=>r.automaticExecution===false)).toBe(true);
  });
  it('keeps Piety rerolls bounded, counts repeat insanity and rejects unused results',()=>{
    expect(reviewPietySequence({totals:[3,3,18],maxSteps:8})).toMatchObject({resolved:true,finalTotal:18,insanity:2,religionRolls:2,steps:3,effectsApplied:false});
    expect(reviewPietySequence({totals:[3],maxSteps:8})).toMatchObject({resolved:false,insanity:0,pending:'next-piety-roll'});
    expect(reviewPietySequence({totals:[3,3,3],maxSteps:2})).toMatchObject({resolved:false,steps:2,pending:'execution-bound'});
    expect(()=>reviewPietySequence({totals:[10,3],maxSteps:8})).toThrow(/unused/);
  });
  it('permits only the published Strange 19 reroll and leaves handlers pending when source is enabled',()=>{
    expect(reviewStrangeSequence({faces:[19,19,4],toothAndClawEnabled:false,maxSteps:8})).toMatchObject({resolved:true,result:4,steps:3});
    expect(reviewStrangeSequence({faces:[19],toothAndClawEnabled:true,maxSteps:8})).toMatchObject({resolved:true,result:19,pending:'skinchanger-handler',effectsApplied:false});
    expect(reviewStrangeSequence({faces:[19,19],toothAndClawEnabled:false,maxSteps:2})).toMatchObject({resolved:false,pending:'execution-bound'});
    expect(()=>reviewStrangeSequence({faces:[2,19],toothAndClawEnabled:false,maxSteps:8})).toThrow(/unused/);
  });
  it('preserves source gates, selected Interesting Things routing and all prior findings',()=>{
    const t=table('only-human:life');expect(resolveAuditedTable(t,{faces:[1,1,1],activeSourceIds:[]})).toMatchObject({resolved:false,reason:'disabled-source'});
    const links=data.links.filter((l:any)=>l.to==='selected:interesting-things-router');expect(links).toHaveLength(2);
    expect(data.selectorBindings[0].defaultVariant).toBe('oddities');expect(data.selectorBindings[0].variants.map((v:any)=>v.tableId)).toEqual(['core:thing-router','oddities:thing-router']);
    expect(data.dispositions).toHaveLength(7);expect(data.cyclicTables).toHaveLength(4);
    expect(data.mechanicalReview.itemAmbiguities).toHaveLength(5);expect(data.mechanicalReview.unresolvedItemDefinitions).toHaveLength(57);
    expect(data.readiness.fullAutomaticCharacterReady).toBe(false);expect(Object.values(data.gates)).toEqual([false,false,false,false]);
  });
  it('reproduces artifacts and resolves evidence without changing earlier derivatives',async()=>{
    const built=await buildArtifacts(process.cwd());for(const[path,text]of built.artifacts)expect(readFileSync(path,'utf8')).toBe(text);
    const known=new Set(data.evidence.map((e:any)=>e.id));for(const t of data.tables)for(const id of [...t.evidenceIds,...t.streams.flatMap((s:any)=>s.rows.flatMap((r:any)=>r.evidenceIds))])expect(known.has(id)).toBe(true);
  },30000);
  it('rejects stale dependencies and tampered output before writing',async()=>{
    const root=await mkdtemp(join(tmpdir(),'sotdl-table-closure-'));
    try{
      const paths=new Set([DATA,REPORT]);
      for(const path of [DATA,'curation/pilot/items.json','curation/pilot/interesting-things.json','curation/pilot/wealth-equipment.json','curation/pilot/professions-languages.json','curation/pilot/creation-table-inventory.json','curation/pilot/human-ancestry.json','curation/pilot/core-level-zero.json'])for(const ref of JSON.parse(readFileSync(path,'utf8')).inputRefs)paths.add(ref.path);
      for(const path of paths){await mkdir(dirname(resolve(root,path)),{recursive:true});await copyFile(path,resolve(root,path));}
      await main(['--check'],root);await writeFile(resolve(root,DATA),'tampered\n');await expect(main(['--check'],root)).rejects.toThrow(/artifact changed/);
      const correction='curation/corrections/only-human-fears-desires-2026-10-27/tables.txt';await writeFile(resolve(root,correction),'changed confirmation\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Fears\/Desires confirmation changed/);expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');await copyFile(correction,resolve(root,correction));
      await writeFile(resolve(root,'curation/pilot/items.json'),'stale\n');await expect(main(['--write'],root)).rejects.toThrow(/Stale CUR-020/);
      expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');
    }finally{
      if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('sotdl-table-closure-'))throw new Error('Unexpected scratch path');await rm(root,{recursive:true,force:true});
    }
  },30000);
});
