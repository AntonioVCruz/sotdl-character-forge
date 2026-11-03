import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {beforeAll,describe,it,expect} from 'vitest';
import {buildCoreLocal,projectCoreLocal,validateCoreLocalProjection,type CoreProjectionInputs} from '../tools/curation/core-local-projector';
import {canonicalJson} from '../tools/curation/canonical-json';

const available=existsSync('curation/pilot/table-closure.json')&&existsSync('rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md');
const digest=(v:unknown)=>createHash('sha256').update(canonicalJson(v)).digest('hex');
describe.skipIf(!available)('Core real local source projection (requires licensed ignored inputs)',()=>{
  let result:Awaited<ReturnType<typeof buildCoreLocal>>,input:CoreProjectionInputs;
  beforeAll(async()=>{
    const read=(name:string)=>JSON.parse(readFileSync(`curation/pilot/${name}.json`,'utf8'));
    input={closure:read('table-closure'),professions:read('professions-languages'),wealth:read('wealth-equipment'),things:read('interesting-things'),items:read('items'),pilot:read('core-level-zero'),matrix:JSON.parse(readFileSync('docs/matriz-lacunas-issue34-atividade1.json','utf8'))};
    result=await buildCoreLocal();
  },30000);
  it('covers all Core tables, streams, rows, professions, matrix records and former groups',()=>{
    expect(result.report.counts).toMatchObject({tables:22,streams:23,rows:339,professions:102,things:120,programs:7,queries:2,links:12,matrixRecords:260,expandedProfessionOptions:36});
    expect(result.report.gates).toMatchObject({fictionalData:false,distribution:'local',rulesetEnabled:false,exportEnabled:false,pdfInspected:false,fullSemanticAcceptance:false});
    expect(digest(projectCoreLocal(input,result.document.inputs).document)).toBe(digest(result.document));
    for(const t of result.document.tables)for(const c of t.columns)expect(c.rows.reduce((s,r)=>s+BigInt(r.weight.ways),0n).toString()).toBe(c.rows[0].weight.denominator);
  });
  it('preserves every profession and Interesting Things component without logging text',()=>{
    const p=input.professions as {options:{sourceFamily:string}[]},th=input.things as {catalog:{tables:{id:string;outcomes:unknown[]}[]}};
    expect(digest(result.document.professions)).toBe(digest(p.options.filter(p=>p.sourceFamily==='core')));
    expect(digest(result.document.things)).toBe(digest(th.catalog.tables.filter(t=>t.id.startsWith('core:')).flatMap(t=>t.outcomes)));
    for(const id of ['core:profession-martial','core:profession-religious','core:profession-wilderness'])expect(result.document.tables.some(t=>t.id===id)).toBe(true);
    expect(result.report.selectorWeights.map(s=>s.weights.length)).toEqual([102,120]);
  });
  it('retains background consequences, conditional language abilities and material links',()=>{
    const d=result.document,rows=d.tables.find(t=>t.id==='core:human-background')!.columns[0].rows;
    expect(rows.every(r=>r.bindings.some(b=>b.pending==='background-consequence-review'))).toBe(true);
    expect(rows.find(r=>r.min===20)!.bindings.some(b=>b.refId==='extra:core-background-20')).toBe(true);
    expect(d.backgroundStateMentions.length).toBe(4);
    expect(d.templates.find(t=>t.id==='core-background-education')!.languages![0].abilities).toEqual(['read']);
    expect(d.templates.find(t=>t.id==='core-background-travel')!.languageChoice!.abilities).toEqual(['speak']);
    expect(d.backgroundSideRolls).toHaveLength(1);expect(d.backgroundSideRolls[0].minimum).toBe(0);
  });
  it('rejects a shape-valid changed narrative or omitted obligation by reprojecting pinned inputs',()=>{
    const changed=structuredClone(result.document);changed.tables[0].columns[0].rows[0].text='Invented replacement';
    expect(()=>validateCoreLocalProjection(changed,input,result.document.inputs)).toThrow('source-projection-mismatch');
    const lost=structuredClone(result.document);lost.tables.find(t=>t.id==='core:human-background')!.columns[0].rows.find(r=>r.min===20)!.bindings.pop();
    expect(()=>validateCoreLocalProjection(lost,input,result.document.inputs)).toThrow('source-projection-mismatch');
  });
});
