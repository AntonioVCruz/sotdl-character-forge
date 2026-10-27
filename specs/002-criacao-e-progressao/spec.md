# SPEC-002 — Criação e progressão nível por nível
**Status:** Draft. **Prioridade:** P0. **Requisitos:** RF-003, RF-004.

## Jornada
Usuário cria personagem nível 0; escolhe ancestry/variante, atributos, histórico e equipamentos; evolui pelos níveis com ganhos de ancestry/path/talentos; não perde histórico ao editar níveis antigos.

## Aceitação
AC-001: exibir apenas escolhas válidas para nível atual e pré-requisitos, com motivo para as inválidas.
AC-002: normal paths e powerful ancestries seguem cronogramas declarados pelo pack (não embutir 1/3/7 como regras universais sem exceções).
AC-003: cada escolha registra evento sequencial, slot, nível e origem.
AC-004: desfazer decisão antiga recalcula slots e avisa escolhas posteriores afetadas, solicitando resolução, sem remover escondido.
AC-005: permitir o remanejamento de 1 ponto inicial somente quando o ruleset adotado permitir tal regra (não hardcode).
AC-006: importação de personagem com escolhas indisponíveis mantém IDs, registra pendência e não atribui benefícios arbitrários.

## Fora de escopo
Sincronização entre jogadores. A geração aleatória é parte do escopo, implementada com SPEC-008/009.

## Aditivo v0.2 — slots aleatorizáveis
**AC-007:** cada slot consumível (ancestry, variante, distribuições permitidas de atributos, profissões, background, caminho, talentos, escolhas mágicas, equipamento, extras) oferece manual/sortear com mesmo `EligibilityService`.
**AC-008:** todo slot tem ID estável, dependências, cardinalidade, disponibilidade, indicação se admite tabela oficial, pool uniforme entre opções válidas ou pendência.
**AC-009:** ao reabrir escolha anterior, preservar locks e apresentar plano de revalidação dos descendentes; não executar novos rolls por reconstrução.
**Dependências:** SPEC-001/008 (tabelas); SPEC-009 (orquestração gerador completo).
