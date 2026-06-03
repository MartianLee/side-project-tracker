import { describe, it, expect } from 'vitest';
import { daysBetween, computeActivity, showStaleWarning } from '../../src/domain/staleness';

const NOW = new Date('2026-06-01T00:00:00Z');

describe('daysBetween', () => {
  it('counts whole days elapsed', () => {
    expect(daysBetween('2026-05-31T00:00:00Z', NOW)).toBe(1);
    expect(daysBetween('2026-06-01T00:00:00Z', NOW)).toBe(0);
    expect(daysBetween('2026-05-02T00:00:00Z', NOW)).toBe(30);
  });
});

describe('computeActivity', () => {
  it('maps days to activity at 14/30 boundaries', () => {
    expect(computeActivity(0)).toBe('active');
    expect(computeActivity(13)).toBe('active');
    expect(computeActivity(14)).toBe('warning');
    expect(computeActivity(30)).toBe('warning');
    expect(computeActivity(31)).toBe('stale');
  });
});

describe('showStaleWarning', () => {
  it('warns only for active stages that are not green', () => {
    expect(showStaleWarning('개발중', 'stale')).toBe(true);
    expect(showStaleWarning('다듬기', 'warning')).toBe(true);
    expect(showStaleWarning('개발중', 'active')).toBe(false);
  });
  it('never warns for 유지·운영 or 보류 regardless of activity', () => {
    expect(showStaleWarning('유지·운영', 'stale')).toBe(false);
    expect(showStaleWarning('보류', 'stale')).toBe(false);
  });
});
