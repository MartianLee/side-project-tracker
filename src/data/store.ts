import { Store } from '@tauri-apps/plugin-store';
import { StoreLike } from './manualStore';

let cached: Store | null = null;

async function rawStore(): Promise<Store> {
  if (!cached) cached = await Store.load('data.json');
  return cached;
}

/** Returns a StoreLike adapter over the plugin Store (coerces undefined → null). */
export async function appStore(): Promise<StoreLike> {
  const store = await rawStore();
  return {
    get: async <T>(key: string): Promise<T | null> => {
      const v = await store.get<T>(key);
      return v === undefined ? null : (v ?? null);
    },
    set: (key: string, value: unknown) => store.set(key, value),
    save: () => store.save(),
  };
}
