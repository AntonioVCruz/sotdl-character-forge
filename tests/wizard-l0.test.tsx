// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WizardL0 } from '../apps/web/WizardL0';

const coreStub = {
  packId: 'sotdl-core-human-l0',
  version: '0.1.0',
  fictionalData: false,
  source: { id: 'sotdl:shadow-of-the-demon-lord-core', title: 'Shadow of the Demon Lord Core', status: 'needs-review' },
  entities: [{ id: 'sotdl:shadow-of-the-demon-lord-core:ancestry:human:default', kind: 'ancestry', name: 'Human', status: 'needs-review' }],
};

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

async function render(node: ReactNode) {
  await act(async () => { root.render(node); });
}
function text() { return host.textContent ?? ''; }
function clickButton(name: string, scope: ParentNode = host) {
  const button = [...scope.querySelectorAll('button')].find(item => item.textContent === name || item.textContent?.startsWith(`${name} ·`));
  if (!button) throw new Error(`botão ausente: ${name}`);
  act(() => { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
}
function clickStep(title: string) {
  const button = [...host.querySelectorAll('nav button')].find(item => item.textContent?.startsWith(title));
  if (!button) throw new Error(`passo ausente: ${title}`);
  act(() => { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
}
function slot(title: string) {
  const heading = [...host.querySelectorAll('article h3')].find(node => node.textContent === title);
  const card = heading?.closest('article');
  if (!card) throw new Error(`slot ausente: ${title}`);
  return card;
}
function pick(title: string, label: string) {
  clickButton('Escolher manualmente', slot(title));
  const option = [...slot(title).querySelectorAll('[role="radio"]')].find(node => node.textContent?.includes(label));
  if (!option) throw new Error(`opção ausente: ${label}`);
  act(() => { option.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  clickButton('Usar esta opção', slot(title));
  clickButton('Confirmar', slot(title));
}
async function fill(label: string, value: string) {
  const input = host.querySelector(`[aria-label="${label}"]`) as HTMLInputElement | null;
  if (!input) throw new Error(label);
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function toggle(label: string) {
  const box = [...host.querySelectorAll('input[type="checkbox"]')].find(item => item.closest('label')?.textContent?.includes(label)) as HTMLInputElement | undefined;
  if (!box) throw new Error(label);
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked')!.set!.call(box, !box.checked);
    box.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

describe('wizard L0', () => {
  it('mostra só o passo ativo, três regiões e nenhuma pendência chamada de completo', async () => {
    await render(<WizardL0 stubs={[]} />);
    expect(host.querySelector('.wizard-shell')).toBeTruthy();
    expect(host.querySelector('nav[aria-label="Passos do nível 0"]')).toBeTruthy();
    expect(host.querySelector('.wizard-step')).toBeTruthy();
    expect(host.querySelector('aside[aria-label="Ficha ao vivo"]')).toBeTruthy();
    expect(host.querySelector('[aria-live="polite"]')).toBeTruthy();
    const steps = [...host.querySelectorAll('nav button')].map(button => button.querySelector('span')?.textContent);
    expect(steps).toEqual([
      'Ruleset e fontes', 'Ancestry', 'Atributos', 'Size', 'Benefício Human', 'Tabelas narrativas',
      'Profissões e idiomas', 'Wealth e kit', 'Interesting Thing', 'Roleplaying', 'Nome e notas', 'Revisão L0',
    ]);
    expect(text()).not.toMatch(/Novice|caminho de aprendiz|demoSlot|demoLevel/);
    expect(text()).not.toContain('Completo');
    expect(text()).toContain('Nível-alvo');
    expect(text()).toContain('0');
    expect(text()).toContain('fictionalData true');
    expect(text()).toContain('Ruleset oficial: desligado.');
    expect(text()).not.toContain('O adapter fictício não inclui tabelas de idade');
    clickStep('Tabelas narrativas');
    expect(text()).toContain('O adapter fictício não inclui tabelas de idade');
    expect(host.querySelector('article h3')?.textContent).toBe('Tabelas narrativas');
    expect([...host.querySelectorAll('article h3')].map(node => node.textContent)).toEqual(['Tabelas narrativas']);
    const css = readFileSync('apps/web/style.css', 'utf8');
    expect(css).toMatch(/@media \(min-width: 1100px\)/);
    expect(css).toContain('grid-template-columns: minmax(200px, 240px) minmax(0, 1fr) minmax(220px, 280px)');
    expect(css).toContain('position: sticky');
  });

  it('confirma no centro e só então atualiza a mini-ficha; descartar e travar não sorteiam', async () => {
    await render(<WizardL0 stubs={[coreStub]} />);
    clickStep('Ancestry');
    clickButton('Escolher manualmente', slot('Ancestry'));
    expect(text()).toContain('Shadow of the Demon Lord Core');
    expect(text()).toContain('fictionalData false');
    expect(text()).toContain('Ruleset oficial desligado.');
    expect(text()).not.toContain('sotdl:');
    pick('Ancestry', 'Human — recorte Core (fictício)');
    expect(text()).toContain('Ficha atualizada: Ancestry confirmado.');
    expect(host.querySelector('dt')?.textContent).toBe('strength');
    expect(host.querySelector('dt')?.nextElementSibling?.textContent).toBe('indisponível');
    clickStep('Atributos');
    pick('Modo de atributos', 'Usar atributos fixos');
    pick('Aumento fixo', 'Strength');
    const strength = [...host.querySelectorAll('dt')].find(node => node.textContent === 'strength');
    expect(strength?.nextElementSibling?.textContent).toBe('11');
    expect([...host.querySelectorAll('dt')].find(node => node.textContent === 'health')?.nextElementSibling?.textContent).toBe('indisponível');
    expect(text()).toContain('Ficha atualizada. Strength 11, Agility 10, Intellect 10, Will 10.');
    clickStep('Size');
    clickButton('Escolher manualmente', slot('Size'));
    const option = [...slot('Size').querySelectorAll('[role="radio"]')].find(node => node.textContent?.includes('Size 1/2'));
    act(() => { option?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    clickButton('Usar esta opção', slot('Size'));
    expect(text()).toContain('prévia — não confirmada');
    expect(text()).not.toContain('Size: Size 1/2');
    clickButton('Descartar prévia', slot('Size'));
    expect(strength?.nextElementSibling?.textContent).toBe('11');
    expect(text()).not.toContain('Size: Size 1/2');
    clickStep('Interesting Thing');
    clickButton('Híbrido');
    clickButton('Escolher manualmente', slot('Interesting Thing'));
    const thing = [...slot('Interesting Thing').querySelectorAll('[role="radio"]')].find(node => node.textContent?.includes('Um botão de vidro'));
    act(() => { thing?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    clickButton('Usar esta opção', slot('Interesting Thing'));
    clickButton('Travar', slot('Interesting Thing'));
    expect(slot('Interesting Thing').textContent).toContain('Um botão de vidro sem casa (fictício)');
    expect(slot('Interesting Thing').textContent).toContain('travado');
    expect(slot('Interesting Thing').textContent).toContain('Travar não executa rolagem.');
    await toggle('Incluir Interesting Thing no Gerar tudo');
    expect(slot('Interesting Thing').textContent).toContain('Um botão de vidro sem casa (fictício)');
    expect(host.querySelector('[data-strategy="published-table"]')).toBeNull();
    clickStep('Revisão L0');
    expect(text()).not.toContain('Completo');
    expect(text()).toContain('Rascunho com pendências');
  });

  it('copia a seed informada e não oferece seed pronta', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    await render(<WizardL0 stubs={[]} />);
    expect((host.querySelector('[aria-label="Seed da sessão"]') as HTMLInputElement).value).toBe('');
    expect(text()).toContain('Nada para copiar: a seed está vazia de propósito.');
    clickButton('Copiar seed');
    expect(writeText).not.toHaveBeenCalled();
    await fill('Seed da sessão', 'sessao-l0');
    clickButton('Copiar seed');
    await act(async () => { await Promise.resolve(); });
    expect(writeText).toHaveBeenCalledWith('sessao-l0');
    expect(text()).toContain('Seed copiada.');
  });

  it('avança o stepper pelo teclado e anuncia a ficha em aria-live', async () => {
    await render(<WizardL0 stubs={[]} />);
    const region = host.querySelector('.wizard-l0') as HTMLElement;
    await act(async () => {
      region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }));
    });
    expect(host.querySelector('nav button[aria-current="step"]')?.textContent).toContain('Ancestry');
    clickStep('Nome e notas');
    await fill('Nome do personagem no nível 0', 'Tomé da ponte fictício');
    expect(host.querySelector('aside')?.textContent).toContain('Sem nome');
    clickButton('Salvar nome e notas do nível 0');
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toContain('nome e notas salvos');
    expect(host.querySelector('aside')?.textContent).toContain('Tomé da ponte fictício');
    await fill('Nome do personagem no nível 0', 'Nome descartado');
    clickButton('Descartar nome e notas');
    expect(host.querySelector('aside')?.textContent).toContain('Tomé da ponte fictício');
    expect((host.querySelector('[aria-label="Nome do personagem no nível 0"]') as HTMLInputElement).value).toBe('Tomé da ponte fictício');
  });
});
