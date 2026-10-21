# Estudos — Padrão editorial V65 (aprovado em 21/10/2026)

## Interface aprovada
Prévia navegável com **Caderno da Criança**, **Aula do Professor** e **Gabarito**. Navegação página a página; impressão A4 separada para crianças e professores; no documento do professor imprime o gabarito ao final. Caderno de A Criação com aproximadamente 10 páginas e conteúdo adequado à idade; exercícios não devem ser variações meramente cosméticas.

## Regras de conteúdo
- Solicitar tema, passagem e idade. Preservar o texto escolhido e qualquer informação manual do professor.
- Usar referências reais. Não fabricar citações, cenas, falas nem detalhes bíblicos.
- Para temas do catálogo editorial curado, aproveitar os dados e gabaritos verificados. Para outros, usar investigação guiada do texto e pedir conferência: **não** fingir possuir conteúdo gerado por IA.
- Separar fatos da Bíblia e aplicações modernas; fidelidade às Escrituras.
- Uma dinâmica rápida (aproximadamente 2 minutos); uma missão prática para casa, sem tarefas diárias divididas por dias da semana.
- Impresso das crianças **nunca** contém gabarito. Professor e gabarito separados na visualização.
- Preservar dados, módulos, acessos, permissões e funcionalidades aprovadas; manter narração Daniel sem alterações.

## Direção de arte obrigatória
Lia, Pipo e Maya definem o **padrão artístico profissional**: profundidade, luz, cenários ricos, acabamento 3D, expressões genuínas, poses variadas. Não são matrizes de rostos para outros personagens. Humanos, crianças, adultos, anjos, Jesus, animais e personagens bíblicos devem ser visualmente originais e fiéis à passagem.

Os mascotes são opcionais conforme objetivo pedagógico. Investigação pode usar Lia; coragem pode usar Pipo; fé e gratidão podem usar Maya. Os três podem aparecer na mesma aula. Nenhum nome precisa constar na atividade.

**Não substituir ilustração 3D por desenho de formas geométricas, livro/caderno genérico ou imagem aleatória.** Uma ilustração não revisada deve permanecer ausente, não ser substituída por decoração sem nexo.

## Limites técnicos honestos desta versão
O site é estático. O gerador atual é editorial baseado em **regras e roteiros existentes**, não em um modelo generativo automático que ilustre todos os temas. O módulo `caderno-editorial-v65.js` prepara posições contextuais de ilustração a partir de `window.MI_EDITORIAL_IMAGES`, com caminhos estáticos sob `./assets/estudos/`. Imagens inexistentes **não** geram clones nem placeholders inadequados. Para adicionar novas ilustrações 3D profissionais em todas as aulas será necessária uma biblioteca validada por tema/atividade e/ou uma integração de geração de imagem em servidor autorizada e protegida, jamais chave de API exposta no JavaScript público.

## Proteção
Mudanças da V65 limitadas à pasta `estudos/` e metadados de versão. Não editar `index.html` principal, módulos EBD, crianças, equipe, acessos, Rede de Crianças, financeiro nem voz Daniel.