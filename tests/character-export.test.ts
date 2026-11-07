import {describe,it,expect} from 'vitest';
import {CharacterExportSchema,parseCharacterExport,serializeCharacter,requireExportCompletion,MAX_EXPORT_BYTES,exportCharacter} from '../packages/character-generator/character-export';
import {evaluateCharacterCompletion,receiptForCompletion} from '../packages/character-generator/character-finalization';
import {characterExportHtml} from '../apps/web/character-export-html';
import {createProcedureSession} from '../packages/character-generator/procedure-runtime';
import {assertPermittedExportData} from '../packages/character-generator/export-content-policy';
import {inventedProcedureContext} from './helpers/procedure-context';

async function invented(){
  const replay=await createProcedureSession(inventedProcedureContext(),'invented-export');
  return CharacterExportSchema.parse({contract:'sotdl.character-export',contractVersion:'1.0.0',policy:'minimal-character-only@1',contextSha256:'a'.repeat(64),
    sources:[{packId:'invented:pack',version:'1.0.0',sourceId:'invented:source',sha256:'b'.repeat(64),dependencies:[]}],sourceIds:['invented:source'],
    sheet:{name:'Invented <img src=x onerror=alert(1)>',level:0,stats:{strength:11,defense:12},states:{damage:0},moneyBits:'123',dimensions:{},loadout:[],inventory:[{key:'invented:origin',itemId:'invented:item',quantity:2,equipped:true}],professions:[],languages:[],deferredUse:[{key:'invented:effect',code:'deferred-use'}],optionalOmissions:[]},replay});
}
describe('minimal character export with invented data',()=>{
  it('blocks known purchase/authenticated-link patterns in actual emitted fields without rewriting state',async()=>{
    const marker='('+'#'+'1234567'+')',e=await invented();
    const data=JSON.stringify(e);e.sheet.name=marker;
    expect(()=>serializeCharacter(e)).toThrow('compra');expect(()=>characterExportHtml(e)).toThrow('compra');expect(e.sheet.name).toBe(marker);
    const clean=JSON.parse(data);clean.replay.seed='Invented '+marker;
    expect(()=>serializeCharacter(clean)).toThrow('compra');expect(()=>characterExportHtml(clean)).not.toThrow();
    for(const url of ['https://example.invalid/file?X-Amz-Signature=invented','https://example.invalid/file?access_token=invented','https://user:invented@example.invalid/file'])expect(()=>assertPermittedExportData({nested:[url]})).toThrow('Link autenticado');
    expect(()=>assertPermittedExportData({note:'https://example.invalid/public?chapter=2'})).not.toThrow();
  });
  it('requires explicit finalization, resolved obligations and consent independently of source export flags',async()=>{
    const input={contextSha256:'a'.repeat(64),savedContextSha256:'a'.repeat(64),sourceReady:true,mechanicalReady:true,materialReady:true,state:{},pending:[],receipt:null,optionalOmissions:[]};
    const ready=await evaluateCharacterCompletion(input);expect(()=>requireExportCompletion(ready)).toThrow();
    const final=await evaluateCharacterCompletion({...input,receipt:receiptForCompletion(ready)});expect(()=>requireExportCompletion(final)).not.toThrow();
    const blocked=await evaluateCharacterCompletion({...input,pending:[{key:'invented:missing',label:'Invented obligation'}]});expect(()=>requireExportCompletion({...blocked,fullyResolved:true,status:'finalized'})).toThrow();
    await expect(exportCharacter({},inventedProcedureContext(),false)).rejects.toThrow('Confirme');
    await expect(exportCharacter((await invented()).replay,inventedProcedureContext(),true)).rejects.toThrow('Exportação bloqueada');
  });
  it('roundtrips the versioned envelope and rejects unknown fields at all sensitive boundaries',async()=>{
    const e=await invented();expect(parseCharacterExport(serializeCharacter(e))).toEqual(e);
    for(const changed of [{...e,context:{licensed:'DO NOT EXPORT'}},{...e,sheet:{...e.sheet,description:'DO NOT EXPORT'}},{...e,replay:{...e.replay,evidence:['DO NOT EXPORT']}},{...e,sources:[{...e.sources[0],text:'DO NOT EXPORT'}]},{...e,contractVersion:'2.0.0'}])
      expect(()=>parseCharacterExport(JSON.stringify(changed))).toThrow('incompatível');
    expect(()=>parseCharacterExport(' '.repeat(MAX_EXPORT_BYTES+1))).toThrow('limite');
    expect(()=>parseCharacterExport('{')).toThrow();
  });
  it('escapes user text and generates scriptless standalone HTML with the same values, sources and pending codes',async()=>{
    const e=await invented(),html=characterExportHtml(e);
    expect(html).not.toContain('<img');expect(html).not.toMatch(/<script|<iframe|https?:\/\//i);
    expect(html).toContain('&lt;img');expect(html).toContain('123 bits');expect(html).toContain('invented:item');expect(html).toContain('invented:effect');expect(html).toContain('invented:source');expect(html).toContain('A4');
    expect(html).not.toContain('invented-export');expect(html).not.toContain('initialConfig');
  });
});
