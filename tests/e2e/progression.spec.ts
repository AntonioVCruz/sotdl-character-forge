import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Character } from '../../packages/character-generator';

const sheet = (p: Page) => p.getByRole('region', { name: 'Ficha confirmada', exact: true });
const draft = (p: Page) => p.getByRole('region', { name: 'Prévia da geração', exact: true });
async function confirm(p: Page) {
  await draft(p).getByRole('button', { name: /Confirmar prévia|Salvar rascunho com pendências/ }).click();
  await expect(draft(p)).toHaveCount(0);
}
async function exported(p: Page): Promise<Character> {
  const pending = p.waitForEvent('download');
  await p.getByRole('button', { name: 'Exportar personagem JSON' }).click();
  return JSON.parse(await readFile((await (await pending).path())!, 'utf8'));
}
async function setup(p: Page) {
  await p.goto('/');
  await p.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(p.getByRole('status')).toContainText('Fontes da demonstração prontas');
  await p.getByLabel('Modo de criação').selectOption('all-random');
  await p.getByLabel('Permitir sorteio uniforme entre opções válidas (não oficial)').check();
  await p.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(p);
}

test('progressão manual marcial/mágica, revisão do treinamento e restauração', async ({ page }) => {
  await setup(page);
  const base = await exported(page);
  await page.getByLabel('Nível-alvo').selectOption('1');
  await page.getByRole('button', { name: 'Alterar nível — prévia' }).click();
  await expect(draft(page)).toContainText('Mudança de nível: 0 → 1'); await confirm(page);
  const path = page.getByRole('group', { name: 'Caminho iniciante', exact: true });
  const training = page.getByRole('group', { name: 'Treinamento do caminho', exact: true });
  await path.getByLabel('Escolha manual — Caminho iniciante').selectOption('demo:path:guardian');
  await path.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  await training.getByLabel('Escolha manual — Treinamento do caminho').selectOption('demo:training:guard');
  await training.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  await expect(sheet(page)).toContainText('Personagem demonstrativo completo');
  await expect(sheet(page)).toContainText('Caminho iniciante:');
  await expect(sheet(page)).toContainText('Treinamento:');
  await expect(sheet(page)).not.toContainText('novicePath:');
  await expect(sheet(page)).not.toContainText('pathTraining:');
  expect((await exported(page)).events.slice(0,4)).toEqual(base.events);
  await path.getByLabel('Travar Caminho iniciante').click();
  await expect(path.getByLabel('Travar Caminho iniciante')).not.toBeChecked();
  await path.getByLabel('Escolha manual — Caminho iniciante').selectOption('demo:path:spark');
  await path.getByRole('button', { name: 'Prévia da escolha manual' }).click();
  await expect(draft(page)).toContainText('Dependência alterada'); await confirm(page);
  await expect(training.getByLabel('Travar Treinamento do caminho')).toBeChecked();
  await expect(sheet(page)).toContainText('Rascunho com pendências');
  await training.getByLabel('Travar Treinamento do caminho').click();
  await expect(training.getByLabel('Travar Treinamento do caminho')).not.toBeChecked();
  await expect(training.getByRole('option', { name: 'Proteção da trilha (fictício)' })).toHaveCount(0);
  await training.getByLabel('Escolha manual — Treinamento do caminho').selectOption('demo:training:insight');
  await training.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  await expect(sheet(page)).toContainText('demo-arcane-reserve: 2');
  const magic = await exported(page);
  await page.reload();
  await expect(sheet(page)).toContainText('Aprendiz da Centelha');
  expect(await exported(page)).toEqual(magic);
  await path.getByLabel('Travar Caminho iniciante').click();
  await expect(path.getByLabel('Travar Caminho iniciante')).not.toBeChecked();
  await path.getByRole('button', { name: 'Restaurar escolha anterior' }).click(); await confirm(page);
  await expect(sheet(page)).toContainText('Guardião da Trilha');
  expect((await exported(page)).events).toHaveLength(9);
});

test('migra JSON v1, progride aleatoriamente e desfaz nível sem perder decisões', async ({ page }) => {
  await setup(page);
  const base = await exported(page);
  const { levelChanges: _, ...old } = base;
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'v1.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...old, schemaVersion: 1 })) });
  await expect(page.getByRole('region', { name: 'Criador demonstrativo', exact: true })).toContainText('Personagem importado');
  expect((await exported(page)).schemaVersion).toBe(2);
  await page.getByLabel('Nível-alvo').selectOption('1');
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click();
  await draft(page).getByRole('button', { name: 'Cancelar prévia' }).click();
  expect((await exported(page)).level).toBe(0);
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(page);
  const advanced = await exported(page);
  expect(advanced.events).toHaveLength(6); expect(advanced.events.slice(0,4)).toEqual(base.events);
  await page.getByLabel('Nível-alvo').selectOption('0');
  await page.getByRole('button', { name: 'Alterar nível — prévia' }).click();
  await expect(draft(page)).toContainText('serão suspensos'); await confirm(page);
  expect((await exported(page)).events).toEqual(advanced.events);
  await expect(page.getByRole('group', { name: 'Caminho iniciante', exact: true })).toHaveCount(0);
  await page.getByLabel('Nível-alvo').selectOption('1');
  await page.getByRole('button', { name: 'Alterar nível — prévia' }).click(); await confirm(page);
  await expect(sheet(page)).toContainText('Personagem demonstrativo completo');
  const restored = await exported(page);
  expect(restored.events).toEqual(advanced.events); expect(restored.levelChanges).toHaveLength(3);
  await page.reload();
  await expect(sheet(page)).toContainText('nível 1'); expect(await exported(page)).toEqual(restored);
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'level1.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(restored)) });
  await expect(page.getByRole('region', { name: 'Criador demonstrativo', exact: true })).toContainText('Personagem importado');
  expect(await exported(page)).toEqual(restored);
  await sheet(page).screenshot({ path: 'test-results/level-one-sheet.png' });
});
