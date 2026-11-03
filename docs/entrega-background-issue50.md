# Entrega local de Background — issue #50

Implementação do Codex em 2026-11-03. Publicação adiada por escolha explícita do usuário. A issue permanece aberta para distinguir entrega local de integração no GitHub.

## Resultado

Background Core é uma etapa facultativa com seleção de linha publicada, sorteio explícito, restauração do sorteio anterior e remoção. Não impõe rolagem a quem deixa a etapa vazia. A restauração reutiliza faces; não representa rerrolagem.

Os 20 resultados foram conferidos contra a projeção local verificada. Consequências: estados, quantidades narrativas com limites, concessões de idiomas, dinheiro, objeto genérico sem estatísticas inferidas, escolha de marca física e preservação da história. O ganho de leitura não concede escrita. Profissões podem alfabetizar no idioma de Background enquanto ele estiver disponível; retirar sua origem devolve a escolha dependente a pendente.

O motor recompõe os ganhos a partir da origem ativa, sem alterar os estados-base do personagem nem somar novamente os resultados no replay. Faces e escolhas anteriores permanecem no rascunho, mas consequências de linhas inativas não são aplicadas. Estado, quantidade, programa material e template de idioma são expostos como eventos tipados sob a proveniência do resultado: fonte, evidências e hash exato do contexto.

## Rastreabilidade

- Plano: `docs/plano-background-issue50.md`.
- Conferência local de cobertura e hashes, sem excertos: `curation/reviews/issue50-background-2026-11-03.json`.
- Projeção de consequências: `tools/curation/core-background-projector.ts`.
- Contrato/replay: `packages/character-generator/core-background.ts`.
- Integração: `packages/character-generator/official-core.ts` e `apps/web/OfficialCoreGenerator.tsx`.

## Limites preservados

Fontes permanecem `needs-review`. Não houve inspeção de PDF, promoção de fonte, autorização de distribuição, exportação ou fechamento das #34–#37. Interesting Things conserva sua pendência própria. Um objeto genérico não recebe preço, bônus ou definição inventada.

O hash da implementação agora inclui o projetor e o handler de Background. Rascunhos presos a uma implementação anterior continuam preservados e são suspensos pelo gate de contexto; não há migração silenciosa nem novos sorteios para fazê-los parecer compatíveis.

## Validação

- Suíte completa: 549 testes em 57 arquivos, com dois workers e limite original de tempo preservado. A primeira execução paralela teve cinco timeouts; a repetição controlada passou.
- Depois do ajuste final de invalidação: 12 testes direcionados em três arquivos aprovados, incluindo a conferência local dos 20 resultados e replay sem RNG.
- Navegador: dois E2Es aprovados, cobrindo fontes indisponíveis, geração real, seleção/remoção de Background, reabertura sem rerrolagem e ausência de exports. O seletor recebeu nome acessível explícito após a primeira reprodução.
- Freeze: os 16 arquivos do contrato 1.0.0 permanecem intactos.
- Privacidade: zero achados em 390 arquivos rastreados/novos. Insumos reais e textos das tabelas permanecem ignorados.
- TypeScript, build de produção e auditoria da entrada oficial aprovados novamente após o ajuste final do seletor.

O aceite foi registrado no corpo da [issue #50](https://github.com/AntonioVCruz/sotdl-character-forge/issues/50), com publicação pendente conforme a escolha do usuário.

## Publicação solicitada

Publicação em branches encadeadas: `codex/issue50-background` primeiro; `codex/issue51-interesting-things` depois. A primeira inclui a base oficial local necessária, anteriormente não publicada. Publicação de código não significa merge, deploy ou distribuição dos insumos reais.
