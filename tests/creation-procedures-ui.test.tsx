// @vitest-environment happy-dom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {webcrypto} from 'node:crypto';
import {it,expect,vi,beforeEach} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {listCharacters} from '../packages/character-generator/character-library';
import {CreationProcedures} from '../apps/web/CreationProcedures';
import {createProcedureSession,performProcedureCommand,calculateProcedure} from '../packages/character-generator/procedure-runtime';
import {inventedProcedureContext} from './helpers/procedure-context';
beforeEach(()=>{vi.stubGlobal('indexedDB',new IDBFactory());});

it('reopens an unavailable equipped origin and lets the user store it without losing history',async()=>{
  (globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;
  vi.stubGlobal('crypto',webcrypto);
  const context=inventedProcedureContext(),initial=await createProcedureSession(context,'ui-equipment');
  const session=performProcedureCommand(context,initial,{type:'equipment',loadout:[{key:'fictional:unavailable',instance:1,slot:'main'}]});
  localStorage.setItem('sotdl-human-creation-session@1',JSON.stringify(session));
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>context}));
  const host=document.createElement('div');document.body.appendChild(host);const root=createRoot(host);
  try{
    await act(async()=>{root.render(<CreationProcedures/>);});
    for(let i=0;i<20&&!host.querySelector('[aria-label="Equipamento em uso"]');i++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});
    expect(host.textContent).toContain('Resolva o equipamento em uso');
    expect(host.textContent).not.toContain('Strength 8');
    const active=host.querySelector('[aria-label="Equipamento em uso"]')!;
    expect(active.textContent).toContain('Origem indisponível');
    const store=[...active.querySelectorAll('button')].find(b=>b.textContent==='Guardar esta unidade')!;
    await act(async()=>{store.click();});
    for(let i=0;i<20&&host.querySelector('[aria-label="Equipamento em uso"]');i++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});
    expect(host.querySelector('[aria-label="Equipamento em uso"]')).toBeNull();
    expect(host.textContent).not.toContain('Resolva o equipamento em uso');
    expect(host.textContent).toContain('Strength 8');
    expect(JSON.parse(localStorage.getItem('sotdl-human-creation-session@1')!)).toEqual(session);
    expect((await listCharacters('procedures'))[0].state).toEqual(session);
    const confirm=[...host.querySelectorAll('button')].find(b=>b.textContent==='Confirmar e salvar alterações')!;
    await act(async()=>{confirm.click();});
    await expect.poll(async()=>((await listCharacters('procedures'))[0].state as typeof session).events.length).toBe(session.events.length+1);
    const saved=(await listCharacters('procedures'))[0].state as typeof session;
    expect(saved.events.slice(0,-1)).toEqual(session.events);
    expect(saved.events.at(-1)).toMatchObject({type:'equipment',loadout:[]});
  }finally{
    act(()=>root.unmount());host.remove();localStorage.clear();vi.unstubAllGlobals();
  }
});

it('shows a stale finalized save as suspended and preserves its exact stored bytes',async()=>{
  (globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;
  vi.stubGlobal('crypto',webcrypto);
  const c=inventedProcedureContext(),session=await createProcedureSession(c,'stale-save');
  session.finalization={contract:'sotdl.character-finalization',contractVersion:'1.0.0',contextSha256:session.contextSha256,stateSha256:'b'.repeat(64),invalidatedReason:null};
  const saved=JSON.stringify(session);localStorage.setItem('sotdl-human-creation-session@1',saved);
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({...c,implementationSha256:'c'.repeat(64)})}));
  const host=document.createElement('div');document.body.appendChild(host);const root=createRoot(host);
  try{
    await act(async()=>{root.render(<CreationProcedures/>);});
    for(let i=0;i<20&&!host.textContent?.includes('Rascunho suspenso');i++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});
    expect(host.textContent).toContain('Rascunho suspenso');expect(host.textContent).not.toContain('Personagem finalizado');
    expect(localStorage.getItem('sotdl-human-creation-session@1')).toBe(saved);
    expect([...host.querySelectorAll('button')].some(b=>b.textContent==='Finalizar personagem')).toBe(false);
  }finally{act(()=>root.unmount());host.remove();localStorage.clear();vi.unstubAllGlobals();}
});

it('rejects a saved completion receipt as proof when actual creation obligations remain unresolved',async()=>{
  (globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;
  vi.stubGlobal('crypto',webcrypto);
  const c=inventedProcedureContext(),session=await createProcedureSession(c,'incomplete-receipt'),view=await calculateProcedure(c,session);
  session.finalization={contract:'sotdl.character-finalization',contractVersion:'1.0.0',contextSha256:session.contextSha256,stateSha256:view.completion.stateSha256,invalidatedReason:null};
  localStorage.setItem('sotdl-human-creation-session@1',JSON.stringify(session));
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>c}));
  const host=document.createElement('div');document.body.appendChild(host);const root=createRoot(host);
  try{
    await act(async()=>{root.render(<CreationProcedures/>);});
    for(let i=0;i<20&&!host.querySelector('[aria-label="Estado do personagem"]');i++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});
    expect(host.textContent).toContain('Rascunho com pendências de criação');expect(host.textContent).not.toContain('Personagem finalizado');
    const button=[...host.querySelectorAll('button')].find(b=>b.textContent==='Finalizar personagem')!;expect(button.disabled).toBe(true);
    expect(host.querySelector('[aria-label="Estado do personagem"] a')?.getAttribute('href')).toBeTruthy();
  }finally{act(()=>root.unmount());host.remove();localStorage.clear();vi.unstubAllGlobals();}
});
