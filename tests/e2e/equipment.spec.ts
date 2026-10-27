import { test, expect, type Page } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';
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
  const p: Policy = { seed: 'equipment-e2e', targetLevel: 1, mode: 'all-random', allowUniform: true, perSlotModes: {} };
  let character = preview(newCharacter(), catalog, { ...p, targetLevel: 0 }).character;
  character = chooseSlot(character, catalog, 'equipment', { ...p, targetLevel: 0 }, { key: 'demo:equipment:coat', quantities: {} });
  character = preview(character, catalog, { ...p, mode: 'manual' }).character;
  for (const [slot,key] of [['novicePath','demo:path:spark'], ['pathTraining','demo:training:focus'], ['tradition','demo:tradition:ember'], ['spell','demo:spell:lantern']] as const) character = chooseSlot(character, catalog, slot, p, { key, quantities: {} });
  character = performSessionCommand(character, catalog, { type: 'cast' });
  character = performSessionCommand(character, catalog, { type: 'activate', castId: 'session-1' });
  return { character: { ...character, name: 'Equipamento e magia - demonstração' }, catalog };
}
const panel = (p: Page) => p.getByRole('region', { name: 'Inventário e equipamento', exact: true });
const sheet = (p: Page) => p.getByRole('region', { name: 'Ficha confirmada', exact: true });
const defense = (p: Page) => sheet(p).locator('dl > div').filter({ has: p.locator('dt', { hasText: /^defense$/ }) }).locator('dd');
async function json(p: Page) {
  const waiting = p.waitForEvent('download'); await p.getByRole('button', { name: 'Exportar personagem JSON' }).click();
  return JSON.parse(await readFile((await (await waiting).path())!, 'utf8'));
}
test('equipamento combina com magia e estado guardado sobrevive a JSON, reload e PDF', async ({ page }) => {
  const { character, catalog } = fixture(), view = calculateCharacter(character, catalog);
  await page.goto('/');
  await page.getByRole('button', { name: 'Preparar fontes da demonstração' }).click();
  await expect(page.getByRole('status')).toContainText('Fontes da demonstração prontas');
  await page.getByLabel('Importar personagem JSON', { exact: true }).setInputFiles({ name: 'gear.json', mimeType: 'application/json', buffer: Buffer.from(exportCharacter(character)) });
  await expect(defense(page)).toHaveText(String(view.stats.defense));
  await expect(panel(page)).toContainText('quantidade: 1');
  await panel(page).getByRole('button', { name: 'Desequipar item' }).click();
  await expect(defense(page)).toHaveText(String(view.stats.defense! - 1));
  await expect(panel(page)).toContainText('Guardado');
  await expect(page.getByRole('region', { name: 'Conjuração e efeitos de sessão', exact: true })).toContainText('1 de 2');
  const stored = await json(page);
  expect(stored.events).toEqual(character.events); expect(stored.session.actions.at(-1)).toMatchObject({ type: 'equipment', equipped: false });
  await page.reload(); await expect(defense(page)).toHaveText(String(view.stats.defense! - 1));
  expect(await json(page)).toEqual(stored);
  await page.emulateMedia({ media: 'print' });
  const print = page.getByRole('article', { name: 'Ficha para impressão', exact: true });
  await expect(print).toContainText('Guardado'); await expect(print).toContainText('Manto da lanterna - Ativo');
  await expect(print.locator('[data-print-stat="defense"]')).toHaveText(String(view.stats.defense! - 1));
  await mkdir('output/pdf', { recursive: true });
  await page.pdf({ path: 'output/pdf/equipamento-guardado.pdf', preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  execFileSync('python', ['tools/verify-print-pdf.py', 'output/pdf/equipamento-guardado.pdf', '--expect', 'Guardado', '--expect', 'Manto da lanterna - Ativo', '--expect', 'Modificadores não aplicados', '--expect', 'bônus válidos']);
  await page.emulateMedia({ media: 'screen' });
  await panel(page).screenshot({ path: 'test-results/equipment-panel.png' });
  await panel(page).getByRole('button', { name: 'Equipar item', exact: true }).click();
  await expect(defense(page)).toHaveText(String(view.stats.defense));
  await page.getByRole('region', { name: 'Conjuração e efeitos de sessão', exact: true }).getByRole('button', { name: 'Descansar e restaurar usos' }).click();
  await expect(defense(page)).toHaveText(String(view.stats.defense! - 1)); await expect(panel(page)).toContainText('Equipado');
  expect((await json(page)).events).toEqual(character.events);
});
