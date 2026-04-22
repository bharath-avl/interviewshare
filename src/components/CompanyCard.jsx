import { useState } from 'react';
import { getCompanyLogo, getCompanyLogoFallback } from '../data/companies';
import './CompanyCard.css';

export default function CompanyCard({ company, onClick }) {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getCompanyLogo(company.domain);

  return (
    <button className="company-card" onClick={onClick} id={`company-${company.slug}`}>
      <div className="company-card-logo">
        {!logoError ? (
          <img
            src={logoUrl}
            alt={`${company.name} logo`}
            onError={() => setLogoError(true)}
            loading="lazy"
          />
        ) : (
          <span className="company-card-fallback">
            {getCompanyLogoFallback(company.name)}
          </span>
        )}
      </div>
      <div className="company-card-info">
        <h3 className="company-card-name">{company.name}</h3>
        {company.count !== undefined && (
          <span className="company-card-count">
            {company.count} interview{company.count !== 1 ? 's' : ''}
          </span>
        )}
        {company.avgDifficulty > 0 && (
          <span className="company-card-difficulty">
            Avg difficulty: {company.avgDifficulty}/5
          </span>
        )}
      </div>
      {company.tags && company.tags.length > 0 && (
        <div className="company-card-tags">
          {company.tags.slice(0, 3).map(tag => (
            <span key={tag} className="company-card-tag">{tag}</span>
          ))}
        </div>
      )}
      <svg className="company-card-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
