# TASKS-003
Subconjuntos demonstrativos entregues em `docs/entrega-nivel-zero.md`, `docs/entrega-nivel-um.md` e `docs/entrega-sessao-demo.md`. Operações/condições/transformações gerais ainda não concluídas.
- [ ] T001 Implementar `calculateCharacter` e trace (AC-001).
- [ ] T002 Implementar operações `add/set/multiply/capMin/capMax` e condições tipadas (AC-004).
- [ ] T003 Resolver stacking, fases, dependências e evitar circularidade (AC-004/008).
- [ ] T004 Implementar equipamento e contexto de ataque (AC-002/007).
- [ ] T005 Implementar ativação/duração/forma e rollback (AC-003/006).
- [ ] T006 Implementar warnings de resolução manual (AC-005).
- [ ] T007 Testar 100 toggles, múltiplas fontes, combate e transformações (AC-001..008).

- [ ] T008 Integrar outcomes de tabelas convertidos em CharacterEvent tipado (AC-009).
- [ ] T009 Proibir RNG em `calculateCharacter`; testar replay de efeito quantitativo (AC-010/011).

## Fatia de efeitos de sessão
- [x] Recalcular modificadores temporários aditivos com fonte e breakdown, sem mutação da base (parcela T001).
- [x] Ativar/encerrar, instância única por magia e duração até encerramento/descanso (parcelas T003/T005).
- [x] Suspender efeitos com fonte/versão/aprendizado indisponível e informar diagnóstico (parcela T006).
- [x] Testar 100 ciclos sem drift, quatro definições fictícias, roundtrip e fontes ausentes (parcela T007; combate/transformações continuam pendentes).

## Fatia de equipamento entregue
- [x] Equipar/guardar o item confirmado sem alterar base ou evento de criação, com soma explícita aos efeitos mágicos (parcela T003/T004; ataques e stacking geral pendentes).
- [x] Validar origens, histórico, 100 ciclos, ordem dos modificadores e preservação no descanso (parcela T007).

Evidências: `docs/entrega-equipamento-demo.md`.
