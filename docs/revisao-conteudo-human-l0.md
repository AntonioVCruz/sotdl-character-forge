# Revisão de conteúdo Human L0 — Core e Only Human

Revisão de 2026-11-02, executada por **Codex / análise local**, como atividade 1 da próxima entrega mecânica. Registro de metadados: [human-l0-base-2026-11-02.json](../curation/reviews/human-l0-base-2026-11-02.json).

Entrega posterior: o [contrato mecânico Human L0 v1](contrato-mecanico-human-l0.md) atende C01–C03 no formato e na validação. As conclusões e evidências abaixo conservam o escopo da revisão original; projeção e integração ao motor continuam pendentes.

## Resultado e escopo

A base de Human nível 0 foi conferida contra os MDs e transcrições locais: atributos, ajuste opcional, características derivadas, Size, estados iniciais, idiomas/profissões e fronteiras de procedimento/nível. Foram examinadas **15 verificações temáticas e 15 faixas de evidência**, com reabertura dos arquivos e conferência dos hashes e limites dos trechos. As **15 fórmulas numéricas** do modelo de referência são coerentes com essa base. Não foi encontrada divergência numérica que exija corrigir o formalizador nesta revisão.

O resultado permite preparar o contrato mecânico da base, com as heranças e decisões abaixo explícitas. A revisão dos resultados completos de todas as tabelas, dos equipamentos e da progressão não foi refeita neste recorte. As entregas locais CUR-016–021 continuam como insumos próprios para esses lotes, sem um novo aceite integral atribuído a este registro.

O ledger contém IDs, avaliações, locais e hashes de evidência; não contém excertos, texto dos livros ou novos dados mecânicos de pack. O relatório de trabalho com as evidências completas permanece em `curation/reports/human-l0-content-review.json`, ignorado pelo Git.

## Fontes e paginação

| Fonte examinada | Localização | Paginação observada |
|---|---|---|
| Human/Core no MD de ancestries | Linhas 14712–14775; Build em 14866–14876 | Cabeçalho declara página impressa 11 e PDF 12. |
| Human/Only Human no mesmo MD | Linhas 13618–13651 e 13719–13734 | Cabeçalho declara página impressa 5 e PDF 5. |
| Regras gerais no MD de regras | Atributos/modificadores em 1076–1086; características em 1241–1269 | Paginação dos trechos não certificada nesta revisão. |
| Introdução e profissões fornecidas pelo usuário | `curation/corrections/core-character-creation-2026-10-27/introduction.txt` e `core-professions-2026-10-27/professions.txt` | Transcrições preservadas por hash, sem página física inspecionada. |
| Decisões do produto | `curation/pilot/creation-decisions.json` | Preferência por expansão, alternativas Core, Size e concessões de idioma. |

As páginas do cabeçalho identificam o início declarado da entrada. Não certificam a página de cada subtrecho, nem autorizam converter página impressa em página física por offset. **Nenhum PDF foi inspecionado.** Edição/proveniência e permissão de distribuição continuam `needs-review`.

## Conferência das regras

Os códigos R01–R15 do ledger apontam às evidências e à natureza de cada conclusão.

| Verificação | Resultado confirmado para a base |
|---|---|
| R01 — Identidade e fonte | Core e Only Human conservam fontes e IDs distintos; páginas permanecem declarações do MD. |
| R02 — Atributos fixos | Nos dois blocos: quatro scores 10 e exatamente um aumento de 1. |
| R03 — Atributos aleatórios | Only Human oferece quatro resultados independentes de `8 + 1d3`; o aumento do ramo fixo não é somado. Não foi localizada essa opção no bloco Human/Core examinado. |
| R04 — Ajuste geral | Uma transferência opcional de +1/−1 entre atributos diferentes, depois dos scores iniciais; respeitar 1–20. Não há compra livre de pontos ou repetição da transferência. |
| R05 — Características-base | Health deriva de Strength, Perception de Intellect e Defense desarmado de Agility, após as escolhas/ajuste de atributos. |
| R06 — Healing Rate | Core explicita arredondamento para baixo; a regra geral impõe mínimo 1. Only Human conserva a divisão por quatro sem declarar outro arredondamento: a herança do Core precisa permanecer identificada. |
| R07 — Size/Speed/Power | Size 0,5 ou 1, Speed 10 e Power 0 aparecem nos dois blocos. |
| R08 — Size versus Build | A tabela Build examinada não concede mudança explícita de Size. A independência adotada também é uma decisão expressa do usuário, não uma citação acrescentada ao livro. |
| R09 — Estados iniciais | Core explicita Damage, Insanity e Corruption em zero. Only Human omite esses campos: conservar o padrão Core por herança, sem atribuir os zeros ao texto do suplemento. |
| R10 — Modificadores e limites | Modificador = score − 10; Perception funciona como atributo. Defense e Perception têm teto geral 25, inclusive após os modificadores aplicáveis. |
| R11 — Idioma inicial | Os dois blocos concedem fala de Common Tongue; essa concessão não concede alfabetização automática. |
| R12 — Direitos Core | O procedimento geral inicia com duas profissões. O benefício Human adicional é idioma **ou** profissão aleatória, sem conceder as duas alternativas. A troca geral de profissão pode conceder fala em outro idioma ou leitura em idioma já falado; escrita depende da concessão efetivamente publicada. |
| R13 — Direitos da expansão | O bloco Only Human remete os ganhos adicionais às tabelas de desenvolvimento. Não somar automaticamente os blocos das duas publicações. |
| R14 — Procedimentos | O texto permite Human Development com ou sem a variante de atributos. Core admite escolhas nas tabelas de ancestry; Human Development prescreve seu procedimento completo, resultados rolados e substituição do procedimento normal de profissões aleatórias/riqueza. A preferência por tabelas suplementares vem da decisão do produto e não força atributos aleatórios. |
| R15 — Fronteira do nível | Health +5, alternativas de magia/tradição e Determined dos blocos de nível 4 não entram no nível 0. As diferenças entre as versões de Determined permanecem vinculadas às fontes para CUR-023. |

Fala, leitura e escrita precisam continuar distintas. O modelo local de idiomas já preserva concessões parciais e trata alfabetização parcial como pendência quando uma opção exige alfabetização completa. Essa revisão não transforma leitura isolada em leitura/escrita nem inventa um teto de trocas de profissão.

## Exemplos numéricos conferidos

| Escolha | Str/Agi/Int/Will | Health | Defense | Perception | Healing Rate |
|---|---|---:|---:|---:|---:|
| Fixo, aumento em Str, sem transferência | 11/10/10/10 | 11 | 10 | 10 | 2 |
| Fixo, aumento em Str, transferência +Str/−Agi | 12/9/10/10 | 12 | 9 | 10 | 3 |
| Only Human, faces 1/2/3/1, sem transferência | 9/10/11/9 | 9 | 10 | 11 | 2 |

Esses são valores-base. Resultados posteriores de desenvolvimento, background, equipamento ou efeitos têm suas próprias origens e podem alterá-los. Os checks existentes também verificam as 81 combinações dos quatro d3 e as 12 transferências entre atributos distintos para cada combinação.

## Requisitos identificados para a atividade 2: contrato mecânico

**C01 — Proveniência por variante e herança.** O sidecar atual compartilha fórmulas/evidências entre as duas publicações. Por exemplo, as evidências do modo fixo e de algumas características reúnem os dois blocos; o arredondamento e os zeros têm composição herdada para Only Human. O contrato de consumo deve distinguir a evidência aplicável a cada variante, o valor declarado e a origem da herança. A mera presença de um trecho Only Human na lista compartilhada não prova que todos os números estão declarados nele.

**C02 — Procedimento de tabelas separado do modo de atributos.** `HumanBaseRequestSchema` cobre variante/modo/Size/transferência; não representa a seleção do procedimento completo de tabelas. `additionalChoice` é referência de curadoria, não execução dos direitos finais. O próximo contrato deve compor explicitamente atributos, procedimento e concessões de idioma/profissão, preservando exclusividades e sem somar ganhos Core depois do desenvolvimento por conveniência.

**C03 — Camadas de base e valor final.** As fórmulas atuais são uma prévia da base. O contrato deve conservar essa distinção ao aplicar resultados posteriores: recalcular dependências de atributos/Health, aplicar modificadores diretos na camada correta, respeitar os tetos de Defense/Perception no resultado final e não restaurar estados iniciais depois de efeitos. Reutilizar somente o número final da prévia perderia essas relações.

São requisitos para a próxima etapa, não alterações já implementadas no motor. O contrato mecânico, a projeção dos packs e os handlers permanecem atividades seguintes.

## Efeito da revisão e pendências

O ledger registra conferência local de transcrição/estrutura e das afirmações mecânicas da base. Ele não promove a revisão da entrada inteira de staging: os registros também incluem assuntos fora deste recorte, como nível 4. Assim, o staging continua captured, os packs continuam `needs-review` e o relatório do compilador conserva as pendências dos seus sujeitos completos.

Continuam pendentes: inspeção de PDF/paginação por trecho quando necessária, proveniência/edição e distribuição, aceite dos lotes completos de tabelas/equipamentos, contrato mecânico com C01–C03, projeção/handlers e freeze/habilitação oficial. A autoria desta revisão é do Codex; não se atribui parecer independente a um Curador ou aprovação do titular.

Validação executada: hashes dos seis insumos e de 15 faixas conferidos; `node tools/curation/human-ancestry.mjs --check` aprovado; 18 testes existentes de Human/base e matriz Core aprovados. Não foram criados testes novos para a alteração documental. Antes de reutilizar o aceite, conferir os hashes do ledger contra a revisão dos insumos e dos artefatos.
