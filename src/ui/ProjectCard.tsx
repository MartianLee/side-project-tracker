import { Project } from '../domain/types';
import { StageBadge } from './StageBadge';
import { LaunchBadge } from './LaunchBadge';
import { FunTypeChip } from './FunTypeChip';
import { TagChip } from './TagChip';

export function ProjectCard({ project, dimmed, onClick }: { project: Project; dimmed: boolean; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick} style={{ opacity: dimmed ? 0.28 : 1 }}>
      <div className="card__head">
        <span className="card__title">{project.pinned ? '📌 ' : ''}{project.name}</span>
        <span className="card__badges">
          <StageBadge stage={project.stage} />
          <LaunchBadge launched={project.launched} />
        </span>
      </div>
      <div className="card__chips">
        {project.funType.map((ft) => <FunTypeChip key={ft} funType={ft} />)}
        {project.topics.map((t) => <TagChip key={t} topic={t} />)}
      </div>
      <div className="card__meta">
        <span className={`dot dot--${project.activity}`} />
        {project.daysSinceActivity}일 전{project.branch ? <span className="card__branch"> · {project.branch}</span> : ''}
      </div>
      {project.memo && <div className="card__memo">{project.memo}</div>}
      {project.nextAction && <div className="card__next">→ {project.nextAction}</div>}
    </div>
  );
}
