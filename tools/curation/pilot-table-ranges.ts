export type Limits=[number|null,number|null];
const standard:Limits[]=[[3,3],[4,5],[6,8],[9,12],[13,15],[16,17],[18,18]];
const coreNine:Limits[]=[[3,3],[4,4],[5,6],[7,8],[9,12],[13,14],[15,16],[17,17],[18,18]];
export function explicitRanges(id:string):Limits[]{
  if(['core:human-personality','core:human-build','core:human-appearance'].includes(id))return coreNine;
  if(id==='core:human-religion')return [[3,3],[4,4],[5,6],[7,10],[11,15],[16,18]];
  if(id==='core:human-age')return [[3,3],[4,7],[8,12],[13,15],[16,17],[18,18]];
  if(id==='core:human-background'||['major-setback','minor-setback','minor-windfall','major-windfall','strange'].some(s=>id===`only-human:${s}`))return Array.from({length:20},(_,i)=>[i+1,i+1]);
  if(id==='only-human:parents')return [[3,4],[5,8],[9,12],[13,16],[17,18]];
  if(id==='only-human:siblings')return [[1,4],[5,8],[9,12],[13,16],[17,20]];
  if(id==='only-human:sibling-gender')return [[1,3],[4,6]];
  if(id==='only-human:sibling-age')return [[4,4],[5,14],[15,24]];
  if(id==='only-human:childhood')return [[null,3],[4,5],[6,8],[9,12],[13,15],[16,17],[18,null]];
  return standard;
}
export const numericOnlyIds=new Set(['core:human-background','core:human-personality','core:human-religion','core:human-age','core:human-build','core:human-appearance',
  ...['ancestors','family-circumstances','parents','siblings','sibling-gender','sibling-age','character-fate','death','age','build','appearance','childhood','life',
    'major-setback','minor-setback','minor-windfall','major-windfall','strange','personality','relationships','obligations','morality','religion','piety'].map(s=>`only-human:${s}`)]);
export const findingDispositions:Record<string,{status:string;reason:string}>={
  'fears-desires-columns':{status:'resolved-user-transcription',reason:'User confirmed all 12 numbered entries in independent Fears and Desires d6 tables. The Desires header Value is retained verbatim; no PDF verification is claimed.'},
  'profession-selector-stray-prose':{status:'resolved-boundary',reason:'Only six selector rows 14309–14314 are admitted; duplicated prose 14315–14318 is evidence/context, never an outcome.'},
  'dimension-order':{status:'manual-composition',reason:'Keep age, Build and elapsed years in source order with explicit Size exceptions; dimensional composition and age transitions require review/handler, no new Life rolls inferred.'},
  'death-multiplicity':{status:'manual-procedure',reason:'Both-parent death does not specify shared/separate cause rolls; record subject and GM decision rather than invent cardinality.'},
  'recursion':{status:'bounded-reference-only',reason:'Reference guards cover Piety and the published Strange reroll. Related-character recursion still requires subject IDs, lineage and pending state at a bound; no silent truncation.'},
  'outer-category-choice':{status:'manual-category-choice',reason:'Family result restricts category candidates. Choice is explicit; there is no authorized uniform die over the subset.'},
  'external-dependencies':{status:'conditional-manual',reason:'Source availability selects only the published branch. Missing handlers require adjudication; never grant both branches or silently reroll except Strange 19 without Tooth and Claw.'},
};
