# Revisão dos PRs #44 → #47 → #46

**Entrega posterior — lote real Core:** a [projeção local `1.1.0`](entrega-core-real-issue34-atividade3.md) foi gerada e conferida contra os pilotos/fontes: 22 tabelas, 23 fluxos, 339 resultados, 102 profissões e 157 intervalos de evidência. As 36 opções agrupadas na fixture histórica foram individualizadas localmente; o snapshot público foi preservado. Os achados/limitações de projeção sintética abaixo descrevem as etapas anteriores. Aplicação integral das consequências, demais lotes reais e habilitação seguem pendentes.

## Integração autorizada — 2026-11-03

Os três PRs foram mesclados na ordem solicitada, verificando a CI do head exato antes de cada merge. Após #44, o #47 foi sincronizado com main e revalidado; após #47, o #46 foi sincronizado/revalidado, incluindo a união das razões de pendência de atividades 4/5 no schema. Os conflitos documentais preservaram a atividade 1 fechada, a atividade 2 aceita e as atividades 3–8 abertas até aceite completo dos lotes reais.

| PR | Head aprovado antes do merge | CI aprovada | Commit de merge na main |
|---|---|---|---|
| #44 | `88e51f277d5f87aa04ed21ec6ad51dcfef527433` | [41578730279](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41578730279) | `06e6270fe59995a94691043c9e091750c996665e` |
| #47 | `eb772e69d2e96decec412f2e55c1de5be4bc922f` | [41579138337](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41579138337) | `b6a298a711e6569c766cd4d82e3487eafe211895` |
| #46 | `e6210b2ce46384072e9f3672e57effa920083ba4` | [41579339769](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41579339769) | `bf847e5ceca087e5b8afe5dc8341bdfc915b740b` |

A main local foi atualizada por fast-forward até `bf847e5`. O trabalho local não publicado de compilação/handlers foi preservado em stash e backup privado sob `tmp/local-work-before-pr-merges/`, restaurado e reconciliado com os documentos integrados. O stash foi mantido como cópia de segurança. A fixture pública fixada em LF foi restaurada aos bytes esperados pela receita local; conteúdo real e derivados não foram alterados.

Validação final: [CI da main `bf847e5` aprovada — run 41579455000](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41579455000). No ambiente local com o trabalho restaurado, 528 testes completos passaram em 52 arquivos. O TypeScript identificou a nova variante `authorized-rules` no handler incremental ainda não publicado: foi adicionada uma pendência explícita `modifier-rule-context-required`, sem inferir um modificador ou resolver o resultado sem contexto. Após essa adaptação, 29 testes direcionados, build/TypeScript, check consumível, freeze dos 16 arquivos e privacidade passaram. A adaptação permanece local junto com a infraestrutura; não altera os commits remotos mesclados.

As observações abaixo de PRs abertos, CI pendente ou “nenhum merge” são histórico das etapas anteriores. O merge integra código e fixtures sintéticas; não concede aceite semântico, aprovação de distribuição ou habilitação do ruleset.

## CI anterior à integração — conferência em 2026-11-03

A ausência de checks foi diagnosticada: os três PRs estavam `CONFLICTING` / `DIRTY` contra a main, com conflitos em `docs/estado-issues.md` e `docs/roadmap-issue34.md`. O workflow estava ativo, Actions habilitado, `pull_request` configurado e `push` limitado à main. O GitHub [não executa workflows de `pull_request` enquanto há conflito](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows). Portanto, os pushes das correções não iniciaram a CI; não era necessário relaxar permissões ou alterar os gatilhos.

A main `a717813` foi integrada em cada branch, na ordem #44 → #47 → #46, por commits de merge sem reescrever histórico. Os dois documentos foram reconciliados preservando o fechamento da atividade 1 e a atividade 2 aceita; 3–8 continuam abertas, sem aceite semântico. As correções P2 foram preservadas. A atualização das branches iniciou automaticamente a CI de `pull_request`.

| PR | Head remoto conferido | CI do head atual | Estado contra main |
|---|---|---|---|
| #44 | `88e51f277d5f87aa04ed21ec6ad51dcfef527433` | [SUCCESS — run 41578730279](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41578730279) | `CLEAN` / `MERGEABLE` |
| #47 | `06d604f0e3ed238afd845f8b1d603f9f3b97b634` | [SUCCESS — run 41578743810](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41578743810) | `CLEAN` / `MERGEABLE` |
| #46 | `42457437e11e6ff809d7d3aed4835c001f5d0caf` | [SUCCESS — run 41578751245](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41578751245) | `CLEAN` / `MERGEABLE` |

O check `test and build` foi conferido como `COMPLETED` / `SUCCESS` no `statusCheckRollup` de cada head, incluindo privacidade de conteúdo/histórico, regressões de histórico, testes e build. Após a sincronização, os testes locais direcionados também passaram: 61 no #44, 86 no #47 e 77 no #46. Nenhum PR foi mesclado na main, nenhum gate foi enfraquecido e o trabalho local de compilação/handlers não publicado foi preservado. As observações históricas abaixo de “CI sem checks” foram superadas por esta conferência.

## Histórico de correções e parecer original

**Atualização de 2026-11-03 — P2 do #46 corrigido e publicado em `4a517dc`.** As seis linhas e as trinta chaves dos cinco lookups usam os IDs do produtor do #47, sem alterar nomes de programas, consequências ou pesos. Três testes novos conferem o extrato público de identidades de #47 em `102c580`, aceitam seus IDs como resultado anterior e recusam as chaves antigas por nome. As duas regressões de incompatibilidade falharam antes da correção e passaram depois. Foram aprovados 77 testes direcionados e **124 testes em oito arquivos na composição isolada dos três PRs**, incluindo as quatro reproduções originais e a conferência com a coluna completa gerada pelo builder do #47. Build/TypeScript, freeze e privacidade aprovados. **Os três P2 estão corrigidos nas branches; nenhum PR foi mesclado e os lotes reais continuam sem aceite.**

**Atualização de 2026-11-03 — P2 do #47 corrigido e publicado em `102c580`.** O gate compara a regra completa `id/tableId/results/delta/afterDice`; builder e gate compartilham a lista autorizada, sem mudar a fixture ou pesos. Cinco testes novos cobrem adulteração de delta/resultados/tabela nas seis regras, fase e conferência com o resolvedor existente. As três regressões de adulteração falharam antes da correção e passaram depois. Validação naquela etapa: 86 testes direcionados, 119 na composição isolada, build/TypeScript, freeze e privacidade aprovados. As duas reproduções originais do #47 passaram; a do #46 ainda estava pendente e foi corrigida posteriormente, conforme atualização acima. Nenhum merge ou aceite semântico dos lotes reais.

**Atualização de 2026-11-03 — P2 do #44 corrigido e publicado no commit `7e3f13d`.** O gate passou a conferir o alvo de cada `grant-profession` contra o ID da linha, preservando a validação de cobertura. Três regressões novas falharam antes da correção e passaram depois: outro alvo da mesma categoria, alvo de outra categoria e troca mútua de alvos. Os 61 testes direcionados (incluindo a reprodução original), build/TypeScript, freeze de 16 arquivos e privacidade passaram. Os achados abaixo descrevem os heads originais. O P2 do #47 foi corrigido posteriormente, conforme atualização acima; #46 continua pendente. #44 não foi mesclado e o lote real continua sem aceite.

[Correção registrada no PR](https://github.com/AntonioVCruz/sotdl-character-forge/pull/44#issuecomment-6595191093). A composição isolada com #47/#46 também aprovou 112 testes em cinco arquivos, incluindo as três novas regressões e a reprodução original do #44. As reproduções dos P2 de #47/#46 não estão nessa contagem nem foram declaradas corrigidas. Na conferência após o push, `statusCheckRollup` do novo commit ainda estava vazio; o CI verde anterior pertence ao head original, não à correção.

[Correção do #47 registrada no PR](https://github.com/AntonioVCruz/sotdl-character-forge/pull/47#issuecomment-6595287957). Após o push, o head remoto foi conferido em `102c5809d70850eed718b05eb28fe65016b1770f`; a CI ainda não tinha checks reportados para esse commit. O verde do head original não foi atribuído à correção.

Revisão técnica do Codex em 2026-11-03, executada nessa ordem. Base de comparação e composição: main `a717813` (fechamento local da atividade 1 via #49). Os três PRs continuam abertos; a revisão não executa merge nem concede aceite semântico aos lotes reais das atividades 3–5 da #34.

| PR / atividade | Head revisado | Testes existentes direcionados | Parecer publicado |
|---|---|---:|---|
| #44 / 3 — Core | `4098ffa1b140e8f0fa7f41709662d00834b6653d` | 57 | [Uma correção P2 necessária](https://github.com/AntonioVCruz/sotdl-character-forge/pull/44#pullrequestreview-5746829532) |
| #47 / 4 — Only Human/Oddities | `d1634940d55261a7b0eb8e74e6a41b6ffcc73469` | 79 | [Uma correção P2 necessária](https://github.com/AntonioVCruz/sotdl-character-forge/pull/47#pullrequestreview-5746829842) |
| #46 / 5 — kits/itens | `c8fdecc2570e103b80f429177bac7fb31c92a4b0` | 74 | [Uma correção P2 necessária](https://github.com/AntonioVCruz/sotdl-character-forge/pull/46#pullrequestreview-5746830117) |

As revisões foram publicadas como `COMMENTED`, com comentário na linha do código. O parecer é corrigir e revalidar antes da integração. Os registros anteriores de “OK técnico/semântico” não comprovam os vínculos agora testados; esta revisão não atribui aprovação a outra pessoa ou papel.

## #44 — conferir o alvo da profissão concedida

**P2**, `packages/curation/human-l0-core-lot.ts:747–750`. O gate monta `granted` com `row.id`, sem conferir se `effect.professionId` corresponde à opção dessa linha. A cobertura continua correta mesmo quando o efeito concede outra profissão.

Reprodução: construir o lote com `buildHumanL0CoreLot(matrix)` e alterar somente o `effect.professionId` da primeira linha de `core:profession-academic` para `pilot-profession:core:common:r01`. `parseHumanL0CoreLot` aceita o documento adulterado. A regressão que exige rejeição falha.

Correção esperada: validar a correspondência entre identidade da opção, origem da linha e alvo do efeito; cobrir a troca por outra profissão existente, sem alterar os IDs da cobertura.

Limite distinto do achado: os marcadores de Background/Wealth e as faixas `synthetic-even-split` são formas explicitamente fictícias. A ausência da consequência real de Background não foi classificada como outro P2: impede aceite semântico da atividade, mas não prova defeito nessa fixture. A hipótese inicial foi descartada e seu teste exploratório foi retirado das reproduções finais.

## #47 — conferir o conteúdo dos modificadores autorizados

**P2**, `packages/curation/human-l0-consumable.ts:540`. `assertActivity4` compara apenas os IDs de `lifestyleModifiers`; o schema aceita valores mais amplos do que as regras autorizadas. Preservar o ID não preserva a regra aplicada.

Duas reproduções independentes sobre a fixture válida: mudar `lifestyle-modifier:life.delta` de `1` para `20`; ou mudar seus `results` de `[9,10,11,12]` para `[3]`. Ambas passam em `parseHumanL0Consumable`; ambas as regressões que exigem rejeição falham.

Correção esperada: conferir a tupla `id/tableId/results/delta/afterDice` contra as regras autorizadas, incluindo rejeição de resultados e tabelas trocados. Não basta validar o conjunto de IDs citado pelo domínio da coluna.

## #46 — compatibilizar as chaves dos lookups com #47

**P2**, `packages/curation/human-l0-kits-lot.ts:22` e uso na linha 163. A consulta anterior tem o mesmo ID nos dois PRs, mas os resultados não:

| Produtor #47 | Chave esperada por #46 |
|---|---|
| `only-human:lifestyle:open-3` | `only-human:lifestyle:destitute` |
| `only-human:lifestyle:4-5` | `only-human:lifestyle:poor` |
| `only-human:lifestyle:6-12` | `only-human:lifestyle:getting-by` |
| `only-human:lifestyle:13-15` | `only-human:lifestyle:comfortable` |
| `only-human:lifestyle:16-17` | `only-human:lifestyle:wealthy` |
| `only-human:lifestyle:18-open` | `only-human:lifestyle:rich` |

Reprodução na composição isolada: manter o wrapper standalone do lote 5, substituindo somente os IDs das seis linhas do produtor pelos IDs efetivamente emitidos pelo lote 4. O gate falha com `lookup-unknown-key` em `/lookups/0/keys/0`. A duplicação da coluna escondia a incompatibilidade nos testes isolados.

Correção esperada: consumir os IDs de resultado de #47, ou declarar um adaptador explícito e testado. Rebase deve preservar a consulta anterior e seu resultado; não recriar uma determinação de lifestyle. Adicionar teste que ligue o produtor de #47 aos cinco lookups de #46.

## Validação e limites

Os heads isolados foram conferidos antes da revisão seguinte. Os checks remotos existentes estavam verdes: runs `41557312094`, `41558451784` e `41557991481`. Os totais da tabela incluem os 51 testes do contrato compartilhados; não devem ser somados como testes distintos.

Em worktree descartável sobre `a717813`, foram aplicados código, fixtures e testes de #44, depois #47, depois #46. A união dos motivos de pendência de #46 com os de #47 foi feita explicitamente, preservando ambos; documentação divergente das branches não foi integrada. **108 testes existentes passaram em quatro arquivos. Quatro reproduções adicionais falharam conforme os três achados acima** (uma de #44, duas de #47, uma de #46). Não houve alteração de código da main ou dos heads revisados, nem execução de novos geradores de dados reais nesta atividade.

As reproduções permanecem locais, ignoradas, em `tmp/review-pr44-47-46/tests/review-pr44-regressions.test.ts`, `review-pr47-regressions.test.ts` e `review-pr46-integration.test.ts`. Para repetir no ambiente preparado, a partir dessa worktree:

```powershell
node ../../node_modules/vitest/vitest.mjs run tests/curation-human-l0-core-lot.test.ts tests/curation-human-l0-consumable-activity4.test.ts tests/curation-human-l0-kits-lot.test.ts tests/curation-human-l0-consumable.test.ts --maxWorkers=2
node ../../node_modules/vitest/vitest.mjs run tests/review-pr44-regressions.test.ts tests/review-pr47-regressions.test.ts tests/review-pr46-integration.test.ts --maxWorkers=2
```

Os lotes continuam `public-synthetic`, `fictionalData: true`, `needs-review`, não importáveis e com ruleset desabilitado. Conferir contagens, formatos e pesos naturais não certifica conteúdo publicado nem transforma grupos em folhas individuais. Nenhum dos 16 arquivos congelados foi alterado pelos lotes revisados.

## Disposição da #34 e próxima ação

Atividades **1 e 2 concluídas; 3–8 abertas**. Os três P2 foram corrigidos e os PRs mesclados na ordem #44 → #47 → #46, com CI aprovada em cada etapa e na main final `bf847e5`. As quatro reproduções originais passaram na composição isolada. O fechamento da atividade 1 foi preservado. Próximo passo: revisar/publicar a infraestrutura incremental local de compilação/handlers e ampliar seu consumo com os gates específicos dos lotes integrados. Aceite semântico dos dados reais, procedimento completo e habilitação permanecem separados do merge.

Além dos P2, permanecem fora do aceite: projeção semântica local dos lotes e consequências reais, 36 profissões Core agrupadas e faixas incompletas, resultados/side rolls adiados, 314 registros de catálogo agrupados e 97 programas de concessão local-only. As etapas 6–8 exigem seus próprios entregáveis e cobertura; estes PRs não os substituem.

Ao atualizar as branches, preservar o fechamento da atividade 1 em main. Menções antigas a `act1-local-hash-check` aberto, inclusive em fixtures e no JSON estrutural imutável, descrevem o snapshot anterior; vincular a [conferência local atual](fechamento-issue34-atividade1.md), sem reescrever a matriz histórica nem declarar que todos os bloqueios semânticos foram resolvidos. Resolver os conflitos documentais de checklist/estado sem reabrir a atividade 1 ou fechar as atividades 3–5 por contagem de fixtures.
