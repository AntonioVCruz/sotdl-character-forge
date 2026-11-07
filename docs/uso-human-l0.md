# Usar Human L0 localmente

Guia consolidado em 2026-11-06. Requer Node 22.15.0 para reproduzir o ambiente medido e as dependências do lockfile. Os livros, transcrições e pilotos privados exigem cópias autorizadas e não acompanham o repositório. O build estático não substitui o servidor local.

## Preparar e abrir

```powershell
npm ci
# Em checkout separado: apontar para seu diretório licenciado verificado.
$env:SOTDL_LOCAL_SOURCE_ROOT='C:/caminho/para/corpus-autorizado'
npm run dev
```

Se fontes e implementação estiverem no mesmo checkout, a variável pode ser omitida. Abra a URL loopback mostrada pelo Vite e aguarde a conferência. Fonte ausente, alterada ou dependência incompatível mantém o gerador bloqueado, com diagnóstico. Não há fallback de demonstração.

## Criar e revisar

Escolha **Core** ou **Procedimentos Core / Only Human**. Os fluxos mantêm personagens separados. Informe nome/seed e configure o procedimento, atributos e fonte de Interesting Things. Oddities é o padrão declarado; a alternativa Core exige seleção explícita. Modos manual, híbrido e aleatório respeitam os comandos disponíveis, faces e consentimentos apresentados.

Gere o rascunho e resolva as escolhas indicadas. A ficha mostra a prévia do conjunto ainda não salvo. **Confirmar e salvar alterações** confere novamente as fontes e grava; **Descartar alterações** volta à versão salva. Um erro de confirmação mantém a prévia e o save. Trocar de fluxo fica indisponível durante a prévia; há aviso ao sair com alterações não salvas. No Core simples, se escolher as tabelas narrativas, informe as medidas concretas conferidas nos resultados: não se aplica a fórmula de Human Development nem se altera Size por inferência.

Posse e uso de equipamento são separados. Escolha as unidades, posições e adjudicações suportadas; conflitos de mãos, armadura ou perfil conservam diagnóstico. Efeitos reservados ao uso permanecem identificados e não são executados automaticamente como consequência de criação. Um resultado sem handler pode impedir a finalização; não existe confirmação genérica que aprove qualquer regra.

## Salvar, reabrir e conflitos

A biblioteca IndexedDB guarda vários personagens e mostra a revisão. A seleção é lembrada por aba. Saves legados em localStorage são migrados uma vez sem apagar a string original; personagens com contexto antigo permanecem suspensos, sem adaptação silenciosa aos novos hashes. O demo continua coberto pelos testes legados e não é rota de produto.

Se outra aba salvar uma revisão nova, a aba antiga avisa do conflito e bloqueia confirmação/emissão. Use **Descartar prévia e recarregar versão salva** para abrir a revisão mais recente. A transação de gravação também compara revisões; o aviso entre abas é uma sinalização adicional. Criar ou importar um personagem novo preserva os demais.

## Finalizar e obter os arquivos

Conclua as obrigações de criação e use a finalização explícita. Confirme e salve a mudança antes de emitir. Uma edição posterior pode invalidar a finalização. O painel **Arquivos da ficha** só oferece emissão para a versão finalizada e salva, sem prévia nem conflito conhecido. Confirme os dados pessoais para a versão atual; cada emissão revalida fontes/contexto e o recibo.

| Controle | Uso e conteúdo |
| --- | --- |
| **Baixar backup JSON privado** | Backup reimportável, legível e sem criptografia. Inclui seed, replay, histórico e campos livres, inclusive autoria/motivo de adjudicações. Guarde privadamente. |
| **Exportar HTML de leitura** | Ficha mínima que abre offline; sem motor editável, replay ou catálogo dos livros. |
| **Imprimir / Salvar PDF** | Ficha mínima por impressão A4. Use a opção de salvar em PDF do navegador. |

Antes de compartilhar HTML/PDF, confira nome e identificadores personalizados: um idioma personalizado pode conter texto digitado por você. Os filtros recusam padrões conhecidos de compra e links autenticados, sem apagar saves; não detectam todo segredo ou texto licenciado. Não copie livros, links privados ou dados de compra para campos livres. Imprimir/capturar a tela do editor, que pode exibir fontes, não equivale à ficha mínima autorizada.

Para reabrir um backup, use **Importar JSON de personagem** no fluxo correspondente. O arquivo deve ter as mesmas fontes, versões e contexto; o replay é conferido sem novos sorteios. A importação entra como personagem novo em prévia: revise e confirme. JSON inválido, adulterado, maior que 2 MB ou incompatível é recusado, preservando a biblioteca e o arquivo original.

## Verificar uma instalação

Sem livros, execute `npm test -- --maxWorkers=2` e `npm run build`; os casos privados não constituem aprovação nessa instalação. Para conferir os bytes da entrega, execute `npm run curation:freeze:human:public`. Só use a [restauração explícita de finais de linha](freeze-consolidado-human-l0.md) se o conteúdo corresponder ao manifesto; não atualize o baseline para esconder alterações.

Com o corpus autorizado, configure a variável acima e execute a suíte real. A verificação completa do freeze também exige a revisão privada #55, os artefatos compilados e os relatórios arquivados, conforme [reprodução completa](freeze-consolidado-human-l0.md). Para navegador/PDF, instale o Chromium do Playwright; a extração/renderização de QA depende das ferramentas registradas no aceite vertical. A impressão foi aceita em Chromium/A4, sem certificar todas as impressoras/navegadores.

O [fechamento técnico](fechamento-tecnico-human-l0.md) identifica o recorte aceito, os limites e o que ainda depende de publicação. Nível 1 e demais ancestralidades não são habilitados por este guia.
