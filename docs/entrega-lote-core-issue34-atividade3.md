# Lote Core sintético — #34 / atividade 3

Fatia de formas sobre o contrato já mergeado `sotdl.human-l0.consumable@1.0.0` (main `5d729d4`). Não cria a versão `1.1.0` e não emite pack local. A fixture é `distribution: public-synthetic`, `fictionalData: true`, `needs-review`, `rulesetEnabled: false`, `importablePack: false`. Não promove revisão e não fecha `act1-local-hash-check`.

Implementação: `packages/curation/human-l0-core-lot.ts`. Documento validado pelo gate da atividade 2: `curation/examples/human-l0-core-lot.synthetic.json`. Resumo auditável: `curation/examples/human-l0-core-lot.coverage.json`.

## Cobertura da matriz

O recorte `lote-core` tem **260 registros** e **293 identidades contábeis**, todos `selecionado` ou `selecionado-manual`. O lote marca **111 projetadas** e **149 pendentes**. Nenhuma identidade fica sem um dos dois estados.

| Peça | Forma no lote |
|---|---|
| 22 tabelas / 23 fluxos | 19 tabelas no documento. `core:role-traits` tem colunas `#positive` e `#negative`, cada uma com `rollId` próprio. |
| 3d6 narrativos e riqueza | Faixas sintéticas contíguas (`synthetic-even-split`). O peso é só `natural-dice-faces`. Não copia as faixas publicadas de idade, aparência, build, personalidade, religião nem os limiares de Wealth. |
| 1d20 / 1d6 com uma face por linha | Peso 1, porque a contagem de linhas já cobre o dado (`entailed-singleton`). Academic, common e criminal: 20 concessões `grant-profession` cada. |
| Roteadores | `core:profession-router` e `core:thing-router`, d6. Os 12 vínculos `pilot-link:50–61` ficam com `automaticExecution: false`. |
| Consultas | `query:profession-faces:core` relê o d6 sem dado novo e rejeita face incompatível. O d20 continua na tabela filha. `query:starting-lifestyle:core` é o 3d6 de Wealth, sem modificadores expandidos e sem limiar publicado. |
| Side roll | `side-roll:core:human-background:12`, fase `creation`, dado 1d6, ajuste −2 com mínimo 0 registrado e **não aplicado**. `appliesOnPossession: false`. |
| Interesting Things | 120 linhas `core:N:F`. Texto e dados internos continuam `hash-declarado-nao-refeito`. Efeito do contrato: pendência `manual-procedure`. Nenhum perfil de item. |
| Idiomas | 6 selecionados: fala por omissão, leitura/escrita só quando explícita, sem `grant-language` neste documento. 2 manuais (`dead-languages`, `secret-language`) permanecem pendência `open-category-language`. |
| Modelos | Educação: leitura sem escrita, pendência `partial-literacy`. Viagem: fala, sem leitura nem escrita, idioma concreto nulo. |
| Direitos de escolha | Dois direitos iniciais, como já está na entrega CUR-017. A consequência é marcador narrativo, não `grant-profession`. O benefício de ancestry é exclusivo: idioma extra **ou** profissão aleatória, e nenhum dos dois é concedido aqui. |

Build permanece pendência `manual-composition` (dimensão manual). Wealth permanece marcador que não altera mecânica. Profissões projetadas concedem a profissão e não copiam equipamento.

## Pendências que continuam locais

- **36 opções agrupadas:** martial 12, religious 7, wilderness 17. `weights: null`, `individualEvidence: false`, razão `range-starts-not-reextracted`. As tabelas `core:profession-martial` (14 linhas declaradas), `religious` (11) e `wilderness` (17, fluxo `local-only`) não entram no documento. Não há ids `rNN` inventados nem faces fabricadas.
- **6 opções já identificadas** (martial `r03`/`r13`, religious `r01`/`r03`/`r09`/`r11`) guardam só o `range-min` da matriz. `rangeMax` e peso ficam nulos, porque o complemento da faixa não foi reextraído.
- **120 resultados** de Interesting Things: forma (objeto, narrativa, companion, misto, escolhas e side rolls) vem da matriz; o texto e o dado do side roll não. Os 10 side rolls internos não viram rolagem no contrato.
- **314 registros de catálogo** da atividade 5 seguem no bloqueio agrupado, com peso nulo. Este lote não cria item, preço ou Defense.
- **`act1-local-hash-check`** permanece aberto (`blocksSyntheticFixtures: false`, 258). Os quatro ciclos Only Human continuam `projected: false`.

A facultatividade (ancestry opcional, Roleplaying Traits, Wealth uma vez, Interesting Things como alternativa a Oddities, profissão condicional) fica em `applicability` para a #35. `orchestratesProcedure` é falso. Esta entrega não executa as atividades 4, 5, 6 ou 7.

## Verificação

```bash
npm test
npm run build
node tools/curation/freeze.mjs --check
npm run curation:privacy
```

O aceite semântico, a reextração das 36 faixas e a recomputação dos hashes continuam com o Curador. Esta fatia não habilita ruleset e não promove `needs-review` para `curated`.
