import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {copyFile,mkdir,mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {dirname,basename,resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {describe,expect,it} from 'vitest';
import {ProfessionOptionSchema,composeLanguageGrants,professionCandidates,resolveProfessionFaces,professionLiteracyGrant} from '../packages/curation/profession-language-model';
import {buildArtifacts,main} from '../tools/curation/professions-languages-formalizer';
import {sourceLines} from '../tools/curation/ancestry-extractor';
const DATA='curation/pilot/professions-languages.json',REPORT='curation/reports/professions-languages.json';
const data=JSON.parse(readFileSync(DATA,'utf8')),options=data.options;
const option=(id:string)=>options.find((o:{id:string})=>o.id===`pilot-profession:${id}`);
const grant=(id:string,languageId:string,abilities:string[],requirePreviouslySpoken=false)=>({id,languageId,abilities,requirePreviouslySpoken,sourceId:'sotdl:shadow-of-the-demon-lord-core',evidenceIds:['published-source'],reason:'Test of published grant composition'});
const speech=grant('common','common-tongue',['speak']);
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');

describe('CUR-017 professions and languages',()=>{
  it('reproduces 168 source-specific table options and one direct grant with exact evidence and no paths or imported pack',async()=>{
    const a=await buildArtifacts(process.cwd()),b=await buildArtifacts(process.cwd());expect([...a.artifacts]).toEqual([...b.artifacts]);
    expect(a.report.counts).toMatchObject({tableOptions:168,directOptions:1,coreOptions:102,expandedOptions:67,literacyGrantingOptions:25,developmentTemplates:19});
    for(const [p,text]of a.artifacts)expect(await readFile(p,'utf8')).toBe(text);
    expect(new Set(options.map((o:{id:string})=>o.id)).size).toBe(169);
    const evidence=new Set(data.evidence.map((e:{id:string})=>e.id));
    for(const o of options){expect(['profession-option','scholarship-option']).toContain(o.kind);for(const id of o.evidenceIds)expect(evidence.has(id)).toBe(true);}
    for(const e of data.evidence){const bytes=readFileSync(e.path),excerpt=sourceLines(bytes.toString('utf8')).slice(e.startLine-1,e.endLine).map(l=>l.text).join('\n');
      expect(sha(bytes)).toBe(e.inputSha256);expect(excerpt).toBe(e.excerpt);expect(sha(excerpt)).toBe(e.excerptSha256);}
    expect(data.gates).toEqual({importablePack:false,officialGenerationEnabled:false,stagingPromoted:false,equipmentEffectsImplemented:false});
    expect(data.languageOptions).toHaveLength(6);
  });
  it('resolves all published face pairs without uniform outcome selection or crossing source categories',()=>{
    for(const sourceFamily of ['core','only-human']){
      let count=0;
      for(let typeFace=1;typeFace<=6;typeFace++)for(let detailFace=1;detailFace<=(sourceFamily==='only-human'&&typeFace===5?6:20);detailFace++){
        const r=resolveProfessionFaces(options,{sourceFamily,typeFace,detailFace});expect(r.option.sourceFamily).toBe(sourceFamily);
        if(!r.option.range)throw new Error('Resolved table option lost its printed range');
        expect(r.option.range.min).toBeLessThanOrEqual(detailFace);expect(r.option.range.max).toBeGreaterThanOrEqual(detailFace);count++;
      }
      expect(count).toBe(sourceFamily==='core'?120:106);
    }
    expect(resolveProfessionFaces(options,{sourceFamily:'core',typeFace:4,detailFace:3}).option.id).toBe(option('core:martial:r03').id);
    expect(resolveProfessionFaces(options,{sourceFamily:'only-human',typeFace:5,detailFace:6}).trace[1].sides).toBe(6);
    expect(()=>resolveProfessionFaces(options,{sourceFamily:'only-human',typeFace:5,detailFace:7})).toThrow(/child die/);
    expect(option('core:academic:r11').kind).toBe('scholarship-option');expect(data.slotSemantics.scholarshipIsMagicAccess).toBe(false);
  });
  it('keeps slots and family category restrictions separate, and exposes the exact Artist literacy condition',()=>{
    const poor=professionCandidates(options,{sourceFamily:'only-human',context:'family',mode:'table-roll',familyResult:7});
    expect(new Set(poor.options.map(o=>o.option.category))).toEqual(new Set(['common','criminal','military','wilderness']));
    const gettingBy=professionCandidates(options,{sourceFamily:'only-human',context:'family',mode:'table-roll',familyResult:10});
    expect(new Set(gettingBy.options.map(o=>o.option.category))).toEqual(new Set(['common','military','religious','wilderness']));
    const missing=professionCandidates(options,{sourceFamily:'only-human',context:'family',mode:'manual',familyResult:3});
    expect(missing.modeAuthorized).toBe(false);expect(missing.options).toEqual([]);
    expect(()=>professionCandidates(options,{sourceFamily:'only-human',context:'core-starting',mode:'manual'})).toThrow(/slot\/source/);
    expect(professionCandidates(options,{sourceFamily:'core',context:'core-human-bonus',mode:'manual'}).modeAuthorized).toBe(false);
    const query={sourceFamily:'only-human',context:'expanded-directed',mode:'manual',categories:['common']};
    const choice=(grants:unknown[])=>professionCandidates(options,{...query,languageGrants:grants}).options.find(o=>o.option.id===option('only-human:common:r03').id)!.subchoices.find(s=>s.id==='writer')!;
    expect(choice([speech]).eligibility).toBe('ineligible');
    expect(choice([speech,grant('read','common-tongue',['read'],true)]).eligibility).toBe('manual-review-partial-literacy');
    expect(choice([speech,grant('literate','common-tongue',['read','write'],true)]).eligibility).toBe('eligible');
  });
  it('grants Core profession literacy only to a previously spoken target and only for the published Artist branch',()=>{
    const a=professionLiteracyGrant(option('core:academic:r01'),{eventId:'academic-read',languageId:'common-tongue'},[speech]);
    expect(a.abilities).toEqual(['read','write']);expect(a.sourceId).toBe('sotdl:shadow-of-the-demon-lord-core');
    const artist=professionLiteracyGrant(option('core:common:r04'),{eventId:'poet-read',languageId:'common-tongue',subchoiceId:'poet'},[speech]);
    expect(artist.abilities).toEqual(['read','write']);
    expect(()=>professionLiteracyGrant(option('core:common:r04'),{eventId:'paint',languageId:'common-tongue',subchoiceId:'painter'},[speech])).toThrow(/poet or writer/);
    expect(()=>professionLiteracyGrant(option('core:academic:r01'),{eventId:'new',languageId:'elvish'},[speech])).toThrow(/already be spoken/);
    expect(()=>professionLiteracyGrant(option('only-human:common:r03'),{eventId:'wrong-source',languageId:'common-tongue',subchoiceId:'writer'},[speech])).toThrow(/does not grant/);
    expect(option('only-human:religious:r02').literacy).toBeNull();expect(option('only-human:scholarship:r01').literacy).toBeNull();
    expect(option('only-human:scholarship:r19').sourceText).not.toContain('Add 1 book');
    for(const o of options.filter((o:{sourceFamily:string;tableId:string|null})=>o.sourceFamily==='only-human'&&o.tableId))expect(o.equipment.length).toBeGreaterThan(0);
  });
  it('preserves independent speech/read/write grants and unlimited recorded exchanges without alphabet inference',()=>{
    const input=[speech,grant('read-common','common-tongue',['read'],true),grant('new-literate','elvish',['speak','read','write'])];
    const before=JSON.stringify(input),state=composeLanguageGrants(input);
    expect(state.languages).toEqual([{languageId:'common-tongue',speak:true,read:true,write:false},{languageId:'elvish',speak:true,read:true,write:true}]);
    expect(JSON.stringify(input)).toBe(before);expect(state.grants).toHaveLength(3);
    const many=Array.from({length:64},(_,i)=>grant(`grant-${i}`,`known-language-${i}`,['speak']));
    expect(composeLanguageGrants(many).languages).toHaveLength(64);expect(data.startingRights.exchanges.professionExchangeCap).toBeNull();
    expect(()=>composeLanguageGrants([grant('unspoken','dwarfish',['read'],true)])).toThrow(/already be spoken/);
    expect(()=>composeLanguageGrants([speech,speech])).toThrow(/Duplicate/);
    expect(()=>composeLanguageGrants([grant('category','Secret Language',['speak'])])).toThrow(/concrete/);
  });
  it('preserves conditional development grants, direct Occult, book/symbol equipment and explicit source variants',()=>{
    const t=(id:string)=>data.developmentGrantTemplates.find((t:{id:string})=>t.id===id);
    expect(t('core-background-education').languages[0].abilities).toEqual(['read']);
    expect(t('strange-dwarfish').languages[0].abilities).toEqual(['speak','read','write']);
    expect(t('childhood-finest-education').sequence).toContain('precede');
    expect(t('childhood-education').professionGrant.missingFamilyProfession).toBe('manual-resolution-no-invented-fallback');
    expect(t('childhood-family').professionGrant.orphanFallbackCategories).toEqual(['common','criminal']);
    expect(t('strange-previous-lives').countRoll).toEqual({count:1,sides:3});
    expect(t('windfall-orator').professionGrant.ifNotAlreadyPresent).toBe(true);
    const direct=option('only-human:direct:occult');expect(direct.range).toBeNull();expect(direct.tableId).toBeNull();
    expect(professionCandidates(options,{sourceFamily:'only-human',context:'expanded-directed',mode:'table-roll'}).options.some(o=>o.option.id===direct.id)).toBe(false);
    expect(option('only-human:scholarship:r01').equipment[0].quantity).toBe(1);
    expect(option('only-human:religious:r04').equipment).toHaveLength(2);
    expect(data.startingRights).toMatchObject({core:{professionChoices:2},expanded:{fixedCoreRandomRollsAdded:false,familyProfessionIsAutomaticallyPCProfession:false}});
  });
  it('rejects paths disguised as professions, mismatched ranges and unsupported abilities',()=>{
    expect(()=>ProfessionOptionSchema.parse({...option('core:common:r03'),kind:'path'})).toThrow();
    expect(()=>ProfessionOptionSchema.parse({...option('core:common:r03'),range:{min:4,max:3}})).toThrow(/pairing/);
    expect(()=>composeLanguageGrants([grant('bad','common-tongue',['cast-spells'])])).toThrow();
  });
  it('rejects stale evidence and a tampered output before writing',async()=>{
    const root=await mkdtemp(join(tmpdir(),'sotdl-professions-languages-'));
    try{
      const paths=new Set<string>([DATA,REPORT]);
      for(const path of [DATA,'curation/pilot/creation-table-inventory.json','curation/pilot/human-ancestry.json','curation/pilot/core-level-zero.json']){
        const object=JSON.parse(readFileSync(path,'utf8'));for(const ref of object.inputRefs)paths.add(ref.path);
      }
      for(const path of paths){await mkdir(dirname(resolve(root,path)),{recursive:true});await copyFile(path,resolve(root,path));}
      await main(['--check'],root);await writeFile(resolve(root,DATA),'tampered\n');
      await expect(main(['--check'],root)).rejects.toThrow(/artifact changed/);
      const path=data.evidence[0].path;await writeFile(resolve(root,path),'changed source\n');
      await expect(main(['--write'],root)).rejects.toThrow(/Stale reconciliation|revision changed/);
      expect(await readFile(resolve(root,DATA),'utf8')).toBe('tampered\n');
    }finally{
      if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('sotdl-professions-languages-'))throw new Error('Unexpected scratch directory');
      await rm(root,{recursive:true,force:true});
    }
  },30000);
});
