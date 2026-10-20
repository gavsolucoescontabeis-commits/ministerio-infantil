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
 return candidates.find(p=>p.keys.some(k=>title.includes(norm(k))))||candidates[0]||null;
}
function scriptureSamples(verses,start,end,max=5){
 const candidates=verses.filter(v=>v.verse>=start&&v.verse<=end);
 if(candidates.length<=max)return candidates;
 const indices=[0,Math.floor((candidates.length-1)*.25),Math.floor((candidates.length-1)*.5),Math.floor((candidates.length-1)*.75),candidates.length-1];
 return [...new Set(indices)].map(i=>candidates[i]);
}
function limitText(str,max=340){const t=String(str||'').trim();return t.length>max?t.slice(0,max).replace(/\s+\S*$/,'')+'…':t}
function generate({title,reference,age,verses,firstVerse=1,lastVerse=999}){
 const profile=editorialProfile(title,reference),topic=title.trim(),ref=reference.trim(),target=age||'as crianças';
 const list=verses.filter(v=>v.verse>=firstVerse&&v.verse<=lastVerse&&v.text);
 if(!list.length)throw Error('Nenhum versículo válido na passagem informada.');
 const examples=scriptureSamples(list,list[0].verse,list[list.length-1].verse);
 const quote=(v)=>ref.split(':')[0]+':'+v.verse+' — '+limitText(v.text,270);
 const content=examples.map(v=>quote(v)).join('\n');
 const starting=examples.slice(0,2).map(v=>quote(v)).join('\n');
 const whole=ref+' (Bíblia Livre — BLIVRE)';
 const idea=profile?.lesson||'A Palavra de Deus pode ser estudada com atenção ao seu contexto e aplicada com responsabilidade.';
 return {
  goal:[
   'Compreender o tema “'+topic+'” à luz de '+ref+' e identificar o ensinamento central da passagem.',
   'Ao final da aula, as crianças deverão reconhecer o que o texto de '+ref+' apresenta e explicar o que aprenderam sobre a Palavra de Deus.'
  ],
  context:[
   'Texto-base: '+whole+'.\nLeia também os versículos imediatamente anteriores e posteriores. Identifique, diretamente na Bíblia, quem fala, quem participa e a situação narrada. Não atribua época, lugar ou idade sem confirmação do texto.',
   'Para iniciar, apresente a referência '+ref+' e explique que a turma observará primeiro os acontecimentos do texto. Trechos para conferir:\n'+starting
  ],
  story:[
   'Acompanhe a sequência do texto bíblico, sem acrescentar falas ou fatos:\n\n'+content+'\n\nReconte os acontecimentos na ordem dos versículos e explique com suas palavras, sempre conferindo o capítulo completo.',
   'Conte a história por etapas: início, desenvolvimento e conclusão, sempre seguindo '+ref+'. Utilize estes versículos como pontos de apoio:\n'+content+'\n\nPergunte às crianças o que elas realmente encontram no relato bíblico.'
  ],
  application:[
   (profile?.lesson||'Explique o ensinamento observado na leitura de '+ref+'.')+'\nConverse com as crianças sobre como esse ensinamento pode orientar escolhas e atitudes nesta semana.',
   'Pergunte: “O que podemos aprender com '+ref+'?” Peça que cada criança pense em uma atitude concreta para praticar, respeitando o significado original da passagem.'
  ],
  questions:[
   '1. Quem aparece ou é mencionado em '+ref+'?\n2. O que aconteceu primeiro?\n3. Qual foi o acontecimento principal?\n4. O que aprendemos sobre Deus ou sobre Jesus nesta passagem?'+(profile?'\n5. '+profile.question:''),
   '1. O que chamou sua atenção no texto?\n2. O que os personagens fizeram ou disseram? Confira a Bíblia antes de responder.\n3. Qual é o ensinamento central?\n4. Como podemos praticá-lo em casa, na escola ou na igreja?'
  ],
  activity:[
   profile?.activity||'Peça que a turma desenhe ou organize uma sequência de três acontecimentos do texto. Depois, confiram juntos se cada ilustração aparece realmente na Bíblia.',
   'Faça uma leitura participativa de '+ref+'. Em seguida, monte com a turma um cartaz com três partes: “O que o texto diz”, “O que aprendemos” e “Como vamos praticar”.'
  ],
  prayer:[
   'Senhor Deus, obrigado pela Tua Palavra. Ajuda-nos a compreender '+ref+' e a colocar em prática aquilo que aprendemos. Em nome de Jesus, amém.',
   'Senhor Jesus, ensina-nos a ouvir a Tua Palavra com atenção e a viver com amor, obediência e sabedoria. Guarda nossas crianças e nossa equipe. Amém.'
  ]
 };
}
window.MI_LESSON_SUGGESTIONS=Object.freeze({generate,editorialProfile,profilesCount:profiles.length});
})();
