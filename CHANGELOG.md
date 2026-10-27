# Changelog

## Planejamento da curadoria dos compêndios MD — 2026-10-26
- Levantamento inicial dos quatro arquivos em rules/ e backlog de 41 tarefas com dependências, critérios de aceite e gates por fatia.
- Formato proposto de staging, packs por publicação, índices temáticos e rastreabilidade; identificação das adaptações necessárias para consumir regras reais no criador.

## Inventário e equipamento ativável — 2026-10-26
- Controles de equipar/guardar a unidade do item confirmado, sem reescrever criação ou rolagens.
- Política fictícia explícita de soma com efeitos temporários, comandos idempotentes e descanso preservando equipamento.
- Estado e fonte no app, JSON, IndexedDB, PDF e runtime HTML `demo-offline-v2`.
- Testes de 100 ciclos sem drift, combinação com magia, referências inválidas e roundtrip offline.

## HTML autônomo editável offline — 2026-10-26
- Exportação de arquivo único com runtime, estilos, personagem e packs fictícios versionados; abertura file:// sem servidor/rede/storage.
- Edição de nome/notas e controles de sessão compartilhando o motor e a impressão A4.
- Nova cópia HTML e JSON reimportável preservando escolhas, rolls, recursos e ações de sessão.
- Serialização segura, CSP por hashes e validação E2E offline, incluindo conteúdo malicioso e fonte desabilitada.

## Ficha A4 e PDF por impressão — 2026-10-26
- Prévia de leitura e impressão nativa da ficha confirmada, usando o mesmo CharacterView da tela.
- Layout A4 branco com paginação, fontes, breakdown, magias, efeitos, usos e pendências; notas longas sem truncamento.
- Testes de PDF verificam valores, tamanho de página, texto, ausência de controles e preservação do JSON; PDFs renderizados para QA visual.

## Conjuração e efeitos de sessão demonstrativos — 2026-10-26
- Log de sessão separado do aprendizado, dois usos fictícios por magia/descanso e instâncias com ativação explícita.
- Quatro efeitos temporários aditivos, recálculo com origem, encerramento e descanso sem drift.
- Suspensão por fonte ou aprendizado inválido, preservação de consumo e histórico no JSON/IndexedDB.
- Painel de sessão e testes de limites, 100 ciclos de ativação/encerramento, roundtrip e E2E.

## Aprendizado mágico demonstrativo — 2026-10-26
- Duas tradições fictícias, Brasa Serena e Eco de Vidro, com quatro magias rank 0.
- Slots condicionais de tradição e magia para o Aprendiz da Centelha, com seleção manual/aleatória e revalidação sequencial.
- Grimório com descrição, fonte e resolução manual; revisão preserva eventos e magia incompatível com pendência.
- Preservação de escolhas ao alternar caminho/nível e roundtrip JSON/IndexedDB, com testes unitários e E2E.

## Progressão demonstrativa 0–1 — 2026-10-25
- Dois caminhos fictícios, marcial e mágico, com ganhos declarativos e treinamentos exclusivos.
- Avanço de nível preservando escolhas anteriores, revisão transitiva de dependências e restauração de escolha anterior.
- Reversão ao nível 0 e retorno a 1 mantendo decisões, travas e rolagens, sem duplicar benefícios.
- JSON v2 com histórico de níveis e migração de v1; testes dos dois caminhos, persistência e E2E.

## Fatia de personagem nível 0 — 2026-10-25
- Geração demonstrativa manual, híbrida e aleatória; PRNG versionado, tabelas encadeadas e histórico auditável.
- Preview/confirm/cancel, travas, rerrolagens locais e pendências de dependências/fontes.
- Ficha com cálculo puro, consequências tipadas, IndexedDB e export/import JSON sem novos sorteios.
- Testes de distribuição exata de 3d6, replay, persistência e E2E dos três modos.

## Primeira fatia implementada — 2026-10-25
- Catálogo React/Vite/TypeScript com importação JSON, fontes habilitadas, proveniência e IndexedDB.
- Schemas Zod e validação de tabelas, versões, conflitos, referências, cobertura e ciclos.
- Testes Vitest e Playwright; documentação de decisões, rastreabilidade e fronteiras com geração de personagens.

## v0.2 — 2026-10-25
- Especificações novas **008 (motor de tabelas aleatórias)** e **009 (geração manual/híbrida/tudo aleatório)**, com `spec.md`, `plan.md` e `tasks.md`.
- Constituição reforçada com aleatoriedade auditável, seed/PRNG version, respeito a fonte/edição, probabilidades exatas e pré-requisitos.
- Todas as sete specs existentes atualizadas para se integrar a RandomTable, RollEvent, locks, UI por etapa, geração integral e import/export.
- Arquitetura com `packages/random-tables` e `packages/character-generator`; contratos e fluxos técnicos, distinção tabela oficial vs uniforme entre elegíveis.
- PRD/README/PROMPT e checklists atualizados; modos híbrido e all-random agora parte do MVP.
- Documentação de curadoria por fonte, fluxo UX, matriz Given-When-Then, primeira fatia de implementação e fixtures **fictícias** sem reprodução de conteúdo protegido.

## v0.1
- Kit original com especificações 001–007, arquitetura, constituição, PRD, exemplo de pack e roteiro do agente.
