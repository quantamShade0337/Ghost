# SwiftRoom

A collaborative Swift playground — dark, fast, fun.  
No backend, no build step. Pure HTML/CSS/JS.

## Stack

- Vanilla JS (ES6+ modules pattern, no bundler)
- Space Grotesk + JetBrains Mono (Google Fonts)
- Zero dependencies

## Structure

```
swiftroom/
├── index.html          ← App shell, DOM structure
├── css/
│   ├── design-system.css  ← Tokens, reset, base, animations
│   ├── components.css     ← Loading, sidebar, cards, modals, toasts
│   └── room.css           ← Editor, topbar, console, preview
├── js/
│   ├── state.js        ← AppState, project data, code samples
│   ├── utils.js        ← Toast, Modal, ContextMenu, confetti, helpers
│   ├── projects.js     ← Projects view — render, create, delete, search
│   ├── room.js         ← Room view — editor, run, console, preview
│   └── main.js         ← Bootstrap, keyboard shortcuts, init
└── README.md
```

## Running

Open `index.html` in any modern browser. No server needed — all paths are relative.

For live reload during development:

```bash
npx serve .
# or
python3 -m http.server 3000
```

## Key interactions

| Action            | Trigger                         |
|-------------------|---------------------------------|
| New project       | Click "New project" or ⌘N       |
| Open project      | Click any project card          |
| Run               | Click Run button or ⌘R          |
| Toggle console    | Click console header or ⌘`      |
| Copy room ID      | Click the room ID chip          |
| Add file          | Click + in file sidebar         |
| Rename project    | Right-click card → Rename       |
| Delete project    | Right-click card → Delete       |
| Search            | Type in search bar              |

## Design system

### Colours
- Base: `#0c0b12` bg, `#13111c` surface
- Brand: `#7c3aed` violet, `#a78bfa` violet-light
- Accents: `#ec4899` pink · `#10b981` green · `#f59e0b` yellow · `#f43f5e` red · `#3b82f6` blue

### Typography
- UI: Space Grotesk 400/500/600/700
- Code: JetBrains Mono 400/500

### Components
- **Toast** — `Toast.ok/err/warn/info(message)`
- **Modal** — `Modal.show({ title, subtitle, body, actions, onClose })`
- **ContextMenu** — `ContextMenu.show(x, y, items)`
- **Confetti** — `spawnConfetti(containerEl, count)`
- **Ghost** — `GHOST_SVG(size, bodyColor, eyeColor)` → SVG string

## What's not included (intentional)

- Backend / WebSocket collab (collab cursors are simulated)
- Swift compilation (preview is a mock)
- Auth / persistence (state resets on refresh)
- File upload / export
- Mobile layout (desktop-first tool)

## Extending

To add real backend collaboration:
1. Replace the `collabCursorInterval` in `room.js` with a WebSocket client
2. Broadcast `code-input` changes via `Y.js` or `ShareDB`
3. Replace the `run()` simulation with a POST to a Swift build server

To persist projects:
1. Add `localStorage` read/write in `state.js` around `AppState.projects`
2. Debounce saves in `ProjectsView.render()`
