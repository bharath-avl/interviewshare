import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyLogo, getCompanyLogoFallback } from '../data/companies';
import { OUTCOMES } from '../data/tags';
import DifficultyMeter from './DifficultyMeter';
import TagChip from './TagChip';
import { useStore } from '../data/store';
import './InterviewCard.css';

export default function InterviewCard({ interview }) {
  const [logoError, setLogoError] = useState(false);
  const state = useStore();
  const voteCount = state.votes[interview.id] || 0;
  const commentCount = (state.comments[interview.id] || []).length;

  const outcomeClass = interview.outcome === 'Offered' ? 'success'
    : interview.outcome === 'Rejected' ? 'error'
    : interview.outcome === 'Ghosted' ? 'warning'
    : 'neutral';

  const relativeDate = getRelativeDate(interview.createdAt);

  return (
    <Link to={`/interview/${interview.id}`} className="interview-card" id={`interview-${interview.id}`}>
      <div className="interview-card-votes">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 3l5 7H3l5-7z" fill="currentColor"/>
        </svg>
        <span>{voteCount}</span>
      </div>

      <div className="interview-card-logo">
        {!logoError ? (
          <img
            src={getCompanyLogo(interview.companyDomain, 64)}
            alt=""
            onError={() => setLogoError(true)}
            loading="lazy"
          />
        ) : (
          <span className="interview-card-fallback">
            {getCompanyLogoFallback(interview.companyName)}
          </span>
        )}
      </div>

      <div className="interview-card-content">
        <div className="interview-card-header">
          <span className="interview-card-company">{interview.companyName}</span>
          <span className="interview-card-dot">·</span>
          <span className="interview-card-role">{interview.role}</span>
          {interview.seniority && (
            <>
              <span className="interview-card-dot">·</span>
              <span className="interview-card-seniority">{interview.seniority}</span>
            </>
          )}
        </div>

        <div className="interview-card-meta">
          <DifficultyMeter value={interview.difficulty} size="sm" />
          <span className={`interview-card-outcome ${outcomeClass}`}>
            {interview.outcome}
          </span>
          <span className="interview-card-date">{relativeDate}</span>
        </div>

        {interview.tips && (
          <p className="interview-card-tips">{interview.tips}</p>
        )}

        <div className="interview-card-footer">
          <div className="interview-card-tags">
            {(interview.tags || []).slice(0, 4).map(tag => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          <div className="interview-card-stats">
            <span className="interview-card-stat">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 14V5a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5l-3 2z" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getRelativeDate(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
