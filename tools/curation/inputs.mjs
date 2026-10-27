import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const INPUT_TOOL_VERSION = '1.0.0';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function linesOf(text) {
  const lines = text.split(/\r\n|\n|\r/);
  if (lines.at(-1) === '') lines.pop();
  return lines;
}
export async function collectInputs(root, reviewDate, extractorHash) {
  extractorHash ??= sha256(await readFile(fileURLToPath(import.meta.url)));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate) || Number.isNaN(Date.parse(reviewDate)) || new Date(reviewDate).toISOString().slice(0,10) !== reviewDate) throw new Error('reviewDate deve ser uma data ISO válida.');
  const files = [];
  async function walk(directory) {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (entry.isSymbolicLink()) throw new Error(`Link simbólico não permitido nos insumos: ${entry.name}`);
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        const bytes = await readFile(path);
        const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        const hash = sha256(bytes), crlf = (text.match(/\r\n/g) ?? []).length;
        files.push({ path: relative(root, path).replaceAll('\\','/'), bytes: bytes.length, lines: linesOf(text).length, sha256: hash, revisionId: `sha256:${hash}`, encoding: 'utf-8', bom: bytes.subarray(0,3).equals(Buffer.from([239,187,191])), lineEndings: { crlf, lf: (text.match(/\n/g) ?? []).length - crlf, cr: (text.match(/\r/g) ?? []).length - crlf }, finalNewline: /[\r\n]$/.test(text), title: linesOf(text)[0] ?? '' });
      }
    }
  }
  await walk(join(root, 'rules'));
  return { schemaVersion: 1, reviewDate, extractor: { id: 'curation-inputs', version: INPUT_TOOL_VERSION, sha256: extractorHash }, files };
}
export function manifestChanges(before, after) {
  const changes = [];
  if (JSON.stringify(before.extractor) !== JSON.stringify(after.extractor)) changes.push('extractor: versão ou código alterado');
  const old = new Map(before.files.map(file => [file.path, file]));
  for (const file of after.files) {
    if (!old.has(file.path)) changes.push(`${file.path}: adicionado`);
    else if (JSON.stringify(old.get(file.path)) !== JSON.stringify(file)) changes.push(`${file.path}: alterado`);
    old.delete(file.path);
  }
  for (const path of old.keys()) changes.push(`${path}: removido`);
  return changes;
}
async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const target = join(root, 'curation/input-manifest.json');
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--check') {
    const previous = JSON.parse(await readFile(target, 'utf8'));
    const actual = await collectInputs(root, previous.reviewDate);
    const changes = manifestChanges(previous, actual);
    if (changes.length) throw new Error(`Revisão dos insumos divergiu:\n${changes.join('\n')}`);
    console.log(`OK: ${actual.files.length} MDs e extrator idênticos ao manifesto.`);
  } else if (args.length === 3 && args[0] === '--write' && args[1] === '--review-date') {
    const manifest = await collectInputs(root, args[2]);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log(`Manifesto gravado: ${manifest.files.length} MDs, revisão ${manifest.reviewDate}.`);
  } else throw new Error('Uso: node tools/curation/inputs.mjs --check | --write --review-date YYYY-MM-DD');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
