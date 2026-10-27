# CUR-016 — inventário de tabelas da criação

Revisão: **2026-10-27**, conforme [plano-inventario-tabelas-criacao.md](plano-inventario-tabelas-criacao.md). Inventário concluído para Human/Core + Only Human: **61 tabelas lógicas**, sendo **22 Core e 39 Only Human**. São **56 tabelas de dados e cinco consultas por lifestyle**, com **61 ligações**, quatro tabelas em ciclos e sete achados de revisão.

## Artefatos

- [Inventário estruturado](../curation/pilot/creation-table-inventory.json): cada tabela tem ID local estável, fonte, dado/chave de consulta, ativação/cardinalidade, modo manual, contexto, notas, linhas/hash e texto original. Esses IDs não são entidades de catálogo emitidas.
- [Relatório](../curation/reports/creation-table-inventory.json): contagens, dependências e hashes determinísticos.
- [Ferramenta](../tools/curation/creation-table-inventory.ts), runner `tools/curation/creation-tables.mjs` e [testes](../tests/curation-creation-tables.test.ts).

As tabelas com o mesmo nome continuam separadas por publicação. Fears e Desires têm registros distintos compartilhando a faixa de extração intercalada; Personality Traits Core é um registro com duas colunas, não um resultado positivo/negativo combinado. O total é de tabelas lógicas, não contagem de blocos físicos nem de resultados aprovados.

## Procedimentos preservados

**Padrão expandido:** Human Development Tables de Only Human, conforme a [instrução específica](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13726). Usar o procedimento completo, com seus ramos condicionais. Não rolar todas as subtabelas incondicionalmente: zero irmãos não cria rolagens de irmãos, e somente a categoria de profissão dirigida é consultada. Esse procedimento substitui a geração normal de profissões aleatórias e riqueza Core. A escolha fixa/aleatória de atributos é independente.

**Alternativa Core:** manter as seis tabelas Human, profissões d6→d20, Wealth 3d6, Interesting Things d6→d20 e a inspiração de Personality Traits. As numerações recuperadas em textos suplementares continuam preservadas. Core Wealth não é Starting Lifestyles de Only Human: seus limites são diferentes, mesmo com os mesmos nomes de estilos de vida.

Nas tabelas de ancestry Core, a introdução permite rolar, escolher ou criar outro elemento. Only Human manda rolar e aceitar os resultados do desenvolvimento; essa instrução específica não é anulada pela regra geral Core. Profissões Core permitem escolha manual. Wealth e Interesting Things não receberam uma autorização de escolha manual publicada adicional nesta tarefa; eventual override do aplicativo precisa permanecer identificado. Consultas por lifestyle apenas leem o estilo já obtido e resolvem alternativas internas.

## Lista completa

O campo **Ativação** é uma classificação de inventário, não código executável. A cardinalidade completa de cada ramo deve ser formalizada nos CURs seguintes; a justificativa e o texto integral estão no JSON.

### Core — 22 tabelas

| ID | Tabela | Dado/chave | Ativação | Evidência |
|---|---|---|---|---|
| core:human-background | Human background | d20 | optional-ancestry-inspiration | [14776–14822](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14776) |
| core:human-personality | Human personality | 3d6 | optional-ancestry-inspiration | [14823–14849](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14823) |
| core:human-religion | Human religion | 3d6 | optional-ancestry-inspiration | [14850–14857](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14850) |
| core:human-age | Human age | 3d6 | optional-ancestry-inspiration | [14858–14865](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14858) |
| core:human-build | Human build | 3d6 | optional-ancestry-inspiration | [14866–14876](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14866) |
| core:human-appearance | Human appearance | 3d6 | optional-ancestry-inspiration | [14880–14921](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14880) |
| core:profession-router | Profession Types | d6 | per-random-profession | [4–18](../curation/corrections/core-professions-2026-10-27/professions.txt#L4) |
| core:profession-academic | academic Professions | d20 | conditional-profession | [31–52](../curation/corrections/core-professions-2026-10-27/professions.txt#L31) |
| core:profession-common | common Professions | d20 | conditional-profession | [53–78](../curation/corrections/core-professions-2026-10-27/professions.txt#L53) |
| core:profession-criminal | criminal Professions | d20 | conditional-profession | [79–89](../curation/corrections/core-professions-2026-10-27/professions.txt#L79) |
| core:profession-martial | martial Professions | d20 | conditional-profession | [90–98](../curation/corrections/core-professions-2026-10-27/professions.txt#L90) |
| core:profession-religious | religious Professions | d20 | conditional-profession | [106–119](../curation/corrections/core-professions-2026-10-27/professions.txt#L106) |
| core:profession-wilderness | wilderness Professions | d20 | conditional-profession | [99–105](../curation/corrections/core-professions-2026-10-27/professions.txt#L99) |
| core:wealth | Wealth | 3d6 | core-wealth-once | [359–381](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L359) |
| core:thing-router | Interesting Thing Tables | d6 | one-initial-plus-explicit-extra-results | [3–7](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L3) |
| core:thing-1 | Interesting Things Table 1 | d20 | selector-child | [9–30](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L9) |
| core:thing-2 | Interesting Things Table 2 | d20 | selector-child | [32–53](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L32) |
| core:thing-3 | Interesting Things Table 3 | d20 | selector-child | [55–78](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L55) |
| core:thing-4 | Interesting Things Table 4 | d20 | selector-child | [80–101](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L80) |
| core:thing-5 | Interesting Things Table 5 | d20 | selector-child | [103–125](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L103) |
| core:thing-6 | Interesting Things Table 6 | d20 | selector-child | [127–150](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt#L127) |
| core:role-traits | Personality Traits | d20 | optional-inspiration-two-positive-at-least-one-negative | [716–737](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L716) |

### Only Human — 39 tabelas

| ID | Tabela | Dado/chave | Ativação | Evidência |
|---|---|---|---|---|
| only-human:ancestors | Ancestors | 3d6 | root-once | [13738–13760](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13738) |
| only-human:family-circumstances | Family Circumstances | 3d6 | root-once | [13761–13787](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13761) |
| only-human:parents | Parents | 3d6 | root-once | [13788–13801](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13788) |
| only-human:siblings | Siblings | d20 | root-once | [13802–13809](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13802) |
| only-human:sibling-gender | Sibling Genders | d6 | per-sibling | [13810–13813](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13810) |
| only-human:sibling-age | Sibling Ages | 4d6 | per-sibling | [13814–13819](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13814) |
| only-human:character-fate | Character Fates | 3d6 | per-related-character | [13820–13832](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13820) |
| only-human:death | Circumstances of Death | 3d6 | conditional-death | [13833–13841](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13833) |
| only-human:age | Ages | 3d6 | root-once | [13846–13869](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13846) |
| only-human:build | Builds | 3d6 | root-once | [13870–13887](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13870) |
| only-human:appearance | Appearances | 3d6 | root-once | [13888–13906](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13888) |
| only-human:childhood | Childhoods | 3d6 | once-from-age | [13916–13947](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13916) |
| only-human:life | Life Experiences | 3d6 | repeat-from-age | [13948–13969](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13948) |
| only-human:major-setback | Major Setbacks | d20 | conditional-life | [13970–14039](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13970) |
| only-human:minor-setback | Minor Setbacks | d20 | conditional-life | [14040–14088](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14040) |
| only-human:minor-windfall | Minor Windfalls | d20 | conditional-life | [14089–14146](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14089) |
| only-human:major-windfall | Major Windfalls | d20 | conditional-life | [14147–14210](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14147) |
| only-human:strange | Strange Events | d20 | conditional-life | [14211–14300](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14211) |
| only-human:profession-router | Random Professions | d6 | when-profession-directed | [14307–14314](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14307) |
| only-human:scholarship | Scholar: Areas of Scholarship | d20 | conditional-profession-or-education | [14319–14333](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14319) |
| only-human:common | Common Professions | d20 | conditional-profession | [14334–14375](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14334) |
| only-human:criminal | Criminal Professions | d20 | conditional-profession | [14376–14393](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14376) |
| only-human:military | Military Professions | d20 | conditional-profession | [14394–14412](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14394) |
| only-human:religious | Religious Professions | d6 | conditional-profession | [14413–14422](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14413) |
| only-human:wilderness | Wilderness Professions | d20 | conditional-profession | [14423–14439](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14423) |
| only-human:lifestyle | Starting Lifestyles | 3d6 | after-all-life-events | [14450–14457](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14450) |
| only-human:clothing | Clothing | lifestyle | lookup-by-lifestyle | [14458–14469](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14458) |
| only-human:weapons | Weapons | lifestyle | lookup-by-lifestyle | [14470–14480](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14470) |
| only-human:personal-gear | Personal Gear | lifestyle | lookup-by-lifestyle | [14481–14495](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14481) |
| only-human:special-gear | Special Gear | lifestyle | lookup-by-lifestyle | [14496–14511](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14496) |
| only-human:money | Wealth | lifestyle | lookup-by-lifestyle | [14512–14519](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14512) |
| only-human:personality | Personalities | 3d6 | root-once | [14524–14554](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14524) |
| only-human:relationships | Relationships | 3d6 | root-once | [14555–14577](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14555) |
| only-human:fears | Fears | d6 | root-once | [14578–14607](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14578) |
| only-human:desires | Desires | d6 | root-once | [14578–14607](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14578) |
| only-human:obligations | Obligations | 3d6 | root-once | [14608–14633](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14608) |
| only-human:morality | Morality | 3d6 | root-once | [14634–14663](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14634) |
| only-human:religion | Religious Beliefs | 3d6 | root-once-and-piety-reroll | [14664–14683](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14664) |
| only-human:piety | Piety | 3d6 | root-once-with-published-recursion | [14684–14709](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14684) |


## Encadeamentos e exceções

- **Family Circumstances → Childhood:** modificadores −6, −3, −1, +1, +3 e +6. Childhood tem extremos abertos “3 ou menos” e “18 ou mais”. Somar o modificador após os dados, sem truncar previamente o total à faixa 3–18.
- **Age → Childhood/Life Experiences:** uma Childhood e 0–6 Life Experiences pela faixa de idade. Life Experiences são sequenciais: mudanças de Starting Lifestyle, estados, profissões e outros ganhos precisam manter sua ordem e origem.
- **Age/Build → dimensões e Size:** Age 3 define Size 1/2 e Build 3 reduz para Size 1/2 se ainda não for. São exceções explícitas à independência geral Build/Size. Altura/peso usam unidades e rolagens próprias; a composição entre escala de idade, deltas de Build e anos adicionados não foi inventada.
- **Siblings → quantidade → Fate por irmão:** a quantidade pode exigir 1d3+1, 1d6+2 ou 2d6. Sibling Ages usa **4d6**. Fate de pessoas mortas leva a Circumstances of Death; detalhes adicionais de irmãos vivos são opcionais e podem recursar.
- **Profissões:** o seletor expandido d6 aponta para suas próprias subtabelas. **Religious Only Human usa d6; Religious Core usa d20.** Military expandido não é automaticamente Martial Core. A profissão expandida concede equipamento; seus resultados não podem ser substituídos por rótulos homônimos do Core.
- **Alfabetização:** o artista Core pode conceder leitura/escrita ao escolher poet/writer; Only Human permite escolher poet/writer se já for alfabetizado. O rodapé de Scholar concede um livro, sem importar automaticamente a alfabetização Academic Core. A origem de fala/leitura/escrita deve ser conservada em CUR-017.
- **Starting Lifestyle → cinco consultas:** somar modificadores acumulados dos eventos antes de obter o estilo. Clothing, Weapons, Personal Gear, Special Gear e Wealth não são cinco novas rolagens de classe social. Wealth neste bloco determina quantia/moeda pelo estilo selecionado.
- **Interesting Things:** Only Human mantém um inicial Core; Minor Windfall pode conceder outro. Preservar os dois ganhos e não gerar um por consulta de equipamento. Itens genéricos editáveis continuam permitidos, sem eliminar quantidades ou efeitos.
- **Strange 19:** se Tooth and Claw não estiver disponível, a fonte manda rolar de novo ignorando 19. Essa é uma exceção publicada de rerrolagem, não uma licença para descartar resultados difíceis de outras tabelas.
- **Piety 3:** rolar Religious Beliefs e Piety novamente; cada resultado 3 depois do primeiro concede 1 Insanity. Exige contador, distinção entre crença aparente/real e guarda de execução, sem loop ilimitado ou resultado inventado.

`diceSignals` registra expressões encontradas e suas linhas como sinais de dados/quantidade/referência. Não assume que cada expressão seja uma rolagem filha executável: o resultado e a escolha do ramo precisam ser formalizados primeiro. A geração dos atributos de CUR-015 e os campos livres de aparência não foram inventariados como tabelas. A política de perguntas opcionais não remove resultados das tabelas narrativas publicadas.

## Sete achados preservados

| Achado | Tratamento necessário |
|---|---|
| Fears/Desires intercalados e cabeçalho Value | Conferir as colunas/pairings antes de reconstruir resultados. A faixa compartilhada permanece intacta. |
| Prosa repetida após Random Professions | O seletor termina na linha 14314. As linhas 14315–14318 são preservadas como contexto editorial, sem virar resultados de profissão. |
| Ordem de dimensões e mudanças de idade | Formalizar escala, deltas, unidades e reclassificação de Size; não gerar novos Life Experiences automaticamente por anos adicionados. |
| Multiplicidade de causas de morte de ambos os pais | A nota não define claramente causa compartilhada versus separada; manter pendência em vez de inventar duas rolagens. |
| Ciclos publicados/opcionais | Siblings ↔ Character Fates, Strange → Strange, Piety → Piety. Registrar sujeitos, eventos e limites de execução/resolução manual nas etapas de geração. |
| Categoria da profissão familiar | Usar os subconjuntos de categorias permitidos pelo resultado. Não substituir por seletor d6 completo ou pool uniforme apresentado como regra oficial. |
| Referências externas, efeitos e GM | Preservar condições de uso de Tombs of the Desolation, Demon Lord’s Companion, Terrible Beauty, Tooth and Claw, Uncertain Faith, traits, Fortune, conexões e companions. Não ativar fontes ou efeitos por simples menção. |

Inventariar essas pendências conclui CUR-016, mas não aprova as tabelas para geração. Resultados/faixas, semântica e execução são revisões posteriores: CUR-017/018/019/020/021, com integração em CUR-033/034/035 e aceite em CUR-038/039. O inventário não muda os **230 bloqueios**, os **1.320 segmentos em quarentena**, os quatro MDs, seus ledgers, os IDs ou os contratos congelados.

## Reproduzir

```powershell
npm run curation:creation-tables
node tools/curation/creation-tables.mjs --check
npm run curation:check
npm test
npm run build
```

O gerador valida CUR-014/015 e as dependências antes de gravar. `--check` compara os artefatos sem sobrescrever; o runner pode escrever cache em `tmp/curation/`. Não há emissão de RandomTable importável, aplicação de efeito ou mudança de UI nesta tarefa.

Atualização posterior: **CUR-017 concluída** como [formalização de profissões e idiomas](entrega-profissoes-idiomas.md), com as categorias, escolhas e alfabetização por publicação. Próximo passo: **CUR-019 — Interesting Things**.

Gates aprovados em 2026-10-27: **91 testes de curadoria em 15 arquivos**, **165 testes completos em 22 arquivos** e build TypeScript/Vite. Os seis cenários novos também passaram isoladamente. Checks de insumos, 16 arquivos do contrato congelado, extrações, reconciliação, matriz e formalização Human aprovados, preservando o demo e seus dados. Não houve alteração de interface que exigisse novo E2E.


Atualização posterior: **CUR-018 concluída** como [formalização de riqueza e equipamento inicial](entrega-riqueza-equipamento.md), com 12 kits, 66 concessões de profissões, 19 ganhos adicionais e moeda exata. Próxima tarefa: **CUR-019 — Interesting Things**.
