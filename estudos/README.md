# Estudos • Ministério Infantil – 4ª IEQ Curitiba

## Situação
Módulo **integrado ao aplicativo oficial** pela aba **Estudos**, dentro do menu de usuários autenticados, sem substituir os módulos já aprovados. O mesmo módulo também está disponível em `/estudos/` para leitura em tela cheia. O acesso direto à página de Estudos não exige login; nela **não há dados de crianças ou de equipe**.

## Funcionalidades
- Bíblia **Livre (BLIVRE)** em português: tradução única da tela, carregada pela API GetBible v2 no módulo `livre`. Referência, livros, capítulos, versículos, copiar e utilizar na preparação de aula.
- Leitura em voz alta, iniciando no versículo selecionado, exclusivamente com a voz portuguesa **Daniel**, caso exista no navegador/dispositivo; sem substituição automática por outra voz.
- Devocionais diário, semanal e mensal, a partir de referências editoriais, com texto bíblico consultado da fonte licenciada.
- Busca por assunto e expressão equivalente em catálogo editorial de 78 temas, mais pesquisa por palavras no texto da Bíblia via serviço GetBible.
- Preparação de aulas com título, referência, faixa etária, objetivo, contexto, história, aplicação, perguntas, atividade e oração.
- **Sugerir Aula:** busca o texto da referência bíblica e apresenta **duas alternativas para cada um dos sete campos**. O professor pode escolher individualmente, confirmar substituições ou preencher apenas campos vazios. O texto inclui versículos reais como apoio, sem fabricar personagens ou acontecimentos.
- **Montar Aula e Visualizar (nova etapa final):** aparece após as sugestões e também junto aos botões de preparação; reúne as opções escolhidas e os textos escritos manualmente, salva no armazenamento local e abre a página **Aula Preparada**, organizada e sem campos de edição.
- **Imprimir / Salvar em PDF:** disponível somente depois de montar/visualizar a aula, com estilo A4 que imprime a página formatada — não o formulário. Depois de salva, a aula pode ser aberta em **Minhas Aulas > Visualizar Aula**; os botões de continuar, duplicar e excluir foram mantidos.
- **Voltar e Editar:** reabre o conteúdo salvo sem duplicar a aula, permitindo continuar a preparação. Salvar Rascunho permanece disponível sem obrigar a finalização.
- As sugestões automáticas são **editoriais e baseadas em regras e no texto bíblico**: **não há IA generativa integrada**. O botão opcional **Copiar Pedido para IA** prepara um pedido para ChatGPT, mas não faz chamadas externas automaticamente.
- Minhas Aulas: salvar, editar, duplicar, excluir, imprimir e exportar/importar backups JSON.

## Narração Bíblica por Faixa Etária
- A opção **Sugerir Aula** agora gera, para 21 histórias selecionadas e conferíveis, narrativas em linguagem adequada para **4–6, 7–8, 9, 10–12 anos e adolescentes**, além de idades personalizadas (campo **Outra Faixa Etária**).
- Dois formatos de História Bíblica Explicada: narrativa contínua e narrativa participativa, com pausas para perguntas. Os fatos seguem a referência da Bíblia e o professor escolhe a opção desejada.
- **Comparações atuais** (escola, família, amizades, uso responsável de mensagens e redes sociais etc.) são identificadas como exemplos do cotidiano, nunca parte da história bíblica. Também aparecem em Aplicação Prática.
- Objetivos, perguntas, atividades e oração variam com a faixa etária; as opções selecionadas são preservadas no documento **Aula Preparada**.
- Se o capítulo/intervalo escolhido ainda não possuir um roteiro revisado e correspondente, o sistema apresenta **Leitura Bíblica Guiada** com versículos da Bíblia Livre, identificada com clareza, em vez de inventar uma narrativa.
- Este módulo permanece **editorial e orientado por regras, sem IA generativa integrada**. A conferência e a decisão pedagógica final são do professor.
- Mudanças na faixa etária exigem gerar as sugestões novamente; o texto já aplicado não é apagado automaticamente.

## Dados e privacidade
- Os rascunhos de aula permanecem em **localStorage deste navegador**; não são sincronizados com Supabase. Em outro dispositivo, é necessário importar o arquivo de backup. Isso é informado diretamente na tela.
- O módulo não consulta nem transmite dados pessoais de crianças ou professores.
- A página de Estudos, acessada diretamente em `/estudos/`, é pública; a aba dentro do aplicativo é visível depois do login de usuários autorizados. Para restringir a URL direta, será necessário introduzir autenticação neste módulo.
- A API de tradução e a busca bíblica exigem internet; o acesso externo depende da disponibilidade do GetBible.
- Não colocar chaves privadas de IA em JavaScript público.

## Direitos e créditos
**Texto bíblico:** Bíblia Livre (BLIVRE), edição disponibilizada pelo GetBible (módulo `livre`, versão 1.0.1, 17/08/2017).

Autores identificados pelo projeto: Diego Renato dos Santos, Mario Sérgio de Souza Figueira e Marco Antonio Teles da Costa. A tradução tem licença **Creative Commons Atribuição 3.0 Brasil (CC BY 3.0 BR)**. Respeitar atribuição, link da licença, indicação da versão e eventuais alterações, conforme condições da licença.

- [Fonte dos textos](https://github.com/blivre/BibliaLivre)
- [Licença CC BY 3.0 Brasil](https://creativecommons.org/licenses/by/3.0/br/)
- [Catálogo da tradução no GetBible](https://api.getbible.net/v2/translations.json)

As passagens bíblicas nunca devem ser editadas automaticamente para “corrigir” grafia, letras maiúsculas ou conteúdo. Regras editoriais de títulos e sugestões não se aplicam ao texto sagrado originalmente publicado.

## Desenvolvimento
- `index.html` (raiz): apenas atalho para Estudos, cartão de navegação, seção com iframe e autorização de acesso à aba. Funcionalidades aprovadas da EBD, Rede de Crianças, cadastros, financeiro, relatórios e sessão não devem ser alteradas pelo módulo.
- `estudos/index.html`: interface.
- `estudos/estudos.js`: leitor, pesquisa, devocionais, planos de aula, sugestões e backup.
- `estudos/sugestoes-aula.js`: banco editorial e motor de duas opções por campo.
- `estudos/temas.js`: catálogo editorial de assuntos.
- `estudos/estudos.css`: estilos responsivos.
