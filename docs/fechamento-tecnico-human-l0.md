# Fechamento técnico local de Human L0 — atividade 7

Revisão e preparação por **Codex**, em 2026-11-06, na branch `codex/issue56-exports`, base `2c5ef8924e643622132d1c2f6d07ce92009f2dff`. Resultado: recorte Human L0 aceito tecnicamente para os cenários documentados; resumos de encerramento preparados localmente. Não houve commit, publicação, merge, deploy ou alteração das issues remotas. O encerramento integrado depende da atividade 8, adiada pelo usuário.

## Reconciliação dos critérios

A [matriz da atividade 2](matriz-aceite-fechamento-human-l0.md) permanece como fotografia anterior às correções: 28 comprovados, 16 parciais e um pendente. A [reavaliação final por ID](matriz-final-human-l0.md) e o registro `curation/reviews/human-l0-closure-activity7-2026-11-06.json` preservam os 39 critérios originais e as seis atividades do roadmap, vinculando o tratamento posterior de cada lacuna. As 45 obrigações têm atendimento no recorte local; isso não certifica todos os resultados/combinações dos livros nem a CI de mudanças ainda não publicadas.

| Lacuna original | Tratamento final |
| --- | --- |
| F01: prévia | Conjunto em memória, confirmação com nova leitura das fontes, descarte e preservação em caso de erro. |
| F02: biblioteca e concorrência | IndexedDB com múltiplos personagens, CAS de revisão, migração idempotente, original preservado e conflito entre abas. |
| F03: características da ficha | Campos calculados e Damage apresentados também em procedimentos. |
| F04: cobertura | 36 cruzamentos dirigidos de seis bases × duas fontes × três modos, replay/persistência e aceite de navegador. Não cobre todos os resultados/ciclos. |
| F05: compilação real | Bundle, índice e relatório locais `1.0.1`, 2.552 identidades; equivalência, determinismo e rejeição conferidos. |
| F06: freeze sucessor | `human-l0/1.0.0` da atividade 6 preservado; `human-l0/1.0.1` incorpora a documentação/revisão final e os novos relatórios. |
| F07: UX e recuperação | Revisão final abaixo, foco/retorno, descarte, confirmação inválida, biblioteca e conflito exercitados. |
| F08: dimensões Core | Registro validado de medidas na opção narrativa, sem importar fórmulas de Human Development ou inferir Size. |

## Revisão final técnica

Autoria e decisão: **Codex; aceite técnico local condicionado ao escopo**. Foram inspecionados os contratos de exportação, a biblioteca/transação, os pontos de confirmação e emissão e as evidências de compilação/freeze. A emissão reaplica o gate de fonte/contexto e finalização; schema estrito e verificação de conteúdo separam resumo e replay. JSON é backup privado; HTML/PDF verificam os campos efetivamente emitidos. A importação reexecuta e compara decisões sem RNG, com versões/dependências exatas. A biblioteca usa comparação de revisão em uma única transação; o aviso por storage event não é a única proteção contra gravação concorrente.

As políticas continuam `needs-review`, `distributionApproved=false` e exportação global de contexto/pack desabilitada. A compilação real é local e distinta da receita sintética, do importador de catálogo e do contrato de personagem. O freeze verifica bytes, contratos antigos, corpus e reconstrução independente; a verificação pública explicita seus limites. Não há achado técnico impeditivo novo no recorte revisado. A cobertura dirigida e os filtros conhecidos não demonstram ausência universal de defeitos ou dados sensíveis.

## Revisão final de UX

Autoria e decisão: **Codex; aceite de UX local dos percursos exercitados**. Não é aprovação independente atribuída a Designer, Curador ou usuário. Foram revisados os controles, mensagens e percursos de prévia/confirmação, biblioteca e emissão; o navegador reexecuta os cenários atuais em servidor isolado.

| Ponto | Evidência e limite |
| --- | --- |
| Prévia e foco | Ao alterar, o foco vai ao título da revisão; descarte retorna ao controle. Save fica intacto até confirmar; navegação entre fluxos é protegida. |
| Erro de fonte na confirmação | Mensagem identificável, prévia preservada e save sem sobrescrita; nova tentativa com fonte válida permite confirmar. |
| Biblioteca e duas abas | Seleção persiste por aba; novo personagem separado; revisão mais recente vence; aba antiga bloqueia confirmação/emissão e oferece recarga. |
| Finalização | Edição invalida o recibo quando necessário; consequências opcionais ativas e equipamento inválido não desaparecem silenciosamente. |
| Arquivos e consentimento | Avisos distinguem backup privado de ficha mínima; consentimento renovado e erro de conteúdo não reproduz o dado sensível. |
| Paridade e impressão | Valores/resumo conferidos entre JSON e HTML; PDF Chromium/A4. A inspeção visual histórica de nove páginas continua atribuída à atividade 4. |

O teste de foco cobre controles e transições dirigidas; não é uma auditoria WCAG completa, de todos os leitores de tela ou de dispositivos móveis. O resultado não atribui cobertura integral a todos os caminhos de Human Development/Oddities. A execução final, os hashes de relatórios e a relação com o freeze estão no registro estruturado desta atividade.

O descarte foi reforçado com Tab até confirmar/descartar e Enter para ativar, seguido de conferência do retorno do foco e do save preservado. As capturas completas dos HTML Core e procedimentos desta rodada também foram inspecionadas visualmente pelo Codex, sem corte ou sobreposição observados; são verificações de tela do HTML, separadas da revisão histórica das páginas PDF.

## Verificações finais

Suíte pública sem corpus: 449 aprovados e 81 ignorados. Suíte com corpus local: 646 aprovados e quatro ignorados. Build, TypeScript e auditoria da entrada oficial aprovados. A rodada final de navegador cobre os 11 testes atuais, incluindo o bloqueio de conteúdo sensível e o percurso de teclado reforçado; os resultados exatos e hashes ficam no registro estruturado. Contagens de rodadas dirigidas não são somadas. Contratos antigos, privacidade de arquivos públicos rastreados/novos, links locais e diff são conferidos antes de selar o sucessor.

## Resumos de encerramento preparados

Os textos seguintes são rascunhos locais para uso na atividade 8. Antes de publicá-los, inserir o commit/PR efetivamente integrado e a CI correspondente, verificar o snapshot da entrega e reler o corpo atual de cada issue. Não preencher esses campos com a CI histórica da base `2c5ef89`. Uma mudança posterior exige revisão dos resumos e uma nova versão de freeze.

### #34 — dados, compilação e handlers

Entregues e aceitas tecnicamente as oito atividades do roadmap Human L0 no recorte declarado. Core/Only Human/Oddities, concessões, quantidades e equipamento usam referências exatas e consequências tipadas, sem inferir perfis por nome. A compilação real local `1.0.1` produz bundle/índice/relatório imutáveis com 2.552 identidades, validada por reconstrução, determinismo e rejeição de adulteração. Replay conserva origens, estados e dinheiro, sem duplicar ganhos ou sortear no recálculo. Critérios: I34-AC01–08 e I34-A3–A8 na matriz final. Evidências: execução de lacunas, aceite vertical, revisão #55 e freeze consolidado. Handoff para #35/#36/#37 documentado. As 410 definições não equivalem a 410 perfis completos; ambiguidades e contextos sem handler conservam bloqueios. Fontes e derivados licenciados continuam privados, sem promoção de revisão ou autorização de distribuição. Encerramento remoto condicionado à integração/CI da entrega local.

### #35 — procedimentos Core e Human Development

Procedimentos, cardinalidades, modos, locks/rerolls e consequências implementados no recorte local. A matriz de 36 cruzamentos dirigidos cobre seis bases mecânicas, Core/Oddities e três modos, com finalização, IndexedDB, reabertura e replay JSON sem RNG. Mudanças suspendem/invalidam dependentes preservando histórico; estados e benefícios não são restaurados/acumulados por recálculo. Biblioteca com migração e concorrência por revisão preserva saves legados e os testes do demo. Critérios: I35-AC01–09. Evidências: matriz/entrega #53, execução de lacunas e aceite vertical. O percurso infantil delimitado de Human Development não certifica todas as experiências, ciclos ou resultados de suplementos. Não habilita progressão L1 nem automação de combate. Encerramento remoto condicionado à versão integrada e CI correspondente.

### #36 — interface, ficha, persistência e arquivos

Fluxos reais consomem comandos e pendências do motor, sem fallback fictício. Prévia em conjunto com confirmar/descartar, revalidação de fontes, biblioteca IndexedDB e conflito entre abas completam a revisão da ficha. Características/modificadores, estados, Damage e medidas Core estão apresentados no recorte; finalização e emissão dependem da versão salva e sem conflito conhecido. JSON privado reimportável, HTML de leitura offline e PDF/A4 mínimos preservam paridade. Critérios: I36-AC01–09. Evidências: entrega #54/#56, execução de lacunas, aceite vertical e revisão UX Codex desta atividade. HTML não é motor editável offline; a revisão não certifica todos os leitores de tela/navegadores. Encerramento remoto aguarda publicação/integração e CI da alteração local.

### #37 — revisão, freeze e habilitação

Revisão #55 preservada, com autoria, fontes/paginação, limites e rastreabilidade. As lacunas da matriz original foram tratadas e o aceite vertical foi complementado por permissões e revisão final. O freeze consolidado preserva os 16 contratos antigos, o snapshot #55 e a versão `1.0.0`; o sucessor `1.0.1` inclui esta preparação final, com checks público/completo e restauração explícita de finais de linha somente para conteúdo correspondente. Critérios: I37-AC01–08. A geração local permanece autorizada apenas no recorte, com bloqueio de fonte ausente/alterada, consequência pendente e capacidade sem suporte. JSON é privado; HTML/PDF mínimos exigem conferir nome/identificadores. `needs-review`, `distributionApproved=false` e exportação global desabilitada permanecem. Nenhum teste concede direitos sobre livros. Encerramento remoto depende de snapshot integrado e CI verificável.

### #56 — gates finais e arquivos da ficha

Gates de contexto, capacidade, completude, finalização e consentimento implementados para arquivos mínimos de personagem. JSON `sotdl.character-export@1.0.0` conserva replay como backup privado e reabre sem novos sorteios, com versões/dependências exatas; HTML de leitura e PDF/A4 compartilham somente a projeção mínima autorizada. Catálogos, textos de livros e evidências extensas não integram o schema. Conteúdo conhecido de compra/links autenticados é recusado com mensagem segura, preservando o save. Rascunho, contexto alterado, adulteração e incompatibilidade bloqueiam emissão/importação. Critérios: I56-AC01–05; evidências: entrega #56, atividade 5, aceite vertical e regressão final. IDs personalizados podem conter texto do usuário e exigem conferência; filtros não são classificadores universais. Formatos amplos/editáveis continuam indisponíveis. Código permanece local sem commit; fechar somente após PR/CI/integração autorizados.

## Limites e acompanhamentos

Não foi acordado novo adiamento de requisito durante a consolidação. Os itens seguintes já estavam fora do recorte ou são restrições preservadas; não são contados como implementados:

| Item | Destino e condição |
| --- | --- |
| Progressão L0→1, novice path e compatibilidade L1 | #21, próxima frente de produto após consolidação integrada; manter saves/pendências compatíveis. |
| Históricos antigos, refs do GitHub e backups | #16, tratamento com Support e decisões sobre backups privados; teste/build não prova expurgo. |
| Efeitos de uso, combate amplo, munição/recarga/misfire, carga, compras/tempo | Permanecem como pendências/capacidades do runtime e no escopo registrado; futura automação exige requisito e aceite próprios antes de remover gates. Não foi criada issue remota nesta atividade. |
| Resultado contextual sem handler, perfis/ambiguidades não resolvidos, transformação ou suplemento externo | Preservados por registro/diagnóstico nas evidências privadas e na revisão #55; resolver com fonte e handler/teste específicos antes de habilitar. Não trocar por aprovação genérica. |
| Geração de Dark Passages/livros citados em Interesting Things | Referência preservada; integração futura explicitada em CUR-019, sem aquisição/geração automática agora. |
| HTML editável offline, demais ancestralidades/níveis e magia ampla | Fora do contrato atual; exigem nova definição de produto, fontes/permissões e critérios próprios. |
| Distribuição de livros/packs ou promoção para curated | Fora da habilitação local; exige decisão específica de direitos e revisão, sem inferência de teste/merge. |

## Entrega e próxima ação

README, estado das issues, roadmap #34 e instruções de uso apontam para a visão atual. Os registros das atividades 1–6 continuam históricos, incluindo suas contagens e pendências da época. A versão `1.0.0` pode ser reproduzida pelos arquivos que ela fixa; o checkout documental atual corresponde ao sucessor `1.0.1`, conforme o [guia do freeze](freeze-consolidado-human-l0.md).

A atividade 8 fica preparada, sem execução: autorizar commit/publicação; conferir privacidade e diff da versão escolhida; publicar PR; obter CI no commit exato; integrar conforme a autorização; conferir CI da main; então atualizar checklists e encerrar somente as issues cujo aceite permanece atendido. Nenhum encerramento remoto, parecer externo ou CI futura é registrado como já obtido.
