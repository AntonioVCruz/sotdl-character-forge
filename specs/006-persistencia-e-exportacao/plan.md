# PLAN-006
Persistir no IndexedDB via adapter isolado; exportar/importar JSON validado e versionado; implementar migrações. `PrintableSheet` usa o mesmo CharacterView com CSS print; exportação HTML deve ser uma renderização de dados, sem serializar conteúdo-editable diretamente nem permitir execução arbitrária.

## Complemento v0.2
Adicionar `generationMetadata`, `rollEvents`, `selectionTrace` e `locks` no JSON e migração `v1→v2`; preservar histórico, nunca sobrescrever rolagens ao exportar. Export PDF/HTML deve consumir somente estado/CharacterView aprovados.
