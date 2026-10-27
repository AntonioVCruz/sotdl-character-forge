# SPEC-009 — Geração manual, híbrida e integral de personagem
**Status:** Draft | **Prioridade:** P0 | **Requisitos:** RF-016/017/018. **Dependências:** SPEC-001/002/008; integração SPEC-003/004/005/006.

## Visão
A criação deve admitir, em cada passo, **Escolher**, **Sortear** e **Rolar novamente**. O usuário também poderá selecionar **Gerar tudo aleatoriamente** de nível 0 a qualquer nível-alvo aceito, com revisão antes de confirmar. Só escolhas elegíveis são válidas; dados publicados são respeitados sem reponderação arbitrária.

## Jornadas detalhadas
1. **Manual:** usuário preenche todas escolhas e, a qualquer momento, pode clicar sortear em um slot isolado; proposta só vira escolha ao confirmar.
2. **Híbrido:** usuário trava slots (inclusive ancestry/path/traditions) e sorteia outros; rerroll de um slot não afeta locks/independentes. Dependências afetadas entram em revisão.
3. **Tudo aleatório:** configurar ruleset, packs, nível-alvo, house rules, seed opcional, restrições e política de fallback. Percorrer todos os slots obrigatórios sequencialmente, gerar preview de rolagens/escolhas/pendências, confirmar ou cancelar.
4. **Regeneração controlada:** aceitar build, depois rerrolar uma etapa; rastrear substituições, dependências e histórico.

## Seleção e políticas
- `official-table`: se existir procedimento curado aplicável ao slot, executar sua rolagem/ranges/efeitos conforme a fonte. Não substituir por sorteio de linha, não descartar resultado só porque é incômodo.
- `uniform-eligible`: quando não existir tabela oficial aplicável e política expressamente autorizada, selecionar **uniformemente** entre IDs de candidatos elegíveis, com rótulo `Aleatório entre opções válidas (não oficial)`. Não deduzir uma tabela fictícia de classe/magia.
- `unresolved`: falta de catálogo, sem candidato, efeito não automatizável, conflito de versões, decisão GM necessária ou campo narrativo sem tabela/gerador autorizado. Guardar causa/fonte/slot e admitir completar manualmente antes do aceite final.
- `locks`: preservar escolhas do usuário e reavaliar elegibilidade; proibir auto-substituição silenciosa de conteúdo travado ou opções históricas.
- As escolhas da mesma subida de nível são **sequenciais**, tal como exigem regras da fonte e opções aprovadas para spells.
- `reseed` explícito e `rerollIndex` por slot; lógica de dependências separa o que muda do que permanece.

## Critérios de aceitação
- **AC-001:** em **todo ChoiceSlot**, botão `Sortear` com rótulo de estratégia, dados/trace e opção `Escolher` manual.
- **AC-002:** `Rolar novamente` altera só slot alvo e dependentes invalidados; locks e slots independentes preservados.
- **AC-003:** quando houver tabelas curadas aplicáveis (p.ex. ancestry/background/wealth), usar essas tabelas, preservando probabilidades e consequências mecânicas.
- **AC-004:** se um slot não tiver tabela publicada, estratégia `uniform-eligible` é usada somente se autorizada, e seu caráter não oficial fica claro.
- **AC-005:** gerar do nível 0 ao alvo com slots de ancestry, variantes, atributos, narração, profissão, wealth/equipment, paths, traditions/spells, talentos/escolhas e progressões excepcionais que estejam modeladas no ruleset.
- **AC-006:** duas chamadas com mesmo contexto/seed/PRNG version/ruleset/pack versions geram o mesmo draft completo; recálculo/re-render não sorteiam novamente.
- **AC-007:** todo draft informa `fullyResolved`, pendências por slot, escolhas mecânicas, dados intermediários, sourceRef/página, critérios de eligibilidade e avisos.
- **AC-008:** aceitar draft atualiza Character de modo transacional, cancelar não altera nada.
- **AC-009:** alteração de regras, packs, ancestry/path ou nível atualiza grafo dependente e não mascara escolha inválida; locks são respeitados e problemas apresentados.
- **AC-010:** `RollEvent` e `ChoiceEvent` persistem em JSON; import/export/HTML/PDF mostram mesma ficha sem gerar novas escolhas.
- **AC-011:** geração de spells no mesmo nível processa slots em ordem, incluindo regra opcional de substituição explicitamente habilitada, nunca violando ranks/tradições/pré-requisitos.
- **AC-012:** resultado obrigatório não resolvido impede a indicação de «Personagem completo»; a UI mostra `Rascunho com pendências` e caminhos de ajuste.
- **AC-013:** suporte a políticas por slot: `manual`, `random`, `locked` e `optional skip` apenas quando o slot realmente é opcional; nenhum campo obrigatório desaparece.
- **AC-014:** ao trocar resultado aleatório por escolha manual, registrar substituição, preservar proveniência histórica e atualizar apenas descendentes afetados.

## Cenários Given/When/Then mínimos
**S01:** Dado uma ancestralidade travada e escolhas livres, quando sortear os demais slots, então ancestry permanece e as escolhas futuras seguem seus requisitos.
**S02:** Dado um `3d6` oficial, quando sortear, então o log contém 3 faces e resultado por range oficial.
**S03:** Dado um nível 7 com slot de magia e tradições habilitadas, quando gerar tudo, então toda magia aprendida é elegível na exata posição do histórico.
**S04:** Dado um slot obrigatório sem opções, quando gerar tudo, então `fullyResolved=false` e o preview mostra correção necessária.
**S05:** Dado um draft gerado, quando cancelar, então Character salvo permanece idêntico.

## Fora do escopo
Geração de personalidades com IA não baseada em fonte, integração online, NPCs/monstros arbitrários, distribuição pública de texto protegido. O personagem pode conter narrativa em branco/pending quando não houver gerador autorizado.
