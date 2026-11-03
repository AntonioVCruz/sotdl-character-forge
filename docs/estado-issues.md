# Estado das issues

Conferência em 2026-10-30, a partir da `main`, dos arquivos efetivos e das discussões no GitHub. Política do [PR #12](https://github.com/AntonioVCruz/sotdl-character-forge/pull/12) consolidada em [politica-distribuicao-conteudo.md](politica-distribuicao-conteudo.md).

Atualização da #7 em 2026-11-02: metadados e as quatro atividades da base mecânica concluídos — revisão local, contrato, projeção/validação e handlers com aceite de escolhas/salvamento/reabertura. As pendências ampliadas foram [transferidas para as #34–#37](transferencia-escopo-issue7.md), com critérios e dependências próprios.

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
| [#34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34) | Aberta: contrato consumível `sotdl.human-l0.consumable@1.0.0` definido; lotes 3–8 por fazer. Hashes locais da atividade 1 ainda não recomputados. | [Roadmap](roadmap-issue34.md), [matriz](matriz-lacunas-issue34-atividade1.md) e [contrato consumível](contrato-consumivel-tabelas-human-l0.md). `act1-local-hash-check` não bloqueia a fixture sintética. |
| [#35](https://github.com/AntonioVCruz/sotdl-character-forge/issues/35) | Aberta: procedimentos completos Core/Human Development. | Sequência/cardinalidades, modos, locks/rerolls, substituições e aplicação de consequências ao histórico. Aceite depende da cobertura necessária da #34. |
| [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36) | Aberta: interface real, ficha, persistência e exports. | Consome #34/#35, mantém o demo e os limites dos exports. Contratos/protótipos podem avançar antes; aceite completo exige procedimentos/dados. |
| [#37](https://github.com/AntonioVCruz/sotdl-character-forge/issues/37) | Aberta: revisão, freeze, aceite vertical e habilitação. | Fonte/conteúdo/paginação/destinos, rastreabilidade e ativação explícita da fatia. Decisão final depende de #34/#35/#36; levantamento de permissões pode começar antes. |

## O que já entrou na main

PRs #8 (CI), #11 (stubs), #12 (política), #13 (inventário), #14 (ErrorBoundary/Stats), #15 (wizard L0) e #17 (higiene da ponta) foram mesclados. Os comentários anteriores a esses merges são históricos; referências antigas a bloqueios por #1/#2 ou a stubs ainda em draft não descrevem o estado atual.

## Próximas entregas

1. Prosseguir com L0→1 na #21. A fatia S1 das #9/#10 recebeu contrato runtime, correções e [aceite identificado](aceite-s1-issues9-10.md); os dois P2 da revisão anterior permanecem cobertos.
2. Executar as frentes Human L0 transferidas: #34 (dados/efeitos), #35 (procedimentos), #36 (interface real) e #37 (revisão/freeze/habilitação). A ordem de aceite é essa; planejamento e testes com fixtures podem avançar em paralelo. A #7 conserva o escopo original aceito, sem carregar a execução dessas frentes.
3. Concluir o tratamento residual da #16: GitHub Support e destinação dos backups. A CI remota e a limpeza local passaram; isso não certifica expurgo de todas as cópias.

Os checklists de aceite devem distinguir implementação comprovada, revisão registrada e trabalho restante. Nenhuma aprovação de pessoa ou papel é inferida de testes, merge ou autorização do dono.
