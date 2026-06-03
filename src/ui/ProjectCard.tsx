import { Project } from '../domain/types';
import { StageBadge } from './StageBadge';
import { LaunchBadge } from './LaunchBadge';
import { FunTypeChip } from './FunTypeChip';
import { TagChip } from './TagChip';

const DOT: Record<Project['activity'], string> = { active: '#3fb950', warning: '#d6a526', stale: '#e5534b' };

export function ProjectCard({ project, dimmed, onClick }: { project: Project; dimmed: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#161b22', border: '1px solid #262d36', borderRadius: 8, padding: 11,
        opacity: dimmed ? 0.28 : 1, cursor: 'pointer',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <span>{project.pinned ? '📌 ' : ''}{project.name}</span>
        <span style={{ display: 'flex', gap: 4 }}>
          <StageBadge stage={project.stage} />
          <LaunchBadge launched={project.launched} />
        </span>
      </div>
      <div style={{ margin: '6px 0' }}>
        {project.funType.map((ft) => <FunTypeChip key={ft} funType={ft} />)}
        {project.topics.map((t) => <TagChip key={t} topic={t} />)}
      </div>
      <div style={{ fontSize: 11, color: '#8b949e' }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: DOT[project.activity], marginRight: 5 }} />
        {project.daysSinceActivity}일 전{project.branch ? ` · ${project.branch}` : ''}
      </div>
      {project.memo && <div style={{ color: '#8b949e', fontSize: 11, margin: '6px 0 4px' }}>{project.memo}</div>}
      {project.nextAction && <div style={{ color: '#58a6ff', fontSize: 11 }}>→ {project.nextAction}</div>}
    </div>
  );
}
