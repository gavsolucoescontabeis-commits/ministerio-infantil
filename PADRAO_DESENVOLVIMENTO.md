# PADRÃO OBRIGATÓRIO — DESENVOLVIMENTO DE SISTEMAS
Aplicar como diretriz aos projetos Ministério Infantil, GAV Folha, Fiscal, Contabilidade, sites e próximos sistemas.
1. Iniciar em repositório versionado e ambiente de desenvolvimento/publicação real, com banco de dados centralizado e backups; não usar HTML local como arquitetura final.
2. Definir antes da primeira tela: usuários, autenticação individual, papéis/permissões por ação e escopo, dispositivos, simultaneidade, sincronização, auditoria, migrações, integridade e recuperação.
3. Toda funcionalidade nasce integrada ao banco e à autorização no servidor; nunca confiar apenas em botões ocultos no navegador.
4. Projetar acesso responsivo por computador/celular e uso simultâneo; conflitos de edição não podem sobrescrever dados silenciosamente.
5. Validar automaticamente cada módulo e cada perfil desde o início, incluindo negação de acessos indevidos, regressão e preservação dos dados aprovados.
6. Manter versões estáveis isoladas, alterações em ramificações e publicação apenas depois de testes. Não substituir sistemas aprovados por protótipos incompletos.
7. Entregar versões completas, testáveis, com link público e instruções simples; não transferir decisões técnicas de arquitetura ao solicitante.
8. Quando um projeto não precisar de múltiplos usuários, registrar a decisão explicitamente, mantendo possibilidade de evolução sem reescrita integral.
