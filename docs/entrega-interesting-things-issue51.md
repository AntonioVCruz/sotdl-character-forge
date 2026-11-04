# Entrega local de Interesting Things — issue #51

Implementação do Codex em 2026-11-03. Escopo: consequências de criação dos 120 resultados Core. Publicação posterior, seguindo a escolha anterior do usuário; a issue permanece aberta para integração.

## Resultado

A concessão inicial produz somente o resultado ativo. Objetos e veículos entram no inventário; companheiros/dependentes, relações e narrativa têm registros próprios. Resultados mistos preservam os componentes e as alternativas: escolher uma cicatriz não concede também os objetos das outras opções.

Conjuntos materiais conservam a descrição completa. Quantidades de conteúdo, recursos, dimensões e capacidade são registradas à parte da quantidade do conjunto: bolsos não são capas adicionais, nem comprimento representa vários objetos. Valores patrimoniais não creditam moedas. Registros sem definição exata continuam genéricos, sem preço ou estatísticas inferidos por nome.

Escolhas são vinculadas ao resultado, evitando que a alternativa de uma tabela seja reaplicada a outra. Trocar resultado/alternativa recompõe somente a origem ativa e suspende equipamento dependente. Faces de dados já consumidos, decisões anteriores e histórico de comandos permanecem no save. Restauração de sorteio e recálculo não fazem novas rolagens.

Os resultados que reservam a escolha da arma ao mestre exigem identificação concreta e autoria/contexto: uma definição publicada ou um nome genérico. Nome genérico conserva pendência específica de perfil mecânico. Uma aprovação booleana não resolve a escolha. Revisões da decisão permanecem no histórico.

## Efeitos de uso

Dados e efeitos de uso não são executados na criação. Iluminação, boons condicionais, consumo, recuperação, mudança de aparência e condições não quantificadas têm registros e motivos próprios, sob a proveniência do resultado. A descrição completa continua disponível para resolução em cena. Não foi implementado um motor de cenas ou consumo de recursos nesta issue.

`creationResolved` distingue criação resolvida de efeitos de uso ainda pendentes; `fullyApplied` conserva essa diferença. A pendência genérica e incondicional de aplicar Interesting Thing foi removida. Pendências específicas continuam visíveis; nenhum checkbox genérico aprova conteúdo ou esconde falta de handler. A ficha geral ainda depende da #54 e dos demais gates.

## Interpretação explícita da armadura

O usuário determinou que a camisa especial usa os atributos mecânicos de mail, como armadura leve, com peso 0 e sem requisito de Strength. A decisão está em `curation/interesting-things-local-policy.json`. O perfil derivado conserva a evidência do resultado e da definição-base, com autoridade local distinta dos fatos publicados.

Possuir a camisa não altera Defense. Vestir aplica a substituição definida; guardar ou trocar de resultado remove o efeito. A composição não acumula armaduras: conflito mantém os números suspensos até o usuário resolver o equipamento. Preço desconhecido do objeto especial não vira zero nem dinheiro disponível.

## Rastreabilidade e limites

- Plano: `docs/plano-interesting-things-issue51.md`.
- Conferência de resultados/evidências e hash da política, sem excertos: `curation/reviews/issue51-interesting-things-2026-11-03.json`.
- Projetor: `tools/curation/core-interesting-things-projector.ts`.
- Contrato/aplicação pura: `packages/character-generator/core-interesting-things.ts`.
- Comandos e replay: `packages/character-generator/official-core.ts`.
- Interface: `apps/web/InterestingThingPanel.tsx`.

Fonte, evidência, identidade da concessão e hash do contexto acompanham os registros. O hash inclui os novos módulos e a política local. Rascunhos presos ao contexto anterior continuam preservados e suspensos, sem migração silenciosa.

Only Human, Oddities, exportação, compra e composição ampla de equipamento não foram habilitados. Fontes continuam `needs-review`; não houve inspeção de PDF, promoção de fonte ou autorização de distribuição. Os textos completos e os insumos reais continuam locais.

## Validação

- Suíte completa: **678 testes em 59 arquivos**, com dois workers e limite original de tempo preservado.
- Rodada direcionada final: **136 testes em três arquivos**, com os 120 resultados Core e suas alternativas, replay sem RNG, quantidades, dinheiro, decisões do mestre, armadura especial e regressões de Background.
- **Dois E2Es aprovados**, incluindo seleção manual, troca entre objeto e narrativa, vestir/remover o efeito da armadura pela troca de resultado, reabertura, registro/autoria da arma escolhida pelo mestre e bloqueio de fontes/exports.
- Contrato congelado 1.0.0: **16 arquivos preservados**.
- Privacidade: **zero achados em 399 arquivos** rastreados/novos. Textos completos e insumos reais permanecem ignorados.
- TypeScript, build de produção e auditoria da entrada oficial aprovados após os ajustes finais.

O aceite foi registrado no corpo da [issue #51](https://github.com/AntonioVCruz/sotdl-character-forge/issues/51), que permanece aberta para publicação e integração posteriores.

## Publicação solicitada

Publicação em branches encadeadas: `codex/issue50-background` primeiro; `codex/issue51-interesting-things` depois. A primeira inclui a base oficial local necessária, anteriormente não publicada. Publicação de código não significa merge, deploy ou distribuição dos insumos reais.
