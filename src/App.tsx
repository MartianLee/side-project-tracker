import { useCallback, useEffect, useState } from 'react';
import { Project, ManualEntry } from './domain/types';
import { Dashboard } from './ui/Dashboard';
import { appStore } from './data/store';
import { fetchGithubRepos } from './data/github';
import { getLocalGitInfo } from './data/localGit';
import { buildWorkspaceMap, defaultWorkspaceDir } from './data/workspaceMap';
import { loadManual, saveManualEntry } from './data/manualStore';
import { loadCache, saveCache } from './data/cache';
import { resolveRepos } from './data/sync';
import { assembleProjects } from './data/loadProjects';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<string>(new Date().toISOString());
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force: boolean) => {
    try {
      const store = await appStore();
      const now = new Date();
      const sync = await resolveRepos(
        {
          loadCache: () => loadCache(store),
          saveCache: (repos, n) => saveCache(store, repos, n),
          fetchRepos: fetchGithubRepos,
        },
        now,
        force,
      );
      const wsDir = await defaultWorkspaceDir();
      const workspaceMap = await buildWorkspaceMap(wsDir);
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

  useEffect(() => { void load(false); }, [load]);

  const onSaveManual = useCallback(async (name: string, entry: ManualEntry) => {
    const store = await appStore();
    await saveManualEntry(store, name, entry);
    await load(false);
  }, [load]);

  if (error) return <div className="error-banner">오류: {error}</div>;

  return (
    <Dashboard
      projects={projects}
      lastSyncAt={lastSyncAt}
      offline={offline}
      onSync={() => load(true)}
      onSaveManual={onSaveManual}
    />
  );
}
