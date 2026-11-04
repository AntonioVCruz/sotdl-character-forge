# Revisão do PR #60

Revisão técnica do Codex em 2026-11-04, por solicitação do usuário, após a revisão e CI aprovada dos PRs #57 → #58 → #59. As atualizações foram incorporadas à branch da #53. Não havia comentários ou threads de revisão pendentes no GitHub.

Foram conferidos grafo, comandos, replay, dependências, limites, contextos de fontes, persistência, interface e composição de equipamento. Permanecem as decisões sobre causas independentes dos pais, Build antes da escala etária e experiências pela idade inicial. Os limites de suplementos, conjuntos mistos, finalização e exportação continuam explícitos.

## Correções

1. Conflitos de equipamento no fluxo de procedimentos apenas acrescentavam pendências, conservando atributos calculados visíveis. Agora suspendem `stats` e `baseResolved`, preservando estados e diagnósticos. Guardar o equipamento conflitante restaura os números por recálculo, sem novos dados.
2. Um reinício preservava o equipamento ativo e as condições de uso da tentativa anterior. O replay agora reinicia esses estados ao processar o evento de reinício; o evento e o equipamento da tentativa anterior continuam no histórico.
3. A interface permite guardar individualmente uma unidade ativa mesmo quando sua concessão desapareceu. Isso resolve equipamentos de origens invalidadas sem apagar a sessão. Um alerta explica a suspensão dos números.

Os testes de runtime reproduziram os dois defeitos antes das correções. Um teste de interface reabre uma origem indisponível, guarda a unidade, verifica a recuperação dos atributos e a conservação dos eventos salvos. Os cenários usam dados inventados.

## Validação

- 154 testes dirigidos aprovados em seis arquivos, incluindo fontes reais dos procedimentos, os 120 resultados Core, equipamento, Background e regressões de runtime/interface.
- Snapshot público: 423 testes aprovados e 32 ignorados por ausência das fontes reais.
- TypeScript, build e auditoria da aplicação aprovados.
- O teste de fonte da #53 aceita `SOTDL_LOCAL_SOURCE_ROOT` para ler o corpus privado sem copiá-lo ao checkout público.
- Nenhum merge em `main`, deploy, promoção de fonte ou liberação de exports. Saves de implementação anterior continuam sujeitos ao gate de contexto; não houve migração silenciosa.
