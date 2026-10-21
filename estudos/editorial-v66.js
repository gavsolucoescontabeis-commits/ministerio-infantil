/* Ministério Infantil V66 — novo compositor editorial (sem alterar preparação/voz/outros módulos) */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const parts=s=>String(s||'').split(/\n+/).map(x=>x.replace(/^\s*(?:[-•*]|\d+[).])\s*/,'').trim()).filter(Boolean);
const icon=(type)=>({'biblia':'📖','investigar':'🔎','acao':'🌱','fe':'🙏','jogo':'🧩'}[type]||'✨');
const ref='Gênesis 1:1–2:3';
const DAYS=[
 ['01','Luz e trevas','Deus disse: “Haja luz” e separou a luz das trevas.','Gênesis 1:3–5'],
 ['02','Céu e águas','Deus fez o firmamento e separou as águas.','Gênesis 1:6–8'],
 ['03','Terra e plantas','A terra seca apareceu; Deus fez surgir a vegetação.','Gênesis 1:9–13'],
 ['04','Luminares','Deus fez os luminares, para marcar tempos e dias.','Gênesis 1:14–19'],
 ['05','Aves e seres aquáticos','Deus criou as aves e os seres que vivem nas águas.','Gênesis 1:20–23'],
 ['06','Animais e humanidade','Deus criou animais terrestres e seres humanos à Sua imagem.','Gênesis 1:24–31']
];
const AS='./assets/estudos/';
const assets={
 lia:'lia_investigadora.webp',pipo:'pipo_aventureiro.webp',maya:'maya_fe.webp',
 capa:'criacao_capa.webp',paisagem:'criacao_natureza.webp',animais:'criacao_animais.webp',
 peixes:'criacao_peixes.webp',cuidado:'pipo_cuidado.webp',gratidão:'maya_gratidao.webp'
};
const image=(key,cls='',alt='Ilustração editorial da lição')=>assets[key]?'<img class="v66-art '+cls+'" src="'+AS+assets[key]+'" loading="eager" alt="'+esc(alt)+'">':'';
const tag=(s)=>'<span class="v66-tag">'+esc(s)+'</span>';
const lines=(n=2)=>'<div class="v66-lines">'+Array.from({length:n},()=>'<div></div>').join('')+'</div>';
const card=(title,body,cls='')=>'<section class="v66-card '+cls+'"><h3>'+title+'</h3>'+body+'</section>';
const para=(s)=>'<p>'+esc(s).replace(/\n/g,'<br>')+'</p>';
const promptCard=(q,n=2)=>card(esc(q),lines(n),'v66-prompt');
const typeBox=(label,items)=>card(esc(label),'<div class="v66-bullets">'+items.map(x=>'<label class="v66-check"><i></i><span>'+esc(x)+'</span></label>').join('')+'</div>');
const sheet=(category,title,content,options={})=>({category,title,content,theme:options.theme||'jade',subtitle:options.subtitle||'',cover:!!options.cover});
function wrap(page,i,total,lesson){
return '<article class="v66-sheet v66-'+page.category+(page.cover?' v66-cover':'')+' v66-theme-'+page.theme+'"><header class="v66-pagehead"><small>MINISTÉRIO INFANTIL · 4ª IEQ CURITIBA · '+esc(lesson.age)+'</small><h2>'+esc(page.title)+'</h2><p>'+esc(page.subtitle||lesson.reference)+'</p></header><div class="v66-pagebody">'+page.content+'</div><footer class="v66-foot"><span>CADERNO BÍBLICO · '+esc(lesson.title)+'</span><span>'+(i+1)+' / '+total+'</span></footer></article>';
}
const block=(title,text)=>card(esc(title),para(text));
function seededGrid(words){
 const size=13,grid=Array.from({length:size},()=>Array(size).fill('')),placements={};let seed=66;
 const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const dirs=[[0,1],[1,0],[1,1],[1,-1],[0,-1]];
 for(const word of words.slice().sort((a,b)=>b.length-a.length)){
  let ok=false;
  for(let i=0;i<1300&&!ok;i++){
   const [dr,dc]=dirs[Math.floor(rnd()*dirs.length)],row=Math.floor(rnd()*size),col=Math.floor(rnd()*size);
   const cells=[...word].map((_,j)=>[row+dr*j,col+dc*j]);
   if(cells.every(([r,c],j)=>r>=0&&c>=0&&r<size&&c<size&&(!grid[r][c]||grid[r][c]===word[j]))){
    cells.forEach(([r,c],j)=>grid[r][c]=word[j]);placements[word]=cells;ok=true;
   }
  }
 }
 const letters='ABCDEFGHILMNOPRSTUVZ';
 grid.forEach(row=>row.forEach((v,j)=>{if(!v)row[j]=letters[Math.floor(rnd()*letters.length)]}));
 return {grid,placements};
}
const WORDS=['DEUS','LUZ','TERRA','MAR','SOL','LUA','AVES','PEIXES','PLANTAS','VIDA'];
function buildCreation(d,age){
 const small=age<=7;
 const student=[];
 const hero='<div class="v66-cover-hero">'+image('capa','v66-cover-image','Cena ilustrada da criação com os três mascotes')+'</div>';
 student.push(sheet('child','A CRIAÇÃO','<div class="v66-cover-inner">'+hero+'<div class="v66-cover-intro"><span class="v66-kicker">Uma aventura para descobrir o início de tudo</span><h3>Deus criou todas as coisas</h3><p>“No princípio, criou Deus os céus e a terra.”</p><strong>Gênesis 1:1</strong><div class="v66-name">Nome: __________________________________<br>Data: ______ / ______ / __________</div></div></div>',{cover:true,theme:'sun',subtitle:ref}));
 student.push(sheet('child','OS DIAS DA CRIAÇÃO','<p class="v66-lead">Leia as pistas e observe como o relato bíblico apresenta cada etapa.</p><div class="v66-days">'+DAYS.map(day=>'<div class="v66-day"><b>DIA '+day[0]+'</b><div><strong>'+day[1]+'</strong><p>'+day[2]+'</p><small>'+day[3]+'</small></div></div>').join('')+'</div><div class="v66-day7"><strong>7º dia:</strong> Deus concluiu a obra, descansou e abençoou esse dia. <b>Gênesis 2:1–3</b></div><div class="v66-side-image">'+image('paisagem','','Paisagem natural ilustrada')+'</div>',{theme:'sky',subtitle:'Uma história bíblica, seis dias de criação e o sétimo dia de descanso'}));
 const scrambled=[4,0,5,3,2,1];
 student.push(sheet('child','INVESTIGAÇÃO BÍBLICA',
 '<div class="v66-split v66-split-large"><div>'+card('1. QUAL É A ORDEM?','<p>Numere os acontecimentos conforme Gênesis 1.</p><div class="v66-order">'+scrambled.map(i=>'<div><i></i><span>'+esc(DAYS[i][1])+'</span></div>').join('')+'</div>')+
 card('2. CONFIRA NA BÍBLIA','<p>Marque as afirmações que estão corretas.</p><div class="v66-bullets">'+[
 'A luz foi criada antes dos luminares.','Gênesis 1 menciona aviões.','O ser humano foi criado à imagem de Deus.','Os peixes e as aves aparecem no quinto dia.'].map(x=>'<label class="v66-check"><i></i><span>'+esc(x)+'</span></label>').join('')+'</div>')+
 '</div><div class="v66-mascot-rail">'+image('lia','','Investigadora observando pistas')+'<p>Procure as respostas na Palavra de Deus.</p></div></div>',{theme:'jade',subtitle:'Descubra, compare e confira o texto'}));
 student.push(sheet('child','ENIGMAS DA CRIAÇÃO','<p class="v66-lead">Leia cada pista. Consulte Gênesis 1 antes de escrever a resposta.</p><div class="v66-riddles">'+[
 ['Nasci no primeiro dia e fui separada das trevas. Quem sou?',''],
 ['Fomos criados para marcar os tempos e governar dia e noite. Quem somos?',''],
 ['Fomos criadas no quinto dia e voamos pelo céu. Quem somos?',''],
 ['Fomos criados à imagem de Deus. Quem somos?','']
 ].map((a,i)=>'<div class="v66-riddle"><span class="v66-riddle-n">'+(i+1)+'</span><p>'+a[0]+'</p>'+lines(1)+'</div>').join('')+'</div><div class="v66-two-images">'+image('animais','','Animais da criação')+image('peixes','','Peixes da criação')+'</div>',{theme:'orange',subtitle:'Quatro pistas, quatro descobertas'}));
 student.push(sheet('child','DESAFIOS PARA A VIDA','<div class="v66-challenges"><section class="v66-challenge">'+image('cuidado','v66-character-img','Aventureiro escolhendo cuidar da criação')+'<div><h3>CORAGEM PARA FAZER O BEM</h3><p>Na praça, algumas crianças deixaram embalagens no chão. O que é mais sábio fazer sem brigar?</p><div class="v66-options">'+['A. Fingir que não viu.','B. Jogar lixo também.','C. Recolher somente o que for seguro e orientar com respeito.','D. Gritar com todos.'].map(x=>'<label><i></i>'+esc(x)+'</label>').join('')+'</div></div></section><section class="v66-challenge v66-challenge-faith">'+image('gratidão','v66-character-img','Momento de gratidão diante da criação')+'<div><h3>PENSANDO COM FÉ</h3>'+[
 'O que a criação ensina sobre Deus?','Qual parte da criação mais desperta sua admiração?',
 'Qual atitude demonstra cuidado com o que Deus criou?'
 ].map(q=>'<div class="v66-reflect"><b>'+esc(q)+'</b>'+lines(2)+'</div>').join('')+'</div></section></div>',{theme:'pink',subtitle:'Coragem, sabedoria, gratidão e cuidado'}));
 const wd=seededGrid(WORDS);
 const board='<table class="v66-wordgrid"><tbody>'+wd.grid.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 student.push(sheet('child','MISSÃO CONCLUÍDA','<div class="v66-split"><section>'+card('CAÇA-PALAVRAS','<p>Encontre as dez palavras na grade.</p><div class="v66-wordlist">'+WORDS.map(w=>tag(w)).join('')+'</div>'+board,'v66-word-card')+'</section><section>'+card('NOSSA MISSÃO','<p>Observe algo da criação de Deus, faça um gesto de cuidado e compartilhe na próxima aula o que descobriu.</p>')+image('gratidão','v66-mission-photo','Momento de gratidão diante da natureza')+card('PARA GUARDAR','<p>“No princípio, criou Deus os céus e a terra.” <b>Gênesis 1:1</b></p>')+card('MINHA DESCOBERTA',lines(3))+'</section></div>',{theme:'sun',subtitle:'Um jogo, uma reflexão e uma missão para casa'}));
 const daysStory=DAYS.map((x,i)=>'DIA '+(i+1)+' — '+x[2]+' ('+x[3]+')').join('\n\n')+'\n\nSÉTIMO DIA — Deus concluiu a obra, descansou e abençoou o dia (Gênesis 2:1–3).';
 const goal='Compreender a ordem da criação e reconhecer que a criação revela o poder, a sabedoria e a bondade de Deus.';
 const teacher=[
 ['Objetivo',d.goal||goal],['Versículo-chave','Gênesis 1:1 — “No princípio, criou Deus os céus e a terra.”'],
 ['Contexto bíblico',d.context||'Gênesis abre a Bíblia apresentando Deus como Criador; o relato descreve a criação e a responsabilidade dada aos seres humanos.'],
 ['Roteiro para ensinar',d.story||daysStory],
 ['Sequência bíblica de apoio',d.story?'':daysStory],
 ['Perguntas para conversar',d.questions||'O que foi criado no primeiro dia? Em qual dia surgiram as plantas? O que significa ser criado à imagem de Deus?'],
 ['Dinâmica de 2 minutos',d.activity||'“Criado ou construído?”: compare árvore, peixe, estrela com casa, papel e livro. Explique a diferença.'],
 ['Aplicação prática',d.application||'Demonstre gratidão a Deus e responsabilidade ao cuidar da criação. A situação da praça é aplicação atual, não faz parte da narrativa bíblica.'],
 ['Missão única para casa','Observe algo da criação, pratique um gesto de cuidado e relate o aprendizado na próxima aula.'],
 ['Observação final','']
 ].filter(a=>a[1]);
 const answers=[
 ['Ordem da criação','Na ordem impressa: 5, 1, 6, 4, 3, 2.'],
 ['Investigação','Corretas: 1, 3 e 4. Incorreta: 2.'],
 ['Enigmas','1. Luz; 2. Luminares; 3. Aves; 4. Seres humanos.'],
 ['Coragem','Alternativa C. Alertar sobre objetos perigosos, evitar recolher resíduos cortantes e buscar ajuda adulta.'],
 ['Reflexão','Respostas pessoais coerentes com a passagem bíblica.'],
 ['Caça-palavras',WORDS.join(', ')+'.']
 ];
 // V66.4: versão compacta, somente atividades após a capa.
 const cover=student[0],investigation=student[2],riddle=student[3],life=student[4],mission=student[5];
 const cleanRiddle=riddle.content.split('<div class="v66-two-images">')[0];
 const investigationAndRiddles=sheet('child','INVESTIGAÇÃO E ENIGMAS',
  '<div class="v664-investigation">'+investigation.content+'</div>'+
  (small?'':'<div class="v664-riddles"><h3 class="v664-section-title">ENIGMAS DA CRIAÇÃO</h3>'+cleanRiddle+'</div>'),
  {theme:'jade',subtitle:'Investigue, organize e descubra'});
 const challenges=sheet('child','DESAFIOS E REFLEXÃO',life.content,
  {theme:'pink',subtitle:'Coragem, sabedoria, fé e cuidado'});
 const devot=card('TEMPO COM DEUS','<p>Leia Gênesis 1:1 e pense em algo pelo qual deseja agradecer a Deus.</p><p><b>Minha oração ou gratidão:</b></p>'+lines(2),'v664-devotional');
 const cleanedMission=mission.content.replace(image('gratidão','v66-mission-photo','Momento de gratidão diante da natureza'),'');
 const closing=sheet('child','MISSÃO CONCLUÍDA','<div class="v664-closing">'+cleanedMission+devot+'</div>',
  {theme:'sun',subtitle:'Caça-palavras, missão e versículo'});
 student.splice(0,student.length,cover,investigationAndRiddles,challenges,closing);
 if(small)teacher.push(['Adaptação pedagógica','Para crianças menores, faça leitura guiada e respostas orais. Não exigir análise longa por escrito.']);
 return {student,teacher,answers,curated:true};
}

/* V67: o mesmo projeto editorial vale para qualquer passagem, sem inventar acontecimentos.
   As cenas especiais só existem quando um pacote real de imagem foi preparado. */
function renderEducationalExercise(x,age){
 const title=esc(x.title||'Atividade bíblica'),prompt=esc(x.prompt||'Confira a passagem bíblica');
 let body='<p class="v67-exercise-lead">'+prompt+'</p>';
 const list=(xs,cls='v67-choices')=>'<div class="'+cls+'">'+xs.map((v,i)=>'<div class="v67-entry"><span class="v67-emptybox"></span><span>'+esc(v)+'</span></div>').join('')+'</div>';
 switch(x.type){
  case 'choice':body+=list(x.options||[]);break;
  case 'fill':body+='<div class="v67-word-bank">'+(x.words||[]).map(tag).join('')+'</div>'+lines(age<7?1:2);break;
  case 'match':
   body+='<div class="v67-match"><div>'+((x.left||[]).map(y=>'<div>'+esc(y)+'</div>').join(''))+'</div><div>'+((x.right||[]).map(y=>'<div>'+esc(y)+'</div>').join(''))+'</div></div>';
   break;
  case 'sequence':body+='<div class="v66-order">'+(x.items||[]).map(y=>'<div><i></i><span>'+esc(y)+'</span></div>').join('')+'</div>';break;
  case 'wordsearch':
   if(Array.isArray(x.grid)&&x.grid.length){body+='<div class="v67-wordlist">'+(x.words||[]).map(tag).join('')+'</div><table class="v66-wordgrid v67-wordgrid">'+x.grid.map(row=>'<tr>'+row.map(ch=>'<td>'+esc(ch)+'</td>').join('')+'</tr>').join('')+'</table>'}
   else body+=lines(2);
   break;
  case 'anagram':body+='<div class="v67-anagrams">'+(x.words||[]).map(w=>'<p>'+esc(w.mixed)+': ____________________</p>').join('')+'</div>';break;
  case 'maze':{
   const m=x.maze;
   if(m?.size&&Array.isArray(m.cells)){
    body+='<div class="v67-maze-instruction">Encontre o caminho da estrela até a Bíblia.</div><table class="v67-maze" aria-label="Labirinto com entrada e saída"><tbody>';
    for(let r=0;r<m.size;r++){
     body+='<tr>';
     for(let c=0;c<m.size;c++){
      const cell=m.cells[r*m.size+c]||{},style=[
       'border-top:'+(cell.n?'2px solid #2d6871':'2px solid transparent'),
       'border-right:'+(cell.e?'2px solid #2d6871':'2px solid transparent'),
       'border-bottom:'+(cell.s?'2px solid #2d6871':'2px solid transparent'),
       'border-left:'+(cell.w?'2px solid #2d6871':'2px solid transparent')
      ].join(';');
      body+='<td style="'+style+'">'+(r===0&&c===0?'★':r===m.size-1&&c===m.size-1?'📖':'')+'</td>';
     }
     body+='</tr>';
    }
    body+='</tbody></table>';
   }else body+=lines(2);
   break;
  }
  case 'reflect':case 'analysis':body+=lines(age<8?2:4);break;
  default:body+=lines(age<8?1:3);
 }
 return card(title,body,'v67-exercise v67-type-'+esc(x.type||'other'));
}
function generic(d,age){
 const group=age<7?'little':age<9?'early':age<10?'middle':age<13?'older':'teen';
 const mood=norm(d.title+' '+d.goal+' '+d.application);
 const primary=/corag|desafio|davi|vitoria|persever|luta/.test(mood)?'pipo':/fe|orac|confi|grat|esper|obedien/.test(mood)?'maya':'lia';
 const companion=primary==='lia'?'pipo':primary==='pipo'?'pipo':'maya';
 const topic=norm(d.title),eden=/adao|eva|jardim do eden/.test(topic)&&/genesis\s*[23]/.test(norm(d.reference));
 const lessonRef=esc(d.reference),lessonTitle=esc(d.title);
 const illustration=eden?'<div class="v67-eden-hero">'+image('lia','v67-eden-first','Investigadora em ambiente de descoberta')+image('maya','v67-eden-second','Personagem refletindo com fé')+'</div>':
 '<div class="v67-cover-art v67-cover-art-'+primary+'">'+image(primary,'v67-cover-character','Mascote em aventura de aprendizado')+'</div>';
 const cover=sheet('child',d.title.toUpperCase(),
  '<div class="v67-cover-container">'+illustration+
  '<div class="v67-cover-copy"><p class="v67-small-label">CADERNO DE ATIVIDADES BÍBLICAS</p><h3>'+lessonTitle+'</h3><p>Vamos investigar o que a Bíblia ensina!</p><strong>'+lessonRef+'</strong><div class="v66-name">Nome: ___________________________________ &nbsp; Data: ___ / ___ / ______</div></div></div>',
  {cover:true,theme:'sun',subtitle:d.reference+' · '+d.age});
 const creative=window.MI_CREATIVE_WORKSHEETS?.activitySheet?.(d);
 const exercises=(creative?.exercises||[]).slice(0,7),answerRows=(creative?.answerKey||[]).map(a=>[a.title||'Gabarito',a.answer||'']);
 const prompts=parts(d.questions).filter(v=>v.length>9).slice(0,4);
 const inquiry=exercises.filter(x=>['choice','fill','match','sequence'].includes(x.type));
 const games=exercises.filter(x=>['wordsearch','anagram','maze'].includes(x.type));
 const deep=exercises.filter(x=>['reflect','analysis'].includes(x.type));
 // Não suponha que uma pergunta gerada seja um fato bíblico; ancoragem no material preparado pelo professor.
 if(!inquiry.length)inquiry.push({type:'reflect',title:age<8?'Observe e conte':'Investigue na Bíblia',prompt:prompts[0]||'Qual acontecimento ou ensinamento você encontra nesta passagem?'});
 if(inquiry.length===1&&prompts.length>1)inquiry.push({type:'reflect',title:'Procure mais uma pista',prompt:prompts[1]});
 const inquiryContent='<div class="v67-content-with-scene"><div class="v67-exercise-stack">'+inquiry.slice(0,age<8?2:3).map(x=>renderEducationalExercise(x,age)).join('')+'</div>'+
 '<div class="v67-context-art">'+image('lia','','Explore as pistas na Bíblia')+'</div></div>';
 const page2=sheet('child',age<8?'OBSERVE E DESCUBRA':'INVESTIGAÇÃO BÍBLICA',inquiryContent,
  {theme:'jade',subtitle:'Atividades baseadas em '+d.reference});
 let p3Content='';
 if(games.length)p3Content=games.slice(0,age<9?1:2).map(x=>renderEducationalExercise(x,age)).join('');
 else if(deep.length)p3Content=deep.slice(0,2).map(x=>renderEducationalExercise(x,age)).join('');
 else p3Content=renderEducationalExercise({type:'reflect',title:'O que aprendi?',prompt:prompts[1]||'O que a passagem bíblica nos ensina?'},age);
 if(deep.length&&games.length) p3Content+='<div class="v67-short-reflect">'+renderEducationalExercise(deep[0],age)+'</div>';
 p3Content+='<div class="v67-illustrated-rail">'+image(companion,'','Apoio visual à atividade temática')+'</div>';
 const page3=sheet('child',age<8?'VAMOS BRINCAR E APRENDER':'DESAFIOS E DESCOBERTAS',p3Content,
  {theme:'orange',subtitle:'Jogos e pensamentos ligados à Palavra'});
 const mission=String(d.application||'Pratique uma atitude que combine com o ensinamento bíblico.').split(/\n/)[0].replace(/^COMPARAÇÃO ATUAL.*:/i,'').slice(0,210);
 const reflection=prompts.slice(0,age<8?1:2).map(q=>promptCard(q,age<8?1:2)).join('');
 const page4=sheet('child','MISSÃO E TEMPO COM DEUS',
  '<div class="v67-closing">'+card('MINHA DESCOBERTA',reflection||'<p>O que aprendi hoje?</p>'+lines(age<8?2:3))+
  card('UMA MISSÃO PARA CASA',para(mission))+
  card('TEMPO COM DEUS','<p>Leia ou relembre '+lessonRef+' e agradeça a Deus pelo que aprendeu.</p><p><b>Minha oração:</b></p>'+lines(2))+
  '<div class="v67-final-illustration">'+image('maya','','Apoio visual à reflexão')+'</div></div>',
  {theme:'pink',subtitle:'Uma missão prática, sem tarefas por dias da semana'});
 const teacher=[['Objetivo',d.goal||'Ler e compreender '+d.reference],['Contexto bíblico',d.context||'Consulte o texto bíblico completo.'],
 ['Roteiro da aula',d.story||'Leia '+d.reference+' com a turma e explique os acontecimentos ou ensinamentos registrados no texto.'],
 ['Perguntas para conversar',d.questions||'O que aprendemos com este texto?'],['Dinâmica',d.activity||'Compartilhe uma descoberta da leitura.'],
 ['Aplicação',d.application||'Converse sobre uma atitude coerente com a passagem.'],
 ['Missão para casa',mission]];
 const answers=answerRows.concat(d.answers?[['Gabarito preparado pelo professor',d.answers]]:[]);
 if(!answers.length)answers.push(['Questões abertas','Confira as respostas conforme o texto bíblico '+d.reference+'.']);
 return {student:[cover,page2,page3,page4],teacher,answers,curated:!!creative?.curated,theme:group};
}
function teacherPages(d,book){
 const units=[],threshold=3800;for(const [label,body0]of book.teacher){
  const body=String(body0||'').trim();if(!body)continue;
  if(body.length<900){units.push([label,body]);continue}
  let p=body.split(/\n\s*\n/).filter(Boolean),buf='';
  for(const chunk of p){
   if(buf.length+chunk.length>900&&buf){units.push([label+(units.some(x=>x[0].startsWith(label))?' (continuação)':''),buf]);buf=''}
   if(chunk.length>1100){const split=chunk.match(/.{1,900}(?:\s|$)/g)||[chunk];for(const c of split)units.push([label,c]);}
   else buf+=(buf?'\n\n':'')+chunk;
  }
  if(buf)units.push([label,buf]);
 }
 const packets=[];let packet=[],weight=0;
 for(const unit of units){let n=unit[1].length+unit[0].length;
 if(packet.length&&(weight+n>threshold||packet.length>=12)){packets.push(packet);packet=[];weight=0}
 packet.push(unit);weight+=n}
 if(packet.length)packets.push(packet);
 return packets.map((rows,i)=>sheet('teacher',i===0?'AULA DO PROFESSOR':'ROTEIRO DA AULA',rows.map(([name,value])=>card(esc(name),para(value))).join(''),{subtitle:d.reference+' · parte '+(i+1)+'/'+packets.length}));
}
function answerPages(d,book){
 const rows=book.answers.map(([name,value])=>card(esc(name),para(value)));
 const pages=[];for(let i=0;i<rows.length;i+=6)pages.push(sheet('key','GABARITO DO PROFESSOR',rows.slice(i,i+6).join(''),{subtitle:'Uso exclusivo do professor · '+d.reference}));
 return pages;
}
const previousEditor=window.MI_ESTUDOS_EDITORIAL || null;
let current=null,book=null,student=[],teachers=[],keys=[],view='child',page=0,printing=false,restore=null,usingPrevious=false;
function getAge(d){const t=String(d.age||'9'),n=Number(t.match(/\d+/)?.[0]||9);return /adolesc/i.test(t)?14:n;}
function render(){
 const host=$('miEditorial');if(!host||!book)return;
 let list=view==='child'?student:view==='teacher'?teachers:keys;
 page=Math.max(0,Math.min(page,list.length-1));
 const pages=printing?list:[list[page]];
 host.innerHTML='<div class="v66-frame"><div class="v66-screen-ui"><div class="v66-top"><div><small>ESTUDOS · PADRÃO EDITORIAL V66</small><h2>'+esc(current.title)+'</h2></div><span>'+esc(current.age)+'</span></div><div class="v66-tabs">'+[['child','Caderno da criança'],['teacher','Aula do professor'],['key','Gabarito']].map(([v,label])=>'<button type="button" data-v66-view="'+v+'" class="'+(view===v?'active':'')+'">'+label+'</button>').join('')+'</div></div><div class="v66-stage">'+pages.map((p,i)=>wrap(p,printing?i:page, list.length,current)).join('')+'</div><div class="v66-screen-ui v66-pager"><button type="button" data-v66-page="-1" '+(page===0?'disabled':'')+'>← Anterior</button><strong>'+(page+1)+' / '+list.length+'</strong><button type="button" data-v66-page="1" '+(page===list.length-1?'disabled':'')+'>Próxima →</button></div></div>';
 host.querySelectorAll('[data-v66-view]').forEach(b=>b.onclick=()=>{view=b.dataset.v66View;page=0;render()});
 host.querySelectorAll('[data-v66-page]').forEach(b=>b.onclick=()=>{page+=Number(b.dataset.v66Page);render()});
}
function mount(d){
 if(!d||!$('miEditorial'))return false;
 current=d;const creation=/criacao|deus criou|principio/.test(norm(d.title))&&/genesis\s*1/.test(norm(d.reference));
 // Sem pacote de arte bíblica revisado para outros temas, preservamos o editor V65.
 // Não publicar uma falsa aula ilustrada apenas reaproveitando mascotes.
 usingPrevious=false;
 book=creation&&getAge(d)===9?buildCreation(d,getAge(d)):generic(d,getAge(d));
 student=book.student;teachers=teacherPages(d,book);keys=answerPages(d,book);
 view='child';page=0;printing=false;document.body.classList.add('mi-editorial-ready','v66-ready');
 render();return true;
}
function beforePrint(kind){
 if(usingPrevious)return previousEditor?.beforePrint?.(kind);
 if(!book)return;restore={view,page};view=kind==='teacher'?'teacher':'child';page=0;printing=true;render();
 if(kind==='teacher'&&keys.length){const target=$('miEditorial .v66-stage')||document.querySelector('#miEditorial .v66-stage');if(target)target.insertAdjacentHTML('beforeend',keys.map((p,i)=>wrap(p,i,keys.length,current)).join(''))}
}
function afterPrint(){if(usingPrevious)return previousEditor?.afterPrint?.();if(!restore)return;({view,page}=restore);restore=null;printing=false;render()}
window.MI_ESTUDOS_EDITORIAL=Object.freeze({mount,beforePrint,afterPrint,version:'68.2',getPageCount:()=>({child:student.length,teacher:teachers.length,key:keys.length})});
})();