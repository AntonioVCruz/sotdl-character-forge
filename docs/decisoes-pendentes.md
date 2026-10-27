# Decisões para validar (defaults não bloqueantes)

| Questão | Default adotado no MVP | Pode ser alterado? |
|---|---|---|
| Uso | Pessoal/offline-first | Sim, posteriormente multiusuário |
| Sistema | SotDL (Core) com packs opcionais explícitos | Sim |
| Atributos | Regras do ruleset sem substituir manualmente a derivação | Sim, com override auditado |
| Conteúdo inicial | Subconjunto validado do Core | Sim, por ordem de curadoria |
| Idioma do conteúdo mecânico | Inglês original nos packs locais | Sim, com traduções separadas licenciadas |
| PDF | Estilos de impressão A4/browser | Sim, exportador dedicado no futuro |
| HTML | Página autônoma de visualização; dados JSON embutidos só se optado | Sim |
| Persistência | IndexedDB + JSON para backup | Sim |
| Progressão | Eventos e slots sequenciais; desfazer com recálculo | Sim |
| Regras de troca de magias de Occult Philosophy | Ligadas por flag explícita após validação da implementação | Sim, por campanha |
| Interações não formalizadas | Marcar resolução manual, não inventar automação | Sim, ao implementar nova regra |

## Fora de escopo inicial
API pública, contas, sincronização, multiplayer em tempo real, combate tático virtual, extração automática não revisada de PDFs, distribuição pública de fontes protegidas.

## Defaults propostos para aleatoriedade (v0.2)
| Questão | Default adotado | Observação |
|---|---|---|
| Forma inicial | Manual, com botão **Sortear** em todo slot | Híbrido e tudo aleatório são alternáveis |
| Gerar tudo | nível-alvo explicitamente escolhido | 0–10 no MVP; respeitar progressão por fonte |
| Sorteios oficiais | priorizar `RandomTable` curada aplicável | Não converter 3d6 em sorteio de linha |
| Sem tabela oficial | `uniform-eligible` quando consentido | Rotular como escolha aleatória do aplicativo, não oficial |
| Campos narrativos sem gerador | manter `unresolved` | Não inventar nome/objetivo/portrait como regra do jogo |
| Decisão anterior manual | bloquear por padrão durante geração parcial | usuário pode destravar com confirmação |
| Preview de geração completa | obrigatório antes de aplicar | Confirmar ou cancelar, com log e pendências |
| Reprodutibilidade | seed explícita ou gerada e exibida + versão fixa de PRNG | persistir eventos/rolls já consumidos |
| Reroll | somente slot escolhido + dependências afetadas | nunca reescrever escolhas independentes |
| Tabela incompleta | bloquear interpretação mecânica como oficial | apontar fonte/página e curadoria pendente |
