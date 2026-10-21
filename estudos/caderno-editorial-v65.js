/* V65 • Caderno editorial de Estudos: navegação, atividade, professor, gabarito.
   Sem IA externa ou geração de imagens. Não inventa fatos bíblicos. */
(()=>{'use strict';
const $=id=>document.getElementById(id),txt=x=>String(x??'').trim();
const norm=x=>txt(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function el(tag,cls,value){const a=document.createElement(tag);if(cls)a.className=cls;if(value!==undefined)a.textContent=String(value);return a}
function add(parent,...items){for(const item of items)if(item)parent.append(item);return parent}
const p=s=>el('p','mi-ed-p',s);
const panel=(name,body)=>add(el('section','mi-ed-panel'),el('h3','',name),p(body));
const answer=(n=3)=>{const a=el('div','mi-ed-lines');for(let i=0;i<n;i++)a.append(el('div','mi-ed-answer-line'));return a};
function item(title,description,lines=2){return add(el('section','mi-ed-item'),el('h3','',title),p(description||''),answer(lines))}
function choice(prompt,values,checkbox=false){const a=add(el('section','mi-ed-item'),el('h3','','Marque a resposta'),p(prompt));values.forEach((v,i)=>{const label=el('label','mi-ed-choice'),input=el('input');input.type=checkbox?'checkbox':'radio';input.name='ed-'+prompt.slice(0,24);input.value=String(i);add(label,input,el('span','',v));a.append(label)});return a}
function sequence(values){const a=add(el('section','mi-ed-item'),el('h3','','Organize os acontecimentos'),p('Numere na ordem em que aparecem no texto.'));for(const v of values)add(a,add(el('div','mi-ed-sequence'),el('span','mi-ed-seq-box',''),el('span','',v)));return a}
function puzzle(ex){const a=add(el('section','mi-ed-item'),el('h3','',ex.title||'Caça-palavras'),p(ex.prompt||'Encontre as palavras'));
 const words=el('div','mi-ed-words');for(const w of ex.words||[])words.append(el('span','',w));a.append(words);
 const table=el('table','mi-ed-grid'),body=el('tbody');
 for(const r of ex.grid||[]){const tr=el('tr');for(const c of r)tr.append(el('td','',c));body.append(tr)}table.append(body);a.append(table);return a}
function activity(ex){
 if(ex.type==='choice')return choice(ex.prompt,ex.options||[]);
 if(ex.type==='sequence')return sequence(ex.items||[]);
 if(ex.type==='wordsearch')return puzzle(ex);
 const a=add(el('section','mi-ed-item'),el('h3','',ex.title||'Desafio'),p(ex.prompt||''));
 if(ex.type==='match'){a.append(p('Ligue os pares.'));const b=el('div','mi-ed-match');(ex.left||[]).forEach(x=>b.append(el('span','',x)));(ex.right||[]).forEach(x=>b.append(el('span','',x)));a.append(b)}
 else if(ex.type==='anagram'){(ex.words||[]).forEach(w=>a.append(item('Palavra embaralhada: '+w.mixed,'Resposta:',1)))}
 else if(ex.type==='fill'){a.append(p('Banco de palavras: '+(ex.words||[]).join(' • ')),answer(2))}
 else if(ex.type==='maze'&&ex.maze){const m=ex.maze,b=el('div','mi-ed-maze');b.style.gridTemplateColumns='repeat('+m.size+',1fr)';
  m.cells.forEach((cell,i)=>{const box=el('span','mi-ed-cell',i===0?'★':i===m.cells.length-1?'✓':'');['n','e','s','w'].forEach((s,k)=>box.style[['borderTop','borderRight','borderBottom','borderLeft'][k]]=(cell[s]?'2px solid #355b74':'2px solid transparent'));b.append(box)});a.append(b)}
 else a.append(answer(3));
 return a
}
const page=(title,subtitle,render,scene)=>({title,subtitle,render,scene:scene||''});
const creation=[
 'Deus criou a luz e a separou das trevas.',
 'Deus fez o firmamento e separou as águas.',
 'Apareceram a terra seca, os mares e as plantas.',
 'Deus fez os luminares para marcar dias e tempos.',
 'Deus criou os seres aquáticos e as aves.',
 'Deus criou os animais terrestres e os seres humanos.'
];
function ageClass(value){const v=window.MI_LESSON_STORYTELLING?.ageGroup?.(value);if(['little','early','middle','older','teen'].includes(v))return v;const n=Number(String(value).match(/\d+/)?.[0]||9);return /adolesc/i.test(value)||n>=13?'teen':n<=5?'little':n<=8?'early':n<=10?'middle':'older'}
function isCreation(d){return /criacao|deus criou|principio/.test(norm(d.title))&&/^g[eê]nesis\s*1\b/i.test(txt(d.reference))}
function themedImage(topic,role){const source=window.MI_EDITORIAL_IMAGES?.[topic]?.[role];if(!source||!/^\.\/assets\/estudos\/[a-z0-9_/-]+\.(png|webp|jpg)$/i.test(source))return null;const img=el('img','mi-ed-scene');img.src=source;img.loading='lazy';img.alt='Ilustração original vinculada à passagem';img.onerror=()=>img.remove();return img}
function creationWorkbook(d,age){
 const tiny=age==='little'||age==='early',advanced=age==='older'||age==='teen';
 const pages=[
 page('A Criação','Gênesis 1:1–2:3',box=>{box.append(panel('Versículo-chave','No princípio, criou Deus os céus e a terra. — Gênesis 1:1'));box.append(p('Uma investigação sobre tudo o que Deus criou com poder, ordem e bondade.'))},'capa'),
 page('Os dias da criação','Leitura e descoberta',box=>{creation.forEach((v,i)=>box.append(panel('Dia '+(i+1),v)));box.append(panel('Sétimo dia','Deus terminou sua obra, descansou e abençoou o sétimo dia. Gênesis 2:1–3.'))},'leitura')
 ];
 if(tiny){
  pages.push(page('Descubra o que aconteceu','Observe e marque',box=>{box.append(choice('Qual destes surgiu no primeiro dia?',['Luz','Aves','Peixes']));box.append(choice('Quais aparecem no quinto dia?',['Árvores','Peixes e aves','Estrelas']))},'investigacao'));
  pages.push(page('Minha descoberta','Observe, conte e desenhe',box=>{box.append(item('Deus criou a luz','Conte ao professor o que aconteceu.',2));box.append(item('Os animais da criação','Desenhe ou escreva o nome de um animal.',3))},'investigacao'));
 }else{
  pages.push(page('A ordem certa','Coloque na sequência bíblica',box=>box.append(sequence([creation[4],creation[0],creation[5],creation[3],creation[2],creation[1]])),'investigacao'));
  pages.push(page('Investigação bíblica','Verdadeiro ou falso?',box=>box.append(choice('Marque somente as frases verdadeiras.',[
   'A luz aparece antes dos luminares.','Gênesis 1 diz que aviões voaram no quinto dia.',
   'Deus criou o ser humano à Sua imagem.','Peixes e aves foram criados no quinto dia.',
   'O sol foi criado no primeiro dia.','Deus viu que tudo quanto fez era muito bom.'
  ],true)),'investigacao'));
  pages.push(page('Enigmas da criação','Descubra as pistas',box=>[
   'Surgi no primeiro dia e fui separada das trevas. Quem sou?',
   'Fomos criados para marcar os tempos e governar dia e noite. Quem somos?',
   'Fomos criadas no quinto dia e voamos pelo céu. Quem somos?',
   'Fomos criados à imagem de Deus no sexto dia. Quem somos?'
  ].forEach((v,i)=>box.append(item('Pista '+(i+1),v,1))),'investigacao'));
  pages.push(page(advanced?'Análise do relato':'Leitura e interpretação','Investigue a Bíblia',box=>{
   box.append(item('A luz e os luminares','Compare Gênesis 1:3–5 com 1:14–19. Por que são etapas diferentes?',3));
   box.append(item('Criados à imagem de Deus',advanced?'Explique quais responsabilidades aparecem em Gênesis 1:26–28.':'O que o texto conta sobre os seres humanos?',3))
  },'investigacao'));
 }
 pages.push(page('Coragem para fazer o bem','Situação do cotidiano',box=>{
  box.append(panel('Imagine esta situação','Algumas crianças deixaram embalagens no chão da praça. Você deseja fazer a coisa certa sem brigar.'));
  box.append(choice('Qual é a atitude mais sábia?',['Fingir que não viu.','Jogar lixo também.','Recolher somente o que for seguro, dar exemplo e orientar com respeito.','Gritar com todos.']))
 },'coragem'));
 pages.push(page('Pensando com fé','Admiração e responsabilidade',box=>{
  box.append(item('O que a criação ensina sobre Deus?','',tiny?1:3));
  box.append(item('O que na criação mais chama sua atenção?','',tiny?1:2));
  box.append(item('Como podemos cuidar do que Deus criou?','',tiny?1:2))
 },'fe'));
 if(!tiny){
  const result=window.MI_CREATIVE_WORKSHEETS?.cellWords?.(['DEUS','LUZ','TERRA','MAR','SOL','LUA','AVES','PEIXES','PLANTAS','VIDA'],20261021);
  if(result?.grid?.length)pages.push(page('Caça-palavras','Encontre as palavras da criação',box=>box.append(puzzle({title:'Palavras da criação',prompt:'Encontre as palavras na grade.',...result})),'investigacao'));
 }
 pages.push(page('Missão concluída','Uma missão para casa',box=>{
  if(!tiny)box.append(choice('Quais frases estão corretas?',['Deus criou a luz no primeiro dia.','O ser humano foi criado no quinto dia.','Deus considerou toda a criação muito boa.'],true));
  box.append(panel('Missão única','Observe uma parte da criação e pratique um gesto de cuidado. Conte na próxima aula o que descobriu.'));
  box.append(panel('Para guardar','Gênesis 1:1'))
 },'grupo'));
 return{pages,curated:true,teacher:[
 ['Objetivo','Compreender a ordem da criação e reconhecer poder, sabedoria, bondade e propósito do Criador.'],
 ['Abertura · 3 minutos','Pergunte: o que mais chama sua atenção na natureza? Leia Gênesis 1:1.'],
 ['História','Explique os seis dias na ordem da Bíblia e leia Gênesis 2:1–3 sobre o sétimo dia.'],
 ['Dinâmica · 2 minutos','“Criado ou construído?”: árvore, cadeira, peixe, casa, estrela e livro. Compare elementos naturais e construções humanas.'],
 ['Aplicação','Reflita sobre gratidão e cuidado. A situação da praça é uma aplicação moderna, não parte da narrativa bíblica.'],
 ['Missão para casa','Observe algo da criação, pratique um gesto de cuidado e compartilhe na próxima aula.']],
 answers:tiny?[
 'Primeiro dia: luz. Quinto dia: seres aquáticos e aves. Corrigir as respostas orais e os desenhos com Gênesis 1.'
 ]:[
 'Ordem: 5, 1, 6, 4, 3, 2.',
 'Investigação: verdadeiras 1, 3, 4, 6; falsas 2 e 5.',
 'Enigmas: luz; luminares; aves; seres humanos.',
 'Interpretação: luz no dia 1 e luminares no dia 4; imagem de Deus e responsabilidades humanas.',
 'Coragem: alternativa C, com segurança e respeito.',
 'Revisão final: corretas 1 e 3. Conferir Gênesis 1.',
 'Questões pessoais: verificar coerência com o texto bíblico.'
 ]}
}
function generalWorkbook(d,age){
 const creative=window.MI_CREATIVE_WORKSHEETS?.activitySheet?.(d);
 const pages=[
 page(d.title,d.reference,box=>{box.append(panel('Nossa passagem',d.reference));box.append(p(txt(d.goal)||'Vamos aprender com uma leitura cuidadosa da Palavra de Deus.'))},'capa'),
 page('Lendo a Palavra','Compreensão do texto',box=>{
  box.append(panel('Passagem para consultar',d.reference));
  box.append(p(txt(d.story).slice(0,1100)||'Leia o texto bíblico com o professor e observe o que ele realmente relata.'));
  box.append(item('Uma descoberta','Encontre uma informação que pode confirmar na Bíblia.',age==='little'?1:3))
 },'leitura')
 ];
 const answers=[];
 if(creative?.curated&&creative.exercises?.length){
  creative.exercises.slice(0,8).forEach(x=>pages.push(page(x.title||'Atividade bíblica',x.prompt||'',box=>box.append(activity(x)),/reflect/.test(x.type)?'fe':'investigacao')));
  (creative.answerKey||[]).forEach(a=>answers.push(a.title+': '+a.answer));
 }else{
  const known=window.MI_LESSON_STORYTELLING?.storyFor?.(d.title,d.reference);
  const scenes=(known?.scenes||[]).filter(x=>Array.isArray(x)&&x[3]).slice(0,6);
  if(scenes.length>=2){
   const prompts=scenes.map(x=>x[3]);
   if(age==='little'||age==='early')pages.push(page('A história que lemos','Identifique os acontecimentos',box=>{prompts.slice(0,3).forEach((x,i)=>box.append(item('Descoberta '+(i+1),x,1)))},'investigacao'));
   else pages.push(page('História em ordem','Sequência dos acontecimentos',box=>box.append(sequence([...prompts].reverse())),'investigacao'));
   answers.push('Sequência conferida na passagem: '+prompts.map((x,i)=>(i+1)+'. '+x).join(' '));
  }
  pages.push(page('Investigação do texto','Observe os fatos',box=>{
   box.append(item('Quem aparece na passagem?','Confira a informação no texto bíblico.',age==='little'?1:2));
   if(age!=='little')box.append(item('Qual ensinamento está escrito?','Indique um trecho que confirme sua resposta.',3))
  },'investigacao'));
  pages.push(page('Aplicação e reflexão','Fatos e vida cotidiana',box=>{
   box.append(item('O que aprendemos?','Responda com fundamento na passagem.',age==='little'?1:3));
   if(age==='older'||age==='teen')box.append(item('Fato x aplicação','Diferencie o que a Bíblia relata de uma situação de hoje.',3));
  },'fe'));
  answers.push('Esta passagem ainda não possui atividades temáticas revisadas. Corrija consultando '+d.reference+'.');
 }
 const mission=(txt(d.application).split('\n')[0]||'Converse em casa sobre a lição e pratique uma atitude relacionada ao ensino bíblico.').slice(0,260);
 pages.push(page('Missão para casa','Uma única missão prática',box=>{box.append(panel('Sua missão',mission));box.append(item('Compartilhe na próxima aula','O que você aprendeu e praticou?',2))},'fe'));
 if(txt(d.answers))answers.push('Gabarito informado pelo professor: '+d.answers);
 return{pages,answers,curated:!!creative?.curated,teacher:[
  ['Objetivo',d.goal||'Compreender o ensinamento da passagem com fidelidade bíblica.'],
  ['Contexto',d.context||'Consultar o texto bíblico e seu contexto.'],
  ['História e explicação',d.story||'Leia a passagem integralmente com a turma.'],
  ['Dinâmica · 2 minutos','Cada criança encontra uma palavra significativa na passagem e explica por que a escolheu.'],
  ['Aplicação',d.application||'Identifique uma aplicação atual fiel ao texto.'],
  ['Missão única para casa',mission],
  ['Oração',d.prayer||'Conclua com uma oração relacionada ao ensinamento.']
 ]}
}
let current,book,view='student',index=0;
function buildPage(part,i,count){
 const pageNode=el('article','mi-ed-page'),head=el('header','mi-ed-page-head');
 add(head,el('small','','CADERNO BÍBLICO · '+current.age+' · '+(i+1)+'/'+count),el('h2','',part.title),p(part.subtitle||current.reference));
 const body=el('div','mi-ed-body');
 if(i===0)body.classList.add('mi-ed-cover');
 const art=themedImage(isCreation(current)?'criacao':norm(current.title).replace(/[^a-z0-9]+/g,'_'),part.scene);
 if(art)body.append(art);
 part.render(body);add(pageNode,head,body,el('footer','mi-ed-footer','MINISTÉRIO INFANTIL • 4ª IEQ CURITIBA  ·  '+current.reference));return pageNode
}
function render(){
 const target=$('miEditorial');if(!target||!current||!book)return;
 target.replaceChildren();const frame=el('div','mi-ed-frame');
 const heading=el('div','mi-ed-heading');heading.append(el('h2','','Aula navegável · '+current.title));frame.append(heading);
 const tabs=el('div','mi-ed-tabs');
 [['student','Caderno da criança'],['teacher','Aula do professor'],['key','Gabarito']].forEach(([v,label])=>{
  const b=el('button','mi-ed-tab'+(view===v?' active':''),label);b.type='button';b.setAttribute('aria-pressed',String(view===v));
  b.onclick=()=>{view=v;index=0;render()};tabs.append(b)
 });frame.append(tabs);
 frame.append(p(book.curated?'Atividades organizadas para a passagem e a faixa etária.':'Sem roteiro específico revisado: atividades de pesquisa bíblica, sem inventar fatos.'));
 const stage=el('div','mi-ed-stage');
 if(view==='student'){
  book.pages.forEach((pg,i)=>{const result=buildPage(pg,i,book.pages.length);result.hidden=i!==index;stage.append(result)});
 }else{
  const sheet=el('article','mi-ed-page'),head=el('header','mi-ed-page-head'),body=el('div','mi-ed-body');
  head.append(el('h2','',view==='teacher'?'Aula do professor':'Gabarito exclusivo do professor'));
  (view==='teacher'?book.teacher.map(a=>panel(a[0],a[1])):book.answers.map((a,i)=>panel('Resposta '+(i+1),a))).forEach(p=>body.append(p));
  add(sheet,head,body);stage.append(sheet);
  if(view==='teacher'){
   const keySheet=el('article','mi-ed-page'),keyHead=el('header','mi-ed-page-head'),keyBody=el('div','mi-ed-body');
   keyHead.append(el('h2','','Gabarito — somente professor'));
   book.answers.forEach((x,i)=>keyBody.append(panel('Resposta '+(i+1),x)));
   keySheet.append(keyHead,keyBody);stage.append(keySheet);
  }
 }
 frame.append(stage);
 const nav=el('div','mi-ed-navigation');
 const prev=el('button','','← Anterior'),next=el('button','','Próxima →');
 prev.disabled=view!=='student'||index===0;next.disabled=view!=='student'||index===book.pages.length-1;
 prev.onclick=()=>{index=Math.max(0,index-1);render()};next.onclick=()=>{index=Math.min(book.pages.length-1,index+1);render()};
 add(nav,prev,el('strong','',view==='student'?(index+1)+' / '+book.pages.length:(view==='teacher'?'Roteiro de aula':'Uso do professor')),next);frame.append(nav);target.append(frame)
}
function mount(data){
 if(!data||!$('miEditorial'))return false;
 current=data;book=isCreation(data)?creationWorkbook(data,ageClass(data.age)):generalWorkbook(data,ageClass(data.age));
 view='student';index=0;document.body.classList.add('mi-editorial-ready');render();return true
}
function beforePrint(kind){if(!book)return;const host=$('miEditorial');host.dataset.restoreView=view;host.dataset.restoreIndex=String(index);view=kind==='teacher'?'teacher':'student';index=0;render()}
function afterPrint(){const host=$('miEditorial');if(!host)return;view=host.dataset.restoreView||'student';index=Number(host.dataset.restoreIndex||0);render()}
window.MI_ESTUDOS_EDITORIAL=Object.freeze({mount,beforePrint,afterPrint,version:'65.0'});
})();