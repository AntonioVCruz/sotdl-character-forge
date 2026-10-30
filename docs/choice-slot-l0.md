# ChoiceSlot e wizard L0

Contrato de UI das issues [#9](https://github.com/AntonioVCruz/sotdl-character-forge/issues/9) e [#10](https://github.com/AntonioVCruz/sotdl-character-forge/issues/10). Frames `1b` e `1e` em `wireframe/Forja Wireframes.dc.html`.

## Props

`Strategy`: `manual` | `published-table` | `uniform-eligible-unofficial` | `pending`.

`SlotUiState`: `empty` | `preview` | `confirmed` | `partial` | `locked` | `needs-review` | `pending` | `suspended`.

O audit `vazio | parcial | completo` corresponde a `empty | partial | confirmed`. `preview` é rascunho ainda não aplicado.

`ChoiceOption` traz `eligible` e, se for falso, `disabledReason`. A lista manual mostra a opção e o motivo. Não filtra inválidas.

`cardinality` é `{ min, max }` (N escolhas). Prévia tem Confirmar e Descartar por slot. Travar não sorteia. "Rolar novamente" só aparece depois de um resultado. Badges são texto em português: `manual`, `tabela publicada`, `aleatório entre opções válidas (não oficial)`, `pendente`. O `slotId` não aparece na tela.

`confirmReason`, quando presente, torna Confirmar indisponível e associa o motivo pelo `aria-describedby`. O reducer revalida a proposta no contexto atual mesmo se receber uma ação de uma UI antiga: slot ativo, dados/dependências, suspensão, cardinalidade sem duplicatas e elegibilidade de cada opção. Uma prévia inválida fica em `needs-review`, continua disponível para descarte e não substitui a última escolha confirmada. Prévia de um ramo de atributos inativo não bloqueia a revisão do ramo atual; continua impedida de confirmar enquanto estiver inativa.

O modo Manual permite Sortear e Rolar novamente por slot, sujeitos aos bloqueios de seed, autorização de fallback, trava, dados e dependências. O comando explícito prepara uma prévia; não aplica o resultado nem dispara geração conjunta.

## Wizard

Ordem do stepper, só nível 0: Ruleset e fontes, Ancestry, Atributos, Size, Benefício Human, Tabelas narrativas, Profissões e idiomas, Wealth e kit, Interesting Thing, Roleplaying, Nome e notas, Revisão L0. Não há passo de nível 1.

Em viewport de pelo menos 1100px o miolo é três colunas: stepper, passo ativo, mini-ficha sticky. A ficha usa os sete números do `Stats` já existente e só muda no confirmar. Health, Defense e Speed ficam `indisponível` neste adapter: não aplicamos a prévia CUR-015 como se fosse a ficha. Perception e os demais gaps continuam explícitos.

Seed começa vazia. Copiar não inventa uma seed. Nível-alvo fica em 0. "Gerar tudo aleatoriamente" está desligado. No modo híbrido, "Incluir no Gerar tudo" é outro controle e não rola.

## Adapter

`fictionalData: true` em `apps/web/l0-demo.ts`. Listas e rolagens são fictícias. Sorteio uniforme usa a estratégia não oficial, nunca o badge `tabela publicada`.

Se `content-packs/**/pack.json` existir, o passo Ruleset lê stubs de ancestry com `fictionalData: false`. Eles aparecem como opção inelegível. `rulesetEnabled` permanece `false` (soft-block; sem compilador CUR-031). Neste checkout os stubs podem estar ausentes: o motivo fica na lista.

Tabelas narrativas e, no recorte Only Human, Human Development Tables ficam pendentes com motivo. O caminho que fecha a revisão L0 é o recorte Core fictício, com benefício, profissão, Wealth, kit e Interesting Thing também fictícios.
