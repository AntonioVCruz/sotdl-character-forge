import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {EquipmentRulesSchema} from '../../packages/character-generator/core-equipment';

const sourceId='sotdl:shadow-of-the-demon-lord-core';
const sourcePath='rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md';
const sha=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
const policySchema=z.object({schemaVersion:z.literal(1),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),scope:z.literal('human-core-l0-equipment'),defensiveStacking:z.enum(['pending','sum','highest']),authority:z.enum(['unresolved','explicit-user-request'])}).strict().superRefine((p,ctx)=>{
  if(p.defensiveStacking!=='pending'&&p.authority!=='explicit-user-request')ctx.addIssue({code:'custom',message:'Stacking interpretation needs explicit authority'});
});
export async function buildCoreEquipmentRules(root:string,itemsInput:unknown) {
  const policy=policySchema.parse(JSON.parse(await readFile(resolve(root,'curation/equipment-local-policy.json'),'utf8')));
  const source=await readFile(resolve(root,sourcePath)),inputSha256=sha(source);
  const manifest=JSON.parse(await readFile(resolve(root,'curation/input-manifest.json'),'utf8'));
  if(manifest.files.find((f:{path:string})=>f.path===sourcePath)?.sha256!==inputSha256)throw new Error('Equipment: source-hash-mismatch');
  const items=z.object({rules:z.array(z.object({id:z.string(),evidenceId:z.string(),sourceId:z.string()}).passthrough()),
    evidence:z.array(z.object({id:z.string(),sourceId:z.string(),path:z.string(),inputSha256:z.string(),startLine:z.number(),endLine:z.number(),excerptSha256:z.string()}).passthrough())}).passthrough().parse(itemsInput);
  const evidence=[];
  for(const id of ['armor','armor-table','weapon-table','weapon-requirements','weapon-properties']){
    const rule=items.rules.find(r=>r.id===id&&r.sourceId===sourceId),e=items.evidence.find(e=>e.id===rule?.evidenceId);
    if(!e)throw new Error('Equipment: rule-evidence-missing');
    evidence.push({id:e.id,sourceId:e.sourceId,path:e.path,inputSha256:e.inputSha256,startLine:e.startLine,endLine:e.endLine,excerptSha256:e.excerptSha256});
  }
  const lines=source.toString('utf8').split(/\r\n|\n|\r/),start=lines.findIndex(l=>l==='Attack with Two Weapons'),end=lines.findIndex((l,i)=>i>start&&l==='Attack with an Item');
  const excerpt=lines.slice(start,end).join('\n');
  if(start<0||end<=start||!excerpt.includes('2 banes')||!excerpt.includes('3 banes')||!excerpt.includes('until the end of the'))throw new Error('Equipment: dual-attack-source-mismatch');
  evidence.push({id:'core-equipment:dual-attack',sourceId,path:sourcePath,inputSha256,startLine:start+1,endLine:end,excerptSha256:sha(excerpt)});
  return EquipmentRulesSchema.parse({contract:'sotdl.equipment-context',contractVersion:'1.0.0',sourceId,defensiveStacking:policy.defensiveStacking,stackingAuthority:policy.authority,
    shieldItemIds:['pilot-item:core:small-shield','pilot-item:core:large-shield'],dualAttack:{oneTargetBanes:2,twoTargetBanes:3},evidence});
}
