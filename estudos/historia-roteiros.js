/* Roteiros bíblicos revisáveis para Escola Bíblica.
 * Trechos narrativos são editoriais; a conferência final cabe ao professor.
 * Comparações modernas são apresentadas SEPARADAMENTE dos fatos bíblicos.
 * É proibido inventar falas, idades, personagens ou detalhes do relato.
 */
(()=>{'use strict';
const stories=[
{
 id:'semeador',titles:['semeador','parabola do semeador'],passages:['Mateus 13','Marcos 4','Lucas 8'],
 scenes:[
 [1,9,'Jesus contou uma parábola sobre um homem que saiu para semear. Algumas sementes caíram pelo caminho, outras em solo pedregoso, outras entre espinhos e outras em terra boa.','Enquanto ensinava, Jesus contou a história de um semeador. Ao espalhar as sementes, parte caiu à beira do caminho e foi comida pelas aves. Outra parte caiu em solo pedregoso, nasceu rapidamente, mas secou por não ter raízes suficientes. Outras sementes cresceram entre espinhos, que impediram o desenvolvimento das plantas. As que caíram em boa terra cresceram e deram fruto.'],
 [10,17,'Os discípulos perguntaram a Jesus sobre as parábolas. Jesus explicou por que ensinava dessa maneira.','Depois de contar a história, Jesus conversou com Seus discípulos sobre as parábolas. Ele mostrou que ouvir as palavras não é o mesmo que compreender e acolher o que Deus ensina.'],
 [18,23,'Jesus explicou: a semente representa a Palavra. Algumas pessoas não a entendem ou desistem, mas quem recebe a Palavra e a compreende pode produzir bons frutos.','Jesus explicou o significado dos solos. A semente é a Palavra anunciada. Algumas pessoas ouvem sem compreender; outras recebem com alegria, mas não perseveram diante das dificuldades; outras deixam as preocupações e o desejo de riquezas sufocarem a Palavra. A boa terra representa quem ouve, compreende e produz fruto.']
 ],
 analogy:{
 little:'Quando alguém planta um feijão no algodão e cuida dele, consegue observar o crescimento. Nossa atenção à Palavra também precisa de cuidado, escuta e prática. Isso é uma comparação de hoje, não um detalhe da parábola.',
 middle:'Pense em duas crianças ouvindo a mesma orientação sobre respeito. Uma esquece logo; a outra procura praticá-la na escola e em casa. Jesus nos convida a não apenas ouvir a Palavra, mas vivê-la.',
 older:'Assim como as notificações e preocupações podem disputar nossa atenção, outras prioridades podem impedir que uma mensagem importante produza resultado. Na parábola, Jesus chama os ouvintes a acolher a Palavra com perseverança.'
 }
},
{
 id:'caim-abel',titles:['caim','abel','caim e abel'],passages:['Gênesis 4'],
 scenes:[
 [1,5,'Caim e Abel eram irmãos. Caim trabalhava na terra; Abel cuidava de rebanhos. Os dois apresentaram ofertas ao Senhor, mas a Bíblia conta que Deus atentou para Abel e sua oferta, e não para Caim e sua oferta.','Adão e Eva tiveram dois filhos mencionados no começo deste relato: Caim e Abel. Abel cuidava de ovelhas; Caim cultivava a terra. Cada um trouxe uma oferta ao Senhor. O texto diz que o Senhor olhou com favor para Abel e sua oferta, mas não para Caim e sua oferta. Caim ficou muito irado e seu rosto mudou.'],
 [6,8,'Deus advertiu Caim sobre o pecado e a importância de dominá-lo. Mesmo assim, Caim matou seu irmão Abel.','O Senhor falou com Caim sobre sua ira e o perigo do pecado. Caim tinha uma escolha diante daquela advertência. O texto relata que ele não dominou sua ira e matou Abel quando estavam no campo. A Bíblia trata essa atitude como algo muito grave.'],
 [9,16,'Deus perguntou por Abel e confrontou Caim. Caim tentou fugir da responsabilidade. O Senhor anunciou as consequências e colocou um sinal para que ele não fosse morto.','Depois, Deus perguntou a Caim onde estava Abel. Caim respondeu de maneira evasiva. O Senhor revelou que sabia do que tinha acontecido e anunciou consequências para Caim. Mesmo diante do julgamento, o texto relata que Deus colocou um sinal para impedir que Caim fosse morto.']
 ],
 analogy:{
 little:'Quando ficamos bravos porque alguém recebeu atenção, podemos pedir ajuda a um adulto e conversar. Machucar alguém nunca é uma maneira certa de resolver a raiva.',
 middle:'É como quando um colega recebe um elogio e sentimos inveja. Antes de agir, podemos reconhecer o sentimento, conversar e escolher fazer o que é correto.',
 older:'Ciúme e comparação podem crescer quando alimentados em silêncio. Numa situação de conflito com irmãos ou colegas, responsabilidade e autocontrole precisam vir antes de qualquer reação.'
 }
},
{
 id:'esau-jaco',titles:['esau','jaco','esau e jaco'],passages:['Gênesis 25','Gênesis 27','Gênesis 33'],
 scenes:[
 [19,26,'Isaque e Rebeca tiveram filhos gêmeos chamados Esaú e Jacó. Esaú nasceu primeiro; Jacó nasceu depois.','Isaque e Rebeca tiveram gêmeos, Esaú e Jacó. A Bíblia conta que Esaú nasceu primeiro e que Jacó nasceu segurando o calcanhar do irmão.'],
 [27,34,'Um dia, Esaú voltou cansado do campo e pediu comida. Jacó pediu em troca o direito de primogenitura. Esaú concordou e vendeu esse direito.','Esaú gostava da vida no campo; Jacó era descrito como alguém que vivia nas tendas. Quando Esaú voltou com fome, Jacó tinha preparado um ensopado. Jacó pediu o direito de primogenitura em troca daquela comida. Esaú concordou, e a passagem mostra como aquela decisão teve grande importância.']
 ],
 analogy:{little:'Às vezes queremos tanto uma coisa naquele momento que esquecemos de pensar nas consequências. Podemos aprender a esperar e pedir orientação.',middle:'Uma decisão rápida, como trocar algo muito importante por uma vontade passageira, pode trazer consequências. Vale pensar antes de escolher.',older:'A fome imediata de Esaú ajuda a conversar sobre impulsividade: por que uma satisfação rápida pode nos levar a desprezar algo de grande valor?'}
},
{
 id:'videira',titles:['videira','videira verdadeira'],passages:['João 15'],
 scenes:[
 [1,5,'Jesus disse que Ele é a videira verdadeira e que Seus seguidores são como os ramos. Assim como os ramos dependem da planta, nós dependemos de Jesus.','Jesus usou a imagem de uma videira para ensinar. Ele Se apresentou como a videira verdadeira, falou do cuidado do Pai e comparou os discípulos aos ramos. Um ramo não produz fruto separado da planta. Da mesma forma, Jesus ensinou a importância de permanecer nele.'],
 [6,11,'Jesus falou sobre permanecer em Seu amor e guardar Seus mandamentos. Esse ensino está ligado à alegria de viver com Ele.','Jesus explicou que permanecer nele envolve guardar Sua palavra e viver em Seu amor. Ele também falou de uma alegria completa. A passagem não trata apenas de fazer coisas boas por esforço próprio, mas de permanecer ligado a Cristo.'],
 [12,17,'Jesus ensinou Seus discípulos a amarem uns aos outros.','O mandamento de amar uns aos outros aparece no centro desse ensino. Jesus apresentou Seu amor como exemplo para o relacionamento dos discípulos.']
 ],
 analogy:{little:'Um galhinho separado de uma planta não continua crescendo como antes. Jesus usou essa imagem para nos ensinar a permanecer nele.',middle:'Uma planta precisa de água, luz e cuidados. A imagem da videira nos ajuda a conversar sobre como a oração e a Palavra fortalecem nossa caminhada com Jesus.',older:'Quando alguém se preocupa apenas em parecer bom por fora, pode esquecer a relação que sustenta suas escolhas. A videira ensina sobre permanecer em Cristo, e não apenas sobre aparentar bons frutos.'}
},
{
 id:'cana',titles:['vinho','cana','bodas','agua em vinho','transforma agua em vinho'],passages:['João 2'],
 scenes:[
 [1,5,'Jesus estava em um casamento em Caná, com Sua mãe e Seus discípulos. Quando o vinho acabou, Sua mãe apresentou a situação a Jesus e orientou os serventes a fazerem o que Ele dissesse.','Em Caná da Galileia acontecia uma festa de casamento. Jesus, Sua mãe e Seus discípulos estavam presentes. Durante a festa, o vinho acabou. Maria contou a situação a Jesus e disse aos serventes que obedecessem às orientações dele.'],
 [6,10,'Jesus mandou encher de água seis recipientes de pedra. Depois, os serventes levaram um pouco ao responsável pela festa, e a água havia se tornado vinho.','Havia ali seis talhas de pedra usadas para a purificação. Jesus orientou os serventes a enchê-las de água, e eles as encheram. Depois mandou que levassem um pouco ao responsável pela festa. Ao provar, o responsável constatou que era vinho e comentou sobre sua qualidade.'],
 [11,12,'Esse foi o primeiro sinal realizado por Jesus em Caná. O Evangelho relata que Ele manifestou Sua glória e que Seus discípulos creram nele.','João apresenta esse acontecimento como o início dos sinais de Jesus em Caná da Galileia. Por meio dele, Jesus manifestou Sua glória, e Seus discípulos creram nele. O objetivo da história é mostrar quem Jesus é, não ensinar sobre bebidas.']
 ],
 analogy:{little:'Quando algo parece difícil de resolver, podemos lembrar que Jesus tem poder e podemos confiar nele. A festa de Caná é uma história real do Evangelho, não uma história que aconteceu hoje.',middle:'Em situações inesperadas, às vezes não sabemos como agir. A passagem mostra serventes obedecendo às orientações de Jesus e discípulos aprendendo a confiar nele.',older:'O foco do relato está na manifestação da glória de Jesus. Podemos comparar com a tendência atual de buscar apenas resultados, lembrando que o sinal aponta para a identidade de Cristo.'}
},
{
 id:'paralitico',titles:['paralitico','paralisado','cura do paralitico'],passages:['Marcos 2','Mateus 9','Lucas 5'],
 scenes:[
 [1,5,'Um homem que não conseguia andar foi levado até Jesus. Jesus viu a fé demonstrada e disse ao homem que seus pecados estavam perdoados.','Pessoas levaram até Jesus um homem paralítico, que precisava de ajuda para se locomover. Em Marcos e Lucas, o texto conta que, por causa da multidão, os homens conseguiram aproximá-lo de Jesus por uma abertura no telhado. Jesus viu a fé demonstrada e começou dizendo ao homem que seus pecados estavam perdoados.'],
 [6,10,'Alguns mestres da Lei questionaram como Jesus poderia perdoar pecados. Jesus respondeu mostrando Sua autoridade.','Alguns escribas ou mestres da Lei, que acompanhavam a situação, questionaram as palavras de Jesus. Ele respondeu às dúvidas deles e ensinou sobre a autoridade do Filho do Homem para perdoar pecados.'],
 [11,12,'Jesus ordenou ao homem que se levantasse. O homem se levantou e foi embora, e as pessoas ficaram admiradas e glorificaram a Deus.','Então Jesus mandou que o homem se levantasse, pegasse sua cama e fosse para casa. O paralítico se levantou, demonstrando diante de todos a cura realizada. Os que viram ficaram admirados e glorificaram a Deus.']
 ],
 analogy:{little:'Os amigos ajudaram alguém que precisava de apoio. Também podemos incluir quem tem dificuldade de participar de uma brincadeira ou atividade.',middle:'Pense num colega que não consegue alcançar algo sem ajuda. A amizade pode abrir caminhos, mas a Bíblia mostra que quem realizou a cura foi Jesus.',older:'A atitude dos amigos é um exemplo de cuidado e perseverança. O relato também convida a refletir que Jesus tratou do perdão dos pecados antes de realizar a cura física.'}
},
{
 id:'bom-samaritano',titles:['bom samaritano','samaritano'],passages:['Lucas 10'],
 scenes:[
 [25,29,'Um especialista na Lei perguntou a Jesus sobre amar o próximo e quis saber quem era seu próximo. Jesus respondeu contando uma parábola.','Jesus conversava com um especialista na Lei que lhe perguntou sobre a vida eterna. Depois de falarem sobre amar a Deus e ao próximo, o homem perguntou quem seria seu próximo. Jesus então contou uma parábola para responder.'],
 [30,32,'Um homem foi atacado numa estrada e deixado ferido. Um sacerdote passou e não o ajudou; um levita também passou adiante.','Na história contada por Jesus, um homem viajava de Jerusalém para Jericó quando foi atacado por ladrões. Eles o feriram e o deixaram pelo caminho. Um sacerdote passou, viu o homem e seguiu adiante. Depois, um levita também passou sem prestar ajuda.'],
 [33,35,'Um samaritano viu o homem e sentiu compaixão. Cuidou dos ferimentos, levou-o a uma hospedaria e providenciou que fosse cuidado.','Depois passou um samaritano. Diferentemente dos outros, ele se compadeceu do ferido, cuidou de suas feridas e o colocou em seu animal. Levou-o a uma hospedaria, cuidou dele e deixou recursos para que o cuidado continuasse.'],
 [36,37,'Jesus perguntou quem havia agido como próximo. A resposta foi: aquele que teve misericórdia. Jesus ensinou que devemos agir da mesma maneira.','Ao terminar a parábola, Jesus perguntou qual dos três havia sido próximo do homem ferido. A resposta foi aquele que demonstrou misericórdia. Jesus orientou seu interlocutor a agir assim também.']
 ],
 analogy:{little:'Quando um colega cai no recreio, podemos chamar um adulto e oferecer ajuda com carinho, sem deixar a pessoa sozinha.',middle:'Se alguém novo na escola fica sozinho, podemos acolhê-lo, convidar para participar e tratar com respeito mesmo que seja diferente de nós.',older:'Ao ver alguém sofrendo exclusão ou humilhação, é fácil passar adiante. A parábola nos chama a transformar compaixão em ações concretas, com segurança e responsabilidade.'}
},
{
 id:'filho-prodigo',titles:['filho prodigo','filho que voltou'],passages:['Lucas 15'],
 scenes:[
 [11,16,'Jesus contou a história de um pai que tinha dois filhos. O mais novo pediu sua parte dos bens, foi embora e gastou tudo. Depois, enfrentou uma grande necessidade.','Na parábola de Jesus, o filho mais novo pediu ao pai a parte dos bens que lhe cabia. Depois partiu para uma terra distante e desperdiçou seus recursos. Quando veio uma grande fome, ele ficou em necessidade e passou a trabalhar cuidando de porcos.'],
 [17,20,'O rapaz reconheceu que havia errado e decidiu voltar ao pai. Quando ainda estava longe, o pai o viu, correu ao seu encontro e o abraçou.','O filho pensou na situação em que se encontrava e decidiu voltar, reconhecendo seu erro. Planejava dizer ao pai que já não era digno de ser chamado filho. Mas o pai o avistou quando ele ainda estava longe, correu, abraçou-o e o recebeu.'],
 [21,24,'O pai recebeu o filho com alegria e mandou preparar uma festa, porque seu filho havia voltado.','O rapaz começou a confessar o que havia feito. O pai ordenou que lhe trouxessem roupas e outros sinais de acolhimento, e preparou uma celebração. Ele disse que seu filho estava perdido e havia sido encontrado.'],
 [25,32,'O filho mais velho ficou ressentido. O pai explicou que a volta do irmão era motivo de alegria.','Enquanto isso, o filho mais velho, que estava trabalhando, ouviu sobre a festa e ficou irritado. O pai saiu para conversar com ele, lembrando que tudo o que era seu continuava à disposição do filho mais velho, mas que era preciso alegrar-se porque o irmão havia voltado.']
 ],
 analogy:{little:'Quando erramos e pedimos perdão, podemos aprender a reconhecer o erro e reparar o que for possível, em vez de escondê-lo.',middle:'Às vezes é difícil ver outra pessoa sendo acolhida depois de errar. A parábola também ensina a não guardar ressentimento como o irmão mais velho.',older:'A história permite conversar sobre autonomia, consequências, arrependimento e acolhimento, sem confundir perdão com a ausência de responsabilidade.'}
},
{
 id:'davi-golias',titles:['davi e golias','golias'],passages:['1 Samuel 17'],
 scenes:[
 [1,25,'Os filisteus e os israelitas estavam preparados para uma batalha. Um guerreiro chamado Golias desafiava o povo de Israel.','O exército de Israel enfrentava os filisteus. Golias, um guerreiro filisteu, saía para desafiar os israelitas. A situação causava medo entre aqueles que ouviam suas palavras.'],
 [26,40,'Davi foi até o acampamento levando alimentos para seus irmãos. Ele decidiu enfrentar Golias e explicou que confiava no Senhor.','Davi chegou ao acampamento para levar provisões a seus irmãos. Ao ouvir o desafio de Golias, mostrou indignação. Davi contou ao rei Saul como Deus o havia ajudado quando cuidava do rebanho e afirmou sua confiança no Senhor. Ele não usou a armadura oferecida por Saul; tomou seu cajado, pedras lisas e uma funda.'],
 [41,51,'Davi enfrentou Golias declarando sua confiança no Senhor. Com uma pedra lançada pela funda, atingiu Golias, que caiu.','Golias aproximou-se de Davi e o desprezou. Davi respondeu que sua confiança não estava numa espada ou lança, mas no nome do Senhor. Davi correu ao encontro do filisteu, lançou uma pedra com a funda e o atingiu na testa. Golias caiu. O texto relata depois a morte do guerreiro.'],
 [52,58,'A vitória mudou o rumo da batalha. O povo de Israel avançou, e Davi foi reconhecido por sua ação.','Depois da derrota de Golias, os filisteus fugiram e os israelitas os perseguiram. O episódio destaca a confiança que Davi declarou ter em Deus, sem apresentar a coragem como ausência de perigo.']
 ],
 analogy:{little:'Quando algo parece difícil, podemos pedir ajuda a Deus e a pessoas de confiança. Coragem não significa precisar enfrentar os problemas sozinho.',middle:'Apresentar um trabalho, pedir desculpas ou defender alguém pode dar medo. Podemos agir corretamente mesmo sentindo medo.',older:'A coragem de Davi não veio de se julgar invencível. Vale conversar sobre confiança em Deus, responsabilidade e preparação ao enfrentar desafios reais.'}
},
{
 id:'jonas',titles:['jonas','jonas e o peixe'],passages:['Jonas 1','Jonas 2','Jonas 3'],
 scenes:[
 [1,3,'Deus mandou Jonas ir a Nínive anunciar Sua mensagem. Jonas, porém, embarcou em um navio para fugir.','O Senhor chamou Jonas para anunciar uma mensagem à cidade de Nínive. Mas Jonas decidiu seguir na direção contrária e embarcou num navio que iria para Társis.'],
 [4,12,'O Senhor enviou uma grande tempestade. Os marinheiros ficaram com medo. Jonas reconheceu sua responsabilidade pela situação.','Uma tempestade muito forte atingiu o navio. Os marinheiros temeram pela própria vida e procuraram entender o que acontecia. Jonas explicou que fugia do Senhor e disse que o lançassem ao mar para que as águas se acalmassem.'],
 [13,17,'Os marinheiros tentaram remar, mas acabaram lançando Jonas ao mar. A tempestade parou, e o Senhor providenciou um grande peixe que engoliu Jonas.','Depois de tentarem voltar à terra sem sucesso, os marinheiros lançaram Jonas ao mar. A tempestade cessou. O Senhor providenciou um grande peixe, e Jonas ficou no ventre dele durante três dias e três noites.']
 ],
 analogy:{little:'Se um adulto responsável pede algo importante, fugir e esconder não resolve a situação. Podemos conversar e pedir ajuda para obedecer.',middle:'Às vezes adiamos uma tarefa porque ela parece difícil. A história nos lembra que fugir das responsabilidades não resolve o problema.',older:'A narrativa oferece um ponto de partida para conversar sobre medo, resistência em obedecer e misericórdia de Deus, sempre distinguindo aplicação atual do relato bíblico.'}
},
{
 id:'jesus-criancas',titles:['jesus e as criancas','jesus abencoa as criancas'],passages:['Marcos 10','Mateus 19','Lucas 18'],
 scenes:[
 [13,14,'Algumas pessoas levaram crianças a Jesus para que Ele as abençoasse. Os discípulos tentaram impedir, mas Jesus disse que deixassem as crianças se aproximar dele.','Pessoas traziam crianças até Jesus para que Ele as tocasse e abençoasse. Os discípulos repreenderam quem as trazia. Jesus não concordou com a atitude deles e ensinou que as crianças deveriam ser acolhidas.'],
 [15,16,'Jesus ensinou sobre receber o Reino de Deus e acolheu as crianças. Ele as tomou nos braços e as abençoou.','Jesus falou sobre receber o Reino de Deus como uma criança. Depois, conforme o relato de Marcos, tomou as crianças nos braços, impôs as mãos sobre elas e as abençoou.']
 ],
 analogy:{little:'Você é importante e merece ser tratado com cuidado e respeito. Jesus mostrou que as crianças não devem ser afastadas dele.',middle:'Se uma criança nova chega à turma, podemos recebê-la e ajudá-la a se sentir parte do grupo, lembrando do acolhimento de Jesus.',older:'A passagem convida a discutir acolhimento, respeito e valor das crianças, especialmente quando os adultos não dão atenção à voz delas.'}
},
{
 id:'noe',titles:['noe','arca de noe'],passages:['Gênesis 6','Gênesis 7','Gênesis 8'],
 scenes:[
 [9,13,'Noé procurava andar com Deus num tempo de muita maldade. O Senhor contou a Noé o que faria diante daquela situação.','Gênesis apresenta Noé como um homem que andava com Deus, enquanto a terra estava cheia de violência e corrupção. O Senhor revelou a Noé que viria um julgamento sobre a terra.'],
 [14,22,'Deus deu instruções para construir uma arca. Noé obedeceu às orientações que recebeu.','Deus deu a Noé medidas e instruções sobre a arca e sobre os que deveriam entrar nela. O relato diz que Noé fez tudo conforme Deus lhe ordenara.']
 ],
 analogy:{little:'Montar um brinquedo seguindo orientações é diferente de fazer de qualquer jeito. Noé obedeceu a instruções muito importantes que recebeu de Deus.',middle:'Quando uma tarefa é longa, é preciso cuidado e perseverança. O relato enfatiza que Noé cumpriu o que Deus lhe ordenou.',older:'A obediência de Noé aconteceu num contexto de violência e corrupção. Isso permite pensar sobre viver de forma correta quando muita gente escolhe outro caminho.'}
},
{
 id:'tempestade',titles:['acalma a tempestade','tempestade','jesus acalma'],passages:['Marcos 4','Mateus 8','Lucas 8'],
 scenes:[
 [35,37,'Jesus e Seus discípulos atravessavam o lago num barco. Uma tempestade se levantou e o barco começou a encher de água.','Ao atravessar o lago com os discípulos, Jesus estava num barco quando uma grande tempestade se levantou. As ondas batiam contra a embarcação, e os discípulos ficaram em perigo.'],
 [38,39,'Jesus estava dormindo. Os discípulos o acordaram. Jesus repreendeu o vento e disse ao mar que se acalmasse; tudo ficou tranquilo.','No relato de Marcos, Jesus dormia na parte de trás do barco. Os discípulos o acordaram, preocupados com a situação. Jesus repreendeu o vento e falou ao mar para se aquietar. O vento cessou e houve grande calmaria.'],
 [40,41,'Jesus perguntou aos discípulos por que estavam com tanto medo e falou sobre a fé. Eles ficaram admirados com Sua autoridade.','Depois de acalmar a tempestade, Jesus questionou os discípulos sobre o medo e a fé. Eles ficaram profundamente admirados e perguntaram quem era aquele a quem até o vento e o mar obedeciam.']
 ],
 analogy:{little:'Quando sentimos medo de trovão ou de uma situação difícil, podemos conversar com um adulto e orar a Jesus. O texto mostra o poder de Jesus sobre a tempestade.',middle:'Há momentos em que uma notícia ou problema parece uma tempestade na nossa cabeça. Podemos buscar ajuda, orar e lembrar de quem Jesus é.',older:'Diante de ansiedade ou circunstâncias fora de controle, a passagem convida a pensar na identidade e na autoridade de Jesus, sem prometer ausência de dificuldades.'}
},
{
 id:'zaqueu',titles:['zaqueu'],passages:['Lucas 19'],
 scenes:[
 [1,4,'Zaqueu queria ver Jesus, mas era de baixa estatura e havia muita gente. Por isso, subiu numa árvore para enxergar melhor.','Em Jericó vivia Zaqueu, um homem rico que trabalhava como chefe dos cobradores de impostos. Ele queria ver quem era Jesus, mas a multidão dificultava sua visão. Por ser de baixa estatura, correu adiante e subiu numa árvore.'],
 [5,7,'Jesus viu Zaqueu, chamou-o pelo nome e disse que ficaria em sua casa. Zaqueu o recebeu com alegria.','Quando Jesus chegou àquele lugar, olhou para cima e chamou Zaqueu pelo nome, dizendo que precisava ficar em sua casa. Zaqueu desceu depressa e o recebeu com alegria. Algumas pessoas criticaram a decisão de Jesus.'],
 [8,10,'Zaqueu falou sobre repartir seus bens com os pobres e devolver o que tivesse cobrado injustamente. Jesus falou sobre salvação.','Zaqueu declarou que daria metade de seus bens aos pobres e restituiria o que tivesse tomado injustamente. Jesus anunciou que a salvação havia chegado àquela casa e disse que o Filho do Homem veio buscar e salvar o perdido.']
 ],
 analogy:{little:'Jesus conheceu Zaqueu e o tratou com atenção. Podemos aprender a acolher pessoas que muitos deixam de lado.',middle:'Se alguém fez algo errado, admitir e reparar quando possível é melhor do que esconder. Zaqueu mostrou disposição de mudar suas atitudes.',older:'A decisão de Zaqueu permite conversar sobre integridade: mudança verdadeira pode aparecer em decisões concretas sobre dinheiro e justiça.'}
},
{
 id:'daniel-leoes',titles:['daniel na cova','daniel e os leoes','cova dos leoes'],passages:['Daniel 6'],
 scenes:[
 [1,10,'Daniel servia com responsabilidade e orava a Deus. Alguns homens tentaram prejudicá-lo e fizeram o rei assinar uma proibição de orar a qualquer outro além do rei durante um período.','Daniel desempenhava um papel importante no governo do rei Dario. Outros líderes, sem encontrar falta em seu trabalho, tentaram criar um motivo para acusá-lo por causa de sua fidelidade a Deus. Conseguiram que o rei estabelecesse uma ordem proibindo pedidos a outros durante trinta dias. Daniel continuou orando a Deus.'],
 [11,17,'Daniel foi acusado e lançado na cova dos leões. O rei ficou preocupado e mandou fechar a entrada.','Os acusadores encontraram Daniel orando e o denunciaram. O rei ficou entristecido, mas acabou ordenando que Daniel fosse lançado na cova dos leões, conforme a regra que havia assinado.'],
 [18,23,'Na manhã seguinte, o rei encontrou Daniel vivo. Daniel declarou que Deus havia enviado Seu anjo e fechado a boca dos leões.','O rei passou a noite preocupado. Bem cedo, foi à cova e chamou Daniel. Daniel respondeu que Deus enviara Seu anjo e fechara a boca dos leões, impedindo que o ferissem. O rei ordenou que Daniel fosse retirado, e o relato informa que ele estava ileso.'],
 [24,28,'Depois desses acontecimentos, o rei reconheceu publicamente o poder do Deus de Daniel.','O rei publicou uma declaração sobre o Deus vivo, cujo reino não será destruído. A história destaca a fidelidade de Daniel e o livramento que o Senhor concedeu, sem ensinar que toda pessoa fiel será sempre poupada de sofrimento.']
 ],
 analogy:{little:'Quando somos pressionados a fazer algo errado, podemos buscar ajuda e continuar fazendo o que é certo.',middle:'Se colegas zombarem porque você quer fazer o que é correto, lembre que Daniel permaneceu fiel a Deus mesmo sob pressão.',older:'A fidelidade de Daniel ajuda a conversar sobre integridade sob pressão, inclusive quando obedecer a Deus tem consequências difíceis.'}
},
{
 id:'nascimento',titles:['nascimento de jesus','jesus nasceu','natal'],passages:['Lucas 2'],
 scenes:[
 [1,7,'José e Maria foram a Belém. Lá, chegou o tempo de Maria dar à luz, e Jesus nasceu. Ele foi envolvido em panos e colocado numa manjedoura.','Um decreto levou José a viajar com Maria até Belém, a cidade de Davi. Quando estavam ali, chegou o tempo do nascimento de Jesus. Maria deu à luz Seu filho primogênito, envolveu-o em panos e colocou-o numa manjedoura, porque não havia lugar disponível para eles na hospedaria.'],
 [8,14,'Perto dali havia pastores cuidando dos rebanhos à noite. Um anjo anunciou o nascimento do Salvador, e uma multidão celestial louvou a Deus.','Naquela região, pastores passavam a noite nos campos cuidando de seus rebanhos. Um anjo do Senhor apareceu e anunciou uma notícia de grande alegria: o nascimento do Salvador, Cristo, o Senhor. Depois uma multidão celestial louvou a Deus.'],
 [15,20,'Os pastores foram a Belém, encontraram Maria, José e o bebê, e divulgaram a notícia. Maria guardava aquelas coisas no coração.','Depois que os anjos partiram, os pastores decidiram ir a Belém. Encontraram Maria, José e o menino deitado na manjedoura. Eles contaram a mensagem que haviam recebido e voltaram glorificando a Deus. Maria guardava aquelas palavras e refletia sobre elas.']
 ],
 analogy:{little:'O nascimento de Jesus foi anunciado como uma grande alegria. Podemos agradecer a Deus pelo nascimento do Salvador.',middle:'Uma notícia importante costuma ser compartilhada com quem amamos. Os pastores ouviram e anunciaram a notícia do nascimento de Jesus.',older:'O anúncio aos pastores evidencia que a boa notícia do nascimento de Jesus alcançou pessoas comuns, não apenas autoridades ou líderes.'}
},
{
 id:'lazaro',titles:['lazaro'],passages:['João 11'],
 scenes:[
 [1,16,'Lázaro estava doente. Suas irmãs, Marta e Maria, mandaram avisar Jesus. Jesus demorou a ir até a aldeia.','Lázaro, irmão de Marta e Maria, estava enfermo. As irmãs enviaram uma mensagem a Jesus. O Evangelho conta que Jesus amava aquela família e permaneceu mais dois dias onde estava antes de ir à Judeia.'],
 [17,37,'Quando Jesus chegou, Lázaro havia morrido e estava sepultado havia quatro dias. Jesus conversou com Marta e Maria e chorou.','Ao chegar, Jesus encontrou a família enlutada. Lázaro estava no sepulcro havia quatro dias. Marta falou com Jesus sobre a morte do irmão, e Jesus ensinou que Ele é a ressurreição e a vida. Maria e outras pessoas também choravam. O texto registra que Jesus chorou.'],
 [38,44,'Jesus mandou retirar a pedra do sepulcro. Ele orou ao Pai e chamou Lázaro. Lázaro saiu vivo, e Jesus mandou que o soltassem das faixas.','Jesus se dirigiu ao sepulcro e ordenou que tirassem a pedra. Depois de agradecer ao Pai em oração, chamou Lázaro em alta voz. O homem que estava morto saiu do sepulcro, envolto em faixas. Jesus ordenou que o soltassem e deixassem ir.']
 ],
 analogy:{little:'Quando alguém está triste, podemos mostrar cuidado e ficar ao seu lado. Jesus também chorou ao ver o sofrimento das pessoas.',middle:'Marta e Maria viveram uma situação de perda. Jesus as ouviu, e o relato ensina sobre quem Ele é e Seu poder sobre a morte.',older:'O luto da família de Lázaro é tratado com seriedade no Evangelho. A passagem nos permite falar de compaixão e esperança em Cristo sem minimizar a dor de quem sofre.'}
},
{
 id:'multiplicacao',titles:['multiplicacao dos paes','cinco paes','paes e peixes'],passages:['João 6','Marcos 6','Mateus 14'],
 scenes:[
 [1,9,'Uma multidão seguia Jesus. Havia muita gente para alimentar. Um menino tinha cinco pães e dois peixes, segundo o Evangelho de João.','Uma grande multidão acompanhava Jesus. Ele percebeu a necessidade de alimentar aquelas pessoas. Os discípulos conversaram sobre a dificuldade de conseguir comida para todos. João registra que havia um menino com cinco pães de cevada e dois peixes.'],
 [10,13,'Jesus mandou as pessoas se assentarem, deu graças e distribuiu o alimento. Todos comeram, e ainda sobraram pedaços.','Jesus orientou que as pessoas se assentassem. Tomou os pães, deu graças e distribuiu aos que estavam sentados, assim como fez com os peixes. O Evangelho relata que todos comeram até ficarem satisfeitos. Depois, os discípulos recolheram os pedaços que sobraram.'],
 [14,15,'As pessoas perceberam que Jesus havia realizado um sinal extraordinário. Jesus, porém, afastou-se quando quiseram fazê-lo rei.','Depois daquele sinal, as pessoas reconheceram a importância do que Jesus havia feito. João relata que tentaram proclamá-lo rei, mas Jesus retirou-Se sozinho para um monte.']
 ],
 analogy:{little:'Podemos aprender a agradecer a Deus pelo alimento e a não desperdiçar o que recebemos.',middle:'A história também abre espaço para falar sobre gratidão e generosidade, sem dizer que nós podemos repetir o milagre de Jesus.',older:'O Evangelho mostra tanto a compaixão e o poder de Jesus como a reação das multidões. Vale refletir sobre a diferença entre buscar apenas benefícios e compreender quem Ele é.'}
},
{
 id:'ressurreicao',titles:['ressurreicao','pascoa e ressurreicao','jesus ressuscitou'],passages:['Mateus 28','Lucas 24','João 20'],
 scenes:[
 [1,4,'Depois da crucificação de Jesus, algumas mulheres foram ao sepulcro. Ali descobriram que a pedra havia sido removida.','No primeiro dia da semana, mulheres que seguiam Jesus foram ao sepulcro. Encontraram a entrada aberta e perceberam que o corpo de Jesus não estava onde havia sido colocado. Os relatos evangélicos descrevem a surpresa e a preocupação daquele momento.'],
 [5,7,'Uma mensagem anunciou que Jesus havia ressuscitado. As mulheres receberam a orientação de contar aos discípulos.','Uma mensagem celestial anunciou que Jesus não estava mais entre os mortos, pois havia ressuscitado. As mulheres foram instruídas a comunicar a notícia aos discípulos.'],
 [8,10,'As mulheres saíram para contar o que tinha acontecido. O anúncio da ressurreição trouxe espanto e alegria.','As mulheres se apressaram a levar a notícia aos discípulos. O Evangelho de Mateus registra que Jesus as encontrou e que elas O adoraram. A ressurreição é apresentada como um acontecimento central da fé cristã.']
 ],
 analogy:{little:'A mensagem da Páscoa cristã é que Jesus ressuscitou. Podemos celebrar essa esperança com gratidão.',middle:'Uma notícia muito importante muda a maneira como entendemos os acontecimentos. Os primeiros seguidores de Jesus ouviram a notícia de Sua ressurreição.',older:'A ressurreição ocupa o centro da fé cristã. A aula pode explorar a reação dos primeiros discípulos e o significado da esperança em Cristo.'}
},
{
 id:'criacao',titles:['deus criou o mundo','criacao','criacao do mundo'],passages:['Gênesis 1'],
 scenes:[
 [1,10,'A Bíblia começa contando que Deus criou os céus e a terra. Deus fez surgir a luz e separou as águas e a porção seca.','O primeiro capítulo de Gênesis começa afirmando que Deus criou os céus e a terra. O texto descreve a criação da luz, a separação entre dia e noite e a organização das águas e da terra seca.'],
 [11,19,'Deus fez a vegetação aparecer e estabeleceu os luzeiros para marcar dias e tempos.','A narrativa segue com a vegetação e com os luzeiros que servem para marcar dias, estações e anos. O texto apresenta a criação em uma sequência organizada, mostrando o cuidado de Deus.'],
 [20,25,'Deus criou os seres vivos das águas, as aves e os animais terrestres.','Deus criou os seres vivos das águas, as aves e os animais terrestres, cada qual conforme o que a narrativa informa. O capítulo destaca repetidamente a bondade da criação.'],
 [26,31,'Deus criou o ser humano à Sua imagem, homem e mulher. Ele viu tudo o que havia feito e declarou que era muito bom.','No relato da criação, Deus criou o ser humano à Sua imagem, homem e mulher. Deu responsabilidades à humanidade quanto à criação. Ao concluir, viu tudo o que havia feito, e era muito bom.']
 ],
 analogy:{little:'Quando olhamos uma árvore, uma flor ou um animal, podemos agradecer a Deus pela criação e cuidar bem dela.',middle:'Separar o lixo, economizar água e tratar os animais com cuidado são atitudes atuais que podem nos lembrar da responsabilidade de cuidar da criação.',older:'A criação convida a refletir sobre a dignidade humana, a responsabilidade ambiental e o valor da vida, sem atribuir ao texto detalhes científicos que ele não descreve.'}
},
{
 id:'jesus-anda-aguas',titles:['jesus anda sobre as aguas','andar sobre as aguas'],passages:['Mateus 14'],
 scenes:[
 [22,26,'Os discípulos estavam num barco durante a noite, com vento contrário. Jesus foi ao encontro deles andando sobre as águas, e eles ficaram com medo.','Após despedir a multidão, Jesus ficou para orar. Os discípulos atravessavam o lago num barco enfrentando vento contrário. Na madrugada, Jesus se aproximou caminhando sobre a água. Ao vê-lo, os discípulos se assustaram, mas Jesus lhes disse que tivessem coragem.'],
 [27,31,'Pedro pediu para ir até Jesus sobre as águas. Quando percebeu o vento, teve medo e começou a afundar. Jesus estendeu a mão e o segurou.','Pedro respondeu pedindo que Jesus o mandasse ir até Ele sobre as águas. Saiu do barco e começou a caminhar, mas, ao observar o vento, ficou com medo e começou a afundar. Clamou por Jesus, e Jesus imediatamente estendeu a mão e o segurou.'],
 [32,33,'Jesus e Pedro entraram no barco, e o vento cessou. Os que estavam no barco adoraram Jesus.','Quando Jesus e Pedro entraram no barco, o vento parou. Os discípulos O adoraram e reconheceram que Ele era o Filho de Deus.']
 ],
 analogy:{little:'Quando sentimos medo, podemos pedir ajuda e falar com Jesus em oração.',middle:'Muitas vezes começamos uma tarefa corajosamente e depois ficamos inseguros. A história mostra Pedro pedindo ajuda a Jesus.',older:'A experiência de Pedro convida a refletir sobre confiança, medo e dependência de Jesus, sem transformar o milagre numa promessa de que nunca teremos dificuldades.'}
}
];
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function storyFor(topic,reference){
 const query=normalize(topic),ref=normalize(reference);
 return stories.find(s=>ref.startsWith(normalize(s.passages[0]))&&s.titles.some(t=>query.includes(normalize(t))))||null;
}
function ageGroup(age){
 const v=normalize(age);
 if(/4 a 6|pre|infantil|4 anos|5 anos|6 anos/.test(v))return 'little';
 if(/7 a 8|7 anos|8 anos/.test(v))return 'early';
 if(/adolescent|13 anos|14 anos|15 anos|16 anos|17 anos/.test(v))return 'teen';
 if(/10 a 12|10 anos|11 anos|12 anos/.test(v))return 'older';
 return 'middle';
}
function rangeFor(reference,first,last){return {first:Number(first)||1,last:Number(last)||999,chapter:normalize(reference)}}
function accessibleBeats(story,first,last){
 const hits=story.scenes.filter(([from,to])=>from>=first&&to<=last);
 return hits.length?hits:[];
}
function narration({title,reference,age,firstVerse=1,lastVerse=999,interactive=false}){
 const story=storyFor(title,reference);
 if(!story)return null;
 const scenes=accessibleBeats(story,firstVerse,lastVerse);
 if(!scenes.length)return null;
 const group=ageGroup(age);
 const plain=group==='little',older=group==='older'||group==='teen',early=group==='early';
 const opening=plain?'Vamos ouvir uma história verdadeira registrada na Bíblia. Preste atenção ao que aconteceu.':
   group==='early'?'Hoje vamos descobrir quem aparece nesta história, o que aconteceu e o que podemos aprender.':
   group==='middle'?'Abra a Bíblia e acompanhe comigo esta história. Vamos observar a ordem dos fatos e aquilo que Deus ensina.':
   group==='older'?'Vamos acompanhar atentamente os acontecimentos, observando suas causas, consequências e o que eles ensinam sobre Deus.':
    'Vamos examinar os acontecimentos da passagem, seu contexto e as decisões dos personagens, sem acrescentar ao texto o que não foi narrado.';
 const paragraphs=scenes.map(([from,to,short,long],i)=>{
   let line=(plain||early)?short:long;
   if(interactive){
    const endings=plain?['O que aconteceu nessa parte?','Quem você percebeu nessa história?','O que a Bíblia nos contou até aqui?']:
       ['O que podemos observar neste trecho?','Como esse acontecimento se relaciona com a parte anterior?','Qual é a informação mais importante deste momento?'];
    line+='\n(Pausa para conversar: '+endings[i%endings.length]+')';
   }
   return line;
 });
 let final=plain?'Vamos lembrar juntos o que aconteceu nessa história?':
   early?'Que parte da história você consegue contar com suas próprias palavras?':
   group==='middle'?'O que os personagens fizeram? Qual ensinamento podemos levar para nossa vida?':
   older?'Ao concluir, retome o texto bíblico, a motivação dos personagens e as consequências de suas escolhas.':
     'Que elementos do relato ajudam a compreender a mensagem central? Compare suas conclusões com o texto bíblico.';
 const analogy=story.analogy[group]||story.analogy[(group==='early'?'little':group==='teen'?'older':'middle')];
 const appBlock='\n\nCOMPARAÇÃO COM A VIDA DE HOJE (não faz parte da história bíblica):\n'+analogy;
 const script=[opening,...paragraphs,final].join('\n\n')+appBlock;
 return {script,comparison:analogy,group,storyId:story.id,scenes:scenes.length,interactive};
}
window.MI_LESSON_STORYTELLING=Object.freeze({narration,ageGroup,storyFor,storiesCount:stories.length});
})();
