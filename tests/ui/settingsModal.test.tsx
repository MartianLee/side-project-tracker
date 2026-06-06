import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import type { Lang } from '../../src/domain/types';
import { LangProvider } from '../../src/i18n';
import { GeneralSettings } from '../../src/ui/GeneralSettings';
import { SettingsModal } from '../../src/ui/SettingsModal';

describe('GeneralSettings', () => {
  it('renders the language label and EN/한국어 buttons', () => {
    render(
      <LangProvider lang="en" setLang={() => {}}>
        <GeneralSettings />
      </LangProvider>,
    );
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '한국어' })).toBeInTheDocument();
  });

  it('calls setLang when a language button is clicked', () => {
    const setLang = vi.fn();
    render(
      <LangProvider lang="en" setLang={setLang}>
        <GeneralSettings />
      </LangProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '한국어' }));
    expect(setLang).toHaveBeenCalledWith('ko');
  });
});

describe('SettingsModal', () => {
  function renderModal(onClose = () => {}) {
    return render(
      <LangProvider lang="en" setLang={() => {}}>
        <SettingsModal onClose={onClose} />
      </LangProvider>,
    );
  }

  it('renders the overlay, title and General nav item', () => {
    renderModal();
    expect(screen.getByTestId('settings-overlay')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the overlay backdrop is clicked', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByTestId('settings-overlay'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does NOT call onClose when clicking inside the modal', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByText('General'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('switches language live from inside the modal', () => {
    function Harness() {
      const [lang, setLang] = useState<Lang>('en');
      return (
        <LangProvider lang={lang} setLang={setLang}>
          <SettingsModal onClose={() => {}} />
        </LangProvider>
      );
    }
    render(<Harness />);
    expect(screen.getByText('General')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '한국어' }));
    expect(screen.getByText('일반')).toBeInTheDocument(); // General -> 일반
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByText('General')).toBeInTheDocument();
  });
});
