# CUR-008 — extração de ancestries

Escopo autorizado: extrair o MD de ancestries para o staging 1.0.0, sem alterar contratos congelados, limpar texto, compilar packs ou aprovar mecânicas. Esta é a primeira tarefa da Etapa B, ligada à SPEC-001 e à rastreabilidade da constituição.

Critérios: reconhecer somente entradas na seção Ancestries e cabeçalhos fora de cercas; exigir metadados únicos e blocos fechados; preservar integralmente cada ocorrência e sua paginação declarada; manter Entry Type, blocos de texto, tabelas/traits/progressão e notas associados à ocorrência; separar Core/expansões, derivações, templates e powerful ancestries. A nota de errata de Undine fica separada do Full Entry e não é aplicada. Não completar lacunas do MD com outra fonte.

Plano: parser com intervalos inclusivos/hash de evidência; ledger inicial explícito e estável de identidades; resolução pelo registro CUR-003 (aliases propostos continuam pendentes); JSONL por fonte, pendentes em `_pending`; sidecar de extração para metadados que não pertencem ao schema congelado; relatório de contagem e limites. O staging permanece captured/blocked, com estrutura/mecânica não aprovadas e automação unsupported.

Gates: testes de limites/fences/metadados, separação de variantes/tipos e notas, validação de todas as linhas pelo StagingEntrySchema, comparação de trechos/hashes com o original, determinismo e detecção de derivados divergentes. `--check` deve ser somente leitura; `--write` valida tudo antes de gravar. Reexecutar os gates da Etapa A, suíte unitária e build. Contagem local ajuda a conferir este extrator, mas não encerra CUR-013 (reconciliação de todo o corpus).

Os arquivos gerados são conteúdo privado derivado dos MDs locais. Não entram no bundle do criador. O próximo trabalho após o aceite continua sendo CUR-009; não faz parte desta execução.
