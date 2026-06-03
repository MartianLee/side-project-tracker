import { Launched } from '../domain/types';

export function LaunchBadge({ launched }: { launched: Launched | null }) {
  if (!launched) return null;
  const title = [launched.date, launched.url].filter(Boolean).join(' · ');
  return (
    <span className="launch" title={title}>
      🚀 출시됨
    </span>
  );
}
