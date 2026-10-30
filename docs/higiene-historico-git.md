# S0 — tratamento separado do histórico Git

Registro em 2026-10-30, separado da limpeza da ponta da issue #1. Acompanhamento: [issue #16](https://github.com/AntonioVCruz/sotdl-character-forge/issues/16).

## Estado e alcance

O commit inicial `5d2ca7e` introduziu os derivados de livros e linhas de compra inventariados em [higiene-pii-inventario-s0.md](higiene-pii-inventario-s0.md). Remover os caminhos do índice e corrigir os geradores evita novos arquivos indevidos na ponta, mas não elimina objetos anteriores, diffs de remoção, branches, tags, refs de PR, forks, clones, caches ou artefatos de CI.

O [ensaio isolado de 2026-10-30](ensaio-historico-git.md) passou na auditoria e recebeu aprovação explícita do dono. As 12 branches foram publicadas com histórico filtrado, a proteção foi restaurada e o workspace foi sincronizado, preservando 340 arquivos locais por hash. A limpeza dos objetos/reflogs locais antigos também foi autorizada especificamente e verificada. Ver [registro da publicação e pendências](publicacao-historico-git.md). A tarefa permanece aberta: refs internas/objetos do GitHub e backups privados ainda exigem tratamento separado.

## Plano de execução pelo responsável pelo repositório

1. Confirmar a lista de caminhos da política local em `tools/curation/privacy.mjs`, incluindo `curation/history/`, e os antigos literais de teste. Não publicar os valores sensíveis em comandos, logs ou issues.
2. Identificar todas as branches/tags que alcançam o commit inicial e cópias fora de Git (Actions, releases e backups). Registrar responsáveis e reter apenas eventual backup privado com acesso e prazo definidos.
3. Aprovar uma janela de manutenção e avisar colaboradores antes de reescrever refs. A escolha de ferramenta, retenção do backup e atualização forçada de refs exigem decisão explícita do dono.
4. Ensaiar a filtragem em clone espelho isolado. Remover integralmente os diretórios locais antigos e substituir os literais de compra nos blobs de testes; limpar só paths não cobre esses literais.
5. Validar todas as refs e objetos alcançáveis com detecção de dados de compra, sem imprimir matches. Conferir também ausência dos caminhos protegidos em todo o histórico filtrado. Rodar gate de privacidade, testes e build na ponta resultante.
6. Após aprovação do ensaio, publicar as refs reescritas e tratar refs de PR/caches com o GitHub conforme a capacidade do serviço. Acompanhar separadamente forks e cópias de terceiros, sem alegar exclusão que não foi verificada.
7. Orientar reclone dos colaboradores, impedir push de refs antigas e documentar o descarte dos backups e artefatos antigos autorizados.

## Critérios de fechamento da tarefa histórica

- Responsável, aprovação e janela registrados.
- Escopo de refs/artefatos, ferramenta e transformação registrados sem dados pessoais.
- Varredura pós-rewrite de todas as refs alcançáveis sem ocorrências; caminhos locais ausentes do histórico filtrado.
- Testes e build aprovados, colaboradores orientados e refs antigas bloqueadas contra reintrodução.
- Limitações externas, backups e caches com destino e responsável explícitos.

Até lá, limitar o acesso às cópias existentes e evitar distribuir o histórico antigo. Esta medida não elimina os dados já presentes.
