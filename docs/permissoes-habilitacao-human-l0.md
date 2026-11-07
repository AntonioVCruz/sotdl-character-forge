# Permissões e habilitação consolidadas - atividade 5

Decisão local de 2026-11-06. Autoria da conferência: Codex; autoridade das escolhas de produto: usuário. Base: branch `codex/issue56-exports`, após o [aceite vertical](aceite-vertical-consolidado-human-l0.md). Sem commit, publicação, merge, deploy ou alteração de issues.

O usuário decidiu expressamente nesta atividade:

1. **JSON é backup privado reimportável. HTML/PDF são fichas mínimas para compartilhar após conferir os dados.**
2. **Preservar identificadores personalizados em HTML/PDF**, avisando que podem conter texto digitado pelo usuário e devem ser conferidos antes de compartilhar.

Esta é uma decisão de capacidade/destino do aplicativo, dentro da política do projeto. Não concede direitos sobre obras de terceiros, não promove fontes para `curated` e não autoriza publicar corpus ou catálogos.

## Conteúdo efetivamente emitido por formato

Conferência dos schemas e das funções em `character-export.ts`, `character-export-html.ts`, `CharacterExportPanel.tsx`, `procedure-model.ts` e `human-l0.ts`, comparada com os JSON/HTML reais gerados no aceite. Não se inferiu conteúdo apenas pelo nome do botão.

| Campo/classe | JSON privado | HTML/PDF compartilhável | Origem e condição |
| --- | --- | --- | --- |
| `contract`, `contractVersion`, `policy`, `contextSha256` | Incluídos | Versão/contexto necessários à referência; não incorpora o envelope de replay | Metadados próprios do formato e hashes |
| `sources[]`: packId, versão, sourceId, hash e dependências exatas; `sourceIds[]` | Incluídos | Referências mínimas e hashes | IDs/metadados permitidos, sem títulos ou textos de catálogos copiados |
| `sheet.name` | Incluído | Incluído | Texto informado pelo usuário; revisão e confirmação antes de emitir |
| `sheet.stats`, `states`, `moneyBits`, `dimensions` | Incluídos | Mesmos valores numéricos | Derivados da criação verificada; dimensões Core podem ser informadas pelo usuário |
| `sheet.inventory[]`: origem, itemId, quantidade, em uso; `loadout[]`: unidade e posição | Incluídos | Incluídos | Referências/valores do personagem; sem `sourceLabel`, nome ou descrição do item |
| `sheet.professions[]`: chave/id | Incluídos | Incluídos | Sem descrição ou especialização textual no resumo |
| `sheet.languages[]`: id/habilidades | Incluídos | Incluídos | ID pode conter texto de idioma personalizado; preservado por decisão expressa do usuário |
| `deferredUse[]`: chave/código; `optionalOmissions[]`: chave | Incluídos | Incluídos | Metadados próprios; não inclui a explicação licenciada do efeito |
| `replay.config`/`initialConfig`, seed, PRNG, escolhas/rolagens/eventos | Incluídos | Excluídos | Necessários para reabrir com as mesmas decisões; JSON é privado |
| `replay.character`: seleção, estados iniciais, eventos e pins | Incluído no fluxo Core | Excluído | Schema aninhado tipado; não inclui pack, mecânicas ou evidência completa |
| Autoria, motivo e nome de adjudicações; especializações e outros campos livres das decisões | Incluídos onde existirem no replay | Excluídos como texto livre; identificadores personalizados permanecem no resumo | Dados escritos pelo usuário, potencialmente pessoais; não tratar como catálogo redistribuível |
| Históricos de equipamento/Interesting Things, contexto de uso e recibo de finalização | Incluídos | Só a projeção de estado/uso necessária à leitura | Metadados e decisões, sem serialização do contexto real completo |
| PDFs dos livros, imagens, transcrições, excertos, regras, evidências extensas, pilotos, catálogos/contextos completos | Excluídos | Excluídos | Sem autorização de distribuição; não há campos livres genéricos de contexto/pack no envelope |
| Dados de compra, credenciais e links autenticados | Excluídos pela política | Excluídos pela política | Estrutura não tem campos dedicados; padrões conhecidos nos campos emitidos são bloqueados; revisão manual continua obrigatória |

O inventário de campos acima cobre estruturas discriminadas e seus campos opcionais, não só os valores presentes em um exemplo. `replay` possui schemas estritos, incluindo `HumanL0CharacterSchema`, eventos e configurações. Isso impede acrescentar campos como catálogo, evidência ou descrição ao envelope, mas não classifica a origem de todo texto que alguém digite em um campo livre.

## Conferência dos dados pessoais e limites dos filtros

A interface distingue o backup privado da ficha compartilhável. O consentimento é renovado quando o personagem muda e menciona dados pessoais do formato, identificadores personalizados e a proibição de copiar livros, links privados ou dados de compra nos campos livres. Nome, autor e motivo podem ser dados de pessoas reais; a confirmação do usuário não os transforma em dados públicos.

“Privado” é o destino de uso escolhido, não criptografia ou controle de acesso ao arquivo baixado: o JSON é legível. O aplicativo não publica nem envia esses arquivos automaticamente. Arquivos antigos com padrões agora bloqueados podem ser recusados na emissão/reimportação; a biblioteca, a string legada e o arquivo original permanecem preservados, sem remoção silenciosa de campos.

O novo guard `assertPermittedExportData` inspeciona strings e chaves já decodificadas do objeto efetivamente emitido:

- Bloqueia o padrão de marca/identificador de compra já reconhecido pelo scanner do repositório.
- Bloqueia URLs com usuário/senha ou parâmetros de autenticação/assinatura reconhecidos.
- JSON verifica o envelope inteiro. HTML/PDF verificam somente resumo e referências emitidas; um campo privado do replay não é incorporado nem usado como pretexto para expor seu conteúdo na ficha.
- A serialização JSON sempre reaplica o guard completo, mesmo se receber um envelope preparado para HTML. Nenhuma opção de formato permite contornar esse bloqueio.
- A operação falha com mensagem própria sem reproduzir o valor identificado. Não remove texto, altera decisões, recalcula rolagens nem modifica a biblioteca para fazer a emissão passar.

**Limite explícito:** esses padrões não detectam toda informação pessoal, todo segredo, toda forma de dado de compra, links ofuscados ou todos os textos copiados de livros. O schema exclui classes de dados e o usuário confere os campos livres; não existe certificação automática de autoria, licença ou ausência universal de conteúdo sensível. O JSON privado também respeita essas exclusões. Não tratar o scanner de arquivos Git como filtro suficiente para futuros exports.

## Destino dos demais artefatos

| Artefato | Destino permitido nesta decisão |
| --- | --- |
| Fontes licenciadas, PDFs e capturas de páginas | Consulta local privada; nunca Git ou ficha |
| Pilotos, evidências, relatórios detalhados e `compiled-real-runtime` | Diretórios ignorados locais; não são packs públicos nem arquivos de personagem |
| Biblioteca IndexedDB e strings legadas | Persistência local privada; sem envio automático e sem exclusão silenciosa na migração |
| JSON reimportável emitido | Backup privado do personagem; esta decisão não o classifica como arquivo para publicação/compartilhamento |
| HTML e PDF mínimos emitidos | Compartilhamento escolhido pelo usuário após conferir nome/IDs personalizados; sem engine editável, replay ou textos dos livros |
| Código, contratos, fixtures inventadas, documentação e metadados permitidos de revisão | Candidatos ao Git após revisão de privacidade e autorização futura de publicação; esta atividade não publica |
| Arquivos reais de QA em `output/` e relatórios brutos em `tmp/` | Ignorados e privados; não entram automaticamente na entrega pública por terem passado no teste |

## Decisão de capacidade e condições

Mantida a geração **local** de Humano L0, nas fontes Core/Only Human/Oddities e nas combinações/handlers declarados no escopo e no aceite. Mantidos prévia/confirmação, biblioteca e replay. Fica consolidado o uso do JSON privado e das fichas mínimas HTML/PDF nas condições acima; não há habilitação geral de exportação de packs ou de conteúdo oficial.

Cada emissão exige: fontes locais verificadas e disponíveis; contexto e dependências exatos; mecânica/material suportados; ausência de obrigações de criação pendentes; recibo de finalização recalculado; versão salva, sem prévia aberta nem conflito conhecido entre abas na interface; confirmação dos dados pessoais; e conteúdo permitido por formato. O endpoint é consultado novamente, sem cache. Falha preserva a biblioteca e o histórico.

Uma aba avisada de revisão mais recente deixa de oferecer emissão até recarregar a versão salva. Criar/importar um personagem separado não sobrescreve a revisão em conflito. A classificação de ficha compartilhável cobre os arquivos produzidos pelos controles mínimos desta seção; não autoriza compartilhar impressões/capturas arbitrárias da tela de criação que exibe textos das fontes.

Efeitos reservados ao uso podem permanecer como códigos/pendências de uso e não viram efeitos automaticamente implementados. Fonte ausente/alterada, conflito de equipamento, consequência obrigatória incompleta, suplemento sem handler e limites de execução continuam bloqueando conforme o contrato. Não há troca automática de fonte/versão, fallback fictício ou aprovação genérica de rascunho.

Os flags `exportEnabled: false` dos contextos/packs e `needs-review` das fontes permanecem intactos: eles se referem à exportação geral e à situação das fontes. A capacidade mínima tem gate próprio e destinos explícitos em `export-content-policy.ts`; não se libera conteúdo alterando esses flags. O freeze sucessor continua na atividade 6; esta decisão não certifica antecipadamente sua reprodução nem uma versão pública da entrega.

## Relação com o aceite e próximos registros

O aceite da atividade 4 é preservado como snapshot anterior. Esta atividade acrescenta um guard de conteúdo, impede emissão durante conflito conhecido e torna explícita a classificação dos formatos, sem mudar o schema JSON 1.0.0, valores permitidos da ficha, mecânicas, fontes ou dependências. A diferença deve entrar no snapshot sucessor.

Registro estruturado: [decisão de habilitação](../curation/reviews/human-l0-enablement-decision-2026-11-06.json), com as duas escolhas do usuário, condições, limitações, campos auditados e hashes de 11 arquivos de implementação/testes afetados após o aceite anterior. O registro declara classificação e limites; não é um mecanismo de licença nem um interruptor que substitua os gates do código.

Validação desta atividade:

- 639 testes aprovados e quatro ignorados na regressão completa; o novo guard possui casos públicos de strings/chaves aninhadas, padrões de compra, links com credenciais/assinatura e preservação de conteúdo não emitido.
- Caso real confirma que um marcador no replay privado impede JSON, não é incluído no HTML, e não modifica o save; marcador no nome impede também a ficha mínima.
- Após o gate de conflito e os avisos finais, dez testes públicos dirigidos e build/auditoria foram aprovados novamente.
- Cinco cenários finais de navegador aprovados, sem falhas ou casos instáveis: Core/procedimentos, bloqueio nos três formatos com mensagem sem o valor identificado e biblioteca/conflito entre abas. Os testes verificam que nenhum arquivo/iframe é produzido quando o conteúdo é recusado.
- Dois exemplos reais de JSON conferidos com oito campos de envelope e 12 campos de resumo; ausência estrutural de campos de livro/catálogo/evidência. A verificação de exemplos não certifica todo texto livre possível.
- Contratos antigos: 16 arquivos conferidos; privacidade dos arquivos públicos, incluindo novos, sem achados. Relatórios brutos e artefatos reais permanecem ignorados.

A habilitação local aceita continua condicionada ao escopo revisado e aos gates acima. Não há liberação de novos livros, handlers ou formatos amplos, nem promoção de `needs-review`.

Não há autorização de commit, publicação, merge, deploy ou fechamento das issues nesta atividade. As etapas 6–8 permanecem separadas.
