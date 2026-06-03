import { FunType } from '../domain/types';

const EMOJI: Record<FunType, string> = {
  '신규창작': '🆕',
  '업그레이드': '⬆️',
  '실험': '🧪',
  '마무리': '🏁',
};

export function FunTypeChip({ funType }: { funType: FunType }) {
  return (
    <span className={`fun fun--${funType}`}>
      {EMOJI[funType]} {funType}
    </span>
  );
}
