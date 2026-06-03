import { useState } from 'react';
import { Settings } from '../domain/types';

export function Onboarding({
  defaultWorkspaceDir, defaultCutoff, onComplete,
}: {
  defaultWorkspaceDir: string;
  defaultCutoff: string;
  onComplete: (s: Settings) => void;
}) {
  const [workspaceDir, setWorkspaceDir] = useState(defaultWorkspaceDir);
  const [githubCutoff, setGithubCutoff] = useState(defaultCutoff);

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <h1 className="onboarding__title">사이드 프로젝트 트래커</h1>
        <p className="onboarding__sub">시작하기 전에 두 가지만 설정하세요. 나중에 바꿀 수 있어요.</p>

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

        <p className="onboarding__note">
          GitHub 데이터는 인증된 <code>gh</code> CLI로 가져옵니다 — 터미널에서{' '}
          <code>gh auth login</code> 이 되어 있어야 합니다. 토큰을 따로 저장하지 않습니다.
        </p>

        <button className="btn btn--primary onboarding__start" type="button"
          disabled={!workspaceDir.trim()}
          onClick={() => onComplete({ workspaceDir: workspaceDir.trim(), githubCutoff })}>
          시작하기
        </button>
      </div>
    </div>
  );
}
