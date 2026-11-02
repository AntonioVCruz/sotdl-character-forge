# Transferência das pendências ampliadas da #7

Registro de 2026-11-02, posterior ao [aceite técnico dos critérios originais](aceite-criterios-originais-issue7.md), entregue no PR #33. As quatro frentes abaixo foram abertas como issues próprias. A transferência organiza trabalho futuro; não implementa as funcionalidades nem habilita conteúdo.

| Frente | Issue responsável | Limite de responsabilidade |
|---|---|---|
| Tabelas, kits e equipamentos | [#34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34) | Curadoria/projeção dos dados necessários ao Human L0, probabilidades, resultados, quantidades e handlers de consequências/equipamento, com evidência e validação por lote. |
| Procedimentos completos | [#35](https://github.com/AntonioVCruz/sotdl-character-forge/issues/35) | Orquestração Core/Human Development: passos, cardinalidades, escolhas, modos, locks/rerolls, substituições e aplicação de resultados ao histórico/persistência. Consome os dados da #34. |
| Interface real | [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36) | Fluxo real de criação, prévia/confirmação, ficha/inventário, salvar/reabrir, import/export e impressão conforme a política. Consome o motor/procedimentos e preserva o demo. |
| Revisão final, freeze e habilitação | [#37](https://github.com/AntonioVCruz/sotdl-character-forge/issues/37) | Revisão ampliada de fonte/conteúdo/proveniência/paginação, destinos e distribuição, matriz de rastreabilidade, freeze da fatia, aceite vertical e habilitação explícita do conjunto aprovado. |

Cada issue contém objetivo, base já entregue, escopo, checklist de aceite, dependências e exclusões. Não foram atribuídos sprint, prazo ou responsável que ainda não tenham sido definidos. As novas issues não receberam o rótulo S1.

## Dependências e execução

A ordem de aceite é **#34 → #35 → #36 → #37**. A #36 também precisa da cobertura de dados da #34; a #37 confere as três entregas e seus próprios gates de revisão/permissão/freeze.

Essa ordem não exige execução estritamente serial: planejamento de procedimentos, contratos/estados da interface e levantamento de destinos/permissões podem avançar sobre a base existente e fixtures. A interface pode ser validada em prévia local antes da habilitação oficial. Não há dependência inversa exigindo a #37 para implementar as anteriores.

O encerramento administrativo da #7 não é pré-requisito das quatro frentes. A #7 é a origem e a evidência do contrato/fatia draft S1 aceitos. Seu estado permanece aberto após esta transferência; a decisão de encerramento é uma atividade separada.

## Rastreabilidade do backlog

- **#34:** formalizações CUR-016–021 e partes de CUR-031/032/034/038 relacionadas aos dados e efeitos do recorte.
- **#35:** partes de CUR-033/034/035/036 e do aceite CUR-038/039 relacionadas à sequência e ao histórico dos procedimentos.
- **#36:** partes de CUR-033/036/037 e do aceite CUR-039 relacionadas à interface, ficha e exports.
- **#37:** CUR-038/039/041 e os gates de revisão, freeze e habilitação da fatia.

Os números CUR descrevem tarefas gerais que podem atravessar mais de uma entrega. A divisão acima especifica o dono de cada resultado, sem marcar toda a tarefa geral como concluída ou duplicar a implementação nas issues consumidoras.

## Estado preservado

Contrato, stubs públicos `0.1.0`, metadados locais `0.1.1`, projeção mecânica local `0.2.0` e motor da base em `local-preview` continuam entregues, com os limites e hashes registrados. Nenhum pack, código, gate ou status de revisão foi alterado nesta organização.

Os packs reais mantêm `fictionalData: false`; dados licenciados e derivados reais permanecem locais conforme a [política](politica-distribuicao-conteudo.md). Habilitação funcional em ambiente autorizado, publicação no Git e incorporação em exports são destinos distintos a serem tratados na #37. Habilitar um recorte não concede autorização de redistribuir livros ou evidências.

As #9/#10 permanecem encerradas no aceite demonstrativo S1. S2/L1 continua na #21. Histórico, resíduos do GitHub e backups continuam na #16, sem reabrir as #1/#2. Nenhuma dessas issues foi modificada pela transferência.
