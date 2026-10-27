# PLAN-007
Plano executado do subconjunto fictício: `docs/plano-html-autonomo.md`. Evidências: `docs/entrega-html-autonomo.md`.

Criar `StandaloneSheetRuntime` usando o **mesmo** motor puro, empacotado como JS local, e gerar HTML com JSON serializado seguro + CSS de impressão. Offline sem servidor, estado serializado por exportações subsequentes e botão "Salvar ficha/JSON". Não usar direct `innerHTML` com dados não confiáveis; sanitização e CSP. O template de Liliana serve como golden fixture de interface, não o script de regras legado.

## Complemento v0.2
Serializar também rollEvents + generationMetadata. A runtime não precisa embutir PRNG para reexibir a ficha; operar só com decisões já aprovadas.
