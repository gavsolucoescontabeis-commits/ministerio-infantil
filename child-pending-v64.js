(()=>{
'use strict';
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
let panel,results,titleBtn,busy=false;
const admin=()=>window.miAuthRoleV58==='developer'&&Boolean(window.miAuthTokenV58);
const fmtDate=v=>String(v||'').slice(0,10).split('-').reverse().join('/');
function node(tag,txt){const x=document.createElement(tag);if(txt!=null)x.textContent=String(txt);return x}
function addStyle(){
 if(document.getElementById('miChildApplicationsStyle'))return;
 const style=node('style');style.id='miChildApplicationsStyle';
 style.textContent='#miChildApplicationsPanel{border-left:5px solid #29a9df;margin-top:13px}'+
 '#miChildApplicationsPanel[hidden]{display:none!important}'+
 '#miChildApplicationsPanel .mi-child-card{border:1px solid #d6e4ec;border-radius:12px;padding:14px;margin-top:12px;background:#fff}'+
 '#miChildApplicationsPanel .mi-child-details{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:8px;font-size:13px;line-height:1.55}'+
 '#miChildApplicationsPanel .mi-child-details div{min-width:0;overflow-wrap:anywhere}'+
 '#miChildApplicationsPanel .mi-child-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}'+
 '#miChildApplicationsPanel .mi-child-actions button{flex:1;min-width:180px;padding:13px;font-size:14px}'+
 '#miChildApplicationsPanel button{min-height:42px}';
 document.head.appendChild(style);
}
function ensure(){
 if(panel)return;
 const children=document.getElementById('children');
 if(!children)return;
 addStyle();
 panel=node('div');panel.id='miChildApplicationsPanel';panel.className='card';panel.hidden=true;
 const heading=node('h3','📥 Pré-cadastros enviados pelos pais');
 const desc=node('p','Os dados só entram no Cadastro Geral após sua aprovação. Envios de teste são apenas homologados, sem criar crianças na base oficial.');
 desc.className='small';
 titleBtn=node('button','Conferir cadastros de crianças');titleBtn.type='button';titleBtn.className='primary';
 titleBtn.addEventListener('click',refresh);
 const close=node('button','Fechar pré-cadastros');close.type='button';close.className='soft';
 close.addEventListener('click',()=>{results.hidden=true});
 results=node('div');results.hidden=true;results.setAttribute('aria-live','polite');
 panel.append(heading,desc,titleBtn,close,results);
 const home=document.getElementById('kidHome');
 if(home)home.insertAdjacentElement('beforebegin',panel);else children.appendChild(panel);
}
async function rpc(method,data){
 const token=window.miAuthTokenV58;
 if(!token||!admin())throw Error('Entre com a conta do administrador.');
 const response=await fetch(BASE+'/rest/v1/rpc/'+method,{
   method:'POST',headers:{'Content-Type':'application/json','apikey':KEY,'Authorization':'Bearer '+token},
   body:JSON.stringify(data||{}),cache:'no-store'
 });
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(result.message||result.error||'Não foi possível consultar os cadastros.');
 return result;
}
function detail(parent,label,value){
 if(value===undefined||value===null||value==='')return;
 const div=node('div');const b=node('strong',label+': ');div.append(b,document.createTextNode(String(value)));parent.append(div);
}
async function decision(id,action,wasTest){
 if(!admin())return alert('Somente o administrador pode analisar os pré-cadastros.');
 const name=action==='approve'?'aprovar':'rejeitar';
 const info=wasTest?'Este é um TESTE e não importará crianças para a base oficial.':'Se aprovado, o cadastro será incluído no Cadastro Geral, sem sala da EBD.';
 if(!confirm('Deseja '+name+' este pré-cadastro?\n'+info))return;
 if(busy)return;busy=true;
 try{
   const res=await rpc('v64_review_child_application',{p_application_id:id,p_action:action});
   const text=res.is_test?'Teste analisado. Nenhuma criança foi cadastrada na base oficial.':
     action==='approve'?'Criança importada com sucesso no cadastro geral. Atualize o aplicativo para visualizar.':'Pré-cadastro rejeitado.';
   alert(text);
   await refresh();
 }catch(err){alert(err.message||'Não foi possível concluir.')}
 finally{busy=false}
}
function draw(items){
 results.replaceChildren();
 const arr=Array.isArray(items)?items:[];
 const info=node('p',arr.length?arr.length+' pré-cadastro(s) aguardando sua análise.':'Nenhum pré-cadastro pendente.');
 results.append(info);
 for(const app of arr){
   const data=app.child_data||{};
   const card=node('section');card.className='mi-child-card';
   const h=node('h4',(app.is_test?'🧪 TESTE • ':'')+(data.name||'Criança sem nome'));
   const metadata=node('div');metadata.className='mi-child-details';
   detail(metadata,'Nascimento',fmtDate(data.birth));
   detail(metadata,'Visitante',data.visitor==='sim'?'Sim':'Não');
   detail(metadata,'Quem trouxe',data.broughtBy);
   detail(metadata,'Pai',data.father);
   detail(metadata,'Telefone pai',data.fphone);
   detail(metadata,'Mãe',data.mother);
   detail(metadata,'Telefone mãe',data.mphone);
   detail(metadata,'Outro responsável',data.resp);
   detail(metadata,'Parentesco',data.respRelation);
   detail(metadata,'Telefone responsável',data.rphone);
   detail(metadata,'Autorizados a buscar',String(data.auth||'').split('||').join(' • '));
   detail(metadata,'CEP',data.cep);
   detail(metadata,'Endereço',[data.street,data.num,data.comp,data.hood,data.city,data.uf].filter(Boolean).join(', '));
   detail(metadata,'Observações',data.obs);
   detail(metadata,'Quem enviou',app.guardian_name);
   detail(metadata,'Vínculo',app.guardian_relationship);
   detail(metadata,'WhatsApp do remetente',app.guardian_phone);
   detail(metadata,'Enviado em',new Date(app.created_at).toLocaleString('pt-BR'));
   const actions=node('div');actions.className='mi-child-actions';
   const yes=node('button',app.is_test?'Confirmar teste (sem importar)':'Aprovar e importar para o Cadastro Geral');
   yes.className='green';yes.type='button';
   yes.addEventListener('click',()=>decision(app.id,'approve',app.is_test));
   const no=node('button','Rejeitar');no.type='button';no.className='red';
   no.addEventListener('click',()=>decision(app.id,'reject',app.is_test));
   actions.append(yes,no);card.append(h,metadata,actions);results.append(card);
 }
}
async function refresh(){
 ensure();if(!admin())return;
 results.hidden=false;
 results.replaceChildren(node('p','Consultando cadastros no Supabase...'));
 try{draw(await rpc('v64_list_child_applications',{}))}
 catch(err){results.replaceChildren(node('p',err.message||'Erro ao consultar.'))}
}
function sync(){
 ensure();
 if(panel)panel.hidden=!admin();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{sync();setInterval(sync,1800)});
else{sync();setInterval(sync,1800)}
})();