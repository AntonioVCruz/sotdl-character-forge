# Contrato mecânico de pack Human L0 — versão 1.0.0

Entrega de 2026-11-02, atendendo a definição de contrato solicitada após a [revisão do conteúdo-base](revisao-conteudo-human-l0.md). A definição é a atividade de contrato da próxima entrega mecânica, identificada como etapa 2 no plano registrado na #7.

Identificador: `sotdl.human-l0.mechanics`. Versão: `1.0.0`. Implementação: `packages/curation/human-l0-mechanics.ts`. Esse versionamento pertence ao payload novo; o contrato congelado de curadoria 1.0.0 e seus 16 arquivos permanecem intactos.

## Posição no pack e validação

O envelope continua sendo `PackSchema`. Cada pack desta fatia possui uma entidade `kind: ancestry`, com os campos habituais e um campo obrigatório `mechanics`. A raiz do pack não ganha campos novos. A entidade mecânica e os objetos internos são estritos; não aceitam texto livre de regras, excertos, scripts ou funções como campos extras.

APIs públicas:

- `HumanL0MechanicsSchema`: shape e invariantes locais do payload.
- `HumanL0MechanicalEntitySchema` / `HumanL0MechanicalPackSchema`: envelope completo dessa projeção.
- `parseHumanL0MechanicalPacks(inputs)`: gate contextual de fonte, identidade, dependências e proveniência. Recebe Core sozinho ou Core + expansão, em uma versão selecionada de cada; retorna Core antes da expansão.
- `HumanL0SelectionSchema` / `parseHumanL0Selection(input, packs)`: formato e validação contextual de escolhas, sem rolar dados ou produzir um personagem.

`parsePack` genérico continua aceitando propriedades extras de entidades; isso não valida o conteúdo de `mechanics`. A [projeção mecânica local](entrega-projecao-mecanica-human-l0.md) chama o gate específico; a integração ao importador/runtime ainda está pendente. O compilador de metadados permanece em seu contrato anterior e continua recusando payloads mecânicos.

Core independe da instalação do suplemento. A expansão exige o Core exato por packId/versão, sem fallback para uma versão mais nova. Referências selecionam também entityId. O gate recebe a fatia escolhida, não todas as versões eventualmente instaladas no catálogo. Versões de contrato desconhecidas são recusadas, sem conversão silenciosa.

## Campos do payload

| Grupo | Conteúdo e invariantes |
|---|---|
| `contract`, `contractVersion`, `level`, `variant` | Contrato/versão exatos, nível 0 e variante Core/Only Human. |
| `evidence` | Referências por ID a fonte ou decisão do produto, hash do insumo e localização declarada. Sem excertos, caminhos absolutos ou alegação de inspeção de PDF. |
| `attributes.fixed` | Score-base, aumento em exatamente um atributo e origem. |
| `attributes.random` | Base, um dado por atributo, quatro rolagens independentes; nulo para Core e presente na expansão. O jogador seleciona o modo. |
| `attributes.adjustment` | Transferência opcional única entre atributos distintos, após o modo de atributos. |
| `attributes.limits` | Limites inteiros coerentes, após efeitos nos atributos; os modos precisam caber nesses limites. |
| `characteristics` | Health/Defense/Perception referenciam atributos finais; Speed e Power são valores com origem. |
| `healingRate` | Entrada em Health final; divisor, arredondamento para baixo e mínimo têm origens separadas. |
| `size` | Opções positivas distintas e política de independência de Build, identificada como decisão do produto. |
| `initialStates` | Damage/Insanity/Corruption não negativos, inicializados somente na criação; reaplicação durante recálculo é proibida. |
| `modifiers` | Subtração declarativa sobre scores finais dos quatro atributos e de Perception. |
| `finalLimits` | Limites de Defense/Perception aplicados depois dos efeitos diretos e equipamento. |
| `baseLanguage` | Fala inicial com origem; não implica leitura/escrita. |
| `procedure` | Perfil Core ou Human Development, independente do modo de atributos; limites e concessões externas descritos abaixo. |
| `evaluationOrder` | Ordem de dependências fixa, sem código executável. |

O schema valida formato, referências e coerência; não prova que os números coincidem com uma publicação nem concede autorização de distribuição. O projetor local usa os insumos revisados e confere seus hashes e faixas de evidência antes de emitir os valores reais.

## C01 — Evidência por variante e por componente

Cada componente tem `origin`:

- `declared`: evidências da própria publicação, com escopo ancestry ou regra geral.
- `inherited`: referência exata a pack/versão/entidade/componente do Core e citações locais correspondentes às do componente de origem.
- `product-decision`: evidência de decisão identificada por hash/ID/ponteiro, sem atribuição ao livro.

IDs locais de evidência podem diferir, mas a herança precisa preservar o metadado completo da citação, não apenas o nome do ID. O valor herdado também precisa ser idêntico ao componente referenciado. Evidências ausentes, duplicadas, não utilizadas, de outra variante ou atribuídas a uma autoridade incorreta são recusadas.

Os componentes herdáveis da expansão são tipados por `HumanL0InheritedComponentSchema`: ajuste/limites de atributos, arredondamento/mínimo de Healing Rate, três estados iniciais, subtração de modificadores e dois limites finais. A referência precisa apontar ao mesmo caminho de componente no Core.

Isso permite que a divisão de Healing Rate permaneça declarada por Only Human, enquanto arredondamento e mínimo mantêm as origens Core pertinentes. Os zeros iniciais também ficam identificados como herança; o texto do suplemento não recebe uma declaração que não contém. Os campos declarados da expansão não podem usar as citações Core como se fossem declarações próprias.

## C02 — Atributos, tabelas e benefícios separados

O pack fornece modos e um perfil de procedimento; a escolha do personagem vincula ancestry e procedimento por referências completas e independentes. São admitidas as seis combinações estruturais disponíveis: Core fixo com cada procedimento; expansão fixa/aleatória com cada procedimento. A presença das tabelas da expansão não habilita modo aleatório no Core.

O perfil Core descreve seleção manual/aleatória, profissões iniciais, alternativa de ancestry e resolução externa de riqueza. O perfil Human Development exige o procedimento completo e seus resultados rolados, substituindo profissões aleatórias/riqueza normais e sem adicionar benefício Core implicitamente. Tabelas, resultados e efeitos específicos serão projetados nas etapas apropriadas.

`coreBenefit` é uma união exclusiva entre idioma falado e profissão aleatória. Esse benefício explícito só é aceito na seleção Core com procedimento Core. Escolher tabelas Core para outra variante não atribui por si só o bloco de benefícios da ancestry Core. Nos demais contextos o envelope mantém `coreBenefit: null`; isso não executa ou certifica o conjunto completo de concessões do personagem. Concessões adicionais/contextuais precisam de suas próprias origens e validação nos handlers futuros.

A escolha aleatória de atributos armazena seed, versão do PRNG e quatro faces com atributo/eventId. Atributos e IDs de evento são únicos, mas faces iguais são permitidas. O validador confere os limites e a coerência formal dos registros; verificar a derivação das faces pela seed pertence ao futuro handler de RNG/histórico.

## C03 — Base, efeitos e resultado final

A ordem contratual é:

```text
modo de atributos → ajuste opcional → efeitos nos atributos → limites dos atributos
→ características-base → efeitos diretos nas características/equipamento
→ limites finais → Healing Rate usando Health final → modificadores dos scores finais
```

A inicialização dos estados é um evento exclusivo da criação, fora da recomposição recorrente. O schema rejeita entrada de Healing Rate baseada no Health inicial, limites aplicados antes do equipamento, características calculadas dos atributos iniciais, ordem de avaliação trocada e reaplicação dos estados iniciais.

Esse é o contrato da composição. Cálculo de personagem, aplicação de efeitos, execução de tabelas, RNG, persistência de eventos e migrações do motor ainda serão implementados. A validação de seleção calcula apenas os scores-base necessários para conferir os limites da escolha e da transferência; não aplica características, efeitos ou ganhos de procedimento.

## Fixture, compatibilidade e entrega

Exemplo completo: `curation/examples/human-l0-mechanics.synthetic.json`. Usa fontes, valores e evidências inventados, `fictionalData: true` e estados `needs-review`; não representa regras publicadas de SotDL. Por exemplo, sua base de score e seu dado diferem dos insumos Human revisados. Não foi criado pack mecânico oficial no Git nem marcado conteúdo oficial como fictício.

Os packs atuais, o índice, o relatório, os saves e o consumidor demonstrativo permanecem no formato anterior. Uma futura projeção mecânica precisa de versão nova de pack, validação explícita deste contrato, proveniência e auditoria permitidas pela política; a definição do schema não promove conteúdo ou habilita ruleset.

Os 27 cenários novos verificam envelope, versão, Core independente, dependência exata, evidências por fonte/componente, valores herdados, decisão de Size, fases de composição, escolhas independentes, rolagens armazenadas, limites e ausência de RNG/mutação.

Validação local: 337 testes completos com dois workers, build, checagem dos 16 arquivos congelados e gate de privacidade aprovados. O contrato passou também na revisão direcionada de seus 27 cenários. `npm run curation:validate` preservou o hash do conjunto atual de metadados, `f9e3f7b4064c04f0a093aae8cbf55df0da1c30f132ea7ec14260c503ee2e10b1`.

Autoria da definição e validação técnica: Codex. O ledger de revisão anterior permanece como registro histórico da evidência e dos requisitos C01–C03; este contrato atende esses requisitos no formato, sem transformar o aceite local em permissão de distribuição ou inspeção de PDF.

### Estado da próxima entrega mecânica

- [x] Revisão local do conteúdo-base Human L0.
- [x] Definição do contrato mecânico do pack.
- [x] Projeção local pelo compilador e validação da base revisada; distribuição permanece pendente.
- [ ] Integração dos handlers no motor e aceite do personagem.
