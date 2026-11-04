import {z} from 'zod';

const dice=z.object({count:z.number().int().min(1).max(10),sides:z.number().int().min(2).max(100),modifier:z.number().int(),minimum:z.number().int().nonnegative()}).strict();
export const BackgroundPlanSchema=z.object({rowId:z.string().min(1),sourceId:z.string().min(1),evidenceIds:z.array(z.string()).min(1),
  state:z.object({target:z.enum(['insanity','corruption']),amount:z.number().int().nonnegative().nullable(),dice:dice.nullable()}).strict().nullable(),
  detail:z.object({key:z.string(),dice}).strict().nullable(),templateId:z.string().nullable(),programId:z.string().nullable(),
  keepsake:z.boolean(),appearanceChoice:z.boolean()}).strict().superRefine((p,ctx)=>{
    if(p.state&&((p.state.amount===null)===(p.state.dice===null)))ctx.addIssue({code:'custom',message:'State requires exactly one constant or dice expression'});
  });
export type BackgroundPlan=z.infer<typeof BackgroundPlanSchema>;
export function backgroundRolls(plan:BackgroundPlan) {
  return [...(plan.state?.dice?[{key:`background/${plan.rowId}/state`,...plan.state.dice}]:[]),
    ...(plan.detail?[{key:`background/${plan.rowId}/${plan.detail.key}`,...plan.detail.dice}]:[])];
}
/** Replay only: all dice must have been recorded by an explicit command. */
export function backgroundValues(plan:BackgroundPlan,rolls:Record<string,number[]>) {
  const values:Record<string,number>={};
  for(const spec of backgroundRolls(plan)) {
    const faces=rolls[spec.key];
    if(!faces||faces.length!==spec.count||faces.some(f=>!Number.isInteger(f)||f<1||f>spec.sides))throw new Error('Background: recorded-roll-invalid');
    values[spec.key]=Math.max(spec.minimum,faces.reduce((a,b)=>a+b,0)+spec.modifier);
  }
  return {state:plan.state?(plan.state.amount??values[`background/${plan.rowId}/state`]):null,
    detail:plan.detail?values[`background/${plan.rowId}/${plan.detail.key}`]:null};
}
