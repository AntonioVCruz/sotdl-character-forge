# Entrega — ficha A4 e PDF por impressão

Registro da etapa anterior. A ficha autônoma com a mesma impressão foi entregue em [entrega-html-autonomo.md](entrega-html-autonomo.md).

Data: 2026-10-26. Fatia das SPEC-005/006. Plano anterior: `docs/plano-impressao-a4.md`.

## Resultado
- Botões **Visualizar ficha A4** e **Imprimir / Salvar como PDF**. A impressão abre o diálogo nativo com `window.print()`; Ctrl+P imprime a mesma ficha.
- A ficha confirmada e a cópia imprimível recebem a mesma instância de `CharacterView`. O componente de impressão não calcula números, não consome RNG e não executa ações de sessão.
- A4 com margens, fundo branco, tipografia legível, numeração de páginas e cabeçalhos repetidos em tabelas. Escolhas, cartões e parágrafos curtos são preservados quando cabem; notas extensas fluem sem altura fixa ou truncamento.
- Inclui nome/notas salvos, nível/revisão, características finais, escolhas com fonte/estratégia, recursos, aprendizado, usos, efeitos solicitados como ativos, pendências e breakdown. Distingue efeitos Ativos de Suspensos e deixa explícito quando modificadores não estão aplicados.
- Conteúdo fictício está destacado. Rastreio mostra seed, PRNG, contador e faces/resultados das decisões atuais, com origem. O histórico integral permanece no JSON.
- Catálogo, controles de edição, prévias não confirmadas e ações de sessão não entram no PDF. Alterações não salvas de nome/notas também não entram.
- Prévia de leitura em portal separado; fundo do aplicativo fica inerte, foco fica nos controles da prévia, Escape fecha e restaura foco. A prévia em tela tem fluxo contínuo; a paginação final é a do diálogo de impressão.

## Verificação
**61 testes unitários/integrados e 14 E2E aprovados**, incluindo três testes de impressão. Build TypeScript/Vite aprovado. Casos de impressão reexecutados após as correções visuais de fundo e paginação.

| Critério | Evidência |
|---|---|
| SPEC-005 AC-001/003 | Compara cada número impresso ao `CharacterView` e à ficha confirmada com efeito ativo; imprime breakdown |
| SPEC-005 AC-004/005 | Nível 0 omite grimório/sessão; conteúdo longo flui por páginas A4 sem perda de marcadores |
| SPEC-006 AC-005 | PDFs gerados no Chromium, todas as páginas verificadas em 595.28 × 841.89 pontos, com rodapés e tabelas continuadas |
| SPEC-006 AC-009/010 | JSON antes/depois da impressão preservado; origem e resultados aprovados permanecem; fonte ausente produz pendências e efeito suspenso |

E2E: `tests/e2e/print.spec.ts`. Validador: `tools/verify-print-pdf.py` (Python + `pypdf`). A verificação estrutural confirma A4, texto esperado, ausência de controles e páginas não vazias. Os 30 marcadores de notas longas são conferidos no texto extraído, e o tamanho do conteúdo permanece dentro do limite de 10.000 caracteres do personagem.

PDFs de teste gerados em `output/pdf/`, não versionados:
- `personagem-demonstrativo-ativo.pdf`: nível 1 com magia e efeito ativo, 3 páginas.
- `personagem-com-pendencias.pdf`: fonte mágica desabilitada e efeito suspenso, 3 páginas.
- `personagem-notas-longas.pdf`: nível 0 com notas extensas, 4 páginas.

As páginas dos três casos foram renderizadas e inspecionadas visualmente: fundo branco, conteúdo dentro das margens, texto sem cortes e quebras legíveis. Poppler não estava disponível no Windows; o renderizador PDFium (`pypdfium2`) foi instalado somente em `tmp/pdf-tools` para esta inspeção, sem dependência de runtime no aplicativo.

Para repetir a renderização local, instale `pypdfium2` e execute:

```sh
python tools/verify-print-pdf.py output/pdf/personagem-demonstrativo-ativo.pdf --render-dir tmp/pdfs/ativo
```

## Uso e limites
Salvar nome/notas, confirmar escolhas, abrir impressão e escolher **Salvar como PDF**, papel A4, escala 100%, sem cabeçalhos/rodapés automáticos do navegador. O layout foi validado em Chromium; outras engines, tamanhos de papel e ajustes manuais podem mudar quebras e suporte aos rodapés CSS.

Não há exportador PDF próprio, PDF com formulários, HTML autônomo/editável, retrato, conteúdo oficial ou ampliação dos níveis. A etapa seguinte prevista na SPEC-007 é exportar HTML autocontido com runtime de edição e recálculo offline.
