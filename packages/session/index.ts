import { registry, type Snapshot } from '../catalog';
import { sourceOf, type SourceRef } from '../random-tables';
import type { Character, ChoiceEvent } from '../character-generator';
import { replaySession, SessionDefinitionSchema, type SessionAction } from './model';

export type LearningContext = { learned?: ChoiceEvent; valid: boolean };
export type SessionCommand = { type: 'cast' } | { type: 'activate' | 'end'; castId: string } | { type: 'rest' };
function definitionFor(spellId: string, catalog: Snapshot) {
  const matches = [...registry(catalog).values()].filter(({ entity }) => {
    const raw = entity.sessionDefinition;
    return raw && typeof raw === 'object' && 'spellId' in raw && raw.spellId === spellId;
  });
  if (matches.length !== 1) throw new Error(matches.length ? 'Mais de uma regra de sessão para esta magia; revise as fontes.' : 'Regra de sessão ausente nas fontes habilitadas.');
  const { entity, pack } = matches[0];
  if (entity.kind !== 'rule' || entity.status !== 'curated' || !pack.fictionalData) throw new Error('Regra de sessão não é uma demonstração curada.');
  const parsed = SessionDefinitionSchema.safeParse(entity.sessionDefinition);
  if (!parsed.success) throw new Error('Efeito de sessão não suportado; requer resolução manual.');
  return { definition: parsed.data, source: sourceOf(entity.id, catalog), name: entity.name };
}
export function sessionView(character: Character, catalog: Snapshot, context: LearningContext) {
  const replay = replaySession(character.session);
  let current: { spellId: string; used: number; limit: number; remaining: number; source: SourceRef; effectName: string; reason?: string } | undefined;
  let castingReason = context.valid && context.learned ? '' : 'Aprenda uma magia válida antes de conjurar.';
  if (context.learned && context.valid) {
    try {
      const rule = definitionFor(context.learned.resolution.key, catalog);
      const used = replay.used[rule.definition.spellId] ?? 0;
      current = { spellId: rule.definition.spellId, used, limit: rule.definition.usesPerRest, remaining: Math.max(0, rule.definition.usesPerRest - used), source: rule.source, effectName: rule.definition.effect.name };
      if (used >= current.limit) castingReason = 'Não há conjurações disponíveis. Descanse para restaurar os usos.';
      if ([...replay.casts.values()].some(c => c.action.spellId === current!.spellId && c.requestedActive)) castingReason = 'Encerre o efeito anterior antes de conjurar novamente.';
    } catch (e) { castingReason = e instanceof Error ? e.message : String(e); }
  }
  const effects = [...replay.casts.values()].map(state => {
    let reason = '', rule: ReturnType<typeof definitionFor> | undefined;
    try {
      rule = definitionFor(state.action.spellId, catalog);
      if (JSON.stringify(rule.source) !== JSON.stringify(state.action.definition)) reason = 'Fonte ou versão original do efeito indisponível.';
      if (state.useNumber > rule.definition.usesPerRest) reason = 'Conjuração excede o limite demonstrativo; efeito suspenso.';
    } catch (e) { reason = e instanceof Error ? e.message : String(e); }
    if (!context.valid || context.learned?.id !== state.action.learnedEventId || context.learned.resolution.key !== state.action.spellId) reason = 'Aprendizado original indisponível ou alterado; efeito suspenso.';
    const learned = character.events.find(e => e.id === state.action.learnedEventId);
    const active = state.requestedActive && !state.expired && !reason;
    return {
      castId: state.action.id, spell: learned?.resolution.label ?? state.action.spellId,
      name: rule?.definition.effect.name ?? state.action.definition.entityId, source: state.action.definition,
      requestedActive: state.requestedActive, active, expired: state.expired, reason,
      duration: 'Até encerrar ou descansar', scope: 'Próprio personagem',
      modifiers: active ? rule!.definition.effect.modifiers : [],
      declaredModifiers: rule?.definition.effect.modifiers ?? [],
    };
  });
  const warnings = effects.filter(e => e.requestedActive && !e.expired && e.reason).map(e => `${e.name}: ${e.reason}`);
  return { current, castingReason, effects, warnings, castCount: [...replay.casts.values()].length };
}
export function applySessionCommand(character: Character, catalog: Snapshot, context: LearningContext, command: SessionCommand): Character {
  const view = sessionView(character, catalog, context);
  const base = { id: `session-${character.session.actions.length + 1}`, seq: character.session.actions.length + 1, afterEventSeq: character.events.length, afterLevelChangeSeq: character.levelChanges.length };
  let action: SessionAction;
  if (command.type === 'cast') {
    if (view.castingReason || !view.current || !context.learned) throw new Error(view.castingReason || 'Regra de conjuração indisponível.');
    action = { ...base, type: 'cast', spellId: context.learned.resolution.key, learnedEventId: context.learned.id, definition: view.current.source };
  } else if (command.type === 'rest') action = { ...base, type: 'rest' };
  else {
    const effect = view.effects.find(e => e.castId === command.castId);
    if (!effect) throw new Error('Conjuração não encontrada.');
    if (command.type === 'activate') {
      if (effect.expired) throw new Error('Descanso encerrou esta instância; registre nova conjuração.');
      if (effect.reason) throw new Error(effect.reason);
      if (effect.requestedActive) return character;
    } else if (!effect.requestedActive) return character;
    action = { ...base, type: command.type, castId: command.castId };
  }
  const next = { ...character, revision: character.revision + 1, session: { actions: [...character.session.actions, action] } };
  replaySession(next.session);
  return next;
}
