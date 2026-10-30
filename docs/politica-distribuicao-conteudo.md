# Política de distribuição de conteúdo

Status: **S0** — issue [#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2).
Escopo: o que pode entrar no git, nos packs e nos exports (JSON/HTML/PDF). Não substitui a constituição nem licenças das obras.

## Princípios

1. Insumos oficiais em Markdown (`rules/`) **não** são versionados.
2. Staging e piloto são camada de curadoria; **não** são packs importáveis.
3. Stub `needs-review` ancestry-only (sem texto integral de livro) **pode** entrar na `main`. **Enable** no ruleset só após freeze do pack e higiene PII ([#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1)).
4. O soft-block de [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1) e desta política ([#2](https://github.com/AntonioVCruz/sotdl-character-forge/issues/2)) permanece para pack **curated/oficial**. Não se aplica a stub ancestry-only.
5. Nunca marcar conteúdo oficial como `fictionalData: true` para contornar filtros do demo.
6. Export HTML/PDF **não** embute texto integral de livro protegido.

## Stub `needs-review` e pack curated

- Stub ancestry-only com `status: needs-review`, `fictionalData: false` e sem texto de livro **pode** ir para a `main`. Referência: packs Human L0 em [#11](https://github.com/AntonioVCruz/sotdl-character-forge/pull/11) (contrato [#7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7)).
- **Enable** no ruleset, e promoção a `curated`, só após freeze da fatia e higiene [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1).
- Pack curated/oficial (`fictionalData: false` com conteúdo mecânico a habilitar) continua soft-blocked por #1 e #2 até a higiene e esta política estarem satisfeitas. Esse soft-block não impede o merge do stub ancestry-only.
- O gate de CI (`test and build`) pode exercitar esses stubs sem embutir livro. Esta política não exige que o gate aceite só fixtures `fictionalData: true`.

## Tabela de classes

| Classe | Git / packs | Exports (JSON/HTML/PDF) | Notas |
|---|---|---|---|
| `rules/*.md` (MDs oficiais) | **gitignored / local** — fora do git; não é pack | **proibido** embutir o texto | Processo local no README. |
| `curation/normalized/` | **gitignored / local** (preferência); não é pack | **proibido** redistribuir texto de livro | Cópias normalizadas podem conter texto de livro. |
| Staging `originalText` / excerpts longos em `curation/entries/**` | **gitignored / local** após #1; metadados/hashes ok no git; não é pack | **proibido** embutir excertos longos | Evidência longa fora do tip público. |
| `curation/corrections/**` | **caso a caso**: corpo de livro → local; hashes/manifest → git | Corpo de livro **proibido** | Hashes não vão no export do app. |
| Ledgers / reports / hashes | **git** (metadados; não é pack importável) | Metadados ok; **sem** corpo de livro | |
| `curation/pilot/*.json` | **git** (estruturado); **não** é pack importável (`importablePack=false`) | Sem excertos longos | Formalização; não tratar piloto como livro exportado. |
| Stub `content-packs/**` ancestry-only, `needs-review`, `fictionalData: false` | **git**, inclusive `main`, se não houver texto integral indevido | JSON de personagem ok; HTML/PDF **sem** texto integral de livro | **Pode** ir para a `main`. **Enable** no ruleset só após freeze + higiene #1. Fora do soft-block de pack curated. |
| Pack `content-packs/**` curated/oficial, `fictionalData: false` | **git** só após higiene #1 e esta política | JSON de personagem ok; HTML/PDF **proibido** embutir livro oficial | Soft-block #1/#2 permanece. **Enable** no ruleset só após freeze + #1. |
| Fixtures `examples/**` / `curation/examples/**` | **git** | Demo fictício ok; não embutir livro oficial | `fictionalData: true` ou packs vazios de formato. |
| `curation/history/**` / diagnostics grandes | **local** se sensíveis; resumos/hashes podem ficar no git | **proibido** exportar dumps sensíveis ou texto de livro | |
| Export HTML/PDF do app | Não é artefato de pack | **proibido** embutir livro oficial; JSON de personagem ok | |

## Processo de insumos locais

1. Colaborador obtém MDs/PDFs sob licença própria.
2. Coloca em `rules/` (gitignored).
3. Roda extratores / `npm run curation:check` localmente.
4. Não comita `rules/` nem dumps com watermark/PII.

## Exceções

Aprovadas pelo **dono do repo** com parecer do **Curador STD**. Registrar na issue/PR.

## Relacionado

- Higiene PII: [#1](https://github.com/AntonioVCruz/sotdl-character-forge/issues/1)
- Pack Human L0: [#7](https://github.com/AntonioVCruz/sotdl-character-forge/issues/7)
- Stub ancestry-only: [#11](https://github.com/AntonioVCruz/sotdl-character-forge/pull/11)
- CUR-031 / CUR-041

## Aplica??o da limpeza S0 (#1)

A entrega de 2026-10-30 mant?m localmente tamb?m os relat?rios completos e o piloto, por misturarem metadados com transcri??es e evid?ncias extensas. Esta ? a aplica??o conservadora da tabela: somente uma proje??o auditada sem esses excertos poder? voltar ao git. `curation/reconciliation/` permanece como metadados. Ver [entrega e reprodu??o](entrega-higiene-pii-s0.md) e [hist?rico separado](higiene-historico-git.md).
