# Revisão final dos PRs #14 e #15

**Disposição posterior das #9/#10:** contrato Zod de slot/comandos integrado ao runtime, rótulos de slots legados corrigidos e [aceite S1 técnico/UX executado pelo Codex](aceite-s1-issues9-10.md). Encerramento restrito ao L0 demonstrativo; L1 adiado na #21. Não há aprovação externa atribuída ao Designer. As pendências descritas nos commits originais abaixo são histórico da revisão, não o estado atual.

Revisão técnica do Codex em 2026-10-30, contra a main `76414a3`, respeitando a ordem da dependência. Ambos os PRs já estavam mesclados; os registros abaixo são revisões posteriores do código integrado.

**Atualização posterior em 2026-10-30: os dois P2 abaixo foram corrigidos.** A confirmação agora revalida a prévia no reducer e a UI mostra o motivo do bloqueio, preservando a última escolha aprovada. Sorteios locais funcionam em Manual com as mesmas guardas dos demais modos. Foram adicionadas cinco regressões do adapter, uma de componente e dois E2E do wizard. Os dois testes isolados da revisão também passaram após a correção. O relato abaixo conserva o comportamento observado nos commits originais; contrato Zod e aceite UX continuam pendentes nas #9/#10.

## Base #14: sem achados técnicos bloqueantes

Commit revisado: `b06819d3c7ae596f8fda35d427b17689accc6c90`. [Revisão registrada](https://github.com/AntonioVCruz/sotdl-character-forge/pull/14#pullrequestreview-5708427983).

Conferidos isolamento da falha do criador e preservação da biblioteca de fontes, foco no alerta, retry sem apagar, reset conectado a `clearCharacter`, espera da operação assíncrona e tratamento de falha sem remontar prematuramente. Sem callback não existe botão Recomeçar. A ressalva anterior de `onReset` foi resolvida neste commit.

Os sete campos de Stats acompanham o schema demonstrativo, aceitam zero e exibem lacunas como indisponíveis. Não foram introduzidas fórmulas oficiais fictícias. O logger padrão de erros capturados do React está suprimido; o logger do boundary não imprime mensagem, stack ou props. PrintSheet e a paridade das lacunas impressas continuam fora do escopo desta fatia.

Os arquivos-base revisados permanecem iguais na main. Este resultado permite revisar a camada seguinte; não encerra sozinho a #9 nem certifica aceite do Designer.

## Dependente #15: correções necessárias

Commit revisado: `95745b74ed91bcad524ff536ec41215ec34d96c6`. [Revisão registrada com comentários nas linhas](https://github.com/AntonioVCruz/sotdl-character-forge/pull/15#pullrequestreview-5708428109). A relação de ancestralidade com o commit do #14 foi verificada antes de avaliar os achados.

### P2 — confirmação aceita prévias que perderam elegibilidade

Local: `apps/web/l0-demo.ts`, fluxo `confirm` (linha 668 e cópia na 673), e `reconcile` (linha 591).

Reprodução pelo fluxo disponível na UI:

1. Confirmar Ancestry Core.
2. Preparar a prévia do benefício Ofício extra, sem confirmá-la.
3. Voltar a Ancestry e confirmar Only Human.
4. Voltar ao benefício: suas opções estão inelegíveis, pois o adapter não fornece Human Development Tables, mas a prévia antiga ainda apresenta Confirmar.
5. Confirmar grava `ben-job` em `confirmedIds`, apesar da inelegibilidade atual.

`reconcile` considera apenas escolhas confirmadas e ignora slots contendo só prévias. `confirm` copia a prévia sem verificar seu contexto, cardinalidade ou elegibilidade atuais. A revisão L0 ainda pode sinalizar a pendência; isso não justifica gravar uma opção inválida como confirmada. Invalidar/revisar prévias afetadas e revalidar no comando de confirmação, conservando a última escolha aprovada quando a nova proposta for rejeitada.

### P2 — sorteio explícito por slot fica bloqueado no modo Manual

Local: `apps/web/l0-demo.ts:448`, em `sortBlockReason`.

Mesmo com seed e autorização de fallback uniforme, o modo Manual devolve bloqueio e o comando `roll` não produz prévia. O [fluxo vigente](fluxo-aleatoriedade.md), seção Modo manual, e a regra 15 da [constituição](../constitution.md) mantêm escolha manual/sorteio em cada slot. A geração conjunta automática pode depender do modo; um sorteio local explicitamente solicitado deve continuar disponível quando os demais requisitos estiverem satisfeitos.

Manter os bloqueios por trava, fontes/dados ausentes, seed e autorização, retirando apenas o bloqueio imposto pelo modo ao sorteio local.

## Validação e limites

- 38 testes existentes de seis arquivos aprovados: ErrorBoundary/Stats, armazenamento/geração, ChoiceSlot, adapter L0, wizard e stubs Human.
- 17 testes E2E existentes aprovados, incluindo ficha, sessão, equipamento, impressão e runtime offline. Esses testes não são uma inspeção visual dos frames 1b/1e do wizard novo.
- Dois testes isolados de revisão, guardados em `tmp/review-pr14-15/`, reproduziram os dois achados acima e falharam nas expectativas corretas. Não foram adicionados como testes falhando na suíte versionada.
- Na revisão original, nenhum código de produção foi alterado. As correções foram executadas posteriormente, conforme a atualização acima, com regressões versionadas em `tests/l0-demo.test.ts`, `tests/choice-slot.test.tsx` e `tests/e2e/wizard-l0.spec.ts`.

O navegador integrado estava indisponível; não houve inspeção visual interativa nem parecer do Designer. Testes de componente/teclado e a suíte Playwright existente fornecem evidência técnica, sem substituir esse aceite.

O contrato de props é TypeScript; a validação Zod de slot/evento solicitada na #9 continua pendente. IDs do demo legado precisam de disposição no aceite do AC-X1, cujo atendimento declarado no #15 é limitado ao wizard. L1, Gerar tudo completo, drawer de origem e polimento mobile permanecem adiados; geração oficial continua desligada.

## Disposição

Revisão técnica do #14 concluída sem achados bloqueantes. Revisão original do #15 concluída com duas correções P2, agora atendidas pela implementação posterior. Os registros foram publicados como `COMMENT`, por se tratar de PRs mesclados e da mesma conta; não são `APPROVE` ou aceite atribuído a outro papel. #9 e #10 permanecem abertas para contrato, disposição do AC-X1 do demo legado e aceite UX. A correção técnica dos dois P2 não certifica esses aceites restantes.
