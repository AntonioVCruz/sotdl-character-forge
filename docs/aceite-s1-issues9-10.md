# Aceite S1 — issues #9 e #10

Verificação executada pelo **Codex em 2026-10-30**, a pedido do dono para tratar as duas issues. Escopo vigente: ChoiceSlot reutilizável e wizard **L0 demonstrativo**, conforme a emenda da #10 aos frames **1b/1e**. L1, citado no texto inicial da #9, foi transferido explicitamente para a [#21](https://github.com/AntonioVCruz/sotdl-character-forge/issues/21). O motor legado de níveis 0–1 continua separado.

Este registro identifica a autoria real da validação técnica e UX. Não é uma assinatura externa do Designer STD nem uma revisão independente de outra pessoa. O aceite de encerramento S1 aqui documentado foi executado pelo Codex por testes, inspeção do código e inspeção das capturas; não se infere aprovação de um papel apenas porque a CI passou.

## Contrato e integração

`apps/web/choice-slot-contract.ts` contém schemas Zod de opção, rastro, cardinalidade, slot e comandos. `ChoiceSlot` valida os dados antes de renderizar; callbacks ficam fora do contrato serializável. Tipos são derivados do schema. Opção inelegível exige motivo; IDs de opções e escolhas são únicos; cardinalidade é ordenada; estados vazio/parcial/confirmado têm consistência explícita. Estados de revisão/suspensão preservam escolhas antigas sem certificá-las como elegíveis.

`levelSchema` em `packages/character-generator/level.ts` é compartilhado com o motor e permite somente 0/1. O contrato genérico aceita ambos; `L0ActionSchema` restringe o adapter atual a nível 0 e às chaves/ações conhecidas. O reducer rejeita comandos malformados antes de executar qualquer mutação. Suporte de schema a L1 não implementa nem habilita o wizard L1.

Os dois P2 do #15 foram corrigidos no PR #20 e continuam cobertos: confirmação revalida o contexto atual, e sorteio explícito por slot funciona em Manual. Slots oficiais continuam inelegíveis, `fictionalData` permanece explícito e nenhum conteúdo oficial foi habilitado.

## Matriz de aceite

| Critério | Evidência e disposição |
|---|---|
| AC-CS1/CS2 | Ações indisponíveis mantêm motivo associado; opções inválidas permanecem visíveis e focáveis. E2E tenta ativar opção oficial bloqueada e confirma que ela não é selecionada. |
| AC-CS3/CS4 | Rerrolagem somente após resultado; prévia Confirmar/Descartar por slot. Regressões cobrem callback antigo, troca de Ancestry e preservação do valor aprovado. |
| AC-CS5/CS7 | Badges em texto, UI em português e termos mecânicos em inglês. Capturas inspecionadas; sorteio fictício não é rotulado como tabela publicada. |
| AC-CS6 | Painel recebe foco, Space/Enter selecionam opção válida, opção inválida não é selecionada, Esc fecha e devolve foco ao acionador. Foco visível de 3 px no wizard, conferido no navegador. |
| Cardinalidade N / estados | Schema e teste do componente cobrem N=2, estado parcial e bloqueio de uso até preencher a quantidade. Testes rejeitam cardinalidade invertida, duplicatas e estado confirmado sem escolhas válidas. |
| AC-W1 | Três colunas medidas em 1440 e 1100 px; mini-ficha sticky. Capturas em ambas as larguras inspecionadas sem texto ou ações cortados. Não se exige que a posição vertical sticky seja idêntica à do stepper após rolagem. |
| AC-W2/W3 | Stepper L0 na ordem da emenda, estados em texto e apenas o passo ativo no centro. L1 permanece fora do stepper. |
| AC-W4/W7 | Mini-ficha só recebe escolhas confirmadas; descartar prévia não altera o valor aprovado. Teste de navegador confirma Strength 11, descarta Size e preserva a ficha. |
| AC-W5 | Travar, incluir no Gerar tudo e sortear são controles distintos. Testes existentes verificam que travar/incluir não consomem rolagem. Gerar tudo completo permanece desabilitado por escopo. |
| AC-W6 | Revisão incompleta mostra pendências e bloqueia confirmação. E2E percorre o Core fictício, preenche todas as escolhas obrigatórias e só então confirma a revisão completa. Campos opcionais/dados ausentes permanecem identificados. |
| AC-W8/W9 | Seed inicial vazia, cópia testada sem inventar seed; stepper navegável por teclado e anúncios de mini-ficha em `aria-live`. |
| AC-X1 | Ficha e prévia legadas agora usam rótulos para escolhas e pendências, inclusive `Interesting Thing`, caminho e treinamento. E2E verifica ausência de `interestingThing:`, `novicePath:` e `pathTraining:` na ficha. IDs de proveniência e JSON técnico em detalhes de diagnóstico continuam disponíveis intencionalmente; o critério trata dos rótulos da jornada de criação. |
| AC-X2 | ErrorBoundary do #14 mantém a falha contida, com foco, retry/reset distintos e tratamento assíncrono de descarte. Testes existentes preservados. |
| AC-X3/X4 | Adapter fictício e fallback não oficial explícitos; relatório e PR de encerramento apontam os frames 1b/1e e as funcionalidades adiadas. |

## Evidências reproduzíveis

`tests/choice-slot-contract.test.ts` cobre o contrato em runtime, incluindo entradas inválidas que devem deixar o reducer intacto. `tests/choice-slot.test.tsx`, `tests/l0-demo.test.ts`, `tests/wizard-l0.test.tsx` e `tests/ui-shell.test.tsx` cobrem componente, reducer, navegação e boundary.

`tests/e2e/wizard-l0.spec.ts` cobre os dois P2 e o aceite de teclado/geometria/revisão completa. Gera capturas locais em `tmp/acceptance-s1/`: `choice-slot-invalid.png`, `desktop-1440.png`, `desktop-1100.png` e `review-l0.png`. As quatro imagens foram inspecionadas na validação do Codex. Reproduzir com `npx playwright test tests/e2e/wizard-l0.spec.ts` no ambiente de testes configurado.

O navegador integrado não estava conectado; as capturas e interações foram produzidas pela suíte Playwright local. A inspeção é visual das capturas e funcional por testes, não uma sessão interativa assinada por outra pessoa.

## Limites e encerramento

Validação da entrega: 257 testes em 35 arquivos aprovados após regenerar os hashes locais que referenciam o motor; 32 testes diretamente afetados revalidados após alinhar os limites dos campos. Suíte Playwright completa: 21 testes aprovados. Build TypeScript/Vite aprovado, sem mudança nos dados dos saves. A regeneração local atualizou os metadados a partir de CUR-015 porque o motor passou a importar o schema de nível compartilhado; transcrições e mecânicas permaneceram preservadas.

Aceite restrito ao S1 demonstrativo: a revisão confirmada vive no estado do wizard desta sessão; não representa importação, persistência ou export de personagem oficial. Modal Gerar tudo completo, drawer de origem completo, lista de personagens e polimento mobile continuam adiados como no brief. Não há novo handler mecânico nem alteração dos IDs/valores dos saves legados.

As #9/#10 podem ser encerradas no escopo S1 com este aceite identificado. A #21 conserva L0→1; a #7 continua responsável pela trilha de compilador/índices e o consumo real permanece nas CUR-033/034. O [relato da revisão anterior](revisao-pr14-pr15.md) é mantido como histórico, com a disposição posterior de cada pendência.
