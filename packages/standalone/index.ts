import { z } from 'zod';
import { packKey, validateSnapshot, type Snapshot } from '../catalog';
import { parseCharacter, type Character } from '../character-generator';

export const RUNTIME_VERSION = 'demo-offline-v2';
export type StandalonePayload = { format: 'sotdl-standalone-sheet'; formatVersion: 1; runtimeVersion: typeof RUNTIME_VERSION; character: Character; catalog: Snapshot };
export type StandaloneRuntime = { script: string; css: string };
const MAX_PAYLOAD = 10_000_000;
const envelope = z.object({ format: z.literal('sotdl-standalone-sheet'), formatVersion: z.literal(1), runtimeVersion: z.literal(RUNTIME_VERSION), character: z.unknown(), catalog: z.unknown() }).strict();
export function parseStandalonePayload(input: unknown): StandalonePayload {
  if (JSON.stringify(input)?.length > MAX_PAYLOAD) throw new Error('Snapshot offline excede 10 MB.');
  const raw = envelope.parse(input);
  const character = parseCharacter(raw.character), catalog = validateSnapshot(raw.catalog);
  if (catalog.packs.some(pack => !pack.fictionalData)) throw new Error('Esta versão offline incorpora somente packs fictícios.');
  return { format: 'sotdl-standalone-sheet', formatVersion: 1, runtimeVersion: RUNTIME_VERSION, character, catalog };
}
export function createStandalonePayload(input: Character, inputCatalog: Snapshot): StandalonePayload {
  const character = parseCharacter(input), catalog = validateSnapshot(inputCatalog);
  const required = new Set([...catalog.ruleset.packs, ...character.ruleset.packs].map(packKey));
  for (const event of character.events) for (const source of event.resolution.sources) required.add(`${source.packId}@${source.version}`);
  for (const action of character.session.actions) if (action.type === 'cast') required.add(`${action.definition.packId}@${action.definition.version}`);
  // Include dependencies without changing enablement or silently substituting a missing version.
  for (let pass = 0; pass <= catalog.packs.length; pass++) {
    const previous = required.size;
    for (const pack of catalog.packs) if (required.has(packKey(pack))) for (const ref of pack.dependencies) required.add(packKey(ref));
    if (required.size === previous) break;
  }
  return parseStandalonePayload({ format: 'sotdl-standalone-sheet', formatVersion: 1, runtimeVersion: RUNTIME_VERSION, character, catalog: { ...catalog, packs: catalog.packs.filter(pack => required.has(packKey(pack))) } });
}
export function safeJSON(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4,'0')}`);
}
function escapeText(text: string): string {
  return text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}
async function hash(text: string) {
  if (!globalThis.crypto?.subtle) throw new Error('Este navegador não oferece criptografia local para gerar o HTML seguro. Use localhost ou um navegador atualizado.');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}
export async function renderStandaloneHTML(input: StandalonePayload, runtime: StandaloneRuntime): Promise<string> {
  const payload = parseStandalonePayload(input);
  if (!runtime.script || !runtime.css || /<\/style/i.test(runtime.css)) throw new Error('Runtime offline inválido.');
  const script = runtime.script.replace(/<\/script/gi, '<\\/script');
  const [scriptHash, styleHash] = await Promise.all([hash(script), hash(runtime.css)]);
  const policy = `default-src 'none'; script-src 'sha256-${scriptHash}'; style-src 'sha256-${styleHash}'; style-src-attr 'none'; connect-src 'none'; img-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
  return `<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeText(payload.character.name || 'Ficha demonstrativa')} - Character Forge offline</title><style id="standalone-style">${runtime.css}</style></head><body><div id="root"></div><noscript>Ative JavaScript para editar e recalcular esta ficha offline.</noscript><script id="standalone-state" type="application/json">${safeJSON(payload)}</script><script id="standalone-runtime">${script}</script></body></html>`;
}
export function downloadFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
