# Revisão semântica dos lotes — #55

Autoria: Codex. Data: 2026-11-04. Revisão: `human-l0-issue55@1.0.0`. A conclusão é restrita ao Human L0 local implementado e às exclusões abaixo. Não é aprovação editorial dos livros completos, promoção global a `curated` ou licença de distribuição.

## Método e evidências

Os construtores oficiais revalidam hashes, spans, reextração e dependências dos derivados locais antes da revisão. O instrumento percorre sete lotes e gera uma matriz de metadados por entidade. A cópia de cada PDF é identificada pelo hash dos bytes e pelo número de páginas. `review-pdf.py` usa pypdf e normalização Unicode para apoiar a comparação; registra versões do Python, pypdf e Unicode no relatório privado. Não publica texto nem declara aprovação semântica automática.

Das 769 evidências distintas por fonte/ID/hash, 745 atingem o limiar de concordância textual. Os 24 blocos restantes foram separados para interpretação editorial/layout; não são 24 resultados divergentes. Todos os 871 resultados textuais das tabelas atingem concordância; 851 também apresentam faixa numérica e prefixo do resultado juntos na extração. As outras 20 associações são a coluna negativa dos traços Core, conferida visualmente na página impressa 28/física 29. Os 30 registros restantes são IDs internos de destinos de quatro seletores, conferidos por suas rotas e regressões, não frases impressas.

A concordância por fragmentos tolera ligaturas, quebra de linhas e ordem de colunas. Não comprova equivalência semântica completa, resolução mecânica nem associação individual de toda evidência a uma página. A revisão combina essa conferência com leitura das instruções de criação, inspeção dos handlers e testes de consequências/replay. As páginas de layout inspecionadas visualmente incluem Core físicas 27 e 29, Only Human 13 e 14, Oddities 7. As demais instruções do recorte foram consultadas na extração local dos PDFs.

## Disposição dos 24 blocos

| Grupo | IDs | Disposição |
| --- | --- | --- |
| Cabeçalhos editoriais dos Markdown | human-source; general-boundary; human-expansion-source | Não são transcrições literais do PDF. Identidade e cobertura confrontadas com as cópias; não usar para certificar uma frase do livro. |
| Profissões em colunas | supplied-profession-academic; supplied-profession-criminal; profession-router; profession-common; profession-criminal; profession-wilderness | Separação de colunas/numeração altera a sequência extraída. Resultados confrontados por linha; roteamento e faixas conferidos. |
| Riqueza e kits | wealth-table; equipment:core:wealthy; kit-high; supplied-starting-equipment; supplied-wealth-limits | Faixas separadas do texto e kit continuado na página seguinte. Conferência Core físicas 26–27; distinguir os kits Only Human da página 13. |
| Coisas interessantes Core | thing-1; thing-3; thing-4; thing-5; thing-6 | Blocos em colunas não mantêm sequência linear. Resultados conferidos separadamente; preservada a correção local anterior. |
| Oddities | oddities:whole-section; selector:oddities | Bloco de seis páginas inclui metadados editoriais. Conferidos resultados e seletor da página 2, sem exigir igualdade literal do bloco inteiro. |
| Tabelas paralelas Only Human | table:only-human:fears; table:only-human:desires | Extração intercala duas tabelas; associação das colunas conferida visualmente na página 14. |
| Perguntas de interpretação | role-questions | Continuação entre páginas e títulos editoriais. Tratamento narrativo/opcional, sem introduzir efeitos mecânicos. |

Essas disposições explicam a divergência da extração e não reescrevem as evidências originais nem elevam seu status global. Nenhum resultado divergente que exigisse corrigir o corpus foi identificado nessa comparação.

## Probabilidades e consequências

As 74 identidades compreendem 70 streams numéricos e cinco lookups determinísticos (uma identidade possui múltiplas colunas). As distribuições são recalculadas com inteiros, incluindo 3d6/4d6; não se assume probabilidade uniforme por linha. Um teste independente enumera todas as faces e compara os pesos dos 70 streams. Os quatro seletores compostos somam exatamente 1 por aritmética inteira; os pesos armazenados também são confrontados. Modificadores de Childhood/Lifestyle permanecem distintos da distribuição sem modificador. Os testes de grafo verificam sua aplicação; a auditoria não declara distribuição conjunta de todos os possíveis personagens, ciclos ou escolhas manuais.

| Caso conferido | Resultado da revisão |
| --- | --- |
| Ancestralidade, atributos e procedimento | Core e Only Human preservam fontes/versões separadas; atributos fixos/aleatórios e procedimento escolhido não se confundem. Benefícios de nível 4 ficam fora do L0. |
| Human Development | Substitui o procedimento de background/profissões/riqueza correspondente; rolagens dirigidas e dependências preservadas. Não tratar suas tabelas como escolhas livres do procedimento Core. |
| Profissões/idiomas | Distinguir fala, leitura e escrita; direitos concedidos/exigidos; especialização concreta herdada da família sem rerrolar ou conceder equipamento da família ao personagem. |
| Pais mortos | Causa independente para cada pai: decisão expressa do usuário, pois a instrução do livro não resolve essa cardinalidade de forma inequívoca. |
| Build e escala etária | Aplicar Build às medidas-base antes da escala: decisão expressa do usuário. Mudança de faixa etária após eventos recalcula medidas conforme o handler. |
| Idade e experiências | Quantidade vinculada à rolagem inicial; anos posteriores não criam experiências adicionais: decisão expressa do usuário. |
| Piety | Repetições preservam crenças e acrescem Insanity após a primeira ocorrência; limite de execução mantém pendência, sem truncar como sucesso. |
| Strange e suplementos | Rerrolagem específica quando o suplemento não está em uso; suplemento habilitado sem handler mantém bloqueio. Sem substituição por benefício inventado. |
| Equipamento/dinheiro | Kits por fonte e estilo de vida, escolhas exclusivas, quantidades, moeda exata e conflitos de equipamento preservados. Perfis ausentes não ganham estatísticas por aproximação. |
| Coisas interessantes | 120 resultados Core exercitados individualmente; 240 Oddities mapeados e conservados com suas condições. A regressão não afirma 240 execuções completas independentes. |
| Finalização | Consequências de criação pendentes bloqueiam; uso posterior separado não bloqueia, conforme decisão expressa do usuário. Reabertura não sorteia novamente. |

## Limites conservados

O inventário mantém cinco ambiguidades de itens e 57 definições não resolvidas, sem convertê-las em dados mecânicos completos. Efeitos contextuais, conjuntos mistos, adjudicações, tradições sem definição, transformações e suplementos sem handler conservam o tratamento explícito do runtime. Os quatro ciclos permanecem limitados, com histórico e pendência. O teste de finalização comprova percursos suportados, não a completude de todas as combinações do espaço de criação.

A revisão aprova manter o recorte técnico local já autorizado, dentro desses limites. Não habilita novos livros, formatos de exportação, distribuição pública de corpus ou aplicação automática de efeitos ainda excluídos. Fontes permanecem `needs-review`; a habilitação local não elimina obrigações de criação pendentes.
