import { describe, it, expect } from 'vitest';
import { matchesFilter, visibleProjects, sortProjects, pickRandom, MoodFilter } from '../../src/domain/filter';
import { Project } from '../../src/domain/types';

function proj(over: Partial<Project>): Project {
  return {
    name: 'p', repoUrl: '', private: false, language: null, description: null,
    lastPushAt: '2026-06-01T00:00:00Z',
    stage: '개발중', launched: null, funType: [], topics: [],
    memo: '', nextAction: '', pinned: false, hidden: false,
    activity: 'active', daysSinceActivity: 0,
    ...over,
  };
}

const EMPTY: MoodFilter = { funTypes: [], topics: [], showHidden: false };

describe('matchesFilter', () => {
  it('matches all when filter empty', () => {
    expect(matchesFilter(proj({}), EMPTY)).toBe(true);
  });
  it('matches when project has any selected funType', () => {
    const p = proj({ funType: ['업그레이드', '실험'] });
    expect(matchesFilter(p, { ...EMPTY, funTypes: ['실험'] })).toBe(true);
    expect(matchesFilter(p, { ...EMPTY, funTypes: ['신규창작'] })).toBe(false);
  });
  it('matches when project has any selected topic', () => {
    const p = proj({ topics: ['게임'] });
    expect(matchesFilter(p, { ...EMPTY, topics: ['게임'] })).toBe(true);
    expect(matchesFilter(p, { ...EMPTY, topics: ['AI'] })).toBe(false);
  });
});

describe('visibleProjects', () => {
  it('hides hidden projects unless showHidden', () => {
    const ps = [proj({ name: 'a' }), proj({ name: 'b', hidden: true })];
    expect(visibleProjects(ps, EMPTY).map(p => p.name)).toEqual(['a']);
    expect(visibleProjects(ps, { ...EMPTY, showHidden: true }).map(p => p.name)).toEqual(['a', 'b']);
  });
});

describe('sortProjects', () => {
  const old = proj({ name: 'old', lastCommitAt: '2026-01-01T00:00:00Z' });
  const mid = proj({ name: 'mid', lastCommitAt: '2026-04-01T00:00:00Z', launched: { url: 'u' } });
  const fresh = proj({ name: 'fresh', lastCommitAt: '2026-05-30T00:00:00Z' });

  it("default 'recent': newest activity first", () => {
    const out = sortProjects([old, fresh, mid]).map(p => p.name);
    expect(out).toEqual(['fresh', 'mid', 'old']);
  });

  it("'launched': launched projects first, then recent", () => {
    const out = sortProjects([old, fresh, mid], 'launched').map(p => p.name);
    expect(out[0]).toBe('mid'); // only launched one
    expect(out.slice(1)).toEqual(['fresh', 'old']);
  });

  it('pinned always floats to top regardless of mode', () => {
    const pinned = proj({ name: 'pin', pinned: true, lastCommitAt: '2025-01-01T00:00:00Z' });
    expect(sortProjects([fresh, pinned]).map(p => p.name)[0]).toBe('pin');
    expect(sortProjects([fresh, pinned], 'launched').map(p => p.name)[0]).toBe('pin');
  });

  it("'neglect': neglected active-stage first", () => {
    const pinned = proj({ name: 'pin', pinned: true, activity: 'active' });
    const neglected = proj({ name: 'neg', stage: '개발중', activity: 'stale', lastCommitAt: '2026-01-01T00:00:00Z' });
    const maintained = proj({ name: 'maint', stage: '유지·운영', activity: 'stale', lastCommitAt: '2026-05-01T00:00:00Z' });
    const fresh2 = proj({ name: 'fresh', activity: 'active', lastCommitAt: '2026-05-30T00:00:00Z' });
    const out = sortProjects([fresh2, maintained, neglected, pinned], 'neglect').map(p => p.name);
    expect(out[0]).toBe('pin');
    expect(out[1]).toBe('neg');
  });
});

describe('pickRandom', () => {
  it('returns null on empty', () => {
    expect(pickRandom([], () => 0)).toBeNull();
  });
  it('picks by rand index', () => {
    const ps = [proj({ name: 'a' }), proj({ name: 'b' }), proj({ name: 'c' })];
    expect(pickRandom(ps, () => 0).name).toBe('a');
    expect(pickRandom(ps, () => 0.99).name).toBe('c');
  });
});
