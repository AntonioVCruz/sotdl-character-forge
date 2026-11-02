// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HumanL0FixturePreview } from '../apps/web/HumanL0FixturePreview';
import {
  buildFixtureSelection,
  defaultFixtureSelectionInput,
  humanL0FixturePacks,
  previewHumanL0,
} from '../apps/web/human-l0-preview';
import { loadHumanL0Character } from '../packages/character-generator/storage';

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal('indexedDB', new IDBFactory());
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

async function flush() {
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
}
async function render(node: ReactNode) {
  await act(async () => { root.render(node); });
  for (let attempt = 0; attempt < 20 && text().includes('Abrindo a prévia local da fixture.'); attempt++) await flush();
}
function text() { return host.textContent ?? ''; }
function button(name: string): HTMLButtonElement {
  const found = [...host.querySelectorAll('button')].find(item => item.textContent === name);
  if (!found) throw new Error(`botão ausente: ${name}`);
  return found as HTMLButtonElement;
}
async function click(name: string) {
  await act(async () => { button(name).dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await flush();
  for (let attempt = 0; attempt < 30 && text().includes('Consultando o motor'); attempt++) await flush();
}
function field(name: string, scope?: ParentNode): HTMLElement {
  const rootNode = scope ?? host;
  const found = rootNode.querySelector(`[data-field="${name}"]`);
  if (!found) throw new Error(`campo ausente: ${name}`);
  return found as HTMLElement;
}

describe('Human L0 fixture preview section', () => {
  it('labels the fixture path, keeps official generation off and withholds Health, Defense and Speed', async () => {
    const built = buildFixtureSelection(humanL0FixturePacks(), defaultFixtureSelectionInput());
    if (!built.ok) throw new Error(built.blocks[0]?.code);
    const expected = await previewHumanL0(null, humanL0FixturePacks(), { type: 'create', selection: built.selection, name: '' });
    if (!expected.ok) throw new Error(expected.blocks[0]?.code);
    await render(<HumanL0FixturePreview />);
    expect(host.querySelector('[data-channel="fixture"]')?.getAttribute('data-official')).toBe('false');
    expect(text()).toContain('PRÉVIA LOCAL · FIXTURE');
    expect(text()).toContain('Geração oficial permanece desligada');
    expect(text()).toContain('fictionalData true');
    expect(text()).not.toMatch(/MAGIC_PATH|demoSlot|demoLevel/);
    expect(text()).toContain('Nenhuma ficha Human L0 confirmada nesta entrada.');
    expect(button('Rolar atributos na prévia').getAttribute('aria-disabled')).toBe('true');
    expect(host.querySelector('#human-l0-status')?.getAttribute('aria-live')).toBe('polite');
    await click('Ver prévia local');
    const proposal = host.querySelector('[aria-label="Prévia local não confirmada"]');
    expect(proposal).toBeTruthy();
    expect(document.activeElement).toBe(proposal?.querySelector('h3'));
    const strength = expected.model.fields.find(item => item.key === 'strength');
    expect(field('strength', proposal ?? undefined).querySelector('dd')?.textContent).toBe(String(strength?.value));
    for (const key of ['health', 'defense', 'speed']) {
      expect(field(key, proposal ?? undefined).getAttribute('data-status')).toBe('indisponível');
      expect(field(key, proposal ?? undefined).querySelector('dd')?.textContent).toBe('indisponível');
    }
    expect(field('professions', proposal ?? undefined).querySelector('dd')?.textContent).toBe('pendente');
    expect(field('print', proposal ?? undefined).querySelector('dd')?.textContent).toBe('indisponível');
    expect(proposal?.textContent).toContain('Resultados de procedimento ainda pendentes.');
    expect(proposal?.textContent).not.toContain('Completo');
    expect(await loadHumanL0Character('fixture-preview')).toBeNull();
    await click('Descartar prévia local');
    expect(host.querySelector('[aria-label="Prévia local não confirmada"]')).toBeNull();
    expect(document.activeElement).toBe(button('Ver prévia local'));
    expect(text()).toContain('Prévia descartada. A ficha confirmada foi preservada.');
    await click('Ver prévia local');
    await click('Confirmar prévia local');
    expect(text()).toContain('Prévia confirmada no id fixture-preview');
    const saved = await loadHumanL0Character('fixture-preview');
    expect(saved?.id).toBe('fixture-preview');
    expect(saved?.mode).toBe('local-preview');
    expect(await loadHumanL0Character()).toBeNull();
    const confirmed = host.querySelector('[aria-label="Ficha confirmada da prévia local"]');
    expect(field('health', confirmed ?? undefined).querySelector('dd')?.textContent).toBe('indisponível');
  });

  it('keeps an ineligible transfer out of the engine and drops a preview when the choice changes', async () => {
    await render(<HumanL0FixturePreview />);
    await click('Ver prévia local');
    expect(host.querySelector('[aria-label="Prévia local não confirmada"]')).toBeTruthy();
    const ancestry = host.querySelector('[aria-label="Ancestry da fixture"]') as HTMLSelectElement;
    const other = [...ancestry.options].find(option => option.value !== ancestry.value);
    if (!other) throw new Error('segunda ancestry ausente');
    await act(async () => {
      ancestry.value = other.value;
      ancestry.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(host.querySelector('[aria-label="Prévia local não confirmada"]')).toBeNull();
    expect(text()).toContain('Prévia descartada porque a escolha mudou');
    const transfer = host.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await act(async () => { transfer.click(); });
    for (const label of ['Atributo que aumenta', 'Atributo que diminui']) {
      const control = host.querySelector(`[aria-label="${label}"]`) as HTMLSelectElement;
      if (!control) throw new Error(`controle ausente: ${label}`);
      await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(control, 'strength');
        control.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
    expect(button('Ver prévia local').getAttribute('aria-disabled')).toBe('true');
    expect(host.querySelector('[data-block="selection-schema-invalid"]')).toBeTruthy();
    await click('Ver prévia local');
    expect(await loadHumanL0Character('fixture-preview')).toBeNull();
    expect(host.querySelector('[aria-label="Prévia local não confirmada"]')).toBeNull();
  });
});
