# Relatório de compilação Human L0 — atividade 3 da #7

Entrega de 2026-11-02. O compilador passa a emitir `reports/human-l0-compilation.json` no diretório local ignorado `tmp/curation/compiled-human-l0/`, junto dos packs e do índice. A atividade 4, validação integrada da fatia, permanece pendente.

## Escopo e contabilidade

O relatório cobre exatamente os arquivos lidos: receita, registro de fontes e os dois JSONL de ancestries de Core/Only Human. Não certifica todos os livros, o piloto inteiro ou staging de outras publicações/kinds. Cada linha JSON não vazia vira um registro contabilizado; linhas vazias não entram na contagem, mas continuam influenciando as posições físicas e o hash do arquivo.

- `included`: referências exatas dos alvos emitidos, estado `needs-review` e origem por arquivo/linha/hash.
- `excluded`: origem por arquivo/linha/hash e códigos de exclusão. IDs, nomes e justificativas de registros excluídos não são copiados, pois podem estar inválidos ou conter dados indevidos.
- `pending`: eixos de revisão ainda não aprovados dos registros incluídos, páginas impressas ausentes e gates de conteúdo, projeção mecânica, validação integrada e integração no ruleset. A contagem representa ocorrências de pendência, não um número de novas atividades.
- `inputs`: caminho relativo, tamanho em bytes e SHA-256 dos quatro arquivos completos, calculados sobre os mesmos bytes usados na leitura.
- `outputs`: caminhos/hashes dos dois packs e do índice, mais o hash desse conjunto, sem incluir o próprio relatório.

A soma de incluídos e excluídos deve corresponder aos registros lidos. Origens ausentes/ambíguas, locais duplicados ou inventário inválido impedem um relatório de sucesso. A origem do registro selecionado precisa corresponder ao arquivo da sua publicação.

Os códigos de exclusão são `outside-selection`, `invalid-staging`, `unresolved-source`, `source-file-mismatch`, `reference-only`, `blocked` e `restricted-source`. Todas as condições verificáveis são preservadas, sem escolher um motivo que oculte outro. Os códigos de revisão distinguem fonte, transcrição, estrutura, mecânica e suporte de automação. Mecânica manual não vira automação implementada.

## Privacidade e reprodução

Não são persistidos nomes de responsáveis, razões livres, nomes dos excluídos, texto original/normalizado, evidências, excertos ou mensagens brutas dos validadores. Os caminhos de entrada e de saída são restritos ao recorte declarado no schema. O gate de privacidade verifica o relatório antes de qualquer escrita.

O hash de uma linha usa sua representação UTF-8 sem o terminador; o hash do arquivo completo conserva terminadores e demais bytes. Entradas UTF-8 inválidas ou JSON inválido são recusadas com localização e sem imprimir conteúdo. Um erro de compilação não substitui um relatório anterior por uma alegação de sucesso; o modo check sinaliza quando a saída não corresponde aos insumos atuais.

```sh
npm run curation:compile
npm run curation:compile
npm run curation:compile:check
```

O relatório é determinístico para os mesmos bytes de entrada, sem relógio, caminho absoluto ou hash autorreferente. Alterar texto privado sem mudar os metadados projetados conserva packs/índice e seu hash conjunto, mas muda a proveniência do relatório. O modo write reconstrói relatório/índice após conferir todos os destinos; packs continuam imutáveis por versão. A ordem de escrita é packs → índice → relatório. Backups e insumos não são alterados.

## Resultado local em 2026-11-02

| Medida | Resultado |
|---|---:|
| Insumos diretamente lidos | 4 |
| Registros JSON lidos | 7 |
| Incluídos | 2 |
| Excluídos | 5 |
| Ocorrências de pendência | 12 |

Os cinco excluídos desta execução ficaram fora da seleção Human. Os dois incluídos continuam `needs-review`; as 12 pendências cobrem revisões e integrações ainda necessárias. Duas execuções e check produziram os mesmos hashes:

| Artefato | SHA-256 |
|---|---|
| Relatório | `14ddc015ed48c4b96b7fd413a1ab4652e8e9501921974896bf6ddcd9ddcfbd77` |
| Packs e índice, preservados da atividade 2 | `e7be6873d5914a454a1f5b6537294266891848d8bf6c61fc36f1e14852433738` |
| Conjunto incluindo o relatório | `ed46a445f1f5176824972917313db81e0a1b909f1e50b4340ed44e69254b3005` |

Esses hashes identificam esta revisão local dos insumos; mudanças de bytes, inclusive de terminadores, mudam a proveniência. O relatório completo continua ignorado. O código/schema e os testes sintéticos são versionados; este documento registra somente o resumo permitido.

Validação: 291 testes completos aprovados com dois workers, incluindo 11 novos casos desta atividade, além de build e privacidade. Os testes públicos usam dados sintéticos para contabilidade, motivos de exclusão, pendências, hashes, privacidade, determinismo e atualização segura da proveniência, sem depender de livros.

## Estado da entrega

- [x] 1. Compilação determinística da projeção de metadados.
- [x] 2. Índice ancestry com referências exatas.
- [x] 3. Relatório de inclusões, exclusões, pendências e hashes.
- [ ] 4. Validação integrada da fatia e dependência Core → Only Human.

Não há freeze mecânico ou geração oficial habilitada. A #7, a CUR-031 completa e a CUR-032 permanecem parciais; o relatório expõe essas pendências e não as considera aprovadas automaticamente.
