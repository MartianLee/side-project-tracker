**English** | [한국어](./README-ko.md)

# Side Project Tracker

A macOS desktop app that tracks the side projects (GitHub repos) in your `~/workspace` from a single window — launch stage, staleness detection, interest tags, and mood matching.

> 📷 Screenshots coming soon

---

## ✨ Features

- **Card grid** — stage badges (idea / building / polishing / maintenance / on-hold), activity status (active · warning · stale), memo, next action
- **Interest tags** — fun-type (new creation · upgrade · experiment · wrap-up) + topic tags
- **🎲 Mood-match filter** — surfaces the projects that fit your current mood
- **Sorting** — by recent activity, launch status, or neglect
- **Inline editing** — edit stage, memo, and next action right on the card
- **Dual data sources** — pulls the repo list from GitHub (`gh` CLI) and enriches it with last commit / branch from local git

---

## 🧰 Prerequisites

| Requirement | Version |
|-------------|---------|
| macOS | — |
| Node.js | ≥ 18 |
| Rust (rustup) | for the Tauri build |
| `gh` CLI | must be signed in via `gh auth login` |

> **No token storage** — GitHub data is fetched through the already-authenticated `gh` CLI; the app stores no token of its own. The first-run onboarding verifies that `gh` is installed and authenticated, and blocks startup with guidance until it is ready.

---

## 🚀 Getting started

```bash
git clone <repo-url>
cd side-project-tracker
npm install
npm run tauri dev      # run in development
npm run tauri build    # build the .app
```

On first launch you'll see an onboarding screen. Enter your workspace folder and GitHub cutoff date, and you're ready to go.

---

## ⚙️ Configuration

The first-run onboarding asks for two things:

1. **Workspace folder** — the directory where your cloned repos live (e.g. `/Users/you/workspace`)
2. **GitHub cutoff date** — only repos pushed after this date are tracked

Settings are stored in `data.json` in the app's data directory. To change them later, restart the app (a settings-reset UI isn't built yet — delete the file manually).

You can pre-fill the onboarding defaults via `.env` (see `.env.example`; these are not secrets):

```
VITE_DEFAULT_WORKSPACE_DIR=/Users/you/workspace
VITE_DEFAULT_GITHUB_CUTOFF=2025-06-01
```

> **Note:** the workspace folder must live under your home directory (`$HOME`) due to file-access scoping.

---

## 🗂️ Data sources

| Source | How |
|--------|-----|
| GitHub repo list | authenticated `gh` CLI — no token stored |
| Local git info | read directly from cloned repos (last commit · branch) |
| Manual layer | local JSON (stage · tags · memo · next action) |

---

## 🧪 Development

```bash
npm test          # vitest unit/component tests
npm run build     # frontend build (includes type-check)
npx tsc --noEmit  # type-check only
```

---

## 📄 License

MIT (see [LICENSE](./LICENSE))
