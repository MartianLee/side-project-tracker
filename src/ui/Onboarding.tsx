import { useCallback, useEffect, useState } from 'react';
import { Settings } from '../domain/types';
import { GhStatus, checkGhAuth } from '../data/ghStatus';

const GH_MESSAGE: Record<GhStatus['state'], string> = {
  checking: 'gh 인증 확인 중…',
  ok: 'gh 인증됨',
  unauthed: 'gh에 로그인이 필요합니다',
  missing: 'gh CLI가 설치되어 있지 않습니다',
};

export function Onboarding({
  defaultWorkspaceDir, defaultCutoff, onComplete, checkAuth = checkGhAuth,
}: {
  defaultWorkspaceDir: string;
  defaultCutoff: string;
  onComplete: (s: Settings) => void;
  checkAuth?: () => Promise<GhStatus>;
}) {
  const [workspaceDir, setWorkspaceDir] = useState(defaultWorkspaceDir);
  const [githubCutoff, setGithubCutoff] = useState(defaultCutoff);
  const [gh, setGh] = useState<GhStatus>({ state: 'checking', detail: '' });

  const runCheck = useCallback(() => {
    setGh({ state: 'checking', detail: '' });
    checkAuth().then(setGh).catch(() => setGh({ state: 'missing', detail: '' }));
  }, [checkAuth]);

  useEffect(() => { runCheck(); }, [runCheck]);

  const ready = gh.state === 'ok' && !!workspaceDir.trim();

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <h1 className="onboarding__title">사이드 프로젝트 트래커</h1>
        <p className="onboarding__sub">시작하기 전에 아래를 확인하세요. 설정은 나중에 바꿀 수 있어요.</p>

        <label className="onboarding__field">
          워크스페이스 폴더
          <input aria-label="워크스페이스 폴더" type="text" value={workspaceDir}
            placeholder="/Users/you/workspace"
            onChange={(e) => setWorkspaceDir(e.target.value)} />
          <span className="onboarding__hint">로컬에 클론된 레포들이 모여 있는 폴더입니다.</span>
        </label>

        <label className="onboarding__field">
          GitHub 컷오프 날짜
          <input aria-label="GitHub 컷오프 날짜" type="date" value={githubCutoff}
            onChange={(e) => setGithubCutoff(e.target.value)} />
          <span className="onboarding__hint">이 날짜 이후 푸시된 레포만 추적합니다.</span>
        </label>

        <div className={`gh-check gh-check--${gh.state}`}>
          <div className="gh-check__row">
            <span className="gh-check__icon">{gh.state === 'ok' ? '✅' : gh.state === 'checking' ? '⏳' : '⚠️'}</span>
            <span className="gh-check__msg">
              {GH_MESSAGE[gh.state]}{gh.state === 'ok' && gh.detail ? ` · ${gh.detail}` : ''}
            </span>
            {gh.state !== 'ok' && gh.state !== 'checking' && (
              <button type="button" className="btn gh-check__recheck" onClick={runCheck}>다시 확인</button>
            )}
          </div>
          {gh.state === 'unauthed' && (
            <p className="gh-check__hint">필수: 터미널에서 <code>gh auth login</code> 으로 로그인한 뒤 “다시 확인”을 눌러주세요. 토큰은 저장하지 않습니다.</p>
          )}
          {gh.state === 'missing' && (
            <p className="gh-check__hint">필수: GitHub CLI를 설치하세요 — <code>brew install gh</code> 또는 <code>cli.github.com</code>. 설치 후 “다시 확인”.</p>
          )}
        </div>

        <button className="btn btn--primary onboarding__start" type="button"
          disabled={!ready}
          title={!ready && gh.state !== 'ok' ? 'GitHub CLI 준비가 필요합니다' : undefined}
          onClick={() => onComplete({ workspaceDir: workspaceDir.trim(), githubCutoff })}>
          시작하기
        </button>
      </div>
    </div>
  );
}
