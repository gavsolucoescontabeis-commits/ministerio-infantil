import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const js=readFileSync(new URL("../acesso-mestre-v67.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const edge=readFileSync(new URL("../supabase/functions/v67-master-access/index.ts",import.meta.url),"utf8");
const sql=readFileSync(new URL("../sql/v67_acesso_mestre.sql",import.meta.url),"utf8");
test("Painel de acesso mestre compila sem executar o código",()=>assert.doesNotThrow(()=>new Script(js)));
test("Index usa armazenamento separado somente na sessão assistida",()=>{
 assert.match(html,/const V67_STORAGE=new URLSearchParams\(location\.search\)\.get\('mi_mestre'\)==='1'\?sessionStorage:localStorage/);
 assert.match(html,/V67_STORAGE\.setItem\(SESSION_KEY/);
 assert.match(html,/saved=V67_STORAGE\.getItem\(SESSION_KEY\)/);
 assert.equal((html.match(/<script src="\.\/acesso-mestre-v67\.js\?v=67-1"/g)||[]).length,1);
});
test("Servidor só disponibiliza acesso a administrador principal com senha validada",()=>{
 assert.match(edge,/v67_master_access_owners/);
 assert.match(edge,/proof\.auth\.signInWithPassword/);
 assert.match(edge,/\["teacher","coordinator"\]/);
 assert.match(edge,/v67_master_access_audit/);
 assert.match(edge,/admin\.auth\.admin\.generateLink/);
});
test("Tabela de auditoria é privada e tem RLS",()=>{
 assert.match(sql,/enable row level security/i);
 assert.match(sql,/revoke all on public\.v67_master_access_audit from public,anon,authenticated/i);
 assert.match(sql,/revoke all on public\.v67_master_access_owners from public,anon,authenticated/i);
});
