/* V79 — Importação em lote de PDFs editoriais aprovados, a partir de ZIP sem compressão. */
(()=>{'use strict';
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
const BUCKET='mi-estudos-atividades';
const $=id=>document.getElementById(id);
let authorized=false,working=false,records=[],selected=[];
const getToken=()=>{try{return window.parent!==window?(window.parent.miAuthTokenV58||''):(window.opener?.miAuthTokenV58||'')}catch(_){return ''}};
function show(msg,kind='info'){$('status').textContent=msg;$('status').dataset.kind=kind}
async function api(path,{method='GET',body,token}={}){
 const resp=await fetch(BASE+path,{method,cache:'no-store',headers:{apikey:KEY,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},{...(body!==undefined?{body:JSON.stringify(body)}:{})}});
 if(!resp.ok){let msg='HTTP '+resp.status;try{const j=await resp.json();msg=j.message||j.error||msg}catch(_){}
 throw Error(msg)}
 return resp.status===204?null:resp.json();
}
function safeText(e){return String(e||'').replace(/[\u0000-\u001f]/g,'').slice(0,180)}
async function init(){
 try{
  const token=getToken();if(!token)throw Error('Abra a importação pelo aplicativo principal, com sua conta administradora.');
  const staff=await api('/rest/v1/rpc/current_staff_profile',{method:'POST',body:{},token});
  if(!Array.isArray(staff)||staff[0]?.staff_role!=='developer')throw Error('Apenas a conta administradora pode publicar materiais.');
  records=await api('/rest/v1/mi_study_activity_packages?select=id,status,payload&order=id.asc',{token});
  if(!Array.isArray(records))throw Error('Não foi possível carregar os cadernos cadastrados.');
  const pend=records.filter(r=>r.status==='review'&&r.payload?.editorialApproved&&r.payload?.pdfFilename&&r.payload?.pdfSha256);
  $('pending').textContent=pend.length+' cadernos aprovados esperando o envio do PDF.';
  authorized=true;$('zip').disabled=false;
  show('Selecione o pacote ZIP de cadernos aprovados. Nenhum PDF será enviado sem sua confirmação.');
 }catch(e){show(e.message,'error')}
}
async function readZip(file){
 let offset=0,items=[];const MAX=100;
 while(offset+4<=file.size){
  const sigView=new DataView(await file.slice(offset,offset+4).arrayBuffer());
  const sig=sigView.getUint32(0,true);
  if(sig===0x02014b50||sig===0x06054b50)break;
  if(sig!==0x04034b50)throw Error('O pacote ZIP está danificado ou usa um formato inesperado.');
  if(offset+30>file.size)throw Error('O pacote ZIP está incompleto.');
  const d=new DataView(await file.slice(offset,offset+30).arrayBuffer());
  const flags=d.getUint16(6,true),method=d.getUint16(8,true);
  const size=d.getUint32(18,true),total=d.getUint32(22,true),namelen=d.getUint16(26,true),extra=d.getUint16(28,true);
  if(flags&8||method!==0||size!==total||size===0xFFFFFFFF)throw Error('Use o pacote ZIP oficial, sem compressão ou alteração dos PDFs.');
  if(namelen<1||namelen>260)throw Error('Nome de arquivo inválido no pacote.');
  const name=new TextDecoder('utf-8').decode(await file.slice(offset+30,offset+30+namelen).arrayBuffer());
  const begin=offset+30+namelen+extra;
  if(begin+size>file.size)throw Error('Pacote incompleto no arquivo '+safeText(name));
  if(/^[\w.À-ÿ -]+\.pdf$/i.test(name))items.push({name,blob:file.slice(begin,begin+size,'application/pdf')});
  offset=begin+size;
  if(items.length>MAX)throw Error('O pacote contém arquivos demais.');
 }
 return items;
}
async function pick(){
 selected=[];$('submit').disabled=true;
 if(!authorized)return;
 try{
  const file=$('zip').files?.[0];if(!file)throw Error('Escolha o arquivo ZIP.');
  show('Lendo o pacote sem alterar os arquivos…');
  const items=await readZip(file);
  const byname=new Map(items.map(x=>[x.name,x]));
  const eligible=records.filter(r=>r.status==='review'&&r.payload?.editorialApproved&&r.payload?.pdfSha256&&r.payload?.pdfFilename);
  selected=eligible.filter(r=>byname.has(r.payload.pdfFilename)).map(r=>({...r,file:byname.get(r.payload.pdfFilename)}));
  const missing=eligible.filter(r=>!byname.has(r.payload.pdfFilename));
  const skipped=items.length-selected.length;
  $('summary').textContent='Prontos para enviar: '+selected.length+'. Outros arquivos ignorados: '+skipped+'. Aprovados que não estão neste pacote: '+missing.length+'.';
  $('items').replaceChildren();
  for(const r of selected){const li=document.createElement('li');li.textContent=r.payload.title+' — '+(r.payload.ageLabel||'')+' ('+r.file.name+')';$('items').appendChild(li)}
  if(!selected.length)throw Error('Nenhum PDF aprovado deste pacote corresponde aos registros pendentes no Banco de Atividades.');
  $('submit').disabled=false;show('Pacote reconhecido. Clique em “Conferir e publicar” para enviar os PDFs aprovados.');
 }catch(e){show(e.message,'error')}
}
async function checksum(blob){
 if(!crypto?.subtle?.digest)throw Error('Este navegador não permite verificação SHA-256.');
 const buffer=await blob.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',buffer);
 return Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
}
async function upload(blob,path,token,done,total){
 return new Promise((resolve,reject)=>{
  const xhr=new XMLHttpRequest();
  xhr.open('POST',BASE+'/storage/v1/object/'+BUCKET+'/'+path,true);
  xhr.setRequestHeader('apikey',KEY);xhr.setRequestHeader('Authorization','Bearer '+token);
  xhr.setRequestHeader('Content-Type','application/pdf');xhr.setRequestHeader('Cache-Control','3600');
  xhr.upload.onprogress=e=>{if(e.lengthComputable)$('progress').textContent=(done+1)+'/'+total+' cadernos — envio '+Math.floor(e.loaded/e.total*100)+'%';};
  xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300)resolve();else{let msg='Erro HTTP '+xhr.status;try{const j=JSON.parse(xhr.responseText);msg=j.message||j.error||msg}catch(_){}reject(Error(msg))}};
  xhr.onerror=()=>reject(Error('A conexão caiu durante o envio.'));xhr.send(blob);
 });
}
async function verify(url){for(let i=0;i<3;i++){try{const r=await fetch(url,{method:'HEAD',cache:'no-store'});if(r.ok)return true}catch(_){}if(i<2)await new Promise(ok=>setTimeout(ok,750))}return false}
async function publishAll(){
 if(!authorized||working||!selected.length)return;
 working=true;$('submit').disabled=true;$('zip').disabled=true;
 let succeeded=0,failed=[];
 try{
  for(let i=0;i<selected.length;i++){
   const r=selected[i],p=r.payload;
   try{
    show('Conferindo arquivo '+(i+1)+' de '+selected.length+': '+p.title+' — '+p.ageLabel+'…');
    if(r.file.blob.size<1024||r.file.blob.size>50*1024*1024)throw Error('PDF ultrapassa o limite permitido.');
    const sign=new TextDecoder().decode(await r.file.blob.slice(0,5).arrayBuffer());if(sign!=='%PDF-')throw Error('Assinatura de PDF inválida.');
    const sum=await checksum(r.file.blob);if(sum.toLowerCase()!==String(p.pdfSha256).toLowerCase())throw Error('SHA-256 diferente do caderno aprovado. Não enviado.');
    const token=getToken();if(!token)throw Error('A sessão de administração expirou.');
    const dest=r.id+'/'+crypto.randomUUID()+'.pdf';
    const url=BASE+'/storage/v1/object/public/'+BUCKET+'/'+dest;
    show('Enviando '+p.title+' — '+p.ageLabel+' ('+(i+1)+'/'+selected.length+')…');
    await upload(r.file.blob,dest,token,i,selected.length);
    if(!await verify(url))throw Error('O PDF foi enviado, mas ainda não foi possível confirmar acesso ao arquivo.');
    const updated={...p,status:'approved',published:true,student:url,editorialApproved:true,pdfSha256:sum,pdfFilename:r.file.name};
    const rows=await api('/rest/v1/mi_study_activity_packages?id=eq.'+encodeURIComponent(r.id),{method:'PATCH',body:{status:'approved',payload:updated,updated_at:new Date().toISOString()},token});
    /* In case Supabase returns minimal response, verify via fresh read below. */
    const check=await api('/rest/v1/mi_study_activity_packages?select=id,status,payload&id=eq.'+encodeURIComponent(r.id),{token});
    if(check?.[0]?.status!=='approved'||check[0]?.payload?.student!==url)throw Error('O arquivo foi enviado, mas o cadastro não foi confirmado.');
    succeeded++;
    $('progress').textContent='Publicados: '+succeeded+' de '+selected.length+'.';
   }catch(error){failed.push(p.title+' ('+p.ageLabel+'): '+error.message)}
  }
  show('Publicados no aplicativo: '+succeeded+' de '+selected.length+'.'+(failed.length?'\nPendências:\n'+failed.join('\n'):'\nConcluído. Reabra a aba Estudos para atualizar as sugestões.'),failed.length?'error':'success');
 }finally{working=false;$('submit').disabled=!authorized;$('zip').disabled=!authorized}
}
$('zip').addEventListener('change',pick);$('submit').addEventListener('click',publishAll);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();