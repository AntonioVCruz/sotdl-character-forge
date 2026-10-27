# CUR-008 — ancestries extraídas para staging

Concluída em 2026-10-26, conforme `docs/plano-extracao-ancestries.md`. Foram preservadas as 59 ocorrências de publicação / 45 nomes / 40 rótulos de fonte do MD de ancestries. O insumo de ancestries e os 16 arquivos congelados na Etapa A mantêm seus hashes. O manifesto/registro foram atualizados posteriormente pelas correções autorizadas ao MD de paths; este staging foi regenerado sem modificar o texto das ancestries. Não houve mudança do criador ou dos contratos de staging.

## Artefatos

- `tools/curation/ancestry-extractor.ts`: parser, resolução, evidência, validação e geração determinística.
- `tools/curation/ancestries.mjs`: runner que compila a ferramenta local com esbuild em `tmp/curation/` (não executa código de MD/JSON).
- `curation/ancestry-ledger.json`: 59 chaves atribuídas nesta primeira extração. Execuções posteriores leem o ledger, sem regenerar IDs a partir de nomes/linhas. Correções de rótulo exigem atualizar explicitamente o seletor, preservando a chave.
- `curation/entries/<source-id-escapado>/ancestry.jsonl`: 59 ocorrências capturadas com fonte resolvida em 40 publicações.
- `curation/history/source-alias-hunger-in-the-void-2026-10-26/`: registros anteriores das quatro fontes pendentes e relatórios preservados para auditoria.
- `curation/reports/ancestries.json`: hashes de entrada/ferramenta/ledger/registro, saídas, contagens e detalhes por ocorrência: Entry Type, páginas declaradas, linhas de metadados, limites de Full Entry e notas editoriais.

Os diretórios escapam `:` como `%3A`, preservando o ID dentro do JSON. O staging usa exclusivamente campos do schema congelado; metadados específicos de ancestry ficam no relatório sidecar. Cada ocorrência preserva seu Markdown completo em `originalText`, incluindo cabeçalho, metadados, cercas, notas e finais de linha. A evidência mantém separadamente o trecho normalizado somente para LF, suas linhas e SHA-256. Não foi feita limpeza editorial.

## Resultado e limites

| Tipo declarado no MD | Ocorrências |
|---|---:|
| Standard Ancestry | 31 |
| Expanded Ancestry | 11 |
| Derived Ancestry | 6 |
| Ancestry Variant | 4 |
| Powerful Ancestry | 3 |
| Beastman Ancestry | 3 |
| Ancestry Template | 1 |

Core e expansões de Human, Changeling, Clockwork, Dwarf, Goblin e Orc têm IDs distintos. As demais republicações também mantêm fonte/variante próprias. Tabelas, traits e progressão permanecem integralmente nos blocos da ocorrência correspondente; benefícios de ancestry não são emitidos como paths. A classificação usa o Entry Type declarado, sem inferir relações mecânicas a partir do nome ou de uma frase `Powerful Ancestry` no corpo.

Bugbear, Fomor, Incarnation e Warg foram desbloqueadas após o usuário confirmar explicitamente que o título correto é **The Hunger in the Void**. O alias foi confirmado no registro CUR-003, mantendo o rótulo original como evidência e o título canônico associado a `sotdl:the-hunger-in-the-void`. As **59 entradas** agora estão `captured`, com edição/permissão ainda não certificadas. Transcrição é `md-checked` pela captura exata; estrutura da publicação e mecânica permanecem `unreviewed`, automação `unsupported`. A decisão e os IDs atribuídos constam em `curation/reports/source-alias-hunger-in-the-void.json`; os registros pendentes anteriores foram arquivados, sem alteração dos textos originais ou das chaves do ledger.

A ocorrência Undine inclui uma nota editorial de errata na linha 22187. O sidecar distingue essa nota do bloco Full Entry, registra `applied=false` e conserva as duas referências de errata no texto. A imunidade não foi inserida no texto-fonte nem ativada no motor.

Cobertura do arquivo: linhas 1–177 são preâmbulo/protocolo/listas; as 23.195 linhas seguintes pertencem às 59 ocorrências, até a linha 23.372. A concatenação dos intervalos recompõe exatamente os bytes do arquivo após o preâmbulo. Isso comprova preservação do MD local, sem afirmar que sua transcrição de PDF está completa: por exemplo, a entrada Undine termina com um fragmento de prosa já presente no insumo. A revisão da publicação continua pendente. A reconciliação de todo o corpus continua na CUR-013.

## Reprodução e verificação

```powershell
npm run curation:ancestries
node tools/curation/ancestries.mjs --check
npm run curation:check
npm test
npm run build
```

`--check` não altera insumos, ledger ou derivados de curadoria; o runner pode gerar/atualizar seu cache de compilação em `tmp/`. A inicialização `--init-ledger` é exclusiva da primeira atribuição e recusa sobrescrever um ledger existente. Não a executar para corrigir nomes. Arquivos de ancestry órfãos são diagnosticados sem remoção automática.

O extrator valida todas as linhas com `StagingEntrySchema` antes de gravar. Falha em metadados duplicados/ausentes, cercas abertas, registro/insumo divergente, ledger ambíguo/incompleto e identidade duplicada. Limites desta ferramenta: input de até 16 MiB e linha JSONL de até 4 MiB. Os limites são próprios da ingestão CUR-008 e não modificam o contrato 1.0.0.

Os sete cenários em `tests/curation-ancestries.test.ts` verificam limites fora/dentro de cercas, CRLF, falhas estruturais, preservação de todos os bytes/evidências, variantes e tipos, isolamento da errata, estabilidade do ledger, determinismo e detecção de adulteração sem sobrescrita. Gates executados e aprovados: `npm run curation:check` (sete arquivos / 22 testes, incluindo hashes congelados e derivados), `npm test` (14 arquivos / 96 testes) e `npm run build` (TypeScript e Vite). Não foi necessário um novo cenário de navegador: esta tarefa não altera UI ou comportamento do criador.

Nenhum pack real utilizável foi compilado ou carregado no aplicativo. Próxima tarefa: CUR-009, extrator de paths.
