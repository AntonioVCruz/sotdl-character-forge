# CUR-009 — paths extraídos para staging

Entrega de 2026-10-26, conforme `docs/plano-extracao-paths.md`. O MD de paths produziu **392 ocorrências de publicação**, **380 combinações de nome/categoria** e **59 rótulos de fonte**. Após as correções expressas do usuário para Seer/Troll Hunter, todas estão captured. A revisão anterior do MD foi arquivada; os contratos congelados permanecem intactos. Não houve alteração do criador, de progressões executáveis ou de packs importáveis.

## Artefatos e identidade

- `tools/curation/path-extractor.ts`: parser por categoria, resolução das fontes, segmentação textual, validação e geração determinística.
- `tools/curation/paths.mjs`: runner que compila a ferramenta local para `tmp/curation/`, sem executar conteúdo dos insumos.
- `curation/path-ledger.json`: 392 chaves persistentes por publicação/categoria, com seletores de cabeçalho/fonte. Nome corrigido pode atualizar o seletor sem regenerar a chave.
- `curation/entries/<source-id-escapado>/path.jsonl`: 392 ocorrências captured de 59 publicações resolvidas, sem bloqueios de extração.
- `curation/history/source-alias-hunger-in-the-void-2026-10-26/path.before.jsonl`: ocorrência anteriormente pendente preservada no histórico.
- `curation/reports/paths.json`: hashes de entradas, ferramenta, utilitário compartilhado de linhas, ledger e saídas; contagens, cobertura, metadados e seções por ocorrência.

O staging segue o `StagingEntrySchema` congelado. A categoria faz parte da identidade via `variantKey` (novice, novice-variant, expert, master ou legendary). O ledger não depende da ordem de leitura; aliases propostos não geram identidades canônicas. Publicações homônimas continuam separadas, incluindo os dois Adepts e as versões de Priest/Rogue e outros nomes repetidos. Os 84 paths do Core mantêm fonte própria.

Uma republicação de **Adept** começa na linha 251 com outro `Path Type`, sem repetir o cabeçalho de nome da linha 168. Ela tem intervalo e metadados próprios; a evidência adicional do cabeçalho herdado registra a origem do nome. Não foi fabricado um cabeçalho dentro de `originalText` nem unida a publicação ao texto anterior. As demais ocorrências começam em cabeçalhos explícitos. Cada entrada também referencia a linha da categoria herdada, separadamente do seu intervalo.

## Categorias e seções

| Categoria declarada | Ocorrências |
|---|---:|
| Novice | 19 |
| Novice Variant | 23 |
| Expert | 151 |
| Master | 197 |
| Legendary | 2 |

`originalText` conserva integralmente cada ocorrência: metadados, cercas, texto, tabelas, talentos, níveis e notas. Não há limpeza editorial. O relatório sidecar particiona cada Full Entry em trechos com intervalo, texto original, hash e estado `unreviewed`: introdução, ganhos de nível, listas de talentos, eventos e treinamento. A concatenação dos trechos recompõe exatamente o respectivo bloco de texto, sem perder conteúdo entre títulos. Talentos dentro de ganhos de nível continuam no bloco daquele nível; listas separadas têm seção própria. Seções de treinamento são candidatos textuais, podendo ser narrativa ou apêndice; não viram automaticamente tabelas de rolagem ou talentos tipados.

Os níveis são extraídos somente de cabeçalhos explícitos. Cabeçalhos quebrados, como `Level 8` seguido do nome na próxima linha, continuam literais. `<LEVEL 1 WILD BEAST DEVOTEE` é marcado `decorated`; `Level8MasterPriestoftheDemonLord`, `joined`. O texto permanece intacto, sem inserir espaços ou reescrever o insumo. `Level 11 and Higher Paragon` preserva `levelQualifier=and-higher`; não gera benefícios individuais para todos os níveis seguintes.

O diagnóstico compara os títulos encontrados ao calendário típico declarado pelo próprio MD (Novice 1/2/5/8, Expert 3/6/9, Master 7/10). Encontrar os cabeçalhos não comprova conteúdo completo ou mecânica correta. Nenhum ganho ausente é criado; nenhuma condição, escolha, evento ou efeito é executado. Classificação exige concordância entre categoria herdada e Path Type. Não classificar por números encontrados no corpo: Jotun, Incarnation e as outras progressões de ancestry citadas no preâmbulo permanecem fora da extração.

## Evidência, cobertura e pendências

Transcrição fica `md-checked` pela captura exata; estrutura da publicação e mecânica continuam `unreviewed`, automação `unsupported`, permissão `needs-review`. Páginas impressas e de PDF são declarações separadas. Nenhuma alegação de auditoria do insumo foi convertida em certificação de PDF.

**Priest of the Demon Lord** passou a `captured` após o usuário confirmar o título canônico **The Hunger in the Void**. O mesmo alias resolvia as quatro ancestries antes pendentes; o registro e ambos os stagings foram regenerados de forma consistente. Todo o texto e as páginas declaradas permaneceram intactos. A decisão consta em `curation/reports/source-alias-hunger-in-the-void.json`. Os registros ainda exigem revisão de edição, completude e mecânica antes de compilar conteúdo utilizável.

Os bloqueios estruturais de **Seer** e **Troll Hunter** foram resolvidos por instrução explícita do usuário. Em Seer, foi removida somente a linha `Level 6 Juggernaut`; todo o restante permaneceu como estava, inclusive o fragmento de prosa que a seguia. O Full Entry de Troll Hunter foi substituído integralmente pelo texto fornecido pelo usuário, removendo a mistura com Spellweaver e a repetição de nível 10. Ambos agora contêm apenas cabeçalhos de níveis 7 e 10 e estão captured, com os mesmos IDs do ledger. Revisão mecânica continua unreviewed; nenhuma inspeção de PDF ou automação foi certificada.

A revisão anterior do MD, manifesto, registro de fontes e relatórios está em `curation/history/paths-seer-troll-hunter-2026-10-26/`. O texto fornecido está em `curation/corrections/paths-seer-troll-hunter-2026-10-26/troll-hunter.txt`; a trilha de correção e hashes, em `curation/reports/paths-seer-troll-hunter-correction.json`. Manifesto, fontes e ambos os relatórios de extração foram regenerados para manter hashes e intervalos consistentes.

Foram localizados 1.016 cabeçalhos explícitos de ganhos de nível após as correções, dez seções candidatas de eventos, sete de treinamento e nove listas de talentos, além de 392 introduções. Frases narrativas iniciadas por `level 8, ...` permanecem dentro de seu trecho; não viram cabeçalhos. A presença de todos os níveis típicos não promove nenhuma ocorrência a revisão mecânica aprovada.

As 29.614 linhas da revisão corrigida do MD estão contabilizadas: 29.439 pertencem às ocorrências; 175 pertencem ao preâmbulo/cabeçalhos de categoria/separadores, registrados como intervalos explícitos. Não há sobreposição de ocorrências. Esta conferência cobre somente o MD de paths; CUR-013 ainda deve reconciliar o corpus completo, exclusões e cobertura por publicação.

## Reprodução e gates

```powershell
npm run curation:paths
node tools/curation/paths.mjs --check
npm run curation:check
npm test
npm run build
```

`--write` verifica insumo, registro, ledger, identidades e todos os objetos de staging antes da gravação. Input limitado a 16 MiB e registro JSONL a 4 MiB. `--check` compara bytes sem alterar insumos/ledger/derivados; o runner pode atualizar seu cache de compilação em `tmp/`. `--init-ledger` serve apenas à primeira atribuição, recusa sobrescrita e não deve ser usado para corrigir nomes. Arquivos de path órfãos são diagnosticados sem exclusão automática; os arquivos de ancestry permanecem independentes.

Os oito cenários de `tests/curation-paths.test.ts` cobrem nomes/categorias herdados, republicações sem cabeçalho repetido, fences/CRLF, metadados incompatíveis ou incompletos, seções e níveis sem inferência, todos os intervalos/hashes, bloqueio dos conflitos estruturais, identidades e estabilidade após correção editorial, reprodução e adulteração de input/saída sem sobrescrita.

Gates executados e aprovados: `npm run curation:check` (oito arquivos / 30 testes, incluindo os checks de insumos, contratos, ancestry e paths), `npm test` (15 arquivos / 104 testes) e `npm run build` (TypeScript e Vite). Os quatro MDs originais e os 16 arquivos congelados da Etapa A mantiveram seus hashes. Não houve mudança de UI ou fluxo do criador que exigisse novo cenário de navegador.

Próxima tarefa: CUR-010, extrator de spells. A integração mecânica dos paths permanece nas etapas posteriores.
