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

// 정렬 모드: 최신 변경순(기본) / 출시 상태순 / 방치 우선
export type SortMode = 'recent' | 'launched' | 'neglect';

export const SORT_LABELS: Record<SortMode, string> = {
  recent: '최신 변경순',
  launched: '출시 상태순',
  neglect: '방치 우선',
};

function neglectRank(p: Project): number {
  if (!showStaleWarning(p.stage, p.activity)) return 2; // 경고 아님 → 뒤로
  return p.activity === 'stale' ? 0 : 1;                // 방치 > 주의 먼저
}

function activityDate(p: Project): string {
  return p.lastCommitAt ?? p.lastPushAt;
}

function recentCmp(a: Project, b: Project): number {
  return activityDate(b).localeCompare(activityDate(a)); // 최신이 앞
}

function modeCmp(a: Project, b: Project, mode: SortMode): number {
  if (mode === 'launched') {
    return Number(!!b.launched) - Number(!!a.launched) || recentCmp(a, b); // 출시됨 먼저
  }
  if (mode === 'neglect') {
    return neglectRank(a) - neglectRank(b) || recentCmp(a, b);
  }
  return recentCmp(a, b); // 'recent'
}

// 핀 고정이 항상 최우선, 그다음 선택한 모드 기준.
export function sortProjects(ps: Project[], mode: SortMode = 'recent'): Project[] {
  return [...ps].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || modeCmp(a, b, mode),
  );
}

export function pickRandom(candidates: Project[], rand: () => number = Math.random): Project | null {
  if (candidates.length === 0) return null;
  return candidates[Math.floor(rand() * candidates.length)];
}
