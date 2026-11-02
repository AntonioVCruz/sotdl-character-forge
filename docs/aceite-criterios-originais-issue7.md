# Auditoria e aceite dos critérios originais da #7

Registro de 2026-11-02. Base auditada: `8488b4a899ce6c7229c9598d8860b6d222cd10c6` da `main`, após o PR #32. Auditor e autor deste aceite técnico: **Codex**. Referências: [issue #7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7), sua formulação original preservada abaixo do separador e os três comentários de handoff, revisão e fixture.

**Veredito: aceitos tecnicamente o contrato e os artefatos da fatia S1, no estado draft documentado.** Os nove critérios objetivos foram comprovados; o décimo tem revisão local de conteúdo, PRs do compilador e esta auditoria técnica identificada. Os quatro entregáveis originais estão disponíveis. O aceite não certifica conteúdo integral curado, freeze mecânico, distribuição ou geração oficial.

## Escopo que orientou a auditoria

O objetivo original era definir o contrato do pack Human L0 consumível pelo Engenheiro: schemas, paths, draft/freeze e critérios de aceite do pack. Consumo pleno no gerador, progressão, magia e UI foram explicitamente separados desse objetivo.

O [handoff original](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7#issuecomment-6460617705) permitiu o mínimo de uma ancestry por publicação, com tabelas adiadas conforme a política. A [auditoria histórica do mapa](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7#issuecomment-6460632726) aceitou essa direção com seis ressalvas. A [entrega da fixture](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7#issuecomment-6460657268) registrou o PR #11. Esses comentários são evidência documental; títulos de papéis e autoria da conta GitHub não comprovam revisão independente de pessoas distintas.

A S1 admite draft que passa `parsePack`/`validatePack`, mantém `needs-review` e `fictionalData: false` e permanece desabilitado. A definição de freeze é uma classificação e um gate de evolução, não prova de que o draft já foi promovido. Assim, não foi acrescentada ao aceite original a exigência de terminar o gerador completo ou publicar mecânicas oficiais.

## Matriz dos critérios de aceite do pack

| ID | Critério original, resumido | Resultado | Evidência conferida |
|---|---|---|---|
| A01 | Issue/PR com paths, packId e versão finais | Atendido | PR #11 e `content-packs/README.md`; receitas `curation/human-l0-compilation.json` e `human-l0-mechanical-compilation.json`. IDs fixados: `sotdl-core-human-l0` e `sotdl-only-human-l0`. |
| A02 | `parsePack` e `validatePack` aprovados | Atendido no estado draft | Testes dos stubs reais `0.1.0`; validadores dos conjuntos locais `0.1.1` e `0.2.0`; importação Core → expansão e roundtrip. Avisos de revisão não foram convertidos em aprovação de conteúdo. |
| A03 | `entity.sourceRef === pack.source.id` | Atendido | Stubs versionados e gates da projeção conferem a origem de cada uma das duas ancestries. |
| A04 | `fictionalData === false`, sem `demoSlot`/`demoLevel`/`MAGIC_PATH` | Atendido nos packs reais | Stubs e projeções oficiais mantêm a identificação real; os gates recusam campos incompatíveis. As fixtures sintéticas de teste permanecem separadas. |
| A05 | Fixture manual documentada anterior ao compilador | Atendido | PR #11 mesclado, dois stubs `0.1.0` e `tests/curation-human-l0-pack-stubs.test.ts`. |
| A06 | Compilação determinística da projeção selecionada | Atendido | PR #25 e [entrega de compilação](entrega-compilacao-deterministica-human-l0.md); testes de repetição/ordem, hashes e check dos bytes persistidos. Projeção mecânica local acrescentada no PR #31. |
| A07 | Incluídos e adiados explícitos, com motivo | Atendido no recorte declarado | PR #27 e [relatório](entrega-relatorio-compilacao-human-l0.md): 7 registros, 2 incluídos, 5 excluídos e 11 pendências. O mapa original e os relatórios delimitam tabelas, itens, efeitos e lotes adiados; essas contagens não descrevem todos os livros. |
| A08 | Índice ancestry com referências exatas e gate | Atendido | PR #26, `tools/curation/thematic-indexes.ts` e testes; `compendios/ancestry.index.json` emitido em cada conjunto local, com packId/version/entityId e cobertura completa. |
| A09 | Alinhamento à política #2 ou bloqueio explícito | Atendido para os destinos atuais | Política #2/PR #12 aplicada pelo PR #17. Git conserva stubs permitidos, contratos e metadados; packs mecânicos reais ficam em `tmp/`. Revisão/distribuição e autorização de fonte não foram presumidas. |
| A10 | Curador valida conteúdo; Engenheiro abre PR tools/compiler; Revisor audita | Atividades técnicas comprovadas, com autoria delimitada | Revisão local da base no PR #29, PRs do compilador #25–28/#31 e esta auditoria. A implementação/revisão local e este aceite são do Codex; não há assinatura independente atribuída ao Curador, Engenheiro ou Revisor. Isso não atesta aceite organizacional desses papéis nem revisão integral dos demais lotes. |

O A10 é registrado de forma decomposta: conteúdo-base conferido nos limites do ledger, PRs de implementação existentes e auditoria técnica identificada. A redação original não foi usada para inventar uma assinatura externa nem para transformar teste/merge em parecer de terceiros. O aceite aqui emitido é técnico e restrito à entrega verificável.

## Quatro entregáveis originais

| ID | Entregável | Disposição |
|---|---|---|
| E01 | Contrato com shape, paths, draft/freeze e aceite | Entregue na #7 e nos contratos documentados. O contrato congelado de curadoria continua `1.0.0`; o payload mecânico possui identificador/versionamento próprios, sem substituir o congelamento anterior. |
| E02 | Fixture mínima não fictícia permitida | Entregue pelos dois stubs `0.1.0`, `needs-review`/`fictionalData: false`, sem texto de livro e sem habilitação. Não se confunde com a fixture sintética do contrato mecânico. |
| E03 | Mapa piloto → campos de entidade e sidecars | Entregue no handoff original. As projeções `0.1.1` e `0.2.0` tornam explícitos os campos efetivamente emitidos; fórmulas/tabelas não suportadas e evidências extensas não entram no stub. |
| E04 | Mapa disponível ao Engenheiro no comentário de handoff | Confirmado pelo comentário `6460617705`, acessível e vinculado acima. |

## Disposição das seis ressalvas históricas

| Ressalva do mapa | Estado comprovado |
|---|---|
| Fonte real não pode ter `status: fictional` | Resolvida nos stubs/projeções: `fictionalData: false` e fonte `needs-review`. |
| Evitar texto de livro em outcomes | Resolvida para a fatia pública: ancestry-only; tabelas e dados mecânicos reais não foram publicados no Git. A autorização de distribuição futura permanece pendente. |
| Validar Core antes de Only Human com dependência instalada | Resolvida no gate integrado e nos testes, com dependência exata em cada versão. |
| Fixar packIds no PR da fixture | Resolvida no PR #11 e preservada nas receitas posteriores. |
| Não incluir novice path no L0 | Preservada; runtime Human restrito ao nível 0, S2/L1 na #21. |
| Não habilitar draft no ruleset | Preservada; snapshots de validação sem packs ativos e prévia local com geração oficial falsa. A condição não foi tratada como autorização de habilitação. |

## Versões, destinos e hashes conferidos

| Camada | Versão e destino | Estado aceito |
|---|---|---|
| Fixture pública | `0.1.0`, `content-packs/<source-id-escapado>/0.1.0/pack.json` | Dois stubs ancestry-only, permitidos no Git, sem mudança nesta auditoria. |
| Compilação de metadados | `0.1.1`, `tmp/curation/compiled-human-l0/` | Dois packs, índice e relatório, somente locais; conjunto SHA256 `f9e3f7b4064c04f0a093aae8cbf55df0da1c30f132ea7ec14260c503ee2e10b1`. |
| Projeção mecânica da base | `0.2.0`, `tmp/curation/compiled-human-l0-mechanics/` | Dois packs, índice e relatório locais; conjunto SHA256 `24a39a0c7449a8b426cf3cbc6d9a5bb81392b75204733d6777ead205b3547587`. |
| Motor acrescentado posteriormente | `packages/character-generator/runtime.ts` e [aceite local](entrega-motor-human-l0.md) | Seis combinações da base e reabertura conferidas. É avanço adicional ao contrato original; não é gerador completo habilitado. |

Os hashes de conjunto incluem relatórios de proveniência dos bytes locais. Mudanças de insumos ou finais de linha podem mudar o relatório, exigindo nova conferência; isso não autoriza sobrescrever um pack imutável nem equivale a freeze mecânico publicado.

## Validação desta auditoria

- **114 testes direcionados, em 8 arquivos**, aprovados: stubs, compilador, índices, relatório, gate integrado, contrato mecânico, projetor mecânico e runtime Human.
- `npm run curation:validate` e `npm run curation:validate:mechanical` aprovados, sem regeneração dos artefatos.
- `npm run curation:accept:runtime` aprovado nas seis combinações, com paridade da referência e reabertura JSON.
- `node tools/curation/freeze.mjs --check`: 16 arquivos congelados íntegros.
- `npm run curation:privacy`: nenhum achado nos arquivos rastreados antes da inclusão deste registro.

Os 370 testes completos, cinco testes de navegador e build do PR #32 são evidência anterior vinculada à base auditada, não execuções repetidas nesta auditoria documental. Não foram criados testes nem alterados código, packs, ledgers de revisão anteriores ou contratos congelados.

## Disposição administrativa e pendências

O aceite técnico do contrato, da fixture e da fatia draft S1 fica registrado, com as atividades do A10 verificadas sob autoria do Codex. Não se atribui parecer organizacional aos papéis citados. A redação original não exige explicitamente revisão por pessoas independentes; esta auditoria não cria esse novo bloqueio. Permanecem pendentes a entrega completa dos procedimentos/itens/tabelas, interface real, revisão ampliada de fonte/distribuição, PDF, freeze e habilitação oficial. Essas pendências não anulam os artefatos técnicos aceitos e não foram retroativamente adicionadas como exigência de um gerador completo na S1.

A #7 continua aberta após esta atividade: o pedido executado foi auditar e registrar o aceite. A organização do trabalho restante em issues próprias e a decisão de encerramento não foram efetuadas nesta auditoria. #9/#10 permanecem encerradas no escopo S1, #21 acompanha S2/L1 e #16 acompanha o histórico/cópias antigas.

Atualização posterior: a [transferência das pendências ampliadas](transferencia-escopo-issue7.md) foi executada em atividade separada, nas issues #34–#37. O parágrafo acima descreve a disposição no momento desta auditoria; seu aceite e a autoria permanecem preservados. A #7 continua aberta para decisão de encerramento.
