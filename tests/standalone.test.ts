import { describe, expect, it } from 'vitest';
import { createStandalonePayload, parseStandalonePayload, renderStandaloneHTML, safeJSON } from '../packages/standalone';
import { emptySnapshot, importPack, setEnabled } from '../packages/catalog';
import { calculateCharacter, exportCharacter, newCharacter, preview } from '../packages/character-generator';
import zero from '../examples/demo-level-zero.json';
import tables from '../examples/demo-random-tables.json';

function fixture() {
  let catalog = importPack(emptySnapshot(), tables).snapshot;
  catalog = importPack(catalog, zero).snapshot;
  for (const pack of catalog.packs) catalog = setEnabled(catalog, pack, true);
  const character = preview(newCharacter(), catalog, { seed: 'offline-fixture', targetLevel: 0, allowUniform: true, mode: 'all-random', perSlotModes: {} }).character;
  return { character, catalog };
}
describe('snapshot e HTML autônomo', () => {
  it('serializa texto malicioso como dados e restringe execução ao hash do runtime', async () => {
    const { character, catalog } = fixture();
    character.name = '</title><script>window.pwned=true</script>';
    character.notes = '</script><img src=x onerror="window.pwned=true">\u2028&';
    const payload = createStandalonePayload(character, catalog);
    const serialized = safeJSON(payload);
    expect(serialized).not.toContain('<'); expect(JSON.parse(serialized).character.notes).toBe(character.notes);
    const html = await renderStandaloneHTML(payload, { script: 'window.testRuntime=true;', css: 'body { color: black; }' });
    expect(html).toContain('connect-src \'none\''); expect(html).not.toContain('unsafe-eval'); expect(html).not.toContain('unsafe-inline');
    expect(html).toContain('&lt;/title&gt;'); expect(html).not.toContain('<img');
    expect(html.match(/<script /g)).toHaveLength(2);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('window.testRuntime=true;'));
    const hash = btoa(String.fromCharCode(...new Uint8Array(digest)));
    expect(html).toContain(`script-src 'sha256-${hash}'`);
  });
  it('prune packs não usados e recusa incorporação de conteúdo não fictício', () => {
    const { character, catalog } = fixture();
    const real = { packId: 'private-source', version: '0.0.1', system: 'sotdl', fictionalData: false, source: { id: 'private', title: 'Fonte privada', status: 'needs-review' }, entities: [] };
    const imported = importPack(catalog, real).snapshot;
    expect(createStandalonePayload(character, imported).catalog.packs).toHaveLength(2);
    const enabled = setEnabled(imported, imported.packs[2], true);
    expect(() => createStandalonePayload(character, enabled)).toThrow('fictícios');
  });
  it('preserva catálogo desabilitado e resultados sem trocar fonte nem consumir RNG', () => {
    const { character, catalog } = fixture(), original = exportCharacter(character);
    const disabled = setEnabled(catalog, catalog.packs[0], false);
    const payload = createStandalonePayload(character, disabled);
    expect(payload.catalog.packs).toHaveLength(2);
    expect(payload.catalog.ruleset).toEqual(disabled.ruleset);
    expect(calculateCharacter(payload.character, payload.catalog).fullyResolved).toBe(false);
    expect(exportCharacter(payload.character)).toBe(original);
    expect(parseStandalonePayload(JSON.parse(safeJSON(payload)))).toEqual(payload);
  });
  it('rejeita envelope e runtime incompatíveis sem aceitar campos extras', async () => {
    const { character, catalog } = fixture(), payload = createStandalonePayload(character, catalog);
    expect(() => parseStandalonePayload({ ...payload, runtimeVersion: 'unknown' })).toThrow();
    expect(() => parseStandalonePayload({ ...payload, arbitraryScript: 'alert(1)' })).toThrow();
    await expect(renderStandaloneHTML(payload, { script: 'ok', css: '</style><script>alert(1)</script>' })).rejects.toThrow('inválido');
  });
});
