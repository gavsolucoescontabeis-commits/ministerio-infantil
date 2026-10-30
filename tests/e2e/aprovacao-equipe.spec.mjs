import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';

const minor = {
 id: 'fe077fad-cfec-4d6f-bbc3-f540fe590e24',
 full_name: 'Pessoa Menor de Teste', cpf: '12345678909', phone: '41999999999',
 email: 'teste@example.invalid', area: 'ebd', declared_role: 'teacher',
 current_room: 'Sala de Teste', birth_date: '2015-10-20',
 source: 'public-form-v60-password', created_at: '2026-10-29T20:00:00Z',
 minor_guardian_name: 'Responsável Teste', minor_guardian_phone: '41988887777',
 age_proof_storage_path: 'pending/teste/idade/comprovante.jpg'
};
async function setup(page, app) {
 await page.goto('about:blank');
 await page.setContent('<div id="people"></div><div id="miTeamAccessPane"><p class="miV66Intro">Cadastro da equipe</p></div>');
 await page.evaluate(() => {
  window.miAuthRoleV58 = 'developer';
  window.miAuthTokenV58 = 'token-de-testes-somente';
  window.d = { rooms: ['Sala de Teste'] };
 });
 await page.route('**/rest/v1/**', route => route.fulfill({ status:200, contentType:'application/json', body:'[]' }));
 await page.route('**/rest/v1/staff_applications_v60?*', route => {
  const pending = route.request().url().includes('status=eq.pending');
  return route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(pending?[app]:[]) });
 });
 await page.addScriptTag({ path: resolve('staff-pending.js') });
 await page.evaluate(() => window.dispatchEvent(new Event('mi-auth-ready')));
 await expect(page.locator('.mi-pending-card')).toBeVisible();
 await page.getByRole('button',{name:'Revisar e aprovar este cadastro'}).click();
 await expect(page.locator('.mi-pending-config')).toBeVisible();
}

test('menor: uma confirmação de conferência, sem perguntas repetidas, mantendo dados exigidos no servidor',async({page})=>{
 await setup(page,minor);
 const checks=page.locator('.mi-pending-config label.mi-pending-verify:visible input[type=checkbox]');
 await expect(checks).toHaveCount(1);
 await expect(page.locator('.mi-pending-verify:visible')).toContainText('documento de idade');
 let chamadas=0;
 await page.route('**/functions/v1/v60-admin-import-staff-application',async route=>{
  chamadas++;
  const payload=route.request().postDataJSON();
  expect(payload.applicationId).toBe(minor.id);
  expect(payload.permissions.identityConfirmed).toBe(true);
  expect(payload.permissions.minorGuardianConfirmed).toBe(true);
  expect(payload.permissions.minorAgeProofConfirmed).toBe(true);
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,passwordReady:true})});
 });
 const approve=page.getByRole('button',{name:'APROVAR CADASTRO E LIBERAR ACESSO'});
 await approve.click();
 await expect(page.locator('.mi-pending-review-status')).toContainText('Confirme a conferência');
 expect(chamadas).toBe(0);
 await checks.check();
 const dialogs=[];
 page.on('dialog',d=>{dialogs.push(d.type()); d.dismiss()});
 await approve.click();
 await expect(page.locator('#miPendingSuccessV644')).toContainText('CADASTRO APROVADO');
 expect(chamadas).toBe(1);
 expect(dialogs).toHaveLength(0);
});

test('adulto: confirma identidade, certidão opcional, sem caixa adicional de confirmação',async({page})=>{
 await setup(page,{...minor,birth_date:'1990-10-20',cert_storage_path:'pending/teste/certidao.pdf',
 age_proof_storage_path:null,minor_guardian_name:null,minor_guardian_phone:null});
 const checks=page.locator('.mi-pending-config label.mi-pending-verify:visible input[type=checkbox]');
 await expect(checks).toHaveCount(2);
 await expect(page.locator('.mi-pending-verify:visible')).toContainText('identidade');
});
