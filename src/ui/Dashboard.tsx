import { useMemo, useState } from 'react';
import { Project, ManualEntry } from '../domain/types';
import { MoodFilter, SortMode, matchesFilter, visibleProjects, sortProjects, pickRandom } from '../domain/filter';
import { MoodBar } from './MoodBar';
import { ProjectCard } from './ProjectCard';
import { CardEditor } from './CardEditor';
import { SettingsModal } from './SettingsModal';

export function Dashboard({
  projects, lastSyncAt, offline, onSync, onSaveManual,
}: {
  projects: Project[];
  lastSyncAt: string;
  offline: boolean;
  onSync: () => Promise<void>;
  onSaveManual: (name: string, entry: ManualEntry) => Promise<void>;
}) {
  const [filter, setFilter] = useState<MoodFilter>({ funTypes: [], topics: [], showHidden: false });
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [editing, setEditing] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allTopics = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.topics))).sort(),
    [projects],
  );

  const shown = useMemo(
    () => sortProjects(visibleProjects(projects, filter), sortMode),
    [projects, filter, sortMode],
  );

  function handleDice() {
    const candidates = shown.filter((p) => matchesFilter(p, filter));
    const picked = pickRandom(candidates);
    setHighlighted(picked ? picked.name : null);
  }

  function entryOf(p: Project): ManualEntry {
    return {
      stage: p.stage, launched: p.launched, funType: p.funType, topics: p.topics,
      memo: p.memo, nextAction: p.nextAction, pinned: p.pinned, hidden: p.hidden,
    };
  }

  return (
    <div className="app">
      <MoodBar
        filter={filter}
        allTopics={allTopics}
        sortMode={sortMode}
        lastSyncAt={lastSyncAt}
        offline={offline}
        onChange={setFilter}
        onSortChange={setSortMode}
        onSync={() => { void onSync(); }}
        onDice={handleDice}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="grid">
        {shown.map((p) => (
          <div
            key={p.name}
            data-card
            className={`card-wrap${highlighted === p.name ? ' is-picked' : ''}`}
            style={{ opacity: !matchesFilter(p, filter) ? 0.28 : 1 }}
          >
            <ProjectCard project={p} dimmed={false} onClick={() => setEditing(p.name)} />
            {editing === p.name && (
              <CardEditor
                name={p.name}
                entry={entryOf(p)}
                onSave={async (name, entry) => { await onSaveManual(name, entry); setEditing(null); }}
                onClose={() => setEditing(null)}
              />
            )}
          </div>
        ))}
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
