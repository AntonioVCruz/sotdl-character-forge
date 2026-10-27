import {readFileSync} from 'node:fs';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,basename} from 'node:path';
import {describe,it,expect} from 'vitest';
import {moneyToBits,previewStartingGrants,resolveStartingLifestyle,type GrantNode} from '../packages/curation/starting-equipment-model';
import {buildArtifacts,main} from '../tools/curation/wealth-equipment-formalizer';

const data=JSON.parse(readFileSync('curation/pilot/wealth-equipment.json','utf8'));
const preview=(programId:string,choices:Record<string,string>={},rolls:Record<string,number[]>={},subject='pc')=>
  previewStartingGrants(data.programs,{instances:[{eventId:'kit',programId,subject}],choices,rolls});
const program=(id:string)=>data.programs.find((p:{id:string})=>p.id===id);
describe('CUR-018 wealth and starting equipment',()=>{
  it('converts exact currency without floating point or loss above the safe integer limit',()=>{
    expect(['bits','cp','ss','gc'].map(u=>moneyToBits('1',u))).toEqual(['1','10','100','1000']);
    expect(moneyToBits('0.01','ss')).toBe('1');
    expect(moneyToBits('9007199254740993','gc')).toBe('9007199254740993000');
    for(const amount of ['-1','1e3','0.001'])expect(()=>moneyToBits(amount,'ss')).toThrow();
    expect(()=>moneyToBits('1','horse bits')).toThrow();
  });
  it('preserves the exact 216-outcome distributions of the two different 3d6 procedures',()=>{
    for(const [procedure,expected]of [['core',[4,52,125,31,3,1]],['only-human',[1,9,150,46,9,1]]]as const){
      const counts:Record<string,number>={destitute:0,poor:0,'getting-by':0,comfortable:0,wealthy:0,rich:0};
      for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++)counts[resolveStartingLifestyle({procedure,faces:[a,b,c],events:[]}).lifestyle]++;
      expect(Object.values(counts)).toEqual(expected);
    }
  });
  it('accumulates distinct expanded events without clamping and rejects source mixing or duplicated events',()=>{
    const event={id:'a',tableId:'only-human:major-setback',result:5};
    const q={procedure:'only-human',faces:[1,1,1],events:[event]};
    expect(resolveStartingLifestyle(q)).toMatchObject({rawTotal:3,total:0,lifestyle:'destitute'});
    expect(resolveStartingLifestyle({...q,events:[event,{...event,id:'b'}]}).total).toBe(-3);
    expect(resolveStartingLifestyle({...q,faces:[6,6,6],events:[{...event,tableId:'only-human:major-windfall',result:4}]})).toMatchObject({total:21,lifestyle:'rich'});
    expect(()=>resolveStartingLifestyle({...q,procedure:'core'})).toThrow(/Core/);
    expect(()=>resolveStartingLifestyle({...q,events:[event,event]})).toThrow(/Duplicate/);
    expect(()=>resolveStartingLifestyle({...q,events:[{...event,tableId:'only-human:childhood'}]})).toThrow();
  });
  it('keeps fixed kit items while choices or rolls are pending, and grants sling ammunition only with a sling',()=>{
    const pending=preview('core:kit:poor');expect(pending.cashComplete).toBe(false);expect(pending.materialComplete).toBe(false);
    expect(pending.records).toContainEqual(expect.objectContaining({sourceLabel:'tinderbox'}));
    const sling=preview('core:kit:poor',{'kit/weapon':'sling'},{'kit/starting-money/amount':[2,3]});
    expect(sling.knownCashBits).toBe('5');expect(sling.materialComplete).toBe(true);
    expect(sling.records).toContainEqual(expect.objectContaining({quantity:20,sourceLabel:expect.stringMatching(/stone/)}));
    const staff=preview('core:kit:poor',{'kit/weapon':'staff'},{'kit/starting-money/amount':[2,3]});
    expect(staff.records).not.toContainEqual(expect.objectContaining({quantity:20}));
    expect(()=>preview('core:kit:poor',{'kit/weapon':'sword'})).toThrow(/alternative/);
    expect(()=>preview('core:kit:poor',{}, {'kit/starting-money/amount':[7,1]})).toThrow(/faces/);
  });
  it('emits editable generic Incantations without learning spells or applying equipment effects',()=>{
    const r=preview('core:kit:comfortable',{'kit/weapon':'staff','kit/special':'incantation'},{'kit/starting-money/amount':[1,2]});
    expect(r.records).toContainEqual(expect.objectContaining({displayName:'Incantation de rank 0',recordKind:'incantation',quantity:1,editable:true,spellLearned:false,autoEquipped:false,mechanicalEffects:[]}));
    expect(r).toMatchObject({knownCashBits:'30',materialComplete:true,completeCharacter:false});
  });
  it('keeps asset worth separate from cash and preserves additive rewards and independent origins',()=>{
    const merchant='profession:pilot-profession:only-human:common:r16';
    const r=preview(merchant,{}, {'kit/raw-goods/worth':[4]});
    expect(r.knownCashBits).toBe('0');expect(r.records).toContainEqual(expect.objectContaining({worth:{amount:4,denomination:'ss',bits:'400'}}));
    expect(preview('extra:major-windfall-19').knownCashBits).toBe('0');
    const multiple=previewStartingGrants(data.programs,{instances:['a','b'].map(eventId=>({eventId,programId:'extra:core-background-20',subject:'pc'})),choices:{},rolls:{'a/bonus-coins/amount':[1,2],'b/bonus-coins/amount':[3,4]}});
    expect(multiple.knownCashBits).toBe('100');expect(multiple.money).toHaveLength(2);
    expect(preview(merchant,{}, {},'family').records).toEqual([]);
  });
  it('preserves Only Human clothing rolls, horse tack quantities, and incantation side rolls',()=>{
    const r=preview('only-human:kit:rich',{}, {'kit/clothing/quantity':[3],'kit/starting-money/amount':[2,4]});
    expect(r.knownCashBits).toBe('600');
    for(const label of ['horse','horse bit (tack, not currency)','bridle','saddle'])expect(r.records).toContainEqual(expect.objectContaining({sourceLabel:label,quantity:3}));
    expect(r.records).toContainEqual(expect.objectContaining({key:'kit/clothing',quantity:3}));
    const inc=preview('extra:major-windfall-9',{}, {'kit/incantations/quantity':[3]});
    expect(inc.records).toContainEqual(expect.objectContaining({recordKind:'incantation',quantity:4}));
    const fishing='profession:pilot-profession:only-human:common:r13';
    expect(preview(fishing,{'kit/fishing-gear':'pole-and-tackle'}).records).toHaveLength(2);
    expect(preview(fishing,{'kit/fishing-gear':'harpoon'}).records).toHaveLength(1);
  });
  it('resolves every kit and profession program with explicit side rolls and keeps all evidence links valid',()=>{
    const evidence=new Set(data.evidence.map((e:{id:string})=>e.id));
    for(const p of data.programs){
      const choices:Record<string,string>={},rolls:Record<string,number[]>={};
      const walk=(nodes:GrantNode[],prefix:string)=>{for(const n of nodes){const key=`${prefix}/${n.key}`;
        if(n.kind==='choice'){choices[key]=n.options[0].id;walk(n.options[0].grants,`${key}/${n.options[0].id}`);}
        else{const qty=n.kind==='money'?n.amount:n.quantity;if(qty.kind==='dice')rolls[`${key}/${n.kind==='money'?'amount':'quantity'}`]=Array(qty.count).fill(1);
          if(n.kind==='record'&&n.worth?.amount.kind==='dice')rolls[`${key}/worth`]=Array(n.worth.amount.count).fill(1);}
      }};walk(p.grants,'kit');expect(preview(p.id,choices,rolls).materialComplete).toBe(true);
      for(const id of p.evidenceIds)expect(evidence.has(id)).toBe(true);
    }
    expect(data.professionPrograms.filter((p:{programId:string|null})=>p.programId)).toHaveLength(66);
    expect(data.programs).toHaveLength(97);expect(data.gates.officialGenerationEnabled).toBe(false);
  });
  it('reproduces the checked-in artifacts from pinned inputs',async()=>{
    const built=await buildArtifacts(process.cwd());for(const[path,content]of built.artifacts)expect(readFileSync(path,'utf8')).toBe(content);
  },30000);
  it('rejects modified artifacts and stale source evidence before overwriting output',async()=>{
    const root=await mkdtemp(join(tmpdir(),'sotdl-wealth-equipment-'));
    const output='curation/pilot/wealth-equipment.json';
    try{
      const paths=new Set([output,'curation/reports/wealth-equipment.json']);
      for(const path of [output,'curation/pilot/professions-languages.json','curation/pilot/creation-table-inventory.json','curation/pilot/human-ancestry.json','curation/pilot/core-level-zero.json']){
        for(const ref of JSON.parse(readFileSync(path,'utf8')).inputRefs)paths.add(ref.path);
      }
      for(const path of paths){await mkdir(dirname(resolve(root,path)),{recursive:true});await copyFile(path,resolve(root,path));}
      await main(['--check'],root);await writeFile(resolve(root,output),'tampered\n');
      await expect(main(['--check'],root)).rejects.toThrow(/artifact changed/);
      await writeFile(resolve(root,data.evidence[0].path),'changed source\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Stale reconciliation|revision changed/);
      expect(await readFile(resolve(root,output),'utf8')).toBe('tampered\n');
    }finally{
      if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('sotdl-wealth-equipment-'))throw new Error('Unexpected scratch path');
      await rm(root,{recursive:true,force:true});
    }
  },30000);
});
