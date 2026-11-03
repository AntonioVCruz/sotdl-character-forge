import { build } from 'esbuild';
import { mkdir,writeFile } from 'node:fs/promises';
import { dirname,resolve } from 'node:path';
import { fileURLToPath,pathToFileURL } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const output=resolve(root,'tmp/curation/activity1-verification-runtime.mjs');
try {
  const result=await build({entryPoints:[resolve(root,'tools/curation/verify-activity1-provenance.ts')],bundle:true,packages:'external',platform:'node',format:'esm',target:'node22',outfile:output,write:false});
  await mkdir(dirname(output),{recursive:true});await writeFile(output,result.outputFiles[0].contents);
  const {main}=await import(pathToFileURL(output).href);await main(process.argv.slice(2),root);
}catch{console.error('Activity 1 provenance verification failed; contents omitted. Inspect local inputs and attestation.');process.exitCode=1;}
