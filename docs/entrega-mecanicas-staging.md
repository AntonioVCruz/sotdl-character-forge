# CUR-011 — segmentação de regras, equipamentos e criaturas

Entrega de 2026-10-26, retomada após interrupção, conforme `docs/plano-segmentacao-mecanicas.md`. O segmentador processou os **117 blocos cercados** do MD geral e produziu **3.589 segmentos**. Os insumos e os contratos congelados permaneceram intactos. Não houve compilação de packs, interpretação de efeitos, limpeza editorial ou mudança no criador.

## Resultado

| Destino | Quantidade | Significado |
|---|---:|---|
| Staging captured | 1.961 | Candidatos textuais classificados, com transcrição MD preservada; estrutura/mecânica ainda não revisadas. |
| Staging blocked | 230 | Categoria sustentada, mas há pendência explícita de fonte, escopo, dependência ou limites. |
| Quarentena | 1.320 | Tabelas sem contrato tipado, trechos ambíguos/residuais ou duplicatas sem discriminador seguro. |
| Layout preservado | 78 | Separadores de espaços/quebras de linha; não representam entidades. |

O staging contém **1.175 candidatos de procedimentos (`rule`), 555 candidatos de itens e 461 candidatos de criaturas**, incluindo os bloqueados. No sidecar completo há 1.195 candidatos de procedimentos (20 duplicatas sem identidade não entram no staging), 189 transcrições de tabelas e 1.111 trechos sem classificação segura. As contagens são de segmentos/candidatos desta revisão, não de entradas mecânicas completas ou utilizáveis.

A tarefa conclui a implementação/verificação do segmentador e a contabilização dos destinos. Não conclui a revisão semântica dos 1.320 trechos em quarentena ou a curadoria dos candidatos emitidos. A cobertura/revisão por publicação será reconciliada em CUR-013; o primeiro recorte mecânico do Core começa em CUR-014. A emissão de todos os textos como regras para evitar pendências foi deliberadamente impedida.

## Artefatos e reprodução

- `tools/curation/mechanics-extractor.ts`: parser de fonte/seção/cobertura, segmentação, classificação preliminar, evidência e validação.
- `tools/curation/mechanics.mjs`: runner de compilação das ferramentas locais; o conteúdo do MD permanece dado inerte.
- `curation/mechanics-ledger.json`: 3.478 chaves atribuídas uma vez a segmentos distinguíveis, incluindo os que permanecem em quarentena.
- `curation/segments/mechanics.jsonl`: todos os 3.589 segmentos, com texto original, intervalos, fonte(s), contexto, marcas, motivo da classificação, evidência e destino.
- `curation/entries/<source-id-escapado>/{rule,item,creature}.jsonl`: 2.191 objetos validados pelo `StagingEntrySchema`; atribuições pendentes ficam em `_pending`.
- `curation/reports/mechanics.json`: contagens, cobertura, hashes, caminhos de staging e diagnóstico por unidade.

```powershell
npm run curation:mechanics
node tools/curation/mechanics.mjs --check
npm run curation:check
npm test
npm run build
```

`--check` não altera insumos, ledger ou derivados; o runner pode atualizar seu cache de compilação em `tmp/`. `--write` valida todos os objetos antes de gravar. Insumo limitado a 16 MiB; cada objeto de staging, a 4 MiB. `--init-ledger` é exclusivo da primeira atribuição e recusa sobrescrita. Arquivos órfãos são diagnosticados sem exclusão automática.

## Limites e critérios de segmentação

Fontes, subseções e cobertura vêm dos cabeçalhos externos às cercas; cada subseção exige nova fonte explícita. Uma ocorrência de `###` ou `---` dentro do texto não inicia outra publicação. Marcadores de página e rodapés são preservados; não são usados isoladamente como prova de mudança de unidade.

Procedimentos usam cabeçalhos/labels e contexto procedimental explícito. São exemplos reais capturados: Starting Professions, Languages, Rolling Dice e Carrying Limits. Uma regra não pode ser fallback de um capítulo inteiro: candidatos não criaturais com mais de 180 linhas viram fragmentos textuais em quarentena, limitados a 120 linhas e preferindo quebras já existentes. Esses fragmentos não são apresentados como unidades mecânicas fechadas. O limite é uma proteção editorial da ferramenta, não uma regra de SotDL.

Itens de catálogo exigem nome, moeda e disponibilidade reconhecíveis em uma linha ou sequência vertical. O preço e os demais números continuam texto bruto; não são convertidos para moeda ou fórmulas. Linhas de catálogo terminam na disponibilidade, sem absorver o parágrafo seguinte. Descrições são candidatas de item quando seu título coincide com uma linha de catálogo do mesmo bloco; descrição e linha permanecem ocorrências separadas, sem mescla por nome.

Criaturas exigem cabeçalho Difficulty e pelo menos duas linhas de estatísticas próximas. Cabeçalhos de descrição claramente coincidentes podem anteceder o stat block. Traits, Attack Options, Special Attacks e End of the Round permanecem junto às estatísticas; não viram itens ou regras independentes. Nenhuma criatura é convertida em ancestry. Nove candidatos com mais de 180 linhas ficam bloqueados para revisão dos limites, sem truncar seus traits ou ataques. Isso inclui trechos possivelmente contaminados por contexto posterior; o detector não certifica a completude do bestiário.

Tabelas de profissões, riqueza e Interesting Things são preservadas em transcrições de tabela, sem inventar `DiceExpr`, ranges ou resultados. Só a extração e validação específicas das tarefas posteriores podem torná-las `RandomTable`. Cabeçalhos e categorias de coluna também podem produzir contexto de tabela, separado das linhas de itens.

O sidecar conserva candidatos de domínio específicos, todos unreviewed: **36 de veículo, 26 de relíquia e 60 de hazard/ambiente**, baseados em termos literais do nome ou subseção. São atalhos de revisão, não novos kinds, handlers ou relações mecânicas. Um veículo com dados ambíguos não é forçado para creature; um texto sem categoria sustentada permanece em quarentena.

## Fontes, escopo e bloqueios

Marcas BASE, OPCIONAL, REGIONAL, EQUIPAMENTO, CRIATURA e DEPENDÊNCIA OMITIDA vêm da cobertura do bloco, da unidade ou da nota editorial pertinente. Marcas editoriais adicionais (como REGRA) continuam em `rawTags`, sem inserir valores desconhecidos no schema congelado. As marcas não são estendidas a todo o livro ou a outra subseção. REGIONAL sem região formalizada fica blocked com region=null; não se inventa uma região somente pelo título do livro.

Dos 230 objetos bloqueados, os motivos observados incluem **189 escopos regionais não formalizados, 35 dependências omitidas e nove stat blocks longos**. Os motivos podem se sobrepor, portanto sua soma não é o total de objetos. O alias de GIANT RAVEN foi confirmado como Heaven’s Sent. Em 2026-10-27, o usuário também autorizou seu uso independente como monstro, sem associação a Raven Rider; a decisão em `curation/mechanics-decisions.json` resolve esse bloqueio e passa a entrada para captured. A tag original de dependência é preservada como contexto histórico. A revisão mecânica continua unreviewed e a associação com o caminho não foi implementada. Os 31 segmentos de Oddities mantêm sua quarentena. Identidade das fontes: `curation/reports/remaining-source-aliases.json`.

As 14 correções do bloco final preservam as referências a **Demon Lord Errata (19nov17)** e **Demon Lord Errata (10oct17)**. Em 2026-10-27, o usuário determinou a precedência da revisão mais recente: as decisões em `curation/mechanics-decisions.json` selecionam 19nov17 (2017-11-19), posterior a 10oct17 (2017-10-10). As 14 entradas receberam fonte/IDs canônicos e passaram a captured, com as duas referências mantidas no sidecar. O extrator valida a revisão escolhida contra as datas registradas; datas desconhecidas ou empatadas não são resolvidas implicitamente. Os alvos de correção (Core, Godless e Freeport) não substituem a fonte da própria errata; suas páginas não viram página impressa da entidade. Nenhuma correção foi aplicada ao Core ou aos personagens.

Na quarentena, 33 segmentos têm duplicatas indistinguíveis pelos seletores disponíveis; alguns também são tabelas/trechos ambíguos. Eles conservam todas as posições físicas, sem fundir publicações ou criar sufixos arbitrários dependentes da ordem. O ledger associa chaves persistentes aos seletores distinguíveis; hash de texto é guarda de revisão, não parte do ID. Alteração de texto/limite exige revisão explícita do seletor preservando a chave. A revisão do primeiro rascunho, antes do aceite, está em `curation/history/mechanics-initial-draft-2026-10-26/`: 3.291 chaves de segmentos inalterados foram mantidas e as mudanças foram registradas.

## Evidência e cobertura

As **63.791 linhas de payload** pertencem exatamente a um segmento; outras **1.266 linhas** são manifesto, instruções, metadata, cercas, notas editoriais ou auditoria/manutenção. Os intervalos externos também estão contabilizados no relatório, totalizando **65.057 linhas**. Não há sobreposição ou desaparecimento de linhas dentro dos blocos. O texto de cada fragmento/unidade é idêntico ao intervalo do MD, inclusive finais de linha; o hash da evidência normaliza apenas os separadores para LF, conforme CUR-004.

Cada objeto de staging inclui evidência da unidade e do contexto de fonte/seção/cobertura. Página impressa permanece null. Marcadores de página PDF e ranges de cobertura são declarações, nunca páginas inspecionadas; unidades que atravessam marcadores preservam a sequência declarada. Não se calcula offset. Uma referência em fonte não implica PDF disponível, edição conferida ou permissão de distribuição.

Captured indica captura preliminar. Estrutura e mecânica continuam unreviewed, permissão needs-review e automação unsupported. Regras opcionais, regionais e erratas não foram habilitadas. O staging não alimenta automaticamente o criador. A classificação é baseada em sinais e pode exigir correção editorial posterior; esta entrega não transforma a extração imperfeita do MD em conteúdo certificado.

## Validação

Os dez cenários em `tests/curation-mechanics.test.ts` verificam fonte/subseção, fences/CRLF, procedimentos/itens/criaturas, rows verticais, preservação de ataques/traits, tabelas sem AST inventada, escopos isolados, errata conjunta, duplicatas, segmentos longos, todas as evidências/linhas reais, ledger/ordem, determinismo e adulteração sem sobrescrita.

Gates executados e aprovados após a retomada: `npm run curation:check` (dez arquivos / 49 testes), `npm test` (17 arquivos / 123 testes) e `npm run build` (TypeScript e Vite). O build identificou uma inferência ampla demais do tipo de identidade; o tipo foi explicitado e os gates afetados foram reexecutados. Contagens e chaves permaneceram iguais. Os quatro MDs e os 16 arquivos congelados mantiveram seus hashes. Não houve mudança no fluxo de navegador que exigisse novo cenário E2E.

Próxima tarefa: CUR-012 — diagnóstico/limpeza editorial com trilha de alterações. CUR-013 continua responsável pela reconciliação do corpus e destinos/pendências por lote.
