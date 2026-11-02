import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { emptySnapshot,importPack } from '../../packages/catalog';
import { calculateGeneratedCharacter,exportGeneratedCharacter,importGeneratedCharacter,newHumanL0Character,
  performHumanL0Command } from '../../packages/character-generator/runtime';
import type { HumanL0Selection } from '../../packages/curation/human-l0-mechanics';
import { previewHumanBase } from '../../packages/curation/ancestry-base-model';
import { PRNG_VERSION } from '../../packages/random-tables';
import { buildMechanicalArtifacts } from './human-l0-mechanical-compiler';

/** Local acceptance against actual compiled/reviewed inputs. Prints metadata only. */
export async function main(args:string[],root=process.cwd()) {
  if(args.length)throw new Error('Use curation:accept:runtime without arguments.');
  const {packs}=await buildMechanicalArtifacts(root);
  const formalization=JSON.parse(await readFile(resolve(root,'curation/pilot/human-ancestry.json'),'utf8'));
  let catalog=emptySnapshot();for(const pack of packs)catalog=importPack(catalog,pack).snapshot;
  const ref=(index:number)=>({packId:packs[index].packId,version:packs[index].version,entityId:packs[index].entities[0].id});
  let combinations=0;
  for(let ancestry=0;ancestry<2;ancestry++)for(let procedure=0;procedure<2;procedure++)for(const mode of ancestry?['fixed','random'] as const:['fixed'] as const) {
    const m=packs[ancestry].entities[0].mechanics;
    const attributes=mode==='fixed'?{mode:'fixed' as const,increase:'strength' as const}:{mode:'random' as const,seed:'local-recorded-acceptance',prngVersion:PRNG_VERSION,
      rolls:(['strength','agility','intellect','will'] as const).map((attribute,i)=>({attribute,eventId:`local-${i}`,face:1}))};
    const selection:HumanL0Selection={schemaVersion:1,contract:m.contract,contractVersion:m.contractVersion,ancestry:ref(ancestry),attributes,adjustment:null,size:m.size.choices[0],
      procedure:{ref:ref(procedure),kind:procedure?'human-development':'core'},coreBenefit:ancestry===0&&procedure===0?{kind:'speak-language',languageId:'local-extra-language'}:null};
    let c=await newHumanL0Character(selection,packs,{id:`acceptance-${combinations}`,name:''});
    const result=await calculateGeneratedCharacter(c,catalog);
    if(result.kind!=='sotdl-human-l0-character')throw new Error('Runtime dispatch failed.');
    const request=mode==='fixed'?{variant:ancestry?'only-human':'core',mode,increase:'strength',adjustment:null,size:selection.size}:
      {variant:'only-human',mode,faces:{strength:1,agility:1,intellect:1,will:1},adjustment:null,size:selection.size};
    const expected=previewHumanBase(formalization.spec,request).base;
    for(const [key,value] of Object.entries({...result.view.stats,...result.view.states}))if(expected[key]!==value)throw new Error('Base runtime/reference mismatch.');
    if(!result.view.baseResolved||result.view.fullyResolved||result.view.officialGenerationEnabled)throw new Error('Runtime gates invalid.');
    c=await performHumanL0Command(c,packs,{type:'state',target:'damage',value:2,reason:'Local acceptance state persistence.'});
    c=await performHumanL0Command(c,packs,{type:'select',selection});
    const restored=importGeneratedCharacter(exportGeneratedCharacter(c));
    const reopened=await calculateGeneratedCharacter(restored,catalog);
    if(reopened.kind!=='sotdl-human-l0-character'||reopened.view.states?.damage!==2||!reopened.view.baseResolved)throw new Error('Runtime reopen failed.');
    combinations++;
  }
  console.log(`Human L0 local runtime acceptance: passed; ${combinations} combinations; reference parity and JSON reopen; ruleset disabled.`);
}
