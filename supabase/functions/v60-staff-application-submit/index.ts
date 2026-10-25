
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const ALLOWED_ORIGIN = "https://gavsolucoescontabeis-commits.github.io";
const MAX_FILE = 10 * 1024 * 1024;
const MIME = new Set(["application/pdf","image/jpeg","image/png","image/webp"]);
const AREAS = new Set(["ebd","net","both"]);
const ROLES = new Set(["teacher","assistant","coordinator","office","other"]);

function cors(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
}
function json(status:number, body:unknown, origin:string|null) {
  return new Response(JSON.stringify(body), { status, headers: cors(origin) });
}
function txt(v: FormDataEntryValue | null, max=500) {
  return String(v ?? "").trim().slice(0,max);
}
function properName(v:string) {
  return String(v||"").trim().toLocaleLowerCase("pt-BR").replace(/(^|[\\s'-])([a-záàâãéêíóôõúüç])/g,(_,p,c)=>p+c.toLocaleUpperCase("pt-BR"));
}
function validCpf(raw:string) {
  const cpf=raw.replace(/\D/g,"");
  if(!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc=(len:number)=>{
    let sum=0;
    for(let i=0;i<len;i++) sum += Number(cpf[i]) * (len + 1 - i);
    const r=(sum*10)%11;
    return (r===10?0:r);
  };
  return calc(9)===Number(cpf[9]) && calc(10)===Number(cpf[10]);
}
function isoDate(v:string) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const date=new Date(v+"T12:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10)===v;
}
function ageYears(birth:string,today:string){let age=Number(today.slice(0,4))-Number(birth.slice(0,4));if(today.slice(5)<birth.slice(5))age--;return age;}
function localDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function safeName(name:string) {
  return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,120) || "documento";
}

Deno.serve(async (req: Request) => {
  const origin=req.headers.get("origin");
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors(origin)});
  if(req.method!=="POST") return json(405,{ok:false,message:"Método não permitido."},origin);

  const length=Number(req.headers.get("content-length")||0);
  if(length && length > MAX_FILE + 200000) return json(413,{ok:false,message:"Envio acima do limite permitido."},origin);

  let cleanupClient:any=null;
  let createdUserId:string|null=null;
  const uploadedPaths:string[]=[];
  let registered=false;
  let failStatus=500;
  try {
    const form=await req.formData();

    if(txt(form.get("website"),200)) {
      return json(200,{ok:true,message:"Cadastro recebido."},origin);
    }

    const fullName=properName(txt(form.get("fullName"),180));
    const cpf=txt(form.get("cpf"),30).replace(/\D/g,"");
    const phone=txt(form.get("phone"),30);
    const email=txt(form.get("email"),180).toLowerCase();
    const area=txt(form.get("area"),10);
    const declaredRole=txt(form.get("declaredRole"),20);
    const currentRoom=txt(form.get("currentRoom"),120);
    const notes=txt(form.get("notes"),1500);
    const birthDate=txt(form.get("birthDate"),10);
    const accountPassword=String(form.get("accountPassword")||"");
    const minorGuardianName=properName(txt(form.get("minorGuardianName"),180));
    const minorGuardianPhone=txt(form.get("minorGuardianPhone"),30);
    const certIssuedOn=txt(form.get("certIssuedOn"),10);
    const privacyAck=txt(form.get("privacyAck"),10)==="yes";
    const file=form.get("certificate");
    const proof=form.get("ageProof");

    if(fullName.length<2) return json(400,{ok:false,message:"Informe o nome completo."},origin);
    if(!validCpf(cpf)) return json(400,{ok:false,message:"CPF inválido. Confira os números informados."},origin);
    const phoneDigits=phone.replace(/\D/g,"");
    if(phoneDigits.length<10 || phoneDigits.length>13) return json(400,{ok:false,message:"Informe um telefone/WhatsApp válido."},origin);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400,{ok:false,message:"Informe um e-mail válido."},origin);
    if(accountPassword.length<10||accountPassword.length>72||!/[A-Za-zÀ-ÿ]/.test(accountPassword)||!/\d/.test(accountPassword))return json(400,{ok:false,message:"Crie uma senha entre 10 e 72 caracteres, com letras e números."},origin);
    if(!AREAS.has(area)) return json(400,{ok:false,message:"Selecione a área de atuação."},origin);
    if(!ROLES.has(declaredRole)) return json(400,{ok:false,message:"Selecione a atuação atual."},origin);
    const today=localDate();
    if(!isoDate(birthDate)||birthDate>today||birthDate<'1900-01-01')return json(400,{ok:false,message:"Informe uma data de nascimento válida."},origin);
    const minor=ageYears(birthDate,today)<18;
    if(minor){
      if(minorGuardianName.length<3 || minorGuardianPhone.replace(/\D/g,'').length<10)
        return json(400,{ok:false,message:"Para menores de 18 anos, informe o nome e telefone do responsável legal."},origin);
      if(certIssuedOn || (file instanceof File && file.size>0))
        return json(400,{ok:false,message:"Menores de 18 anos não precisam anexar certidão estadual; remova o arquivo."},origin);
      if(!(proof instanceof File)||proof.size===0)return json(400,{ok:false,message:"Anexe RG, CIN ou certidão de nascimento para comprovar a idade."},origin);
      if(proof.size>MAX_FILE)return json(413,{ok:false,message:"O comprovante de idade deve ter no máximo 10 MB."},origin);
      if(!MIME.has(proof.type))return json(400,{ok:false,message:"O comprovante precisa ser PDF, JPG, PNG ou WebP."},origin);
    }else{
      if(proof instanceof File && proof.size>0)return json(400,{ok:false,message:"Comprovante de idade separado é usado somente para menores de 18 anos."},origin);
      if(!isoDate(certIssuedOn))return json(400,{ok:false,message:"Informe a data de emissão da certidão."},origin);
      if(certIssuedOn>today)return json(400,{ok:false,message:"Confira a data de emissão da certidão."},origin);
      if(certIssuedOn<=birthDate)return json(400,{ok:false,message:"A data de emissão da certidão não pode ser a data de nascimento nem anterior a ela. Confira o documento."},origin);
      const issuedAgeDays=(Date.parse(today+"T12:00:00Z")-Date.parse(certIssuedOn+"T12:00:00Z"))/86400000;
      if(!Number.isFinite(issuedAgeDays)||issuedAgeDays>365)return json(400,{ok:false,message:"A data de emissão da certidão é muito antiga. Confira o documento."},origin);
      if(!(file instanceof File)||file.size===0)return json(400,{ok:false,message:"Anexe a certidão de antecedentes."},origin);
      if(file.size>MAX_FILE)return json(413,{ok:false,message:"A certidão deve ter no máximo 10 MB."},origin);
      if(!MIME.has(file.type))return json(400,{ok:false,message:"Envie a certidão em PDF, JPG, PNG ou WebP."},origin);
    }
    if(!privacyAck) return json(400,{ok:false,message:"É necessário confirmar a declaração de envio dos dados."},origin);

    const secrets=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    const serviceKey=secrets.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const url=Deno.env.get("SUPABASE_URL") || "";
    if(!url || !serviceKey) throw new Error("Configuração interna indisponível.");

    const supabase=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
    cleanupClient=supabase;
    // Não recriar contas nem aceitar cadastros duplicados do mesmo CPF.
    const {data:existing,error:duplicateError}=await supabase.from("staff_applications_v60")
      .select("id").eq("cpf",cpf).in("status",["pending","imported"]).limit(1);
    if(duplicateError)throw new Error("Não foi possível conferir cadastros existentes.");
    if(existing?.length)return json(409,{ok:false,message:"Esse CPF já possui pré-cadastro ou acesso. Procure a coordenação."},origin);
    const applicationId=crypto.randomUUID();
    let path:string|null=null;
    let proofPath:string|null=null;
    if(minor && proof instanceof File){
      const head=new Uint8Array(await proof.slice(0,16).arrayBuffer());
      const has=(bytes:number[])=>bytes.every((v,i)=>head[i]===v);
      const signature=proof.type==="application/pdf" ? has([37,80,68,70,45])
       : proof.type==="image/jpeg" ? has([255,216,255])
       : proof.type==="image/png" ? has([137,80,78,71,13,10,26,10])
       : proof.type==="image/webp" ? String.fromCharCode(...head.slice(0,4))==="RIFF" && String.fromCharCode(...head.slice(8,12))==="WEBP"
       : false;
      if(!signature)return json(400,{ok:false,message:"O arquivo do comprovante não corresponde a um PDF ou imagem válida."},origin);
      const ext:Record<string,string>={"application/pdf":"pdf","image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
      proofPath=`pending/${applicationId}/idade/comprovante.${ext[proof.type]}`;
      const {error:proofErr}=await supabase.storage.from("certidoes-ministerio")
       .upload(proofPath,proof,{contentType:proof.type,upsert:false,cacheControl:"3600"});
      if(proofErr)throw new Error("Não foi possível armazenar o comprovante de idade.");
      uploadedPaths.push(proofPath);
    }
    if(!minor && file instanceof File){
      path=`pending/${applicationId}/${safeName(file.name)}`;
      const {error:uploadError}=await supabase.storage.from("certidoes-ministerio")
       .upload(path,file,{contentType:file.type,upsert:false,cacheControl:"3600"});
      if(uploadError)throw new Error("Não foi possível armazenar a certidão.");
      uploadedPaths.push(path);
    }

    // Cria a conta no Auth com a senha definida pela própria pessoa.
    // Não confirmamos propriedade do e-mail: identidade/documentos são verificados
    // pela administração antes de ativar perfil e associar CPF ao login.
    const digestBytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(cpf));
    const cpfDigest=Array.from(new Uint8Array(digestBytes)).map(b=>b.toString(16).padStart(2,"0")).join("");
    const {data:created,error:createError}=await supabase.auth.admin.createUser({
      email,password:accountPassword,email_confirm:true
    });
    if(createError||!created.user){
      failStatus=409;
      throw new Error("Não foi possível criar a conta. Esse e-mail pode já estar cadastrado; contate a coordenação.");
    }
    createdUserId=created.user.id;
    const {error:profileError}=await supabase.from("profiles").insert({
      id:createdUserId,display_name:fullName,role:"teacher",active:false,cpf_hash:cpfDigest
    });
    if(profileError)throw new Error("Não foi possível registrar a conta pendente.");

    const { error: insertError }=await supabase.from("staff_applications_v60").insert({
      id:applicationId,
      full_name:fullName,
      cpf,
      phone,
      email,
      area,
      declared_role:declaredRole,
      current_room:currentRoom || null,
      notes:notes || null,
      birth_date:birthDate,
      minor_guardian_name:minor?minorGuardianName:null,
      minor_guardian_phone:minor?minorGuardianPhone:null,
      age_proof_file_name:minor && proof instanceof File?proof.name.slice(0,240):null,
      age_proof_storage_path:minor?proofPath:null,
      cert_issued_on:minor?null:certIssuedOn,
      cert_file_name:minor?null:(file instanceof File?file.name.slice(0,240):null),
      cert_storage_path:path,
      privacy_ack:true,
      source:"public-form-v60-password",
      account_user_id:createdUserId,
      status:"pending"
    });

    if(insertError){
      failStatus=insertError.code==="23505"?409:500;
      throw new Error(insertError.code==="23505"
        ?"Já existe um cadastro pendente para este CPF. Contate a coordenação."
        :"Não foi possível registrar o cadastro.");
    }
    registered=true;
    return json(200,{
      ok:true,
      message:"Cadastro enviado com sucesso. Sua senha já está definida; o acesso será liberado após aprovação.",
      protocol:applicationId.split("-")[0].toUpperCase()
    },origin);
  } catch (e) {
    if(!registered&&cleanupClient){
      // Operação fracassou: não deixar conta bloqueada órfã nem documento solto.
      if(createdUserId){
        try{await cleanupClient.auth.admin.deleteUser(createdUserId)}
        catch(err){console.error("Falha ao limpar conta incompleta",err)}
      }
      if(uploadedPaths.length){
        try{await cleanupClient.storage.from("certidoes-ministerio").remove(uploadedPaths)}
        catch(err){console.error("Falha ao limpar anexo incompleto",err)}
      }
    }
    console.error("staff application submit:",e instanceof Error?e.message:"Erro desconhecido");
    const friendly=e instanceof Error?e.message:"Não foi possível enviar o cadastro agora.";
    return json(failStatus,{ok:false,message:friendly},origin);
  }
});
