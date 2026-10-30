export const compareStrings = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

/** Stable UTF-8/LF serialization; preserve array order and avoid locale-dependent sorting. */
export function canonicalJson(input: unknown): string {
  function sorted(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sorted);
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).sort(([a], [b]) => compareStrings(a, b)).map(([key, child]) => [key, sorted(child)]));
    }
    return value;
  }
  return JSON.stringify(sorted(input), null, 2) + '\n';
}
