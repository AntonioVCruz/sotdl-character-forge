# Fatia implementável — SPEC-001

## Esclarecimentos e escopo
Autorização: execução do PROMPT-INICIAL.md solicitada pelo usuário. Aplicam-se os defaults de uso pessoal, IndexedDB e fontes fictícias. Esta entrega é a fatia vertical de catálogo do MVP: importar → validar → persistir → habilitar → consultar origem/avisos. O teste vertical de personagem nível 0 permanece a próxima integração; esta entrega não declara o criador implementado.

- Canonizar `id`, `kind`, `sourceRef`, `sourcePage`, `variantKey`, `revision`, `diceExpr`, `ranges` e `outcomes`. As interfaces divergentes em arquitetura.md são sugestões, não schemas publicados.
- Defaults explícitos para fixtures antigas: página herdada da fonte, variante `default`, revisão igual à versão do pack, entidades sem status ficam `needs-review`. Tabelas mantêm status declarado, separado do caráter fictício da fonte.
- Pack estruturalmente inválido é rejeitado atomicamente. Tabela `incomplete`/`needs-review` pode ser consultada com diagnóstico de lacunas; overlap, ciclos e referências ausentes são rejeitados. Tabelas com lacunas não podem ser `curated`.
- Revisões do mesmo pack coexistem por ID+versão, com uma versão ativa por ruleset. IDs iguais em packs ativos diferentes são conflito; nomes iguais com IDs distintos coexistem. Importar não habilita.
- Nenhum conteúdo importado é executado. Mecânica permanece declarativa e não é calculada nesta fatia.

## Plano
1. Schemas Zod de fonte, manifesto, entidade, dados, ranges, outcomes e ruleset; normalizar fixtures sem perder extensões declarativas.
2. Validação sem efeitos colaterais de IDs, dependências exatas, referências, distribuição alcançável e ciclos; diagnóstico com fonte/página.
3. Registry isolado por ruleset e consulta de referências históricas indisponíveis, sem alterar eventos de personagem.
4. IndexedDB com snapshot atômico de packs e seleção. Importação validada antes da gravação; detectar substituição conflitante de ID+versão.
5. UI React: importar, carregar demonstrações, habilitar, filtrar, consultar fonte/variante/revisão/status e erros acessíveis.
6. Testes unitários/integrados e E2E de importação, persistência, conflitos e variantes; build TypeScript.

## Fronteiras de dependências
- SPEC-002: consumirá o Registry e consulta de referências históricas; eventos e ChoiceSlots não são criados nesta entrega.
- SPEC-008: recebe RandomTable validada; PRNG, rolagem e traces ficam nessa SPEC.
- SPEC-009: consome catálogo e elegibilidade da SPEC-002; locks, preview de geração e geração integral não são implementados aqui.
- SPEC-003: interpretará apenas efeitos tipados suportados. `curated` importado é declaração do curador, não validação automática de regra oficial.

## Perguntas reservadas à próxima fatia
Definir subconjunto real autorizado e seus slots, versão de PRNG e handlers mecânicos. Nada disso bloqueia o catálogo fictício; não inferir regras a partir dos nomes.
