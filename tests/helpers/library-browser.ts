import {expect,type Page} from '@playwright/test';
export const confirmPreview=async(page:Page)=>{
  await page.getByRole('button',{name:'Confirmar e salvar alterações',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Prévia de alterações não salvas',exact:true})).toHaveCount(0,{timeout:45000});
};
export const savedCharacter=(page:Page,mode:'core'|'procedures')=>page.evaluate(async mode=>{
  return new Promise<string|null>((resolve,reject)=>{const open=indexedDB.open('sotdl-official-character-library',1);open.onerror=()=>reject(new Error('DB open failed'));open.onsuccess=()=>{
    const db=open.result,request=db.transaction('characters').objectStore('characters').getAll();request.onerror=()=>{db.close();reject(new Error('DB read failed'));};request.onsuccess=()=>{
      const rows=request.result.filter(r=>r.mode===mode).sort((a,b)=>b.updatedAt-a.updatedAt||a.id.localeCompare(b.id));db.close();resolve(rows[0]?JSON.stringify(rows[0].state):null);
    };
  };});
},mode);
