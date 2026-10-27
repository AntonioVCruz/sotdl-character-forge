# TASKS-004
Entrega parcial fictícia de nível 1: `docs/entrega-magias-demo.md`. As tarefas gerais continuam abertas para conteúdo real, castings, swaps opcionais e progressão completa.
- [ ] T001 Modelar tradição, rank, spell publication entry, learned spell event.
- [ ] T002 Implementar slots de aprendizado e elegibilidade em ordem (AC-002/003).
- [ ] T003 Implementar replacement opcional com reprocessamento (AC-004/005).
- [ ] T004 Implementar estado de usos e filtros (AC-001/006).
- [ ] T005 Integrar textos e effects; marcar casos manuais (AC-007).
- [ ] T006 Testes: 2 escolhas no mesmo nível, swap permitido/proibido, conflitos de fontes.

- [ ] T007 Sortear tradições/spells conforme `EligibilityService` por slot (AC-008/010).
- [ ] T008 Testar geração nível 0–10 com choices sequenciais e swaps no mesmo nível (AC-009).

## Fatia demonstrativa entregue
- [x] Duas tradições fictícias e quatro magias rank 0 com identidade/fonte/versionamento (parcela T001).
- [x] Tradição seguida de magia elegível; candidatos compartilhados entre manual e sorteio autorizado (T002/T007 no subconjunto).
- [x] Troca de tradição preserva magia incompatível e histórico; revisão explícita registra substituição (parcela T003, sem regra opcional de livro).
- [x] Grimório com texto, rank, fonte e resolução manual de conjuração/efeitos (parcela T005).
- [x] Testes de ordem, locks, rank/caminho, fonte desabilitada, reprodução, JSON e E2E manual/híbrido (parcela T006/T008).
- [x] Usos demonstrativos por descanso separados do aprendizado e preservados na sessão (T004/AC-006 parcial; regras oficiais de castings pendentes). Evidências em `docs/entrega-sessao-demo.md`.
