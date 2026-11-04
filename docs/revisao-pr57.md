# Revisão do PR #57

Revisão técnica do Codex em 2026-11-03, por solicitação do usuário. Base analisada: `bf847e5`; entrega inicial: `7775e6e`. Discussões e revisões no GitHub não tinham pendências no momento da conferência.

O diff de 44 arquivos foi conferido nas camadas de compilação consumível, projeção e validação local, entrada HTTP, persistência, Background e composição mecânica. Fontes continuam `needs-review`; exports e finalização permanecem bloqueados.

## Correção

A integração de armadura negava novamente `speedPenalty`, que já é negativo no avaliador, aumentando Speed em vez de reduzi-la. A camada oficial agora aplica o valor com seu sinal original. O teste de integração usa um perfil pesado inventado sobre uma concessão possuída e verifica penalidade de −4, replay, guarda e conservação dos dados. O teste falhou com o sinal antigo e passou após a correção.

Os testes de fonte aceitam `SOTDL_LOCAL_SOURCE_ROOT` para ler o corpus privado de outro diretório local sem copiá-lo ou adicioná-lo ao checkout. Sem essa variável, o comportamento anterior é preservado; clones sem corpus ignoram explicitamente os casos de fonte.

## Validação

- Oito testes de integração com o corpus local aprovados.
- Snapshot público: 402 testes aprovados e 12 ignorados por ausência das fontes.
- TypeScript, build e auditoria da aplicação aprovados.
- Nenhum merge ou promoção de fonte realizado. A composição ampliada de equipamento permanece no PR dependente da #52.
