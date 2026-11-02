# Projeção mecânica e validação Human L0

Entrega local de 2026-11-02, atividade 3 da próxima entrega na #7. O compilador agora projeta a base revisada de Core e Only Human no [contrato mecânico v1](contrato-mecanico-human-l0.md). Não executa os handlers do personagem.

## Executar

No ambiente com insumos licenciados e formalizações locais da revisão:

```powershell
npm run curation:compile:mechanical
npm run curation:validate:mechanical
```

Ambos usam `compile-packs.mjs --mechanical`. A saída padrão é `tmp/curation/compiled-human-l0-mechanics/`, ignorada pelo Git. Também aceitam `--output tmp/<diretorio>`; os caminhos de saída continuam restritos a `tmp/`, sem atravessar links simbólicos. `--check` confere os bytes de todos os artefatos esperados. Packs existentes são imutáveis: divergências exigem nova versão ou outro diretório; índices e relatório podem ser regenerados em `--write`.

A receita versionada `curation/human-l0-mechanical-compilation.json` seleciona `sotdl-core-human-l0@0.2.0` e `sotdl-only-human-l0@0.2.0`, com dependência exata da expansão no Core. `tools/curation/human-l0-mechanical-compiler.ts` reutiliza a projeção de metadados, anexa apenas campos mecânicos tipados e chama `parseHumanL0MechanicalPacks` explicitamente.

Os comandos antigos `curation:compile` e `curation:validate` continuam tratando a projeção de metadados `0.1.1`, em diretório separado. Os stubs públicos `0.1.0`, os 16 arquivos congelados e o consumidor demo permanecem intactos.

## Insumos e evidência

O adaptador local exige o ledger `human-l0-base-md-2026-11-02`, os insumos e os artefatos revisados. Confere os hashes completos registrados e os hashes das 15 faixas de evidência antes de projetar. Mudança de insumo, formalização ou implementação revisada invalida o gate; não atualiza o ledger automaticamente.

Os valores vêm de `curation/pilot/human-ancestry.json`, validado por `HumanBaseSpecSchema`. Profissões e identificador do idioma vêm de `professions-languages.json`; a política de Size vem de `creation-decisions.json`. As entidades selecionadas do staging precisam passar os gates existentes: fonte/identidade corretas, ausência de bloqueio/restrição e representação elegível.

A projeção separa declarações de cada publicação, regras gerais Core, heranças exatas por componente e decisão do produto. A expansão declara seu divisor de Healing Rate e herda arredondamento/mínimo do Core; estados iniciais não viram declarações do suplemento. Os metadados de evidência não contêm excertos, motivos textuais das fórmulas ou caminhos absolutos.

Os campos de página de cada faixa ficam nulos: a revisão registrou páginas na entrada, sem certificar paginação de cada subtrecho. Essa declaração de entrada continua no ledger; nenhum PDF foi inspecionado. `size.independence.fromBuild: false` conserva o formato v1 e indica ausência de derivação de Size a partir de Build.

## Artefatos e validação

São gerados dois `pack.json`, um `compendios/ancestry.index.json` com referências completas e `reports/human-l0-mechanics.json`. O relatório registra hashes e tamanhos dos insumos, revisão, contrato, hashes de saída e gates pendentes, sem dumps dos livros. Inclui os hashes da implementação do projetor e do contrato para rastrear a geração.

O validador recompõe a projeção a partir dos insumos aceitos e compara o inventário e os bytes de cada artefato, incluindo índice e relatório. Alterar um número ou evidência e recalcular hashes de saída não basta para passar. Os packs também atravessam o contrato mecânico, importação Core → expansão e roundtrip do catálogo, com ruleset vazio.

Hashes SHA256 desta execução:

| Artefato | SHA256 |
|---|---|
| Core `0.2.0` | `4fbc6b850fead58a8854609943521df35ff3884cb5454797904e0ba40c878f25` |
| Only Human `0.2.0` | `874baa2ea6dbbefd4461a5c6f24962e20fd0e69a0de2e32c52b33534387abb19` |
| Índice ancestry | `7a9a4eb457067851f3e3e43c7122a6ea8d0feb30b2f9c9e883ab89a2faf7dffd` |
| Relatório | `e9c386eda06da7e2a11c25406233dfe2447d62ca923d92832d774800260160e9` |
| Conjunto completo | `d331d6da26ae38f38e0d504bbfd19f86d7a0badbe4f065ffac9ab296331f3031` |

O conjunto anterior de metadados mantém `f9e3f7b4064c04f0a093aae8cbf55df0da1c30f132ea7ec14260c503ee2e10b1`. Os hashes acima descrevem a saída local e não certificam freeze ou autorização de publicação.

## Auditoria e limites

Revisão técnica realizada pelo Codex: projeção explícita de números/operadores/metadados; nenhuma cópia de `originalText`, `excerpt`, motivos, tabelas ou scripts. As saídas passam pela verificação de dados de compra. Os testes públicos usam fatos inventados, sem ler o corpus licenciado; IDs de fonte reais são usados somente para exercitar os gates de identidade, com saídas em memória. Isso não atribui parecer independente ao Curador ou titular.

Conforme a [política de distribuição](politica-distribuicao-conteudo.md), os packs mecânicos reais ficam **somente locais**. Conservam `fictionalData: false`, entidades/fontes `needs-review` e gates de distribuição, PDF, runtime e geração oficial desligados. O relatório não promove o staging inteiro nem elimina suas 11 pendências anteriores. O gate público de arquivos rastreados não foi relaxado e nenhum artefato mecânico oficial foi adicionado ao Git.

Validação executada: 354 testes completos em 41 arquivos, 78 testes direcionados dos compiladores/contratos, TypeScript, build, freeze de 16 arquivos e ambas as validações locais aprovados. Os 17 novos cenários verificam projeção, determinismo, fontes/bloqueios, fórmulas, heranças, inventário, adulteração de artefatos/proveniência, hashes desatualizados, JSON privado inválido e limites de caminho.

Permanecem fora desta entrega: resultados de tabelas e seus efeitos, equipamento, eventos/RNG, salvamento de escolhas de personagem, handlers do motor, autorização/distribuição, inspeção de PDF e freeze/habilitação oficial.

## Próxima atividade

- [x] Revisar o conteúdo-base Human L0.
- [x] Definir o contrato mecânico do pack.
- [x] Estender compilador e validação para a projeção local da base revisada.
- [x] Integrar os handlers da base ao motor e realizar o [aceite local de mudanças/salvamento/reabertura](entrega-motor-human-l0.md). Procedimentos completos e habilitação permanecem pendentes.
