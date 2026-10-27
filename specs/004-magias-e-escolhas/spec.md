# SPEC-004 — Tradições, aprendizado e substituição
**Status:** Draft. **Prioridade:** P1. **Requisitos:** RF-007, RF-011.

## Aceitação
AC-001: spells são identificadas por publicação, tradição/path, rank, nome e versão, sem mesclar republicações.
AC-002: adquirir tradition concede os benefícios que o path/ruleset explicitamente definir; sem supor sempre a mesma quantidade de spells.
AC-003: algoritmo oferece somente opções elegíveis no momento exato de cada slot.
AC-004: se regra opcional de substituição de *Occult Philosophy* for ativada, um slot posterior no mesmo nível pode considerar uma magia aprendida no slot anterior, **conforme opção de mesa registrada**.
AC-005: fazer swap registra `replacesEventId`, remove spell anterior da lista corrente e mantém histórico de aprendizado.
AC-006: usos/castings/resources representam estado de sessão separado do catálogo.
AC-007: spells com efeitos não automatizados mostram a descrição e aviso.

## Dependência
SPEC-001 e SPEC-002; integração com SPEC-003 para efeitos ativáveis.

## Aditivo v0.2 — aprendizado aleatório
**AC-008:** ao descobrir tradição ou aprender magia, oferecer seleção manual ou aleatória dentre opções atualmente elegíveis; sem tabela publicada, rotular como `uniform-eligible`.
**AC-009:** geração completa processa cada slot em ordem. Um slot posterior considera resultados anteriores do mesmo nível, inclusive regra opcional autorizada de substituição.
**AC-010:** conjurações, rank, restrições de path, tradições descobertas e fonte habilitada continuam obrigatórios no sorteio; jamais descartar regra para completar a build.
