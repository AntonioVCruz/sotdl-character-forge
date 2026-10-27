# TASKS-009 — critérios de aceite AC-001..014
Fatias 0–1 entregues: `docs/entrega-nivel-zero.md`, `docs/entrega-nivel-um.md` e `docs/entrega-magias-demo.md`. T001/T005/T008/T011 permanecem abertos porque incluem progressão/escopo além dos oito slots demonstrativos (dois condicionais ao caminho mágico).
- [ ] T001 `ChoiceSlotGraph` sequencial e rastreável para criação 0→10 (AC-005/009/011).
- [x] T002 Elegibilidade compartilhada em `planSlots` para manual e random no subconjunto 0–1 (AC-001/004/005 parcial).
- [x] T003 Política por slot (manual/random/locked), seed, substreams e rerollIndex (AC-002/006/013; slots opcionais não existem nesta fatia).
- [x] T004 `chooseSlot` com source-table/demo-table/uniform-eligible claramente rotulados (AC-003/004).
- [ ] T005 Implementar `generateCharacterToLevel` com slots opcionais/obrigatórios/pendências, sem tentativas ilimitadas (AC-005/007/012).
- [x] T006 Preview transacional; cancelar vs confirmar; locks e revalidação de background/caminho/treinamento (AC-008/009 nos níveis 0–1).
- [x] T007 UI dos oito slots, incluindo tradição/magia condicionais: selecionar, sortear, refazer, rastrear dado/fonte e restaurar escolha anterior elegível (AC-001/002/014).
- [ ] T008 UI «Gerar tudo» com nível-alvo, regras, fontes, filtros e fallback (AC-005/007/012).
- [ ] T009 Integração de choices mágicos sequenciais e regra opcional de troca (AC-011).
- [x] T010 Persistir/exportar registros de geração + testes de replay sem novos sorteios (AC-006/010; JSON, sem HTML/PDF).
- [ ] T011 E2E manual/híbrido/tudo-aleatório, replay, locks, reroll, no candidates, cancel (AC-001..014).

T009 parcial: aprendizado sequencial de tradição e magia rank 0 implementado no caminho fictício; regra opcional de troca e múltiplas escolhas mágicas permanecem pendentes.
