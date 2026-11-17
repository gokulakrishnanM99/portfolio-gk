import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Resume from './pages/Resume';
import Certificates from './pages/Certificates';
import { WorksLayout, BlogsGallery, QuotesGallery, DesignsGallery } from './pages/Works';

/** Site root without the trailing slash (/portfolio-gk). Plain path URLs, no #. */
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');
const ROOT = import.meta.env.BASE_URL; // '/portfolio-gk/'

/** The classic site lives behind ?classic=true: keep the flag on every address so reloads and shared links
 *  come back here (without it, /portfolio-gk/… opens the holographic portfolio). */
const KeepClassicFlag: React.FC = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // the home route reads /portfolio-gk; keep the trailing slash so a reload finds the site root
    if (window.location.pathname === BASENAME) {
      window.history.replaceState(window.history.state, '', `${ROOT}${window.location.search || '?classic=true'}${window.location.hash}`);
    }
    const q = new URLSearchParams(loc.search);
    if (q.get('classic') === 'true') return;
    q.set('classic', 'true');
    navigate({ pathname: loc.pathname, search: `?${q.toString()}`, hash: loc.hash }, { replace: true });
  }, [loc.pathname, loc.search, loc.hash, navigate]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router basename={BASENAME}>
      <KeepClassicFlag />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-200 transition-colors duration-300">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/certificates" element={<Certificates />} />

            <Route path="/works" element={<WorksLayout />}>
              <Route path="blogs" element={<BlogsGallery />} />
              <Route path="quotes" element={<QuotesGallery />} />
              <Route path="designs" element={<DesignsGallery />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
