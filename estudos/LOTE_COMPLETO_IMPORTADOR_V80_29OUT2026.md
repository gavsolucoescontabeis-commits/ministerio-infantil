# Lote completo do Ministério Infantil — 29/10/2026

## Arquivos finais na Biblioteca
`/Ministerio Infantil/Estudos/Pacotes de Publicacao/Lote_Completo_29OUT2026/`

- **`IMPORTAR_7.zip`**: 7 cadernos ainda não publicados; único ZIP recomendado para importação no app. ZIP método STORED (0, sem compressão), 7 PDFs soltos na raiz, com nomes e SHA-256 correspondentes ao cadastro.
- **`TODOS_APROVADOS.zip`**: 17 PDFs — 9 já publicados + 7 pendentes + José do Egito (montagem das 16 atividades aprovadas, ainda sem registro próprio para importação, revisar a qualidade de impressão).
- **`MANIFESTO_TODOS_APROVADOS.json`**: caminhos, bytes, páginas, SHA-256 dos 17 PDFs.
- **`LEIA_PARA_IMPORTAR.txt`**: instruções e pendências.

## Correção necessária do publicador em lote

A versão anterior `publicar-lote.js` somente reconhecia arquivos quando `status='review'`, mesmo se o material estava `approved` com `published=false`. O importador V80 passa a aceitar **qualquer material editorialmente aprovado que ainda não foi publicado**, sem duplicar versões parciais. A página `publicar-lote.html` recebeu `?v=80` para renovar cache. A publicação continua condicionada a autorização de administrador, validação de PDF original por SHA-256, envio ao bucket e confirmação de leitura pública; o material não é marcado publicado por causa da montagem do ZIP.

Foram cadastrados no Supabase como `review` os cadernos originais aprovados **Davi e Golias 7 anos** (`DAVI_7.pdf`) e **Davi e Golias 8–9 anos** (`DAVI_89.pdf`), ambos ainda sem link público. **Moisés 5–6** foi apontado para a versão leve aprovada de 14 páginas, mantendo no registro o SHA do original de 53MB — o PDF original ultrapassa o teto de 50MB, a versão leve tem 11,7MB; nenhuma imagem foi redesenhada.

O ZIP de importação foi conferido item a item: o hash de cada PDF corresponde ao SHA registrado, todos possuem cabeçalho válido `%PDF-`, tamanhos inferiores a 50MB e não possuem compressão no ZIP, subpastas ou data descriptor. O importador V80 foi conferido por consulta aos sete registros pendentes no banco.

## Conteúdo de `IMPORTAR_7.zip`:
1. Davi e Golias 5–6 — 7 páginas
2. Davi e Golias 7 — 7 páginas
3. Davi e Golias 8–9 — 9 páginas
4. Moisés 5–6 — 14 páginas
5. Moisés 7–9 — 7 páginas
6. Esaú e Jacó 7–9 — 7 páginas
7. Jesus transforma água em vinho 5–6 — 7 páginas

## Conteúdo não importável automaticamente
- José do Egito — 16 atividades aprovadas, montagem de 17 páginas sem faixa etária/registro adequado e resolução de miniaturas. Está **somente no ZIP completo**, não no de importação.
- Criação 7–9 consta como aprovada no cadastro, mas não foi localizado o PDF original validado; não incluído.
- Moisés 7–9 versão parcial de 4 páginas é obsoleta em relação ao caderno final aprovado de 7 páginas.
- Nove PDFs do manifesto original de 29/10 já estão no bucket `mi-estudos-atividades`; por isso não devem ser reenviados.

**NUNCA afirmar que a importação foi concluída antes do responsável enviar o ZIP na interface administrativa e o Storage confirmar o arquivo.**