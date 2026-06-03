import { Activity, Stage, ACTIVE_STAGES } from './types';

const MS_PER_DAY = 86_400_000;

export function daysBetween(fromIso: string, now: Date): number {
  const then = new Date(fromIso).getTime();
  return Math.floor((now.getTime() - then) / MS_PER_DAY);
}

export function computeActivity(days: number): Activity {
  if (days < 14) return 'active';
  if (days <= 30) return 'warning';
  return 'stale';
}

export function showStaleWarning(stage: Stage, activity: Activity): boolean {
  return activity !== 'active' && ACTIVE_STAGES.includes(stage);
}
