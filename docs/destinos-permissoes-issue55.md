# Destinos e permissões da fatia Human L0 — #55

Aplicação da política vigente em `docs/politica-distribuicao-conteudo.md`, sem ampliá-la. A autorização do usuário permite consultar seus PDFs e gerar artefatos locais; proíbe subir os PDFs ao repositório online. Posse/acesso, hashes e aprovação técnica não concedem direitos de redistribuição.

| Conteúdo | Ambiente local privado | Git público | JSON de personagem (#56) | Impressão/PDF (#56) | HTML de personagem (#56) |
| --- | --- | --- | --- | --- | --- |
| PDFs, imagens de páginas, transcrições e excertos extensos | Consulta/revisão autorizada | Proibido | Excluir | Excluir | Excluir |
| Pilotos, evidências completas, catálogos e matriz local | Permitido pela política local | Excluir | Excluir | Excluir | Excluir |
| Links autenticados, credenciais, marcas de comprador e identificadores de compra | Acesso privado necessário à consulta; nunca incorporar à ficha | Excluir | Excluir | Excluir | Excluir |
| Código, contratos, fixtures inventadas e documentação própria | Permitido | Permitido após revisão de privacidade | Não incorporar ferramentas/fixtures ao personagem | Idem | Idem |
| Metadados bibliográficos, hashes, versões, IDs e decisões próprias | Permitido | Permitido sem trechos protegidos ou dados pessoais | Somente referências mínimas necessárias | Referências mínimas | Referências mínimas |
| Dados pessoais do personagem escritos pelo usuário | Persistência local | Somente exemplos fictícios | Candidato mediante escolha do usuário e implementação do gate | Idem | Idem |
| Características numéricas calculadas e escolhas da ficha | Persistência local | Somente fixtures fictícias/metadados de revisão | Candidato à projeção mínima após validação #56 | Idem | Idem |
| Descrições, regras e textos licenciados de resultados/itens/capacidades | Uso local conforme política | Excluir | Sem autorização específica, excluir o texto; não serializar o contexto | Idem | Idem |

“Candidato” não significa funcionalidade liberada. Os três formatos de exportação continuam desabilitados. A #56 deverá selecionar campos explicitamente, aplicar a política ao conteúdo de cada campo e revalidar a finalização/contexto no momento da emissão. Um save local, um contexto de cálculo ou um relatório de curadoria não pode ser reutilizado como export público por serialização genérica. Não estabelecer aqui um novo direito para nomes/descrições de catálogos: qualquer campo de origem licenciada sem permissão definida continua excluído.

Um personagem tecnicamente finalizado pode conservar efeitos de uso; isso não autoriza distribuir o texto de tais efeitos. O futuro export pode representar pendências/metadados próprios sem reproduzir as regras do livro, sujeito à implementação e aos testes da #56. A avaliação do destino é independente de `fullyResolved`.

Destino da entrega #55: código de revisão, testes fictícios, documentação própria, política de metadados e manifesto público. Relatório detalhado, PDFs, textos extraídos, imagens e links de download permanecem em diretórios ignorados. Fontes `needs-review` e `exportEnabled: false` são preservados. Novas permissões exigem decisão específica e revisão conforme a política existente.
