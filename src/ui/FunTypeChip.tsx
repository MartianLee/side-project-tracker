import { FunType } from '../domain/types';

const META: Record<FunType, { emoji: string; color: string }> = {
  '신규창작': { emoji: '🆕', color: '#3fb950' },
  '업그레이드': { emoji: '⬆️', color: '#58a6ff' },
  '실험': { emoji: '🧪', color: '#e3a008' },
  '마무리': { emoji: '🏁', color: '#bc8cff' },
};

export function FunTypeChip({ funType }: { funType: FunType }) {
  const m = META[funType];
  return (
    <span style={{ color: m.color, fontSize: 11, fontWeight: 600, marginRight: 4 }}>
      {m.emoji} {funType}
    </span>
  );
}
