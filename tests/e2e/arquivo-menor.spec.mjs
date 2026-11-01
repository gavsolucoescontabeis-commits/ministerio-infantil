import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const formUrl=process.env.FORM_URL||pathToFileURL(resolve('cadastro-equipe/index.html')).href;
const pdf={name:'nascimento.pdf',mimeType:'application/octet-stream',buffer:Buffer.from('%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n')};
const docx={name:'certidao.docx',mimeType:'application/octet-stream',buffer:Buffer.from('504b0304140000000800000000000000','hex')};
const exe={name:'programa.exe',mimeType:'application/octet-stream',buffer:Buffer.from('4d5a00000000','hex')};
const heic={name:'foto.heic',mimeType:'application/octet-stream',buffer:Buffer.from('00000018667479706865696300000000','hex')};
async function abrirEPreencher(page){
 await page.goto(formUrl);
 await page.locator('#fullName').fill('Pessoa de Teste');
 await page.locator('#birthDate').fill('2010-04-05');
 await page.locator('#cpf').fill('12345678909');
 await page.locator('#phone').fill('41999998888');
 await page.locator('#email').fill('teste@example.invalid');
 await page.locator('#accountPassword').fill('SenhaTeste1234');
 await page.locator('#passwordConfirm').fill('SenhaTeste1234');
 await page.locator('#area').selectOption('ebd');
 await page.locator('#declaredRole').selectOption('assistant');
 await page.locator('#minorGuardianName').fill('Responsável de Teste');
 await page.locator('#minorGuardianPhone').fill('41999997777');
 await page.locator('#privacyAck').check();
}
for(const [label,arquivo] of [['PDF mesmo com MIME genérico',pdf],['DOCX mesmo com MIME genérico',docx],['foto HEIC do celular',heic]]){
 test('menor: '+label+' passa validação e é enviado',async({page})=>{
  test.skip(!!process.env.FORM_URL,'Este teste valida o código local; o publicado é validado após o deploy.');
  await abrirEPreencher(page);
  await expect(page.locator('#ageProof')).not.toHaveAttribute('accept',/image/);
  await page.locator('#ageProof').setInputFiles(arquivo);
  let uploads=0;
  await page.route('**/functions/v1/v60-staff-application-submit',route=>{
   uploads++;
   const body=route.request().postData()||'';
   expect(body).toContain('ageProof');
   expect(body).toContain(arquivo.name);
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,protocol:'TESTE-LOCAL'})});
  });
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Cadastro enviado com sucesso');
  expect(uploads).toBe(1);
 });
}
test('menor: programa executável é bloqueado antes do envio',async({page})=>{
 test.skip(!!process.env.FORM_URL,'Cenário exclusivo do formulário local atualizado.');
 await abrirEPreencher(page);
 await page.locator('#ageProof').setInputFiles(exe);
 let uploads=0;
 await page.route('**/functions/v1/v60-staff-application-submit',route=>{uploads++;return route.abort()});
 await page.locator('#submitBtn').click();
 await expect(page.locator('#status')).toContainText('Outros formatos não são aceitos por segurança');
 expect(uploads).toBe(0);
});
