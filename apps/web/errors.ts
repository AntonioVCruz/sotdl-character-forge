import { ZodError } from 'zod';

const BOUNDARY_SCOPES = new Set(['forja', 'criador', 'ficha']);

/** Logs a render failure without the message, stack, or props (those can carry notes, seeds, or pack text). */
export function reportBoundaryError(error: unknown, scope: string): void {
  const name = error instanceof Error ? error.name : 'Error';
  const where = BOUNDARY_SCOPES.has(scope) ? scope : 'forja';
  console.error(`[forja] falha de renderização (${where}): ${name}`);
}

export function errorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    const fields = [...new Set(error.issues.map(i => i.path.join('.') || 'documento'))].slice(0, 4);
    return `Arquivo inválido. Confira o formato e os campos: ${fields.join(', ')}. Nenhum dado foi substituído.`;
  }
  return error instanceof Error ? error.message : String(error);
}
