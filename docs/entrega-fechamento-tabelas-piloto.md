# CUR-021 — fechamento das tabelas do piloto

Entrega em 2026-10-27: **auditoria das tabelas concluída**, com faixas e probabilidades verificadas e restrições de aplicação explícitas. A confirmação posterior do usuário resolveu Fears/Desires; não há associações de transcrição pendentes no fechamento. Handlers e orquestração ainda são necessários antes de habilitar geração oficial.

O [artefato de fechamento](../curation/pilot/table-closure.json) consolida CUR-016 a CUR-020, mantendo as identidades e publicações originais. O [relatório reproduzível](../curation/reports/table-closure.json) registra entradas e hashes.

| Recorte auditado | Quantidade |
| --- | --- |
| Tabelas do inventário CUR-016 | 61 |
| Seletor e categorias adicionais de Oddities | 13 |
| **Total de tabelas** | **74** |
| Tabelas com dados | 69 |
| Consultas por estilo de vida, sem dados extras | 5 |
| Fluxos numéricos, incluindo duas colunas de Personality Traits | 70 |
| Linhas/faixas dos fluxos | 901 |
| Fluxos com cobertura numérica completa | **70 de 70** |
| Vínculos de encadeamento | 73 |
| Menções contextuais a dados secundários | 77 |
| Achados de CUR-016 revisados | 7 |
| Faixas de evidência consolidadas | 769 |

As cinco consultas de Only Human possuem os mesmos seis estilos de vida e usam o resultado já obtido. Elas não geram cinco novas rolagens de riqueza. Personality Traits mantém uma identidade de tabela, mas possui dois fluxos independentes: positivo e negativo. Não se usa uma única face para obrigar o par da mesma linha.

## Faixas e probabilidades

A auditoria verifica duplicatas, faixas invertidas, lacunas, sobreposições, resultados inalcançáveis e cobertura dos totais publicados. Contagens e denominadores são strings inteiras calculadas com `BigInt`; não há arredondamento em ponto flutuante.

Foram conferidas as distribuições de 1d6, 1d20, 3d6 e **4d6 de Sibling Ages**. A distribuição de 3d6 tem 216 combinações; 4d6 tem 1.296. A enumeração independente de todas as faces nos testes reproduz o peso de cada uma das 901 linhas/faixas.

Quatro auditorias adicionais compõem seletor e filho. A opção religiosa de Only Human usa d6 e pode ter resultado com probabilidade 1/36; uma linha simples da tabela Common usa d20 e tem 1/120. Oddities preserva categorias com peso dois no seletor: uma entrada de Art and Heirlooms tem 2/400, enquanto uma entrada de Minor Magic tem 1/400. As 120 combinações de Interesting Things Core continuam com 1/120 cada.

Childhood e Starting Lifestyle de Only Human mantêm caudas abertas. O modificador é somado depois dos dados, sem limitar o total bruto a 3–18. Childhood aceita os modificadores familiares publicados; outras tabelas não passam a aceitar modificadores arbitrários. Core e Only Human mantêm seus próprios intervalos de idade, aparência, profissões e riqueza.

Uma continuação de Major Setback 4 começa com “1 Corruption.” na linha 13980. Ela permanece dentro do resultado 4 e não é interpretada como um segundo resultado 1. A distinção é explícita e testada contra a transcrição preservada.

## Aplicabilidade, encadeamentos e efeitos

Cada tabela conserva ativação, modo de seleção e fonte. Only Human substitui a geração aleatória normal de profissões e riqueza e preserva a exigência de dados de seu procedimento. O modo de atributos é independente da escolha dessas tabelas. A profissão da família não vira automaticamente profissão/equipamento do personagem, e a seleção entre categorias familiares permitidas continua uma escolha explícita, sem dado uniforme inventado.

Os dois vínculos de ganho de Interesting Things — inicial e extra de Minor Windfall 10 — agora apontam ao **procedimento selecionado**. O seletor virtual resolve para Oddities por padrão ou Core quando escolhido. Uma fonte desabilitada gera pendência; não há fallback oculto. A transcrição que resolveu as 13 associações de Oddities permanece aplicada.

O fechamento conserva os modelos de profissões/idiomas, modificadores de riqueza, programas materiais e consequências de Interesting Things. As cinco referências ambíguas de itens e os 57 tipos de ganho sem definição exata continuam identificados; registros genéricos editáveis são permitidos, com compra/aplicação automática restritas. O bônus fictício de armadura do demo não participa da auditoria.

As 77 menções a dados no texto **não são 77 comandos obrigatórios de criação**. Algumas mandam acessar uma tabela filha; outras determinam conteúdo, duração, estado, anos narrativos ou efeitos no uso. O artefato preserva essas menções sem executá-las indiscriminadamente, junto das estruturas já formalizadas em CUR-017/018/019 e oito regras críticas de contexto.

Entre essas regras, Core Background 12 usa 1d6−2 filhos, com mínimo zero: zero tem duas faces de seis, e os resultados 1–4 têm uma cada. Siblings exige uma rolagem de Character Fate por irmão efetivamente existente. Minor Setback 13 usa par/ímpar para responsabilidade. Major Windfall 11 testa perda do favor **após invocá-lo**, não durante a criação.

Os quatro pontos de ciclo do inventário são conservados: Siblings, Character Fate, Strange e Piety. Os avaliadores de referência de Piety e Strange aceitam sequências explícitas e um limite de passos; ao atingir o limite, devolvem pendência, sem apagar resultados ou escolher outro desfecho.

Em Piety, cada resultado 3 exige Religious Beliefs e nova rolagem de Piety. Cada 3 depois do primeiro acrescenta 1 Insanity; um resultado final 18 também acrescenta 1. Os contadores são previews, não alterações no personagem. Em Strange, somente o resultado 19 sem Tooth and Claw permite o reroll publicado ignorando 19. Com a fonte habilitada, o resultado é mantido e a aplicação de skinchanger depende de handler/adjudicação.

## Disposição dos sete achados

| Achado de CUR-016 | Disposição |
| --- | --- |
| Fears/Desires | Resolvido pela transcrição explícita do usuário: duas tabelas independentes de 1d6, com os 12 resultados confirmados. |
| Prosa duplicada no seletor de profissões | Limite resolvido: seis entradas numéricas; linhas 14315–14318 não são resultados. |
| Ordem de idade e medidas | Composição manual até implementar o handler. Preservar exceções explícitas de Size, sem criar Life Experiences extras por mudança posterior de idade. |
| Morte dos dois pais | Não presumir uma causa compartilhada ou duas rolagens. Registrar sujeitos e decisão do GM. |
| Recursão | Limites de referência para Piety/Strange; recursão opcional de parentes ainda exige identidades, linhagem e orquestração. |
| Categoria profissional familiar | Escolha manual entre categorias autorizadas pelo resultado; sem seletor uniforme inventado. |
| Dependências externas | Ramos condicionados à fonte e ao contexto, sem conceder ambos nem rerrolar silenciosamente. Handler ausente permanece como adjudicação. |

**Fears e Desires foram confirmados pelo usuário**, com os seguintes resultados:

| 1d6 | Fears — Fear | Desires — Value |
| --- | --- | --- |
| 1 | Disgrace | Status |
| 2 | Failure | Fame |
| 3 | Death | Wealth |
| 4 | Isolation | Glory |
| 5 | Judgment | Love |
| 6 | Anonymity | Redemption |

As rolagens são independentes; o cabeçalho **Value** foi preservado como fornecido, dentro de Desires. A [transcrição confirmada](../curation/corrections/only-human-fears-desires-2026-10-27/tables.txt) e seu [manifesto com hash](../curation/corrections/only-human-fears-desires-2026-10-27/manifest.json) fornecem evidência adicional sem alterar o MD original. Os IDs permanecem iguais e os artefatos anteriores foram guardados em `curation/history/before-fears-desires-confirmation-2026-10-27/`.

`associationReviewTables` está vazio; a disposição do achado é `resolved-user-transcription`. O resolvedor retorna os resultados confirmados e continua recusando associações marcadas como não verificadas. Essa confirmação não alega conferência em PDF nem habilita handlers ou geração oficial.

Books and Scrolls 20 permanece apenas com a linha que menciona **Dark Passages**, sem bloquear seleção pela ausência do gerador. Seu ponto de integração futura para uma passagem ou livro aleatório continua desabilitado, conforme decisão do usuário.

## Reprodução, testes e próximos passos

[pilot-table-model.ts](../packages/curation/pilot-table-model.ts) oferece auditoria de distribuições/faixas, composição de seletores e resolvedor de faces de referência. Este rejeita fonte desabilitada, faces incompatíveis, coluna desconhecida, cobertura incompleta e associações não confirmadas. Nenhuma função executa RNG ou altera Character.

```powershell
npm run curation:pilot-tables
node tools/curation/pilot-tables.mjs --check
npm run curation:check
npm test
npm run build
```

O formalizador valida CUR-020 e seus antecessores antes de escrever. `--check` compara artefatos sem sobrescrevê-los; o runner pode atualizar cache em `tmp/curation/`. Os insumos, contratos congelados e derivados anteriores permanecem preservados.

Treze cenários novos cobrem todas as distribuições, probabilidades compostas, colunas independentes, caudas abertas, side rolls críticos, ciclos, fontes, evidências e adulteração. Os gates de packs importáveis, handlers, integração e geração oficial continuam falsos; o aceite vertical real continua em CUR-039.

Gates aprovados em 2026-10-27: **145 testes de curadoria em 20 arquivos**, **219 testes completos em 27 arquivos** e build TypeScript/Vite. Os quatro insumos e os 16 arquivos do contrato congelado também passaram pelos checks. A UI demonstrativa permaneceu igual, sem necessidade de E2E adicional.

Pela ordem recomendada do backlog, o próximo passo para o piloto é **CUR-031 — compilador staging→packs por publicação**, seguido de CUR-032. O compilador deve preservar os estados manuais/bloqueados. CUR-022 permanece a próxima tarefa da trilha de progressão, sem ser executada nesta entrega.
