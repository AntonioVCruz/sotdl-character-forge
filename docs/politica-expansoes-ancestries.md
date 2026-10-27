# Expansões de ancestries e escolha de atributos

Decisões do usuário em 2026-10-27, registradas em `curation/pilot/creation-decisions.json`, seção `ancestryExpansions`.

## Comportamento definido

- Incorporar mecânicas de suplementos que expandam a ancestry selecionada, conforme as regras efetivamente publicadas: alternativas de atributos, opções de nível 4 e outros acréscimos/substituições aplicáveis.
- Usar as tabelas da expansão por padrão. Preservar as tabelas Core e oferecer ao jogador o procedimento Core como alternativa explícita.
- **Quando houver modos fixo e aleatório publicados, o jogador escolhe entre eles.** A preferência por tabelas suplementares não força atributos aleatórios. Não criar rolagem de atributos para uma ancestry que não a ofereça.
- Manter fontes, variantes, IDs, textos e versões separados. A composição do personagem referencia essas origens; não funde as entradas do catálogo.
- Aplicar substituições somente no escopo publicado. Não somar ganhos repetidos, conceder simultaneamente alternativas exclusivas ou escolher uma variante conflitante pela ordem de importação.
- Persistir o modo de atributos e o procedimento de tabelas escolhidos, com suas fontes e rolagens, para reproduzir a criação sem trocar de publicação silenciosamente.

Essa decisão autoriza a preferência pelas expansões de ancestry; não ativa indiscriminadamente regras opcionais ou regionais de todos os suplementos. Os contratos congelados de CUR-007 e seus registros históricos permanecem intactos. A política nova deve ser consumida pelas próximas etapas, sem reclassificar evidência não revisada como mecânica implementada.

## Human: Core + Only Human

Foram localizadas quatro faixas adicionais no MD de ancestries:

| Tema | Evidência |
|---|---|
| Identidade da expansão | [Human — Only Human](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13618) |
| Opções de atributos e características da variante | [Creating a Human (Variant)](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13626) |
| Nível 4 e texto do talento | [Level 4 Human Expert](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13719) |
| Procedimento de desenvolvimento | [Human Development Tables](../rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md#L13726) |

No modo fixo, os quatro atributos começam em 10 e um recebe +1. No modo aleatório de Only Human, cada atributo é **8+1d3**, com quatro rolagens independentes. O +1 do ramo fixo não é adicionado ao ramo aleatório. Não foi escolhido um modo padrão de atributos em nome do jogador.

As Human Development Tables podem ser usadas com ou sem a variante de atributos. Quando usadas, o texto exige o procedimento de desenvolvimento completo e os resultados rolados, substituindo a geração normal de profissões aleatórias e riqueza inicial. Portanto, o aplicativo não deve escolher uma tabela suplementar isolada e acrescentá-la ao procedimento Core como se fossem ganhos independentes. O procedimento Core continua disponível como alternativa. A generalização de escolha manual das tabelas Core não anula automaticamente uma instrução específica da expansão.

A variante Only Human também altera o bloco de Languages and Professions: Common Tongue, com outros ganhos pelas tabelas de desenvolvimento. O bloco Core concede sua própria alternativa de idioma/profissão. Esses blocos não são somados automaticamente; a variante selecionada determina o bloco aplicável.

No nível 4, Only Human inclui descobrir uma tradição entre suas alternativas. O ganho de Health +5 não é aplicado duas vezes por existir em ambas as publicações, e nenhum ganho de nível 4 entra no nível 0. Os textos de Determined também diferem: o Core permite escolher usar o novo número; Only Human manda usar o novo número. Essa diferença deve permanecer vinculada à variante escolhida, sem uma fusão pelo nome.

## Estado e próximos lotes

`ancestryExpansionScope` na matriz registra a preferência por Only Human, o procedimento Core alternativo, as opções de atributos e as diferenças que precisam de formalização. As linhas Core da matriz são a referência da base/alternativa, não uma alegação de que todo o procedimento expandido já foi formalizado.

A matriz agora contém **28 passos e 77 faixas de evidência**, de duas publicações, com os 27 trechos suplementares anteriormente fornecidos preservados. O modo expandido ainda não é um pack importável, nem está habilitado no gerador. **CUR-015 foi concluída** como formalização da base e dos modos de atributos de Human, conforme `docs/entrega-human-ancestry.md`. A tarefa seguinte é **CUR-016**; CUR-016/017/018/021 devem tratar o procedimento expandido e a alternativa Core. As opções de nível 4 pertencem a CUR-023. CUR-033/034/035 implementarão seleção, cálculo e geração.

Snapshot da revisão anterior em `curation/history/ancestry-expansion-policy-2026-10-27/`. Os quatro MDs, ledgers, IDs de publicação, contratos congelados, 230 bloqueios e 1.320 segmentos em quarentena permanecem intactos.

Validação aprovada: `npm run curation:check` (77 testes), `npm test` (151 testes) e `npm run build`. O cenário de expansão confere as duas publicações, preferência por tabelas suplementares, alternativa Core preservada, escolha fixa/aleatória exclusiva e independente, quatro rolagens 8+1d3 e ausência de acúmulo dos ganhos de nível 4/idiomas. A análise não implementa geração ou aplica esses ganhos ao demo.
