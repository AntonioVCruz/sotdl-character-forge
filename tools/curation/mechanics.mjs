import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Compile trusted repository tooling; compendium text remains inert data.
const output = resolve('tmp/curation/mechanics-runtime.mjs');
const result = await build({ entryPoints: ['tools/curation/mechanics-extractor.ts'], bundle: true, packages: 'external',
  platform: 'node', format: 'esm', target: 'node22', outfile: output, write: false });
await mkdir(resolve('tmp/curation'), { recursive: true }); await writeFile(output, result.outputFiles[0].contents);
const { main } = await import(pathToFileURL(output).href); await main(process.argv.slice(2));
