import './TagChip.css';

export default function TagChip({ tag, active, onClick, removable, onRemove }) {
  return (
    <span
      className={`tag-chip ${active ? 'active' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {tag}
      {removable && (
        <button
          className="tag-chip-remove"
          onClick={(e) => { e.stopPropagation(); onRemove?.(tag); }}
          aria-label={`Remove tag ${tag}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  );
}
