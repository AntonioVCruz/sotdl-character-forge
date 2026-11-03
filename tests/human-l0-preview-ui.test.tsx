// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HumanL0FixturePreview } from '../apps/web/HumanL0FixturePreview';

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
  for (let attempt = 0; attempt < 20 && (host.textContent ?? '').includes('Abrindo a prévia local da fixture.'); attempt++) await flush();
}

describe('Human L0 fixture shell', () => {
  it('uses ChoiceSlot on a separate entry and keeps later steps pending', async () => {
    await render(<HumanL0FixturePreview onLeave={() => undefined} />);
    const section = host.querySelector('[data-entry="human-l0"]');
    expect(section?.getAttribute('data-kind')).toBe('sotdl-human-l0-character');
    expect(section?.getAttribute('data-mode')).toBe('local-preview');
    expect(section?.getAttribute('data-official')).toBe('false');
    expect(host.textContent).toContain('fixture');
    expect(host.textContent).toContain('prévia local');
    expect(host.textContent).not.toContain('Criador nível 0');
    expect(host.querySelector('[aria-live="polite"]')).toBeTruthy();
    expect(host.querySelectorAll('article.choice-slot-card').length).toBeGreaterThan(0);
    const source = host.querySelector('[data-slot="source"]');
    const open = [...(source?.querySelectorAll('button') ?? [])].find(button => button.textContent === 'Escolher manualmente');
    await act(async () => { open?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(source?.textContent).toContain('Ruleset habilitado');
    expect(source?.textContent).toContain('Geração oficial permanece desligada');
    const reserved = [...host.querySelectorAll('button')].find(button => button.textContent?.includes('Passos reservados'));
    await act(async () => { reserved?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(host.textContent).toContain('Aguarda #34/#35');
    const professions = host.querySelector('[data-slot="professions"]');
    expect(professions?.textContent).toContain('pendente');
    expect(professions?.textContent).toContain('Escolhas: 0–0');
    const openProfessions = [...(professions?.querySelectorAll('button') ?? [])].find(button => button.textContent === 'Escolher manualmente');
    await act(async () => { openProfessions?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(professions?.textContent).toContain('0 opções');
    expect(host.querySelector('[data-field="health"]')).toBeNull();
    expect(host.textContent).toContain('Características: indisponível');
  });
});
