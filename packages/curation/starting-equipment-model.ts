import {z} from 'zod';

export const Currency=z.enum(['bits','cp','ss','gc']);
const factors={bits:1n,cp:10n,ss:100n,gc:1000n};
export function moneyToBits(amount:string,denomination:unknown){
  const unit=Currency.parse(denomination);
  if(!/^\d+(?:\.\d+)?$/.test(amount))throw new Error('Money requires an exact unsigned decimal string');
  const [whole,fraction='']=amount.split('.'),scale=10n**BigInt(fraction.length),numerator=(BigInt(whole)*scale+BigInt(fraction||'0'))*factors[unit];
  if(numerator%scale!==0n)throw new Error('Amount is smaller than one exact bit');
  return (numerator/scale).toString();
}
export const QuantitySchema=z.discriminatedUnion('kind',[
  z.object({kind:z.literal('constant'),value:z.number().int().nonnegative().safe()}).strict(),
  z.object({kind:z.literal('dice'),count:z.number().int().min(1).max(10),sides:z.number().int().min(2).max(100),modifier:z.number().int().min(0).max(100)}).strict(),
]);
export type Quantity=z.infer<typeof QuantitySchema>;
export type GrantNode={kind:'record';key:string;sourceLabel:string;recordKind:'item'|'companion'|'vehicle'|'property'|'entitlement'|'incantation';quantity:Quantity;unit:string;worth:{amount:Quantity;denomination:z.infer<typeof Currency>}|null}
  |{kind:'money';key:string;amount:Quantity;denomination:z.infer<typeof Currency>}
  |{kind:'choice';key:string;options:{id:string;label:string;grants:GrantNode[]}[]};
export const GrantNodeSchema:z.ZodType<GrantNode>=z.lazy(()=>z.discriminatedUnion('kind',[
  z.object({kind:z.literal('record'),key:z.string().min(1),sourceLabel:z.string().min(1),recordKind:z.enum(['item','companion','vehicle','property','entitlement','incantation']),
    quantity:QuantitySchema,unit:z.string().min(1),worth:z.object({amount:QuantitySchema,denomination:Currency}).strict().nullable()}).strict(),
  z.object({kind:z.literal('money'),key:z.string().min(1),amount:QuantitySchema,denomination:Currency}).strict(),
  z.object({kind:z.literal('choice'),key:z.string().min(1),options:z.array(z.object({id:z.string().min(1),label:z.string(),grants:z.array(GrantNodeSchema).min(1)}).strict()).min(2)}).strict(),
]));
export const GrantProgramSchema=z.object({id:z.string(),sourceId:z.string(),evidenceIds:z.array(z.string()).min(1),context:z.string(),grants:z.array(GrantNodeSchema)}).strict().superRefine((p,ctx)=>{
  const visit=(nodes:GrantNode[])=>{
    const keys=new Set<string>();for(const node of nodes){if(keys.has(node.key))ctx.addIssue({code:'custom',message:'Duplicate grant key'});keys.add(node.key);
      if(node.kind==='choice'){if(new Set(node.options.map(o=>o.id)).size!==node.options.length)ctx.addIssue({code:'custom',message:'Duplicate choice option'});node.options.forEach(o=>visit(o.grants));}}
  };visit(p.grants);
});
const Lifestyle=z.enum(['destitute','poor','getting-by','comfortable','wealthy','rich']);
const LifeEvent=z.object({id:z.string().min(1),tableId:z.enum(['only-human:life','only-human:major-setback','only-human:minor-setback','only-human:minor-windfall','only-human:major-windfall']),result:z.number().int().min(1).max(20)}).strict();
export function resolveStartingLifestyle(input:unknown){
  const q=z.object({procedure:z.enum(['core','only-human']),faces:z.tuple([z.number().int().min(1).max(6),z.number().int().min(1).max(6),z.number().int().min(1).max(6)]),events:z.array(LifeEvent)}).strict().parse(input);
  if(q.procedure==='core'&&q.events.length)throw new Error('Expanded lifestyle modifiers cannot modify Core Wealth');
  const ids=new Set<string>(),trace=[];
  for(const event of q.events){
    if(ids.has(event.id))throw new Error('Duplicate life-event identity');ids.add(event.id);
    if(event.tableId==='only-human:life'&&(event.result<3||event.result>18))throw new Error('Life Experience result outside 3d6');
    const r=event.result,t=event.tableId;
    const delta=t==='only-human:life'&&r>=9&&r<=12?1:t==='only-human:major-setback'&&[5,8].includes(r)?-3:t==='only-human:major-setback'&&r===10?-1:
      t==='only-human:minor-setback'&&[4,10,19].includes(r)?-1:t==='only-human:minor-windfall'&&[2,7].includes(r)?1:t==='only-human:major-windfall'&&[4,13].includes(r)?3:0;
    trace.push({...event,delta});
  }
  const rawTotal=q.faces.reduce((a,b)=>a+b,0),total=rawTotal+trace.reduce((a,b)=>a+b.delta,0);
  const limits=q.procedure==='core'?[4,8,13,16,17]:[3,5,12,15,17];
  const index=limits.findIndex(n=>total<=n),names=['destitute','poor','getting-by','comfortable','wealthy','rich']as const;
  return {procedure:q.procedure,rawTotal,total,lifestyle:names[index<0?5:index],trace,sourceId:q.procedure==='core'?'sotdl:shadow-of-the-demon-lord-core':'sotdl:only-human',otherLifeEffectsApplied:false};
}

/** Reference material preview. Missing side rolls/choices stay unresolved; no RNG or equipment effects. */
export function previewStartingGrants(programsInput:unknown,input:unknown){
  const programs=z.array(GrantProgramSchema).parse(programsInput),known=new Map(programs.map(p=>[p.id,p]));
  if(known.size!==programs.length)throw new Error('Duplicate grant program identity');
  const q=z.object({instances:z.array(z.object({eventId:z.string().min(1),programId:z.string(),subject:z.enum(['pc','family'])}).strict()),
    choices:z.record(z.string(),z.string()),rolls:z.record(z.string(),z.array(z.number().int()))}).strict().parse(input);
  const eventIds=new Set<string>(),records:unknown[]=[],money:unknown[]=[],unresolved:unknown[]=[];let cash=0n,cashComplete=true;
  const value=(expr:Quantity,key:string,sourceId:string,evidenceIds:string[])=>{
    if(expr.kind==='constant')return expr.value;
    const faces=q.rolls[key];if(!faces){unresolved.push({kind:'side-roll',key,dice:expr,sourceId,evidenceIds});return null;}
    if(faces.length!==expr.count||faces.some(n=>n<1||n>expr.sides))throw new Error(`Invalid side-roll faces: ${key}`);
    return faces.reduce((a,b)=>a+b,expr.modifier);
  };
  for(const instance of q.instances){
    if(eventIds.has(instance.eventId))throw new Error('Duplicate equipment origin event');eventIds.add(instance.eventId);
    const p=known.get(instance.programId);if(!p)throw new Error('Unknown grant program');if(instance.subject==='family')continue;
    const visit=(nodes:GrantNode[],prefix:string)=>{for(const node of nodes){
      const key=`${prefix}/${node.key}`,origin={programId:p.id,eventId:instance.eventId,sourceId:p.sourceId,evidenceIds:p.evidenceIds};
      if(node.kind==='choice'){
        const selection=q.choices[key];if(!selection){unresolved.push({kind:'choice',key,options:node.options.map(o=>({id:o.id,label:o.label})),...origin});continue;}
        const selected=node.options.find(o=>o.id===selection);if(!selected)throw new Error(`Unknown equipment alternative: ${key}`);
        visit(selected.grants,`${key}/${selected.id}`);
      }else if(node.kind==='money'){
        const amount=value(node.amount,`${key}/amount`,p.sourceId,p.evidenceIds),bits=amount===null?null:moneyToBits(String(amount),node.denomination);
        if(bits===null)cashComplete=false;else cash+=BigInt(bits);money.push({key,amount,denomination:node.denomination,bits,...origin});
      }else{
        const quantity=value(node.quantity,`${key}/quantity`,p.sourceId,p.evidenceIds);
        const worth=node.worth?value(node.worth.amount,`${key}/worth`,p.sourceId,p.evidenceIds):null;
        records.push({key,displayName:node.recordKind==='incantation'?'Incantation de rank 0':'Item fixo',sourceLabel:node.sourceLabel,
          recordKind:node.recordKind,quantity,unit:node.unit,worth:node.worth?{amount:worth,denomination:node.worth.denomination,bits:worth===null?null:moneyToBits(String(worth),node.worth.denomination)}:null,
          editable:true,autoEquipped:false,spellLearned:false,mechanicalEffects:[],...origin});
      }
    }};visit(p.grants,instance.eventId);
  }
  return {records,money,knownCashBits:cash.toString(),cashComplete,unresolved,materialComplete:unresolved.length===0,completeCharacter:false,otherEffectsApplied:false};
}
export const StartingLifestyleSchema=Lifestyle;
