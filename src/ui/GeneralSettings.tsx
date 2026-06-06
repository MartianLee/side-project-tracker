import { useLang, LANGS, LANG_LABEL } from '../i18n';

/** The "General" settings panel — currently just the UI language toggle. */
export function GeneralSettings() {
  const { t, lang, setLang } = useLang();

  return (
    <div className="settings-pane">
      <div className="settings-field">
        <span className="settings-field__label">{t.language}</span>
        <span className="lang-toggle" aria-label={t.language}>
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`seg${lang === l ? ' is-on' : ''}`}
              onClick={() => setLang(l)}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}
