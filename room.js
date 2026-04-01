/* ═══════════════════════════════════════════════════════
   SwiftRoom — Room View
   Editor, run pipeline, console, preview, collab cursors
   ═══════════════════════════════════════════════════════ */

const RoomView = (() => {

  /* ── State ── */
  let project = null;
  let currentFile = 'ContentView.swift';
  let consoleOpen = false;
  let buildState = 'idle';
  let consoleLogs = [];
  let buildTimer = null;
  let collabCursorInterval = null;

  /* ── DOM refs ── */
  const $ = id => document.getElementById(id);

  /* ── OPEN ── */
  function open(p) {
    project = p;
    currentFile = p.files?.[0] || 'ContentView.swift';
    buildState = 'idle';
    consoleOpen = false;
    consoleLogs = [];

    const shell = $('room-shell');
    shell.classList.remove('hidden');

    renderTopbar();
    renderFileSidebar();
    renderTabs();
    renderCode();
    updateLineNumbers();
    renderPresence();
    resetConsole();
    resetPreview();

    // Keyboard shortcut
    document.addEventListener('keydown', handleGlobalKey);

    // Start fake collab cursor
    startCollabCursors();
  }

  /* ── CLOSE ── */
  function close() {
    clearTimeout(buildTimer);
    clearInterval(collabCursorInterval);
    document.removeEventListener('keydown', handleGlobalKey);

    const shell = $('room-shell');
    shell.classList.add('hidden');

    withTransition(() => {
      $('projects-shell').classList.remove('hidden');
      ProjectsView.render();
    });
  }

  /* ── TOPBAR ── */
  function renderTopbar() {
    const nameEl = $('room-name');
    nameEl.textContent = project.name;

    const idEl = $('room-id-chip');
    idEl.textContent = randomId('room');

    idEl.onclick = () => {
      copyToClipboard(idEl.textContent);
      idEl.textContent = 'copied!';
      idEl.classList.add('copied');
      setTimeout(() => {
        idEl.textContent = randomId('room');
        idEl.classList.remove('copied');
      }, 1400);
    };
  }

  /* ── PRESENCE ── */
  function renderPresence() {
    const stack = $('presence-stack');
    stack.innerHTML = '';
    const users = [
      { initial: 'E', name: 'You (Ethan)', color: '#7c3aed', status: 'online' },
      ...(project.collaborators || []),
    ];
    users.slice(0, 4).forEach(u => {
      const av = document.createElement('div');
      av.className = 'avatar tippy';
      av.style.background = u.color;
      av.setAttribute('data-tip', u.name);
      av.setAttribute('title', u.name);
      av.innerHTML = `${u.initial}<span class="avatar-dot ${u.status}"></span>`;
      stack.appendChild(av);
    });
  }

  /* ── FILE SIDEBAR ── */
  function renderFileSidebar() {
    const list = $('file-list');
    list.innerHTML = '';
    const files = project.files || ['ContentView.swift'];

    files.forEach(fname => {
      const item = document.createElement('div');
      const isActive = fname === currentFile;
      const isModified = Math.random() > 0.6; // Simulated
      item.className = `file-item${isActive ? ' active' : ''}${isModified ? ' modified' : ''}`;
      item.innerHTML = `
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
          <path d="M1 1h6.5l2.5 2.5V12H1V1z" stroke="currentColor" stroke-width="0.9"/>
        </svg>
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${fname}</span>
        <span class="file-modified-dot"></span>
      `;
      item.addEventListener('click', () => switchFile(fname));
      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showFileMenu(fname, e.clientX, e.clientY);
      });
      list.appendChild(item);
    });

    // Add file button
    $('file-add-btn').onclick = () => {
      const names = ['Utils.swift', 'Extensions.swift', 'Router.swift', 'Store.swift', 'Animations.swift'];
      const existing = project.files || [];
      const available = names.filter(n => !existing.includes(n));
      if (!available.length) { Toast.info('No more templates available'); return; }
      const newFile = available[0];
      project.files.push(newFile);
      Toast.ok(`Added ${newFile}`);
      renderFileSidebar();
      switchFile(newFile);
    };
  }

  function showFileMenu(fname, x, y) {
    ContextMenu.show(x, y, [
      { label: 'Set as active', action: () => switchFile(fname) },
      { label: 'Copy filename', action: () => { copyToClipboard(fname); Toast.ok('Copied'); } },
      'divider',
      {
        label: 'Remove file',
        danger: true,
        action: () => {
          if (project.files.length <= 1) { Toast.warn("Can't remove the only file"); return; }
          project.files = project.files.filter(f => f !== fname);
          if (currentFile === fname) currentFile = project.files[0];
          renderFileSidebar();
          renderTabs();
          renderCode();
          Toast.ok(`Removed ${fname}`);
        },
      },
    ]);
  }

  /* ── TABS ── */
  function renderTabs() {
    const bar = $('tabs-bar');
    bar.innerHTML = '';
    const files = project.files || ['ContentView.swift'];

    files.forEach(fname => {
      const tab = document.createElement('div');
      const isActive = fname === currentFile;
      const isModified = fname === currentFile; // Active tab shows unsaved
      tab.className = `tab${isActive ? ' active' : ''}`;
      tab.innerHTML = `
        ${isModified ? '<span class="tab-unsaved"></span>' : ''}
        ${fname}
        <span class="tab-close" role="button" aria-label="Close tab">×</span>
      `;
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) {
          if (files.length <= 1) { Toast.warn("Can't close the only tab"); return; }
          project.files = files.filter(f => f !== fname);
          if (currentFile === fname) currentFile = project.files[0];
          renderFileSidebar();
          renderTabs();
          renderCode();
        } else {
          switchFile(fname);
        }
      });
      bar.appendChild(tab);
    });

    const newTab = document.createElement('div');
    newTab.className = 'tab-new';
    newTab.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
    newTab.title = 'New file';
    newTab.addEventListener('click', () => $('file-add-btn').click());
    bar.appendChild(newTab);
  }

  /* ── SWITCH FILE ── */
  function switchFile(fname) {
    currentFile = fname;
    renderFileSidebar();
    renderTabs();
    renderCode();
    updateLineNumbers();
  }

  /* ── CODE ── */
  function renderCode() {
    const el = $('code-input');
    const sample = CODE_SAMPLES[currentFile] || CODE_SAMPLES['ContentView.swift'];
    el.innerHTML = sample;
    updateLineNumbers();
  }

  function updateLineNumbers() {
    const el = $('code-input');
    const text = el.innerText || '';
    const lines = text.split('\n').length;
    const nums = $('line-numbers');
    nums.innerHTML = Array.from({ length: Math.max(lines, 30) }, (_, i) =>
      `<span>${i + 1}</span>`
    ).join('');
  }

  /* ── RUN ── */
  function run() {
    if (buildState === 'building') return;
    buildState = 'building';

    // UI: button state
    const btn = $('run-btn');
    btn.classList.add('running');
    btn.querySelector('.run-btn-text').textContent = 'Running';

    // Clear old logs
    consoleLogs = [];
    $('console-body').innerHTML = '';
    setBadge('building', 'building...');

    // Expand console
    if (!consoleOpen) toggleConsole();

    // Simulate build pipeline
    const file = currentFile;
    const buildTime = 200 + Math.floor(Math.random() * 400);

    logLine('info', `Compiling ${file}...`);
    buildTimer = setTimeout(() => {
      logLine('info', 'Resolving package graph...');
      setTimeout(() => {
        logLine('info', 'Linking SwiftUI.framework...');
        setTimeout(() => {
          logLine('ok', `Build succeeded — 0 errors, 0 warnings`);
          logLine('ok', `Preview ready in ${buildTime}ms`);
          buildState = 'success';

          // Update badge
          setBadge('ok', `${consoleLogs.length} msgs`);

          // Show preview
          showPreview();

          // Confetti + toast
          spawnConfetti($('code-panel'));
          Toast.ok('Build passed');
          announce('Build succeeded');

          // Reset button
          btn.classList.remove('running');
          btn.querySelector('.run-btn-text').textContent = 'Run';

          // Success flash on preview
          const flash = document.createElement('div');
          flash.className = 'build-flash';
          $('preview-content').appendChild(flash);
          setTimeout(() => flash.remove(), 700);

        }, buildTime);
      }, 180);
    }, 220);
  }

  /* ── PREVIEW ── */
  function showPreview() {
    const content = $('preview-content');
    content.style.opacity = '0';
    content.style.transition = 'opacity 0.18s ease';

    setTimeout(() => {
      content.innerHTML = `
        <div class="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="ios-navbar">
              <div class="ios-navbar-title">${project.name}</div>
            </div>
            <div class="ios-list">
              ${PREVIEW_ITEMS.map(item => `
                <div class="ios-row">
                  <div class="ios-row-icon" style="background:${item.color}20;color:${item.color}">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="2" width="10" height="10" rx="3" fill="${item.color}"/>
                    </svg>
                  </div>
                  <div>
                    <div class="ios-row-title">${item.title}</div>
                    <div class="ios-row-sub">${item.sub}</div>
                  </div>
                  <div class="ios-row-chev">›</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      content.style.opacity = '1';
    }, 190);
  }

  function resetPreview() {
    $('preview-content').innerHTML = `
      <div class="preview-placeholder">
        <div class="placeholder-ghost">${GHOST_SVG(56)}</div>
        <div class="placeholder-hint">Hit Run to preview</div>
      </div>
    `;
  }

  /* ── CONSOLE ── */
  function logLine(type, msg) {
    consoleLogs.push({ type, msg });
    const ts = new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const prefixes = { ok: '✓', err: '✕', warn: '!', info: ' ' };
    const body = $('console-body');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = `
      <span class="console-ts">${ts}</span>
      <span class="console-prefix">${prefixes[type] || ' '}</span>
      <span>${msg}</span>
    `;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
    setBadge(type === 'err' ? 'err' : consoleLogs.some(l => l.type === 'ok') ? 'ok' : 'building', `${consoleLogs.length} msgs`);
  }

  function setBadge(cls, label) {
    const badge = $('console-badge');
    badge.className = `console-badge ${cls}`;
    badge.textContent = label;
  }

  function resetConsole() {
    consoleLogs = [];
    $('console-body').innerHTML = '';
    setBadge('idle', 'ready');
    const panel = $('console-panel');
    panel.classList.remove('expanded');
    panel.classList.add('collapsed');
    consoleOpen = false;
  }

  function toggleConsole() {
    const panel = $('console-panel');
    consoleOpen = !consoleOpen;
    panel.classList.toggle('collapsed', !consoleOpen);
    panel.classList.toggle('expanded', consoleOpen);
  }

  /* ── COLLAB CURSORS (simulated) ── */
  function startCollabCursors() {
    if (!project.collaborators?.length) return;
    const editor = $('code-input');
    let step = 0;

    const positions = [
      { top: '4.2rem',  left: '7rem',  color: '#ec4899', name: 'Sara', label: 'sara' },
      { top: '9.6rem',  left: '11rem', color: '#7c3aed', name: 'Alex', label: 'alex' },
    ];

    collabCursorInterval = setInterval(() => {
      // Remove old cursors
      $('code-editor-wrap').querySelectorAll('.collab-cursor').forEach(c => c.remove());

      if (step % 4 !== 0) { // Don't always show
        const collab = project.collaborators.slice(0, positions.length);
        collab.forEach((u, i) => {
          const pos = positions[i];
          const cursor = document.createElement('div');
          cursor.className = 'collab-cursor';
          cursor.style.cssText = `top:${pos.top};left:calc(48px + ${pos.left})`;
          cursor.innerHTML = `
            <div class="cursor-caret" style="background:${pos.color}"></div>
            <div class="cursor-label" style="background:${pos.color}">${u.name || pos.name}</div>
          `;
          $('code-editor-wrap').appendChild(cursor);
        });
      }
      step++;
    }, 3000);
  }

  /* ── KEYBOARD SHORTCUTS ── */
  function handleGlobalKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
      e.preventDefault();
      run();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '`') {
      e.preventDefault();
      toggleConsole();
    }
    if (e.key === 'Escape') {
      Modal.close();
      ContextMenu.hide();
    }
  }

  /* ── CODE INPUT ── */
  function handleCodeKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
    setTimeout(updateLineNumbers, 10);
  }

  // Public API
  return {
    open,
    close,
    run,
    toggleConsole,
    handleCodeKey,
    updateLineNumbers,
  };
})();
