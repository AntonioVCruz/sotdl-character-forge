# Entrega — usos de conjuração e efeitos temporários

Registro da etapa anterior. A impressão da ficha e dos efeitos foi entregue em [entrega-impressao-a4.md](entrega-impressao-a4.md).

A ação de equipamento, sua combinação com efeitos e preservação no descanso foram acrescentadas em [entrega-equipamento-demo.md](entrega-equipamento-demo.md).

Data: 2026-10-26. Fatia demonstrativa das SPEC-003/004/005/006. Plano: `docs/plano-sessao-demo.md`.

## Regras fictícias declaradas
Pack `demo-spell-session@0.0.1`, fonte `demo-session-source`, independente dos packs de aprendizado. Não altera as versões publicadas anteriormente. A referência à magia é resolvida em runtime; fontes podem ser desabilitadas independentemente para preservar histórico com avisos.

| Magia | Efeito temporário inventado | Modificador |
|---|---|---|
| Lanterna de Brasa | Manto da lanterna | Defense +1 |
| Fio de Calor | Passo aquecido | Speed +1 |
| Sino Distante | Ressonância serena | Will +1 |
| Reflexo Breve | Véu de reflexo | Defense +1 |

Cada magia tem **dois usos por descanso**, próprios da demonstração; não consome a reserva arcana do caminho. Alcance dos efeitos: próprio personagem. Duração: até encerrar ou descansar. Os textos anteriores das magias continuam como narrativa de aprendizado; as novas regras de laboratório estão explicitamente nesta fonte separada.

## Comportamento
- Aprender uma magia não consome usos nem ativa efeitos.
- `session.actions` armazena comandos separados do histórico de criação: `cast`, `activate`, `end` e `rest`. Cast registra evento original de aprendizado e referência exata à definição, fonte e versão; não armazena bônus executável do usuário.
- Conjurar consome uso e cria uma instância inativa. Ativar/encerrar não consome outro uso; não é possível conjurar novamente com efeito anterior da mesma magia ainda solicitado como ativo.
- Uma magia admite uma instância ativa por vez. Ativar é idempotente; encerramento e recálculo recompõem valores a partir da base, sem acumular bônus.
- Descanso zera consumo, encerra e invalida instâncias anteriores, preservando ações. Uma instância anterior ao descanso não pode ser reativada; deve haver nova conjuração.
- Trocar o evento de aprendizado, caminho, tradição, nível ou perder fonte pode suspender um efeito. Encerrar/descansar continua disponível mesmo sem fonte. Contagem é por ID da magia entre descansos, portanto substituir o evento de aprendizado não restaura cargas.
- Efeitos solicitados como ativos são revalidados a cada cálculo. Se fonte e aprendizado original voltarem a ser válidos, podem voltar a se aplicar; a UI distingue estado Ativo/Suspenso/Inativo. Encerrar remove essa solicitação.
- O cálculo da ficha é puro. Cada modificador temporário tem breakdown com nome, fonte e ID da conjuração; o painel mostra duração, escopo, condição e bônus declarado.
- JSON v2 recebe `session` com default vazio para arquivos anteriores. IndexedDB e JSON preservam ações, usos e estado de ativação; render/import/export não executam comandos nem consomem RNG.
- Validação rejeita sequência, referências ou posições históricas inconsistentes. Fontes/versões divergentes ou handlers desconhecidos suspendem efeitos. Importação sem catálogo é estrutural; fidelidade dos efeitos à definição é verificada ao calcular, sem confiar em valores arbitrários do arquivo.

## Código e validação
- `packages/session/model.ts`: schemas e replay determinístico de comandos.
- `packages/session/index.ts`: definições de sessão, contagem de usos, instâncias, validação e comandos puros.
- `packages/character-generator/index.ts`: integração no cálculo, importação e comandos da ficha.
- `apps/web/SessionPanel.tsx`: controles de uso, ativação, encerramento, descanso e histórico.

**61 testes unitários/integrados e 11 E2E Chromium aprovados**, incluindo as regressões anteriores; build TypeScript/Vite aprovado. Avisos de comentários de pureza do Zod permanecem sem impedir o build.

| Critérios | Evidência |
|---|---|
| SPEC-003 AC-001/003/008 | Cálculo base + efeitos com breakdown; 100 ciclos de ativação/encerramento restauram exatamente os valores anteriores; as quatro definições modificam apenas seu atributo |
| SPEC-003 AC-004 (subconjunto) | Uma instância ativa por magia, duração explícita, regras de descanso e suspensão por fonte/contexto |
| SPEC-003 AC-005/011 | Definição não suportada e fonte/versão divergente não aplicam bônus |
| SPEC-004 AC-006 (subconjunto) | Consumo de conjuração separado do aprendizado; limites e descanso, sem reset por reaprendizado |
| SPEC-005 AC-001/002/003 | Painel com fonte, duração, condição, escopo, valores, ações e ficha recalculada |
| SPEC-006 AC-001/002/003/007 | JSON/IndexedDB preservam sessão; arquivos anteriores recebem default vazio; fonte ausente não apaga histórico |

Testes específicos em `tests/session.test.ts` e `tests/e2e/session.spec.ts`: conjuração/ativação/salvar/reabrir/encerrar, limite, descanso, arquivo antigo, fonte ausente, aprendizado substituído, nível 0, versão adulterada, sequência inválida e largura móvel. Captura do painel inspecionada: `test-results/session-active.png` (não versionada).

## Limites
Regras inteiramente fictícias, uma magia aprendida por personagem e efeitos aditivos sobre si. Não há timer, combate/ataques, targets externos, concentração, caps/stacking geral, condições/transformações, uso compartilhado de reservas ou regras oficiais de castings. Duração e alcance fora do laboratório continuam manuais. O contrato JSON foi ampliado aditivamente em v2; versões anteriores do aplicativo não reconhecem `session`.
