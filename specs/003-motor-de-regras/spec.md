# SPEC-003 — Motor determinístico e explicável
**Status:** Draft. **Prioridade:** P0. **Requisitos:** RF-005, RF-006, RF-008.

## Aceitação
AC-001: `calculateCharacter` é puro e fornece valor+breakdown por estatística.
AC-002: equipar/desequipar item com modificador validado atualiza valor exibido imediatamente; não muda o stat base.
AC-003: ativar/desativar magia/condição recalcula sem drift, inclusive após abrir/salvar.
AC-004: aplicar regras de stacking, exclusão mútua, caps, duração e contexto com IDs de regra/fonte.
AC-005: efeitos especiais ainda não suportados aparecem como "requer resolução manual".
AC-006: mudança de forma é reversível e não mistura forma anterior com posterior.
AC-007: boons/banes de ataque específico não afetam indiscriminadamente outros ataques.
AC-008: mudança de atributo propaga corretamente apenas aos valores dependentes conforme o ruleset.

## Exemplo comportamental vindo do HTML
`arcane_armor` adiciona 2 ao cálculo de Defesa **na ficha Liliana**. Esse caso serve como fixture de comportamento, a ser conferido contra fonte original antes de entrar como regra publicada.

## Fora de escopo
Regras de todas as 95 fontes simultaneamente; interpretação de linguagem natural de spells sem curadoria.

## Aditivo v0.2 — resultados mecânicos de tabelas
**AC-009:** outcomes de tabelas validadas se convertem em eventos de modificador/recursos/itens/condições **tipados**, no ponto correto da progressão; o motor de cálculo não executa sorteios.
**AC-010:** detalhes aleatórios com efeito mecânico (p.ex. bônus ou quantidade determinada por sub-rolagem) usam o valor persistido em `RollEvent`, não rolado novamente durante renderização/salvamento.
**AC-011:** sem handler/efeito formalizado, resultado permanece visível com aviso e não aplica bônus inventado.
