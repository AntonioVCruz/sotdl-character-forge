import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {parseOfficialCoreContext,parseOfficialCoreDraft} from '../packages/character-generator/official-core';
import {isLocalOfficialRequest} from '../tools/official-local-plugin';
describe('official-only entry gates',()=>{
  it('refuses demo/fixture contexts and unactivated sources',()=>{
    expect(()=>parseOfficialCoreContext({fictionalData:true})).toThrow('real-local-context-required');
    expect(()=>parseOfficialCoreContext({officialGenerationEnabled:false})).toThrow('real-local-context-required');
    expect(()=>parseOfficialCoreDraft({kind:'sotdl-human-l0-character'})).toThrow('draft-invalid');
    expect(readFileSync('apps/web/main.tsx','utf8')).not.toMatch(/examples\/|mechanics.synthetic|FixturePreview|ForgeApp/);
  });
  it('serves licensed local data only to loopback requests with a local origin/host',()=>{
    expect(isLocalOfficialRequest('127.0.0.1','127.0.0.1:5173','http://127.0.0.1:5173','same-origin')).toBe(true);
    expect(isLocalOfficialRequest('::1','localhost:5173')).toBe(true);
    expect(isLocalOfficialRequest('192.168.1.1','localhost:5173')).toBe(false);
    expect(isLocalOfficialRequest('127.0.0.1','example.com')).toBe(false);
    expect(isLocalOfficialRequest('127.0.0.1','localhost:5173','https://example.com')).toBe(false);
    expect(isLocalOfficialRequest('127.0.0.1','localhost:5173',undefined,'cross-site')).toBe(false);
  });
});
