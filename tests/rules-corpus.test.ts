import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const RULES_CORPUS = [
  'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md',
  'rules/SotDL_All_Paths_Compendium_Expanded_All_Project_Sources.md',
  'rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md',
  'rules/SotDL_Spells_All_Sources_Expanded_All_Project_Sources_v2.md',
];

describe('corpus local de rules/', () => {
  it('exige os quatro compêndios juntos; ausência total deixa a suíte de curadoria fora do vitest', () => {
    const present = RULES_CORPUS.filter(path => existsSync(path));
    expect(present.length === 0 || present.length === RULES_CORPUS.length).toBe(true);
  });
});
