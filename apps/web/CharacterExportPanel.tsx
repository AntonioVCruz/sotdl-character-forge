import {useEffect,useRef,useState} from 'react';
import {exportCharacter,importCharacter,serializeCharacter,MAX_EXPORT_BYTES,type ExportContext} from '../../packages/character-generator/character-export';
import {parseOfficialCoreContext} from '../../packages/character-generator/official-core';
import {ProcedureContextSchema} from '../../packages/character-generator/procedure-model';
import {characterExportHtml} from './character-export-html';
import {ExportContentError} from '../../packages/character-generator/export-content-policy';

function download(text:string,type:string,name:string){
  const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function CharacterExportPanel({mode,current,ready,busy,onImport,unavailableReason}:{mode:'core'|'procedures';current?:unknown;ready:boolean;busy:boolean;onImport:(state:unknown)=>Promise<void>;unavailableReason?:string}){
  const [consent,setConsent]=useState(false),[working,setWorking]=useState(false),[error,setError]=useState(''),[html,setHtml]=useState('');
  const lock=useRef(false),frame=useRef<HTMLIFrameElement>(null),printNext=useRef(false);
  useEffect(()=>{setConsent(false);setHtml('');},[current]);
  async function context():Promise<ExportContext>{
    const response=await fetch(`/api/official/${mode}`,{cache:'no-store'});
    if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw new Error('Fontes locais indisponíveis. Operação cancelada; o save foi preservado.');
    const input=await response.json();return mode==='core'?parseOfficialCoreContext(input):ProcedureContextSchema.parse(input);
  }
  async function run(action:()=>Promise<void>){
    if(lock.current||busy)return;lock.current=true;setWorking(true);setError('');setHtml('');
    try{await action();}catch(error){setError(error instanceof ExportContentError?error.message:'Não foi possível concluir: confira a finalização, as fontes, o formato e as versões. O personagem salvo foi preservado.');}
    finally{lock.current=false;setWorking(false);}
  }
  const emit=(format:'json'|'html'|'print')=>void run(async()=>{
    const e=await exportCharacter(current,await context(),consent,format==='json'?'json':'sheet');
    if(format==='json')download(serializeCharacter(e),'application/json','personagem-human-l0.json');
    else {const output=characterExportHtml(e);if(format==='html')download(output,'text/html','personagem-human-l0.html');else{printNext.current=true;setHtml(output);}}
  });
  const disabled=busy||working;
  return <section aria-label="Arquivos da ficha"><h2>Arquivos da ficha</h2>
    <p>O backup JSON é privado e reimportável: inclui nome, seed, histórico, especializações e decisões livres, inclusive responsável e motivo de adjudicações. Guarde-o como backup pessoal.</p>
    <p>HTML e PDF são fichas mínimas de leitura para compartilhar. Confira o nome e os identificadores personalizados, que podem conter texto digitado por você. Regras e descrições dos livros ficam nas fontes locais.</p>
    <label>Importar JSON de personagem<input type="file" accept=".json,application/json" disabled={disabled} onChange={event=>{
      const file=event.target.files?.[0];event.target.value='';if(!file)return;
      void run(async()=>{if(file.size>MAX_EXPORT_BYTES)throw new Error('Arquivo excede o limite.');const restored=await importCharacter(await file.text(),await context());await onImport(restored);});
    }}/></label>
    {ready&&<><label><input type="checkbox" checked={consent} disabled={disabled} onChange={e=>setConsent(e.target.checked)}/>Conferi e desejo incluir o nome e os dados pessoais deste formato, inclusive identificadores personalizados. Não copiei textos de livros, links privados ou dados de compra para os campos livres.</label>
      <button disabled={disabled||!consent} onClick={()=>emit('json')}>Baixar backup JSON privado</button>
      <button disabled={disabled||!consent} onClick={()=>emit('html')}>Exportar HTML de leitura</button>
      <button disabled={disabled||!consent} onClick={()=>emit('print')}>Imprimir / Salvar PDF</button></>}
    {!ready&&<p>{unavailableReason??'Finalize o personagem para emitir a ficha completa.'}</p>}
    {working&&<p role="status">Revalidando fontes e ficha…</p>}{error&&<p role="alert">{error}</p>}
    {html&&<iframe ref={frame} title="Ficha A4 para impressão" srcDoc={html} style={{width:'100%',height:'850px',border:'1px solid #aaa'}} onLoad={()=>{if(printNext.current){printNext.current=false;frame.current?.contentWindow?.focus();frame.current?.contentWindow?.print();}}}/>}
  </section>;
}
