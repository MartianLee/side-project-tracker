import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardEditor } from '../../src/ui/CardEditor';
import { DEFAULT_MANUAL } from '../../src/domain/types';

describe('CardEditor', () => {
  it('edits memo and saves the updated entry', () => {
    const onSave = vi.fn();
    render(<CardEditor name="algo-visual" entry={{ ...DEFAULT_MANUAL }} onSave={onSave} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('메모'), { target: { value: '새 메모' } });
    fireEvent.click(screen.getByText('저장'));
    expect(onSave).toHaveBeenCalledWith('algo-visual', expect.objectContaining({ memo: '새 메모' }));
  });

  it('toggles a funType', () => {
    const onSave = vi.fn();
    render(<CardEditor name="x" entry={{ ...DEFAULT_MANUAL }} onSave={onSave} onClose={() => {}} />);
    fireEvent.click(screen.getByText('🆕 신규창작'));
    fireEvent.click(screen.getByText('저장'));
    expect(onSave).toHaveBeenCalledWith('x', expect.objectContaining({ funType: ['신규창작'] }));
  });

  it('changes stage', () => {
    const onSave = vi.fn();
    render(<CardEditor name="x" entry={{ ...DEFAULT_MANUAL }} onSave={onSave} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('단계'), { target: { value: '다듬기' } });
    fireEvent.click(screen.getByText('저장'));
    expect(onSave).toHaveBeenCalledWith('x', expect.objectContaining({ stage: '다듬기' }));
  });
});
