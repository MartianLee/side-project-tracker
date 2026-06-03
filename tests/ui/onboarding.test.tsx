import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Onboarding } from '../../src/ui/Onboarding';

const okAuth = async () => ({ state: 'ok' as const, detail: 'octocat' });
const noAuth = async () => ({ state: 'unauthed' as const, detail: '' });

describe('Onboarding', () => {
  it('submits edited settings once gh is authenticated', async () => {
    const onComplete = vi.fn();
    render(<Onboarding defaultWorkspaceDir="/Users/you/workspace" defaultCutoff="2025-06-01" onComplete={onComplete} checkAuth={okAuth} />);
    await waitFor(() => expect(screen.getByText('시작하기')).not.toBeDisabled());
    fireEvent.change(screen.getByLabelText('워크스페이스 폴더'), { target: { value: '/Users/you/dev' } });
    fireEvent.click(screen.getByText('시작하기'));
    expect(onComplete).toHaveBeenCalledWith({ workspaceDir: '/Users/you/dev', githubCutoff: '2025-06-01' });
  });

  it('blocks start as a prerequisite until gh is ready', async () => {
    const onComplete = vi.fn();
    render(<Onboarding defaultWorkspaceDir="/Users/you/workspace" defaultCutoff="2025-06-01" onComplete={onComplete} checkAuth={noAuth} />);
    await screen.findByText(/로그인이 필요/);
    expect(screen.getByText('시작하기')).toBeDisabled();
    fireEvent.click(screen.getByText('시작하기'));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
