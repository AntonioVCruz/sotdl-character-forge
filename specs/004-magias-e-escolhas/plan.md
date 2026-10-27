# PLAN-004
Modelar tradição descoberta como evento distinto de aprender spell; slots sequenciais; regras por `ruleset.flags` com contexto e fonte. Reprocessar os slots em ordem determinística, não agregar todas as escolhas do nível ao final. Catálogo mantém spell publication record separado de spell concept e traz texto de fonte curada/licenciada.

## Complemento v0.2
Integrar `GenerateSlot` com slots mágicos atômicos (descoberta, spell, replacement), avaliando elegibilidade **a cada evento**. Registrar estratégia, conjunto elegível e roll/pool na trace; a criação de um slot posterior jamais vê futuro não escolhido.
