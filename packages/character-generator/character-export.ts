import {z} from 'zod';
import {consumableDigest} from '../curation/human-l0-consumable-bundle';
import {parseHumanL0MechanicalPacks} from '../curation/human-l0-mechanics';
import {HumanL0CharacterSchema} from './human-l0';
import {OfficialCoreDraftSchema,parseOfficialCoreDraft,parseOfficialCoreContext,calculateOfficialCore,type OfficialCoreContext} from './official-core';
import {ProcedureSessionSchema,ProcedureContextSchema,type ProcedureContext} from './procedure-model';
import {calculateProcedure} from './procedure-runtime';
import type {CharacterCompletion} from './character-finalization';
import {EquipmentPlacementSchema} from './core-equipment';
import {assertPermittedExportData} from './export-content-policy';

export const EXPORT_VERSION='1.0.0' as const;
export const MAX_EXPORT_BYTES=2_000_000;
const text=z.string().max(2000),hash=z.string().regex(/^[a-f0-9]{64}$/);
const reference=z.object({packId:text,version:text}).strict();
const source=z.object({packId:text,version:text,sourceId:text,sha256:hash,dependencies:z.array(reference)}).strict();
const pending=z.object({key:text,code:text}).strict();
export const CharacterSheetSchema=z.object({name:z.string().max(200),level:z.literal(0),
  stats:z.record(text,z.number().finite()),states:z.record(text,z.number().finite()),moneyBits:z.string().regex(/^\d+$/),
  dimensions:z.record(text,z.number().finite()),loadout:z.array(EquipmentPlacementSchema),
  inventory:z.array(z.object({key:text,itemId:text.nullable(),quantity:z.number().finite().nonnegative(),equipped:z.boolean()}).strict()),
  professions:z.array(z.object({key:text,id:text}).strict()),languages:z.array(z.object({id:text,abilities:z.array(z.enum(['speak','read','write']))}).strict()),
  deferredUse:z.array(pending),optionalOmissions:z.array(z.object({key:text}).strict()),
}).strict();
export type CharacterSheet=z.infer<typeof CharacterSheetSchema>;
// Explicit replay field allowlist, including nested character/event schemas. No unknown source payloads.
const coreReplay=OfficialCoreDraftSchema.extend({character:HumanL0CharacterSchema}).strict();
export const CharacterExportSchema=z.object({contract:z.literal('sotdl.character-export'),contractVersion:z.literal(EXPORT_VERSION),
  policy:z.literal('minimal-character-only@1'),contextSha256:hash,sources:z.array(source).min(1).max(2),sourceIds:z.array(text).min(1),sheet:CharacterSheetSchema,
  replay:z.discriminatedUnion('kind',[coreReplay,ProcedureSessionSchema]),
}).strict();
export type CharacterExport=z.infer<typeof CharacterExportSchema>;
export type ExportContext=OfficialCoreContext|ProcedureContext;
export function checkedCharacterExport(input:unknown,format:'json'|'sheet'='json'){
  const e=CharacterExportSchema.parse(input);
  assertPermittedExportData(format==='json'?e:{sheet:e.sheet,sources:e.sources,sourceIds:e.sourceIds,contextSha256:e.contextSha256});
  return e;
}
export function requireExportCompletion(c:CharacterCompletion){
  if(!c.fullyResolved||c.status!=='finalized'||!c.canFinalize||c.blockers.length)throw new Error('Exportação bloqueada: finalize o personagem no contexto local verificado.');
}
async function pins(context:ExportContext){
  return Promise.all(parseHumanL0MechanicalPacks(context.mechanicalPacks).map(async p=>({packId:p.packId,version:p.version,sourceId:p.source.id,
    sha256:await consumableDigest(p),dependencies:p.dependencies.map(d=>({packId:d.packId,version:d.version}))})));
}
function summary(base:{stats:unknown;states:unknown},name:string,moneyBits:string,inventory:CharacterSheet['inventory'],professions:CharacterSheet['professions'],languages:CharacterSheet['languages'],c:CharacterCompletion,dimensions:CharacterSheet['dimensions'],loadout:CharacterSheet['loadout']):CharacterSheet{
  return CharacterSheetSchema.parse({name,level:0,stats:base.stats,states:base.states,moneyBits,inventory,professions,languages,dimensions,loadout,
    deferredUse:c.deferredUse.map(p=>({key:p.key,code:p.code??'deferred-use'})),optionalOmissions:c.optionalOmissions.map(p=>({key:p.key}))});
}
/** Only calculation/replay here: never generation, advancement, finalization or RNG. */
export async function exportCharacter(input:unknown,context:ExportContext,includeUserData:boolean,format:'json'|'sheet'='json'):Promise<CharacterExport>{
  if(!includeUserData)throw new Error('Confirme a inclusão do nome e das decisões pessoais antes de exportar.');
  if('core' in context){
    const c=parseOfficialCoreContext(context),d=parseOfficialCoreDraft(input),v=await calculateOfficialCore(d,c);
    requireExportCompletion(v.completion);
    const replay=coreReplay.parse({schemaVersion:d.schemaVersion,kind:d.kind,contextSha256:d.contextSha256,prngVersion:d.prngVersion,config:d.config,
      character:d.character,rolls:d.rolls,choices:d.choices,equipped:d.equipped,adjudications:d.adjudications,interestingHistory:d.interestingHistory,
      equipmentLoadout:d.equipmentLoadout,equipmentUseContext:d.equipmentUseContext,equipmentHistory:d.equipmentHistory,finalization:d.finalization});
    const sheet=summary(v.base,d.config.name,v.moneyBits,v.inventory.map(i=>({key:i.key,itemId:i.itemId,quantity:i.quantity!,equipped:i.equipped})),
      v.professions.map(p=>({key:p.key,id:p.id})),v.languages.map(l=>({id:l.id,abilities:[...(l.speak?['speak' as const]:[]),...(l.read?['read' as const]:[]),...(l.write?['write' as const]:[])]})),v.completion,v.dimensions??{},v.equipment.loadout);
    return checkedCharacterExport({contract:'sotdl.character-export',contractVersion:EXPORT_VERSION,policy:'minimal-character-only@1',contextSha256:d.contextSha256,sources:await pins(c),sourceIds:[c.core.sourceId],sheet,replay},format);
  }
  const c=ProcedureContextSchema.parse(context),s=ProcedureSessionSchema.parse(input),v=await calculateProcedure(c,s);
  requireExportCompletion(v.completion);
  const replay=ProcedureSessionSchema.parse({schemaVersion:s.schemaVersion,kind:s.kind,id:s.id,seed:s.seed,prngVersion:s.prngVersion,contextSha256:s.contextSha256,initialConfig:s.initialConfig,events:s.events,finalization:s.finalization});
  const sheet=summary(v.base!,v.graph.state.config.name,v.material.knownCashBits,v.inventory.map(i=>({key:i.key,itemId:i.itemId,quantity:i.quantity!,equipped:v.graph.state.equipmentLoadout.some(p=>p.key===i.key)})),
    v.graph.professions.filter(p=>p.subject===v.graph.root).map(p=>({key:p.key,id:p.optionId})),
    v.graph.languages.filter(l=>l.subject===v.graph.root).map(l=>({id:l.languageId,abilities:l.abilities})),v.completion,
    {...(v.graph.dimensions??{}),...(v.graph.initialLifeCount===null?{}:{initialLifeCount:v.graph.initialLifeCount})},v.graph.state.equipmentLoadout);
  const sourceIds=[...new Set([...v.graph.nodes.filter(n=>n.status==='resolved').map(n=>n.sourceId),...v.inventory.map(i=>i.sourceId)])].filter(Boolean).sort();
  return checkedCharacterExport({contract:'sotdl.character-export',contractVersion:EXPORT_VERSION,policy:'minimal-character-only@1',contextSha256:s.contextSha256,sources:await pins(c),sourceIds,sheet,replay},format);
}
export function parseCharacterExport(json:string):CharacterExport{
  if(new TextEncoder().encode(json).length>MAX_EXPORT_BYTES)throw new Error('JSON excede o limite permitido.');
  const result=CharacterExportSchema.safeParse(JSON.parse(json));
  if(!result.success)throw new Error('Formato ou versão de exportação incompatível.');
  return result.data;
}
export async function importCharacter(json:string,context:ExportContext){
  const envelope=parseCharacterExport(json);
  if(('core' in context)!==(envelope.replay.kind==='sotdl-official-core-draft'))throw new Error('Abra o fluxo de criação correspondente ao JSON.');
  const recomputed=await exportCharacter(envelope.replay,context,true);
  if(await consumableDigest(envelope)!==await consumableDigest(recomputed))throw new Error('Contexto, versões, dependências ou valores divergentes; importação recusada.');
  return recomputed.replay;
}
export function serializeCharacter(e:CharacterExport){
  const json=JSON.stringify(checkedCharacterExport(e),null,2);
  if(new TextEncoder().encode(json).length>MAX_EXPORT_BYTES)throw new Error('Ficha excede o limite de exportação JSON.');
  return json;
}
