# Fluxo UX + contratos para criação com aleatoriedade

## Três modos do usuário

### Modo manual (padrão)
`Selecionar ruleset → Ancestry → atributos → tabelas narrativas → profissões/riqueza/equipamento → levels/paths → traditions/spells/talents → ficha`.
Em **todo passo**, `Escolher manualmente`, `Sortear`, `Rolar novamente` (quando houver resultado aceito), `Ver dados e fonte`. O dado não deve ser rolado sem clicar no comando.

### Modo híbrido
`Selecionar modo híbrido → travar escolhas → escolher quais slots sortear → gerar rascunho → revisar → aceitar`.
Ao editar uma ancestry/path após a geração, exibir dependências afetadas e preservar escolhas independentes; não apagá-las em silêncio.

### Modo tudo aleatório
`Selecionar ruleset/packs/variantes → escolher nível-alvo (0–10) → filtros/locks → política de fallback → seed (opcional) → GERAR TUDO → preview de slots/rolls/warnings → confirmar/cancelar`.
A janela «Gerar tudo» deve ser acessível tanto para **novo personagem** quanto para **completar campos ainda não preenchidos** de uma ficha existente.

## Matriz de etapas e estratégias
| Etapa/slot | Há tabela em alguma publicação? | Como sortear |
|---|---|---|
| Ancestry/variante | Não presumir tabela universal publicada | Sorteio `uniform-eligible` dentre packs autorizados **se** o usuário permitir; se houver tabela de seleção publicada em fonte ativa, prevalece ela quando aplicável |
| Atributos iniciais / redistribuição | Determinado por ancestry e opções do ruleset; não presumir atributo aleatório obrigatório | Gerar escolhas de ajuste válidas (não rolar valores aleatórios se a regra não manda); se houver tabela/regra de rolagem autorizada, usá-la |
| Background, age, appearance, personality | Frequentemente sim, depende de ancestry/variante | `official-table` por fonte e contexto; ou manual/pendência conforme regra |
| Profissão | Core tem tabelas de profissões; contexto altera categoria e escolhas | Tabela curada quando exigível; alternativas livres com pool elegível explicitamente rotulado |
| Wealth / starting equipment | Core contém riqueza `3d6`, escolhas e quantias variáveis | Rolagem publicada, rolagens secundárias, choices de kits/itens elegíveis |
| Interesting Things | Core possui seis tabelas via `d6→d20` | Roteamento e rolls encadeados, outcomes/efeitos tipados |
| Novice / Expert / Master / Legendary path e opções | Nem todo path possui tabela de seleção oficial | `uniform-eligible` entre paths válidos por nível/ancestry/flags, ou fonte oficial curada quando houver |
| Traditions / aprendizado / swap de spells | Não pressupor tabelas específicas de sorteio | Sortear opções elegíveis no exato slot e ordem; regras alternativas de substituição por flags |
| Talents, story complications e escolhas especiais | Variável por fonte e ruleset | Usar tabela quando houver, senão pool elegível condicionado ou pendência/GM |
| Nome, personalidade livre, metas, notas, portrait | Nem sempre existem geradores oficiais | Curated name lexicon/asset pool **autorizado**, ou `unresolved`. Não inventar resultado e rotular como oficial |
| Efeitos, transformações e summons acessíveis | Dependem de magia/item/trait ativos | Não ativar todos aleatoriamente na criação por padrão; só quando um slot formal requer escolha/rolagem, ou sob modo de simulação explicitamente solicitado |

## UI de um slot
```text
┌ Background (Human, fonte X / edição Y) ─────────────────────────┐
│ Modo: [Escolher manualmente] [Sortear] [Travar escolha]          │
│ Tabela encontrada: Human Background • d20 • fonte / página      │
│ Resultado atual: ... [Rolar novamente] [Histórico / Rastro]     │
│ Consequências: ... [Aplicadas / Requerem revisão]               │
└────────────────────────────────────────────────────────────────┘
```
O texto é ilustrativo e não reproduz entradas do livro. `Sortear` só fica ativo quando há estratégia aplicável; ausência vira mensagem que explica exatamente por quê.

## Fluxo técnico / algoritmo (pseudocódigo, NÃO código funcional)
```text
input: CharacterDraft + Ruleset + Catalog + Seed + GenerationPolicy
resolve slots in topological+level order
for each slot:
  if LOCKED: check validity; keep event
  else if MANUAL and not overridden: keep/prompt
  else if eligible official table (validated): roll table and children;
     use outcome from published procedure, create events, record trace
  else if allowUniformEligibleFallback:
     candidates = EligibilityService.validOptions(slot, currentDraft, ruleset)
     if candidates nonempty: choose unbiased uniform candidate by stable substream;
       mark strategy = uniform-eligible (NOT an official table)
     else: unresolved(slot, reason)
  else: unresolved(slot, missing-table-or-choice)
  rebuild dependent slots and validate after **each** event
return GenerationDraft {events, traces, unresolved, warnings, fullyResolved}
CONFIRM: persist draft atomically; CANCEL: no mutation
```

## Rerrolagens, reprodutibilidade e conflitos
- `seed` global é exibida e salva. Definir PRNG/version fixos por build, com streams por ID de slot e índice de rerroll; alterar o CSS não altera a ficha.
- O `reroll` explícito não descarta o histórico de rolagens anteriores; cria nova proposta com `rerollIndex+1` e marca o evento anterior como substituído no log.
- Se o novo resultado muda condições de opções de nível posterior, a UI apresenta **árvore de impacto**. Itens incompatíveis vão para `needs-review`, nunca são apagados silenciosamente.
- Para uma tabela oficial com resultado incompatível em contexto, usar **apenas** a política documentada pela fonte; se ausente, resolver manualmente ou marcar `unresolved`. A proibição de rerrolagens ocultas previne viés e falsos resultados de tabela.
- Ao ativar/desativar um pack, revalidar as escolhas; não trocar tabela de outra edição no mesmo slot sem autorização.

## Estados da geração
`idle → configuring → generating draft → preview → confirmed` ou `cancelled`. Geração automática com pendências pode ser salva como **rascunho incompleto**, mas nunca declarada como personagem totalmente gerado.

## Definition of Done da feature
Usuário consegue escolher, sortear e refazer **todos os tipos de slots suportados**; consegue gerar uma ficha até nível escolhido, travar ancestry/path e mesclar com escolhas manuais; seed reproduz resultados; logs registram dados e fontes; pendências não são escondidas; import/export e painel da ficha não executam nova aleatoriedade.
