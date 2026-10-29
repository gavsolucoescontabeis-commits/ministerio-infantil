/* V82 — Importação em lote de PDFs editoriais aprovados, a partir de ZIP sem compressão. */
(()=>{'use strict';
const BASE='https://jthxnjvqmvtydyfuqcct.supabase.co';
const KEY='sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs';
const BUCKET='mi-estudos-atividades';
const $=id=>document.getElementById(id);
let authorized=false,working=false,records=[],selected=[];
// V80: materiais com aprovação editorial, mas sem PDF publicado, também são importáveis.
// Ignora versões parciais já substituídas por caderno final e nunca reenvia PDFs publicados.
const eligibleForUpload=r=>{
 const p=r?.payload||{};
 return !!(p.editorialApproved&&p.pdfFilename&&p.pdfSha256)
  &&(r.status==='review'||(r.status==='approved'&&(p.published===false||p.published==='false')))
  &&p.partialEdition!==true&&p.partialEdition!=='true';
};
const getToken=()=>{try{return window.parent!==window?(window.parent.miAuthTokenV58||''):(window.opener?.miAuthTokenV58||'')}catch(_){return ''}};
function show(msg,kind='info'){$('status').textContent=msg;$('status').dataset.kind=kind}
async function api(path,{method='GET',body,token}={}){
 const resp=await fetch(BASE+path,{method,cache:'no-store',headers:{apikey:KEY,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
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
  const pend=records.filter(eligibleForUpload);
  $('pending').textContent=pend.length+' cadernos aprovados esperando o envio do PDF.';
  authorized=true;$('zip').disabled=false;
  show('Selecione o pacote ZIP de cadernos aprovados. Nenhum PDF será enviado sem sua confirmação.');
 }catch(e){show(e.message,'error')}
}
// V81 — Leitura por diretório central: aceita ZIP com subpastas, STORE/DEFLATE e data descriptor.
// Identificação por SHA-256 dos PDF aprovados (nome do arquivo não é requisito de aprovação).
async function readZip(file){
 const tailSize=Math.min(file.size,65557),tailStart=file.size-tailSize;
 const tail=new DataView(await file.slice(tailStart).arrayBuffer());
 let eocd=-1;
 for(let i=tailSize-22;i>=0;i--){
  if(tail.getUint32(i,true)===0x06054b50){eocd=i;break}
 }
 if(eocd<0)throw Error('O arquivo selecionado não é um ZIP válido.');
 const count=tail.getUint16(eocd+10,true);
 const centralSize=tail.getUint32(eocd+12,true),centralOffset=tail.getUint32(eocd+16,true);
 if(count===0xFFFF||centralSize===0xFFFFFFFF||centralOffset===0xFFFFFFFF)throw Error('O ZIP64 não é suportado neste importador.');
 if(centralOffset+centralSize>file.size||count>200)throw Error('O diretório do ZIP está inválido ou contém arquivos demais.');
 const central=new DataView(await file.slice(centralOffset,centralOffset+centralSize).arrayBuffer());
 const decode=new TextDecoder('utf-8');
 let cursor=0,items=[];
 for(let i=0;i<count;i++){
  if(cursor+46>central.byteLength||central.getUint32(cursor,true)!==0x02014b50)throw Error('Entrada inválida no diretório do ZIP.');
  const method=central.getUint16(cursor+10,true);
  const compressedSize=central.getUint32(cursor+20,true);
  const originalSize=central.getUint32(cursor+24,true);
  const nameLen=central.getUint16(cursor+28,true);
  const extraLen=central.getUint16(cursor+30,true);
  const commentLen=central.getUint16(cursor+32,true);
  const localOffset=central.getUint32(cursor+42,true);
  if(cursor+46+nameLen+extraLen+commentLen>central.byteLength)throw Error('Nome de arquivo inválido no ZIP.');
  const fullName=decode.decode(new Uint8Array(central.buffer,central.byteOffset+cursor+46,nameLen));
  cursor+=46+nameLen+extraLen+commentLen;
  const name=fullName.replace(/\\/g,'/').split('/').pop();
  if(!/^[\w.À-ÿ -]+\.pdf$/i.test(name))continue;
  if(originalSize<1024||originalSize>50*1024*1024)throw Error('O PDF "'+safeText(name)+'" excede os limites de upload.');
  if(localOffset+30>file.size)throw Error('O ZIP contém um PDF incompleto.');
  const local=new DataView(await file.slice(localOffset,localOffset+30).arrayBuffer());
  if(local.getUint32(0,true)!==0x04034b50)throw Error('Cabeçalho do PDF dentro do ZIP inválido.');
  const start=localOffset+30+local.getUint16(26,true)+local.getUint16(28,true);
  if(start+compressedSize>file.size)throw Error('O ZIP está incompleto no arquivo '+safeText(name));
  const compressed=file.slice(start,start+compressedSize);
  let blob;
  if(method===0)blob=compressed;
  else if(method===8){
   if(!('DecompressionStream' in window))throw Error('Atualize o navegador para importar arquivos ZIP comprimidos.');
   try{blob=await new Response(compressed.stream().pipeThrough(new DecompressionStream('deflate-raw'))).blob()}
   catch(_){throw Error('Falha ao descompactar '+safeText(name)+'.')}
  }else throw Error('O ZIP usa um tipo de compressão não suportado: '+method);
  if(blob.size!==originalSize)throw Error('Tamanho incorreto em '+safeText(name)+'.');
  items.push({name,blob:new Blob([blob],{type:'application/pdf'})});
 }
 if(!items.length)throw Error('Nenhum PDF encontrado no ZIP.');
 return items;
}
async function pick(){
 selected=[];$('submit').disabled=true;
 if(!authorized)return;
 try{
  const file=$('zip').files?.[0];if(!file)throw Error('Escolha o arquivo ZIP.');
  show('Lendo PDFs do ZIP sem alterar os arquivos…');
  const items=await readZip(file);
  const eligible=records.filter(eligibleForUpload);
  const unpublishedByHash=new Map(),publishedByHash=new Map();
  for(const r of records){
   const p=r.payload||{},hashes=[p.pdfSha256,p.lightweightPdfSha256,...(Array.isArray(p.acceptedPdfHashes)?p.acceptedPdfHashes:[])]
      .filter(v=>typeof v==='string'&&/^[a-f0-9]{64}$/i.test(v)).map(v=>v.toLowerCase());
   const target=eligibleForUpload(r)?unpublishedByHash:
      (p.published===true||p.published==='true')?publishedByHash:null;
   if(target)for(const h of hashes)target.set(h,r);
  }
  let publishedCount=0,ignoredCount=0;
  const chosenIds=new Set();
  for(let i=0;i<items.length;i++){
   const item=items[i];
   show('Conferindo aprovação do PDF '+(i+1)+' de '+items.length+': '+safeText(item.name)+'…');
   const sign=new TextDecoder().decode(await item.blob.slice(0,5).arrayBuffer());
   if(sign!=='%PDF-')throw Error('Arquivo '+safeText(item.name)+' não é um PDF válido.');
   const sha=await checksum(item.blob);
   const approved=unpublishedByHash.get(sha);
   if(approved&&!chosenIds.has(approved.id)){
    selected.push({...approved,file:item,verifiedSha256:sha});
    chosenIds.add(approved.id);
   }else if(publishedByHash.has(sha))publishedCount++;
   else ignoredCount++;
  }
  const missing=eligible.filter(r=>!chosenIds.has(r.id));
  $('summary').textContent='Prontos para enviar: '+selected.length+
    '. Já publicados no aplicativo: '+publishedCount+
    '. Outros arquivos ignorados: '+ignoredCount+
    '. Aprovados ainda ausentes no pacote: '+missing.length+'.';
  $('items').replaceChildren();
  for(const r of selected){const li=document.createElement('li');li.textContent=r.payload.title+' — '+(r.payload.ageLabel||'')+' ('+r.file.name+')';$('items').appendChild(li)}
  if(!selected.length)throw Error('O ZIP não contém PDFs aprovados que ainda estejam pendentes. Confira os materiais já publicados.');
  $('submit').disabled=false;
  show('Cadernos pendentes reconhecidos e conferidos por SHA-256. Clique em “Conferir e publicar”.');
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
    const sum=await checksum(r.file.blob);
    // V82: conferir novamente as variantes do MESMO PDF editorial aprovado.
    // O leitor ZIP V81 já reconhecia a versão leve, mas esta segunda validação
    // aceitava somente o hash da versão grande e barrava a publicação.
    const allowedHashes=[p.pdfSha256,p.lightweightPdfSha256,...(Array.isArray(p.acceptedPdfHashes)?p.acceptedPdfHashes:[])]
      .filter(h=>typeof h==='string'&&/^[a-f0-9]{64}$/i.test(h))
      .map(h=>h.toLowerCase());
    if(!allowedHashes.includes(sum.toLowerCase())||r.verifiedSha256!==sum.toLowerCase())
      throw Error('SHA-256 diferente das versões aprovadas deste caderno. Não enviado.');
    const token=getToken();if(!token)throw Error('A sessão de administração expirou.');
    const dest=r.id+'/'+crypto.randomUUID()+'.pdf';
    const url=BASE+'/storage/v1/object/public/'+BUCKET+'/'+dest;
    show('Enviando '+p.title+' — '+p.ageLabel+' ('+(i+1)+'/'+selected.length+')…');
    await upload(r.file.blob,dest,token,i,selected.length);
    if(!await verify(url))throw Error('O PDF foi enviado, mas ainda não foi possível confirmar acesso ao arquivo.');
    const updated={...p,status:'approved',published:true,student:url,editorialApproved:true,originalPdfSha256:p.originalPdfSha256||p.pdfSha256,originalPdfFilename:p.originalPdfFilename||p.pdfFilename,pdfSha256:sum,pdfFilename:r.file.name};
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