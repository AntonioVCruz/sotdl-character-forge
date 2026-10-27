import { test, expect, chromium, type Page } from '@playwright/test';
import { readFile, writeFile, unlink, mkdir, stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { emptySnapshot, importPack, setEnabled } from '../../packages/catalog';
import { calculateCharacter, chooseSlot, exportCharacter, newCharacter, performSessionCommand, preview, type Policy } from '../../packages/character-generator';
import tables from '../../examples/demo-random-tables.json' with { type: 'json' };
import zero from '../../examples/demo-level-zero.json' with { type: 'json' };
import one from '../../examples/demo-level-one.json' with { type: 'json' };
import magic from '../../examples/demo-magic.json' with { type: 'json' };
import sessionPack from '../../examples/demo-spell-session.json' with { type: 'json' };

function fixture() {
  let catalog = emptySnapshot();
  for (const pack of [tables, zero, one, magic, sessionPack]) catalog = importPack(catalog, pack).snapshot;
  for (const pack of catalog.packs) catalog = setEnabled(catalog, pack, true);
  const policy: Policy = { seed: 'offline-active', targetLevel: 1, mode: 'all-random', allowUniform: true, perSlotModes: {} };
  let character = preview(newCharacter(), catalog, { ...policy, targetLevel: 0 }).character;
  character = preview(character, catalog, { ...policy, mode: 'manual' }).character;
  for (const [slot, key] of [['novicePath', 'demo:path:spark'], ['pathTraining', 'demo:training:focus'], ['tradition', 'demo:tradition:ember'], ['spell', 'demo:spell:lantern']] as const) character = chooseSlot(character, catalog, slot, policy, { key, quantities: {} });
  character = performSessionCommand(character, catalog, { type: 'cast' });
  character = performSessionCommand(character, catalog, { type: 'activate', castId: 'session-1' });
  character = { ...character, name: 'Ari - Ficha autônoma', notes: 'Ficha demonstrativa para uso offline.' };
  return { character, catalog };
}
async function setup(page: Page, character: ReturnType<typeof fixture>['character']) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(page.getByRole('status')).toContainText('Fontes da demonstração prontas');
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'initial.json', mimeType: 'application/json', buffer: Buffer.from(exportCharacter(character)) });
  await expect(page.getByRole('region', { name: 'Criador demonstrativo', exact: true })).toContainText('Personagem importado');
}
async function download(page: Page, button: string, path: string) {
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: button, exact: true }).click();
  const downloaded = await pending;
  const bytes = await readFile((await downloaded.path())!);
  await unlink(path).catch(error => { if (error.code !== 'ENOENT') throw error; });
  await writeFile(path, bytes);
}
async function offlineBrowser() {
  // A fresh browser models opening the downloaded artifact independently of the app.
  const browser = await chromium.launch();
  const context = await browser.newContext({ offline: true, acceptDownloads: true });
  const network: string[] = [];
  context.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
  await context.route(/^https?:/, route => route.abort());
  await context.addInitScript(() => {
    const audit = { violations: [] as string[] };
    (window as unknown as { offlineAudit: typeof audit }).offlineAudit = audit;
    document.addEventListener('securitypolicyviolation', event => audit.violations.push(event.violatedDirective));
    Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('Storage indisponível'); } });
    Object.defineProperty(window, 'indexedDB', { get: () => { throw new Error('IndexedDB indisponível'); } });
  });
  return { context, network, browser };
}
const offlineSheet = (page: Page) => page.getByRole('region', { name: 'Ficha offline', exact: true });
const defense = (page: Page) => offlineSheet(page).locator('dl > div').filter({ has: page.locator('dt', { hasText: /^defense$/ }) }).locator('dd');

test('HTML file:// opera offline, salva nova cópia e JSON reimportável sem perder histórico', async ({ page }) => {
  const { character, catalog } = fixture(), initialView = calculateCharacter(character, catalog);
  await setup(page, character); await mkdir('output/html', { recursive: true });
  const initialPath = resolve('output/html/personagem-offline.html');
  await download(page, 'Exportar HTML offline', initialPath);
  expect((await stat(initialPath)).size).toBeLessThan(2_000_000);
  const { context, network, browser } = await offlineBrowser();
  const offline = await context.newPage();
  offline.setDefaultTimeout(5000);
  await offline.goto(pathToFileURL(initialPath).href);
  await expect(offlineSheet(offline)).toContainText(character.name);
  await expect(defense(offline)).toHaveText(String(initialView.stats.defense));
  await expect(offline.getByRole('button', { name: 'Gerar personagem inteiro — prévia' })).toHaveCount(0);
  await offline.getByRole('button', { name: 'Encerrar efeito', exact: true }).click();
  await expect(defense(offline)).toHaveText(String(initialView.stats.defense! - 1));
  await offline.getByRole('region', { name: 'Inventário e equipamento', exact: true }).getByRole('button', { name: 'Desequipar item' }).click();
  await expect(defense(offline)).toHaveText(String(initialView.stats.defense! - 2));
  await offline.getByLabel('Nome (opcional)', { exact: true }).fill('Ari - Edição offline');
  await offline.getByLabel('Notas (opcionais)', { exact: true }).fill('Nota editada sem internet.');
  await expect(offline.getByRole('button', { name: 'Salvar personagem JSON' })).toBeDisabled();
  await offline.getByRole('button', { name: 'Aplicar nome e notas' }).click();
  const jsonPath = resolve('output/html/personagem-offline.json');
  await download(offline, 'Salvar personagem JSON', jsonPath);
  const edited = JSON.parse(await readFile(jsonPath, 'utf8'));
  expect(edited.events).toEqual(character.events); expect(edited.session.actions.slice(0,2)).toEqual(character.session.actions);
  expect(edited.session.actions.at(-2).type).toBe('end');
  expect(edited.session.actions.at(-1).type).toBe('equipment');
  const updatedPath = resolve('output/html/personagem-offline-atualizado.html');
  await download(offline, 'Salvar nova cópia HTML', updatedPath);
  expect((await stat(updatedPath)).size).toBeLessThan((await stat(initialPath)).size + 10000);
  const reopened = await context.newPage(); await reopened.goto(pathToFileURL(updatedPath).href);
  await expect(offlineSheet(reopened)).toContainText('Ari - Edição offline');
  await expect(defense(reopened)).toHaveText(String(initialView.stats.defense! - 2));
  await expect(reopened.getByRole('region', { name: 'Inventário e equipamento', exact: true })).toContainText('Guardado');
  await expect(reopened.getByRole('region', { name: 'Conjuração e efeitos de sessão' })).toContainText('1 de 2');
  const reopenedJSON = resolve('test-results/reopened-offline.json');
  await download(reopened, 'Salvar personagem JSON', reopenedJSON);
  expect(JSON.parse(await readFile(reopenedJSON, 'utf8'))).toEqual(edited);
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles(jsonPath);
  await expect(page.getByRole('region', { name: 'Ficha confirmada', exact: true })).toContainText('Ari - Edição offline');
  const mainJSON = resolve('test-results/main-reimported.json');
  await download(page, 'Exportar personagem JSON', mainJSON);
  expect(JSON.parse(await readFile(mainJSON, 'utf8'))).toEqual(edited);
  await reopened.emulateMedia({ media: 'print' });
  await expect(reopened.locator(`[data-print-stat="defense"]`)).toHaveText(String(initialView.stats.defense! - 2));
  await mkdir('output/pdf', { recursive: true });
  await reopened.pdf({ path: 'output/pdf/personagem-offline.pdf', preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  execFileSync('python', ['tools/verify-print-pdf.py', 'output/pdf/personagem-offline.pdf', '--expect', 'Ari - Edição offline', '--expect', 'Nota editada sem internet.', '--expect', 'Nenhum efeito solicitado como ativo.', '--expect', 'Guardado', '--expect', 'Modificadores não aplicados']);
  expect(network).toEqual([]);
  expect(await offline.evaluate(() => (window as unknown as { offlineAudit: { violations: string[] } }).offlineAudit.violations)).toEqual([]);
  expect(await reopened.evaluate(() => (window as unknown as { offlineAudit: { violations: string[] } }).offlineAudit.violations)).toEqual([]);
  await reopened.emulateMedia({ media: 'screen' }); await reopened.screenshot({ path: 'test-results/standalone-sheet.png', fullPage: true });
  const session = reopened.getByRole('region', { name: 'Conjuração e efeitos de sessão', exact: true });
  await session.getByRole('button', { name: 'Registrar conjuração', exact: true }).click();
  await expect(session).toContainText('0 de 2');
  await session.getByRole('article', { name: 'Efeito session-5', exact: true }).getByRole('button', { name: 'Ativar efeito' }).click();
  await expect(defense(reopened)).toHaveText(String(initialView.stats.defense! - 1));
  await session.getByRole('button', { name: 'Descansar e restaurar usos' }).click();
  await expect(session).toContainText('2 de 2'); await expect(defense(reopened)).toHaveText(String(initialView.stats.defense! - 2));
  await reopened.getByRole('region', { name: 'Inventário e equipamento', exact: true }).getByRole('button', { name: 'Equipar item', exact: true }).click();
  await expect(defense(reopened)).toHaveText(String(initialView.stats.defense! - 1));
  await context.close(); await browser.close();
});

test('conteúdo malicioso permanece texto e fonte desabilitada permanece indisponível no arquivo', async ({ page }) => {
  const { character } = fixture();
  character.name = '</title><script>window.pwned=true</script>';
  character.notes = '</script><img src="https://example.invalid/x" onerror="window.pwned=true">';
  await setup(page, character);
  await page.getByRole('checkbox', { name: 'Habilitar demo-magic 0.0.1' }).click();
  await expect(page.getByRole('region', { name: 'Ficha confirmada', exact: true })).toContainText('Fonte original indisponível');
  const path = resolve('test-results/offline-untrusted.html'); await download(page, 'Exportar HTML offline', path);
  const { context, network, browser } = await offlineBrowser(), offline = await context.newPage();
  await offline.goto(pathToFileURL(path).href);
  await expect(offlineSheet(offline)).toContainText(character.name);
  await expect(offlineSheet(offline)).toContainText('Fonte original indisponível');
  await expect(offline.getByRole('button', { name: 'Registrar conjuração', exact: true })).toBeDisabled();
  await expect(offline.locator('img')).toHaveCount(0);
  expect(await offline.evaluate(() => 'pwned' in window)).toBe(false);
  expect(network).toEqual([]);
  expect(await offline.evaluate(() => (window as unknown as { offlineAudit: { violations: string[] } }).offlineAudit.violations)).toEqual([]);
  await context.close(); await browser.close();
});
