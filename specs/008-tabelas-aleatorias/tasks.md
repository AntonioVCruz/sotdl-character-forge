# TASKS-008 — critérios de aceite AC-001..011
Entrega demonstrativa detalhada em `docs/entrega-nivel-zero.md`. Marcas abaixo limitam-se aos contratos suportados, não à curadoria do Core.
- [x] T001 Contratos Zod de tabela, dados, outcomes, nextTable, sideRoll e traces (AC-007/011; efeitos fora do subconjunto suportado geram pendência).
- [x] T002 PRNG versionado e `uniformInt` sem viés + substreams estáveis, seed e rerollIndex (AC-001/006).
- [x] T003 `rollDice` para `NdM+K`; testes exatos de domínio, soma e distribuição 3d6 (AC-001/002).
- [ ] T004 `TableValidator`: ranges, abrangência, referências, cycles, condições e enabled packs (AC-005/007/009).
- [x] T005 `resolveTable` + encadeamentos/secondary rolls + logs pai-filho (AC-003/004).
- [x] T006 Converter outcomes a eventos tipados aditivos/recurso; fallback pendência quando falta handler (AC-008/011).
- [x] T007 Relatório da diferença `official-table`, `demo-table` e `uniform-eligible` (AC-010).
- [x] T008 E2E de mesa de testes fictícia, nenhuma mutação no cálculo da ficha (AC-006/008).
- [ ] T009 Curar **metadados e testes** das primeiras tabelas do Core com a página/edição; registrar pendências de conteúdo/autorizações (AC-005/007).

T004 parcial: ranges, referências, ciclos, contexto slot/ancestry e enabled packs implementados; ASTs condicionais gerais permanecem bloqueadas com diagnóstico.
