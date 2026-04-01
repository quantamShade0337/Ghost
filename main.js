/* ═══════════════════════════════════════════════════════
   SwiftRoom — Main Bootstrap
   App init, loading sequence, global event wiring
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── INJECT GHOST INTO LOADING + TRANSITION ── */
  function injectGhosts() {
    const loadGhost = document.getElementById('load-ghost');
    if (loadGhost) loadGhost.innerHTML = GHOST_SVG(42);

    const overlay = document.getElementById('transition-overlay');
    if (overlay) overlay.innerHTML = GHOST_SVG(40, '#2d1f4a', '#f0eeff');
  }

  /* ── LOADING SEQUENCE ── */
  function bootLoader() {
    const screen = document.getElementById('loading-screen');
    const labels = ['warming up', 'loading projects', 'almost there'];
    let i = 0;
    const label = screen.querySelector('.load-label');

    const cycle = setInterval(() => {
      i = (i + 1) % labels.length;
      label.textContent = labels[i];
    }, 600);

    // Minimum 1.1s display
    setTimeout(() => {
      clearInterval(cycle);
      label.textContent = 'ready';

      screen.classList.add('fade-out');
      setTimeout(() => {
        screen.style.display = 'none';
        showProjects();
      }, 380);
    }, 1100);
  }

  /* ── SHOW PROJECTS ── */
  function showProjects() {
    document.getElementById('projects-shell').classList.remove('hidden');
    ProjectsView.init();
    announce('Projects loaded');
  }

  /* ── GLOBAL KEYBOARD SHORTCUTS ── */
  function bindGlobalKeys() {
    document.addEventListener('keydown', (e) => {
      // Esc: close modals / menus
      if (e.key === 'Escape') {
        Modal.close();
        ContextMenu.hide();
      }
      // ⌘N: new project (projects view only)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        if (!document.getElementById('projects-shell').classList.contains('hidden')) {
          e.preventDefault();
          ProjectsView.showCreateModal();
        }
      }
    });
  }

  /* ── NAV ACCESSIBILITY ── */
  function bindNavKeyboard() {
    document.querySelectorAll('.nav-item[role="button"]').forEach(item => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  /* ── VIEW TOGGLE ── */
  function bindViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });
  }

  /* ── CONSOLE HEADER KEYBOARD ── */
  function bindConsoleKey() {
    const hdr = document.querySelector('.console-header');
    if (hdr) {
      hdr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); RoomView.toggleConsole(); }
      });
    }
  }

  /* ── INIT ── */
  function init() {
    injectGhosts();
    bindGlobalKeys();
    bindNavKeyboard();
    bindViewToggle();
    bindConsoleKey();
    bootLoader();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
