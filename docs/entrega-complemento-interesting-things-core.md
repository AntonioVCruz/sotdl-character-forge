# Complemento de Interesting Things — Core

Texto fornecido pelo usuário em 2026-10-27. O anexo foi preservado byte a byte em [interesting-things.txt](../curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt), com origem e hashes no [manifesto](../curation/corrections/core-interesting-things-2026-10-27/manifest.json). SHA-256: `836006ebb1021f9af6075d5d19d8665e429bd6ac9062b79b1dcd3a691934ef61`.

## Numeração recuperada

O procedimento concede **um Interesting Thing inicial**: rolar d6 para selecionar a tabela do mesmo número e depois d20 para obter o resultado. Não há um ganho em cada uma das seis tabelas. O anexo contém os seis resultados do seletor e todos os 120 resultados finais.

| Resultado d6 | Tabela d20 | Resultados presentes |
|---|---|---:|
| 1 | Table 1 | 1–20 |
| 2 | Table 2 | 1–20 |
| 3 | Table 3 | 1–20 |
| 4 | Table 4 | 1–20 |
| 5 | Table 5 | 1–20 |
| 6 | Table 6 | 1–20 |

A auditoria cobre os **120 pares d6→d20 exatamente uma vez**, sem lacunas ou sobreposições. Cada par inicial tem probabilidade 1/120; alternativas e quantidades internas pertencem somente ao resultado obtido. A matriz registra `interestingThingsScope` com dados, seletor, tabelas, intervalos e texto completo, preservando linhas quebradas.

## Conteúdo preservado para formalização

- Alternativas dentro de um resultado, como magnet/silver mirror, tipos de pets, armas/escudos, elementos narrativos e objetos; uma alternativa não é um novo resultado do seletor.
- Quantidades variáveis: Table 2 resultados 13/17 (`1d20`, `1d6+1`); Table 3 resultados 13/17 (`2d6`, alternativas `3d6`/`1d6`); Table 4 resultado 5 (`1d6`); Table 5 resultados 3/11/14 (`2d20`, `1d6+1`). Rolar somente o ramo relevante após resolver a escolha, sem atribuir todas as quantidades ao personagem.
- Table 3 resultado 8 e Table 5 resultado 10: arma escolhida pelo GM. Preservar essa decisão, sem sortear outra linha para evitá-la.
- Table 4 resultado 2: alternativa de boots/cloak com boons condicionais distintos. Table 6 resultado 17: mail sob roupa não acumula com outra armadura.
- Pessoas, criaturas, narrativa, veículos, consumíveis e efeitos incomuns não viram automaticamente itens equipáveis ou bônus permanentes. Dependência sem suporte demanda referência/resolução manual, não um efeito inventado.

O campo de segredo opcional das Roleplaying Questions não remove o resultado Table 6/20 da tabela de Interesting Things. São origens e decisões diferentes; o resultado publicado continua preservado como texto.

## Resultado da atualização

A [matriz Human/Core](entrega-piloto-core-nivel-zero.md) mantém **28 passos**, agora com **73 faixas de evidência**: 46 do corpus original e 27 de seis textos suplementares. Os passos com pendências caíram de **3 para 2**: opções dos kits e formalização de efeitos/dependências de Interesting Things. Não restam números ausentes no material de Interesting Things fornecido.

Essas duas pendências são trabalho dos próximos lotes, não uma solicitação de mais numeração: CUR-018/019/020/021/027/034 deverá formalizar escolhas, referências, consequências e handlers ou adjudicação manual. A atualização não conclui esses CURs, não emite tabelas importáveis e não habilita geração oficial.

Os quatro MDs, o manifesto de insumos, os ledgers, os IDs já atribuídos, os **230 bloqueios** e os **1.320 segmentos em quarentena** foram preservados. As novas faixas não são apresentadas como capturas já existentes em CUR-013; não foi inventada paginação de PDF. Snapshot anterior em `curation/history/core-interesting-things-supplement-2026-10-27/`.

Próxima tarefa do backlog: **CUR-015**.

Validação aprovada: `npm run curation:check` (75 testes), `npm test` (149 testes) e `npm run build`. Os testes enumeram os 120 pares de Interesting Things, conferem resultados com linhas quebradas, quantidades, alternativas, escolhas do GM e a cláusula de não acumulação de mail. Também confirmam a manutenção da quarentena original e a ausência de implementação automática dos efeitos. Hash da cópia conferido contra o anexo.
