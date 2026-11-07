# Escopo do fechamento Human L0 - atividade 1

Inventário em 2026-11-06, por Codex. Projeto: SotDL Character Forge, workspace `sotdl-sdd-starter`. Esta declaração fixa o recorte para a consolidação; não encerra issues, não certifica todas as combinações nem amplia as permissões vigentes.

## Base e situação local

Checkout: `output/html/issue56-work`, branch `codex/issue56-exports`. HEAD: `2c5ef8924e643622132d1c2f6d07ce92009f2dff`, merge do PR #62 (#55). A referência local `origin/main` aponta para esse mesmo commit no inventário; não foi feita nova consulta remota nesta atividade.

| Camada | Situação nesta base | Evidência |
| --- | --- | --- |
| Dados/compilação e base mecânica | Contratos e lotes anteriores integrados, com curadoria real mantida local | `docs/roadmap-issue34.md`, `docs/entrega-compilacao-handlers-consumiveis-human-l0.md` |
| Background, Interesting Things Core e equipamento | #50–#52 integradas pelos PRs #57–#59 | `docs/entrega-background-issue50.md`, `docs/entrega-interesting-things-issue51.md`, `docs/entrega-equipamento-issue52.md` |
| Procedimentos | #53 integrada pelo PR #60 | `docs/entrega-procedimentos-issue53.md`, `docs/matriz-procedimentos-issue53.md` |
| Finalização explícita | #54 integrada pelo PR #61 | `docs/entrega-finalizacao-issue54.md` |
| Revisão e freeze | #55 integrada pelo PR #62 | `docs/entrega-revisao-freeze-issue55.md`, `curation/human-l0-review-freeze.json` |
| Arquivos da ficha | #56 implementada e validada localmente; sem commit/publicação | `docs/entrega-exportacao-issue56.md`, `docs/plano-exportacao-issue56.md` |
| Consolidação de fechamento | Plano local; esta atividade é a primeira executada | `docs/plano-fechamento-human-l0.md` |

A comparação Git mostra sete arquivos rastreados alterados pela #56: README, `CharacterCompletionPanel.tsx`, `CreationProcedures.tsx`, `OfficialCoreGenerator.tsx`, `docs/ativacao-oficial-local-core.md`, `playwright.config.ts` e `tools/official-local-plugin.ts`. Seus arquivos novos são `CharacterExportPanel.tsx`, `character-export-html.ts`, `packages/character-generator/character-export.ts`, três arquivos de testes e os dois documentos da #56. O plano de consolidação também é novo; este documento é acrescentado pela atividade 1. Os 16 contratos antigos não têm alteração de conteúdo e o índice estava sem alterações preparadas no início desta atividade.

## Definição do recorte

Personagem humano de nível 0, com fontes licenciadas verificadas e execução local em loopback. Há duas entradas independentes: **Core** (gerador simples) e **Procedimentos Core / Only Human** (grafo de criação). Seus saves permanecem separados. O fechamento pretendido cobre criação, consequências suportadas, inventário/equipamento, finalização, persistência e arquivos mínimos do personagem.

Fontes do recorte: `sotdl:shadow-of-the-demon-lord-core`, `sotdl:only-human` e `sotdl:oddities-artifacts-and-esoterica`, nos lotes e resultados explicitamente revisados. Não inclui automaticamente outros livros citados pelos resultados. Fontes continuam `needs-review`; autorização de uso local não é promoção de fonte nem autorização para distribuir livros.

## Matriz de combinações mecânicas

Esta tabela descreve a entrada de **procedimentos**. “Base verificada” significa cálculo inicial e separação dos blocos mecânicos no teste das seis combinações. “Percurso conferido” significa um cenário completo identificado, não todos os resultados possíveis dessa linha.

| ID | Ancestralidade | Atributos | Procedimento | Base mecânica | Finalização e JSON mínimo |
| --- | --- | --- | --- | --- | --- |
| M1 | Core | Fixos | Core | Verificada | Percurso conferido em #54/#56 |
| M2 | Core | Fixos | Human Development | Verificada | Falta evidência dirigida de percurso completo para consolidar esta linha |
| M3 | Only Human | Fixos | Core | Verificada | Falta evidência dirigida de percurso completo para consolidar esta linha |
| M4 | Only Human | Aleatórios | Core | Verificada | Falta evidência dirigida de percurso completo para consolidar esta linha |
| M5 | Only Human | Fixos | Human Development | Verificada | Percurso conferido em #54/#56 |
| M6 | Only Human | Aleatórios | Human Development | Verificada | Percurso conferido em #54/#56 |

Evidências: `tests/procedure-source.test.ts` (seis bases), `tests/finalization-source.test.ts` e `tests/character-export-source.test.ts` (percursos completos). Não foram executados novos testes nesta atividade documental; estas são evidências existentes, incluindo a execução registrada na entrega #56. A matriz completa de critérios e o novo aceite vertical pertencem às atividades 2 e 4.

O gerador simples constitui outro percurso de M1, com contrato e save próprios. Finalização, replay e exportação desse percurso estão exercitados em `tests/finalization-source.test.ts`, `tests/character-export-source.test.ts`, `tests/e2e/character-finalization.spec.ts` e `tests/e2e/character-export.spec.ts`.

Core com atributos aleatórios não é uma sétima combinação: o schema rejeita essa configuração. No procedimento Core, o benefício adicional de humano é exclusivo de ancestralidade Core + procedimento Core; ele não acumula nas demais combinações. Only Human permite atributos fixos ou quatro d3 registrados. Transferência de um ponto exige atributos distintos. Size admite ½ ou 1 como escolha inicial; não há aceite de todos os cruzamentos com tamanho, idade e equipamento.

## Outros eixos e alcance da validação

| Eixo | Gerador simples Core | Entrada de procedimentos | Limite da declaração |
| --- | --- | --- | --- |
| Interesting Things | Alternativa Core explicitamente escolhida | Core ou Oddities; Oddities é o padrão da configuração | Seletores/fontes distintos estão testados; não há prova de todos os percursos com Oddities até exportação |
| Modo manual | Escolhas locais e troca manual de resultados onde oferecidas; sem seletor global de modo | Disponível; tabelas obrigatórias exigem rolagem ou registro de faces conforme o contrato | Percursos completos usam resolução por comandos; isso não comprova os três modos de ponta a ponta |
| Modo híbrido | Não é exposto como modo global | Rola dados publicados e para em escolhas concretas | Teste dirigido de avanço e parada em `tests/procedure-source.test.ts` |
| Modo aleatório | Geração inicial por seed, com escolhas posteriores explícitas | Avanço automático; escolhas uniformes do aplicativo exigem autorização separada | Autorização não transforma sorteio uniforme em distribuição publicada nem resolve adjudicações |
| Tabelas Core opcionais | Flag de tabelas narrativas; há pendência explícita `optional/build` sem resolução completa nesse fluxo | Seleção individual, incluindo traços positivos/negativos | Não prometer finalização de todas as opções do gerador simples; passos escolhidos incompletos bloqueiam |
| Background | Opcional, com seleção/remoção e consequências próprias | Opcional no procedimento Core; substituído por Human Development | Não acumular os dois procedimentos |
| Equipamento | Uso/guarda e contexto com diagnóstico | Uso por unidade e contexto com diagnóstico | Só os perfis/handlers conferidos; posse não implica equipamento ativo |
| Familiares e ciclos | Fora do fluxo simples | Detalhamento dirigido e opcional de familiares; ciclos limitados | Política: 300 etapas, 16 iterações de ciclo, profundidade 3; atingir limite gera pendência |

Os seis casos mecânicos, duas fontes de Interesting Things e três modos formam 36 cruzamentos potenciais, antes de tamanhos, opcionais e resultados. O código oferecer esses eixos não certifica os 36 percursos completos. Esta atividade fixa o universo para a avaliação posterior e torna suas lacunas visíveis; não elimina combinações do produto para facilitar o fechamento.

## Estados e consequências

| Classe | Tratamento e efeito no fechamento |
| --- | --- |
| Criação concluída | Todas as obrigações ativas e quantidades resolvidas, mecânica válida, contexto exato e ação explícita de finalização revalidada. Só então pode emitir a projeção mínima da #56. |
| Etapa facultativa omitida | Registrada como omissão, sem inventar resultado; não impede finalizar. Uma etapa facultativa escolhida passa a exigir resolução de suas consequências ativas. |
| Efeito reservado ao uso | Mantém origem e pendência de uso; não bloqueia a criação por si só. O motor não o aplica automaticamente nem o considera resolvido em jogo. |
| Adjudicação necessária à criação | Exige decisão concreta, autoria/contexto e vínculo quando aplicável. Pendência não resolvida bloqueia; texto genérico não inventa perfil mecânico. |
| Fonte ou contexto inválido | Suspende o uso do save e bloqueia finalização/emissão/importação aplicável; preserva dados e histórico, sem migração ou novos sorteios silenciosos. |
| Handler ausente, dependência incompleta ou limite atingido | Diagnóstico e bloqueio/pendência de criação quando o resultado exige essa aplicação; não tratar como personagem completo por conveniência. |

Exemplos de limite: conjuntos mistos, perfis contextuais, transformação de ancestralidade, tradições sem definição e efeitos de suplementos sem handler. A revisão #55 registra cinco ambiguidades de itens e 57 definições não resolvidas; essas contagens são do snapshot revisado, não uma promessa de que cada registro bloqueie todos os personagens. Os 120 resultados Core foram exercitados individualmente; o mapeamento de 240 resultados Oddities não equivale a 240 execuções completas independentes.

## Versões, saves e formatos

| Contrato/artefato | Recorte atual |
| --- | --- |
| Contratos originais de curadoria | 1.0.0; 16 arquivos congelados, sem substituição do baseline |
| Packs mecânicos Core/Only Human | 0.2.0; dependência exata de Only Human para Core; dados completos locais |
| Core local consumível | 1.1.0 conforme snapshot #55 |
| Procedimentos | `sotdl.human-creation@1.0.0`; sessão schema 1 |
| Save simples | `sotdl-official-core-draft`, schema 1; storage `sotdl-official-core-draft@1` |
| Save de procedimentos | `sotdl-human-creation-session`, schema 1; storage `sotdl-human-creation-session@1` |
| Finalização | `sotdl.character-finalization@1.0.0`; recibo não substitui o recálculo das obrigações |
| Exportação local #56 | `sotdl.character-export@1.0.0`, política `minimal-character-only@1`; limite JSON de 2 MB UTF-8 |

JSON preserva o replay tipado, valores e metadados exatos; reabrir exige o mesmo contexto e não chama RNG. HTML é somente de leitura offline. Impressão/PDF usa a mesma projeção e paginação A4. Nome e decisões pessoais são incluídos mediante confirmação; itens/profissões/idiomas são referenciados por ID, sem nomes e descrições de catálogo. Livros, transcrições, evidências extensas, catálogo/contexto completo e dados de compra não entram nesses arquivos.

A #56 permanece somente local. Os flags globais de exportação dos packs/contextos continuam falsos; a projeção mínima possui gate próprio e não libera dumps. O manifesto #55 é histórico: modificações posteriores serão avaliadas no snapshot sucessor previsto na atividade 6, sem regravá-lo nesta atividade.

## Fora deste fechamento

- Nível 1, novice paths e progressão L0→1 (#21), demais ancestralidades, níveis 2–10, Expert/Master e implementação ampla de magia.
- Automação integral de combate, efeitos de uso, munição/recarga/misfire, carga, compras e passagem de tempo; aquisição de conteúdo externo citado em resultados.
- Garantia de que todo resultado/suplemento disponível produza criação finalizável ou que o HTML seja um motor editável de sessão.
- Promoção generalizada para `curated`, distribuição pública de corpus/packs licenciados, deploy e tratamento residual do histórico/backups da #16.
- Commit/publicação/merge da #56 e fechamento administrativo das issues, adiados pelo usuário.

## Conclusão da atividade 1

Escopo e universo de combinações fixados a partir dos contratos, código, políticas e testes existentes. M2/M3/M4, cruzamentos com Oddities/modos e opcionais do fluxo simples conservam necessidades de evidência ou revisão; são insumos das próximas atividades, não decisões de adiamento já aceitas. Nenhuma nova capacidade foi habilitada e nenhum critério das #34–#37 foi marcado como concluído por este documento.
