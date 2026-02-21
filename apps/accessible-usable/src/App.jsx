import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

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

// Componentes
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Componente inicial para manejar la redirección de tokens
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userStr); 
        // Forzar recarga para limpiar URL y asegurar que AuthProvider lea el storage fresco
        window.location.href = '/dashboard';
      } catch (e) {
        console.error('Error procesando token de redirección', e);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-mtg-bg-dark flex flex-col">
      <Navbar />
      <Routes>
        {/* Ruta protegida */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cards" element={<CardSearchPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/decks"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/deck/new"
          element={
            <PrivateRoute>
              <DeckBuilderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/decks/:id"
          element={
            <PrivateRoute>
              <DeckViewPage />
            </PrivateRoute>
          }
        />

        {/* Sitemap */}
        <Route path="/sitemap" element={<SitemapPage />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
