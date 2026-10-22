/* Ministério Infantil • V70 Banco de Atividades — catálogo central gratuito.
 * Pacotes aprovados são compartilhados por GitHub Pages; rascunhos não são oferecidos.
 * A seleção é voluntária e jamais modifica a aula salva ou o roteiro do professor.
 */
(()=>{'use strict';
const entries=[];
let catalogError='';
let lastReadyLesson=null;
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const ageNumber=raw=>{
 const value=String(raw||'').trim();
 if(/^\d{1,2}\s*anos?$/i.test(value))return Number(value.match(/\d+/)?.[0]||0);
 if(/^\d{1,2}\s*(?:a|e|até|[-–])\s*\d{1,2}\s*anos?$/i.test(value))return Number(value.match(/\d+/)?.[0]||0);
 return 0; // idade não reconhecida não sugere caderno automaticamente
};
function matchesTheme(p,title,reference){
 const name=norm(title),r=norm(reference);
 if(!name&&!r)return false;
 if(p.id==='criacao-9'&&/\badao\b|\beva\b/.test(name))return false;
 if(p.id==='criacao-9'&&/\bcriacao\b/.test(name))return true;
 const byName=p.aliases.some(alias=>{const value=norm(alias);return name===value||(value.length>=13&&name.includes(value))});
 const byRef=p.books.some(b=>r===b||r.startsWith(b+' '));
 return byName||(!name&&byRef);
}
async function loadCatalog(){
 let items=null;
 try{
  // Apenas metadados editoriais publicos. A escrita do banco nao e permitida ao navegador.
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),5000);
  try{
   const response=await fetch('https://jthxnjvqmvtydyfuqcct.supabase.co/rest/v1/mi_study_activity_packages?select=payload&status=eq.approved&order=id.asc',{
    cache:'no-store',signal:controller.signal,headers:{apikey:'sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs'}
   });
   if(!response.ok)throw Error('Banco online: '+response.status);
   const records=await response.json();
   if(!Array.isArray(records))throw Error('Formato do banco online nao reconhecido');
   items=records.map(row=>row?.payload);
  }finally{clearTimeout(timer)}
 }catch(remoteError){
  // GitHub Pages mantem o catalogo aprovado disponivel durante uma indisponibilidade do Supabase.
  try{
   const response=await fetch('./banco-atividades.json?v=75',{cache:'no-store'});
   if(!response.ok)throw Error('Catalogo estatico: '+response.status);
   const data=await response.json();
   if(data?.schemaVersion!==1||!Array.isArray(data.items))throw Error('Formato de catalogo nao reconhecido');
   items=data.items;
  }catch(staticError){
   entries.splice(0);
   catalogError='O catalogo de atividades esta temporariamente indisponivel. Os roteiros do professor continuam funcionando normalmente.';
   renderBank();renderSuggest();
   if(lastReadyLesson)renderReady(lastReadyLesson);
   return;
  }
 }
 const clean=items.filter(p=>
   p&&typeof p.title==='string'&&typeof p.id==='string'&&/^[a-z0-9-]+$/.test(p.id)&&
   ['approved','review','draft'].includes(p.status)&&
   Number.isInteger(p.age)&&p.age>=2&&p.age<=17&&
   Array.isArray(p.aliases)&&Array.isArray(p.books)&&
   (p.student==='./pacotes/A_Criacao.html' || /^\.\/pacotes\/[a-z0-9_-]+\.html(?:\?idade=(?:5-6|10-12)&aba=(?:child|teacher|answer))?$/.test(p.student||'') || /^\.\/pacotes\/[a-z0-9_-]+\/[a-z0-9_-]+\.html$/.test(p.student||''))&&
   (!p.teacher || /^\.\/pacotes\/[a-z0-9_-]+\.html(?:\?idade=(?:5-6|10-12)&aba=(?:child|teacher|answer))?$/.test(p.teacher))&&
   /^\.\/assets\/estudos\/[a-z0-9_-]+\.webp$/.test(p.cover||'')
  );
 entries.splice(0,entries.length,...clean);
 catalogError='';
 renderBank();renderSuggest();
 if(lastReadyLesson)renderReady(lastReadyLesson);
}
function allApproved(){return entries.filter(p=>p.status==='approved')}
function find(title,reference,age){
 const selectedAge=ageNumber(age);
 if(String(age||'').trim()&&!selectedAge)return [];
 return allApproved().filter(p=>matchesTheme(p,title,reference)&&(!selectedAge||(selectedAge>=(p.ageMin||p.age)&&selectedAge<=(p.ageMax||p.age))));
}
function pick(title,reference,age){return find(title,reference,age).find(p=>ageNumber(age)>=(p.ageMin||p.age)&&ageNumber(age)<=(p.ageMax||p.age))||null}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node}
function link(label,url,cls=''){const a=el('a','mi-bank-link '+cls,label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}
function card(p){
 const c=el('article','mi-bank-entry');
 const image=p.format==='pdf' ? el('div','mi-bank-image mi-bank-pdf-preview','PDF · '+p.pages+' páginas') : el('img','mi-bank-image');
 if(p.format!=='pdf'){image.src=p.cover;image.alt='Capa de '+p.title;image.loading='lazy'}
 const body=el('div','mi-bank-entry-content');
 body.append(el('strong','mi-bank-title',p.title+' · '+p.ageLabel));
 body.append(el('p','mi-bank-description',p.summary));
 const links=el('div','mi-bank-buttons');
 links.append(link(p.format==='pdf'?'Abrir atividades em PDF':'Abrir caderno infantil',p.student));
 if(p.teacher)links.append(link('Material do professor',p.teacher,'secondary'));
 body.append(links);c.append(image,body);return c;
}
function lessonAge(){const x=document.getElementById('lessonAge')?.value||'';
 return /outra faixa/i.test(x)?document.getElementById('lessonAgeCustom')?.value||'':x;
}
function renderSuggest(){
 const box=document.getElementById('miPreparedPackageCard');if(!box)return;
 const title=document.getElementById('lessonTitle')?.value||'',ref=document.getElementById('lessonReference')?.value||'';
 const age=lessonAge(),p=pick(title,ref,age);box.replaceChildren();
 if(!p){box.hidden=true;return}
 box.hidden=false;
 box.append(el('strong','mi-bank-offer-heading','Atividade opcional disponível no Banco de Atividades'));
 box.append(el('p','mi-bank-offer-copy','Encontramos '+p.title+' para '+p.ageLabel+'. A preparação do professor não será alterada.'));
 box.append(card(p));
}
function renderReady(data,target){
 lastReadyLesson=data||null;
 const box=target||document.getElementById('miReadyPackageOffer');if(!box)return;
 box.replaceChildren();const matches=find(data?.title,data?.reference,data?.age);
 if(!matches.length){box.hidden=true;return}
 box.hidden=false;
 box.append(el('h3','','Deseja usar uma atividade pronta?'));
 box.append(el('p','','Este material é opcional e independente do roteiro do professor.'));
 for(const p of matches)box.append(card(p));
}
function renderBank(){
 const box=document.getElementById('miBankList');if(!box)return;
 const search=norm(document.getElementById('miBankSearch')?.value||'');
 const approved=allApproved().filter(p=>!search||norm(p.title+' '+p.aliases.join(' ')+' '+p.ageLabel).includes(search));
 box.replaceChildren();
 const count=document.getElementById('miBankCount');
 if(count)count.textContent=approved.length===1?'1 material aprovado':approved.length+' materiais aprovados';
 if(!approved.length){
  box.append(el('div','mi-bank-empty',search?
   'Nenhuma atividade aprovada corresponde à pesquisa. Você pode continuar usando o roteiro do professor.' :
   catalogError||'Os cadernos ilustrados estão sendo revisados e serão incluídos aqui somente após aprovação. Nenhuma atividade será inserida automaticamente.'));
  return;
 }
 for(const p of approved)box.append(card(p));
}
function init(){
 for(const id of ['lessonTitle','lessonReference','lessonAge','lessonAgeCustom']){
  const input=document.getElementById(id);
  input?.addEventListener('input',renderSuggest);input?.addEventListener('change',renderSuggest);
 }
 document.getElementById('miBankSearch')?.addEventListener('input',renderBank);
 for(const id of ['topicSuggestions','newLesson','acervoNew'])document.getElementById(id)?.addEventListener('click',()=>{Promise.resolve().then(renderSuggest)});
 renderBank();renderSuggest();
 loadCatalog();
}
window.MI_ACTIVITY_BANK=Object.freeze({entries,find,pick,renderReady,refresh:renderSuggest,renderBank,get approvedCount(){return allApproved().length}});
window.MI_PREPARED_LESSONS=Object.freeze({find:pick,refresh:renderSuggest,get count(){return allApproved().length}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();