import { z } from 'zod';
import { SourceRefSchema } from '../random-tables';

const actionBase = { id: z.string(), seq: z.number().int().positive(), afterEventSeq: z.number().int().nonnegative(), afterLevelChangeSeq: z.number().int().nonnegative() };
export const SessionActionSchema = z.discriminatedUnion('type', [
  z.object({ ...actionBase, type: z.literal('cast'), spellId: z.string().min(1), learnedEventId: z.string().min(1), definition: SourceRefSchema }).strict(),
  z.object({ ...actionBase, type: z.literal('activate'), castId: z.string().min(1) }).strict(),
  z.object({ ...actionBase, type: z.literal('end'), castId: z.string().min(1) }).strict(),
  z.object({ ...actionBase, type: z.literal('rest') }).strict(),
  z.object({ ...actionBase, type: z.literal('equipment'), equipmentEventId: z.string().min(1), itemId: z.string().min(1), equipped: z.boolean() }).strict(),
]);
export const SessionSchema = z.object({ actions: z.array(SessionActionSchema).max(10000) }).strict();
export type Session = z.infer<typeof SessionSchema>;
export type SessionAction = Session['actions'][number];
export type CastAction = Extract<SessionAction, { type: 'cast' }>;
export const emptySession = (): Session => ({ actions: [] });
export const SessionDefinitionSchema = z.object({
  spellId: z.string().min(1), usesPerRest: z.number().int().min(1).max(20),
  effect: z.object({ name: z.string().min(1).max(200), duration: z.literal('until-ended'), scope: z.literal('self'), modifiers: z.array(z.object({
    target: z.enum(['strength', 'agility', 'intellect', 'will', 'health', 'defense', 'speed']), value: z.number().int().min(-100).max(100),
  }).strict()).min(1).max(10) }).strict(),
}).strict();
export type SessionDefinition = z.infer<typeof SessionDefinitionSchema>;
export function replaySession(session: Session) {
  const casts = new Map<string, { action: CastAction; requestedActive: boolean; expired: boolean; useNumber: number }>();
  const used: Record<string, number> = Object.create(null);
  const equipment = new Map<string, boolean>();
  let eventSeq = 0, levelSeq = 0;
  for (const [index, action] of session.actions.entries()) {
    if (action.seq !== index + 1 || action.id !== `session-${action.seq}` || action.afterEventSeq < eventSeq || action.afterLevelChangeSeq < levelSeq) throw new Error('Sequência de sessão inválida.');
    eventSeq = action.afterEventSeq; levelSeq = action.afterLevelChangeSeq;
    if (action.type === 'equipment') {
      equipment.set(action.equipmentEventId, action.equipped);
    } else if (action.type === 'rest') {
      for (const state of casts.values()) { state.requestedActive = false; state.expired = true; }
      for (const key of Object.keys(used)) used[key] = 0;
    } else if (action.type === 'cast') {
      if ([...casts.values()].some(c => c.action.spellId === action.spellId && c.requestedActive)) throw new Error('Encerre o efeito anterior antes de conjurar novamente.');
      used[action.spellId] = (used[action.spellId] ?? 0) + 1;
      casts.set(action.id, { action, requestedActive: false, expired: false, useNumber: used[action.spellId] });
    } else {
      const state = casts.get(action.castId);
      if (!state) throw new Error('Efeito referencia conjuração inexistente.');
      if (action.type === 'activate') {
        if (state.expired) throw new Error('Descanso encerrou esta instância; registre nova conjuração.');
        if ([...casts.values()].some(c => c !== state && c.action.spellId === state.action.spellId && c.requestedActive)) throw new Error('Uma magia admite apenas um efeito ativo.');
        state.requestedActive = true;
      } else state.requestedActive = false;
    }
  }
  return { casts, used, equipment };
}
