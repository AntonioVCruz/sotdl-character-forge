import fixtureJson from '../../curation/examples/human-l0-mechanics.synthetic.json';
import {
  calculateHumanL0Character,
  exportHumanL0Character,
  HumanL0ManualEffectSchema,
  importHumanL0Character,
  newHumanL0Character,
  parseHumanL0Character,
  performHumanL0Command,
  type HumanL0Character,
  type HumanL0Command,
  type HumanL0Stats,
  type HumanL0View,
} from '../../packages/character-generator/runtime';
import { loadHumanL0Character, saveHumanL0Character } from '../../packages/character-generator/storage';
import {
  HUMAN_L0_CONTRACT,
  HUMAN_L0_CONTRACT_VERSION,
  HumanL0ContractError,
  parseHumanL0MechanicalPacks,
  parseHumanL0Selection,
  type HumanL0MechanicalPack,
  type HumanL0Selection,
} from '../../packages/curation/human-l0-mechanics';

export type { HumanL0Character, HumanL0View };

/** Mounts the fixture section only. It does not enable official generation. */
export const HUMAN_L0_FIXTURE_PREVIEW_ENABLED = true as const;

export const HUMAN_L0_PERSISTENCE_TYPE = 'human-l0' as const;
/** Separate from the engine default `local-human-l0` and from the demo key `character`. */
export const HUMAN_L0_FIXTURE_CHARACTER_ID = 'fixture-preview';
export const FIXTURE_EXTRA_LANGUAGE_ID = 'fixture-other';
export const FIXTURE_PROFESSION_EVENT_ID = 'fixture-preview-profession';

const ATTRIBUTES = ['strength', 'agility', 'intellect', 'will'] as const;
export type HumanAttribute = (typeof ATTRIBUTES)[number];

export type HumanL0ChannelRequest = 'fixture' | 'local-preview' | 'official';
export type HumanL0Block = { code: string; message: string };
export type HumanL0Refusal = { ok: false; blocks: HumanL0Block[] };
export type HumanL0Surface = {
  requested: HumanL0ChannelRequest;
  data: 'fixture' | null;
  mode: 'local-preview' | null;
  officialGenerationEnabled: false;
  blocks: HumanL0Block[];
};

export type HumanL0Field = {
  key: string;
  label: string;
  status: 'value' | 'indisponível' | 'pending';
  value?: number;
  reason?: string;
};

export type HumanL0SheetModel = {
  data: 'fixture';
  mode: 'local-preview';
  officialGenerationEnabled: false;
  fullyResolved: false;
  baseResolved: boolean;
  banner: string[];
  persistenceType: typeof HUMAN_L0_PERSISTENCE_TYPE;
  persistenceKey: string;
  fields: HumanL0Field[];
  issues: { code: string; message: string }[];
  grants: { kind: string; count?: number; status: 'pending'; message: string }[];
  languages: { languageId: string; abilities: string; note: string }[];
  breakdown: HumanL0View['breakdown'];
};

const MESSAGES: Record<string, string> = {
  'official-generation-disabled': 'Geração oficial permanece desligada. O ruleset não foi habilitado.',
  'local-preview-channel-closed': 'Esta entrada não abre packs de prévia local fora da fixture pública. A geração oficial continua desligada.',
  'fixture-required': 'Esta entrada só aceita fixtures com fictionalData true.',
  'seed-required': 'Informe uma seed para rolar atributos. O protótipo não inventa seed.',
  'nothing-to-update': 'Confirme uma ficha da fixture antes deste comando.',
  'already-confirmed': 'Já existe ficha confirmada. A próxima prévia altera a seleção, sem criar outro personagem.',
  'preview-stale': 'A prévia não corresponde mais à ficha confirmada. Gere a prévia de novo. Nada foi gravado.',
  'unexpected-character-id': 'Esta entrada só grava o personagem human-l0/fixture-preview. A ficha demo não foi substituída.',
  'concurrent-change': 'A ficha mudou em outro contexto. A prévia não foi gravada.',
  'name-too-long': 'O nome passa de 200 caracteres. Nada foi gravado.',
  'selection-schema-invalid': 'A seleção não fecha o contrato.',
  'selection-reference-missing': 'Ancestry ou procedimento não está na fixture carregada.',
  'unsupported-size': 'Size fora das opções da fixture.',
  'unsupported-or-inconsistent-random-mode': 'Modo aleatório indisponível ou inconsistente para esta fonte.',
  'selection-score-out-of-bounds': 'A seleção fica fora dos limites declarados pela fixture.',
  'procedure-benefit-conflict': 'O benefício só é elegível no par Core com procedimento Core da fixture.',
  'additional-language-already-granted': 'Esse idioma já é a fala base da fixture.',
  'source-fictional-mismatch': 'A fonte não pode ser tratada como fixture fictícia nem como pack oficial nesta entrada.',
  'schema-invalid': 'Pack fora do contrato mecânico.',
  'command-invalid': 'Comando recusado pelo motor.',
  'random-mode-unavailable': 'Este ancestry da fixture não oferece modo aleatório.',
  'source-context-unresolved': 'A fonte da ficha não fecha. O comando não foi aplicado.',
  'character-invalid': 'Ficha Human L0 inválida. Nada foi substituído.',
  'file-invalid': 'Arquivo inválido. Nenhum dado foi substituído.',
  'file-too-large': 'Arquivo grande demais. Nenhum dado foi substituído.',
  'persistence-id-invalid': 'Identificador de persistência inválido.',
  'use-roll-attributes': 'O modo aleatório só entra pelo comando roll-attributes, com uma seed. Escolher a opção não sorteia.',
  'fixed-increase-unavailable': 'O aumento fixo não se aplica enquanto o modo é aleatório.',
  'selection-unchanged': 'Essa escolha já está na ficha confirmada.',
  'awaiting-later-issue': 'Aguarda #34/#35. Esta fatia não inventa opções.',
};

const ISSUE_MESSAGES: Record<string, string> = {
  'local-preview-only': 'Cálculo em prévia local. Geração oficial permanece desligada.',
  'procedure-outcomes-pending': 'Resultados de procedimento ainda pendentes.',
  'equipment-and-table-catalog-pending': 'Catálogo de equipamento e tabelas ainda pendente.',
  'source-and-distribution-review-pending': 'Revisão de fonte e distribuição ainda pendente.',
  'source-or-selection-unavailable': 'Fonte ou seleção indisponível. A ficha salva permanece legível e o cálculo fica suspenso.',
  'conflicting-manual-equipment': 'Equipamento manual conflitante. O cálculo fica suspenso.',
};

export const HUMAN_L0_MISSING_VALUE_REASON = 'Indisponível: o motor não devolveu este valor. A interface não inventa número de CUR-015.';

export const HUMAN_L0_UNSUPPORTED_FIELDS = [
  { key: 'professions', label: 'Profissões geradas', status: 'pending', reason: 'Resultado de profissão indisponível. Um direito de escolha, quando o motor o expõe, não é uma profissão gerada.' },
  { key: 'literacy', label: 'Alfabetização', status: 'indisponível', reason: 'Alfabetização indisponível. Idiomas do motor, quando existem, concedem somente fala.' },
  { key: 'wealth', label: 'Wealth', status: 'pending', reason: 'Wealth indisponível até haver catálogo e procedimento suportados.' },
  { key: 'kit', label: 'Kit inicial', status: 'pending', reason: 'Kit inicial indisponível até haver catálogo e procedimento suportados.' },
  { key: 'inventory', label: 'Inventário', status: 'pending', reason: 'Inventário indisponível nesta fatia.' },
  { key: 'equipment', label: 'Equipamento publicado', status: 'pending', reason: 'Equipamento publicado indisponível nesta fatia.' },
  { key: 'narrative', label: 'Tabelas narrativas', status: 'pending', reason: 'Tabelas narrativas indisponíveis nesta fatia.' },
  { key: 'interesting-thing', label: 'Interesting Thing', status: 'pending', reason: 'Interesting Thing indisponível nesta fatia.' },
  { key: 'notes', label: 'Notas', status: 'indisponível', reason: 'O tipo sotdl-human-l0-character não guarda notas nesta fatia.' },
  { key: 'print', label: 'Impressão, PDF e HTML autônomo', status: 'indisponível', reason: 'Formato não suportado nesta fatia.' },
] as const;

const PRESENTED: { key: keyof HumanL0Stats; label: string }[] = [
  { key: 'strength', label: 'Strength' },
  { key: 'agility', label: 'Agility' },
  { key: 'intellect', label: 'Intellect' },
  { key: 'will', label: 'Will' },
  { key: 'health', label: 'Health' },
  { key: 'defense', label: 'Defense' },
  { key: 'perception', label: 'Perception' },
  { key: 'speed', label: 'Speed' },
  { key: 'power', label: 'Power' },
  { key: 'size', label: 'Size' },
  { key: 'perception', label: 'Perception' },
  { key: 'power', label: 'Power' },
  { key: 'healingRate', label: 'Healing Rate' },
  { key: 'strengthModifier', label: 'Strength modifier' },
  { key: 'agilityModifier', label: 'Agility modifier' },
  { key: 'intellectModifier', label: 'Intellect modifier' },
  { key: 'willModifier', label: 'Will modifier' },
  { key: 'perceptionModifier', label: 'Perception modifier' },
];

const STATE_FIELDS = [
  { key: 'damage', label: 'Damage' },
  { key: 'insanity', label: 'Insanity' },
  { key: 'corruption', label: 'Corruption' },
] as const;

function message(code: string): string {
  return MESSAGES[code] ?? `Motivo do motor: ${code}.`;
}

function block(code: string): HumanL0Block {
  return { code, message: message(code) };
}

function refusal(code: string): HumanL0Refusal {
  return { ok: false, blocks: [block(code)] };
}

function blockFrom(error: unknown): HumanL0Block {
  if (error instanceof HumanL0ContractError) return block(error.code);
  if (error instanceof Error) {
    const match = /^Human L0: ([a-z0-9-]+)\.$/.exec(error.message);
    if (match?.[1]) return block(match[1]);
    if (/another tab/i.test(error.message)) return block('concurrent-change');
  }
  return { code: 'unknown', message: 'A operação não foi concluída. Nenhum dado foi substituído.' };
}

export function humanL0Block(code: string): HumanL0Block {
  return block(code);
}

export function isHumanL0Route(hash: string): boolean {
  return HUMAN_L0_FIXTURE_PREVIEW_ENABLED && (hash === '#/human-l0' || hash === '#human-l0');
}

export function humanL0PersistenceKey(id: string): string {
  if (id.length < 1 || id.length > 200 || id.includes('/')) throw new Error('Human L0: persistence-id-invalid.');
  return `${HUMAN_L0_PERSISTENCE_TYPE}/${id}`;
}

/** Public synthetic packs only. Callers must not treat the result as an official ruleset. */
export function humanL0FixturePacks(): unknown {
  return structuredClone(fixtureJson.packs);
}

export function blocksForOpenedFixture(packs: readonly { fictionalData: boolean }[]): HumanL0Block[] {
  return packs.some(pack => pack.fictionalData !== true) ? [block('fixture-required')] : [];
}

export function classifyHumanL0Surface(requested: HumanL0ChannelRequest, packs: unknown): HumanL0Surface {
  const closed = (blocks: HumanL0Block[]): HumanL0Surface => ({
    requested, data: null, mode: null, officialGenerationEnabled: false, blocks,
  });
  if (requested === 'official') return closed([block('official-generation-disabled')]);
  if (requested === 'local-preview') return closed([block('local-preview-channel-closed')]);
  let parsed: HumanL0MechanicalPack[];
  try {
    parsed = parseHumanL0MechanicalPacks(packs);
  } catch (error) {
    return closed([blockFrom(error)]);
  }
  const fixtureBlocks = blocksForOpenedFixture(parsed);
  if (fixtureBlocks.length) return closed(fixtureBlocks);
  return { requested, data: 'fixture', mode: 'local-preview', officialGenerationEnabled: false, blocks: [] };
}

export function describeHumanL0Issues(codes: readonly string[]): { code: string; message: string }[] {
  return codes.map(code => ({ code, message: ISSUE_MESSAGES[code] ?? `Pendência do motor: ${code}.` }));
}

function unresolvedReason(view: HumanL0View): string {
  return describeHumanL0Issues(view.issues)[0]?.message ?? 'Cálculo suspenso.';
}

function describeGrant(grant: HumanL0View['grants'][number]): HumanL0SheetModel['grants'][number] {
  if (grant.kind === 'starting-profession-choices') {
    return { kind: grant.kind, count: grant.count, status: 'pending', message: `Direito de escolha de profissão inicial: ${grant.count ?? 0}. Nenhuma profissão foi gerada.` };
  }
  if (grant.kind === 'pending-random-profession') {
    return { kind: grant.kind, count: grant.count, status: 'pending', message: 'Profissão aleatória pendente. Nenhum resultado foi gerado.' };
  }
  return { kind: grant.kind, count: grant.count, status: 'pending', message: `Pendência do motor: ${grant.kind}.` };
}

const SHEET_BANNER = [
  'Cálculo em prévia local. Geração oficial permanece desligada.',
  'Resultados de procedimento ainda pendentes.',
  'Catálogo de equipamento e tabelas ainda pendente.',
];

/** Numbers come only from `HumanL0View`. A null stat stays indisponível; the UI does not invent CUR-015. */
export function humanL0SheetModel(view: HumanL0View, characterId: string): HumanL0SheetModel {
  const official = (view as { officialGenerationEnabled: boolean }).officialGenerationEnabled;
  const resolved = view.baseResolved && view.stats !== null && official === false;
  const suspended = unresolvedReason(view);
  const fields: HumanL0Field[] = [];
  for (const stat of PRESENTED) {
    const value = view.stats?.[stat.key];
    if (resolved && typeof value === 'number' && Number.isFinite(value)) fields.push({ key: stat.key, label: stat.label, status: 'value', value });
    else fields.push({ key: stat.key, label: stat.label, status: 'indisponível', reason: view.stats === null ? HUMAN_L0_MISSING_VALUE_REASON : suspended });
  }
  for (const state of STATE_FIELDS) {
    const value = view.states?.[state.key];
    if (resolved && typeof value === 'number' && Number.isFinite(value)) fields.push({ key: state.key, label: state.label, status: 'value', value });
    else fields.push({ key: state.key, label: state.label, status: 'indisponível', reason: suspended });
  }
  for (const gap of HUMAN_L0_UNSUPPORTED_FIELDS) fields.push({ ...gap });
  return {
    data: 'fixture',
    mode: 'local-preview',
    officialGenerationEnabled: false,
    fullyResolved: false,
    baseResolved: resolved,
    banner: SHEET_BANNER,
    persistenceType: HUMAN_L0_PERSISTENCE_TYPE,
    persistenceKey: humanL0PersistenceKey(characterId),
    fields,
    issues: describeHumanL0Issues(view.issues),
    grants: resolved ? view.grants.map(describeGrant) : [],
    languages: resolved ? view.languages.map(language => ({
      languageId: language.languageId,
      abilities: language.abilities.join(','),
      note: language.abilities.length === 1 && language.abilities[0] === 'speak' ? 'Somente fala.' : 'Habilidade devolvida pelo motor.',
    })) : [],
    breakdown: resolved ? view.breakdown : [],
  };
}

export type FixtureAncestryOption = {
  packId: string;
  version: string;
  entityId: string;
  title: string;
  variant: 'core' | 'only-human';
  randomAvailable: boolean;
  diceSides: number | null;
  sizes: number[];
  baseLanguageId: string;
  fictionalData: true;
};

export type FixtureProcedureOption = {
  packId: string;
  version: string;
  entityId: string;
  title: string;
  kind: 'core' | 'human-development';
  fictionalData: true;
};

export function describeFixtureCatalog(packs: unknown): {
  surface: HumanL0Surface;
  ancestries: FixtureAncestryOption[];
  procedures: FixtureProcedureOption[];
} {
  const surface = classifyHumanL0Surface('fixture', packs);
  if (surface.blocks.length || surface.data !== 'fixture') return { surface, ancestries: [], procedures: [] };
  const parsed = parseHumanL0MechanicalPacks(packs);
  return {
    surface,
    ancestries: parsed.map(pack => {
      const mechanics = pack.entities[0].mechanics;
      return {
        packId: pack.packId,
        version: pack.version,
        entityId: pack.entities[0].id,
        title: pack.source.title,
        variant: mechanics.variant,
        randomAvailable: mechanics.attributes.random !== null,
        diceSides: mechanics.attributes.random?.dice.sides ?? null,
        sizes: [...mechanics.size.choices],
        baseLanguageId: mechanics.baseLanguage.languageId,
        fictionalData: true,
      };
    }),
    procedures: parsed.map(pack => ({
      packId: pack.packId,
      version: pack.version,
      entityId: pack.entities[0].id,
      title: pack.source.title,
      kind: pack.entities[0].mechanics.procedure.kind,
      fictionalData: true,
    })),
  };
}

export function coreBenefitRequired(variant: 'core' | 'only-human', kind: 'core' | 'human-development'): boolean {
  return variant === 'core' && kind === 'core';
}

export type FixtureBenefit =
  | null
  | { kind: 'speak-language'; languageId: string }
  | { kind: 'random-profession'; rollEventId: string };

export type FixtureSelectionInput = {
  ancestryPackId: string;
  procedurePackId: string;
  increase: HumanAttribute;
  size: number;
  adjustment: { increase: HumanAttribute; decrease: HumanAttribute } | null;
  benefit: FixtureBenefit;
};

export function defaultFixtureSelectionInput(): FixtureSelectionInput {
  const selection = structuredClone(fixtureJson.selection) as {
    ancestry: { packId: string };
    procedure: { ref: { packId: string } };
    attributes: { increase?: string };
    size: number;
  };
  const increase = selection.attributes.increase;
  return {
    ancestryPackId: selection.ancestry.packId,
    procedurePackId: selection.procedure.ref.packId,
    increase: increase && (ATTRIBUTES as readonly string[]).includes(increase) ? increase as HumanAttribute : 'strength',
    size: selection.size,
    adjustment: null,
    benefit: null,
  };
}

export function buildFixtureSelection(packs: unknown, input: FixtureSelectionInput): { ok: true; selection: HumanL0Selection } | HumanL0Refusal {
  const surface = classifyHumanL0Surface('fixture', packs);
  if (surface.blocks.length) return { ok: false, blocks: surface.blocks };
  let parsed: HumanL0MechanicalPack[];
  try {
    parsed = parseHumanL0MechanicalPacks(packs);
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
  const ancestry = parsed.find(pack => pack.packId === input.ancestryPackId);
  const procedure = parsed.find(pack => pack.packId === input.procedurePackId);
  if (!ancestry || !procedure) return refusal('selection-reference-missing');
  const selection = {
    schemaVersion: 1 as const,
    contract: HUMAN_L0_CONTRACT,
    contractVersion: HUMAN_L0_CONTRACT_VERSION,
    ancestry: { packId: ancestry.packId, version: ancestry.version, entityId: ancestry.entities[0].id },
    attributes: { mode: 'fixed' as const, increase: input.increase },
    adjustment: input.adjustment,
    size: input.size,
    procedure: {
      ref: { packId: procedure.packId, version: procedure.version, entityId: procedure.entities[0].id },
      kind: procedure.entities[0].mechanics.procedure.kind,
    },
    coreBenefit: input.benefit,
  };
  try {
    return { ok: true, selection: parseHumanL0Selection(selection, packs) };
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
}

export type HumanL0ManualEffect = Extract<HumanL0Command, { type: 'manual-effect' }>['effect'];
export type HumanL0Intent =
  | { type: 'create'; selection: HumanL0Selection; name: string }
  | { type: 'select'; selection: HumanL0Selection }
  | { type: 'roll-attributes'; seed: string }
  | { type: 'state'; target: 'damage' | 'insanity' | 'corruption'; value: number; reason: string }
  | { type: 'manual-effect'; effect: HumanL0ManualEffect }
  | { type: 'effect-active'; effectEventId: string; active: boolean };

export type HumanL0Preview = {
  ok: true;
  phase: 'preview';
  confirmed: false;
  intent: HumanL0Intent;
  character: HumanL0Character;
  view: HumanL0View;
  model: HumanL0SheetModel;
};

function guardsOfficial(view: HumanL0View): HumanL0Refusal | null {
  if ((view as { officialGenerationEnabled: boolean }).officialGenerationEnabled !== false) return refusal('official-generation-disabled');
  return null;
}

export async function previewHumanL0(baseline: HumanL0Character | null, packs: unknown, intent: HumanL0Intent): Promise<HumanL0Preview | HumanL0Refusal> {
  const surface = classifyHumanL0Surface('fixture', packs);
  if (surface.blocks.length) return { ok: false, blocks: surface.blocks };
  try {
    let character: HumanL0Character;
    if (intent.type === 'create') {
      if (baseline) return refusal('already-confirmed');
      if (intent.name.length > 200) return refusal('name-too-long');
      character = await newHumanL0Character(intent.selection, packs, { id: HUMAN_L0_FIXTURE_CHARACTER_ID, name: intent.name });
    } else if (!baseline) {
      return refusal('nothing-to-update');
    } else if (baseline.id !== HUMAN_L0_FIXTURE_CHARACTER_ID) {
      return refusal('unexpected-character-id');
    } else if (intent.type === 'select') {
      character = await performHumanL0Command(structuredClone(baseline), packs, { type: 'select', selection: intent.selection });
    } else if (intent.type === 'roll-attributes') {
      const seed = intent.seed.trim();
      if (!seed || seed.length > 200) return refusal('seed-required');
      character = await performHumanL0Command(structuredClone(baseline), packs, { type: 'roll-attributes', seed });
    } else if (intent.type === 'manual-effect') {
      const parsed = HumanL0ManualEffectSchema.safeParse(intent.effect);
      if (!parsed.success) return refusal('command-invalid');
      character = await performHumanL0Command(structuredClone(baseline), packs, { type: 'manual-effect', effect: parsed.data });
    } else {
      character = await performHumanL0Command(structuredClone(baseline), packs, intent);
    }
    if (character.id !== HUMAN_L0_FIXTURE_CHARACTER_ID || character.mode !== 'local-preview') return refusal('unexpected-character-id');
    const view = await calculateHumanL0Character(character, packs);
    const official = guardsOfficial(view);
    if (official) return official;
    if (!view.baseResolved) return { ok: false, blocks: describeHumanL0Issues(view.issues).map(issue => ({ code: issue.code, message: issue.message })) };
    return { ok: true, phase: 'preview', confirmed: false, intent, character, view, model: humanL0SheetModel(view, character.id) };
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
}

export type HumanL0Commit = {
  ok: true;
  phase: 'confirmed';
  character: HumanL0Character;
  view: HumanL0View;
  model: HumanL0SheetModel;
};

export async function confirmHumanL0Preview(baseline: HumanL0Character | null, packs: unknown, preview: HumanL0Preview): Promise<HumanL0Commit | HumanL0Refusal> {
  const again = await previewHumanL0(baseline, packs, preview.intent);
  if (!again.ok) return again;
  if (JSON.stringify(again.character) !== JSON.stringify(preview.character)) return refusal('preview-stale');
  try {
    await saveHumanL0Character(again.character, baseline);
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
  return { ok: true, phase: 'confirmed', character: again.character, view: again.view, model: again.model };
}

export async function readHumanL0Fixture(packs: unknown, character: HumanL0Character | null): Promise<{
  character: HumanL0Character | null;
  view: HumanL0View | null;
  model: HumanL0SheetModel | null;
  blocks: HumanL0Block[];
}> {
  const surface = classifyHumanL0Surface('fixture', packs);
  if (surface.blocks.length) return { character: null, view: null, model: null, blocks: surface.blocks };
  if (!character) return { character: null, view: null, model: null, blocks: [] };
  if (character.id !== HUMAN_L0_FIXTURE_CHARACTER_ID) return { character, view: null, model: null, blocks: [block('unexpected-character-id')] };
  const view = await calculateHumanL0Character(character, packs);
  const official = guardsOfficial(view);
  if (official) return { character, view: null, model: null, blocks: official.blocks };
  return { character, view, model: humanL0SheetModel(view, character.id), blocks: [] };
}

export async function loadHumanL0FixtureCharacter(): Promise<HumanL0Character | null> {
  return loadHumanL0Character(HUMAN_L0_FIXTURE_CHARACTER_ID);
}

export type HumanL0ImportStage = {
  ok: true;
  phase: 'import';
  confirmed: false;
  character: HumanL0Character;
  view: HumanL0View;
  model: HumanL0SheetModel;
};

export async function stageHumanL0Import(text: string, packs: unknown): Promise<HumanL0ImportStage | HumanL0Refusal> {
  const surface = classifyHumanL0Surface('fixture', packs);
  if (surface.blocks.length) return { ok: false, blocks: surface.blocks };
  let character: HumanL0Character;
  try {
    character = importHumanL0Character(text);
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
  if (character.id !== HUMAN_L0_FIXTURE_CHARACTER_ID) return refusal('unexpected-character-id');
  const view = await calculateHumanL0Character(character, packs);
  const official = guardsOfficial(view);
  if (official) return official;
  return { ok: true, phase: 'import', confirmed: false, character, view, model: humanL0SheetModel(view, character.id) };
}

export async function commitHumanL0Import(baseline: HumanL0Character | null, packs: unknown, staged: HumanL0Character): Promise<HumanL0Commit | HumanL0Refusal> {
  const again = await stageHumanL0Import(exportHumanL0Character(staged), packs);
  if (!again.ok) return again;
  if (JSON.stringify(again.character) !== JSON.stringify(staged)) return refusal('preview-stale');
  try {
    await saveHumanL0Character(again.character, baseline);
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
  return { ok: true, phase: 'confirmed', character: again.character, view: again.view, model: again.model };
}

export function rollBlocks(baseline: HumanL0Character | null, packs: unknown, seed: string): HumanL0Block[] {
  const surface = classifyHumanL0Surface('fixture', packs);
  if (surface.blocks.length) return surface.blocks;
  if (!baseline) return [block('nothing-to-update')];
  const trimmed = seed.trim();
  if (!trimmed || trimmed.length > 200) return [block('seed-required')];
  try {
    const parsed = parseHumanL0MechanicalPacks(packs);
    const event = [...baseline.events].reverse().find(entry => entry.type === 'create' || entry.type === 'select');
    if (!event || (event.type !== 'create' && event.type !== 'select')) return [block('selection-reference-missing')];
    const ancestry = parsed.find(pack => pack.packId === event.selection.ancestry.packId && pack.version === event.selection.ancestry.version);
    if (!ancestry?.entities[0].mechanics.attributes.random) return [block('random-mode-unavailable')];
    return [];
  } catch (error) {
    return [blockFrom(error)];
  }
}

export function selectionSummary(character: HumanL0Character): { ancestry: string; procedure: string; attributeMode: string } {
  const event = [...character.events].reverse().find(entry => entry.type === 'create' || entry.type === 'select');
  if (!event || (event.type !== 'create' && event.type !== 'select')) {
    return { ancestry: 'indisponível', procedure: 'indisponível', attributeMode: 'indisponível' };
  }
  return {
    ancestry: `${event.selection.ancestry.packId}@${event.selection.ancestry.version}`,
    procedure: `${event.selection.procedure.kind} · ${event.selection.procedure.ref.packId}@${event.selection.procedure.ref.version}`,
    attributeMode: event.selection.attributes.mode,
  };
}

export function exportConfirmedHumanL0(character: HumanL0Character): string {
  return exportHumanL0Character(character);
}

export function confirmedHumanL0Selection(character: HumanL0Character): HumanL0Selection | null {
  const event = [...character.events].reverse().find(entry => entry.type === 'create' || entry.type === 'select');
  if (!event || (event.type !== 'create' && event.type !== 'select')) return null;
  return event.selection;
}

export function humanL0EffectToggles(character: HumanL0Character): { id: string; reason: string; active: boolean }[] {
  const active = new Map<string, { reason: string; active: boolean }>();
  for (const event of character.events) {
    if (event.type === 'manual-effect') active.set(event.id, { reason: event.effect.reason, active: true });
    if (event.type === 'effect-active') {
      const current = active.get(event.effectEventId);
      if (current) current.active = event.active;
    }
  }
  return [...active].map(([id, value]) => ({ id, ...value }));
}

export async function commitHumanL0Name(baseline: HumanL0Character, packs: unknown, name: string): Promise<HumanL0Commit | HumanL0Refusal> {
  if (baseline.id !== HUMAN_L0_FIXTURE_CHARACTER_ID || baseline.mode !== 'local-preview') return refusal('unexpected-character-id');
  if (name.length > 200) return refusal('name-too-long');
  let character: HumanL0Character;
  try {
    character = parseHumanL0Character({ ...baseline, name });
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
  const view = await calculateHumanL0Character(character, packs);
  const official = guardsOfficial(view);
  if (official) return official;
  try {
    await saveHumanL0Character(character, baseline);
  } catch (error) {
    return { ok: false, blocks: [blockFrom(error)] };
  }
  return { ok: true, phase: 'confirmed', character, view, model: humanL0SheetModel(view, character.id) };
}

export async function proposeHumanL0Roll(baseline: HumanL0Character | null, packs: unknown, seed: string): Promise<HumanL0Preview | HumanL0Refusal> {
  return previewHumanL0(baseline, packs, { type: 'roll-attributes', seed });
}

export async function proposeHumanL0State(baseline: HumanL0Character | null, packs: unknown, input: { target: 'damage' | 'insanity' | 'corruption'; value: number; reason: string }): Promise<HumanL0Preview | HumanL0Refusal> {
  if (!Number.isInteger(input.value) || input.value < 0 || !input.reason.trim()) return refusal('command-invalid');
  return previewHumanL0(baseline, packs, { type: 'state', target: input.target, value: input.value, reason: input.reason.trim() });
}

export async function proposeHumanL0ManualEffect(baseline: HumanL0Character | null, packs: unknown, input: {
  reason: string;
  modifier: { phase: 'attribute' | 'characteristic'; target: string; delta: number } | null;
  equipment: { defense: number | null; speedDelta: number } | null;
}): Promise<HumanL0Preview | HumanL0Refusal> {
  const parsed = HumanL0ManualEffectSchema.safeParse({
    authority: 'user',
    reason: input.reason,
    modifiers: input.modifier ? [input.modifier] : [],
    equipment: input.equipment,
  });
  if (!parsed.success) return refusal('command-invalid');
  return previewHumanL0(baseline, packs, { type: 'manual-effect', effect: parsed.data });
}

export async function proposeHumanL0EffectActive(baseline: HumanL0Character | null, packs: unknown, effectEventId: string, active: boolean): Promise<HumanL0Preview | HumanL0Refusal> {
  return previewHumanL0(baseline, packs, { type: 'effect-active', effectEventId, active });
}
