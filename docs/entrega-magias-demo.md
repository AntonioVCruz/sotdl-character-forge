# Entrega — tradições e aprendizado demonstrativo

Registro da etapa anterior. O uso de magias e efeitos temporários fictícios está em [entrega-sessao-demo.md](entrega-sessao-demo.md); os limites abaixo descrevem a entrega original de aprendizado.

Data: 2026-10-26. Fatia da SPEC-004 integrada às SPEC-002/005/006/009. Plano anterior à implementação: `docs/plano-magias-demo.md`.

## Conteúdo fictício e proveniência
Pack `demo-magic@0.0.1`, fonte `demo-magic-source`, status fictício e página não informada. Nenhum texto ou regra foi extraído de livros.

| Tradição | Magias fictícias de rank 0 |
|---|---|
| Brasa Serena | Lanterna de Brasa, Fio de Calor |
| Eco de Vidro | Sino Distante, Reflexo Breve |

O Aprendiz da Centelha mantém o treinamento já existente e recebe depois os slots `tradition` e `spell`. O Guardião não recebe slots mágicos. Tradições são registros `rule` com `demoSlot=tradition`; magias são registros `spell` com `traditionId`, rank, caminho requerido e descrição. A seleção é declarativa e limitada ao contrato demonstrativo.

## Comportamento entregue
- Planejamento sequencial: pré-requisitos anteriores devem estar válidos para descobrir tradição; uma tradição válida é obrigatória para aprender magia.
- Somente magias de rank 0 da tradição atual, do caminho correto, curadas e em packs ativos entram no pool. Manual e aleatório usam os mesmos candidatos.
- Sorteio é `uniform-eligible`, somente com autorização, sem se apresentar como tabela oficial. Seed, algoritmo, contador, candidatos, origem, ordem e substituições permanecem nos eventos.
- Geração completa reavalia slots condicionais após escolher o caminho. Híbrido e rerrolagem individual respeitam locks; cancelar a prévia preserva a ficha.
- Trocar tradição mantém a magia incompatível com aviso, inclusive quando travada. Revisar magia registra substituição e mantém o aprendizado anterior no histórico.
- Caminho marcial e nível 0 suspendem escolhas mágicas sem apagar eventos ou travas. Retornar ao mágico revalida caminho, treinamento e aprendizado existente.
- Ficha apresenta grimório com nome, rank, tradição de origem do aprendizado, descrição, fonte e situação. Aprender não conjura: efeitos mágicos não alteram automaticamente a ficha; alcance, duração, usos e ativação exigem resolução manual.
- Desabilitar ou perder a fonte preserva decisões e mostra pendências, sem declarar o personagem completo. O texto da magia fica indisponível até revisar escolha/fontes.
- JSON v2 foi ampliado com dois novos IDs de slot, sem mudar campos dos eventos existentes. Arquivos v1 continuam migrando e v2 antigos continuam abrindo; personagens mágicos sem aprendizado ficam com pendências explícitas. Versões antigas do aplicativo não reconhecem os novos IDs.

## Verificação e rastreabilidade
**50 testes unitários/integrados e 9 testes E2E Chromium aprovados**, incluindo regressões anteriores. Build TypeScript/Vite aprovado; avisos já existentes de comentários de pureza do Zod não impedem a geração.

| Critério | Evidência |
|---|---|
| SPEC-004 AC-001/002/003 | Identidade por pack/fonte/ID, duas tradições e suas magias; rank e caminho filtrados; uma magia definida como escolha explícita da demonstração |
| SPEC-004 AC-005 (subconjunto) | Revisão substitui o evento atual mantendo história; incompatibilidade não desaparece silenciosamente |
| SPEC-004 AC-007 | Texto e fonte no grimório; conjuração e efeitos exigem resolução manual |
| SPEC-004 AC-008/009/010 (0–1) | Sorteio por elegibilidade, aprendizado sequencial, fallback autorizado e respeito a locks |
| SPEC-006 / SPEC-009 | Roundtrip JSON, IndexedDB, reload, cancelamento e reprodutibilidade sem novos sorteios ao reabrir |

Testes específicos: `tests/magic.test.ts` e `tests/e2e/magic.spec.ts`. Cobrem ambas as tradições, escolha incompatível, rank/caminho incorretos, fonte desabilitada, troca com magia travada, rerrolagem isolada, suspensão/retorno por caminho/nível, JSON antigo e novo. A geração integral foi verificada com 24 seeds fixas, cobrindo caminhos marcial e mágico. Captura inspecionada: `test-results/magic-grimoire.png` (não versionada).

## Limites e trabalho posterior
Esta entrega não conclui toda a SPEC-004. Permanecem pendentes tradições oficiais, múltiplos aprendizados, regras de substituição de Occult Philosophy, castings/estado de sessão, ativação de efeitos, progressão 2–10, HTML/PDF e conteúdo autorizado real. Os IDs condicionais do caminho pertencem ao contrato fictício atual; não representam um motor genérico para qualquer publicação.
