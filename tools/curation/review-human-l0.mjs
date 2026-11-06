import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const output=resolve(root,'tmp/curation/review-human-l0-runtime.mjs');
try{
  const result=await build({entryPoints:[resolve(root,'tools/curation/review-human-l0.ts')],bundle:true,packages:'external',platform:'node',format:'esm',target:'node22',outfile:output,write:false});
  await mkdir(dirname(output),{recursive:true});await writeFile(output,result.outputFiles[0].contents);
  const {main}=await import(pathToFileURL(output).href);await main(process.argv.slice(2),root);
}catch(error){
  // Error messages carry identities/counts only; never dump a Zod error or source context.
  console.error(error instanceof Error&&!(error.name==='ZodError')?error.message:'Review failed; inspect local inputs.');process.exitCode=1;
}
