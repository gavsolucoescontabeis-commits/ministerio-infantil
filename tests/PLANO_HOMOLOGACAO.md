# Homologação obrigatória — Ministério Infantil (V69)

## Regra
Toda mudança deve ter critérios de aceitação definidos **antes** da alteração, execução de testes em ambiente isolado, registro de resultado e autorização para publicação. Não solicitar a professores ou famílias que testem defeitos técnicos.

## Áreas
- **Desenvolvimento:** branch de trabalho, sem afetar o aplicativo em produção.
- **Homologação:** testes automáticos no GitHub Actions e testes integrados em banco/Storage **separados** do ambiente real.
- **Produção:** somente depois de evidência de aprovação. Uma execução de CI verde não prova que o Supabase recebeu um cadastro real.

## Critérios do cadastro de equipe
1. Menor: campos de responsável e comprovante visíveis; certidão dispensada; botão sempre visível.
2. Maior: certidão e data de emissão exigidas; campos de responsável ocultos.
3. Campos obrigatórios incompletos: informar qual campo precisa ser corrigido, sem envio.
4. Falha de rede/backend: mostrar erro, não anunciar cadastro concluído.
5. Sucesso: backend confirma e devolve protocolo; registro e arquivo privado são verificados em ambiente de homologação.
6. Testes não devem enviar CPF, dados pessoais ou documentos reais. Interceptar chamadas em testes de navegador.
7. Regressão: módulos e materiais aprovados continuam inalterados.

## Bloqueio de liberação
O workflow de homologação roda nos PRs que afetam o cadastro e pode ser executado manualmente. **O GitHub Pages existente ainda publica diretamente a branch main**; para bloquear tecnicamente publicações sem teste, é necessário configurar proteção de branch/status checks e exigir PR aprovado. Até lá, não considerar o processo de liberação totalmente protegido.

## Limite do teste atual
Os testes Playwright simulam respostas da API e **não gravam dados no Supabase**. Antes de divulgar uma mudança que altere persistência, autenticação, anexos ou permissões, executar testes de integração com projeto Supabase de homologação e verificar protocolo, registros e Storage. Não usar produção como ambiente de testes.
