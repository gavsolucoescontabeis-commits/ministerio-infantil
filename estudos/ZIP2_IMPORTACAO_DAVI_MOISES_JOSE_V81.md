# ZIP 2 — Publicação dos nove PDFs aprovados (V81)

## Arquivo original preservado
Biblioteca: `/Ministerio Infantil/Estudos/Pacotes de Publicacao/DOIS_ZIPS_29OUT2026/ZIP_2.zip` (119.715.837 bytes). Cópia materializada para download nesta conversa como `ZIP_2_PUBLICAR_APROVADOS.zip`. **Não é preciso renomear nem extrair PDFs**: a versão V81 lê ZIPs STORE ou DEFLATE, inclusive subpastas, e compara os PDFs por SHA-256.

## Resultado conferido por cruzamento entre manifesto e banco
Nove PDFs no pacote: 
- **Já publicados, sem reenviar:** Esaú e Jacó 7–9; Jesus transforma água em vinho 5–6. Arquivos presentes no Storage.
- **Pendentes elegíveis, sete PDFs:** Davi e Golias 5–6 (SHA leve aprovado), Davi 7, Davi 8–9, Moisés 5–6 Caderno 1, Moisés 5–6 Caderno 2, Moisés 7–9 final, José do Egito 16 atividades (PDF de 17 páginas).
- **Aprovação editorial preservada**: os registros pendentes ficam `review` ou `approved` + `published=false` até envio REAL ao Storage e verificação. A nova V81 seleciona elegíveis e diferencia publicados pelo SHA, sem exigir o nome do PDF.
- **Moisés**: o registro anterior com caderno único de 14 páginas foi marcado como edição histórica substituída (`partialEdition=true`, `published=false`) para não causar duplicidade. Dois registros aprovados de 5–6 representam os PDFs divididos autorizados.
- **José**: as ilustrações aprovadas foram cadastradas para importar o PDF existente, sem alterar as páginas. A idade indicada no cadastro (5 a 9) é **provisória** e deve ser revisada pedagogicamente; impressão de quadros com resolução limitada também merece revisão.
- **Criação 7–9**: PDF original não encontrado, não consta no ZIP 2, não inventar arquivo.

## Código corrigido
- `estudos/publicar-lote.js` V81: parser ZIP por diretório central; descompressão interna com `DecompressionStream('deflate-raw')`; mapeamento por `pdfSha256` ou hash de versão leve previamente registrada; indicação separada de já publicados e pendentes.
- `estudos/publicar-lote.html`: sufixo `?v=81` para renovar o JavaScript.
- **Segurança**: a autorização da conta administradora e a verificação da integridade dos arquivos permanecem. Abrir o importador via app logado e selecionar o ZIP 2 original, sem extrair.
- **Teste não executado**: browser/HTTP de produção e envio real dependem de teste na sessão autenticada do responsável. Não declarar PDFs pendentes como publicados até a confirmação real pelo Storage.

## Resultado esperado antes do envio
"Prontos para enviar: 7. Já publicados no aplicativo: 2. Outros arquivos ignorados: 0. Aprovados ainda ausentes no pacote: 0."

Se o aplicativo ainda mostrar texto da versão anterior, reabrir a página do importador e atualizar o navegador para carregar `v=81`. 
