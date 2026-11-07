# Estado das issues

## Estado consolidado local — 2026-11-06

As atividades 1–7 de [consolidação Human L0](plano-fechamento-human-l0.md) foram executadas localmente na branch `codex/issue56-exports`, sobre `2c5ef89`. O [fechamento técnico](fechamento-tecnico-human-l0.md) reconcilia os 39 critérios das #34–#37/#56 e seis atividades do roadmap, com limites e resumos prontos para publicação futura. A matriz da atividade 2 permanece histórica; suas lacunas foram tratadas nas atividades posteriores.

| Issue | Situação técnica atual | Ação administrativa restante |
| --- | --- | --- |
| #34 | Atividades 1–8 do roadmap aceitas no recorte: dados, consequências suportadas, compilação real e handoff para #35/#36/#37. | Publicar/integrar o delta local, conferir CI do commit integrado e atualizar checklist remoto. |
| #35 | Procedimentos e 36 cruzamentos dirigidos aceitos, com persistência/migração e concorrência. | Associar a versão integrada e publicar o resumo de encerramento. |
| #36 | Interface real, prévia, biblioteca, ficha e arquivos mínimos aceitos; revisão final de UX identificada como Codex. | Publicar/integrar as mudanças ainda locais e conferir CI. |
| #37 | Revisão #55 preservada; aceite vertical, destinos e freeze sucessor consolidados. | Conferir snapshot publicado e relacionar CI/commit, sem promover fontes. |
| #56 | Gates e JSON privado/HTML/PDF mínimos implementados e aceitos localmente. | Commit, PR, CI, integração e encerramento remoto posteriores. |

Nenhuma dessas issues foi atualizada ou encerrada por esta atividade. Os estados remotos desta lista são os da última consulta registrada na atividade 2; não houve nova consulta. A #54 já entrou via PR #61 e a #55 via PR #62; a CI conhecida em `2c5ef89` não certifica as alterações locais seguintes. [Freeze atual e reprodução](freeze-consolidado-human-l0.md). Próxima etapa: atividade 8, somente quando o usuário solicitar publicação. Depois do fechamento integrado, a #21 é a próxima frente de produto; resíduos da #16 mantêm acompanhamento separado.

## Histórico anterior à consolidação

Os parágrafos e a tabela abaixo conservam o estado das entregas em suas datas. Menções a atividades 3–8 pendentes, rascunho obrigatório e exportação ausente não descrevem o recorte local consolidado acima.

Decisão posterior em 2026-11-03: [geração oficial local ativada para Humano Core nível 0](ativacao-oficial-local-core.md), por solicitação explícita do usuário. A entrada principal usa somente dados reais e recusa demo/fixture; profissões, riqueza, kits, equipamentos e sorteios são vinculados às fontes verificadas. Fichas permanecem rascunhos com pendências explícitas de consequência; exportação e aceite completo continuam separados. Fontes conservam `needs-review`, sem promoção automática.

Lote real Core em 2026-11-03: [projeção e conferência local entregues](entrega-core-real-issue34-atividade3.md), contrato consumível `1.1.0` local, `fictionalData: false`. Foram conferidos 22 tabelas/23 fluxos/339 resultados, 102 profissões (36 antes agrupadas), 120 Interesting Things e 157 intervalos de evidência, com 260 registros Core contabilizados. Dados reais permanecem ignorados. Vínculos de consequência ainda pendentes de aplicação/adjudicação são preservados; não houve aceite semântico integral, promoção ou habilitação.

Integração autorizada em 2026-11-03: #44 (`06e6270`), #47 (`b6a298a`) e #46 (`bf847e5`) mesclados nessa ordem, com CI verde no head exato antes de cada merge. Os três P2 foram preservados e a CI da main final também passou ([run 41579455000](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41579455000)). Atividades 1/2 continuam concluídas; 3–8 seguem abertas para aceite completo dos dados reais e handlers. Snapshots históricos não reabrem a atividade 1; merge das fixtures não habilita geração oficial.

Conferência em 2026-10-30, a partir da `main`, dos arquivos efetivos e das discussões no GitHub. Política do [PR #12](https://github.com/AntonioVCruz/sotdl-character-forge/pull/12) consolidada em [politica-distribuicao-conteudo.md](politica-distribuicao-conteudo.md).

Atualização da #7 em 2026-11-02: metadados e as quatro atividades da base mecânica concluídos — revisão local, contrato, projeção/validação e handlers com aceite de escolhas/salvamento/reabertura. As pendências ampliadas foram [transferidas para as #34–#37](transferencia-escopo-issue7.md), com critérios e dependências próprios.

Atualização local da #34 em 2026-11-03: [compilação e handlers consumíveis](entrega-compilacao-handlers-consumiveis-human-l0.md) implementados incrementalmente sobre a fixture aceita, com replay por origem e equipamento integrado ao cálculo. Esse trabalho local foi preservado/restaurado durante a sincronização até a main `bf847e5` e ainda não foi publicado. Atividades 6/7 permanecem abertas até cobertura dos lotes reais. Integração do fluxo real e gates de exportação precedem a ampliação do offline.

[Auditoria dos critérios originais da #7](aceite-criterios-originais-issue7.md): contrato e fatia draft S1 aceitos tecnicamente, com nove critérios objetivos comprovados, atividades do critério de revisão/PR/auditoria identificadas sob autoria do Codex e quatro entregáveis disponíveis. A transferência foi executada posteriormente à auditoria; a #7 permanece aberta para a decisão de encerramento do escopo aceito.

| Issue | Estado consolidado | Evidência e próximo passo |
|---|---|---|
| [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1) | Fechada: limpeza da ponta entregue. | PR #13 inventariou; PR #17 corrigiu geradores, limpou e retirou derivados do índice e adicionou gate de CI. Históricos antigos seguem na #16. Não há registro de parecer independente adicional do Curador; houve integração autorizada pelo dono. |
| [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2) | Concluída: política publicada. | PR #12, revisão favorável registrada e aplicação no PR #17. Esta consolidação resolve os bloqueios e destinos desatualizados na documentação. |
| [#3](https://github.com/AntonioVCruz/sotdl-character-forge/issues/3) | Fechada: CI mínima entregue. | PR #8: testes e build. PR #17 adicionou privacidade. README instrui configurar o check obrigatório; esta conferência não certifica a configuração de branch protection. |
| [#4](https://github.com/AntonioVCruz/sotdl-character-forge/issues/4), [#5](https://github.com/AntonioVCruz/sotdl-character-forge/issues/5) | Fechadas como duplicatas da #1. | Não são tarefas adicionais de limpeza. Escopo histórico residual na #16. |
| [#6](https://github.com/AntonioVCruz/sotdl-character-forge/issues/6) | Fechada como duplicata da #2. | Classes e destinos incorporados na política consolidada. |
| [#7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7) | Aberta: escopo original aceito tecnicamente; pendências ampliadas transferidas. | [Auditoria por critério](aceite-criterios-originais-issue7.md) e [transferência #34–#37](transferencia-escopo-issue7.md). Contrato e fatia draft S1 entregues; a decisão de encerramento da #7 permanece separada. |
| [#9](https://github.com/AntonioVCruz/sotdl-character-forge/issues/9) | Concluída no escopo S1/L0. | Contratos Zod de slot e comandos em runtime, níveis 0|1 compartilhados com o motor, adapter restrito a L0 e entradas inválidas rejeitadas. Dois P2 corrigidos. [Aceite técnico/UX do Codex](aceite-s1-issues9-10.md) registrado; não é aprovação externa atribuída ao Designer. L1 transferido para #21. |
| [#10](https://github.com/AntonioVCruz/sotdl-character-forge/issues/10) | Concluída no escopo S1/L0. | Matriz 1b/1e, teclado/foco, desktop 1100/1440 px, estados/pendências e revisão completa do Core fictício verificados. AC-X1 resolvido para rótulos da ficha/prévia legadas; IDs técnicos de origem continuam nos detalhes. [Aceite do Codex e limites](aceite-s1-issues9-10.md). |
| [#16](https://github.com/AntonioVCruz/sotdl-character-forge/issues/16) | Aberta: branches e Git ativo local limpos; resíduos do GitHub/backups pendentes. | [Publicação aprovada](publicacao-historico-git.md): 12 branches reescritas, proteção restaurada, cinco caches invalidados e workspace migrado; 340 arquivos locais preservados. Coleta local autorizada especificamente: commit inicial antigo ausente, todos os objetos ativos alcançáveis pelo histórico limpo, auditoria e fsck aprovados. Refs internas de PR/objetos do GitHub dependem do Support. Backups privados preservados, com revisão em 2026-11-06. |
| [#21](https://github.com/AntonioVCruz/sotdl-character-forge/issues/21) | Aberta: S2, wizard L0→1. | Conserva o trecho L1 adiado pela emenda da #10: novice path, escolhas condicionais, revalidação e compatibilidade de saves; não habilita geração oficial. |
| [#34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34) | Aberta: atividades 1 e 2 concluídas; 3–8 pendentes. | [Fechamento local da atividade 1](fechamento-issue34-atividade1.md) e [contrato consumível](contrato-consumivel-tabelas-human-l0.md) aceitos. [#44 → #47 → #46 mesclados](revisao-pr44-pr47-pr46.md), três P2 corrigidos, CI aprovada em cada etapa e na main `bf847e5`. Lotes reais sem aceite; infraestrutura incremental de compilação/handlers ainda local. |
| [#35](https://github.com/AntonioVCruz/sotdl-character-forge/issues/35) | Aberta: procedimentos completos Core/Human Development. | Sequência/cardinalidades, modos, locks/rerolls, substituições e aplicação de consequências ao histórico. Aceite depende da cobertura necessária da #34. |
| [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36) | Aberta: interface real, ficha, persistência e exports. | Consome #34/#35, mantém o demo e os limites dos exports. Contratos/protótipos podem avançar antes; aceite completo exige procedimentos/dados. |
| [#37](https://github.com/AntonioVCruz/sotdl-character-forge/issues/37) | Aberta: revisão, freeze, aceite vertical e habilitação. | Fonte/conteúdo/paginação/destinos, rastreabilidade e ativação explícita da fatia. Decisão final depende de #34/#35/#36; levantamento de permissões pode começar antes. |

## O que já entrou na main

PRs #8 (CI), #11 (stubs), #12 (política), #13 (inventário), #14 (ErrorBoundary/Stats), #15 (wizard L0) e #17 (higiene da ponta) foram mesclados. Os comentários anteriores a esses merges são históricos; referências antigas a bloqueios por #1/#2 ou a stubs ainda em draft não descrevem o estado atual.

## Próximas entregas

Atualização da #54 em 2026-11-04: finalização explícita dos fluxos Core e Procedimentos implementada com revalidação, invalidação após edição e preservação de saves suspensos. [Atividades, decisão e validação](entrega-finalizacao-issue54.md). As #50–#53 foram integradas pelos PRs #57 → #58 → #59 → #60, na main `2e94ddd`. Publicação e integração da #54 autorizadas pelo usuário, com resultado acompanhado no PR correspondente; #55/#56 conservam revisão de distribuição e exports.

Atualização da #53: procedimentos Core/Human Development implementados e verificados, com Only Human/Oddities ativados nos recortes locais autorizados e pendências explícitas. [Entrega, decisões e validação](entrega-procedimentos-issue53.md). Integrada pelo PR #60; não encerra as frentes #34–#37. O gate de personagem concluído é a entrega local da #54 descrita acima.

1. Prosseguir com L0→1 na #21. A fatia S1 das #9/#10 recebeu contrato runtime, correções e [aceite identificado](aceite-s1-issues9-10.md); os dois P2 da revisão anterior permanecem cobertos.
2. Executar as frentes Human L0 transferidas: #34 (dados/efeitos), #35 (procedimentos), #36 (interface real) e #37 (revisão/freeze/habilitação). A ordem de aceite é essa; planejamento e testes com fixtures podem avançar em paralelo. A #7 conserva o escopo original aceito, sem carregar a execução dessas frentes.
3. Concluir o tratamento residual da #16: GitHub Support e destinação dos backups. A CI remota e a limpeza local passaram; isso não certifica expurgo de todas as cópias.

Os checklists de aceite devem distinguir implementação comprovada, revisão registrada e trabalho restante. Nenhuma aprovação de pessoa ou papel é inferida de testes, merge ou autorização do dono.
