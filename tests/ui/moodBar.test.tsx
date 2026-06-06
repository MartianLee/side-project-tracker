import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodBar } from '../../src/ui/MoodBar';

const baseProps = {
  filter: { funTypes: [], topics: [], showHidden: false },
  allTopics: ['게임', '시각화'],
  sortMode: 'recent' as const,
  lastSyncAt: '2026-06-01T00:00:00Z',
  offline: false,
  onSortChange: () => {},
  onOpenSettings: () => {},
};

describe('MoodBar', () => {
  it('toggles a funType in the filter', () => {
    const onChange = vi.fn();
    render(<MoodBar {...baseProps} onChange={onChange} onSync={() => {}} onDice={() => {}} />);
    fireEvent.click(screen.getByText(/신규창작/));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ funTypes: ['신규창작'] }));
  });
  it('fires onDice', () => {
    const onDice = vi.fn();
    render(<MoodBar {...baseProps} onChange={() => {}} onSync={() => {}} onDice={onDice} />);
    fireEvent.click(screen.getByText(/아무거나/));
    expect(onDice).toHaveBeenCalledOnce();
  });
  it('fires onSync', () => {
    const onSync = vi.fn();
    render(<MoodBar {...baseProps} onChange={() => {}} onSync={onSync} onDice={() => {}} />);
    fireEvent.click(screen.getByText(/동기화/));
    expect(onSync).toHaveBeenCalledOnce();
  });
  it('changes sort mode', () => {
    const onSortChange = vi.fn();
    render(<MoodBar {...baseProps} onSortChange={onSortChange} onChange={() => {}} onSync={() => {}} onDice={() => {}} />);
    fireEvent.change(screen.getByLabelText('정렬'), { target: { value: 'launched' } });
    expect(onSortChange).toHaveBeenCalledWith('launched');
  });
  it('fires onOpenSettings when the gear button is clicked', () => {
    const onOpenSettings = vi.fn();
    render(<MoodBar {...baseProps} onOpenSettings={onOpenSettings} onChange={() => {}} onSync={() => {}} onDice={() => {}} />);
    // Default (no provider) context is Korean, so the gear's aria-label is '설정'.
    fireEvent.click(screen.getByLabelText('설정'));
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
});
