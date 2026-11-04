# Matriz de criação Humano L0

Variante de ancestralidade, modo de atributos e procedimento são seleções independentes. Há seis combinações: Core com atributos fixos e Only Human com atributos fixos ou aleatórios, cada uma com procedimento Core ou Human Development. Atributos aleatórios Only Human usam quatro d3 independentes, acrescidos da base publicada. A transferência opcional de um ponto exige atributos distintos.

| Etapa | Core | Human Development | Dependências e cardinalidade |
|---|---|---|---|
| Idioma-base | Concessão da ancestralidade | Concessão da ancestralidade | Uma origem; habilidades adicionais conservam autoria |
| Benefício humano Core | Um idioma OU terceira profissão aleatória | Não acumula | Exclusivo da combinação ancestralidade Core + procedimento Core |
| Profissões | Duas escolhas manuais ou rolagens, mais benefício quando aplicável | Somente concessões dirigidas | Roteadores e dados de cada fonte preservados; profissão familiar não concede equipamento ao PC |
| Família e ancestrais | Fora do procedimento | Uma rolagem por tabela | Profissão familiar apenas nas categorias indicadas |
| Pais | Fora do procedimento | Uma rolagem de situação | Cada pai morto recebe uma causa independente, por decisão do usuário |
| Irmãos | Fora do procedimento | Contagem publicada; gênero, idade e Fate por irmão | Morte condicionada a Fate; detalhe adicional de familiar vivo é opcional e limitado |
| Idade, Build, aparência | Tabelas opcionais | Uma rolagem por tabela | Idade inicial determina 0–6 experiências; dimensões exigem medida-base e dados de Build |
| Infância | Fora do procedimento | Uma rolagem com modificador familiar | Sem truncar extremos; idioma, educação e profissão dirigidos pelo resultado |
| Experiências | Fora do procedimento | 0–6, em ordem | Evento anterior precede o seguinte; consequências de morte, trabalho e subeventos permanecem identificadas |
| Lifestyle | Uma rolagem de riqueza | Uma rolagem após experiências e modificadores | Cinco consultas compartilham o mesmo resultado, sem novas rolagens de Lifestyle |
| Equipamento | Kit de riqueza e concessões próprias | Kit de Lifestyle, profissões e eventos | Origens separadas; valor patrimonial não vira dinheiro; vestir/empunhar é explícito |
| Interesting Things | Um resultado inicial | Um inicial e extras concedidos por eventos | Fonte Core ou Oddities explícita; seletor ponderado + tabela; resultados extras não substituem o inicial |
| Personalidade e religião | Tabelas opcionais | Personalidade, relações, medos, desejos, obrigações, moralidade, religião e Piety | Piety pode encadear religião; limite conserva histórico e cria pendência |
| Background | Opcional, consequências da #50 | Substituído pelo desenvolvimento | Sem acumular blocos de procedimentos distintos |

## Interpretações aceitas e limites

- Aplicar Build às medidas-base, depois a escala etária. Experiências seguem a rolagem inicial de idade, mesmo quando eventos acrescentam anos.
- Causas de morte independentes para os dois pais.
- Only Human e Oddities podem ser ativados localmente com pendências explícitas. Isso não altera o status de curadoria das fontes nem habilita exportação.
- Tabelas obrigatórias de Human Development exigem dados publicados ou registro das faces físicas. Sorteio uniforme de escolhas do aplicativo exige consentimento e fica identificado no histórico.
- Limites locais: 300 etapas, 16 iterações de ciclo, profundidade 3 para familiares. O limite gera pendência; não troca a fonte nem apaga resultados.
- Suplementos externos selecionados sem handler, transformação de ancestralidade, decisões do mestre, perfis contextuais e conjuntos mistos permanecem explicitamente pendentes. Referência a outro livro não dispara geração de conteúdo desse livro.
- Reabertura exige hash do contexto completo. Configuração ou resultado alterado invalida decisões dependentes, inclusive bloqueadas, conservando o histórico. Bloqueio impede reroll da própria etapa.
