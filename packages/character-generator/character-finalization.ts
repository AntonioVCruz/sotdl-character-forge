import {z} from 'zod';
import {consumableDigest} from '../curation/human-l0-consumable-bundle';

export const FINALIZATION_VERSION='1.0.0' as const;
const hash=z.string().regex(/^[a-f0-9]{64}$/);
export const FinalizationReceiptSchema=z.object({contract:z.literal('sotdl.character-finalization'),contractVersion:z.literal(FINALIZATION_VERSION),
  contextSha256:hash,stateSha256:hash,invalidatedReason:z.literal('character-changed').nullable().default(null)}).strict();
export type FinalizationReceipt=z.infer<typeof FinalizationReceiptSchema>;
export type CompletionPending={key:string;code?:string;label:string;scope?:'creation'|'use'};
export type CompletionBlocker={key:string;code:string;label:string;action:string};
export function invalidateFinalization(receipt:FinalizationReceipt|null):FinalizationReceipt|null {
  return receipt?{...receipt,invalidatedReason:'character-changed'}:null;
}

/** Recompute obligations before considering a saved receipt. Neither hashes nor flags certify sources or rights. */
export async function evaluateCharacterCompletion(input:{contextSha256:string;savedContextSha256:string;sourceReady:boolean;mechanicalReady:boolean;materialReady:boolean;
  state:unknown;pending:CompletionPending[];receipt:FinalizationReceipt|null;optionalOmissions:{key:string;label:string}[]}){
  const blockers:CompletionBlocker[]=input.pending.filter(p=>p.scope!=='use').map(p=>({key:p.key,code:p.code??'creation-obligation',label:p.label,action:'Resolver ou revisar esta etapa da criação.'}));
  const contextValid=input.contextSha256===input.savedContextSha256;
  if(!contextValid)blockers.unshift({key:'context',code:'source-context-changed',label:'Fontes ou implementação mudaram; os dados salvos foram preservados.',action:'Conferir o contexto antes de retomar a criação.'});
  if(!input.sourceReady)blockers.unshift({key:'sources',code:'source-unavailable',label:'A finalização exige fontes locais verificadas e perfil autorizado.',action:'Restabelecer as fontes locais verificadas.'});
  if(!input.mechanicalReady)blockers.push({key:'mechanics',code:'mechanics-unresolved',label:'Atributos, características ou equipamento ainda não estão resolvidos.',action:'Resolver as escolhas mecânicas ou o conflito de equipamento.'});
  if(!input.materialReady)blockers.push({key:'material',code:'material-unresolved',label:'Há quantidades ou concessões materiais ainda não resolvidas.',action:'Resolver as alternativas e quantidades dos ganhos iniciais.'});
  const stateSha256=await consumableDigest({contractVersion:FINALIZATION_VERSION,state:input.state});
  const receipt=input.receipt,canFinalize=blockers.length===0;
  const invalidationReason=!receipt?null:!contextValid||receipt.contextSha256!==input.contextSha256?'Fontes ou implementação mudaram; a finalização anterior está suspensa.':
    receipt.invalidatedReason||receipt.stateSha256!==stateSha256?'O personagem mudou após a finalização. Revise as pendências e finalize novamente.':
    !canFinalize?'A revalidação encontrou obrigações pendentes; o personagem voltou a rascunho.':null;
  const status=receipt&&canFinalize&&!invalidationReason?'finalized' as const:'draft' as const;
  return {contract:'sotdl.character-completion' as const,contractVersion:FINALIZATION_VERSION,status,canFinalize,blockers,
    deferredUse:input.pending.filter(p=>p.scope==='use'),optionalOmissions:input.optionalOmissions,invalidationReason,contextSha256:input.contextSha256,stateSha256,
    fullyResolved:status==='finalized',exportEnabled:false as const};
}
export type CharacterCompletion=Awaited<ReturnType<typeof evaluateCharacterCompletion>>;
export function receiptForCompletion(completion:CharacterCompletion):FinalizationReceipt {
  if(!completion.canFinalize)throw new Error('Finalização bloqueada: resolva as pendências obrigatórias da criação.');
  return FinalizationReceiptSchema.parse({contract:'sotdl.character-finalization',contractVersion:FINALIZATION_VERSION,contextSha256:completion.contextSha256,stateSha256:completion.stateSha256,invalidatedReason:null});
}
