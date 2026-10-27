# Complemento de Character Creation — Core

Recebido em 2026-10-27: texto anterior às ancestries específicas, anexado pelo usuário, e quadro **Languages of the Northern Reach**, fornecido na mensagem. O material foi incorporado à matriz de CUR-014 como evidência suplementar local.

## Preservação e origem

- `curation/corrections/core-character-creation-2026-10-27/introduction.txt`: cópia byte a byte do anexo `Pasted text.txt`; SHA-256 `51524877da4e81c6146392d35f4fdca222e6e0b4ff9b7507b0e93c6bcb43f9ef`.
- `curation/corrections/core-character-creation-2026-10-27/languages.txt`: texto da mensagem em UTF-8; SHA-256 `18695a183fdf83e51b3816b0bc06f2c2121c1787cb2468aeff68d16a6e041de0`.
- Manifesto de origem/hashes em `curation/corrections/core-character-creation-2026-10-27/manifest.json`. Não foram atribuídas páginas impressas/físicas ou certificações de PDF/edição/permissão ao material.
- Revisão anterior do JSON, da entrega e da ferramenta preservada em `curation/history/core-creation-introduction-2026-10-27/`.

Os quatro MDs originais, o manifesto dos insumos, os ledgers e a reconciliação continuam com os mesmos hashes e linhas. As faixas novas apontam para os textos suplementares; não são apresentadas como capturas já existentes no inventário de CUR-013. Essa separação permite usar a nova evidência sem deslocar referências previamente auditadas.

## Lacunas resolvidas

| Tema | Regra localizada / consequência para a matriz |
|---|---|
| Primeira decisão | Escolher ancestry; outras ancestries dependem da discrição do GM. O GM também pode fornecer um personagem. |
| Ajuste geral | Opcional: aumentar um score em 1 e diminuir **outro** em 1, somente uma vez. É distinto do benefício Human de aumentar um atributo em 1. Scores entre 1 e 20; modificador = score − 10. |
| Estatísticas e talentos | Registrar características e talentos da ancestry. A matriz faz a derivação depender do ajuste geral opcional. |
| Nível 4 | Benefícios são recebidos ao chegar ao nível 4; não entram na criação de nível 0. |
| Narrativa da ancestry | Sugestões podem ser expandidas, alteradas ou abandonadas. Não são restrições universais de comportamento. |
| Ancestry Tables | É permitido rolar, escolher ou criar outros elementos. Não há quantidade fixa obrigatória de resultados nem exigência de usar cada tabela. Descrições são relativas à ancestry. |
| Idiomas | Localizados Common Tongue, Dark Speech, Dwarfish, Elvish, High Archaic e Trollish; Secret Language e Dead Languages são categorias abertas, não dois idiomas universais. O GM pode introduzir idiomas mortos. |

Alfabeto compartilhado não concede fala, leitura ou escrita de outro idioma. O quadro não é uma tabela aleatória nem uma lista fechada de todas as línguas permitidas. CUR-017 ainda deve formalizar as entidades, as categorias e os direitos de escolha.

A permissão de escolha/criação livre das **tabelas de ancestry** não é estendida automaticamente a riqueza, Interesting Things ou à profissão extra Human que o texto chama de aleatória. Novas histórias também não ganham automaticamente benefícios mecânicos inventados.

## Estado após a atualização

A [matriz Human/Core](entrega-piloto-core-nivel-zero.md) mantém **28 passos**, agora com **55 faixas de evidência**: 46 do corpus reconciliado e nove do complemento. Os passos com pendências caíram de **17 para 8**.

Atualização posterior: o usuário confirmou a independência Build/Size, aprovou Roleplaying Questions opcionais e forneceu os limites 17 Wealthy / 18 Rich. A matriz atual contém 57 faixas e seis passos com pendências; os números acima descrevem a revisão da introdução. Veja [decisões posteriores](decisoes-piloto-size-wealth-roleplaying.md).

Permanecem pendências em profissões, trocas por idiomas/leitura, especializações, riqueza, opções de kits, Interesting Things/efeitos e segredos. O material fornecido não recupera os números perdidos das tabelas de profissão, Wealth ou Interesting Things, nem esclarece todos os limites de trocas.

Nenhum pack foi ativado, nenhuma mecânica foi implementada e nenhum personagem foi alterado. Os **230 registros bloqueados** e os **1.320 segmentos em quarentena** do corpus permanecem. Próxima tarefa do backlog: **CUR-015**.

Validação aprovada: `npm run curation:check` (72 testes), `npm test` (146 testes), verificação determinística da matriz, cinco testes específicos de CUR-014 e `npm run build`. Também foi testada a rejeição de transcrição suplementar alterada, sem sobrescrever a matriz.
