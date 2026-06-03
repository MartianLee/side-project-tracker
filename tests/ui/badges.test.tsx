import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StageBadge } from '../../src/ui/StageBadge';
import { LaunchBadge } from '../../src/ui/LaunchBadge';
import { FunTypeChip } from '../../src/ui/FunTypeChip';

describe('badges', () => {
  it('StageBadge shows stage text', () => {
    render(<StageBadge stage="다듬기" />);
    expect(screen.getByText('다듬기')).toBeInTheDocument();
  });
  it('LaunchBadge renders only when launched', () => {
    const { container, rerender } = render(<LaunchBadge launched={null} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<LaunchBadge launched={{ url: 'https://x.com' }} />);
    expect(screen.getByText(/출시됨/)).toBeInTheDocument();
  });
  it('FunTypeChip shows emoji + label', () => {
    render(<FunTypeChip funType="신규창작" />);
    expect(screen.getByText(/신규창작/)).toBeInTheDocument();
  });
});
