# CUR-011 — regras, equipamentos e criaturas

Escopo: segmentar o MD geral para staging/sidecar de curadoria, sem limpar texto, reconstruir tabelas, aplicar erratas ou compilar packs. Referências: SPEC-001, CUR-007 e políticas de fonte/evidência/identidade.

Critérios: reconhecer containers de fonte/cobertura e cercas; separar unidades textuais internas, especialmente procedimentos, descrições/linhas de itens e stat blocks de criaturas. Conservar tabelas, traits e ataques com seu contexto. Nunca emitir todo um capítulo/fonte como uma única regra de fallback. Trechos sem classificação segura e tabelas sem contrato de dados ficam em quarentena explícita, com texto e evidência, em vez de ganhar kind/efeitos inventados.

Plano: parser de fonte/seção/bloco; segmentação por evidências textuais de cabeçalho, preços/disponibilidade e Difficulty+estatísticas; revisão das amostras e diagnóstico de confiança; ledger imutável com guardas de alteração; segmentos completos e JSONL tipado somente quando a categoria está sustentada. Preservar marcas BASE/OPCIONAL/REGIONAL/DEPENDÊNCIA OMITIDA no escopo do bloco ou da unidade, sem estendê-las a todo o livro. Região não identificada, dependência omitida ou atribuição entre duas fontes de errata exige bloqueio, sem apagar texto.

Paginação PDF declarada não vira página impressa. Números isolados de rodapé e marcadores de página não são limites semânticos por si sós. Veículos, hazards, relíquias, tabelas e descrições ambíguas precisam de subtipo/candidato próprio; criaturas não se tornam ancestries. A seção conjunta de erratas deve manter ambas as fontes e não escolher uma revisão automaticamente.

Gates: fixtures de fonte/subseção, fences/CRLF, categorias, agrupamento de traits/ataques, tabelas/preços multilineares, marcas de escopo e errata conjunta; cobertura de cada linha, hashes e fonte; ausência de capítulos emitidos como regra única; ledger/ordem/determinismo; recusa de insumo/saída alterados. Reexecutar curadoria anterior, suíte completa e build. CUR-012/013 e formalização mecânica continuam pendentes.
