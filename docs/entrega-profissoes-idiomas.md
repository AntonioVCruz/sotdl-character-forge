# CUR-017 — profissões e idiomas

Revisão de **2026-10-27**, conforme [plano-profissoes-idiomas.md](plano-profissoes-idiomas.md). Formalizadas **168 opções das tabelas**, preservadas por publicação, e **uma concessão direta de Occult**: 169 registros locais de opção/concessão, não 169 profissões diferentes de catálogo.

## Artefatos

- [Profissões e idiomas](../curation/pilot/professions-languages.json): opções com fonte, categoria, faixa, texto, especializações, alfabetização, referências de equipamento e evidência; direitos iniciais, categorias de idiomas e 19 modelos de ganhos condicionais.
- [Relatório](../curation/reports/professions-languages.json): contagens e hashes determinísticos.
- [Contratos e funções de referência](../packages/curation/profession-language-model.ts): elegibilidade por contexto, resolução por faces publicadas, pré-condições de alfabetização e composição de fala/leitura/escrita com histórico.
- [Formalizador](../tools/curation/professions-languages-formalizer.ts), runner `tools/curation/professions-languages.mjs` e [testes](../tests/curation-professions-languages.test.ts).

São sidecars de curadoria. Nenhum pack foi emitido, profissão virou path ou scholarship concedeu acesso a magia por conter a palavra “Magic”. Os IDs locais usam publicação, categoria e resultado publicado, não ordem de leitura; o compilador de CUR-031 ainda precisa emitir as entidades do catálogo. As 35 faixas de evidência mantêm linhas e hashes sem paginação de PDF inventada.

## Categorias e dados por fonte

| Core | Faixas | Only Human | Faixas |
|---|---:|---|---:|
| Academic, d20 | 20 | Scholar: Areas of Scholarship, d20 | 10 |
| Common, d20 | 20 | Common, d20 | 20 |
| Criminal, d20 | 20 | Criminal, d20 | 10 |
| Martial, d20 | 14 | Military, d20 | 10 |
| Religious, d20 | 11 | Religious, **d6** | 6 |
| Wilderness, d20 | 17 | Wilderness, d20 | 10 |
| **Total Core** | **102** | **Total expandido nas tabelas** | **66** |

Core usa d6 de categoria seguido de d20. Only Human usa d6 de categoria seguido de d20, exceto Religious, que usa d6. As funções de referência recebem as faces já obtidas, mantêm as duas etapas e rejeitam faces incompatíveis; não executam RNG.

Os testes percorrem os 120 pares Core e os 106 pares válidos de dados expandidos. **Os 106 pares expandidos não são equiprováveis**: uma linha Religious de uma face tem probabilidade 1/36, enquanto uma linha de uma face em categoria d20 tem 1/120. Não sortear uniformemente entre esses pares ou entre as 66 descrições. Ranges impressos mantêm seus pesos.

Fontes: [anexo Core numerado](../curation/corrections/core-professions-2026-10-27/professions.txt) e [Human Profession Tables](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L14301). Não trocar tabelas entre fontes por semelhança de título.

## Slots e direitos de escolha

- **Core:** dois direitos iniciais, escolhidos manualmente ou por tabelas. A alternativa extra da ancestry Human é um idioma ou uma profissão aleatória, não ambos. A referência identifica a execução manual desse bônus como não demonstrada na fonte; isso não cria teto de conversões idioma/profissão.
- **Expandido:** não acrescentar duas rolagens Core de profissões ao procedimento que as substitui. Os ganhos vêm dos eventos de desenvolvimento. Uma profissão da família só vira profissão do personagem quando um resultado manda herdá-la.
- **Família:** resultados 6–8 permitem Common/Criminal/Military/Wilderness; 9–17 permitem Common/Military/Religious/Wilderness. Resultados sem instrução de categoria produzem diagnóstico de contexto, não um seletor uniforme inventado.
- **Childhood:** preservar fallback common/criminal para o caso órfão explicitamente indicado, a escolha de artisan e as profissões da família. Não estender automaticamente o fallback a todos os resultados de educação.
- **Profissões dirigidas:** diferenciar “uma Common aleatória”, “um campo de scholarship”, “soldier/sailor/pirate” e “uma profissão por vida anterior”. Cada um tem escopo próprio, não é sempre uma rolagem no seletor completo.
- **Trocas:** o aplicativo não impõe teto próprio de trocas idioma/profissão; restrições da mesa estão fora do escopo. Registrar as origens e não duplicar ganhos, sem proibir repetições por uma regra inexistente.

As funções de candidatos rejeitam uma categoria de outra fonte/contexto e preservam diagnósticos quando a instrução não é suficiente. A função não rotula um resultado como personagem completo, não aplica eventos ao demo nem escolhe silenciosamente uma alternativa.

## Especializações e alfabetização

Artisan, Artist, Entertainer, Laborer, Merchant e Musician mantêm escolhas internas e seu texto de exemplos. Não criar uma tabela oficial nova para esses exemplos nem tratar listas exemplificativas como universos fechados.

| Caso | Regra preservada |
|---|---|
| Academic Core | Ler/escrever **um idioma já falado**; não conhecer automaticamente outro idioma. |
| Artist Core | Poet/writer concede leitura/escrita de um idioma conhecido. Painter/sculptor não concede esse benefício pela mesma regra. |
| Religious Core | Devotee, Evangelist, Minister e Acolyte of the New God têm concessões explícitas; não estendê-las a toda a categoria. |
| Artist Only Human | Painter/sculptor disponíveis; poet/writer exige alfabetização prévia e não concede automaticamente a alfabetização Core. |
| Scholar Only Human | Concede um livro relacionado; não importa automaticamente o benefício Academic/Core. |
| Religious Only Human | Concede símbolo da fé e os itens específicos da linha, sem copiar alfabetização de profissões Core homônimas. |

**25 opções Core** contêm a concessão explícita de alfabetização, uma delas condicionada à especialização Artist. Para elegibilidade de poet/writer expandido, leitura e escrita explícitas qualificam; uma capacidade apenas parcial fica como revisão manual, em vez de uma equivalência inventada. O texto preserva o requisito “if you’re literate”, permitindo sua revisão em CUR-021/033.

## Idiomas e modelos de ganho

As seis opções nomeadas são Common Tongue, Dark Speech, Dwarfish, Elvish, High Archaic e Trollish. Secret Language e Dead Languages continuam categorias abertas: é preciso identificar um idioma concreto de organização ou de povo antigo, não um idioma universal com esse nome.

Conforme decisão do usuário, “idioma” sem qualificação concede apenas **fala**. Os eventos tipados registram habilidades `speak`, `read` e `write` separadas, idioma alvo, fonte e evidência. Um alfabeto compartilhado não transfere habilidades. Ganho explícito pode alfabetizar um idioma novo ou acrescentar leitura/escrita a idioma anterior; quando a concessão exige idioma já falado, a função rejeita alvo desconhecido. Concessões repetidas preservam seus eventos e origens, sem duplicar uma habilidade booleana.

Os **19 modelos** cobrem:

- Os sete ramos de Childhood, incluindo fala Common/Elvish, educação Common ou Common/High Archaic alfabetizados, profissão familiar, artisan e scholarship. No ramo de educação superior, aplicar alfabetização antes de verificar a alternativa poet/writer.
- Serviço forçado de Major Setback, com soldier/sailor/pirate vinculados às opções da publicação correta.
- Minor Windfall: idioma, escolha idioma/scholarship, Common aleatória, Entertainer (Orator) se ainda não tiver e Soldier.
- Strange Events: Elvish, **Occult direto**, 1d3 vidas anteriores com uma profissão aleatória por vida e Dwarfish falado/lido/escrito.
- Core Background 13 e 14: idioma falado adicional e **leitura de Common Tongue**, respectivamente. Não acrescentar escrita ao resultado 14 quando o texto só concede leitura.

Occult de Strange Events não consta como uma linha aleatória da tabela expandida Scholar. Foi preservado como concessão direta da fonte Only Human, sem apontar indevidamente para a linha Occult/Core ou inseri-lo no pool aleatório expandido.

## Equipamento e limites da entrega

Todas as 66 opções de tabela Only Human preservam referências de equipamento da fonte. O rodapé de Scholar concede um livro a **cada** resultado, não só à última linha. O símbolo da fé aplica-se às profissões religiosas; a mace da linha Militant é uma concessão separada, sem duplicação. Textos com quebras de linha em “You start with” foram preservados.

As referências vão para CUR-018/020 para decompor quantidades, moedas e alternativas. Não se inventaram preços, requisitos ou efeitos. A política **Item fixo / Incantation de rank 0**, editáveis depois, continua válida; ela não autoriza fundir vários ganhos ou descartar suas quantidades. Conceder uma profissão continua diferente de conceder um path, tradição ou spell.

Quatro encaminhamentos ficam explícitos no JSON: alfabetização parcial para o requisito de Artist; profissão familiar sem categoria/contexto suficiente; resolução dos equipamentos; integração ao consumidor. Essa identificação conclui a formalização CUR-017 sem habilitar geração oficial ou alterar Character/saves.

Os quatro MDs, seus ledgers, os contratos congelados, as entradas captured, os **230 bloqueios**, os **1.320 segmentos em quarentena** e o demo permanecem intactos. As instruções originais de slots, escolhas e riscos continuam vinculadas ao inventário de CUR-016.

## Reproduzir

```powershell
npm run curation:professions-languages
node tools/curation/professions-languages.mjs --check
npm run curation:check
npm test
npm run build
```

O gerador verifica CUR-014/015/016 antes de gravar. `--check` não sobrescreve os artefatos; o runner pode atualizar cache em `tmp/curation/`. O contrato e o avaliador são ferramentas de referência para curadoria, não handlers registrados no criador real.

Próximo passo: **CUR-019 — Interesting Things**.

Gates aprovados em 2026-10-27: **99 testes de curadoria em 16 arquivos**, **173 testes completos em 23 arquivos** e build TypeScript/Vite. Os oito cenários novos passaram também isoladamente, incluindo todos os pares de dados válidos, pré-condições, fonte/slot, capacidades de idioma separadas e adulteração sem sobrescrita. Checks dos insumos, dos 16 arquivos do contrato congelado e de todos os derivados anteriores aprovados, sem alterar o consumidor demonstrativo. Não houve mudança de UI que exigisse E2E adicional.


Atualização posterior: **CUR-018 concluída** como [formalização de riqueza e equipamento inicial](entrega-riqueza-equipamento.md), com 12 kits, 66 concessões de profissões, 19 ganhos adicionais e moeda exata. Próxima tarefa: **CUR-019 — Interesting Things**.
