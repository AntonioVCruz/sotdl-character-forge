import { test,expect } from '@playwright/test';
import fixture from '../../curation/examples/human-l0-mechanics.synthetic.json' with {type:'json'};

test('Human L0 engine persists native IndexedDB/WebCrypto state across browser reload without changing demo',async({page})=>{
  await page.goto('/');
  const before=await page.evaluate(async input=>{
    const runtimePath='/packages/character-generator/runtime.ts',storagePath='/packages/character-generator/storage.ts';
    const runtime=await import(runtimePath),storage=await import(storagePath);
    const demo=await storage.loadCharacter();
    let c=await runtime.newHumanL0Character(input.selection,input.packs);
    c=await runtime.performHumanL0Command(c,input.packs,{type:'roll-attributes',seed:'browser-human'});
    c=await runtime.performHumanL0Command(c,input.packs,{type:'state',target:'damage',value:4,reason:'Browser persistence acceptance.'});
    await storage.saveHumanL0Character(c,null);
    return {human:runtime.exportGeneratedCharacter(c),demo:runtime.exportGeneratedCharacter(demo),view:await runtime.calculateHumanL0Character(c,input.packs)};
  },fixture);
  expect(before.view.baseResolved).toBe(true);expect(before.view.states.damage).toBe(4);
  await page.reload();
  const after=await page.evaluate(async input=>{
    const runtimePath='/packages/character-generator/runtime.ts',storagePath='/packages/character-generator/storage.ts';
    const runtime=await import(runtimePath),storage=await import(storagePath);
    const c=await storage.loadHumanL0Character(),demo=await storage.loadCharacter();
    return {human:runtime.exportGeneratedCharacter(c),demo:runtime.exportGeneratedCharacter(demo),view:await runtime.calculateHumanL0Character(c,input.packs)};
  },fixture);
  expect(after).toEqual(before);
  expect(after.view.officialGenerationEnabled).toBe(false);
});
