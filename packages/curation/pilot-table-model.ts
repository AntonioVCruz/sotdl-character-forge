import {z} from 'zod';

const Id=z.string().min(1);
export const AuditDiceSchema=z.object({count:z.number().int().min(1).max(4),sides:z.number().int().min(2).max(20)}).strict();
export const AuditRowSchema=z.object({id:Id,min:z.number().int().nullable(),max:z.number().int().nullable(),text:Id,evidenceIds:z.array(Id).min(1)}).strict();
export type AuditRow=z.infer<typeof AuditRowSchema>;
export const AuditStreamSchema=z.object({id:Id,association:z.enum(['verified-transcription','reconstructed-text','needs-review']),rows:z.array(AuditRowSchema).min(1)}).strict();
export const AuditTableSchema=z.object({id:Id,sourceId:Id,evidenceIds:z.array(Id).min(1),kind:z.enum(['random','lookup','multi-column']),
  activation:Id,manualMode:Id,
  dice:AuditDiceSchema.nullable(),streams:z.array(AuditStreamSchema),lookupKeys:z.array(Id),
  modifierPolicy:z.enum(['none','family-childhood','life-lifestyle']),application:z.literal('reference-only-manual-effects'),
  automaticGeneration:z.literal(false),reviewNotes:z.array(Id)}).strict().superRefine((t,ctx)=>{
    if(t.kind==='lookup'&&(t.dice!==null||t.streams.length||new Set(t.lookupKeys).size!==6))ctx.addIssue({code:'custom',message:'Lifestyle lookup requires six distinct keys and no dice'});
    if(t.kind!=='lookup'&&(!t.dice||!t.streams.length||t.lookupKeys.length))ctx.addIssue({code:'custom',message:'Random table requires dice and streams'});
    if(new Set(t.streams.map(s=>s.id)).size!==t.streams.length)ctx.addIssue({code:'custom',message:'Duplicate stream'});
});

export function exactDiceDistribution(input:unknown){
  const dice=AuditDiceSchema.parse(input);let counts=new Map<number,bigint>([[0,1n]]);
  for(let i=0;i<dice.count;i++){const next=new Map<number,bigint>();for(const[total,ways]of counts)for(let face=1;face<=dice.sides;face++)next.set(total+face,(next.get(total+face)??0n)+ways);counts=next;}
  return {denominator:(BigInt(dice.sides)**BigInt(dice.count)).toString(),totals:[...counts].map(([total,ways])=>({total,ways:ways.toString()}))};
}
export function auditTableRanges(diceInput:unknown,rowsInput:unknown){
  const dice=AuditDiceSchema.parse(diceInput),rows=z.array(AuditRowSchema).parse(rowsInput),distribution=exactDiceDistribution(dice);
  const errors:string[]=[],ids=new Set<string>();
  for(const r of rows){if(ids.has(r.id))errors.push(`duplicate:${r.id}`);ids.add(r.id);if(r.min!==null&&r.max!==null&&r.min>r.max)errors.push(`reversed:${r.id}`);
    if(r.min!==null&&r.min>dice.count*dice.sides||r.max!==null&&r.max<dice.count)errors.push(`unreachable:${r.id}`);}
  const sorted=[...rows].sort((a,b)=>(a.min??-Infinity)-(b.min??-Infinity));
  for(let i=1;i<sorted.length;i++){const prev=sorted[i-1],cur=sorted[i];
    if(prev.max===null||cur.min===null||cur.min<=prev.max)errors.push(`overlap:${cur.id}`);
    else if(cur.min!==prev.max+1)errors.push(`gap:${cur.id}`);
  }
  const weights=new Map(rows.map(r=>[r.id,0n]));
  for(const total of distribution.totals){const matching=rows.filter(r=>(r.min===null||total.total>=r.min)&&(r.max===null||total.total<=r.max));
    if(matching.length!==1)errors.push(`coverage:${total.total}:${matching.length}`);
    else weights.set(matching[0].id,weights.get(matching[0].id)!+BigInt(total.ways));
  }
  return {complete:errors.length===0,errors,denominator:distribution.denominator,weights:[...weights].map(([rowId,ways])=>({rowId,ways:ways.toString(),denominator:distribution.denominator})),distribution:distribution.totals};
}

/** Explicit dice only; blocked associations and incomplete ranges never return a resolved result. */
export function resolveAuditedTable(tableInput:unknown,input:unknown){
  const table=AuditTableSchema.parse(tableInput),q=z.object({faces:z.array(z.number().int()),streamId:Id.default('main'),modifier:z.number().int().default(0),activeSourceIds:z.array(Id)}).strict().parse(input);
  if(!q.activeSourceIds.includes(table.sourceId))return {resolved:false,reason:'disabled-source',row:null,automaticGeneration:false};
  if(!table.dice)throw new Error('Lifestyle lookup does not take random faces');
  if(q.faces.length!==table.dice.count||q.faces.some(f=>f<1||f>table.dice!.sides))throw new Error('Faces do not match the published dice');
  if(table.modifierPolicy==='none'&&q.modifier!==0)throw new Error('Modifier is not authorized for this table');
  if(table.modifierPolicy==='family-childhood'&&![-6,-3,-1,0,1,3,6].includes(q.modifier))throw new Error('Unknown family modifier');
  const stream=table.streams.find(s=>s.id===q.streamId);if(!stream)throw new Error('Unknown table column/stream');
  const audit=auditTableRanges(table.dice,stream.rows),rawTotal=q.faces.reduce((a,b)=>a+b,0),total=rawTotal+q.modifier;
  if(!audit.complete||stream.association==='needs-review')return {resolved:false,reason:!audit.complete?'incomplete-ranges':'unverified-column-association',row:null,rawTotal,total,automaticGeneration:false};
  const row=stream.rows.find(r=>(r.min===null||total>=r.min)&&(r.max===null||total<=r.max));
  return {resolved:!!row,reason:row?'reference-result-only':'outside-range',row:row?structuredClone(row):null,rawTotal,total,automaticGeneration:false,mechanicalEffectsApplied:false};
}

/** A safety bound leaves a pending state; it never discards a published outcome or silently rerolls. */
export function reviewPietySequence(input:unknown){
  const q=z.object({totals:z.array(z.number().int().min(3).max(18)).min(1),maxSteps:z.number().int().min(1).max(100)}).strict().parse(input);
  let repetitions=0,insanity=0,religionRolls=0;
  for(let i=0;i<q.totals.length&&i<q.maxSteps;i++){
    const n=q.totals[i];
    if(n===3){religionRolls++;if(repetitions>0)insanity++;repetitions++;continue;}
    if(i!==q.totals.length-1)throw new Error('Piety sequence contains unused results after termination');
    if(n===18)insanity++;
    return {resolved:true,finalTotal:n,insanity,religionRolls,steps:i+1,pending:null,effectsApplied:false};
  }
  return {resolved:false,finalTotal:null,insanity,religionRolls,steps:Math.min(q.totals.length,q.maxSteps),pending:q.totals.length>=q.maxSteps?'execution-bound':'next-piety-roll',effectsApplied:false};
}
export function reviewStrangeSequence(input:unknown){
  const q=z.object({faces:z.array(z.number().int().min(1).max(20)).min(1),toothAndClawEnabled:z.boolean(),maxSteps:z.number().int().min(1).max(100)}).strict().parse(input);
  for(let i=0;i<q.faces.length&&i<q.maxSteps;i++){
    const n=q.faces[i];if(n===19&&!q.toothAndClawEnabled)continue;
    if(i!==q.faces.length-1)throw new Error('Strange sequence contains unused results');
    return {resolved:true,result:n,steps:i+1,pending:n===19?'skinchanger-handler':null,effectsApplied:false};
  }
  return {resolved:false,result:null,steps:Math.min(q.faces.length,q.maxSteps),pending:q.faces.length>=q.maxSteps?'execution-bound':'published-reroll-ignoring-19',effectsApplied:false};
}
export function reviewCoreBackgroundChildren(faceInput:unknown){
  const face=z.number().int().min(1).max(6).parse(faceInput);
  return {face,children:Math.max(0,face-2),minimum:0,effectsApplied:false};
}
export function composeSelectorWeights(rootId:string,tablesInput:unknown){
  const tables=z.array(AuditTableSchema).parse(tablesInput),root=tables.find(t=>t.id===rootId);
  if(!root?.dice||root.streams.length!==1||root.streams[0].association==='needs-review')throw new Error('Selector is not numerically approved');
  const parent=auditTableRanges(root.dice,root.streams[0].rows);if(!parent.complete)throw new Error('Incomplete selector');
  return root.streams[0].rows.flatMap(row=>{
    const child=tables.find(t=>t.id===row.text);
    if(!child?.dice||child.sourceId!==root.sourceId||child.streams.length!==1||child.streams[0].association==='needs-review')throw new Error('Selector target missing, ambiguous or from another source');
    const audit=auditTableRanges(child.dice,child.streams[0].rows);if(!audit.complete)throw new Error('Incomplete selector child');
    const weight=parent.weights.find(w=>w.rowId===row.id)!;
    return audit.weights.map(w=>({parentRowId:row.id,tableId:child.id,rowId:w.rowId,ways:(BigInt(weight.ways)*BigInt(w.ways)).toString(),denominator:(BigInt(parent.denominator)*BigInt(audit.denominator)).toString()}));
  });
}
