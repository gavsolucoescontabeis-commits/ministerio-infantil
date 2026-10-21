/* Estudos V66 — habilitação segura.
   Nunca mostrar uma aula incompleta por falta de imagens. Não toca nos outros módulos. */
(()=>{'use strict';
const base='./assets/estudos/';
const flag='aprovado_para_publicacao';
const state={version:'66.1',status:'verificando',missing:[],details:''};
window.MI_ESTUDOS_V66_STATE=state;
function mark(status,details){state.status=status;state.details=details||'';}
async function load(){
  try{
    const req=await fetch('./assets-v66-manifest.json?ver=66.1',{cache:'no-store'});
    if(!req.ok)throw new Error('Manifesto V66 indisponível ('+req.status+')');
    const manifest=await req.json();
    if(manifest.status!==flag){mark('aguardando_arte','Nova versão ainda não aprovada para uso');return}
    if(!Array.isArray(manifest.requiredAssets)||manifest.requiredAssets.length<9)
      throw new Error('Biblioteca ilustrada incompleta');
    const results=await Promise.all(manifest.requiredAssets.map(async ({file,minWidth=300})=>{
      if(!/^[a-z0-9_-]+\.webp$/.test(file||''))return file||'(arquivo inválido)';
      try{
        const img=new Image();
        img.decoding='async';
        img.src=base+file+'?ver=66.1';
        await img.decode();
        if(img.naturalWidth<Math.max(200,Number(minWidth)||300)||img.naturalHeight<200)return file;
        return null;
      }catch{return file}
    }));
    state.missing=results.filter(Boolean);
    if(state.missing.length){mark('aguardando_arte','Imagens ausentes/inválidas: '+state.missing.join(', '));return}
    if(!window.MI_ESTUDOS_EDITORIAL?.mount)throw new Error('Editor anterior indisponível para retorno seguro');
    mark('carregando','Artes completas, iniciando novo editor');
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='./editorial-v66.css?ver=66.1';
    document.head.append(style);
    const script=document.createElement('script');
    script.src='./editorial-v66.js?ver=66.1';
    script.onload=()=>{if(window.MI_ESTUDOS_EDITORIAL?.version?.startsWith('66.')) mark('ativo','Biblioteca validada e compositor V66 carregado'); else mark('erro','Arquivo V66 carregou sem substituir o editor');};
    script.onerror=()=>{style.remove();mark('erro','Falha ao carregar o compositor V66; editor anterior preservado')};
    document.head.append(script);
  }catch(error){mark('aguardando_arte',String(error?.message||error))}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();