import {test,expect} from '@playwright/test';
import {existsSync} from 'node:fs';
test('procedure entry fails closed without verified sources',async({page})=>{
  await page.route('**/api/official/procedures',r=>r.fulfill({status:503,contentType:'application/json',body:'{}'}));
  await page.goto('/');await page.getByRole('button',{name:'Procedimentos Core / Only Human',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('Procedimentos indisponíveis');
  await expect(page.getByRole('button',{name:'Iniciar criação'})).toBeDisabled();
});
test('creates and reopens a separate real Human Development session',async({page,request})=>{
  test.skip(!existsSync('curation/pilot/table-closure.json'),'Requires ignored licensed local sources.');test.setTimeout(90000);
  expect((await request.get('/api/official/procedures',{headers:{Origin:'https://example.invalid'}})).status()).toBe(403);
  await page.goto('/');await page.getByRole('button',{name:'Procedimentos Core / Only Human',exact:true}).click();
  await expect(page.getByRole('status')).toHaveText('Fontes locais verificadas.',{timeout:45000});
  await page.getByLabel('Nome',{exact:true}).fill('Desenvolvimento local');await page.getByLabel('Seed',{exact:true}).fill('procedure-browser');
  await page.getByRole('combobox',{name:'Variante',exact:true}).selectOption('only-human');await page.getByRole('combobox',{name:'Procedimento',exact:true}).selectOption('human-development');
  await page.getByRole('combobox',{name:'Modo',exact:true}).selectOption('hybrid');
  await page.getByRole('button',{name:'Iniciar criação'}).click();await expect(page.getByRole('heading',{name:'Desenvolvimento local',exact:true})).toBeVisible();
  const saved=await page.evaluate(()=>localStorage.getItem('sotdl-human-creation-session@1'));
  expect(saved).not.toMatch(/"excerpt"|"sourceText"|"mechanics"/);expect(JSON.parse(saved!).events.length).toBeGreaterThan(0);
  expect(await page.evaluate(()=>localStorage.getItem('sotdl-official-core-draft@1'))).toBeNull();
  await page.reload();await page.getByRole('button',{name:'Procedimentos Core / Only Human',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Desenvolvimento local',exact:true})).toBeVisible({timeout:45000});
  expect(await page.evaluate(()=>localStorage.getItem('sotdl-human-creation-session@1'))).toBe(saved);
});
