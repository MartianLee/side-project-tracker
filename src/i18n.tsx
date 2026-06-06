import { createContext, useContext, ReactNode } from 'react';
import { Stage, FunType, Lang } from './domain/types';
import { SortMode } from './domain/filter';

export type { Lang };
export const LANGS: Lang[] = ['en', 'ko'];
export const LANG_LABEL: Record<Lang, string> = { en: 'EN', ko: '한국어' };

// 시스템 언어 감지 (webview navigator.language). 한국어면 ko, 그 외 en.
export function detectLang(): Lang {
  const n = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  return n.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export interface Dict {
  appName: string;
  // onboarding
  onboardingSub: string;
  workspaceLabel: string;     // = aria-label
  workspaceHint: string;
  workspacePlaceholder: string;
  cutoffLabel: string;        // = aria-label
  cutoffHint: string;
  ghChecking: string;
  ghOk: string;
  ghUnauthed: string;
  ghMissing: string;
  ghUnauthedHint: string;
  ghMissingHint: string;
  recheck: string;
  start: string;
  language: string;
  // moodbar
  moodLabel: string;
  topicLabel: string;
  dice: string;
  sync: string;
  offline: string;
  lastSync: (when: string) => string;
  sort: Record<SortMode, string>;
  // card
  daysAgo: (n: number) => string;
  launched: string;
  // editor
  stageLabel: string;         // = aria-label "단계"
  topicsAria: string;         // = aria-label "주제"
  topicsLabel: string;        // visible "주제(쉼표 구분)"
  memoLabel: string;          // = aria-label "메모"
  nextActionLabel: string;    // = aria-label "다음 액션"
  launchedCheckbox: string;
  launchUrlAria: string;      // = aria-label "출시 URL"
  pin: string;
  hide: string;
  save: string;
  close: string;
  // enums (display only — 저장값/CSS키는 한글 유지)
  stage: Record<Stage, string>;
  funLabel: Record<FunType, string>; // 이모지 포함
  // settings
  settingsTitle: string;
  settingsGeneral: string;
  // app
  error: (e: string) => string;
  loading: string;
}

const ko: Dict = {
  appName: '사이드 프로젝트 트래커',
  onboardingSub: '시작하기 전에 아래를 확인하세요. 설정은 나중에 바꿀 수 있어요.',
  workspaceLabel: '워크스페이스 폴더',
  workspaceHint: '로컬에 클론된 레포들이 모여 있는 폴더입니다.',
  workspacePlaceholder: '/Users/you/workspace',
  cutoffLabel: 'GitHub 컷오프 날짜',
  cutoffHint: '이 날짜 이후 푸시된 레포만 추적합니다.',
  ghChecking: 'gh 인증 확인 중…',
  ghOk: 'gh 인증됨',
  ghUnauthed: 'gh에 로그인이 필요합니다',
  ghMissing: 'gh CLI가 설치되어 있지 않습니다',
  ghUnauthedHint: '필수: 터미널에서 gh auth login 으로 로그인한 뒤 “다시 확인”을 눌러주세요. 토큰은 저장하지 않습니다.',
  ghMissingHint: '필수: GitHub CLI를 설치하세요 — brew install gh 또는 cli.github.com. 설치 후 “다시 확인”.',
  recheck: '다시 확인',
  start: '시작하기',
  language: '언어',
  moodLabel: '지금 기분',
  topicLabel: '주제',
  dice: '🎲 아무거나',
  sync: '🔄 동기화',
  offline: '오프라인',
  lastSync: (when) => `최근: ${when}`,
  sort: { recent: '최신 변경순', launched: '출시 상태순', neglect: '방치 우선' },
  daysAgo: (n) => `${n}일 전`,
  launched: '🚀 출시됨',
  stageLabel: '단계',
  topicsAria: '주제',
  topicsLabel: '주제(쉼표 구분)',
  memoLabel: '메모',
  nextActionLabel: '다음 액션',
  launchedCheckbox: '출시됨',
  launchUrlAria: '출시 URL',
  pin: '핀',
  hide: '숨김',
  save: '저장',
  close: '닫기',
  stage: { '아이디어': '아이디어', '개발중': '개발중', '다듬기': '다듬기', '유지·운영': '유지·운영', '보류': '보류' },
  funLabel: { '신규창작': '🆕 신규창작', '업그레이드': '⬆️ 업그레이드', '실험': '🧪 실험', '마무리': '🏁 마무리' },
  settingsTitle: '설정',
  settingsGeneral: '일반',
  error: (e) => `오류: ${e}`,
  loading: '불러오는 중…',
};

const en: Dict = {
  appName: 'Side Project Tracker',
  onboardingSub: 'Check the items below before you start. You can change settings later.',
  workspaceLabel: 'Workspace folder',
  workspaceHint: 'The folder where your cloned repos live.',
  workspacePlaceholder: '/Users/you/workspace',
  cutoffLabel: 'GitHub cutoff date',
  cutoffHint: 'Only repos pushed after this date are tracked.',
  ghChecking: 'Checking gh authentication…',
  ghOk: 'gh authenticated',
  ghUnauthed: 'You need to sign in to gh',
  ghMissing: 'gh CLI is not installed',
  ghUnauthedHint: 'Required: run gh auth login in your terminal, then press “Re-check”. No token is stored.',
  ghMissingHint: 'Required: install the GitHub CLI — brew install gh or cli.github.com. Then press “Re-check”.',
  recheck: 'Re-check',
  start: 'Get started',
  language: 'Language',
  moodLabel: 'Mood',
  topicLabel: 'Topics',
  dice: '🎲 Surprise me',
  sync: '🔄 Sync',
  offline: 'Offline',
  lastSync: (when) => `Synced: ${when}`,
  sort: { recent: 'Recently updated', launched: 'Launch status', neglect: 'Neglected first' },
  daysAgo: (n) => `${n}d ago`,
  launched: '🚀 Launched',
  stageLabel: 'Stage',
  topicsAria: 'Topics',
  topicsLabel: 'Topics (comma-separated)',
  memoLabel: 'Memo',
  nextActionLabel: 'Next action',
  launchedCheckbox: 'Launched',
  launchUrlAria: 'Launch URL',
  pin: 'Pin',
  hide: 'Hide',
  save: 'Save',
  close: 'Close',
  stage: { '아이디어': 'Idea', '개발중': 'Building', '다듬기': 'Polishing', '유지·운영': 'Maintenance', '보류': 'On hold' },
  funLabel: { '신규창작': '🆕 New', '업그레이드': '⬆️ Upgrade', '실험': '🧪 Experiment', '마무리': '🏁 Wrap-up' },
  settingsTitle: 'Settings',
  settingsGeneral: 'General',
  error: (e) => `Error: ${e}`,
  loading: 'Loading…',
};

export const DICTS: Record<Lang, Dict> = { en, ko };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

// 기본 컨텍스트는 ko — Provider 없이 렌더되는 단위 테스트가 한글로 동작.
const LangContext = createContext<LangCtx>({ lang: 'ko', setLang: () => {}, t: DICTS.ko });

export function LangProvider({ lang, setLang, children }: { lang: Lang; setLang: (l: Lang) => void; children: ReactNode }) {
  return <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>;
}

export function useLang(): LangCtx {
  return useContext(LangContext);
}
