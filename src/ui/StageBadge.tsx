import { Stage } from '../domain/types';

export function StageBadge({ stage }: { stage: Stage }) {
  return <span className={`stage stage--${stage}`}>{stage}</span>;
}
