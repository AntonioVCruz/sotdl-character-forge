# SPEC-007 — Exportação HTML autônoma, dinâmica e editável
**Status:** Draft. **Prioridade:** P2 (obrigatório para produto final). **Requisitos:** RF-013.

## Intenção
Gerar uma ficha como o HTML de Liliana: páginas consultáveis, campos narrativos editáveis, efeitos ativáveis e características que se atualizam dinamicamente. O arquivo deve abrir offline em navegador comum, sem requerer serviço web.

## Aceitação
AC-001: a exportação contém um snapshot de Character JSON e ruleset/packs necessários ao cálculo autorizado, versionados e autocontidos onde viável.
AC-002: editar nome/notas e ativar/desativar equipamento/efeitos recalcula valores da ficha sem internet.
AC-003: reimportar o estado editado para o criador principal não perde escolhas e recursos; conflitos de versão são sinalizados.
AC-004: UI desktop e impressão A4 seguem os mesmos cálculos e respeitam paginação.
AC-005: nenhuma string de usuário ou pack injeta script; CSP e escaping corretos, sem `eval`.
AC-006: sem suporte mecânico para determinada regra, mostrar texto/aviso, sem simular cálculo incorreto.
AC-007: estado persistido no arquivo não depende exclusivamente de `localStorage` (deve permitir salvar HTML atualizado ou JSON, mesmo em browsers que limitem file://).
AC-008: tamanho do HTML e dependências são mensurados; fontes/imagens só são embutidas quando permitidas por licença.

## Não incluir
Edição integral de regras, criação de personagem e importação de novos packs dentro do HTML exportado; esses fluxos permanecem no app principal.

## Aditivo v0.2 — origem dos resultados
**AC-009:** ficha HTML exportada mostra resultados de tabelas no histórico da personagem e, quando aplicável, no breakdown dos atributos; reabrir não os sorteia novamente.
**AC-010:** reimportar ficha com JSON contendo rollEvents mantém exatamente resultados, edição manual e versão da fonte, sem executar novos sorteios na runtime offline.
**Nota de escopo:** o gerador completo vive no aplicativo principal (SPEC-009), não na ficha autônoma, que é um visor/editor de estado e efeitos.
