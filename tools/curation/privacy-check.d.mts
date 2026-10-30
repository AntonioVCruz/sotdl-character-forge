export function inspectContent(path: string, text: string): number;
export function auditTracked(root?: string): { scanned: number; findings: { path: string; reason: string }[] };
