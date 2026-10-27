import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, basename, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_KEYS, HumanBaseSpecSchema, previewHumanBase, evaluateBaseRule } from '../packages/curation/ancestry-base-model';
import { buildArtifacts, main } from '../tools/curation/human-ancestry-formalizer';
import { sourceLines } from '../tools/curation/ancestry-extractor';

const DATA = 'curation/pilot/human-ancestry.json', REPORT = 'curation/reports/human-ancestry.json';
const file = JSON.parse(readFileSync(DATA, 'utf8')), spec = file.spec;
const fixed = { variant: 'core', mode: 'fixed', increase: 'strength', size: 1, adjustment: null };
const random = { variant: 'only-human', mode: 'random', faces: { strength: 1, agility: 2, intellect: 3, will: 1 }, size: 0.5, adjustment: null };
const hash = (v: string | Buffer) => createHash('sha256').update(v).digest('hex');

describe('CUR-015 Human base formalization', () => {
  it('derives the fixed branch after one legal transfer instead of accumulating final demo stats', () => {
    const result = previewHumanBase(spec, { ...fixed, adjustment: { increase: 'strength', decrease: 'agility' } });
    expect(result.base).toEqual({ strength: 12, agility: 9, intellect: 10, will: 10, health: 12, perception: 10, defense: 9,
      healingRate: 3, size: 1, speed: 10, power: 0, damage: 0, insanity: 0, corruption: 0,
      strengthModifier: 2, agilityModifier: -1, intellectModifier: 0, willModifier: 0, perceptionModifier: 0 });
    expect(result.completeCharacter).toBe(false); expect(result.traces).toHaveLength(19);
    expect(result.traces.find(t => t.target === 'strength')?.evidenceIds).toContain('general-scores');
  });
  it('preserves all 81 sets of four independent d3 and legal transfers without applying the fixed-branch increase', () => {
    let count = 0;
    for (let s = 1; s <= 3; s++) for (let a = 1; a <= 3; a++) for (let i = 1; i <= 3; i++) for (let w = 1; w <= 3; w++) {
      const faces = { strength: s, agility: a, intellect: i, will: w };
      const base = previewHumanBase(spec, { ...random, faces }).base;
      expect(ATTRIBUTE_KEYS.map(k => base[k])).toEqual([8 + s, 8 + a, 8 + i, 8 + w]);
      expect(base.health).toBe(8 + s); expect(base.healingRate).toBe(Math.floor((8 + s) / 4));
      expect(base.defense).toBe(8 + a); expect(base.perception).toBe(8 + i);
      for (const increase of ATTRIBUTE_KEYS) for (const decrease of ATTRIBUTE_KEYS) if (increase !== decrease) {
        const changed = previewHumanBase(spec, { ...random, faces, adjustment: { increase, decrease } }).base;
        expect(ATTRIBUTE_KEYS.reduce((sum, k) => sum + changed[k], 0)).toBe(ATTRIBUTE_KEYS.reduce((sum, k) => sum + base[k], 0));
        expect(changed[increase]).toBe(base[increase] + 1); expect(changed[decrease]).toBe(base[decrease] - 1);
      }
      count++;
    }
    expect(count).toBe(81);
  });
  it('rejects unoffered modes, missing/invalid faces, simultaneous modes, extra transfers and invalid Size', () => {
    expect(() => previewHumanBase(spec, { ...random, variant: 'core' })).toThrow(/not published/);
    expect(() => previewHumanBase(spec, { ...random, faces: { ...random.faces, will: 4 } })).toThrow();
    expect(() => previewHumanBase(spec, { ...random, faces: undefined })).toThrow();
    expect(() => previewHumanBase(spec, { ...random, increase: 'strength' })).toThrow();
    expect(() => previewHumanBase(spec, { ...fixed, faces: random.faces })).toThrow();
    expect(() => previewHumanBase(spec, { ...fixed, adjustment: { increase: 'will', decrease: 'will' } })).toThrow(/distinct/);
    expect(() => previewHumanBase(spec, { ...fixed, adjustment: [{ increase: 'will', decrease: 'agility' }] })).toThrow();
    expect(() => previewHumanBase(spec, { ...fixed, size: 2 })).toThrow();
    expect(() => previewHumanBase(spec, { ...fixed, build: 'tall' })).toThrow();
  });
  it('uses floor, minimum 1 and the published Defense/Perception caps with explicit numeric references', () => {
    const healing = spec.rules.find((r: { target: string }) => r.target === 'healingRate');
    expect(evaluateBaseRule(healing, { health: 11 })).toBe(2);
    expect(evaluateBaseRule(healing, { health: 12 })).toBe(3);
    expect(evaluateBaseRule(healing, { health: 3 })).toBe(1);
    expect(evaluateBaseRule(spec.rules.find((r: { target: string }) => r.target === 'defense'), { agility: 40 })).toBe(25);
    expect(evaluateBaseRule(spec.rules.find((r: { target: string }) => r.target === 'perception'), { intellect: 40 })).toBe(25);
    expect(() => evaluateBaseRule(healing, {})).toThrow(/Missing numeric/);
    expect(() => evaluateBaseRule({ ...healing, formula: { op: 'eval', code: '1+1' } }, {})).toThrow();
  });
  it('keeps publication-specific languages, explicit inheritance, Size choice and all future/table effects outside the base', () => {
    const before = JSON.stringify({ spec, random });
    const core = previewHumanBase(spec, fixed), expanded = previewHumanBase(spec, random);
    expect(core.languageRules.additionalChoice).toBe('one-language-or-random-profession');
    expect(expanded.languageRules.additionalChoice).toBe('development-tables');
    expect(expanded.languageRules.grantedSpeech).toEqual(['Common Tongue']); expect(expanded.languageRules.grantedLiteracy).toEqual([]);
    expect(core.base.health).toBe(11); expect(core.base.power).toBe(0); expect(core.startingNamedTraits).toEqual([]);
    expect(expanded.startingNamedTraits).toEqual([]);
    expect(expanded.traces.find(t => t.target === 'damage')?.composition).toBe('inherited-core');
    expect(core.traces.find(t => t.target === 'damage')?.composition).toBe('direct');
    const otherSize = previewHumanBase(spec, { ...random, size: 1 });
    expect({ ...otherSize.base, size: 0.5 }).toEqual(expanded.base);
    expect(JSON.stringify({ spec, random })).toBe(before);
    expect(expanded.deferred.some(d => d.id === 'development-and-background')).toBe(true);
  });
  it('reproduces both artifacts and links every numeric rule to unchanged textual evidence without enabling the consumer', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    for (const [p, value] of first.artifacts) expect(await readFile(p, 'utf8')).toBe(value);
    const ids = new Set(file.evidence.map((e: { id: string }) => e.id));
    for (const rule of spec.rules) for (const id of rule.evidenceIds) expect(ids.has(id)).toBe(true);
    for (const e of file.evidence) {
      const bytes = readFileSync(e.path); expect(hash(bytes)).toBe(e.inputSha256);
      const excerpt = sourceLines(bytes.toString('utf8')).slice(e.startLine - 1, e.endLine).map(l => l.text).join('\n');
      expect(excerpt).toBe(e.excerpt); expect(hash(excerpt)).toBe(e.excerptSha256);
    }
    expect(file.gates).toMatchObject({ runtimeIntegrated: false, importablePack: false, stagingPromoted: false });
    expect(file.consumerSupport.referenceEvaluatorIsRuntimeHandler).toBe(false);
    expect(file.consumerSupport.requiredMissingBaseFields).toContain('healingRate');
  });
  it('rejects duplicated formula targets, forward references and merged publication identities', () => {
    const duplicate = structuredClone(spec); duplicate.rules.push(duplicate.rules[0]);
    expect(() => HumanBaseSpecSchema.parse(duplicate)).toThrow(/Duplicate/);
    const forward = structuredClone(spec); forward.rules.reverse();
    expect(() => HumanBaseSpecSchema.parse(forward)).toThrow(/out-of-order/);
    const merged = structuredClone(spec); merged.variants[1].entityId = merged.variants[0].entityId;
    expect(() => HumanBaseSpecSchema.parse(merged)).toThrow(/Distinct publication/);
  });
  it('rejects output tampering and changed evidence before writing, without changing the original or current output', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-human-ancestry-'));
    try {
      const pilot = JSON.parse(readFileSync('curation/pilot/core-level-zero.json', 'utf8'));
      const paths = new Set<string>([...file.inputRefs.map((r: { path: string }) => r.path), ...pilot.inputRefs.map((r: { path: string }) => r.path), DATA, REPORT]);
      for (const p of paths) { await mkdir(dirname(resolve(root, p)), { recursive: true }); await copyFile(p, resolve(root, p)); }
      await main(['--check'], root);
      await writeFile(resolve(root, DATA), 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/artifact changed/);
      const original = file.evidence[0].path;
      await writeFile(resolve(root, original), 'changed source\n');
      await expect(main(['--write'], root)).rejects.toThrow(/revision changed|Stale reconciliation/);
      expect(await readFile(resolve(root, DATA), 'utf8')).toBe('tampered\n');
      expect(await readFile(resolve(root, original), 'utf8')).toBe('changed source\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-human-ancestry-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  }, 30000);
});
