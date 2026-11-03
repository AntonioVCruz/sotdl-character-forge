# Contrato de UI da prévia Human L0

Registro da fatia de [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36), alinhado ao esboço de tela do Designer STD (seções 1–8) e à camada seguinte do [brief de 2026-11-03](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36#issuecomment-6592537796). A ordem de aceite continua **#34 → #35 → #36 → #37**. Este contrato não encerra a #36 e não habilita ruleset: `officialGenerationEnabled` e `rulesetEnabled` permanecem `false`.

O esqueleto AC-H1–H9 permanece válido e não é reaberto. A camada de 2026-11-03 acrescenta o passo 5, o shell de inventário e o adapter de pendência sobre [`sotdl.human-l0.consumable@1.0.0`](contrato-consumivel-tabelas-human-l0.md) (atividade 2 da #34). AC-H10–H21 são antecipados e provisórios até a matriz da #35. Não fecham o aceite vertical da #36: esse aceite continua a exigir a cobertura da #34 e a sequência da #35.

O Engenheiro STD confirmou, para esta revisão: a lista de códigos da seção 9 é o enum estável do adapter; AC-H16–H19 permanecem; o shell de inventário entra agora com stubs; equipar e camadas reais esperam os handlers da atividade 7 da #34.

A API continua a do [motor Human L0](entrega-motor-human-l0.md): `newHumanL0Character`, `performHumanL0Command`, `calculateHumanL0Character`, import/export e IndexedDB. O adapter de tela está em `apps/web/human-l0-slots.ts`. Ele traduz `HumanL0View` e `HumanL0Command` para props do `ChoiceSlot` já existente (`SlotUiState`, opções, prévia, bloqueio com texto). O componente não lê mecânica de pack nem calcula característica.

O wizard de `apps/web/l0-demo.ts` permanece na forja demonstrativa. Esta entrada é a rota `#/human-l0`, com `kind: sotdl-human-l0-character` e `mode: local-preview`. Ela não lê nem grava a chave `character` da ficha demo.

## 1. Três modos de sessão

| Modo de UI | Origem | Badge |
|---|---|---|
| Fixture de teste | packs públicos de `curation/examples/human-l0-mechanics.synthetic.json`, `fictionalData: true` | `fixture` |
| Prévia local | ficha `mode: local-preview` | `prévia local` |
| Ruleset habilitado | gates da #37 | fora desta entrada |

Os dois badges ficam visíveis no topo. `officialGenerationEnabled` permanece `false`. Pedir o canal `official` ou o canal `local-preview` como outra superfície é recusado: o segundo nome é o modo da ficha, não um carregador de packs reais. Trocar de modo não preenche lacuna com `demoStats` nem com o adapter fictício do wizard S1.

A flag `HUMAN_L0_FIXTURE_PREVIEW_ENABLED` só publica o link e a rota. Desligá-la não altera a flag oficial.

## 2. Shell

Três colunas, no mesmo desenho do S1: stepper, passo ativo, mini-ficha sticky. Slots editáveis usam `ChoiceSlot`. A rota fica em `ErrorBoundary`. A mini-ficha não usa o `Stats` do demo: aquele componente trata lacunas da ficha demonstrativa como permanentes. Aqui o número só aparece se `HumanL0View` o devolveu.

O passo 5 ocupa a coluna do meio e inclui o shell de inventário da seção 10. A mini-ficha sticky continua na terceira coluna.

## 3. Comando do motor e superfície

| Comando | Superfície |
|---|---|
| `select` | Confirmar ancestry, modo fixo, aumento, Size, procedimento, coreBenefit ou transferência, depois da prévia |
| `roll-attributes` | Sortear no slot de atributos aleatórios, com seed explícita. É o único RNG de atributo. Escolher a opção "aleatório" não sorteia |
| `state` | Passo avançado: damage, insanity ou corruption, com motivo |
| `manual-effect` / `effect-active` | Passo avançado, autoridade `user`. Não é tabela da #34 |

Profissão, riqueza, kit, Interesting Thing e equipamento não têm comando nesta fatia do esqueleto. No passo 5 o adapter emite somente o comando que o motor ou a API publicar para cada entrada da matriz. Enquanto esse comando não existir, o sub-slot fica `pending`, com bloqueio textual "handler da #34/#35 ausente". Este contrato não cria nome de comando. Isso preserva o AC-H3.

## 4. Estados do ChoiceSlot

| Estado | Uso nesta entrada |
|---|---|
| `empty` | Ainda sem valor confirmado |
| `preview` | Proposta na memória. A ficha gravada não muda até Confirmar, que repete o comando |
| `confirmed` | Opção elegível aplicada |
| `locked` | Trava de sessão. Não sorteia e não substitui Gerar tudo. Não entra no JSON do motor |
| `needs-review` | A proposta foi recusada; a última ficha válida permanece, com o motivo em texto |
| `suspended` | Aumento fixo enquanto o modo é aleatório |
| `pending` | Passos reservados, sem opções inventadas |

Bloqueio de ação usa texto visível, não só `aria-disabled`: fonte oficial desligada, seed ausente, modo aleatório indisponível, benefício inelegível, slot travado, handler da #34/#35 ausente. Opção inelegível continua na lista com `disabledReason`.

O passo 5 reutiliza esta tabela em cada sub-slot (seção 6). O estado `pending` continua sem opções inventadas a partir do nome do grupo. Trocar o ramo no passo 4 também leva os sub-slots do ramo anterior a `needs-review`, com o motivo em texto: o conteúdo do outro ramo não migra.

## 5. Mini-ficha e `HumanL0View`

A ficha confirmada mostra `stats` e `states` quando o view os devolve. Se `stats` é `null`, cada característica fica `indisponível`. A interface não calcula CUR-015 para preencher o buraco. `languages`, `grants` e `breakdown` vêm do view; o breakdown fica sob demanda no fluxo do slot quando há rastro, e os direitos `starting-profession-choices` e `pending-random-profession` aparecem como pendência, sem profissão gerada.

Banner permanente: prévia local com geração oficial desligada, resultados de procedimento pendentes, catálogo de equipamento e tabelas pendente. `fullyResolved` continua falso. Anotar a revisão não habilita o ruleset.

A camada seguinte acrescenta duas seções compactas. As duas leem apenas `HumanL0View`. A interface não calcula esses números e não preenche lacuna com `demoStats`.

Procedimento: `grants` confirmados e chips de pendência, um por `pending.reason`. Cada chip traz "Ir para o passo".

Inventário: contagem de itens carregados e equipados, chip "Preço desconhecido (n)" e chips de efeito pendente. Defense só muda se o view devolver a substituição de um item equipado. Ganhar um item não altera a mini-ficha.

Os banners permanentes do esqueleto (`local-preview-only`, `procedure-outcomes-pending`, `equipment-and-table-catalog-pending`) permanecem enquanto o motor os devolver.

## 6. Stepper provisório

1. Ruleset e fonte — pins da fixture, versão, badges. A opção de ruleset habilitado é inelegível.
2. Ancestry e Size.
3. Atributos — modo fixo, aumento, `roll-attributes` com seed, transferência opcional.
4. Procedimento — `core` ou `human-development`, e coreBenefit só no par em que o contrato exige. `random-profession` é direito pendente.
5. Procedimento do ramo escolhido — contêiner "Procedimento — <ramo>" com um `ChoiceSlot` por entrada da matriz da #35. Até essa matriz, cinco grupos placeholder em `pending`, sem ordem implícita: profissão, idiomas além da fala, wealth/kit, Interesting Thing, equipamento.
6. Nome. Notas: indisponível, porque o tipo não tem esse campo. O nome grava na ficha já criada sem novo evento mecânico; antes da primeira confirmação, entra no `create`.
7. Avançado — `state`, `manual-effect`, `effect-active`.
8. Revisão — pendências do motor e da UI, import/export do tipo Human.

A escolha do passo 4 (`core` ou `human-development`) só seleciona qual sequência a #35 vai publicar. A interface não deduz quais sub-passos existem em cada ramo.

Até a matriz, a coluna do passo 5 mostra os cinco grupos acima, marcados `pending`. Essa enumeração não é ordem de procedimento. Quando a matriz chegar, a ordem, a cardinalidade e quais grupos existem em cada ramo vêm dela. O stub acompanhado em `bc-cfb109e6` não publica essa ordem por si. AC-H10 e AC-H11 continuam provisórios até a matriz.

Copy do placeholder, por grupo:

- "Aguarda matriz da #35", quando o stub existe e o grupo já tem consumo da #34. Essa frase substitui "Aguarda #34/#35" do esqueleto.
- "Aguarda lote da #34", quando falta dado do lote.
- "Aguarda #34/#35" permanece enquanto o grupo ainda está na reserva do esqueleto, sem esse consumo.

Trocar o ramo no passo 4 invalida os sub-slots do outro ramo. Eles passam a `needs-review`, com o motivo em texto. Nada é migrado em silêncio.

O adapter não inventa comando. Emite o que o motor ou a API publicar para a entrada. Sem esse comando, o sub-slot fica `pending` e o bloqueio visível diz "handler da #34/#35 ausente".

Opção que o contrato não traz não aparece. O nome do grupo não gera lista.

| Situação vinda do consumable ou do motor | Estado do slot | O que mostra |
|---|---|---|
| Sem entrada na matriz, ou sem handler | `pending` | placeholder e motivo em texto |
| Entrada com opções resolvidas pelo contrato | `empty`, depois `preview`, depois `confirmed` | opções do contrato; a prévia não grava (AC-H1) |
| `choice-required`, ou manual com candidatos da matriz | `empty` | só os candidatos listados; `resolvedItemId` fica `null` até Confirmar |
| Manual sem candidatos | `pending`, com painel manual | campo ou nota do jogador; a consequência fica retida |
| Resultado recusado pelo gate | `needs-review` | última ficha válida e o motivo |
| Grupo `local-only` agrupado (atividades 3 e 5) | `pending` | texto de pendência, sem lista de opções |

## 7. Persistência e export

Chave `human-l0/fixture-preview`, separada da ficha demo e do id `local-human-l0` dos testes do motor. Importar exige `sotdl-human-l0-character` com esse id; JSON demo é recusado e não sobrescreve ninguém. Exportar não embute pack. Impressão, PDF e HTML autônomo: indisponível nesta fatia.

## 8. Acessibilidade

O `ChoiceSlot` do S1 cobre foco no painel manual, Esc devolvendo ao botão que abriu, Space/Enter na opção e opção inelegível focável sem selecionar. Botão bloqueado não dispara a ação. A mini-ficha e o status da prévia usam `aria-live`. Alt+seta troca o passo. O motivo do bloqueio é texto associado ao controle.

Bloqueio novo — handler ausente, equipar sem a atividade 7, preço desconhecido, grupo local — traz o motivo em texto associado ao controle (`aria-describedby`), além de `aria-disabled`.

Chip de pendência é focável. O nome acessível é "Pendência: <copy>" e a ação é "Ir para o passo".

Banner de recusa de gate usa `role="alert"` uma vez, ao aparecer. Banner permanente usa `role="status"` e não é reanunciado.

Mover item entre Carregado e Equipado funciona por teclado. Arrastar não é o único caminho. `aria-live` anuncia a mudança na mini-ficha.

Status não depende só da cor: o chip tem ícone e texto.

## 9. Mapa de pendência tipada para a UI

Adapter da pendência estruturada de [`sotdl.human-l0.consumable@1.0.0`](contrato-consumivel-tabelas-human-l0.md). O Engenheiro STD confirmou a lista abaixo como enum estável do adapter. A interface não acrescenta código.

Toda pendência traz `retainsConsequence: true`. A consequência manual permanece na ficha e na Revisão, em chip ou linha "retida, aguardando resolução". A interface não a apaga.

A copy desta seção é estrutural: chaves `pending.<reason>` e `issue.<code>`. O label final em português ou inglês espera o OK semântico do Curador em cada PR das atividades 3, 4 e 5 da #34.

Três superfícies:

- Slot (`ChoiceSlot`), quando o jogador pode agir: `choice-required` e manuais com candidatos.
- Chip, por item ou entrada, na mini-ficha e no inventário, com "Ir para o passo".
- Banner, para condição de documento ou de sessão e para recusa de gate. Permanece enquanto o motor devolver o código. Recusa de gate entra também na Revisão (passo 8).

Código fora das tabelas usa o fallback genérico "Pendência `<código>` — sem copy ainda" e gera aviso de desenvolvimento. O código continua visível.

### 9.1. Gate e forma

Recusa de documento vira banner de diagnóstico. Não é ação do jogador.

| Código | Superfície | Copy estrutural |
|---|---|---|
| `uniform-row-weight` | banner | Tabela com peso por linha em vez de faces do dado — dados recusados |
| `weight-mismatch` | banner | Peso da faixa não confere com o dado — dados recusados |
| `range-outside-die` | banner | Faixa fora do intervalo do dado — dados recusados |
| `shared-column-roll` | banner | Colunas compartilham rolagem — dados recusados |
| `open-tail-weight-invented` | banner | Cauda aberta com peso inventado — dados recusados |
| `open-tail-domain` | chip na entrada | Domínio da cauda aberta pendente |
| `lookup-unknown-key` | banner | Consulta aponta para resultado inexistente |
| `lookup-coverage` | banner | Consulta incompleta; a omissão não vira pendência implícita |
| `lookup-has-dice` | banner | Consulta não pode rolar dado |
| `lookup-missing-prior` | slot `pending` | Consulta aguarda resultado anterior |
| `subtable-missing` | banner | Subtabela ausente |
| `bounded-recursion` | slot `pending` e chip | Limite de recursão atingido — resolução manual, sem rerrolar e sem descartar |
| `recursion-reroll-forbidden` | banner | Rerrolagem no limite não é permitida |
| `recursion-discard-forbidden` | banner | Descarte no limite não é permitido |
| `side-roll-on-possession` | banner | Rolagem lateral não dispara na posse |
| `relative-is-not-character` | banner | Efeito de parente não se aplica ao personagem |
| `side-roll-phase-mismatch` | banner | Fase da rolagem lateral incorreta |
| `unknown-option` | banner | Opção referenciada inexistente |
| `duplicate-origin` | chip na entrada, na Revisão | Mesma origem já aplicada — não reaplicada |
| `mechanics-semantics-changed` | banner bloqueante | Documento altera semântica mecânica — recusado |
| `mechanics-contract-mismatch` | banner bloqueante | Contrato mecânico incompatível — recusado |
| `hash-check-blocks-synthetic` | banner | Bloqueio de hash marcado como impeditivo da fixture — recusado. `act1-local-hash-check` não bloqueia fixture sintética |

### 9.2. Efeito, perfil e preço

| Código | Superfície | Copy estrutural |
|---|---|---|
| `possession-applies-use` | banner de recusa | Posse não aplica uso |
| `defense-not-substitution` | banner de recusa | Defense só por substituição |
| `defense-on-possession` | chip no item; banner se vier do documento | Defense só ao equipar ou empunhar, não na posse |
| `weapon-no-defense` | chip no slot `on-equip` / `on-use` | Arma sem Defense — pendente |
| `defense-bonus-not-substitution` | chip no slot `on-equip` | Bônus de Defense não é substituição — pendente |
| `profile-mismatch` | chip no item | Perfil do item não confere — pendente |
| `generic-profile-has-stats` | banner de recusa | Item genérico não tem estatística |
| `unknown-price` | chip "Preço desconhecido" | Preço desconhecido é distinto de 0 e não entra na soma |
| `unknown-price-not-zero` | banner de recusa | Preço desconhecido recebeu valor — recusado |

### 9.3. Lotes e grupos das atividades 3 a 5

| Código | Superfície | Copy estrutural |
|---|---|---|
| `range-starts-not-reextracted` | slot `pending` no grupo de profissão, e banner | Categoria ainda sem faixas extraídas — pendente local |
| `catalog-group-not-individual` | chip no grupo de catálogo | Grupo de catálogo, não item individual — pendente local |
| `unextracted-range-has-weights` | banner de recusa | Grupo não extraído com pesos — recusado |
| `local-only-has-effect` | banner de recusa | Grupo local com efeito — recusado |
| `grouped-as-individual-evidence` | banner de recusa | Grupo tratado como item individual — recusado |
| `act3-act5-grouped-local-only` | bloqueio em banner "Pendente local (act 3–5)" | 36 profissões e 314 registros de catálogo agrupados: pendência, sem lista de opções |

### 9.4. Resoluções manuais

As dezesseis resoluções `selecionado-manual` do consumable usam estas razões. A superfície segue a razão, não um nome de regra inventado aqui.

| Razão | Superfície | Interação |
|---|---|---|
| `choice-required` | slot `ChoiceSlot` | candidatos da matriz; `resolvedItemId` fica `null` até Confirmar |
| `manual-category-choice` | slot | escolha de categoria entre candidatos |
| `open-category-language` | slot e campo manual | idioma de categoria aberta, sem lista inventada |
| `partial-literacy` | slot ou chip em Idiomas | alfabetização parcial — pendente de registro |
| `player-fields` | painel manual no slot | campos do jogador (aparência expandida) |
| `manual-procedure` | banner e chip | procedimento manual; consequência retida |
| `manual-composition` | banner e chip | composição manual |
| `conditional-manual` | banner e chip | resolução manual condicional |
| `conditional-branch` | banner e chip | ramo condicional `local-only`, sem efeito |
| `bounded-recursion` | slot `pending` e chip | a mesma superfície da seção 9.1 |
| `no-extra-life-rolls` | banner informativo | sem rolagens extras |
| `choice-resolved-early` | banner de recusa | candidato preenchido antes da escolha — recusado |

## 10. Shell de inventário e equipar

O shell entra nesta camada, com stubs e pendências. Equipar e camadas reais esperam os handlers da atividade 7 da #34. O shell não espera essa atividade para ser desenhado. O Engenheiro STD confirmou esse recorte em AC-H16–H19.

Duas zonas visuais: Carregado (posse, `possession: carried`, `usageApplied: false`) e Equipado/Empunhado (uso). Passar de uma zona à outra é ação explícita do jogador.

`grant-item` coloca o item só em Carregado. Efeito de equipamento não se aplica na posse. A mini-ficha não muda.

`substitute-defense` aparece como prévia só ao equipar (`on-equip`) ou empunhar (`on-use`). O texto do efeito diz "substitui". O shell não apresenta esse efeito como acréscimo "+". Na posse, o item mostra o chip `defense-on-possession`.

Sem handler da atividade 7, Equipar e Empunhar ficam bloqueados, com o texto visível "Equipar aguarda handlers da #34 (act 7)". O efeito previsto fica em chip pendente e não é aplicado.

Preço `exact` ou `minimum` mostra o valor e a denominação do contrato. Preço `unknown` ou `variable` mostra o chip "Preço desconhecido": o valor não é 0 e não entra na soma. Se houver qualquer preço desconhecido, o total se apresenta como parcial.

`grant-currency` mostra só o que o view devolveu.

Item de perfil `generic` não mostra estatística. A edição segue só o que o contrato permitir.

Grupo `catalog-group-not-individual` aparece como linha de grupo pendente, não como item.

## Aceite do esqueleto (AC-H1–H9)

O brief do Designer STD pede este esqueleto, não o aceite funcional completo da #36.

| ID | Onde se vê |
|---|---|
| AC-H1 | Prévia no `ChoiceSlot` não grava nem troca a mini-ficha. Confirmar repete o comando. Descartar preserva o confirmado. |
| AC-H2 | Opção inelegível continua na lista, com `tabIndex` 0 e `disabledReason`. Botão bloqueado não chama o comando. |
| AC-H3 | A tela só pede `select`, `roll-attributes` com seed, `state`, `manual-effect` e `effect-active`. Renderizar não sorteia. |
| AC-H4 | A mini-ficha lê `HumanL0View`. Banner fixo: `local-preview-only`, `procedure-outcomes-pending`, `equipment-and-table-catalog-pending`. Direito pendente tem "Ir para o passo". Anotar a revisão não liga o ruleset. |
| AC-H5 | O passo diz vazio, parcial, completo ou pendente. O passo reservado fica pendente, com "Aguarda #34/#35". Anterior, Próximo e o stepper só mudam o passo. |
| AC-H6 | O painel do `ChoiceSlot` toma foco, Esc devolve, Space/Enter não seleciona inelegível, Alt+seta troca o passo, e a mini-ficha anuncia a confirmação. |
| AC-H7 | Persistência `human-l0/fixture-preview`, tipo `sotdl-human-l0-character`. JSON demo é recusado. Impressão, PDF e HTML: indisponível nesta fatia. |
| AC-H8 | `WizardL0` e os testes S1 não mudam de comportamento. A fixture não é pack oficial. |
| AC-H9 | `ErrorBoundary` na rota, com Tentar de novo e Recomeçar. Recomeçar apaga só `human-l0/fixture-preview`. Sem os packs, a ficha abre com `baseResolved: false`, o motivo e o histórico. |

Estes nove critérios continuam o aceite do esqueleto já entregue. Não são reabertos. O AC-H5 descreve o passo 5 daquela fatia, ainda reservado, com "Aguarda #34/#35". A camada seguinte troca essa reserva pelo modelo da seção 6. A copy antiga permanece apenas enquanto o grupo não tiver o consumo descrito ali.

## Aceite antecipado (AC-H10–H21)

Critérios provisórios, antecipados pelo brief de 2026-11-03. Valem até a matriz da #35 publicar ordem, cardinalidade e grupos de cada ramo. Os identificadores podem ser renumerados ou ajustados quando essa matriz chegar. Não substituem AC-H1–H9 e não fecham o aceite vertical da #36. O Engenheiro STD confirmou AC-H16–H19.

A copy do AC-H10 segue a seção 6: "Aguarda matriz da #35" quando o stub existe e o grupo já tem consumo da #34; "Aguarda lote da #34" se faltar o lote.

| ID | Onde se vê |
|---|---|
| AC-H10 | Passo 5 renderiza sub-slots a partir da matriz da #35 quando ela existe. Sem ela, mostra os cinco grupos placeholder em `pending`, com "Aguarda matriz da #35", sem ordem implícita e sem opções. |
| AC-H11 | Trocar `core` / `human-development` no passo 4 põe os sub-slots do ramo anterior em `needs-review`, com motivo. Nada é migrado. |
| AC-H12 | `choice-required` e manuais com candidatos viram `ChoiceSlot` só com os candidatos do contrato. `resolvedItemId` permanece `null` até Confirmar. A prévia não grava (AC-H1). |
| AC-H13 | O adapter mapeia todos os códigos da seção 9 para slot, chip ou banner. Código desconhecido usa o fallback visível. |
| AC-H14 | `retainsConsequence: true`: nenhuma pendência apaga a consequência. Ela aparece como retida na ficha e na Revisão. |
| AC-H15 | Grupos `act3-act5-grouped-local-only` aparecem como pendência local, em bloqueio de banner, sem lista de opções. |
| AC-H16 | O inventário separa Carregado e Equipado. `grant-item` entra só em Carregado e não altera a mini-ficha. |
| AC-H17 | `substitute-defense` só aparece em `on-equip` ou `on-use`, como substituição. Na posse, o item mostra `defense-on-possession`. |
| AC-H18 | Sem handler da atividade 7, Equipar e Empunhar ficam bloqueados, com texto visível. O efeito previsto é chip pendente e não é aplicado. |
| AC-H19 | Preço desconhecido mostra chip, nunca 0, e o total fica parcial. |
| AC-H20 | A mini-ficha mostra grants e pendências do procedimento, e o resumo de inventário, só a partir de `HumanL0View`. Sem `demoStats`. |
| AC-H21 | Bloqueio novo tem motivo em texto associado ao controle. Chip de pendência é focável. Mover item entre zonas funciona por teclado. |

## O que a #36 ainda exige

Esta revisão do contrato não fecha o aceite vertical da #36. Continuam exigidos a cobertura e os handlers da #34, a matriz de procedimentos da #35, o E2E da criação real e a paridade de impressão.

O passo 5, o mapa de pendência e o shell de inventário ficam antecipados: placeholders e stubs. A ordem do procedimento, além desses placeholders, espera a matriz da #35. Equipar e camadas reais esperam a atividade 7 da #34. Impressão, PDF, HTML autônomo e o restante que o brief deixa para depois (P2-4..8) continuam fora. A habilitação oficial continua na #37. Esta camada não toca a #37 nem o L1 da #21.

`officialGenerationEnabled` e `rulesetEnabled` permanecem `false`. A interface não preenche lacuna real com `demoStats`, com o adapter fictício do wizard S1 nem com valor sintético.
