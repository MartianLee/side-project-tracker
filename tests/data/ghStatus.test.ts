import { describe, it, expect } from 'vitest';
import { parseGhAuth } from '../../src/data/ghStatus';

describe('parseGhAuth', () => {
  it('reports ok and extracts the account when exit code is 0', () => {
    const out = parseGhAuth(0, '  ✓ Logged in to github.com account octocat (keyring)', '');
    expect(out.state).toBe('ok');
    expect(out.detail).toBe('octocat');
  });
  it('reports ok with a fallback detail when account not parseable', () => {
    expect(parseGhAuth(0, 'logged in', '').state).toBe('ok');
  });
  it('reports unauthed when exit code is non-zero', () => {
    const out = parseGhAuth(1, '', 'You are not logged into any GitHub hosts.');
    expect(out.state).toBe('unauthed');
  });
});
