import { z } from 'zod';
import { HumanL0CharacterSchema, calculateHumanL0Character, parseHumanL0Character, type HumanL0Character } from './human-l0';
import { consumableDigest, consumableJson, parseConsumableBundle, type ConsumableBundle } from '../curation/human-l0-consumable-bundle';
import type { HumanL0ConsumableDocument, HumanL0ConsumableResolution } from '../curation/human-l0-consumable';

const id=z.string().regex(/^[a-z0-9][a-z0-9:_./#*+@-]{0,199}$/);
const originId=z.string().regex(/^[a-z0-9][a-z0-9:_./#*+@-]{0,899}$/);
export const ConsumableCommandSchema=z.discriminatedUnion('type',[
  z.object({type:z.literal('table'),tableId:id,columnId:id,faces:z.array(z.number().int().positive()).min(1).max(4),modifier:z.number().int().min(-100).max(100),parentActionId:id.optional()}).strict(),
  z.object({type:z.literal('lookup'),lookupId:id,priorActionId:id}).strict(),
  z.object({type:z.literal('grant'),grantId:id,priorActionId:id.optional(),optionId:id.optional()}).strict(),
  z.object({type:z.literal('equip'),itemOrigin:originId,equipped:z.boolean(),usage:z.enum(['equipped','wielded']).default('equipped')}).strict(),
]);
const action=z.object({id,selectionKey:z.string(),command:ConsumableCommandSchema}).strict();
export const ConsumableSessionSchema=z.object({
  schemaVersion:z.literal(1),kind:z.literal('sotdl-human-l0-consumable-session'),
  character:HumanL0CharacterSchema,bundleSha256:z.string().regex(/^[a-f0-9]{64}$/),actions:z.array(action).max(5000),
}).strict();
export type ConsumableSession=z.infer<typeof ConsumableSessionSchema>;
type Command=z.infer<typeof ConsumableCommandSchema>;
type Entry=HumanL0ConsumableResolution['consequences'][number];
type Consequence=Entry['consequence'];
type Outcome={actionId:string;tableId?:string;columnId?:string;rowId?:string;depth:number;nextTableId?:string;entries:Entry[]};
type Diagnostic={actionId:string;reason:string;retainsConsequence:true};
const fail=(code:string):never=>{throw new Error(`Human L0 consumables: ${code}.`);};
const selectionKey=(c:HumanL0Character)=>consumableJson(c.events.filter(e=>e.type==='create'||e.type==='select').at(-1));
export function parseConsumableSession(input:unknown):ConsumableSession {
  const parsed=ConsumableSessionSchema.safeParse(input);
  if(!parsed.success)return fail('session-invalid');
  const s=parsed.data;parseHumanL0Character(s.character);
  const seen=new Set<string>();
  for(const a of s.actions) {if(seen.has(a.id))return fail('duplicate-action');seen.add(a.id);}
  return s;
}
export async function newConsumableSession(character:unknown,bundleInput:unknown):Promise<ConsumableSession> {
  const bundle=await parseConsumableBundle(bundleInput);
  return {schemaVersion:1,kind:'sotdl-human-l0-consumable-session',character:parseHumanL0Character(character),bundleSha256:await consumableDigest(bundle),actions:[]};
}
const originKey=(o:Entry['origin'])=>`${o.publicationId}@null/${o.entityId}/${o.resultId??'null'}/${o.componentId??'null'}`;
function entry(doc:HumanL0ConsumableDocument,entityId:string,rowId:string,componentId:string,consequence:Consequence):Entry {
  // A table grant and its named grant are two access paths to the same entitlement.
  const named=doc.grants.find(g=>g.origin.entityId===entityId&&g.origin.resultId===rowId&&consumableJson(g.consequence)===consumableJson(consequence));
  const origin=named?.origin??{publicationId:'consumable-bundle',version:null,entityId,resultId:rowId,componentId};
  return {originKey:originKey(origin),origin,subject:named?.subject??'character',
    phase:consequence.kind==='effect'?consequence.effect.timing:'narrative',consequence};
}
function resolveAction(doc:HumanL0ConsumableDocument,cmd:Command,previous:Map<string,Outcome>,actionId:string,diagnose:(reason:string)=>void):Outcome {
  const out:Outcome={actionId,depth:0,entries:[]};
  if(cmd.type==='equip')return out;
  if(cmd.type==='table') {
    const col=doc.tables.find(t=>t.id===cmd.tableId)?.columns.find(c=>c.id===cmd.columnId);
    if(!col){diagnose('table-or-column-missing');return out;}
    if(cmd.faces.length!==col.dice.count||cmd.faces.some(f=>f>col.dice.sides))return fail('faces-invalid');
    const domain=col.modifierDomain;
    if(domain.kind==='pending'){diagnose(domain.reason);return out;}
    if(domain.kind==='authorized-rules'){diagnose('modifier-rule-context-required');return out;}
    if(domain.kind==='none'?cmd.modifier!==0:!domain.values.includes(cmd.modifier))return fail('modifier-unauthorized');
    if(cmd.parentActionId) {
      const parent=previous.get(cmd.parentActionId);
      if(parent?.nextTableId!==cmd.tableId){diagnose('subtable-parent-mismatch');return out;}
      out.depth=parent.depth+1;
      if(out.depth>=doc.recursion.maxDepth){diagnose('bounded-recursion');return out;}
    }
    const total=cmd.faces.reduce((a,b)=>a+b,0)+cmd.modifier;
    const row=col.rows.find(r=>(r.min===null||total>=r.min)&&(r.max===null||total<=r.max));
    if(!row){diagnose('result-missing');return out;}
    Object.assign(out,{tableId:cmd.tableId,columnId:cmd.columnId,rowId:row.id});
    out.entries=[entry(doc,cmd.tableId,row.id,cmd.columnId,row.consequence)];
    for(const side of doc.sideRolls)if(side.parent.tableId===cmd.tableId&&side.parent.columnId===cmd.columnId&&side.parent.rowId===row.id)
      diagnose('side-roll-context-required');
  } else if(cmd.type==='lookup') {
    const lookup=doc.lookups.find(q=>q.id===cmd.lookupId),prior=previous.get(cmd.priorActionId);
    const producer=doc.producedQueries.find(q=>q.id===lookup?.reads.queryId)?.producedBy;
    if(!lookup||!producer||prior?.tableId!==producer.tableId||prior.columnId!==producer.columnId||!prior.rowId){diagnose('lookup-prior-unavailable');return out;}
    const key=lookup.keys.find(k=>k.key===prior.rowId);
    if(!key){diagnose('lookup-unknown-key');return out;}
    out.entries=[entry(doc,lookup.id,key.key,'lookup',key.consequence)];
  } else {
    const grant=doc.grants.find(g=>g.id===cmd.grantId);
    if(!grant){diagnose('grant-missing');return out;}
    const condition=grant.precondition;
    if(condition.kind==='choice-selected'&&cmd.optionId!==condition.optionId){diagnose('choice-required');return out;}
    if(condition.kind==='prior-result') {
      const producer=doc.producedQueries.find(q=>q.id===condition.queryId)?.producedBy,prior=cmd.priorActionId?previous.get(cmd.priorActionId):undefined;
      if(!producer||prior?.tableId!==producer.tableId||prior.columnId!==producer.columnId||!prior.rowId){diagnose('grant-prior-unavailable');return out;}
      if(grant.origin.resultId!==null&&grant.origin.resultId!==prior.rowId){diagnose('grant-result-mismatch');return out;}
    }
    out.entries=[{originKey:originKey(grant.origin),origin:grant.origin,subject:grant.subject,
      phase:grant.consequence.kind==='effect'?grant.consequence.effect.timing:'narrative',consequence:grant.consequence}];
  }
  for(const e of out.entries)if(e.consequence.kind==='effect'&&e.consequence.effect.op==='follow-subtable')out.nextTableId=e.consequence.effect.tableId;
  return out;
}

/** Replay decisions against exact pinned content. No draw, inferred price, automatic source fallback or export. */
export async function calculateConsumableSession(input:unknown,mechanicalPacks:unknown,bundleInput:unknown) {
  const s=parseConsumableSession(input),base=await calculateHumanL0Character(s.character,mechanicalPacks);
  const diagnostics:Diagnostic[]=[],outcomes=new Map<string,Outcome>(),seen=new Set<string>();
  const inventory:{origin:string;itemId:string;quantity:number;unit:string;equipped:boolean;wielded:boolean}[]=[],languages:{languageId:string;abilities:'speak'|'read-write';origin:string}[]=[],professions:{professionId:string;origin:string}[]=[];
  let money=0n;
  const diagnose=(actionId:string,reason:string)=>diagnostics.push({actionId,reason,retainsConsequence:true});
  let bundle:ConsumableBundle|undefined;
  try {bundle=await parseConsumableBundle(bundleInput);if(await consumableDigest(bundle)!==s.bundleSha256)bundle=undefined;}catch{bundle=undefined;}
  if(!bundle||!base.baseResolved)diagnose('session',!bundle?'bundle-unavailable-or-changed':'mechanical-context-unresolved');
  const current=selectionKey(s.character);
  if(bundle&&base.baseResolved)for(const a of s.actions) {
    if(a.selectionKey!==current){diagnose(a.id,'selection-changed');continue;}
    const d=(reason:string)=>diagnose(a.id,reason),cmd=a.command;
    if(cmd.type==='equip') {
      const owned=inventory.find(i=>i.origin===cmd.itemOrigin);
      if(!owned){d('item-not-owned');continue;}
      if(cmd.usage==='equipped')owned.equipped=cmd.equipped;else owned.wielded=cmd.equipped;
      continue;
    }
    const result=resolveAction(bundle.document,cmd,outcomes,a.id,d);outcomes.set(a.id,result);
    if(cmd.type==='table'&&cmd.parentActionId&&result.rowId) {
      const fulfilled=diagnostics.findIndex(p=>p.actionId===cmd.parentActionId&&p.reason==='subtable-input-required');
      if(fulfilled>=0)diagnostics.splice(fulfilled,1);
    }
    for(const e of result.entries) {
      const key=`${e.originKey}|${e.subject}|${e.phase}`;
      if(seen.has(key))continue;seen.add(key);
      if(e.consequence.kind==='pending'){d(e.consequence.pending.reason);continue;}
      const effect=e.consequence.effect;
      if(e.subject!=='character'){d('non-character-subject');continue;}
      switch(effect.op) {
        case 'grant-language':languages.push({languageId:effect.languageId,abilities:effect.abilities,origin:e.originKey});break;
        case 'grant-profession':professions.push({professionId:effect.professionId,origin:e.originKey});break;
        case 'grant-currency':money+=BigInt(effect.bits);break;
        case 'grant-item': {
          const item=bundle.document.items.find(i=>i.id===effect.itemId);
          if(!item){d('item-definition-unavailable');break;}
          inventory.push({origin:e.originKey,itemId:item.id,quantity:effect.quantity,unit:effect.unit,equipped:false,wielded:false});
          if(item.onPossess.kind==='pending')d(item.onPossess.pending.reason);
          break;
        }
        case 'follow-subtable':d('subtable-input-required');break;
        case 'substitute-defense':d('equipment-context-required');break;
        case 'narrative-marker':case 'record-price':break;
      }
    }
  }
  const equipment:{base:'agility'|'fixed';value:number;origin:string}[]=[];
  if(bundle)for(const i of inventory)for(const phase of ['equipped','wielded'] as const) {
    if(!i[phase])continue;
    const item=bundle.document.items.find(item=>item.id===i.itemId)!;
    const use=phase==='equipped'?item.onEquip:item.onUse;
    if(use?.kind==='pending')diagnose(i.origin,use.pending.reason);
    else if(use?.kind==='effect'&&use.effect.op==='substitute-defense')equipment.push({base:use.effect.base,value:use.effect.value,origin:i.origin});
    else diagnose(i.origin,'equipment-handler-unavailable');
  }
  const view=equipment.length?await calculateHumanL0Character(s.character,mechanicalPacks,equipment):base;
  return {base:view,inventory,languages,professions,moneyBits:money.toString(),diagnostics,outcomes:[...outcomes.values()],
    fullyResolved:false as const,officialGenerationEnabled:false as const,exportEnabled:false as const};
}
export async function performConsumableCommand(input:unknown,mechanicalPacks:unknown,bundleInput:unknown,actionId:string,command:unknown):Promise<ConsumableSession> {
  const s=parseConsumableSession(input),cmd=ConsumableCommandSchema.parse(command);id.parse(actionId);
  const old=s.actions.find(a=>a.id===actionId),next={id:actionId,selectionKey:selectionKey(s.character),command:cmd};
  if(old){if(consumableJson(old)!==consumableJson(next))return fail('action-id-conflict');return s;}
  const bundle=await parseConsumableBundle(bundleInput);
  if(await consumableDigest(bundle)!==s.bundleSha256)return fail('bundle-changed');
  if(!(await calculateHumanL0Character(s.character,mechanicalPacks)).baseResolved)return fail('mechanical-context-unresolved');
  const result=parseConsumableSession({...s,actions:[...s.actions,next]});
  await calculateConsumableSession(result,mechanicalPacks,bundle);
  return result;
}
