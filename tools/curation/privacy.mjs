import { createHash } from 'node:crypto';

// Match purchase identifiers, including partial lines; never print matched data.
const purchase = /\((?:order\s*)?#\d{4,}\)/iu;
export const privacyHash = value => createHash('sha256').update(value).digest('hex');
export const redactBuyerLines = text => text.replace(/[^\r\n]+/g, line => purchase.test(line) ? '[buyer watermark redacted]' : line);
export const hasBuyerData = text => purchase.test(text);

// Applied at the persistence boundary, after raw selectors and IDs are resolved.
// Source hashes refer to licensed inputs; excerpt/section hashes refer to stored text.
export function sanitizeArtifact(value) {
  if (typeof value === 'string') return redactBuyerLines(value);
  if (Array.isArray(value)) return value.map(sanitizeArtifact);
  if (value === null || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeArtifact(child)]));
  if (typeof result.excerpt === 'string' && 'excerptSha256' in result) result.excerptSha256 = privacyHash(result.excerpt);
  if (typeof result.rawText === 'string' && 'sha256' in result) result.sha256 = privacyHash(result.rawText);
  return result;
}

// Full-text derivatives are local, even when they no longer contain buyer data.
export const localArtifactRoots = ['entries', 'segments', 'normalized', 'normalization', 'corrections', 'history', 'pilot', 'reports']
  .map(name => `curation/${name}/`);

export function assertSafeArtifact(path, text) {
  const visit = value => {
    if (typeof value === 'string' && hasBuyerData(value)) throw new Error(`Buyer data in generated artifact: ${path}`);
    if (value && typeof value === 'object') Object.values(value).forEach(visit);
  };
  if (path.endsWith('.json')) visit(JSON.parse(text));
  else if (path.endsWith('.jsonl')) text.split(/\r?\n/).filter(Boolean).forEach(line => visit(JSON.parse(line)));
  else visit(text);
}
