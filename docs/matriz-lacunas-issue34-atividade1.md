# Matriz de lacunas — #34 / atividade 1

Auditoria de 2026-11-02 do recorte CUR-016–021 para a [issue #34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34), revista em 2026-11-03. A matriz da atividade 1 está publicada. O fechamento da atividade continua pendente em `act1-local-hash-check`: os hashes declarados não foram recomputados. Atividades 2–8 permanecem por fazer. A atividade 2 pode usar fixtures sintéticas em paralelo.

A lista normativa por identidade é [`matriz-lacunas-issue34-atividade1.json`](matriz-lacunas-issue34-atividade1.json). Cada registro tem `sourceVersion`, `sourceVersionReason`, `review`, `consumers`, `consequenceTypes`, `linkedDefinition` e `evidenceRef`. `sourceVersion` é `null` em todos: `sources.json` deixa `revision` nula e `editionStatus` unconfirmed. Nenhum dos dois arquivos contém excerto de livro.

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

A rederivação estrutural fecha as contagens publicadas de CUR-021: **74 tabelas, 70 fluxos, 901 linhas/faixas, 73 vínculos, 285 definições especiais e 75 referências fora do inventário**. Isso confere o modelo versionado. Não substitui `--check` com os bytes locais. O bloqueio `act1-local-hash-check` cobre os 258 registros `hash-declarado-nao-refeito`.

CUR-021 conta **77 menções contextuais a dados** no texto auditado. Essas menções não são 77 comandos de criação. O código versionado individualiza dois subconjuntos dessas menções: **8 regras revistas** (`kind: side-roll`) e **23 `sideRolls` de Interesting Things** anexados aos resultados. O fechamento também conserva menções de anos narrativos, dados de uso e quantidades que não viraram comando. Recontar as 77 exige `curation/pilot/table-closure.json`, ausente neste checkout.

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

Seleção e disposição são eixos diferentes. **96 registros são `selecionado` e `referencia` ao mesmo tempo.** A consequência não é um segundo ganho: 19 referências de moeda apontam para o programa de concessão, 75 referências fora do inventário apontam para o resultado de Interesting Things, e 2 achados resolvidos apontam para as tabelas que já carregam o resultado. Somar seleção com disposição conta a mesma identidade duas vezes.

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

`sourceVersion` é null em todas as linhas, pelo motivo acima. As outras colunas de aceite estão no JSON para os demais registros.

| ID | Versão | Revisão | Consumidores | Consequências | Definição vinculada | Evidência | Seleção | Estado da evidência | Disposição |
|---|---|---|---|---|---|---|---|---|---|
| `core:human-age` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:human-appearance` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:human-background` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:human-build` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:human-personality` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:human-religion` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:profession-academic` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:profession-common` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:profession-criminal` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:profession-martial` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:profession-religious` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:profession-router` | null | code-anchor-2026-10-27 | #34-act3 #35 | selector | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:profession-wilderness` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-professions` | selecionado | code-anchor | lote-core |
| `core:role-traits` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `core:thing-1` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:thing-2` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:thing-3` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:thing-4` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:thing-5` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:thing-6` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:thing-router` | null | code-anchor-2026-10-27 | #34-act3 #35 | selector | `n/a:not-an-item-definition` | `evidence:correction-core-interesting-things` | selecionado | code-anchor | lote-core |
| `core:wealth` | null | code-anchor-2026-10-27 | #34-act3 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-core |
| `oddities:art` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-oddities-tables` | selecionado | hash-declarado-nao-refeito | lote-oddities |
| `oddities:books` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-oddities-tables` | selecionado | hash-declarado-nao-refeito | lote-oddities |
| `oddities:clothing` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `oddities:consumables` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `oddities:ingredients` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-oddities-tables` | selecionado | hash-declarado-nao-refeito | lote-oddities |
| `oddities:minor-magic` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-oddities-tables` | selecionado | hash-declarado-nao-refeito | lote-oddities |
| `oddities:people` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `oddities:personal` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-oddities-tables` | selecionado | hash-declarado-nao-refeito | lote-oddities |
| `oddities:pets` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-oddities-tables` | selecionado | hash-declarado-nao-refeito | lote-oddities |
| `oddities:qualities` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `oddities:thing-router` | null | code-anchor-2026-10-27 | #34-act4 #35 | selector | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `oddities:tools` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `oddities:weird` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-compendium-md` | selecionado | code-anchor | lote-oddities |
| `only-human:age` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:ancestors` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:appearance` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:build` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:character-fate` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:childhood` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:clothing` | null | code-anchor-2026-10-27 | #34-act5 #35 #36 | lookup | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-kits-itens |
| `only-human:common` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:criminal` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:death` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:desires` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-fears-desires` | selecionado | hash-declarado-nao-refeito | lote-only-human |
| `only-human:family-circumstances` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:fears` | null | declared-2026-10-27-hash-not-recomputed | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:correction-fears-desires` | selecionado | hash-declarado-nao-refeito | lote-only-human |
| `only-human:life` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:lifestyle` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:major-setback` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:major-windfall` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:military` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:minor-setback` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:minor-windfall` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:money` | null | code-anchor-2026-10-27 | #34-act5 #35 #36 | lookup | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-kits-itens |
| `only-human:morality` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:obligations` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:parents` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:personal-gear` | null | code-anchor-2026-10-27 | #34-act5 #35 #36 | lookup | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-kits-itens |
| `only-human:personality` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:piety` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:profession-router` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:relationships` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:religion` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:religious` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:scholarship` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:sibling-age` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:sibling-gender` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:siblings` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:special-gear` | null | code-anchor-2026-10-27 | #34-act5 #35 #36 | lookup | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-kits-itens |
| `only-human:strange` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |
| `only-human:weapons` | null | code-anchor-2026-10-27 | #34-act5 #35 #36 | lookup | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-kits-itens |
| `only-human:wilderness` | null | code-anchor-2026-10-27 | #34-act4 #35 | table-result | `n/a:not-an-item-definition` | `evidence:rules-ancestry-md` | selecionado | code-anchor | lote-only-human |

As cinco consultas `only-human:clothing|weapons|personal-gear|special-gear|money` leem o lifestyle já obtido. Personality Traits (`core:role-traits`) é uma tabela com dois fluxos independentes, `#positive` e `#negative`.

Quatro tabelas fecham ciclo no grafo versionado: `only-human:character-fate`, `only-human:piety`, `only-human:siblings`, `only-human:strange`. O achado `finding:recursion` lista esses ids.

## Fluxos, profissões e concessões

Cada tabela com dado tem um fluxo `#main`, exceto `core:role-traits`, que tem dois. A soma das linhas é 901, igual à auditoria CUR-021. Os testes daquele fechamento exigem cobertura 70/70; este checkout não reexecutou a enumeração de dados contra o texto.

Profissões: 168 opções de tabela + `pilot-profession:only-human:direct:occult` = 169. Categorias com uma faixa por face, ou com pares contíguos que cobrem o dado inteiro, foram expandidas. O bloqueio `act3-act5-grouped-local-only` cobre **350 identidades** que continuam agrupadas: as 36 abaixo e mais 314 registros de catálogo (57 `class:source-grant-only`, 182 `class:exact-definition-refs`, 75 `class:generic-editable-refs`). `linkedDefinition` desses grupos é `local-only`. A atividade 3 individualiza as profissões; a atividade 5 individualiza o catálogo.

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

| Bloqueio | Dono | Contagem | Atividades | Efeito |
|---|---|---:|---|---|
| `act1-local-hash-check` | ambiente | 258 | 1 | A atividade 1 permanece aberta. rules/, curation/pilot/ e curation/corrections/ estão ausentes, então os seis formalizadores não rodaram --check. 258 registros ficam hash-declarado-nao-refeito e apontam evidenceRef para um hash declarado, não recomputado. |
| `act3-act5-grouped-local-only` | curador | 350 | 3, 5 | 350 identidades seguem agrupadas com evidência local-only: 36 opções de profissão Core (atividade 3) e 314 registros de catálogo (atividade 5: 57 definições sem perfil, 182 referências exatas, 75 referências genéricas). O grupo não é evidência individual. |
| `act2-curator-accepts-matrix` | curador |  |  | Aceitar o recorte: ambos os procedimentos e ambas as fontes de Interesting Things permanecem selecionados. Pendência manual continua como resultado selecionado. |
| `act2-contract-version` | engenheiro |  |  | Definir contrato novo ou evolução versionada, preservando os 16 arquivos congelados e a projeção mecânica 0.2.0. |
| `act2-synthetic-fixtures-only` | ambiente |  |  | Bytes de piloto, correções e MDs estão ausentes. A atividade 2 usa fixtures sintéticas. Hash conferido dos insumos reais fica para a conferência local, antes do lote. |
| `act2-weighted-ranges` | engenheiro |  |  | O contrato precisa de faixas com peso, colunas independentes, caudas abertas, consultas sem dado extra e side rolls com fase. Três categorias Core agregadas ainda aguardam a reextração de todos os inícios de faixa. |
| `act2-pending-effects` | engenheiro |  |  | O handler devolve efeito tipado ou pendência. Ramos externos, gerador desabilitado, escolha ambígua e perfil genérico permanecem pendências. |
| `act2-no-promotion` | curador |  |  | Manter needs-review, fictionalData false e ruleset desabilitado. Paginação de PDF não foi inspecionada nesta auditoria. |

A matriz publica o recorte. A atividade 1 só fecha quando `act1-local-hash-check` recomputar os hashes com os livros presentes. Nenhuma consequência obrigatória foi removida por estar adiada ou bloqueada.

Conferência local ainda necessária: `node tools/curation/creation-tables.mjs --check`, `professions-languages.mjs --check`, `wealth-equipment.mjs --check`, `interesting-things.mjs --check`, `pilot-items.mjs --check` e `pilot-tables.mjs --check`.
