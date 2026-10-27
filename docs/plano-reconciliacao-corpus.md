# CUR-013 — reconciliação de contagens e cobertura

Revisão: 2026-10-27. A revisão dos inputs permanece a do manifesto de 2026-10-26. Escopo autorizado: conferir os derivados CUR-008 a CUR-012 contra os MDs e o registro de 95 fontes, sem corrigir livros, mesclar republicações ou liberar pendências.

Critérios: cada linha/bloco com destino ou motivo explícito; contagens declaradas comparadas às observadas; cabeçalhos distintos de ocorrências; IDs e textos preservados, inclusive duplicatas/quarentena; fonte/edição desconhecida continua pendente. Cobertura do MD não significa completude da publicação ou automação.

Plano: auditor independente das contagens e intervalos; validação de hashes das dependências, staging e normalização; inventário unificado de ocorrências/segmentos com referências aos artefatos; mapa de cobertura sem lacunas/sobreposição; matriz por publicação com declarações de inclusão/exclusão e observações; grupos de homônimos/texto igual sem mescla; findings explícitos para divergências e pendências, incluindo seis aliases não confirmados e o resumo de spells com 27/28 fontes.

Não considerar uma ausência de entidade como desaparecimento quando seu texto tem referência de quarentena ou a fonte declara exclusão do escopo. Não transformar sinais editoriais em erros mecânicos confirmados. Datas/hashes de revisão são explícitos, sem timestamp do host.

Gates: fixtures de cobertura (gap/overlap), cercas/headers, declarações e aliases; conferir todos os registros e corpos dos MDs; metadados sem destino devem falhar; nenhuma entidade sem correspondência no inventário; zero normalizações sem diff/destino; determinismo e detecção de adulteração; suíte integrada/completa e build. CUR-014 é o próximo recorte, sujeito às pendências que afetarem o piloto.
