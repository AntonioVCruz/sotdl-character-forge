# Fatia vertical nível 0 — decisão e plano

Autorizada pelo pedido de executar o próximo passo. Implementa o subconjunto demonstrativo das SPEC-002/003/005/006/008/009, sem ampliar para níveis 1–10 ou regras oficiais.

## Contratos e decisões
- Quatro slots obrigatórios: ancestralidade, background dependente da ancestralidade, equipamento e objeto curioso. Atributos são derivados da ancestralidade fictícia, sem criar uma rolagem não prevista. Nome e notas são livres e opcionais.
- As tabelas existentes permanecem fictícias; estratégia `demo-table` é distinta de `official-table` e `uniform-eligible`. Nenhum demo será apresentado como regra oficial.
- PRNG fixo `mulberry32-fnv1a-v1`, substreams por seed/slot/contador; faces via rejeição de inteiros fora do múltiplo do domínio. Render, importação e cálculo não consomem PRNG.
- Escolha manual usa os mesmos candidatos e resolutores; quantidades secundárias são informadas explicitamente no modo manual. Resultados manuais não inventam faces de dados.
- Rascunho contém cópia do personagem e histórico append-only. Confirmar verifica estado base e catálogo; cancelar descarta. Escolhas manuais são travadas por padrão. Dependências inválidas permanecem visíveis, com pendência, sem apagar histórico.
- JSON versionado inclui eventos, resultados, fontes, versões, locks, seed e faces. Importar valida estrutura e coerência, mas não refaz sorteios. Ausência de fonte impede novos usos e gera aviso preservando decisões.
- IndexedDB salva apenas o personagem confirmado ou importado. Catálogo segue separado. Um personagem local nesta fatia; falha de gravação não atualiza a ficha confirmada.

## Implementação
1. Fixture adicional com duas ancestralidades, dois equipamentos e background alternativo; conteúdo explicitamente fictício.
2. Motor puro de dados/tabelas, encadeamentos, limites e traces. Eventos mecânicos suportados: modificador aditivo e quantidade de recurso; outros viram pendência.
3. Planner/elegibilidade nível 0, geração de slot e completa/híbrida, locks e revalidação.
4. Cálculo puro com breakdown e avisos; schemas de personagem e persistência.
5. Interface de criação, prévia, confirmação/cancelamento, ficha, histórico e JSON.
6. Testes determinísticos, distribuição, cadeia, efeito, locks, dependência, import/export e E2E manual/híbrido/aleatório.

## Fora desta fatia
Conteúdo Core, progressão 1–10, magias, condições/transformações completas, exportação HTML/PDF e instalação PWA. Não marcar as SPECs completas pela entrega desse subconjunto.
