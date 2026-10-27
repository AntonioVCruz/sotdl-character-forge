# Entrega da fatia de catálogo — 2026-10-25

Registro da primeira entrega. A integração posterior com personagem demonstrativo está em [entrega-nivel-zero.md](entrega-nivel-zero.md); as limitações abaixo descrevem o estágio original do catálogo.

## Resultado
Aplicativo React/Vite/TypeScript com importação de packs JSON, exemplos fictícios, habilitação explícita por ruleset, consulta de fonte/página/variante/revisão/status e filtros por nome/ID/fonte/tipo. IndexedDB grava snapshots transacionais; o estado visível só muda após confirmação da gravação. Conteúdo textual é renderizado como texto pelo React, nunca HTML executável.

O módulo `packages/catalog` não depende da UI ou de IndexedDB. `storage.ts` é o adaptador de persistência. `RandomTableSchema` é o contrato de entrada para SPEC-008, com limites de dados, ranges, outcomes, subtabelas e rolagens quantitativas declarativas. Não há sorteio nem interpretação de efeitos nesta entrega.

## Matriz de rastreabilidade
| Critério SPEC-001 | Implementação / evidência |
|---|---|
| AC-001 | `parsePack`, `validatePack`; testes de IDs duplicados, fonte inválida, versões e normalização |
| AC-002 | Registry indexado por ID; testes de nomes iguais em fontes distintas e E2E com duas spells homônimas |
| AC-003 | `setEnabled`, `resolveHistoricalReference`; teste preserva referência histórica ao desabilitar ou faltar pack; E2E retira da consulta e persiste seleção |
| AC-004 | Importação antes da gravação, snapshot atômico; teste IndexedDB confirma preservação após erro; E2E importa arquivo inválido |
| AC-005 | Cards com fonte/página/status/variante/revisão e avisos de curadoria |
| AC-006 | Conflito de mesmo pack+versão rejeitado; uma revisão ativa por pack; colisão entre IDs ativos impede habilitação |
| AC-007 | Schema de tabela e validação de cobertura/status; incompletas consultáveis com aviso |
| AC-008 | Teste de tabelas homônimas de fontes diferentes, com cadeias preservadas e IDs distintos sem deduplicação por nome |
| AC-009 | Testes de lacunas, overlap, ciclos, outcomes, referências e DiceExpr inválidos |

## Validação executada
- `npm test`: 11 testes unitários/integrados aprovados.
- `npm run test:e2e`: 2 testes Chromium aprovados (importação, habilitação, busca, reload, rejeição de inválidos, coexistência de variantes, texto malicioso e largura móvel).
- `npm run build`: TypeScript e bundle de produção aprovados. Rollup emite avisos de comentários de pureza da dependência Zod; não impedem o build.
- Instalação final das dependências: auditoria npm com zero vulnerabilidades reportadas.
- Auditoria original dos exemplos: executar `npm run audit:demo`; não valida regras oficiais nem representa motor de geração.

## Limites e próximos passos
- AC-003 é verificado por contrato de referência histórica; não há tela ou arquivo de personagem para integrar ainda.
- O manifesto aceita uma fonte por pack e dependências com versão exata. Conteúdo de publicações diferentes usa packs distintos. Erratas não são automaticamente aplicadas; somente seleção explícita de versões/fontes.
- `curated` expressa a declaração do curador. Validação estrutural não certifica fidelidade mecânica; propriedades adicionais declarativas são preservadas, sem execução.
- Não há migração de schemas anteriores, sincronização entre abas, exportação de snapshot da biblioteca ou cache PWA. O catálogo funciona sem backend, com dados locais; abrir/recarregar requer servir o app.
- Os compêndios e HTML da Liliana não estão neste workspace; somente fixtures fictícias foram utilizadas.
- Próxima fatia: SPEC-008 e o mínimo de SPEC-002/009 para personagem nível 0, escolhas manuais/aleatórias, locks, preview/confirm/cancel, ficha e JSON com rastreio de rolls. Este teste vertical prioritário permanece pendente; não marcar geração como implementada.
