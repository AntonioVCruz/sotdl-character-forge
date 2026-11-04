// @vitest-environment happy-dom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {webcrypto} from 'node:crypto';
import {it,expect,vi} from 'vitest';
import {CreationProcedures} from '../apps/web/CreationProcedures';
import {createProcedureSession,performProcedureCommand} from '../packages/character-generator/procedure-runtime';
import {inventedProcedureContext} from './helpers/procedure-context';

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
    const saved=JSON.parse(localStorage.getItem('sotdl-human-creation-session@1')!);
    expect(saved.events.slice(0,-1)).toEqual(session.events);
    expect(saved.events.at(-1)).toMatchObject({type:'equipment',loadout:[]});
  }finally{
    act(()=>root.unmount());host.remove();localStorage.clear();vi.unstubAllGlobals();
  }
});
