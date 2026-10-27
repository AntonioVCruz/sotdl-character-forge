# Execução sequencial - Etapa A

Revisão: 2026-10-26. Escopo: CUR-001 a CUR-007, na ordem solicitada. Os MDs originais são insumos de leitura; esta etapa não produz conteúdo mecânico curado ou packs de regras reais para uso automático.

## CUR-001 - concluída
Reconhecimento revalidado: quatro arquivos Markdown em `rules/`, legíveis como UTF-8, com títulos e estruturas compatíveis com o inventário do backlog. Medidas: 5.766.923 bytes e 151.707 linhas. Nenhum arquivo original foi modificado. Contagens declaradas de entradas/fontes ainda exigem reconciliação na tarefa correspondente.

Gate: inventário existente conferido e amostras estruturais já documentadas em `docs/tarefas-curadoria-compendios.md`. Próxima tarefa liberada: CUR-002.

## CUR-002 - concluída
Manifesto `curation/input-manifest.json` gerado com revisão explícita, hash do próprio extrator, SHA-256 dos bytes, encoding UTF-8 estrito, BOM, contagem de linhas e finais de linha. Regeneração usa os mesmos bytes e data, sem timestamps do host.

Gate executado: `node tools/curation/inputs.mjs --check` confirma quatro arquivos/extrator idênticos; dois testes verificam reprodução, bytes alterados, arquivos adicionados/removidos, BOM e encoding inválido. Nenhum MD foi alterado. Próxima tarefa liberada: CUR-003.

## CUR-003 - concluída
Registro reproduzível em `curation/sources.json`: 95 linhas do manifesto = 95 publicações, sendo Core, suplementos e duas erratas datadas independentes. Identificadas 2.395 referências explícitas (2.073 metadados; demais declarações/listas), fora de cercas de código. Cada referência guarda arquivo/hash/linha, rótulo original e paginação declarada separada. Não são contagens de entidades mecânicas.

2.336 referências resolvidas por normalização estritamente editorial (marcação, extensão PDF, caixa, apóstrofo tipográfico). Outras 59, de cinco grafias, têm pendência explícita e candidato em `source-aliases.json`, sem fusão automática. Edição desconhecida permanece `null/unconfirmed`; revisão datada é preservada. PDFs citados nos MDs não estão fornecidos em `rules/`; paginação e alegações de auditoria permanecem declaradas, sem certificação. Essa incerteza é um resultado do registro, não uma omissão.

Gate: geração/check byte a byte e dois testes aprovados (isolamento de exemplos, páginas distintas, revisões distintas, contabilidade completa e determinismo). Próxima tarefa liberada: CUR-004.

## CUR-004 - concluída
Modelo estrito de evidência e revisão em `packages/curation/evidence.ts`, com documentação em `docs/curadoria-evidencia.md`. Eixos independentes de permissão, transcrição, estrutura, mecânica e automação, cada um com responsável, motivo e evidências. Amostra persistida em `curation/review-example.json` confere somente três linhas de metadados MD (Arachne, página declarada 15); não aprova a ancestry.

Gate: dois testes aprovados, incluindo comparação do exemplo com bytes/trecho atuais, rejeição de certificação PDF baseada somente no MD, referência de evidência inexistente e automação sem mecânica/handler/testes. Próxima tarefa liberada: CUR-005.

## CUR-005 - concluída
Política e gerador de IDs publicados em `docs/curadoria-identidade.md` e `packages/curation/identity.ts`. Chaves estáveis por fonte/edição, categoria, entrada e variante; aliases não mudam a identidade. Grupos de equivalência e linhagem exigem evidência e nunca fundem ocorrências. O protocolo de reimpressão do MD geral passa a gerar staging `reference-only`, sem fabricar transcrição/página da republicação; os outros MDs mantêm ocorrências integrais por publicação.

Gate: dois testes aprovados para distinção de fontes/revisões/categorias/variantes, independência de ordem e limites do catálogo. O ledger de entradas será preenchido na extração, sem antecipar CUR-008. Próxima tarefa liberada: CUR-006.

## CUR-006 - concluída
Conferida a declaração de precedência nas linhas 7, 145–146 e 64991 do MD geral: 19nov17 prevalece somente nas correções repetidas com 10oct17. A seção cita ambos os PDFs juntos e omite ancestries/paths/spells; não há prova suficiente para atribuir cada correção ou executar substituição. `curation/source-policy.json` registra três relações declaradas, todas desligadas, com sete âncoras MD verificáveis. Política em `docs/curadoria-fontes-erratas.md`; seleção exata de revisão validada por `chooseRevision` sem alterar o ruleset do aplicativo.

Durante a conferência, o cabeçalho plural `Fontes` revelou duas referências adicionais. Antes de fechar este gate, CUR-003 foi revalidada: registro regenerado/check aprovado e seus dois testes passaram incluindo o formato plural. Contagem final: **2.397 referências, 2.075 de metadados, 2.338 resolvidas e 59 pendentes**; as contagens anteriores acima registram o levantamento inicial. Nenhuma fonte ou revisão foi fundida.

Gate: geração/check da política e dois testes aprovados para hashes/trechos reais, relações desabilitadas e escolha explícita (inclusive versão ausente/ambígua). Próxima tarefa liberada: CUR-007.

## CUR-007 - concluída
Congelados contratos de staging, revisão, identidade/linhagem, fontes/manifesto, política de errata, índices e seleção do ruleset. `curation/contracts.json` registra versão 1.0.0 e hashes de 16 arquivos; `docs/contratos-curadoria.md` especifica campos, limites, pastas, serialização determinística e migrações. Staging e sidecars estritos não entram na raiz dos packs. Exemplos isolados: um pack real vazio, um pack fictício com entidade, staging fictício, índice e seleção explícita do ruleset.

Gate executado: `npm run curation:check` passou (seis arquivos / 15 testes de curadoria, checks de quatro insumos, registro de fontes, evidências da política, exemplos determinísticos e contratos congelados). Os dois exemplos de pack passam em `parsePack`/`validatePack` sem erros; aviso de revisão do fictício é esperado. Testes rejeitam sidecars na raiz, identidade incorreta, texto fabricado em reference-only, fonte pendente promovida, índice duplicado e override com errata não verificada. `npm test`: 13 arquivos / 89 testes aprovados. `npm run build`: TypeScript e Vite aprovados. Não houve mudança de UI/fluxo do criador; os gates desta etapa são de dados/CLI, sem novo cenário de navegador.

## Resultado e pendências preservadas

- CUR-001 → CUR-007 encerradas com validação antes da progressão; a descoberta do cabeçalho plural foi corrigida e o gate CUR-003 reexecutado antes de encerrar CUR-006.
- Quatro MDs originais intactos, identificados pelos mesmos SHA-256 do início. 95 fontes reconciliadas; 2.397 referências explícitas contabilizadas, 59 pendentes em cinco grafias alternativas com candidatos identificados.
- Edições/páginas e autoria da transcrição permanecem não certificadas; não foram fornecidos PDFs em `rules/`. Esses estados não foram promovidos para authorized/curated. As declarações de auditoria dos insumos continuam declarações.
- Relações de errata documentadas, desabilitadas e pendentes de comparação por correção. Nenhuma substituição ou regra opcional/regional foi aplicada.
- Contratos prontos para extração; ainda não há conteúdo mecânico real curado, pack real utilizável ou adaptação do consumidor. Nenhuma tarefa da Etapa B foi marcada como concluída.

Próximo passo: CUR-008 — extrator de ancestries, preservando limites, texto e evidências de cada ocorrência. Pendências de alias/edição bloqueiam a compilação da entrada afetada, não o trabalho de extração das demais fontes.

## Atualização posterior — alias confirmado pelo usuário

Em 2026-10-26, após CUR-008/009, o usuário confirmou explicitamente o título **The Hunger in the Void** para o rótulo `Hunger in the Void`. A decisão está em `curation/source-aliases.json` e sua auditoria em `curation/reports/source-alias-hunger-in-the-void.json`. As contagens anteriores deste relatório descrevem o gate original da Etapa A. Estado atual do registro: 2.397 referências, 2.375 resolvidas e 22 pendentes de quatro outras grafias; 37 referências foram resolvidas por esse alias.

Bugbear, Fomor, Incarnation e Warg passaram a captured com IDs da fonte canônica; o mesmo ocorreu com Priest of the Demon Lord. Ancestries: 59 captured, zero blocked. Paths: 390 captured, duas blocked por conflitos estruturais independentes (Seer/Troll Hunter). Históricos anteriores foram arquivados em `curation/history/source-alias-hunger-in-the-void-2026-10-26/`; textos, MDs, chaves do ledger e contratos congelados permaneceram intactos. A confirmação resolve somente a identidade da publicação.

Revalidação aprovada: `npm run curation:check` (30 testes), `npm test` (104 testes) e `npm run build`. O próximo trabalho do backlog é CUR-010.

## Atualização posterior — correções de Seer e Troll Hunter

O usuário instruiu remover somente o cabeçalho `Level 6 Juggernaut` em Seer e forneceu a substituição integral do Full Entry de Troll Hunter. As correções foram aplicadas ao MD de paths; sua revisão anterior, manifesto, registro de fontes e relatórios foram arquivados em `curation/history/paths-seer-troll-hunter-2026-10-26/`. Trilha em `curation/reports/paths-seer-troll-hunter-correction.json`, com hashes antes/depois e texto fornecido preservado em `curation/corrections/`.

O manifesto e o registro de fontes foram regenerados, assim como os relatórios/stagings dependentes. Revisão atual do MD: 1.211.954 bytes / 29.614 linhas; os outros três MDs e os contratos congelados mantêm seus hashes. IDs de ambas as entradas preservados. Estado atual: 59 ancestries captured e 392 paths captured, nenhum bloqueio de extração; mecânica continua não revisada. Revalidação: 30 testes de curadoria, 104 testes na suíte completa e build aprovados. CUR-010 permanece como próximo trabalho.

## Atualização posterior à CUR-010 — Do We Not Die? e duas spells

O usuário confirmou o título canônico **Do We Not Die?** e forneceu novos textos de **ANIMATE OBJECT** e **SHADOW FORM**. O alias foi resolvido, os corpos substituídos pelos textos fornecidos e a revisão anterior arquivada em `curation/history/spells-do-we-not-die-2026-10-26/`. Auditoria, hashes e 13 atribuições de identidade em `curation/reports/spells-do-we-not-die-correction.json`; os textos fornecidos estão em `curation/corrections/`.

Manifesto, registro e três stagings dependentes foram regenerados. As 13 spells da fonte canônica preservam o texto original; os dois textos corrigidos mantêm seus IDs. O MD de spells passa a 1.081.266 bytes / 33.582 linhas. Estado atual: 59 ancestries, 392 paths e 1.520 spells captured, sem bloqueios de extração; seis referências a outras três grafias seguem pendentes no registro de fontes. Nenhuma revisão mecânica ou inspeção de PDF foi certificada por essa correção.

Gates aprovados: `npm run curation:check` (39 testes), `npm test` (113 testes) e `npm run build`. Os contratos congelados mantêm seus hashes. Próxima tarefa: CUR-011.

## Atualização posterior à CUR-013 — demais grafias confirmadas

Em 2026-10-27, o usuário confirmou as três opções candidatas: **The Disciple of the Demon Lord**, **Oddities, Artifacts, and Esoterica** e **Heaven’s Sent**. As seis referências antes pendentes foram resolvidas; o registro agora contém **2.397 referências resolvidas e nenhuma pendência de alias**. As contagens das atualizações anteriores são históricas.

Registro, extrações, normalização e reconciliação foram regenerados. Os quatro MDs brutos, seus ledgers e os contratos congelados foram preservados. Auditoria em `curation/reports/remaining-source-aliases.json`; revisão anterior em `curation/history/remaining-source-aliases-2026-10-27/`. GIANT RAVEN recebeu sua identidade canônica, mas permanece bloqueado por dependência omitida. Os 31 segmentos de Oddities mantêm sua quarentena. A confirmação dos títulos não certifica edição, PDF ou mecânica.

Revalidação aprovada: `npm run curation:check` (65 testes), `npm test` (139 testes) e `npm run build`.

## Decisão posterior — Giant Raven independente

Em 2026-10-27, o usuário autorizou Giant Raven como monstro quando não associado a Raven Rider. A decisão versionada em `curation/mechanics-decisions.json` é vinculada à chave, fonte, nome e hash exatos da ficha; uma mudança nesses dados exige nova revisão. A dependência omitida deixa de bloquear apenas esse uso independente. Texto, ID, tag editorial original e revisão mecânica unreviewed são preservados; não há implementação do caminho Raven Rider.

Revisão anterior preservada em `curation/history/giant-raven-independent-2026-10-27/`. Segmentação nessa revisão: 1.947 captured, 244 blocked, 1.320 em quarentena e 78 de layout. Gates aprovados: 66 testes de curadoria, 140 testes completos e build.

## Decisão posterior — precedência da atribuição mais recente

Em 2026-10-27, o usuário determinou que, em atribuições conjuntas, prevalece a mais recente. As 14 correções conjuntas foram atribuídas a Demon Lord Errata (19nov17), de 2017-11-19, com precedência sobre Demon Lord Errata (10oct17), de 2017-10-10. Decisões por chave/fonte/hash em `curation/mechanics-decisions.json`; as datas são verificadas pelo extrator e as duas referências permanecem como evidência. Os textos, os ledgers e os IDs previamente atribuídos não mudaram. Os 14 registros receberam seus IDs canônicos e passaram a captured; nenhuma correção foi aplicada automaticamente ao Core ou aos personagens.

Histórico em `curation/history/latest-errata-2026-10-27/`. Segmentação atual: 1.961 captured, 230 blocked, 1.320 em quarentena e 78 de layout. Lista atualizada em `docs/entradas-bloqueadas-curadoria.md`. Gates aprovados: 67 testes de curadoria, 141 testes completos e build.
