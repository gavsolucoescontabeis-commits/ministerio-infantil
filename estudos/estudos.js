(()=>{'use strict';
/*
 * Ministério Infantil — Estudos (piloto independente)
 * Fonte bíblica externa: GetBible v2, tradução portuguesa Almeida 1911 (SWORD).
 * Não grava textos bíblicos no repositório nem coleta dados de crianças.
 * Rascunhos locais: localStorage do navegador, com exportação de backup.
 */
const API_ROOT='https://api.getbible.net/v2';
const TRANSLATIONS=Object.freeze({livre:{label:'Bíblia Livre (BLIVRE)',heading:'BÍBLIA LIVRE • BLIVRE',attribution:'Bíblia Livre (BLIVRE) • Diego Santos, Mario Sérgio e Marco Teles • 2017 • CC BY 3.0 Brasil.'}});
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
const state={view:'inicio',translation:'livre',reader:{book:43,ch:3,selected:16,verses:[]},cadence:'daily',theme:null,lessons:[],editingId:null,readerRequest:0,devRequest:0,booksLoaded:false};
const chapterCache=new Map();
let toastTimer=0;
function toast(msg){const e=$('toast');e.textContent=String(msg);e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),3500)}
let speechGeneration=0;
let danielVoice=null;
function stopAudio(){
 speechGeneration++;
 if('speechSynthesis'in window)window.speechSynthesis.cancel();
 if($('readerListen'))updateListenLabel();
}
function refreshVoices(){
 if(!('speechSynthesis'in window)){danielVoice=null;return}
 const voices=window.speechSynthesis.getVoices();
 danielVoice=voices.find(v=>/\bdaniel\b/i.test(v.name)&&/^pt(?:-|$)/i.test(v.lang))||null;
}
function speakSeries(parts){
 if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){toast('A leitura não está disponível neste navegador.');return}
 refreshVoices();
 if(!danielVoice){toast('A voz Daniel não está disponível neste navegador. Não usamos outra voz automaticamente.');return}
 stopAudio();const current=++speechGeneration;
 const fragments=parts.map(x=>String(x||'').trim()).filter(Boolean);
 if(!fragments.length){toast('Não há texto disponível para leitura.');return}
 // Agrupar trechos curtos para evitar uma pausa artificial em cada versículo.
 const chunks=[];let buffer='';
 for(const part of fragments){if(buffer&&buffer.length+part.length>490){chunks.push(buffer);buffer=''}buffer+=(buffer?' ':'')+part}
 if(buffer)chunks.push(buffer);
 let index=0;
 const next=()=>{
  if(current!==speechGeneration||index>=chunks.length)return;
  const u=new SpeechSynthesisUtterance(chunks[index++]);
  u.voice=danielVoice;u.lang=danielVoice.lang||'pt-BR';u.rate=.97;u.pitch=1;
  u.onend=()=>{if(current===speechGeneration)next()};
  u.onerror=e=>{if(current===speechGeneration){if(e.error!=='canceled'&&e.error!=='interrupted')toast('Não foi possível continuar a leitura com Daniel.');stopAudio()}};
  try{window.speechSynthesis.speak(u)}catch(_){toast('A narração com Daniel não pôde iniciar.');stopAudio()}
 };
 next();toast('Lendo com a voz Daniel.');
}
function speak(text){speakSeries([text])}
function readerAudioParts(){
 const verses=state.reader.verses;
 const start=state.reader.selected&&verses.some(v=>v.verse===state.reader.selected)?state.reader.selected:verses[0]?.verse||1;
 return verses.filter(v=>v.verse>=start).map((v,i)=>(i===0?'Versículo '+v.verse+'. ':'')+v.text);
}
function updateListenLabel(){
 const btn=$('readerListen');if(!btn)return;
 const found=state.reader.verses.some(v=>v.verse===state.reader.selected);
 btn.textContent=found?'♫ Ouvir do Versículo '+state.reader.selected:'♫ Ouvir Capítulo';
}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copiado!')}catch(e){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.top='-9999px';document.body.append(t);t.select();try{document.execCommand('copy');toast('Copiado!')}catch(x){toast('Não foi possível copiar neste navegador.')}t.remove()}}
function navigate(view,skipReaderLoad=false){if(!['inicio','biblia','aulas','aula-pronta','acervo'].includes(view))return;stopAudio();state.view=view;document.querySelectorAll('.page').forEach(n=>n.classList.toggle('active',n.id==='view-'+view));document.querySelectorAll('[data-view]').forEach(n=>{const active=n.dataset.view===(view==='aula-pronta'?'aulas':view);n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});$('sidebar').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'smooth'});if(view==='biblia'&&!state.reader.verses.length&&!skipReaderLoad)loadReader();if(view==='acervo')renderArchive();}
async function getChapter(book,ch,translation=state.translation){const key=translation+'/'+book+'/'+ch;if(chapterCache.has(key))return chapterCache.get(key);
 const response=await fetch(API_ROOT+'/'+translation+'/'+Number(book)+'/'+Number(ch)+'.json',{cache:'default',headers:{'Accept':'application/json'}});if(!response.ok){if(response.status===429)throw Error('O serviço bíblico atingiu o limite de consultas. Tente novamente mais tarde.');throw Error('A fonte bíblica retornou erro '+response.status+'.')}
 const parsed=await response.json();if(!parsed||!Array.isArray(parsed.verses)||!parsed.verses.length)throw Error('A passagem não está disponível nesta tradução.');
 const verses=parsed.verses.map(v=>({verse:Number(v.verse),text:String(v.text||'').trim()})).filter(v=>Number.isSafeInteger(v.verse)&&v.verse>0&&v.text);
 if(!verses.length)throw Error('O capítulo está sem versículos disponíveis.');
 chapterCache.set(key,verses);return verses;
}
async function loadBookCatalogue(){
 try{
  const response=await fetch(API_ROOT+'/'+state.translation+'/books.json',{cache:'default'});
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
 $('verseSelect').value=n?String(n):'';updateListenLabel();const selected=list.querySelector('[data-verse="'+Number(n)+'"]');if(selected&&scroll)selected.scrollIntoView({behavior:'smooth',block:'center'});}
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
async function loadReader(){const request=++state.readerRequest;const translation=state.translation;stopAudio();$('readerStatus').className='reader-status';$('readerStatus').textContent='Carregando '+bookName(state.reader.book)+' '+state.reader.ch+'...';$('versesContainer').replaceChildren();state.reader.verses=[];
 try{const verses=await getChapter(state.reader.book,state.reader.ch,translation);if(request!==state.readerRequest)return;state.reader.verses=verses;renderVerses();$('readerStatus').textContent='Toque em um versículo para selecioná-lo. Você está lendo: '+TRANSLATIONS[translation].label+'.';try{localStorage.setItem(LAST_READER,JSON.stringify({book:state.reader.book,ch:state.reader.ch}))}catch(_){}}
 catch(e){if(request!==state.readerRequest)return;$('readerStatus').className='reader-status error';$('readerStatus').textContent='Não foi possível carregar a Bíblia on-line: '+e.message+' Verifique sua conexão e tente novamente.';}
}
function switchChapter(book,ch,verse=0){if(!B[Number(book)-1]||!Number.isInteger(Number(ch))||ch<1||ch>B[book-1].chapters)return toast('Capítulo não encontrado.');
 state.reader.book=Number(book);state.reader.ch=Number(ch);state.reader.selected=Number(verse)||0;
 $('bookSelect').value=String(book);renderChapters();$('chapterSelect').value=String(ch);navigate('biblia',true);loadReader()}
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
async function loadDevotional(){const request=++state.devRequest;const translation=state.translation;const theme=THEMES[themeIndex()];state.theme=theme;const date=new Date();
 const dateText=date.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
 $('devPeriod').textContent=state.cadence==='daily'?'DEVOCIONAL DO DIA':state.cadence==='weekly'?'TEMA DA SEMANA':'TEMA DO MÊS';
 $('devDate').textContent=dateText;
 $('devTitle').textContent=theme.title;$('devReflection').textContent=theme.thought;$('devPrayer').textContent='Para orar: '+theme.prayer;
 $('devReference').textContent=bookName(theme.book)+' '+theme.ch+':'+theme.v;
 $('devVerse').textContent='Consultando o texto bíblico...';$('devListenBtn').disabled=true;
 try{const verses=await getChapter(theme.book,theme.ch,translation);if(request!==state.devRequest)return;const v=verses.find(v=>v.verse===theme.v);
  if(!v)throw Error('Versículo não encontrado no capítulo.');
  $('devVerse').textContent=v.text;theme.text=v.text;$('devListenBtn').disabled=false;
 }catch(e){if(request!==state.devRequest)return;theme.text=null;$('devVerse').textContent='Não foi possível consultar o versículo agora. Use “Ler passagem” para tentar novamente.';}
}

/* Referências por assunto: catálogo editorial fixo, nunca seleção aleatória. */
let topicTimer=0,topicAutoRef=null;
const TOPICS=Array.isArray(window.MI_ESTUDOS_TOPICS)?window.MI_ESTUDOS_TOPICS:[];
const TOPIC_STOP=new Set('a as o os e em de da do dos das na no nas nos um uma uns umas para por com que quem onde quando qual quais quero queria ver falar sobre historia passagem jesus biblia biblico biblica texto estudo aula versiculo'.split(' '));
const TOPIC_SYNONYMS={
 virar:'transforma',virou:'transforma',vira:'transforma',transformando:'transforma',
 transformou:'transforma',transformar:'transforma',transformada:'transforma',converter:'transforma',
 converteu:'transforma',casamento:'bodas',casamentos:'bodas',casorio:'bodas',
 bodas:'bodas',andava:'andar',caminhava:'andar',caminhar:'andar',
 curar:'cura',curando:'cura',curou:'cura',curada:'cura',curado:'cura'
};
function searchWords(raw){
 return norm(raw).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean)
   .filter(w=>!TOPIC_STOP.has(w)&&w.length>=3).map(w=>TOPIC_SYNONYMS[w]||w);
}
function wordSimilar(a,b){
 if(a===b)return true;
 if(a.length>=7&&b.length>=7&&a.slice(0,7)===b.slice(0,7))return true;
 if(a.length>=5&&b.length>=5&&((a.endsWith('s')&&a.slice(0,-1)===b)||(b.endsWith('s')&&b.slice(0,-1)===a)))return true;
 return false;
}
function topicMatches(raw){
 const q=norm(raw);if(q.length<3)return [];
 const queryWords=searchWords(q);
 return TOPICS.map(topic=>{
  const aliases=[topic.title,...topic.aliases].map(norm);let score=0;
  for(const alias of aliases){
   if(q===alias){score=Math.max(score,160);continue}
   if(alias.startsWith(q)&&q.length>=4){score=Math.max(score,105);continue}
   if(q.startsWith(alias)&&alias.length>=5){score=Math.max(score,113);continue}
   if(alias.includes(q)&&q.length>=5){score=Math.max(score,94);continue}
   const words=searchWords(alias);if(!words.length||!queryWords.length)continue;
   let overlap=0;for(const qw of queryWords)if(words.some(aw=>wordSimilar(qw,aw)))overlap++;
   const shareQuery=overlap/queryWords.length;
   const shareAlias=overlap/words.length;
   if(overlap>=1&&((overlap===1&&queryWords.length===1)||shareQuery>=.6&&shareAlias>=.4)){
    const weight=(overlap===1?44:57)+Math.round(36*shareQuery+13*shareAlias)+Math.min(overlap,4);
    score=Math.max(score,weight);
   }
  }
  const combined=[...new Set(aliases.flatMap(searchWords))];
  if(queryWords.length>=2&&combined.length){
   const found=queryWords.filter(qw=>combined.some(aw=>wordSimilar(qw,aw))).length;
   if(found>=2&&found/queryWords.length>=.60)score=Math.max(score,55+Math.round(35*found/queryWords.length));
  }
  return {topic,score,exact:aliases.includes(q)};
 }).filter(x=>x.score>=45).sort((a,b)=>b.score-a.score||a.topic.title.localeCompare(b.topic.title,'pt-BR')).slice(0,7);
}
function fillTopicReference(ref){
 const parsed=parseReference(ref);if(!parsed){toast('Referência não reconhecida.');return}
 $('lessonReference').value=ref;topicAutoRef=ref;
 $('lessonReference').dispatchEvent(new Event('change',{bubbles:true}));
 toast('Passagem '+ref+' inserida na aula.');
}
function renderTopicSuggestions(){
 const input=$('lessonTitle'),container=$('topicSuggestions');const matches=topicMatches(input.value);
 container.replaceChildren();container.hidden=!input.value.trim()||norm(input.value).length<3;
 if(container.hidden)return;
 const head=document.createElement('div');head.className='topic-head';
 const label=document.createElement('strong');label.textContent=matches.length?'Passagens bíblicas sugeridas':'Nenhuma referência encontrada no catálogo';
 const badge=document.createElement('span');badge.className='topic-badge';badge.textContent=matches.length?'SUGESTÕES POR ASSUNTO':'BUSCA POR ASSUNTO';
 head.append(label,badge);container.append(head);
 if(!matches.length){
  const p=document.createElement('p');p.className='topic-help';p.textContent='Este assunto ainda não está no nosso catálogo. Informe uma referência manualmente ou procure na Bíblia on-line. Não sugerimos versículos aleatórios.';container.append(p);
  if(topicAutoRef&&$('lessonReference').value===topicAutoRef){$('lessonReference').value='';topicAutoRef=null}
  return;
 }
 const top=matches[0];
 if(top.exact&&(!$('lessonReference').value.trim()||$('lessonReference').value===topicAutoRef)){
  $('lessonReference').value=top.topic.references[0];topicAutoRef=top.topic.references[0];
 }
 for(const {topic,score} of matches){
  const block=document.createElement('div');block.className='topic-result';
  const title=document.createElement('div');title.className='topic-result-title';const strong=document.createElement('strong');strong.textContent=topic.title;
  const small=document.createElement('span');small.textContent=topic.note;title.append(strong,small);block.append(title);
  const refs=document.createElement('div');refs.className='topic-refs';
  for(const ref of topic.references){
   const btn=document.createElement('button');btn.type='button';btn.className='topic-ref-btn';
   btn.textContent=ref;btn.setAttribute('aria-label','Usar '+ref+' na preparação de aula');
   btn.addEventListener('click',()=>{fillTopicReference(ref);renderTopicSuggestions()});
   if($('lessonReference').value===ref)btn.classList.add('chosen');
   refs.append(btn);
  }
  block.append(refs);container.append(block);
 }
 const p=document.createElement('p');p.className='topic-help';p.textContent='As referências são sugestões de estudo. Leia o contexto antes de montar a aula; você pode alterar a passagem escolhida.';container.append(p);
}


/* Resultados diretos do texto bíblico: API GetBible Search v2, Almeida 1911.
 * A busca por sentido funciona via catálogo local, sem usar IA externa.
 * A busca textual devolve somente versículos efetivamente publicados na Bíblia.
 */
let scriptureSearchTimer=0,scriptureSearchRequest=0,scriptureAbort=null;
const scriptureSearchCache=new Map();
const BIBLE_SEARCH='https://search.getbible.net/v2';
function bibleSearchTerms(raw){
 const words=searchWords(raw);
 if(!words.length)return '';
 // Em frases completas, termos distintivos são mais úteis que verbos e conectivos.
 // A API por palavras não interpreta intenção; isso é função do catálogo de temas.
 const general=new Set(['transforma','fazendo','falando','querendo','milagre','historia','contando','ensinou','acontece','fez','fazer','tinha','estava','queria','andou','andar','cura']);
 const useful=words.filter(w=>!general.has(w));
 if(topicMatches(raw).length>0&&useful.length>2)return useful.slice(-2).join(' ');
 if(useful.length===1)return useful[0];
 if(useful.length<=3)return useful.join(' ');
 return useful.slice(-3).join(' ');
}
function clearBibleSearch(){clearTimeout(scriptureSearchTimer);scriptureSearchRequest++;if(scriptureAbort){scriptureAbort.abort();scriptureAbort=null}const el=$('scriptureSearchResults');if(el)el.replaceChildren()}
function showBibleSearchStatus(msg,busy=false){
 const el=$('scriptureSearchResults');if(!el)return;el.replaceChildren();if(!msg)return;
 const box=document.createElement('p');box.className='scripture-search-status'+(busy?' waiting':'');box.textContent=msg;el.append(box);
}
function renderBibleSearch(data,term){
 const el=$('scriptureSearchResults');if(!el)return;el.replaceChildren();
 const matches=Array.isArray(data?.matches)?data.matches:[];
 const heading=document.createElement('div');heading.className='topic-head';
 const title=document.createElement('strong');title.textContent='Versículos Encontrados na Bíblia';
 const pill=document.createElement('span');pill.className='topic-badge';pill.textContent='PESQUISA NO TEXTO BÍBLICO';heading.append(title,pill);el.append(heading);
 if(!matches.length){const p=document.createElement('p');p.className='topic-help';p.textContent='Não foram encontrados versículos contendo “'+term+'” nesta tradução. Isso não significa que a história não exista; confira os assuntos relacionados acima.';el.append(p);return}
 const description=document.createElement('p');description.className='topic-help';description.textContent='Ocorrências reais da palavra ou expressão “'+term+'”. O sentido deve ser conferido no capítulo completo.';el.append(description);
 let added=0;
 for(const m of matches){
  if(!Number.isInteger(m.book_nr)||!B[m.book_nr-1]||!Number.isInteger(m.chapter)||!Number.isInteger(m.verse))continue;
  const reference=bookName(m.book_nr)+' '+m.chapter+':'+m.verse;
  let verseText='';
  const results=data.results&&typeof data.results==='object'?Object.values(data.results):[];
  for(const chapter of results){
   if(Number(chapter.book_nr)===m.book_nr&&Number(chapter.chapter)===m.chapter){
    verseText=String((chapter.verses||[]).find(v=>Number(v.verse)===m.verse)?.text||'').trim();break
   }
  }
  const box=document.createElement('div');box.className='scripture-search-hit';
  const ref=document.createElement('strong');ref.textContent=reference;
  const content=document.createElement('p');content.textContent=verseText.length>270?verseText.slice(0,267)+'…':verseText;
  const actions=document.createElement('div');actions.className='scripture-hit-actions';
  const use=document.createElement('button');use.type='button';use.textContent='Usar na Aula';use.className='topic-ref-btn';use.addEventListener('click',()=>fillTopicReference(reference));
  const read=document.createElement('button');read.type='button';read.textContent='Ler no Contexto ↗';read.className='soft-btn';read.addEventListener('click',()=>switchChapter(m.book_nr,m.chapter,m.verse));
  actions.append(use,read);box.append(ref,content,actions);el.append(box);
  if(++added>=8)break;
 }
 if(!added)showBibleSearchStatus('A fonte retornou resultados sem referências reconhecíveis. Tente outra busca.');
}
async function bibleWordSearch(raw){
 const token=++scriptureSearchRequest;const term=bibleSearchTerms(raw);
 if(term.length<3){showBibleSearchStatus('Digite ao menos três letras de uma palavra bíblica para pesquisar.');return}
 if(scriptureAbort)scriptureAbort.abort();
 scriptureAbort=typeof AbortController==='function'?new AbortController():null;
 showBibleSearchStatus('Buscando ocorrências no texto bíblico...',true);
 const searchKey=state.translation+'/'+term;if(scriptureSearchCache.has(searchKey)){if(token===scriptureSearchRequest)renderBibleSearch(scriptureSearchCache.get(searchKey),term);return}
 const url=BIBLE_SEARCH+'/'+state.translation+'?'+new URLSearchParams({q:term,words:'all',sort:'relevance',limit:'8',diacritics:'fold'}).toString();
 try{
  const response=await fetch(url,{headers:{Accept:'application/json'},signal:scriptureAbort?.signal});
  if(!response.ok)throw Error('Código '+response.status);
  const body=await response.json();
  if(!body||!Array.isArray(body.matches))throw Error('Resposta inesperada da fonte bíblica.');
  if(token!==scriptureSearchRequest)return;
  scriptureSearchCache.set(searchKey,body);renderBibleSearch(body,term);
 }catch(e){if(token!==scriptureSearchRequest||e.name==='AbortError')return;showBibleSearchStatus('A pesquisa por palavras está temporariamente indisponível. As sugestões por assunto continuam funcionando.')}
}
function planScriptureSearch(){
 clearTimeout(scriptureSearchTimer);
 if(scriptureAbort){scriptureAbort.abort();scriptureAbort=null}
 scriptureSearchRequest++;
 const q=$('lessonTitle').value.trim();
 if(norm(q).length<3){showBibleSearchStatus('');return}
 scriptureSearchTimer=setTimeout(()=>bibleWordSearch(q),700);
}

/* Assistente editorial: sugestões explícitas e revisáveis; sem integração de IA externa. */
let lessonSuggestRequest=0,lessonSuggestVariants=null,lessonChoiceIndices={},previewLessonId=null;
const LESSON_FIELDS=Object.freeze({
 goal:['lessonGoal','Objetivo da Aula'],
 context:['lessonContext','Contexto Bíblico e Histórico'],
 story:['lessonStory','História Bíblica Explicada'],
 application:['lessonApplication','Aplicação Prática'],
 questions:['lessonQuestions','Perguntas para Conversar'],
 activity:['lessonActivity','Atividade, Dinâmica e Ilustração'],
 prayer:['lessonPrayer','Encerramento e Oração']
});
function selectedAge(){
 const age=$('lessonAge').value;
 return age==='Outra faixa etária'?$('lessonAgeCustom').value.trim():age;
}
function syncCustomAge(){
 const enabled=$('lessonAge').value==='Outra faixa etária';
 $('customLessonAgeWrap').hidden=!enabled;
 $('lessonAgeCustom').required=enabled;
}
function clearLessonSuggestions(){
 lessonSuggestRequest++;lessonSuggestVariants=null;lessonChoiceIndices={};
 const panel=$('lessonSuggestionPanel');
 if(panel){panel.hidden=true;$('lessonSuggestionOptions').replaceChildren()}
 if($('storyAgeNotice'))$('storyAgeNotice').textContent=''
}
function updateChosenLessonOptions(){
 const selected=Object.keys(lessonChoiceIndices).length;
 const status=$('lessonChoicesStatus');if(status)status.textContent=selected+' de '+Object.keys(LESSON_FIELDS).length+' partes com uma opção escolhida.';
 document.querySelectorAll('.lesson-suggestion-option').forEach(el=>{
  const field=el.dataset.field;const index=Number(el.dataset.optionIndex);
  const active=lessonChoiceIndices[field]===index;
  el.classList.toggle('chosen',active);
  const button=el.querySelector('button');
  if(button){button.textContent=active?'✓ Opção Escolhida':'Escolher Esta Opção';button.setAttribute('aria-pressed',String(active))}
 });
}
function applyLessonSuggestion(field,index){
 const values=lessonSuggestVariants?.[field];if(!Array.isArray(values)||!values[index])return;
 const [id,label]=LESSON_FIELDS[field]||[];const input=$(id);if(!input)return;
 if(input.value.trim()&&input.value.trim()!==values[index]&&!confirm('Substituir o conteúdo atual de "'+label+'"?'))return;
 if(field==='questions'&&Array.isArray(lessonSuggestVariants.answerKey)){
  const answer=lessonSuggestVariants.answerKey[index]||'';
  const previous=$('lessonAnswers').value.trim();
  if(previous&&previous!==answer&&!confirm('Atualizar também o Gabarito do Professor para corresponder às perguntas escolhidas?'))return;
  $('lessonAnswers').value=answer;
 }
 input.value=values[index];input.dispatchEvent(new Event('input',{bubbles:true}));
 lessonChoiceIndices[field]=index;updateChosenLessonOptions();
 toast('Opção escolhida para '+label+'. Continue escolhendo ou clique em Montar Aula e Visualizar.');
}
function renderLessonSuggestionVariants(reference){
 const panel=$('lessonSuggestionPanel'),container=$('lessonSuggestionOptions');
 container.replaceChildren();lessonChoiceIndices={};
 for(const [field,[id,label]] of Object.entries(LESSON_FIELDS)){
  const values=lessonSuggestVariants[field]||[];
  const details=document.createElement('details');details.className='lesson-suggestion-group';details.open=field==='goal';
  const summary=document.createElement('summary');summary.textContent=label+' · '+values.length+' Opções';details.append(summary);
  for(const [index,value] of values.entries()){
   const item=document.createElement('div');item.className='lesson-suggestion-option';item.dataset.field=field;item.dataset.optionIndex=String(index);
   const marker=document.createElement('strong');marker.textContent='Opção '+(index+1);
   const text=document.createElement('p');text.textContent=value;
   const button=document.createElement('button');button.type='button';button.className='soft-btn';
   button.textContent='Escolher Esta Opção';button.setAttribute('aria-pressed','false');
   button.addEventListener('click',()=>applyLessonSuggestion(field,index));
   item.append(marker,text,button);details.append(item);
  }
  container.append(details);
 }
 panel.hidden=false;updateChosenLessonOptions();
 const kind=lessonSuggestVariants?.meta?.narrativeMode;
 const age=selectedAge();
 $('storyAgeNotice').textContent=kind==='narrative'?
  'História narrada e comparações do cotidiano preparadas para '+age+'. São sugestões editoriais; confira sempre os acontecimentos na Bíblia.':
  'Leitura Bíblica Guiada preparada para '+age+'. Esta passagem ainda não tem roteiro narrativo revisado; o aplicativo não inventa acontecimentos.';
 $('lessonFeedback').textContent='Sugestões preparadas para '+age+' com base em '+reference+'. Escolha suas opções e clique em Montar Aula e Visualizar.';
 panel.scrollIntoView({behavior:'smooth',block:'start'});
}
async function createLessonSuggestions(){
 const title=$('lessonTitle').value.trim(),reference=$('lessonReference').value.trim(),age=selectedAge();
 if(!title||!reference){toast('Informe o Tema da Aula e a Passagem Bíblica Principal antes de pedir sugestões.');return}
 if(!age){toast('Informe a idade ou faixa etária das crianças.');$('lessonAgeCustom').focus();return}
 const found=parseReference(reference);if(!found){toast('A referência bíblica informada não foi reconhecida. Ex.: João 2:1-11.');return}
 const match=reference.match(/:\s*(\d{1,3})\s*[-–]\s*(\d{1,3})\s*$/u);
 const first=found.verse||1;const last=match?Number(match[2]):found.verse||999;
 if(last<first){toast('Confira o intervalo de versículos.');return}
 const current=++lessonSuggestRequest;const button=$('generateLessonSuggestions');button.disabled=true;button.textContent='Consultando a Bíblia...';
 try{
  const passage=await getChapter(found.book,found.ch,'livre');
  if(current!==lessonSuggestRequest)return;
  const engine=window.MI_LESSON_SUGGESTIONS;
  if(!engine||typeof engine.generate!=='function')throw Error('Serviço de sugestões indisponível.');
  lessonSuggestVariants=engine.generate({title,reference,age,verses:passage,firstVerse:first,lastVerse:last});
  renderLessonSuggestionVariants(reference);
 }catch(error){if(current!==lessonSuggestRequest)return;toast('Não foi possível sugerir aula: '+error.message)}
 finally{button.disabled=false;button.textContent='✦ Sugerir Aula'}
}
function fillEmptyLessonFields(){
 if(!lessonSuggestVariants)return;
 let applied=0;
 for(const [field,[id]] of Object.entries(LESSON_FIELDS)){
  if(!$(id).value.trim()&&lessonSuggestVariants[field]?.[0]){
   $(id).value=lessonSuggestVariants[field][0];lessonChoiceIndices[field]=0;applied++;
   if(field==='questions'&&!$('lessonAnswers').value.trim())$('lessonAnswers').value=lessonSuggestVariants.answerKey?.[0]||'';
  }
 }
 updateChosenLessonOptions();
 toast(applied?applied+' campo(s) vazio(s) preenchido(s). Clique em Montar Aula e Visualizar para finalizar.':'Nenhum campo vazio. Escolha uma opção específica para substituir o texto.');
}
function getLessonForm(){const read=id=>$(id).value.trim();return {
 id:state.editingId,title:read('lessonTitle'),date:read('lessonDate'),age:selectedAge(),reference:read('lessonReference'),
 goal:read('lessonGoal'),context:read('lessonContext'),story:read('lessonStory'),application:read('lessonApplication'),
 questions:read('lessonQuestions'),answers:read('lessonAnswers'),activity:read('lessonActivity'),prayer:read('lessonPrayer')
}}
function putLessonForm(x){
 const ids={lessonTitle:'title',lessonDate:'date',lessonReference:'reference',lessonGoal:'goal',lessonContext:'context',lessonStory:'story',lessonApplication:'application',lessonQuestions:'questions',lessonAnswers:'answers',lessonActivity:'activity',lessonPrayer:'prayer'};
 for(const [id,key] of Object.entries(ids))$(id).value=x?.[key]??(id==='lessonDate'?dateNow():'');
 const chosenAge=String(x?.age||'9 anos');
 const known=['9 anos','4 a 6 anos','7 a 8 anos','10 a 12 anos','Adolescentes','Outra faixa etária'];
 $('lessonAge').value=known.includes(chosenAge)?chosenAge:'Outra faixa etária';
 $('lessonAgeCustom').value=known.includes(chosenAge)?'':chosenAge;
 syncCustomAge();
 state.editingId=x?.id||null;clearLessonSuggestions();topicAutoRef=null;
 $('topicSuggestions').hidden=true;$('topicSuggestions').replaceChildren();clearBibleSearch();
 $('lessonFeedback').textContent=state.editingId?'Editando preparação existente.':'Nova preparação — ainda não salva.';
}
function loadLessons(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'[]');if(Array.isArray(raw))return raw.filter(isLesson).slice(0,500)}catch(e){console.warn('Falha na leitura dos rascunhos',e)}return []}
function isLesson(x){return !!(x&&typeof x==='object'&&!Array.isArray(x)&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.reference==='string'&&x.id.length<90&&x.title.length<=160&&x.reference.length<=90)}
function saveLessons(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state.lessons));return true}catch(e){toast('Não foi possível salvar. Verifique o armazenamento do dispositivo.');return false}}
function persistLesson(){
 const data=getLessonForm();
 if(!data.title||!data.reference){toast('Informe o Tema e a Passagem Bíblica Principal para concluir a aula.');return null}
 if(!data.age){toast('Informe a idade ou faixa etária antes de salvar.');return null}
 const old=state.lessons.find(x=>x.id===data.id);
 data.id=old?.id||('aula-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));
 data.createdAt=old?.createdAt||new Date().toISOString();data.updatedAt=new Date().toISOString();
 const next=[data,...state.lessons.filter(x=>x.id!==data.id)].slice(0,500);
 const previous=state.lessons;state.lessons=next;
 if(!saveLessons()){state.lessons=previous;return null}
 state.editingId=data.id;return data;
}
function saveLesson(e){
 if(e)e.preventDefault();
 const data=persistLesson();if(!data)return;
 $('lessonFeedback').textContent='Rascunho salvo neste navegador às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'. Clique em Montar Aula e Visualizar para conferir a versão final.';
 toast('Rascunho salvo. Use Montar Aula e Visualizar para ver a aula pronta.');
}
function renderReadyLesson(data){
 $('readyLessonTitle').textContent=data.title;
 const meta=$('readyLessonMeta');meta.replaceChildren();
 for(const value of [data.reference,data.age,data.date?showDate(data.date):'']){
  if(!value)continue;const badge=document.createElement('span');badge.textContent=value;meta.append(badge);
 }
 const container=$('readyLessonSections');container.replaceChildren();
 for(const [field,[id,label]] of Object.entries(LESSON_FIELDS)){
  const value=String(data[field]||'').trim();
  if(!value)continue;
  const section=document.createElement('section');section.className='ready-section';
  const head=document.createElement('h3');head.textContent=label;
  const content=document.createElement('div');content.className='ready-section-text';content.textContent=value;
  section.append(head,content);container.append(section);
 }
 if(!container.children.length){
  const p=document.createElement('p');p.className='ready-empty';p.textContent='Nenhum conteúdo de aula foi incluído. Volte à preparação, selecione sugestões ou escreva nos campos.';container.append(p);
 }
 const key=String(data.answers||'').trim();
 $('readyAnswersSection').hidden=!key;
 $('readyAnswersText').textContent=key;
 renderPrintableWorksheet(data);
}
function renderPrintableWorksheet(data){
 const generator=window.MI_PRINTABLE_ACTIVITIES;
 if(!generator||typeof generator.worksheetFor!=='function'){toast('As atividades ilustradas não foram carregadas. Atualize a página.');return}
 const worksheet=generator.worksheetFor(data);
 $('worksheetTitle').textContent=worksheet.title;
 $('worksheetReference').textContent='Passagem Bíblica: '+worksheet.reference+' • '+worksheet.age;
 // A ilustração SVG é uma das figuras estáticas do módulo, nunca texto recebido do usuário.
 $('worksheetArt').innerHTML=worksheet.artwork.svg;
 const tasks=$('worksheetTasks');tasks.replaceChildren();
 worksheet.prompts.forEach((prompt,index)=>{
  const block=document.createElement('section');block.className='worksheet-task';
  const question=document.createElement('h3');question.textContent=(index+1)+'. '+prompt;
  block.append(question);
  if(index>0&&index<worksheet.prompts.length-1){
   const lines=document.createElement('div');lines.className='worksheet-answer-lines';
   const lineCount=worksheet.group==='little'?1:worksheet.group==='early'?2:3;
   for(let i=0;i<lineCount;i++){const line=document.createElement('div');line.className='worksheet-answer-line';lines.append(line)}
   block.append(lines);
  }
  tasks.append(block);
 });
 $('readyWorksheetAdvice').hidden=false;
 $('readyWorksheetTeacherHint').textContent=worksheet.teacherHint;
}
function openReadyLesson(data){
 previewLessonId=data.id;renderReadyLesson(data);navigate('aula-pronta');
}
function assembleLesson(){
 if(!$('lessonTitle').value.trim()||!$('lessonReference').value.trim()){
  toast('Informe o Tema da Aula e a Passagem Bíblica Principal antes de montar.');return
 }
 const parts=Object.values(LESSON_FIELDS).filter(([id])=>$(id).value.trim()).length;
 if(!parts){toast('Escolha ao menos uma sugestão ou preencha algum campo antes de montar a aula.');return}
 const lesson=persistLesson();if(!lesson)return;
 $('lessonFeedback').textContent='Aula montada e salva neste dispositivo. Você pode retornar e editar.';
 openReadyLesson(lesson);
 toast('Aula montada e salva. Agora é possível revisar e imprimir.');
}
function editReadyLesson(){
 const lesson=state.lessons.find(x=>x.id===previewLessonId);
 if(lesson)putLessonForm(lesson);
 navigate('aulas');
}
function printReadyLesson(kind='teacher'){
 if(state.view!=='aula-pronta'){toast('Abra primeiro a visualização da aula pronta.');return}
 document.body.dataset.miPrint=kind==='student'?'student':'teacher';
 const done=()=>{if(document.body.dataset.miPrint===kind)delete document.body.dataset.miPrint};
 window.addEventListener('afterprint',done,{once:true});
 try{window.print()}catch(e){done();toast('Não foi possível abrir a impressão neste navegador.')}
}
function lessonPrompt(){const x=getLessonForm();
 if(!x.title||!x.reference){toast('Preencha o tema e a referência bíblica antes de pedir a aula.');return null}
 const details=[['Objetivo',x.goal],['Contexto já anotado',x.context],['História já anotada',x.story],['Aplicação desejada',x.application],['Perguntas desejadas',x.questions],['Atividade sugerida',x.activity],['Encerramento',x.prayer]].filter(row=>row[1]).map(row=>row[0]+': '+row[1]).join('\n');
 return 'SUGESTÃO DE AULA — MINISTÉRIO INFANTIL 4ª IEQ\n\n'+
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
  const view=document.createElement('button');view.className='soft-btn';view.textContent='Visualizar Aula';view.addEventListener('click',()=>openReadyLesson(x));
  const dup=document.createElement('button');dup.className='soft-btn';dup.textContent='Duplicar';dup.addEventListener('click',()=>{putLessonForm({...x,id:null,title:x.title+' (cópia)'});navigate('aulas')});
  const del=document.createElement('button');del.className='small-btn archive-delete';del.textContent='Excluir';del.addEventListener('click',()=>{if(!confirm('Excluir esta preparação deste dispositivo? A exclusão não pode ser desfeita.'))return;const original=state.lessons;state.lessons=state.lessons.filter(i=>i.id!==x.id);if(!saveLessons())state.lessons=original;renderArchive()});
  bottom.append(view,edit,dup,del);card.append(bottom);list.append(card)}
}
function exportArchive(){if(!state.lessons.length)return toast('Não há aulas para exportar.');
 const data={kind:'ministerio-infantil-estudos',version:1,exportedAt:new Date().toISOString(),biblicalSource:{name:'Bíblia Livre (BLIVRE)',edition:'2017, versão GetBible 1.0.1',authors:'Diego Santos; Mario Sérgio; Marco Teles',license:'CC BY 3.0 Brasil',licenseUrl:'https://creativecommons.org/licenses/by/3.0/br/',source:'https://github.com/blivre/BibliaLivre'},items:state.lessons};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ministerio-infantil-aulas-'+dateNow()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Backup de aulas gerado. Guarde o arquivo em local seguro.')}
async function importArchive(e){const file=e.target.files?.[0];if(!file)return;try{if(file.size>2_000_000)throw Error('O backup ultrapassa 2 MB.');
 const input=JSON.parse(await file.text());if(input?.kind!=='ministerio-infantil-estudos'||input?.version!==1||!Array.isArray(input.items))throw Error('Arquivo não é um backup válido de Estudos.');
 if(input.items.length>500||!input.items.every(isLesson))throw Error('O arquivo contém dados inválidos ou mais de 500 aulas.');
 const existing=new Set(state.lessons.map(x=>x.id));const added=input.items.filter(x=>!existing.has(x.id));const previous=state.lessons;state.lessons=[...added,...previous].slice(0,500);
 if(!saveLessons()){state.lessons=previous;return}renderArchive();toast(added.length+' aula(s) importada(s), sem substituir as existentes.');
 }catch(err){toast('Falha na importação: '+err.message)}finally{e.target.value=''}}

function init(){
 if(window.self!==window.top){const backLink=document.querySelector('.side-link');if(backLink)backLink.hidden=true}
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
 $('readerListen').addEventListener('click',()=>{if(!state.reader.verses.length)return toast('Carregue a passagem primeiro.');speakSeries(readerAudioParts())});
 $('readerStop').addEventListener('click',stopAudio);refreshVoices();if('speechSynthesis'in window)window.speechSynthesis.addEventListener?.('voiceschanged',refreshVoices);
 $('copySelectedVerse').addEventListener('click',()=>{const t=chapterSelectedText();if(t)copy(t);else toast('A passagem ainda não está carregada.')});
 $('useSelectedVerse').addEventListener('click',useReaderInLesson);$('readFromLesson').addEventListener('click',useReaderInLesson);
 $('lessonTitle').addEventListener('input',()=>{clearLessonSuggestions();clearTimeout(topicTimer);topicTimer=setTimeout(renderTopicSuggestions,230);planScriptureSearch()});
 $('lessonTitle').addEventListener('blur',()=>{clearTimeout(topicTimer);renderTopicSuggestions()});
 $('lessonReference').addEventListener('input',()=>{clearLessonSuggestions();topicAutoRef=null;renderTopicSuggestions()});
 $('lessonAge').addEventListener('change',()=>{syncCustomAge();if(lessonSuggestVariants){clearLessonSuggestions();toast('Faixa etária alterada. Clique em Sugerir Aula para gerar as versões apropriadas à nova idade.')}});
 $('lessonAgeCustom').addEventListener('input',()=>{if(lessonSuggestVariants)clearLessonSuggestions()});
 $('generateLessonSuggestions').addEventListener('click',createLessonSuggestions);
 $('assembleLesson').addEventListener('click',assembleLesson);
 $('finishSuggestedLesson').addEventListener('click',assembleLesson);
 $('readyEditLesson').addEventListener('click',editReadyLesson);
 $('readyEditLessonBottom').addEventListener('click',editReadyLesson);
 $('readySavedLessons').addEventListener('click',()=>navigate('acervo'));
 $('readyPrintLesson').addEventListener('click',()=>printReadyLesson('teacher'));
 $('readyPrintLessonBottom').addEventListener('click',()=>printReadyLesson('teacher'));
 $('readyPrintWorksheet').addEventListener('click',()=>printReadyLesson('student'));
 $('readyPrintWorksheetBottom').addEventListener('click',()=>printReadyLesson('student'));
 $('fillEmptyLessonFields').addEventListener('click',fillEmptyLessonFields);
 $('lessonForm').addEventListener('submit',saveLesson);$('newLesson').addEventListener('click',()=>{if(confirm('Iniciar uma preparação em branco? As alterações ainda não salvas serão descartadas.'))putLessonForm(null)});
 $('copyMasterPrompt').addEventListener('click',()=>{const prompt=lessonPrompt();if(prompt)copy(prompt)});
 $('printLesson').addEventListener('click',assembleLesson);$('acervoNew').addEventListener('click',()=>{putLessonForm(null);navigate('aulas')});
 $('exportArchive').addEventListener('click',exportArchive);$('importArchive').addEventListener('change',importArchive);
 window.addEventListener('beforeunload',stopAudio);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();