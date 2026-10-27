import { readFile, writeFile } from 'node:fs/promises';
import { sha256 } from './inputs.mjs';

const target = 'curation/contracts.json';
const paths = [
  'packages/catalog/index.ts', 'packages/random-tables/index.ts',
  'packages/curation/contracts.ts', 'packages/curation/evidence.ts', 'packages/curation/identity.ts',
  'packages/curation/registries.ts', 'packages/curation/source-policy.ts',
  'tools/curation/inputs.mjs', 'tools/curation/sources.mjs', 'tools/curation/policy-evidence.mjs',
  'tools/curation/examples.mjs', 'tools/curation/freeze.mjs',
  'docs/contratos-curadoria.md', 'docs/curadoria-evidencia.md', 'docs/curadoria-identidade.md', 'docs/curadoria-fontes-erratas.md',
].sort();
const arg = name => process.argv[process.argv.indexOf(name) + 1];
const write = process.argv.includes('--write');
const previous = write ? null : JSON.parse(await readFile(target, 'utf8'));
const contractVersion = write ? arg('--version') : previous.contractVersion;
const reviewDate = write ? arg('--review-date') : previous.reviewDate;
if (!/^\d+\.\d+\.\d+$/.test(contractVersion) || !/^\d{4}-\d{2}-\d{2}$/.test(reviewDate)) throw new Error('Explicit --version and --review-date required for --write.');
const files = [];
for (const path of paths) files.push({ path, sha256: sha256(await readFile(path)) });
const output = JSON.stringify({ schemaVersion: 1, contractVersion, reviewDate, files }, null, 2) + '\n';
if (write) await writeFile(target, output);
else if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== output) throw new Error('Frozen contract changed; review schema/version/migration before replacing baseline.');
} else throw new Error('Use --write or --check');
console.log(`Frozen contract ${contractVersion}: ${files.length} files checked.`);
