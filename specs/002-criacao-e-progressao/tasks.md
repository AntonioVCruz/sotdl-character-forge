# TASKS-002
Entrega parcial 0–1: `docs/entrega-nivel-um.md`. A SPEC não está concluída para níveis 2–10 e ancestralidades excepcionais.
- [ ] T001 Definir Character, CharacterEvent, ChoiceSlot e EligibilityResult.
- [ ] T002 Implementar reducer determinístico por evento e nível (AC-002/003).
- [ ] T003 Implementar seleção guiada de ancestry, path e progressão (AC-001).
- [ ] T004 Implementar dependências, desfazer e alertas (AC-004).
- [ ] T005 Implementar flags de regras opcionais para escolha inicial (AC-005).
- [ ] T006 Testar personagem com progressão padrão e outro com ancestry excepcional (AC-002/006).

- [ ] T007 Definir metadados do slot para escolha aleatória/manualmente (AC-007/008).
- [ ] T008 Integrar comando `rollChoiceSlot` à validação e reprocessamento com dependentes (AC-009).

## Fatia demonstrativa 0–1 validada
- [x] Dois caminhos fictícios e duas escolhas de treinamento exclusivas por caminho.
- [x] Slots sequenciais com elegibilidade compartilhada manual/aleatória, nível de aquisição e dependências (parcela T001/T002/T003/T007/T008).
- [x] Revisão de ancestry/caminho, travas, alertas e restauração de escolha anterior (T004 no subconjunto).
- [x] Reversão 1→0→1 sem perder histórico ou acumular benefícios.
- [x] Migração JSON v1→v2, roundtrip e E2E dos caminhos marcial/mágico.

T002/T006 continuam pendentes para cronogramas gerais e ancestry excepcional; T005 continua pendente para regras opcionais reais.
