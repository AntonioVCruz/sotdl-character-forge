import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { emptySnapshot, importPack, setEnabled } from '../../packages/catalog';
import { calculateCharacter, chooseSlot, exportCharacter, newCharacter, performSessionCommand, preview, type Character, type Policy } from '../../packages/character-generator';
import tables from '../../examples/demo-random-tables.json' with { type: 'json' };
import zero from '../../examples/demo-level-zero.json' with { type: 'json' };
import one from '../../examples/demo-level-one.json' with { type: 'json' };
import magic from '../../examples/demo-magic.json' with { type: 'json' };
import sessionPack from '../../examples/demo-spell-session.json' with { type: 'json' };

function catalog() {
  let catalog = emptySnapshot();
  for (const pack of [tables, zero, one, magic, sessionPack]) catalog = importPack(catalog, pack).snapshot;
  for (const pack of catalog.packs) catalog = setEnabled(catalog, pack, true);
  return catalog;
}
const c = catalog();
const policy: Policy = { seed: 'print-regression', allowUniform: true, mode: 'all-random', perSlotModes: {}, targetLevel: 1 };
function character(magical: boolean) {
  let character = preview(newCharacter(), c, { ...policy, targetLevel: 0 }).character;
  if (magical) {
    character = preview(character, c, { ...policy, mode: 'manual' }).character;
    for (const [slot, key] of [['novicePath', 'demo:path:spark'], ['pathTraining', 'demo:training:focus'], ['tradition', 'demo:tradition:ember'], ['spell', 'demo:spell:lantern']] as const) character = chooseSlot(character, c, slot, policy, { key, quantities: {} });
    character = performSessionCommand(character, c, { type: 'cast' });
    character = performSessionCommand(character, c, { type: 'activate', castId: 'session-1' });
  }
  return { ...character, name: magical ? 'Ari - Aprendiz demonstrativo' : 'Nara - Viajante demonstrativa', notes: 'Nota confirmada: preservar escolhas e fontes.' };
}
async function load(page: Page, input: Character) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(page.getByRole('status')).toContainText('Fontes da demonstração prontas');
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'print.json', mimeType: 'application/json', buffer: Buffer.from(exportCharacter(input)) });
  await expect(page.getByRole('region', { name: 'Criador demonstrativo', exact: true })).toContainText('Personagem importado');
}
function verifyPdf(path: string, expected: string[], forbidden: string[] = []) {
  const result = execFileSync('python', ['tools/verify-print-pdf.py', path, ...expected.flatMap(text => ['--expect', text]), ...forbidden.flatMap(text => ['--forbid', text])], { encoding: 'utf8' });
  return JSON.parse(result) as { pages: number; a4: boolean };
}

test('ficha nível 1 imprime os mesmos números e efeito ativo, sem alterar estado', async ({ page }) => {
  const input = character(true), view = calculateCharacter(input, c);
  await load(page, input);
  await page.getByLabel('Nome (opcional)', { exact: true }).fill('Nome ainda não salvo');
  await page.evaluate(() => { window.print = () => { document.body.dataset.printCalls = String(Number(document.body.dataset.printCalls ?? 0) + 1); }; });
  await page.getByRole('button', { name: 'Imprimir / Salvar como PDF' }).click();
  expect(await page.locator('body').getAttribute('data-print-calls')).toBe('1');
  await page.getByRole('button', { name: 'Visualizar ficha A4' }).click();
  const dialog = page.getByRole('dialog', { name: 'Prévia da ficha A4' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(input.name); await expect(dialog).not.toContainText('Nome ainda não salvo');
  await expect(page.getByRole('button', { name: 'Imprimir esta ficha' })).toBeFocused();
  for (const [key,value] of Object.entries(view.stats)) await expect(dialog.locator(`[data-print-stat="${key}"]`)).toHaveText(String(value));
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Visualizar ficha A4' })).toBeFocused();
  await page.emulateMedia({ media: 'print' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)).toBe('rgb(255, 255, 255)');
  await expect(page.locator('#root')).toBeHidden();
  const print = page.getByRole('article', { name: 'Ficha para impressão', exact: true });
  await expect(print).toBeVisible(); await expect(print).toContainText('Manto da lanterna - Ativo');
  const printValues = await print.locator('[data-print-stat]').evaluateAll(nodes => Object.fromEntries(nodes.map(node => [node.getAttribute('data-print-stat'), node.textContent])));
  expect(printValues).toEqual(Object.fromEntries(Object.entries(view.stats).map(([k,v]) => [k,String(v)])));
  await mkdir('output/pdf', { recursive: true });
  const path = 'output/pdf/personagem-demonstrativo-ativo.pdf';
  await page.pdf({ path, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  const result = verifyPdf(path, [input.name, 'DEMONSTRAÇÃO FICTÍCIA', 'Manto da lanterna - Ativo', 'Conjurações disponíveis: 1 de 2', 'Origem dos valores', 'Página 1 /', 'Nota confirmada'], ['Registrar conjuração', 'Preparar fontes da demonstração', 'Nome ainda não salvo']);
  expect(result.a4).toBe(true); expect(result.pages).toBeLessThanOrEqual(4);
  await page.emulateMedia({ media: 'screen' });
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Exportar personagem JSON' }).click();
  const { readFile } = await import('node:fs/promises');
  expect(JSON.parse(await readFile((await (await pending).path())!, 'utf8'))).toEqual(JSON.parse(exportCharacter(input)));
});

test('nível 0 não imprime seções mágicas e notas longas fluem por páginas A4', async ({ page }) => {
  const input = character(false);
  input.notes = Array.from({ length: 30 }, (_,i) => `MARCADOR-${String(i+1).padStart(3,'0')}: anotação confirmada de campanha. ${'A ficha deve manter todo este parágrafo legível sem recortar o texto. '.repeat(3)}`).join('\n\n');
  await load(page, input);
  await page.emulateMedia({ media: 'print' });
  const print = page.getByRole('article', { name: 'Ficha para impressão', exact: true });
  await expect(print).not.toContainText('Grimório demonstrativo'); await expect(print).not.toContainText('Sessão e efeitos temporários');
  expect(await print.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await mkdir('output/pdf', { recursive: true });
  const path = 'output/pdf/personagem-notas-longas.pdf';
  await page.pdf({ path, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  const result = verifyPdf(path, [input.name, ...Array.from({ length: 30 }, (_,i) => `MARCADOR-${String(i+1).padStart(3,'0')}`)], ['Grimório demonstrativo', 'Preparar fontes da demonstração']);
  expect(result.pages).toBeGreaterThan(2); expect(result.pages).toBeLessThan(12);
});

test('PDF registra pendências e efeito suspenso quando a fonte não está habilitada', async ({ page }) => {
  const input = character(true);
  await load(page, input);
  await page.getByRole('checkbox', { name: 'Habilitar demo-magic 0.0.1' }).click();
  await expect(page.getByRole('region', { name: 'Ficha confirmada', exact: true })).toContainText('Fonte original indisponível');
  await page.emulateMedia({ media: 'print' });
  const print = page.getByRole('article', { name: 'Ficha para impressão', exact: true });
  await expect(print).toContainText('Rascunho com pendências'); await expect(print).toContainText('Manto da lanterna - Suspenso');
  await mkdir('output/pdf', { recursive: true });
  const path = 'output/pdf/personagem-com-pendencias.pdf';
  await page.pdf({ path, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  verifyPdf(path, ['Pendências da ficha', 'Fonte original indisponível', 'Manto da lanterna - Suspenso', 'Avisos da sessão', 'declarados (não aplicados)']);
});
