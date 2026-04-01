/* ═══════════════════════════════════════════════════════
   SwiftRoom — App State & Data
   ═══════════════════════════════════════════════════════ */

const GHOST_SVG = (size = 52, colorBody = '#f0eeff', colorEye = '#0f0e14') => `
<svg width="${size}" height="${Math.round(size * 1.23)}" viewBox="0 0 52 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
  <path fill="${colorBody}" d="M26 4C14 4 6 13 6 24V56C6 58 8 60 10 58L14 54L18 58C19.5 60 22.5 60 24 58L26 56L28 58C29.5 60 32.5 60 34 58L38 54L42 58C44 60 46 58 46 56V24C46 13 38 4 26 4Z"/>
  <ellipse fill="${colorEye}" cx="20" cy="26" rx="4.5" ry="5"/>
  <ellipse fill="${colorEye}" cx="32" cy="26" rx="4.5" ry="5"/>
  <ellipse fill="white" opacity="0.75" cx="21.5" cy="24.5" rx="1.5" ry="1.5"/>
  <ellipse fill="white" opacity="0.75" cx="33.5" cy="24.5" rx="1.5" ry="1.5"/>
  <ellipse fill="#ec4899" opacity="0.38" cx="15" cy="31" rx="4" ry="2.5"/>
  <ellipse fill="#ec4899" opacity="0.38" cx="37" cy="31" rx="4" ry="2.5"/>
</svg>`;

/* ── PROJECTS DATA ── */
const PROJECTS_DATA = [
  {
    id: 'p-content',
    name: 'ContentView',
    description: 'Main app navigation shell',
    language: 'Swift',
    time: '2 min ago',
    timeRaw: Date.now() - 2 * 60 * 1000,
    collaborators: [
      { initial: 'A', name: 'Alex Kim',  color: '#7c3aed', status: 'online' },
      { initial: 'S', name: 'Sara Park', color: '#ec4899', status: 'away' },
    ],
    accent: '#7c3aed',
    tag: { label: 'active', bg: '#1e1535', color: '#a78bfa' },
    starred: true,
    files: ['ContentView.swift', 'Models.swift', 'Theme.swift'],
  },
  {
    id: 'p-onboard',
    name: 'OnboardingFlow',
    description: 'Welcome & permission screens',
    language: 'Swift',
    time: '1 hour ago',
    timeRaw: Date.now() - 60 * 60 * 1000,
    collaborators: [],
    accent: '#10b981',
    tag: { label: 'solo', bg: '#0a2018', color: '#10b981' },
    starred: false,
    files: ['OnboardingView.swift', 'WelcomeScreen.swift', 'Permissions.swift'],
  },
  {
    id: 'p-settings',
    name: 'SettingsUI',
    description: 'Preferences & account panel',
    language: 'Swift',
    time: 'Yesterday',
    timeRaw: Date.now() - 26 * 60 * 60 * 1000,
    collaborators: [
      { initial: 'A', name: 'Alex Kim',  color: '#7c3aed', status: 'online' },
      { initial: 'S', name: 'Sara Park', color: '#ec4899', status: 'online' },
      { initial: 'R', name: 'Reza M.',   color: '#3b82f6', status: 'offline' },
    ],
    accent: '#f59e0b',
    tag: { label: 'collab', bg: '#261a06', color: '#f59e0b' },
    starred: true,
    files: ['SettingsView.swift', 'ProfileSection.swift', 'NotificationsSection.swift'],
  },
  {
    id: 'p-profile',
    name: 'ProfileCard',
    description: 'User profile display component',
    language: 'Swift',
    time: '2 days ago',
    timeRaw: Date.now() - 2 * 24 * 60 * 60 * 1000,
    collaborators: [],
    accent: '#f43f5e',
    tag: { label: 'draft', bg: '#2a0c14', color: '#f43f5e' },
    starred: false,
    files: ['ProfileCard.swift', 'AvatarView.swift'],
  },
  {
    id: 'p-tabbar',
    name: 'TabBar Exp',
    description: 'Custom tab bar experiment',
    language: 'Swift',
    time: 'Last week',
    timeRaw: Date.now() - 7 * 24 * 60 * 60 * 1000,
    collaborators: [
      { initial: 'S', name: 'Sara Park', color: '#ec4899', status: 'offline' },
    ],
    accent: '#3b82f6',
    tag: { label: 'solo', bg: '#0d1e3d', color: '#60a5fa' },
    starred: false,
    files: ['CustomTabBar.swift', 'TabItem.swift', 'AnimatedIndicator.swift'],
  },
];

/* ── SWIFT CODE SAMPLES ── */
const CODE_SAMPLES = {
  'ContentView.swift': `<span class="tok-kw">import</span> SwiftUI

<span class="tok-kw">struct</span> <span class="tok-type">ContentView</span>: <span class="tok-type">View</span> {
    <span class="tok-prop">@State</span> <span class="tok-kw">private var</span> items: [<span class="tok-type">Item</span>] = <span class="tok-type">Item</span>.sampleData
    <span class="tok-prop">@State</span> <span class="tok-kw">private var</span> selectedItem: <span class="tok-type">Item</span>?
    <span class="tok-prop">@State</span> <span class="tok-kw">private var</span> showingDetail = <span class="tok-bool">false</span>

    <span class="tok-kw">var</span> body: <span class="tok-kw">some</span> <span class="tok-type">View</span> {
        <span class="tok-type">NavigationStack</span> {
            <span class="tok-type">List</span>(items) { item <span class="tok-kw">in</span>
                <span class="tok-type">ItemRow</span>(item: item)
                    .onTapGesture {
                        selectedItem = item
                        showingDetail = <span class="tok-bool">true</span>
                    }
            }
            .navigationTitle(<span class="tok-str">"My App"</span>)
            .navigationBarTitleDisplayMode(<span class="tok-op">.large</span>)
            .toolbar {
                <span class="tok-type">ToolbarItem</span>(placement: <span class="tok-op">.topBarTrailing</span>) {
                    <span class="tok-type">Button</span>(<span class="tok-str">"Add"</span>, systemImage: <span class="tok-str">"plus"</span>) {
                        <span class="tok-cmt">// Add new item</span>
                    }
                }
            }
        }
        .sheet(isPresented: <span class="tok-op">$showingDetail</span>) {
            <span class="tok-kw">if</span> <span class="tok-kw">let</span> item = selectedItem {
                <span class="tok-type">DetailView</span>(item: item)
            }
        }
    }
}

<span class="tok-cmt">// MARK: - Item Row</span>
<span class="tok-kw">struct</span> <span class="tok-type">ItemRow</span>: <span class="tok-type">View</span> {
    <span class="tok-kw">let</span> item: <span class="tok-type">Item</span>

    <span class="tok-kw">var</span> body: <span class="tok-kw">some</span> <span class="tok-type">View</span> {
        <span class="tok-type">HStack</span>(spacing: <span class="tok-num">14</span>) {
            <span class="tok-type">RoundedRectangle</span>(cornerRadius: <span class="tok-num">9</span>)
                .fill(item.color.gradient)
                .frame(width: <span class="tok-num">32</span>, height: <span class="tok-num">32</span>)
                .overlay {
                    <span class="tok-type">Image</span>(systemName: item.icon)
                        .foregroundStyle(<span class="tok-op">.white</span>)
                        .font(<span class="tok-op">.system</span>(size: <span class="tok-num">14</span>, weight: <span class="tok-op">.semibold</span>))
                }
            <span class="tok-type">VStack</span>(alignment: <span class="tok-op">.leading</span>, spacing: <span class="tok-num">2</span>) {
                <span class="tok-type">Text</span>(item.title)
                    .fontWeight(<span class="tok-op">.medium</span>)
                <span class="tok-type">Text</span>(item.subtitle)
                    .font(<span class="tok-op">.caption</span>)
                    .foregroundStyle(<span class="tok-op">.secondary</span>)
            }
            <span class="tok-type">Spacer</span>()
        }
        .padding(<span class="tok-op">.vertical</span>, <span class="tok-num">4</span>)
    }
}

<span class="tok-cmt">// MARK: - Preview</span>
<span class="tok-prop">#Preview</span> {
    <span class="tok-type">ContentView</span>()
}`,

  'Models.swift': `<span class="tok-kw">import</span> SwiftUI

<span class="tok-kw">struct</span> <span class="tok-type">Item</span>: <span class="tok-type">Identifiable</span>, <span class="tok-type">Hashable</span> {
    <span class="tok-kw">let</span> id: <span class="tok-type">UUID</span>
    <span class="tok-kw">var</span> title:    <span class="tok-type">String</span>
    <span class="tok-kw">var</span> subtitle: <span class="tok-type">String</span>
    <span class="tok-kw">var</span> icon:     <span class="tok-type">String</span>
    <span class="tok-kw">var</span> color:    <span class="tok-type">Color</span>

    <span class="tok-kw">init</span>(
        title:    <span class="tok-type">String</span>,
        subtitle: <span class="tok-type">String</span>,
        icon:     <span class="tok-type">String</span>,
        color:    <span class="tok-type">Color</span>
    ) {
        self.id       = <span class="tok-type">UUID</span>()
        self.title    = title
        self.subtitle = subtitle
        self.icon     = icon
        self.color    = color
    }
}

<span class="tok-cmt">// MARK: - Sample Data</span>
<span class="tok-kw">extension</span> <span class="tok-type">Item</span> {
    <span class="tok-kw">static let</span> sampleData: [<span class="tok-type">Item</span>] = [
        <span class="tok-type">Item</span>(
            title:    <span class="tok-str">"Dashboard"</span>,
            subtitle: <span class="tok-str">"Overview & metrics"</span>,
            icon:     <span class="tok-str">"chart.bar.fill"</span>,
            color:    <span class="tok-op">.purple</span>
        ),
        <span class="tok-type">Item</span>(
            title:    <span class="tok-str">"Analytics"</span>,
            subtitle: <span class="tok-str">"Detailed insights"</span>,
            icon:     <span class="tok-str">"chart.line.uptrend.xyaxis"</span>,
            color:    <span class="tok-op">.blue</span>
        ),
        <span class="tok-type">Item</span>(
            title:    <span class="tok-str">"Profile"</span>,
            subtitle: <span class="tok-str">"Your account"</span>,
            icon:     <span class="tok-str">"person.fill"</span>,
            color:    <span class="tok-op">.pink</span>
        ),
        <span class="tok-type">Item</span>(
            title:    <span class="tok-str">"Settings"</span>,
            subtitle: <span class="tok-str">"Preferences"</span>,
            icon:     <span class="tok-str">"gearshape.fill"</span>,
            color:    <span class="tok-op">.orange</span>
        ),
    ]
}`,

  'Theme.swift': `<span class="tok-kw">import</span> SwiftUI

<span class="tok-kw">extension</span> <span class="tok-type">Color</span> {
    <span class="tok-cmt">// Brand</span>
    <span class="tok-kw">static let</span> brand = <span class="tok-type">Color</span>(<span class="tok-str">"BrandPrimary"</span>)
    <span class="tok-kw">static let</span> brandSecondary = <span class="tok-type">Color</span>(<span class="tok-str">"BrandSecondary"</span>)

    <span class="tok-cmt">// Semantic</span>
    <span class="tok-kw">static let</span> success = <span class="tok-type">Color</span>(<span class="tok-str">"Success"</span>)
    <span class="tok-kw">static let</span> warning = <span class="tok-type">Color</span>(<span class="tok-str">"Warning"</span>)
    <span class="tok-kw">static let</span> error   = <span class="tok-type">Color</span>(<span class="tok-str">"Error"</span>)
}

<span class="tok-kw">enum</span> <span class="tok-type">AppFont</span> {
    <span class="tok-kw">static func</span> <span class="tok-fn">title</span>()    -> <span class="tok-type">Font</span> { .system(size: <span class="tok-num">28</span>, weight: <span class="tok-op">.bold</span>,   design: <span class="tok-op">.rounded</span>) }
    <span class="tok-kw">static func</span> <span class="tok-fn">headline</span>() -> <span class="tok-type">Font</span> { .system(size: <span class="tok-num">17</span>, weight: <span class="tok-op">.semibold</span>             ) }
    <span class="tok-kw">static func</span> <span class="tok-fn">body</span>()     -> <span class="tok-type">Font</span> { .system(size: <span class="tok-num">15</span>, weight: <span class="tok-op">.regular</span>              ) }
    <span class="tok-kw">static func</span> <span class="tok-fn">caption</span>()  -> <span class="tok-type">Font</span> { .system(size: <span class="tok-num">12</span>, weight: <span class="tok-op">.regular</span>              ) }
}`,
};

const CONSOLE_SCRIPTS = {
  start: [
    { type: 'info', msg: 'Compiling {file}...' },
    { type: 'info', msg: 'Resolving package dependencies...' },
    { type: 'info', msg: 'Linking frameworks...' },
  ],
  success: [
    { type: 'ok',   msg: 'Build succeeded — 0 errors, 0 warnings' },
    { type: 'ok',   msg: 'Preview ready in {time}ms' },
  ],
  error: [
    { type: 'err',  msg: 'error: cannot find type \'Item\' in scope' },
    { type: 'err',  msg: 'Build failed — 1 error' },
  ],
};

/* ── PREVIEW CONFIGS ── */
const PREVIEW_ITEMS = [
  { title: 'Dashboard',  sub: 'Overview & metrics',  icon: '◼', color: '#7c3aed' },
  { title: 'Analytics',  sub: 'Detailed insights',    icon: '▲', color: '#3b82f6' },
  { title: 'Profile',    sub: 'Your account',         icon: '●', color: '#ec4899' },
  { title: 'Settings',   sub: 'Preferences',          icon: '⬡', color: '#f59e0b' },
];

/* ── GLOBAL APP STATE ── */
const AppState = {
  currentView: 'projects',  // 'projects' | 'room'
  currentProject: null,
  currentFile: 'ContentView.swift',
  consoleOpen: false,
  consoleLogs: [],
  buildState: 'idle',       // 'idle' | 'building' | 'success' | 'error'
  hasPreview: false,
  searchQuery: '',
  projects: [...PROJECTS_DATA],

  // File modified state per project
  modifiedFiles: {},

  getFilteredProjects() {
    if (!this.searchQuery) return this.projects;
    const q = this.searchQuery.toLowerCase();
    return this.projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  },

  addProject(p) {
    this.projects.unshift(p);
  },

  removeProject(id) {
    this.projects = this.projects.filter(p => p.id !== id);
  },
};

/* Export for module access */
if (typeof module !== 'undefined') {
  module.exports = { AppState, GHOST_SVG, PROJECTS_DATA, CODE_SAMPLES, PREVIEW_ITEMS, CONSOLE_SCRIPTS };
}
