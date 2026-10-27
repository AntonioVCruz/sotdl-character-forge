# Estratégia de validação

## Pirâmide
1. **Contrato/validação:** schema de pack, IDs únicos, fonte/página, dependências, versionamento.
2. **Unidade:** derivação de atributos, composição de efeitos, stacks, cap, precedência, reprocessamento de eventos.
3. **Integração:** character+ruleset+registry→view e escolha de path/spell→ficha.
4. **E2E:** wizard até export; impressão A4; reabertura de JSON; edição sem perda.

## Testes ouro (regressão)
- Uma ficha **sem efeitos** mostra somente atributos e progressão reconhecidos.
- Alternar um efeito 100 vezes deixa o mesmo estado que uma única ativação; reverter restaura exatamente o original.
- Modificar `Defense` não altera `Health` sem dependência prevista.
- Desabilitar um pack produz aviso no character, não apaga seus eventos.
- Uma substituição de magia ocorre apenas após a magia substituída existir no histórico; a ordem é respeitada, inclusive duas escolhas no mesmo nível sob regra habilitada.
- Formas distintas mantêm o mesmo estado-base e fazem rollback completo de atributos e tamanho quando terminam.
- PDF/print e visualização usam o mesmo `CharacterView`, evitando divergência de estatísticas.
- Importações malformadas não executam scripts nem destroem salvamentos.

## Fixture Liliana
O HTML de referência expõe 16 parâmetros-base e 31 efeitos. Capturar um conjunto **autorizado** de snapshots antes/depois para casos simples: `arcane_armor`, `rune_speed`, `alter_size_grow`, `alter_size_shrink`, interações de efeitos sobrepostos. Esses resultados são *comportamento do HTML*, não aprovação automática como regra oficial. Após implementação, comparar com textos/fontes.

## CI mínima

O gate automático está em `.github/workflows/ci.yml`: `npm ci`, `npm test` (`vitest run`) e `npm run build` (`tsc --noEmit && vite build`) com Node.js 22, em pull requests e em pushes para `main`. A mesma sequência é o gate local; ver o README, seção «Gate de CI (testes e build)».

Playwright (`npm run test:e2e`) não faz parte desse gate. Os testes de ponta a ponta instalam o Chromium, chamam Python com `pypdf` e cobrem PDF, download e HTML `file://`. Entram num workflow posterior, quando rodarem de forma estável no runner. Até lá, execute-os localmente antes de mudanças de interface.

## Definition of Done por task
Implementação, tipagem, teste unitário relevante, aceitação verificável, atualização de docs, referência de fontes (quando mecânica), tratamento de estado de erro e ausência de regressões.

## Testes obrigatórios de aleatoriedade (SPEC-008/009)
- Reprodutibilidade: mesmo seed, versão de PRNG, ruleset, packs e locks → mesmo draft, traces, rolls e resultado, independente da ordem de renderização.
- Dice: cada face em `[1, sides]`, `3d6` só produz 3–18 e tem distribuição triangular (p.ex. 10/11 mais frequentes que 3/18); nunca amostrar uniformemente o total.
- Tabelas `d20` com ranges `[1,2]`, `[3,19]`, `[20,20]` preservam peso real; verificar lacunas/sobreposições como erro na curadoria.
- Encadeamento: primeiro `d6` seleciona tabela e, depois, `d20` gera registro; sub-rolagens quantitativas gravadas em traces com `parentRollId`.
- `official-table` vs `uniform-eligible`: tratar explicitamente candidatos inválidos, resultados inconciliáveis, escolhas exclusivas e ausência de candidatos; não mascarar uma estratégia como outra.
- Híbrido: locks não mudam; rerrolar profissão não muda ancestry nem detalhes independentes; mudanças de dependência tornam escolhas seguintes `needs-review` e pedem aprovação.
- Tudo aleatório: gerar nível 0→10 pela ordem e requisitos do ruleset; spells da mesma rodada enxergam escolhas anteriores e regras opcionais de troca.
- Permissões: não usar packs desabilitados; persistir trace sourceRef, ID do dado, hash/versão; PDF/HTML/JSON refletem a escolha aprovada.
- Transação: cancelar preview não altera ficha. `fullyResolved=false` se um slot obrigatório ficou sem resultado e não declarar conclusão.
- Segurança: input malformado, loops/nesting arbitrário, `eval` e conteúdo de tabela não confiável bloqueados.
Ver `docs/casos-de-teste-aleatoriedade.md` para matriz Given-When-Then completa.
