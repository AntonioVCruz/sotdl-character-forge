# Aceite integrado Human L0 — atividade 4 da #7

Registro de 2026-11-02. Autoria da implementação e do aceite técnico: Codex. As quatro atividades acordadas para a projeção de metadados estão entregues. A revisão de conteúdo e as projeções mecânicas continuam pendentes na #7 e no backlog de curadoria.

## Gate integrado

`tools/curation/human-l0-validation.ts` verifica o conjunto completo antes de o compilador persistir qualquer artefato:

1. Exatamente dois packs, índice ancestry e relatório, nos caminhos declarados pela receita.
2. JSON canônico, privacidade, schemas, IDs/versões selecionados e projeção estrita dos campos de metadados.
3. Fonte e título do registry; nome, página impressa, variante, revisão e elegibilidade do staging de origem. Campos extras de texto/mecânica, mudanças sem origem, `curated` fabricado e troca para conteúdo fictício são recusados.
4. Core sem dependências e Only Human dependente da versão exata selecionada do Core. Dependência ausente, versão diferente e ciclo são recusados.
5. Importação Core → Only Human em snapshot novo, validação e roundtrip JSON, mantendo o ruleset desabilitado.
6. Referências exatas e cobertura completa do índice, preservando as duas publicações homônimas.
7. Hashes dos bytes de saída e conferência independente do relatório contra os insumos e registros lidos: contagens, incluídos, excluídos, origens e pendências.

O relatório é reconstruído a partir da proveniência lida; mudar os hashes declarados não permite aprovar dados projetados que divergem da origem. Falhas do gate usam `HumanL0ValidationError`, com caminho, ponteiro JSON e código, sem copiar valores ou mensagens brutas de dados privados.

O contrato da receita foi extraído para `tools/curation/human-l0-recipe.ts`, compartilhado entre compilação e validação. Os contratos congelados de staging e catálogo permanecem intactos.

## Reprodução

Com staging autorizado disponível:

```sh
npm run curation:compile
npm run curation:validate
```

`curation:validate` executa o modo check: recompila e valida em memória, depois confere todos os bytes persistidos com o conjunto aprovado. Insumos alterados, arquivo ausente ou conteúdo divergente impedem o aceite. `curation:compile:check` mantém o mesmo comportamento. Relatórios antigos precisam ser regenerados com o modo write para refletir o gate entregue.

A saída continua em `tmp/curation/compiled-human-l0/`, ignorada no Git. As versões dos packs continuam `0.1.1` e seus hashes não mudaram; os stubs versionados `0.1.0` permanecem preservados. A ferramenta trabalha com snapshot em memória. Os testes exercitam os bytes lidos de disco e a persistência em `fake-indexeddb`, usando as APIs reais do catálogo.

## Evidência e limites

Os 19 cenários novos cobrem compilação → arquivos → índice/relatório → importação → persistência/reabertura, ordem de dependência, Core com versão errada, importação repetida, tentativa de substituir uma versão, alteração de metadados com hashes refeitos, refs ausentes/duplicadas, cobertura incompleta, relatório adulterado, diagnósticos sem payload e preservação da saída anterior diante de erro.

Validação local: 310 testes completos aprovados com dois workers, build e gate de privacidade aprovados. A suíte pública executa os cenários de integração com staging sintético e sem livros.

A execução local com os insumos autorizados confirmou dois packs e duas entidades válidas, ruleset desabilitado, determinismo em duas compilações e check aprovado. O relatório agora tem **7 registros, 2 incluídos, 5 excluídos da seleção e 11 pendências**. Foi retirada somente a pendência técnica `integrated-validation`; continuam as revisões de fonte/estrutura/mecânica, suporte de automação, revisão de conteúdo, projeção mecânica e integração no ruleset.

| Artefato | SHA-256 |
|---|---|
| Packs e índice, inalterados | `e7be6873d5914a454a1f5b6537294266891848d8bf6c61fc36f1e14852433738` |
| Relatório após o aceite técnico | `a30d81393d6b61b8ac61d0d2d6b24e9cfb559b861d2bd227f755caaa15ceb624` |
| Conjunto incluindo relatório atualizado | `f9e3f7b4064c04f0a093aae8cbf55df0da1c30f132ea7ec14260c503ee2e10b1` |

Este aceite cobre integridade técnica da fatia de metadados. A geração oficial depende ainda da revisão de conteúdo/distribuição, das projeções mecânicas e handlers, do freeze correspondente e da habilitação explícita do ruleset. A CUR-032 completa inclui outros lotes, relações e categorias. Nenhum parecer externo do Curador/Revisor é atribuído aos testes executados pelo Codex.

- [x] 1. Compilação determinística.
- [x] 2. Índice temático com referências exatas.
- [x] 3. Relatório de contabilidade e hashes dos insumos.
- [x] 4. Validação integrada técnica Core → Only Human.
