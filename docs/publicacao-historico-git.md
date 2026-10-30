# Publicação do histórico filtrado — #16

Em 2026-10-30, o dono aprovou explicitamente o plano após o [ensaio](ensaio-historico-git.md). A janela de manutenção foi a execução desta sessão. O plano privado aprovado tem SHA256 `0b442993b3e90e3a93652f626ef76222c95e9956a9966ea2c3e2a703e47e03db`.

## Executado e verificado

- As 12 branches existentes foram reescritas em um único push atômico, com leases para cada SHA antigo. Nenhuma tag existia; refs internas de PR não foram enviadas.
- `main` passou de `a884616b4eac9a87908a278d65c19dd85be5dc71` a `e8941317140ac577bb5763be90a54152be04362b`, incluindo scripts de auditoria, gate histórico em CI e documentação do ensaio.
- A permissão temporária de force-push foi desativada novamente. O snapshot completo da proteção foi comparado com o original e correspondeu; o check obrigatório `test and build` foi preservado. O push administrativo autorizado precedeu a execução desse check no novo SHA.
- Os cinco caches npm inventariados foram invalidados. Caches novos são regeneráveis e não fazem parte dessa lista antiga.
- Um clone novo do remoto passou na auditoria: 14 refs locais (incluindo aliases/tracking), 30 commits, 530 objetos, 379 blobs e zero caminhos protegidos ou objetos com padrões/valores conhecidos.
- O workspace adotou as refs e o índice limpos. Os 340 arquivos locais de `rules/` e diretórios ignorados de curadoria foram preservados com hashes idênticos. O status estava limpo após a migração; a auditoria das refs locais passou com os mesmos números do clone novo.
- Antes da publicação: 121 testes sem corpus local, três testes do auditor, build, privacidade da ponta e `git fsck` aprovados.
- A [CI remota no SHA publicado](https://github.com/AntonioVCruz/sotdl-character-forge/actions/runs/41102268993) foi concluída com sucesso, incluindo o novo gate histórico.

## Pendências que mantêm a issue aberta

1. Solicitar ao GitHub Support avaliação das 11 refs internas antigas de PR, visualizações em cache e coleta de objetos do servidor. A minuta privada foi preparada; nenhum chamado foi enviado. Não há ferramenta autenticada de Support disponível nesta sessão. O serviço decide a elegibilidade e o alcance do atendimento.
2. Concluir a limpeza de objetos e reflogs antigos no `.git` local. A troca das pastas de metadados foi recusada pelo sistema, então as refs e o índice foram migrados no lugar após cópia privada verificada dos metadados. A revisão automática rejeitou a expiração de reflogs e `git gc --prune=now`, exigindo aprovação específica por destruir objetos antigos. Esses objetos continuam locais, fora das refs auditadas; não se certifica expurgo local completo.
3. Revisar os backups privados em 2026-11-06, pelo responsável `AntonioVCruz`, após avaliar publicação e atendimento do Support. Descartar somente com autorização ou registrar novo prazo. Não há exclusão agendada.

`tmp/history-rewrite/` contém o espelho original, cópia verificada dos metadados locais antigos, mapas, snapshots, recibo e relatórios privados, com acesso restrito ao dono e SYSTEM. Os objetos antigos retidos no `.git` também têm acesso restrito. Não anexar os backups ou valores de substituição a chamados públicos.

O primeiro commit afetado foi `5d2ca7ea2a2652ef28a6d6bf93106ebc49969edf`; as refs internas antigas são dos PRs #8, #11, #12, #13, #14, #15, #17, #18, #19, #20 e #22. Não há LFS. Nenhum fork foi listado no inventário; isso não certifica ausência de clones, backups externos ou cópias já distribuídas.

Até finalizar, não reutilizar refs de clones antigos. Recuperar trabalho pendente por patches revisados sobre clones novos. A auditoria pública em CI detecta caminhos proibidos e padrões de compra; a checagem dos valores privados complementa a verificação de manutenção e não é publicada.

Referência: [remoção de dados sensíveis no GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
