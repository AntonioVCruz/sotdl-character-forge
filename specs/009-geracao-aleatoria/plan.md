# PLAN-009 — Orquestrador para Random/Hybrid/Auto-all

## Design
`packages/character-generator` (TypeScript puro) recebe `Ruleset`, `Registry`, `Character` atual, política de geração e `SeededRng`. Reutiliza `ChoiceSlotPlanner`, `EligibilityService`, `ProgressionReducer` e SPEC-008.

## Etapas
1. Gerar `ChoiceSlotGraph` com IDs estáveis e ordenados por dependência/nível; incluir slots especiais das ancestries e classes poderosas.
2. Definir modos por slot: manual, random, lock; compor regras de campanha, books enablement, pools, rank, options e outros filtros.
3. Percorrer slots pendentes em ordem; `official-table` se disponível/curada; caso contrário `uniform-eligible` somente com política autorizada; sem dados, `unresolved`.
4. A cada escolha, aplicar `CharacterEvent` **provisório**, recalcular próximos slots/eligibilidade; lidar com rolls de side-effect e novas escolhas encadeadas.
5. Montar `GenerationDraft` com `RollEvents`, `ChoiceEvents`, warnings, conflicts e `fullyResolved`.
6. Tela de preview oferece editar/lock/rerroll por slot, «Regerar campos livres», «Confirmar», «Cancelar», exportar log.
7. Ao confirmar, persistir eventos em transação e produzir `CharacterView` via motor puro, preservando o histórico.

## Interfaces
```ts
function generateSlot(input: { slotId: string; characterDraft: Character;
  ruleset: Ruleset; policy: GenerationPolicy; rerollIndex: number }): SlotProposal;
function generateCharacterToLevel(input: { character: Character;
  ruleset: Ruleset; targetLevel: number; policy: GenerationPolicy }): GenerationDraft;
function commitDraft(draft: GenerationDraft, current: Character): Character;
```

## Ordem sugerida de implementação
- Fazer um slot narrativo de `d20` + um slot de escolha elegível funcionar manual/roll.
- Em seguida suportar wealth `3d6`, tabela aninhada e efeitos mecânicos.
- Expandir geração 0→1 com locks, preview e cancelamento.
- Depois 0→10, progressões excepcionais, talentos, tradições/spells e substituição sequencial.

## Restrições
- Não usar loops de tentativas ilimitadas para achar build válida. Se tabela produz resultado que precisa escolha especial, mostrar pendência/resultado original.
- Não confundir «escolha aleatória de classe» com «tabela publicada de classes» caso esta não exista no conteúdo validado.
- Seed e hash estável de slot+rerollIndex geram substreams; alterações sem dependência não mudam outras etapas.
- Nenhum recurso de interface executa efeitos de regra diretamente.
