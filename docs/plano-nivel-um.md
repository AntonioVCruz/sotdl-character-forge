# Progressão demonstrativa 0 → 1

Pedido autorizado: executar a próxima fatia com dois caminhos fictícios. Todos os valores abaixo são inventados e identificados como demonstração.

- Caminho marcial Guardião da Trilha: +4 Health, escolha entre treino de proteção (+1 Defense) ou mobilidade (+1 Speed).
- Caminho mágico Aprendiz da Centelha: +2 Health, +2 reservas arcanas demonstrativas; escolha entre duas técnicas fictícias (+1 Intellect ou +1 Will). São escolhas de treinamento, não implementação das regras oficiais de tradições/magias.
- Slots sequenciais `novicePath` e `pathTraining` de nível 1, com candidatos declarados no pack. O treinamento depende do caminho, o caminho depende da ancestralidade e da resolução das etapas anteriores.
- Avançar preserva as escolhas de nível 0 já preenchidas. Todos os novos slots oferecem manual, sortear, rerrolar e lock; não existe tabela oficial para os caminhos fictícios, exigindo consentimento de fallback uniforme.
- Alterar caminho/ancestralidade preserva decisões dependentes com aviso e suspende benefícios incompatíveis. Reversão explícita ao nível 0 suspende eventos de nível 1, mantendo-os no histórico; voltar ao nível 1 revalida e reutiliza as escolhas existentes.
- JSON v2 adiciona histórico de mudanças de nível. Migração de JSON v1 preserva integralmente eventos/rolls/locks antigos. Níveis >1 continuam rejeitados.
- Testar os dois caminhos, inelegibilidade, alteração/locks, reversão e retorno, roundtrip, migração e E2E manual/aleatório antes de concluir.
