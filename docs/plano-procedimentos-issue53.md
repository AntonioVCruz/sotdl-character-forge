# Atividades da issue #53

Escopo: procedimentos Core e Human Development de Humano L0, com seleção independente de variante, modo de atributos e fonte de Interesting Things. Mantém a implementação anterior de Core e as entregas #50–#52.

1. [x] Registrar a matriz de passos, cardinalidades, escolhas e substituições.
2. [x] Projetar e conferir os lotes reais Core/Only Human/Oddities para consumo local.
3. [x] Implementar sequência, encadeamentos, limites de recursão e consequências por origem.
4. [x] Integrar manual/híbrido/aleatório, locks, rerolls e invalidação com histórico.
5. [x] Expor criação, pendências, salvamento e reabertura na interface.
6. [x] Verificar probabilidades/percursos/replay, registrar aceite e aplicar os gates de ativação autorizados.

Ordem: 1 → 2 → 3 → 4 → 5 → 6. Autoria: Codex.

Evidências e limites: [matriz](matriz-procedimentos-issue53.md) e [entrega local](entrega-procedimentos-issue53.md). Publicação e integração permanecem pendentes.

## Decisões do usuário

- Cada pai morto recebe sua própria causa de morte, com identidade e rolagem independentes.
- Only Human/Oddities podem ser ativados localmente nos recortes implementados e verificados, conservando pendências explícitas, fontes `needs-review` e exports desabilitados.
- Medidas: aplicar Build às medidas-base e depois a escala etária; manter as experiências vinculadas à rolagem inicial de idade, inclusive quando eventos acrescentarem anos posteriormente.

Em Human Development, tabelas exigidas conservam suas rolagens publicadas. Modos controlam o avanço; escolhas dirigidas são explícitas e sorteio uniforme de opções do aplicativo exige consentimento e identificação própria. Core conserva escolhas manuais permitidas. Fontes adicionais indisponíveis não geram fallback oculto.
