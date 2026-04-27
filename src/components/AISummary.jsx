import { useState, useCallback } from 'react';
import './AISummary.css';

export default function AISummary({ interview }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  // Build the full content text from interview data
  const getInterviewContent = useCallback(() => {
    const parts = [];
    if (interview.tips) parts.push(interview.tips);
    if (interview.questions?.length) {
      parts.push('Questions asked: ' + interview.questions.join('. '));
    }
    if (interview.outcome) parts.push('Outcome: ' + interview.outcome);
    if (interview.difficulty) parts.push('Difficulty: ' + interview.difficulty + '/5');
    if (interview.seniority) parts.push('Level: ' + interview.seniority);
    return parts.join('\n\n');
  }, [interview]);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const content = getInterviewContent();
      if (content.trim().length < 20) {
        setError('Not enough content to summarize.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          companyName: interview.companyName,
          role: interview.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary.');
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown to HTML (bold, bullets, headings)
  const renderMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/### (.*)/g, '<h4>$1</h4>')
      .replace(/## (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- (.*)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '<br/>')
      .replace(/\n/g, ' ');
  };

  return (
    <div className="ai-summary" id="ai-summary-panel">
      <div className="ai-summary-header" onClick={() => summary && setExpanded(!expanded)}>
        <div className="ai-summary-title-row">
          <div className="ai-summary-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="ai-summary-title">AI Summary</span>
          <span className="ai-summary-badge">Gemini</span>
        </div>
        {summary && (
          <button className="ai-summary-toggle" aria-label={expanded ? 'Collapse' : 'Expand'}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" 
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {!summary && !loading && !error && (
        <div className="ai-summary-empty">
          <p className="ai-summary-desc">
            Get an AI-powered summary of this interview experience — key questions, tips, and what to expect.
          </p>
          <button 
            className="ai-summary-generate" 
            onClick={generateSummary}
            id="ai-generate-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" 
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Generate Summary
          </button>
        </div>
      )}

      {loading && (
        <div className="ai-summary-loading">
          <div className="ai-summary-spinner">
            <div className="ai-spinner-ring"></div>
            <div className="ai-spinner-ring"></div>
            <div className="ai-spinner-ring"></div>
          </div>
          <span className="ai-summary-loading-text">Analyzing interview...</span>
          <div className="ai-summary-skeleton">
            <div className="ai-skeleton-line ai-skeleton-line--lg"></div>
            <div className="ai-skeleton-line ai-skeleton-line--md"></div>
            <div className="ai-skeleton-line ai-skeleton-line--sm"></div>
            <div className="ai-skeleton-line ai-skeleton-line--lg"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="ai-summary-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>{error}</span>
          <button className="ai-summary-retry" onClick={generateSummary}>Retry</button>
        </div>
      )}

      {summary && expanded && (
        <div className="ai-summary-content animate-fade-in">
          <div 
            className="ai-summary-text"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
          />
          <div className="ai-summary-footer">
            <span className="ai-summary-disclaimer">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              AI-generated · May not be 100% accurate
            </span>
            <button className="ai-summary-regen" onClick={generateSummary} title="Regenerate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
