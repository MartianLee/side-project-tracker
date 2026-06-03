import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodBar } from '../../src/ui/MoodBar';

const baseProps = {
  filter: { funTypes: [], topics: [], showHidden: false },
  allTopics: ['게임', '시각화'],
  lastSyncAt: '2026-06-01T00:00:00Z',
  offline: false,
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
});
