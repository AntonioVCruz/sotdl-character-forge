import { z } from 'zod';
import { DiceExprSchema, registry, validatePack, type Snapshot, type RandomTable } from '../catalog';

export const PRNG_VERSION = 'mulberry32-fnv1a-v1' as const;
const stat = z.enum(['strength', 'agility', 'intellect', 'will', 'health', 'defense', 'speed']);
export const StatsSchema = z.object({ strength: z.number().finite(), agility: z.number().finite(), intellect: z.number().finite(), will: z.number().finite(), health: z.number().finite(), defense: z.number().finite(), speed: z.number().finite() }).strict();
export type Stats = z.infer<typeof StatsSchema>;
export const EffectSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('stat-add'), target: stat, value: z.number().int().min(-10000).max(10000) }).strict(),
  z.object({ type: z.literal('resource-add'), target: z.string().min(1).max(200), value: z.number().int().min(0).max(10000) }).strict(),
]);
export type Effect = z.infer<typeof EffectSchema>;
export const SourceRefSchema = z.object({
  entityId: z.string().min(1), packId: z.string().min(1), version: z.string().min(1), sourceRef: z.string().min(1), sourcePage: z.number().int().positive().nullable(), fictional: z.boolean(),
}).strict();
export type SourceRef = z.infer<typeof SourceRefSchema>;
export const RollSchema = z.object({
  id: z.string(), parentRollId: z.string().optional(), tableId: z.string(), ruleId: z.string().optional(), source: SourceRefSchema,
  diceExpr: DiceExprSchema, faces: z.array(z.number().int()).min(1).max(10), total: z.number().int(), outcomeId: z.string().optional(),
}).strict();
export type Roll = z.infer<typeof RollSchema>;
export const ResolutionSchema = z.object({
  key: z.string(), label: z.string(), sources: z.array(SourceRefSchema).min(1).max(100),
  effects: z.array(EffectSchema).max(100), unresolved: z.array(z.string()).max(100), rolls: z.array(RollSchema).max(100),
  quantities: z.record(z.string(), z.number().int()).default({}),
}).strict();
export type Resolution = z.infer<typeof ResolutionSchema>;
type Dice = z.infer<typeof DiceExprSchema>;
export type RandomStream = { uint32(): number; int(size: number): number };

export function createSubstream(seed: string, slotId: string, rerollIndex: number): RandomStream {
  let state = 2166136261;
  for (const char of JSON.stringify([PRNG_VERSION, seed, slotId, rerollIndex])) {
    state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  }
  const uint32 = () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return (t ^ (t >>> 14)) >>> 0;
  };
  return { uint32, int: size => uniformInt(uint32, size) };
}
export function uniformInt(next: () => number, size: number): number {
  if (!Number.isSafeInteger(size) || size < 1 || size > 0x100000000) throw new Error('Domínio de sorteio inválido.');
  const limit = Math.floor(0x100000000 / size) * size;
  for (let i = 0; i < 10000; i++) {
    const value = next();
    if (!Number.isInteger(value) || value < 0 || value >= 0x100000000) throw new Error('PRNG inválido.');
    if (value < limit) return value % size;
  }
  throw new Error('Limite de rejeição do PRNG excedido.');
}
export function rollDice(input: Dice, rng: RandomStream) {
  const diceExpr = DiceExprSchema.parse(input);
  const faces = Array.from({ length: diceExpr.count }, () => rng.int(diceExpr.sides) + 1);
  return { diceExpr, faces, total: faces.reduce((a, b) => a + b, diceExpr.modifier) };
}
export function sourceOf(entityId: string, catalog: Snapshot): SourceRef {
  const entry = registry(catalog).get(entityId);
  if (!entry) throw new Error(`Fonte desabilitada ou ausente: ${entityId}.`);
  return { entityId, packId: entry.pack.packId, version: entry.pack.version, sourceRef: entry.entity.sourceRef, sourcePage: entry.entity.sourcePage ?? null, fictional: entry.pack.fictionalData };
}
export function supportedEffects(input: unknown): { effects: Effect[]; unresolved: string[] } {
  if (input === undefined) return { effects: [], unresolved: [] };
  if (!Array.isArray(input)) return { effects: [], unresolved: ['Consequências sem formato suportado; revisão manual necessária.'] };
  const effects: Effect[] = [], unresolved: string[] = [];
  for (const raw of input) {
    const parsed = EffectSchema.safeParse(raw);
    if (parsed.success) effects.push(parsed.data);
    else unresolved.push('Consequência mecânica sem handler validado; revisão manual necessária.');
  }
  return { effects, unresolved };
}
export type TableContext = { slotKind?: string; ancestryId?: string };
function tableReader(catalog: Snapshot, context: TableContext) {
  const entries = registry(catalog);
  const checked = new Set<string>();
  return (id: string): RandomTable => {
    const entry = entries.get(id);
    if (!entry || entry.entity.kind !== 'randomTable') throw new Error(`Tabela indisponível: ${id}.`);
    const { entity, pack } = entry;
    if (!checked.has(pack.packId)) {
      const errors = validatePack(pack, catalog.packs).filter(d => d.severity === 'error');
      if (errors.length) throw new Error(errors.map(d => d.message).join('\n'));
      checked.add(pack.packId);
    }
    if (entity.status !== 'curated') throw new Error(`Tabela ${id} incompleta ou requer revisão.`);
    if (entity.conditions !== undefined) throw new Error(`Condições de ${id} ainda não suportadas; revisão manual necessária.`);
    if (entity.appliesTo !== undefined) {
      const scope = z.object({ slotKind: z.string().optional(), ancestryId: z.string().optional() }).strict().safeParse(entity.appliesTo);
      if (!scope.success) throw new Error(`Condições de aplicabilidade não suportadas: ${id}.`);
      if ((scope.data.slotKind && scope.data.slotKind !== context.slotKind) || (scope.data.ancestryId && scope.data.ancestryId !== context.ancestryId)) throw new Error(`Tabela não aplicável ao contexto: ${id}.`);
    }
    return entity;
  };
}
export type ManualOption = { key: string; label: string; path: string[]; quantities: Array<{ key: string; min: number; max: number; label: string }> };
export function tableOptions(catalog: Snapshot, tableId: string, context: TableContext = {}): ManualOption[] {
  const read = tableReader(catalog, context), result: ManualOption[] = [];
  let visits = 0;
  const visit = (id: string, path: string[], names: string[], quantities: ManualOption['quantities'], ancestors: string[]) => {
    if (++visits > 1000 || ancestors.length >= 32 || ancestors.includes(id)) throw new Error('Limite ou ciclo no encadeamento.');
    const table = read(id);
    for (const o of table.outcomes) {
      if (!table.ranges.some(r => r.outcomeId === o.id)) continue;
      const nextPath = [...path, o.id];
      const nextNames = [...names, o.text ?? o.id];
      const nextQuantities = [...quantities, ...(o.sideRolls ?? []).map(s => ({ key: `${id}/${o.id}/${s.id}`, min: s.diceExpr.count + s.diceExpr.modifier, max: s.diceExpr.count * s.diceExpr.sides + s.diceExpr.modifier, label: s.resourceKey }))];
      if (o.nextTableRef) visit(o.nextTableRef, nextPath, nextNames, nextQuantities, [...ancestors, id]);
      else result.push({ key: JSON.stringify(nextPath), path: nextPath, label: nextNames.join(' → '), quantities: nextQuantities });
    }
  };
  visit(tableId, [], [], [], []);
  return result;
}

/** Same consequences for manual and random choices; manual quantities never fabricate dice faces. */
export function resolveTable(catalog: Snapshot, tableId: string, command: { rng: RandomStream } | { path: string[]; quantities: Record<string, number> }, context: TableContext = {}): Resolution {
  const read = tableReader(catalog, context);
  const result: Resolution = { key: '', label: '', sources: [], effects: [], unresolved: [], rolls: [], quantities: {} };
  const path: string[] = [], labels: string[] = [];
  const visit = (id: string, ancestors: string[], parentRollId?: string) => {
    if (ancestors.length >= 32 || ancestors.includes(id) || result.rolls.length >= 100) throw new Error('Limite ou ciclo no encadeamento.');
    const table = read(id), source = sourceOf(id, catalog);
    result.sources.push(source);
    let outcomeId: string | undefined;
    let rollId: string | undefined;
    if ('rng' in command) {
      const rolled = rollDice(table.diceExpr, command.rng);
      const matches = table.ranges.filter(r => r.min <= rolled.total && rolled.total <= r.max);
      if (matches.length !== 1) throw new Error('Resultado sem range único.');
      outcomeId = matches[0].outcomeId;
      rollId = `roll-${result.rolls.length + 1}`;
      result.rolls.push({ id: rollId, parentRollId, tableId: id, source, ...rolled, outcomeId });
    } else outcomeId = command.path[path.length];
    const outcome = table.outcomes.find(o => o.id === outcomeId);
    if (!outcome || !table.ranges.some(r => r.outcomeId === outcomeId)) throw new Error('Escolha manual inválida para a tabela.');
    path.push(outcome.id); labels.push(outcome.text ?? outcome.id);
    const mechanical = supportedEffects(outcome.mechanicalEvents);
    result.effects.push(...mechanical.effects); result.unresolved.push(...mechanical.unresolved);
    // Unknown behavior is retained as a pending decision, never treated as an empty effect.
    const allowed = new Set(['id', 'text', 'nextTableRef', 'mechanicalEvents', 'sideRolls']);
    if (Object.keys(outcome).some(k => !allowed.has(k))) result.unresolved.push(`Outcome ${outcome.id} contém comportamento não suportado; revisão manual necessária.`);
    for (const side of outcome.sideRolls ?? []) {
      const key = `${id}/${outcome.id}/${side.id}`;
      let quantity: number;
      if ('rng' in command) {
        if (result.rolls.length >= 100) throw new Error('Limite de rolagens excedido.');
        const rolled = rollDice(side.diceExpr, command.rng); quantity = rolled.total;
        result.rolls.push({ id: `roll-${result.rolls.length + 1}`, parentRollId: rollId, tableId: id, ruleId: side.id, source, ...rolled });
      } else {
        quantity = command.quantities[key];
        const min = side.diceExpr.count + side.diceExpr.modifier, max = side.diceExpr.count * side.diceExpr.sides + side.diceExpr.modifier;
        if (!Number.isInteger(quantity) || quantity < min || quantity > max) {
          result.unresolved.push(`Informe a quantidade de ${side.resourceKey} (${min}–${max}).`); continue;
        }
      }
      const parsed = EffectSchema.safeParse({ type: 'resource-add', target: side.resourceKey, value: quantity });
      result.quantities[key] = quantity;
      if (side.application === 'quantity' && parsed.success) result.effects.push(parsed.data);
      else result.unresolved.push(`Aplicação secundária não suportada: ${side.application}.`);
    }
    if (outcome.nextTableRef) visit(outcome.nextTableRef, [...ancestors, id], rollId);
  };
  visit(tableId, []);
  if (!('rng' in command) && command.path.length !== path.length) throw new Error('Caminho manual contém etapas extras.');
  result.key = JSON.stringify(path); result.label = labels.join(' → ');
  return result;
}
