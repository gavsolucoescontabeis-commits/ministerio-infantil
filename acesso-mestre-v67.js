/* V67: Acesso Mestre. Sempre valida autorização no servidor.
   A conta original permanece em uma aba separada; credenciais não vão para URLs. */
(()=>{
"use strict";
const BASE="https://jthxnjvqmvtydyfuqcct.supabase.co";
const KEY="sb_publishable_bzWCtwbFj1B1WqSMdhl0GQ_VDCPqDRs";
const STORE_KEY="mi-v58-session-refresh";
const DELEGATION_KEY="mi-v67-delegation";
const delegated=new URLSearchParams(location.search).get("mi_mestre")==="1";
const api=async(endpoint,token,body)=>{
 const response=await fetch(BASE+endpoint,{method:"POST",headers:{"Content-Type":"application/json",apikey:KEY,Authorization:"Bearer "+token},body:JSON.stringify(body),cache:"no-store"});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(data.error||data.message||"Serviço indisponível");
 return data;
};
if(delegated){
 let record=null;try{record=JSON.parse(sessionStorage.getItem(DELEGATION_KEY)||"null")}catch(_){}
 if(!record?.grant_id||!record?.expires_at||!sessionStorage.getItem(STORE_KEY)){
  sessionStorage.removeItem(STORE_KEY);
  document.addEventListener("DOMContentLoaded",()=>{
    const e=document.createElement("p");e.textContent="Este acesso assistido não é válido. Feche esta janela e abra novamente pelo painel do administrador.";e.style.cssText="position:fixed;top:0;inset-inline:0;padding:22px;background:white;z-index:2147483647;font-weight:bold";document.body.appendChild(e);
  });
  return;
 }
 const bar=document.createElement("div");
 bar.id="miV67DelegatedBar";
 bar.style.cssText="position:sticky;top:0;z-index:2147483646;background:#532e82;color:white;padding:12px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;font:600 14px system-ui";
 const label=document.createElement("span");label.textContent="🔐 ACESSO MESTRE · Visualizando como "+String(record.target_name||"usuário")+" · Ações realizadas neste ambiente usam as permissões da conta selecionada.";
 const button=document.createElement("button");button.type="button";button.textContent="Encerrar acesso assistido";button.style.cssText="background:white;color:#532e82;padding:9px;border-radius:8px";
 bar.append(label,button);
 const close=async()=>{
   if(button.disabled)return;button.disabled=true;
   const token=window.miAuthTokenV58;
   if(token){
     try{await api("/functions/v1/v67-master-access",token,{action:"end",grant_id:record.grant_id})}catch(e){console.warn("Encerramento da auditoria pendente",e)}
     try{await fetch(BASE+"/auth/v1/logout",{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+token}})}catch(_){}
   }
   sessionStorage.removeItem(DELEGATION_KEY);sessionStorage.removeItem(STORE_KEY);
   window.miCloudLogout?.();
   window.close();
   if(!window.closed){document.body.replaceChildren();document.body.append("Acesso assistido encerrado. Feche esta aba.");}
 };
 button.addEventListener("click",close);
 for(const id of ["authExitV58","miStaffExitV58"]){
  document.getElementById(id)?.addEventListener("click",ev=>{ev.preventDefault();ev.stopImmediatePropagation();close()},true);
 }
 let activated=false;
 window.addEventListener("mi-auth-ready",async()=>{
   if(activated)return;
   if(Date.now()>=Date.parse(record.expires_at)){await close();return}
   const token=window.miAuthTokenV58;
   if(!token)return;
   try{await api("/functions/v1/v67-master-access",token,{action:"activate",grant_id:record.grant_id});activated=true}
   catch(e){label.textContent="Não foi possível registrar o acesso assistido: "+e.message;await close()}
 });
 document.body.prepend(bar);
 const timer=setInterval(()=>{
   if(!sessionStorage.getItem(DELEGATION_KEY)){clearInterval(timer);return}
   if(Date.now()>=Date.parse(record.expires_at)){clearInterval(timer);close()}
 },10000);
 return;
}
const pane=document.getElementById("miTeamAccessPane");
if(!pane)return;
const card=document.createElement("details");
card.className="miV66LoginFold";
card.id="miV67MasterPanel";card.hidden=true;
const summary=document.createElement("summary");summary.textContent="🔐 Acesso Mestre — entrar como usuário (administrador)";
card.append(summary);
const expl=document.createElement("p");expl.textContent="Abra uma sessão temporária de professor ou coordenador, sem conhecer ou alterar a senha dessa pessoa. Confirme sua senha de administrador. Sua própria sessão continuará aberta nesta aba.";
const form=document.createElement("form");form.id="miV67MasterForm";
const labelTarget=document.createElement("label");labelTarget.textContent="Conta a acessar";
const select=document.createElement("select");select.required=true;select.name="target";labelTarget.appendChild(select);
const labelPass=document.createElement("label");labelPass.textContent="Confirme sua senha de administrador";
const password=document.createElement("input");password.type="password";password.name="admin_password";password.required=true;password.autocomplete="current-password";labelPass.appendChild(password);
const open=document.createElement("button");open.type="submit";open.textContent="Entrar como usuário";open.className="primary";
const update=document.createElement("button");update.type="button";update.textContent="Atualizar contas";
const feedback=document.createElement("p");feedback.setAttribute("role","status");feedback.style.fontWeight="700";
form.append(labelTarget,labelPass,open,update);card.append(expl,form,feedback);pane.append(card);
let loading=false;
const listAccounts=async()=>{
 const token=window.miAuthTokenV58;
 if(!token||window.miAuthRoleV58!=="developer")return;
 update.disabled=true;feedback.textContent="Carregando contas autorizadas...";
 try{
 const d=await api("/rest/v1/rpc/v58_manage_staff_access",token,{p_action:"list",p_staff_id:null});
 const accounts=(d.accounts||[]).filter(a=>a.active&&["teacher","coordinator"].includes(a.role));
 select.replaceChildren();
 for(const a of accounts){const o=document.createElement("option");o.value=a.id;o.textContent=(a.name||"Sem nome")+" — "+(a.role==="teacher"?"Professor(a)":"Coordenador(a)");select.appendChild(o)}
 open.disabled=!accounts.length;feedback.textContent=accounts.length?"Selecione uma conta. A sessão assistida dura até 15 minutos.":"Nenhuma conta ativa disponível.";
 }catch(e){feedback.textContent=e.message;open.disabled=true}
 finally{update.disabled=false}
};
const show=()=>{const allowed=window.miAuthRoleV58==="developer"&&!!window.miAuthTokenV58;card.hidden=!allowed;if(allowed)listAccounts()};
window.addEventListener("mi-auth-ready",show);
for(const id of ["authExitV58","miStaffExitV58"]){document.getElementById(id)?.addEventListener("click",()=>card.hidden=true)}
update.addEventListener("click",listAccounts);
form.addEventListener("submit",async ev=>{
 ev.preventDefault();
 if(loading||window.miAuthRoleV58!=="developer"||!window.miAuthTokenV58)return;
 const popup=window.open("about:blank","_blank");
 if(!popup){feedback.textContent="Autorize a abertura de nova aba para o acesso assistido.";return}
 popup.document.body.textContent="Autorizando acesso assistido...";
 loading=true;open.disabled=true;feedback.textContent="Confirmando autorização...";
 try{
 const result=await api("/functions/v1/v67-master-access",window.miAuthTokenV58,{action:"start",target_id:select.value,password:password.value});
 password.value="";
 const verified=await fetch(BASE+"/auth/v1/verify",{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify({type:result.verification_type||"magiclink",token_hash:result.token_hash}),cache:"no-store"});
 const tokens=await verified.json();
 if(!verified.ok||!tokens.refresh_token||!tokens.access_token)throw Error("Não foi possível iniciar a sessão da conta selecionada.");
 // about:blank recém-aberta herda a origem desta aba, permitindo transferência sem URL nem armazenamento global.
 popup.sessionStorage.clear();
 popup.sessionStorage.setItem(STORE_KEY,tokens.refresh_token);
 popup.sessionStorage.setItem(DELEGATION_KEY,JSON.stringify({grant_id:result.grant_id,expires_at:result.expires_at,target_name:result.target_name}));
 popup.location.replace(new URL("./?mi_mestre=1",location.href).href);
 feedback.textContent="Acesso assistido aberto em outra aba. Sua sessão de administrador permanece aqui.";
 }catch(e){password.value="";feedback.textContent=e.message||"Acesso não autorizado.";if(!popup.closed)popup.close()}
 finally{loading=false;open.disabled=false}
});
})();
