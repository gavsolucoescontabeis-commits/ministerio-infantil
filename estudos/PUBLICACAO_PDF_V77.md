# V77 — Publicação contínua do Banco de Atividades
## Problema resolvido na arquitetura
Não armazenar mais novos PDFs como múltiplas partes de base64 no GitHub. O catálogo fica no Supabase PostgreSQL e os PDFs ficam em um bucket Storage próprio.

## Regras
- Bucket: `mi-estudos-atividades`, público para leitura dos arquivos editoriais, limitado a PDFs de 50 MB.
- Exclusivamente `profiles.role = developer` ativo pode fazer upload e inserir/atualizar os metadados; os professores recebem acesso somente às linhas `approved`.
- Arquivos são gravados com nomes imutáveis em `id-do-pacote/uuid.pdf` e **nunca** sobrescritos.
- Após upload, a página verifica HTTP 200 no arquivo público; só então atualiza o pacote de `review` para `approved`.
- Tema, faixa etária, referências e aliases ficam na linha `public.mi_study_activity_packages`. A seleção automática é feita pelo aplicativo quando o professor prepara a aula.
- Os rascunhos de aulas dos professores e toda a área de acessos permanecem intactos.

## Como publicar o caderno de 5 e 6 anos
1. Abrir o aplicativo principal com login de desenvolvedor/administrador e entrar na aba **Estudos**.
2. Abrir **Banco de Atividades → Publicar PDF aprovado (Admin)**. Este controle só aparece dentro do aplicativo autenticado.
3. Selecionar o registro existente **A Criação — 5 e 6 anos** e escolher o arquivo `A_Criacao_Caderno_5_a_6_anos_7_paginas.pdf`.
4. Clicar **Enviar e publicar no Banco** e confirmar a mensagem de sucesso, com o botão **Abrir PDF publicado**.
5. Abrir novamente os Estudos. Para **5 a 6 anos**, aparece o novo PDF. Para 7–9 anos, permanece o caderno antigo.

## Limite do ambiente desta sessão
O PDF de 7 páginas está pronto na Biblioteca do usuário e tem SHA-256 `cf493871c9d99e6b0f87042e06698ff39d2c7af08a3657dd2d8601cb7284e78a` (21,5 MB).
O conector disponível aqui não recebe o arquivo binário diretamente do ambiente de criação. Por isso a primeira publicação exige escolher o arquivo no navegador do administrador. O mecanismo de upload passa a ser reaproveitado nos próximos cadernos, sem novo commit de código por arquivo.
O formulário usa POST simples para PDFs, cujo máximo do bucket é 50 MB; conexões lentas podem exigir repetição do upload.
## Testes
- Passaram testes de roteamento: `5 a 6 anos` e `6 anos` → `criacao-5-6`; `7 a 8 anos` e `9 anos` → `criacao-9`.
- `10 a 12 anos` → nenhum caderno aprovado ainda.
- Tema **Adão e Eva** não se confunde com **A Criação**.
- Políticas de escrita por `developer` e bucket PDF-only conferidas no banco.
- Falta teste de upload real autenticado no navegador do usuário. **Não afirmar que o arquivo já está publicado** enquanto `criacao-5-6` estiver em `review`.
