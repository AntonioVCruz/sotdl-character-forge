# Ensaio de limpeza da #16

Registro em 2026-10-30. Responsável pelo repositório: `AntonioVCruz`. Preparação e verificação: Codex. **Publicação ainda não autorizada nem executada.** A [issue #16](https://github.com/AntonioVCruz/sotdl-character-forge/issues/16) permanece aberta.

## Inventário e resultado

O repositório é público. No inventário havia 12 branches, nenhuma tag, 11 refs internas de PR, nenhum fork listado e apenas o dono entre os colaboradores. São fotografias do serviço, não prova de ausência de clones ou cópias externas.

| Medida | Espelho original | Espelho filtrado, antes do commit deste registro |
|---|---:|---:|
| Refs auditadas | 23 | 23 |
| Commits alcançáveis | 29 | 29 |
| Objetos alcançáveis | 975 | 515 |
| Blobs examinados | 706 | 371 |
| Caminhos protegidos históricos | 336 | 0 |
| Objetos com padrões de compra ou valores conhecidos | 17 | 0 |

A árvore do `main` original (`a884616b4eac9a87908a278d65c19dd85be5dc71`) é idêntica à do `main` filtrado (`00b03bd9d1e96659816f877497f4c548d140604a`), antes da adição dos scripts, workflow e documentação deste ensaio. `git fsck --full --no-reflogs` passou. Os relatórios finais incluem também o commit de prevenção preparado sobre essa ponta.

Não havia artefatos de Actions nem releases. Foram examinados os ZIPs de logs dos 27 runs disponíveis, sem correspondências dos padrões conhecidos. Há cinco caches npm regeneráveis; sua invalidação consta do plano de publicação, ainda não aplicada. Isso não comprova ausência de outros dados sensíveis não cobertos pelos detectores.

## Transformação e prevenção

Foi usado `git-filter-repo==2.47.0` em um espelho independente, sem hardlinks, com `--sensitive-data-removal --no-fetch --invert-paths --replace-refs delete-no-add`. Foram removidos `rules/` e os oito diretórios locais de `tools/curation/privacy.mjs`; substituições privadas também limparam nomes, identificadores de compra e mensagens de commit. Os valores não são incluídos nesta documentação.

`tools/curation/history-audit.py` verifica todos os commits, paths e objetos alcançáveis pelas refs locais. Examina blobs, commits e tags; emite somente hashes, caminhos e contagens. A CI passa a buscar histórico completo e executar esse gate, além das verificações existentes e dos testes de regressão do auditor. O gate público reconhece padrões de compra e caminhos proibidos; a checagem dos valores privados é adicional no ensaio e na publicação. O gate de CI depende da publicação do histórico limpo.

## Plano concreto, pendente de aprovação

O plano privado está em `tmp/history-rewrite/publication-plan.json`. O executável `tools/curation/publish-history.py` usa esse arquivo e, por padrão, faz apenas preflight e push com `--dry-run`. Para aplicar exige `--apply --approval <SHA256 exato do plano>`.

1. Aprovar uma janela sem novos pushes; repetir inventário se qualquer ref ou proteção mudar. A ferramenta recusa divergências.
2. Preservar o espelho original privado e as configurações de proteção. Habilitar temporariamente force-push em `main`, mantendo os demais controles. Publicar as 12 branches em um push atômico com leases individuais; não usar `--mirror` nem enviar refs internas de PR.
3. Restaurar a proteção original em `finally`, inclusive se o push falhar; comparar novamente toda a configuração e os SHAs remotos. Se a restauração falhar, interromper e restaurar manualmente a partir do snapshot privado antes de retomar. Invalidar apenas os cinco caches inventariados.
4. Verificar novamente um clone remoto novo e os checks de CI. Não fechar a issue só porque o push foi aceito.
5. Pedir ao GitHub Support avaliação da remoção das refs de PR, visualizações em cache e objetos remanescentes. Há minuta privada com os metadados necessários. A disponibilidade dessa assistência depende dos critérios do serviço.
6. Migrar o workspace e orientar novos clones. Só depois registrar destinação dos backups e concluir a issue quando os resíduos e limitações estiverem documentados.

O primeiro commit afetado é `5d2ca7ea2a2652ef28a6d6bf93106ebc49969edf`. As refs internas afetadas são dos PRs #8, #11, #12, #13, #14, #15, #17, #18, #19, #20 e #22. Não há LFS no repositório. Essas refs são controladas pelo GitHub e não são eliminadas pelo push das branches. Ver [procedimento oficial do GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## Cópias privadas e migração local

`tmp/history-rewrite/` está ignorado e tem ACL restrita ao usuário atual e SYSTEM. Contém espelho original, substituições privadas, valores usados no detector, mapas de commits, relatórios e snapshots de proteção. **Não anexar esse diretório a issue/PR nem distribuí-lo.** O workspace original também conserva os objetos antigos em `.git`.

Proposta de retenção a aprovar: manter o backup somente até verificação da publicação e atendimento do Support, com revisão obrigatória em sete dias; então autorizar descarte ou registrar prazo adicional e responsável. Não há exclusão agendada ou já executada. Backups de sistema e clones externos exigem tratamento pelo respectivo responsável.

Na migração, primeiro criar um clone novo em diretório separado e verificar seus SHAs/auditoria. Preservar os arquivos locais ignorados de `rules/` e `curation/`, bem como alterações de trabalho. Não fazer checkout de branches antigas neste workspace. Após aprovação, validar os caminhos absolutos dentro do workspace, colocar os metadados `.git` antigos em quarentena privada e instalar os metadados do clone novo; conferir status e arquivos locais antes de liberar o uso. O espelho de recuperação continua privado até o descarte autorizado. Não fazer merge, pull com histórico antigo ou push de refs de um clone antigo; recuperar trabalho pendente por patches revisados.

Nada nesta preparação alterou a visibilidade do repositório, enviou mensagens a terceiros ou certificou remoção das cópias fora do controle do dono.
