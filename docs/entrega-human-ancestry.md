# CUR-015 — Human/Core + Only Human: base e características derivadas

Revisão de 2026-10-27, conforme [plano-human-ancestry.md](plano-human-ancestry.md). Formalização local da base de Human no nível 0, com **duas variantes de publicação**, **15 fórmulas/regras numéricas** e **11 faixas de evidência**. O resultado não é um personagem completo nem um pack habilitado.

## Entrega

- [human-ancestry.json](../curation/pilot/human-ancestry.json): escolhas, fórmulas declarativas, idiomas, heranças, evidências, exemplos e requisitos do consumidor.
- [Relatório](../curation/reports/human-ancestry.json): dependências, hashes, contagens e saídas determinísticas.
- [Contrato e avaliador de referência](../packages/curation/ancestry-base-model.ts): validação estrita, operações numéricas tipadas e prévia pura, sem RNG e sem `eval`.
- [Formalizador](../tools/curation/human-ancestry-formalizer.ts), runner `tools/curation/human-ancestry.mjs` e [testes](../tests/curation-human-ancestry.test.ts).

Os IDs de entidade permanecem `sotdl:shadow-of-the-demon-lord-core:ancestry:human:default` e `sotdl:only-human:ancestry:human:variant`. O sidecar não modifica os registros captured, o ledger, o texto MD ou o contrato congelado de staging. Seus rótulos de revisão não certificam PDF, edição, licença ou toda a mecânica das publicações.

## Escolhas de atributos

| Regra | Formalização | Origem |
|---|---|---|
| Core fixo | Strength, Agility, Intellect e Will começam em 10; escolher exatamente um e aumentar em 1. | [Core Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14759) |
| Only Human fixo | Mesmo ramo numérico fixo, mantendo sua origem própria. | [Variant](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13638) |
| Only Human aleatório | Cada atributo = 8+1d3; quatro rolagens independentes, com uma face 1–3 para cada atributo. Não receber o +1 exclusivo do ramo fixo. | [Random Attribute Scores](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13640) |
| Ajuste geral opcional | Depois do modo escolhido, zero ou uma transferência: aumentar um atributo em 1 e diminuir outro em 1, com atributos distintos. Scores válidos de 1 a 20. | [Introdução fornecida](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L18) |

O jogador escolhe fixo/aleatório quando a variante oferece ambos. Selecionar tabelas suplementares não torna atributos aleatórios obrigatórios. O modo aleatório pertence à variante publicada Only Human; não é atribuído falsamente ao registro Core. A escolha de tabelas Core ou Human Development permanece independente, conforme a [política de expansões](politica-expansoes-ancestries.md).

Não há compra livre de pontos nem repetição da transferência. É permitido aumentar novamente o atributo que já recebeu o +1 fixo: por exemplo, Strength 12 e Agility 9, com os demais em 10. A prévia exige a escolha, não decide por nome, não gera novas faces e rejeita combinações incompatíveis, arrays de transferências ou valores de Size não publicados.

## Características e estado inicial

Todas as fórmulas usam os atributos **após** o modo escolhido e a transferência opcional.

| Campo | Base formalizada | Evidência/composição |
|---|---|---|
| Health | Strength | Declarado em ambos os blocos. |
| Perception | Intellect; teto geral 25 | Ambos os blocos + regra geral. |
| Defense | Agility, sem armadura/escudo; teto geral 25 | Ambos os blocos + regra geral. Armadura/equipamento são camadas posteriores. |
| Healing Rate | `max(1, floor(Health / 4))` | Core Human declara arredondar para baixo; regra geral declara mínimo 1. Only Human conserva a divisão por 4 sem declarar outro arredondamento. |
| Size | Escolha 1/2 ou 1 | Ambos os blocos. Independente de Build, conforme decisão explícita do usuário. `0.5` é preservado exatamente. |
| Speed | 10 | Declarado em ambos os blocos. |
| Power | 0 | Declarado em ambos os blocos. |
| Damage, Insanity, Corruption | 0 na base, antes de efeitos posteriores | Declarados no Core; herdados na variante Only Human, que não os repete. |
| Modificadores de Strength, Agility, Intellect, Will | Score final − 10 | Introdução geral e regras de atributos. |
| Modificador de Perception | Perception − 10 | Perception funciona como atributo, com score e modifier, combinado à regra geral de modificador. |

Fontes: [bloco Core](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14759), [bloco Only Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13638), [modificadores](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L1076) e [Healing Rate/Defense/Perception gerais](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L1241).

As duas heranças são explícitas: não há citação fictícia de “Damage 0” ou “round down” em Only Human. O suplemento não declara uma substituição para esses pontos, portanto a composição conserva a base Core. As traces distinguem concessão direta, herança Core e regra geral. Este sidecar formaliza a base; não restaura esses zeros sobre efeitos de background/desenvolvimento nem converte Health em recurso de pontos restantes.

## Idiomas e talentos

| Variante | Fala inicial | Alfabetização automática | Benefício adicional de ancestry |
|---|---|---|---|
| Core | Common Tongue | Nenhuma | Uma alternativa: idioma adicional ou profissão aleatória. |
| Only Human | Common Tongue | Nenhuma | Ganhos adicionais pelas Human Development Tables, ainda a formalizar em CUR-016/017. |

Não somar os dois blocos. “Idioma” sem outra especificação é fala; leitura/escrita só entram por concessão explícita, em idioma novo ou anterior, conforme a decisão do usuário. Não há teto próprio do aplicativo para trocas idioma/profissão. A formalização descreve os direitos de escolha: não inventa qual idioma foi escolhido ou qual profissão saiu.

Não há talento inicial nomeado nesses blocos de nível 0. **Determined, Health +5, aprender spell ou descobrir tradição pertencem aos blocos de nível 4**, cujas evidências são preservadas como exclusões da base, sem aplicar ganhos agora. A diferença de texto de Determined entre publicações continua pendente para CUR-023; os nomes iguais não fundem os registros.

## Exemplos conferidos

| Escolha | Atributos finais (Str/Agi/Int/Will) | Health | Defense | Perception | Healing Rate |
|---|---|---:|---:|---:|---:|
| Fixo, +1 Str, transferência +1 Str/−1 Agi | 12 / 9 / 10 / 10 | 12 | 9 | 10 | 3 |
| Only Human, faces d3 1/2/3/1, sem transferência | 9 / 10 / 11 / 9 | 9 | 10 | 11 | 2 |

Nos exemplos, Speed 10, Power 0 e os três estados iniciais são 0. Size pode ser 1/2 ou 1 sem mudar as outras características-base. Toda prévia retorna `completeCharacter: false` e lista o trabalho posterior. Tabelas de desenvolvimento podem alterar esses valores; seus resultados não foram executados nesta tarefa.

## Requisitos para o motor real

O consumidor demonstrativo atual armazena sete números em `baseStats` e aplica modificadores aditivos; isso não representa esta formalização. `consumerSupport` e `spec.deferred` geram tarefas concretas, em vez de preencher campos faltantes com números finais:

| Requisito | Próximos CURs |
|---|---|
| Selecionar variante e modo fixo/aleatório; manter fontes/alternativas exclusivas e transferência como evento próprio | CUR-033/034/036 |
| Consumir fórmulas e grafo de dependências; recompor Health, Healing Rate, Perception e Defense após mudanças de atributos, com camadas posteriores próprias | CUR-034 |
| Representar Size, Power, Perception, Healing Rate, estados iniciais e modificadores ausentes do contrato demo | CUR-033/034/036 |
| Registrar quatro d3 independentes com seed, faces, versão e fonte, sem RNG no cálculo/importação | CUR-035/036 |
| Formalizar tabelas de desenvolvimento, ganhos condicionais, fala/leitura/escrita e escolhas de profissão/idioma | CUR-016/017/021/033 |
| Resolver equipamentos/efeitos e ganhos de nível 4 sem confundi-los com a base | CUR-018/019/020/023/027/034 |

O avaliador de referência serve para verificar os dados de curadoria. Ele não é registrado como handler do motor real, não altera `calculateCharacter`, saves, UI, packs ou o demo. A habilitação do piloto exige as etapas de catálogo, integração e aceite vertical já planejadas.

## Reproduzir

```powershell
npm run curation:human
node tools/curation/human-ancestry.mjs --check
npm run curation:check
npm test
npm run build
```

O gerador primeiro verifica a matriz CUR-014 e suas dependências. `--check` compara os dois artefatos sem sobrescrevê-los; o runner pode atualizar cache em `tmp/curation/`. Os testes cobrem exemplos conferidos, 81 combinações de d3 e suas 12 transferências distintas, rejeições, limites, heranças, idiomas, determinismo, evidência exata e adulteração sem escrita.

Atualização posterior: **CUR-016 concluída** como [inventário de tabelas](entrega-inventario-tabelas-criacao.md), com Human Development como padrão e Core preservado como alternativa. CUR-017 também foi concluída: [profissões e idiomas](entrega-profissoes-idiomas.md). Próximo passo: **CUR-019 — Interesting Things**.

Gates aprovados em 2026-10-27: **85 testes de curadoria em 14 arquivos**, **159 testes completos em 21 arquivos** e build TypeScript/Vite. Os oito cenários novos também passaram isoladamente. Os quatro insumos, os 16 contratos congelados, o staging e os derivados anteriores passaram seus checks sem promoção ou alteração; o consumidor demo conserva seus hashes e não houve mudança de UI que exigisse E2E adicional.


Atualização posterior: **CUR-018 concluída** como [formalização de riqueza e equipamento inicial](entrega-riqueza-equipamento.md), com 12 kits, 66 concessões de profissões, 19 ganhos adicionais e moeda exata. Próxima tarefa: **CUR-019 — Interesting Things**.
