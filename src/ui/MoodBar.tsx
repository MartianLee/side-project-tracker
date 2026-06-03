import { MoodFilter, SortMode, SORT_LABELS } from '../domain/filter';
import { FUN_TYPES, FunType } from '../domain/types';
import { TagChip } from './TagChip';

const SORT_MODES: SortMode[] = ['recent', 'launched', 'neglect'];

const FUN_LABEL: Record<FunType, string> = {
  '신규창작': '🆕 신규창작', '업그레이드': '⬆️ 업그레이드', '실험': '🧪 실험', '마무리': '🏁 마무리',
};

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
  function toggleFun(ft: FunType) {
    onChange({
      ...filter,
      funTypes: filter.funTypes.includes(ft) ? filter.funTypes.filter((x) => x !== ft) : [...filter.funTypes, ft],
    });
  }
  function toggleTopic(t: string) {
    onChange({
      ...filter,
      topics: filter.topics.includes(t) ? filter.topics.filter((x) => x !== t) : [...filter.topics, t],
    });
  }

  return (
    <div className="toolbar">
      <span className="toolbar__label">지금 기분</span>
      {FUN_TYPES.map((ft) => (
        <button
          key={ft}
          type="button"
          className={`seg${filter.funTypes.includes(ft) ? ' is-on' : ''}`}
          onClick={() => toggleFun(ft)}
        >
          {FUN_LABEL[ft]}
        </button>
      ))}
      {allTopics.length > 0 && <span className="toolbar__label" style={{ marginLeft: 4 }}>주제</span>}
      {allTopics.map((t) => (
        <TagChip key={t} topic={t} active={filter.topics.includes(t)} onClick={() => toggleTopic(t)} />
      ))}
      <select
        className="sort-select toolbar__spacer"
        aria-label="정렬"
        value={sortMode}
        onChange={(e) => onSortChange(e.target.value as SortMode)}
      >
        {SORT_MODES.map((m) => <option key={m} value={m}>{SORT_LABELS[m]}</option>)}
      </select>
      <button type="button" className="btn btn--primary" onClick={onDice}>
        🎲 아무거나
      </button>
      <button type="button" className="btn" onClick={onSync}>
        🔄 동기화
      </button>
      <span className={`sync-status${offline ? ' is-offline' : ''}`}>
        {offline ? '오프라인' : `최근: ${new Date(lastSyncAt).toLocaleString()}`}
      </span>
    </div>
  );
}
