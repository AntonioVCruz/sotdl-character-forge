# CUR-016 — plano de inventário das tabelas de criação

## Recorte e aceite

Inventariar todas as tabelas necessárias aos procedimentos Human/Core e Only Human: ancestry, desenvolvimento, profissões, riqueza, equipamento por lifestyle, Interesting Things e inspiração de interpretação. Cada registro deve ter identidade local estável, publicação, linhas/hash, dado ou chave de lookup, aplicabilidade/cardinalidade, alternativa manual, ligações e consequências/riscos.

É um inventário de curadoria, não uma emissão de RandomTable curada. A geração continua desabilitada. Não reconstruir resultados ambíguos, fechar probabilidades, aplicar efeitos ou integrar a UI antes dos CURs responsáveis. As auditorias numéricas já existentes do Core são conservadas como informação, não como aprovação automática de todos os resultados.

## Execução

1. Conferir toda a seção Human Development, os blocos Core e os textos suplementares com numeração recuperada.
2. Separar tabelas de dados, lookups por lifestyle, rolagens secundárias e campos livres. Distinguir dois eixos/colunas de duas rolagens independentes.
3. Registrar grafo de referências, multiplicidade, pré-condições, modificadores, recursões e dependências externas. Identificar ambiguidades sem preenchê-las por inferência.
4. Gerar inventário/relatório determinísticos com evidências e diagnóstico das revisões pendentes.
5. Testar dados diferentes entre fontes, ligações, referências completas, exceções Size, extremos modificados, ciclos e adulteração sem sobrescrita; executar os gates do projeto.

## Regras já decididas

Only Human é o procedimento padrão; Core continua selecionável e preservado. A escolha de atributos fixos/aleatórios é independente. Não somar riqueza/profissões Core às tabelas que as substituem. A política de Roleplaying Questions opcionais não remove resultados de ancestry/desenvolvimento, e nomes genéricos editáveis não eliminam quantidades, escolhas ou efeitos publicados.
