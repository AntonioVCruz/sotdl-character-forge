import { describe, it, expect } from 'vitest';
import 'fake-indexeddb/auto';
import demo from '../examples/demo-pack.json';
import tables from '../examples/demo-random-tables.json';
import { emptySnapshot, importPack, parsePack, registry, resolveHistoricalReference, setEnabled, validatePack, validateSnapshot } from '../packages/catalog';
import { loadSnapshot, saveSnapshot } from '../packages/catalog/storage';

const errors = (input: unknown) => validatePack(parsePack(input)).filter(d => d.severity === 'error');
describe('catálogo e proveniência', () => {
  it('normaliza fixtures, valida tabelas e não habilita ao importar', () => {
    const result = importPack(emptySnapshot(), tables);
    expect(result.diagnostics).toEqual([]);
    expect(registry(result.snapshot).size).toBe(0);
    expect(result.snapshot.packs[0].entities[0].revision).toBe('0.0.1');
  });
  it('mantém versões homônimas de publicações diferentes e impede colisões ativas', () => {
    let s = importPack(emptySnapshot(), demo).snapshot;
    const other = structuredClone(demo); other.packId = 'other'; other.source.id = 'other-source';
    other.entities.forEach(e => { e.id = `other:${e.id}`; e.sourceRef = other.source.id; });
    s = importPack(s, other).snapshot;
    for (const pack of s.packs) s = setEnabled(s, pack, true);
    expect(registry(s).size).toBe(4);
    const conflict = structuredClone(other); conflict.packId = 'conflict';
    const imported = importPack(s, conflict).snapshot;
    expect(() => setEnabled(imported, imported.packs[2], true)).toThrow('Conflito');
    expect(registry(s).size).toBe(4);
  });
  it('mantém tabelas homônimas de fontes diferentes sem mesclar seus resultados', () => {
    const other = structuredClone(tables); other.packId = 'other-tables'; other.source.id = 'other-source';
    other.entities.forEach(e => {
      e.id = `other:${e.id}`; e.sourceRef = other.source.id;
      e.outcomes.forEach(o => {
        if ('nextTableRef' in o) o.nextTableRef = `other:${o.nextTableRef}`;
      });
    });
    let s = importPack(emptySnapshot(), tables).snapshot;
    s = importPack(s, other).snapshot;
    for (const pack of s.packs) s = setEnabled(s, pack, true);
    const homonyms = [...registry(s).values()].filter(({ entity }) => entity.name === 'Demo Background (3d6)');
    expect(homonyms).toHaveLength(2);
    expect(new Set(homonyms.map(({ entity }) => entity.sourceRef)).size).toBe(2);
    expect(registry(s).size).toBe(8);
  });
  it('preserva referências históricas ao desabilitar e quando falta a fonte', () => {
    let s = importPack(emptySnapshot(), demo).snapshot;
    s = setEnabled(s, s.packs[0], true);
    const ref = { packId: demo.packId, version: demo.version, entityId: demo.entities[0].id };
    expect(resolveHistoricalReference(s, ref).warning).toBeUndefined();
    s = setEnabled(s, s.packs[0], false);
    expect(registry(s).size).toBe(0);
    expect(resolveHistoricalReference(s, ref).entity?.id).toBe(ref.entityId);
    expect(resolveHistoricalReference(s, ref).warning).toContain('desabilitada');
    expect(resolveHistoricalReference(emptySnapshot(), ref).ref).toEqual(ref);
  });
  it('rejeita substituição da mesma revisão e requer escolha explícita de versão', () => {
    const s = importPack(emptySnapshot(), demo).snapshot;
    expect(importPack(s, demo).snapshot).toBe(s);
    const changed = structuredClone(demo); changed.entities[0].name = 'changed';
    expect(() => importPack(s, changed)).toThrow('nova versão');
    changed.version = '0.0.2';
    let next = importPack(s, changed).snapshot;
    next = setEnabled(next, next.packs[0], true);
    expect(() => setEnabled(next, next.packs[1], true)).toThrow('uma versão');
  });
  it('rejeita duplicatas, fonte inválida e dados não suportados', () => {
    const dup = structuredClone(tables); dup.entities.push(dup.entities[0]);
    expect(errors(dup).some(e => e.message.includes('duplicado'))).toBe(true);
    const source = structuredClone(tables); source.entities[0].sourceRef = 'unknown';
    expect(errors(source)[0].message).toContain('sourceRef');
    const dice = structuredClone(tables); dice.entities[0].diceExpr.count = 0;
    expect(() => parsePack(dice)).toThrow();
  });
  it('rejeita lacunas curadas e overlap; retém incompletas com aviso', () => {
    const gap = structuredClone(tables); gap.entities[0].ranges[0].min = 4;
    expect(errors(gap)[0].message).toContain('lacunas');
    gap.entities[0].status = 'incomplete';
    expect(errors(gap)).toEqual([]);
    expect(importPack(emptySnapshot(), gap).diagnostics.some(d => d.message.includes('lacunas'))).toBe(true);
    const overlap = structuredClone(tables); overlap.entities[0].ranges[0].max = 9;
    expect(errors(overlap)[0].message).toContain('sobrepostos');
  });
  it('rejeita referências ausentes, cycles, ranges invertidos e outcomes duplicados', () => {
    const missing = structuredClone(tables); Object.assign(missing.entities[1].outcomes[0], { nextTableRef: 'missing' });
    expect(errors(missing)[0].message).toContain('ausente');
    const cycle = structuredClone(tables); Object.assign(cycle.entities[1].outcomes[0], { nextTableRef: cycle.entities[1].id });
    expect(errors(cycle).some(e => e.message.includes('Ciclo'))).toBe(true);
    const inverted = structuredClone(tables); inverted.entities[0].ranges[0].max = 2;
    expect(errors(inverted).some(e => e.message.includes('invertido'))).toBe(true);
    const duplicate = structuredClone(tables); duplicate.entities[0].outcomes = [...duplicate.entities[0].outcomes, duplicate.entities[0].outcomes[0]] as typeof duplicate.entities[0]['outcomes'];
    expect(errors(duplicate).some(e => e.message.includes('Outcome duplicado'))).toBe(true);
  });
  it('exige fonte autorizada e página para declarar conteúdo real curado', () => {
    const real = { ...structuredClone(tables), fictionalData: false };
    real.source.status = 'needs-review';
    expect(errors(real).some(e => e.message.includes('autorizada'))).toBe(true);
  });
  it('dependências exigem versão exata importada e habilitada', () => {
    const dependent = { ...structuredClone(demo), dependencies: [{ packId: tables.packId, version: tables.version }] };
    expect(() => importPack(emptySnapshot(), dependent)).toThrow('Dependência ausente');
    let s = importPack(emptySnapshot(), tables).snapshot;
    s = importPack(s, dependent).snapshot;
    expect(() => setEnabled(s, s.packs[1], true)).toThrow('dependência');
    s = setEnabled(s, s.packs[0], true); s = setEnabled(s, s.packs[1], true);
    expect(() => setEnabled(s, s.packs[0], false)).toThrow('dependência');
  });
  it('salva snapshot atomicamente, reabre e rejeita inválido sem perder dados', async () => {
    let s = importPack(emptySnapshot(), tables).snapshot;
    s = setEnabled(s, s.packs[0], true);
    await saveSnapshot(s);
    expect(await loadSnapshot()).toEqual(s);
    const bad = structuredClone(s); bad.packs[0].entities.push(bad.packs[0].entities[0]);
    await expect(saveSnapshot(bad)).rejects.toThrow('duplicado');
    expect(await loadSnapshot()).toEqual(s);
    expect(() => validateSnapshot({ ...s, schemaVersion: 9 })).toThrow();
  });
});
