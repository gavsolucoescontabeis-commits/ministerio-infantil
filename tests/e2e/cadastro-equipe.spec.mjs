import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const formUrl = process.env.FORM_URL || pathToFileURL(resolve('cadastro-equipe/index.html')).href;
const image = { name: 'comprovante.png', mimeType: 'image/png', buffer: Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex') };

async function abrir(page) {
  await page.goto(formUrl);
  await expect(page.locator('#submitBtn')).toBeVisible();
}

async function preencher(page, nascimento) {
  await page.locator('#fullName').fill('Pessoa de Teste');
  await page.locator('#birthDate').fill(nascimento);
  await page.locator('#cpf').fill('12345678909');
  await page.locator('#phone').fill('41999998888');
  await page.locator('#email').fill('teste@example.invalid');
  await page.locator('#accountPassword').fill('SenhaTeste1234');
  await page.locator('#passwordConfirm').fill('SenhaTeste1234');
  await page.locator('#area').selectOption('ebd');
  await page.locator('#declaredRole').selectOption('assistant');
  await page.locator('#privacyAck').check();
}

test('menor vê finalização e envia sem certidão de antecedentes', async ({ page }) => {
  await abrir(page);
  await preencher(page, '2010-04-05');
  await expect(page.locator('#minorFields')).toBeVisible();
  await expect(page.locator('#certificateCard')).toBeHidden();
  await expect(page.locator('#submitBtn')).toBeVisible();
  await page.locator('#minorGuardianName').fill('Responsável de Teste');
  await page.locator('#minorGuardianPhone').fill('41999997777');
  await page.locator('#ageProof').setInputFiles(image);
  let enviou = false;
  await page.route('**/functions/v1/v60-staff-application-submit', async route => {
    const request = route.request();
    const body = request.postData() || '';
    expect(body).toContain('minorGuardianName');
    expect(body).toContain('ageProof');
    expect(body).not.toMatch(/name="certificate"; filename="[^\"]+"/);
    enviou = true;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, protocol: 'TESTE-LOCAL' }) });
  });
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Cadastro enviado com sucesso');
  expect(enviou).toBe(true);
});

test('adulto vê certidão e envia com os campos obrigatórios', async ({ page }) => {
  await abrir(page);
  await preencher(page, '1990-04-05');
  await expect(page.locator('#minorFields')).toBeHidden();
  await expect(page.locator('#certificateCard')).toBeVisible();
  await page.locator('#certIssuedOn').fill('2026-09-01');
  await page.locator('#certificate').setInputFiles(image);
  let enviou = false;
  await page.route('**/functions/v1/v60-staff-application-submit', async route => {
    enviou = true;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, protocol: 'TESTE-LOCAL' }) });
  });
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Cadastro enviado com sucesso');
  expect(enviou).toBe(true);
});

test('menor sem responsável recebe aviso em vez de falha silenciosa', async ({ page }) => {
  await abrir(page);
  await preencher(page, '2010-04-05');
  await page.locator('#ageProof').setInputFiles(image);
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Confira o campo obrigatório');
  await expect(page.locator('#minorGuardianName')).toBeFocused();
});

test('erro do servidor aparece na tela e não indica sucesso', async ({ page }) => {
  await abrir(page);
  await preencher(page, '2010-04-05');
  await page.locator('#minorGuardianName').fill('Responsável de Teste');
  await page.locator('#minorGuardianPhone').fill('41999997777');
  await page.locator('#ageProof').setInputFiles(image);
  await page.route('**/functions/v1/v60-staff-application-submit', route =>
    route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ ok: false, message: 'Erro de homologação' }) })
  );
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Erro de homologação');
  await expect(page.locator('#status')).not.toContainText('Cadastro enviado com sucesso');
});

test('menor sem comprovante recebe aviso visível, sem tentar enviar', async ({ page }) => {
  await abrir(page);
  await preencher(page, '2010-04-05');
  await page.locator('#minorGuardianName').fill('Responsável de Teste');
  await page.locator('#minorGuardianPhone').fill('41999997777');
  let chamadas = 0;
  await page.route('**/functions/v1/v60-staff-application-submit', route => { chamadas++; return route.abort(); });
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Confira o campo obrigatório');
  await expect(page.locator('#ageProof')).toBeFocused();
  expect(chamadas).toBe(0);
});
test('declaração desmarcada impede envio e informa o campo', async ({ page }) => {
  await abrir(page);
  await preencher(page, '2010-04-05');
  await page.locator('#minorGuardianName').fill('Responsável de Teste');
  await page.locator('#minorGuardianPhone').fill('41999997777');
  await page.locator('#ageProof').setInputFiles(image);
  await page.locator('#privacyAck').uncheck();
  await page.locator('#submitBtn').click();
  await expect(page.locator('#status')).toContainText('Confira o campo obrigatório');
  await expect(page.locator('#privacyAck')).toBeFocused();
});
