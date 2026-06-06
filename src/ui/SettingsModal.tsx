import { ComponentType, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { GeneralSettings } from './GeneralSettings';

interface Section {
  id: string;
  name: string;
  icon: string;
  Panel: ComponentType;
}

/** App-wide settings modal: left nav + right panel. Starts with a "General" section. */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const sections: Section[] = [
    { id: 'general', name: t.settingsGeneral, icon: '⚙️', Panel: GeneralSettings },
  ];
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find((s) => s.id === active) ?? sections[0];
  const Panel = current.Panel;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Move focus into the dialog on open; restore it to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
    return () => opener?.focus();
  }, []);

  return (
    <div
      className="settings-overlay"
      data-testid="settings-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="settings-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        tabIndex={-1}
      >
        <nav className="settings-nav">
          <div className="settings-nav__title" id="settings-modal-title">{t.settingsTitle}</div>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`settings-nav-item${s.id === active ? ' active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="settings-nav-icon" aria-hidden="true">{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </nav>
        <section className="settings-body">
          <Panel />
        </section>
      </div>
    </div>
  );
}
