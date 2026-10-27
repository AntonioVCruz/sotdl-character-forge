# Fatia SPEC-004 — duas tradições fictícias

Autorizada pelo pedido de execução. Aprendiz da Centelha mantém seus ganhos/treinamento existentes e passa a requerer tradição e depois uma magia de rank 0. Guardião não recebe esses slots.

- Tradições Brasa Serena e Eco de Vidro, com duas magias narrativas fictícias cada. Não automatizar conjuração, dano ou efeitos permanentes ao aprender magia.
- Novo pack separado `demo-magic@0.0.1`, sem alterar versões dos packs existentes. Tradição usa entidade `rule` com `demoSlot=tradition`; magia usa `spell`, `traditionId`, `rank=0`, `requiresPath` e descrição.
- Slots condicionais `tradition` → `spell`, IDs estáveis, dependências de caminho/tradição. Manual e aleatório compartilham elegibilidade; fallback uniforme somente autorizado.
- Mudança de tradição preserva magia incompatível com pendência, inclusive travada. Mudança para caminho marcial ou nível 0 suspende slots mágicos sem apagar histórico/locks; retornar revalida.
- JSON v2 ampliado de forma aditiva para dois IDs de slot: arquivos existentes continuam legíveis sem modificar eventos. Mágicos antigos passam a ter pendências explícitas até completar aprendizado. Versões anteriores do aplicativo não suportam os novos IDs.
- Ficha mostra tradição, magia, rank, descrição, fonte e indicação de resolução manual da conjuração. Testes de ordem, inelegibilidade, fonte ausente, locks, reprodução, roundtrip e E2E.

Fora de escopo: tradições reais, regra de troca de Occult Philosophy, múltiplos slots de aprendizado, castings e ativação de efeitos.
