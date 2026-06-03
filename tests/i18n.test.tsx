import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { detectLang, LangProvider, DICTS } from '../src/i18n';
import { StageBadge } from '../src/ui/StageBadge';

describe('detectLang', () => {
  it('detects en for the default jsdom locale', () => {
    expect(detectLang()).toBe('en');
  });
  it('detects ko when navigator.language is Korean', () => {
    const orig = navigator.language;
    Object.defineProperty(navigator, 'language', { value: 'ko-KR', configurable: true });
    expect(detectLang()).toBe('ko');
    Object.defineProperty(navigator, 'language', { value: orig, configurable: true });
  });
});

describe('dictionaries', () => {
  it('translate stage display labels per language', () => {
    expect(DICTS.ko.stage['개발중']).toBe('개발중');
    expect(DICTS.en.stage['개발중']).toBe('Building');
  });
});

describe('LangProvider', () => {
  it('renders a stage label in English when lang=en', () => {
    render(<LangProvider lang="en" setLang={() => {}}><StageBadge stage="다듬기" /></LangProvider>);
    expect(screen.getByText('Polishing')).toBeInTheDocument();
  });
  it('renders a stage label in Korean when lang=ko', () => {
    render(<LangProvider lang="ko" setLang={() => {}}><StageBadge stage="다듬기" /></LangProvider>);
    expect(screen.getByText('다듬기')).toBeInTheDocument();
  });
});
