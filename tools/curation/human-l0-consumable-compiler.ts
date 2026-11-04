import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { z } from 'zod';
import { parseHumanL0Consumable } from '../../packages/curation/human-l0-consumable';
import { consumableIndexes, consumableJson, parseConsumableBundle, type ConsumableBundle } from '../../packages/curation/human-l0-consumable-bundle';
import { assertSafeArtifact } from './privacy.mjs';

const sha = (bytes: string | Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const fail = (code: string): never => { throw new Error(`Consumable compilation: ${code}; contents omitted.`); };
export const ConsumableRecipeSchema = z.object({
  schemaVersion:z.literal(1),projection:z.literal('human-l0-consumable'),scope:z.literal('synthetic-contract'),
  bundleId:z.string().regex(/^[a-z0-9-]{1,80}$/),version:z.string().regex(/^\d+\.\d+\.\d+$/),
  input:z.object({path:z.literal('curation/examples/human-l0-consumable.synthetic.json'),sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict(),
}).strict();
export function compileHumanL0Consumable(bytes: Uint8Array, recipeInput: unknown) {
  const checked = ConsumableRecipeSchema.safeParse(recipeInput);
  if (!checked.success) return fail('recipe-invalid');
  const recipe = checked.data;
  if (sha(bytes) !== recipe.input.sha256) return fail('input-byte-hash-mismatch');
  let document;
  try { document = parseHumanL0Consumable(JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(bytes))); }
  catch { return fail('document-invalid'); }
  const indexes = consumableIndexes(document);
  const bundle: ConsumableBundle = {contract:'sotdl.human-l0.consumable-bundle',contractVersion:'1.0.0',
    bundleId:recipe.bundleId,version:recipe.version,scope:recipe.scope,rulesetEnabled:false,exportEnabled:false,
    input:recipe.input,documentSha256:sha(consumableJson(document)),document,indexes};
  const report = {schemaVersion:1,projection:recipe.projection,scope:recipe.scope,input:{...recipe.input,bytes:bytes.length},
    recipeSha256:sha(consumableJson(recipe)),documentSha256:bundle.documentSha256,bundleSha256:sha(consumableJson(bundle)),
    counts:{tables:document.tables.length,lookups:document.lookups.length,items:document.items.length,grants:document.grants.length},
    groupedPendings:indexes.groupedPendings,manualResolutions:indexes.manualResolutions,
    gates:{reviewStatus:document.reviewStatus,rulesetEnabled:false,exportEnabled:false,realLotsAccepted:false},
    deferred:['pr44-pr47-pr46-corrections-and-revalidation','real-lot-projection-and-review','procedure-integration','export-gates','offline-expansion']};
  const artifacts = new Map([['bundle.json',consumableJson(bundle)],['index.json',consumableJson(indexes)],['report.json',consumableJson(report)]]);
  for (const [path,text] of artifacts) assertSafeArtifact(path,text);
  return {recipe,bundle,report,artifacts};
}
/** Reprojection from pinned input bytes; recomputing hashes on a forged output is insufficient. */
export async function validateConsumableArtifacts(artifacts: ReadonlyMap<string,string>, bytes: Uint8Array, recipe: unknown) {
  const expected = compileHumanL0Consumable(bytes,recipe);
  if (artifacts.size !== expected.artifacts.size) return fail('artifact-inventory-mismatch');
  for (const [path,text] of expected.artifacts) if (artifacts.get(path) !== text) return fail('artifact-content-mismatch');
  await parseConsumableBundle(expected.bundle);
  return expected;
}
async function exists(path: string) {
  try { return await lstat(path); } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null; throw e; }
}
async function noLinks(root: string, target: string) {
  let path = resolve(root);
  for (const part of relative(path,target).split(sep)) {
    path=resolve(path,part);
    if ((await exists(path))?.isSymbolicLink()) return fail('output-link');
  }
}
/** Publish a complete immutable directory by rename. Any failed validation preserves the previous bundle. */
export async function publishConsumableArtifacts(root: string, output: string, result: { artifacts: ReadonlyMap<string,string> }, check: boolean) {
  if (result.artifacts.size!==3 || [...result.artifacts.keys()].some(p=>!['bundle.json','index.json','report.json'].includes(p))) return fail('artifact-inventory-mismatch');
  const target=resolve(root,output),location=relative(resolve(root,'tmp'),target);
  if (!location || location==='..' || location.startsWith(`..${sep}`) || isAbsolute(location)) return fail('output-outside-tmp');
  await noLinks(root,target);
  if (await exists(target)) {
    const names=await readdir(target);
    if (names.length!==result.artifacts.size || names.some(n=>!result.artifacts.has(n))) return fail('artifact-inventory-mismatch');
    for (const [name,text] of result.artifacts) {
      const path=resolve(target,name);
      if ((await lstat(path)).isSymbolicLink() || await readFile(path,'utf8')!==text) return fail('immutable-output-mismatch');
    }
    return;
  }
  if (check) return fail('output-missing');
  await mkdir(dirname(target),{recursive:true});
  const staged=await mkdtemp(resolve(dirname(target),'.consumable-stage-'));
  for (const [name,text] of result.artifacts) await writeFile(resolve(staged,name),text,{encoding:'utf8',flag:'wx'});
  await rename(staged,target);
}
export async function mainConsumable(args: string[], root=process.cwd()) {
  if (!['--write','--check'].includes(args[0]) || ![1,3].includes(args.length) || args.length===3 && args[1]!=='--output')
    return fail('use-write-or-check-with-optional-output');
  const recipe=ConsumableRecipeSchema.parse(JSON.parse(await readFile(resolve(root,'curation/human-l0-consumable-compilation.json'),'utf8')));
  const bytes=await readFile(resolve(root,recipe.input.path)),result=compileHumanL0Consumable(bytes,recipe);
  await validateConsumableArtifacts(result.artifacts,bytes,recipe);
  const output=args[2]??`tmp/curation/compiled-consumables/${recipe.bundleId}/${recipe.version}`;
  await publishConsumableArtifacts(root,output,result,args[0]==='--check');
  console.log(`Consumable ${recipe.version}: ${result.report.bundleSha256}; ${args[0]}; synthetic-contract; ruleset/export disabled.`);
}
