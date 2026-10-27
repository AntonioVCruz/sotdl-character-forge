# SPEC-006 — Salvar e exportar personagem
**Status:** Draft. **Prioridade:** P1. **Requisitos:** RF-010, RF-012.

## Aceitação
AC-001: editar ficha e reabrir preserva evento, personagem, ruleset, pack/version refs e estado ativo.
AC-002: exportar/importar JSON preserva estado sem depender de HTML.
AC-003: versão nova migra schema antigo e reporta incompatibilidade, sem descartar dados.
AC-004: HTML exportado mostra ficha atual com marcação de fonte e valores corretos; qualquer edição futura pelo HTML exige especificação própria.
AC-005: impressão/PDF A4 contém mesmos cálculos da UI e quebra páginas apropriadamente.
AC-006: carregar JSON com scripts/campos não confiáveis não executa código.
AC-007: sem pack necessário, o arquivo ainda abre com placeholders e aviso.

## Fora de escopo
PDF editável com formulários AcroForm; HTML autônomo e editável será implementado na SPEC-007 como requisito do produto final, não no primeiro MVP.

## Aditivo v0.2 — salvamento do processo aleatório
**AC-008:** salvar/exportar/importar JSON persiste seed, algoritmo PRNG/version, `RollEvent`s, estratégia, locks, eventSeq, versões de packs e rerrolagens; reabrir preserva a ficha e resultados aprovados.
**AC-009:** HTML/PDF refletem outcomes aprovados e valores calculados, sem qualquer novo sorteio no exportador.
**AC-010:** se pack original não estiver disponível, manter o resultado/roll e assinalar a dependência; não refazer a tabela com outra edição.
