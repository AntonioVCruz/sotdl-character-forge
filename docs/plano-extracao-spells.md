# CUR-010 — extração de spells

Escopo autorizado: extrair somente o MD de spells para staging 1.0.0, sem compilar packs, normalizar texto ou interpretar efeitos. Referências: SPEC-001, CUR-007 e políticas de evidência/identidade da Etapa A.

Aceite: herdar agrupamento Tradition/Path e rank por cabeçalhos fora de cercas; preservar Type/publicação/páginas por ocorrência; distinguir origens de paths das tradições usando classificação explícita e evidência do staging CUR-009. Nome igual em outra publicação ou contexto gera identidade separada. Não completar cabeçalhos opcionais do corpo, Type ou página física ausentes por inferência. Preservar listas, tabelas, efeitos, aftereffects e stat blocks dentro da spell correta.

Plano: parser de agrupamento → rank → nome → metadados/blocos; registro explícito dos agrupamentos; ledger persistente de identidades por fonte/origem/rank; JSONL por publicação e pendências em `_pending`; relatório sidecar com limites, marcadores textuais opcionais e evidências de categoria/rank. Metadados específicos de magia não alteram a raiz estrita do staging congelado. Revisão mecânica e automação continuam pendentes.

Diagnósticos: registrar divergências entre contagens declaradas/observadas e fontes pendentes. Comparar assinaturas textuais de introduções de paths ao texto de spells para sinalizar possíveis misturas já existentes no MD, sem excluir trechos ou reassociá-los automaticamente. Confirmar o diagnóstico com os trechos locais antes de encerrar a entrega; nenhum texto de PDF é certificado nesta tarefa.

Gates: fixtures de cercas/CRLF, herança e reset de rank, metadados/headers opcionais, colisões/republicações, ausência de inferência, fontes pendentes, mistura com paths, cobertura de todos os bytes/intervalos e hashes; estabilidade de ledger e determinismo; check sem sobrescrita de derivados adulterados. Reexecutar gates anteriores, suíte completa e build. CUR-013 e formalização mecânica permanecem tarefas posteriores.
