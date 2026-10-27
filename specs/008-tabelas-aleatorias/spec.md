# SPEC-008 — Motor de tabelas aleatórias (dados oficiais e encadeamentos)
**Status:** Draft | **Prioridade:** P0 | **Requisitos:** RF-014/015/018, NFR-007/008.  **Dependências:** SPEC-001.

## Problema
Os livros e suplementos apresentam tabelas com expressões e distribuições variadas, intervalos, condicionais, resultados adicionais, ajustes mecânicos e sub-tabelas. Uma simples escolha randômica da linha dá probabilidades erradas ou ignora consequências.

## Histórias do usuário
- **US-008.1 — jogador:** quero rolar a tabela adequada de background/appearance/profession/wealth/interesting things sem buscar manualmente páginas e dados.
- **US-008.2 — curador:** quero cadastrar tabelas por livro e variante e validar cobertura/encadeamentos sem editar código do motor.
- **US-008.3 — narrador:** quero permitir ou proibir tabelas opcionais e rastrear cada resultado até o texto publicado.

## Regras de comportamento
1. Uma tabela publicada é identificada por **publicação, edição, página, variante e ID**, e não apenas por seu nome. Não fundir tabelas homônimas.
2. Interpretar `NdM+K` lançando **N dados independentes** e usando a soma, nunca escolhendo um inteiro uniformemente entre mínimo e máximo; dados de mesmo número de faces precisam de sorteio uniforme sem viés.
3. Mapear o resultado numérico para faixas/valores conforme a fonte e preservar a distribuição implícita. Tratamento especial de tabela com dois eixos deve ser definido no pack, não improvisado.
4. Permitir sub-tabelas como `d6` para selecionar uma tabela e `d20` dentro dela; permitir quantidades adicionais (`1d6 ss`, etc.), alternativas, condicionais e tabelas associadas a ancestry/background, com `parentRollId`.
5. `TableOutcome` produz descrição curada, `ChoiceEvent` e/ou `mechanicalEvents` tipados. Outcomes cuja aplicação não foi validada permanecem com `manualAdjudication`.
6. Rodar tabela oficial **não é** o mesmo que selecionar uniformemente uma opção elegível. Não filtrar linhas de tabela oficial para forçar resultados válidos, salvo se um procedimento de rerroll/rejeição estiver documentado na fonte e implementado.
7. Tabelas que não cubram todos os resultados, produzam colisões, cycles ou referências inexistentes falham validação de curadoria. Com fonte incompleta: armazenar status `needs-review` e não declarar resolução automática válida.
8. Toda operação de sorteio é explícita e independente da UI/renderização/recalculo; usa PRNG versionado, seed controlável, bounds de execução e log de rolagem.

## Critérios de aceitação (verificáveis)
- **AC-001:** um resultado `3d6` é soma de três faces `[1..6]`; 3 e 18 podem ocorrer mas são menos prováveis que 10/11.
- **AC-002:** uma tabela `d20` aceita 1–20, inclusive ranges, sem lacunas ou sobreposição; distribuição é a da rolagem, não `uniform` sobre outcomes.
- **AC-003:** ao rolar uma tabela `d6→d20`, criar duas traces (table selector, table result) vinculadas por `parentRollId`.
- **AC-004:** rolagens quantitativas secundárias preservam faces, total, ID da regra e valor aplicado ao personagem.
- **AC-005:** dados/campos de uma tabela carregada de pack desabilitado não são utilizados; tabela homônima de outra edição não substitui silenciosamente.
- **AC-006:** mesma seed, mesma versão PRNG, mesmo rollKey/rerollIndex e mesma versão de tabela dão mesmo resultado reproduzível; `calculateCharacter` não executa rolagens.
- **AC-007:** entrada incompleta ou referência de tabela inexistente impede `status=curated` e retorna diagnóstico legível (com fonte/página).
- **AC-008:** outcome com efeito mecânico validado produz evento tipado no mesmo histórico utilizado por escolha manual; outcome sem handler vira pendência, não bônus inventado.
- **AC-009:** proteção contra recursion cycle e limites de profundidade/número de rolagens; falha não altera Character JSON.
- **AC-010:** rolagens `official-table` e decisões `uniform-eligible` aparecem diferenciadas no histórico e na UI.
- **AC-011:** o sistema aceita desde cedo tabelas de uso **narrativo** e de uso **mecânico**, desde que consequências mecânicas estejam explícitas e validadas.

## Exemplos de fontes a curar (sem incluir conteúdo integral no kit)
- *Shadow of the Demon Lord Core*, cap. 1: tabelas de ancestry, profission/wealth e Interesting Things. O Core usa, conforme tabela, `d20`, `3d6` e processo `d6→d20` (consulte `docs/tabelas-aleatorias-e-curadoria.md`).
- Suplementos de ancestries adicionam tabelas próprias de background/origem/educação/características conforme a publicação e devem ser catalogados por edição.
- O compêndio de regras do projeto registra tabelas opcionais de quirks em *Frayed Ends*, mas a fonte citada precisa ser auditada antes de automatizar.

## Fora do escopo desta SPEC
Criar uma interface completa ou gerar uma ficha inteira (SPEC-009). Interpretar texto não estruturado automaticamente para inventar consequências não validadas.
