export function TagChip({ topic, onClick, active }: { topic: string; onClick?: () => void; active?: boolean }) {
  return (
    <span
      onClick={onClick}
      style={{
        color: active ? '#fff' : '#8b949e',
        background: active ? '#1f6feb' : 'transparent',
        border: '1px solid #30363d',
        borderRadius: 5, padding: '2px 8px', fontSize: 11, marginRight: 4,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      #{topic}
    </span>
  );
}
