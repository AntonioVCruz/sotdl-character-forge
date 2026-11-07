import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),output=resolve(root,'tmp/curation/runtime-artifacts-tool.mjs');
try{
  const result=await build({entryPoints:[resolve(root,'tools/curation/runtime-artifact-compiler.ts')],bundle:true,packages:'external',platform:'node',format:'esm',target:'node22',outfile:output,write:false});
  await mkdir(dirname(output),{recursive:true});await writeFile(output,result.outputFiles[0].contents);
  await(await import(pathToFileURL(output).href)).main(process.argv.slice(2),root);
}catch{console.error('Runtime artifact check failed; inspect local source/version integrity. Source contents omitted.');process.exitCode=1;}
