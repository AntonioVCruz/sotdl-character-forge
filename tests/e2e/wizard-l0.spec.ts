import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const wizard = (page: Page) => page.getByRole('region', { name: 'Criador nível 0', exact: true });
const card = (page: Page, title: string) => wizard(page).locator('article').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
const step = (page: Page, title: RegExp) => wizard(page).getByRole('navigation', { name: 'Passos do nível 0' }).getByRole('button', { name: title }).click();

async function propose(page: Page, title: string, option: string) {
  const slot = card(page, title);
  await slot.getByRole('button', { name: 'Escolher manualmente', exact: true }).click();
  await slot.getByRole('radio', { name: option, exact: true }).click();
  await slot.getByRole('button', { name: 'Usar esta opção', exact: true }).click();
}

async function choose(page: Page, title: string, option: string) {
  await propose(page, title, option);
  await card(page, title).getByRole('button', { name: 'Confirmar', exact: true }).click();
}

test('Manual permite sorteio local e rerrolagem sem aplicar nem perder a escolha confirmada', async ({ page }) => {
  await page.goto('/');
  await wizard(page).getByRole('textbox', { name: 'Seed da sessão', exact: true }).fill('p2-manual');
  await wizard(page).getByRole('checkbox', { name: /^Autorizar sorteio uniforme/ }).check();
  await step(page, /^Ancestry/);
  await choose(page, 'Ancestry', 'Human — recorte Core (fictício)');
  const before = (await wizard(page).getByRole('complementary', { name: 'Ficha ao vivo' }).textContent()) ?? '';
  const ancestry = card(page, 'Ancestry');
  await expect(wizard(page).getByRole('button', { name: 'Manual', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(ancestry.getByRole('button', { name: 'Sortear', exact: true })).toBeEnabled();
  await ancestry.getByRole('button', { name: 'Sortear', exact: true }).click();
  await expect(ancestry).toContainText('aleatório entre opções válidas (não oficial)');
  await ancestry.getByRole('button', { name: 'Rolar novamente', exact: true }).click();
  await ancestry.locator('summary').click();
  await expect(ancestry).toContainText('rerolagem #1');
  await expect(wizard(page).getByRole('complementary', { name: 'Ficha ao vivo' })).toHaveText(before);
  await ancestry.getByRole('button', { name: 'Descartar prévia', exact: true }).click();
  await expect(ancestry).toContainText('Resultado na ficha: Human — recorte Core (fictício)');
  await expect(wizard(page).getByRole('button', { name: 'Gerar tudo aleatoriamente', exact: true })).toBeDisabled();
});

test('trocar Core por Only Human torna a prévia de benefício revisável e impede sua confirmação', async ({ page }) => {
  await page.goto('/');
  await step(page, /^Ancestry/);
  await choose(page, 'Ancestry', 'Human — recorte Core (fictício)');
  await step(page, /^Benefício Human/);
  await propose(page, 'Benefício Human', 'Ofício extra (rótulo fictício, sem tabela)');
  await step(page, /^Ancestry/);
  await choose(page, 'Ancestry', 'Human — recorte Only Human (fictício)');
  await step(page, /^Benefício Human/);
  const benefit = card(page, 'Benefício Human');
  await expect(benefit).toHaveAttribute('data-choice-slot', 'needs-review');
  await expect(benefit).toContainText('Human Development Tables');
  const confirm = benefit.getByRole('button', { name: 'Confirmar', exact: true });
  await expect(confirm).toBeDisabled();
  await confirm.click({ force: true });
  await expect(benefit).toContainText('Resultado proposto');
  await expect(wizard(page).getByRole('complementary', { name: 'Ficha ao vivo' })).not.toContainText('Benefício Human: Ofício extra');
  await benefit.getByRole('button', { name: 'Descartar prévia', exact: true }).click();
  await expect(confirm).toHaveCount(0);
});

test('aceite desktop: teclado, foco, inválidas, revisão e geometria dos frames 1b/1e', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await step(page, /^Ancestry/);
  const ancestry = card(page, 'Ancestry');
  const opener = ancestry.getByRole('button', { name: 'Escolher manualmente', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  const panel = ancestry.getByRole('region', { name: 'Escolher manualmente Ancestry', exact: true });
  await expect(panel).toBeFocused();
  const unavailable = panel.getByRole('radio').filter({ hasText: 'Shadow of the Demon Lord Core' });
  await expect(unavailable).toHaveAttribute('aria-disabled', 'true');
  await expect(unavailable).toContainText('Ruleset oficial desligado');
  await unavailable.focus();
  await page.keyboard.press('Space');
  await expect(unavailable).toHaveAttribute('aria-checked', 'false');
  await mkdir('tmp/acceptance-s1', { recursive: true });
  await wizard(page).screenshot({ path: 'tmp/acceptance-s1/choice-slot-invalid.png' });
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await opener.press('Enter');
  const valid = panel.getByRole('radio', { name: 'Human — recorte Core (fictício)', exact: true });
  await valid.focus();
  await page.keyboard.press('Space');
  await expect(valid).toHaveAttribute('aria-checked', 'true');
  await expect(valid).toHaveCSS('outline-width', '3px');
  await panel.getByRole('button', { name: 'Usar esta opção', exact: true }).press('Enter');
  await ancestry.getByRole('button', { name: 'Confirmar', exact: true }).press('Enter');
  const nav = wizard(page).getByRole('navigation', { name: 'Passos do nível 0' });
  const center = wizard(page).locator('.wizard-step');
  const sheet = wizard(page).getByRole('complementary', { name: 'Ficha ao vivo' });
  const [leftBox, centerBox, rightBox] = await Promise.all([nav.boundingBox(), center.boundingBox(), sheet.boundingBox()]);
  expect(leftBox!.x + leftBox!.width).toBeLessThan(centerBox!.x);
  expect(centerBox!.x + centerBox!.width).toBeLessThan(rightBox!.x);
  await expect(sheet).toHaveCSS('position', 'sticky');
  await mkdir('tmp/acceptance-s1', { recursive: true });
  await wizard(page).screenshot({ path: 'tmp/acceptance-s1/desktop-1440.png' });
  await page.setViewportSize({ width: 1100, height: 1000 });
  const [left1100, center1100, right1100] = await Promise.all([nav.boundingBox(), center.boundingBox(), sheet.boundingBox()]);
  expect(left1100!.x + left1100!.width).toBeLessThan(center1100!.x);
  expect(center1100!.x + center1100!.width).toBeLessThan(right1100!.x);
  await wizard(page).screenshot({ path: 'tmp/acceptance-s1/desktop-1100.png' });
  await step(page, /^Revisão L0/);
  await expect(wizard(page)).toContainText('Rascunho com pendências');
  await expect(wizard(page).getByRole('button', { name: 'Confirmar revisão L0', exact: true })).toBeDisabled();
});

test('aceite da revisão Core fictícia: ficha só muda ao confirmar e Completo exige escolhas obrigatórias', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await step(page, /^Ancestry/);
  await choose(page, 'Ancestry', 'Human — recorte Core (fictício)');
  await step(page, /^Atributos/);
  await choose(page, 'Modo de atributos', 'Usar atributos fixos');
  await choose(page, 'Aumento fixo', 'Strength');
  const sheet = wizard(page).getByRole('complementary', { name: 'Ficha ao vivo' });
  await expect(sheet.locator('dt').filter({ hasText: /^Strength$/ }).locator('..')).toContainText('11');
  await step(page, /^Size/);
  await propose(page, 'Size', 'Size 1/2');
  await card(page, 'Size').getByRole('button', { name: 'Descartar prévia', exact: true }).click();
  await expect(sheet).not.toContainText('Size: Size 1/2');
  await choose(page, 'Size', 'Size 1');
  await step(page, /^Benefício Human/);
  await choose(page, 'Benefício Human', 'Ofício extra (rótulo fictício, sem tabela)');
  await step(page, /^Profissões e idiomas/);
  await choose(page, 'Profissão', 'Arquivista da ponte (fictício)');
  await step(page, /^Wealth e kit/);
  await choose(page, 'Wealth', 'Bolso leve (fictício)');
  await choose(page, 'Kit inicial', 'Kit do viajante (fictício)');
  await step(page, /^Interesting Thing/);
  await choose(page, 'Interesting Thing', 'Um botão de vidro sem casa (fictício)');
  await step(page, /^Revisão L0/);
  await expect(wizard(page).locator('.wizard-step')).toContainText('Completo');
  await wizard(page).getByRole('button', { name: 'Confirmar revisão L0', exact: true }).click();
  await expect(wizard(page)).toContainText('Revisão L0 confirmada.');
  await mkdir('tmp/acceptance-s1', { recursive: true });
  await wizard(page).screenshot({ path: 'tmp/acceptance-s1/review-l0.png' });
});
