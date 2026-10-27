import { readFile, writeFile } from 'node:fs/promises';
import { sha256 } from './inputs.mjs';

// Snapshot only the already inspected editorial declarations; no rule extraction.
const path = 'rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md';
const bytes = await readFile(path); const lines = bytes.toString('utf8').split(/\r\n|\n|\r/);
const evidence = [7, 19, 20, 145, 146, 64988, 64991].map(line => ({
  id: `md:source-policy:${line}`, medium: 'md', path, inputSha256: sha256(bytes), startLine: line, endLine: line,
  physicalPdfPage: null, printedPageDeclared: null, pdfPageDeclared: null,
  heading: line >= 64988 ? '## 87. Demon Lord Errata — correções com precedência' : 'Manifesto e protocolo editorial',
  excerpt: lines[line - 1], excerptSha256: sha256(lines[line - 1]),
  claim: 'Declaracao editorial do MD; nao certifica PDF ou equivalencia de correcoes.',
}));
const policy = {
  schemaVersion: 1, baselineSourceId: 'sotdl:shadow-of-the-demon-lord-core', optionalDefault: false, regionalDefault: false,
  relations: [
    { id: 'errata:19nov17-for-core', type: 'errata-for', fromSourceId: 'sotdl:demon-lord-errata-19nov17', toSourceId: 'sotdl:shadow-of-the-demon-lord-core', scope: 'corrections-only', evidenceIds: ['md:source-policy:145', 'md:source-policy:64991'] },
    { id: 'errata:10oct17-for-core', type: 'errata-for', fromSourceId: 'sotdl:demon-lord-errata-10oct17', toSourceId: 'sotdl:shadow-of-the-demon-lord-core', scope: 'corrections-only', evidenceIds: ['md:source-policy:146', 'md:source-policy:64991'] },
    { id: 'errata:19nov17-supersedes-10oct17', type: 'supersedes', fromSourceId: 'sotdl:demon-lord-errata-19nov17', toSourceId: 'sotdl:demon-lord-errata-10oct17', scope: 'repeated-corrections-only', evidenceIds: ['md:source-policy:7', 'md:source-policy:146', 'md:source-policy:64991'] },
  ].map(r => ({ ...r, status: 'declared-in-md', enabledByDefault: false, responsible: 'Codex / local analysis',
    reason: 'MD declara precedencia; faltam comparacao por correcao e verificacao dos PDFs. Relacao nao aplicada.' })), evidence,
};
const output = JSON.stringify(policy, null, 2) + '\n';
if (process.argv.includes('--write')) await writeFile('curation/source-policy.json', output);
else if (process.argv.includes('--check')) { if (await readFile('curation/source-policy.json', 'utf8') !== output) throw new Error('Policy evidence changed.'); }
else throw new Error('Use --write or --check');
console.log('Source policy evidence: 7 MD anchors, 3 disabled relations.');
