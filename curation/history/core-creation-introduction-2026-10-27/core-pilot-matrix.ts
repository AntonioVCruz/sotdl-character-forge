import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, isAbsolute, sep } from 'node:path';
import { z } from 'zod';
import { sourceLines } from './ancestry-extractor';

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const SOURCE = 'sotdl:shadow-of-the-demon-lord-core';
const ANCESTRY = 'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
const GENERAL = 'rules/SotDL_Compendio_Regras_Equipamentos_Monstros_v4_All_Project_Sources.md';
const OUTPUT = 'curation/pilot/core-level-zero.json';
const PINS = { [ANCESTRY]: '020d9d62d9046475552dbaf9f989f07e69b87b7a386cadc1af3e82f930502baf',
  [GENERAL]: 'af5b377d003c96910c5c7d4c4909a66d381513cbda93de22b5d83a6ca5474ece' };
// Deliberate, line-based analysis of the pinned MD revision. No rule is inferred from an entity name.
const ranges: [string, 'human' | 'general', number, number, string][] = [
  ['human-source', 'human', 14712, 14717, 'Source Page:** 11'],
  ['human-context', 'human', 14720, 14758, 'Common Names:'],
  ['human-stats', 'human', 14759, 14767, 'Choose one attribute'],
  ['human-language', 'human', 14768, 14770, 'random profession'],
  ['human-future', 'human', 14771, 14775, 'Level 4 Expert Human'],
  ['human-background', 'human', 14776, 14822, 'd20 Background'],
  ['human-personality', 'human', 14823, 14849, '3d6 Personality'],
  ['human-religion', 'human', 14850, 14857, '3d6 Religion'],
  ['human-age', 'human', 14858, 14865, '3d6 Age'],
  ['human-build', 'human', 14866, 14876, '3d6 Build'],
  ['human-appearance', 'human', 14880, 14921, '3d6 Appearance'],
  ['general-boundary', 'general', 156, 159, 'cortado a partir de Professions'],
  ['profession-start', 'general', 162, 177, 'You begin with two professions'],
  ['profession-router', 'general', 181, 211, 'd6 Profession'],
  ['profession-academic', 'general', 217, 228, 'Academic Professions'],
  ['profession-common', 'general', 229, 266, 'If you choose poet or writer'],
  ['profession-criminal', 'general', 267, 281, 'Criminal Professions'],
  ['profession-martial', 'general', 282, 296, 'Martial Professions'],
  ['profession-substitute', 'general', 297, 304, 'talk to your GM'],
  ['profession-wilderness', 'general', 330, 339, 'Wilderness Professions'],
  ['profession-religious', 'general', 340, 358, 'read and write'],
  ['wealth-procedure', 'general', 309, 318, 'roll and total 3d6'],
  ['kit-low', 'general', 319, 329, '1d6 bits'],
  ['wealth-table', 'general', 359, 381, '3d6 Lifestyle'],
  ['kit-high', 'general', 382, 405, 'GM’s choice'],
  ['thing-procedure', 'general', 406, 413, 'one interesting thing'],
  ['thing-2', 'general', 414, 437, '1d20 iron nails'],
  ['thing-3', 'general', 438, 470, 'weapon of the GM’s choice'],
  ['thing-router', 'general', 471, 475, 'd6 Table'],
  ['thing-1', 'general', 476, 509, 'tiny metal box'],
  ['thing-4', 'general', 514, 547, '1 boon on rolls'],
  ['thing-5', 'general', 548, 582, 'weapon of the GM’s choice'],
  ['thing-6', 'general', 583, 613, 'cumulative with other armor'],
  ['role-traits', 'general', 614, 626, 'at least one negative'],
  ['role-questions', 'general', 627, 706, 'Share your secret with the Game Master'],
  ['role-table', 'general', 716, 737, 'd20 Positive Negative'],
  ['first-adventure', 'general', 707, 711, 'starting adventure'],
  ['group', 'general', 745, 768, 'origin story'],
  ['progression', 'general', 784, 850, 'at level 1'],
  ['attributes', 'general', 1076, 1086, 'score − 10'],
  ['derived', 'general', 1241, 1269, 'cannot exceed 25'],
  ['carrying', 'general', 2896, 2921, 'Containers:'],
  ['armor', 'general', 2982, 3004, 'Replace your Defense'],
  ['gm-profession', 'general', 4009, 4014, 'possibly with 1 or more boons'],
  ['gm-group', 'general', 4311, 4328, 'work out as a group'],
  ['gm-level', 'general', 5388, 5408, 'characters start at level 0'],
];

const StepSchema = z.object({ id: z.string(), title: z.string(), kind: z.enum(['choice', 'derived', 'conditional', 'narrative', 'guard', 'gap']),
  cardinality: z.string(), certainty: z.enum(['explicit', 'conditional', 'not-demonstrated', 'product-policy']),
  manual: z.string(), random: z.string(), gm: z.string(), dependsOn: z.array(z.string()),
  evidenceIds: z.array(z.string()).min(1), followUps: z.array(z.string()).min(1), pending: z.array(z.string()),
}).strict();
type Step = z.infer<typeof StepSchema>;
const step = (id: string, title: string, kind: Step['kind'], cardinality: string, certainty: Step['certainty'], manual: string,
  random: string, gm: string, dependsOn: string[], evidenceIds: string[], followUps: string[], pending: string[] = []): Step =>
  StepSchema.parse({ id, title, kind, cardinality, certainty, manual, random, gm, dependsOn, evidenceIds, followUps, pending });
const none = 'Nenhuma rolagem publicada demonstrada; não inventar tabela.';
const GM = 'Registrar resolução do GM quando necessária; não resolver silenciosamente.';
const pendingNarrative = ['Instrução de quantidade e alternativa manual da tabela não demonstrada no trecho Human; conferir introdução ausente antes de habilitar geração oficial.'];
export const steps: Step[] = [
  step('scope', 'Publicação, ancestry e nível', 'guard', 'Uma ocorrência Human/Core; nível-alvo 0.', 'product-policy', 'Recorte deliberado do piloto; não substituir por Only Human.', none, 'GM confirma nível inicial e fontes da campanha.', [], ['human-source', 'gm-level'], ['CUR-015', 'CUR-033']),
  step('identity', 'Nome e identidade descritiva', 'narrative', 'Nome: um campo do produto; demais detalhes livres, sem número obrigatório demonstrado.', 'product-policy', 'Nome livre; lista de nomes é exemplo, não tabela exclusiva. Sexo/gênero/altura/peso exatos: sem procedimento localizado.', none, GM, ['scope'], ['human-context', 'general-boundary'], ['CUR-015', 'CUR-033'], ['Introdução geral de criação não está no MD; não certificar lista exaustiva de campos obrigatórios.']),
  step('attributes', 'Atributos e aumento Human', 'choice', 'Quatro bases 10; escolher exatamente um atributo e aumentar em 1.', 'explicit', 'Escolher Strength, Agility, Intellect ou Will para o aumento.', 'Sem rolagem de atributos publicada neste bloco; eventual pool do aplicativo é não oficial e exige política.', 'Sem escolha de GM exigida no trecho.', ['scope'], ['human-stats'], ['CUR-015', 'CUR-034']),
  step('general-adjustment', 'Outros ajustes gerais de atributos', 'gap', 'Indeterminada: o MD não contém a introdução anterior a Professions.', 'not-demonstrated', 'Não oferecer troca geral de pontos como regra publicada sem recuperar a instrução.', none, 'Recuperar trecho original; decisão de campanha separada não deve se passar por regra do Core.', ['attributes'], ['general-boundary', 'attributes'], ['CUR-015'], ['A existência de regra geral adicional de ajuste não pode ser confirmada ou negada por este recorte.']),
  step('size', 'Size Human', 'choice', 'Uma alternativa: Size 1/2 ou Size 1.', 'explicit', 'Selecionar um dos dois valores; não deduzir automaticamente de Build.', none, 'Relação obrigatória entre Build e Size não demonstrada.', ['scope'], ['human-stats', 'human-build'], ['CUR-015', 'CUR-034']),
  step('base-stats', 'Características e estado inicial', 'derived', 'Uma ficha base: Perception, Defense, Health, Healing Rate, Speed, Power, Damage, Insanity, Corruption e modificadores.', 'explicit', 'Derivar dos atributos; não digitar números finais no lugar de fórmulas.', 'Nenhuma rolagem para os valores-base; resultados condicionais podem alterá-los depois.', 'Adjudicar somente efeitos posteriores sem suporte.', ['attributes', 'size'], ['human-stats', 'attributes', 'derived'], ['CUR-015', 'CUR-034']),
  step('human-benefit', 'Idioma ou profissão adicional Human', 'choice', 'Exatamente uma alternativa: falar um idioma adicional OU ganhar uma profissão aleatória; Common Tongue já é concedido.', 'explicit', 'Escolher o ramo e, no ramo idioma, o idioma elegível. A opção manual de profissão adicional não é demonstrada: o texto diz random profession.', 'No ramo profissão, depender do procedimento de profissões d6 → d20.', GM, ['scope'], ['human-language', 'profession-router'], ['CUR-015', 'CUR-017'], ['Inventário de idiomas elegíveis não demonstrado no recorte.']),
  step('background', 'Human Background', 'choice', 'Tabela d20 presente; número de resultados de background por personagem não explicitado neste bloco.', 'not-demonstrated', 'Seleção manual é requisito do produto; autorização publicada neste recorte ainda não demonstrada.', 'd20 e consequências condicionais; tabela ainda precisa ser formalizada.', GM, ['scope'], ['human-background', 'general-boundary'], ['CUR-016', 'CUR-021'], pendingNarrative),
  step('background-effects', 'Consequências de Human Background', 'conditional', 'Somente o resultado escolhido: pode criar moeda, idioma, alfabetização, Insanity, Corruption ou detalhes narrativos.', 'conditional', 'Resolver idioma, histórico e demais escolhas do resultado; preservar a mesma consequência no modo manual.', 'Side rolls localizados: 1d6 Insanity; 1d6 ou 1d20 anos; filhos max(0,1d6−2); 2d6 cp. Não rolar todos os ramos.', GM, ['background', 'base-stats'], ['human-background'], ['CUR-015', 'CUR-017', 'CUR-018', 'CUR-021', 'CUR-034']),
  ...(['personality', 'religion', 'age', 'build', 'appearance'] as const).map(id => step(`human-${id}`, `Human ${id}`, 'narrative', 'Uma tabela 3d6 localizada; quantidade de resultados exigidos e obrigatoriedade não demonstradas.', 'not-demonstrated', 'Manual/híbrido por requisito do produto; conferir permissão publicada e liberdade de descrição.', '3d6; nunca escolher uniformemente linha ou inteiro 3–18. Age gera faixa, não idade exata.', GM, ['scope'], [`human-${id}`, 'general-boundary'], ['CUR-016', 'CUR-021'], pendingNarrative)),
  step('professions', 'Duas escolhas iniciais de profissão', 'choice', 'Dois direitos iniciais de escolha; a opção Human pode adicionar um terceiro, antes de consequências e trocas.', 'explicit', 'Escolher profissão livremente ou rolar; manter dois direitos distintos, sem inventar proibição de repetição.', 'Para cada profissão aleatória: d6 tipo → d20 tabela correspondente; números do seletor foram perdidos no MD.', GM, ['human-benefit'], ['profession-start', 'profession-router'], ['CUR-016', 'CUR-017', 'CUR-021'], ['Reconstruir numeração do seletor antes de geração oficial; não inferir 1–6 somente pela ordem visual.']),
  step('profession-language', 'Troca de profissão por idioma ou leitura', 'conditional', 'Cada troca consome um direito de profissão; quantidade final depende das trocas aprovadas e da opção Human.', 'conditional', 'Falar outro idioma OU ler um idioma que já fala; não confundir fala com leitura/escrita.', 'Não há tabela de idioma nesta evidência.', 'Conferir se a profissão extra aleatória Human pode ser trocada e se há limites gerais na introdução ausente.', ['professions'], ['profession-start', 'human-language'], ['CUR-017', 'CUR-033'], ['Texto não esclarece explicitamente limites de múltiplas trocas nem a troca da profissão Human; manter pendência para esses casos.']),
  step('profession-details', 'Especializações e alfabetização por profissão', 'conditional', 'Escolhas e ganhos por resultado, sem criar profissão extra automaticamente.', 'conditional', 'Artisan: ofício; Artist: meio; Entertainer: estilo; Laborer: trabalho; Merchant: produto; Musician: instrumento. Conservar alfabetização quando concedida.', 'Se aleatório, subtabela d20 correta; escolhas internas sem dado não viram novas tabelas oficiais.', 'Substituição de profissão requer conversa com GM; sucesso automático/boons em jogo depende da adjudicação.', ['professions'], ['profession-router', 'profession-academic', 'profession-common', 'profession-criminal', 'profession-martial', 'profession-wilderness', 'profession-religious', 'profession-substitute', 'gm-profession'], ['CUR-017', 'CUR-021', 'CUR-033'], ['Números ausentes em algumas linhas; não reconstruir automaticamente pelos exemplos ou por ordem de coluna.']),
  step('wealth', 'Riqueza inicial', 'choice', 'Uma determinação de riqueza; seis estilos de vida descritos.', 'explicit', 'Fonte manda rolar: permitir valor manual no aplicativo exige política explícita, sem chamar isso de alternativa publicada.', '3d6 → Wealth; limites de Wealthy e Rich ausentes no MD, portanto sorteio oficial bloqueado.', 'Aprovar política manual quando a tabela não estiver reconstruída.', ['scope'], ['wealth-procedure', 'wealth-table'], ['CUR-016', 'CUR-018', 'CUR-021'], ['Não assumir Wealthy=17 e Rich=18 sem evidência recuperada.']),
  step('starting-kit', 'Kit de equipamento inicial', 'derived', 'Um kit do estilo de vida; todos os itens fixos e alternativas nele presentes, com suas quantidades.', 'conditional', 'Não escolher um item isolado no lugar do kit inteiro. Ramo arma: staff/club/sling conforme kit, com 20 pedras quando indicado.', 'Quantias: 1d6 bits, 2d6 bits, 1d6 cp, 2d6 cp, 1d6 ss ou 2d6 ss, conforme kit.', 'Escolha da magia da incantation pertence ao GM.', ['wealth'], ['kit-low', 'kit-high'], ['CUR-018', 'CUR-020', 'CUR-033', 'CUR-034']),
  step('kit-options', 'Alternativas e dependências dos kits', 'conditional', 'Comfortable/Wealthy: uma alternativa entre shield, incantation ou um dos kits; Rich concede servant, guard e três cavalos com selas.', 'conditional', 'Registrar escolha do shield/kit ou ramo incantation, respeitando texto de cada estilo; Common clothing não é armadura fictícia.', 'Escolhas internas sem dado são manuais ou pool não oficial autorizado.', 'Incantation: GM escolhe spell rank 0; servant/guard/cavalos exigem referências ou resolução manual.', ['starting-kit'], ['kit-high'], ['CUR-018', 'CUR-020', 'CUR-025', 'CUR-034'], ['O ramo incantation depende de conteúdo mágico ou adjudicação manual explícita, sem ensinar automaticamente a spell ao personagem.']),
  step('interesting-thing', 'Interesting Thing inicial', 'choice', 'Exatamente um resultado inicial; não um item de cada tabela.', 'explicit', 'Fonte manda rolar; escolha manual no produto precisa de política declarada até revisar alternativa publicada.', 'd6 seletor → uma de seis tabelas d20; registrar dois eventos ligados, mais side rolls apenas do resultado.', GM, ['scope'], ['thing-procedure', 'thing-router', 'thing-1', 'thing-2', 'thing-3', 'thing-4', 'thing-5', 'thing-6'], ['CUR-016', 'CUR-019', 'CUR-021'], ['Diversas linhas d20 perderam os números; não habilitar tabelas pela mera presença de 20 descrições.']),
  step('thing-effects', 'Escolhas e efeitos de Interesting Things', 'conditional', 'Somente consequências e alternativas do resultado inicial; pode ser narrativa, recurso, item, pessoa ou criatura.', 'conditional', 'Escolher ramo quando o resultado contém alternativas; não converter tudo em item ou bônus permanente.', 'Preservar quantidades 1d20, 1d6+1, 2d6, 3d6, 2d20 etc. por resultado; sem rerrolagem para evitar resultados difíceis.', 'Arma escolhida pelo GM; efeitos incomuns, companions e outros casos sem handler ficam como adjudicação manual.', ['interesting-thing'], ['thing-1', 'thing-2', 'thing-3', 'thing-4', 'thing-5', 'thing-6'], ['CUR-019', 'CUR-020', 'CUR-021', 'CUR-027', 'CUR-034'], ['Mail sob roupa não acumula com outra armadura; não usar regra aditiva fictícia. Restringir geração quando faltar dependência ou resolução manual.']),
  step('inventory', 'Inventário, equipamento em uso e moedas', 'derived', 'Somar itens/moedas ganhos em cada origem sem duplicá-los; separar posse de uso.', 'conditional', 'Equipar é decisão explícita; kit não autoriza comprar ou vestir tudo automaticamente. Preservar unidades e denominações.', 'Não rolar durante recálculo, importação ou impressão.', 'Adjudicar itens especiais e capacidade quando não houver suporte.', ['size', 'base-stats', 'background-effects', 'starting-kit', 'kit-options', 'thing-effects'], ['carrying', 'armor', 'derived', 'human-background', 'kit-low', 'kit-high', 'thing-6'], ['CUR-018', 'CUR-020', 'CUR-034', 'CUR-037']),
  step('positive-traits', 'Traços positivos de interpretação', 'narrative', 'Um casal de traços positivos: proposta operacional 2, baseada em a couple; conselho de interpretação, não bônus mecânico.', 'explicit', 'Criar traços livremente; tabela só é inspiração.', 'Tabela d20 Positive, opcional; revisar uso por traço em CUR-016/021.', 'Sem adjudicação mecânica automática.', ['scope'], ['role-traits', 'role-table'], ['CUR-016', 'CUR-021', 'CUR-033']),
  step('negative-traits', 'Traços negativos de interpretação', 'narrative', 'Pelo menos um traço negativo; orientação narrativa.', 'explicit', 'Criar livremente, sem limite máximo publicado neste trecho.', 'Tabela d20 Negative, opcional; não sortear uma linha conjunta positivo/negativo por conveniência.', 'Sem adjudicação mecânica automática.', ['scope'], ['role-traits', 'role-table'], ['CUR-016', 'CUR-021', 'CUR-033']),
  step('roleplaying', 'Perguntas, valores, vínculos e segredos', 'narrative', 'Perguntas orientadoras; Secrets pede ao menos um segredo e em seguida descreve outro compartilhado com uma ou duas pessoas, sem esclarecer se devem ser distintos.', 'conditional', 'Preenchimento narrativo; não impor um slot obrigatório por pergunta nem afirmar exatamente dois segredos distintos.', 'Sem tabela de respostas demonstrada; manter manual/pending, sem gerar história oficial.', 'Compartilhar segredo com GM; separar dado privado do texto exportável.', ['background'], ['role-questions'], ['CUR-033', 'CUR-036', 'CUR-037'], ['Esclarecer quantidade e privacidade dos segredos; preservar instrução sem inventar restrição.']),
  step('group', 'Contexto de grupo e revisão de GM', 'narrative', 'Uma configuração de contexto da campanha; não é atributo ou sorteio individual obrigatório.', 'conditional', 'Definir situação inicial e se personagens já se conhecem; vínculos podem emergir na primeira aventura.', 'Nenhuma tabela de grupo Core nesta evidência.', 'GM e jogadores combinam início; GM revisa personagens e detalhes relevantes.', ['scope', 'professions', 'roleplaying'], ['gm-group', 'gm-level', 'group', 'first-adventure'], ['CUR-033', 'CUR-038']),
  step('future-gains', 'Fronteira de nível e ganhos excluídos', 'guard', 'Zero novice paths e zero ganhos de Level 4 Human no nível 0; benefícios de níveis superiores não são criação inicial.', 'explicit', 'Sem escolher spell/Determined do nível 4 agora. Opção incantation do kit continua distinta de aprender magia.', 'Não adicionar 2d6 ss por nível ou Interesting Things de paths ao piloto de nível 0.', 'Nível inicial superior é outra configuração de campanha, fora deste piloto.', ['scope'], ['human-future', 'progression'], ['CUR-015', 'CUR-022', 'CUR-023', 'CUR-035']),
];

export function validateSteps(values: unknown, evidenceIds: string[]) {
  const rows = z.array(StepSchema).parse(values), known = new Set<string>(), evidence = new Set(evidenceIds);
  for (const row of rows) {
    if (known.has(row.id) || row.dependsOn.some(id => !known.has(id))) throw new Error(`Duplicate/out-of-order dependency: ${row.id}`);
    if (row.evidenceIds.some(id => !evidence.has(id))) throw new Error(`Missing step evidence: ${row.id}`);
    if (row.certainty === 'not-demonstrated' && !row.pending.length) throw new Error(`Undemonstrated requirement needs explicit pending: ${row.id}`);
    known.add(row.id);
  }
  return rows;
}

export async function buildArtifacts(root: string) {
  const refs = new Map<string, { path: string; sha256: string }>();
  const read = async (path: string) => {
    if (isAbsolute(path) || !resolve(root, path).startsWith(resolve(root) + sep)) throw new Error('Path outside pilot workspace');
    const bytes = await readFile(resolve(root, path)); refs.set(path, { path, sha256: sha(bytes) }); return bytes;
  };
  const json = async (path: string) => JSON.parse((await read(path)).toString('utf8'));
  const reconciliation = await json('curation/reports/reconciliation.json');
  for (const ref of [...reconciliation.inputRefs, ...reconciliation.outputs]) if (sha(await read(ref.path)) !== ref.sha256) throw new Error(`Stale reconciliation dependency: ${ref.path}`);
  const manifest = await json('curation/input-manifest.json');
  const documents = new Map<string, ReturnType<typeof sourceLines>>();
  for (const [path, hash] of Object.entries(PINS)) {
    const bytes = await read(path);
    if (sha(bytes) !== hash || manifest.files.find((f: { path: string }) => f.path === path)?.sha256 !== hash) throw new Error(`Pilot evidence revision changed: ${path}`);
    documents.set(path, sourceLines(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  }
  const inventory = (await read('curation/reconciliation/inventory.jsonl')).toString('utf8').trimEnd().split('\n').map(line => JSON.parse(line));
  const human = inventory.find(r => r.id === 'ancestries:human-shadow-of-the-demon-lord-core');
  if (!human || human.state !== 'captured' || human.sourceIds.length !== 1 || human.sourceIds[0] !== SOURCE || !human.entityId) throw new Error('Human/Core candidate missing or unresolved');
  const evidence = ranges.map(([id, doc, startLine, endLine, anchor]) => {
    const path = doc === 'human' ? ANCESTRY : GENERAL, lines = documents.get(path)!;
    const selected = lines.slice(startLine - 1, endLine), excerpt = selected.map(l => l.text).join('\n');
    if (selected.length !== endLine - startLine + 1 || !excerpt.includes(anchor)) throw new Error(`Pilot evidence anchor/range changed: ${id}`);
    const matches = inventory.filter(r => r.path === path && r.startLine <= endLine && r.endLine >= startLine);
    return { id, sourceId: SOURCE, medium: 'md', path, inputSha256: PINS[path], startLine, endLine, anchor, excerpt, excerptSha256: sha(excerpt),
      declaredPagination: doc === 'human' ? 'Source Page 11 / PDF Page 12 declared at entry start; not certified for every subrange.' : 'Parent section PDF-page declaration only; no per-entry printed-page certification.',
      inventoryRefs: matches.map(r => ({ id: r.id, state: r.state, entityId: r.entityId, reference: r.reference })) };
  });
  const rows = validateSteps(steps, evidence.map(e => e.id));
  await read('tools/curation/core-pilot-matrix.ts'); await read('tools/curation/core-pilot.mjs');
  const matrix = { schemaVersion: 1, task: 'CUR-014', reviewDate: '2026-10-27', status: 'analysis-complete-with-explicit-gaps',
    sourceId: SOURCE, ancestryEntityId: human.entityId, ancestryInventoryId: human.id, targetLevel: 0,
    gates: { importablePack: false, officialGenerationEnabled: false, mechanicalCertification: false, originalInputsModified: false, stagingPromoted: false },
    scope: 'Private MD evidence matrix; completeness of the original publication is not certified. Narrative cardinalities not established by this extract remain pending.',
    counts: { steps: rows.length, evidenceRanges: evidence.length, stepsWithPending: rows.filter(r => r.pending.length).length },
    steps: rows, evidence, inputRefs: [...refs.values()].sort((a, b) => a.path < b.path ? -1 : 1) };
  return { matrix, artifacts: new Map([[OUTPUT, JSON.stringify(matrix, null, 2) + '\n']]) };
}

export async function main(args: string[], root = process.cwd()) {
  if (args.length !== 1 || !['--write', '--check'].includes(args[0])) throw new Error('Use --write or --check');
  const result = await buildArtifacts(root);
  for (const [path, data] of result.artifacts) {
    if (args[0] === '--check') { if (await readFile(resolve(root, path), 'utf8') !== data) throw new Error(`Pilot artifact changed: ${path}`); }
    else { await mkdir(dirname(resolve(root, path)), { recursive: true }); await writeFile(resolve(root, path), data); }
  }
  console.log(`Core pilot: Human level 0; ${result.matrix.counts.steps} steps, ${result.matrix.counts.evidenceRanges} evidence ranges; official generation disabled. ${args[0]}`);
}
