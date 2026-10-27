# Prompt — Wireframe do SotDL Character Forge (Claude Design)

Copie o bloco abaixo para o Claude Design. Ele está em inglês para o modelo, mas pede rótulos de UI em português (pt-BR), como no app.

---

```text
Design a set of LOW-FIDELITY WIREFRAMES for "Forja de Personagens" (SotDL Character Forge), a web app that creates and evolves characters for the tabletop RPG *Shadow of the Demon Lord*. Grayscale boxes, real labels, no final visual style yet. Include a short annotation next to each screen explaining interactions and states.

## Product in one paragraph
Offline-first, single-user app (no accounts, no backend). Players enable rule sources (books / content packs), then build a character from level 0 up to level 10, step by step. Every step can be chosen manually OR randomized, and every random result is auditable (seed, individual dice, table used, source/page). The finished character is shown as a dynamic sheet where equipment and spell effects can be toggled and every number explains where it came from. It exports to JSON, an editable offline HTML file, and an A4 print/PDF sheet.

## Users
- Player: wants to build a character fast (fully random) or carefully (manual), or mix both.
- Game master: enables/disables books, variants and house rules per campaign.

## Language & content rules
- UI labels in Brazilian Portuguese. Official game terms stay in English (Ancestry, Path, Novice/Expert/Master, Strength, Agility, Intellect, Will, Health, Defense, Healing Rate, Speed, Power, Perception, Insanity, Corruption, Tradition, Spell, Talent, Wealth, Interesting Thing).
- Use ONLY fictional placeholder content. Do not reproduce book text. Example data: ancestry "Human (Core)"; paths "Guardião da Trilha" (martial) and "Aprendiz da Centelha" (magic); traditions "Brasa Serena" and "Eco de Vidro"; spells "Lanterna de Brasa", "Fio de Calor"; item "Bastão de Viagem".

## Core interaction pattern: the ChoiceSlot card (design this first, reuse everywhere)
Each creation step is one or more ChoiceSlot cards containing:
- Title + context (e.g. "Background · Human · fonte X, p. 00").
- Actions: [Escolher manualmente] [Sortear] [Rolar novamente] (only after a result exists) [Travar / Destravar] [Ver dados e fonte] [Histórico].
- Strategy badge, always visible as text: "manual" | "tabela publicada" | "aleatório entre opções válidas (não oficial)" | "pendente".
- If no randomization strategy applies, "Sortear" is disabled with a written reason.
- Current result + "Consequências" (what it changes on the sheet) with status "Aplicadas" or "Requerem revisão".
- Roll trace (expandable): dice expression (e.g. 3d6), each face, total, matched range, table, source/page, seed, reroll index.
- Invalid options are SHOWN but disabled, each with the reason (missing prerequisite, source disabled, etc.). Never hide them.
- A proposed random result is a preview until the user confirms it.

## Screens to wireframe (desktop 1440px first)

1. Início / Personagens
   List of saved characters (name, level, ancestry, path, status "Completo" or "Rascunho com pendências"). Actions: Novo personagem, Importar personagem JSON, Abrir. Empty state.

2. Biblioteca de fontes & Ruleset
   Table of ~95 publications/packs: title, version, entry counts by type (ancestry/path/spell/item/table), curation status (curated / needs-review / incomplete), enabled toggle. Filters and search. Import pack JSON (max 5 MB). Note that importing does NOT enable. House rules / optional rules section with explicit toggles (e.g. "Transferir 1 ponto de atributo"). Warning when disabling a source used by an existing character ("escolhas ficarão suspensas, não apagadas").

3. Criador — wizard layout
   Left: vertical stepper with per-step status (vazio / escolhido / travado / pendente / requer revisão). Center: ChoiceSlot cards for the active step. Right: sticky live mini-sheet (attributes + derived stats) that updates as choices change. Top bar: mode selector [Manual] [Híbrido] [Tudo aleatório], Nível-alvo (0–10), seed display, button "Gerar tudo aleatoriamente".
   Steps (one frame each, or one frame + a list showing the variants):
   a. Ruleset e fontes (summary + link to screen 2)
   b. Ancestry (+ variant; choose fixed attributes or random attributes when the ancestry allows)
   c. Atributos (base values from ancestry, optional single 1-point transfer if the ruleset allows, calculation shown)
   d. Detalhes narrativos via tabelas: Idade, Porte, Aparência, Background, Personalidade (each a ChoiceSlot, often d6/d20/3d6 tables)
   e. Profissões e Idiomas (professions with sub-tables, languages, literacy)
   f. Riqueza e Equipamento inicial (3d6 wealth roll, kit choices, item list)
   g. Interesting Thing (chained d6 → d20 roll, show both rolls)
   h. Nome e Notas (optional, explicit Save button)
   i. Progressão por nível: per level, Novice/Expert/Master path choice, talents/trainings; level timeline showing which levels grant what
   j. Tradições e Magias (sequential slots in order: tradition, then spell rank 0, etc.; show rank, tradition, source)
   k. Revisão final: all decisions, pending items, "Completo" vs "Rascunho com pendências" status, Confirmar.

4. Modal "Gerar tudo aleatoriamente" (2 stages)
   Stage 1 Configuração: ruleset/packs, nível-alvo, filtros, per-slot lock list (checkboxes), fallback authorization checkbox "Permitir sorteio uniforme entre opções válidas (não oficial)", seed field (optional) + "Nova seed".
   Stage 2 Prévia: list of every generated decision grouped by level, each with strategy badge and expandable roll trace; a "Pendências" block with cause and "Resolver manualmente" link; warnings; overall flag (fullyResolved yes/no). Buttons: Confirmar, Editar slot, Cancelar ("a ficha atual não será alterada").

5. Prévia de mudança de nível / árvore de impacto
   When the user changes ancestry, path or target level: tree of dependent decisions, each marked "preservado", "requer revisão" or "suspenso". Action "Restaurar escolha anterior" when available. Confirm / Cancel.

6. Ficha do personagem (dynamic sheet, view mode + edit mode toggle)
   - Header: portrait placeholder, name, level, ancestry, current paths, status badge.
   - Atributos: Strength, Agility, Intellect, Will (score + modifier).
   - Características: Perception, Defense, Health (current/max), Healing Rate, Size, Speed, Power, Damage, Insanity, Corruption. Each number is clickable → opens the explanation drawer.
   - Talentos / treinamentos with source.
   - Grimório (only appears if the character has spells): spell cards with rank, tradition, description, source.
   - Inventário e equipamento: items with quantity, source, modifier, state "Equipado" / "Guardado" / "Suspenso", actions Equipar / Desequipar.
   - Conjuração e efeitos de sessão: castings left per rest (e.g. 2/2), "Registrar conjuração", effect list with toggle (Ativar / Encerrar), source, duration, scope, affected value; "Descansar e restaurar usos".
   - Transformation banner (highlighted, removable, original values preserved).
   - Pendências da ficha and Avisos (e.g. missing source).
   - Escolhas e proveniência (compact list with strategy badges).

7. Drawer "Origem dos valores"
   For one stat (e.g. Defense): ordered operations (base, ancestry, armor, active spell, caps), each with source and duration, and the final value. Warnings when something is suspended.

8. Histórico / Auditoria
   Chronological event log: decisions, rolls (faces, totals), substitutions (old result struck through, not deleted), level changes, seed and PRNG version. Filter by level/slot.

9. Exportar
   Options: Exportar JSON (backup), Exportar HTML offline (editable standalone file), Visualizar ficha A4, Imprimir / Salvar como PDF (hint: A4, 100% scale, disable browser headers). Note "somente o estado confirmado é exportado".

10. Ficha A4 (print preview)
    1–2 A4 portrait pages, dense, readable in black and white: header, attributes, characteristics, talents, grimoire, inventory, active effects, pending items, source list. Page breaks visible.

11. Mobile (390px) versions of: wizard step with a ChoiceSlot card (stepper becomes a top progress bar + drawer), the character sheet (stacked sections with collapsible panels), and the "Gerar tudo" preview. Mobile prioritizes creation and consultation; A4 is a separate mode.

## Key states to show somewhere
- Empty slot, proposed random result (unconfirmed), confirmed, locked, needs review, pending/unresolved, disabled option with reason.
- Source disabled → choice suspended (still visible, greyed, with warning).
- Draft with pending items: the UI must NEVER say "Completo" while a required choice is unresolved.
- Cancel always leaves the saved character untouched.

## Accessibility notes to annotate
Full keyboard navigation, visible focus, labelled controls, Escape closes modals/drawers and returns focus, strategy badges are text (not color only), roll history readable by screen readers.

## Deliverable
A flow overview (screen map with arrows: Início → Fontes → Criador → Gerar tudo → Ficha → Exportar) followed by each screen as a labelled frame with annotations. Keep it lo-fi and consistent; reuse the ChoiceSlot card component across all creation steps.
```
