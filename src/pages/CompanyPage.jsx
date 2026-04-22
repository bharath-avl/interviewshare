import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore, getInterviewsByCompany } from '../data/store';
import { getCompanyBySlug, getCompanyLogo, getCompanyLogoFallback } from '../data/companies';
import InterviewCard from '../components/InterviewCard';
import StatBar from '../components/StatBar';
import './CompanyPage.css';

export default function CompanyPage() {
  const { slug } = useParams();
  const state = useStore();
  const navigate = useNavigate();

  const company = getCompanyBySlug(slug);
  const interviews = useMemo(() => getInterviewsByCompany(state, slug), [state, slug]);

  const [sort, setSort] = useState('recent'); // 'recent' | 'popular'
  const [logoError, setLogoError] = useState(false);

  const sorted = useMemo(() => {
    if (sort === 'popular') {
      return [...interviews].sort((a, b) =>
        (state.votes[b.id] || 0) - (state.votes[a.id] || 0)
      );
    }
    return [...interviews].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [interviews, sort, state.votes]);

  // Determine company name for display (from data or from interviews)
  const companyName = company?.name || (interviews[0]?.companyName || slug);
  const companyDomain = company?.domain || (interviews[0]?.companyDomain || '');

  return (
    <div className="company-page">
      <div className="company-page-inner">
        {/* Back */}
        <Link to="/" className="company-back" id="company-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All Companies
        </Link>

        {/* Header */}
        <header className="company-header animate-fade-up" id="company-header">
          <div className="company-logo-large">
            {companyDomain && !logoError ? (
              <img
                src={getCompanyLogo(companyDomain, 128)}
                alt={`${companyName} logo`}
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="company-logo-fallback">
                {getCompanyLogoFallback(companyName)}
              </span>
            )}
          </div>
          <div className="company-header-info">
            <h1>{companyName}</h1>
            {companyDomain && (
              <a
                href={`https://${companyDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="company-website"
              >
                {companyDomain}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3h7v7M13 3L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
            <span className="company-interview-count">
              {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        </header>

        {/* Stats */}
        {interviews.length > 0 && (
          <div className="animate-fade-up stagger-2">
            <StatBar interviews={interviews} />
          </div>
        )}

        {/* Sort + List */}
        <section className="company-interviews-section animate-fade-up stagger-3">
          {interviews.length > 0 && (
            <div className="company-sort-row">
              <h2>Interviews</h2>
              <div className="company-sort-btns">
                <button
                  className={`company-sort-btn ${sort === 'recent' ? 'active' : ''}`}
                  onClick={() => setSort('recent')}
                >
                  Recent
                </button>
                <button
                  className={`company-sort-btn ${sort === 'popular' ? 'active' : ''}`}
                  onClick={() => setSort('popular')}
                >
                  Popular
                </button>
              </div>
            </div>
          )}

          {sorted.length > 0 ? (
            <div className="company-interviews-list">
              {sorted.map((interview, i) => (
                <div key={interview.id} className={`animate-fade-up stagger-${Math.min(i + 1, 8)}`}>
                  <InterviewCard interview={interview} />
                </div>
              ))}
            </div>
          ) : (
            <div className="company-empty" id="company-empty">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M14 18h20M14 24h14M14 30h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h3>No interviews for {companyName} yet</h3>
              <p>Be the first to share your interview experience at {companyName}.</p>
              <button
                className="company-empty-cta"
                onClick={() => navigate('/submit')}
              >
                Share Experience
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
