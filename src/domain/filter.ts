import { Project, FunType } from './types';
import { showStaleWarning } from './staleness';

export interface MoodFilter {
  funTypes: FunType[]; // 빈 배열 = 전체
  topics: string[];    // 빈 배열 = 전체
  showHidden: boolean;
}

export function matchesFilter(p: Project, f: MoodFilter): boolean {
  if (f.funTypes.length && !f.funTypes.some((ft) => p.funType.includes(ft))) return false;
  if (f.topics.length && !f.topics.some((t) => p.topics.includes(t))) return false;
  return true;
}

export function visibleProjects(all: Project[], f: MoodFilter): Project[] {
  return all.filter((p) => f.showHidden || !p.hidden);
}

function neglectRank(p: Project): number {
  if (!showStaleWarning(p.stage, p.activity)) return 2; // 경고 아님 → 뒤로
  return p.activity === 'stale' ? 0 : 1;                // 방치 > 주의 먼저
}

function activityDate(p: Project): string {
  return p.lastCommitAt ?? p.lastPushAt;
}

export function sortProjects(ps: Project[]): Project[] {
  return [...ps].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      neglectRank(a) - neglectRank(b) ||
      activityDate(b).localeCompare(activityDate(a)),
  );
}

export function pickRandom(candidates: Project[], rand: () => number = Math.random): Project | null {
  if (candidates.length === 0) return null;
  return candidates[Math.floor(rand() * candidates.length)];
}
