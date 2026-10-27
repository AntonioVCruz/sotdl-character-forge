# TASKS-005
Painel de sessão demonstrativo: `docs/entrega-sessao-demo.md`. Marcas gerais permanecem abertas para escopo completo da SPEC.
- [ ] T001 Criar componentes stat com breakdown e avisos (AC-001/003).
- [ ] T002 Criar toggles de equipamentos/efeitos e controle de duração (AC-002).
- [ ] T003 Criar seções condicionais da ficha e cards (AC-004).
- [ ] T004 Criar visualização/edição e suporte a retrato (AC-006).
- [ ] T005 Criar estilos A4 e responsivos (AC-005).
- [ ] T006 Testes: mesmo stat em seções diversas, forma temporária, print.

- [ ] T007 UI sortear/rerrolar em todos os slots (AC-008).
- [ ] T008 Criar preview/aceite de geração completa e híbrida com locks (AC-009/010).
- [ ] T009 Exibir trace e origem sem sortear durante render (AC-011).

## Fatia de sessão entregue
- [x] Painel de efeitos com origem, duração, condição, escopo, modificador e comandos de ativar/encerrar (T002 no subconjunto de magias fictícias).
- [x] Ficha e breakdown atualizam após ativar/encerrar/descansar (parcela T001/T003).
- [x] E2E com reabertura, suspensão por fonte e largura móvel (parcela T006; impressão/forma temporária permanecem pendentes).

## Fatia de impressão A4 entregue
- [x] Ficha imprimível recebe o mesmo `CharacterView` confirmado; características, recursos, aprendizado, efeitos, pendências e breakdown (parcela T001/T003).
- [x] CSS A4, quebras naturais, notas longas e cabeçalho de tabela repetido; prévia de leitura responsiva (T005 no subconjunto sem retrato).
- [x] E2E de valores, estado preservado, fonte ausente, layout branco e PDFs renderizados/inspecionados (parcela T006; forma temporária ainda pendente).

Evidências: `docs/entrega-impressao-a4.md`.

## Fatia de inventário entregue
- [x] Painel compartilhado com quantidade 1, fonte, estado e ações de equipar/guardar; política de soma fictícia visível (parcela T002/T003).
- [x] Estado e modificadores efetivos na ficha, breakdown e PDF; testes com magia ativa e reload.

Evidências: `docs/entrega-equipamento-demo.md`.
