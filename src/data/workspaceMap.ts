import { readDir } from '@tauri-apps/plugin-fs';
import { homeDir, join } from '@tauri-apps/api/path';

interface DirEntryLike {
  name: string;
  isDirectory: boolean;
}

export function toNameToPath(workspaceDir: string, entries: DirEntryLike[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const e of entries) {
    if (e.isDirectory) map.set(e.name, `${workspaceDir}/${e.name}`);
  }
  return map;
}

export async function defaultWorkspaceDir(): Promise<string> {
  return join(await homeDir(), 'workspace');
}

export async function buildWorkspaceMap(workspaceDir: string): Promise<Map<string, string>> {
  const entries = await readDir(workspaceDir);
  return toNameToPath(
    workspaceDir,
    entries.map((e) => ({ name: e.name, isDirectory: e.isDirectory })),
  );
}
