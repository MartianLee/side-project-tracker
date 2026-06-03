import { useState } from 'react';
import { ManualEntry, STAGES, FUN_TYPES, FunType } from '../domain/types';
import { useLang } from '../i18n';

export function CardEditor({
  name, entry, onSave, onClose,
}: {
  name: string;
  entry: ManualEntry;
  onSave: (name: string, entry: ManualEntry) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const [draft, setDraft] = useState<ManualEntry>(entry);

  function toggleFun(ft: FunType) {
    setDraft((d) => ({
      ...d,
      funType: d.funType.includes(ft) ? d.funType.filter((x) => x !== ft) : [...d.funType, ft],
    }));
  }

  return (
    <div className="editor">
      <label>{t.stageLabel}
        <select aria-label={t.stageLabel} value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as ManualEntry['stage'] })}>
          {STAGES.map((s) => <option key={s} value={s}>{t.stage[s]}</option>)}
        </select>
      </label>

      <div className="editor__funs">
        {FUN_TYPES.map((ft) => (
          <button
            key={ft}
            type="button"
            className={`seg${draft.funType.includes(ft) ? ' is-on' : ''}`}
            onClick={() => toggleFun(ft)}
          >
            {t.funLabel[ft]}
          </button>
        ))}
      </div>

      <label>{t.topicsLabel}
        <input aria-label={t.topicsAria} type="text" value={draft.topics.join(', ')}
          onChange={(e) => setDraft({ ...draft, topics: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
      </label>

      <label>{t.memoLabel}
        <input aria-label={t.memoLabel} type="text" value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })} />
      </label>

      <label>{t.nextActionLabel}
        <input aria-label={t.nextActionLabel} type="text" value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} />
      </label>

      <label className="row">
        <input type="checkbox" checked={!!draft.launched}
          onChange={(e) => setDraft({ ...draft, launched: e.target.checked ? { date: new Date().toISOString().slice(0, 10) } : null })} />
        {t.launchedCheckbox}
      </label>
      {draft.launched && (
        <label>{t.launchUrlAria}
          <input aria-label={t.launchUrlAria} type="text" value={draft.launched.url ?? ''}
            onChange={(e) => setDraft({ ...draft, launched: { ...draft.launched, url: e.target.value } })} />
        </label>
      )}

      <label className="row"><input type="checkbox" checked={draft.pinned} onChange={(e) => setDraft({ ...draft, pinned: e.target.checked })} /> {t.pin}</label>
      <label className="row"><input type="checkbox" checked={draft.hidden} onChange={(e) => setDraft({ ...draft, hidden: e.target.checked })} /> {t.hide}</label>

      <div className="editor__actions">
        <button type="button" className="btn btn--primary" onClick={() => onSave(name, draft)}>{t.save}</button>
        <button type="button" className="btn" onClick={onClose}>{t.close}</button>
      </div>
    </div>
  );
}
