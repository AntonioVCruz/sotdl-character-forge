# Evidência e revisão — contrato 1

CUR-004 define o sidecar `ReviewSchema` em `packages/curation/evidence.ts`. Ele não altera o manifesto estrito dos packs nem habilita conteúdo no criador. Cada revisão registra sujeito, responsável, justificativa e referências de evidência por eixo. `Codex / análise local` identifica a análise automática desta entrega; não representa revisão humana ou autorização do titular.

| Eixo | Estados | Condição para avançar |
|---|---|---|
| Permissão/proveniência | needs-review, authorized, restricted | Evidência específica da autorização; ter recebido um MD não certifica distribuição pública. |
| Transcrição | unreviewed, md-checked, pdf-checked, blocked | MD: trecho e hash conferidos. PDF: inspeção real da página física, com hash do PDF. |
| Estrutura | unreviewed, checked, blocked | Limites, cabeçalhos e vínculos da unidade conferidos; não apenas JSON válido. |
| Mecânica | unreviewed, checked, manual, blocked | Números, condições e relações conferidos; pendências continuam explícitas. |
| Automação | unsupported, manual, implemented, blocked | Implemented exige mecânica checked, handler e testes identificados. |

Os eixos não promovem uns aos outros. Uma fonte autorizada pode conter transcrição pendente; texto conferido no MD pode ter mecânica não revisada. `curated` é uma decisão posterior do compilador/revisor, nunca derivada apenas de uma alegação do insumo. O catálogo atual também exige fonte autorizada e página impressa positiva para uma entidade real `curated`.

Evidência MD: caminho relativo, SHA-256 dos bytes originais, linhas inclusivas (base 1), cabeçalho, trecho e SHA-256 desse trecho. Para o hash do trecho, normalizar apenas separadores de linha para LF e unir as linhas selecionadas sem terminador final. Manter o texto original; qualquer limpeza terá diff próprio na CUR-012. A validação estrutural do schema não verifica hashes: o gate deve reabrir o arquivo e conferir bytes e trecho.

Evidência PDF é outro registro: hash do PDF disponível e página física inspecionada. `printedPageDeclared` e `pdfPageDeclared` são strings declaradas no MD, preservando ranges ou marcadores de dúvida; nunca são convertidas por offset presumido. `physicalPdfPage` só aparece na evidência PDF. Uma frase do MD dizendo que PDFs foram auditados continua sendo evidência MD dessa alegação.

Quando o input mudar, invalidar os gates que dependem de seu hash; manter revisão antiga no histórico, abrir nova revisão com justificativa e executar novamente os gates afetados. Não reaproveitar uma aprovação apenas porque o título/ID permaneceu igual. Nenhum responsável ou motivo pode ser omitido, inclusive em estados iniciais ou bloqueados.
