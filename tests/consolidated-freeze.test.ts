import {describe,it,expect} from 'vitest';
import {mkdtemp,readFile,writeFile,mkdir,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fingerprint,restoredBytes,compareInventory,restoreInventory,immutableWrite,safePath} from '../tools/curation/consolidated-freeze-lib.mjs';

describe('consolidated freeze byte preservation',()=>{
  it('restores mixed LF, CRLF and CR while preserving BOM and final newline state',()=>{
    const original=Buffer.from('\uFEFFalpha\r\nbeta\ngamma\rdelta\r\nlast');
    const pin=fingerprint('mixed.txt',original);
    expect(restoredBytes(Buffer.from('\uFEFFalpha\nbeta\ngamma\ndelta\nlast'),pin)).toEqual(original);
    expect(restoredBytes(original,pin)).toEqual(original);
  });
  it('refuses changed content, missing newline and altered manifest layout',()=>{
    const pin=fingerprint('a',Buffer.from('a\r\nb\n'));
    expect(()=>restoredBytes(Buffer.from('changed\nb\n'),pin)).toThrow('Content differs');
    expect(()=>restoredBytes(Buffer.from('a\nb'),pin)).toThrow('Content differs');
    expect(()=>restoredBytes(Buffer.from('a\nb\n'),{...pin,endings:[['LF',2]]})).toThrow('digest differs');
  });
  it('does not offer newline conversion for binary or invalid UTF8',()=>{
    for(const bytes of [Buffer.from([0,13,10]),Buffer.from([255,13,10])]){
      const pin=fingerprint('binary',bytes);
      expect(pin.textSha256).toBeUndefined();
      expect(()=>restoredBytes(Buffer.from('other'),pin)).toThrow('Not restorable');
    }
  });
  it('detects added, missing, changed and duplicate inputs',()=>{
    expect(compareInventory([{path:'a',sha256:'1'},{path:'b',sha256:'2'}],[{path:'a',sha256:'3'},{path:'c',sha256:'2'}])).toEqual(['a','b','c']);
    expect(()=>compareInventory([{path:'a',sha256:'1'},{path:'a',sha256:'2'}],[])).toThrow('Duplicate');
  });
  it('preflights every file and preserves all bytes if any content changed',async()=>{
    const root=await mkdtemp(join(tmpdir(),'human-l0-freeze-'));
    try{
      const entries=[fingerprint('a',Buffer.from('a\r\n')),fingerprint('b',Buffer.from('b\r\n'))];
      await writeFile(join(root,'a'),'a\n');await writeFile(join(root,'b'),'modified\n');
      await expect(restoreInventory(root,entries,['a','b'])).rejects.toThrow('Content differs');
      expect(await readFile(join(root,'a'),'utf8')).toBe('a\n');
      await writeFile(join(root,'b'),'b\n');
      await expect(restoreInventory(root,entries,['a','b','extra'])).rejects.toThrow('Added or missing');
      await expect(restoreInventory(root,entries,['a','b'])).resolves.toBe(2);
      expect(await readFile(join(root,'a'),'utf8')).toBe('a\r\n');
      await expect(restoreInventory(root,entries,['a','b'])).resolves.toBe(0);
    }finally{await rm(root,{recursive:true,force:true});}
  });
  it('never overwrites an existing version',async()=>{
    const root=await mkdtemp(join(tmpdir(),'human-l0-version-')),path=join(root,'1.0.0.json');
    try{
      await immutableWrite(path,'first');
      await expect(immutableWrite(path,'second')).rejects.toThrow();
      expect(await readFile(path,'utf8')).toBe('first');
    }finally{await rm(root,{recursive:true,force:true});}
  });
  it('refuses traversal and symlink inputs',async()=>{
    const root=await mkdtemp(join(tmpdir(),'human-l0-path-'));
    try{
      for(const path of ['../outside','/absolute','a/../b','a\\b'])await expect(safePath(root,path)).rejects.toThrow();
      await mkdir(join(root,'real'));await symlink(join(root,'real'),join(root,'link'),'junction');
      await expect(safePath(root,'link/file')).rejects.toThrow('Symlink');
    }finally{await rm(root,{recursive:true,force:true});}
  });
});
