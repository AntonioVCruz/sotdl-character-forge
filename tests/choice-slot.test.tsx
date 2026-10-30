// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChoiceSlot } from '../apps/web/ChoiceSlot';
import { STRATEGY_BADGE, type ChoiceSlotProps, type Strategy } from '../apps/web/choice-slot';

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
function clickButton(name: string) {
  const button = [...host.querySelectorAll('button')].find(item => item.textContent === name);
  if (!button) throw new Error(`botão ausente: ${name}`);
  act(() => { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
}

function props(overrides: Partial<ChoiceSlotProps> = {}): ChoiceSlotProps {
  return {
    slotId: 'secret-slot-id',
    title: 'Interesting Thing',
    contextLine: 'lista fictícia · fictionalData true',
    strategy: 'pending',
    uiState: 'empty',
    options: [
      { id: 'ok', label: 'Botão de vidro (fictício)', eligible: true },
      { id: 'no', label: 'Item de tabela publicada', eligible: false, disabledReason: 'fonte desativada nesta demonstração' },
    ],
    cardinality: { min: 1, max: 1 },
    selectedIds: [],
    locked: false,
    canReroll: false,
    onManualOpen: vi.fn(),
    onSelect: vi.fn(),
    onRoll: vi.fn(),
    onReroll: vi.fn(),
    onConfirmPreview: vi.fn(),
    onDiscardPreview: vi.fn(),
    onToggleLock: vi.fn(),
    onShowSource: vi.fn(),
    onShowHistory: vi.fn(),
    ...overrides,
  };
}

describe('ChoiceSlot', () => {
  it('não mostra o id cru e esconde Rolar novamente antes do resultado', async () => {
    await render(<ChoiceSlot {...props()} />);
    expect(text()).not.toContain('secret-slot-id');
    expect(text()).toContain('Interesting Thing');
    expect(text()).toContain('pendente');
    expect(text()).toContain('vazio');
    expect(host.querySelector('[data-strategy="pending"]')?.textContent).toBe('pendente');
    expect(host.querySelector('[data-slot-state="empty"]')?.textContent).toBe('vazio');
    expect([...host.querySelectorAll('button')].some(button => button.textContent === 'Rolar novamente')).toBe(false);
  });

  it('lista opção inválida com motivo focável e não a seleciona', async () => {
    const slot = props();
    await render(<ChoiceSlot {...slot} />);
    clickButton('Escolher manualmente');
    const invalid = host.querySelector('[aria-disabled="true"].choice-option, .choice-option[aria-disabled="true"]');
    expect(invalid?.textContent).toContain('Item de tabela publicada');
    expect(invalid?.textContent).toContain('fonte desativada nesta demonstração');
    expect(invalid?.getAttribute('tabindex')).toBe('0');
    expect(invalid?.getAttribute('aria-describedby')).toBeTruthy();
    const described = invalid?.getAttribute('aria-describedby');
    expect(host.querySelector(`#${CSS.escape(described ?? '')}`)?.textContent).toContain('fonte desativada nesta demonstração');
    act(() => { invalid?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(slot.onSelect).not.toHaveBeenCalled();
    const valid = [...host.querySelectorAll('[role="radio"]')].find(node => node.textContent?.includes('Botão de vidro'));
    act(() => { valid?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    clickButton('Usar esta opção');
    expect(slot.onSelect).toHaveBeenCalledWith(['ok']);
  });

  it('mostra Sortear indisponível com motivo e só oferece rerrolagem depois do resultado', async () => {
    const blocked = props({ sortReason: 'Sorteio uniforme não autorizado nesta sessão.' });
    await render(<ChoiceSlot {...blocked} />);
    expect(text()).toContain('Sorteio uniforme não autorizado nesta sessão.');
    clickButton('Sortear');
    expect(blocked.onRoll).not.toHaveBeenCalled();
    const ready = props({
      uiState: 'preview',
      strategy: 'uniform-eligible-unofficial',
      preview: { label: 'Botão de vidro (fictício)', confirmed: false },
      canReroll: true,
      rollTrace: { expression: '1d3', faces: [2], total: 2, table: 'lista fictícia (não oficial)', source: 'adapter demonstrativo', seed: 'sessao-l0', rerollIndex: 0 },
    });
    await render(<ChoiceSlot {...ready} />);
    expect(host.querySelector('[data-strategy="uniform-eligible-unofficial"]')?.textContent).toBe(STRATEGY_BADGE['uniform-eligible-unofficial']);
    expect(text()).toContain('prévia — não confirmada');
    expect(text()).toContain('Botão de vidro (fictício)');
    clickButton('Confirmar');
    expect(ready.onConfirmPreview).toHaveBeenCalledOnce();
    clickButton('Descartar prévia');
    expect(ready.onDiscardPreview).toHaveBeenCalledOnce();
    clickButton('Rolar novamente');
    expect(ready.onReroll).toHaveBeenCalledOnce();
  });

  it('mantém a prévia revisável e bloqueia Confirmar com motivo sem impedir o descarte', async () => {
    const slot = props({ uiState: 'needs-review', preview: { label: 'Proposta anterior', confirmed: false }, confirmReason: 'A proposta deixou de ser elegível.' });
    await render(<ChoiceSlot {...slot} />);
    const confirm = [...host.querySelectorAll('button')].find(button => button.textContent === 'Confirmar')!;
    expect(confirm.getAttribute('aria-disabled')).toBe('true');
    expect(document.getElementById(confirm.getAttribute('aria-describedby')!)?.textContent).toBe(slot.confirmReason);
    clickButton('Confirmar');
    expect(slot.onConfirmPreview).not.toHaveBeenCalled();
    expect(text()).toContain('Proposta anterior');
    clickButton('Descartar prévia');
    expect(slot.onDiscardPreview).toHaveBeenCalledOnce();
  });

  it('fecha o painel com Esc e escreve cada badge de estratégia', async () => {
    await render(<ChoiceSlot {...props()} />);
    clickButton('Escolher manualmente');
    expect(text()).toContain('Fechar (Esc)');
    await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
    expect(text()).not.toContain('Fechar (Esc)');
    for (const strategy of Object.keys(STRATEGY_BADGE) as Strategy[]) {
      await render(<ChoiceSlot {...props({ strategy, uiState: 'confirmed', selectedIds: ['ok'] })} />);
      expect(host.querySelector(`[data-strategy="${strategy}"]`)?.textContent).toBe(STRATEGY_BADGE[strategy]);
    }
  });

  it('não chama a escolha parcial de confirmado e separa trava de sorteio', async () => {
    await render(<ChoiceSlot {...props({
      uiState: 'partial',
      strategy: 'manual',
      cardinality: { min: 2, max: 2 },
      selectedIds: ['ok'],
      options: [
        { id: 'ok', label: 'Primeira opção fictícia', eligible: true },
        { id: 'ok-2', label: 'Segunda opção fictícia', eligible: true },
      ],
    })} />);
    expect(host.querySelector('[data-slot-state="partial"]')?.textContent).toBe('parcial');
    expect(host.querySelector('[data-slot-state="confirmed"]')).toBeNull();
    const locked = props({ locked: true, uiState: 'locked', selectedIds: ['ok'], strategy: 'manual', sortReason: 'Slot travado. Destrave para sortear. Travar não executa rolagem.' });
    await render(<ChoiceSlot {...locked} />);
    expect(text()).toContain('travado');
    expect(text()).toContain('Travar não executa rolagem.');
    clickButton('Escolher manualmente');
    expect(locked.onManualOpen).not.toHaveBeenCalled();
    expect(text()).not.toContain('Fechar (Esc)');
    expect(text()).toContain('Slot travado. Destrave para alterar.');
    clickButton('Sortear');
    expect(locked.onRoll).not.toHaveBeenCalled();
    clickButton('Destravar');
    expect(locked.onToggleLock).toHaveBeenCalledOnce();
  });
});
