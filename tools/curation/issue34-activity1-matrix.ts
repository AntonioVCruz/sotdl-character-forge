import { readFileSync } from 'node:fs';
import { edges, expanded } from './creation-table-inventory';
import { explicitRanges, findingDispositions, numericOnlyIds } from './pilot-table-ranges';
import { odditiesTables, uncertainPairings } from './interesting-things-map';
import { details } from './interesting-things-details';
import { armorRows, gearRows, ruleSpans, weaponRows } from './pilot-item-definitions';

/** Immutable structural baseline emitted without licensed inputs. Current local closure
 * is recorded independently in curation/reviews/issue34-activity1-local-verification.json.
 * Structural ids and historical evidence states are retained; no source excerpts.
 */

const CORE = 'sotdl:shadow-of-the-demon-lord-core';
const ONLY = 'sotdl:only-human';
const ODD = 'sotdl:oddities-artifacts-and-esoterica';
const LIFESTYLES = ['destitute', 'poor', 'getting-by', 'comfortable', 'wealthy', 'rich'] as const;

export type MatrixSelection = 'selecionado' | 'selecionado-manual' | 'adiado' | 'bloqueado' | 'referencia' | 'fora-recorte-base';
export type MatrixEvidence = 'code-anchor' | 'entailed-coverage' | 'hash-declarado-nao-refeito' | 'local-only' | 'needs-recheck';
export type MatrixDisposition = 'lote-core' | 'lote-only-human' | 'lote-oddities' | 'lote-kits-itens' | 'adiado' | 'bloqueado' | 'referencia';

export type MatrixRecord = {
  id: string;
  kind: string;
  cur: string;
  sourceId: string;
  sourceVersion: null;
  sourceVersionReason: string;
  review: string;
  consumers: string[];
  consequenceTypes: string[];
  linkedDefinition: string;
  evidenceRef: string;
  selection: MatrixSelection;
  evidence: MatrixEvidence;
  capabilities: string[];
  disposition: MatrixDisposition;
  represents: number;
  notes?: string;
};

export type MatrixBlocker = {
  id: string;
  owner: 'curador' | 'engenheiro' | 'ambiente';
  summary: string;
  count?: number;
  activities?: number[];
  lots?: string[];
  members?: { id: string; count: number }[];
};

export type Activity1Matrix = {
  schemaVersion: 1;
  task: 'issue-34-activity-1';
  reviewDate: '2026-11-02';
  issue: 34;
  activity: 1;
  policy: 'ids-hashes-counts-dispositions-only';
  closure: 'pending-act1-local-hash-check';
  records: MatrixRecord[];
  blockers: MatrixBlocker[];
  counts: Record<string, number>;
};

const optionId = (family: string, category: string, min: number) =>
  `pilot-profession:${family}:${category}:r${String(min).padStart(2, '0')}`;

const sideRollToken = (roll: { phase: string; count: number; sides: number; modifier: number }) => {
  const modifier = roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier < 0 ? String(roll.modifier) : '';
  return `side:${roll.phase}:${roll.count}d${roll.sides}${modifier}`;
};

function sourceText(name: string) {
  return readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');
}

function wealthRangeMins(varName: string) {
  const text = sourceText('wealth-equipment-formalizer.ts');
  const start = text.indexOf(`const ${varName}:`);
  const brace = text.indexOf('{', start);
  const end = text.indexOf('};', brace);
  if (start < 0 || brace < 0 || end < 0) throw new Error(`Missing wealth map ${varName}`);
  return [...text.slice(brace + 1, end).matchAll(/(?:^|[{,])\s*(\d+)\s*:/g)].map(hit => Number(hit[1]));
}

function cyclicIds(ids: string[], links: { from: string; to: string }[]) {
  const outgoing = new Map(ids.map(id => [id, links.filter(link => link.from === id).map(link => link.to)]));
  return ids.filter(id => {
    const visit = (at: string, seen: Set<string>): boolean => {
      if (seen.has(at)) return false;
      seen.add(at);
      return (outgoing.get(at) ?? []).some(next => next === id || visit(next, seen));
    };
    return visit(id, new Set());
  });
}

const SOURCE_VERSION_REASON = 'sources.json revision is null and editionStatus is unconfirmed; pdf is not-provided-in-rules';

function consumersFor(row: { id: string; kind: string; disposition: MatrixDisposition; selection: MatrixSelection }): string[] {
  const lot = row.disposition === 'lote-core' ? '#34-act3'
    : row.disposition === 'lote-only-human' || row.disposition === 'lote-oddities' ? '#34-act4'
      : row.disposition === 'lote-kits-itens' ? '#34-act5'
        : row.disposition === 'adiado' ? '#35'
          : row.disposition === 'bloqueado' ? '#34-act1'
            : '#34-act8';
  const consumers = new Set<string>([lot]);
  if (['table', 'flow', 'query', 'link', 'interesting-outcome', 'interesting-grant', 'profession-option', 'side-roll', 'development-template', 'language-option', 'lifestyle-modifier'].includes(row.kind)) consumers.add('#35');
  if (row.disposition === 'lote-kits-itens' || row.kind === 'item-definition' || row.kind === 'item-reference') consumers.add('#36');
  if (['side-roll', 'interesting-outcome', 'grant-program', 'development-template', 'lifestyle-modifier'].includes(row.kind)) consumers.add('#34-act7');
  if (row.kind === 'query' || row.kind === 'link') consumers.add('#34-act2');
  if (row.selection === 'adiado' && row.id === 'procedure:roleplaying-questions') consumers.add('#36');
  return [...consumers].sort();
}

function evidenceRefFor(row: { id: string; kind: string; sourceId: string; evidence: MatrixEvidence }): string {
  if (row.kind === 'evidence-gap') return row.id;
  if (row.id === 'only-human:fears' || row.id === 'only-human:desires' || row.id.startsWith('only-human:fears#') || row.id.startsWith('only-human:desires#')) return 'evidence:correction-fears-desires';
  if (row.kind === 'interesting-outcome' && row.id.startsWith('core:')) return 'evidence:correction-core-interesting-things';
  if (row.kind === 'language-option') return 'evidence:correction-core-languages';
  if (row.id === 'core-initial-thing' || row.id.startsWith('core:thing')) return 'evidence:correction-core-interesting-things';
  if (row.sourceId === ODD || row.id.startsWith('oddities:')) return row.evidence === 'code-anchor' && !row.id.startsWith('oddities:books') && !['art', 'books', 'minor-magic', 'pets', 'personal', 'ingredients'].some(table => row.id.startsWith(`oddities:${table}`))
    ? 'evidence:rules-compendium-md'
    : 'evidence:correction-oddities-tables';
  if (row.evidence === 'local-only' && (row.kind === 'profession-option' || row.id.startsWith('core:profession-'))) return 'evidence:correction-core-professions';
  if (row.evidence === 'local-only' && row.id.startsWith('class:')) return 'evidence:pilot-items';
  if (row.evidence === 'needs-recheck') return 'n/a:pdf-not-inspected';
  if (row.id.startsWith('pilot-profession:core:') || row.id.startsWith('core:profession') || row.id.startsWith('query:profession-faces:core')) return 'evidence:correction-core-professions';
  if (row.sourceId === ONLY) return 'evidence:rules-ancestry-md';
  if (row.id.startsWith('core:human-') || row.id.startsWith('query:starting-lifestyle:core') || row.id === 'core:wealth' || row.id.startsWith('core:role-traits') || row.id.startsWith('core:kit:') || row.id.startsWith('extra:core-background')) return 'evidence:rules-ancestry-md';
  return 'evidence:rules-compendium-md';
}

function reviewFor(row: { id: string; kind: string; evidence: MatrixEvidence }): string {
  if (row.kind === 'finding' && (row.id.endsWith('fears-desires-columns') || row.id.endsWith('profession-selector-stray-prose'))) return 'resolved-2026-10-27';
  if (row.evidence === 'hash-declarado-nao-refeito') return 'declared-2026-10-27-hash-not-recomputed';
  if (row.evidence === 'local-only') return 'needs-individualization';
  if (row.evidence === 'needs-recheck') return 'pdf-not-inspected';
  if (row.evidence === 'entailed-coverage') return 'coverage-entailed-bytes-not-reread';
  return 'code-anchor-2026-10-27';
}

function consequenceTypesFor(row: { id: string; kind: string; capabilities: string[]; disposition: MatrixDisposition }): string[] {
  const caps = new Set(row.capabilities);
  if (row.kind === 'item-reference' && caps.has('resolution:currency-preserved')) return ['currency', 'carried-by-grant-program'];
  if (row.kind === 'item-reference' && caps.has('resolution:non-inventory')) return ['narrative', 'carried-by-interesting-outcome'];
  if (row.kind === 'item-reference' && caps.has('resolution:choice-required')) return ['item', 'choice'];
  if (row.kind === 'item-reference') return ['item'];
  if (row.kind === 'item-definition') return caps.has('definition:source-grant-only') ? ['item', 'generic-editable'] : ['item'];
  if (row.kind === 'interesting-outcome') {
    const kind = row.capabilities.find(cap => cap.startsWith('kind:'))?.slice(5) ?? 'object';
    return [kind, 'manual-adjudication'];
  }
  if (row.kind === 'profession-option' || row.kind === 'development-template') return ['profession', 'language'];
  if (row.kind === 'language-option') return ['language'];
  if (row.kind === 'grant-program') return ['grant'];
  if (row.kind === 'lifestyle-modifier') return ['lifestyle-modifier'];
  if (row.kind === 'side-roll') return ['side-roll'];
  if (row.kind === 'query' && caps.has('lookup-by-lifestyle')) return ['lookup'];
  if (row.kind === 'query' || row.kind === 'table' && row.capabilities.some(cap => cap.startsWith('role:selector') || cap === 'default-variant')) return ['selector'];
  if (row.kind === 'table' && row.capabilities.some(cap => cap.startsWith('lookup:'))) return ['lookup'];
  if (row.kind === 'table' || row.kind === 'flow') return ['table-result'];
  if (row.kind === 'link') return ['link'];
  if (row.kind === 'finding') return row.disposition === 'referencia' ? ['review-note', 'carried-by-table'] : ['review-note', 'manual-pending'];
  if (row.kind === 'rule-block') return ['rule-reference'];
  if (row.kind === 'evidence-gap') return ['evidence-pin'];
  if (row.kind === 'gap') return ['blocked-or-deferred-branch'];
  if (row.kind === 'procedure') return ['procedure'];
  if (row.kind === 'interesting-grant') return ['interesting-thing-grant'];
  return ['n/a:unclassified'];
}

function linkedDefinitionFor(row: { id: string; kind: string; capabilities: string[] }): string {
  if (row.kind === 'item-definition') return row.id.startsWith('class:') ? 'local-only' : row.id;
  if (row.kind === 'item-reference' && row.capabilities.includes('resolution:currency-preserved')) return 'n/a:currency-preserved-on-grant';
  if (row.kind === 'item-reference' && row.capabilities.includes('resolution:non-inventory')) return 'n/a:non-inventory';
  if (row.kind === 'item-reference' && row.capabilities.includes('resolution:choice-required')) {
    const candidates = row.capabilities.filter(cap => cap.startsWith('candidate:')).map(cap => cap.slice('candidate:'.length));
    return `choice:${candidates.join('|')}`;
  }
  if (row.kind === 'item-reference' && row.id.startsWith('item-ref:thing:')) return `pilot-item:thing:${row.id.slice('item-ref:thing:'.length)}`;
  if (row.kind === 'item-reference' && row.id.startsWith('class:')) return 'local-only';
  if (row.kind === 'profession-option' && row.id.endsWith(':*')) return 'local-only';
  if (row.kind === 'profession-option' && row.id.startsWith('pilot-profession:only-human:') && !row.id.endsWith(':occult')) return `profession:${row.id}`;
  if (row.kind === 'profession-option') return 'n/a:no-copied-gear';
  if (row.kind === 'grant-program') return 'local-only';
  if (row.kind === 'finding' && row.id.endsWith('fears-desires-columns')) return 'n/a:carried-by-only-human:fears-and-desires';
  if (row.kind === 'finding' && row.id.endsWith('profession-selector-stray-prose')) return 'n/a:carried-by-only-human:profession-router';
  return 'n/a:not-an-item-definition';
}

function rec(partial: Omit<MatrixRecord, 'represents' | 'sourceVersion' | 'sourceVersionReason' | 'review' | 'consumers' | 'consequenceTypes' | 'linkedDefinition' | 'evidenceRef'> & { represents?: number }): MatrixRecord {
  const base = { represents: 1, ...partial, capabilities: [...partial.capabilities].sort() };
  return {
    ...base,
    sourceVersion: null,
    sourceVersionReason: SOURCE_VERSION_REASON,
    review: reviewFor(base),
    consumers: consumersFor(base),
    consequenceTypes: consequenceTypesFor(base),
    linkedDefinition: linkedDefinitionFor(base),
    evidenceRef: evidenceRefFor(base),
  };
}

function padFace(n: number) {
  return String(n).padStart(2, '0');
}

export function buildActivity1Matrix(): Activity1Matrix {
  const records: MatrixRecord[] = [];
  const coreTables: [string, string, string, string][] = [
    ['human-background', '1d20', 'optional-ancestry-inspiration', 'ancestry-narrative'],
    ['human-personality', '3d6', 'optional-ancestry-inspiration', 'ancestry-narrative'],
    ['human-religion', '3d6', 'optional-ancestry-inspiration', 'ancestry-narrative'],
    ['human-age', '3d6', 'optional-ancestry-inspiration', 'ancestry-narrative'],
    ['human-build', '3d6', 'optional-ancestry-inspiration', 'dimension-manual'],
    ['human-appearance', '3d6', 'optional-ancestry-inspiration', 'ancestry-narrative'],
    ['profession-router', '1d6', 'per-random-profession', 'selector'],
    ...['academic', 'common', 'criminal', 'martial', 'religious', 'wilderness'].map(key => [`profession-${key}`, '1d20', 'conditional-profession', 'profession-child'] as [string, string, string, string]),
    ['wealth', '3d6', 'core-wealth-once', 'lifestyle-class'],
    ['thing-router', '1d6', 'one-initial-plus-explicit-extra-results', 'selector'],
    ...[1, 2, 3, 4, 5, 6].map(n => [`thing-${n}`, '1d20', 'selector-child', 'interesting-thing'] as [string, string, string, string]),
    ['role-traits', '1d20', 'optional-inspiration-two-positive-at-least-one-negative', 'two-independent-columns'],
  ];
  if (coreTables.length !== 22 || expanded.length !== 39) throw new Error('CUR-016 table inventory shape changed');

  const tableIds = [...coreTables.map(([key]) => `core:${key}`), ...expanded.map(([key]) => `only-human:${key}`)];
  const inventoryLinks = [
    ...edges.map(([from, to, kind]) => ({ from: `only-human:${from}`, to: to.startsWith('core:') ? to : `only-human:${to}`, kind })),
    ...['academic', 'common', 'criminal', 'martial', 'religious', 'wilderness'].map(key => ({ from: 'core:profession-router', to: `core:profession-${key}`, kind: 'selector' })),
    ...[1, 2, 3, 4, 5, 6].map(n => ({ from: 'core:thing-router', to: `core:thing-${n}`, kind: 'selector' })),
  ];
  if (inventoryLinks.length !== 61) throw new Error(`Expected 61 inventory links, found ${inventoryLinks.length}`);
  const cycles = cyclicIds(tableIds, inventoryLinks);
  const closureLinks = inventoryLinks.map(link => ['initial-result', 'additional-result'].includes(link.kind) && link.to === 'core:thing-router'
    ? { ...link, to: 'selected:interesting-things-router' } : link);
  for (const table of odditiesTables) closureLinks.push({ from: 'oddities:thing-router', to: `oddities:${table.id}`, kind: 'selector' });
  if (closureLinks.length !== 73) throw new Error(`Expected 73 closure links, found ${closureLinks.length}`);

  for (const [key, dice, activation, role] of coreTables) {
    const caps = [`activation:${activation}`, `dice:${dice}`, `role:${role}`];
    if (key === 'role-traits') caps.push('streams:positive,negative');
    if (key === 'wealth') caps.push('thresholds-distinct-from-only-human', 'open-tail:false');
    if (key === 'human-build') caps.push('size-independent-except-published-exception');
    records.push(rec({
      id: `core:${key}`, kind: 'table', cur: 'CUR-016/021', sourceId: CORE, selection: 'selecionado',
      evidence: 'code-anchor', capabilities: caps, disposition: 'lote-core',
      notes: 'bytes-de-faixa-ausentes',
    }));
  }
  for (const [key, , , , roll, activation] of expanded) {
    const lookup = roll === null;
    records.push(rec({
      id: `only-human:${key}`, kind: 'table', cur: 'CUR-016/021', sourceId: ONLY, selection: 'selecionado',
      evidence: key === 'fears' || key === 'desires' ? 'hash-declarado-nao-refeito' : 'code-anchor',
      capabilities: [`activation:${activation}`, lookup ? 'lookup:selected-starting-lifestyle' : `dice:${roll[0]}d${roll[1]}`, lookup ? 'extra-dice:false' : 'random-table'],
      disposition: lookup ? 'lote-kits-itens' : 'lote-only-human',
      notes: 'bytes-de-faixa-ausentes',
    }));
  }
  records.push(rec({
    id: 'oddities:thing-router', kind: 'table', cur: 'CUR-019/021', sourceId: ODD, selection: 'selecionado',
    evidence: 'code-anchor', capabilities: ['dice:1d20', 'routes:12', 'default-variant'], disposition: 'lote-oddities',
    notes: 'pesos-de-faixa-nao-uniformes-entre-categorias',
  }));
  for (const table of odditiesTables) {
    const corrected = ['art', 'books', 'minor-magic', 'pets', 'personal', 'ingredients'].includes(table.id);
    records.push(rec({
      id: `oddities:${table.id}`, kind: 'table', cur: 'CUR-019/021', sourceId: ODD, selection: 'selecionado',
      evidence: corrected ? 'hash-declarado-nao-refeito' : 'code-anchor',
      capabilities: ['dice:1d20', 'faces:20', `selector:${table.ranges[0]}-${table.ranges[1]}`],
      disposition: 'lote-oddities', notes: corrected ? 'transcricao-usuario-120-resultados-bytes-ausentes' : 'spans-versionados-bytes-ausentes',
    }));
  }
  if (records.filter(row => row.kind === 'table').length !== 74) throw new Error('Table identity count drifted');

  const pushFlow = (id: string, sourceId: string, rows: number, disposition: MatrixDisposition, evidence: MatrixEvidence, capabilities: string[]) => {
    records.push(rec({ id, kind: 'flow', cur: 'CUR-021', sourceId, selection: 'selecionado', evidence, capabilities: [`rows:${rows}`, ...capabilities], disposition, represents: 1 }));
  };
  for (const [key, dice, , role] of coreTables) {
    if (key === 'role-traits') {
      pushFlow('core:role-traits#positive', CORE, 20, 'lote-core', 'code-anchor', ['column:positive', `dice:${dice}`]);
      pushFlow('core:role-traits#negative', CORE, 20, 'lote-core', 'code-anchor', ['column:negative', `dice:${dice}`]);
      continue;
    }
    const rows = key.startsWith('profession-') && key !== 'profession-router'
      ? null
      : key === 'profession-router' || key === 'thing-router' ? 6
        : key.startsWith('thing-') ? 20
          : key === 'wealth' ? 6
            : numericOnlyIds.has(`core:${key}`) ? explicitRanges(`core:${key}`).length : null;
    if (rows === null) continue;
    pushFlow(`core:${key}#main`, CORE, rows, 'lote-core', 'code-anchor', [`dice:${dice}`, `role:${role}`]);
  }
  for (const [key, , , , roll] of expanded) {
    if (!roll) continue;
    if (['scholarship', 'common', 'criminal', 'military', 'religious', 'wilderness'].includes(key)) continue;
    const id = `only-human:${key}`;
    const rows = key === 'profession-router' ? 6 : key === 'fears' || key === 'desires' ? 6 : key === 'lifestyle' ? 6 : explicitRanges(id).length;
    pushFlow(`${id}#main`, ONLY, rows, 'lote-only-human', key === 'fears' || key === 'desires' ? 'hash-declarado-nao-refeito' : 'code-anchor', [`dice:${roll[0]}d${roll[1]}`]);
  }
  for (const table of odditiesTables) pushFlow(`oddities:${table.id}#main`, ODD, 20, 'lote-oddities', 'code-anchor', ['dice:1d20']);
  pushFlow('oddities:thing-router#main', ODD, 12, 'lote-oddities', 'code-anchor', ['dice:1d20', 'route-rows:12']);

  const professionSpecs: { family: 'core' | 'only-human'; category: string; mins: number[] | null; declared: number; evidence: MatrixEvidence }[] = [
    { family: 'core', category: 'academic', mins: Array.from({ length: 20 }, (_, i) => i + 1), declared: 20, evidence: 'entailed-coverage' },
    { family: 'core', category: 'common', mins: Array.from({ length: 20 }, (_, i) => i + 1), declared: 20, evidence: 'entailed-coverage' },
    { family: 'core', category: 'criminal', mins: Array.from({ length: 20 }, (_, i) => i + 1), declared: 20, evidence: 'entailed-coverage' },
    { family: 'core', category: 'martial', mins: [3, 13], declared: 14, evidence: 'entailed-coverage' },
    { family: 'core', category: 'religious', mins: [1, 3, 9, 11], declared: 11, evidence: 'code-anchor' },
    { family: 'core', category: 'wilderness', mins: [], declared: 17, evidence: 'local-only' },
    { family: 'only-human', category: 'scholarship', mins: Array.from({ length: 10 }, (_, i) => i * 2 + 1), declared: 10, evidence: 'entailed-coverage' },
    { family: 'only-human', category: 'common', mins: Array.from({ length: 20 }, (_, i) => i + 1), declared: 20, evidence: 'code-anchor' },
    { family: 'only-human', category: 'criminal', mins: wealthRangeMins('criminal'), declared: 10, evidence: 'code-anchor' },
    { family: 'only-human', category: 'military', mins: wealthRangeMins('military'), declared: 10, evidence: 'code-anchor' },
    { family: 'only-human', category: 'religious', mins: Array.from({ length: 6 }, (_, i) => i + 1), declared: 6, evidence: 'entailed-coverage' },
    { family: 'only-human', category: 'wilderness', mins: wealthRangeMins('wilderness'), declared: 10, evidence: 'code-anchor' },
  ];
  let professionAccounted = 0;
  for (const spec of professionSpecs) {
    const sourceId = spec.family === 'core' ? CORE : ONLY;
    const disposition = spec.family === 'core' ? 'lote-core' : 'lote-only-human';
    const mins = spec.mins ?? [];
    for (const min of mins) {
      const id = optionId(spec.family, spec.category, min);
      const material = spec.family === 'only-human';
      records.push(rec({
        id, kind: 'profession-option', cur: 'CUR-017', sourceId, selection: 'selecionado', evidence: spec.evidence,
        capabilities: [`category:${spec.category}`, `range-min:${padFace(min)}`, material ? `program:profession:${id}` : 'program:null', 'not-a-path'],
        disposition, notes: material ? 'equipamento-so-quando-concedido-ao-pc' : 'sem-copia-de-equipamento-da-outra-publicacao',
      }));
      if (material) {
        records.push(rec({
          id: `profession:${id}`, kind: 'grant-program', cur: 'CUR-018/020', sourceId: ONLY, selection: 'selecionado', evidence: spec.evidence,
          capabilities: ['subject:pc', 'family-profession-does-not-grant', 'generic-editable-allowed'], disposition: 'lote-kits-itens',
        }));
      }
    }
    const hidden = spec.declared - mins.length;
    professionAccounted += spec.declared;
    if (hidden > 0) {
      records.push(rec({
        id: `pilot-profession:${spec.family}:${spec.category}:*`, kind: 'profession-option', cur: 'CUR-017', sourceId, selection: 'selecionado',
        evidence: 'local-only', capabilities: [`category:${spec.category}`, 'range-starts-not-reextracted', 'program:null', 'weighted-range'],
        disposition, represents: hidden, notes: 'faixas-agregadas-no-anexo-local',
      }));
    }
    const tableId = spec.family === 'core' ? `core:profession-${spec.category}` : `only-human:${spec.category}`;
    pushFlow(`${tableId}#main`, sourceId, spec.declared, disposition, spec.evidence, ['child-of-d6', spec.category === 'religious' && spec.family === 'only-human' ? 'dice:1d6' : 'dice:1d20']);
  }
  records.push(rec({
    id: 'pilot-profession:only-human:direct:occult', kind: 'profession-option', cur: 'CUR-017', sourceId: ONLY, selection: 'selecionado',
    evidence: 'code-anchor', capabilities: ['direct-grant', 'not-in-random-pool', 'program:null', 'not-a-path'], disposition: 'lote-only-human',
  }));
  professionAccounted += 1;
  if (professionAccounted !== 169) throw new Error(`Profession identities accounted ${professionAccounted}`);

  const templates: [string, string, string, string][] = [
    ['childhood-faerie', ONLY, 'only-human:childhood', 'languages'],
    ['childhood-runaway', ONLY, 'only-human:childhood', 'profession-choice'],
    ['childhood-family', ONLY, 'only-human:childhood', 'inherit-family'],
    ['childhood-artisan', ONLY, 'only-human:childhood', 'profession-choice'],
    ['childhood-education', ONLY, 'only-human:childhood', 'languages+inherit'],
    ['childhood-good-education', ONLY, 'only-human:childhood', 'languages+scholarship'],
    ['childhood-finest-education', ONLY, 'only-human:childhood', 'languages+scholarship+choice'],
    ['major-setback-pressed-service', ONLY, 'only-human:major-setback', 'profession-choice'],
    ['windfall-language', ONLY, 'only-human:minor-windfall', 'language-choice'],
    ['windfall-education', ONLY, 'only-human:minor-windfall', 'exclusive-choice'],
    ['windfall-common-profession', ONLY, 'only-human:minor-windfall', 'profession-roll'],
    ['windfall-orator', ONLY, 'only-human:minor-windfall', 'profession-grant-if-absent'],
    ['windfall-soldier', ONLY, 'only-human:minor-windfall', 'profession-grant'],
    ['strange-faerie-language', ONLY, 'only-human:strange', 'languages'],
    ['strange-occult', ONLY, 'only-human:strange', 'direct-occult'],
    ['strange-previous-lives', ONLY, 'only-human:strange', 'count-roll+profession-router'],
    ['strange-dwarfish', ONLY, 'only-human:strange', 'languages-speak-read-write'],
    ['core-background-travel', CORE, 'core:human-background', 'language-speak'],
    ['core-background-education', CORE, 'core:human-background', 'read-common-tongue-only'],
  ];
  if (templates.length !== 19) throw new Error('Development template count drifted');
  for (const [id, sourceId, tableId, shape] of templates) {
    records.push(rec({
      id, kind: 'development-template', cur: 'CUR-017', sourceId, selection: 'selecionado', evidence: 'code-anchor',
      capabilities: [`table:${tableId}`, `shape:${shape}`, 'speak-read-write-distinct'], disposition: sourceId === CORE ? 'lote-core' : 'lote-only-human',
    }));
  }

  for (const lifestyle of LIFESTYLES) {
    for (const [prefix, sourceId, context] of [['core:kit:', CORE, 'core-starting-kit'], ['only-human:kit:', ONLY, 'expanded-lifestyle-five-lookups']] as const) {
      records.push(rec({
        id: `${prefix}${lifestyle}`, kind: 'grant-program', cur: 'CUR-018', sourceId, selection: 'selecionado', evidence: 'code-anchor',
        capabilities: [`lifestyle:${lifestyle}`, `context:${context}`, 'money-bits-string', 'choices-and-side-rolls'], disposition: 'lote-kits-itens',
      }));
      records.push(rec({
        id: `item-ref:grant:${prefix}${lifestyle}/grant/starting-money`, kind: 'item-reference', cur: 'CUR-020', sourceId, selection: 'selecionado',
        evidence: 'code-anchor', capabilities: ['resolution:currency-preserved', 'not-an-item'], disposition: 'referencia',
      }));
    }
  }
  const currencyPrograms: [string, string][] = [
    ['profession:pilot-profession:only-human:common:r04', ONLY],
    ['profession:pilot-profession:only-human:common:r19', ONLY],
    ['profession:pilot-profession:only-human:common:r20', ONLY],
    ['profession:pilot-profession:only-human:criminal:r09', ONLY],
    ['profession:pilot-profession:only-human:criminal:r13', ONLY],
    ['profession:pilot-profession:only-human:criminal:r17', ONLY],
    ['extra:core-background-20', CORE],
  ];
  for (const [programId, sourceId] of currencyPrograms) {
    const key = programId.startsWith('extra:') ? 'bonus-coins' : 'coins';
    records.push(rec({
      id: `item-ref:grant:${programId}/grant/${key}`, kind: 'item-reference', cur: 'CUR-020', sourceId, selection: 'selecionado',
      evidence: 'code-anchor', capabilities: ['resolution:currency-preserved', 'not-an-item'], disposition: 'referencia',
    }));
  }
  const choiceRefs: [string, string, string[]][] = [
    ['item-ref:grant:core:kit:wealthy/grant/special/shield/shield', CORE, ['pilot-item:core:small-shield', 'pilot-item:core:large-shield']],
    ['item-ref:grant:profession:pilot-profession:only-human:military:r03/grant/spear', ONLY, ['pilot-item:core:basic-spear', 'pilot-item:core:military-spear']],
    ['item-ref:grant:profession:pilot-profession:only-human:wilderness:r17/grant/spear', ONLY, ['pilot-item:core:basic-spear', 'pilot-item:core:military-spear']],
    ['item-ref:grant:profession:pilot-profession:only-human:common:r11/grant/entertainer-clothing/costume/costume', ONLY, ['pilot-item:core:simple-costume', 'pilot-item:core:elaborate-costume']],
    ['item-ref:grant:profession:pilot-profession:only-human:common:r11/grant/entertainer-clothing/dress/dress', ONLY, ['pilot-item:core:basic-dress', 'pilot-item:core:fancy-dress']],
  ];
  for (const [id, sourceId, candidates] of choiceRefs) {
    records.push(rec({
      id, kind: 'item-reference', cur: 'CUR-020', sourceId, selection: 'selecionado-manual', evidence: 'code-anchor',
      capabilities: ['resolution:choice-required', ...candidates.map(item => `candidate:${item}`)], disposition: 'lote-kits-itens',
    }));
  }

  const extras: [string, string, string][] = [
    ['extra:core-background-20', CORE, 'currency'],
    ['extra:minor-windfall-8', ONLY, 'companion'],
    ['extra:minor-windfall-13', ONLY, 'item'],
    ['extra:minor-windfall-15', ONLY, 'gm-choice'],
    ['extra:minor-windfall-16', ONLY, 'item'],
    ['extra:minor-windfall-17', ONLY, 'companion'],
    ['extra:minor-windfall-19', ONLY, 'item-worth'],
    ['extra:major-windfall-5', ONLY, 'gm-choice'],
    ['extra:major-windfall-6', ONLY, 'property-choice'],
    ['extra:major-windfall-7', ONLY, 'property'],
    ['extra:major-windfall-8', ONLY, 'property'],
    ['extra:major-windfall-9', ONLY, 'book+incantations'],
    ['extra:major-windfall-10', ONLY, 'gm-choice'],
    ['extra:major-windfall-14', ONLY, 'companion'],
    ['extra:major-windfall-15', ONLY, 'entitlement'],
    ['extra:major-windfall-16', ONLY, 'armor-or-weapon-choice'],
    ['extra:major-windfall-17', ONLY, 'companion'],
    ['extra:major-windfall-19', ONLY, 'item-worth'],
    ['extra:major-windfall-1-fallback', ONLY, 'conditional-branch'],
  ];
  if (extras.length !== 19) throw new Error('Extra grant count drifted');
  for (const [id, sourceId, shape] of extras) {
    records.push(rec({
      id, kind: 'grant-program', cur: 'CUR-018', sourceId, selection: id.endsWith('fallback') ? 'selecionado-manual' : 'selecionado',
      evidence: 'code-anchor', capabilities: [`shape:${shape}`, 'origin-preserved'], disposition: 'lote-kits-itens',
      notes: id.endsWith('fallback') ? 'terrible-beauty-ausente-escolhe-este-ramo' : undefined,
    }));
  }
  const modifiers: [string, string][] = [
    ['lifestyle-modifier:life', '+1:results-9-12'],
    ['lifestyle-modifier:major-setback:5-8', '-3'],
    ['lifestyle-modifier:major-setback:10', '-1'],
    ['lifestyle-modifier:minor-setback', '-1:results-4-10-19'],
    ['lifestyle-modifier:minor-windfall', '+1:results-2-7'],
    ['lifestyle-modifier:major-windfall', '+3:results-4-13'],
  ];
  for (const [id, delta] of modifiers) {
    records.push(rec({
      id, kind: 'lifestyle-modifier', cur: 'CUR-018', sourceId: ONLY, selection: 'selecionado', evidence: 'code-anchor',
      capabilities: [`delta:${delta}`, 'after-dice', 'open-tail', 'core-procedure-exempt'], disposition: 'lote-only-human',
    }));
  }

  const correctedOddities = new Set(['art', 'books', 'minor-magic', 'pets', 'personal', 'ingredients']);
  const previouslyUncertain = new Set([...Object.keys(uncertainPairings), 'personal:1', 'personal:2', 'personal:3', 'personal:4']);
  let specialItems = 0;
  let nonInventory = 0;
  let outcomeSideRolls = 0;
  for (let n = 1; n <= 6; n += 1) {
    for (let face = 1; face <= 20; face += 1) {
      const id = `core:${n}:${face}`;
      const info = details(id);
      const nonItem = ['narrative', 'relationship', 'text-reference', 'dependency'].includes(info.kind);
      if (nonItem) nonInventory += 1; else specialItems += 1;
      outcomeSideRolls += info.sideRolls.length;
      records.push(rec({
        id, kind: 'interesting-outcome', cur: 'CUR-019', sourceId: CORE, selection: 'selecionado', evidence: 'hash-declarado-nao-refeito',
        capabilities: [`kind:${info.kind}`, `table:core:thing-${n}`, `face:${face}`, 'manual-adjudication', `choices:${info.choices.length}`, `side-rolls:${info.sideRolls.length}`, ...info.mechanismTags, ...info.sideRolls.map(sideRollToken), ...(info.gmChoice ? ['gm-choice'] : []), ...(info.declaredWorth ? ['worth-not-spendable'] : [])],
        disposition: 'lote-core',
      }));
      records.push(rec({
        id: `item-ref:thing:${id}`, kind: 'item-reference', cur: 'CUR-020', sourceId: CORE, selection: nonItem ? 'selecionado' : 'selecionado',
        evidence: 'code-anchor', capabilities: [nonItem ? 'resolution:non-inventory' : 'resolution:special-preserved', `kind:${info.kind}`],
        disposition: nonItem ? 'referencia' : 'lote-kits-itens',
      }));
      if (!nonItem) records.push(rec({
        id: `pilot-item:thing:${id}`, kind: 'item-definition', cur: 'CUR-020', sourceId: CORE, selection: 'selecionado', evidence: 'code-anchor',
        capabilities: ['definition:source-outcome-only', 'no-name-inheritance', 'automatic-effects:false'], disposition: 'lote-kits-itens',
      }));
    }
  }
  for (const table of odditiesTables) {
    for (let face = 1; face <= 20; face += 1) {
      const id = `oddities:${table.id}:${face}`;
      const info = details(id);
      const nonItem = ['narrative', 'relationship', 'text-reference', 'dependency'].includes(info.kind);
      if (nonItem) nonInventory += 1; else specialItems += 1;
      outcomeSideRolls += info.sideRolls.length;
      const caps = [`kind:${info.kind}`, `table:oddities:${table.id}`, `face:${face}`, 'manual-adjudication', `choices:${info.choices.length}`, `side-rolls:${info.sideRolls.length}`, ...info.mechanismTags, ...info.sideRolls.map(sideRollToken), ...(info.gmChoice ? ['gm-choice'] : []), ...(info.declaredWorth ? ['worth-not-spendable'] : [])];
      if (previouslyUncertain.has(`${table.id}:${face}`)) caps.push('association-was-needs-review');
      if (id === 'oddities:books:20') caps.push('future-generator:disabled', 'dependency:sotdl:dark-passages');
      records.push(rec({
        id, kind: 'interesting-outcome', cur: 'CUR-019', sourceId: ODD, selection: 'selecionado',
        evidence: correctedOddities.has(table.id) ? 'hash-declarado-nao-refeito' : 'code-anchor',
        capabilities: caps, disposition: 'lote-oddities',
      }));
      records.push(rec({
        id: `item-ref:thing:${id}`, kind: 'item-reference', cur: 'CUR-020', sourceId: ODD, selection: 'selecionado',
        evidence: 'code-anchor', capabilities: [nonItem ? 'resolution:non-inventory' : 'resolution:special-preserved', `kind:${info.kind}`],
        disposition: nonItem ? 'referencia' : 'lote-kits-itens',
      }));
      if (!nonItem) records.push(rec({
        id: `pilot-item:thing:${id}`, kind: 'item-definition', cur: 'CUR-020', sourceId: ODD, selection: 'selecionado', evidence: 'code-anchor',
        capabilities: ['definition:source-outcome-only', 'no-name-inheritance', 'automatic-effects:false'], disposition: 'lote-kits-itens',
      }));
    }
  }
  if (specialItems !== 285 || nonInventory !== 75) throw new Error(`Interesting item split drifted: special ${specialItems}, non-inventory ${nonInventory}`);
  if (outcomeSideRolls !== 23) throw new Error(`Outcome side rolls drifted: ${outcomeSideRolls}`);

  const published = [
    ...gearRows.map(([key]) => key),
    ...armorRows.map(([key]) => key),
    ...weaponRows.map(([key]) => key),
  ];
  if (published.length !== 67 || new Set(published).size !== 67) throw new Error('Published Core definition count drifted');
  for (const key of published) {
    records.push(rec({
      id: `pilot-item:core:${key}`, kind: 'item-definition', cur: 'CUR-020', sourceId: CORE, selection: 'selecionado', evidence: 'code-anchor',
      capabilities: ['definition:published-core', 'price-from-source-line', 'automatic-purchase:false', 'automatic-effects:false'],
      disposition: 'lote-kits-itens', notes: 'linha-versionada-preco-nao-reextraido',
    }));
  }
  if (ruleSpans.length !== 28) throw new Error(`Rule span count drifted: ${ruleSpans.length}`);
  for (const [id] of ruleSpans) {
    records.push(rec({
      id: `item-definition:rule:${id}`, kind: 'rule-block', cur: 'CUR-020', sourceId: CORE, selection: 'referencia', evidence: 'code-anchor',
      capabilities: ['application:reference-only-not-runtime-handler'], disposition: 'referencia', notes: 'texto-da-regra-local',
    }));
  }
  records.push(rec({
    id: 'class:source-grant-only', kind: 'item-definition', cur: 'CUR-020', sourceId: CORE, selection: 'selecionado', evidence: 'local-only',
    capabilities: ['definition:source-grant-only', 'price:unknown', 'generic-editable', 'automatic-mechanics:false'], disposition: 'lote-kits-itens',
    represents: 57, notes: 'ids-hash-de-rotulo-somente-no-artefato-local',
  }));
  records.push(rec({
    id: 'class:exact-definition-refs', kind: 'item-reference', cur: 'CUR-020', sourceId: CORE, selection: 'selecionado', evidence: 'local-only',
    capabilities: ['resolution:exact-definition', 'grant-source-preserved'], disposition: 'lote-kits-itens', represents: 182,
    notes: 'caminhos-de-folha-nao-repercorridos-sem-o-ledger',
  }));
  records.push(rec({
    id: 'class:generic-editable-refs', kind: 'item-reference', cur: 'CUR-020', sourceId: ONLY, selection: 'selecionado', evidence: 'local-only',
    capabilities: ['resolution:generic-editable', 'automatic-mechanics:false'], disposition: 'lote-kits-itens', represents: 75,
  }));

  const queries: [string, string, MatrixDisposition, string[]][] = [
    ['query:only-human:clothing', ONLY, 'lote-kits-itens', ['lookup-by-lifestyle']],
    ['query:only-human:weapons', ONLY, 'lote-kits-itens', ['lookup-by-lifestyle', 'sling-stones-conditional']],
    ['query:only-human:personal-gear', ONLY, 'lote-kits-itens', ['lookup-by-lifestyle']],
    ['query:only-human:special-gear', ONLY, 'lote-kits-itens', ['lookup-by-lifestyle']],
    ['query:only-human:money', ONLY, 'lote-kits-itens', ['lookup-by-lifestyle', 'currency-not-a-second-class-roll']],
    ['selected:interesting-things-router', ODD, 'lote-oddities', ['default:oddities', 'alternative:core', 'disabled-source:pending', 'no-silent-fallback']],
    ['query:profession-faces:core', CORE, 'lote-core', ['d6-then-d20', 'reject-incompatible-face']],
    ['query:profession-faces:only-human', ONLY, 'lote-only-human', ['d6-then-d20', 'religious-child:d6', 'weights-not-uniform']],
    ['query:family-category', ONLY, 'lote-only-human', ['restricted-categories', 'missing-context:diagnostic', 'no-invented-uniform-die']],
    ['query:starting-lifestyle:core', CORE, 'lote-core', ['3d6', 'no-expanded-modifiers']],
    ['query:starting-lifestyle:only-human', ONLY, 'lote-only-human', ['3d6-plus-ordered-modifiers', 'open-tail']],
  ];
  for (const [id, sourceId, disposition, capabilities] of queries) {
    records.push(rec({ id, kind: 'query', cur: 'CUR-016/021', sourceId, selection: 'selecionado', evidence: 'code-anchor', capabilities, disposition }));
  }
  for (const [id, sourceId, capabilities] of [
    ['core-initial-thing', CORE, ['count:1', 'additional:false']],
    ['only-human-initial-thing', ONLY, ['count:1', 'additional:false']],
    ['only-human-minor-windfall-10', ONLY, ['count:1', 'additional:true']],
  ] as const) {
    records.push(rec({
      id, kind: 'interesting-grant', cur: 'CUR-019', sourceId, selection: 'selecionado', evidence: 'code-anchor',
      capabilities: [...capabilities, 'binds-selected-procedure'], disposition: sourceId === CORE ? 'lote-core' : 'lote-only-human',
    }));
  }
  for (const [id, abilities] of [
    ['common-tongue', 'speak-default'], ['dark-speech', 'speak-default'], ['dwarfish', 'speak-default'],
    ['elvish', 'speak-default'], ['high-archaic', 'speak-default'], ['trollish', 'speak-default'],
  ] as const) {
    records.push(rec({
      id: `language:${id}`, kind: 'language-option', cur: 'CUR-017', sourceId: CORE, selection: 'selecionado', evidence: 'code-anchor',
      capabilities: [abilities, 'read-write-explicit-only'], disposition: 'lote-core',
    }));
  }
  for (const id of ['secret-language', 'dead-languages']) {
    records.push(rec({
      id: `language:${id}`, kind: 'language-option', cur: 'CUR-017', sourceId: CORE, selection: 'selecionado-manual', evidence: 'code-anchor',
      capabilities: ['open-category', 'requires-concrete-language'], disposition: 'lote-core',
    }));
  }

  closureLinks.forEach((link, index) => {
    records.push(rec({
      id: `pilot-link:${index + 1}`, kind: 'link', cur: 'CUR-016/021', sourceId: link.from.startsWith('core:') ? CORE : link.from.startsWith('oddities:') ? ODD : ONLY,
      selection: 'selecionado', evidence: 'code-anchor',
      capabilities: [`from:${link.from}`, `to:${link.to}`, `link:${link.kind}`, 'automatic-execution:false'],
      disposition: link.from.startsWith('core:') ? 'lote-core' : link.from.startsWith('oddities:') ? 'lote-oddities' : 'lote-only-human',
    }));
  });

  for (const [id, disposition] of Object.entries(findingDispositions)) {
    const manual = disposition.status !== 'resolved-user-transcription' && disposition.status !== 'resolved-boundary';
    records.push(rec({
      id: `finding:${id}`, kind: 'finding', cur: 'CUR-016/021', sourceId: ONLY,
      selection: manual ? 'selecionado-manual' : 'selecionado', evidence: 'code-anchor',
      capabilities: [`status:${disposition.status}`, ...((id === 'recursion' ? cycles : []).map(table => `cycle:${table}`))],
      disposition: manual ? 'lote-only-human' : 'referencia',
      notes: id === 'fears-desires-columns' ? 'pdf-nao-alegado' : undefined,
    }));
  }
  if (cycles.length !== 4) throw new Error(`Expected 4 cyclic tables, found ${cycles.join(',')}`);

  const sideRolls: [string, string, string][] = [
    ['core:human-background:12', CORE, 'creation:1d6-2:min0'],
    ['only-human:siblings:9-12', ONLY, 'creation:1d3+1'],
    ['only-human:siblings:13-16', ONLY, 'creation:1d6+2'],
    ['only-human:siblings:17-20', ONLY, 'creation:2d6'],
    ['only-human:minor-setback:13', ONLY, 'creation:1d6-parity'],
    ['only-human:major-windfall:11', ONLY, 'use:1d6'],
    ['only-human:strange:6', ONLY, 'creation:1d6-branch'],
    ['only-human:strange:16', ONLY, 'creation:1d6-branch'],
  ];
  for (const [id, sourceId, shape] of sideRolls) {
    records.push(rec({
      id: `side-roll:${id}`, kind: 'side-roll', cur: 'CUR-021', sourceId, selection: 'selecionado', evidence: 'code-anchor',
      capabilities: [shape, 'not-an-unconditional-table'], disposition: sourceId === CORE ? 'lote-core' : 'lote-only-human',
    }));
  }

  const gaps: MatrixRecord[] = [
    rec({ id: 'gap:pdf-pagination', kind: 'gap', cur: 'CUR-016/021', sourceId: CORE, selection: 'bloqueado', evidence: 'needs-recheck', capabilities: ['pdf:not-provided-in-rules', 'pagination:declared-only', 'inspected-this-audit:false'], disposition: 'bloqueado', notes: 'nenhuma-pagina-impressa-conferida' }),
    rec({ id: 'gap:dark-passages-generator', kind: 'gap', cur: 'CUR-019', sourceId: 'sotdl:dark-passages', selection: 'adiado', evidence: 'code-anchor', capabilities: ['hook:dark-passages-books-and-passages', 'enabled:false'], disposition: 'adiado', notes: 'books-20-permanece-selecionavel' }),
    rec({ id: 'gap:terrible-beauty-favor', kind: 'gap', cur: 'CUR-018/021', sourceId: 'sotdl:terrible-beauty', selection: 'bloqueado', evidence: 'code-anchor', capabilities: ['branch-preserved', 'do-not-grant-both'], disposition: 'bloqueado' }),
    rec({ id: 'gap:tooth-claw-skinchanger', kind: 'gap', cur: 'CUR-021', sourceId: 'sotdl:tooth-claw', selection: 'bloqueado', evidence: 'code-anchor', capabilities: ['strange-19-reroll-only-when-source-absent'], disposition: 'bloqueado' }),
    rec({ id: 'gap:tombs-of-the-desolation', kind: 'gap', cur: 'CUR-021', sourceId: 'sotdl:tombs-of-the-desolation', selection: 'bloqueado', evidence: 'code-anchor', capabilities: ['conditional-branch'], disposition: 'bloqueado' }),
    rec({ id: 'gap:demon-lords-companion', kind: 'gap', cur: 'CUR-021', sourceId: 'sotdl:demon-lord-s-companion', selection: 'bloqueado', evidence: 'code-anchor', capabilities: ['conditional-branch'], disposition: 'bloqueado' }),
    rec({ id: 'gap:uncertain-faith', kind: 'gap', cur: 'CUR-021', sourceId: 'sotdl:uncertain-faith', selection: 'bloqueado', evidence: 'code-anchor', capabilities: ['conditional-branch'], disposition: 'bloqueado' }),
    rec({ id: 'gap:purchase-system', kind: 'gap', cur: 'CUR-020', sourceId: CORE, selection: 'adiado', evidence: 'code-anchor', capabilities: ['quote-lots-only'], disposition: 'adiado' }),
    rec({ id: 'gap:full-combat', kind: 'gap', cur: 'CUR-020', sourceId: CORE, selection: 'adiado', evidence: 'code-anchor', capabilities: ['armor-weapon-preview-only'], disposition: 'adiado' }),
    rec({ id: 'gap:other-ancestries-paths-spells', kind: 'gap', cur: 'CUR-022/029', sourceId: CORE, selection: 'adiado', evidence: 'code-anchor', capabilities: ['outside-human-l0-slice'], disposition: 'adiado' }),
    rec({ id: 'gap:level-1', kind: 'gap', cur: 'CUR-022', sourceId: CORE, selection: 'adiado', evidence: 'code-anchor', capabilities: ['issue-21'], disposition: 'adiado' }),
    rec({ id: 'gap:ruleset-enablement', kind: 'gap', cur: 'CUR-037', sourceId: CORE, selection: 'bloqueado', evidence: 'code-anchor', capabilities: ['rulesetEnabled:false', 'fictionalData-unchanged', 'needs-review-unchanged'], disposition: 'bloqueado' }),
    rec({ id: 'procedure:human-attributes', kind: 'procedure', cur: 'CUR-015', sourceId: ONLY, selection: 'fora-recorte-base', evidence: 'code-anchor', capabilities: ['already-in-human-l0-base'], disposition: 'referencia' }),
    rec({ id: 'procedure:expanded-free-appearance', kind: 'procedure', cur: 'CUR-016', sourceId: ONLY, selection: 'selecionado-manual', evidence: 'code-anchor', capabilities: ['player-fields', 'not-sibling-gender'], disposition: 'lote-only-human' }),
    rec({ id: 'procedure:roleplaying-questions', kind: 'procedure', cur: 'CUR-014', sourceId: CORE, selection: 'adiado', evidence: 'code-anchor', capabilities: ['optional-free-text', 'does-not-delete-table-results'], disposition: 'adiado', notes: 'destino-35-36' }),
    rec({ id: 'procedure:dimension-composition', kind: 'procedure', cur: 'CUR-021', sourceId: ONLY, selection: 'selecionado-manual', evidence: 'code-anchor', capabilities: ['size-exceptions-preserved', 'no-extra-life-rolls'], disposition: 'lote-only-human' }),
    rec({ id: 'procedure:partial-literacy', kind: 'procedure', cur: 'CUR-017', sourceId: ONLY, selection: 'selecionado-manual', evidence: 'code-anchor', capabilities: ['read-and-write-eligible', 'partial-manual-review'], disposition: 'lote-only-human' }),
  ];
  records.push(...gaps);

  const evidenceGaps: [string, string, MatrixEvidence, string][] = [
    ['evidence:rules-ancestry-md', 'sha256:020d9d62d9046475552dbaf9f989f07e69b87b7a386cadc1af3e82f930502baf', 'hash-declarado-nao-refeito', ONLY],
    ['evidence:rules-compendium-md', 'sha256:af5b377d003c96910c5c7d4c4909a66d381513cbda93de22b5d83a6ca5474ece', 'hash-declarado-nao-refeito', CORE],
    ['evidence:correction-core-professions', 'sha256:4609a3f4a51c5bc1fa77af9db00a757adc381d78301c2adb85661a53f421c150', 'hash-declarado-nao-refeito', CORE],
    ['evidence:correction-core-interesting-things', 'sha256:836006ebb1021f9af6075d5d19d8665e429bd6ac9062b79b1dcd3a691934ef61', 'hash-declarado-nao-refeito', CORE],
    ['evidence:correction-core-introduction', 'sha256:51524877da4e81c6146392d35f4fdca222e6e0b4ff9b7507b0e93c6bcb43f9ef', 'hash-declarado-nao-refeito', CORE],
    ['evidence:correction-core-languages', 'sha256:18695a183fdf83e51b3816b0bc06f2c2121c1787cb2468aeff68d16a6e041de0', 'hash-declarado-nao-refeito', CORE],
    ['evidence:correction-oddities-tables', 'sha256:d3431ac28254cc4ee5910197b64dbae14744838eaf8bb983b73d4bb3a765620a', 'hash-declarado-nao-refeito', ODD],
    ['evidence:correction-fears-desires', 'sha256:1623f63a467016cb940701c088bf4647fa43a9eb730b6817d905e9586113184f', 'hash-declarado-nao-refeito', ONLY],
    ['evidence:pilot-creation-table-inventory', 'output-hash-unpinned', 'local-only', ONLY],
    ['evidence:pilot-professions-languages', 'output-hash-unpinned', 'local-only', ONLY],
    ['evidence:pilot-wealth-equipment', 'output-hash-unpinned', 'local-only', ONLY],
    ['evidence:pilot-interesting-things', 'output-hash-unpinned', 'local-only', ODD],
    ['evidence:pilot-items', 'output-hash-unpinned', 'local-only', CORE],
    ['evidence:pilot-table-closure', 'output-hash-unpinned', 'local-only', ONLY],
    ['evidence:pilot-core-level-zero', 'output-hash-unpinned', 'local-only', CORE],
    ['evidence:pilot-human-ancestry', 'output-hash-unpinned', 'local-only', ONLY],
    ['evidence:pilot-creation-decisions', 'output-hash-unpinned', 'local-only', CORE],
  ];
  for (const [id, hash, evidence, sourceId] of evidenceGaps) {
    records.push(rec({
      id, kind: 'evidence-gap', cur: 'CUR-016/021', sourceId, selection: 'bloqueado', evidence,
      capabilities: [hash], disposition: 'bloqueado', notes: 'bytes-ausentes-neste-checkout',
    }));
  }

  const ids = records.map(row => row.id);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate matrix identity');
  const sum = (kind: string) => records.filter(row => row.kind === kind).reduce((total, row) => total + row.represents, 0);
  if (sum('item-definition') !== 409) throw new Error(`Catalog definitions accounted ${sum('item-definition')}`);
  if (sum('item-reference') !== 641) throw new Error(`Catalog references accounted ${sum('item-reference')}`);
  if (sum('flow') !== 70) throw new Error(`Flows accounted ${sum('flow')}`);
  if (records.filter(row => row.kind === 'query' && row.capabilities.includes('lookup-by-lifestyle')).length !== 5) throw new Error('Lookup query count drifted');
  const flowRows = records.filter(row => row.kind === 'flow').reduce((total, row) => total + Number(row.capabilities.find(cap => cap.startsWith('rows:'))!.slice(5)), 0);
  if (flowRows !== 901) throw new Error(`Declared range rows rederived ${flowRows}, CUR-021 states 901`);
  const evidenceIds = new Set(records.filter(row => row.kind === 'evidence-gap').map(row => row.id));
  const hashRows = records.filter(row => row.evidence === 'hash-declarado-nao-refeito');
  if (hashRows.length !== 258) throw new Error(`Hash-declared rows drifted: ${hashRows.length}`);
  for (const row of hashRows) {
    if (!row.evidenceRef.startsWith('evidence:') || !evidenceIds.has(row.evidenceRef)) throw new Error(`Hash row ${row.id} missing evidenceRef ${row.evidenceRef}`);
  }
  const groupedLocalOnly: [string, number][] = [
    ['pilot-profession:core:martial:*', 12],
    ['pilot-profession:core:religious:*', 7],
    ['pilot-profession:core:wilderness:*', 17],
    ['class:source-grant-only', 57],
    ['class:exact-definition-refs', 182],
    ['class:generic-editable-refs', 75],
  ];
  for (const [id, count] of groupedLocalOnly) {
    const row = records.find(item => item.id === id);
    if (!row || row.represents !== count || row.evidence !== 'local-only' || row.linkedDefinition !== 'local-only') throw new Error(`Grouped local-only row drifted: ${id}`);
  }
  if (groupedLocalOnly.reduce((total, [, count]) => total + count, 0) !== 350) throw new Error('Grouped local-only total drifted');
  for (const row of records) {
    if (row.sourceVersion !== null || !row.sourceVersionReason || !row.review || row.consumers.length === 0 || row.consequenceTypes.length === 0 || !row.linkedDefinition || !row.evidenceRef) throw new Error(`Acceptance column missing on ${row.id}`);
  }
  if (records.find(row => row.id === 'evidence:correction-oddities-tables')?.sourceId !== ODD) throw new Error('Oddities correction source drifted');

  records.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
  const countBy = (key: 'selection' | 'disposition' | 'evidence' | 'kind') => Object.fromEntries(
    [...records.reduce((map, row) => map.set(row[key], (map.get(row[key]) ?? 0) + row.represents), new Map<string, number>())].sort(([a], [b]) => a.localeCompare(b)),
  );
  const blockers: MatrixBlocker[] = [
    { id: 'act1-local-hash-check', owner: 'ambiente', count: 258, activities: [1], summary: 'A atividade 1 permanece aberta. rules/, curation/pilot/ e curation/corrections/ estão ausentes, então os seis formalizadores não rodaram --check. 258 registros ficam hash-declarado-nao-refeito e apontam evidenceRef para um hash declarado, não recomputado.' },
    { id: 'act3-act5-grouped-local-only', owner: 'curador', count: 350, activities: [3, 5], lots: ['lote-core', 'lote-kits-itens'], members: groupedLocalOnly.map(([id, count]) => ({ id, count })), summary: '350 identidades seguem agrupadas com evidência local-only: 36 opções de profissão Core (atividade 3) e 314 registros de catálogo (atividade 5: 57 definições sem perfil, 182 referências exatas, 75 referências genéricas). O grupo não é evidência individual.' },
    { id: 'act2-curator-accepts-matrix', owner: 'curador', summary: 'Aceitar o recorte: ambos os procedimentos e ambas as fontes de Interesting Things permanecem selecionados. Pendência manual continua como resultado selecionado.' },
    { id: 'act2-contract-version', owner: 'engenheiro', summary: 'Definir contrato novo ou evolução versionada, preservando os 16 arquivos congelados e a projeção mecânica 0.2.0.' },
    { id: 'act2-synthetic-fixtures-only', owner: 'ambiente', summary: 'Bytes de piloto, correções e MDs estão ausentes. A atividade 2 usa fixtures sintéticas. Hash conferido dos insumos reais fica para a conferência local, antes do lote.' },
    { id: 'act2-weighted-ranges', owner: 'engenheiro', summary: 'O contrato precisa de faixas com peso, colunas independentes, caudas abertas, consultas sem dado extra e side rolls com fase. Três categorias Core agregadas ainda aguardam a reextração de todos os inícios de faixa.' },
    { id: 'act2-pending-effects', owner: 'engenheiro', summary: 'O handler devolve efeito tipado ou pendência. Ramos externos, gerador desabilitado, escolha ambígua e perfil genérico permanecem pendências.' },
    { id: 'act2-no-promotion', owner: 'curador', summary: 'Manter needs-review, fictionalData false e ruleset desabilitado. Paginação de PDF não foi inspecionada nesta auditoria.' },
  ];
  return {
    schemaVersion: 1,
    task: 'issue-34-activity-1',
    reviewDate: '2026-11-02',
    issue: 34,
    activity: 1,
    policy: 'ids-hashes-counts-dispositions-only',
    closure: 'pending-act1-local-hash-check',
    records,
    blockers,
    counts: {
      matrixRows: records.length,
      accountedIdentities: records.reduce((total, row) => total + row.represents, 0),
      tables: sum('table'),
      numericFlows: sum('flow'),
      lifestyleLookups: 5,
      procedureQueries: records.filter(row => row.kind === 'query').length,
      links: sum('link'),
      professionOptions: sum('profession-option'),
      grantPrograms: sum('grant-program'),
      interestingOutcomes: sum('interesting-outcome'),
      itemDefinitions: sum('item-definition'),
      itemReferences: sum('item-reference'),
      rangeRowsRederived: flowRows,
      hashDeclaredNotRecomputed: hashRows.length,
      groupedLocalOnlyIdentities: 350,
      outcomeSideRolls,
      reviewedSideRolls: 8,
      contextualDiceMentionsDeclared: 77,
      selectionAndReference: records.filter(row => row.selection === 'selecionado' && row.disposition === 'referencia').reduce((total, row) => total + row.represents, 0),
      ...Object.fromEntries(Object.entries(countBy('selection')).map(([key, value]) => [`selection:${key}`, value])),
      ...Object.fromEntries(Object.entries(countBy('disposition')).map(([key, value]) => [`disposition:${key}`, value])),
    },
  };
}

function tally(records: MatrixRecord[], kind: string) {
  return records.filter(row => row.kind === kind).reduce((total, row) => total + row.represents, 0);
}

export function renderActivity1Markdown(matrix: Activity1Matrix) {
  const tables = matrix.records.filter(row => row.kind === 'table');
  const tableRows = tables.map(row => `| \`${row.id}\` | null | ${row.review} | ${row.consumers.join(' ')} | ${row.consequenceTypes.join(' ')} | \`${row.linkedDefinition}\` | \`${row.evidenceRef}\` | ${row.selection} | ${row.evidence} | ${row.disposition} |`).join('\n');
  const findings = matrix.records.filter(row => row.kind === 'finding')
    .map(row => `| \`${row.id}\` | ${row.selection} | ${row.capabilities.find(cap => cap.startsWith('status:'))} | ${row.notes ?? ''} |`).join('\n');
  const blockers = matrix.blockers.map(row => `| \`${row.id}\` | ${row.owner} | ${row.count ?? ''} | ${(row.activities ?? []).join(', ')} | ${row.summary} |`).join('\n');
  const counts = matrix.counts;
  return `# Matriz de lacunas — #34 / atividade 1

Registro estrutural do recorte CUR-016–021 para a [issue #34](https://github.com/AntonioVCruz/sotdl-character-forge/issues/34), emitido originalmente sem corpus. Os estados \`pending-act1-local-hash-check\` e \`hash-declarado-nao-refeito\` do JSON são o snapshot dessa emissão; não são o estado atual do fechamento local.

## Fechamento local posterior — atividade 1 concluída

A [reconciliação e conferência local](fechamento-issue34-atividade1.md) encerrou \`act1-local-hash-check\`: 301 hashes de bytes, 1.060 referências, 233 referências de saída, oito pins de fonte e os 258 registros correspondentes foram conferidos. Os seis geradores CUR-016–021 passaram em \`--check\`. O [comprovante](../curation/reviews/issue34-activity1-local-verification.json) vincula o hash canônico desta matriz estrutural e a prova de reconciliação dos metadados, sem reclassificar seus registros ou promover conteúdo.

Reprodução no ambiente autorizado: \`npm run curation:verify:activity1\`. Esta emissão estrutural continua reproduzível sem livros; o comando local exige os bytes pinados e não atualiza hashes automaticamente. Atividade 2 já aceita; atividades 3–8 e as restrições de fonte/paginação/handlers conservam seus próprios gates.

## Snapshot da auditoria sem corpus

As seções seguintes descrevem a disponibilidade e os bloqueios no ambiente da emissão estrutural original. O fechamento atual é o registro local vinculado acima.

A lista normativa por identidade é [\`matriz-lacunas-issue34-atividade1.json\`](matriz-lacunas-issue34-atividade1.json). Cada registro tem \`sourceVersion\`, \`sourceVersionReason\`, \`review\`, \`consumers\`, \`consequenceTypes\`, \`linkedDefinition\` e \`evidenceRef\`. \`sourceVersion\` é \`null\` em todos: \`sources.json\` deixa \`revision\` nula e \`editionStatus\` unconfirmed. Nenhum dos dois arquivos contém excerto de livro.

## Método e evidência disponível

O gerador \`tools/curation/issue34-activity1-matrix.ts\` reúne identidades que o código versionado já determina: tabelas de CUR-016, arestas, mapas de equipamento, catálogo Core, \`details()\` de Interesting Things e as disposições de CUR-021. Faixas cuja cobertura declarada e o esquema de id implicam o início da faixa entram como \`entailed-coverage\`. O que só existe no JSON local entra como grupo com \`represents\` e evidência \`local-only\`.

| Situação neste checkout | Consequência para o hash |
|---|---|
| \`curation/pilot/\`, \`curation/reports/\`, \`curation/corrections/\`, \`curation/history/\` e \`rules/\` estão ausentes e ignorados | Saídas CUR-016–021 e transcrições não foram refeitas. Hashes declarados ficam \`hash-declarado-nao-refeito\`. |
| Formalizadores, modelos e \`pilot-table-ranges.ts\` / \`pilot-item-definitions.ts\` / \`interesting-things-map.ts\` estão no Git | Estrutura, ids e contagens rederivadas abaixo. |
| \`sources.json\` marca Core, Only Human e Oddities com \`edition: null\`, \`pdf: not-provided-in-rules\`, \`paginationStatus: declared-only\`, \`provenanceStatus: needs-review\` | Nenhuma página impressa foi inspecionada nesta auditoria. |
| Stubs públicos \`0.1.0\` e a projeção mecânica \`0.2.0\` | Fora desta atividade. \`fictionalData\`, \`needs-review\` e \`rulesetEnabled\` não mudam. |

Hashes declarados e não recomputados, porque os bytes não estão no checkout:

| Id | SHA-256 declarado |
|---|---|
| MD de ancestries no manifesto de insumos | \`020d9d62d9046475552dbaf9f989f07e69b87b7a386cadc1af3e82f930502baf\` |
| MD do compêndio de regras no manifesto | \`af5b377d003c96910c5c7d4c4909a66d381513cbda93de22b5d83a6ca5474ece\` |
| Anexo de profissões Core | \`4609a3f4a51c5bc1fa77af9db00a757adc381d78301c2adb85661a53f421c150\` |
| Anexo de Interesting Things Core | \`836006ebb1021f9af6075d5d19d8665e429bd6ac9062b79b1dcd3a691934ef61\` |
| Anexo de introdução Core | \`51524877da4e81c6146392d35f4fdca222e6e0b4ff9b7507b0e93c6bcb43f9ef\` |
| Anexo de idiomas | \`18695a183fdf83e51b3816b0bc06f2c2121c1787cb2468aeff68d16a6e041de0\` |
| Anexo de Oddities, pinado no formalizador | \`d3431ac28254cc4ee5910197b64dbae14744838eaf8bb983b73d4bb3a765620a\` |
| Confirmação Fears/Desires, pinada no fechamento | \`1623f63a467016cb940701c088bf4647fa43a9eb730b6817d905e9586113184f\` |

Os relatórios \`curation/reports/*.json\` prometem hashes de saída. Esses arquivos estão ausentes, e o Git não guarda o digest da saída. O manifesto de kits Core (\`curation/corrections/core-starting-equipment-2026-10-27/\`) também está ausente; o digest dele não foi copiado para esta matriz.

A rederivação estrutural fecha as contagens publicadas de CUR-021: **74 tabelas, 70 fluxos, 901 linhas/faixas, 73 vínculos, 285 definições especiais e 75 referências fora do inventário**. Isso confere o modelo versionado. Não substitui \`--check\` com os bytes locais. O bloqueio \`act1-local-hash-check\` cobre os ${counts.hashDeclaredNotRecomputed} registros \`hash-declarado-nao-refeito\`.

CUR-021 conta **77 menções contextuais a dados** no texto auditado. Essas menções não são 77 comandos de criação. O código versionado individualiza dois subconjuntos dessas menções: **${counts.reviewedSideRolls} regras revistas** (\`kind: side-roll\`) e **${counts.outcomeSideRolls} \`sideRolls\` de Interesting Things** anexados aos resultados. O fechamento também conserva menções de anos narrativos, dados de uso e quantidades que não viraram comando. Recontar as 77 exige \`curation/pilot/table-closure.json\`, ausente neste checkout.

## Contagens

| Medida | Total |
|---|---:|
| Linhas da matriz | ${counts.matrixRows} |
| Identidades contábeis (\`represents\`) | ${counts.accountedIdentities} |
| Tabelas | ${counts.tables} |
| Fluxos numéricos | ${counts.numericFlows} |
| Linhas/faixas rederivadas | ${counts.rangeRowsRederived} |
| Consultas de procedimento, incluindo 5 lookups | ${counts.procedureQueries} |
| Vínculos | ${counts.links} |
| Opções de profissão/concessão | ${counts.professionOptions} |
| Programas de concessão | ${counts.grantPrograms} |
| Resultados de Interesting Things | ${counts.interestingOutcomes} |
| Definições de catálogo | ${counts.itemDefinitions} |
| Referências de catálogo | ${counts.itemReferences} |

Seleção contábil: selecionado ${counts['selection:selecionado']}; selecionado com resolução manual ${counts['selection:selecionado-manual']}; adiado ${counts['selection:adiado']}; bloqueado ${counts['selection:bloqueado']}; referência ${counts['selection:referencia']}; fora do recorte porque a base Human L0 já cobre ${counts['selection:fora-recorte-base']}.

Disposição contábil: lote Core ${counts['disposition:lote-core']}; lote Only Human ${counts['disposition:lote-only-human']}; lote Oddities ${counts['disposition:lote-oddities']}; lote kits/itens ${counts['disposition:lote-kits-itens']}; adiado ${counts['disposition:adiado']}; bloqueado ${counts['disposition:bloqueado']}; referência ${counts['disposition:referencia']}.

Seleção e disposição são eixos diferentes. **${counts.selectionAndReference} registros são \`selecionado\` e \`referencia\` ao mesmo tempo.** A consequência não é um segundo ganho: 19 referências de moeda apontam para o programa de concessão, 75 referências fora do inventário apontam para o resultado de Interesting Things, e 2 achados resolvidos apontam para as tabelas que já carregam o resultado. Somar seleção com disposição conta a mesma identidade duas vezes.

Uma identidade bloqueada aqui é um ramo externo, uma página não conferida ou um hash sem bytes. A consequência publicada correspondente permanece na matriz como pendência. Adiar o gerador de Dark Passages não remove \`oddities:books:20\`.

## Recorte selecionado

Padrão de ancestralidade: Human Development (Only Human). Alternativa preservada: procedimento Core, com profissões e riqueza próprias. O modo de atributos já entregue na base fica de fora desta atividade.

Padrão de Interesting Things: Oddities. Alternativa preservada: seis tabelas Core. Fonte desabilitada vira pendência, com o procedimento escolhido explícito. Há três concessões: \`core-initial-thing\`, \`only-human-initial-thing\` e \`only-human-minor-windfall-10\`.

Lotes que a atividade 2 precisa conseguir nomear:

- **lote-core** — tabelas de ancestry/background, profissões Core, Wealth, Personality Traits e Interesting Things Core.
- **lote-only-human** — Human Development, profissões da expansão, modificadores de lifestyle, idiomas condicionais e ciclos.
- **lote-oddities** — seletor e doze tabelas.
- **lote-kits-itens** — 12 kits, programas de profissão e extras, definições Core, escolhas ambíguas, genéricos e conjuntos de resultado.

## Matriz das 74 tabelas

\`sourceVersion\` é null em todas as linhas, pelo motivo acima. As outras colunas de aceite estão no JSON para os demais registros.

| ID | Versão | Revisão | Consumidores | Consequências | Definição vinculada | Evidência | Seleção | Estado da evidência | Disposição |
|---|---|---|---|---|---|---|---|---|---|
${tableRows}

As cinco consultas \`only-human:clothing|weapons|personal-gear|special-gear|money\` leem o lifestyle já obtido. Personality Traits (\`core:role-traits\`) é uma tabela com dois fluxos independentes, \`#positive\` e \`#negative\`.

Quatro tabelas fecham ciclo no grafo versionado: \`only-human:character-fate\`, \`only-human:piety\`, \`only-human:siblings\`, \`only-human:strange\`. O achado \`finding:recursion\` lista esses ids.

## Fluxos, profissões e concessões

Cada tabela com dado tem um fluxo \`#main\`, exceto \`core:role-traits\`, que tem dois. A soma das linhas é 901, igual à auditoria CUR-021. Os testes daquele fechamento exigem cobertura 70/70; este checkout não reexecutou a enumeração de dados contra o texto.

Profissões: 168 opções de tabela + \`pilot-profession:only-human:direct:occult\` = 169. Categorias com uma faixa por face, ou com pares contíguos que cobrem o dado inteiro, foram expandidas. O bloqueio \`act3-act5-grouped-local-only\` cobre **350 identidades** que continuam agrupadas: as 36 abaixo e mais 314 registros de catálogo (57 \`class:source-grant-only\`, 182 \`class:exact-definition-refs\`, 75 \`class:generic-editable-refs\`). \`linkedDefinition\` desses grupos é \`local-only\`. A atividade 3 individualiza as profissões; a atividade 5 individualiza o catálogo.

| Grupo | Faixas | Ids individuais já fixados | Restante local-only |
|---|---:|---|---:|
| \`core:martial\` | 14 | \`r03\`, \`r13\` | 12 |
| \`core:religious\` | 11 | \`r01\`, \`r03\`, \`r09\`, \`r11\` | 7 |
| \`core:wilderness\` | 17 | nenhum início além da contagem | 17 |

Only Human Religious usa d6 e seis faixas simples. As outras categorias expandidas têm os inícios de faixa no formalizador de equipamento. Programa material \`profession:<id>\` existe só para opção de tabela Only Human, e só quando a profissão é concedida ao personagem. Opção Core e Occult direto ficam com \`program:null\`.

Dezenove modelos de desenvolvimento e dezenove programas extras estão no JSON, com ids estáveis (\`childhood-*\`, \`windfall-*\`, \`strange-*\`, \`core-background-*\`, \`extra:*\`). Doze kits: \`core:kit:<lifestyle>\` e \`only-human:kit:<lifestyle>\` para os seis estilos. Moeda de kit e as sete concessões em moeda listadas no formalizador formam as 19 referências \`currency-preserved\`.

Cinco escolhas de perfil, sem seleção automática: escudo do kit Core wealthy; spear em \`only-human:military:r03\` e \`only-human:wilderness:r17\`; costume e dress em \`only-human:common:r11\`.

## Interesting Things e catálogo

360 resultados: \`core:{1-6}:{1-20}\` e \`oddities:<tabela>:{1-20}\`. A classificação usa \`details()\` (kind, dados de criação/uso, tags, escolha de GM). O texto da alternativa não entra nesta matriz.

Seis tabelas de Oddities (\`art\`, \`books\`, \`minor-magic\`, \`pets\`, \`personal\`, \`ingredients\`) são as que o formalizador só aceita se a transcrição do usuário atualizar 120 linhas e resolver 13 associações. O arquivo dessa transcrição está ausente; o hash pinado foi registrado e não recomputado. As outras seis tabelas têm spans de linha versionados, também sem o MD para refazer o excerpt.

\`oddities:books:20\` permanece selecionado, kind \`text-reference\`, com o gancho \`dark-passages-books-and-passages\` desabilitado. O gap do gerador está adiado.

Catálogo contábil 409 = 67 definições \`pilot-item:core:*\` + 285 \`pilot-item:thing:*\` + 57 \`class:source-grant-only\`. Referências 641 = 360 de Interesting Things + 182 exatas + 75 genéricas + 5 escolhas + 19 moedas. As 182 e as 75 são grupos: o ledger local é que tem o caminho de cada folha. Preço de linha Core não foi relido; a célula de preço continua por extrair na atividade 5.

28 blocos \`item-definition:rule:*\` ficam como referência. Eles não são handlers.

## Achados CUR-016

| Achado | Seleção | Estado no código | Nota |
|---|---|---|---|
${findings}

## Fora do lote e bloqueios que continuam visíveis

- Atributos Human (\`procedure:human-attributes\`) já estão na base entregue.
- Campos livres de Roleplaying Questions seguem para #35/#36. Eles não apagam resultado de tabela.
- Compra, combate completo, outras ancestries/paths/spells e nível 1 ficam adiados.
- Ramos de Terrible Beauty, Tooth and Claw, Tombs of the Desolation, Demon Lord's Companion e Uncertain Faith ficam bloqueados como conteúdo dessas fontes. O ramo condicional da tabela Human continua selecionado como pendência.
- Habilitação de ruleset, promoção \`needs-review\` → \`curated\` e \`fictionalData: true\` ficam bloqueados.

## O que a atividade 2 precisa receber

O contrato consumível pode começar com fixtures sintéticas. Ele ainda depende das decisões abaixo. Sem elas, o schema arriscaria tratar lacuna como aprovação ou pendência como linha descartada.

| Bloqueio | Dono | Contagem | Atividades | Efeito |
|---|---|---:|---|---|
${blockers}

A matriz publica o recorte e conserva os bloqueios daquela emissão sem corpus. O fechamento posterior de \`act1-local-hash-check\` está no comprovante e no relatório locais vinculados no início. Nenhuma consequência obrigatória foi removida por estar adiada ou bloqueada.

Conferência local exigida para reproduzir o fechamento: \`node tools/curation/creation-tables.mjs --check\`, \`professions-languages.mjs --check\`, \`wealth-equipment.mjs --check\`, \`interesting-things.mjs --check\`, \`pilot-items.mjs --check\` e \`pilot-tables.mjs --check\`; todos aprovados no fechamento registrado.
`;
}
