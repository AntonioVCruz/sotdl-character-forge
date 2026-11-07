# Matriz de aceite Human L0 - atividade 2

Avaliação documental/técnica por Codex em 2026-11-06. Base `2c5ef89`, checkout `output/html/issue56-work`, branch `codex/issue56-exports`, incluindo a #56 ainda sem commit. [Escopo fixado](escopo-fechamento-human-l0.md). Registro estruturado: [critérios e evidências](../curation/reviews/human-l0-closure-activity2-2026-11-06.json).

As cinco issues foram consultadas pelo conector GitHub nesta atividade. Os textos abaixo reproduzem os critérios das seções indicadas, com ordinais locais estáveis; seus estados remotos continuam abertos. Descrições antigas das issues sobre funcionalidades inexistentes não anulam as entregas posteriores. Nenhuma issue foi editada ou fechada.

## Método e significado dos estados

- **Comprovado no recorte:** há implementação inspecionada e evidência existente adequada ao critério delimitado; não significa integração da #56 nem todas as combinações possíveis.
- **Parcial:** parte está implementada/provada, mas resta requisito ou cobertura identificável.
- **Pendente:** o comportamento requerido não foi identificado no fluxo real; a infraestrutura histórica não o substitui.
- **Fora do recorte:** exigiria exclusão explícita e acordada. Nenhum critério original foi retirado unilateralmente nesta avaliação.

Não foram reexecutados testes nesta atividade, que cruza evidências existentes. Código/teste inspecionado demonstra o que está coberto, não equivale a uma nova execução aprovada. Ausência de evidência é distinguida de ausência de implementação nos comentários e ações.

Total: **39 critérios originais + 6 atividades do roadmap #34 = 45 registros**: 28 comprovados no recorte, 16 parciais e 1 pendente. Esses números medem obrigações, não percentual de código pronto ou de fechamento das issues.

## Tipos e registros de execução

| Registro | O que sustenta | O que não sustenta |
| --- | --- | --- |
| Testes públicos fictícios | Contratos, rejeição de entradas, replay e composição com fixtures declaradas | Fidelidade de todos os resultados dos livros |
| Verificações reais locais #50–#55 | Lotes, perfis, 70 streams, seletores, consequências e percursos identificados nos relatórios | Todos os cruzamentos dos modos/fontes/variantes |
| Entrega local #56 | Suíte registrada com 596 aprovados/4 ignorados; rodada final dos sete testes próprios; dois E2Es de emissão/importação; PDFs Core/procedimentos renderizados e conferidos | Commit, CI remota ou publicação da #56 |
| [CI do PR #62](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/42268367260) | Check aprovado no head `dbbb0aca2300762a96cc2f0adedc327a518aac21`, observado nesta sessão antes do merge | Mudanças locais posteriores, corpus privado ou E2E não configurado na CI |
| [CI da main após #62](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/42268504437) | Check aprovado em `2c5ef8924e643622132d1c2f6d07ce92009f2dff`, observado nesta sessão após o merge | Aceite técnico/UX independente ou aprovação de direitos de distribuição |

Os registros de CI acima são evidências já observadas na sessão, não novas execuções ou consultas de logs nesta atividade. O workflow atual executa privacidade, histórico, testes públicos, build e compilação consumível da fixture; não executa os percursos privados de navegador/PDF. Contagens históricas de suítes pertencem às respectivas entregas e não são somadas.

## Catálogo de evidências

### E01 - Escopo e origem

Tipo: público fictício + real local + documental.

Código/contrato: [tools/curation/core-local-projector.ts](../tools/curation/core-local-projector.ts); [tools/curation/core-local.mjs](../tools/curation/core-local.mjs); [packages/curation/human-l0-core-local.ts](../packages/curation/human-l0-core-local.ts).

Testes: [tests/curation-core-local.test.ts](../tests/curation-core-local.test.ts); [tests/curation-core-local-source.test.ts](../tests/curation-core-local-source.test.ts).

Revisão/entrega: [docs/escopo-fechamento-human-l0.md](../docs/escopo-fechamento-human-l0.md); [docs/entrega-core-real-issue34-atividade3.md](../docs/entrega-core-real-issue34-atividade3.md); [docs/fechamento-issue34-atividade1.md](../docs/fechamento-issue34-atividade1.md).

### E02 - Compilação consumível e ponte de lotes

Tipo: público fictício; não comprova compilação genérica dos três lotes reais.

Código/contrato: [tools/curation/human-l0-consumable-compiler.ts](../tools/curation/human-l0-consumable-compiler.ts); [packages/curation/human-l0-consumable-bundle.ts](../packages/curation/human-l0-consumable-bundle.ts); [tools/curation/pack-compiler.ts](../tools/curation/pack-compiler.ts).

Testes: [tests/curation-human-l0-consumable-compiler.test.ts](../tests/curation-human-l0-consumable-compiler.test.ts); [tests/curation-human-l0-consumable-activity4.test.ts](../tests/curation-human-l0-consumable-activity4.test.ts); [tests/curation-human-l0-mechanical-compiler.test.ts](../tests/curation-human-l0-mechanical-compiler.test.ts).

Revisão/entrega: [docs/entrega-compilacao-handlers-consumiveis-human-l0.md](../docs/entrega-compilacao-handlers-consumiveis-human-l0.md); [curation/human-l0-consumable-compilation.json](../curation/human-l0-consumable-compilation.json).

### E03 - Schemas, handlers e replay

Tipo: público fictício + real local.

Código/contrato: [packages/character-generator/human-l0.ts](../packages/character-generator/human-l0.ts); [packages/character-generator/human-l0-consumables.ts](../packages/character-generator/human-l0-consumables.ts); [packages/character-generator/official-core.ts](../packages/character-generator/official-core.ts); [packages/character-generator/core-background.ts](../packages/character-generator/core-background.ts); [packages/character-generator/core-interesting-things.ts](../packages/character-generator/core-interesting-things.ts).

Testes: [tests/human-l0-consumables.test.ts](../tests/human-l0-consumables.test.ts); [tests/official-core-source.test.ts](../tests/official-core-source.test.ts); [tests/official-interesting-things-source.test.ts](../tests/official-interesting-things-source.test.ts).

Revisão/entrega: [docs/entrega-background-issue50.md](../docs/entrega-background-issue50.md); [docs/entrega-interesting-things-issue51.md](../docs/entrega-interesting-things-issue51.md).

### E04 - Equipamento e camadas

Tipo: público fictício + real local.

Código/contrato: [packages/character-generator/core-equipment.ts](../packages/character-generator/core-equipment.ts); [tools/curation/core-equipment-projector.ts](../tools/curation/core-equipment-projector.ts); [apps/web/OfficialEquipmentPanel.tsx](../apps/web/OfficialEquipmentPanel.tsx).

Testes: [tests/core-equipment.test.ts](../tests/core-equipment.test.ts); [tests/official-equipment-source.test.ts](../tests/official-equipment-source.test.ts).

Revisão/entrega: [docs/entrega-equipamento-issue52.md](../docs/entrega-equipamento-issue52.md); [curation/reviews/issue52-equipment-2026-11-03.json](../curation/reviews/issue52-equipment-2026-11-03.json).

### E05 - Procedimentos e dependências

Tipo: público fictício + real local.

Código/contrato: [packages/character-generator/procedure-model.ts](../packages/character-generator/procedure-model.ts); [packages/character-generator/procedure-graph.ts](../packages/character-generator/procedure-graph.ts); [packages/character-generator/procedure-runtime.ts](../packages/character-generator/procedure-runtime.ts); [tools/curation/procedure-local-context.ts](../tools/curation/procedure-local-context.ts).

Testes: [tests/procedure-runtime.test.ts](../tests/procedure-runtime.test.ts); [tests/procedure-source.test.ts](../tests/procedure-source.test.ts).

Revisão/entrega: [docs/matriz-procedimentos-issue53.md](../docs/matriz-procedimentos-issue53.md); [docs/entrega-procedimentos-issue53.md](../docs/entrega-procedimentos-issue53.md); [curation/reviews/issue53-procedures-2026-11-03.json](../curation/reviews/issue53-procedures-2026-11-03.json).

### E06 - Finalização

Tipo: público fictício + real local + navegador local.

Código/contrato: [packages/character-generator/character-finalization.ts](../packages/character-generator/character-finalization.ts); [apps/web/CharacterCompletionPanel.tsx](../apps/web/CharacterCompletionPanel.tsx).

Testes: [tests/character-finalization.test.ts](../tests/character-finalization.test.ts); [tests/finalization-source.test.ts](../tests/finalization-source.test.ts); [tests/helpers/finalization-paths.ts](../tests/helpers/finalization-paths.ts); [tests/e2e/character-finalization.spec.ts](../tests/e2e/character-finalization.spec.ts).

Revisão/entrega: [docs/entrega-finalizacao-issue54.md](../docs/entrega-finalizacao-issue54.md); [docs/matriz-finalizacao-issue54.md](../docs/matriz-finalizacao-issue54.md).

### E07 - Revisão, probabilidades, páginas e freeze

Tipo: público fictício + revisão real local; snapshot histórico #55.

Código/contrato: [tools/curation/review-human-l0.ts](../tools/curation/review-human-l0.ts); [tools/curation/review-freeze.ts](../tools/curation/review-freeze.ts); [tools/curation/review-pdf.py](../tools/curation/review-pdf.py); [tools/curation/freeze.mjs](../tools/curation/freeze.mjs).

Testes: [tests/review-freeze.test.ts](../tests/review-freeze.test.ts); [tests/review-freeze-source.test.ts](../tests/review-freeze-source.test.ts).

Revisão/entrega: [docs/entrega-revisao-freeze-issue55.md](../docs/entrega-revisao-freeze-issue55.md); [docs/matriz-revisao-freeze-issue55.md](../docs/matriz-revisao-freeze-issue55.md); [docs/revisao-semantica-issue55.md](../docs/revisao-semantica-issue55.md); [curation/human-l0-review-freeze.json](../curation/human-l0-review-freeze.json).

### E08 - Política e gates locais

Tipo: público fictício + inspeção de políticas e código.

Código/contrato: [tools/official-local-plugin.ts](../tools/official-local-plugin.ts); [tools/curation/official-local-context.ts](../tools/curation/official-local-context.ts); [curation/official-local-policy.json](../curation/official-local-policy.json); [curation/procedure-local-policy.json](../curation/procedure-local-policy.json); [tools/curation/privacy-check.mjs](../tools/curation/privacy-check.mjs).

Testes: [tests/official-core.test.ts](../tests/official-core.test.ts); [tests/curation-privacy.test.ts](../tests/curation-privacy.test.ts).

Revisão/entrega: [docs/politica-distribuicao-conteudo.md](../docs/politica-distribuicao-conteudo.md); [docs/destinos-permissoes-issue55.md](../docs/destinos-permissoes-issue55.md); [docs/ativacao-oficial-local-core.md](../docs/ativacao-oficial-local-core.md).

### E09 - Interface e persistência atuais

Tipo: público fictício + navegador com fontes reais; sem aceite global de UX.

Código/contrato: [apps/web/OfficialCoreGenerator.tsx](../apps/web/OfficialCoreGenerator.tsx); [apps/web/CreationProcedures.tsx](../apps/web/CreationProcedures.tsx); [apps/web/InterestingThingPanel.tsx](../apps/web/InterestingThingPanel.tsx); [apps/web/main.tsx](../apps/web/main.tsx).

Testes: [tests/creation-procedures-ui.test.tsx](../tests/creation-procedures-ui.test.tsx); [tests/e2e/official-core.spec.ts](../tests/e2e/official-core.spec.ts); [tests/e2e/official-procedures.spec.ts](../tests/e2e/official-procedures.spec.ts); [tests/e2e/character-finalization.spec.ts](../tests/e2e/character-finalization.spec.ts).

Revisão/entrega: [docs/entrega-procedimentos-issue53.md](../docs/entrega-procedimentos-issue53.md); [docs/entrega-finalizacao-issue54.md](../docs/entrega-finalizacao-issue54.md).

### E10 - Arquivos mínimos da ficha (#56 local)

Tipo: público fictício + real local + navegador/PDF local; sem CI ou commit da #56.

Código/contrato: [packages/character-generator/character-export.ts](../packages/character-generator/character-export.ts); [apps/web/CharacterExportPanel.tsx](../apps/web/CharacterExportPanel.tsx); [apps/web/character-export-html.ts](../apps/web/character-export-html.ts).

Testes: [tests/character-export.test.ts](../tests/character-export.test.ts); [tests/character-export-source.test.ts](../tests/character-export-source.test.ts); [tests/e2e/character-export.spec.ts](../tests/e2e/character-export.spec.ts).

Revisão/entrega: [docs/plano-exportacao-issue56.md](../docs/plano-exportacao-issue56.md); [docs/entrega-exportacao-issue56.md](../docs/entrega-exportacao-issue56.md).

### E11 - Compatibilidade e CI pública

Tipo: público fictício + registros históricos de integração; CI não executa E2E privado.

Código/contrato: [packages/character-generator/runtime.ts](../packages/character-generator/runtime.ts); [.github/workflows/ci.yml](../.github/workflows/ci.yml); [vite.config.ts](../vite.config.ts); [playwright.config.ts](../playwright.config.ts).

Testes: [tests/catalog.test.ts](../tests/catalog.test.ts); [tests/standalone.test.ts](../tests/standalone.test.ts); [tests/human-l0-preview-ui.test.tsx](../tests/human-l0-preview-ui.test.tsx).

Revisão/entrega: [docs/aceite-integrado-human-l0.md](../docs/aceite-integrado-human-l0.md); [docs/aceite-s1-issues9-10.md](../docs/aceite-s1-issues9-10.md); [docs/entrega-revisao-freeze-issue55.md](../docs/entrega-revisao-freeze-issue55.md).

## Issue #34 - critérios originais

Fonte: [#34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34), atualização do corpo em `2026-11-03T03:18:29Z`. IDs AC seguem a ordem da seção “Critérios de aceite”.

| ID | Critério original | Estado | Evidências e avaliação | Ação restante |
| --- | --- | --- | --- | --- |
| I34-AC01 | Inventário da fatia: incluídos/adiados por fonte e resultado, com motivo e evidência; sem alegar revisão de todo o corpus. | Comprovado no recorte | E01, E07: Matriz #55 liga 2.932 registros por lote a fontes, evidências, handlers e exclusões; atividade 1 fixa o recorte. | Manter os limites por registro; não extrapolar para o corpus inteiro. |
| I34-AC02 | Schemas e handlers tipados para cada consequência consumida; referência exata a pack/versão/entidade/resultado, sem código executável ou regra inferida por nome. | Comprovado no recorte | E03, E04, E05: Contratos tipados e origens explícitas nos handlers consumidos; casos sem implementação conservam pendências. | Conferir alterações futuras sem inventar perfis por rótulo. |
| I34-AC03 | Domínios, pesos publicados, intervalos, lacunas, subtabelas e side rolls conferidos; sem sorteio uniforme de linhas no lugar da distribuição publicada. | Comprovado no recorte | E05, E07: Revisão de 70 streams, quatro seletores e enumeração independente; faces e fontes distintas preservadas. | Não confundir distribuições marginais verificadas com todos os percursos completos. |
| I34-AC04 | Ganhos de estados, atributos, idiomas/alfabetização, profissões, moedas e inventário preservados uma vez por origem; recálculo não sorteia nem duplica ganhos. | Comprovado no recorte | E03, E05, E06: Replay, origem única, dinheiro exato, profissões e habilidades distintas possuem regressões fictícias e reais. | Manter invariantes no aceite vertical ampliado da atividade 4. |
| I34-AC05 | Equipar/guardar e substituições de Defense respeitam escopo e camadas, com conflitos e efeitos sem suporte diagnosticados. | Comprovado no recorte | E04: Posse/uso separados; camadas e conflitos de armadura/mãos, requisitos e política de escudos exercitados. | Manter contextos não suportados explícitos. |
| I34-AC06 | Compilação determinística, nova versão quando o conteúdo mudar, índices exatos, relatório e validação cruzada com testes de rejeição/adulteração. | Parcial | E01, E02, E07: Compilação/índices imutáveis estão provados na receita sintética; há projeção real separada, mas não uma equivalência consolidada dos três lotes com o requisito original. | F05: demonstrar equivalência da rota real com os requisitos de compilação/índices/versionamento ou concluir a ponte faltante. |
| I34-AC07 | Fixtures públicas fictícias e aceite local dos dados reais com autoria identificada; conteúdo licenciado e derivados reais mantidos nos destinos permitidos pela política. | Comprovado no recorte | E03, E07, E08: Fixtures fictícias e revisões reais com autoria separadas; insumos/evidências extensas ficam locais. | Repetir privacidade sobre a versão final, incluindo novos arquivos. |
| I34-AC08 | Não promover registros blocked/reference-only, estados de revisão ou fictionalData por conveniência. | Comprovado no recorte | E07, E08: Fontes needs-review e fictionalData real preservados; ativação local e export mínimo não promovem registros. | Manter decisões de distribuição e promoção separadas. |

## Issue #35 - critérios originais

Fonte: [#35](https://github.com/AntonioVCruz/sotdl-character-forge/issues/35), atualização do corpo em `2026-11-02T23:16:58Z`. IDs AC seguem a ordem da seção “Critérios de aceite”.

| ID | Critério original | Estado | Evidências e avaliação | Ação restante |
| --- | --- | --- | --- | --- |
| I35-AC01 | Matriz de passos/cardinalidades/condições por procedimento e origem, com incluídos e adiados explícitos. | Comprovado no recorte | E01, E05: Matriz #53 explicita etapas, condições, cardinalidades e limites; atividade 1 distingue suporte e aceite. | Usar a matriz como referência da atividade 4. |
| I35-AC02 | Procedimentos Core e Human Development percorrem todos os passos necessários ao recorte, sem impor tabelas facultativas nem inventar alternativas publicadas. | Parcial | E05, E06: Seis bases mecânicas verificadas; percursos completos identificados para M1/M5/M6, não para M2/M3/M4. | F04: percorrer M2/M3/M4 e registrar etapas obrigatórias/opcionais antes do fechamento amplo. |
| I35-AC03 | Manual/híbrido/aleatório, locks e rerolls respeitam dados e permissões; sorteio uniforme não oficial só aparece como tal e com autorização registrada. | Parcial | E05, E08: Comandos validam modos, faces e locks; híbrido possui teste dirigido; consentimento uniforme está no contrato. | F04: comprovar ponta a ponta os modos declarados e cruzamentos necessários, sem alegar cobertura dos 36. |
| I35-AC04 | Cada evento conserva seed, PRNG, faces, fonte/versão, vínculos e consequências. Importação, impressão e recálculo não sorteiam; replay não duplica ganhos. | Comprovado no recorte | E03, E05, E06, E10: Sessão conserva seed/PRNG/faces e liga eventos ao contexto exato; fonte é rastreada pelo grafo/contexto, não duplicada em cada evento. Replay e exportação não chamam RNG nos percursos testados. | Preservar essa rastreabilidade transitiva na expansão de cobertura. |
| I35-AC05 | Mudanças de variante/procedimento/escolhas invalidam ou suspendem dependentes com motivo, preservando histórico e última escolha válida; comandos são validados novamente na confirmação. | Comprovado no recorte | E05, E06: Invalidação de dependentes inclusive travados, decisões anteriores e revalidação de comandos possuem regressões. | Manter histórico e testar novos tipos de comando. |
| I35-AC06 | Estados iniciais não são restaurados após consequências; benefícios substituídos não acumulam, e profissão/alfabetização não são inferidas de rótulos. | Comprovado no recorte | E03, E05: Herança profissional concreta, distinção fala/leitura/escrita, estados e não acumulação dos blocos são exercitados. | Manter os invariantes em novos resultados. |
| I35-AC07 | JSON/IndexedDB reabrem personagem e suas pendências, com proteção contra concorrência e migração explícita; saves demo continuam válidos. | Parcial | E05, E09, E10, E11: JSON/reabertura e suspensão funcionam; UI nova persiste em localStorage. Locks em memória não demonstram concorrência entre abas nem migração/IndexedDB do fluxo novo. | F02: atender ou acordar explicitamente o requisito de IndexedDB, migração e concorrência; preservar demo. |
| I35-AC08 | Cenários completos com fixtures fictícias e aceite local dos insumos reais conferidos, incluindo revisão de resultados e probabilidades. | Parcial | E05, E06, E07, E10: Há testes fictícios de contratos e casos reais completos; isso não constitui matriz completa de cenários fictícios/reais por combinação e modo. | F04: consolidar cobertura necessária e o aceite vertical, com tipos de evidência separados. |
| I35-AC09 | Completude do procedimento é distinta de autorização/distribuição e de habilitação oficial; não basta remover os flags falsos atuais. | Comprovado no recorte | E06, E08, E10: Finalização exige recibo e obrigações recalculadas; direitos/gates de emissão são independentes. | Manter a distinção; não remover flags para fabricar aceite. |

## Issue #36 - critérios originais

Fonte: [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36), atualização do corpo em `2026-11-04T12:00:16Z`. IDs AC seguem a ordem da seção “Critérios de aceite”.

| ID | Critério original | Estado | Evidências e avaliação | Ação restante |
| --- | --- | --- | --- | --- |
| I36-AC01 | Fluxo real consome comandos/resultados do motor, incluindo pendências estruturadas; não usa mocks/demoStats para preencher lacunas reais. | Comprovado no recorte | E03, E05, E08, E09: Entrada de produto usa contextos reais, comandos e pendências do motor; build é auditado contra demo/fixtures. | Manter a auditoria na versão final. |
| I36-AC02 | Prévia só altera a ficha ao confirmar, com nova validação de fonte, dependências, cardinalidade e elegibilidade. | Pendente | E09: As funções change() calculam e salvam imediatamente após ações. O botão Confirmar escolha confirma um comando, mas não oferece prévia transacional com descarte do estado proposto. | F01: implementar prévia/confirmação/descarte e definir revalidação de fonte corrente na confirmação; nenhuma exceção de escopo foi aprovada. |
| I36-AC03 | Fonte ausente, versão alterada, handler sem suporte e escolhas pendentes aparecem com motivo; dados e histórico são preservados. | Comprovado no recorte | E05, E06, E08, E09, E10: Fonte ausente/alterada, save suspenso e equipamento inválido geram avisos sem apagar dados; há testes de UI/navegador. | Preservar os diagnósticos no fluxo de prévia futuro. |
| I36-AC04 | Modos, locks/rerolls e passos facultativos/obrigatórios seguem o procedimento; não há decisão obrigatória escondida ou consequência silenciosamente descartada. | Parcial | E05, E09: Procedimentos exibem etapas e pendências; no gerador simples optionalTables adiciona optional/build, sem percurso de resolução completo exposto. | F08: resolver ou tratar explicitamente essa opção; F04: conferir modos e passos obrigatórios. |
| I36-AC05 | Ficha e inventário exibem características, modificadores, estados, idiomas/alfabetização, direitos/resultados e equipamento coerentes com o motor. | Parcial | E03, E04, E09, E10: Motor e exportação têm todos os números; a mini-ficha de procedimentos mostra quatro atributos e Defense, mas omite várias características, modificadores e Damage. | F03: alinhar ficha visível e direitos/resultados ao contrato do motor, preservando os limites dos textos exportáveis. |
| I36-AC06 | Salvar, recarregar a página, importar e exportar conservam eventos/valores/pendências, sem RNG implícito e sem sobrescrever outro personagem ou a ficha demo. | Parcial | E06, E09, E10, E11: Reabertura/importação/exportação preservam valores e saves inválidos nos cenários aceitos; os fluxos têm chaves distintas. Não há prova de isolamento de múltiplos personagens/abas nem cobertura das migrações exigidas. | F02: definir e verificar isolamento/concorrência/migração; F04: ampliar cenários. |
| I36-AC07 | Impressão/PDF/HTML têm paridade e limites de conteúdo documentados/testados; formato não suportado permanece explicitamente indisponível. | Comprovado no recorte | E08, E10: JSON, HTML de leitura e impressão A4/PDF usam projeção mínima, com testes de paridade, offline, conteúdo e bloqueios. | Aceite técnico local da #56; publicação e CI dessa alteração estão adiadas. |
| I36-AC08 | E2E cobrem criação, troca de fonte/procedimento, confirmação inválida, reabertura, equipamento, erro/recuperação e teclado/foco; demo e aceite S1 continuam válidos. | Parcial | E09, E10, E11: E2Es existentes cobrem criação, equipamento, reabertura, finalização e arquivos em percursos selecionados; não comprovam teclado/foco e prévia inválida do fluxo novo. | F07: testar acessibilidade/recuperação; F01: prévia; F04: troca de procedimento/fonte e cobertura. |
| I36-AC09 | A interface mantém distinção entre teste com fixture, prévia local e fatia oficialmente habilitada. Habilitação exige a issue específica de gates/aceite. | Comprovado no recorte | E06, E08, E09, E10: Produto não usa fallback fictício e distingue rascunho/finalização/local autorizado; permissões da ficha mínima permanecem separadas. | Não atribuir habilitação de todos os livros à ativação do recorte. |

## Issue #37 - critérios originais

Fonte: [#37](https://github.com/AntonioVCruz/sotdl-character-forge/issues/37), atualização do corpo em `2026-11-02T23:16:21Z`. IDs AC seguem a ordem da seção “Critérios de aceite”.

| ID | Critério original | Estado | Evidências e avaliação | Ação restante |
| --- | --- | --- | --- | --- |
| I37-AC01 | Cobertura necessária das #34/#35/#36 entregue e verificada; pendências restantes delimitadas por registro e impacto, sem passos obrigatórios ocultos. | Parcial | E01, E05, E09, E10: As entregas cobrem grande parte do recorte, mas a matriz atual identifica lacunas concretas nas #34–#36. | Resolver F01–F05/F07/F08 e registrar impactos antes de declarar fechamento global. |
| I37-AC02 | Estados de revisão sustentados por evidência/autoria, com edição, proveniência e paginação conhecidas ou limitações explicitadas; não promover blocked/reference-only para curated por conveniência. | Comprovado no recorte | E07: Revisão #55 identifica cópias, autoria, páginas conferidas e limites, sem promoção geral nem impressão editorial inventada. | Preservar os limites e os registros privados. |
| I37-AC03 | Decisão documentada de destino/permissão por conteúdo e export, conforme a política vigente; nenhuma declaração de direitos inferida de teste, merge ou remoção de watermark. | Comprovado no recorte | E07, E08, E10: Destinos #55 e contrato mínimo #56 separam uso local, Git e formatos; não concedem direitos sobre livros. | Revisar qualquer novo campo/novo formato na atividade 5. |
| I37-AC04 | Manifesto de freeze, versões/hashes, dependências exatas, índices e relatório reproduzíveis; base congelada anterior preservada ou evoluída por versão/migração explícita. | Parcial | E02, E07, E10: Freeze #55 e 16 contratos estão registrados; snapshot #55 antecede a #56 e as correções de consolidação. | F06: produzir snapshot sucessor e conferir versões, índices, dependências e bytes sem substituir o histórico. |
| I37-AC05 | Aceite vertical e probabilidades/camadas/ganhos críticos conferidos contra as fontes da fatia, com testes públicos fictícios e reprodução local dos insumos autorizados. | Parcial | E04, E05, E06, E07, E10: Probabilidades e ganhos críticos têm revisão/regressões; aceite vertical completo do recorte consolidado ainda não está demonstrado. | F04: executar matriz de percursos da atividade 4 e associar ao snapshot sucessor. |
| I37-AC06 | Habilitação é ação explícita e restrita às capacidades suportadas; fontes indisponíveis, incompletas ou alteradas geram diagnóstico, sem fallback silencioso ou bônus fictício. | Comprovado no recorte | E06, E08, E10: Políticas explícitas habilitam só o recorte local; faltas de fonte/capacidade bloqueiam, sem fallback ou bônus fictício. | Manter a habilitação restrita após correções. |
| I37-AC07 | Geração completa só é declarada para cenários efetivamente aceitos; habilitação de um recorte não certifica todos os livros/variantes. | Comprovado no recorte | E01, E06, E07: Escopo da atividade 1 e revisão #55 distinguem percursos aceitos de todas as combinações; pendências não viram sucesso. | Não extrapolar resultados de M1/M5/M6 para M2/M3/M4. |
| I37-AC08 | Saves antigos e demo preservados; política de exports respeitada; colaborador sem livros consegue executar a suíte pública e entende os requisitos de uso local. | Parcial | E06, E08, E10, E11: Há preservação de saves, regressões demo e suíte pública sem livros; a compatibilidade/migração dos fluxos novos e a documentação final ainda exigem consolidação. | F02: compatibilidade; atividade 7: documentação final e execução pública da versão consolidada. |

## Issue #56 - critérios originais

Fonte: [#56](https://github.com/AntonioVCruz/sotdl-character-forge/issues/56), atualização do corpo em `2026-11-03T16:42:27Z`. IDs AC seguem a ordem da seção “Critérios de aceite”.

| ID | Critério original | Estado | Evidências e avaliação | Ação restante |
| --- | --- | --- | --- | --- |
| I56-AC01 | Definir conteúdo e condições permitidos por formato, em conjunto com a revisão da #37. | Comprovado no recorte | E07, E08, E10: Política por formato definida a partir da revisão #55: projeção mínima e consentimento para dados pessoais; catálogos/textos licenciados excluídos. | Nenhuma correção identificada para este critério no recorte; reconferir campos após mudanças. |
| I56-AC02 | Implementar gates de contexto, capacidade e completude; impedir que rascunho seja exportado como ficha completa. | Comprovado no recorte | E06, E08, E10: Emissão busca novamente fontes locais, recalcula completude/capacidade e exige finalização válida; rascunhos não oferecem emissão completa. | Manter os testes de bloqueio ao integrar prévia/persistência. |
| I56-AC03 | Implementar formatos autorizados com paridade de valores, fontes e pendências, sem incorporar livros, evidências extensas ou catálogo indevidamente. | Comprovado no recorte | E10: Resumo comum alimenta JSON, HTML e A4/PDF; IDs/fontes/pins/pendências sem catálogo. PDFs Core/procedimentos foram renderizados e conferidos. | Acrescentar casos pertinentes de conteúdo longo no aceite consolidado; não prometer edição HTML offline. |
| I56-AC04 | Garantir importação/reabertura do JSON suportado sem RNG implícito, com versões e dependências exatas. | Comprovado no recorte | E06, E10: Replay tipado é recalculado e comparado ao envelope; pins/dependências exatos, recusa de adulteração e spy de RNG nos percursos testados. | Ampliar apenas a cobertura dos novos percursos de F04; contrato da #56 permanece local. |
| I56-AC05 | Testar bloqueios e exportações permitidas; manter formatos não aceitos indisponíveis. | Comprovado no recorte | E08, E10: Testes fictícios/reais/navegador cobrem consentimento, tamanho, estrutura, fontes/versões divergentes, rascunho, XSS escapado e save preservado; formatos amplos continuam ausentes. | Commit/publicação/CI/merge seguem adiados; não são evidência já obtida da #56. |

## Issue #34 - atividades 3–8 do roadmap original

Esta é uma segunda visão das mesmas obrigações; não representa seis funcionalidades extras nem substitui seus critérios de aceite.

| ID | Atividade original | Estado | Evidências e avaliação | Ação restante |
| --- | --- | --- | --- | --- |
| I34-A3 | **3. Projetar o lote de tabelas Core.** Dados, resultados/concessões e probabilidades conferidos, com vínculos e pendências explícitos. | Comprovado no recorte | E01, E03, E07: Lote Core e consequências selecionadas formalizados; revisão #55 e regressões específicas integram as entregas #50/#51. | Reconciliar o checklist remoto posteriormente, sem ampliar o recorte. |
| I34-A4 | **4. Projetar Only Human e Oddities.** Fluxos/consultas/encadeamentos/contextos, sujeitos, modificadores, ciclos e escolha de Interesting Things preservados. | Comprovado no recorte | E05, E07: Only Human/Oddities projetados com fluxos, sujeitos, seletores e limites explícitos; não há alegação de 240 execuções completas. | Cobertura de percursos adicionais pertence a F04; preservar bloqueios por handler. |
| I34-A5 | **5. Projetar kits, itens e equipamentos.** Ganhos/quantidades/unidades, vínculos ou restrições, perfis publicados e efeitos/requisitos, sem inferências por nome. | Comprovado no recorte | E04, E07: Kits, quantidades e perfis selecionados conferidos; ambiguidades e definições sem suporte preservadas. | Não confundir catálogo inventariado com todos os perfis implementados. |
| I34-A6 | **6. Estender compilador e validação.** Projeção local por lote, versões/índices/relatórios, determinismo, proveniência, integridade e rejeição de adulteração. | Parcial | E01, E02, E07: Infraestrutura de compilação/índices comprovada na fixture e projeções reais disponíveis por rota própria. | F05: demonstrar atendimento do requisito para todos os lotes selecionados. |
| I34-A7 | **7. Integrar resolvedores e handlers.** Resolução contextual e aplicação única de consequências; equipamento em camadas, estados/saves preservados e RNG apenas explícito. | Parcial | E03, E04, E05, E06: Handlers reais e integrações existem; faltam reconciliação por consequência dos três lotes/rota consumível e aceite amplo dos percursos. | F05: cobertura por consequência; F04: percursos. Não reimplementar o runtime antes de auditar a equivalência. |
| I34-A8 | **8. Auditar o conjunto e entregar aos consumidores.** Reconciliar cobertura e critérios, conferir catálogo/handlers e registrar aceite técnico/limites para #35/#36/#37. | Parcial | E01, E07: Matriz #55 e escopo já fornecem insumos; este cruzamento revela obrigações ainda abertas. | Atividades 3–7 devem consolidar aceite, interfaces consumidoras e limitações, antes de fechar a atividade 8 da #34. |

## Lacunas para as próximas atividades

| ID | Obrigação encontrada | Próximo tratamento |
| --- | --- | --- |
| F01 | Prévia com confirmação/descarte ausente no fluxo real; ações atuais salvam imediatamente e validam o contexto recebido, sem conferir novamente o endpoint em cada confirmação | Atividade 3: implementar e testar; decisão de UX se necessária. O gate de fonte novamente consultada na exportação #56 é distinto. |
| F02 | Fluxos novos usam localStorage e locks em memória; IndexedDB, migração, múltiplos personagens e concorrência entre abas não têm atendimento consolidado | Atividade 3: definir e implementar o que o contrato original exige, ou apresentar alteração de escopo ao usuário. |
| F03 | Mini-ficha de procedimentos não exibe todas as características/modificadores/estados já calculados pelo motor | Atividade 3: completar a apresentação e conferir sua coerência, sem incorporar textos licenciados aos exports. |
| F04 | M2/M3/M4 sem percurso completo dirigido; modos/Oddities não têm todos os cruzamentos validados; fixtures não provam todos os cenários reais | Atividades 3/4: definir cobertura necessária, completar testes e executar aceite. Nenhuma combinação foi excluída do produto nesta análise. |
| F05 | Receita consumível imutável é sintética; equivalência e cobertura dos lotes reais pela rota vigente não estão consolidadas contra os requisitos originais de compilação/índices/handlers | Atividade 3: auditar as duas rotas e demonstrar o atendimento antes de decidir por nova implementação. |
| F06 | Freeze #55 não inclui a #56 nem futuras correções | Atividade 6: criar snapshot sucessor versionado, preservando #55 e os 16 contratos. |
| F07 | Cobertura de teclado/foco, confirmação inválida e recuperação do fluxo real não equivale ao aceite histórico S1/demo | Atividades 3/4/7: corrigir/testar e registrar autoria do novo aceite UX. |
| F08 | Opção narrativa do gerador simples mantém optional/build sem resolução completa exposta | Atividade 3: resolver essa obrigação ou acordar tratamento explícito; não apresentar como sucesso nem ocultar o requisito. |

Lacunas não são adiamentos aprovados. Não é necessário escolher uma solução de produto durante este cruzamento documental; dúvidas e decisões serão apresentadas ao usuário antes de modificar o escopo. Nenhum critério foi marcado “fora do recorte” para facilitar o fechamento.

## Resultado da atividade

As obrigações originais foram preservadas e ligadas a código/contratos, testes e revisões identificáveis. A #56 está tecnicamente comprovada no recorte local descrito, com publicação adiada. As #34–#37 ainda contêm obrigações parciais ou pendentes; não se recomenda seu fechamento administrativo com base apenas nos merges ou nos testes existentes. As atividades 3–8 do plano continuam sem execução por este documento.
