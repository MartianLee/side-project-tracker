import { describe, it, expect } from 'vitest';
import { mergeProject } from '../../src/domain/merge';
import { GithubRepo, LocalGitInfo, ManualEntry } from '../../src/domain/types';

const NOW = new Date('2026-06-01T00:00:00Z');

const repo: GithubRepo = {
  name: 'algo-visual',
  repoUrl: 'https://github.com/octocat/algo-visual',
  private: true,
  language: 'TypeScript',
  description: '정렬 시각화',
  lastPushAt: '2026-03-01T00:00:00Z', // 92일 전 → stale
};

const local: LocalGitInfo = { lastCommitAt: '2026-05-31T00:00:00Z', branch: 'main' };

const manual: ManualEntry = {
  stage: '개발중', launched: null, funType: ['업그레이드'], topics: ['시각화'],
  memo: 'm', nextAction: 'n', pinned: true, hidden: false,
};

describe('mergeProject', () => {
  it('prefers local commit date over github push for activity', () => {
    const p = mergeProject(repo, local, '/Users/you/workspace/algo-visual', manual, NOW);
    expect(p.daysSinceActivity).toBe(1);
    expect(p.activity).toBe('active');
    expect(p.lastCommitAt).toBe('2026-05-31T00:00:00Z');
    expect(p.branch).toBe('main');
    expect(p.localPath).toBe('/Users/you/workspace/algo-visual');
  });

  it('falls back to github push when not cloned locally', () => {
    const p = mergeProject(repo, null, null, manual, NOW);
    expect(p.daysSinceActivity).toBe(92);
    expect(p.activity).toBe('stale');
    expect(p.lastCommitAt).toBeUndefined();
    expect(p.localPath).toBeUndefined();
  });

  it('uses default manual fields when manual entry missing', () => {
    const p = mergeProject(repo, local, null, undefined, NOW);
    expect(p.stage).toBe('개발중');
    expect(p.funType).toEqual([]);
    expect(p.pinned).toBe(false);
  });

  it('carries manual fields through', () => {
    const p = mergeProject(repo, local, null, manual, NOW);
    expect(p.funType).toEqual(['업그레이드']);
    expect(p.topics).toEqual(['시각화']);
    expect(p.pinned).toBe(true);
  });
});
