import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { buildArtifacts as buildHuman } from './human-ancestry-formalizer';
import { sourceLines } from './ancestry-extractor';

const SOURCE = 'sotdl:only-human';
const PATH = 'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
const DATA = 'curation/pilot/creation-table-inventory.json', REPORT = 'curation/reports/creation-table-inventory.json';
const sha = (v: string | Buffer) => createHash('sha256').update(v).digest('hex');
const dice = (count: number, sides: number) => ({ count, sides });
// Explicit inventory of the pinned Only Human text. These are table boundaries, not reconstructed outcomes.
const expanded: [string, string, number, number, [number, number] | null, string, string][] = [
  ['ancestors', 'Ancestors', 13738, 13760, [3,6], 'root-once', 'Family reputation; do not turn narrative into an automatic bonus.'],
  ['family-circumstances', 'Family Circumstances', 13761, 13787, [3,6], 'root-once', 'Childhood modifier −6/−3/−1/+1/+3/+6; family profession drawn from restricted categories by result, not the full d6 selector.'],
  ['parents', 'Parents', 13788, 13801, [3,6], 'root-once', 'Death leads to Circumstances of Death; the text does not settle one shared cause versus separate causes when both parents died.'],
  ['siblings', 'Siblings', 13802, 13809, [1,20], 'root-once', 'Count may be 0, 1, 1d3+1, 1d6+2 or 2d6. Fate is rolled for each sibling, not once for the whole family.'],
  ['sibling-gender', 'Sibling Genders', 13810, 13813, [1,6], 'per-sibling', 'Conditional on a sibling existing; do not apply this table to PC gender.'],
  ['sibling-age', 'Sibling Ages', 13814, 13819, [4,6], 'per-sibling', '4d6, not 3d6; twin/triplet result and relative age.'],
  ['character-fate', 'Character Fates', 13820, 13832, [3,6], 'per-related-character', 'Dead → death cause; living siblings may optionally receive details from some/all other tables, creating potential recursion.'],
  ['death', 'Circumstances of Death', 13833, 13841, [3,6], 'conditional-death', 'Reused by parents, character fates and Life Experience death; track subject identity.'],
  ['age', 'Ages', 13846, 13869, [3,6], 'root-once', 'One Childhood roll; Life Experience count 0–6 by age band. Child sets Size 1/2 and halves dimensions; adolescent reduces dimensions 25%.'],
  ['build', 'Builds', 13870, 13887, [3,6], 'root-once', 'Result 3 explicitly sets Size 1/2. Height/weight side rolls, inches/pounds and per-inch weight changes; sex-based baselines in footnote.'],
  ['appearance', 'Appearances', 13888, 13906, [3,6], 'root-once', 'Ordered description steps; later setbacks can reduce steps to a minimum hideous.'],
  ['childhood', 'Childhoods', 13916, 13947, [3,6], 'once-from-age', 'Family modifier applies before lookup; 3 or less / 18 or more are open tails. Speech/literacy, family profession, artisan and scholarship choices.'],
  ['life', 'Life Experiences', 13948, 13969, [3,6], 'repeat-from-age', 'Repeat 0–6 times; effects accumulate in event order. Death allows restart/return or conditional ancestry change, not silent reroll.'],
  ['major-setback', 'Major Setbacks', 13970, 14039, [1,20], 'conditional-life', 'State/duration rolls, appearance reductions, lifestyle penalties, choices and conditional story complications; GM enemy.'],
  ['minor-setback', 'Minor Setbacks', 14040, 14088, [1,20], 'conditional-life', 'Lifestyle penalties, states, d6 odd/even responsibility, years and GM secrets.'],
  ['minor-windfall', 'Minor Windfalls', 14089, 14146, [1,20], 'conditional-life', 'Lifestyle bonuses, 1d3 children with optional fates, languages, professions, items, Fortune, social boon and extra Interesting Thing.'],
  ['major-windfall', 'Major Windfalls', 14147, 14210, [1,20], 'conditional-life', 'Conditional faerie favor or GM item; traditions, connections, property, 1d3+1 incantations/potions, favor expiry d6, companions and one escape from death.'],
  ['strange', 'Strange Events', 14211, 14300, [1,20], 'conditional-life', 'Age/Size changes, state rolls and d6 branches, previous-life professions, literate Dwarfish. Result 19 explicitly rerolls ignoring 19 if Tooth and Claw is unavailable.'],
  ['profession-router', 'Random Professions', 14307, 14314, [1,6], 'when-profession-directed', 'Select scholarship/common/criminal/military/religious/wilderness. Lines 14315–14318 are stray duplicated prose, not results.'],
  ['scholarship', 'Scholar: Areas of Scholarship', 14319, 14333, [1,20], 'conditional-profession-or-education', 'Ten 2-point ranges; gain a related book. Do not import Core Academic literacy automatically.'],
  ['common', 'Common Professions', 14334, 14375, [1,20], 'conditional-profession', 'Each result includes equipment. Artist allows poet/writer if already literate, unlike the Core grant; internal specializations/choices and money rolls.'],
  ['criminal', 'Criminal Professions', 14376, 14393, [1,20], 'conditional-profession', 'Two-point ranges, equipment and coin/quantity rolls; alternatives remain within a result.'],
  ['military', 'Military Professions', 14394, 14412, [1,20], 'conditional-profession', 'Two-point ranges and equipment; distinct source/category from Core Martial.'],
  ['religious', 'Religious Professions', 14413, 14422, [1,6], 'conditional-profession', 'This subtable uses d6. Faith symbol in footnote; do not substitute the Core d20 Religious table.'],
  ['wilderness', 'Wilderness Professions', 14423, 14439, [1,20], 'conditional-profession', 'Two-point ranges with equipment/animal gains; choice/quantity and source references need formalization.'],
  ['lifestyle', 'Starting Lifestyles', 14450, 14457, [3,6], 'after-all-life-events', 'Add accumulated Life Experience modifiers before lookup. Different thresholds from Core Wealth; 3 or less / 18 or more are open tails.'],
  ['clothing', 'Clothing', 14458, 14469, null, 'lookup-by-lifestyle', 'Not another d6 roll. Clothing by lifestyle; 1d3 sets in higher lifestyles.'],
  ['weapons', 'Weapons', 14470, 14480, null, 'lookup-by-lifestyle', 'Not another random table; preserve fixed items, alternatives and 20 stones when sling branch applies.'],
  ['personal-gear', 'Personal Gear', 14481, 14495, null, 'lookup-by-lifestyle', 'Not another random table; quantities and empty results matter.'],
  ['special-gear', 'Special Gear', 14496, 14511, null, 'lookup-by-lifestyle', 'Healing potion plus one option for Comfortable/Wealthy; companions/horses at Rich. Generic editable item policy does not collapse gains.'],
  ['money', 'Wealth', 14512, 14519, null, 'lookup-by-lifestyle', 'Money expressions by lifestyle, not a second wealth-class roll. Preserve bits/cp/ss and quantity dice.'],
  ['personality', 'Personalities', 14524, 14554, [3,6], 'root-once', 'Expanded narrative table, distinct from Core Human Personality and optional Core Roleplaying Questions.'],
  ['relationships', 'Relationships', 14555, 14577, [3,6], 'root-once', 'Expanded narrative table; optional free-text fields do not delete its published outcomes.'],
  ['fears', 'Fears', 14578, 14607, [1,6], 'root-once', 'Extraction interleaves Fears and Desires columns; pairing must be reviewed, not guessed from line order.'],
  ['desires', 'Desires', 14578, 14607, [1,6], 'root-once', 'Shared extracted span with Fears; printed Value heading differs from Desires title. Keep column/header ambiguity explicit.'],
  ['obligations', 'Obligations', 14608, 14633, [3,6], 'root-once', 'Narrative guide; no numerical modifier inferred.'],
  ['morality', 'Morality', 14634, 14663, [3,6], 'root-once', 'Narrative guide; do not infer Corruption just from alignment-like prose.'],
  ['religion', 'Religious Beliefs', 14664, 14683, [3,6], 'root-once-and-piety-reroll', 'Supplement-specific distribution, including Uncertain Faith reference; not the Core religion table.'],
  ['piety', 'Piety', 14684, 14709, [3,6], 'root-once-with-published-recursion', 'Result 3 rerolls religion and piety; gain 1 Insanity for each repeated result 3 after the first. Not an unbounded silent loop.'],
];

type Link = { from: string; to: string; kind: string; instruction: string; startLine: number; endLine: number };
const edges: [string, string, string, string, number, number][] = [
  ['family-circumstances','childhood','modifier','Apply −6/−3/−1/+1/+3/+6 to the later Childhood roll by outcome.',13763,13785],
  ...['common','criminal','military','religious','wilderness'].map(t => ['family-circumstances',t,'restricted-category-choice','Use only categories permitted by the family result; no full-selector reroll implied.',13768,13783] as [string,string,string,string,number,number]),
  ['parents','death','conditional-roll','Dead-parent cases; multiplicity for both parents needs review.',13790,13801],
  ['siblings','character-fate','repeat','Roll once for each sibling, including the side-rolled sibling count.',13804,13809],
  ['siblings','sibling-gender','subject-context','Sibling detail table; do not apply to PC gender.',13802,13813],
  ['siblings','sibling-age','subject-context','Sibling relative age uses 4d6.',13802,13819],
  ['character-fate','death','conditional-roll','Dead result uses Circumstances of Death.',13824,13830],
  ['character-fate','siblings','optional-detail-recursion','Some/all other tables may add detail to living siblings; recursion and subject identity must be guarded.',13825,13832],
  ['age','childhood','repeat','Exactly once in all age bands.',13848,13869],
  ['age','life','repeat','0 child, 1 adolescent, 2 young adult, 3 adult, 4 middle-aged, 5 older, 6 venerable.',13848,13869],
  ['age','build','dimension-dependency','Age scales dimensions; Build has dimensional deltas. Ordering and later age changes need explicit composition review.',13848,13887],
  ['childhood','scholarship','conditional-roll','Good/finest education grants scholarship lookup, plus explicit speech/read/write.',13937,13947],
  ['childhood','common','choice-or-reference','Artisan choice or common/criminal fallback; family profession can be inherited.',13922,13947],
  ['childhood','criminal','choice-or-reference','Runaway/orphan fallback permits criminal profession.',13922,13929],
  ['life','death','conditional-roll','Death then player choice restart/return/conditional ancestry transformation.',13950,13955],
  ...[['major-setback',13956,13957],['minor-setback',13958,13959],['minor-windfall',13964,13965],['major-windfall',13966,13967],['strange',13968,13969]].map(([t,s,e]) => ['life',t,'conditional-roll','Roll d20 on the directed event table only.',s,e] as [string,string,string,string,number,number]),
  ['life','lifestyle','modifier','Worked result adds +1; repeat event history before lifestyle generation.',13960,13963],
  ['major-setback','lifestyle','modifier','Accumulated lifestyle penalties from individual outcomes.',13984,14006],
  ['minor-setback','lifestyle','modifier','Accumulated lifestyle penalties, not a replacement Core Wealth roll.',14047,14085],
  ['minor-windfall','lifestyle','modifier','Business/inheritance bonuses accumulate per selected event.',14093,14112],
  ['major-windfall','lifestyle','modifier','+3 bonuses from specific outcomes; stipend is a separate benefit.',14160,14194],
  ['minor-windfall','character-fate','optional-repeat','After all Life Experiences, optionally roll fate for each of 1d3 children.',14095,14099],
  ['minor-windfall','scholarship','choice-of-child','Education: language OR random area of scholarship.',14107,14110],
  ['minor-windfall','common','conditional-roll','One random Common profession, not full d6 type.',14114,14115],
  ['minor-windfall','core:thing-router','additional-result','Gain one extra Interesting Thing in addition to the initial one.',14116,14116],
  ['strange','profession-router','repeat','One random profession per remembered previous life; count 1d3.',14283,14286],
  ['strange','strange','conditional-reroll','If Tooth and Claw unavailable on result 19, reroll ignoring 19; preserve this published exception.',14289,14292],
  ...['scholarship','common','criminal','military','religious','wilderness'].map((t,i) => ['profession-router',t,'selector',`${i+1} selects this exact publication table; Religious child uses d6, others d20.`,14309+i,14309+i] as [string,string,string,string,number,number]),
  ...['clothing','weapons','personal-gear','special-gear','money'].map(t => ['lifestyle',t,'lookup','Resolve by the same selected lifestyle; no extra lifestyle roll.',14440,14519] as [string,string,string,string,number,number]),
  ['lifestyle','core:thing-router','initial-result','One initial Interesting Thing; not one per equipment lookup.',14440,14449],
  ['piety','religion','conditional-roll','First result 3 determines other true beliefs; preserve apparent/actual belief distinction.',14687,14692],
  ['piety','piety','conditional-reroll','Repeat Piety; each result 3 after the first adds 1 Insanity. Explicit bounds/manual resolution needed by runtime.',14687,14692],
];

export function validateInventoryGraph(ids: string[], links: Link[]) {
  const known = new Set(ids);
  if (known.size !== ids.length) throw new Error('Duplicate table identity');
  for (const link of links) if (!known.has(link.from) || !known.has(link.to) || !link.instruction || link.endLine < link.startLine) throw new Error(`Unresolved table link: ${link.from} -> ${link.to}`);
  const outgoing = new Map(ids.map(id => [id, links.filter(l => l.from === id).map(l => l.to)]));
  return ids.filter(id => {
    const visit = (at: string, seen: Set<string>): boolean => {
      if (seen.has(at)) return false; seen.add(at);
      return outgoing.get(at)!.some(next => next === id || visit(next, seen));
    };
    return visit(id, new Set());
  });
}

export async function buildArtifacts(root: string) {
  const parent = await buildHuman(root);
  for (const [path, data] of parent.artifacts) if (await readFile(resolve(root, path), 'utf8') !== data) throw new Error(`Stale CUR-015 dependency: ${path}`);
  const pilotPath = 'curation/pilot/core-level-zero.json', pilot = JSON.parse(await readFile(resolve(root, pilotPath), 'utf8'));
  const bytes = await readFile(resolve(root, PATH)), lines = sourceLines(bytes.toString('utf8'));
  const proof = (id: string, startLine: number, endLine: number) => {
    const selected = lines.slice(startLine-1,endLine); if (selected.length !== endLine-startLine+1) throw new Error('Table evidence range invalid');
    const excerpt = selected.map(l => l.text).join('\n');
    return { id, sourceId: SOURCE, path: PATH, inputSha256: sha(bytes), startLine, endLine, excerpt, excerptSha256: sha(excerpt),
      physicalPdfPage: null, printedPageVerified: null, parentInventoryId: 'ancestries:human-only-human' };
  };
  const only = expanded.map(([key,title,start,end,roll,activation,notes]) => ({
    id: `only-human:${key}`, title, sourceId: SOURCE, procedure: 'human-development', kind: roll ? 'random-table' : 'lifestyle-lookup',
    dice: roll ? dice(...roll) : null, selector: roll ? null : 'selected-starting-lifestyle', activation,
    manualMode: roll ? 'specific-procedure-requires-rolls' : 'published-inner-choices-only', notes,
    numericOutcomesApproved: false, runtimeEnabled: false, evidence: proof(`table:only-human:${key}`, start, end),
    contextEvidenceIds: ['human-expansion-procedure'],
  }));
  const coreDefs: [string,string,string,number,number,string,string][] = [
    ...['background','personality','religion','age','build','appearance'].map(k => [`human-${k}`,`Human ${k}`,`human-${k}`,k==='background'?1:3,k==='background'?20:6,'optional-ancestry-inspiration','roll-choose-or-create'] as [string,string,string,number,number,string,string]),
    ['profession-router','Profession Types','supplied-profession-router',1,6,'per-random-profession','manual-profession-choice-published'],
    ...['academic','common','criminal','martial','religious','wilderness'].map(k => [`profession-${k}`,`${k} Professions`,`supplied-profession-${k}`,1,20,'conditional-profession','manual-profession-choice-published'] as [string,string,string,number,number,string,string]),
    ['wealth','Wealth','wealth-table',3,6,'core-wealth-once','manual-override-not-established'],
    ['thing-router','Interesting Thing Tables','supplied-thing-router',1,6,'one-initial-plus-explicit-extra-results','manual-override-not-established'],
    ...[1,2,3,4,5,6].map(n => [`thing-${n}`,`Interesting Things Table ${n}`,`supplied-thing-${n}`,1,20,'selector-child','manual-override-not-established'] as [string,string,string,number,number,string,string]),
    ['role-traits','Personality Traits','role-table',1,20,'optional-inspiration-two-positive-at-least-one-negative','free-text-published-two-columns-not-one-joint-result'],
  ];
  const core = coreDefs.map(([key,title,evidenceId,count,sides,activation,manualMode]) => {
    const evidence = pilot.evidence.find((e: { id: string }) => e.id === evidenceId); if (!evidence) throw new Error(`Core table evidence missing: ${evidenceId}`);
    const numericAuditRef = key.startsWith('profession-') ? 'professionScope' : key === 'wealth' ? 'wealthScope' : key.startsWith('thing-') ? 'interestingThingsScope' : null;
    const additionalEvidenceIds = key === 'wealth' ? ['supplied-wealth-limits','wealth-procedure'] : key.startsWith('human-') ? ['ancestry-table-options'] : key.startsWith('profession-') ? ['supplied-profession-procedure','supplied-profession-router'] : key.startsWith('thing-') ? ['supplied-thing-procedure'] : ['role-traits'];
    for (const id of additionalEvidenceIds) if (!pilot.evidence.some((e: { id: string }) => e.id === id)) throw new Error(`Missing core instruction: ${id}`);
    return { id: `core:${key}`, title, sourceId: pilot.sourceId as string, procedure: 'core-alternative', kind: 'random-table',
      dice: dice(count,sides), selector: null, activation, manualMode,
      notes: key === 'role-traits' ? 'One printed table, two outcome columns. Do not couple positive/negative rolls by choosing a single row.' : key === 'wealth' ? '3–4/5–8/9–13/14–16/17/18, with recovered limits. Not Only Human Starting Lifestyles.' : key.startsWith('profession-') ? 'Keep the two starting choices, extra ancestry profession and language/literacy conversions distinct. Source-specific child dice.' : 'Preserve source procedure, outcome consequences, side rolls and explicit GM decisions.',
      numericAuditRef, numericOutcomesApproved: false, runtimeEnabled: false, evidence,
      contextEvidenceIds: additionalEvidenceIds };
  });
  const tables = [...core,...only];
  const diceSignals = tables.flatMap(table => {
    const matches = [...table.evidence.excerpt.matchAll(/\b(\d*)d(\d+)(?:\s*[+−–-]\s*\d+)?/g)];
    return matches.map((match,index) => ({ tableId: table.id, expression: match[0], count: Number(match[1] || 1), sides: Number(match[2]),
      role: index === 0 && table.dice?.count === Number(match[1] || 1) && table.dice?.sides === Number(match[2]) ? 'header-or-main-roll-signal' : 'conditional-roll-or-reference-signal',
      path: table.evidence.path, line: table.evidence.startLine + table.evidence.excerpt.slice(0,match.index).split('\n').length - 1,
      interpretedAsExecutableChild: false }));
  });
  const links: Link[] = edges.map(([from,to,kind,instruction,startLine,endLine]) => ({ from: `only-human:${from}`, to: to.startsWith('core:')?to:`only-human:${to}`, kind,instruction,startLine,endLine }));
  const addCoreLink = (from: string,to: string,kind: string,instruction: string) => {
    const table = core.find(t => t.id === from)!; links.push({from,to,kind,instruction,startLine:table.evidence.startLine,endLine:table.evidence.endLine});
  };
  for (const [n,k] of ['academic','common','criminal','martial','religious','wilderness'].entries()) addCoreLink('core:profession-router',`core:profession-${k}`,'selector',`${n+1} -> this Core d20 subtable; do not substitute an expansion child.`);
  for (let n=1;n<=6;n++) addCoreLink('core:thing-router',`core:thing-${n}`,'selector',`${n} -> Table ${n}, one d20 plus only applicable side rolls.`);
  const cyclicTables = validateInventoryGraph(tables.map(t=>t.id),links);
  const findings = [
    { id:'fears-desires-columns', tableIds:['only-human:fears','only-human:desires'], type:'transcription-review', reason:'Interleaved columns and Value/Desires title mismatch; preserve both views, do not guess pairings.' },
    { id:'profession-selector-stray-prose', tableIds:['only-human:profession-router'], type:'boundary-review', reason:'Lines 14315–14318 duplicate Strange prose outside the numeric selector; retained as editorial context, not profession results.' },
    { id:'dimension-order', tableIds:['only-human:age','only-human:build','only-human:strange'], type:'composition-review', reason:'Age scaling, Build deltas and elapsed years require explicit ordering/reclassification; do not invent new Life Experience rolls when age changes.' },
    { id:'death-multiplicity', tableIds:['only-human:parents','only-human:death'], type:'procedure-review', reason:'Do not infer exact number of death-cause rolls when both parents are dead.' },
    { id:'recursion', tableIds:cyclicTables, type:'runtime-guard-required', reason:'Published loops and optional recursive sibling details need subject tracking, bounded execution/manual resolution, no silent skipped effects.' },
    { id:'outer-category-choice', tableIds:['only-human:family-circumstances'], type:'selection-review', reason:'Family profession chooses among named restricted categories; no published uniform selector is stated for each subset.' },
    { id:'external-dependencies', tableIds:['only-human:life','only-human:major-setback','only-human:minor-setback','only-human:major-windfall','only-human:strange','only-human:religion'], type:'dependency-review', reason:'Tombs of the Desolation, Demon Lord’s Companion, Terrible Beauty, Tooth and Claw, Uncertain Faith, connections, traits, companions and GM choices retain conditions; no implicit activation or generic effect.' },
  ];
  const known = new Set(tables.map(t=>t.id));
  for(const finding of findings)if(finding.tableIds.some(id=>!known.has(id)))throw new Error(`Unknown finding table: ${finding.id}`);
  const instructionEvidence = [proof('only-human:development-instructions',13726,13737),proof('only-human:appearance-instructions',13842,13845),
    proof('only-human:background-instructions',13907,13915),proof('only-human:profession-instructions',14301,14306),proof('only-human:profession-stray-prose',14315,14318),
    proof('only-human:equipment-instructions',14440,14449),proof('only-human:personality-instructions',14520,14523)];
  const inputRefs = [];
  for (const path of ['curation/pilot/human-ancestry.json','curation/reports/human-ancestry.json',pilotPath,PATH,'tools/curation/creation-table-inventory.ts','tools/curation/creation-tables.mjs']) inputRefs.push({path,sha256:sha(await readFile(resolve(root,path)))});
  const inventory = {schemaVersion:1,task:'CUR-016',reviewDate:'2026-10-27',status:'inventoried-not-curated',
    gates:{importableTables:false,officialGenerationEnabled:false,outcomeHandlersImplemented:false,stagingPromoted:false},
    procedures:{default:'human-development',alternative:'core-alternative',attributeModeIndependent:true,
      expandedReplaces:['core-random-starting-professions','core-wealth'],preserveSelectedSourceAndProcedure:true},
    tables,links,cyclicTables,findings,instructionEvidence,inputRefs,diceSignals,
    procedureConstraints:{
      modifiedRollTables:[{tableId:'only-human:childhood',modifierSource:'only-human:family-circumstances',possibleModifiers:[-6,-3,-1,0,1,3,6],openLowerTail:3,openUpperTail:18},
        {tableId:'only-human:lifestyle',modifierSource:'ordered-life-event-history',openLowerTail:3,openUpperTail:18}],
      applyModifiersAfterDice:true,clampRawRollBeforeModifiers:false,
      ageDirectedLifeRolls:[{min:3,max:3,count:0},{min:4,max:5,count:1},{min:6,max:8,count:2},{min:9,max:12,count:3},{min:13,max:15,count:4},{min:16,max:17,count:5},{min:18,max:18,count:6}],
      explicitSizeExceptions:[{tableId:'only-human:age',result:3,size:0.5},{tableId:'only-human:build',result:3,size:0.5}],
      cyclePolicy:'Preserve published recursion; runtime bounds/subject tracking/manual resolution required, not implemented here.',
      lateAgeChanges:'Revisit Size and dimensions as instructed; do not automatically create extra Life Experience rolls.',
    },
    nonTableProcedures:[
      {id:'human-attributes',kind:'attribute-mode',task:'CUR-015',reason:'Fixed choice or four 8+1d3 rolls; not a random ancestry table.'},
      {id:'expanded-free-appearance',kind:'manual-fields',evidenceId:'only-human:appearance-instructions',reason:'Player decides PC gender, skin/hair/eye color. Do not use Sibling Genders for the PC or force a binary dimension baseline; non-covered baselines require manual input.'},
      {id:'quantity-rolls',kind:'conditional-side-rolls',task:'CUR-017/018/019/021',reason:'Counts/years/currency/dimensions/Insanity/Corruption and d6 branches are children of outcomes, not additional always-required tables.'},
      {id:'core-kits',kind:'lifestyle-packages',evidenceIds:['kit-low','kit-high','supplied-starting-equipment'],task:'CUR-018',reason:'Core kits are prose packages selected by Core Wealth, not five printed supplement lookup tables or random item pools.'},
      {id:'roleplaying-questions',kind:'optional-free-text',decisionRef:'curation/pilot/creation-decisions.json#roleplaying',reason:'Optional fields do not remove expanded narrative table results or Interesting Thing secrets.'},
    ],
    nextTasks:['CUR-017','CUR-018','CUR-019','CUR-020','CUR-021'],
    scope:'Inventory only; modified rolls, ranges/outcomes, exact probability tests, semantic effects and table execution require subsequent curation. Source text and published conditional rerolls remain preserved.'};
  const data=JSON.stringify(inventory,null,2)+'\n';
  const report={schemaVersion:1,task:'CUR-016',reviewDate:'2026-10-27',counts:{tables:tables.length,coreTables:core.length,expandedTables:only.length,
    randomTables:tables.filter(t=>t.dice).length,lifestyleLookups:only.filter(t=>!t.dice).length,links:links.length,cyclicTables:cyclicTables.length,findings:findings.length},
    inputRefs,outputs:[{path:DATA,sha256:sha(data)}],nextTask:'CUR-017',unchanged:{rawInputs:true,ledgers:true,staging:true,frozenContracts:true,demoConsumer:true}};
  return {inventory,report,artifacts:new Map([[DATA,data],[REPORT,JSON.stringify(report,null,2)+'\n']])};
}
export async function main(args:string[],root=process.cwd()){
  if(args.length!==1||!['--write','--check'].includes(args[0]))throw new Error('Use --write or --check');
  const result=await buildArtifacts(root);
  for(const [path,data] of result.artifacts){
    if(args[0]==='--check'){if(await readFile(resolve(root,path),'utf8')!==data)throw new Error(`Creation table inventory changed: ${path}`);}
    else{await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),data);}
  }
  console.log(`Creation tables: ${result.report.counts.coreTables} Core + ${result.report.counts.expandedTables} Only Human; inventory only, generation disabled. ${args[0]}`);
}
