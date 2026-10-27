import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sha256 } from './inputs.mjs';

export const cleanLabel = value => value.replace(/[*`]/g, '').replace(/\.pdf$/i, '').normalize('NFC').trim();
export const lookupKey = value => cleanLabel(value).toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
export const sourceId = value => `sotdl:${lookupKey(value).normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;

// Only metadata outside fences is indexed. These are publication references,
// not extracted mechanical entries; entry boundaries belong to CUR-008..013.
export function scanReferences(text, path, inputSha256) {
  const lines = text.split(/\r\n|\n|\r/); const refs = [];
  let fence = null; let heading = ''; let manifest = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) { if (!fence) fence = marker[1][0]; else if (fence === marker[1][0]) fence = null; continue; }
    if (fence) continue;
    if (/^#{1,6} /.test(line)) { heading = line; if (/^## /.test(line)) manifest = /Manifesto das fontes/.test(line); }
    let rawLabel; let role;
    if (manifest && /^\| /.test(line) && !/^\| Fonte \|/.test(line)) { rawLabel = line.split('|')[1].trim(); role = 'manifest'; }
    const metadata = line.match(/^(?:- )?\*\*(?:Source|Fonte):\*\*\s*(.+?)\s*$/);
    if (metadata) { rawLabel = metadata[1]; role = 'metadata'; }
    const plural = line.match(/^\*\*Fontes:\*\*\s*(.+)$/);
    if (plural) { rawLabel = plural[1]; role = 'metadata'; }
    if (!rawLabel && /Fontes|Fonte com novas|Errata auditada/.test(heading)) {
      const listed = line.match(/^- (.+?)(?:\s+—\s+.*)?$/);
      if (listed) { rawLabel = listed[1]; role = 'declaration'; }
    }
    if (!rawLabel) continue;
    const next = lines.slice(i + 1, i + 5).join('\n');
    const labels = plural ? [...rawLabel.matchAll(/\*([^*]+\.pdf)\*/g)].map(match => match[1]) : [rawLabel];
    if (!labels.length) throw new Error(`Unrecognized plural source metadata: ${path}:${i + 1}`);
    for (const rawLabel of labels) refs.push({ path, inputSha256, line: i + 1, rawLabel, label: cleanLabel(rawLabel), role, heading,
      printedPageDeclared: role === 'metadata' ? next.match(/\*\*Source Page:\*\*\s*([^\n]+)/)?.[1]?.trim() ?? null : null,
      pdfPageDeclared: role === 'metadata' ? next.match(/\*\*PDF Page:\*\*\s*([^\n]+)/)?.[1]?.trim() ?? null : null,
      pdfCoverageDeclared: role === 'metadata' ? next.match(/\*\*Cobertura:\*\*\s*([^\n]+)/)?.[1]?.trim() ?? null : null });
  }
  return refs;
}

export async function buildSources(root) {
  const manifestBytes = await readFile(resolve(root, 'curation/input-manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  const references = [];
  for (const file of manifest.files) {
    const bytes = await readFile(resolve(root, file.path));
    if (sha256(bytes) !== file.sha256) throw new Error(`Input changed: ${file.path}`);
    references.push(...scanReferences(bytes.toString('utf8'), file.path, file.sha256));
  }
  const declarations = references.filter(ref => ref.role === 'manifest');
  const canonical = new Map(declarations.map(ref => [lookupKey(ref.label), ref.label]));
  if (canonical.size !== declarations.length) throw new Error('Duplicate manifest titles');
  const decisions = JSON.parse(await readFile(resolve(root, 'curation/source-aliases.json'), 'utf8'));
  const aliases = new Map(decisions.aliases.map(a => [lookupKey(a.label), a]));
  const sources = declarations.map(ref => ({ id: sourceId(ref.label), title: ref.label,
    category: /Errata/.test(ref.label) ? 'errata' : /Core$/.test(ref.label) ? 'core' : 'supplement',
    edition: null, revision: ref.label.match(/\((\d{2}[a-z]{3}\d{2})\)/)?.[1] ?? null,
    editionStatus: 'unconfirmed', availability: { md: true, pdf: 'not-provided-in-rules' },
    provenanceStatus: 'needs-review', paginationStatus: 'declared-only',
    declaration: { path: ref.path, inputSha256: ref.inputSha256, line: ref.line }, aliases: [] }));
  const byId = new Map(sources.map(s => [s.id, s]));
  if (byId.size !== sources.length) throw new Error('Source ID collision');
  const pending = [];
  for (const ref of references) {
    const key = lookupKey(ref.label); const decision = aliases.get(key);
    const title = canonical.get(key) ?? (decision?.status === 'confirmed-in-md' ? decision.canonicalTitle : null);
    ref.sourceId = title ? sourceId(title) : null;
    ref.resolution = title ? (canonical.has(key) ? 'normalized-label' : 'explicit-alias') : 'pending';
    if (title && !byId.has(ref.sourceId)) throw new Error(`Unknown alias target: ${title}`);
    if (title) byId.get(ref.sourceId).aliases.push(ref.rawLabel);
    else pending.push({ path: ref.path, line: ref.line, label: ref.label,
      candidateSourceId: decision ? sourceId(decision.canonicalTitle) : null,
      reason: decision?.reason ?? 'Publication/edition alias requires review; no automatic merge.' });
  }
  for (const source of sources) source.aliases = [...new Set(source.aliases)].sort();
  return { schemaVersion: 1, reviewDate: manifest.reviewDate, inputManifestSha256: sha256(manifestBytes),
    scannerVersion: '1.0.0', aliasDecisionsSha256: sha256(await readFile(resolve(root, 'curation/source-aliases.json'))),
    reconciliation: { declared: 95, manifestRows: declarations.length, uniqueSources: sources.length,
      metadataReferences: references.filter(r => r.role === 'metadata').length,
      totalReferences: references.length, resolved: references.length - pending.length, pending: pending.length,
      scope: 'Explicit metadata and source-list declarations outside code fences. Mechanical occurrence counts are deferred to CUR-013.' },
    sources, references, pending };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = JSON.stringify(await buildSources(process.cwd()), null, 2) + '\n';
  const target = resolve('curation/sources.json');
  if (process.argv.includes('--write')) await writeFile(target, result);
  else if (process.argv.includes('--check')) { if (await readFile(target, 'utf8') !== result) throw new Error('Source registry changed; regenerate and review.'); }
  else throw new Error('Use --write or --check');
  console.log(JSON.stringify(JSON.parse(result).reconciliation));
}
