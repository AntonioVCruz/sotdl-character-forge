# Entrega local da #54

Implementação e validação técnica do Codex em 2026-11-04, por solicitação do usuário, sobre a main `2e94ddd`. [Atividades](plano-finalizacao-issue54.md) e [matriz de completude](matriz-finalizacao-issue54.md). Publicação e integração são etapas separadas.

## Comportamento

Core e Procedimentos Core / Only Human começam em rascunho. A ação **Finalizar personagem** revalida o contexto, as etapas ativas, as escolhas, as quantidades, os ganhos e a composição mecânica. Só então o resultado externo pode retornar `fullyResolved: true`. O estado da prévia mecânica isolada não é usado como prova de conclusão do procedimento.

A interface distingue rascunho com pendências, rascunho pronto para finalizar e personagem finalizado. Pendências bloqueantes apontam para as etapas ou controles correspondentes. Etapas facultativas não escolhidas são informativas; se escolhidas, suas obrigações precisam ser resolvidas. Escolhas vazias e o idioma-base usado indevidamente como benefício adicional não comprovam a concessão.

Decisão expressa do usuário: efeitos reservados ao uso em jogo continuam visíveis e não bloqueiam finalizar a criação. Consumo, condições de cena, combate e passagem de tempo não são executados automaticamente. Concessões de criação sem handler, limites de execução, adjudicações necessárias, capacidades sem definição e conflitos de equipamento continuam bloqueantes.

`curation/official-local-policy.json` passa à versão 2, distinguindo obrigações de criação de efeitos de uso, com autoridade e data explícitas. Isso preserva uso local, fontes reais obrigatórias e exportação desabilitada.

## Persistência e invalidação

O recibo `sotdl.character-finalization@1.0.0` contém somente versão, hash de contexto, hash do estado e motivo de invalidação. Não incorpora tabelas, evidências ou textos dos livros. Ele é opcional nos saves existentes, que continuam rascunhos por padrão; não é uma flag de completude aceita sem revalidação.

Alterações de resultados, configuração, concessões ou equipamento invalidam a finalização e exigem nova ação explícita. Restaurar uma escolha anterior não reativa um recibo já invalidado. Bloquear/desbloquear etapas de procedimentos não altera, por si só, o conteúdo finalizado.

Reabertura e finalização usam os resultados e faces registrados, sem chamar o PRNG. Mudança de fonte, política ou implementação suspende o save e apresenta o estado de rascunho suspenso, preservando os bytes armazenados. Não há migração automática ou troca silenciosa de contexto. JSONs inválidos ou de versões não suportadas continuam preservados para revisão.

O construtor local permite separar o diretório do corpus do diretório da implementação durante os testes. Os dados continuam sujeitos à verificação de origem; os hashes da implementação e da política vêm do código em teste. No uso normal, os dois diretórios são o próprio projeto.

## Validação

- Snapshot público: 432 testes aprovados, com 37 casos de fontes reais explicitamente ignorados sem corpus.
- Regressão com fontes reais: 153 testes dirigidos aprovados em cinco arquivos, incluindo os 120 resultados Core, Background, equipamento, procedimentos e cinco casos de finalização. O percurso de Human Development é concluído com atributos Only Human fixos e aleatórios.
- Sete testes públicos do contrato: ação explícita, obrigações de criação, efeitos de uso, opcionais, contexto, material, mecânica, recibo sem prova de completude e invalidação permanente até nova finalização.
- Interface: save incompleto não é aceito como finalizado; contexto desatualizado apresenta rascunho suspenso sem sobrescrever o save.
- Dois percursos de navegador com fontes verificadas: finalizar/reabrir Core com efeitos de uso; finalizar/reabrir procedimentos, editar e preservar o save com contexto alterado. O caso Core também confere o link para uma escolha de Background ainda pendente.
- TypeScript, build de produção, auditoria da aplicação, compilação consumível sintética e freeze dos 16 contratos conferidos.
- Privacidade: 435 arquivos rastreados/novos conferidos, zero achados.

Uma tentativa da regressão real atingiu o timeout de cinco segundos no teste que percorre os 20 Backgrounds. Foi removido um cálculo duplicado do hash de contexto; a repetição passou sem ampliar o timeout.

## Limites

Finalização representa a conclusão da criação no recorte local suportado. Não promove fontes `needs-review`, certifica paginação/distribuição ou habilita exportação. `exportEnabled` permanece falso. A revisão de distribuição/freeze da fatia real e os formatos de exportação continuam nas #55/#56.

Não foram publicados corpus, pilotos ou excertos licenciados. O workspace original com 421 arquivos acumulados permanece preservado. Código e testes estão na branch local `codex/issue54-finalization`, em `output/html/issue54-work`. Nenhum PR, deploy ou merge foi executado para esta entrega.
