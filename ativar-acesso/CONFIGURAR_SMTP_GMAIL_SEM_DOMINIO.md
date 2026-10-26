# E-mails de acesso sem domínio novo — SMTP de conta Gmail existente

## Objetivo e situação
O aplicativo já solicita recuperação de senha ao Supabase; o gargalo é o servidor de saída. O SMTP padrão do Supabase **não entrega mensagens a usuários fora da equipe Supabase** e limita envios. Para os professores e coordenadores, configure um SMTP real.

Uma conta Gmail **já existente** pode fornecer SMTP sem comprar domínio nem criar novo endereço. Só use uma conta cujo titular autorize o envio, de preferência dedicada às comunicações já existentes da igreja; mensagens aparecerão enviadas por ela. Gmail pode aplicar limites, antispam e bloqueios, portanto faça testes. Não publique nem envie senhas ou senhas de aplicativo em chat ou repositório.

## 1. Preparar o Gmail existente
1. Abra https://myaccount.google.com/security e confirme **Verificação em duas etapas**.
2. Abra https://myaccount.google.com/apppasswords (essa opção pode não estar disponível para contas Google Workspace administradas, Proteção Avançada ou certas configurações de segurança).
3. Crie uma **senha de app** para o uso exclusivo do Supabase e guarde-a **somente para inserir no painel seguro do Supabase**.
4. Não use a senha normal da conta Google.

## 2. Configurar no Supabase
Abra o projeto:
https://supabase.com/dashboard/project/jthxnjvqmvtydyfuqcct/auth/smtp

Em **Authentication > SMTP Settings / Custom SMTP**, habilite envio por SMTP personalizado e informe:

| Campo | Valor |
|---|---|
| Sender email / From | O endereço **da própria conta Gmail existente**, o mesmo do SMTP |
| Sender name | Ministério Infantil — 4ª IEQ Curitiba |
| Host | `smtp.gmail.com` |
| Port | `587` (STARTTLS/TLS; se o painel/provedor exigir SSL direto, tente `465`) |
| Username | O endereço Gmail **completo** |
| Password | A **senha de app de 16 caracteres**, não a senha habitual |

Salve. Nunca coloque essas credenciais em arquivos JS/HTML do aplicativo, GitHub ou mensagens.

## 3. Conferir endereços de retorno
Em https://supabase.com/dashboard/project/jthxnjvqmvtydyfuqcct/auth/url-configuration:

- Site URL: `https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/`
- Redirect URLs:
  - `https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/`
  - `https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/ativar-acesso/`

## 4. Configurar e-mail de recuperação com código
Em https://supabase.com/dashboard/project/jthxnjvqmvtydyfuqcct/auth/templates, abra **Reset Password** e cole o conteúdo deste arquivo do repositório:
`ativar-acesso/MODELO_EMAIL_RECUPERACAO_OTP.html`

Ele usa `{{ .Token }}` e orienta a digitar o código em `/ativar-acesso/`. Não use o link automático `{{ .ConfirmationURL }}` neste modelo, porque alguns verificadores de links podem consumir o token antes do usuário.

## 5. Teste de aceitação antes de liberar a equipe
1. Escolha **uma conta real de teste autorizada**, de preferência o próprio administrador ou um professor que concordou com o teste, sem apagar ou recriar contas.
2. No aplicativo, use **Primeiro acesso ou esqueci minha senha** com o e-mail cadastrado.
3. Verifique se **a mensagem chegou a esse endereço, não apenas se a API respondeu sucesso**; examine spam também.
4. Digite o código no link de ativação, crie senha com no mínimo 10 caracteres, entre por CPF e senha, saia e entre novamente.
5. Repita com destinatário externo à equipe Supabase para confirmar o desbloqueio real.
6. Se falhar, examine **Supabase > Logs > Auth** antes de repetir o envio; não tente dezenas de vezes.

Atenção: o Supabase aplica limite inicial de **30 e-mails por hora** quando se configura SMTP próprio; Gmail também tem limites diários e pode suspender envios considerados suspeitos. Não dispare dezenas de ativações simultâneas antes de testar.

## 6. O que NÃO fazer
- Não criar novas contas Auth para pessoas que já existem;
- Não alterar CPF, sala, perfis, permissões ou senhas em lote;
- Não habilitar a divulgação de tokens ou service-role na aplicação pública;
- Não confundir resposta de solicitação de recuperação com prova de entrega;
- Não depender do botão Reenviar enquanto o SMTP não estiver operacional.

## Fontes oficiais
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/redirect-urls
- https://support.google.com/accounts/answer/185833
- https://support.google.com/a/answer/176600
