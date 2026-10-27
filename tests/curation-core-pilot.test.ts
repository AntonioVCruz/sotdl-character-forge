import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { buildArtifacts, main, steps, validateSteps, transcribeNumericRanges } from '../tools/curation/core-pilot-matrix';
import { sourceLines } from '../tools/curation/ancestry-extractor';

const path = 'curation/pilot/core-level-zero.json';
const matrix = JSON.parse(readFileSync(path, 'utf8'));
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');

describe('CUR-014 Human/Core creation evidence matrix', () => {
  it('reproduces the persisted analysis without enabling a pack, tables or mechanical certification', async () => {
    const first = await buildArtifacts(process.cwd()), second = await buildArtifacts(process.cwd());
    expect([...first.artifacts]).toEqual([...second.artifacts]);
    expect(first.matrix).toEqual(matrix);
    expect(first.matrix.gates).toEqual({ importablePack: false, officialGenerationEnabled: false, mechanicalCertification: false, originalInputsModified: false, stagingPromoted: false });
    expect(first.matrix.targetLevel).toBe(0);
    expect(first.matrix.ancestryInventoryId).toBe('ancestries:human-shadow-of-the-demon-lord-core');
    for (const [file, expected] of first.artifacts) expect(await readFile(file, 'utf8')).toBe(expected);
  });
  it('locates every justification in the exact transcript revision and retains quarantine as quarantine', () => {
    const evidenceIds: string[] = [];
    for (const e of matrix.evidence) {
      const bytes = readFileSync(e.path); expect(sha(bytes)).toBe(e.inputSha256);
      const excerpt = sourceLines(bytes.toString('utf8')).slice(e.startLine - 1, e.endLine).map(l => l.text).join('\n');
      expect(excerpt).toBe(e.excerpt); expect(sha(excerpt)).toBe(e.excerptSha256); expect(excerpt).toContain(e.anchor);
      expect(matrix.sourceIds).toContain(e.sourceId); evidenceIds.push(e.id);
    }
    expect(validateSteps(matrix.steps, evidenceIds)).toHaveLength(28);
    const router = matrix.evidence.find((e: { id: string }) => e.id === 'profession-router');
    expect(router.inventoryRefs).toContainEqual(expect.objectContaining({ id: 'mechanics:u000005', state: 'quarantined', entityId: null }));
    expect(matrix.steps.find((s: { id: string }) => s.id === 'wealth').pending).toEqual([]);
    const narrative = matrix.steps.filter((s: { id: string }) => /^(background|human-(age|build|appearance|religion|personality))$/.test(s.id));
    expect(narrative).toHaveLength(6);
    expect(narrative.every((s: { evidenceIds: string[]; pending: string[] }) => s.evidenceIds.includes('ancestry-table-options') && s.pending.length === 0)).toBe(true);
    const adjustment = matrix.steps.find((s: { id: string }) => s.id === 'general-adjustment');
    expect(adjustment.kind).toBe('choice'); expect(adjustment.certainty).toBe('conditional'); expect(adjustment.pending).toEqual([]);
    expect(adjustment.evidenceIds).toContain('general-scores');
    expect(matrix.steps.find((s: { id: string }) => s.id === 'base-stats').dependsOn).toContain('general-adjustment');
  });
  it('rejects unsupported evidence, cyclic or missing dependencies, duplicate steps and hidden cardinality gaps', () => {
    const ids = matrix.evidence.map((e: { id: string }) => e.id);
    expect(() => validateSteps(steps, ids.filter((id: string) => id !== 'human-stats'))).toThrow(/Missing step evidence/);
    const cycle = structuredClone(steps); cycle[0].dependsOn = ['future-gains'];
    expect(() => validateSteps(cycle, ids)).toThrow(/dependency/);
    expect(() => validateSteps([...steps, steps[0]], ids)).toThrow(/Duplicate/);
    const hidden = structuredClone(steps); hidden.find(s => s.id === 'wealth')!.certainty = 'not-demonstrated'; hidden.find(s => s.id === 'wealth')!.pending = [];
    expect(() => validateSteps(hidden, ids)).toThrow(/explicit pending/);
  });
  it('keeps the language sidebar open-ended and does not grant literacy or pretend supplemental text was in the reconciled corpus', () => {
    expect(matrix.languageScope.namedLanguages).toEqual(['Common Tongue', 'Dark Speech', 'Dwarfish', 'Elvish', 'High Archaic', 'Trollish']);
    expect(matrix.languageScope.openCategories.map((c: { label: string }) => c.label)).toEqual(['Secret Language', 'Dead Languages']);
    expect(matrix.languageScope).toMatchObject({ exhaustive: false, automaticLiteracy: false, importedCatalogEntities: false });
    expect(matrix.languageScope.acquisition).toMatchObject({ defaultGrant: 'speak-only', literacyGrant: 'explicit-only',
      explicitGrantTargets: ['new-language', 'previously-known-language'], professionExchangeCap: null, tableRestrictions: 'out-of-application-scope' });
    const supplementary = matrix.evidence.filter((e: { medium: string }) => e.medium === 'text');
    expect(supplementary).toHaveLength(27);
    expect(supplementary.every((e: { inventoryRefs: unknown[]; declaredPagination: null }) => e.inventoryRefs.length === 0 && e.declaredPagination === null)).toBe(true);
    const introduction = matrix.supplement.files.find((f: { path: string }) => f.path.endsWith('/introduction.txt'));
    expect(introduction.sha256).toBe('51524877da4e81c6146392d35f4fdca222e6e0b4ff9b7507b0e93c6bcb43f9ef');
  });
  it('covers each of the 120 d6-to-d20 profession face pairs and retains weighted ranges, inner choices and literacy text', () => {
    const p = matrix.professionScope;
    expect(p).toMatchObject({ selectorDice: { count: 1, sides: 6 }, detailDice: { count: 1, sides: 20 },
      numericCoverageComplete: true, rangeCount: 102, importedCatalogEntities: false, literacyHandlersImplemented: false });
    expect(p.tables.map((t: { category: string }) => t.category)).toEqual(['Academic', 'Common', 'Criminal', 'Martial', 'Religious', 'Wilderness']);
    let pairs = 0;
    for (let type = 1; type <= 6; type++) {
      const selected = p.tables.filter((t: { selectorResult: number }) => t.selectorResult === type); expect(selected).toHaveLength(1);
      for (let face = 1; face <= 20; face++) {
        expect(selected[0].ranges.filter((r: { min: number; max: number }) => r.min <= face && face <= r.max)).toHaveLength(1); pairs++;
      }
    }
    expect(pairs).toBe(120);
    expect(p.tables[3].ranges.find((r: { min: number }) => r.min === 3)).toMatchObject({ min: 3, max: 4, text: 'Guard' });
    const common = p.tables[1].ranges;
    expect(common.find((r: { min: number }) => r.min === 3).text).toContain('Choose a manufacturing trade');
    expect(common.find((r: { min: number }) => r.min === 4).text).toContain('If you choose poet or writer, you can read and write');
    expect(p.tables[4].ranges.find((r: { min: number }) => r.min === 5).text).toContain('Fanatic.');
    expect(p.tables[5].ranges.find((r: { min: number }) => r.min === 1).text).toBe('Bandit, brigand, or highway robber');
    expect(matrix.steps.find((s: { id: string }) => s.id === 'professions').pending).toEqual([]);
    expect(matrix.steps.find((s: { id: string }) => s.id === 'profession-details').pending).toEqual([]);
    expect(matrix.steps.find((s: { id: string }) => s.id === 'profession-language').pending).toEqual([]);
    expect(() => transcribeNumericRanges('1–2 Guard\n2 Other', 2)).toThrow(/gap\/overlap/);
    expect(() => transcribeNumericRanges('1 First\n3 Third', 3)).toThrow(/gap\/overlap/);
    expect(() => transcribeNumericRanges('1–4 Guard', 3)).toThrow(/Invalid/);
  });
  it('covers 120 Interesting Things face pairs and retains alternatives, side rolls, GM choices and mechanical text', () => {
    const t = matrix.interestingThingsScope;
    expect(t).toMatchObject({ initialResults: 1, selectorDice: { count: 1, sides: 6 }, detailDice: { count: 1, sides: 20 },
      numericCoverageComplete: true, rangeCount: 120, importedCatalogEntities: false, choicesFormalized: false, effectsImplemented: false });
    let pairs = 0;
    for (let table = 1; table <= 6; table++) {
      const selected = t.tables.filter((r: { selectorResult: number }) => r.selectorResult === table); expect(selected).toHaveLength(1);
      expect(selected[0].ranges).toHaveLength(20);
      for (let face = 1; face <= 20; face++) {
        expect(selected[0].ranges.filter((r: { min: number; max: number }) => r.min <= face && face <= r.max)).toHaveLength(1); pairs++;
      }
    }
    expect(pairs).toBe(120);
    const row = (table: number, face: number) => t.tables[table - 1].ranges.find((r: { min: number }) => r.min === face).text;
    expect(row(2, 13)).toContain('1d20 iron nails'); expect(row(2, 17)).toContain('1d6 + 1 brushes');
    expect(row(3, 7)).toContain('Half a treasure map');
    expect(row(3, 17)).toContain('3d6 teeth'); expect(row(3, 17)).toContain('or 1d6 severed heads');
    expect(row(3, 8)).toContain('GM’s choice'); expect(row(5, 10)).toContain('GM’s choice');
    expect(row(4, 2)).toContain('1 boon on rolls to sneak or a gray cloak');
    expect(row(5, 3)).toContain('2d20 pockets'); expect(row(5, 11)).toContain('1d6 + 1 pinches');
    expect(row(6, 17)).toContain('not cumulative with other armor');
    expect(matrix.steps.find((s: { id: string }) => s.id === 'interesting-thing').pending).toEqual([]);
    expect(matrix.steps.find((s: { id: string }) => s.id === 'thing-effects').pending.length).toBeGreaterThan(0);
    const originalRouter = matrix.evidence.find((e: { id: string }) => e.id === 'thing-router');
    expect(originalRouter.inventoryRefs).toContainEqual(expect.objectContaining({ id: 'mechanics:u000024', state: 'quarantined', entityId: null }));
  });
  it('allows generic editable kit items without a spell selection, collapsing grants or inventing mechanics', () => {
    expect(matrix.creationDecisions.decisions.inventory).toMatchObject({ policy: 'generic-editable-items',
      fixedItemLabel: 'Item fixo', rankZeroIncantationLabel: 'Incantation de rank 0', userMayRenameAndDescribe: true,
      detailsRequiredAtCreation: false, preserveSourceAndQuantities: true, collapseDistinctGrants: false,
      incantationRequiresSpellAtCreation: false, incantationTeachesSpell: false, inferMechanicalBonusesFromLabel: false });
    const kit = matrix.steps.find((s: { id: string }) => s.id === 'kit-options');
    expect(kit.pending).toEqual([]); expect(kit.certainty).toBe('product-policy');
    expect(kit.followUps).not.toContain('CUR-025');
    const original = matrix.evidence.find((e: { id: string }) => e.id === 'kit-high');
    expect(original.excerpt).toContain('three horses with saddles');
    expect(original.excerpt).toContain('GM’s choice');
    expect(matrix.steps.find((s: { id: string }) => s.id === 'thing-effects').pending.length).toBeGreaterThan(0);
  });
  it('prefers expansion tables while preserving Core and lets players choose fixed or random published attributes', () => {
    const p = matrix.ancestryExpansionScope;
    expect(p.policy).toMatchObject({ mechanics: 'incorporate-applicable-published-expansion', tableDefault: 'supplement-when-applicable',
      preserveCoreTables: true, coreTablesSelectable: true, attributeMode: 'player-choice-when-published',
      fixedAndRandomMutuallyExclusive: true, defaultAttributeMode: null, preserveSourceVersions: true, duplicateBenefitsStack: false });
    expect(p.base.entityId).toBe('sotdl:shadow-of-the-demon-lord-core:ancestry:human:default');
    expect(p.expansion.entityId).toBe('sotdl:only-human:ancestry:human:variant');
    expect(p.tableProcedures.preferred).toMatchObject({ sourceId: 'sotdl:only-human', requiresAllDevelopmentTables: true,
      requiresRolledResults: true, independentOfAttributeVariant: true, replacesCoreGeneration: ['random-starting-professions', 'starting-wealth'] });
    expect(p.tableProcedures.alternative).toMatchObject({ sourceId: matrix.sourceId, selectable: true });
    expect(p.attributeOptions).toMatchObject({ playerChoice: true, defaultMode: null, mutuallyExclusive: true,
      fixed: { scores: [10, 10, 10, 10], increaseOneAttributeBy: 1 },
      random: { perAttribute: { base: 8, dice: { count: 1, sides: 3 } }, independentRolls: 4, fixedBranchIncreaseApplies: false } });
    expect(p.levelFour).toMatchObject({ appliesAtLevelZero: false, duplicateHealthGainStacks: false, preserveTalentTextDifferences: true });
    expect(p.variantLanguageBenefits.stackBranches).toBe(false);
    expect(p).toMatchObject({ publicationInstancesMerged: false, importedCatalogEntities: false, expandedProcedureFormalized: false });
    for (const id of p.expansion.evidenceIds) {
      const e = matrix.evidence.find((e: { id: string }) => e.id === id);
      expect(e.sourceId).toBe('sotdl:only-human');
      expect(e.inventoryRefs).toContainEqual(expect.objectContaining({ id: 'ancestries:human-only-human', state: 'captured', entityId: p.expansion.entityId }));
    }
  });
  it('keeps Size independent of Build, roleplaying optional and all 216 wealth rolls covered exactly once', () => {
    const decisions = matrix.creationDecisions.decisions;
    expect(decisions.authority).toBe('explicit-user-instruction');
    expect(decisions.size).toMatchObject({ default: 'ancestry-independent-of-build', exception: 'explicit-table-or-rule-only' });
    expect(matrix.steps.find((s: { id: string }) => s.id === 'size').dependsOn).not.toContain('human-build');
    expect(decisions.roleplaying).toMatchObject({ policy: 'optional-free-text', requiredAnswers: 0, minimumSecrets: 0, requiresGMSharing: false });
    expect(decisions.roleplaying.fields).toHaveLength(4);
    expect(decisions.roleplaying.fields.every((f: { required: boolean }) => !f.required)).toBe(true);
    expect(matrix.steps.find((s: { id: string }) => s.id === 'roleplaying').pending).toEqual([]);
    const supplied = matrix.evidence.find((e: { id: string }) => e.id === 'supplied-starting-equipment');
    expect(supplied.excerpt).toContain('roll and total 3d6');
    expect(supplied.excerpt).toContain('1d6 ss'); expect(supplied.excerpt).toContain('2d6 ss');
    expect(matrix.steps.find((s: { id: string }) => s.id === 'wealth').pending).toEqual([]);
    expect(matrix.wealthScope).toMatchObject({ dice: { count: 3, sides: 6 }, mappingComplete: true, importedCatalogEntities: false, kitsFormalized: false });
    const counts: Record<string, number> = {};
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) {
      const matches = matrix.wealthScope.ranges.filter((r: { min: number; max: number }) => r.min <= a + b + c && r.max >= a + b + c);
      expect(matches).toHaveLength(1); counts[matches[0].lifestyle] = (counts[matches[0].lifestyle] ?? 0) + 1;
    }
    expect(counts).toEqual({ Destitute: 4, Poor: 52, 'Getting By': 125, Comfortable: 31, Wealthy: 3, Rich: 1 });
  });
  it('rejects changed input and a tampered matrix without overwriting the evidence or output', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-core-pilot-'));
    try {
      for (const ref of [...matrix.inputRefs, { path }]) {
        await mkdir(dirname(resolve(root, ref.path)), { recursive: true }); await copyFile(ref.path, resolve(root, ref.path));
      }
      await main(['--check'], root);
      await writeFile(resolve(root, path), 'tampered\n');
      await expect(main(['--check'], root)).rejects.toThrow(/Pilot artifact changed/);
      const supplied = matrix.supplement.files[0].path;
      const suppliedBytes = await readFile(resolve(root, supplied));
      await writeFile(resolve(root, supplied), 'changed user transcript\n');
      await expect(main(['--write'], root)).rejects.toThrow(/Supplement evidence revision changed/);
      expect(await readFile(resolve(root, path), 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, supplied), suppliedBytes);
      const decisionFile = matrix.creationDecisions.path;
      const originalDecisions = await readFile(resolve(root, decisionFile));
      const changed = JSON.parse(originalDecisions.toString('utf8')); changed.roleplaying.requiredAnswers = 1;
      await writeFile(resolve(root, decisionFile), JSON.stringify(changed));
      await expect(main(['--write'], root)).rejects.toThrow();
      expect(await readFile(resolve(root, path), 'utf8')).toBe('tampered\n');
      const capped = JSON.parse(originalDecisions.toString('utf8')); capped.languages.professionExchangeCap = 1;
      await writeFile(resolve(root, decisionFile), JSON.stringify(capped));
      await expect(main(['--write'], root)).rejects.toThrow();
      const automaticLiteracy = JSON.parse(originalDecisions.toString('utf8')); automaticLiteracy.languages.defaultGrant = 'speak-read-write';
      await writeFile(resolve(root, decisionFile), JSON.stringify(automaticLiteracy));
      await expect(main(['--write'], root)).rejects.toThrow();
      expect(await readFile(resolve(root, path), 'utf8')).toBe('tampered\n');
      await writeFile(resolve(root, decisionFile), originalDecisions);
      const original = matrix.evidence[0].path;
      await writeFile(resolve(root, original), 'changed input\n');
      await expect(main(['--write'], root)).rejects.toThrow(/Stale reconciliation dependency|revision changed/);
      expect(await readFile(resolve(root, path), 'utf8')).toBe('tampered\n');
      expect(await readFile(resolve(root, original), 'utf8')).toBe('changed input\n');
    } finally {
      if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-core-pilot-')) throw new Error('Unexpected scratch directory');
      await rm(root, { recursive: true, force: true });
    }
  }, 30000);
});
