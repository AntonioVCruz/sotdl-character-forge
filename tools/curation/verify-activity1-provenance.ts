import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { canonicalJson } from './canonical-json';
import { main as check16 } from './creation-table-inventory';
import { main as check17 } from './professions-languages-formalizer';
import { main as check18 } from './wealth-equipment-formalizer';
import { main as check19 } from './interesting-things-formalizer';
import { main as check20 } from './pilot-items-formalizer';
import { main as check21 } from './pilot-table-closure';
import { ProvenanceReconciliationSchema, RECONCILED_PATHS, sha256, verifyProvenanceTransition } from './provenance-reconciliation';

export const ACTIVITY1_VERIFICATION='curation/reviews/issue34-activity1-local-verification.json';
export const RECONCILIATION='curation/reviews/issue34-activity1-provenance-2026-11-02.json';
const hash=z.string().regex(/^[a-f0-9]{64}$/);
export const Activity1VerificationSchema=z.object({
  schemaVersion:z.literal(1),issue:z.literal(34),activity:z.literal(1),reviewDate:z.literal('2026-11-02'),reviewer:z.literal('Codex'),
  status:z.literal('passed'),scope:z.literal('local-byte-provenance-and-generated-artifacts'),
  matrixCanonicalSha256:hash,reconciliationCanonicalSha256:hash,historicalReviewCanonicalSha256:hash,
  files:z.array(z.object({path:z.string(),bytes:z.number().int().nonnegative(),sha256:hash}).strict()).min(12).max(5000),
  roots:z.array(z.string()).length(12),
  sourcePins:z.array(z.object({evidenceId:z.string(),path:z.string(),sha256:hash}).strict()).length(8),
  counts:z.object({files:z.number().int().positive(),referenceEdges:z.number().int().positive(),outputEdges:z.number().int().positive(),
    reconciledArtifacts:z.literal(12),declaredRecordsVerified:z.literal(258),numericFlows:z.literal(70),contextualDiceMentions:z.literal(77)}).strict(),
  preserved:z.object({payloadsUnchanged:z.literal(true),inputsUnchanged:z.literal(true),historicalReviewUnchanged:z.literal(true),
    officialGenerationEnabled:z.literal(false),pdfInspected:z.literal(false),sourceAuthorized:z.literal(false)}).strict(),
  retainedBlockerIds:z.array(z.string()),
}).strict().superRefine((v,c)=>{
  if(new Set(v.files.map(f=>f.path)).size!==v.files.length||new Set(v.sourcePins.map(f=>f.evidenceId)).size!==8||
    new Set(v.roots).size!==12||v.roots.some(p=>!RECONCILED_PATHS.includes(p))||v.counts.files!==v.files.length)
    c.addIssue({code:'custom',message:'Verification inventory invalid.'});
});
export function safeInputPath(path:string) {
  if(!/^(curation|rules|tools|packages|tests|docs)\/[a-zA-Z0-9_./%-]+$/.test(path)||path.split('/').some(s=>s==='..'||!s))throw new Error('Provenance input path invalid.');
  return path;
}
/** Hash bytes, not normalized text. LF/CRLF tolerance belongs only to the public matrix snapshot test. */
export async function verifyByteGraph(root:string,roots:string[],expectedInput:unknown) {
  const parsed=z.array(z.object({path:z.string(),bytes:z.number().int().nonnegative(),sha256:hash}).strict()).safeParse(expectedInput);
  if(!parsed.success||new Set(parsed.data.map(f=>f.path)).size!==parsed.data.length)throw new Error('Provenance file inventory invalid.');
  const expected=new Map(parsed.data.map(f=>[safeInputPath(f.path),f])),seen=new Set<string>();
  let referenceEdges=0,outputEdges=0;
  async function visit(path:string) {
    safeInputPath(path);if(seen.has(path))return;seen.add(path);
    const ref=expected.get(path);if(!ref)throw new Error('Provenance file missing from inventory.');
    let bytes:Buffer;try{bytes=await readFile(resolve(root,path));}catch{throw new Error('Provenance file unavailable.');}
    if(bytes.length!==ref.bytes||sha256(bytes)!==ref.sha256)throw new Error('Provenance raw byte hash mismatch.');
    if(!path.endsWith('.json'))return;
    let document:unknown;try{document=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new Error('Provenance JSON invalid.');}
    if(!document||Array.isArray(document)||typeof document!=='object')return;
    for(const key of ['inputRefs','outputs'] as const) {
      if(!(key in document))continue;
      const refs=(document as Record<string,unknown>)[key];
      if(!Array.isArray(refs))continue;
      for(const item of refs) {
        if(!item||typeof item!=='object'||!('path' in item)||!('sha256' in item))throw new Error('Provenance reference invalid.');
        const r=item as {path:string;sha256:string};referenceEdges++;if(key==='outputs')outputEdges++;
        if(!expected.has(safeInputPath(r.path))||expected.get(r.path)!.sha256!==r.sha256)throw new Error('Provenance reference hash mismatch.');
        await visit(r.path);
      }
    }
  }
  for(const p of roots)await visit(p);
  if(seen.size!==expected.size)throw new Error('Provenance inventory has unreachable files.');
  return {files:seen.size,referenceEdges,outputEdges};
}

export async function verifyActivity1(root=process.cwd()) {
  async function json(path:string) {try{return JSON.parse(await readFile(resolve(root,safeInputPath(path)),'utf8'));}catch{throw new Error('Activity 1 metadata unavailable or invalid.');}}
  const parsed=Activity1VerificationSchema.safeParse(await json(ACTIVITY1_VERIFICATION));
  const reconciliation=ProvenanceReconciliationSchema.safeParse(await json(RECONCILIATION));
  if(!parsed.success||!reconciliation.success)throw new Error('Activity 1 attestation schema invalid.');
  const v=parsed.data,r=reconciliation.data;
  if(sha256(canonicalJson(r))!==v.reconciliationCanonicalSha256)throw new Error('Reconciliation attestation changed.');
  if(sha256(canonicalJson(await json('curation/reviews/human-l0-base-2026-11-02.json')))!==v.historicalReviewCanonicalSha256)throw new Error('Historical review changed.');
  const graph=await verifyByteGraph(root,v.roots,v.files);
  if(graph.files!==v.counts.files||graph.referenceEdges!==v.counts.referenceEdges||graph.outputEdges!==v.counts.outputEdges)throw new Error('Activity 1 graph accounting mismatch.');
  for(const t of r.transitions)verifyProvenanceTransition(await readFile(resolve(root,t.path)),t,t.previousSha256);
  if(sha256(await readFile(resolve(root,r.producerChange.path)))!==r.producerChange.currentSha256)throw new Error('Producer changed after reconciliation.');
  const matrix=await json('docs/matriz-lacunas-issue34-atividade1.json');
  if(sha256(canonicalJson(matrix))!==v.matrixCanonicalSha256)throw new Error('Structural matrix changed after local verification.');
  for(const pin of v.sourcePins) {
    const e=matrix.records.find((e:{id:string})=>e.id===pin.evidenceId);
    if(!e?.capabilities.includes(`sha256:${pin.sha256}`)||sha256(await readFile(resolve(root,safeInputPath(pin.path))))!==pin.sha256)throw new Error('Declared source pin mismatch.');
  }
  const hashRows=matrix.records.filter((e:{evidence:string})=>e.evidence==='hash-declarado-nao-refeito');
  if(hashRows.length!==v.counts.declaredRecordsVerified||hashRows.some((e:{evidenceRef:string})=>!v.sourcePins.some(p=>p.evidenceId===e.evidenceRef)))throw new Error('Declared evidence coverage mismatch.');
  const closure=await json('curation/pilot/table-closure.json');
  if(closure.audits.length!==v.counts.numericFlows||closure.audits.some((a:{complete:boolean})=>!a.complete)||closure.sideRollMentions.length!==v.counts.contextualDiceMentions)throw new Error('Local closure accounting mismatch.');
  // This is a comparison-only gate. It never regenerates, updates a digest, or promotes review status.
  for(const check of [check16,check17,check18,check19,check20,check21])await check(['--check'],root);
  return {status:'passed' as const,...graph,sourcePins:v.sourcePins.length,declaredRecordsVerified:hashRows.length};
}
export async function main(args:string[],root=process.cwd()) {
  if(args.length!==1||args[0]!=='--check')throw new Error('Use --check; provenance verification never rewrites inputs.');
  const result=await verifyActivity1(root);
  console.log(`Activity 1 local verification: passed; ${result.files} byte hashes, ${result.referenceEdges} references, ${result.outputEdges} output references; ${result.sourcePins} source pins / ${result.declaredRecordsVerified} structural records; 6 generator checks; no promotion.`);
}
