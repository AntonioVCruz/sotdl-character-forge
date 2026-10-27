# CUR-010 — spells extraídas para staging

Entrega de 2026-10-26, conforme `docs/plano-extracao-spells.md`. Foram extraídas **1.520 ocorrências de publicação**, organizadas em **57 origens**. Após confirmação do título Do We Not Die? e substituição dos dois textos indicados pelo usuário, o resultado é **1.520 captured e zero blocked**. A revisão anterior do MD e derivados foi arquivada; os contratos congelados foram preservados. Não houve compilação de packs reais, aprovação mecânica ou alteração do criador.

## Artefatos

- `tools/curation/spell-extractor.ts`: parser, captura de evidência, resolução de fontes, diagnósticos e geração determinística.
- `tools/curation/spells.mjs`: runner que compila a ferramenta local para `tmp/curation/`, sem executar conteúdo dos livros.
- `curation/spell-origins.json`: classificação explícita dos 57 agrupamentos desta revisão (44 traditions e 13 paths), com responsável e justificativas; não contém regras de elegibilidade.
- `curation/spell-ledger.json`: 1.520 chaves persistentes por publicação, nome, origem e rank. Cabeçalho corrigido exige atualizar o seletor explicitamente, preservando a chave.
- `curation/entries/<source-id-escapado>/spell.jsonl`: 1.520 ocorrências capturadas com fonte resolvida.
- `curation/history/spells-do-we-not-die-2026-10-26/spell.before.jsonl`: as 13 ocorrências anteriormente pendentes preservadas no histórico.
- `curation/reports/spells.json`: hashes de insumo, manifesto, registro, ferramenta/utilitário, ledger, classificação, evidência de paths e saídas; contagens, limites, metadados e diagnósticos por ocorrência.

O parser segue cabeçalhos fora de cercas: agrupamento `##`, rank `### Rank N`, nome `####`, metadados e Full Entry. Rank é reiniciado em cada origem. Cabeçalhos parecidos dentro do texto não criam registros. Uma republicação que reinicie metadados sem repetir nome tem intervalo e evidência de nome herdado próprios. Nenhuma ocorrência real desta revisão precisou desse recurso, que é coberto por fixture. Metadados duplicados, origem não registrada, rank inválido/ausente, blocos vazios/abertos ou colisão de ledger impedem a gravação.

## Origem, rank, tipo e identidade

As origens de paths são **Blighter, Diabolist, Exorcist, Magician, Necromancer, Priest, Shaman, Spellbinder, Technomancer, Templar, Tenebrist, Warden e Witch**. Elas não viram tradições. O sidecar vincula os nomes a ocorrências de CUR-009, preferindo a mesma publicação e registrando fonte/ID do path. `CONSECRATE`, de *Uncertain Faith*, mantém a origem Priest com candidatos de paths publicados em outros livros e aviso de vínculo entre publicações não revisado; não é exigido que uma spell nova e o path tenham sido publicados na mesma obra. Esse vínculo de contexto não certifica dependência, acesso ou aprendizado.

Os demais 44 agrupamentos foram registrados como tradições desta revisão. Novos agrupamentos requerem classificação explícita, sem default silencioso na execução normal. O schema também admite origens ancestry/other/unresolved para futuras fontes; nenhuma foi observada neste corpus.

ID distingue publicação, nome e variante de origem/rank. `HEAT WAVE` em *Occult Philosophy* e *Tombs of the Desolation* conserva duas ocorrências; `SPELLBOUND WEAPON` em *Paths of Power* e Core também. Nomes e texto permanecem em inglês, sem tradução ou reconciliação entre versões. Existem ranks 0–10 nesta revisão, mas não foi criado um limite mecânico universal por inferência.

Type declarado: **629 Attack** e **891 Utility**. O extrator preserva outras classificações explícitas se aparecerem, e usa null com aviso se Type estiver ausente; dano não implica Attack. Páginas impressas são declarações por ocorrência; não há PDF Page declarado neste MD, portanto esse campo fica null. Não se estima offset ou página física.

Requirements, Target, Area, Range, Duration, Effect, Attack Roll 20+, Triggered, Sacrifice, Permanence e Aftereffect são marcadores opcionais de localização. O relatório registra somente a linha e seu texto, sem atribuir todo o parágrafo seguinte a um campo por suposição. A ausência desses títulos não impede a captura nem cria campos inventados. Full Entry conserva todos os efeitos, listas, tabelas, opções e stat blocks presentes, inclusive quando não têm cabeçalhos padronizados.

## Correções, bloqueios resolvidos e divergências

| Ocorrências | Correção confirmada pelo usuário |
|---|---|
| 13 spells da fonte `Do We Not Die` | Alias confirmado explicitamente para o título canônico **Do We Not Die?**, sourceId `sotdl:do-we-not-die`. |
| ANIMATE OBJECT — Technomancer, Core p. 96 | Full Entry substituído pelo texto fornecido, incluindo seu cabeçalho; removida a mistura com Templar. |
| SHADOW FORM — Tenebrist, Core p. 97 | Full Entry substituído pelo texto fornecido, incluindo seu cabeçalho e os três benefícios; removida a mistura com Thaumaturge. |

As 13 spells desbloqueadas são: VENOMOUS DART, BOLSTER HEALTH, CURSE OF THE EMERALD HAND, UNDO CONSTITUTION, SENSE PERIL, SERPENT TONGUE, SPECTACULAR EXPULSION, POISON IVY, VENOMOUS FANGS, SICKENING RUNE, ASSASSIN SPIDER, VENOMOUS SHAPE e CONTAMINATE WATER. Elas receberam IDs da fonte canônica sem alterar texto original ou chaves do ledger. O rótulo antigo continua preservado como evidência da transcrição.

As duas misturas estruturais foram corrigidas por instrução expressa, mantendo os IDs. Os textos fornecidos estão em `curation/corrections/spells-do-we-not-die-2026-10-26/`; a revisão anterior do MD, aliases, manifesto, fontes e relatórios, em `curation/history/spells-do-we-not-die-2026-10-26/`. A trilha `curation/reports/spells-do-we-not-die-correction.json` registra hashes antes/depois e as 13 atribuições de identidade. Os testes conferem igualdade dos corpos com os textos fornecidos e continuam verificando o bloqueio das misturas na revisão histórica. Manifesto, registro e todos os stagings dependentes foram regenerados. O detector de assinaturas continua parcial, sem certificar ausência de qualquer outro problema mecânico.

O resumo do insumo declara 1.520 spells / 57 origens / 27 fontes. As duas primeiras contagens foram confirmadas; os metadados observados contêm **28 rótulos distintos de publicação**, incluindo *Paths of Power*. A diferença fica explícita no relatório, sem excluir uma fonte para fazer a contagem coincidir. Reconciliar a cobertura do corpus inteiro continua sendo CUR-013.

Cobertura da revisão corrigida: **33.582 linhas** no insumo; **32.317 linhas** pertencem às ocorrências e **1.265** a preâmbulo/cabeçalhos de origem/rank/separadores, com intervalos explícitos. `originalText` guarda os bytes textuais de cada ocorrência e seus finais de linha; as evidências guardam linhas inclusivas, SHA-256 do input e do trecho com LF. A concatenação dos intervalos recompõe o arquivo completo, sem sobreposição. As únicas alterações ao MD foram as duas substituições autorizadas, sem limpeza editorial adicional.

Transcrição fica md-checked; estrutura das entradas sem diagnóstico e mecânica continuam unreviewed, permissão needs-review, automação unsupported. Captured não equivale a curated, elegível ou automatizada; nenhuma alegação herdada de auditoria vira certificação de PDF.

## Reprodução e gates

```powershell
npm run curation:spells
node tools/curation/spells.mjs --check
npm run curation:check
npm test
npm run build
```

Todas as linhas passam em `StagingEntrySchema` antes da gravação; os campos específicos de spell ficam no sidecar, sem alterar a raiz estrita congelada. Limites da ferramenta: insumo de 16 MiB e registro JSONL de 4 MiB. `--check` não altera insumos/ledger/derivados; o runner pode atualizar cache em `tmp/`. Evidência de CUR-009 e sua revisão precisam corresponder ao manifesto/registro atuais. Arquivos de spell órfãos são diagnosticados sem exclusão automática.

`--init-ledger` serve exclusivamente à primeira atribuição e recusa sobrescrever ledger ou classificação de origens. Futuras correções devem preservar chaves e registrar a revisão. Os nove cenários em `tests/curation-spells.test.ts` cobrem herança/reset, fences/CRLF, metadados ausentes/duplicados, headers opcionais, identidade/publicações, bloqueios, todas as evidências/bytes, estabilidade do ledger, determinismo e adulteração de insumo/saída/evidência de paths sem sobrescrita.

Gates da entrega original: `npm run curation:check` (nove arquivos / 39 testes, incluindo checks de todos os extratores), `npm test` (16 arquivos / 113 testes) e `npm run build` (TypeScript e Vite). Após as correções autorizadas, os hashes do MD de spells e dos derivados foram atualizados com a revisão anterior arquivada; os outros três MDs e os 16 arquivos congelados mantêm seus hashes. A revalidação das correções é registrada no backlog. Nenhum cenário de navegador foi acrescentado: esta tarefa não altera o fluxo do criador.

Revalidação das correções aprovada: 39 testes de curadoria, 113 testes na suíte completa e build. Os testes também continuam detectando os dois trechos contaminados na revisão histórica, sem enfraquecer o detector para liberar as entradas corrigidas.

Próxima tarefa: CUR-011 — segmentador de regras/equipamentos/criaturas. A formalização e integração mecânica de spells permanecem nas etapas posteriores.
