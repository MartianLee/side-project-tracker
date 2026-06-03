import { MoodFilter } from '../domain/filter';
import { FUN_TYPES, FunType } from '../domain/types';
import { TagChip } from './TagChip';

const FUN_LABEL: Record<FunType, string> = {
  '신규창작': '🆕 신규창작', '업그레이드': '⬆️ 업그레이드', '실험': '🧪 실험', '마무리': '🏁 마무리',
};

export function MoodBar({
  filter, allTopics, lastSyncAt, offline, onChange, onSync, onDice,
}: {
  filter: MoodFilter;
  allTopics: string[];
  lastSyncAt: string;
  offline: boolean;
  onChange: (f: MoodFilter) => void;
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: 11, background: '#0d1117', border: '1px solid #262d36', borderRadius: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 11, color: '#888' }}>지금 기분:</span>
      {FUN_TYPES.map((ft) => (
        <button key={ft} type="button" onClick={() => toggleFun(ft)}
          style={{ borderRadius: 14, padding: '3px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: filter.funTypes.includes(ft) ? '#1f6feb' : '#161b22',
            color: filter.funTypes.includes(ft) ? '#fff' : '#c9d1d9', border: '1px solid #30363d' }}>
          {FUN_LABEL[ft]}
        </button>
      ))}
      <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>주제:</span>
      {allTopics.map((t) => (
        <TagChip key={t} topic={t} active={filter.topics.includes(t)} onClick={() => toggleTopic(t)} />
      ))}
      <button type="button" onClick={onDice}
        style={{ marginLeft: 'auto', background: '#238636', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        🎲 아무거나
      </button>
      <button type="button" onClick={onSync}
        style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '5px 10px', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
        🔄 동기화
      </button>
      <span style={{ fontSize: 10, color: offline ? '#e5534b' : '#6e7681' }}>
        {offline ? '오프라인' : `최근: ${new Date(lastSyncAt).toLocaleString()}`}
      </span>
    </div>
  );
}
