import { MoodFilter, SortMode } from '../domain/filter';
import { FUN_TYPES, FunType } from '../domain/types';
import { useLang, LANGS, LANG_LABEL } from '../i18n';
import { TagChip } from './TagChip';

const SORT_MODES: SortMode[] = ['recent', 'launched', 'neglect'];

export function MoodBar({
  filter, allTopics, sortMode, lastSyncAt, offline, onChange, onSortChange, onSync, onDice,
}: {
  filter: MoodFilter;
  allTopics: string[];
  sortMode: SortMode;
  lastSyncAt: string;
  offline: boolean;
  onChange: (f: MoodFilter) => void;
  onSortChange: (m: SortMode) => void;
  onSync: () => void;
  onDice: () => void;
}) {
  const { t, lang, setLang } = useLang();

  function toggleFun(ft: FunType) {
    onChange({
      ...filter,
      funTypes: filter.funTypes.includes(ft) ? filter.funTypes.filter((x) => x !== ft) : [...filter.funTypes, ft],
    });
  }
  function toggleTopic(tp: string) {
    onChange({
      ...filter,
      topics: filter.topics.includes(tp) ? filter.topics.filter((x) => x !== tp) : [...filter.topics, tp],
    });
  }

  return (
    <div className="toolbar">
      <span className="toolbar__label">{t.moodLabel}</span>
      {FUN_TYPES.map((ft) => (
        <button
          key={ft}
          type="button"
          className={`seg${filter.funTypes.includes(ft) ? ' is-on' : ''}`}
          onClick={() => toggleFun(ft)}
        >
          {t.funLabel[ft]}
        </button>
      ))}
      {allTopics.length > 0 && <span className="toolbar__label" style={{ marginLeft: 4 }}>{t.topicLabel}</span>}
      {allTopics.map((tp) => (
        <TagChip key={tp} topic={tp} active={filter.topics.includes(tp)} onClick={() => toggleTopic(tp)} />
      ))}

      <select
        className="sort-select toolbar__spacer"
        aria-label="정렬"
        value={sortMode}
        onChange={(e) => onSortChange(e.target.value as SortMode)}
      >
        {SORT_MODES.map((m) => <option key={m} value={m}>{t.sort[m]}</option>)}
      </select>
      <button type="button" className="btn btn--primary" onClick={onDice}>{t.dice}</button>
      <button type="button" className="btn" onClick={onSync}>{t.sync}</button>
      <span className={`sync-status${offline ? ' is-offline' : ''}`}>
        {offline ? t.offline : t.lastSync(new Date(lastSyncAt).toLocaleString())}
      </span>
      <span className="lang-toggle" aria-label={t.language}>
        {LANGS.map((l) => (
          <button key={l} type="button" className={`seg${lang === l ? ' is-on' : ''}`} onClick={() => setLang(l)}>
            {LANG_LABEL[l]}
          </button>
        ))}
      </span>
    </div>
  );
}
