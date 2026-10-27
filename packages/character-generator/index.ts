import { z } from 'zod';
import { registry, packKey, RulesetSchema, type Snapshot } from '../catalog';
import { PRNG_VERSION, ResolutionSchema, StatsSchema, createSubstream, resolveTable, tableOptions, sourceOf, supportedEffects, type Stats, type Resolution, type ManualOption } from '../random-tables';
import { SessionSchema, emptySession, replaySession } from '../session/model';
import { applySessionCommand, sessionView, type SessionCommand } from '../session';
import { equipmentView, applyEquipmentCommand, type EquipmentCommand } from '../equipment';

export const SLOT_IDS = ['ancestry', 'background', 'equipment', 'interestingThing', 'novicePath', 'pathTraining', 'tradition', 'spell'] as const;
export type SlotId = typeof SLOT_IDS[number];
export const slotLevel = (id: SlotId): 0 | 1 => ['novicePath', 'pathTraining', 'tradition', 'spell'].includes(id) ? 1 : 0;
const MAGIC_PATH = 'demo:path:spark';
export function activeSlotIds(character: Character): SlotId[] {
  const path = character.events.filter(e => e.slotId === 'novicePath' && e.level <= character.level).at(-1)?.resolution.key;
  return SLOT_IDS.filter(id => slotLevel(id) <= character.level && (!['tradition', 'spell'].includes(id) || path === MAGIC_PATH));
}
const levelSchema = z.union([z.literal(0), z.literal(1)]);
function dependenciesFor(id: SlotId, current: Partial<Record<SlotId, ChoiceEvent>>): Record<string, string> {
  if (id === 'background' || id === 'novicePath') return { ancestry: current.ancestry?.resolution.key ?? '' };
  if (id === 'pathTraining') return { novicePath: current.novicePath?.resolution.key ?? '' };
  if (id === 'tradition') return { novicePath: current.novicePath?.resolution.key ?? '' };
  if (id === 'spell') return { novicePath: current.novicePath?.resolution.key ?? '', tradition: current.tradition?.resolution.key ?? '' };
  return {};
}
const slotSchema = z.enum(SLOT_IDS);
export const strategyLabels = { manual: 'Manual', 'demo-table': 'Tabela demonstrativa (fictícia)', 'official-table': 'Tabela publicada', 'uniform-eligible': 'Aleatório entre opções válidas (não oficial)' };
const EventSchema = z.object({
  id: z.string(), seq: z.number().int().positive(), slotId: slotSchema, level: levelSchema,
  strategy: z.enum(['manual', 'demo-table', 'official-table', 'uniform-eligible']),
  seed: z.string().min(1).max(200), prngVersion: z.literal(PRNG_VERSION), rerollIndex: z.number().int().nonnegative(),
  policy: z.object({ allowUniform: z.boolean(), mode: z.enum(['manual', 'hybrid', 'all-random']), targetLevel: levelSchema, perSlotModes: z.record(z.string(), z.enum(['manual', 'random'])) }).strict(),
  replacesEventId: z.string().optional(), dependencies: z.record(z.string(), z.string()),
  candidates: z.array(z.string()).max(10000), tableId: z.string().optional(), resolution: ResolutionSchema,
  baseStats: StatsSchema.optional(),
}).strict();
export type ChoiceEvent = z.infer<typeof EventSchema>;
const CharacterSchema = z.object({
  schemaVersion: z.literal(2), kind: z.literal('sotdl-demo-character'), id: z.string().min(1),
  revision: z.number().int().nonnegative(), level: levelSchema, name: z.string().max(200), notes: z.string().max(10000),
  seed: z.string().min(1).max(200), prngVersion: z.literal(PRNG_VERSION),
  ruleset: RulesetSchema, locks: z.array(slotSchema).max(8), events: z.array(EventSchema).max(10000),
  levelChanges: z.array(z.object({ seq: z.number().int().positive(), from: levelSchema, to: levelSchema, afterEventSeq: z.number().int().nonnegative() }).strict()).max(10000),
  session: SessionSchema.default(emptySession),
}).strict();
export type Character = z.infer<typeof CharacterSchema>;
export const newCharacter = (): Character => ({ schemaVersion: 2, kind: 'sotdl-demo-character', id: 'local-demo', revision: 0, level: 0, name: '', notes: '', seed: 'minha-aventura', prngVersion: PRNG_VERSION, ruleset: { id: 'local', packs: [] }, locks: [], events: [], levelChanges: [], session: emptySession() });
export function currentEvents(character: Character): Partial<Record<SlotId, ChoiceEvent>> {
  const current: Partial<Record<SlotId, ChoiceEvent>> = {};
  const active = activeSlotIds(character);
  for (const event of character.events) if (active.includes(event.slotId)) current[event.slotId] = event;
  return current;
}
export function parseCharacter(input: unknown): Character {
  // v1 only supported level 0. Never silently reinterpret a fabricated v1 progression.
  if (input && typeof input === 'object' && 'schemaVersion' in input && input.schemaVersion === 1) {
    const old = input as Record<string, unknown>;
    if (old.level !== 0 || 'levelChanges' in old || !Array.isArray(old.events) || old.events.some(e => !e || e.level !== 0 || slotLevel(e.slotId) !== 0 || e.policy?.targetLevel !== 0)) throw new Error('Arquivo v1 incompatível com nível 0.');
    input = { ...old, schemaVersion: 2, levelChanges: [] };
  }
  const c = CharacterSchema.parse(input), previous: Partial<Record<SlotId, ChoiceEvent>> = {};
  let finalLevel: 0 | 1 = 0, lastEventSeq = 0;
  for (const [i, change] of c.levelChanges.entries()) {
    if (change.seq !== i+1 || change.from !== finalLevel || change.to === change.from || change.afterEventSeq < lastEventSeq || change.afterEventSeq > c.events.length) throw new Error('Histórico de níveis inválido.');
    finalLevel = change.to; lastEventSeq = change.afterEventSeq;
  }
  if (finalLevel !== c.level) throw new Error('Nível atual diverge do histórico.');
  if (new Set(c.locks).size !== c.locks.length) throw new Error('Travas duplicadas.');
  const ids = new Set<string>();
  for (const [index, event] of c.events.entries()) {
    const activeLevel = c.levelChanges.filter(change => change.afterEventSeq <= index).at(-1)?.to ?? 0;
    if (event.level !== slotLevel(event.slotId) || event.level > activeLevel || event.policy.targetLevel !== activeLevel) throw new Error('Evento fora do nível ativo na sequência histórica.');
    if (event.slotId === 'novicePath' && SLOT_IDS.some(id => slotLevel(id) === 0 && !previous[id])) throw new Error('Caminho anterior à criação de nível 0.');
    if (event.slotId === 'pathTraining' && !previous.novicePath) throw new Error('Treinamento anterior ao caminho.');
    if (['tradition', 'spell'].includes(event.slotId) && previous.novicePath?.resolution.key !== MAGIC_PATH) throw new Error('Aprendizado mágico exige caminho mágico anterior.');
    if (event.slotId === 'spell' && (!previous.tradition || previous.tradition.dependencies.novicePath !== MAGIC_PATH)) throw new Error('Magia anterior à tradição.');
    if (event.seq !== index + 1 || event.id !== `event-${event.seq}` || ids.has(event.id)) throw new Error('Sequência de eventos inválida.');
    ids.add(event.id);
    const old = previous[event.slotId];
    if (event.replacesEventId !== old?.id || event.rerollIndex !== (old ? old.rerollIndex + 1 : 0)) throw new Error('Histórico de substituições inválido.');
    if (!event.candidates.includes(event.resolution.key)) throw new Error('Resultado fora do snapshot de candidatos.');
    if (event.strategy === 'manual' && event.resolution.rolls.length) throw new Error('Escolha manual não pode inventar rolagens.');
    if (event.strategy === 'uniform-eligible' && (event.tableId || event.resolution.rolls.length)) throw new Error('Sorteio uniforme não é uma rolagem de tabela.');
    if (event.strategy === 'uniform-eligible' && !event.policy.allowUniform) throw new Error('Sorteio uniforme sem autorização registrada.');
    if (['demo-table', 'official-table'].includes(event.strategy) && !event.resolution.rolls.length) throw new Error('Sorteio de tabela sem rolagens.');
    const seenRolls = new Set<string>();
    for (const roll of event.resolution.rolls) {
      if (seenRolls.has(roll.id) || (roll.parentRollId && !seenRolls.has(roll.parentRollId))) throw new Error('Vínculo de rolagens inválido.');
      seenRolls.add(roll.id);
      if (roll.faces.length !== roll.diceExpr.count || roll.faces.some(f => f < 1 || f > roll.diceExpr.sides) || roll.faces.reduce((a,b) => a+b, roll.diceExpr.modifier) !== roll.total) throw new Error('Faces ou total de rolagem inválidos.');
      if (roll.tableId !== roll.source.entityId) throw new Error('Fonte da rolagem inconsistente.');
    }
    if (event.strategy === 'demo-table' && !event.resolution.sources.every(s => s.fictional)) throw new Error('Tabela demonstrativa com fonte não fictícia.');
    if (event.strategy === 'official-table' && event.resolution.sources.some(s => s.fictional)) throw new Error('Fonte fictícia rotulada como oficial.');
    const expectedDependencies = dependenciesFor(event.slotId, previous);
    if (JSON.stringify(event.dependencies) !== JSON.stringify(expectedDependencies)) throw new Error('Dependências históricas inconsistentes.');
    previous[event.slotId] = event;
  }
  replaySession(c.session);
  for (const action of c.session.actions) {
    if (action.afterEventSeq > c.events.length || action.afterLevelChangeSeq > c.levelChanges.length) throw new Error('Sessão referencia história futura.');
    const changes = c.levelChanges.slice(0, action.afterLevelChangeSeq);
    if (changes.some(change => change.afterEventSeq > action.afterEventSeq) || c.levelChanges.slice(action.afterLevelChangeSeq).some(change => change.afterEventSeq < action.afterEventSeq)) throw new Error('Posição da sessão no histórico de níveis é inconsistente.');
    if (action.type === 'cast') {
      const historical: Character = { ...c, level: changes.at(-1)?.to ?? 0, events: c.events.slice(0, action.afterEventSeq) };
      const learned = currentEvents(historical).spell;
      if (!learned || learned.id !== action.learnedEventId || learned.resolution.key !== action.spellId) throw new Error('Conjuração sem aprendizado original válido no histórico.');
    }
    if (action.type === 'equipment') {
      const selected = c.events.slice(0, action.afterEventSeq).filter(e => e.slotId === 'equipment').at(-1);
      if (!selected || selected.id !== action.equipmentEventId || selected.resolution.key !== action.itemId) throw new Error('Ação de equipamento não corresponde à escolha original no histórico.');
    }
  }
  return c;
}

export type Slot = { id: SlotId; label: string; options: ManualOption[]; dependencies: Record<string, string>; tableId?: string; reason?: string };
export function planSlots(character: Character, catalog: Snapshot, beforeIndex: number = SLOT_IDS.length): Slot[] {
  const entries = [...registry(catalog).values()], current = currentEvents(character);
  const ancestry = current.ancestry?.resolution.key;
  return activeSlotIds(character).filter(id => SLOT_IDS.indexOf(id) < beforeIndex).map(id => {
    const slot: Slot = { id, label: ({ ancestry: 'Ancestralidade', background: 'Background', equipment: 'Equipamento', interestingThing: 'Objeto curioso', novicePath: 'Caminho iniciante', pathTraining: 'Treinamento do caminho', tradition: 'Tradição', spell: 'Magia aprendida' })[id], options: [], dependencies: dependenciesFor(id, current) };
    if (id === 'tradition' || id === 'spell') {
      const prerequisites = slotIssues(character, catalog, SLOT_IDS.indexOf(id));
      if (prerequisites.length) { slot.reason = id === 'spell' ? 'Resolva a tradição e as etapas anteriores antes de aprender magia.' : 'Resolva o caminho e o treinamento antes da tradição.'; return slot; }
      slot.options = entries.filter(({ entity, pack }) => pack.fictionalData && entity.status === 'curated' && entity.demoSlot === id && entity.demoLevel === 1 && entity.requiresPath === MAGIC_PATH)
        .filter(({ entity }) => id === 'tradition' ? entity.kind === 'rule' : entity.kind === 'spell' && entity.traditionId === current.tradition?.resolution.key && entity.rank === 0)
        .map(({ entity }) => ({ key: entity.id, label: entity.name, path: [], quantities: [] })).sort((a,b) => a.key.localeCompare(b.key));
      if (!slot.options.length) slot.reason = 'Nenhuma opção mágica elegível nas fontes habilitadas.';
      return slot;
    }
    if (id === 'ancestry' || id === 'equipment' || id === 'novicePath' || id === 'pathTraining') {
      if (id === 'novicePath' && slotIssues({ ...character, level: 0 }, catalog).length) { slot.reason = 'Resolva as escolhas de nível 0 antes de escolher o caminho.'; return slot; }
      if (id === 'pathTraining' && !current.novicePath) { slot.reason = 'Escolha um caminho antes do treinamento.'; return slot; }
      if (id === 'pathTraining') {
        const path = current.novicePath!;
        const entry = entries.find(e => e.entity.id === path.resolution.key);
        const originalSource = path.resolution.sources[0];
        const pathSlot: Slot = { id: 'novicePath', label: 'Caminho iniciante', options: [], dependencies: dependenciesFor('novicePath', current) };
        if (slotIssues({ ...character, level: 0 }, catalog).length || JSON.stringify(path.dependencies) !== JSON.stringify(pathSlot.dependencies) || !entry || entry.entity.status !== 'curated' || entry.entity.demoSlot !== 'novicePath' || packKey(entry.pack) !== `${originalSource.packId}@${originalSource.version}` || verifySavedMechanics(path, pathSlot, catalog).length || path.resolution.unresolved.length) {
          slot.reason = 'Resolva o caminho antes do treinamento.'; return slot;
        }
      }
      const kinds = { ancestry: 'ancestry', equipment: 'item', novicePath: 'path', pathTraining: 'trait' };
      slot.options = entries.filter(({entity, pack}) => pack.fictionalData && entity.status === 'curated' && entity.demoSlot === id && entity.kind === kinds[id])
        .filter(({entity}) => slotLevel(id) === 0 || entity.demoLevel === 1)
        .filter(({entity}) => id !== 'pathTraining' || entity.requiresPath === current.novicePath?.resolution.key)
        .filter(({entity}) => id !== 'ancestry' || StatsSchema.safeParse(entity.baseStats).success)
        .map(({entity}) => ({ key: entity.id, label: entity.name, path: [], quantities: [] })).sort((a,b) => a.key.localeCompare(b.key));
      if (!slot.options.length) slot.reason = 'Nenhuma opção demonstrativa elegível nas fontes habilitadas.';
      return slot;
    }
    if (id === 'background' && (!ancestry || !entries.some(({entity}) => entity.id === ancestry && entity.status === 'curated'))) {
      slot.reason = 'Selecione uma ancestralidade válida primeiro.'; return slot;
    }
    const tables = entries.filter(({entity}) => {
      if (entity.kind !== 'randomTable') return false;
      const scope = entity.appliesTo as { slotKind?: string; ancestryId?: string } | undefined;
      return scope?.slotKind === id && (!scope.ancestryId || scope.ancestryId === ancestry);
    });
    if (tables.length !== 1) { slot.reason = tables.length ? 'Conflito: mais de uma tabela aplicável. Escolha a fonte no catálogo.' : 'Tabela aplicável ausente nas fontes habilitadas.'; return slot; }
    slot.tableId = tables[0].entity.id;
    try { slot.options = tableOptions(catalog, slot.tableId, { slotKind: id, ancestryId: ancestry }); }
    catch (e) { slot.reason = e instanceof Error ? e.message : String(e); }
    return slot;
  });
}
export type Policy = { seed: string; allowUniform: boolean; mode: 'manual' | 'hybrid' | 'all-random'; perSlotModes: Partial<Record<SlotId, 'manual' | 'random'>>; targetLevel: number };
/** Re-evaluate stored choices, never their RNG. This prevents an imported cached bonus from becoming a rule. */
function verifySavedMechanics(event: ChoiceEvent, slot: Slot, catalog: Snapshot): string[] {
  try {
    let expected: Resolution;
    if (slot.tableId) {
      const option = slot.options.find(o => o.key === event.resolution.key);
      if (!option) return [];
      expected = resolveTable(catalog, slot.tableId, { path: option.path, quantities: event.resolution.quantities }, { slotKind: slot.id, ancestryId: slot.dependencies.ancestry });
    } else {
      const entry = registry(catalog).get(event.resolution.key);
      if (!entry) return [];
      expected = { key: entry.entity.id, label: entry.entity.name, sources: [sourceOf(entry.entity.id, catalog)], rolls: [], quantities: {}, ...supportedEffects(entry.entity.mechanicalEvents) };
      if (slot.id === 'ancestry' && JSON.stringify(StatsSchema.parse(entry.entity.baseStats)) !== JSON.stringify(event.baseStats)) return ['Atributos gravados divergem da fonte; escolha novamente.'];
    }
    if (JSON.stringify(expected.effects) !== JSON.stringify(event.resolution.effects) || JSON.stringify(expected.sources) !== JSON.stringify(event.resolution.sources) || JSON.stringify(expected.unresolved) !== JSON.stringify(event.resolution.unresolved)) return ['Consequências ou fontes gravadas divergem do catálogo; revisão necessária.'];
    if (event.resolution.rolls.length) {
      const mainRolls = event.resolution.rolls.filter(r => !r.ruleId);
      if (JSON.stringify(mainRolls.map(r => r.outcomeId)) !== event.resolution.key || JSON.stringify(mainRolls.map(r => r.source)) !== JSON.stringify(expected.sources) || mainRolls[0]?.tableId !== event.tableId) return ['Caminho das rolagens diverge da escolha gravada.'];
      if (mainRolls.some((roll, i) => roll.parentRollId !== (i ? mainRolls[i-1].id : undefined))) return ['Vínculo de subtabelas inconsistente.'];
      const entries = registry(catalog);
      for (const roll of event.resolution.rolls) {
        const table = entries.get(roll.tableId)?.entity;
        if (!table || table.kind !== 'randomTable') return ['Tabela do histórico indisponível.'];
        if (JSON.stringify(sourceOf(table.id, catalog)) !== JSON.stringify(roll.source)) return ['Fonte de rolagem inconsistente.'];
        if (!roll.ruleId) {
          if (JSON.stringify(table.diceExpr) !== JSON.stringify(roll.diceExpr) || !table.ranges.some(r => r.min <= roll.total && roll.total <= r.max && r.outcomeId === roll.outcomeId)) return ['Resultado da rolagem diverge da tabela gravada.'];
        } else {
          const parent = event.resolution.rolls.find(r => r.id === roll.parentRollId);
          const outcome = table.outcomes.find(o => o.id === parent?.outcomeId);
          const side = outcome?.sideRolls?.find(s => s.id === roll.ruleId);
          if (!side || JSON.stringify(side.diceExpr) !== JSON.stringify(roll.diceExpr) || event.resolution.quantities[`${table.id}/${outcome!.id}/${side.id}`] !== roll.total) return ['Quantidade gravada diverge da rolagem secundária.'];
        }
      }
    }
    return [];
  } catch { return ['Não foi possível verificar as consequências gravadas; revisão necessária.']; }
}
export function slotIssues(character: Character, catalog: Snapshot, beforeIndex: number = SLOT_IDS.length): Array<{ slotId: SlotId; reason: string }> {
  const current = currentEvents(character), entries = registry(catalog);
  const issues = planSlots(character, catalog, beforeIndex).flatMap(slot => {
    const event = current[slot.id];
    let reasons: string[] = [];
    if (!event) reasons.push(slot.reason ?? 'Escolha obrigatória não preenchida.');
    else {
      if (slot.reason) reasons.push(slot.reason);
      if (!slot.options.some(o => o.key === event.resolution.key) || (event.tableId ?? '') !== (slot.tableId ?? '')) reasons.push('Escolha anterior não é elegível; requer revisão.');
      if (JSON.stringify(slot.dependencies) !== JSON.stringify(event.dependencies)) reasons.push('Dependência alterada; confirme novamente esta escolha.');
      for (const source of event.resolution.sources) {
        const entry = entries.get(source.entityId);
        if (!entry || packKey(entry.pack) !== `${source.packId}@${source.version}` || entry.entity.sourceRef !== source.sourceRef) reasons.push(`Fonte original indisponível: ${source.packId}@${source.version}. Resultado preservado.`);
      }
      reasons.push(...event.resolution.unresolved);
      if (!reasons.length) reasons.push(...verifySavedMechanics(event, slot, catalog));
    }
    return [...new Set(reasons)].map(reason => ({ slotId: slot.id, reason }));
  });
  if (current.background && issues.some(i => i.slotId === 'ancestry')) issues.push({ slotId: 'background', reason: 'Ancestralidade requer revisão; benefícios dependentes suspensos.' });
  if (character.level === 1 && issues.some(i => slotLevel(i.slotId) === 0)) issues.push({ slotId: 'novicePath', reason: 'Nível 0 requer revisão; benefícios do caminho suspensos.' });
  if (character.level === 1 && issues.some(i => i.slotId === 'novicePath')) issues.push({ slotId: 'pathTraining', reason: 'Caminho requer revisão; benefícios do treinamento suspensos.' });
  return issues;
}
export function chooseSlot(character: Character, catalog: Snapshot, slotId: SlotId, policy: Policy, manual?: { key: string; quantities: Record<string, number> }): Character {
  if (![0, 1].includes(policy.targetLevel)) throw new Error('Esta fatia suporta nível 0 e nível 1.');
  if (policy.targetLevel !== character.level) throw new Error('Confirme a mudança de nível antes de escolher esta etapa.');
  if (!policy.seed.trim() || policy.seed.length > 200) throw new Error('Informe uma seed com 1–200 caracteres.');
  if (character.locks.includes(slotId)) throw new Error('Destrave esta escolha antes de alterá-la.');
  const slot = planSlots(character, catalog).find(s => s.id === slotId);
  if (!slot) throw new Error('Escolha indisponível neste nível.');
  if (slotId === 'pathTraining' && slotIssues(character, catalog).some(i => i.slotId === 'novicePath')) throw new Error('Resolva o caminho antes do treinamento.');
  if (slot.reason || !slot.options.length) throw new Error(slot.reason ?? 'Nenhum candidato elegível.');
  const old = currentEvents(character)[slotId], rerollIndex = old ? old.rerollIndex + 1 : 0;
  const rng = createSubstream(policy.seed, slotId, rerollIndex);
  let resolution: Resolution, baseStats: Stats | undefined;
  let strategy: ChoiceEvent['strategy'] = 'manual';
  if (slot.tableId) {
    const selected = manual && slot.options.find(o => o.key === manual.key);
    if (manual && !selected) throw new Error('Escolha manual não elegível.');
    resolution = resolveTable(catalog, slot.tableId, selected ? { path: selected.path, quantities: manual!.quantities } : { rng }, { slotKind: slotId, ancestryId: currentEvents(character).ancestry?.resolution.key });
    if (new Set(resolution.sources.map(s => s.fictional)).size > 1) throw new Error('Cadeia mistura fontes fictícias e oficiais; revisão manual necessária.');
    if (!manual) strategy = resolution.sources.every(s => s.fictional) ? 'demo-table' : 'official-table';
  } else {
    if (!manual && !policy.allowUniform) throw new Error('Autorize o sorteio uniforme entre opções válidas (não oficial).');
    const option = manual ? slot.options.find(o => o.key === manual.key) : slot.options[rng.int(slot.options.length)];
    if (!option) throw new Error('Escolha manual não elegível.');
    const entry = registry(catalog).get(option.key)!;
    const mechanical = supportedEffects(entry.entity.mechanicalEvents);
    resolution = { key: option.key, label: option.label, sources: [sourceOf(option.key, catalog)], rolls: [], quantities: {}, ...mechanical };
    if (slotId === 'ancestry') baseStats = StatsSchema.parse(entry.entity.baseStats);
    if (!manual) strategy = 'uniform-eligible';
  }
  const seq = character.events.length + 1;
  const event: ChoiceEvent = { id: `event-${seq}`, seq, level: slotLevel(slotId), slotId, strategy, seed: policy.seed, prngVersion: PRNG_VERSION, rerollIndex, policy: { allowUniform: policy.allowUniform, mode: policy.mode, targetLevel: character.level, perSlotModes: { ...policy.perSlotModes } }, replacesEventId: old?.id, dependencies: slot.dependencies, candidates: slot.options.map(o => o.key), tableId: slot.tableId, resolution, baseStats };
  return { ...character, seed: policy.seed, ruleset: structuredClone(catalog.ruleset), events: [...character.events, event], locks: manual ? [...character.locks, slotId] : [...character.locks] };
}
export type Draft = { base: string; catalog: string; character: Character; unresolved: Array<{ slotId: SlotId; reason: string }>; fullyResolved: boolean };
export function preview(character: Character, catalog: Snapshot, policy: Policy, command?: { slotId: SlotId; manual?: { key: string; quantities: Record<string, number> } }): Draft {
  if (![0, 1].includes(policy.targetLevel)) throw new Error('Esta fatia suporta nível 0 e nível 1.');
  let next = structuredClone(character);
  const changingLevel = policy.targetLevel !== character.level;
  if (changingLevel) {
    const target = policy.targetLevel as 0 | 1;
    next.levelChanges.push({ seq: next.levelChanges.length + 1, from: next.level, to: target, afterEventSeq: next.events.length });
    next.level = target;
  }
  const generationIssues: Draft['unresolved'] = [];
  if (command) next = chooseSlot(next, catalog, command.slotId, policy, command.manual);
  else for (const slotId of SLOT_IDS) {
    if (!activeSlotIds(next).includes(slotId)) continue;
    // Moving levels preserves all existing decisions, including suspended level-1 history.
    if (changingLevel && (policy.targetLevel < character.level || currentEvents(next)[slotId])) continue;
    if (next.locks.includes(slotId)) continue;
    if (policy.mode === 'manual' || (policy.mode === 'hybrid' && policy.perSlotModes[slotId] === 'manual')) continue;
    try { next = chooseSlot(next, catalog, slotId, policy); }
    catch (e) { generationIssues.push({ slotId, reason: e instanceof Error ? e.message : String(e) }); }
  }
  const unresolved = [...slotIssues(next, catalog), ...generationIssues];
  return { base: JSON.stringify(character), catalog: JSON.stringify(catalog), character: next, unresolved, fullyResolved: !unresolved.length };
}
export function commitDraft(draft: Draft, current: Character, catalog: Snapshot): Character {
  if (draft.base !== JSON.stringify(current) || draft.catalog !== JSON.stringify(catalog)) throw new Error('A ficha ou o catálogo mudou. Gere outra prévia.');
  return parseCharacter({ ...draft.character, revision: current.revision + 1 });
}
export function calculateCharacter(character: Character, catalog: Snapshot) {
  const current = currentEvents(character), unresolved = slotIssues(character, catalog);
  const invalid = new Set(unresolved.map(i => i.slotId));
  const equipment = equipmentView(character, { selected: current.equipment, valid: !!current.equipment && !invalid.has('equipment') });
  const stats: Partial<Stats> = {}, breakdown: Array<{ target: string; value: number; source: string }> = [];
  const resources: Record<string, number> = Object.create(null);
  if (current.ancestry?.baseStats && !invalid.has('ancestry')) {
    Object.assign(stats, current.ancestry.baseStats);
    for (const [target, value] of Object.entries(current.ancestry.baseStats)) breakdown.push({ target, value, source: current.ancestry.resolution.label });
  }
  for (const slot of SLOT_IDS) {
    const event = current[slot];
    if (!event || invalid.has(slot)) continue;
    if (slot === 'equipment' && !equipment?.equipped) continue;
    // Learning is not casting: magical descriptions/effects never change the sheet automatically.
    if (slot === 'tradition' || slot === 'spell') continue;
    for (const effect of event.resolution.effects) {
      if (effect.type === 'stat-add') {
        if (stats[effect.target] === undefined) continue;
        stats[effect.target]! += effect.value;
      } else resources[effect.target] = (resources[effect.target] ?? 0) + effect.value;
      breakdown.push({ target: effect.target, value: effect.value, source: event.resolution.label });
    }
  }
  const session = sessionView(character, catalog, { learned: current.spell, valid: !!current.spell && !invalid.has('spell') });
  for (const effect of session.effects) if (effect.active) {
    for (const modifier of effect.modifiers) {
      if (stats[modifier.target] === undefined) continue;
      stats[modifier.target]! += modifier.value;
      breakdown.push({ target: modifier.target, value: modifier.value, source: `${effect.name} · ${effect.source.sourceRef} · ${effect.castId}` });
    }
  }
  const learned = current.spell;
  const spellEntry = learned && registry(catalog).get(learned.resolution.key);
  const spell = learned ? {
    name: learned.resolution.label, tradition: [...character.events].reverse().find(e => e.slotId === 'tradition' && e.resolution.key === learned.dependencies.tradition)?.resolution.label ?? 'Tradição indisponível',
    rank: spellEntry?.entity.rank === 0 ? 0 : null,
    description: !invalid.has('spell') && typeof spellEntry?.entity.description === 'string' ? spellEntry.entity.description : 'Descrição indisponível até revisar a escolha e suas fontes.',
    sources: learned.resolution.sources, needsReview: invalid.has('spell'),
  } : undefined;
  return { stats, resources, breakdown, unresolved, fullyResolved: !unresolved.length, choices: current, spell, session, equipment };
}
export function performEquipmentCommand(character: Character, catalog: Snapshot, command: EquipmentCommand): Character {
  const selected = currentEvents(character).equipment;
  const valid = !!selected && !slotIssues(character, catalog).some(issue => issue.slotId === 'equipment');
  return parseCharacter(applyEquipmentCommand(character, { selected, valid }, command));
}
export function performSessionCommand(character: Character, catalog: Snapshot, command: SessionCommand): Character {
  const learned = currentEvents(character).spell;
  const valid = !!learned && !slotIssues(character, catalog).some(i => i.slotId === 'spell');
  return parseCharacter(applySessionCommand(character, catalog, { learned, valid }, command));
}
export const exportCharacter = (character: Character) => JSON.stringify(parseCharacter(character), null, 2);
export function importCharacter(text: string): Character {
  if (text.length > 5_000_000) throw new Error('JSON de personagem excede 5 MB.');
  return parseCharacter(JSON.parse(text));
}
