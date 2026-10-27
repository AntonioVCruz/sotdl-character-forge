# SPEC-005 — Ficha dinâmica e painel de efeitos
**Status:** Draft. **Prioridade:** P1. **Requisitos:** RF-005, RF-008, RF-009.

## Inspiração
HTML de Liliana: 14 páginas, retrato, estatísticas, magias, talentos, grimórios e painel de 31 efeitos. Reproduzir **a função** e a estética opcional, não copiar 14 páginas fixas para todos os personagens.

## Aceitação
AC-001: mudar qualquer `CharacterView` relevante atualiza todas as ocorrências do número, inclusive cartões, sem consultar regras na UI.
AC-002: painel de efeitos mostra fonte, duração, condição, alcance/escopo, valor afetado e toggle.
AC-003: o usuário vê os componentes do cálculo de Defense, Health, ataque etc., incluindo caps e avisos.
AC-004: widgets e páginas surgem apenas quando há dados (grimórios, summons, cards).
AC-005: layout A4 é legível na impressão; UI de criação responsiva é independente do A4.
AC-006: modo visualização bloqueia alterações e modo edição atualiza campos narrativos.
AC-007: uma transformação ativa tem destaque e pode ser removida sem perder os dados originais.

## Aditivo v0.2 — interface de sorteios
**AC-008:** todo passo do wizard com ChoiceSlot oferece «Escolher» e «Sortear», «Rolar novamente», origem e dados utilizados; se não há tabela, indicar claramente seleção aleatória entre opções válidas.
**AC-009:** ação global «Gerar tudo aleatoriamente» abre configuração (ruleset, nível, filtros e locks) e preview de todas as decisões + pendências antes de confirmar.
**AC-010:** geração híbrida permite travar etapas já escolhidas e sortear apenas as não travadas, sem alterar decisões anteriores independentes.
**AC-011:** modo de visualização apresenta selo textual legível `manual / tabela publicada / pool elegível`, não altera valores ao abrir ficha.
