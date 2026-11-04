# Atividades da issue #54

Escopo: estado de personagem finalizado para os fluxos oficiais locais Core e Procedimentos Core / Only Human, sobre a main `2e94ddd`. Autoria: Codex. Início: 2026-11-04.

1. [x] Inventariar pendências obrigatórias, opcionais não escolhidas, capacidades e efeitos de uso nos dois fluxos; registrar a matriz de completude.
2. [x] Implementar avaliação de completude e contrato versionado de finalização, com diagnóstico acionável e contexto validado.
3. [x] Integrar a ação explícita de finalizar aos dois runtimes, revalidando escolhas e consequências; invalidar o estado quando resultados, configuração ou equipamento mudarem.
4. [x] Persistir e reabrir o estado sem novas rolagens; preservar saves anteriores, histórico e dados de contexto desatualizado sem confiar em flags salvas.
5. [x] Expor estado, ação de finalizar e pendências na interface, distinguindo efeitos de uso e etapas facultativas não escolhidas.
6. [x] Validar bloqueios, percurso completo suportado, alteração posterior, replay e reabertura com testes públicos inventados e fontes reais locais; verificar interface, TypeScript, build, privacidade e freeze.
7. [x] Registrar a entrega, decisões, resultados e limites, com os arquivos e validações disponíveis para revisão.

Ordem: 1 → 2 → 3 → 4 → 5 → 6 → 7. Publicação de PR e merge são etapas separadas.

## Decisão explícita do usuário

Todas as escolhas e consequências obrigatórias da criação devem estar resolvidas. Efeitos reservados ao uso em jogo, como consumo de item ou bônus condicionado à cena, permanecem visíveis e separados e não bloqueiam a finalização. Pendências que impedem determinar uma concessão ou capacidade do personagem continuam bloqueantes.

Finalização não promove fontes `needs-review`, não certifica distribuição e não habilita exports (#55/#56). Fontes, pilotos e evidências licenciadas continuam locais. O workspace original com mudanças acumuladas permanece preservado; implementação em `output/html/issue54-work`, branch `codex/issue54-finalization`.

Entrega executada e verificada localmente: [comportamento, validação e limites](entrega-finalizacao-issue54.md); [matriz de completude](matriz-finalizacao-issue54.md).
