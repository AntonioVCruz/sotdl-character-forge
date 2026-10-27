# Arquitetura sugerida — ADR inicial

## Stack proposta
Vite + React + TypeScript (UI), TypeScript puro (domínio/rules engine), Zod/JSON Schema (validação), IndexedDB (persistência local), Vitest (unitário), Playwright (E2E + teste de impressão). Sem backend no MVP.

## Pacotes lógicos
```text
apps/web                         // wizard, character dashboard, sheet
packages/domain                  // tipos, entidades, event log
packages/catalog                 // catálogo, manifestos, fontes, validação
packages/rules-engine            // cálculo puro, precedência e explicação
packages/random-tables           // resolução de tabelas, DiceExpr, PRNG, rastreamento
packages/character-generator     // orquestração de ChoiceSlots, locks e auto-all
packages/sheet-renderer          // componentes imprimíveis e temas
packages/import-export           // JSON, HTML de visualização, impressão
content-packs/<source>/<version> // dados declarativos por publicação
specs/                           // spec, plan, tasks por feature
```

## Fluxo de computação
```text
Character JSON + Ruleset + Catalog Snapshot
  -> validar dependências e escolhas
  -> reconstruir estado de criação (ledger nível por nível)
  -> aplicar ancestry, paths, escolhas e benefícios permanentes
  -> coletar equipamentos em uso, condições e efeitos temporários
  -> resolver substituições de forma/atributos (regras explícitas)
  -> compor modificadores por alvo, fase, stack group e prioridade
  -> calcular características derivadas + limites aplicáveis
  -> produzir CharacterView {values, explanations, warnings}
  -> UI / HTML / PDF
```

## Regra contra acoplamento
A ficha **nunca** pergunta `if (spellName === "..." )`. Ela recebe um `CharacterView` calculado. O catálogo registra `effects` tipados; regras especiais não expressáveis entram como funções nomeadas e testadas do motor, não JS arbitrário importado.

## Interfaces sugeridas
```ts
type StatKey = 'strength'|'agility'|'intellect'|'will'|'health'|
  'defense'|'perception'|'speed'|'power'|'size'|'attack.boons'|'attack.damage';

type Modifier = {
  id: string; target: StatKey; operation: 'add'|'set'|'multiply'|'capMin'|'capMax';
  value: number; phase: 'base'|'progression'|'equipment'|'form'|'temporary'|'situational';
  stackGroup?: string; stackRule?: 'sum'|'highest'|'lowest'|'exclusive'|'replace';
  condition?: ConditionAst; sourceRef: string;
};

type CharacterView = {
  stats: Record<string, number | string>;
  breakdown: Record<string, Array<{ source: string; operation: string; value: number }>>;
  warnings: string[];
};

function calculateCharacter(character: Character, ruleset: Ruleset, registry: Registry): CharacterView;
```

## Registro de escolhas
`levelEvents[]` guarda `seq`, `level`, `type`, `choiceId`, `sourceRef`, `consumedSlot`, `replacesEventId?` e `rulesetId`. Reprocessar os eventos em ordem é necessário especialmente para magias selecionadas e substituídas no mesmo nível.

## Três situações distintas
1. **Estado permanente**: ancestry/path/progressão/item permanente.
2. **Estado de sessão**: equipamento, condição, efeito com duração, dano recebido.
3. **Contexto de uma ação**: ataque com arma específica, alvo marcado, circunstância, boons/banes situacionais. O último não deve modificar globalmente toda a ficha.

## Versionamento / licenciamento
Não distribuir packs de texto integral de livros comerciais sem autorização. Exportação de personagem precisa referenciar packs por ID e versão; na ausência do pack mostrar placeholder preservando IDs. Mudanças de schema passam por migrations testadas. Versões conflitantes são registros distintos, e errata aprovada tem precedência explícita.

## ADR-002: Aleatoriedade e escolhas não pertencem ao cálculo da ficha
```text
Ruleset + Packs + Character + Seed + GenerationPolicy + Locks
  -> EligibilityService (mesmo validador manual)
  -> ChoiceSlot queue (nível 0 → alvo; na ordem real dos ganhos)
  -> SelectionStrategy por slot:
       A) tableRoll se procedimento oficial validado
          -> RollEngine (DiceExpr; rolls independentes; nested table; outcomes)
       B) uniformEligible se não há tabela e a política o permite
       C) unresolved (sem dados/sem escolhas válidas/precisa de decisão do GM)
  -> aplicar evento provisório; atualizar slots e contexto
  -> revalidar downstream e executar roll children (quantias 1d6, etc.)
  -> GenerationDraft{events, traces, unresolved, conflicts, seed, prngVersion}
  -> PREVIEW / CONFIRM / CANCEL
  -> Character JSON + RollEvent log (só em CONFIRM)
  -> calculateCharacter (PURO: não rola dados)
```

**Princípios da implementação:**
- Um comando de rolagem explícito consome PRNG; `calculateCharacter`, seletores React, import e export nunca consomem. `generateEntireCharacter` opera em rascunho e nunca salva antes da confirmação.
- `packages/random-tables` oferece `rollDice`, `evaluateTable`, `resolveChain`, `createSubstream`; `packages/character-generator` oferece `generateSlot` e `generateCharacterToLevel` reutilizando `EligibilityService` / `ProgressionReducer`.
- O algoritmo preserva a **distribuição publicada**: `3d6` lança 3 dados; não escolhe uniformemente um inteiro 3–18. `d6 → d20` exige duas rolagens com registros separados.
- Filtrar personagens possíveis **antes do sorteio** só é válido na estratégia `uniformEligible`. Para `tableRoll`, preservar o procedimento da fonte (inclusive consequências não desejadas) e aplicar políticas explícitas caso a tabela produza algo impossível. Jamais transformar silenciosamente tabela oficial em sorteio filtrado.
- Substreams derivam de `seed + slotId + rollIndex + prngVersion`; locks respeitados. Ao mudar pré-requisito, invalidar descendentes afetados, sem mexer em escolhas independentes.
- Um `TableOutcome` com efeito mecânico produz eventos tipados (não executa JS do pack). Quando faltar handler, o resultado e a pendência são mantidos e não simulados.
- Toda tabela oficial exige página, status de curadoria, bounds completos ou `missing` explícito, registro de publicação; referências à fonte são preservadas em rolagens e resoluções.

### Interfaces sugeridas (contratos de domínio, não implementação)
```ts
type RandomMode = 'manual' | 'random';
type GenerationMode = 'manual' | 'hybrid' | 'all-random';
type SelectionStrategy = 'official-table' | 'uniform-eligible' | 'unresolved';
type DiceExpr = { count: number; sides: number; modifier?: number };
type TableRange = { min: number; max: number; resultId: string };
type RandomTable = {
  id: string; kind: 'randomTable'; sourceRef: string;
  sourcePage: number | null; dice: DiceExpr; resultRanges: TableRange[];
  conditions?: ConditionAst[]; status: 'curated'|'incomplete'|'needs-review';
  // Outcomes: escolhas, efeitos tipados, sub-rolls ou próximas tabelas.
};
type RandomTrace = {
  slotId: string; strategy: SelectionStrategy; seed: string; prngVersion: string;
  diceRolls: Array<{tableId: string; dieFaces: number[]; total: number; resultId: string}>;
  chosenEntityId?: string; sourceRef?: string; rerollIndex: number;
};
interface GenerateRequest {
  characterId: string; targetLevel: number; seed: string;
  rulesetId: string; mode: GenerationMode;
  perSlotModes: Record<string, RandomMode>;
  locks: string[]; allowUniformEligibleFallback: boolean;
}
interface GenerationDraft {
  events: CharacterEvent[]; traces: RandomTrace[];
  unresolved: Array<{slotId: string; reason: string}>;
  warnings: string[]; fullyResolved: boolean;
}
```
A tipagem final deve ser refinada pela SPEC-008/009. O catálogo deve oferecer **mecanismo** distinto da **estratégia de seleção**: sorteio entre opções válidas não equivale a uma tabela publicada.
