# Ministério Infantil – desenvolvimento v58

**Branch de desenvolvimento:** `desenvolvimento-v58`. Não publicar nem substituir `main/index.html` antes de homologação da v58.

## Situação real
- Supabase: projeto `jthxnjvqmvtydyfuqcct`, região `sa-east-1`.
- Estruturas já criadas: perfis, salas, crianças, presenças, broches, transferências, saldo inicial e movimentações de talentos.
- Funções de banco: `checkin_by_badge`, `register_child_checkin`, `deliver_brooch`, `transfer_room`, `record_talents`, `talent_statement`.
- **Ainda não concluídos:** autenticação CPF/senha, criação segura de contas, migração dos dados locais, integração com HTML, câmera QR, PWA, testes de ponta a ponta. Não afirmar que estão prontos.

## Requisitos aprovados
1. Preservar rigorosamente todas as funcionalidades homologadas da v57, inclusive impressão de crachás 9/página (60×80 mm) e 4/página (90×125 mm).
2. Login por CPF e senha, com papéis desenvolvedor, coordenador, professor. Só desenvolvedor cria coordenadores.
3. QR contém identificador opaco; leitura autenticada registra presença sem duplicidade.
4. Broche após três domingos consecutivos; entrega registrada uma única vez.
5. Visitante opcionalmente vinculado à criança que o convidou.
6. Transferência coletiva entre salas com histórico.
7. Cada criança possui saldo inicial individual de talentos; lançamentos posteriores somados, histórico e auditoria de correções.
8. PWA instalável e base central Supabase; LGPD e RLS obrigatórias.

## Bloqueios antes da publicação
- Localizar e conferir **arquivo exato da v57 homologada**: o `main/index.html` inspecionado ainda menciona v46 no título.
- Definir provisionamento seguro do primeiro desenvolvedor sem receber CPF/senha no chat.
- Implementar login CPF/senha sem expor credenciais privilegiadas, com proteção contra enumeração e tentativas repetidas.
- Definir fluxo de migração dos cadastros e saldos já armazenados em cada navegador, evitando duplicidade e perda.
- Testar políticas RLS com usuários de papéis diferentes e dados fictícios.
- Validar cálculo de talentos e broches com exemplos e regras de calendário.
- Publicar somente após autorização explícita e homologação.

**Observação:** as funções e políticas SQL existentes precisam de revisão completa antes de liberar acesso a dados reais de crianças.
