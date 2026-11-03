# Geração oficial local — Humano Core nível 0

Ativada por solicitação explícita do usuário em 2026-11-03. A entrada principal passa a usar **somente dados reais verificados**. O catálogo/demo e a prévia com fixture saem das rotas de produto, inclusive nos hashes antigos. Dados e componentes fictícios continuam somente em testes de regressão e registros históricos, sem fallback na aplicação.

## Abrir

```powershell
npm run dev
```

Abra a URL local indicada pelo Vite. Aguarde a conferência dos insumos, informe nome/seed, escolha o atributo aumentado e o benefício de humano. A alternativa Core de Interesting Things exige escolha explícita; não há substituição silenciosa do padrão Oddities. Clique em **Gerar com regras reais** e complete as escolhas apresentadas.

O recorte ativo é Humano do Livro Básico, nível 0. Only Human/Human Development, outras ancestralidades, caminhos, magias e progressão não foram habilitados por esta decisão. O build estático não contém os livros nem embute um catálogo substituto: sem o servidor local e os insumos verificados, a entrada permanece bloqueada.

## O que está ativo

- Base mecânica real `0.2.0`, com atributos fixos e escolha do aumento, tamanho e características derivados das fontes verificadas.
- Duas profissões iniciais e o benefício exclusivo de humano: profissão adicional aleatória ou fala de outro idioma. Especializações e escolha do idioma já falado para alfabetização ficam explícitas; leitura/escrita não são inferidas da fala.
- Riqueza Core com os pesos publicados, kits, alternativas, quantidades e moedas exatas. Quantidades em dados são registradas por origem. Patrimônio não vira dinheiro disponível; posse não aplica efeitos de equipamento.
- Seleção de Interesting Thing pelo roteador e tabela filha Core, ou escolha manual explícita, com alternativas/side rolls condicionais de criação registrados separadamente. Ganhos da origem ativa são aplicados sem duplicação; narrativa/relações e quantidades de conteúdo, recurso, dimensão ou capacidade ficam separadas. Dados e efeitos de uso não são executados na criação; conservam pendências específicas. [Aceite local da #51 e interpretação da armadura especial](entrega-interesting-things-issue51.md).
- Tabelas opcionais de idade, Build, aparência, personalidade e religião, quando escolhidas. Background tem seleção/sorteio facultativo próprio: estados, quantidades narrativas, idiomas, dinheiro e ganhos genéricos são aplicados por origem e substituídos ao trocar/remover o resultado. A opção de Build conserva uma pendência para dimensões, sem inferir mudanças mecânicas.
- Vestir/guardar armadura e empunhar/guardar arma com definição exata, quando já possuídas: substituição de Defense, penalidades de Speed e bônus defensivo declarado, respeitando a ordem do cálculo. Conflitos de substituição/múltiplas armas sem contexto suportado suspendem os números; requisitos e demais banes publicados são apresentados, sem implementar combate completo.

O gerador entrega um **rascunho com regras reais**, com `officialGenerationEnabled: true` no perfil local e `fullyResolved: false` na ficha. Não confunde gerar resultados oficiais com concluir/aplicar todas as consequências. A interface mostra pendências específicas e não oferece impressão/exportação de uma ficha declarada completa. Interesting Things distingue ganhos de criação resolvidos de adjudicações/efeitos de uso pendentes; não existe checkbox genérico que aprove consequências sem handler.

## Ativação e gates

Decisão versionável: `curation/official-local-policy.json`, autoridade `explicit-user-request`, escopo `human-core-l0`, uso local, dados reais obrigatórios, exportação desabilitada. Isso autoriza a execução local desse perfil; **não promove fontes `needs-review` a `curated`**, não certifica distribuição e não altera os 16 arquivos congelados.

O perfil ativo é um adaptador explícito de runtime, separado do catálogo/importador legado. Os artefatos de curadoria continuam `fictionalData: false`, `needs-review`, não importáveis; seus flags históricos não foram invertidos para simular um aceite. A revisão das fontes e o estado incompleto das consequências continuam visíveis.

Antes de responder ao navegador, o servidor executa a verificação da atividade 1, os seis geradores em check, a projeção Core real e a compilação mecânica validada. O catálogo de itens é conferido pelo mesmo hash de entrada da projeção, inclusive contra alteração durante a leitura. Ausência, divergência ou política inativa retorna indisponibilidade, sem dados fictícios.

O contexto inclui os pins dos insumos, conteúdo real e hash da implementação do gerador/base. O rascunho prende esse contexto e a versão do PRNG. Mudança de fonte ou implementação suspende a reabertura; não substitui versões silenciosamente. Faces ausentes/fora do dado ou seleção salva inconsistente são recusadas.

## Persistência e acesso

Chave local separada: `sotdl-official-core-draft@1`. Guarda configuração, referências, faces, escolhas e equipamento selecionado, sem textos de tabelas, evidências, estatísticas em cache ou catálogo. Reabrir/recalcular não sorteia. Uma escolha nova só registra as rolagens de seu ramo; dados de ramos anteriores não são reaplicados. Dados legados de demo/fixture permanecem preservados e não são usados pelo novo fluxo.

`/api/official/core` funciona somente por loopback com host/origem locais. Origem externa, host externo e acesso cross-site são recusados. O servidor não serve diretamente `rules/`, pilotos, relatórios, evidências ou `tmp/`. O endpoint não adiciona CORS nem cache do conteúdo licenciado. O build/preview estático não tem esse endpoint e permanece sem fontes, em vez de embutir livros.

O postbuild `tools/audit-official-entry.mjs` verifica os artefatos HTML/JS/JSON e bloqueia dados/IDs da demonstração e da fixture. A aplicação atual não importa esses JSONs. O preparador legado de standalone continua no prebuild apenas para a compatibilidade dos módulos históricos em testes; seu artefato não é incluído no build oficial. Não é uma ampliação de offline.

## Validação e trabalho restante

543 testes completos aprovados em 56 arquivos; 33 testes direcionados aprovados após os ajustes de persistência/faces/contexto; TypeScript, build, auditoria da entrada oficial e freeze aprovados. Dois E2Es verificam bloqueio sem fontes, ausência do botão de exemplos, geração real, reabertura sem rerrolagem e recusa de origem externa/acesso direto ao livro. Privacidade: zero achados em 383 arquivos rastreados/novos. A suíte E2E padrão passa a selecionar esses casos; specs antigos da demo ficam como histórico, não como critérios da nova entrada.

Os testes que exigem livros são pulados explicitamente em clones sem corpus, sem alegar conferência de fontes inexistentes. Fixtures continuam úteis para testar contratos/legado; não são fontes de geração.

Ainda faltam: automação dos efeitos de uso de Interesting Things, composição contextual completa de equipamento, procedimento amplo, estado de personagem finalizado, revisão semântica/distribuição e gates finais de exportação. Ganhos de criação de Interesting Things Core foram implementados localmente na #51, com pendências de uso preservadas. Background Core foi implementado localmente na #50; [entrega e limites](entrega-background-issue50.md). A ativação local solicitada foi executada; não encerra automaticamente #34/#35/#36/#37 nem declara todos os níveis/regras oficiais implementados. O trabalho está local, sem deploy ou publicação de dados reais.
