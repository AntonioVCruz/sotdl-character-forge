# Contrato consumível de tabelas e equipamentos Human L0 — versão 1.0.0

Entrega da atividade 2 da [#34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34). Identificador: `sotdl.human-l0.consumable`. Versão: `1.0.0`. Implementação: `packages/curation/human-l0-consumable.ts`.

Este contrato é novo. Não edita os 16 arquivos do congelamento de curadoria `1.0.0`, não altera a semântica de `sotdl.human-l0.mechanics@1.0.0` e não reescreve a projeção mecânica local `0.2.0`. Não promove revisão, não marca pack real como fictício e não habilita ruleset. Atividades 3–8 permanecem abertas: não há lote Core, Only Human, Oddities ou catálogo, nem compilador, handler de runtime ou UI.

A matriz da atividade 1 ([`matriz-lacunas-issue34-atividade1.json`](matriz-lacunas-issue34-atividade1.json)) é dependência de leitura. `sourceVersion` continua `null`. O fechamento `act1-local-hash-check` continua aberto e não bloqueia esta fixture sintética.

## Gate

`PackSchema.parse` / `validatePack` continuam o envelope genérico. Eles não validam o que esta versão passa a exigir:

- peso publicado por faces do dado, em vez de sorteio uniforme de linhas;
- colunas com rolagem própria;
- cauda aberta sem peso inventado para o modificador;
- consulta que reutiliza um resultado anterior e não cria dado;
- subtabela, ciclo publicado e limite de recursão que devolve pendência;
- side roll com fase, sujeito e proibição de disparar na posse;
- preço desconhecido distinto de zero;
- Defense só por substituição, e só ao equipar ou empunhar;
- consequência que é um efeito tipado ou uma pendência tipada.

O gate específico é `parseHumanL0Consumable`. `parseHumanL0ConsumableResolution` só confere o formato de consumo: contexto, resultado e uma lista de efeitos ou pendências. Os dois recusam `rolled: true` no caso da resolução, `rulesetEnabled: true` e revisão `curated`. Nenhum dos dois rola dado, aplica efeito ou importa pack.

A versão `1.0.0` só aceita documento `distribution: public-synthetic` com `fictionalData: true`, `reviewStatus: needs-review`, `importablePack: false` e `promotesReview: false`. Um lote real futuro precisa de versão nova ou evolução explícita. Não entra por este gate.

## Compatibilidade declarada

| Peça preservada | Versão que este contrato exige |
|---|---|
| Congelamento de curadoria | `1.0.0`, 16 arquivos |
| Contrato mecânico | `sotdl.human-l0.mechanics@1.0.0` |
| Projeção mecânica local | `0.2.0` |
| Semântica mecânica | `semanticsUnchanged: true` |

`mechanics-semantics-changed` e `mechanics-contract-mismatch` recusam um documento que alegue o contrário.

## Referência e evento

Toda referência guarda `publicationId`, `version`, `entityId`, `resultId` e `componentId`. Em `1.0.0`, `version` é `null`: a matriz não tem revisão de fonte confirmada, e o contrato não inventa edição.

A chave de origem é `publicationId@null/entityId/resultId/componentId`. Eventos repetidos com a mesma chave, o mesmo sujeito e a mesma fase são `duplicate-origin`. Isso identifica a aplicação; não executa o procedimento da #35.

## Formas

| Forma | Regra do gate |
|---|---|
| Faixa com peso | `publishedWeight.basis` é `natural-dice-faces`. `ways` / `denominator` repetem a enumeração do dado da coluna. Outra base é `uniform-row-weight`. Divergência em faixa fechada é `weight-mismatch`. |
| Colunas independentes | Cada coluna tem `rollId` próprio. Repetir o id é `shared-column-roll`. Não há campo de face compartilhada. |
| Cauda aberta | `open-low` tem `min: null`; `open-high` tem `max: null`. O peso conta só os totais naturais. Acrescentar peso de modificador é `open-tail-weight-invented`. A coluna declara domínio `authorized` ou `pending` / `open-tail-domain`. O domínio não entra na conta. |
| Consulta | `kind: lookup`, `dice: null`, `reads.queryId` aponta para `producedQueries`. Dado na consulta é `lookup-has-dice`. Consulta sem resultado anterior é `lookup-missing-prior`. |
| Subtabela | Efeito `follow-subtable` só em linha de tabela. Alvo ausente é `subtable-missing`. Ciclo só passa se cada tabela do ciclo tiver `publishedCycle: true`. No limite, `onLimit` é `pending` com razão `bounded-recursion`. Rerrolagem ou descarte são `recursion-reroll-forbidden` e `recursion-discard-forbidden`. |
| Side roll | Fase `creation`, `equip` ou `use`, dado e `rollId` distintos da coluna. `appliesOnPossession: true` é `side-roll-on-possession`. Sujeito `relative` com efeito de personagem é `relative-is-not-character`. Fase trocada é `side-roll-phase-mismatch`. |

Os quatro ciclos publicados `only-human:character-fate`, `only-human:piety`, `only-human:siblings` e `only-human:strange` ficam em `unprojectedPublishedCycles` com `projected: false`. Projetá-los aqui seria a atividade 4.

## Efeito ou pendência

Cada consequência é `{ kind: "effect", effect, pending: null }` ou `{ kind: "pending", effect: null, pending }`. Os dois campos preenchidos falham o schema. Não há texto livre de regra, excerto ou efeito inferido do nome: objetos são estritos e rótulos sintéticos não têm espaço.

Efeitos fechados: `grant-language`, `grant-profession`, `grant-item`, `grant-currency`, `substitute-defense`, `follow-subtable`, `narrative-marker`, `record-price`.

`grant-item` carrega `possession: carried` e `usageApplied: false`. `usageApplied: true` é `possession-applies-use`. `grant-currency` exige bits iguais a `moneyToBits`.

`substitute-defense` só com `mode: substitute`. `add` ou `stack` é `defense-not-substitution`. A fase é `on-equip` quando `when` é `equipped`, ou `on-use` quando `when` é `wielded`. No perfil do item, a posse não recebe esse efeito (`defense-on-possession`). Armadura declara o efeito em `onEquip` e a posse fica pendente `possession-is-not-use`. Arma faz o mesmo em `onUse`. Perfil `generic` não ganha estatística (`generic-profile-has-stats`).

Preço `exact` ou `minimum` guarda amount, denominação e bits conferidos. Preço `unknown` ou `variable` deixa amount, denominação e bits nulos e a consequência do preço é pendência `unknown-price`. Qualquer zero ou valor nesse preço é `unknown-price-not-zero`.

Pendência guarda `retainsConsequence: true`. A consequência manual não é apagada.

## Bloqueios que o documento tem de repetir

| Id | Contagem | Efeito neste contrato |
|---|---:|---|
| `act1-local-hash-check` | 258 | `blocksSyntheticFixtures: false`. Evidência `declared-hash-not-recomputed`. Marcar o bloqueio como impeditivo da fixture é `hash-check-blocks-synthetic`. |
| `act3-act5-grouped-local-only` | 350 | `linkedDefinition: local-only` e `individualEvidence: false`. Não é evidência de linha. |

Os 350 se dividem em 36 opções de profissão Core ainda agrupadas (atividade 3: martial 12, religious 7, wilderness 17) e 314 registros de catálogo (atividade 5: 57 `class:source-grant-only`, 182 `class:exact-definition-refs`, 75 `class:generic-editable-refs`). Cada grupo entra como pendência, com `weights: null`. Peso nesse grupo é `unextracted-range-has-weights`. Efeito no lugar da pendência é `local-only-has-effect`. Tratar o grupo como definição individual é `grouped-as-individual-evidence`.

As três categorias Core continuam sem inícios de faixa reextraídos. O contrato não inventa esses pesos. A razão das três é `range-starts-not-reextracted`. A razão do catálogo agrupado é `catalog-group-not-individual`.

## Dezesseis resoluções manuais

A matriz tem 16 registros `selecionado-manual`. O documento lista os mesmos ids, cada um só como pendência. Escolha traz os candidatos já apontados pela matriz, com `resolvedItemId: null`. Preencher um candidato é `choice-resolved-early`. O fallback `extra:major-windfall-1-fallback` permanece `local-only`, sem efeito.

| Id da matriz | Razão |
|---|---|
| `finding:death-multiplicity` | `manual-procedure` |
| `finding:dimension-order` | `manual-composition` |
| `finding:external-dependencies` | `conditional-manual` |
| `finding:outer-category-choice` | `manual-category-choice` |
| `finding:recursion` | `bounded-recursion` |
| `extra:major-windfall-1-fallback` | `conditional-branch` |
| `item-ref:grant:core:kit:wealthy/grant/special/shield/shield` | `choice-required` |
| `item-ref:.../costume/costume` | `choice-required` |
| `item-ref:.../dress/dress` | `choice-required` |
| `item-ref:.../military:r03/grant/spear` | `choice-required` |
| `item-ref:.../wilderness:r17/grant/spear` | `choice-required` |
| `language:dead-languages` | `open-category-language` |
| `language:secret-language` | `open-category-language` |
| `procedure:dimension-composition` | `no-extra-life-rolls` |
| `procedure:expanded-free-appearance` | `player-fields` |
| `procedure:partial-literacy` | `partial-literacy` |

Os ids longos de escolha estão por extenso na fixture e em `MANUAL_RESOLUTION_SLOTS`. A tabela acima abrevia o meio para leitura. O gate compara o id inteiro.

## Fixture

`curation/examples/human-l0-consumable.synthetic.json` é o documento válido: fontes, rótulos e valores inventados. `curation/examples/human-l0-consumable.rejections.json` aplica remendos que o gate recusa. Nenhum dos dois é pack importável nem texto de livro.

Os testes em `tests/curation-human-l0-consumable.test.ts` cruzam as contagens 258, 350, 36, 314 e os 16 ids com a matriz. Também revalidam a fixture mecânica sintética e o stub real `0.1.0` (`fictionalData: false`, `needs-review`).

## Fora desta versão

- Atividade 1 segue aberta até recomputar os hashes locais.
- Atividades 3, 4 e 5 projetam os lotes. Atividades 6, 7 e 8 compilam, integram handlers e fazem o aceite.
- Não há promoção `needs-review` → `curated`, `fictionalData: true` em pack real, nem `rulesetEnabled: true`.
