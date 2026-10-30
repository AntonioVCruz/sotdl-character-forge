# Compilação determinística Human L0 — atividade 1 da #7

Entrega de 2026-10-30, primeira das quatro atividades acordadas: compilação determinística, índices de referências exatas, relatório de inclusões/exclusões/pendências e validação da fatia/dependência Core → Only Human.

## Escopo entregue

`tools/curation/pack-compiler.ts` compila os dois registros Human do staging local a partir da receita versionada `curation/human-l0-compilation.json` e do registro de fontes. A seleção usa IDs imutáveis; não depende de posição, ordem de leitura ou nome para gerar identidade. A receita declara versões e dependências exatas.

A projeção é **ancestry-only de metadados**, conforme a política vigente: ID, nome, fonte, página impressa declarada, variante, revisão e estado `needs-review`. Não inclui texto original/normalizado, evidências, fórmulas, tabelas ou outros campos do piloto. A página de PDF não é convertida em página impressa. `fictionalData` continua `false`, a fonte continua `needs-review` e nenhuma geração oficial é habilitada.

Selecionar registro ausente, duplicado, bloqueado, reference-only, restrito ou com identidade incompatível interrompe a compilação. O compilador usa os schemas existentes; mensagens de erro não expõem o conteúdo do staging. Apenas valores projetados afetam o hash do pack: mudar evidência privada sem mudar a projeção não muda o artefato. Os hashes dos insumos e a contabilização completa ficam para a atividade de relatório.

## Reprodução

Com o staging autorizado disponível localmente:

```sh
npm run curation:compile
npm run curation:compile
npm run curation:compile:check
```

Saída: `tmp/curation/compiled-human-l0/content-packs/<source-id-escapado>/0.1.1/pack.json`. Esse diretório é local e ignorado. Para outro diretório de ensaio, usar `node tools/curation/compile-packs.mjs --write --output tmp/<diretorio>`.

A versão de trabalho `0.1.1` distingue a projeção com páginas declaradas dos stubs manuais `0.1.0`, que permanecem intactos. Não representa publicação ou freeze mecânico. Uma saída existente com a mesma versão e conteúdo diferente é recusada; escolher nova versão na receita ou outro diretório de ensaio. Links simbólicos/junctions na saída também são recusados.

Objetos JSON têm chaves ordenadas por unidade de código, sem dependência de locale; entidades, dependências e arquivos têm ordenação explícita. Arrays com significado próprio não são reordenados genericamente. A serialização usa UTF-8, indentação de dois espaços e LF final; não inclui relógio, caminhos absolutos ou dados de execução. SHA-256 de cada arquivo e do conjunto ordenado é exibido no terminal.

Duas compilações do staging local e o check produziram:

| Artefato `0.1.1` | SHA-256 |
|---|---|
| Core | `cc819c55e162b357f4fccf333b346fa1f2f19d263c004fcf9da806a2f8559fe5` |
| Only Human | `9d1ca0023ffb45e53c8df122e3e4790491e6eb172410ee9408a96abe4e067cd8` |
| Conjunto ordenado de caminhos/hashes | `4fe3e568715b760bb5bae44a8b6df298b77dab53dc0c1b0d574b3e9152c57b44` |

Os testes públicos em `tests/curation-pack-compiler.test.ts` usam staging sintético, sem livros: repetição, variação da ordem das chaves/registros/receita, mudança de dados projetados, exclusão de evidências, rejeição de entradas inválidas e persistência/check sem sobrescrever versões existentes.

Validação local: nove testes novos e 266 testes completos aprovados com `node node_modules/vitest/vitest.mjs run --maxWorkers=2`, build e gate de privacidade aprovados. A primeira execução sem limitar workers teve dois timeouts em testes antigos de extração; a repetição com dois workers passou sem alterar testes ou seus limites.

## Atividades seguintes

- [x] 1. Compilação determinística desta projeção Human L0.
- [ ] 2. Índices temáticos com referências exatas.
- [ ] 3. Relatório de inclusões, exclusões, pendências e hashes de insumos.
- [ ] 4. Validação integrada da fatia e dependência Core → Only Human.

Os testes incluídos nesta atividade verificam o compilador e reutilizam a validação básica do catálogo; não concluem a validação cruzada CUR-032 ou o aceite integrado da atividade 4. A #7 e a CUR-031 permanecem parciais; projeções mecânicas, revisão de conteúdo e integração CUR-033/034 continuam necessárias.
