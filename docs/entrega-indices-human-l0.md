# Índices temáticos Human L0 — atividade 2 da #7

Entrega de 2026-10-30. A compilação da [atividade 1](entrega-compilacao-deterministica-human-l0.md) passa a emitir `compendios/ancestry.index.json` junto dos packs de metadados. A saída permanece local em `tmp/curation/compiled-human-l0/`, sem alterar os stubs versionados `0.1.0` ou habilitar geração oficial.

## Índice e referências

`tools/curation/thematic-indexes.ts` constrói os índices exclusivamente a partir das entidades efetivamente emitidas pelo compilador. Nesta fatia há uma categoria, `ancestry`, com dois registros:

| Pack | Versão exata | Entidade |
|---|---|---|
| `sotdl-core-human-l0` | `0.1.1` | `sotdl:shadow-of-the-demon-lord-core:ancestry:human:default` |
| `sotdl-only-human-l0` | `0.1.1` | `sotdl:only-human:ancestry:human:variant` |

Cada entrada segue `ThematicIndexSchema`: nome, aliases, referência completa, kind, fonte, variante e grupo de equivalência. Os dois nomes Human não fundem publicações ou variantes. Aliases ficam vazios e `equivalenceGroupId` fica nulo, sem inferir relações não revisadas. O índice não duplica texto, evidências, mecânicas ou status de revisão. Sua presença não torna o alvo elegível no gerador.

O gate de referências resolve a tupla completa `packId/version/entityId` contra os packs compilados. Recusa pacote/versão/entidade ausente, packs ou IDs ambíguos, referências duplicadas e divergências de nome, kind, fonte ou variante. Não busca a versão mais recente nem substitui alvo por nome. Categorias são emitidas somente quando há entidades; não há índice vazio de magia, paths, itens ou tradição nesta fatia.

## Reprodução e persistência

```sh
npm run curation:compile
npm run curation:compile
npm run curation:compile:check
```

Packs continuam imutáveis por versão. O índice acompanha as versões explicitamente selecionadas na receita; pode ser reconstruído pelo modo write se estiver desatualizado. O modo check recusa índice ausente ou divergente. Todos os destinos passam pelo preflight antes de qualquer escrita; falha em um pack impede a atualização do índice. Novos packs são gravados antes do índice que os referencia. Artefatos de versões anteriores não são apagados.

A serialização canônica compartilhada em `tools/curation/canonical-json.ts` preserva os bytes dos packs anteriores e ordena os registros por referência exata, independentemente da ordem de leitura. Duas compilações locais e o check produziram:

| Artefato | SHA-256 |
|---|---|
| Índice ancestry | `e72ef5eaf2e76a8a1be0855f51e0e0c349a97a56d1d9c05a70451c7c68e1d353` |
| Core `0.1.1`, inalterado | `cc819c55e162b357f4fccf333b346fa1f2f19d263c004fcf9da806a2f8559fe5` |
| Only Human `0.1.1`, inalterado | `9d1ca0023ffb45e53c8df122e3e4790491e6eb172410ee9408a96abe4e067cd8` |
| Conjunto de packs e índice | `e7be6873d5914a454a1f5b6537294266891848d8bf6c61fc36f1e14852433738` |

O hash do conjunto mudou porque agora inclui o índice; os dois hashes dos packs permanecem iguais aos da atividade 1.

Os testes públicos cobrem referências exatas, homônimos, múltiplas versões, ambiguidades, metadados incompatíveis, determinismo, check/reconstrução de índice e atualização de versão sem alterar packs antigos. Não exigem livros ou staging local.

Validação local: 280 testes completos aprovados com dois workers, incluindo 14 casos novos desta atividade, além de build e gate de privacidade. Duas compilações do staging autorizado e o modo check confirmaram os hashes acima.

## Próximas atividades

- [x] 1. Compilação determinística da projeção de metadados.
- [x] 2. Índice temático com referências exatas aos packs emitidos.
- [ ] 3. Relatório de inclusões, exclusões, pendências e hashes dos insumos.
- [ ] 4. Validação integrada da fatia e dependência Core → Only Human.

O gate desta atividade verifica as referências do índice; não conclui o aceite integrado da atividade 4 ou toda a CUR-032. A #7 e a CUR-031 permanecem parciais, com revisão de conteúdo, projeções mecânicas e integração no motor ainda necessárias.
