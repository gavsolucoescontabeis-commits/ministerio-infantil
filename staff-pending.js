(()=>{
'use strict';
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
let panel=null,list=null,shortcut=null,navBadge=null,homeBadge=null,refreshing=false;

function isAdmin(){return window.miAuthRoleV58==='developer'&&!!window.miAuthTokenV58}
function escText(v){return String(v??'')}
function fmtCpf(v){const n=String(v||'').replace(/\D/g,'');return n.length===11?n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4'):n}
function fmtDate(v){if(!v)return '—';const p=String(v).slice(0,10).split('-');return p.length===3?p.reverse().join('/'):'—'}
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
 const hero=people?.querySelector('.hero');
 if(!people||!hero)return;

 shortcut=document.createElement('button');
 shortcut.id='miPendingShortcutV60';shortcut.type='button';shortcut.className='soft';
 shortcut.textContent='Pré-cadastros pendentes: 0';
 hero.appendChild(shortcut);

 panel=document.createElement('section');
 panel.id='miPendingPanelV60';panel.className='card';panel.hidden=true;
 const title=document.createElement('h3');title.textContent='🔴 Pré-cadastros recebidos';
 const help=document.createElement('p');help.className='small';help.textContent='Confira cada ficha, veja a certidão e defina o cadastro e as permissões antes de importar para a equipe.';
 const actions=document.createElement('div');actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px';
 const refresh=document.createElement('button');refresh.type='button';refresh.className='soft';refresh.textContent='Atualizar pendentes';
 const close=document.createElement('button');close.type='button';close.className='soft';close.textContent='Fechar';
 actions.append(refresh,close);
 list=document.createElement('div');list.id='miPendingListV60';list.setAttribute('role','status');
 panel.append(title,help,actions,list);
 hero.insertAdjacentElement('afterend',panel);

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
 const fields='id,created_at,full_name,cpf,phone,email,area,declared_role,current_room,notes,cert_issued_on,cert_file_name,cert_storage_path';
 return await request('/rest/v1/staff_applications_v60?select='+encodeURIComponent(fields)+'&status=eq.pending&order=created_at.asc');
}

function checkbox(name,label,checked){
 const l=document.createElement('label'),i=document.createElement('input'),span=document.createElement('span');
 i.type='checkbox';i.dataset.perm=name;i.checked=!!checked;span.textContent=label;l.append(i,span);return l;
}
function permissionsFor(role,container){
 container.replaceChildren();
 const defs=role==='teacher'
  ?[['tal','Talentos',true],['fin','Financeiro',false],['rep','Relatórios',false],['kids','Cadastrar crianças',false]]
  :[['ebd','EBD',true],['net','Rede de Crianças',true],['tal','Talentos',false],['fin','Financeiro',false],['repEbd','Relatórios EBD',true],['repNet','Relatórios Rede',true],['importKids','Importar cadastros',false],['addCoords','Cadastrar coordenadores',false]];
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

function renderCard(app){
 const card=document.createElement('article');card.className='mi-pending-card';
 const head=document.createElement('div');head.className='mi-pending-title';
 const name=document.createElement('strong');name.textContent=escText(app.full_name);
 const when=document.createElement('span');when.className='small';when.textContent='Enviado em '+fmtDateTime(app.created_at);
 head.append(name,when);

 const meta=document.createElement('div');meta.className='mi-pending-meta';
 const entries=[
  ['CPF',fmtCpf(app.cpf)],['WhatsApp',app.phone||'—'],['E-mail',app.email||'—'],
  ['Área informada',areaLabel(app.area)],['Atuação informada',roleLabel(app.declared_role)],
  ['Sala/turma informada',app.current_room||'—'],['Emissão da certidão',fmtDate(app.cert_issued_on)]
 ];
 for(const [k,v] of entries){const d=document.createElement('div');const b=document.createElement('b');b.textContent=k+': ';d.append(b,document.createTextNode(escText(v)));meta.appendChild(d)}
 card.append(head,meta);
 if(app.notes){const obs=document.createElement('p');obs.className='small';obs.textContent='Observações: '+app.notes;card.appendChild(obs)}

 const cert=document.createElement('button');cert.type='button';cert.className='soft';cert.textContent='📄 Abrir/baixar certidão';cert.addEventListener('click',()=>openCertificate(app,cert));card.appendChild(cert);

 const config=document.createElement('div');config.className='mi-pending-config';
 const subtitle=document.createElement('h4');subtitle.textContent='Confirmar cadastro e permissões';
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
 const actions=document.createElement('div');actions.className='mi-pending-actions';
 const approve=document.createElement('button');approve.type='button';approve.className='green';approve.textContent='✅ Aprovar e importar';
 const reject=document.createElement('button');reject.type='button';reject.className='red';reject.textContent='Descartar pré-cadastro';
 actions.append(approve,reject);
 const feedback=document.createElement('p');feedback.className='small';feedback.setAttribute('role','status');

 const syncRoom=()=>{
  room.replaceChildren();
  const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecione a sala...';room.appendChild(placeholder);
  for(const r of (window.d?.rooms||[])){}
  const rooms=(typeof d!=='undefined'&&Array.isArray(d.rooms))?d.rooms:[];
  for(const r of rooms){const o=document.createElement('option');o.value=r;o.textContent=r;room.appendChild(o)}
  if(app.current_room&&rooms.includes(app.current_room))room.value=app.current_room;
  const need=role.value==='teacher'&&area.value==='ebd';
  roomWrap.style.display=need?'block':'none';room.required=need;
  roomNote.textContent=app.area==='both'?'A pessoa informou atuação nas duas áreas; escolha aqui a área principal para este acesso.':'';
 };
 const rebuildPerms=()=>{permissionsFor(role.value,perms);syncRoom()};
 role.addEventListener('change',rebuildPerms);area.addEventListener('change',syncRoom);
 rebuildPerms();

 approve.addEventListener('click',async()=>{
  if(role.value==='teacher'&&area.value==='ebd'&&!room.value){feedback.textContent='Selecione a sala da EBD antes de aprovar.';return}
  const cloud=window.miCloudState?.();
  if(!cloud?.connected||cloud.blocked){feedback.textContent='A nuvem não está disponível para uma aprovação segura.';return}
  if(!cloud.saved){feedback.textContent='Aguarde as alterações atuais serem salvas na nuvem antes de importar este cadastro.';return}
  if(!confirm('Confirma a aprovação e importação de '+app.full_name+'?'))return;
  approve.disabled=true;reject.disabled=true;feedback.textContent='Importando cadastro...';
  try{
   await request('/functions/v1/v60-admin-import-staff-application',{method:'POST',body:JSON.stringify({
    applicationId:app.id,targetRole:role.value,targetArea:area.value,room:room.value||'',permissions:selectedPermissions(perms)
   })});
   feedback.textContent='Cadastro importado. Atualizando a equipe...';
   await window.miCloudInit?.(window.miAuthTokenV58);
   await refreshPending();
  }catch(e){feedback.textContent=e.message||'Não foi possível importar o cadastro.';approve.disabled=false;reject.disabled=false}
 });

 reject.addEventListener('click',async()=>{
  if(!confirm('Descartar o pré-cadastro de '+app.full_name+'? Ele sairá da fila e não será incluído na equipe.'))return;
  approve.disabled=true;reject.disabled=true;feedback.textContent='Descartando...';
  try{await request('/rest/v1/rpc/v60_reject_staff_application',{method:'POST',body:JSON.stringify({p_application_id:app.id})});await refreshPending()}
  catch(e){feedback.textContent=e.message||'Não foi possível descartar.';approve.disabled=false;reject.disabled=false}
 });

 config.append(subtitle,grid,roomNote,perms,actions,feedback);card.appendChild(config);
 return card;
}

function renderRows(rows){
 list.replaceChildren();
 if(!rows.length){const p=document.createElement('p');p.textContent='Nenhum pré-cadastro aguardando análise.';list.appendChild(p);return}
 for(const app of rows)list.appendChild(renderCard(app));
}

async function refreshPending(silent=false){
 ensureUI();
 if(!isAdmin()){setCount(0);if(panel)panel.hidden=true;return}
 if(refreshing)return;
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

function ready(){ensureUI();if(isAdmin())refreshPending()}
window.addEventListener('mi-auth-ready',ready);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&isAdmin())refreshPending(true)});
setInterval(()=>{if(!document.hidden&&isAdmin())refreshPending(true)},30000);
setTimeout(ready,1200);
})();