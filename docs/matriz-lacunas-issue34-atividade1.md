# Matriz de lacunas — #34 / atividade 1

Auditoria de 2026-11-02 do recorte CUR-016–021 para a [issue #34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34). Esta entrega executa somente a atividade 1 do [roadmap](roadmap-issue34.md). Atividades 2–8 permanecem por fazer.

A lista normativa por identidade é [`matriz-lacunas-issue34-atividade1.json`](matriz-lacunas-issue34-atividade1.json). Este Markdown fixa o método, as contagens, a matriz de tabelas e as disposições que um revisor precisa ler. Nenhum dos dois arquivos contém excerto de livro.

## Método e evidência disponível

O gerador `tools/curation/issue34-activity1-matrix.ts` reúne identidades que o código versionado já determina: tabelas de CUR-016, arestas, mapas de equipamento, catálogo Core, `details()` de Interesting Things e as disposições de CUR-021. Faixas cuja cobertura declarada e o esquema de id implicam o início da faixa entram como `entailed-coverage`. O que só existe no JSON local entra como grupo com `represents` e evidência `local-only`.

| Situação neste checkout | Consequência para o hash |
|---|---|
| `curation/pilot/`, `curation/reports/`, `curation/corrections/`, `curation/history/` e `rules/` estão ausentes e ignorados | Saídas CUR-016–021 e transcrições não foram refeitas. Hashes declarados ficam `hash-declarado-nao-refeito`. |
| Formalizadores, modelos e `pilot-table-ranges.ts` / `pilot-item-definitions.ts` / `interesting-things-map.ts` estão no Git | Estrutura, ids e contagens rederivadas abaixo. |
| `sources.json` marca Core, Only Human e Oddities com `edition: null`, `pdf: not-provided-in-rules`, `paginationStatus: declared-only`, `provenanceStatus: needs-review` | Nenhuma página impressa foi inspecionada nesta auditoria. |
| Stubs públicos `0.1.0` e a projeção mecânica `0.2.0` | Fora desta atividade. `fictionalData`, `needs-review` e `rulesetEnabled` não mudam. |

Hashes declarados e não recomputados, porque os bytes não estão no checkout:

| Id | SHA-256 declarado |
|---|---|
| MD de ancestries no manifesto de insumos | `020d9d62d9046475552dbaf9f989f07e69b87b7a386cadc1af3e82f930502baf` |
| MD do compêndio de regras no manifesto | `af5b377d003c96910c5c7d4c4909a66d381513cbda93de22b5d83a6ca5474ece` |
| Anexo de profissões Core | `4609a3f4a51c5bc1fa77af9db00a757adc381d78301c2adb85661a53f421c150` |
| Anexo de Interesting Things Core | `836006ebb1021f9af6075d5d19d8665e429bd6ac9062b79b1dcd3a691934ef61` |
| Anexo de introdução Core | `51524877da4e81c6146392d35f4fdca222e6e0b4ff9b7507b0e93c6bcb43f9ef` |
| Anexo de idiomas | `18695a183fdf83e51b3816b0bc06f2c2121c1787cb2468aeff68d16a6e041de0` |
| Anexo de Oddities, pinado no formalizador | `d3431ac28254cc4ee5910197b64dbae14744838eaf8bb983b73d4bb3a765620a` |
| Confirmação Fears/Desires, pinada no fechamento | `1623f63a467016cb940701c088bf4647fa43a9eb730b6817d905e9586113184f` |

Os relatórios `curation/reports/*.json` prometem hashes de saída. Esses arquivos estão ausentes, e o Git não guarda o digest da saída. O manifesto de kits Core (`curation/corrections/core-starting-equipment-2026-10-27/`) também está ausente; o digest dele não foi copiado para esta matriz.

A rederivação estrutural fecha as contagens publicadas de CUR-021: **74 tabelas, 70 fluxos, 901 linhas/faixas, 73 vínculos, 285 definições especiais e 75 referências fora do inventário**. Isso confere o modelo versionado. Não substitui `--check` com os bytes locais.

## Contagens

| Medida | Total |
|---|---:|
| Linhas da matriz | 1673 |
| Identidades contábeis (`represents`) | 2017 |
| Tabelas | 74 |
| Fluxos numéricos | 70 |
| Linhas/faixas rederivadas | 901 |
| Consultas de procedimento, incluindo 5 lookups | 11 |
| Vínculos | 73 |
| Opções de profissão/concessão | 169 |
| Programas de concessão | 97 |
| Resultados de Interesting Things | 360 |
| Definições de catálogo | 409 |
| Referências de catálogo | 641 |

Seleção contábil: selecionado 1942; selecionado com resolução manual 16; adiado 6; bloqueado 24; referência 28; fora do recorte porque a base Human L0 já cobre 1.

Disposição contábil: lote Core 293; lote Only Human 227; lote Oddities 279; lote kits/itens 1063; adiado 6; bloqueado 24; referência 125.

Uma identidade bloqueada aqui é um ramo externo, uma página não conferida ou um hash sem bytes. A consequência publicada correspondente permanece na matriz como pendência. Adiar o gerador de Dark Passages não remove `oddities:books:20`.

## Recorte selecionado

Padrão de ancestralidade: Human Development (Only Human). Alternativa preservada: procedimento Core, com profissões e riqueza próprias. O modo de atributos já entregue na base fica de fora desta atividade.

Padrão de Interesting Things: Oddities. Alternativa preservada: seis tabelas Core. Fonte desabilitada vira pendência, com o procedimento escolhido explícito. Há três concessões: `core-initial-thing`, `only-human-initial-thing` e `only-human-minor-windfall-10`.

Lotes que a atividade 2 precisa conseguir nomear:

- **lote-core** — tabelas de ancestry/background, profissões Core, Wealth, Personality Traits e Interesting Things Core.
- **lote-only-human** — Human Development, profissões da expansão, modificadores de lifestyle, idiomas condicionais e ciclos.
- **lote-oddities** — seletor e doze tabelas.
- **lote-kits-itens** — 12 kits, programas de profissão e extras, definições Core, escolhas ambíguas, genéricos e conjuntos de resultado.

## Matriz das 74 tabelas

| ID | Fonte | CUR | Seleção | Evidência | Disposição | Dado / consulta |
|---|---|---|---|---|---|---|
| `core:human-age` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-ancestry-inspiration, dice:3d6 |
| `core:human-appearance` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-ancestry-inspiration, dice:3d6 |
| `core:human-background` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-ancestry-inspiration, dice:1d20 |
| `core:human-build` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-ancestry-inspiration, dice:3d6 |
| `core:human-personality` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-ancestry-inspiration, dice:3d6 |
| `core:human-religion` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-ancestry-inspiration, dice:3d6 |
| `core:profession-academic` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:conditional-profession, dice:1d20 |
| `core:profession-common` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:conditional-profession, dice:1d20 |
| `core:profession-criminal` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:conditional-profession, dice:1d20 |
| `core:profession-martial` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:conditional-profession, dice:1d20 |
| `core:profession-religious` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:conditional-profession, dice:1d20 |
| `core:profession-router` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:per-random-profession, dice:1d6 |
| `core:profession-wilderness` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:conditional-profession, dice:1d20 |
| `core:role-traits` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:optional-inspiration-two-positive-at-least-one-negative, dice:1d20 |
| `core:thing-1` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:selector-child, dice:1d20 |
| `core:thing-2` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:selector-child, dice:1d20 |
| `core:thing-3` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:selector-child, dice:1d20 |
| `core:thing-4` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:selector-child, dice:1d20 |
| `core:thing-5` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:selector-child, dice:1d20 |
| `core:thing-6` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:selector-child, dice:1d20 |
| `core:thing-router` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:one-initial-plus-explicit-extra-results, dice:1d6 |
| `core:wealth` | `sotdl:shadow-of-the-demon-lord-core` | CUR-016/021 | selecionado | code-anchor | lote-core | activation:core-wealth-once, dice:3d6 |
| `oddities:art` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | hash-declarado-nao-refeito | lote-oddities | dice:1d20 |
| `oddities:books` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | hash-declarado-nao-refeito | lote-oddities | dice:1d20 |
| `oddities:clothing` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `oddities:consumables` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `oddities:ingredients` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | hash-declarado-nao-refeito | lote-oddities | dice:1d20 |
| `oddities:minor-magic` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | hash-declarado-nao-refeito | lote-oddities | dice:1d20 |
| `oddities:people` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `oddities:personal` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | hash-declarado-nao-refeito | lote-oddities | dice:1d20 |
| `oddities:pets` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | hash-declarado-nao-refeito | lote-oddities | dice:1d20 |
| `oddities:qualities` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `oddities:thing-router` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `oddities:tools` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `oddities:weird` | `sotdl:oddities-artifacts-and-esoterica` | CUR-019/021 | selecionado | code-anchor | lote-oddities | dice:1d20 |
| `only-human:age` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:ancestors` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:appearance` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:build` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:character-fate` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:per-related-character, dice:3d6 |
| `only-human:childhood` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:once-from-age, dice:3d6 |
| `only-human:clothing` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-kits-itens | activation:lookup-by-lifestyle, lookup:selected-starting-lifestyle |
| `only-human:common` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-profession, dice:1d20 |
| `only-human:criminal` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-profession, dice:1d20 |
| `only-human:death` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-death, dice:3d6 |
| `only-human:desires` | `sotdl:only-human` | CUR-016/021 | selecionado | hash-declarado-nao-refeito | lote-only-human | activation:root-once, dice:1d6 |
| `only-human:family-circumstances` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:fears` | `sotdl:only-human` | CUR-016/021 | selecionado | hash-declarado-nao-refeito | lote-only-human | activation:root-once, dice:1d6 |
| `only-human:life` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:repeat-from-age, dice:3d6 |
| `only-human:lifestyle` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:after-all-life-events, dice:3d6 |
| `only-human:major-setback` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-life, dice:1d20 |
| `only-human:major-windfall` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-life, dice:1d20 |
| `only-human:military` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-profession, dice:1d20 |
| `only-human:minor-setback` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-life, dice:1d20 |
| `only-human:minor-windfall` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-life, dice:1d20 |
| `only-human:money` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-kits-itens | activation:lookup-by-lifestyle, lookup:selected-starting-lifestyle |
| `only-human:morality` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:obligations` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:parents` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:personal-gear` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-kits-itens | activation:lookup-by-lifestyle, lookup:selected-starting-lifestyle |
| `only-human:personality` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:piety` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once-with-published-recursion, dice:3d6 |
| `only-human:profession-router` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:when-profession-directed, dice:1d6 |
| `only-human:relationships` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:3d6 |
| `only-human:religion` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once-and-piety-reroll, dice:3d6 |
| `only-human:religious` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-profession, dice:1d6 |
| `only-human:scholarship` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-profession-or-education, dice:1d20 |
| `only-human:sibling-age` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:per-sibling, dice:4d6 |
| `only-human:sibling-gender` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:per-sibling, dice:1d6 |
| `only-human:siblings` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:root-once, dice:1d20 |
| `only-human:special-gear` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-kits-itens | activation:lookup-by-lifestyle, lookup:selected-starting-lifestyle |
| `only-human:strange` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-life, dice:1d20 |
| `only-human:weapons` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-kits-itens | activation:lookup-by-lifestyle, lookup:selected-starting-lifestyle |
| `only-human:wilderness` | `sotdl:only-human` | CUR-016/021 | selecionado | code-anchor | lote-only-human | activation:conditional-profession, dice:1d20 |

As cinco consultas `only-human:clothing|weapons|personal-gear|special-gear|money` leem o lifestyle já obtido. Personality Traits (`core:role-traits`) é uma tabela com dois fluxos independentes, `#positive` e `#negative`.

Quatro tabelas fecham ciclo no grafo versionado: `only-human:character-fate`, `only-human:piety`, `only-human:siblings`, `only-human:strange`. O achado `finding:recursion` lista esses ids.

## Fluxos, profissões e concessões

Cada tabela com dado tem um fluxo `#main`, exceto `core:role-traits`, que tem dois. A soma das linhas é 901, igual à auditoria CUR-021. Os testes daquele fechamento exigem cobertura 70/70; este checkout não reexecutou a enumeração de dados contra o texto.

Profissões: 168 opções de tabela + `pilot-profession:only-human:direct:occult` = 169. Categorias com uma faixa por face, ou com pares contíguos que cobrem o dado inteiro, foram expandidas. Permanecem agrupadas, à espera do anexo local:

| Grupo | Faixas | Ids individuais já fixados | Restante local-only |
|---|---:|---|---:|
| `core:martial` | 14 | `r03`, `r13` | 12 |
| `core:religious` | 11 | `r01`, `r03`, `r09`, `r11` | 7 |
| `core:wilderness` | 17 | nenhum início além da contagem | 17 |

Only Human Religious usa d6 e seis faixas simples. As outras categorias expandidas têm os inícios de faixa no formalizador de equipamento. Programa material `profession:<id>` existe só para opção de tabela Only Human, e só quando a profissão é concedida ao personagem. Opção Core e Occult direto ficam com `program:null`.

Dezenove modelos de desenvolvimento e dezenove programas extras estão no JSON, com ids estáveis (`childhood-*`, `windfall-*`, `strange-*`, `core-background-*`, `extra:*`). Doze kits: `core:kit:<lifestyle>` e `only-human:kit:<lifestyle>` para os seis estilos. Moeda de kit e as sete concessões em moeda listadas no formalizador formam as 19 referências `currency-preserved`.

Cinco escolhas de perfil, sem seleção automática: escudo do kit Core wealthy; spear em `only-human:military:r03` e `only-human:wilderness:r17`; costume e dress em `only-human:common:r11`.

## Interesting Things e catálogo

360 resultados: `core:{1-6}:{1-20}` e `oddities:<tabela>:{1-20}`. A classificação usa `details()` (kind, dados de criação/uso, tags, escolha de GM). O texto da alternativa não entra nesta matriz.

Seis tabelas de Oddities (`art`, `books`, `minor-magic`, `pets`, `personal`, `ingredients`) são as que o formalizador só aceita se a transcrição do usuário atualizar 120 linhas e resolver 13 associações. O arquivo dessa transcrição está ausente; o hash pinado foi registrado e não recomputado. As outras seis tabelas têm spans de linha versionados, também sem o MD para refazer o excerpt.

`oddities:books:20` permanece selecionado, kind `text-reference`, com o gancho `dark-passages-books-and-passages` desabilitado. O gap do gerador está adiado.

Catálogo contábil 409 = 67 definições `pilot-item:core:*` + 285 `pilot-item:thing:*` + 57 `class:source-grant-only`. Referências 641 = 360 de Interesting Things + 182 exatas + 75 genéricas + 5 escolhas + 19 moedas. As 182 e as 75 são grupos: o ledger local é que tem o caminho de cada folha. Preço de linha Core não foi relido; a célula de preço continua por extrair na atividade 5.

28 blocos `item-definition:rule:*` ficam como referência. Eles não são handlers.

## Achados CUR-016

| Achado | Seleção | Estado no código | Nota |
|---|---|---|---|
| `finding:death-multiplicity` | selecionado-manual | status:manual-procedure |  |
| `finding:dimension-order` | selecionado-manual | status:manual-composition |  |
| `finding:external-dependencies` | selecionado-manual | status:conditional-manual |  |
| `finding:fears-desires-columns` | selecionado | status:resolved-user-transcription | pdf-nao-alegado |
| `finding:outer-category-choice` | selecionado-manual | status:manual-category-choice |  |
| `finding:profession-selector-stray-prose` | selecionado | status:resolved-boundary |  |
| `finding:recursion` | selecionado-manual | status:bounded-reference-only |  |

## Fora do lote e bloqueios que continuam visíveis

- Atributos Human (`procedure:human-attributes`) já estão na base entregue.
- Campos livres de Roleplaying Questions seguem para #35/#36. Eles não apagam resultado de tabela.
- Compra, combate completo, outras ancestries/paths/spells e nível 1 ficam adiados.
- Ramos de Terrible Beauty, Tooth and Claw, Tombs of the Desolation, Demon Lord's Companion e Uncertain Faith ficam bloqueados como conteúdo dessas fontes. O ramo condicional da tabela Human continua selecionado como pendência.
- Habilitação de ruleset, promoção `needs-review` → `curated` e `fictionalData: true` ficam bloqueados.

## O que a atividade 2 precisa receber

O contrato consumível pode começar com fixtures sintéticas. Ele ainda depende das decisões abaixo. Sem elas, o schema arriscaria tratar lacuna como aprovação ou pendência como linha descartada.

| Bloqueio | Dono | Efeito |
|---|---|---|
| `act2-curator-accepts-matrix` | curador | Aceitar o recorte: ambos os procedimentos e ambas as fontes de Interesting Things permanecem selecionados. Pendência manual continua como resultado selecionado. |
| `act2-contract-version` | engenheiro | Definir contrato novo ou evolução versionada, preservando os 16 arquivos congelados e a projeção mecânica 0.2.0. |
| `act2-synthetic-fixtures-only` | ambiente | Bytes de piloto, correções e MDs estão ausentes. A atividade 2 usa fixtures sintéticas. Hash conferido dos insumos reais fica para a conferência local, antes do lote. |
| `act2-weighted-ranges` | engenheiro | O contrato precisa de faixas com peso, colunas independentes, caudas abertas, consultas sem dado extra e side rolls com fase. Três categorias Core agregadas ainda aguardam a reextração de todos os inícios de faixa. |
| `act2-pending-effects` | engenheiro | O handler devolve efeito tipado ou pendência. Ramos externos, gerador desabilitado, escolha ambígua e perfil genérico permanecem pendências. |
| `act2-no-promotion` | curador | Manter needs-review, fictionalData false e ruleset desabilitado. Paginação de PDF não foi inspecionada nesta auditoria. |

Critério de saída desta atividade: cada tabela, fluxo, consulta, opção contábil, programa, resultado e referência está selecionado ou tem disposição e evidência próprias no JSON. Nenhuma consequência obrigatória foi removida por estar adiada ou bloqueada.

Conferência local ainda necessária, com corpus presente: `node tools/curation/creation-tables.mjs --check` e os `--check` de profissões, riqueza, Interesting Things, itens e fechamento. Essa conferência promove a evidência; não faz parte deste PR.
