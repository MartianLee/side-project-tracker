import { describe, it, expect } from 'vitest';
import { loadSettings, saveSettings } from '../../src/data/settingsStore';
import { StoreLike } from '../../src/data/manualStore';

function fakeStore(initial: Record<string, unknown> = {}): StoreLike {
  const data: Record<string, unknown> = { ...initial };
  return {
    async get<T>(key: string) { return (data[key] as T) ?? null; },
    async set(key: string, value: unknown) { data[key] = value; },
    async save() {},
  };
}

describe('settingsStore', () => {
  it('returns null when no settings saved', async () => {
    expect(await loadSettings(fakeStore())).toBeNull();
  });
  it('saves and reloads settings', async () => {
    const store = fakeStore();
    await saveSettings(store, { workspaceDir: '/Users/you/workspace', githubCutoff: '2025-06-01' });
    const s = await loadSettings(store);
    expect(s?.workspaceDir).toBe('/Users/you/workspace');
    expect(s?.githubCutoff).toBe('2025-06-01');
  });
});
