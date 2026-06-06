# Settings Modal + Language Relocation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Settings modal (⚙️) to side-project-tracker with a left-nav + right-panel layout, and move the EN/한국어 language toggle from the dashboard header into the modal's "General" panel.

**Architecture:** A `SettingsModal` (overlay + left nav + right panel) hosts a single `GeneralSettings` panel that switches language via the existing `useLang().setLang`. A gear button in `MoodBar` opens it; `Dashboard` owns the open/close state. The language persistence path (`App.handleSetLang` → `saveSettings`) is unchanged — only the trigger UI moves.

**Tech Stack:** React 19 + TypeScript + Vite (Tauri app), vitest + @testing-library/react (jsdom). Test runner: `npx vitest run`. Typecheck: `npx tsc --noEmit`.

**Working directory:** `/Users/dede/workspace/side-project-tracker`, branch `feat/settings-modal`.

**Reference (read first):** `docs/superpowers/specs/2026-06-06-settings-modal-design.md`

---

## Context the engineer needs

- `src/i18n.tsx` exports `LangProvider`, `useLang()` (returns `{ lang, setLang, t }`), `LANGS` (`['en','ko']`), `LANG_LABEL` (`{en:'EN', ko:'한국어'}`), and `DICTS`. The `Dict` interface already has a `language` key.
- The `LangContext` default (no provider) is **Korean** — components rendered in tests without a `LangProvider` show Korean strings. Tests that need English/working language switching must wrap in a `LangProvider`.
- `useLang().setLang` is wired in `App.tsx` (`handleSetLang`) to update state + persist. In `App` the modal will inherit a real `setLang`. In isolated tests, provide your own.
- Existing CSS tokens used by the new styles are all already defined in `src/styles.css :root`: `--surface`, `--surface-sunken`, `--surface-hover`, `--border`, `--border-strong`, `--radius`, `--radius-sm`, `--shadow-pop`, `--accent`, `--accent-soft`, `--text`, `--text-secondary`, `--text-tertiary`.
- The `.seg` and `.lang-toggle` classes already exist.

---

## Task 1: Add settings i18n strings

**Files:**
- Modify: `src/i18n.tsx`
- Test: `tests/i18n.test.tsx`

- [ ] **Step 1: Write the failing test**

Append this `describe` block to `tests/i18n.test.tsx`:

```tsx
describe('settings strings', () => {
  it('has settingsTitle/settingsGeneral in both languages', () => {
    expect(DICTS.en.settingsTitle).toBe('Settings');
    expect(DICTS.en.settingsGeneral).toBe('General');
    expect(DICTS.ko.settingsTitle).toBe('설정');
    expect(DICTS.ko.settingsGeneral).toBe('일반');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/i18n.test.tsx`
Expected: FAIL — TypeScript error / `settingsTitle` is undefined.

- [ ] **Step 3: Add the keys to the `Dict` interface**

In `src/i18n.tsx`, find:

```tsx
  funLabel: Record<FunType, string>; // 이모지 포함
  // app
```

Replace with:

```tsx
  funLabel: Record<FunType, string>; // 이모지 포함
  // settings
  settingsTitle: string;
  settingsGeneral: string;
  // app
```

- [ ] **Step 4: Add the keys to the `ko` dictionary**

In the `ko` dictionary object, find the `funLabel: { ... }` line (the Korean one ending `'마무리': '🏁 마무리' },`) and add these two lines immediately after it:

```tsx
  settingsTitle: '설정',
  settingsGeneral: '일반',
```

- [ ] **Step 5: Add the keys to the `en` dictionary**

In the `en` dictionary object, find:

```tsx
  funLabel: { '신규창작': '🆕 New', '업그레이드': '⬆️ Upgrade', '실험': '🧪 Experiment', '마무리': '🏁 Wrap-up' },
```

Add these two lines immediately after it:

```tsx
  settingsTitle: 'Settings',
  settingsGeneral: 'General',
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/i18n.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/i18n.tsx tests/i18n.test.tsx
git commit -m "feat(i18n): add settings modal strings (settingsTitle/settingsGeneral)"
```

---

## Task 2: GeneralSettings panel (language toggle)

**Files:**
- Create: `src/ui/GeneralSettings.tsx`
- Test: `tests/ui/settingsModal.test.tsx` (new file, `GeneralSettings` block)

- [ ] **Step 1: Write the failing test**

Create `tests/ui/settingsModal.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../src/i18n';
import { GeneralSettings } from '../../src/ui/GeneralSettings';

describe('GeneralSettings', () => {
  it('renders the language label and EN/한국어 buttons', () => {
    render(
      <LangProvider lang="en" setLang={() => {}}>
        <GeneralSettings />
      </LangProvider>,
    );
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '한국어' })).toBeInTheDocument();
  });

  it('calls setLang when a language button is clicked', () => {
    const setLang = vi.fn();
    render(
      <LangProvider lang="en" setLang={setLang}>
        <GeneralSettings />
      </LangProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '한국어' }));
    expect(setLang).toHaveBeenCalledWith('ko');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/settingsModal.test.tsx`
Expected: FAIL — cannot find module `../../src/ui/GeneralSettings`.

- [ ] **Step 3: Create the component**

Create `src/ui/GeneralSettings.tsx`:

```tsx
import { useLang, LANGS, LANG_LABEL } from '../i18n';

/** The "General" settings panel — currently just the UI language toggle. */
export function GeneralSettings() {
  const { t, lang, setLang } = useLang();

  return (
    <div className="settings-pane">
      <div className="settings-field">
        <span className="settings-field__label">{t.language}</span>
        <span className="lang-toggle">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`seg${lang === l ? ' is-on' : ''}`}
              onClick={() => setLang(l)}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ui/settingsModal.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/ui/GeneralSettings.tsx tests/ui/settingsModal.test.tsx
git commit -m "feat(ui): add GeneralSettings panel with language toggle"
```

---

## Task 3: SettingsModal component + CSS

**Files:**
- Create: `src/ui/SettingsModal.tsx`
- Modify: `src/styles.css`
- Test: `tests/ui/settingsModal.test.tsx` (add `SettingsModal` block)

- [ ] **Step 1: Write the failing test**

Add these imports to the top of `tests/ui/settingsModal.test.tsx` (extend the existing import lines):

```tsx
import { useState } from 'react';
import type { Lang } from '../../src/domain/types';
import { SettingsModal } from '../../src/ui/SettingsModal';
```

Then append this block to `tests/ui/settingsModal.test.tsx`:

```tsx
describe('SettingsModal', () => {
  function renderModal(onClose = () => {}) {
    return render(
      <LangProvider lang="en" setLang={() => {}}>
        <SettingsModal onClose={onClose} />
      </LangProvider>,
    );
  }

  it('renders the overlay, title and General nav item', () => {
    renderModal();
    expect(screen.getByTestId('settings-overlay')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the overlay backdrop is clicked', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByTestId('settings-overlay'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does NOT call onClose when clicking inside the modal', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByText('General'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('switches language live from inside the modal', () => {
    function Harness() {
      const [lang, setLang] = useState<Lang>('en');
      return (
        <LangProvider lang={lang} setLang={setLang}>
          <SettingsModal onClose={() => {}} />
        </LangProvider>
      );
    }
    render(<Harness />);
    expect(screen.getByText('General')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '한국어' }));
    expect(screen.getByText('일반')).toBeInTheDocument(); // General -> 일반
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByText('General')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/settingsModal.test.tsx`
Expected: FAIL — cannot find module `../../src/ui/SettingsModal`.

- [ ] **Step 3: Create the component**

Create `src/ui/SettingsModal.tsx`:

```tsx
import { ComponentType, useEffect, useState } from 'react';
import { useLang } from '../i18n';
import { GeneralSettings } from './GeneralSettings';

interface Section {
  id: string;
  name: string;
  icon: string;
  Panel: ComponentType;
}

/** App-wide settings modal: left nav + right panel. Starts with a "General" section. */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const sections: Section[] = [
    { id: 'general', name: t.settingsGeneral, icon: '⚙️', Panel: GeneralSettings },
  ];
  const [active, setActive] = useState('general');
  const current = sections.find((s) => s.id === active) ?? sections[0];
  const Panel = current.Panel;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="settings-overlay" data-testid="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <nav className="settings-nav">
          <div className="settings-nav__title">{t.settingsTitle}</div>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`settings-nav-item${s.id === active ? ' active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="settings-nav-icon" aria-hidden="true">{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </nav>
        <section className="settings-body">
          <Panel />
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ui/settingsModal.test.tsx`
Expected: PASS (all GeneralSettings + SettingsModal tests).

- [ ] **Step 5: Add the modal CSS**

In `src/styles.css`, find this line (the last `.lang-toggle` rule):

```css
.lang-toggle .seg { padding: 3px 8px; font-size: 11px; }
```

Add the following immediately after it:

```css

/* ── settings modal ── */
.settings-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(20, 23, 28, 0.32);
  backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.settings-modal {
  width: 100%; max-width: 720px; height: 70vh; max-height: 560px;
  display: flex; overflow: hidden;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow-pop);
}
.settings-nav {
  width: 184px; flex-shrink: 0; border-right: 1px solid var(--border);
  padding: 14px 8px; display: flex; flex-direction: column; gap: 2px;
  background: var(--surface-sunken);
}
.settings-nav__title {
  font-size: 12px; font-weight: 700; color: var(--text-tertiary);
  text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 10px 8px;
}
.settings-nav-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border: none; background: none; border-radius: 8px; cursor: pointer;
  font: inherit; text-align: left; color: var(--text-secondary);
}
.settings-nav-item:hover { background: var(--surface-hover); }
.settings-nav-item.active { background: var(--accent-soft); color: var(--text); font-weight: 600; }
.settings-nav-icon { width: 20px; text-align: center; }

.settings-body { flex: 1; overflow: auto; padding: 22px 26px; }
.settings-pane { display: grid; gap: 20px; max-width: 420px; }
.settings-field { display: grid; gap: 6px; }
.settings-field__label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.settings-field input {
  font-size: 14px; padding: 8px 10px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong); background: var(--surface); color: var(--text);
}
```

- [ ] **Step 6: Commit**

```bash
git add src/ui/SettingsModal.tsx src/styles.css tests/ui/settingsModal.test.tsx
git commit -m "feat(ui): add SettingsModal with General section + styles"
```

---

## Task 4: MoodBar — replace inline language toggle with a gear button

**Files:**
- Modify: `src/ui/MoodBar.tsx`
- Test: `tests/ui/moodBar.test.tsx`

- [ ] **Step 1: Update existing tests' baseProps and add a gear test**

In `tests/ui/moodBar.test.tsx`, change `baseProps` from:

```tsx
const baseProps = {
  filter: { funTypes: [], topics: [], showHidden: false },
  allTopics: ['게임', '시각화'],
  sortMode: 'recent' as const,
  lastSyncAt: '2026-06-01T00:00:00Z',
  offline: false,
  onSortChange: () => {},
};
```

to:

```tsx
const baseProps = {
  filter: { funTypes: [], topics: [], showHidden: false },
  allTopics: ['게임', '시각화'],
  sortMode: 'recent' as const,
  lastSyncAt: '2026-06-01T00:00:00Z',
  offline: false,
  onSortChange: () => {},
  onOpenSettings: () => {},
};
```

Then add this test inside the `describe('MoodBar', ...)` block:

```tsx
  it('fires onOpenSettings when the gear button is clicked', () => {
    const onOpenSettings = vi.fn();
    render(<MoodBar {...baseProps} onOpenSettings={onOpenSettings} onChange={() => {}} onSync={() => {}} onDice={() => {}} />);
    // Default (no provider) context is Korean, so the gear's aria-label is '설정'.
    fireEvent.click(screen.getByLabelText('설정'));
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/moodBar.test.tsx`
Expected: FAIL — no element with label '설정' (gear not implemented yet); the other tests still pass.

- [ ] **Step 3: Update MoodBar — imports**

In `src/ui/MoodBar.tsx`, change:

```tsx
import { useLang, LANGS, LANG_LABEL } from '../i18n';
```

to:

```tsx
import { useLang } from '../i18n';
```

- [ ] **Step 4: Update MoodBar — props (type + destructure)**

Change the destructured params line from:

```tsx
  filter, allTopics, sortMode, lastSyncAt, offline, onChange, onSortChange, onSync, onDice,
}: {
```

to:

```tsx
  filter, allTopics, sortMode, lastSyncAt, offline, onChange, onSortChange, onSync, onDice, onOpenSettings,
}: {
```

And in the props type object, change:

```tsx
  onSync: () => void;
  onDice: () => void;
}) {
```

to:

```tsx
  onSync: () => void;
  onDice: () => void;
  onOpenSettings: () => void;
}) {
```

- [ ] **Step 5: Update MoodBar — drop `setLang` from the hook**

Change:

```tsx
  const { t, lang, setLang } = useLang();
```

to:

```tsx
  const { t, lang } = useLang();
```

- [ ] **Step 6: Update MoodBar — replace the lang-toggle with a gear button**

Find and remove this block (near the end of the returned JSX):

```tsx
      <span className="lang-toggle" aria-label={t.language}>
        {LANGS.map((l) => (
          <button key={l} type="button" className={`seg${lang === l ? ' is-on' : ''}`} onClick={() => setLang(l)}>
            {LANG_LABEL[l]}
          </button>
        ))}
      </span>
```

Replace it with:

```tsx
      <button type="button" className="btn" aria-label={t.settingsTitle} onClick={onOpenSettings}>⚙️</button>
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run tests/ui/moodBar.test.tsx`
Expected: PASS (all MoodBar tests including the new gear test).

- [ ] **Step 8: Commit**

```bash
git add src/ui/MoodBar.tsx tests/ui/moodBar.test.tsx
git commit -m "feat(ui): replace MoodBar inline language toggle with a settings gear button"
```

---

## Task 5: Dashboard — own modal state and wire the gear

**Files:**
- Modify: `src/ui/Dashboard.tsx`
- Test: `tests/ui/settingsModal.test.tsx` (add a Dashboard integration block)

- [ ] **Step 1: Write the failing integration test**

Add this import to the top of `tests/ui/settingsModal.test.tsx`:

```tsx
import { Dashboard } from '../../src/ui/Dashboard';
```

Append this block to `tests/ui/settingsModal.test.tsx`:

```tsx
describe('Dashboard settings integration', () => {
  function renderDashboard() {
    return render(
      <LangProvider lang="en" setLang={() => {}}>
        <Dashboard
          projects={[]}
          lastSyncAt="2026-06-01T00:00:00Z"
          offline={false}
          onSync={async () => {}}
          onSaveManual={async () => {}}
        />
      </LangProvider>,
    );
  }

  it('opens the settings modal when the gear is clicked', () => {
    renderDashboard();
    expect(screen.queryByTestId('settings-overlay')).toBeNull();
    fireEvent.click(screen.getByLabelText('Settings')); // en context: gear aria-label = 'Settings'
    expect(screen.getByTestId('settings-overlay')).toBeInTheDocument();
  });

  it('closes the modal on Escape', () => {
    renderDashboard();
    fireEvent.click(screen.getByLabelText('Settings'));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('settings-overlay')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/settingsModal.test.tsx`
Expected: FAIL — no element with label 'Settings' (Dashboard does not render the gear / pass `onOpenSettings` yet), or `settings-overlay` never appears.

- [ ] **Step 3: Add the SettingsModal import to Dashboard**

In `src/ui/Dashboard.tsx`, change:

```tsx
import { MoodBar } from './MoodBar';
import { ProjectCard } from './ProjectCard';
import { CardEditor } from './CardEditor';
```

to:

```tsx
import { MoodBar } from './MoodBar';
import { ProjectCard } from './ProjectCard';
import { CardEditor } from './CardEditor';
import { SettingsModal } from './SettingsModal';
```

- [ ] **Step 4: Add modal state**

Change:

```tsx
  const [editing, setEditing] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
```

to:

```tsx
  const [editing, setEditing] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
```

- [ ] **Step 5: Pass `onOpenSettings` to MoodBar**

Change:

```tsx
        onSync={() => { void onSync(); }}
        onDice={handleDice}
      />
```

to:

```tsx
        onSync={() => { void onSync(); }}
        onDice={handleDice}
        onOpenSettings={() => setSettingsOpen(true)}
      />
```

- [ ] **Step 6: Render the modal**

Change the end of the returned JSX from:

```tsx
        ))}
      </div>
    </div>
  );
}
```

to:

```tsx
        ))}
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run tests/ui/settingsModal.test.tsx`
Expected: PASS (GeneralSettings + SettingsModal + Dashboard integration).

- [ ] **Step 8: Commit**

```bash
git add src/ui/Dashboard.tsx tests/ui/settingsModal.test.tsx
git commit -m "feat(ui): open SettingsModal from the dashboard gear button"
```

---

## Task 6: Full quality gates

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all suites green (i18n, moodBar, settingsModal, and pre-existing tests).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: `tsc && vite build` completes with no errors.

- [ ] **Step 4: Manual smoke (optional but recommended)**

Run: `npm run dev`, open the app, confirm: the header shows a ⚙️ button (no inline EN/한국어 toggle); clicking it opens the modal; the General panel switches language; Escape / backdrop click closes it; the choice persists across reload.

- [ ] **Step 5: Final commit (only if Step 4 required tweaks)**

```bash
git add -A
git commit -m "chore: settings modal polish"
```

---

## Self-Review notes (author)

- **Spec coverage:** modal (Task 3), General panel + language (Tasks 2–3), gear in header replacing inline toggle (Task 4), Dashboard wiring (Task 5), i18n strings (Task 1), CSS (Task 3), tests for open/switch/close (Tasks 3, 5), MoodBar baseProps update (Task 4). All spec sections mapped.
- **Out of scope honored:** no userName field, no workspace/cutoff editing, single "General" section. `App.tsx` untouched.
- **Type consistency:** new prop `onOpenSettings: () => void` defined in MoodBar (Task 4) and supplied by Dashboard (Task 5) and tests (Task 4 baseProps, Task 5 render). `SettingsModal` prop `{ onClose: () => void }` consistent across component (Task 3) and call sites (Tasks 3, 5). New i18n keys `settingsTitle`/`settingsGeneral` defined in Task 1 and consumed in Tasks 3–4.
