# Matriz de completude da #54

Decisão do usuário em 2026-11-04: efeitos reservados ao uso em jogo não bloqueiam a finalização e continuam visíveis. Isso não resolve automaticamente uma obrigação da criação.

| Condição | Resultado |
|---|---|
| Etapa obrigatória sem resultado, escolha, quantidade, especialização ou adjudicação | Bloqueia; indicar a etapa/ação correspondente |
| Dependência invalidada, resultado incompatível ou limite de execução atingido | Bloqueia; revisar o resultado preservado |
| Dados mecânicos, capacidades ou composição de equipamento sem resolução | Bloqueia; resolver contexto ou equipamento |
| Fonte indisponível, contexto diferente, implementação diferente ou perfil não autorizado | Suspende; preservar save e exigir revisão |
| Etapa facultativa não selecionada | Não bloqueia; informar que não foi escolhida |
| Etapa facultativa selecionada e incompleta | Bloqueia enquanto integrar o percurso ativo |
| Quantidade monetária/material desconhecida | Bloqueia; não tratar valor conhecido parcial como total |
| Bem genérico concedido com identidade narrativa preservada, sem uso mecânico ativo | Pode concluir a criação; perfil de uso continua explícito |
| Efeito condicionado a cena, consumo, combate ou passagem de tempo | Não bloqueia; listar em efeitos de uso |
| Livro/suplemento necessário para uma concessão de criação sem handler | Bloqueia; nenhuma fonte substituta |
| Todas as obrigações resolvidas, mas sem ação de finalizar | Rascunho pronto para finalizar |
| Ação de finalizar com revalidação positiva | Personagem finalizado no recorte local suportado |
| Alteração posterior de configuração, resultado, concessão ou equipamento | Rascunho novamente, com motivo; requer nova finalização |
| Reabertura de um estado finalizado | Revalidar contexto, conteúdo e obrigações sem rolar dados |
| Flag ou recibo de finalização salvo, com obrigações atuais pendentes | Rascunho; o dado salvo não comprova completude |

O contrato de finalização guarda somente versão e hashes; não copia fontes, tabelas ou evidências. Saves anteriores continuam rascunhos por padrão. A finalização não altera `needs-review` ou `exportEnabled: false`; a revisão de distribuição e os exports pertencem às #55/#56.
