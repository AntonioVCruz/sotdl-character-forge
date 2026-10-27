# CUR-018 — riqueza, moedas e equipamento inicial

Entrega em 2026-10-27 para **Human/Core + Only Human**, como formalização de referência. O suplemento mantém seu procedimento próprio; Core continua uma alternativa completa. A integração no criador permanece nas tarefas de motor e consumidor.

O [artefato estruturado](../curation/pilot/wealth-equipment.json) contém **97 programas de concessão**: 12 kits (seis de cada publicação), 66 ganhos das profissões de Only Human e 19 ganhos adicionais de background/windfalls. São **114 faixas de evidência**, com texto, linhas e hashes. O [relatório reproduzível](../curation/reports/wealth-equipment.json) registra entradas e saída.

## Riqueza e moedas

| Resultado de 3d6 | Core | Only Human, após modificadores |
| --- | --- | --- |
| Destitute | 3–4 | 3 ou menos |
| Poor | 5–8 | 4–5 |
| Getting By | 9–13 | 6–12 |
| Comfortable | 14–16 | 13–15 |
| Wealthy | 17 | 16–17 |
| Rich | 18 | 18 ou mais |

Only Human acumula os modificadores aplicáveis de Life Experience, Setbacks e Windfalls. Cada ocorrência possui identidade própria, inclusive resultados repetidos. O total não é limitado a 3–18. Esses modificadores não são aplicados à alternativa Core, e os demais efeitos de vida continuam preservados para formalização posterior.

A conversão publicada é **10 bits = 1 cp; 10 cp = 1 ss; 10 ss = 1 gc**. Valores são serializados como strings inteiras de bits e calculados com `BigInt`; frações decimais só são aceitas quando equivalem a bits inteiros. Não há arredondamento nem uso de ponto flutuante para dinheiro. A unidade de referência publicada é ss; a unidade de armazenamento escolhida é bits.

Dinheiro recebido e valor declarado de um bem ficam separados. Mercadorias de Merchant valem 1d6 ss, mas não acrescentam moedas à bolsa. Medalhas, tokens e o benefício de manutenção de estilo de vida também não viram dinheiro disponível automaticamente. Quantidade, unidade física e valor têm campos distintos; preço de compra e disponibilidade não são inferidos.

## Kits e ganhos

Cada kit mantém todos os ganhos fixos, alternativas e rolagens secundárias. Sling concede suas 20 pedras somente quando escolhida; pole e tackle box são um conjunto alternativo ao harpoon. Roupas com 1d3 conjuntos em Only Human mantêm essa rolagem. Rich de Only Human concede três cavalos com três freios, bridles e saddles: o termo inglês `bits` nesse trecho representa arreios, separado da moeda. Diferenças entre os kits de cada publicação são preservadas.

As 66 profissões tabeladas de Only Human têm programas próprios de equipamento. As opções Core e Occult direto não recebem equipamentos copiados do suplemento. Uma profissão da família não concede automaticamente seus bens ao personagem. Ganhos distintos preservam origem e quantidade, mesmo com nomes iguais.

Os registros exibem **Item fixo** ou **Incantation de rank 0**, editáveis depois, conservando a descrição original em `sourceLabel`. Não exigem nome específico ou escolha de spell para concluir o registro material. Incantations não ensinam spells; possuir armadura ou arma não equipa o objeto nem aplica bônus.

As concessões adicionais incluem 2d6 cp do background Core, objetos e companheiros dos Windfalls, bens imóveis, valores declarados e 1d3+1 Incantations/potions. Major Windfall 1 possui um ramo condicional: favor de Terrible Beauty quando usado, ou objeto encantado escolhido pelo GM quando não usado. A seleção desse contexto continua a cargo da orquestração posterior; os dois ganhos não se acumulam.

## Contrato de referência e limites

[starting-equipment-model.ts](../packages/curation/starting-equipment-model.ts) oferece:

- `moneyToBits`: conversão exata de string decimal para bits inteiros.
- `resolveStartingLifestyle`: recebe procedimento, três faces e eventos identificados; devolve total, classe e rastro dos modificadores.
- `previewStartingGrants`: recebe programas, instâncias com origem e sujeito (`pc`/`family`), escolhas e faces explícitas. Devolve registros, dinheiro conhecido, pendências e estado de completude material.

Não há RNG implícito. Uma escolha ou rolagem ausente gera pendência, nunca item alternativo arbitrário ou dinheiro zero presumido. `knownCashBits` é apenas a soma conhecida; deve ser interpretada com `cashComplete` e `materialComplete`. `completeCharacter` permanece falso. Instâncias familiares não são incorporadas ao inventário do personagem.

O catálogo físico e seus requisitos seguem em CUR-020; validação final das tabelas e condições em CUR-021; efeitos não materiais em CUR-027; UI, orquestração, persistência e inventário real em CUR-033 a CUR-037. Interesting Things e seus efeitos não foram convertidos indiscriminadamente em objetos: **CUR-019** é o próximo passo. Os gates de pack importável, geração oficial, compra e equipamento automáticos continuam desabilitados.

## Reprodução e verificação

```powershell
npm run curation:wealth-equipment
node tools/curation/wealth-equipment.mjs --check
npm run curation:check
npm test
npm run build
```

O formalizador verifica os derivados anteriores antes de escrever. O modo `--check` compara os artefatos; o runner pode atualizar o cache em `tmp/curation/`. Fontes preservadas e contrato congelado não foram alterados.

Dez cenários verificam conversão exata, os 216 resultados de cada procedimento, modificadores cumulativos, alternativas, valores patrimoniais, quantidades, origens, equipamentos familiares, todas as concessões, reprodução e rejeição de fontes/artefatos adulterados antes da escrita.

Gates aprovados em 2026-10-27: **109 testes de curadoria em 17 arquivos**, **183 testes completos em 24 arquivos** e build TypeScript/Vite. Verificações dos quatro insumos e dos 16 arquivos congelados também aprovadas.

Atualização posterior: **CUR-019 concluída** como [formalização de Interesting Things](entrega-interesting-things.md), com Oddities como padrão e Core como alternativa. Próxima tarefa: **CUR-020 — catálogo mínimo de itens do piloto**.
