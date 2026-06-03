import { describe, it, expect } from 'vitest';
import { loadManual, saveManualEntry, StoreLike } from '../../src/data/manualStore';
import { DEFAULT_MANUAL } from '../../src/domain/types';

function fakeStore(initial: Record<string, unknown> = {}): StoreLike {
  const data: Record<string, unknown> = { ...initial };
  return {
    async get<T>(key: string) { return (data[key] as T) ?? null; },
    async set(key: string, value: unknown) { data[key] = value; },
    async save() { /* noop */ },
  };
}

describe('manualStore', () => {
  it('returns empty object when nothing saved', async () => {
    expect(await loadManual(fakeStore())).toEqual({});
  });
  it('saves and reloads an entry by repo name', async () => {
    const store = fakeStore();
    const entry = { ...DEFAULT_MANUAL, memo: 'hi', topics: ['게임'] };
    await saveManualEntry(store, 'algo-visual', entry);
    const all = await loadManual(store);
    expect(all['algo-visual'].memo).toBe('hi');
    expect(all['algo-visual'].topics).toEqual(['게임']);
  });
});
