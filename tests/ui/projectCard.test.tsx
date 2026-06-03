import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../../src/ui/ProjectCard';
import { Project } from '../../src/domain/types';

function proj(over: Partial<Project> = {}): Project {
  return {
    name: 'algo-visual', repoUrl: '', private: true, language: 'TypeScript', description: '정렬 시각화',
    lastPushAt: '2026-05-31T00:00:00Z', lastCommitAt: '2026-05-31T00:00:00Z', branch: 'main',
    stage: '개발중', launched: null, funType: ['업그레이드'], topics: ['시각화'],
    memo: '한 줄 메모', nextAction: 'cocktail sort 개선', pinned: false, hidden: false,
    activity: 'active', daysSinceActivity: 1, ...over,
  };
}

describe('ProjectCard', () => {
  it('renders name, memo, next action, days', () => {
    render(<ProjectCard project={proj()} dimmed={false} onClick={() => {}} />);
    expect(screen.getByText('algo-visual')).toBeInTheDocument();
    expect(screen.getByText('한 줄 메모')).toBeInTheDocument();
    expect(screen.getByText(/cocktail sort 개선/)).toBeInTheDocument();
    expect(screen.getByText(/1일 전/)).toBeInTheDocument();
  });
  it('applies dim style when dimmed', () => {
    const { container } = render(<ProjectCard project={proj()} dimmed onClick={() => {}} />);
    expect((container.firstChild as HTMLElement).style.opacity).toBe('0.28');
  });
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={proj()} dimmed={false} onClick={onClick} />);
    fireEvent.click(screen.getByText('algo-visual'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
