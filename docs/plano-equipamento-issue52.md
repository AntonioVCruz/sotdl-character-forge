# Atividades da issue #52

Escopo: composição contextual do equipamento de Humano Core L0, sobre as entregas #50/#51. A interpretação da camisa especial já autorizada pelo usuário permanece: atributos mecânicos de mail, classificação leve, peso 0, sem requisito de Strength e sem acumular com outra armadura.

1. [x] Conferir regras, exclusões e precedência; definir a matriz de contextos suportados.
2. [x] Implementar composição pura de armadura, mãos, bônus e restrições com origem.
3. [x] Integrar comandos de equipar/guardar/trocar e resolução explícita de conflitos, com persistência.
4. [x] Exibir posição, contexto, conflitos e composição dos valores na interface.
5. [x] Verificar combinações, requisitos, retirada/troca, replay e reabertura sem RNG, com fixtures fictícias e conferência local separada.
6. [x] Registrar aceite, limites e atualizar a issue #52.

Ordem: 1 → 2 → 3 → 4 → 5 → 6. Autoria: Codex. A publicação não implica merge ou deploy; fontes e exports preservam seus gates.

Decisão explícita do usuário para dois escudos: aplicar somente o maior bônus defensivo. Política registrada em `curation/equipment-local-policy.json`, separada dos fatos publicados. Um bônus suspenso por uso não participa dessa escolha; o bônus do outro escudo pode então se aplicar.

As seis atividades foram concluídas em ordem. Aceite local registrado no corpo da issue #52 em 2026-11-03; a issue permanece aberta para publicação e integração. Evidências e limites em `docs/entrega-equipamento-issue52.md`.
