# Protocolo do Banco de Atividades — aprovação, arquivo seguro e publicação

Vigente para todos os cadernos do Ministério Infantil. O usuário aprovou que materiais finalizados sejam preservados e disponibilizados no aplicativo sem depender do histórico do chat.

## Regras sem exceção

1. **Preservar a arte aprovada**: não recriar, redesenhar, cortar ou recomprimir desnecessariamente. Alterações apenas as solicitadas, mantendo o arquivo anterior arquivado.
2. **Ao receber aprovação**, reunir a capa aprovada e as páginas originais individuais; verificar página a página e exportar PDF A4; registrar faixa etária **apenas no catálogo/nome do arquivo**, não nas artes.
3. **Imediatamente criar duas cópias duráveis na Biblioteca do Ministério Infantil**: PDF final e ZIP de fontes. Registrar páginas, tamanho, SHA-256 e o local da cópia. A Biblioteca é independente da conversa.
4. **Cadastrar a versão no Supabase** como `review` enquanto não há URL pública válida no Storage. O registro deve incluir `pdfFilename`, `pdfSha256`, `ageMin`, `ageMax`, `aliases`, `books` e `references`.
5. **Publicar no aplicativo somente após upload REAL** do PDF ao bucket `mi-estudos-atividades`, verificar HTTP 200 e checksum, então marcar `status=approved` e `published=true`. Não fingir publicação concluída quando apenas existe a linha SQL.
6. Os PDFs aprovados NÃO podem ser perdidos nem substituídos por versões de baixa resolução, links temporários ou materiais de revisão.
7. **Limitação de conectores**: o conector Supabase nesta conversa trabalha com SQL/Edge Functions, mas não faz upload dos bytes do arquivo local ao Storage; o GitHub conectado também não lê bytes locais. Na ausência de uma ponte autorizada de transferência direta, preservar PDF e originais na Biblioteca e manter estado pendente claramente visível. Não exigir download dos arquivos pelo usuário como condição para preservação; nunca afirmar publicação efetivada até verificação.
8. Quando o aplicativo suportar integração de transferência direta e autorizada, acionar automaticamente a publicação no ato da aprovação; até lá, oferecer o publicador Admin que já existe (Estudos → Banco de Atividades → Publicar PDF aprovado) e registrar o bloqueio.

## Pendências verificadas em 23/10/2026

- **A Criação • 7–9**: `criacao-9` — aprovado e disponível no app.
- **A Criação • 5–6**: `criacao-5-6` — PDF de 7 páginas preservado na Biblioteca; SHA-256 `cf493871c9d99e6b0f87042e06698ff39d2c7af08a3657dd2d8601cb7284e78a`; `review` aguardando upload ao Storage.
- **Adão e Eva • 5–6**: `adao-eva-5-6` — PDF final de 7 páginas com "Siga as Pegadas", preservado em `/Ministerio Infantil/Estudos/Banco de Atividades/Adao e Eva/Aprovados/`; SHA-256 `909bc714a04b75764ffcabc7ee1ae6c99b9f085f57e1e28fdda9596e08249ea7`; `review` aguardando upload ao Storage.
- **Caim e Abel • 5–6**: `caim-abel-5-6` — capa + seis atividades em PDF de 7 páginas preservado em `/Ministerio Infantil/Estudos/Banco de Atividades/Caim e Abel/Aprovados/`, com ZIP de fontes individuais; SHA-256 `ddebdb779d9338d23e0fe2fb915bce33ca919350fe7b8fda1530ac640ac7c199`; `review` aguardando upload ao Storage.

## Fechamento

A entrega só pode ser informada como **disponível no aplicativo** após constar arquivo real no bucket e link verificável pelo professor. Caso contrário, informar claramente **arquivado com segurança, pendente de publicação**.
