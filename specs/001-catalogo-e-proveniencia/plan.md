# PLAN-001
Plano executado e esclarecimentos da primeira fatia: [implementation.md](implementation.md). Evidências: [entrega-catalogo.md](../../docs/entrega-catalogo.md).

Criar schemas TypeScript/Zod para Source, Pack e RuleEntity. Criar `Registry` imutável por ruleset, com índices por tipo/tradição/rank/path/ID, relatório de conflito, e manifesto dos packs. Curadoria MD→JSON é revisão humana assistida, não regex cega. Preservar `sourcePage` e origem. Testar dois conteúdos com mesmo nome em fontes diferentes.

## Complemento v0.2
Acrescentar `RandomTableSchema` ao catálogo e índice por `targetChoiceSlot`, `context`, fonte e variante. Validar ranges contra domínio de DiceExpr, encadeamentos e pack dependencies. Não copiar tabelas do Core sem curadoria/licença; começar com fixture fictícia.
