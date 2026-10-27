# Constituição do projeto — v0.2

1. **Fonte única da verdade:** fichas, HTML e PDF são representações; o estado canônico é JSON versionado + regras/content packs versionados.
2. **Rastreabilidade obrigatória:** cada entidade mecânica aponta para fonte, página impressa (quando conhecida), variante e revisão. Nunca fundir republicações conflitantes silenciosamente.
3. **Motor puro:** nenhuma regra de cálculo depende de React, DOM, CSS, IndexedDB ou impressão; mesmo input e mesmo ruleset produzem mesmo resultado.
4. **Conteúdo distinto da lógica:** spells/items/paths declarativos por padrão; extensões executáveis excepcionais, tipadas, revisadas e testadas. Proibido executar expressões arbitrárias de packs (`eval`).
5. **Progressão auditável:** escolhas, substituições, exceções e house rules ficam no histórico, sem mutações silenciosas.
6. **Regras opcionais explícitas:** Core é baseline; divergências de suplementos são escolhas do ruleset, com precedência deliberada e alerta de incompatibilidade.
7. **Efeitos explicáveis:** toda alteração de atributo, Health, Defense, Speed, Power, Attack, dano etc. informa origem, escopo, fórmula e duração.
8. **Recalcular, não acumular incrementalmente:** ativar/desativar um efeito recompõe valores a partir do estado base, sem drift.
9. **Testes antes de completar tarefas:** testes unitários para cálculo/validação, cenários Given–When–Then e regressões de personagens reais autorizados.
10. **Acessibilidade e UX:** navegação por teclado, rótulos, feedback de pré-requisitos, desfazer; avisos claros, sem esconder opções inconsistentes quando houver interesse de auditoria.
11. **Privacidade e controle:** offline-first; salvar/exportar em arquivo aberto. Nenhuma conta, upload ou sincronização obrigatória no MVP.
12. **Direitos autorais:** catálogo privado/uso autorizado; aplicativo público não pode embutir livremente texto integral e arte de publicações sem permissão.
13. **Escopo incremental:** primeiro uma fatia funcional validada, depois ampliação dos livros e transformações complexas.
14. **Separação de fatos:** requisitos do produto e comportamentos observados no HTML não equivalem a afirmações de regras oficiais; itens fictícios e house rules devem ser identificados.

15. **Aleatoriedade explícita e reversível:** cada `ChoiceSlot` oferece manual/sortear, preserva resultado aprovado e permite refazer apenas a escolha desejada. Todo modo automático aceita restrições e locks.
16. **Tabelas como entidades de primeira classe:** tabelas têm ID por publicação, expressão de dados, faixas de resultado, condições, encadeamentos, fonte/página, revisão, efeitos e teste de cobertura; não tratar resultados `3d6` como linhas equiprováveis.
17. **Reprodução e auditoria:** registrar seed, versão do PRNG, decisão/ordem, dados individuais, resultados intermediários, tabela usada e política de fallback. Sorteios são comandos explícitos, separados da função pura de cálculo da ficha.
18. **Aleatório não rompe regras:** algoritmo usa o validador de elegibilidade e processamento sequencial idênticos ao modo manual; proíbe rerrolagem silenciosa até encontrar um resultado desejado ou ignorar resultados de tabela sem política expressa.
19. **Não criar conteúdo inexistente:** caso não haja tabela oficial para uma escolha, mostrar «seleção aleatória entre opções válidas (não tabela oficial)». Se a informação não puder ser escolhida com segurança, registrar pendência/revisão manual, nunca inventar regra ou história atribuída ao livro.
20. **Seleção independente:** travas e sub-seeds estáveis impedem que refazer um passo não relacionado altere escolhas já aceitas. Eventos afetados por mudanças de dependência exigem validação e confirmação da recomposição.
