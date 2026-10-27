# CUR-015 — plano de formalização Human/Core + Only Human

## Especificação

Formalizar a base de Human nível 0, preservando as duas publicações: escolha fixa/aleatória quando publicada, ajuste geral opcional único, características derivadas, Size, estados iniciais, idiomas e fronteira dos talentos de nível 4. Toda constante, fórmula, escolha e herança deve apontar para evidência de CUR-014. Usar as políticas aprovadas em `creation-decisions.json`.

O resultado será um sidecar tipado de curadoria, com fórmulas declarativas e um avaliador de referência para conferir exemplos. Não será um pack importável, uma migração de Character ou integração do motor real, que pertencem a CUR-031/033/034/035/036. Não preencher ganhos das Human Development Tables antes de CUR-016/017.

## Decisões de composição

- Core: somente modo fixo; Only Human: fixo ou quatro rolagens independentes 8+1d3. A escolha de tabelas é independente da variante mecânica, conforme instrução de Only Human.
- O +1 do ramo fixo não entra no aleatório. Depois, permitir uma transferência opcional +1/−1 entre atributos distintos, uma única vez; respeitar scores de 1 a 20.
- Perception/Defense/Health derivam dos atributos finais. Healing Rate herda o arredondamento para baixo do Human/Core e o mínimo 1 da regra geral; Only Human não declara arredondamento diferente. A herança deve ficar explícita.
- Only Human omite os zeros Damage/Insanity/Corruption: conservar os valores-base Core por herança, não atribuí-los a uma citação inexistente do suplemento.
- Size é escolha 1/2 ou 1, independente de Build. Não somar blocos de idioma/profissão das duas variantes. Nenhum talento de nível 4 é talento inicial.
- Aplicar apenas a base. Background, desenvolvimento, equipamento e efeitos posteriores podem alterá-la e exigem sua própria proveniência; uma prévia da base não é personagem completo.

## Tarefas e verificação

1. Criar contrato isolado de escolhas/fórmulas/evidências e avaliador de referência puro, sem RNG.
2. Gerar especificação determinística e relatório de capacidades/lacunas do consumidor.
3. Verificar exemplos manuais e as 81 combinações dos quatro d3, modos incompatíveis, transferência inválida, Size e ausência de ganhos duplicados.
4. Conferir evidências, heranças, arquivo adulterado, idempotência e preservação dos contratos congelados/staging.
5. Atualizar a entrega/backlog e executar curadoria, suíte completa e build.
