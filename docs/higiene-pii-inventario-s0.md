# S0 — inventário de watermarks e PII na ponta

Inventário da ponta (`HEAD`), sem reescrita de histórico. Relacionado a [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1) e [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2).

Este documento traz contagens e caminhos. Não reproduz o texto casado, números de pedido, nomes nem trechos de livro.

## Método

Varredura em 2026-10-28 sobre os arquivos rastreados por `git ls-files` (581 arquivos; 359 em `curation/`). O diretório `rules/` está no `.gitignore` e não entrou na conta.

Padrão principal: a regra já implementada em `tools/curation/editorial-normalizer.ts` para CUR-012 (`remove-buyer-watermark-line`). Uma ocorrência é uma linha inteira, depois de decodificar JSON, no formato descrito na entrega: nome seguido de `(order #` e um identificador numérico de pelo menos quatro dígitos. A expressão concreta fica no código; não é copiada aqui.

Passos, sem gravar o texto casado:

1. Listar caminhos com `git ls-files -z`.
2. Em `.json` e `.jsonl`, fazer parse e aplicar o padrão a cada string decodificada (assim um `\n` escapado não vira outra ocorrência).
3. Nos demais arquivos, aplicar o mesmo padrão a cada linha.
4. Conferência extra: a forma só com parênteses e `#` + dígitos, sem exigir o nome. Essa passagem não acrescentou ocorrências além do padrão CUR-012.
5. Emitir só caminho e inteiros. O script não foi versionado.

`git log -- curation/` mostra um único commit que introduz essa árvore: `5d2ca7e`. Nenhum commit posterior altera `curation/`. Não houve `git log -p`, BFG nem `filter-repo`.

Limite: a varredura não procurou e-mails, telefones nem nomes soltos. Texto de jogo geraria falso positivo. Também não classifica texto integral de livro: ausência do padrão de pedido não torna um arquivo distribuível. A política disso é a [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2).

## Resultado

**374 ocorrências** em **16 arquivos** de `curation/`. Os outros **343** arquivos rastreados de `curation/` têm **0**.

As 53 linhas que CUR-012 remove nas cópias normalizadas continuam 53. O número maior é cópia da mesma linha em diff, diagnóstico, excerto e histórico. Nos 53 registros de `changes.jsonl` com a regra de watermark há **2 strings distintas** (não listadas). Não apareceu ocorrência do padrão fora dessa forma de linha, depois do parse.

| Caminho | Ocorrências | Onde está |
|---|---:|---|
| `curation/segments/mechanics.jsonl` | 90 | 45 em `originalText` e 45 em `evidence.excerpt` (trecho longo) |
| `curation/normalization/changes.jsonl` | 53 | campo `before` inteiro; regra `remove-buyer-watermark-line`; `after` vazio |
| `curation/normalization/diagnostics.jsonl` | 53 | campo `snippet` inteiro; `kind` `buyer-watermark` |
| `curation/normalization/overlays.jsonl` | 53 | `source.excerpt` (trecho longo) |
| `curation/entries/sotdl%3Aterrible-beauty/creature.jsonl` | 24 | 12 em `originalText` e 12 em `review.evidence[].excerpt` |
| `curation/entries/sotdl%3Atombs-of-the-desolation/creature.jsonl` | 18 | 9 em `originalText` e 9 em `review.evidence[].excerpt` |
| `curation/entries/sotdl%3Aterrible-beauty/path.jsonl` | 10 | 5 em `originalText` e 5 em `review.evidence[].excerpt` |
| `curation/entries/sotdl%3Atombs-of-the-desolation/rule.jsonl` | 10 | 5 em `originalText` e 5 em `review.evidence[].excerpt` |
| `curation/history/paths-seer-troll-hunter-2026-10-26/paths.before.json` | 9 | `occurrences[].sections[].rawText` |
| `curation/history/paths-seer-troll-hunter-2026-10-26/paths.before.md` | 9 | linhas inteiras do Markdown |
| `curation/history/source-alias-hunger-in-the-void-2026-10-26/paths.before.json` | 9 | `occurrences[].sections[].rawText` |
| `curation/history/remaining-source-aliases-2026-10-27/curation/reports/paths.json` | 8 | `occurrences[].sections[].rawText` |
| `curation/history/spells-do-we-not-die-2026-10-26/paths.before.json` | 8 | `occurrences[].sections[].rawText` |
| `curation/reports/paths.json` | 8 | `occurrences[].sections[].rawText` |
| `curation/entries/sotdl%3Aterrible-beauty/rule.jsonl` | 6 | 3 em `originalText` e 3 em `review.evidence[].excerpt` |
| `curation/entries/sotdl%3Atombs-of-the-desolation/path.jsonl` | 6 | 3 em `originalText` e 3 em `review.evidence[].excerpt` |

### Por área

| Área | Arquivos com hit | Ocorrências | Arquivos da área com 0 |
|---|---:|---:|---:|
| `curation/segments/` | 1 | 90 | 0 |
| `curation/normalization/` | 3 | 159 | 0 |
| `curation/entries/` | 6 | 74 | 207 |
| `curation/history/` | 5 | 43 | 66 |
| `curation/reports/` | 1 | 8 | 17 |
| `curation/normalized/` | 0 | 0 | 4 |
| `curation/corrections/` | 0 | 0 | 17 |
| `curation/pilot/` | 0 | 0 | 9 |
| `curation/examples/` | 0 | 0 | 6 |
| `curation/reconciliation/` | 0 | 0 | 5 |
| JSON na raiz de `curation/` | 0 | 0 | 12 |

`normalized/` não contém o padrão de pedido. A menção editorial à limpeza de watermark nesses Markdown é texto de instrução, não a linha de comprador.

### Fora de `curation/`

| Caminho | Ocorrências | Onde está |
|---|---:|---|
| `tests/curation-normalization.test.ts` | 5 | literais no teste de CUR-012; a linha do arquivo é maior que o padrão |

Os outros 221 arquivos rastreados fora de `curation/` têm 0 para este padrão. Esse teste fica de fora do `vitest` quando `rules/` não está presente (`vite.config.ts`), mas o arquivo continua no git.

## Por que a redação de `before` não entrou

A forma dos 53 registros em `changes.jsonl` é uniforme: a regra é `remove-buyer-watermark-line`, `before` é só a linha do padrão, `after` é vazio e `inputSha256` (hash do arquivo inteiro) está presente. Nenhum outro campo desses registros casa o padrão. Trocar esse `before` por um placeholder seria uma edição local previsível.

Essa edição isolada não é segura neste checkout:

- `replayChanges` e `normalizeDocument` exigem o `before` literal para o diff reverso. A entrega de CUR-012 guarda o original no diff para reconstruir a revisão bruta. Um placeholder quebra esse contrato.
- `buildArtifacts` (`curation:normalize --write` / `--check`) relê `rules/` e regrava `changes.jsonl` com o `before` literal. Um arquivo editado à mão diverge do `--check` assim que o corpus local existe, e o `--write` volta a gravar a linha. O hash do artefato também está em `curation/reports/editorial-normalization.json`.
- Não há hash da linha. `inputSha256` é do arquivo inteiro. Incluir um hash de `before` altera `LineChangeSchema` (schema estrito) e o relatório. Regenerar o relatório exige `rules/`, que não está neste ambiente.
- O mesmo padrão permanece em `snippet`, excertos e histórico. Um teste que falha se o padrão reaparece não passaria só com a troca do `before`.
- Em `entries/` e `segments/`, `buildArtifacts` compara `originalText` com a faixa correspondente de `rules/`. Redigir esse campo faz o gate acusar divergência de evidência. O excerto longo também carrega hash próprio. Isso já não é troca mecânica de um campo.

Por isso este PR é só o inventário. Não altera `tools/curation/`, testes, packs nem UI.

## Recomendação

**Próximo passo: limpeza da ponta, com o gerador incluso.** A linha está nos arquivos atuais, não só em commits antigos. A limpeza precisa fazer o `--write` deixar de persistir a linha (placeholder no `before` e no `snippet`, com hash da linha se o schema passar a ter esse campo) e tratar à parte os excertos longos, porque eles sustentam o gate de evidência. O teste de regressão deve usar a regex já existente em CUR-012, sem gravar uma linha real de pedido no fonte. Os literais em `tests/curation-normalization.test.ts` entram nessa limpeza.

**Reescrita de histórico: decisão do dono do repositório.** O material entrou em `5d2ca7e` e segue alcançável a partir de `main`. Um commit novo na ponta não apaga esse blob. BFG e `filter-repo` ficam fora até o dono autorizar, e só fazem sentido depois que a ponta e o `--write` deixarem de reintroduzir o padrão. Este inventário não abre essa reescrita e não reescreve refs.
