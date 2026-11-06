import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,it,expect} from 'vitest';
import {reviewProbabilities} from '../tools/curation/review-freeze';

const root=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
const path=resolve(root,'curation/pilot/table-closure.json');
describe.skipIf(!existsSync(path))('issue55 exact local probability review',()=>{
  it('matches all 70 streams to independent face enumeration and verifies selector sums',()=>{
    const doc=JSON.parse(readFileSync(path,'utf8'));
    const review=reviewProbabilities(doc.tables,doc.selectorAudits.map((s:any)=>s.tableId));
    expect(review.streams).toHaveLength(70);expect(review.selectors).toHaveLength(4);expect(review.lookups).toBe(5);
    for(const table of doc.tables)for(const stream of table.streams){
      const counts=new Map<string,bigint>(stream.rows.map((r:any)=>[r.id,0n]));
      const enumerate=(left:number,total:number)=>{
        if(!left){
          const matches=stream.rows.filter((r:any)=>(r.min===null||total>=r.min)&&(r.max===null||total<=r.max));
          if(matches.length!==1)throw new Error(`Ambiguous range: ${table.id}`);
          counts.set(matches[0].id,counts.get(matches[0].id)!+1n);return;
        }
        for(let face=1;face<=table.dice.sides;face++)enumerate(left-1,total+face);
      };
      enumerate(table.dice.count,0);
      const audit=review.streams.find(s=>s.tableId===table.id&&s.streamId===stream.id)!;
      expect(audit.weights.map(w=>w.ways)).toEqual(stream.rows.map((r:any)=>counts.get(r.id)!.toString()));
    }
    for(const selector of review.selectors){
      // Cross multiplication avoids floating point and supports differing denominators.
      const common=selector.weights.reduce((n,w)=>n*BigInt(w.denominator),1n);
      expect(selector.weights.reduce((n,w)=>n+BigInt(w.ways)*(common/BigInt(w.denominator)),0n)).toBe(common);
    }
  });
});
