import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="nav-home">
          <svg className="navbar-logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M9 10h10M9 14h7M9 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="navbar-logo-text">InterviewShare</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link" id="nav-browse">Browse</Link>
          <Link to="/submit" className="navbar-link" id="nav-submit-link">Submit</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/submit" className="navbar-cta" id="nav-submit-cta">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Share Experience
          </Link>
        </div>
      </div>
    </nav>
  );
}

