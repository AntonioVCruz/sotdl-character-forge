# Content packs

Stubs da fatia S1 (Human L0) para os insumos de esqueleto da CUR-031. Contrato: [issue #7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7).

| Path | packId |
|---|---|
| `sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json` | `sotdl-core-human-l0` |
| `sotdl%3Aonly-human/0.1.0/pack.json` | `sotdl-only-human-l0` |

Cada entidade é `ancestry` em `needs-review`. Não há `randomTable` nem texto de livro até a política de [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2). `source.status` permanece `needs-review` e `fictionalData` permanece `false` (os dois têm de concordar; `fictional` com `fictionalData: false` é inválido). Estes arquivos não entram no ruleset do aplicativo e não habilitam geração. O merge de pack oficial continua soft-blocked pela higiene de [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1) e pela política de #2.

Only Human depende de `sotdl-core-human-l0@0.1.0`. Parse e valide o Core primeiro; só então Only Human, com o Core já instalado.

Não adicionar texto de livro, trechos longos, watermarks ou PII.
