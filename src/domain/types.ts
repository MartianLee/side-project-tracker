export type Stage = '아이디어' | '개발중' | '다듬기' | '유지·운영' | '보류';
export type FunType = '신규창작' | '업그레이드' | '실험' | '마무리';
export type Activity = 'active' | 'warning' | 'stale';

export interface Launched {
  date?: string; // ISO 출시일
  url?: string;  // 라이브 URL
}

export interface GithubRepo {
  name: string;
  repoUrl: string;
  private: boolean;
  language: string | null;
  description: string | null;
  lastPushAt: string; // ISO
}

export interface LocalGitInfo {
  lastCommitAt: string; // ISO
  branch: string;
}

export interface ManualEntry {
  stage: Stage;
  launched: Launched | null;
  funType: FunType[];
  topics: string[];
  memo: string;
  nextAction: string;
  pinned: boolean;
  hidden: boolean;
}

export interface Project {
  // GitHub
  name: string;
  repoUrl: string;
  private: boolean;
  language: string | null;
  description: string | null;
  lastPushAt: string;
  // 로컬 git (클론된 경우만)
  localPath?: string;
  lastCommitAt?: string;
  branch?: string;
  // 수동
  stage: Stage;
  launched: Launched | null;
  funType: FunType[];
  topics: string[];
  memo: string;
  nextAction: string;
  pinned: boolean;
  hidden: boolean;
  // 파생
  activity: Activity;
  daysSinceActivity: number;
}

export const STAGES: Stage[] = ['아이디어', '개발중', '다듬기', '유지·운영', '보류'];
export const FUN_TYPES: FunType[] = ['신규창작', '업그레이드', '실험', '마무리'];

// 방치 경고를 표시하는 "밀어붙이는 중" 단계
export const ACTIVE_STAGES: Stage[] = ['아이디어', '개발중', '다듬기'];

export const DEFAULT_MANUAL: ManualEntry = {
  stage: '개발중',
  launched: null,
  funType: [],
  topics: [],
  memo: '',
  nextAction: '',
  pinned: false,
  hidden: false,
};

export const GITHUB_CUTOFF = '2025-06-01';

export type Lang = 'en' | 'ko';

export interface Settings {
  workspaceDir: string;   // 절대 경로
  githubCutoff: string;   // 'YYYY-MM-DD'
  lang: Lang;             // UI 언어
}
