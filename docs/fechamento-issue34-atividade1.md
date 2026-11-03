# Fechamento da #34 — atividade 1

Registro local de 2026-11-02. **Atividade 1 concluída: proveniência reconciliada, derivados conferidos e comparação LF/CRLF corrigida.** Autoria: Codex. O fechamento encerra `act1-local-hash-check`; os lotes 3–5, seus handlers e a habilitação exigem aceite próprio.

## Causa e preservação

O PR #40 acrescentou `export` às declarações `expanded` e `edges` em `tools/curation/creation-table-inventory.ts`. O hash do produtor mudou, mas o inventário local ainda registrava o anterior:

| Produtor | SHA256 |
|---|---|
| Antes dos exports | `db1304f0b6b450e8c9faa1e7fd75f9e7f3b2452c9dd381348bc43d7e2f431a54` |
| Código conferido | `4d94d5e64f337fe76361306eb94eab848a9a882886b2edd543a368c66b8e130d` |

Os seis pilotos CUR-016–021 e seus seis relatórios anteriores foram preservados em `tmp/curation/act1-reconciliation-before/`, fora do Git. A cadeia foi regenerada na ordem: inventário → profissões/idiomas → riqueza/equipamento → Interesting Things → itens → fechamento. Cada geração foi seguida de seu `--check`.

Nos seis pilotos, somente `inputRefs` mudou. Nos seis relatórios, somente `inputRefs` e `outputs` mudaram. O restante de cada objeto ficou idêntico. Os demais 289 arquivos do grafo inicial conservaram seus hashes. Livros, transcrições, correções, staging, decisões, revisão histórica e estados de revisão não foram alterados.

## Provas e verificação

- [Reconciliação dos 12 derivados](../curation/reviews/issue34-activity1-provenance-2026-11-02.json): hashes anteriores/atuais e antigos campos superiores de proveniência.
- [Comprovante local](../curation/reviews/issue34-activity1-local-verification.json): inventário de hashes/tamanhos, raízes, pins, contagens e vínculos canônicos com matriz, reconciliação e revisão histórica.

Ambos contêm somente metadados permitidos. `verifyProvenanceTransition` restaura apenas os campos superiores de proveniência e reconstrói o JSON antigo. O SHA256 precisa coincidir exatamente com o hash histórico esperado. Alterar fórmula, número, evidência, texto, status ou outro campo impede essa coincidência, mesmo recalculando o hash atual.

O compilador mecânico preserva o ledger de revisão original. Para aceitar o artefato com metadados reconciliados, exige a reconstrução exata e o produtor pinado. Hash divergente de insumo original continua sendo erro; não foi criada uma exceção genérica que aceite apenas um novo digest declarado.

| Conferência | Resultado |
|---|---:|
| Hashes dos bytes de arquivos | 301 |
| Referências `inputRefs`/`outputs` | 1.060 |
| Referências de saída, incluídas no total anterior | 233 |
| Derivados reconciliados sem mudança de payload | 12 |
| Pins de fontes/transcrições recomputados | 8 |
| Registros estruturais cobertos pelos pins | 258 |
| Checks CUR-016–021 aprovados | 6 |
| Fluxos numéricos locais com cobertura completa | 70 de 70 |
| Menções contextuais a dados recontadas | 77 |

As 77 menções não são 77 comandos obrigatórios. Foram conservadas as 74 tabelas, 360 posições de Interesting Things, 409 definições de catálogo e 641 referências. Integridade não transforma todos os registros em perfis automáticos.

## Reprodução e comparação LF/CRLF

```powershell
npm run curation:verify:activity1
```

O comando exige os bytes locais autorizados e os derivados pinados. Confere inventário, referências, as 12 reconstruções, revisão histórica, pins e contagens; depois executa os seis geradores em modo check. Não atualiza hashes nem regenera dados automaticamente. Mudanças futuras exigem nova conferência documentada.

O teste da matriz pública normaliza somente terminadores LF/CRLF do texto gerado. Espaços diferentes, conteúdo alterado ou ausência do LF final continuam sendo erros. Hashes de livros, evidências e derivados usam bytes reais, sem normalização.

O JSON da [matriz estrutural](matriz-lacunas-issue34-atividade1.json) conserva `pending-act1-local-hash-check` e `hash-declarado-nao-refeito` como snapshot da emissão sem corpus. O hash canônico desse snapshot está vinculado ao comprovante local. O [relatório da matriz](matriz-lacunas-issue34-atividade1.md) distingue o histórico do fechamento atual; registros e evidências não foram reclassificados em massa para apagar o histórico.

## Aceite e limites

Validação local: **448 testes em 47 arquivos aprovados**, build/TypeScript e integridade dos 16 arquivos congelados aprovados. As regressões exercitam reconstrução histórica, alteração do payload, referências obsoletas, inventário, caminhos, hashes brutos e tolerância restrita a LF/CRLF.

`curation:validate`, `curation:validate:mechanical` e `curation:accept:runtime` passaram. Packs mecânicos `0.2.0` e índice conservaram seus hashes; o relatório mecânico de proveniência foi regenerado. Metadados `0.1.1` conservaram o conjunto `f9e3f7b4064c04f0a093aae8cbf55df0da1c30f132ea7ec14260c503ee2e10b1`. Stubs `0.1.0` não mudaram.

O comprovante retém os outros bloqueios: grupos públicos `local-only`, ambiguidades, perfis genéricos, contextos manuais, dependências externas e revisão de fonte/paginação. Nenhum PDF foi inspecionado nesta conferência. Versões de publicação não confirmadas continuam desconhecidas; `needs-review`, `fictionalData: false` dos dados reais e os gates de habilitação permanecem preservados.

Na #34: **1 concluída**, **2 já aceita** nos PRs #42/#43, **3–8 abertas**. Os PRs de lotes existentes não foram mesclados por este fechamento. Próximo passo: revisar a atividade 3 com os insumos locais reconciliados.
