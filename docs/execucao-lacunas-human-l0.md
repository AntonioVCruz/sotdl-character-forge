# Execução das lacunas - atividade 3

Autoria: Codex, 2026-11-06. Trabalho local sobre `codex/issue56-exports`. Commits e publicação continuam adiados.

Decisões do usuário nesta atividade:

- Revisar um conjunto de alterações antes de confirmar a gravação; descarte restaura o estado salvo.
- Biblioteca com vários personagens em IndexedDB e aviso de conflito entre abas.
- Completar o registro de dimensões do gerador Core simples, mantendo a opção narrativa disponível.

| Lacuna | Trabalho | Estado |
| --- | --- | --- |
| F01 | Prévia em memória, confirmação com nova leitura das fontes, descarte sem gravação | Resolvido no recorte; confirmação inválida preserva prévia e save |
| F02 | Biblioteca IndexedDB separada do demo, migração preservando localStorage original, revisões atômicas e conflitos entre abas | Resolvido; testes de CAS e duas abas reais |
| F03 | Mostrar demais características/modificadores e Damage no fluxo de procedimentos | Resolvido; todos os campos calculados estão disponíveis na ficha |
| F04 | Ampliar percursos completos e cenários dirigidos de modos/fontes | 36 cruzamentos dirigidos aprovados, com finalização e replay JSON |
| F05 | Formalizar a compilação real e sua equivalência com os requisitos dos lotes | Resolvido pela rota real versionada descrita abaixo |
| F06 | Snapshot sucessor | Programado para atividade 6; não é adiamento de requisito |
| F07 | Teclado/foco, recuperação e conflitos na interface nova | Foco na revisão e retorno ao controle, navegação protegida e recuperação/conflitos exercitados; aceite UX consolidado continua na atividade 7 |
| F08 | Registrar medidas concretas no Core simples e conferir consequências opcionais | Resolvido; registro validado, finalização e JSON conferidos |

## Implementação e limites

`CharacterWorkspacePanel.tsx` e `useCharacterWorkspace.ts` separam estado salvo e prévia. Alterações em lote não gravam enquanto o usuário as revisa; confirmar busca novamente as fontes sem cache, recalcula o estado e grava por comparação atômica de revisão em IndexedDB. Descartar restaura o estado salvo. Troca de fluxo é bloqueada durante a prévia; o navegador recebe aviso de saída com alterações não salvas. O foco vai ao título da revisão e retorna ao controle que a iniciou após confirmar/descartar.

`packages/character-generator/character-library.ts` mantém a biblioteca oficial em banco separado do demo. Cada personagem tem ID e revisão de armazenamento próprios; o ID de replay do motor não é reutilizado como chave única da biblioteca. Uma revisão desatualizada não pode sobrescrever a atual, mesmo se o aviso entre abas não for recebido. A sinalização entre abas não carrega o personagem. A seleção é lembrada por aba, sem obrigar outra aba a mudar de personagem.

Saves antigos estruturalmente válidos são copiados uma vez para a biblioteca, preservando a string original em localStorage. JSON malformado continua preservado na origem. Migração de armazenamento não recalcula faces, não reescreve fonte/recibo e não certifica compatibilidade mecânica: contexto antigo permanece suspenso até revisão. Saves demo continuam em seu banco/formato anterior. Quota/acesso negado impedem a gravação e mantêm a prévia; não há fallback que aparente gravação bem-sucedida.

O Core simples agora aceita altura em polegadas, peso em libras e idade inteira, com conferência da descrição de idade/Build. O vínculo revisado de Core é `manual-dimension`: o novo comando registra medidas concretas do usuário e não transplanta fórmulas de Human Development nem muda Size por inferência de texto. Valores não positivos de altura/peso ou idade inválida são recusados; sem registro completo a pendência continua. O JSON/HTML/PDF usam essas medidas numéricas, sem exportar descrições dos livros.

## Rota de compilação real e equivalência (F05)

O compilador sintético `human-l0-consumable-compiler.ts` mantém seu escopo e sua fixture. Não foi usado para passar conteúdo real por um contrato fictício. O produtor novo `runtime-artifact-compiler.ts` compila os mesmos contextos reais que alimentam os endpoints e os handlers atuais, após os construtores verificarem o corpus local. A rota preserva os contratos Core consumível 1.1.0, procedimentos 1.0.0 e packs mecânicos 0.2.0.

Correspondência com os requisitos das atividades 6/7 da #34:

| Obrigação | Atendimento na rota real |
| --- | --- |
| Três lotes selecionados | Contextos Core e procedimentos contêm Core/Only Human/Oddities e os itens/programas efetivamente consumidos; os testes conferem 22 tabelas Core, 74 de procedimentos e 360 planos de Interesting Things |
| Índices e origem | 2.552 identidades qualificadas por contexto/tipo/ID para tabelas, resultados, itens, programas, planos, templates e consultas; sourceId, handler e limitação explícitos |
| Ponte entre consumidores | Tabelas Core comuns são confrontadas entre as duas rotas por identidade, dados, resultados e evidências; divergência é recusada |
| Versões/dependências | Packs são revalidados com dependências exatas; hashes canônicos dos contextos e dos packs, versões e entradas constam do relatório |
| Aplicação de consequências | Artefatos contêm os contextos tipados exatos dos handlers, não uma segunda interpretação dos dados; regressões reais dos handlers e 36 percursos verificam o consumo. Capability no índice indica o handler/limite, não prova todas as consequências de um livro |
| Determinismo e adulteração | Mesmos contextos/versão produzem mesmos bytes; validação compara com reconstrução independente; alteração/remoção de artefatos ou identidade duplicada falha |
| Persistência imutável | Publicador existente mantém os três arquivos em diretório completo por rename, exige inventário exato e recusa mudança de bytes, arquivos extras e links simbólicos |
| Política | `local-only`, `fictionalData: false`, fontes `needs-review`, distribuição/exportação de contexto desabilitadas; nenhuma mudança nos packs públicos ou licença inferida |

Saída ignorada: `tmp/curation/compiled-real-runtime/1.0.1/{bundle,index,report}.json`. Contrato do conjunto: `sotdl.human-l0.runtime-artifacts@1.0.0`; versão do conjunto: **1.0.1**. A versão local intermediária 1.0.0 foi preservada após ampliar a assinatura de contexto para os módulos compartilhados que executam/validam consequências (incluindo programas de equipamento, schemas mecânicos/itens e PRNG). A versão intermediária não representa outra publicação ou promoção de fonte.

```powershell
$env:SOTDL_LOCAL_SOURCE_ROOT='C:/Users/vicen/Projects/sotdl-sdd-starter'
npm run curation:compile:runtime
npm run curation:validate:runtime
```

Não é um pack importável no catálogo nem um arquivo de personagem. O bundle real contém dados licenciados e fica exclusivamente no diretório ignorado. O relatório de compilação não substitui o snapshot sucessor da atividade 6. Contexto de código alterado suspende saves antigos; não é reatado silenciosamente a uma nova implementação.

## Evidências e sequência

- Biblioteca: três testes públicos verificam múltiplos personagens/fluxos, gravações concorrentes com vencedor único, revisão e migração idempotente.
- Interface: testes públicos verificam prévia sem escrita, confirmação e preservação de save obsoleto; os testes de navegador exercitam descarte, contexto alterado, seleção persistida, segundo personagem e conflito entre abas.
- Cobertura real: 36 casos em `tests/closure-coverage-source.test.ts` representam as seis combinações, duas fontes e três modos. Human Development usa um percurso infantil delimitado por faces físicas registradas, seguido por avanço automático nos modos aplicáveis; escolhas restantes são resolvidas explicitamente. Cada caso finaliza e reabre o JSON. Isso não certifica todo possível resultado, ciclo ou conjunto contextual.
- Compilação e dimensões: `tests/runtime-artifacts-source.test.ts` confere determinismo, índices, gates, rejeição de divergência/adulteração e registro opcional completo com preservação de faces e replay.
- Regressão completa: **637 testes aprovados e quatro ignorados**, em 55 arquivos aprovados e um ignorado, com dois workers e os timeouts originais da suíte. Após os ajustes finais de restauração/gravação/bloqueio de URLs, oito testes públicos dirigidos e build/auditoria passaram novamente. Contagens de rodadas não são somadas.
- Os dez cenários atuais de navegador passaram em rodadas dirigidas: dois de finalização; quatro de arquivos/biblioteca na repetição final; quatro de entrada/API real na repetição com diretórios privados bloqueados. Os dois testes de API antes omitidos agora usam `SOTDL_LOCAL_SOURCE_ROOT` e rodam sem copiar o corpus para o checkout. Confirmar usa o mesmo limite de espera da conferência inicial das fontes (45 s), porque agora executa essa conferência completa, não apenas um mock.
- PDFs Core/procedimentos: duas páginas A4 cada; conteúdo e tamanho conferidos, páginas renderizadas e inspecionadas visualmente. Exemplos reais e screenshots continuam ignorados.
- `curation:validate:runtime` passou para a versão 1.0.1. Os 16 contratos antigos continuam conferindo; privacidade de arquivos rastreados e novos sem achados. Não houve regravação do freeze #55.

Registro estruturado da entrega: `curation/reviews/human-l0-closure-activity3-2026-11-06.json`. A documentação de execução da atividade 2 é histórica; a matriz não foi reclassificada retroativamente para parecer que as correções já existiam.

## Resultado

F01–F05, F07 e F08 têm tratamento implementado e evidências locais. A cobertura agora inclui M2/M3/M4 e todos os 36 cruzamentos dirigidos definidos, com os limites de cenários descritos acima. As versões e fontes permanecem separadas de direitos de distribuição; resultados sem handler continuam bloqueados. F06 não foi dispensada: pertence à atividade 6 e continua pendente nessa etapa. Nenhuma outra lacuna recebeu adiamento ou exclusão de escopo.

Os registros da atividade 2 são snapshots anteriores às correções; esta entrega os complementa, sem substituir suas observações históricas. Nenhum requisito foi retirado do escopo ou adiado por conveniência. F06 continua na atividade 6 conforme o plano original; o aceite vertical consolidado (4), a decisão de destinos (5) e o aceite/documentação finais (7) continuam sendo etapas próprias. Commit, publicação, merge e encerramento das issues permanecem adiados pelo usuário.
