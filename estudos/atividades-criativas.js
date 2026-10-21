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
const choose=(data)=>{
 const title=norm(data.title),ref=norm(data.reference);
 return collections.find(x=>x.test.test(title)&&x.references.some(p=>p.test(ref)))||null;
};
const seededShuffle=(arr,seed)=>{let a=[...arr],v=seed>>>0;for(let i=a.length-1;i>0;i--){v=(v*1664525+1013904223)>>>0;const j=v%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const hash=s=>{let n=2166136261;for(const c of String(s)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0};
const cellWords=(words,seed)=>{
 const sorted=[...new Set(words.map(w=>norm(w).replace(/\s/g,'')).filter(w=>w.length>=3&&w.length<=10))].slice(0,5);
 const N=11,grid=Array.from({length:N},()=>Array(N).fill('')),placed=[];
 let v=seed>>>0;const roll=m=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v%m};
 for(const word of sorted){
  let found=false;
  for(let tries=0;tries<180&&!found;tries++){
   const vertical=roll(2)===1,reverse=roll(2)===1;
   const chars=reverse?[...word].reverse().join(''):word;
   const row=roll(N-(vertical?word.length:0)),col=roll(N-(vertical?0:word.length));
   if([...chars].every((c,i)=>{const rr=row+(vertical?i:0),cc=col+(vertical?0:i);return !grid[rr][cc]||grid[rr][cc]===c})){
    [...chars].forEach((c,i)=>{grid[row+(vertical?i:0)][col+(vertical?0:i)]=c});
    placed.push(word);found=true;
   }
  }
 }
 const letters='AEIOUBCDFGLMNPRSTV';for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!grid[r][c])grid[r][c]=letters[roll(letters.length)];
 return {grid,words:placed,answer:'Palavras: '+placed.join(', ')+'. Encontrá-las na horizontal ou vertical, nas duas direções.'};
};
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
   add({type:'fill',title:'Complete a Descoberta',prompt:item.fill.text,words:item.fill.answers.slice(0,1)},
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
  add({type:'reflect',title:older?'Missão da Semana':'Minha Escolha de Hoje',prompt:item.talk},'Resposta pessoal. A aplicação deve respeitar o ensinamento da passagem.');
 }else{
  // Fallback honesto: sem criar respostas sobre uma passagem não revisada.
  add({type:'reflect',title:'Detetive da Bíblia',prompt:'Leia a referência '+data.reference+' e anote duas palavras ou acontecimentos que realmente aparecem no texto.'},'Resposta aberta; conferir na Bíblia Livre, '+data.reference+'.');
  const puzzle=cellWords(['BIBLIA','JESUS','AMOR','DEUS','PAZ'],seed);
  if(!little)add({type:'wordsearch',title:'Palavras de Fé',prompt:'Encontre as palavras. Elas são um passatempo geral, não representam fatos adicionais da passagem.',grid:puzzle.grid,words:puzzle.words},puzzle.answer);
  add({type:'reflect',title:'Minha Missão',prompt:'Escreva ou desenhe uma atitude de cuidado que combina com o que você aprendeu.'},'Resposta pessoal. O professor verifica a relação com o texto estudado.');
 }
 // Para pequenos, priorizar tarefas curtas e desenho, sem sobrecarregar.
 const kinds=little?['choice','fill','reflect']:
  early?['choice','fill','match','reflect']:
  ['match','sequence','wordsearch','reflect'];
 const selected=kinds.map(kind=>exercises.find(x=>x.type===kind)).filter(Boolean);
 // Assuntos sem um bloco temático ainda recebem reflexão e um passatempo seguro.
 if(!selected.length)selected.push(...exercises.slice(0,3));
 const selectedTitles=new Set(selected.map(x=>x.title));
 return {theme:item?.theme||'Exploradores da Palavra',ageGroup:age,exercises:selected,answerKey:answers.filter(x=>selectedTitles.has(x.title)),curated:!!item,reference:data.reference};
}
window.MI_CREATIVE_WORKSHEETS=Object.freeze({activitySheet,cellWords,choose,collectionsCount:collections.length});
})();
