import { describe, it, expect } from 'vitest';
import { parseGithubRepos, normalizePaginatedJson } from '../../src/data/github';

describe('normalizePaginatedJson', () => {
  it('joins multiple paginated arrays into one', () => {
    const raw = '[{"a":1}]\n[{"a":2}]';
    expect(normalizePaginatedJson(raw)).toBe('[{"a":1},{"a":2}]');
  });
  it('leaves a single array untouched', () => {
    expect(normalizePaginatedJson('[{"a":1}]')).toBe('[{"a":1}]');
  });
});

describe('parseGithubRepos', () => {
  const raw = JSON.stringify([
    { name: 'new-one', html_url: 'u1', private: true, language: 'TypeScript', description: 'd', pushed_at: '2026-01-01T00:00:00Z' },
    { name: 'old-one', html_url: 'u2', private: false, language: null, description: null, pushed_at: '2025-01-01T00:00:00Z' },
  ]);
  it('keeps only repos pushed after cutoff', () => {
    const out = parseGithubRepos(raw, '2025-06-01');
    expect(out.map((r) => r.name)).toEqual(['new-one']);
  });
  it('maps fields to GithubRepo shape', () => {
    const [r] = parseGithubRepos(raw, '2025-06-01');
    expect(r).toEqual({
      name: 'new-one', repoUrl: 'u1', private: true,
      language: 'TypeScript', description: 'd', lastPushAt: '2026-01-01T00:00:00Z',
    });
  });
});
