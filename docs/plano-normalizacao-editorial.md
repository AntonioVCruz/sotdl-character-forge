# CUR-012 — limpeza editorial rastreável

Escopo: diagnosticar os quatro MDs e produzir cópias normalizadas, diffs reversíveis e overlays de texto para as ocorrências existentes. Não editar `rules/`, evidências, ledgers, staging bruto ou contratos congelados; não aplicar efeitos, reconstruir tabelas ou promover revisão mecânica.

Limpezas automáticas delimitadas: expandir somente as sete ligaturas latinas de apresentação U+FB00–U+FB06 e retirar o texto de linhas inteiras de watermark no formato inequívoco `Nome (order #número)`, dentro de cercas. Manter terminadores de linha, inclusive quando o conteúdo da linha vira vazio. Não usar NFKC global, dicionários ou reflow de parágrafos.

Diagnósticos sem correção presumida: números isolados, hifens/quebras de linha, colunas prováveis, cabeçalhos repetidos próximos de separadores, linhas duplicadas, replacement characters, controles/caracteres privados, espaços/caracteres invisíveis e possíveis fragmentos de ligaturas. Bullets normais permanecem intactos e são contabilizados. Nunca apagar dado, range, sinal, preço ou valor mecânico por parecer rodapé.

Artefatos: cópias em `curation/normalized/`; changes/diagnostics/overlays em `curation/normalization/`; relatório de hashes, contagens, pendências e política em `curation/reports/editorial-normalization.json`. Overlays referenciam ID/sujeito, arquivo/linha do staging ou segmento, hash/range do MD, texto normalizado e changes que o justificam. Não escrever os overlays de volta no staging que os extratores verificam.

Aceite: reconstrução exata nos dois sentidos, segunda normalização sem novas alterações, identidade/estado bruto intactos, referência de cada alteração à revisão do input, todos os trechos alterados com destino ou diagnóstico, original preservado e provas de que números mecânicos não mudam. Tests de CRLF/EOF, cercas, Unicode, watermarks, casos ambíguos e adulteração. Executar o gate integrado, suíte completa e build antes de fechar. Pendências editoriais e reconciliação do corpus continuam explícitas para CUR-013.
