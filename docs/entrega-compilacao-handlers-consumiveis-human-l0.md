# Compilação e handlers consumíveis Human L0 — atividades 6/7

Entrega posterior: [lote real Core projetado e conferido localmente em `1.1.0`](entrega-core-real-issue34-atividade3.md), com artefatos próprios em `tmp/curation/core-real/1.1.0/`. Essa evolução não amplia silenciosamente a receita sintética ou os handlers descritos abaixo; o consumo das consequências reais continua sujeito a seus gates.

Implementação local do Codex em 2026-11-03, sobre main `a717813`. Avanço incremental das atividades 6/7 da #34 com o contrato aceito `sotdl.human-l0.consumable@1.0.0` e a fixture pública fictícia da atividade 2. Não é aceite completo dessas atividades nem integração do procedimento real.

Os PRs #44 → #47 → #46 foram mesclados nessa ordem, após corrigir os três P2 e conferir a CI em cada etapa. A main final `bf847e5` também passou na CI, conforme o [parecer com execuções e hashes](revisao-pr44-pr47-pr46.md). O trabalho incremental desta entrega foi preservado/restaurado localmente e ainda não foi publicado. Os lotes integrados são sintéticos, sem aceite dos dados reais; a receita desta entrega continua aceitando somente a fixture da atividade 2, sem incorporar silenciosamente os outros lotes.

## Comandos e artefatos

```powershell
npm run curation:compile:consumable
npm run curation:validate:consumable
```

Receita: `curation/human-l0-consumable-compilation.json`. Saída ignorada: `tmp/curation/compiled-consumables/human-l0-consumable-fixture/1.0.0/`.

| Arquivo | Conteúdo |
|---|---|
| `bundle.json` | Envelope `sotdl.human-l0.consumable-bundle@1.0.0`, documento validado, hash de conteúdo, hash dos bytes de entrada, versão e índices. |
| `index.json` | Tabelas/colunas/resultados, consultas, itens, concessões, side rolls e pendências emitidos. Os 350 registros agrupados continuam contagens. |
| `report.json` | Receita/entrada/saída, hashes, contagens, resoluções manuais, gates e trabalhos adiados; `realLotsAccepted: false`. |

É um formato de consumo separado do catálogo congelado, sem importação por `importPack` ou substituição dos packs mecânicos `0.2.0`. A versão do envelope não altera o documento consumível ou o save Human existente.

Compilador: `tools/curation/human-l0-consumable-compiler.ts`. Gate compartilhado com o runtime: `packages/curation/human-l0-consumable-bundle.ts`. Mesmos bytes/receita produzem os mesmos arquivos. O check recompila a entrada fixada e compara todos os artefatos; recalcular hashes de uma saída adulterada não a torna válida.

O writer prepara o diretório completo e publica por rename. Saída existente é imutável: arquivo alterado, ausente ou extra causa erro, preservando a versão anterior. Destinos ficam sob `tmp/`; links simbólicos no caminho/arquivos de destino são recusados. Uma área de preparação interrompida pode permanecer ignorada sem substituir a saída válida.

A fixture pública foi fixada em LF por regra específica em `.gitattributes`, sem mudança de payload JSON. A receita fixa os bytes LF: SHA256 `904c56b2c1693d8dbcac3691dda3eebbc405640f05ae26a91d0a0b518dd5ae58`. O compilador não normaliza antes de conferir o hash: CRLF ou qualquer byte diferente é erro. Fontes e derivados reais não foram alterados.

## APIs e semântica dos handlers

Exportadas por `packages/character-generator/runtime.ts`, implementadas em `human-l0-consumables.ts`:

- `newConsumableSession(character, bundle)`: prende uma sessão local ao hash do bundle e ao personagem Human existente.
- `performConsumableCommand(session, mechanicalPacks, bundle, actionId, command)`: registra decisões explícitas, com ID idempotente; reutilizar ID com outro conteúdo é erro.
- `calculateConsumableSession(...)`: revalida fontes e reproduz decisões; retorna inventário por origem, dinheiro exato em bits, profissões, habilidades de idioma distintas, resultados e diagnósticos.
- `parseConsumableSession(...)`: valida o envelope próprio da sessão e o histórico Human contido nele. Não migra saves atuais.

Comandos: tabela com coluna/faces/modificador explícitos; lookup ligado à ação produtora anterior; concessão identificada com escolha/resultado quando exigidos; equipar/guardar ou empunhar/deixar de empunhar item possuído. Os handlers não sorteiam. A #35 ordena passos e decide quando sortear, registrando contexto/seed/algoritmo.

O replay confere faces/modificadores e resolve faixas pelo total. Lookups usam o resultado exato do produtor, sem dado adicional. Subtabelas exigem nova entrada explícita ligada à ação anterior; no limite, `bounded-recursion`. Side rolls selecionados mantêm `side-roll-context-required`, sem execução implícita pela posse.

Após integrar o #47 na main, o domínio `authorized-rules` passou a exigir uma guarda no handler incremental: retorna `modifier-rule-context-required` até haver suporte ao contexto dos eventos autorizados. Não trata IDs de regras como valores numéricos nem aplica bônus sem contexto. A compatibilidade tem regressão específica e permanece parte do trabalho local não publicado.

Concessões são aplicadas uma vez por origem/sujeito/fase. Uma linha e sua concessão nomeada compartilham origem quando identificam exatamente a mesma consequência. Fala e leitura/escrita ficam separadas. Dinheiro usa `BigInt`, sem arredondamento ou confusão com preço. Posse cria inventário sem aplicar uso. Pendências e sujeitos externos mantêm diagnósticos/entradas de origem, sem conceder benefícios ao personagem.

Defense entra no cálculo existente por contribuição explícita: base Agility ou valor fixo, substituição antes de efeitos diretos e do limite final. Aplica somente equipado/empunhado na fase suportada. Mais de uma substituição, inclusive com equipamento manual, suspende os números com diagnóstico; guardar recompõe os valores preservando inventário. Estados continuam no histórico original, sem reinicialização.

Bundle ausente/alterado ou contexto mecânico indisponível suspende consumo. Mudar ancestry/procedimento suspende decisões antigas, preservando histórico/estados. Alterações só de estado/ajustes manuais não invalidam a seleção. A sessão contém referências/decisões, sem copiar tabelas, perfis ou evidências.

## Exportação, offline e aceite restante

Envelope `scope: synthetic-contract`, `rulesetEnabled: false`, `exportEnabled: false`; documento `fictionalData: true`, `needs-review`, não importável. A sessão nova não é aceita pelo exportador existente. Sem UI, migração de save, exportador de sessão ou ampliação do offline. O build existente foi executado como regressão.

Ordem seguinte: revisar/publicar o trabalho incremental local de compilação/handlers, ampliar a receita para os lotes integrados com seus gates específicos e projetar/revisar os lotes reais sob evolução explícita do contrato; conferir compilação/handlers reais; integrar procedimento completo na #35/#36; implementar/verificar gates de exportação/destino na #37. **A ampliação do offline fica depois da integração do fluxo real e dos gates de exportação.**

Atividades 1/2 concluídas; 3–5 aguardam correções e aceite dos dados reais. **6/7 têm infraestrutura incremental implementada, mas permanecem abertas**: faltam cobertura dos três lotes, capacidades não representadas em `1.0.0` (atributos/estados, direitos, quantidades/programas reais e condicionais), side rolls completos e aceite local com autoria. Atividade 8 aberta.

## Validação

459 testes aprovados em 49 arquivos com `node node_modules/vitest/vitest.mjs run --maxWorkers=2`. Depois do ajuste final do encadeamento e da inclusão da recusa de links de saída, 28 testes direcionados aprovados em três arquivos. As doze regressões novas cobrem compilador/publicação, hashes/adulteração, concessões exatas/idempotência, lookup ligado, pendências/limites, fases/conflitos de equipamento, suspensão e preservação dos estados. Build/TypeScript, freeze de 16 arquivos, compilação e check consumível aprovados. Privacidade: zero achados nos 352 arquivos rastreados e novos.

A primeira tentativa via npm não repassou o limite de workers no PowerShell e teve quatro timeouts em testes existentes. A execução direta com dois workers aprovou tudo, sem aumentar timeouts nem alterar esses testes. Esta entrega não alega aceite de conteúdo real ou inspeção de PDF.

Após o merge dos três lotes e restauração deste trabalho na main `bf847e5`: 528 testes completos aprovados em 52 arquivos. Depois da adaptação local para `authorized-rules`, 29 testes direcionados, build/TypeScript, check consumível, freeze e privacidade aprovados. A CI da main remota também passou, sem incluir a infraestrutura ainda não publicada.
