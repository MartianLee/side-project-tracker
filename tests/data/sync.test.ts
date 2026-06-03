import { describe, it, expect, vi } from 'vitest';
import { resolveRepos, SyncDeps } from '../../src/data/sync';
import { GithubRepo } from '../../src/domain/types';

const NOW = new Date('2026-06-01T12:00:00Z');
const repos: GithubRepo[] = [
  { name: 'a', repoUrl: '', private: false, language: null, description: null, lastPushAt: '2026-05-30T00:00:00Z' },
];

function deps(over: Partial<SyncDeps>): SyncDeps {
  return {
    loadCache: async () => null,
    saveCache: async () => {},
    fetchRepos: async () => repos,
    ...over,
  };
}

describe('resolveRepos', () => {
  it('uses fresh cache without fetching', async () => {
    const fetchRepos = vi.fn();
    const d = deps({
      loadCache: async () => ({ repos, lastSyncAt: '2026-06-01T06:00:00Z' }),
      fetchRepos,
    });
    const r = await resolveRepos(d, NOW, false);
    expect(r.offline).toBe(false);
    expect(r.repos).toEqual(repos);
    expect(fetchRepos).not.toHaveBeenCalled();
  });

  it('fetches when cache stale and saves it', async () => {
    const saveCache = vi.fn(async () => {});
    const d = deps({ loadCache: async () => null, saveCache });
    const r = await resolveRepos(d, NOW, false);
    expect(r.repos).toEqual(repos);
    expect(saveCache).toHaveBeenCalledOnce();
  });

  it('force fetches even with fresh cache', async () => {
    const fetchRepos = vi.fn(async () => repos);
    const d = deps({
      loadCache: async () => ({ repos: [], lastSyncAt: '2026-06-01T06:00:00Z' }),
      fetchRepos,
    });
    await resolveRepos(d, NOW, true);
    expect(fetchRepos).toHaveBeenCalledOnce();
  });

  it('falls back to cache and flags offline on fetch error', async () => {
    const d = deps({
      loadCache: async () => ({ repos, lastSyncAt: '2026-05-01T00:00:00Z' }),
      fetchRepos: async () => { throw new Error('network'); },
    });
    const r = await resolveRepos(d, NOW, false);
    expect(r.offline).toBe(true);
    expect(r.repos).toEqual(repos);
  });

  it('throws when fetch fails and no cache', async () => {
    const d = deps({ loadCache: async () => null, fetchRepos: async () => { throw new Error('x'); } });
    await expect(resolveRepos(d, NOW, false)).rejects.toThrow();
  });
});
