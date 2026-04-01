/* ═══════════════════════════════════════════════════════
   SwiftRoom — UI Utilities
   Toast, modal, confetti, context menu, helpers
   ═══════════════════════════════════════════════════════ */

/* ─────────────────────────────
   TOAST SYSTEM
───────────────────────────── */
const Toast = (() => {
  let container;

  function ensureContainer() {
    if (!container) {
      container = document.getElementById('toast-container');
    }
  }

  function show(message, type = 'info', duration = 3000) {
    ensureContainer();

    const icons = {
      ok:   `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 5.5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      err:  `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
      warn: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v5M6.5 9.5v.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
      info: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 5.5v4M6.5 4v-.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);

    const timeout = setTimeout(() => {
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 220);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timeout);
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 220);
    });
  }

  return { show, ok: (m, d) => show(m, 'ok', d), err: (m, d) => show(m, 'err', d), warn: (m, d) => show(m, 'warn', d), info: (m, d) => show(m, 'info', d) };
})();

/* ─────────────────────────────
   MODAL SYSTEM
───────────────────────────── */
const Modal = (() => {
  let activeBackdrop = null;

  function show({ title, subtitle, body, actions = [], onClose }) {
    close();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const footerHTML = actions.map(a =>
      `<button class="btn btn-${a.style || 'ghost'}" data-action="${a.action}">${a.label}</button>`
    ).join('');

    modal.innerHTML = `
      <div class="modal-title">${title}</div>
      ${subtitle ? `<div class="modal-sub">${subtitle}</div>` : ''}
      ${body || ''}
      ${actions.length ? `<div class="modal-footer">${footerHTML}</div>` : ''}
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    activeBackdrop = backdrop;

    // Focus first input
    requestAnimationFrame(() => {
      const inp = modal.querySelector('input');
      if (inp) inp.focus();
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) { close(); onClose && onClose(null); }
    });

    modal.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      close();
      onClose && onClose(action, modal);
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { close(); onClose && onClose(null); }
      if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const primary = modal.querySelector('.btn-primary');
        if (primary) primary.click();
      }
    });

    return modal;
  }

  function close() {
    if (activeBackdrop) {
      activeBackdrop.remove();
      activeBackdrop = null;
    }
  }

  return { show, close };
})();

/* ─────────────────────────────
   CONTEXT MENU
───────────────────────────── */
const ContextMenu = (() => {
  let active = null;

  function show(x, y, items) {
    hide();

    const menu = document.createElement('div');
    menu.className = 'context-menu';

    items.forEach(item => {
      if (item === 'divider') {
        const d = document.createElement('div');
        d.className = 'ctx-divider';
        menu.appendChild(d);
        return;
      }
      const el = document.createElement('div');
      el.className = `ctx-item${item.danger ? ' danger' : ''}`;
      el.innerHTML = `
        ${item.icon ? `<svg width="13" height="13" viewBox="0 0 13 13" fill="none">${item.icon}</svg>` : ''}
        ${item.label}
      `;
      el.addEventListener('click', () => { hide(); item.action && item.action(); });
      menu.appendChild(el);
    });

    document.body.appendChild(menu);
    active = menu;

    // Position clamped to viewport
    const rect = menu.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    menu.style.left = Math.min(x, vw - rect.width - 8) + 'px';
    menu.style.top  = Math.min(y, vh - (items.length * 36 + 12)) + 'px';

    setTimeout(() => document.addEventListener('click', hide, { once: true }), 50);
  }

  function hide() {
    if (active) { active.remove(); active = null; }
  }

  return { show, hide };
})();

/* ─────────────────────────────
   CONFETTI
───────────────────────────── */
function spawnConfetti(container, count = 26) {
  const colors = ['#7c3aed','#a78bfa','#ec4899','#f59e0b','#10b981','#60a5fa','#f472b6','#34d399'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.cssText = `
      left: ${15 + Math.random() * 70}%;
      top: 0;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${0.7 + Math.random() * 0.9}s;
      animation-delay: ${Math.random() * 0.35}s;
      transform-origin: center;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 1800);
  }
}

/* ─────────────────────────────
   TRANSITION
───────────────────────────── */
function withTransition(callback) {
  const overlay = document.getElementById('transition-overlay');
  overlay.classList.add('show');
  setTimeout(() => {
    callback();
    setTimeout(() => overlay.classList.remove('show'), 200);
  }, 165);
}

/* ─────────────────────────────
   MISC HELPERS
───────────────────────────── */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

function randomId(prefix = 'room') {
  return `${prefix}-${Math.random().toString(36).substr(2, 4)}`;
}

function formatRelativeTime(ms) {
  const delta = Date.now() - ms;
  if (delta < 60000)        return 'just now';
  if (delta < 3600000)      return `${Math.floor(delta / 60000)} min ago`;
  if (delta < 86400000)     return `${Math.floor(delta / 3600000)} hr ago`;
  if (delta < 604800000)    return `${Math.floor(delta / 86400000)} days ago`;
  return 'last week';
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function createElement(tag, classes = '', html = '') {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  if (html)    el.innerHTML = html;
  return el;
}

// Announce to screen readers
function announce(msg) {
  const el = document.createElement('div');
  el.className = 'sr-only';
  el.setAttribute('aria-live', 'polite');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
