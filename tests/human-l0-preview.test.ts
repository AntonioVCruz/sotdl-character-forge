import { readFileSync } from 'node:fs';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportCharacter, newCharacter } from '../packages/character-generator';
import { calculateHumanL0Character, exportHumanL0Character, newHumanL0Character } from '../packages/character-generator/runtime';
import { loadCharacter, loadHumanL0Character, saveCharacter } from '../packages/character-generator/storage';
import { parseHumanL0MechanicalPacks } from '../packages/curation/human-l0-mechanics';
import * as random from '../packages/random-tables';
import { parseChoiceSlotProps } from '../apps/web/choice-slot-contract';
import { humanL0StepLabel, projectHumanL0Slots, proposeHumanL0Slot } from '../apps/web/human-l0-slots';
import {
  HUMAN_L0_FIXTURE_CHARACTER_ID,
  HUMAN_L0_FIXTURE_PREVIEW_ENABLED,
  isHumanL0Route,
  blocksForOpenedFixture,
  buildFixtureSelection,
  classifyHumanL0Surface,
  commitHumanL0Import,
  confirmHumanL0Preview,
  defaultFixtureSelectionInput,
  describeFixtureCatalog,
  humanL0FixturePacks,
  humanL0PersistenceKey,
  humanL0SheetModel,
  previewHumanL0,
  readHumanL0Fixture,
  resetHumanL0FixtureCharacter,
  stageHumanL0Import,
  type HumanL0Preview,
} from '../apps/web/human-l0-preview';

function packs() {
  return humanL0FixturePacks();
}

function input(patch: Partial<ReturnType<typeof defaultFixtureSelectionInput>> = {}) {
  return { ...defaultFixtureSelectionInput(), ...patch };
}

async function openedPreview(): Promise<HumanL0Preview> {
  const built = buildFixtureSelection(packs(), input());
  if (!built.ok) throw new Error(built.blocks.map(block => block.code).join(','));
  const preview = await previewHumanL0(null, packs(), { type: 'create', selection: built.selection, name: 'Ada' });
  if (!preview.ok) throw new Error(preview.blocks.map(block => block.code).join(','));
  return preview;
}

beforeEach(() => vi.stubGlobal('indexedDB', new IDBFactory()));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Human L0 UI contract', () => {
  it('keeps fixture, local preview and official generation distinct', () => {
    const fixture = classifyHumanL0Surface('fixture', packs());
    expect(fixture).toMatchObject({ data: 'fixture', mode: 'local-preview', officialGenerationEnabled: false, blocks: [] });
    expect(classifyHumanL0Surface('local-preview', packs())).toMatchObject({
      data: null, mode: null, officialGenerationEnabled: false,
    });
    expect(classifyHumanL0Surface('local-preview', packs()).blocks[0]?.code).toBe('local-preview-channel-closed');
    const official = classifyHumanL0Surface('official', packs());
    expect(official).toMatchObject({ data: null, mode: null, officialGenerationEnabled: false });
    expect(official.blocks[0]?.code).toBe('official-generation-disabled');
    expect(HUMAN_L0_FIXTURE_PREVIEW_ENABLED).toBe(true);
    expect(isHumanL0Route('#/human-l0')).toBe(true);
    expect(isHumanL0Route('#human-l0')).toBe(true);
    expect(isHumanL0Route('#/human-l0/reserved')).toBe(true);
    expect(isHumanL0Route('')).toBe(false);
    for (const path of ['apps/web/human-l0-preview.ts', 'apps/web/HumanL0FixturePreview.tsx', 'apps/web/main.tsx']) {
      const source = readFileSync(path, 'utf8');
      expect(source).not.toMatch(/MAGIC_PATH|demoSlot|demoLevel/);
      expect(source).not.toMatch(/officialGenerationEnabled\s*[:=]\s*true/);
    }
  });

  it('uses the human-l0/<id> key and only the fixture character id', () => {
    expect(humanL0PersistenceKey(HUMAN_L0_FIXTURE_CHARACTER_ID)).toBe('human-l0/fixture-preview');
    expect(humanL0PersistenceKey('fixture-preview')).not.toBe('character');
    expect(readFileSync('packages/character-generator/human-l0-storage.ts', 'utf8')).toContain('human-l0/${id}');
    expect(() => humanL0PersistenceKey('a/b')).toThrow('persistence-id-invalid');
  });

  it('refuses packs that are not fictional fixtures without enabling official generation', () => {
    const parsed = parseHumanL0MechanicalPacks(packs());
    expect(parsed.every(pack => pack.fictionalData)).toBe(true);
    parsed[0].fictionalData = false;
    expect(blocksForOpenedFixture(parsed)[0]?.code).toBe('fixture-required');
    const mislabeled = packs() as { fictionalData: boolean }[];
    mislabeled[0].fictionalData = false;
    mislabeled[1].fictionalData = false;
    const surface = classifyHumanL0Surface('fixture', mislabeled);
    expect(surface.officialGenerationEnabled).toBe(false);
    expect(surface.data).toBeNull();
    expect(surface.blocks[0]?.code).toBe('source-fictional-mismatch');
  });

  it('shows engine scores and structured gaps without copying Health, Defense or Speed', async () => {
    const preview = await openedPreview();
    expect(preview.confirmed).toBe(false);
    expect(preview.view.officialGenerationEnabled).toBe(false);
    expect(preview.view.fullyResolved).toBe(false);
    expect(preview.view.stats?.health).toEqual(expect.any(Number));
    const health = preview.model.fields.find(field => field.key === 'health');
    const defense = preview.model.fields.find(field => field.key === 'defense');
    const speed = preview.model.fields.find(field => field.key === 'speed');
    expect(health).toMatchObject({ status: 'value', value: preview.view.stats?.health });
    expect(defense).toMatchObject({ status: 'value', value: preview.view.stats?.defense });
    expect(speed).toMatchObject({ status: 'value', value: preview.view.stats?.speed });
    expect(preview.model.fields.find(field => field.key === 'strength')).toMatchObject({ status: 'value', value: preview.view.stats?.strength });
    expect(preview.model.fields.find(field => field.key === 'professions')).toMatchObject({ status: 'pending' });
    expect(preview.model.fields.find(field => field.key === 'print')).toMatchObject({ status: 'indisponível' });
    expect(preview.model.fields.find(field => field.key === 'wealth')?.status).toBe('pending');
    expect(preview.model.issues.map(issue => issue.code)).toEqual(expect.arrayContaining([
      'local-preview-only', 'procedure-outcomes-pending', 'equipment-and-table-catalog-pending', 'source-and-distribution-review-pending',
    ]));
    expect(preview.model.breakdown.some(row => row.target === 'health')).toBe(true);
    expect(preview.model.languages.every(language => language.note === 'Somente fala.')).toBe(true);
    expect(preview.model.grants.some(grant => /profissão foi gerada|Nenhuma profissão foi gerada/.test(grant.message))).toBe(true);
    expect(preview.model.persistenceKey).toBe('human-l0/fixture-preview');
    expect(preview.model.officialGenerationEnabled).toBe(false);
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toBeNull();
  });

  it('blocks an ineligible benefit or transfer before any save', async () => {
    const catalog = describeFixtureCatalog(packs());
    const core = catalog.ancestries.find(item => item.variant === 'core');
    const procedure = catalog.procedures.find(item => item.kind === 'core');
    if (!core || !procedure) throw new Error('fixture catalog incomplete');
    const missingBenefit = buildFixtureSelection(packs(), input({
      ancestryPackId: core.packId, procedurePackId: procedure.packId, size: core.sizes[0], benefit: null,
    }));
    expect(missingBenefit.ok).toBe(false);
    if (missingBenefit.ok) return;
    expect(missingBenefit.blocks[0]?.code).toBe('procedure-benefit-conflict');
    const sameAttribute = buildFixtureSelection(packs(), input({ adjustment: { increase: 'strength', decrease: 'strength' } }));
    expect(sameAttribute.ok).toBe(false);
    if (sameAttribute.ok) return;
    expect(sameAttribute.blocks[0]?.code).toBe('selection-schema-invalid');
    const bad = buildFixtureSelection(packs(), input());
    if (!bad.ok) throw new Error('default selection should be eligible');
    const selection = structuredClone(bad.selection);
    selection.size = 99;
    const refused = await previewHumanL0(null, packs(), { type: 'create', selection, name: '' });
    expect(refused.ok).toBe(false);
    if (refused.ok) return;
    expect(refused.blocks[0]?.code).toBe('unsupported-size');
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toBeNull();
    expect(await loadHumanL0Character()).toBeNull();
  });

  it('confirms only after replaying the command and leaves the demo character alone', async () => {
    const demo = newCharacter();
    await saveCharacter(demo, demo);
    const preview = await openedPreview();
    const before = JSON.stringify(preview.character);
    const saved = await confirmHumanL0Preview(null, packs(), preview);
    expect(saved.ok).toBe(true);
    if (!saved.ok) return;
    expect(saved.phase).toBe('confirmed');
    expect(JSON.stringify(saved.character)).toBe(before);
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toEqual(saved.character);
    expect(await loadHumanL0Character()).toBeNull();
    expect(await loadCharacter()).toEqual(demo);
    const exported = exportHumanL0Character(saved.character);
    expect(exported).not.toMatch(/"mechanics"|"evidence"|"officialGenerationEnabled": true/);
    const staged = await stageHumanL0Import(exported, packs());
    expect(staged.ok).toBe(true);
    if (!staged.ok) return;
    const replaced = await commitHumanL0Import(saved.character, packs(), staged.character);
    expect(replaced.ok).toBe(true);
    expect(await loadCharacter()).toEqual(demo);
  });

  it('refuses a stale preview, a demo file and the engine default id', async () => {
    const preview = await openedPreview();
    const saved = await confirmHumanL0Preview(null, packs(), preview);
    if (!saved.ok) throw new Error('confirm failed');
    const catalog = describeFixtureCatalog(packs());
    const core = catalog.ancestries.find(item => item.variant === 'core');
    const procedure = catalog.procedures.find(item => item.kind === 'core');
    if (!core || !procedure) throw new Error('fixture catalog incomplete');
    const built = buildFixtureSelection(packs(), input({
      ancestryPackId: core.packId,
      procedurePackId: procedure.packId,
      size: core.sizes[0],
      benefit: { kind: 'speak-language', languageId: 'fixture-other' },
    }));
    if (!built.ok) throw new Error(built.blocks[0]?.code);
    const proposal = await previewHumanL0(saved.character, packs(), { type: 'select', selection: built.selection });
    if (!proposal.ok) throw new Error(proposal.blocks[0]?.code);
    const rolled = await previewHumanL0(saved.character, packs(), { type: 'roll-attributes', seed: 'fixture-seed' });
    if (!rolled.ok) throw new Error(rolled.blocks[0]?.code);
    const stale = await confirmHumanL0Preview(rolled.character, packs(), proposal);
    expect(stale.ok).toBe(false);
    if (stale.ok) return;
    expect(stale.blocks[0]?.code).toBe('preview-stale');
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toEqual(saved.character);
    const demoFile = await stageHumanL0Import(exportCharacter(newCharacter()), packs());
    expect(demoFile.ok).toBe(false);
    if (demoFile.ok) return;
    expect(demoFile.blocks[0]?.code).toBe('file-invalid');
    const other = await newHumanL0Character(built.selection, packs(), { id: 'local-human-l0', name: '' });
    const foreign = await stageHumanL0Import(exportHumanL0Character(other), packs());
    expect(foreign.ok).toBe(false);
    if (foreign.ok) return;
    expect(foreign.blocks[0]?.code).toBe('unexpected-character-id');
    expect(await loadHumanL0Character()).toBeNull();
  });

  it('suspends a changed source without inventing scores and replays rolls without a new draw on calculate', async () => {
    const draw = vi.spyOn(random, 'createSubstream');
    const preview = await openedPreview();
    const saved = await confirmHumanL0Preview(null, packs(), preview);
    if (!saved.ok) throw new Error('confirm failed');
    draw.mockClear();
    const rolled = await previewHumanL0(saved.character, packs(), { type: 'roll-attributes', seed: 'fixture-seed' });
    expect(rolled.ok).toBe(true);
    if (!rolled.ok) return;
    expect(draw).toHaveBeenCalledTimes(4);
    expect(rolled.model.fields.find(field => field.key === 'strength')?.status).toBe('value');
    const confirmed = await confirmHumanL0Preview(saved.character, packs(), rolled);
    expect(confirmed.ok).toBe(true);
    if (!confirmed.ok) return;
    expect(JSON.stringify(confirmed.character)).toBe(JSON.stringify(rolled.character));
    draw.mockClear();
    expect(await calculateHumanL0Character(confirmed.character, packs())).toEqual(rolled.view);
    expect(draw).not.toHaveBeenCalled();
    const changed = packs() as { version: string }[];
    changed[0].version = '9.0.0';
    const suspended = humanL0SheetModel(await calculateHumanL0Character(confirmed.character, changed), confirmed.character.id);
    expect(suspended.baseResolved).toBe(false);
    expect(suspended.issues.some(issue => issue.code === 'source-or-selection-unavailable')).toBe(true);
    expect(suspended.fields.find(field => field.key === 'strength')).toMatchObject({ status: 'indisponível' });
    expect(suspended.fields.find(field => field.key === 'strength')).not.toHaveProperty('value');
    expect(suspended.fields.find(field => field.key === 'health')).not.toHaveProperty('value');
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toEqual(confirmed.character);
  });

  it('maps the engine selection onto ChoiceSlot props and leaves later steps pending', async () => {
    const empty = projectHumanL0Slots(packs(), { baseline: null, preview: null, previewSlotId: null, refusal: null, locks: [], seed: '' });
    for (const slot of empty) expect(() => parseChoiceSlotProps(slot)).not.toThrow();
    expect(empty.find(slot => slot.slotId === 'source')?.options.find(option => option.id === 'official')).toMatchObject({ eligible: false });
    for (const id of ['professions', 'languages', 'wealth', 'kit', 'interesting-thing', 'equipment']) {
      const slot = empty.find(item => item.slotId === id);
      expect(slot).toMatchObject({ uiState: 'pending', strategy: 'pending', options: [] });
      expect(slot?.contextLine).toContain('#34/#35');
    }
    const ancestry = empty.find(slot => slot.slotId === 'ancestry');
    const proposal = await proposeHumanL0Slot(null, packs(), 'ancestry', [ancestry?.options[0]?.id ?? ''], '');
    expect(proposal.ok).toBe(true);
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toBeNull();
    const reserved = await proposeHumanL0Slot(null, packs(), 'professions', [], '');
    expect(reserved.ok).toBe(false);
    if (reserved.ok) return;
    expect(reserved.blocks[0]?.code).toBe('awaiting-later-issue');
    const professions = empty.find(slot => slot.slotId === 'professions');
    expect(professions?.useReason).toBe(reserved.blocks[0]?.message);
    const keys = (await openedPreview()).model.fields.map(field => field.key);
    expect(new Set(keys).size).toBe(keys.length);
    const randomPick = await proposeHumanL0Slot(null, packs(), 'attribute-mode', ['random'], '');
    expect(randomPick.ok).toBe(false);
    if (randomPick.ok) return;
    expect(randomPick.blocks[0]?.code).toBe('use-roll-attributes');
    const saved = await confirmHumanL0Preview(null, packs(), await openedPreview());
    if (!saved.ok) throw new Error('confirm failed');
    const filled = projectHumanL0Slots(packs(), { baseline: saved.character, preview: null, previewSlotId: null, refusal: null, locks: [], seed: 'fixture-seed' });
    for (const slot of filled) expect(() => parseChoiceSlotProps(slot)).not.toThrow();
    expect(filled.find(slot => slot.slotId === 'ancestry')?.uiState).toBe('confirmed');
    expect(filled.find(slot => slot.slotId === 'attribute-roll')?.sortReason).toBeUndefined();
    expect(humanL0StepLabel(empty, 'reserved')).toBe('pendente');
    expect(humanL0StepLabel(empty, 'ancestry')).toBe('vazio');
    expect(humanL0StepLabel(filled, 'ancestry')).toBe('completo');
  });

  it('keeps a saved Human L0 history when packs are missing and does not clear the demo sheet', async () => {
    const demo = newCharacter();
    await saveCharacter(demo, demo);
    const saved = await confirmHumanL0Preview(null, packs(), await openedPreview());
    if (!saved.ok) throw new Error('confirm failed');
    const opened = await readHumanL0Fixture([], saved.character);
    expect(opened.character?.events).toEqual(saved.character.events);
    expect(opened.model?.baseResolved).toBe(false);
    expect(opened.model?.issues.some(issue => issue.code === 'source-or-selection-unavailable')).toBe(true);
    expect(opened.model?.fields.find(field => field.key === 'health')).toMatchObject({ status: 'indisponível' });
    expect(opened.model?.officialGenerationEnabled).toBe(false);
    await resetHumanL0FixtureCharacter();
    expect(await loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID)).toBeNull();
    expect(await loadCharacter()).toEqual(demo);
  });
});
