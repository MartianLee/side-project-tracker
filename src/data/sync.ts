import { GithubRepo } from '../domain/types';
import { SyncCache, isStale } from './cache';

export interface SyncDeps {
  loadCache: () => Promise<SyncCache | null>;
  saveCache: (repos: GithubRepo[], now: Date) => Promise<void>;
  fetchRepos: () => Promise<GithubRepo[]>;
}

export interface SyncResult {
  repos: GithubRepo[];
  lastSyncAt: string;
  offline: boolean;
}

export async function resolveRepos(deps: SyncDeps, now: Date, force: boolean): Promise<SyncResult> {
  const cache = await deps.loadCache();
  if (!force && !isStale(cache, now)) {
    return { repos: cache!.repos, lastSyncAt: cache!.lastSyncAt, offline: false };
  }
  try {
    const repos = await deps.fetchRepos();
    await deps.saveCache(repos, now);
    return { repos, lastSyncAt: now.toISOString(), offline: false };
  } catch (err) {
    if (cache) return { repos: cache.repos, lastSyncAt: cache.lastSyncAt, offline: true };
    throw new Error('GitHub 동기화 실패 & 캐시 없음: ' + String(err));
  }
}
