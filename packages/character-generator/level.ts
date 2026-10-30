import { z } from 'zod';

/** Levels supported by the current contracts; this does not enable a UI step. */
export const levelSchema = z.union([z.literal(0), z.literal(1)]);
