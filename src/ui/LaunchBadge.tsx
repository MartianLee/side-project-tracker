import { Launched } from '../domain/types';

export function LaunchBadge({ launched }: { launched: Launched | null }) {
  if (!launched) return null;
  const title = [launched.date, launched.url].filter(Boolean).join(' · ');
  return (
    <span title={title} style={{ background: '#16301f', color: '#3fb950', padding: '1px 7px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
      🚀 출시됨
    </span>
  );
}
