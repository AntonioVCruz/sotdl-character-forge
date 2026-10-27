# Catálogo de tabelas aleatórias — inventário e protocolo

**Estado:** planejamento/curadoria; este kit ainda **não contém** o texto integral das tabelas oficiais em formato executável. Entradas das fontes são registradas em seus livros/compêndios e devem ser validadas página a página antes de importação. Não distribuir conteúdo protegido em packs públicos sem autorização.

## Evidências para orientar o modelo
| Fonte/material fornecido | Localização | Procedimento comprovável | Modelo requerido |
|---|---|---|---|
| Shadow of the Demon Lord Core (Revised Edition) | Capítulo 1, páginas impressas 11–22; no arquivo PDF, aprox. 12–24 | Diversas tabelas de ancestry para aparência, background, idade/personalidade; `d20`, `3d6` e ranges, variam por ancestry | `RandomTable` contextual à ancestry e variante, eventos mecânicos e narrativos |
| Shadow of the Demon Lord Core | Capítulo 1, Professions e Wealth, páginas impressas 23–25; PDF aprox. 25–27 | Profession tables usam resultados de `d20`, riqueza inicial usa `3d6`; escolha de profissão/pool pode depender da fonte e da ancestry | Composição de escolha e tabela com pesos corretos |
| Shadow of the Demon Lord Core | Capítulo 1, Interesting Things, páginas impressas 25–26; PDF aprox. 27–28 | `d6` seleciona uma das 6 tabelas; `d20` indica entrada na tabela selecionada; algumas entradas têm alternativas/rolagens internas | Referência encadeada `tableRef` e side rolls |
| SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md | `Full Entry` de cada ancestry, por publicação | Background, educação, origem, aparência e outras tabelas específicas; algumas criam escolhas, idiomas, profissão ou recursos | Verificar cada variante, condição e efeito contra PDF antes de marcar curada |
| SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md | seção de *Frayed Ends* (fonte indireta neste conjunto) | Descreve regras **opcionais** de quirks `d6→d20`, como procedimento que só se aplica quando a campanha o habilita | Entrada `optional`, dependência da variante, auditável. O PDF original de *Frayed Ends* não está na seleção de PDFs montados; não validar automaticamente por esse trecho isolado |
| Outros suplementos do projeto | ancestries, equipamentos, regras opcionais, criaturas | Podem apresentar tabelas de resultados, geradores, eventos e variações próprias | Inventário incremental e revisão individual por fonte |

**Nota importante:** números de páginas são indicativos de localização para curadoria. Cada `sourcePage` final deve apontar à **página impressa exata onde a tabela começa**, confirmada com a fonte, e preservar PDF page de forma independente quando necessário.

## Prioridade de implementação por tipo de tabela
1. **Narrativas por ancestry:** Background, Age, Build, Appearance, Personality, distinguishing features, upbringing (quando houver). Checar se a publicação apresenta rolamento, escolha ou criação livre como opções equivalentes.
2. **Professions:** tabelas de categoria/subcategoria, escolhas livres e ramificações por ancestry/classe (sem presumir que toda profissão tem 1d20).
3. **Wealth / starting equipment:** tabela e seus efeitos em recursos, itens, número de moedas e opções de GM; permitir dados secundarios para quantidade e escolhas vinculadas.
4. **Interesting Things:** roteamento a uma das seis tabelas, resultado, resultados compostos, side-rolls e itens/traits.
5. **Suplementos de ancestries:** versões expandidas ou alternativas com tabelas próprias não devem substituir a ancestralidade do Core sem seleção de variante.
6. **Outros subsistemas aleatórios:** quirks, complicações, maldições, geração de criaturas/constructs e efeitos mágicos — escopo posterior se não forem exigidos para criar um PC; se obrigatórios para uma opção de PC habilitada, são dependências explícitas.

## Checklist da curadoria de cada tabela
- [ ] Conferir obra, edição, revisão, página impressa e PDF page no arquivo original.
- [ ] Registrar nome/ID por **publicação**, faixa `diceExpr` original e resultados mínimo/máximo alcançáveis.
- [ ] Confirmar todas as linhas e ranges; verificar colunas multi-tabela (PDF em duas colunas pode embaralhar extração).
- [ ] Identificar se a fonte orienta `roll`, `choose`, GM choice, ambos ou contexto específico; não trocar uma dessas opções por decisão do app sem rótulo.
- [ ] Conferir tabelas-filhas, dados auxiliares, resultados que mudam stats/Corruption/Insanity/itens/profissões e escolhas alternativas.
- [ ] Registrar se o resultado pode causar conflitos (p.ex. ancestry não elegível, profissão obrigatória) e a política **da própria fonte** para resolvê-los; caso não diga, exigir decisão do GM.
- [ ] Validar payload e testes de domínio, distribuição, coverage, nesting e efeitos.
- [ ] Marcar `status: curated` só após revisão visual quando necessária; IDs para outcomes ficam estáveis em versões de pack.
- [ ] Verificar política autoral do pack (local/privado ou disponibilização permitida).

## Representação de probabilidade
Uma tabela `3d6` tem **216** sequências possíveis de faces. Contagens por total de 3 a 18:
`[1, 3, 6, 10, 15, 21, 25, 27, 27, 25, 21, 15, 10, 6, 3, 1]`.
Isso faz com que resultados agrupados em faixas recebam probabilidades distintas, mesmo quando tenham mesma quantidade de números no intervalo. Exemplo demonstrativo (não oficial): `3–8 = 56/216`, `9–12 = 104/216`, `13–18 = 56/216`.

**Nunca:** escolher uma linha de uma tabela `3d6` uniformemente, mapear `3..18` por `randomInt(16)+3`, gerar dado no React ou tratar uma spell disponível como se houvesse tabela oficial de spells sem respaldo de fonte.
