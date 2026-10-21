/* Ministério Infantil – Sugestões de Aula: conteúdo editorial baseado na Bíblia Livre.
 * Sem IA generativa ou acesso a dados pessoais. Não inventa fatos da narrativa.
 * Cada sugestão deve ser conferida e aceita pelo professor antes de salvar.
 */
(()=>{'use strict';
const profiles=[
 {keys:['parábola do semeador','semeador'],references:['Mateus 13','Marcos 4','Lucas 8'],lesson:'Jesus explica que a maneira de receber a Palavra é importante.',activity:'Use quatro recipientes com tipos diferentes de solo para comparar a recepção da semente. Não apresente a dinâmica como parte do acontecimento bíblico.',question:'O que Jesus explicou sobre os diferentes tipos de solo?'},
 {keys:['amor de Deus','Deus nos ama'],references:['João 3','1 João 4','Romanos 5'],lesson:'O amor de Deus é revelado em Jesus Cristo.',activity:'Peça às crianças que escrevam uma maneira concreta de demonstrar amor ao próximo durante a semana.',question:'O que essa passagem revela sobre o amor de Deus?'},
 {keys:['caim e abel','caim','abel'],references:['Gênesis 4'],lesson:'As escolhas humanas têm consequências, e Deus nos chama à responsabilidade.',activity:'Proponha situações do cotidiano em que é preciso agir com respeito e domínio próprio; discuta as escolhas possíveis.',question:'Quais decisões de Caim aparecem no texto bíblico e quais foram as consequências?'},
 {keys:['esau e jaco','esaú e jacó','esaú','jacó'],references:['Gênesis 25','Gênesis 27','Gênesis 33'],lesson:'As decisões e os relacionamentos familiares precisam ser tratados com responsabilidade.',activity:'Faça uma linha do tempo com os acontecimentos que o texto realmente narra; não acrescente falas ou ações.',question:'O que aconteceu entre os irmãos nesta passagem?'},
 {keys:['vinho','bodas de caná','água em vinho','transformando água em vinho'],references:['João 2'],lesson:'Jesus demonstrou Seu poder em Caná, conforme o relato do evangelho de João.',activity:'Peça que as crianças organizem cartões com os acontecimentos narrados em João 2:1-11, na ordem correta.',question:'O que Jesus fez em Caná e o que os discípulos perceberam?'},
 {keys:['paralítico','paralítico de cafarnaum','cura do paralítico'],references:['Marcos 2','Mateus 9','Lucas 5'],lesson:'Jesus demonstrou autoridade para perdoar pecados e curar.',activity:'Monte uma sequência de cartões com os acontecimentos: chegada dos amigos, encontro com Jesus e reação das pessoas.',question:'Como os amigos ajudaram aquele homem a chegar até Jesus?'},
 {keys:['videira','videira verdadeira'],references:['João 15'],lesson:'Jesus ensina que permanecer nele é essencial para produzir frutos.',activity:'Desenhe uma videira e convide as crianças a relacionar os frutos a atitudes ensinadas na passagem.',question:'O que significa permanecer em Jesus no ensino sobre a videira?'},
 {keys:['bom samaritano','samaritano'],references:['Lucas 10'],lesson:'Amar o próximo envolve atitudes práticas de misericórdia.',activity:'Prepare exemplos de necessidades reais e peça que as crianças sugiram formas seguras de ajudar.',question:'Quem agiu como próximo daquele homem, segundo Jesus?'},
 {keys:['filho pródigo','filho prodigo'],references:['Lucas 15'],lesson:'A parábola apresenta arrependimento, acolhimento e a reação dos membros da família.',activity:'Organize uma linha do tempo da parábola utilizando apenas os acontecimentos presentes em Lucas 15.',question:'Como o pai reagiu quando o filho voltou?'},
 {keys:['davi e golias'],references:['1 Samuel 17'],lesson:'Davi declarou confiança no Senhor diante de uma situação difícil.',activity:'Leia as falas de Davi presentes no texto e compare o que cada personagem disse, sem inventar diálogos.',question:'Em quem Davi declarou confiar?'},
 {keys:['jonas'],references:['Jonas 1','Jonas 2','Jonas 3'],lesson:'O relato de Jonas convida à reflexão sobre obediência, misericórdia e resposta à Palavra de Deus.',activity:'Construa uma linha do tempo da viagem e dos acontecimentos, consultando o livro de Jonas.',question:'Qual ordem Deus deu a Jonas e como ele respondeu?'},
 {keys:['jesus e as crianças','jesus abençoa as crianças'],references:['Marcos 10','Mateus 19','Lucas 18'],lesson:'Jesus acolheu as crianças e ensinou sobre a importância delas.',activity:'Converse sobre atitudes de acolhimento e cuidado que toda criança pode praticar.',question:'O que Jesus disse quando tentaram impedir que as crianças se aproximassem?'},
 {keys:['noé','arca de noé'],references:['Gênesis 6','Gênesis 7','Gênesis 8','Gênesis 9'],lesson:'Noé obedeceu às instruções de Deus, conforme a narrativa de Gênesis.',activity:'Monte com a turma uma sequência de acontecimentos da passagem sem alterar as quantidades nem a ordem bíblica.',question:'Quais instruções Deus deu a Noé nesta parte da história?'}
];
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()}
function editorialProfile(topic,reference){
 const title=norm(topic),ref=norm(reference);
 // A referência bíblica deve confirmar o perfil; o título sozinho não basta.
 const candidates=profiles.filter(p=>p.references.some(r=>ref.startsWith(norm(r))));
 return candidates.find(p=>p.keys.some(k=>title.includes(norm(k))))||null;
}
function scriptureSamples(verses,start,end,max=5){
 const candidates=verses.filter(v=>v.verse>=start&&v.verse<=end);
 if(candidates.length<=max)return candidates;
 const indices=[0,Math.floor((candidates.length-1)*.25),Math.floor((candidates.length-1)*.5),Math.floor((candidates.length-1)*.75),candidates.length-1];
 return [...new Set(indices)].map(i=>candidates[i]);
}
function limitText(str,max=340){const t=String(str||'').trim();return t.length>max?t.slice(0,max).replace(/\s+\S*$/,'')+'…':t}

function ageGroup(age){
 return window.MI_LESSON_STORYTELLING?.ageGroup(age)||'middle';
}
function presentLifeAnalogy(topic,group){
 const q=norm(topic);
 const profile= [
  {words:['amor','carinho','acolh','proximo','bondade'],little:'Quando uma criança fica sem colega para brincar, podemos convidá-la a participar com carinho.',early:'Se alguém está sozinho na escola, convidá-lo para a atividade é uma forma prática de demonstrar amor.',middle:'Imagine um aluno novo na turma. Aproximar-se, ouvi-lo e ajudá-lo a conhecer os colegas mostra amor em atitudes.',older:'Quando uma pessoa é deixada de fora de um grupo, amor ao próximo inclui acolher, escutar e não espalhar comentários injustos.',teen:'Numa conversa de grupo ou rede social, defender alguém tratado injustamente é uma oportunidade de demonstrar amor com responsabilidade.'},
  {words:['perdao','arrepend','reconcili'],little:'Se brigamos com alguém, podemos reconhecer o erro, pedir desculpas e procurar fazer as pazes.',early:'Quando você magoa um colega, pedir perdão inclui reconhecer o que aconteceu e procurar reparar o dano.',middle:'Depois de uma discussão, perdoar não significa dizer que a ofensa foi correta; significa escolher não alimentar a vingança e procurar ajuda quando necessário.',older:'Uma amizade pode ser ferida por mentiras e atitudes impensadas. Reconhecer responsabilidades e estabelecer limites é parte de uma reconciliação saudável.',teen:'Uma ofensa em mensagens ou redes sociais pede atitudes concretas: reconhecer o erro, não reproduzir ataques e buscar mediação responsável.'},
  {words:['obedien','ouvir','ensino','mandamento'],little:'Quando um responsável ensina a atravessar a rua com cuidado, prestar atenção pode nos proteger.',early:'Ouvir a orientação de um adulto responsável antes de uma atividade perigosa é uma forma prática de agir com cuidado.',middle:'Seguir regras de segurança num passeio exige escutar e agir, não apenas dizer que entendeu.',older:'Receber uma orientação importante e colocá-la em prática pode exigir disciplina mesmo quando outros agem de forma diferente.',teen:'Distinguir autoridade responsável de pressão para fazer algo errado ajuda a conversar sobre obediência com discernimento.'},
  {words:['honest','verdade','mentir','justic'],little:'Se quebramos algo sem querer, podemos contar a verdade em vez de esconder.',early:'Quando alguém encontra um objeto que não é seu, entregá-lo ao responsável é uma escolha honesta.',middle:'Numa atividade escolar, copiar a resposta do colega pode parecer mais fácil, mas a honestidade exige reconhecer o próprio trabalho.',older:'Compartilhar uma informação sem conferir se é verdadeira pode prejudicar pessoas; verificar e corrigir o erro também é honestidade.',teen:'Antes de repassar um boato ou uma imagem em redes sociais, vale perguntar se é verdadeiro e se respeita a dignidade dos envolvidos.'},
  {words:['coragem','medo','confianca','fe'],little:'Se você fica com medo de falar na frente da turma, pode pedir ajuda e dar um passo de cada vez.',early:'Falar a verdade mesmo com vergonha pode ser uma atitude de coragem.',middle:'A coragem pode aparecer quando escolhemos proteger um colega que sofre zombarias, pedindo auxílio a um adulto.',older:'Tomar uma decisão correta mesmo sob pressão dos colegas é uma forma de coragem no cotidiano.',teen:'Num grupo em que todos incentivam uma atitude injusta, é preciso coragem para dizer não e buscar apoio.'},
  {words:['gratidao','grato','agradecer'],little:'Podemos agradecer pelo alimento e pela ajuda de quem cuida de nós.',early:'Dizer obrigado e ajudar alguém que nos ajudou também demonstra gratidão.',middle:'Escrever uma mensagem sincera a alguém que nos ensinou ou ajudou pode ser uma forma prática de gratidão.',older:'A gratidão nos ajuda a reconhecer o esforço de outras pessoas, evitando tratar seus cuidados como obrigação.',teen:'Além de mensagens nas redes sociais, gratidão pode aparecer em reconhecimento concreto, serviço e reciprocidade.'},
  {words:['oracao','orar','pai nosso'],little:'Você pode falar com Deus usando palavras simples para agradecer e pedir ajuda.',early:'Separar um momento de silêncio para orar por alguém que precisa de apoio pode ser uma atitude importante.',middle:'Quando ficamos preocupados com uma prova ou com alguém da família, podemos conversar com Deus em oração e buscar ajuda prática.',older:'Orar não significa ignorar responsabilidades; podemos entregar preocupações a Deus e agir com sabedoria.',teen:'Diante de ansiedade e decisões difíceis, a oração pode caminhar junto com conversa, orientação e atitudes responsáveis.'}
 ];
 const hit=profile.find(p=>p.words.some(w=>q.includes(w)));
 if(hit)return hit[group]||hit.middle;
 const examples={
  little:'Depois de ouvir a passagem, pense numa atitude de carinho ou cuidado que você pode praticar hoje em casa.',
  early:'Pense em uma situação da escola em que você pode colocar em prática o ensinamento estudado.',
  middle:'Escolha uma situação real da escola, família ou igreja e explique como o ensinamento bíblico pode orientar sua decisão.',
  older:'Observe um problema de convivência que crianças dessa idade realmente enfrentam e proponha uma atitude responsável à luz da passagem.',
  teen:'Reflita sobre escolhas em amizades, estudos e redes sociais; identifique uma atitude concreta que respeite o ensinamento da passagem.'
 };
 return examples[group]||examples.middle;
}
function fallbackStoryScript({reference,age,verses,firstVerse,lastVerse,interactive=false}){
 const list=verses.filter(v=>v.verse>=firstVerse&&v.verse<=lastVerse&&v.text);
 const group=ageGroup(age),reading=group==='little'||group==='early';
 const start=reading?'Vamos ouvir o que a Bíblia realmente diz nesta passagem.':
  group==='middle'?'Vamos acompanhar a passagem na ordem dos versículos e observar seus acontecimentos.':
  'Vamos ler a passagem em seu contexto, distinguindo os fatos registrados das explicações que fazemos.';
 const intro='LEITURA BÍBLICA GUIADA — '+reference+'\n'+start;
 const max=group==='little'?12:group==='early'?18:30;
 const chapters=list.length<=max?list:[
  ...list.slice(0,Math.ceil(max/3)),
  ...list.slice(Math.floor((list.length-max/3)/2),Math.floor((list.length-max/3)/2)+Math.ceil(max/3)),
  ...list.slice(-Math.ceil(max/3))
 ];
 const readingParts=[];
 let segment=[];
 const push=()=>{if(segment.length){readingParts.push(segment.map(v=>'Versículo '+v.verse+': '+v.text).join('\n'));segment=[]}};
 for(const v of chapters){
  if(segment.length&&v.verse!==segment[segment.length-1].verse+1){push();readingParts.push('[Existem versículos intermediários. Leia a passagem completa na Bíblia Livre antes de ensinar.]')}
  segment.push(v);
  if(segment.length>= (group==='little'?3:5))push();
 }
 push();
 const guidance=interactive?
   'CONVERSA COM A TURMA:\n1. Quem aparece neste trecho?\n2. O que a passagem realmente conta?\n3. O que Deus ou Jesus ensina aqui?':
   'EXPLICAÇÃO PARA O PROFESSOR:\nDepois da leitura, conte com suas palavras somente os acontecimentos encontrados no texto. Quando for um ensino, explique a ideia principal sem transformá-lo numa história que a Bíblia não narra.';
 const note='\n\n'+guidance+'\n\nEsta passagem ainda não possui um roteiro narrativo editorial revisado. O texto bíblico foi preservado para evitar detalhes inventados.';
 return intro+'\n\n'+readingParts.join('\n\n')+note;
}
function generate({title,reference,age,verses,firstVerse=1,lastVerse=999}){
 const profile=editorialProfile(title,reference),topic=String(title||'').trim(),ref=String(reference||'').trim();
 const pedagogy=window.MI_STUDY_PEDAGOGY?.create({title,reference:ref,age})||null;
 const list=verses.filter(v=>v.verse>=firstVerse&&v.verse<=lastVerse&&v.text);
 if(!list.length)throw Error('Nenhum versículo válido na passagem informada.');
 const group=ageGroup(age);
 const storyTool=window.MI_LESSON_STORYTELLING;
 const narrated=storyTool?.narration({title,reference:ref,age,firstVerse,lastVerse,interactive:false});
 const interactive=storyTool?.narration({title,reference:ref,age,firstVerse,lastVerse,interactive:true});
 const analogy=narrated?.comparison||presentLifeAnalogy(topic,group);
 const samples=scriptureSamples(list,list[0].verse,list[list.length-1].verse,4);
 const verse=(v)=>ref.split(':')[0]+':'+v.verse+' — '+String(v.text||'').trim();
 const excerpt=samples.map(verse).join('\n');
 const isLittle=group==='little',isEarly=group==='early',isTeen=group==='teen';
 const goal1=isLittle?'Ouvir e contar com palavras simples os acontecimentos principais de '+ref+'.':
   isEarly?'Conhecer os principais acontecimentos de '+ref+' e compreender seu ensinamento com exemplos próximos à realidade das crianças.':
   isTeen?'Analisar a passagem '+ref+', seus acontecimentos e ensinamentos, identificando aplicações responsáveis para o cotidiano.':
    'Compreender '+ref+', identificar o ensino central e relacioná-lo a uma situação real vivida pelas crianças.';
 const goal2=isLittle?'Reconhecer o cuidado de Deus e lembrar uma atitude boa que podemos praticar depois da aula.':
   isEarly?'Aprender o tema “'+topic+'” e explicá-lo com uma frase e um exemplo concreto.':
   'Ao final da aula, a turma deverá recontar os fatos de '+ref+' em ordem e explicar sua aplicação sem confundir a Bíblia com exemplos atuais.';
 const context1=(profile?.lesson||'A passagem será estudada segundo o seu contexto bíblico.')+
  '\nTexto-base: '+ref+' — Bíblia Livre (BLIVRE). Identifique quem participa, onde a passagem situa os fatos e o que é explicitamente informado; não invente lugar, época, idade ou diálogos.';
 const context2='Comece lendo '+ref+' e mostrando o que o texto realmente registra. Para conferir a sequência e o vocabulário:\n'+excerpt+
  '\nDiferencie a explicação do professor das palavras originais da Bíblia.';
 const story1=narrated?.script||fallbackStoryScript({reference:ref,age,verses:list,firstVerse,lastVerse});
 const story2=interactive?.script||fallbackStoryScript({reference:ref,age,verses:list,firstVerse,lastVerse,interactive:true});
 const qa=window.MI_PRINTABLE_ACTIVITIES?.makeQuestionSets({title,reference:ref,age,verses:list,firstVerse,lastVerse})||{questions:['1. O que o texto bíblico diz?','1. Onde podemos encontrar a passagem?'],answerKey:['Conferir diretamente '+ref+'.','Ler '+ref+' na Bíblia Livre.']};
 const firstVerseSnippet=String(list[0]?.text||'').replace(/\s+/g,' ').slice(0,180);
 const fallbackActivities=[
  'Leia a primeira frase do texto-base e peça às crianças que encontrem o nome de uma pessoa, lugar ou acontecimento: '+ref+'.',
  'Peça que um aluno leia '+ref+' e que outro diga, com suas palavras, o fato ou ensinamento confirmado pela leitura.',
  'Escreva uma palavra do texto no quadro e peça que os alunos encontrem o versículo correspondente: '+firstVerseSnippet,
  'Escolha uma decisão ou ensinamento de '+ref+' e discuta qual detalhe está no texto e qual é apenas nossa aplicação atual.'
 ];
 const code=[...ref].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0);
 const fallbackFirst=fallbackActivities[code%fallbackActivities.length];
 const fallbackSecond=fallbackActivities[(code+1)%fallbackActivities.length];
 const activity1=pedagogy?.activityAlternatives?.[0]||profile?.activity||fallbackFirst;
 const activity2=pedagogy?.activityAlternatives?.[1]||fallbackSecond;
 const agePractice=isLittle?'Converse com as crianças e escolha uma atitude simples para praticar com a família.':
   isEarly?'Convide cada criança a citar uma atitude de cuidado, respeito ou responsabilidade que pode praticar esta semana.':
   'Peça que as crianças expliquem a diferença entre o acontecimento bíblico e o exemplo atual, e escolham uma ação concreta para a semana.';
 return {
  goal:[pedagogy?.goal||goal1,goal2],
  context:[context1,context2],
  story:[story1,story2],
  application:[
   (pedagogy?.teaching||profile?.lesson||'O ensinamento da passagem merece ser colocado em prática.')+
   '\n\nCOMPARAÇÃO ATUAL — NÃO FAZ PARTE DA HISTÓRIA BÍBLICA:\n'+analogy+
   '\n\n'+agePractice,
   'Vamos pensar no nosso dia a dia: '+analogy+
   '\n\nPergunte: “O que a Bíblia ensina? Como nossa escolha de hoje pode demonstrar que compreendemos?”'
  ],
  questions:pedagogy?.questions||qa.questions,
  answerKey:pedagogy?.answerKey||qa.answerKey,
  activity:[activity1,activity2],
  meta:{narrativeMode:narrated?'narrative':'guided',ageGroup:group,reference:ref}
 };
}

window.MI_LESSON_SUGGESTIONS=Object.freeze({generate,editorialProfile,profilesCount:profiles.length});
})();
