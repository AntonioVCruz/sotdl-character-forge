import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';

const result = await build({
  entryPoints: ['apps/standalone/main.tsx'], bundle: true, write: false, outfile: 'standalone.js',
  format: 'iife', platform: 'browser', target: 'es2022', jsx: 'automatic', minify: true,
  define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'inline', metafile: true,
});
const script = result.outputFiles.find(file => file.path.endsWith('.js'))?.text;
const css = result.outputFiles.find(file => file.path.endsWith('.css'))?.text;
if (!script || !css) throw new Error('Runtime offline não gerou JS/CSS.');
await mkdir('apps/web/generated', { recursive: true });
await writeFile('apps/web/generated/standalone-runtime.json', JSON.stringify({ script, css }));
console.log(`Runtime offline: JS ${Buffer.byteLength(script)} bytes; CSS ${Buffer.byteLength(css)} bytes.`);
