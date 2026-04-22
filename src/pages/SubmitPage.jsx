import SubmitForm from '../components/SubmitForm';
import './SubmitPage.css';

export default function SubmitPage() {
  return (
    <div className="submit-page" id="submit-page">
      <div className="submit-page-inner">
        <header className="submit-page-header animate-fade-up">
          <h1>Share Your Experience</h1>
          <p>
            Help fellow students prepare by documenting your interview experience.
            All submissions are anonymous by default.
          </p>
        </header>
        <div className="animate-fade-up stagger-2">
          <SubmitForm />
        </div>
      </div>
    </div>
  );
}
