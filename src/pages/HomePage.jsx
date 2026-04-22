import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore, getCompaniesWithInterviews, searchInterviews } from '../data/store';
import { COMPANIES } from '../data/companies';
import { PREDEFINED_TAGS } from '../data/tags';
import CompanyCard from '../components/CompanyCard';
import InterviewCard from '../components/InterviewCard';
import SearchBar from '../components/SearchBar';
import TagChip from '../components/TagChip';
import './HomePage.css';

export default function HomePage() {
  const state = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({ tags: [], difficulty: null });

  const companiesWithData = useMemo(() => getCompaniesWithInterviews(state), [state]);

  const allInterviews = useMemo(() => {
    let results = searchInterviews(state, query);

    // Filter by tags
    if (filters.tags.length > 0) {
      results = results.filter(i =>
        filters.tags.some(t => (i.tags || []).includes(t))
      );
    }

    // Filter by difficulty
    if (filters.difficulty) {
      results = results.filter(i => i.difficulty === filters.difficulty);
    }

    return results;
  }, [state, query, filters]);


  // Companies to display: ones with interviews first, then fill with known companies
  const displayCompanies = useMemo(() => {
    if (companiesWithData.length > 0) return companiesWithData;
    return COMPANIES.slice(0, 12).map(c => ({
      ...c,
      count: 0,
      avgDifficulty: 0,
      tags: [],
    }));
  }, [companiesWithData]);

  const isSearching = !!(query || filters.tags.length || filters.difficulty);

  // --- Reusable section blocks ---

  const companiesSection = (
    <section className="home-section animate-fade-up stagger-3" id="home-companies">
      <div className="home-section-header">
        <h2>
          {companiesWithData.length > 0 ? 'Trending Companies' : 'Top Companies'}
        </h2>
        {companiesWithData.length === 0 && (
          <span className="home-section-hint">
            Be the first to share an interview experience
          </span>
        )}
      </div>
      <div className="home-companies-grid">
        {displayCompanies.map(company => (
          <CompanyCard
            key={company.slug}
            company={company}
            onClick={() => navigate(`/company/${company.slug}`)}
          />
        ))}
      </div>
    </section>
  );

  const interviewsSection = (
    <section className="home-section animate-fade-up stagger-4" id="home-interviews">
      <div className="home-section-header">
        <h2>
          {isSearching
            ? `Results (${allInterviews.length})`
            : 'Recent Interviews'}
        </h2>
      </div>

      {allInterviews.length > 0 ? (
        <div className="home-interviews-list">
          {allInterviews.map((interview, i) => (
            <div key={interview.id} className={`animate-fade-up stagger-${Math.min(i + 1, 8)}`}>
              <InterviewCard interview={interview} />
            </div>
          ))}
        </div>
      ) : (
        <div className="home-empty-state" id="home-empty">
          <div className="home-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 18h20M14 24h14M14 30h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="home-empty-title">No interviews yet</h3>
          <p className="home-empty-text">
            {query
              ? `No results for "${query}". Try a different search or clear filters.`
              : 'This is where interview experiences show up. Be the first to share yours and help fellow students prepare.'}
          </p>
          {!query && (
            <button
              className="home-empty-cta"
              onClick={() => navigate('/submit')}
              id="home-submit-cta"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Share Your First Experience
            </button>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero animate-fade-up" id="home-hero">
        <h1 className="home-hero-title">
          Real interviews.<br />
          <span className="home-hero-accent">Real experiences.</span>
        </h1>
        <p className="home-hero-subtitle">
          Browse interview experiences shared by students at top companies.
          No fluff, no corporate spin — just honest accounts from your peers.
        </p>
        <div className="home-hero-search">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </section>

      {/* Quick tags — only when not searching */}
      {!isSearching && (
        <section className="home-section home-tags-section animate-fade-up stagger-2">
          <div className="home-tags-cloud">
            {PREDEFINED_TAGS.slice(0, 10).map(tag => (
              <TagChip
                key={tag}
                tag={tag}
                onClick={() => setFilters(f => ({ ...f, tags: [tag] }))}
              />
            ))}
          </div>
        </section>
      )}

      {/* When searching: Results first, then Companies */}
      {/* When browsing: Companies first, then Recent Interviews */}
      {isSearching ? (
        <>
          {interviewsSection}
          {companiesSection}
        </>
      ) : (
        <>
          {companiesSection}
          {interviewsSection}
        </>
      )}
    </div>
  );
}
