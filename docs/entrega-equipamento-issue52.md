# Entrega local de composição de equipamento — issue #52

Implementação e aceite técnico do Codex em 2026-11-03, sobre as entregas #50/#51. Esta entrega permanece local; publicação e integração são etapas separadas.

## Contextos suportados e precedência

| Contexto | Composição |
|---|---|
| Posse/guardado | Não aplica efeitos de vestir ou empunhar. |
| Humano Size ½ ou 1 | Perfis selecionados e requisitos individuais; arma com propriedade Size 1 continua exigindo Size 1. Outros tamanhos recebem diagnóstico. |
| Roupas comuns sem proteção adicional + armadura | Roupa neutra pode permanecer vestida; não soma nem substitui a proteção da armadura. |
| Uma armadura protetora | Substitui Defense, aplica ajustes negativos de Speed e restrições de requisito/natação. Duas armaduras protetoras conflitam. |
| Arma `one` | Mão principal ou ambas; ambas acrescentam o modificador publicado de dano, sem rolar dados. |
| Arma `off` | Mão principal ou secundária. |
| Arma `two` | Ambas as mãos; uma exceção de montaria só vale quando declarada no perfil. |
| Arma e escudo / duas armas compatíveis | Mãos e cópias físicas distintas; bônus defensivos só de armas empunhadas. |
| Dois escudos | Interpretação do usuário: somente o maior bônus defensivo ativo. O menor é mostrado como não aplicado; suspensão do maior permite o outro. |
| Uso de duas armas com escudo | Registro explícito suspende o bônus do escudo usado até o encerramento explícito da rodada; persistir/reabrir conserva a condição. Sem resolver ataques ou gerar dados. |

Ordem: atributos válidos → substituição de Defense e ajuste de Speed da armadura → bônus defensivo aplicável → demais camadas/limites do motor. A composição por origem é exposta à interface; a agregação defensiva validada não libera somas arbitrárias no motor de baixo nível.

Requisitos de arma e `cumbersome` afetam ataques com aquela arma; falta de requisito de armadura afeta testes de Strength/Agility e Speed. Natação acumula sua restrição específica com a de requisito. A penalidade de Speed já é negativa no avaliador publicado: foi corrigida a negação adicional que antes a convertia em bônus.

## Comandos, conflitos e persistência

Cada posição identifica origem e unidade física. A mesma unidade não ocupa duas posições; quantidades não podem ser excedidas. Colisão de mãos, empunhadura inválida, perfil ausente e armaduras protetoras simultâneas suspendem os números, preservando a seleção e os estados/ganhos independentes.

Guardar resolve a posição indicada; substituição é uma ação explícita que remove somente equipamentos conflitantes. O alvo da substituição é revalidado antes de remover as outras posições. Trocar uma concessão ou definição suspende seus equipamentos dependentes e registra o motivo. O comando de compatibilidade para equipar é idempotente e guardar a origem remove suas unidades ativas.

Loadout, condições de uso e histórico de decisões são persistidos, sem RNG em equipar, guardar, recálculo ou reabertura. Saves legados com várias armas não recebem mãos presumidas: precisam de escolha explícita. O gate de hash continua suspendendo saves de implementações/fontes anteriores, preservando seus dados, sem migração silenciosa.

## Decisões explícitas do usuário

- `curation/equipment-local-policy.json`: aplicar somente o maior bônus defensivo, com autoridade e data.
- A camisa especial da #51 conserva atributos mecânicos de mail, classificação leve, peso 0 e nenhum requisito de Strength; não acumula com outra armadura. Sua política anterior permanece intacta.

Essas decisões são distinguíveis do conteúdo publicado. Fontes permanecem `needs-review`; não houve promoção ou declaração de direitos de distribuição.

## Evidência e limites

Foram conferidos 25 perfis publicados selecionados, além do perfil derivado da camisa especial, e seis faixas de regra sobre armadura, mãos, propriedades e uso de duas armas. Metadados/hashes sem excertos em `curation/reviews/issue52-equipment-2026-11-03.json`.

Código: `packages/character-generator/core-equipment.ts`, `tools/curation/core-equipment-projector.ts` e integração em `official-core.ts`. Interface própria em `apps/web/OfficialEquipmentPanel.tsx`; o painel legado foi preservado.

Ataques completos, consumo/recuperação de munição, recarga, misfire, materiais especiais, carga, compras, tempo para vestir e agendamento de turnos não são executados aqui. Restrições de uso e tamanhos sem contexto permanecem explícitas. Encerrar rodada é uma ação registrada; não há relógio que reative bônus ao abrir a ficha. Efeitos especiais pendentes de Interesting Things, exports e finalização geral continuam separados.

## Validação

- **693 testes completos em 61 arquivos** aprovados, com dois workers e limites de tempo preservados.
- **146 testes direcionados finais em quatro arquivos** aprovados após o ajuste de compatibilidade, incluindo saves legados, idempotência, requisitos insuficientes, política de escudos e regressões de #50/#51.
- **Dois E2Es aprovados**: fontes indisponíveis, geração real, seleção de posições, guarda, persistência, regra da camisa especial, escolhas do mestre e ausência de rerrolagem/exportação. Resolução de conflito pela interface também é exercitada quando o kit sorteado fornece outra arma.
- TypeScript, build de produção e auditoria da entrada oficial aprovados.
- Freeze de **16 arquivos** preservado; privacidade com **zero achados em 408 arquivos** rastreados/novos.

O aceite foi registrado no corpo da [issue #52](https://github.com/AntonioVCruz/sotdl-character-forge/issues/52). A implementação permanece local; publicação e revisão ficam separadas deste aceite.

## Publicação autorizada

Branch `codex/issue52-equipment`, baseada em `codex/issue51-interesting-things` (PR #58). Revisar e integrar #50 → #51 → #52 → #53 nessa ordem; redirecionar cada PR para `main` somente após integrar sua base. Publicação de código autorizada pelo usuário; merge permanece separado. Insumos reais continuam locais.
