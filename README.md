# SotDL Character Forge — Kit SDD revisado v0.2 · Aleatoriedade

**Estado:** catálogo e criador demonstrativo de níveis 0–1 implementados, com dois caminhos, duas tradições e quatro magias fictícias, modos manual/híbrido/aleatório, equipamento ativável, conjuração e efeitos de sessão, ficha, histórico, JSON, impressão A4/PDF e HTML editável offline. Níveis 2–10 e conteúdo oficial ainda não implementados.
**Idioma das especificações:** português. **Identificadores mecânicos oficiais:** inglês.

**Estado operacional em 2026-10-30:** [política consolidada](docs/politica-distribuicao-conteudo.md) e [issues conferidas](docs/estado-issues.md). Higiene da ponta e política entregues; stubs Human e wizard L0 demonstrativo integrados. Compilador/índices, consumo oficial e aceite final de UX continuam pendentes; histórico antigo na #16. As seções de entregas abaixo conservam suas datas.

Os quatro compêndios MD de regras estão em `rules/`. A lista de tarefas para analisá-los, gerar packs JSON por publicação e integrar regras reais ao criador está em [tarefas-curadoria-compendios.md](docs/tarefas-curadoria-compendios.md).

## Executar o catálogo e o criador demonstrativo

Requer Node.js 22.15+ (ou versão compatível com as dependências) e npm.

```sh
npm ci
npm run dev
```

Abra a URL indicada pelo Vite. Clique em **Carregar exemplos fictícios** e habilite as fontes desejadas. Também é possível importar packs JSON de até 5 MB. Importar não habilita automaticamente; alterações são salvas em IndexedDB antes de aparecerem como concluídas.

Para criar um personagem demonstrativo:
1. Clique em **Preparar fontes da demonstração**.
2. Escolha o modo **Tudo aleatório**, informe uma seed e autorize o sorteio uniforme entre opções válidas (não oficial).
3. Clique em **Gerar personagem inteiro — prévia**, revise decisões, dados e fontes e confirme. Cancelar preserva a ficha anterior.
4. Use os controles de cada etapa para escolher manualmente, travar/destravar ou rerrolar. Mudanças de ancestralidade deixam o background incompatível em revisão, preservando o histórico.
5. Exporte o personagem em JSON para backup. Importar e reabrir não refazem sorteios. Nome e notas são opcionais e têm salvamento explícito.

O modo manual e o híbrido usam os mesmos candidatos e consequências. Quantidades de escolhas manuais são informadas explicitamente. Os quatro slots desta fatia são ancestralidade, background, equipamento e objeto curioso. Atributos são derivados dos valores fictícios da ancestralidade.

A ficha mostra só os sete números do cálculo demonstrativo, com os termos oficiais em inglês: Strength, Agility, Intellect, Will, Health, Defense e Speed. O que a base Human de CUR-015 ainda não calcula nesta tela — Perception, Healing Rate, Size, Power, Damage, Insanity, Corruption e attribute modifiers — aparece como **indisponível**, sem valor inventado e sem tratar o demo como pack curado. Se o criador falhar ao desenhar, essa área mostra um aviso em português. **Tentar de novo** redesenha sem apagar o personagem. **Recomeçar** descarta o personagem salvo neste navegador e abre um novo. A biblioteca de fontes abaixo continua na página. O aviso não inclui a pilha do erro.

O criador abre com o wizard de nível 0 (frames 1b/1e): ChoiceSlot, stepper só L0 e mini-ficha. O adapter é fictício (`fictionalData: true`) e não habilita ruleset oficial. O contrato está em [choice-slot-l0.md](docs/choice-slot-l0.md). A grade antiga do motor demonstrativo continua abaixo, separada desse wizard.

Para evoluir para o nível 1, clique novamente em **Preparar fontes da demonstração** se estiver usando a entrega anterior. Selecione **Nível-alvo 1** e use **Alterar nível — prévia** para preencher caminho/treinamento manualmente, ou **Gerar personagem inteiro — prévia** para sortear os novos slots. As decisões já existentes são preservadas na mudança de nível.

O **Guardião da Trilha** é o caminho marcial fictício; o **Aprendiz da Centelha**, o mágico fictício. Cada um oferece dois treinamentos exclusivos. Destrave uma etapa para revisá-la; quando houver uma escolha anterior elegível, **Restaurar escolha anterior** cria uma nova decisão auditável. Trocar o caminho deixa o treinamento incompatível pendente, mesmo travado. Selecionar nível 0 e confirmar a mudança suspende os ganhos de nível 1 sem apagar história. Retornar a 1 revalida as decisões preservadas.

Arquivos antigos de personagem (`schemaVersion: 1`) são migrados para v2 ao abrir/importar, sem refazer rolagens. A versão nova registra também o histórico de níveis.

O **Aprendiz da Centelha** requer agora uma tradição e uma magia de rank 0 após o treinamento. Clique novamente em **Preparar fontes da demonstração** para adicionar o pack `demo-magic@0.0.1`. Escolha **Brasa Serena** (Lanterna de Brasa ou Fio de Calor) ou **Eco de Vidro** (Sino Distante ou Reflexo Breve); todos os nomes, textos e regras são fictícios. Cada etapa oferece seleção manual, sorteio autorizado, trava e rerrolagem.

Trocar a tradição preserva a magia anterior no histórico com pendência até revisão. O grimório da ficha mostra descrição, rank, tradição e fonte; aprender não ativa efeitos nem consome recursos de conjuração. Mudar para o Guardião ou voltar ao nível 0 suspende o aprendizado mágico sem apagar decisões. Personagens mágicos de arquivos v2 anteriores continuam abrindo e mostram as novas escolhas pendentes.

Para testar a sessão, clique novamente em **Preparar fontes da demonstração** e use um Aprendiz da Centelha com aprendizado válido. No painel **Conjuração e efeitos de sessão**:

1. **Registrar conjuração** consome um dos dois usos demonstrativos por descanso e cria um efeito inativo.
2. **Ativar efeito** aplica o bônus fictício, com origem no detalhamento dos cálculos; **Encerrar efeito** restaura o valor anterior sem devolver o uso.
3. **Descansar e restaurar usos** encerra todas as instâncias e restaura os usos, preservando o histórico.

Os efeitos duram até encerramento explícito ou descanso, sem timer. Fonte ausente ou aprendizado substituído suspende o bônus sem apagar a conjuração. Arquivos v2 anteriores recebem sessão vazia; exportar/importar/reabrir preserva consumo e efeitos ativos.

O painel **Inventário e equipamento** apresenta uma unidade do item escolhido, sua fonte, modificador e estado **Equipado**, **Guardado** ou **Suspenso**. **Desequipar item** guarda o item sem alterar a escolha de criação; **Equipar item** reaplica seu bônus válido. Nesta demonstração, o bônus do equipamento e o de uma magia ativa são somados uma vez. Guardar o item não encerra magias e descansar não muda o equipamento.

Arquivos anteriores mantêm o item equipado por padrão, preservando os números antigos. Uma nova escolha de equipamento começa equipada e tem estado próprio, ligado ao seu evento. Compra, loot e alteração de quantidades ainda não fazem parte desta fatia.

Para imprimir, salve nome/notas e confirme as escolhas. Use **Visualizar ficha A4** para consultar a cópia de leitura ou **Imprimir / Salvar como PDF** para abrir o diálogo do navegador. Selecione A4, escala 100% e desative os cabeçalhos/rodapés automáticos do navegador; a ficha possui sua própria paginação. Somente o estado confirmado entra na impressão, incluindo efeitos ativos/suspensos, usos, pendências, fontes e explicação dos valores. Nenhum sorteio é refeito.

A prévia na tela é contínua; as quebras de página finais aparecem no diálogo de impressão. Escape fecha a prévia e devolve o foco ao botão. Ctrl+P também imprime apenas a ficha confirmada, sem catálogo ou controles.

Para usar a ficha sem o aplicativo:

1. Confirme escolhas e salve nome/notas; clique em **Exportar HTML offline**.
2. Abra o arquivo baixado no navegador, inclusive sem internet ou servidor. Esta primeira exportação incorpora somente packs fictícios ativos ou referenciados.
3. Edite nome/notas e clique em **Aplicar nome e notas**. Use os controles de sessão para conjurar, ativar/encerrar efeitos ou descansar.
4. Clique em **Salvar nova cópia HTML** para continuar depois com esse estado, ou **Salvar personagem JSON** para reimportar no aplicativo usando **Importar personagem JSON**.

O arquivo original não é alterado automaticamente; guarde a nova cópia baixada. O HTML não depende de localStorage/IndexedDB e inclui histórico de aprendizado/rolagens, fontes versionadas, controles de equipar/guardar e impressão A4. Criação, progressão, novos packs e troca do item escolhido continuam no aplicativo principal. Reexporte HTMLs antigos para receber os controles do runtime `demo-offline-v2`.

```sh
npm test
npm run build
npx playwright install chromium
python -m pip install pypdf
npm run test:e2e
npm run audit:demo
```

Esta entrega inclui validação de packs/tabelas, proveniência, fontes habilitadas, filtros e persistência local. Não exige backend. O servidor local ainda é necessário para abrir/recarregar a aplicação; instalação PWA e cache do aplicativo não fazem parte desta fatia. Preserve os JSON originais como backup dos packs.

Os testes de PDF requerem Python com `pypdf`; a aplicação usa apenas o navegador. Exemplos gerados pelos E2E ficam em `output/pdf/` (não versionados).

O runtime offline é gerado automaticamente antes de `npm run dev` e `npm run build`. Se alterar o motor/componentes durante o desenvolvimento, reinicie o servidor ou execute `npm run build:standalone` para atualizar a exportação. Os HTMLs demonstrativos dos testes ficam em `output/html/` (não versionados).

## Gate de CI (testes e build)

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em todo pull request e em todo push para `main`. Usa Node.js 22 (LTS; este repositório pede 22.15+ e `@types/node` 22) e o `package-lock.json` via `npm ci`. Não há segredos. O job falha se os testes ou o build falharem.

O mesmo gate localmente:

```sh
npm ci
npm test
npm run build
```

`npm test` executa `vitest run`. `npm run build` executa `tsc --noEmit && vite build`; o script `prebuild` gera o runtime offline antes do Vite.

Os quatro compêndios em `rules/` estão no `.gitignore` e não entram no checkout do GitHub. Sem esses arquivos, o Vitest omite os testes que os abrem (`tests/curation-ancestries.test.ts`, `curation-paths`, `curation-spells`, `curation-mechanics`, `curation-reconciliation` e os demais listados em `vite.config.ts`). Com os quatro presentes, o mesmo `npm test` inclui essa suíte. Um corpus parcial (só alguns dos quatro arquivos) falha o teste `tests/rules-corpus.test.ts`.

Depois que o workflow estiver na `main`, marque o check **CI / test and build** como obrigatório nas regras de proteção da branch `main` (Settings → Rules → Rulesets, ou Branch protection rules). O workflow não altera essa configuração.

`npm run test:e2e` (Playwright) fica fora deste gate. A suíte precisa do Chromium (`npx playwright install chromium`), de Python com `pypdf` (`tools/verify-print-pdf.py`) e exercita PDF, downloads e HTML via `file://`. Esses extras não entram na CI mínima; o acompanhamento é incluí-los quando a suíte for estável no `ubuntu-latest`. Até lá, rode o E2E localmente com os comandos da seção anterior. O mesmo vale para a suíte de curadoria que depende de `rules/`: permanece local até haver uma forma de fornecer os compêndios ao runner sem versioná-los.

Planos e decisões: `specs/001-catalogo-e-proveniencia/implementation.md`, `docs/plano-nivel-zero.md`, `docs/plano-nivel-um.md`, `docs/plano-magias-demo.md`, `docs/plano-sessao-demo.md`, `docs/plano-impressao-a4.md`, `docs/plano-html-autonomo.md` e `docs/plano-equipamento-demo.md`. Evidências e limites: `docs/entrega-catalogo.md`, `docs/entrega-nivel-zero.md`, `docs/entrega-nivel-um.md`, `docs/entrega-magias-demo.md`, `docs/entrega-sessao-demo.md`, `docs/entrega-impressao-a4.md`, `docs/entrega-html-autonomo.md` e `docs/entrega-equipamento-demo.md`.

## Objetivo
Criar e evoluir personagens de *Shadow of the Demon Lord*; aplicar regras, fontes e house rules selecionadas; exibir ficha dinâmica; salvar em JSON e exportar HTML/PDF. O HTML enviado de Liliana é referência visual e um fixture comportamental, não arquitetura a reutilizar.

## Uso com SDD
1. Ler `constitution.md` e `docs/visao-produto.md`.
2. Revisar as decisões em `docs/decisoes-pendentes.md` (defaults já propostos para não bloquear o MVP).
3. Para cada funcionalidade, ler `specs/NNN-*/spec.md`, obter validação da especificação e só depois usar `plan.md` / `tasks.md`.
4. Executar testes unitários e testes de ponta a ponta para cada critério de aceitação antes de marcar tarefas concluídas.
5. Atualizar o registro de fontes/variantes e a matriz de rastreabilidade quando o catálogo mudar.

### Com GitHub Spec Kit (opcional)
Inicie o Spec Kit conforme a documentação oficial: https://github.com/github/spec-kit e https://github.github.com/spec-kit/quickstart.html. Os arquivos deste kit são **insumos** para o fluxo, não arquivos produzidos pelo Spec Kit.

Etapas por feature: `constitution` (uma vez) → `specify` → `clarify` → `plan` → `checklist` → `tasks` → `analyze` → `implement` → `converge`.
A sintaxe exata (`/speckit.*` ou skills) depende do agente configurado.

## Prioridade sugerida
1. `001-catalogo-e-proveniencia` — catálogo de entidades **e tabelas**
2. `008-tabelas-aleatorias` — motor puro de dados, rolagens e resolução encadeada
3. `002-criacao-e-progressao` — slots sequenciais e dependências
4. `009-geracao-aleatoria` — seleção aleatória em qualquer slot e geração completa
5. `003-motor-de-regras` — cálculo determinístico a partir de eventos resolvidos
6. `004-magias-e-escolhas` — ordem de aprendizado e opções elegíveis
7. `005-ficha-e-efeitos` — interface e atalhos de aleatoriedade
8. `006-persistencia-e-exportacao` — salvar decisões, seed e histórico de rolagens
9. `007-html-editavel-autonomo` — ficha interativa offline como a referência

**Modo manual, híbrido e aleatório completo são obrigatórios no MVP** (dentro de um subconjunto curado de conteúdos). A cada slot/etapa deve existir opção de escolha manual, sorteio ou novo sorteio. A geração completa percorre todos os slots necessários até o nível escolhido; não inventa dados para resolver pendências.

Leia `docs/fluxo-aleatoriedade.md`, `docs/tabelas-aleatorias-e-curadoria.md`, `specs/008-tabelas-aleatorias/` e `specs/009-geracao-aleatoria/` antes de começar a implementação.

Use **fatias verticais**: um personagem criado do zero deve atravessar interface → dados → cálculos → ficha → salvar desde cedo. Não carregue 95 fontes de conteúdo antes de fazer funcionar um fluxo com um subconjunto validado.

## Materiais locais do projeto

- O que pode entrar no git, nos packs e nos exports (JSON/HTML/PDF): [política de distribuição de conteúdo](docs/politica-distribuicao-conteudo.md) (S0, [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2)).

A **Etapa A da curadoria (CUR-001 a CUR-007)** está concluída: [tarefas e estados](docs/tarefas-curadoria-compendios.md), [relatório dos gates](curation/reports/stage-a.md) e [contratos 1.0.0](docs/contratos-curadoria.md). `npm run curation:check` verifica hashes, registro das 95 fontes e exemplos de formato. Todas as 2.397 referências de fonte estão resolvidas após confirmação dos aliases pelo usuário; não há conteúdo mecânico real certificado nesta etapa. As três últimas decisões estão em `curation/reports/remaining-source-aliases.json`.

**CUR-008 concluída:** [59 ocorrências de ancestries extraídas para staging](docs/entrega-ancestries-staging.md), todas capturadas com fonte resolvida e texto/evidências preservados. Bugbear, Fomor, Incarnation e Warg foram vinculadas a The Hunger in the Void por confirmação explícita do usuário. `npm run curation:ancestries` reproduz os derivados.

**CUR-009 concluída:** [392 ocorrências de paths capturadas em staging](docs/entrega-paths-staging.md), com categorias, publicações e seções de eventos/talentos/níveis preservadas. O alias confirmado resolveu Priest of the Demon Lord; as correções fornecidas pelo usuário resolveram os bloqueios de Seer/Troll Hunter, com histórico preservado. `npm run curation:paths` reproduz os derivados.

**CUR-010 concluída:** [1.520 ocorrências de spells extraídas](docs/entrega-spells-staging.md), preservando 44 tradições e 13 origens de paths: todas capturadas, sem bloqueios após confirmar Do We Not Die? e aplicar os dois textos corrigidos pelo usuário. `npm run curation:spells` reproduz os derivados.

**CUR-011 concluída como segmentador preliminar:** [117 blocos de regras/equipamentos/criaturas segmentados](docs/entrega-mecanicas-staging.md) em 3.589 partes: 1.961 capturadas, 230 bloqueadas, 1.320 em quarentena e 78 de layout. Tabelas e trechos ambíguos conservam texto/evidência no sidecar, sem classificação mecânica inventada. `npm run curation:mechanics` reproduz os derivados.

**CUR-012 concluída:** [normalização editorial reversível](docs/entrega-normalizacao-editorial.md) em cópias dos quatro MDs: 2.275 ligaturas expandidas, 53 watermarks removidos e 656 overlays ligados às evidências. Originais, staging bruto e dados numéricos mecânicos preservados; 28.971 diagnósticos ambíguos continuam para revisão. `npm run curation:normalize` reproduz os derivados.

**Política de ancestries:** incorporar expansões mecânicas aplicáveis, preferir suas tabelas e manter o Core selecionável. O jogador escolhe atributos fixos ou aleatórios quando publicados; detalhes em [expansões de ancestries](docs/politica-expansoes-ancestries.md).

**CUR-014 concluída como análise:** [matriz de criação Human/Core nível 0](docs/entrega-piloto-core-nivel-zero.md), com 28 passos, 77 faixas de evidência e cardinalidades, decisões de GM, dependências e lacunas explícitas. Introdução geral e quadro de idiomas fornecidos pelo usuário resolvem o ajuste opcional de atributos e as alternativas narrativas; limites de Wealth confirmados e Roleplaying Questions opcionais; seletor e subtabelas de profissões recuperados; numeração de Interesting Things também recuperada, com formalização mecânica ainda pendente antes de habilitar geração oficial. `npm run curation:pilot` reproduz `curation/pilot/core-level-zero.json`; o gate faz parte de `npm run curation:check`. Próxima tarefa: CUR-015.

**CUR-015 concluída como formalização:** [base Human/Core + Only Human](docs/entrega-human-ancestry.md), com modos fixo/aleatório, transferência opcional única, 15 fórmulas/regras, 11 faixas de evidência e heranças explícitas. Avaliador de referência puro; motor real e geração continuam em etapas posteriores. `npm run curation:human` reproduz os dois artefatos e seu gate integra `curation:check`. Próxima tarefa: CUR-020.

**CUR-016 concluída como inventário:** [61 tabelas de criação](docs/entrega-inventario-tabelas-criacao.md), 22 Core e 39 Only Human, com dados/lookups, modos manuais, encadeamentos e sete achados de revisão. `npm run curation:creation-tables` reproduz inventário e relatório; seu gate integra `curation:check`. Tabelas não foram habilitadas para geração. Próxima tarefa: CUR-020.

**CUR-017 concluída como formalização:** [profissões e idiomas](docs/entrega-profissoes-idiomas.md), com 168 opções de tabelas, Occult direto, especializações, alfabetização e concessões condicionais por publicação. `npm run curation:professions-languages` reproduz os derivados; o gate integra `curation:check`. Motor/UI continuam em etapas posteriores. Próxima tarefa: CUR-020.

**CUR-013 concluída:** [reconciliação do corpus](docs/entrega-reconciliacao-corpus.md) em 2026-10-27: 151.625 linhas / 5.560 registros / 95 publicações, sem lacunas ou sobreposições de contabilização. A divergência de 27/28 fontes de spells, a ausência de Path of the Adept nas listas de ancestries e as pendências anteriores permanecem explícitas. `npm run curation:reconcile` reproduz a auditoria; `npm run curation:check` confere toda a cadeia. Nenhum pack real foi habilitado no criador. Próxima tarefa: CUR-014, matriz de regras do piloto nível 0/Core.

- `rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md`
- `rules/SotDL_All_Paths_Compendium_Expanded_All_Project_Sources.md`
- `rules/SotDL_Spells_All_Sources_Expanded_All_Project_Sources_v2.md`
- `rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md`
- `Liliana_Condessa_Bruxa_Ficha_Editavel_Novo_Retrato.html`

**Atenção:** os quatro compêndios são insumos de curadoria. Não são automaticamente um banco de regras estruturado ou validado. Seus textos e os PDFs podem ter restrições autorais; não distribuir conteúdo integral de terceiros sem licença/permissão apropriada.

## Termos
- **Content Pack**: conjunto versionado de registros extraídos de uma fonte.
- **Ruleset**: seleção de packs, variantes, erratas e regras opcionais.
- **Character Event**: decisão de criação/progressão registrada com ordem e proveniência.
- **Effect Instance**: efeito ativo de talento, condição, item, magia ou transformação, com duração/escopo.
- **Derived Stat**: valor calculado com explicação da origem de cada parcela.

## Modos de geração e garantias v0.2
- **Manual:** todas as decisões tomadas pelo usuário; o botão «Sortear» permanece disponível em cada etapa.
- **Híbrido:** usuário decide o que travar e o que sortear, podendo rerrolar individualmente sem alterar etapas não afetadas.
- **Tudo aleatório:** gerar do nível 0 a um nível-alvo selecionado, usando tabelas oficiais curadas onde as regras determinarem, e sorteio uniforme **explicitamente identificado** dentre as opções elegíveis quando não houver tabela oficial e o usuário aceitar tal política.
- **Preview e aceite:** sorteio de build completa acontece em uma transação de rascunho; confirmar grava eventos. Cancelar descarta.
- **Pendências:** slots sem candidatos, tabelas incompletas, pré-requisitos não resolvidos, decisões narrativas sem gerador curado e regras que requerem GM são sinalizados; não criar resultado falso.
- **Reprodutibilidade:** seed, versão de algoritmo, rolls, resultados, sourceRef, IDs e locks ficam no histórico. Nenhuma renderização consome aleatoriedade.
- **Status:** catálogo e geração/progressão demonstrativa de níveis 0–1 implementados. A visão completa de criação/progressão 0–10 descrita acima permanece parcialmente implementada.

## Auditoria rápida da fixture (opcional)
`node tools/audit-demo-random.mjs` valida IDs, intervalos, probabilidades de `3d6` e encadeamentos do exemplo fictício. **Não é o motor de geração implementado** e não valida conteúdo oficial.


Atualização posterior: **CUR-018 concluída** como [formalização de riqueza e equipamento inicial](docs/entrega-riqueza-equipamento.md), com 12 kits, 66 concessões de profissões, 19 ganhos adicionais e moeda exata.

**CUR-019 concluída como formalização com pendências:** [Interesting Things](docs/entrega-interesting-things.md), com **Oddities, Artifacts, and Esoterica como padrão** e Core como alternativa. Dois seletores, 18 tabelas e 360 posições, com alternativas, quantidades e consequências preservadas. As 13 associações foram resolvidas pela transcrição do usuário; Books 20 permanece como texto sobre Dark Passages, com ponto de integração futura para gerar passagens/livros aleatórios; não há geração oficial ou aplicação automática de efeitos. `npm run curation:interesting-things` reproduz os artefatos, incluídos em `curation:check`. Validação: 122 testes de curadoria, 196 completos e build aprovados. Próxima tarefa: **CUR-020 — catálogo mínimo de itens do piloto**.

**CUR-020 concluída como catálogo de referência:** [itens do piloto](docs/entrega-catalogo-itens-piloto.md), com 409 registros e 641 referências. Inclui 67 definições Core, preços por lote/unidade, disponibilidade, requisitos e perfis de arma/armadura; cinco referências exigem escolha, e 57 tipos de ganho preservam restrições explícitas. Os 285 conjuntos especiais mantêm suas condições e fontes. `npm run curation:pilot-items` reproduz catálogo/relatório e integra `curation:check`. Integração, compra e efeitos automáticos continuam em etapas posteriores. Validação: 132 testes de curadoria, 206 testes completos e build aprovados. Próxima tarefa: **CUR-021 — fechar as tabelas do piloto**.

**CUR-021 concluída como auditoria com restrições:** [fechamento das tabelas](docs/entrega-fechamento-tabelas-piloto.md), com 74 identidades, 70 fluxos numéricos completos, probabilidades compostas e guardas de referência para Piety/Strange. Fears/Desires foram confirmados pelo usuário, sem associações pendentes; efeitos, escolhas de GM e orquestração preservam seus gates. `npm run curation:pilot-tables` reproduz auditoria/relatório e integra `curation:check`. Geração oficial permanece desabilitada. Validação: 145 testes de curadoria, 219 completos e build aprovados. Próximo passo para o piloto: **CUR-031 — compilador por publicação**, seguido de CUR-032; CUR-022 permanece a trilha de progressão.

## Higiene de conteúdo e ambiente local

A correção S0 da issue #1 está em [entrega-higiene-pii-s0.md](docs/entrega-higiene-pii-s0.md). Os diretórios de evidências, transcrições, snapshots e formalizações com excertos são locais e ignorados; continuam disponíveis neste ambiente, mas não acompanham novos clones. `rules/` e complementos de curadoria devem ser obtidos sob licença própria. Os comandos de curadoria sobre livros exigem esse ambiente completo; a suíte pública usa contratos e fixtures redistribuíveis.

Execute `npm run curation:privacy` antes de publicar alterações. A CI rejeita dados de compra e caminhos locais rastreados. Os geradores redigem evidências e recusam artefatos com o padrão sensível remanescente. Não use `git add -f` para publicar esses diretórios.

O histórico anterior exige tratamento próprio: [plano de histórico Git](docs/higiene-historico-git.md). A limpeza da ponta não expurga commits e objetos antigos.
