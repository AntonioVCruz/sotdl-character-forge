import { parseHumanL0Character, type HumanL0Character } from './human-l0';

function open():Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const r=indexedDB.open('sotdl-character',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('state');
    r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
    r.onblocked=()=>reject(new Error('Character storage blocked.'));
  });
}
const key=(id:string)=>`human-l0/${id}`;
export async function loadHumanL0Character(id='local-human-l0'):Promise<HumanL0Character|null> {
  const db=await open();
  try {
    const value=await new Promise<unknown>((resolve,reject)=>{
      const tx=db.transaction('state','readonly'),r=tx.objectStore('state').get(key(id));
      tx.oncomplete=()=>resolve(r.result);tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error);
    });
    if(value===undefined)return null;
    const c=parseHumanL0Character(value);
    if(c.id!==id)throw new Error('Stored character identity mismatch.');
    return c;
  } finally{db.close();}
}
/** Deletes only `human-l0/<id>`. The demo key `character` is not touched. */
export async function clearHumanL0Character(id='local-human-l0'):Promise<void> {
  const db=await open();
  try {
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('state','readwrite');
      tx.objectStore('state').delete(key(id));
      tx.oncomplete=()=>resolve();
      tx.onabort=()=>reject(tx.error??new Error('Gravação cancelada.'));
      tx.onerror=()=>reject(tx.error);
    });
  } finally{db.close();}
}
/** Compare and swap, isolated by character ID; never overwrites the demo key. */
export async function saveHumanL0Character(input:unknown,expectedInput:HumanL0Character|null):Promise<void> {
  const c=parseHumanL0Character(input),expected=expectedInput===null?null:parseHumanL0Character(expectedInput);
  if(expected&&expected.id!==c.id)throw new Error('Character identity mismatch.');
  const db=await open();
  try {
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction('state','readwrite'),store=tx.objectStore('state'),r=store.get(key(c.id));let error:unknown;
      r.onsuccess=()=>{
        try {
          const previous=r.result===undefined?null:parseHumanL0Character(r.result);
          if(JSON.stringify(previous)!==JSON.stringify(expected))throw new Error('Character changed in another tab.');
          store.put(c,key(c.id));
        } catch(e){error=e;tx.abort();}
      };
      tx.oncomplete=()=>resolve();tx.onabort=()=>reject(error??tx.error);tx.onerror=()=>reject(tx.error);
    });
  } finally{db.close();}
}
