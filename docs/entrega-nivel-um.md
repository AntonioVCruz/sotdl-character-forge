# Entrega — progressão demonstrativa 0 → 1

Registro da etapa anterior. O aprendizado do caminho mágico foi estendido em [entrega-magias-demo.md](entrega-magias-demo.md); os limites e contagens abaixo descrevem a entrega original.

## Resultado
Dois caminhos inteiramente fictícios em `examples/demo-level-one.json`, versão 0.0.1. Fonte `demo-level-one-source`, sem página oficial, rotulada fictícia.

| Caminho | Ganhos fixos inventados | Treinamento obrigatório (uma opção) |
|---|---|---|
| Guardião da Trilha | +4 Health | Proteção (+1 Defense) ou Passo (+1 Speed) |
| Aprendiz da Centelha | +2 Health, +2 demo-arcane-reserve | Estudo (+1 Intellect) ou Foco (+1 Will) |

`novicePath` precede `pathTraining`; tipos, nível e vínculo ao caminho são declarados no pack. Escolhas manuais e aleatórias compartilham elegibilidade. O fallback uniforme exige consentimento e nunca é apresentado como tabela oficial. O caminho mágico testa progressão de um perfil mágico com recursos e treino; não implementa tradições, aprendizagem de spells ou castings oficiais da SPEC-004.

## Histórico, dependências e revisão
- Ao mudar 0→1, escolhas existentes são mantidas; o gerador preenche slots ainda vazios, respeitando locks e modo manual/híbrido.
- Nível 0 pendente impede escolher caminho. Treinamento exige caminho válido; somente opções exclusivas desse caminho são oferecidas.
- Trocar ancestry/caminho preserva eventos dependentes e apresenta pendências na prévia. Benefícios dependentes ficam suspensos até revisão; travas não ocultam incompatibilidades.
- Restauração explícita da escolha anterior usa o mesmo validador manual e cria um evento novo que substitui o atual; eventos/rolls anteriores permanecem no histórico. Quantidades antigas são reaproveitadas sem novos dados.
- Retornar ao nível 0 é uma mudança em prévia: eventos e locks de nível 1 ficam inativos, sem serem removidos. Retornar ao nível 1 reutiliza e revalida escolhas; não rerrola nem duplica os ganhos.
- Eventos registram seu nível de aquisição. `levelChanges` registra origem, destino e posição no histórico; importação rejeita nível atual ou ordem de eventos inconsistentes.
- JSON v2 migra v1 de nível 0 preservando eventos, faces, seeds, locks e campos narrativos. A leitura do IndexedDB também migra em memória; gravação seguinte usa v2, mantendo a proteção de concorrência existente.

## Evidências
| Critérios | Cobertura |
|---|---|
| SPEC-002 AC-001/003/007/008 | Slots sequenciais, candidatos compartilhados e eventos com nível; testes dos dois caminhos e treinamentos exclusivos |
| SPEC-002 AC-004/009 | Alteração de caminho/ancestry, locks, restauração, reversão 1→0→1, sem apagar decisões; testes unitários e E2E |
| SPEC-002 AC-006 | Fonte de progressão desabilitada suspende benefícios e conserva nível/histórico |
| SPEC-003 AC-001/003 (subconjunto) | Soma pura dos ganhos com breakdown, repetição sem drift, retorno exato aos valores base ao reverter nível |
| SPEC-006 AC-001/002/003 | Roundtrip de JSON nível 1, migração v1 e reabertura IndexedDB; histórico e resultados preservados |
| SPEC-009 AC-002/005/006/008/009/010 (0–1) | Preview determinístico, preservação das etapas anteriores ao avançar, fallback autorizado, cancelamento e salvamento |

Validação final: **39 testes unitários/integrados e 7 E2E Chromium aprovados**, build TypeScript/Vite aprovado. Os E2E incluem os fluxos anteriores e os novos fluxos manual marcial→mágico, revisão/restauração, avanço aleatório, migração, reversão de nível, export/import e reload. Captura da ficha nível 1 em `test-results/level-one-sheet.png` (não versionada).

## Limites
Ainda não há progressão 2–10, powerful ancestries, motor genérico de cronogramas, flags de regras oficiais, tradições/spells reais, HTML/PDF ou sincronização. `slotLevel` representa o cronograma demonstrativo de seis slots; não deve ser usado como calendário universal de SotDL. O JSON exportado v2 não é legível pela versão antiga do aplicativo.

Plano anterior à implementação: `docs/plano-nivel-um.md`.
