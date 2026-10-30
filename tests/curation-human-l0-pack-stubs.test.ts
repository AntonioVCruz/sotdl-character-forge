import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsePack, validatePack, type Pack } from '../packages/catalog';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const CORE_PATH = 'content-packs/sotdl%3Ashadow-of-the-demon-lord-core/0.1.0/pack.json';
const ONLY_HUMAN_PATH = 'content-packs/sotdl%3Aonly-human/0.1.0/pack.json';
const errors = (pack: Pack, installed: Pack[] = []) => validatePack(pack, installed).filter(d => d.severity === 'error');

describe('S1 Human L0 pack stubs', () => {
  it('parses and validates Core before Only Human, ancestry stubs only', () => {
    const corePack = parsePack(read(CORE_PATH));
    expect(errors(corePack)).toEqual([]);

    const supplement = parsePack(read(ONLY_HUMAN_PATH));
    expect(errors(supplement).some(d => d.message.includes('Dependência ausente'))).toBe(true);
    expect(errors(supplement, [corePack])).toEqual([]);

    for (const pack of [corePack, supplement]) {
      expect(pack.fictionalData).toBe(false);
      expect(pack.source.status).toBe('needs-review');
      expect(pack.entities.length).toBeGreaterThan(0);
      expect(pack.entities.every(entity => entity.kind === 'ancestry' && entity.status === 'needs-review')).toBe(true);
      expect(pack.entities.every(entity => entity.sourceRef === pack.source.id)).toBe(true);
      expect(JSON.stringify(pack)).not.toMatch(/demoSlot|demoLevel|MAGIC_PATH|randomTable/);
    }
    expect(supplement.dependencies).toEqual([{ packId: corePack.packId, version: corePack.version }]);
    expect(validatePack(corePack).some(d => d.severity === 'warning')).toBe(true);
    expect(validatePack(supplement, [corePack]).some(d => d.severity === 'warning')).toBe(true);
  });
});
