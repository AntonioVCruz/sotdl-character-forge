import { test, expect, type Page } from '@playwright/test';

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
