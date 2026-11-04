# Entrega local da #53

Aceite técnico registrado pelo Codex em 2026-11-03, para o recorte local autorizado pelo usuário. [Atividades](plano-procedimentos-issue53.md) e [matriz](matriz-procedimentos-issue53.md).

O fluxo “Procedimentos Core / Only Human” oferece ancestralidade, modo de atributos, procedimento e fonte de Interesting Things independentes. Preserva as entregas #50–#52 e o rascunho Core existente. Core e Human Development não acumulam suas concessões exclusivas. Eventos extras de Interesting Things possuem origens próprias e não substituem o resultado inicial.

## Implementação

- Contexto local verificado com 74 tabelas, cinco consultas de Lifestyle, 19 templates dirigidos, 169 opções profissionais e 360 planos de Interesting Things. Preserva dados profissionais específicos da fonte e os pesos do seletor Oddities.
- Grafo de etapas e histórico de eventos: faces físicas ou PRNG determinístico por etapa; manual/híbrido/aleatório; bloqueio e reroll; revisão de dependentes sem apagar resultados anteriores; reinício explícito após morte preservando a tentativa anterior.
- Situação dos pais, irmãos e filhos com identidade própria; causa independente por pai morto; detalhe opcional de familiar vivo com limite de profundidade. Profissão familiar permanece separada do PC até concessão dirigida, que herda sua especialização concreta.
- Infância, experiências ordenadas, subeventos, estados, modificadores de Lifestyle e ganhos materiais conservam a origem. Consultas não rolam Lifestyle novamente. Piety e Strange conservam os resultados até o limite, deixando pendência explícita quando necessário.
- Build modifica as medidas-base antes da escala etária; anos acrescentados não criam experiências adicionais. Decisão expressa do usuário, registrada na política local.
- Interface apresenta resultados, escolhas, adjudicações com autoria/contexto, dimensões, idiomas, profissões, inventário e pendências. Equipamento exige seleção explícita de uso e conserva diagnósticos de composição.

## Gates e persistência

`curation/procedure-local-policy.json` registra autorização explícita para o recorte local. `/api/official/procedures` aceita somente loopback, host/origem locais e GET; não inclui CORS ou cache. O contexto valida as fontes reais e seus hashes antes de responder. Clones sem corpus permanecem indisponíveis, sem fallback fictício.

Sessões usam `sotdl-human-creation-session@1`, separada de `sotdl-official-core-draft@1`. Guardam configuração, referências, faces e decisões do usuário; não copiam tabelas ou evidências. A reabertura exige o hash do contexto e não rola dados. Alteração de fonte ou implementação exige revisão e preserva o save.

Esta autorização não promove fontes `needs-review`, não habilita exports, não declara personagem finalizado e não publica conteúdo licenciado. `fullyResolved` e `exportEnabled` permanecem falsos; o gate de personagem concluído continua na #54. Perfis contextuais, conjuntos mistos de Oddities, escolhas do mestre e efeitos de suplementos sem handler conservam pendências explícitas. Referências externas, inclusive o resultado Books 20, não disparam geração do livro citado. Combate e passagem de tempo não são automatizados.

## Validação

- Suíte completa: 704 testes em 63 arquivos aprovados com dois workers. A tentativa inicial sem limite efetivo teve seis timeouts; a repetição com limite passou.
- Após os últimos ajustes: 14 testes dirigidos aprovados, incluindo seis combinações mecânicas, causas independentes, herança profissional, invalidação de dependentes bloqueados, replay, dimensões, prisão sem novas experiências, ciclo de Piety, traços Core independentes, pesos e referência externa sem geração.
- Navegador: dois casos Core aprovados e dois casos de procedimentos aprovados. O primeiro teste de procedimento foi corrigido para localizar o seletor pelo papel acessível; a repetição passou. Cobertura de indisponibilidade, origem externa, geração real e reabertura sem alteração do save.
- TypeScript, build e auditoria da entrada oficial aprovados; freeze conferiu os 16 arquivos. Auditoria final de privacidade sobre 421 arquivos rastreados/novos: zero achados.

Testes com fontes reais são pulados explicitamente sem o corpus local. Três testes sintéticos do runtime executam sem livros. Aceite local não equivale a revisão independente, merge ou autorização de distribuição. Publicação e integração da #53 permanecem pendentes.

## Publicação autorizada

Branch `codex/issue53-procedures`, baseada em `codex/issue52-equipment`. Ordem de revisão e integração: #50 (PR #57) → #51 (PR #58) → #52 → #53. Redirecionar cada PR para `main` somente após integrar sua base. Publicação de código autorizada pelo usuário; merge permanece separado. Corpus, pilotos e evidências licenciadas continuam locais.
