import { ZodError } from 'zod';
export function errorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    const fields = [...new Set(error.issues.map(i => i.path.join('.') || 'documento'))].slice(0, 4);
    return `Arquivo inválido. Confira o formato e os campos: ${fields.join(', ')}. Nenhum dado foi substituído.`;
  }
  return error instanceof Error ? error.message : String(error);
}
