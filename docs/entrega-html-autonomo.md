# Entrega - HTML autônomo editável offline

Registro da primeira entrega. Os controles de equipamento e o runtime `demo-offline-v2` foram acrescentados em [entrega-equipamento-demo.md](entrega-equipamento-demo.md); tamanhos e limites abaixo descrevem a etapa original.

Data: 2026-10-26. Primeira fatia da SPEC-007, limitada aos packs fictícios existentes. Plano anterior à implementação: `docs/plano-html-autonomo.md`.

## Resultado
O aplicativo exporta um único HTML com runtime, estilos, personagem, ruleset e packs fictícios necessários. O arquivo abre via `file://` sem servidor, CDN ou arquivos auxiliares e usa o mesmo motor, comandos de sessão, componentes de ficha e impressão A4 do aplicativo.

- Editar nome/notas com aplicação explícita e recálculo de leitura.
- Registrar conjurações, ativar/encerrar efeitos e descansar preservando usos e histórico.
- Salvar JSON compatível com o importador principal e baixar nova cópia HTML com o estado atualizado. O arquivo original não é escrito automaticamente.
- Consultar eventos completos de aprendizado/rolagens, ações de sessão e fontes/versionamento.
- Imprimir somente a ficha aplicada, usando o mesmo CharacterView e CSS A4; nenhum comando ou sorteio é executado ao abrir/renderizar/salvar/imprimir.
- Não depende de localStorage, IndexedDB ou acesso a serviços de rede. Mudanças não são persistidas até o usuário guardar uma cópia gerada.

## Contratos e segurança
Envelope `sotdl-standalone-sheet`, `formatVersion: 1`, runtime `demo-offline-v1`, personagem JSON v2 e catálogo v1. Schemas existentes validam dados na abertura; versões incompatíveis exibem erro textual.

O snapshot contém packs ativos e referências históricas disponíveis, com fechamento de dependências. Mantém o estado de habilitação original e nunca substitui uma versão ausente por outra. Packs instalados sem uso são omitidos. Esta primeira entrega rejeita incorporação de packs não fictícios; imagens/fontes remotas não são carregadas.

JSON é serializado escapando delimitadores HTML e separadores Unicode. Título é escapado e React renderiza conteúdo de usuário/packs como texto. CSP autoriza apenas os hashes SHA-256 do runtime e CSS embutidos, sem `unsafe-inline` ou `unsafe-eval`; bloqueia rede, objetos, imagens, fontes externas, base URI e formulários. Zod usa modo `jitless` antes da criação dos schemas para evitar sondagens de código gerado sob CSP. Expressões arbitrárias de packs nunca são executadas.

A gravação da nova cópia incorpora o estado corrente e recalcula os hashes, sem embutir recursivamente o arquivo anterior. Não há editor de regras, criação/progressão ou importação de packs no runtime offline. Equipamento continua conforme a escolha confirmada; toggles genéricos de inventário não estão implementados nesta fatia.

## Reimportação
Usar **Salvar personagem JSON** no HTML e **Importar personagem JSON** no app. Eventos, rolls, seed, locks, recursos, ações de sessão e campos narrativos são preservados. O catálogo principal continua sob controle do usuário; o JSON não importa/habilita packs automaticamente. Fonte ou versão indisponível gera os avisos e pendências já existentes na ficha, sem substituir conteúdo ou apagar histórico.

## Build e tamanho
- `tools/build-standalone.mjs` empacota o entrypoint `apps/standalone/main.tsx` em IIFE e CSS locais.
- `predev` e `prebuild` geram `apps/web/generated/standalone-runtime.json`, ignorado pelo Git. `npm run build:standalone` atualiza manualmente durante desenvolvimento.
- O aplicativo só carrega o asset do runtime ao exportar, para preservar o carregamento inicial. A cópia final HTML não carrega nenhum asset externo.
- Runtime medido: **698.762 bytes de JS e 6.454 bytes de CSS**. Artefato demonstrativo: **726.864 bytes**; cópia editada: **726.958 bytes**, aproximadamente 710 KiB. Medidas variam com dados e build. Limite de snapshot: 10 MB.

## Evidências
**65 testes unitários/integrados e 16 E2E Chromium aprovados**, build TypeScript/Vite aprovado. Os avisos anteriores de comentários de pureza do Zod permanecem sem impedir o build.

| Critério SPEC-007 | Evidência |
|---|---|
| AC-001 | Snapshot seguro com personagem/ruleset/packs e versões, validado na abertura |
| AC-002 (subconjunto) | Edição narrativa, conjuração, efeitos e descanso no arquivo; equipamento permanece confirmado |
| AC-003/007 | JSON e nova cópia HTML gerados offline, reabertura e reimportação idênticas; armazenamento do navegador bloqueado nos testes |
| AC-004 | Impressão A4 compartilha componente e valores; PDF offline verificado e suas três páginas inspecionadas |
| AC-005 | Testes de fechamento de tags, conteúdo malicioso, CSP sem violações e ausência de requisições HTTP(S) |
| AC-006 | Fonte desabilitada permanece indisponível no arquivo, impede conjuração e conserva histórico com aviso |
| AC-008 | Tamanhos medidos e cópia editada sem crescimento recursivo; fontes do sistema e nenhuma imagem incorporada |
| AC-009/010 | Eventos e rolls comparados antes/depois de exportar, editar, reabrir e reimportar; histórico consultável |

Testes: `tests/standalone.test.ts` e `tests/e2e/standalone.spec.ts`. Abertura real em uma instância independente de Chromium offline, via `file://`, com requests HTTP(S), localStorage e IndexedDB bloqueados. Verificam efeito ativo inicial, encerramento, nova conjuração, ativação, descanso, nome/notas, cópia HTML atualizada e JSON reimportado sem perda de histórico.

Os downloads de teste são escritos pelos seus bytes em arquivos locais comuns antes da navegação, evitando permissões herdadas da pasta temporária de downloads do Windows. Não é usado servidor para apresentar a ficha exportada.

Artefatos gerados (não versionados):
- `output/html/personagem-offline.html`: exemplo inicial com efeito ativo.
- `output/html/personagem-offline-atualizado.html`: nome/notas editados e efeito encerrado.
- `output/html/personagem-offline.json`: estado editado reimportável.
- `output/pdf/personagem-offline.pdf`: impressão A4 da cópia editada.
- `test-results/standalone-sheet.png`: captura desktop inspecionada.

## Limites
Validado no Chromium 141/Windows; outros navegadores ainda precisam de verificação. Não há retrato, conteúdo oficial, toggles genéricos de equipamento, edição de progressão/packs ou sincronização. O salvamento depende do usuário guardar o download; alertas de saída do navegador são auxiliares e não substituem isso. Exportar no app requer seu runtime gerado e Web Crypto no localhost; o HTML exportado funciona offline com Web Crypto em `file://` no navegador validado.
