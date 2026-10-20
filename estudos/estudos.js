(()=>{'use strict';
/*
 * Ministério Infantil — Estudos (piloto independente)
 * Fonte bíblica externa: GetBible v2, tradução portuguesa Almeida 1911 (SWORD).
 * Não grava textos bíblicos no repositório nem coleta dados de crianças.
 * Rascunhos locais: localStorage do navegador, com exportação de backup.
 */
const API='https://api.getbible.net/v2/almeida';
const SAVE_KEY='mi_estudos_piloto_aulas_v1';
const LAST_READER='mi_estudos_piloto_leitura_v1';
const B=[
 ['Gênesis',50],['Êxodo',40],['Levítico',27],['Números',36],['Deuteronômio',34],
 ['Josué',24],['Juízes',21],['Rute',4],['1 Samuel',31],['2 Samuel',24],
 ['1 Reis',22],['2 Reis',25],['1 Crônicas',29],['2 Crônicas',36],['Esdras',10],
 ['Neemias',13],['Ester',10],['Jó',42],['Salmos',150],['Provérbios',31],
 ['Eclesiastes',12],['Cantares',8],['Isaías',66],['Jeremias',52],['Lamentações',5],
 ['Ezequiel',48],['Daniel',12],['Oséias',14],['Joel',3],['Amós',9],
 ['Obadias',1],['Jonas',4],['Miquéias',7],['Naum',3],['Habacuque',3],
 ['Sofonias',3],['Ageu',2],['Zacarias',14],['Malaquias',4],['Mateus',28],
 ['Marcos',16],['Lucas',24],['João',21],['Atos',28],['Romanos',16],
 ['1 Coríntios',16],['2 Coríntios',13],['Gálatas',6],['Efésios',6],['Filipenses',4],
 ['Colossenses',4],['1 Tessalonicenses',5],['2 Tessalonicenses',3],['1 Timóteo',6],['2 Timóteo',4],
 ['Tito',3],['Filemom',1],['Hebreus',13],['Tiago',5],['1 Pedro',5],
 ['2 Pedro',3],['1 João',5],['2 João',1],['3 João',1],['Judas',1],['Apocalipse',22]
].map(([name,chapters],i)=>({name,chapters,id:i+1}));
const THEMES=[
 {book:19,ch:23,v:1,title:'O cuidado do Bom Pastor',thought:'O cuidado de Deus pode orientar a maneira como acolhemos e protegemos as crianças.',prayer:'Senhor, ensina-nos a confiar no teu cuidado.'},
 {book:6,ch:1,v:9,title:'Coragem para obedecer',thought:'Deus encorajou Josué diante de uma grande responsabilidade. Como agir com coragem e obediência?',prayer:'Senhor, fortalece nossa coragem para fazer o que é correto.'},
 {book:41,ch:10,v:14,title:'Jesus recebe as crianças',thought:'Jesus ensinou seus discípulos a não impedir que as crianças se aproximassem dele.',prayer:'Jesus, ajuda-nos a acolher cada criança com amor.'},
 {book:43,ch:3,v:16,title:'O amor de Deus',thought:'A passagem aponta para o amor de Deus revelado em Jesus Cristo.',prayer:'Pai, obrigado pelo teu amor demonstrado em Jesus.'},
 {book:20,ch:3,v:5,title:'Confiar no Senhor',thought:'Quando não entendemos tudo, podemos buscar a direção de Deus.',prayer:'Senhor, ensina-nos a confiar em ti de coração.'},
 {book:40,ch:5,v:16,title:'Nossa luz diante das pessoas',thought:'O que fazemos também comunica o que aprendemos com Jesus.',prayer:'Senhor, ajuda-nos a praticar boas obras com humildade.'},
 {book:50,ch:4,v:6,title:'Falar com Deus em oração',thought:'Paulo ensina a apresentar a Deus nossas preocupações com oração e gratidão.',prayer:'Pai, ensina-nos a conversar contigo em todas as situações.'},
 {book:19,ch:119,v:105,title:'A Palavra ilumina o caminho',thought:'A Bíblia orienta os nossos passos e escolhas.',prayer:'Senhor, dá-nos disposição para conhecer tua Palavra.'},
 {book:27,ch:6,v:22,title:'Daniel confia em Deus',thought:'O relato de Daniel aponta para a fidelidade de Deus em meio à perseguição.',prayer:'Pai, fortalece nossa fidelidade mesmo nas dificuldades.'},
 {book:48,ch:5,v:22,title:'O fruto do Espírito',thought:'Como nossas atitudes podem demonstrar o caráter que o Espírito produz?',prayer:'Espírito Santo, transforma nossas atitudes.'},
 {book:23,ch:41,v:10,title:'Não tenha medo',thought:'Deus consola o seu povo em um contexto de temor e necessidade de ajuda.',prayer:'Senhor, dá-nos esperança e segurança em ti.'},
 {book:49,ch:6,v:1,title:'Honrar os pais',thought:'Paulo ensina as crianças sobre a obediência aos pais no Senhor.',prayer:'Pai, ajuda as famílias a crescerem em amor e respeito.'},
 {book:54,ch:4,v:12,title:'Um bom exemplo',thought:'Timóteo foi chamado a ser exemplo por sua conduta, mesmo sendo jovem.',prayer:'Jesus, ajuda-nos a ser exemplo em nossas palavras e atitudes.'},
 {book:59,ch:1,v:5,title:'Pedir sabedoria a Deus',thought:'Tiago encoraja os cristãos a buscarem sabedoria com fé.',prayer:'Senhor, dá-nos sabedoria ao ensinar as crianças.'},
 {book:40,ch:28,v:20,title:'Jesus está conosco',thought:'A promessa de Jesus acompanha a missão de ensinar aquilo que ele ordenou.',prayer:'Senhor, que o nosso ensino permaneça fiel às tuas palavras.'},
 {book:19,ch:46,v:1,title:'Deus é nosso refúgio',thought:'A linguagem do salmo oferece esperança em momentos de angústia.',prayer:'Pai, lembra-nos de buscar refúgio em ti.'},
 {book:40,ch:19,v:14,title:'A importância das crianças',thought:'Jesus afirmou o valor de receber e não impedir as crianças.',prayer:'Jesus, ensina-nos a respeitar e cuidar de cada criança.'},
 {book:9,ch:16,v:7,title:'Deus vê o coração',thought:'Na escolha de Davi, Deus chama atenção para algo além da aparência exterior.',prayer:'Senhor, ajuda-nos a olhar além das aparências.'},
 {book:45,ch:12,v:2,title:'Renovar a mente',thought:'Paulo nos chama a não simplesmente imitar padrões ao redor de nós.',prayer:'Deus, transforma nossa maneira de pensar.'},
 {book:20,ch:22,v:6,title:'Ensinar com responsabilidade',thought:'O ensino da criança exige atenção ao caminho e à responsabilidade de quem orienta.',prayer:'Pai, dá-nos responsabilidade ao orientar nossas crianças.'},
 {book:42,ch:15,v:4,title:'O pastor procura a ovelha',thought:'Jesus conta sobre o pastor que procura a ovelha perdida.',prayer:'Senhor, dá-nos um coração atento a quem precisa de cuidado.'},
 {book:2,ch:14,v:14,title:'O Senhor luta por seu povo',thought:'Moisés falou ao povo em um momento de medo diante do mar.',prayer:'Pai, ajuda-nos a confiar em tua direção nas dificuldades.'},
 {book:1,ch:1,v:1,title:'Deus é o Criador',thought:'O início de Gênesis apresenta Deus como o Criador de todas as coisas.',prayer:'Criador, ensina-nos a admirar e respeitar o mundo que fizeste.'},
 {book:62,ch:4,v:19,title:'Amar porque Deus amou',thought:'João apresenta o amor de Deus como fundamento da nossa resposta de amor.',prayer:'Senhor, ajuda-nos a demonstrar teu amor no dia a dia.'}
];
const $=id=>document.getElementById(id);
const norm=t=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g,' ');
const bookName=n=>B.find(b=>b.id===Number(n))?.name||('Livro '+n);
const dateNow=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const showDate=s=>{if(!s)return 'Sem data';const [y,m,d]=s.split('-');return [d,m,y].join('/')};
const state={view:'inicio',reader:{book:43,ch:3,selected:16,verses:[]},cadence:'daily',theme:null,lessons:[],editingId:null,readerRequest:0,devRequest:0,booksLoaded:false};
const chapterCache=new Map();
let toastTimer=0;
function toast(msg){const e=$('toast');e.textContent=String(msg);e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),3500)}
function stopAudio(){if('speechSynthesis'in window)window.speechSynthesis.cancel()}
function speak(text){if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window))return toast('A leitura em voz alta não está disponível neste navegador.');
 stopAudio();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='pt-BR';u.rate=.88;u.pitch=1;
 const voices=window.speechSynthesis.getVoices();const selected=voices.find(v=>v.lang.toLowerCase()==='pt-br')||voices.find(v=>v.lang.toLowerCase().startsWith('pt'));if(selected)u.voice=selected;
 window.speechSynthesis.speak(u);toast('Reproduzindo com a voz do dispositivo.');}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copiado!')}catch(e){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.top='-9999px';document.body.append(t);t.select();try{document.execCommand('copy');toast('Copiado!')}catch(x){toast('Não foi possível copiar neste navegador.')}t.remove()}}
function navigate(view){if(!['inicio','biblia','aulas','acervo'].includes(view))return;stopAudio();state.view=view;document.querySelectorAll('.page').forEach(n=>n.classList.toggle('active',n.id==='view-'+view));document.querySelectorAll('[data-view]').forEach(n=>{const active=n.dataset.view===view;n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});$('sidebar').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'smooth'});if(view==='biblia'&&!state.reader.verses.length)loadReader();if(view==='acervo')renderArchive();}
async function getChapter(book,ch){const key=book+'/'+ch;if(chapterCache.has(key))return chapterCache.get(key);
 const response=await fetch(API+'/'+Number(book)+'/'+Number(ch)+'.json',{cache:'default',headers:{'Accept':'application/json'}});if(!response.ok){if(response.status===429)throw Error('O serviço bíblico atingiu o limite de consultas. Tente novamente mais tarde.');throw Error('A fonte bíblica retornou erro '+response.status+'.')}
 const parsed=await response.json();if(!parsed||!Array.isArray(parsed.verses)||!parsed.verses.length)throw Error('A passagem não está disponível nesta tradução.');
 const verses=parsed.verses.map(v=>({verse:Number(v.verse),text:String(v.text||'').trim()})).filter(v=>Number.isSafeInteger(v.verse)&&v.verse>0&&v.text);
 if(!verses.length)throw Error('O capítulo está sem versículos disponíveis.');
 chapterCache.set(key,verses);return verses;
}
async function loadBookCatalogue(){
 try{
  const response=await fetch(API+'/books.json',{cache:'default'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const books=await response.json();if(!books||typeof books!=='object')throw Error('Índice indisponível');
  const published=new Set(Object.keys(books).map(Number));
  if(published.size<66)throw Error('O catálogo não contém todos os 66 livros esperados.');
  state.booksLoaded=true;
 }catch(e){console.warn('GetBible: não foi possível validar catálogo; usando identificação padrão dos 66 livros.',e)}
}
function renderBookControl(){const sel=$('bookSelect');sel.replaceChildren();
 for(const b of B){const o=new Option(b.name,String(b.id));sel.add(o)}sel.value=String(state.reader.book);renderChapters()}
function renderChapters(){const book=B[state.reader.book-1];const sel=$('chapterSelect');sel.replaceChildren();
 for(let n=1;n<=book.chapters;n++)sel.add(new Option('Capítulo '+n,String(n)));
 if(state.reader.ch>book.chapters)state.reader.ch=book.chapters;
 sel.value=String(state.reader.ch)}
function selectVerse(n,scroll=true){state.reader.selected=n;const list=$('versesContainer');list.querySelectorAll('.verse').forEach(e=>e.classList.toggle('selected',Number(e.dataset.verse)===n));
 $('verseSelect').value=n?String(n):'';const selected=list.querySelector('[data-verse="'+Number(n)+'"]');if(selected&&scroll)selected.scrollIntoView({behavior:'smooth',block:'center'});}
function renderVerses(){const verses=state.reader.verses;
 $('chapterHeading').textContent=bookName(state.reader.book)+' '+state.reader.ch;
 const container=$('versesContainer');container.replaceChildren();
 const dropdown=$('verseSelect');dropdown.replaceChildren(new Option('Capítulo completo',''));
 for(const v of verses){dropdown.add(new Option('Versículo '+v.verse,String(v.verse)));
  const el=document.createElement('div');el.className='verse';el.dataset.verse=String(v.verse);el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','Selecionar versículo '+v.verse);
  const nr=document.createElement('sup');nr.textContent=String(v.verse);el.append(nr,document.createTextNode(v.text));
  el.addEventListener('click',()=>selectVerse(v.verse,false));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectVerse(v.verse,false)}});container.append(el)}
 const exists=verses.some(v=>v.verse===state.reader.selected);selectVerse(exists?state.reader.selected:0,false);
 if(state.reader.selected)requestAnimationFrame(()=>selectVerse(state.reader.selected,true));
}
async function loadReader(){const request=++state.readerRequest;stopAudio();$('readerStatus').className='reader-status';$('readerStatus').textContent='Carregando '+bookName(state.reader.book)+' '+state.reader.ch+'...';$('versesContainer').replaceChildren();state.reader.verses=[];
 try{const verses=await getChapter(state.reader.book,state.reader.ch);if(request!==state.readerRequest)return;state.reader.verses=verses;renderVerses();$('readerStatus').textContent='Toque em um versículo para selecioná-lo. A leitura abaixo vem da Bíblia Almeida 1911.';try{localStorage.setItem(LAST_READER,JSON.stringify({book:state.reader.book,ch:state.reader.ch}))}catch(_){}}
 catch(e){if(request!==state.readerRequest)return;$('readerStatus').className='reader-status error';$('readerStatus').textContent='Não foi possível carregar a Bíblia on-line: '+e.message+' Verifique sua conexão e tente novamente.';}
}
function switchChapter(book,ch,verse=0){if(!B[Number(book)-1]||!Number.isInteger(Number(ch))||ch<1||ch>B[book-1].chapters)return toast('Capítulo não encontrado.');
 state.reader.book=Number(book);state.reader.ch=Number(ch);state.reader.selected=Number(verse)||0;
 $('bookSelect').value=String(book);renderChapters();$('chapterSelect').value=String(ch);navigate('biblia');loadReader()}
function adjChapter(direction){let b=state.reader.book,ch=state.reader.ch+direction;if(ch<1){b--;if(b<1)return toast('Você está no início da Bíblia.');ch=B[b-1].chapters}
 if(ch>B[b-1].chapters){b++;if(b>B.length)return toast('Você chegou ao último capítulo da Bíblia.');ch=1}switchChapter(b,ch)}
function parseReference(text){const source=String(text||'').trim().replace(/\s*:\s*/g,':');const match=source.match(/^(.+?)\s+(\d{1,3})(?:\s*:\s*(\d{1,3}))?(?:\s*[-–]\s*\d+)?$/u);
 if(!match)return null;
 const aliases={'salmo':'salmos','sal':'salmos','sl':'salmos','prov':'proverbios','pv':'proverbios','jo':'joao','joa':'joao','mc':'marcos','mt':'mateus','lc':'lucas','gn':'genesis','ex':'exodo','ef':'efesios','fl':'filipenses','ap':'apocalipse','1 cor':'1 corintios','2 cor':'2 corintios'};
 const search=norm(match[1]);const book=B.find(b=>norm(b.name)===(aliases[search]||search));
 if(!book)return null;const ch=Number(match[2]),verse=Number(match[3]||0);if(ch<1||ch>book.chapters||verse<0||verse>176)return null;return {book:book.id,ch,verse}}
function chapterSelectedText(){const verses=state.reader.verses;if(!verses.length)return '';
 const selected=verses.find(v=>v.verse===state.reader.selected);
 return selected?bookName(state.reader.book)+' '+state.reader.ch+':'+selected.verse+' — '+selected.text:
  bookName(state.reader.book)+' '+state.reader.ch+'\n'+verses.map(v=>v.verse+'  '+v.text).join('\n')}
function referenceSelected(){const base=bookName(state.reader.book)+' '+state.reader.ch;return state.reader.selected?base+':'+state.reader.selected:base}
function useReaderInLesson(){const ref=referenceSelected();$('lessonReference').value=ref;if(!$('lessonTitle').value.trim())$('lessonTitle').value='Estudo de '+ref;navigate('aulas');toast('Referência inserida na preparação da aula.')}
function todayUTCIndex(){const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)}
function themeIndex(){const d=new Date();const val=state.cadence==='weekly'?Math.floor(todayUTCIndex()/7):state.cadence==='monthly'?d.getFullYear()*12+d.getMonth():todayUTCIndex();return ((val%THEMES.length)+THEMES.length)%THEMES.length}
async function loadDevotional(){const request=++state.devRequest;const theme=THEMES[themeIndex()];state.theme=theme;const date=new Date();
 const dateText=date.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
 $('devPeriod').textContent=state.cadence==='daily'?'DEVOCIONAL DO DIA':state.cadence==='weekly'?'TEMA DA SEMANA':'TEMA DO MÊS';
 $('devDate').textContent=dateText;
 $('devTitle').textContent=theme.title;$('devReflection').textContent=theme.thought;$('devPrayer').textContent='Para orar: '+theme.prayer;
 $('devReference').textContent=bookName(theme.book)+' '+theme.ch+':'+theme.v;
 $('devVerse').textContent='Consultando o texto bíblico...';$('devListenBtn').disabled=true;
 try{const verses=await getChapter(theme.book,theme.ch);if(request!==state.devRequest)return;const v=verses.find(v=>v.verse===theme.v);
  if(!v)throw Error('Versículo não encontrado no capítulo.');
  $('devVerse').textContent=v.text;theme.text=v.text;$('devListenBtn').disabled=false;
 }catch(e){if(request!==state.devRequest)return;theme.text=null;$('devVerse').textContent='Não foi possível consultar o versículo agora. Use “Ler passagem” para tentar novamente.';}
}
function getLessonForm(){const read=id=>$(id).value.trim();return {
 id:state.editingId,title:read('lessonTitle'),date:read('lessonDate'),age:read('lessonAge'),reference:read('lessonReference'),
 goal:read('lessonGoal'),context:read('lessonContext'),story:read('lessonStory'),application:read('lessonApplication'),
 questions:read('lessonQuestions'),activity:read('lessonActivity'),prayer:read('lessonPrayer')
}}
function putLessonForm(x){const ids={lessonTitle:'title',lessonDate:'date',lessonAge:'age',lessonReference:'reference',lessonGoal:'goal',lessonContext:'context',lessonStory:'story',lessonApplication:'application',lessonQuestions:'questions',lessonActivity:'activity',lessonPrayer:'prayer'};
 for(const [id,key] of Object.entries(ids))$(id).value=x?.[key]??(id==='lessonDate'?dateNow():id==='lessonAge'?'9 anos':'');
 state.editingId=x?.id||null;$('lessonFeedback').textContent=state.editingId?'Editando preparação existente.':'Nova preparação — ainda não salva.'}
function loadLessons(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'[]');if(Array.isArray(raw))return raw.filter(isLesson).slice(0,500)}catch(e){console.warn('Falha na leitura dos rascunhos',e)}return []}
function isLesson(x){return !!(x&&typeof x==='object'&&!Array.isArray(x)&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.reference==='string'&&x.id.length<90&&x.title.length<=160&&x.reference.length<=90)}
function saveLessons(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state.lessons));return true}catch(e){toast('Não foi possível salvar. Verifique o armazenamento do dispositivo.');return false}}
function saveLesson(e){if(e)e.preventDefault();const data=getLessonForm();
 if(!data.title||!data.reference){toast('Informe o tema e a passagem bíblica para salvar.');return}
 const old=state.lessons.find(x=>x.id===data.id);data.id=old?.id||('aula-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));data.createdAt=old?.createdAt||new Date().toISOString();data.updatedAt=new Date().toISOString();
 const next=[data,...state.lessons.filter(x=>x.id!==data.id)].slice(0,500);
 const previous=state.lessons;state.lessons=next;if(!saveLessons()){state.lessons=previous;return}
 state.editingId=data.id;$('lessonFeedback').textContent='Preparação salva neste dispositivo em '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'.';
 toast('Aula salva neste navegador.');}
function lessonPrompt(){const x=getLessonForm();
 if(!x.title||!x.reference){toast('Preencha o tema e a referência bíblica antes de pedir a aula.');return null}
 const details=[['Objetivo',x.goal],['Contexto já anotado',x.context],['História já anotada',x.story],['Aplicação desejada',x.application],['Perguntas desejadas',x.questions],['Atividade sugerida',x.activity],['Encerramento',x.prayer]].filter(row=>row[1]).map(row=>row[0]+': '+row[1]).join('\n');
 return 'MESTRE BÍBLICA CRISTÃ EVANGÉLICA — MINISTÉRIO INFANTIL 4ª IEQ\n\n'+
 'Prepare uma aula bíblica cristã evangélica para crianças de '+x.age+'.\n'+
 'Tema: '+x.title+'\nPassagem principal: '+x.reference+'\n'+(x.date?'Data prevista: '+showDate(x.date)+'\n':'')+'\n'+
 'Confirme a referência e leia o texto bíblico antes de escrever. Seja fiel à narrativa, ao contexto histórico, à ordem dos acontecimentos, aos personagens e às quantidades mencionadas. '+
 'Não invente detalhes, ações, objetos ou falas. Use explicações simples e adequadas à faixa etária. '+
 'Quando o texto mencionar expressamente idades, inclua-as; caso contrário, não atribua idades. '+
 'Organize em história bíblica, ensinamento principal, perguntas, aplicação prática, dinâmica e oração final. '+
 'Não torne a aula extensa desnecessariamente. Não altere o sentido da Escritura.\n\n'+
 (details?('Anotações do professor, para considerar e verificar à luz do texto:\n'+details+'\n\n'):'')+
 'Forneça referências bíblicas para conferir os principais acontecimentos. Evite tratar reflexões criadas como se fossem versículos.';
}
function renderArchive(){const list=$('archiveList');list.replaceChildren();const lessons=[...state.lessons].sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
 $('archiveCount').textContent=lessons.length+' '+(lessons.length===1?'preparação salva':'preparações salvas');
 $('archiveEmpty').hidden=lessons.length>0;
 for(const x of lessons){const card=document.createElement('article');card.className='card archive-card';const header=document.createElement('div'),date=document.createElement('span');date.className='tag';date.textContent=x.date?showDate(x.date):'Sem data';header.append(date);card.append(header);
  const title=document.createElement('h3');title.textContent=x.title;const ref=document.createElement('p');ref.textContent=x.reference+' • '+(x.age||'Faixa etária não definida');
  const updated=document.createElement('p');updated.textContent='Alterada em '+new Date(x.updatedAt||Date.now()).toLocaleDateString('pt-BR');card.append(title,ref,updated);
  const bottom=document.createElement('footer');
  const edit=document.createElement('button');edit.className='primary-btn';edit.textContent='Continuar aula';edit.addEventListener('click',()=>{putLessonForm(x);navigate('aulas')});
  const dup=document.createElement('button');dup.className='soft-btn';dup.textContent='Duplicar';dup.addEventListener('click',()=>{putLessonForm({...x,id:null,title:x.title+' (cópia)'});navigate('aulas')});
  const del=document.createElement('button');del.className='small-btn archive-delete';del.textContent='Excluir';del.addEventListener('click',()=>{if(!confirm('Excluir esta preparação deste dispositivo? A exclusão não pode ser desfeita.'))return;const original=state.lessons;state.lessons=state.lessons.filter(i=>i.id!==x.id);if(!saveLessons())state.lessons=original;renderArchive()});
  bottom.append(edit,dup,del);card.append(bottom);list.append(card)}
}
function exportArchive(){if(!state.lessons.length)return toast('Não há aulas para exportar.');
 const data={kind:'ministerio-infantil-estudos',version:1,exportedAt:new Date().toISOString(),items:state.lessons};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ministerio-infantil-aulas-'+dateNow()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Backup de aulas gerado. Guarde o arquivo em local seguro.')}
async function importArchive(e){const file=e.target.files?.[0];if(!file)return;try{if(file.size>2_000_000)throw Error('O backup ultrapassa 2 MB.');
 const input=JSON.parse(await file.text());if(input?.kind!=='ministerio-infantil-estudos'||input?.version!==1||!Array.isArray(input.items))throw Error('Arquivo não é um backup válido de Estudos.');
 if(input.items.length>500||!input.items.every(isLesson))throw Error('O arquivo contém dados inválidos ou mais de 500 aulas.');
 const existing=new Set(state.lessons.map(x=>x.id));const added=input.items.filter(x=>!existing.has(x.id));const previous=state.lessons;state.lessons=[...added,...previous].slice(0,500);
 if(!saveLessons()){state.lessons=previous;return}renderArchive();toast(added.length+' aula(s) importada(s), sem substituir as existentes.');
 }catch(err){toast('Falha na importação: '+err.message)}finally{e.target.value=''}}
function init(){
 const now=new Date();$('todayLabel').textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});state.lessons=loadLessons();
 try{const saved=JSON.parse(localStorage.getItem(LAST_READER)||'{}');if(B[Number(saved.book)-1]&&Number(saved.ch)>0&&Number(saved.ch)<=B[saved.book-1].chapters){state.reader.book=Number(saved.book);state.reader.ch=Number(saved.ch);state.reader.selected=0}}catch(_){}
 renderBookControl();loadBookCatalogue();loadDevotional();putLessonForm(null);
 document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.view)));
 document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.open)));
 $('menuToggle').addEventListener('click',()=>{const opened=$('sidebar').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(opened))});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')$('sidebar').classList.remove('open')});
 document.querySelectorAll('[data-cadence]').forEach(btn=>btn.addEventListener('click',()=>{state.cadence=btn.dataset.cadence;document.querySelectorAll('[data-cadence]').forEach(b=>b.classList.toggle('selected',b===btn));stopAudio();loadDevotional()}));
 $('devReadBtn').addEventListener('click',()=>{const x=state.theme;if(x)switchChapter(x.book,x.ch,x.v)});
 $('devListenBtn').addEventListener('click',()=>{const x=state.theme;if(x?.text)speak(bookName(x.book)+' '+x.ch+', versículo '+x.v+'. '+x.text)});
 $('bookSelect').addEventListener('change',e=>switchChapter(Number(e.target.value),1));
 $('chapterSelect').addEventListener('change',e=>switchChapter(state.reader.book,Number(e.target.value)));
 $('verseSelect').addEventListener('change',e=>selectVerse(Number(e.target.value)||0));
 $('prevChapter').addEventListener('click',()=>adjChapter(-1));$('nextChapter').addEventListener('click',()=>adjChapter(1));
 $('refForm').addEventListener('submit',e=>{e.preventDefault();const r=parseReference($('refInput').value);if(!r){toast('Referência não reconhecida. Ex.: João 3:16 ou Salmos 23.');return}switchChapter(r.book,r.ch,r.verse)});
 $('readerListen').addEventListener('click',()=>{if(!state.reader.verses.length)return toast('Carregue a passagem primeiro.');speak(bookName(state.reader.book)+' '+state.reader.ch+'. '+state.reader.verses.map(v=>'Versículo '+v.verse+'. '+v.text).join(' '))});
 $('readerStop').addEventListener('click',stopAudio);
 $('copySelectedVerse').addEventListener('click',()=>{const t=chapterSelectedText();if(t)copy(t);else toast('A passagem ainda não está carregada.')});
 $('useSelectedVerse').addEventListener('click',useReaderInLesson);$('readFromLesson').addEventListener('click',useReaderInLesson);
 $('lessonForm').addEventListener('submit',saveLesson);$('newLesson').addEventListener('click',()=>{if(confirm('Iniciar uma preparação em branco? As alterações ainda não salvas serão descartadas.'))putLessonForm(null)});
 $('copyMasterPrompt').addEventListener('click',()=>{const prompt=lessonPrompt();if(prompt)copy(prompt)});
 $('printLesson').addEventListener('click',()=>window.print());$('acervoNew').addEventListener('click',()=>{putLessonForm(null);navigate('aulas')});
 $('exportArchive').addEventListener('click',exportArchive);$('importArchive').addEventListener('change',importArchive);
 window.addEventListener('beforeunload',stopAudio);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();