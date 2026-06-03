import { Stage } from '../domain/types';

const COLORS: Record<Stage, string> = {
  '아이디어': '#3b3b52',
  '개발중': '#1e4d3a',
  '다듬기': '#4d431e',
  '유지·운영': '#1e3a4d',
  '보류': '#3a3a3a',
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span style={{ background: COLORS[stage], color: '#fff', padding: '1px 7px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
      {stage}
    </span>
  );
}
