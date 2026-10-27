# Primeira fatia vertical com geração aleatória (recomendada)

## Objetivo
Em uma mesma interface: personagem nível 0, escolher manualmente ou sortear um background em tabela fictícia, sortear com `3d6` e `d6→d20`, definir ao menos uma escolha elegível sem tabela oficial, mostrar consequências tipadas, travar escolha, rodar «Gerar tudo» e confirmar preview.

## Implementação em ordem
1. Catalog/Schema: `RandomTable` e validação de DiceExpr/ranges/cadeias com `examples/demo-random-tables.json`.
2. Random engine: rolar `3d6` corretamente, `d6→d20`, seed/PRNG version/trace.
3. Slot planner: um slot com tabela, um com `uniform-eligible`, um com opção manual, todos com IDs estáveis.
4. UI: `Escolher / Sortear / Rolar novamente / Lock` nos três slots.
5. Gerador: `Gerar tudo até nível 0` com `GenerationDraft` e preview; nenhuma persistência antes do Confirmar.
6. Replays/estados: export/import dos eventos e resultados; CharacterView recalcula sem rodar novamente.
7. Expandir para nível 1 e só depois implementar a progressão 0→10 e as exceções de ancestralidades/poderes.

## Critérios para aumentar o catálogo
Protocolo de curadoria por fonte em `docs/tabelas-aleatorias-e-curadoria.md`, com fonte/página em inglês e autorização; não preencher lacunas mecânicas do PDF por palpite. Regras e valores do demo NÃO são canônicos.
