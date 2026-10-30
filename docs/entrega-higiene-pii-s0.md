# S0 — limpeza da ponta e proteção dos geradores

Entrega de 2026-10-30 para a issue #1. O tratamento dos objetos antigos fica em [higiene-historico-git.md](higiene-historico-git.md), como trabalho separado na [issue #16](https://github.com/AntonioVCruz/sotdl-character-forge/issues/16).

## Alteração

Os extratores de ancestries, paths, spells e mechanics redigem linhas de compra na serialização de staging, segmentos e relatórios. Identidades e seletores continuam calculados sobre o insumo local exato. `inputSha256` conserva o hash da revisão licenciada; hashes de excertos e seções passam a descrever o texto efetivamente armazenado. A reconciliação compara faixas de origem após a mesma redação, sem deixar de verificar revisão, posição e hashes.

CUR-012 usa a política editorial 1.1.0. Uma linha sensível produz `before: "[buyer watermark redacted]"` e `beforeSha256`; diagnostics e overlays não guardam o literal de compra. A remoção cobre linhas dentro e fora de fences. A normalização tipográfica continua limitada aos payloads. Replay direto exige o hash da linha; replay reverso de dados redigidos exige o original local e seu hash de arquivo exato. A reversibilidade não publica mais o dado pessoal.

Todos os geradores de CUR-008 a CUR-021 verificam os artefatos antes de persistir o arquivo. A política compartilhada também entra nos hashes dos relatórios de extração, normalização e reconciliação. Os testes usam comprador e número sintéticos construídos em runtime.

## Arquivos locais e versionados

Retirados do índice, preservados no disco e ignorados: `curation/entries/`, `segments/`, `normalized/`, `normalization/`, `corrections/`, `history/`, `pilot/` e `reports/`. Esses conjuntos contêm evidências, transcrições ou excertos extensos; retirar apenas watermarks não os tornaria distribuíveis. Para o piloto, a retirada inclui conservadoramente a formalização misturada com evidências. Uma futura projeção só de dados estruturados pode ser versionada após auditoria própria.

Continuam versionados os contratos, registries, ledgers, decisões, reconciliação de metadados, exemplos fictícios e stubs ancestry-only. Nenhum pack oficial é habilitado. Os links antigos para derivados descrevem caminhos locais e exigem o ambiente de curadoria autorizado.

`privacy-clean-local.mjs` redige snapshots locais e não toca `rules/` nem objetos Git. Snapshots redigidos não são cópias byte a byte dos antigos; hashes históricos servem como referência da revisão anterior, não como certificação dos bytes redigidos. Os derivados correntes são regenerados em ordem para atualizar seus hashes.

## Gate e reprodução

`npm run curation:privacy` examina arquivos rastreados, decodifica strings de JSON/JSONL e rejeita padrões de compra ou caminhos destinados ao uso local. Emite apenas caminhos, motivos e contagens. A CI executa esse gate antes dos testes. A detecção trata o padrão de pedido conhecido; não pretende detectar arbitrariamente todos os nomes, telefones ou e-mails.

Em um checkout novo, usar `npm ci`, `npm run curation:privacy`, `npm test` e `npm run build`. A suíte pública não requer livros. A suíte completa de curadoria exige os quatro insumos licenciados e os complementos/snapshots locais autorizados nos caminhos e revisões dos manifests; não restaurar arquivos sensíveis do histórico para dentro do índice.

No ambiente local completo, executar a limpeza uma vez, regenerar ancestries → paths → spells → mechanics → normalize → reconcile → core-pilot → human-ancestry → creation-tables → professions-languages → wealth-equipment → interesting-things → pilot-items → pilot-tables com os runners em `tools/curation/` e `--write`. Em seguida, `npm run curation:check` verifica os derivados sem reescrever saídas.

O [inventário anterior](higiene-pii-inventario-s0.md) permanece como evidência da situação antes da correção. A conclusão da ponta e o risco residual do histórico devem ser registrados separadamente na issue/PR.

## Valida??o final

- 336 arquivos de derivados retirados do ?ndice e preservados localmente; limpeza local idempotente sem ocorr?ncias remanescentes.
- Gate sobre os 271 arquivos restantes: zero achados; testes adicionais da corre??o inclu?dos nessa ?rvore.
- Su?te completa com corpus: 245 testes em 34 arquivos aprovados.
- `npm run curation:check`: todos os checks de artefatos e os 150 testes de curadoria aprovados; contrato congelado 1.0.0 e seus 16 arquivos preservados.
- C?pia isolada apenas dos arquivos version?veis, sem `rules/` ou derivados locais: gate, 109 testes em 17 arquivos e build aprovados.
- Build do ambiente completo aprovado. Insumos mantidos nos hashes do manifesto; sem habilita??o de conte?do oficial.
