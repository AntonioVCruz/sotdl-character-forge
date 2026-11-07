# Consolidação do fechamento de Human L0

Plano de 2026-11-06. Projeto: SotDL Character Forge (`sotdl-sdd-starter`). Checkout de trabalho: `output/html/issue56-work`, branch `codex/issue56-exports`, base main `2c5ef89`.

Lista preparada e atividades 1–7 executadas por solicitações específicas do usuário. Atividade 8 continua adiada; commits, publicação, merge e alterações nas issues permanecem sem execução. O fechamento técnico local não equivale ao encerramento remoto das #34–#37/#56.

## Ponto de partida

| Frente | Evidência existente | O que falta para consolidar |
| --- | --- | --- |
| #34: dados, compilador e handlers | Contratos/lotes anteriores e entregas #50–#52; revisão #55 | Reconciliar os critérios originais, lotes selecionados e cobertura efetiva, especialmente atividades 3–8. |
| #35: procedimentos | #53: matriz, grafo e eventos Core/Human Development | Conferir cada critério original contra os percursos e limites atuais. |
| #36: interface, ficha e arquivos | #50–#54 integradas; #56 implementada localmente | Auditar confirmação/prévia, acessibilidade, persistência e formatos, com os limites do HTML de leitura. |
| #37: revisão, freeze e habilitação | #55 integrada pelo PR #62; ativação local anterior preservada | Consolidar o aceite final incluindo #56 e definir um snapshot posterior ao da #55. |
| #56: gates e exportação | Implementação e testes locais registrados em `entrega-exportacao-issue56.md` | Revisão final, publicação/integração futuras e encerramento administrativo. |

Os documentos históricos das entregas conservam limitações e contagens da época. Não substituir esses registros por uma narrativa que atribua a eles funcionalidades implementadas depois.

## Atividades, em ordem de execução

### 1. Fixar o escopo exato de fechamento

- [x] Inventariar o que está na main e o que existe apenas na branch local, registrando commits, arquivos e versões.
- [x] Enumerar as combinações aceitas de ancestralidade, atributos, procedimento, fonte de Interesting Things e modos manual/híbrido/aleatório, distinguindo suporte de aceite completo.
- [x] Separar criação concluída, efeito reservado ao uso, adjudicação de criação, caso bloqueado e funcionalidade fora de escopo.
- [x] Registrar os limites: Human L0, uso local, textos licenciados excluídos dos arquivos; fontes continuam `needs-review`.

Saída entregue: [declaração de escopo e matriz de combinações](escopo-fechamento-human-l0.md), com autoria, base e evidências. Não declara cobertura de todas as combinações a partir de alguns exemplos aprovados.

### 2. Montar a matriz de aceite das #34–#37 e #56

- [x] Copiar cada critério original das issues, com referência identificável, incluindo as atividades 3–8 da #34.
- [x] Relacionar cada critério ao código, contrato, documento, teste e registro de revisão correspondentes das #50–#56 e das entregas anteriores.
- [x] Classificar como comprovado, parcial, pendente ou fora do recorte com justificativa. Registrar a autoria da avaliação.
- [x] Distinguir resultados de testes públicos fictícios, verificações reais locais e CI de commits específicos.

Saída entregue: [matriz de critérios, evidências e ações restantes](matriz-aceite-fechamento-human-l0.md), com 39 critérios originais e seis atividades do roadmap #34. Registro estruturado em `curation/reviews/human-l0-closure-activity2-2026-11-06.json`. Checklist vazio não prova ausência de implementação; merge também não prova cumprimento do critério.

### 3. Resolver as lacunas encontradas, sem ampliar silenciosamente o escopo

- [x] Conferir compilação determinística, índices, dependências, integridade e rejeição de adulteração dos lotes reais selecionados (#34).
- [x] Conferir cardinalidades, substituições, parentes/dependentes, ciclos, locks/rerolls e invalidação de decisões nos procedimentos (#35).
- [x] Auditar especialmente prévia/confirmação e descarte, teclado/foco, recuperação de erros, compatibilidade de saves e isolamento entre fluxos (#36).
- [x] Conferir os gates e as limitações da #56: JSON reimportável, HTML somente de leitura, PDF por impressão e fontes referenciadas por ID.
- [x] Para cada lacuna, corrigir e validar, ou propor adiamento explícito com impacto e critério de conclusão. Perguntar ao usuário quando houver decisão de produto ou de escopo.

Saída entregue: [execução das lacunas, decisões e evidências](execucao-lacunas-human-l0.md). Prévia em conjunto, biblioteca IndexedDB e registro de dimensões seguiram decisões expressas do usuário; não houve novo adiamento de requisitos. O snapshot sucessor F06 permanece na atividade 6 como originalmente planejado. Não encerra issues nem substitui o aceite vertical consolidado da atividade 4.

### 4. Executar o aceite vertical consolidado

- [x] Criar percursos que cubram as combinações declaradas na atividade 1, com cobertura justificada dos modos manual, híbrido e aleatório autorizado.
- [x] Verificar criação → escolhas → consequências → equipamento → finalização → salvar/reabrir → exportar → importar → imprimir, sem novos sorteios durante replay.
- [x] Conferir invariantes: valores, estados, dinheiro exato, quantidades, origem dos ganhos, uso por unidade e ausência de duplicação.
- [x] Verificar alterações de variante/procedimento, escolhas opcionais, locks/rerolls, conflitos e invalidação da finalização.
- [x] Cobrir fonte ausente/alterada, dependência divergente, handler indisponível, JSON inválido/adulterado e save antigo; confirmar preservação do save anterior.
- [x] Conferir paridade dos formatos e inspecionar todas as páginas dos PDFs finais, incluindo casos de conteúdo longo pertinentes.

Saída entregue: [aceite vertical consolidado](aceite-vertical-consolidado-human-l0.md), com 36 cenários de motor/persistência, dez percursos de navegador, nove páginas de PDF inspecionadas e hashes dos arquivos efetivamente testados. Reaproveita os testes existentes, reforçados somente nos pontos de cobertura identificados. Não substitui as atividades 5–8.

### 5. Consolidar as permissões e a decisão de habilitação

- [x] Confrontar os campos efetivamente emitidos pela #56 com a política e a revisão de destinos da #55.
- [x] Confirmar exclusão estrutural e por política de livros, transcrições, evidências extensas, catálogos e dados de compra; explicitar os limites dos filtros e da revisão de campos livres.
- [x] Registrar dados pessoais/decisões livres incluídos por escolha do usuário e as limitações dessa conferência.
- [x] Documentar quais capacidades ficam habilitadas, em quais condições e com quais bloqueios; preservar a distinção entre uso local, arquivo mínimo do personagem e distribuição de conteúdo.

Saída entregue: [permissões e habilitação consolidadas](permissoes-habilitacao-human-l0.md), com duas decisões expressas do usuário: JSON como backup privado; HTML/PDF mínimos compartilháveis com revisão de nome e identificadores personalizados preservados. Guard por formato, mensagem segura e conflito conhecido conferidos. Não promove fontes nem concede direitos sobre livros por inferência de testes ou fechamento de issue.

### 6. Congelar a entrega consolidada de forma reproduzível

- [x] Conferir os 16 contratos antigos contra seus hashes originais, preservando os bytes esperados.
- [x] Preservar o manifesto #55 como snapshot histórico e registrar diferenças justificadas da #56 e das correções posteriores.
- [x] Definir e produzir manifesto sucessor/versionado para o recorte consolidado: código, políticas, dados, dependências, contratos de exportação, testes e relatório de cobertura.
- [x] Validar a reprodução do novo snapshot e a recusa de entradas modificadas, sem atualizar automaticamente o baseline para contornar falhas.
- [x] Registrar requisitos de corpus privado, ferramentas e finais de linha; conferir também a execução pública sem livros.

Saída entregue: [freeze consolidado reproduzível](freeze-consolidado-human-l0.md), manifesto `curation/freezes/human-l0/1.0.0.json`, preservação dos bytes atuais e restauração explícita somente com conteúdo correspondente, conforme decisão do usuário. Verificações pública e completa são distintas. A atividade 7 exigirá uma nova versão se alterar arquivos congelados; a publicação continua adiada.

### 7. Atualizar documentação e preparar os encerramentos

- [x] Atualizar `docs/estado-issues.md`, `docs/roadmap-issue34.md`, README e instruções de uso para refletir o estado consolidado, preservando o histórico.
- [x] Preparar resumos de encerramento das #34, #35, #36, #37 e #56 a partir da matriz de aceite, com evidências e limites próprios de cada issue.
- [x] Relacionar cada requisito adiado ao seu destino; manter efeitos de uso, mecânicas não implementadas e o histórico residual da #16 visíveis.
- [x] Registrar uma revisão final de UX e uma revisão técnica com autoria explícita; não atribuir aprovação a papéis/pessoas que não revisaram.
- [x] Conferir privacidade de arquivos rastreados e novos, build, suíte pública, verificações reais necessárias e diff final.

Saída entregue: [fechamento técnico e cinco resumos locais](fechamento-tecnico-human-l0.md), [matriz final de 45 obrigações](matriz-final-human-l0.md) e [guia de uso](uso-human-l0.md), com revisões Codex e acompanhamentos preservados. Snapshot sucessor `human-l0/1.0.1` inclui os documentos atuais e relatórios finais, mantendo `1.0.0` intacto. Sem alterar issues remotas nesta atividade de preparação; publicação e CI da alteração continuam na atividade 8.

### 8. Publicar e concluir administrativamente, quando solicitado

- [ ] Confirmar que a versão a publicar corresponde ao snapshot validado e ao escopo revisado.
- [ ] Fazer os commits e publicar PR(s), aguardar CI e integrar conforme autorização futura do usuário.
- [ ] Confirmar CI da main e associar os commits integrados às evidências finais.
- [ ] Atualizar/encerrar as issues cujo aceite esteja comprovado; deixar lacunas fora do recorte em acompanhamentos próprios.

Esta atividade está adiada por solicitação do usuário: os commits serão feitos posteriormente. Não executá-la por consequência automática das atividades anteriores.

## Critério de conclusão da consolidação

As atividades 1–7 resultam em fechamento técnico local quando todos os critérios do recorte têm evidência ou tratamento explícito acordado, os percursos passam e o snapshot é reproduzível. O fechamento integrado/administrativo depende também da atividade 8. A progressão L0→1 (#21) permanece uma etapa posterior, fora deste plano.
