import { ManualEntry } from '../domain/types';

// plugin-store의 Store와 호환되는 최소 인터페이스 (테스트 더블 가능)
export interface StoreLike {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  save(): Promise<void>;
}

const KEY = 'entries';

export async function loadManual(store: StoreLike): Promise<Record<string, ManualEntry>> {
  return (await store.get<Record<string, ManualEntry>>(KEY)) ?? {};
}

export async function saveManualEntry(store: StoreLike, name: string, entry: ManualEntry): Promise<void> {
  const all = await loadManual(store);
  all[name] = entry;
  await store.set(KEY, all);
  await store.save();
}
