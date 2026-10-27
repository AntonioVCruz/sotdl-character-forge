# Fontes, escopo e erratas — contrato 1

CUR-006 registra em `curation/source-policy.json` as declarações conferidas no MD geral, com hashes e linhas. O Core é a base; suplementos, variantes, regiões e erratas exigem seleção explícita. Nenhuma relação desta entrega está habilitada ou mecanicamente certificada.

A precedência de **19nov17 sobre 10oct17 somente nas correções repetidas** aparece nas linhas 7, 145–146 e 64991. O cabeçalho da linha 64988 cita os dois PDFs juntos; o bloco não permite atribuir cada frase a uma versão com segurança. A alegação foi confirmada no MD, sem PDFs disponíveis para comparação. Por isso, `supersedes` e os vínculos `errata-for` têm estado `declared-in-md`, não `verified`. Não se conclui que a errata nova substitui integralmente a antiga ou todo o Core. As correções de ancestries/paths/spells foram declaradamente omitidas desse bloco e não podem ser reconstruídas por inferência.

Na extração posterior, cada correção deve ter alvo, trecho original, trecho corrigido, revisão de origem e evidências próprias. Só depois de comparar o conteúdo pode-se confirmar `supersedes` daquele alvo. Uma regra regional conserva a região/ambiente exato; `[OPCIONAL]` e `[REGIONAL]` ficam desligados por padrão, `[DEPENDÊNCIA OMITIDA]` gera pendência. Não classificar todo um suplemento como opcional ou regional apenas porque um bloco tem essa marcação.

O adaptador futuro do ruleset deverá persistir um sidecar versionado contendo:

- As referências exatas `packId/version` habilitadas, compatíveis com `RulesetSchema` atual.
- Seleções por sujeito com `packId/version/entityId`, variante e contexto/flags opcionais/regionais.
- Overrides explícitos por alvo, revisão substituta, relação verificada, escopo e responsável/motivo. Se dois overrides elegíveis disputarem o mesmo alvo, exigir resolução explícita, sem escolher por data, ordem de importação ou nome.

`chooseRevision` valida a escolha exata entre candidatos; ausência, ambiguidade ou versão indisponível gera pendência. Ele não executa errata, não habilita packs e não altera personagens. O `RulesetSchema` atual aceita somente `id/packs`: não adicionar esses campos novos na raiz sem migração própria. A forma desse sidecar fica congelada na CUR-007; sua integração ao consumidor pertence às etapas posteriores.

Aplicar uma revisão deve criar evento auditável com referência anterior e nova, preservar o snapshot anterior e recalcular o personagem. Remover uma fonte não apaga escolhas históricas. Sem suporte tipado à correção, manter resolução manual ou bloqueada, mesmo se a precedência editorial for conhecida. Importar um pack continua independente de habilitá-lo.
