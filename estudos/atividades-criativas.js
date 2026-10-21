/* Ministério Infantil • Laboratório de Atividades Criativas
 * Exercícios curados por assunto. Somente textos ligados à referência escolhida.
 * Não altera dados infantis, nem as atividades já salvas.
 */
(()=>{'use strict';
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const collections=[
 {id:'semeador',test:/SEMEADOR|SEMENTE/,references:[/^MATEUS 13/,/^MARCOS 4/,/^LUCAS 8/],theme:'Sementes e Boas Escolhas',
  words:['SEMENTE','TERRA','PALAVRA','FRUTO','JESUS'],
  choice:{q:'Em qual tipo de terra a semente cresceu e deu fruto?',options:['Terra Boa','Caminho','Espinhos'],answer:0,ref:'Mateus 13:8,23; Marcos 4:8,20; Lucas 8:8,15'},
  fill:{text:'Jesus explicou que a semente representa a ______ de Deus.',answers:['PALAVRA'],ref:'Marcos 4:14; Lucas 8:11'},
  match:{q:'Ligue cada lugar ao que ocorreu com a semente.',pairs:[['Caminho','Aves comeram a semente'],['Entre Espinhos','A planta ficou sufocada'],['Boa Terra','A semente produziu fruto']],ref:'Mateus 13:3-9'},
  order:{q:'Numere os momentos da explicação de Jesus.',items:['Jesus contou a parábola.','Os discípulos perguntaram sobre o ensino.','Jesus explicou o significado dos solos.'],ref:'Mateus 13:1-23'},
  talk:'Em que situação você pode ouvir uma orientação boa e colocá-la em prática nesta semana?'
 },
 {id:'jonas1',test:/JONAS|NINIVE|PEIXE/,references:[/^JONAS 1/],theme:'Jonas e a Segunda Chance',
  words:['JONAS','NAVIO','MAR','DEUS','PEIXE'],
  choice:{q:'Quem foi chamado por Deus para ir a Nínive?',options:['Jonas','Daniel','Noé'],answer:0,ref:'Jonas 1:1-2'},
  fill:{text:'Deus mandou Jonas ir à cidade de ______.',answers:['NÍNIVE'],ref:'Jonas 1:1-2'},
  match:{q:'Ligue cada elemento ao trecho do capítulo.',pairs:[['Jonas','Recebeu a ordem do Senhor'],['Navio','Meio de transporte em que embarcou'],['Grande Peixe','Preparado por Deus']],ref:'Jonas 1:1-17'},
  order:{q:'Coloque os acontecimentos de Jonas 1 na ordem.',items:['Deus chamou Jonas.','Jonas embarcou num navio.','Uma tempestade atingiu a viagem.','O grande peixe engoliu Jonas.'],ref:'Jonas 1:1-17'},
  talk:'Quando uma tarefa difícil dá vontade de fugir, como podemos pedir ajuda e agir corretamente?'
 },
 {id:'jonas2',test:/JONAS|PEIXE/,references:[/^JONAS 2/],theme:'A Oração de Jonas',
  words:['JONAS','ORACAO','SENHOR','SALVACAO','PEIXE'],
  choice:{q:'O que Jonas fez enquanto estava dentro do peixe?',options:['Orou ao Senhor','Construiu uma arca','Fez uma festa'],answer:0,ref:'Jonas 2:1'},
  fill:{text:'Jonas declarou que a salvação pertence ao ______.',answers:['SENHOR'],ref:'Jonas 2:9'},
  order:{q:'Qual é a ordem dos fatos registrados?',items:['Jonas orou ao Senhor.','Jonas declarou gratidão e confiança.','O peixe devolveu Jonas à terra.'],ref:'Jonas 2:1-10'},
  talk:'Como você pode conversar com Deus quando sente medo ou precisa reconhecer um erro?'
 },
 {id:'jonas3',test:/JONAS|NINIVE/,references:[/^JONAS 3/],theme:'Jonas e a Cidade de Nínive',
  words:['JONAS','NINIVE','POVO','DEUS','MUDANCA'],
  choice:{q:'O que o povo de Nínive fez depois de ouvir a mensagem?',options:['Demonstrou arrependimento','Construiu um barco','Ignorou Jonas'],answer:0,ref:'Jonas 3:5-10'},
  fill:{text:'Jonas foi anunciar a mensagem de Deus na cidade de ______.',answers:['NÍNIVE'],ref:'Jonas 3:1-4'},
  order:{q:'Coloque os fatos em sequência.',items:['Deus enviou Jonas novamente.','Jonas anunciou a mensagem.','O povo demonstrou arrependimento.'],ref:'Jonas 3:1-10'},
  talk:'Que atitude mostra que alguém reconheceu um erro e quer mudar?'
 },
 {id:'cana',test:/CANA|BODAS|AGUA EM VINHO|VINHO E/,references:[/^JOAO 2/],theme:'O Primeiro Sinal em Caná',
  words:['JESUS','AGUA','TALHAS','CANA','SINAL'],
  choice:{q:'Em Caná, Jesus transformou água em quê?',options:['Vinho','Pão','Azeite'],answer:0,ref:'João 2:1-11'},
  fill:{text:'Os serventes encheram de ______ as talhas de pedra.',answers:['ÁGUA'],ref:'João 2:6-7'},
  match:{q:'Ligue os elementos aos acontecimentos.',pairs:[['Serventes','Encheram as talhas de água'],['Jesus','Orientou os serventes'],['Discípulos','Creram nele após o sinal']],ref:'João 2:1-11'},
  order:{q:'Reorganize os acontecimentos de Caná.',items:['O vinho da festa acabou.','Jesus orientou que enchessem as talhas.','A água se tornou vinho.','Os discípulos creram em Jesus.'],ref:'João 2:1-11'},
  talk:'Por que João contou esse sinal? O que ele revela sobre Jesus?'
 },
 {id:'noe6',test:/NOE|ARCA/,references:[/^GENESIS 6/],theme:'Noé e a Arca',
  words:['NOE','ARCA','DEUS','CUIDADO','OBEDIENCIA'],
  choice:{q:'Quem recebeu orientações para construir a arca?',options:['Noé','Moisés','José'],answer:0,ref:'Gênesis 6:13-22'},
  fill:{text:'Noé fez tudo conforme Deus lhe ______.',answers:['ORDENOU'],ref:'Gênesis 6:22'},
  match:{q:'Ligue os elementos à narrativa.',pairs:[['Deus','Deu instruções a Noé'],['Noé','Obedeceu às instruções'],['Arca','Foi construída conforme as medidas dadas']],ref:'Gênesis 6:13-22'},
  order:{q:'Coloque os momentos na ordem.',items:['Deus deu instruções a Noé.','Noé construiu a arca conforme as orientações.'],ref:'Gênesis 6:13-22'},
  talk:'Quando precisamos seguir instruções importantes com atenção?'
 },
 {id:'noe7',test:/NOE|ARCA/,references:[/^GENESIS 7/],theme:'O Dilúvio',
  words:['NOE','ARCA','CHUVA','AGUAS','DEUS'],
  choice:{q:'Quem fechou a porta da arca?',options:['O Senhor','Noé','Os marinheiros'],answer:0,ref:'Gênesis 7:16'},
  fill:{text:'Noé e sua família entraram na ______.',answers:['ARCA'],ref:'Gênesis 7:7'},
  order:{q:'Organize a sequência.',items:['Noé e sua família entraram na arca.','O Senhor fechou a porta.','As águas subiram e a arca flutuou.'],ref:'Gênesis 7:1-24'},
  talk:'Como agir com cuidado quando temos uma responsabilidade importante?'
 },
 {id:'samaritano',test:/SAMARITANO/,references:[/^LUCAS 10/],theme:'Amor que Vira Atitude',
  words:['AJUDA','AMOR','CUIDADO','PROXIMO','JESUS'],
  choice:{q:'Quem parou para cuidar do homem ferido na parábola?',options:['O Samaritano','O Sacerdote','O Levita'],answer:0,ref:'Lucas 10:30-37'},
  fill:{text:'O samaritano demonstrou ______ pelo homem ferido.',answers:['COMPAIXÃO','MISERICÓRDIA'],ref:'Lucas 10:33-37'},
  match:{q:'Ligue cada personagem à atitude relatada.',pairs:[['Sacerdote','Passou adiante'],['Levita','Também passou adiante'],['Samaritano','Cuidou do homem ferido']],ref:'Lucas 10:30-37'},
  order:{q:'Numere os fatos da parábola.',items:['Um homem foi ferido numa estrada.','Duas pessoas passaram sem ajudar.','O samaritano cuidou dele e o levou à hospedaria.'],ref:'Lucas 10:30-37'},
  talk:'Se uma criança estiver sozinha ou precisando de ajuda, o que podemos fazer com segurança?'
 },
 {id:'davi',test:/DAVI|GOLIAS/,references:[/^1 SAMUEL 17/],theme:'A Coragem de Davi',
  words:['DAVI','GOLIAS','FÉ','DEUS','CORAGEM'],
  choice:{q:'Em quem Davi declarou confiar para enfrentar Golias?',options:['No Senhor','Somente na armadura','Na força de Golias'],answer:0,ref:'1 Samuel 17:45-47'},
  fill:{text:'Davi disse que vinha contra Golias em nome do ______ dos Exércitos.',answers:['SENHOR'],ref:'1 Samuel 17:45'},
  match:{q:'Ligue cada personagem ao que o texto relata.',pairs:[['Golias','Desafiava os israelitas'],['Davi','Declarou confiança no Senhor'],['Saul','Ofereceu uma armadura a Davi']],ref:'1 Samuel 17:1-58'},
  order:{q:'Organize a sequência dos fatos.',items:['Golias desafiou Israel.','Davi declarou sua confiança no Senhor.','Davi atingiu Golias com uma pedra.'],ref:'1 Samuel 17:1-58'},
  talk:'Que atitude correta você pode tomar, mesmo sentindo medo?'
 },
 {id:'zaqueu',test:/ZAQUEU/,references:[/^LUCAS 19/],theme:'Zaqueu e a Mudança',
  words:['ZAQUEU','JESUS','ARVORE','CASA','MUDANCA'],
  choice:{q:'O que Zaqueu fez para conseguir ver Jesus?',options:['Subiu numa árvore','Entrou num barco','Abriu um telhado'],answer:0,ref:'Lucas 19:1-4'},
  fill:{text:'Jesus chamou ______ pelo nome.',answers:['ZAQUEU'],ref:'Lucas 19:5'},
  order:{q:'Coloque os acontecimentos em ordem.',items:['Zaqueu subiu numa árvore.','Jesus o chamou pelo nome.','Zaqueu recebeu Jesus com alegria.','Zaqueu falou sobre reparar injustiças.'],ref:'Lucas 19:1-10'},
  talk:'Qual é a diferença entre dizer que mudou e demonstrar a mudança com atitudes?'
 },
 {id:'tempestade',test:/TEMPESTADE|JESUS ACALMA/,references:[/^MARCOS 4/,/^MATEUS 8/,/^LUCAS 8/],theme:'Jesus Acalma a Tempestade',
  words:['BARCO','VENTO','JESUS','MEDO','FÉ'],
  choice:{q:'Quem fez o vento e o mar se acalmarem?',options:['Jesus','Pedro','Os marinheiros'],answer:0,ref:'Marcos 4:35-41; Mateus 8:23-27; Lucas 8:22-25'},
  fill:{text:'Os discípulos ficaram com ______ durante a tempestade.',answers:['MEDO'],ref:'Marcos 4:35-41'},
  order:{q:'Organize os acontecimentos.',items:['Uma tempestade atingiu o barco.','Os discípulos pediram ajuda a Jesus.','Jesus acalmou o vento e o mar.'],ref:'Marcos 4:35-41'},
  talk:'O que podemos fazer quando sentimos medo, além de orar e pedir ajuda?'
 },
 {id:'amor',test:/AMOR DE DEUS|DEUS NOS AMA|AMOR AO PROXIMO/,references:[/^JOAO 3/,/^ROMANOS 5/,/^1 JOAO 4/,/^MARCOS 12/],theme:'Amor em Ação',
  words:['DEUS','JESUS','AMOR','VIDA','CUIDADO'],
  choice:{q:'Qual atitude demonstra amor ao próximo?',options:['Acolher alguém com respeito','Zombar de um colega','Ignorar quem precisa'],answer:0,ref:'Aplicação prática; confira o ensino na passagem principal'},
  fill:{text:'Podemos demonstrar ______ por meio das nossas atitudes.',answers:['AMOR'],ref:'Aplicação prática; confira a passagem principal'},
  talk:'Que atitude de carinho, respeito ou cuidado você poderia praticar esta semana?'
 }
];

collections.push(
 {id:'ester4',test:/ESTER|MORDECAI/,references:[/^ESTER 4/],theme:'Ester: Coragem e Oração',
  words:['ESTER','JEJUM','POVO','CORAGEM','DEUS'],
  choice:{q:'O que Ester pediu que seu povo fizesse antes de ela se apresentar ao rei?',options:['Jejuasse por ela','Organizasse uma corrida','Construísse uma arca'],answer:0,ref:'Ester 4:15-17'},
  fill:{text:'Ester pediu um ______ de três dias.',answers:['JEJUM'],ref:'Ester 4:16'},
  match:{q:'Ligue os personagens ou grupos às atitudes do relato.',pairs:[['Mordecai','Comunicou a situação a Ester'],['Ester','Decidiu procurar o rei'],['Judeus de Susã','Foram convocados a jejuar']],ref:'Ester 4:4-17'},
  order:{q:'Numere os acontecimentos de Ester 4.',items:['Mordecai comunicou o perigo a Ester.','Ester pediu que seu povo jejuasse.','Ester decidiu procurar o rei.'],ref:'Ester 4:1-17'},
  talk:'O que significa ter coragem para fazer o bem, mesmo quando a situação é difícil?'
 },
 {id:'festa14',test:/GRANDE FESTA|BANQUETE|GRANDE CEIA|CONVITE/,references:[/^LUCAS 14/],theme:'O Convite da Grande Festa',
  words:['JESUS','CONVITE','FESTA','SERVO','PESSOAS'],
  choice:{q:'Na parábola, como os primeiros convidados responderam ao convite?',options:['Deram desculpas','Foram imediatamente','Mandaram construir uma arca'],answer:0,ref:'Lucas 14:16-20'},
  fill:{text:'O homem da parábola preparou uma grande ______.',answers:['FESTA','CEIA'],ref:'Lucas 14:16'},
  match:{q:'Ligue cada personagem da parábola ao que fez.',pairs:[['Primeiros Convidados','Apresentaram desculpas'],['Servo','Levou o convite'],['Dono da Casa','Mandou chamar outras pessoas']],ref:'Lucas 14:16-23'},
  order:{q:'Coloque em ordem os acontecimentos da parábola.',items:['Um homem preparou uma grande ceia.','Os primeiros convidados deram desculpas.','O servo chamou outras pessoas.'],ref:'Lucas 14:16-23'},
  talk:'Como podemos acolher pessoas que muitas vezes ficam de fora das atividades?'
 },
 {id:'samaritana4',test:/SAMARITANA|MULHER DO POCO|POCO DE JACO|PRECONCEITO/,references:[/^JOAO 4/],theme:'Jesus Conversa com a Samaritana',
  words:['JESUS','MULHER','POCO','AGUA','VIDA'],
  choice:{q:'Com quem Jesus conversou junto ao poço?',options:['Uma mulher samaritana','Uma rainha da Pérsia','Uma serva de Faraó'],answer:0,ref:'João 4:7-26'},
  fill:{text:'Jesus falou sobre a água ______.',answers:['VIVA'],ref:'João 4:10-14'},
  match:{q:'Ligue os participantes ao que aparece no relato.',pairs:[['Jesus','Falou sobre a água viva'],['Mulher Samaritana','Conversou com Jesus junto ao poço'],['Moradores','Foram ouvir Jesus']],ref:'João 4:1-42'},
  order:{q:'Relembre a sequência dos acontecimentos.',items:['Jesus conversou com uma mulher samaritana.','Ele falou sobre água viva.','A mulher contou às pessoas da cidade.','Muitos creram em Jesus.'],ref:'João 4:7-42'},
  talk:'Por que precisamos tratar as pessoas com respeito, inclusive quem é diferente de nós?'
 },
 {id:'cornelio',test:/CORNELIO|PEDRO E CORNELIO|PEDRO VIS[ÃA]O/,references:[/^ATOS 10/],theme:'A Boa Notícia para Todos',
  words:['PEDRO','CORNELIO','JESUS','FAMILIA','EVANGELHO'],
  choice:{q:'Quem foi chamado para falar a Cornélio e às pessoas reunidas?',options:['Pedro','Jonas','Samuel'],answer:0,ref:'Atos 10:19-24,33'},
  fill:{text:'Cornélio mandou chamar ______.',answers:['PEDRO'],ref:'Atos 10:22-33'},
  match:{q:'Quem fez o quê no relato?',pairs:[['Cornélio','Mandou chamar Pedro'],['Pedro','Anunciou Jesus Cristo'],['Pessoas Reunidas','Ouviram a mensagem']],ref:'Atos 10:24-48'},
  order:{q:'Organize os fatos narrados em Atos 10.',items:['Cornélio recebeu uma orientação.','Pedro teve uma visão.','Pedro foi à casa de Cornélio.','Pedro anunciou Jesus aos presentes.'],ref:'Atos 10:1-48'},
  talk:'Como podemos demonstrar respeito e amizade por pessoas de origens diferentes?'
 },
 {id:'filipe-etiope',test:/FILIPE|ETIOPE|ETIOPIA|OFICIAL DA RAINHA/,references:[/^ATOS 8/],theme:'Filipe Compartilha a Palavra',
  words:['FILIPE','JESUS','CAMINHO','BATISMO','ISAIAS'],
  choice:{q:'Quem explicou as Escrituras ao oficial etíope?',options:['Filipe','Pedro','Daniel'],answer:0,ref:'Atos 8:29-35'},
  fill:{text:'O oficial estava lendo o livro do profeta ______.',answers:['ISAÍAS'],ref:'Atos 8:28-35'},
  match:{q:'Ligue a pessoa ao fato relatado.',pairs:[['Filipe','Explicou a mensagem das Escrituras'],['Oficial Etíope','Lia o profeta Isaías'],['Ambos','Entraram na água para o batismo']],ref:'Atos 8:26-40'},
  order:{q:'Ordene os acontecimentos de Atos 8.',items:['Filipe recebeu uma orientação e foi ao caminho.','Ele encontrou o oficial que lia Isaías.','Filipe anunciou Jesus ao oficial.','O oficial foi batizado.'],ref:'Atos 8:26-40'},
  talk:'Como podemos conversar sobre Jesus de modo respeitoso com alguém que tem dúvidas?'
 }
);


/* Atividades contextualizadas: Gênesis 2 e 3 não são intercambiáveis. */
collections.unshift(
 {id:'adao-eva3',test:/ADAO|EVA|JARDIM DO EDEN|DESOBEDIENCIA/,references:[/^GENESIS 3/],theme:'Escolhas e Consequências',
  words:['DEUS','EVA','ADAO','JARDIM','SERPENTE'],
  choice:{q:'Quem conversou com a mulher sobre o fruto proibido?',options:['A serpente','Noé','Abraão'],answer:0,ref:'Gênesis 3:1-5'},
  fill:{text:'Adão e Eva se esconderam entre as árvores do ______.',answers:['JARDIM'],ref:'Gênesis 3:8'},
  match:{q:'Relacione cada pessoa ou elemento ao relato.',pairs:[['A serpente','Conversou com a mulher'],['A mulher','Comeu do fruto e deu ao homem'],['O homem','Também comeu do fruto']],ref:'Gênesis 3:1-6'},
  order:{q:'Numere os fatos segundo Gênesis 3.',items:['A serpente conversou com a mulher.','A mulher e o homem comeram do fruto.','Eles ouviram a voz do Senhor e se esconderam.','Deus perguntou o que havia acontecido.'],ref:'Gênesis 3:1-13'},
  talk:'Quando tomamos uma decisão errada, como podemos reconhecer o erro e dizer a verdade?'
 },
 {id:'adao-eva2',test:/ADAO|EVA|JARDIM DO EDEN|CRIACAO DO HOMEM|CRIACAO DA MULHER/,references:[/^GENESIS 2/],theme:'Vida e Responsabilidade no Jardim',
  words:['DEUS','JARDIM','HOMEM','MULHER','ARVORE'],
  choice:{q:'Onde Deus colocou o homem para cultivar e guardar?',options:['No jardim do Éden','Na arca','Em Jericó'],answer:0,ref:'Gênesis 2:8,15'},
  fill:{text:'Deus colocou o homem no jardim para o cultivar e o ______.',answers:['GUARDAR'],ref:'Gênesis 2:15'},
  match:{q:'Ligue cada afirmação à referência correta.',pairs:[['Deus formou o homem','Gênesis 2:7'],['Deus colocou o homem no jardim','Gênesis 2:8'],['Deus fez a mulher','Gênesis 2:21-22']],ref:'Gênesis 2:7-22'},
  order:{q:'Numere os acontecimentos descritos em Gênesis 2.',items:['Deus formou o homem do pó da terra.','Deus colocou o homem no jardim do Éden.','Deus deu ao homem a tarefa de cultivar e guardar o jardim.','Deus fez a mulher e a trouxe ao homem.'],ref:'Gênesis 2:7-22'},
  talk:'Qual responsabilidade você pode exercer com cuidado nas atividades da sua casa ou da igreja?'
 }
);


collections.unshift({
 id:'criacao1',test:/CRIACAO|DEUS CRIOU|INICIO DE TUDO/,references:[/^GENESIS 1/],
 theme:'A Criação e a Gratidão',words:['DEUS','LUZ','TERRA','AGUAS','AVES'],
 choice:{q:'O que Deus criou no primeiro dia?',options:['A luz','As aves','Os peixes'],answer:0,ref:'Gênesis 1:3–5'},
 fill:{text:'Deus disse: Haja ______.',answers:['LUZ'],ref:'Gênesis 1:3'},
 match:{q:'Ligue cada dia ao acontecimento registrado.',pairs:[['Dia 1','Deus fez a luz'],['Dia 3','Deus fez surgir as plantas'],['Dia 5','Deus criou aves e seres aquáticos']],ref:'Gênesis 1:3–23'},
 order:{q:'Coloque os acontecimentos em ordem.',items:['Deus criou a luz.','Deus fez surgir a terra seca e as plantas.','Deus criou os luminares.','Deus criou os seres aquáticos e as aves.'],ref:'Gênesis 1:1–23'},
 talk:'O que na criação faz você admirar o poder e o cuidado de Deus?'
});

const choose=(data)=>{
 const title=norm(data.title),ref=norm(data.reference);
 return collections.find(x=>x.test.test(title)&&x.references.some(p=>p.test(ref)))||null;
};
const seededShuffle=(arr,seed)=>{let a=[...arr],v=seed>>>0;for(let i=a.length-1;i>0;i--){v=(v*1664525+1013904223)>>>0;const j=v%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const hash=s=>{let n=2166136261;for(const c of String(s)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0};
const cellWords=(words,seed)=>{
 const sorted=[...new Set(words.map(w=>norm(w).replace(/\s/g,'')).filter(w=>w.length>=3&&w.length<=10))].slice(0,5);
 const N=11,grid=Array.from({length:N},()=>Array(N).fill('')),placed=[],locations=[];
 let v=(seed>>>0)||0x9e3779b9;const roll=m=>{v^=v<<13;v^=v>>>17;v^=v<<5;return (v>>>0)%m};
 for(const word of sorted){
  let found=false;
  for(let tries=0;tries<180&&!found;tries++){
   const vertical=roll(2)===1,reverse=roll(2)===1;
   const chars=reverse?[...word].reverse().join(''):word;
   const row=roll(N-(vertical?word.length:0)),col=roll(N-(vertical?0:word.length));
   if([...chars].every((c,i)=>{const rr=row+(vertical?i:0),cc=col+(vertical?0:i);return !grid[rr][cc]||grid[rr][cc]===c})){
    [...chars].forEach((c,i)=>{grid[row+(vertical?i:0)][col+(vertical?0:i)]=c});
    placed.push(word);
    locations.push(word+': linha '+(row+(vertical&&reverse?word.length-1:0)+1)+', coluna '+(col+(!vertical&&reverse?word.length-1:0)+1)+' ('+(vertical?(reverse?'para cima ↑':'para baixo ↓'):(reverse?'para a esquerda ←':'para a direita →'))+').');
    found=true;
   }
  }
 }
 const letters='AEIOUBCDFGLMNPRSTV';for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!grid[r][c])grid[r][c]=letters[roll(letters.length)];
 return {grid,words:placed,answer:'Solução do Caça-Palavras: '+locations.join(' ')};
};
function makeMaze(seed,size=7){
 const n=size,cells=Array.from({length:n*n},()=>({n:true,e:true,s:true,w:true})),used=new Set([0]),stack=[0];
 let r=(seed>>>0)||0x5a5a3141;
 const rand=max=>{r^=r<<13;r^=r>>>17;r^=r<<5;return (r>>>0)%max};
 const delta=[[-1,0,'n','s'],[0,1,'e','w'],[1,0,'s','n'],[0,-1,'w','e']];
 while(stack.length){
  const cur=stack[stack.length-1],row=Math.floor(cur/n),col=cur%n;
  const possible=delta.map(([dr,dc,a,b])=>({rr:row+dr,cc:col+dc,a,b})).filter(z=>z.rr>=0&&z.rr<n&&z.cc>=0&&z.cc<n&&!used.has(z.rr*n+z.cc));
  if(!possible.length){stack.pop();continue}
  const next=possible[rand(possible.length)],pos=next.rr*n+next.cc;
  cells[cur][next.a]=false;cells[pos][next.b]=false;used.add(pos);stack.push(pos);
 }
 // Certificar que há um caminho único da entrada até a saída.
 const walk=(cur,prev,path)=>{if(cur===n*n-1)return [...path,cur];for(const [dr,dc,a] of delta){const row=Math.floor(cur/n)+dr,col=cur%n+dc;if(row<0||col<0||row>=n||col>=n||cells[cur][a])continue;const pos=row*n+col;if(pos===prev)continue;const found=walk(pos,cur,[...path,cur]);if(found)return found}return null};
 const path=walk(0,-1,[]);
 return {size:n,cells,path,answer:'Caminho do Labirinto: '+path.map((p,i)=>(i+1)+'. linha '+(Math.floor(p/n)+1)+', coluna '+(p%n+1)).join(' → ')+'.'};
}
function scrambleWord(word,seed){
 const chars=[...norm(word).replace(/[^A-Z]/g,'')];
 if(chars.length<4)return chars.join('');
 let output=seededShuffle(chars,seed).join('');
 if(output===chars.join(''))output=chars.slice(1).concat(chars[0]).join('');
 if(output===chars.join(''))output=[...chars].reverse().join('');
 return output;
}
function activitySheet(data){
 const item=choose(data);
 const age=window.MI_LESSON_STORYTELLING?.ageGroup(data.age)||'middle';
 const seed=hash((item?.id||'geral')+'|'+data.reference+'|'+age);
 const little=age==='little',early=age==='early',older=age==='older'||age==='teen';
 const exercises=[],answers=[];
 const add=(e,a)=>{exercises.push(e);if(a)answers.push({title:e.title,answer:a})};
 if(item){
  // Uma atividade de escolha com respostas: não se imprime o gabarito para a criança.
  if(item.choice&&!(older&&item.order)){
   const options=seededShuffle(item.choice.options,seed);
   add({type:'choice',title:'Desafio de Atenção',prompt:item.choice.q,options},
       'Correta: '+item.choice.options[item.choice.answer]+'. Referência: '+item.choice.ref+'.');
  }
  if((little||early)&&item.fill){
   const correct=item.fill.answers[0];
   const distractors=item.words.filter(w=>norm(w).replace(/\s/g,'')!==norm(correct).replace(/\s/g,'')).slice(0,2);
   const bank=seededShuffle([correct,...distractors],seed^0x45619abc);
   add({type:'fill',title:'Complete a Descoberta',prompt:item.fill.text,words:bank},
       'Complete com: '+item.fill.answers.join(' ou ')+'. '+item.fill.ref+'.');
  }
  if(!little&&item.match){
   const right=seededShuffle(item.match.pairs.map(p=>p[1]),seed);
   add({type:'match',title:'Ligue e Aprenda',prompt:item.match.q,left:item.match.pairs.map(p=>p[0]),right},
       item.match.pairs.map(p=>p.join(' → ')).join(' | ')+'. '+item.match.ref+'.');
  }
  if(!little&&item.order){
   const shown=seededShuffle(item.order.items,seed^0x9e3779b9);
   add({type:'sequence',title:'História em Ordem',prompt:item.order.q,items:shown},
       'Ordem correta: '+item.order.items.map((t,i)=>(i+1)+'. '+t).join(' ')+'. '+item.order.ref+'.');
  }
  if(!little){
   const puzzle=cellWords(item.words,seed);
   if(puzzle.words.length>=3)add({type:'wordsearch',title:'Caça-Palavras Bíblico',prompt:'Encontre as palavras ligadas ao tema.',grid:puzzle.grid,words:puzzle.words},puzzle.answer);
  }
  if(older){
   const words=item.words.slice(0,4).map(word=>({answer:norm(word).replace(/[^A-Z]/g,''),mixed:scrambleWord(word,seed+hash(word))})).filter(x=>x.answer.length>=4);
   if(words.length)add({type:'anagram',title:'Palavras Embaralhadas',prompt:'Descubra as palavras relacionadas à passagem. Escreva cada palavra na linha correspondente.',words},
     'Respostas: '+words.map(x=>x.mixed+' → '+x.answer).join('; ')+'. Palavras do tema da aula.');
  }
  if(age==='teen'){
   const reported=item.order?.items?.[0]||null;
   const q='Qual a diferença entre o que o texto realmente relata e uma aplicação atual?';
   add({type:'analysis',title:'Investigação Bíblica',prompt:q,source:reported,application:item.talk,reference:data.reference},
    (reported?'Acontecimento conferível: '+reported+' ':'Confira a passagem antes de definir os fatos. ')+'A aplicação é uma reflexão para o presente, não algo ocorrido na narrativa. Base: '+data.reference+'.');
  }
  if(little||early){const maze=makeMaze(seed,little?6:7);add({type:'maze',title:'Labirinto da Descoberta',prompt:'Encontre o caminho da estrela até a Bíblia. Passe o lápis pelo percurso.',maze},maze.answer)}
  add({type:'reflect',title:older?'Missão da Semana':'Minha Escolha de Hoje',prompt:item.talk},'Resposta pessoal. A aplicação deve respeitar o ensinamento da passagem.');
 }else{
  // Mesmo sem roteiro temático revisado, a atividade tem conteúdo a preencher e palavras do próprio título.
  const tokens=norm(data.title).split(' ').filter(w=>w.length>=4&&!['PARA','COMO','SOBRE','JESUS'].includes(w)).slice(0,4);
  const words=[...new Set([...tokens,'BIBLIA','DEUS','JESUS'])].slice(0,5);
  add({type:'choice',title:'Detetive da Palavra',prompt:'Qual fonte devemos consultar para conferir o ensinamento desta aula?',options:['A Bíblia','Uma mensagem sem fonte','Um boato']},'Correta: A Bíblia. Referência a conferir: '+data.reference+'.');
  add({type:'fill',title:'Nossa Referência',prompt:'O Livro, Capítulo ou Versículo de hoje é: ____________________',words:[String(data.reference)]},'Conferir '+data.reference+'.');
  add({type:'match',title:'Ligue as Descobertas',prompt:'Ligue cada etapa do estudo ao seu significado.',left:['Leitura','Ensinamento','Aplicação'],right:['Como praticar o que aprendi','O que o texto ensina','O que está escrito na Bíblia']},
   'Leitura → O que está escrito na Bíblia. Ensinamento → O que o texto ensina. Aplicação → Como praticar o que aprendi.');
  add({type:'sequence',title:'Passos do Explorador',prompt:'Numere as etapas de um estudo bíblico.',items:seededShuffle(['Abrir e ler a passagem bíblica.','Compreender o que o texto ensina.','Escolher uma atitude para praticar.'],seed)},
   'Ordem: 1. Abrir e ler a passagem bíblica. 2. Compreender o que o texto ensina. 3. Escolher uma atitude para praticar.');
  const puzzle=cellWords(words,seed);
  if(!little)add({type:'wordsearch',title:'Palavras do Nosso Tema',prompt:'Encontre palavras do título da aula e do estudo da Bíblia. Este é um jogo de palavras, não uma lista de fatos da história.',grid:puzzle.grid,words:puzzle.words},puzzle.answer);
  if(older){
   const scrambled=words.filter(w=>w.length>=4).slice(0,4).map(w=>({answer:w,mixed:scrambleWord(w,seed+hash(w))}));
   add({type:'anagram',title:'Palavras Embaralhadas',prompt:'Reorganize as letras para descobrir as palavras do tema.',words:scrambled},'Soluções: '+scrambled.map(x=>x.mixed+' → '+x.answer).join('; ')+'.');
  }
  if(age==='teen')add({type:'analysis',title:'Investigação Bíblica',prompt:'O que a passagem afirma e o que é apenas uma aplicação atual?',source:null,reference:data.reference},
   'Conferir '+data.reference+'. Separe os fatos ou ensinamentos registrados de uma reflexão atual escolhida pelo grupo.');
  if(little||early){const maze=makeMaze(seed,little?6:7);add({type:'maze',title:'Labirinto da Descoberta',prompt:'Siga o caminho da estrela até a Bíblia. O jogo é uma ilustração, não um fato bíblico.',maze},maze.answer)}
  add({type:'reflect',title:'Minha Missão',prompt:'Leia '+data.reference+' com seu professor. Escreva ou desenhe uma atitude que combina com o que você aprendeu.'},'Resposta pessoal. O professor verifica a relação com o texto estudado.');
 }
 // Para pequenos, priorizar tarefas curtas e desenho, sem sobrecarregar.
 const kinds=little?['choice','fill','maze','reflect']:
  early?['choice','fill','match','maze','reflect']:
  age==='middle'?['match','sequence','wordsearch','reflect']:
  age==='older'?['sequence','wordsearch','anagram','reflect']:
  ['sequence','anagram','analysis','reflect'];
 const selected=kinds.map(kind=>exercises.find(x=>x.type===kind)).filter(Boolean);
 // Assuntos sem um bloco temático ainda recebem reflexão e um passatempo seguro.
 if(!selected.length)selected.push(...exercises.slice(0,3));
 const selectedTitles=new Set(selected.map(x=>x.title));
 return {theme:item?.theme||'Exploradores da Palavra',ageGroup:age,exercises:selected,answerKey:answers.filter(x=>selectedTitles.has(x.title)),curated:!!item,reference:data.reference};
}
window.MI_CREATIVE_WORKSHEETS=Object.freeze({activitySheet,cellWords,makeMaze,choose,collectionsCount:collections.length});
})();
