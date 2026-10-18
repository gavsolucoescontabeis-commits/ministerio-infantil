/* Atualização automática do aplicativo instalado - Projeto V60.
   A versão é lida do HTML e do release.json. Não modifica autenticação nem dados. */
(() => {
  'use strict';
  const build = document.querySelector('meta[name="mi-release"]')?.content || '';
  if (!build || typeof fetch !== 'function') return;
  let checking = false;
  let lastCheck = 0;
  let notice = null;

  function inUse() {
    if (window.miV59Saving || window.miCloudSaving) return true;
    // Evita recarga enquanto o administrador possui dados ainda pendentes na nuvem.
    const cloud = window.miCloudState?.();
    if (cloud?.connected && (!cloud.saved || cloud.blocked)) return true;
    if (window.miAuthRoleV58 && window.miAuthRoleV58 !== 'developer' &&
        typeof window.miV59CanReload === 'function' && !window.miV59CanReload()) return true;
    const focused = document.activeElement;
    if (focused?.matches?.('input:not([type="hidden"]), textarea, select, [contenteditable="true"]')) return true;
    const people = document.getElementById('people');
    if (people?.classList.contains('show')) return true;
    return ['kidFormCard', 'entry', 'outBox', 'importBox'].some(id => {
      const item = document.getElementById(id);
      return !!(item && !item.classList.contains('hidden') && item.getClientRects().length);
    });
  }

  function reloadWith(buildId) {
    const url = new URL(location.href);
    url.searchParams.set('mi_build', buildId);
    location.replace(url.toString());
  }

  function showNotice(buildId) {
    if (notice) return;
    notice = document.createElement('div');
    notice.id = 'mi-update-available';
    notice.setAttribute('role', 'status');
    notice.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;max-width:480px;margin:auto;z-index:2147483000;padding:14px;border-radius:12px;background:#263343;color:#fff;box-shadow:0 4px 18px #0005;font:14px Arial,sans-serif;display:flex;align-items:center;gap:10px;justify-content:space-between';
    const message = document.createElement('span');
    message.textContent = 'Nova versão disponível. Salve o que estiver fazendo e atualize.';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Atualizar';
    button.style.cssText = 'border:0;border-radius:8px;background:#31b96c;color:#fff;padding:10px 12px;font-weight:bold;cursor:pointer;flex-shrink:0';
    button.addEventListener('click', () => {
      if (inUse() && !confirm('Atualizar agora? Dados ainda não salvos neste formulário podem ser perdidos.')) return;
      reloadWith(buildId);
    });
    notice.append(message, button);
    document.body.appendChild(notice);
  }

  function applyUpdate(buildId) {
    if (inUse()) { showNotice(buildId); return; }
    const key = 'mi-upgrade-attempt-' + buildId;
    let previous = 0;
    try { previous = Number(sessionStorage.getItem(key)) || 0; } catch (_) {}
    if (Date.now() - previous < 120000) { showNotice(buildId); return; }
    try { sessionStorage.setItem(key, String(Date.now())); } catch (_) {}
    reloadWith(buildId);
  }

  async function checkUpdate() {
    if (document.visibilityState === 'hidden' || checking) return;
    const current = Date.now();
    if (current - lastCheck < 60000) return;
    lastCheck = current;
    checking = true;
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration('./').then(reg => reg?.update()).catch(() => {});
      }
      const url = new URL('./release.json', location.href);
      url.searchParams.set('t', String(current));
      const response = await fetch(url.toString(), {cache: 'no-store'});
      if (!response.ok) return;
      const info = await response.json();
      const newest = info?.build;
      if (typeof newest !== 'string' || !/^[a-zA-Z0-9_.-]{1,64}$/.test(newest) || newest === build) return;
      applyUpdate(newest);
    } catch (_) {
      // Sem conexão: mantém a versão instalada e verifica novamente depois.
    } finally { checking = false; }
  }

  window.addEventListener('focus', checkUpdate);
  window.addEventListener('online', checkUpdate);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkUpdate();
  });
  setInterval(checkUpdate, 3 * 60 * 1000);
  setTimeout(checkUpdate, 5000);
})();
