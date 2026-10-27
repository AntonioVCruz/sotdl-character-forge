# TASKS-006
Sessão demonstrativa persistida: `docs/entrega-sessao-demo.md`. HTML/PDF e migrações gerais permanecem pendentes.
- [ ] T001 Adapter local, validação e migração de schema (AC-001/003).
- [ ] T002 Export/import JSON com checagem de versão dos packs (AC-002/007).
- [ ] T003 Export HTML de visualização sanitizado (AC-004/006).
- [ ] T004 CSS print e fluxo `window.print()` para PDF (AC-005).
- [ ] T005 Testes: round-trip, corrompido, pack ausente, snapshot visual A4.

- [ ] T006 Contratos e migrações para rollEvents e generationMetadata (AC-008/010).
- [ ] T007 Round-trip e export sem consumo de RNG (AC-008/009).

## Fatia de sessão entregue
- [x] Default de sessão vazia para arquivos anteriores, validação do log e gravação IndexedDB transacional (parcela T001).
- [x] JSON preserva consumo de conjurações e efeitos solicitados como ativos, sem reexecutar comandos (parcela T002).
- [x] Testes de roundtrip, reabertura, referência futura, sequência inválida e fonte ausente (parcela T005/T007).

## Fatia A4/PDF entregue
- [x] T004 CSS de impressão A4 e fluxo `window.print()` com ficha confirmada e paginação (AC-005).
- [x] PDFs de nível 0, nível 1/efeito ativo e fonte ausente, com validação A4/texto e inspeção visual (parcela T005).
- [x] Exportação por impressão sem comandos ou novos sorteios, preservando JSON e valores (parcela T007/AC-009).

Evidências: `docs/entrega-impressao-a4.md`. T003 (HTML exportável) permanece pendente para a próxima fatia.
