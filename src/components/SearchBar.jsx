import { useState, useRef, useEffect, useCallback } from 'react';
import { PREDEFINED_TAGS } from '../data/tags';
import { DIFFICULTY_LABELS } from '../data/tags';
import TagChip from './TagChip';
import './SearchBar.css';

export default function SearchBar({ query, onQueryChange, filters, onFiltersChange }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const inputRef = useRef(null);

  const debounceTimer = useRef(null);

  const handleInput = useCallback((e) => {
    const val = e.target.value;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onQueryChange(val);
    }, 200);
  }, [onQueryChange]);

  function toggleTag(tag) {
    const current = filters.tags || [];
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onFiltersChange({ ...filters, tags: next });
  }

  function setDifficulty(val) {
    onFiltersChange({
      ...filters,
      difficulty: filters.difficulty === val ? null : val,
    });
  }

  const activeFilterCount =
    (filters.tags?.length || 0) +
    (filters.difficulty ? 1 : 0);

  return (
    <div className="search-bar" id="search-bar">
      <div className="search-bar-input-wrap">
        <svg className="search-bar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-bar-input"
          placeholder="Search companies, roles, questions, tips..."
          defaultValue={query}
          onChange={handleInput}
          id="search-input"
        />
        <button
          className={`search-bar-filter-btn ${filtersOpen ? 'active' : ''}`}
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-label="Toggle filters"
          id="filter-toggle"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M5 9h8M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {activeFilterCount > 0 && (
            <span className="search-bar-filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <div className={`search-bar-filters ${filtersOpen ? 'open' : ''}`}>
        <div className="search-bar-filters-inner">
          <div className="search-bar-filter-section">
            <span className="search-bar-filter-label">Difficulty</span>
            <div className="search-bar-difficulty-row">
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  className={`search-bar-difficulty-btn ${filters.difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d} — {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          <div className="search-bar-filter-section">
            <span className="search-bar-filter-label">Tags</span>
            <div className="search-bar-tags-row">
              {PREDEFINED_TAGS.map(tag => (
                <TagChip
                  key={tag}
                  tag={tag}
                  active={(filters.tags || []).includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              className="search-bar-clear"
              onClick={() => onFiltersChange({ tags: [], difficulty: null })}
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
