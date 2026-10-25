# Ministério Infantil — certidão de antecedentes para equipe menor de 18 anos

Implementado em 25/10/2026.

## Regra estadual (Paraná)
A Polícia Civil do Paraná esclarece que menores de 18 anos, inclusive emancipados, não conseguem emitir o Atestado de Antecedentes Criminais do Instituto de Identificação.
Fontes oficiais:
- https://www.policiacivil.pr.gov.br/FAQ/Perguntas-Frequentes-Atestados
- https://www.policiacivil.pr.gov.br/Pagina/ATESTADOS-EXPEDIDOS-PELO-INSTITUTO-DE-IDENTIFICACAO-DO-PARANA

**Importante:** a dispensa implementada é especificamente do atestado **estadual do Paraná**, não é afirmação genérica sobre certidões federais, autorizações legais ou proteção de menores.

## Comportamento do aplicativo
- Pré-cadastro coleta data de nascimento de todas as pessoas.
- Idade inferior a 18 anos: oculta e dispensa o arquivo e data de emissão da certidão estadual; requer nome e telefone do responsável legal.
- A dispensa **não** aprova automaticamente o voluntário.
- Aprovação de menor: o administrador marca confirmação expressa de que verificou nascimento, autorização do responsável e supervisão por adulto. Sem confirmação, backend recusa.
- Backend não gera arquivos de certidão falsos nem cria vencimentos artificiais.
- Relatório das certidões: status `minor` -> **Dispensada — menor de 18 anos**. Não é atraso/pendência. Mostra `nextRequiredOn` na data do 18º aniversário.
- No dia dos 18 anos, o status é recalculado; sem documento, a situação se torna `missing` e passa a integrar as pendências.
- Maiores de idade continuam exigindo arquivo, data de emissão e validação normal, sem mudanças nas certidões existentes.
- Os dados do responsável são mantidos na tabela `staff_applications_v60`, com leitura limitada a administrador via RLS existente.

## Componentes atualizados
- `cadastro-equipe/index.html` (formulário público).
- Edge Function `v60-staff-application-submit`, versão 7.
- Edge Function `v60-admin-import-staff-application`, versão 5.
- RPC `v60_import_staff_application`, com confirmação administrativa autenticada e campos `birthDate` no estado da equipe.
- RPC `v64_staff_certificate_report`, com dispensa e data do 18º aniversário.
- `staff-pending.js` e `cert-report-v64-7.js`; cache atualizado em `index.html`.

## Cadastros legados
Antes desta atualização o pré-cadastro **não coletava data de nascimento**. Não adivinhar idades por CPF, nome ou outros dados, nem retroceder a dispensa sem confirmação. Para registros anteriores, a data de nascimento precisará ser informada e conferida individualmente antes de aplicar a regra.

## Validação
Código frontend verificado sintaticamente; Edge Functions publicadas como ACTIVE; migrations criadas no banco; testados limites de idade com consultas SQL. Fluxo real de envio/primeiro cadastro completo requer teste de usuário autorizado. Não usar dados fictícios de pessoas na produção.

## Comprovante obrigatório de idade (atualização)
- O pré-cadastro de menores **exige RG, CIN ou certidão de nascimento**, com data de nascimento legível.
- Aceita **PDF, JPG/JPEG, PNG ou WebP**, até **10 MB**, enviados diretamente pelo formulário. Não aceita arquivos executáveis nem Word como comprovante.
- Backend verifica formato MIME e assinatura mágica de PDF/imagens antes do upload.
- Arquivo original é guardado no bucket **privado** `certidoes-ministerio`, caminho `pending/{applicationId}/idade/comprovante.{ext}`. Esse arquivo permanece preservado e acessível somente à administração mesmo após a aprovação, sem divulgação pública.
- Administrador abre o comprovante pela tela de pré-cadastros, confere a data de nascimento e marca **confirmação específica do documento** além da autorização do responsável.
- A função de aprovação confere no servidor o caminho, a existência do arquivo privado e os dois indicadores administrativos. Falhas bloqueiam a aprovação e não criam login.
- Cadastro importado registra `age_proof_confirmed_at` e `age_proof_confirmed_by`, mantém nome e caminho do documento original. Registro e PDF da certidão estadual permanecem vazios para menores.
- Após completar 18 anos, a certidão estadual torna-se exigível; o documento antigo de idade permanece consultável em histórico para a administração.
- A prova de identidade **não substitui** a autorização do responsável ou as condições de proteção da igreja.
- Documentos anexados por menores **não são exibidos nos relatórios** para coordenadores; continuam disponíveis somente ao administrador.

## Verificações necessárias
O código e as definições do banco foram conferidos; o teste completo de ponta a ponta deve ser realizado com pré-cadastro autorizado real ou ambiente de homologação antes da operação rotineira.
