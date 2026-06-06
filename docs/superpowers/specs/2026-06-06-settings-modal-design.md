# Settings Modal + Language Relocation — Design

**Date:** 2026-06-06
**Status:** Approved (ready for implementation plan)

## Goal

Add a Settings modal (⚙️) to side-project-tracker with a left-nav + right-panel
layout, and move the existing EN/한국어 language toggle out of the dashboard header
(`MoodBar`) into the modal's "General" panel.

## Background

side-project-tracker **already has working en/ko language switching**:

- Language selector in the onboarding screen (`src/ui/Onboarding.tsx`)
- An inline `EN / 한국어` toggle in the dashboard header (`src/ui/MoodBar.tsx`)
- The selected language is persisted to settings (`App.tsx::handleSetLang` →
  `saveSettings`)
- System-language auto-detection on first run (`i18n.tsx::detectLang`)

What is missing is a dedicated home for app-wide preferences. As the app grows, an
inline toggle wedged into the toolbar does not scale and clutters the header. This
work introduces a Settings modal to host such preferences, starting by relocating
the language toggle into it.

**Key insight:** the language plumbing (state, persistence, `LangProvider`,
`detectLang`) already exists — only the *trigger location* moves from the header
into the modal. Therefore `App.tsx` does not change.

## Scope

### In scope
- A Settings modal with a left-nav + right-panel layout.
- A single "General" section containing the language toggle.
- Relocating the language toggle from `MoodBar` into the modal; a gear (⚙️) button
  takes its place in the header.

### Out of scope (YAGNI)
- A user-name field or other profile settings.
- Editing workspace dir / GitHub cutoff after onboarding.
- Additional settings sections (the app is currently single-purpose; the left nav
  starts with just "General" and can grow later).

The onboarding language selector is **unchanged** — it runs on first launch,
before any persisted settings exist.

## Architecture & Components

### New files

**`src/ui/SettingsModal.tsx`**
- Renders an overlay + modal: left `settings-nav`, right `settings-body`.
- The `sections` array contains a single entry:
  `{ id: 'general', name: t.settingsGeneral, icon: '⚙️', Panel: GeneralSettings }`.
  The left-nav layout is intentionally chosen so future sections drop in without a
  structural rewrite.
- Closes on Escape key and on overlay (backdrop) click; clicks inside the modal do
  not close it (`stopPropagation`).
- Carries `data-testid="settings-overlay"` for tests.
- Props: `{ onClose: () => void }`.

**`src/ui/GeneralSettings.tsx`**
- The "General" panel. Uses `useLang()` directly and renders **only** the language
  toggle.
- `const { t, lang, setLang } = useLang();` then maps `LANGS` to `seg` buttons that
  call `setLang(l)`, wrapped in a `settings-field` with a `settings-field__label` of
  `t.language`, reusing the existing `lang-toggle` / `seg` styles.

**`tests/ui/settingsModal.test.tsx`** — see Testing.

### Modified files

**`src/i18n.tsx`**
- Add to the `Dict` interface: `settingsTitle: string;` and `settingsGeneral: string;`
  (`language` already exists).
- `ko`: `settingsTitle: '설정'`, `settingsGeneral: '일반'`.
- `en`: `settingsTitle: 'Settings'`, `settingsGeneral: 'General'`.

**`src/ui/MoodBar.tsx`**
- Remove the inline `.lang-toggle` block.
- Add a gear (⚙️) button in its place (far right of the toolbar) that calls a new
  required prop `onOpenSettings: () => void`.
- Remove now-unused imports/destructured values (`LANGS`, `LANG_LABEL`, `setLang`).
  Keep `lang` — it is still used for `toLocaleString` locale formatting in the
  sync-status label.

**`src/ui/Dashboard.tsx`**
- Add local state `const [settingsOpen, setSettingsOpen] = useState(false)`.
- Pass `onOpenSettings={() => setSettingsOpen(true)}` to `MoodBar`.
- Render `{settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}`.

**`src/styles.css`**
- Add CSS rules for the modal:
  `.settings-overlay`, `.settings-modal`, `.settings-nav`, `.settings-nav__title`,
  `.settings-nav-item`, `.settings-nav-item:hover`, `.settings-nav-item.active`,
  `.settings-nav-icon`, `.settings-body`, `.settings-pane`, `.settings-field`,
  `.settings-field__label`, `.settings-field input`.
- All CSS custom properties referenced by these rules (`--surface`,
  `--surface-sunken`, `--surface-hover`, `--border`, `--border-strong`, `--radius`,
  `--radius-sm`, `--shadow-pop`, `--accent`, `--accent-soft`, `--text`,
  `--text-secondary`, `--text-tertiary`) are already defined in `:root`. No token
  additions required.

**`tests/ui/moodBar.test.tsx`**
- Add `onOpenSettings` to the shared `baseProps` (and/or per-render props) so
  existing MoodBar tests keep compiling and rendering.

### File placement

New components live in `src/ui/`, following the existing convention where all
components reside.

## Data Flow

```
⚙️ (MoodBar)
  → Dashboard sets settingsOpen = true
  → <SettingsModal> renders, left nav "General" → <GeneralSettings>
  → user clicks EN / 한국어
  → GeneralSettings calls useLang().setLang(l)
  → (existing) App.handleSetLang updates `lang` state + saveSettings(...) persists
  → LangProvider re-provides DICTS[lang]; UI re-renders in the new language
```

The persistence path is unchanged from the current inline toggle; only the UI that
invokes `setLang` moves.

## Error Handling

No new error surfaces. Language switching is a synchronous state update plus a
best-effort persistence call already handled by the existing `handleSetLang`. The
modal has no async operations.

## Testing

Stack: vitest + @testing-library/react (jsdom), matching existing tests.

`tests/ui/settingsModal.test.tsx`:
- Clicking the gear (⚙️) button in the toolbar opens the modal
  (`settings-overlay` appears).
- The modal's General panel shows the language toggle; clicking `한국어` switches
  the rendered dictionary to Korean and clicking `EN` switches back (assert on a
  visible translated string and/or `setLang` invocation).
- Pressing Escape closes the modal; clicking the overlay backdrop closes it;
  clicking inside the modal does not close it.

`tests/ui/moodBar.test.tsx`:
- Updated `baseProps` include `onOpenSettings`; existing assertions unchanged.

Quality gates before completion: `bun test` (or `vitest run`) green and
`tsc`/`build` clean.
