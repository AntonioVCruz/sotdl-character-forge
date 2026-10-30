# Content packs

Stubs da fatia S1 (Human L0) para os insumos de esqueleto da CUR-031. Contrato: [issue #7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7).

| Path | packId |
|---|---|
| `sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json` | `sotdl-core-human-l0` |
| `sotdl%3Aonly-human/0.1.0/pack.json` | `sotdl-only-human-l0` |

Cada entidade é `ancestry` em `needs-review`, sem `randomTable` nem texto de livro. `source.status` permanece `needs-review` e `fictionalData` permanece `false` (os dois têm de concordar; `fictional` com `fictionalData: false` é inválido). Os dois stubs já estão na `main` pelo PR #11. A política do PR #12 e a limpeza da ponta da #1 estão entregues; não são pendências para o merge destes stubs.

Os stubs não habilitam geração. As primeiras atividades da CUR-031 entregam [compilação determinística de metadados](../docs/entrega-compilacao-deterministica-human-l0.md) e [índice ancestry com refs exatas](../docs/entrega-indices-human-l0.md) em diretório local ignorado, sem modificar estes arquivos `0.1.0`. Faltam relatório, validação cruzada CUR-032, projeções mecânicas revisadas, freeze de conteúdo e integração/handlers CUR-033/034. A UI os apresenta como inelegíveis e mantém `rulesetEnabled: false`. Ver a [política consolidada](../docs/politica-distribuicao-conteudo.md) e o [estado das issues](../docs/estado-issues.md). O histórico antigo é tratado separadamente na #16.

Only Human depende de `sotdl-core-human-l0@0.1.0`. Parse e valide o Core primeiro; só então Only Human, com o Core já instalado.

Não adicionar texto de livro, trechos longos, watermarks ou PII.
