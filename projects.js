/* ═══════════════════════════════════════════════════════
   SwiftRoom — Projects View
   Rendering, search, create, delete, navigate
   ═══════════════════════════════════════════════════════ */

const ProjectsView = (() => {

  /* ── DOM refs ── */
  let grid, searchInput, sectionSub;

  function init() {
    grid        = document.getElementById('proj-grid');
    searchInput = document.getElementById('proj-search');
    sectionSub  = document.getElementById('section-sub');

    searchInput.addEventListener('input', debounce(() => {
      AppState.searchQuery = searchInput.value.trim();
      render();
    }, 160));

    document.getElementById('btn-new-project').addEventListener('click', () => showCreateModal());
    document.getElementById('btn-join-room').addEventListener('click',  () => showJoinModal());

    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    render();
  }

  /* ── RENDER GRID ── */
  function render() {
    const projects = AppState.getFilteredProjects();
    sectionSub.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''} · last active 2 min ago`;
    grid.innerHTML = '';

    if (projects.length === 0) {
      renderEmpty();
      return;
    }

    projects.forEach((p, i) => {
      const card = buildCard(p);
      card.style.animationDelay = `${i * 40}ms`;
      grid.appendChild(card);
    });
  }

  /* ── BUILD CARD ── */
  function buildCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;

    const avatarsHTML = project.collaborators.slice(0, 3).map(c =>
      `<div class="avatar tippy" style="background:${c.color}" data-tip="${c.name}" title="${c.name}">${c.initial}</div>`
    ).join('');

    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon" style="background:${project.accent}1a;border:1px solid ${project.accent}33">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M3.5 8.5h7M12 5.5l3 3-3 3" stroke="${project.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-actions">
          <button class="icon-btn tippy card-star ${project.starred ? 'starred' : ''}" data-tip="Star" aria-label="Star project">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5L8 5H12L9 7.5l1.2 3.5L6.5 9 3.3 11 4.5 7.5 1.5 5H5.5z" stroke="${project.starred ? '#f59e0b' : 'currentColor'}" stroke-width="1.2" stroke-linejoin="round" fill="${project.starred ? '#f59e0b' : 'none'}"/>
            </svg>
          </button>
          <button class="icon-btn tippy card-menu-btn" data-tip="More" aria-label="More options">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="3"   r="1" fill="currentColor"/>
              <circle cx="6.5" cy="6.5" r="1" fill="currentColor"/>
              <circle cx="6.5" cy="10"  r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-name">${escapeHTML(project.name)}</div>
      <div class="card-meta">${escapeHTML(project.description)}</div>
      <div class="card-footer">
        <span class="card-time">${project.time}</span>
        <div class="card-right">
          ${project.collaborators.length ? `<div class="card-avatars">${avatarsHTML}</div>` : ''}
          <span class="badge" style="background:${project.tag.bg};color:${project.tag.color}">${project.tag.label}</span>
        </div>
      </div>
    `;

    // Click → open
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-actions')) return;
      openProject(project);
    });

    // Star button
    card.querySelector('.card-star').addEventListener('click', (e) => {
      e.stopPropagation();
      project.starred = !project.starred;
      Toast.ok(project.starred ? `Starred "${project.name}"` : `Unstarred "${project.name}"`);
      render();
    });

    // Menu button
    card.querySelector('.card-menu-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      showCardMenu(project, rect.right, rect.bottom + 4);
    });

    // Right-click context menu
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showCardMenu(project, e.clientX, e.clientY);
    });

    return card;
  }

  /* ── CARD CONTEXT MENU ── */
  function showCardMenu(project, x, y) {
    ContextMenu.show(x, y, [
      {
        label: 'Open',
        icon: '<path d="M2 6.5h8M7 3.5l3.5 3-3.5 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
        action: () => openProject(project),
      },
      {
        label: 'Rename',
        icon: '<path d="M2 10.5h9M7.5 2.5l3 3-6 6H1.5v-3l6-6z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>',
        action: () => renameProject(project),
      },
      {
        label: project.starred ? 'Unstar' : 'Star',
        icon: '<path d="M6.5 1.5L8 5H12L9 7.5l1.2 3.5L6.5 9 3.3 11 4.5 7.5 1.5 5H5.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>',
        action: () => { project.starred = !project.starred; render(); },
      },
      'divider',
      {
        label: 'Duplicate',
        icon: '<rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M2 2h7v2H2z M2 2v7h2V2z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
        action: () => duplicateProject(project),
      },
      'divider',
      {
        label: 'Delete',
        icon: '<path d="M2 3.5h9M4.5 3.5V2.5h4v1M5 5.5v4M8 5.5v4M3.5 3.5l.5 7h6l.5-7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>',
        danger: true,
        action: () => deleteProject(project),
      },
    ]);
  }

  /* ── EMPTY STATE ── */
  function renderEmpty() {
    const el = document.createElement('div');
    el.className = 'empty-state';
    el.innerHTML = `
      <div class="empty-ghost">
        ${GHOST_SVG(56)}
      </div>
      <div class="empty-title">No projects found</div>
      <div class="empty-sub">
        ${AppState.searchQuery
          ? `Nothing matches "${escapeHTML(AppState.searchQuery)}" — try a different search`
          : 'Create your first project to start experimenting with Swift'}
      </div>
      ${!AppState.searchQuery
        ? `<button class="btn btn-primary" onclick="ProjectsView.showCreateModal()">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>
             New project
           </button>`
        : ''}
    `;
    grid.appendChild(el);
  }

  /* ── OPEN PROJECT ── */
  function openProject(project) {
    AppState.currentProject = project;
    withTransition(() => {
      document.getElementById('projects-shell').classList.add('hidden');
      RoomView.open(project);
    });
  }

  /* ── CREATE MODAL ── */
  function showCreateModal() {
    const templates = [
      { name: 'Blank',          icon: '◻', files: ['ContentView.swift'] },
      { name: 'List App',       icon: '☰', files: ['ContentView.swift', 'Models.swift'] },
      { name: 'Tab Bar',        icon: '⊞', files: ['ContentView.swift', 'TabBar.swift', 'Models.swift'] },
      { name: 'Settings Panel', icon: '⚙', files: ['SettingsView.swift', 'Models.swift'] },
    ];

    const body = `
      <div class="modal-label">Project name</div>
      <input class="input" id="modal-proj-name" type="text" placeholder="e.g. ProfileCard" autocomplete="off">
      <div class="modal-label" style="margin-top:18px">Start from</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
        ${templates.map((t, i) => `
          <label style="display:flex;align-items:center;gap:9px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;cursor:pointer;transition:all 0.12s" class="template-opt">
            <input type="radio" name="template" value="${i}" ${i === 0 ? 'checked' : ''} style="accent-color:var(--violet)">
            <span style="font-size:15px">${t.icon}</span>
            <span style="font-size:13px;font-weight:500;color:var(--text)">${t.name}</span>
          </label>
        `).join('')}
      </div>
    `;

    Modal.show({
      title: 'New project',
      subtitle: 'Give your Swift playground a name and choose a starting template.',
      body,
      actions: [
        { label: 'Cancel',  action: 'cancel',  style: 'ghost' },
        { label: 'Create',  action: 'create',  style: 'primary' },
      ],
      onClose(action, modal) {
        if (action !== 'create') return;
        const name = modal.querySelector('#modal-proj-name').value.trim();
        if (!name) { Toast.warn('Enter a project name'); return; }
        const tidx = modal.querySelector('[name="template"]:checked')?.value || 0;
        const tpl = templates[parseInt(tidx)];
        const accents = ['#7c3aed','#10b981','#ec4899','#f59e0b','#3b82f6','#f43f5e','#14b8a6'];
        const acc = accents[Math.floor(Math.random() * accents.length)];
        const p = {
          id: `p-${Date.now()}`,
          name,
          description: `${tpl.name} · Swift`,
          language: 'Swift',
          time: 'Just now',
          timeRaw: Date.now(),
          collaborators: [],
          accent: acc,
          tag: { label: 'draft', bg: '#2a0c14', color: '#f43f5e' },
          starred: false,
          files: tpl.files,
        };
        AppState.addProject(p);
        render();
        Toast.ok(`"${name}" created`);
        setTimeout(() => openProject(p), 120);
      },
    });
  }

  /* ── JOIN ROOM MODAL ── */
  function showJoinModal() {
    const body = `
      <div class="modal-label">Room ID</div>
      <input class="input" id="modal-room-id" type="text" placeholder="e.g. room-7f3a" autocomplete="off" style="font-family:var(--font-mono)">
      <div style="margin-top:10px;font-size:12px;color:var(--text3)">Get the room ID from a collaborator who already has a project open.</div>
    `;
    Modal.show({
      title: 'Join a room',
      subtitle: 'Enter a room ID to join an existing session.',
      body,
      actions: [
        { label: 'Cancel', action: 'cancel', style: 'ghost' },
        { label: 'Join',   action: 'join',   style: 'primary' },
      ],
      onClose(action, modal) {
        if (action !== 'join') return;
        const rid = modal.querySelector('#modal-room-id').value.trim();
        if (!rid) { Toast.warn('Enter a room ID'); return; }
        const p = {
          id: `p-join-${Date.now()}`,
          name: 'Shared Room',
          description: `Joined via ${rid}`,
          time: 'Now',
          timeRaw: Date.now(),
          collaborators: [
            { initial: '?', name: 'Someone', color: '#7c3aed', status: 'online' },
          ],
          accent: '#7c3aed',
          tag: { label: 'collab', bg: '#1e1535', color: '#a78bfa' },
          starred: false,
          files: ['ContentView.swift'],
        };
        Toast.info(`Joining ${rid}...`);
        setTimeout(() => openProject(p), 300);
      },
    });
  }

  /* ── RENAME ── */
  function renameProject(project) {
    const body = `
      <div class="modal-label">Project name</div>
      <input class="input" id="modal-rename" type="text" value="${escapeHTML(project.name)}" autocomplete="off">
    `;
    Modal.show({
      title: 'Rename project',
      body,
      actions: [
        { label: 'Cancel', action: 'cancel', style: 'ghost' },
        { label: 'Rename', action: 'rename',  style: 'primary' },
      ],
      onClose(action, modal) {
        if (action !== 'rename') return;
        const newName = modal.querySelector('#modal-rename').value.trim();
        if (!newName) return;
        project.name = newName;
        Toast.ok('Project renamed');
        render();
      },
    });
  }

  /* ── DUPLICATE ── */
  function duplicateProject(project) {
    const copy = {
      ...project,
      id: `p-${Date.now()}`,
      name: `${project.name} copy`,
      time: 'Just now',
      timeRaw: Date.now(),
      collaborators: [],
      tag: { label: 'draft', bg: '#2a0c14', color: '#f43f5e' },
    };
    AppState.addProject(copy);
    Toast.ok(`"${copy.name}" created`);
    render();
  }

  /* ── DELETE ── */
  function deleteProject(project) {
    Modal.show({
      title: 'Delete project',
      subtitle: `"${project.name}" will be permanently deleted. This cannot be undone.`,
      actions: [
        { label: 'Cancel', action: 'cancel', style: 'ghost' },
        { label: 'Delete', action: 'delete', style: 'danger' },
      ],
      onClose(action) {
        if (action !== 'delete') return;
        AppState.removeProject(project.id);
        Toast.ok(`"${project.name}" deleted`);
        render();
      },
    });
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Public
  return { init, render, showCreateModal, showJoinModal, openProject };
})();
