import { createClient } from "npm:@supabase/supabase-js@2.95.0";
const base=Deno.env.get("SUPABASE_URL")!;
const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const headers={"Access-Control-Allow-Origin":"https://gavsolucoescontabeis-commits.github.io","Access-Control-Allow-Headers":"authorization,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json","Cache-Control":"no-store"};
const reply=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{headers});
  if(req.method!=="POST")return reply({error:"Método não permitido"},405);
  const token=req.headers.get("Authorization")?.replace(/^Bearer\s+/i,"");
  if(!token)return reply({error:"Faça login novamente"},401);
  const admin=createClient(base,service,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data:{user},error:userError}=await admin.auth.getUser(token);
  if(userError||!user)return reply({error:"Sessão inválida"},401);
  let body:Record<string,unknown>;
  try{body=await req.json()}catch{return reply({error:"Dados inválidos"},400)}
  if(body.action==="activate"||body.action==="end"){
    const id=String(body.grant_id||"");if(!uuid.test(id))return reply({error:"Sessão assistida inválida"},400);
    const {data:row,error:rowError}=await admin.from("v67_master_access_audit").select("id,target_id,expires_at,ended_at,target_session_id").eq("id",id).maybeSingle();
    if(rowError||!row||row.target_id!==user.id||row.ended_at)return reply({error:"Sessão assistida não encontrada"},403);
    const payload=JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
    if(!uuid.test(String(payload.session_id||"")))return reply({error:"Sessão inválida"},401);
    if(body.action==="activate"){
      if(new Date(row.expires_at).getTime()<=Date.now())return reply({error:"Prazo de acesso expirado"},403);
      const {error}=await admin.from("v67_master_access_audit").update({target_session_id:payload.session_id,activated_at:new Date().toISOString()}).eq("id",id).is("target_session_id",null);
      if(error)return reply({error:"Falha ao registrar ativação"},500);
      return reply({ok:true});
    }
    if(row.target_session_id!==payload.session_id)return reply({error:"Sessão não corresponde à autorização"},403);
    const {error}=await admin.from("v67_master_access_audit").update({ended_at:new Date().toISOString()}).eq("id",id);
    return error?reply({error:"Não foi possível registrar encerramento"},500):reply({ok:true});
  }
  if(body.action!=="start")return reply({error:"Operação inválida"},400);
  const {data:profile,error:profileError}=await admin.from("profiles").select("role,active").eq("id",user.id).maybeSingle();
  const {data:owner,error:ownerError}=await admin.from("v67_master_access_owners").select("user_id").eq("user_id",user.id).maybeSingle();
  if(profileError||ownerError||profile?.role!=="developer"||profile.active!==true||!owner)return reply({error:"Acesso exclusivo do administrador principal"},403);
  const targetId=String(body.target_id||""),password=String(body.password||"");
  if(!uuid.test(targetId)||password.length<1||password.length>128)return reply({error:"Dados inválidos"},400);
  const {data:target,error:targetError}=await admin.from("profiles").select("id,role,active,display_name").eq("id",targetId).maybeSingle();
  if(targetError||!target?.active||!["teacher","coordinator"].includes(target.role)||target.id===user.id)return reply({error:"Conta indisponível"},403);
  const {data:lifecycle}=await admin.from("v58_staff_lifecycle").select("deleted").eq("staff_id",target.id).maybeSingle();
  if(lifecycle?.deleted)return reply({error:"Conta excluída"},403);
  if(!user.email)return reply({error:"Administrador sem e-mail válido"},400);
  const {error:proofError}=await admin.auth.signInWithPassword({email:user.email,password});
  if(proofError)return reply({error:"Confirmação da senha administrativa não reconhecida"},401);
  const fifteen=new Date(Date.now()-15*60*1000).toISOString();
  const {count,error:countError}=await admin.from("v67_master_access_audit").select("id",{count:"exact",head:true}).eq("admin_id",user.id).gte("started_at",fifteen);
  if(countError)return reply({error:"Não foi possível validar o limite de acessos"},503);
  if((count||0)>=5)return reply({error:"Limite de cinco acessos em 15 minutos atingido"},429);
  const {data:account,error:accountError}=await admin.auth.admin.getUserById(targetId);
  if(accountError||!account.user?.email)return reply({error:"Conta sem e-mail apto para acesso assistido"},400);
  const {data:link,error:linkError}=await admin.auth.admin.generateLink({type:"magiclink",email:account.user.email});
  if(linkError||!link.properties?.hashed_token)return reply({error:"Falha ao gerar entrada temporária"},500);
  const {data:audit,error:auditError}=await admin.from("v67_master_access_audit").insert({admin_id:user.id,target_id:targetId,target_role:target.role}).select("id,expires_at").single();
  if(auditError||!audit)return reply({error:"Auditoria indisponível: entrada bloqueada"},503);
  return reply({ok:true,grant_id:audit.id,expires_at:audit.expires_at,token_hash:link.properties.hashed_token,verification_type:link.properties.verification_type||"magiclink",target_name:target.display_name||"Conta selecionada"});
});