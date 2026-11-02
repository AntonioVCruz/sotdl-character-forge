# Integração do motor Human L0

Entrega de 2026-11-02, atividade 4 da sequência na #7. A base do [pack mecânico v1](contrato-mecanico-human-l0.md) agora tem handlers no pacote `character-generator`, com cálculo, comandos, histórico, JSON e IndexedDB. O escopo é a base revisada, em **prévia local**; a geração oficial e os procedimentos completos continuam pendentes.

## Entradas do pacote

`packages/character-generator/runtime.ts` reúne o dispatch dos dois tipos de personagem. O tipo existente `sotdl-demo-character` mantém seus parsers, migrações e cálculo; o novo tipo é `sotdl-human-l0-character`, schemaVersion 1, nível 0 e `mode: local-preview`.

APIs Human: `newHumanL0Character`, `performHumanL0Command`, `calculateHumanL0Character`, `parseHumanL0Character`, `importHumanL0Character` e `exportHumanL0Character`. O dispatch compartilhado oferece `parseGeneratedCharacter`, `calculateGeneratedCharacter`, `importGeneratedCharacter` e `exportGeneratedCharacter`.

Uso com os packs locais já validados e uma seleção do contrato:

```ts
import {
  newHumanL0Character, performHumanL0Command, calculateHumanL0Character,
} from '../packages/character-generator/runtime';
import {
  saveHumanL0Character, loadHumanL0Character,
} from '../packages/character-generator/storage';

const initial = await newHumanL0Character(selection, packs);
await saveHumanL0Character(initial, null);
const next = await performHumanL0Command(initial, packs, {
  type: 'state', target: 'damage', value: 2, reason: 'Alteração registrada pelo usuário.',
});
await saveHumanL0Character(next, initial);
const reopened = await loadHumanL0Character(initial.id);
const view = await calculateHumanL0Character(reopened, packs);
```

A API usa WebCrypto/SHA256 e IndexedDB nativos no navegador. A chave `human-l0/<id>` fica no banco existente, separada da ficha demo. O salvamento compara a versão anterior inteira na mesma transação; alterações concorrentes são recusadas. Nenhum pack, evidência extensa ou cache de totais é embutido no JSON da ficha. Nomes, escolhas e motivos manuais são dados do usuário.

## Cálculo e mudanças de escolhas

O motor aplica modo de atributos, transferência opcional única, ajustes nos atributos, limites dos atributos, características-base, substituição manual de Defense/equipamento e efeitos diretos, limites finais, Healing Rate de Health final e modificadores dos scores finais. Size é uma escolha independente; não é inferido de Build.

As seis combinações estruturais Core/expansão, fixo/aleatório e Core/Human Development são aceitas pelo contrato. Idiomas concedem somente fala. A alternativa de ancestry Core só aparece em Core com procedimento Core, sem acumular o bloco da expansão. Direitos de escolha de profissão são expostos como direitos; não são profissões geradas. A alternativa de profissão aleatória permanece pendente até existir seu handler de procedimento.

`create` inicializa Damage/Insanity/Corruption uma vez, a partir da fonte selecionada. Eventos `state` registram os valores posteriores. Trocar atributos, modo, Size, variante ou procedimento não restaura esses valores nem apaga o histórico.

Comandos `manual-effect` aceitam somente ajustes explicitamente atribuídos ao usuário, com motivo. Eles permitem exercitar as camadas de atributos/características e registrar Defense/Speed de um equipamento manual. Não são interpretações automáticas de tabelas ou itens publicados. Uma substituição manual de Defense não soma a Agility como a política fictícia do demo. Duas substituições simultâneas suspendem o cálculo; desativar uma resolve o conflito. Efeitos sem formato suportado são recusados.

## Aleatoriedade, fontes e reabertura

`roll-attributes` é a única fronteira de sorteio: quatro substreams independentes, seed, versão do PRNG, faces e IDs de evento. O índice de rerrolagem é derivado do histórico de comandos de rolagem. Cálculo, importação e reabertura reutilizam os registros e não chamam RNG.

Seleções com faces já registradas também podem ser importadas. O parser confere formato, versão do PRNG, vínculos/consistência de eventos e limites das faces no contexto da fonte; não trata o arquivo como prova criptográfica de que essas faces foram produzidas pela seed. Reutilizar um ID de rolagem com conteúdo conflitante é recusado.

Cada seleção guarda referências exatas e hashes SHA256 canônicos dos packs necessários, incluindo dependências. A reabertura não escolhe a versão mais nova nem aceita alteração de conteúdo sob a mesma versão. Sem a fonte original, o arquivo continua legível e preservado, mas o cálculo fica suspenso. Migração entre revisões antigas e novas exige tratamento explícito futuro; não é feita silenciosamente.

`baseResolved` indica que a base pôde ser calculada. `fullyResolved` e `officialGenerationEnabled` continuam falsos. As pendências incluem resultados completos de procedimento/tabelas, catálogo de equipamento e fonte/distribuição. O wizard e os exports HTML/PDF existentes continuam no fluxo demo; esta entrega fornece a API do motor e persistência Human, sem introduzir uma tela oficial. Os gates antigos de runtime nos artefatos de curadoria descrevem a integração completa da fatia, ainda não aprovada.

## Aceite executado

```powershell
npm run curation:accept:runtime
```

O comando recompõe a projeção mecânica com seus gates de evidência, importa Core → expansão sem ativar o ruleset e compara o motor com a prévia de referência da formalização revisada. Verifica as seis combinações, mudanças de estado/seleção e reabertura JSON, sem imprimir valores de livro nem publicar artefatos reais.

Validação: **370 testes em 42 arquivos**, incluindo 16 cenários novos do motor; build e TypeScript aprovados; os 16 arquivos congelados, os hashes das projeções anteriores e ambos os validadores continuam válidos. **Cinco testes Playwright** passaram: IndexedDB/WebCrypto nativos com reload da ficha Human e as quatro regressões do wizard demo. O JSON reaberto conserva estados e faces; a ficha demo permanece preservada.

Autoria do aceite técnico: Codex, com fixtures fictícias públicas e conferência local dos packs reais revisados. Não constitui parecer independente do Curador ou autorização de distribuição.

- [x] Revisar o conteúdo-base Human L0.
- [x] Definir o contrato mecânico do pack.
- [x] Estender compilador e validação da base revisada.
- [x] Integrar a base ao motor, com mudanças de escolhas e salvamento/reabertura.

As pendências dos demais lotes/procedimentos, interface real, fonte/distribuição, PDF, freeze e habilitação oficial foram [transferidas da #7 para as #34–#37](transferencia-escopo-issue7.md). A #7 conserva o contrato/fatia draft S1 aceitos e permanece aberta para decisão de encerramento. L1 continua na #21; histórico e backups permanecem na #16.
