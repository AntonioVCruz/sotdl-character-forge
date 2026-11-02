import { z } from 'zod';
import { PackSchema } from '../../packages/catalog';

export const CORE_SOURCE_ID = 'sotdl:shadow-of-the-demon-lord-core';
export const ONLY_HUMAN_SOURCE_ID = 'sotdl:only-human';
const RecipeSchema = z.object({
  schemaVersion: z.literal(1), projection: z.literal('human-l0-ancestry-stubs'),
  packs: z.array(z.object({
    packId: PackSchema.shape.packId, version: PackSchema.shape.version,
    sourceId: z.enum([CORE_SOURCE_ID, ONLY_HUMAN_SOURCE_ID]), dependencies: PackSchema.shape.dependencies,
    entityIds: z.array(z.string().min(1).max(200)).min(1).max(10000),
  }).strict()).length(2),
}).strict();

export function parseHumanL0Recipe(input: unknown) {
  const result = RecipeSchema.safeParse(input);
  if (!result.success) throw new Error('Compilation recipe: invalid input.');
  const recipe = result.data;
  if (new Set(recipe.packs.map(p => p.sourceId)).size !== 2 || new Set(recipe.packs.map(p => p.packId)).size !== 2)
    throw new Error('Compilation recipe: duplicate source or pack ID.');
  const core = recipe.packs.find(p => p.sourceId === CORE_SOURCE_ID)!;
  const supplement = recipe.packs.find(p => p.sourceId === ONLY_HUMAN_SOURCE_ID)!;
  if (core.dependencies.length || supplement.dependencies.length !== 1 ||
      supplement.dependencies[0].packId !== core.packId || supplement.dependencies[0].version !== core.version)
    throw new Error('Compilation recipe: Only Human requires the exact Core version.');
  for (const spec of recipe.packs) if (new Set(spec.entityIds).size !== spec.entityIds.length)
    throw new Error('Compilation recipe: duplicate entity selection.');
  return recipe;
}
