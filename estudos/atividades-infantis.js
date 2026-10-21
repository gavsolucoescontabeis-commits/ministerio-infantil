/* Material editorial de Estudos: perguntas conferíveis e atividades ilustradas para crianças. */
(()=>{'use strict';
const storyAPI=()=>window.MI_LESSON_STORYTELLING;
const ageGroup=age=>storyAPI()?.ageGroup(age)||'middle';
const short=(s,n=420)=>String(s||'').length>n?String(s).slice(0,n)+'…':String(s||'');
const rangeRef=(reference,first,last)=>String(reference).split(':')[0]+':'+first+(last===first?'':'-'+last);
function makeQuestionSets({title,reference,age,verses,firstVerse=1,lastVerse=999}){
 const story=storyAPI()?.storyFor(title,reference);
 const scenes=(story?.scenes||[]).filter(x=>x[0]>=firstVerse&&x[1]<=lastVerse);
 const group=ageGroup(age);
 let a=[],b=[];
 if(scenes.length){
  const source=[scenes[0],scenes[Math.floor((scenes.length-1)/2)],scenes[scenes.length-1]];
  const unique=source.filter((scene,i,all)=>all.findIndex(x=>x===scene)===i);
  a=unique.map((x,i)=>({q:i===0?'O que aconteceu no começo do relato?':i===unique.length-1?'Como terminou esse trecho bíblico?':'O que aconteceu em seguida?',answer:x[3]+' (Referência: '+rangeRef(reference,x[0],x[1])+'.)'}));
  b=unique.map(x=>({q:(group==='little'?'O que a Bíblia conta em ':'Qual acontecimento podemos confirmar em ')+rangeRef(reference,x[0],x[1])+'?',answer:x[2]+' (Confira '+rangeRef(reference,x[0],x[1])+'.)'}));
 }else{
  const list=(verses||[]).filter(v=>v.verse>=firstVerse&&v.verse<=lastVerse&&v.text);
  const source=list.length<=3?list:[list[0],list[Math.floor(list.length/2)],list[list.length-1]];
  const unique=source.filter((v,i,all)=>all.findIndex(x=>x.verse===v.verse)===i);
  a=unique.map(v=>({q:'O que está escrito em '+rangeRef(reference,v.verse,v.verse)+'?',answer:'Texto bíblico para conferência: '+short(v.text)+' (Bíblia Livre, '+rangeRef(reference,v.verse,v.verse)+'.)'}));
  b=unique.map(v=>({q:'Qual ensinamento aparece no versículo '+v.verse+'?',answer:'Base para a resposta: '+short(v.text)+' (Bíblia Livre, '+rangeRef(reference,v.verse,v.verse)+'.)'}));
 }
 const format=(list,key)=>list.map((item,i)=>(i+1)+'. '+item[key]).join('\n');
 return {questions:[format(a,'q'),format(b,'q')],answerKey:[format(a,'answer'),format(b,'answer')],reviewed:scenes.length>0};
}
const drawings={
 soil:'<path d="M18 124h320M25 124l-8 35h80l-8-35M107 124l-8 35h80l-8-35M189 124l-8 35h80l-8-35M271 124l-8 35h80l-8-35"/><path d="M36 145l9-12 9 11 9-11 8 12M123 144l13-13 11 15 12-14M289 146l13-12 11 14 13-12"/><path d="M231 141v-57m0 29q-20-22-28-14q-2 18 28 14m0-18q7-23 26-19q0 18-26 19M61 121V91m0 15Q38 103 42 88q17 1 19 18"/><circle cx="74" cy="148" r="2"/><circle cx="136" cy="148" r="2"/>',
 fish:'<path d="M34 104Q102 25 273 105l61-36v78l-61-39Q104 181 34 104zM72 73q21 31 0 63"/><circle cx="238" cy="99" r="6"/><path d="M133 68l25-34 30 34M130 145l28 24 26-28"/>',
 boat:'<path d="M36 113h293l-37 45H76zM181 35v77M181 44l-69 59h69zM196 58l55 45h-55zM17 174q17-18 35 0t35 0t35 0t35 0t35 0t35 0t35 0t35 0t35 0"/>',
 sheep:'<path d="M97 117q-30-8-22-29q-14-20 6-33q-4-23 25-29q20-23 41-10q25-12 43 5q31-6 40 17q24 4 21 28q18 15 2 35q1 19-25 23M101 110v47h20v-38m102-5v43h-18v-43M236 70q49-16 66 10l-9 35q-26 21-53-1"/><circle cx="280" cy="88" r="4"/>',
 ark:'<path d="M49 113h268l-34 48H82zM79 113V69h205v44M94 69l36-29h103l35 29M157 40V25h48v15M34 178q17-15 34 0t34 0t34 0t34 0t34 0t34 0t34 0t34 0t34 0"/><path d="M116 90h23m19 0h23m19 0h23m19 0h23"/>',
 tree:'<path d="M181 164V92m0 37l-36-26m36 12l37-25M138 164h87M182 40q-28-29-58 0q-34-4-38 31q-32 27-1 48q21 21 49 10q23 24 49 7q35 12 52-6q38 8 42-22q23-28-7-45q3-34-35-36q-24-23-53 13z"/><circle cx="141" cy="77" r="5"/><circle cx="228" cy="81" r="5"/>',
 heart:'<path d="M180 155C142 130 84 78 102 44q24-45 78 7q54-52 78-7q18 34-78 111z"/><path d="M64 62l-16-8m264 0l-16 8M180 18V6"/>',
 crown:'<path d="M67 70l36 73h152l37-73l-66 34-45-64-44 64zM101 154h155v17H101z"/><circle cx="67" cy="67" r="7"/><circle cx="181" cy="37" r="7"/><circle cx="292" cy="67" r="7"/>',
 bread:'<path d="M52 125q-18-66 48-71q55-17 77 40l-9 41H52zM196 129q-13-66 49-72q54-4 56 72zM38 153q142 30 282 0"/><path d="M89 70l-11 38m39-38l-11 38m20-30l-10 29m114-32l-14 34m44-27l-12 27"/>',
 jar:'<path d="M130 42h100M145 42v23q-29 19-29 56q0 54 39 54h50q39 0 39-54q0-37-29-56V42M117 102h127M127 158h106"/>',
 bible:'<path d="M180 52Q116 22 45 47v112q68-22 135 13q67-35 134-13V47q-72-25-134 5zM180 52v120M59 70q43-12 105 7M59 90q43-11 105 9M196 76q45-19 104-8M196 99q45-19 104-9"/>'
};
const labels={soil:'sementes em solos diferentes',fish:'peixe',boat:'barco',sheep:'ovelha',ark:'arca',tree:'árvore',heart:'coração',crown:'coroa',bread:'pães',jar:'talha',bible:'Bíblia aberta'};
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function artworkFor({title}){
 const topic=norm(title);let kind='bible';
 if(/semeador|sement/.test(topic))kind='soil';
 else if(/jonas|peixe/.test(topic))kind='fish';
 else if(/tempestade|barco|mar vermelho|sobre as aguas/.test(topic))kind='boat';
 else if(/noe|arca/.test(topic))kind='ark';
 else if(/ovelha|pastor/.test(topic))kind='sheep';
 else if(/vinho|cana|talha/.test(topic))kind='jar';
 else if(/videira|zaqueu|arvore/.test(topic))kind='tree';
 else if(/davi|golias|salomao|ester/.test(topic))kind='crown';
 else if(/paes|multiplicacao/.test(topic))kind='bread';
 else if(/amor|perdao/.test(topic))kind='heart';
 return {kind,label:labels[kind],svg:'<svg xmlns="http://www.w3.org/2000/svg" class="worksheet-art" viewBox="0 0 360 195" role="img" aria-label="Ilustração para colorir: '+labels[kind]+'" fill="none" stroke="#222" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'+drawings[kind]+'</svg>'};
}
function worksheetFor(data){
 const group=ageGroup(data.age),small=group==='little',early=group==='early';
 const prompts=small?[
 'Pinte a ilustração com capricho.',
 'Com ajuda do professor, conte quem ou o que aparece no texto bíblico.',
 'Desenhe no espaço abaixo uma parte do que você aprendeu.'
 ]:early?[
 'Pinte a ilustração e escreva o título da aula.',
 'O que aconteceu no início da passagem bíblica?',
 'Desenhe uma parte que você aprendeu.'
 ]:group==='middle'?[
 'Pinte ou complete a ilustração.',
 'O que a Bíblia ensina nesta passagem?',
 'Que atitude você pode praticar na escola ou em casa?',
 'Faça um desenho representando o ensinamento.'
 ]:[
 'Complete a ilustração e explique sua relação com a passagem.',
 'Resuma o ensinamento central da passagem com suas palavras.',
 'Dê um exemplo atual e explique por que ele não é um fato do relato bíblico.',
 'Desenhe uma atitude inspirada no ensinamento.'
 ];
 const scene=storyAPI()?.storyFor(data.title,data.reference)?.scenes?.[0];
 const teacherHint=scene?'Confira a passagem '+data.reference+'. Início do relato: '+scene[3]:'Leia '+data.reference+' para verificar as respostas. O desenho é simbólico e não acrescenta fatos ao texto.';
 return {title:String(data.title||''),reference:String(data.reference||''),age:String(data.age||''),prompts,artwork:artworkFor(data),teacherHint,group};
}
window.MI_PRINTABLE_ACTIVITIES=Object.freeze({makeQuestionSets,worksheetFor,artworkFor});
})();
