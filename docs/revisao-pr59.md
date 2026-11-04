# Revisão do PR #59

Revisão técnica do Codex em 2026-11-03, por solicitação do usuário, após a CI aprovada dos PRs #57 e #58. Não havia comentários ou threads de revisão pendentes no GitHub.

As atualizações da base foram incorporadas à branch da #52. O conflito em `official-core.ts` foi resolvido mantendo `composeCoreEquipment`, que já aplica a penalidade negativa corretamente, e conservando o teste de regressão adicionado na #57. A implementação antiga substituída não foi reintroduzida.

Foram conferidos os 14 arquivos originais: posições, quantidades e cópias físicas, perfil e requisitos de cada arma/armadura, roupas neutras, substituição explícita de conflitos, maior bônus de escudo, suspensão até fim de rodada, compatibilidade de saves e composição na ordem mecânica. Nenhum outro defeito reproduzível foi identificado nos contextos suportados.

## Validação

- 147 testes dirigidos aprovados em quatro arquivos com fontes locais, incluindo os 120 Interesting Things e a regressão de Speed herdada.
- Snapshot público: 417 testes aprovados e 21 ignorados por ausência das fontes.
- TypeScript, build e auditoria da aplicação aprovados.
- O teste de equipamento aceita `SOTDL_LOCAL_SOURCE_ROOT` para conferir o corpus privado sem copiá-lo ao checkout público.
- Interpretações do usuário preservadas; fontes `needs-review`, exports e finalização bloqueados. Nenhum merge em `main` ou deploy.
