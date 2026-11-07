import {createHash} from 'node:crypto';
import {readFile,writeFile,lstat,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative,isAbsolute} from 'node:path';

export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export const json=value=>JSON.stringify(value,null,2)+'\n';
const normalized=text=>text.replace(/\r\n|\r/g,'\n');
const decoder=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true});
export function fingerprint(path,bytes){
  const entry={path,sha256:sha(bytes),bytes:bytes.length};
  try{
    const text=decoder.decode(bytes);
    if(text.includes('\0')||!Buffer.from(text).equals(Buffer.from(bytes)))return entry;
    const runs=[];
    for(const [ending] of text.matchAll(/\r\n|\r|\n/g)){
      const kind=ending==='\r\n'?'CRLF':ending==='\r'?'CR':'LF',last=runs.at(-1);
      if(last?.[0]===kind)last[1]++;else runs.push([kind,1]);
    }
    return {...entry,textSha256:sha(normalized(text)),endings:runs};
  }catch{return entry;}
}
export function restoredBytes(bytes,entry){
  if(sha(bytes)===entry.sha256)return bytes;
  if(!entry.textSha256||!Array.isArray(entry.endings))throw new Error(`Not restorable: ${entry.path}`);
  const text=normalized(decoder.decode(bytes));
  if(sha(text)!==entry.textSha256)throw new Error(`Content differs: ${entry.path}`);
  let run=0,count=0;
  const restored=Buffer.from(text.replace(/\n/g,()=>{
    const item=entry.endings[run];
    if(!item)throw new Error('Invalid newline manifest');
    if(++count===item[1]){run++;count=0;}
    return {LF:'\n',CRLF:'\r\n',CR:'\r'}[item[0]];
  }));
  if(sha(restored)!==entry.sha256||restored.length!==entry.bytes)throw new Error(`Restoration digest differs: ${entry.path}`);
  return restored;
}
export async function safePath(root,path){
  if(typeof path!=='string'||path.includes('\\')||path.split('/').some(p=>!p||p==='.'||p==='..')||isAbsolute(path))throw new Error('Unsafe inventory path');
  const target=resolve(root,path),rel=relative(resolve(root),target);
  if(rel.startsWith('..')||isAbsolute(rel))throw new Error('Path outside root');
  let current=resolve(root);
  for(const part of path.split('/')){
    current=resolve(current,part);
    try{if((await lstat(current)).isSymbolicLink())throw new Error('Symlink input refused');}
    catch(error){if(error.code!=='ENOENT')throw error;}
  }
  return target;
}
export function compareInventory(expected,actual){
  if(new Set(expected.map(e=>e.path)).size!==expected.length||new Set(actual.map(e=>e.path)).size!==actual.length)throw new Error('Duplicate inventory path');
  const before=new Map(expected.map(e=>[e.path,e.sha256])),after=new Map(actual.map(e=>[e.path,e.sha256]));
  return [...new Set([...before.keys(),...after.keys()])].filter(p=>before.get(p)!==after.get(p)).sort();
}
export async function restoreInventory(root,entries,paths){
  if(compareInventory(entries.map(e=>({...e,sha256:''})),paths.map(path=>({path,sha256:''}))).length)throw new Error('Added or missing files; restoration refused');
  // Complete preflight before any writes. Recheck each original immediately before writing.
  const changes=[];
  for(const entry of entries){
    const path=await safePath(root,entry.path),before=await readFile(path),after=restoredBytes(before,entry);
    if(!before.equals(after))changes.push({path,before,after});
  }
  for(const change of changes){
    if(!(await readFile(change.path)).equals(change.before))throw new Error('File changed during restoration');
    await writeFile(change.path,change.after);
  }
  return changes.length;
}
export async function immutableWrite(path,bytes){
  await mkdir(dirname(path),{recursive:true});
  // wx never replaces a previous version, even with identical content.
  await writeFile(path,bytes,{flag:'wx'});
}
