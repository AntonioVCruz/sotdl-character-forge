# Visão do produto / PRD inicial

## Público
Jogadores que querem criar e administrar personagens de SotDL e narradores que desejam habilitar fontes e regras opcionais por campanha.

## Jornadas
J1. Criar ficha nível 0, definir ancestry/variante, atributos, background, profissão e equipamento.
J2. Subir nível com novice (1), expert (3), master (7) e progressão aplicável até 10; tratar exceções/powerful ancestries.
J3. Selecionar tradições/magias, fazer escolhas sequenciais e substituições permitidas pelo ruleset.
J4. Equipar armas/armaduras e ativar efeitos, verificando os números e suas explicações.
J5. Alternar estado normal/transformado sem perder dados originais.
J6. Visualizar páginas da ficha; salvar/importar JSON; exportar HTML e imprimir/gerar PDF. Ao concluir o produto, o HTML exportado deve ser interativo e editável offline, como no exemplo.
J7. Habilitar/retirar conteúdos de livros e variantes sem corromper personagens existentes.

## Requisitos funcionais
- RF-001: importar packs versionados e informar origem de cada entrada.
- RF-002: oferecer catálogo filtrado pelo conjunto de fontes habilitado.
- RF-003: validar escolhas por nível, requisitos e regras opcionais.
- RF-004: histórico determinístico com editar/refazer escolhas de nível anteriores e avisar decisões dependentes.
- RF-005: calcular stats permanentes e temporários, com rastreabilidade e explicações.
- RF-006: registrar inventário, quantidades, equipamento vestido/empunhado e ativação.
- RF-007: magia com rank, tradição, opção de aprendizado/conjurações, recursos e escolhas sequenciais.
- RF-008: controlar efeitos/condições, duração e transformações; preservar estado base.
- RF-009: ficha dinâmica A4 em módulos reutilizáveis, inspirada na Liliana.
- RF-010: salvar/importar/exportar dados canônicos em JSON; exportar HTML e permitir PDF por impressão.
- RF-011: permitir house rules por campanha, nunca aplicadas implicitamente.
- RF-012: indicar quando registros de fontes estão faltando/indisponíveis sem apagar escolhas existentes.
- RF-013: gerar ao final uma ficha HTML independente, editável, com efeitos ativáveis e recálculo offline como a referência enviada.

## Não funcionais
NFR-001: responsivo em desktop e celular; no celular, criação e consulta primeiro, impressão A4 como modo distinto.
NFR-002: cálculo puramente determinístico, testável, sem efeitos colaterais.
NFR-003: funcionamento offline após instalação/carregamento dos packs disponíveis.
NFR-004: acessibilidade mínima: teclado, labels, foco visível, contraste.
NFR-005: migração de schema e preservação de versões antigas.
NFR-006: sanitizar conteúdo formatado e imagens importadas; não executar scripts de conteúdo.

## MVP estrito
- Criador 0–10 suportando níveis e slots corretos na estrutura, inicialmente com **um subconjunto revisado** de ancestries/paths/magias/equipamentos.
- Dois perfis de teste: um usuário marcial e outro mágico.
- Efeitos simples, equipamento, status e modificadores rastreáveis.
- Persistência JSON/local; ficha resumida dinâmica e visualização para impressão.

## Depois do MVP
- Todas as fontes curadas, spells com regras especiais, efeitos condicionais complexos, turn tracker, companions/summons, automação de rolagens de combate e sincronização.
- Exportação de ficha HTML autônoma e **editável**, incluindo efeito e estado, é etapa obrigatória para o produto final (SPEC-007), embora fique após o MVP técnico.
- 14 páginas da ficha de exemplo são **referência** de organização, não número obrigatório para todos os personagens.

## Métrica de sucesso
Um personagem salvo consegue ser aberto e recalculado sem regressões; usar ou remover uma fonte não altera silenciosamente escolhas; imprimir mostra os mesmos valores da tela; toda diferença numérica é explicável.

## Aditivo v0.2 — geração aleatória como requisito do MVP

### Jornadas adicionais
- **J8:** em **cada passo** do wizard, escolher manualmente, sortear usando o procedimento disponível, ver origem/dados e confirmar; poder rerrolar somente esse passo.
- **J9:** escolher ruleset, packs, nível-alvo (0–10 no MVP), filtros e locks; clicar **Gerar tudo aleatoriamente**; revisar escolhas e pendências em um preview; confirmar, editar ou cancelar sem alterar a ficha atual.
- **J10:** realizar geração híbrida: travar ancestry e path, aleatorizar atributos/antecedentes/profissões/tradições/spells/equipamentos apenas onde esses campos são elegíveis; manter as decisões bloqueadas.

### Requisitos funcionais novos
- **RF-014:** catálogo de tabelas aleatórias por fonte/edição/página/escopo, com dados/ranges e efeito mecânico rastreáveis, inclusive tabelas aninhadas/condicionais.
- **RF-015:** motor puro de rolagens; respeitar a distribuição de `NdM+K`, incluindo 3d6 não equiprovável por resultado, sem `Math.random()` na renderização; auditável e reproduzível.
- **RF-016:** opção manual/aleatória em **todos os ChoiceSlots**, e geração automática completa ou híbrida até nível-alvo por validação sequencial.
- **RF-017:** previews transacionais, trava de escolhas, rerrolagens localizadas, registro de seed/algoritmo/resultado; não alterar decisões aprovadas indevidamente.
- **RF-018:** quando uma tabela publicada não existir/estiver incompleta, indicar pendência. Se autorizado, sortear opções elegíveis sem tabela oficial com o rótulo apropriado; nunca misturar os dois mecanismos.

### Exigência para o MVP
**MVP agora inclui geração manual, híbrida e tudo aleatório** para o subconjunto de conteúdo curado. A expansão para todas as publicações é posterior, mas a arquitetura deve aceitar qualquer tabela documentada pelo usuário. O comando «Gerar tudo» pode retornar um rascunho com pendências explicitamente sinalizadas; jamais rotular esse rascunho como «completo» enquanto houver escolha obrigatória irresolvida.

### Requisitos não funcionais novos
- **NFR-007:** seed + ID estável de slot + contador de rerrolagem + versão de PRNG determinam resultados; snapshots persistem rolls e decisões.
- **NFR-008:** usar rolagem uniforme sem viés para faces; validar lacunas/sobreposições em ranges e limites de recursão/loops.
- **NFR-009:** geração integral sem UI deve compartilhar os mesmos validadores que a execução passo a passo, sem side effects.
- **NFR-010:** botão de acessibilidade «Sortear novamente» com histórico legível; informações sobre procedência e política de sorteio acessíveis por teclado/leitor de tela.
