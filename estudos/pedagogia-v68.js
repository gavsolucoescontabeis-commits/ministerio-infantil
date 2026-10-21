/* Estudos V68 — banco pedagógico bíblico, offline, sem assinatura, sem serviços pagos.
 * Cada item identifica um relato revisado. Não extrapolar versículos escolhidos pelo professor.
 * Nomes dos mascotes são internos e não fazem parte das perguntas ou exercícios.
 */
(()=>{'use strict';
const catalog={
 'criacao':{
  teaching:'Deus é o Criador, e a narrativa apresenta uma sequência intencional dos acontecimentos.',
  questions:[
   ['Qual a diferença entre o primeiro e o quarto dias?', 'No primeiro dia Deus fez surgir a luz; no quarto criou os luminares. Gênesis 1:3–5,14–19.'],
   ['O que a Bíblia diz que Deus criou no quinto dia?', 'Os seres das águas e as aves. Gênesis 1:20–23.'],
   ['Em qual dia Deus criou os seres humanos e como o texto os descreve?', 'No sexto dia; homem e mulher, à imagem de Deus. Gênesis 1:26–31.'],
   ['O que Deus fez no sétimo dia?', 'Concluiu Sua obra, descansou e abençoou o sétimo dia. Gênesis 2:1–3; mencionar quando a referência incluir o capítulo 2.']
  ],
  actions:[
   'Mostre dois cartões, “luz” e “sol”, e peça que a turma diga por que não representam o mesmo dia em Gênesis 1.',
   'Misture cartões com luz, plantas, aves e humanidade. Peça a uma dupla para organizar a sequência e explicar usando os versículos.',
   'Peça que as crianças defendam uma ordem da criação com base no texto, distinguindo o primeiro do quarto dia.'
  ]
 },
 'adao-eva-jardim':{
  teaching:'A vida é apresentada como dádiva de Deus; o homem recebe uma responsabilidade no jardim, e a mulher é criada por Deus.',
  questions:[
   ['De que maneira o texto descreve a formação do homem?', 'Do pó da terra, recebendo o fôlego de vida. Gênesis 2:7.'],
   ['Que trabalho Deus confiou ao homem no jardim?', 'Cultivar e guardar o jardim. Gênesis 2:15.'],
   ['O que Deus disse sobre o homem estar sozinho?', 'Disse que não era bom que o homem estivesse só. Gênesis 2:18.'],
   ['Como a narrativa descreve a formação da mulher?', 'Deus a fez de uma costela do homem e a trouxe a ele. Gênesis 2:21–22.']
  ],
  actions:[
   'Apresente três figuras simples: jardim, animais e pessoas. Peça às crianças que identifiquem algo que devemos cuidar com responsabilidade.',
   'Em grupos, entregue cartões “formar”, “cuidar” e “companheirismo”. Cada grupo localiza uma referência de Gênesis 2 correspondente.',
   'Compare o cuidado do jardim com uma responsabilidade atual e peça que identifiquem o que é fato bíblico e o que é aplicação moderna.'
  ]
 },
 'adao-eva-escolhas':{
  teaching:'A narrativa mostra desobediência, tentação, consequências e a responsabilidade humana pelas próprias escolhas.',
  questions:[
   ['O que a serpente questionou na conversa com a mulher?', 'A orientação de Deus a respeito da árvore. Gênesis 3:1–5.'],
   ['O que aconteceu depois que os dois comeram do fruto?', 'Perceberam que estavam nus, fizeram coberturas e se esconderam. Gênesis 3:7–8.'],
   ['Como responderam quando Deus perguntou o que aconteceu?', 'O homem e a mulher apresentaram justificativas, transferindo a responsabilidade. Gênesis 3:11–13.'],
   ['O texto diz que o fruto era uma maçã?', 'Não. O texto identifica apenas o fruto da árvore. Gênesis 3:1–6.']
  ],
  actions:[
   'Leia duas frases: “reconheci meu erro” e “coloquei a culpa em alguém”. A turma escolhe qual atitude demonstra responsabilidade.',
   'Apresente cartões “ordem”, “decisão”, “esconderijo” e “consequências”; crianças buscam a sequência em Gênesis 3.',
   'Faça um dilema curto sobre assumir um erro e compare as respostas com as decisões narradas em Gênesis 3, sem transformar o exemplo em fato bíblico.'
  ]
 },
 'davi-golias':{
  teaching:'Davi declarou confiança no Senhor diante de Golias; coragem não significa ausência de risco.',
  questions:[
   ['Por que Golias causava medo entre os israelitas?', 'Ele saía para desafiar o exército de Israel. 1 Samuel 17:4–11.'],
   ['O que Saul ofereceu a Davi e por que ele não utilizou?', 'Ofereceu sua armadura; Davi não estava acostumado com ela. 1 Samuel 17:38–39.'],
   ['Em quem Davi declarou confiar ao enfrentar Golias?', 'No nome do Senhor dos Exércitos. 1 Samuel 17:45–47.'],
   ['Que objeto Davi usou no confronto?', 'Uma funda e uma pedra. 1 Samuel 17:40,49.']
  ],
  actions:[
   'Mostre uma pedra lisa e pergunte: em quem Davi disse confiar? Deixe as crianças responderem com base na passagem.',
   'Distribua cartões “desafio”, “confiança” e “confronto”; os grupos ligam cada palavra a um versículo de 1 Samuel 17.',
   'Promova um dilema sobre defender alguém sem violência; separe a situação moderna do confronto histórico de Davi.'
  ]
 },
 'daniel-leoes':{
  teaching:'Daniel manteve sua fidelidade a Deus diante de pressão e foi livrado segundo a narrativa.',
  questions:[
   ['Por que os outros líderes tentaram encontrar uma acusação contra Daniel?', 'Porque queriam prejudicá-lo e não encontravam falta em seu trabalho. Daniel 6:4–5.'],
   ['O que Daniel continuou fazendo mesmo após conhecer a proibição?', 'Continuou orando a Deus. Daniel 6:10.'],
   ['O que Daniel disse sobre sua proteção na cova?', 'Que Deus enviou Seu anjo e fechou a boca dos leões. Daniel 6:22.'],
   ['Como o rei reagiu ao encontrar Daniel vivo?', 'Ficou muito alegre e mandou retirá-lo. Daniel 6:23.']
  ],
  actions:[
   'Apresente uma escolha: esconder a verdade ou manter uma atitude correta. Pergunte o que Daniel fez.',
   'Em duplas, procurem o versículo sobre a oração de Daniel e o versículo sobre o livramento. Comparem os fatos.',
   'Discuta o que significa agir com integridade sob pressão sem prometer que toda pessoa fiel terá o mesmo livramento de Daniel.'
  ]
 },
 'jonas':{
  teaching:'Deus chamou Jonas para ir a Nínive; Jonas fugiu e viveu consequências durante a viagem.',
  questions:[
   ['Para qual cidade Deus enviou Jonas?', 'Nínive. Jonas 1:1–2.'],
   ['Em qual direção Jonas tentou fugir?', 'Embarcou para Társis. Jonas 1:3.'],
   ['O que ocorreu com o navio durante a viagem?', 'Uma grande tempestade o ameaçou. Jonas 1:4.'],
   ['O que Deus preparou depois que Jonas foi lançado ao mar?', 'Um grande peixe. Jonas 1:17.']
  ],
  actions:[
   'Use cartões “Nínive” e “Társis” para comparar o chamado de Deus e a decisão de Jonas.',
   'Peça a três crianças que organizem “chamado”, “viagem” e “tempestade”, conferindo Jonas 1.',
   'Discuta a diferença entre a direção que Jonas recebeu e a que escolheu, usando apenas a passagem estudada.'
  ]
 },
 'jonas-oracao':{
  teaching:'Jonas dirigiu uma oração ao Senhor de dentro do peixe e reconheceu que a salvação pertence a Deus.',
  questions:[
   ['De onde Jonas orou?', 'De dentro do peixe. Jonas 2:1.'],
   ['A quem Jonas dirigiu sua oração?', 'Ao Senhor seu Deus. Jonas 2:1.'],
   ['De quem Jonas disse que vem a salvação?', 'Do Senhor. Jonas 2:9.']
  ],
  actions:[
   'Convide a turma a localizar na Bíblia a oração de Jonas antes de comentar sobre ela.',
   'Separe cartões “clamor”, “gratidão” e “salvação” e busque trechos de Jonas 2 correspondentes.',
   'Conversem sobre pedir ajuda a Deus numa dificuldade, distinguindo a história de Jonas da experiência atual.'
  ]
 },
 'jonas-ninive':{
  teaching:'Deus enviou Jonas novamente; os moradores de Nínive ouviram a mensagem e demonstraram arrependimento.',
  questions:[
   ['O que Deus pediu a Jonas pela segunda vez?', 'Que fosse a Nínive anunciar a mensagem. Jonas 3:1–2.'],
   ['Como os moradores reagiram ao anúncio?', 'Creram em Deus, proclamaram jejum e se humilharam. Jonas 3:5.'],
   ['O que o rei de Nínive determinou?', 'Jejum e mudança de conduta. Jonas 3:6–9.']
  ],
  actions:[
   'Compare dois cartões: “ouvir a orientação” e “praticar a orientação”. O que o povo de Nínive fez?',
   'Monte a ordem “mensagem, reação, mudança” com apoio de Jonas 3.',
   'Peça que a turma identifique sinais de arrependimento na passagem, sem confundir com pedidos de desculpa superficiais.'
  ]
 },
 'semeador':{
  teaching:'Jesus ensinou sobre diferentes respostas das pessoas à Palavra, usando a figura dos solos.',
  questions:[
   ['Em quais tipos de solo a semente caiu?', 'À beira do caminho, pedregoso, entre espinhos e boa terra. Mateus 13:3–8.'],
   ['O que aconteceu com a semente que caiu entre espinhos?', 'Os espinhos a sufocaram. Mateus 13:7.'],
   ['Como Jesus explicou a boa terra?', 'Quem ouve, compreende e frutifica. Mateus 13:23.']
  ],
  actions:[
   'Mostre quatro recipientes ou figuras de solo e peça que a turma identifique o destino da semente em cada um.',
   'Entregue quatro cartões com os solos; em duplas, liguem cada solo ao resultado narrado por Jesus.',
   'Compare ouvir uma orientação e colocá-la em prática, explicando como isso se relaciona com a parábola.'
  ]
 },
 'bom-samaritano':{
  teaching:'Jesus ensinou o amor prático ao próximo por meio da parábola.',
  questions:[
   ['Quem passou pelo homem ferido antes do samaritano?', 'Um sacerdote e um levita. Lucas 10:31–32.'],
   ['O que o samaritano fez ao vê-lo?', 'Teve compaixão e cuidou dele. Lucas 10:33–35.'],
   ['Que pergunta Jesus fez ao final?', 'Qual dos três se mostrou próximo do homem ferido. Lucas 10:36.']
  ],
  actions:[
   'Faça a turma escolher entre passar adiante ou pedir ajuda para alguém ferido, ressaltando segurança e apoio adulto.',
   'Distribua cartões “passou”, “viu”, “cuidou” e peça que relacionem às ações da parábola.',
   'Discuta por que Jesus destacou a ação do samaritano e como demonstrar cuidado sem se colocar em perigo.'
  ]
 },
 'filho-prodigo':{
  teaching:'A parábola mostra a decisão do filho de voltar e a acolhida compassiva do pai.',
  questions:[
   ['O que o filho mais novo pediu ao pai?', 'Sua parte da herança. Lucas 15:12.'],
   ['O que levou o filho a decidir voltar?', 'A necessidade e o reconhecimento de sua situação. Lucas 15:17–19.'],
   ['Como o pai o recebeu?', 'Correu, abraçou-o e o acolheu. Lucas 15:20–24.']
  ],
  actions:[
   'Compare duas palavras: “fugir” e “voltar”. Pergunte o que levou o filho a mudar sua decisão.',
   'Separe “saída”, “dificuldade” e “acolhimento” em cartões e organize a parábola.',
   'Converse sobre reconhecer erros e acolher alguém arrependido, sem tratar a parábola como notícia histórica.'
  ]
 },
 'noe':{
  teaching:'Noé recebeu instruções de Deus e obedeceu ao que lhe foi ordenado sobre a arca.',
  questions:[
   ['Quem deu as instruções para construir a arca?', 'O Senhor Deus. Gênesis 6:13–22.'],
   ['De que maneira Noé cumpriu as orientações?', 'Fez conforme Deus lhe havia ordenado. Gênesis 6:22.'],
   ['O texto apresenta medidas e orientações específicas?', 'Sim. Gênesis 6:14–16.']
  ],
  actions:[
   'Mostre instruções simples para construir algo de papel e converse sobre a importância de ouvir antes de agir.',
   'Peça aos alunos que encontrem no texto uma instrução específica que Deus deu a Noé.',
   'Debata como seguir uma orientação confiável se relaciona com a obediência descrita em Gênesis 6.'
  ]
 },
 'noe-diluvio':{
  teaching:'O dilúvio é descrito como juízo; a narrativa destaca a entrada na arca e a preservação da família de Noé.',
  questions:[
   ['Quem entrou na arca com Noé?', 'Sua esposa, filhos e noras, além dos animais conforme orientação recebida. Gênesis 7:7–9.'],
   ['Quem fechou a porta da arca?', 'O Senhor. Gênesis 7:16.'],
   ['O que aconteceu com a arca quando as águas subiram?', 'Ela flutuou. Gênesis 7:17.']
  ],
  actions:[
   'Peça que crianças apontem num desenho qual objeto flutua: uma pedra ou um barco. Relacione ao texto sem simular o dilúvio.',
   'Encontre Gênesis 7:16 e destaque quem fechou a porta da arca.',
   'Converse sobre responsabilidade e confiança enquanto aguardamos, separando o relato bíblico de uma experiência moderna.'
  ]
 },
 'cana':{
  teaching:'Jesus realizou em Caná um sinal que manifestou Sua glória, e Seus discípulos creram nele.',
  questions:[
   ['O que havia acabado durante o casamento?', 'O vinho. João 2:3.'],
   ['Qual foi a orientação de Jesus aos serventes?', 'Encher as talhas de água. João 2:7.'],
   ['O que João diz sobre esse sinal?', 'Jesus manifestou Sua glória, e Seus discípulos creram nele. João 2:11.']
  ],
  actions:[
   'Mostre recipientes vazios e lembre: o importante é o sinal realizado por Jesus, não a demonstração de um truque.',
   'Organize cartões “água nas talhas”, “sinal” e “discípulos creram”.',
   'Converse sobre a diferença entre uma experiência humana e o milagre relatado no Evangelho.'
  ]
 },
 'paralitico':{
  teaching:'Jesus mostrou Sua autoridade para perdoar pecados e curou o paralítico.',
  questions:[
   ['Por que o homem precisava de ajuda para chegar até Jesus?', 'Era paralítico e foi levado por outras pessoas. Marcos 2:3–4.'],
   ['O que Jesus disse antes da cura?', 'Declarou que os pecados do homem estavam perdoados. Marcos 2:5.'],
   ['Como o homem saiu diante das pessoas?', 'Levantou-se, tomou sua cama e saiu. Marcos 2:11–12.']
  ],
  actions:[
   'Converse sobre como ajudar um colega que precisa de apoio, lembrando o cuidado demonstrado pelos amigos.',
   'Localize no texto duas ações de Jesus: falar sobre perdão e ordenar que o homem se levantasse.',
   'Compare a ajuda dos amigos com a autoridade de Jesus, sem reduzir o relato apenas à amizade.'
  ]
 },
 'jesus-criancas':{
  teaching:'Jesus acolheu as crianças e mostrou a importância de recebê-las.',
  questions:[
   ['O que as pessoas queriam que Jesus fizesse pelas crianças?', 'Que as tocasse e abençoasse. Marcos 10:13–16.'],
   ['Como os discípulos reagiram inicialmente?', 'Repreenderam as pessoas que as traziam. Marcos 10:13.'],
   ['O que Jesus disse sobre as crianças?', 'Mandou deixá-las vir a Ele. Marcos 10:14.']
  ],
  actions:[
   'Pergunte: como demonstramos acolhimento a uma criança nova na turma?',
   'Compare cartões “afastar” e “acolher”; qual atitude Jesus demonstrou?',
   'Discussão orientada: por que ninguém deve ser impedido de ser tratado com carinho e respeito?'
  ]
 },
 'tempestade':{
  teaching:'Jesus mostrou autoridade sobre o vento e o mar, e os discípulos se admiraram.',
  questions:[
   ['O que aconteceu enquanto atravessavam o lago?', 'Uma tempestade atingiu o barco. Marcos 4:37.'],
   ['O que Jesus fez quando foi despertado?', 'Repreendeu o vento e o mar. Marcos 4:39.'],
   ['Qual foi a reação dos discípulos?', 'Ficaram muito atemorizados e se perguntaram quem Ele era. Marcos 4:41.']
  ],
  actions:[
   'Mostre som de vento ou movimentos suaves e peça que a turma identifique o problema enfrentado pelos discípulos.',
   'Organize os cartões “tempestade”, “Jesus falou” e “grande bonança”, conferindo Marcos 4.',
   'Debata a pergunta final dos discípulos sobre a identidade de Jesus e seu poder.'
  ]
 },
 'zaqueu':{
  teaching:'O encontro com Jesus levou Zaqueu a expressar uma mudança concreta de atitude.',
  questions:[
   ['Por que Zaqueu subiu numa árvore?', 'Porque era baixo e queria ver Jesus. Lucas 19:3–4.'],
   ['O que Jesus disse a Zaqueu?', 'Que descesse porque Jesus iria ficar em sua casa. Lucas 19:5.'],
   ['Que decisão Zaqueu anunciou?', 'Dar aos pobres e restituir o que havia tomado injustamente. Lucas 19:8.']
  ],
  actions:[
   'Pergunte o que fazemos quando queremos ouvir alguém importante; ligue ao desejo de Zaqueu de ver Jesus.',
   'Compare “curiosidade”, “encontro” e “mudança” na sequência de Lucas 19.',
   'Converse sobre a diferença entre prometer mudar e demonstrar mudança com atitudes.'
  ]
 },
 'nascimento':{
  teaching:'Jesus nasceu em Belém; anjos anunciaram aos pastores a chegada do Salvador.',
  questions:[
   ['Onde Jesus nasceu?', 'Em Belém. Lucas 2:4–7.'],
   ['Onde Maria colocou o menino após o nascimento?', 'Numa manjedoura. Lucas 2:7.'],
   ['A quem o anjo anunciou a boa notícia?', 'A pastores que estavam nos campos. Lucas 2:8–12.']
  ],
  actions:[
   'Mostre uma manjedoura e explique que é um cocho; pergunte onde Maria colocou o menino Jesus.',
   'Organize “viagem a Belém”, “nascimento” e “anúncio aos pastores”, verificando Lucas 2.',
   'Discuta por que o nascimento de Jesus foi anunciado como boa notícia de grande alegria.'
  ]
 },
 'lazaro':{
  teaching:'Jesus se compadeceu de quem sofria e mostrou autoridade sobre a morte ao chamar Lázaro.',
  questions:[
   ['Quem eram as irmãs de Lázaro?', 'Marta e Maria. João 11:1–2.'],
   ['O que o texto diz que Jesus fez quando viu a tristeza?', 'Jesus chorou. João 11:35.'],
   ['O que aconteceu quando Jesus chamou Lázaro?', 'Lázaro saiu do sepulcro. João 11:43–44.']
  ],
  actions:[
   'Converse sobre maneiras respeitosas de apoiar quem está triste, lembrando que Jesus chorou.',
   'Encontre na Bíblia o versículo curto “Jesus chorou” e o trecho em que Lázaro saiu.',
   'Diferencie o consolo humano do milagre que João 11 relata.'
  ]
 },
 'multiplicacao':{
  teaching:'Jesus alimentou uma grande multidão com cinco pães e dois peixes, segundo João 6.',
  questions:[
   ['O que o menino tinha consigo?', 'Cinco pães de cevada e dois peixes. João 6:9.'],
   ['O que Jesus fez antes de distribuir os pães?', 'Deu graças. João 6:11.'],
   ['Quantos cestos recolheram com os pedaços que sobraram?', 'Doze cestos. João 6:13.']
  ],
  actions:[
   'Mostre figuras de cinco pães e dois peixes para a turma contar os alimentos mencionados no relato.',
   'Em cartões, organize a sequência “alimentos”, “Jesus agradece”, “distribuição” e “sobras”.',
   'Converse sobre generosidade e partilha, sem confundir atitudes atuais com o milagre de Jesus.'
  ]
 },
 'ressurreicao':{
  teaching:'O relato do Evangelho anuncia que Jesus ressuscitou e foi visto vivo.',
  questions:[
   ['Quem foi ao sepulcro pela manhã?', 'As mulheres mencionadas no Evangelho estudado; confira a lista na passagem selecionada.'],
   ['O que encontraram no sepulcro?', 'O sepulcro vazio, conforme o Evangelho estudado.'],
   ['Qual é a notícia central anunciada?', 'Jesus ressuscitou. Confira a passagem principal.']
  ],
  actions:[
   'Leia a notícia central do texto e peça às crianças que expliquem com suas palavras o que foi anunciado.',
   'Encontre na passagem quem foi ao sepulcro e o que viu, sem misturar detalhes de Evangelhos diferentes.',
   'Compare cuidadosamente os detalhes registrados no Evangelho escolhido, mantendo a ressurreição como centro.'
  ]
 },
 'jesus-anda-aguas':{
  teaching:'Jesus caminhou sobre o mar; Pedro recebeu ajuda quando teve medo.',
  questions:[
   ['O que Jesus fez quando os discípulos estavam no barco?', 'Caminhou sobre as águas ao encontro deles. Mateus 14:25.'],
   ['O que Pedro pediu a Jesus?', 'Que o mandasse ir ao Seu encontro sobre as águas. Mateus 14:28.'],
   ['Como Jesus agiu quando Pedro começou a afundar?', 'Estendeu a mão e o segurou. Mateus 14:31.']
  ],
  actions:[
   'Apresente um desenho simples de barco e pergunte onde estavam os discípulos quando Jesus se aproximou.',
   'Organize os cartões “Jesus se aproxima”, “Pedro sai do barco” e “Jesus socorre Pedro”.',
   'Converse sobre pedir ajuda quando sentimos medo; o relato é um milagre, não uma atividade para imitar.'
  ]
 },
 'caim-abel':{
  teaching:'O relato trata de ciúme, advertência divina, violência e responsabilidade.',
  questions:[
   ['Que atividades Caim e Abel exerciam?', 'Caim cultivava a terra e Abel cuidava de rebanhos. Gênesis 4:2.'],
   ['O que Deus advertiu Caim sobre o pecado?', 'Que devia dominar o pecado que estava à porta. Gênesis 4:7.'],
   ['O que aconteceu com Abel?', 'Caim matou o irmão. Gênesis 4:8.']
  ],
  actions:[
   'Apresente opções para lidar com a raiva e destaque a necessidade de pedir ajuda e não machucar outras pessoas.',
   'Localize os versículos das ofertas, da advertência e da violência para acompanhar a sequência.',
   'Converse sobre ciúme e responsabilidade, respeitando a gravidade do fato relatado.'
  ]
 },
 'esau-jaco':{
  teaching:'As decisões entre Esaú e Jacó mostram consequências nos relacionamentos familiares.',
  questions:[
   ['O que Esaú vendeu a Jacó?', 'Seu direito de primogenitura. Gênesis 25:29–34.'],
   ['O que Esaú recebeu em troca?', 'Pão e cozido de lentilhas. Gênesis 25:34.'],
   ['Qual é a consequência principal da decisão narrada?', 'Esaú desprezou seu direito de primogenitura. Gênesis 25:34.']
  ],
  actions:[
   'Mostre duas escolhas: satisfação imediata e responsabilidade futura. Explique a troca descrita em Gênesis 25.',
   'Separe cartões com “fome”, “pedido”, “troca” e “consequência” conforme o relato.',
   'Converse sobre decidir sem pensar nas consequências, identificando o que é comparação moderna.'
  ]
 }
};
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const groups={little:0,early:1,middle:2,older:3,teen:4};
function create({title,reference,age}){
 const story=window.MI_LESSON_STORYTELLING?.storyFor(title,reference);
 const entry=story&&catalog[story.id];
 if(!entry)return null;
 const group=window.MI_LESSON_STORYTELLING?.ageGroup(age)||'middle',idx=groups[group]??2;
 const questions=entry.questions.slice(0,group==='little'?2:group==='early'?3:4);
 const action=entry.actions[Math.min(idx===4?2:Math.floor(idx/2),2)];
 const dynamic=idx<2?'Dinâmica rápida (cerca de 2 minutos): '+action:
  idx===2?'Desafio investigativo (cerca de 2 minutos): '+action:
  'Discussão orientada (cerca de 2 minutos): '+action;
 const inquiry='Perguntas para conversar:\n'+questions.slice(0,3).map(([q],i)=>(i+1)+'. '+q).join('\n');
 const secondQuestions=questions.length>2?questions.slice(-2):questions.slice(0,2);
 const inquiry2='Investigue e converse:\n'+secondQuestions.map(([q],i)=>(i+1)+'. '+q).join('\n')+'\n'+(secondQuestions.length+1)+'. Em qual trecho da passagem o ensino central pode ser observado?';
 const answerKey=questions.slice(0,3).map(([q,a],i)=>(i+1)+'. '+a).join('\n');
 const answerKey2=secondQuestions.map(([q,a],i)=>(i+1)+'. '+a).join('\n')+'\n'+(secondQuestions.length+1)+'. Compare a resposta com a passagem '+reference+'.';
 const objectives=[
  'Identificar os acontecimentos e reconhecer: '+entry.teaching,
  'Explicar com palavras simples a ideia principal da passagem: '+entry.teaching,
  'Investigar os fatos e relacionar o ensinamento à vida: '+entry.teaching,
  'Analisar a narrativa, suas decisões e consequências: '+entry.teaching,
  'Argumentar com base na passagem, distinguindo fatos e aplicações: '+entry.teaching
 ];
 return {storyId:story.id,teaching:entry.teaching,goal:objectives[idx],dynamic,activityAlternatives:[dynamic,'Desafio alternativo (cerca de 2 minutos): '+entry.actions[(Math.min(idx===4?2:Math.floor(idx/2),2)+1)%entry.actions.length]],questions:[inquiry,inquiry2],answerKey:[answerKey,answerKey2],curated:true};
}
window.MI_STUDY_PEDAGOGY=Object.freeze({create,subjectCount:Object.keys(catalog).length});
})();