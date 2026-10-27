# Entrega - inventário e equipamento ativável

Data: 2026-10-26. Fatia das SPEC-003/005/006/007. Plano anterior à implementação: `docs/plano-equipamento-demo.md`.

## Comportamento entregue
- Inventário derivado da escolha confirmada de equipamento, com quantidade 1, nome, fonte/versão, modificadores e estado Equipado/Guardado/Suspenso.
- Controles **Equipar item** e **Desequipar item** no aplicativo e no HTML offline, compartilhando os mesmos comandos e cálculo puro.
- Ação `equipment` no log de sessão registra evento original, ID do item, estado desejado e posição nos históricos de criação/nível. Não altera eventos, fontes, seeds ou rolagens de criação.
- Ausência de ação significa equipado, preservando o comportamento dos arquivos anteriores. Nova escolha inicia equipada; estados anteriores continuam ligados aos respectivos eventos no histórico.
- Equipar exige a escolha atual e suas fontes válidas. Fonte ausente suspende o bônus; guardar continua permitido. Comandos para outro evento/item e referências futuras são rejeitados.
- Descansar não altera equipamento. Guardar não encerra efeito mágico nem devolve conjurações.

## Combinação de modificadores
Política fictícia explícita `demo-additive-v1`: base + ganhos permanentes válidos + bônus do único equipamento equipado/válido + efeitos temporários válidos, uma vez cada. Não há multiplicação ou regravação do atributo base. A instância única por magia continua sob as regras demonstrativas de sessão.

Exemplo com base Defense 10, Casaco reforçado (+1) e Manto da lanterna (+1): ambos ativos = 12; guardar casaco = 11 mantendo magia; encerrar magia = 10. Equipar novamente = 11. O breakdown inclui apenas parcelas efetivamente aplicadas. Essas somas são regras de laboratório, não uma afirmação sobre stacking oficial de SotDL.

Itens com consequências fora dos modificadores aditivos suportados exigem revisão e não recebem bônus automático. Não há gerenciamento de compra, loot, quantidades, peso/carga, slots de mãos/armadura ou ataques nesta entrega.

## Persistência e exportação
- JSON v2 ampliado aditivamente com o tipo de ação de sessão `equipment`; arquivos anteriores continuam legíveis e equipados por padrão. Versões antigas do aplicativo não reconhecem a nova ação.
- Estado preservado em JSON, IndexedDB e nova cópia HTML. Reimportar não habilita fontes, não troca versões nem rola dados.
- Runtime HTML passa a `demo-offline-v2`, mantendo formato de envelope v1. HTMLs antigos continuam com seu runtime incorporado; reexportar pelo app atualizado para receber os controles novos.
- Impressão A4 informa quantidade, estado, fonte, modificadores aplicados/não aplicados e política de soma. Copia os números do mesmo CharacterView da tela.

## Código
- `packages/equipment/index.ts`: visão do inventário, política demonstrativa e comando puro.
- `packages/session/model.ts`: schema/replay da ação de equipamento, independente de conjuração/descanso.
- `packages/character-generator/index.ts`: validação de referências históricas, integração de estado no cálculo e comando público.
- `apps/web/EquipmentPanel.tsx`: painel compartilhado entre app e runtime offline.
- `apps/web/CharacterSheet.tsx` e `PrintSheet.tsx`: estado em leitura e impressão.

## Evidências
**74 testes unitários/integrados e 17 E2E Chromium aprovados**, build TypeScript/Vite aprovado. Incluem as regressões anteriores e os testes específicos `tests/equipment.test.ts`, `tests/e2e/equipment.spec.ts` e o roundtrip ampliado em `tests/e2e/standalone.spec.ts`.

| Critérios | Verificação |
|---|---|
| SPEC-003 AC-001/002/003 | Guardar remove somente o bônus do item; equipar recompõe exatamente o valor; 100 ciclos sem drift, comandos idempotentes e atributos-base/eventos preservados |
| SPEC-003 AC-004 (subconjunto) | Soma explícita de equipamento e magia em ordens diferentes, uma instância de cada origem; descanso mantém estado do item |
| SPEC-005 AC-001/002/003 | Painel mostra origem, estado e bônus, ficha/breakdown atualizados e mesma visão na impressão |
| SPEC-006 AC-001/002/007 | Reload IndexedDB, JSON, arquivo antigo, fonte ausente, item incorreto e referências futuras |
| SPEC-007 AC-002/003/004/007/010 | Controles offline, JSON reimportado idêntico, nova cópia HTML reaberta com item guardado, impressão sem reaplicar bônus |

O E2E principal verifica item guardado com magia ainda ativa, reload, reexportação e PDF. O E2E file:// verifica encerramento da magia, guardar item, editar, salvar/reabrir HTML/JSON, reimportar, conjurar novamente, descansar e equipar, sem requests ou armazenamento do navegador.

PDFs `output/pdf/equipamento-guardado.pdf` e `output/pdf/personagem-offline.pdf` foram validados como A4 e suas três páginas inspecionadas visualmente. Captura do painel em `test-results/equipment-panel.png`. HTML editado de exemplo: `output/html/personagem-offline-atualizado.html`, com equipamento guardado. Artefatos não versionados.

Runtime medido: JS 703.456 bytes, CSS 6.454 bytes. HTML demonstrativo inicial: 731.558 bytes; cópia editada: 731.817 bytes. Sem novas dependências de runtime.

## Limites e próximo avanço
Um item atual da criação, quantidade fixa 1, modificadores aditivos e fonte fictícia. O inventário geral e as regras oficiais de stacking continuam pendentes. Antes de ampliar conteúdo ou progressão, priorizar curadoria de um pequeno conjunto autorizado de regras reais, verificando as políticas demonstrativas contra as fontes.
