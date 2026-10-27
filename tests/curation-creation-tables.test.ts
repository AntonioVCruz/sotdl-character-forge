import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, basename, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { buildArtifacts, main, validateInventoryGraph } from '../tools/curation/creation-table-inventory';
import { sourceLines } from '../tools/curation/ancestry-extractor';

const DATA='curation/pilot/creation-table-inventory.json', REPORT='curation/reports/creation-table-inventory.json';
const inventory=JSON.parse(readFileSync(DATA,'utf8'));
const table=(id:string)=>inventory.tables.find((t:{id:string})=>t.id===id);
const hash=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');

describe('CUR-016 creation table inventory',()=>{
  it('reproduces all 61 logical table identities with exact provenance without enabling official generation',async()=>{
    const a=await buildArtifacts(process.cwd()),b=await buildArtifacts(process.cwd());
    expect([...a.artifacts]).toEqual([...b.artifacts]);
    expect(a.report.counts).toMatchObject({tables:61,coreTables:22,expandedTables:39,randomTables:56,lifestyleLookups:5});
    for(const [path,text] of a.artifacts)expect(await readFile(path,'utf8')).toBe(text);
    for(const t of inventory.tables){
      const e=t.evidence,bytes=readFileSync(e.path),excerpt=sourceLines(bytes.toString('utf8')).slice(e.startLine-1,e.endLine).map(l=>l.text).join('\n');
      expect(hash(bytes)).toBe(e.inputSha256);expect(excerpt).toBe(e.excerpt);expect(hash(excerpt)).toBe(e.excerptSha256);
      expect(e.sourceId).toBe(t.sourceId);expect(t.runtimeEnabled).toBe(false);expect(t.numericOutcomesApproved).toBe(false);
    }
    expect(inventory.gates).toEqual({importableTables:false,officialGenerationEnabled:false,outcomeHandlersImplemented:false,stagingPromoted:false});
  });
  it('keeps Core and expansion dice/procedures distinct and equipment lookups nonrandom',()=>{
    expect(table('core:profession-religious').dice).toEqual({count:1,sides:20});
    expect(table('only-human:religious').dice).toEqual({count:1,sides:6});
    expect(table('only-human:sibling-age').dice).toEqual({count:4,sides:6});
    expect(table('core:human-age').evidence.excerpt).toContain('18 to 35');
    expect(table('only-human:age').evidence.excerpt).toContain('18 to 25');
    expect(table('only-human:lifestyle').evidence.excerpt).toContain('16–17 Wealthy');
    expect(table('core:wealth').notes).toContain('17/18');
    for(const id of ['clothing','weapons','personal-gear','special-gear','money']){
      expect(table(`only-human:${id}`)).toMatchObject({kind:'lifestyle-lookup',dice:null,selector:'selected-starting-lifestyle'});
    }
    expect(inventory.procedures).toMatchObject({default:'human-development',alternative:'core-alternative',attributeModeIndependent:true});
    expect(table('only-human:age').manualMode).toBe('specific-procedure-requires-rolls');
    expect(table('core:human-age').manualMode).toBe('roll-choose-or-create');
  });
  it('preserves modified totals, age-dependent multiplicities and explicit Size exceptions',()=>{
    const c=inventory.procedureConstraints;
    expect(c).toMatchObject({applyModifiersAfterDice:true,clampRawRollBeforeModifiers:false});
    expect(c.modifiedRollTables.map((r:{tableId:string})=>r.tableId)).toEqual(['only-human:childhood','only-human:lifestyle']);
    expect(c.modifiedRollTables[0].possibleModifiers).toEqual([-6,-3,-1,0,1,3,6]);
    expect(c.ageDirectedLifeRolls.map((r:{count:number})=>r.count)).toEqual([0,1,2,3,4,5,6]);
    expect(c.explicitSizeExceptions).toEqual([{tableId:'only-human:age',result:3,size:0.5},{tableId:'only-human:build',result:3,size:0.5}]);
    expect(table('only-human:build').evidence.excerpt).toContain('Reduce your Size');
    expect(inventory.nonTableProcedures.find((r:{id:string})=>r.id==='expanded-free-appearance').reason).toContain('Do not use Sibling Genders for the PC');
  });
  it('finds published loops without treating all graph ancestors as cyclic and rejects dangling identities',()=>{
    const actual=validateInventoryGraph(inventory.tables.map((t:{id:string})=>t.id),inventory.links);
    expect(new Set(actual)).toEqual(new Set(['only-human:siblings','only-human:character-fate','only-human:strange','only-human:piety']));
    expect(actual).not.toContain('only-human:life');
    expect(()=>validateInventoryGraph(['a','a'],[])).toThrow(/Duplicate/);
    expect(()=>validateInventoryGraph(['a'],[{from:'a',to:'missing',kind:'roll',instruction:'test',startLine:1,endLine:1}])).toThrow(/Unresolved/);
    expect(inventory.links.find((l:{from:string;to:string})=>l.from==='only-human:piety'&&l.to==='only-human:piety').instruction).toContain('after the first');
    expect(inventory.links.find((l:{from:string;to:string})=>l.from==='only-human:strange'&&l.to==='only-human:strange').instruction).toContain('ignoring 19');
  });
  it('accounts for transcription ambiguities, conditional rewards, restricted profession choices and dice signals',()=>{
    expect(table('only-human:fears').evidence.excerpt).toBe(table('only-human:desires').evidence.excerpt);
    expect(inventory.findings.find((f:{id:string})=>f.id==='fears-desires-columns').type).toBe('transcription-review');
    expect(table('only-human:profession-router').evidence.endLine).toBe(14314);
    expect(inventory.instructionEvidence.find((e:{id:string})=>e.id==='only-human:profession-stray-prose').startLine).toBe(14315);
    expect(inventory.links.filter((l:{from:string;kind:string})=>l.from==='only-human:family-circumstances'&&l.kind==='restricted-category-choice').map((l:{to:string})=>l.to)).not.toContain('only-human:scholarship');
    expect(inventory.links).toContainEqual(expect.objectContaining({from:'only-human:minor-windfall',to:'core:thing-router',kind:'additional-result'}));
    expect(inventory.links).toContainEqual(expect.objectContaining({from:'only-human:lifestyle',to:'core:thing-router',kind:'initial-result'}));
    expect(table('only-human:common').evidence.excerpt).toContain('If you’re literate');
    expect(inventory.diceSignals.some((s:{tableId:string;expression:string})=>s.tableId==='only-human:siblings'&&s.expression==='1d3 + 1')).toBe(true);
    expect(inventory.diceSignals.every((s:{interpretedAsExecutableChild:boolean})=>!s.interpretedAsExecutableChild)).toBe(true);
    const known=new Set(inventory.tables.map((t:{id:string})=>t.id));
    for(const f of inventory.findings)for(const id of f.tableIds)expect(known.has(id)).toBe(true);
  });
  it('detects a tampered inventory or changed source before overwriting output',async()=>{
    const root=await mkdtemp(join(tmpdir(),'sotdl-creation-tables-'));
    try{
      const pilot=JSON.parse(readFileSync('curation/pilot/core-level-zero.json','utf8'));
      const human=JSON.parse(readFileSync('curation/pilot/human-ancestry.json','utf8'));
      const paths=new Set<string>([...inventory.inputRefs.map((r:{path:string})=>r.path),...human.inputRefs.map((r:{path:string})=>r.path),...pilot.inputRefs.map((r:{path:string})=>r.path),DATA,REPORT]);
      for(const p of paths){await mkdir(dirname(resolve(root,p)),{recursive:true});await copyFile(p,resolve(root,p));}
      await main(['--check'],root);
      await writeFile(resolve(root,DATA),'tampered\n');
      await expect(main(['--check'],root)).rejects.toThrow(/inventory changed/);
      const source=table('only-human:age').evidence.path;
      await writeFile(resolve(root,source),'changed source\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Stale reconciliation|revision changed/);
      expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');
    }finally{
      if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('sotdl-creation-tables-'))throw new Error('Unexpected scratch directory');
      await rm(root,{recursive:true,force:true});
    }
  },30000);
});
