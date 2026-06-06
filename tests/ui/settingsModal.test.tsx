import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../src/i18n';
import { GeneralSettings } from '../../src/ui/GeneralSettings';

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
