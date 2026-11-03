# Lote de kits, itens e equipamentos — #34 / atividade 5

Projeção pública da atividade 5 no contrato [`sotdl.human-l0.consumable@1.0.0`](contrato-consumivel-tabelas-human-l0.md). Não é a versão `1.1.0`. A fixture é sintética: não há bytes de piloto, catálogo ou livro neste PR.

A matriz da atividade 1 continua sendo a lista de identidades. `act1-local-hash-check` segue aberto. Os 16 arquivos congelados e a projeção mecânica `0.2.0` não mudam. Revisão permanece `needs-review`. Ruleset permanece desabilitado.

## Contagens que o ledger fecha

O lote `lote-kits-itens` tem **752 linhas** e **1063 identidades** (`represents`). 746 linhas são `selecionado` e 6 são `selecionado-manual` (as cinco escolhas e `extra:major-windfall-1-fallback`). As seis manuais já estão dentro das 752; não se somam de novo.

| Peça | Identidades |
|---|---:|
| Definições | 409 |
| Referências | 547 |
| Programas | 97 |
| Lookups | 5 |
| Queries `query:only-human:*` | 5 |
| **Total** | **1063** |

409 = 67 `pilot-item:core:*` + 285 `pilot-item:thing:*` + 57 `class:source-grant-only`. 547 = 285 referências de resultado + 182 exatas + 75 genéricas + 5 escolhas. 97 = 66 profissões Only Human (`subject:pc`) + 6 kits Core + 6 kits Only Human + 19 `extra:*`.

Fora do inventário, e fora das 1063: **94** referências (`75` non-inventory + `19` moeda) e **28** blocos `item-definition:rule:*`. Esses blocos não são handlers.

## O que a fixture pública mostra

Correção P2 em 2026-11-03: as seis linhas de lifestyle e as chaves dos cinco lookups usam os IDs de resultado emitidos pelo #47 (`open-3`, `4-5`, `6-12`, `13-15`, `16-17`, `18-open`), sem redefini-los pelos nomes dos kits. O extrato público `human-l0-lifestyle-prior.activity4.synthetic.json`, obtido da fixture do #47 em `102c580`, fixa somente query, IDs e limites para a regressão standalone. A composição local também confere o extrato contra o builder/fixture efetivos do #47 e aceita sua coluna como produtora anterior. Os nomes de lifestyle dos programas e todas as consequências pendentes permanecem iguais.

`curation/examples/human-l0-kits.synthetic.json` passa em `parseHumanL0Consumable`. `human-l0-kits.rejections.json` cobre as recusas do gate.

- A atividade 4 emite a consulta `query:starting-lifestyle:only-human`. Este lote só a lê. A coluna `only-human:lifestyle#main` está no documento porque o gate `1.0.0` exige o produtor da consulta no mesmo documento. As faixas são as de `resolveStartingLifestyle` para `only-human`. O domínio do modificador fica pendente (`open-tail-domain`): os eventos de vida não são projetados aqui.
- Os cinco lookups `only-human:clothing|weapons|personal-gear|special-gear|money` têm `dice: null`, leem essa consulta e cobrem as seis linhas de lifestyle. A consequência é `grant-program-local-only`. Moeda não é item (`not-an-item`).
- Um grant de moeda usa `grant-currency` com bits iguais a `moneyToBits`. Esse valor não é preço de item e não é atribuído às 19 referências `currency-preserved`.
- A escolha do escudo de `core:kit:wealthy` permanece com `resolvedItemId: null`, junto com costume, dress e as duas spears. O fallback de major windfall continua `local-only`.
- Armadura: Defense só por `substitute-defense` ao equipar. Arma: pendência `weapon-no-defense`. Escudo: pendência `defense-bonus-not-substitution`, no padrão do contrato da atividade 2. Posse não aplica uso.
- Preço `exact`, `minimum`, `variable` e `unknown` ficam distintos. As 67 definições Core públicas ficam `unknown` + pendência até releitura local. Desconhecido não é zero. Os 285 resultados não herdam perfil pelo nome. Companheiro, misto, propriedade, serviço e relação não são itens carregados. Incantation não ensina magia.

## O que continua agrupado

Os 314 registros de catálogo seguem no bloqueio `act3-act5-grouped-local-only`: 57 `class:source-grant-only`, 182 `class:exact-definition-refs`, 75 `class:generic-editable-refs`. `weights: null`, `linkedDefinition: local-only`, `individualEvidence: false`, razão `catalog-group-not-individual`. Este PR não inventa folha, preço nem perfil para esses grupos. As 36 profissões Core agrupadas continuam pendência da atividade 3.

Os 97 programas também ficam `local-only`. A fixture não expande as folhas de concessão.

## Fora deste PR

Atividades 3, 4, 6, 7 e 8 seguem abertas. Não há lote de tabelas Core, Only Human ou Oddities, nem compilador de lote real, nem handler de runtime além da validação de schema. Se a atividade 4 publicar outros ids para a consulta de lifestyle, ela entra primeiro e este lote é rebasado nos mesmos ids.
