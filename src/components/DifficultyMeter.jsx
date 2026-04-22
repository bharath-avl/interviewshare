import './DifficultyMeter.css';
import { DIFFICULTY_LABELS } from '../data/tags';

export default function DifficultyMeter({ value, size = 'md' }) {
  const segments = [1, 2, 3, 4, 5];

  return (
    <div
      className={`difficulty-meter difficulty-meter--${size}`}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={1}
      aria-valuemax={5}
      aria-label={`Difficulty: ${value} out of 5 — ${DIFFICULTY_LABELS[value] || ''}`}
      title={`${DIFFICULTY_LABELS[value] || ''} (${value}/5)`}
    >
      <div className="difficulty-segments">
        {segments.map(s => (
          <span
            key={s}
            className={`difficulty-segment ${s <= value ? 'active' : ''}`}
            data-level={s}
          />
        ))}
      </div>
      {size !== 'sm' && (
        <span className="difficulty-label">{DIFFICULTY_LABELS[value]}</span>
      )}
    </div>
  );
}
