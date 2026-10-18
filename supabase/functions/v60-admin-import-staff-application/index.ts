
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const ALLOWED_ORIGIN="https://gavsolucoescontabeis-commits.github.io";
const ACTIVATION_URL="https://gavsolucoescontabeis-commits.github.io/ministerio-infantil/ativar-acesso/";
const MIME=new Set(["application/pdf","image/jpeg","image/png","image/webp"]);

function cors(origin:string|null){
  return {
    "Access-Control-Allow-Origin": origin===ALLOWED_ORIGIN?ALLOWED_ORIGIN:ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers":"authorization, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Vary":"Origin",
    "Content-Type":"application/json; charset=utf-8",
    "Cache-Control":"no-store"
  };
}
function json(status:number,body:unknown,origin:string|null){
  return new Response(JSON.stringify(body),{status,headers:cors(origin)});
}
function safeName(name:string){
  return String(name||"documento").normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,120)||"documento";
}
async function cpfDigest(cpf:string){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(cpf));
  return Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,"0")).join("");
}
function randomPassword(){
  // Senha temporaria com 128 bits de aleatoriedade e menos de 72 caracteres (limite bcrypt).
  return "Mi-"+crypto.randomUUID()+"!A9";
}

Deno.serve(async(req:Request)=>{
  const origin=req.headers.get("origin");
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors(origin)});
  if(req.method!=="POST") return json(405,{ok:false,error:"Método não permitido."},origin);

  const token=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
  if(!token) return json(401,{ok:false,error:"Sessão não informada."},origin);

  let createdUserId:string|null=null;
  let finalPath:string|null=null;
  let imported=false;

  try{
    const body=await req.json();
    const applicationId=String(body.applicationId||"");
    const targetRole=String(body.targetRole||"");
    const targetArea=String(body.targetArea||"");
    const room=String(body.room||"").trim();
    const permissions=body.permissions&&typeof body.permissions==="object"?body.permissions:{};

    if(!/^[0-9a-f-]{36}$/i.test(applicationId)) return json(400,{ok:false,error:"Pré-cadastro inválido."},origin);
    if(!["teacher","coordinator","office"].includes(targetRole)) return json(400,{ok:false,error:"Perfil inválido."},origin);
    if(!["ebd","net"].includes(targetArea)) return json(400,{ok:false,error:"Área inválida."},origin);
    if(targetRole==="teacher"&&targetArea==="ebd"&&!room) return json(400,{ok:false,error:"Selecione a sala da EBD."},origin);

    const secrets=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
    const publishable=JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")||"{}");
    const secretKey=secrets.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
    const publicKey=publishable.default||Deno.env.get("SUPABASE_ANON_KEY")||"";
    const url=Deno.env.get("SUPABASE_URL")||"";
    if(!url||!secretKey||!publicKey) throw new Error("Configuração interna indisponível.");

    const admin=createClient(url,secretKey,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:userData,error:userError}=await admin.auth.getUser(token);
    const caller=userData?.user;
    if(userError||!caller) return json(401,{ok:false,error:"Sessão inválida ou expirada."},origin);

    const {data:callerProfile,error:profileError}=await admin.from("profiles").select("id,role,active").eq("id",caller.id).maybeSingle();
    if(profileError||!callerProfile||callerProfile.role!=="developer"||callerProfile.active!==true){
      return json(403,{ok:false,error:"Acesso exclusivo do administrador."},origin);
    }

    const {data:app,error:appError}=await admin.from("staff_applications_v60")
      .select("id,status,full_name,cpf,email,cert_file_name,cert_storage_path")
      .eq("id",applicationId).maybeSingle();
    if(appError||!app) return json(404,{ok:false,error:"Pré-cadastro não encontrado."},origin);
    if(app.status!=="pending") return json(409,{ok:false,error:"Este pré-cadastro já foi analisado."},origin);

    const cpf=String(app.cpf||"").replace(/\D/g,"");
    const email=String(app.email||"").trim().toLowerCase();
    const name=String(app.full_name||"").trim();
    if(!/^\d{11}$/.test(cpf)) return json(400,{ok:false,error:"CPF inválido no pré-cadastro."},origin);
    if(!/^\S+@\S+\.\S+$/.test(email)) return json(400,{ok:false,error:"Este pré-cadastro não possui um e-mail válido. Corrija o e-mail antes de aprovar."},origin);
    if(name.length<3) return json(400,{ok:false,error:"Nome inválido no pré-cadastro."},origin);

    const digest=await cpfDigest(cpf);
    const {data:existingAlias,error:aliasCheckError}=await admin.from("account_login_aliases").select("user_id").eq("cpf_digest",digest).maybeSingle();
    if(aliasCheckError) throw aliasCheckError;
    if(existingAlias?.user_id) return json(409,{ok:false,error:"Este CPF já possui acesso ao aplicativo."},origin);

    // Cria a conta primeiro com senha aleatória desconhecida do usuário.
    // O usuário só define sua senha pelo link seguro enviado depois da aprovação.
    const accountRole=targetRole==="teacher"?"teacher":"coordinator";
    const {data:created,error:createError}=await admin.auth.admin.createUser({
      email,
      password:randomPassword(),
      email_confirm:true
    });
    if(createError||!created.user){
      return json(409,{ok:false,error:"Não foi possível criar a conta. Confira se este e-mail já está em uso no aplicativo."},origin);
    }
    createdUserId=created.user.id;

    const {error:profileInsert}=await admin.from("profiles").insert({
      id:createdUserId,
      display_name:name,
      role:accountRole,
      active:true,
      cpf_hash:digest
    });
    if(profileInsert) throw new Error("Falha ao criar o perfil de acesso.");

    const {error:aliasInsert}=await admin.from("account_login_aliases").insert({
      user_id:createdUserId,
      cpf_digest:digest
    });
    if(aliasInsert) throw new Error("Falha ao vincular o CPF ao acesso.");

    // Vinculacao EBD ocorre no RPC v60_import_staff_application,
    // com o token do administrador e transacao do cadastro.

    if(!String(app.cert_storage_path||"").startsWith("pending/")) throw new Error("Documento pendente inconsistente.");
    const {data:file,error:downloadError}=await admin.storage.from("certidoes-ministerio").download(app.cert_storage_path);
    if(downloadError||!file) throw new Error("Não foi possível recuperar a certidão pendente.");
    if(file.size===0||file.size>10*1024*1024) throw new Error("Arquivo da certidão inválido.");
    const type=file.type||"application/octet-stream";
    if(type!=="application/octet-stream"&&!MIME.has(type)) throw new Error("Formato da certidão não permitido.");

    finalPath=`certidoes/${caller.id}/${crypto.randomUUID()}/${safeName(app.cert_file_name)}`;
    const {error:uploadError}=await admin.storage.from("certidoes-ministerio").upload(finalPath,file,{
      contentType:type==="application/octet-stream"?"application/pdf":type,
      upsert:false,
      cacheControl:"3600"
    });
    if(uploadError) throw new Error("Não foi possível preparar a certidão definitiva.");

    const rpc=await fetch(url+"/rest/v1/rpc/v60_import_staff_application",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":publicKey,
        "Authorization":"Bearer "+token
      },
      body:JSON.stringify({
        p_application_id:applicationId,
        p_target_role:targetRole,
        p_target_area:targetArea,
        p_room:room,
        p_permissions:permissions,
        p_storage_path:finalPath
      })
    });
    const result=await rpc.json().catch(()=>({}));
    if(!rpc.ok) throw new Error(result.message||result.error||"Não foi possível importar o cadastro.");
    imported=true;

    await admin.from("staff_applications_v60").update({
      account_user_id:createdUserId,
      activation_email_error:null
    }).eq("id",applicationId);

    await admin.storage.from("certidoes-ministerio").remove([app.cert_storage_path]).catch(()=>{});

    // O envio do e-mail é feito somente depois de a conta e o cadastro oficial estarem prontos.
    let emailSent=false;
    let emailError:string|null=null;
    try{
      const publicClient=createClient(url,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
      const {error:mailError}=await publicClient.auth.resetPasswordForEmail(email,{redirectTo:ACTIVATION_URL});
      if(mailError) throw mailError;
      emailSent=true;
      await admin.from("staff_applications_v60").update({
        activation_email_sent_at:new Date().toISOString(),
        activation_email_error:null
      }).eq("id",applicationId);
    }catch(e){
      emailError=e instanceof Error?e.message:"Não foi possível enviar o e-mail de ativação.";
      await admin.from("staff_applications_v60").update({
        activation_email_error:emailError
      }).eq("id",applicationId);
    }

    return json(200,{ok:true,...result,userId:createdUserId,emailSent,emailError},origin);
  }catch(e){
    console.error("v60 admin staff import:",e);
    if(!imported){
      if(finalPath){
        try{
          const secrets=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
          const secretKey=secrets.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
          const url=Deno.env.get("SUPABASE_URL")||"";
          if(url&&secretKey){
            const cleanup=createClient(url,secretKey,{auth:{persistSession:false,autoRefreshToken:false}});
            await cleanup.storage.from("certidoes-ministerio").remove([finalPath]).catch(()=>{});
          }
        }catch{}
      }
      if(createdUserId){
        try{
          const secrets=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
          const secretKey=secrets.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
          const url=Deno.env.get("SUPABASE_URL")||"";
          if(url&&secretKey){
            const cleanup=createClient(url,secretKey,{auth:{persistSession:false,autoRefreshToken:false}});
            await cleanup.auth.admin.deleteUser(createdUserId);
          }
        }catch{}
      }
    }
    return json(500,{ok:false,error:e instanceof Error?e.message:"Falha ao importar o cadastro."},origin);
  }
});
