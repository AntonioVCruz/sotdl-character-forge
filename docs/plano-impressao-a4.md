# Ficha A4 e PDF por impressão

Pedido autorizado: executar a próxima fatia das SPEC-005/006. Usar impressão nativa do navegador para salvar como PDF, sem serviço externo ou geração de novas decisões.

- A ficha imprimível recebe exatamente o mesmo `CharacterView` da ficha confirmada. Nada é recalculado em CSS, nada consome RNG, nenhum comando de sessão é disparado ao imprimir.
- React renderiza uma cópia de leitura em portal separado. CSS de impressão oculta aplicativo/controles e apresenta somente essa ficha, inclusive com Ctrl+P. Prévia A4 na tela com fechar/imprimir, acessível por teclado.
- Imprimir somente dados confirmados: nome/notas salvos, escolhas atuais, números finais, recursos, aprendizado, usos, efeitos ativos/suspensos, pendências, fontes e breakdown. Histórico completo continua disponível no JSON; PDF apresenta rastreio das decisões atuais.
- A4 com margens, tipografia clara, fundo branco, quebra natural de páginas e cabeçalhos de tabela repetidos. Notas longas e textos de fonte devem fluir sem altura fixa ou truncamento. Paginação depende do conteúdo, sem impor número fixo de páginas.
- Botão `Imprimir / Salvar como PDF` chama `window.print()`. Sem exportação HTML autônoma, PDF editável ou edição de regras nesta fatia.
- Verificar casos nível 0, nível 1 com efeito ativo e pendências/fonte ausente; comparar números da tela/impressão, preservar JSON, validar tamanho A4, texto do PDF, fluxo de notas longas e inspecionar páginas renderizadas.
