# Roadmap da #34 — tabelas e equipamentos Human L0

Plano de 2026-11-02 para a [issue #34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34). **As oito atividades abaixo foram planejadas por este documento; a execução é registrada à parte.** A ordem define dependências técnicas, sem atribuir prazos, sprint ou responsáveis.

Atividade 1 registrada em [matriz-lacunas-issue34-atividade1.md](matriz-lacunas-issue34-atividade1.md). Atividades 2–8 continuam por executar.

## Objetivo e fronteiras

Transformar as formalizações locais necessárias ao Human L0 em tabelas, itens e efeitos tipados, compiláveis e consumíveis pelo motor, com proveniência e validação por lote. A #34 entrega dados, contratos e handlers; a #35 orquestra o procedimento completo; a #36 entrega a interface; a #37 conduz revisão final, freeze e habilitação. O encerramento da #7 não bloqueia esse trabalho.

A base Human L0 já possui contrato mecânico, projeção local `0.2.0`, cálculo em camadas e persistência. Não será reimplementada. O motor atual aceita ajustes manuais, mas isso não equivale a aplicar resultados publicados de tabelas ou perfis de equipamento.

## Ponto de partida

| Base existente | Reutilização prevista |
|---|---|
| [Inventário CUR-016](entrega-inventario-tabelas-criacao.md) e [fechamento CUR-021](entrega-fechamento-tabelas-piloto.md) | Identidades, faixas, probabilidades, ligações e restrições de contexto. A entrega documentou 74 identidades, 70 fluxos numéricos e cinco consultas sem rolagem; são universo de referência, não promessa de automatizar tudo. |
| [Profissões e idiomas CUR-017](entrega-profissoes-idiomas.md) | Direitos, concessões, trocas e distinção entre fala e alfabetização. |
| [Riqueza/equipamento CUR-018](entrega-riqueza-equipamento.md) e [Interesting Things CUR-019](entrega-interesting-things.md) | Ganhos, quantidades, alternativas, efeitos condicionais e escolha do procedimento de Interesting Things. |
| [Catálogo CUR-020](entrega-catalogo-itens-piloto.md) | A entrega documentou 409 registros e 641 referências, com vínculos exatos, ambiguidades e ganhos genéricos. Não representa 409 perfis mecânicos completos. |
| Contratos, compilador e [motor da base](entrega-motor-human-l0.md) | Dependências exatas, saída local, gates de proveniência, cálculo sem RNG implícito e saves preservados. |

Os seis artefatos correspondentes em `curation/pilot/` estão presentes no ambiente consultado. As contagens acima são dos registros de entrega; a atividade 1 verificará revisão, hashes e estado efetivamente consumível. Insumos/pilotos não serão importados diretamente como packs nem adicionados ao Git.

## Sequência e dependências

| Atividade | Entrega verificável | Depende de |
|---|---|---|
| **1. Auditar o recorte e as lacunas** | Matriz de seleção/proveniência/capacidades e lista de lacunas acionáveis. | Base existente. |
| **2. Definir o contrato consumível** | Schemas, referências, eventos/efeitos, gates e fixtures sintéticas. | 1. |
| **3. Projetar o lote de tabelas Core** | Dados Core tipados e revisão de resultados/probabilidades. | 2. |
| **4. Projetar Only Human e Oddities** | Dados da expansão, consultas e encadeamentos/contextos distintos. | 2; reutiliza os alvos Core necessários. |
| **5. Projetar kits, itens e equipamentos** | Catálogo selecionado, ganhos, perfis e restrições tipados. | 2; vínculos de concessão de 3/4. |
| **6. Estender compilador e validação** | Packs/índices/relatórios locais, determinismo e rejeição de adulteração. | 2 e ao menos um lote revisado de 3/4/5; aceite exige os três lotes selecionados. |
| **7. Integrar resolvedores e handlers** | Resolução de resultado, aplicação de consequências e composição de equipamento no motor. | 2 e primeiro lote validado por 6; aceite exige a cobertura selecionada de 3/4/5. |
| **8. Auditar o conjunto e entregar aos consumidores** | Aceite técnico da #34, cobertura, limitações e handoff para #35/#36/#37. | 3–7. |

Após 2, os lotes 3/4/5 podem avançar em paralelo, preservando referências exatas entre concessões e definições. O trabalho de 6/7 pode ser incremental por lote; nenhum lote não revisado fica habilitado para uso por esse motivo. O aceite final de 6/7 precisa cobrir todo o recorte aprovado em 1, com suas pendências explícitas.

## Atividades executáveis

### 1. Auditar o recorte e as lacunas

Conferir os hashes e dependências de CUR-016–021, as transcrições/correções aplicadas e os estados dos resultados. Enumerar o recorte Core/Only Human e as fontes aplicáveis de Interesting Things, preservando Oddities como padrão e Core como alternativa conforme as decisões existentes.

Entregar uma matriz por tabela/fluxo/resultado ou referência de ganho: ID, fonte/versão, evidência/hash, revisão, consumidores, tipos de consequência, definição de item vinculada, capacidade necessária e disposição. Classificar como selecionado para implementação, resolução manual explicitamente suportada, adiado fora do recorte ou bloqueado. Contabilizar os totais e justificar cada exclusão/pendência; não transformar uma lacuna em aprovação.

O resumo permitido pode ser versionado como metadados; matriz completa com texto/evidência permanece local. Registrar os caminhos e a revisão no relatório da atividade, sem nomes de compra ou excertos.

**Conclui quando:** todo registro necessário está selecionado ou tem disposição justificada; dependências externas, ambiguidades e handlers faltantes estão individualizados. Nenhuma consequência obrigatória desaparece por ter sido adiada. Ambiguidade de fonte/página exige conferência específica, inclusive PDF quando necessário, com inspeção realmente realizada identificada.

### 2. Definir o contrato consumível

Definir schemas estritos de tabelas/consultas, resultados, escolhas, quantidades, concessões, itens/perfis e efeitos. Preservar publicação/versão/entidade/resultado/componente nas referências; declarar pré-condições, sujeito do efeito, fase, frequência e origem da concessão. Distinguir efeito de criação, efeito ao usar/equipar e informação narrativa.

Formalizar consultas que reutilizam resultado anterior sem criar dado extra; colunas/fluxos independentes; caudas abertas; subtabelas; side rolls condicionais e limites de recursão. Especificar eventos e chaves de origem para impedir aplicação duplicada, sem orquestrar aqui todo o procedimento da #35. O handler da #34 recebe contexto/resultado e devolve efeitos ou pendências tipadas; a #35 decide a sequência de passos.

Definir a evolução dos packs e a estratégia de compatibilidade com a base: nova versão para conteúdo alterado; contrato novo ou evolução versionada explícita, sem editar silenciosamente os 16 arquivos congelados ou sobrescrever `0.2.0`. Declarar os campos que o gate genérico não valida e fornecer gate específico. Contrato técnico nesta etapa não é freeze/habilitação da #37.

**Conclui quando:** contrato executável, exemplos inteiramente fictícios, rejeições de entradas inválidas, semântica das pendências e formato de consumo estão documentados/testados; não existe campo executável livre ou regra inferida do nome de um item.

### 3. Projetar o lote de tabelas Core

Projetar as tabelas Core necessárias de ancestry/background/narrativa, profissões, riqueza e Interesting Things, com seus vínculos, alternativas e consequências. Preservar a facultatividade e os modos publicados como metadados de aplicabilidade para a #35. Separar fala, alfabetização, direitos de escolha e profissão efetivamente concedida.

Reutilizar os auditores/resolvedores de referência, conferindo cada dado, intervalo e peso selecionado. Tabelas de várias faces não viram sorteio uniforme de linhas; fluxos distintos não compartilham uma face apenas por aparecerem na mesma tabela. Ganhos materiais apontam a definições ou restrições do lote 5, sem copiar estatísticas por aproximação de nome.

**Conclui quando:** cobertura do lote Core e referências estão verificadas; testes exatos reproduzem os pesos; resultados numéricos, condicionais e narrativos são distintos e têm consequência ou pendência sustentada por evidência.

### 4. Projetar Only Human e Oddities

Projetar Human Development e os dados aplicáveis de Oddities, preservando fonte, identidade e substituições. As consultas por lifestyle reutilizam a determinação anterior. Modificadores autorizados e caudas abertas mantêm seu domínio; parentes e outros sujeitos não se confundem com o personagem.

Manter o seletor de Interesting Things vinculado ao procedimento escolhido, sem fallback oculto quando uma fonte estiver indisponível. Ciclos e ramos condicionais preservam resultados e limites, devolvendo pendência quando necessário. Menção textual a um dado não se torna automaticamente um comando de criação. Books and Scrolls 20 continua como referência textual com o gancho futuro desabilitado, conforme a decisão existente.

**Conclui quando:** fluxos/consultas, pesos compostos, referências entre fontes, sujeitos e ciclos estão testados; não há acumulação de blocos exclusivos Core/expansão, benefício familiar automático para o personagem ou rerrolagem inventada para escapar de um ramo sem suporte.

### 5. Projetar kits, itens e equipamentos

Selecionar as definições e os ganhos necessários dos lotes 3/4. Preservar todos os ramos, quantidades/unidades, moedas, categorias de registro e origem. Separar preço exato/mínimo/variável/desconhecido, valor patrimonial, lote publicado e moeda disponível; usar representação monetária exata.

Resolver somente vínculos sustentados por evidência. Ambiguidades permanecem escolhas explícitas. Ganhos genéricos editáveis autorizados continuam registráveis sem definição de combate/compra inventada; criaturas, relações, serviços e propriedades não viram itens carregados. Incantation não ensina automaticamente uma magia.

Projetar perfis de armadura/arma, requisitos e efeitos declarados: posse não é uso; Defense usa substituição quando publicada; penalidades, bônus condicionais e recursos conservam fase e condição. Identificar efeitos de uso/combate externos ao recorte para o handler diagnóstico, sem implementar todo o combate ou um sistema de compras nesta issue.

**Conclui quando:** toda referência material selecionada possui definição exata, escolha ou restrição explícita, e o ledger fecha com os ganhos; nenhum item recebe efeito por seu nome, preço desconhecido não vira zero e o genérico autorizado não bloqueia a criação apenas por faltar perfil específico.

### 6. Estender compilador e validação

Adicionar a projeção dos lotes revisados às ferramentas existentes, com receita de seleção, dependências exatas e versões coerentes com o contrato 2. Definir os paths no PR de implementação: código/contratos, receitas sem texto protegido e fixtures sintéticas podem ser públicos; packs reais, evidências extensas e relatórios completos ficam em destino local ignorado, sob `tmp/` ou diretórios permitidos pela política.

Gerar índices das categorias efetivamente emitidas e relatório de entradas/hashes, incluídos, adiados/bloqueados, capacidades e saídas. Validar inventário, identidade, revisão, proveniência, referências, intervalos, dependências e coerência das concessões; hashes refeitos não devem esconder projeção divergente dos insumos aceitos. Contextos recursivos autorizados são distintos de ciclos ilegais de dependência entre packs.

**Conclui quando:** duas compilações dos mesmos bytes são iguais; check detecta artefatos ausentes/adulterados e versões imutáveis; falha preserva saída válida anterior. Há testes públicos sintéticos e conferência local dos insumos reais, sem relaxar o gate de privacidade ou promover estados de revisão.

### 7. Integrar resolvedores e handlers

Consumir o contrato validado para resolver resultados/consultas e aplicar consequências tipadas: atributos/estados, idiomas/alfabetização, profissões/direitos, dinheiro, itens e recursos do recorte. Registrar sujeito, contexto, origem e identificador de concessão; aplicar uma vez, com replay determinístico e sem reinicializar estados depois.

Integrar o uso de equipamento publicado ao cálculo em camadas, separado dos ajustes manuais e da política fictícia do demo. Equipar/guardar, requisitos e conflitos devem recomputar os valores corretos e preservar inventário/histórico. Se a integração exigir mudança de save, definir versão/migração explícita e manter fixtures antigas.

A fronteira de sorteio, quando necessária ao resolvedor, deve ser explícita e registrar seed, versão, faces e vínculos. Cálculo, importação e impressão não sorteiam. Contexto ausente, alvo incorreto, fonte alterada, efeito sem handler ou limite de recursão devolvem diagnóstico tipado; não fabricam efeitos nem apagam a concessão. A execução sequencial do procedimento completo e a invalidação de seus passos pertencem à #35.

**Conclui quando:** fixtures conferidas exercitam cada handler selecionado, idempotência, sujeitos, limites e composição de equipamento; fontes/efeitos inválidos são recusados ou suspensos com motivo. Saves demo e a base Human existente continuam válidos, sem declarar o procedimento completo ou geração oficial.

### 8. Auditar o conjunto e entregar aos consumidores

Reconciliar a matriz de 1 com as saídas, handlers e testes de 3–7. Para cada registro selecionado, apontar fonte/revisão/evidência, contrato, versão de pack, resultado/item, handler/capacidade, teste e limitação. Uma resolução manual contratada deve ser preservada pelo consumidor como pendência/decisão explícita; não é suporte automático nem resultado descartável.

Executar regressões de probabilidades/quantidades, auditoria dos campos críticos, determinismo, referências cruzadas, uso de equipamento, estados, saves e diagnóstico. Publicar resumo de metadados com autoria, resultados, hashes, incluídos/adiados e limites; não expor o relatório completo ou insumos licenciados.

Entregar à **#35** a matriz de aplicabilidade/cardinalidades, APIs de resolução/efeitos e pendências; à **#36**, opções/restrições e perfis de ficha/inventário; à **#37**, evidências de revisão, cobertura e requisitos ainda necessários ao freeze/aceite vertical/habilitação.

**Conclui quando:** todos os critérios originais da #34 têm evidência vinculada, as pendências selecionadas são consumíveis sem perda de consequência e os adiamentos têm motivo/destino. O aceite é do catálogo/handlers desse recorte, sem afirmar conclusão da #35/#36/#37 ou automatização de todos os livros. Registrar a disposição final da issue conforme a cobertura comprovada.

## Mapeamento dos critérios de aceite da #34

| Critério da issue | Atividades que produzem evidência |
|---|---|
| Inventário por fonte/resultado e motivos | 1 e reconciliação em 8. |
| Schemas/handlers tipados e referências exatas | 2, lotes 3–5, integração 7. |
| Domínios, probabilidades, subtabelas e side rolls | 2–4, gates 6, resolvedores 7 e auditoria 8. |
| Ganhos por origem, sem duplicação ou RNG no recálculo | 2–5 e 7, conferidos em 8. |
| Equipar/guardar e camadas/conflitos | 5 e 7. |
| Compilação, versões, índices, relatório e rejeição | 6, com cobertura final em 8. |
| Fixtures públicas e aceite local com autoria | 2–8, respeitando os destinos em cada entrega. |
| Sem promoção artificial de bloqueios/revisão/fictionalData | Gate transversal de 1–8. |

## Forma de acompanhamento

Preferir entregas revisáveis por atividade ou lote, referenciando **#34 / atividade N**. Cada entrega registra artefatos, validação relevante, evidência permitida e lacunas remanescentes; não exige repetir toda a suíte para uma alteração documental. Contratos/handlers exigem regressões de comportamento; lotes exigem conferência de origem e probabilidades; compilação exige testes de determinismo/rejeição.

O checklist de execução permanece aberto:

- [x] 1. Auditar o recorte e as lacunas. Registro: [matriz](matriz-lacunas-issue34-atividade1.md).
- [ ] 2. Definir o contrato consumível.
- [ ] 3. Projetar o lote de tabelas Core.
- [ ] 4. Projetar Only Human e Oddities.
- [ ] 5. Projetar kits, itens e equipamentos.
- [ ] 6. Estender compilador e validação.
- [ ] 7. Integrar resolvedores e handlers.
- [ ] 8. Auditar o conjunto e entregar aos consumidores.

Próxima atividade executável: **2 — definir o contrato consumível**. A atividade 1 está registrada na matriz ligada acima. Este roadmap não altera código de runtime, artefatos reais, versões, estados de revisão ou flags de habilitação; não cria novas subissues nem executa as atividades 2–8.
