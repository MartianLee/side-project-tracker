import { useState } from 'react';
import { ManualEntry, STAGES, FUN_TYPES, FunType } from '../domain/types';

const FUN_LABEL: Record<FunType, string> = {
  '신규창작': '🆕 신규창작', '업그레이드': '⬆️ 업그레이드', '실험': '🧪 실험', '마무리': '🏁 마무리',
};

export function CardEditor({
  name, entry, onSave, onClose,
}: {
  name: string;
  entry: ManualEntry;
  onSave: (name: string, entry: ManualEntry) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ManualEntry>(entry);

  function toggleFun(ft: FunType) {
    setDraft((d) => ({
      ...d,
      funType: d.funType.includes(ft) ? d.funType.filter((x) => x !== ft) : [...d.funType, ft],
    }));
  }

  return (
    <div className="editor">
      <label>단계
        <select aria-label="단계" value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as ManualEntry['stage'] })}>
          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
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
            {FUN_LABEL[ft]}
          </button>
        ))}
      </div>

      <label>주제(쉼표 구분)
        <input aria-label="주제" type="text" value={draft.topics.join(', ')}
          onChange={(e) => setDraft({ ...draft, topics: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
      </label>

      <label>메모
        <input aria-label="메모" type="text" value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })} />
      </label>

      <label>다음 액션
        <input aria-label="다음 액션" type="text" value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} />
      </label>

      <label className="row">
        <input type="checkbox" checked={!!draft.launched}
          onChange={(e) => setDraft({ ...draft, launched: e.target.checked ? { date: new Date().toISOString().slice(0, 10) } : null })} />
        출시됨
      </label>
      {draft.launched && (
        <label>출시 URL
          <input aria-label="출시 URL" type="text" value={draft.launched.url ?? ''}
            onChange={(e) => setDraft({ ...draft, launched: { ...draft.launched, url: e.target.value } })} />
        </label>
      )}

      <label className="row"><input type="checkbox" checked={draft.pinned} onChange={(e) => setDraft({ ...draft, pinned: e.target.checked })} /> 핀</label>
      <label className="row"><input type="checkbox" checked={draft.hidden} onChange={(e) => setDraft({ ...draft, hidden: e.target.checked })} /> 숨김</label>

      <div className="editor__actions">
        <button type="button" className="btn btn--primary" onClick={() => onSave(name, draft)}>저장</button>
        <button type="button" className="btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
