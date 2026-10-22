/* Ministerio Infantil | V71 - navegacao nao destrutiva de cadernos A4.
 * Nao modifica atividades, respostas, artes ou arquivos salvos.
 */
(()=>{'use strict';
function init(){
 const pages=Array.from(document.querySelectorAll('section.sheet'));
 const nav=document.querySelector('body > nav');
 if(!nav||!pages.length)return;
 const teacher=/professor\.html$/i.test(location.pathname);
 const requested=new URLSearchParams(location.search).get('aba');
 let current=teacher&&requested==='gabarito'?Math.min(1,pages.length-1):0;
 const selected=pages.map(()=>true);
 const tag=(name,cls,value)=>{const e=document.createElement(name);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;};
 const tabs=tag('div','mi-document-tabs');
 tabs.setAttribute('role','navigation');tabs.setAttribute('aria-label','Materiais da aula');
 const relative=teacher?'criacao-9-anos.html':'criacao-9-professor.html';
 const tabData=[
  {text:'Caderno da criança',href:teacher?relative:'criacao-9-anos.html',active:!teacher},
  {text:'Aula do professor',href:teacher?'?aba=professor':relative+'?aba=professor',active:teacher&&current===0},
  {text:'Gabarito',href:teacher?'?aba=gabarito':relative+'?aba=gabarito',active:teacher&&current===1}
 ];
 for(const t of tabData){
  const a=tag('a',t.active?'mi-active':'',t.text);
  a.href=t.href;if(t.active)a.setAttribute('aria-current','page');
  tabs.append(a);
 }
 nav.after(tabs);
 const controls=tag('div','mi-page-controls');
 const top=tag('div','mi-page-heading');
 const prev=tag('button','','← Página anterior');prev.type='button';
 const next=tag('button','','Próxima página →');next.type='button';
 const status=tag('strong','mi-page-status');
 status.setAttribute('aria-live','polite');
 const pager=tag('div','mi-pager');
 pager.append(prev,status,next);top.append(pager);
 const options=tag('fieldset','mi-page-selection');
 const legend=tag('legend','',teacher?'Páginas do material do professor':'Escolha as páginas para imprimir');options.append(legend);
 const labels=teacher?['Aula do professor','Gabarito']:['Capa','Investigação, ordem e enigmas','Desafios e caça-palavras','Fé em ação e missão'];
 const checkboxes=pages.map((page,i)=>{
  const label=tag('label','mi-page-checkbox');
  const input=tag('input');input.type='checkbox';input.checked=true;
  input.setAttribute('aria-label','Incluir página '+(i+1)+' na impressão');
  input.addEventListener('change',()=>{selected[i]=input.checked;page.dataset.miSelected=String(input.checked);update();});
  label.append(input,document.createTextNode(' '+(i+1)+'. '+(labels[i]||'Página '+(i+1))));options.append(label);return input;
 });
 const actions=tag('div','mi-print-actions');
 const choose=tag('button','','Imprimir páginas escolhidas');
 const all=tag('button','mi-secondary','Imprimir todas as páginas');
 choose.type='button';all.type='button';
 actions.append(choose,all);
 controls.append(top,options,actions);
 tabs.after(controls);
 function update(){
  pages.forEach((p,i)=>{p.classList.toggle('mi-current-page',i===current);p.setAttribute('aria-hidden',String(i!==current));});
  prev.disabled=current===0;next.disabled=current===pages.length-1;
  status.textContent='Página '+(current+1)+' de '+pages.length+' · '+(labels[current]||'Atividade');
  choose.disabled=!selected.some(Boolean);
  for(const a of tabs.querySelectorAll('a')){
   if(teacher&&a.href.includes('aba=')){
    const isCurrent=a.href.includes('aba=gabarito')?current===1:current===0;
    a.classList.toggle('mi-active',isCurrent);
    if(isCurrent)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
   }
  }
 }
 function go(i){
  current=Math.max(0,Math.min(pages.length-1,i));update();
  controls.scrollIntoView({behavior:'auto',block:'start'});
  if(teacher)history.replaceState(null,'','?aba='+(current===1?'gabarito':'professor'));
 }
 prev.addEventListener('click',()=>go(current-1));
 next.addEventListener('click',()=>go(current+1));
 function print(onlyChosen){
  document.body.classList.toggle('mi-print-selected',onlyChosen);
  pages.forEach((p,i)=>{
   p.dataset.miSelected=String(selected[i]);
   p.classList.remove('mi-last-print');
  });
  const indices=pages.map((_,i)=>i).filter(i=>!onlyChosen||selected[i]);
  if(indices.length)pages[indices[indices.length-1]].classList.add('mi-last-print');
  window.print();
 }
 choose.addEventListener('click',()=>print(true));
 all.addEventListener('click',()=>print(false));
 window.addEventListener('afterprint',()=>{
  document.body.classList.remove('mi-print-selected');
  pages.forEach(p=>p.classList.remove('mi-last-print'));
 });
 pages.forEach((p,i)=>{p.dataset.miSelected='true';p.dataset.miPage=String(i+1)});
 document.body.classList.add('mi-pageview');
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();