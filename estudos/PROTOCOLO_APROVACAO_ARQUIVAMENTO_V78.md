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


## Padrão visual e de produção — bloqueio contra regressão (26/10/2026)

**ANTES DE CRIAR QUALQUER IMAGEM**, ler `estudos/PADRAO_V65.md`, `estudos/IDENTIDADE_VISUAL_V66.md` e este protocolo; consultar os arquivos originais aprovados das atividades anteriores (não reinterpretar a aparência a partir de uma descrição). Se a referência visual não estiver disponível ou não puder ser inspecionada, informar essa limitação e **não substituir por arte genérica**. Um chat novo não é autorização para redefinir o padrão.

- **Arquivo principal de referência visual:** páginas originais individuais dos cadernos aprovados; a prévia `Esau_e_Jaco_5_a_6_anos_APROVADO_Previa_7_paginas.jpg` na Biblioteca é uma amostra visual do acabamento, **não** fonte para ampliar ou recortar as miniaturas.
- **Formato:** uma página individual por imagem, A4 vertical, inteira e em alta resolução; **nunca** gerar uma colagem, prancha de miniaturas ou quadro panorâmico como se fosse um caderno pronto. Só apresentar montagens de prévia depois de existirem as páginas individuais aprovadas.
- **Caderno:** capa própria + seis atividades individuais (sete páginas), salvo acordo explícito e específico de outro tamanho. **Sem indicação de idade escrita na capa ou nas artes**; indicar a faixa no catálogo/nome do arquivo. Evitar espaços enormes vazios e exercícios triviais.
- **Arte:** acabamento tridimensional/cartoon ilustrado rico, profundidade, luz e sombra, ambientação bíblica completa, cores vivas, anatomia natural dentro do estilo, expressões e poses variadas. **Proibido misturar os personagens do Ministério Infantil com os mascotes de Cantinho da Gi.** Nada de vetores genéricos, figuras geométricas, rostos clonados, personagens repetidos com outra roupa ou ícones sem função pedagógica.
- **Personagens do Ministério Infantil:** Lia (investigação), Maya (fé), Pipo (aventura) e Levi (música/louvor/adoração). Usar exclusivamente as identidades visuais já aprovadas quando houver imagens-fonte disponíveis; integrar à cena de forma natural. Não redesenhar nenhum dos quatro nem exibir seus nomes ou qualidades nas páginas. Levi foi aprovado em 25/10/2026 somente para materiais futuros; não modificar cadernos anteriores. Humanos bíblicos, animais e Jesus devem ser distintos, não cópias dos mascotes.
- **Atividade e arte inseparáveis:** a cena ilustrada deve permitir à criança executar o exercício, como ordenar cenas, identificar diferenças, completar ou investigar; não adicionar um quadro de perguntas genéricas sobre uma ilustração decorativa.
- **Faixa 5–6:** prioritariamente visual e lúdica, adequada a crianças que ainda não leem com autonomia; variar ligar, colorir, ordenar, observar, circular, traçar e completar cenas, sem repetir sempre as mesmas soluções.
- **Faixa 7–9:** elevar a complexidade com investigação bíblica, leitura guiada, sequência, interpretação, observação, decisões/consequências e aplicação prática; não reaproveitar sem mudanças as atividades de 5–6.
- **Qualidade editorial:** revisar português, acentuação, referência bíblica e resposta correta antes da aprovação. Não inventar palavras de personagens bíblicos nem confundir citações com interpretação.
- **Fluxo imutável:** recuperar a referência aprovada → planejar cada atividade → criar **uma página por vez, começando pela capa** → inspecionar e apresentar em tamanho legível → aguardar aprovação visual antes de avançar para a página seguinte → arquivar fontes aprovadas → reunir PDF A4 sem redesenhar → publicar no banco somente após verificação real.
- **Não regressão:** a aprovação de uma página torna o **arquivo original** a referência imutável. Correções limitadas ao ponto solicitado, sem redesenhar, trocar de personagem, cobrir textos improvisadamente ou substituir por versões menores.
- **Continuidade entre conversas:** antes de retomar uma aula, conferir os arquivos já aprovados, os registros `review/approved` do banco e os PDFs existentes. Não afirmar que nada foi produzido sem verificar Biblioteca, repositório e Storage; rascunho anterior não equivale a caderno final aprovado.

**Fila acordada:** finalizar `Adão e Eva — 7–9` e `Esaú e Jacó — 7–9`, nessa ordem, antes de `Jesus transforma água em vinho — 5–6`. Os dois primeiros temas não devem ser marcados como concluídos enquanto não houver páginas individuais aprovadas e PDF final efetivamente publicado.

## Regra de preservação das capas e inclusão de Levi — 26/10/2026

**Determinação do responsável:** nenhuma capa nem atividade de temas já concluídos ou aprovados deve ser recriada, substituída ou alterada somente para incluir Levi. Isso inclui, expressamente, **A Criação, Adão e Eva, Caim e Abel, Abraão, Esaú e Jacó e Noé e a Arca**, sempre preservando exatamente os originais de cada faixa etária, incluindo variações anteriormente aprovadas. Não realizar alterações retroativas nem fazer nova arte sem solicitação pontual.

**Exceção expressa: José do Egito.** O responsável autorizou **acrescentar Levi à capa original de José do Egito**, mantendo todos os outros personagens, texto, composição e arte já aprovados. Preservar a capa original como versão anterior e apresentar a variante com Levi para conferência **antes de qualquer substituição/publicação**. Essa autorização **não se estende às atividades** de José do Egito, que continuam preservadas.

**Capas de temas produzidos daqui em diante:** incluir Levi junto aos demais personagens **desde a criação da nova capa**, respeitando o arquivo de referência aprovado de cada um; variar expressões e poses de acordo com a identidade e o papel de Pipo, Lia, Maya e Levi. Nunca incluir nomes dos personagens na página impressa nem confundir o elenco com a loja Cantinho da Gi.

**José do Egito — materiais complementares aprovados (26/10/2026):** 16 quadros das três pranchas produzidas em conversa. Primeira prancha: quadros 1–6 aprovados. Segunda: quadros 1–6 aprovados. Terceira: quadros **2, 3, 5 e 6** aprovados; **quadros 1 e 4 (labirinto) rejeitados**. Os originais, recortes e ZIP estão arquivados em `/Ministerio Infantil/Estudos/Banco de Atividades/Jose do Egito/Aprovados/Complementares 16 atividades 26-10-2026/` na Biblioteca. Não redesenhar. Esses materiais estão preservados na Biblioteca; **não afirmar que foram publicados no aplicativo sem confirmar PDF e Storage**.

## Fechamento

A entrega só pode ser informada como **disponível no aplicativo** após constar arquivo real no bucket e link verificável pelo professor. Caso contrário, informar claramente **arquivado com segurança, pendente de publicação**.
