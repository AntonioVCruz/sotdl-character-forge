import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { hasBuyerData } from '../tools/curation/privacy.mjs';
import { findingDispositions } from '../tools/curation/pilot-table-ranges';
import { armorRows, gearRows, weaponRows } from '../tools/curation/pilot-item-definitions';
import { buildActivity1Matrix, renderActivity1Markdown } from '../tools/curation/issue34-activity1-matrix';

const jsonPath = 'docs/matriz-lacunas-issue34-atividade1.json';
const markdownPath = 'docs/matriz-lacunas-issue34-atividade1.md';

describe('issue 34 activity 1 matrix', () => {
  const matrix = buildActivity1Matrix();
  const json = `${JSON.stringify(matrix, null, 2)}\n`;
  const markdown = renderActivity1Markdown(matrix);

  it('writes the public matrix when asked and matches the committed export', () => {
    if (process.env.WRITE_MATRIX === '1') {
      writeFileSync(jsonPath, json);
      writeFileSync(markdownPath, markdown);
    }
    expect(readFileSync(jsonPath, 'utf8')).toBe(json);
    expect(readFileSync(markdownPath, 'utf8')).toBe(markdown);
  });

  it('accounts for the CUR-016–021 universe without source prose', () => {
    expect(matrix.activity).toBe(1);
    expect(matrix.counts).toMatchObject({
      tables: 74,
      numericFlows: 70,
      lifestyleLookups: 5,
      procedureQueries: 11,
      links: 73,
      professionOptions: 169,
      grantPrograms: 97,
      interestingOutcomes: 360,
      itemDefinitions: 409,
      itemReferences: 641,
      rangeRowsRederived: 901,
    });
    expect(new Set(matrix.records.map(row => row.id)).size).toBe(matrix.records.length);
    const published = new Set(matrix.records.filter(row => row.id.startsWith('pilot-item:core:')).map(row => row.id));
    for (const key of [...gearRows.map(row => row[0]), ...armorRows.map(row => row[0]), ...weaponRows.map(row => row[0])]) {
      expect(published.has(`pilot-item:core:${key}`)).toBe(true);
    }
    expect(matrix.records.find(row => row.id === 'oddities:books:20')?.capabilities).toEqual(expect.arrayContaining(['kind:text-reference', 'future-generator:disabled']));
    expect(matrix.records.find(row => row.id === 'finding:recursion')?.capabilities).toEqual(expect.arrayContaining([
      'cycle:only-human:character-fate', 'cycle:only-human:piety', 'cycle:only-human:siblings', 'cycle:only-human:strange',
    ]));
    for (const id of Object.keys(findingDispositions)) expect(matrix.records.some(row => row.id === `finding:${id}`)).toBe(true);
    const visited = JSON.stringify(matrix) + markdown;
    expect(hasBuyerData(visited)).toBe(false);
    expect(visited.includes('"excerpt"')).toBe(false);
    expect(visited.includes('sourceText')).toBe(false);
    for (const value of visited.match(/"[^"\\]{180,}"/g) ?? []) expect(value.length).toBeLessThan(400);
  });
});
