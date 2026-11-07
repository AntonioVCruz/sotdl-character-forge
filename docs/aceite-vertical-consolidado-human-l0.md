# Aceite vertical consolidado Human L0 - atividade 4

Execução local em 2026-11-06. Autoria e aceite técnico: Codex. Resultado: **aprovado para os cenários dirigidos do recorte local descrito abaixo**. Não é revisão independente, fechamento administrativo ou habilitação de todos os resultados dos livros.

Base: `2c5ef8924e643622132d1c2f6d07ce92009f2dff`, branch `codex/issue56-exports`, incluindo as alterações locais das #56 e atividades 1–3. [Escopo](escopo-fechamento-human-l0.md), [matriz original](matriz-aceite-fechamento-human-l0.md) e [correções](execucao-lacunas-human-l0.md) conservam a história das fases anteriores.

## Versão efetivamente aceita

O [registro estruturado](../curation/reviews/human-l0-vertical-acceptance-2026-11-06.json) enumera **309 arquivos públicos de aplicação, contratos, configuração e testes**, com seus hashes. Identificador agregado: `0f2bf79f8e8fbb47a71749e8830e99ae159163c449456dfad9d66be253e7064b`.

O agregado é SHA-256 da serialização JSON dos pares caminho/hash ordenados. Documentação, corpus privado, artefatos gerados e o próprio registro de aceite ficam fora desse agregado, explicitamente. Ele identifica os arquivos avaliados; não substitui o freeze sucessor da atividade 6.

Contextos reais aceitos:

| Contexto | SHA-256 |
| --- | --- |
| Core | `924ea29ca7176e4c8315e315c44e19527dce845621ea5678ac9ca8206f108784` |
| Procedimentos | `6bebc0a70ad9df00a331a306712e268343248bea683c7e6c7ff678908ca550ca` |

Artefatos reais `1.0.1`, contrato `sotdl.human-l0.runtime-artifacts@1.0.0`: reconstrução/check aprovados; 2.552 identidades indexadas. Fonte e dependências permanecem vinculadas aos dados privados verificados; conteúdo licenciado não está anexado a este registro público.

## Cenários e cobertura

| ID | Percurso | Evidência e resultado |
| --- | --- | --- |
| V01 | Seis combinações mecânicas × Core/Oddities × manual/híbrido/aleatório autorizado | 36 cenários em `tests/closure-coverage-source.test.ts`: geração/decisões, finalização, gravação/leitura IndexedDB, recomputação, exportação e importação; todos aprovados |
| V02 | Core simples e procedimentos: finalizar pela interface, revisar/salvar, exportar, importar como prévia, confirmar e emitir HTML/PDF | Dois cenários em `tests/e2e/character-export.spec.ts`; a emissão não começa com um save já finalizado pela interface. Valores de todos os atributos/características/estados renderizados são comparados com o JSON, além de dinheiro e referências |
| V03 | Geração pelas APIs locais reais, Background, armadura especial, arma adjudicada, posições/mãos, conflito, guardar, salvar/reabrir e Human Development separado | Dois percursos de geração em `tests/e2e/official-core.spec.ts` e `official-procedures.spec.ts`; aprovados sem mocks dos endpoints nesses dois percursos |
| V04 | Revisão/descarte, fonte alterada na confirmação, biblioteca, seleção persistida e duas abas concorrentes | Dois cenários em `tests/e2e/character-workspace.spec.ts`; foco e retorno ao controle conferidos, versão vencedora preservada |
| V05 | Finalizar/reabrir, consequência opcional nova, configuração alterada e save suspenso | Dois cenários em `tests/e2e/character-finalization.spec.ts`; invalidação e bloqueio com dados preservados |
| V06 | Fonte indisponível e ausência de fallback fictício | Dois casos de entrada nos testes de API/interface; geração continua bloqueada |
| V07 | JSON inválido, dependências/versões divergentes, handler sem suporte, limites, locks/rerolls e conflitos | Suíte pública e regressões reais de exportação, procedimentos, equipamento e consumo; repetição final de sete testes de exportação confirma também JSON malformado e dependência adulterada |
| V08 | Conteúdo longo e paginação | Fixture visual inventada com nome longo e 75 entradas de inventário; cinco páginas A4, todos os 75 IDs extraídos e nenhuma rolagem horizontal. Não representa personagem real aceito nem cenário de importação |

Os cenários V02–V06 somam os **dez testes de navegador** da configuração atual. V01 é uma matriz de motor/persistência, não 36 percursos de navegador. Nos modos automáticos de Human Development, faces físicas registradas selecionam um percurso infantil delimitado; o avanço posterior usa as etapas automáticas elegíveis e as decisões restantes são explícitas. A matriz não enumera todas as experiências, ciclos, resultados de Oddities, tamanhos ou efeitos contextuais possíveis.

## Invariantes verificados

- O histórico de eventos da criação é preservado na finalização e após o ciclo IndexedDB → recálculo → JSON → importação. Alterações em prévia não substituem o save antes da confirmação.
- Nos 36 casos, atributos/características, estados e dinheiro exato permanecem iguais após reabertura; o envelope reemitido é idêntico e as origens de inventário não são duplicadas. A observação do PRNG não detecta chamadas durante finalização, persistência, reabertura e emissão/importação.
- Equipar, conflito de mãos, substituição de armadura e guardar são conferidos no percurso real de equipamento e nas regressões de perfis/camadas. Concessões não se repetem por reabrir, e quantidades/uso por unidade conservam suas guardas.
- Configuração, variantes, dependentes travados, estados após experiências, pais/familiares, cardinalidades e ciclos possuem regressões dirigidas existentes reexecutadas nesta rodada completa. Um limite atingido mantém pendência/histórico, sem declarar sucesso.
- Arquivo adulterado/incompatível e contexto alterado não substituem o personagem IndexedDB. Strings legadas continuam preservadas; o teste de exportação confere também essa origem separadamente do save novo.
- Fonte ausente/alterada, escolha obrigatória sem resolução, handler ausente ou equipamento incompatível conserva diagnóstico/bloqueio. Efeito reservado ao uso permanece distinguível de obrigação de criação e não recebe aplicação automática.

## Execução e evidências

| Verificação | Resultado desta atividade |
| --- | --- |
| Suíte completa, dois workers | 637 aprovados, quatro ignorados, zero falhas |
| Negativos finais de exportação | Sete aprovados; repetição dirigida, sem somar à contagem total |
| Navegador, rodada consolidada | Dez aprovados, zero ignorados, zero falhas e zero casos instáveis |
| Emissão final após reforço da comparação HTML/JSON | Dois aprovados novamente, com finalização pela interface |
| TypeScript/build/auditoria da entrada oficial | Aprovados; auditoria sem demo/fixture no cliente |
| Compilação real imutável | `curation:validate:runtime` aprovado em 1.0.1 |
| Contratos antigos | 16 arquivos conferidos sem trocar baseline |
| Privacidade | Zero achados, incluindo arquivos novos não rastreados |

Ambiente medido: Windows, Node 22.15.0, TypeScript 5.9.3, Vitest 4.1.12, Playwright 1.56.1; PDF com Python 3.13.3, pypdf 6.9.2 e PDFium 5.14.0. O lockfile está incluído no identificador dos arquivos testados.

Relatórios brutos ficam ignorados em `tmp/acceptance-*.json`. O registro estruturado conserva seus hashes exatos, inclusive a codificação usada pelo PowerShell. Uma tentativa adicional de exportação começou enquanto a porta da rodada principal estava ocupada: executou zero testes e foi repetida depois de a rodada terminar. Isso não é contado como aprovação nem como teste instável; os relatórios aceitos têm zero erros.

## Paridade e inspeção dos PDFs

Core e procedimentos geraram duas páginas A4 cada; o teste longo gerou cinco. As **nove páginas** foram renderizadas e inspecionadas visualmente pelo Codex, sem cortes, sobreposição ou perda dos registros. A extração confere dinheiro, hash do contexto e referências de fonte das fichas reais; no caso longo, confere todos os 75 identificadores. Os valores renderizados no HTML são confrontados com o JSON antes da geração dos PDFs.

Arquivos reais e material de QA permanecem ignorados em `output/pdf/` e `output/html/issue56/`. Os hashes dos três PDFs estão no registro de aceite. Impressão testada em A4 com o Chromium do Playwright; outros navegadores, impressoras e preferências de impressão não foram certificados por esta execução.

## Reprodução e etapas seguintes

```powershell
$env:SOTDL_LOCAL_SOURCE_ROOT='C:/Users/vicen/Projects/sotdl-sdd-starter'
npx vitest run --maxWorkers=2
npm run build
npm run curation:validate:runtime
npm run test:e2e
```

Os testes reais precisam dos insumos licenciados/pilotos verificados; sem eles os casos correspondentes são omitidos ou os endpoints bloqueados, conforme o contrato. A geração de PDFs de QA requer Chromium e as ferramentas mencionadas para extração/renderização. A execução desta atividade usou servidor isolado na porta 4192; não exige publicar ou copiar o corpus.

Aceite técnico local restrito aos cenários descritos. A atividade 5 continua responsável por consolidar permissões/habilitação; a 6, pelo freeze sucessor; a 7, pela documentação e revisão final de fechamento. Fontes continuam `needs-review`, resultados não suportados conservam gates e a autorização de distribuição de livros não foi ampliada. Commits, publicação, merge e encerramento das issues continuam adiados.
