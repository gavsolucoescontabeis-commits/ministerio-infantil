# Lote de publicação — Estudos Ministério Infantil — 28/10/2026

## Objetivo
Consolidar **sem refazer nenhuma imagem** os materiais já produzidos/aprovados na Biblioteca para facilitar que o responsável os anexe no módulo Estudos do app, sem duplicar cadernos existentes.

## Pacote único para descompactar e selecionar PDFs
Biblioteca: `/Ministerio Infantil/Estudos/Pacotes de Publicacao/Lote_28OUT2026_Pendentes/LOTE_28OUT2026_7_PDFS_PARA_ANEXAR.zip`.
Acompanha `INDICE_PARA_ANEXACAO.csv`, `CATALOGO_PARA_CONFERENCIA.json` e `LEIA_ANTES_DE_ANEXAR.txt`. Os sete PDFs dentro são cópias byte a byte dos arquivos anteriores, sem modificações artísticas.

### Para anexar / conferir
| Tema | Público | PDFs | Páginas | Situação |
|---|---|---:|---:|---|
| Davi e Golias | 5–6 | 1 | 7 | Aprovado, não publicado |
| Moisés 7A – nascimento ao chamado | 5–6 | 2 | 7 + 8 | Dois cadernos aprovados, não publicados, **manter separados** |
| Moisés 7A – nascimento ao chamado | 7–9 | 1 | 7 | Aprovado, com **capa antiga preservada**, não publicado |
| Esaú e Jacó | 7–9 | 1 | 7 | PDF guardado na pasta Aprovados, mas status Supabase `review`; conferir antes de publicação |
| Jesus transforma água em vinho | 5–6 | 1 | 7 | PDF guardado na pasta Aprovados, mas status Supabase `review`; conferir antes de publicação |
| José do Egito | faixa a definir | 1 | 17 | Montagem anterior de 16 atividades aprovadas + capa; **quadros originais têm aprox. 512×512 px**, revisar impressão e faixa antes de publicar |

**Sete PDFs físicos;** há seis entradas de conteúdo na tabela, com Moisés 5–6 desdobrado em dois arquivos. Nenhuma versão foi colocada automaticamente no storage nesta operação.

### Já publicados e confirmados no Supabase Storage (não duplicar)
Foram conferidos 9 arquivos reais no bucket `mi-estudos-atividades` do projeto `jthxnjvqmvtydyfuqcct`:
- Criação 5–6
- Adão e Eva 5–6
- Caim e Abel 5–6
- Caim e Abel 7–9
- Noé e a Arca 5–6
- Noé e a Arca 7–9
- Abraão 5–6
- Abraão 7–9
- Esaú e Jacó 5–6

O acervo anterior da Biblioteca tem também `/Ministerio Infantil/Estudos/Pacotes de Publicacao/Ministerio_Infantil_9_Cadernos_Aprovados_Para_Publicar.zip`; **não reutilizá-lo como novo lote a enviar**, porque os nove PDFs acima já constam no Storage.

### Outras pendências
- Criação 7–9 consta como aprovada na tabela (`criacao-9`) mas o PDF original não foi encontrado na Biblioteca acessível e **não está entre os nove arquivos armazenados no Storage**; não inventar substituto.
- José do Egito: a coleção de 16 quadros aprovados está preservada separadamente na Biblioteca. A montagem PDF pré-existente de 17 páginas é uma conveniência de conferência, não deve ser considerada uma resolução A4 original. Não alongar ou redesenhar as miniaturas sem autorização.

## Baseline
Não modificar materiais, conteúdo, imagens nem desenhos já aprovados; mudanças apenas quando expressamente solicitadas. **Status de publicação só muda após upload real do PDF e validação do arquivo.**
