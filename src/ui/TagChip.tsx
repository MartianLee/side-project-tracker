export function TagChip({ topic, onClick, active }: { topic: string; onClick?: () => void; active?: boolean }) {
  const cls = ['tag', onClick ? 'is-clickable' : '', active ? 'is-on' : ''].filter(Boolean).join(' ');
  return (
    <span className={cls} onClick={onClick}>
      #{topic}
    </span>
  );
}
