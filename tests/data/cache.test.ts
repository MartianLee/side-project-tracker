import { describe, it, expect } from 'vitest';
import { isStale, SyncCache } from '../../src/data/cache';

const NOW = new Date('2026-06-01T12:00:00Z');

describe('isStale', () => {
  it('is stale when no cache', () => {
    expect(isStale(null, NOW)).toBe(true);
  });
  it('is fresh within 24h', () => {
    const c: SyncCache = { repos: [], lastSyncAt: '2026-06-01T00:00:00Z' };
    expect(isStale(c, NOW)).toBe(false);
  });
  it('is stale at/after 24h', () => {
    const c: SyncCache = { repos: [], lastSyncAt: '2026-05-31T12:00:00Z' };
    expect(isStale(c, NOW)).toBe(true);
  });
});
