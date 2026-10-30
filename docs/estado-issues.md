# Estado das issues

Conferência em 2026-10-30, a partir da `main`, dos arquivos efetivos e das discussões no GitHub. Política do [PR #12](https://github.com/AntonioVCruz/sotdl-character-forge/pull/12) consolidada em [politica-distribuicao-conteudo.md](politica-distribuicao-conteudo.md).

| Issue | Estado consolidado | Evidência e próximo passo |
|---|---|---|
| [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1) | Fechada: limpeza da ponta entregue. | PR #13 inventariou; PR #17 corrigiu geradores, limpou e retirou derivados do índice e adicionou gate de CI. Históricos antigos seguem na #16. Não há registro de parecer independente adicional do Curador; houve integração autorizada pelo dono. |
| [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2) | Concluída: política publicada. | PR #12, revisão favorável registrada e aplicação no PR #17. Esta consolidação resolve os bloqueios e destinos desatualizados na documentação. |
| [#3](https://github.com/AntonioVCruz/sotdl-character-forge/issues/3) | Fechada: CI mínima entregue. | PR #8: testes e build. PR #17 adicionou privacidade. README instrui configurar o check obrigatório; esta conferência não certifica a configuração de branch protection. |
| [#4](https://github.com/AntonioVCruz/sotdl-character-forge/issues/4), [#5](https://github.com/AntonioVCruz/sotdl-character-forge/issues/5) | Fechadas como duplicatas da #1. | Não são tarefas adicionais de limpeza. Escopo histórico residual na #16. |
| [#6](https://github.com/AntonioVCruz/sotdl-character-forge/issues/6) | Fechada como duplicata da #2. | Classes e destinos incorporados na política consolidada. |
| [#7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7) | Aberta, entrega parcial. | Shape, mapa piloto→pack e stubs Core/Only Human do PR #11 entregues. `parsePack`/`validatePack` cobertos em teste. Faltam compilador determinístico, índices e relatório da fatia CUR-031/032. Não existe diretório `compendios/`. Não há freeze mecânico ou geração oficial. |
| [#9](https://github.com/AntonioVCruz/sotdl-character-forge/issues/9) | Aberta, L0 integrado; aceite pendente. | PR #14: ErrorBoundary/Stats; PR #15: ChoiceSlot e wizard L0. Contrato de props tipado; a validação Zod de slot/evento prevista na issue não está implementada nesse contrato. Falta validação UX do Designer e auditoria final do conjunto. L1 fica em S2 conforme a emenda da #10. |
| [#10](https://github.com/AntonioVCruz/sotdl-character-forge/issues/10) | Aberta, implementação integrada; aceite pendente. | Código e testes do PR #15 cobrem a implementação L0 contra adapter fictício. Não há parecer final do Designer nem review do PR #15 registrado. CI e merge não substituem o aceite. IDs do demo legado e a extensão exata do AC-X1 precisam de disposição no aceite. |
| [#16](https://github.com/AntonioVCruz/sotdl-character-forge/issues/16) | Aberta: histórico e cópias antigas. | Plano em [higiene-historico-git.md](higiene-historico-git.md). Sem rewrite, force-push ou expurgo executado. Responsável, autorização e janela ainda precisam ser registrados. |

## O que já entrou na main

PRs #8 (CI), #11 (stubs), #12 (política), #13 (inventário), #14 (ErrorBoundary/Stats), #15 (wizard L0) e #17 (higiene da ponta) foram mesclados. Os comentários anteriores a esses merges são históricos; referências antigas a bloqueios por #1/#2 ou a stubs ainda em draft não descrevem o estado atual.

## Próximas entregas

1. Concluir o aceite UX e a auditoria das #9/#10, registrando o resultado para o código já integrado; definir a disposição das lacunas de contrato e dos IDs do demo legado.
2. Implementar CUR-031/032 na trilha da #7 com saída permitida pela política, índices de refs exatas e evidência de determinismo. Depois integrar capacidades reais nas CUR-033/034, sem promover stubs a conteúdo mecanicamente validado.
3. Planejar o tratamento histórico na #16 com decisão explícita do dono. O fechamento da #1 não encerra esse trabalho.

Os checklists de aceite devem distinguir implementação comprovada, revisão registrada e trabalho restante. Nenhuma aprovação de pessoa ou papel é inferida de testes, merge ou autorização do dono.
