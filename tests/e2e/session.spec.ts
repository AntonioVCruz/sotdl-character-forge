import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Character } from '../../packages/character-generator';

const sheet = (p: Page) => p.getByRole('region', { name: 'Ficha confirmada', exact: true });
const panel = (p: Page) => p.getByRole('region', { name: 'Conjuração e efeitos de sessão', exact: true });
const defense = (p: Page) => sheet(p).locator('dl > div').filter({ has: p.locator('dt', { hasText: /^defense$/ }) }).locator('dd');
async function confirm(p: Page) {
  const draft = p.getByRole('region', { name: 'Prévia da geração', exact: true });
  await draft.getByRole('button', { name: /Confirmar prévia|Salvar rascunho com pendências/ }).click();
  await expect(draft).toHaveCount(0);
}
async function exported(p: Page): Promise<Character> {
  const download = p.waitForEvent('download');
  await p.getByRole('button', { name: 'Exportar personagem JSON' }).click();
  return JSON.parse(await readFile((await (await download).path())!, 'utf8'));
}
async function setup(p: Page) {
  await p.goto('/');
  await p.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(p.getByRole('status')).toContainText('Fontes da demonstração prontas');
  await p.getByLabel('Modo de criação').selectOption('all-random');
  await p.getByLabel('Permitir sorteio uniforme entre opções válidas (não oficial)').check();
  await p.getByRole('button', { name: 'Gerar personagem inteiro — prévia' }).click(); await confirm(p);
  await p.getByLabel('Nível-alvo').selectOption('1');
  await p.getByRole('button', { name: 'Alterar nível — prévia' }).click(); await confirm(p);
  for (const [name, key] of [['Caminho iniciante', 'demo:path:spark'], ['Treinamento do caminho', 'demo:training:focus'], ['Tradição', 'demo:tradition:ember'], ['Magia aprendida', 'demo:spell:lantern']]) {
    const group = p.getByRole('group', { name, exact: true });
    await group.getByLabel(`Escolha manual — ${name}`).selectOption(key);
    await group.getByRole('button', { name: 'Prévia da escolha manual' }).click(); await confirm(p);
  }
}

test('conjura, ativa, salva/reabre e encerra restaurando ficha e preservando usos', async ({ page }) => {
  await setup(page);
  const baseline = Number(await defense(page).textContent()), original = await exported(page);
  await expect(panel(page)).toContainText('2 de 2');
  await panel(page).getByRole('button', { name: 'Registrar conjuração' }).click();
  await expect(panel(page)).toContainText('1 de 2');
  await expect(defense(page)).toHaveText(String(baseline));
  const first = panel(page).getByRole('article', { name: 'Efeito session-1', exact: true });
  await first.getByRole('button', { name: 'Ativar efeito' }).click();
  await expect(defense(page)).toHaveText(String(baseline + 1));
  await expect(sheet(page)).toContainText('Manto da lanterna');
  const active = await exported(page);
  expect(active.events).toEqual(original.events); expect(active.session.actions).toHaveLength(2);
  await page.reload();
  await expect(defense(page)).toHaveText(String(baseline + 1));
  await expect(panel(page)).toContainText('1 de 2');
  expect(await exported(page)).toEqual(active);
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'active.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(active)) });
  await expect(page.getByRole('region', { name: 'Criador demonstrativo', exact: true })).toContainText('Personagem importado');
  expect(await exported(page)).toEqual(active);
  await panel(page).screenshot({ path: 'test-results/session-active.png' });
  await first.getByRole('button', { name: 'Encerrar efeito' }).click();
  await expect(defense(page)).toHaveText(String(baseline));
  await expect(panel(page)).toContainText('1 de 2');
  await panel(page).getByRole('button', { name: 'Registrar conjuração' }).click();
  await expect(panel(page)).toContainText('0 de 2');
  await expect(panel(page).getByRole('button', { name: 'Registrar conjuração' })).toBeDisabled();
  await panel(page).getByRole('article', { name: 'Efeito session-4', exact: true }).getByRole('button', { name: 'Ativar efeito' }).click();
  await expect(defense(page)).toHaveText(String(baseline + 1));
  await panel(page).getByRole('button', { name: 'Descansar e restaurar usos' }).click();
  await expect(defense(page)).toHaveText(String(baseline)); await expect(panel(page)).toContainText('2 de 2');
  const rested = await exported(page);
  expect(rested.events).toEqual(original.events); expect(rested.session.actions.at(-1)?.type).toBe('rest');
  expect(rested.session.actions.slice(0,2)).toEqual(active.session.actions);
});

test('efeito fica suspenso sem fonte e pode ser encerrado sem perder histórico', async ({ page }) => {
  await setup(page);
  const baseline = Number(await defense(page).textContent());
  await panel(page).getByRole('button', { name: 'Registrar conjuração' }).click();
  const first = panel(page).getByRole('article', { name: 'Efeito session-1', exact: true });
  await first.getByRole('button', { name: 'Ativar efeito' }).click();
  await expect(defense(page)).toHaveText(String(baseline + 1));
  await page.getByRole('checkbox', { name: 'Habilitar demo-spell-session 0.0.1' }).click();
  await expect(first).toContainText('Suspenso'); await expect(defense(page)).toHaveText(String(baseline));
  await expect(panel(page).getByRole('button', { name: 'Registrar conjuração' })).toBeDisabled();
  await first.getByRole('button', { name: 'Encerrar efeito' }).click();
  await panel(page).getByRole('button', { name: 'Descansar e restaurar usos' }).click();
  await page.getByRole('checkbox', { name: 'Habilitar demo-spell-session 0.0.1' }).click();
  await expect(panel(page)).toContainText('2 de 2'); await expect(defense(page)).toHaveText(String(baseline));
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const saved = await exported(page); expect(saved.session.actions).toHaveLength(4);
});
