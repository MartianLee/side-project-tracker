import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../../src/ui/Dashboard';
import { Project, DEFAULT_MANUAL } from '../../src/domain/types';

function proj(name: string, over: Partial<Project> = {}): Project {
  return {
    name, repoUrl: '', private: false, language: null, description: null,
    lastPushAt: '2026-06-01T00:00:00Z', ...DEFAULT_MANUAL,
    activity: 'active', daysSinceActivity: 0, ...over,
  };
}

const projects = [
  proj('new-game', { funType: ['신규창작'], topics: ['게임'] }),
  proj('upgrade-app', { funType: ['업그레이드'], topics: ['웹'] }),
];

describe('Dashboard', () => {
  it('renders all projects initially', () => {
    render(<Dashboard projects={projects} lastSyncAt="2026-06-01T00:00:00Z" offline={false} onSync={async () => {}} onSaveManual={async () => {}} />);
    expect(screen.getByText('new-game')).toBeInTheDocument();
    expect(screen.getByText('upgrade-app')).toBeInTheDocument();
  });

  it('dims non-matching cards when a funType filter is active', () => {
    render(<Dashboard projects={projects} lastSyncAt="2026-06-01T00:00:00Z" offline={false} onSync={async () => {}} onSaveManual={async () => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /신규창작/ }));
    const upgradeCard = screen.getByText('upgrade-app').closest('div[data-card]') as HTMLElement;
    expect(upgradeCard.style.opacity).toBe('0.28');
  });
});
