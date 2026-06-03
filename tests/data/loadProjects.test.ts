import { describe, it, expect } from 'vitest';
import { assembleProjects, AssembleDeps } from '../../src/data/loadProjects';
import { GithubRepo, LocalGitInfo, ManualEntry, DEFAULT_MANUAL } from '../../src/domain/types';

const NOW = new Date('2026-06-01T00:00:00Z');
const repos: GithubRepo[] = [
  { name: 'cloned', repoUrl: '', private: false, language: 'TypeScript', description: null, lastPushAt: '2026-03-01T00:00:00Z' },
  { name: 'remote-only', repoUrl: '', private: true, language: null, description: null, lastPushAt: '2026-05-30T00:00:00Z' },
];

const local: Record<string, LocalGitInfo> = {
  '/ws/cloned': { lastCommitAt: '2026-05-31T00:00:00Z', branch: 'main' },
};
const manual: Record<string, ManualEntry> = {
  cloned: { ...DEFAULT_MANUAL, stage: '다듬기', topics: ['시각화'] },
};

function deps(): AssembleDeps {
  return {
    workspaceMap: new Map([['cloned', '/ws/cloned']]),
    getLocalGitInfo: async (p) => local[p] ?? null,
    manual,
  };
}

describe('assembleProjects', () => {
  it('enriches cloned repos with local git + manual', async () => {
    const out = await assembleProjects(repos, deps(), NOW);
    const cloned = out.find((p) => p.name === 'cloned')!;
    expect(cloned.localPath).toBe('/ws/cloned');
    expect(cloned.lastCommitAt).toBe('2026-05-31T00:00:00Z');
    expect(cloned.stage).toBe('다듬기');
    expect(cloned.topics).toEqual(['시각화']);
    expect(cloned.activity).toBe('active'); // 1일 전
  });

  it('handles remote-only repos with github data and defaults', async () => {
    const out = await assembleProjects(repos, deps(), NOW);
    const remote = out.find((p) => p.name === 'remote-only')!;
    expect(remote.localPath).toBeUndefined();
    expect(remote.stage).toBe('개발중'); // default
    expect(remote.daysSinceActivity).toBe(2); // pushed 05-30
  });
});
