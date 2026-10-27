# CUR-009 — extração de paths

Escopo autorizado: extrair somente o MD de paths para staging 1.0.0 e sidecar de estrutura, preservando os insumos e contratos congelados. Referência: SPEC-001 e política de identidade/proveniência da Etapa A. Não compilar packs, executar progressão, limpar texto ou incorporar progressões de ancestry.

Aceite: herdar Novice/Novice Variant/Expert/Master/Legendary dos cabeçalhos de categoria fora de cercas; exigir Path Type compatível e metadados únicos; delimitar publicações independentes e blocos fechados; preservar texto, páginas declaradas, notas, tabelas de eventos/training e talentos. Localizar ganhos por cabeçalhos de nível explícitos, com intervalos/texto/hash; separar listas de talentos e eventos quando há título explícito, sem inventar calendário, talentos ou efeitos faltantes.

Implementação: parser específico para as cinco categorias; ledger persistente por nome/categoria/fonte; resolução pelo registro CUR-003; JSONL por publicação e pendências em `_pending`; relatório determinístico com cobertura e seções textuais. As seções são evidências de extração, não AST mecânica ou aprovação de completude. Progressões de ancestry citadas no preâmbulo não se tornam paths.

Verificação: fixtures com categorias, cercas/CRLF, metadados malformados, níveis quebrados em linhas, eventos e listas de talentos; conferência de todas as ocorrências/limites/bytes; IDs estáveis por publicação/categoria; determinismo, hashes e detecção de adulteração sem sobrescrita. Executar gates anteriores, testes unitários completos e build antes de concluir. Contagens locais não encerram CUR-013, que reconcilia todo o corpus.
