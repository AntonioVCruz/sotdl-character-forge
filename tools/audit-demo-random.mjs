/** Verificador da fixture FICTÍCIA. Não é um motor de geração de personagens. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pack = JSON.parse(fs.readFileSync(path.join(root,'examples/demo-random-tables.json'),'utf8'));
assert.equal(pack.fictionalData, true, 'Fixture DEVE ser fictícia');
const map = new Map(pack.entities.map(t => [t.id, t]));
assert.equal(map.size,pack.entities.length,'IDs duplicados');
function totals({count,sides,modifier=0}){
  assert(Number.isInteger(count) && count>=1 && count<=10);
  assert(Number.isInteger(sides) && sides>=2 && sides<=100);
  assert(Number.isInteger(modifier));
  let dist = new Map([[modifier,1]]);
  for(let i=0;i<count;i++){
    const next = new Map();
    for(const [sum,ways] of dist)for(let face=1;face<=sides;face++)
      next.set(sum+face,(next.get(sum+face)??0)+ways);
    dist=next;
  }
  return dist;
}
for(const table of pack.entities){
  assert.equal(table.kind,'randomTable');
  assert.ok(table.sourceRef && table.status);
  const dist = totals(table.diceExpr);
  const outcomeIds = new Set(table.outcomes.map(o=>o.id));
  for(const [sum] of dist){
    const matches=table.ranges.filter(r=>r.min<=sum&&sum<=r.max);
    assert.equal(matches.length,1,`${table.id}: resultado ${sum} tem ${matches.length} outcomes`);
    assert(outcomeIds.has(matches[0].outcomeId),`${table.id}: outcome ausente`);
  }
  for(const o of table.outcomes){
    if(o.nextTableRef)assert(map.has(o.nextTableRef),`${table.id}: referência ausente`);
    for(const r of o.sideRolls??[])totals(r.diceExpr);
  }
  const counts=new Map(table.outcomes.map(o=>[o.id,0]));
  for(const [sum,ways] of dist){
    const row=table.ranges.find(r=>r.min<=sum&&sum<=r.max);
    counts.set(row.outcomeId,counts.get(row.outcomeId)+ways);
  }
  console.log(`${table.name}: `,Object.fromEntries(counts));
}
const seen=new Set(), active=new Set();
function checkCycle(id){
 if(active.has(id))throw new Error(`Ciclo de tabelas: ${id}`);
 if(seen.has(id))return;
 active.add(id);
 for(const o of map.get(id).outcomes)if(o.nextTableRef)checkCycle(o.nextTableRef);
 active.delete(id);seen.add(id);
}
for(const id of map.keys())checkCycle(id);
const d=totals({count:3,sides:6});
assert.equal([...d.values()].reduce((x,y)=>x+y,0),216);
assert.equal(d.get(3),1);assert.equal(d.get(10),27);
console.log('OK: IDs, ranges, distribuição 3d6, outcomes, sub-rolagens e referências validados.');
