# Entrega local da #56 - ficha real mínima

Implementação na branch `codex/issue56-exports`, baseada na main `2c5ef89`, em 2026-11-06. Autoria e aceite técnico: Codex. [Lista sequencial de atividades e política dos formatos](plano-exportacao-issue56.md).

## Resultado por critério

- [x] Conteúdo/condições definidos a partir da #55: números, estado, referências por ID, decisões próprias e metadados exatos; exclusão de regras, descrições, nomes de catálogo, evidências, PDFs, catálogo e contexto completo. Nome e campos livres das decisões requerem confirmação explícita antes da emissão. Os campos livres representam conteúdo informado pelo usuário, que deve conferir o que escreveu.
- [x] Gates de fonte, contexto, capacidade mecânica, material e completude: emissão recalcula a criação e exige recibo de finalização válido. Cada operação da interface busca novamente o endpoint local sem cache. Campos de exportação globais dos packs/contextos permanecem falsos; este contrato autoriza somente a projeção mínima. Rascunhos não oferecem os controles de emissão completa.
- [x] JSON `sotdl.character-export@1.0.0`, HTML de leitura independente e impressão A4/PDF usam o mesmo resumo. Incluem todos os atributos/modificadores/estados, dinheiro exato, quantidades, referências de inventário e unidades em uso, profissões/idiomas por ID, dimensões disponíveis, pendências de uso, omissões opcionais e fontes. Contexto é representado por hash, fontes por ID e packs por versão/hash/dependências exatas. Fontes de resultados suplementares aparecem nas referências por ID, vinculadas ao hash do contexto.
- [x] JSON reabre por replay nos dois fluxos, sem geração, avanço, finalização automática ou RNG. O envelope e suas estruturas aninhadas são estritos. Importação revalida as fontes e compara envelope, pins e resumo inteiros por digest; versões/contexto/valores adulterados são recusados antes da substituição do save. Limite de leitura/emissão JSON: 2 MB UTF-8. Saves antigos continuam locais; não se tornam automaticamente um JSON de exportação aceito.
- [x] Bloqueios, emissões e formatos foram testados. HTML é de leitura: não incorpora o motor nem permite editar/criar/conjurar offline. Para continuar, importar JSON com as mesmas fontes e implementação. Nenhum formato com catálogo ou textos licenciados foi habilitado.

## Validação

- Suíte completa: 596 testes aprovados, quatro ignorados; o checkout público não contém os quatro compêndios, e os testes reais dirigidos usam `SOTDL_LOCAL_SOURCE_ROOT` para os pilotos privados verificados.
- Testes próprios: três casos com dados inventados e quatro casos reais (Core, procedimentos Core e Human Development com atributos fixos/aleatórios). Comprovam consentimento, recusa de rascunho, campos desconhecidos, tamanho, versão, valores/pins/contexto adulterados e ausência de chamadas RNG na reabertura.
- Navegador: Core e procedimentos aprovados com download JSON, importação válida/adulterada, preservação de save, HTML `file://` sem rede, prévia de impressão e bloqueio quando a implementação da fonte muda. Os dois percursos anteriores de finalização e os dois testes de fontes indisponíveis também passaram; dois testes legados exigindo corpus no checkout foram omitidos.
- PDFs Core e procedimentos: duas páginas A4 cada, conteúdo extraído conferido e todas as páginas renderizadas para inspeção visual. Artefatos reais permanecem em `output/pdf/` e `output/html/issue56/`, ignorados pelo Git.
- TypeScript, build de produção e auditoria da entrada oficial aprovados. Os 16 contratos originais foram conferidos sem substituir o baseline; no checkout Windows os bytes LF foram restaurados somente após conferir os hashes esperados.
- Privacidade inclui novos arquivos não rastreados. Os insumos privados continuam no workspace de origem; nenhuma cópia dos livros entrou nesta entrega.

## Reprodução

No checkout desta branch, configurar `SOTDL_LOCAL_SOURCE_ROOT` para o workspace licenciado antes de `npm run dev` ou dos testes reais. O plugin usa esse diretório apenas para os dados e continua verificando a implementação do checkout corrente.

```powershell
$env:SOTDL_LOCAL_SOURCE_ROOT='C:/Users/vicen/Projects/sotdl-sdd-starter'
npm test
npm run build
npx playwright test tests/e2e/character-export.spec.ts
```

O freeze da #55 conserva o snapshot de sua revisão: novos arquivos e alterações desta entrega devem produzir diferença nesse manifesto histórico, sem regravação automática para esconder mudanças. Os contratos de 16 arquivos continuam congelados. Esta implementação não promove fontes, não amplia handlers e não resolve direitos de distribuição de livros. PDFs e capturas de QA locais não são artefatos públicos.

Publicação, PR, merge e fechamento administrativo da #56 não foram executados nesta entrega local.
