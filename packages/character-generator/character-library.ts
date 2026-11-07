export type CharacterMode='core'|'procedures';
export type LibraryRecord={id:string;mode:CharacterMode;name:string;revision:number;updatedAt:number;state:unknown};
export class CharacterConflict extends Error{constructor(){super('Outra aba salvou uma versão mais recente. Recarregue o personagem antes de salvar.');}}
const DB='sotdl-official-character-library';
function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB,1);
  request.onupgradeneeded=()=>request.result.createObjectStore('characters',{keyPath:'id'});
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Não foi possível abrir a biblioteca.'));
});}
export async function listCharacters(mode:CharacterMode){
  const db=await database();try{return await new Promise<LibraryRecord[]>((resolve,reject)=>{
    const request=db.transaction('characters').objectStore('characters').getAll();
    request.onsuccess=()=>resolve((request.result as LibraryRecord[]).filter(r=>r.mode===mode).sort((a,b)=>b.updatedAt-a.updatedAt||a.id.localeCompare(b.id)));
    request.onerror=()=>reject(new Error('Não foi possível ler a biblioteca.'));
  });}finally{db.close();}
}
/** Revision compare-and-swap runs in one read/write transaction, including across tabs. */
export async function saveCharacter(input:{id:string;mode:CharacterMode;name:string;state:unknown;expectedRevision:number|null;legacy?:boolean}){
  const db=await database();try{return await new Promise<LibraryRecord>((resolve,reject)=>{
    const tx=db.transaction('characters','readwrite'),store=tx.objectStore('characters'),read=store.get(input.id);let result:LibraryRecord,error:Error|undefined;
    read.onsuccess=()=>{try{
      const prior=read.result as LibraryRecord|undefined;
      if(input.legacy&&prior){if(prior.mode!==input.mode){error=new CharacterConflict();tx.abort();return;}result=prior;return;}
      if((prior!==undefined&&prior.mode!==input.mode)||(input.expectedRevision===null?!!prior:!prior||prior.revision!==input.expectedRevision)){error=new CharacterConflict();tx.abort();return;}
      result={id:input.id,mode:input.mode,name:input.name,revision:(prior?.revision??0)+1,updatedAt:Date.now(),state:structuredClone(input.state)};store.put(result);
    }catch{error=new Error('Dados do personagem não puderam ser gravados; a versão anterior foi preservada.');tx.abort();}};
    tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(error??new Error('A gravação falhou; a versão anterior foi preservada.'));tx.onerror=()=>{error??=new Error('A gravação falhou; a versão anterior foi preservada.');};
  });}finally{db.close();}
}
