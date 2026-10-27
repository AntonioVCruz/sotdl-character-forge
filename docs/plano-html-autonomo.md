# HTML autônomo - primeira fatia SPEC-007

Pedido autorizado: executar exportação offline do subconjunto fictício existente. Não acrescentar criação, progressão ou importação de packs ao arquivo exportado.

- Empacotar React, schemas, motor puro, comandos de sessão e CSS local em um único runtime IIFE; sem CDN, requests, fontes remotas, eval, servidor, IndexedDB ou dependência de localStorage no arquivo.
- Snapshot versionado com personagem, ruleset atual e packs fictícios ativos/referenciados, mantendo versões e fontes desabilitadas como tais. Recusar incorporação de packs não fictícios nesta primeira entrega. Dependências declaradas são incluídas sem habilitação implícita.
- Serialização segura de JSON/texto e CSP com hashes de script/style, rede e objetos bloqueados. Conteúdo do usuário/packs aparece como texto, nunca HTML executável.
- Leitura usa o mesmo cálculo. Editar nome/notas e executar comandos de sessão disponíveis; manter eventos/rolls originais. Aprendizado e progressão ficam no app principal.
- Salvar JSON compatível com o app e salvar uma nova cópia HTML atualizada, incorporando estado aprovado. Não prometer alterar automaticamente o arquivo original. Avisar sobre edições ainda não aplicadas e estado ainda não baixado.
- Reutilizar impressão A4 existente; incluir histórico completo de escolhas, rolls e sessão para consulta.
- E2E real file:// com navegador offline e bloqueio de requests, roundtrip HTML/JSON, efeito ativo/encerramento, fontes ausentes, strings maliciosas e impressão equivalente.

Limites: equipamento permanece conforme escolha confirmada nesta fatia; toggles genéricos de inventário, imagens, conteúdo oficial e múltiplos navegadores são posteriores. Medir tamanho do runtime/arquivo e registrar validações antes de concluir.
