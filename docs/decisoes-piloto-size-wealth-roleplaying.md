# Decisões do piloto — Build, Size, Wealth e Roleplaying Questions

Decisões e textos fornecidos pelo usuário em 2026-10-27, incorporados à matriz de CUR-014. Esta revisão não executa CUR-015/018/033 nem adiciona campos ao criador demonstrativo.

## Build e Size

Size vem da ancestry e independe de Build. Só aplicar relação quando uma regra ou tabela determinar Size explicitamente. O usuário citou Clockwork Form como exemplo de exceção; esse exemplo não ativa regras de Clockwork no piloto Human. A suposta ausência de relação não é mais uma lacuna: é a independência confirmada pelo usuário.

Decisão rastreada em `curation/pilot/creation-decisions.json`. Human continua oferecendo Size 1/2 ou 1, sem conversão automática a partir de descrição de porte, altura ou peso.

## Wealth e Starting Equipment

O texto completo dos seis kits foi preservado em `curation/corrections/core-starting-equipment-2026-10-27/starting-equipment.txt`. Essa mensagem continha os kits e o procedimento 3d6, mas não os limites numéricos finais. Em resposta à pergunta de esclarecimento, o usuário confirmou **17 Wealthy / 18 Rich**; a resposta está em `wealth-limits.txt`, com origem e hashes no manifesto da mesma pasta.

| 3d6 | Estilo de vida | Combinações de dados em 216 |
|---|---|---:|
| 3–4 | Destitute | 4 |
| 5–8 | Poor | 52 |
| 9–13 | Getting By | 125 |
| 14–16 | Comfortable | 31 |
| 17 | Wealthy | 3 |
| 18 | Rich | 1 |

O mapeamento está completo, sem lacunas ou sobreposições. Os testes enumeram as 216 combinações de 3d6; Wealthy/Rich não são equiprováveis aos outros estilos de vida. O artefato registra isso em `wealthScope`, sem emitir `RandomTable` importável ou declarar os kits formalizados. CUR-018/021 ainda deve tratar itens, alternativas, moedas e escolhas do GM.

## Roleplaying Questions

O usuário determinou apenas alguns campos não obrigatórios. A configuração do futuro consumidor real passa a ter quatro campos livres: **Vínculos**, **Valores e motivações**, **Segredos** e **Notas de interpretação**. Todos são opcionais; não se exige resposta, número mínimo de segredos ou compartilhamento com GM. Deixar todos vazios não bloqueia criação, salvamento, aceite ou geração completa.

Essa simplificação é uma política do produto registrada em `curation/pilot/creation-decisions.json`, separada do texto original do Core, que continua preservado como referência. A implementação dos campos no consumidor real pertence a CUR-033/036/037.

## Resultado e preservação

A matriz mantém **28 passos**, agora com **57 faixas de evidência** e **6 passos com pendências**. As 46 faixas do corpus e os quatro MDs originais não foram alterados; 11 faixas apontam para quatro textos fornecidos. Os 230 bloqueios e os 1.320 segmentos em quarentena permanecem.

Snapshot da revisão anterior em `curation/history/pilot-size-roleplaying-equipment-2026-10-27/`. A matriz, sua entrega e o backlog foram atualizados. Próxima tarefa: CUR-015.

Validação aprovada: 73 testes de curadoria, 147 testes completos e build. Os testes verificam a cobertura exata dos 216 resultados de Wealth e rejeitam a introdução de respostas obrigatórias nas decisões de Roleplaying Questions.

Atualização posterior: o usuário forneceu a numeração de profissões; a matriz atual passou a 65 faixas e quatro passos com pendências. Os números acima descrevem a revisão de Size/Wealth/Roleplaying. Veja [complemento de profissões](entrega-complemento-profissoes-core.md).
