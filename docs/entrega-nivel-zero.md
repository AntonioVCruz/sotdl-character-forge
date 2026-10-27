# Entrega — personagem demonstrativo de nível 0

Registro da entrega anterior. A extensão para nível 1 e migração JSON v1→v2 está em [entrega-nivel-um.md](entrega-nivel-um.md). Os limites abaixo descrevem o estágio original desta fatia.

## Escopo entregue
Fatia vertical das SPEC-002/003/005/006/008/009 usando apenas conteúdo fictício. Catálogo habilitado → escolhas sequenciais → tabelas/dados → prévia → confirmação → ficha → IndexedDB/JSON. Os quatro slots são ancestralidade, background dependente, equipamento e objeto curioso. Não equivale a um personagem oficial de SotDL completo.

- Modo manual, híbrido por slot e tudo aleatório, todos respeitando locks. Escolhas manuais travam por padrão.
- Geração sempre em rascunho. Confirmação verifica que ficha e catálogo não mudaram. Cancelamento não grava eventos. Dados locais só são atualizados após concluir a transação IndexedDB.
- PRNG `mulberry32-fnv1a-v1`, seed + ID estável do slot + índice de rerrolagem. Amostragem de faces por rejeição para evitar viés modular. `3d6` lança três faces; tabelas encadeadas e quantidades têm logs pai/filho.
- Cada evento registra decisão, política/autorização, candidatos elegíveis, ordem, seed/versão, resultados, versões/fontes e evento substituído. Histórico anterior é preservado.
- Estratégias `manual`, `demo-table`, `official-table` e `uniform-eligible` distintas. A UI não rotula fixtures como oficiais.
- Fonte ausente/desabilitada, efeito desconhecido, tabela incompleta ou mudança de dependência produzem pendências. Benefícios de escolhas pendentes são suspensos, sem apagar decisões.
- Ficha pura com breakdown, atributos fictícios, equipamento e recursos. Mudar aparência/renderizar, calcular, exportar e importar não consome RNG.
- JSON validado estruturalmente e quanto a sequência, faces, somas e vínculos. Ao consultar a ficha, consequências são conferidas contra as escolhas/fontes sem refazer sorteios; divergências ficam em revisão. O JSON é um formato editável, não uma assinatura criptográfica.
- Um personagem local, edição de nome/notas, export/import e proteção contra sobrescrita por uma aba com versão antiga do personagem.

## Arquivos principais
- `packages/random-tables/index.ts`: PRNG, dados, schemas de trace/efeito, opções manuais, resolução de tabelas e limites.
- `packages/character-generator/index.ts`: schemas, planner/elegibilidade, eventos, prévia/commit, cálculo puro e JSON.
- `packages/character-generator/storage.ts`: transação IndexedDB com comparação do estado anterior.
- `apps/web/CharacterBuilder.tsx`: controles de criação, preview, ficha e histórico.
- `examples/demo-level-zero.json`: duas ancestralidades, dois equipamentos e background alternativo, todos fictícios.

## Evidências e rastreabilidade
| Comportamento / critérios | Evidência |
|---|---|
| SPEC-008 AC-001/002 | Enumeração exata das 216 combinações de 3d6: extremos com peso 1, 10/11 com peso 27; ranges com pesos 56/104/56 |
| SPEC-008 AC-003/004 | Cadeia d6→d20→d6 quantitativo com IDs pai/filho, fontes e quantidade aplicada; seleção manual equivalente sem faces inventadas |
| SPEC-008 AC-005/007/009 | Testes de fonte desabilitada, contexto incompatível, tabelas incompletas, ciclos; limites de 32 níveis e 100 rolls |
| SPEC-008 AC-006/008/010/011 | Substreams reproduzíveis, comandos separados do cálculo, handlers tipados e pendência para efeitos desconhecidos |
| SPEC-009 AC-001/002/003/004/013/014 | Mesmos candidatos para manual/random, consentimento de fallback, locks e rerrolagem isolada; E2E manual/híbrido |
| SPEC-009 AC-006/007/008/012 | Preview determinístico, sem mutação do original; cancelamento/commit obsoleto; rascunhos incompletos não são declarados completos |
| SPEC-009 AC-009 | Alterar ancestralidade preserva background anterior com pendência; fonte desabilitada suspende benefícios |
| SPEC-009 AC-010 / SPEC-006 parcial | Roundtrip JSON e reload IndexedDB preservam eventos/rolls; importação inválida não altera personagem salvo |
| SPEC-003 parcial | Cálculo puro e breakdown; repetição não acumula modificadores; bônus alterados no JSON não se tornam regras |

Validação: **28 testes unitários/integrados e 5 testes E2E Chromium aprovados** (incluindo regressões do catálogo), build TypeScript/Vite e auditoria original das fixtures. Os E2E verificam os três modos, confirmação/cancelamento, export/import, mudança de dependências, fonte desabilitada e largura móvel. Capturas desktop/mobile ficam em `test-results/` (não versionado).

## Limites explícitos
- Nível-alvo somente 0. Sem profissão/wealth/path/spell oficial; nenhum slot oficial é presumido a partir de texto livre. O nível 0 entregue é demonstrativo com os quatro slots declarados.
- Handlers mecânicos suportados: `stat-add` e `resource-add`. ASTs de condições, comportamentos extras e efeitos desconhecidos exigem revisão; não há ativação de condições/transformações ou simulação de combate.
- Packs de ancestralidade/equipamento são restritos ao contrato fictício desta fatia; tabelas usam contexto `slotKind`/`ancestryId`. Mais de uma tabela aplicável produz conflito explícito.
- Migrações de schema/PRNG ainda não existem; versões desconhecidas são rejeitadas sem sobrescrever dados. Catálogo e personagem usam bancos locais separados; sem transação conjunta ou sincronização automática entre abas do catálogo.
- Não há HTML/PDF exportável, PWA/cache de aplicação, backend ou sincronização. O servidor local serve a aplicação; dados e cálculos são locais.
- Próximo avanço: definir e curar o subconjunto autorizado e implementar progressão de nível 1 com novos slots e validadores, mantendo as garantias já testadas.
