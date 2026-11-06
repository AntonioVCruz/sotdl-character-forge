# Matriz da revisão Human L0 — #55

Revisão `human-l0-issue55@1.0.0`, Codex, 2026-11-04. Base: main `9c22a5c56373063de74ed3b48d2c2d3ba74b733f`. Este documento contém metadados; a matriz detalhada permanece em `tmp/private/human-l0-review.json`, ignorada pelo Git. Seu hash consta de `curation/human-l0-review-freeze.json`.

Cada registro detalhado liga identidade do resultado/entidade, lote, fonte, edição declarada na cópia consultada, hash do PDF, evidência por ID/hash/span do Markdown, candidatos de página, handler, arquivo de regressão, revisão e destino. IDs repetidos entre lotes permanecem qualificados pelo lote. São 2.932 registros, não 2.932 resultados distintos. A referência a um arquivo de teste indica regressão do lote; não afirma teste individual de cada entidade ou implementação integral de todos os efeitos.

| Lote | Registros | Evidências do lote | Handler principal | Regressão |
| --- | ---: | ---: | --- | --- |
| table-closure | 1.168 | 769 | procedure-graph.ts | procedure-source.test.ts |
| professions-languages | 194 | 35 | human-l0.ts | official-core-source.test.ts |
| wealth-equipment | 97 | 114 | core-equipment.ts | official-equipment-source.test.ts |
| interesting-things | 378 | 501 | core-interesting-things.ts | official-interesting-things-source.test.ts |
| items | 1.050 | 710 | core-equipment.ts | official-equipment-source.test.ts |
| core-level-zero | 28 | 77 | official-core.ts | finalization-source.test.ts |
| human-ancestry | 17 | 11 | human-l0.ts | finalization-source.test.ts |

Handlers ficam em `packages/character-generator/`; testes em `tests/`. Procedimentos combinam o grafo com `procedure-runtime.ts`, os handlers Core e `tools/curation/procedure-local-context.ts`. Resultados de Oddities usam também o construtor de planos nesse último arquivo. Os arquivos principais não representam handlers independentes para todos os suplementos mencionados nas fontes.

| Fonte consultada | Identificação da edição | Cópia exata | Paginação conferida no recorte |
| --- | --- | --- | --- |
| Core | Revised Edition na capa; copyright 2015; impressão não identificada | SHA-256 em human-l0-review-policy.json; 274 páginas físicas | Impressas 11–12 e 23–29 correspondem às físicas 12–13 e 24–30 |
| Only Human | Título e copyright 2016; edição numerada/impressão não informadas | SHA-256 no mesmo arquivo; 14 páginas físicas | Impressas/físicas 5–14 |
| Oddities, Artifacts, and Esoterica | Título e copyright 2019; edição numerada/impressão não informadas | SHA-256 no mesmo arquivo; 7 páginas físicas | Impressas/físicas 2–7 |

Ano de copyright não identifica ano de revisão nem tiragem. A identificação dessas cópias não altera o registro global das 95 fontes. Candidatos de página extraídos automaticamente continuam identificados como candidatos, com `printedAssociationVerified: false`; a conferência das páginas acima e dos casos de layout está registrada separadamente. Evidências de definições de itens fora dessas páginas não recebem certificação individual de paginação por esta revisão.

Todos os registros detalhados têm destino `local-only` e `distributionApproved: false`. O Git recebe o instrumento, a política de revisão, metadados do freeze e documentação. PDFs, imagens de conferência, transcrições, pilotos e matriz local não entram na entrega pública.
