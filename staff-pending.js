(()=>{
'use strict';
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
let panel=null,list=null,shortcut=null,navBadge=null,homeBadge=null,refreshing=false,recentPanel=null,recentList=null,recentRefreshing=false;
let focusedApplicationId=null, searchPending=null, successLine=null;

function isAdmin(){return window.miAuthRoleV58==='developer'&&!!window.miAuthTokenV58}
function escText(v){return String(v??'')}
function fmtCpf(v){const n=String(v||'').replace(/\D/g,'');return n.length===11?n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4'):n}
function fmtDate(v){if(!v)return '—';const p=String(v).slice(0,10).split('-');return p.length===3?p.reverse().join('/'):'—'}
function minorBirth(birth){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(birth||'')))return false;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 let age=Number(today.slice(0,4))-Number(birth.slice(0,4));
 if(today.slice(5)<birth.slice(5))age--;
 return age<18;
}
function fmtDateTime(v){try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v))}catch{return fmtDate(v)}}
function areaLabel(v){return v==='ebd'?'EBD':v==='net'?'Rede de Crianças':v==='both'?'EBD e Rede de Crianças':v||'—'}
function roleLabel(v){return ({teacher:'Professor(a)',assistant:'Auxiliar',coordinator:'Coordenador(a)',office:'Escritório',other:'Outra'})[v]||v||'—'}

function style(){
 if(document.getElementById('miPendingStaffStyleV60'))return;
 const s=document.createElement('style');s.id='miPendingStaffStyleV60';
 s.textContent=`
 #miPendingShortcutV60{margin:10px 0 0;display:inline-flex;align-items:center;gap:7px}
 #miPendingPanelV60{border:2px solid #efb2ae;background:#fffafa}
 #miPendingPanelV60[hidden]{display:none!important}
 #miPendingListV60 .mi-pending-card{border:1px solid #e0e5e8;border-left:6px solid #d93636;border-radius:13px;padding:14px;margin:12px 0;background:#fff}
 #miPendingListV60 .mi-pending-card [hidden]{display:none!important}
 #miPendingListV60 .mi-pending-quick{font-size:13px;margin:6px 0 12px;line-height:1.5;color:#445}
 #miPendingListV60 .mi-pending-review{width:100%;min-height:44px;font-weight:700}
 #miPendingSuccessV644[hidden]{display:none!important}
 #miPendingListV60 .mi-pending-perm-extra{border:1px solid #dce5ee;padding:12px;border-radius:10px;margin:10px 0}
 #miPendingListV60 .mi-pending-perm-extra summary{font-weight:700;cursor:pointer;line-height:1.5}
 #miPendingListV60 .mi-pending-verify span{flex:1;min-width:0}
 #miPendingListV60 .mi-pending-verify[hidden]{display:none!important}
 #miPendingListV60 .mi-pending-verify{cursor:pointer}
 #miPendingListV60 .mi-pending-config{padding-top:16px}
 #miPendingListV60 .mi-pending-danger{margin-top:14px;border-top:1px solid #eee;padding-top:12px}
 #miPendingListV60 .mi-pending-danger summary{cursor:pointer;font-size:13px;color:#8d2828}
 #miPendingListV60 .mi-pending-danger button{margin-top:10px;min-height:44px}
 #miPendingListV60 .mi-pending-verify{display:flex;gap:9px;padding:12px;margin:12px 0;border:1px solid #c9dce8;border-radius:10px;background:#f5fbff;align-items:flex-start;line-height:1.5}
 #miPendingListV60 .mi-pending-verify input{width:22px;min-width:22px;height:22px;min-height:22px;margin:0;appearance:auto;-webkit-appearance:checkbox;accent-color:#0b68b8}
 #miPendingListV60 .mi-pending-actions{display:block!important;margin-top:14px}
 #miPendingListV60 .mi-pending-actions button{width:100%;min-height:48px;white-space:normal}
 #miPendingListV60 .mi-pending-review-status{margin:10px 0;padding:10px;border-radius:8px;background:#f6f8fa;font-size:13px}
 #miPendingPanelV60 #miPendingSearchV644{width:100%;min-height:46px;font-size:16px;margin:10px 0;box-sizing:border-box}
 @media(max-width:620px){#miPendingListV60 .mi-pending-card{padding:12px;margin:8px 0}#miPendingListV60 .mi-pending-grid{grid-template-columns:minmax(0,1fr)}#miPendingListV60 .mi-pending-meta{grid-template-columns:minmax(0,1fr)}#miPendingListV60 .mi-pending-perms label{flex:1 1 100%;min-height:42px;box-sizing:border-box}#miPendingPanelV60{padding:12px}#miPendingListV60 button{font-size:15px}}

 #miPendingListV60 .mi-pending-title{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
 #miPendingListV60 .mi-pending-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:5px 14px;margin:10px 0;font-size:13px}
 #miPendingListV60 .mi-pending-config{margin-top:12px;padding-top:12px;border-top:1px solid #e7eaec}
 #miPendingListV60 .mi-pending-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
 #miPendingListV60 .mi-pending-perms{display:flex;flex-wrap:wrap;gap:8px 14px;margin:10px 0}
 #miPendingListV60 .mi-pending-perms label{display:inline-flex;align-items:center;gap:6px;margin:0;padding:7px 9px;background:#f6f8fa;border-radius:9px;color:#334}
 #miPendingListV60 .mi-pending-perms input{width:auto}
 #miPendingListV60 .mi-pending-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
 #miPendingListV60 .mi-pending-actions button{flex:1;min-width:170px}
 .mi-pending-badge{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:#d62d2d;color:#fff;font-size:12px;font-weight:900;margin-left:5px}
 .mi-pending-badge[hidden]{display:none!important}
 @media(max-width:620px){#miPendingListV60 .mi-pending-actions button{width:100%;flex-basis:100%}}
 `;
 document.head.appendChild(s);
}

function ensureUI(){
 if(panel)return;
 style();
 const people=document.getElementById('people');
 const pane=document.getElementById('miTeamAccessPane');
 if(!people||!pane)return;

 shortcut=document.createElement('button');
 shortcut.id='miPendingShortcutV60';shortcut.type='button';shortcut.className='soft';
 shortcut.textContent='Pré-cadastros pendentes: 0';
 const intro=pane.querySelector('.miV66Intro');if(intro)intro.insertAdjacentElement('afterend',shortcut);else pane.insertBefore(shortcut,pane.firstChild);
 const guide=document.createElement('p');guide.className='small';guide.textContent='Aprovar cadastro também cria o acesso e vincula a certidão já enviada. Para consultar ou bloquear um login, use a seção Contas e senhas abaixo.';pane.insertBefore(guide,shortcut.nextSibling);

 panel=document.createElement('section');
 panel.id='miPendingPanelV60';panel.className='card';panel.hidden=false;
 const title=document.createElement('h3');title.textContent='1. Pré-cadastros aguardando aprovação';
 const help=document.createElement('p');help.className='small';help.textContent='Selecione uma pessoa, confira função e sala quando necessário, e aprove. Se já verificou a certidão no órgão emissor, marque a conferência aqui mesmo. Você nunca precisa reenviar o arquivo recebido.';
 const actions=document.createElement('div');actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px';
 const refresh=document.createElement('button');refresh.type='button';refresh.className='soft';refresh.textContent='Atualizar pendentes';
 const close=document.createElement('button');close.type='button';close.className='soft';close.textContent='Fechar';
 actions.append(refresh,close);
 searchPending=document.createElement('input');searchPending.id='miPendingSearchV644';searchPending.type='search';searchPending.placeholder='🔎 Encontrar pessoa pelo nome';searchPending.autocomplete='off';searchPending.setAttribute('aria-label','Pesquisar pré-cadastros por nome');
 searchPending.addEventListener('input',filterPendingCards);
 successLine=document.createElement('p');successLine.id='miPendingSuccessV644';successLine.className='notice';successLine.hidden=true;successLine.setAttribute('role','status');
 list=document.createElement('div');list.id='miPendingListV60';list.setAttribute('role','status');
 panel.append(title,help,actions,searchPending,successLine,list);
 pane.insertBefore(panel,guide.nextSibling);

 shortcut.addEventListener('click',()=>{panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'});refreshPending()});
 refresh.addEventListener('click',()=>refreshPending());
 close.addEventListener('click',()=>{panel.hidden=true});

 const navButton=document.querySelectorAll('nav button')[4];
 if(navButton){
   navBadge=document.createElement('span');navBadge.className='mi-pending-badge';navBadge.hidden=true;navButton.appendChild(navBadge);
   navButton.addEventListener('click',()=>{if(isAdmin())refreshPending(true)});
 }
 const homeTeamBtn=document.querySelector('#home button[onclick*="go(\'people\'"]');
 const homeTeamCard=homeTeamBtn?.closest('.card');
 if(homeTeamCard){
   homeBadge=document.createElement('span');homeBadge.className='mi-pending-badge';homeBadge.hidden=true;
   homeTeamCard.querySelector('h3')?.appendChild(homeBadge);
   homeTeamBtn.addEventListener('click',()=>{if(isAdmin())refreshPending(true)});
 }
 ensureRecentUI();
}

function ensureRecentUI(){
 if(recentPanel)return;
 // Mantenha a fila de aprovados junto dos pré-cadastros, não no final da página.
 const anchor=panel||document.getElementById('miTeamAccessPane');
 if(!anchor)return;
 recentPanel=document.createElement('details');
 recentPanel.id='miRecentStaffV60';recentPanel.className='card';recentPanel.style.cssText='margin:14px 0;border:1px solid #cbd8e5';
 const title=document.createElement('summary');title.textContent='2. Pré-cadastros aprovados — consultar certidões e ativação';
 const help=document.createElement('p');help.className='small';help.textContent='Após aprovar, confira nesta lista o acesso, o e-mail e o documento recebido. Se aparecer “Certidão recebida — conferir”, abra-a e confirme a autenticidade, sem enviar um novo arquivo.';
 const refresh=document.createElement('button');refresh.type='button';refresh.className='soft';refresh.textContent='Atualizar concluídos';
 refresh.addEventListener('click',()=>refreshRecent());
 recentList=document.createElement('div');recentList.id='miRecentStaffListV60';recentList.setAttribute('role','status');
 const stats=document.createElement('div');
 stats.id='miAccessStatsV68';stats.style.cssText='margin:12px 0;padding:13px;border:1px solid #d1e2ef;border-radius:10px;background:#f3f9ff;font-size:14px;line-height:1.6';
 const instructions=document.createElement('button');instructions.type='button';instructions.className='soft';
 instructions.textContent='📋 Copiar instruções de primeiro acesso (WhatsApp)';
 instructions.style.margin='5px 0 12px';
 instructions.addEventListener('click',async()=>{
  const msg='Olá! Para acessar o Ministério Infantil da 4ª IEQ Curitiba, abra https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/ . Se ainda não criou sua senha, toque em “Primeiro acesso ou esqueci minha senha” e informe o mesmo e-mail do cadastro. Se receber um código numérico, abra https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/ativar-acesso/ , informe e-mail e código e crie sua senha. Se receber um link antigo inválido, avise a administração para gerar uma senha provisória. Confira também a pasta de spam. Depois, entre com CPF e senha. Se aparecer erro ou o e-mail não chegar, avise a coordenação informando apenas seu nome e o problema — nunca envie sua senha.';
  try{await navigator.clipboard.writeText(msg);instructions.textContent='✅ Instruções copiadas!'}catch(_){window.prompt('Copie o texto para enviar à pessoa:',msg)}
  setTimeout(()=>instructions.textContent='📋 Copiar instruções de primeiro acesso (WhatsApp)',3200);
 });
 recentPanel.append(title,help,refresh,stats,instructions,recentList);
 anchor.insertAdjacentElement('afterend',recentPanel);
}

async function loadRecentRows(){
 const fields='id,created_at,reviewed_at,full_name,cpf,phone,email,area,declared_role,current_room,status,source,imported_person_key,account_user_id,activation_email_sent_at,activation_email_error,birth_date,minor_guardian_confirmed_at,age_proof_file_name,age_proof_storage_path,age_proof_confirmed_at';
 return await request('/rest/v1/staff_applications_v60?select='+encodeURIComponent(fields)+'&status=in.(imported,rejected)&order=reviewed_at.desc.nullslast&limit=12');
}

async function resendActivation(app,button,statusEl){
 if(!app.account_user_id){statusEl.textContent='Este cadastro foi concluído antes da automação do acesso.';return}
 button.disabled=true;const old=button.textContent;button.textContent='Enviando...';statusEl.textContent='';
 try{
  await request('/functions/v1/v60-resend-staff-activation',{method:'POST',body:JSON.stringify({applicationId:app.id})});
  statusEl.textContent='Solicitação de recuperação enviada. Confira se o e-mail contém código ou link. Se o link falhar, gere uma senha provisória e entregue somente ao titular.';
  await refreshRecent();
 }catch(e){statusEl.textContent=e.message||'Não foi possível reenviar o e-mail.'}
 finally{button.disabled=false;button.textContent=old}
}

async function createTemporaryPassword(app,button,statusEl){
 if(!confirm('Gerar uma senha provisória para '+app.full_name+'? A senha anterior deixará de funcionar.'))return;
 button.disabled=true;statusEl.textContent='Gerando senha provisória...';
 try{
  const data=await request('/functions/v1/v60-resend-staff-activation',{method:'POST',body:JSON.stringify({applicationId:app.id,action:'temporary-password'})});
  if(!data?.temporaryPassword)throw Error('A senha não foi retornada.');
  statusEl.replaceChildren();
  const msg=document.createElement('div');msg.textContent='Senha provisória criada. Copie e entregue diretamente à pessoa. Não envie em grupos. Ela deve alterá-la após entrar.';
  const pass=document.createElement('code');pass.textContent=data.temporaryPassword;pass.style.display='block';pass.style.fontSize='18px';pass.style.margin='8px 0';
  const copy=document.createElement('button');copy.type='button';copy.textContent='Copiar senha provisória';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pass.textContent);copy.textContent='Copiada!'}catch{copy.textContent='Selecione e copie a senha acima.'}});
  const close=document.createElement('button');close.type='button';close.textContent='Ocultar senha';close.addEventListener('click',()=>{pass.textContent='';copy.remove();close.remove()});
  statusEl.append(msg,pass,copy,close);
 }catch(e){statusEl.textContent=e.message||'Não foi possível gerar a senha provisória.'}
 finally{button.disabled=false}
}

async function loadRecentDocuments(){
 const fields='person_key,issued_on,due_on,verified_manually,created_at';
 return await request('/rest/v1/v58_staff_documents?select='+encodeURIComponent(fields)+'&order=issued_on.desc');
}
function updateRecentAccessStats(rows,accessStatus){
 const panel=document.getElementById('miAccessStatsV68');if(!panel)return;
 const imported=rows.filter(x=>x.status==='imported');
 const statuses=new Map((Array.isArray(accessStatus)?accessStatus:[]).map(s=>[s.applicationId,s]));
 const known=statuses.size>0;
 const noLogin=imported.filter(x=>statuses.get(x.id)?.hasAccount===true&&statuses.get(x.id)?.hasLogin===false).length;
 const disabled=imported.filter(x=>statuses.get(x.id)?.active===false || String(x.activation_email_error||'').startsWith('Acesso antigo desativado:')).length;
 const notLinked=imported.filter(x=>!x.account_user_id).length;
 const emailError=imported.filter(x=>x.activation_email_error&&!String(x.activation_email_error).startsWith('Acesso antigo desativado:')).length;
 panel.textContent='📊 Cadastros aprovados: '+imported.length+' | Primeiro login pendente: '+(known?noLogin:'indisponível')+
  ' | Erros recentes de e-mail: '+emailError+' | Contas desativadas: '+(known?disabled:'indisponível')+' | Sem conta vinculada: '+notLinked+'.';
 const hint=document.createElement('div');hint.style.cssText='font-size:12px;color:#506678;margin-top:6px';
 hint.textContent='Para cada pessoa, confira o cartão abaixo. Falhou o e-mail? Use “Gerar senha provisória”, entregue somente ao titular e peça para ele alterar depois. Conta desativada? Avalie antes de reativar. Não crie logins duplicados.';
 panel.appendChild(hint);
}

function renderRecentRows(rows,documents=null,accessStatus=[]){
 const statuses=new Map((Array.isArray(accessStatus)?accessStatus:[]).map(x=>[x.applicationId,x]));
 if(!recentList)return;
 recentList.replaceChildren();
 if(!rows.length){recentList.textContent='Nenhum cadastro concluído ainda.';return}
 for(const app of rows){
  const oldAccountDisabled=String(app.activation_email_error||'').startsWith('Acesso antigo desativado:');
  const card=document.createElement('div');card.className='mi-recent-card';
  const title=document.createElement('strong');
  title.textContent=(oldAccountDisabled?'⛔ ':app.status==='imported'?'✅ ':'⛔ ')+escText(app.full_name);
  const meta=document.createElement('div');meta.className='mi-recent-meta';
  const entries=[
   ['Situação',oldAccountDisabled?'Acesso antigo desativado — novo cadastro necessário':app.status==='imported'?'Aprovado e importado':'Descartado'],
   ['CPF',fmtCpf(app.cpf)],['WhatsApp',app.phone||'—'],['E-mail',app.email||'—'],
   ['Área informada',areaLabel(app.area)],['Atuação informada',roleLabel(app.declared_role)],
   ['Concluído em',fmtDateTime(app.reviewed_at||app.created_at)],
   ['Certidão estadual',minorBirth(app.birth_date)?'Dispensada — menor de 18 anos':'Conforme documento cadastrado']
  ];
  for(const [k,v] of entries){const d=document.createElement('div'),b=document.createElement('b');b.textContent=k+': ';d.append(b,document.createTextNode(escText(v)));meta.appendChild(d)}
  const mail=document.createElement('p');mail.className='small';
  if(oldAccountDisabled) mail.textContent='⚠️ Conta antiga desativada por endereço de e-mail incorreto. O CPF foi liberado para novo pré-cadastro; não reenvie o link anterior.';
  else if(app.status==='imported'){
   if(app.source==='public-form-v60-password')mail.textContent='🔐 Senha escolhida pelo professor no pré-cadastro. Acesso liberado após aprovação, sem necessidade de e-mail.';
   else if(app.activation_email_error) mail.textContent='⚠️ Problema no último envio do e-mail: '+String(app.activation_email_error).slice(0,180)+'. Se houver limite de envio, use a senha provisória administrativa em vez de repetir o envio agora.';
   else if(app.activation_email_sent_at) mail.textContent='✉️ E-mail para criação da senha enviado em '+fmtDateTime(app.activation_email_sent_at)+'.';
   else if(app.account_user_id) mail.textContent='🟡 Acesso criado, mas o envio automático do e-mail ainda não foi confirmado.';
   else mail.textContent='Cadastro concluído antes da automação do e-mail; os dados permanecem disponíveis aqui.';
  }else mail.textContent='Pré-cadastro descartado; nenhum acesso foi criado.';
  card.append(title,meta,mail);
  const access=statuses.get(app.id);
  if(app.status==='imported'&&!oldAccountDisabled){
   const state=document.createElement('p');state.className='small';state.style.cssText='font-weight:700;padding:8px;border-radius:8px;background:#eef6fa';
   state.textContent=!access?'🔎 Situação do primeiro login indisponível nesta consulta.'
    :!access.hasAccount?'⚠️ Conta de acesso não encontrada.'
    :!access.active?'⛔ Conta de acesso desativada.'
    :access.hasLogin?'✅ Primeiro login registrado.':'🟠 Primeiro login ainda não registrado. A pessoa pode recuperar o acesso em “Primeiro acesso” ou receber uma senha provisória administrativa.';
   card.appendChild(state);
  }
  if(app.status==='imported'&&app.imported_person_key){
   const docs=documents?.filter(d=>d.person_key===app.imported_person_key)||[];
   const latest=docs.sort((a,b)=>String(b.issued_on||'').localeCompare(String(a.issued_on||''))||String(b.created_at||'').localeCompare(String(a.created_at||'')))[0];
   const c=document.createElement('p');c.className='small';
   c.textContent=minorBirth(app.birth_date)?'🟦 Dispensado de atestado estadual (menor de 18 anos). Responsável confirmado pela administração.'
    :documents===null?'📄 Situação da certidão indisponível nesta consulta.'
    :!latest?'⚪ Certidão não localizada no histórico. Consulte o cadastro da equipe.'
    :latest.verified_manually?'✅ Certidão recebida e autenticidade conferida.':'📎 Certidão recebida — falta somente confirmar a autenticidade. Não reenvie.';
   card.appendChild(c);
   if(app.age_proof_storage_path){
    const show=document.createElement('button');show.type='button';show.className='soft';
    show.textContent='🪪 Ver comprovante de idade arquivado';
    show.addEventListener('click',()=>openAgeProof(app,show));card.appendChild(show);
   }
   const match=String(app.imported_person_key).match(/^(teacher|coord):([0-9]+)$/);
   if(match&&!minorBirth(app.birth_date)){
    const review=document.createElement('button');review.type='button';review.className='soft';
    review.textContent=latest&&!latest.verified_manually?'📄 Abrir e conferir certidão recebida':'📄 Ver certidão e histórico';
    review.addEventListener('click',()=>{
     if(typeof window.openPersonCert==='function')window.openPersonCert(match[1],match[2]);
     else alert('Abra a aba Equipe e Permissões para conferir o documento.');
    });
    card.append(review);
   }
  }
  if(app.status==='imported'&&app.account_user_id&&!oldAccountDisabled){
    const resend=document.createElement('button');resend.type='button';resend.className='soft';resend.textContent='✉️ Reenviar e-mail de criação da senha';
    const feedback=document.createElement('span');feedback.className='small';feedback.style.marginLeft='8px';
    resend.addEventListener('click',()=>resendActivation(app,resend,feedback));
    const temporary=document.createElement('button');temporary.type='button';temporary.className='soft';temporary.textContent='🔑 Gerar senha provisória (sem e-mail)';
    temporary.addEventListener('click',()=>createTemporaryPassword(app,temporary,feedback));
    if(app.source==='public-form-v60-password')card.append(temporary,feedback);
    else card.append(resend,temporary,feedback);
  }
  recentList.appendChild(card);
 }
}

async function refreshRecent(silent=false){
 ensureRecentUI();
 if(!isAdmin()||!recentList)return;
 if(recentRefreshing)return;
 recentRefreshing=true;
 if(!silent)recentList.textContent='Carregando cadastros concluídos...';
 try{
  const rows=await loadRecentRows();
  let docs=null,accessStatus=[];
  try{docs=await loadRecentDocuments()}catch(_){/* Mantém os cadastros disponíveis. */}
  try{accessStatus=await request('/rest/v1/rpc/v60_staff_activation_status',{method:'POST',body:'{}'})}catch(_){/* Sem bloquear a consulta. */}
  updateRecentAccessStats(rows,accessStatus);
  renderRecentRows(rows,docs,accessStatus);
 }
 catch(e){if(!silent)recentList.textContent=e.message||'Não foi possível consultar os cadastros concluídos.'}
 finally{recentRefreshing=false}
}

function setCount(n){
 n=Number(n)||0;
 if(shortcut){
  shortcut.textContent=n?('🔴 Pré-cadastros pendentes: '+n):'Pré-cadastros pendentes: 0';
  shortcut.className=n?'red':'soft';
 }
 for(const badge of [navBadge,homeBadge]){
  if(!badge)continue;badge.textContent=String(n);badge.hidden=n===0;
 }
}

async function request(path,opts={}){
 const token=window.miAuthTokenV58;
 if(!token||window.miAuthRoleV58!=='developer')throw Error('Entre como administrador.');
 const r=await fetch(BASE+path,{...opts,headers:{apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json',...(opts.headers||{})}});
 const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok)throw Error(data?.message||data?.error||'Operação não concluída.');
 return data;
}

async function loadRows(){
 const fields='id,created_at,full_name,cpf,phone,email,area,declared_role,current_room,notes,source,account_user_id,cert_issued_on,cert_file_name,cert_storage_path,birth_date,minor_guardian_name,minor_guardian_phone,age_proof_file_name,age_proof_storage_path,age_proof_confirmed_at';
 return await request('/rest/v1/staff_applications_v60?select='+encodeURIComponent(fields)+'&status=eq.pending&order=created_at.asc');
}

function checkbox(name,label,checked){
 const l=document.createElement('label'),i=document.createElement('input'),span=document.createElement('span');
 i.type='checkbox';i.dataset.perm=name;i.checked=!!checked;span.textContent=label;l.append(i,span);return l;
}
function permissionsFor(role,container,area){
 container.replaceChildren();
 const isEbd=area==='ebd',isNet=area==='net';
 const defs=role==='teacher'
  ?[['net','Rede de Crianças / check-in',isNet],['tal','Talentos EBD',isEbd],['fin','Financeiro',false],['rep','Relatórios',false],['kids','Cadastrar crianças',false]]
  :[['ebd','EBD',isEbd],['net','Rede de Crianças / check-in',isNet],['tal','Talentos',false],['fin','Financeiro',false],['repEbd','Relatórios EBD',isEbd],['repNet','Relatórios Rede',isNet],['importKids','Importar cadastros',false],['addCoords','Cadastrar coordenadores',false]];
 for(const [k,l,c] of defs)container.appendChild(checkbox(k,l,c));
}
function selectedPermissions(container){
 const p={};container.querySelectorAll('input[data-perm]').forEach(i=>p[i.dataset.perm]=i.checked);return p;
}

async function openCertificate(app,button){
 button.disabled=true;const old=button.textContent;button.textContent='Abrindo...';
 try{
  const token=window.miAuthTokenV58;
  const r=await fetch(BASE+'/storage/v1/object/authenticated/certidoes-ministerio/'+encodeURI(app.cert_storage_path),{headers:{apikey:KEY,Authorization:'Bearer '+token}});
  if(!r.ok)throw Error('Não foi possível abrir a certidão.');
  const url=URL.createObjectURL(await r.blob());
  const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.download=app.cert_file_name||'certidao';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
 }catch(e){alert(e.message||'Falha ao abrir a certidão.')}
 finally{button.disabled=false;button.textContent=old}
}

async function openAgeProof(app,button){
 const path=String(app.age_proof_storage_path||'');
 if(!path){alert('Comprovante de idade ausente. Solicite o documento antes de aprovar.');return;}
 button.disabled=true;const old=button.textContent;button.textContent='Abrindo documento...';
 const win=window.open('','_blank');
 if(win){try{win.document.title='Comprovante de idade';win.document.body.textContent='Abrindo documento privado...';}catch(_){}}
 try{
  const token=window.miAuthTokenV58;
  if(!token)throw Error('Sua sessão administrativa expirou.');
  const url=BASE+'/storage/v1/object/authenticated/certidoes-ministerio/'+path.split('/').map(encodeURIComponent).join('/');
  const response=await fetch(url,{headers:{apikey:KEY,Authorization:'Bearer '+token},cache:'no-store'});
  if(!response.ok)throw Error('Não foi possível abrir o comprovante de idade.');
  const blob=await response.blob();
  const suffix=path.split('.').pop()?.toLowerCase();
  const fallbackType=({pdf:'application/pdf',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp'})[suffix];
  const contentType=['application/pdf','image/jpeg','image/png','image/webp'].includes(blob.type)?blob.type:fallbackType;
  if(!contentType)throw Error('Formato inesperado.');
  const typed=new Blob([blob],{type:contentType});
  const local=URL.createObjectURL(typed);
  if(win&&!win.closed)win.location.href=local;
  else{const a=document.createElement('a');a.href=local;a.download=app.age_proof_file_name||'comprovante-idade';document.body.appendChild(a);a.click();a.remove();}
  setTimeout(()=>URL.revokeObjectURL(local),120000);
 }catch(e){if(win&&!win.closed)win.close();alert(e.message||'Falha ao abrir o comprovante.')}
 finally{button.disabled=false;button.textContent=old}
}

function renderCard(app){
 const minor=minorBirth(app.birth_date);
 const card=document.createElement('article');card.className='mi-pending-card';
 card.dataset.applicationId=String(app.id);card.dataset.searchName=String(app.full_name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const head=document.createElement('div');head.className='mi-pending-title';
 const name=document.createElement('strong');name.textContent=escText(app.full_name);
 const when=document.createElement('span');when.className='small';when.textContent='Enviado em '+fmtDateTime(app.created_at);
 head.append(name,when);

 const meta=document.createElement('div');meta.className='mi-pending-meta';
 const entries=[
  ['CPF',fmtCpf(app.cpf)],['WhatsApp',app.phone||'—'],['E-mail',app.email||'—'],
  ['Área informada',areaLabel(app.area)],['Atuação informada',roleLabel(app.declared_role)],
  ['Sala/turma informada',app.current_room||'—'],
  ['Nascimento',fmtDate(app.birth_date)],
  ['Certidão estadual',minor?'Dispensada por menoridade':'Emissão: '+fmtDate(app.cert_issued_on)],
  ...(minor?[['Responsável legal',app.minor_guardian_name||'—'],['Telefone do responsável',app.minor_guardian_phone||'—']]:[])
 ];
 for(const [k,v] of entries){const d=document.createElement('div');const b=document.createElement('b');b.textContent=k+': ';d.append(b,document.createTextNode(escText(v)));meta.appendChild(d)}
 meta.hidden=true;
 card.append(head);
 const quick=document.createElement('p');quick.className='mi-pending-quick';
 quick.textContent='⏳ Aguardando aprovação • '+roleLabel(app.declared_role)+' • '+areaLabel(app.area)+(minor?' • 🟦 Menor — sem certidão estadual':' • 📎 Certidão recebida');
 const review=document.createElement('button');review.type='button';review.className='soft mi-pending-review';
 review.textContent='Revisar e aprovar este cadastro';
 card.append(quick,review,meta);
 if(app.notes){const obs=document.createElement('p');obs.className='small';obs.textContent='Observações: '+app.notes;card.appendChild(obs)}

 const info=document.createElement('p');info.className='small';
 info.textContent=minor?'🟦 Menor de 18 anos: certidão estadual dispensada. Abra o comprovante, confira a data de nascimento e confirme a autorização do responsável.':'📎 Certidão já recebida no pré-cadastro. Ao aprovar, o arquivo será arquivado automaticamente na equipe; não é necessário reenviar.';
 card.appendChild(info);
 const cert=document.createElement('button');cert.type='button';cert.className='soft';cert.textContent='📄 Ver / baixar certidão recebida';cert.addEventListener('click',()=>openCertificate(app,cert));if(!minor)card.appendChild(cert);
 const proofButton=document.createElement('button');proofButton.type='button';proofButton.className='soft';
 proofButton.textContent='🪪 Abrir comprovante de idade recebido';
 if(minor){proofButton.addEventListener('click',()=>openAgeProof(app,proofButton));card.appendChild(proofButton);}
 proofButton.classList.add('mi-pending-intro-detail');proofButton.hidden=true;

 const config=document.createElement('div');config.className='mi-pending-config';config.hidden=true;
 const subtitle=document.createElement('h4');subtitle.textContent='Confirmar função e permissões';
 const grid=document.createElement('div');grid.className='mi-pending-grid';
 const roleWrap=document.createElement('div'),areaWrap=document.createElement('div'),roomWrap=document.createElement('div');
 const roleLabelEl=document.createElement('label');roleLabelEl.textContent='Cadastrar como';
 const role=document.createElement('select');
 [['teacher','Professor(a)'],['coordinator','Coordenador(a)'],['office','Escritório']].forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;role.appendChild(o)});
 role.value=app.declared_role==='coordinator'?'coordinator':app.declared_role==='office'?'office':'teacher';
 roleLabelEl.appendChild(role);roleWrap.appendChild(roleLabelEl);

 const areaLabelEl=document.createElement('label');areaLabelEl.textContent='Área principal no aplicativo';
 const area=document.createElement('select');
 [['ebd','EBD'],['net','Rede de Crianças']].forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;area.appendChild(o)});
 area.value=app.area==='net'?'net':'ebd';areaLabelEl.appendChild(area);areaWrap.appendChild(areaLabelEl);

 const roomLabel=document.createElement('label');roomLabel.textContent='Sala EBD';
 const room=document.createElement('select');roomLabel.appendChild(room);roomWrap.appendChild(roomLabel);
 grid.append(roleWrap,areaWrap,roomWrap);

 const roomNote=document.createElement('p');roomNote.className='small';
 const perms=document.createElement('div');perms.className='mi-pending-perms';
 const advanced=document.createElement('details');advanced.className='mi-pending-perm-extra';
 const advancedLabel=document.createElement('summary');advancedLabel.textContent='⚙️ Ver ou alterar permissões individuais (opcional)';
 advanced.append(advancedLabel,perms);
 const permTip=document.createElement('p');permTip.className='small';permTip.textContent='As permissões sugeridas já estão preenchidas. Abra esta seção somente se precisar de alguma autorização diferente.';advanced.append(permTip);
 const actions=document.createElement('div');actions.className='mi-pending-actions';
 const approve=document.createElement('button');approve.type='button';approve.className='green';approve.textContent='✅ APROVAR CADASTRO E LIBERAR ACESSO';
 const reject=document.createElement('button');reject.type='button';reject.className='red';reject.textContent='Descartar pré-cadastro';
 actions.append(approve);
 const danger=document.createElement('details');danger.className='mi-pending-danger';const dangerTitle=document.createElement('summary');dangerTitle.textContent='Outras opções: descartar este pré-cadastro';danger.append(dangerTitle,reject);
 const feedback=document.createElement('p');feedback.className='small mi-pending-review-status';feedback.setAttribute('role','status');
 feedback.textContent=minor?'A certidão estadual é dispensada. A aprovação só será concluída após confirmar a idade e autorização do responsável legal.':'O cadastro será aprovado com os dados e permissões acima. A certidão recebida já será vinculada automaticamente.';
 const checkLabel=document.createElement('label');checkLabel.className='mi-pending-verify';
 const certChecked=document.createElement('input');certChecked.type='checkbox';
 const checkText=document.createElement('span');checkText.textContent='Já conferi a autenticidade da certidão no site oficial. Marcar é opcional: se não conferi, posso aprovar e verificar o documento depois.';
 checkLabel.append(certChecked,checkText);
 checkLabel.hidden=minor;
 const guardianLabel=document.createElement('label');guardianLabel.className='mi-pending-verify';
 const guardianConfirmed=document.createElement('input');guardianConfirmed.type='checkbox';
 const guardianText=document.createElement('span');
 guardianText.textContent='CONFIRMO que conferi a data de nascimento, obtive autorização do responsável legal e organizei supervisão por adulto para a atuação da pessoa menor de 18 anos.';
 guardianLabel.append(guardianConfirmed,guardianText);guardianLabel.hidden=!minor;
 const proofLabel=document.createElement('label');proofLabel.className='mi-pending-verify';proofLabel.hidden=!minor;
 const proofChecked=document.createElement('input');proofChecked.type='checkbox';
 const proofText=document.createElement('span');proofText.textContent='CONFIRMO que abri e conferi o RG, CIN ou certidão de nascimento e que a data de nascimento coincide com o pré-cadastro.';
 proofLabel.append(proofChecked,proofText);
 const detailToggle=()=>{
  const opening=config.hidden;
  document.querySelectorAll('#miPendingListV60 .mi-pending-config').forEach(el=>{el.hidden=true;});
  document.querySelectorAll('#miPendingListV60 .mi-pending-meta').forEach(el=>{el.hidden=true;});
  document.querySelectorAll('#miPendingListV60 .mi-pending-review').forEach(el=>{el.textContent='Revisar e aprovar este cadastro';});
  document.querySelectorAll('#miPendingListV60 .mi-pending-card').forEach(el=>el.classList.remove('mi-pending-expanded'));
  const cards=[...document.querySelectorAll('#miPendingListV60 .mi-pending-card')];
  cards.forEach(el=>el.querySelectorAll('.mi-pending-intro-detail').forEach(n=>n.hidden=true));
  config.hidden=!opening;meta.hidden=!opening;info.hidden=!opening;if(!minor)cert.hidden=!opening;else proofButton.hidden=!opening;
  focusedApplicationId=opening?String(app.id):null;
  review.textContent=opening?'Fechar revisão deste cadastro':'Revisar e aprovar este cadastro';
  if(opening){card.classList.add('mi-pending-expanded');card.scrollIntoView({behavior:'smooth',block:'start'});}
 };
 review.addEventListener('click',detailToggle);
 const shouldExpand=focusedApplicationId===String(app.id);
 if(shouldExpand){config.hidden=false;meta.hidden=false;review.textContent='Fechar revisão deste cadastro';card.classList.add('mi-pending-expanded');}
 info.classList.add('mi-pending-intro-detail');cert.classList.add('mi-pending-intro-detail');info.hidden=!shouldExpand;if(!minor)cert.hidden=!shouldExpand;else proofButton.hidden=!shouldExpand;

 const syncRoom=()=>{
  room.replaceChildren();
  const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecione a sala...';room.appendChild(placeholder);
  const rooms=(typeof d!=='undefined'&&Array.isArray(d.rooms))?d.rooms:[];
  for(const r of rooms){const o=document.createElement('option');o.value=r;o.textContent=r;room.appendChild(o)}
  if(app.current_room&&rooms.includes(app.current_room))room.value=app.current_room;
  else if(rooms.length===1&&role.value==='teacher'&&area.value==='ebd')room.value=rooms[0];
  const need=role.value==='teacher'&&area.value==='ebd';
  roomWrap.style.display=need?'block':'none';room.required=need;
  roomNote.textContent=app.area==='both'?'A pessoa informou atuação nas duas áreas; escolha aqui a área principal para este acesso.':'';
 };
 const rebuildPerms=()=>{permissionsFor(role.value,perms,area.value);syncRoom()};
 role.addEventListener('change',rebuildPerms);area.addEventListener('change',rebuildPerms);
 rebuildPerms();

 approve.addEventListener('click',async()=>{
  if(minor&&!guardianConfirmed.checked){feedback.textContent='Antes de aprovar a pessoa menor, confirme a identidade, autorização do responsável e supervisão de adulto.';return}
  if(minor&&!app.age_proof_storage_path){feedback.textContent='Comprovante de idade não anexado. Não é possível aprovar.';return}
  if(minor&&!proofChecked.checked){feedback.textContent='Abra o comprovante de idade e confirme a data de nascimento.';return}
  if(role.value==='teacher'&&area.value==='ebd'&&!room.value){feedback.textContent='Selecione a sala da EBD antes de aprovar.';return}
  // A aprovacao e operacao AUTENTICADA e TRANSACIONAL no Supabase.
  // Nao depende do indicador de sincronizacao do estado local do admin.
  // Dados locais nao salvos ficam preservados: ver sincronizacao apos sucesso.
  if(!isAdmin()){
   feedback.textContent='Sua sessao administrativa expirou. Entre novamente antes de aprovar.';
   return;
  }
  const verdict='Aprovar o cadastro de '+app.full_name+'?\n\nPerfil: '+roleLabel(role.value)+'\nÁrea: '+areaLabel(area.value)
   +(role.value==='teacher'&&area.value==='ebd'?'\nSala: '+room.value:'')
   +'\nCertidão: '+(minor?'dispensada por menoridade; documento de idade, responsável e acompanhamento confirmados':certChecked.checked?'autenticidade conferida por você':'recebida, autenticidade a conferir')
   +'\n\nO acesso será liberado e '+(minor?'a dispensa da certidão estadual será registrada.':'a certidão existente será vinculada automaticamente.');
  if(!confirm(verdict))return;
  approve.disabled=true;reject.disabled=true;feedback.textContent='Importando cadastro...';
  try{
   const result=await request('/functions/v1/v60-admin-import-staff-application',{method:'POST',body:JSON.stringify({
    applicationId:app.id,targetRole:role.value,targetArea:area.value,room:room.value||'',permissions:{...selectedPermissions(perms),minorGuardianConfirmed:minor&&guardianConfirmed.checked,minorAgeProofConfirmed:minor&&proofChecked.checked}
   })});
   let checkedResult=false,checkError='';
   if(!minor&&certChecked.checked&&result.personKey){
    try{
     const docs=await request('/rest/v1/v58_staff_documents?select=id,person_key,verified_manually&person_key=eq.'+encodeURIComponent(result.personKey)+'&order=created_at.desc&limit=1');
     const doc=Array.isArray(docs)?docs[0]:null;
     if(!doc)throw Error('Documento transferido ainda não localizado.');
     if(!doc.verified_manually)await request('/rest/v1/rpc/v64_confirm_existing_staff_certificate',{method:'POST',body:JSON.stringify({p_document_id:doc.id})});
     checkedResult=true;
    }catch(e){checkError=e.message||'Não foi possível marcar a conferência.';}
   }
   focusedApplicationId=null;
   if(searchPending)searchPending.value='';
   const completed='✅ '+app.full_name+': CADASTRO APROVADO, acesso criado. '+(minor?'Atestado estadual dispensado; comprovante de idade e autorização do responsável confirmados.': 'Certidão anexada. '+(checkedResult?'Autenticidade conferida.':certChecked.checked?'Não foi possível registrar a conferência: '+checkError+' Use a opção do cadastro concluído.':'Autenticidade ainda não conferida.'))
    +(result.passwordReady?' Senha já escolhida no pré-cadastro. Acesso liberado sem e-mail.':result.emailSent?' E-mail para criar a senha enviado.':' E-mail não enviado; poderá ser reenviado.');
   successLine.textContent=completed;successLine.hidden=false;
   if(recentPanel)recentPanel.open=true;
   // A aprovacao ja foi confirmada no servidor. So atualizar o estado global
   // se nao houver alteracoes locais pendentes, para nunca descartar trabalho.
   const cloudAfter=window.miCloudState?.();
   if(cloudAfter?.connected && cloudAfter.saved && !cloudAfter.blocked){
    try{await window.miCloudInit?.(window.miAuthTokenV58);}
    catch(e){successLine.textContent+=' A conta ja foi criada, mas nao foi possivel sincronizar a tela geral: '+(e?.message||'reabra a sessao')+'.';}
   }else{
    successLine.textContent+=' A aprovacao ficou registrada no servidor. A sincronizacao da tela geral continua pendente; preserve eventuais backups locais antes de recarregar.';
   }
   try{await refreshPending();await refreshRecent();}catch(e){successLine.textContent+=' Atualize a lista de aprovados para consultar este cadastro.';}
   if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
   if(!result.emailSent&&!result.passwordReady)alert('O cadastro foi aprovado e o acesso foi criado, mas o e-mail automático não foi enviado. Use o botão “Reenviar e-mail de criação da senha” nos cadastros concluídos.');
  }catch(e){
   const reason=e?.message||'Não foi possível importar o cadastro.';
   const message='❌ Aprovação não concluída para '+app.full_name+': '+reason;
   feedback.textContent=message;
   if(successLine){successLine.textContent=message+' O pré-cadastro permanece pendente e pode ser tentado novamente.';successLine.hidden=false;}
   approve.disabled=false;reject.disabled=false;
   alert(message+'\n\nO cadastro não foi aprovado. Confira a mensagem antes de tentar novamente.');
   if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
  }
 });

 reject.addEventListener('click',async()=>{
  if(!confirm('Descartar o pré-cadastro de '+app.full_name+'? Ele sairá da fila e não será incluído na equipe.'))return;
  approve.disabled=true;reject.disabled=true;feedback.textContent='Descartando...';
  try{const outcome=await request('/functions/v1/v60-admin-import-staff-application',{method:'POST',body:JSON.stringify({applicationId:app.id,action:'reject'})});if(outcome.cleanupWarning)alert(outcome.cleanupWarning);await refreshPending();await refreshRecent()}
  catch(e){feedback.textContent=e.message||'Não foi possível descartar.';approve.disabled=false;reject.disabled=false}
 });

 config.append(subtitle,grid,roomNote,advanced,checkLabel,proofLabel,guardianLabel,actions,feedback,danger);card.appendChild(config);
 return card;
}

function filterPendingCards(){
 if(!list)return;
 const query=(searchPending?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 list.querySelectorAll('.mi-pending-card').forEach(card=>{card.hidden=!!query&&!card.dataset.searchName.includes(query)});
}
function renderRows(rows){
 list.replaceChildren();
 if(!rows.length){const p=document.createElement('p');p.textContent='Nenhum pré-cadastro aguardando análise.';list.appendChild(p);return}
 for(const app of rows)list.appendChild(renderCard(app));
 filterPendingCards();
}

async function refreshPending(silent=false){
 ensureUI();
 if(!isAdmin()){setCount(0);if(panel)panel.hidden=true;return}
 if(refreshing)return;
 // Não recrie campos no meio da revisão de um administrador.
 if(silent&&focusedApplicationId)return;
 refreshing=true;
 if(!silent&&list)list.textContent='Carregando pré-cadastros...';
 try{
  const rows=await loadRows();setCount(rows.length);
  if(panel&&!panel.hidden)renderRows(rows);
 }catch(e){
  if(!silent&&list)list.textContent=e.message||'Não foi possível consultar os pré-cadastros.';
 }finally{refreshing=false}
}
window.miPendingApplicationsRefreshV60=refreshPending;

function ready(){ensureUI();if(isAdmin()){refreshPending();refreshRecent()}}
window.addEventListener('mi-auth-ready',ready);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&isAdmin()){refreshPending(true);refreshRecent(true)}});
setInterval(()=>{if(!document.hidden&&isAdmin()){refreshPending(true);refreshRecent(true)}},30000);
setTimeout(ready,1200);
})();