# Política de distribuição de conteúdo

Status: **consolidada em 2026-10-30**. Política entregue no [PR #12](https://github.com/AntonioVCruz/sotdl-character-forge/pull/12), issue [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2), e aplicada à ponta pelo [PR #17](https://github.com/AntonioVCruz/sotdl-character-forge/pull/17), que concluiu a [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1).

Esta política determina o destino dos arquivos do projeto e o conteúdo permitido em packs e exports. Não concede licença sobre obras nem altera a constituição. O tratamento do histórico antigo permanece separado na [#16](https://github.com/AntonioVCruz/sotdl-character-forge/issues/16).

## Regras vigentes

1. Insumos licenciados, transcrições, excertos extensos, evidências e seus snapshots ficam no ambiente local autorizado. Retirar watermarks não torna texto de livro redistribuível.
2. O Git conserva contratos, registros de fontes, ledgers, decisões e metadados sem dados pessoais ou texto protegido indevido, além de fixtures fictícias e stubs permitidos.
3. Staging e piloto não são packs importáveis. Os diretórios locais atuais não podem ser adicionados com `git add -f`; uma projeção futura só de metadados ou dados estruturados exige auditoria e ajuste explícito do gate.
4. Conteúdo oficial conserva `fictionalData: false`. Nunca marcar como fictício para contornar restrições do demo. Passar no schema não certifica fonte, mecânica, permissão de distribuição ou capacidade do motor.
5. JSON de personagem e exports HTML/PDF podem conter dados do personagem e conteúdo redistribuível. Não podem embutir livros, dumps de curadoria, excertos extensos, watermarks ou dados de compra.

## Destino por classe

| Classe | Git / packs | Exports JSON/HTML/PDF |
|---|---|---|
| `rules/` | Local, ignorado; cada colaborador obtém insumos sob licença própria. | Não embutir o texto dos insumos. |
| `curation/entries/`, `segments/`, `normalized/`, `normalization/` | Diretórios locais e ignorados, incluindo evidências, overlays, diffs e diagnostics. | Não embutir transcrições ou excertos extensos. |
| `curation/corrections/` | Diretório local e ignorado, inclusive manifests associados às transcrições. | Não exportar corpos de texto ou dumps de correção. |
| `curation/history/` | Snapshots locais e ignorados; não confundir com o histórico de objetos Git da #16. | Não exportar snapshots ou dumps sensíveis. |
| `curation/pilot/` | Diretório local e ignorado: os arquivos atuais misturam formalização com evidências extensas. `importablePack: false`. | Não embutir o artefato de curadoria. Dados de personagem dependem de integração própria. |
| `curation/reports/` | Relatórios completos locais e ignorados. Resumos públicos sem conteúdo sensível podem existir em `docs/`. | Não embutir relatórios completos. |
| Contratos, registries, ledgers, decisões e `curation/reconciliation/` | Versionados enquanto contiverem apenas metadados permitidos; sem dados de compra ou corpo de livro. | Metadados permitidos quando necessários ao personagem, sem dumps. |
| `examples/` e `curation/examples/` | Fixtures fictícias, vazias de formato ou redistribuíveis. | Conteúdo fictício/redistribuível permitido. |
| Stubs ancestry-only em `content-packs/`, `needs-review`, `fictionalData: false` | Permitidos no Git; Core e Only Human já integrados pelo [PR #11](https://github.com/AntonioVCruz/sotdl-character-forge/pull/11). | Não representam geração oficial habilitada; não embutir livros. |
| Futuro pack oficial com mecânicas | Somente conteúdo cuja distribuição seja permitida, com fonte, versão, proveniência e auditoria explícitas. | Apenas dados permitidos do personagem; não embutir livro ou evidências extensas. |

## Gates para packs e geração oficial

A política (#2) e a limpeza da ponta (#1) estão entregues. Seus números não devem continuar descritos como bloqueios pendentes. Isso não habilita os packs atuais nem certifica expurgo do histórico.

Os stubs Core e Only Human `0.1.0` continuam ancestry-only, `needs-review` e `fictionalData: false`. Only Human depende exatamente de `sotdl-core-human-l0@0.1.0`: validar o Core primeiro, depois Only Human com Core em `installed`. A UI os apresenta como inelegíveis, com `rulesetEnabled: false`.

Antes de habilitar uma fatia oficial, ainda são necessários:

- Compilação determinística, índices e relatório de cobertura/exclusões da CUR-031; validação cruzada da CUR-032.
- Revisão do conteúdo, da fonte e da distribuição; `curated` requer a evidência e os requisitos do validador, sem promoção de registros bloqueados ou manuais por conveniência.
- Freeze da fatia: versão e hashes estáveis. O `0.1.0` do stub não certifica freeze de conteúdo mecânico.
- Integração de elegibilidade, contratos e handlers efetivamente suportados no runtime, nas CUR-033/034 e tarefas seguintes. Campos extras aceitos pelo schema não equivalem a handlers.
- Aceite da fatia e habilitação explícita do ruleset. A interface demonstrativa permanece identificada como fictícia.

A #16 acompanha histórico e cópias antigas. Sua existência não impede prototipar com fixtures ou stubs permitidos; qualquer publicação que distribua histórico antigo precisa tratar o risco registrado nela.

## Colaboradores, validação e exports

1. Obter os insumos sob licença própria e mantê-los em `rules/`, fora do Git. Complementos e snapshots também exigem acesso autorizado e as revisões previstas nos manifests locais.
2. Executar os geradores no ambiente local completo e verificar os derivados com `npm run curation:check`. Não usar versões redigidas de snapshots como se fossem cópias byte a byte das revisões antigas.
3. Antes de publicar alterações, executar `npm run curation:privacy`. A CI verifica caminhos destinados ao uso local e padrões de compra em strings decodificadas de JSON/JSONL, sem imprimir valores sensíveis. O gate não certifica ausência de toda forma possível de PII nem direitos de distribuição.
4. Em checkout sem livros, executar `npm ci`, `npm run curation:privacy`, `npm test` e `npm run build`. A suíte pública cobre contratos e fixtures; os testes que exigem corpus permanecem locais.
5. Revisar o conteúdo efetivamente embutido em packs e exports. O gate de arquivos rastreados não é um filtro automático de exports de conteúdo importado pelo usuário.
6. Forks e cópias de trabalho devem observar as mesmas regras. A limpeza da ponta não remove objetos antigos de forks, clones ou caches; acompanhar essas cópias pela #16.

## Exceções e rastreabilidade

Exceções exigem decisão do dono do repositório com parecer do Curador, registrada em issue/PR com escopo, motivo, destino e conteúdo permitido. Uma exceção operacional não concede direitos sobre material de terceiros. Projeções públicas futuras não podem reutilizar os diretórios locais atuais sem revisão da política e do gate.

Referências: [entrega da higiene](entrega-higiene-pii-s0.md), [plano do histórico](higiene-historico-git.md), [estado das issues](estado-issues.md), [backlog de curadoria](tarefas-curadoria-compendios.md), CUR-031/032 e CUR-041.
