# Identidade, aliases e republicações — contrato 1

CUR-005 adota uma ocorrência por publicação/edição, sem mescla por nome. `packages/curation/identity.ts` define a identidade `sourceId:kind:entryKey:variantKey`, com limite total de 200 caracteres do catálogo. `sourceId` identifica a obra/edição no registro CUR-003; datas de errata fazem parte dessa identidade. Edições ainda desconhecidas permanecem provisórias e bloqueiam a aprovação do lote afetado, sem adivinhar uma edição.

`entryKey` é atribuída uma vez pelo curador num ledger por fonte e categoria, inicialmente a partir de um nome legível, e não é recalculada se o nome for corrigido. `variantKey` distingue apresentações internas (ex.: default, expanded, novice-variant); não codifica revisão mutável. Colisões no ledger exigem discriminador editorial explícito e justificado, nunca sufixo dependente da ordem de leitura. Tipo diferente produz outro ID. Nome, linha, posição no arquivo, hash de texto e versão de pack não compõem a identidade. O compilador deverá rejeitar IDs duplicados e registrar o ledger na CUR-031.

Revisão de conteúdo é `revision` e versão semântica do pack. O mesmo ID pode ter conteúdo corrigido em nova versão; referência histórica inclui sempre `packId`, `version` e `entityId`. Nunca substituir bytes sob a mesma versão. Se uma edição identificada mais tarde exigir outro sourceId, publicar migração explícita antigo→novo, com justificativa e histórico preservado. Não renomear referências salvas silenciosamente.

| Situação no insumo | Representação a produzir na extração |
|---|---|
| Mesmo nome em duas obras | Dois IDs por fonte, mesmo que os textos pareçam iguais. |
| Core e versão expandida | Ocorrências independentes; `variant-of` proposto ou verificado com evidência. |
| Reimpressão transcrita integralmente | Ocorrência própria, evidência local e possível `reprint-of`. |
| MD geral remete reimpressão idêntica apenas no manifesto | Ocorrência de staging `reference-only`, evidência da declaração e destino proposto; sem copiar texto ou página da obra-base como se fossem da reimpressão. Não compilar até conferir o vínculo e a página. |
| Mesmo texto aparente em fontes diferentes | Grupo de busca/equivalência com membros independentes; hash igual é candidato, não prova de identidade mecânica. |
| Dependência omitida, derivação ou template | Identidade própria e relação explícita, com lacuna/GM onde necessário; nunca converter automaticamente em ancestry/path comum. |

Os protocolos dos MDs ficam compatíveis assim: todos preservam ocorrências por publicação; a forma `reference-only` registra a ausência deliberada de transcrição no MD geral. Ela não conta como conteúdo completo. A CUR-013 distinguirá ocorrências integrais, referências e exclusões, sem inflar contagens de entidades utilizáveis.

Aliases de busca são rótulos secundários (grafias, tradução, nome anterior), não chaves e não regras de precedência. Alias de publicação segue `curation/source-aliases.json`; propostas não resolvem referências. Agrupamentos e `LineageSchema` guardam relação, destino, status proposed/verified, evidência, responsável e motivo. Só a revisão do conteúdo pode confirmar equivalência; até lá a UI/compilador deve mostrar candidatos separados. Mesmo uma relação verificada não autoriza unificar IDs ou conteúdo.

Exemplos de identidade, sem afirmar equivalência mecânica:

- `sotdl:shadow-of-the-demon-lord-core:ancestry:human:default`
- `sotdl:only-human:ancestry:human:expanded`
- `sotdl:demon-lord-errata-10oct17:rule:crawl:default`
- `sotdl:demon-lord-errata-19nov17:rule:crawl:default`

Essas chaves demonstram o contrato. A atribuição definitiva de cada entrada pertence ao ledger da extração; nenhum dos exemplos declara conteúdo curado.
