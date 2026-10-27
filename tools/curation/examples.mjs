import { readFile, writeFile } from 'node:fs/promises';
import { sha256 } from './inputs.mjs';

const path = 'curation/examples/input.md'; const bytes = await readFile(path);
const originalText = bytes.toString('utf8').split(/\r\n|\n|\r/)[2];
const sourceId = 'fixture:curation'; const id = `${sourceId}:rule:format:default`;
const evidenceId = 'fixture:curation:evidence';
const axis = (status, evidenceIds = []) => ({ status, responsible: 'Codex / fixture', reason: 'Format test only; no mechanical approval.', evidenceIds });
const review = { schemaVersion: 1, subjectId: id, sourcePermission: axis('needs-review'),
  transcription: axis('md-checked', [evidenceId]), structure: axis('unreviewed'), mechanics: axis('unreviewed'),
  automation: { ...axis('unsupported'), handlerRef: null, testRefs: [] },
  evidence: [{ id: evidenceId, medium: 'md', path, inputSha256: sha256(bytes), startLine: 3, endLine: 3,
    physicalPdfPage: null, printedPageDeclared: null, pdfPageDeclared: null,
    heading: '# Fixture', excerpt: originalText, excerptSha256: sha256(originalText), claim: 'Fictional format fixture.' }] };
const staging = { schemaVersion: 1, id, identity: { sourceId, kind: 'rule', entryKey: 'format', variantKey: 'default' },
  name: 'Format fixture (fictional)', kind: 'rule', source: { status: 'resolved', sourceId, rawLabel: 'Fictional fixture', reason: 'Local synthetic test.' },
  representation: 'full-text', originalText, normalizedText: null, normalizationDiffRef: null,
  printedPage: null, pdfPageDeclared: null, stage: 'captured', scopeTags: [], region: null,
  searchAliases: [], equivalenceGroupIds: [], lineage: [], review };
const pack = { packId: 'fixture-curation', version: '1.0.0', system: 'sotdl', fictionalData: true,
  source: { id: sourceId, title: 'Fictional format fixture', sourcePage: null, status: 'fictional' }, dependencies: [],
  entities: [{ id, kind: 'rule', name: staging.name, sourceRef: sourceId, sourcePage: null, variantKey: 'default', revision: '1', status: 'needs-review', text: originalText }] };
const ref = { packId: pack.packId, version: pack.version, entityId: id };
const index = { schemaVersion: 1, category: 'rule', entries: [{ name: staging.name, searchAliases: [], ref, kind: 'rule', sourceId, variantKey: 'default', equivalenceGroupId: null }] };
const ruleset = { schemaVersion: 1, rulesetId: 'fixture-curation', packs: [{ packId: pack.packId, version: pack.version }],
  selections: [{ subjectKey: 'fixture-format', ref, variantKey: 'default', scope: 'base', region: null, optionKey: null }], overrides: [] };
const realEmptyPack = { packId: 'sotdl-core-format-example', version: '0.0.1', system: 'sotdl', fictionalData: false,
  source: { id: 'sotdl:shadow-of-the-demon-lord-core', title: 'Shadow of the Demon Lord Core', sourcePage: null, status: 'needs-review' }, dependencies: [], entities: [] };
for (const [name, object] of Object.entries({ 'staging.json': staging, 'fictional.pack.json': pack, 'rule.index.json': index, 'ruleset.curation.json': ruleset, 'real-empty.pack.json': realEmptyPack })) {
  const output = JSON.stringify(object, null, 2) + '\n'; const target = `curation/examples/${name}`;
  if (process.argv.includes('--write')) await writeFile(target, output);
  else if (process.argv.includes('--check')) { if (await readFile(target, 'utf8') !== output) throw new Error(`Example changed: ${name}`); }
  else throw new Error('Use --write or --check');
}
console.log('5 contract examples: deterministic bytes checked.');
