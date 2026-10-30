import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { hasBuyerData, localArtifactRoots } from './privacy.mjs';

export function inspectContent(path, text) {
  let hits = 0;
  const visit = value => {
    if (typeof value === 'string') hits += Number(hasBuyerData(value));
    else if (value && typeof value === 'object') Object.values(value).forEach(visit);
  };
  if (path.endsWith('.json')) visit(JSON.parse(text));
  else if (path.endsWith('.jsonl')) text.split(/\r?\n/).filter(Boolean).forEach(line => visit(JSON.parse(line)));
  else visit(text);
  return hits;
}

export function auditTracked(root = process.cwd()) {
  const paths = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const findings = [];
  for (const path of paths) {
    if (path.startsWith('rules/') || localArtifactRoots.some(prefix => path.startsWith(prefix))) {
      findings.push({ path, reason: 'local-only content is tracked' });
      continue;
    }
    const bytes = readFileSync(resolve(root, path));
    if (bytes.includes(0)) continue;
    if (inspectContent(path, bytes.toString('utf8'))) findings.push({ path, reason: 'buyer data detected' });
  }
  return { scanned: paths.length, findings };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = auditTracked();
  for (const finding of result.findings) console.error(`${finding.path}: ${finding.reason}`);
  console.log(`Privacy gate: ${result.scanned} tracked files, ${result.findings.length} findings (no matched text emitted).`);
  if (result.findings.length) process.exitCode = 1;
}
