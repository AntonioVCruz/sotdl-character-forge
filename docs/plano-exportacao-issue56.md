# Execução da #56 - exportação Human L0

Base: main 2c5ef89, revisão #55. Checkout isolado `output/html/issue56-work`.

1. [x] Ler a issue e definir campos/condições por formato.
2. [x] Implementar gates e projeção mínima, independente dos contextos licenciados.
3. [x] JSON versionado, dependências exatas e importação por replay sem RNG.
4. [x] HTML de leitura e impressão A4/PDF com a mesma projeção.
5. [x] Integrar emissão/importação nos fluxos Core e procedimentos.
6. [x] Verificar bloqueios, paridade, privacidade, navegador e registrar entrega em `entrega-exportacao-issue56.md`.

## Contrato de conteúdo

JSON: envelope versionado, pins exatos dos packs e contexto, estado numérico, referências por ID, decisões/rolagens do personagem e recibo de finalização. Replay é um contrato explícito de campos tipados: não aceita contexto, catálogo, evidências, textos de resultados ou regras. Nome e campos livres das decisões são dados escritos pelo usuário; emissão exige confirmação de que deseja incluí-los. Os schemas estritos validam também estruturas aninhadas.

HTML e impressão/PDF: projeção de leitura idêntica ao resumo JSON, com nome, números, inventário por ID/origem, profissões/idiomas por ID, fontes por ID/versão/hash e pendências de uso/opcionais por chave/código. Sem textos de regras, nomes/descrições de catálogo ou scripts executáveis. HTML funciona por file:// e permite impressão pelo navegador; edição e uso de poderes offline ficam fora deste contrato.

Todos os formatos exigem fonte local autorizada, contexto exato, capacidades implementadas, quantidades resolvidas e finalização revalidada. Importação exige os mesmos pins/contexto e comparação do resumo recomputado; não finaliza automaticamente, não completa escolhas nem rola dados. Erros preservam o save anterior. A ausência de corpus bloqueia emissão/importação real.

Os gates de distribuição dos packs continuam falsos; a autorização desta issue cobre somente a projeção mínima da ficha. O freeze #55 é um snapshot histórico e não é regravado para acomodar alterações. Novos artefatos possuem versão própria.
