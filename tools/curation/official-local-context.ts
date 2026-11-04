import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {z} from 'zod';
import {createHash} from 'node:crypto';
import {buildCoreLocal} from './core-local-projector';
import {buildMechanicalArtifacts} from './human-l0-mechanical-compiler';
import {PilotItemCatalogSchema} from '../../packages/curation/pilot-item-model';
import {parseOfficialCoreContext} from '../../packages/character-generator/official-core';
import {projectBackgroundPlans} from './core-background-projector';

/** Server-only: never import local rule files from a browser bundle or a public static export. */
export async function buildOfficialLocalContext(root=process.cwd()) {
  const policy=z.object({schemaVersion:z.literal(1),scope:z.literal('human-core-l0'),enabled:z.literal(true),authority:z.literal('explicit-user-request'),date:z.string(),realDataRequired:z.literal(true),distribution:z.literal('local'),exportEnabled:z.literal(false),completedCharacterRequiresNoPendingConsequences:z.literal(true)}).strict()
    .parse(JSON.parse(await readFile(resolve(root,'curation/official-local-policy.json'),'utf8')));
  const core=await buildCoreLocal(root),mechanics=await buildMechanicalArtifacts(root);
  const itemBytes=await readFile(resolve(root,'curation/pilot/items.json'));
  if(createHash('sha256').update(itemBytes).digest('hex')!==core.document.inputs.find(i=>i.path==='curation/pilot/items.json')?.sha256)throw new Error('Official item source changed during validation.');
  const items=PilotItemCatalogSchema.parse(JSON.parse(itemBytes.toString('utf8')).catalog);
  const ids=new Set(core.document.materialReferences.flatMap(r=>[...(r.itemId?[r.itemId]:[]),...r.candidateItemIds]));
  const implementation=[];
  for(const path of ['packages/character-generator/official-core.ts','packages/character-generator/human-l0.ts','packages/character-generator/core-background.ts','tools/curation/core-background-projector.ts'])implementation.push({path,sha256:createHash('sha256').update(await readFile(resolve(root,path))).digest('hex')});
  return parseOfficialCoreContext({schemaVersion:1,fictionalData:false,scope:policy.scope,officialGenerationEnabled:policy.enabled,exportEnabled:policy.exportEnabled,
    implementationSha256:createHash('sha256').update(JSON.stringify(implementation)).digest('hex'),
    core:core.document,backgroundPlans:projectBackgroundPlans(core.document),mechanicalPacks:mechanics.packs.filter(p=>p.source.id===core.document.sourceId),
    itemDefinitions:items.items.filter(i=>ids.has(i.id)&&i.sourceId===core.document.sourceId)});
}
