import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';
import InterviewDetailPage from './pages/InterviewDetailPage';
import SubmitPage from './pages/SubmitPage';
import './App.css';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" key={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/company/:slug" element={<CompanyPage />} />
          <Route path="/interview/:id" element={<InterviewDetailPage />} />
          <Route path="/submit" element={<SubmitPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
