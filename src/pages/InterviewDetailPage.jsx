import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, getInterviewById } from '../data/store';
import { getCompanyLogo, getCompanyLogoFallback } from '../data/companies';
import DifficultyMeter from '../components/DifficultyMeter';
import TagChip from '../components/TagChip';
import VoteButton from '../components/VoteButton';
import CommentSection from '../components/CommentSection';
import './InterviewDetailPage.css';

export default function InterviewDetailPage() {
  const { id } = useParams();
  const state = useStore();
  const interview = useMemo(() => getInterviewById(state, id), [state, id]);
  const [logoError, setLogoError] = useState(false);

  if (state.loading) {
    return (
      <div className="detail-not-found">
        <p style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="detail-not-found">
        <h2>Interview not found</h2>
        <p>This interview may have been removed or the link is incorrect.</p>
        <Link to="/" className="detail-not-found-link">← Back to home</Link>
      </div>
    );
  }

  const outcomeClass = interview.outcome === 'Offered' ? 'success'
    : interview.outcome === 'Rejected' ? 'error'
    : interview.outcome === 'Ghosted' ? 'warning'
    : 'neutral';

  const dateFormatted = interview.createdAt
    ? new Date(interview.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : '';

  return (
    <div className="detail-page">
      <div className="detail-inner">
        {/* Back */}
        <Link to="/" className="detail-back" id="detail-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <div className="detail-layout animate-fade-up">
          {/* Main content */}
          <article className="detail-main">
            {/* Header */}
            <header className="detail-header">
              <div className="detail-company-row">
                <div className="detail-logo">
                  {interview.companyDomain && !logoError ? (
                    <img
                      src={getCompanyLogo(interview.companyDomain, 96)}
                      alt=""
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span className="detail-logo-fallback">
                      {getCompanyLogoFallback(interview.companyName)}
                    </span>
                  )}
                </div>
                <div className="detail-header-info">
                  <Link
                    to={`/company/${interview.companySlug}`}
                    className="detail-company-name"
                  >
                    {interview.companyName}
                  </Link>
                  <h1 className="detail-role">{interview.role}</h1>
                  <div className="detail-meta-row">
                    {interview.seniority && (
                      <span className="detail-seniority">{interview.seniority}</span>
                    )}
                    {interview.location && (
                      <span className="detail-location">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2a5 5 0 015 5c0 3.5-5 7-5 7S3 10.5 3 7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="8" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        {interview.location}
                      </span>
                    )}
                    {dateFormatted && (
                      <span className="detail-date">{dateFormatted}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail-badges">
                <DifficultyMeter value={interview.difficulty} size="md" />
                <span className={`detail-outcome ${outcomeClass}`}>
                  {interview.outcome}
                </span>
              </div>
            </header>

            {/* Questions */}
            {interview.questions && interview.questions.length > 0 && (
              <section className="detail-section">
                <h2 className="detail-section-title">Questions Asked</h2>
                <ol className="detail-questions">
                  {interview.questions.map((q, i) => (
                    <li key={i} className="detail-question">{q}</li>
                  ))}
                </ol>
              </section>
            )}

            {/* Tips */}
            {interview.tips && (
              <section className="detail-section">
                <h2 className="detail-section-title">Tips & Advice</h2>
                <p className="detail-tips-text">{interview.tips}</p>
              </section>
            )}

            {/* Tags */}
            {interview.tags && interview.tags.length > 0 && (
              <div className="detail-tags-row">
                {interview.tags.map(tag => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            )}

            {/* Divider */}
            <hr className="detail-divider" />

            {/* Comments */}
            <CommentSection interviewId={interview.id} />
          </article>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="detail-sidebar-sticky">
              <VoteButton interviewId={interview.id} />

              <div className="detail-sidebar-info">
                <span className="detail-sidebar-label">Interview Date</span>
                <span className="detail-sidebar-value">
                  {interview.interviewDate || 'Not specified'}
                </span>
              </div>

              {interview.anonymous ? (
                <span className="detail-sidebar-anon">Anonymous submission</span>
              ) : interview.authorName ? (
                <div className="detail-sidebar-info">
                  <span className="detail-sidebar-label">Shared by</span>
                  <span className="detail-sidebar-value">{interview.authorName}</span>
                </div>
              ) : (
                <span className="detail-sidebar-anon">Anonymous submission</span>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
