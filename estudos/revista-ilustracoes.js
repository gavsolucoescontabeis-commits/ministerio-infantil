/* Revista da Palavra: composições vetoriais originais e estudo semanal. */
(()=>{'use strict';
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const profiles=[
 {match:/semeador|semente/,ref:/^(Mateus 13|Marcos 4|Lucas 8)\b/i,art:'seeds',theme:'Sementes de Boas Escolhas',mission:'Ouça uma boa orientação e procure colocá-la em prática.'},
 {match:/jonas|peixe/,ref:/^Jonas [123]\b/i,art:'fish',theme:'Uma Viagem para Aprender',mission:'Pense numa responsabilidade que você pode cumprir nesta semana.'},
 {match:/ester|rainha/,ref:/^Ester\b/i,art:'crown',theme:'Coragem para Fazer o Bem',mission:'Faça o que é correto e peça ajuda quando precisar.'},
 {match:/banquete|festa|convite/,ref:/^Lucas 14\b/i,art:'party',theme:'Um Convite Especial',mission:'Acolha alguém que está sozinho numa brincadeira ou conversa.'},
 {match:/samaritano/,ref:/^Lucas 10\b/i,art:'care',theme:'Amor que Vira Atitude',mission:'Ajude alguém com respeito e segurança.'},
 {match:/mulher samaritana|preconceito|po[cç]o/,ref:/^Jo[aã]o 4\b/i,art:'well',theme:'Jesus Acolhe as Pessoas',mission:'Trate com respeito alguém que tem hábitos diferentes.'},
 {match:/davi|golias/,ref:/^1 Samuel 17\b/i,art:'stones',theme:'Coragem e Confiança',mission:'Demonstre coragem fazendo uma escolha certa.'},
 {match:/no[eé]|arca/,ref:/^G[eê]nesis [6789]\b/i,art:'ark',theme:'Cuidado e Obediência',mission:'Conclua com atenção uma tarefa importante.'},
 {match:/amor|perd[aã]o|fam[ií]lia/,ref:/^(Jo[aã]o|1 Jo[aã]o|Romanos|Marcos|Mateus)\b/i,art:'heart',theme:'Espalhando o Amor',mission:'Faça um gesto de bondade e gratidão.'}
];
const profile=data=>profiles.find(p=>p.match.test(norm(data.title))&&p.ref.test(String(data.reference||'')))||null;
const common='<defs><linearGradient id="miSky" x2="0" y2="1"><stop stop-color="#e7f6ff"/><stop offset="1" stop-color="#fff5d6"/></linearGradient></defs>'+
'<rect x="0" y="0" width="800" height="220" rx="27" fill="url(#miSky)"/>'+
'<circle cx="701" cy="48" r="28" fill="#ffd87a"/>'+
'<path d="M0 179Q190 117 373 169T800 157V220H0Z" fill="#cce8c8"/>'+
'<path d="M0 192Q190 152 400 191T800 182V220H0Z" fill="#84cdaa"/>'+
'<g fill="#fff" opacity=".91"><ellipse cx="101" cy="49" rx="51" ry="17"/><circle cx="77" cy="39" r="21"/><circle cx="118" cy="31" r="25"/>'+
'<ellipse cx="492" cy="39" rx="44" ry="17"/><circle cx="477" cy="29" r="20"/><circle cx="518" cy="33" r="18"/></g>'+
'<g fill="#f6ac76"><circle cx="58" cy="182" r="4"/><circle cx="416" cy="195" r="4"/><circle cx="754" cy="180" r="5"/></g>';
const baseBook='<g transform="translate(238 21)">'+
'<path d="M163 55Q82 18 7 55v113q76-26 156 12q80-38 156-12V55q-75-37-156 0Z" fill="#fffef4" stroke="#538fa7" stroke-width="7"/>'+
'<path d="M163 55v125M27 82q60-15 116 10M27 104q60-15 116 10M184 92q60-25 112-10M184 116q60-25 112-10" stroke="#a4ccd7" stroke-width="4" fill="none"/>'+
'<path d="M160 13v25m-13-12h27" stroke="#f0bf61" stroke-width="6"/></g>';
const symbols={
 seeds:'<g transform="translate(130 41)" stroke-linejoin="round">'+
 '<path d="M35 140Q160 98 285 140" fill="none" stroke="#a77d5b" stroke-width="12" stroke-linecap="round"/>'+
 '<path d="M100 130V46m0 30Q61 56 57 42q36-7 43 34m0-26q22-37 48-28-4 32-48 28M227 131V35m0 46q-37-13-39-33 40-2 39 33m0-29q10-31 37-30-2 28-37 30" fill="#77cc89" stroke="#328d6c" stroke-width="5"/>'+
 '<g fill="#f1b759"><ellipse cx="23" cy="136" rx="8" ry="4"/><ellipse cx="315" cy="138" rx="8" ry="4"/><ellipse cx="344" cy="124" rx="8" ry="4"/></g></g>',
 fish:'<path d="M158 111Q278 11 461 100l85-61v138l-85-62Q273 213 158 111Z" fill="#70c3dc" stroke="#2a809b" stroke-width="7"/>'+
 '<path d="M209 80q22 29 0 64m81-57 37-53 40 52m-80 57 40 38 41-37" fill="#9dd7e4" stroke="#2a809b" stroke-width="5"/>'+
 '<circle cx="412" cy="103" r="11" fill="#fff"/><circle cx="415" cy="103" r="5" fill="#26566b"/>'+
 '<path d="M408 130q15 13 32 0" fill="none" stroke="#2a809b" stroke-width="5"/>'+
 '<g stroke="#72c5e5" stroke-width="5" fill="none"><circle cx="599" cy="89" r="12"/><circle cx="640" cy="65" r="9"/></g>',
 crown:'<g transform="translate(211 20)"><path d="M26 85l57 94h262l52-94-79 29-105-80-105 80Z" fill="#ffd16e" stroke="#c78e3f" stroke-width="7" stroke-linejoin="round"/>'+
 '<rect x="81" y="179" width="264" height="18" rx="8" fill="#eeb055" stroke="#c78e3f" stroke-width="4"/>'+
 '<circle cx="26" cy="83" r="13" fill="#f18a97"/><circle cx="213" cy="31" r="13" fill="#f18a97"/><circle cx="397" cy="83" r="13" fill="#f18a97"/>'+
 '<path d="M153 137l15-19 15 19-15 20Z" fill="#83ced0"/><path d="M259 137l15-19 15 19-15 20Z" fill="#e98eaa"/></g>',
 party:'<g transform="translate(220 24)">'+
 '<path d="M46 87Q6 42 27 25q26-16 42 11 6 25-23 51Z" fill="#ff9fa3" stroke="#d87581" stroke-width="4"/>'+
 '<path d="M164 81q-31-41-8-59q30-13 41 15q4 27-33 44Z" fill="#ffe08b" stroke="#d6ae54" stroke-width="4"/>'+
 '<path d="M275 86q-23-49 8-60q27-5 33 24q-1 21-41 36Z" fill="#a2d9c0" stroke="#6da98d" stroke-width="4"/>'+
 '<path d="M48 89l-15 65m131-73-9 74m120-69-12 68" stroke="#9e8b84" stroke-width="3"/>'+
 '<rect x="6" y="157" width="333" height="24" rx="10" fill="#ffd29b" stroke="#d59a71" stroke-width="5"/></g>',
 care:'<path d="M55 183Q196 126 326 175T744 171" fill="none" stroke="#ebc89a" stroke-width="26" stroke-linecap="round"/>'+
 '<g transform="translate(272 15)"><path d="M122 170Q17 98 55 49q29-35 67 4 39-39 69-4 38 49-69 121Z" fill="#f4a2aa" stroke="#cc7688" stroke-width="7"/>'+
 '<path d="M122 71v67M93 104h58" stroke="#fff0e7" stroke-width="15" stroke-linecap="round"/></g>',
 well:'<g transform="translate(221 21)"><rect x="72" y="90" width="270" height="78" rx="27" fill="#b6a08b" stroke="#867263" stroke-width="7"/>'+
 '<ellipse cx="207" cy="94" rx="138" ry="49" fill="#a5e2ee" stroke="#8d7767" stroke-width="7"/>'+
 '<path d="M74 122h265m-240 25h217m-194-25-15 28m79-28 16 27m79-27-12 24" fill="none" stroke="#967e6c" stroke-width="5"/>'+
 '<path d="M101 45l33-30h155l28 30M207 16v57" fill="none" stroke="#8c664c" stroke-width="10"/>'+
 '<path d="M179 72h56l-9 25h-39Z" fill="#f8d59c" stroke="#8c664c" stroke-width="5"/></g>',
 stones:'<g transform="translate(200 12)"><path d="M112 54q88-36 168 0M112 54q5 61 64 104M280 54q-13 69-59 104" fill="none" stroke="#ad835f" stroke-width="11" stroke-linecap="round"/>'+
 '<path d="M173 157q28 15 48 0l-5 31q-18 10-37 0Z" fill="#d5a172" stroke="#956947" stroke-width="5"/>'+
 '<g fill="#b8babc" stroke="#8f9597" stroke-width="4"><ellipse cx="21" cy="167" rx="16" ry="11"/><ellipse cx="61" cy="183" rx="16" ry="11"/>'+
 '<ellipse cx="103" cy="165" rx="16" ry="11"/><ellipse cx="326" cy="165" rx="16" ry="11"/><ellipse cx="368" cy="183" rx="16" ry="11"/></g></g>',
 ark:'<g transform="translate(188 36)"><path d="M5 115h422l-51 55H56Z" fill="#d9a678" stroke="#966a46" stroke-width="7"/>'+
 '<rect x="54" y="55" width="329" height="65" rx="7" fill="#f1c794" stroke="#966a46" stroke-width="7"/>'+
 '<path d="M55 58l50-38h223l54 38" fill="#f9d8a5" stroke="#966a46" stroke-width="7"/>'+
 '<path d="M152 57v63m96-63v63" stroke="#b4875b" stroke-width="6"/>'+
 '<path d="M5 190q40-18 80 0t80 0t80 0t80 0t80 0t80 0" fill="none" stroke="#5bb9ce" stroke-width="11"/></g>',
 heart:'<g transform="translate(235 5)"><path d="M153 177Q30 92 71 46q34-39 82 4 47-43 82-4 41 46-82 131Z" fill="#f9a5ab" stroke="#ce7485" stroke-width="7"/>'+
 '<path d="M3 97q-39-27-18-50q17-17 35 7 19-24 36-7 21 23-18 50L20 114Z" fill="#ffe08d" stroke="#d7a65a" stroke-width="5"/>'+
 '<path d="M297 112q-34-23-16-46q19-16 36 6 18-22 37-6q18 23-16 46l-21 16Z" fill="#a5dbbc" stroke="#6bb395" stroke-width="5"/></g>'
};
function svgFor(data){
 const kind=profile(data)?.art;
 return '<svg class="magazine-scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ilustração simbólica original relacionada ao tema, não necessariamente uma cena bíblica.">'+common+(symbols[kind]||baseBook)+'</svg>';
}
const weekdays=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const days=[
 ['Hora de Descobrir','Leia ou ouça a passagem com atenção.','Desenhe uma palavra ou ideia que chamou sua atenção.'],
 ['Quem Aparece?','Observe a passagem novamente.','Escreva ou diga o nome de alguém mencionado, se houver.'],
 ['Uma Boa Escolha','Lembre do ensinamento principal.','Faça uma atitude de carinho ou respeito.'],
 ['Conte em Casa','Compartilhe o que aprendeu.','Conte a alguém a parte de que mais gostou.'],
 ['Detetive da Palavra','Releia com o professor ou família.','Escolha uma palavra do texto para lembrar.'],
 ['Hora de Criar','Pense no ensino da semana.','Faça um desenho que represente o que aprendeu.'],
 ['Gratidão e Oração','Separe um momento com Deus.','Faça uma oração curta por alguém.']
];
function weeklyPlan(data){
 const age=window.MI_LESSON_STORYTELLING?.ageGroup(data.age)||'middle';
 const little=age==='little',early=age==='early',older=age==='older',teen=age==='teen';
 const ageTasks=teen?[
  'Identifique a ideia central e indique em que parte do texto ela aparece.',
  'Descreva uma decisão ou ensinamento explícito da passagem, com referência.',
  'Pense numa situação atual que poderia ser orientada pelo ensinamento.',
  'Converse com alguém sobre a diferença entre interpretar e inventar fatos.',
  'Anote uma dúvida séria para discutir com seu professor.',
  'Escreva um parágrafo: como aplicar o texto com respeito e responsabilidade?',
  'Ore e registre uma forma de servir sem esperar reconhecimento.'
 ]:older?[
  'Escreva uma frase com o ensinamento principal.',
  'Encontre dois detalhes no texto que ajudam a compreendê-lo.',
  'Escolha uma atitude para praticar e explique sua decisão.',
  'Converse com alguém sobre como o texto se aplica à vida atual.',
  'Anote uma palavra importante e explique o significado dela.',
  'Crie um pequeno desenho ou texto com uma comparação atual, sem alterar os fatos.',
  'Faça uma oração e escreva uma atitude de gratidão.'
 ]:little?[
  'Escute a passagem e faça um pequeno desenho.',
  'Conte com a ajuda de um adulto quem aparece ou o que o texto ensina.',
  'Dê um abraço ou mostre carinho com respeito.',
  'Conte a alguém o que você aprendeu.',
  'Escolha uma palavra bonita para repetir.',
  'Desenhe o que mais gostou de aprender.',
  'Faça uma oração curtinha com alguém.'
 ]:early?[
  'Leia ou ouça a passagem e desenhe uma palavra importante.',
  'Descubra com o professor o que acontece no texto.',
  'Pratique uma atitude boa durante o dia.',
  'Conte para alguém da família o que aprendeu.',
  'Escreva uma palavra que aparece na história.',
  'Faça um desenho do ensinamento da semana.',
  'Faça uma oração agradecendo pelo cuidado de Deus.'
 ]:days.map(x=>x[2]);
 return {title:'Tempo com Deus',reference:String(data.reference||''),age:String(data.age||''),
  mission:profile(data)?.mission||'Demonstre uma atitude de amor e respeito durante a semana.',
  days:weekdays.map((day,i)=>({day,label:days[i][0],lead:days[i][1],task:ageTasks[i]}))};
}
window.MI_MAGAZINE_ART=Object.freeze({svgFor,weeklyPlan,profile,artTypes:Object.keys(symbols).length});
})();