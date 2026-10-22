# A Criação — 5 e 6 anos (V76)

## Material aprovado em 22/10/2026
- **Arquivo PDF**: `A_Criacao_Caderno_5_a_6_anos_7_paginas.pdf`
- **SHA-256**: `cf493871c9d99e6b0f87042e06698ff39d2c7af08a3657dd2d8601cb7284e78a`
- **7 páginas**: capa original aprovada + atividades 2 a 7 (Luz e Escuridão, Céu e Águas, Plantas e Flores, Sol Lua e Estrelas, Aves e Peixes, Animais e Pessoas)
- **Faixa**: 5–6 anos (identificada em dados, não na capa)
- **Armazenamento**: original guardado na Biblioteca do projeto Ministério Infantil / Estudos / Banco de Atividades.

## Estado de publicação
Aprovado editorialmente, **ainda não publicado no GitHub Pages** porque o conector GitHub desta sessão não permite enviar os bytes do PDF gerado diretamente a partir do arquivo local. O registro `criacao-5-6` permanece `review` para impedir links quebrados. Não promova a `approved` até que o PDF possa ser aberto no endereço final e passe na conferência.

## Publicação pendente
1. Colocar o PDF binário aprovado, **sem redesenhá-lo**, em `estudos/pacotes/A_Criacao_Caderno_5_a_6_anos_7_paginas.pdf`.
2. Verificar HTTP 200, MIME `application/pdf`, SHA-256 e 7 páginas em URL pública.
3. Em `estudos/banco-atividades.json`, registro `criacao-5-6`, trocar `student` para `./pacotes/A_Criacao_Caderno_5_a_6_anos_7_paginas.pdf`, `status` para `approved` e `published` para `true`. Não alterar `criacao-9` ou `criacao-10-12`.
4. Sincronizar somente o registro `criacao-5-6` em `public.mi_study_activity_packages` no Supabase. Sua política de leitura devolve apenas `approved`.
5. Confirmar sugestões com aulas nomeadas `A Criação`: `5 a 6 anos` → `criacao-5-6`; `7 a 8 anos` e `9 anos` → `criacao-9`; `10 a 12 anos` → nenhum até aprovação.
6. Conferir o caderno completo e o link no celular; não adicionar guia do professor nem texto de nome dos mascotes às páginas.

**Nota:** A opção `4 a 6 anos` permanece por compatibilidade, mas não deve sugerir o caderno exclusivo de 5–6 sem o professor selecionar a faixa específica `5 a 6 anos`.
