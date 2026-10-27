import runtimeURL from './generated/standalone-runtime.json?url';
import { createStandalonePayload, renderStandaloneHTML, downloadFile } from '../../packages/standalone';
import type { Character } from '../../packages/character-generator';
import type { Snapshot } from '../../packages/catalog';

export async function exportStandalone(character: Character, catalog: Snapshot): Promise<number> {
  const response = await fetch(runtimeURL);
  if (!response.ok) throw new Error('Não foi possível carregar o runtime de exportação. Recarregue o aplicativo.');
  const runtime = await response.json();
  const html = await renderStandaloneHTML(createStandalonePayload(character, catalog), runtime);
  const size = new Blob([html]).size;
  downloadFile(html, 'personagem-offline.html', 'text/html;charset=utf-8');
  return size;
}
