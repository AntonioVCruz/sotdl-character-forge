# Modelo lógico e contratos iniciais

## Entidades
- `ContentSource`: id, título, edição, revisão, página, arquivo de origem, licença/status.
- `ContentPack`: packId, version, system, dependencies, entities[], hash opcional.
- `RuleEntity`: id imutável, categoria (`ancestry`, `path`, `spell`, `item`, `trait`, `condition`, `creature`, `rule`), sourceRef, variantKey, mechanics, text.
- `Ruleset`: packs habilitados com versão, overrides selecionados, opções/houseRules, precedence.
- `Character`: schemaVersion, ID, nome, portrait ref, ruleset snapshot, levelEvents[], inventory[], activeEffects[], resources, notes.
- `CharacterEvent`: ID, sequência, nível, escolha, origem e evento substituído.
- `EffectInstance`: ID, effectDefinitionRef, owner, enabled, duration/expiry, selected targets, context.
- `CalculationTrace`: valor final, operações na ordem efetiva, avisos e referências.

## Invariantes obrigatórios
1. Chaves de conteúdo consideram publicação e variante, não só nome.
2. Não sobrescrever dados de Core com republicações posteriores silenciosamente.
3. Importar pack não implica habilitar seu uso em uma campanha.
4. Se uma regra não foi formalizada, mostrar texto e `manual adjudication`; não simular cálculo inventado.
5. Nunca registrar apenas o valor final de atributo que pode ser derivado das escolhas; armazenar suas fontes/eventos.
6. `baseStats` são estáveis; spells ou equipamentos modificam a **view** por meio de instâncias e não mutações permanentes invisíveis.
7. Uma transformação substitui campos declarados, preservando os demais conforme regra da fonte e voltando ao estado pré-transformação quando termina.
8. O engine suporta cancelamento de boons/banes e regras de stacking conforme o ruleset, não uma soma indiscriminada de todos os modificadores.

## Mini-exemplo não oficial
Ver `examples/demo-pack.json`. O pacote é **fictício**, exclusivamente para teste do formato; valores não representam regras oficiais do jogo.

## JSON de salvamento (ilustrativo)
```json
{
  "schemaVersion": 1,
  "id": "character-uuid",
  "name": "Personagem de teste",
  "ruleset": {"id":"demo-ruleset","packs":[{"id":"demo","version":"0.0.1"}]},
  "levelEvents": [{"id":"e1","seq":1,"level":0,"type":"chooseAncestry","choiceId":"demo:ancestry:test"}],
  "inventory":[],
  "activeEffects":[],
  "resources":{},
  "notes":""
}
```

## Contratos adicionais v0.2 — tabelas e histórico de aleatoriedade

### `RandomTable` é uma `RuleEntity`
- Identidade: `tableId` imutável, `sourceRef`, `sourcePage`, `edition`, `variantKey`, `packVersion`, `status` (curated / needs-review / incomplete).
- Distribuição: `diceExpr` como AST (`count`, `sides`, `modifier`), `ranges` disjuntos e cobrindo todo resultado possível **ou** falha explícita de validação.
- Resultados: `outcomeId`, descrição da fonte (onde licenciado), operações mecânicas tipadas, referência a conteúdo, escolha adicional, tabela aninhada, rolagens subsequentes e pré-requisitos.
- Condições: aplicabilidade por ancestry, path, nível, campanha, fonte, edição, slot; outcomes condicionais versionados, inclusive a opção que exige intervenção de GM.
- Aleatoriedade entre **opções elegíveis** usa `ChoicePool` e não se faz passar por `RandomTable`.

### `GenerationPolicy`, `RollEvent`, `ChoiceEvent`
- `GenerationPolicy`: modo, nível-alvo, packs, filtros, política de fallback, seed, prngVersion, locks, `perSlotMode`.
- `RollEvent`: id, characterId, slotId, eventSeq, tableId, sourceRef/page, diceExpr, `faces[]`, total, outcomeId, parentRollId, PRNG+versão, seed/substream, `rerollIndex`.
- `ChoiceEvent`: escolha `manual` ou `random`, estratégia (`official-table` ou `uniform-eligible`), event/roll IDs, snapshot de elegibilidade/filtros, seleção atual, IDs substituídos quando aplicável.
- `GenerationDraft`: eventos provisórios, warnings, conflicts, unresolved; só cria `levelEvents[]` após confirmação.
- Uma reavaliação sem nova escolha não refaz rolls. `reroll` incrementa contador do slot, invalida dependentes conforme regras, registra operação em histórico (não apaga rolls anteriores), respeita locks.
- Após migração de PRNG, os **eventos já resolvidos** permanecem válidos; replays verificam escolhas gravadas, não precisam depender do RNG antigo. Regenerar com o mesmo seed/algoritmo/packs recupera a mesma sequência.

### Exemplo não oficial
`examples/demo-random-tables.json` demonstra a diferença entre `3d6` com intervalos, `d6→d20` encadeado e pool uniforme; **não representa tabelas do livro**. `examples/demo-generation-request.json` demonstra um pedido híbrido e um pedido totalmente aleatório.
