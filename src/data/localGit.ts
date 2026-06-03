import { Command } from '@tauri-apps/plugin-shell';
import { LocalGitInfo } from '../domain/types';

export function parseGitLog(isoDate: string, branch: string): LocalGitInfo | null {
  const d = isoDate.trim();
  if (!d) return null;
  return { lastCommitAt: d, branch: branch.trim() };
}

export async function getLocalGitInfo(path: string): Promise<LocalGitInfo | null> {
  try {
    const dateOut = await Command.create('git', ['-C', path, 'log', '-1', '--format=%cI']).execute();
    if (dateOut.code !== 0) return null;
    const brOut = await Command.create('git', ['-C', path, 'rev-parse', '--abbrev-ref', 'HEAD']).execute();
    return parseGitLog(dateOut.stdout, brOut.code === 0 ? brOut.stdout : '');
  } catch {
    return null;
  }
}
