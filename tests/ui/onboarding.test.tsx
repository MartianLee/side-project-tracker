import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from '../../src/ui/Onboarding';

describe('Onboarding', () => {
  it('submits edited settings', () => {
    const onComplete = vi.fn();
    render(<Onboarding defaultWorkspaceDir="/Users/you/workspace" defaultCutoff="2025-06-01" onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText('워크스페이스 폴더'), { target: { value: '/Users/you/dev' } });
    fireEvent.click(screen.getByText('시작하기'));
    expect(onComplete).toHaveBeenCalledWith({ workspaceDir: '/Users/you/dev', githubCutoff: '2025-06-01' });
  });
});
