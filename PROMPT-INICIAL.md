# Prompt inicial para agente de programação

Você atuará como engenheiro full-stack experiente e seguirá desenvolvimento dirigido por especificações. Estamos iniciando um app de criação, progressão e gestão de personagens de Shadow of the Demon Lord.

Antes de escrever código:
1. Leia `constitution.md`, `docs/visao-produto.md`, `docs/arquitetura.md`, `docs/modelo-de-dados.md` e `specs/001-catalogo-e-proveniencia/spec.md`, `specs/008-tabelas-aleatorias/spec.md`, `specs/009-geracao-aleatoria/spec.md` e `docs/fluxo-aleatoriedade.md`.
2. Identifique contradições e perguntas que alterariam a validade da spec; aplique os defaults já aprovados em `docs/decisoes-pendentes.md` quando não houver impedimento.
3. Produza um plano de implementação para SPEC-001, incluindo contrato `RandomTable` necessário à SPEC-008; separe claramente dependências da SPEC-002 e SPEC-009. Não implemente features alheias à fatia selecionada.
4. Garanta que variantes do mesmo nome em publicações distintas permaneçam separadas e que conteúdos não validados não tenham mecânica inventada.
5. Implemente **uma fatia funcional**, com testes antes de fechar a tarefa. Apresente mudanças feitas, testes executados e lacunas restantes.

Restrições: React/Vite/TypeScript na UI, motor puramente TypeScript; IndexedDB offline-first; packs JSON com validação; não embutir conteúdo de livros protegidos em repositório público; não escrever cálculos em componentes visuais; não usar eval.

Para cada nova funcionalidade, siga `spec → esclarecer → plan → tasks → implementar/testar → conferir critérios e atualizar docs`. Ao propor algo novo, explique se faz parte do MVP ou de um roadmap posterior.

**Requisitos inegociáveis de aleatoriedade (v0.2):** todo `ChoiceSlot` suporta manual, sortear e refazer; o wizard oferece modo manual, híbrido e «Gerar personagem inteiro» até nível-alvo. Não usar seleção uniforme para interpretar tabelas `2d6/3d6` ou intervalos; manter decisões aleatórias e rolagens auditáveis por seed/versão, incluindo tabelas encadeadas e efeitos mecânicos publicados. Não usar `Math.random()` em render, `calculateCharacter` ou reducers. Sem tabela oficial, o fallback «uniforme dentre elegíveis» deve ser nomeado como tal, nunca apresentado como rolagem oficial. Itens narrativos sem fonte/gerador deixam pendências declaradas. Implementar preview/confirm/cancel e locks por slot, sem corromper escolhas manuais.

**Teste vertical prioritário:** personagem de nível 0 com escolha manual ou aleatória em cada slot, sorteio do background (tabela de dados demonstrativa), equipamento, modo tudo aleatório, resultado reproduzível, export/import com rastreio de rolagens. Só ampliar o catálogo depois da validação das tabelas.
