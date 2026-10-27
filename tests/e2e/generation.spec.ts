import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Character } from '../../packages/character-generator';

const builder = (page: Page) => page.getByRole('region', { name: 'Criador demonstrativo', exact: true });
const confirmed = (page: Page) => page.getByRole('region', { name: 'Ficha confirmada', exact: true });
const proposal = (page: Page) => page.getByRole('region', { name: 'Prévia da geração', exact: true });
async function setup(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(page.getByRole('status')).toContainText('Fontes da demonstração prontas');
}
async function confirm(page: Page) {
  await proposal(page).getByRole('button', { name: /Confirmar prévia|Salvar rascunho com pendências/ }).click();
  await expect(proposal(page)).toHaveCount(0);
}
async function downloadCharacter(page: Page): Promise<Character> {
  const pending = page.waitForEvent('download');
  await builder(page).getByRole('button', { name: 'Exportar personagem JSON' }).click();
  const download = await pending;
  return JSON.parse(await readFile((await download.path())!, 'utf8'));
}

test('tudo aleatório: cancelar, confirmar, exportar/importar e reabrir preservam rolls', async ({ page }) => {
  await setup(page);
  await page.getByLabel('Modo de criação').selectOption('all-random');
  await page.getByLabel('Seed', { exact: true }).fill('e2e-replay');
  await page.getByLabel('Permitir sorteio uniforme entre opções válidas (não oficial)').check();
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click();
  await expect(proposal(page)).toContainText('Todas as escolhas obrigatórias foram resolvidas');
  await expect(confirmed(page)).toContainText('Rascunho com pendências');
  await proposal(page).getByRole('button', { name: 'Cancelar prévia' }).click();
  expect((await downloadCharacter(page)).events).toHaveLength(0);
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click();
  await confirm(page);
  await expect(confirmed(page)).toContainText('Personagem demonstrativo completo');
  const original = await downloadCharacter(page);
  expect(original.events).toHaveLength(4);
  expect(original.events.some(e => e.resolution.rolls.length >= 2)).toBe(true);
  await page.reload();
  await expect(confirmed(page)).toContainText('Personagem demonstrativo completo');
  expect(await downloadCharacter(page)).toEqual(original);
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'replay.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(original)) });
  await expect(builder(page)).toContainText('Personagem importado sem refazer sorteios');
  expect(await downloadCharacter(page)).toEqual(original);
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"schemaVersion":123}') });
  await expect(builder(page).getByRole('alert')).toBeVisible();
  expect(await downloadCharacter(page)).toEqual(original);
  await page.screenshot({ path: 'test-results/character-desktop.png', fullPage: true });
});

test('manual: escolhe cada etapa e quantidade sem gerar faces; híbrido preserva locks', async ({ page }) => {
  await setup(page);
  const ancestry = page.getByRole('group', { name: 'Ancestralidade', exact: true });
  await ancestry.getByLabel('Escolha manual — Ancestralidade').selectOption('demo:ancestry:test');
  await ancestry.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  await expect(ancestry.getByLabel('Travar Ancestralidade')).toBeChecked();
  const background = page.getByRole('group', { name: 'Background', exact: true });
  await background.getByLabel('Escolha manual — Background').selectOption('["bg-a"]');
  await background.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  const equipment = page.getByRole('group', { name: 'Equipamento', exact: true });
  await equipment.getByLabel('Escolha manual — Equipamento').selectOption('demo:equipment:coat');
  await equipment.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  const thing = page.getByRole('group', { name: 'Objeto curioso', exact: true });
  await thing.getByLabel('Escolha manual — Objeto curioso').selectOption('["table-b","thing-b2"]');
  await thing.getByLabel('Quantidade de demo-token (1–6)').fill('4');
  await thing.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  await expect(confirmed(page)).toContainText('Personagem demonstrativo completo');
  await expect(confirmed(page)).toContainText('demo-token: 4');
  const manual = await downloadCharacter(page);
  expect(manual.events.every(e => e.strategy === 'manual' && e.resolution.rolls.length === 0)).toBe(true);
  await background.getByLabel('Travar Background').click();
  await expect(background.getByLabel('Travar Background')).not.toBeChecked();
  await page.getByLabel('Modo de criação').selectOption('hybrid');
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(page);
  const hybrid = await downloadCharacter(page);
  expect(hybrid.events.slice(0, 4)).toEqual(manual.events);
  expect(hybrid.events).toHaveLength(5);
  expect(hybrid.events[4].slotId).toBe('background');
  expect(hybrid.events[4].resolution.rolls[0].faces).toHaveLength(3);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/character-mobile.png', fullPage: true });
});

test('trocar ancestralidade mantém background antigo com pendência; fonte desabilitada suspende benefícios', async ({ page }) => {
  await setup(page);
  const ancestry = page.getByRole('group', { name: 'Ancestralidade', exact: true });
  await ancestry.getByLabel('Escolha manual — Ancestralidade').selectOption('demo:ancestry:test');
  await ancestry.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(page);
  await page.getByLabel('Modo de criação').selectOption('all-random');
  await page.getByLabel('Permitir sorteio uniforme entre opções válidas (não oficial)').check();
  await page.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(page);
  const original = await downloadCharacter(page);
  await ancestry.getByLabel('Travar Ancestralidade').click();
  await expect(ancestry.getByLabel('Travar Ancestralidade')).not.toBeChecked();
  await ancestry.getByLabel('Escolha manual — Ancestralidade').selectOption('demo:ancestry:coast');
  await ancestry.getByRole('button', { name: 'Prévia da escolha manual' }).click();
  await expect(proposal(page)).toContainText('Dependência alterada'); await confirm(page);
  await expect(confirmed(page)).toContainText('Rascunho com pendências');
  const changed = await downloadCharacter(page);
  expect(changed.events.slice(0,4)).toEqual(original.events);
  await page.getByRole('checkbox', { name: 'Habilitar demo-level-zero 0.0.1' }).click();
  await expect(confirmed(page)).toContainText('Fonte original indisponível');
  expect((await downloadCharacter(page)).events).toEqual(changed.events);
});
