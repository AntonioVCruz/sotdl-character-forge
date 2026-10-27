# Contratos de curadoria 1.0.0

Escopo: Etapa A / CUR-007, parte da preparação do MVP. Os contratos tipados abaixo são a referência executável. Esta entrega congela formatos e valida exemplos; extratores de conteúdo, compilador e integração com o criador permanecem nas etapas B–E. Não houve alteração do schema de personagem ou do motor demonstrativo.

## Arquivos e schemas

| Artefato | Schema / implementação | Campos e invariantes |
|---|---|---|
| `curation/input-manifest.json` | `InputManifestSchema`, `tools/curation/inputs.mjs` | schemaVersion, reviewDate explícita, extractor(id/version/hash), files(path/bytes/lines/hash/revisionId/encoding/BOM/finais de linha/title). Hash é dos bytes; revisionId corresponde ao hash. |
| `curation/sources.json` | `SourceRegistrySchema`, `tools/curation/sources.mjs` | Manifesto de entrada e decisões de alias identificados por hash; fontes, referências e pendências contabilizadas. Edição desconhecida é null; páginas declaradas não são verificadas. |
| `curation/source-aliases.json` | `SourceAliasesSchema` | Rótulo, título canônico candidato, estado proposed/confirmed-in-md e motivo. Propostas nunca resolvem automaticamente. |
| `curation/source-policy.json` | `SourcePolicySchema` | Fonte-base, defaults opcionais/regionais desligados, relações direcionais, escopo, evidência, estado e responsável. Declaração MD não equivale a substituição mecânica aprovada. |
| `curation/entries/<source-id>/<kind>.jsonl` | `StagingEntrySchema` | Uma unidade por linha JSON, UTF-8, LF. Campos descritos abaixo; não é importável como pack. |
| Sidecar de revisão | `ReviewSchema`, `EvidenceSchema` | Eixos independentes e evidências tipadas, conforme `curadoria-evidencia.md`. |
| `content-packs/<source-id>/<version>/pack.json` | `PackSchema`, `parsePack`, `validatePack` de `packages/catalog/index.ts` | Uma fonte por pack. Raiz estrita; identidade e versão imutáveis; conteúdo real usa fictionalData=false. |
| `compendios/<categoria>.index.json` | `ThematicIndexSchema` | schemaVersion, categoria, entries(name/searchAliases/ref/kind/sourceId/variantKey/equivalenceGroupId). ref contém packId/version/entityId exatos; sem texto mecânico duplicado. |
| Sidecar de seleção do ruleset | `RulesetCurationSchema`, `validateRulesetRelations` | schemaVersion, rulesetId, packs exatos, selections por sujeito/variante/escopo, overrides por alvo/revisão/relação verificada. Não adicionar esses campos ao RulesetSchema atual. |

Todos os campos dos sidecars são obrigatórios, salvo indicação no schema. Ausência conhecida é `null` ou array vazio, não número/página inventada. Objetos são estritos e rejeitam propriedades desconhecidas. A forma dos registros de fontes é intencionalmente conservadora nesta versão: disponibilidade PDF, edição e proveniência confirmadas exigirão evolução explícita do contrato, antes de promoção de status.

## Staging

Cada linha guarda `schemaVersion`, `id`, `identity`, `name`, `kind`, `source`, `representation`, `originalText`, `normalizedText`, `normalizationDiffRef`, `printedPage`, `pdfPageDeclared`, `stage`, `scopeTags`, `region`, `searchAliases`, `equivalenceGroupIds`, `lineage`, `review`.

`identity` segue CUR-005; `id` deve corresponder exatamente à identidade. Uma fonte pendente deixa id/identity/sourceId nulos e stage=blocked, mantendo rótulo, motivo e evidência. Não atribuir uma identidade canônica só para passar no schema. O subjectId da revisão pode identificar provisoriamente a referência MD até a fonte ser resolvida; ao resolver, deve corresponder ao ID da entrada.

`full-text` preserva o texto da unidade inteira; o schema só garante sua presença, enquanto a revisão estrutural valida os limites. `reference-only` não contém texto copiado de outra publicação e permanece blocked. Mesmo com destino proposto na linhagem, requer curadoria adicional antes da compilação. Texto normalizado exige referência ao diff. `reviewed` exige transcrição, estrutura e mecânica conferidas separadamente; não equivale automaticamente a `curated` no catálogo. Não há campo genérico de automação executável ou AST mecânica provisória neste contrato: sua introdução exige schema tipado específico.

Marcas BASE/OPCIONAL/REGIONAL/EQUIPAMENTO/CRIATURA/DEPENDÊNCIA OMITIDA são preservadas; REGIONAL sem região identificada fica bloqueada. Nomes de diretório de fonte são os IDs registrados com cada segmento escapado para o filesystem (por exemplo `sotdl:only-human` → `sotdl%3Aonly-human` no Windows), sem renomear o sourceId dentro do JSON. Tipo é um dos nove kinds do catálogo. Ordenar saídas por ID e campos conforme o gerador; terminar cada JSON/JSONL com LF. Timestamps de execução não entram em bytes determinísticos.

## Packs e limites observados

Raiz: `packId`, `version`, `system=sotdl`, `fictionalData`, `source`, `dependencies`, `entities`; `legalNotice` é opcional. IDs têm 1–200 caracteres; versão é semântica conforme o regex do catálogo; no máximo 10.000 entidades por pack. Uma entidade deve ter sourceRef igual a source.id. Kinds: ancestry/path/spell/item/trait/condition/creature/rule/randomTable. sourcePage positiva ou null, variantKey e revision preservados. Sidecars não entram na raiz estrita. source/entidades aceitam propriedades extras no catálogo atual, mas isso não prova suporte pelo consumidor: campos novos de mecânica devem ter contrato e handler antes de uso.

Tabelas: diceExpr(count 1–10, sides 2–100, modifier -10.000–10.000), até 1.000 ranges/outcomes. Validar domínio, sobreposição, lacunas, outcomes e referências; encadeamento tem limite 32 no catálogo. Lacuna em tabela não curada gera aviso; nunca considerá-la pronta para geração oficial. O runtime demonstrativo só suporta os eventos tipados de `packages/random-tables`, não todas as regras reais. Resolution limita fontes/efeitos/pendências/rolls a 100 cada. Não dividir uma tabela entre packs sem referência/dependência exata e teste de resolução.

Sidecars: manifesto até 10.000 arquivos; registro até 10.000 fontes e 1.000.000 de referências/pendências; aliases de busca/linhagem/grupos até 100 por entrada; até seis marcas; índice até 100.000 entradas; sidecar de ruleset até 500 packs e 10.000 seleções/overrides. Não há limite de bytes/texto definido nesses schemas: implementar leitura incremental e limite de arquivo explícito antes da ingestão em massa, sem alegar proteção que ainda não existe. Arrays de evidência não possuem teto específico nesta revisão.

Índice `tradition` agrupa referências a spells/paths existentes; não cria um kind tradition inexistente no catálogo. O verificador do lote deverá resolver cada ref contra o pack exato, conferir fonte/variante e rejeitar ausências/ambiguidades. A fixture já executa esse gate. A generalização para lotes e a verificação de relações/escopos contra cada entidade pertencem à CUR-032; `validateRulesetRelations` hoje verifica a aprovação explícita da relação, sem aplicar substituições.

## Congelamento e migração

`curation/contracts.json` fixa a versão 1.0.0 e os hashes dos schemas e implementações relevantes. `tools/curation/freeze.mjs --check` detecta alterações. Não atualizar o baseline automaticamente durante a validação. Mudança incompatível exige novo schemaVersion, conversor explícito, fixtures antigas→novas, teste de referências históricas e relatório; manter os arquivos anteriores como histórico privado. Mudanças compatíveis também exigem nova contractVersion e revisão do congelamento. Reidentificação de fonte/edição requer mapeamento antigo→novo, sem trocar saves silenciosamente. Pack com conteúdo alterado exige nova versão, mesmo se o ID permanecer igual.

## Reprodução e gate

Execute `npm run curation:check`. Esse comando confere insumos, fontes, evidências de política, exemplos, congelamento e testes de curadoria. `--check` nunca regenera os arquivos. Os testes incluem parsePack/validatePack dos dois exemplos mínimos (real vazio e fictício com entidade), integridade das referências do índice e rejeição de raízes/estados inválidos. O exemplo real vazio testa o formato, sem alegar conteúdo curado; o fictício permanece needs-review e produz aviso esperado. Estão em `curation/examples/`, fora das pastas de packs utilizáveis e sem carregamento automático no aplicativo.

Regeneração deliberada de derivados, sempre seguida de revisão do diff e dos testes:

```powershell
node tools/curation/inputs.mjs --write --review-date 2026-10-26
node tools/curation/sources.mjs --write
node tools/curation/policy-evidence.mjs --write
node tools/curation/examples.mjs --write
node tools/curation/freeze.mjs --write --version 1.0.0 --review-date 2026-10-26
npm run curation:check
```

Datas/versões acima reproduzem a revisão inicial; uma revisão nova deve usar seus próprios identificadores e preservar o histórico aprovado. CUR-008 é o próximo trabalho: extrair ancestries para staging com limites e evidências completos, usando estes contratos. Nenhum extrator mecânico da Etapa B foi executado nesta entrega.
