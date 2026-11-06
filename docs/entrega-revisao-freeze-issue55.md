# Entrega da revisão e freeze Human L0 — #55

Entrega local na branch `codex/issue55-review-freeze`, checkout `output/html/issue55-work`. Base integrada: main `9c22a5c56373063de74ed3b48d2c2d3ba74b733f`. Autoria: Codex; revisão `human-l0-issue55@1.0.0`, em 2026-11-04.

## Critérios de aceite

- [x] Matriz resultado/entidade → fonte/edição/versão → evidência → handler → teste → revisão → destino: `docs/matriz-revisao-freeze-issue55.md`; 2.932 registros detalhados locais, com hash no manifesto público.
- [x] Revisão semântica e probabilidades, autoria e limites de paginação: `docs/revisao-semantica-issue55.md`; PDFs identificados por hash, 871 resultados textuais, 30 referências de seletores, 70 streams e quatro seletores compostos conferidos.
- [x] Destinos/permissões: `docs/destinos-permissoes-issue55.md`; local, Git, JSON, impressão/PDF e HTML separados, sem liberar exportação.
- [x] Freeze reproduzível: `curation/human-l0-review-freeze.json`; entradas privadas, PDFs, implementação, políticas, documentação, testes, lockfile e versões exatas. Os 16 contratos anteriores continuam intactos.
- [x] Aceite vertical: regressões reais e dois percursos de navegador, com persistência, replay, consequências e finalização. Habilitação e exclusões registradas abaixo.

## Resultado e habilitação

Manter exclusivamente a habilitação local já autorizada para o recorte Core / Only Human / Oddities implementado. Não ampliar livros, handlers, distribuição ou formatos. Fontes permanecem `needs-review`, `distributionApproved: false` e `exportEnabled: false`.

Um personagem pode atingir `fullyResolved: true` pelo recibo e pela recomputação introduzidos na #54 quando não existem consequências de criação pendentes. Isso não promove fonte nem autoriza exportação. Efeitos de uso permanecem separados, conforme decisão do usuário. Os casos não suportados conservam bloqueios/adjudicações explícitos; não há aprovação de todas as combinações possíveis nem da mecânica integral de suplementos referenciados.

As identificações de edição/paginação são um overlay desta revisão e não migram o registro global de fontes. Impressão dos três PDFs não identificada; não inventar uma versão editorial com base no ano de copyright. Detalhes e limitações da conferência estão no documento semântico.

## Validação executada

- 435 testes públicos aprovados; 38 casos dependentes de fontes locais ignorados nessa execução sem corpus.
- 154 testes dirigidos reais aprovados em seis arquivos: os cinco conjuntos de fonte/finalização anteriores e a nova enumeração independente das probabilidades.
- Dois casos de navegador reais aprovados: Core com efeito de uso, reabertura e novo bloqueio opcional; procedimentos com finalização, edição e preservação de save com contexto antigo. As APIs são atendidas pelo contexto local revalidado no teste, sem copiar corpus para o checkout público.
- TypeScript, build de produção e auditoria da aplicação aprovados.
- Os 16 contratos congelados conferidos sem alteração de baseline.
- Privacidade: 448 arquivos públicos, incluindo novos não rastreados, zero achados; scanner existente: 435 rastreados, zero achados. Os 421 arquivos do workspace original conferem com seus hashes anteriores.
- Freeze: 391 entradas; Core local 1.1.0, procedimentos 1.0.0, packs Core/Only Human 0.2.0 com dependência exata e contratos anteriores 1.0.0. Extração: Python 3.13.3, pypdf 6.9.2, Unicode 15.1.0.
- Novos testes fictícios verificam alteração/remoção/inclusão de entradas e PDFs/código, falha em ranges incompletos e allowlist da matriz que não inclui texto da fonte.

## Reprodução

Requer Node/dependências do lockfile, o corpus e derivados privados originais, os três PDFs com hashes da política e Python/pypdf nas versões registradas em `pdfConcordance.toolchain` no manifesto. Os PDFs devem estar em `tmp/private/pdfs/{core,human,oddities}.pdf` deste checkout; não procurar arquivos por título como substituto de verificar o hash.

```powershell
$env:SOTDL_LOCAL_SOURCE_ROOT='C:/Users/vicen/Projects/sotdl-sdd-starter'
python tools/curation/review-pdf.py --source-root $env:SOTDL_LOCAL_SOURCE_ROOT --pdf-dir tmp/private/pdfs
node tools/curation/review-human-l0.mjs --check
node tools/curation/freeze.mjs --check
```

`--check` recompõe contextos, matriz e probabilidades; confere PDFs, entradas, implementação e o relatório privado; compara o manifesto completo. Falta de corpus/PDF não vira aprovação automática. Uma execução pública pode validar os testes fictícios, mas não reproduzir o aceite privado sem esses materiais.

Os hashes são dos bytes exatos do checkout, incluindo finais de linha. Para reproduzir em outro sistema, restaurar os bytes/finais de linha registrados; uma conversão CRLF/LF também invalida o freeze. Os 16 arquivos antigos devem manter os bytes LF do baseline anterior. Não atualizar o baseline para contornar diferenças.

`node tools/curation/review-human-l0.mjs --write` estabelece um novo snapshot após revisão explícita das mudanças. Não é reparo automático de um `--check` que falhou. Após modificar qualquer entrada congelada, conferir o diff, repetir o aceite pertinente e registrar a revisão antes de substituir o snapshot. O manifesto exclui a si mesmo para evitar referência circular; o hash do relatório detalhado o vincula à entrega.

## Preservação e publicação

Os PDFs foram apenas consultados e armazenados localmente. Links autenticados, transcrições, imagens e relatórios completos ficam em `tmp/private/`; corpus e pilotos continuam ignorados. A entrega pública contém somente os arquivos explícitos da #55 e metadados permitidos. A revisão de privacidade inclui arquivos novos não rastreados, além do scanner existente.

O workspace original das #50–#53 permanece separado. Publicação, PR, merge, deploy e fechamento administrativo da #55 não fazem parte desta entrega local. A #56 poderá implementar as projeções de exportação sob a política documentada, sem reutilizar contextos/catálogos como ficha exportável.
