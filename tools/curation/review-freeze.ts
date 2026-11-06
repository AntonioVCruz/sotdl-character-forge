import {createHash} from 'node:crypto';
import {canonicalJson} from './canonical-json';
import {AuditTableSchema,auditTableRanges,composeSelectorWeights} from '../../packages/curation/pilot-table-model';

export const digest=(value:string|Uint8Array)=>createHash('sha256').update(value).digest('hex');
export type Fingerprint={scope:'implementation'|'source'|'pdf';path:string;sha256:string};

/** Order-independent inventory. Duplicate identities are an error, not last-write-wins. */
export function freezeInventory(entries:Fingerprint[]){
  const keys=entries.map(e=>`${e.scope}:${e.path}`);
  if(new Set(keys).size!==keys.length)throw new Error('Duplicate freeze input');
  for(const e of entries)if(!/^[a-f0-9]{64}$/.test(e.sha256))throw new Error('Invalid freeze digest');
  return [...entries].sort((a,b)=>`${a.scope}:${a.path}`<`${b.scope}:${b.path}`?-1:1);
}
export function changedInputs(expected:Fingerprint[],actual:Fingerprint[]){
  const before=new Map(freezeInventory(expected).map(e=>[`${e.scope}:${e.path}`,e.sha256]));
  const after=new Map(freezeInventory(actual).map(e=>[`${e.scope}:${e.path}`,e.sha256]));
  return [...new Set([...before.keys(),...after.keys()])].filter(k=>before.get(k)!==after.get(k)).sort();
}

/** Recompute rather than trusting a stored "complete" flag. Weights stay local. */
export function reviewProbabilities(input:unknown,selectors:string[]){
  const tables=AuditTableSchema.array().parse(input);
  const streams=tables.flatMap(t=>t.streams.map(s=>{
    const result=auditTableRanges(t.dice,s.rows);
    if(!result.complete)throw new Error(`Incomplete probability stream: ${t.id}/${s.id}`);
    return {tableId:t.id,streamId:s.id,...result};
  }));
  const composed=selectors.map(id=>({tableId:id,weights:composeSelectorWeights(id,tables)}));
  return {tables:tables.length,streams,selectors:composed,lookups:tables.filter(t=>t.kind==='lookup').length};
}

/** Explicit metadata allowlist: never spread a source entity into a distributable artifact. */
export function traceEntity(lot:string,entity:{id:string;sourceId?:string;evidenceIds?:string[]},
  evidence:Map<string,{id:string;sourceId:string;path:string;inputSha256:string;startLine:number;endLine:number;excerptSha256:string}>,
  handler:string,test:string){
  const refs=(entity.evidenceIds??[]).map(id=>{
    const e=evidence.get(id);if(!e)throw new Error(`Unbound evidence: ${lot}/${id}`);
    return {id:e.id,sourceId:e.sourceId,path:e.path,inputSha256:e.inputSha256,
      startLine:e.startLine,endLine:e.endLine,excerptSha256:e.excerptSha256};
  });
  return {lot,id:entity.id,sourceIds:[...new Set([...(entity.sourceId?[entity.sourceId]:[]),...refs.map(e=>e.sourceId)])].sort(),
    evidence:refs,handler,test,review:'issue55-scoped-review',destination:'local-only',
    distributionApproved:false};
}
export const artifactDigest=(value:unknown)=>digest(canonicalJson(value));
