import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { hasBuyerData, sanitizeArtifact, redactBuyerLines, localArtifactRoots } from './privacy.mjs';
import { inspectContent } from './privacy-check.mjs';

// One-time cleanup of local snapshots. Regenerate current derivatives afterwards.
// Never touches rules/, refs or objects, and never prints matched values.
const root = resolve(process.cwd());
let files = 0, changed = 0;
async function walk(directory) {
  const absolute = resolve(root, directory);
  if (!absolute.startsWith(root + sep)) throw new Error('Outside workspace');
  for (const entry of await readdir(absolute, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error('Symlink in local artifacts');
    const path = resolve(absolute, entry.name);
    if (entry.isDirectory()) { await walk(relative(root, path)); continue; }
    const text = await readFile(path, 'utf8'); files++;
    if (!inspectContent(path, text)) continue;
    let clean;
    if (path.endsWith('.json')) clean = JSON.stringify(sanitizeArtifact(JSON.parse(text)), null, 2) + '\n';
    else if (path.endsWith('.jsonl')) clean = text.split(/\r?\n/).filter(Boolean).map(line => JSON.stringify(sanitizeArtifact(JSON.parse(line)))).join('\n') + '\n';
    else clean = redactBuyerLines(text);
    if (hasBuyerData(clean) || inspectContent(path, clean)) throw new Error('Cleanup left buyer data');
    await writeFile(path, clean); changed++;
  }
}
for (const directory of localArtifactRoots) await walk(directory);
console.log(`Local cleanup: ${files} files inspected, ${changed} redacted; no raw matches logged.`);
