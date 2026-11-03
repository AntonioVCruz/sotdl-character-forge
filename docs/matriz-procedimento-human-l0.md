# Matriz de procedimento Human L0 — stub 0.1.0

Contrato de planejamento da [#35](https://github.com/AntonioVCruz/sotdl-character-forge/issues/35). Identificador: `sotdl.human-l0.procedure`. Versão: `0.1.0`. Implementação: `packages/character-generator/human-l0-procedure.ts`. Entrada de exposição: `exposeHumanL0Procedure`.

Este stub publica a sequência, a cardinalidade e as pendências que a [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36) pode ler. Não percorre tabelas, não rola dados, não aplica concessões e não habilita ruleset. `proceduresComplete`, `fullyResolved`, `rollsDice`, `rulesetEnabled` e `officialGenerationEnabled` permanecem falsos. Não há comando novo: `commandId` é `null` e `optionsSelectable` é falso, então o slot fica `pending` com o bloqueio estrutural `procedure.handler-absent` até a atividade 7 da #34. Referência de lote ainda não projetada fica `pending-lot`, com o bloqueio `procedure.awaits-lot`. As duas chaves não são copy final.

A base mecânica `sotdl.human-l0.mechanics@1.0.0` e o contrato consumível `sotdl.human-l0.consumable@1.0.0` não mudam de semântica. Os lotes das atividades 3–5 continuam pendentes. O fechamento `act1-local-hash-check` continua aberto e não bloqueia esta matriz.

Alinhamento de UI: comentário do Designer na #36 (passo 5 e pendências sobre consumable@1.0.0). A ordem do passo 5 sai desta matriz. Os cinco grupos abaixo não ordenam os passos.

## O que cada passo expõe

| Campo | Uso |
|---|---|
| `stepId` | Identidade estável do passo. |
| `branch` | `core`, `human-development` ou `shared`. |
| `order` | Ordem dentro do ramo ativo. É a ordem da UI. |
| `orderBasis` | `published-section` quando segue o inventário CUR-016; `dependency` quando o passo só existe depois de outro. |
| `cardinality` | `once`, `exactly`, `optional-set`, `per-subject`, `repeat-from-prior`, `per-direction` ou `unspecified`. |
| `requirement` | `required`, `optional` ou `conditional`. |
| `playerSurface` | `choice-slot` ou `pending-only`. |
| `step5Group` | Um dos cinco grupos, ou `null` quando o passo é narrativo e não cabe neles. |
| `groupsTouched` | Grupos que o passo toca. Mais de um grupo não cria ordem entre eles. |
| `dataRefs` | Id de lote da #34 (`table`, `query`, `kit`, `grant` e os demais papéis), com `availability`. |
| `pending` | `reason` do consumable@1.0.0, `pendencyKind`, `retainsConsequence: true`, `resolvedItemId: null`. |
| `issue` | Só `lookup-missing-prior` neste stub, quando o passo lê um resultado anterior que esta versão não guarda. Não é consequência retida. |
| `reviews` | `needs-review` com motivo, sem migração, com a última escolha. |
| `blocks` | `awaits-lot` e/ou `handler-absent`. |
| `roll` | Sempre `null`. |

`choice-slot` é o controle quando já existe lista publicada: o par de benefício Core, as duas fontes de Interesting Things, o subconjunto de categoria familiar já nomeado, ou os candidatos de `MANUAL_RESOLUTION_SLOTS`. `pending-only` é o restante: rolagem cujo lote ainda não chegou, grupo `act3-act5-grouped-local-only`, adjudicação sem candidatos, ou campo manual sem lista. Lista vazia não é preenchida com opções derivadas do nome do grupo.

`pendencyKind` agrupa o `pending.reason` para a #35, sem criar código novo:

| Kind | Razões usadas nesta exposição |
|---|---|
| `missing-choice` | `choice-required`, `manual-category-choice`, `open-category-language`, `player-fields` |
| `missing-or-altered-source` | `disabled-source`, `range-starts-not-reextracted` |
| `unsupported-result` | `external-branch`, `conditional-branch`, `catalog-group-not-individual` |
| `adjudication` | `manual-procedure`, `manual-composition`, `conditional-manual`, `bounded-recursion`, `partial-literacy`, `no-extra-life-rolls` |

O catálogo completo do adapter, inclusive razões que este stub ainda não emite, está em `PENDING_REASON_ADAPTER` e `ISSUE_CODE_ADAPTER`. A lista da §3 do brief fica estável. Dois pares não foram renomeados: a pendência `possession-is-not-use` convive com a recusa `possession-applies-use`; a pendência `generic-profile` convive com a recusa `generic-profile-has-stats`. Códigos de `fail()` que a §3 não nomeia estão em `UNMAPPED_GATE_CODES` e devem aparecer no fallback visível, não ser escondidos.

## Grupos do passo 5

`STEP5_GROUPS`, todos com `impliedOrder: false`:

- `profession`
- `languages-beyond-speech`
- `wealth-kit`
- `interesting-thing`
- `equipment`

A lista não é a ordem de criação. A ordem é a coluna Ordem das tabelas abaixo. Passos com `step5Group: null` (ancestrais, idade, narrativa, religião, e os demais fora dos cinco grupos) continuam na sequência. O benefício Core toca `languages-beyond-speech` e `profession` ao mesmo tempo, com `step5Group: null`, porque a escolha é exclusiva e não ordena os dois grupos.

## Política que a matriz não reabre

- Modo de atributos (`procedure:human-attributes`) fica fora da sequência de tabelas. Trocar `fixed` / `random` não altera passos nem gera `needs-review`.
- Os ramos não se empilham. Human Development substitui profissões aleatórias iniciais e riqueza Core (`developmentReplaces`) e não acrescenta o benefício Core (`implicitCoreBenefit: false`).
- O benefício `speak-language` / `random-profession` só entra com ancestry Core e ramo Core. Nos outros cinco arranjos o passo sai do plano. Se havia escolha gravada, ela vai para `needs-review` com `core-benefit-not-applicable`.
- Interesting Things é independente do ramo de ancestry. Padrão de produto: `oddities`. Alternativa publicada: `core`. Fonte ausente: `disabled-source`, sem trocar para o outro seletor. A escolha mora em `shared.interesting-source` e sobrevive à troca de ramo.
- Alfabetização e profissão não são inferidas de rótulo. Fala inicial permanece na base. Este grupo é só idioma além dessa fala.
- Profissão da família não vira profissão do personagem. Categoria sem subconjunto publicado não ganha um d6 uniforme.
- Idade dirige uma Childhood e 0–6 Life Experiences pelas faixas já formalizadas (contagens 0, 1, 2, 3, 4, 5, 6). Mudança de idade não cria Life Experiences extras.
- Childhood e Starting Lifestyle aplicam modificador depois dos dados, sem truncar antes. Modificadores de família já listados: −6, −3, −1, 0, +1, +3, +6. Core Wealth não usa esses modificadores e não é a mesma consulta.
- Consultas de equipamento e moeda de Only Human leem o lifestyle. Não são cinco rolagens novas.
- Recursão publicada (irmãos/fado e Piety) não é executada aqui. No limite, a pendência é `bounded-recursion`, sem rerrolagem e sem descarte. A exceção de Strange 19 fica registrada e não implementada.
- Cardinalidade de morte dos dois pais permanece `unspecified` (`manual-procedure`). Composição de dimensões permanece `manual-composition` mais `no-extra-life-rolls`.

## Invalidação

| Motivo | Quando | Efeito |
|---|---|---|
| `exclusive-branch` | O ramo ativo deixa de ser o ramo do slot gravado. | `needs-review`. Não migra. Guarda a última escolha. Não se aplica a `shared` nem ao modo de atributos. |
| `source-changed` | A fonte de Interesting Things gravada difere da fonte atual, inclusive quando a fonte atual é `unavailable`. | `needs-review` na fonte e nas concessões. Sem fallback. |
| `prior-altered` | Um passo de `dependsOn` (ou o próprio passo) entra em `alteredStepIds`. | Dependentes visíveis vão para `needs-review`. A concessão não é apagada. |
| `core-benefit-not-applicable` | Há benefício Core gravado e a ancestry não é Core. | `needs-review`. Não migra para Human Development. |

Passo condicional sem token e sem registro fica `skipped-condition` / `hidden-until-condition`. Não vira slot obrigatório. Passo opcional não escolhido fica `not-started`.

## Ramo Core

Ordem do ramo. O benefício da linha 1 só aparece se a ancestry também for Core.

| Ordem | Passo | Exigência | Superfície | Grupo | Cardinalidade |
|---|---|---|---|---|---|
| 1 | `core.ancestry-benefit` | required | choice-slot | — | exatamente 1 |
| 2 | `core.starting-professions` | required | pending-only | profession | exatamente 2 |
| 3 | `core.ancestry-random-profession` | conditional | pending-only | profession | exatamente 1 |
| 4 | `core.wealth` | required | pending-only | wealth-kit | uma vez |
| 5 | `core.starting-kit` | required | pending-only | equipment | uma vez, lê a riqueza |
| 6 | `core.wealthy-shield` | conditional | choice-slot | equipment | exatamente 1 |
| 7 | `shared.interesting-source` | required | choice-slot | interesting-thing | exatamente 1 |
| 8 | `core.interesting-grant` | required | pending-only | interesting-thing | exatamente 1 |
| 9 | `core.ancestry-inspiration` | optional | pending-only | — | conjunto de 6, cada um 0 ou 1, sem ordem interna |
| 10 | `core.role-traits` | optional | pending-only | — | duas colunas independentes |

Refs de lote, todas `pending-lot` salvo indicação:

- Benefício: campo `mechanics:procedure.ancestryBenefit` da base, não um lote da #34. Candidatos publicados: `speak-language`, `random-profession`.
- Profissões: `query:profession-faces:core`, `core:profession-router` e as seis tabelas filhas. As faixas ainda agrupadas (`pilot-profession:core:martial:*`, `pilot-profession:core:religious:*`, `pilot-profession:core:wilderness:*`) produzem `range-starts-not-reextracted`. Não há lista de profissões. Seleção publicada: `manual-or-random`.
- A profissão aleatória do benefício é outra concessão, distinta das duas iniciais. Token: `benefit:random-profession`.
- Riqueza: `core:wealth`, `query:starting-lifestyle:core`. Sem modificadores de Only Human e sem modo manual publicado.
- Kit: `core:kit:<lifestyle>` para os seis estilos, no lote de kits. Enquanto o resultado de riqueza não existe, `lookup-missing-prior`.
- Escudo do kit wealthy: `item-ref:grant:core:kit:wealthy/grant/special/shield/shield`, candidatos do contrato, `resolvedItemId: null`, razão `choice-required`. Token: `item-choice:wealthy-shield`.
- Fonte: `selected:interesting-things-router`, disponibilidade `published-policy`. A escolha entre `oddities` e `core` não espera o lote; as tabelas da concessão esperam.
- Concessão: `core-initial-thing`, uma, não adicional. Com Oddities, o seletor é `oddities:thing-router` e as doze tabelas filhas ficam por selecionar. Com Core, `core:thing-router` e `core:thing-1` … `core:thing-6`. Fonte indisponível não marca seletor.
- Inspiração opcional: `core:human-background`, `core:human-personality`, `core:human-religion`, `core:human-age`, `core:human-build`, `core:human-appearance`. Modos publicados por membro: `roll`, `choose`, `create-other`. Não são linhas de tabela e não formam um único ChoiceSlot. Modelos condicionais: `core-background-travel`, `core-background-education`.
- Personality Traits: `core:role-traits`, `core:role-traits#positive`, `core:role-traits#negative`. As colunas não viram uma linha conjunta.

## Ramo Human Development

| Ordem | Passo | Exigência | Superfície | Grupo | Cardinalidade |
|---|---|---|---|---|---|
| 1 | `dev.ancestors` | required | pending-only | — | uma vez |
| 2 | `dev.family-circumstances` | required | pending-only | — | uma vez |
| 3 | `dev.family-profession` | conditional | choice-slot ou pending-only | profession | exatamente 1 |
| 4 | `dev.parents` | required | pending-only | — | uma vez |
| 5 | `dev.parent-death` | conditional | pending-only | — | unspecified |
| 6 | `dev.siblings` | required | pending-only | — | uma vez |
| 7 | `dev.sibling-details` | conditional | pending-only | — | por irmão |
| 8 | `dev.sibling-recursion` | conditional | pending-only | — | por personagem relacionado |
| 9 | `dev.age` | required | pending-only | — | uma vez |
| 10 | `dev.build` | required | pending-only | — | uma vez |
| 11 | `dev.dimensions` | required | pending-only | — | unspecified |
| 12 | `dev.appearance` | required | pending-only | — | uma vez |
| 13 | `dev.player-appearance` | required | pending-only | — | uma vez |
| 14 | `dev.childhood` | required | pending-only | — | uma vez, a partir da idade |
| 15 | `dev.childhood-grants` | conditional | pending-only | languages-beyond-speech | por direção |
| 16 | `dev.profession-directed` | conditional | pending-only | profession | por direção |
| 17 | `dev.profession-equipment` | conditional | pending-only | equipment | por direção |
| 18 | `dev.languages-beyond-speech` | conditional | pending-only | languages-beyond-speech | por direção |
| 19 | `dev.partial-literacy` | conditional | pending-only | languages-beyond-speech | unspecified |
| 20 | `dev.open-language` | conditional | choice-slot | languages-beyond-speech | exatamente 1 |
| 21 | `dev.choice-military-spear` | conditional | choice-slot | equipment | exatamente 1 |
| 22 | `dev.choice-wilderness-spear` | conditional | choice-slot | equipment | exatamente 1 |
| 23 | `dev.choice-costume` | conditional | choice-slot | equipment | exatamente 1 |
| 24 | `dev.choice-dress` | conditional | choice-slot | equipment | exatamente 1 |
| 25 | `dev.life` | required | pending-only | — | repetido pela faixa de idade |
| 26 | `dev.life-event` | conditional | pending-only | — | a tabela dirigida |
| 27 | `shared.interesting-source` | required | choice-slot | interesting-thing | exatamente 1 |
| 28 | `dev.interesting-extra` | conditional | pending-only | interesting-thing | exatamente 1 |
| 29 | `dev.lifestyle` | required | pending-only | wealth-kit | uma vez, depois dos eventos |
| 30 | `dev.interesting-initial` | required | pending-only | interesting-thing | exatamente 1 |
| 31 | `dev.lookup-clothing` | required | pending-only | equipment | uma consulta |
| 32 | `dev.lookup-weapons` | required | pending-only | equipment | uma consulta |
| 33 | `dev.lookup-personal-gear` | required | pending-only | equipment | uma consulta |
| 34 | `dev.lookup-special-gear` | required | pending-only | equipment | uma consulta |
| 35 | `dev.lookup-money` | required | pending-only | wealth-kit | uma consulta |
| 36 | `dev.personality` | required | pending-only | — | uma vez |
| 37 | `dev.relationships` | required | pending-only | — | uma vez |
| 38 | `dev.fears` | required | pending-only | — | uma vez |
| 39 | `dev.desires` | required | pending-only | — | uma vez |
| 40 | `dev.obligations` | required | pending-only | — | uma vez |
| 41 | `dev.morality` | required | pending-only | — | uma vez |
| 42 | `dev.religion` | required | pending-only | — | uma vez |
| 43 | `dev.piety` | required | pending-only | — | uma vez, com recursão publicada |

Notas de ramo, sem resultado inventado:

- Família → profissão: `query:family-category`. Token `family-profession-directed`. Faixa `family-result:6-8`: `common`, `criminal`, `military`, `wilderness`. Faixa `family-result:9-17`: `common`, `military`, `religious`, `wilderness`. Outro resultado, ou faixa ausente: `manual-category-choice`, sem candidatos. O seletor `only-human:profession-router` é proibido nesse passo.
- Morte: `only-human:death` e `finding:death-multiplicity`. Token `parent-death`.
- Irmãos: a contagem usa zero ou os side rolls `side-roll:only-human:siblings:9-12`, `side-roll:only-human:siblings:13-16`, `side-roll:only-human:siblings:17-20`. Zero irmãos não abre gênero, idade nem fado. Gênero de irmão não é gênero do personagem (`dev.player-appearance` proíbe `only-human:sibling-gender`).
- Detalhe opcional de irmão vivo: token `sibling-optional-detail`. Com `recursion-at-limit`, a pendência `bounded-recursion` entra em `dev.sibling-recursion` e em `dev.piety`. `finding:recursion` fica na lista retida e não dispara rolagem.
- Dimensões: `finding:dimension-order` e `procedure:dimension-composition`.
- Aparência livre: `procedure:expanded-free-appearance`, razão `player-fields`, painel manual, sem lista.
- Childhood: cauda aberta. Concessões de modelo só com `development-template-directed`. Os dezenove modelos de desenvolvimento do ramo estão nas refs; não são passos obrigatórios.
- Profissão dirigida: `query:profession-faces:only-human`, `only-human:profession-router` e as tabelas `only-human:scholarship|common|criminal|military|religious|wilderness`. Filho religious é d6; os outros, d20. Pesos não são uniformes. Não usa as tabelas Core. Não é passo de raiz. Token `profession-granted-to-pc`.
- Equipamento de profissão: grupos `class:exact-definition-refs`, `class:generic-editable-refs`, `class:source-grant-only`, razão `catalog-group-not-individual`. Sem lista de itens.
- Idiomas nomeados (`language:dark-speech` e os demais já individualizados) aparecem como refs `named-language-not-a-menu`, não como opções. Categoria aberta (`language:dead-languages`, `language:secret-language`) é ChoiceSlot com campo manual e candidatos vazios, razão `open-category-language`. Alfabetização parcial: `procedure:partial-literacy`.
- Escolhas de item, candidatos do contrato e `resolvedItemId: null`: lança military `item-ref:grant:profession:pilot-profession:only-human:military:r03/grant/spear`, lança wilderness `item-ref:grant:profession:pilot-profession:only-human:wilderness:r17/grant/spear`, costume e dress de `only-human:common:r11`.
- Life Experience não abre as cinco tabelas de evento. `dev.life-event` lista `only-human:major-setback`, `only-human:minor-setback`, `only-human:minor-windfall`, `only-human:major-windfall` e `only-human:strange` com `selected: false`. Token `life-event-directed`.
- Concessão extra: `only-human-minor-windfall-10`, uma, token `minor-windfall-10`. Não é uma por consulta de equipamento.
- Lifestyle: `only-human:lifestyle`, `query:starting-lifestyle:only-human` e os seis `lifestyle-modifier:*`. Não referencia `core:wealth`.
- Concessão inicial: `only-human-initial-thing`. Não copia `core-initial-thing`.
- Consultas: `only-human:clothing`, `only-human:weapons`, `only-human:personal-gear`, `only-human:special-gear`, `only-human:money` e os kits `only-human:kit:<lifestyle>`. `extra-dice: false`.
- Fears e Desires permanecem passos separados. O pareamento de colunas não é adivinhado.
- Religião de Only Human não é `core:human-religion`.

Lacunas retidas no ramo, com `retainsConsequence: true` e `activatesRoll: false`: `finding:external-dependencies`, `gap:terrible-beauty-favor`, `extra:major-windfall-1-fallback`, `gap:tooth-claw-skinchanger`, `gap:tombs-of-the-desolation`, `gap:demon-lords-companion`, `gap:uncertain-faith`, `finding:recursion`.

## Fora desta versão

Incluídos como adiados, `included: false`, e ausentes da sequência obrigatória:

| Id | Destino |
|---|---|
| `procedure:roleplaying-questions` | #36. Texto livre opcional. Não apaga resultado de tabela. |
| `gap:level-1` | #21. |
| `gap:purchase-system` | Fora do procedimento. |
| `gap:full-combat` | Fora do procedimento. |
| `gap:dark-passages-generator` | Gancho desligado. Books and Scrolls 20 não vira gerador aqui. |
| `gap:ruleset-enablement` | #37. |

Também fora: integração do resolvedor (atividades 6 e 7 da #34), UI completa (#36), habilitação de ruleset (#37) e nível 1 (#21). O motor Human L0 continua com `fullyResolved: false` e `procedure-outcomes-pending`. Este documento não declara o procedimento completo.
