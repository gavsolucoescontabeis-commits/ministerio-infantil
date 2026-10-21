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
- A opção **Sugerir Aula** agora gera, para 31 roteiros de histórias e capítulos selecionados e conferíveis, narrativas em linguagem adequada para **4–6, 7–8, 9, 10–12 anos e adolescentes**, além de idades personalizadas (campo **Outra Faixa Etária**).
- Dois formatos de História Bíblica Explicada: narrativa contínua e narrativa participativa, com pausas para perguntas. Os fatos seguem a referência da Bíblia e o professor escolhe a opção desejada.
- **Comparações atuais** (escola, família, amizades, uso responsável de mensagens e redes sociais etc.) são identificadas como exemplos do cotidiano, nunca parte da história bíblica. Também aparecem em Aplicação Prática.
- Objetivos, perguntas, atividades e oração variam com a faixa etária; as opções selecionadas são preservadas no documento **Aula Preparada**.
- Se o capítulo/intervalo escolhido ainda não possuir um roteiro revisado e correspondente, o sistema apresenta **Leitura Bíblica Guiada** com versículos da Bíblia Livre, identificada com clareza, em vez de inventar uma narrativa.
- Este módulo permanece **editorial e orientado por regras, sem IA generativa integrada**. A conferência e a decisão pedagógica final são do professor.
- Mudanças na faixa etária exigem gerar as sugestões novamente; o texto já aplicado não é apagado automaticamente.

## Perguntas com Gabarito e Atividades Ilustradas

- **Perguntas e Respostas:** o módulo de sugestões gera duas alternativas de perguntas, cada uma acompanhada do **gabarito do professor**. Os esclarecimentos vêm com capítulos e versículos para conferência na Bíblia Livre; quando o texto não possui roteiro narrativo revisado, a resposta apresenta o trecho bíblico original, sem improvisar fatos.
- **Escolhas vinculadas:** ao escolher uma alternativa de perguntas, a resposta correspondente vai para o campo editável **Gabarito do Professor**. Se houver conteúdo no campo, a substituição exige confirmação. O professor pode ajustar perguntas e gabarito antes de salvar.
- **Atividade da Criança:** documento separado para impressão em A4, com cabeçalho, nome e data, ilustração vetorial em preto e branco para colorir, perguntas adequadas à idade, linhas para escrever e espaço para desenhar. Existem temas ilustrados (semeador, Noé, Jonas, vinho em Caná, bom pastor, amor e outros) e desenho genérico da Bíblia para demais assuntos.
- **Exercícios temáticos:** assuntos conhecidos incluem perguntas para circular a resposta correta ou escrever explicações, com resposta orientadora no material do professor. As imagens são esquemáticas e não acrescentam detalhes bíblicos inventados.
- **Impressão separada:** botão **Imprimir Aula do Professor** mostra história, perguntas, respostas e orientações; **Imprimir Atividade das Crianças** imprime somente a ficha infantil, **sem o gabarito**.
- **Compatibilidade:** aulas antigas sem gabarito permanecem legíveis. Não se inventam respostas para perguntas escritas manualmente; nesse caso, cabe ao professor preencher e conferir o campo.
- Esta versão **não usa IA generativa** nem cria ilustrações fotorrealistas. Usa roteiros editoriais e figuras vetoriais próprias, otimizadas para impressão preto e branco.

## Atividades Criativas — Versão Colorida

- As fichas passaram a ter **identidade visual infantil colorida**, com cabeçalhos ilustrados, cartões de desafios, bordas suaves, ilustrações vetoriais e espaço ampliado para desenho. Não utiliza imagens de bancos de terceiros.
- **Exercícios variados:** perguntas de marcar, completar, ligar pares, colocar os acontecimentos em ordem, caça-palavras de 11×11 letras, labirintos solucionáveis para os pequenos, missão prática e desenho. Cada modelo é selecionado conforme a faixa etária e o assunto.
- **Exercícios por tema:** o módulo identifica 12 conjuntos editoriais (Semeador, Jonas 1/2/3, Bodas de Caná, Noé 6/7, Bom Samaritano, Davi e Golias, Zaqueu, Tempestade, Amor de Deus). Para outros assuntos, oferece atividades genéricas de investigação da passagem com palavras do tema, **sem atribuir fatos bíblicos inventados**.
- **Gabarito específico:** a Aula do Professor contém as respostas das alternativas, a ordem correta das cenas, os pares de associação, as palavras com suas coordenadas no caça-palavras, o caminho do labirinto e questões abertas claramente indicadas como pessoais.
- **Impressão:** seletor Colorida (padrão) / Econômica. A versão econômica elimina os preenchimentos coloridos, preservando contornos e espaços para responder. No navegador pode ser necessário ativar "gráficos de fundo" para reproduzir todas as cores no PDF.
- **Correção bíblica:** Davi e Golias agora é representado por uma funda e pedras, em vez de coroa. As ilustrações são simbólicas, voltadas ao ensino e à pintura.
- A rotina de áudio/voz **não foi alterada** nesta melhoria. Mantida a pendência da voz Daniel, conforme solicitado pelo usuário.

## Revista da Palavra — Novo Padrão de Qualidade

- **Caderno Bíblico próprio:** visual original com desenhos vetoriais temáticos (sementes, Jonas, Ester, convite para festa, samaritano, poço, Davi, arca e amor), sem copiar as páginas ou ilustrações de referência. Quando o assunto não possui figura contextualizada, o sistema usa a Bíblia aberta como ilustração neutra.
- **Primeira página — Atividade:** título, tema, faixa etária, nome e data, arte ilustrada colorida ou contorno para colorir na impressão econômica, exercícios e espaço de desenho. Os dados da aula permanecem iguais aos da preparação salva.
- **Segunda página opcional — Tempo com Deus:** sete pequenas propostas (domingo a sábado), referência da passagem, uma missão prática vinculada ao tema e espaço para anotar o versículo da semana. Os desafios variam entre pré-escola, crianças maiores e adolescentes; **não inventam versículos**.
- **Controle de impressão:** seleção Colorida / Econômica e marcação **Incluir Tempo com Deus (2ª página)**. O gabarito e as orientações continuam exclusivos da impressão do professor. A folha semanal é omitida quando o professor desmarcar a opção.
- **Atividades por idade mais distintas:** crianças pequenas recebem desenho, escolhas simples, completar palavras e labirintos; 7–8 anos recebem ligação e observação; 9 anos recebem sequência e caça-palavras; 10–12 anos recebem palavras embaralhadas; adolescentes recebem análise do que é fato do texto bíblico e do que é aplicação atual.
- **Compatibilidade:** mantidos os rascunhos locais, a importação/exportação JSON, os botões de impressão, o visualizador das aulas e as permissões existentes. **Não foi alterado o áudio ou a voz Daniel**.
- **Revisão antes de impressão:** confira a referência bíblica, a adequação à idade e a pré-visualização de impressão do navegador. A diagramação usa folhas A4 e evita a quebra dos cartões de atividades ao meio.

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
