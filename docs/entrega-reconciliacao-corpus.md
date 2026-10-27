# CUR-013 — reconciliação de contagens, cobertura e pendências

Revisão de auditoria: **2026-10-27**. Revisão dos inputs: **2026-10-26**, identificada pelos hashes do manifesto atual. Foram cruzados os quatro MDs, os relatórios de extração, o staging, os segmentos do MD geral, o registro de fontes e a normalização editorial. Nenhum input, ID, estado de revisão ou conteúdo de staging foi alterado.

## Resultado e alcance

As **151.625 linhas** têm um destino ou contexto explícito, sem lacunas ou sobreposições de contabilização. O inventário contém **5.560 registros**: 59 ancestries, 392 paths, 1.520 spells e 3.589 segmentos gerais. Os 4.162 objetos de staging têm correspondência única nesse inventário e IDs canônicos não nulos, após a confirmação dos aliases e a decisão de precedência da revisão mais recente nas 14 atribuições conjuntas de erratas.

| Destino do inventário | Registros |
|---|---:|
| Captured | 3.932 |
| Blocked | 230 |
| Quarentena preservada em sidecar | 1.320 |
| Layout preservado | 78 |

Esses estados descrevem captura e revisão local. A auditoria não certifica completude dos PDFs, edição, distribuição, mecânica ou automação. O fato de todo texto do MD estar contabilizado não resolve suas ambiguidades de transcrição/segmentação. Restam 230 bloqueios, após as decisões explícitas de uso independente de GIANT RAVEN como monstro e precedência da errata mais recente; a quarentena de CUR-011 foi mantida, sem promoção de conteúdo para curated.

## Contagens declaradas versus observadas

| Insumo / métrica | Declarada | Observada | Situação |
|---|---:|---:|---|
| Ancestries: ocorrências publicadas | 59 | 59 | Coincide |
| Ancestries: nomes distintos | 45 | 45 | Coincide |
| Ancestries: fontes com entradas | 40 | 40 | Coincide |
| Paths: ocorrências publicadas | 392 | 392 | Coincide |
| Paths: combinações nome/categoria | 380 | 380 | Coincide |
| Paths: fontes com entradas | 59 | 59 | Coincide |
| Spells: ocorrências publicadas | 1.520 | 1.520 | Coincide |
| Spells: agrupamentos de origem | 57 | 57 | Coincide |
| Spells: fontes com entradas | 27 | 28 | Divergência aberta |
| Manifesto geral: publicações | 95 | 95 | Coincide |

As sete categorias de ancestry e as cinco de path também coincidem com seus resumos, totalizando **22 comparações**, das quais 21 coincidem. Os valores declarados são lidos do MD com linha/hash de evidência, sem usar somente números dos relatórios como prova. As 189 declarações por fonte das listas de ancestries/paths foram cruzadas com o observado; após a confirmação das grafias pelo usuário, todas têm fonte resolvida e quantidade correspondente.

O MD de paths tem **391 cabeçalhos de nome para 392 ocorrências**. A segunda publicação de Adept começa em novos metadados na linha 251 e herda o nome da linha 168. Ela tem staging e evidência próprios. Ancestries têm 59 cabeçalhos/59 ocorrências; spells têm 1.520/1.520. Cabeçalhos e exemplos dentro de cercas não são contabilizados como entradas externas.

### Divergências documentais mantidas

1. O resumo de spells declara 27 fontes, mas os metadados das 1.520 entradas contêm 28 rótulos. Todas as fontes, incluindo *Paths of Power*, foram preservadas. A auditoria não escolhe uma publicação para excluir nem presume qual número do resumo foi atualizado incorretamente.
2. **Path of the Adept** aparece no manifesto geral, mas não aparece nas listas de fontes com/sem ancestry formal do MD de ancestries. Isso explica por que essas listas representam 94 fontes enquanto o projeto registra 95. Não se infere que exista uma ancestry faltante ou que sua ausência tenha sido intencional: é uma lacuna documental explícita. A publicação tem suas ocorrências de path contabilizadas normalmente.

Não há divergência entre as contagens observadas e os destinos dos derivados. As duas inconsistências acima são findings abertos sobre as declarações dos insumos, sem alterar as fontes.

## Artefatos e referências

- `tools/curation/reconciler.ts` e `tools/curation/reconcile.mjs`: auditor, sem interpretar texto como código.
- `curation/reconciliation/inventory.jsonl`: 5.560 registros unificados com tipo/contexto, estado, fonte(s), hashes, posição e referência ao staging/sidecar.
- `curation/reconciliation/coverage.jsonl`: intervalos completos de cada MD, destinos e motivos, inclusive protocolo, exemplos, metadados, cercas e auditoria editorial fora das entidades.
- `curation/reconciliation/sources.json`: matriz das 95 publicações, declarações de inclusão/exclusão do manifesto, contagens observadas, atribuições compartilhadas e candidatos de aliases não confirmados; também inclui as 189 declarações das listas de ancestries/paths.
- `curation/reconciliation/duplicates.jsonl`: grupos candidatos de homônimos/texto igual/duplicatas sem discriminador, preservando todas as ocorrências.
- `curation/reconciliation/findings.jsonl`: divergências, pendências e informações contabilizadas, com referências aos registros.
- `curation/reports/reconciliation.json`: resumo, gates, datas de revisão, contagens e hashes de todas as dependências e saídas.

Referências de JSONL usam record com base 1. Referências aos relatórios de ancestries/paths/spells incluem collection=occurrences e a posição com base 1 no array. O inventário não duplica texto mecânico: guarda hashes e aponta para a evidência já preservada. Intervalos de contexto recebem motivo explícito; não são apagados nem declarados irrelevantes para toda finalidade futura.

O auditor confere cada stat/entidade contra o texto exato do MD, a evidência de contexto e a referência de fonte. Valida separadamente todos os blocos cercados e metadados Source/Fonte externos às cercas; metadado ou payload sem destino faz o gate falhar. Conferir apenas a soma de linhas não seria suficiente: ranges com sobreposição ou buracos também falham, mesmo quando os totais parecem iguais.

## Matriz de publicações e aliases

Para cada fonte, a matriz conserva título, edição/revisão declarada, linha do manifesto, descrição de conteúdo incorporado/excluído, estado observado por corpus e destinos. Declarações de auditoria de PDF no insumo permanecem declarações MD. Fonte sem registro direto não é certificada como ausente ou completa por inferência.

O usuário confirmou as opções candidatas em 2026-10-27, resolvendo **seis referências de três grafias**:

- `Disciple of The Demon Lord` → **The Disciple of the Demon Lord** (uma referência).
- `Oddities Artifacts and Esoterica` → **Oddities, Artifacts, and Esoterica** (quatro referências).
- `Heavens Sent` → **Heaven’s Sent** (uma referência).

Não restam aliases pendentes: as 2.397 referências do registro estão resolvidas. Os **31 segmentos** de Oddities agora têm atribuição canônica na matriz, mas continuam em quarentena por seus próprios motivos. GIANT RAVEN recebeu o ID `sotdl:heaven-s-sent:creature:u002901:stat-block`. Posteriormente, o usuário autorizou seu uso independente como monstro, sem associação a Raven Rider: `curation/mechanics-decisions.json` resolve essa dependência e passa a entrada para captured, preservando o texto e seu ID. Essa decisão não implementa o caminho nem certifica a mecânica. As demais entradas, os textos brutos e os ledgers foram preservados. A decisão de identidade e suas provas estão em `curation/reports/remaining-source-aliases.json`; os snapshots anteriores estão em `curation/history/remaining-source-aliases-2026-10-27/` e `curation/history/giant-raven-independent-2026-10-27/`.

Em 2026-10-27, o usuário determinou que, em atribuições conjuntas, prevalece a fonte mais recente. As 14 correções de errata foram atribuídas a **Demon Lord Errata (19nov17)**, de 2017-11-19, com precedência sobre **Demon Lord Errata (10oct17)**, de 2017-10-10. As decisões por chave e hash estão em `curation/mechanics-decisions.json`; o extrator confere as datas de revisão e rejeita decisões que selecionem uma revisão anterior, empatada ou sem data comparável. As duas fontes originais continuam na evidência; o inventário registra `originalSourceIds` e `attributionResolution`, mas contabiliza cada correção uma única vez sob a revisão escolhida. Os 14 registros passaram de blocked para captured e receberam IDs canônicos. Revisão anterior em `curation/history/latest-errata-2026-10-27/`. A decisão resolve a atribuição no staging; não aplica automaticamente as correções ao Core nem certifica o conteúdo dos PDFs.

## Duplicatas e variantes

Foram registrados **509 grupos candidatos**, com critérios que podem se sobrepor:

- **472** grupos de mesmo nome/contexto, úteis para comparar publicações e unidades preliminares.
- **26** grupos com corpo textual exatamente igual, sem certificação de equivalência mecânica ou de reimpressão.
- **11** grupos de segmentos indistinguíveis pelos seletores atuais, contendo as **33 ocorrências** já sinalizadas em CUR-011.

Cada membro preserva sua posição, referência, fonte e ID quando existente. HEAT WAVE e SPELLBOUND WEAPON continuam com publicações distintas. Uma entidade não é removida por compartilhar nome ou hash. Os grupos não escrevem relações verified, não escolhem precedência e não alteram o ledger. Duplicatas sem discriminador continuam em quarentena com todas as cópias representadas; não viram um único registro por conveniência.

## Normalização e pendências

Os **2.216 diffs** de CUR-012 possuem destino em overlays, e os **656 overlays** apontam para faixas do inventário. O replay das quatro cópias normalizadas recupera exatamente a revisão bruta. Hashes do staging e dos segmentos coincidem com os usados no relatório de normalização.

Os **28.971 sinais editoriais** para revisão aparecem agrupados por categoria nos findings, com filtro/caminho para suas linhas originais; não foram duplicados como novos erros de entidades. Quebras de prosa prováveis continuam sinais, não erros confirmados. A limpeza não liberou os bloqueios semânticos ou de fonte.

Pendências de maior impacto para os próximos lotes: região/dependências de unidades bloqueadas; limites de stat blocks longos; discriminação de duplicatas; reconstrução de tabelas e classificação dos 1.320 trechos em quarentena. Candidatos de item e criatura continuam preliminares. Esses registros têm destino e motivo, mas ainda precisam de revisão antes de compilar conteúdo utilizável.

A [lista completa das 230 entradas bloqueadas](entradas-bloqueadas-curadoria.md) informa chave, nome capturado, fonte, motivo e linhas do MD, sem duplicar entradas com mais de um motivo. É um retrato desta revisão, após a liberação do uso independente de Giant Raven.

## Reprodução e validação

```powershell
npm run curation:reconcile
node tools/curation/reconcile.mjs --check
npm run curation:check
npm test
npm run build
```

`--write` gera os resultados somente após validar insumos, relatórios, derivados, faixas e dependências. `--check` não regenera saídas; o runner pode atualizar cache em `tmp/`. Input/relatório/staging/normalização adulterados fazem o gate falhar antes de gravar a reconciliação. A data 2026-10-27 é explícita nesta revisão da ferramenta, sem timestamp do host; uma revisão nova deve alterar sua identificação de forma deliberada.

Os nove cenários de `tests/curation-reconciliation.test.ts` cobrem gaps/overlaps, exemplos dentro de cercas, listas no escopo correto, contagens reais, nome herdado de Adept, todos os registros/linhas, declarações de exclusão, aliases/shared errata, duplicatas sem mescla, overlays/diffs, determinismo e adulteração sem sobrescrita.

Revalidação após as decisões de uso independente de Giant Raven e precedência da errata mais recente em 2026-10-27: `npm run curation:check` (12 arquivos / 67 testes), `npm test` (19 arquivos / 141 testes) e `npm run build` (TypeScript e Vite). Os quatro inputs, IDs anteriormente atribuídos e contratos congelados permaneceram intactos. Giant Raven e as 14 correções de errata passaram de blocked para captured; somente as erratas receberam novos IDs. O staging e os relatórios dependentes foram regenerados. Não houve alteração no fluxo do navegador que exigisse novo cenário E2E.

Atualização posterior: **CUR-014 concluída como matriz de análise**, com [entrega do piloto Human/Core](entrega-piloto-core-nivel-zero.md): 28 passos, 77 faixas de evidência e introdução geral/idiomas fornecidos e pendências restantes das tabelas; originais e suplementação são distinguidos. Captura e quarentena mantêm seus estados. Próxima tarefa: **CUR-015 — ancestry inicial e características derivadas**, sem tratar tabela em quarentena como procedimento pronto ou captura como regra mecanicamente aprovada.
