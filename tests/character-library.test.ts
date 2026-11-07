import 'fake-indexeddb/auto';
import {describe,it,expect} from 'vitest';
import {saveCharacter,listCharacters,CharacterConflict} from '../packages/character-generator/character-library';
describe('official character library atomic revisions',()=>{
  it('keeps multiple characters and separates the two flows',async()=>{
    const id=crypto.randomUUID();
    await saveCharacter({id,mode:'core',name:'First',state:{faces:[2,3]},expectedRevision:null});
    await saveCharacter({id:id+'-second',mode:'core',name:'Second',state:{faces:[4]},expectedRevision:null});
    await saveCharacter({id:id+'-other',mode:'procedures',name:'Other flow',state:{},expectedRevision:null});
    expect((await listCharacters('core')).filter(r=>r.id.startsWith(id))).toHaveLength(2);
    expect((await listCharacters('procedures')).filter(r=>r.id.startsWith(id))).toHaveLength(1);
  });
  it('allows only one concurrent writer and preserves the winner and recorded dice',async()=>{
    const id=crypto.randomUUID(),initial=await saveCharacter({id,mode:'core',name:'Original',state:{faces:[1,6]},expectedRevision:null});
    const results=await Promise.allSettled(['A','B'].map(name=>saveCharacter({id,mode:'core',name,state:{faces:[1,6]},expectedRevision:initial.revision})));
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
    const rejected=results.find(r=>r.status==='rejected') as PromiseRejectedResult;expect(rejected.reason).toBeInstanceOf(CharacterConflict);
    const current=(await listCharacters('core')).find(r=>r.id===id)!;expect(current.revision).toBe(2);expect(current.state).toEqual({faces:[1,6]});
    await expect(saveCharacter({id,mode:'procedures',name:'Wrong flow',state:{},expectedRevision:2})).rejects.toBeInstanceOf(CharacterConflict);
    await expect(saveCharacter({id,mode:'core',name:'Invalid data',state:()=>null,expectedRevision:2})).rejects.toThrow('Dados do personagem');
    expect((await listCharacters('core')).find(r=>r.id===id)).toEqual(current);
  });
  it('migrates once without replacing an existing migrated character',async()=>{
    const id=crypto.randomUUID(),input={id,mode:'core' as const,name:'Legacy',state:{faces:[2]},expectedRevision:null,legacy:true};
    const a=await saveCharacter(input),b=await saveCharacter({...input,state:{faces:[6]}});expect(b).toEqual(a);
    expect((await listCharacters('core')).find(r=>r.id===id)!.state).toEqual({faces:[2]});
  });
});
