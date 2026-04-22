import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPANIES } from '../data/companies';
import { PREDEFINED_TAGS, SENIORITY_LEVELS, OUTCOMES } from '../data/tags';
import { useDispatch } from '../data/store';
import DifficultyMeter from './DifficultyMeter';
import TagChip from './TagChip';
import './SubmitForm.css';

const STEPS = ['Company', 'Details', 'Experience', 'Review'];

const LOCATIONS = [
  // India — Metros
  'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune', 'Kolkata',
  'Gurgaon', 'Noida', 'Ahmedabad', 'Kochi', 'Chandigarh', 'Jaipur', 'Thiruvananthapuram',
  'Indore', 'Coimbatore', 'Lucknow', 'Nagpur', 'Bhopal', 'Visakhapatnam', 'Mysore',
  'Mangalore', 'Vadodara', 'Surat', 'Bhubaneswar',
  // International
  'Remote', 'San Francisco', 'New York', 'Seattle', 'Austin', 'London', 'Berlin',
  'Singapore', 'Tokyo', 'Dublin', 'Toronto', 'Sydney', 'Amsterdam', 'Boston',
  'Los Angeles', 'Chicago', 'Denver', 'Atlanta', 'San Jose', 'Zurich', 'Paris',
  'Dubai', 'Hong Kong',
];

export default function SubmitForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    companySlug: '',
    companyName: '',
    companyDomain: '',
    role: '',
    seniority: '',
    location: '',
    interviewDate: '',
    difficulty: 3,
    outcome: '',
    questions: [''],
    tips: '',
    tags: [],
    anonymous: true,
  });

  const [errors, setErrors] = useState({});

  const [companySearch, setCompanySearch] = useState('');
  const [locationFocused, setLocationFocused] = useState(false);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return COMPANIES;
    const q = companySearch.toLowerCase();
    return COMPANIES.filter(c => c.name.toLowerCase().includes(q));
  }, [companySearch]);

  const filteredLocations = useMemo(() => {
    if (!form.location.trim()) return [];
    const q = form.location.toLowerCase();
    return LOCATIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 8);
  }, [form.location]);

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  }

  function selectCompany(company) {
    setForm(prev => ({
      ...prev,
      companySlug: company.slug,
      companyName: company.name,
      companyDomain: company.domain,
    }));
    setErrors(prev => ({ ...prev, companyName: null }));
  }

  function addQuestion() {
    setForm(prev => ({ ...prev, questions: [...prev.questions, ''] }));
  }

  function updateQuestion(idx, val) {
    setForm(prev => {
      const q = [...prev.questions];
      q[idx] = val;
      return { ...prev, questions: q };
    });
  }

  function removeQuestion(idx) {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  }

  function toggleTag(tag) {
    setForm(prev => {
      const next = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: next };
    });
  }

  function validateStep(s) {
    const errs = {};
    if (s === 0) {
      if (!form.companyName.trim()) errs.companyName = 'Select or enter a company';
    }
    if (s === 1) {
      if (!form.role.trim()) errs.role = 'Role is required';
      if (!form.outcome) errs.outcome = 'Select an outcome';
    }
    if (s === 2) {
      const nonEmpty = form.questions.filter(q => q.trim());
      if (nonEmpty.length === 0) errs.questions = 'Add at least one question';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  }

  function prevStep() {
    setStep(Math.max(0, step - 1));
  }

  function handleSubmit() {
    if (!validateStep(2)) return;

    const payload = {
      ...form,
      questions: form.questions.filter(q => q.trim()),
    };

    // If custom company entered without selecting from list
    if (!payload.companySlug && payload.companyName) {
      payload.companySlug = payload.companyName.toLowerCase().replace(/\s+/g, '-');
    }

    dispatch({ type: 'ADD_INTERVIEW', payload });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="submit-success animate-fade-up" id="submit-success">
        <div className="submit-success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 33l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>Experience Shared!</h2>
        <p>Thanks for contributing to the community. Your interview experience is now live.</p>
        <div className="submit-success-actions">
          <button onClick={() => navigate('/')} className="submit-success-btn primary">
            Browse Interviews
          </button>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm({
            companySlug: '', companyName: '', companyDomain: '', role: '', seniority: '',
            location: '', interviewDate: '', difficulty: 3, outcome: '', questions: [''],
            tips: '', tags: [], anonymous: true,
          }); }} className="submit-success-btn secondary">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-form" id="submit-form">
      {/* Progress */}
      <div className="submit-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`submit-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="submit-step-num">{i < step ? '✓' : i + 1}</span>
            <span className="submit-step-label">{label}</span>
          </div>
        ))}
        <div className="submit-steps-bar">
          <div className="submit-steps-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Step 0: Company */}
      {step === 0 && (
        <div className="submit-step-content animate-fade-up">
          <h3 className="submit-step-title">Which company?</h3>
          <input
            type="text"
            className={`submit-input ${errors.companyName ? 'error' : ''}`}
            placeholder="Search or type company name..."
            value={companySearch}
            onChange={(e) => {
              setCompanySearch(e.target.value);
              setField('companyName', e.target.value);
              setField('companySlug', '');
              setField('companyDomain', '');
            }}
            id="company-search"
          />
          {errors.companyName && <span className="submit-error">{errors.companyName}</span>}

          <div className="submit-company-grid">
            {filteredCompanies.map(c => (
              <button
                key={c.slug}
                className={`submit-company-option ${form.companySlug === c.slug ? 'selected' : ''}`}
                onClick={() => { selectCompany(c); setCompanySearch(c.name); }}
                type="button"
              >
                <img
                  src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=64`}
                  alt=""
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="submit-company-logo"
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="submit-step-content animate-fade-up">
          <h3 className="submit-step-title">Interview details</h3>

          <div className="submit-field">
            <label className="submit-label">Role *</label>
            <input
              type="text"
              className={`submit-input ${errors.role ? 'error' : ''}`}
              placeholder="e.g. Software Engineer"
              value={form.role}
              onChange={(e) => setField('role', e.target.value)}
              id="role-input"
            />
            {errors.role && <span className="submit-error">{errors.role}</span>}
          </div>

          <div className="submit-row">
            <div className="submit-field">
              <label className="submit-label">Seniority</label>
              <select
                className="submit-select"
                value={form.seniority}
                onChange={(e) => setField('seniority', e.target.value)}
                id="seniority-select"
              >
                <option value="">Select...</option>
                {SENIORITY_LEVELS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="submit-field submit-field-location">
              <label className="submit-label">Location</label>
              <input
                type="text"
                className="submit-input"
                placeholder="e.g. Hyderabad, Remote"
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                onFocus={() => setLocationFocused(true)}
                onBlur={() => setTimeout(() => setLocationFocused(false), 200)}
                id="location-input"
                autoComplete="off"
              />
              {locationFocused && filteredLocations.length > 0 && (
                <div className="submit-location-suggestions" id="location-suggestions">
                  {filteredLocations.map(loc => (
                    <button
                      key={loc}
                      className="submit-location-option"
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setField('location', loc);
                        setLocationFocused(false);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2a5 5 0 015 5c0 3.5-5 7-5 7S3 10.5 3 7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3"/>
                        <circle cx="8" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="submit-row">
            <div className="submit-field">
              <label className="submit-label">Interview Date</label>
              <input
                type="date"
                className="submit-input"
                value={form.interviewDate}
                onChange={(e) => setField('interviewDate', e.target.value)}
                id="date-input"
              />
            </div>

            <div className="submit-field">
              <label className="submit-label">Outcome *</label>
              <select
                className={`submit-select ${errors.outcome ? 'error' : ''}`}
                value={form.outcome}
                onChange={(e) => setField('outcome', e.target.value)}
                id="outcome-select"
              >
                <option value="">Select...</option>
                {OUTCOMES.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.outcome && <span className="submit-error">{errors.outcome}</span>}
            </div>
          </div>

          <div className="submit-field">
            <label className="submit-label">Difficulty</label>
            <div className="submit-difficulty-picker">
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  type="button"
                  className={`submit-difficulty-btn ${form.difficulty === d ? 'active' : ''}`}
                  onClick={() => setField('difficulty', d)}
                >
                  {d}
                </button>
              ))}
              <DifficultyMeter value={form.difficulty} size="md" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Experience */}
      {step === 2 && (
        <div className="submit-step-content animate-fade-up">
          <h3 className="submit-step-title">Your experience</h3>

          <div className="submit-field">
            <label className="submit-label">Questions asked *</label>
            {form.questions.map((q, i) => (
              <div key={i} className="submit-question-row">
                <span className="submit-question-num">{i + 1}</span>
                <input
                  type="text"
                  className={`submit-input ${errors.questions && i === 0 && !q.trim() ? 'error' : ''}`}
                  placeholder="Describe the question..."
                  value={q}
                  onChange={(e) => updateQuestion(i, e.target.value)}
                />
                {form.questions.length > 1 && (
                  <button type="button" className="submit-question-remove" onClick={() => removeQuestion(i)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {errors.questions && <span className="submit-error">{errors.questions}</span>}
            <button type="button" className="submit-add-question" onClick={addQuestion}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add question
            </button>
          </div>

          <div className="submit-field">
            <label className="submit-label">Tips & advice</label>
            <textarea
              className="submit-textarea"
              placeholder="What would you tell someone preparing for this interview?"
              value={form.tips}
              onChange={(e) => setField('tips', e.target.value)}
              rows={3}
              id="tips-input"
            />
          </div>

          <div className="submit-field">
            <label className="submit-label">Tags</label>
            <div className="submit-tags-grid">
              {PREDEFINED_TAGS.map(tag => (
                <TagChip
                  key={tag}
                  tag={tag}
                  active={form.tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="submit-step-content animate-fade-up">
          <h3 className="submit-step-title">Review your submission</h3>

          <div className="submit-review">
            <div className="submit-review-row">
              <span className="submit-review-label">Company</span>
              <span className="submit-review-value">{form.companyName}</span>
            </div>
            <div className="submit-review-row">
              <span className="submit-review-label">Role</span>
              <span className="submit-review-value">{form.role}</span>
            </div>
            {form.seniority && (
              <div className="submit-review-row">
                <span className="submit-review-label">Seniority</span>
                <span className="submit-review-value">{form.seniority}</span>
              </div>
            )}
            {form.location && (
              <div className="submit-review-row">
                <span className="submit-review-label">Location</span>
                <span className="submit-review-value">{form.location}</span>
              </div>
            )}
            <div className="submit-review-row">
              <span className="submit-review-label">Difficulty</span>
              <DifficultyMeter value={form.difficulty} size="sm" />
            </div>
            <div className="submit-review-row">
              <span className="submit-review-label">Outcome</span>
              <span className="submit-review-value">{form.outcome}</span>
            </div>
            <div className="submit-review-row">
              <span className="submit-review-label">Questions</span>
              <span className="submit-review-value">{form.questions.filter(q => q.trim()).length} question(s)</span>
            </div>
            {form.tips && (
              <div className="submit-review-row">
                <span className="submit-review-label">Tips</span>
                <span className="submit-review-value submit-review-tips">{form.tips}</span>
              </div>
            )}
            {form.tags.length > 0 && (
              <div className="submit-review-row">
                <span className="submit-review-label">Tags</span>
                <div className="submit-review-tags">
                  {form.tags.map(t => <TagChip key={t} tag={t} />)}
                </div>
              </div>
            )}
          </div>

          <label className="submit-anon-toggle">
            <input
              type="checkbox"
              checked={form.anonymous}
              onChange={(e) => setField('anonymous', e.target.checked)}
            />
            <span>Post anonymously</span>
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="submit-nav">
        {step > 0 && (
          <button type="button" className="submit-nav-btn secondary" onClick={prevStep}>
            Back
          </button>
        )}
        <div className="submit-nav-spacer" />
        {step < STEPS.length - 1 ? (
          <button type="button" className="submit-nav-btn primary" onClick={nextStep}>
            Continue
          </button>
        ) : (
          <button type="button" className="submit-nav-btn primary" onClick={handleSubmit}>
            Submit Experience
          </button>
        )}
      </div>
    </div>
  );
}
