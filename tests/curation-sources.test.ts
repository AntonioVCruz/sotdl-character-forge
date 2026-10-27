import { describe, expect, it } from 'vitest';
// @ts-expect-error Node-only metadata scanner.
import { buildSources, scanReferences, sourceId } from '../tools/curation/sources.mjs';

describe('publication registry', () => {
  it('ignores fenced examples and preserves printed/PDF pagination separately', () => {
    const text = '```text\n- **Source:** Not a book\n```\n### Human\n- **Source:** Core\n- **Source Page:** 12\n- **PDF Page:** 14\n';
    const refs = scanReferences(text, 'rules/a.md', 'a'.repeat(64));
    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({ line: 5, label: 'Core', printedPageDeclared: '12', pdfPageDeclared: '14' });
    expect(sourceId('Demon Lord Errata (10oct17)')).not.toBe(sourceId('Demon Lord Errata (19nov17)'));
    const plural = scanReferences('**Fontes:** *Errata (19nov17).pdf* e *Errata (10oct17).pdf*.  ', 'rules/b.md', 'b'.repeat(64));
    expect(plural.map((r: { label: string }) => r.label)).toEqual(['Errata (19nov17)', 'Errata (10oct17)']);
  });
  it('accounts for every reference without silently resolving proposed aliases', async () => {
    const result = await buildSources(process.cwd());
    expect(result.reconciliation.manifestRows).toBe(95);
    expect(result.sources).toHaveLength(95);
    expect(result.reconciliation.resolved + result.pending.length).toBe(result.references.length);
    const ids = new Set(result.sources.map((s: { id: string }) => s.id));
    for (const ref of result.references) {
      if (ref.sourceId) expect(ids.has(ref.sourceId)).toBe(true);
      else expect(result.pending.some((p: { path: string; line: number }) => p.path === ref.path && p.line === ref.line)).toBe(true);
    }
    expect(result.pending).toEqual([]);
    for (const [label, sourceId] of [['Disciple of The Demon Lord', 'sotdl:the-disciple-of-the-demon-lord'],
      ['Oddities Artifacts and Esoterica', 'sotdl:oddities-artifacts-and-esoterica'], ['Heavens Sent', 'sotdl:heaven-s-sent']]) {
      const refs = result.references.filter((r: { label: string }) => r.label === label);
      expect(refs.length).toBeGreaterThan(0);
      expect(refs.every((r: { sourceId: string; resolution: string }) => r.sourceId === sourceId && r.resolution === 'explicit-alias')).toBe(true);
    }
    const confirmed = result.references.filter((r: { label: string }) => r.label === 'Hunger in the Void');
    expect(confirmed.length).toBeGreaterThan(0);
    expect(confirmed.every((r: { sourceId: string; resolution: string }) => r.sourceId === 'sotdl:the-hunger-in-the-void' && r.resolution === 'explicit-alias')).toBe(true);
    const punctuated = result.references.filter((r: { label: string }) => r.label === 'Do We Not Die');
    expect(punctuated.length).toBeGreaterThan(0);
    expect(punctuated.every((r: { sourceId: string; resolution: string }) => r.sourceId === 'sotdl:do-we-not-die' && r.resolution === 'explicit-alias')).toBe(true);
    expect(result).toEqual(await buildSources(process.cwd()));
  });
});
