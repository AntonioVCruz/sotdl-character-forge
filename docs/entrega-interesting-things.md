# CUR-019 — Interesting Things

Entrega em 2026-10-27: **Oddities, Artifacts, and Esoterica é o padrão**, conforme instrução explícita do usuário. As seis tabelas Core continuam disponíveis como alternativa completa. Essa escolha independe do procedimento de ancestralidade: Human/Core também pode usar Oddities. Uma concessão produz um resultado do procedimento escolhido; selecionar o suplemento não adiciona um segundo resultado Core.

O [artefato estruturado](../curation/pilot/interesting-things.json) reúne dois seletores, **18 tabelas e 360 posições de resultado**: 240 do suplemento e 120 Core. Inclui 33 resultados com alternativas, 15 expressões de rolagem na criação, oito expressões de uso posterior, quantidades fixas, recursos, valores patrimoniais, contextos e referências futuras. O [relatório](../curation/reports/interesting-things.json) registra entradas, hashes e contagens. Após a correção fornecida pelo usuário, há **501 faixas de evidência, zero associações bloqueadas e zero descrições sem numeração**.

É uma formalização de curadoria com resolução de referência e pendências declaradas. Os gates de pack importável, integração no runtime, handlers mecânicos e geração oficial permanecem desabilitados.

## Procedimentos preservados

Core usa **d6 → d20**. Cada uma das seis tabelas possui 20 resultados; as 120 combinações têm a mesma probabilidade. A transcrição complementar fornecida pelo usuário foi preservada em `curation/corrections/core-interesting-things-2026-10-27/interesting-things.txt`.

Oddities usa **d20 → d20**, com as seguintes faixas no seletor:

| d20 | Categoria | Probabilidade da categoria |
| --- | --- | --- |
| 1–2 | Art and Heirlooms | 10% |
| 3–4 | Books and Scrolls | 10% |
| 5–6 | Clothing and Accessories | 10% |
| 7–8 | Consumables | 10% |
| 9 | Minor Magic | 5% |
| 10 | Pets! | 5% |
| 11 | People and Dependents | 5% |
| 12–13 | Personal Stuff | 10% |
| 14–15 | Qualities | 10% |
| 16–17 | Special Ingredients | 10% |
| 18–19 | Tools and Devices | 10% |
| 20 | Weird Stuff | 5% |

Selecionar uniformemente uma das 12 categorias mudaria a distribuição publicada. O resolvedor usa faces explícitas e mantém dois registros de rolagem ligados por `parentRollId`. Uma seleção manual preserva o resultado e a fonte sem fabricar rolagens de seletor.

O padrão é uma política do projeto autorizada nesta tarefa; o texto do suplemento apresenta a substituição como opção. Se a fonte padrão estiver desabilitada, o resolvedor retorna pendência. O Core pode ser escolhido explicitamente, sem substituição silenciosa.

O início Core e o início Only Human concedem uma Interesting Thing cada, conforme o procedimento escolhido. Minor Windfall 10 de Only Human concede **uma adicional**. Cada concessão usa identidade própria; repetir um mesmo resultado em concessões diferentes preserva ambas as origens. O módulo registra essas instruções, mas ainda não orquestra automaticamente todo o histórico de criação.

## Objetos, narrativa e consequências

Resultados são classificados como objeto, companheiro, relação, narrativa, misto, dependência externa ou referência textual. Reputações, medos, características físicas, segredos e relações não são convertidos automaticamente em inventário. Um resultado misto, como saliva/partes de galinha/cicatriz, mantém suas alternativas para decisão posterior.

Objetos continuam sujeitos à política de registros editáveis **Item fixo / Incantation de rank 0**, quando forem materializados pelo consumidor. O texto original e as condições não são eliminados por esse rótulo. Valores declarados, como o anel de 1 ss, permanecem patrimônio; não há crédito automático de moedas.

Quantidades da criação ficam separadas de dados exigidos ao usar o resultado. Por exemplo, os comprimidos de Consumables 8 exigem 1d20 para a quantidade; o outro 1d20 é duração em horas no uso. A máscara de Minor Magic 9 mantém duração 1d6 rounds e duas utilizações antes de um descanso. O dano adicional de Tools 18 é contra objetos e não é rolado na criação.

São preservados os seis pastéis, incluindo cinco próprios para alimentação e um que envenena até o descanso; doses de colírio; cargas de névoa e argila; limites de uso/recuperação; efeitos permanentes; condições de iluminação, alcance e ativação; custo de idade e limite vitalício do cálice; 3 banes em Perception do capacete; e a restrição de acumular a armadura do Core. Essas informações são declarações rastreáveis para adjudicação ou futuros handlers, sem aplicar efeitos durante a criação.

Pets! preserva a restrição de que os acompanhantes não lutam nem fazem muito que seja útil. People and Dependents mantém o contexto de commoners salvo exceção, inclusive o bartender que não acompanha aventuras. Special Ingredients conserva a decisão de uso pelo GM; receitas ou benefícios mágicos não foram inventados.

## Associações resolvidas pela transcrição do usuário

O MD tem colunas intercaladas. As **13 associações anteriormente pendentes foram resolvidas** pela transcrição numerada enviada pelo usuário em 2026-10-27:

| Tabela | Resultado | Associação confirmada |
| --- | --- | --- |
| Art and Heirlooms | 6 | Moeda de ouro com inscrição. |
| Books and Scrolls | 11 | Três livros escritos em sangue. |
| Minor Magic | 3 e 4 | Luva que causa choque; staff com cabeça animal. |
| Minor Magic | 10 e 11 | Argila que produz construct; cálice de cura com custo de idade. |
| Minor Magic | 17 | Chaveiro com 1d6+1 chaves. |
| Pets! | 8 | Pato que anuncia chuva. |
| Personal Stuff | 1, 2, 3 e 4 | Canção recorrente; dia ruim mensal; sombra no canto; histórico criminal. |
| Special Ingredients | 12 | Madeira petrificada. |

O [anexo preservado](../curation/corrections/oddities-tables-2026-10-27/tables.txt) foi copiado sem alterar seus bytes; seu [manifesto](../curation/corrections/oddities-tables-2026-10-27/manifest.json) fixa hash, origem e decisão sobre Books 20. Ele contém seis tabelas completas e atualiza 120 resultados, com `mappingStatus: verified-user-text`. As demais tabelas e todos os IDs permanecem preservados.

`findings` e `unassigned` estão vazios. `correction.resolvedAssociations` registra as 13 resoluções, e `resolvedUnassigned` liga as quatro descrições às respectivas faces. Os artefatos anteriores foram guardados em `curation/history/oddities-before-user-correction-2026-10-27/`; as evidências do MD original continuam anexadas. Não houve alteração dos quatro MDs nem alegação de conferência no PDF. CUR-021 ainda revisará aplicação e fechamento das tabelas, sem reabrir essas associações já confirmadas.

**Books and Scrolls 20** mantém literalmente a linha **“Generate a book or writing using the Dark Passages supplement.”** Por instrução do usuário, seu comportamento atual é **referência textual**, sem bloquear a seleção e sem exigir que Dark Passages esteja habilitado. Nenhum conteúdo é gerado agora.

O source ID de Dark Passages permanece como referência. `details.futureGenerator` reserva o identificador `dark-passages-books-and-passages`, com `enabled: false`, estratégia `random` e saídas `passage`/`book`. Quando o gerador for implementado e habilitado em fase futura, Books 20 deverá produzir uma passagem ou livro aleatório, preservando este ID de resultado e registrando a geração como dependência filha. Esta entrega não implementa o gerador nem escolhe suas probabilidades ou conteúdo.

## Contrato e reprodução

[interesting-things-model.ts](../packages/curation/interesting-things-model.ts) valida identidades, cobertura dos seletores/d20, origem dos resultados, ramos e dados. `previewInterestingThing` recebe catálogo, fonte habilitada, variante opcional, identidade da concessão e seleção manual ou faces; escolhas e dados secundários são explícitos. `createInterestingThingsPreview` valida uma vez para várias consultas e isola o catálogo de edições nos previews.

O retorno contém resultado, alternativas selecionadas, quantidades roladas, rastro e pendências. `selectionComplete` indica resolução da seleção e seus requisitos; **não indica aplicação mecânica**. Todo resultado preserva `manual-application`, `fullyApplied: false` e `completeCharacter: false`. Não há RNG, alteração do Character, integração com inventário, aprendizado de spells ou ativação automática de efeitos.

```powershell
npm run curation:interesting-things
node tools/curation/interesting-things.mjs --check
npm run curation:check
npm test
npm run build
```

O gerador valida os derivados anteriores antes de escrever. O modo `--check` compara bytes sem sobrescrever artefatos; o runner pode atualizar o cache em `tmp/curation/`. Fontes, contratos congelados e derivados anteriores foram preservados.

Treze cenários novos cobrem todas as 400 combinações do suplemento e 120 Core, padrão/alternativa, fontes desabilitadas, ramos, quantidades, dados de uso, contexto narrativo, pendências, isolamento de previews, validação de cobertura, proveniência e rejeição de adulteração antes da escrita.

Gates aprovados em 2026-10-27: **122 testes de curadoria em 18 arquivos**, **196 testes completos em 25 arquivos** e build TypeScript/Vite. Insumos preservados e os 16 arquivos congelados também passaram pelas verificações. A UI demonstrativa não mudou; não houve necessidade de E2E adicional.

Próxima tarefa: **CUR-020 — catálogo mínimo de itens do piloto**, considerando os objetos referenciados por Core e Oddities. CUR-021 mantém a revisão de aplicação e fechamento das tabelas; as 13 associações de transcrição já estão resolvidas.

Atualização posterior: **CUR-020 concluída** como [catálogo mínimo de itens do piloto](entrega-catalogo-itens-piloto.md), incluindo todos os vínculos e as restrições dos resultados especiais. Próxima tarefa: **CUR-021 — fechar as tabelas do piloto**.
