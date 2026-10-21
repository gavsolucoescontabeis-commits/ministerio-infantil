/* Biblioteca gratuita de cadernos ilustrados prontos. Sem APIs pagas ou alteração automática de rascunhos. */
(()=>{'use strict';
const packs=Object.freeze([{
id:'criacao-9',title:'A Criação',age:9,
aliases:['a criacao','criacao','criacao do mundo','comeco do mundo','o comeco do mundo','inicio de tudo','o inicio de tudo','deus criou tudo','deus criou todas as coisas','deus criou os ceus e a terra','dias da criacao','primeiros dias da criacao'],
reference:/^genesis\s+1(?:\s|$)/,
student:'./pacotes/criacao-9-anos.html',teacher:'./pacotes/criacao-9-professor.html',
cover:'./assets/estudos/criacao_capa.webp',childPages:4,teacherPages:2
}]);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
function find(title,ref){
const t=norm(title),r=norm(ref);
if(/\badao\b|\beva\b/.test(t))return null;
return packs.find(p=>p.aliases.some(a=>t===a||t.includes(a))||p.reference.test(r))||null;
}
function node(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!=null)x.textContent=txt;return x}
function render(){
const h=document.getElementById('miPreparedPackageCard');if(!h)return;
const t=document.getElementById('lessonTitle')?.value||'',ref=document.getElementById('lessonReference')?.value||'';
const p=find(t,ref);h.replaceChildren();h.hidden=!p;if(!p)return;
let age=document.getElementById('lessonAge')?.value||'';
if(/outra faixa/i.test(age))age=document.getElementById('lessonAgeCustom')?.value||'';
const chosenAge=Number((String(age).match(/\d+/)||[])[0]||0);
const image=node('img','mi-pack-thumb');image.src=p.cover;image.alt='Capa do caderno ilustrado '+p.title;image.loading='lazy';
const body=node('div','mi-pack-body');
body.append(node('strong','mi-pack-title','Caderno ilustrado pronto: '+p.title));
body.append(node('p','mi-pack-info',p.childPages+' páginas infantis com atividades agrupadas e '+p.teacherPages+' páginas de roteiro e gabarito. Material preparado para '+p.age+' anos.'));
if(chosenAge===p.age){
const buttons=node('div','mi-pack-buttons');
const a=node('a','mi-pack-btn','Abrir caderno da criança');a.href=p.student;a.target='_blank';a.rel='noopener noreferrer';
const b=node('a','mi-pack-btn secondary','Abrir roteiro e gabarito');b.href=p.teacher;b.target='_blank';b.rel='noopener noreferrer';
buttons.append(a,b);body.append(buttons);
}else{
body.append(node('p','mi-pack-warning','Este pacote foi preparado para 9 anos. Para outra idade, continue em Sugerir Aula. O pacote não será reaproveitado automaticamente fora da idade indicada.'));
}
h.append(image,body);
}
function init(){
const h=document.getElementById('miPreparedPackageCard');if(!h)return;
const css=document.createElement('style');
css.textContent='#miPreparedPackageCard[hidden]{display:none!important}#miPreparedPackageCard{display:flex;gap:12px;align-items:stretch;background:linear-gradient(110deg,#e5f4df,#fff3d7);border:1px solid #b7d9ad;border-radius:13px;padding:11px;margin:11px 0 13px}#miPreparedPackageCard .mi-pack-thumb{width:114px;max-height:117px;object-fit:cover;border-radius:9px;flex:none}#miPreparedPackageCard .mi-pack-body{min-width:0;flex:1}#miPreparedPackageCard .mi-pack-title{font-size:14px;color:#236454;font-weight:900}#miPreparedPackageCard .mi-pack-info{font-size:11.5px;line-height:1.5;margin:5px 0 7px;color:#556b60}#miPreparedPackageCard .mi-pack-buttons{display:flex;gap:7px;flex-wrap:wrap}#miPreparedPackageCard .mi-pack-btn{background:#137e65;color:white;text-decoration:none;font:800 11px Arial;border-radius:8px;padding:10px}#miPreparedPackageCard .mi-pack-btn.secondary{background:#ad6d31}#miPreparedPackageCard .mi-pack-warning{font-size:11px;font-weight:700;color:#95631f} @media(max-width:620px){#miPreparedPackageCard .mi-pack-thumb{width:80px;max-height:110px}} @media print{#miPreparedPackageCard{display:none!important}}';
document.head.append(css);
for(const id of ['lessonTitle','lessonReference','lessonAge','lessonAgeCustom']){
const x=document.getElementById(id);if(x){x.addEventListener('input',render);x.addEventListener('change',render);}
}
for(const id of ['topicSuggestions','newLesson','acervoNew']){
document.getElementById(id)?.addEventListener('click',()=>setTimeout(render,0));
}
render();
}
window.MI_PREPARED_LESSONS=Object.freeze({find,refresh:render,count:packs.length});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();