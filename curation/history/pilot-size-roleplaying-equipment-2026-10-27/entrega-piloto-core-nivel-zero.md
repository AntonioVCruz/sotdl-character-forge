# CUR-014 — matriz de criação Human/Core, nível 0

Revisão: **2026-10-27**. Análise concluída, com lacunas explícitas para os lotes seguintes. Plano e critérios em [plano-piloto-core-nivel-zero.md](plano-piloto-core-nivel-zero.md).

O piloto seleciona **Human — Shadow of the Demon Lord Core**, ocorrência `ancestries:human-shadow-of-the-demon-lord-core`, mantendo *Human — Only Human* separado. Há texto local suficiente para localizar as características iniciais e as seis tabelas Human. A introdução anterior a *Professions* e o quadro de idiomas foram fornecidos pelo usuário e incorporados como evidência suplementar em 2026-10-27. A lacuna da introdução está resolvida no recorte do piloto; os quatro MDs auditados conservam suas linhas e hashes. Isso não certifica completude ou paginação em relação ao PDF.

## Artefatos e limites

- [Matriz estruturada](../curation/pilot/core-level-zero.json): **28 passos**, **55 faixas de evidência**, cardinalidade e grau de certeza, modo manual/aleatório, instruções de GM, dependências, tarefas seguintes e pendências por passo. **8 passos** ainda têm pendências; eram 17 antes do complemento.
- [Gerador/verificador](../tools/curation/core-pilot-matrix.ts) e runner `tools/curation/core-pilot.mjs`: verificam a revisão reconciliada e os hashes dos dois MDs selecionados, âncoras, limites e vínculos de inventário. Mudança de revisão exige reanálise deliberada.
- [Testes](../tests/curation-core-pilot.test.ts): determinismo, revisão exata dos trechos, preservação da quarentena, rejeição de dependências/evidências inválidas, lacunas ocultadas e adulteração sem sobrescrita.
- [Introdução fornecida](../curation/corrections/core-character-creation-2026-10-27/introduction.txt), [quadro de idiomas](../curation/corrections/core-character-creation-2026-10-27/languages.txt) e [manifesto do complemento](../curation/corrections/core-character-creation-2026-10-27/manifest.json): origem, hashes e ausência de página verificada. O anexo foi copiado byte a byte. As nove faixas novas são transcrição fornecida pelo usuário; não são entradas de staging/inventário de CUR-013. A revisão anterior da matriz/entrega está em `curation/history/core-creation-introduction-2026-10-27/`.

O JSON é um **artefato de análise**, não um `ContentPack`, uma `RandomTable` revisada ou um conjunto de slots já consumido pelo criador. Seus IDs de passos são locais à matriz; não são IDs de entidade nem substituem o ledger. Não houve promoção de captura/quarentena, certificação mecânica, alteração de save, implementação de cálculo ou habilitação de geração oficial.

## Checklist justificado

Os itens marcados significam que a necessidade foi analisada e rastreada. A execução de cada regra no criador continua dependente das tarefas indicadas. “Não demonstrado” é uma pendência de evidência, não uma permissão para omitir a escolha ou criar uma regra.

### Escopo, atributos e benefícios iniciais

| Conferido | Passo da matriz | Cardinalidade e decisão | Justificativa | Trabalho seguinte |
|---|---|---|---|---|
| [x] | `scope` | Uma ocorrência Human/Core; nível 0 é o recorte do piloto. Não selecionar a versão de Only Human pelo mesmo nome. | [Identidade Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14712); [nível inicial](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L5397). | CUR-015/033 |
| [x] | `identity` | Um campo de nome por política do produto; elementos narrativos podem ser expandidos, alterados ou abandonados. Exemplos não são uma lista fechada de escolhas. Sem fórmula inventada para medidas exatas. | [Descrição Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14720); [Ancestry Story](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L13). | CUR-015/033 |
| [x] | `attributes` | Quatro atributos-base 10; exatamente uma escolha de atributo recebe +1. Escolha manual publicada. Nenhum dado de geração de atributos nesse trecho. | [Creating a Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14759). | CUR-015/034 |
| [x] | `general-adjustment` | Ajuste opcional, zero ou uma vez: aumentar um atributo em 1 e diminuir **outro** em 1. Separado do +1 Human; não pode ser repetido. Scores entre 1 e 20. | [Scores / Adjusting Scores](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L18). | CUR-015/034 |
| [x] | `size` | Uma alternativa entre Size 1/2 e 1. O vínculo automático entre Build e Size não está demonstrado. | [Características Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14762). | CUR-015/034 |
| [x] | `base-stats` | Uma base derivada de atributos: Perception, Defense, Health e Healing Rate; registrar Speed, Power, Damage, Insanity, Corruption e modificadores. Não são escolhas de números finais livres. | [Base Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14762); [modificadores](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L1076); [características gerais](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L1241). | CUR-015/034 |
| [x] | `human-benefit` | Common Tongue concedido; escolher exatamente um ramo: falar um idioma adicional **ou** ganhar uma profissão **aleatória**. Seis idiomas nomeados e duas categorias abertas foram localizados. Não conceder leitura/escrita só pelo alfabeto. | [Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14768); [Languages of the Northern Reach](../curation/corrections/core-character-creation-2026-10-27/languages.txt). | CUR-015/017; formalizar entidades e categorias |

Perception = Intellect, Defense = Agility e Health = Strength são relações da base Human; Healing Rate é um quarto de Health arredondado para baixo. A regra geral acrescenta mínimo 1 ao Healing Rate e limite 25 à Defense, além de distinguir proteção de armadura/escudo. A matriz agora faz as características dependerem do aumento Human e do ajuste geral opcional. A formalização e os testes de cálculo pertencem a CUR-015/034; nenhuma fórmula foi ativada no criador. Os zeros iniciais de Insanity e Corruption não anulam consequências posteriores do background.

### Tabelas e consequências Human

| Conferido | Passo | Cardinalidade / modo | Justificativa | Trabalho seguinte |
|---|---|---|---|---|
| [x] | `background` | Tabela d20 de uso facultativo: rolar, escolher ou criar outro elemento. Não há quantidade fixa obrigatória nem exigência de usar cada tabela. Consequências do resultado publicado continuam condicionais ao resultado selecionado. | [Human Background](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14776); [Ancestry Tables](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L32). | CUR-016/021 |
| [x] | `background-effects` | Aplicar somente consequências do resultado obtido; abrir filhos condicionais de moeda, idioma, leitura, Insanity/Corruption e detalhes narrativos. | [Resultados e consequências](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14778). | CUR-015/017/018/021/034 |
| [x] | `human-personality` | Pode rolar 3d6, escolher ou descrever outra personalidade. Tabela não impõe escolha obrigatória. | [Human Personality](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14823); [regra geral](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L32). | CUR-016/021 |
| [x] | `human-religion` | Pode rolar 3d6, escolher ou criar outra descrição. Não excluir “sem religião”. | [Human Religion](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14850); [regra geral](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L32). | CUR-016/021 |
| [x] | `human-age` | Pode rolar 3d6, escolher ou criar outro elemento; a tabela fornece faixa etária, não sorteio da idade exata. | [Human Age](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14858); [regra geral](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L32). | CUR-016/021 |
| [x] | `human-build` | Pode rolar 3d6, escolher ou descrever outro porte. Descrições são relativas à ancestry, sem fórmula numérica nova para Size/medidas. | [Human Build](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14866); [regra geral](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L32). | CUR-016/021 |
| [x] | `human-appearance` | Pode rolar 3d6, escolher ou descrever outra aparência relativa à ancestry. Não converter descrições em bônus inventados. | [Human Appearance](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14880); [regra geral](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L32). | CUR-016/021 |

As consequências do background incluem `1d6` Insanity, Corruption, Insanity fixa, idioma adicional, leitura de Common Tongue, `2d6 cp` e detalhes com rolagens de anos/filhos. A quantidade de filhos usa `max(0, 1d6−2)`. Rolar somente filhos do resultado selecionado; não aplicar todos os resultados nem descartar efeitos indesejados. A tabela repete seu cabeçalho antes do resultado 18: isso não é uma segunda escolha de background.

### Profissões, idiomas e alfabetização

| Conferido | Passo | Cardinalidade / modo | Justificativa | Trabalho seguinte |
|---|---|---|---|---|
| [x] | `professions` | Dois direitos iniciais de profissão, cada qual manual ou aleatório. A opção Human pode acrescentar uma terceira profissão; ganhos e trocas exigem origens separadas. | [Starting Professions](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L170); [seletor de tipo](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L181). | CUR-016/017/021 |
| [x] | `profession-language` | A troca consome um direito de profissão e concede falar outro idioma **ou** ler um idioma que já fala. A introdução fornecida também não fixa limites de múltiplas trocas nem esclarece a troca da profissão aleatória Human. | [Languages](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L174); [introdução](../curation/corrections/core-character-creation-2026-10-27/introduction.txt#L26). | CUR-017/033; esclarecer os casos ambíguos |
| [x] | `profession-details` | Abrir escolhas internas por resultado (ofício, meio artístico, estilo, trabalho, mercadoria, instrumento) e conceder alfabetização quando o resultado manda. Substituições passam pelo GM. | [Tipos](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L181); [Common](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L229); [Religious](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L340); [substituições](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L297). | CUR-017/021/033 |

O procedimento aleatório é `d6` tipo → `d20` profissão, com seis categorias descritas. **Os números das linhas do seletor d6 não estão preservados**; há também números ausentes em subtabelas e colunas intercaladas. Não inferir a distribuição apenas por ordem visual. Os trechos das seis subtabelas estão individualizados nos 55 registros de evidência; continuam em quarentena na segmentação atual. Falar não equivale a ler/escrever, e profissão não é path. O uso de profissão para sucesso automático ou boons depende do GM; não é um bônus permanente da ficha.

### Riqueza, equipamento e Interesting Things

| Conferido | Passo | Cardinalidade / modo | Justificativa | Trabalho seguinte |
|---|---|---|---|---|
| [x] | `wealth` | Uma determinação por 3d6. Há seis estilos de vida; os limites numéricos de Wealthy e Rich estão ausentes. A escolha manual é uma questão de política do produto, não alternativa demonstrada nesse trecho. | [Procedimento](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L309); [Wealth](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L359). | CUR-016/018/021 |
| [x] | `starting-kit` | Um kit completo do estilo de vida: todos os itens fixos, mais alternativas e dinheiro do próprio kit. Quantidades não equivalem a preços. | [Destitute/Poor/Getting By](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L319); [Comfortable/Wealthy/Rich](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L382). | CUR-018/020/033/034 |
| [x] | `kit-options` | Comfortable/Wealthy: resolver uma alternativa entre shield, incantation ou kit conforme o texto específico. Rich: servant, guard e três cavalos com selas são ganhos, não três escolhas alternativas. | [Kits e instrução do GM](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L382). | CUR-018/020/025/034 |
| [x] | `interesting-thing` | Exatamente um resultado inicial. `d6` escolhe uma de seis tabelas; `d20` produz o resultado. Várias linhas perderam seus números. | [Procedimento](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L406); [roteador](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L471). | CUR-016/019/021 |
| [x] | `thing-effects` | Somente alternativas, quantidades e efeitos do resultado obtido; pode ser objeto, recurso, relação, pessoa, criatura ou característica narrativa. | [Tabela 1](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L476), [2](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L414), [3](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L438), [4](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L514), [5](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L548), [6](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L583). | CUR-019/020/021/027/034 |
| [x] | `inventory` | Somar ganhos de background, kit e Interesting Thing com origens distintas; separar possuir/equipar e preservar moedas/unidades. | [Capacidade](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L2896); [armadura](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L2982). | CUR-018/020/034/037 |

Os kits têm seis expressões de dinheiro distintas: `1d6 bits`, `2d6 bits`, `1d6 cp`, `2d6 cp`, `1d6 ss`, `2d6 ss`. O dinheiro do background se soma ao kit quando aplicável. As armas alternativas e a munição devem seguir o kit; não existe um único “slot equipamento” que escolha um item e descarte os demais ganhos.

Incantation do kit é um objeto com uma spell de rank 0 **escolhida pelo GM**, não uma tradição aprendida ou spell conhecida pelo personagem. Esse ramo demanda conteúdo mágico ou adjudicação manual rastreável; ele não obriga a implementar toda a progressão mágica antes de analisar o piloto. Dependência não resolvida deve restringir geração ou permanecer como pendência explícita.

Interesting Things contém decisões do GM, side rolls e efeitos que não cabem em simples texto decorativo. Exemplos de dependência: arma escolhida pelo GM; boon para esconder/esgueirar; camisa de mail que não acumula com outra armadura; consumíveis com quantidades; servant, animais e objetos incomuns. A matriz localiza essas famílias; reconstruir todos os resultados e handlers pertence a CUR-019/020/021/027. A ordem física no MD é 2, 3, seletor, 1, 4, 5, 6; o roteamento deve usar o seletor publicado, não essa ordem de extração.

### Interpretação, grupo e limites de nível

| Conferido | Passo | Cardinalidade / modo | Justificativa | Trabalho seguinte |
|---|---|---|---|---|
| [x] | `positive-traits` | A expressão “a couple” orienta dois traços positivos; registrar como conselho narrativo, sem bônus. A tabela d20 é inspiração opcional. | [Roleplaying](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L614); [Personality Traits](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L716). | CUR-016/021/033 |
| [x] | `negative-traits` | Pelo menos um traço negativo; sem máximo demonstrado. Texto livre ou inspiração opcional da coluna Negative; não vincular automaticamente os dois eixos de uma linha. | [Roleplaying](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L622). | CUR-016/021/033 |
| [x] | `roleplaying` | Perguntas orientadoras e segredos. A instrução de Secrets tem ao menos um segredo e depois menciona outro compartilhado com uma ou duas pessoas; a exigência de serem distintos é ambígua. | [Perguntas e Secrets](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L627). | CUR-033/036/037; esclarecer cardinalidade/privacidade |
| [x] | `group` | Combinar contexto inicial e vínculos com jogadores/GM. A primeira aventura forma o grupo; não exigir uma biografia coletiva pronta como atributo do personagem. | [Assemble the Group](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L4311); [Building a Group](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L752). | CUR-033/038 |
| [x] | `future-gains` | No nível 0: zero novice paths e zero ganhos de Level 4 Expert Human. Não conceder Determined/spell do nível 4, dinheiro por nível superior ou Interesting Thing adicional de seleção de path. | [Human nível 4](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14771); [progressão e criação acima do nível 0](../rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md#L784). | CUR-015/022/023/035 |

## Dependências e estratégias

A matriz contém um grafo em ordem válida: escolher o recorte precede escolhas Human; atributos precedem características; background precede consequências; riqueza precede kit e alternativas; Interesting Thing precede filhos; inventário depende de todas as origens de ganhos. Essa é uma ordem de implementação proposta, não uma sequência de páginas declarada pelo livro. A escolha de fala deve existir antes de validar uma opção que exige idioma já falado.

O produto exige manual, híbrido e tudo aleatório, com preview/confirm/cancel, locks, rerrolagens localizadas e histórico. Isso não prova que toda escolha manual esteja autorizada pelo trecho publicado. A matriz distingue:

- **Manual explícito na fonte:** aumento Human, transferência opcional +1/−1 uma vez, ramo idioma/profissão, duas profissões iniciais, trocas por idioma/leitura e uso das tabelas de ancestry por escolha ou criação livre.
- **Procedimento publicado de sorteio:** riqueza 3d6, profissão d6→d20, Interesting Thing d6→d20 e dados escritos nas tabelas Human. Preservar faces, ranges, filhos e consequências; ausência de numeração impede habilitação oficial.
- **Manual por requisito/política do aplicativo:** selecionar riqueza/Interesting Thing sem rolar ainda exige política ou evidência adicional. A permissão fornecida refere-se às tabelas de ancestry; não se estende automaticamente a todos os sorteios do capítulo ou à profissão extra Human descrita como aleatória.
- **Sem tabela oficial demonstrada:** nome, decisão de aumentar atributo, Size, idioma específico e escolhas internas sem dado. Um eventual sorteio de pool elegível é não oficial, exige autorização da política e não resolve uma lacuna de tabela publicada.
- **GM:** substituições de profissão, seleção da spell da incantation e de determinadas armas, contexto do grupo e efeitos sem suporte. “Gerar tudo” pode produzir rascunho com pendências; não deve rerrolar até escapar desses casos.

O recebimento e as decisões do complemento estão detalhados em [entrega-complemento-criacao-core.md](entrega-complemento-criacao-core.md).

## Lacunas e encaminhamento

| Lacuna localizada | Tratamento e tarefa |
|---|---|
| Introdução anterior a Professions — **resolvida no piloto** | Anexo fornecido preservado e verificado por hash; primeira escolha de ancestry, ajuste opcional único +1/−1, estatísticas/talentos e nível 4 localizados. Formalização continua em CUR-015. |
| Procedimento narrativo das seis tabelas Human — **resolvido** | Pode rolar, escolher ou criar elementos; sem quantidade fixa obrigatória prescrita. Não exigir todos os campos/tabelas. Formalizar os resultados e os dados em CUR-016/021. |
| Seletor d6 de profissões sem números e subtabelas com perdas | Reconstrução por evidência adicional; nenhuma escolha uniforme disfarçada. CUR-016/017/021. |
| Wealthy/Rich sem limites numéricos | Não preencher 17/18 por memória. CUR-018/021. |
| Interesting Things com numeração ausente, efeitos e dependências | Reconstruir seletor/filhos, validar ranges e handlers ou resolução manual. CUR-019/020/021/027. |
| Quadro de idiomas — **localizado**; limites de trocas ainda pendentes | Seis idiomas nomeados e categorias abertas Secret Language/Dead Languages; alfabetos não concedem leitura/escrita. A introdução não resolve múltiplas trocas nem a troca da profissão extra Human. CUR-017. |
| Relação entre Build, Size e medidas exatas não estabelecida | Não fazer derivação automática pela descrição. CUR-015/016. |
| Perguntas/segredos e privacidade | Não inventar número obrigatório de respostas nem exportar segredo sem política. CUR-033/036/037. |
| Dependências dos kits e objetos incomuns | Referência resolvida, restrição de geração ou adjudicação manual explícita; não eliminar resultados difíceis. CUR-018/019/020/034. |

A descoberta de lacunas não altera os **230 bloqueios** e **1.320 segmentos em quarentena** do corpus. São pendências do recorte de criação, registradas na matriz, sem criar ou remover bloqueios de extração. A precedência de erratas já decidida permanece preservada; as correções de Movement, Crawl, armas etc. são dependências de seus respectivos lotes, não novas escolhas de criação. A decisão sobre Giant Raven também permanece intacta.

## Reproduzir e conferir

```powershell
npm run curation:pilot
node tools/curation/core-pilot.mjs --check
npm run curation:check
npm test
npm run build
```

`--write` verifica todas as dependências antes de gerar o JSON; `--check` compara os bytes e não sobrescreve a matriz. O runner pode escrever cache em `tmp/curation/`. Das 55 faixas, 46 conservam a evidência MD e seus vínculos ao inventário; nove apontam para os dois textos suplementares, sem inventário/staging ou paginação fictícios. Páginas declaradas no início da ancestry não são atribuídas automaticamente a todas as tabelas como páginas verificadas.

Gates aprovados em 2026-10-27: `npm run curation:check` (**13 arquivos / 72 testes**), `npm test` (**20 arquivos / 146 testes**) e `npm run build` (TypeScript/Vite). Os cinco cenários da matriz também passaram isoladamente, incluindo proteção da transcrição suplementar e distinção entre idiomas nomeados e categorias abertas. O manifesto, os contratos congelados e todos os derivados de CUR-008 a CUR-013 passaram seus checks sem mudança de estado. Não houve alteração de interface que exigisse novo E2E.

Próximo passo: **CUR-015 — ancestry inicial e características derivadas**, usando as evidências e lacunas desta matriz. Não avançar diretamente à generalização dos quatro slots do demo: a criação real exige escolhas repetidas, alternativas, ganhos fixos, filhos condicionais, narrativa e decisões do GM.
