# Checklist por feature SDD

- [ ] Problema, ator e resultado observável claros?
- [ ] Critérios testáveis em Given/When/Then, incluindo casos-limite?
- [ ] Requisitos rastreiam às tarefas e testes?
- [ ] Dependências, fontes e variantes explicitadas?
- [ ] Regras mecânicas confirmadas em fonte/página ou marcadas como pendência?
- [ ] Nenhuma regra nova embutida na UI?
- [ ] Persistência, acessibilidade, segurança e migrações consideradas?
- [ ] Testes de regressão e efeitos temporários previstos?
- [ ] Export HTML/PDF reflete o CharacterView atual?
- [ ] Limitações de licenciamento e publicação documentadas?

## Checklist específico de rolagens e geração
- [ ] Cada `ChoiceSlot` possui manual/sortear/refazer e status de elegibilidade?
- [ ] A rolagem usa dado exato e pesos da fonte, não seleção uniforme de linhas?
- [ ] Tabelas encadeadas, rerrolagens, bônus mecânicos e rolagens secundárias são auditáveis?
- [ ] `seed`, `prngVersion`, versão do pack e `sourceRef` persistem e geram replay?
- [ ] Modo «gerar tudo» percorre níveis e revalida pré-requisitos após cada escolha?
- [ ] Locks, contexto, pack e house rules são respeitados?
- [ ] Se faltar dado, UI sinaliza `unresolved` sem inventar/falsear finalização?
- [ ] Todo sorteio é disparado por intenção do usuário, nunca por rerender de ficha?
- [ ] Cancelamento de preview conserva estado original?
