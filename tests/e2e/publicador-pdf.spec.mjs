import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const endpoint='https://jthxnjvqmvtydyfuqcct.supabase.co';
const pdf=(page)=>Buffer.from('%PDF-1.7\n'+('% corpo de teste preservado\n'.repeat(page===7?80:70))+'%%EOF');
const pdf5=pdf(7),pdf7=pdf(6);
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const packages=[
 {id:'jonas-5-6-caderno-aprovado-29out2026',payload:{title:'Jonas e o Grande Peixe',status:'review',ageMin:5,ageMax:6,ageLabel:'5 e 6 anos',pages:7,references:['Jonas 1–4'],aliases:['Jonas'],pdfSha256:sha(pdf5)}},
 {id:'jonas-7-9-caderno-aprovado-30out2026',payload:{title:'Jonas e o Grande Peixe',status:'review',ageMin:7,ageMax:9,ageLabel:'7 a 9 anos',pages:6,references:['Jonas 1–4'],aliases:['Jonas'],pdfSha256:sha(pdf7)}},
 {id:'criacao-5-6',payload:{title:'A Criação',status:'review',ageMin:5,ageMax:6,pages:7,references:['Gênesis 1'],pdfSha256:'ab'.repeat(32)}}
];
async function abrir(page){
 await page.addInitScript(()=>{
  Object.defineProperty(window,'opener',{configurable:true,value:{miAuthTokenV58:'token-de-homologacao-local'}});
 });
 await page.route(endpoint+'/rest/v1/**',route=>{
  const url=route.request().url();
  if(url.includes('/rpc/current_staff_profile'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{staff_role:'developer'}])});
  if(url.includes('/mi_study_activity_packages'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(packages)});
  return route.fulfill({status:404,body:'{}'});
 });
 await page.goto(pathToFileURL(resolve('estudos/publicar-pdf.html')).href);
 await expect(page.locator('#publish')).toBeEnabled();
 await expect(page.locator('#entry')).toHaveValue('new');
}

test('PDF aprovado de Jonas 5 e 6 é reconhecido sem escolher registro manualmente',async({page})=>{
 await abrir(page);
 await page.locator('#pdf').setInputFiles({name:'Jonas_5_a_6_anos_Caderno_Aprovado_7_paginas.pdf',mimeType:'application/pdf',buffer:pdf5});
 await expect(page.locator('#entry')).toHaveValue('jonas-5-6-caderno-aprovado-29out2026');
 await expect(page.locator('#theme')).toHaveValue('Jonas e o Grande Peixe');
 await expect(page.locator('#minAge')).toHaveValue('5');
 await expect(page.locator('#maxAge')).toHaveValue('6');
 await expect(page.locator('#pages')).toHaveValue('7');
 await expect(page.locator('#status')).toContainText('PDF reconhecido');
});

test('PDF de Jonas 7 a 9 corrige seleção errada de Criação automaticamente',async({page})=>{
 await abrir(page);
 await page.locator('#entry').selectOption('criacao-5-6');
 await page.locator('#pdf').setInputFiles({name:'Jonas_7_a_9_anos_Caderno_Aprovado_6_paginas.pdf',mimeType:'application/pdf',buffer:pdf7});
 await expect(page.locator('#entry')).toHaveValue('jonas-7-9-caderno-aprovado-30out2026');
 await expect(page.locator('#theme')).toHaveValue('Jonas e o Grande Peixe');
 await expect(page.locator('#minAge')).toHaveValue('7');
 await expect(page.locator('#maxAge')).toHaveValue('9');
 await expect(page.locator('#pages')).toHaveValue('6');
});

test('imagem enviada no lugar do PDF apresenta erro explícito',async({page})=>{
 await abrir(page);
 await page.locator('#pdf').setInputFiles({name:'previa.png',mimeType:'image/png',buffer:Buffer.from('PNG teste')});
 await expect(page.locator('#status')).toContainText('não');
 await expect(page.locator('#entry')).toHaveValue('new');
});
