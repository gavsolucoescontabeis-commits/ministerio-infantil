# Recuperação de senha do Ministério Infantil — configuração da autenticação
A página `/ativar-acesso/` já oferece verificação manual de código pelo `supabase.auth.verifyOtp({ email, token, type: 'recovery' })`, além de permanecer compatível com links antigos.

## Configuração necessária no painel Supabase hospedado
1. No projeto `jthxnjvqmvtydyfuqcct`, abra **Authentication → URL Configuration**.
2. Configure **Site URL** como `https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/`.
3. Na lista **Redirect URLs**, adicione as duas URLs exatas:
   - `https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/`
   - `https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/ativar-acesso/`
4. Abra **Authentication → Email Templates → Reset Password** e substitua **apenas esse modelo** pelo conteúdo de `MODELO_EMAIL_RECUPERACAO_OTP.html`.
5. O modelo envia a variável nativa `{{ .Token }}` e direciona para uma página sem credenciais na URL, de modo que verificadores de links não consumam o código antes do usuário. **Não** usar `{{ .ConfirmationURL }}` no modelo de recuperação.
6. Salve e teste com **uma conta de teste autorizada**, solicitando novo código no aplicativo. Na tela `ativar-acesso/` informe o e-mail e o número recebido.
7. Se houver limite de envio de e-mails, não repetir as tentativas em massa; o administrador pode usar o recurso pré-existente **Gerar senha provisória** por pessoa (entregar apenas ao titular).

**Não são necessárias mudanças nas contas, nos perfis ou nas permissões.** Não há alteração nos modelos de e-mail de confirmação, convite ou em outros projetos.

## Por que corrigir o modelo
O padrão antigo envia `{{ .ConfirmationURL }}`, que executa uma verificação GET de token de uso único antes de redirecionar. Filtros automáticos de provedores podem abrir esse link primeiro, invalidando-o para o usuário. Ao trocar por código digitado, o primeiro acesso à página não consome token.

Referências oficiais:
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/kb/troubleshooting/otp-verification-failures-token-has-expired-or-otp_expired-errors
