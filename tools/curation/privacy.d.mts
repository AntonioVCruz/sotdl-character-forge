export function privacyHash(value: string | Buffer): string;
export function redactBuyerLines(text: string): string;
export function hasBuyerData(text: string): boolean;
export function sanitizeArtifact<T>(value: T): T;
export const localArtifactRoots: string[];
export function assertSafeArtifact(path: string, text: string): void;
