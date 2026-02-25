import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import DeckViewPage from './pages/DeckViewPage';
import CardSearchPage from './pages/CardSearchPage';
import InventoryPage from './pages/InventoryPage';
import SitemapPage from './pages/SitemapPage';
import AboutPage from './pages/AboutPage';
import VisualStudiesPage from './pages/VisualStudiesPage';

// Componentes
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import BreadcrumbsNav from './components/BreadcrumbsNav';
import {
  FLOW_SUFFIXES,
  applyFlowSuffix,
  getFlowSuffixFromPath,
  resolveFlowHomePath
} from './utils/versionRouting';
import { getFlowModeFromPath, FLOW_MODES } from './utils/flowMode';

const ROUTE_SUFFIXES = [
  FLOW_SUFFIXES.accessible,
  FLOW_SUFFIXES['no-usable'],
  FLOW_SUFFIXES['no-accesible']
];

// Componente inicial para manejar la redirección de tokens
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = getFlowModeFromPath(location.pathname);
    const body = document.body;
    body.classList.remove('flow-accessible', 'flow-no-accesible', 'flow-no-usable');

    if (mode === FLOW_MODES.NO_ACCESSIBLE) {
      body.classList.add('flow-no-accesible');
    } else if (mode === FLOW_MODES.NO_USABLE) {
      body.classList.add('flow-no-usable');
    } else {
      body.classList.add('flow-accessible');
    }

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      if (mode === FLOW_MODES.NO_ACCESSIBLE) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      } else {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    }

    const applyNoAccessibleA11yBreaks = () => {
      if (mode !== FLOW_MODES.NO_ACCESSIBLE) return;
      document.querySelectorAll('[aria-live]').forEach((element) => element.removeAttribute('aria-live'));
      document.querySelectorAll('img[alt]').forEach((image) => image.setAttribute('alt', ''));
    };

    applyNoAccessibleA11yBreaks();

    const observer = new MutationObserver(() => {
      applyNoAccessibleA11yBreaks();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    const mode = getFlowModeFromPath(location.pathname);
    if (mode !== FLOW_MODES.NO_ACCESSIBLE) return undefined;

    const blockKeyboardNavigation = (event) => {
      const key = event.key;
      if (key === 'Tab') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', blockKeyboardNavigation, true);
    return () => window.removeEventListener('keydown', blockKeyboardNavigation, true);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userStr); 
        const flowSuffix = getFlowSuffixFromPath(location.pathname);
        navigate(resolveFlowHomePath(flowSuffix), { replace: true });
      } catch (e) {
        console.error('Error procesando token de redirección', e);
      }
    }
  }, [location, navigate]);

  const routesBySuffix = ROUTE_SUFFIXES.map((routeSuffix) => {
    const withSuffix = (path) => applyFlowSuffix(path, routeSuffix);

    return (
      <React.Fragment key={routeSuffix || 'accessible'}>
        <Route
          path={withSuffix('/home')}
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route path={withSuffix('/login')} element={<LoginPage />} />
        <Route path={withSuffix('/register')} element={<RegisterPage />} />
        <Route path={withSuffix('/cards')} element={<CardSearchPage />} />
        <Route path={withSuffix('/about')} element={<AboutPage />} />
        <Route path={withSuffix('/visual-studies')} element={<VisualStudiesPage />} />
        <Route path={withSuffix('/sitemap')} element={<SitemapPage />} />

        <Route
          path={withSuffix('/dashboard')}
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path={withSuffix('/decks')}
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path={withSuffix('/inventory')}
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path={withSuffix('/deck/new')}
          element={
            <PrivateRoute>
              <DeckBuilderPage />
            </PrivateRoute>
          }
        />
        <Route
          path={withSuffix('/decks/:id')}
          element={
            <PrivateRoute>
              <DeckViewPage />
            </PrivateRoute>
          }
        />
      </React.Fragment>
    );
  });

  return (
    <div className="min-vh-100 bg-mtg-dark d-flex flex-column">
      <Navbar />
      <BreadcrumbsNav />
      <Routes>
        {routesBySuffix}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="*"
          element={<Navigate to={resolveFlowHomePath(getFlowSuffixFromPath(location.pathname))} replace />}
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
