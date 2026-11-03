import {BackgroundPlanSchema,type BackgroundPlan} from '../../packages/character-generator/core-background';
import type {CoreLocalDocument} from '../../packages/curation/human-l0-core-local';

/** Reviewed Core row identities, never matching UI labels to determine a consequence. */
export function projectBackgroundPlans(core:CoreLocalDocument):BackgroundPlan[] {
  const table=core.tables.find(t=>t.id==='core:human-background');
  if(!table||table.columns.length!==1||table.columns[0].rows.length!==20)throw new Error('Background: source-coverage');
  return table.columns[0].rows.map(row=>{
    const result=row.min;
    if(result===null||row.max!==result||row.id!==`core:human-background:r${result}`)throw new Error('Background: source-row');
    const mentions=core.backgroundStateMentions.filter(m=>m.rowId===row.id);
    if(mentions.length>1)throw new Error('Background: state-coverage');
    const mention=mentions[0];
    const expected=result===1?['insanity','1d6']:result===2||result===4?['corruption','1']:result===6?['insanity','1']:null;
    if(expected?(mention?.target!==expected[0]||mention?.amount!==expected[1]):!!mention)throw new Error('Background: state-source-mismatch');
    const template=core.templates.find(t=>t.tableId===table.id&&t.result===result);
    const program=row.bindings.find(b=>b.kind==='background-program')?.refId??null;
    if((result===13||result===14)!==!!template||(result===20)!==!!program)throw new Error('Background: grant-source-mismatch');
    const detail=result===3?{key:'prison-years',dice:{count:1,sides:6,modifier:0,minimum:0}}:
      result===7?{key:'captivity-years',dice:{count:1,sides:20,modifier:0,minimum:0}}:
      result===12?{key:'children-count',dice:{count:1,sides:6,modifier:-2,minimum:0}}:null;
    if(result===12&&!core.backgroundSideRolls.some(r=>r.tableId===table.id&&r.result===12&&r.expression==='1d6 - 2'&&r.minimum===0))throw new Error('Background: detail-source-mismatch');
    // Narrative dice are checked against the verified local row, not inferred as attribute modifiers.
    if(detail&& !row.text.includes(`1d${detail.dice.sides}`))throw new Error('Background: narrative-dice-mismatch');
    return BackgroundPlanSchema.parse({rowId:row.id,sourceId:core.sourceId,evidenceIds:row.evidenceIds,
      state:mention?{target:mention.target,amount:result===1?null:1,dice:result===1?{count:1,sides:6,modifier:0,minimum:0}:null}:null,
      detail,templateId:template?.id??null,programId:program,keepsake:result===18,appearanceChoice:result===9});
  });
}
