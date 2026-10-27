# CUR-020 — catálogo mínimo de itens do piloto

Entrega em 2026-10-27: catálogo de referência para **Human/Core + Only Human**, com **Oddities como padrão de Interesting Things e Core como alternativa**. Todos os ganhos de CUR-018 e resultados de CUR-019 possuem vínculo ou tratamento explícito. O consumidor demonstrativo continua separado; a integração real permanece nas etapas de motor, importação e inventário.

O [catálogo estruturado](../curation/pilot/items.json) contém **409 registros** e um ledger com **641 referências**. O [relatório reproduzível](../curation/reports/pilot-items.json) registra entradas, hashes e contagens. Há **28 blocos de regras e 710 faixas de evidência**.

| Registros do catálogo | Quantidade | Tratamento |
| --- | --- | --- |
| Definições publicadas de equipamento Core | 67 | Preço/unidade, disponibilidade e perfis quando declarados. |
| Tipos de ganho sem definição exata vinculada | 57 | Registros editáveis, com preço/perfil desconhecido e restrições explícitas. |
| Resultados especiais materiais ou mistos | 285 | Conjuntos de resultado com texto, alternativas e consequências preservadas; não são 285 perfis mecânicos completos. |

| Referências do ledger | Quantidade |
| --- | --- |
| Vínculo exato a definição Core | 182 |
| Escolha entre perfis publicados | 5 |
| Ganho genérico editável | 75 |
| Resultado especial preservado | 285 |
| Narrativa, relação ou referência textual fora do inventário | 75 |
| Moeda preservada em CUR-018 | 19 |
| **Total** | **641** |

São **281 folhas de ganhos iniciais**, incluindo todos os ramos de alternativas e moedas, mais **360 resultados de Interesting Things**. Identidades, caminhos de ramo, quantidade, unidade, valor declarado e fonte da concessão ficam no ledger. Um ganho de Only Human pode apontar a uma definição Core sem mudar sua origem. Não há correspondência aproximada por nome ou aplicação automática por texto editado.

## Preços, unidades e disponibilidade

Os preços usam a conversão exata de CUR-018, com strings inteiras de bits. `exact`, `minimum`, `variable` e `unknown` são estados distintos. Preço ausente não equivale a zero; valor patrimonial de Merchant ou de um objeto especial não vira preço de catálogo ou dinheiro disponível.

Lotes e unidades são preservados: cinco arrows custam 5 cp; cinco stones custam 5 cp; rations custam 1 cp por semana; rope custa 1 cp por coil de 20 yards. O preço do instrumento musical é mínimo, com definição posterior pelo GM. O preço de roupas genéricas varia; preços de roupas básicas, courtier e noble são os publicados para esses conjuntos específicos.

**Bit and bridle** tem preço de 1 cp pelo conjunto. Os ganhos separados de horse bit e bridle de Only Human não receberam metade desse preço. Também não se confundem com moeda. As disponibilidades são conservadas somente quando publicadas na linha aplicável; a tabela de munição, por exemplo, não fornece disponibilidade própria para cada entrada.

`quotePublishedLots` calcula apenas lotes inteiros com preço exato. Não executa compras, divide lotes, determina estoque ou aplica descontos. As regras de tamanho e materiais permanecem nos blocos publicados e exigem implementação posterior antes de um orçamento final de compra.

## Armas, armaduras e recursos

Os perfis de arma mantêm dados de dano, mãos, requisitos, propriedades, alcance, munição, alcance adicional e valor defensivo. As exigências de categoria também possuem evidência nos cabeçalhos das tabelas. O escudo concede seu valor defensivo quando empunhado; possuir o objeto não aplica esse bônus.

Armaduras usam **substituição de Defense**, com fórmula por Agility ou valor fixo. Soft leather está na categoria publicada de clothing, sem requisito de Strength, com Agility +1. Brigandine define Defense 13; mail define 15. Heavy armor impõe −2 Speed; não cumprir o requisito adiciona outro −2 e 1 bane em rolls de Strength e Agility. Banes específicos de natação permanecem separados para composição posterior. O bônus aditivo fictício do demo não foi utilizado.

Preservados os seis usos dos kits de cura e disfarce, a recuperação não especificada, as regras de luz de candle/lantern/torch, óleo, ferramentas, healing potion e Incantation de rank 0. A healing potion cura o Healing Rate no momento publicado de ativação; não foi convertida em bônus de Health. A Incantation permanece consumível e não ensina uma spell. Seus efeitos e demais regras estão no texto rastreável; os handlers reais continuam em CUR-027/034.

`previewArmorDefinition` e `previewWeaponDefinition` são avaliadores puros de referência de um perfil isolado. Não resolvem todo o combate, múltiplos objetos equipados, mãos disponíveis, carga, tamanho, materiais ou recursos. A integração e composição dessas regras não estão habilitadas nesta entrega.

## Ambiguidades e registros genéricos

As cinco referências que exigem escolha correspondem a **spear em duas concessões**, **shield**, **costume** e **dress**. O Core apresenta perfis diferentes para spear básico e militar; shield não especificado não seleciona automaticamente small ou large. Costume e dress possuem categorias de preço distintas.

Os 57 tipos de ganho sem definição exata vinculada ficam enumerados em `unresolvedDefinitions`, com restrições por registro. Incluem nomes genéricos, roupas de qualidade não especificada, pick de profissão, short sword, peças de arreio separadas, ferramentas não descritas no recorte Core, objetos escolhidos pelo GM, companheiros, direitos e propriedades. Isso indica ausência de vínculo exato **neste catálogo selecionado**, não uma afirmação de que nenhuma outra publicação os descreve.

Esses ganhos continuam autorizados como registros editáveis, conservando **Item fixo / Incantation de rank 0**, quantidade, tipo e origem. A edição dos detalhes pode ocorrer depois. Compra, perfil de combate e aplicação automática de efeitos permanecem restritos até resolver a definição. Companheiros, veículos, propriedades e direitos conservam `recordKind`; não são presumidos como objetos carregados ou armas.

Os 285 conjuntos de Interesting Things mantêm semântica própria em `interestingThingSemantics`: conteúdo, dados de criação/uso, recursos, escolhas e efeitos condicionais de CUR-019. Uma arma especial não herda estatísticas de uma arma comum por conter seu nome. A camisa de mail do Core conserva sua classificação especial e restrição de acumulação para adjudicação; não foi confundida com o perfil comum de mail.

Books and Scrolls 20 permanece **referência textual**, fora do inventário automático e sem bloquear seleção pela ausência de Dark Passages. Seu gancho futuro de geração aleatória de passagem/livro foi preservado, desabilitado, conforme decisão do usuário.

## Reprodução e validação

```powershell
npm run curation:pilot-items
node tools/curation/pilot-items.mjs --check
npm run curation:check
npm test
npm run build
```

[pilot-item-model.ts](../packages/curation/pilot-item-model.ts) valida definições, referências e preços. O [formalizador](../tools/curation/pilot-items-formalizer.ts) verifica os derivados anteriores antes de escrever. O modo `--check` compara os artefatos; o runner pode atualizar cache em `tmp/curation/`. Os quatro insumos e os contratos congelados permanecem preservados.

Foi otimizada a leitura de evidências de CUR-019: cada fonte é analisada uma vez por execução, em vez de uma vez por faixa. O cache não persiste entre execuções, preservando a detecção de alterações. Os metadados e hashes derivados de CUR-019 foram regenerados por essa mudança técnica; tabelas, textos, associações e a decisão sobre Books 20 não mudaram. Os 23 testes conjuntos de CUR-019/020 passaram em cerca de cinco segundos após a otimização, sem aumentar timeouts.

Dez cenários verificam cobertura exaustiva, lotes e precisão monetária, preços ausentes/mínimos, substituição de Defense, penalidades cumulativas, requisitos de armas, empunhadura, ambiguidades, recursos, narrativa, referências futuras, integridade e rejeição de adulteração antes de sobrescrever saídas.

Gates finais aprovados em 2026-10-27: **132 testes de curadoria em 19 arquivos**, **206 testes completos em 26 arquivos** e build TypeScript/Vite. Os testes foram repetidos em sequência após a otimização, sem aumentar timeouts. Insumos e os 16 arquivos congelados passaram pelos checks; a UI demonstrativa permaneceu igual, sem necessidade de E2E adicional.

Próxima tarefa: **CUR-021 — fechar as tabelas do piloto**, usando as ambiguidades e restrições explícitas deste catálogo. Packs oficiais, compra, efeitos automáticos e integração no runtime continuam desabilitados.

Atualização posterior: **CUR-021 concluída como auditoria com restrições**, em [fechamento das tabelas](entrega-fechamento-tabelas-piloto.md). O próximo passo do piloto pela ordem recomendada é **CUR-031/032**, preservando os estados manuais e bloqueados; CUR-022 permanece na trilha de progressão.
