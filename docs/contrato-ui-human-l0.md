# Contrato de UI da prévia Human L0

Registro da fatia de [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36), alinhado ao esboço de tela do Designer STD (seções 1–8). A ordem de aceite continua **#34 → #35 → #36 → #37**. Este contrato não encerra a #36 e não habilita ruleset.

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

## 3. Comando do motor e superfície

| Comando | Superfície |
|---|---|
| `select` | Confirmar ancestry, modo fixo, aumento, Size, procedimento, coreBenefit ou transferência, depois da prévia |
| `roll-attributes` | Sortear no slot de atributos aleatórios, com seed explícita. É o único RNG de atributo. Escolher a opção "aleatório" não sorteia |
| `state` | Passo avançado: damage, insanity ou corruption, com motivo |
| `manual-effect` / `effect-active` | Passo avançado, autoridade `user`. Não é tabela da #34 |

Profissão, riqueza, kit, Interesting Thing e equipamento não têm comando nesta fatia.

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

## 5. Mini-ficha e `HumanL0View`

A ficha confirmada mostra `stats` e `states` quando o view os devolve. Se `stats` é `null`, cada característica fica `indisponível`. A interface não calcula CUR-015 para preencher o buraco. `languages`, `grants` e `breakdown` vêm do view; o breakdown fica sob demanda no fluxo do slot quando há rastro, e os direitos `starting-profession-choices` e `pending-random-profession` aparecem como pendência, sem profissão gerada.

Banner permanente: prévia local com geração oficial desligada, resultados de procedimento pendentes, catálogo de equipamento e tabelas pendente. `fullyResolved` continua falso. Anotar a revisão não habilita o ruleset.

## 6. Stepper provisório

1. Ruleset e fonte — pins da fixture, versão, badges. A opção de ruleset habilitado é inelegível.
2. Ancestry e Size.
3. Atributos — modo fixo, aumento, `roll-attributes` com seed, transferência opcional.
4. Procedimento — `core` ou `human-development`, e coreBenefit só no par em que o contrato exige. `random-profession` é direito pendente.
5. Reservado — profissões, idiomas além da fala, wealth, kit, Interesting Thing, equipamento. Estado `pending`, copy "Aguarda #34/#35". Nenhuma alternativa é inventada.
6. Nome. Notas: indisponível, porque o tipo não tem esse campo. O nome grava na ficha já criada sem novo evento mecânico; antes da primeira confirmação, entra no `create`.
7. Avançado — `state`, `manual-effect`, `effect-active`.
8. Revisão — pendências do motor e da UI, import/export do tipo Human.

O passo 5 só vira escolha real quando a #35 publicar a sequência.

## 7. Persistência e export

Chave `human-l0/fixture-preview`, separada da ficha demo e do id `local-human-l0` dos testes do motor. Importar exige `sotdl-human-l0-character` com esse id; JSON demo é recusado e não sobrescreve ninguém. Exportar não embute pack. Impressão, PDF e HTML autônomo: indisponível nesta fatia.

## 8. Acessibilidade

O `ChoiceSlot` do S1 cobre foco no painel manual, Esc devolvendo ao botão que abriu, Space/Enter na opção e opção inelegível focável sem selecionar. Botão bloqueado não dispara a ação. A mini-ficha e o status da prévia usam `aria-live`. Alt+seta troca o passo. O motivo do bloqueio é texto associado ao controle.

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

## O que a #36 ainda exige

Procedimentos da #35, dados da #34, E2E da criação real, inventário e paridade de impressão continuam fora. A habilitação oficial continua na #37.
