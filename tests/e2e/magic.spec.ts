import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Character } from '../../packages/character-generator';

const sheet = (page: Page) => page.getByRole('region', { name: 'Ficha confirmada', exact: true });
const draft = (page: Page) => page.getByRole('region', { name: 'Prévia da geração', exact: true });
const slot = (page: Page, name: string) => page.getByRole('group', { name, exact: true });
async function confirm(page: Page) {
  await draft(page).getByRole('button', { name: /Confirmar prévia|Salvar rascunho com pendências/ }).click();
  await expect(draft(page)).toHaveCount(0);
}
async function choose(page: Page, name: string, key: string) {
  await slot(page, name).getByLabel(`Escolha manual — ${name}`).selectOption(key);
  await slot(page, name).getByRole('button', { name: 'Prévia da escolha manual' }).click();
  await confirm(page);
}
async function exported(page: Page): Promise<Character> {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar personagem JSON' }).click();
  return JSON.parse(await readFile((await (await pending).path())!, 'utf8'));
}
async function setup(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(page.getByRole('status')).toContainText('Fontes da demonstração prontas');
  await page.getByLabel('Modo de criação').selectOption('all-random');
  await page.getByLabel('Permitir sorteio uniforme entre opções válidas (não oficial)').check();
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(page);
  await page.getByLabel('Nível-alvo').selectOption('1');
  await page.getByRole('button', { name: 'Alterar nível — prévia' }).click(); await confirm(page);
  await choose(page, 'Caminho iniciante', 'demo:path:spark');
  await choose(page, 'Treinamento do caminho', 'demo:training:focus');
}

test('aprende manualmente, troca tradição e revisa magia travada preservando JSON e fontes', async ({ page }) => {
  await setup(page);
  await expect(slot(page, 'Magia aprendida').getByRole('button', { name: 'Sortear' })).toBeDisabled();
  await choose(page, 'Tradição', 'demo:tradition:ember');
  await expect(slot(page, 'Magia aprendida').getByRole('option', { name: 'Sino Distante (fictícia)' })).toHaveCount(0);
  await choose(page, 'Magia aprendida', 'demo:spell:lantern');
  await expect(sheet(page)).toContainText('Personagem demonstrativo completo');
  await expect(sheet(page).getByRole('region', { name: 'Grimório demonstrativo' })).toContainText('rank 0');
  const initial = await exported(page);
  await slot(page, 'Tradição').getByLabel('Travar Tradição').click();
  await expect(slot(page, 'Tradição').getByLabel('Travar Tradição')).not.toBeChecked();
  await choose(page, 'Tradição', 'demo:tradition:echo');
  await expect(sheet(page)).toContainText('Aprendizado requer revisão');
  await expect(slot(page, 'Magia aprendida').getByLabel('Travar Magia aprendida')).toBeChecked();
  const incompatible = await exported(page);
  expect(incompatible.events.slice(0,8)).toEqual(initial.events);
  await slot(page, 'Magia aprendida').getByLabel('Travar Magia aprendida').click();
  await expect(slot(page, 'Magia aprendida').getByLabel('Travar Magia aprendida')).not.toBeChecked();
  await choose(page, 'Magia aprendida', 'demo:spell:chime');
  const grim = sheet(page).getByRole('region', { name: 'Grimório demonstrativo' });
  await expect(grim).toContainText('Sino Distante'); await expect(grim).toContainText('demo-magic@0.0.1');
  await expect(grim).toContainText('resolução manual');
  const complete = await exported(page);
  await page.reload(); await expect(sheet(page)).toContainText('Personagem demonstrativo completo');
  expect(await exported(page)).toEqual(complete);
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'magic.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(complete)) });
  await expect(page.getByRole('region', { name: 'Criador demonstrativo', exact: true })).toContainText('Personagem importado');
  expect(await exported(page)).toEqual(complete);
  await grim.screenshot({ path: 'test-results/magic-grimoire.png' });
  await page.getByRole('checkbox', { name: 'Habilitar demo-magic 0.0.1' }).click();
  await expect(sheet(page)).toContainText('Fonte original indisponível');
  expect((await exported(page)).events).toEqual(complete.events);
});

test('híbrido sorteia tradição e magia sequencialmente e cancelar não muda ficha', async ({ page }) => {
  await setup(page);
  await page.getByLabel('Modo de criação').selectOption('hybrid');
  for (const name of ['Ancestralidade', 'Background', 'Equipamento', 'Objeto curioso']) {
    await slot(page, name).getByLabel(`Sortear ${name} na geração conjunta`).uncheck();
  }
  const original = await exported(page);
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click();
  await expect(draft(page)).toContainText('Todas as escolhas obrigatórias foram resolvidas');
  await draft(page).getByRole('button', { name: 'Cancelar prévia' }).click();
  expect(await exported(page)).toEqual(original);
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(page);
  const character = await exported(page);
  expect(character.events.slice(0,6)).toEqual(original.events);
  expect(character.events.slice(-2).map(e => e.slotId)).toEqual(['tradition', 'spell']);
  expect(character.events.slice(-2).every(e => e.strategy === 'uniform-eligible')).toBe(true);
  await expect(sheet(page)).toContainText('Personagem demonstrativo completo');
  await slot(page, 'Magia aprendida').getByRole('button', { name: 'Rolar novamente' }).click(); await confirm(page);
  const rerolled = await exported(page);
  expect(rerolled.events.slice(0,8)).toEqual(character.events);
  expect(rerolled.events.at(-1)?.slotId).toBe('spell');
  expect(rerolled.events.at(-1)?.rerollIndex).toBe(1);
});
