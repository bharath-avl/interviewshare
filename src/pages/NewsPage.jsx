import { useState, useEffect, useCallback } from 'react';
import './NewsPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All News', icon: '📰' },
  { id: 'hiring', label: 'Hiring', icon: '💼' },
  { id: 'layoffs', label: 'Layoffs', icon: '📉' },
  { id: 'funding', label: 'Funding', icon: '💰' },
  { id: 'acquisition', label: 'Acquisitions', icon: '🤝' },
  { id: 'market', label: 'Market', icon: '📊' },
  { id: 'general', label: 'General', icon: '🔗' },
];

const CATEGORY_COLORS = {
  hiring: { bg: 'oklch(25% 0.04 145)', color: 'oklch(72% 0.16 145)' },
  layoffs: { bg: 'oklch(20% 0.04 25)', color: 'oklch(65% 0.2 25)' },
  funding: { bg: 'oklch(22% 0.04 85)', color: 'oklch(78% 0.15 85)' },
  acquisition: { bg: 'oklch(22% 0.04 280)', color: 'oklch(72% 0.14 280)' },
  market: { bg: 'oklch(22% 0.04 230)', color: 'oklch(72% 0.12 230)' },
  general: { bg: 'var(--surface-3)', color: 'var(--text-secondary)' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/news?category=${category}${forceRefresh ? '&refresh=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news.');
      }

      setArticles(data.articles || []);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews(true);
  };

  return (
    <div className="news-page">
      <div className="news-inner">
        {/* Header */}
        <header className="news-header animate-fade-up">
          <div className="news-header-left">
            <div className="news-header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <h1 className="news-title">Tech News</h1>
              <p className="news-subtitle">
                Latest hiring, layoffs, and major events from top tech companies
              </p>
            </div>
          </div>
          <div className="news-header-actions">
            {lastUpdated && (
              <span className="news-updated">
                Updated {timeAgo(lastUpdated)}
              </span>
            )}
            <button className="news-refresh-btn" onClick={handleRefresh} disabled={loading} id="news-refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                className={loading ? 'news-refresh-spin' : ''}>
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
        </header>

        {/* Category Filter */}
        <nav className="news-categories animate-fade-up stagger-1" id="news-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`news-cat-btn ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
              id={`news-cat-${cat.id}`}
            >
              <span className="news-cat-icon">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        {loading ? (
          <div className="news-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`news-skeleton-card animate-fade-up stagger-${Math.min(i + 2, 8)}`}>
                <div className="news-skeleton-badge"></div>
                <div className="news-skeleton-title"></div>
                <div className="news-skeleton-desc"></div>
                <div className="news-skeleton-desc short"></div>
                <div className="news-skeleton-meta"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="news-error animate-fade-up">
            <div className="news-error-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M24 14v12M24 30v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Couldn't load news</h3>
            <p>{error}</p>
            <button className="news-error-retry" onClick={() => fetchNews(true)}>
              Try Again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="news-empty animate-fade-up">
            <div className="news-empty-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="8" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M14 18h20M14 24h14M14 30h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>No news found</h3>
            <p>No articles found for this category. Try switching to "All News" or refresh.</p>
          </div>
        ) : (
          <div className="news-grid">
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`news-card animate-fade-up stagger-${Math.min(i + 2, 8)}`}
                id={`news-article-${i}`}
              >
                {article.imageUrl && (
                  <div className="news-card-image">
                    <img 
                      src={article.imageUrl} 
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div className="news-card-body">
                  <div className="news-card-top">
                    <span 
                      className="news-card-category"
                      style={{
                        background: CATEGORY_COLORS[article.category]?.bg || CATEGORY_COLORS.general.bg,
                        color: CATEGORY_COLORS[article.category]?.color || CATEGORY_COLORS.general.color,
                      }}
                    >
                      {article.category}
                    </span>
                    {article.companies?.length > 0 && (
                      <div className="news-card-companies">
                        {article.companies.slice(0, 3).map(c => (
                          <span key={c} className="news-card-company">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="news-card-title">{article.title}</h3>
                  
                  {article.description && (
                    <p className="news-card-desc">
                      {article.description.length > 180 
                        ? article.description.slice(0, 180) + '…' 
                        : article.description}
                    </p>
                  )}

                  <div className="news-card-footer">
                    <span className="news-card-source">{article.source}</span>
                    <span className="news-card-time">{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>

                <div className="news-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H5M12 4v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
