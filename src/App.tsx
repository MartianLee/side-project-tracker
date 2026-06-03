import { useCallback, useEffect, useState } from 'react';
import { Project, ManualEntry, Settings, GITHUB_CUTOFF } from './domain/types';
import { Dashboard } from './ui/Dashboard';
import { Onboarding } from './ui/Onboarding';
import { appStore } from './data/store';
import { fetchGithubRepos } from './data/github';
import { getLocalGitInfo } from './data/localGit';
import { buildWorkspaceMap, defaultWorkspaceDir } from './data/workspaceMap';
import { loadManual, saveManualEntry } from './data/manualStore';
import { loadSettings, saveSettings } from './data/settingsStore';
import { loadCache, saveCache } from './data/cache';
import { resolveRepos } from './data/sync';
import { assembleProjects } from './data/loadProjects';

const ENV_CUTOFF = (import.meta.env.VITE_DEFAULT_GITHUB_CUTOFF as string) || GITHUB_CUTOFF;

export default function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [defaultWsDir, setDefaultWsDir] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<string>(new Date().toISOString());
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 최초 진입: 저장된 설정 로드, 없으면 온보딩
  useEffect(() => {
    (async () => {
      try {
        const store = await appStore();
        const s = await loadSettings(store);
        if (s) {
          setSettings(s);
        } else {
          const envWs = (import.meta.env.VITE_DEFAULT_WORKSPACE_DIR as string) || (await defaultWorkspaceDir());
          setDefaultWsDir(envWs);
          setNeedsOnboarding(true);
        }
      } catch (e) {
        setError(String(e));
      }
    })();
  }, []);

  const load = useCallback(async (force: boolean, s: Settings) => {
    try {
      const store = await appStore();
      const now = new Date();
      const sync = await resolveRepos(
        {
          loadCache: () => loadCache(store),
          saveCache: (repos, n) => saveCache(store, repos, n),
          fetchRepos: () => fetchGithubRepos(s.githubCutoff),
        },
        now,
        force,
      );
      const workspaceMap = await buildWorkspaceMap(s.workspaceDir);
      const manual = await loadManual(store);
      const assembled = await assembleProjects(sync.repos, { workspaceMap, getLocalGitInfo, manual }, now);
      setProjects(assembled);
      setLastSyncAt(sync.lastSyncAt);
      setOffline(sync.offline);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  useEffect(() => { if (settings) void load(false, settings); }, [settings, load]);

  const onSaveManual = useCallback(async (name: string, entry: ManualEntry) => {
    const store = await appStore();
    await saveManualEntry(store, name, entry);
    if (settings) await load(false, settings);
  }, [load, settings]);

  const onCompleteOnboarding = useCallback(async (s: Settings) => {
    const store = await appStore();
    await saveSettings(store, s);
    setNeedsOnboarding(false);
    setSettings(s);
  }, []);

  if (error) return <div className="error-banner">오류: {error}</div>;
  if (needsOnboarding) {
    return <Onboarding defaultWorkspaceDir={defaultWsDir} defaultCutoff={ENV_CUTOFF} onComplete={onCompleteOnboarding} />;
  }
  if (!settings) return <div className="error-banner" style={{ color: 'var(--text-tertiary)' }}>불러오는 중…</div>;

  return (
    <Dashboard
      projects={projects}
      lastSyncAt={lastSyncAt}
      offline={offline}
      onSync={() => load(true, settings)}
      onSaveManual={onSaveManual}
    />
  );
}
