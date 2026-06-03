import { StoreLike } from './manualStore';
import { Settings } from '../domain/types';

const KEY = 'settings';

export async function loadSettings(store: StoreLike): Promise<Settings | null> {
  return (await store.get<Settings>(KEY)) ?? null;
}

export async function saveSettings(store: StoreLike, settings: Settings): Promise<void> {
  await store.set(KEY, settings);
  await store.save();
}
