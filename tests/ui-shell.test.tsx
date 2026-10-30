// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emptySnapshot } from '../packages/catalog';
import { newCharacter } from '../packages/character-generator';
import { StatsSchema, type Stats as StatBlock } from '../packages/random-tables';
import { CharacterSheet } from '../apps/web/CharacterSheet';
import { ErrorBoundary, onCaughtError } from '../apps/web/ErrorBoundary';
import { reportBoundaryError } from '../apps/web/errors';
import { STAT_GAPS, STAT_KEYS, STAT_LABELS, Stats } from '../apps/web/Stats';

const secret = 'segredo-seed-7F3A-notas-do-personagem';
let host: HTMLDivElement;
let root: Root;
let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host, { onCaughtError });
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  consoleError.mockRestore();
});

async function render(node: ReactNode) {
  await act(async () => { root.render(node); });
}
function text() { return host.textContent ?? ''; }
async function click(name: string) {
  const button = [...host.querySelectorAll('button')].find(item => item.textContent === name);
  if (!button) throw new Error(`botão ausente: ${name}`);
  await act(async () => { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
}
function loggedLines(): string[] {
  return consoleError.mock.calls.map((call: unknown[]) => call.map(item => String(item)).join(' '));
}

describe('ErrorBoundary', () => {
  it('mostra fallback em português, preserva o irmão e não vaza mensagem nem pilha', async () => {
    function Boom(): ReactNode { throw new Error(secret); }
    await render(<div><p>Biblioteca de fontes</p><ErrorBoundary scope="criador"><Boom /></ErrorBoundary></div>);
    expect(text()).toContain('Biblioteca de fontes');
    expect(text()).toContain('Não foi possível mostrar o criador.');
    expect(text()).toContain('Tentar de novo');
    expect(text()).not.toContain('Recomeçar');
    expect(text()).not.toContain(secret);
    expect(text()).not.toContain('at Boom');
    expect(host.querySelector('[data-boundary="criador"]')).toBeTruthy();
    expect(document.activeElement).toBe(host.querySelector('[role="alert"]'));
    const ours = loggedLines().filter((line: string) => line.startsWith('[forja]'));
    expect(ours).toEqual(['[forja] falha de renderização (criador): Error']);
    expect(loggedLines().join('\n')).not.toContain(secret);
  });

  it('tentar de novo remonta e recomeçar avisa o pai', async () => {
    let fail = true;
    const onReset = vi.fn(() => { fail = false; });
    function Child(): ReactNode {
      if (fail) throw new Error(secret);
      return <p>criador visível</p>;
    }
    await render(<ErrorBoundary scope="criador" onReset={onReset}><Child /></ErrorBoundary>);
    await click('Tentar de novo');
    expect(onReset).not.toHaveBeenCalled();
    expect(text()).toContain('Não foi possível mostrar o criador.');
    expect(text()).not.toContain(secret);
    await click('Recomeçar');
    expect(onReset).toHaveBeenCalledOnce();
    expect(text()).toContain('criador visível');
    expect(text()).not.toContain('Não foi possível mostrar o criador.');
  });

  it('espera o descarte do personagem antes de remontar e esconde Recomeçar sem onReset', async () => {
    function Boom(): ReactNode { throw new Error(secret); }
    await render(<ErrorBoundary scope="forja"><Boom /></ErrorBoundary>);
    expect(host.querySelectorAll('button')).toHaveLength(1);
    let fail = true;
    let release: () => void = () => {};
    const gate = new Promise<void>(resolve => { release = resolve; });
    function Child(): ReactNode {
      if (fail) throw new Error(secret);
      return <p>criador limpo</p>;
    }
    await render(<ErrorBoundary scope="criador" onReset={() => gate.then(() => { fail = false; })}><Child /></ErrorBoundary>);
    await click('Recomeçar');
    expect(text()).toContain('Não foi possível mostrar o criador.');
    expect(text()).toContain('descarta o personagem salvo');
    await act(async () => { release(); });
    expect(text()).toContain('criador limpo');
  });

  it('mantém o aviso se o descarte falha, sem mostrar a causa', async () => {
    function Boom(): ReactNode { throw new Error('outro'); }
    await render(<ErrorBoundary scope="criador" onReset={async () => { throw new Error(secret); }}><Boom /></ErrorBoundary>);
    await click('Recomeçar');
    await act(async () => { await Promise.resolve(); });
    expect(text()).toContain('Não foi possível mostrar o criador.');
    expect(text()).toContain('Nada foi substituído.');
    expect(text()).not.toContain(secret);
  });

  it('registra só o nome do erro, mesmo com mensagem sensível', () => {
    reportBoundaryError(new Error(`${secret} token=abc`), 'criador');
    reportBoundaryError('falha', 'desconhecido');
    expect(loggedLines()).toEqual([
      '[forja] falha de renderização (criador): Error',
      '[forja] falha de renderização (forja): Error',
    ]);
  });
});

describe('Stats', () => {
  const shown: StatBlock = { strength: 12, agility: 9, intellect: 10, will: 10, health: 12, defense: 0, speed: 10 };

  it('usa as chaves do StatsSchema e não calcula lacunas da CUR-015', async () => {
    expect(STAT_KEYS).toEqual(Object.keys(StatsSchema.shape));
    for (const gap of STAT_GAPS) expect(STAT_KEYS).not.toContain(gap.key);
    await render(<Stats stats={shown} />);
    expect([...host.querySelectorAll('.stats dt')].map(node => node.textContent)).toEqual(STAT_KEYS.map(key => STAT_LABELS[key]));
    for (const key of STAT_KEYS) {
      const term = [...host.querySelectorAll('dt')].find(node => node.textContent === STAT_LABELS[key]);
      expect(term?.textContent).not.toBe(key);
      expect(term?.nextElementSibling?.textContent).toBe(String(shown[key]));
    }
    for (const gap of STAT_GAPS) {
      const row = host.querySelector(`[data-stat-gap="${gap.key}"]`);
      expect(row?.textContent).toBe(`${gap.label}: indisponível`);
      expect(row?.textContent).not.toMatch(/\d/);
    }
    expect(text()).not.toContain('+2');
    expect(text()).toContain('Não é pack curado nem a base Human de CUR-015.');
  });

  it('deixa explícito quando o cálculo demonstrativo ainda não tem número', async () => {
    await render(<CharacterSheet character={newCharacter()} catalog={emptySnapshot()} title="Ficha confirmada" />);
    for (const key of STAT_KEYS) {
      const term = [...host.querySelectorAll('dt')].find(node => node.textContent === STAT_LABELS[key]);
      expect(term?.nextElementSibling?.textContent).toBe('indisponível');
    }
    expect(host.querySelector('[data-stat-gap="perception"]')?.textContent).toBe('Perception: indisponível');
    expect(text()).not.toMatch(/Perception:\s*\d/);
    expect(text()).toContain('Personagem sem nome');
  });
});
