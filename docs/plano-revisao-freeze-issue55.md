# Atividades da issue #55

Escopo inicial: revisão semântica, rastreabilidade, distribuição e freeze do recorte Human L0 integrado na main `9c22a5c`. Autoria: Codex. Início: 2026-11-04. Trabalho isolado na branch `codex/issue55-review-freeze`, em `output/html/issue55-work`; preservar o workspace original.

1. [x] Inventariar os contratos, fontes/edições, dados ativos, handlers, testes, políticas e pendências do recorte.
2. [x] Consolidar a matriz resultado/entidade → fonte/edição/versão → evidência → handler → teste → revisão → destino, sem publicar excertos ou corpus.
3. [x] Conferir os lotes e as probabilidades, revisar os casos condicionais e registrar autoria, método, achados, decisões do usuário e limites da conferência de fonte/paginação.
4. [x] Documentar o conteúdo permitido por destino: ambiente local, Git, JSON de personagem, impressão/PDF e HTML, mantendo gates explícitos e sem inferir direitos de terceiros.
5. [x] Produzir manifesto de freeze reproduzível com versões, hashes, cobertura e exclusões; verificar alteração de entrada/implementação e preservar os 16 contratos congelados.
6. [x] Executar o aceite vertical dos percursos suportados e dos bloqueios de fonte/handler, com persistência, replay e finalização separados de distribuição.
7. [x] Validar o instrumento de revisão/freeze com dados inventados, conferir fontes reais locais, TypeScript, build, privacidade e integridade.
8. [x] Registrar a entrega e a decisão de habilitação do recorte, distinguindo conclusão técnica, pendências de fonte e permissões de distribuição; atualizar o checklist com evidências.

Ordem: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Publicação, PR, merge e deploy são etapas separadas.

## Fontes e decisão do usuário

Os PDFs não estavam nos diretórios locais conferidos. O usuário informou uma pasta privada no Google Drive e autorizou consultar os livros e gerar artefatos a partir deles, proibindo subir os PDFs ao repositório online. Core, Only Human e Oddities foram localizados nessa pasta e copiados somente para `tmp/private/pdfs/` deste checkout, diretório ignorado pelo Git. Links autenticados de download, identificadores de acesso e transcrições ficam locais.

A revisão agora deve conferir também os PDFs disponíveis. Não declarar edição ou paginação sem evidência; manter quaisquer limites que ainda restarem. A autorização de consulta não concede direitos de distribuição nem promove fontes por si só. A política vigente conserva corpus, pilotos, evidências e relatórios completos no ambiente local. As #55/#56 não recebem permissões de distribuição por inferência de testes ou hashes.

## Evidencias da execucao

Entrega e aceite em `docs/entrega-revisao-freeze-issue55.md`; matriz em `docs/matriz-revisao-freeze-issue55.md`; revisao em `docs/revisao-semantica-issue55.md`; destinos em `docs/destinos-permissoes-issue55.md`. Instrumentos: `tools/curation/review-pdf.py`, `review-human-l0.mjs` e `review-freeze.ts`. Snapshot: `curation/human-l0-review-freeze.json`. Validacao: 435 testes publicos, 154 dirigidos reais e dois casos de navegador; build/auditoria e 16 contratos aprovados. PDFs e derivados completos permanecem privados.
