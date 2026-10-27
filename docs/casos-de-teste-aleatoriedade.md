# Matriz de testes Given / When / Then — Random Tables e Gerador

| ID | Dado | Quando | Então |
|---|---|---|---|
| RT-001 | tabela demonstrativa `3d6`: intervalos 3–8,9–12,13–18 | gerar 216 resultados exaustivos de três faces | contagens das faixas são respectivamente 56,104,56; não 1/3 cada |
| RT-002 | tabela `d20` com ranges completos | validar/rolar todos totais 1..20 | exatamente um outcome por total, sem overlap/buracos |
| RT-003 | `d6` apontando a duas tabelas `d20` | executar `evaluateTable` | log registra 1d6 e depois 1d20 com parentRollId e fonte |
| RT-004 | resultado que manda lançar `1d6` para moedas | resolver resultado | RollEvent secundário com faces/total e recurso mecanicamente tipado |
| RT-005 | tabela com faixa 1–5 e 7–20 | importar pack como curated | rejeitar entrada com lacuna 6 |
| RT-006 | sub-tabelas cíclicas A→B→A | validar/rolar | falhar com diagnóstico antes de afetar ficha |
| RT-007 | dois packs trazem `Background` de edições diferentes | habilitar só pack 1 | nunca executar tabela de pack 2 |
| RT-008 | seed fixa, versão de PRNG e contexto idênticos | gerar draft duas vezes | byte-for-byte mesmos eventos/resultados lógicos |
| RT-009 | RNG interno já rolou a origem | recalcular `CharacterView` 100 vezes | stats e RollEvents permanecem inalterados |
| CG-001 | ancestry manual LOCKED + outras etapas livres | gerar tudo/híbrido | ancestry preservada e escolhas dependentes elegíveis |
| CG-002 | profissão gerada e ancestry definida | rerrolar profissão | manter ancestry/choices independentes; `rerollIndex+1` e trace |
| CG-003 | slot com 0 opções elegíveis | gerar tudo | `fullyResolved=false`, status unresolved com motivo; sem tentativa infinita |
| CG-004 | faltam algumas tabelas oficiais | permitir fallback uniforme | sorteio só sobre elegíveis, rótulo «não oficial» |
| CG-005 | falta tabela oficial | negar fallback | unresolved sem inventar background/other result |
| CG-006 | personagem nível 7, magia aprendida em slot anterior | gerar slot posterior | elegibilidade avalia estado posterior à primeira escolha |
| CG-007 | ruleset habilita substituição de *Occult Philosophy* | gerar 2 spells no mesmo nível | swap elegível conforme regra sequencial configurada e registrada |
| CG-008 | preview pronto | clicar Cancelar | Character JSON/histórico persistido idênticos |
| CG-009 | preview pronto | clicar Confirmar | eventos e rolls persistidos atomicamente, stats recalculados |
| CG-010 | resultados aprovados | exportar HTML/PDF e importar JSON | sem re-roll nem alteração mecânica; fontes preservadas |
| CG-011 | ancestry oficial requer nova escolha condicional | sortear ancestralidade | criar slot descendente e resolver ou indicar pendência, sem omiti-lo |
| CG-012 | choice automático nível alvo 10 com powerful ancestry | gerar tudo | respeitar cronograma de origem, inclusive supressão de path quando definida |
| CG-013 | texto livre sem gerador curado | gerar tudo | campo permanece pendente/vazio; rascunho não marcado como 100% completo |
| CG-014 | personagem existente com escolhas travadas inválidas sob novo pack | gerar | mostrar conflito e pedir resolução explícita; sem troca silenciosa |

**Critério para implementação:** acrescentar fixtures do Core somente após curadoria do material original; até então os JSONs em `examples/` são dados inventados para testar contratos e distribuição.
