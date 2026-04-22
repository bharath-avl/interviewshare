import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M9 10h10M9 14h7M9 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            InterviewShare
          </Link>
          <p className="footer-tagline">
            Real interview experiences shared by students, for students.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Platform</h4>
          <Link to="/" className="footer-link">Browse Interviews</Link>
          <Link to="/submit" className="footer-link">Share Experience</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Info</h4>
          <span className="footer-link-static">Built by students</span>
          <span className="footer-link-static">Open source</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">
          © {new Date().getFullYear()} InterviewShare — No corporate nonsense.
        </span>
      </div>
    </footer>
  );
}
