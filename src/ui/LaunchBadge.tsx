import { Launched } from '../domain/types';
import { useLang } from '../i18n';

export function LaunchBadge({ launched }: { launched: Launched | null }) {
  const { t } = useLang();
  if (!launched) return null;
  const title = [launched.date, launched.url].filter(Boolean).join(' · ');
  return (
    <span className="launch" title={title}>
      {t.launched}
    </span>
  );
}
