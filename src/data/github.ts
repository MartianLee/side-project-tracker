import { Command } from '@tauri-apps/plugin-shell';
import { GithubRepo, GITHUB_CUTOFF } from '../domain/types';

interface RawRepo {
  name: string;
  html_url: string;
  private: boolean;
  language: string | null;
  description: string | null;
  pushed_at: string;
}

export function normalizePaginatedJson(stdout: string): string {
  return stdout.trim().replace(/\]\s*\[/g, ',');
}

export function parseGithubRepos(raw: string, cutoff: string = GITHUB_CUTOFF): GithubRepo[] {
  const arr = JSON.parse(raw) as RawRepo[];
  return arr
    .filter((r) => typeof r.pushed_at === 'string' && r.pushed_at > cutoff)
    .map((r) => ({
      name: r.name,
      repoUrl: r.html_url,
      private: !!r.private,
      language: r.language ?? null,
      description: r.description ?? null,
      lastPushAt: r.pushed_at,
    }));
}

export async function fetchGithubRepos(cutoff: string = GITHUB_CUTOFF): Promise<GithubRepo[]> {
  const cmd = Command.create('gh', [
    'api',
    'user/repos?per_page=100&affiliation=owner&sort=pushed',
    '--paginate',
  ]);
  const out = await cmd.execute();
  if (out.code !== 0) throw new Error(`gh api failed: ${out.stderr}`);
  return parseGithubRepos(normalizePaginatedJson(out.stdout), cutoff);
}
