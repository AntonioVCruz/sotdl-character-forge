# Fatia de sessão — conjuração e efeitos fictícios

Autorizada pela solicitação de executar o próximo passo, após o aprendizado demonstrativo. Integra SPEC-003/004/005/006 no subconjunto 0–1.

- Pack separado `demo-spell-session@0.0.1`, sem alterar os packs de aprendizado já publicados. As quatro magias recebem definições demonstrativas de duas conjurações por descanso e um modificador temporário aditivo de +1 em atributo declarado.
- `session.actions` é um log separado de `events` de criação. Registrar conjuração consome uso e cria uma instância inativa; ativar/encerrar não consome usos. Ativar exige o aprendizado original ainda válido e a fonte/versionamento exatos disponíveis.
- Cada magia admite um efeito ativo por vez. Registrar outra conjuração exige encerrar o efeito anterior. Efeitos só afetam o próprio personagem, duram até encerramento explícito e não se acumulam com outra instância da mesma magia.
- Descansar restaura usos e encerra/invalida as instâncias anteriores, preservando o histórico. Não usa relógio, timer, RNG ou regras oficiais.
- Trocar ancestralidade/caminho/tradição/magia, desabilitar fonte ou retornar a 0 pode suspender benefícios. Nunca apagar consumo de usos nem reatribuir instância a outro evento de aprendizado. Encerrar e descansar continuam possíveis mesmo com fontes ausentes.
- Ficha pura recompõe valores base + escolhas válidas + efeitos válidos, com breakdown. Nenhuma UI altera números diretamente.
- JSON v2 recebe `session` com default vazio para arquivos anteriores. Salvar/importar/reabrir mantém o log; não reexecuta comandos, não rola dados. Dados malformados de sessão são rejeitados.
- Testar limites, no drift após 100 ativações/encerramentos, término/restauração, fonte ausente, mudança de aprendizado, roundtrip, arquivo antigo e E2E.

Não inclui combate, duração automática, stacking geral, condições/transformações, regras reais de castings, múltiplos personagens ou níveis adicionais.
