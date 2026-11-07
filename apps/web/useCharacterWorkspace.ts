import {useEffect,useRef,useState} from 'react';
import {CharacterConflict,listCharacters,saveCharacter,type CharacterMode,type LibraryRecord} from '../../packages/character-generator/character-library';
const SIGNAL='sotdl-character-library-revision';
export function useCharacterWorkspace(mode:CharacterMode){
  const [records,setRecords]=useState<LibraryRecord[]>([]),[record,setRecord]=useState<LibraryRecord>(),[creating,setCreating]=useState(false),[conflict,setConflict]=useState(false);
  const active=useRef(record);active.current=creating?undefined:record;
  useEffect(()=>{const receive=(event:StorageEvent)=>{if(event.key!==SIGNAL||!event.newValue)return;try{const change=JSON.parse(event.newValue),current=active.current;if(current&&change.id===current.id&&change.revision>current.revision)setConflict(true);void listCharacters(mode).then(setRecords).catch(()=>{});}catch{}};window.addEventListener('storage',receive);return()=>window.removeEventListener('storage',receive);},[mode]);
  const refresh=async()=>{const rows=await listCharacters(mode);setRecords(rows);return rows;};
  async function open(id:string,validate:(state:unknown)=>Promise<unknown>){
    const rows=await refresh(),next=rows.find(r=>r.id===id);if(!next)throw new Error('Personagem não encontrado.');
    const state=await validate(next.state);setRecord(next);setCreating(false);setConflict(false);try{sessionStorage.setItem(`sotdl-library-active-${mode}`,id);}catch{}return state;
  }
  async function load(legacyKey:string,validate:(state:unknown)=>Promise<unknown>,parseLegacy:(state:unknown)=>unknown){
    let rows=await refresh();const legacy=localStorage.getItem(legacyKey);
    if(legacy&&!rows.some(r=>r.id===`legacy:${mode}`)){
      if(legacy.length>2_000_000)throw new Error('Save antigo excede o limite; foi preservado.');
      const state=parseLegacy(JSON.parse(legacy));
      await saveCharacter({id:`legacy:${mode}`,mode,name:'Personagem migrado',state,expectedRevision:null,legacy:true});rows=await refresh();
    }
    let selected:string|null=null;try{selected=sessionStorage.getItem(`sotdl-library-active-${mode}`);}catch{}
    return rows.length?open(rows.find(r=>r.id===selected)?.id??rows[0].id,validate):undefined;
  }
  async function save(state:unknown,name:string){
    try{
      const next=await saveCharacter({id:!creating&&record?record.id:crypto.randomUUID(),mode,name,state,expectedRevision:!creating&&record?record.revision:null});
      setRecord(next);setCreating(false);setConflict(false);setRecords(rows=>[next,...rows.filter(r=>r.id!==next.id)]);
      try{sessionStorage.setItem(`sotdl-library-active-${mode}`,next.id);}catch{}
      // The transaction has committed. A failed list refresh must not report the save as failed.
      try{await refresh();}catch{}
      try{localStorage.setItem(SIGNAL,JSON.stringify({id:next.id,revision:next.revision}));}catch{/* IDB already committed; signaling is best-effort. */}
      return next;
    }catch(error){if(error instanceof CharacterConflict)setConflict(true);throw error;}
  }
  return {records,record,creating,conflict,load,open,save,stageNew:()=>{setCreating(true);setConflict(false);},cancel:()=>setCreating(false)};
}
