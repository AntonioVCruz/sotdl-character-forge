import {z} from 'zod';
import {AuditTableSchema} from '../curation/pilot-table-model';
import {ProfessionOptionSchema} from '../curation/profession-language-model';
import {GrantProgramSchema} from '../curation/starting-equipment-model';
import {ThingOutcomeSchema} from '../curation/interesting-things-model';
import {PilotItemSchema,ItemReferenceSchema} from '../curation/pilot-item-model';
import {BackgroundPlanSchema} from './core-background';
import {ThingApplicationPlanSchema} from './core-interesting-things';
import {EquipmentPlacementSchema,EquipmentUseContextSchema,EquipmentRulesSchema,emptyEquipmentContext} from './core-equipment';
import {PRNG_VERSION} from '../random-tables';

const id=z.string().min(1),hash=z.string().regex(/^[a-f0-9]{64}$/),ability=z.enum(['speak','read','write']);
export const ProcedureDiceSchema=z.object({count:z.number().int().min(1).max(10),sides:z.number().int().min(2).max(100),modifier:z.number().int().default(0),minimum:z.number().int().nullable().default(null)}).strict();
const languageChoice=z.object({count:z.number().int().positive(),abilities:z.array(ability),target:z.string().optional()}).strict();
const professionRoll=z.object({tableId:id,count:z.number().int().positive().optional(),repeat:z.literal('one-per-remembered-life').optional()}).strict();
const professionOption=z.object({optionId:id,allowedSubchoices:z.array(id).optional(),specialization:z.string().optional()}).strict();
export const ProcedureTemplateSchema=z.object({id,sourceId:id,evidenceIds:z.array(id),tableId:id,rowIds:z.array(id),
  languages:z.array(z.object({languageId:id,abilities:z.array(ability),requirePreviouslySpoken:z.boolean().optional()}).strict()).optional(),
  languageChoice:languageChoice.optional(),professionRoll:professionRoll.optional(),countRoll:z.object({count:z.number().int(),sides:z.number().int()}).strict().optional(),
  professionChoice:z.object({count:z.number().int().positive(),categories:z.array(id).optional(),optionId:id.optional(),specialization:z.string().optional(),options:z.array(professionOption).optional()}).strict().optional(),
  professionGrant:z.object({kind:z.literal('inherit-family-profession').optional(),optionId:id.optional(),specialization:z.string().optional(),count:z.number().int().optional(),orphanFallbackCategories:z.array(id).optional(),missingFamilyProfession:z.string().optional(),ifNotAlreadyPresent:z.boolean().optional()}).strict().optional(),
  additionalChoice:z.object({count:z.number().int(),options:z.array(professionOption)}).strict().optional(),
  exclusiveChoice:z.array(z.object({languageChoice:languageChoice.optional(),professionRoll:professionRoll.optional()}).strict()).optional(),sequence:z.string().optional(),
}).strict();
export const ProcedureContextSchema=z.object({contract:z.literal('sotdl.human-creation'),contractVersion:z.literal('1.0.0'),fictionalData:z.boolean(),
  policy:z.object({enabled:z.boolean(),authority:z.enum(['explicit-user-request','fictional-test']),deadParents:z.literal('independent-cause-per-parent'),dimensions:z.literal('build-then-age-scale'),lifeCount:z.literal('initial-age-roll'),maxNodes:z.number().int().min(20).max(1000),maxCycleSteps:z.number().int().min(1).max(100),maxRelativeDepth:z.number().int().min(0).max(4)}).strict(),
  sources:z.object({core:id,onlyHuman:id,oddities:id}).strict(),implementationSha256:hash,mechanicalPacks:z.array(z.unknown()),
  tables:z.array(AuditTableSchema),lookups:z.array(z.object({tableId:id,rows:z.array(z.object({key:id,text:z.string(),evidenceIds:z.array(id)}).strict()),selector:z.literal('same-starting-lifestyle'),extraDice:z.literal(false)}).strict()),
  professions:z.array(ProfessionOptionSchema),templates:z.array(ProcedureTemplateSchema),
  programs:z.array(GrantProgramSchema),lifestylePrograms:z.array(z.object({procedure:z.enum(['core','only-human']),lifestyle:id,programId:id}).strict()),
  professionPrograms:z.array(z.object({optionId:id,programId:id.nullable(),reason:z.string()}).strict()),
  extraPrograms:z.array(z.object({trigger:id,programId:id,condition:z.string().optional()}).strict()),
  languageOptions:z.array(z.object({id,label:id,defaultAbilities:z.array(ability),evidenceIds:z.array(id)}).strict()),
  thingTables:z.array(z.object({id,sourceId:id,outcomes:z.array(ThingOutcomeSchema)}).strict()),
  thingVariants:z.array(z.object({id,sourceId:id,selectorId:id,selectorSides:z.number().int().positive(),routes:z.array(z.object({min:z.number().int(),max:z.number().int(),tableId:id}).strict())}).strict()),
  thingPlans:z.array(ThingApplicationPlanSchema),backgroundPlans:z.array(BackgroundPlanSchema),itemDefinitions:z.array(PilotItemSchema),itemReferences:z.array(ItemReferenceSchema),equipmentRules:EquipmentRulesSchema,
  evidence:z.array(z.object({id,sourceId:id,path:id,inputSha256:hash,startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerptSha256:hash}).strict()),
  inputs:z.array(z.object({path:id,sha256:hash}).strict()),
}).strict();
export type ProcedureContext=z.infer<typeof ProcedureContextSchema>;
const attr=z.enum(['strength','agility','intellect','will']);
export const ProcedureConfigSchema=z.object({name:z.string().max(200),variant:z.enum(['core','only-human']),attributeMode:z.enum(['fixed','random']),increase:attr,
  adjustment:z.object({increase:attr,decrease:attr}).strict().nullable(),size:z.union([z.literal(0.5),z.literal(1)]),procedure:z.enum(['core','human-development']),
  interestingVariant:z.enum(['core','oddities']),mode:z.enum(['manual','hybrid','random']),allowUniformChoices:z.boolean(),
  coreBenefit:z.enum(['speak-language','random-profession']).nullable(),optionalCoreTables:z.array(id),
  supplements:z.array(z.enum(['companion','tooth-and-claw','terrible-beauty','tombs'])),relativeDetails:z.array(id),
}).strict().superRefine((c,ctx)=>{
  if(c.variant==='core'&&c.attributeMode==='random')ctx.addIssue({code:'custom',message:'Core ancestry has no random attribute mode'});
  if(c.adjustment&&c.adjustment.increase===c.adjustment.decrease)ctx.addIssue({code:'custom',message:'Attribute transfer requires distinct attributes'});
  if(!(c.variant==='core'&&c.procedure==='core')&&c.coreBenefit!==null)ctx.addIssue({code:'custom',message:'Core benefit is exclusive to Core ancestry and procedure'});
  if(c.variant==='core'&&c.procedure==='core'&&c.coreBenefit===null)ctx.addIssue({code:'custom',message:'Choose the exclusive Core benefit'});
});
export type ProcedureConfig=z.infer<typeof ProcedureConfigSchema>;
export const defaultProcedureConfig=():ProcedureConfig=>({name:'',variant:'core',attributeMode:'fixed',increase:'strength',adjustment:null,size:1,procedure:'core',interestingVariant:'oddities',mode:'manual',allowUniformChoices:false,coreBenefit:'random-profession',optionalCoreTables:[],supplements:[],relativeDetails:[]});
export const ProcedureAdjudicationSchema=z.object({name:z.string().trim().min(1).max(500),author:z.string().trim().min(1).max(120),reason:z.string().trim().min(1).max(500),definitionId:z.string().optional()}).strict();
export type ProcedureAdjudication=z.infer<typeof ProcedureAdjudicationSchema>;
const result=z.discriminatedUnion('method',[
  z.object({method:z.literal('roll'),faces:z.array(z.number().int().positive()).min(1).max(10),rollIndex:z.number().int().nonnegative()}).strict(),
  z.object({method:z.literal('record-faces'),faces:z.array(z.number().int().positive()).min(1).max(10)}).strict(),
  z.object({method:z.literal('manual'),value:z.union([z.string(),z.number()])}).strict(),
  z.object({method:z.literal('application-uniform'),value:z.union([z.string(),z.number()]),consented:z.literal(true),rollIndex:z.number().int().nonnegative()}).strict(),
  z.object({method:z.literal('adjudication'),decision:ProcedureAdjudicationSchema}).strict(),
]);
export const ProcedureEventSchema=z.discriminatedUnion('type',[
  z.object({type:z.literal('result'),id,seq:z.number().int().positive(),key:id,signature:id,result}).strict(),
  z.object({type:z.literal('lock'),id,seq:z.number().int().positive(),key:id,locked:z.boolean()}).strict(),
  z.object({type:z.literal('config'),id,seq:z.number().int().positive(),config:ProcedureConfigSchema}).strict(),
  z.object({type:z.literal('restart'),id,seq:z.number().int().positive()}).strict(),
  z.object({type:z.literal('equipment'),id,seq:z.number().int().positive(),loadout:z.array(EquipmentPlacementSchema),useContext:EquipmentUseContextSchema}).strict(),
]);
export type ProcedureEvent=z.infer<typeof ProcedureEventSchema>;
export type ProcedureResultEvent=Extract<ProcedureEvent,{type:'result'}>;
export const ProcedureSessionSchema=z.object({schemaVersion:z.literal(1),kind:z.literal('sotdl-human-creation-session'),id,seed:z.string().trim().min(1).max(200),prngVersion:z.literal(PRNG_VERSION),contextSha256:hash,
  initialConfig:ProcedureConfigSchema,events:z.array(ProcedureEventSchema).max(10000)}).strict();
export type ProcedureSession=z.infer<typeof ProcedureSessionSchema>;
export type ProcedureNode={key:string;label:string;subject:string;parents:string[];kind:'table'|'profession'|'dice'|'choice'|'number'|'adjudication'|'lookup'|'config';
  sourceId:string;tableId?:string;streamId?:string;dice?:z.infer<typeof ProcedureDiceSchema>;modifier?:number;manualAllowed?:boolean;
  options?:{id:string;label:string;eligible?:boolean}[];freeText?:boolean;minimum?:number;maximum?:number|null;automaticValue?:string|number;
  signature:string;locked:boolean;status:'pending'|'needs-review'|'blocked'|'resolved';value:string|number|null;faces:number[];record?:ProcedureResultEvent;
  rowId?:string;rawTotal?:number;total?:number;text?:string;reason?:string;evidenceIds:string[]};
export type ProcedurePending={key:string;code:string;label:string;scope:'creation'|'use';subject:string};
export type ProcedureProfession={key:string;optionId:string;specialization:string;sourceId:string;evidenceIds:string[];subject:string};
export type ProcedureLanguage={key:string;languageId:string;abilities:('speak'|'read'|'write')[];sourceId:string;evidenceIds:string[];subject:string};
export type ProcedureStateGrant={key:string;target:'insanity'|'corruption';amount:number;subject:string;sourceId:string;evidenceIds:string[]};
export type ProcedureProgramInstance={eventId:string;programId:string;subject:'pc'|'family'};
export type ProcedureReplayState={config:ProcedureConfig;attempt:number;latest:Map<string,ProcedureResultEvent>;locks:Map<string,boolean>;equipmentLoadout:z.infer<typeof EquipmentPlacementSchema>[];equipmentUseContext:z.infer<typeof EquipmentUseContextSchema>};
export function replayProcedureSession(input:unknown):{session:ProcedureSession;state:ProcedureReplayState} {
  const session=ProcedureSessionSchema.parse(input),state:ProcedureReplayState={config:session.initialConfig,attempt:0,latest:new Map(),locks:new Map(),equipmentLoadout:[],equipmentUseContext:emptyEquipmentContext()};
  for(const [i,event] of session.events.entries()){
    if(event.seq!==i+1||event.id!==`creation-${i+1}`)throw new Error('Procedure: invalid event sequence');
    if(event.type==='result')state.latest.set(event.key,event);
    if(event.type==='lock')state.locks.set(event.key,event.locked);
    if(event.type==='config')state.config=event.config;
    if(event.type==='restart'){state.attempt++;state.equipmentLoadout=[];state.equipmentUseContext=emptyEquipmentContext();}
    if(event.type==='equipment'){state.equipmentLoadout=event.loadout;state.equipmentUseContext=event.useContext;}
  }
  return {session,state};
}
export const procedureSignature=(value:unknown)=>{
  const stable=(v:unknown):string=>Array.isArray(v)?`[${v.map(stable).join(',')}]`:v&&typeof v==='object'?`{${Object.entries(v).sort(([a],[b])=>a.localeCompare(b,'en')).map(([k,x])=>`${JSON.stringify(k)}:${stable(x)}`).join(',')}}`:JSON.stringify(v);
  let h=2166136261;for(const c of stable(value)){h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;}return h.toString(16).padStart(8,'0');
};
