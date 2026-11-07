import {useEffect,useRef} from 'react';
import type {LibraryRecord} from '../../packages/character-generator/character-library';
export function CharacterWorkspacePanel({records,record,creating,dirty,busy,conflict,onOpen,onConfirm,onDiscard}:{records:LibraryRecord[];record?:LibraryRecord;creating:boolean;dirty:boolean;busy:boolean;conflict:boolean;onOpen:(id:string)=>void;onConfirm:()=>void;onDiscard:()=>void}){
  const title=useRef<HTMLHeadingElement>(null),wasDirty=useRef(false),returnFocus=useRef<HTMLElement|null>(null);
  useEffect(()=>{const remember=(event:FocusEvent)=>{if(!wasDirty.current&&event.target instanceof HTMLElement&&event.target!==document.body)returnFocus.current=event.target;};document.addEventListener('focusin',remember);return()=>document.removeEventListener('focusin',remember);},[]);
  useEffect(()=>{if(dirty&&!wasDirty.current){const active=document.activeElement;if(active instanceof HTMLElement&&active!==document.body)returnFocus.current=active;wasDirty.current=true;title.current?.focus();}else if(!dirty&&wasDirty.current&&!busy){wasDirty.current=false;if(returnFocus.current?.isConnected)returnFocus.current.focus();}},[dirty,busy]);
  useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  return <section aria-label="Biblioteca e revisão"><h2>Biblioteca de personagens</h2>
    <label>Personagem salvo<select value={creating?'':record?.id??''} disabled={busy||dirty} onChange={e=>{if(e.target.value)onOpen(e.target.value);}}><option value="">{creating?'Novo personagem em prévia':'Selecione'}</option>{records.map(r=><option key={r.id} value={r.id}>{r.name||'Personagem sem nome'} · revisão {r.revision}</option>)}</select></label>
    {conflict&&<p role="alert">Outra aba alterou o personagem. Sua prévia está preservada; recarregue a versão salva antes de confirmar.</p>}
    {conflict&&record&&<button disabled={busy} onClick={()=>onOpen(record.id)}>Descartar prévia e recarregar versão salva</button>}
    {dirty&&<><h3 ref={title} tabIndex={-1}>Prévia de alterações não salvas</h3><p>A ficha abaixo mostra o conjunto em revisão. Confirmar revalida as fontes e salva; descartar restaura a última versão salva. Novos sorteios da prévia só entram no histórico salvo ao confirmar.</p>
      <button disabled={busy||conflict} onClick={onConfirm}>Confirmar e salvar alterações</button><button disabled={busy} onClick={onDiscard}>Descartar alterações</button></>}
    {!dirty&&<p>Versão salva. Novas alterações serão apresentadas para revisão.</p>}
  </section>;
}
