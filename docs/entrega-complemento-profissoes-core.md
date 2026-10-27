# Complemento de profissões — Core

Texto fornecido pelo usuário em 2026-10-27. Anexo `Pasted text.txt` preservado byte a byte em [professions.txt](../curation/corrections/core-professions-2026-10-27/professions.txt), com origem e hashes no [manifesto](../curation/corrections/core-professions-2026-10-27/manifest.json). SHA-256: `4609a3f4a51c5bc1fa77af9db00a757adc381d78301c2adb85661a53f421c150`.

O complemento recupera números e intervalos que faltavam no MD original, além das regras de escolha, idiomas, uso e substituição de profissões. Não foi atribuído número de página ou certificado acesso ao PDF.

## Cobertura numérica recuperada

| d6 | Categoria | Dado seguinte | Faixas de resultado |
|---|---|---|---:|
| 1 | Academic | d20 | 20 |
| 2 | Common | d20 | 20 |
| 3 | Criminal | d20 | 20 |
| 4 | Martial | d20 | 14 |
| 5 | Religious | d20 | 11 |
| 6 | Wilderness | d20 | 17 |

As **102 faixas** cobrem exatamente os **120 pares de faces d6→d20**, sem lacunas ou sobreposições. Cada par tem a mesma probabilidade; as descrições agregadas não têm necessariamente o mesmo peso. Guard cobre 3–4 na tabela Martial e Peasant conscript cobre 13–15, por exemplo. Não selecionar uniformemente uma das 102 descrições.

`professionScope` na [matriz do piloto](../curation/pilot/core-level-zero.json) registra categorias, dados, intervalos e texto de cada resultado. A ferramenta transcreve marcadores numéricos explícitos da revisão fornecida, incluindo linhas quebradas e colunas intercaladas, e rejeita gaps/overlaps. Não interpreta essas descrições como código ou concede automaticamente habilidades.

## Instruções preservadas

- Duas profissões iniciais, escolhidas livremente ou determinadas por d6→d20. A profissão adicional de Human continua sendo um ganho separado, descrito como aleatório pela ancestry.
- Trocar uma profissão por fala de outro idioma ou leitura de idioma já falado; fala, leitura e escrita continuam distintas.
- Academic concede leitura/escrita de um idioma já falado. Artist concede leitura/escrita quando a escolha é poet ou writer; resultados religiosos específicos também concedem alfabetização.
- Artisan, Artist, Entertainer, Laborer, Merchant e Musician exigem escolhas internas; exemplos não são novas linhas aleatórias nem listas necessariamente fechadas.
- Substituir uma profissão envolve conversa com GM. Sucesso automático ou boons no uso da profissão são adjudicados em contexto, sem bônus permanente inventado.

O texto reafirma a troca por idioma/leitura. Posteriormente, o usuário esclareceu que o aplicativo não deve impor limites próprios de trocas entre profissão e idioma; restrições da mesa estão fora do escopo. A antiga pendência sobre múltiplas trocas/profissão extra Human foi encerrada sem criar teto numérico, exigência de aprovação ou bloqueio específico. As origens de cada concessão/troca continuam rastreadas, sem duplicar os ganhos iniciais.

Também ficou definido que **idioma sem outra indicação concede apenas fala**. Leitura/escrita requerem benefício explícito: uma opção pode conceder idioma novo alfabetizado ou alfabetização em um idioma anterior. Não se concede alfabetização simplesmente por compartilhar alfabeto. Essas decisões estão em [creation-decisions.json](../curation/pilot/creation-decisions.json), sob `languages`, e na matriz em `languageScope.acquisition`; CUR-017 deve formalizar ganhos com destino e origem separados, sem estabelecer teto próprio.

## Estado da curadoria

A matriz mantém **28 passos**, com **65 faixas de evidência**: 46 do corpus original e 19 de cinco textos suplementares. A recuperação das tabelas reduziu os passos com pendências de seis para quatro; o esclarecimento de idiomas/trocas reduziu o total para **três**: opções dos kits, Interesting Things e seus efeitos/dependências.

Essa atualização resolve a numeração de profissões na análise de CUR-014; não conclui CUR-016/017/021. A emissão de tabelas importáveis, profissões elegíveis, alfabetização e escolhas internas segue nesses lotes. A geração oficial continua desabilitada.

Os quatro MDs originais, o manifesto de insumos, os ledgers, os IDs já atribuídos, os **230 bloqueios** e os **1.320 segmentos em quarentena** permanecem. A evidência suplementar não é apresentada como se já integrasse o inventário de CUR-013. Snapshot anterior em `curation/history/core-professions-supplement-2026-10-27/`.

Próxima tarefa do backlog: **CUR-015**.

Validação aprovada: `npm run curation:check` (74 testes), `npm test` (148 testes) e `npm run build`. Os testes enumeram os 120 pares d6→d20, preservam intervalos com pesos diferentes, escolhas internas e alfabetização textual, e rejeitam gaps/overlaps. Hash da cópia conferido contra o anexo original.

Atualização posterior: as tabelas de Interesting Things também foram fornecidas. A matriz atual contém 73 faixas e dois passos com pendências de formalização; os números anteriores descrevem esta revisão de profissões/idiomas. Veja [complemento de Interesting Things](entrega-complemento-interesting-things-core.md).
