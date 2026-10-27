import { existsSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

// Quatro compêndios locais, ignorados em /rules/. Sem eles, os arquivos de teste
// que abrem esses paths não entram no `vitest run` (o CI do GitHub não os tem).
const RULES_CORPUS = [
  'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md',
  'rules/SotDL_All_Paths_Compendium_Expanded_All_Project_Sources.md',
  'rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md',
  'rules/SotDL_Spells_All_Sources_Expanded_All_Project_Sources_v2.md',
];

const rulesCorpusPresent = RULES_CORPUS.every(path => existsSync(path));

const corpusTests = [
  'tests/curation-ancestries.test.ts',
  'tests/curation-core-pilot.test.ts',
  'tests/curation-creation-tables.test.ts',
  'tests/curation-evidence.test.ts',
  'tests/curation-human-ancestry.test.ts',
  'tests/curation-interesting-things.test.ts',
  'tests/curation-mechanics.test.ts',
  'tests/curation-normalization.test.ts',
  'tests/curation-paths.test.ts',
  'tests/curation-pilot-items.test.ts',
  'tests/curation-pilot-tables.test.ts',
  'tests/curation-professions-languages.test.ts',
  'tests/curation-reconciliation.test.ts',
  'tests/curation-source-policy.test.ts',
  'tests/curation-sources.test.ts',
  'tests/curation-spells.test.ts',
  'tests/curation-wealth-equipment.test.ts',
];

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude, ...(rulesCorpusPresent ? [] : corpusTests)],
  },
});
