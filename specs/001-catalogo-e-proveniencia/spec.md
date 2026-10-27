# SPEC-001 — Catálogo modular e proveniência
**Status:** Draft. **Prioridade:** P0. **Requisitos:** RF-001, RF-002, RF-011, RF-012.

## Problema
As fontes possuem republicações, variantes, erratas e texto preservado em MD. Não é seguro consolidar mecanicamente apenas por nome ou depender de busca textual durante cálculo.

## User stories
US-001: Como jogador, quero habilitar packs por campanha e ver apenas opções elegíveis.
US-002: Como curador, quero adicionar uma nova publicação sem editar o motor.
US-003: Como narrador, quero escolher variantes/house rules conscientemente.

## Aceitação
AC-001: importar registros com `id`, `source`, `sourcePage`, `variant`, tipo, revisão, e rejeitar/assinalar duplicatas conflitantes no mesmo pack.
AC-002: duas versões publicadas da mesma spell/path coexistem, associadas a fontes diferentes.
AC-003: desabilitar pack exclui opções de novas escolhas e mantém dados de personagens já salvos com aviso de dependência.
AC-004: pack inválido não chega à interface nem altera estado persistido.
AC-005: catálogo apresenta página de origem e status de conteúdo validado/manual.
AC-006: habilitação/errata não sobrescrevem silenciosamente conteúdo anterior.

## Fora de escopo
Extração automática de PDF e hospedagem pública de textos protegidos.

## Aditivo v0.2 — tabelas como conteúdo
**AC-007:** importar `randomTable` com `diceExpr`, `ranges`, `outcomes` e `sourceRef`/`sourcePage`, distinguindo tabela incompleta de validada.
**AC-008:** duas tabelas homônimas de suplementos diferentes coexistem; seleção de fonte segue ruleset/precedência, sem mescla automática.
**AC-009:** import rejeita overlap/lacuna sem declaração explícita de tratamento, referência aninhada ausente e expressões de dados não suportadas.
**US-004:** como curador, quero cadastrar tabelas oficiais sem tocar no código do gerador e com testes de consistência.
**Dependência:** SPEC-008 consome esse contrato e as fontes filtradas por `Registry`.
