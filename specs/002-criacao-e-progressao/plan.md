# PLAN-002
Criar `Character` orientado a `levelEvents[]` e um `ProgressionReducer` puro. UI em etapas (ancestry, base, novice, expert, master, level choices) alimentada por `ChoiceSlot` de dados estruturados. `EligibilityService` retorna decisão e razões, sem tocar na interface. Snapshot derivado após cada evento; desfazer por transação com revisão de dependências.

## Complemento v0.2
`ChoiceSlot` expõe `selectionStrategies`, `tableRefs`, `validCandidates`, `slotDependencies`, `locked`, `status`. Ancestries derivadas/powerful e variantes criam seus slots declarativamente. Slot não equivale a uma tabela: podem existir sorteios mecânicos mesmo sem tabela publicada.
