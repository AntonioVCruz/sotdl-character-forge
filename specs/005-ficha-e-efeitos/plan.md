# PLAN-005
Separar `CreatorWizard`, `CharacterDashboard`, `EffectsPanel`, `StatBreakdown` e `PrintableSheet`. Renderizar com `CharacterView`, sem fórmulas em JSX. Esquemas de seção definem template da ficha. Estilo alternável entre minimalista e pergaminho inspirado na Liliana; A4 com quebras explícitas e `@media print`.

## Complemento v0.2
Componentes `ChoiceSlotPicker`, `RollTracePopover`, `GenerationSetup`, `GenerationPreview`, `GenerationConflictResolver`. Não criar PRNG em React; chamadas explícitas a commands. Cards de resultados devem anunciar sourcePage + dice roll + estratégia e permitir keyboard/undo.
