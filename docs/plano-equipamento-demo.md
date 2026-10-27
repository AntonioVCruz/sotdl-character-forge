# Inventário e equipamento ativável - primeira fatia

Solicitação autorizada: executar o próximo passo. Integra SPEC-003/005/007 no subconjunto fictício já existente.

- Inventário derivado da escolha confirmada de equipamento: uma unidade do item atual. Não acrescentar compras, loot ou gerenciamento de quantidades nesta fatia.
- Equipar/guardar registra ação `equipment` no log de sessão, com ID do evento original, ID do item e estado desejado. Não altera eventos de criação, fonte, seed ou rolls.
- Estado por evento de aquisição: escolhas antigas e seus controles ficam no histórico; uma nova escolha de equipamento inicia equipada, como nos arquivos anteriores.
- Compatibilidade: ausência de ação significa equipado. Descanso não muda equipamento. Equipar exige escolha e fonte válidas; guardar continua possível com fonte ausente. Referências futuras ou a outro item são rejeitadas na importação.
- Política fictícia `demo-additive-v1`: base + progressão + um equipamento equipado/válido + efeitos temporários válidos, somados uma vez. Não representar como regra geral de SotDL nem implementar stacking oficial sem curadoria.
- Um painel compartilhado no app/HTML offline mostra inventário, quantidade, origem, bônus e status. Ficha/PDF mostram estado e política. Equipamento guardado não remove efeitos mágicos nem restaura usos de conjuração.
- JSON v2 recebe o novo tipo de ação de forma aditiva; runtime offline passa a `demo-offline-v2`. HTMLs anteriores continuam usando seu runtime incorporado e precisam ser reexportados para receber controles novos.
- Testar combinações, 100 toggles, idempotência, fontes inválidas, troca de equipamento, descanso, arquivos anteriores, JSON/IndexedDB, impressão e roundtrip real file://.
