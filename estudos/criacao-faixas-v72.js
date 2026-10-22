/* V72 — visualizador editorial de A Criação para 5–6 e 10–12 anos */
(()=>{'use strict';
const DB=window.MI_CREATION_LESSONS_V72;
if(!DB)return;
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const tabNames={child:'Caderno da criança',teacher:'Aula do professor',answer:'Gabarito'};
const ageKeys=Object.keys(DB.packs);
let age=ageKeys.includes(params.get('idade'))?params.get('idade'):'5-6';
let tab=['child','teacher','answer'].includes(params.get('aba'))?params.get('aba'):'child';
let page=0;
let selection={};
function escapeHtml(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function img(name){const file=/^[a-z0-9_-]+\.webp$/i.test(name||'')?name:'criacao_natureza.webp';return DB.assetsBase+file}
function lines(count){return '<div class="lines">'+Array.from({length:count||2},()=>'<div class="line"></div>').join('')+'</div>'}
function block(b){
 const h='<section class="section"><h2>'+escapeHtml(b.heading||'')+'</h2>';
 let body='';
 switch(b.type){
 case 'statement':body='<p>'+escapeHtml(b.text)+'</p>';break;
 case 'memory':body='<div class="memory">“'+escapeHtml(b.text)+'”<small>'+escapeHtml(b.ref)+'</small></div>';break;
 case 'teacher':body='<ol>'+b.items.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ol>';break;
 case 'tiles':body='<div class="cards">'+b.items.map(x=>'<div class="tile"><img src="'+img(x[2])+'" alt="'+escapeHtml(x[1])+'"><div><b>'+escapeHtml(x[0])+'</b><p>'+escapeHtml(x[1])+'</p></div></div>').join('')+'</div>';break;
 case 'order':body='<div class="order">'+b.items.map(x=>'<div class="tile"><img src="'+img(x[1])+'" alt="'+escapeHtml(x[0])+'"><p><span class="square" aria-hidden="true"></span> '+escapeHtml(x[0])+'</p></div>').join('')+'</div>';break;
 case 'pick':body=b.items.map((x,i)=>'<div class="prompt"><b>'+(i+1)+'. '+escapeHtml(x.q)+'</b><div class="choices">'+x.options.map(v=>'<div class="choice"><span class="square"></span>'+escapeHtml(v)+'</div>').join('')+'</div></div>').join('');break;
 case 'match':body='<p>Ligue cada item à resposta correta:</p><div class="match"><div>'+b.left.map(x=>'<div class="match-item">'+escapeHtml(x)+' ●</div>').join('')+'</div><div>'+b.right.map(x=>'<div class="match-item right">● '+escapeHtml(x)+'</div>').join('')+'</div></div>';break;
 case 'check':body='<div class="two-col">'+b.items.map(v=>'<div class="choice"><span class="square"></span>'+escapeHtml(v)+'</div>').join('')+'</div>';break;
 case 'truefalse':body=b.items.map((x,i)=>'<div class="truth"><b>( V / F )</b><div>'+escapeHtml(x)+'</div></div>').join('');break;
 case 'table':body='<table class="tchart"><thead><tr>'+b.headers.map(x=>'<th>'+escapeHtml(x)+'</th>').join('')+'</tr></thead><tbody>'+b.rows.map(row=>'<tr>'+row.map((x,i)=>'<td'+(!x?' class="blank"':'')+'>'+escapeHtml(x)||'&nbsp;'+'</td>').join('')+'</tr>').join('')+'</tbody></table>';break;
 case 'question':body=b.items.map((q,i)=>'<div class="prompt"><b>'+(i+1)+'. '+escapeHtml(q)+'</b>'+lines(b.lines||2)+'</div>').join('');break;
 case 'draw':body='<p>'+escapeHtml(b.prompt)+'</p><div class="draw">Meu desenho ou minhas ideias</div>';break;
 default:body='<p>Atividade em preparação.</p>';
 }
 return h+body+'</section>';
}
function pack(){return DB.packs[age]}
function pages(){return pack()[tab]}
function selected(){return selection[age+':'+tab]||(selection[age+':'+tab]=pages().map(()=>true))}
function writeUrl(){const url=new URL(location.href);url.searchParams.set('idade',age);url.searchParams.set('aba',tab);history.replaceState(null,'',url.pathname+url.search)}
function sheet(p,i){
 const cssClass=tab==='teacher'?'teacher':tab==='answer'?'answer':'child';
 const item=document.createElement('article');
 item.className='sheet '+cssClass+(i===page?' is-current':'');
 item.dataset.index=String(i);item.dataset.print='no';
 item.setAttribute('aria-label',tabNames[tab]+': '+p.title+', página '+(i+1));
 const intro='<header class="banner"><div><small>MINISTÉRIO INFANTIL · 4ª IEQ CURITIBA · GÊNESIS 1:1–2:3</small><h1>'+escapeHtml(p.title)+'</h1><p>'+escapeHtml(p.subtitle)+'</p></div><span class="age">'+escapeHtml(pack().label)+'</span></header>';
 const lead=p.lead?'<div class="scene"><img src="'+img(p.art)+'" alt="Ilustração bíblica da criação"><p>'+escapeHtml(p.lead)+'</p></div>':'';
 let content='';
 if(p.cover){
  content='<div class="cover-hero"><img src="'+img(p.art)+'" alt="Paisagem da criação em ilustração artística colorida"><div class="overlay">“No princípio, criou Deus os céus e a terra.” — Gênesis 1:1</div></div><div class="cover-verse">A CRIAÇÃO<br><small>Deus criou tudo com sabedoria e bondade.</small></div><div class="writename"><span>Nome: _______________________________</span><span>Data: ____ / ____ / ______</span></div>';
 }else{content=lead+p.sections.map(block).join('')}
 item.innerHTML=intro+content+'<footer class="foot"><span>'+escapeHtml(tabNames[tab])+' · '+escapeHtml(pack().label)+'</span><span> '+(i+1)+' / '+pages().length+'</span></footer>';
 return item;
}
function updatePage(){
 const arr=pages();
 page=Math.min(Math.max(0,page),arr.length-1);
 $('pageInfo').textContent='Página '+(page+1)+' de '+arr.length+' — '+arr[page].title;
 $('btnPrev').disabled=page===0;$('btnNext').disabled=page>=arr.length-1;
 document.querySelectorAll('#pageHost .sheet').forEach((e,i)=>e.classList.toggle('is-current',i===page));
 $('pageChoices').replaceChildren();
 const flags=selected();
 arr.forEach((p,i)=>{
  const lab=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.checked=flags[i];
  cb.addEventListener('change',()=>{flags[i]=cb.checked;$('btnPrintSelection').disabled=!flags.some(Boolean)});
  lab.append(cb,document.createTextNode((i+1)+'. '+p.title));$('pageChoices').append(lab);
 });
 $('btnPrintSelection').disabled=!flags.some(Boolean);
}
function render(){
 $('agePicker').value=age;
 $('currentAge').textContent=pack().label;
 for(const [key,title] of Object.entries(tabNames)){
  const btn=$('tab-'+key);btn.textContent=title;btn.setAttribute('aria-selected',String(tab===key));
  btn.tabIndex=tab===key?0:-1;
 }
 $('pageHost').replaceChildren();
 pages().forEach((p,i)=>$('pageHost').append(sheet(p,i)));
 updatePage();writeUrl();
}
function changeTab(key){tab=key;page=0;render()}
function print(mode){
 const flags=selected();
 if(mode==='selected'&&!flags.some(Boolean))return;
 const included=[];
 document.querySelectorAll('#pageHost .sheet').forEach((elem,i)=>{
  const yes=mode==='all'||flags[i];elem.dataset.print=yes?'yes':'no';
  elem.dataset.last='no';if(yes)included.push(elem);
 });
 if(included.length)included[included.length-1].dataset.last='yes';
 window.print();
}
for(const key of Object.keys(tabNames))$('tab-'+key).addEventListener('click',()=>changeTab(key));
$('agePicker').addEventListener('change',e=>{age=e.target.value;page=0;render()});
$('btnPrev').addEventListener('click',()=>{if(page>0){page--;updatePage();$('pageInfo').scrollIntoView({block:'nearest'})}});
$('btnNext').addEventListener('click',()=>{if(page<pages().length-1){page++;updatePage();$('pageInfo').scrollIntoView({block:'nearest'})}});
$('btnPrintSelection').addEventListener('click',()=>print('selected'));
$('btnPrintAll').addEventListener('click',()=>print('all'));
window.addEventListener('afterprint',()=>document.querySelectorAll('#pageHost .sheet').forEach(e=>{e.dataset.print='no';e.dataset.last='no'}));
render();
})();