// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HumanL0FixturePreview } from '../apps/web/HumanL0FixturePreview';
import { Root as AppRoot } from '../apps/web/main';
import { loadHumanL0Character } from '../packages/character-generator/storage';

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.location.hash = '';
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

describe('Human L0 route', () => {
  it('switches hash both ways without crashing the forge boundary', async () => {
    window.location.hash = '';
    await render(<AppRoot />);
    expect(host.textContent).toContain('Forja de personagens');
    expect(host.textContent).not.toContain('Não foi possível mostrar');
    await act(async () => {
      window.location.hash = '#/human-l0';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await flush();
    expect(host.textContent).toContain('Prévia local Human L0');
    expect(host.textContent).not.toContain('Não foi possível mostrar');
    await act(async () => {
      window.location.hash = '#/human-l0/reserved';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await flush();
    expect(host.querySelector('.wizard-step h3')?.textContent).toBe('Passos reservados');
    expect(host.textContent).not.toContain('Não foi possível mostrar');
    await act(async () => {
      window.location.hash = '';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await flush();
    expect(host.textContent).toContain('Forja de personagens');
    expect(host.textContent).toContain('Abrir prévia local Human L0 (fixture)');
    expect(host.textContent).not.toContain('Não foi possível mostrar');
  });
});

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
    const blockedOption = source?.querySelector('[role="radio"][aria-disabled="true"]');
    expect(blockedOption?.getAttribute('tabindex')).toBe('0');
    await act(async () => { blockedOption?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(blockedOption?.getAttribute('aria-checked')).toBe('false');
    await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
    expect(document.activeElement).toBe(open);
    const reserved = [...host.querySelectorAll('button')].find(button => button.textContent?.includes('Passos reservados'));
    await act(async () => { reserved?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(host.textContent).toContain('Aguarda #34/#35');
    const professions = host.querySelector('[data-slot="professions"]');
    expect(professions?.textContent).toContain('pendente');
    expect(professions?.textContent).toContain('Escolhas: 0–0');
    const openProfessions = [...(professions?.querySelectorAll('button') ?? [])].find(button => button.textContent === 'Escolher manualmente');
    await act(async () => { openProfessions?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(professions?.textContent).toContain('0 opções');
    const useOption = [...(professions?.querySelectorAll('button') ?? [])].find(button => button.textContent === 'Usar esta opção');
    expect(useOption?.getAttribute('aria-disabled')).toBe('true');
    expect(professions?.textContent).toContain('Aguarda #34/#35. Esta fatia não inventa opções.');
    await act(async () => { useOption?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(host.textContent).not.toContain('A seleção não fecha o contrato.');
    expect(host.querySelector('[data-field="health"]')).toBeNull();
    expect(host.textContent).toContain('Características: indisponível');
    expect(host.textContent).toContain('Resultados de procedimento ainda pendentes.');
    expect(host.textContent).toContain('Catálogo de equipamento e tabelas ainda pendente.');
  });

  it('previews without changing the sheet, confirms through the engine, and discards the next preview', async () => {
    await render(<HumanL0FixturePreview onLeave={() => undefined} />);
    click('Próximo');
    expect(host.querySelector('.wizard-step h3')?.textContent).toBe('Ancestry e Size');
    expect(await loadHumanL0Character('fixture-preview')).toBeNull();
    const ancestry = host.querySelector('[data-slot="ancestry"]') as HTMLElement;
    click('Escolher manualmente', ancestry);
    const choice = ancestry.querySelector('[role="radio"]') as HTMLElement;
    await act(async () => { choice.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    click('Usar esta opção', ancestry);
    await settle();
    expect(ancestry.textContent).toContain('Ainda não aplicado');
    expect(host.textContent).toContain('Características: indisponível');
    expect(await loadHumanL0Character('fixture-preview')).toBeNull();
    click('Próximo');
    expect(await loadHumanL0Character('fixture-preview')).toBeNull();
    click('Anterior');
    click('Confirmar', host.querySelector('[data-slot="ancestry"]') ?? host);
    await settle();
    expect(host.textContent).toContain('Ficha atualizada pela confirmação.');
    const strength = host.querySelector('[data-field="strength"] dd')?.textContent;
    expect(strength).toMatch(/^\d+$/);
    expect(host.querySelector('[data-field="health"]')?.getAttribute('data-status')).toBe('value');
    expect(host.querySelectorAll('[data-field="perception"]')).toHaveLength(1);
    expect(host.querySelectorAll('[data-field="power"]')).toHaveLength(1);
    expect(host.textContent).toContain('Somente fala.');
    expect(host.querySelector('summary')?.textContent).toContain('Composição do motor');
    const grantLink = host.querySelector('a[href="#/human-l0/reserved"]');
    expect(grantLink?.textContent).toBe('Ir para o passo');
    await act(async () => {
      window.location.hash = '#/human-l0/reserved';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(host.querySelector('.wizard-step h3')?.textContent).toBe('Passos reservados');
    expect(host.querySelector('[data-slot="professions"]')).toBeTruthy();
    expect(host.querySelector('[data-field="strength"] dd')?.textContent).toBe(strength);
    await act(async () => {
      window.location.hash = '#/human-l0/ancestry';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    const size = host.querySelector('[data-slot="size"]') as HTMLElement;
    click('Escolher manualmente', size);
    const other = [...size.querySelectorAll('[role="radio"]')].find(node => node.getAttribute('aria-checked') !== 'true') as HTMLElement;
    await act(async () => { other.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    click('Usar esta opção', size);
    await settle();
    expect(size.textContent).toContain('Ainda não aplicado');
    expect(host.querySelector('[data-field="strength"] dd')?.textContent).toBe(strength);
    click('Descartar prévia', size);
    expect(host.querySelector('[data-field="strength"] dd')?.textContent).toBe(strength);
    expect(host.textContent).toContain('Prévia descartada. A ficha confirmada foi preservada.');
    const saved = await loadHumanL0Character('fixture-preview');
    expect(saved?.kind).toBe('sotdl-human-l0-character');
    expect(saved?.mode).toBe('local-preview');
  });

  it('shows a blocked roll reason and does not run the command', async () => {
    await render(<HumanL0FixturePreview onLeave={() => undefined} />);
    const source = host.querySelector('[data-slot="source"]') ?? host;
    click('Sortear', source);
    expect(source.textContent).toContain('não sorteia');
    expect(host.textContent).not.toContain('Ainda não aplicado');
    expect(await loadHumanL0Character('fixture-preview')).toBeNull();
  });
});

function click(name: string, scope: ParentNode = host) {
  const button = [...scope.querySelectorAll('button')].find(item => item.textContent === name);
  if (!button) throw new Error(`botão ausente: ${name}`);
  act(() => { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
}
async function settle() {
  for (let attempt = 0; attempt < 30; attempt++) await flush();
}
