# Contrato de UI da prévia Human L0

Registro da fatia de [#36](https://github.com/AntonioVCruz/sotdl-character-forge/issues/36). A ordem de aceite continua **#34 → #35 → #36 → #37**. Este documento e o protótipo em `apps/web/human-l0-preview.ts` não encerram a #36, não executam os handlers da #34 nem a orquestração da #35, e não habilitam ruleset.

A API usada é a do [motor Human L0](entrega-motor-human-l0.md): `newHumanL0Character`, `performHumanL0Command`, `calculateHumanL0Character`, `importHumanL0Character` e `exportHumanL0Character`, com persistência `saveHumanL0Character` / `loadHumanL0Character`. O wizard de `apps/web/l0-demo.ts` permanece no adapter fictício (`fictionalData: true` no recorte demonstrativo, `MAGIC_PATH` / `demoSlot` / `demoLevel` só nesse fluxo).

## Três rótulos

| Rótulo | Significado nesta fatia |
|---|---|
| **fixture** | Única entrada aberta no protótipo. Packs públicos de `curation/examples/human-l0-mechanics.synthetic.json`, todos com `fictionalData: true`. Não é texto de livro nem resultado de tabela publicada. |
| **local-preview** | `mode` da ficha `sotdl-human-l0-character` e do cálculo do motor. A ficha de fixture também nasce nesse modo. Pedir o canal `local-preview` à entrada do protótipo não carrega packs reais e não abre outra superfície: a função recusa, com geração oficial ainda falsa. |
| **official** | Desligado. `officialGenerationEnabled` permanece `false`. Não há controle, flag de ruleset nem pack habilitado que o ligue. A #37 é quem pode tratar habilitação, depois do aceite das fatias anteriores. |

`classifyHumanL0Surface` materializa essa distinção. `fixture` com os packs públicos devolve `data: fixture`, `mode: local-preview` e `officialGenerationEnabled: false`. `official` e `local-preview` como pedido de canal devolvem bloqueio e a flag oficial falsa. Um pack com `fictionalData` diferente de `true` não passa nesta entrada, mesmo que o schema mecânico o aceite.

A flag `HUMAN_L0_FIXTURE_PREVIEW_ENABLED` só monta a seção “Prévia local · fixture” em `apps/web/main.tsx`. Desligá-la esconde o protótipo. Ela não altera `officialGenerationEnabled`.

## Prévia e confirmação

A prévia chama o motor e devolve outra ficha em memória. Ela não grava IndexedDB.

- Sem ficha confirmada, a prévia é `newHumanL0Character` (`create`) no id `fixture-preview`.
- Com ficha confirmada, a prévia de escolha é o comando `select`.
- Rolar atributos é o comando `roll-attributes`, a única fronteira de sorteio. Exige ficha já confirmada, seed informada pelo usuário e ancestry da fixture que ofereça modo aleatório. O protótipo não inventa seed. Repetir o cálculo, importar ou reabrir não sorteia de novo.
- Confirmar repete o mesmo intent contra a ficha base. Se o resultado divergir, a confirmação é recusada (`preview-stale`) e a ficha gravada permanece. Se o cálculo não fecha (`baseResolved: false`), a confirmação da escolha também é recusada.
- Descartar a prévia só limpa o rascunho na tela.
- A gravação usa compare-and-swap. Conflito de outra aba não sobrescreve o registro.

Importar JSON passa por `importHumanL0Character`. O arquivo precisa ser o personagem `fixture-preview`; outro id, inclusive a ficha demo e o id padrão `local-human-l0` dos testes do motor, é recusado. A importação só grava ao confirmar. Um arquivo cuja fonte não fecha continua legível: o cálculo fica suspenso, com o motivo do motor, e os eventos não são reescritos.

Exportar usa `exportHumanL0Character` da ficha confirmada. O JSON não embute packs, evidência nem totais em cache. Impressão, PDF e HTML autônomo desta ficha ficam indisponíveis; os controles do demo não passam a imprimir a ficha Human.

## Elegibilidade e bloqueios

Antes da prévia, `buildFixtureSelection` monta o envelope e o valida com `parseHumanL0Selection`. Opção inelegível permanece visível com motivo; a prévia não é aplicada. A confirmação repete essa validação no contexto atual (fonte, versão, benefício, Size, atributos distintos na transferência).

Motivos expostos ao usuário saem do código do contrato ou do motor (`HumanL0ContractError` ou `Human L0: <código>.`). A interface não substitui esse código por uma regra paralela nem por texto de livro. Códigos sem frase cadastrada aparecem como `Pendência do motor: <código>.` ou `Motivo do motor: <código>.`.

Bloqueios estáveis desta entrada, além dos códigos do motor:

| Código | Quando |
|---|---|
| `official-generation-disabled` | Canal `official`, ou flag oficial diferente de falsa. |
| `local-preview-channel-closed` | Pedido do canal `local-preview` a esta entrada. |
| `fixture-required` | Algum pack sem `fictionalData: true`. |
| `seed-required` | Rolagem sem seed, ou seed fora do limite do comando. |
| `nothing-to-update` | Comando sobre ficha ainda não confirmada. |
| `already-confirmed` | `create` quando já há ficha. |
| `preview-stale` | A base mudou desde a prévia. |
| `unexpected-character-id` | Id diferente de `fixture-preview`. |
| `concurrent-change` | O compare-and-swap recusou a gravação. |

## Pendências estruturadas e lacunas

`calculateHumanL0Character` continua dono dos números. A ficha da prévia mostra, quando `baseResolved` é verdadeiro, os valores devolvidos para Strength, Agility, Intellect, Will, Size, Perception, Power, Healing Rate, modificadores e os estados Damage, Insanity e Corruption. A composição visível omite alvos `health`, `defense` e `speed`.

Health, Defense e Speed ficam sempre `indisponível`. A interface não copia esses campos de `view.stats` e não aplica fórmula de CUR-015 para preenchê-los. Isso vale mesmo quando o motor calculou um número interno na fixture.

Campos sem handler nesta fatia ficam explícitos, sem resultado inventado:

| Campo | Estado |
|---|---|
| Profissões geradas | `pendente`. Direito `starting-profession-choices` ou `pending-random-profession` é contagem/pendência do motor, não uma profissão. |
| Alfabetização | `indisponível`. Idioma do motor, quando há, é só fala. |
| Wealth, kit, inventário, equipamento publicado | `pendente`. |
| Tabelas narrativas e Interesting Thing | `pendente`. |
| Impressão, PDF e HTML autônomo | `indisponível`. |

`fullyResolved` permanece falso. A tela não diz que a ficha está completa. Issues conhecidas do motor, quando vêm no `view`, são listadas com o código:

- `local-preview-only`
- `procedure-outcomes-pending`
- `equipment-and-table-catalog-pending`
- `source-and-distribution-review-pending`
- `source-or-selection-unavailable`
- `conflicting-manual-equipment`

Fonte ausente ou versão alterada não apaga o JSON. O modelo marca os números como `indisponível` e conserva o issue de suspensão.

## Persistência

O tipo é `human-l0/<id>`, a mesma chave de `packages/character-generator/human-l0-storage.ts`. O protótipo grava só `human-l0/fixture-preview`, no banco `sotdl-character`, objeto `state`, separado da chave `character` da ficha demo. Reabrir a página relê esse id. A entrada não chama `saveCharacter` nem `clearCharacter`.

## Acessibilidade

- A seção tem nome acessível “Prévia local Human L0, fixture”.
- Controles são `button`, `select`, `input` e `checkbox` nativos, alcançáveis por teclado, com o foco visível já definido em `apps/web/style.css`.
- O botão de prévia fica no tab order quando a escolha é inelegível (`aria-disabled` e `aria-describedby` na lista de motivos). Clique nesse estado não chama o motor.
- O status de prévia, confirmação, descarte e falha vai para uma região `aria-live="polite"`. Falha de ação também abre `role="alert"` com os motivos.
- Ao surgir a prévia ou a importação, o foco vai para o título desse painel (`tabIndex={-1}`).
- Cada número ou lacuna da ficha é um par `dt`/`dd`. Listas de pendências, bloqueios, idiomas e direitos têm nome acessível.
- A ficha confirmada e a prévia são regiões com nomes diferentes das regiões do criador demonstrativo, para não misturar os fluxos.

## O que a #36 ainda exige

Critérios da issue e o que esta fatia cobre:

| Critério | Esta fatia |
|---|---|
| Fluxo consome comandos e pendências do motor, sem preencher lacuna real com mock | Parcial: `create`, `select`, `roll-attributes`, cálculo e issues. Sem procedimentos da #35. |
| Prévia só altera a ficha ao confirmar, com nova validação | Coberto no protótipo de fixture. |
| Fonte ausente, versão alterada, handler sem suporte e escolhas pendentes têm motivo; dados preservados | Coberto para o cálculo suspenso e para os campos sem handler listados acima. |
| Modos, locks, rerolls e passos do procedimento completo | Fora. Depende da #35. A rolagem de atributos é só o comando já existente no motor. |
| Ficha e inventário coerentes com o motor, inclusive equipamento | Parcial: números que o contrato acima permite, mais lacunas explícitas. Sem inventário. |
| Salvar, recarregar, importar e exportar sem RNG implícito e sem sobrescrever a ficha demo | Coberto para `human-l0/fixture-preview`. |
| Impressão, PDF e HTML com paridade | Formato indisponível, sem botão neste protótipo. |
| E2E da criação real, troca de fonte, equipamento e teclado de ponta a ponta | Fora. Há testes do adapter e do componente. O wizard demo e o E2E já existente continuam no fluxo antigo. |
| Distinção entre fixture, prévia local e fatia oficial | Coberto. Oficial permanece desligado. |

Nada aqui é geração oficial, freeze ou autorização de distribuição. Packs reais continuam fora do Git, como em [politica-distribuicao-conteudo.md](politica-distribuicao-conteudo.md).
