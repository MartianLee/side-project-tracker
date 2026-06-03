import { GithubRepo } from '../domain/types';
import { StoreLike } from './manualStore';

export interface SyncCache {
  repos: GithubRepo[];
  lastSyncAt: string; // ISO
}

const KEY = 'github';
const TTL_MS = 24 * 3_600_000;

export function isStale(cache: SyncCache | null, now: Date, ttlMs: number = TTL_MS): boolean {
  if (!cache) return true;
  return now.getTime() - new Date(cache.lastSyncAt).getTime() >= ttlMs;
}

export async function loadCache(store: StoreLike): Promise<SyncCache | null> {
  return (await store.get<SyncCache>(KEY)) ?? null;
}

export async function saveCache(store: StoreLike, repos: GithubRepo[], now: Date): Promise<void> {
  const value: SyncCache = { repos, lastSyncAt: now.toISOString() };
  await store.set(KEY, value);
  await store.save();
}
