import { z } from 'zod';
import { levelSchema } from '../../packages/character-generator/level';

export const StrategySchema = z.enum(['manual', 'published-table', 'uniform-eligible-unofficial', 'pending']);
export const SlotUiStateSchema = z.enum(['empty', 'preview', 'confirmed', 'partial', 'locked', 'needs-review', 'pending', 'suspended']);
const id = z.string().min(1).max(200);
const distinctIds = z.array(id).max(100).refine(values => new Set(values).size === values.length, 'Escolhas duplicadas.');
export const ChoiceOptionSchema = z.object({ id, label: z.string().min(1), eligible: z.boolean(), disabledReason: z.string().min(1).optional() }).strict()
  .refine(option => option.eligible || Boolean(option.disabledReason), 'Opção inelegível exige motivo.');
export const RollTraceSchema = z.object({
  expression: z.string().min(1), faces: z.array(z.number().int().positive()).min(1), total: z.number().finite(),
  table: z.string().optional(), source: z.string().optional(), seed: z.string().optional(), rerollIndex: z.number().int().nonnegative().optional(),
}).strict();

export const ChoiceSlotSchema = z.object({
  slotId: id, level: levelSchema.default(0), title: z.string().min(1), contextLine: z.string().optional(),
  strategy: StrategySchema, uiState: SlotUiStateSchema,
  options: z.array(ChoiceOptionSchema).max(100),
  cardinality: z.object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative().max(100) }).strict()
    .refine(card => card.min <= card.max, 'Cardinalidade invertida.'),
  selectedIds: distinctIds,
  preview: z.object({ label: z.string().min(1), confirmed: z.literal(false) }).strict().optional(),
  confirmReason: z.string().min(1).optional(),
  consequences: z.object({ status: z.enum(['applied', 'needs-review']), items: z.array(z.string()) }).strict().optional(),
  rollTrace: RollTraceSchema.optional(), locked: z.boolean(), canReroll: z.boolean(), sortReason: z.string().optional(),
}).strict().superRefine((slot, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (new Set(slot.options.map(option => option.id)).size !== slot.options.length) issue('IDs de opções duplicados.');
  if (slot.uiState === 'empty' && (slot.selectedIds.length || slot.preview)) issue('Slot vazio não contém escolhas.');
  if (slot.uiState === 'preview' && !slot.preview) issue('Estado de prévia exige proposta.');
  if (slot.uiState === 'confirmed') {
    if (slot.preview || slot.confirmReason || slot.selectedIds.length < slot.cardinality.min || slot.selectedIds.length > slot.cardinality.max)
      issue('Slot confirmado precisa cumprir a cardinalidade e não ter prévia pendente.');
    if (slot.selectedIds.some(value => !slot.options.some(option => option.id === value && option.eligible))) issue('Escolha confirmada inelegível.');
  }
  if (slot.uiState === 'partial' && !(slot.selectedIds.length > 0 && slot.selectedIds.length < slot.cardinality.min)) issue('Estado parcial incoerente.');
});

/** UI callbacks are deliberately outside the serializable contract. */
export function parseChoiceSlotProps(props: Record<string, unknown>) {
  const data = Object.fromEntries(Object.keys(ChoiceSlotSchema.shape).map(key => [key, props[key]]));
  return ChoiceSlotSchema.parse(data);
}

export function createSlotCommandSchema<Key extends z.ZodType<string>, Level extends z.ZodType<number>>(key: Key, level: Level) {
  const base = z.object({ key, level }).strict();
  return z.discriminatedUnion('type', [
    base.extend({ type: z.literal('select'), ids: distinctIds }),
    base.extend({ type: z.literal('roll') }), base.extend({ type: z.literal('reroll') }),
    base.extend({ type: z.literal('confirm') }), base.extend({ type: z.literal('discard') }),
    base.extend({ type: z.literal('lock') }), base.extend({ type: z.literal('generate-flag') }),
  ]);
}

export const ChoiceSlotCommandSchema = createSlotCommandSchema(id, levelSchema.default(0));
