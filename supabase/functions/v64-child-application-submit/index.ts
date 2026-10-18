import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const ALLOWED_ORIGIN="https://gavsolucoescontabeis-commits.github.io";
const PROJECT_URL=Deno.env.get("SUPABASE_URL")||"";
const SECRETS=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
const SECRET=SECRETS.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const ALLOWED_FIELDS=["name","birth","father","fphone","mother","mphone","resp","respRelation","rphone","cep","street","num","comp","hood","city","uf","auth","obs","visitor","visitorWithKidId","broughtBy"];
const MAX:Record<string,number>={name:180,birth:10,father:180,fphone:22,mother:180,mphone:22,resp:180,respRelation:80,rphone:22,cep:9,street:180,num:20,comp:80,hood:120,city:120,uf:2,auth:800,obs:750,visitor:3,visitorWithKidId:0,broughtBy:180};

const cors={"Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"content-type, apikey","Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin"};
const respond=(code:number,value:unknown)=>new Response(JSON.stringify(value),{status:code,headers:cors});
const digits=(v:unknown)=>String(v||"").replace(/\D/g,"");
const txt=(v:unknown,max:number)=>typeof v==="string"?v.trim().slice(0,max):"";
async function sha256(value:string){
  const bytes=new TextEncoder().encode(value);
  const hash=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(hash)].map(v=>v.toString(16).padStart(2,"0")).join("");
}
const validPhone=(v:string)=>{const n=digits(v);return n.length===10||n.length===11||n.length===12||n.length===13};

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(req.headers.get("origin")!==ALLOWED_ORIGIN)return respond(403,{ok:false,message:"Origem não autorizada."});
  if(req.method!=="GET"&&req.method!=="POST")return respond(405,{ok:false,message:"Método não permitido."});
  if(!PROJECT_URL||!SECRET)return respond(503,{ok:false,message:"Serviço temporariamente indisponível."});
  const admin=createClient(PROJECT_URL,SECRET,{auth:{persistSession:false,autoRefreshToken:false}});
  try{
    const {data:config,error:configErr}=await admin.from("child_registration_config_v64").select("mode,test_code_hash").eq("id",true).single();
    if(configErr||!config)return respond(503,{ok:false,message:"Cadastro indisponível."});
    if(req.method==="GET")return respond(200,{ok:true,mode:config.mode});
    const raw=await req.text();
    if(raw.length>18000)return respond(413,{ok:false,message:"Formulário muito grande."});
    let input:Record<string,unknown>;
    try{input=JSON.parse(raw)}catch{return respond(400,{ok:false,message:"Dados inválidos."})}
    if(!input||Array.isArray(input)||typeof input!=="object")return respond(400,{ok:false,message:"Dados inválidos."});
    if(config.mode==="closed")return respond(403,{ok:false,message:"Cadastro temporariamente encerrado."});
    const test=Boolean(input.testMode);
    if(config.mode==="test"){
      if(!test||await sha256(String(input.testCode||""))!==config.test_code_hash)
        return respond(403,{ok:false,message:"Acesso de teste não autorizado. Verifique o código."});
    }else if(test){
      return respond(403,{ok:false,message:"Modo de teste encerrado. Utilize o link oficial."});
    }
    if(input.website)return respond(200,{ok:true,protocol:"Recebido"});
    if(input.consent!==true||input.guardianDeclaration!==true)
      return respond(400,{ok:false,message:"É necessário confirmar a declaração do responsável e a autorização de tratamento dos dados."});
    const childRaw=input.child;
    if(!childRaw||typeof childRaw!=="object"||Array.isArray(childRaw))return respond(400,{ok:false,message:"Dados da criança ausentes."});
    const child:Record<string,string>={};
    for(const key of ALLOWED_FIELDS){
      const value=(childRaw as Record<string,unknown>)[key];
      if(value!=null&&typeof value!=="string")return respond(400,{ok:false,message:"Verifique os campos preenchidos."});
      if(String(value||"").length>(MAX[key]??0))return respond(400,{ok:false,message:"Um dos campos excedeu o tamanho permitido."});
      child[key]=txt(value,MAX[key]);
    }
    if(child.name.length<3||child.name.length>180)return respond(400,{ok:false,message:"Informe o nome completo da criança."});
    if(!/^\d{4}-\d{2}-\d{2}$/.test(child.birth))return respond(400,{ok:false,message:"Data de nascimento inválida."});
    const born=new Date(child.birth+"T12:00:00Z"),now=new Date();
    if(Number.isNaN(born.getTime())||born.toISOString().slice(0,10)!==child.birth||born>now
      ||born.getUTCFullYear()<now.getUTCFullYear()-20)return respond(400,{ok:false,message:"Confira a data de nascimento da criança."});
    if(!["sim","nao"].includes(child.visitor))return respond(400,{ok:false,message:"Selecione se a criança é visitante."});
    if(child.visitor==="sim"&&!child.broughtBy)return respond(400,{ok:false,message:"Informe quem trouxe a criança visitante."});
    if(child.visitor!=="sim")child.broughtBy="";
    child.visitorWithKidId=""; // Vínculo com outra criança é feito apenas pela coordenação autenticada.

    const signer=txt(input.guardianName,180);
    const signerPhone=txt(input.guardianPhone,22);
    const signerRelation=txt(input.guardianRelationship,80);
    if(signer.length<3||!validPhone(signerPhone)||!["Pai","Mãe","Responsável legal"].includes(signerRelation))
      return respond(400,{ok:false,message:"Informe o responsável pelo envio, parentesco e telefone válido."});
    if(![child.father,child.mother,child.resp].some(s=>s.length>=3))
      return respond(400,{ok:false,message:"Informe ao menos um pai, mãe ou responsável."});
    const otherPhone=[child.fphone,child.mphone,child.rphone].filter(Boolean);
    if(otherPhone.some(v=>!validPhone(v)))return respond(400,{ok:false,message:"Confira os telefones informados."});
    if(!otherPhone.length)return respond(400,{ok:false,message:"Informe pelo menos um contato dos responsáveis."});
    const candidates=[
      child.father?"Pai — "+child.father.replace(/\s+/g," ").trim():"",
      child.mother?"Mãe — "+child.mother.replace(/\s+/g," ").trim():"",
      child.resp?"Outro responsável — "+child.resp.replace(/\s+/g," ").trim():""
    ].filter(Boolean);
    const pickup=child.auth.split("||").filter(Boolean);
    if(!pickup.length||pickup.length>3||pickup.some(value=>!candidates.includes(value)))
      return respond(400,{ok:false,message:"Confira as pessoas autorizadas a buscar a criança."});

    const ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-forwarded-for")||"").split(",")[0].trim();
    const ipHash=await sha256((ip||"unknown")+"|"+SECRET.slice(-24));
    const oneHour=new Date(Date.now()-3600000).toISOString();
    const {count,error:countError}=await admin.from("child_applications_v64").select("id",{head:true,count:"exact"})
      .eq("ip_hash",ipHash).gte("created_at",oneHour);
    if(countError)return respond(503,{ok:false,message:"Serviço temporariamente indisponível."});
    if((count||0)>=40)return respond(429,{ok:false,message:"Limite de envios alcançado. Tente mais tarde."});

    const {data:saved,error:saveError}=await admin.from("child_applications_v64")
      .insert({child_data:child,guardian_name:signer,guardian_phone:signerPhone,
        guardian_relationship:signerRelation,consent_at:new Date().toISOString(),
        is_test:test,ip_hash:ipHash})
      .select("id").single();
    if(saveError||!saved?.id)return respond(503,{ok:false,message:"Não foi possível registrar o envio. Tente novamente."});
    return respond(200,{ok:true,protocol:"CRI-"+String(saved.id).slice(0,8).toUpperCase(),isTest:test});
  }catch(_err){
    return respond(500,{ok:false,message:"Falha temporária ao receber o cadastro."});
  }
});
