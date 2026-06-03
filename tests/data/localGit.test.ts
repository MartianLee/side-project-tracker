import { describe, it, expect } from 'vitest';
import { parseGitLog } from '../../src/data/localGit';

describe('parseGitLog', () => {
  it('trims date and branch into LocalGitInfo', () => {
    expect(parseGitLog('2026-05-31T10:00:00+09:00\n', 'main\n')).toEqual({
      lastCommitAt: '2026-05-31T10:00:00+09:00',
      branch: 'main',
    });
  });
  it('returns null when date is empty (no commits / not a repo)', () => {
    expect(parseGitLog('', 'main')).toBeNull();
    expect(parseGitLog('   ', '')).toBeNull();
  });
});
