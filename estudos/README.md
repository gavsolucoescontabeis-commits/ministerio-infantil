# Estudos • Ministério Infantil – 4ª IEQ Curitiba

## Objetivo
Módulo **experimental e independente**, publicado em \`/estudos/\`. Não altera \`index.html\` ou qualquer funcionalidade aprovada do aplicativo principal. Integração ao menu principal **somente após aprovação expressa** do responsável pelo projeto.

## O que já funciona
- Bíblia online em português: **Almeida 1911**, servida pela API GetBible v2 (v2/almeida/{livro}/{capitulo}.json), sem copiar o texto para o repositório.
- Leitura por livro, capítulo e versículo, seleção, referências rápidas, copiar versículos.
- Áudio local por Web Speech API (text-to-speech pt-BR, dependendo das vozes e permissões do aparelho).
- Devocional diário, semanal ou mensal (rodízio determinístico de temas e referências previamente curados; **o texto do versículo vem da fonte bíblica**, não é inventado).
- Criação de planos de aula: idade, texto, objetivo, contexto, narrativa, aplicação, perguntas, atividades e oração.
- **V2:** busca assistida por assunto com catálogo editorial de **70 temas**, incluindo histórias bíblicas e assuntos gerais. Ao reconhecer exatamente um tema, preenche a primeira referência sugerida; o professor pode escolher outra referência ou escrever a sua. Sem correspondência, **não inventa versículos** e orienta a consultar a Bíblia.
- **V2:** painel de navegação da Bíblia em uma faixa horizontal superior, sem diminuir o tamanho do texto bíblico. Símbolo reutilizado diretamente da imagem original do aplicativo principal, sem alterá-lo.
- Botão "Mestre Bíblica" copia um pedido estruturado para colar no ChatGPT; **não executa IA diretamente no aplicativo**.
- Salvar e editar aulas no **localStorage do navegador**, listar, duplicar, apagar, fazer backup JSON/importação e imprimir.

## Restrições intencionais do piloto
- Link isolado não exige login e **não contém dados pessoais** de crianças ou equipe.
- Preparações e backups são **locais**, não são compartilhados nem sincronizados com o banco Supabase. Abrir em outro computador não mostra os mesmos rascunhos.
- A API depende de conexão externa e de limites do provedor. Se ficar indisponível, a leitura é suspensa com mensagem de erro, sem mostrar texto bíblico inventado.
- Áudio é sintetizado pelo dispositivo, sem arquivos MP3 ou narração profissional gravada.
- Nada agenda automaticamente notificações ou novas aulas: os temas mudam quando o usuário abre o site.
- Antes de incluir traduções comerciais, áudios gravados ou copiar o texto para distribuição/offline, rever os respectivos direitos.

## Fonte, direitos e créditos
Texto bíblico proveniente do módulo \`almeida\` da API [GetBible](https://getbible.net/api/bible/v2/), descrito pelo catálogo como **Almeida 1911**, com licença de distribuição informada como **GPL**. O texto histórico de 1911 é considerado de domínio público, mas revisões modernas podem ter restrições distintas. Consulte o campo \`distribution_license\` do catálogo ao distribuir cópias do conteúdo. O protótipo não redistribui o conteúdo da API dentro do seu código.

## Planejamento posterior à aprovação
1. Configurar acesso com os perfis já existentes (professor, coordenador, escritório, administrador).
2. Persistir rascunhos em tabelas próprias do Supabase com RLS e controle de acesso por usuário/equipe.
3. Integrar ao menu oficial de forma isolada, sem interferir nas abas aprovadas.
4. Opcional: aprovação/publicação de aulas para a equipe, calendário EBD, controle de temas por sala/faixa etária.
5. Opcional: geração automática via serviço seguro no backend, **nunca** com chave de IA inserida no navegador.
6. Acessibilidade, leitura offline licenciada e funcionalidades adicionais após testes.

## Testes essenciais
- Abrir \`/estudos/\` no celular e computador.
- Consultar João 3:16, Marcos 10:14, Salmos 23 e 1 João 4:19.
- Ler um versículo e um capítulo inteiro em voz alta (verificar voz pt-BR instalada).
- Salvar aula, editar e salvar novamente; fechar/abrir mesma aba; exportar e importar o backup.
- Confirmar que nenhum item do aplicativo principal foi alterado.
