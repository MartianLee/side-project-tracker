import { useCallback, useEffect, useState } from 'react';
import { Settings } from '../domain/types';
import { GhStatus, checkGhAuth } from '../data/ghStatus';
import { useLang, LANGS, LANG_LABEL } from '../i18n';

export function Onboarding({
  defaultWorkspaceDir, defaultCutoff, onComplete, checkAuth = checkGhAuth,
}: {
  defaultWorkspaceDir: string;
  defaultCutoff: string;
  onComplete: (s: Settings) => void;
  checkAuth?: () => Promise<GhStatus>;
}) {
  const { t, lang, setLang } = useLang();
  const [workspaceDir, setWorkspaceDir] = useState(defaultWorkspaceDir);
  const [githubCutoff, setGithubCutoff] = useState(defaultCutoff);
  const [gh, setGh] = useState<GhStatus>({ state: 'checking', detail: '' });

  const runCheck = useCallback(() => {
    setGh({ state: 'checking', detail: '' });
    checkAuth().then(setGh).catch(() => setGh({ state: 'missing', detail: '' }));
  }, [checkAuth]);

  useEffect(() => { runCheck(); }, [runCheck]);

  const ready = gh.state === 'ok' && !!workspaceDir.trim();
  const ghMsg = gh.state === 'ok' ? t.ghOk : gh.state === 'checking' ? t.ghChecking : gh.state === 'unauthed' ? t.ghUnauthed : t.ghMissing;

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <div className="onboarding__top">
          <h1 className="onboarding__title">{t.appName}</h1>
          <span className="lang-toggle" aria-label={t.language}>
            {LANGS.map((l) => (
              <button key={l} type="button" className={`seg${lang === l ? ' is-on' : ''}`} onClick={() => setLang(l)}>
                {LANG_LABEL[l]}
              </button>
            ))}
          </span>
        </div>
        <p className="onboarding__sub">{t.onboardingSub}</p>

        <label className="onboarding__field">
          {t.workspaceLabel}
          <input aria-label={t.workspaceLabel} type="text" value={workspaceDir}
            placeholder={t.workspacePlaceholder}
            onChange={(e) => setWorkspaceDir(e.target.value)} />
          <span className="onboarding__hint">{t.workspaceHint}</span>
        </label>

        <label className="onboarding__field">
          {t.cutoffLabel}
          <input aria-label={t.cutoffLabel} type="date" value={githubCutoff}
            onChange={(e) => setGithubCutoff(e.target.value)} />
          <span className="onboarding__hint">{t.cutoffHint}</span>
        </label>

        <div className={`gh-check gh-check--${gh.state}`}>
          <div className="gh-check__row">
            <span className="gh-check__icon">{gh.state === 'ok' ? '✅' : gh.state === 'checking' ? '⏳' : '⚠️'}</span>
            <span className="gh-check__msg">{ghMsg}{gh.state === 'ok' && gh.detail ? ` · ${gh.detail}` : ''}</span>
            {gh.state !== 'ok' && gh.state !== 'checking' && (
              <button type="button" className="btn gh-check__recheck" onClick={runCheck}>{t.recheck}</button>
            )}
          </div>
          {gh.state === 'unauthed' && <p className="gh-check__hint">{t.ghUnauthedHint}</p>}
          {gh.state === 'missing' && <p className="gh-check__hint">{t.ghMissingHint}</p>}
        </div>

        <button className="btn btn--primary onboarding__start" type="button"
          disabled={!ready}
          onClick={() => onComplete({ workspaceDir: workspaceDir.trim(), githubCutoff, lang })}>
          {t.start}
        </button>
      </div>
    </div>
  );
}
