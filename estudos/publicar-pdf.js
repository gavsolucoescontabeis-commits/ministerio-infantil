/* V77 — Publicação segura de PDFs pela conta developer existente do aplicativo. */
(()=>{'use strict';
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
const BUCKET='mi-estudos-atividades';
const $=id=>document.getElementById(id);
const getToken=()=>{try{return window.parent!==window?window.parent.miAuthTokenV58||'':window.opener?.miAuthTokenV58||''}catch(e){return ''}};
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slug=v=>norm(v).replace(/ +/g,'-').slice(0,70).replace(/-$/,'');
const originals=new Map();
let authorized=false;
let working=false;
function show(message,kind='info'){const x=$('status');x.textContent=message;x.dataset.kind=kind}
async function request(path,{method='GET',body,token,headers={}}={}){
 const req=await fetch(BASE+path,{method,cache:'no-store',headers:{
   apikey:KEY,...(token?{Authorization:'Bearer '+token}:{}),
   ...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers
 },...(body!==undefined?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
 if(!req.ok){let msg;try{const e=await req.json();msg=e.message||e.error||e.msg}catch(e){}
  throw Error(msg||'Erro HTTP '+req.status)}
 return req.status===204?null:req.json();
}
function selectExisting(){
 const p=originals.get($('entry').value);
 if(!p)return;
 $('theme').value=p.title||'';
 $('reference').value=Array.isArray(p.references)?p.references[0]||'':'';
 $('minAge').value=p.ageMin||p.age||5;$('maxAge').value=p.ageMax||p.age||6;
 $('pages').value=p.pages||7;
 $('aliases').value=(p.aliases||[]).filter(x=>norm(x)!==norm(p.title)).join(', ');
}
async function init(){
 try{
  const token=getToken();
  if(!token)throw Error('Abra Estudos pela sua conta dentro do aplicativo principal para publicar arquivos. O acesso direto em outra aba não autoriza envios.');
  const staff=await request('/rest/v1/rpc/current_staff_profile',{method:'POST',body:{},token});
  if(!Array.isArray(staff)||staff[0]?.staff_role!=='developer')throw Error('A publicação de materiais é exclusiva da conta administradora.');
  const rows=await request('/rest/v1/mi_study_activity_packages?select=id,payload&order=id.asc',{token});
  const select=$('entry');
  for(const row of rows){
   if(!row?.id||!row?.payload)continue;
   originals.set(row.id,row.payload);
   const opt=document.createElement('option');opt.value=row.id;
   const p=row.payload;
   opt.textContent=p.title+' — '+(p.ageLabel||p.ageMin+' a '+p.ageMax+' anos')+(p.status==='approved'?' (publicado)':' (aguardando)');
   select.appendChild(opt);
  }
  if(originals.has('criacao-5-6'))select.value='criacao-5-6';
  selectExisting();
  select.addEventListener('change',selectExisting);
  authorized=true;$('publish').disabled=false;
  show('Conta autorizada. Selecione o PDF aprovado e clique em “Enviar e publicar”.');
 }catch(error){show(error.message,'error')}
}
function upload(file,path,token){
 return new Promise((resolve,reject)=>{
  const xhr=new XMLHttpRequest();
  xhr.open('POST',BASE+'/storage/v1/object/'+BUCKET+'/'+path);
  xhr.setRequestHeader('apikey',KEY);
  xhr.setRequestHeader('Authorization','Bearer '+token);
  xhr.setRequestHeader('Content-Type','application/pdf');
  xhr.setRequestHeader('Cache-Control','3600');
  xhr.upload.onprogress=e=>{if(e.lengthComputable)$('progress').textContent='Enviando PDF: '+Math.floor(100*e.loaded/e.total)+'%';};
  xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300)return resolve();
   let message='Falha no upload: HTTP '+xhr.status;
   try{const e=JSON.parse(xhr.responseText);message=e.message||e.error||message}catch(e){}
   reject(Error(message))};
  xhr.onerror=()=>reject(Error('Erro de conexão durante o envio do PDF.'));
  xhr.send(file);
 });
}
async function verifyPublic(url){
 for(let i=0;i<3;i++){
  try{const r=await fetch(url,{method:'HEAD',cache:'no-store'});if(r.ok)return true}catch(e){}
  if(i<2)await new Promise(resolve=>setTimeout(resolve,800));
 }
 return false;
}
async function publish(){
 if(working||!authorized)return;
 working=true;$('publish').disabled=true;$('published').classList.remove('show');$('progress').textContent='';
 try{
  const file=$('pdf').files?.[0];
  if(!file||!/.pdf$/i.test(file.name))throw Error('Selecione um PDF válido.');
  if(file.size<1024||file.size>50*1024*1024)throw Error('O PDF deve ter entre 1 KB e 50 MB.');
  const header=new TextDecoder().decode(await file.slice(0,5).arrayBuffer());
  if(header!=='%PDF-')throw Error('O arquivo selecionado não possui assinatura de PDF.');
  const title=$('theme').value.trim(),ref=$('reference').value.trim();
  const min=Number($('minAge').value),max=Number($('maxAge').value),pages=Number($('pages').value);
  if(!title||!ref)throw Error('Informe tema e passagem bíblica.');
  if(!Number.isInteger(min)||!Number.isInteger(max)||min<2||max>17||min>max)throw Error('Faixa etária inválida.');
  if(!Number.isInteger(pages)||pages<1||pages>150)throw Error('Quantidade de páginas inválida.');
  const saved=originals.get($('entry').value);
  const id=saved?$('entry').value:slug(title)+'-'+min+'-'+max;
  if(!/^[a-z0-9-]+$/.test(id))throw Error('Não foi possível criar identificador para a atividade.');
  if(!saved&&originals.has(id))throw Error('Já existe material para o tema e a faixa. Selecione o registro existente.');
  if(!saved&&Array.from(originals.values()).some(p=>norm(p.title)===norm(title)&&Number(p.ageMin||p.age)===min&&Number(p.ageMax||p.age)===max))throw Error('Já existe um caderno deste tema e idade. Escolha o material cadastrado.');
  const token=getToken();if(!token)throw Error('Sessão encerrada. Entre novamente no aplicativo.');
  const path=id+'/'+crypto.randomUUID()+'.pdf';
  const url=BASE+'/storage/v1/object/public/'+BUCKET+'/'+path;
  show('Enviando arquivo para o armazenamento oficial…');
  await upload(file,path,token);
  show('PDF enviado. Conferindo abertura do arquivo antes de publicar…');
  if(!await verifyPublic(url))throw Error('O PDF chegou ao armazenamento, mas a abertura pública não foi confirmada. Não publiquei o registro. Tente novamente mais tarde.');
  const extra=$('aliases').value.split(',').map(v=>v.trim()).filter(Boolean);
  const aliases=[title,...extra].filter((v,i,a)=>a.findIndex(x=>norm(x)===norm(v))===i);
  const bookMatch=norm(ref).match(/^(.+?\s+\d+)(?:\s+\d+|$)/);
  const payload={
   ...(saved||{}),id,title,age:min,ageMin:min,ageMax:max,
   ageLabel:min===max?min+' anos':min+' a '+max+' anos',
   aliases,books:saved?.books|| (bookMatch?[bookMatch[1]]:[]),
   references:[ref],status:'approved',
   summary:'Caderno ilustrado aprovado com '+pages+' páginas. PDF complementar ao roteiro do professor.',
   format:'pdf',pages,student:url,teacher:'',
   cover:saved?.cover||'',published:true,editorialApproved:true,pdfFilename:file.name
  };
  // Garante que a idade e a referência não sejam alteradas por engano num item já publicado.
  const row={status:'approved',payload,updated_at:new Date().toISOString()};
  show('PDF conferido. Registrando a atividade no Banco…');
  const table='/rest/v1/mi_study_activity_packages';
  const result=saved
   ?await request(table+'?id=eq.'+encodeURIComponent(id),{method:'PATCH',body:row,token,headers:{Prefer:'return=representation'}})
   :await request(table,{method:'POST',body:{id,...row},token,headers:{Prefer:'return=representation'}});
  if(!Array.isArray(result)||result.length!==1||result[0]?.status!=='approved')throw Error('Não consegui confirmar o registro no banco. O PDF continua guardado; avise a administração.');
  originals.set(id,payload);
  $('publishedLink').href=url;$('published').classList.add('show');
  $('progress').textContent='Envio concluído';
  show('Publicado! O professor receberá a sugestão deste PDF conforme o tema e a faixa etária. Reabra a aba Estudos para atualizar as sugestões.','success');
 }catch(e){show(e.message,'error')}
 finally{working=false;$('publish').disabled=!authorized}
}
$('publish').addEventListener('click',publish);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();