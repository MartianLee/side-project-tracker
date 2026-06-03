import { Stage } from '../domain/types';
import { useLang } from '../i18n';

export function StageBadge({ stage }: { stage: Stage }) {
  const { t } = useLang();
  return <span className={`stage stage--${stage}`}>{t.stage[stage]}</span>;
}
