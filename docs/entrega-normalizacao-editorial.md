# CUR-012 — normalização editorial com diff reversível

Entrega de 2026-10-26, conforme `docs/plano-normalizacao-editorial.md`. Os quatro MDs foram diagnosticados e receberam **cópias derivadas**, sem alterar `rules/`, ledgers, staging bruto, evidências ou contratos congelados. Nenhuma revisão de mecânica, estrutura, permissão ou automação foi promovida.

## Resultado

Foram expandidas **2.275 ligaturas** e retiradas **53 linhas de watermark de comprador** nas cópias normalizadas. Isso corresponde a **2.216 linhas alteradas**: 2.163 linhas com ligaturas e 53 com watermark. Uma linha pode conter várias ligaturas. Terminadores de linha e posições das demais linhas foram preservados; retirar um watermark deixa a linha vazia com o mesmo terminador.

| Insumo | Ligaturas expandidas | Watermarks removidos | Linhas alteradas |
|---|---:|---:|---:|
| Ancestries | 465 | 0 | 447 |
| Paths | 204 | 8 | 201 |
| Regras/equipamentos/criaturas | 1.586 | 45 | 1.548 |
| Spells | 20 | 0 | 20 |

A normalização automática se restringe ao texto dentro de cercas e a duas regras:

- Ligaturas latinas U+FB00–U+FB06: ﬀ→ff, ﬁ→fi, ﬂ→fl, ﬃ→ffi, ﬄ→ffl, ﬅ/ﬆ→st. Não há NFKC global, alteração de frações, sinais, aspas ou tradução.
- Linha inteira no formato inequívoco `Nome (order #número)`: remove-se o conteúdo do watermark, preservando o terminador e guardando o original no diff. O número de pedido é a única remoção numérica autorizada por essa regra; dados de jogo não são removidos.

Uma linha semelhante fora de uma cerca fica preservada e é diagnosticada. Cabeçalhos, metadados de fonte e identidades não são reescritos pelo normalizador. Não houve união de parágrafos, remoção automática de páginas/colunas ou reconstrução de palavras quebradas.

## Artefatos e contratos

- `tools/curation/editorial-normalizer.ts` e `tools/curation/normalize.mjs`: diagnóstico, transformação, replay e validação.
- `curation/normalized/<nome-do-insumo>.md`: quatro cópias UTF-8 normalizadas, separadas dos insumos e do staging.
- `curation/normalization/changes.jsonl`: diff por linha alterada, com ID, arquivo/hash, linha, byte offset original, before/after, terminador, regra, ocorrências, colunas, responsável e motivo.
- `curation/normalization/diagnostics.jsonl`: diagnósticos com hash/range, trecho, motivo e ação normalized/review-required.
- `curation/normalization/overlays.jsonl`: **656 overlays** somente para ocorrências/segmentos com alteração editorial efetiva.
- `curation/reports/editorial-normalization.json`: política, contagens, hashes dos insumos/derivados, inventários e prova de replay nos dois sentidos.

`LineChangeSchema` e `NormalizationOverlaySchema` são estritos, versionados em schemaVersion=1 e definidos na ferramenta. O diff registra a linha completa antes/depois, sem executar expressões. Colunas são índices de unidades UTF-16 com base 1; byte offset usa os bytes UTF-8 originais a partir de zero. Aplicar ou reverter um diff exige que o conteúdo/terminador no local coincidam exatamente; alteração de contexto interrompe o replay.

Cada overlay referencia arquivo/registro do staging ou sidecar de segmentos, sujeito/ID quando existente e evidência MD original. Guarda hashes do texto antes/depois, `normalizedText`, `normalizationDiffRef` como string apontando para o próprio overlay e `changeRefs` com os IDs de mudanças no diff. Isso permite compor uma view compatível com o schema congelado, sem gravá-la sobre o staging bruto. Overlays são editorial-only e appliedToStaging=false; não equivalem a packs importáveis ou texto curado. Os testes validam a view composta sem mudar ID ou revisão.

Foram conferidos **4.162 registros de staging** e **3.589 segmentos do MD geral**. A mesma faixa já representada no staging não ganha um segundo overlay de segmento. Trechos em quarentena também recebem overlay quando necessário; isso não resolve sua categoria, fonte, escopo ou limites. Não há overlay sem alteração efetiva.

## Diagnósticos pendentes

Há **28.971 diagnósticos para revisão**, além dos 2.216 diagnósticos associados às mudanças aplicadas. São sinais editoriais, não 28.971 erros mecânicos confirmados nem bloqueios novos de entidades. As faixas podem se sobrepor.

| Sinal preservado | Diagnósticos |
|---|---:|
| Possível quebra de prosa | 26.186 |
| Número isolado | 1.630 |
| Possíveis colunas na mesma linha | 615 |
| Cabeçalho repetido perto de separador | 283 |
| Hifenização no fim da linha | 124 |
| Sequência possivelmente quebrada, como fi rst | 70 |
| Linha adjacente duplicada | 44 |
| Controle ou glifo privado de fonte | 10 |
| Colunas verticais de catálogo | 5 |
| Possível corrupção/replacement character | 2 |
| Caractere invisível/soft hyphen | 2 |

Todos os **1.630 números isolados** foram mantidos: podem ser páginas, resultados, preços ou exceções. Dados como 3d6, ranges 1–20, modificadores –6/+2 e frações continuam intactos. Para cada documento, os testes comparam todos os tokens numéricos antes/depois, descontando somente as linhas de watermark registradas. Bullets normais e os dois NBSP presentes na revisão atual também foram preservados. Glifos desconhecidos não foram convertidos em bullets presumidos.

Os possíveis cabeçalhos repetidos podem ser títulos significativos de seção/tabela. Palavras hifenizadas podem ser compostos legítimos; quebras podem pertencer a colunas. Nada disso é apagado, unido ou reordenado automaticamente. Characters corrompidos exigem contexto/fonte para recuperar o original e permanecem como diagnóstico, sem completar a informação por memória.

Essas pendências editoriais alimentam a revisão do lote em CUR-013 e a formalização do piloto. Os 245 bloqueios e os 1.320 trechos em quarentena de CUR-011 não foram liberados por limpeza tipográfica. Captured continua indicando captura preliminar, sem certificação de publicação ou motor.

## Reprodução e gates

```powershell
npm run curation:normalize
node tools/curation/normalize.mjs --check
npm run curation:check
npm test
npm run build
```

`--write` gera todos os dados e verifica os insumos/faixas antes de gravar. `--check` compara bytes sem regenerar os derivados; o runner pode atualizar seu cache local em `tmp/`. O manifesto, os hashes de cada arquivo do staging e o sidecar de segmentos estão registrados no relatório. Fonte ou staging divergente impedem a normalização; não se reaproveita aprovação após mudança de hash. O limite de leitura é de 16 MiB por MD, igual ao dos extratores.

Os sete cenários de `tests/curation-normalization.test.ts` comprovam Unicode restrito, preservação de sinais/bullets/NBSP, watermark somente no escopo permitido, CRLF/CR/LF/EOF, offsets, recusa de diffs adulterados, diagnóstico sem inferência, replay exato em ambos os sentidos, idempotência, números intactos em todo o corpus, overlays ligados à evidência e detecção de input/saída/staging divergentes sem sobrescrita.

Gates executados e aprovados: `npm run curation:check` (11 arquivos / 56 testes), `npm test` (18 arquivos / 130 testes) e `npm run build` (TypeScript e Vite). Os quatro MDs, os arquivos de staging/segmentos lidos e os 16 arquivos congelados mantiveram seus hashes. A prova byte a byte usa comparação nativa de buffers para evitar o custo de comparação recursiva do framework sobre milhões de bytes. Não houve mudança no fluxo do navegador que exigisse novo cenário E2E.

Próxima tarefa: CUR-013 — reconciliação de contagens, cobertura, exclusões, quarentena e pendências por publicação.
