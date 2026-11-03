# Lote real Core — projeção e conferência local

Decisão posterior: [perfil oficial local Humano Core L0 ativado](ativacao-oficial-local-core.md) por solicitação explícita do usuário. Essa ativação usa os dados reais conferidos nesta entrega, mantendo `needs-review` e as consequências não concluídas como pendências; não altera os artefatos históricos para declarar um aceite integral.

Executado pelo Codex em 2026-11-03 sobre a main `bf847e5`, preservando o trabalho incremental local de compilação/handlers. Esta entrega projeta dados reais dos pilotos CUR-016–021 e confere fontes, faixas, pesos, identidades e vínculos. Não usa as faixas fictícias do #44 para representar o livro.

**Resultado:** projeção local e conferência de integridade/referências entregues. Aceite semântico integral das consequências e aplicação no motor continuam separados. Nenhuma promoção para `curated`, habilitação de ruleset ou permissão de distribuição foi inferida.

## Execução

```powershell
npm run curation:core:local
npm run curation:core:local:check
```

O primeiro comando gera `bundle.json`, `index.json` e `report.json` em `tmp/curation/core-real/1.1.0/`, destino local ignorado. O segundo recompõe a projeção a partir dos insumos e compara os três arquivos, sem atualizá-los. Cada execução também repete a compilação em memória para conferir determinismo. Uma versão existente divergente é recusada, preservando a anterior. Rascunhos gerados nesta própria atividade foram arquivados localmente em `draft-before-producer-pins/` e `draft-before-query-link-bindings/` antes de fixar a saída final; nenhum artefato previamente aceito foi sobrescrito.

Código versionável: `packages/curation/human-l0-core-local.ts`, `tools/curation/core-local-projector.ts` e `core-local.mjs`. Testes públicos usam fatos inventados; a conferência com insumos licenciados fica em `tests/curation-core-local-source.test.ts`, explicitamente ignorada pela suíte quando o corpus local não existe.

O contrato `sotdl.human-l0.consumable@1.1.0` tem recorte explícito `lot: core`, `distribution: local`, `fictionalData: false`, `reviewStatus: needs-review`, `importablePack: false`, `rulesetEnabled: false` e `exportEnabled: false`. Não modifica o parser sintético `1.0.0`, os 16 arquivos congelados, o pack mecânico `0.2.0` ou o formato de save. Não é aceito automaticamente pelo importador de catálogo ou pelos handlers sintéticos.

## Cobertura conferida

| Unidade | Resultado local |
|---|---:|
| Tabelas Core | 22 |
| Fluxos/colunas | 23 |
| Resultados | 339 |
| Opções de profissão, com faixas completas | 102 |
| Resultados de Interesting Things | 120 |
| Programas de ganho vinculados | 7 |
| Consultas sem dado adicional | 2 |
| Ligações Core tipadas | 12 |
| Referências materiais preservadas | 203 |
| Intervalos de evidência conferidos | 157 |
| Registros da matriz Core contabilizados | 260 |
| Pins de entrada e produtor | 11 |

As 339 linhas incluem as duas colunas independentes de Roleplaying Traits, os roteadores e suas tabelas filhas. Cada coluna tem identidade de rolagem própria. Os pesos são contagens exatas das faces naturais; não há sorteio uniforme de linhas de larguras distintas. As duas composições de seletor cobrem 102 profissões e 120 resultados de Interesting Things.

As 36 opções anteriormente agrupadas no snapshot público **foram individualizadas a partir dos pilotos locais já existentes**: 12 martial, 7 religious e 17 wilderness. Somadas às seis opções dessas categorias já identificadas individualmente, as tabelas completas têm 14/11/17 linhas. Nenhum `rNN` ou limite foi inventado; as 102 profissões foram comparadas com a formalização CUR-017 e vinculadas à linha/faixa exata. A matriz histórica não foi reescrita; a cobertura local registra a expansão dos três grupos sem contar novamente as seis opções individuais.

As 120 consequências estruturadas de Interesting Things foram preservadas e comparadas com CUR-019, incluindo dez side rolls e 26 grupos de escolha, quantidades, patrimônio não disponível como dinheiro, sujeito/condição e fase de criação/uso. Isso não converte menções textuais a dados em comandos executáveis. Oddities continua padrão; Core continua alternativa explícita, sem fallback oculto.

Os sete programas são seis kits Core e o ganho adicional de Background 20. Mantêm quantidades, moedas, alternativas e origem. As 203 referências materiais conservam vínculos exatos, escolhas, restrições e destinos não inventariáveis do catálogo local. Definições de combate não são inferidas por nome nem copiadas da fixture; a aplicação/catálogo completo permanece no lote de equipamentos.

## Background, idiomas e pendências

Cada um dos 20 resultados de Background conserva seu texto local, evidência e uma obrigação explícita de revisão/aplicação. Nenhum deles é reduzido a marcador não mecânico. Foram preservados:

- As quatro menções estruturadas a Insanity/Corruption, sem aplicá-las ou reinicializar estados; resultados com dados mantêm a expressão e exigem contexto.
- O side roll de filhos da formalização revisada, em criação, com seu mínimo explícito; não é efeito da posse de um item.
- Os vínculos de viagem/educação: idioma escolhido concede fala; educação concede leitura de idioma já falado, sem inventar escrita.
- O programa material de Background 20, ligado somente a esse resultado, com sua quantidade/moeda estruturada.

Profissões preservam especializações e condições de alfabetização, inclusive a distinção entre profissão concedida e direito de escolha. Os seis idiomas nomeados e as duas categorias abertas permanecem distintos; uma categoria aberta exige decisão concreta. O benefício de ancestry continua exclusivo: idioma adicional **ou** profissão aleatória. As duas profissões iniciais conservam manual/aleatório conforme a formalização, sem somar automaticamente blocos Core e Only Human.

O relatório conta **188 vínculos com pendência de aplicação**, não 188 linhas ausentes: uma linha pode conter mais de uma obrigação. São escolhas de idioma/especialização, dimensões de Build, consequências completas de Background, programas materiais e adjudicação de Interesting Things. A projeção preserva essas obrigações, mas não declara handlers concluídos ou uma geração oficial utilizável.

## Evidência e limites do aceite

Antes de projetar, o gate da atividade 1 foi repetido: 301 hashes de bytes, 1.060 referências, 233 referências de saída, oito pins de fontes/transcrições, 258 registros estruturais e seis geradores em modo check. Os sete insumos de dados/matriz e quatro arquivos do produtor/contrato/writer são fixados por hash no documento local.

Para cada um dos 157 intervalos utilizados, o projetor relê o arquivo local, confere seu SHA256 de bytes e compara o intervalo/trecho normalizado pela mesma redação de dados de compra adotada pela curadoria. Isso verifica a transcrição disponível e sua derivação; não certifica uma nova inspeção de PDF ou paginação impressa. `publicationVersion: null` explicita que não foi atribuída uma edição/versão bibliográfica nova; a identidade dos insumos é fixada pelos hashes.

O gate recompõe a saída dos insumos verificados. Alterar texto, alvo de profissão, faixa, peso, condição ou remover uma obrigação não é corrigido por recalcular hashes da saída. Testes locais comparam conteúdo protegido por digests, sem imprimir texto de livro nos resultados.

Esta conferência aprova o recorte **projeção local, cobertura numérica e fidelidade dos vínculos aos pilotos**. Continuam pendentes o aceite semântico completo por consequência, os handlers reais, composição de equipamento, procedimento completo, exportação e habilitação. Atividade 1 não foi reaberta; fechar hashes e projetar tabelas não fecha a #34 inteira.

Hash do documento final desta execução: `acdeed2276af6e651caf889154b9debc326d826ab0d788a6ba2428d1617f8a41`. O relatório completo e os textos permanecem apenas no destino local ignorado. O registro público contém somente metadados; os artefatos reais não foram adicionados ao Git.

Validação: 537 testes completos em 54 arquivos aprovados. Após explicitar produtores das consultas e alvos das ligações no contrato, os oito testes específicos e o build/TypeScript passaram novamente. Geração/check locais (duas reconstruções por execução), freeze dos 16 arquivos e privacidade aprovados. Os testes reais verificam os insumos locais; em clone sem corpus, são explicitamente pulados, sem declarar conferência de livros inexistentes.
