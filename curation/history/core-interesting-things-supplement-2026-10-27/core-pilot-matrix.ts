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
const SUPPLEMENT = 'curation/corrections/core-character-creation-2026-10-27';
const EQUIPMENT = 'curation/corrections/core-starting-equipment-2026-10-27';
const PROFESSIONS = 'curation/corrections/core-professions-2026-10-27';
const DECISIONS = 'curation/pilot/creation-decisions.json';
const SUPPLEMENT_PINS: Record<string, string> = {
  [`${SUPPLEMENT}/introduction.txt`]: '51524877da4e81c6146392d35f4fdca222e6e0b4ff9b7507b0e93c6bcb43f9ef',
  [`${SUPPLEMENT}/languages.txt`]: '18695a183fdf83e51b3816b0bc06f2c2121c1787cb2468aeff68d16a6e041de0',
  [`${EQUIPMENT}/starting-equipment.txt`]: '09d6aea94bd84ec913fbc2dc271953bb5e88865fe9ed4acf918a9c0a6c5fb702',
  [`${EQUIPMENT}/wealth-limits.txt`]: '22f64e43bb96a042e13bdcaf315e1ead900cd18b68d56a62aff16be9aa38bc9e',
  [`${PROFESSIONS}/professions.txt`]: '4609a3f4a51c5bc1fa77af9db00a757adc381d78301c2adb85661a53f421c150',
};
const PINS: Record<string, string> = { [ANCESTRY]: '020d9d62d9046475552dbaf9f989f07e69b87b7a386cadc1af3e82f930502baf',
  [GENERAL]: 'af5b377d003c96910c5c7d4c4909a66d381513cbda93de22b5d83a6ca5474ece' };
// Deliberate, line-based analysis of the pinned MD revision. No rule is inferred from an entity name.
const ranges: [string, 'human' | 'general' | 'introduction' | 'languages' | 'equipment' | 'wealth-limits' | 'professions', number, number, string][] = [
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
  ['creation-introduction', 'introduction', 1, 10, 'first thing you do'],
  ['ancestry-story', 'introduction', 11, 13, 'only suggestions'],
  ['general-scores', 'introduction', 16, 23, 'only once'],
  ['general-traits', 'introduction', 24, 29, 'Record any talents'],
  ['general-level-four', 'introduction', 30, 31, 'reaches level 4'],
  ['ancestry-table-options', 'introduction', 32, 33, 'choose them, or come up with something else'],
  ['northern-language-context', 'languages', 1, 2, 'Northern Reach'],
  ['northern-language-names', 'languages', 3, 8, 'High Archaic'],
  ['northern-language-open', 'languages', 9, 10, 'GM can introduce languages'],
  ['supplied-starting-equipment', 'equipment', 1, 16, 'three horses with saddles'],
  ['supplied-wealth-limits', 'wealth-limits', 1, 2, '18 Rich'],
  ['supplied-profession-router', 'professions', 4, 18, 'Academic.'],
  ['supplied-profession-procedure', 'professions', 22, 30, 'trade out a profession'],
  ['supplied-profession-academic', 'professions', 31, 52, '20 War'],
  ['supplied-profession-common', 'professions', 53, 78, 'Artisan.'],
  ['supplied-profession-criminal', 'professions', 79, 89, '5 Charlatan'],
  ['supplied-profession-martial', 'professions', 90, 98, '13–15 Peasant conscript'],
  ['supplied-profession-wilderness', 'professions', 99, 105, '5–6 Guide'],
  ['supplied-profession-religious', 'professions', 106, 119, '5 Fanatic.'],
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
export const steps: Step[] = [
  step('scope', 'Publicação, ancestry e nível', 'guard', 'Uma ocorrência Human/Core; nível-alvo 0.', 'product-policy', 'Escolher ancestry é o primeiro passo publicado; o piloto recorta Human/Core, sem substituir por Only Human.', none, 'GM pode fornecer personagem e autorizar outras ancestries; confirma nível e fontes.', [], ['human-source', 'gm-level', 'creation-introduction'], ['CUR-015', 'CUR-033']),
  step('identity', 'Nome e identidade descritiva', 'narrative', 'Nome: um campo do produto; elementos narrativos são sugestões, sem lista fechada de respostas obrigatórias.', 'product-policy', 'Nome livre; exemplos não são exclusivos. Pode expandir, alterar ou abandonar sugestões narrativas da ancestry; sexo/gênero/medidas exatas não ganham fórmulas inventadas.', none, GM, ['scope'], ['human-context', 'creation-introduction', 'ancestry-story', 'ancestry-table-options'], ['CUR-015', 'CUR-033']),
  step('attributes', 'Atributos e aumento Human', 'choice', 'Quatro bases 10; escolher exatamente um atributo e aumentar em 1.', 'explicit', 'Escolher Strength, Agility, Intellect ou Will para o aumento.', 'Sem rolagem de atributos publicada neste bloco; eventual pool do aplicativo é não oficial e exige política.', 'Sem escolha de GM exigida no trecho.', ['scope'], ['human-stats'], ['CUR-015', 'CUR-034']),
  step('general-adjustment', 'Ajuste opcional geral de atributos', 'choice', 'Zero ou uma transferência: aumentar um atributo em 1 e diminuir outro em 1; somente uma vez.', 'conditional', 'Escolher usar ou não; se usar, selecionar dois atributos distintos. É adicional à escolha Human +1 e não substitui esse benefício. Scores variam de 1 a 20.', 'Sem rolagem publicada para a transferência; pool válido do aplicativo seria não oficial e condicionado à política.', 'Não há autorização para repetir a transferência.', ['attributes'], ['general-scores', 'human-stats'], ['CUR-015', 'CUR-034']),
  step('size', 'Size Human', 'choice', 'Uma alternativa: Size 1/2 ou Size 1.', 'explicit', 'Selecionar independentemente de Build. Decisão do usuário: somente tabela/regra que determine Size explicitamente pode estabelecer vínculo; não inferir por descrição ou medidas.', none, 'A exceção exemplificada por Clockwork Form requer sua própria regra; não é implementada no piloto Human.', ['scope'], ['human-stats', 'human-build'], ['CUR-015', 'CUR-034']),
  step('base-stats', 'Características e estado inicial', 'derived', 'Uma ficha base: Perception, Defense, Health, Healing Rate, Speed, Power, Damage, Insanity, Corruption e modificadores; registrar talentos iniciais quando a ancestry os concede.', 'explicit', 'Derivar após o aumento Human e a transferência opcional; não digitar números finais no lugar de fórmulas.', 'Nenhuma rolagem para os valores-base; resultados condicionais podem alterá-los depois.', 'Adjudicar somente efeitos posteriores sem suporte.', ['attributes', 'general-adjustment', 'size'], ['human-stats', 'attributes', 'derived', 'general-traits'], ['CUR-015', 'CUR-034']),
  step('human-benefit', 'Idioma ou profissão adicional Human', 'choice', 'Exatamente uma alternativa: falar um idioma adicional OU ganhar uma profissão aleatória; Common Tongue já é concedido.', 'explicit', 'Escolher o ramo e o idioma específico; quadro localiza Common Tongue, Dark Speech, Dwarfish, Elvish, High Archaic, Trollish, mais categorias abertas Secret Language e Dead Languages. Não conceder todos, nem alfabetização por conhecer o alfabeto.', 'No ramo profissão, depender do procedimento de profissões d6 → d20. Quadro de idiomas não é tabela aleatória.', 'Idiomas secretos precisam de nome/contexto de organização; o GM pode introduzir idiomas mortos. Não tratar categorias como dois idiomas únicos.', ['scope'], ['human-language', 'profession-router', 'general-traits', 'northern-language-context', 'northern-language-names', 'northern-language-open'], ['CUR-015', 'CUR-017']),
  step('background', 'Human Background', 'choice', 'Uso facultativo da tabela: rolar, escolher ou criar outro elemento narrativo. Nenhum número fixo de resultados nem obrigação de usar cada tabela é prescrito.', 'conditional', 'Escolher resultado ou criar outro background é alternativa publicada para ancestry tables; criação livre não concede automaticamente benefícios mecânicos inventados.', 'Se usar a tabela: d20 com consequências do resultado; a formalização continua em CUR-016/021.', 'Adjudicar consequências de criação livre e não ocultar efeito de resultado publicado.', ['scope'], ['human-background', 'ancestry-table-options'], ['CUR-016', 'CUR-021']),
  step('background-effects', 'Consequências de Human Background', 'conditional', 'Somente o resultado escolhido: pode criar moeda, idioma, alfabetização, Insanity, Corruption ou detalhes narrativos.', 'conditional', 'Resolver idioma, histórico e demais escolhas do resultado; preservar a mesma consequência no modo manual.', 'Side rolls localizados: 1d6 Insanity; 1d6 ou 1d20 anos; filhos max(0,1d6−2); 2d6 cp. Não rolar todos os ramos.', GM, ['background', 'base-stats'], ['human-background'], ['CUR-015', 'CUR-017', 'CUR-018', 'CUR-021', 'CUR-034']),
  ...(['personality', 'religion', 'age', 'build', 'appearance'] as const).map(id => step(`human-${id}`, `Human ${id}`, 'narrative', 'Uso facultativo da tabela; sem número obrigatório de resultados. Os elementos podem ser rolados, escolhidos ou criados livremente.', 'conditional', 'Escolher resultado ou descrever algo diferente é permitido. Aparência e porte são relativos à ancestry, não padrões universais. Build não altera Size salvo determinação explícita de tabela/regra.', 'Se usar a tabela: 3d6, nunca linha ou inteiro uniforme 3–18. Age gera faixa, não idade exata.', GM, ['scope'], [`human-${id}`, 'ancestry-table-options', 'ancestry-story'], ['CUR-016', 'CUR-021'])),
  step('professions', 'Duas escolhas iniciais de profissão', 'choice', 'Dois direitos iniciais de escolha; a opção Human pode adicionar um terceiro, antes de consequências e trocas.', 'explicit', 'Escolher profissão livremente ou rolar; manter dois direitos distintos, sem inventar proibição de repetição.', 'Para cada profissão aleatória: d6 tipo → d20 tabela correspondente. Texto fornecido explicita 1 Academic, 2 Common, 3 Criminal, 4 Martial, 5 Religious, 6 Wilderness.', GM, ['human-benefit'], ['profession-start', 'profession-router', 'supplied-profession-procedure', 'supplied-profession-router'], ['CUR-016', 'CUR-017', 'CUR-021']),
  step('profession-language', 'Troca de profissão por idioma ou leitura', 'conditional', 'Sem teto próprio do aplicativo para trocas entre idioma e profissão; registrar a origem de cada concessão/troca e os ganhos iniciais sem duplicá-los.', 'conditional', 'Idioma sem qualificação concede apenas fala. Leitura/escrita somente por concessão explícita, que pode acompanhar idioma novo ou acrescentar alfabetização a idioma anterior. Não conceder alfabetização só por compartilhar alfabeto.', 'Não há tabela aleatória de idioma nesta evidência.', 'Limites e restrições de cada mesa estão fora do escopo; não bloquear múltiplas trocas ou a profissão extra Human por esta antiga pendência.', ['professions'], ['profession-start', 'human-language', 'general-traits', 'northern-language-names', 'northern-language-open', 'supplied-profession-procedure'], ['CUR-017', 'CUR-033']),
  step('profession-details', 'Especializações e alfabetização por profissão', 'conditional', 'Escolhas e ganhos por resultado, sem criar profissão extra automaticamente; seis subtabelas d20 com numeração completa no texto fornecido.', 'conditional', 'Artisan: ofício; Artist: meio; Entertainer: estilo; Laborer: trabalho; Merchant: produto; Musician: instrumento. Conservar alfabetização quando concedida.', 'Subtabela d20 correta, preservando os intervalos; escolhas internas sem dado não viram novas tabelas oficiais.', 'Substituição de profissão requer conversa com GM; sucesso automático/boons em jogo depende da adjudicação.', ['professions'], ['profession-router', 'profession-academic', 'profession-common', 'profession-criminal', 'profession-martial', 'profession-wilderness', 'profession-religious', 'profession-substitute', 'gm-profession', 'supplied-profession-academic', 'supplied-profession-common', 'supplied-profession-criminal', 'supplied-profession-martial', 'supplied-profession-wilderness', 'supplied-profession-religious', 'supplied-profession-router', 'supplied-profession-procedure'], ['CUR-017', 'CUR-021', 'CUR-033']),
  step('wealth', 'Riqueza inicial', 'choice', 'Uma determinação de riqueza; seis estilos de vida com cobertura 3–18 completa.', 'explicit', 'Fonte manda rolar: permitir valor manual no aplicativo exige política explícita, sem chamar isso de alternativa publicada.', '3d6 → Wealth: 3–4 Destitute, 5–8 Poor, 9–13 Getting By, 14–16 Comfortable, 17 Wealthy, 18 Rich. Os dois últimos limites foram confirmados explicitamente pelo usuário.', 'Sem decisão de GM necessária para os limites agora confirmados; escolhas dos kits mantêm suas próprias instruções.', ['scope'], ['wealth-procedure', 'wealth-table', 'supplied-wealth-limits'], ['CUR-016', 'CUR-018', 'CUR-021']),
  step('starting-kit', 'Kit de equipamento inicial', 'derived', 'Um kit do estilo de vida; todos os itens fixos e alternativas nele presentes, com suas quantidades. Texto integral dos seis kits também foi fornecido pelo usuário.', 'conditional', 'Não escolher um item isolado no lugar do kit inteiro. Ramo arma: staff/club/sling conforme kit, com 20 pedras quando indicado.', 'Quantias: 1d6 bits, 2d6 bits, 1d6 cp, 2d6 cp, 1d6 ss ou 2d6 ss, conforme kit. Limites de Wealthy/Rich foram confirmados em complemento separado.', 'Escolha da magia da incantation pertence ao GM.', ['wealth'], ['kit-low', 'kit-high', 'supplied-starting-equipment', 'supplied-wealth-limits'], ['CUR-018', 'CUR-020', 'CUR-033', 'CUR-034']),
  step('kit-options', 'Alternativas e dependências dos kits', 'conditional', 'Comfortable/Wealthy: uma alternativa entre shield, incantation ou um dos kits; Rich concede servant, guard e três cavalos com selas.', 'conditional', 'Registrar escolha do shield/kit ou ramo incantation, respeitando texto de cada estilo; Common clothing não é armadura fictícia.', 'Escolhas internas sem dado são manuais ou pool não oficial autorizado.', 'Incantation: GM escolhe spell rank 0; servant/guard/cavalos exigem referências ou resolução manual.', ['starting-kit'], ['kit-high'], ['CUR-018', 'CUR-020', 'CUR-025', 'CUR-034'], ['O ramo incantation depende de conteúdo mágico ou adjudicação manual explícita, sem ensinar automaticamente a spell ao personagem.']),
  step('interesting-thing', 'Interesting Thing inicial', 'choice', 'Exatamente um resultado inicial; não um item de cada tabela.', 'explicit', 'Fonte manda rolar; escolha manual no produto precisa de política declarada até revisar alternativa publicada.', 'd6 seletor → uma de seis tabelas d20; registrar dois eventos ligados, mais side rolls apenas do resultado.', GM, ['scope'], ['thing-procedure', 'thing-router', 'thing-1', 'thing-2', 'thing-3', 'thing-4', 'thing-5', 'thing-6'], ['CUR-016', 'CUR-019', 'CUR-021'], ['Diversas linhas d20 perderam os números; não habilitar tabelas pela mera presença de 20 descrições.']),
  step('thing-effects', 'Escolhas e efeitos de Interesting Things', 'conditional', 'Somente consequências e alternativas do resultado inicial; pode ser narrativa, recurso, item, pessoa ou criatura.', 'conditional', 'Escolher ramo quando o resultado contém alternativas; não converter tudo em item ou bônus permanente.', 'Preservar quantidades 1d20, 1d6+1, 2d6, 3d6, 2d20 etc. por resultado; sem rerrolagem para evitar resultados difíceis.', 'Arma escolhida pelo GM; efeitos incomuns, companions e outros casos sem handler ficam como adjudicação manual.', ['interesting-thing'], ['thing-1', 'thing-2', 'thing-3', 'thing-4', 'thing-5', 'thing-6'], ['CUR-019', 'CUR-020', 'CUR-021', 'CUR-027', 'CUR-034'], ['Mail sob roupa não acumula com outra armadura; não usar regra aditiva fictícia. Restringir geração quando faltar dependência ou resolução manual.']),
  step('inventory', 'Inventário, equipamento em uso e moedas', 'derived', 'Somar itens/moedas ganhos em cada origem sem duplicá-los; separar posse de uso.', 'conditional', 'Equipar é decisão explícita; kit não autoriza comprar ou vestir tudo automaticamente. Preservar unidades e denominações.', 'Não rolar durante recálculo, importação ou impressão.', 'Adjudicar itens especiais e capacidade quando não houver suporte.', ['size', 'base-stats', 'background-effects', 'starting-kit', 'kit-options', 'thing-effects'], ['carrying', 'armor', 'derived', 'human-background', 'kit-low', 'kit-high', 'thing-6'], ['CUR-018', 'CUR-020', 'CUR-034', 'CUR-037']),
  step('positive-traits', 'Traços positivos de interpretação', 'narrative', 'Um casal de traços positivos: proposta operacional 2, baseada em a couple; conselho de interpretação, não bônus mecânico.', 'explicit', 'Criar traços livremente; tabela só é inspiração.', 'Tabela d20 Positive, opcional; revisar uso por traço em CUR-016/021.', 'Sem adjudicação mecânica automática.', ['scope'], ['role-traits', 'role-table'], ['CUR-016', 'CUR-021', 'CUR-033']),
  step('negative-traits', 'Traços negativos de interpretação', 'narrative', 'Pelo menos um traço negativo; orientação narrativa.', 'explicit', 'Criar livremente, sem limite máximo publicado neste trecho.', 'Tabela d20 Negative, opcional; não sortear uma linha conjunta positivo/negativo por conveniência.', 'Sem adjudicação mecânica automática.', ['scope'], ['role-traits', 'role-table'], ['CUR-016', 'CUR-021', 'CUR-033']),
  step('roleplaying', 'Campos opcionais de interpretação', 'narrative', 'Zero respostas obrigatórias e zero segredos mínimos. Quatro campos livres opcionais: vínculos, valores e motivações, segredos, notas de interpretação.', 'product-policy', 'Preencher somente se quiser; deixar todos vazios não bloqueia criação, aceite, salvamento ou geração completa. A decisão do usuário simplifica Roleplaying Questions, preservando o texto original como referência.', 'Sem geração obrigatória de respostas ou pendência por campo vazio; não inventar história oficial.', 'Compartilhamento com GM não é requisito da criação por esta política do produto.', ['scope'], ['role-questions'], ['CUR-033', 'CUR-036', 'CUR-037']),
  step('group', 'Contexto de grupo e revisão de GM', 'narrative', 'Uma configuração de contexto da campanha; não é atributo ou sorteio individual obrigatório.', 'conditional', 'Definir situação inicial e se personagens já se conhecem; vínculos podem emergir na primeira aventura.', 'Nenhuma tabela de grupo Core nesta evidência.', 'GM e jogadores combinam início; GM revisa personagens e detalhes relevantes.', ['scope', 'professions', 'roleplaying'], ['gm-group', 'gm-level', 'group', 'first-adventure'], ['CUR-033', 'CUR-038']),
  step('future-gains', 'Fronteira de nível e ganhos excluídos', 'guard', 'Zero novice paths e zero ganhos de Level 4 Human no nível 0; a introdução confirma ganhos de nível 4 apenas ao atingir esse nível.', 'explicit', 'Sem escolher spell/Determined do nível 4 agora. Opção incantation do kit continua distinta de aprender magia.', 'Não adicionar 2d6 ss por nível ou Interesting Things de paths ao piloto de nível 0.', 'Nível inicial superior é outra configuração de campanha, fora deste piloto.', ['scope'], ['human-future', 'progression', 'general-level-four'], ['CUR-015', 'CUR-022', 'CUR-023', 'CUR-035']),
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

/** Transcribe explicit numeric markers from this pinned user transcript, including columns and wrapped rows. */
export function transcribeProfessionRanges(text: string, sides: number) {
  const markers = [...text.matchAll(/(?:^|\s)(\d{1,2})(?:[–-](\d{1,2}))?\s+(?=[A-Z])/g)];
  const rows = markers.map((match, i) => ({ min: Number(match[1]), max: Number(match[2] ?? match[1]),
    text: text.slice(match.index! + match[0].length, markers[i + 1]?.index ?? text.length).trim() }));
  if (!rows.length || rows.some(r => !r.text || r.min < 1 || r.max > sides || r.max < r.min)) throw new Error('Invalid profession numeric range');
  for (let n = 1; n <= sides; n++) if (rows.filter(r => r.min <= n && n <= r.max).length !== 1) throw new Error(`Profession range gap/overlap at ${n}`);
  return rows.sort((a, b) => a.min - b.min);
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
  const SupplementSchema = z.object({ schemaVersion: z.literal(1), date: z.literal('2026-10-27'), authority: z.literal('user-supplied-transcription'),
    sourceId: z.literal(SOURCE), scope: z.string(), physicalPdfPage: z.null(), printedPage: z.null(),
    files: z.array(z.object({ path: z.string(), sha256: z.string(), bytes: z.number().int().positive(), origin: z.string() }).strict()),
  }).strict();
  const supplement = SupplementSchema.parse(await json(`${SUPPLEMENT}/manifest.json`));
  const equipmentSupplement = SupplementSchema.parse(await json(`${EQUIPMENT}/manifest.json`));
  const professionsSupplement = SupplementSchema.parse(await json(`${PROFESSIONS}/manifest.json`));
  const suppliedFiles = [...supplement.files, ...equipmentSupplement.files, ...professionsSupplement.files];
  if (supplement.files.length !== 2 || equipmentSupplement.files.length !== 2 || professionsSupplement.files.length !== 1 || new Set(suppliedFiles.map(f => f.path)).size !== 5) throw new Error('Missing/duplicate supplement evidence path');
  for (const file of suppliedFiles) {
    const pin = SUPPLEMENT_PINS[file.path], bytes = await read(file.path);
    if (!pin || file.sha256 !== pin || sha(bytes) !== pin || bytes.length !== file.bytes) throw new Error(`Supplement evidence revision changed: ${file.path}`);
    documents.set(file.path, sourceLines(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  }
  const creationDecisions = z.object({ schemaVersion: z.literal(1), date: z.literal('2026-10-27'), authority: z.literal('explicit-user-instruction'),
    size: z.object({ default: z.literal('ancestry-independent-of-build'), exception: z.literal('explicit-table-or-rule-only'), reason: z.string() }).strict(),
    languages: z.object({ defaultGrant: z.literal('speak-only'), literacyGrant: z.literal('explicit-only'),
      explicitGrantTargets: z.tuple([z.literal('new-language'), z.literal('previously-known-language')]),
      professionExchangeCap: z.null(), tableRestrictions: z.literal('out-of-application-scope'), reason: z.string() }).strict(),
    roleplaying: z.object({ policy: z.literal('optional-free-text'), requiredAnswers: z.literal(0), minimumSecrets: z.literal(0), requiresGMSharing: z.literal(false),
      fields: z.array(z.object({ id: z.string(), label: z.string(), required: z.literal(false) }).strict()).min(1).max(8), reason: z.string() }).strict(),
  }).strict().parse(await json(DECISIONS));
  if (new Set(creationDecisions.roleplaying.fields.map(f => f.id)).size !== creationDecisions.roleplaying.fields.length) throw new Error('Duplicate roleplaying field');
  const inventory = (await read('curation/reconciliation/inventory.jsonl')).toString('utf8').trimEnd().split('\n').map(line => JSON.parse(line));
  const human = inventory.find(r => r.id === 'ancestries:human-shadow-of-the-demon-lord-core');
  if (!human || human.state !== 'captured' || human.sourceIds.length !== 1 || human.sourceIds[0] !== SOURCE || !human.entityId) throw new Error('Human/Core candidate missing or unresolved');
  const evidence = ranges.map(([id, doc, startLine, endLine, anchor]) => {
    const supplementary = doc !== 'human' && doc !== 'general';
    const path = doc === 'human' ? ANCESTRY : doc === 'general' ? GENERAL : doc === 'equipment' ? `${EQUIPMENT}/starting-equipment.txt` : doc === 'wealth-limits' ? `${EQUIPMENT}/wealth-limits.txt` : doc === 'professions' ? `${PROFESSIONS}/professions.txt` : `${SUPPLEMENT}/${doc}.txt`, lines = documents.get(path)!;
    const selected = lines.slice(startLine - 1, endLine), excerpt = selected.map(l => l.text).join('\n');
    if (selected.length !== endLine - startLine + 1 || !excerpt.includes(anchor)) throw new Error(`Pilot evidence anchor/range changed: ${id}`);
    const matches = inventory.filter(r => r.path === path && r.startLine <= endLine && r.endLine >= startLine);
    return { id, sourceId: SOURCE, medium: supplementary ? 'text' : 'md', path, inputSha256: supplementary ? SUPPLEMENT_PINS[path] : PINS[path], startLine, endLine, anchor, excerpt, excerptSha256: sha(excerpt),
      origin: supplementary ? suppliedFiles.find(f => f.path === path)!.origin : 'Reconciled local MD',
      evidenceScope: supplementary ? 'User-supplied supplement; not a CUR-013 inventory or staging entry.' : 'CUR-013 corpus',
      declaredPagination: supplementary ? null : doc === 'human' ? 'Source Page 11 / PDF Page 12 declared at entry start; not certified for every subrange.' : 'Parent section PDF-page declaration only; no per-entry printed-page certification.',
      inventoryRefs: matches.map(r => ({ id: r.id, state: r.state, entityId: r.entityId, reference: r.reference })) };
  });
  const getEvidence = (id: string) => {
    const found = evidence.find(e => e.id === id); if (!found) throw new Error(`Profession evidence missing: ${id}`); return found;
  };
  const categories = ['Academic', 'Common', 'Criminal', 'Martial', 'Religious', 'Wilderness'];
  const selector = transcribeProfessionRanges(getEvidence('supplied-profession-router').excerpt, 6);
  const tables = categories.map((category, i) => {
    const evidenceId = `supplied-profession-${category.toLowerCase()}`;
    const selectorRow = selector[i];
    if (selectorRow.min !== i + 1 || selectorRow.max !== i + 1 || !selectorRow.text.startsWith(`${category}.`)) throw new Error('Profession selector category mismatch');
    return { category, evidenceId, selectorResult: i + 1, ranges: transcribeProfessionRanges(getEvidence(evidenceId).excerpt, 20) };
  });
  const rows = validateSteps(steps, evidence.map(e => e.id));
  await read('tools/curation/core-pilot-matrix.ts'); await read('tools/curation/core-pilot.mjs');
  const matrix = { schemaVersion: 1, task: 'CUR-014', reviewDate: '2026-10-27', status: 'analysis-complete-with-explicit-gaps',
    sourceId: SOURCE, ancestryEntityId: human.entityId, ancestryInventoryId: human.id, targetLevel: 0,
    gates: { importablePack: false, officialGenerationEnabled: false, mechanicalCertification: false, originalInputsModified: false, stagingPromoted: false },
    scope: 'Private MD and user-supplied supplementary evidence matrix; original publication completeness/PDF/permission is not certified. Ancestry tables permit rolling, choosing or inventing narrative alternatives, without a fixed mandatory count.',
    counts: { steps: rows.length, evidenceRanges: evidence.length, stepsWithPending: rows.filter(r => r.pending.length).length },
    supplement, equipmentSupplement, professionsSupplement,
    professionScope: { selectorEvidenceId: 'supplied-profession-router', selectorDice: { count: 1, sides: 6 },
      detailDice: { count: 1, sides: 20 }, tables, numericCoverageComplete: true,
      rangeCount: tables.reduce((sum, table) => sum + table.ranges.length, 0),
      facePairs: 120, importedCatalogEntities: false, literacyHandlersImplemented: false,
      scope: 'Numeric transcript audit only; row text is preserved, not interpreted as profession mechanics. CUR-016/017/021 remain open.' },
    creationDecisions: { path: DECISIONS, appliesTo: ['size', 'human-build', 'roleplaying', 'human-benefit', 'profession-language', 'profession-details', 'background-effects'], decisions: creationDecisions },
    wealthScope: { dice: { count: 3, sides: 6 }, ranges: [
      { min: 3, max: 4, lifestyle: 'Destitute', evidenceId: 'wealth-table' },
      { min: 5, max: 8, lifestyle: 'Poor', evidenceId: 'wealth-table' },
      { min: 9, max: 13, lifestyle: 'Getting By', evidenceId: 'wealth-table' },
      { min: 14, max: 16, lifestyle: 'Comfortable', evidenceId: 'wealth-table' },
      { min: 17, max: 17, lifestyle: 'Wealthy', evidenceId: 'supplied-wealth-limits' },
      { min: 18, max: 18, lifestyle: 'Rich', evidenceId: 'supplied-wealth-limits' },
    ], mappingComplete: true, importedCatalogEntities: false, kitsFormalized: false },
    languageScope: { namedLanguages: ['Common Tongue', 'Dark Speech', 'Dwarfish', 'Elvish', 'High Archaic', 'Trollish'],
      openCategories: [{ label: 'Secret Language', requires: 'Specific organization language and campaign context; not one universal secret language.' },
        { label: 'Dead Languages', requires: 'Specific language introduced by the GM; not one universal dead language.' }],
      exhaustive: false, automaticLiteracy: false, importedCatalogEntities: false,
      acquisition: creationDecisions.languages },
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
