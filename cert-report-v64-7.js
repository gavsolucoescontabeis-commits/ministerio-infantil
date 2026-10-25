/* Ministério Infantil V64.7: relatórios de certidões para Coordenação/Escritório.
   Só consulta o RPC v64_staff_certificate_report, que valida permissões no servidor.
   Nenhum CPF, PDF ou caminho de arquivo é transmitido a essas contas. */
(()=>{
"use strict";
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
const el=id=>document.getElementById(id);
const meta={
 minor:{label:'Dispensada — menor de 18 anos',icon:'🟦',detail:'O Paraná não emite atestado estadual antes dos 18 anos; mantenha os cuidados de proteção e a supervisão por adulto.'},
 missing:{label:'Sem certidão',icon:'⚪',detail:'Solicitar apresentação do documento'},
 unverified:{label:'Aguardando conferência',icon:'📎',detail:'Documento recebido; autenticidade ainda não conferida'},
 expired:{label:'Vencida',icon:'🔴',detail:'Solicitar renovação imediatamente'},
 due15:{label:'Vence em até 15 dias',icon:'🟠',detail:'Solicitar renovação'},
 due30:{label:'Vence em 16 a 30 dias',icon:'🟡',detail:'Planejar renovação'},
 regular:{label:'Regular',icon:'🟢',detail:'Autenticidade conferida e dentro da validade'}
};
let rows=[],asOf=null,hasData=false,admin=false,loading=false;
const allowed=()=>{
 const role=window.miAuthRoleV58,live=window.miLiveAccessV58;
 if(role==='developer')return true;
 return role==='coordinator'&&live?.role==='coordinator'&&
    (live.permissions?.repEbd===true||live.permissions?.repNet===true);
};
const date=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''))?s.split('-').reverse().join('/'):'—';
const area=v=>v==='ebd'?'EBD':v==='net'?'Rede de Crianças':v||'—';
const term=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const mk=(tag,className,text)=>{
 const x=document.createElement(tag);
 if(className)x.className=className;
 if(text!==undefined)x.textContent=String(text);
 return x;
};
function visibility(){
 const panel=el('miV647CertReport');
 if(!panel)return;
 panel.hidden=!allowed();
 if(panel.hidden){hasData=false;rows=[];el('miV647CertEntries')?.replaceChildren();}
}
function summary(list){
 const stats=el('miV647CertStats');
 if(!stats)return;
 stats.replaceChildren();
 const counters=[
  ['Pessoas',list.length],
  ['Vencidas',list.filter(x=>x.status==='expired').length],
  ['Sem certidão',list.filter(x=>x.status==='missing').length],
  ['Para conferir',list.filter(x=>x.status==='unverified').length],
  ['Até 30 dias',list.filter(x=>['due15','due30'].includes(x.status)).length],
  ['Regulares',list.filter(x=>x.status==='regular').length],
  ['Menores (dispensados)',list.filter(x=>x.status==='minor').length]
 ];
 counters.forEach(([label,n])=>{
  const item=mk('div','miV647Metric');
  item.append(mk('strong','',n),mk('span','',label));
  stats.appendChild(item);
 });
}
function filtered(){
 const filter=el('miV647CertFilter')?.value||'all',a=el('miV647CertArea')?.value||'all';
 const search=term(el('miV647CertSearch')?.value.trim());
 return rows.filter(x=>
   (filter==='all'||(filter==='action'?!['regular','minor'].includes(x.status):x.status===filter))&&
   (a==='all'||x.area===a)&&
   (!search||term(x.name).includes(search)||term(x.role).includes(search))
 );
}
function reminder(item){
 const first=String(item.name||'').trim().split(/\s+/)[0];
 if(item.status==='minor')return 'Olá, '+first+'! Sua certidão estadual está dispensada enquanto você for menor de 18 anos. A equipe entrará em contato quando chegar a idade para apresentar o documento.';
 if(item.status==='missing')return 'Olá, '+first+'! Precisamos receber sua certidão de antecedentes criminais para manter o cadastro do Ministério Infantil atualizado. Por favor, encaminhe o documento à coordenação. Obrigado!';
 if(item.status==='unverified')return 'Olá, '+first+'! Recebemos sua certidão de antecedentes criminais. A coordenação está acompanhando a conferência da autenticidade. Caso seja necessário, entraremos em contato. Obrigado!';
 return 'Olá, '+first+'! O Ministério Infantil está atualizando o controle de certidões de antecedentes criminais. A sua tem previsão de renovação em '+date(item.due)+'. Pedimos, por favor, que providencie uma certidão atualizada e encaminhe à coordenação. Obrigado!';
}
async function copyReminder(item,button){
 try{
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(reminder(item));
  else{window.prompt('Copie a mensagem para enviar:',reminder(item));return;}
  button.textContent='✅ Mensagem copiada';
  button.setAttribute('aria-label','Mensagem copiada para a área de transferência');
 }catch(_){
  window.prompt('Copie a mensagem para enviar:',reminder(item));
 }
}
function render(){
 if(!hasData)return;
 const shown=filtered(),entries=el('miV647CertEntries'),info=el('miV647CertInfo');
 if(!entries)return;
 entries.replaceChildren();
 summary(rows);
 info.textContent='Referência: '+date(asOf)+' • Exibindo '+shown.length+' de '+rows.length+' pessoas autorizadas.';
 if(!shown.length){entries.append(mk('p','small','Nenhum cadastro encontrado para estes filtros.'));return}
 shown.forEach(item=>{
  const cfg=meta[item.status]||meta.missing;
  const card=mk('article','miV647Entry');
  const top=mk('div','miV647EntryTop');
  const person=mk('div','miV647EntryPerson');
  person.append(mk('strong','',item.name||'Sem nome'),mk('span','small',item.role+' • '+area(item.area)));
  const status=mk('span','miV647Status miV647Status-'+item.status,cfg.icon+' '+cfg.label);
  top.append(person,status);card.append(top);
  const due=mk('p','miV647Dates',item.status==='minor'?'Certidão estadual exigível a partir de '+date(item.nextRequiredOn):'Emissão: '+date(item.issued)+'   |   Vencimento/renovação: '+date(item.due));
  const note=mk('p','small',cfg.detail);
  card.append(due,note);
  const buttons=mk('div','miV647Actions');
  if(!['regular','minor'].includes(item.status)){
   const copy=mk('button','soft','📋 Copiar mensagem de acompanhamento');
   copy.type='button';copy.addEventListener('click',()=>copyReminder(item,copy));buttons.append(copy);
  }
  const key=String(item.personKey||'').match(/^(teacher|coord):([0-9]+)$/);
  if(admin&&key&&item.status!=='minor'){
   const open=mk('button','soft','📄 Ver certidão no cadastro');
   open.type='button';
   open.addEventListener('click',()=>window.openPersonCert?.(key[1],key[2]));
   buttons.append(open);
  }
  if(buttons.childNodes.length)card.appendChild(buttons);
  entries.append(card);
 });
}
function setMessage(t,error=false){
 const status=el('miV647CertMessage');
 if(!status)return;status.textContent=t;status.classList.toggle('miV647Error',error);
}
async function refresh(){
 if(loading)return;
 visibility();
 if(!allowed())return;
 const token=window.miAuthTokenV58;
 if(!token){setMessage('Entre com sua conta autorizada para consultar os vencimentos.',true);return;}
 const reload=el('miV647CertReload');
 loading=true;if(reload)reload.disabled=true;
 setMessage('Carregando certidões e verificando permissões...');
 try{
  const response=await fetch(BASE+'/rest/v1/rpc/v64_staff_certificate_report',{
   method:'POST',
   headers:{apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},
   body:'{}',
   cache:'no-store'
  });
  const payload=await response.json().catch(()=>null);
  if(!response.ok||!payload||!Array.isArray(payload.rows))throw Error(payload?.message||payload?.error||'Não foi possível consultar o relatório.');
  if(window.miAuthTokenV58!==token)throw Error('A sessão mudou durante a consulta.');
  rows=payload.rows.filter(x=>x&&typeof x.name==='string'&&Object.hasOwn(meta,x.status));
  asOf=payload.asOf;admin=payload.admin===true;hasData=true;
  const areas=el('miV647CertArea');
  const allowedAreas=['all',...(payload.canReadEbd?['ebd']:[]),...(payload.canReadNet?['net']:[])];
  for(const option of areas.options)option.hidden=!allowedAreas.includes(option.value);
  if(!allowedAreas.includes(areas.value))areas.value=allowedAreas[1]||'all';
  render();
  setMessage('Relatório atualizado. Acompanhamento disponível para a equipe com permissão.');
 }catch(e){
  hasData=false;el('miV647CertEntries')?.replaceChildren();
  setMessage('Falha ao atualizar: '+(e?.message||'verifique seu acesso e tente novamente.'),true);
 }finally{loading=false;if(reload)reload.disabled=false}
}
function csvValue(value){
 let str=String(value??'');
 if(/^[=+@-]/.test(str))str="'"+str;
 return '"'+str.replace(/"/g,'""')+'"';
}
function exportCSV(){
 if(!hasData)return;
 const head=['Nome','Função','Área','Emissão','Renovação','Conferida','Situação','Exigível a partir de'];
 const entries=filtered().map(x=>[x.name,x.role,area(x.area),date(x.issued),date(x.due),x.verified===true?'Sim':'Não',meta[x.status]?.label||'',date(x.nextRequiredOn)]);
 const csv='\ufeff'+[head,...entries].map(row=>row.map(csvValue).join(';')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='ministerio-infantil-certidoes-'+String(asOf||'atual')+'.csv';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
function printReport(){
 if(!hasData)return;
 document.body.classList.add('miV647Printing');
 window.addEventListener('afterprint',()=>document.body.classList.remove('miV647Printing'),{once:true});
 window.print();
 setTimeout(()=>document.body.classList.remove('miV647Printing'),8000);
}
window.miV647CertificateRefreshVisibility=visibility;
window.miV647ReportOpen=()=>{
 visibility();
 if(allowed()&&!hasData)refresh();
};
function init(){
 const panel=el('miV647CertReport');if(!panel)return;
 el('miV647CertReload')?.addEventListener('click',refresh);
 el('miV647CertSearch')?.addEventListener('input',render);
 el('miV647CertFilter')?.addEventListener('change',render);
 el('miV647CertArea')?.addEventListener('change',render);
 el('miV647CertCSV')?.addEventListener('click',exportCSV);
 el('miV647CertPrint')?.addEventListener('click',printReport);
 window.addEventListener('mi-auth-ready',()=>{
  hasData=false;rows=[];visibility();
  if(document.getElementById('reports')?.classList.contains('show'))refresh();
 });
 visibility();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();