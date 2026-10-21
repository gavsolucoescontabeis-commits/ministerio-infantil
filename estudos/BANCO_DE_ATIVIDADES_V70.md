# Estudos V70 — Roteiro do Professor + Banco de Atividades

## Decisão aprovada

O botão **Sugerir Aula** deve produzir apenas sugestões textuais para o professor: objetivo, contexto histórico/bíblico, roteiro fiel à passagem escolhida, perguntas, referências para conferência e aplicação. **Não gerar caderno infantil, artes, mascotes ou folha de gabarito** a partir dessa função. A visualização/impressão do roteiro é independente e não depende de arte.

## Banco de Atividades (gratuito)

- Catálogo compartilhado em `estudos/banco-atividades.json`, com arquivos estáticos em `estudos/pacotes/`.
- Campos de cada pacote: `id`, `title`, `age` (idade exata), `ageLabel`, `aliases`, `books`, `status`, `student`, `teacher`, `cover`, `summary`, `pages`.
- `draft`: elaboração; `review`: aguardando aprovação; `approved`: disponível para a equipe.
- Apenas `approved` pode ser oferecido pelo aplicativo. Exigir conferência editorial, ortografia, fidelidade bíblica, qualidade visual e impressão A4 antes de mudar a situação para aprovado.
- Os materiais não se inserem no roteiro: o professor decide se abre/imprime o pacote ofertado.
- Correspondência de tema por aliases normalizados e referência bíblica, sem confundir histórias próximas nem misturar idades. Pacotes específicos para uma idade não devem ser oferecidos a outra.
- Pacote **A Criação — 9 anos** publicado anteriormente permanece `review` até aprovação visual; não promovê-lo a `approved` sem o usuário validar.
- Ao acrescentar um novo tema, criar e conferir seus arquivos HTML/PDF, cadastrar uma nova entrada no JSON e publicar. **Não alterar o gerador de roteiros para cadastrar um pacote.**

## Segurança e continuidade

- Backups e aulas antigas seguem no armazenamento local do navegador, com exportação/importação existente.
- O GitHub Pages distribui publicamente o catálogo e arquivos; **não é um banco de dados de informações pessoais e não exige API paga**.
- O módulo Estudos já está acessível pelo menu principal a usuários com acesso ao aplicativo. A URL estática própria pode ser aberta diretamente por quem a conhece; não tratar GitHub Pages como controle de login.
- Não modificar cadastros, EBD, QR Code, Rede, Equipe, Financeiro ou permissões por causa do módulo Estudos.
- Preservar as artes originais aprovadas de Lia, Pipo e Maya. Novos pacotes artísticos devem ser feitos com padrão ilustrado aprovado pelo usuário e nunca improvisados com recortes colados.
- Evitar renderização automática de imagens quando alguém está apenas preparando o roteiro bíblico.

## Testes mínimos

1. Criar roteiro para A Criação, Adão e Eva e Davi e Golias: somente texto, sem caderno infantil.
2. Abrir um roteiro salvo: não perder dados e imprimir apenas o roteiro.
3. Abrir Banco de Atividades: materiais `review` não são oferecidos.
4. Em teste isolado, mudar temporariamente um pacote para `approved`: reconhecer aliases, passagem e idade exata; rejeitar outras idades, Adão e Eva e temas não relacionados.
5. Verificar navegação no computador e no celular e não modificar funções alheias a Estudos.
