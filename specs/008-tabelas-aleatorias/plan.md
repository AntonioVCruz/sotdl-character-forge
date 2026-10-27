# PLAN-008 — Random Tables Engine

## Pacotes e interfaces
`packages/random-tables` (TypeScript puro) depende de `packages/catalog` somente por interface tipada; não conhece React nem ficha.

- `DiceExprParser`: AST para contagem+faces+modificador; erro para sintaxe não homologada.
- `SeededRng`: PRNG versionado e com substream por chave estável, usando inteiros uniformes sem viés para faces.
- `TableValidator`: domínio alcançável de `NdM+K`, cobertura, overlaps, referências, escopo, cycles, status e autorização de origem.
- `RollResolver`: dado→faces→total→outcome→chained table/quantity→typedEvents/pendência.
- `RandomTrace`: registra decisão, seed/subseed, PRNG version, sourceRef/page, versão do pack, faces, total, outcome, parentRollId, rerollIndex.

## Orquestração
1. Receber `TableRequest{tableId, context, ruleset, seed, slotId, rerollIndex}`.
2. Verificar enablement e aplicabilidade, curadoria completa e referências sem conflito.
3. Obter substream; lançar expressão da fonte e mapear ranges.
4. Resolver nextTable/sideRolls por IDs, com limite de profundidade e prevenção de ciclos.
5. Produzir `ResolvedTableOutcome{trace, selectedOutcome, typedEvents, manualAdjudication}`.
6. Não tocar em Character persistido; o gerador aplica eventos em transação (SPEC-009).

## Decisões de engenharia
- Com `3d6`, a tabela define ranges de soma; não é permitido escolher range uniformemente.
- `uniformEligible` é serviço **distinto** fora do resolver de tabelas e usa candidatos pré-filtrados por elegibilidade.
- Não usar JS arbitrário nos packs. Registradores de efeitos tipados suportados por versão.
- Guardar rolagens resolvidas no log; export e refazer cálculo usam logs, não reexecutam RNG.
- Fixtures de JSON do diretório `examples` são **inventadas e rotuladas**, não dados oficiais.

## Entrega da fatia
Teste isolado para `3d6`, tabela `d6→d20`, distribuição por range, consulta de fontes, quantia complementar, log e erro de tabela incompleta.
