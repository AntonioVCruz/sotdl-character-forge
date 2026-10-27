# PLAN-003
Pipeline: reconstrução permanente→inventário equipado→resolução de forma→efeitos temporários→contexto de ação→valores derivados→validação/caps→breakdown. Modificadores declarativos com AST tipada e grupos de stack, sem eval. Para mecânicas complexas, handlers nomeados versionados, cada um acompanhado de testes de fonte. Conter recalculo em pacote TypeScript puro com selector memoizado na UI.

## Complemento v0.2
Consumir outcomes já resolvidos pelo `packages/random-tables`; separar `RollEvent` de `calculateCharacter`. Effects dos outcomes seguem o mesmo catálogo/stacking/trace de uma escolha manual. Executar snapshots de ficha pré/pós-roll sem alterar valores base indevidamente.
