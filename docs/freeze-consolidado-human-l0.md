# Freeze consolidado de Human L0 — atividade 6

## Sucessor da preparação de encerramento — atividade 7

A entrega documental atual corresponde a `human-l0/1.0.1`, em `curation/freezes/human-l0/1.0.1.json`. Inclui a reavaliação final de 45 obrigações, guia de uso, resumos de encerramento e revisões técnica/UX Codex. O snapshot `1.0.0` abaixo permanece intacto, com SHA256 `f14e90f5b87055fe717ba7a9c84607f208c32667f81ed179ff6e23f3c6b2f836`. O manifesto sucessor fixa esse predecessor por hash e arquiva também os relatórios da atividade 7, mantendo os mesmos contextos e artefatos de runtime `1.0.1`.

Os três scripts npm de freeze agora apontam para o sucessor `1.0.1`. Para conferir uma reprodução histórica da atividade 6, use explicitamente `node tools/curation/consolidated-freeze.mjs --check-public --version 1.0.0` no inventário correspondente; o checkout atual contém diferenças documentais e recusará aquele check. Nunca execute a restauração histórica para desfazer alterações de conteúdo. [Revisão e limites atuais](fechamento-tecnico-human-l0.md).

O recibo atual fica em `tmp/private/consolidated-freeze/1.0.1/receipt.json`; os relatórios finais estão listados por hash no registro público da atividade 7 e copiados no diretório privado da versão. O check completo confere essas cópias e reconstrói o runtime; o público confere os arquivos públicos e o hash do predecessor. A restauração explícita também pode recuperar somente as quebras da serialização canônica do predecessor quando seu hash esperado corresponder, sem alterar seu conteúdo.

## Registro preservado da atividade 6

Snapshot local `human-l0/1.0.0`, preparado por Codex em 2026-11-06. Manifesto: `curation/freezes/human-l0/1.0.0.json`. Base Git: `2c5ef8924e643622132d1c2f6d07ce92009f2dff`. Inclui as alterações locais da #56 e das atividades 1–6; não pressupõe commit, publicação, merge ou encerramento de issues.

## O que fica preservado

O manifesto da #55, `curation/human-l0-review-freeze.json`, continua histórico e sem alterações. Seus hashes de implementação descrevem aquela revisão, não a entrega atual. O sucessor registra arquivos alterados, adicionados e removidos, com justificativa para exportação, prévia, biblioteca IndexedDB, dimensões, compilação real, aceite e política de destinos. Os 16 contratos em `curation/contracts.json` mantêm os hashes originais.

O novo inventário inclui todos os arquivos públicos rastreados e novos não ignorados pelo Git, incluindo código, dependências, políticas, contratos, documentos, testes e registros de cobertura/aceite. Exclui corpus privado, saídas temporárias, builds e `curation/freezes/`, cujas versões são baselines independentes. Cada versão deve ser verificada pelo seu comando e preservada junto de um recibo externo de SHA256. O manifesto não é uma assinatura digital.

Os relatórios históricos das atividades 4 e 5 são conferidos contra seus hashes antes da cópia para `tmp/private/consolidated-freeze/1.0.0/`. Os relatórios das duas suítes da atividade 6 também são arquivados. A verificação completa confere essas cópias; não depende de relatórios de trabalho que testes posteriores possam sobrescrever. A inspeção histórica de nove páginas de PDF permanece no registro da atividade 4. Os PDFs de trabalho são mutáveis e este freeze não os substitui por binários diferentes para satisfazer hashes antigos.

## Reprodução pública

Requer Node 22.15.0 e dependências do `package-lock.json` (`npm ci`). Ferramentas de teste e build ficam fixadas pelo lockfile. No checkout público, sem livros:

```powershell
npm run curation:freeze:human:public
Remove-Item Env:SOTDL_LOCAL_SOURCE_ROOT -ErrorAction SilentlyContinue
npm test -- --maxWorkers=2
npm run build
```

O primeiro comando exige bytes idênticos, inclusive finais de linha. O Git no Windows pode converter arquivos durante o checkout. Por decisão expressa do usuário, os arquivos atuais conservam LF, CRLF e sequências mistas; nenhuma normalização global altera os contextos ou saves existentes. Se apenas os finais de linha diferirem:

```powershell
npm run curation:freeze:human:restore-eol
npm run curation:freeze:human:public
```

A restauração é explícita. Para cada arquivo UTF8, compara o hash do conteúdo com finais de linha normalizados e restaura a sequência original LF/CRLF/CR, inclusive BOM e presença da última quebra. Recalcula o hash dos bytes antes de escrever. Arquivos binários, conteúdo diferente e arquivos adicionados/ausentes bloqueiam a operação. Todos os arquivos passam pela conferência antes da primeira escrita. Cada arquivo é conferido novamente imediatamente antes de gravar; se houver edição concorrente nessa etapa, a operação para e pode já ter restaurado arquivos anteriores. Não restaura corpus privado, PDFs ou fontes licenciadas. O manifesto só admite a restauração de quebras quando sua serialização canônica corresponde exatamente.

O comando público não confirma livros, fontes locais, relatórios privados nem os contextos em execução. Essa limitação é explicitada na saída. Arquivos alterados ou adicionais exigem revisão e nova versão, não atualização automática do baseline.

## Reprodução completa local

Além do checkout público, requer o corpus licenciado original e a pasta privada da revisão #55. Os caminhos abaixo descrevem esta sessão; em outra instalação, apontar para cópias autorizadas com os mesmos hashes:

```powershell
$env:SOTDL_LOCAL_SOURCE_ROOT='C:/Users/vicen/Projects/sotdl-sdd-starter'
$env:SOTDL_REVIEW_ROOT='C:/Users/vicen/Projects/sotdl-sdd-starter/output/html/issue55-work'
npm run curation:validate:runtime
npm run curation:freeze:human
```

Também devem existir os três artefatos locais imutáveis em `tmp/curation/compiled-real-runtime/1.0.1/` e as cópias privadas dos relatórios. Se os três artefatos não existirem, gerá-los com `npm run curation:compile:runtime`; o produtor não substitui versões existentes. A verificação reconstrói independentemente os contextos Core e procedimentos, recompila e compara bytes de bundle, índice e relatório, além das entradas históricas, três PDFs e matriz privada da #55. A concordância PDF é fixada por hash; não se declara uma nova revisão humana dos livros.

Pins atuais:

| Artefato | SHA256 |
| --- | --- |
| Contexto Core | `924ea29ca7176e4c8315e315c44e19527dce845621ea5678ac9ca8206f108784` |
| Contexto procedimentos | `6bebc0a70ad9df00a331a306712e268343248bea683c7e6c7ff678908ca550ca` |
| Bundle canônico | `84594b88405d5b45e821de58722428b81f494a51465ea49ae5a5e1a787731fef` |
| Índice canônico | `cfbe0619f052cd2aefd578b7be155aa792a6545339b077db87e2e84b6367c4f2` |

São 2.552 identidades indexadas, 22 tabelas Core, 74 de procedimentos, 360 planos de Interesting Things e 410 definições de itens. Não representa 410 perfis mecânicos completos nem todas as combinações possíveis. A mesma política permanece: fontes `needs-review`, `distributionApproved=false` e exportação global de packs/contextos desabilitada. JSON do personagem continua backup privado; HTML/PDF mínimos exigem revisão de nome e identificadores personalizados.

## Validação e manutenção

Os testes do freeze verificam sequências mistas, conteúdo modificado, binários, arquivos ausentes/adicionais, preflight sem escrita parcial por conteúdo incompatível, versões sem sobrescrita e recusa de caminhos externos/symlinks. A suíte pública é executada sem `SOTDL_LOCAL_SOURCE_ROOT`, separadamente da suíte real local. Build inclui tipagem e auditoria da entrada oficial. Os relatórios com tempos variáveis são evidências arquivadas, não saídas que devam reproduzir os mesmos bytes em nova execução.

A reprodução em cópia pública normalizada testa restauração explícita, igualdade final, ausência de corpus privado, adição de arquivo e alteração de conteúdo. O recibo e o resultado dessa sondagem ficam em `tmp/private/consolidated-freeze/1.0.0/receipt.json`; deve-se conservar essa pasta privada fora do Git junto do corpus autorizado. O comando `--check` não transforma o recibo em uma assinatura ou validação independente.

Nesta execução: suíte pública com 449 aprovados e 81 ignorados; suíte com corpus local com 646 aprovados e 4 ignorados; sete testes específicos do freeze incluídos em ambas. Tipagem, build e auditoria da entrada oficial passaram. Conferidos 16 contratos originais e 484 arquivos públicos, sem achados de dados de compra. Esses números descrevem este recorte e não a execução de todos os testes privados em um checkout sem corpus.

Para criar outro snapshot, concluir e validar suas alterações e executar explicitamente `node tools/curation/consolidated-freeze.mjs --write --version x.y.z` com uma versão nova. Uma versão existente é recusada; não há `--force`. A atividade 7 poderá alterar documentos e precisará de um sucessor antes da publicação. Atividades 7 e 8 continuam pendentes, e os commits continuam adiados.
