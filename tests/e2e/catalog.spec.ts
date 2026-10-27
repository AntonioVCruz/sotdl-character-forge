import { test, expect } from '@playwright/test';
import demo from '../../examples/demo-pack.json' with { type: 'json' };

test('importa, habilita, filtra e reabre fontes; falha não altera catálogo', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Carregar exemplos fictícios' }).click();
  await expect(page.getByRole('status')).toContainText('Exemplos importados');
  await expect(page.getByRole('heading', { name: 'Demo Background (3d6)', exact: true })).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Habilitar demo-random-tables 0.0.1' }).click();
  await expect(page.getByRole('checkbox', { name: 'Habilitar demo-random-tables 0.0.1' })).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Demo Background (3d6)', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Habilitar demo-random-tables 0.0.1' })).toBeChecked();
  await page.getByLabel('Buscar por nome, ID ou fonte').fill('Background');
  await expect(page.getByRole('heading', { name: 'Demo Thing A (d20)', exact: true })).toHaveCount(0);
  await page.getByLabel('Importar pack JSON', { exact: true }).setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"system":"unknown"}') });
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Demo Background (3d6)', exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Habilitar demo-random-tables 0.0.1' }).click();
  await expect(page.getByRole('status')).toContainText('Referências históricas');
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Habilitar demo-random-tables 0.0.1' })).not.toBeChecked();
});

test('nomes iguais coexistem e strings importadas não executam HTML', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Carregar exemplos fictícios' }).click();
  await expect(page.getByRole('status')).toContainText('Exemplos importados');
  const other = structuredClone(demo); other.packId = 'other'; other.source.id = 'other';
  other.entities.forEach(e => { e.id = `other:${e.id}`; e.sourceRef = 'other'; });
  other.entities[0].name = '<img src=x onerror=alert(1)>';
  await page.getByLabel('Importar pack JSON', { exact: true }).setInputFiles({ name: 'other.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(other)) });
  await expect(page.getByRole('status')).toContainText('Pack validado');
  await page.getByRole('checkbox', { name: 'Habilitar other 0.0.1' }).click();
  await expect(page.getByRole('status')).toContainText('Fonte habilitada');
  await page.getByRole('checkbox', { name: 'Habilitar demo-test-only 0.0.1' }).click();
  await expect(page.getByRole('heading', { name: 'Brief Glow (fictícia)', exact: true })).toHaveCount(2);
  await expect(page.getByRole('heading', { name: '<img src=x onerror=alert(1)>', exact: true })).toBeVisible();
  await expect(page.locator('img')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
