import {test,expect} from '@playwright/test';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildOfficialLocalContext} from '../../tools/curation/official-local-context';
import {buildProcedureLocalContext} from '../../tools/curation/procedure-local-context';
import {completeCore,completeProcedure} from '../helpers/finalization-paths';
import {finalizeOfficialCore} from '../../packages/character-generator/official-core';
import {finalizeProcedure} from '../../packages/character-generator/procedure-runtime';
import {confirmPreview,savedCharacter} from '../helpers/library-browser';
import {characterExportHtml} from '../../apps/web/character-export-html';
const root=process.env.SOTDL_LOCAL_SOURCE_ROOT??process.cwd();
test.skip(!existsSync(resolve(root,'curation/pilot/table-closure.json')),'Requires verified local sources.');
test.setTimeout(120000);
for(const mode of ['core','procedures'] as const)test(`exports ${mode}, imports without rerolls and blocks stale sources`,async({page,browser})=>{
  const context=mode==='core'?await buildOfficialLocalContext(root,process.cwd()):await buildProcedureLocalContext(root,process.cwd());
  const initial=mode==='core'?await completeCore(context as Awaited<ReturnType<typeof buildOfficialLocalContext>>):await completeProcedure(context as Awaited<ReturnType<typeof buildProcedureLocalContext>>);
  const state=mode==='core'?await finalizeOfficialCore(initial,context):await finalizeProcedure(context as Awaited<ReturnType<typeof buildProcedureLocalContext>>,initial);
  const storage=mode==='core'?'sotdl-official-core-draft@1':'sotdl-human-creation-session@1';
  await page.route(`**/api/official/${mode}`,route=>route.fulfill({json:context}));
  await page.addInitScript(({state,storage})=>localStorage.setItem(storage,JSON.stringify(state)),{state:initial,storage});
  await page.goto('/');if(mode==='procedures')await page.getByRole('button',{name:'Procedimentos Core / Only Human',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Rascunho pronto para finalizar',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Finalizar personagem',exact:true}).click();await confirmPreview(page);
  await expect(page.getByRole('heading',{name:'Personagem finalizado',exact:true})).toBeVisible();
  expect(await savedCharacter(page,mode)).toBe(JSON.stringify(state));
  const jsonButton=page.getByRole('button',{name:'Baixar backup JSON privado',exact:true});await expect(jsonButton).toBeDisabled();
  await page.getByLabel('Conferi e desejo incluir', {exact:false}).check();
  const jsonDownload=page.waitForEvent('download');await jsonButton.click();const json=readFileSync((await (await jsonDownload).path())!,'utf8');
  const envelope=JSON.parse(json);expect(envelope.replay).toEqual(state);
  mkdirSync('output/html/issue56',{recursive:true});writeFileSync(`output/html/issue56/${mode}.json`,json);
  await page.getByLabel('Importar JSON de personagem').setInputFiles({name:'character.json',mimeType:'application/json',buffer:Buffer.from(json)});
  await confirmPreview(page);
  await page.getByLabel('Conferi e desejo incluir', {exact:false}).check();
  await expect(page.getByRole('heading',{name:'Personagem finalizado',exact:true})).toBeVisible();
  await expect.poll(()=>savedCharacter(page,mode)).toBe(JSON.stringify(state));
  const tampered={...envelope,sheet:{...envelope.sheet,moneyBits:'999999'}};
  await page.getByLabel('Importar JSON de personagem').setInputFiles({name:'tampered.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(tampered))});
  await expect(page.getByRole('alert')).toContainText('Não foi possível concluir');
  expect(await savedCharacter(page,mode)).toBe(JSON.stringify(state));
  expect(await page.evaluate(storage=>localStorage.getItem(storage),storage)).toBe(JSON.stringify(initial));
  const htmlDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar HTML de leitura',exact:true}).click();
  const output=resolve('output/html/issue56');mkdirSync(output,{recursive:true});const htmlPath=resolve(output,`${mode}.html`);await(await htmlDownload).saveAs(htmlPath);
  const offline=await browser.newPage();await offline.context().setOffline(true);
  await offline.goto(pathToFileURL(htmlPath).href);await expect(offline.locator('h1')).toHaveText(envelope.sheet.name||'Personagem sem nome');
  await expect(offline.getByText(`${envelope.sheet.moneyBits} bits`,{exact:true})).toBeVisible();
  const rendered=await offline.locator('dl div').evaluateAll(nodes=>Object.fromEntries(nodes.map(n=>[n.querySelector('dt')!.textContent,n.querySelector('dd')!.textContent])));
  for(const [key,value] of Object.entries({...envelope.sheet.stats,...envelope.sheet.states})){
    const label=key.replace(/([A-Z])/g,' $1').replace(/\b\w/g,c=>c.toUpperCase());expect(rendered[label]).toBe(String(value));
  }
  expect(await offline.locator('script,img,iframe').count()).toBe(0);
  mkdirSync('output/pdf',{recursive:true});await offline.pdf({path:`output/pdf/issue56-${mode}.pdf`,format:'A4',preferCSSPageSize:true,printBackground:true});
  await offline.screenshot({path:`output/pdf/issue56-${mode}.png`,fullPage:true});await offline.close();
  if(mode==='core'){
    // Fictional layout stress, not an importable character or an accepted real creation result.
    const long={...envelope,sheet:{...envelope.sheet,name:'Teste de paginação '.repeat(10),inventory:Array.from({length:75},(_,i)=>({key:`invented:layout-origin-${i}-`+'x'.repeat(80),itemId:`invented:item-${i}`,quantity:i+1,equipped:false}))}};
    const layout=await browser.newPage();await layout.setContent(characterExportHtml(long));await layout.emulateMedia({media:'print'});
    expect(await layout.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await layout.pdf({path:'output/pdf/acceptance-long.pdf',format:'A4',preferCSSPageSize:true,printBackground:true});await layout.close();
  }
  await page.getByRole('button',{name:'Imprimir / Salvar PDF',exact:true}).click();
  await expect(page.getByTitle('Ficha A4 para impressão')).toBeVisible();
  await page.unroute(`**/api/official/${mode}`);await page.route(`**/api/official/${mode}`,route=>route.fulfill({json:{...context,implementationSha256:'f'.repeat(64)}}));
  const before=await savedCharacter(page,mode);await jsonButton.click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível concluir');
  expect(await savedCharacter(page,mode)).toBe(before);
});
test('blocks purchase-pattern output with a safe explanation and preserves the private save',async({page})=>{
  const context=await buildOfficialLocalContext(root,process.cwd()),draft=await completeCore(context),marker='('+'#'+'1234567'+')';
  draft.config.name=marker;draft.character.name=marker;
  const state=await finalizeOfficialCore(draft,context);
  await page.route('**/api/official/core',route=>route.fulfill({json:context}));
  await page.addInitScript(state=>localStorage.setItem('sotdl-official-core-draft@1',JSON.stringify(state)),state);
  await page.goto('/');await expect(page.getByRole('heading',{name:'Personagem finalizado',exact:true})).toBeVisible();
  await expect(page.getByText(/O backup JSON é privado e reimportável/)).toBeVisible();
  await expect(page.getByText(/Confira o nome e os identificadores personalizados/)).toBeVisible();
  const before=await savedCharacter(page,'core');let downloads=0;page.on('download',()=>downloads++);
  await page.getByLabel('Conferi e desejo incluir',{exact:false}).check();
  for(const name of ['Baixar backup JSON privado','Exportar HTML de leitura','Imprimir / Salvar PDF']){
    await page.getByRole('button',{name,exact:true}).click();
    await expect(page.getByRole('alert')).toContainText('Conteúdo de compra');await expect(page.getByRole('alert')).not.toContainText(marker);
    expect(await savedCharacter(page,'core')).toBe(before);
  }
  expect(downloads).toBe(0);await expect(page.getByTitle('Ficha A4 para impressão')).toHaveCount(0);
});
