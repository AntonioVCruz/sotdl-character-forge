import { z } from 'zod';

const id = z.string().min(1).max(200);
const version = z.string().regex(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/);
const page = z.number().int().positive().nullable();
const status = z.enum(['curated', 'needs-review', 'incomplete']);
export const DiceExprSchema = z.object({
  count: z.number().int().min(1).max(10), sides: z.number().int().min(2).max(100),
  modifier: z.number().int().min(-10000).max(10000).default(0),
}).strict();
const sourceSchema = z.object({
  id, title: z.string().min(1), sourcePage: page.default(null),
  status: z.enum(['fictional', 'authorized', 'needs-review']).default('needs-review'),
  edition: z.string().optional(), license: z.string().optional(),
}).passthrough();
const entityBase = z.object({
  id, name: z.string().min(1), sourceRef: id, sourcePage: page.optional(),
  variantKey: z.string().min(1).default('default'), revision: z.string().min(1).optional(),
  status: status.default('needs-review'),
});
const range = z.object({ min: z.number().int(), max: z.number().int(), outcomeId: id }).strict();
const outcome = z.object({
  id, text: z.string().optional(), nextTableRef: id.optional(),
  mechanicalEvents: z.array(z.record(z.string(), z.unknown())).optional(),
  sideRolls: z.array(z.object({
    id, diceExpr: DiceExprSchema, application: z.string().min(1), resourceKey: id,
  }).strict()).optional(),
}).passthrough();
export const RandomTableSchema = entityBase.extend({
  kind: z.literal('randomTable'), diceExpr: DiceExprSchema,
  ranges: z.array(range).max(1000), outcomes: z.array(outcome).max(1000),
}).passthrough();
const entitySchema = z.union([
  RandomTableSchema,
  entityBase.extend({ kind: z.enum(['ancestry', 'path', 'spell', 'item', 'trait', 'condition', 'creature', 'rule']) }).passthrough(),
]);
const packRef = z.object({ packId: id, version }).strict();
export const PackSchema = z.object({
  packId: id, version, system: z.literal('sotdl'),
  fictionalData: z.boolean().default(false), legalNotice: z.string().optional(),
  source: sourceSchema, dependencies: z.array(packRef).default([]),
  entities: z.array(entitySchema).max(10000),
}).strict();
export const RulesetSchema = z.object({ id, packs: z.array(packRef) }).strict();
export type Pack = z.infer<typeof PackSchema>;
export type Entity = Pack['entities'][number];
export type RandomTable = z.infer<typeof RandomTableSchema>;
export type Ruleset = z.infer<typeof RulesetSchema>;
export type Diagnostic = { severity: 'error' | 'warning'; message: string };
export type Snapshot = { schemaVersion: 1; packs: Pack[]; ruleset: Ruleset };
export const emptySnapshot = (): Snapshot => ({ schemaVersion: 1, packs: [], ruleset: { id: 'local', packs: [] } });
export const packKey = (p: { packId: string; version: string }) => `${p.packId}@${p.version}`;
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
};
export function parsePack(input: unknown): Pack {
  const pack = PackSchema.parse(input);
  pack.entities = pack.entities.map(e => ({ ...e, sourcePage: e.sourcePage === undefined ? pack.source.sourcePage : e.sourcePage, revision: e.revision ?? pack.version }));
  return pack;
}

/** Catalog validation never rolls dice and never interprets mechanical payloads. */
export function validatePack(pack: Pack, installed: Pack[] = []): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const report = (severity: Diagnostic['severity'], message: string, entity?: Entity) => diagnostics.push({ severity, message: `${packKey(pack)} · ${entity?.id ?? 'manifesto'} · ${pack.source.title}, p. ${entity?.sourcePage ?? pack.source.sourcePage ?? '?'}: ${message}` });
  const ids = new Set<string>();
  for (const e of pack.entities) {
    if (ids.has(e.id)) report('error', 'ID duplicado.', e);
    ids.add(e.id);
    if (e.sourceRef !== pack.source.id) report('error', 'sourceRef não corresponde à fonte do pack.', e);
    if (e.status !== 'curated') report('warning', 'Conteúdo requer revisão; automação indisponível.', e);
    if (!pack.fictionalData && e.status === 'curated' && (e.sourcePage == null || pack.source.status !== 'authorized')) report('error', 'Conteúdo curado não fictício exige página e fonte autorizada.', e);
  }
  if (pack.fictionalData !== (pack.source.status === 'fictional')) report('error', 'A indicação de conteúdo fictício deve corresponder à fonte.');
  const dependencies: Pack[] = [];
  const depIds = new Set<string>();
  for (const dep of pack.dependencies) {
    if (dep.packId === pack.packId || depIds.has(dep.packId)) report('error', 'Dependência própria ou duplicada.');
    depIds.add(dep.packId);
    const found = installed.find(p => packKey(p) === packKey(dep));
    if (!found) report('error', `Dependência ausente: ${packKey(dep)}.`);
    else dependencies.push(found);
  }
  const tables = new Map<string, RandomTable>();
  for (const p of [...dependencies, pack]) for (const e of p.entities) if (e.kind === 'randomTable') {
    if (tables.has(e.id)) report('error', `Referência de tabela ambígua: ${e.id}.`);
    tables.set(e.id, e);
  }
  for (const e of pack.entities) {
    if (e.kind !== 'randomTable') continue;
    const min = e.diceExpr.count + e.diceExpr.modifier;
    const max = e.diceExpr.count * e.diceExpr.sides + e.diceExpr.modifier;
    const outcomes = new Set(e.outcomes.map(o => o.id));
    if (outcomes.size !== e.outcomes.length) report('error', 'Outcome duplicado.', e);
    for (const r of e.ranges) {
      if (r.min > r.max || r.min < min || r.max > max) report('error', 'Range fora do domínio ou invertido.', e);
      if (!outcomes.has(r.outcomeId)) report('error', 'Range aponta para outcome ausente.', e);
    }
    let gaps = false, overlap = false;
    for (let total = min; total <= max; total++) {
      const count = e.ranges.filter(r => r.min <= total && total <= r.max).length;
      if (!count) gaps = true;
      if (count > 1) overlap = true;
    }
    if (overlap) report('error', 'Ranges sobrepostos.', e);
    if (gaps) report(e.status === 'curated' ? 'error' : 'warning', 'Tabela com lacunas; resolução automática bloqueada.', e);
    for (const o of e.outcomes) if (o.nextTableRef) {
      const next = tables.get(o.nextTableRef);
      if (!next) report('error', `Subtabela ausente: ${o.nextTableRef}.`, e);
      else if (e.status === 'curated' && next.status !== 'curated') report('error', 'Tabela curada referencia subtabela não curada.', e);
    }
  }
  const visited = new Set<string>();
  const visit = (tableId: string, ancestors: Set<string>, depth: number) => {
    if (ancestors.has(tableId)) { report('error', `Ciclo de tabelas: ${tableId}.`); return; }
    if (depth > 32) { report('error', 'Encadeamento excede 32 níveis.'); return; }
    if (visited.has(tableId)) return;
    const table = tables.get(tableId);
    if (!table) return;
    const next = new Set(ancestors).add(tableId);
    for (const o of table.outcomes) if (o.nextTableRef) visit(o.nextTableRef, next, depth + 1);
    visited.add(tableId);
  };
  for (const tableId of tables.keys()) visit(tableId, new Set(), 0);
  return diagnostics;
}

export function registry(snapshot: Snapshot) {
  const selected = snapshot.ruleset.packs.map(ref => {
    const pack = snapshot.packs.find(p => packKey(p) === packKey(ref));
    if (!pack) throw new Error(`Pack ativo indisponível: ${packKey(ref)}`);
    return pack;
  });
  if (new Set(selected.map(p => p.packId)).size !== selected.length) throw new Error('Apenas uma versão de cada pack pode estar ativa.');
  const entities = new Map<string, { entity: Entity; pack: Pack }>();
  for (const pack of selected) {
    for (const dep of pack.dependencies) if (!selected.some(p => packKey(p) === packKey(dep))) throw new Error(`Habilite a dependência ${packKey(dep)} primeiro.`);
    for (const entity of pack.entities) {
      if (entities.has(entity.id)) throw new Error(`Conflito de ID ativo: ${entity.id}. Escolha uma fonte explicitamente.`);
      entities.set(entity.id, { entity, pack });
    }
  }
  return entities;
}
export function importPack(current: Snapshot, input: unknown): { snapshot: Snapshot; diagnostics: Diagnostic[] } {
  const pack = parsePack(input);
  const diagnostics = validatePack(pack, current.packs);
  const errors = diagnostics.filter(d => d.severity === 'error');
  if (errors.length) throw new Error(errors.map(d => d.message).join('\n'));
  const previous = current.packs.find(p => packKey(p) === packKey(pack));
  if (previous && canonical(previous) !== canonical(pack)) throw new Error('Esse ID e versão já existem com outro conteúdo. Publique uma nova versão.');
  return { snapshot: previous ? current : { ...current, packs: [...current.packs, pack] }, diagnostics };
}
export function setEnabled(current: Snapshot, pack: Pack, enabled: boolean): Snapshot {
  const refs = current.ruleset.packs.filter(ref => packKey(ref) !== packKey(pack));
  if (enabled) refs.push({ packId: pack.packId, version: pack.version });
  const next = { ...current, ruleset: { ...current.ruleset, packs: refs } };
  registry(next);
  return next;
}
export function resolveHistoricalReference(snapshot: Snapshot, ref: { packId: string; version: string; entityId: string }) {
  const pack = snapshot.packs.find(p => packKey(p) === packKey(ref));
  const entity = pack?.entities.find(e => e.id === ref.entityId);
  const enabled = snapshot.ruleset.packs.some(p => packKey(p) === packKey(ref));
  return { ref: { ...ref }, entity, warning: !entity ? 'Conteúdo indisponível; referência preservada.' : !enabled ? 'Fonte desabilitada; escolha histórica preservada.' : undefined };
}
export function validateSnapshot(input: unknown): Snapshot {
  const raw = z.object({ schemaVersion: z.literal(1), packs: z.array(z.unknown()).max(500), ruleset: RulesetSchema }).strict().parse(input);
  const packs = raw.packs.map(parsePack);
  if (new Set(packs.map(packKey)).size !== packs.length) throw new Error('Packs duplicados no salvamento.');
  for (const pack of packs) {
    const errors = validatePack(pack, packs).filter(d => d.severity === 'error');
    if (errors.length) throw new Error(errors.map(d => d.message).join('\n'));
  }
  const snapshot: Snapshot = { schemaVersion: 1, packs, ruleset: raw.ruleset };
  registry(snapshot);
  return snapshot;
}
